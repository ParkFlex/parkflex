package parkflex.modules

import io.ktor.http.HttpMethod
import io.ktor.server.application.*
import io.ktor.server.plugins.cors.routing.CORS
import parkflex.config.Config

fun Application.configureCORS(config: Config) = install(CORS) {
    config.hosts.forEach { host ->
        allowHost(host, schemes = listOf("http", "https"))
    }

    allowHost("localhost:8080", schemes = listOf("http", "https"))
    allowHost("localhost:5173", schemes = listOf("http", "https"))
    allowHost("127.0.0.1:8080", schemes = listOf("http", "https"))
    allowHost("127.0.0.1:5173", schemes = listOf("http", "https"))

    anyMethod()
    allowHeaders({ true })
}
