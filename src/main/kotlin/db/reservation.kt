package parkflex.db

import org.jetbrains.exposed.dao.*
import org.jetbrains.exposed.dao.id.*
import org.jetbrains.exposed.sql.javatime.*
import java.time.LocalDateTime


object ReservationTable : LongIdTable("reservation") {
    val start = datetime("start")
    val duration = integer("duration")
    val spot = reference("spot", SpotTable.id)
    val user = reference("user", UserTable.id)
    val arrived = datetime("arrived").nullable()
    val left = datetime("left").nullable()
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

    /** Penalties referring to this reservation */
    val penalties by PenaltyEntity referrersOn PenaltyTable.reservation

    /** When has the user arrived at the parking? */
    var arrived by ReservationTable.arrived

    /** When has the user left the parking? */
    var left by ReservationTable.left

    val hasPenalty: Boolean
        get() = !this.penalties.empty()

    fun end(): LocalDateTime =
        start.plusMinutes((duration.toLong()))


    fun timeCollidesWith(breakDurationMinutes: Long, startTime: LocalDateTime, endTime: LocalDateTime): Boolean {
        val existingEnd = this.start.plusMinutes(this.duration.toLong())

        // Add break duration to prevent
        // <reservation>---break (0minutes)---<reservation> conflicts
        // 08:00-09:00 and 09:00-10:00 is a conflict because driver won't have time to leave
        // adjusted by parameter "default_break_between_reservations_duration"
        val adjustedExistingEnd = existingEnd.plusMinutes(breakDurationMinutes)
        val adjustedExistingStart = this.start.minusMinutes(breakDurationMinutes)

        return adjustedExistingStart <= endTime && startTime <= adjustedExistingEnd
    }

    fun isPast(): Boolean {
        val now = LocalDateTime.now();
        val end = start.plusMinutes(duration.toLong());

        return start.isBefore(now) && end.isBefore(now)
    }

    companion object : LongEntityClass<ReservationEntity>(ReservationTable)
}
