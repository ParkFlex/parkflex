package parkflex

import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import parkflex.config.AppConfig
import parkflex.config.TestConfig

import parkflex.modules.*

/**
 * This is the entrypoint of our program. Here we create the HTTP server and start it.
 * If you are using Intellij Idea, you can click the start button next to `fun main(args...`
 * to start the program.
 */
fun main(args: Array<String>) {
    // Create and start new HTTP server
    embeddedServer(Netty, port = 8080, module = Application::root).start(wait = true)
}

/**
 * Root module of our application.
 */
suspend fun Application.root() {
    val config = AppConfig()

    configureCallLogging(config)
    configureCORS(config)
    configureDB(config)
    configureJSON()
    configureAuth()
    configureRouting()
    configureStatusPages()
}

/**
 * Trimmed module for use in tests.
 */
suspend fun Application.configureTest() {
    configureDB(TestConfig)
    configureJSON()
    configureRouting()
}