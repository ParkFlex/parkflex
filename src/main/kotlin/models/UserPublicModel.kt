package parkflex.models

import kotlinx.serialization.Serializable

// This will be used to send user info from register, login and whoami endpoints
@Serializable
data class UserPublicModel(
    val id: Long,
    val name: String,
    val email: String,
    val role: String,
    val plate: String,
)
