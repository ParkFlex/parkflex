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

        penaltyCancelRoutes()
    }

    route("/users") {
        adminHistoryRoutes()
    }


    route("report") {
       reviewedRoutes()
    }

    route("reports"){
        reportsRoutes()
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