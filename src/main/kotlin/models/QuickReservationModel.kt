package parkflex.models

import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable
import java.time.LocalTime

@Serializable
data class QuickReservationModel(
    val spot: Long,
    @Contextual
    val end: LocalTime,
)
