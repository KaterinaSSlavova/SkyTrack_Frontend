import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import AirportForm from "../components/AirportForm";

describe("AirportForm", () => {
  it("renders empty form by default", () => {
    render(<AirportForm onSubmit={vi.fn()} />);

    expect(screen.getByPlaceholderText("Iata Code")).toHaveValue("");
    expect(screen.getByPlaceholderText("Airport Name")).toHaveValue("");
    expect(screen.getByPlaceholderText("City")).toHaveValue("");
    expect(screen.getByPlaceholderText("Country")).toHaveValue("");
    expect(screen.getByRole("combobox")).toHaveValue("");
    expect(screen.getByRole("button", { name: "Save Airport" })).toBeInTheDocument();
  });

  it("renders initial data when provided", () => {
    const initialData = {
      iataCode: "AMS",
      name: "Schiphol Airport",
      city: "Amsterdam",
      country: "Netherlands",
      timezone: "Europe/Amsterdam"
    };

    render(<AirportForm onSubmit={vi.fn()} initialData={initialData} />);

    expect(screen.getByPlaceholderText("Iata Code")).toHaveValue("AMS");
    expect(screen.getByPlaceholderText("Airport Name")).toHaveValue("Schiphol Airport");
    expect(screen.getByPlaceholderText("City")).toHaveValue("Amsterdam");
    expect(screen.getByPlaceholderText("Country")).toHaveValue("Netherlands");
    expect(screen.getByRole("combobox")).toHaveValue("Europe/Amsterdam");
  });

  it("updates input values when user types", async () => {
    const user = userEvent.setup();

    render(<AirportForm onSubmit={vi.fn()} />);

    await user.type(screen.getByPlaceholderText("Iata Code"), "SOF");
    await user.type(screen.getByPlaceholderText("Airport Name"), "Sofia Airport");
    await user.type(screen.getByPlaceholderText("City"), "Sofia");
    await user.type(screen.getByPlaceholderText("Country"), "Bulgaria");
    await user.selectOptions(screen.getByRole("combobox"), "Europe/Athens");

    expect(screen.getByPlaceholderText("Iata Code")).toHaveValue("SOF");
    expect(screen.getByPlaceholderText("Airport Name")).toHaveValue("Sofia Airport");
    expect(screen.getByPlaceholderText("City")).toHaveValue("Sofia");
    expect(screen.getByPlaceholderText("Country")).toHaveValue("Bulgaria");
    expect(screen.getByRole("combobox")).toHaveValue("Europe/Athens");
  });

  it("calls onSubmit with the entered airport data", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<AirportForm onSubmit={onSubmit} />);

    await user.type(screen.getByPlaceholderText("Iata Code"), "AMS");
    await user.type(screen.getByPlaceholderText("Airport Name"), "Schiphol Airport");
    await user.type(screen.getByPlaceholderText("City"), "Amsterdam");
    await user.type(screen.getByPlaceholderText("Country"), "Netherlands");
    await user.selectOptions(screen.getByRole("combobox"), "Europe/Amsterdam");

    await user.click(screen.getByRole("button", { name: "Save Airport" }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      iataCode: "AMS",
      name: "Schiphol Airport",
      city: "Amsterdam",
      country: "Netherlands",
      timezone: "Europe/Amsterdam"
    });
  });

  it("shows general error and field errors", () => {
    render(
      <AirportForm
        onSubmit={vi.fn()}
        generalError="Something went wrong"
        fieldErrors={{
          iataCode: "IATA code is required",
          name: "Name is required",
          city: "City is required",
          country: "Country is required",
          timezone: "Timezone is required"
        }}
      />
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("IATA code is required")).toBeInTheDocument();
    expect(screen.getByText("Name is required")).toBeInTheDocument();
    expect(screen.getByText("City is required")).toBeInTheDocument();
    expect(screen.getByText("Country is required")).toBeInTheDocument();
    expect(screen.getByText("Timezone is required")).toBeInTheDocument();
  });

  it("calls clearFieldError when a field changes", async () => {
    const user = userEvent.setup();
    const clearFieldError = vi.fn();

    render(
      <AirportForm
        onSubmit={vi.fn()}
        clearFieldError={clearFieldError}
      />
    );

    await user.type(screen.getByPlaceholderText("City"), "Paris");

    expect(clearFieldError).toHaveBeenCalledWith("city");
  });

  it("renders custom submit label", () => {
    render(<AirportForm onSubmit={vi.fn()} submitLabel="Update Airport" />);

    expect(screen.getByRole("button", { name: "Update Airport" })).toBeInTheDocument();
  });

  it("shows cancel button when showCancel is true and calls onCancel", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(
      <AirportForm
        onSubmit={vi.fn()}
        showCancel={true}
        onCancel={onCancel}
      />
    );

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("does not show cancel button by default", () => {
    render(<AirportForm onSubmit={vi.fn()} />);

    expect(screen.queryByRole("button", { name: "Cancel" })).not.toBeInTheDocument();
  });
});