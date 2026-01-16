package parkflex.routes.report

import io.ktor.http.HttpStatusCode
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.post
import parkflex.db.ReportEntity
import parkflex.db.UserEntity
import parkflex.models.ApiErrorModel
import parkflex.models.report.ReportEntryModel
import parkflex.runDB
import java.time.LocalDateTime

fun Route.userReportRoutes() {
    post {
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
                this.submitter = UserEntity.findById(1)!!
                this.timestamp = LocalDateTime.now()
            }
        }

        call.respond(HttpStatusCode.Created)
    }
}