package parkflex.service

import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.transactions.transaction
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.timeout
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.innerJoin
import org.jetbrains.exposed.sql.leftJoin
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.slf4j.LoggerFactory
import parkflex.db.PenaltyTable
import parkflex.db.ReservationEntity
import parkflex.db.ReservationTable
import parkflex.repository.ParameterRepository
import java.time.Duration
import java.time.LocalDateTime

object NotArrivedService {
    private val logger = LoggerFactory.getLogger("NotArrivedService")

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

        // Reservations not started after this timestamp are considered as late
        val deadline = LocalDateTime.now().minusMinutes(period)

        val notArrivedYet = { r: ReservationEntity ->
            r.arrived == null && r.start.isBefore(deadline)
        }

        val arrivedTooLate = { r: ReservationEntity ->
            r.left == null && r.arrived?.isBefore(deadline) ?: false
        }

        val records = ReservationEntity
            .find { ReservationTable.left eq null }
            .filter { it.hasPenalty.not() && (notArrivedYet(it) || arrivedTooLate(it)) }

        logger.info("Found ${records.size} records to reap")

        records.forEach { logger.info(it.id.toString()) }
    }
}