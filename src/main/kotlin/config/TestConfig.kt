package parkflex.config

import org.slf4j.event.Level

object TestConfig : Config {
    override val mariaDB: MariaDBConfig? = null
    override val hosts: List<String> = emptyList()
    override val ENABLE_MOCK_DATA: Boolean = false
    override val ENABLE_H2_SOCKETS: Boolean = false
    override val CALL_LOG_LEVEL: Level = Level.ERROR
    override val adminData: Pair<String, String> = "admin" to ""
}