package parkflex.routes

import io.ktor.http.HttpStatusCode
import io.ktor.server.response.respond
import io.ktor.server.response.respondText
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.put
import parkflex.db.ReservationEntity
import parkflex.db.SpotEntity
import parkflex.models.SpotModel
import parkflex.runDB

fun Route.spotRoutes() {
    get {

        // /api/spot?spot_id=dupa
        val spotID: String? = call.request.queryParameters["spot_id"]

        if (spotID == null) {
            call.respondText("Nie podano spot_id")
        } else {
            val spotIDLong = spotID.toLong()

            val znaleziony: SpotEntity? = runDB {
                SpotEntity.findById(spotIDLong)
            }

            //val spotPierwszy = SpotModel(spotIDLong, "normal")

            if (znaleziony == null) {
                call.respondText("Nie ma spotu o id ${spotID}")
            } else {
                val rezerwacje: List<ReservationEntity> = runDB {
                    ReservationEntity.all().filter { it.spot == znaleziony }
                }

                println(rezerwacje)

                val model = SpotModel(znaleziony.id.value, znaleziony.role)

                call.respond(
                    message = model,
                    status = HttpStatusCode.OK
                )
            }
        }
    }

    put {
        runDB {
            SpotEntity.new {
                role = "normal"
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