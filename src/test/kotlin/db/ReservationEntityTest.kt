package parkflex.db

import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import java.time.LocalDateTime
import kotlin.test.assertTrue

class ReservationEntityTest {

    private lateinit var db: Database

    @BeforeEach
    fun setup() {

        db = configDataBase.setupTestDB()
    }

    @Test
    fun `test time collision logic`() {
        transaction(db) {
            SchemaUtils.create(UserTable, SpotTable, ReservationTable)

            val user = UserEntity.new {
                fullName = "A"; mail = "a@a.com"; hash = "h"; plate = "P"; role = "U"
            }
            val spot = SpotEntity.new {
                role = "S"; displayOrder = 1
            }

            // Istniejąca rezerwacja: 10:00 - 11:00
            val existingRes = ReservationEntity.new {
                start = LocalDateTime.of(2025, 1, 1, 10, 0)
                duration = 60
                this.spot = spot
                this.user = user
            }

            val overlaps = existingRes.timeCollidesWith(10,
                LocalDateTime.of(2025, 1, 1, 11, 5),
                LocalDateTime.of(2025, 1, 1, 12, 0)
            )

            assertTrue(overlaps, "Should collide because 11:05 is within 10 mins break after 11:00")
        }
    }
}