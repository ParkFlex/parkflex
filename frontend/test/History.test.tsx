import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { History } from "../src/pages/History";
import { useHistoryEntries } from "../src/hooks/useHistoryEntries";
import { MemoryRouter } from "react-router";
import type { HistoryEntry } from "../src/models/history/HistoryEntry.tsx";
import { addLocale, locale } from "primereact/api";

vi.mock("../src/hooks/useHistoryEntries", () => ({
    useHistoryEntries: vi.fn()
}));

describe("History Component", () => {
    const mockEntries: HistoryEntry[] = [
        {
            startTime: new Date("2026-01-20T10:00:00"),
            durationMin: 60,
            status: "Past",
            spot: 1
        }
    ];

    beforeEach(() => {
        vi.clearAllMocks();

        addLocale('pl', {
            firstDayOfWeek: 1,
            dayNames: ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'],
            dayNamesShort: ['nie', 'pon', 'wt', 'śr', 'czw', 'pt', 'sob'],
            dayNamesMin: ['N', 'P', 'W', 'Ś', 'C', 'P', 'S'],
            monthNames: ['styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec', 'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień'],
            monthNamesShort: ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'],
            today: 'Dzisiaj',
            clear: 'Wyczyść'
        });
        locale('pl');
    });

    it("should display empty state message when list is empty", async () => {
        const pastEntry = {
            startTime: "2000-01-01T10:00:00Z",
            durationMin: 60,
            status: "Confirmed",
            spot: 1
        };

        vi.mocked(useHistoryEntries).mockReturnValue({
            entries: [pastEntry] as any,
        });

        render(
            <MemoryRouter>
                <History />
            </MemoryRouter>
        );

        const message = await screen.findByText(/Brak rezerwacji/i);
        expect(message).toBeTruthy();
    });

    it("should open date filter dialog when calendar button is clicked", async () => {
        vi.mocked(useHistoryEntries).mockReturnValue({
            entries: mockEntries,
        });

        render(
            <MemoryRouter>
                <History />
            </MemoryRouter>
        );

        const filterBtn = screen.getByRole("button", { name: /Filtruj daty/i });
        fireEvent.click(filterBtn);

        await waitFor(() => {
            expect(screen.getByRole("dialog")).toBeDefined();
        });
    });
});