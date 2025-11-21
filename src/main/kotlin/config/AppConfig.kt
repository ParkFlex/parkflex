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
    val ENABLE_MOCK_DATA: Boolean = System.getenv("ENABLE_MOCK_DATA")?.toBoolean() ?: false
}

