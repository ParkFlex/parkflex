package parkflex.models.admin

import kotlinx.serialization.Serializable

@Serializable
data class ParameterUpdateModel(
    val value: String
)