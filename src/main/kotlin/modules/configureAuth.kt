package parkflex.modules

import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import parkflex.repository.JwtRepository
import io.ktor.http.*
import io.ktor.server.response.respondText
import parkflex.models.ApiErrorModel

fun Application.configureAuth(config: parkflex.config.Config) {
    JwtRepository.init(config.jwtSecret, config.jwtIssuer, config.jwtExpiresMs)

    install(Authentication) {
        jwt {
            verifier(JwtRepository.verifier())

            challenge { _, _ ->
                val err = ApiErrorModel("Unauthorized", "/api/auth")
                val payload = kotlinx.serialization.json.Json.encodeToString(err)
                this.call.respondText(payload, ContentType.Application.Json, HttpStatusCode.Unauthorized)
            }

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
