import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Gesamtsummenanzeige } from "./Gesamtsummenanzeige";
import { berechneGesamtsumme } from "./berechneGesamtsumme";
import {
  type AusgangslageFuerEinElternteil,
  Elternteil,
} from "@/features/planer/domain";

vi.mock(import("./berechneGesamtsumme"));

describe("Gesamtsummenanzeige", () => {
  beforeEach(() => {
    vi.mocked(berechneGesamtsumme).mockReturnValue(ANY_GESAMTSUMME);
  });

  it("shows a section for the Gesamtsumme", () => {
    render(<Gesamtsummenanzeige {...ANY_PROPS} />);

    expect(screen.getByLabelText("Gesamtsumme")).toBeVisible();
  });

  describe("final Summe", () => {
    it("shows it when there are more than one Elternteil", () => {
      vi.mocked(berechneGesamtsumme).mockReturnValue({
        elterngeldbezug: 7041,
        proElternteil: {
          [Elternteil.Eins]: ANY_SUMME_FUER_ELTERNTEIL,
          [Elternteil.Zwei]: ANY_SUMME_FUER_ELTERNTEIL,
        },
      });

      const plan = {
        ...ANY_PLAN,
        ausgangslage: ausgangslageFuerZweiElternteile(),
      };

      render(<Gesamtsummenanzeige {...ANY_PROPS} plan={plan} />);

      expect(screen.getByText("Gesamtsumme Elterngeld: 7.041 €")).toBeVisible();
    });

    it("hides it if there is only one Elternteil", () => {
      vi.mocked(
        berechneGesamtsumme<AusgangslageFuerEinElternteil>,
      ).mockReturnValue({
        elterngeldbezug: 7041,
        proElternteil: {
          [Elternteil.Eins]: ANY_SUMME_FUER_ELTERNTEIL,
        },
      });

      const plan = {
        ...ANY_PLAN,
        ausgangslage: ausgangslageFuerEinElternteil(),
      };

      render(<Gesamtsummenanzeige {...ANY_PROPS} plan={plan} />);

      expect(
        screen.queryByText(/^Gesamtsumme der Planung: 7.041.€$/),
      ).not.toBeInTheDocument();
    });
  });

  describe("Summe für jedes Elternteil", () => {
    it("shows the Elterngeld, Bruttoeinkommen and Monate for a single Elternteil", () => {
      vi.mocked(
        berechneGesamtsumme<AusgangslageFuerEinElternteil>,
      ).mockReturnValue({
        ...ANY_GESAMTSUMME,
        proElternteil: {
          [Elternteil.Eins]: {
            anzahlMonateMitBezug: 8,
            elterngeldbezug: 6000,
            bruttoeinkommen: 2000,
          },
        },
      });

      const plan = {
        ...ANY_PLAN,
        ausgangslage: ausgangslageFuerEinElternteil(),
      };

      render(<Gesamtsummenanzeige {...ANY_PROPS} plan={plan} />);

      expect(screen.getByText("Elterngeld")).toBeVisible();
      expect(screen.getByText("6.000 € für 8 Monate")).toBeVisible();
      expect(screen.getByText("Einkommen")).toBeVisible();
      expect(screen.getByText("2.000 € (brutto)")).toBeVisible();
    });

    it("includes the Pseudonym when more than one Elternteil", () => {
      vi.mocked(berechneGesamtsumme).mockReturnValue({
        ...ANY_GESAMTSUMME,
        proElternteil: {
          [Elternteil.Eins]: {
            anzahlMonateMitBezug: 8,
            elterngeldbezug: 6000,
            bruttoeinkommen: 2000,
          },
          [Elternteil.Zwei]: {
            anzahlMonateMitBezug: 1,
            elterngeldbezug: 1041,
            bruttoeinkommen: 8000,
          },
        },
      });

      const plan = {
        ...ANY_PLAN,
        ausgangslage: ausgangslageFuerZweiElternteile("Jane", "John"),
      };

      render(<Gesamtsummenanzeige {...ANY_PROPS} plan={plan} />);

      expect(screen.getByText("Jane")).toBeVisible();
      expect(screen.getByText("6.000 € für 8 Monate")).toBeVisible();
      expect(screen.getByText("John")).toBeVisible();
      expect(screen.getByText("1.041 € für 1 Monat")).toBeVisible();
      expect(screen.getByText("Jane: Einkommen")).toBeVisible();
      expect(screen.getByText("2.000 € (brutto)")).toBeVisible();
      expect(screen.getByText("John: Einkommen")).toBeVisible();
      expect(screen.getByText("8.000 € (brutto)")).toBeVisible();
    });

    it("shows the Elternteile in korrekt order", () => {
      const plan = {
        ...ANY_PLAN,
        ausgangslage: ausgangslageFuerZweiElternteile("Jane", "John"),
      };

      render(<Gesamtsummenanzeige {...ANY_PROPS} plan={plan} />);

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

  it("shows a hint in regards of Mutterschutz and monetary values", () => {
    render(<Gesamtsummenanzeige {...ANY_PROPS} />);

    expect(
      screen.getByText(
        "Hinweis: Mutterschaftsleistungen werden nicht in der Summe berücksichtigt.",
      ),
    ).toBeVisible();
  });
});

const ANY_NAME = "Jane";

function ausgangslageFuerEinElternteil() {
  return {
    anzahlElternteile: 1 as const,
    geburtsdatumDesKindes: new Date(),
  };
}

function ausgangslageFuerZweiElternteile(
  pseudonymEins: string = ANY_NAME,
  pseudonymZwei: string = ANY_NAME,
) {
  return {
    anzahlElternteile: 2 as const,
    pseudonymeDerElternteile: {
      [Elternteil.Eins]: pseudonymEins,
      [Elternteil.Zwei]: pseudonymZwei,
    },
    geburtsdatumDesKindes: new Date(),
  };
}

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

const ANY_PLAN = {
  ausgangslage: ausgangslageFuerEinElternteil(),
  lebensmonate: {},
};

const ANY_PROPS = { plan: ANY_PLAN };
