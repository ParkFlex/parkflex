package parkflex.service

import parkflex.db.PenaltyEntity
import parkflex.db.PenaltyReason
import parkflex.db.ReservationEntity
import parkflex.repository.ParameterRepository
import parkflex.runDB
import java.time.Duration
import java.time.LocalDateTime
import kotlin.Long

object PenaltyService {

    /**
     * Represents a penalty that has not yet been commited to the store.
     */
    private data class PartialPenalty(
        val fine: Long,
        val due: LocalDateTime,
        val reason: PenaltyReason,
        val paid: Boolean,
    ) {
        private val outer = this

        /**
         * Overwrites an existing penalty with this partial penalty.
         *
         * @return Updated penalty
         */
        fun overwrite(existingPenalty: PenaltyEntity): PenaltyEntity {
            existingPenalty.fine = fine
            existingPenalty.due = due
            existingPenalty.reason = reason
            existingPenalty.paid = paid

            return existingPenalty
        }

        /**
         * Commits a partial penalty into the database.
         *
         * @param reservation Reservation connected to the penalty
         *
         * @return Updated penalty
         */
        fun commit(reservation: ReservationEntity) = PenaltyEntity.new {
            this.reservation = reservation
            this.reason = outer.reason
            this.fine = outer.fine
            this.due = outer.due
            this.paid = outer.paid
        }
    }

    /**
     * Resolves a clash when a new penalty is being created for a reservation
     * which already has an existing penalty.
     *
     * The strategy is that we pick the penalty with higher fine.
     *
     * @param existingPenalty Penalty found in the store
     * @param partialPenalty Penalty in construction
     *
     * @return Updated penalty
     */
    private fun resolveClash(existingPenalty: PenaltyEntity, partialPenalty: PartialPenalty): PenaltyEntity =
        if (existingPenalty.fine < partialPenalty.fine) partialPenalty.overwrite(existingPenalty)
        else existingPenalty

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

        when {
            overtimeMinutes > 0 -> {
                val per15min = ParameterRepository.get("penalty/fine/overtime")?.toLong()!!
                val fine = (overtimeMinutes / 15) * per15min

                val penaltyHours = ParameterRepository.get("penalty/block/duration")?.toLong()!!

                val due = timestamp.plusHours(penaltyHours)

                val partialPenalty = PartialPenalty(
                    fine = fine,
                    due = due,
                    reason = PenaltyReason.Overtime,
                    paid = false,
                )

                when (val existingPenalty: PenaltyEntity? = reservation.penalties.singleOrNull()) {
                    null -> partialPenalty.commit(reservation)
                    else -> resolveClash(existingPenalty, partialPenalty)
                }
            }

            else -> null
        }
    }
}