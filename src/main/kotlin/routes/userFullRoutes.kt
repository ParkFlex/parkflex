package parkflex.routes

import io.ktor.server.response.*
import io.ktor.server.routing.*
import parkflex.db.UserEntity
import parkflex.models.PenaltyModel
import parkflex.models.UserListEntry
import parkflex.runDB
import java.time.LocalDateTime


fun Route.userFullRoutes() {
    get {
        val userList = mutableListOf<UserListEntry>()

        runDB {
            for (entry in UserEntity.all()) {
                val today = LocalDateTime.now()
                var numberOfPastReservations: Long = 0
                var numberOfFutureReservations: Long = 0
                var numberOfPastBans: Long = 0
                var currentReservation = false
                var currentPenalty: PenaltyModel? = null
                val reservations = entry.reservations.toList()

                for (reservation in reservations) {
                    val endTime = reservation.start.plusMinutes(reservation.duration.toLong())
                    val isFuture = today.isBefore(reservation.start)
                    val isPast = today.isAfter(endTime)
                    val isActive = !today.isBefore(reservation.start) && !today.isAfter(endTime)

                    if (currentPenalty == null) {
                        val penaltyEntity = reservation.penalties.find { !it.paid && it.due.isAfter(today) }

                        if (penaltyEntity != null) {
                            currentPenalty = PenaltyModel(
                                id = penaltyEntity.id.value,
                                reservation = reservation.id.value,
                                reason = penaltyEntity.reason,
                                paid = penaltyEntity.paid,
                                due = penaltyEntity.due,
                                fine = penaltyEntity.fine.toDouble()
                            )
                        }
                    }

                    if (isActive) {
                        currentReservation = true
                    } else if (isFuture) {
                        numberOfFutureReservations += 1
                    } else if (isPast) {
                        numberOfPastReservations += 1
                        if (reservation.hasPenalty) {
                            numberOfPastBans += 1
                        }
                    }
                }

                val thisUser = UserListEntry(
                    plate = entry.plate,
                    role = entry.role,
                    name = entry.fullName,
                    mail = entry.mail,
                    currentPenaltyModel = currentPenalty,
                    numberOfPastReservations = numberOfPastReservations,
                    numberOfFutureReservations = numberOfFutureReservations,
                    numberOfPastBans = numberOfPastBans,
                    currentReservation = currentReservation
                )

                userList.add(thisUser)
            }
        }

        call.respond(userList)
    }
}
