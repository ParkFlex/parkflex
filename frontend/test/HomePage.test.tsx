import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { HomePage } from "../src/pages/HomePage";
import { MemoryRouter } from "react-router";

describe("HomePage Component", () => {
    const assignMock = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { assign: assignMock }
        });
    });

    it("should display logo and main title", () => {
        render(
            <MemoryRouter>
                <HomePage />
            </MemoryRouter>
        );

        expect(screen.getByAltText("ParkFlex Logo")).toBeTruthy();
        expect(screen.getByText("ParkFlex")).toBeTruthy();
    });

    it("should display login and register buttons with correct subtexts", () => {
        render(
            <MemoryRouter>
                <HomePage />
            </MemoryRouter>
        );

        expect(screen.getByText("Masz już konto?")).toBeTruthy();
        expect(screen.getByLabelText("Zaloguj się")).toBeTruthy();

        expect(screen.getByText("Nie masz konta?!")).toBeTruthy();
        expect(screen.getByLabelText("Zarejestruj się")).toBeTruthy();
    });

    it("should navigate to /login when login button is clicked", () => {
        render(
            <MemoryRouter>
                <HomePage />
            </MemoryRouter>
        );

        const loginBtn = screen.getByLabelText("Zaloguj się");
        fireEvent.click(loginBtn);

        expect(assignMock).toHaveBeenCalledWith("/login");
    });

    it("should navigate to /register when register button is clicked", () => {
        render(
            <MemoryRouter>
                <HomePage />
            </MemoryRouter>
        );

        const registerBtn = screen.getByLabelText("Zarejestruj się");
        fireEvent.click(registerBtn);

        expect(assignMock).toHaveBeenCalledWith("/register");
    });
});