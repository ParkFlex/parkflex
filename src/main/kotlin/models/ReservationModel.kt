package parkflex.models

import kotlinx.serialization.Serializable

@Serializable
data class CreateReservationRequest(
    val spot_id: Long,
    val start: String,
    val duration: Long
)

@Serializable
data class ReservationResponse(
    val id: Long,
    val spot_id: Long,
    val start: String,
    val end: String 
)

@Serializable
data class CreateReservationSuccessResponse(
    val message: String,
    val reservation: ReservationResponse
)
