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
    route("report"){
        userReportRoutes()
    }

    route("/historyEntry") {
        historyRoutes()
    }

    route("/reservation") {
        reservationRoutes()
    }

    route("/quickReservation") {
        quickReservationRoutes()
    }

    route("/spot") {
        spotRoutes()
    }

    route("/spots") {
        spotsRoutes()
    }

    route("/arrive") {
        arrivalRoutes()
    }

    route("/leave") {
        leaveRoutes()
    }

    route("/parameter") {
        parameterRoutes()
    }

    route("/penalty") {
        penaltyCreationRoutes()
    }
}