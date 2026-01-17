package parkflex.models.admin

import kotlinx.serialization.Serializable

@Serializable
data class UpdatePlateModel(
    val plate: String
)