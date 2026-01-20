package parkflex.routes.admin

import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import parkflex.db.ReportEntity
import parkflex.models.admin.AdminReportEntry
import parkflex.models.admin.AdminReportEntryPenalty
import parkflex.runDB
import parkflex.utils.admin

fun Route.reportsRoutes() {
    get {
        call.admin()

        val adminReportList: MutableList<AdminReportEntry> = mutableListOf()

        runDB {
            for (report in ReportEntity.all()) {
                val penalty = report.penalty

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
                    plate = report.plate,
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