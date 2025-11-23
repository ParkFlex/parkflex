package parkflex.models

import java.time.LocalDateTime

data class HistoryEntry(val startTime: LocalDateTime, val durationMin:Int, val spot: Long)

