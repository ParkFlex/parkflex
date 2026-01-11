package parkflex.routes

import io.ktor.http.HttpStatusCode
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.route
import parkflex.db.ReportEntity
import parkflex.models.AdminReportEntry
import parkflex.models.PenaltyModel
import parkflex.models.ReportEntry
import parkflex.runDB

fun Route.reportsRoutes(){
    get{
        var AdminreportList : List<AdminReportEntry> = listOf()
        runDB {
            for (report in ReportEntity.all()) {
            var penalty = report.penalty
            var reservation = penalty?.reservation
            var user = reservation?.user
            val plate = user?.plate ?:"UNKNOWN"
            var Penalty = report.penalty

                if( report.penalty != null){
                penalty = report.penalty

            }else
            {
                penalty = null
            }
            var Entry = AdminReportEntry(
                id = report.id.value,
                plate = plate,
                timestamp = report.timestamp,
                description = report.description,
                submitterPlate = report.submitter.plate,
                image = report.image,
                reviewed = report.reviewed,
                penalty = penalty



                )
                AdminreportList += Entry
            }
        }
        val sortedReports = AdminreportList.sortedByDescending { it.timestamp }

        call.respond(sortedReports)
    }
}