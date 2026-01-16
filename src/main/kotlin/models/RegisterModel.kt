package parkflex.models

import kotlinx.serialization.Serializable

@Serializable data class RegisterRequest(
    val name: String,
    val email: String,
    val password: String,
    val plate: String,
)

@Serializable data class RegisterResponse(
    val token: String,
    val user: UserPublicModel,
)
