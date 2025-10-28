package parkflex.models

import kotlinx.serialization.Serializable

@Serializable
data class DemoNoteModel(val title: String, val contents: String)