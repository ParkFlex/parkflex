package parkflex.repository

import org.mindrot.jbcrypt.BCrypt
import parkflex.db.DeviceEntity
import parkflex.db.DeviceTable
import parkflex.db.DeviceType
import java.util.UUID

/**
 * Repository for managing parking system devices (gates, barriers, etc.).
 */
object DeviceRepository {
    /**
     * Registers a new device in the system.
     * Generates a unique UUID for the device and stores its hashed version.
     * 
     * @param name Human-readable device name
     * @param type Type of device (entry or exit gate)
     * @return UUID that should be stored on the physical device for authentication
     */
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

    /**
     * Verifies if a device UUID is valid for the given device name.
     * Used for device authentication.
     * 
     * @param name Device name
     * @param uuid UUID to verify
     * @return true if UUID is valid for this device, false otherwise
     */
    fun checkUUID(name: String, uuid: String): Boolean {
        val dev =
            DeviceEntity
                .find { DeviceTable.displayName eq name }
                .singleOrNull() ?: return false

        return BCrypt.checkpw(uuid, dev.uuidHash)
    }
}