package parkflex.models
import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable
import java.time.LocalDateTime

@Serializable
data class PenaltyModel(
    val reservation: Long,
    val reason: String,
    val paid: Boolean,
    @Contextual
    val due: LocalDateTime,
    val fine: Double
)