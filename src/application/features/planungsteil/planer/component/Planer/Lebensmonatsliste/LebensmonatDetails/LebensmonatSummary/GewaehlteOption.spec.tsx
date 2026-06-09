import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GewaehlteOption } from "./GewaehlteOption";
import { KeinElterngeld, Variante } from "@/monatsplaner";

describe("GewaehlteOption", () => {
  it("shows im Mutterschutz with a lock icon", () => {
    render(<GewaehlteOption {...ANY_PROPS} imMutterschutz />);

    expect(screen.getByTestId("LockIcon")).toBeVisible();
  });

  it("shows hinzufügen with a plus icon if no Option chosen yet", () => {
    render(<GewaehlteOption {...ANY_PROPS} option={undefined} />);

    expect(screen.getByText("hinzufügen")).toBeInTheDocument();
    expect(screen.getByTestId("AddCircleOutlineIcon")).toBeVisible();
  });

  it.each([
    { option: Variante.Basis, label: "Basis" },
    { option: Variante.Plus, label: "Plus" },
    { option: Variante.Bonus, label: "Bonus" },
    { option: KeinElterngeld, label: "kein Elterngeld" },
  ])("shows $label as label for Option $option", ({ option, label }) => {
    render(<GewaehlteOption {...ANY_PROPS} option={option} />);

    expect(screen.queryByText(label)).toBeVisible();
  });
});

const ANY_PROPS = {
  bruttoeinkommenIsMissing: false,
};
