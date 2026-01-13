package parkflex.modules

import io.ktor.http.HttpMethod
import io.ktor.server.application.*
import io.ktor.server.plugins.cors.routing.CORS
import parkflex.config.Config

/**
 * Configures Cross-Origin Resource Sharing (CORS) for the application.
 * 
 * Allows requests from configured hosts plus localhost for development.
 * Currently has anyHost() enabled for testing behind Cloudflare.
 * 
 * TODO: Remove anyHost() in production and rely only on configured hosts
 * 
 * @param config Application configuration containing allowed CORS hosts
 */
fun Application.configureCORS(config: Config) = install(CORS) {
    config.hosts.forEach { host ->
        allowHost(host, schemes = listOf("http", "https"))
    }

    allowHost("localhost:8080", schemes = listOf("http", "https"))
    allowHost("localhost:5173", schemes = listOf("http", "https"))
    allowHost("127.0.0.1:8080", schemes = listOf("http", "https"))
    allowHost("127.0.0.1:5173", schemes = listOf("http", "https"))

    // Temporary: allow any host for testing behind Cloudflare
    anyHost()

    anyMethod()
    allowHeaders({ true })
    allowNonSimpleContentTypes = true
}
