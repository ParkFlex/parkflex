package parkflex.routes

import io.ktor.http.HttpStatusCode
import io.ktor.server.response.*
import io.ktor.server.routing.*
import parkflex.models.ApiErrorModel
import parkflex.runDB
import parkflex.utils.currentUserEntity

fun Route.paymentRoutes() {
    post {
        // dummy
        val user = call.currentUserEntity() ?: run {
            call.respond(
                status = HttpStatusCode.Unauthorized,
                message = ApiErrorModel("No user found in context", "POST /payment")
            )

            return@post
        }

        runDB {
           user.getPenalties().map { it.paid = true }
        }

        call.respond(HttpStatusCode.OK)
    }
}