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
import parkflex.models.ApiErrorModel
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
    fun `test post reservation SAD user doest exist `() = testApplication{
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

        val responseBody = response.body<ApiErrorModel>()
        assertEquals("Brak tokena lub token nieprawidlowy", responseBody.message)

    }

    @Test
    fun `test post reservation (spot = NULL) Take break go home `() = testApplication{
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
                role = "abnormal"
                displayOrder = 1
            }
            user.id.value to spot.id.value
        }

        val startTime = LocalDateTime.now().plusDays(1)
        val startTimeString = startTime.format(DateTimeFormatter.ISO_DATE_TIME)
        val reservationRequest = CreateReservationRequest(
            spot_id = -100,
            start = startTimeString,
            duration = 45
        )

        val response = client.post("api/reservation"){
            contentType(ContentType.Application.Json)
            setBody(reservationRequest)
        }

        assertEquals(HttpStatusCode.NotFound, response.status)

        val responseBody = response.body<ApiErrorModel>()
        assertEquals("Miejsce parkingowe nie istnieje", responseBody.message)

    }
    // check code
    @Test
    fun `test post reservation (spot = !normal)`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
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
                role = "abnormal" // <-- here
                displayOrder = 1
            }
            user.id.value to spot.id.value
        }

        val startTime = LocalDateTime.now().plusDays(1)
        val reservationRequest = CreateReservationRequest(
            spot_id = spotId,
            start = startTime.format(DateTimeFormatter.ISO_DATE_TIME),
            duration = 45
        )

        val response = client.post("api/reservation") {
            contentType(ContentType.Application.Json)
            setBody(reservationRequest)
        }

        assertEquals(HttpStatusCode.BadRequest, response.status)

        val responseBody = response.body<ApiErrorModel>()
        assertEquals("Rezerwacje można tworzyć tylko na miejsce typu 'normal' (otrzymano abnormal", responseBody.message)
    }
    //add more tests
    // 1."Miejsce zajete w tym czasie"
    // 2."Nieprawidlowy format daty"
    // 3."Użytkownik ma już aktywną rezerwację ($day: $startTime-$endTime)"
    // 4."Banowany uzytkownik nie moze robic rezerwacji"
    // 5."Brak tokena lub token nieprawidlowy" użytkownik nie istnieje dodac jeszcze brak tokena autoryzacyjnego
    // 6."Nieprawidlowe dane"
}