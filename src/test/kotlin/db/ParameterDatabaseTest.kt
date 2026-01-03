package db

import io.ktor.server.testing.*

import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.Test
import parkflex.db.ParameterEntity
import parkflex.db.ParameterTable
import kotlin.test.*

class ParameterDatabaseTest {

    @org.junit.jupiter.api.BeforeEach
    fun setup() {
        configDataBase.setupTestDB(ParameterTable)
    }

    @Test
    fun `test creating and retrieving a parameter`() = testApplication {
        setup()

        transaction {

            val created = ParameterEntity.new {
                key = "api_url"
                value = "https://api.parkflex.pl"
            }

            val retrieved = ParameterEntity.findById(created.id)

            assertNotNull(retrieved)
            assertEquals("api_url", retrieved.key)
            assertEquals("https://api.parkflex.pl", retrieved.value)
        }
    }

    @Test
    fun `test searching for a parameter by its key`() = testApplication {
        setup()

        transaction {

            ParameterEntity.new { key = "version"; value = "1.0.0" }
            ParameterEntity.new { key = "env"; value = "prod" }

            val versionParam = ParameterEntity.find { ParameterTable.key eq "version" }.single()

            assertEquals("1.0.0", versionParam.value)
        }
    }
}