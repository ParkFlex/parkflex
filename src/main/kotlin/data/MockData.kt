package parkflex.data

import parkflex.db.*
import java.time.LocalDateTime
import kotlin.io.encoding.Base64

/**
 * Generates mock data for development and testing purposes.
 * Creates sample users, parking spots, reservations, penalties, and system parameters.
 *
 * This function should be called within a database transaction context.
 */
fun generateMockData() {
    val logger = org.slf4j.LoggerFactory.getLogger("MockData")

    val placeholderImg = (object {})::class.java.getResource("/placeholder.jpeg")?.let { url ->
        val header = "data:image/jpeg;base64,"
        val encoded = Base64.encode(url.readBytes())
        header + encoded
    } ?: throw Exception("placeholder.jpeg not found")

    // Create mock users
    val user1 = UserEntity.new {
        fullName = "John Doe"
        mail = "john.doe@example.com"
        hash = "hashed_password_123"
        plate = "ABC-1234"
        role = "user"
    }

    val user2 = UserEntity.new {
        fullName = "Jane Smith"
        mail = "jane.smith@example.com"
        hash = "hashed_password_456"
        plate = "XYZ-9876"
        role = "user"
    }

    UserEntity.new {
        fullName = "Blocked User"
        mail = "blocked@example.com"
        hash = "hashed_password_blocked"
        plate = "BLK-0000"
        role = "user"
    }

    // Create mock parking spots
    val spot1 = SpotEntity.findById(1)!!

    val spot2 = SpotEntity.findById(2)!!

    val spot3 = SpotEntity.findById(3)!!

    val spot4 = SpotEntity.findById(4)!!

    val spot5 = SpotEntity.findById(5)!!

    // Create mock reservations
    ReservationEntity.new {
        start = LocalDateTime.now().minusDays(7)
        duration = 60
        spot = spot1
        user = user1
    }

    ReservationEntity.new {
        start = LocalDateTime.now().plusHours(3)
        duration = 120
        spot = spot2
        user = user2
    }

    ReservationEntity.new {
        start = LocalDateTime.now().minusHours(1)
        duration = 120
        spot = spot1
        user = user3
    }

    ReservationEntity.new {
        start = LocalDateTime.now().minusHours(2)
        duration = 240
        spot = spot3
        user = user3
    }

    val reservation3 = ReservationEntity.new {
        start = LocalDateTime.now().minusDays(1)
        duration = 90
        spot = spot3
        user = user1
    }

    val reservation4 = ReservationEntity.new {
        start = LocalDateTime.now().minusDays(5)
        duration = 120
        spot = spot1
        user = user1
    }


    val pastReservation = ReservationEntity.new {
        start = LocalDateTime.now().minusDays(2)
        duration = 60
        spot = spot5
        user = user1
    }

    val pastReservation2 = ReservationEntity.new {
        start = LocalDateTime.parse("2026-01-09T08:00")
        duration = 600
        spot = spot1
        user = user2
    }

    val pastReservation3 = ReservationEntity.new {
        start = LocalDateTime.parse("2026-01-08T08:00")
        duration = 600
        spot = spot1
        user = user2
    }

    val pastReservation4 = ReservationEntity.new {
        start = LocalDateTime.parse("2026-01-07T08:00")
        duration = 600
        spot = spot1
        user = user2
    }

    val pastReservation5 = ReservationEntity.new {
        start = LocalDateTime.parse("2026-01-06T08:00")
        duration = 600
        spot = spot1
        user = user2
    }

    // Create mock penalties
    PenaltyEntity.new {
        reservation = pastReservation
        reason = PenaltyReason.Overtime
        paid = false
        fine = 5000
        due = LocalDateTime.now().plusDays(7)
    }

    val penalty1 = PenaltyEntity.new {
        reservation = reservation3
        reason = PenaltyReason.WrongSpot
        paid = true
        fine = 2500
        due = LocalDateTime.now().minusDays(1)
    }

    PenaltyEntity.new {
        reservation = reservation4
        reason = PenaltyReason.WrongSpot
        paid = false
        fine = 2500
        due = LocalDateTime.parse("2025-12-19T08:00").plusDays(5)
    }

    // Not reviewed yer
    ReportEntity.new {
        penalty = null
        description = "My spot was taken when I arrived"
        submitter = user1
        timestamp = LocalDateTime.parse("2025-12-19T08:43")
        image = placeholderImg
        reviewed = false
        plate = user2.plate
    }

    // Reviewed, penalty assigned
    ReportEntity.new {
        penalty = penalty1
        description = "I couldn't park as my spot was blocked by some other car"
        submitter = user2
        timestamp = LocalDateTime.parse("2025-12-16T08:20")
        image = placeholderImg
        reviewed = true
        plate = user1.plate
    }

    // Reviewed, penalty not assigned
    ReportEntity.new {
        penalty = null
        description = ":("
        submitter = user1
        timestamp = LocalDateTime.parse("2025-12-18T08:17")
        image = placeholderImg
        reviewed = true
        plate = user2.plate
    }

    // Should be WrongSpot
    ReportEntity.new {
        penalty = null
        description = "should be wrongspot"
        submitter = user1
        timestamp = LocalDateTime.parse("2026-01-09T12:00")
        image = placeholderImg
        reviewed = false
        plate = user2.plate
    }

    // Should be Overtime
    ReportEntity.new {
        penalty = null
        description = "should be overtime"
        submitter = user1
        timestamp = LocalDateTime.parse("2026-01-07T22:00")
        image = placeholderImg
        reviewed = false
        plate = user2.plate
    }

    logger.info("✅ Mock data generated successfully!")
    logger.info("   - Users: 3 (john.doe, jane.smith, blocked.user)")
    logger.info("   - Spots: 5 (various roles)")
    logger.info("   - Reservations: 5")
    logger.info("   - Penalties: 2")
    logger.info("   - Parameters: 5")
}