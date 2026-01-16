package parkflex.routes

import io.ktor.server.routing.*
import parkflex.routes.admin.*

fun Route.adminRoutes() {
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

    route("/parameter") {
        parameterRoutes()
    }

    route("/penalty") {
        penaltyCreationRoutes()
    }
}