package parkflex.routes

import io.ktor.http.HttpStatusCode
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.patch
import io.ktor.server.routing.route
import parkflex.db.UserEntity
import parkflex.models.ApiErrorModel
import parkflex.models.admin.UpdatePlateModel
import parkflex.runDB

fun Route.updatePlateRoutes() {
    route("/{user_id}") {
        patch {

            val id = call.parameters["user_id"]
            if (id == null) {
                call.respond(
                    status = HttpStatusCode.UnprocessableEntity,
                    message = ApiErrorModel("No ID found", "/user/{user_id} PATCH")

                )
                return@patch
            }

            val idLong = id.toLong()
            val user = runDB { UserEntity.findById(idLong) }
            if (user == null) {
                call.respond(
                    status = HttpStatusCode.NotFound,
                    message = ApiErrorModel("User not found", "/user/{user_id} PATCH")
                )
                return@patch
            }

            val updatePlateRequest = call.receive<UpdatePlateModel>()
            val receivedPlate = updatePlateRequest.plate
            if (receivedPlate.isBlank()) {
                call.respond(
                    status = HttpStatusCode.BadRequest,
                    message = ApiErrorModel("Invalid or missing plate", context = "/user/{user_id} PATCH")
                )
                return@patch
            }

            val newPlate = receivedPlate.uppercase().replace(Regex("[^A-Z0-9]"), "")

            val isPlate = runDB {
                UserEntity.all().any { it.plate == newPlate }
            }

            if (isPlate) {
                call.respond(
                    status = HttpStatusCode.Conflict,
                    message = ApiErrorModel(
                        message = "Plate already in use",
                        context = "/user/{user_id} PATCH"
                    )
                )
                return@patch
            }

            runDB {
                user.plate = newPlate
            }

            call.respond(HttpStatusCode.NoContent)
        }
    }
}
