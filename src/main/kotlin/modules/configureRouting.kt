package parkflex.modules

import io.ktor.server.application.Application
import io.ktor.server.plugins.swagger.swaggerUI
import io.ktor.server.routing.route
import io.ktor.server.routing.routing
import parkflex.routes.apiRoutes
import parkflex.routes.frontendRoutes

fun Application.configureRouting() {
    routing {
        // Route for our frontend (html, css, js)
        frontendRoutes()

        // Route for API calls
        route("/api") {
            apiRoutes()
        }

        // API documentation
        swaggerUI(path = "swagger", swaggerFile = "openapi/generated.json")
    }
}
