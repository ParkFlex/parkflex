package parkflex.models

import kotlinx.serialization.Serializable


@Serializable
data class SpotsModel(
    val spots: List<SpotAvailability>
)

@Serializable
data class SpotAvailability(
    val id: Long,
    val role: String,
    val displayOrder: Int,
    val occupied: Boolean
)
