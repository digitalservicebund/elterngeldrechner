import { reducers, RootState } from "../../../redux";
import { initialStepAllgemeineAngabenState } from "../../../redux/stepAllgemeineAngabenSlice";
import {
  ElternGeldSimulationErgebnis,
  YesNo,
} from "../../../globals/js/calculations/model";
import { render, screen } from "../../../test-utils/test-utils";
import { within } from "@testing-library/react";
import Big from "big.js";
import userEvent from "@testing-library/user-event";
import { Rechner } from "./Rechner";
import { StepNachwuchsState } from "../../../redux/stepNachwuchsSlice";
import {
  ElterngeldRowsResult,
  initialStepRechnerState,
  StepRechnerElternteilState,
} from "../../../redux/stepRechnerSlice";
import { EgrCalculation } from "../../../globals/js/calculations/egr-calculation";
import { configureStore } from "@reduxjs/toolkit";

jest.mock("../../../globals/js/calculations/egr-calculation");

describe("Rechner", () => {
  let simulationErgebnis: ElternGeldSimulationErgebnis;
  const mockEgrSimulation = {
    simulate: jest.fn(),
  };
  const stepNachwuchs: StepNachwuchsState = {
    anzahlKuenftigerKinder: 1,
    wahrscheinlichesGeburtsDatum: "08.09.2022",
    geschwisterkinder: [],
    mutterschaftssleistungen: YesNo.NO,
  };

  beforeEach(() => {
    simulationErgebnis = {
      rows: [
        {
          vonLebensMonat: 1,
          bisLebensMonat: 12,
          basisElternGeld: new Big(1001),
          elternGeldPlus: new Big(2001),
          nettoEinkommen: new Big(3001),
        },
      ],
    };

    mockEgrSimulation.simulate.mockClear();

    mockEgrSimulation.simulate.mockImplementation(
      async () => simulationErgebnis,
    );
    (EgrCalculation as unknown as jest.Mock).mockImplementation(
      () => mockEgrSimulation,
    );
  });

  it("should show the Rechner for one Elternteil", () => {
    const state: Partial<RootState> = {
      stepNachwuchs,
      stepAllgemeineAngaben: {
        ...initialStepAllgemeineAngabenState,
        antragstellende: "FuerMichSelbst",
        alleinerziehend: YesNo.YES,
        pseudonym: {
          ET1: "Peter",
          ET2: "",
        },
      },
    };

    render(<Rechner />, { preloadedState: state });

    expect(screen.queryByText("Peter")).not.toBeInTheDocument();
    expect(screen.getByText("Elterngeld-Anspruch")).toBeInTheDocument();
    const rechner = screen.getByTestId("egr-rechner-form");
    expect(
      within(rechner).getByText("Elterngeld berechnen"),
    ).toBeInTheDocument();
  });

  it("should show the Rechner for both Elternteile", () => {
    const state: Partial<RootState> = {
      stepNachwuchs,

      stepAllgemeineAngaben: {
        ...initialStepAllgemeineAngabenState,
        antragstellende: "FuerBeide",
        pseudonym: {
          ET1: "Peter",
          ET2: "Marie",
        },
      },
    };

    render(<Rechner />, { preloadedState: state });

    const rechner = screen.getByLabelText("Marie");
    expect(
      within(rechner).getByText("Elterngeld berechnen"),
    ).toBeInTheDocument();
  });

  it("should calculate and display the Elterngeld", async () => {
    const state: Partial<RootState> = {
      stepNachwuchs,
      stepAllgemeineAngaben: {
        ...initialStepAllgemeineAngabenState,
        antragstellende: "FuerMichSelbst",
        alleinerziehend: YesNo.YES,
      },
    };
    const store = configureStore({ preloadedState: state, reducer: reducers });

    render(<Rechner />, { store });

    await userEvent.click(screen.getByText("Einkommen hinzufügen"));

    const firstEinkommen = screen.getByLabelText("1. Einkommen");

    await userEvent.type(
      within(firstEinkommen).getByLabelText(
        "Ihr monatliches Bruttoeinkommen oder durchschnittlicher monatlicher Gewinn während des Bezugs von Elterngeld",
      ),
      "1000",
    );

    await userEvent.selectOptions(
      within(firstEinkommen).getByLabelText("von Lebensmonat"),
      "1",
    );
    await userEvent.selectOptions(
      within(firstEinkommen).getByLabelText("bis Lebensmonat"),
      "32",
    );

    await userEvent.click(screen.getByText("Elterngeld berechnen"));

    await screen.findByLabelText("Elterngeld berechnen Ergebnis");
    expect(mockEgrSimulation.simulate).toHaveBeenCalled();
    expect(
      store.getState().stepRechner.ET1.elterngeldResult,
    ).toEqual<ElterngeldRowsResult>({
      state: "success",
      data: [
        {
          vonLebensMonat: 1,
          bisLebensMonat: 12,
          basisElternGeld: 1001,
          elternGeldPlus: 2001,
          nettoEinkommen: 3001,
        },
      ],
    });
  });

  it("should show a notification message on next page if Basiselterngeld calculation was already done and now user changes at least one input in previous form steps", async () => {
    const ET1 = "Finn";
    const ET2 = "Fiona";

    const elternteilStepRechner: StepRechnerElternteilState = {
      ...initialStepRechnerState.ET1,
      hasBEGResultChangedDueToPrevFormSteps: true,
    };

    const preloadedState: Partial<RootState> = {
      stepNachwuchs,
      stepAllgemeineAngaben: {
        ...initialStepAllgemeineAngabenState,
        antragstellende: "FuerBeide",
        pseudonym: {
          ET1,
          ET2,
        },
      },
      stepRechner: {
        ET1: elternteilStepRechner,
        ET2: elternteilStepRechner,
      },
    };

    render(<Rechner />, { preloadedState });

    const notificationMessage = await screen.findByText(
      /das Ergebnis der Berechnung für Finn und Fiona hat sich verändert/i,
    );
    expect(notificationMessage).toBeInTheDocument();
  });
});
