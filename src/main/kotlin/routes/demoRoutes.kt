package parkflex.routes

import io.ktor.http.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import parkflex.db.*
import parkflex.models.*
import parkflex.*

/**
 * Demo routes for testing and example purposes.
 * Provides basic CRUD operations on demo notes.
 * 
 * Endpoints:
 * - PUT /api/demo - Creates or updates a demo note
 * - GET /api/demo?title={title} - Retrieves a demo note by title
 */
fun Route.demoRoutes() {

    // PUT /api/demo - Save provided note to the database
    put {
        // Get note from the request body
        val noteFromRequest: DemoNoteModel = call.receive<DemoNoteModel>()

        // Is there a note with this title already in the database?
        val noteFromDB: DemoNoteEntity? = runDB {
            DemoNoteEntity
                .all()   // Get all notes from the database
                .find { it.title == noteFromRequest.title } // Find the one that has the matching title
        }

        // Create a new note if there is no note matching this title
        if (noteFromDB == null) {
            runDB {
                DemoNoteEntity.new {
                    title = noteFromRequest.title
                    contents = noteFromRequest.contents
                }
            }

            call.respond(HttpStatusCode.Created)

            // Update the note, if there is one that matches the title
        } else {
            runDB {
                noteFromDB.contents = noteFromRequest.contents
            }

            call.respond(HttpStatusCode.OK)
        }
    }

    // GET /api/demo?title={title} - Retrieve a note from the database by title
    get {

        /* Query parameters are stored in the URL,
         * For example: GET /api/demo?title=test1
         */
        val noteTitle: String? = call.queryParameters["title"] // ?title=...

        if (noteTitle == null) {
            call.respond(
                status = HttpStatusCode.BadRequest,
                message = ApiErrorModel("No title parameter provided", "/api/demo GET handler")
            )
        } else {

            // Get note that has matching title
            val note: DemoNoteEntity? = runDB {
                DemoNoteEntity
                    .all()
                    .find { it.title == noteTitle }
            }

            // Return an error if no note is found
            if (note == null) {
                call.respond(
                    status = HttpStatusCode.NotFound,
                    message = ApiErrorModel("Note not found", "/api/demo GET handler")
                )
            } else {
                // Create note model from the note entity
                val noteModel = DemoNoteModel(note.title, note.contents)

                call.respond(
                    status = HttpStatusCode.OK,
                    message = noteModel
                )
            }
        }
    }
}