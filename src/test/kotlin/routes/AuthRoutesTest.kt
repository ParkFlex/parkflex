package parkflex.routes

import dummyToken
import parkflex.db.configDataBase.setupTestDB
import io.ktor.client.call.body
import io.ktor.client.request.*
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.http.contentType
import io.ktor.server.testing.testApplication
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.deleteAll
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.junit.jupiter.api.Test
import org.mindrot.jbcrypt.BCrypt
import parkflex.configureTest
import parkflex.db.UserEntity
import parkflex.db.UserTable
import parkflex.models.*
import testingClient
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertTrue

class AuthRoutesTest {
    @Test
    fun `test register success`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        // Używamy create + deleteAll dla pewności, że tabela jest czysta
        newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable)
            UserTable.deleteAll()
        }

        val registerReq = RegisterRequest(
            name = "Nowy User",
            email = "new@parkflex.pl",
            password = "SecretPassword123!",
            plate = "PO 12345"
        )

        val response = client.post("api/register") {
            contentType(ContentType.Application.Json)
            setBody(registerReq)
        }

        assertEquals(HttpStatusCode.Created, response.status)
        val body = response.body<RegisterResponse>()

        assertNotNull(body.token)
        assertEquals("new@parkflex.pl", body.user.email)
        // Normalizacja może usunąć spację, więc sprawdzamy czy zawiera znaki
        assertTrue(body.user.plate.contains("PO"))
        assertTrue(body.user.plate.contains("12345"))
    }

    @Test
    fun `test register user already exists`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable)
            UserTable.deleteAll()

            UserEntity.new {
                fullName = "Old User"; mail = "exists@parkflex.pl"; hash = "hash"; plate = "PO 99999"; role = "user"
            }
        }

        val registerReq = RegisterRequest("Nowy", "exists@parkflex.pl", "pass", "WA 66666")

        val response = client.post("api/register") {
            contentType(ContentType.Application.Json)
            setBody(registerReq)
        }

        assertEquals(HttpStatusCode.Conflict, response.status)
        assertEquals("Użytkownik już istnieje", response.body<ApiErrorModel>().message)
    }

    @Test
    fun `test register invalid plate`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        newSuspendedTransaction(db = db) { SchemaUtils.create(UserTable) }

        val registerReq = RegisterRequest("Nowy", "abc@pf.pl", "pass", "INVALID_PLATE")

        val response = client.post("api/register") {
            contentType(ContentType.Application.Json)
            setBody(registerReq)
        }

        assertEquals(HttpStatusCode.BadRequest, response.status)
        assertEquals("Niepoprawny format tablicy rejestracyjnej", response.body<ApiErrorModel>().message)
    }

    @Test
    fun `test login success`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        val passwordRaw = "MySecretPass"

        newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable)
            UserTable.deleteAll()

            UserEntity.new {
                fullName = "Login User"; mail = "login@parkflex.pl"
                hash = BCrypt.hashpw(passwordRaw, BCrypt.gensalt())
                plate = "PO 12345"; role = "user"
            }
        }

        val response = client.post("api/login") {
            contentType(ContentType.Application.Json)
            setBody(LoginRequest("login@parkflex.pl", passwordRaw))
        }

        assertEquals(HttpStatusCode.OK, response.status)
        val body = response.body<LoginResponse>()
        assertNotNull(body.token)
        assertEquals("Login User", body.user.name)
    }

    @Test
    fun `test login wrong password`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable)
            UserTable.deleteAll()
            UserEntity.new {
                fullName = "Login User"; mail = "login@parkflex.pl"
                hash = BCrypt.hashpw("GoodPass", BCrypt.gensalt())
                plate = "PO 12345"; role = "user"
            }
        }

        val response = client.post("api/login") {
            contentType(ContentType.Application.Json)
            setBody(LoginRequest("login@parkflex.pl", "BadPass"))
        }

        assertEquals(HttpStatusCode.Unauthorized, response.status)
        assertEquals("Nieprawidłowy email lub hasło", response.body<ApiErrorModel>().message)
    }

    @Test
    fun `test login user not found`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        newSuspendedTransaction(db = db) { SchemaUtils.create(UserTable) }

        val response = client.post("api/login") {
            contentType(ContentType.Application.Json)
            setBody(LoginRequest("ghost@parkflex.pl", "pass"))
        }

        assertEquals(HttpStatusCode.Unauthorized, response.status)
        assertEquals("Nieprawidłowy email lub hasło", response.body<ApiErrorModel>().message)
    }

    @Test
    fun `test whoami success`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        val userId = newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable)
            UserTable.deleteAll()
            UserEntity.new {
                fullName = "Me"; mail = "me@pf.pl"; hash = "h"; plate = "PO 12345"; role = "admin"
            }.id.value
        }

        val response = client.get("api/whoami") {
            bearerAuth(dummyToken(userId))
        }

        assertEquals(HttpStatusCode.OK, response.status)
        val userModel = response.body<UserPublicModel>()
        assertEquals("admin", userModel.role)
    }

    @Test
    fun `test whoami user deleted`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        newSuspendedTransaction(db = db) { SchemaUtils.create(UserTable) }
        val token = dummyToken(999)

        val response = client.get("api/whoami") {
            bearerAuth(token)
        }

        assertEquals(HttpStatusCode.NotFound, response.status)
        assertEquals("Nie znaleziono użytkownika", response.body<ApiErrorModel>().message)
    }

    @Test
    fun `test patch account update plate`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        val userId = newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable)
            UserTable.deleteAll()

            UserEntity.new {
                fullName = "Driver"; mail = "drive@pf.pl"; hash = "h"; plate = "PO 12345"; role = "user"
            }.id.value
        }

        val newPlate = "WA 99999"

        val response = client.patch("api/account") {
            contentType(ContentType.Application.Json)
            setBody(PatchAccountRequest(plate = newPlate))
            bearerAuth(dummyToken(userId))
        }

        assertEquals(HttpStatusCode.OK, response.status)
        val body = response.body<UserPublicModel>()

        assertEquals(body.plate.replace(" ", ""), newPlate.replace(" ", ""))

        val updatedUser = newSuspendedTransaction(db = db) {
            UserEntity.findById(userId)!!
        }

        assertEquals(updatedUser.plate.replace(" ", ""), newPlate.replace(" ", ""))
    }

    @Test
    fun `test patch account invalid plate format`() = testApplication {
        val db = setupTestDB()
        application { configureTest(db) }
        val client = testingClient()

        val userId = newSuspendedTransaction(db = db) {
            SchemaUtils.create(UserTable)
            UserEntity.new {
                fullName = "Driver"; mail = "drive@pf.pl"; hash = "h"; plate = "PO 12345"; role = "user"
            }.id.value
        }

        val response = client.patch("api/account") {
            contentType(ContentType.Application.Json)
            setBody(PatchAccountRequest(plate = "BAD_PLATE"))
            bearerAuth(dummyToken(userId))
        }

        assertEquals(HttpStatusCode.BadRequest, response.status)
        assertTrue(
            response.body<ApiErrorModel>().message.contains("nieprawidłowy format tablicy")
                    || response.body<ApiErrorModel>().message.contains("Niepoprawne dane")
        )
    }
}