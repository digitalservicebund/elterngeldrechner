import userEvent from "@testing-library/user-event";
import EinkommenPage from "@/components/pages/EinkommenPage";
import { RootState } from "@/redux";
import { initialStepAllgemeineAngabenState } from "@/redux/stepAllgemeineAngabenSlice";
import {
  StepEinkommenState,
  initialStepEinkommenState,
} from "@/redux/stepEinkommenSlice";
import { initialStepErwerbstaetigkeitState } from "@/redux/stepErwerbstaetigkeitSlice";
import { initialStepNachwuchsState } from "@/redux/stepNachwuchsSlice";
import { YesNo } from "@/redux/yes-no";
import { render, screen, within } from "@/test-utils/test-utils";

describe("Einkommens Page only with block Erwerbstätigkeit", () => {
  const getElternteil1Section = () => screen.getByLabelText("Elternteil 1");

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
      ET1: {
        ...initialStepErwerbstaetigkeitState.ET1,
        vorGeburt: YesNo.YES,
        isNichtSelbststaendig: true,
        isSelbststaendig: false,
        monatlichesBrutto: "MehrAlsMiniJob",
      },
    },
  };

  it("should show the relevant form blocks if user is only 'erwerbstätig' and its no 'Mini-Job'", () => {
    render(<EinkommenPage />, { preloadedState: stateFromPreviousSteps });
    const elternteil1Section = getElternteil1Section();

    const bruttoEinkommen = within(elternteil1Section).getByText(
      /^wie viel haben Sie in den 12 Kalendermonaten vor der Geburt Ihres Kindes monatlich brutto verdient/i,
    );

    expect(bruttoEinkommen).toBeInTheDocument();
  });

  describe("Ausführliche Eingabe", () => {
    it("should open the 'ausführliche Eingabe' on click", async () => {
      render(<EinkommenPage />, { preloadedState: stateFromPreviousSteps });
      const elternteil1Section = getElternteil1Section();

      const buttonZurAusfuerlichen = within(elternteil1Section).getByRole(
        "button",
        {
          name: /^zur ausführlichen Eingabe$/i,
        },
      );
      await userEvent.click(buttonZurAusfuerlichen);

      const buttonZurEinfachen = within(elternteil1Section).getByRole(
        "button",
        {
          name: /^zur einfachen Eingabe$/i,
        },
      );
      expect(buttonZurEinfachen).toBeInTheDocument();
    });

    it("should show 12 month before the birth", async () => {
      render(<EinkommenPage />, { preloadedState: stateFromPreviousSteps });
      const elternteil1Section = getElternteil1Section();

      const buttonZurAusfuerlichen = within(elternteil1Section).getByRole(
        "button",
        {
          name: /^zur ausführlichen Eingabe$/i,
        },
      );
      await userEvent.click(buttonZurAusfuerlichen);

      for (let monthIndex = 1; monthIndex <= 12; monthIndex++) {
        expect(
          within(elternteil1Section).getByLabelText(`${monthIndex}. Monat`),
        ).toBeInTheDocument();
      }
    });

    it("should hide the 12 month before the birth", async () => {
      render(<EinkommenPage />, { preloadedState: stateFromPreviousSteps });
      const elternteil1Section = getElternteil1Section();

      const buttonZurAusfuerlichen = within(elternteil1Section).getByRole(
        "button",
        {
          name: /^zur ausführlichen Eingabe$/i,
        },
      );
      await userEvent.click(buttonZurAusfuerlichen);

      const buttonZurEinfachen = within(elternteil1Section).getByRole(
        "button",
        {
          name: /^zur einfachen Eingabe$/i,
        },
      );
      await userEvent.click(buttonZurEinfachen);

      const einkommenElternteil1 = within(elternteil1Section).queryByLabelText(
        "Einkommen pro Monat",
      );
      expect(einkommenElternteil1).not.toBeInTheDocument();
    });
  });

  describe("Validation of form", () => {
    const validStepEinkommenState: StepEinkommenState = {
      ...initialStepEinkommenState,
      ET1: {
        ...initialStepEinkommenState.ET1,
        bruttoEinkommenNichtSelbstaendig: {
          type: "average",
          average: 1000,
          perYear: null,
          perMonth: [
            1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000,
            1000,
          ],
        },
      },
    };

    const validFormStateNurErwerbstaetig: Partial<RootState> = {
      ...stateFromPreviousSteps,
      stepEinkommen: validStepEinkommenState,
    };

    it("should require the Brutto Einkommen", async () => {
      render(<EinkommenPage />, {
        preloadedState: validFormStateNurErwerbstaetig,
      });
      const elternteil1Section = getElternteil1Section();

      const erwerbstaetigkeiVorGeburtSection = within(
        elternteil1Section,
      ).getByLabelText("Einkünfte aus nichtselbständiger Arbeit");

      const nextPageBtn = screen.getByRole("button", { name: "Weiter" });

      const inputField = screen.getByLabelText(
        /^wie viel haben Sie in den 12 Kalendermonaten vor der Geburt Ihres Kindes monatlich brutto verdient/i,
      );
      await userEvent.clear(inputField);
      await userEvent.click(nextPageBtn);
      const error = within(erwerbstaetigkeiVorGeburtSection).queryByText(
        "Dieses Feld ist erforderlich",
      );
      expect(error).toBeInTheDocument();
    });
  });
});
