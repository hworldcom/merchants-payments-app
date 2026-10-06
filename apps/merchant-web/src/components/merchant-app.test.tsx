import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { MerchantApp } from "./merchant-app";

describe("merchant fixture interface", () => {
  it("shows the dashboard without unsupported currency or card controls", () => {
    render(<MerchantApp />);

    expect(screen.getByRole("heading", { name: "Ready for the next table." })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "New payment" })).toBeInTheDocument();
    expect(screen.getByText("€482.00")).toBeInTheDocument();
    expect(screen.queryByText(/EUR \/ EURC/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/pay by card/i)).not.toBeInTheDocument();
  });

  it("builds a fixture request from an exact euro amount and note", async () => {
    const user = userEvent.setup();
    render(<MerchantApp />);

    await user.click(screen.getByRole("button", { name: "New payment" }));
    const requestButton = screen.getByRole("button", { name: "Request payment" });
    expect(requestButton).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Digit 2" }));
    await user.click(screen.getByRole("button", { name: "Digit 5" }));
    await user.click(screen.getByRole("button", { name: "Decimal point" }));
    await user.click(screen.getByRole("button", { name: "Digit 5" }));
    await user.click(screen.getByRole("button", { name: "Digit 0" }));
    await user.type(screen.getByPlaceholderText("Table 4, lunch, order number…"), "Table 7");
    await user.click(requestButton);

    expect(screen.getByRole("heading", { name: "Scan to pay" })).toBeInTheDocument();
    expect(screen.getByText("€25.50")).toBeInTheDocument();
    expect(screen.getByText("Customer pays 25.50 EURC")).toBeInTheDocument();
    expect(screen.getByText("Table 7")).toBeInTheDocument();
    expect(screen.getByText("No payment or payment intent has been created.")).toBeInTheDocument();
    expect(screen.getByLabelText("Fixture payment request QR code")).toBeInTheDocument();
  });

  it("labels the confirmed state as a fixture rather than verified evidence", async () => {
    const user = userEvent.setup();
    render(<MerchantApp />);

    await user.click(screen.getByRole("button", { name: "New payment" }));
    await user.click(screen.getByRole("button", { name: "Digit 1" }));
    await user.click(screen.getByRole("button", { name: "Request payment" }));
    await user.click(screen.getByRole("button", { name: "Preview confirmed state" }));

    expect(screen.getByRole("heading", { name: "Payment received" })).toBeInTheDocument();
    expect(screen.getByText("This screen does not represent a verified transaction yet.")).toBeInTheDocument();
  });

  it("navigates to activity and settings with labelled states", async () => {
    const user = userEvent.setup();
    render(<MerchantApp />);

    await user.click(screen.getByRole("button", { name: "Payments" }));
    expect(screen.getByRole("heading", { name: "Payments" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Confirmed" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Settings" }));
    expect(screen.getByRole("heading", { name: "Settings" })).toBeInTheDocument();
    expect(screen.getByText("No wallet or backend is connected.")).toBeInTheDocument();
  });
});
