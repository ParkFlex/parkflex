package parkflex

import parkflex.routes.*

import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.calllogging.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction
import org.slf4j.event.Level
import parkflex.db.DemoNoteTable
import parkflex.models.ApiErrorModel

/**
 * This is the entrypoint of our program. Here we create the HTTP server and start it.
 * If you are using Intellij Idea, you can click the start button next to `fun main(args...`
 * to start the program.
 */
fun main(args: Array<String>) {

    // Create a new HTTP server
    val server = embeddedServer(Netty, port = 8080) {
        /* Install plugins */

        // Print http requests to console
        install(CallLogging) {
            level = Level.INFO

        }

        // Allow sending/receiving JSON
        install(ContentNegotiation) {
            json()
        }

        // Pages for specific errors
        install(StatusPages) {

            /* This will catch any exception thrown during processing routes
             * and send the exception to the client.
             */
            exception<Throwable> { call, cause ->
                val msg: String = cause.message ?: "No message"
                call.respond(
                    status = HttpStatusCode.InternalServerError,
                    message = ApiErrorModel(msg, "main exception catch")
                )
            }
        }

        /* Connect to database */
        Database.connect(
            url = "jdbc:h2:mem:test;DB_CLOSE_DELAY=-1",
            driver = "org.h2.Driver",
            user = "root" ,
            password = ""
        )

        /* Create database tables */
        runDB {
            SchemaUtils.create(DemoNoteTable)
        }


        /* Configure routes */
        routing {
            // Route for our frontend (html, css, js)
            route("/web") {
                frontendRoutes()
            }

            // Route for API calls
            route("/api") {
                apiRoutes()
            }

            /// If someone goes to "/" then redirect them to the frontend
            get("/") {
                call.respondRedirect("/web/")
            }
        }
    } //end of val server = ...

    // Start the created http server
    server.start(wait = true)
}