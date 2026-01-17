package parkflex.config

import org.slf4j.event.Level

/**
 * Base configuration interface for ParkFlex application.
 * Defines common configuration properties for both production and test environments.
 */
interface Config {
    /** MariaDB database configuration, null if using in-memory H2 database */
    val mariaDB: MariaDBConfig?
    
    /** List of allowed CORS hosts */
    val hosts: List<String>
    
    /** Whether to populate the database with mock data on startup */
    val ENABLE_MOCK_DATA: Boolean
    
    /** Whether to enable H2 database socket connections (for remote access) */
    val ENABLE_H2_SOCKETS: Boolean
    
    /** Logging level for HTTP call logging */
    val CALL_LOG_LEVEL: Level
    
    /** Admin credentials as (email, password) pair */
    val adminData: Pair<String, String>

    /** JWT Configuration */
    val jwtIssuer: String
    val jwtSecret: String
    val jwtExpiresMs: Long
}

/**
 * MariaDB database connection configuration.
 *
 * @property host Database server hostname or IP address
 * @property port Database server port
 * @property database Database name to connect to
 * @property user Database username for authentication
 * @property password Database password for authentication
 */
data class MariaDBConfig(
    val host: String,
    val port: String,
    val database: String,
    val user: String,
    val password: String
)
