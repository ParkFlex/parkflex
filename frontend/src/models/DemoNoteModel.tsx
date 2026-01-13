/**
 * Model reprezentujący notatkę w sekcji demo aplikacji.
 * 
 * @remarks
 * Prosty model danych przechowujący tytuł i zawartość notatki.
 * Używany w komponencie Demo do demonstracji funkcjonalności CRUD.
 * 
 * @example
 * ```typescript
 * const note = new DemoNoteModel(
 *   "Moja notatka",
 *   "To jest zawartość notatki"
 * );
 * ```
 */
export class DemoNoteModel {
    /** Tytuł notatki */
    title: string;
    /** Zawartość/treść notatki */
    contents: string;

    /**
     * Tworzy nową notatkę.
     * 
     * @param title - Tytuł notatki
     * @param contents - Zawartość notatki
     */
    constructor(title: string, contents: string) {
        this.title = title;
        this.contents = contents;
    }
}