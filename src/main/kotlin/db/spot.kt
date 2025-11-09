package parkflex.db

import org.jetbrains.exposed.dao.*
import org.jetbrains.exposed.dao.id.*

object SpotTable : LongIdTable("spot") {
    val role = text("role")
}

class SpotEntity(id: EntityID<Long>) : LongEntity(id) {
    var role by SpotTable.role
    companion object : LongEntityClass<SpotEntity>(SpotTable)
}
