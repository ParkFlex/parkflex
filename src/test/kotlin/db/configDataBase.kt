package db

import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.transactions.transaction

object configDataBase {

    /**
     * Configures an in-memory H2 database for testing.
     * This ensures tests are fast, isolated, and don't affect production data.
     */

    fun setupTestDB(vararg tables: Table) {
        // Unique name of the database to avoid the conflict
        Database.connect(
            "jdbc:h2:mem:unitTests;DB_CLOSE_DELAY=-1;",
            driver = "org.h2.Driver"
        )

        transaction {
            SchemaUtils.create(*tables)
        }
    }
}