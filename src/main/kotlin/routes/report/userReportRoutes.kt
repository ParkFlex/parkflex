package parkflex.routes.report

import io.ktor.http.HttpStatusCode
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.response.respondNullable
import io.ktor.server.routing.Route
import io.ktor.server.routing.post
import parkflex.db.ReportEntity
import parkflex.db.UserEntity
import parkflex.models.ApiErrorModel
import parkflex.models.report.ReportEntryModel
import parkflex.repository.ReservationRepository
import parkflex.repository.SpotRepository
import parkflex.runDB
import parkflex.utils.currentUserEntity
import java.time.LocalDateTime

fun Route.userReportRoutes() {
    post {
        val user = call.currentUserEntity() ?: run {
            call.respond(
                status = HttpStatusCode.Unauthorized,
                message = ApiErrorModel("No user in context", "POST /report")
            )

            return@post
        }

        val entry = call.receive<ReportEntryModel>()

        val plate = entry.plate
        if (plate.isBlank()) {
            call.respond(
                HttpStatusCode.BadRequest,
                ApiErrorModel("Plate number cannot be blank.", "/report POST")
            )
            return@post
        }

        val description = entry.description ?: ""

        val image = entry.image
        if (image.isBlank()) {
            call.respond(
                HttpStatusCode.BadRequest,
                ApiErrorModel("Image cannot be blank.", "/report POST")
            )
            return@post
        }

        runDB {
            ReportEntity.new {
                this.plate = plate
                this.description = description
                this.image = image
                this.reviewed = false
                this.submitter = user
                this.timestamp = LocalDateTime.now()
            }
        }

        val currentReservation = runDB { ReservationRepository.getInProgress(user.id.value) }
            ?: run {
                call.respond(
                    status = HttpStatusCode.BadRequest,
                    message = ApiErrorModel("No reservation in progress", "POST /report")
                )
                return@post

            }

        val firstSpot = runDB { SpotRepository.getFirstFree(currentReservation.start, currentReservation.end()) }

        firstSpot?.let { runDB { currentReservation.spot = it } }

        call.respondNullable(
            HttpStatusCode.Created,
            message = firstSpot?.id?.value
        )
    }
}