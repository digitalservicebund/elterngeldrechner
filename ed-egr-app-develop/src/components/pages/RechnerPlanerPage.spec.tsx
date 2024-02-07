import { render, screen } from "../../test-utils/test-utils";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { initialStepEinkommenState } from "../../redux/stepEinkommenSlice";
import store, { RootState } from "../../redux";
import { initialStepAllgemeineAngabenState } from "../../redux/stepAllgemeineAngabenSlice";
import { createElternteile } from "../../monatsplaner";
import { initialStepNachwuchsState } from "../../redux/stepNachwuchsSlice";
import { initialStepErwerbstaetigkeitState } from "../../redux/stepErwerbstaetigkeitSlice";
import { initialStepRechnerState } from "../../redux/stepRechnerSlice";
import { YesNo } from "../../globals/js/calculations/model";
import RechnerPlanerPage from "./RechnerPlanerPage";
import { initialMonatsplanerState } from "../../redux/monatsplanerSlice";
import { createDefaultElternteileSettings } from "../../globals/js/elternteile-utils";
import { initialStepConfigurationState } from "../../redux/configurationSlice";

const defaultElternteileSettings = createDefaultElternteileSettings(
  "2022-08-08T00:00:00Z",
  "ET1",
  2,
  true,
);

const preloadedState: Partial<RootState> = {
  monatsplaner: {
    ...initialMonatsplanerState,
    mutterschutzElternteil: "ET1",
    settings: defaultElternteileSettings,
    elternteile: createElternteile(defaultElternteileSettings),
  },
  stepAllgemeineAngaben: {
    ...initialStepAllgemeineAngabenState,
    antragstellende: "FuerMichSelbst",
  },
  stepNachwuchs: {
    ...initialStepNachwuchsState,
    anzahlKuenftigerKinder: 1,
    wahrscheinlichesGeburtsDatum: "08.08.2022",
  },
  stepErwerbstaetigkeit: {
    ...initialStepErwerbstaetigkeitState,
    ET1: {
      ...initialStepErwerbstaetigkeitState.ET1,
      vorGeburt: YesNo.YES,
    },
  },
  stepEinkommen: {
    ...initialStepEinkommenState,
    ET1: {
      ...initialStepEinkommenState.ET1,
      bruttoEinkommenNichtSelbstaendig: {
        ...initialStepEinkommenState.ET1.bruttoEinkommenNichtSelbstaendig,
        type: "average",
        average: 1000,
      },
    },
  },
  stepRechner: {
    ...initialStepRechnerState,
    ET1: {
      ...initialStepRechnerState.ET1,
      bruttoEinkommenZeitraum: [
        {
          bruttoEinkommen: 1000,
          zeitraum: {
            from: "2022-12-01",
            to: "2023-03-01",
          },
        },
      ],
    },
  },
};

describe("Rechner Planer Page", () => {
  it("should reset the global state and navigate back to the Startpage", async () => {
    const expectedState: RootState = {
      monatsplaner: initialMonatsplanerState,
      stepAllgemeineAngaben: initialStepAllgemeineAngabenState,
      stepNachwuchs: initialStepNachwuchsState,
      stepErwerbstaetigkeit: initialStepErwerbstaetigkeitState,
      stepEinkommen: initialStepEinkommenState,
      stepRechner: initialStepRechnerState,
      configuration: initialStepConfigurationState,
    };

    // need to use a real route, otherwise the Page would rerender with initial state
    render(
      <MemoryRouter initialEntries={["/rechner-planer"]}>
        <Routes>
          <Route path="/rechner-planer" element={<RechnerPlanerPage />} />
          <Route path="/" element="Startpage" />
        </Routes>
      </MemoryRouter>,
      { preloadedState },
    );

    await userEvent.click(screen.getByRole("button", { name: "Neu starten" }));

    expect(store.getState()).toEqual(expectedState);
    expect(screen.getByText("Startpage")).toBeInTheDocument();
  });
});
