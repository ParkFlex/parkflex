package parkflex.service

import io.ktor.sse.*
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.channels.Channel.Factory.CONFLATED
import kotlinx.coroutines.channels.consumeEach
import java.util.*
import kotlin.time.Duration.Companion.seconds

object TermService {
    object heartbeat {
        val period = 10.seconds
        val event = ServerSentEvent("hi")
    }

    sealed class RichChannel(val chan: Channel<String>) {
        private var current: String? = null

        fun isCurrent(token: String) = current == token

        suspend fun send(token: String) {
            chan.send(token)
            current = token // shouldn't be an issue in real life, but you know
        }

        suspend inline fun consumeEach(block: (String) -> Unit) = chan.consumeEach(block)

        suspend fun generate() = send(UUID.randomUUID().toString())
    }

    object entry : RichChannel(Channel(CONFLATED)) // bite me
    object exit : RichChannel(Channel(CONFLATED))
}