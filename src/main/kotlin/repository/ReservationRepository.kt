package parkflex.repository

import parkflex.db.ReservationEntity
import parkflex.db.ReservationTable
import parkflex.db.UserEntity
import parkflex.db.UserTable
import java.time.LocalDate
import java.time.LocalDateTime

/**
 * Repository for querying reservations.
 */
object ReservationRepository {
    enum class TimeRelation {
        Past, Present
    }
    /**
     * Retrieves all reservations for a specific date.
     *
     * @param date Date to query reservations for
     * @return List of reservations starting on the given date
     */
    fun forDate(date: LocalDate): List<ReservationEntity> =
        ReservationEntity
            .all()
            .filter { it.start.toLocalDate().isEqual(date) }

    /**
     * Returns the last reservation for [plate] that happened **before** [timestamp]
     * or that is in progress at the time of [timestamp] along with the information
     * whether the reservation happened in the past or at the time of [timestamp].
     *
     * Returns [null] if no reservation matching the criteria is found.
     */
    fun getNearest(plate: String, timestamp: LocalDateTime): Pair<ReservationEntity, TimeRelation>? =
        UserEntity
            .find { UserTable.plate eq plate }.singleOrNull()
            ?.let { user ->
                ReservationEntity
                    .find { ReservationTable.user eq user.id }
                    .filter { it.start.isBefore(timestamp) }
                    .sortedBy { it.start }
                    .lastOrNull { it.start.isBefore(timestamp) }
            }?.let { reservation ->
                val end = reservation.start.plusMinutes(reservation.duration.toLong())

                val relation = if (timestamp.isBefore(end)) TimeRelation.Present else TimeRelation.Past

                Pair(reservation, relation)
            }

    fun getInProgress(userID: Long): ReservationEntity? =
        ReservationEntity
            .all()
            .find { it.user.id.value == userID && it.arrived != null && it.left == null }
}