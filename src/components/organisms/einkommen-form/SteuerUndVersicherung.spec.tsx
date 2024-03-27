import userEvent from "@testing-library/user-event";
import { RootState } from "../../../redux";
import { render, screen, within } from "../../../test-utils/test-utils";
import EinkommenPage from "../../pages/EinkommenPage";
import { initialStepErwerbstaetigkeitState } from "../../../redux/stepErwerbstaetigkeitSlice";
import {
  initialStepNachwuchsState,
  StepNachwuchsState,
} from "../../../redux/stepNachwuchsSlice";
import {
  initialStepEinkommenState,
  StepEinkommenState,
} from "../../../redux/stepEinkommenSlice";
import {
  KinderFreiBetrag,
  RentenArt,
  SteuerKlasse,
  YesNo,
} from "../../../globals/js/calculations/model";

describe("Steuer und Versicherung", () => {
  const getElternteil1Section = () => screen.getByLabelText("Elternteil 1");

  const stateFromPreviousSteps: Partial<RootState> = {
    stepNachwuchs: {
      ...initialStepNachwuchsState,
      wahrscheinlichesGeburtsDatum: "08.08.2022",
      geschwisterkinder: [
        {
          geburtsdatum: "12.06.2016",
          istBehindert: false,
        },
      ],
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

  it("should show the relevant form blocks if user is only 'erwerbstätig' and earns more than 520 Euro monthly", () => {
    render(<EinkommenPage />, { preloadedState: stateFromPreviousSteps });
    const elternteil1Section = getElternteil1Section();

    const steuerklasse =
      within(elternteil1Section).getByText(/welche Steuerklasse/i);
    const kinderfreibetraege = within(elternteil1Section).getByText(
      /^wie viele Kinderfreibeträge/i,
    );
    const kirchensteuer = within(elternteil1Section).getByText(
      /^sind Sie kirchensteuerpflichtig/i,
    );
    const krankenversicherung = within(elternteil1Section).getByText(
      /^wie sind Sie krankenversichert/i,
    );

    expect(steuerklasse).toBeInTheDocument();
    expect(kinderfreibetraege).toBeInTheDocument();
    expect(kirchensteuer).toBeInTheDocument();
    expect(krankenversicherung).toBeInTheDocument();
  });
  describe("Kinderfreibeträge", () => {
    const stateWithNoGeschwisterKind: Partial<RootState> = {
      ...stateFromPreviousSteps,
      stepNachwuchs: {
        ...(stateFromPreviousSteps.stepNachwuchs as StepNachwuchsState),
        geschwisterkinder: [],
      },
    };

    it("should show Kinderfreibeitrag if there is at least one Geschwisterkind", () => {
      render(<EinkommenPage />, { preloadedState: stateFromPreviousSteps });
      const elternteil1Section = getElternteil1Section();

      const einkommenElternteil1KinderfreibetraegeSection =
        within(elternteil1Section).getByLabelText("Kinderfreibeträge");

      expect(
        within(einkommenElternteil1KinderfreibetraegeSection).getByRole(
          "combobox",
          {
            name: /^wie viele Kinderfreibeträge/i,
          },
        ),
      ).toBeInTheDocument();
    });

    it("should not show Kinderfreibeitrag if there is no Geschwisterkind", () => {
      render(<EinkommenPage />, {
        preloadedState: stateWithNoGeschwisterKind,
      });
      const elternteil1Section = getElternteil1Section();

      const einkommenElternteil1KinderfreibetraegeSection =
        within(elternteil1Section).queryByLabelText("Kinderfreibeträge");

      expect(
        einkommenElternteil1KinderfreibetraegeSection,
      ).not.toBeInTheDocument();
    });
  });

  describe("Validation of form", () => {
    const validStepEinkommenState: StepEinkommenState = {
      ...initialStepEinkommenState,
      ET1: {
        ...initialStepEinkommenState.ET1,
        steuerKlasse: SteuerKlasse.SKL1,
        kinderFreiBetrag: KinderFreiBetrag.ZKF1,
        rentenVersicherung: RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG,
      },
    };

    const validFormStateNurErwerbstaetig: Partial<RootState> = {
      ...stateFromPreviousSteps,
      stepEinkommen: validStepEinkommenState,
    };

    it("should only accept if a Steuerklasse is selected", async () => {
      const formStateWithoutSteuerklasse = {
        ...validFormStateNurErwerbstaetig,
        stepEinkommen: {
          ...validStepEinkommenState,
          ET1: {
            ...validStepEinkommenState.ET1,
            steuerKlasse: null,
          },
        },
      };

      render(<EinkommenPage />, {
        preloadedState: formStateWithoutSteuerklasse,
      });

      const elternteil1Section = getElternteil1Section();
      const nextPageBtn = screen.getByRole("button", { name: "Weiter" });
      const inputField = within(elternteil1Section).getByLabelText(
        "Welche Steuerklasse haben Sie?",
      );

      await userEvent.click(nextPageBtn);
      const error = within(elternteil1Section).getByText(
        "Eine Option muss ausgewählt sein",
      );
      expect(error).toBeInTheDocument();

      await userEvent.selectOptions(inputField, "1");
      const error2 = within(elternteil1Section).queryByText(
        "Eine Option muss ausgewählt sein",
      );
      expect(error2).not.toBeInTheDocument();
    });

    it("should only accept if Kinderfreibeträge is selected", async () => {
      const formStateWithoutKinderfreibetraege = {
        ...validFormStateNurErwerbstaetig,
        stepEinkommen: {
          ...validStepEinkommenState,
          ET1: {
            ...validStepEinkommenState.ET1,
            kinderFreiBetrag: null,
          },
        },
      };
      render(<EinkommenPage />, {
        preloadedState: formStateWithoutKinderfreibetraege,
      });
      const elternteil1Section = getElternteil1Section();
      const nextPageBtn = screen.getByRole("button", { name: "Weiter" });
      const inputField = within(elternteil1Section).getByLabelText(
        /^wie viele Kinderfreibeträge/i,
      );

      await userEvent.click(nextPageBtn);
      const error = within(elternteil1Section).getByText(
        "Eine Option muss ausgewählt sein",
      );
      expect(error).toBeInTheDocument();

      await userEvent.selectOptions(inputField, "1,0");
      const error2 = within(elternteil1Section).queryByText(
        "Eine Option muss ausgewählt sein",
      );
      expect(error2).not.toBeInTheDocument();
    });

    it("should only accept if Kirchensteuer is selected", async () => {
      render(<EinkommenPage />, {
        preloadedState: {
          ...validFormStateNurErwerbstaetig,
          stepEinkommen: {
            ...validStepEinkommenState,
            ET1: {
              ...validStepEinkommenState.ET1,
              zahlenSieKirchenSteuer: null,
            },
          },
        },
      });
      const elternteil1Section = getElternteil1Section();

      const kirchensteuerSection =
        within(elternteil1Section).getByLabelText("Kirchensteuer");

      const nextPageBtn = screen.getByRole("button", { name: "Weiter" });
      await userEvent.click(nextPageBtn);
      const error = within(kirchensteuerSection).getByText(
        "Dieses Feld ist erforderlich",
      );
      expect(error).toBeInTheDocument();

      const inputKirchensteuer =
        within(kirchensteuerSection).getByLabelText("Ja");
      await userEvent.click(inputKirchensteuer);
      const error2 = within(kirchensteuerSection).queryByText(
        "Dieses Feld ist erforderlich",
      );
      expect(error2).not.toBeInTheDocument();
    });

    it("should only accept if Krankenversicherung is selected", async () => {
      render(<EinkommenPage />, {
        preloadedState: {
          ...validFormStateNurErwerbstaetig,
          stepEinkommen: {
            ...validStepEinkommenState,
            ET1: {
              ...validStepEinkommenState.ET1,
              kassenArt: null,
            },
          },
        },
      });
      const elternteil1Section = getElternteil1Section();

      const krankenversicherungSection = within(
        elternteil1Section,
      ).getByLabelText("Krankenversicherung");

      const nextPageBtn = screen.getByRole("button", { name: "Weiter" });
      await userEvent.click(nextPageBtn);
      const error = within(krankenversicherungSection).getByText(
        "Dieses Feld ist erforderlich",
      );
      expect(error).toBeInTheDocument();

      const inputKrankenversicherung = within(
        krankenversicherungSection,
      ).getByLabelText("gesetzlich pflichtversichert");
      await userEvent.click(inputKrankenversicherung);
      const error2 = within(krankenversicherungSection).queryByText(
        "Dieses Feld ist erforderlich",
      );
      expect(error2).not.toBeInTheDocument();
    });
  });
});
