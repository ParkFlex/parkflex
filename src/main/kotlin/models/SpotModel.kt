package parkflex.models

import kotlinx.serialization.Serializable

@Serializable
data class SpotModel(
    val id : Long,
    val role : String,
    val reservations : List<SpotReservationModel>)

@Serializable
data class SpotReservationModel(
    val start: String,
    val time: Int
)