package parkflex.models
import java.util.Date

data class Penalty(val reservation: Long, val reason: String, val paid: Boolean, val due: Date, val fine: Double)