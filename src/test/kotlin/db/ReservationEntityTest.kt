package db

import io.ktor.server.testing.*
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.Test
import parkflex.db.*
import java.time.LocalDateTime
import kotlin.test.*

class ReservationEntityTest {

    private fun setupTestDB() {
        Database.connect("jdbc:h2:mem:test;DB_CLOSE_DELAY=-1;", driver = "org.h2.Driver")
        transaction {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable)
        }
    }

    @Test
    fun `test time collision logic`() = testApplication {
        setupTestDB()
        transaction {
            val user = UserEntity.new { fullName="A"; mail="a@a.com"; hash="h"; plate="P"; role="U" }
            val spot = SpotEntity.new { role="S"; displayOrder=1 }

            val existingRes = ReservationEntity.new {
                start = LocalDateTime.of(2025, 1, 1, 10, 0)
                duration = 60 // Ends at 11:00
                this.spot = spot
                this.user = user
            }

            val overlaps = existingRes.timeCollidesWith(10,
                LocalDateTime.of(2025, 1, 1, 11, 5),
                LocalDateTime.of(2025, 1, 1, 12, 0)
            )
            assertTrue(overlaps, "Should collide because 11:05 is within 10 mins of 11:00")
        }
    }
}