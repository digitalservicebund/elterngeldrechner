import { Navigate } from "react-router-dom";
import { formSteps } from "./formSteps";
import {
  // YesNo,
  stepAllgemeineAngabenSlice,
  stepEinkommenSlice,
  stepErwerbstaetigkeitSlice,
  stepNachwuchsSlice,
} from "@/application/features/abfrageteil/state";
import {
  BeispielePage,
  DatenuebernahmeAntragPage,
  EinfuehrungsPage,
  FamiliePage,
  KindPage,
  PersonPage,
  PlanerPage,
} from "@/application/pages";
import { GeschwisterPage } from "@/application/pages/abfrage-protoyp/GeschwisterPage";
import { RootState } from "@/application/redux";
import { useAppStore } from "@/application/redux/hooks";
import RouteGuard from "@/application/routing/RouteGuard";
import {
  InternalGuardedRoute,
  InternalRoute,
  InternalRouteDefinition,
  InternalStepRoute,
} from "@/application/routing/internalRoutes";
import { Elternteil, PlanMitBeliebigenElternteilen } from "@/monatsplaner";

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
    element: <EinfuehrungsPage />,
    path: formSteps.einfuehrung.route,
  },
  {
    element: <FamiliePage />,
    path: formSteps.familie.route,
    precondition: () => {
      return true;
      // return state.stepPrototyp.wahrscheinlichesGeburtsDatum.length > 0;
    },
  },
  {
    element: <KindPage />,
    path: formSteps.kind.route,
    precondition: () => {
      return true;
    },
  },
  {
    element: <GeschwisterPage />,
    path: formSteps.geschwister.route,
    precondition: () => {
      return true;
    },
  },
  {
    element: <PersonPage elternteil={Elternteil.Eins} />,
    path: formSteps.person1.route,
    precondition: () => {
      return true;
      // return state.stepPrototyp.geburtsdatum.length > 0;
    },
  },
  {
    element: <PersonPage elternteil={Elternteil.Zwei} />,
    path: formSteps.person2.route,
    precondition: () => {
      return true;
      // return (
      //   state.stepPrototyp.geburtsdatum.length > 0 &&
      //   state.stepPrototyp.alleinerziehend === YesNo.NO
      // );
    },
  },
  {
    element: <BeispielePage />,
    path: formSteps.beispiele.route,
    precondition: (state: RootState, store: ReturnType<typeof useAppStore>) => {
      if (state.stepPrototyp) {
        store.dispatch(
          stepAllgemeineAngabenSlice.actions.migrateFromPrototype(
            state.stepPrototyp,
          ),
        );
        store.dispatch(
          stepNachwuchsSlice.actions.migrateFromPrototype(state.stepPrototyp),
        );
        store.dispatch(
          stepErwerbstaetigkeitSlice.actions.migrateFromPrototype(
            state.stepPrototyp,
          ),
        );
        store.dispatch(
          stepEinkommenSlice.actions.migrateFromPrototype(state.stepPrototyp),
        );
      }

      return state.stepPrototyp.familie.limitEinkommenUeberschritten != null;
    },
  },
  {
    element: <PlanerPage />,
    path: formSteps.rechnerUndPlaner.route,
    precondition: (state: RootState) => {
      return state.stepPrototyp.familie.limitEinkommenUeberschritten != null;
    },
  },
  {
    element: <DatenuebernahmeAntragPage />,
    path: formSteps.datenuebernahmeAntrag.route,
    precondition: (
      state: RootState,
      _,
      plan?: PlanMitBeliebigenElternteilen,
    ) => {
      return plan != null && state.stepPrototyp.familie.bundesland != null;
    },
  },
  {
    element: <Navigate to={formSteps.einfuehrung.route} replace />,
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
