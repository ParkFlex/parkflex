package parkflex.repository

import parkflex.db.SpotEntity

/**
 * Repository for managing parking spots and layout.
 */
object SpotRepository {
    /**
     * Direction indicators for parking layout arrows.
     */
    private enum class ArrowDirection {
        UP, DOWN, LEFT, RIGHT, RD, UR, LU, DL
    }

    /**
     * ADT representing type of spot during layout parsing.
     */
    private sealed interface LayoutToken : Comparable<LayoutToken> {
        object Gate : LayoutToken
        object Empty : LayoutToken
        data class Numbered(val x: Long) : LayoutToken
        data class Special(val x: Long) : LayoutToken
        data class Arrow(val direction: ArrowDirection) : LayoutToken

        override fun compareTo(other: LayoutToken): Int {
            val getWeight = { token: LayoutToken ->
                when (token) {
                    Empty -> Int.MAX_VALUE
                    Gate -> Int.MAX_VALUE
                    is Arrow -> Int.MAX_VALUE
                    is Numbered -> token.x.toInt() // bite me
                    is Special -> token.x.toInt() // bite me
                }
            }

            return getWeight(this) - getWeight(other);
        }
    }

    /**
     * Populates the spots table according to the provided ASCII layout.
     * 
     * Layout format:
     * - G: Gate
     * - .: Empty/blank spot
     * - Number: Parking spot with that ID
     * - Arrows (^, v, <, >, RD, UR, LU, DL): Directional indicators
     * 
     * Example:
     * ```
     * G   1   2   3
     * v   .   .   .
     * 4   5   6   7
     * ```
     * 
     * @param layout ASCII art representation of the parking layout
     * @return Result indicating success or failure
     */
    fun populate(layout: String): Result<Unit> = runCatching {
        layout
            .split("\n")
            .flatMap { it.split("""[ \t]+""".toRegex()) }
            .map {
                when (it) {
                    "G" -> LayoutToken.Gate
                    "." -> LayoutToken.Empty
                    "RD" -> LayoutToken.Arrow(ArrowDirection.RD)
                    "UR" -> LayoutToken.Arrow(ArrowDirection.UR)
                    "LU" -> LayoutToken.Arrow(ArrowDirection.LU)
                    "DL" -> LayoutToken.Arrow(ArrowDirection.DL)
                    "^" -> LayoutToken.Arrow(ArrowDirection.UP)
                    "v" -> LayoutToken.Arrow(ArrowDirection.DOWN)
                    "<" -> LayoutToken.Arrow(ArrowDirection.LEFT)
                    ">" -> LayoutToken.Arrow(ArrowDirection.RIGHT)
                    else ->
                        if (it.firstOrNull() == '!')
                            LayoutToken.Special(it.drop(1).toLong())
                        else
                            LayoutToken.Numbered(it.toLong())
                }
            }
            .withIndex()
            .sortedBy { it.value }
            .fold(0L) { lastId, token ->
                val entity = when (token.value) {
                    LayoutToken.Gate -> SpotEntity.new(lastId + 1) {
                        role = "gate"
                        displayOrder = token.index
                    }

                    LayoutToken.Empty -> SpotEntity.new(lastId + 1) {
                        role = "blank"
                        displayOrder = token.index
                    }

                    is LayoutToken.Arrow -> SpotEntity.new(lastId + 1) {
                        role = "arrow-" + (token.value as LayoutToken.Arrow).direction.toString()
                        displayOrder = token.index
                    }

                    is LayoutToken.Numbered -> SpotEntity.new((token.value as LayoutToken.Numbered).x) {
                        role = "normal"
                        displayOrder = token.index
                    }

                    is LayoutToken.Special -> SpotEntity.new((token.value as LayoutToken.Special).x) {
                        role = "special"
                        displayOrder = token.index
                    }
                }

                entity.id.value
            }
    }
}