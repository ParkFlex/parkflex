package parkflex.routes

import io.ktor.http.HttpStatusCode
import io.ktor.server.request.receiveText
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.put
import io.ktor.server.routing.route
import parkflex.db.UserEntity
import parkflex.models.ApiErrorModel
import parkflex.runDB

fun Route.updatePlateRoutes() {
    route("/{user_id}") {
        put {

            val id = call.queryParameters["userId"]
            if (id == null) {
                call.respond(
                    status = HttpStatusCode.UnprocessableEntity,
                    message = ApiErrorModel("No ID found", "/user/{user_id} PUT")

                )
                return@put
            }

            val idLong = id.toLong()
            val user = runDB { UserEntity.findById(idLong) }
            if (user == null) {
                call.respond(
                    status = HttpStatusCode.NotFound,
                    message = ApiErrorModel("User not found", "/user/{user_id} PUT")
                )
                return@put
            }

            val newPlate = call.receiveText()
            if (newPlate.isBlank()) {
                call.respond(
                    status = HttpStatusCode.BadRequest,
                    message = ApiErrorModel("Invalid or missing user_id", context = "/user/{user_id} PUT")
                )
                return@put
            }

            val plateRegex = Regex("^[A-Z]{3}-\\d{4}$")
            if (!plateRegex.matches(newPlate)) {
                call.respond(
                    status = HttpStatusCode.BadRequest,
                    message = ApiErrorModel(
                        message = "Invalid plate format. Expected format: XYZ-0000",
                        context = "/user/{user_id} PUT"
                    )
                )
                return@put
            }

            val isPlate = runDB {
                UserEntity.all().any { it.plate == newPlate }
            }
            if(isPlate){
                call.respond(
                    status = HttpStatusCode.Conflict,
                    message = ApiErrorModel(
                        message = "Plate already in use",
                        context = "/user/{user_id} PUT"
                    )
                )
                return@put
            }
            runDB{
                user.plate = newPlate
            }
            call.respond(user)

        }
    }
}
