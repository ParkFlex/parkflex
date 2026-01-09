package parkflex.config

import org.slf4j.event.Level


/**
 * Application configuration object.
 * Reads configuration values from environment variables.
 */
class AppConfig : Config {
    private val logger = org.slf4j.LoggerFactory.getLogger("AppConfig")

    private fun getenvWrapped(name: String): String? = runCatching { System.getenv(name) }.getOrNull()

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

    override val ENABLE_H2_SOCKETS: Boolean = runCatching {
        System.getenv("ENABLE_H2_SOCKETS").toBoolean()
    }.getOrElse { true }

    override val CALL_LOG_LEVEL: Level = runCatching {
        when (System.getenv("CALL_LOG_LEVEL").lowercase()) {
            "info" -> Level.INFO
            "debug" -> Level.DEBUG
            "warn" -> Level.WARN
            "trace" -> Level.TRACE
            else -> Level.INFO
        }
    }.getOrElse { Level.INFO }

    override val adminData: Pair<String, String> by lazy {
        val mail = getenvWrapped("PARKFLEX_ADMIN_MAIL") ?: "admin"
        val passwd: String = getenvWrapped("PARKFLEX_ADMIN_PASSWORD") ?: genPasswd()

        mail to passwd
    }
}