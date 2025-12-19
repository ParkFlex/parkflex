package parkflex.routes

import io.ktor.server.routing.*

/**
 * Routes for the REST API.
 */
fun Route.apiRoutes() {
    route("/user") {
        userFullRoutes()

        updatePlateRoutes()

        penaltyRoutes()
    }


    route("/demo") {
        demoRoutes()
    }
    route("/historyEntry"){
        historyRoutes()
    }
}