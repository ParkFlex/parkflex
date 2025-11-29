package parkflex.routes

import io.ktor.client.call.body
import io.ktor.client.request.*
import io.ktor.server.testing.*
import kotlin.test.*

import org.junit.jupiter.api.Test
import parkflex.models.DemoNoteModel
import io.ktor.serialization.kotlinx.json.*

import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.http.ContentType
import io.ktor.http.contentType
import parkflex.configureTest

class DemoRoutesTest {
    @Test
    fun `PUT and GET should work together`() = testApplication {
        application { configureTest() }

        val client = createClient {
            install(ContentNegotiation) { json() }
        }

        val inputNote = DemoNoteModel("some title", "some contents")

        client.put("/api/demo") {
            contentType(ContentType.Application.Json)
            setBody(inputNote)
        }

        val response = client.get("/api/demo") {
            url {
                parameters.append("title", "some title")
            }
        }

        val outputNote = response.body<DemoNoteModel>()

        assertEquals(inputNote, outputNote)
    }

    @Test
    fun `PUT should update value in subsequent calls`() = testApplication {
        application { configureTest() }

        val client = createClient {
            install(ContentNegotiation) { json() }
        }

        val inputNote = DemoNoteModel("some title", "some contents")
        val updatedNote = DemoNoteModel("some title", "some other contents")

        client.put("/api/demo") {
            contentType(ContentType.Application.Json)
            setBody(inputNote)
        }

        client.put("/api/demo") {
            contentType(ContentType.Application.Json)
            setBody(updatedNote)
        }

        val respondedNote = client.get("/api/demo?id=1") {
            url {
                parameters.append("title", inputNote.title)
            }
        }.body<DemoNoteModel>()

        assertEquals(respondedNote, updatedNote)
    }
}