package parkflex.repository

import parkflex.db.ReservationEntity
import java.time.LocalDate

/**
 * Repository for querying reservations.
 */
object ReservationRepository {
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
}