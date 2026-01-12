package parkflex.routes

import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.route
import parkflex.db.ReservationEntity
import parkflex.models.AdminHistoryEntryModel
import parkflex.runDB

fun Route.adminHistoryRoutes() {
    route("/history") {
        get {
            var historyList: List<AdminHistoryEntryModel> = listOf()
            runDB{
                val reservations = ReservationEntity.all().toList()
                for (reservation in reservations) {
                    val status: String
                    if (reservation.hasPenalty) {
                        status = "penalty"
                    } else {
                        status = "ok"
                    }
                    val entry = AdminHistoryEntryModel(
                        reservation.start,
                        reservation.duration,
                        status,
                        reservation.spot.id.value.toInt(),
                        reservation.user.plate
                    )
                    historyList += entry
                }
            }
            call.respond(historyList)
        }
    }
}