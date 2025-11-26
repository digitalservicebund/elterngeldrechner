import { useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/application/components";
import {
  AngabenPersonForm,
  AnzahlTaetigkeitenForm,
  AusklammerungsGruendeForm,
  AusklammerungsZeitenForm,
  Bemessungszeitraum,
  EinkommenAngabenForm,
  KeinEinkommenForm,
  TaetigkeitenForm,
  UebersichtTaetigkeitenForm,
} from "@/application/features/abfrage-prototyp";
import {
  PersonPageFlow,
  PersonPageStepKey,
  getLastStep,
  getNextStep,
} from "@/application/features/abfrage-prototyp/components/PersonPageRouting";
import { Ausklammerung } from "@/application/features/abfrage-prototyp/components/berechneBemessungszeitraum";
import {
  StepPrototypState,
  stepPrototypSelectors,
} from "@/application/features/abfrage-prototyp/state";
import { TaetigkeitenSelektor } from "@/application/features/abfrage-prototyp/state/stepPrototypSlice";
import {
  Antragstellende,
  YesNo,
} from "@/application/features/abfrageteil/state";
import { Page } from "@/application/pages/Page";
import { useAppSelector } from "@/application/redux/hooks";
import { formSteps } from "@/application/routing/formSteps";
import { Elternteil } from "@/monatsplaner";

type Props = {
  readonly elternteil: Elternteil;
};

export type EinkommenAngabenStep = {
  taetigkeitIndex: number;
  taetigkeitArt: TaetigkeitenSelektor | null;
};

export function PersonPage({ elternteil }: Props) {
  const formIdentifier = useId();

  const [currentPersonPageStepET1, setCurrentPersonPageStepET1] =
    useState<PersonPageStepKey>("angabenPerson");
  const [currentPersonPageStepET2, setCurrentPersonPageStepET2] =
    useState<PersonPageStepKey>("angabenPerson");
  const [currentPersonPageFlowET1, setCurrentPersonPageFlowET1] =
    useState<PersonPageFlow>();
  const [currentPersonPageFlowET2, setCurrentPersonPageFlowET2] =
    useState<PersonPageFlow>();
  const [hasAusklammerungsgrundET1, setHasAusklammerungsgrundET1] =
    useState<boolean>(false);
  const [hasAusklammerungsgrundET2, setHasAusklammerungsgrundET2] =
    useState<boolean>(false);
  const [auszuklammerndeZeitraeumeET1, setAuszuklammerndeZeitraeumeET1] =
    useState<Ausklammerung[]>();
  const [auszuklammerndeZeitraeumeET2, setAuszuklammerndeZeitraeumeET2] =
    useState<Ausklammerung[]>();
  const [hasWeitereTaetigkeitenET1, setHasWeitereTaetigkeitenET1] =
    useState<YesNo | null>(null);
  const [hasWeitereTaetigkeitenET2, setHasWeitereTaetigkeitenET2] =
    useState<YesNo | null>(null);
  const [einkommenAngabenStepsET1, setEinkommenAngabenStepsET1] = useState<
    EinkommenAngabenStep[]
  >([]);
  const [einkommenAngabenStepsET2, setEinkommenAngabenStepsET2] = useState<
    EinkommenAngabenStep[]
  >([]);
  const [currentEinkommenAngabenStepET1, setCurrentEinkommenAngabenStepET1] =
    useState<EinkommenAngabenStep>({
      taetigkeitIndex: 0,
      taetigkeitArt: null,
    });
  const [currentEinkommenAngabenStepET2, setCurrentEinkommenAngabenStepET2] =
    useState<EinkommenAngabenStep>({
      taetigkeitIndex: 0,
      taetigkeitArt: null,
    });

  const alleinerziehend = useAppSelector(
    stepPrototypSelectors.getAlleinerziehend,
  );

  const navigate = useNavigate();

  const navigateToNextStep = (
    antragstellende: Antragstellende | null,
    flow: PersonPageFlow | undefined,
    hasAusklammerungsgrund: boolean | undefined,
    hasWeitereTaetigkeiten: YesNo | null,
    // taetigkeiten?: TaetigkeitAngaben[],
  ) => {
    const nextStep = getNextStep(
      elternteil,
      elternteil === Elternteil.Eins
        ? currentPersonPageStepET1
        : currentPersonPageStepET2,
      flow,
      hasAusklammerungsgrund,
      hasWeitereTaetigkeiten,
      antragstellende,
    );
    if (nextStep === "einkommenAngaben") {
      if (elternteil === Elternteil.Eins) {
        setCurrentPersonPageStepET1("einkommenAngaben");
      } else {
        setCurrentPersonPageStepET2("einkommenAngaben");
      }
    } else if (
      elternteil === Elternteil.Eins
        ? currentPersonPageStepET1 === "einkommenAngaben"
        : currentPersonPageStepET2 === "einkommenAngaben"
    ) {
      const routingStatus = handleEinkommenRouting();
      if (routingStatus === "einkommenRoutingBeendet") {
        if (alleinerziehend === YesNo.YES || elternteil === Elternteil.Zwei) {
          navigate(formSteps.beispiele.route);
        } else {
          navigate(formSteps.person2.route);
        }
      }
    } else if (nextStep === "routingEnded") {
      if (alleinerziehend === YesNo.YES || elternteil === Elternteil.Zwei) {
        navigate(formSteps.beispiele.route);
      } else {
        navigate(formSteps.person2.route);
      }
    } else {
      if (elternteil === Elternteil.Eins) {
        setCurrentPersonPageStepET1(nextStep);
      } else {
        setCurrentPersonPageStepET2(nextStep);
      }
    }
  };

  const navigateToLastStep = () => {
    const lastStep = getLastStep(
      elternteil === Elternteil.Eins
        ? currentPersonPageStepET1
        : currentPersonPageStepET2,
      elternteil === Elternteil.Eins
        ? currentPersonPageFlowET1
        : currentPersonPageFlowET2,
      elternteil === Elternteil.Eins
        ? hasAusklammerungsgrundET1
        : hasAusklammerungsgrundET2,
      elternteil === Elternteil.Eins
        ? hasWeitereTaetigkeitenET1
        : hasWeitereTaetigkeitenET2,
    );

    if (
      elternteil === Elternteil.Eins &&
      currentPersonPageStepET1 === "angabenPerson"
    ) {
      navigate(formSteps.familie.route);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (
      elternteil === Elternteil.Zwei &&
      currentPersonPageStepET2 === "angabenPerson"
    ) {
      navigate(formSteps.person1.route);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (
      elternteil === Elternteil.Eins
        ? currentPersonPageStepET1 === "einkommenAngaben"
        : currentPersonPageStepET2 === "einkommenAngaben"
    ) {
      const routingStatus = handleEinkommenRouting(true);
      if (routingStatus === "einkommenRoutingBeendet") {
        if (elternteil === Elternteil.Eins) {
          setCurrentPersonPageStepET1(lastStep);
        } else {
          setCurrentPersonPageStepET2(lastStep);
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      if (elternteil === Elternteil.Eins) {
        setCurrentPersonPageStepET1(lastStep);
      } else {
        setCurrentPersonPageStepET2(lastStep);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  function handleSubmit(
    state: StepPrototypState,
    antragsstellende?: Antragstellende,
    flow?: PersonPageFlow,
    hasAusklammerungsgrund?: boolean,
    auszuklammerndeZeitraeume?: Ausklammerung[],
    hasWeitereTaetigkeiten?: YesNo | null,
    taetigkeitenRouting?: EinkommenAngabenStep[],
  ) {
    console.log(state);

    if (flow) {
      if (elternteil === Elternteil.Eins) {
        setCurrentPersonPageFlowET1(flow);
      } else {
        setCurrentPersonPageFlowET2(flow);
      }
    }
    if (hasAusklammerungsgrund !== undefined) {
      if (elternteil === Elternteil.Eins) {
        setHasAusklammerungsgrundET1(hasAusklammerungsgrund);
      } else {
        setHasAusklammerungsgrundET2(hasAusklammerungsgrund);
      }
      if (hasAusklammerungsgrund === false) {
        if (elternteil === Elternteil.Eins) {
          setAuszuklammerndeZeitraeumeET1(undefined);
        } else {
          setAuszuklammerndeZeitraeumeET2(undefined);
        }
      }
    }
    if (auszuklammerndeZeitraeume) {
      if (elternteil === Elternteil.Eins) {
        setAuszuklammerndeZeitraeumeET1(auszuklammerndeZeitraeume);
      } else {
        setAuszuklammerndeZeitraeumeET2(auszuklammerndeZeitraeume);
      }
    }
    if (hasWeitereTaetigkeiten) {
      if (elternteil === Elternteil.Eins) {
        setHasWeitereTaetigkeitenET1(hasWeitereTaetigkeiten);
      } else {
        setHasWeitereTaetigkeitenET2(hasWeitereTaetigkeiten);
      }
    }
    if (taetigkeitenRouting) {
      if (elternteil === Elternteil.Eins) {
        setEinkommenAngabenStepsET1(taetigkeitenRouting);
        setCurrentEinkommenAngabenStepET1(taetigkeitenRouting[0]!);
      } else {
        setEinkommenAngabenStepsET2(taetigkeitenRouting);
        setCurrentEinkommenAngabenStepET2(taetigkeitenRouting[0]!);
      }
    }

    navigateToNextStep(
      antragsstellende ?? null,
      flow ??
        (elternteil === Elternteil.Eins
          ? currentPersonPageFlowET1
          : currentPersonPageFlowET2),
      hasAusklammerungsgrund,
      hasWeitereTaetigkeiten ?? null,
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleEinkommenRouting(
    backwards?: boolean,
  ): "einkommenRoutingLaeuft" | "einkommenRoutingBeendet" {
    if (elternteil === Elternteil.Eins) {
      const indexOfStep = einkommenAngabenStepsET1.indexOf(
        currentEinkommenAngabenStepET1,
      );
      if (backwards) {
        if (indexOfStep > 0) {
          setCurrentEinkommenAngabenStepET1(
            einkommenAngabenStepsET1[indexOfStep - 1]!,
          );
          return "einkommenRoutingLaeuft";
        } else {
          return "einkommenRoutingBeendet";
        }
      } else {
        if (einkommenAngabenStepsET1.length > indexOfStep + 1) {
          setCurrentEinkommenAngabenStepET1(
            einkommenAngabenStepsET1[indexOfStep + 1]!,
          );
          return "einkommenRoutingLaeuft";
        } else {
          return "einkommenRoutingBeendet";
        }
      }
    } else {
      const indexOfStep = einkommenAngabenStepsET2.indexOf(
        currentEinkommenAngabenStepET2,
      );
      if (backwards) {
        if (indexOfStep > 0) {
          setCurrentEinkommenAngabenStepET2(
            einkommenAngabenStepsET2[indexOfStep - 1]!,
          );
          return "einkommenRoutingLaeuft";
        } else {
          return "einkommenRoutingBeendet";
        }
      } else {
        if (einkommenAngabenStepsET2.length > indexOfStep + 1) {
          setCurrentEinkommenAngabenStepET2(
            einkommenAngabenStepsET2[indexOfStep + 1]!,
          );
          return "einkommenRoutingLaeuft";
        } else {
          return "einkommenRoutingBeendet";
        }
      }
    }
  }

  const elternteilNames = useAppSelector(
    stepPrototypSelectors.getElternteilNames,
  );

  const customHeading = () => {
    if (
      elternteil === Elternteil.Eins &&
      currentPersonPageStepET1 === "angabenPerson"
    ) {
      return undefined;
    } else if (
      elternteil === Elternteil.Zwei &&
      currentPersonPageStepET2 == "angabenPerson"
    ) {
      return "Sollen beide Elternteile Elterngeld bekommen?";
    } else if (
      elternteil === Elternteil.Eins
        ? currentPersonPageStepET1 === "einkommenAngaben"
        : currentPersonPageStepET2 === "einkommenAngaben"
    ) {
      if (elternteil === Elternteil.Eins) {
        if (einkommenAngabenStepsET1.length === 1) {
          return "Einkommen";
        } else {
          return `Einkommen ${currentEinkommenAngabenStepET1.taetigkeitIndex + 1}`;
        }
      } else {
        if (einkommenAngabenStepsET2.length === 1) {
          return "Einkommen";
        } else {
          return `Einkommen ${currentEinkommenAngabenStepET2.taetigkeitIndex + 1}`;
        }
      }
    }
    return `Einkommensdaten ${elternteil === Elternteil.Eins ? elternteilNames.ET1 : elternteilNames.ET2}`;
  };

  const navigationDetails = "";

  return (
    <Page
      step={
        elternteil === Elternteil.Eins ? formSteps.person1 : formSteps.person2
      }
      customHeading={customHeading()}
      navigationDetails={navigationDetails}
    >
      <div className="flex flex-col gap-40">
        {(elternteil === Elternteil.Eins
          ? currentPersonPageStepET1
          : currentPersonPageStepET2) === "angabenPerson" && (
          <AngabenPersonForm
            id={formIdentifier}
            onSubmit={handleSubmit}
            hideSubmitButton
            elternteil={elternteil}
          />
        )}

        {(elternteil === Elternteil.Eins
          ? currentPersonPageStepET1
          : currentPersonPageStepET2) === "einkommenArt" && (
          <TaetigkeitenForm
            id={formIdentifier}
            onSubmit={handleSubmit}
            hideSubmitButton
            elternteil={elternteil}
          />
        )}

        {(elternteil === Elternteil.Eins
          ? currentPersonPageStepET1
          : currentPersonPageStepET2) === "zeitraumKeinEinkommen" && (
          <KeinEinkommenForm
            id={formIdentifier}
            onSubmit={handleSubmit}
            hideSubmitButton
            elternteil={elternteil}
            flow={
              elternteil === Elternteil.Eins
                ? currentPersonPageFlowET1
                : currentPersonPageFlowET2
            }
            pageType="zeitraumKeinEinkommen"
          />
        )}

        {(elternteil === Elternteil.Eins
          ? currentPersonPageStepET1
          : currentPersonPageStepET2) === "zeitraumErsatzleistungen" && (
          <KeinEinkommenForm
            id={formIdentifier}
            onSubmit={handleSubmit}
            hideSubmitButton
            elternteil={elternteil}
            flow={
              elternteil === Elternteil.Eins
                ? currentPersonPageFlowET1
                : currentPersonPageFlowET2
            }
            pageType="zeitraumErsatzleistungen"
          />
        )}

        {(elternteil === Elternteil.Eins
          ? currentPersonPageStepET1
          : currentPersonPageStepET2) === "ausklammerungGruende" && (
          <AusklammerungsGruendeForm
            id={formIdentifier}
            onSubmit={handleSubmit}
            hideSubmitButton
            elternteil={elternteil}
            flow={
              elternteil === Elternteil.Eins
                ? currentPersonPageFlowET1
                : currentPersonPageFlowET2
            }
          />
        )}

        {(elternteil === Elternteil.Eins
          ? currentPersonPageStepET1
          : currentPersonPageStepET2) === "ausklammerungZeiten" && (
          <AusklammerungsZeitenForm
            id={formIdentifier}
            onSubmit={handleSubmit}
            hideSubmitButton
            elternteil={elternteil}
            flow={
              elternteil === Elternteil.Eins
                ? currentPersonPageFlowET1
                : currentPersonPageFlowET2
            }
            // hasAusklammerungsgrund={elternteil === Elternteil.Eins ? hasAusklammerungsgrundET1 : hasAusklammerungsgrundET2}
          />
        )}

        {(elternteil === Elternteil.Eins
          ? currentPersonPageStepET1
          : currentPersonPageStepET2) === "bmz" && (
          <Bemessungszeitraum
            id={formIdentifier}
            onSubmit={handleSubmit}
            hideSubmitButton
            elternteil={elternteil}
            flow={
              elternteil === Elternteil.Eins
                ? currentPersonPageFlowET1
                : currentPersonPageFlowET2
            }
            // hasAusklammerungsgrund={elternteil === Elternteil.Eins ? hasAusklammerungsgrundET1 : hasAusklammerungsgrundET2}
            auszuklammerndeZeitraeume={
              elternteil === Elternteil.Eins
                ? auszuklammerndeZeitraeumeET1
                : auszuklammerndeZeitraeumeET2
            }
          />
        )}

        {(elternteil === Elternteil.Eins
          ? currentPersonPageStepET1
          : currentPersonPageStepET2) === "anzahlTaetigkeiten" && (
          <AnzahlTaetigkeitenForm
            id={formIdentifier}
            onSubmit={handleSubmit}
            hideSubmitButton
            elternteil={elternteil}
            flow={
              elternteil === Elternteil.Eins
                ? currentPersonPageFlowET1
                : currentPersonPageFlowET2
            }
            // hasAusklammerungsgrund={elternteil === Elternteil.Eins ? hasAusklammerungsgrundET1 : hasAusklammerungsgrundET2}
            auszuklammerndeZeitraeume={
              elternteil === Elternteil.Eins
                ? auszuklammerndeZeitraeumeET1
                : auszuklammerndeZeitraeumeET2
            }
          />
        )}

        {(elternteil === Elternteil.Eins
          ? currentPersonPageStepET1
          : currentPersonPageStepET2) === "uebersichtTaetigkeiten" && (
          <UebersichtTaetigkeitenForm
            id={formIdentifier}
            onSubmit={handleSubmit}
            hideSubmitButton
            elternteil={elternteil}
            flow={
              elternteil === Elternteil.Eins
                ? currentPersonPageFlowET1
                : currentPersonPageFlowET2
            }
            // hasAusklammerungsgrund={elternteil === Elternteil.Eins ? hasAusklammerungsgrundET1 : hasAusklammerungsgrundET2}
            auszuklammerndeZeitraeume={
              elternteil === Elternteil.Eins
                ? auszuklammerndeZeitraeumeET1
                : auszuklammerndeZeitraeumeET2
            }
          />
        )}

        {(elternteil === Elternteil.Eins
          ? currentPersonPageStepET1
          : currentPersonPageStepET2) === "einkommenAngaben" && (
          <EinkommenAngabenForm
            id={formIdentifier}
            onSubmit={handleSubmit}
            hideSubmitButton
            elternteil={elternteil}
            flow={
              elternteil === Elternteil.Eins
                ? currentPersonPageFlowET1
                : currentPersonPageFlowET2
            }
            // hasAusklammerungsgrund={elternteil === Elternteil.Eins ? hasAusklammerungsgrundET1 : hasAusklammerungsgrundET2}
            auszuklammerndeZeitraeume={
              elternteil === Elternteil.Eins
                ? auszuklammerndeZeitraeumeET1
                : auszuklammerndeZeitraeumeET2
            }
            einkommenAngabenStep={
              elternteil === Elternteil.Eins
                ? currentEinkommenAngabenStepET1
                : currentEinkommenAngabenStepET2
            }
          />
        )}

        <div className="flex gap-16">
          <Button
            type="button"
            buttonStyle="secondary"
            onClick={navigateToLastStep}
          >
            Zurück
          </Button>

          <Button type="submit" form={formIdentifier}>
            {(elternteil === Elternteil.Eins
              ? currentPersonPageStepET1
              : currentPersonPageStepET2) === "bmz"
              ? "Verstanden und weiter"
              : "Weiter"}
          </Button>
        </div>
      </div>
    </Page>
  );
}
