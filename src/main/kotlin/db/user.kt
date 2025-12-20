package parkflex.db

import org.jetbrains.exposed.dao.*
import org.jetbrains.exposed.dao.id.*

object UserTable : LongIdTable("user") {
    val fullName = text("full_name")
    val mail = text("mail").uniqueIndex()
    val hash = text("hash")
    val plate = text("plate")
    val role = text("role")
}

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

    val reservations by ReservationEntity referrersOn ReservationTable.user

    fun getPenalties(): List<PenaltyEntity> =
        reservations.flatMap { it.penalties }.toList()

    fun isBlocked(): Boolean = getPenalties().any { it.isActive() }

    companion object : LongEntityClass<UserEntity>(UserTable)
}
