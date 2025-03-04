import { Store, configureStore } from "@reduxjs/toolkit";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import AllgemeineAngabenPage from "./AllgemeineAngabenPage";
import { RootState, reducers } from "@/redux";
import {
  StepAllgemeineAngabenState,
  initialStepAllgemeineAngabenState,
} from "@/redux/stepAllgemeineAngabenSlice";
import { YesNo } from "@/redux/yes-no";
import { render, screen } from "@/test-utils/test-utils";

describe("Allgemeine Angaben Page", () => {
  it("should display the Alleinerziehendenstatus part of the form right away", () => {
    render(<AllgemeineAngabenPage />);

    expect(screen.getByText("Alleinerziehendenstatus")).toBeInTheDocument();
  });

  it("should display the Antragstellenden part of the form after the Alleinerziehendenstatus", async () => {
    render(<AllgemeineAngabenPage />);

    await userEvent.click(screen.getByLabelText("Nein"));

    expect(screen.getByText("Eltern")).toBeInTheDocument();
  });

  it("should display the optional naming part of the form after the Antragstellenden part", async () => {
    render(<AllgemeineAngabenPage />);

    await userEvent.click(screen.getByLabelText("Nein"));

    await userEvent.click(screen.getByLabelText("Für zwei Elternteile"));

    expect(screen.getByText("Ihre Namen (optional)")).toBeInTheDocument();
  });

  it("should ask for Mutterschaftssleistungen if Gemeinsam Erziehende", async () => {
    render(<AllgemeineAngabenPage />);

    await userEvent.click(screen.getByLabelText("Nein"));

    await userEvent.click(screen.getByLabelText("Für zwei Elternteile"));

    expect(screen.getByText("Mutterschaftsleistungen")).toBeInTheDocument();
  });

  it("should ask for Mutterschaftssleistungen if Alleinerziehend", async () => {
    render(<AllgemeineAngabenPage />);

    await userEvent.click(screen.getByLabelText("Ja"));

    expect(screen.getByText("Mutterschaftsleistungen")).toBeInTheDocument();
  });

  it("should ask to whom Mutterschaftsleistungen belongs if Gemeinsam Erziehende", async () => {
    render(<AllgemeineAngabenPage />);

    await userEvent.click(screen.getByLabelText("Nein"));

    await userEvent.click(screen.getByLabelText("Für zwei Elternteile"));

    await userEvent.click(
      screen.getByTestId("mutterschaftssleistungen_option_0"),
    );

    expect(
      screen.getByText(
        "Welcher Elternteil ist oder wird im Mutterschutz sein?",
      ),
    ).toBeInTheDocument();
  });

  it("should not ask to whom Mutterschaftsleistungen belongs if Alleinerziehend", async () => {
    render(<AllgemeineAngabenPage />);

    await userEvent.click(screen.getByLabelText("Ja"));

    await userEvent.click(
      screen.getByTestId("mutterschaftssleistungen_option_0"),
    );

    expect(
      screen.queryByText(
        "Welcher Elternteil ist oder wird im Mutterschutz sein?",
      ),
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

      await userEvent.click(screen.getByLabelText("Ja"));

      await userEvent.click(
        screen.getByTestId("mutterschaftssleistungen_option_0"),
      );

      await userEvent.click(screen.getByText("Weiter"));

      expect(store.getState().stepAllgemeineAngaben).toEqual(expectedState);
    });

    it("should persist the pseudonym", async () => {
      render(<AllgemeineAngabenPage />, { store });
      const expectedState: StepAllgemeineAngabenState = {
        ...initialStepAllgemeineAngabenState,
        alleinerziehend: YesNo.NO,
        antragstellende: "FuerBeide",
        mutterschaftssleistungen: YesNo.YES,
        mutterschaftssleistungenWer: "ET1",
        pseudonym: {
          ET1: "Finn",
          ET2: "Fiona",
        },
      };

      await userEvent.click(screen.getByLabelText("Nein"));

      await userEvent.click(screen.getByLabelText("Für zwei Elternteile"));

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
        alleinerziehend: YesNo.NO,
        mutterschaftssleistungen: YesNo.NO,
      };

      await userEvent.click(screen.getByLabelText("Nein"));

      await userEvent.click(screen.getByLabelText("Für zwei Elternteile"));

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
