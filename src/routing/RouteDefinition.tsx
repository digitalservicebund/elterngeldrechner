import { Navigate } from "react-router-dom";
import AllgemeineAngabenPage from "@/components/pages/AllgemeineAngabenPage";
import EinkommenPage from "@/components/pages/EinkommenPage";
import { ElterngeldvariantenPage } from "@/components/pages/ElterngeldvariantenPage";
import ErwerbstaetigkeitPage from "@/components/pages/ErwerbstaetigkeitPage";
import NachwuchsPage from "@/components/pages/NachwuchsPage";
import ZusammenfassungUndDatenPage from "@/components/pages/ZusammenfassungUndDatenPage";
import { StepRoute, formSteps } from "@/components/pages/formSteps";
import { RechnerPlanerPage } from "@/components/pages/rechner-und-planer-page";
import { RootState } from "@/redux";
import RouteGuard from "@/routing/RouteGuard";

const internalRouteDefinition = [
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
  },
  {
    element: <Navigate to={formSteps.allgemeinAngaben.route} replace />,
    path: "*",
  },
];

const isStepRoute = (path: string): path is StepRoute => {
  return Object.values(formSteps).some((step) => step.route === path);
};

const routeDefinition = internalRouteDefinition.map((route, index, array) => {
  const fallback = array[index - 1]?.path;

  if (route.precondition && fallback && isStepRoute(fallback)) {
    return {
      path: route.path,
      element: (
        <RouteGuard fallback={fallback} precondition={route.precondition}>
          {route.element}
        </RouteGuard>
      ),
    };
  } else {
    return { path: route.path, element: route.element };
  }
});

export default routeDefinition;
