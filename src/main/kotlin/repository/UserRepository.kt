package parkflex.repository

import org.mindrot.jbcrypt.BCrypt
import parkflex.db.UserEntity
import parkflex.runDB

object UserRepository {
    fun unsafeCreateUser(mail: String, fullName: String, password: String, role: String, plate: String) {
        val hash = BCrypt.hashpw(password, BCrypt.gensalt())

        UserEntity.new {
            this.mail = mail
            this.hash = hash
            this.plate = plate
            this.fullName = fullName
            this.role = role
        }
    }
}