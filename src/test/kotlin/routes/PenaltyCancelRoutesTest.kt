package parkflex.routes

import adminToken
import db.configDataBase.setupTestDB
import dummyToken
import io.ktor.client.request.bearerAuth
import io.ktor.client.request.patch
import io.ktor.client.statement.bodyAsText
import io.ktor.http.HttpStatusCode
import io.ktor.server.testing.testApplication
import newAdmmin
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import parkflex.configureTest
import parkflex.db.ParameterTable
import parkflex.db.PenaltyEntity
import parkflex.db.PenaltyReason
import parkflex.db.PenaltyTable
import parkflex.db.ReservationEntity
import parkflex.db.ReservationTable
import parkflex.db.SpotEntity
import parkflex.db.SpotTable
import parkflex.db.UserEntity
import parkflex.db.UserTable
import testingClient
import java.time.LocalDateTime
import kotlin.test.assertEquals

class PenaltyCancelRoutesTest {

    @Test
    fun `test cancel penalty success`() = testApplication {
        val db = setupTestDB()
        val client = testingClient()

        val penaltyId = newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, PenaltyTable, ParameterTable)

            newAdmmin()

            val user = UserEntity.new { fullName = "A"; mail = "a@a.pl"; hash = "h"; plate = "PL1"; role = "user" }
            val spot = SpotEntity.new { role = "normal"; displayOrder = 1 }
            val reserv = ReservationEntity.new {
                start = LocalDateTime.now();
                duration = 60;
                this.user = user;
                this.spot = spot
            }

            PenaltyEntity.new {
                this.reservation = reserv
                this.reason = PenaltyReason.Overtime
                this.fine = 50
                this.paid = false
                this.due = LocalDateTime.now().plusDays(1)
            }.id.value
        }

        application { configureTest(db) }

        val response = client.patch("/api/admin/user/penalty/$penaltyId/cancel") {
            bearerAuth(dummyToken(1))
        }

        assertEquals(HttpStatusCode.OK, response.status)
    }

    @Test
    fun `test cancel penalty already cancelled`() = testApplication {
        val db = setupTestDB()
        val client = testingClient()

        val penaltyId = newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, PenaltyTable, ParameterTable)

            newAdmmin()

            val user = UserEntity.new(2) { fullName = "A"; mail = "a@a.pl"; hash = "h"; plate = "PL1"; role = "user" }
            val spot = SpotEntity.new { role = "normal"; displayOrder = 1 }
            val reserv = ReservationEntity.new {
                start = LocalDateTime.now();
                duration = 60;
                this.user = user;
                this.spot = spot
            }

            PenaltyEntity.new {
                this.reservation = reserv
                this.reason = PenaltyReason.Overtime
                this.fine = 50
                this.paid = true
                this.due = LocalDateTime.now().plusDays(1)
            }.id.value
        }

        application { configureTest(db) }

        val response = client.patch("/api/admin/user/penalty/$penaltyId/cancel") {
            bearerAuth(adminToken)
        }

        assertEquals(HttpStatusCode.BadRequest, response.status)

        val responseBody = response.bodyAsText()

        assertTrue(responseBody.contains("is already cancelled"))
    }

    @Test
    fun `test cancel penalty not found`() = testApplication {
        val db = setupTestDB()
        val client = testingClient()


        newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, PenaltyTable, ParameterTable)

            newAdmmin()

            val user = UserEntity.new { fullName = "A"; mail = "a@a.pl"; hash = "h"; plate = "PL1"; role = "user" }
            val spot = SpotEntity.new { role = "normal"; displayOrder = 1 }
            val reserv = ReservationEntity.new {
                start = LocalDateTime.now();
                duration = 60;
                this.user = user;
                this.spot = spot
            }

        }

        application { configureTest(db) }

        val response = client.patch("/api/admin/user/penalty/67/cancel") {
            bearerAuth(dummyToken(1))
        }

        assertEquals(HttpStatusCode.NotFound, response.status)
    }
}