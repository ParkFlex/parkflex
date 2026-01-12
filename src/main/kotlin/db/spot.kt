package parkflex.db

import org.jetbrains.exposed.dao.*
import org.jetbrains.exposed.dao.id.*

/**
 * Database table for parking spots.
 * Each spot has a role designation and display order for UI purposes.
 */
object SpotTable : LongIdTable("spot") {
    /** Role/type of the parking spot (e.g., "standard", "disabled", "electric") */
    val role = text("role")
    
    /** Order in which the spot should be displayed in the UI */
    val displayOrder = integer("displayOrder")
}

/**
 * Entity representing a parking spot in the system.
 */
class SpotEntity(id: EntityID<Long>) : LongEntity(id) {
    /** Role/type of this parking spot */
    var role by SpotTable.role
    
    /** Display order for UI purposes */
    var displayOrder by SpotTable.displayOrder
    
    companion object : LongEntityClass<SpotEntity>(SpotTable)
}
