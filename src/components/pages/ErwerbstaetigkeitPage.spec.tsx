import { Store, configureStore } from "@reduxjs/toolkit";
import userEvent from "@testing-library/user-event";
import ErwerbstaetigkeitPage from "./ErwerbstaetigkeitPage";
import { RootState, reducers } from "@/redux";
import { initialStepAllgemeineAngabenState } from "@/redux/stepAllgemeineAngabenSlice";
import {
  StepErwerbstaetigkeitState,
  initialStepErwerbstaetigkeitState,
} from "@/redux/stepErwerbstaetigkeitSlice";
import { YesNo } from "@/redux/yes-no";
import { render, screen } from "@/test-utils/test-utils";

describe("Erwerbstaetigkeit Page", () => {
  it("should show the pseudonym for Elternteil 1 and 2", () => {
    const ET1 = "Finn";
    const ET2 = "Fiona";
    const state: Partial<RootState> = {
      stepAllgemeineAngaben: {
        ...initialStepAllgemeineAngabenState,
        antragstellende: "FuerBeide",
        pseudonym: {
          ET1,
          ET2,
        },
      },
    };

    render(<ErwerbstaetigkeitPage />, { preloadedState: state });

    expect(screen.getByText(ET1)).toBeInTheDocument();
    expect(screen.getByText(ET2)).toBeInTheDocument();
  });

  it("should expand the form options if Elternteil 1 is nicht Selbststaendig", async () => {
    render(<ErwerbstaetigkeitPage />);
    await userEvent.click(screen.getByTestId("ET1.vorGeburt_option_0"));
    await userEvent.click(
      screen.getByLabelText("Einkünfte aus nichtselbständiger Arbeit"),
    );

    expect(
      screen.getByText(
        "Bestand Ihre nichtselbständige Arbeit aus mehreren Tätigkeiten?",
      ),
    ).toBeInTheDocument();
    await userEvent.click(
      screen.getByTestId("ET1.mehrereTaetigkeiten_option_1"),
    );

    expect(
      screen.getByText(
        "Waren Sie in den 12 Monaten vor der Geburt Ihres Kindes sozialversicherungspflichtig?",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Hatten Sie Einkommen aus einem Mini-Job?"),
    ).toBeInTheDocument();
  });

  it("should expand the form options if Elternteil 1 is nicht Selbststaendig and mehreren Tätigkeiten", async () => {
    render(<ErwerbstaetigkeitPage />);
    await userEvent.click(screen.getByTestId("ET1.vorGeburt_option_0"));
    await userEvent.click(
      screen.getByLabelText("Einkünfte aus nichtselbständiger Arbeit"),
    );

    expect(
      screen.getByText(
        "Bestand Ihre nichtselbständige Arbeit aus mehreren Tätigkeiten?",
      ),
    ).toBeInTheDocument();

    await userEvent.click(
      screen.getByTestId("ET1.mehrereTaetigkeiten_option_0"),
    );

    expect(
      screen.queryByText(
        "Waren Sie in den 12 Monaten vor der Geburt Ihres Kindes sozialversicherungspflichtig?",
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Hatten Sie Einkommen aus einem Mini-Job?"),
    ).not.toBeInTheDocument();
  });

  describe.each([["Gewinneinkünfte"]])(
    "when Elternteil has %p",
    (selbststaendigLabeltext: string) => {
      it("should not expand the form options", async () => {
        render(<ErwerbstaetigkeitPage />);
        await userEvent.click(screen.getByTestId("ET1.vorGeburt_option_0"));
        await userEvent.click(screen.getByLabelText(selbststaendigLabeltext));

        expect(
          screen.queryByText(
            "Waren Sie in den 12 Monaten vor der Geburt Ihres Kindes sozialversicherungspflichtig?",
          ),
        ).not.toBeInTheDocument();
        expect(
          screen.queryByText("Hatten Sie Einkommen aus einem Mini-Job?"),
        ).not.toBeInTheDocument();
      });

      it("should not expand the form options for Mischeinkommen", async () => {
        render(<ErwerbstaetigkeitPage />);
        await userEvent.click(screen.getByTestId("ET1.vorGeburt_option_0"));
        await userEvent.click(
          screen.getByLabelText("Einkünfte aus nichtselbständiger Arbeit"),
        );
        await userEvent.click(screen.getByLabelText(selbststaendigLabeltext));

        expect(
          screen.queryByText(
            "Waren Sie in den 12 Monaten vor der Geburt Ihres Kindes sozialversicherungspflichtig?",
          ),
        ).not.toBeInTheDocument();
        expect(
          screen.queryByText("Hatten Sie Einkommen aus einem Mini-Job?"),
        ).not.toBeInTheDocument();
      });
    },
  );

  describe("Submitting the form", () => {
    let store: Store<RootState>;

    beforeEach(() => {
      store = configureStore({ reducer: reducers });
    });

    it("should persist the step", async () => {
      const state: Partial<RootState> = {
        stepAllgemeineAngaben: {
          ...initialStepAllgemeineAngabenState,
          antragstellende: "FuerBeide",
        },
      };
      const expectedState: StepErwerbstaetigkeitState = {
        ET1: {
          ...initialStepErwerbstaetigkeitState.ET1,
          vorGeburt: YesNo.YES,
          isNichtSelbststaendig: true,
          mehrereTaetigkeiten: YesNo.NO,
          sozialVersicherungsPflichtig: YesNo.YES,
          monatlichesBrutto: "MehrAlsMiniJob",
        },
        ET2: {
          ...initialStepErwerbstaetigkeitState.ET2,
          vorGeburt: YesNo.NO,
        },
      };
      store = configureStore({ reducer: reducers, preloadedState: state });

      render(<ErwerbstaetigkeitPage />, { store });

      // ET1:
      await userEvent.click(screen.getByTestId("ET1.vorGeburt_option_0"));
      await userEvent.click(
        screen.getByLabelText("Einkünfte aus nichtselbständiger Arbeit"),
      );
      await userEvent.click(
        screen.getByTestId("ET1.mehrereTaetigkeiten_option_1"),
      );
      await userEvent.click(
        screen.getByTestId("ET1.sozialVersicherungsPflichtig_option_0"),
      );
      await userEvent.click(
        screen.getByTestId("ET1.monatlichesBrutto_option_1"),
      );

      // ET2:
      await userEvent.click(screen.getByTestId("ET2.vorGeburt_option_1"));

      await userEvent.click(screen.getByText("Weiter"));

      expect(store.getState().stepErwerbstaetigkeit).toEqual(expectedState);
    });

    it("should persist the step for mehreren Tätigkeiten", async () => {
      const state: Partial<RootState> = {
        stepAllgemeineAngaben: {
          ...initialStepAllgemeineAngabenState,
          antragstellende: "FuerBeide",
        },
      };
      const expectedState: StepErwerbstaetigkeitState = {
        ET1: {
          ...initialStepErwerbstaetigkeitState.ET1,
          vorGeburt: YesNo.YES,
          isNichtSelbststaendig: true,
          mehrereTaetigkeiten: YesNo.YES,
          sozialVersicherungsPflichtig: null,
          monatlichesBrutto: null,
        },
        ET2: {
          ...initialStepErwerbstaetigkeitState.ET2,
          vorGeburt: YesNo.NO,
        },
      };
      store = configureStore({ reducer: reducers, preloadedState: state });

      render(<ErwerbstaetigkeitPage />, { store });

      // ET1:
      await userEvent.click(screen.getByTestId("ET1.vorGeburt_option_0"));
      await userEvent.click(
        screen.getByLabelText("Einkünfte aus nichtselbständiger Arbeit"),
      );
      await userEvent.click(
        screen.getByTestId("ET1.mehrereTaetigkeiten_option_0"),
      );

      // ET2:
      await userEvent.click(screen.getByTestId("ET2.vorGeburt_option_1"));

      await userEvent.click(screen.getByText("Weiter"));

      expect(store.getState().stepErwerbstaetigkeit).toEqual(expectedState);
    });
  });
});
