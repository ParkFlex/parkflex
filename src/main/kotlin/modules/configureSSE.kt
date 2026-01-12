package parkflex.modules

import io.ktor.server.application.*
import io.ktor.server.sse.SSE

/**
 * Configures Server-Sent Events (SSE) support for the application.
 * SSE allows server to push real-time updates to clients.
 */
fun Application.configureSSE() = install(SSE)