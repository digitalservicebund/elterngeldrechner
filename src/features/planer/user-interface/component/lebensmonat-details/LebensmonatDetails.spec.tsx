import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LebensmonatDetails } from "./LebensmonatDetails";
import { HinweisZumBonus } from "./HinweisZumBonus";
import {
  Elternteil,
  KeinElterngeld,
  Variante,
  type Auswahloption,
} from "@/features/planer/user-interface/service";
import { MONAT_MIT_MUTTERSCHUTZ } from "@/features/planer/domain/monat";

describe("LebensmonateDetails", () => {
  it("shows a details group for the Lebensmonatszahl", () => {
    render(<LebensmonatDetails {...ANY_PROPS} lebensmonatszahl={5} />);

    expect(screen.queryByRole("group", { name: "5. Lebensmonat" }));
  });

  describe("summary description", () => {
    it("has a short discription if no Elternteil made a choice yet", () => {
      const lebensmonat = {
        [Elternteil.Eins]: monat(undefined),
        [Elternteil.Zwei]: monat(undefined),
      };

      render(<LebensmonatDetails {...ANY_PROPS} lebensmonat={lebensmonat} />);

      expect(
        screen.getByRole("group").querySelector("summary"),
      ).toHaveAccessibleDescription(/^Noch keine Auswahl getätigt./);
    });

    it("lists the Elternteile with their Pseudonym, chosen Option and elterngeldbezug if one Elternteil made a choice", () => {
      const lebensmonat = {
        [Elternteil.Eins]: monat(undefined),
        [Elternteil.Zwei]: monat(Variante.Plus, 900),
      };
      const pseudonymeDerElternteile = {
        [Elternteil.Eins]: "Jane",
        [Elternteil.Zwei]: "John",
      };

      render(
        <LebensmonatDetails
          {...ANY_PROPS}
          lebensmonat={lebensmonat}
          pseudonymeDerElternteile={pseudonymeDerElternteile}
        />,
      );

      expect(
        screen.getByRole("group").querySelector("summary"),
      ).toHaveAccessibleDescription(
        /^Jane hat noch keine Auswahl getroffen. John bezieht ElterngeldPlus und erhält 900\u00A0€\./,
      );
    });

    it("lists the Elternteile with their Pseudonym, chosen Option and elterngeldbezug if both made a choice", () => {
      const lebensmonat = {
        [Elternteil.Eins]: monat(KeinElterngeld, null),
        [Elternteil.Zwei]: monat(Variante.Plus, 900),
      };
      const pseudonymeDerElternteile = {
        [Elternteil.Eins]: "Jane",
        [Elternteil.Zwei]: "John",
      };

      render(
        <LebensmonatDetails
          {...ANY_PROPS}
          lebensmonat={lebensmonat}
          pseudonymeDerElternteile={pseudonymeDerElternteile}
        />,
      );

      expect(
        screen.getByRole("group").querySelector("summary"),
      ).toHaveAccessibleDescription(
        /^Jane bezieht kein Elterngeld\. John bezieht ElterngeldPlus und erhält 900\u00A0€\./,
      );
    });

    it("describes if an Elternteil is im Mutterschutz", () => {
      const lebensmonat = {
        [Elternteil.Eins]: MONAT_MIT_MUTTERSCHUTZ,
      };
      const pseudonymeDerElternteile = {
        [Elternteil.Eins]: "Jane",
      };

      render(
        <LebensmonatDetails
          {...ANY_PROPS}
          lebensmonat={lebensmonat}
          pseudonymeDerElternteile={pseudonymeDerElternteile}
        />,
      );

      expect(
        screen.getByRole("group").querySelector("summary"),
      ).toHaveAccessibleDescription(/^Jane ist im Mutterschutz\./);
    });

    it("includes a reference to the Zeitraum discription of the Lebensmonat", () => {
      render(<LebensmonatDetails {...ANY_PROPS} />);

      expect(
        screen.getByRole("group").querySelector("summary"),
      ).toHaveAccessibleDescription(/Zeitraum/);
    });
  });

  it("shows visual indicators in the summary for the choices of the Elternteile", () => {
    const lebensmonat = {
      [Elternteil.Eins]: monat(Variante.Basis, 10),
      [Elternteil.Zwei]: monat(Variante.Plus, 20),
    };

    render(<LebensmonatDetails {...ANY_PROPS} lebensmonat={lebensmonat} />);

    const summary = screen.getByRole("group").querySelector("summary")!;
    expect(within(summary).queryByText("Basis")).toBeVisible();
    expect(within(summary).queryByText("10 €")).toBeVisible();
    expect(within(summary).queryByText("Plus")).toBeVisible();
    expect(within(summary).queryByText("20 €")).toBeVisible();
  });

  it("shows an input fieldset to choose an Option for each Elternteil in the details body", () => {
    const pseudonymeDerElternteile = {
      [Elternteil.Eins]: "Jane",
      [Elternteil.Zwei]: "John",
    };

    render(
      <LebensmonatDetails
        {...ANY_PROPS}
        pseudonymeDerElternteile={pseudonymeDerElternteile}
        lebensmonatszahl={3}
      />,
    );

    expect(
      screen.getByRole("radiogroup", {
        name: "Auswahl von Jane für den 3. Lebensmonat",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("radiogroup", {
        name: "Auswahl von John für den 3. Lebensmonat",
      }),
    ).toBeInTheDocument();
  });

  it("uses the provided callback to determine the Auswahlmöglichkeiten per Elternteil", () => {
    const bestimmeAuswahlmoeglichkeiten = vi
      .fn()
      .mockReturnValue(ANY_AUSWAHLMOEGLICHKEITEN);

    render(
      <LebensmonatDetails
        {...ANY_PROPS}
        bestimmeAuswahlmoeglichkeiten={bestimmeAuswahlmoeglichkeiten}
      />,
    );

    expect(bestimmeAuswahlmoeglichkeiten).toHaveBeenCalledTimes(2);
    expect(bestimmeAuswahlmoeglichkeiten).toHaveBeenCalledWith(Elternteil.Eins);
    expect(bestimmeAuswahlmoeglichkeiten).toHaveBeenCalledWith(Elternteil.Zwei);
  });

  describe("hint for Bonus", () => {
    it("shows the hint when Bonus is chosen", () => {
      vi.mocked(HinweisZumBonus).mockReturnValue("Test Bonus Hinweis Text");
      const lebensmonat = {
        [Elternteil.Eins]: monat(Variante.Bonus),
        [Elternteil.Zwei]: monat(Variante.Bonus),
      };
      render(<LebensmonatDetails {...ANY_PROPS} lebensmonat={lebensmonat} />);

      expect(screen.queryByText("Test Bonus Hinweis Text")).toBeInTheDocument();
    });

    it("hides the hint when no Bonus is chosen", () => {
      vi.mocked(HinweisZumBonus).mockReturnValue("Test Bonus Hinweis Text");
      const lebensmonat = {
        [Elternteil.Eins]: monat(Variante.Basis),
        [Elternteil.Zwei]: monat(Variante.Basis),
      };
      render(<LebensmonatDetails {...ANY_PROPS} lebensmonat={lebensmonat} />);

      expect(
        screen.queryByText("Test Bonus Hinweis Text"),
      ).not.toBeInTheDocument();
    });
  });

  describe("open and close", () => {
    it("details opens and closes the details body when clicking the summary", async () => {
      render(<LebensmonatDetails {...ANY_PROPS} />);

      const summary = screen.getByRole("group").querySelector("summary")!;
      const body = screen.getByTestId("details-body");

      expect(body).not.toBeVisible();
      await userEvent.click(summary);
      expect(body).toBeVisible();
      await userEvent.click(summary);
      expect(body).not.toBeVisible();
    });

    it("closes the details body when clicking outside", async () => {
      render(<LebensmonatDetails {...ANY_PROPS} />);

      const summary = screen.getByRole("group").querySelector("summary")!;
      const body = screen.getByTestId("details-body");
      await userEvent.click(summary);

      expect(body).toBeVisible();
      await userEvent.click(document.body);
      expect(body).not.toBeVisible();
    });
  });
});

function monat(
  gewaehlteOption: Auswahloption | undefined,
  elterngeldbezug?: number | null,
) {
  return { gewaehlteOption, elterngeldbezug, imMutterschutz: false as const };
}

const ANY_AUSWAHLMOEGLICHKEITEN = {
  [Variante.Basis]: { elterngeldbezug: 1, isDisabled: false as const },
  [Variante.Plus]: { elterngeldbezug: 1, isDisabled: false as const },
  [Variante.Bonus]: { elterngeldbezug: 1, isDisabled: false as const },
  [KeinElterngeld]: { elterngeldbezug: null, isDisabled: false as const },
};

const ANY_PROPS = {
  lebensmonatszahl: 2 as const,
  lebensmonat: {
    [Elternteil.Eins]: { imMutterschutz: false as const },
    [Elternteil.Zwei]: { imMutterschutz: false as const },
  },
  pseudonymeDerElternteile: {
    [Elternteil.Eins]: "Jane",
    [Elternteil.Zwei]: "John",
  },
  geburtsdatumDesKindes: new Date(),
  bestimmeAuswahlmoeglichkeiten: () => ANY_AUSWAHLMOEGLICHKEITEN,
  waehleOption: () => {},
};

vi.mock(
  "@/features/planer/user-interface/component/lebensmonate-details/HinweisZumBonus",
);
