package db

import io.ktor.server.testing.*
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.Test
import parkflex.db.*
import java.time.LocalDateTime
import kotlin.test.*

class PenaltyEntityTest {

    private fun setupTestDB() {
        Database.connect("jdbc:h2:mem:test;DB_CLOSE_DELAY=-1;", driver = "org.h2.Driver")
        transaction {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, PenaltyTable)
        }
    }

    @Test
    fun `test penalty activity status`() = testApplication {
        setupTestDB()
        transaction {
            val user = UserEntity.new { fullName="A"; mail="b@b.com"; hash="h"; plate="P"; role="U" }
            val spot = SpotEntity.new { role="S"; displayOrder=1 }
            val res = ReservationEntity.new { start=LocalDateTime.now(); duration=30; this.spot=spot; this.user=user }

            val penalty = PenaltyEntity.new {
                reservation = res; reason = PenaltyReason.WrongSpot; paid = false; fine = 2000; due = LocalDateTime.now().plusDays(5)
            }

            assertTrue(penalty.isActive())
            penalty.paid = true
            assertFalse(penalty.isActive(), "Paid penalty should be inactive")
        }
    }
}