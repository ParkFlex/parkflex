package parkflex.routes

import io.ktor.http.HttpStatusCode
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.route
import parkflex.db.PenaltyEntity
import parkflex.db.UserEntity
import parkflex.models.ApiErrorModel
import parkflex.models.PenaltyModel
import parkflex.runDB


fun Route.penaltyRoutes() {
    route("/{user_id}/penalty") {

        get {
            val userId = call.parameters["user_id"]?.toLongOrNull()
            if (userId == null) {
                call.respond(
                    status = HttpStatusCode.BadRequest,
                    message = ApiErrorModel("Invalid or missing user_id", context = "/user/{user_id}/penalty GET")
                )
                return@get
            }

            var activePenaltyModel: PenaltyModel? = null

            val user = runDB{UserEntity.findById(userId)}
            if (user == null) {
                call.respond(
                    HttpStatusCode.NotFound,
                    message = ApiErrorModel("User not found", context = "/user/{user_id}/penalty GET")
                )
                return@get
            }

            runDB {
                for (reservation in user.reservations) {
                    val penaltyEntity: PenaltyEntity? = reservation.penalties
                        .firstOrNull { penalty -> penalty.isActive() }

                    if (penaltyEntity != null) {
                        activePenaltyModel = PenaltyModel(
                            reservation = reservation.id.value,
                            reason = penaltyEntity.reason,
                            paid = penaltyEntity.paid,
                            due = penaltyEntity.due,
                            fine = penaltyEntity.fine.toDouble()
                        )
                        break
                    }
                }
            }

            if (activePenaltyModel != null) {
                call.respond(HttpStatusCode.OK, activePenaltyModel)
            } else {
                call.respond(
                    HttpStatusCode.NoContent
                )
            }
        }
    }
}
