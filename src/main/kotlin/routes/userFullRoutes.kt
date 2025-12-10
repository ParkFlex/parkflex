package parkflex.routes

import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import parkflex.db.UserEntity
import parkflex.models.UserListEntry

fun Route.userFullRoutes() {
    get{

    val userList: List<UserListEntry> = listOf()
        for(entry in UserEntity.all()) {

        }

    }

}