package parkflex.service

import parkflex.db.PenaltyEntity
import parkflex.db.PenaltyReason
import parkflex.db.ReservationEntity
import parkflex.repository.ParameterRepository
import parkflex.runDB
import java.time.Duration
import java.time.LocalDateTime
import kotlin.Long

/**
 * Service for managing parking violation penalties.
 * Handles penalty creation, overtime calculation, and conflict resolution.
 */
object PenaltyService {

    /**
     * Represents a penalty that has not yet been committed to the database.
     * Used as an intermediate representation during penalty creation.
     * 
     * @property fine Penalty amount (in cents/grosz)
     * @property due Payment deadline
     * @property reason Reason for the penalty
     * @property paid Whether the penalty has been paid
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
     * Resolves a conflict when creating a new penalty for a reservation
     * that already has an existing penalty.
     *
     * Strategy: Keeps the penalty with higher fine amount.
     * This ensures users are charged for the most severe violation.
     *
     * @param existingPenalty Penalty already in the database
     * @param partialPenalty New penalty being created
     * @return The penalty with higher fine (either updated existing or new one)
     */
    private fun resolveClash(existingPenalty: PenaltyEntity, partialPenalty: PartialPenalty): PenaltyEntity =
        if (existingPenalty.fine < partialPenalty.fine) partialPenalty.overwrite(existingPenalty)
        else existingPenalty

    /**
     * Calculates and creates a penalty if overtime is detected.
     * 
     * Overtime is calculated as the time between reservation end (plus break time)
     * and actual departure time. Fine is calculated per 15-minute blocks.
     * 
     * If a penalty already exists for this reservation, uses resolveClash() to pick
     * the one with higher fine.
     * 
     * @param reservation Reservation to check for overtime. Must have non-null 'left' field.
     * @param timestamp Point in time when penalty is being calculated (usually departure time)
     * @return Created or updated penalty entity, or null if no overtime detected
     * 
     * TODO: Add validation that reservation.left is not null before calculation
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