import ArrowOutward from "@digitalservicebund/icons/ArrowOutward";
import CheckIcon from "@digitalservicebund/icons/Check";
import SaveAltIcon from "@digitalservicebund/icons/SaveAlt";
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
import { Button } from "@/application/components/Button";
import { stepAllgemeineAngabenSelectors } from "@/application/features/abfrageteil/state";
import { useAppSelector } from "@/application/redux/hooks";
import { pushTrackingEvent } from "@/application/user-tracking";
import {
  type PlanMitBeliebigenElternteilen,
  type Result,
} from "@/monatsplaner";
import type { SpecificationViolation } from "@/monatsplaner/common/specification";

type Props = {
  readonly className?: string;
  readonly plan: PlanMitBeliebigenElternteilen;
  readonly ueberpruefePlanung: () => Result<void, SpecificationViolation[]>;
  readonly planInAntragUebernehmen: () => void;
  readonly bonusFreischalten?: (event: SyntheticEvent) => void;
  readonly onPlanungDrucken?: () => void;
};

function trackReferenzAufOnlinetool() {
  pushTrackingEvent("Referenz-auf-Onlinetool-wurde-geklickt");
}

function trackReferenzAufLandesseite() {
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

  const bundesland = useAppSelector(
    stepAllgemeineAngabenSelectors.getBundesland,
  );
  if (bundesland === null) {
    throw new Error("bundesland should not be null");
  }

  const ueberpruefePlanungCallback = useCallback(() => {
    setValidierungsergebnis(ueberpruefePlanung());
    setTips(generateTips(plan));
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

            {!!bundesland.isSupported && (
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
                    Beachten Sie: Eine Übermittlung der Planung in den digitalen
                    Antrag ist nicht möglich.
                  </p>
                  <p>
                    Möchten Sie den Antrag digital einreichen, finden Sie{" "}
                    <a
                      className="text-primary underline"
                      href={bundesland.linkOnlinetool}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => trackReferenzAufOnlinetool()}
                    >
                      hier{" "}
                      <span className="sr-only">(öffnet in neuem Fenster)</span>
                    </a>{" "}
                    das passende Tool.
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col text-center print:hidden">
              <Button
                className="text-base"
                type="button"
                buttonStyle="link"
                onClick={planungDrucken}
              >
                <SaveAltIcon className="mr-8" />
                Planung als PDF drucken oder speichern
              </Button>

              <p className="mt-8">Sie können Ihre Planung ausdrucken.</p>
              <p className="max-w-none">
                Um Ihre Planung zu speichern, wählen Sie in der Druckvorschau
                „Als PDF speichern“ aus.
              </p>
            </div>

            {!bundesland.isSupported && (
              <div className="mt-40 text-center">
                <p className="max-w-none">
                  Den PDF-Antrag für {bundesland.name} sowie den Zugang zum
                  Online-Antrag finden Sie auf folgender Seite:
                </p>
                <a
                  className="text-primary underline"
                  href={bundesland.link}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackReferenzAufLandesseite()}
                >
                  <ArrowOutward aria-hidden="true" /> Zum Antrag auf Elterngeld
                  in {bundesland.name}
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
  const { vi, describe, it, expect } = import.meta.vitest;

  describe("Pruefbuttonbox", async () => {
    const { INITIAL_STATE, render, screen } = await import(
      "@/application/test-utils"
    );
    const { produce } = await import("immer");
    const { Elternteil, Result } = await import("@/monatsplaner");
    const { userEvent } = await import("@testing-library/user-event");

    describe("plan is not checked yet", () => {
      it("shows a button to check whether or not the selected plan is valid", () => {
        render(<Pruefbuttonbox {...ANY_PROPS} />, {
          preloadedState: supportedBundeslandTestState,
        });

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

        render(<Pruefbuttonbox {...props} />, {
          preloadedState: supportedBundeslandTestState,
        });

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

        render(<Pruefbuttonbox {...props} />, {
          preloadedState: supportedBundeslandTestState,
        });

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
        expect(screen.getByRole("link", { name: /hier/i })).toBeVisible();
      });

      it("shows a button to print and a link to the application page if bundesland is not supported", async () => {
        const user = userEvent.setup();

        const successResult = Result.ok(undefined);

        const props = {
          ...ANY_PROPS,
          ueberpruefePlanung: vi.fn().mockReturnValue(successResult),
        };

        render(<Pruefbuttonbox {...props} />, {
          preloadedState: notSupportedBundeslandTestState,
        });

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

    const supportedBundeslandTestState = produce(INITIAL_STATE, (draft) => {
      draft.stepAllgemeineAngaben.bundesland = "Berlin";
    });

    const notSupportedBundeslandTestState = produce(INITIAL_STATE, (draft) => {
      draft.stepAllgemeineAngaben.bundesland = "Baden-Württemberg";
    });
  });
}
