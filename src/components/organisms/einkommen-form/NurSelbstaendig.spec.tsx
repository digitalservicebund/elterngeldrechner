import userEvent from "@testing-library/user-event";
import { render, screen, within } from "@/test-utils/test-utils";
import { RootState } from "@/redux";
import EinkommenPage from "@/components/pages/EinkommenPage";
import {
  initialStepErwerbstaetigkeitState,
  StepErwerbstaetigkeitElternteil,
  StepErwerbstaetigkeitState,
} from "@/redux/stepErwerbstaetigkeitSlice";
import { initialStepNachwuchsState } from "@/redux/stepNachwuchsSlice";
import {
  initialStepEinkommenState,
  StepEinkommenState,
} from "@/redux/stepEinkommenSlice";
import { RentenArt, YesNo } from "@/globals/js/calculations/model";
import { initialStepAllgemeineAngabenState } from "@/redux/stepAllgemeineAngabenSlice";

const elternteil1Erwerbstaetigkeit: StepErwerbstaetigkeitElternteil = {
  ...initialStepErwerbstaetigkeitState.ET1,
  monatlichesBrutto: "MehrAlsMiniJob",
};

const stateFromPreviousSteps: Partial<RootState> = {
  stepAllgemeineAngaben: {
    ...initialStepAllgemeineAngabenState,
    antragstellende: "FuerBeide",
    pseudonym: {
      ET1: "Elternteil 1",
      ET2: "Elternteil 2",
    },
  },
  stepNachwuchs: {
    ...initialStepNachwuchsState,
    wahrscheinlichesGeburtsDatum: "08.08.2022",
  },
  stepErwerbstaetigkeit: {
    ...initialStepErwerbstaetigkeitState,
    ET1: elternteil1Erwerbstaetigkeit,
  },
};

describe("Einkommens Page only with block Nur Selbständig", () => {
  const getElternteil1Section = () => screen.getByLabelText("Elternteil 1");
  const getEinkommenAusSelbstaendigkeitElternteil1Section = () =>
    within(getElternteil1Section()).getByLabelText("Gewinneinkünfte");

  const getRentenversicherungElternteil1Section = () =>
    within(getElternteil1Section()).getByLabelText("Rentenversicherung");

  it("should not show Einkommen aus Selbstständigkeit if the user does have nicht-selbständige Tätigkeit", () => {
    const state: Partial<RootState> = {
      ...stateFromPreviousSteps,
      stepErwerbstaetigkeit: {
        ...(stateFromPreviousSteps.stepErwerbstaetigkeit as StepErwerbstaetigkeitState),
        ET1: {
          ...elternteil1Erwerbstaetigkeit,
          isNichtSelbststaendig: true,
        },
      },
    };

    render(<EinkommenPage />, { preloadedState: state });

    expect(
      within(getElternteil1Section()).queryByText("Gewinneinkünfte"),
    ).not.toBeInTheDocument();
  });

  it("should not show Einkommen aus Selbstständigkeit if the user does not have selbständige Tätigkeit", () => {
    const state: Partial<RootState> = {
      ...stateFromPreviousSteps,
      stepErwerbstaetigkeit: {
        ...(stateFromPreviousSteps.stepErwerbstaetigkeit as StepErwerbstaetigkeitState),
        ET1: {
          ...elternteil1Erwerbstaetigkeit,
          isNichtSelbststaendig: false,
          isSelbststaendig: false,
        },
      },
    };

    render(<EinkommenPage />, { preloadedState: state });

    expect(
      within(getElternteil1Section()).queryByText("Gewinneinkünfte"),
    ).not.toBeInTheDocument();
  });

  describe("has only selbständige Tätigkeit", () => {
    const stateWithOnlySelbstaendig: Partial<RootState> = {
      ...stateFromPreviousSteps,
      stepErwerbstaetigkeit: {
        ...(stateFromPreviousSteps.stepErwerbstaetigkeit as StepErwerbstaetigkeitState),
        ET1: {
          ...elternteil1Erwerbstaetigkeit,
          vorGeburt: YesNo.YES,
          isNichtSelbststaendig: false,
          isSelbststaendig: true,
        },
      },
    };

    it("should show Einkommen aus Selbstständigkeit", () => {
      render(<EinkommenPage />, {
        preloadedState: stateWithOnlySelbstaendig,
      });

      expect(
        within(getElternteil1Section()).getByLabelText("Gewinneinkünfte"),
      ).toBeInTheDocument();
    });

    describe("Validation of form", () => {
      const validStateEinkommen: StepEinkommenState = {
        ...initialStepEinkommenState,
        ET1: {
          ...initialStepEinkommenState.ET1,
          gewinnSelbstaendig: {
            type: "yearly",
            average: null,
            perYear: 12000,
            perMonth: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
          },
          rentenVersicherung: RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG,
        },
      };

      it("should require the Gewinn selbständige Tätigkeit", async () => {
        render(<EinkommenPage />, {
          preloadedState: {
            ...stateWithOnlySelbstaendig,
            stepEinkommen: validStateEinkommen,
          },
        });
        const einkommenAusSelbstaendigkeitSection =
          getEinkommenAusSelbstaendigkeitElternteil1Section();

        const gewinnField = within(
          einkommenAusSelbstaendigkeitSection,
        ).getByLabelText(/Gewinn im Kalenderjahr vor der Geburt/);

        await userEvent.clear(gewinnField);
        await userEvent.click(screen.getByText("Weiter"));

        expect(
          within(einkommenAusSelbstaendigkeitSection).getByText(
            "Dieses Feld ist erforderlich",
          ),
        ).toBeInTheDocument();
      });

      it("should require the Rentenversicherung", async () => {
        const invalidState: StepEinkommenState = {
          ...validStateEinkommen,
          ET1: {
            ...validStateEinkommen.ET1,
            rentenVersicherung: null,
          },
        };
        render(<EinkommenPage />, {
          preloadedState: {
            ...stateWithOnlySelbstaendig,
            stepEinkommen: invalidState,
          },
        });

        const rentenversicherungSection =
          getRentenversicherungElternteil1Section();

        await userEvent.click(screen.getByText("Weiter"));

        expect(
          within(rentenversicherungSection).getByText(
            "Dieses Feld ist erforderlich",
          ),
        ).toBeInTheDocument();
      });
    });
  });
});
