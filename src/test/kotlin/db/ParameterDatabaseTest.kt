package parkflex.db

import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import kotlin.test.*

class ParameterDatabaseTest {

    private lateinit var db: Database

    @BeforeEach
    fun setup() {
        db = configDataBase.setupTestDB()
    }

    @Test
    fun `test creating and retrieving a parameter`() {
        transaction(db) {
            SchemaUtils.create(ParameterTable)

            val created = ParameterEntity.new {
                key = "api_url"
                value = "https://api.parkflex.pl"
                type = ParameterType.String
            }

            val retrieved = ParameterEntity.findById(created.id)

            assertNotNull(retrieved)
            assertEquals("api_url", retrieved.key)
            assertEquals("https://api.parkflex.pl", retrieved.value)
            assertEquals(ParameterType.String, retrieved.type)
        }
    }
}