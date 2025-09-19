import { useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/application/components";
import { Page } from "@/application/pages/Page";
import { formSteps } from "@/application/routing/formSteps";
import {
  AnzahlTaetigkeitenForm,
  AusklammerungsGruendeForm,
  AusklammerungsZeitenForm,
  Bemessungszeitraum,
  EinkommenAngabenForm,
  KeinEinkommenForm,
  PersonForm,
  TaetigkeitenForm,
  UebersichtTaetigkeitenForm,
} from "@/application/features/abfrage-prototyp";
import { Elternteil } from "@/monatsplaner";
import {
  getLastStep,
  getNextStep,
  PersonPageFlow,
  PersonPageStepKey,
} from "@/application/features/abfrage-prototyp/components/PersonPageRouting";
import {
  stepPrototypSelectors,
  StepPrototypState,
} from "@/application/features/abfrage-prototyp/state";
import { useAppSelector } from "@/application/redux/hooks";
import { Ausklammerung } from "@/application/features/abfrage-prototyp/components/berechneBemessungszeitraum";
import { YesNo } from "@/application/features/abfrageteil/state";

type Props = {
  elternteil: Elternteil;
};

export function PersonPage({ elternteil }: Props) {
  const formIdentifier = useId();

  const [currentPersonPageStep, setCurrentPersonPageStep] =
    useState<PersonPageStepKey>("angabenPerson");
  const [currentPersonPageFlow, setCurrentPersonPageFlow] =
    useState<PersonPageFlow>();
  const [hasAusklammerungsgrund, setHasAusklammerungsgrund] =
    useState<boolean>(false);
  const [auszuklammerndeZeitraeume, setAuszuklammerndeZeitraeume] =
    useState<Ausklammerung[]>();
  const [hasMehrereTaetigkeiten, setHasMehrereTaetigkeiten] =
    useState<YesNo | null>(null);

  const navigate = useNavigate();
  const navigateToFamiliePage = () => navigate(formSteps.familie.route);
  const navigateToNextStep = (
    flow: PersonPageFlow | undefined,
    hasAusklammerungsgrund: boolean | undefined,
    hasMehrereTaetigkeiten: YesNo | null,
  ) => {
    const nextStep = getNextStep(
      currentPersonPageStep,
      flow,
      hasAusklammerungsgrund,
      hasMehrereTaetigkeiten,
    );
    if (nextStep === "routingEnded") {
      console.log("Routing beendet - Übergang zum Figma Prototypen");
      // navigateToFamiliePage()
    } else {
      setCurrentPersonPageStep(nextStep);
    }
  };
  const navigateToLastStep = () => {
    if (currentPersonPageStep === "angabenPerson") {
      navigateToFamiliePage();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      console.log(hasAusklammerungsgrund);
      const lastStep = getLastStep(
        currentPersonPageStep,
        currentPersonPageFlow,
        hasAusklammerungsgrund,
        hasMehrereTaetigkeiten,
      );
      setCurrentPersonPageStep(lastStep);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  function handleSubmit(
    _: StepPrototypState,
    flow?: PersonPageFlow,
    hasAusklammerungsgrund?: boolean,
    auszuklammerndeZeitraeume?: Ausklammerung[],
    hasMehrereTaetigkeiten?: YesNo | null,
  ) {
    if (flow) {
      setCurrentPersonPageFlow(flow);
    }
    if (hasAusklammerungsgrund !== undefined) {
      setHasAusklammerungsgrund(hasAusklammerungsgrund);
      if (hasAusklammerungsgrund === false) {
        setAuszuklammerndeZeitraeume(undefined);
      }
    }
    if (auszuklammerndeZeitraeume) {
      setAuszuklammerndeZeitraeume(auszuklammerndeZeitraeume);
    }
    if (hasMehrereTaetigkeiten) {
      setHasMehrereTaetigkeiten(hasMehrereTaetigkeiten);
    }

    navigateToNextStep(
      flow ?? currentPersonPageFlow,
      hasAusklammerungsgrund,
      hasMehrereTaetigkeiten ?? null,
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const elternteilNames = useAppSelector(
    stepPrototypSelectors.getElternteilNames,
  );

  const customHeading = () => {
    if (currentPersonPageStep === "angabenPerson") {
      return undefined;
    }
    return `3. Einkommensdaten ${elternteilNames.ET1}`;
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
        {currentPersonPageStep === "angabenPerson" && (
          <PersonForm
            id={formIdentifier}
            onSubmit={handleSubmit}
            hideSubmitButton
            elternteil={elternteil}
          />
        )}

        {currentPersonPageStep === "einkommenArt" && (
          <TaetigkeitenForm
            id={formIdentifier}
            onSubmit={handleSubmit}
            hideSubmitButton
            elternteil={elternteil}
          />
        )}

        {currentPersonPageStep === "zeitraumKeinEinkommen" && (
          <KeinEinkommenForm
            id={formIdentifier}
            onSubmit={handleSubmit}
            hideSubmitButton
            elternteil={elternteil}
            flow={currentPersonPageFlow}
            pageType="zeitraumKeinEinkommen"
          />
        )}

        {currentPersonPageStep === "zeitraumErsatzleistungen" && (
          <KeinEinkommenForm
            id={formIdentifier}
            onSubmit={handleSubmit}
            hideSubmitButton
            elternteil={elternteil}
            flow={currentPersonPageFlow}
            pageType="zeitraumErsatzleistungen"
          />
        )}

        {currentPersonPageStep === "ausklammerungGruende" && (
          <AusklammerungsGruendeForm
            id={formIdentifier}
            onSubmit={handleSubmit}
            hideSubmitButton
            elternteil={elternteil}
            flow={currentPersonPageFlow}
          />
        )}

        {currentPersonPageStep === "ausklammerungZeiten" && (
          <AusklammerungsZeitenForm
            id={formIdentifier}
            onSubmit={handleSubmit}
            hideSubmitButton
            elternteil={elternteil}
            flow={currentPersonPageFlow}
            hasAusklammerungsgrund={hasAusklammerungsgrund}
          />
        )}

        {currentPersonPageStep === "bmz" && (
          <Bemessungszeitraum
            id={formIdentifier}
            onSubmit={handleSubmit}
            hideSubmitButton
            elternteil={elternteil}
            flow={currentPersonPageFlow}
            hasAusklammerungsgrund={hasAusklammerungsgrund}
            auszuklammerndeZeitraeume={auszuklammerndeZeitraeume}
          />
        )}

        {currentPersonPageStep === "anzahlTaetigkeiten" && (
          <AnzahlTaetigkeitenForm
            id={formIdentifier}
            onSubmit={handleSubmit}
            hideSubmitButton
            elternteil={elternteil}
            flow={currentPersonPageFlow}
            hasAusklammerungsgrund={hasAusklammerungsgrund}
            auszuklammerndeZeitraeume={auszuklammerndeZeitraeume}
          />
        )}

        {currentPersonPageStep === "uebersichtTaetigkeiten" && (
          <UebersichtTaetigkeitenForm
            id={formIdentifier}
            onSubmit={handleSubmit}
            hideSubmitButton
            elternteil={elternteil}
            flow={currentPersonPageFlow}
            hasAusklammerungsgrund={hasAusklammerungsgrund}
            auszuklammerndeZeitraeume={auszuklammerndeZeitraeume}
          />
        )}

        {currentPersonPageStep === "einkommenAngaben" && (
          <EinkommenAngabenForm
            id={formIdentifier}
            onSubmit={handleSubmit}
            hideSubmitButton
            elternteil={elternteil}
            flow={currentPersonPageFlow}
            hasAusklammerungsgrund={hasAusklammerungsgrund}
            auszuklammerndeZeitraeume={auszuklammerndeZeitraeume}
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
            {currentPersonPageStep === "bmz"
              ? "Verstanden und weiter"
              : "Weiter"}
          </Button>
        </div>
      </div>
    </Page>
  );
}
