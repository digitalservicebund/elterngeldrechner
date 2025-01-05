import {
  type RouteObject,
  RouterProvider,
  createMemoryRouter,
} from "react-router-dom";
import { AriaLogProvider } from "@/components/atoms";
import AllgemeineAngabenPage from "@/components/pages/AllgemeineAngabenPage";
import EinkommenPage from "@/components/pages/EinkommenPage";
import { ElterngeldvariantenPage } from "@/components/pages/ElterngeldvariantenPage";
import ErwerbstaetigkeitPage from "@/components/pages/ErwerbstaetigkeitPage";
import NachwuchsPage from "@/components/pages/NachwuchsPage";
import ZusammenfassungUndDatenPage from "@/components/pages/ZusammenfassungUndDatenPage";
import { formSteps } from "@/components/pages/formSteps";
import { RechnerPlanerPage } from "@/components/pages/rechner-und-planer-page";
import "@/styles/index.css";
import "@/styles/index.scss";
import { configurationActions } from "@/redux/configurationSlice";
import { useAppDispatch } from "@/redux/hooks";

interface Props {
  readonly elternGeldDigitalWizardUrl: string | undefined;
}

export function App({ elternGeldDigitalWizardUrl }: Props) {
  const dispatch = useAppDispatch();

  dispatch(
    configurationActions.configure({
      elternGeldDigitalWizardUrl: elternGeldDigitalWizardUrl,
    }),
  );

  const router = createMemoryRouter(ROUTES, {
    initialEntries: [formSteps.allgemeinAngaben.route],
  });

  return (
    <AriaLogProvider>
      <RouterProvider router={router} />
    </AriaLogProvider>
  );
}

const ROUTES: RouteObject[] = [
  {
    path: formSteps.allgemeinAngaben.route,
    element: <AllgemeineAngabenPage />,
  },
  {
    path: formSteps.nachwuchs.route,
    element: <NachwuchsPage />,
  },
  {
    path: formSteps.erwerbstaetigkeit.route,
    element: <ErwerbstaetigkeitPage />,
  },
  {
    path: formSteps.einkommen.route,
    element: <EinkommenPage />,
  },
  {
    path: formSteps.elterngeldvarianten.route,
    element: <ElterngeldvariantenPage />,
  },
  {
    path: formSteps.rechnerUndPlaner.route,
    element: <RechnerPlanerPage />,
  },
  {
    path: formSteps.zusammenfassungUndDaten.route,
    element: <ZusammenfassungUndDatenPage />,
  },
];
