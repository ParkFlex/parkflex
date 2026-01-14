package parkflex.routes

import io.ktor.http.HttpStatusCode
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.patch
import io.ktor.server.routing.route
import parkflex.db.PenaltyEntity
import parkflex.db.UserEntity
import parkflex.models.ApiErrorModel
import parkflex.runDB

fun Route.penaltyCancelRoutes() {
    route("/penalty/{penalty_id}/cancel") {
        patch {
            val id = call.parameters["penalty_id"]
            if (id == null) {
                call.respond(
                    status = HttpStatusCode.UnprocessableEntity,
                    message = ApiErrorModel("No ID found", "/user/penalty/{penalty_id}/cancel PATCH")

                )
                return@patch
            }
            val idLong = id.toLong()
            val penalty = runDB { PenaltyEntity.findById(idLong) }
            if (penalty == null) {
                call.respond(
                    status = HttpStatusCode.NotFound,
                    message = ApiErrorModel("Penalty not found", "/user/penalty/{penalty_id}/cancel PATCH")
                )
                return@patch
            }
            if(penalty.paid == false){
                penalty.paid = true
                call.respond(
                    status = HttpStatusCode.OK,
                    message = "Penalty with ID $idLong has been successfully cancelled."
                )
            } else {
                call.respond(
                    status = HttpStatusCode.BadRequest,
                    message = ApiErrorModel("Penalty with ID $idLong is already cancelled.", "/user/penalty/{penalty_id}/cancel PATCH")
                )
            }
        }
    }
}