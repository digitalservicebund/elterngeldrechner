import { render, screen } from "../../test-utils/test-utils";
import userEvent from "@testing-library/user-event";
import { useNavigate } from "react-router";
import { configureStore, Store } from "@reduxjs/toolkit";
import { reducers, RootState } from "../../redux";
import {
  initialStepAllgemeineAngabenState,
  StepAllgemeineAngabenState,
} from "../../redux/stepAllgemeineAngabenSlice";
import AllgemeineAngabenPage from "./AllgemeineAngabenPage";
import { YesNo } from "../../globals/js/calculations/model";
import {
  initialMonatsplanerState,
  MonatsplanerState,
} from "../../redux/monatsplanerSlice";

jest.mock("react-router");

describe("Allgemeine Angaben Page", () => {
  it("should display the optional naming part of the form, if 'Für beide' is chosen", async () => {
    render(<AllgemeineAngabenPage />);

    await userEvent.click(screen.getByLabelText("Für beide"));

    expect(screen.getByText("Ihre Namen (optional)")).toBeInTheDocument();
  });

  it("should display the Alleinerziehendenstatus part of the form, if 'Nur für mich' is chosen", async () => {
    render(<AllgemeineAngabenPage />);

    await userEvent.click(screen.getByLabelText("Nur für mich"));

    expect(screen.getByText("Alleinerziehendenstatus")).toBeInTheDocument();
  });

  it("should display mutterschaftssleistungenWer if 'Für beide' and 'mutterschaftssleistungen_option_0' are choosen", async () => {
    render(<AllgemeineAngabenPage />);

    await userEvent.click(screen.getByLabelText("Für beide"));
    await userEvent.click(
      screen.getByTestId("mutterschaftssleistungen_option_0"),
    );

    expect(
      screen.getByText("Welcher Elternteil bezieht Mutterschaftsleistungen?"),
    ).toBeInTheDocument();
  });

  it("should NOT display mutterschaftssleistungenWer if 'mutterschaftssleistungen_option_1' are choosen", async () => {
    render(<AllgemeineAngabenPage />);

    await userEvent.click(screen.getByLabelText("Für beide"));
    await userEvent.click(
      screen.getByTestId("mutterschaftssleistungen_option_1"),
    );

    expect(
      screen.queryByText("Welcher Elternteil bezieht Mutterschaftsleistungen?"),
    ).not.toBeInTheDocument();
  });

  it("should NOT display mutterschaftssleistungenWer if 'Nur für mich' and 'mutterschaftssleistungen_option_0' are choosen", async () => {
    render(<AllgemeineAngabenPage />);

    await userEvent.click(screen.getByLabelText("Nur für mich"));
    await userEvent.click(
      screen.getByTestId("mutterschaftssleistungen_option_0"),
    );

    expect(
      screen.queryByText("Welcher Elternteil bezieht Mutterschaftsleistungen?"),
    ).not.toBeInTheDocument();
  });

  describe("Submitting the form", () => {
    let store: Store<RootState>;
    let navigate = jest.fn();

    beforeEach(() => {
      store = configureStore({ reducer: reducers });

      navigate.mockClear();
      (useNavigate as jest.Mock).mockReturnValue(navigate);
    });

    it("should persist the step", async () => {
      render(<AllgemeineAngabenPage />, { store });
      const expectedState: StepAllgemeineAngabenState = {
        ...initialStepAllgemeineAngabenState,
        antragstellende: "FuerMichSelbst",
        alleinerziehend: YesNo.YES,
        mutterschaftssleistungen: YesNo.YES,
      };

      await userEvent.click(screen.getByLabelText("Nur für mich"));
      await userEvent.click(screen.getByTestId("alleinerziehend_option_0"));
      await userEvent.click(
        screen.getByTestId("mutterschaftssleistungen_option_0"),
      );
      await userEvent.click(screen.getByText("Weiter"));

      expect(store.getState().stepAllgemeineAngaben).toEqual(expectedState);
    });

    describe("should assign the Mutterschutzleistungen", () => {
      const preloadedState: StepAllgemeineAngabenState = {
        ...initialStepAllgemeineAngabenState,
        antragstellende: "FuerMichSelbst",
        alleinerziehend: YesNo.YES,
      };

      beforeEach(() => {
        store = configureStore({
          reducer: reducers,
          preloadedState: {
            stepAllgemeineAngaben: preloadedState,
          },
        });
      });

      it("alleinerziehend - to Elternteil 1", async () => {
        render(<AllgemeineAngabenPage />, { store });
        const expectedState: MonatsplanerState = {
          ...initialMonatsplanerState,
          mutterschutzElternteil: "ET1",
          settings: {
            partnerMonate: true,
          },
        };
        await userEvent.click(screen.getByLabelText("Nur für mich"));
        await userEvent.click(
          screen.getByTestId("mutterschaftssleistungen_option_0"),
        );

        await userEvent.click(screen.getByText("Weiter"));
        expect(store.getState().monatsplaner).toEqual(expectedState);
      });

      it("gemeinsam erziehend - to Elternteil 1", async () => {
        render(<AllgemeineAngabenPage />, { store });
        const expectedState: MonatsplanerState = {
          ...initialMonatsplanerState,
          elternteile: {
            ...initialMonatsplanerState.elternteile,
            remainingMonths: {
              ...initialMonatsplanerState.elternteile.remainingMonths,
              basiselterngeld: 14,
              elterngeldplus: 28,
            },
          },
          mutterschutzElternteil: "ET1",
          partnerMonate: true,
          settings: {
            partnerMonate: true,
          },
        };
        await userEvent.click(screen.getByLabelText("Für beide"));
        await userEvent.click(
          screen.getByTestId("mutterschaftssleistungen_option_0"),
        );
        await userEvent.click(
          screen.getByTestId("mutterschaftssleistungenWer_option_0"),
        );

        await userEvent.click(screen.getByText("Weiter"));
        expect(store.getState().monatsplaner).toEqual(expectedState);
      });

      it("gemeinsam erziehend - to Elternteil 2", async () => {
        render(<AllgemeineAngabenPage />, { store });
        const expectedState: MonatsplanerState = {
          ...initialMonatsplanerState,
          elternteile: {
            ...initialMonatsplanerState.elternteile,
            remainingMonths: {
              ...initialMonatsplanerState.elternteile.remainingMonths,
              basiselterngeld: 14,
              elterngeldplus: 28,
            },
          },
          mutterschutzElternteil: "ET2",
          partnerMonate: true,
          settings: {
            partnerMonate: true,
          },
        };
        await userEvent.click(screen.getByLabelText("Für beide"));
        await userEvent.click(
          screen.getByTestId("mutterschaftssleistungen_option_0"),
        );
        await userEvent.click(
          screen.getByTestId("mutterschaftssleistungenWer_option_1"),
        );

        await userEvent.click(screen.getByText("Weiter"));
        expect(store.getState().monatsplaner).toEqual(expectedState);
      });
    });

    it("should persist the pseudonym", async () => {
      render(<AllgemeineAngabenPage />, { store });
      const expectedState: StepAllgemeineAngabenState = {
        ...initialStepAllgemeineAngabenState,
        antragstellende: "FuerBeide",
        mutterschaftssleistungen: YesNo.YES,
        mutterschaftssleistungenWer: "ET1",
        pseudonym: {
          ET1: "Finn",
          ET2: "Fiona",
        },
      };

      await userEvent.click(screen.getByLabelText("Für beide"));
      await userEvent.type(
        screen.getByLabelText("Name für Elternteil 1"),
        expectedState.pseudonym.ET1,
      );
      await userEvent.type(
        screen.getByLabelText("Name für Elternteil 2"),
        expectedState.pseudonym.ET2,
      );
      await userEvent.click(
        screen.getByTestId("mutterschaftssleistungen_option_0"),
      );
      await userEvent.click(
        screen.getByTestId("mutterschaftssleistungenWer_option_0"),
      );
      await userEvent.click(screen.getByText("Weiter"));

      expect(store.getState().stepAllgemeineAngaben).toEqual(expectedState);
    });

    it("should reset alleinerziehend if Antragstellende für beide", async () => {
      const preloadedState: StepAllgemeineAngabenState = {
        ...initialStepAllgemeineAngabenState,
        antragstellende: "FuerMichSelbst",
        alleinerziehend: YesNo.YES,
      };

      store = configureStore({
        reducer: reducers,
        preloadedState: {
          stepAllgemeineAngaben: preloadedState,
        },
      });

      render(<AllgemeineAngabenPage />, { store });
      const expectedState: StepAllgemeineAngabenState = {
        ...initialStepAllgemeineAngabenState,
        antragstellende: "FuerBeide",
        alleinerziehend: null,
        mutterschaftssleistungen: YesNo.NO,
      };

      await userEvent.click(screen.getByLabelText("Für beide"));
      await userEvent.click(
        screen.getByTestId("mutterschaftssleistungen_option_1"),
      );
      await userEvent.click(screen.getByText("Weiter"));
      expect(store.getState().stepAllgemeineAngaben).toEqual(expectedState);
    });

    it("should go to the next step", async () => {
      const validFormState: StepAllgemeineAngabenState = {
        ...initialStepAllgemeineAngabenState,
        antragstellende: "FuerMichSelbst",
        alleinerziehend: YesNo.YES,
        mutterschaftssleistungen: YesNo.YES,
      };

      render(<AllgemeineAngabenPage />, {
        preloadedState: { stepAllgemeineAngaben: validFormState },
      });
      await userEvent.click(screen.getByText("Weiter"));

      expect(navigate).toHaveBeenCalledWith("/nachwuchs");
    });

    it("should show a validation error if some information is missing and not go to the next step", async () => {
      const invalidFormState: StepAllgemeineAngabenState = {
        ...initialStepAllgemeineAngabenState,
        antragstellende: "FuerMichSelbst",
        alleinerziehend: null,
        mutterschaftssleistungen: YesNo.YES,
      };
      render(<AllgemeineAngabenPage />, {
        preloadedState: { stepAllgemeineAngaben: invalidFormState },
      });

      await userEvent.click(screen.getByText("Weiter"));

      expect(navigate).not.toHaveBeenCalledWith("/nachwuchs");
      expect(
        screen.getByText("Dieses Feld ist erforderlich"),
      ).toBeInTheDocument();
    });
  });
});
