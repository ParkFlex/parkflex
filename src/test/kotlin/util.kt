import parkflex.db.UserEntity
import parkflex.repository.JwtRepository

fun dummyToken(uid: Long) =
    JwtRepository.generateToken(uid, "dummy@parkflex.pl", "user")

val adminToken = JwtRepository.generateToken(1, "admin", "admin")

fun newAdmmin() = UserEntity.new(1) {
    this.fullName = "Admin Adminowski"
    this.mail = "admin"
    this.plate = ""
    this.role = "admin"
    this.hash = ""
}

