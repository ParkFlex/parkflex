package parkflex.routes

import db.configDataBase.setupTestDB
import io.ktor.client.call.*
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.server.testing.*
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.junit.jupiter.api.Test
import parkflex.configureTest
import parkflex.db.*
import parkflex.models.ApiErrorModel
import parkflex.models.SpotModel
import testingClient
import java.time.LocalDateTime
import kotlin.test.assertEquals

class SpotRoutesTest {

    @Test
    fun `test get spot success with reservations`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        val spotId = newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, PenaltyTable, ParameterTable)

            val user = UserEntity.new(id = 2) {
                fullName = "Test User"
                mail = "test@parkflex.pl"
                hash = "hash"
                plate = "PO-TEST"
                role = "user"
            }

            val spot = SpotEntity.new {
                role = "normal"
                displayOrder = 1
            }

            ReservationEntity.new {
                this.start = LocalDateTime.of(2024, 10, 10, 10, 0)
                this.duration = 60
                this.user = user
                this.spot = spot
            }

            spot.id.value
        }

        val response = client.get("/api/spot") {
            url { parameters.append("spot_id", spotId.toString()) }
        }

        assertEquals(HttpStatusCode.OK, response.status)

        val body = response.body<SpotModel>()
        assertEquals(spotId, body.id)
        assertEquals("normal", body.role)
        assertEquals(1, body.reservations.size)
        // Sprawdzamy czy format daty w odpowiedzi zgadza się z oczekiwanym
        assertEquals("2024-10-10T10:00:00", body.reservations[0].start)
        assertEquals(60, body.reservations[0].time)
    }

    @Test
    fun `test get spot missing spot_id`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        val response = client.get("/api/spot")

        assertEquals(HttpStatusCode.BadRequest, response.status)
        val body = response.body<ApiErrorModel>()
        assertEquals("Nie podano spot_id !!", body.message)
    }

    @Test
    fun `test get spot spot does not exist`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        newSuspendedTransaction(db = db) {
            SchemaUtils.create(SpotTable)
        }

        val response = client.get("/api/spot") {
            url { parameters.append("spot_id", "999") }
        }

        assertEquals(HttpStatusCode.NotFound, response.status)
        val body = response.body<ApiErrorModel>()
        assertEquals("Nie ma spotu o id 999", body.message)
    }

    @Test
    fun `test get spot invalid id format`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        val response = client.get("/api/spot") {
            url { parameters.append("spot_id", "abc") }
        }

        assertEquals(HttpStatusCode.BadRequest, response.status)
        val body = response.body<ApiErrorModel>()
        assertEquals("spot_id musi być prawilną liczbą naturalną", body.message)
    }
}