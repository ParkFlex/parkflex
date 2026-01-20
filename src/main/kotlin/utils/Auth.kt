package parkflex.utils

import io.ktor.http.HttpStatusCode
import io.ktor.server.application.ApplicationCall
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.JWTPrincipal
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import parkflex.db.UserEntity
import parkflex.models.ApiErrorModel
import parkflex.runDB

fun ApplicationCall.userId(): Long? = principal<JWTPrincipal>()?.payload?.getClaim("id")?.asLong()

// Get current user by id from jwt token
suspend fun ApplicationCall.currentUserEntity(): UserEntity? {
    val id = userId() ?: return null
    return runDB { UserEntity.findById(id) }
}

suspend fun ApplicationCall.admin(): UserEntity? {
    val id = userId() ?: run {
        respond(
            status = HttpStatusCode.Unauthorized,
            message = ApiErrorModel("No user id in context", "admin auth")
        )
        return null
    }

    val user = runDB { UserEntity.findById(id) } ?: run {
        respond(
            status = HttpStatusCode.Unauthorized,
            message = ApiErrorModel("No user id ${id} found", "admin auth")
        )
        return null
    }

    if (user.role != "admin") {
        respond(
            status = HttpStatusCode.Unauthorized,
            message = ApiErrorModel("User of id ${user.id.value} is not an admin", "admin auth")
        )
        return null
    }

    return user
}
