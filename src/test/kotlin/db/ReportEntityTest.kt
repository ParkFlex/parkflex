package parkflex.db

import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import java.time.LocalDateTime
import kotlin.test.*

class ReportEntityTest {

    private lateinit var db: Database

    @BeforeEach
    fun setup() {
        db = configDataBase.setupTestDB()
    }

    @Test
    fun `test creating a report with a valid user`() {

        transaction(db) {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, PenaltyTable, ReportTable)

            val user = UserEntity.new {
                fullName = "John Doe"
                mail = "john@parkflex.pl"
                hash = "hashed_password"
                plate = "WA12345"
                role = "USER"
            }

            val newReport = ReportEntity.new {
                submitter = user
                timestamp = LocalDateTime.now()
                image = "base64-string-here"
                description = "Car blocking the entrance."
                reviewed = false
                plate = "W0-PARK1"
            }

            val retrieved = ReportEntity.findById(newReport.id)

            assertNotNull(retrieved)
            assertEquals("W0-PARK1", retrieved.plate)
            assertEquals("John Doe", retrieved.submitter.fullName)
            assertFalse(retrieved.reviewed)
        }
    }
}