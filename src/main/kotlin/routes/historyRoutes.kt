package parkflex.routes

import io.ktor.http.HttpStatusCode
import io.ktor.server.response.respond
import io.ktor.server.response.respondText
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import org.jetbrains.exposed.sql.appendTo
import parkflex.db.UserEntity
import parkflex.models.ApiErrorModel
import parkflex.models.HistoryEntry
import parkflex.runDB

fun Route.historyRoutes() {
    get {
        val id = call.queryParameters["userId"]
        if (id == null) {
            call.respond(
                status = HttpStatusCode.UnprocessableEntity,
                message = ApiErrorModel("No ID found", "/api/history GET")
            )
        } else {
            val idLong = id.toLong()
            val user = runDB { UserEntity.findById(idLong) }
            if (user == null) {
                call.respond(
                    status = HttpStatusCode.NotFound,
                    message = ApiErrorModel("User not found", "/api/history GET")
                )
            }

            var historyList: List<HistoryEntry> = listOf()
            runDB {
                val reservations = user!!.reservations.toList()
                for (reservation in reservations) {
                    val status: String
                    if (reservation.hasPenalty) {
                        status = "penalty"
                    } else {
                        status = "ok"
                    }
                    val entry = HistoryEntry(reservation.start, reservation.duration, status, reservation.spot.id.value)
                    historyList += entry
                }
            }
            call.respond(historyList)
        }
    }
}