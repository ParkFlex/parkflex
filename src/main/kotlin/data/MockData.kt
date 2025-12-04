package parkflex.data

import parkflex.db.*
import java.time.LocalDateTime

/**
 * Generates mock data for development and testing purposes.
 * Creates sample users, parking spots, reservations, penalties, and system parameters.
 *
 * This function should be called within a database transaction context.
 */
fun generateMockData() {
    println("Mock data generation is enabled")

    // Create mock users
    val user1 = UserEntity.new {
        login = "john.doe"
        fullName = "John Doe"
        mail = "john.doe@example.com"
        hash = "hashed_password_123"
        plate = "ABC-1234"
        role = "user"
        blocked = false
    }

    val user2 = UserEntity.new {
        login = "jane.smith"
        fullName = "Jane Smith"
        mail = "jane.smith@example.com"
        hash = "hashed_password_456"
        plate = "XYZ-9876"
        role = "user"
        blocked = false
    }

    val admin = UserEntity.new {
        login = "admin"
        fullName = "Admin User"
        mail = "admin@example.com"
        hash = "hashed_password_admin"
        plate = "ADM-0001"
        role = "admin"
        blocked = false
    }

    UserEntity.new {
        login = "blocked.user"
        fullName = "Blocked User"
        mail = "blocked@example.com"
        hash = "hashed_password_blocked"
        plate = "BLK-0000"
        role = "user"
        blocked = true
    }

    // Create mock parking spots
    val spot1 = SpotEntity.new {
        role = "regular"
    }

    val spot2 = SpotEntity.new {
        role = "regular"
    }

    val spot3 = SpotEntity.new {
        role = "admin"
    }

    val spot4 = SpotEntity.new {
        role = "handicapped"
    }

    val spot5 = SpotEntity.new {
        role = "regular"
    }

    // Create mock reservations
    ReservationEntity.new {
        start = LocalDateTime.now().plusHours(1)
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

    val reservation3 = ReservationEntity.new {
        start = LocalDateTime.now().minusDays(1)
        duration = 90
        spot = spot3
        user = admin
    }

    ReservationEntity.new {
        start = LocalDateTime.now().plusDays(1)
        duration = 45
        spot = spot4
        user = user1
    }

    val pastReservation = ReservationEntity.new {
        start = LocalDateTime.now().minusDays(2)
        duration = 60
        spot = spot5
        user = user2
    }

    // Create mock penalties
    PenaltyEntity.new {
        reservation = pastReservation
        reason = "Overstayed parking time by 30 minutes"
        paid = false
        fine = 5000
        due = LocalDateTime.now().plusDays(7)
    }

    PenaltyEntity.new {
        reservation = reservation3
        reason = "Parking violation - wrong spot type"
        paid = true
        fine = 2500
        due = LocalDateTime.now().minusDays(1)
    }

    // Create mock parameters
    ParameterEntity.new {
        key = "max_reservation_duration"
        value = "180"
    }

    ParameterEntity.new {
        key = "default_fine_amount"
        value = "5000"
    }

    ParameterEntity.new {
        key = "parking_fee_per_hour"
        value = "200"
    }

    ParameterEntity.new {
        key = "max_active_reservations_per_user"
        value = "3"
    }

    ParameterEntity.new {
        key = "default_break_between_reservations_duration"
        value = "0" // maybe we want to have some break between reservations?
    }

    println("✅ Mock data generated successfully!")
    println("   - Users: 4 (john.doe, jane.smith, admin, blocked.user)")
    println("   - Spots: 5 (various roles)")
    println("   - Reservations: 5")
    println("   - Penalties: 2")
    println("   - Parameters: 4")
}