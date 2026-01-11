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
import parkflex.db.ReservationEntity
import parkflex.db.PenaltyEntity
import parkflex.db.PenaltyReason
import io.ktor.serialization.kotlinx.json.json
import io.ktor.client.statement.bodyAsText


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
        assertEquals("Rezerwacje można tworzyć tylko na miejsce typu 'normal' (otrzymano abnormal)", responseBody.message)
    }
    
    @Test
    fun `test post reservation SAD spot busy`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        val (_, spotId) = runDB {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, PenaltyTable, ParameterTable)
            
            val user = UserEntity.new(id = 2) {
                fullName = "Integrator Test"; mail = "flow@parkflex.pl"; hash = "hash"; plate = "PO-FLOW1"; role = "user"
            }

            val otherUser = UserEntity.new(id = 3) {
                fullName = "Inny Uzytkownik"; mail = "other@parkflex.pl"; hash = "hash"; plate = "PO-OTHER"; role = "user"
            }
            
            val spot = SpotEntity.new { role = "normal"; displayOrder = 1 }

            ReservationEntity.new {
                this.start = LocalDateTime.now().plusDays(1)
                this.duration = 60
                this.user = otherUser 
                this.spot = spot
            }
            user.id.value to spot.id.value
        }

        val reservationRequest = CreateReservationRequest(
            spot_id = spotId,
            start = LocalDateTime.now().plusDays(1).format(DateTimeFormatter.ISO_DATE_TIME),
            duration = 45
        )

        val response = client.post("api/reservation") {
            contentType(ContentType.Application.Json)
            setBody(reservationRequest)
        }

        assertEquals(HttpStatusCode.Conflict, response.status)
        assertEquals("Miejsce zajete w tym czasie", response.body<ApiErrorModel>().message)
    }

    @Test
    fun `test post reservation SAD invalid date format`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        val (_, spotId) = runDB {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, PenaltyTable, ParameterTable)
            val user = UserEntity.new(id = 2) {
                fullName = "Integrator Test"; mail = "flow@parkflex.pl"; hash = "hash"; plate = "PO-FLOW1"; role = "user"
            }
            val spot = SpotEntity.new { role = "normal"; displayOrder = 1 }
            user.id.value to spot.id.value
        }

        val reservationRequest = CreateReservationRequest(
        spot_id = spotId,
        start = "2024-12-12 10:00", 
        duration = 45
        )

        val response = client.post("api/reservation") {
            contentType(ContentType.Application.Json)
            setBody(reservationRequest)
        }

        assertEquals(HttpStatusCode.BadRequest, response.status)
        assertEquals("Nieprawidlowy format daty", response.body<ApiErrorModel>().message)
    }

    @Test
    fun `test post reservation SAD user has active reservation`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        val (_, spotId) = runDB {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, PenaltyTable, ParameterTable)
            val user = UserEntity.new(id = 2) {
                fullName = "Integrator Test"; mail = "flow@parkflex.pl"; hash = "hash"; plate = "PO-FLOW1"; role = "user"
            }
            val spot = SpotEntity.new { role = "normal"; displayOrder = 1 }
            
            ReservationEntity.new {
                this.start = LocalDateTime.now().plusHours(1)
                this.duration = 30
                this.user = user
                this.spot = spot
            }
            user.id.value to spot.id.value
        }

        val response = client.post("api/reservation") {
            contentType(ContentType.Application.Json)
            setBody(CreateReservationRequest(spotId, LocalDateTime.now().plusDays(2).toString(), 45))
        }

        assertEquals(HttpStatusCode.Conflict, response.status)
        assert(response.body<ApiErrorModel>().message.contains("Użytkownik ma już aktywną rezerwację"))
    }

    @Test
    fun `test post reservation SAD user is banned`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        val (_, spotId) = runDB {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, PenaltyTable, ParameterTable)
            
            val user = UserEntity.new(id = 2) {
                fullName = "Zbanowany Użytkownik"
                mail = "banned@parkflex.pl"
                hash = "hash"
                plate = "PO-BANNED"
                role = "user"
            }
            
            val spot = SpotEntity.new { 
                role = "normal"
                displayOrder = 1 
            }

            val oldReservation = ReservationEntity.new {
                this.start = LocalDateTime.now().minusDays(5)
                this.duration = 60
                this.user = user
                this.spot = spot
            }

            PenaltyEntity.new {
                this.reservation = oldReservation
                this.reason = PenaltyReason.Overtime 
                this.fine = 50L 
                this.paid = false
                this.due = LocalDateTime.now().plusDays(7)
            }

            user.id.value to spot.id.value
        }

        val reservationRequest = CreateReservationRequest(
            spot_id = spotId,
            start = LocalDateTime.now().plusDays(1).format(DateTimeFormatter.ISO_DATE_TIME),
            duration = 60
        )

        val response = client.post("api/reservation") {
            contentType(ContentType.Application.Json)
            setBody(reservationRequest)
        }

        assertEquals(HttpStatusCode.Forbidden, response.status)
        val responseBody = response.body<ApiErrorModel>()
        assertEquals("Banowany uzytkownik nie moze robic rezerwacji", responseBody.message)
    }
    @Test
    fun `test post reservation SAD no authorization header`() = testApplication {
            val db = setupTestDB()
            application { configureTest(db) }
            
            val client = createClient {
                install(io.ktor.client.plugins.contentnegotiation.ContentNegotiation) {
                    json() 
                }
            }

            val reservationRequest = CreateReservationRequest(
                spot_id = 1,
                start = LocalDateTime.now().plusDays(1).format(DateTimeFormatter.ISO_DATE_TIME),
                duration = 30
            )

            val response = client.post("api/reservation") {
                contentType(ContentType.Application.Json)
                setBody(reservationRequest)
            }

            assertEquals(HttpStatusCode.Unauthorized, response.status)
            val responseBody = response.body<ApiErrorModel>()
            assertEquals("Brak tokena lub token nieprawidlowy", responseBody.message)
    }

    @Test
    fun `test post reservation SAD invalid data body`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        val response = client.post("api/reservation") {
            contentType(ContentType.Application.Json)
            setBody("{ \"invalid\": \"json\" }")
        }

        assertEquals(HttpStatusCode.BadRequest, response.status)
        assertEquals("Nieprawidlowe dane", response.body<ApiErrorModel>().message)
    }
  
   
    //add more tests
} 