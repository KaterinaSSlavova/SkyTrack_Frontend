import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { vi } from "vitest";
import Sidebar from "../components/Sidebar";
import { it, expect, beforeEach } from "vitest";

beforeEach(() => {
    localStorage.clear();
});

vi.mock("react-router-dom", async (importOriginal) => ({
    ...await importOriginal(),
    useNavigate: vi.fn()
    }))

it("shows admin links when the user role is ADMIN", () => {
    // Arrange
    localStorage.setItem("user", JSON.stringify({ role: "ADMIN" }));

    // Act
    render(<MemoryRouter><Sidebar /></MemoryRouter>);

    // Assert
    expect(screen.getByText("Airports")).toBeInTheDocument();
    expect(screen.getByText("Flights")).toBeInTheDocument();
    });

it("shows passenger links when the user role is PASSENGER", () => {
    //Arrange
    localStorage.setItem("user", JSON.stringify({role: "PASSENGER"}));

    //Act
    render(<MemoryRouter><Sidebar /></MemoryRouter>);

    //Assert
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Search Flights")).toBeInTheDocument();
    expect(screen.getByText("Bookings")).toBeInTheDocument();
    });

it("redirects the user to login page when user clicks log out", async() => {
    //Arrange
     localStorage.setItem("token", "token");
     localStorage.setItem("user", JSON.stringify({role: "PASSENGER"}));

     const navigate = vi.fn();
     useNavigate.mockReturnValue(navigate);

     const user = userEvent.setup();
     render(<MemoryRouter><Sidebar /></MemoryRouter>);

    //Act
    await user.click(screen.getByText("Log out"));

    //Assert
    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
    expect(navigate).toHaveBeenCalledWith("/auth/login");
    });