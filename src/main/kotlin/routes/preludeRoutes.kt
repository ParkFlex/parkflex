package parkflex.routes

import io.ktor.http.HttpStatusCode
import io.ktor.server.routing.*
import io.ktor.server.response.*
import parkflex.models.ApiErrorModel
import parkflex.models.PreludeModel
import parkflex.repository.ParameterRepository
import parkflex.runDB
import parkflex.utils.currentUserEntity

fun Route.preludeRoutes() {
    get {
        val user = call.currentUserEntity() ?: run {
            call.respond(
                status = HttpStatusCode.Unauthorized,
                message = ApiErrorModel("No user ID in the payload", "GET /prelude")
            )

            return@get
        }

        val (min, max, penalty) = runDB {
            val min = ParameterRepository.get("reservation/duration/min")!!.toLong()
            val max = ParameterRepository.get("reservation/duration/max")!!.toLong()
            val penalty = user.getPenalties().singleOrNull { it.isActive() }

            Triple(min, max, penalty)
        }

        val out = PreludeModel(
            minReservationTime = min,
            maxReservationTime = max,
            penaltyInformation = penalty?.let {
                PreludeModel.PenaltyInformation(
                    due = penalty.due,
                    fine = penalty.fine,
                    reason = penalty.reason
                )
            }
        )

        call.respond(
            status = HttpStatusCode.OK,
            message = out
        )
    }
}