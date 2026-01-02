package parkflex.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import parkflex.getRealIp

/**
 * Routes for IP address information.
 * Used to verify proper IP detection behind Cloudflare reverse proxy.
 * 
 * TODO: This is a temporary testing endpoint - remove in future after verification
 */
fun Route.ipRoutes() {
    get {
        // Use getRealIp() extension function to get real client IP
        val realIp = call.getRealIp()
        val directIp = call.request.local.remoteHost
        
        // Headers for debugging
        val cfConnectingIp = call.request.headers["CF-Connecting-IP"]
        val xForwardedFor = call.request.headers["X-Forwarded-For"]
        val xRealIp = call.request.headers["X-Real-IP"]
        
        val response = buildString {
            appendLine("Your IP Address: $realIp")
            appendLine()
            appendLine("Debug Info:")
            appendLine("getRealIp() result: $realIp")
            appendLine("Direct connection IP: $directIp")
            appendLine()
            appendLine("Headers received:")
            cfConnectingIp?.let { appendLine("CF-Connecting-IP: $it") }
            xForwardedFor?.let { appendLine("X-Forwarded-For: $it") }
            xRealIp?.let { appendLine("X-Real-IP: $it") }
        }
        
        call.respondText(response, ContentType.Text.Plain, HttpStatusCode.OK)
    }
}
