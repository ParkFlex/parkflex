package parkflex.routes

import io.ktor.http.HttpStatusCode
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.post
import parkflex.db.ReportEntity
import parkflex.models.ApiErrorModel
import parkflex.models.FullReportEntryModel
import parkflex.models.ReportEntryModel
import parkflex.runDB

fun Route.userReportRoutes() {
    post{
        val entry = call.receive<ReportEntryModel>()

        val plate = entry.plate
        if (plate.isBlank()) {

            call.respond(
                HttpStatusCode.BadRequest,
                ApiErrorModel("Plate number cannot be blank.", "/report POST")
            )
            return@post
        }
        val description = entry.description
        if (description.isBlank()) {

            call.respond(
                HttpStatusCode.BadRequest,
                ApiErrorModel("Description number cannot be blank.", "/report POST")
            )
            return@post
        }
        val image = entry.image
        if (image.isBlank()) {

            call.respond(
                HttpStatusCode.BadRequest,
                ApiErrorModel("Image cannot be blank.", "/report POST")
            )
            return@post
        }
        runDB {
            val report = FullReportEntryModel(
                plate = plate,
                description = description,
                image = image,
                timestamp = java.time.LocalDateTime.now(),
                penalty = null,
                subbmiter = 1
            )
        }

        call.respond(HttpStatusCode.Created)


    }
}