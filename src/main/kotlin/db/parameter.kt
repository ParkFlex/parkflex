package parkflex.db

import kotlinx.serialization.Serializable
import org.jetbrains.exposed.dao.*
import org.jetbrains.exposed.dao.id.*

@Serializable
enum class ParameterType {
    Number,String
}

object ParameterTable : LongIdTable("parameter") {
    val key = text("key")
    val type = enumerationByName<ParameterType>("type", length = 6)
    val value = text("value")
}

class ParameterEntity(id: EntityID<Long>) : LongEntity(id) {
    var key by ParameterTable.key
    var type by ParameterTable.type
    var value by ParameterTable.value

    companion object : LongEntityClass<ParameterEntity>(ParameterTable)
}
