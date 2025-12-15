package parkflex.models
import kotlinx.serialization.*


@Serializable
data class UserListEntry(
    val plate: String, val role: String,
    val blocked: Boolean,
    val name: String,
    val mail: String,
    val currentPenalty: Penalty?,
    val numberOfPastReservations : Int?,
    val numberOfFutureReservations : Int?,
    val numberOfPastBans :Int?,
    val currentReservation: Boolean)
