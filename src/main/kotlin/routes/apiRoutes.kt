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

//        penaltyRoutes()

    }

    // Also expose the same handler under /user/full for clarity and documentation
    route("/user/full") {
        userFullRoutes()
    }

    route("/demo") {
        demoRoutes()
    }
    route("/historyEntry"){
        historyRoutes()
    }
}