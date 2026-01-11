package parkflex.repository

import com.auth0.jwt.JWT
import com.auth0.jwt.JWTVerifier
import com.auth0.jwt.algorithms.Algorithm
import java.util.*

object JwtRepository {
    private val logger = org.slf4j.LoggerFactory.getLogger("JwtRepository")

    private var issuer: String = "parkflex"
    private var algorithm: Algorithm? = null
    private var expiresMs: Long = 7 * 24 * 3600 * 1000L

    fun init(secret: String, issuer: String, expiresMs: Long) {
        this.issuer = issuer
        this.algorithm = Algorithm.HMAC256(secret)
        this.expiresMs = expiresMs
        logger.info("JwtRepository initialized")
    }

    fun generateToken(
        userId: Long,
        email: String,
        role: String,
    ): String {
        val alg = algorithm!!
        val now = System.currentTimeMillis()
        return JWT
            .create()
            .withIssuer(issuer)
            .withIssuedAt(Date(now))
            .withExpiresAt(Date(now + expiresMs))
            .withClaim("id", userId)
            .withClaim("email", email)
            .withClaim("role", role)
            .sign(alg)
    }

    fun verifier(): JWTVerifier = JWT.require(algorithm).withIssuer(issuer).build()
}
