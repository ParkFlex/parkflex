package parkflex.modules

import io.ktor.server.application.*
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.selectAll
import parkflex.config.Config
import parkflex.data.generateMockData
import parkflex.db.*
import parkflex.repository.UserRepository
import parkflex.runDB

private val defaultParameters =
    mapOf(
        "penalty/fine/wrongSpot" to 500, // one time fee
        "penalty/fine/overtime" to 150,  // fee per 15 of overtime
        "penalty/block/duration" to 7 * 24, // duration in hours
        "reservation/duration/min" to 30, // minutes
        "reservation/duration/max" to 720, // minutes
    )

/**
 * Connects to the database server.
 */
suspend fun Application.configureDB(config: Config) {
    val mdb = config.mariaDB

    fun ensureParameters() {
        if (ParameterTable.selectAll().count() == 0L)
            defaultParameters.forEach {
                ParameterEntity.new {
                    key = it.key
                    value = it.value.toString()
                }
            }
    }

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
        SchemaUtils.create(
            DemoNoteTable,
            SpotTable,
            UserTable,
            ReservationTable,
            PenaltyTable,
            ParameterTable,
            ReportTable
        )


        ensureParameters()

        if (UserTable.selectAll().count() == 0L) {
            log.info("User table empty, creating admin user")
            UserRepository.unsafeCreateUser(
                mail = config.adminData.first,
                fullName = "Admin Adminowski",
                password = config.adminData.second,
                role = "admin",
                plate = ""
            )
        }

        if (config.ENABLE_MOCK_DATA) generateMockData()
    }
}
