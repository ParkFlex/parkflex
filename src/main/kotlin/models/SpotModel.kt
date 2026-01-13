package parkflex.models

import kotlinx.serialization.Serializable

/**
 * Model representing a parking spot with its reservations.
 *
 * @property id Spot ID
 * @property role Spot role/type (e.g., "standard", "disabled", "electric")
 * @property reservations List of current and upcoming reservations for this spot
 */
@Serializable
data class SpotModel(
    val id : Long,
    val role : String,
    val reservations : List<SpotReservationModel>)

/**
 * Model representing a reservation time slot for a spot.
 *
 * @property start Reservation start time (formatted string)
 * @property time Duration in minutes (TODO: inconsistent with other models using 'duration')
 */
@Serializable
data class SpotReservationModel(
    val start: String,
    val time: Int
)