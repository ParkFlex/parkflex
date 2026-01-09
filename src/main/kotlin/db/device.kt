package parkflex.db

import org.jetbrains.exposed.dao.*
import org.jetbrains.exposed.dao.id.*

enum class DeviceType {
    EntryGate, ExitGate
}

object DeviceTable : LongIdTable("device") {
    val displayName = text("displayName").uniqueIndex()
    val type = enumeration<DeviceType>("type")
    val uuidHash = text("uuidHash")
}

class DeviceEntity(id: EntityID<Long>) : LongEntity(id) {
    var displayName by DeviceTable.displayName
    var type by DeviceTable.type
    var uuidHash by DeviceTable.uuidHash

    companion object : LongEntityClass<DeviceEntity>(DeviceTable)
}
