package parkflex

import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import kotlinx.coroutines.DelicateCoroutinesApi
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import kotlinx.coroutines.withTimeout
import org.jetbrains.exposed.sql.Database
import parkflex.config.AppConfig
import parkflex.config.TestConfig

import parkflex.modules.*
import parkflex.service.NotArrivedService
import parkflex.service.TermService
import kotlin.time.Duration

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
@OptIn(DelicateCoroutinesApi::class)
suspend fun Application.root() {
    val config = AppConfig()

    configureCallLogging(config)
    configureCORS(config)
    configureDB(config)
    configureJSON()
    configureSSE()
    configureAuth(config)
    configureRouting()
    configureStatusPages()

    GlobalScope.launch(Dispatchers.IO) {
        NotArrivedService.launch()
    }

    TermService.entry.generate()
    TermService.exit.generate()
}

/**
 * Trimmed module for use in tests.
 */
suspend fun Application.configureTest(db: Database? = null) {
    configureDB(TestConfig, db)
    configureJSON()
    configureSSE()
    configureStatusPages()
    configureAuth(TestConfig)
    configureRouting()

    TermService.entry.generate()
    TermService.exit.generate()
}
