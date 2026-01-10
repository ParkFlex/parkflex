package parkflex.repository

import com.auth0.jwt.JWT
import com.auth0.jwt.JWTVerifier
import com.auth0.jwt.algorithms.Algorithm
import java.util.Date

object JwtRepository {
    private val logger = org.slf4j.LoggerFactory.getLogger("JwtRepository")
    private val issuer = "parkflex"
    private val secret: String by lazy {
        System.getenv("PARKFLEX_JWT_SECRET") ?: run {
            logger.warn("PARKFLEX_JWT_SECRET not set - using default secret")
            "parkflex_password_secret_!$:JL@$"
        }
    }
    private val algorithm = Algorithm.HMAC256(secret)

    fun generateToken(
        userId: Long,
        email: String,
        role: String,
        expiresMs: Long = 7 * 24 * 3600 * 1000L, // 7 days
    ): String {
        val now = System.currentTimeMillis()
        return JWT
            .create()
            .withIssuer(issuer)
            .withIssuedAt(Date(now))
            .withExpiresAt(Date(now + expiresMs))
            .withClaim("id", userId)
            .withClaim("email", email)
            .withClaim("role", role)
            .sign(algorithm)
    }

    fun verifier(): JWTVerifier = JWT.require(algorithm).withIssuer(issuer).build()
}
