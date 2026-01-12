package parkflex.routes

import io.ktor.http.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import parkflex.db.*
import parkflex.models.*
import parkflex.*
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.time.format.DateTimeParseException


fun Route.reservationRoutes() {
    post {
        val context = "/api/reservation POST handler"

        // Parse req
        var request: CreateReservationRequest
        try {
            request = call.receive<CreateReservationRequest>()
        } catch (e: Exception) {
            call.respond(
                status = HttpStatusCode.BadRequest,
                message = ApiErrorModel("Nieprawidlowe dane", context)
            )
            return@post
        }

        val userId: Long = 2 // TODO: Add middleware for auth and get user ID
        val user: UserEntity? = runDB {
            UserEntity.findById(userId)
        }

        // Assert user is valid
        if (user == null) {
            call.respond(
                status = HttpStatusCode.Unauthorized,
                message = ApiErrorModel("Brak tokena lub token nieprawidlowy", context)
            )
            return@post
        }

        // Assert user is not blocked
        if (runDB { user.isBlocked() }) {
            call.respond(
                status = HttpStatusCode.Forbidden,
                message = ApiErrorModel("Banowany uzytkownik nie moze robic rezerwacji", context)
            )
            return@post
        }

        val currentReservation = runDB {
            ReservationEntity.find { ReservationTable.user eq user.id }.firstOrNull { !it.isPast() }
        }

        if (currentReservation != null) {
            val day = currentReservation.start.format(DateTimeFormatter.ISO_DATE)
            val timeFormatter = DateTimeFormatter.ofPattern("HH:MM")
            val startTime = currentReservation.start.format(timeFormatter)
            val endTime =
                currentReservation
                    .start
                    .plusMinutes(currentReservation.duration.toLong())
                    .format(timeFormatter)

            call.respond(
                status = HttpStatusCode.Conflict,
                message = ApiErrorModel(
                    "Użytkownik ma już aktywną rezerwację ($day: $startTime-$endTime)",
                    context
                )
            )

            return@post
        }


        val spot: SpotEntity? = runDB {
            SpotEntity.findById(request.spot_id)
        }
        
        // Assert spot exists
        if (spot == null) {
            call.respond(
                status = HttpStatusCode.NotFound,
                message = ApiErrorModel("Miejsce parkingowe nie istnieje", context)
            )
            return@post
        }

        if (spot.role != "normal") {
            call.respond(
                status = HttpStatusCode.BadRequest,
                message = ApiErrorModel(
                    "Rezerwacje można tworzyć tylko na miejsce typu 'normal' (otrzymano ${spot.role}",
                    context
                )
            )
            return@post
        }

        // Parse start time
        val startTime: LocalDateTime
        try {
            startTime = LocalDateTime.parse(request.start, DateTimeFormatter.ISO_DATE_TIME)
        } catch (e: DateTimeParseException) {
            call.respond(
                status = HttpStatusCode.BadRequest,
                message = ApiErrorModel("Nieprawidlowy format daty", context)
            )
            return@post
        }
        val endTime: LocalDateTime = startTime.plusMinutes(request.duration.toLong())
        

        // Check for reservation interval conflicts
        val breakDurationMinutes: Long = runDB {
            val param = ParameterEntity.find { 
                ParameterTable.key eq "reservation/break/duration"
            }.firstOrNull()

            return@runDB param?.value?.toLongOrNull() ?: 0L
        }

        val hasConflict: Boolean = runDB {
            ReservationEntity
                .find { ReservationTable.spot eq request.spot_id }
                .any { it.timeCollidesWith(breakDurationMinutes, startTime, endTime) }
        }

        if (hasConflict) {
            call.respond(
                status = HttpStatusCode.Conflict,
                message = ApiErrorModel("Miejsce zajete w tym czasie", context)
            )
            return@post
        }

        // Create the reservation
        val newReservation: ReservationEntity = runDB {
            ReservationEntity.new {
                this.start = startTime
                this.duration = request.duration
                this.spot = spot
                this.user = user
            }
        }

        // Prepare response
        val reservationResponse = ReservationResponse(
            id = newReservation.id.value,
            spot_id = request.spot_id,
            start = startTime.format(DateTimeFormatter.ISO_DATE_TIME),
            end = endTime.format(DateTimeFormatter.ISO_DATE_TIME)
        )

        call.respond(
            status = HttpStatusCode.OK,
            message = CreateReservationSuccessResponse(
                "Rezerwacja utworzona pomyslnie",
                reservationResponse
            )
        )
    }
}