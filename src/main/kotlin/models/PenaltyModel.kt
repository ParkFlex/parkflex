package parkflex.models
import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable
import parkflex.db.PenaltyReason
import java.time.LocalDateTime

@Serializable
data class PenaltyModel(
    val id: Long,
    val reservation: Long,
    val reason: PenaltyReason,
    val paid: Boolean,
    @Contextual
    val due: LocalDateTime,
    val fine: Double
)