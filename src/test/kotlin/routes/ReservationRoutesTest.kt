package parkflex.routes

import db.configDataBase.setupTestDB
import io.ktor.client.call.body
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.http.contentType
import io.ktor.server.testing.testApplication
import org.jetbrains.exposed.sql.SchemaUtils
import org.junit.jupiter.api.Test
import parkflex.configureTest
import parkflex.db.ParameterTable
import parkflex.db.PenaltyTable
import parkflex.db.ReservationTable
import parkflex.db.SpotEntity
import parkflex.db.SpotTable
import parkflex.db.UserEntity
import parkflex.db.UserTable
import parkflex.models.CreateReservationRequest
import parkflex.models.CreateReservationSuccessResponse
import parkflex.runDB
import testingClient
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import kotlin.test.assertEquals

class ReservationRoutesTest {

    @Test
    fun `test post reservation WoW user exist`() = testApplication{
        val db = setupTestDB()
        application{ configureTest(db) }
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

        val response = client.post("api/reservation")
        {
            contentType(ContentType.Application.Json)
            setBody(reservationRequest)
        }

        assertEquals(HttpStatusCode.OK, response.status)

        val responseBody = response.body<CreateReservationSuccessResponse>()
        assertEquals("Rezerwacja utworzona pomyslnie", responseBody.message)
    }
    @Test
    fun `test post reservation SAD user does't exist `() = testApplication{
        val db = setupTestDB()
        application{ configureTest(db) }
        val client = testingClient()

        val spotId = runDB {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, PenaltyTable, ParameterTable)

            val spot = SpotEntity.new {
                role = "normal"
                displayOrder = 1
            }
            spot.id.value
        }

        val startTime = LocalDateTime.now().plusDays(1)
        val startTimeString = startTime.format(DateTimeFormatter.ISO_DATE_TIME)

        val reservationRequest = CreateReservationRequest(
            spot_id = spotId,
            start = startTimeString,
            duration = 45
        )

        val response = client.post("api/reservation")
        {
            contentType(ContentType.Application.Json)
            setBody(reservationRequest)
        }

        assertEquals(HttpStatusCode.Unauthorized, response.status)

    }


}