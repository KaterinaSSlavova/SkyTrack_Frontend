import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { describe, it, expect, beforeEach, vi } from "vitest";
import RegisterForm from "../components/RegistrationForm";
import { register } from "../api/authApi";

vi.mock("react-router-dom", async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: vi.fn()
}));

vi.mock("../api/authApi", () => ({
  register: vi.fn()
}));

vi.mock("../api/supabaseClient", () => ({
  supabase: {
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn().mockResolvedValue({ error: null }),
        getPublicUrl: vi.fn(() => ({
          data: {
            publicUrl: "https://example.com/avatar.png"
          }
        }))
      }))
    }
  }
}));

describe("RegisterForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    HTMLInputElement.prototype.showPicker = vi.fn();
  });

  it("renders the registration form", () => {
    render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>
    );

    expect(screen.getByText("Profile Picture")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter first name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter last name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Register" })).toBeInTheDocument();
  });

  it("registers user and navigates to login page", async () => {
    const user = userEvent.setup();
    const navigate = vi.fn();

    useNavigate.mockReturnValue(navigate);
    register.mockResolvedValue({});

    render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText("Enter first name"), "Katerina");
    await user.type(screen.getByPlaceholderText("Enter last name"), "Slavova");
    await user.type(screen.getByPlaceholderText("Enter email"), "katerina@test.com");
    await user.type(screen.getByPlaceholderText("Enter password"), "Password123!");

    const birthDateInput = document.querySelector('input[name="birthDate"]');
    expect(birthDateInput).toBeInTheDocument();
    await user.type(birthDateInput, "2000-01-01");

    await user.click(screen.getByRole("button", { name: "Register" }));

    expect(register).toHaveBeenCalledWith({
      picture: "",
      firstName: "Katerina",
      lastName: "Slavova",
      birthDate: "2000-01-01",
      email: "katerina@test.com",
      password: "Password123!"
    });

    expect(navigate).toHaveBeenCalledWith("/auth/login");
  });

  it("uploads profile picture and sends picture url during registration", async () => {
    const user = userEvent.setup();
    const navigate = vi.fn();

    useNavigate.mockReturnValue(navigate);
    register.mockResolvedValue({});

    render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>
    );

    const file = new File(["avatar"], "avatar.png", {
      type: "image/png"
    });

    const fileInput = document.querySelector("#avatarUpload");
    expect(fileInput).toBeInTheDocument();

    await user.upload(fileInput, file);

    expect(await screen.findByAltText("Profile")).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText("Enter first name"), "Katerina");
    await user.type(screen.getByPlaceholderText("Enter last name"), "Slavova");
    await user.type(screen.getByPlaceholderText("Enter email"), "katerina@test.com");
    await user.type(screen.getByPlaceholderText("Enter password"), "Password123!");

    const birthDateInput = document.querySelector('input[name="birthDate"]');
    expect(birthDateInput).toBeInTheDocument();
    await user.type(birthDateInput, "2000-01-01");

    await user.click(screen.getByRole("button", { name: "Register" }));

    expect(register).toHaveBeenCalledWith({
      picture: "https://example.com/avatar.png",
      firstName: "Katerina",
      lastName: "Slavova",
      birthDate: "2000-01-01",
      email: "katerina@test.com",
      password: "Password123!"
    });

    expect(navigate).toHaveBeenCalledWith("/auth/login");
  });
});