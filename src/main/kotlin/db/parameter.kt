package parkflex.db

import org.jetbrains.exposed.dao.*
import org.jetbrains.exposed.dao.id.*

/**
 * Database table for system configuration parameters.
 * Stores key-value pairs for runtime configuration.
 */
object ParameterTable : LongIdTable("parameter") {
    /** Configuration parameter name/key */
    val key = text("key")
    
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
    
    /** Parameter value */
    var value by ParameterTable.value

    companion object : LongEntityClass<ParameterEntity>(ParameterTable)
}
