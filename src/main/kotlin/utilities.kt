package parkflex

import io.ktor.server.application.*
import io.ktor.server.request.*
import kotlinx.coroutines.Dispatchers
import kotlinx.serialization.KSerializer
import kotlinx.serialization.descriptors.PrimitiveKind
import kotlinx.serialization.descriptors.PrimitiveSerialDescriptor
import kotlinx.serialization.descriptors.SerialDescriptor
import kotlinx.serialization.encoding.Decoder
import kotlinx.serialization.encoding.Encoder
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import java.time.LocalDateTime
import java.time.LocalTime
import java.time.format.DateTimeFormatter

/**
 * Runs the provided database transaction.
 *
 * All operations on database entities have to be run inside the `runDB` block.
 *
 * Example
 * ```
 * val user: UserEntity? = runDB {
 *    UserEntity.findById(1)
 * }
 * ```
 */
suspend fun <T> runDB(block: Transaction.() -> T): T =
    newSuspendedTransaction(Dispatchers.IO, statement = block)

/**
 * Gets the real client IP address from reverse proxy headers.
 * 
 * When the application is behind a reverse proxy (like Cloudflare, nginx),
 * use this function instead of call.request.local.remoteHost to get the actual client IP.
 * 
 * Priority order:
 * 1. CF-Connecting-IP (Cloudflare's real client IP)
 * 2. X-Real-IP (nginx and other proxies)
 * 3. X-Forwarded-For (standard proxy header, takes first IP)
 * 4. Direct connection IP (fallback)
 * 
 * @return The real client IP address
 */
fun ApplicationCall.getRealIp(): String {
    val headers = request.headers
    return headers["CF-Connecting-IP"]
        ?: headers["X-Real-IP"]
        ?: headers["X-Forwarded-For"]?.split(",")?.firstOrNull()?.trim()
        ?: request.local.remoteHost
}


object LocalDateTimeSerializer : KSerializer<LocalDateTime> {
    override val descriptor: SerialDescriptor = PrimitiveSerialDescriptor("LocalDateTime", PrimitiveKind.STRING)

    override fun serialize(encoder: Encoder, value: LocalDateTime) {
        encoder.encodeString(value.format(DateTimeFormatter.ISO_DATE_TIME))
    }

    override fun deserialize(decoder: Decoder): LocalDateTime =
        LocalDateTime.parse(decoder.decodeString(), DateTimeFormatter.ISO_DATE_TIME)


}
object LocalTimeSerializer : KSerializer<LocalTime> {
    override val descriptor: SerialDescriptor = PrimitiveSerialDescriptor("LocalTime", PrimitiveKind.STRING)

    override fun serialize(encoder: Encoder, value: LocalTime) {
        encoder.encodeString(value.format(DateTimeFormatter.ofPattern("HH:mm")))
    }

    override fun deserialize(decoder: Decoder): LocalTime =
        LocalTime.parse(decoder.decodeString(), DateTimeFormatter.ofPattern("HH:mm"))

}
