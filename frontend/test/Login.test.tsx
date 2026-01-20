import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Login } from "../src/pages/Login";
import { useAuth } from "../src/hooks/useAuth";
import { login } from "../src/api/auth";
import { MemoryRouter, useLocation } from "react-router";

vi.mock("../src/hooks/useAuth");
vi.mock("../src/api/auth");
vi.mock("react-router", async () => {
    const actual = await vi.importActual("react-router");
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});

describe("Login Component", () => {
    const mockSetAuth = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useAuth as any).mockReturnValue({
            login: mockSetAuth,
        });
    });

    it("it should display a login form", () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        expect(screen.getByText("Zaloguj się do konta")).toBeDefined();
        expect(screen.getByPlaceholderText(/email/i) || screen.getByLabelText(/email/i)).toBeDefined();
    });

    it("should call the login function and navigate after successful login", async () => {
        const mockResponse = { token: "fake-token", user: { name: "Test User" } };
        (login as any).mockResolvedValue(mockResponse);

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        const emailInput = screen.getByPlaceholderText(/email/i) || screen.getByRole('textbox', { name: /email/i });
        const passwordInput = screen.getByPlaceholderText(/hasło/i) || screen.getByLabelText(/hasło/i);

        fireEvent.change(emailInput, { target: { value: "test@wp.pl" } });
        fireEvent.change(passwordInput, { target: { value: "password123" } });

        const loginBtn = screen.getByRole("button", { name: /zaloguj/i });
        fireEvent.click(loginBtn);

        await waitFor(() => {
            expect(login).toHaveBeenCalledWith({ email: "test@wp.pl", password: "password123" });
            expect(mockSetAuth).toHaveBeenCalledWith(mockResponse.token, mockResponse.user);
        });
    });

    it("should display an error message on failed login", async () => {
        const errorMessage = "Wystąpił nieoczekiwany błąd";

        (login as any).mockRejectedValue(new Error(errorMessage));

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        const emailInput = screen.getByPlaceholderText("Wpisz swój email");
        const passwordInput = screen.getByPlaceholderText("Wpisz swoje hasło");

        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "poprawneHaslo123" } });

        const loginBtn = screen.getByRole("button", { name: /zaloguj/i });
        fireEvent.click(loginBtn);

        const errorAlert = await screen.findByText(errorMessage);

        expect(errorAlert).toBeDefined();
    });

    it("should pass the 'protected' status to the registration link", () => {
        const protectedRoute = "/dashboard";
        render(
            <MemoryRouter initialEntries={[{ pathname: "/login", state: { protected: protectedRoute } }]}>
                <Login />
            </MemoryRouter>
        );

        const registerLink = screen.getByRole("link", { name: /zarejestruj się/i });
        expect(registerLink.getAttribute("href")).toBe("/register");
    });
});