package parkflex.routes

import io.ktor.server.routing.*
import parkflex.modules.adminHistoryRoutes


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
    route("/demo") {
        demoRoutes()
    }

    route("/historyEntry"){
        historyRoutes()
    }
}