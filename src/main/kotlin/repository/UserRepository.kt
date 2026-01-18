package parkflex.repository

import org.mindrot.jbcrypt.BCrypt
import parkflex.db.UserEntity
import parkflex.runDB

/**
 * Repository for user account management.
 */
object UserRepository {
    /**
     * Creates a new user account without validation.
     * Password is automatically hashed using BCrypt.
     * 
     * WARNING: This method is marked "unsafe" because it doesn't validate input.
     * Should only be used for admin account creation or in trusted contexts.
     * 
     * TODO: Add input validation (email format, password strength, etc.)
     * 
     * @param mail User's email address
     * @param fullName User's full name
     * @param password Plain text password (will be hashed)
     * @param role User role (e.g., "admin", "user")
     * @param plate License plate number
     */
    fun unsafeCreateUser(
        mail: String,
        fullName: String,
        password: String,
        role: String,
        plate: String,
    ) {
        val hash = BCrypt.hashpw(password, BCrypt.gensalt())

        UserEntity.new {
            this.mail = mail
            this.hash = hash
            this.plate = plate
            this.fullName = fullName
            this.role = role
        }
    }

    fun updatePlate(
        userId: Long,
        plate: String,
    ) {
        val user = UserEntity.findById(userId) ?: return
        user.plate = plate
    }

    fun normalizePlate(plate: String): String = plate.trim().uppercase().replace(Regex("[^A-Z0-9]"), "")

    // Polish registration plate validation
    // Supports 2-letter and 3-letter district codes with multiple resource types
    fun isPlateValid(plate: String): Boolean {
        val normalized = normalizePlate(plate)
        
        // 2-letter district code patterns
        val patterns2Letter = listOf(
            Regex("^[A-Z]{2}\\d{5}$"),           // I: XY12345
            Regex("^[A-Z]{2}\\d{4}[A-Z]$"),     // II: XY1234A
            Regex("^[A-Z]{2}\\d{3}[A-Z]{2}$"),  // III: XY123AC
            Regex("^[A-Z]{2}[1-9][A-Z]\\d{3}$"),  // IV: XY1A234 (first digit 1-9)
            Regex("^[A-Z]{2}[1-9][A-Z]{2}\\d{2}$"), // V: XY1AC23 (first digit 1-9)
        )

        // 3-letter district code patterns
        val patterns3Letter = listOf(
            Regex("^[A-Z]{3}[A-Z]\\d{3}$"),     // I: XYZA123
            Regex("^[A-Z]{3}\\d{2}[A-Z]{2}$"),  // II: XYZ12AC
            Regex("^[A-Z]{3}[1-9][A-Z]\\d{2}$"),  // III: XYZ1A23 (first digit 1-9)
            Regex("^[A-Z]{3}\\d{2}[A-Z][1-9]$"),  // IV: XYZ12A3 (last digit 1-9)
            Regex("^[A-Z]{3}[1-9][A-Z]{2}[1-9]$"), // V: XYZ1AC2 (no digit can be 0)
            Regex("^[A-Z]{3}[A-Z]{2}\\d{2}$"),  // VI: XYZAC12
            Regex("^[A-Z]{3}\\d{5}$"),          // VII: XYZ12345
            Regex("^[A-Z]{3}\\d{4}[A-Z]$"),     // VIII: XYZ1234A
            Regex("^[A-Z]{3}\\d{3}[A-Z]{2}$"),  // IX: XYZ123AC
            Regex("^[A-Z]{3}[A-Z]\\d{2}[A-Z]$"), // X: XYZA12C
            Regex("^[A-Z]{3}[A-Z][1-9][A-Z]{2}$"), // XI: XYZA1CE (digit ≠ 0)
        )

        return (patterns2Letter + patterns3Letter).any { it.matches(normalized) }
    }
}
