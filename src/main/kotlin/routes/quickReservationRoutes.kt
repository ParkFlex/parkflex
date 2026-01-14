package parkflex.routes

import io.ktor.http.HttpStatusCode
import io.ktor.server.response.*
import io.ktor.server.routing.*
import parkflex.db.ReservationEntity
import parkflex.db.UserEntity
import parkflex.models.ApiErrorModel
import parkflex.models.QuickReservationModel
import parkflex.repository.SpotRepository
import parkflex.runDB
import parkflex.service.TermService
import java.time.LocalDateTime
import java.time.Duration
import kotlin.math.absoluteValue

fun Route.quickReservationRoutes() {
    route("/{token}") {
        post {
            val uid = 2L

            val token = call.parameters["token"] ?: run {
                call.respond(
                    status = HttpStatusCode.BadRequest,
                    message = ApiErrorModel("No token provided", "POST /api/quickReservation/{token}")
                )

                return@post
            }

            val end = call.queryParameters["end"]?.let { LocalDateTime.parse(it) } ?: run {
                call.respond(
                    status = HttpStatusCode.BadRequest,
                    message = ApiErrorModel("No valid end date provided", "POST /api/quickReservation/{token}")
                )

                return@post
            }

            if (TermService.entry.isCurrent(token).not()) {
                call.respond(
                    status = HttpStatusCode.BadRequest,
                    message = ApiErrorModel("Invalid token $token", "POST /api/quickReservation/{token}")
                )

                return@post
            }

            val now = LocalDateTime.now()

            val freeSpot = runDB { SpotRepository.getFirstFree(now, end) } ?: run {
                call.respond(
                    status = HttpStatusCode.NotFound,
                    message = ApiErrorModel(
                        "No free spot for this timespan found",
                        "POST /api/quickReservation/{token}"
                    )
                )

                return@post
            }

            val duration = Duration.between(now, end).toMinutes().toInt().absoluteValue //uhhhhh

            runDB {
                ReservationEntity.new {
                    this.start = now
                    this.spot = freeSpot
                    this.user = UserEntity.findById(uid)!!
                    this.arrived = now
                    this.left = null
                    this.duration = duration
                }
            }

            TermService.entry.generate()

            call.respond(
                status = HttpStatusCode.Created,
                message = QuickReservationModel(
                    spot = freeSpot.id.value,
                    end = end
                )
            )
        }
    }
}