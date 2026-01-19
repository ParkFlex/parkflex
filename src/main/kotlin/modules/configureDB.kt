package parkflex.modules

import io.ktor.server.application.*
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.selectAll
import parkflex.config.Config
import parkflex.data.generateMockData
import parkflex.db.*
import parkflex.repository.SpotRepository
import parkflex.repository.UserRepository
import parkflex.runDB

/**
 * Default system parameters loaded into the database on first startup.
 * These can be modified at runtime through admin interface.
 * 
 * Parameters:
 * - penalty/fine/wrongSpot: Fine amount for parking in wrong spot (in PLN)
 * - penalty/fine/overtime: Fine amount per 15 minutes of overtime (in PLN)
 * - penalty/fine/notArrived: Fine amount for not arriving in time (in PLN)
 * - penalty/block/duration: How long user is blocked after penalty (in hours)
 * - reservation/duration/min: Minimum reservation duration (in minutes)
 * - reservation/duration/max: Maximum reservation duration (in minutes)
 * - reservation/break/duration: Required break between reservations (in minutes)
 * - parking/layout: ASCII art representation of parking layout
 */
private val defaultParameters =
    listOf(
        Triple("penalty/fine/wrongSpot", ParameterType.Number, "500"), // one time fee
        Triple("penalty/fine/overtime", ParameterType.Number, "150"),  // fee per 15mins of overtime
        Triple("penalty/fine/notArrived", ParameterType.Number, "500"), // one time fee
        Triple("penalty/notArrived/margin", ParameterType.Number, "15"),  // how late can a person be in minutes
        Triple("penalty/block/duration", ParameterType.Number, (7 * 24).toString()), // duration in hours
        Triple("reservation/duration/min", ParameterType.Number, "30"), // minutes
        Triple("reservation/duration/max", ParameterType.Number, "720"), // minutes
        Triple("reservation/break/duration", ParameterType.Number, "15"), // minutes

        Triple("parking/layout", ParameterType.String,
                """ 
                G   1   2   3   4   5   6   7   8   9
                v   .   .   .   .   .   .   .   .  DL
                .   10  11  12  13  14  15  16  17  .
                .   19  20  21  22  23  24  25  26  .
                UR  .   .   .   .   .   .   .   .  LU
                27 28  29  30  31  32  33 !34 !35 !36
                """.trimIndent()
        )
    )

/**
 * Connects to the database server.
 */
suspend fun Application.configureDB(config: Config, db: Database? = null) {
    val mdb = config.mariaDB

    /**
     * Ensures default parameters are present in the database.
     * Populates parameter table with defaults if empty.
     */
    fun ensureParameters() {
        if (ParameterTable.selectAll().count() == 0L)
            defaultParameters.forEach { (k, t, v) ->
                ParameterEntity.new {
                    key = k
                    type = t
                    value = v
                }
            }
    }

    if (db == null) {
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


        // Populate the parameter table if empty
        ensureParameters()

        if (UserEntity.count() == 0L) {
            log.info("User table empty, creating admin user")
            UserRepository.unsafeCreateUser(
                mail = config.adminData.first,
                fullName = "Admin Adminowski",
                password = config.adminData.second,
                role = "admin",
                plate = ""
            )
        }

        if (SpotEntity.count() == 0L) {
            log.info("Spots table empty, creating parking layout")

            val layout = ParameterEntity
                .find { ParameterTable.key eq "parking/layout" }
                .single()
                .value

            SpotRepository
                .populate(layout)
                .map { log.info("Successfully populated the spots table with layout") }
                .getOrElse { log.error("Could not populate the spots table: ${it.toString()}") }
        }

        if (config.ENABLE_MOCK_DATA) generateMockData()
    }
}