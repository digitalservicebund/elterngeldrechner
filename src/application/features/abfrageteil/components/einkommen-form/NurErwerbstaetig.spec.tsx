import userEvent from "@testing-library/user-event";
import { produce } from "immer";
import { describe, expect, it } from "vitest";
import { EinkommenForm } from "./EinkommenForm";
import { YesNo } from "@/application/features/abfrageteil/state";
import {
  INITIAL_STATE,
  render,
  screen,
  within,
} from "@/application/test-utils";

describe("Einkommens Page only with block Erwerbstätigkeit", () => {
  const getElternteil1Section = () => screen.getByLabelText("Elternteil 1");

  const stateFromPreviousSteps = produce(INITIAL_STATE, (draft) => {
    draft.stepAllgemeineAngaben.antragstellende = "FuerBeide";
    draft.stepAllgemeineAngaben.pseudonym = {
      ET1: "Elternteil 1",
      ET2: "Elternteil 2",
    };
    draft.stepNachwuchs.wahrscheinlichesGeburtsDatum = "08.08.2022";
    draft.stepErwerbstaetigkeit.ET1.vorGeburt = YesNo.YES;
    draft.stepErwerbstaetigkeit.ET1.isNichtSelbststaendig = true;
    draft.stepErwerbstaetigkeit.ET1.isSelbststaendig = false;
    draft.stepErwerbstaetigkeit.ET1.monatlichesBrutto = "MehrAlsMiniJob";
  });

  it("should show the relevant form blocks if user is only 'erwerbstätig' and its no 'Mini-Job'", () => {
    render(<EinkommenForm />, { preloadedState: stateFromPreviousSteps });
    const elternteil1Section = getElternteil1Section();

    const bruttoEinkommen = within(elternteil1Section).getByText(
      "Monatliches Einkommen in Brutto",
    );

    expect(bruttoEinkommen).toBeInTheDocument();
  });

  describe("Ausführliche Eingabe", () => {
    it("should open the 'ausführliche Eingabe' on click", async () => {
      render(<EinkommenForm />, { preloadedState: stateFromPreviousSteps });
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
      render(<EinkommenForm />, { preloadedState: stateFromPreviousSteps });
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
      render(<EinkommenForm />, { preloadedState: stateFromPreviousSteps });
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
    const validFormStateNurErwerbstaetig = produce(
      stateFromPreviousSteps,
      (draft) => {
        draft.stepEinkommen.ET1.bruttoEinkommenNichtSelbstaendig = {
          type: "average",
          average: 1000,
          perYear: null,
          perMonth: [
            1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000,
            1000,
          ],
        };
      },
    );

    it("should require the Brutto Einkommen", async () => {
      render(<EinkommenForm />, {
        preloadedState: validFormStateNurErwerbstaetig,
      });
      const elternteil1Section = getElternteil1Section();

      const erwerbstaetigkeiVorGeburtSection = within(
        elternteil1Section,
      ).getByLabelText("Einkünfte aus nichtselbständiger Arbeit");

      const nextPageBtn = screen.getByRole("button", { name: "Weiter" });

      const inputField = screen.getByLabelText(
        /^Monatliches Einkommen in Brutto/i,
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
