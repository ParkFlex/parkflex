package parkflex.db

import org.jetbrains.exposed.dao.*
import org.jetbrains.exposed.dao.id.*
import org.jetbrains.exposed.sql.javatime.datetime
import java.time.LocalDateTime

/**
 * Reasons for issuing a penalty to a user.
 */
enum class PenaltyReason {
    /** User parked in the wrong spot */
    WrongSpot,
    
    /** User exceeded their reservation duration */
    Overtime,
    
    /** User did not arrive for their reservation */
    NotArrived
}

/**
 * Database table for parking violation penalties.
 * Tracks fines issued to users for parking violations.
 */
object PenaltyTable : LongIdTable("penalty") {
    /** Reference to the reservation that resulted in this penalty */
    val reservation = reference("reservation", ReservationTable.id)
    
    /** Reason for the penalty */
    val reason = enumeration("reason", PenaltyReason::class)
    
    /** Whether the fine has been paid */
    val paid = bool("paid")
    
    /** Fine amount (TODO: verify currency unit - probably cents/grosz) */
    val fine = long("fine")
    
    /** Payment deadline */
    val due = datetime("due")
}

/**
 * Entity representing a penalty issued to a user.
 */
class PenaltyEntity(id: EntityID<Long>) : LongEntity(id) {
    /** The reservation that caused this penalty */
    var reservation by ReservationEntity referencedOn PenaltyTable.reservation
    
    /** Reason for this penalty */
    var reason by PenaltyTable.reason
    
    /** Whether the penalty has been paid */
    var paid by PenaltyTable.paid
    
    /** Fine amount */
    var fine by PenaltyTable.fine
    
    /** Payment deadline */
    var due by PenaltyTable.due

    /**
     * Checks if this penalty is still active (unpaid and not past due date).
     * @return true if penalty is unpaid and deadline hasn't passed
     */
    fun isActive(): Boolean = LocalDateTime.now().isBefore(due) && !paid

    companion object : LongEntityClass<PenaltyEntity>(PenaltyTable)
}
