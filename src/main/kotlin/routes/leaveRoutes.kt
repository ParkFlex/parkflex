package parkflex.routes

import io.ktor.http.HttpStatusCode
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.post
import parkflex.db.ParameterEntity
import parkflex.db.ParameterTable
import parkflex.db.ReservationEntity
import parkflex.models.ApiErrorModel
import parkflex.repository.ParameterRepository
import parkflex.runDB
import parkflex.service.PenaltyService
import parkflex.service.TermService
import java.time.LocalDateTime

fun Route.leaveRoutes() {
    post("{token}") {
        val uid = 2L // TODO: use principal after auth is ready

        val token = call.parameters["token"] ?: run {
            call.respond(
                status = HttpStatusCode.BadRequest,
                message = ApiErrorModel("No token provided", "POST /exit/{token}")
            )

            return@post
        }

        if (!TermService.exit.isCurrent(token)) {
            call.respond(
                status = HttpStatusCode.BadRequest,
                message = ApiErrorModel("Invalid exit token token: $token", "POST /exit/{token}")
            )

            return@post
        }

        val now = LocalDateTime.now()

        val reservation = runDB {
            ReservationEntity
                .all()
                .filter { it.user.id.value == uid }
                .firstOrNull {
                    it.user.id.value == uid && it.arrived != null && it.left == null
                } // there should be at most one reservation that fits this criteria
        }

        if (reservation == null) {
            call.respond(
                status = HttpStatusCode.BadRequest,
                message = ApiErrorModel("No in-progress reservation found", "POST /exit/{token}")
            )

            return@post
        }


        runDB {
            reservation.left = now
        }

        PenaltyService.processOvertime(reservation, now)

        TermService.exit.generate()

        call.respond(HttpStatusCode.OK)
    }
}