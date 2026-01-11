package parkflex.routes

import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import parkflex.db.ReportEntity
import parkflex.models.AdminReportEntry
import parkflex.models.AdminReportEntryPenalty
import parkflex.runDB

fun Route.reportsRoutes() {
    get {
        val adminReportList: MutableList<AdminReportEntry> = mutableListOf()

        runDB {
            for (report in ReportEntity.all()) {
                val penalty = report.penalty
                val reservation = penalty?.reservation
                val user = reservation?.user
                val plate = user?.plate ?: "UNKNOWN"

                val penaltyEntry = penalty?.let {
                    AdminReportEntryPenalty(
                        id = penalty.id.value,
                        reservation = penalty.reservation.id.value,
                        reason = penalty.reason,
                        paid = penalty.paid,
                        due = penalty.due,
                        fine = penalty.fine
                    )
                }

                val entry = AdminReportEntry(
                    id = report.id.value,
                    plate = plate,
                    timestamp = report.timestamp,
                    description = report.description,
                    submitterPlate = report.submitter.plate,
                    image = report.image,
                    reviewed = report.reviewed,
                    penalty = penaltyEntry
                )

                adminReportList += entry
            }
        }

        val sortedReports = adminReportList.sortedByDescending { it.timestamp }

        call.respond(sortedReports)
    }
}