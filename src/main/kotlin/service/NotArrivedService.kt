package parkflex.service

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.FlowPreview
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.timeout
import kotlinx.coroutines.withContext
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.jetbrains.exposed.sql.transactions.transaction
import org.slf4j.LoggerFactory
import parkflex.db.PenaltyEntity
import parkflex.db.PenaltyReason
import parkflex.db.ReservationEntity
import parkflex.db.ReservationTable
import parkflex.repository.ParameterRepository
import java.time.Duration
import java.time.LocalDateTime

/**
 * A daemon that automatically applies [PenaltyReason.NotArrived] penalties every couple of minutes.
 *
 * Spawned via [NotArrivedService.launch]
 *
 * Can be configured with the following parameters
 *   - "penalty/notArrived/margin" - Maximum time (in minutes) a user can be late at the spot. Daemon
 *     timer interval is also set to this value.
 *   - "penalty/fine/notArrived" - The amount of a fine that a [PenaltyReason.NotArrived] penalty should
 *      have.
 */
object NotArrivedService {
    private val logger = LoggerFactory.getLogger("NotArrivedService")

    /**
     * Launches the daemon with an implicit coroutine context.
     *
     * @param db Database connection. Uses an implicit connection if `null`.
     *
     * @see withContext
     */
    @OptIn(FlowPreview::class)
    suspend fun launch(db: Database? = null) {
        val period = transaction(db) { ParameterRepository.get("penalty/notArrived/margin") }!!.toLong()

        logger.info("Starting daemon")
        ticker(period)
            .timeout(kotlin.time.Duration.INFINITE)
            .collect { reap(db, period) }
    }

    private fun ticker(period: Long): Flow<Unit> = flow {
        do {
            delay(Duration.ofMinutes(period).toMillis())
            emit(Unit)
        } while (true)
    }

    private suspend fun reap(db: Database?, period: Long) = newSuspendedTransaction(Dispatchers.IO, db) {
        logger.info("Reaping not attended reservations")

        val now = LocalDateTime.now()

        // Reservations not started after this timestamp are considered as late
        val deadline = now.minusMinutes(period)

        // Not arrived yet but a specific amount of time has passed
        val notArrivedYet = { r: ReservationEntity ->
            r.arrived == null && r.start.isBefore(deadline)
        }

        // Arrived but too late
        val arrivedTooLate = { r: ReservationEntity ->
            r.left == null && r.arrived?.isBefore(deadline) ?: false
        }

        val records = ReservationEntity
            .find { ReservationTable.left eq null }
            .filter { it.hasPenalty.not() && (notArrivedYet(it) || arrivedTooLate(it)) }

        logger.info("Found ${records.size} records to reap")

        val blockDuration = ParameterRepository.get("penalty/block/duration")!!.toLong()
        val due = now.plusHours(blockDuration)

        val fine = ParameterRepository.get("penalty/fine/notArrived")!!.toLong()

        records.forEach { reservation ->
            val p = PenaltyEntity.new {
                this.reservation = reservation
                this.due = due
                this.reason = PenaltyReason.NotArrived
                this.paid = false
                this.fine = fine
            }
            logger.info("Created penalty (id ${p.id.value}) for reservation ${reservation.id.value}")
        }
    }
}