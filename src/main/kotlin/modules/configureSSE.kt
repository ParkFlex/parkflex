package parkflex.modules

import io.ktor.server.application.*
import io.ktor.server.sse.SSE

fun Application.configureSSE() = install(SSE)