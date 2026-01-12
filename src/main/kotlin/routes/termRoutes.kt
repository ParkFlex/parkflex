package parkflex.routes

import io.ktor.server.routing.Route
import io.ktor.server.routing.route
import io.ktor.server.sse.*
import io.ktor.sse.*
import parkflex.service.TermService

fun Route.termRoutes() {
    route("/entry") {
        sse {
            heartbeat {
                period = TermService.heartbeat.period
                event = TermService.heartbeat.event
            }

            TermService.entry.ensureNotEmpty()

            TermService.entry.map {
                send(ServerSentEvent(it))
            }
        }
    }

    route("/exit") {
        sse {
            heartbeat {
                period = TermService.heartbeat.period
                event = TermService.heartbeat.event
            }

            TermService.exit.ensureNotEmpty()

            TermService.exit.map {
                send(ServerSentEvent(it))
            }
        }
    }
}