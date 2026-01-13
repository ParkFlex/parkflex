package parkflex.repository

import org.mindrot.jbcrypt.BCrypt
import parkflex.db.DeviceEntity
import parkflex.db.DeviceTable
import parkflex.db.DeviceType
import java.util.UUID

object DeviceRepository {
    fun register(name: String, type: DeviceType): UUID {
        val uuid = UUID.randomUUID()
        val hash = BCrypt.hashpw(uuid.toString(), BCrypt.gensalt())

        DeviceEntity.new {
            this.displayName = name
            this.uuidHash = hash
            this.type = type
        }

        return uuid
    }

    fun checkUUID(name: String, uuid: String): Boolean {
        val dev =
            DeviceEntity
                .find { DeviceTable.displayName eq name }
                .singleOrNull() ?: return false

        return BCrypt.checkpw(uuid, dev.uuidHash)
    }
}