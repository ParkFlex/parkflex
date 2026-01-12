package parkflex.models

import kotlinx.serialization.Serializable

/**
 * Model representing a collection of parking spots.
 * Used for endpoints that return multiple spots.
 *
 * @property spots List of spot availability information
 */
@Serializable
data class SpotsModel(
    val spots: List<SpotAvailability>
)

/**
 * Model representing current availability status of a parking spot.
 *
 * @property id Spot ID
 * @property role Spot role/type
 * @property displayOrder Order in which to display the spot in UI
 * @property occupied Whether the spot is currently occupied
 */
@Serializable
data class SpotAvailability(
    val id: Long,
    val role: String,
    val displayOrder: Int,
    val occupied: Boolean
)
