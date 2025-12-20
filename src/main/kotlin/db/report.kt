package parkflex.db

import org.jetbrains.exposed.dao.*
import org.jetbrains.exposed.dao.id.*
import org.jetbrains.exposed.sql.javatime.datetime


object ReportTable : LongIdTable("report") {
    val penalty = reference("penalty", PenaltyTable.id).nullable()
    val submitter = reference("submitter", UserTable.id)
    val timestamp = datetime("timestamp")
    val image = text("image")
    val description = text("description")
    val reviewed = bool("reviewed")
}

class ReportEntity(id: EntityID<Long>) : LongEntity(id) {
    /** Penalty resulting from this report */
    var penalty by PenaltyEntity optionalReferencedOn  ReportTable.penalty

    /** User who submitted the report */
    var submitter by UserEntity referencedOn ReportTable.submitter

    /** When was the report submitted? */
    var timestamp by ReportTable.timestamp

    /** Base64 encoded form of an image attached to the report */
    var image by ReportTable.image

    /** Description provided by the submitter */
    var description by ReportTable.description

    /** Was the report reviewed by an admin */
    var reviewed by ReportTable.reviewed

    companion object : LongEntityClass<ReportEntity>(ReportTable)
}