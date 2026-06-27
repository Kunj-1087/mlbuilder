import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AlternatingTitle from "@/components/errors/AlternatingTitle";

describe("components/errors/AlternatingTitle", () => {
  it("should render color segments inside requested heading tag", () => {
    const segments = [
      { text: "HELLO", color: "black" as const },
      { text: "WORLD", color: "orange" as const },
    ];

    render(<AlternatingTitle segments={segments} tag="h2" className="my-class" />);

    // Renders h2 tag
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass("my-class");

    // Match segments
    const blackSpan = screen.getByText("HELLO");
    const orangeSpan = screen.getByText("WORLD");

    expect(blackSpan).toBeInTheDocument();
    expect(blackSpan).toHaveClass("text-ink");

    expect(orangeSpan).toBeInTheDocument();
    expect(orangeSpan).toHaveClass("text-accent");
  });
});
