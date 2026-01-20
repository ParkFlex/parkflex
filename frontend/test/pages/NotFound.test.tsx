import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router"; // lub 'react-router-dom' zależnie od wersji
import { NotFound } from "../../src/pages/NotFound";
import { expect, test } from "vitest"; // lub '@jest/globals'

test("should display 'Not found' message", () => {
    render(
        <MemoryRouter>
            <NotFound />
        </MemoryRouter>
    );

    const message = screen.getByText(/not found/i);
    expect(message).toBeDefined();
});

test("should contain a link to the parking view", () => {
    render(
        <MemoryRouter>
            <NotFound />
        </MemoryRouter>
    );

    const link = screen.getByRole("link", { name: /parking view/i });
    
    // Sprawdzamy, czy atrybut 'href' jest poprawny
    expect(link.getAttribute("href")).toBe("/parking");
});