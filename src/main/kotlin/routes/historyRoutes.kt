package parkflex.routes

import io.ktor.server.response.respondText
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import org.jetbrains.exposed.sql.appendTo
import parkflex.db.UserEntity
import parkflex.models.HistoryEntry
import parkflex.runDB

fun Route.historyRoutes() {
    get {
        val id = call.queryParameters["userId"]
        if (id == null) {
            call.respondText("nie ma id")
        } else {
            val idLong = id.toLong()
            val user = runDB { UserEntity.findById(idLong) }
            if (user == null) {
                call.respondText("nie ma user")
            }
            val reservations = user!!.reservations.toList()
            var historyList: List<HistoryEntry> = listOf()
            for (reservation in reservations) {

                val entry = HistoryEntry(reservation.start, reservation.duration, reservation.spot.id.value)
                historyList += entry
            }
            println(historyList)
        }
    }
}