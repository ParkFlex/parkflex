package parkflex.routes

import io.ktor.http.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import parkflex.db.ParameterEntity
import parkflex.db.ParameterTable
import parkflex.db.ReservationEntity
import parkflex.db.ReservationTable
import parkflex.db.SpotEntity
import parkflex.models.ApiErrorModel
import parkflex.models.SpotAvailability
import parkflex.models.SpotsModel
import parkflex.runDB
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter.ISO_LOCAL_DATE_TIME
import java.time.format.DateTimeParseException

/**
 * Routes for querying multiple parking spots availability.
 * 
 * Endpoint: GET /api/spots?start={start}&end={end}
 * Retrieves availability status of all parking spots for a given time range.
 * Checks which spots have conflicting reservations in the specified period.
 */
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

                val spotList: List<SpotEntity> = runDB { SpotEntity.all().toList() }
                val spotModelList = mutableListOf<SpotAvailability>()

                for (spot in spotList) {

                    val breakDurationMinutes: Long = runDB {
                        val param = ParameterEntity.find {
                            ParameterTable.key eq "reservation/break/duration"
                        }.firstOrNull()

                        param?.value?.toLongOrNull() ?: 0L
                    }

                    val doesCollide: Boolean = runDB {
                        ReservationEntity
                            .find { ReservationTable.spot eq  spot.id.value }
                            .any { it.timeCollidesWith(breakDurationMinutes, startDate, endDate) }
                    }

                    val spotAvailability = SpotAvailability(
                        spot.id.value,
                        spot.role,
                        spot.displayOrder,
                        doesCollide
                    )

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