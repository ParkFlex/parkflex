package parkflex.modules

import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.route
import parkflex.runDB

fun Route.adminHistoryRoutes() {
    route("/history") {
        get {
            val historyList = runDB{

            }

        }
    }
}