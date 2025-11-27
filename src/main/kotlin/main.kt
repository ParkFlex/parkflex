package parkflex

import parkflex.routes.*

import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.calllogging.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.plugins.swagger.*
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction
import org.slf4j.event.Level
import parkflex.config.AppConfig
import parkflex.data.generateMockData
import parkflex.db.DemoNoteTable
import parkflex.db.ParameterTable
import parkflex.db.PenaltyTable
import parkflex.db.ReservationTable
import parkflex.db.SpotTable
import parkflex.db.UserTable
import parkflex.models.ApiErrorModel

/**
 * This is the entrypoint of our program. Here we create the HTTP server and start it.
 * If you are using Intellij Idea, you can click the start button next to `fun main(args...`
 * to start the program.
 */
fun main(args: Array<String>) {
    val logger = org.slf4j.LoggerFactory.getLogger("main")

    // Create a new HTTP server
    val server = embeddedServer(Netty, port = 8080) {
        /* Install plugins */

        // Print http requests to console
        install(CallLogging) {
            level = Level.INFO
        }

        // Enable CORS for frontend
        install(CORS) {
            allowHost("localhost:5173", schemes = listOf("http"))
            allowHeaders( { true } )
            allowMethod(HttpMethod.Get)
            allowMethod(HttpMethod.Post)
            allowMethod(HttpMethod.Put)
            allowMethod(HttpMethod.Delete)
            allowMethod(HttpMethod.Patch)
            allowMethod(HttpMethod.Options)
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

        /* Setup DB connection */

        if (AppConfig.mariaDB == null) {
            logger.info("No MariaDB config found. Connecting to in-memory H2 database")

            Database.connect(
                url = "jdbc:h2:mem:test;DB_CLOSE_DELAY=-1",
                driver = "org.h2.Driver",
                user = "root",
                password = ""
            )

            org.h2.tools.Server.createTcpServer("-tcpPort", "9091", "-tcpAllowOthers").start()
            org.h2.tools.Server.createWebServer("-webPort", "8081", "-webAllowOthers").start()
        } else {
            val mdb = AppConfig.mariaDB

            logger.info("MariaDB config found. Connecting to jdbc:mariadb://${mdb.host}:${mdb.port}/${mdb.database}")

            Database.connect(
                url = "jdbc:mariadb://${mdb.host}:${mdb.port}/${mdb.database}",
                driver = "org.mariadb.jdbc.Driver",
                user = mdb.user,
                password = mdb.password
            )
        }

        /* Create database tables */
        transaction {
            logger.info("Making sure that database schema is present...")
            SchemaUtils.create(
                DemoNoteTable,
                SpotTable,
                UserTable,
                ReservationTable,
                PenaltyTable,
                ParameterTable
            )
            logger.info("Database schema is present")

            /* Generate mock data if enabled */
            if (AppConfig.ENABLE_MOCK_DATA) {
                generateMockData()
                logger.info("Mock data generation completed")
            } else {
                logger.info("Mock data generation is disabled")
            }
        }

        /* Configure routes */
        routing {
            // Route for our frontend (html, css, js)
            frontendRoutes()

            // Route for API calls
            route("/api") {
                apiRoutes()
            }

            // API documentation
            swaggerUI(path = "swagger", swaggerFile = "openapi/generated.json")
        }
    } //end of val server = ...

    // Start the created http server
    server.start(wait = true)
}