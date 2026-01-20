package parkflex.db

import org.jetbrains.exposed.dao.*
import org.jetbrains.exposed.dao.id.*
import org.jetbrains.exposed.sql.javatime.*
import java.time.LocalDateTime

/**
 * Database table for parking spot reservations.
 * Tracks when users book parking spots, arrival/departure times, and duration.
 */
object ReservationTable : LongIdTable("reservation") {
    /** Start time of the reservation */
    val start = datetime("start")
    
    /** Duration of the reservation in minutes */
    val duration = integer("duration")
    
    /** Reference to the parking spot being reserved */
    val spot = reference("spot", SpotTable.id)
    
    /** Reference to the user who made the reservation */
    val user = reference("user", UserTable.id)
    
    /** Actual arrival time (null if not yet arrived) */
    val arrived = datetime("arrived").nullable()
    
    /** Actual departure time (null if not yet left) */
    val left = datetime("left").nullable()
}

/**
 * Entity representing a parking spot reservation.
 * Handles reservation timing, collision detection, and penalty tracking.
 */
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

    /** Whether this reservation has any associated penalties */
    val hasPenalty: Boolean
        get() = !this.penalties.empty()

    /**
     * Calculates the end time of this reservation.
     * @return End timestamp based on start time and duration
     */
    fun end(): LocalDateTime =
        start.plusMinutes((duration.toLong()))

    /**
     * Checks if this reservation collides with the given time range.
     * Takes into account a break duration between reservations to prevent
     * back-to-back reservations without time for drivers to leave/arrive.
     *
     * @param breakDurationMinutes Required break time between reservations
     * @param startTime Start of the time range to check
     * @param endTime End of the time range to check
     * @return true if there is a collision, false otherwise
     */
    fun timeCollidesWith(breakDurationMinutes: Long, startTime: LocalDateTime, endTime: LocalDateTime): Boolean {
        val existingEnd = this.end()

        // Add break duration to prevent
        // <reservation>---break (0minutes)---<reservation> conflicts
        // 08:00-09:00 and 09:00-10:00 is a conflict because driver won't have time to leave
        // adjusted by parameter "default_break_between_reservations_duration"
        val adjustedExistingEnd = existingEnd.plusMinutes(breakDurationMinutes)
        val adjustedExistingStart = this.start.minusMinutes(breakDurationMinutes)

        return adjustedExistingStart <= endTime && startTime <= adjustedExistingEnd
    }

    /**
     * Checks if this reservation is in the past.
     * @return true if both start and end times are before current time
     */
    fun isPast(): Boolean {
        val now = LocalDateTime.now();
        val end = start.plusMinutes(duration.toLong());

        return start.isBefore(now) && end.isBefore(now)
    }

    companion object : LongEntityClass<ReservationEntity>(ReservationTable)
}
