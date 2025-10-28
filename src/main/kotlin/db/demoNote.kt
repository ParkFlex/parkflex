package parkflex.db

import org.jetbrains.exposed.dao.*
import org.jetbrains.exposed.dao.id.*
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction
import parkflex.models.DemoNoteModel

/**
 * Database table holding for demo.
 *
 * This table extends [LongIdTable], that means, it has an additional `id` field
 * that's unique and auto-generated.
 *
 * @property title note title
 * @property contents note contents
 */
object DemoNoteTable : LongIdTable("demoNote") {
    /* Here we define our SQL table columns. Our table will have two cells:
     * - title: SQL type varchar, unique
     * - contents: SQL type varchar
     */
    val title = varchar("title", 128).uniqueIndex()
    val contents = varchar("contents", 1024)
}

/**
 * Entity for [DemoNoteTable].
 *
 * Entity represents a singular row rom an SQL table.
 */
class DemoNoteEntity(id: EntityID<Long>) : LongEntity(id) {
    var title by DemoNoteTable.title
    var contents by DemoNoteTable.contents

    /**
     * Entity object for [DemoNoteTable].
     *
     * Companion objects are a replacement for static fields from other languages.
     * This companion object does not define any fields by itself, but it extends
     * a [LongEntityClass] class, so it inherits all fields from it.
     *
     *
     * Examples:
     * - Creating a new entry in the table
     * ```
     *  val note = runDB {
     *      DemoNoteEntity.new {
     *          title = "test note",
     *          contents = "some note contents"
     *      }
     *  }
     *
     *  println("Created note '{note.title}', id: {note.id}")
     * ```
     *
     * - Selecting some records from the table
     *
     * ```
     *  val notes: List<DemoNoteEntity> = runDB {
     *      // Find all notes that have a word "piesek" in their contents.
     *      DemoNoteEntity.find {
     *          DemoNoteTable.contents like "*piesek*"
     *      }.toList()
     *  }
     *
     *  for (note in notes) {
     *      println("title: {note.title}, contents: {note.contents}")
     *  }
     * ```
     */
    companion object : LongEntityClass<DemoNoteEntity>(DemoNoteTable)
}