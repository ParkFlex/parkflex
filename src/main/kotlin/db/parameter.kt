package parkflex.db

import kotlinx.serialization.Serializable
import org.jetbrains.exposed.dao.*
import org.jetbrains.exposed.dao.id.*

@Serializable
enum class ParameterType {
    Number, String
}

/**
 * Database table for system configuration parameters.
 * Stores key-value pairs for runtime configuration.
 */
object ParameterTable : LongIdTable("parameter") {
    /** Configuration parameter name/key */
    val key = text("key")

    /** Configuration parameter type */
    val type = enumerationByName<ParameterType>("type", length = 6)

    /** Configuration parameter value */
    val value = text("value")
}

/**
 * Entity representing a system configuration parameter.
 * Used for storing application settings that can be modified at runtime.
 */
class ParameterEntity(id: EntityID<Long>) : LongEntity(id) {
    /** Parameter key */
    var key by ParameterTable.key

    /** Parameter type */
    var type by ParameterTable.type

    /** Parameter value */
    var value by ParameterTable.value

    companion object : LongEntityClass<ParameterEntity>(ParameterTable)
}
