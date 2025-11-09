package parkflex.db

import org.jetbrains.exposed.dao.*
import org.jetbrains.exposed.dao.id.*

object UserTable : LongIdTable("user") {
    val login = text("login").uniqueIndex()

    val fullName = text("full_name")
    val mail = text("mail")
    val hash = text("hash")
    val plate = text("plate")
    val role = text("role")
    val blocked = bool("blocked")
}

class UserEntity(id: EntityID<Long>) : LongEntity(id) {
    /** Used for user login */
    var login by UserTable.login

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

    /** Has the user been blocked? */
    var blocked by UserTable.blocked

    val reservations by ReservationEntity referrersOn ReservationTable.user

    companion object : LongEntityClass<UserEntity>(UserTable)
}
