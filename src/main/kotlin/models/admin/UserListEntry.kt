package parkflex.models.admin

import kotlinx.serialization.Serializable

@Serializable
data class UserListEntry(
    val id: Long,
    val plate: String,
    val role: String,
    val name: String,
    val mail: String,
    val currentPenalty: PenaltyModel?,
    val numberOfPastReservations: Long,
    val numberOfFutureReservations: Long,
    val numberOfPastBans: Long,
    val currentReservation: Boolean
)