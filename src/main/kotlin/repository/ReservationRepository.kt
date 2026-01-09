package parkflex.repository

import parkflex.db.ReservationEntity
import java.time.LocalDate

object ReservationRepository {
    fun forDate(date: LocalDate): List<ReservationEntity> =
        ReservationEntity
            .all()
            .filter { it.start.toLocalDate().isEqual(date) }
}