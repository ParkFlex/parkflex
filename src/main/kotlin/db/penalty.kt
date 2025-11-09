package parkflex.db

import org.jetbrains.exposed.dao.*
import org.jetbrains.exposed.dao.id.*
import org.jetbrains.exposed.sql.javatime.datetime

object PenaltyTable : LongIdTable("penalty") {
    val reservation = reference("reservation", ReservationTable.id)
    val reason = text("reason")
    val paid = bool("paid")
    val fine = long("fine")
    val due = datetime("due")
}

class PenaltyEntity(id: EntityID<Long>) : LongEntity(id) {
    var reservation by ReservationEntity referencedOn PenaltyTable.reservation
    var reason by PenaltyTable.reason
    val paid by PenaltyTable.paid
    var fine by PenaltyTable.fine
    val due by PenaltyTable.due

    companion object : LongEntityClass<PenaltyEntity>(PenaltyTable)
}
