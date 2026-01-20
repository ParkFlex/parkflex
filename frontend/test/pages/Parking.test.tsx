import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { ParkingPage } from "../../src/pages/Parking";
import { expect, test, vi, describe } from "vitest";
import * as usePreludeModule from "../../src/hooks/usePrelude";
import { PenaltyReason } from "../../src/models/PenaltyReason";

// 1. Mockowanie hooków z użyciem pełnych ścieżek do src
vi.mock("../../src/hooks/usePrelude", () => ({
    usePrelude: vi.fn(() => ({
        prelude: { 
            penaltyInformation: null, 
            minReservationTime: null, 
            maxReservationTime: null 
        },
        getPrelude: vi.fn(),
    })),
}));

vi.mock("../../src/hooks/useGetSpots", () => ({
    useGetSpots: () => vi.fn(),
}));

vi.mock("../../src/hooks/usePostReservation", () => ({
    usePostReservation: () => ({
        reserve: vi.fn(),
    }),
}));

vi.mock("../../src/hooks/useAxios", () => ({
    useAxios: () => ({
        post: vi.fn().mockResolvedValue({}),
        get: vi.fn().mockResolvedValue({ data: {} }),
    }),
}));

// Mockowanie PrimeReact (aby uniknąć problemów z renderowaniem w JSDOM)
vi.mock("primereact/toast", () => ({
    Toast: () => <div data-testid="toast-mock" />,
}));

describe("ParkingPage", () => {
    
    test("should render date selector and parking grid by default", () => {
        render(
            <MemoryRouter>
                <ParkingPage />
            </MemoryRouter>
        );

        // Szukamy tekstu "Miejsce:", który jest w Toolbarze
        expect(screen.getByText(/Miejsce:/i)).toBeDefined();
        // Szukamy tekstu "brak", który jest domyślnym stanem selectedId
        expect(screen.getByText(/brak/i)).toBeDefined();
    });

    test("should have the submit button disabled when no spot is selected", () => {
        render(
            <MemoryRouter>
                <ParkingPage />
            </MemoryRouter>
        );

        const submitButton = screen.getByRole("button", { name: /Zatwierdź/i });
        expect(submitButton.hasAttribute("disabled")).toBe(true);
    });

    test("should show banned error view when user has penalty information", () => {
        // Podmieniamy zachowanie mocka dla tego konkretnego przypadku
        vi.mocked(usePreludeModule.usePrelude).mockReturnValue({
            prelude: {
                penaltyInformation: {
                    due: new Date("2026-12-31"),
                    reason: "Overtime",
                    fine: 50
                },
                minReservationTime: 10,
                maxReservationTime: 12
            },
            getPrelude: vi.fn(),
        });

        render(
            <MemoryRouter>
                <ParkingPage />
            </MemoryRouter>
        );

        // Jeśli użytkownik jest zablokowany, przycisk "Zatwierdź" nie powinien się wyrenderować
        const submitButton = screen.queryByRole("button", { name: /Zatwierdź/i });
        expect(submitButton).toBeNull();
    });
});