package parkflex.routes

import io.ktor.client.call.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.testing.*
import org.junit.jupiter.api.Test
import kotlin.test.*
import parkflex.configureTest
import parkflex.models.ApiErrorModel

class HistoryRoutesTest {

    @Test
    fun `test get history without userId(null) returns 422`() = testApplication {
        application {
            configureTest()
        }

        val client = createClient {
            install(ContentNegotiation) { json() }
        }

        val response = client.get("/api/historyEntry")

        assertEquals(HttpStatusCode.UnprocessableEntity, response.status)

        val errorBody = response.body<ApiErrorModel>()
        assertEquals("No ID found", errorBody.message)
    }
}