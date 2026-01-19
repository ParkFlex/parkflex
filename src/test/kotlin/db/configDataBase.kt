package parkflex.db

import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.transactions.transaction
import java.util.UUID

object configDataBase {

    /**
     * Configures an in-memory H2 database for testing.
     * This ensures tests are fast, isolated, and don't affect production data.
     */

    fun setupTestDB(vararg tables: Table): Database {
        // Unique name of the database to avoid the conflict
        val name = UUID.randomUUID()

        val db = Database.connect(
            "jdbc:h2:mem:$name;DB_CLOSE_DELAY=-1;",
            driver = "org.h2.Driver"
        )

        transaction {
            SchemaUtils.create(*tables)
        }

        return db
    }
}