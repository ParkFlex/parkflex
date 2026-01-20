package parkflex.routes.admin

import io.ktor.http.HttpStatusCode
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.jetbrains.exposed.sql.transactions.transaction
import parkflex.db.PenaltyEntity
import parkflex.db.PenaltyReason
import parkflex.db.ReportEntity
import parkflex.db.ReservationEntity
import parkflex.models.ApiErrorModel
import parkflex.models.admin.NewPenaltyResponseModel
import parkflex.models.admin.NewPenaltyResponseState
import parkflex.models.admin.ReportIdWrapper
import parkflex.repository.ParameterRepository
import parkflex.repository.ReservationRepository
import parkflex.repository.ReservationRepository.TimeRelation
import parkflex.runDB
import parkflex.utils.admin
import java.time.Duration
import java.time.LocalDateTime

/**
 * Returns fine for the penalty. Calculated from timestamp and reservation.
 *
 * @param reservation Reservation for which the penalty is calculated
 * @param timestamp
 * @param relation Whether the reservation was
 *
 * Requires a transaction context.
 */
private fun fineFromRelation(timestamp: LocalDateTime, reservation: ReservationEntity, relation: TimeRelation) =
    when (relation) {
        TimeRelation.Past -> {
            val per15min = ParameterRepository.get("penalty/fine/overtime")
                ?.toLong()
                ?: throw Exception("Could not find parameter 'penalty/fine/overtime'.")

            val expectedEnd = reservation.start.plusMinutes(reservation.duration.toLong())
            val minutes = Duration.between(expectedEnd, timestamp).toMinutes()
            val count = minutes / 15

            per15min * count
        }

        TimeRelation.Present ->
            ParameterRepository.get("penalty/fine/wrongSpot")
                ?.toLong()
                ?: throw Exception("Could not find parameter 'penalty/fine/wrongSpot'")
    }

fun Route.penaltyCreationRoutes() {
    post {
        call.admin()

        val reportID = runCatching { call.receive<ReportIdWrapper>() }.map { it.reportId }.getOrElse {
            call.respond(
                status = HttpStatusCode.BadRequest,
                message = ApiErrorModel(it.message ?: it.toString(), "POST /penalty")
            )

            return@post
        }

        val report =
            transaction { ReportEntity.findById(reportID) } ?: run {
                call.respond(
                    status = HttpStatusCode.NotFound,
                    message = ApiErrorModel("Report of ID $reportID not found", "POST /api/penalty")
                )

                return@post
            }


        if (report.reviewed && runDB { report.penalty } != null) {
            call.respond(
                message = ApiErrorModel("Report of id $reportID has already been reviewed", "POST /penalty"),
                status = HttpStatusCode.BadRequest
            )

            return@post
        }

        // Get the last reservation that happened before or during the time of the report
        val (reservation, relation) =
            runDB { ReservationRepository.getNearest(report.plate, report.timestamp) }
                ?: run {
                    call.respond(
                        status = HttpStatusCode.NotFound,
                        message = ApiErrorModel(
                            "No past or present reservation for plate ${report.plate} found",
                            "POST /api/penalty"
                        )
                    )
                    return@post
                }

        // Calculate the fine and the reason of the penalty based on
        // whether the reservation happened before or at the time of the report
        val fine = runDB { fineFromRelation(report.timestamp, reservation, relation) }

        val reason = if (relation == TimeRelation.Past) PenaltyReason.Overtime else PenaltyReason.WrongSpot

        // For how long should user be blocked?
        val blockDuration =
            runDB { ParameterRepository.get("penalty/block/duration") }
                ?.toLong()
                ?: run {
                    call.respond(
                        status = HttpStatusCode.NotFound,
                        message = ApiErrorModel(
                            "Could not find parameter 'penalty/block/duration'. Penalty not created",
                            "POST /api/penalty"
                        )
                    )

                    return@post
                }

        val blockedDue = report.timestamp.plusHours(blockDuration)

        // At this point, report is considered reviewed
        runDB { report.reviewed = true }

        // If there is already a penalty attached to the reservation, and it's fine is lower than
        // the one we just calculated, then update the old penalty. If no penalty is attached,
        // create a new penalty.
        val response = runDB {
            if (reservation.hasPenalty.not()) {
                val penalty = PenaltyEntity.new {
                    this.reservation = reservation
                    this.reason = reason
                    this.fine = fine
                    this.paid = false
                    this.due = blockedDue
                }

                report.penalty = penalty

                NewPenaltyResponseModel(NewPenaltyResponseState.Created)
            } else if (reservation.penalties.first().fine < fine) {
                val p = reservation.penalties.first()

                report.penalty = p
                p.reason = reason
                p.fine = fine
                p.paid = false
                p.due = blockedDue

                NewPenaltyResponseModel(NewPenaltyResponseState.Updated)
            } else {
                NewPenaltyResponseModel(NewPenaltyResponseState.NotChanged)
            }
        }

        call.respond(
            status = HttpStatusCode.OK,
            message = response
        )
    }
}