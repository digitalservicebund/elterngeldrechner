import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Lebensmonatsliste } from "./Lebensmonatsliste";
import {
  Elternteil,
  KeinElterngeld,
  type Lebensmonatszahl,
  Lebensmonatszahlen,
  LetzteLebensmonatszahl,
  Variante,
} from "@/features/planer/domain";

describe("Lebensmonatsliste", () => {
  it("shows a section for Lebensmonate", () => {
    render(<Lebensmonatsliste {...ANY_PROPS} />);

    expect(screen.getByLabelText("Lebensmonate")).toBeVisible();
  });

  it("renders a list of the first 14 Lebensmonate initially", () => {
    render(<Lebensmonatsliste {...ANY_PROPS} />);

    Lebensmonatszahlen.filter(
      (lebensmonatszahl) => lebensmonatszahl <= 14,
    ).forEach(expectLebensmonatToBeVisible);
  });

  it("can toggle visibility of remaining Lebensmonate", async () => {
    render(<Lebensmonatsliste {...ANY_PROPS} />);

    await userEvent.click(
      screen.getByRole("button", { name: "mehr Monate anzeigen" }),
    );

    Lebensmonatszahlen.forEach(expectLebensmonatToBeVisible);

    await userEvent.click(
      screen.getByRole("button", { name: "weniger Monate anzeigen" }),
    );

    Lebensmonatszahlen.filter(
      (lebensmonatszahl) => lebensmonatszahl <= 14,
    ).forEach(expectLebensmonatToBeVisible);

    Lebensmonatszahlen.filter(
      (lebensmonatszahl) => lebensmonatszahl > 14,
    ).forEach(expectLebensmonatNotToBeVisible);
  });

  it("uses the callback to create unplanned Lebensmonate for missing Lebensmonate", () => {
    const plan = { ...ANY_PLAN, lebensmonate: { 1: ANY_LEBENSMONAT } };
    const erstelleUngeplantenLebensmonat = vi
      .fn()
      .mockReturnValue(ANY_LEBENSMONAT);

    render(
      <Lebensmonatsliste
        {...ANY_PROPS}
        plan={plan}
        erstelleUngeplantenLebensmonat={erstelleUngeplantenLebensmonat}
      />,
    );

    expect(erstelleUngeplantenLebensmonat).toHaveBeenCalledTimes(
      LetzteLebensmonatszahl - 1,
    );
    expect(erstelleUngeplantenLebensmonat).not.toHaveBeenCalledWith(1);
    expect(erstelleUngeplantenLebensmonat).toHaveBeenCalledWith(2);
  });

  it("moves the focus to the 15. Lebensmonat when showing more Monate", async () => {
    render(<Lebensmonatsliste {...ANY_PROPS} />);

    const button = screen.getByRole("button", { name: "mehr Monate anzeigen" });
    await userEvent.click(button);

    expect(
      screen
        .getByRole("group", { name: "15. Lebensmonat" })
        .querySelector("summary"),
    ).toHaveFocus();
  });
});

function expectLebensmonatToBeVisible(lebensmonatszahl: Lebensmonatszahl) {
  expect(
    screen.getByRole("group", { name: `${lebensmonatszahl}. Lebensmonat` }),
  ).toBeInTheDocument();
}

function expectLebensmonatNotToBeVisible(lebensmonatszahl: Lebensmonatszahl) {
  expect(
    screen.queryByRole("group", { name: `${lebensmonatszahl}. Lebensmonat` }),
  ).not.toBeVisible();
}

const ANY_LEBENSMONAT = {
  [Elternteil.Eins]: { imMutterschutz: false as const },
};

const ANY_PLAN = {
  ausgangslage: {
    anzahlElternteile: 1 as const,
    geburtsdatumDesKindes: new Date(),
  },
  lebensmonate: {},
};

const ANY_PROPS = {
  plan: ANY_PLAN,
  erstelleUngeplantenLebensmonat: () => ANY_LEBENSMONAT,
  bestimmeAuswahlmoeglichkeiten: () => ({
    [Variante.Basis]: { elterngeldbezug: 0, istAuswaehlbar: true as const },
    [Variante.Plus]: { elterngeldbezug: 0, istAuswaehlbar: true as const },
    [Variante.Bonus]: { elterngeldbezug: 0, istAuswaehlbar: true as const },
    [KeinElterngeld]: { elterngeldbezug: null, istAuswaehlbar: true as const },
  }),
  waehleOption: () => {},
  erstelleVorschlaegeFuerAngabeDesEinkommens: () => [],
  gebeEinkommenAn: () => {},
};
