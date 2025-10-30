import userEvent from "@testing-library/user-event";
import { produce } from "immer";
import { describe, expect, it } from "vitest";
import { YesNo } from "@/application/features/abfrageteil/state";
import { EinkommenPage } from "@/application/pages";
import {
  INITIAL_STATE,
  render,
  screen,
  within,
} from "@/application/test-utils";
import { KinderFreiBetrag, RentenArt, Steuerklasse } from "@/elterngeldrechner";

describe("Steuer und Versicherung", () => {
  const getElternteil1Section = () => screen.getByLabelText("Elternteil 1");

  const stateFromPreviousSteps = produce(INITIAL_STATE, (draft) => {
    draft.stepAllgemeineAngaben.antragstellende = "FuerBeide";
    draft.stepAllgemeineAngaben.pseudonym = {
      ET1: "Elternteil 1",
      ET2: "Elternteil 2",
    };
    draft.stepNachwuchs.wahrscheinlichesGeburtsDatum = "08.08.2022";
    draft.stepNachwuchs.geschwisterkinder = [
      {
        geburtsdatum: "12.06.2016",
        istBehindert: false,
      },
    ];
    draft.stepErwerbstaetigkeit.ET1.vorGeburt = YesNo.YES;
    draft.stepErwerbstaetigkeit.ET1.isNichtSelbststaendig = true;
    draft.stepErwerbstaetigkeit.ET1.isSelbststaendig = false;
    draft.stepErwerbstaetigkeit.ET1.monatlichesBrutto = "MehrAlsMiniJob";
  });

  it("should show the relevant form blocks if user is only 'erwerbstätig' and its no 'Mini-Job'", () => {
    render(<EinkommenPage />, { preloadedState: stateFromPreviousSteps });
    const elternteil1Section = getElternteil1Section();

    const steuerklasse =
      within(elternteil1Section).getByText(/welche Steuerklasse/i);
    const kinderfreibetraege = within(elternteil1Section).getByText(
      /^wie viele Kinderfreibeträge/i,
    );
    const kirchensteuer = within(elternteil1Section).getByText(
      /kirchensteuerpflichtig/i,
    );
    const krankenversicherung = within(elternteil1Section).getByText(
      /gesetzlich pflichtversichert/i,
    );

    expect(steuerklasse).toBeInTheDocument();
    expect(kinderfreibetraege).toBeInTheDocument();
    expect(kirchensteuer).toBeInTheDocument();
    expect(krankenversicherung).toBeInTheDocument();
  });
  describe("Kinderfreibeträge", () => {
    const stateWithNoGeschwisterKind = produce(
      stateFromPreviousSteps,
      (draft) => {
        draft.stepNachwuchs.geschwisterkinder = [];
      },
    );

    it("should show Kinderfreibeitrag if there is at least one Geschwisterkind", () => {
      render(<EinkommenPage />, { preloadedState: stateFromPreviousSteps });
      const elternteil1Section = getElternteil1Section();

      expect(
        within(elternteil1Section).getByRole("combobox", {
          name: /^wie viele Kinderfreibeträge/i,
        }),
      ).toBeInTheDocument();
    });

    it("should not show Kinderfreibeitrag if there is no Geschwisterkind", () => {
      render(<EinkommenPage />, {
        preloadedState: stateWithNoGeschwisterKind,
      });
      const elternteil1Section = getElternteil1Section();

      const kinderfreibetraege = within(elternteil1Section).queryByText(
        /^wie viele Kinderfreibeträge/i,
      );

      expect(kinderfreibetraege).not.toBeInTheDocument();
    });
  });

  describe("Validation of form", () => {
    const validFormStateNurErwerbstaetig = produce(
      stateFromPreviousSteps,
      (draft) => {
        draft.stepEinkommen.ET1.steuerklasse = Steuerklasse.I;
        draft.stepEinkommen.ET1.kinderFreiBetrag = KinderFreiBetrag.ZKF1;
        draft.stepEinkommen.ET1.rentenVersicherung =
          RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG;
      },
    );

    it("should only accept if a Steuerklasse is selected", async () => {
      const formStateWithoutSteuerklasse = produce(
        validFormStateNurErwerbstaetig,
        (draft) => {
          draft.stepEinkommen.ET1.steuerklasse = null;
        },
      );

      render(<EinkommenPage />, {
        preloadedState: formStateWithoutSteuerklasse,
      });

      const elternteil1Section = getElternteil1Section();
      const nextPageBtn = screen.getByRole("button", { name: "Weiter" });
      const inputField = within(elternteil1Section).getByLabelText(
        "Welche Steuerklasse hatte Elternteil 1 in den letzten 12 Monaten?",
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
      const formStateWithoutKinderfreibetraege = produce(
        validFormStateNurErwerbstaetig,
        (draft) => {
          draft.stepEinkommen.ET1.kinderFreiBetrag = null;
        },
      );

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
      const preloadedState = produce(
        validFormStateNurErwerbstaetig,
        (draft) => {
          draft.stepEinkommen.ET1.zahlenSieKirchenSteuer = null;
        },
      );

      render(<EinkommenPage />, { preloadedState });

      const elternteil1Section = getElternteil1Section();

      const kirchensteuerSection = within(elternteil1Section)
        .getByText(/kirchensteuerpflichtig/i, { selector: "legend" })
        .closest("fieldset") as HTMLElement;

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
      const preloadedState = produce(
        validFormStateNurErwerbstaetig,
        (draft) => {
          draft.stepEinkommen.ET1.kassenArt = null;
        },
      );

      render(<EinkommenPage />, { preloadedState });

      const elternteil1Section = getElternteil1Section();

      const krankenversicherungSection = within(elternteil1Section)
        .getByText(/gesetzlich pflichtversichert/i, {
          selector: "legend",
        })
        .closest("fieldset") as HTMLElement;

      const nextPageBtn = screen.getByRole("button", { name: "Weiter" });
      await userEvent.click(nextPageBtn);
      const error = within(krankenversicherungSection).getByText(
        "Dieses Feld ist erforderlich",
      );
      expect(error).toBeInTheDocument();

      const inputKrankenversicherung = within(
        krankenversicherungSection,
      ).getByLabelText("Ja");
      await userEvent.click(inputKrankenversicherung);
      const error2 = within(krankenversicherungSection).queryByText(
        "Dieses Feld ist erforderlich",
      );
      expect(error2).not.toBeInTheDocument();
    });
  });
});
