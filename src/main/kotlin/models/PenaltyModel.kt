package parkflex.models
import java.time.LocalDateTime

data class PenaltyModel(val reservation: Long, val reason: String, val paid: Boolean, val due: LocalDateTime, val fine: Double)