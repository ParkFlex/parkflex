package parkflex.routes.reservation

import io.ktor.http.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import parkflex.db.ReservationEntity
import parkflex.db.SpotEntity
import parkflex.models.ApiErrorModel
import parkflex.models.reservation.SpotModel
import parkflex.models.reservation.SpotReservationModel
import parkflex.runDB
import java.time.format.DateTimeFormatter

/**
 * Routes for retrieving single parking spot information.
 * 
 * Endpoint: GET /api/spot?spot_id={spot_id}
 * Retrieves detailed information about a specific parking spot,
 * including all its reservations.
 */
fun Route.spotRoutes() {
    get {
        val context = "/api/spot"

        val spotID: String? = call.request.queryParameters["spot_id"]

        if (spotID == null) {
            call.respond(
                status = HttpStatusCode.BadRequest,
                message = ApiErrorModel("Nie podano spot_id !!", context)
            )

        } else {
            try {
                val spotIDLong = spotID.toLong()

                val spot: SpotEntity? = runDB {
                    SpotEntity.findById(spotIDLong)
                }

                if (spot == null) {
                    call.respond(
                        status = HttpStatusCode.NotFound,
                        message = ApiErrorModel("Nie ma spotu o id ${spotID}", context)
                    )
                } else {
                    // TODO: This filtering approach is inefficient - should use database query instead
                    val reservationList: List<ReservationEntity> = runDB {
                        //jest problem z filtrowaniem w postaci it.spot == spot
                        ReservationEntity.all().filter { it.spot.id.value == spotIDLong }
                    }

                    val reservationModelList = mutableListOf<SpotReservationModel>()
                    val dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

                    for (reservation in reservationList) {
                        val reservationModel =
                            SpotReservationModel(start = reservation.start.format(dateFormatter), reservation.duration)
                        reservationModelList.add(reservationModel)
                    }

                    val spotModel = SpotModel(spot.id.value, spot.role, reservationModelList)

                    call.respond(
                        message = spotModel,
                        status = HttpStatusCode.OK
                    )
                }
            } catch (e: NumberFormatException) {
                call.respond(
                    status = HttpStatusCode.BadRequest,
                    message = ApiErrorModel("spot_id musi być prawilną liczbą naturalną", context)
                )
            }
        }
    }
}