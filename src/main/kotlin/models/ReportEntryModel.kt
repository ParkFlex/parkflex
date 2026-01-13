package parkflex.models

import jdk.jfr.Description
import kotlinx.serialization.Serializable

@Serializable
data class ReportEntryModel (
    val plate : String,
    val description : String?,
    val image : String
    )