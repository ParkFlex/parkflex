package parkflex.config

/**
 * Represents a process of validating a list of key-val properties.
 *
 * @see process
 * @see bracket
 *
 * @param E Error type
 * @param errors Errors collected through the validation
 * @param config Collected config props
 */
data class ConfigValidation<E>(val errors: List<E>, val config: Map<String, String>) {
    /** Accumulate a new error */
    fun report(e: E) = this.copy(errors = errors + e)

    /** Append a new config prop */
    fun append(k: String, v: String): ConfigValidation<E> = this.copy(config = config.plus(k to v))

    /** Have any errors been reported */
    fun hasErrors(): Boolean = this.errors.isNotEmpty()

    /** Is the config empty? */
    fun empty(): Boolean = this.config.isEmpty()

    /**
     * Performs a computation depending on the validator state.
     *
     * @see process
     *
     * @param onSuccess Runs when no errors were reported and the config is not empty
     * @param onEmpty Runs when no errors were reported and the config is empty
     * @param onErrors Runs when some errors were reported
     */
    fun <R> bracket(
        onSuccess: (Map<String, String>) -> R,
        onEmpty: () -> R,
        onErrors: (List<E>, Map<String, String>) -> R
    ): R =
        if (this.empty())
            onEmpty()
        else if (this.hasErrors())
            onErrors(this.errors, this.config)
        else
            onSuccess(this.config)

    companion object {
        fun <E> empty() = ConfigValidation<E>(emptyList(), emptyMap())

        /**
         * Performs a list validation.
         *
         * If an entry's value is `null` then produces an error via `liftError`. Errors are being accumulated.
         *
         * @see bracket
         *
         * @param E Error type
         * @param lst Input list
         * @param liftError Transforms entry's key into `E` when it's value is null
         */
        fun <E> process(lst: List<Pair<String, String?>>, liftError: (String) -> E) =
            lst.fold(empty<E>()) { acc, pair ->
                when (val value = pair.second) {
                    null -> acc.report(liftError(pair.first))
                    else -> acc.append(pair.first, value)
                }
            }

    }
}
