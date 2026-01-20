import io.ktor.client.HttpClient
import io.ktor.client.plugins.sse.sse
import kotlinx.coroutines.flow.first
import parkflex.db.UserEntity
import parkflex.repository.JwtRepository
import java.util.UUID

fun dummyToken(uid: Long) =
    JwtRepository.generateToken(uid, "dummy@parkflex.pl", "user")

fun adminToken() = JwtRepository.generateToken(1, "admin", "admin")

fun newAdmmin() = UserEntity.new(1) {
    this.fullName = "Admin Adminowski"
    this.mail = "admin"
    this.plate = ""
    this.role = "admin"
    this.hash = ""
}

fun newUser() = UserEntity.new {
    this.fullName = "user"
    this.mail = "user" + UUID.randomUUID().toString()
    this.plate = ""
    this.role = "user"
    this.hash = ""
}

suspend fun HttpClient.firstSSE(path: String): String? {
    var token: String? = null
    sse(path) {
        incoming.first().data?.let { token = it }
    }

    return token
}
