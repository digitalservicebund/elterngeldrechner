import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AuswahloptionLabel } from "./AuswahloptionLabel";
import { Variante } from "@/monatsplaner";

describe("Auswahloption Label", () => {
  it.each([
    { option: Variante.Basis, text: "Basis" },
    { option: Variante.Plus, text: "Plus" },
  ])("shows $text for option $option", ({ option, text }) => {
    render(<AuswahloptionLabel {...ANY_PROPS} option={option} />);

    expect(screen.getByText(text, { exact: false })).toBeVisible();
  });

  it("adapts appearance for Basis Option in a Monat mit Mutterschutz", () => {
    render(
      <AuswahloptionLabel
        {...ANY_PROPS}
        option={Variante.Basis}
        istBasisImMutterschutz
      />,
    );

    expect(screen.getByText("Mutterschutz")).toBeVisible();
    expect(screen.queryByTestId("LockIcon")).toBeVisible();
    expect(screen.queryByText("Basis")).toBeVisible();
  });

  it("shows formatted Elterngeldbezug when given", () => {
    render(<AuswahloptionLabel {...ANY_PROPS} elterngeldbezug={100} />);

    expect(screen.getByText("100 €"));
  });
});

const ANY_PROPS = {
  option: Variante.Basis,
  istBasisImMutterschutz: false,
  istBonusWithMissingBruttoeinkommen: false,
  elterngeldbezug: 0,
  htmlFor: "",
};
