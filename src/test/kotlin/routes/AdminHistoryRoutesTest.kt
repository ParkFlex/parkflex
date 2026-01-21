package parkflex.routes

import adminToken
import io.ktor.client.call.body
import io.ktor.client.request.bearerAuth
import io.ktor.client.request.get
import io.ktor.client.statement.bodyAsText
import io.ktor.http.HttpStatusCode
import io.ktor.server.testing.testApplication
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.junit.jupiter.api.Test
import parkflex.configureTest
import parkflex.db.*
import parkflex.models.admin.AdminHistoryEntryModel
import io.ktor.server.routing.routing
import newAdmmin
import parkflex.db.configDataBase.setupTestDB
import parkflex.routes.admin.adminHistoryRoutes
import testingClient
import java.time.LocalDateTime
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertTrue

class AdminHistoryRoutesTest {
    private val url = "/api/admin/users/history"

    @Test
    fun `test admin history returns empty list when no reservations`() = testApplication {
        val db = setupTestDB()
        application {
            configureTest(db)
        }
        val client = testingClient()

        newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, PenaltyTable, ParameterTable)
            newAdmmin()
        }

        val response = client.get(url) {
            bearerAuth(adminToken())
        }

        assertEquals(HttpStatusCode.OK, response.status)

        val history = response.body<List<AdminHistoryEntryModel>>()
        assertTrue(history.isEmpty(), "History should be empty when there are no reservations")
    }

    @Test
    fun `test admin history success returns data when reservations exist`() = testApplication {
        val db = setupTestDB()
        application {
            configureTest(db)
        }
        val client = testingClient()

        newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, PenaltyTable, ParameterTable)

            newAdmmin()

            val user = UserEntity.new {
                fullName = "Admin History User"
                mail = "admin.history.user@parkflex.pl"
                hash = "h"
                plate = "AA-111"
                role = "user"
            }

            val spot = SpotEntity.new { role = "normal"; displayOrder = 1 }

            ReservationEntity.new {
                start = LocalDateTime.now().minusDays(1)
                duration = 45
                this.user = user
                this.spot = spot
            }
        }

        val response = client.get(url) {
            bearerAuth(adminToken())
        }

        assertEquals(HttpStatusCode.OK, response.status)

        val history = response.body<List<AdminHistoryEntryModel>>()
        assertTrue(history.isNotEmpty(), "History should not be empty when reservations exist")
    }

    @Test
    fun `test admin history returns correct statuses (ok and penalty)`() = testApplication {
        val db = setupTestDB()
        application {
            configureTest(db)
        }
        val client = testingClient()

        newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, PenaltyTable, ParameterTable)

            newAdmmin()

            val userOk = UserEntity.new {
                fullName = "User OK"
                mail = "ok@parkflex.pl"
                hash = "h"
                plate = "OK-111"
                role = "user"
            }

            val userPenalty = UserEntity.new {
                fullName = "User Penalty"
                mail = "penalty@parkflex.pl"
                hash = "h"
                plate = "PN-222"
                role = "user"
            }

            val spot1 = SpotEntity.new { role = "normal"; displayOrder = 1 }
            val spot2 = SpotEntity.new { role = "normal"; displayOrder = 2 }

            ReservationEntity.new {
                start = LocalDateTime.now().minusDays(3)
                duration = 60
                user = userOk
                spot = spot1
            }

            val badReservation = ReservationEntity.new {
                start = LocalDateTime.now().minusDays(1)
                duration = 120
                user = userPenalty
                spot = spot2
            }

            PenaltyEntity.new {
                reservation = badReservation
                reason = PenaltyReason.Overtime
                paid = false
                fine = 100
                due = LocalDateTime.now().plusDays(7)
            }
        }

        val response = client.get(url) {
            bearerAuth(adminToken())
        }

        assertEquals(HttpStatusCode.OK, response.status)

        val history = response.body<List<AdminHistoryEntryModel>>()
        assertEquals(2, history.size)

        assertTrue(history.any { it.status == "ok" }, "Expected at least one entry with status 'ok'")
        assertTrue(history.any { it.status == "penalty" }, "Expected at least one entry with status 'penalty'")
    }

    @Test
    fun `test admin history returns full data fields (start duration spot plate)`() = testApplication {
        val db = setupTestDB()
        application {
            configureTest(db)
        }
        val client = testingClient()

        val expectedStart = LocalDateTime.now().minusHours(10)
        val expectedDuration = 90
        val expectedPlate = "FULL-999"

        val expectedSpotId = newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, PenaltyTable, ParameterTable)

            newAdmmin()

            val user = UserEntity.new {
                fullName = "Full Data User"
                mail = "fulldata@parkflex.pl"
                hash = "h"
                plate = expectedPlate
                role = "user"
            }

            val spot = SpotEntity.new { role = "normal"; displayOrder = 5 }

            ReservationEntity.new {
                start = expectedStart
                duration = expectedDuration
                this.user = user
                this.spot = spot
            }

            spot.id.value.toInt()
        }

        val response = client.get(url) {
            bearerAuth(adminToken())
        }

        assertEquals(HttpStatusCode.OK, response.status)

        val history = response.body<List<AdminHistoryEntryModel>>()
        assertTrue(history.isNotEmpty())

        val found = history.firstOrNull {
            it.plate == expectedPlate && it.durationMin == expectedDuration
        }

        assertNotNull(found, "Expected to find a history entry for plate=$expectedPlate and duration=$expectedDuration")
        assertEquals(expectedSpotId, found.spot)
        assertEquals(expectedStart, found.startTime)



    }
}
