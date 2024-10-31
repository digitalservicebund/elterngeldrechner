import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Gesamtsummenanzeige } from "./Gesamtsummenanzeige";
import { Elternteil } from "@/features/planer/user-interface/service";

describe("Gesamtsummenanzeige", () => {
  it("shows a section for the Gesamtsumme", () => {
    render(<Gesamtsummenanzeige {...ANY_PROPS} />);

    expect(screen.getByLabelText("Gesamtsumme")).toBeVisible();
  });

  describe("final Summe", () => {
    it("shows it when there are more than one Elternteil", () => {
      const pseudonymeDerElternteile = {
        [Elternteil.Eins]: ANY_NAME,
        [Elternteil.Zwei]: ANY_NAME,
      };
      const gesamtsumme = {
        elterngeldbezug: 7041,
        proElternteil: {
          [Elternteil.Eins]: ANY_SUMME_FUER_ELTERNTEIL,
          [Elternteil.Zwei]: ANY_SUMME_FUER_ELTERNTEIL,
        },
      };

      render(
        <Gesamtsummenanzeige
          {...ANY_PROPS}
          pseudonymeDerElternteile={pseudonymeDerElternteile}
          gesamtsumme={gesamtsumme}
        />,
      );

      expect(
        screen.getByText("Gesamtsumme Elterngeld: 7.041 € (netto)"),
      ).toBeVisible();
    });

    it("hides it if there is only one Elternteil", () => {
      const pseudonymeDerElternteile = {
        [Elternteil.Eins]: ANY_NAME,
      };
      const gesamtsumme = {
        elterngeldbezug: 7041,
        proElternteil: {
          [Elternteil.Eins]: ANY_SUMME_FUER_ELTERNTEIL,
        },
      };

      render(
        <Gesamtsummenanzeige
          {...ANY_PROPS}
          pseudonymeDerElternteile={pseudonymeDerElternteile}
          gesamtsumme={gesamtsumme}
        />,
      );

      expect(
        screen.queryByText(/^Gesamtsumme der Planung: 7.041.€$/),
      ).not.toBeInTheDocument();
    });
  });

  describe("Summe für jedes Elternteil", () => {
    it("includes the Pseudonym when more than one Elternteil", () => {
      const pseudonymeDerElternteile = {
        [Elternteil.Eins]: "Jane",
        [Elternteil.Zwei]: "John",
      };
      const gesamtsumme = {
        ...ANY_GESAMTSUMME,
        proElternteil: {
          [Elternteil.Eins]: {
            anzahlMonateMitBezug: 8,
            elterngeldbezug: 6000,
            bruttoeinkommen: 0,
          },
          [Elternteil.Zwei]: {
            anzahlMonateMitBezug: 1,
            elterngeldbezug: 1041,
            bruttoeinkommen: 0,
          },
        },
      };

      render(
        <Gesamtsummenanzeige
          {...ANY_PROPS}
          pseudonymeDerElternteile={pseudonymeDerElternteile}
          gesamtsumme={gesamtsumme}
        />,
      );

      expect(screen.getByText("Jane: Elterngeld")).toBeVisible();
      expect(screen.getByText("6.000 € (netto) für 8 Monate")).toBeVisible();
      expect(screen.getByText("John: Elterngeld")).toBeVisible();
      expect(screen.getByText("1.041 € (netto) für 1 Monat")).toBeVisible();
    });

    it("shows the Elternteile in korrekt order", () => {
      const pseudonymeDerElternteile = {
        [Elternteil.Eins]: "Jane",
        [Elternteil.Zwei]: "John",
      };

      render(
        <Gesamtsummenanzeige
          {...ANY_PROPS}
          pseudonymeDerElternteile={pseudonymeDerElternteile}
        />,
      );

      const elternteilEins = screen.getByText((content) =>
        content.includes("Jane"),
      );

      const elternteilZwei = screen.getByText((content) =>
        content.includes("John"),
      );

      expect(elternteilEins.compareDocumentPosition(elternteilZwei)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING,
      );
    });
  });

  it("shows a hint in regards of Mutterschutz", () => {
    render(<Gesamtsummenanzeige {...ANY_PROPS} />);

    expect(
      screen.getByText(
        "Hinweis: Mutterschaftsleistungen werden nicht in der Summe berücksichtigt",
      ),
    ).toBeVisible();
  });
});

const ANY_NAME = "Jane";

const ANY_SUMME_FUER_ELTERNTEIL = {
  anzahlMonateMitBezug: 0,
  elterngeldbezug: 0,
  bruttoeinkommen: 0,
};

const ANY_GESAMTSUMME = {
  elterngeldbezug: 0,
  proElternteil: {
    [Elternteil.Eins]: ANY_SUMME_FUER_ELTERNTEIL,
    [Elternteil.Zwei]: ANY_SUMME_FUER_ELTERNTEIL,
  },
};

const ANY_PROPS = {
  pseudonymeDerElternteile: {
    [Elternteil.Eins]: ANY_NAME,
    [Elternteil.Zwei]: ANY_NAME,
  },
  gesamtsumme: ANY_GESAMTSUMME,
};
