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
    ): UserEntity {
        val hash = BCrypt.hashpw(password, BCrypt.gensalt())

        return UserEntity.new {
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

    // TODO: Stricter validation rules may be needed
    fun isPlateValid(plate: String): Boolean {
        val regex = Regex("^[A-Z]{1,3}[0-9]{2,5}$")
        return true
    }
}
