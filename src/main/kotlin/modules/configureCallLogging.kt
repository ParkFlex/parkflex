package parkflex.modules

import io.ktor.server.application.*
import io.ktor.server.plugins.calllogging.CallLogging
import org.slf4j.event.Level
import parkflex.config.Config

fun Application.configureCallLogging(config: Config) = install(CallLogging) {
    level = config.CALL_LOG_LEVEL
}
