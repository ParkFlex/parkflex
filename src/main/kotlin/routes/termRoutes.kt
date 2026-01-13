package parkflex.routes

import io.ktor.server.routing.Route
import io.ktor.server.routing.route
import io.ktor.server.sse.*
import io.ktor.sse.*
import parkflex.service.TermService

/**
 * Routes for terminal/device Server-Sent Events (SSE) streams.
 * Provides real-time token updates to entry and exit gate devices.
 * 
 * Endpoints:
 * - SSE /term/entry - Entry gate token stream
 * - SSE /term/exit - Exit gate token stream
 */
fun Route.termRoutes() {
    // SSE stream for entry gate tokens
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

    // SSE stream for exit gate tokens
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