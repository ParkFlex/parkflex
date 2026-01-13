package parkflex.modules

import io.ktor.http.HttpStatusCode
import io.ktor.server.application.*
import io.ktor.server.engine.logError
import io.ktor.server.plugins.statuspages.StatusPages
import io.ktor.server.response.respond
import parkflex.models.ApiErrorModel

/**
 * Configures global exception handling for the application.
 * 
 * Catches any unhandled exceptions during request processing and returns
 * a JSON error response to the client instead of plain text.
 * This ensures consistent error response format for the frontend.
 */
fun Application.configureStatusPages() = install(StatusPages) {
    /* This will catch any exception thrown during processing routes
     * and send the exception to the client.
     */
    exception<Throwable> { call, cause ->
        val msg: String = cause.message ?: "No message"

        logError(call, cause)

        call.respond(
            status = HttpStatusCode.InternalServerError,
            message = ApiErrorModel(msg, "main exception catch")
        )
    }
}

