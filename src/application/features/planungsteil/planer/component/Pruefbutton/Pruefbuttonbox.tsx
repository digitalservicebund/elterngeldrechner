import classNames from "classnames";
import {
  type ReactNode,
  SyntheticEvent,
  useCallback,
  useEffect,
  useId,
  useState,
} from "react";
import { Prueftippbox } from "./Prueftippbox";
import { Validierungsfehlerbox } from "./Validierungsfehlerbox";
import { type Tips, generateTips } from "./generateTips";
import { Button } from "@/application/features/components/Button";
import { useAntragInformationen } from "@/application/features/planungsteil/planer/hooks/useAntragInformationen";
import { posthog, pushTrackingEvent } from "@/application/user-tracking";
import {
  type PlanMitBeliebigenElternteilen,
  type Result,
} from "@/monatsplaner";
import type { SpecificationViolation } from "@/monatsplaner/common/specification";
import ArrowOutward from "~icons/material-symbols/arrow-outward";
import CheckIcon from "~icons/material-symbols/check";
import DownloadIcon from "~icons/material-symbols/download";

type Props = {
  readonly className?: string;
  readonly plan: PlanMitBeliebigenElternteilen;
  readonly ueberpruefePlanung: () => Result<void, SpecificationViolation[]>;
  readonly planInAntragUebernehmen: () => void;
  readonly bonusFreischalten?: (event: SyntheticEvent) => void;
  readonly onPlanungDrucken?: () => void;
};

function trackReferenzAufOnlinetool() {
  posthog.capture("monatsplaner_referenz_auf_onlinetool_geklickt");
  pushTrackingEvent("Referenz-auf-Onlinetool-wurde-geklickt");
}

function trackReferenzAufLandesseite() {
  posthog.capture("monatsplaner_referenz_auf_landesseite_geklickt");
  pushTrackingEvent("Referenz-auf-Landesseite-wurde-geklickt");
}

export function Pruefbuttonbox({
  className,
  plan,
  ueberpruefePlanung,
  planInAntragUebernehmen,
  bonusFreischalten,
  onPlanungDrucken,
}: Props): ReactNode {
  const headingIdentifier = useId();
  const planungDrucken = () => {
    window.print();
    onPlanungDrucken?.();
    posthog.capture("monatsplaner_planung_gedruckt");
  };

  const [validierungsergebnis, setValidierungsergebnis] = useState<Result<
    void,
    SpecificationViolation[]
  > | null>(null);

  const istPlanungUeberprueft = validierungsergebnis !== null;

  const istPlanungGueltig =
    validierungsergebnis?.mapOrElse(
      () => true,
      () => false,
    ) ?? false;

  const validierungsfehler: string[] =
    validierungsergebnis?.mapOrElse(
      () => [],
      (violations) => violations.map((violation) => violation.message),
    ) ?? [];

  const [tips, setTips] = useState<Tips>({
    normalTips: [],
    hasSpecialBonusTip: false,
  });

  const bundeslandAntragSupport = useAntragInformationen();
  if (bundeslandAntragSupport === null) {
    throw new Error("bundesland should not be null");
  }

  const ueberpruefePlanungCallback = useCallback(() => {
    const validierungsergebnis = ueberpruefePlanung();
    const tips = generateTips(plan);

    setValidierungsergebnis(validierungsergebnis);
    setTips(tips);

    posthog.capture("monatsplaner_pruefbutton_geklickt", {
      tips: tips.normalTips.length + (tips.hasSpecialBonusTip ? 1 : 0),
      gueltig: validierungsergebnis.mapOrElse(
        () => true,
        () => false,
      ) as boolean,
    });
  }, [ueberpruefePlanung, plan]);

  useEffect(() => {
    setValidierungsergebnis(null);
    setTips({ normalTips: [], hasSpecialBonusTip: false });
  }, [plan.lebensmonate]);

  return (
    <section
      className={classNames("flex flex-col items-center gap-16", className)}
      aria-labelledby={headingIdentifier}
    >
      <h4 id={headingIdentifier} className="sr-only">
        Prüfbuttonbox
      </h4>
      {!istPlanungUeberprueft ? (
        <Button type="button" onClick={ueberpruefePlanungCallback}>
          Planung überprüfen
        </Button>
      ) : istPlanungGueltig ? (
        <>
          <div className="flex w-full flex-col items-center gap-16 bg-Bonus-light p-32">
            <h5>
              <CheckIcon /> Super. Ihre Planung ist gültig.
            </h5>

            <Prueftippbox
              tips={tips}
              alleinerziehend={plan.ausgangslage.istAlleinerziehend}
              onBonusFreischalten={bonusFreischalten}
            />

            {!!bundeslandAntragSupport.isSupported && (
              <div className="flex flex-col items-center">
                <Button
                  type="button"
                  onClick={planInAntragUebernehmen}
                  className="my-20"
                >
                  Planung in den Papierantrag übernehmen
                </Button>

                <div className="mb-40 text-center">
                  <p className="max-w-none">
                    Bitte beachten Sie: Eine automatische Übermittlung Ihrer
                    Planung in den digitalen Antrag ist derzeit nicht möglich.
                    Um den Antrag digital einzureichen, übertragen Sie Ihre
                    Daten bitte manuell in das{" "}
                    <a
                      className="text-primary underline"
                      href={bundeslandAntragSupport.linkOnlinetool}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => trackReferenzAufOnlinetool()}
                    >
                      das offizielle Tool
                      <span className="sr-only">(öffnet in neuem Fenster)</span>
                    </a>{" "}
                    .
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col text-center print:hidden">
              <Button type="button" buttonStyle="link" onClick={planungDrucken}>
                <DownloadIcon className="mr-8" />
                Planung als PDF drucken oder speichern
              </Button>

              <p className="mt-8">Sie können Ihre Planung ausdrucken.</p>
              <p className="max-w-none">
                Um Ihre Planung zu speichern, wählen Sie in der Druckvorschau
                „Als PDF speichern“ aus.
              </p>
            </div>

            {!bundeslandAntragSupport.isSupported && (
              <div className="mt-40 text-center">
                <p className="max-w-none">
                  Den PDF-Antrag für {bundeslandAntragSupport.name} sowie den
                  Zugang zum Online-Antrag finden Sie auf folgender Seite:
                </p>
                <a
                  className="text-primary underline"
                  href={bundeslandAntragSupport.link}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackReferenzAufLandesseite()}
                >
                  <ArrowOutward aria-hidden="true" /> Zum Antrag auf Elterngeld
                  in {bundeslandAntragSupport.name}
                  <span className="sr-only">(öffnet in neuem Fenster)</span>
                </a>
              </div>
            )}
          </div>
        </>
      ) : (
        <Validierungsfehlerbox validierungsfehler={validierungsfehler} />
      )}
    </section>
  );
}

if (import.meta.vitest) {
  const { vi, beforeEach, describe, it, expect } = import.meta.vitest;

  describe("Pruefbuttonbox", async () => {
    const { render, screen } = await import("@testing-library/react");
    const { Elternteil, Result } = await import("@/monatsplaner");
    const { userEvent } = await import("@testing-library/user-event");
    const useAntragInformationenModule =
      await import("@/application/features/planungsteil/planer/hooks/useAntragInformationen");
    const pdfAntragModule =
      await import("@/application/features/datenuebernahme/pdfAntrag");

    beforeEach(() => {
      vi.spyOn(
        useAntragInformationenModule,
        "useAntragInformationen",
      ).mockReturnValue(
        pdfAntragModule.getBundeslandAntragSupportByName("Berlin"),
      );
    });

    describe("plan is not checked yet", () => {
      it("shows a button to check whether or not the selected plan is valid", () => {
        render(<Pruefbuttonbox {...ANY_PROPS} />);

        expect(
          screen.getByRole("button", { name: "Planung überprüfen" }),
        ).toBeVisible();
      });
    });

    describe("plan is checked", () => {
      it("shows a message that plan is not valid if checking the plan results in failure", async () => {
        const user = userEvent.setup();

        const testErrors: SpecificationViolation[] = [
          { message: "Aktuell ist die Planung nicht vollständig." },
        ];
        const failureResult = Result.error(testErrors);

        const props = {
          ...ANY_PROPS,
          ueberpruefePlanung: vi.fn().mockReturnValue(failureResult),
        };

        render(<Pruefbuttonbox {...props} />);

        const checkButton = screen.getByRole("button", {
          name: "Planung überprüfen",
        });
        expect(checkButton).toBeVisible();

        await user.click(checkButton);
        expect(checkButton).not.toBeInTheDocument();

        expect(
          screen.getByLabelText("Ihre Planung ist noch nicht gültig."),
        ).toBeVisible();
      });

      it("shows a button to use the data for the paper application, a button to print and a link to use the online tool if bundesland is supported", async () => {
        const user = userEvent.setup();

        const successResult = Result.ok(undefined);

        const props = {
          ...ANY_PROPS,
          ueberpruefePlanung: vi.fn().mockReturnValue(successResult),
        };

        render(<Pruefbuttonbox {...props} />);

        const checkButton = screen.getByRole("button", {
          name: "Planung überprüfen",
        });
        expect(checkButton).toBeVisible();

        await user.click(checkButton);
        expect(checkButton).not.toBeInTheDocument();

        expect(
          screen.getByRole("button", {
            name: "Planung in den Papierantrag übernehmen",
          }),
        ).toBeVisible();
        expect(
          screen.getByRole("button", {
            name: "Planung als PDF drucken oder speichern",
          }),
        ).toBeVisible();
        expect(
          screen.getByRole("link", { name: /offizielle Tool/i }),
        ).toBeVisible();
      });

      it("shows a button to print and a link to the application page if bundesland is not supported", async () => {
        vi.spyOn(
          useAntragInformationenModule,
          "useAntragInformationen",
        ).mockReturnValue(
          pdfAntragModule.getBundeslandAntragSupportByName("Baden-Württemberg"),
        );

        const user = userEvent.setup();

        const successResult = Result.ok(undefined);

        const props = {
          ...ANY_PROPS,
          ueberpruefePlanung: vi.fn().mockReturnValue(successResult),
        };

        render(<Pruefbuttonbox {...props} />);

        const checkButton = screen.getByRole("button", {
          name: "Planung überprüfen",
        });
        expect(checkButton).toBeVisible();

        await user.click(checkButton);
        expect(checkButton).not.toBeInTheDocument();

        expect(
          screen.queryByRole("button", {
            name: "Planung in den Papierantrag übernehmen",
          }),
        ).not.toBeInTheDocument();
        expect(
          screen.getByRole("button", {
            name: "Planung als PDF drucken oder speichern",
          }),
        ).toBeVisible();
        expect(
          screen.getByRole("link", {
            name: /Zum Antrag auf Elterngeld in Baden-Württemberg/,
          }),
        ).toBeVisible();
      });
    });

    const ANY_NAME = "Jane";

    function ausgangslageFuerZweiElternteile(
      nameEins: string = ANY_NAME,
      nameZwei: string = ANY_NAME,
    ) {
      return {
        anzahlElternteile: 2 as const,
        namenDerElternteile: {
          [Elternteil.Eins]: nameEins,
          [Elternteil.Zwei]: nameZwei,
        },
        geburtsdatumDesKindes: new Date(),
      };
    }

    const ANY_PLAN: PlanMitBeliebigenElternteilen = {
      ausgangslage: ausgangslageFuerZweiElternteile(),
      lebensmonate: {},
    };

    const ANY_PROPS = {
      plan: ANY_PLAN,
      ueberpruefePlanung: vi.fn(),
      planInAntragUebernehmen: vi.fn(),
    };
  });
}
