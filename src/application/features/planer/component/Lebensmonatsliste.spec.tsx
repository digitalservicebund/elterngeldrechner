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
  type PlanMitBeliebigenElternteilen,
  Variante,
} from "@/monatsplaner";

describe("Lebensmonatsliste", () => {
  it("shows a section for Lebensmonate", () => {
    render(<Lebensmonatsliste {...ANY_PROPS} />);

    expect(screen.getByLabelText("Lebensmonate")).toBeVisible();
  });

  it("renders a list with the first 14 Lebensmonate visible, the rest hidden", () => {
    render(<Lebensmonatsliste {...ANY_PROPS} />);

    range(1, 14).forEach(expectLebensmonatToBeVisible);
    range(15, LetzteLebensmonatszahl).forEach(expectLebensmonatNotToBeVisible);
  });

  it("shows alls planned Lebensmonate even if they are more than 14", () => {
    const plan = erstellePlanMitNGeplantenLebensmonaten(20);

    render(<Lebensmonatsliste {...ANY_PROPS} plan={plan} />);

    range(1, 20).forEach(expectLebensmonatToBeVisible);
    range(21, LetzteLebensmonatszahl).forEach(expectLebensmonatNotToBeVisible);
  });

  it("can continuously toggle the visibility of two more Lebensmonate till 32", async () => {
    render(<Lebensmonatsliste {...ANY_PROPS} />);

    const mehrAnzeigenButton = screen.getByRole("button", {
      name: "mehr Monate anzeigen",
    });

    range(15, LetzteLebensmonatszahl).forEach(expectLebensmonatNotToBeVisible);

    await userEvent.click(mehrAnzeigenButton);
    range(15, 16).forEach(expectLebensmonatToBeVisible);
    range(17, LetzteLebensmonatszahl).forEach(expectLebensmonatNotToBeVisible);

    await userEvent.click(mehrAnzeigenButton);
    range(17, 18).forEach(expectLebensmonatToBeVisible);
    range(19, LetzteLebensmonatszahl).forEach(expectLebensmonatNotToBeVisible);

    for (
      let lebensmonatszahl = 19;
      lebensmonatszahl < LetzteLebensmonatszahl;
      lebensmonatszahl += 2
    ) {
      await userEvent.click(mehrAnzeigenButton);
      range(lebensmonatszahl, lebensmonatszahl + 1).forEach(
        expectLebensmonatToBeVisible,
      );
      range(lebensmonatszahl + 2, LetzteLebensmonatszahl).forEach(
        expectLebensmonatNotToBeVisible,
      );
    }

    expect(
      screen.queryByRole("button", { name: "mehr Monate anzeigen" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "weniger Monate anzeigen" }),
    ).toBeVisible();
  });

  it("when all 32 Lebensmonate are visible it allows to collapse back to the 14 Lebensmonate again", async () => {
    render(<Lebensmonatsliste {...ANY_PROPS} />);

    await zeigeAlleLebensmonateAn();

    await userEvent.click(
      screen.getByRole("button", { name: "weniger Monate anzeigen" }),
    );

    range(1, 14).forEach(expectLebensmonatToBeVisible);
    range(15, LetzteLebensmonatszahl).forEach(expectLebensmonatNotToBeVisible);
  });

  it("never shows less Lebensmonate than planned after collapsing", async () => {
    const plan = erstellePlanMitNGeplantenLebensmonaten(20);
    render(<Lebensmonatsliste {...ANY_PROPS} plan={plan} />);

    await zeigeAlleLebensmonateAn();

    await userEvent.click(
      screen.getByRole("button", { name: "weniger Monate anzeigen" }),
    );

    range(1, 20).forEach(expectLebensmonatToBeVisible);
    range(21, LetzteLebensmonatszahl).forEach(expectLebensmonatNotToBeVisible);
  });

  it("shifts the focus to the next unplanned Lebensmonat when showing more", async () => {
    const plan = erstellePlanMitNGeplantenLebensmonaten(13);
    render(<Lebensmonatsliste {...ANY_PROPS} plan={plan} />);

    await userEvent.click(
      screen.getByRole("button", { name: "mehr Monate anzeigen" }),
    );

    expect(
      screen
        .getByRole("group", { name: "14. Lebensmonat" })
        .querySelector("summary"),
    ).toHaveFocus();
  });

  it("uses the callback to create unplanned Lebensmonate for missing Lebensmonate", () => {
    const plan = {
      ...ANY_PLAN,
      lebensmonate: { 1: ANY_LEBENSMONAT, 3: ANY_LEBENSMONAT },
    };
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

    expect(erstelleUngeplantenLebensmonat).toHaveBeenCalledTimes(14 - 2);
    expect(erstelleUngeplantenLebensmonat).not.toHaveBeenCalledWith(1);
    expect(erstelleUngeplantenLebensmonat).not.toHaveBeenCalledWith(3);
    expect(erstelleUngeplantenLebensmonat).toHaveBeenCalledWith(2);
    expect(erstelleUngeplantenLebensmonat).toHaveBeenCalledWith(4);
  });
});

function expectLebensmonatToBeVisible(lebensmonatszahl: Lebensmonatszahl) {
  expect(
    screen
      .getByRole("group", { name: `${lebensmonatszahl}. Lebensmonat` })
      .querySelector("summary"),
  ).toBeVisible();
}

function expectLebensmonatNotToBeVisible(lebensmonatszahl: Lebensmonatszahl) {
  expect(
    screen.queryByRole("group", { name: `${lebensmonatszahl}. Lebensmonat` }),
  ).not.toBeInTheDocument();
}

function erstellePlanMitNGeplantenLebensmonaten(
  anzahlLebensmonate: Lebensmonatszahl,
): PlanMitBeliebigenElternteilen {
  const ausgangslage = {
    anzahlElternteile: 1 as const,
    geburtsdatumDesKindes: new Date(),
  };

  const lebensmonat = {
    [Elternteil.Eins]: {
      gewaehlteOption: Variante.Plus,
      imMutterschutz: false,
    },
  };
  const lebensmonate = range(1, anzahlLebensmonate).reduce(
    (lebensmonate, lebensmonatszahl) => ({
      ...lebensmonate,
      [lebensmonatszahl]: lebensmonat,
    }),
    {},
  );

  return { ausgangslage, lebensmonate };
}

function range(from: number, to: number): Lebensmonatszahl[] {
  return Lebensmonatszahlen.filter(
    (lebensmonatszahl) => lebensmonatszahl >= from && lebensmonatszahl <= to,
  );
}

async function zeigeAlleLebensmonateAn(): Promise<void> {
  for (
    let mehrAnzeigenButton = screen.queryByRole("button", {
      name: "mehr Monate anzeigen",
    });
    mehrAnzeigenButton;
    mehrAnzeigenButton = screen.queryByRole("button", {
      name: "mehr Monate anzeigen",
    })
  ) {
    await userEvent.click(mehrAnzeigenButton);
  }
}

const ANY_LEBENSMONAT = {
  [Elternteil.Eins]: { imMutterschutz: false as const },
  [Elternteil.Zwei]: { imMutterschutz: false as const },
};

const ANY_PLAN = {
  ausgangslage: {
    anzahlElternteile: 2 as const,
    pseudonymeDerElternteile: {
      [Elternteil.Eins]: "Jane",
      [Elternteil.Zwei]: "John",
    },
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
