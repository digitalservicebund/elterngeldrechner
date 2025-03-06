import { Navigate } from "react-router-dom";
import AllgemeineAngabenPage from "@/components/pages/AllgemeineAngabenPage";
import EinkommenPage from "@/components/pages/EinkommenPage";
import { ElterngeldvariantenPage } from "@/components/pages/ElterngeldvariantenPage";
import ErwerbstaetigkeitPage from "@/components/pages/ErwerbstaetigkeitPage";
import NachwuchsPage from "@/components/pages/NachwuchsPage";
import ZusammenfassungUndDatenPage from "@/components/pages/ZusammenfassungUndDatenPage";
import { formSteps } from "@/components/pages/formSteps";
import { RechnerPlanerPage } from "@/components/pages/rechner-und-planer-page";
import { PlanMitBeliebigenElternteilen } from "@/monatsplaner";
import { RootState } from "@/redux";
import RouteGuard from "@/routing/RouteGuard";
import {
  InternalGuardedRoute,
  InternalRoute,
  InternalRouteDefinition,
  InternalStepRoute,
} from "@/routing/internalRoutes";

// Every page in our application, except for the first one, expects certain redux state
// slices to be present. Prior to introducing real routes, users could not navigate
// directly to a specific page, so missing state was never an issue. However, with
// direct navigation now possible, users may skip required steps, making state validation
// necessary.

// Step validation is implemented in precondition functions, which are evaluated
// within the guard. This approach has the benefit of consolidating all
// preconditions in one place, making them easy to implement. The alternative
// would be to implement the state check within each page component, which we
// ruled out because it can be easily overlooked when adding new pages, it would
// make the pages harder to test and in the specific case of the planner, it
// would require disabling the rules-of-hooks linting rule.

// The downside of this approach is that it tightly couples the router to the redux state,
// creating a dependency that could make future changes or state management more complex.

// Please keep in mind that these urls are used as triggers for funnel tracking
// in matomo and changes must also be reflected in the tag manager.

const internalRouteDefinition: InternalRouteDefinition = [
  {
    element: <AllgemeineAngabenPage />,
    path: formSteps.allgemeinAngaben.route,
  },
  {
    element: <NachwuchsPage />,
    path: formSteps.nachwuchs.route,
    precondition: (state: RootState) => {
      return state.stepAllgemeineAngaben.mutterschaftssleistungen != null;
    },
  },
  {
    element: <ErwerbstaetigkeitPage />,
    path: formSteps.erwerbstaetigkeit.route,
    precondition: (state: RootState) => {
      return !!state.stepNachwuchs.wahrscheinlichesGeburtsDatum;
    },
  },
  {
    element: <EinkommenPage />,
    path: formSteps.einkommen.route,
    precondition: (state: RootState) => {
      return state.stepErwerbstaetigkeit.ET1.vorGeburt != null;
    },
  },
  {
    element: <ElterngeldvariantenPage />,
    path: formSteps.elterngeldvarianten.route,
    precondition: (state: RootState) => {
      return state.stepEinkommen.limitEinkommenUeberschritten != null;
    },
  },
  {
    element: <RechnerPlanerPage />,
    path: formSteps.rechnerUndPlaner.route,
    precondition: (state: RootState) => {
      return state.stepEinkommen.limitEinkommenUeberschritten != null;
    },
  },
  {
    element: <ZusammenfassungUndDatenPage />,
    path: formSteps.zusammenfassungUndDaten.route,
    precondition: (_: RootState, plan?: PlanMitBeliebigenElternteilen) => {
      return plan != null;
    },
  },
  {
    element: <Navigate to={formSteps.allgemeinAngaben.route} replace />,
    path: "*",
  },
];

function isGuardedRoute(route: InternalRoute): route is InternalGuardedRoute {
  return "precondition" in route;
}

const routeDefinition = internalRouteDefinition.map((route, index, array) => {
  if (isGuardedRoute(route)) {
    const fallback = array[index - 1] as InternalStepRoute;

    return {
      path: route.path,
      element: (
        <RouteGuard fallback={fallback.path} precondition={route.precondition}>
          {route.element}
        </RouteGuard>
      ),
    };
  } else {
    return { path: route.path, element: route.element };
  }
});

export default routeDefinition;
