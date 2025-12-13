package parkflex.routes

import io.ktor.http.HttpStatusCode
import io.ktor.network.sockets.Connection
import io.ktor.server.response.*
import io.ktor.server.routing.*
import parkflex.db.ReservationEntity
import parkflex.db.SpotEntity
import parkflex.models.SpotModel
import parkflex.runDB

/**
 * Routes for the REST API.
 */
fun Route.apiRoutes() {
    route("/user") {
        // some routes here
    }

    route("/demo") {
        demoRoutes()
    }

    route("/reservation") {
        reservationRoutes()
    }

    route("/spot") {
        spotRoutes()
    }

}