/**
 * An error that server generated when handling an API request.
 *
 * Example:
 * ```
 * const response = await fetch(...);
 * const object = await response.json();
 * if (!response.ok) {
 *     const error = new ApiErrorModel(object.message, object.context);
 * }
 * ```
 *
 * This class exists because frontend always expects that server will send JSON responses.
 * If we were to send plain text, we would have to account for that in frontend code.
 *
 * @param message error message
 * @param context some info about where the error occurred
 */
export class ApiErrorModel {
    message: string;
    context: string;

    constructor(message: string, context: string) {
        this.message = message;
        this.context = context;
    }
}