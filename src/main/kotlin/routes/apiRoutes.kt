package parkflex.routes

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

        penaltyRoutes()

    }


    route("/demo") {
        demoRoutes()
    }
    route("/historyEntry"){
        historyRoutes()
    }
}