package parkflex.models

import kotlinx.serialization.Serializable
import parkflex.db.ParameterType

@Serializable
data class ParameterUpdateModel(
    val value: String
)
