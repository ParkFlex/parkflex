package parkflex.routes

import io.ktor.server.http.content.singlePageApplication
import io.ktor.server.response.respondRedirect
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.route

fun Route.frontendRoutes() {
    // This serves our React app. Don't touch.
    singlePageApplication {
        filesPath = "frontend/dist"
        defaultPage = "index.html"
    }
}