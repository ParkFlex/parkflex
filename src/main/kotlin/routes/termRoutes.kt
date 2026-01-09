package parkflex.routes

import io.ktor.server.application.*
import io.ktor.server.routing.Route
import io.ktor.server.routing.route
import io.ktor.server.sse.*
import io.ktor.sse.*
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.channels.consumeEach
import kotlinx.coroutines.launch
import parkflex.service.TermService

fun Route.termRoutes() {
    route("/entry") {
        sse {
            heartbeat {
                period = TermService.heartbeat.period
                event = TermService.heartbeat.event
            }

            TermService.entry.consumeEach {
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

            TermService.exit.consumeEach {
                send(ServerSentEvent(it))
            }
        }

    }
}