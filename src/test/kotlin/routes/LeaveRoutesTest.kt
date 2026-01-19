package parkflex.routes

import dummyToken
import firstSSE
import io.ktor.client.plugins.sse.*
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.server.testing.*
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.first
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.junit.jupiter.api.Test
import parkflex.configureTest
import parkflex.db.*
import parkflex.db.configDataBase.setupTestDB
import parkflex.service.TermService
import testingClient
import java.time.LocalDateTime
import kotlin.test.assertEquals
import kotlin.test.assertNotEquals

class LeaveRoutesTest {
    @Test
    fun `test successful exit`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, PenaltyTable, ParameterTable)

            val user = UserEntity.new(id = 2) {
                fullName = "Test User"
                mail = "test@parkflex.pl"
                hash = "hash"
                plate = "WA 12345"
                role = "user"
            }
            val spot = SpotEntity.new {
                role = "standard"
                displayOrder = 1
            }

            ReservationEntity.new {
                this.user = user
                this.spot = spot
                this.start = LocalDateTime.now().minusHours(1)
                this.duration = 120
                this.arrived = LocalDateTime.now().minusMinutes(30)
                this.left = null
            }
        }

        // poll the first token from the exit gate API and terminate the flow
        val token = client.firstSSE("/term/exit")

        // make sure we didn't just time out
        assertNotEquals(null, token)

        // act: leave
        client.post("/api/leave/${token}") {
            bearerAuth(dummyToken(2))
        }

        delay(200) // wait for the db to update the field

        // check that we filled the `left` col
        val left = newSuspendedTransaction(db = db) {
            ReservationEntity.all().first().left
        }

        assertNotEquals(null, left)
    }

    @Test
    fun `test exit with invalid token returns 400`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        val response = client.post("/api/leave/wrong-token") {
            bearerAuth(dummyToken(1))
        }
        assertEquals(HttpStatusCode.BadRequest, response.status)
    }

    @Test
    fun `test exit when no active reservation exists returns 400`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, ParameterTable)
            UserEntity.new(id = 2) {
                fullName = "No Reservation User"
                mail = "no@res.pl"
                hash = "hash"
                plate = "WA 00000"
                role = "user"
            }
        }

        // poll the first token from the exit gate API and terminate the flow
        val token = client.firstSSE("/term/exit")

        // make sure we didn't just time out
        assertNotEquals(null, token)

        val response = client.post("/api/leave/$token") {
            bearerAuth(dummyToken(1))
        }

        assertEquals(HttpStatusCode.BadRequest, response.status)
    }

    @Test
    fun `test exit when user already left returns 400`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, ParameterTable)
            val user = UserEntity.new(id = 2) {
                fullName = "Already Left"
                mail = "left@parkflex.pl"
                hash = "hash"
                plate = "WA 11111"
                role = "user"
            }
            val spot = SpotEntity.new { role = "standard"; displayOrder = 1 }

            ReservationEntity.new {
                this.user = user
                this.spot = spot
                this.start = LocalDateTime.now()
                this.duration = 60
                this.arrived = LocalDateTime.now().minusMinutes(10)
                this.left = LocalDateTime.now().minusMinutes(5)
            }
        }

        // poll the first token from the exit gate API and terminate the flow
        val token = client.firstSSE("/term/exit")

        // make sure we didn't just time out
        assertNotEquals(null, token)

        val response = client.post("/api/leave/$token") {
            bearerAuth(dummyToken(2))
        }

        assertEquals(HttpStatusCode.BadRequest, response.status)
    }
}