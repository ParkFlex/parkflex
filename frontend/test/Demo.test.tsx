import {beforeEach, describe, expect, it, vi,} from "vitest"
import {Demo} from "../src/pages/Demo"
import {render, renderHook, screen, waitFor} from "@testing-library/react";
import {useNote} from "../src/hooks/useNote";
import {DemoNoteModel} from "../src/models/DemoNoteModel";
import {act} from "react";


/* * Tests for the Demo page. */
describe("Demo", () => {
    // Create a fake fetch method and replace an original one with it
    const mockedFetch = vi.fn();
    global.fetch = mockedFetch;

    // Clear all mock data before each test
    beforeEach(() =>
        mockedFetch.mockClear()
    )

    // Test no. 1
    it("renders", async () => {
        const result = render(<Demo/>); // Render our Demo page
        const element = result.container; // Get the HTML of our rendered page

        expect(element).toBeTruthy(); // Expect the resulting HTML to not be empty
    })

    // Test no. 2
    it("should have empty input fields at start", async () => {
        render(<Demo/>); // Render our page

        const textBoxes = screen.getAllByRole("textbox") as HTMLInputElement[]; // Get all our text inputs

        // Expect each input's value to be ""
        textBoxes.forEach(textBox =>
            expect(textBox.value).toBe("")
        );
    })

    // Test no. 3
    it("should correctly set note contents from database", async () => {

        // Make our mocked fetch return a fake value
        mockedFetch.mockResolvedValueOnce(
            {
                ok: true,
                json: () => Promise.resolve({
                    title: "Test title",
                    contents: "Test contents"
                })
            }
        );

        // Get our note hook
        const {result} = renderHook(useNote);

        // Doing anything that changes state in tests, should be wrapped inside act()
        act(() => {
            result.current.getNote();
        });

        // Wait for the view to update
        await waitFor(() => {
            // Expect that the fetch was called with a proper URL
            expect(mockedFetch).toBeCalledWith("/api/demo?title=")

            expect(result.current.note.title).toBe("Test title")
            expect(result.current.note.contents).toBe("Test contents")
        })
    })

    // Test no. 4
    it("should correctly save new note contents to the database", async () => {

        // Make our mocked fetch return a fake value
        mockedFetch.mockResolvedValueOnce(
            {
                ok: true,
            }
        );

        const mockedNote = new DemoNoteModel("Test title", "Some test contents");

        // Get our hook
        const hook = renderHook(useNote);
        const noteResult = hook.result.current;

        act(() => {
            noteResult.setNote(mockedNote);
        });

        // Run the save note hook
        hook.result.current.saveNote();

        // Wait for the view to update
        await waitFor(() => {
            const expectedOptions: RequestInit = {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(mockedNote)
            };

            // Expect that the fetch was called with proper data
            expect(mockedFetch).toBeCalledWith(
                "/api/demo",
                expectedOptions
            );
        });
    });
});