import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NewsletterForm from "@/components/NewsletterForm";
import * as newsletterLib from "@/lib/newsletter";

// Mock the subscribeNewsletter function
vi.mock("@/lib/newsletter", () => ({
  subscribeNewsletter: vi.fn(),
}));

describe("components/NewsletterForm", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should render inputs and CTA button in inline variant", () => {
    render(<NewsletterForm variant="inline" source="test" />);

    expect(screen.getByPlaceholderText(/your@email.com/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Subscribe/i })).toBeInTheDocument();
  });

  it("should show inline validation errors for invalid emails", async () => {
    render(<NewsletterForm variant="inline" source="test" />);
    const button = screen.getByRole("button", { name: /Subscribe/i });

    // Submit empty form
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/doesn't look right/i)).toBeInTheDocument();
    });
  });

  it("should show success messages when subscription resolves", async () => {
    vi.mocked(newsletterLib.subscribeNewsletter).mockResolvedValue({
      success: true,
      message: "Check your inbox — confirmation link just landed.",
    });

    render(<NewsletterForm variant="inline" source="test" />);
    const input = screen.getByPlaceholderText(/your@email.com/i);
    const button = screen.getByRole("button", { name: /Subscribe/i });

    await userEvent.type(input, "valid@example.com");
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getAllByText(/check your inbox/i).length).toBeGreaterThan(0);
    });
  });

  it("should handle error return from newsletter API", async () => {
    vi.mocked(newsletterLib.subscribeNewsletter).mockResolvedValue({
      success: false,
      error: "That email is already registered.",
    });

    render(<NewsletterForm variant="inline" source="test" />);
    const input = screen.getByPlaceholderText(/your@email.com/i);
    const button = screen.getByRole("button", { name: /Subscribe/i });

    await userEvent.type(input, "already@example.com");
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/already registered/i)).toBeInTheDocument();
    });
  });
});
