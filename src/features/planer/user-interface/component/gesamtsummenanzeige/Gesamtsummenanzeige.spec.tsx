import { render, screen } from "@testing-library/react";
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
        summe: 7041,
        summeProElternteil: {
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
        screen.getByText(/^Gesamtsumme der Planung: 7.041.€$/),
      ).toBeVisible();
    });

    it("hides it if there is only one Elternteil", () => {
      const pseudonymeDerElternteile = {
        [Elternteil.Eins]: ANY_NAME,
      };
      const gesamtsumme = {
        summe: 7041,
        summeProElternteil: {
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
        summeProElternteil: {
          [Elternteil.Eins]: {
            anzahlMonateMitBezug: 8,
            totalerElterngeldbezug: 6000,
          },
          [Elternteil.Zwei]: {
            anzahlMonateMitBezug: 1,
            totalerElterngeldbezug: 1041,
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

      expect(screen.getByText("Jane")).toBeVisible();
      expect(screen.getByText("8 Monate")).toBeVisible();
      expect(screen.getByText(/^Elterngeld: 6.000.€$/)).toBeVisible();
      expect(screen.getByText("John")).toBeVisible();
      expect(screen.getByText("1 Monat")).toBeVisible();
      expect(screen.getByText(/^Elterngeld: 1.041.€$/)).toBeVisible();
    });

    it("excludes the Pseudonym when there is only one Elternteil", () => {
      const pseudonymeDerElternteile = {
        [Elternteil.Eins]: "Jane",
      };
      const gesamtsumme = {
        ...ANY_GESAMTSUMME,
        summeProElternteil: {
          [Elternteil.Eins]: {
            anzahlMonateMitBezug: 0,
            totalerElterngeldbezug: 0,
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

      expect(screen.queryByText("Jane")).not.toBeInTheDocument();
      expect(screen.getByText("0 Monate")).toBeVisible();
      expect(screen.getByText(/^Elterngeld: 0.€$/)).toBeVisible();
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

      const elternteilEins = screen.getByText("Jane");
      const elternteilZwei = screen.getByText("John");

      expect(elternteilEins.compareDocumentPosition(elternteilZwei)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING,
      );
    });
  });

  it("shows a hint in regards of Mutterschutz", () => {
    render(<Gesamtsummenanzeige {...ANY_PROPS} />);

    expect(
      screen.getByText(
        "Hinweis: Mutterschutz wird nicht in der Summe berücksichtigt",
      ),
    ).toBeVisible();
  });
});

const ANY_NAME = "Jane";

const ANY_SUMME_FUER_ELTERNTEIL = {
  anzahlMonateMitBezug: 0,
  totalerElterngeldbezug: 0,
};

const ANY_GESAMTSUMME = {
  summe: 0,
  summeProElternteil: {
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
