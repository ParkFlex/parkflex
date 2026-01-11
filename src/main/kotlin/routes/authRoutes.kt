package parkflex.routes

import io.ktor.http.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import parkflex.db.UserEntity
import parkflex.db.UserTable
import parkflex.models.ApiErrorModel
import parkflex.models.RegisterResponse
import parkflex.models.UserPublicModel
import parkflex.repository.UserRepository
import parkflex.runDB
import parkflex.utils.currentUserEntity

fun Route.whoAmIRoute() {
    get {
        val user = call.currentUserEntity()

        if (user == null) {
            call.respond(HttpStatusCode.NotFound, ApiErrorModel("Nie znaleziono użytkownika", "/api/whoami"))
            return@get
        }

        val userModel =
            UserPublicModel(
                id = user.id.value,
                name = user.fullName,
                email = user.mail,
                role = user.role,
                plate = user.plate,
            )

        call.respond(HttpStatusCode.OK, userModel)
    }
}

fun Route.registerRoute() {
    post {
        val req =
            try {
                call.receive<parkflex.models.RegisterRequest>()
            } catch (e: Exception) {
                call.respond(HttpStatusCode.BadRequest, ApiErrorModel("Niepoprawny JSON", "/api/register"))
                return@post
            }

        val name = req.name
        val email = req.email
        val password = req.password
        val plateRaw = req.plate
        var plate = plateRaw.trim().uppercase()
        // Remove all non-alphanumeric characters
        plate = plate.replace(Regex("[^A-Z0-9]"), "")

        if (name.isBlank() || email.isBlank() || password.isBlank() || plate.isBlank()) {
            call.respond(HttpStatusCode.BadRequest, ApiErrorModel("Niepoprawne dane w request: brakujace pola", "/api/register"))
            return@post
        }

        val plateRegex = Regex("^[A-Z]{1,3}[A-Z0-9]{2,5}$")
        if (!plateRegex.matches(plate)) {
            call.respond(HttpStatusCode.BadRequest, ApiErrorModel("Niepoprawny format tablicy rejestracyjnej", "/api/register"))
            return@post
        }

        val existing =
            runDB {
                UserEntity.find { UserTable.mail eq email }.firstOrNull()
            }

        if (existing != null) {
            call.respond(HttpStatusCode.Conflict, ApiErrorModel("Użytkownik już istnieje", "/api/register"))
            return@post
        }

        runDB {
            UserRepository.unsafeCreateUser(email, name, password, "user", plate)
        }

        val created =
            runDB {
                UserEntity.find { UserTable.mail eq email }.firstOrNull()
            }

        if (created == null) {
            call.respond(
                HttpStatusCode.InternalServerError,
                ApiErrorModel("Wewnętrzny problem ze stworzeniem użytkownika", "/api/register"),
            )
            return@post
        }

        val token = parkflex.repository.JwtRepository.generateToken(created.id.value, created.mail, created.role)

        val userModel =
            UserPublicModel(
                id = created.id.value,
                name = created.fullName,
                email = created.mail,
                role = created.role,
                plate = created.plate,
            )

        call.respond(HttpStatusCode.Created, RegisterResponse(token, userModel))
    }
}
