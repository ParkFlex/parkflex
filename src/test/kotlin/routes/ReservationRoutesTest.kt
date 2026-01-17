package parkflex.routes

import db.configDataBase.setupTestDB
import io.ktor.client.call.body
import io.ktor.client.request.bearerAuth
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.http.contentType
import io.ktor.server.testing.testApplication
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.Test
import parkflex.configureTest
import parkflex.db.*
import parkflex.models.*
import parkflex.models.reservation.CreateReservationRequest
import parkflex.models.reservation.CreateReservationSuccessResponse
import parkflex.repository.JwtRepository
import testingClient
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class ReservationRoutesTest {
    fun dummyToken(uid: Long) =
        JwtRepository.generateToken(uid, "dummy@parkflex.pl", "user")

    @Test
    fun `test post reservation WoW user exist`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        val (spotId, userId) = newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, PenaltyTable, ParameterTable)

            val user = UserEntity.new(id = 2) {
                fullName = "Integrator Test"; mail = "flow@parkflex.pl"; hash = "hash"; plate = "PO-FLOW1"; role = "user"
            }
            val spot = SpotEntity.new {
                role = "normal"
                displayOrder = 1
            }
            Pair(spot.id.value, user.id.value)
        }

        val token = dummyToken(userId)

        val reservationRequest = CreateReservationRequest(
            spot_id = spotId,
            start = LocalDateTime.now().plusDays(1).format(DateTimeFormatter.ISO_DATE_TIME),
            duration = 45
        )

        val response = client.post("api/reservation") {
            contentType(ContentType.Application.Json)
            setBody(reservationRequest)
            bearerAuth(token)
        }

        assertEquals(HttpStatusCode.OK, response.status)
        assertEquals("Rezerwacja utworzona pomyslnie", response.body<CreateReservationSuccessResponse>().message)
    }

    @Test
    fun `test post reservation SAD user doest exist`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, PenaltyTable, ParameterTable)
        }

        val response = client.post("api/reservation") {
            contentType(ContentType.Application.Json)
            setBody(CreateReservationRequest(1, LocalDateTime.now().plusDays(1).toString(), 45))
        }

        assertEquals(HttpStatusCode.Unauthorized, response.status)
        //assertEquals("Brak tokena lub token nieprawidlowy", response.body<ApiErrorModel>().message)
    }

    @Test
    fun `test post reservation (spot = NULL)`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        val user = newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, PenaltyTable, ParameterTable)
            UserEntity.new(id = 2) {
                fullName = "Integrator Test"; mail = "flow@parkflex.pl"; hash = "hash"; plate = "PO-FLOW1"; role = "user"
            }
        }

        val token = dummyToken(user.id.value)

        val response = client.post("api/reservation") {
            contentType(ContentType.Application.Json)
            setBody(CreateReservationRequest(-100, LocalDateTime.now().plusDays(1).toString(), 45))
            bearerAuth(token)
        }

        assertEquals(HttpStatusCode.NotFound, response.status)
        assertEquals("Miejsce parkingowe nie istnieje", response.body<ApiErrorModel>().message)
    }

    @Test
    fun `test post reservation (spot = NOT normal)`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        val (spotId, userId) = newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, PenaltyTable, ParameterTable)

            val user = UserEntity.new(id = 2) {
                fullName = "Integrator Test"; mail = "flow@parkflex.pl"; hash = "hash"; plate = "PO-FLOW1"; role = "user"
            }

            val spot = SpotEntity.new { role = "abnormal"; displayOrder = 1 }

            Pair(spot.id.value, user.id.value)
        }

        val token = dummyToken(userId)

        val response = client.post("api/reservation") {
            contentType(ContentType.Application.Json)
            setBody(CreateReservationRequest(spotId, LocalDateTime.now().plusDays(1).toString(), 45))
            bearerAuth(token)
        }

        assertEquals(HttpStatusCode.BadRequest, response.status)
        assertTrue(response.body<ApiErrorModel>().message.contains("tylko na miejsce typu 'normal'"))
    }

    @Test
    fun `test post reservation spot busy`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        val startTime = LocalDateTime.now().plusDays(1)
        val spotId = newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, PenaltyTable, ParameterTable)
            val u2 = UserEntity.new(id = 2) {
                fullName = "U2"; mail = "u2@pf.pl"; hash = "h"; plate = "P1"; role = "user"
            }
            val u3 = UserEntity.new(id = 3) {
                fullName = "U3"; mail = "u3@pf.pl"; hash = "h"; plate = "P2"; role = "user"
            }
            val spot = SpotEntity.new { role = "normal"; displayOrder = 1 }

            ReservationEntity.new {
                this.start = startTime
                this.duration = 60
                this.user = u3
                this.spot = spot
            }
            spot.id.value
        }

        val response = client.post("api/reservation") {
            contentType(ContentType.Application.Json)
            setBody(CreateReservationRequest(spotId, startTime.toString(), 45))
            bearerAuth(dummyToken(2))
        }

        assertEquals(HttpStatusCode.Conflict, response.status)
        assertEquals("Miejsce zajete w tym czasie", response.body<ApiErrorModel>().message)
    }

    @Test
    fun `test post reservation user has active reservation`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        val (spotId, userId) = newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, PenaltyTable, ParameterTable)
            val user = UserEntity.new(id = 2) {
                fullName = "Test"; mail = "t@pf.pl"; hash = "h"; plate = "P1"; role = "user"
            }
            val spot = SpotEntity.new { role = "normal"; displayOrder = 1 }

            ReservationEntity.new {
                this.start = LocalDateTime.now().plusHours(1)
                this.duration = 30
                this.user = user
                this.spot = spot
            }
            Pair(spot.id.value, user.id.value)
        }

        val token = dummyToken(userId)

        val response = client.post("api/reservation") {
            contentType(ContentType.Application.Json)
            setBody(CreateReservationRequest(spotId, LocalDateTime.now().plusDays(2).toString(), 45))
            bearerAuth(token)
        }

        assertEquals(HttpStatusCode.Conflict, response.status)
        assertTrue(response.body<ApiErrorModel>().message.contains("Użytkownik ma już aktywną rezerwację"))
    }

    @Test
    fun `test post reservation user is banned`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        val (spotId, userId) = newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, PenaltyTable, ParameterTable)
            val user = UserEntity.new(id = 2) {
                fullName = "Banned"; mail = "b@pf.pl"; hash = "h"; plate = "P1"; role = "user"
            }
            val spot = SpotEntity.new { role = "normal"; displayOrder = 1 }
            val res = ReservationEntity.new {
                this.start = LocalDateTime.now().minusDays(1)
                this.duration = 60; this.user = user; this.spot = spot
            }
            PenaltyEntity.new {
                this.reservation = res; this.reason = PenaltyReason.Overtime
                this.fine = 50; this.paid = false; this.due = LocalDateTime.now().plusDays(1)
            }
            Pair(spot.id.value, user.id.value)
        }

        val token = dummyToken(userId)

        val response = client.post("api/reservation") {
            contentType(ContentType.Application.Json)
            setBody(CreateReservationRequest(spotId, LocalDateTime.now().plusDays(1).toString(), 60))
            bearerAuth(token)
        }

        assertEquals(HttpStatusCode.Forbidden, response.status)
        assertEquals("Banowany uzytkownik nie moze robic rezerwacji", response.body<ApiErrorModel>().message)
    }

    @Test
    fun `test post reservation invalid date format`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        val user = newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, PenaltyTable, ParameterTable)
            UserEntity.new(id = 2) {
                fullName = "Test"; mail = "t@pf.pl"; hash = "h"; plate = "P1"; role = "user"
            }
        }

        val token = dummyToken(user.id.value)

        val response = client.post("api/reservation") {
            contentType(ContentType.Application.Json)
            setBody(CreateReservationRequest(1, "zla-data", 45))
            bearerAuth(token)
        }

        assertEquals(HttpStatusCode.BadRequest, response.status)
        assertEquals("Nieprawidlowy format daty", response.body<ApiErrorModel>().message)
    }

    @Test
    fun `test post reservation invalid data body`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        val userId = transaction(db) {
            SchemaUtils.create(UserTable, ReservationTable)

            UserEntity.new {
                fullName = "Test"; mail = "t@pf.pl"; hash = "h"; plate = "P1"; role = "user"
            }.id.value
        }

        val response = client.post("api/reservation") {
            contentType(ContentType.Application.Json)
            setBody("{ \"totalnie\": \"zly_json\" }")
            bearerAuth(dummyToken(userId))
        }

        assertEquals(HttpStatusCode.BadRequest, response.status)
        assertEquals("Nieprawidlowe dane", response.body<ApiErrorModel>().message)
    }
}