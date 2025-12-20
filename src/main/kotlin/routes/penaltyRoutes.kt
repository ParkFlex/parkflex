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
import java.time.LocalDateTime


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

            val activePenalty = findActivePenaltyForUser(userId)

            if (activePenalty != null) {
                call.respond(HttpStatusCode.OK, activePenalty)
            } else {
                call.respond(
                    HttpStatusCode.NoContent,
                    message = ApiErrorModel("User penalty is null", context = "/user/{user_id}/penalty GET")
                )
            }
        }
    }
}

private suspend fun findActivePenaltyForUser(userId: Long): PenaltyModel? {
    var activePenaltyModel: PenaltyModel? = null

    runDB {
        val user = UserEntity.findById(userId) ?: return@runDB

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
    return activePenaltyModel
}

