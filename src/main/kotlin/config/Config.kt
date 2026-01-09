package parkflex.config

import org.slf4j.event.Level

interface Config {
    val mariaDB: MariaDBConfig?
    val hosts: List<String>
    val ENABLE_MOCK_DATA: Boolean
    val ENABLE_H2_SOCKETS: Boolean
    val CALL_LOG_LEVEL: Level
    val adminData: Pair<String, String>
}

data class MariaDBConfig(
    val host: String,
    val port: String,
    val database: String,
    val user: String,
    val password: String
)
