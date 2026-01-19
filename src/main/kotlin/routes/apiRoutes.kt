package parkflex.routes

import io.ktor.server.auth.*
import io.ktor.server.routing.*
import parkflex.routes.history.historyRoutes
import parkflex.routes.report.userReportRoutes
import parkflex.routes.reservation.reservationRoutes
import parkflex.routes.reservation.spotRoutes
import parkflex.routes.reservation.spotsRoutes
import parkflex.routes.term.arrivalRoutes
import parkflex.routes.term.leaveRoutes
import parkflex.routes.term.quickReservationRoutes

/**
 * Routes for the REST API.
 */
fun Route.apiRoutes() {
    route("/admin") {
        adminRoutes()
    }

    route("report") {
        userReportRoutes()
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

    route("/historyEntry") {
        authenticate {
            historyRoutes()
        }
    }

    route("/reservation") {
        authenticate {
            reservationRoutes()
        }
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
        authenticate {
            arrivalRoutes()
        }
    }

    route("/leave") {
        authenticate {
            leaveRoutes()
        }
    }

    route("/prelude") {
        authenticate {
            preludeRoutes()
        }
    }

    route("/payment") {
        authenticate {
            paymentRoutes()
        }
    }
}

