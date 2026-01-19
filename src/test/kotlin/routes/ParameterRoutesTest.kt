package parkflex.routes

import db.configDataBase.setupTestDB
import io.ktor.client.call.body
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.server.testing.testApplication
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.junit.jupiter.api.Test
import parkflex.configureTest
import parkflex.db.*
import parkflex.models.*
import parkflex.models.admin.ParameterModel
import parkflex.models.admin.ParameterUpdateModel
import testingClient
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class ParameterRoutesTest {

    @Test
    fun `test get all parameters`() = testApplication {
        val db = setupTestDB()
        
        newSuspendedTransaction(db = db) {
            SchemaUtils.create(ParameterTable)
            
            ParameterEntity.new {
                key = "parking/layout"
                type = ParameterType.String
                value = "standard"
            }
            
            ParameterEntity.new {
                key = "site/name"
                type = ParameterType.String
                value = "ParkFlex"
            }
        }

        application { configureTest(db) }
        val client = testingClient()

        val response = client.get("api/admin/parameter/all")

        assertEquals(HttpStatusCode.OK, response.status)
        val params = response.body<List<ParameterModel>>()
        
        assertTrue(params.any { it.key == "site/name" })
    }

    @Test
    fun `test get single nested parameter`() = testApplication {
        val db = setupTestDB()
        
        newSuspendedTransaction(db = db) {
            SchemaUtils.create(ParameterTable)
            ParameterEntity.new {
                key = "parking/layout"
                type = ParameterType.String
                value = "grid-v1"
            }
        }

        application { configureTest(db) }
        val client = testingClient()

        val response = client.get("api/admin/parameter/parking/layout")

        assertEquals(HttpStatusCode.OK, response.status)
        val param = response.body<ParameterModel>()
        assertEquals("grid-v1", param.value)
    }

    @Test
    fun `test update parameter validation fail`() = testApplication {
        val db = setupTestDB()
        
        newSuspendedTransaction(db = db) {
            SchemaUtils.create(ParameterTable)
            ParameterEntity.new {
                key = "parking/layout" 
                type = ParameterType.String
                value = "standard"
            }
            ParameterEntity.new {
                key = "max_capacity"
                type = ParameterType.Number
                value = "50"
            }
        }

        application { configureTest(db) }
        val client = testingClient()

        val response = client.patch("api/admin/parameter/max_capacity") {
            contentType(ContentType.Application.Json)
            setBody(ParameterUpdateModel(value = "not-a-number"))
        }

        assertEquals(HttpStatusCode.BadRequest, response.status)
        val error = response.body<ApiErrorModel>()
        assertTrue(error.message.contains("numeric"))
    }
}