package parkflex.routes

import db.configDataBase.setupTestDB
import dummyToken
import io.ktor.client.call.body
import io.ktor.client.request.bearerAuth
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.http.contentType
import io.ktor.server.testing.testApplication
import newAdmmin
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.junit.jupiter.api.Test
import parkflex.configureTest
import parkflex.db.ParameterEntity
import parkflex.db.ParameterTable
import parkflex.db.ParameterType
import parkflex.db.PenaltyEntity
import parkflex.db.PenaltyReason
import parkflex.db.PenaltyTable
import parkflex.db.ReportEntity
import parkflex.db.ReportTable
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

class PenaltyCreationRoutesTest {
    @Test
    fun `test create penalty success created`() = testApplication {
        val db = setupTestDB()
        val client = testingClient()

        val reportId = newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, PenaltyTable, ParameterTable, ReportTable)

            ParameterEntity.new { key = "penalty/fine/overtime"; value = "10"; type = ParameterType.String }
            ParameterEntity.new { key = "penalty/block/duration"; value = "24"; type = ParameterType.String }

            newAdmmin()

            val user = UserEntity.new(id = 2) {
                fullName = "Test"; mail = "t@t.pl"; hash = "h"; plate = "PL1"; role = "user"
            }

            val spot = SpotEntity.new { role = "normal"; displayOrder = 1 }

            val reserv = ReservationEntity.new {
                start = LocalDateTime.now().minusHours(2)
                duration = 60
                this.user = user
                this.spot = spot
            }

            ReportEntity.new {
                this.plate = "PL1"
                this.timestamp = LocalDateTime.now()
                this.reviewed = false
                this.image = "image.jpg"
                this.description = "description"
                this.submitter = user
            }
        }.id.value

        application { configureTest(db) }

        val response = client.post("/api/admin/penalty") {
            contentType(ContentType.Application.Json)
            setBody(ReportIdWrapper(reportId))
            bearerAuth(dummyToken(1))
        }

        assertEquals(HttpStatusCode.OK, response.status)
        val body = response.body<NewPenaltyResponseModel>()
        assertEquals(NewPenaltyResponseState.Created, body.state)
    }

    @Test
    fun `test create penalty report not found`() = testApplication {
        val db = setupTestDB()
        val client = testingClient()

        newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, PenaltyTable, ParameterTable, ReportTable)

            newAdmmin()
        }

        application { configureTest(db) }

        val response = client.post("/api/admin/penalty") {
            contentType(ContentType.Application.Json)
            setBody(ReportIdWrapper(67))
            bearerAuth(dummyToken(1))
        }

        assertEquals(HttpStatusCode.NotFound, response.status)
    }

    @Test
    fun `test create penalty already reviewed`() = testApplication {
        val db = setupTestDB()
        val client = testingClient()

        val reportId = newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, PenaltyTable, ParameterTable, ReportTable)

            newAdmmin()

            ParameterEntity.new { key = "penalty/fine/overtime"; value = "10"; type = ParameterType.String }
            ParameterEntity.new { key = "penalty/block/duration"; value = "24"; type = ParameterType.String }

            val user = UserEntity.new(id = 2) {
                fullName = "Test"; mail = "t@t.pl"; hash = "h"; plate = "PL1"; role = "user"
            }

            val spot = SpotEntity.new { role = "normal"; displayOrder = 1 }

            val reserv = ReservationEntity.new {
                start = LocalDateTime.now().minusHours(2)
                duration = 60
                this.user = user
                this.spot = spot
            }

            val penalty = PenaltyEntity.new {
                reservation = reserv
                reason = PenaltyReason.Overtime
                fine = 50
                paid = false
                due = LocalDateTime.now().plusDays(1)
            }


            ReportEntity.new {
                this.plate = "PL1"
                this.timestamp = LocalDateTime.now()
                this.reviewed = true
                this.penalty = penalty
                this.image = "image.jpg"
                this.description = "description"
                this.submitter = user
            }
        }.id.value

        application { configureTest(db) }

        val response = client.post("/api/admin/penalty") {
            contentType(ContentType.Application.Json)
            setBody(ReportIdWrapper(reportId))
            bearerAuth(dummyToken(1))
        }

        assertEquals(HttpStatusCode.BadRequest, response.status)
    }

    @Test
    fun `test create penalty no reservation found`() = testApplication {
        val db = setupTestDB()
        val client = testingClient()

        val reportId = newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, PenaltyTable, ParameterTable, ReportTable)

            newAdmmin()

            ParameterEntity.new { key = "penalty/fine/overtime"; value = "10"; type = ParameterType.String }
            ParameterEntity.new { key = "penalty/block/duration"; value = "24"; type = ParameterType.String }

            val user = UserEntity.new {
                fullName = "Test"; mail = "t@t.pl"; hash = "h"; plate = "PL1"; role = "user"
            }

            val spot = SpotEntity.new { role = "normal"; displayOrder = 1 }

            ReportEntity.new {
                this.plate = "PL1"
                this.timestamp = LocalDateTime.now()
                this.reviewed = false
                this.image = "image.jpg"
                this.description = "description"
                this.submitter = user
            }
        }.id.value

        application { configureTest(db) }

        val response = client.post("/api/admin/penalty") {
            contentType(ContentType.Application.Json)
            setBody(ReportIdWrapper(reportId))
            bearerAuth(dummyToken(1))
        }

        assertEquals(HttpStatusCode.NotFound, response.status)
    }

    @Test
    fun `test create penalty updated`() = testApplication {
        val db = setupTestDB()
        val client = testingClient()

        val reportId = newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, PenaltyTable, ParameterTable, ReportTable)

            newAdmmin()

            ParameterEntity.new { key = "penalty/fine/overtime"; value = "10"; type = ParameterType.String }
            ParameterEntity.new { key = "penalty/block/duration"; value = "24"; type = ParameterType.String }

            val user = UserEntity.new {
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
                fine = 5
                paid = false
                due = LocalDateTime.now().plusDays(1)
            }

            ReportEntity.new {
                this.plate = "PL1"
                this.timestamp = LocalDateTime.now()
                this.reviewed = false
                this.image = "image.jpg"
                this.description = "description"
                this.submitter = user
            }
        }.id.value

        application { configureTest(db) }

        val response = client.post("/api/admin/penalty") {
            contentType(ContentType.Application.Json)
            setBody(ReportIdWrapper(reportId))
            bearerAuth(dummyToken(1))
        }

        assertEquals(HttpStatusCode.OK, response.status)
        val body = response.body<NewPenaltyResponseModel>()
        assertEquals(NewPenaltyResponseState.Updated, body.state)
    }

    @Test
    fun `test create penalty not changed`() = testApplication {
        val db = setupTestDB()
        val client = testingClient()

        val reportId = newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, PenaltyTable, ParameterTable, ReportTable)

            newAdmmin()

            ParameterEntity.new { key = "penalty/fine/overtime"; value = "10"; type = ParameterType.String }
            ParameterEntity.new { key = "penalty/block/duration"; value = "24"; type = ParameterType.String }

            val user = UserEntity.new {
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
                fine = 100
                paid = false
                due = LocalDateTime.now().plusDays(1)
            }

            ReportEntity.new {
                this.plate = "PL1"
                this.timestamp = LocalDateTime.now()
                this.reviewed = false
                this.image = "image.jpg"
                this.description = "description"
                this.submitter = user
            }
        }.id.value

        application { configureTest(db) }

        val response = client.post("/api/admin/penalty") {
            contentType(ContentType.Application.Json)
            setBody(ReportIdWrapper(reportId))
            bearerAuth(dummyToken(1))
        }

        assertEquals(HttpStatusCode.OK, response.status)
        val body = response.body<NewPenaltyResponseModel>()
        assertEquals(NewPenaltyResponseState.NotChanged, body.state)
    }

    @Test
    fun `test create penalty invalid json`() = testApplication {
        val db = setupTestDB()
        val client = testingClient()

        application { configureTest(db) }

        newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable)
            newAdmmin()
        }

        val response = client.post("/api/admin/penalty") {
            contentType(ContentType.Application.Json)
            setBody("{}")
            bearerAuth(dummyToken(1))
        }

        assertEquals(HttpStatusCode.BadRequest, response.status)
    }
}