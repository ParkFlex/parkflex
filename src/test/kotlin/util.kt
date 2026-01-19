import io.ktor.client.HttpClient
import io.ktor.client.plugins.sse.sse
import kotlinx.coroutines.flow.first
import parkflex.db.UserEntity
import parkflex.repository.JwtRepository

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

suspend fun HttpClient.firstSSE(path: String): String? {
    var token: String? = null
    sse("/term/exit") {
        incoming.first().data?.let { token = it }
    }

    return token
}
