package parkflex.config

import org.slf4j.event.Level


/**
 * Application configuration object.
 * Reads configuration values from environment variables.
 */
class AppConfig : Config {
    private val logger = org.slf4j.LoggerFactory.getLogger("AppConfig")

    /**
     * Safely retrieves an environment variable value.
     * 
     * @param name The name of the environment variable
     * @return The value of the environment variable, or null if not set or on error
     */
    private fun getenvWrapped(name: String): String? = runCatching { System.getenv(name) }.getOrNull()

    /**
     * Generates a random secure password for the admin account.
     * Password contains 5 lowercase, 5 uppercase, 5 numeric, and 5 special characters, shuffled randomly.
     * 
     * @return Generated password string
     */
    fun genPasswd(): String {
        val lower = ('a'..'z').toList()
        val upper = ('A'..'Z').toList()
        val nums = ('0'..'9').toList()
        val syms = ('!'..'/') + (':'..'@') + ('['..'`') + ('{'..'~')

        val passwd = listOf(
            5 to lower,
            5 to upper,
            5 to nums,
            5 to syms
        )
            .map { pair -> (1..pair.first).map { pair.second.random() } }
            .fold(emptyList<Char>()) { acc, current -> acc + current }
            .shuffled()
            .joinToString("")

        logger.info("Generated admin password: \"$passwd\". Store it in a secure place, you won't be able to view it later.")

        return passwd
    }

    /**
     * MariaDB configuration loaded from environment variables.
     * If any required variable is missing, falls back to H2 in-memory database.
     * 
     * Required environment variables:
     * - PARKFLEX_DB_HOST
     * - PARKFLEX_DB_PORT
     * - PARKFLEX_DB_DATABASE
     * - PARKFLEX_DB_USER
     * - PARKFLEX_DB_PASSWORD
     */
    override val mariaDB: MariaDBConfig? = run {
        val cfg = listOf(
            "host" to getenvWrapped("PARKFLEX_DB_HOST"),
            "port" to getenvWrapped("PARKFLEX_DB_PORT"),
            "database" to getenvWrapped("PARKFLEX_DB_DATABASE"),
            "user" to getenvWrapped("PARKFLEX_DB_USER"),
            "password" to getenvWrapped("PARKFLEX_DB_PASSWORD"),
        )

        val validated = ConfigValidation.process(cfg) {
            "Detected partial MariaDB config: $it not set"
        }

        validated.bracket(
            onEmpty = { null },
            onErrors = { errors, _ ->
                errors.forEach { e -> logger.warn(e) }
                null
            },
            onSuccess = {
                MariaDBConfig(
                    it.getValue("host"),
                    it.getValue("port"),
                    it.getValue("database"),
                    it.getValue("user"),
                    it.getValue("password")
                )
            }
        )
    }

    /**
     * List of allowed CORS hosts loaded from PARKFLEX_HOSTS environment variable.
     * Multiple hosts should be separated by commas.
     * Defaults to empty list if not set.
     */
    override val hosts: List<String> = runCatching {
        System.getenv("PARKFLEX_HOSTS").split(",")
    }.getOrDefault(emptyList())

    /**
     * Whether to populate the database with mock data on startup.
     * Set environment variable ENABLE_MOCK_DATA=true to enable.
     * Default: false
     */
    override val ENABLE_MOCK_DATA: Boolean = run {
        val envValue = System.getenv("ENABLE_MOCK_DATA")
        logger.info("Environment variable ENABLE_MOCK_DATA = '$envValue'")
        val result = envValue?.toBoolean() ?: false
        logger.info("Mock data enabled: $result")
        result
    }

    /**
     * Whether to enable H2 database socket connections for remote access.
     * Set environment variable ENABLE_H2_SOCKETS=false to disable.
     * Default: true
     */
    override val ENABLE_H2_SOCKETS: Boolean = runCatching {
        System.getenv("ENABLE_H2_SOCKETS").toBoolean()
    }.getOrElse { true }

    /**
     * HTTP call logging level configured via CALL_LOG_LEVEL environment variable.
     * Supported values: info, debug, warn, trace
     * Default: INFO
     */
    override val CALL_LOG_LEVEL: Level = runCatching {
        when (System.getenv("CALL_LOG_LEVEL").lowercase()) {
            "info" -> Level.INFO
            "debug" -> Level.DEBUG
            "warn" -> Level.WARN
    /**
     * Admin account credentials loaded from environment variables.
     * - PARKFLEX_ADMIN_MAIL: Admin email (defaults to "admin")
     * - PARKFLEX_ADMIN_PASSWORD: Admin password (generates random if not set)
     * 
     * Returns a pair of (email, password).
     */
            "trace" -> Level.TRACE
            else -> Level.INFO
        }
    }.getOrElse { Level.INFO }

    override val adminData: Pair<String, String> by lazy {
        val mail = getenvWrapped("PARKFLEX_ADMIN_MAIL") ?: "admin"
        val passwd: String = getenvWrapped("PARKFLEX_ADMIN_PASSWORD") ?: genPasswd()

        mail to passwd
    }

    val jwtIssuer: String = getenvWrapped("PARKFLEX_JWT_ISSUER") ?: "parkflex"
    val jwtSecret: String = getenvWrapped("PARKFLEX_JWT_SECRET") ?: "#!@secret!31#$"
    val jwtExpiresMs: Long =
        getenvWrapped("PARKFLEX_JWT_EXPIRES_MS")?.toLong() ?: (7 * 24 * 3600 * 1000L)
}
