package parkflex.routes.term

import io.ktor.http.HttpStatusCode
import io.ktor.server.response.respond
import io.ktor.server.response.respondNullable
import io.ktor.server.routing.Route
import io.ktor.server.routing.post
import parkflex.db.ReservationEntity
import parkflex.models.ApiErrorModel
import parkflex.models.LeaveModel
import parkflex.runDB
import parkflex.service.PenaltyService
import parkflex.service.TermService
import java.time.LocalDateTime

/**
 * Routes for handling vehicle departure at parking exit gate.
 *
 * Endpoint: POST /api/leave/{token}
 * - Validates exit token
 * - Finds user's active reservation (arrived but not left)
 * - Records departure time
 * - Checks for overtime penalties
 * - Generates new exit token for security
 *
 * TODO: Replace hardcoded uid=2L with actual authentication principal
 */
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

        val out =
            PenaltyService
                .processOvertime(reservation, now)
                ?.let { (penalty, overtime) ->
                    LeaveModel(
                        fine = penalty.fine,
                        due = penalty.due,
                        late = overtime
                    )
                }

        TermService.exit.generate()

        call.respondNullable(HttpStatusCode.OK, out)
    }
}
