import { lazy, Suspense } from "react";
import { MemoryRouter, Route, Routes, Navigate } from "react-router-dom";
import { AriaLogProvider, Spinner } from "@/components/atoms";
import "@/styles/tailwind.css";
import "@/styles/axioms.css";
import "@/styles/themes.css";
import "@/styles/typo.css";
import "./index.scss";
import { formSteps } from "@/utils/formSteps";
import { useAppDispatch } from "@/redux/hooks";
import { configurationActions } from "@/redux/configurationSlice";
import { ElterngeldvariantenPage } from "@/components/pages/ElterngeldvariantenPage";

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
  readonly elternGeldDigitalWizardUrl: string | undefined;
}

export function App({ elternGeldDigitalWizardUrl }: Props) {
  const dispatch = useAppDispatch();
  dispatch(
    configurationActions.configure({
      elternGeldDigitalWizardUrl: elternGeldDigitalWizardUrl,
    }),
  );

  /* for development: show all pages at once */
  const url = new URL(window.location.href);
  const showAllPagesAtOnce = url.searchParams.get("allpages") === "1";
  const allPages = (
    <>
      <AllgemeineAngabenPage />
      <NachwuchsPage />
      <ErwerbstaetigkeitPage />
      <EinkommenPage />
      <ElterngeldvariantenPage />
      <RechnerPlanerPage />
      <ZusammenfassungUndDatenPage />
    </>
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
              element={
                <>{showAllPagesAtOnce ? allPages : <AllgemeineAngabenPage />}</>
              }
            />
            <Route
              path={formSteps.nachwuchs.route}
              element={<>{showAllPagesAtOnce ? allPages : <NachwuchsPage />}</>}
            />
            <Route
              path={formSteps.erwerbstaetigkeit.route}
              element={
                <>{showAllPagesAtOnce ? allPages : <ErwerbstaetigkeitPage />}</>
              }
            />
            <Route
              path={formSteps.einkommen.route}
              element={<>{showAllPagesAtOnce ? allPages : <EinkommenPage />}</>}
            />
            <Route
              path={formSteps.elterngeldvarianten.route}
              element={
                <>
                  {showAllPagesAtOnce ? allPages : <ElterngeldvariantenPage />}
                </>
              }
            />
            <Route
              path={formSteps.rechnerUndPlaner.route}
              element={
                <>{showAllPagesAtOnce ? allPages : <RechnerPlanerPage />}</>
              }
            />
            <Route
              path={formSteps.zusammenfassungUndDaten.route}
              element={
                <>
                  {showAllPagesAtOnce ? (
                    allPages
                  ) : (
                    <ZusammenfassungUndDatenPage />
                  )}
                </>
              }
            />
          </Routes>
        </Suspense>
      </AriaLogProvider>
    </MemoryRouter>
  );
}
