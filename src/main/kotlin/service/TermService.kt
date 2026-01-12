package parkflex.service

import io.ktor.sse.*
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.channels.Channel.Factory.CONFLATED
import kotlinx.coroutines.channels.consumeEach
import java.util.*
import kotlin.time.Duration.Companion.seconds

/**
 * Service for managing terminal/gate security tokens via Server-Sent Events.
 * Provides rotating tokens for entry and exit gates to prevent unauthorized access.
 */
object TermService {
    /**
     * Configuration for SSE heartbeat messages.
     * Keeps connection alive and helps detect disconnections.
     */
    object heartbeat {
        val period = 10.seconds
        val event = ServerSentEvent("hi")
    }

    /**
     * Enhanced channel for distributing security tokens to gate devices.
     * Maintains current token and provides validation.
     * 
     * @property chan Underlying Kotlin channel for token distribution
     */
    sealed class RichChannel(val chan: Channel<String>) {
        /**
         * Currently active token. Used for validation.
         */
        @Volatile
        private var current: String? = null

        /**
         * Checks if provided token matches the current active token.
         * @param token Token to validate
         * @return true if token is current and valid
         */
        fun isCurrent(token: String) = current == token

        /**
         * Sends a new token to all subscribed devices and updates current token.
         * @param token Token to send
         */
        suspend fun send(token: String) {
            chan.send(token)
            current = token // shouldn't be an issue in real life, but you know
        }

        /**
         * Consumes tokens from the channel as they arrive.
         * @param block Action to perform for each received token
         */
        suspend inline fun consumeEach(block: (String) -> Unit) = chan.consumeEach(block)

        /**
         * Generates and sends a new random UUID token.
         * This invalidates the previous token for security.
         */
        suspend fun generate() = send(UUID.randomUUID().toString())
    }

    /** Token channel for entry gate */
    object entry : RichChannel(Channel(CONFLATED))
    
    /** Token channel for exit gate */
    object exit : RichChannel(Channel(CONFLATED))
}