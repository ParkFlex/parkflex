package parkflex.models

import kotlinx.serialization.Serializable

@Serializable
data class PatchAccountRequest(
    val plate: String?,
)
