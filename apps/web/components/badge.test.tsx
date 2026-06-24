import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./badge";

describe("Badge", () => {
  it("renders a known badge label", () => {
    render(<Badge kind="bestseller" />);
    expect(screen.getByText("Best seller")).toBeInTheDocument();
  });

  it("falls back to the raw kind for unknown badges", () => {
    render(<Badge kind="custom" />);
    expect(screen.getByText("custom")).toBeInTheDocument();
  });
});
