import userEvent from "@testing-library/user-event";
import { produce } from "immer";
import { describe, expect, it } from "vitest";
import { EinkommenPage } from "@/application/components/pages/EinkommenPage";
import { YesNo } from "@/application/features/abfrageteil/state";
import {
  INITIAL_STATE,
  render,
  screen,
  within,
} from "@/application/test-utils";
import { RentenArt } from "@/elterngeldrechner/model";

const stateFromPreviousSteps = produce(INITIAL_STATE, (draft) => {
  draft.stepAllgemeineAngaben.antragstellende = "FuerBeide";
  draft.stepAllgemeineAngaben.pseudonym = {
    ET1: "Elternteil 1",
    ET2: "Elternteil 2",
  };
  draft.stepNachwuchs.wahrscheinlichesGeburtsDatum = "08.08.2022";
  draft.stepErwerbstaetigkeit.ET1.monatlichesBrutto = "MehrAlsMiniJob";
});

describe("Einkommens Page only with block Nur Selbständig", () => {
  const getElternteil1Section = () => screen.getByLabelText("Elternteil 1");
  const getEinkommenAusSelbstaendigkeitElternteil1Section = () =>
    within(getElternteil1Section()).getByLabelText("Gewinneinkünfte");

  const getRentenversicherungElternteil1Section = () =>
    within(getElternteil1Section()).getByLabelText("Rentenversicherung");

  it("should not show Einkommen aus Selbstständigkeit if the user does have nicht-selbständige Tätigkeit", () => {
    const state = produce(stateFromPreviousSteps, (draft) => {
      draft.stepErwerbstaetigkeit.ET1.isNichtSelbststaendig = true;
    });

    render(<EinkommenPage />, { preloadedState: state });

    expect(
      within(getElternteil1Section()).queryByText("Gewinneinkünfte"),
    ).not.toBeInTheDocument();
  });

  it("should not show Einkommen aus Selbstständigkeit if the user does not have selbständige Tätigkeit", () => {
    const state = produce(stateFromPreviousSteps, (draft) => {
      draft.stepErwerbstaetigkeit.ET1.isNichtSelbststaendig = false;
      draft.stepErwerbstaetigkeit.ET1.isSelbststaendig = false;
    });

    render(<EinkommenPage />, { preloadedState: state });

    expect(
      within(getElternteil1Section()).queryByText("Gewinneinkünfte"),
    ).not.toBeInTheDocument();
  });

  describe("has only selbständige Tätigkeit", () => {
    const stateWithOnlySelbstaendig = produce(
      stateFromPreviousSteps,
      (draft) => {
        draft.stepErwerbstaetigkeit.ET1.vorGeburt = YesNo.YES;
        draft.stepErwerbstaetigkeit.ET1.isNichtSelbststaendig = false;
        draft.stepErwerbstaetigkeit.ET1.isSelbststaendig = true;
      },
    );

    it("should show Einkommen aus Selbstständigkeit", () => {
      render(<EinkommenPage />, {
        preloadedState: stateWithOnlySelbstaendig,
      });

      expect(
        within(getElternteil1Section()).getByLabelText("Gewinneinkünfte"),
      ).toBeInTheDocument();
    });

    describe("Validation of form", () => {
      const validStateEinkommen = produce(
        stateWithOnlySelbstaendig,
        (draft) => {
          draft.stepEinkommen.ET1.gewinnSelbstaendig = {
            type: "yearly",
            average: null,
            perYear: 12000,
            perMonth: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
          };
          draft.stepEinkommen.ET1.rentenVersicherung =
            RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG;
        },
      );

      it("should require the Gewinn selbständige Tätigkeit", async () => {
        render(<EinkommenPage />, { preloadedState: validStateEinkommen });

        const einkommenAusSelbstaendigkeitSection =
          getEinkommenAusSelbstaendigkeitElternteil1Section();

        const gewinnField = within(
          einkommenAusSelbstaendigkeitSection,
        ).getByLabelText(/Gewinn im letzten Kalenderjahr in Brutto/);

        await userEvent.clear(gewinnField);
        await userEvent.click(screen.getByText("Weiter"));

        expect(
          within(einkommenAusSelbstaendigkeitSection).getByText(
            "Dieses Feld ist erforderlich",
          ),
        ).toBeInTheDocument();
      });

      it("should require the Rentenversicherung", async () => {
        const invalidState = produce(stateWithOnlySelbstaendig, (draft) => {
          draft.stepEinkommen.ET1.rentenVersicherung = null;
        });

        render(<EinkommenPage />, { preloadedState: invalidState });

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
