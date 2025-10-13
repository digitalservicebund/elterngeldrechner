import classNames from "classnames";
import { ReactNode } from "react";
import { EinkommenFuerElternteil } from "./EinkommenFuerElternteil";
import { ElterngeldFuerElternteil } from "./ElterngeldFuerElternteil";
import { Geldbetrag } from "@/application/components";
import {
  type AusgangslageFuerEinElternteil,
  type PlanMitBeliebigenElternteilen,
  berechneGesamtsumme,
  listeElternteileFuerAusgangslageAuf,
} from "@/monatsplaner";

type Props = {
  readonly plan: PlanMitBeliebigenElternteilen;
  readonly children?: React.ReactNode;
  readonly className?: string;
};

export function Gesamtsummenanzeige({
  plan,
  className,
  children,
}: Props): ReactNode {
  const gesamtsumme = berechneGesamtsumme(plan);
  const showGesamtsumme = gesamtsumme.elterngeldbezug > 0;
  const hasMultipleElternteile = plan.ausgangslage.anzahlElternteile > 1;
  const elternteile = listeElternteileFuerAusgangslageAuf(plan.ausgangslage);
  const jemandHatEinkommen = elternteile
    .map((elternteil) => gesamtsumme.proElternteil[elternteil].bruttoeinkommen)
    .reduce((sum, bruttoeinkommen) => sum + (bruttoeinkommen ?? 0), 0);

  return (
    <section
      className={classNames(
        "flex flex-col justify-evenly gap-y-16 text-center",
        className,
      )}
    >
      {!!hasMultipleElternteile && !!showGesamtsumme && (
        <div className="flex basis-full flex-wrap items-center justify-center gap-6">
          <div className="flex flex-wrap items-center justify-center gap-4 rounded-[6px] bg-white px-10 py-6">
            {!!children && <>{children}</>}

            <p className="mb-0 font-bold">
              Gesamtsumme Elterngeld:{" "}
              <Geldbetrag betrag={gesamtsumme.elterngeldbezug} />
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col justify-center gap-10 sm:flex-row sm:gap-[60px]">
        {listeElternteileFuerAusgangslageAuf(plan.ausgangslage).map(
          (elternteil, index) => (
            <div
              className={classNames(
                "flex flex-col",
                index === 0 ? "sm:items-end" : "sm:items-start",
              )}
              key={index}
            >
              <ElterngeldFuerElternteil
                key={elternteil}
                pseudonym={
                  plan.ausgangslage.pseudonymeDerElternteile?.[elternteil]
                }
                summe={gesamtsumme.proElternteil[elternteil]}
                showSumme={showGesamtsumme}
                className={index === 0 ? "sm:items-end" : "sm:items-start"}
              />

              {!!jemandHatEinkommen && (
                <EinkommenFuerElternteil
                  key={`Einkommen ${elternteil}`}
                  pseudonym={
                    plan.ausgangslage.pseudonymeDerElternteile?.[elternteil]
                  }
                  summe={gesamtsumme.proElternteil[elternteil]}
                />
              )}
            </div>
          ),
        )}
      </div>
    </section>
  );
}

if (import.meta.vitest) {
  const { beforeEach, vi, describe, it, expect } = import.meta.vitest;

  describe("Gesamtsummenanzeige", async () => {
    const { render, screen } = await import("@testing-library/react");
    const { Gesamtsummenanzeige } = await import("./Gesamtsummenanzeige");
    const { Elternteil, berechneGesamtsumme } = await import("@/monatsplaner");

    beforeEach(() => {
      vi.mock(import("@/monatsplaner"), async (importOriginal) => {
        const originalMonatsplaner = await importOriginal();

        return {
          ...originalMonatsplaner,
          berechneGesamtsumme: vi.fn(),
        };
      });
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

        expect(
          screen.getByText("Gesamtsumme Elterngeld: 7.041 €"),
        ).toBeVisible();
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
        expect(screen.getByText("Einkommen:")).toBeVisible();
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
        expect(screen.getByText("2.000 € (brutto)")).toBeVisible();
        expect(screen.getByText("8.000 € (brutto)")).toBeVisible();
      });

      it("shows the Elternteile in korrekt order", () => {
        vi.mocked(berechneGesamtsumme).mockReturnValue({
          elterngeldbezug: 7041,
          proElternteil: {
            [Elternteil.Eins]: ANY_SUMME_FUER_ELTERNTEIL,
            [Elternteil.Zwei]: ANY_SUMME_FUER_ELTERNTEIL,
          },
        });

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
      elterngeldbezug: 1000,
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
  });
}
