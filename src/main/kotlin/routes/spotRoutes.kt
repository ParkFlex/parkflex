package parkflex.routes

import io.ktor.http.HttpStatusCode
import io.ktor.server.response.respond
import io.ktor.server.response.respondText
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.put
import parkflex.db.ReservationEntity
import parkflex.db.SpotEntity
import parkflex.db.UserEntity
import parkflex.models.ApiErrorModel
import parkflex.models.SpotModel
import parkflex.models.SpotReservationModel
import parkflex.runDB
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

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
                    val reservationList: List<ReservationEntity> = runDB {
                        //ReservationEntity.all().toList()
                        //jest problem z filtrowaniem w postaci it.spot == spot
                        ReservationEntity.all().filter { it.spot.id.value == spotIDLong }
                    }
                    println(reservationList)

                    val reservationModelList = mutableListOf<SpotReservationModel>()
                    val dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

                    for (reservation in reservationList) {
                        val reservationModel =
                            SpotReservationModel(start = reservation.start.format(dateFormatter), reservation.duration);
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

    put {
        runDB {

            val user1 = UserEntity.new {
                login = "john.doe"
                fullName = "John Doe"
                mail = "john.doe@example.com"
                hash = "hashed_password_123"
                plate = "ABC-1234"
                role = "user"
                blocked = false
            }

            val s1 = SpotEntity.new {
                role = "normal"
            }

            ReservationEntity.new {
                start = LocalDateTime.now().minusMinutes(60)
                duration = 180
                spot = s1
                user = user1
            }

            SpotEntity.new {
                role = "dupa"
            }

            SpotEntity.new {
                role = "ziutek"
            }
        }

        call.respondText("Spoko")


    }
}