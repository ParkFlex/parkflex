package parkflex.models.admin

import kotlinx.serialization.Serializable
import parkflex.db.ParameterType

@Serializable
data class ParameterModel(
    val key: String,
    val type: ParameterType,
    val value: String
)