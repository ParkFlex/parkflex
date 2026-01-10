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
import parkflex.models.HistoryEntry
import parkflex.runDB
import testingClient
import java.time.LocalDateTime
import kotlin.test.assertEquals

class HistoryRoutesTest {

    @Test
    fun `test get history without userId(null) returns 422`() = testApplication {
        application {
            configureTest()
        }
        val client = testingClient()

        val response = client.get("/api/historyEntry")
        assertEquals(HttpStatusCode.UnprocessableEntity, response.status)
    }

    @Test
    fun `test get history without user(null) returns 404`() = testApplication {
        application {
            configureTest()
        }
        val client = testingClient()

        val response = client.get("/api/historyEntry") {
            url { parameter("userId", "999") }
        }
        assertEquals(HttpStatusCode.NotFound, response.status)
    }

    @Test
    fun `test history returns data when user exists`() = testApplication {
        val db = setupTestDB()

        application {
            configureTest(db)
        }
        val client = testingClient()

        val (generatedUserId, generatedSpotId) = runDB {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, PenaltyTable)

            val user = UserEntity.new {
                fullName = "Jan Kowalski"
                mail = "jan.test@parkflex.pl"
                hash = "hash"
                plate = "WA12345"
                role = "user"
            }
            val spot = SpotEntity.new {
                role = "standard"
                displayOrder = 1
            }
            ReservationEntity.new {
                this.user = user
                this.spot = spot
                this.start = LocalDateTime.now().minusDays(1)
                this.duration = 60
            }
            user.id.value to spot.id.value
        }

        val response = client.get("/api/historyEntry") {
            url { parameter("userId", generatedUserId.toString()) }
        }

        assertEquals(HttpStatusCode.OK, response.status)
        val history = response.body<List<HistoryEntry>>()
        assertEquals(1, history.size)
        assertEquals(generatedSpotId, history[0].spot)
    }
}