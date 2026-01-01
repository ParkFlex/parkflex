package parkflex.repository

import parkflex.db.SpotEntity

object SpotRepository {
    /**
     * ADT representing type of spot during layout parsing.
     */
    private sealed interface LayoutToken : Comparable<LayoutToken> {
        object Gate : LayoutToken
        object Empty : LayoutToken
        data class Numbered(val x: Long) : LayoutToken

        override fun compareTo(other: LayoutToken): Int {
            val getWeight = { token: LayoutToken ->
                when (token) {
                    Empty -> Int.MAX_VALUE
                    Gate -> Int.MAX_VALUE
                    is Numbered -> token.x.toInt() // bite me
                }
            }

            return getWeight(this) - getWeight(other);
        }
    }

    /**
     * Populates the `spots` table according to the provided layout.
     */
    fun populate(layout: String): Result<Unit> = runCatching {
        layout
            .split("\n")
            .flatMap { it.split("""[ \t]+""".toRegex()) }
            .map {
                when (it) {
                    "G" -> LayoutToken.Gate
                    "." -> LayoutToken.Empty
                    else -> LayoutToken.Numbered(it.toLong())
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

                    is LayoutToken.Numbered -> SpotEntity.new((token.value as LayoutToken.Numbered).x) {
                        role = "normal"
                        displayOrder = token.index
                    }
                }

                entity.id.value
            }
    }
}