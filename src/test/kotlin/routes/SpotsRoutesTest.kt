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
import parkflex.models.reservation.SpotsModel
import testingClient
import java.time.LocalDateTime
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue

class SpotsRoutesTest {

    @Test
    fun `test get spots availability success`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, ParameterTable, PenaltyTable)

            ParameterEntity.new {
                key = "reservation/break/duration"
                value = "15"
                type = ParameterType.String
            }

            val user = UserEntity.new(id = 1) {
                fullName = "Test"; mail = "t@t.pl"; hash = "h"; plate = "PL1"; role = "user"
            }

            // Spot 1: Zajęty (12:00 - 13:00)
            val spotOccupied = SpotEntity.new { role = "normal"; displayOrder = 1 }
            ReservationEntity.new {
                start = LocalDateTime.of(2024, 10, 10, 12, 0)
                duration = 60
                this.user = user
                this.spot = spotOccupied
            }

            // Spot 2: Wolny
            SpotEntity.new { role = "normal"; displayOrder = 2 }
        }

        val start = "2024-10-10T12:30:00"
        val end = "2024-10-10T13:30:00"

        val response = client.get("/api/spots") {
            url {
                parameters.append("start", start)
                parameters.append("end", end)
            }
        }

        assertEquals(HttpStatusCode.OK, response.status)
        val body = response.body<SpotsModel>()

        assertTrue(body.spots.first { it.displayOrder == 1 }.occupied, "Spot 1 should be occupied")
        assertFalse(body.spots.first { it.displayOrder == 2 }.occupied, "Spot 2 should be free")
    }

    @Test
    fun `test get spots availability considering break duration`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, ParameterTable, PenaltyTable)

            ParameterEntity.new {
                key = "reservation/break/duration"
                value = "30"
                type = ParameterType.String
            }

            val user = UserEntity.new(id = 1) {
                fullName = "Test"; mail = "t@t.pl"; hash = "h"; plate = "PL1"; role = "user"
            }
            val spot = SpotEntity.new { role = "normal"; displayOrder = 1 }

            ReservationEntity.new {
                start = LocalDateTime.of(2024, 10, 10, 11, 0)
                duration = 60
                this.user = user
                this.spot = spot
            }
        }

        val start = "2024-10-10T12:15:00"
        val end = "2024-10-10T13:00:00"

        val response = client.get("/api/spots") {
            url {
                parameters.append("start", start)
                parameters.append("end", end)
            }
        }

        val body = response.body<SpotsModel>()
        assertTrue(body.spots[0].occupied, "Spot should be occupied due to 30min break duration")
    }

    @Test
    fun `test get spots invalid date format`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        val response = client.get("/api/spots") {
            url {
                parameters.append("start", "2024-10-10")
                parameters.append("end", "nie-data")
            }
        }

        assertEquals(HttpStatusCode.BadRequest, response.status)
        assertEquals("incorrect format of start or end date", response.body<ApiErrorModel>().message)
    }

    @Test
    fun `test get spots end date before start date`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        val response = client.get("/api/spots") {
            url {
                parameters.append("start", "2024-10-10T15:00:00")
                parameters.append("end", "2024-10-10T14:00:00")
            }
        }

        assertEquals(HttpStatusCode.BadRequest, response.status)
        assertEquals("incorrect end date", response.body<ApiErrorModel>().message)
    }
}