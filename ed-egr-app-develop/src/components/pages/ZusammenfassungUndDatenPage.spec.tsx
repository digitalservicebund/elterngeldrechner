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
import { initialMonatsplanerState } from "../../redux/monatsplanerSlice";
import { createDefaultElternteileSettings } from "../../globals/js/elternteile-utils";
import ZusammenfassungUndDatenPage from "./ZusammenfassungUndDatenPage";
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
      elterngeldResult: {
        state: "success",
        data: [
          {
            vonLebensMonat: 1,
            bisLebensMonat: 10,
            nettoEinkommen: 100,
            basisElternGeld: 600,
            elternGeldPlus: 300,
          },
        ],
      },
    },
  },
};

function getFieldByName(name: string): Element {
  // eslint-disable-next-line testing-library/no-node-access
  const element = document.querySelector(`[name="${name}"]`);
  if (element === null) {
    throw new Error(`Element with name ${name} not found.`);
  }
  return element;
}

describe("Zusammenfassung und Daten Page", () => {
  it("should reset the global state and navigate back to the Startpage", async () => {
    // setup
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
      <MemoryRouter initialEntries={["/zusammenfassung-und-daten"]}>
        <Routes>
          <Route
            path="/zusammenfassung-und-daten"
            element={<ZusammenfassungUndDatenPage />}
          />
          <Route path="/" element="Startpage" />
        </Routes>
      </MemoryRouter>,
      { preloadedState },
    );

    expect(
      screen.getByText("Übernahme von Daten in den Elterngeld-Antrag"),
    ).toBeInTheDocument();

    // when
    await userEvent.click(
      screen.getByRole("button", { name: "Daten verwerfen" }),
    );

    // then
    expect(store.getState()).toEqual(expectedState);
    expect(screen.getByText("Startpage")).toBeInTheDocument();
  });

  it("should contain hidden fields for submission to the anton application form", async () => {
    // setup
    // need to use a real route, otherwise the Page would rerender with initial state
    render(
      <MemoryRouter initialEntries={["/zusammenfassung-und-daten"]}>
        <Routes>
          <Route
            path="/zusammenfassung-und-daten"
            element={<ZusammenfassungUndDatenPage />}
          />
        </Routes>
      </MemoryRouter>,
      { preloadedState },
    );

    // expect
    expect(
      screen.getByText("Übernahme von Daten in den Elterngeld-Antrag"),
    ).toBeInTheDocument();

    const kindGeburtstag = getFieldByName("kind_geburtstag");
    expect(kindGeburtstag).not.toBeVisible();
    expect(kindGeburtstag.getAttribute("value")).toBe("08.08.2022");
    const mehrlingeAnzahl = getFieldByName("mehrlinge_anzahl");
    expect(mehrlingeAnzahl).not.toBeVisible();
    expect(mehrlingeAnzahl.getAttribute("value")).toBe("1");
    const e1vorGeburt = getFieldByName("p1_et_vorgeburt");
    expect(e1vorGeburt).not.toBeVisible();
    expect(e1vorGeburt.getAttribute("value")).toBe("1");
    const e1nachGeburt = getFieldByName("p1_et_nachgeburt");
    expect(e1nachGeburt).not.toBeVisible();
    expect(e1nachGeburt.getAttribute("value")).toBe("1");
    const steuerklasse = getFieldByName("p1_vg_nselbst_steuerklasse");
    expect(steuerklasse).not.toBeVisible();
    expect(steuerklasse.getAttribute("value")).toBe("");
    const kirchensteuer = getFieldByName("p1_vg_kirchensteuer");
    expect(kirchensteuer).not.toBeVisible();
    expect(kirchensteuer.getAttribute("value")).toBe("0");
  });
});
