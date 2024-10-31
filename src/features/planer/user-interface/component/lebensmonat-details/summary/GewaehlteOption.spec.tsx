import { render, screen } from "@testing-library/react";
import { GewaehlteOption } from "./GewaehlteOption";
import {
  KeinElterngeld,
  Variante,
} from "@/features/planer/user-interface/service";

describe("GewaehlteOption", () => {
  it("shows im Mutterschutz with a lock icon", () => {
    render(<GewaehlteOption imMutterschutz />);

    expect(screen.queryByText("Mutterschutz")).toBeVisible();
    expect(screen.queryByTestId("LockIcon")).toBeVisible();
  });

  it("shows hinzufügen with a plus icon if no Option chosen yet", () => {
    render(<GewaehlteOption option={undefined} />);

    expect(screen.getByText("hinzufügen")).toBeVisible();
    expect(screen.queryByTestId("AddIcon")).toBeVisible();
  });

  it.each([
    { option: Variante.Basis, label: "Basis" },
    { option: Variante.Plus, label: "Plus" },
    { option: Variante.Bonus, label: "Bonus" },
    { option: KeinElterngeld, label: "kein Elterngeld" },
  ])("shows $label as label for Option $option", ({ option, label }) => {
    render(<GewaehlteOption option={option} />);

    expect(screen.queryByText(label)).toBeVisible();
  });
});
