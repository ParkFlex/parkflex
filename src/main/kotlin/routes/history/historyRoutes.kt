package parkflex.routes.history

import io.ktor.http.HttpStatusCode
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import parkflex.db.UserEntity
import parkflex.models.ApiErrorModel
import parkflex.models.history.HistoryEntry
import parkflex.runDB
import parkflex.utils.currentUserEntity

/**
 * Routes for user reservation history.
 *
 * Endpoint: GET /api/historyEntry
 * Retrieves reservation history for a specific user.
 */
fun Route.historyRoutes() {
    get {
        val user = call.currentUserEntity()
        if (user == null) {
            call.respond(
                status = HttpStatusCode.NotFound,
                message = ApiErrorModel("Nie znaleziono użytkownika", "/api/history GET"),
            )
            return@get
        }

        val historyList: List<HistoryEntry> =
            runDB {
                user.reservations.map { reservation ->
                    HistoryEntry(
                        startTime = reservation.start,
                        durationMin = reservation.duration,
                        status = if (reservation.hasPenalty) "penalty" else "ok",
                        spot = reservation.spot.id.value,
                    )
                }
            }

        call.respond(historyList)
    }
}
