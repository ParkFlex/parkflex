package parkflex.config

object AppConfig {
    private val logger = org.slf4j.LoggerFactory.getLogger("ApplicationConfig")

    private fun getenvWrapped(name: String): String? = runCatching { System.getenv(name) }.getOrNull()

    data class MariaDBConfig(
        val host: String,
        val port: String,
        val database: String,
        val user: String,
        val password: String
    )

    val mariaDB: MariaDBConfig? = run {
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

    val ENABLE_MOCK_DATA: Boolean = run {
        val envValue = System.getenv("ENABLE_MOCK_DATA")
        logger.info("Environment variable ENABLE_MOCK_DATA = '$envValue'")
        val result = envValue?.toBoolean() ?: false
        logger.info("Mock data enabled: $result")
        result
    }
}