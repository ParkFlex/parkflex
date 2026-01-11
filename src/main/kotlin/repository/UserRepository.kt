package parkflex.repository

import org.mindrot.jbcrypt.BCrypt
import parkflex.db.UserEntity
import parkflex.runDB

object UserRepository {
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

    // TODO: Stricter validation rules may be needed
    fun isPlateValid(plate: String): Boolean {
        val regex = Regex("^[A-Z]{1,3}[0-9]{2,5}$")
        return regex.matches(normalizePlate(plate))
    }
}
