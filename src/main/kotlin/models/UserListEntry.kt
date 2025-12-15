package parkflex.models

data class UserListEntry(val plate: String, val role: String, val blocked: Boolean, val name: String, val mail: String,
                         val currentPenaltyModel: PenaltyModel?, val numberOfPastReservations : Number?, val numberOfFutureReservations : Number?, val numberOfPastBans :Number?, val currentReservation: Boolean)
