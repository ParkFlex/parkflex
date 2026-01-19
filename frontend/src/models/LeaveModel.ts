/**
 * Information about the penalty that has been applied on leave.
 */
export interface LeaveModel {
    /** The amount the user can pay to cancel the penalty */
    fine: number,

    /** When does the penalty end? */
    due: string,

    /** How late has the user left? (in minutes) */
    late: number
}