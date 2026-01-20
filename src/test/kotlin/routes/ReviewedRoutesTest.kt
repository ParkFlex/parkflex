package routes
import adminToken
import parkflex.db.configDataBase.setupTestDB
import io.ktor.client.request.bearerAuth
import io.ktor.client.request.patch
import io.ktor.http.HttpStatusCode
import io.ktor.server.testing.testApplication
import newAdmmin
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.junit.jupiter.api.Test
import parkflex.configureTest
import parkflex.db.ReportEntity
import parkflex.db.ReportTable
import parkflex.db.UserEntity
import parkflex.db.UserTable
import testingClient
import java.time.LocalDateTime
import kotlin.test.assertEquals

class ReviewedRoutesTest {

    @Test
    fun `test report reviewed success`() = testApplication {
        val db = setupTestDB()
        val client = testingClient()

        val reportId = newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, ReportTable)

            newAdmmin()

            val user = UserEntity.new { fullName = "A"; mail = "a@a.pl"; hash = "h"; plate = "PL1"; role = "user" }

            ReportEntity.new {
                this.plate = "PL1"
                this.timestamp = LocalDateTime.now()
                this.reviewed = false
                this.image = "image.jpg"
                this.description = "description"
                this.submitter = user
            }.id.value
        }

        application { configureTest(db) }

        val response = client.patch("/api/admin/report/$reportId/reviewed") {
            bearerAuth(adminToken())
        }
        assertEquals(HttpStatusCode.OK, response.status)

    }

    @Test
    fun `test report already reviewed`() = testApplication {
        val db = setupTestDB()
        val client = testingClient()

        val reportId = newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, ReportTable)

            newAdmmin()

            val user = UserEntity.new { fullName = "A"; mail = "a@a.pl"; hash = "h"; plate = "PL1"; role = "user" }

            ReportEntity.new {
                this.plate = "PL1"
                this.timestamp = LocalDateTime.now()
                this.reviewed = true
                this.image = "image.jpg"
                this.description = "description"
                this.submitter = user
            }.id.value
        }

        application { configureTest(db) }

        val response = client.patch("/api/admin/report/$reportId/reviewed") {
            bearerAuth(adminToken())
        }
        assertEquals(HttpStatusCode.BadRequest, response.status)

    }

    @Test
    fun `test report not found`() = testApplication {
        val db = setupTestDB()
        val client = testingClient()

        newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, ReportTable)

            newAdmmin()

        }

        application { configureTest(db) }

        val response = client.patch("/api/admin/report/67/reviewed") {
            bearerAuth(adminToken())
        }
        assertEquals(HttpStatusCode.NotFound, response.status)

    }
}