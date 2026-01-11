package parkflex.routes

import io.ktor.http.HttpStatusCode
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.patch
import io.ktor.server.routing.route
import parkflex.db.ReportEntity

import parkflex.models.ApiErrorModel
import parkflex.runDB

fun Route.reviewedRoutes() {
    route("/{report_id}/reviewed"){
        patch{
            val id = call.parameters["report_id"]
            if (id == null) {
                call.respond(
                    status = HttpStatusCode.UnprocessableEntity,
                    message = ApiErrorModel("No ID found", "/report/{report_id}/reviewed PATCH")

                )
                return@patch
            }
            val idLong = id.toLong()
            val report = runDB { ReportEntity.findById(idLong) }
            if (report == null) {
                call.respond(
                    status = HttpStatusCode.NotFound,
                    message = ApiErrorModel("Report not found", "/report/{report_id}/reviewed PATCH")
                )
                return@patch
            }
            if(report.reviewed == false){
                report.reviewed = true
                call.respond(
                    status = HttpStatusCode.OK,
                    message = "Report with ID $idLong has been successfully reviewed."
                )
            } else {
                call.respond(
                    status = HttpStatusCode.BadRequest,
                    message = ApiErrorModel("Report with ID $idLong is already reviewed.", "/report/{report_id}/reviewed PATCH")
                )
            }
        }
    }
}
