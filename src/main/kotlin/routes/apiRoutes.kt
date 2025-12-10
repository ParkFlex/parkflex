package parkflex.routes

import io.ktor.server.response.*
import io.ktor.server.routing.*

/**
 * Routes for the REST API.
 */
fun Route.apiRoutes() {
    route("/user") {
        // some routes here
        userFullRoutes()
        get("/{id}"){
            val id = call.parameters["id"]
        }
        route("/penalty") {
            Penalty()
        }
    }


    route("/demo") {
        demoRoutes()
    }
}