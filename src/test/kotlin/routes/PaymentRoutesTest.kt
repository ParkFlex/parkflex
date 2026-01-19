package parkflex.routes

import db.configDataBase.setupTestDB
import io.ktor.client.call.body
import io.ktor.client.request.bearerAuth
import io.ktor.client.request.post
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.http.contentType
import io.ktor.server.testing.testApplication
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.junit.jupiter.api.Test
import parkflex.configureTest
import parkflex.db.*
import parkflex.models.ApiErrorModel
import parkflex.repository.JwtRepository
import testingClient
import java.time.LocalDateTime
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue

class PaymentRoutesTest {


    fun dummyToken(uid: Long) =
        JwtRepository.generateToken(uid, "dummy@parkflex.pl", "user")

    @Test
    fun `test post payment WoW pay all penalties`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        val (userId, penaltyId) = newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, PenaltyTable)

            val user = UserEntity.new {
                fullName = "Payer Test"; mail = "pay@parkflex.pl"; hash = "hash"; plate = "PO-PAY01"; role = "user"
            }
            val spot = SpotEntity.new { role = "normal"; displayOrder = 1 }

            val res = ReservationEntity.new {
                this.start = LocalDateTime.now().minusDays(5)
                this.duration = 60
                this.user = user
                this.spot = spot
            }

            val penalty = PenaltyEntity.new {
                this.reservation = res
                this.reason = PenaltyReason.Overtime
                this.fine = 50
                this.paid = false
                this.due = LocalDateTime.now().minusDays(1)
            }

            Pair(user.id.value, penalty.id.value)
        }

        val token = dummyToken(userId)

        val response = client.post("api/payment") {
            contentType(ContentType.Application.Json)
            bearerAuth(token)
        }

        assertEquals(HttpStatusCode.OK, response.status)

        newSuspendedTransaction(db = db) {
            val penalty = PenaltyEntity[penaltyId]
            assertTrue(penalty.paid, "Kara powinna byc oznaczona jako oplacona (paid=true)")
        }
    }

    @Test
    fun `test post payment WoW user has no penalties`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        val userId = newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, PenaltyTable)
            val user = UserEntity.new {
                fullName = "Clean User"; mail = "clean@parkflex.pl"; hash = "h"; plate = "P0"; role = "user"
            }
            user.id.value
        }

        val token = dummyToken(userId)

        val response = client.post("api/payment") {
            contentType(ContentType.Application.Json)
            bearerAuth(token)
        }

        assertEquals(HttpStatusCode.OK, response.status)
    }

    @Test
    fun `test post payment SAD unauthorized`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()


        val token = dummyToken(999)
        val response = client.post("api/payment") {
            bearerAuth(token)

        }

        assertEquals(HttpStatusCode.Unauthorized, response.status)
        val errorBody = response.body<ApiErrorModel>()
        assertEquals("No user found in context", errorBody.message)
    }
}