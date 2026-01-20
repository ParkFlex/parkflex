import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { LeavePage } from "../src/pages/LeavePage";
import { useAxios } from "../src/hooks/useAxios";
import { MemoryRouter, Route, Routes } from "react-router";

vi.mock("../src/hooks/useAxios");

describe("LeavePage Component", () => {
    const mockPost = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useAxios as any).mockReturnValue({
            post: mockPost
        });
    });

    const renderWithRouter = (token = "test-token") => {
        return render(
            <MemoryRouter initialEntries={[`/leave/${token}`]}>
                <Routes>
                    <Route path="/leave/:token" element={<LeavePage />} />
                </Routes>
            </MemoryRouter>
        );
    };

    it("should display the penalty information when the API returns the model", async () => {
        const mockLeaveData = {
            late: 15,
            due: "2026-05-20T12:00:00Z",
            fine: 50
        };

        mockPost.mockResolvedValue({ data: mockLeaveData });

        renderWithRouter();

        await waitFor(() => {
            expect(screen.getByText("Nałożono Karę")).toBeDefined();
        });

        expect(screen.getByText(/15/)).toBeDefined(); // Spóźnienie
        expect(screen.getByText(/50/)).toBeDefined(); // Kwota
        expect(screen.getByText(/Aby zapłacić przejdź do zakładki/)).toBeDefined();
    });

    it("should display a goodbye message when the model is null (e.g. no penalty)", async () => {
        mockPost.mockResolvedValue({ data: null });

        renderWithRouter();

        await waitFor(() => {
            expect(screen.getByText("Do zobaczenia następnym razem!")).toBeDefined();
        });
    });

    it("should display an error when the API request fails", async () => {
        const errorMessage = "Nieprawidłowy token";

        mockPost.mockRejectedValue({
            isAxiosError: true,
            response: {
                data: { message: errorMessage }
            }
        });

        renderWithRouter();

        await waitFor(() => {
            expect(screen.getByText(errorMessage)).toBeDefined();
        });
    });

    it("should send a POST request to the correct endpoint with a token", async () => {
        mockPost.mockResolvedValue({ data: null });

        renderWithRouter("super-tajny-token");

        await waitFor(() => {
            expect(mockPost).toHaveBeenCalledWith("/leave/super-tajny-token");
        });
    });
});