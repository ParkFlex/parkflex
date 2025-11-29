package parkflex.modules

import io.ktor.serialization.kotlinx.json.json
import io.ktor.server.application.*
import io.ktor.server.plugins.contentnegotiation.ContentNegotiation

/**
 * Enables de/serialisation of JSON in HTTP calls
 */
fun Application.configureJSON() = install(ContentNegotiation) { json() }

