import { FC, lazy, Suspense } from "react";
import { MemoryRouter, Navigate, Route, Routes } from "react-router-dom";
import { AriaLogProvider, Spinner } from "../components/atoms";
import "../styles/tailwind.css";
import "./index.scss";
import { formSteps } from "../utils/formSteps";
import { useAppDispatch } from "../redux/hooks";
import { configurationActions } from "../redux/configurationSlice";
import { ElterngeldvariantenPage } from "../components/pages/ElterngeldvariantenPage";

const AllgemeineAngabenPage = lazy(
  () => import("../components/pages/AllgemeineAngabenPage"),
);
const NachwuchsPage = lazy(() => import("../components/pages/NachwuchsPage"));
const ErwerbstaetigkeitPage = lazy(
  () => import("../components/pages/ErwerbstaetigkeitPage"),
);
const EinkommenPage = lazy(() => import("../components/pages/EinkommenPage"));
const RechnerPlanerPage = lazy(
  () => import("../components/pages/RechnerPlanerPage"),
);
const ZusammenfassungUndDatenPage = lazy(
  () => import("../components/pages/ZusammenfassungUndDatenPage"),
);

interface Props {
  elternGeldDigitalWizardUrl: string | undefined;
}

export const App: FC<Props> = ({ elternGeldDigitalWizardUrl }) => {
  const dispatch = useAppDispatch();
  dispatch(
    configurationActions.configure({
      elternGeldDigitalWizardUrl: elternGeldDigitalWizardUrl,
    }),
  );

  return (
    <MemoryRouter>
      <AriaLogProvider>
        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route
              index
              element={
                <Navigate to={formSteps.allgemeinAngaben.route} replace />
              }
            />
            <Route
              path={formSteps.allgemeinAngaben.route}
              element={<AllgemeineAngabenPage />}
            />
            <Route
              path={formSteps.nachwuchs.route}
              element={<NachwuchsPage />}
            />
            <Route
              path={formSteps.erwerbstaetigkeit.route}
              element={<ErwerbstaetigkeitPage />}
            />
            <Route
              path={formSteps.einkommen.route}
              element={<EinkommenPage />}
            />
            <Route
              path={formSteps.elterngeldvarianten.route}
              element={<ElterngeldvariantenPage />}
            />
            <Route
              path={formSteps.rechnerUndPlaner.route}
              element={<RechnerPlanerPage />}
            />
            <Route
              path={formSteps.zusammenfassungUndDaten.route}
              element={<ZusammenfassungUndDatenPage />}
            />
          </Routes>
        </Suspense>
      </AriaLogProvider>
    </MemoryRouter>
  );
};

export default App;
