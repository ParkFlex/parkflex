package parkflex.modules

import io.ktor.server.application.*
import io.ktor.server.plugins.swagger.*
import io.ktor.server.request.*
import io.ktor.server.routing.*
import parkflex.routes.apiRoutes
import parkflex.routes.frontendRoutes
import parkflex.routes.termRoutes

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
