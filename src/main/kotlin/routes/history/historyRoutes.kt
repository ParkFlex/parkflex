package parkflex.routes.history

import io.ktor.http.HttpStatusCode
import io.ktor.server.plugins.BadRequestException
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import kotlinx.serialization.InternalSerializationApi
import parkflex.models.ApiErrorModel
import parkflex.models.history.HistoryEntry
import parkflex.models.history.HistoryEntryStatus
import parkflex.routes.reservation.reservationRoutes
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
                user.reservations.map { res ->
                    val status = when {
                        res.hasPenalty -> HistoryEntryStatus.Penalty
                        res.arrived != null && res.left == null -> HistoryEntryStatus.InProgress
                        res.arrived == null && res.left == null -> HistoryEntryStatus.Planned
                        res.arrived != null && res.left != null -> HistoryEntryStatus.Past
                        else -> throw IllegalStateException("Reservation does not fit any sensible status case")
                    }

                    HistoryEntry(
                        startTime = res.start,
                        durationMin = res.duration,
                        status = status,
                        spot = res.spot.id.value,
                    )
                }
            }

        call.respond(historyList)
    }
}
