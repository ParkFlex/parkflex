package parkflex.models

import kotlinx.serialization.Serializable

@Serializable
data class UpdatePlateModel(
    val plate: String
)

