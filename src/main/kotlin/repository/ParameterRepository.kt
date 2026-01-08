package parkflex.repository

import parkflex.db.ParameterEntity
import parkflex.db.ParameterTable

object ParameterRepository {
    fun get(key: String): ParameterEntity? =
        ParameterEntity.find { ParameterTable.key  eq key}.singleOrNull()
}