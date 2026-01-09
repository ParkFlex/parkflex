package parkflex.models

import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable
import parkflex.db.ReservationEntity
import java.time.LocalTime

@Serializable
enum class ArrivalStatus {
    Ok, NoReservation
}

@Serializable
sealed class ArrivalResponseModel(
    val status: ArrivalStatus,
)

@Serializable
data class SuccessfulArrivalModel(
    val startTime: String,
    val endTime: String,
    val spot: Long
) : ArrivalResponseModel(ArrivalStatus.Ok)

@Serializable
data class TimeSpan(
    @Contextual
    val start: LocalTime,
    @Contextual
    val end: LocalTime
) {
    companion object {
        fun fromReservation(r: ReservationEntity): TimeSpan {
            val start = r.start.toLocalTime()
            val end = r.end().toLocalTime()

            return TimeSpan(start, end)
        }
    }
}

@Serializable
data class NoPresentReservationModel(
    val reservations: Map<Long, List<TimeSpan>>
) : ArrivalResponseModel(ArrivalStatus.NoReservation)
