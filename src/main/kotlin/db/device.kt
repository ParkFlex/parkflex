package parkflex.db

import org.jetbrains.exposed.dao.*
import org.jetbrains.exposed.dao.id.*

/**
 * Type of physical device in the parking system.
 */
enum class DeviceType {
    /** Entry gate device for parking entrance */
    EntryGate,
    
    /** Exit gate device for parking exit */
    ExitGate
}

/**
 * Database table for registered parking system devices (gates, barriers, etc.).
 * Each device has a unique identifier and type designation.
 */
object DeviceTable : LongIdTable("device") {
    /** Human-readable device name for identification */
    val displayName = text("displayName").uniqueIndex()
    
    /** Type of device (entry or exit gate) */
    val type = enumeration<DeviceType>("type")
    
    /** Hashed UUID for device authentication */
    val uuidHash = text("uuidHash")
}

/**
 * Entity representing a physical device in the parking system.
 */
class DeviceEntity(id: EntityID<Long>) : LongEntity(id) {
    /** Device display name */
    var displayName by DeviceTable.displayName
    
    /** Device type */
    var type by DeviceTable.type
    
    /** Hashed device UUID */
    var uuidHash by DeviceTable.uuidHash

    companion object : LongEntityClass<DeviceEntity>(DeviceTable)
}
