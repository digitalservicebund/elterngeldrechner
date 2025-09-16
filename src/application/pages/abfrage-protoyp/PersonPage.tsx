import { useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/application/components";
import { Page } from "@/application/pages/Page";
import { formSteps } from "@/application/routing/formSteps";
import {
  AusklammerungsGruendeForm,
  AusklammerungsZeitenForm,
  Bemessungszeitraum,
  KeinEinkommenForm,
  PersonForm,
  TaetigkeitenForm,
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

  const navigate = useNavigate();
  const navigateToFamiliePage = () => navigate(formSteps.familie.route);
  const navigateToNextStep = (
    flow: PersonPageFlow | undefined,
    hasAusklammerungsgrund: boolean | undefined,
  ) => {
    const nextStep = getNextStep(
      currentPersonPageStep,
      flow,
      hasAusklammerungsgrund,
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
    } else {
      const lastStep = getLastStep(
        currentPersonPageStep,
        currentPersonPageFlow,
        hasAusklammerungsgrund,
      );
      setCurrentPersonPageStep(lastStep);
    }
  };

  function handleSubmit(
    _: StepPrototypState,
    flow?: PersonPageFlow,
    hasAusklammerungsgrund?: boolean,
    auszuklammerndeZeitraeume?: Ausklammerung[],
  ) {
    if (flow) {
      setCurrentPersonPageFlow(flow);
    }
    if (hasAusklammerungsgrund) {
      setHasAusklammerungsgrund(hasAusklammerungsgrund);
    }
    if (auszuklammerndeZeitraeume?.length) {
      setAuszuklammerndeZeitraeume(auszuklammerndeZeitraeume);
    }
    setTimeout(() =>
      navigateToNextStep(flow ?? currentPersonPageFlow, hasAusklammerungsgrund),
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
      <div className="flex flex-col gap-56">
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

        <div className="flex gap-16">
          <Button
            type="button"
            buttonStyle="secondary"
            onClick={navigateToLastStep}
          >
            Zurück
          </Button>

          <Button type="submit" form={formIdentifier}>
            Weiter
          </Button>
        </div>
      </div>
    </Page>
  );
}
