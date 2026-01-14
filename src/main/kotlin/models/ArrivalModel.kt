package parkflex.models

import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable
import parkflex.db.ReservationEntity
import java.time.LocalTime

/**
 * Status of an arrival attempt at the parking entrance.
 */
@Serializable
enum class ArrivalStatus {
    /** Arrival was successful, user has a valid reservation */
    Ok,
    
    /** User has no active reservation for current time */
    NoReservation
}

/**
 * Base class for arrival response models.
 * @property status Status of the arrival attempt
 */
@Serializable
sealed class ArrivalResponseModel(
    val status: ArrivalStatus,
)

/**
 * Response model for successful arrival.
 * Returned when user has a valid reservation for the current time.
 *
 * @property startTime Reservation start time (formatted string)
 * @property endTime Reservation end time (formatted string)
 * @property spot Parking spot ID
 */
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
        /**
         * Creates a TimeSpan from a reservation entity.
         * @param r Reservation entity to convert
         * @return TimeSpan representing the reservation's time window
         */
        fun fromReservation(r: ReservationEntity): TimeSpan {
            val start = r.start.toLocalTime()
            val end = r.end().toLocalTime()

            return TimeSpan(start, end)
        }
    }
}

/**
 * Response model when user has no current reservation.
 * Contains information about user's upcoming reservations grouped by spot.
 *
 * @property reservations Map of spot ID to list of reservation time spans
 */
@Serializable
data object NoPresentReservationModel : ArrivalResponseModel(ArrivalStatus.NoReservation)
