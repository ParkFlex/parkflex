package parkflex.config

import org.slf4j.event.Level

/**
 * Configuration object for test environment.
 * Uses in-memory H2 database with minimal logging and no mock data.
 */
object TestConfig : Config {
    override val mariaDB: MariaDBConfig? = null
    override val hosts: List<String> = emptyList()
    override val ENABLE_MOCK_DATA: Boolean = false
    override val ENABLE_H2_SOCKETS: Boolean = false
    override val CALL_LOG_LEVEL: Level = Level.ERROR
    override val adminData: Pair<String, String> = "admin" to ""
    override val jwtIssuer: String = "parkflex"
    override val jwtSecret: String = "#!@secret!31#$"
    override val jwtExpiresMs: Long = 7 * 24 * 3600 * 1000L
}
