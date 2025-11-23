package parkflex.modules

import io.ktor.server.application.*
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import parkflex.config.AppConfig
import parkflex.data.generateMockData
import parkflex.config.Config
import parkflex.config.MariaDBConfig
import parkflex.db.*
import parkflex.runDB

/**
 * Connects to the database server.
 */
suspend fun Application.configureDB(config: Config) {
    val mdb = config.mariaDB

    if (mdb == null) {
        log.info("No MariaDB config found. Connecting to in-memory H2 database")

        Database.connect(
            url = "jdbc:h2:mem:test;DB_CLOSE_DELAY=-1",
            driver = "org.h2.Driver",
            user = "root",
            password = ""
        )

        if (config.ENABLE_H2_SOCKETS) {
            org.h2.tools.Server.createTcpServer("-tcpPort", "9091", "-tcpAllowOthers").start()
            org.h2.tools.Server.createWebServer("-webPort", "8081", "-webAllowOthers").start()
        }
    } else {
        log.info("MariaDB config found. Connecting to jdbc:mariadb://${mdb.host}:${mdb.port}/${mdb.database}")

        Database.connect(
            url = "jdbc:mariadb://${mdb.host}:${mdb.port}/${mdb.database}",
            driver = "org.mariadb.jdbc.Driver",
            user = mdb.user,
            password = mdb.password
        )
    }

    /* Create database tables */
    runDB {
        println("Creating database tables...")
        SchemaUtils.create(
            DemoNoteTable,
            SpotTable,
            UserTable,
            ReservationTable,
            PenaltyTable,
            ParameterTable
        )
        println("Database tables created successfully")

         /* Generate mock data if enabled */
            if (AppConfig.ENABLE_MOCK_DATA) {
                generateMockData()
                println("Mock data generation completed")
            } else {
                println("Mock data generation is disabled")
            }
    }
}
