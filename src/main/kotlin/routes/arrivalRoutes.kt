package parkflex.routes

import io.ktor.http.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import parkflex.db.ParameterEntity
import parkflex.db.ParameterTable
import parkflex.db.ReservationEntity
import parkflex.models.ApiErrorModel
import parkflex.models.NoPresentReservationModel
import parkflex.models.SuccessfulArrivalModel
import parkflex.models.TimeSpan
import parkflex.repository.ReservationRepository
import parkflex.runDB
import parkflex.service.TermService
import java.time.Duration
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import kotlin.math.abs

fun Route.arrivalRoutes() {
    post("{token}") {
        val uid = 2L // TODO: use principal after auth is ready

        val token = call.parameters["token"] ?: run {
            call.respond(
                status = HttpStatusCode.BadRequest,
                message = ApiErrorModel("No token provided", "POST /entry/{token}")
            )

            return@post
        }

        if (!TermService.entry.isCurrent(token)) {
            call.respond(
                status = HttpStatusCode.BadRequest,
                message = ApiErrorModel("Invalid reservation token token: $token", "POST /entry/{token}")
            )

            return@post
        }

        val now = LocalDateTime.now()

        // TODO Switch to ParameterRepository after `admin-view` is merged
        val padding =
            runDB { ParameterEntity.find { ParameterTable.key eq "reservation/break/duration" }.firstOrNull() }
                ?.value?.toLong()
                ?: run {
                    call.respond(
                        status = HttpStatusCode.InternalServerError,
                        message = ApiErrorModel(
                            "The \"reservation/break/duration\" parameter is malformed or does not exist",
                            "POST /api/enter/{token}"
                        )
                    )

                    return@post
                }

        // We allow an arrival during the reservation and a few minutes before
        // (the latter is controlled by a parameter)
        val reservation = runDB {
            ReservationEntity
                .all()
                .filter { it.user.id.value == uid }
                .filter { it.arrived == null && it.left == null }
                .filter {
                    // all before end and after padded start
                    val end = it.start.plusMinutes(it.duration.toLong())
                    val paddedStart = it.start.minusMinutes(padding)

                    now.isAfter(paddedStart) && now.isBefore(end)
                }
                .minByOrNull {
                    // get the one with the smallest delta to the current time
                    abs(Duration.between(now, it.start).toMinutes())
                }
        }


        if (reservation == null) {
            val today = now.toLocalDate()
            val reservationsForToday = runDB { ReservationRepository.forDate(today) }

            val timeTable = runDB {
                reservationsForToday
                    .groupBy { it.spot.id.value }
                    .mapValues { it.value.map { TimeSpan.fromReservation(it) } }
            }

            call.respond(
                status = HttpStatusCode.OK,
                message = NoPresentReservationModel(timeTable)
            )

        } else {
            val startTime = reservation.start.format(DateTimeFormatter.ofPattern("HH:mm"))
            val endTime = reservation.start.plusMinutes(reservation.duration.toLong())
                .format(DateTimeFormatter.ofPattern("HH:mm"))

            runDB { reservation.arrived = now }

            TermService.entry.generate()

            val spot = runDB { reservation.spot.id.value }

            call.respond(
                status = HttpStatusCode.OK,
                message = SuccessfulArrivalModel(startTime, endTime, spot)
            )
        }

    }
}