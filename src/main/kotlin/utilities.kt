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
 * Pobiera rzeczywisty adres IP klienta z nagłówków reverse proxy.
 * 
 * Gdy aplikacja działa za reverse proxy (np. Cloudflare, nginx),
 * użyj tej funkcji zamiast `call.request.local.remoteHost`, aby uzyskać
 * prawdziwy adres IP klienta końcowego.
 * 
 * Funkcja sprawdza nagłówki HTTP w następującej kolejności priorytetów:
 * 1. `CF-Connecting-IP` - rzeczywisty IP klienta od Cloudflare
 * 2. `X-Real-IP` - używany przez nginx i inne proxy
 * 3. `X-Forwarded-For` - standardowy nagłówek proxy (pobiera pierwszy IP z listy)
 * 4. `request.local.remoteHost` - bezpośrednie połączenie (fallback)
 * 
 * @receiver ApplicationCall Kontekst wywołania aplikacji Ktor
 * @return Adres IP klienta jako String
 * 
 * @since 1.0
 * @author ParkFlex Team
 * 
 * Przykład użycia:
 * ```kotlin
 * get("/api/endpoint") {
 *     val clientIp = call.getRealIp()
 *     logger.info("Request from IP: $clientIp")
 * }
 * ```
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