package parkflex.db

import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import java.time.LocalDateTime
import kotlin.test.*

class PenaltyEntityTest {

    private lateinit var db: Database

    @BeforeEach
    fun setup() {
        db = configDataBase.setupTestDB()
    }

    @Test
    fun `test penalty activity status`() {
        transaction(db) {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable, PenaltyTable)

            val user = UserEntity.new {
                fullName = "A"; mail = "b@b.com"; hash = "h"; plate = "P"; role = "U"
            }
            val spot = SpotEntity.new {
                role = "S"; displayOrder = 1
            }
            val res = ReservationEntity.new {
                start = LocalDateTime.now(); duration = 30; this.spot = spot; this.user = user
            }

            val penalty = PenaltyEntity.new {
                reservation = res
                reason = PenaltyReason.WrongSpot
                paid = false
                fine = 2000
                due = LocalDateTime.now().plusDays(5)
            }

            assertTrue(penalty.isActive(), "New unpaid penalty should be active")

            penalty.paid = true
            assertFalse(penalty.isActive(), "Paid penalty should be inactive")
        }
    }
}