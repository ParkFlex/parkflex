package parkflex.models.report

import kotlinx.serialization.Serializable

@Serializable
data class ReportEntryModel (
    val plate : String,
    val description : String?,
    val image : String
    )