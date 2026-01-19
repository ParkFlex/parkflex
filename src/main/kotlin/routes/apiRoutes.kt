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

    authenticate {
        route("/admin") {
            adminRoutes()
        }

        route("report") {
            userReportRoutes()
        }
        route("/account") {
            patchAccountRoute()
        }

        route("/whoami") {
            whoAmIRoute()
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

        route("/prelude") {
            preludeRoutes()
        }

        route("/payment") {
            paymentRoutes()
        }

        route("/quickReservation") {
            quickReservationRoutes()
        }
    }

    route("/register") {
        registerRoute()
    }

    route("/login") {
        loginRoute()
    }

    route("/demo") {
        demoRoutes()
    }

}

