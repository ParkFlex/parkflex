package parkflex.routes

import io.ktor.http.HttpStatusCode
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.post
import parkflex.db.ParameterEntity
import parkflex.db.ParameterTable
import parkflex.db.ReservationEntity
import parkflex.models.ApiErrorModel
import parkflex.runDB
import parkflex.service.TermService
import java.time.LocalDateTime

fun Route.leaveRoutes() {
    // TODO: DRY with `arrivalRoutes`
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

        // TODO Switch to ParameterRepository after `admin-view` is merged
        val padding =
            runDB { ParameterEntity.find { ParameterTable.key eq "reservation/break/duration" }.firstOrNull() }
                ?.value?.toLong()
                ?: run {
                    call.respond(
                        status = HttpStatusCode.InternalServerError,
                        message = ApiErrorModel(
                            "The \"reservation/break/duration\" parameter is malformed or does not exist",
                            "POST /api/exit/{token}"
                        )
                    )

                    return@post
                }

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


        // TODO penalty calculation

        runDB {
            reservation.left = now
        }

        TermService.exit.generate()

        call.respond(HttpStatusCode.OK)
    }
}