package db

import io.ktor.server.testing.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.Test
import parkflex.db.*
import java.time.LocalDateTime
import kotlin.test.*

class ReportEntityTest {

    @org.junit.jupiter.api.BeforeEach
    fun setup() {
        configDataBase.setupTestDB(UserTable, ReservationTable, PenaltyTable, ReportTable)
    }

    @Test
    fun `test creating a report with a valid user`() = testApplication {
        setup()

        transaction {

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
        }
    }
}