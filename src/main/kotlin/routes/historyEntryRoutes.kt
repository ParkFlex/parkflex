package parkflex.routes

import io.ktor.http.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import parkflex.db.*
import parkflex.models.*
import parkflex.*

fun Route.historyEntryRoutes() {

    get {
        val userIdParam: String? = call.queryParameters["userId"]

        if (userIdParam == null) {
            call.respond(
                status = HttpStatusCode.BadRequest,
                message = ApiErrorModel("No userId parameter provided", "/api/historyEntry GET handler")
            )
            return@get
        }

        val userId: Long = userIdParam.toLongOrNull() ?: run {
            call.respond(
                status = HttpStatusCode.BadRequest,
                message = ApiErrorModel("Invalid userId parameter", "/api/historyEntry GET handler")
            )
            return@get
        }

        val user: UserEntity? = runDB {
            UserEntity.findById(userId)
        }

        if (user == null) {
            call.respond(
                status = HttpStatusCode.NotFound,
                message = ApiErrorModel("User not found", "/api/historyEntry GET handler")
            )
            return@get
        }

        val historyEntries: List<HistoryEntryModel> = runDB {
            user.reservations.map { reservation ->
                HistoryEntryModel(
                    startTime = reservation.start.toString(),
                    durationMin = reservation.duration,
                    status = if (reservation.hasPenalty) "penalty" else "ok",
                    spot = reservation.spot.id.value
                )
            }
        }

        call.respond(HttpStatusCode.OK, historyEntries)
    }
}
