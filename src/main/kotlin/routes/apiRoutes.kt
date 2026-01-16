package parkflex.routes

import io.ktor.server.routing.*
import io.ktor.server.auth.*

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
        userReportRoutes()
    }

    route("reports") {
        reportsRoutes()
    }

    route("/register") {
        registerRoute()
    }

    route("/login") {
        loginRoute()
    }

    route("/account") {
        authenticate {
            patchAccountRoute()
        }
    }

    route("/whoami") {
        authenticate {
            whoAmIRoute()
        }
    }

    route("/demo") {
        demoRoutes()
    }

    route("/historyEntry") {
        historyRoutes()
    }

    route("/reservation") {
        reservationRoutes()
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