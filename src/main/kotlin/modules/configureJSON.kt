package parkflex.modules

import io.ktor.serialization.kotlinx.json.json
import io.ktor.server.application.*
import io.ktor.server.plugins.contentnegotiation.ContentNegotiation
import kotlinx.serialization.json.Json
import kotlinx.serialization.modules.SerializersModule
import kotlinx.serialization.modules.contextual
import parkflex.LocalDateTimeSerializer

/**
 * Enables de/serialisation of JSON in HTTP calls
 */
fun Application.configureJSON() = install(ContentNegotiation) {
    json(
        Json {
            serializersModule = SerializersModule {
                contextual(LocalDateTimeSerializer)
            }
        }
    )
}

