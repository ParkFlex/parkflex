package parkflex.routes

import parkflex.db.configDataBase.setupTestDB
import dummyToken
import io.ktor.client.call.*
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.server.testing.*
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.junit.jupiter.api.Test
import parkflex.configureTest
import parkflex.db.*
import parkflex.models.PreludeModel
import testingClient
import java.time.LocalDateTime
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertNull

class PreludeRoutesTest {
    @Test
    fun `test get prelude user with penalty`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        val userId = newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, PenaltyTable, ParameterTable)

            ParameterEntity.new {
                key = "reservation/duration/min"
                value = "30"
                this.type = ParameterType.Number
            }

            ParameterEntity.new {
                key = "reservation/duration/max"
                value = "120"
                this.type = ParameterType.Number
            }

            val user = UserEntity.new {
                fullName = "Penalty User"; mail = "pen@parkflex.pl"; hash = "hash"; plate = "PO-PEN01"; role = "user"
            }

            val spot = SpotEntity.new { role = "normal"; displayOrder = 1 }

            val res = ReservationEntity.new {
                this.start = LocalDateTime.now().minusDays(5)
                this.duration = 60
                this.user = user
                this.spot = spot
            }

            PenaltyEntity.new {
                this.reservation = res
                this.reason = PenaltyReason.Overtime
                this.fine = 100
                this.paid = false
                this.due = LocalDateTime.now().plusDays(7)
            }

            user.id.value
        }

        val token = dummyToken(userId)

        val response = client.get("api/prelude") {
            bearerAuth(token)
        }

        assertEquals(HttpStatusCode.OK, response.status)

        val body = response.body<PreludeModel>()

        assertEquals(30L, body.minReservationTime)
        assertEquals(120L, body.maxReservationTime)

        assertNotNull(body.penaltyInformation, "Informacja o karze powinna być obecna")
        assertEquals(100, body.penaltyInformation.fine)
        assertEquals(PenaltyReason.Overtime, body.penaltyInformation.reason)
    }

    @Test
    fun `test get prelude clean user`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        val userId = newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, PenaltyTable, ParameterTable)

            ParameterEntity.new {
                key = "reservation/duration/min"
                value = "15"
                this.type = ParameterType.Number
            }
            ParameterEntity.new {
                key = "reservation/duration/max"
                value = "60"
                this.type = ParameterType.Number
            }

            val user = UserEntity.new {
                fullName = "Clean User"; mail = "clean@parkflex.pl"; hash = "h"; plate = "P0"; role = "user"
            }

            SpotEntity.new { role = "normal"; displayOrder = 1 }

            user.id.value
        }

        val token = dummyToken(userId)

        val response = client.get("api/prelude") {
            bearerAuth(token)
        }

        assertEquals(HttpStatusCode.OK, response.status)

        val body = response.body<PreludeModel>()

        assertEquals(15L, body.minReservationTime)
        assertEquals(60L, body.maxReservationTime)

        assertNull(body.penaltyInformation, "Informacja o karze powinna być null dla czystego użytkownika")
    }

    @Test
    fun `test get prelude unauthorized`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()


        newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, PenaltyTable, ParameterTable)
        }

        val token = dummyToken(999)

        val response = client.get("api/prelude") {
            bearerAuth(token)
        }

        assertEquals(HttpStatusCode.Unauthorized, response.status)
    }
}