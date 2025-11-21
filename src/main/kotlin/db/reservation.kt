package parkflex.db

import org.jetbrains.exposed.dao.*
import org.jetbrains.exposed.dao.id.*
import org.jetbrains.exposed.sql.javatime.*


object ReservationTable : LongIdTable("reservation") {
    val start = datetime("start")
    val duration = integer("duration")
    val spot = reference("spot", SpotTable.id)
    val user = reference("user", UserTable.id)
}

class ReservationEntity(id: EntityID<Long>) : LongEntity(id) {
    /** When does the reservation start? */
    var start by ReservationTable.start

    /** How long does the reservation take (in minutes) */
    var duration by ReservationTable.duration

    /** Which spot is  being reserved */
    var spot by SpotEntity referencedOn ReservationTable.spot

    /** Who is the owner of the reservation? */
    var user by UserEntity referencedOn ReservationTable.user

    companion object : LongEntityClass<ReservationEntity>(ReservationTable)

    val hasPenalty: Boolean
        get() = PenaltyEntity.find { PenaltyTable.reservation eq id }.empty().not()

}
