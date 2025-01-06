import { Store, configureStore } from "@reduxjs/toolkit";
import userEvent from "@testing-library/user-event";
import AllgemeineAngabenPage from "./AllgemeineAngabenPage";
import { RootState, reducers } from "@/redux";
import {
  StepAllgemeineAngabenState,
  initialStepAllgemeineAngabenState,
} from "@/redux/stepAllgemeineAngabenSlice";
import { YesNo } from "@/redux/yes-no";
import { render, screen } from "@/test-utils/test-utils";

describe("Allgemeine Angaben Page", () => {
  it("should display the optional naming part of the form, if 'Für beide' is chosen", async () => {
    render(<AllgemeineAngabenPage />);

    await userEvent.click(screen.getByLabelText("Für beide"));

    expect(screen.getByText("Ihre Namen (optional)")).toBeInTheDocument();
  });

  it("should display the Alleinerziehendenstatus part of the form, if 'Ein Elternteil' is chosen", async () => {
    render(<AllgemeineAngabenPage />);

    await userEvent.click(screen.getByLabelText("Für einen Elternteil"));

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

  it("should NOT display mutterschaftssleistungenWer if 'Ein Elternteil' and 'mutterschaftssleistungen_option_0' are choosen", async () => {
    render(<AllgemeineAngabenPage />);

    await userEvent.click(screen.getByLabelText("Für einen Elternteil"));
    await userEvent.click(
      screen.getByTestId("mutterschaftssleistungen_option_0"),
    );

    expect(
      screen.queryByText("Welcher Elternteil bezieht Mutterschaftsleistungen?"),
    ).not.toBeInTheDocument();
  });

  describe("Submitting the form", () => {
    let store: Store<RootState>;

    beforeEach(() => {
      store = configureStore({ reducer: reducers });
    });

    it("should persist the step", async () => {
      render(<AllgemeineAngabenPage />, { store });
      const expectedState: StepAllgemeineAngabenState = {
        ...initialStepAllgemeineAngabenState,
        antragstellende: "EinenElternteil",
        alleinerziehend: YesNo.YES,
        mutterschaftssleistungen: YesNo.YES,
      };

      await userEvent.click(screen.getByLabelText("Für einen Elternteil"));
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
        antragstellende: "EinenElternteil",
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

      it("does not show selection which parent receives Mutterschaftsleistung if a single applicant receives Mutterschaftsleistungen", async () => {
        render(<AllgemeineAngabenPage />, { store });

        await userEvent.click(screen.getByLabelText("Für einen Elternteil"));
        await userEvent.click(
          screen.getByTestId("mutterschaftssleistungen_option_0"),
        );

        expect(
          screen.queryByText(
            "Welcher Elternteil bezieht Mutterschaftsleistungen?",
          ),
        ).not.toBeInTheDocument();
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
        antragstellende: "EinenElternteil",
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

    it("should show a validation error if some information is missing", async () => {
      const invalidFormState: StepAllgemeineAngabenState = {
        ...initialStepAllgemeineAngabenState,
        antragstellende: "EinenElternteil",
        alleinerziehend: null,
        mutterschaftssleistungen: YesNo.YES,
      };
      render(<AllgemeineAngabenPage />, {
        preloadedState: { stepAllgemeineAngaben: invalidFormState },
      });

      await userEvent.click(screen.getByText("Weiter"));

      expect(
        screen.getByText("Dieses Feld ist erforderlich"),
      ).toBeInTheDocument();
    });
  });
});
