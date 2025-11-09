package parkflex.db

import org.jetbrains.exposed.dao.*
import org.jetbrains.exposed.dao.id.*

object ParameterTable : LongIdTable("parameter") {
    val key = text("key")
    val value = text("value")
}

class ParameterEntity(id: EntityID<Long>) : LongEntity(id) {
    var key by ParameterTable.key
    var value by ParameterTable.value

    companion object : LongEntityClass<ParameterEntity>(ParameterTable)
}
