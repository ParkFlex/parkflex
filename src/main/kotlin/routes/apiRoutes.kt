package parkflex.routes

import io.ktor.server.routing.*


/**
 * Routes for the REST API.
 */
fun Route.apiRoutes() {
    route("/user") {
        // some routes here
    }

    route("/demo") {
        demoRoutes()
    }

    route("/reservation") {
        reservationRoutes()
    }

    route("/spot") {
        spotRoutes()
    }

}