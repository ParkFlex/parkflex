package parkflex.config

/**
 * Application configuration object.
 * Reads configuration values from environment variables.
 */
object AppConfig {
    /**
     * Whether to populate the database with mock data on startup.
     * Set environment variable ENABLE_MOCK_DATA=true to enable.
     * Default: false
     */
    val ENABLE_MOCK_DATA: Boolean = run {
        val envValue = System.getenv("ENABLE_MOCK_DATA")
        println("Environment variable ENABLE_MOCK_DATA = '$envValue'")
        val result = envValue?.toBoolean() ?: false
        println("Mock data enabled: $result")
        result
    }
}

