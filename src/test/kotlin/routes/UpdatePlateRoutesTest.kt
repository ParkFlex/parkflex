package parkflex.routes

import adminToken
import parkflex.db.configDataBase.setupTestDB
import io.ktor.client.call.*
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.server.testing.testApplication
import newAdmmin
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.junit.jupiter.api.Test
import parkflex.configureTest
import parkflex.db.*
import parkflex.models.*
import parkflex.models.admin.UpdatePlateModel
import testingClient
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class UpdatePlateRoutesTest {

    @Test
    fun `test update user plate success`() = testApplication {
        val db = setupTestDB()
        var userId: Long = 0

        newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable, UserTable)

            newAdmmin()

            val user = UserEntity.new {
                fullName = "Jan Kowalski"
                mail = "test@parkflex.pl"
                hash = "dummy-hash"
                role = "USER"
                plate = "XYZ123"
            }
            userId = user.id.value
        }

        application { configureTest(db) }
        val client = testingClient()

        // Ścieżka ustalona na podstawie apiRoutes.kt i adminRoutes
        val response = client.patch("api/admin/user/$userId") {
            contentType(ContentType.Application.Json)
            setBody(UpdatePlateModel(plate = "abc-77-nn"))
            bearerAuth(adminToken())
        }

        assertEquals(HttpStatusCode.NoContent, response.status)

        newSuspendedTransaction(db = db) {
            val updatedUser = UserEntity.findById(userId)
            assertEquals("ABC77NN", updatedUser?.plate)
        }
    }

    @Test
    fun `test update user plate conflict when plate already exists`() = testApplication {
        val db = setupTestDB()
        var userToUpdateId: Long = 0

        newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable)

            newAdmmin()

            UserEntity.new {
                fullName = "Adam Nowak"
                mail = "existing@parkflex.pl"
                hash = "hash1"
                role = "USER"
                plate = "WARSZAWA1"
            }
            val user2 = UserEntity.new {
                fullName = "Ewa Lis"
                mail = "editor@parkflex.pl"
                hash = "hash2"
                role = "USER"
                plate = "OLDPLATE"
            }
            userToUpdateId = user2.id.value
        }

        application { configureTest(db) }
        val client = testingClient()

        val response = client.patch("api/admin/user/$userToUpdateId") {
            contentType(ContentType.Application.Json)
            setBody(UpdatePlateModel(plate = "warszawa 1"))

            bearerAuth(adminToken())
        }

        assertEquals(HttpStatusCode.Conflict, response.status)
        val error = response.body<ApiErrorModel>()
        assertTrue(error.message.contains("Plate already in use"))
    }

    @Test
    fun `test update user plate fail user not found`() = testApplication {
        val db = setupTestDB()

        newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable)
            newAdmmin()
        }

        application { configureTest(db) }
        val client = testingClient()

        val response = client.patch("api/admin/user/999") {
            contentType(ContentType.Application.Json)
            setBody(UpdatePlateModel(plate = "NEW123"))
            bearerAuth(adminToken())
        }

        assertEquals(HttpStatusCode.NotFound, response.status)
        val error = response.body<ApiErrorModel>()
        assertTrue(error.message.contains("User not found"))
    }
}