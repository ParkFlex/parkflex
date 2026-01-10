package parkflex.modules

import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import parkflex.repository.JwtRepository

fun Application.configureAuth() {
    install(Authentication) {
        jwt {
            verifier(JwtRepository.verifier())
            validate { credential ->
                val idClaim = credential.payload.getClaim("id")
                val id = idClaim?.asLong()
                if (id != null) {
                    JWTPrincipal(credential.payload)
                } else {
                    null
                }
            }
        }
    }
}
