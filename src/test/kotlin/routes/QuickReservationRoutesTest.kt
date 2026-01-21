package parkflex.routes.term

import dummyToken
import firstSSE
import io.ktor.client.call.*
import io.ktor.client.request.*
import io.ktor.client.statement.bodyAsText
import io.ktor.http.*
import io.ktor.server.testing.*
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.junit.jupiter.api.Test
import parkflex.configureTest
import parkflex.db.*
import parkflex.db.configDataBase.setupTestDB
import parkflex.models.ApiErrorModel
import testingClient
import java.time.LocalTime
import kotlin.test.assertEquals
import kotlin.test.assertNotNull

class QuickReservationRoutesTest {

    @Test
    fun `test quick reservation success`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, ParameterTable)

            ParameterEntity.new {
                key = "reservation/duration/min"; value = "15"; type = ParameterType.Number
            }
            ParameterEntity.new {
                key = "reservation/duration/max"; value = "240"; type = ParameterType.Number
            }
            ParameterEntity.new {
                key = "reservation/break/duration"; value = "15"; type = ParameterType.Number
            }
            ParameterEntity.new {
                key = "parking/layout"; value = "G 1\nv .\n"; type = ParameterType.String
            }

            SpotEntity.new { role = "normal"; displayOrder = 1 }
            UserEntity.new(id = 2) {
                fullName = "Quick Test"; mail = "q@pf.pl"; hash = "h"; plate = "PO123"; role = "user"
            }
        }

        val token = client.firstSSE("/term/entry")
        val endTime = LocalTime.now().plusHours(1).toString().substring(0, 5)

        val response = client.post("/api/quickReservation/$token?end=$endTime") {
            bearerAuth(dummyToken(2))
        }

        assertEquals(HttpStatusCode.Created, response.status)
        val responseText = response.bodyAsText()
        assertNotNull(responseText)
        assert(responseText.contains("\"spot\":"))
    }

    @Test
    fun `test quick reservation fails when no spots found`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, ParameterTable)

            ParameterEntity.new {
                key = "reservation/duration/min"; value = "15"; type = ParameterType.Number
            }
            ParameterEntity.new {
                key = "reservation/duration/max"; value = "240"; type = ParameterType.Number
            }
            ParameterEntity.new {
                key = "reservation/break/duration"; value = "15"; type = ParameterType.Number
            }
            ParameterEntity.new {
                key = "parking/layout"; value = "G 1\nv .\n"; type = ParameterType.String
            }

            UserEntity.new(id = 3) {
                fullName = "No Spot User"; mail = "ns@pf.pl"; hash = "h"; plate = "PO456"; role = "user"
            }
        }

        val token = client.firstSSE("/term/entry")
        val endTime = LocalTime.now().plusHours(1).toString().substring(0, 5)

        val response = client.post("/api/quickReservation/$token?end=$endTime") {
            bearerAuth(dummyToken(3))
        }

        assertEquals(HttpStatusCode.NotFound, response.status)
        assertEquals("No free spot for this timespan found", response.body<ApiErrorModel>().message)
    }

    @Test
    fun `test quick reservation fails on duration too long`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, ParameterTable)

            ParameterEntity.new {
                key = "reservation/duration/min"; value = "15"; type = ParameterType.Number
            }
            ParameterEntity.new {
                key = "reservation/duration/max"; value = "60"; type = ParameterType.Number
            }
            ParameterEntity.new {
                key = "reservation/break/duration"; value = "15"; type = ParameterType.Number
            }
            ParameterEntity.new {
                key = "parking/layout"; value = "G 1\nv .\n"; type = ParameterType.String
            }

            SpotEntity.new { role = "normal"; displayOrder = 1 }
            UserEntity.new(id = 4) {
                fullName = "Long Res User"; mail = "l@pf.pl"; hash = "h"; plate = "PO789"; role = "user"
            }
        }

        val token = client.firstSSE("/term/entry")
        val endTime = LocalTime.now().plusHours(5).toString().substring(0, 5)

        val response = client.post("/api/quickReservation/$token?end=$endTime") {
            bearerAuth(dummyToken(4))
        }

        assertEquals(HttpStatusCode.BadRequest, response.status)
        assertEquals("Duration too short or too long", response.body<ApiErrorModel>().message)
    }

    @Test
    fun `test quick reservation fails on duration too short`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, ParameterTable)

            ParameterEntity.new {
                key = "reservation/duration/min"; value = "60"; type = ParameterType.Number
            }
            ParameterEntity.new {
                key = "reservation/duration/max"; value = "240"; type = ParameterType.Number
            }
            ParameterEntity.new {
                key = "reservation/break/duration"; value = "15"; type = ParameterType.Number
            }
            ParameterEntity.new {
                key = "parking/layout"; value = "G 1\nv .\n"; type = ParameterType.String
            }

            SpotEntity.new { role = "normal"; displayOrder = 1 }
            UserEntity.new(id = 5) {
                fullName = "Short Res User"; mail = "s@pf.pl"; hash = "h"; plate = "PO111"; role = "user"
            }
        }

        val token = client.firstSSE("/term/entry")
        val endTime = LocalTime.now().plusMinutes(30).toString().substring(0, 5)

        val response = client.post("/api/quickReservation/$token?end=$endTime") {
            bearerAuth(dummyToken(5))
        }

        assertEquals(HttpStatusCode.BadRequest, response.status)
        assertEquals("Duration too short or too long", response.body<ApiErrorModel>().message)
    }

    @Test
    fun `test quick reservation fails with invalid token`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, ParameterTable)

            ParameterEntity.new {
                key = "reservation/duration/min"; value = "15"; type = ParameterType.Number
            }
            ParameterEntity.new {
                key = "reservation/duration/max"; value = "240"; type = ParameterType.Number
            }
            ParameterEntity.new {
                key = "reservation/break/duration"; value = "15"; type = ParameterType.Number
            }
            ParameterEntity.new {
                key = "parking/layout"; value = "G 1\nv .\n"; type = ParameterType.String
            }

            SpotEntity.new { role = "normal"; displayOrder = 1 }
            UserEntity.new(id = 6) {
                fullName = "Token Test User"; mail = "t@pf.pl"; hash = "h"; plate = "PO222"; role = "user"
            }
        }

        val endTime = LocalTime.now().plusHours(1).toString().substring(0, 5)

        val response = client.post("/api/quickReservation/invalid-token?end=$endTime") {
            bearerAuth(dummyToken(6))
        }

        assertEquals(HttpStatusCode.BadRequest, response.status)
    }
}