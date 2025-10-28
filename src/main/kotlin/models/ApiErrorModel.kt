package parkflex.models

import kotlinx.serialization.*

/**
 * An error that happened when handling an API request.
 *
 * This is not a [Throwable] - you don't `throw` it. Instead,
 * you should [respond][io.ktor.server.application.ApplicationCall.respond] with it.
 *
 * Example:
 * ```
 * call.respond(
 *     status = HttpStatusCode.BadRequest,
 *     message = ApiErrorModel("Could not deserialize JSON", "/api/user/new")
 * )
 * ```
 *
 * This class exists because frontend always expects that server will send JSON responses.
 * If we were to send plain text, we would have to account for that in frontend code.
 *
 * @param message error message
 * @param context some info where the error occurred
 */
@Serializable
data class ApiErrorModel(val message: String, val context: String)
