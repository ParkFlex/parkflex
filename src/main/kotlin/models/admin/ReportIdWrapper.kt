package parkflex.models.admin

import kotlinx.serialization.Serializable

@Serializable
data class ReportIdWrapper(
    val reportId: Long
)