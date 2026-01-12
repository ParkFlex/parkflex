package parkflex.service

import io.ktor.sse.*
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.channels.Channel.Factory.CONFLATED
import java.util.*
import kotlin.time.Duration.Companion.milliseconds

object TermService {
    object heartbeat {
        val period = 200.milliseconds
        val event = ServerSentEvent("hi")
    }

    sealed class RichChannel(val chan: Channel<String>) {
        @Volatile
        private var current: String? = null

        fun isCurrent(token: String) = current == token

        suspend fun send(token: String) {
            chan.send(token)
            current = token // shouldn't be an issue in real life, but you know
        }

        suspend inline fun map(block: (String) -> Unit) {
            for (str in chan) block(str)
        }

        suspend fun generate() = send(UUID.randomUUID().toString())

        @OptIn(ExperimentalCoroutinesApi::class)
        suspend fun ensureNotEmpty() {
            if (chan.isEmpty && current != null) send(current!!) // possible race
        }
    }

    object entry : RichChannel(Channel(CONFLATED)) // bite me
    object exit : RichChannel(Channel(CONFLATED))
}