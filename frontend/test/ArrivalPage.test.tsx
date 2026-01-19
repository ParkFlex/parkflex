import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ArrivalPage } from "../src/pages/ArrivalPage";
import { useAxios } from "../src/hooks/useAxios";
import { useQuickReservation } from "../src/hooks/useQuickReservation";
import { usePrelude } from "../src/hooks/usePrelude";
import { MemoryRouter, Route, Routes } from "react-router";

vi.mock("../src/hooks/useAxios");
vi.mock("../src/hooks/useQuickReservation");
vi.mock("../src/hooks/usePrelude");

describe("ArrivalPage", () => {
    const mockPost = vi.fn();
    const mockSendQuickReservation = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useAxios as any).mockReturnValue({ post: mockPost });
        (usePrelude as any).mockReturnValue({
            prelude: { minReservationTime: 15, maxReservationTime: 120 }
        });
        (useQuickReservation as any).mockReturnValue({
            quickReservation: null,
            sendQuickReservation: mockSendQuickReservation
        });
    });

    const renderWithRouter = () => {
        render(
            <MemoryRouter initialEntries={["/arrive/test-token"]}>
                <Routes>
                    <Route path="/arrive/:token" element={<ArrivalPage />} />
                </Routes>
            </MemoryRouter>
        );
    };

    it("should display active reservation when status is Ok", async () => {
        mockPost.mockResolvedValueOnce({
            data: { status: "Ok", spot: "A-101" }
        });

        renderWithRouter();

        await waitFor(() => {
            expect(screen.getByText("Rezerwacja Aktywna")).toBeTruthy();
            expect(screen.getByText("A-101")).toBeTruthy();
        });
    });

    it("should show time selection when status is NoReservation", async () => {
        mockPost.mockResolvedValueOnce({
            data: { status: "NoReservation" }
        });

        renderWithRouter();

        await waitFor(() => {
            expect(screen.getByText(/Brak Aktywnej Rezerwacji/i)).toBeTruthy();
            expect(screen.getByText(/godzinę końcową/i)).toBeTruthy();
        });
    });

    ///

    it("should display error message from API failure", async () => {
        const errorMessage = "Invalid token";
        mockPost.mockRejectedValueOnce({
            isAxiosError: true,
            response: { data: { message: errorMessage } }
        });

        renderWithRouter();

        await waitFor(() => {
            expect(screen.getByText(errorMessage)).toBeTruthy();
        });
    });
});