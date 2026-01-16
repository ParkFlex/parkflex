package parkflex.models.admin

import kotlinx.serialization.Serializable
import parkflex.models.admin.PenaltyModel

@Serializable
data class UserListEntry(
    val id: Long,
    val plate: String,
    val role: String,
    val name: String,
    val mail: String,
    val currentPenaltyModel: PenaltyModel?,
    val numberOfPastReservations: Long,
    val numberOfFutureReservations: Long,
    val numberOfPastBans: Long,
    val currentReservation: Boolean
)