package parkflex.models
import kotlinx.serialization.*
import parkflex.LocalDateTimeSerializer
import java.time.LocalDateTime

@Serializable
data class Penalty(
    val reservation: Long,
    val reason: String,
    val paid: Boolean,
    @Contextual
    val due: LocalDateTime?,
    val fine: Double
)