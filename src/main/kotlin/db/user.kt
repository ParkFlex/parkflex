package parkflex.db

import org.jetbrains.exposed.dao.*
import org.jetbrains.exposed.dao.id.*

/**
 * Database table for user accounts.
 * Stores user credentials, personal information, and role assignments.
 */
object UserTable : LongIdTable("user") {
    /** User's full name */
    val fullName = text("full_name")
    
    /** User's email address - unique identifier for login */
    val mail = text("mail").uniqueIndex()
    
    /** Hashed password for authentication */
    val hash = text("hash")
    
    /** License plate number associated with the user's vehicle */
    val plate = text("plate")
    
    /** User role (e.g., "admin", "user") */
    val role = text("role")
}

/**
 * Entity representing a user in the system.
 * Provides access to user data and related reservations and penalties.
 */
class UserEntity(id: EntityID<Long>) : LongEntity(id) {
    /** User's full name */
    var fullName by UserTable.fullName

    /** User's mail address */
    var mail by UserTable.mail

    /** Hashed password */
    var hash by UserTable.hash

    /** Licence plate number */
    var plate by UserTable.plate

    /** Admin, normal etc */
    var role by UserTable.role

    /** All reservations made by this user */
    val reservations by ReservationEntity referrersOn ReservationTable.user

    /**
     * Gets all penalties associated with this user's reservations.
     * @return List of all penalty entities for this user
     */
    fun getPenalties(): List<PenaltyEntity> =
        reservations.flatMap { it.penalties }.toList()

    /**
     * Checks if the user is blocked due to active unpaid penalties.
     * @return true if user has any active penalties, false otherwise
     */
    fun isBlocked(): Boolean = getPenalties().any { it.isActive() }

    companion object : LongEntityClass<UserEntity>(UserTable)
}
