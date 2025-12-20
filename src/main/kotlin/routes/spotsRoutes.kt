package parkflex.routes

import io.ktor.http.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import parkflex.db.ReservationEntity
import parkflex.db.SpotEntity
import parkflex.models.ApiErrorModel
import parkflex.models.SpotAvailability
import parkflex.models.SpotsModel
import parkflex.runDB
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter.ISO_LOCAL_DATE_TIME
import java.time.format.DateTimeParseException

fun Route.spotsRoutes() {
    get {
        val context = "/api/spots"

        val start: String? = call.request.queryParameters["start"]
        val end: String? = call.request.queryParameters["end"]

        if (start == null || end == null) {
            call.respond(
                status = HttpStatusCode.BadRequest,
                message = ApiErrorModel("incorrect start or end date", context)
            )
        } else {
            try {
                val startDate = LocalDateTime.parse(start, ISO_LOCAL_DATE_TIME)
                val endDate = LocalDateTime.parse(end, ISO_LOCAL_DATE_TIME)

                if (endDate <= startDate) {
                    call.respond(
                        status = HttpStatusCode.BadRequest,
                        message = ApiErrorModel("incorrect end date", context)
                    )
                    return@get
                }

                val spotList: List<SpotEntity> = runDB {

                    SpotEntity.all().filter { true }
                }

                val spotModelList = mutableListOf<SpotAvailability>()

                for (spot in spotList) {

                    var reservationCount: Int = 0;
                    reservationCount = runDB {

                        ReservationEntity.all().count() {
                            val reservationEndDate = it.start.plusMinutes(it.duration.toLong())
                            val isTheSame = it.spot.id.value == spot.id.value
                            val coversStart = it.start >= startDate && it.start <= endDate
                            val coversWhole = it.start <= startDate && reservationEndDate >= endDate
                            val coversEnd = reservationEndDate >= startDate && reservationEndDate <= endDate

                            isTheSame && (coversStart || coversWhole || coversEnd)
                        }
                    }


                    val spotAvailability = SpotAvailability(spot.id.value, spot.role, reservationCount > 0);

                    spotModelList.add(spotAvailability)
                }

                val spotsModel = SpotsModel(spotModelList)

                call.respond(
                    message = spotsModel,
                    status = HttpStatusCode.OK
                )

            } catch (e: DateTimeParseException) {
                call.respond(
                    status = HttpStatusCode.BadRequest,
                    message = ApiErrorModel("incorrect format of start or end date", context)
                )
            }

        }
    }
}