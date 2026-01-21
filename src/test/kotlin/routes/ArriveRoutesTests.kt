package parkflex.routes

import dummyToken
import firstSSE
import io.ktor.client.call.*
import io.ktor.client.request.*
import io.ktor.http.HttpStatusCode
import io.ktor.server.testing.*
import kotlinx.coroutines.delay
import newUser
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertNotNull
import parkflex.configureTest
import parkflex.db.ReservationEntity
import parkflex.db.ReservationTable
import parkflex.db.SpotEntity
import parkflex.db.UserTable
import parkflex.db.configDataBase.setupTestDB
import parkflex.models.ArrivalStatus
import parkflex.models.NoPresentReservationModel
import parkflex.models.SuccessfulArrivalModel
import testingClient
import java.time.LocalDateTime
import kotlin.test.assertEquals
import kotlin.test.assertNotEquals

class ArriveRoutesTests {
    /* Successful arrival tests */

    @Test
    fun `should respond with NoReservation when no reservation is found`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        val uid = newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, ReservationTable)

            newUser().id.value
        }

        val token = client.firstSSE("/term/entry")
        assertNotEquals(null, token)

        val resp = client.post("/api/arrive/${token}") {
            bearerAuth(dummyToken(uid))
        }

        val body = resp.body<NoPresentReservationModel>()

        assertEquals(ArrivalStatus.NoReservation, body.status)
    }

    @Test
    fun `should set arrived when reservation is present`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        val (uid, rid) = newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, ReservationTable)

            val user = newUser()

            val spot = SpotEntity.new {
                this.role = "normal"
                this.displayOrder = 1
            }

            val reservation = ReservationEntity.new {
                this.user = user
                this.spot = spot
                this.start = LocalDateTime.now()
                this.duration = 60
                this.arrived = null
                this.left = null
            }

            Pair(user.id.value, reservation.id.value)
        }


        val token = client.firstSSE("/term/entry")
        assertNotEquals(null, token)

        delay(200)

        val resp = client.post("/api/arrive/${token}") {
            bearerAuth(dummyToken(uid))
        }

        val body = resp.body<SuccessfulArrivalModel>()
        assertEquals(ArrivalStatus.Ok, body.status)

        val reservation = newSuspendedTransaction(db = db) {
            ReservationEntity.findById(rid)!!
        }

        assertNotNull(reservation.arrived)
    }

    /* Malformed request handling */

    @Test
    fun `should respond with BadRequest on invalid token`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, ReservationTable)

            newUser()
        }

        val resp = client.post("/api/arrive/foobar") {
            bearerAuth(dummyToken(1))
        }

        assertEquals(HttpStatusCode.BadRequest, resp.status)
    }
}