package parkflex.routes

import io.ktor.http.HttpStatusCode
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.route
import parkflex.db.UserEntity
import parkflex.models.ApiErrorModel
import parkflex.models.Penalty
import parkflex.runDB
import java.time.LocalDateTime
import java.time.ZoneId
import java.util.Date


fun Route.Penalty(){
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

private suspend fun findActivePenaltyForUser(userId: Long): Penalty? {
    var activePenalty: Penalty? = null

    runDB {
        val user = UserEntity.findById(userId) ?: return@runDB
        val now = LocalDateTime.now()

        for (reservation in user.reservations) {
            val penaltyEntity = reservation.penalties
                .firstOrNull { penalty ->
                    !penalty.paid && penalty.due.isAfter(now)
                }

            if (penaltyEntity != null) {
                activePenalty = Penalty(
                    reservation = reservation.id.value,
                    reason = penaltyEntity.reason,
                    paid = penaltyEntity.paid,
                    due = Date.from(penaltyEntity.due.atZone(ZoneId.systemDefault()).toInstant()),
                    fine = penaltyEntity.fine.toDouble()
                )
                break
            }
        }
    }
    return activePenalty
}

