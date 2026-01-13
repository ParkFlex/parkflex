package parkflex.utils

import io.ktor.server.application.ApplicationCall
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.JWTPrincipal
import parkflex.db.UserEntity
import parkflex.runDB

fun ApplicationCall.userId(): Long? = principal<JWTPrincipal>()?.payload?.getClaim("id")?.asLong()

// Get current user by id from jwt token
suspend fun ApplicationCall.currentUserEntity(): UserEntity? {
    val id = userId() ?: return null
    return runDB { UserEntity.findById(id) }
}
