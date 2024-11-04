import {
  createMemoryRouter,
  type RouteObject,
  RouterProvider,
} from "react-router-dom";
import { AriaLogProvider } from "@/components/atoms";
import AllgemeineAngabenPage from "@/components/pages/AllgemeineAngabenPage";
import NachwuchsPage from "@/components/pages/NachwuchsPage";
import ErwerbstaetigkeitPage from "@/components/pages/ErwerbstaetigkeitPage";
import EinkommenPage from "@/components/pages/EinkommenPage";
import RechnerPlanerPage from "@/components/pages/RechnerPlanerPage";
import ZusammenfassungUndDatenPage from "@/components/pages/ZusammenfassungUndDatenPage";
import "@/styles/tailwind.css";
import "@/styles/axioms.css";
import "@/styles/themes.css";
import "@/styles/typo.css";
import "@/styles/anchor.css";
import "./index.scss";
import { formSteps } from "@/utils/formSteps";
import { useAppDispatch } from "@/redux/hooks";
import { configurationActions } from "@/redux/configurationSlice";
import { ElterngeldvariantenPage } from "@/components/pages/ElterngeldvariantenPage";

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
