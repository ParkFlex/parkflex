package parkflex.service

import io.ktor.sse.ServerSentEvent
import kotlinx.coroutines.channels.Channel
import kotlin.time.Duration.Companion.seconds

object TermService {
    object heartbeat {
        val period = 10.seconds
        val event = ServerSentEvent("hi")
    }

    val entryChannel = Channel<String>()

    val exitChannel = Channel<String>()
}