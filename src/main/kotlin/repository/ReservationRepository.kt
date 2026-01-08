package parkflex.repository

import parkflex.db.ReservationEntity
import parkflex.db.ReservationTable
import parkflex.db.UserEntity
import parkflex.db.UserTable
import java.time.LocalDateTime

object ReservationRepository {
    enum class TimeRelation {
        Past, Present
    }

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
                    .sortedBy { it.start }
                    .firstOrNull { it.start.isBefore(timestamp) }
            }?.let { reservation ->
                val end = reservation.start.plusMinutes(reservation.duration.toLong())

                val relation = if (timestamp.isBefore(end)) TimeRelation.Present else TimeRelation.Past

                Pair(reservation, relation)
            }
}