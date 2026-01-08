package parkflex.routes

import io.ktor.http.HttpStatusCode
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.route
import parkflex.db.ReportEntity
import parkflex.models.ReportEntry
import parkflex.runDB

fun Route.reportsRoutes(){
    get{
        var reportList : List<ReportEntry> = listOf()
        runDB {
            for (report in ReportEntity.all()) {
            var penalty = report.penalty
            var reservation = penalty?.reservation
            var user = reservation?.user
            val plate = user?.plate ?:"UNKNOWN"
            var Entry = ReportEntry(plate,
                report.timestamp,
                report.description,
                report.submitter.plate,
                report.image
                )
                reportList += Entry
            }
        }
        val sortedReports = reportList.sortedByDescending { it.issueTime }

        call.respond(sortedReports)
    }
}