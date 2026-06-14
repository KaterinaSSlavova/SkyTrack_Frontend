import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { describe, it, expect, beforeEach, vi } from "vitest";
import Sidebar from "../components/Sidebar";
import { logout } from "../api/authApi";
import { useUser } from "../context/UserContext";

vi.mock("react-router-dom", async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: vi.fn()
}));

vi.mock("../api/authApi", () => ({
  logout: vi.fn()
}));

vi.mock("../context/UserContext", () => ({
  useUser: vi.fn()
}));

describe("Sidebar", () => {
  const setUser = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();

    useUser.mockReturnValue({
      setUser
    });
  });

  it("shows admin links when the user role is ADMIN", () => {
    localStorage.setItem("user", JSON.stringify({ role: "ADMIN" }));

    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    expect(screen.getByText("Airports")).toBeInTheDocument();
    expect(screen.getByText("Flights")).toBeInTheDocument();
  });

  it("shows passenger links when the user role is PASSENGER", () => {
    localStorage.setItem("user", JSON.stringify({ role: "PASSENGER" }));

    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Search Flights")).toBeInTheDocument();
    expect(screen.getByText("Bookings")).toBeInTheDocument();
  });

  it("redirects the user to login page when user clicks log out", async () => {
    localStorage.setItem("user", JSON.stringify({ role: "PASSENGER" }));

    const navigate = vi.fn();
    useNavigate.mockReturnValue(navigate);
    logout.mockResolvedValue();

    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    await user.click(screen.getByText("Log out"));

    expect(logout).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem("user")).toBeNull();
    expect(setUser).toHaveBeenCalledWith(null);
    expect(navigate).toHaveBeenCalledWith("/auth/login");
  });
});