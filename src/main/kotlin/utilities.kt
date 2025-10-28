package parkflex

import kotlinx.coroutines.Dispatchers
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction

/**
 * Runs the provided database transaction.
 *
 * All operations on database entities have to be run inside the `runDB` block.
 *
 * Example
 * ```
 * val user: UserEntity? = runDB {
 *    UserEntity.findById(1)
 * }
 * ```
 */
suspend fun <T> runDB(block: Transaction.() -> T): T =
    newSuspendedTransaction(Dispatchers.IO, statement = block)