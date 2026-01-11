package parkflex.service

import parkflex.db.PenaltyEntity
import parkflex.db.PenaltyReason
import parkflex.db.ReservationEntity
import parkflex.repository.ParameterRepository
import parkflex.runDB
import java.time.Duration
import java.time.LocalDateTime

object PenaltyService {
    /***
     * Creates a penalty if an overtime is detected.
     *
     * @param reservation Reservation for which the overtime is calculated. The [ReservationEntity.left] field must not be null.
     * @param timestamp Point in time at which the penalty is being applied.
     *
     * @return Created penalty or `null`
     */
    suspend fun processOvertime(reservation: ReservationEntity, timestamp: LocalDateTime): PenaltyEntity? = runDB {
        val breakTime = ParameterRepository.get("reservation/break/duration")?.toLong()!!

        val overtimeMinutes = Duration.between(reservation.end().plusMinutes(breakTime), reservation.left).toMinutes()

        if (overtimeMinutes > 0) {
            val per15min = ParameterRepository.get("penalty/fine/overtime")?.toLong()!!
            val fine = (overtimeMinutes / 15) * per15min

            val penaltyHours = ParameterRepository.get("penalty/block/duration")?.toLong()!!

            val due = timestamp.plusHours(penaltyHours)

            PenaltyEntity.new {
                this.reservation = reservation
                this.reason = PenaltyReason.Overtime
                this.fine = fine
                this.due = due
                this.paid = false
            }
        }

        null
    }
}