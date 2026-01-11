package parkflex.db

import org.jetbrains.exposed.dao.*
import org.jetbrains.exposed.dao.id.*
import org.jetbrains.exposed.sql.javatime.datetime
import java.time.LocalDateTime

enum class PenaltyReason {
    WrongSpot, Overtime, NotArrived
}

object PenaltyTable : LongIdTable("penalty") {
    val reservation = reference("reservation", ReservationTable.id)
    val reason = enumeration("reason", PenaltyReason::class)
    val paid = bool("paid")
    val fine = long("fine")
    val due = datetime("due")
}

class PenaltyEntity(id: EntityID<Long>) : LongEntity(id) {
    var reservation by ReservationEntity referencedOn PenaltyTable.reservation
    var reason by PenaltyTable.reason
    var paid by PenaltyTable.paid
    var fine by PenaltyTable.fine
    var due by PenaltyTable.due

    fun isActive(): Boolean = LocalDateTime.now().isBefore(due) && !paid

    companion object : LongEntityClass<PenaltyEntity>(PenaltyTable)
}
