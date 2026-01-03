package db

import io.ktor.server.testing.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.Test
import parkflex.db.*
import java.time.LocalDateTime
import kotlin.test.*

class UserEntityTest {

    @org.junit.jupiter.api.BeforeEach
    fun setup() {
        configDataBase.setupTestDB(UserTable, SpotTable, ReservationTable, PenaltyTable)
    }

    @Test
    fun `test isBlocked returns true when user has active penalty`() = testApplication {
        setup()
        transaction {

            val user = UserEntity.new {
                fullName = "John Doe"; mail = "john@test.com"; hash = "hash"; plate = "WA123"; role = "USER"
            }

            val spot = SpotEntity.new { role = "STANDARD"; displayOrder = 1 }

            val res = ReservationEntity.new {
                start = LocalDateTime.now(); duration = 60; this.spot = spot; this.user = user
            }

            PenaltyEntity.new {
                reservation = res; reason = PenaltyReason.Overtime; paid = false; fine = 5000; due = LocalDateTime.now().plusDays(1)
            }

            assertTrue(user.isBlocked(), "User should be blocked if there is an active penalty")
        }
    }
}