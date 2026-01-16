package parkflex.routes.admin

import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import parkflex.db.*
import parkflex.models.*
import parkflex.*

import io.ktor.http.HttpStatusCode
import parkflex.models.admin.ParameterModel
import parkflex.models.admin.ParameterUpdateModel

fun Route.parameterRoutes() {
    suspend fun withParam(call: RoutingCall, body: suspend (ParameterEntity) -> Unit) {
        val key = call.parameters.getAll("key")?.joinToString("/") ?: run {
            call.respond(
                status = HttpStatusCode.BadRequest,
                message = ApiErrorModel("No parameter name provided", "/parameter/{name} handler")
            )
            return
        }

        val param = runDB { ParameterEntity.find { ParameterTable.key eq key }.firstOrNull() } ?: run {
            call.respond(
                status = HttpStatusCode.NotFound,
                message = ApiErrorModel("Specified parameter not found", "/parameter/{name} handler")
            )
            return
        }

        body(param)
    }

    /**
     * Return a list of system parameters.
     */
    get("/all") {
        val params = runDB { ParameterEntity.all().map { ParameterModel(it.key, it.type, it.value) } }
        call.respond(params)
    }

    route("/{key...}") {
        /**
         * Returns a specified parameter.
         */
        get {
            withParam(call) { param ->
                call.respond(
                    status = HttpStatusCode.OK,
                    message = ParameterModel(param.key, param.type, param.value)
                )
            }
        }

        /**
         * Updates the value of the specified parameter.
         */
        patch {
            withParam(call) { param ->
                runCatching { call.receive<ParameterUpdateModel>() }
                    .mapCatching {
                        // type check
                        if (param.type == ParameterType.Number && !it.value.all { char -> char.isDigit() })
                            throw InvalidBodyException("Parameter is numeric but got a string")

                        runDB { param.value = it.value }

                        call.respond(HttpStatusCode.NoContent)
                    }.getOrElse { e ->
                        call.respond(
                            status = HttpStatusCode.BadRequest,
                            message = ApiErrorModel(
                                e.message ?: "no message specified",
                                "PATCH /parameter/{name} handler"
                            )
                        )
                    }
            }

        }
    }

}