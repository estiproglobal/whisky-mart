import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SEED_PRODUCTS } from "@/lib/catalog/seed";
import { LabelPlate } from "./label-plate";

const bottle = SEED_PRODUCTS.find((p) => p.id === "p_lagavulin16")!;
const accessory = SEED_PRODUCTS.find((p) => p.type === "accessory")!;
const flight = SEED_PRODUCTS.find((p) => p.type === "sample")!;

describe("LabelPlate", () => {
  it("shows the brand and the whisky's data row, formatted (not raw slugs)", () => {
    render(<LabelPlate product={bottle} variant="pdp" />);
    expect(screen.getByText("Lagavulin")).toBeInTheDocument();
    // Region and cask render formatted: "Islay", "Ex-bourbon cask" (not "islay"/"ex-bourbon").
    expect(screen.getByText("Islay")).toBeInTheDocument();
    expect(screen.getByText("Ex-bourbon cask")).toBeInTheDocument();
    expect(screen.queryByText("islay")).not.toBeInTheDocument();
    expect(screen.getByText("43% ABV")).toBeInTheDocument();
    expect(screen.getByText("16 years")).toBeInTheDocument();
  });

  it("degrades to a category row for accessories", () => {
    render(<LabelPlate product={accessory} />);
    expect(screen.getByText(accessory.brand.name)).toBeInTheDocument();
    expect(screen.getByText("Accessory")).toBeInTheDocument();
  });

  it("labels tasting flights as flights", () => {
    render(<LabelPlate product={flight} />);
    expect(screen.getByText("Tasting flight")).toBeInTheDocument();
  });
});
