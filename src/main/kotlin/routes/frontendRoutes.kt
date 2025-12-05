package parkflex.routes

import io.ktor.server.http.content.singlePageApplication
import io.ktor.server.routing.Route

fun Route.frontendRoutes() {
    // This serves our React app. Don't touch.
    singlePageApplication {
        filesPath = "frontend/dist"
        defaultPage = "index.html"
    }
}