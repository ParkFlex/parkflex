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
import parkflex.models.PatchAccountRequest
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
        val plate = UserRepository.normalizePlate(req.plate)
        if (name.isBlank() || email.isBlank() || password.isBlank() || plate.isBlank()) {
            call.respond(HttpStatusCode.BadRequest, ApiErrorModel("Niepoprawne dane w request: brakujace pola", "/api/register"))
            return@post
        }

        if (!UserRepository.isPlateValid(plate)) {
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

fun Route.patchAccountRoute() {
    patch {
        val user = call.currentUserEntity()
        if (user == null) {
            call.respond(HttpStatusCode.NotFound, ApiErrorModel("Nie znaleziono użytkownika", "/api/whoami"))
            return@patch
        }
        val userId = user.id.value

        val req =
            try {
                call.receive<PatchAccountRequest>()
            } catch (e: Exception) {
                call.respond(HttpStatusCode.BadRequest, ApiErrorModel("Niepoprawny JSON", "/api/account"))
                return@patch
            }

        var plate = req.plate
        if (plate != null) {
            plate = UserRepository.normalizePlate(plate)
            if (!UserRepository.isPlateValid(plate)) {
                call.respond(
                    HttpStatusCode.BadRequest,
                    ApiErrorModel("Niepoprawne dane: nieprawidłowy format tablicy rejestracyjnej", "/api/account"),
                )

                return@patch
            }

            runDB {
                UserRepository.updatePlate(userId, plate)
            }
        }

        val updated = runDB { UserEntity.findById(userId) }

        if (updated == null) {
            call.respond(HttpStatusCode.InternalServerError, ApiErrorModel("Użytkownik nie odnaleziony po aktualizacji", "/api/account"))
            return@patch
        }

        val userModel =
            UserPublicModel(
                id = updated.id.value,
                name = updated.fullName,
                email = updated.mail,
                role = updated.role,
                plate = updated.plate
            )

        call.respond(HttpStatusCode.OK, userModel)
    }
}
