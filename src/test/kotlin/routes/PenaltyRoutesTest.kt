package routes

import db.configDataBase.setupTestDB
import io.ktor.client.call.body
import io.ktor.client.request.get
import io.ktor.http.HttpStatusCode
import io.ktor.server.testing.testApplication
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
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
import parkflex.models.admin.*
import testingClient
import java.time.LocalDateTime
import kotlin.test.assertEquals

class PenaltyRoutesTest {

    @Test
    fun `test get active penalty success`() = testApplication{
        val db = setupTestDB()
        val client = testingClient()

        val userId = newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, PenaltyTable, ParameterTable)

            val user = UserEntity.new(id = 1) {
                fullName = "Test"; mail = "t@t.pl"; hash = "h"; plate = "PL1"; role = "user"
            }

            val spot = SpotEntity.new { role = "normal"; displayOrder = 1 }

            val reserv = ReservationEntity.new {
                start = LocalDateTime.now().minusHours(2)
                duration = 60
                this.user = user
                this.spot = spot
            }

            PenaltyEntity.new {
                reservation = reserv
                reason = PenaltyReason.Overtime
                fine = 50
                paid = false
                due = LocalDateTime.now().plusDays(1)
            }

            user.id.value
        }

        application { configureTest(db) }

        val response = client.get("/api/admin/user/$userId/penalty")

        assertEquals(HttpStatusCode.OK, response.status)
        val body = response.body<PenaltyModel>()
        assertEquals(PenaltyReason.Overtime, body.reason)
        assertEquals(50.0, body.fine)
    }

    @Test
    fun `test get penalty returns no content when no penalties`() = testApplication{
        val db = setupTestDB()
        val client = testingClient()

        val userId = newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, PenaltyTable, ParameterTable)

            val user = UserEntity.new(id = 1) {
                fullName = "Test"; mail = "t@t.pl"; hash = "h"; plate = "PL1"; role = "user"
            }

            user.id.value
        }

        application { configureTest(db) }

        val response = client.get("/api/admin/user/$userId/penalty")

        assertEquals(HttpStatusCode.NoContent, response.status)
    }

    @Test
    fun `test get penalty user not found`() = testApplication{
        val db = setupTestDB()
        val client = testingClient()

        newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, PenaltyTable, ParameterTable)

        }

        application { configureTest(db) }

        val response = client.get("/api/admin/user/67/penalty")

        assertEquals(HttpStatusCode.NotFound, response.status)
    }

    @Test
    fun `test get penalty invalid id`() = testApplication{
        val db = setupTestDB()
        val client = testingClient()

        application { configureTest(db) }

        val response = client.get("/api/admin/user/abc/penalty")

        assertEquals(HttpStatusCode.BadRequest, response.status)
    }
}