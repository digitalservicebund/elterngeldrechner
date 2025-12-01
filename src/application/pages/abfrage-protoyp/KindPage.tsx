import { differenceInCalendarDays } from "date-fns";
import { useId } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/application/components";
import { KindAbgabeGeburtForm } from "@/application/features/abfrage-prototyp/components/KindPage/KindAbfrageGeburtForm";
import { KindGeburtErfolgtForm } from "@/application/features/abfrage-prototyp/components/KindPage/KindGeburtErfolgtForm";
import { KindGeburtNichtErfolgtForm } from "@/application/features/abfrage-prototyp/components/KindPage/KindGeburtNichtErfolgtForm";
import { KindGeburtPlausibilitaetscheck } from "@/application/features/abfrage-prototyp/components/KindPage/KindGeburtPlausibilitaetscheck";
import {
  RoutingPrototypState,
  StepPrototypState,
  routingPrototypSlice,
} from "@/application/features/abfrage-prototyp/state";
import { KindPageRoutes } from "@/application/features/abfrage-prototyp/state/routingPrototypSlice";
import {
  YesNo,
  parseGermanDateString,
} from "@/application/features/abfrageteil/state";
import { Page } from "@/application/pages/Page";
import { RootState } from "@/application/redux";
import { formSteps } from "@/application/routing/formSteps";

export function KindPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formIdentifier = useId();

  const routerState = useSelector((state: RootState) => state.routingPrototyp);
  const currentKindPageRoute = routerState.currentKindPageRoute;

  const onForwardRouting = (values: StepPrototypState) => {
    const geburtIstErfolgt = values.kind.geburtIstErfolgt as YesNo;
    const errechneterGeburtstermin = values.kind.errechneterGeburtstermin;

    const { routingZuNaechstemFormStep, naechsteRoute } = kindPageRouter(
      "forward",
      currentKindPageRoute,
      geburtIstErfolgt,
      errechneterGeburtstermin,
    );

    if (routingZuNaechstemFormStep) {
      const data: RoutingPrototypState = {
        ...routerState,
        currentGeschwisterPageRoute: 0,
      };
      dispatch(routingPrototypSlice.actions.submitRouting(data));

      void navigate(formSteps.geschwister.route);
    }

    if (naechsteRoute) {
      const data: RoutingPrototypState = {
        ...routerState,
        currentKindPageRoute: naechsteRoute,
      };
      dispatch(routingPrototypSlice.actions.submitRouting(data));
    }
  };

  const onBackwardRouting = () => {
    const { routingZuNaechstemFormStep, naechsteRoute } = kindPageRouter(
      "backward",
      currentKindPageRoute,
      YesNo.NO,
      "",
    );

    if (routingZuNaechstemFormStep) {
      void navigate(formSteps.familie.route);
      return;
    }

    if (naechsteRoute !== undefined) {
      const data: RoutingPrototypState = {
        ...routerState,
        currentKindPageRoute: naechsteRoute,
      };
      dispatch(routingPrototypSlice.actions.submitRouting(data));
    }
  };

  return (
    <Page step={formSteps.kind}>
      <div className="flex flex-col gap-56">
        {currentKindPageRoute === KindPageRoutes.ABFRAGE_GEBURT && (
          <KindAbgabeGeburtForm
            id={formIdentifier}
            onSubmit={onForwardRouting}
            hideSubmitButton
          />
        )}

        {currentKindPageRoute === KindPageRoutes.GEBURT_ERFOLGT && (
          <KindGeburtErfolgtForm
            id={formIdentifier}
            onSubmit={onForwardRouting}
            hideSubmitButton
          />
        )}

        {currentKindPageRoute === KindPageRoutes.GEBURT_NICHT_ERFOLGT && (
          <KindGeburtNichtErfolgtForm
            id={formIdentifier}
            onSubmit={onForwardRouting}
            hideSubmitButton
          />
        )}

        {currentKindPageRoute ===
          KindPageRoutes.GEBURT_PLAUSIBILITAETSCHECK && (
          <KindGeburtPlausibilitaetscheck
            id={formIdentifier}
            onSubmit={onForwardRouting}
            hideSubmitButton
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

const kindPageRouter = (
  direction: "forward" | "backward",
  currentKindPageRoute: KindPageRoutes,
  geburtIstErfolgt: YesNo,
  errechneterGeburtstermin: string,
): { routingZuNaechstemFormStep: boolean; naechsteRoute?: KindPageRoutes } => {
  const today = new Date();
  const et = parseGermanDateString(errechneterGeburtstermin);

  const timeDifference = differenceInCalendarDays(today, et);

  if (direction === "forward") {
    switch (currentKindPageRoute) {
      case KindPageRoutes.ABFRAGE_GEBURT:
        if (geburtIstErfolgt === YesNo.YES) {
          return {
            routingZuNaechstemFormStep: false,
            naechsteRoute: KindPageRoutes.GEBURT_ERFOLGT,
          };
        } else {
          return {
            routingZuNaechstemFormStep: false,
            naechsteRoute: KindPageRoutes.GEBURT_NICHT_ERFOLGT,
          };
        }
      case KindPageRoutes.GEBURT_ERFOLGT:
        return { routingZuNaechstemFormStep: true };
      case KindPageRoutes.GEBURT_NICHT_ERFOLGT:
        if (timeDifference > 14) {
          return {
            routingZuNaechstemFormStep: false,
            naechsteRoute: KindPageRoutes.GEBURT_PLAUSIBILITAETSCHECK,
          };
        } else {
          return { routingZuNaechstemFormStep: true };
        }
      case KindPageRoutes.GEBURT_PLAUSIBILITAETSCHECK:
        return { routingZuNaechstemFormStep: true };
      default:
        return {
          routingZuNaechstemFormStep: false,
          naechsteRoute: currentKindPageRoute,
        };
    }
  }

  if (direction === "backward") {
    switch (currentKindPageRoute) {
      case KindPageRoutes.GEBURT_PLAUSIBILITAETSCHECK:
        return {
          routingZuNaechstemFormStep: false,
          naechsteRoute: KindPageRoutes.GEBURT_NICHT_ERFOLGT,
        };
      case KindPageRoutes.GEBURT_ERFOLGT:
      case KindPageRoutes.GEBURT_NICHT_ERFOLGT:
        return {
          routingZuNaechstemFormStep: false,
          naechsteRoute: KindPageRoutes.ABFRAGE_GEBURT,
        };
      case KindPageRoutes.ABFRAGE_GEBURT:
        return { routingZuNaechstemFormStep: true };
      default:
        return {
          routingZuNaechstemFormStep: false,
          naechsteRoute: currentKindPageRoute,
        };
    }
  }

  return {
    routingZuNaechstemFormStep: false,
    naechsteRoute: currentKindPageRoute,
  };
};
