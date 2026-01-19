import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Account } from "../src/pages/Account";
import { useAuth } from "../src/hooks/useAuth";
import { patchAccount } from "../src/api/auth";
import { MemoryRouter } from "react-router";

vi.mock("../src/hooks/useAuth");
vi.mock("../src/api/auth");

describe("Account Component", () => {
    const mockLogout = vi.fn();
    const mockSetUser = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should display login prompt when user is not authenticated", () => {
        (useAuth as any).mockReturnValue({
            isAuthenticated: false,
            user: null,
            token: null,
            logout: mockLogout,
        });

        render(
            <MemoryRouter>
                <Account />
            </MemoryRouter>
        );

        expect(screen.getByText("Nie jesteś zalogowany.")).toBeTruthy();
        expect(screen.getByLabelText("Zaloguj się")).toBeTruthy();
    });

    it("should correctly display authenticated user data", () => {
        const mockUser = {
            name: "John Doe",
            email: "john@example.com",
            role: "user",
            plate: "XYZ123"
        };

        (useAuth as any).mockReturnValue({
            isAuthenticated: true,
            user: mockUser,
            token: "mock-jwt-token",
            logout: mockLogout,
        });

        render(
            <MemoryRouter>
                <Account />
            </MemoryRouter>
        );

        expect(screen.getByText("John Doe")).toBeTruthy();
        expect(screen.getByText("john@example.com")).toBeTruthy();
        expect(screen.getByText("XYZ123")).toBeTruthy();
        expect(screen.getByText("user")).toBeTruthy();
    });

    it("should allow editing the license plate and call patchAccount", async () => {
        const mockUser = { name: "John", email: "john@example.com", plate: "OLD123" };
        (useAuth as any).mockReturnValue({
            isAuthenticated: true,
            user: mockUser,
            token: "token",
            setUser: mockSetUser,
        });

        (patchAccount as any).mockResolvedValue({ ...mockUser, plate: "NEW789" });

        render(
            <MemoryRouter>
                <Account />
            </MemoryRouter>
        );

        const editBtn = screen.getByLabelText("Edytuj tablicę");
        fireEvent.click(editBtn);

        const input = screen.getByRole("textbox");
        fireEvent.change(input, { target: { value: "NEW789" } });

        const saveBtn = screen.getByLabelText("Zapisz tablicę");
        fireEvent.click(saveBtn);

        await waitFor(() => {
            expect(patchAccount).toHaveBeenCalledWith({ plate: "NEW789" });
            expect(mockSetUser).toHaveBeenCalled();
        });
    });

    it("should copy token to clipboard when copy button is clicked", async () => {
        const writeTextMock = vi.fn().mockResolvedValue(undefined);
        Object.assign(navigator, {
            clipboard: { writeText: writeTextMock }
        });

        (useAuth as any).mockReturnValue({
            isAuthenticated: true,
            user: { name: "John" },
            token: "secret-token-123",
        });

        render(
            <MemoryRouter>
                <Account />
            </MemoryRouter>
        );

        const copyBtn = screen.getByLabelText("Kopiuj token");
        fireEvent.click(copyBtn);

        expect(writeTextMock).toHaveBeenCalledWith("secret-token-123");
    });
});