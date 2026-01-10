package parkflex.routes

import io.ktor.server.routing.*
import io.ktor.server.auth.*

/**
 * Routes for the REST API.
 */
fun Route.apiRoutes() {
    route("/register") {
        registerRoute()
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

    route("/ip") {
        ipRoutes()
    }
}
