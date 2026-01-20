package parkflex.routes

import db.configDataBase.setupTestDB
import io.ktor.client.call.body
import io.ktor.client.request.bearerAuth
import io.ktor.client.request.get
import io.ktor.http.HttpStatusCode
import io.ktor.server.routing.route
import io.ktor.server.routing.routing
import io.ktor.server.testing.testApplication
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.junit.jupiter.api.Test
import parkflex.configureTest
import parkflex.db.*
import parkflex.models.ApiErrorModel
import parkflex.models.admin.AdminReportEntry
import parkflex.repository.JwtRepository
import parkflex.routes.admin.reportsRoutes
import testingClient
import java.time.LocalDateTime
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertTrue

class ReportsRoutesTest {

    private val url = "/reports"

    @Test
    fun `test reports returns empty list when no reports`() = testApplication {
        val db = setupTestDB()
        application {
            configureTest(db)
            routing {
                route(url) { reportsRoutes() }
            }
        }
        val client = testingClient()

        val adminId = newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, ReportTable)

            UserEntity.new {
                fullName = "Admin"
                mail = "admin@pf.pl"
                hash = "h"
                plate = "ADMIN-001"
                role = "admin"
            }.id.value
        }

        val token = JwtRepository.generateToken(adminId, "admin@pf.pl", "admin")

        val response = client.get(url) { bearerAuth(token) }

        assertEquals(HttpStatusCode.OK, response.status)

        val reports = response.body<List<AdminReportEntry>>()
        assertTrue(reports.isEmpty(), "Reports list should be empty when there are no reports")
    }

    @Test
    fun `test reports success returns correct data`() = testApplication {
        val db = setupTestDB()
        application {
            configureTest(db)
            routing {
                route(url) { reportsRoutes() }
            }
        }
        val client = testingClient()

        val now = LocalDateTime.now()

        val adminId = newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, ReportTable)

            val admin = UserEntity.new {
                fullName = "Admin"
                mail = "admin2@pf.pl"
                hash = "h"
                plate = "ADMIN-002"
                role = "admin"
            }

            val submitter = UserEntity.new {
                fullName = "Report Submitter"
                mail = "submitter@pf.pl"
                hash = "h"
                plate = "SUB-001"
                role = "user"
            }

            ReportEntity.new {
                plate = "BAD-123"
                timestamp = now
                description = "Vehicle parked in the wrong spot"
                this.submitter = submitter
                image = ""
                reviewed = false
                penalty = null
            }

            admin.id.value
        }

        val token = JwtRepository.generateToken(adminId, "admin2@pf.pl", "admin")

        val response = client.get(url) { bearerAuth(token) }

        assertEquals(HttpStatusCode.OK, response.status)

        val reports = response.body<List<AdminReportEntry>>()
        assertTrue(reports.isNotEmpty())

        val found = reports.firstOrNull { it.plate == "BAD-123" }
        assertNotNull(found, "Expected to find report for plate BAD-123")

        assertEquals("Vehicle parked in the wrong spot", found.description)
        assertEquals("SUB-001", found.submitterPlate)
        assertEquals(false, found.reviewed)
        assertEquals(now, found.timestamp)
        assertEquals(null, found.penalty)
    }

    @Test
    fun `test reports include penalty when exists`() = testApplication {
        val db = setupTestDB()
        application {
            configureTest(db)
            routing {
                route(url) { reportsRoutes() }
            }
        }
        val client = testingClient()

        val now = LocalDateTime.now()

        val adminId = newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, PenaltyTable, ReportTable, ParameterTable)

            val admin = UserEntity.new {
                fullName = "Admin"
                mail = "admin3@pf.pl"
                hash = "h"
                plate = "ADMIN-003"
                role = "admin"
            }

            val submitter = UserEntity.new {
                fullName = "Report Submitter"
                mail = "submitter2@pf.pl"
                hash = "h"
                plate = "SUB-002"
                role = "user"
            }

            val driver = UserEntity.new {
                fullName = "Reported Driver"
                mail = "driver@pf.pl"
                hash = "h"
                plate = "DR-777"
                role = "user"
            }

            val spot = SpotEntity.new { role = "normal"; displayOrder = 1 }

            val reserv = ReservationEntity.new {
                start = now.minusHours(2)
                duration = 30
                this.user = driver
                this.spot = spot
            }

            val penalty = PenaltyEntity.new {
                reservation = reserv
                reason = PenaltyReason.WrongSpot
                paid = false
                fine = 77
                due = now.plusDays(3)
            }

            ReportEntity.new {
                plate = "DR-777"
                timestamp = now
                description = "Vehicle parked in a wrong spot (penalty issued)"
                this.submitter = submitter
                image = "img"
                reviewed = false
                this.penalty = penalty
            }

            admin.id.value
        }

        val token = JwtRepository.generateToken(adminId, "admin3@pf.pl", "admin")

        val response = client.get(url) { bearerAuth(token) }

        assertEquals(HttpStatusCode.OK, response.status)

        val reports = response.body<List<AdminReportEntry>>()
        val withPenalty = reports.firstOrNull { it.plate == "DR-777" }
        assertNotNull(withPenalty, "Expected to find a report for plate DR-777")

        assertNotNull(withPenalty.penalty, "Expected penalty to be present")
        assertEquals(77, withPenalty.penalty!!.fine)
        assertEquals(PenaltyReason.WrongSpot, withPenalty.penalty!!.reason)
        assertEquals(false, withPenalty.penalty!!.paid)
    }

    @Test
    fun `test reports are sorted by timestamp descending`() = testApplication {
        val db = setupTestDB()
        application {
            configureTest(db)
            routing {
                route(url) { reportsRoutes() }
            }
        }
        val client = testingClient()

        val older = LocalDateTime.now().minusDays(1)
        val newer = LocalDateTime.now()

        val adminId = newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, ReportTable)

            val admin = UserEntity.new {
                fullName = "Admin"
                mail = "admin4@pf.pl"
                hash = "h"
                plate = "ADMIN-004"
                role = "admin"
            }

            val submitter = UserEntity.new {
                fullName = "Report Submitter"
                mail = "submitter3@pf.pl"
                hash = "h"
                plate = "SUB-003"
                role = "user"
            }

            ReportEntity.new {
                plate = "OLD-1"
                timestamp = older
                description = "Older report (wrong spot)"
                this.submitter = submitter
                image = ""
                reviewed = false
                penalty = null
            }

            ReportEntity.new {
                plate = "NEW-1"
                timestamp = newer
                description = "Newer report (wrong spot)"
                this.submitter = submitter
                image = ""
                reviewed = true
                penalty = null
            }

            admin.id.value
        }

        val token = JwtRepository.generateToken(adminId, "admin4@pf.pl", "admin")

        val response = client.get(url) { bearerAuth(token) }

        assertEquals(HttpStatusCode.OK, response.status)

        val reports = response.body<List<AdminReportEntry>>()
        assertEquals(2, reports.size)

        assertEquals("NEW-1", reports[0].plate)
        assertEquals("OLD-1", reports[1].plate)

        assertTrue(reports[0].timestamp >= reports[1].timestamp, "Reports should be sorted from newest to oldest")
    }
}
