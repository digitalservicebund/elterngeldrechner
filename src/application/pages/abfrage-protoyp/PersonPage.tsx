import { useId } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/application/components";
import {
  AngabenPersonForm,
  AusklammerungsGruendeForm,
  AusklammerungsZeitenForm,
} from "@/application/features/abfrage-prototyp";
import { AbfrageTaetigkeitenForm } from "@/application/features/abfrage-prototyp/components/PersonPage/AbfrageTaetigkeitenForm";
import { DetailsAngestelltForm } from "@/application/features/abfrage-prototyp/components/PersonPage/DetailsAngestelltForm";
import { DetailsTaetigkeitForm } from "@/application/features/abfrage-prototyp/components/PersonPage/DetailsTaetigkeitForm";
import { EingabeEinkommenForm } from "@/application/features/abfrage-prototyp/components/PersonPage/EingabeEinkommenForm";
import { WeitereTaetigkeitArtForm } from "@/application/features/abfrage-prototyp/components/PersonPage/WeitereTaetigkeitArtForm";
import { WeitereTaetigkeitForm } from "@/application/features/abfrage-prototyp/components/PersonPage/WeitereTaetigkeitForm";
import { customPersonPageHeading } from "@/application/features/abfrage-prototyp/components/PersonPage/utils/customHeading";
import { getDefaultTaetigkeiten } from "@/application/features/abfrage-prototyp/components/PersonPage/utils/getDefaultTaetigkeiten";
import { getPersonPageFlow } from "@/application/features/abfrage-prototyp/components/PersonPage/utils/personPageFlow";
import { personPageRouter } from "@/application/features/abfrage-prototyp/components/PersonPage/utils/personPageRouter";
import { PersonPageFlow } from "@/application/features/abfrage-prototyp/components/PersonPageRouting";
import {
  StepPrototypState,
  stepPrototypSelectors,
} from "@/application/features/abfrage-prototyp/state";
import {
  PersonPageRoutes,
  RoutingPrototypState,
  routingPrototypSlice,
} from "@/application/features/abfrage-prototyp/state/routingPrototypSlice";
import {
  TaetigkeitenSelektor,
  stepPrototypSlice,
} from "@/application/features/abfrage-prototyp/state/stepPrototypSlice";
import { YesNo } from "@/application/features/abfrageteil/state";
import { Page } from "@/application/pages/Page";
import { RootState } from "@/application/redux";
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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formIdentifier = useId();

  const alleinerziehend = useAppSelector(
    stepPrototypSelectors.getAlleinerziehend,
  );
  const currentAntragsstellende = useAppSelector(
    stepPrototypSelectors.getAntragssteller,
  );
  const elternteilNames = useAppSelector(
    stepPrototypSelectors.getElternteilNames,
  );
  const hasAusklammerungsgrundET1 = useAppSelector(
    stepPrototypSelectors.getHasAusklammerungET1,
  );
  const hasAusklammerungsgrundET2 = useAppSelector(
    stepPrototypSelectors.getHasAusklammerungET2,
  );

  const routerState = useSelector((state: RootState) => state.routingPrototyp);
  const currentPersonPageRoute =
    elternteil === Elternteil.Eins
      ? routerState.currentPersonPageRouteET1
      : routerState.currentPersonPageRouteET2;
  const currentPersonPageFlow =
    elternteil === Elternteil.Eins
      ? routerState.currentPersonPageFlowET1
      : routerState.currentPersonPageFlowET2;
  const currentPersonPageIncomeIndex =
    elternteil === Elternteil.Eins
      ? routerState.currentPersonPageIncomeIndexET1
      : routerState.currentPersonPageIncomeIndexET2;
  const hasKeinEinkommen =
    currentPersonPageFlow === PersonPageFlow.keinEinkommen ||
    currentPersonPageFlow === PersonPageFlow.sozialleistungen ||
    currentPersonPageFlow === PersonPageFlow.sozialleistungenKeinEinkommen ||
    currentPersonPageFlow === PersonPageFlow.nichtSelbststaendigKeinEinkommen ||
    currentPersonPageFlow ===
      PersonPageFlow.nichtSelbststaendigErsatzleistungen ||
    currentPersonPageFlow === PersonPageFlow.nichtSelbststaendigBeides;

  const taetigkeitenET1 = useAppSelector(
    stepPrototypSelectors.getTaetigkeitenET1,
  );
  const taetigkeitenET2 = useAppSelector(
    stepPrototypSelectors.getTaetigkeitenET2,
  );
  const taetigkeiten =
    elternteil === Elternteil.Eins ? taetigkeitenET1 : taetigkeitenET2;

  // Forward Routing

  const onForwardRouting = (values: StepPrototypState) => {
    const antragstellende = values.antragstellende;
    const hasAusklammerungsgrund =
      elternteil === Elternteil.Eins
        ? values.ET1.hasMutterschutzAnderesKind ||
          values.ET1.hasElterngeldAnderesKind ||
          values.ET1.hasErkrankung
        : values.ET2.hasMutterschutzAnderesKind ||
          values.ET2.hasElterngeldAnderesKind ||
          values.ET2.hasErkrankung;
    const flow =
      elternteil === Elternteil.Eins
        ? getPersonPageFlow(
            values.ET1.isSelbststaendig,
            values.ET1.isNichtSelbststaendig,
            values.ET1.hasKeinEinkommen,
            values.ET1.hasSozialleistungen,
          )
        : getPersonPageFlow(
            values.ET2.isSelbststaendig,
            values.ET2.isNichtSelbststaendig,
            values.ET2.hasKeinEinkommen,
            values.ET2.hasSozialleistungen,
          );
    const uebersichtTaetigkeitenET1 = values.ET1.uebersichtTaetigkeiten;
    const uebersichtTaetigkeitenET2 = values.ET2.uebersichtTaetigkeiten;
    const uebersichtTaetigkeiten =
      elternteil === Elternteil.Eins
        ? uebersichtTaetigkeitenET1
        : uebersichtTaetigkeitenET2;
    const hasWeitereTaetigkeit =
      uebersichtTaetigkeiten[currentPersonPageIncomeIndex]?.isActive !==
      YesNo.NO;

    if (flow !== currentPersonPageFlow) {
      const { uebersichtTaetigkeiten, taetigkeiten } =
        getDefaultTaetigkeiten(flow);

      const data: StepPrototypState = {
        ...values,
        ET1: {
          ...values.ET1,
          taetigkeiten:
            elternteil === Elternteil.Eins
              ? taetigkeiten
              : values.ET1.taetigkeiten,
          uebersichtTaetigkeiten:
            elternteil === Elternteil.Eins
              ? uebersichtTaetigkeiten
              : values.ET1.uebersichtTaetigkeiten,
        },
        ET2: {
          ...values.ET2,
          taetigkeiten:
            elternteil === Elternteil.Zwei
              ? taetigkeiten
              : values.ET2.taetigkeiten,
          uebersichtTaetigkeiten:
            elternteil === Elternteil.Zwei
              ? uebersichtTaetigkeiten
              : values.ET2.uebersichtTaetigkeiten,
        },
      };
      dispatch(stepPrototypSlice.actions.submitStep(data));
    }

    const { routingZuNaechstemFormStep, naechstePersonPageRoute } =
      personPageRouter(
        "forward",
        currentPersonPageRoute,
        elternteil,
        antragstellende,
        hasAusklammerungsgrund,
        hasKeinEinkommen,
        uebersichtTaetigkeiten[currentPersonPageIncomeIndex]
          ?.taetigkeitenSelektor === "selbststaendig",
        hasWeitereTaetigkeit,
        flow === PersonPageFlow.mischeinkuenfte ||
          flow === PersonPageFlow.selbststaendig,
        flow === PersonPageFlow.mischeinkuenfte &&
          currentPersonPageIncomeIndex === 0,
      );

    if (routingZuNaechstemFormStep) {
      if (alleinerziehend === YesNo.YES || elternteil === Elternteil.Zwei) {
        void navigate(formSteps.beispiele.route);
      } else {
        const data: RoutingPrototypState = {
          ...routerState,
          currentPersonPageRouteET2: PersonPageRoutes.ANGABEN_PERSON,
          currentPersonPageIncomeIndexET2: 0,
        };
        dispatch(routingPrototypSlice.actions.submitRouting(data));

        void navigate(formSteps.person2.route);
      }
    }

    if (naechstePersonPageRoute !== undefined) {
      const data: RoutingPrototypState = {
        ...routerState,
        currentPersonPageRouteET1:
          elternteil === Elternteil.Eins
            ? naechstePersonPageRoute
            : routerState.currentPersonPageRouteET1,
        currentPersonPageFlowET1:
          elternteil === Elternteil.Eins
            ? flow
            : routerState.currentPersonPageFlowET1,
        currentPersonPageIncomeIndexET1:
          elternteil === Elternteil.Eins &&
          (naechstePersonPageRoute === PersonPageRoutes.WEITERE_TAETIGKEIT ||
            (currentPersonPageRoute === PersonPageRoutes.DETAILS_TAETIGKEIT &&
              flow === PersonPageFlow.mischeinkuenfte &&
              currentPersonPageIncomeIndex === 0))
            ? currentPersonPageIncomeIndex + 1
            : routerState.currentPersonPageIncomeIndexET1,
        currentPersonPageRouteET2:
          elternteil === Elternteil.Zwei
            ? naechstePersonPageRoute
            : routerState.currentPersonPageRouteET2,
        currentPersonPageFlowET2:
          elternteil === Elternteil.Zwei
            ? flow
            : routerState.currentPersonPageFlowET2,
        currentPersonPageIncomeIndexET2:
          elternteil === Elternteil.Zwei &&
          (naechstePersonPageRoute === PersonPageRoutes.WEITERE_TAETIGKEIT ||
            (currentPersonPageRoute === PersonPageRoutes.DETAILS_TAETIGKEIT &&
              flow === PersonPageFlow.mischeinkuenfte &&
              currentPersonPageIncomeIndex === 0))
            ? currentPersonPageIncomeIndex + 1
            : routerState.currentPersonPageIncomeIndexET2,
      };
      dispatch(routingPrototypSlice.actions.submitRouting(data));
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Backward Routing

  const onBackwardRouting = () => {
    const { routingZuNaechstemFormStep, naechstePersonPageRoute } =
      personPageRouter(
        "backward",
        currentPersonPageRoute,
        elternteil,
        currentAntragsstellende,
        elternteil === Elternteil.Eins
          ? hasAusklammerungsgrundET1
          : hasAusklammerungsgrundET2,
        hasKeinEinkommen,
        taetigkeiten[currentPersonPageIncomeIndex - 1]?.taetigkeitenArt ===
          "selbststaendig",
        currentPersonPageIncomeIndex > 0,
        currentPersonPageFlow === PersonPageFlow.mischeinkuenfte ||
          currentPersonPageFlow === PersonPageFlow.selbststaendig,
        currentPersonPageFlow === PersonPageFlow.mischeinkuenfte &&
          currentPersonPageIncomeIndex === 1,
      );

    if (routingZuNaechstemFormStep) {
      if (elternteil === Elternteil.Zwei) {
        void navigate(formSteps.person1.route);
      } else {
        void navigate(formSteps.geschwister.route);
      }
    }

    if (naechstePersonPageRoute !== undefined) {
      const data: RoutingPrototypState = {
        ...routerState,
        currentPersonPageRouteET1:
          elternteil === Elternteil.Eins
            ? naechstePersonPageRoute
            : routerState.currentPersonPageRouteET1,
        currentPersonPageIncomeIndexET1:
          elternteil === Elternteil.Eins &&
          (currentPersonPageRoute === PersonPageRoutes.WEITERE_TAETIGKEIT ||
            (currentPersonPageFlow === PersonPageFlow.mischeinkuenfte &&
              currentPersonPageIncomeIndex === 1))
            ? currentPersonPageIncomeIndex - 1
            : routerState.currentPersonPageIncomeIndexET1,
        currentPersonPageRouteET2:
          elternteil === Elternteil.Zwei
            ? naechstePersonPageRoute
            : routerState.currentPersonPageRouteET2,
        currentPersonPageIncomeIndexET2:
          elternteil === Elternteil.Zwei &&
          (currentPersonPageRoute === PersonPageRoutes.WEITERE_TAETIGKEIT ||
            (currentPersonPageFlow === PersonPageFlow.mischeinkuenfte &&
              currentPersonPageIncomeIndex === 1))
            ? currentPersonPageIncomeIndex - 1
            : routerState.currentPersonPageIncomeIndexET2,
      };
      dispatch(routingPrototypSlice.actions.submitRouting(data));
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // const [currentPersonPageStepET1, setCurrentPersonPageStepET1] =
  //   useState<PersonPageStepKey>("angabenPerson");
  // const [currentPersonPageStepET2, setCurrentPersonPageStepET2] =
  //   useState<PersonPageStepKey>("angabenPerson");
  // const [currentPersonPageFlowET1, setCurrentPersonPageFlowET1] =
  //   useState<PersonPageFlow>();
  // const [currentPersonPageFlowET2, setCurrentPersonPageFlowET2] =
  //   useState<PersonPageFlow>();
  // const [hasAusklammerungsgrundET1, setHasAusklammerungsgrundET1] =
  //   useState<boolean>(false);
  // const [hasAusklammerungsgrundET2, setHasAusklammerungsgrundET2] =
  //   useState<boolean>(false);
  // const [auszuklammerndeZeitraeumeET1, setAuszuklammerndeZeitraeumeET1] =
  //   useState<Ausklammerung[]>();
  // const [auszuklammerndeZeitraeumeET2, setAuszuklammerndeZeitraeumeET2] =
  //   useState<Ausklammerung[]>();
  // const [hasWeitereTaetigkeitenET1, setHasWeitereTaetigkeitenET1] =
  //   useState<YesNo | null>(null);
  // const [hasWeitereTaetigkeitenET2, setHasWeitereTaetigkeitenET2] =
  //   useState<YesNo | null>(null);
  // const [einkommenAngabenStepsET1, setEinkommenAngabenStepsET1] = useState<
  //   EinkommenAngabenStep[]
  // >([]);
  // const [einkommenAngabenStepsET2, setEinkommenAngabenStepsET2] = useState<
  //   EinkommenAngabenStep[]
  // >([]);
  // const [currentEinkommenAngabenStepET1, setCurrentEinkommenAngabenStepET1] =
  //   useState<EinkommenAngabenStep>({
  //     taetigkeitIndex: 0,
  //     taetigkeitArt: null,
  //   });
  // const [currentEinkommenAngabenStepET2, setCurrentEinkommenAngabenStepET2] =
  //   useState<EinkommenAngabenStep>({
  //     taetigkeitIndex: 0,
  //     taetigkeitArt: null,
  //   });

  // const navigateToNextStep = (
  //   antragstellende: Antragstellende | null,
  //   flow: PersonPageFlow | undefined,
  //   hasAusklammerungsgrund: boolean | undefined,
  //   hasWeitereTaetigkeiten: YesNo | null,
  //   // taetigkeiten?: TaetigkeitAngaben[],
  // ) => {
  //   const nextStep = getNextStep(
  //     elternteil,
  //     elternteil === Elternteil.Eins
  //       ? currentPersonPageStepET1
  //       : currentPersonPageStepET2,
  //     flow,
  //     hasAusklammerungsgrund,
  //     hasWeitereTaetigkeiten,
  //     antragstellende,
  //   );
  //   if (nextStep === "einkommenAngaben") {
  //     if (elternteil === Elternteil.Eins) {
  //       setCurrentPersonPageStepET1("einkommenAngaben");
  //     } else {
  //       setCurrentPersonPageStepET2("einkommenAngaben");
  //     }
  //   } else if (
  //     elternteil === Elternteil.Eins
  //       ? currentPersonPageStepET1 === "einkommenAngaben"
  //       : currentPersonPageStepET2 === "einkommenAngaben"
  //   ) {
  //     const routingStatus = handleEinkommenRouting();
  //     if (routingStatus === "einkommenRoutingBeendet") {
  //       // if (alleinerziehend === YesNo.YES || elternteil === Elternteil.Zwei) {
  //       //   navigate(formSteps.beispiele.route);
  //       // } else {
  //       //   navigate(formSteps.person2.route);
  //       // }
  //     }
  //   } else if (nextStep === "routingEnded") {
  //     // if (alleinerziehend === YesNo.YES || elternteil === Elternteil.Zwei) {
  //     //   navigate(formSteps.beispiele.route);
  //     // } else {
  //     //   navigate(formSteps.person2.route);
  //     // }
  //   } else {
  //     if (elternteil === Elternteil.Eins) {
  //       setCurrentPersonPageStepET1(nextStep);
  //     } else {
  //       setCurrentPersonPageStepET2(nextStep);
  //     }
  //   }
  // };

  // const navigateToLastStep = () => {
  //   const lastStep = getLastStep(
  //     elternteil === Elternteil.Eins
  //       ? currentPersonPageStepET1
  //       : currentPersonPageStepET2,
  //     elternteil === Elternteil.Eins
  //       ? currentPersonPageFlowET1
  //       : currentPersonPageFlowET2,
  //     elternteil === Elternteil.Eins
  //       ? hasAusklammerungsgrundET1
  //       : hasAusklammerungsgrundET2,
  //     elternteil === Elternteil.Eins
  //       ? hasWeitereTaetigkeitenET1
  //       : hasWeitereTaetigkeitenET2,
  //   );

  //   if (
  //     elternteil === Elternteil.Eins &&
  //     currentPersonPageStepET1 === "angabenPerson"
  //   ) {
  //     navigate(formSteps.familie.route);
  //     window.scrollTo({ top: 0, behavior: "smooth" });
  //   } else if (
  //     elternteil === Elternteil.Zwei &&
  //     currentPersonPageStepET2 === "angabenPerson"
  //   ) {
  //     navigate(formSteps.person1.route);
  //     window.scrollTo({ top: 0, behavior: "smooth" });
  //   } else if (
  //     elternteil === Elternteil.Eins
  //       ? currentPersonPageStepET1 === "einkommenAngaben"
  //       : currentPersonPageStepET2 === "einkommenAngaben"
  //   ) {
  //     const routingStatus = handleEinkommenRouting(true);
  //     if (routingStatus === "einkommenRoutingBeendet") {
  //       if (elternteil === Elternteil.Eins) {
  //         setCurrentPersonPageStepET1(lastStep);
  //       } else {
  //         setCurrentPersonPageStepET2(lastStep);
  //       }
  //       window.scrollTo({ top: 0, behavior: "smooth" });
  //     }
  //   } else {
  //     if (elternteil === Elternteil.Eins) {
  //       setCurrentPersonPageStepET1(lastStep);
  //     } else {
  //       setCurrentPersonPageStepET2(lastStep);
  //     }
  //     window.scrollTo({ top: 0, behavior: "smooth" });
  //   }
  // };

  // function handleSubmit(
  //   state: StepPrototypState,
  //   antragsstellende?: Antragstellende,
  //   flow?: PersonPageFlow,
  //   hasAusklammerungsgrund?: boolean,
  //   auszuklammerndeZeitraeume?: Ausklammerung[],
  //   hasWeitereTaetigkeiten?: YesNo | null,
  //   taetigkeitenRouting?: EinkommenAngabenStep[],
  // ) {
  //   console.log(state);

  //   if (flow) {
  //     if (elternteil === Elternteil.Eins) {
  //       setCurrentPersonPageFlowET1(flow);
  //     } else {
  //       setCurrentPersonPageFlowET2(flow);
  //     }
  //   }
  //   if (hasAusklammerungsgrund !== undefined) {
  //     if (elternteil === Elternteil.Eins) {
  //       setHasAusklammerungsgrundET1(hasAusklammerungsgrund);
  //     } else {
  //       setHasAusklammerungsgrundET2(hasAusklammerungsgrund);
  //     }
  //     if (hasAusklammerungsgrund === false) {
  //       if (elternteil === Elternteil.Eins) {
  //         setAuszuklammerndeZeitraeumeET1(undefined);
  //       } else {
  //         setAuszuklammerndeZeitraeumeET2(undefined);
  //       }
  //     }
  //   }
  //   if (auszuklammerndeZeitraeume) {
  //     if (elternteil === Elternteil.Eins) {
  //       setAuszuklammerndeZeitraeumeET1(auszuklammerndeZeitraeume);
  //     } else {
  //       setAuszuklammerndeZeitraeumeET2(auszuklammerndeZeitraeume);
  //     }
  //   }
  //   if (hasWeitereTaetigkeiten) {
  //     if (elternteil === Elternteil.Eins) {
  //       setHasWeitereTaetigkeitenET1(hasWeitereTaetigkeiten);
  //     } else {
  //       setHasWeitereTaetigkeitenET2(hasWeitereTaetigkeiten);
  //     }
  //   }
  //   if (taetigkeitenRouting) {
  //     if (elternteil === Elternteil.Eins) {
  //       setEinkommenAngabenStepsET1(taetigkeitenRouting);
  //       setCurrentEinkommenAngabenStepET1(taetigkeitenRouting[0]!);
  //     } else {
  //       setEinkommenAngabenStepsET2(taetigkeitenRouting);
  //       setCurrentEinkommenAngabenStepET2(taetigkeitenRouting[0]!);
  //     }
  //   }

  //   navigateToNextStep(
  //     antragsstellende ?? null,
  //     flow ??
  //       (elternteil === Elternteil.Eins
  //         ? currentPersonPageFlowET1
  //         : currentPersonPageFlowET2),
  //     hasAusklammerungsgrund,
  //     hasWeitereTaetigkeiten ?? null,
  //   );
  //   window.scrollTo({ top: 0, behavior: "smooth" });
  // }

  // function handleEinkommenRouting(
  //   backwards?: boolean,
  // ): "einkommenRoutingLaeuft" | "einkommenRoutingBeendet" {
  //   if (elternteil === Elternteil.Eins) {
  //     const indexOfStep = einkommenAngabenStepsET1.indexOf(
  //       currentEinkommenAngabenStepET1,
  //     );
  //     if (backwards) {
  //       if (indexOfStep > 0) {
  //         setCurrentEinkommenAngabenStepET1(
  //           einkommenAngabenStepsET1[indexOfStep - 1]!,
  //         );
  //         return "einkommenRoutingLaeuft";
  //       } else {
  //         return "einkommenRoutingBeendet";
  //       }
  //     } else {
  //       if (einkommenAngabenStepsET1.length > indexOfStep + 1) {
  //         setCurrentEinkommenAngabenStepET1(
  //           einkommenAngabenStepsET1[indexOfStep + 1]!,
  //         );
  //         return "einkommenRoutingLaeuft";
  //       } else {
  //         return "einkommenRoutingBeendet";
  //       }
  //     }
  //   } else {
  //     const indexOfStep = einkommenAngabenStepsET2.indexOf(
  //       currentEinkommenAngabenStepET2,
  //     );
  //     if (backwards) {
  //       if (indexOfStep > 0) {
  //         setCurrentEinkommenAngabenStepET2(
  //           einkommenAngabenStepsET2[indexOfStep - 1]!,
  //         );
  //         return "einkommenRoutingLaeuft";
  //       } else {
  //         return "einkommenRoutingBeendet";
  //       }
  //     } else {
  //       if (einkommenAngabenStepsET2.length > indexOfStep + 1) {
  //         setCurrentEinkommenAngabenStepET2(
  //           einkommenAngabenStepsET2[indexOfStep + 1]!,
  //         );
  //         return "einkommenRoutingLaeuft";
  //       } else {
  //         return "einkommenRoutingBeendet";
  //       }
  //     }
  //   }
  // }

  const customHeading = customPersonPageHeading(
    elternteil === Elternteil.Eins ? elternteilNames.ET1 : elternteilNames.ET2,
    currentPersonPageRoute,
  );

  return (
    <Page
      step={
        elternteil === Elternteil.Eins ? formSteps.person1 : formSteps.person2
      }
      customHeading={customHeading}
    >
      <div className="flex flex-col gap-40">
        {currentPersonPageRoute === PersonPageRoutes.ANGABEN_PERSON && (
          <AngabenPersonForm
            id={formIdentifier}
            onSubmit={onForwardRouting}
            hideSubmitButton
            elternteil={elternteil}
          />
        )}

        {currentPersonPageRoute === PersonPageRoutes.AUSKLAMMERUNGS_GRUENDE && (
          <AusklammerungsGruendeForm
            id={formIdentifier}
            onSubmit={onForwardRouting}
            hideSubmitButton
            elternteil={elternteil}
          />
        )}

        {currentPersonPageRoute === PersonPageRoutes.AUSKLAMMERUNGS_ZEITEN && (
          <AusklammerungsZeitenForm
            id={formIdentifier}
            onSubmit={onForwardRouting}
            hideSubmitButton
            elternteil={elternteil}
          />
        )}

        {currentPersonPageRoute === PersonPageRoutes.ABFRAGE_TAETIGKEITEN && (
          <AbfrageTaetigkeitenForm
            id={formIdentifier}
            onSubmit={onForwardRouting}
            hideSubmitButton
            elternteil={elternteil}
          />
        )}

        {currentPersonPageRoute === PersonPageRoutes.DETAILS_TAETIGKEIT && (
          <DetailsTaetigkeitForm
            id={formIdentifier}
            onSubmit={onForwardRouting}
            hideSubmitButton
            elternteil={elternteil}
            incomeIndex={currentPersonPageIncomeIndex}
          />
        )}

        {currentPersonPageRoute === PersonPageRoutes.DETAILS_ANGESTELLT && (
          <DetailsAngestelltForm
            id={formIdentifier}
            onSubmit={onForwardRouting}
            hideSubmitButton
            elternteil={elternteil}
            incomeIndex={currentPersonPageIncomeIndex}
          />
        )}

        {currentPersonPageRoute === PersonPageRoutes.EINGABE_EINKOMMEN && (
          <EingabeEinkommenForm
            id={formIdentifier}
            onSubmit={onForwardRouting}
            hideSubmitButton
            elternteil={elternteil}
            incomeIndex={currentPersonPageIncomeIndex}
          />
        )}

        {currentPersonPageRoute === PersonPageRoutes.WEITERE_TAETIGKEIT && (
          <WeitereTaetigkeitForm
            id={formIdentifier}
            onSubmit={onForwardRouting}
            hideSubmitButton
            elternteil={elternteil}
            flow={currentPersonPageFlow}
            incomeIndex={currentPersonPageIncomeIndex}
          />
        )}

        {currentPersonPageRoute === PersonPageRoutes.WEITERE_TAETIGKEIT_ART && (
          <WeitereTaetigkeitArtForm
            id={formIdentifier}
            onSubmit={onForwardRouting}
            hideSubmitButton
            elternteil={elternteil}
            incomeIndex={currentPersonPageIncomeIndex}
          />
        )}

        <div className="flex gap-16">
          <Button
            type="button"
            buttonStyle="secondary"
            onClick={onBackwardRouting}
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
