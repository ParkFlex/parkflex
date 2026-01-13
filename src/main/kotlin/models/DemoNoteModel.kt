package parkflex.models

import kotlinx.serialization.Serializable

/**
 * Model for demo notes used in example/demo endpoints.
 * @property title Note title
 * @property contents Note contents/body
 */
@Serializable
data class DemoNoteModel(val title: String, val contents: String)