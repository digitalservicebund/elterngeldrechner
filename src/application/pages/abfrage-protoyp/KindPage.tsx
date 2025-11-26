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

    const { routingZuNaechsterSeite, naechsteRoute } = kindPageRouter(
      "forward",
      currentKindPageRoute,
      geburtIstErfolgt,
      errechneterGeburtstermin,
    );

    if (naechsteRoute) {
      const data: RoutingPrototypState = {
        ...routerState,
        currentKindPageRoute: naechsteRoute,
      };
      dispatch(routingPrototypSlice.actions.submitRouting(data));
    }

    if (routingZuNaechsterSeite) {
      const data: RoutingPrototypState = {
        ...routerState,
        currentGeschwisterPageRoute: 0,
      };
      dispatch(routingPrototypSlice.actions.submitRouting(data));

      void navigate(formSteps.geschwister.route);
    }
  };

  const onBackwardRouting = () => {
    const { routingZuNaechsterSeite, naechsteRoute } = kindPageRouter(
      "backward",
      currentKindPageRoute,
      YesNo.NO,
      "",
    );

    if (routingZuNaechsterSeite) {
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
): { routingZuNaechsterSeite: boolean; naechsteRoute?: KindPageRoutes } => {
  const today = new Date();
  const et = parseGermanDateString(errechneterGeburtstermin);

  const timeDifference = differenceInCalendarDays(today, et);

  if (direction === "forward") {
    switch (currentKindPageRoute) {
      case KindPageRoutes.ABFRAGE_GEBURT:
        if (geburtIstErfolgt === YesNo.YES) {
          return {
            routingZuNaechsterSeite: false,
            naechsteRoute: KindPageRoutes.GEBURT_ERFOLGT,
          };
        } else {
          return {
            routingZuNaechsterSeite: false,
            naechsteRoute: KindPageRoutes.GEBURT_NICHT_ERFOLGT,
          };
        }
      case KindPageRoutes.GEBURT_ERFOLGT:
        return { routingZuNaechsterSeite: true };
      case KindPageRoutes.GEBURT_NICHT_ERFOLGT:
        if (timeDifference > 14) {
          return {
            routingZuNaechsterSeite: false,
            naechsteRoute: KindPageRoutes.GEBURT_PLAUSIBILITAETSCHECK,
          };
        } else {
          return { routingZuNaechsterSeite: true };
        }
      case KindPageRoutes.GEBURT_PLAUSIBILITAETSCHECK:
        return { routingZuNaechsterSeite: true };
      default:
        return {
          routingZuNaechsterSeite: false,
          naechsteRoute: currentKindPageRoute,
        };
    }
  }

  if (direction === "backward") {
    switch (currentKindPageRoute) {
      case KindPageRoutes.GEBURT_PLAUSIBILITAETSCHECK:
        return {
          routingZuNaechsterSeite: false,
          naechsteRoute: KindPageRoutes.GEBURT_NICHT_ERFOLGT,
        };
      case KindPageRoutes.GEBURT_ERFOLGT:
      case KindPageRoutes.GEBURT_NICHT_ERFOLGT:
        return {
          routingZuNaechsterSeite: false,
          naechsteRoute: KindPageRoutes.ABFRAGE_GEBURT,
        };
      case KindPageRoutes.ABFRAGE_GEBURT:
        return { routingZuNaechsterSeite: true };
      default:
        return {
          routingZuNaechsterSeite: false,
          naechsteRoute: currentKindPageRoute,
        };
    }
  }

  return {
    routingZuNaechsterSeite: false,
    naechsteRoute: currentKindPageRoute,
  };
};
