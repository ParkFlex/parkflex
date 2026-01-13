package parkflex.routes

import db.configDataBase.setupTestDB
import io.ktor.client.call.*
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.server.testing.*
import org.jetbrains.exposed.sql.SchemaUtils
import org.junit.jupiter.api.Test
import parkflex.configureTest
import parkflex.db.*
import parkflex.models.CreateReservationRequest
import parkflex.models.CreateReservationSuccessResponse
import parkflex.models.HistoryEntry
import parkflex.runDB
import testingClient
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertTrue

class HistoryRoutesTest {

    @Test
    fun `test get history without userId(null) returns 422`() = testApplication {
        application { configureTest() }
        val client = testingClient()

        val response = client.get("/api/historyEntry")
        assertEquals(HttpStatusCode.UnprocessableEntity, response.status)
    }

    @Test
    fun `test get history for non-existent user returns 404`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        runDB {
            SchemaUtils.create(UserTable, ReservationTable, SpotTable, PenaltyTable)
        }

        val response = client.get("/api/historyEntry") {
            url { parameter("userId", "99999") }
        }
        assertEquals(HttpStatusCode.NotFound, response.status)
    }


    @Test
    fun `test history returns mixed statuses (ok and penalty)`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        val (userId, spotId) = runDB {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, PenaltyTable)

            val user = UserEntity.new {
                fullName = "Jan Kowalski"
                mail = "jan.history@parkflex.pl"
                hash = "pass123"
                plate = "WA 00001"
                role = "user"
            }

            val spot = SpotEntity.new {
                role = "standard"
                displayOrder = 1
            }

            ReservationEntity.new {
                this.user = user
                this.spot = spot
                this.start = LocalDateTime.now().minusDays(5)
                this.duration = 60 // 1h
            }

            val badReservation = ReservationEntity.new {
                this.user = user
                this.spot = spot
                this.start = LocalDateTime.now().minusDays(1)
                this.duration = 120 // 2h
            }

            PenaltyEntity.new {
                reservation = badReservation
                reason = PenaltyReason.Overtime
                paid = false
                fine = 100
                due = LocalDateTime.now().plusDays(7)
            }

            Pair(user.id.value, spot.id.value)
        }

        val response = client.get("/api/historyEntry") {
            url { parameter("userId", userId.toString()) }
        }

        assertEquals(HttpStatusCode.OK, response.status)
        val historyList = response.body<List<HistoryEntry>>()

        assertEquals(2, historyList.size, "2 history entries should be returned")

        val okEntry = historyList.find { it.durationMin == 60 }
        assertNotNull(okEntry)
        assertEquals("ok", okEntry.status)
        assertEquals(spotId, okEntry.spot)

        val penaltyEntry = historyList.find { it.durationMin == 120 }
        assertNotNull(penaltyEntry)
        assertEquals("penalty", penaltyEntry.status)
        assertEquals(spotId, penaltyEntry.spot)
    }

    @Test
    fun `test history is empty for new user`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        val userId = runDB {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, PenaltyTable)

            val user = UserEntity.new {
                fullName = "Nowy Użytkownik"
                mail = "nowy@parkflex.pl"
                hash = "hash"
                plate = "WB 54321"
                role = "user"
            }
            user.id.value
        }

        val response = client.get("/api/historyEntry") {
            url { parameter("userId", userId.toString()) }
        }

        assertEquals(HttpStatusCode.OK, response.status)
        val history = response.body<List<HistoryEntry>>()
        assertTrue(history.isEmpty(), "History should be empty for a user without a reservation")
    }

    @Test
    fun `test creating reservation via POST and verifying in history GET`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        val (userId, spotId) = runDB {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, PenaltyTable, ParameterTable)

            val user = UserEntity.new(id = 2) {
                fullName = "Integrator Test"
                mail = "flow@parkflex.pl"
                hash = "hash"
                plate = "PO-FLOW1"
                role = "user"
            }
            val spot = SpotEntity.new {
                role = "normal"
                displayOrder = 1
            }
            user.id.value to spot.id.value
        }

        val startTime = LocalDateTime.now().plusDays(1)
        val startTimeString = startTime.format(DateTimeFormatter.ISO_DATE_TIME)

        val reservationRequest = CreateReservationRequest(
            spot_id = spotId,
            start = startTimeString,
            duration = 45
        )

        val postResponse = client.post("/api/reservation") {
            contentType(ContentType.Application.Json)
            setBody(reservationRequest)
        }

        assertEquals(HttpStatusCode.OK, postResponse.status)
        val postBody = postResponse.body<CreateReservationSuccessResponse>()
        assertEquals("Rezerwacja utworzona pomyslnie", postBody.message)

        val getResponse = client.get("/api/historyEntry") {
            url { parameter("userId", userId.toString()) }
        }

        assertEquals(HttpStatusCode.OK, getResponse.status)
        val history = getResponse.body<List<HistoryEntry>>()

        val found = history.find { it.durationMin == 45 && it.spot == spotId }

        assertTrue(found != null)
        assertEquals("ok", found.status)
    }
}