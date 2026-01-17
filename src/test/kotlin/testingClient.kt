import io.ktor.client.HttpClient
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.serialization.kotlinx.json.json
import io.ktor.server.testing.ApplicationTestBuilder
import kotlinx.serialization.json.Json
import kotlinx.serialization.modules.*
import parkflex.LocalDateTimeSerializer
import parkflex.repository.JwtRepository
import parkflex.config.TestConfig

/**
 * Shared client builder for unit tests
 */
fun ApplicationTestBuilder.testingClient() = createClient {
    JwtRepository.init(TestConfig.jwtSecret, TestConfig.jwtIssuer, TestConfig.jwtExpiresMs)
    install(ContentNegotiation) {
        json(
            Json {
                serializersModule = SerializersModule {
                    contextual(LocalDateTimeSerializer)
                }
            }
        )
    }
}