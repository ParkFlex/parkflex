package parkflex.db

import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import java.time.LocalDateTime
import kotlin.test.assertTrue

class UserEntityTest {

    private lateinit var db: Database

    @BeforeEach
    fun setup() {
        db = configDataBase.setupTestDB()
    }

    @Test
    fun `test isBlocked returns true when user has active penalty`() {
        transaction(db) {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, PenaltyTable)

            val user = UserEntity.new {
                fullName = "John Doe"
                mail = "john@test.com"
                hash = "hash"
                plate = "WA123"
                role = "USER"
            }

            val spot = SpotEntity.new {
                role = "STANDARD"
                displayOrder = 1
            }

            val res = ReservationEntity.new {
                start = LocalDateTime.now()
                duration = 60
                this.spot = spot
                this.user = user
            }

            PenaltyEntity.new {
                reservation = res
                reason = PenaltyReason.Overtime
                paid = false
                fine = 5000
                due = LocalDateTime.now().plusDays(1)
            }

            assertTrue(user.isBlocked(), "User should be blocked if there is an active penalty")
        }
    }
}