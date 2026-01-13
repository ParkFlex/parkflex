package parkflex.repository

import parkflex.db.ParameterEntity
import parkflex.db.ParameterTable

/**
 * Repository for accessing system configuration parameters.
 */
object ParameterRepository {
    /**
     * Retrieves a configuration parameter value by key.
     * 
     * @param key Parameter key
     * @return Parameter value, or null if key doesn't exist
     */
    fun get(key: String): String? =
        ParameterEntity.find { ParameterTable.key  eq key}.singleOrNull()?.value
}