package parkflex.models

import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable
import java.time.LocalDateTime

/**
 * Information about the penalty that has been applied on leave.
 */
@Serializable
data class LeaveModel(
    /** The amount the user can pay to cancel the penalty */
    val fine: Long,

    /** When does the penalty end? */
    @Contextual
    val due: LocalDateTime,

    /** How late has the user left? (in minutes) */
    val late: Long
)