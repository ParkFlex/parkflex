package parkflex.modules

import io.ktor.server.application.*
import io.ktor.server.plugins.swagger.*
import io.ktor.server.request.*
import io.ktor.server.routing.*
import parkflex.routes.apiRoutes
import parkflex.routes.frontendRoutes
import parkflex.routes.termRoutes

/**
 * Configures all HTTP routing for the application.
 * 
 * Sets up:
 * - Frontend routes (HTML, CSS, JS static files)
 * - API routes under /api prefix
 * - Terminal/device routes under /term prefix
 * - Swagger UI documentation at /swagger
 */
fun Application.configureRouting() {
    routing {
        // Route for our frontend (html, css, js)
        frontendRoutes()

        // Route for API calls
        route("/api") {
            apiRoutes()
        }

        // Terminals
        route("/term") {
            termRoutes()
        }

        // API documentation
        swaggerUI(path = "swagger", swaggerFile = "openapi/generated.json")
    }
}
