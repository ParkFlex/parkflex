package parkflex.models.reservation

import kotlinx.serialization.Serializable

/**
 * Request model for creating a new reservation.
 *
 * @property spot_id ID of the parking spot to reserve
 * @property start Reservation start time (ISO 8601 formatted string)
 * @property duration Reservation duration in minutes
 */
@Serializable
data class CreateReservationRequest(
    val spot_id: Long,
    val start: String,
    val duration: Int
)

/**
 * Response model containing reservation details.
 *
 * @property id Reservation ID
 * @property spot_id Parking spot ID
 * @property start Reservation start time (formatted string)
 * @property end Reservation end time (formatted string)
 */
@Serializable
data class ReservationResponse(
    val id: Long,
    val spot_id: Long,
    val start: String,
    val end: String 
)

/**
 * Success response for reservation creation.
 *
 * @property message Success message
 * @property reservation Created reservation details
 */
@Serializable
data class CreateReservationSuccessResponse(
    val message: String,
    val reservation: ReservationResponse
)
