import { MemoryRouter, Route, Routes, Navigate } from "react-router-dom";
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

  return (
    <MemoryRouter>
      <AriaLogProvider>
        <Routes>
          <Route
            index
            element={<Navigate to={formSteps.allgemeinAngaben.route} replace />}
          />
          <Route
            path={formSteps.allgemeinAngaben.route}
            element={<AllgemeineAngabenPage />}
          />
          <Route path={formSteps.nachwuchs.route} element={<NachwuchsPage />} />
          <Route
            path={formSteps.erwerbstaetigkeit.route}
            element={<ErwerbstaetigkeitPage />}
          />
          <Route path={formSteps.einkommen.route} element={<EinkommenPage />} />
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
      </AriaLogProvider>
    </MemoryRouter>
  );
}
