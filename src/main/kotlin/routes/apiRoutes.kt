package parkflex.routes

import io.ktor.server.routing.*


/**
 * Routes for the REST API.
 */
fun Route.apiRoutes() {
    route("/demo") {
        demoRoutes()
    }

    route("/historyEntry"){
        historyRoutes()
    }

    route("/reservation") {
        reservationRoutes()
    }

    route("/spot") {
        spotRoutes()
    }

    route("/spots"){
        spotsRoutes()
    }

    route("/ip") {
        ipRoutes()
    }

    route("/parameter") {
        parameterRoutes()
    }

    route("/penalty") {
        penaltyCreationRoutes()
    }
}