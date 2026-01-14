package parkflex.models

import kotlinx.serialization.Serializable

@Serializable
enum class NewPenaltyResponseState {
   Created, Updated, NotChanged
}

@Serializable
data class NewPenaltyResponseModel(val state: NewPenaltyResponseState)

