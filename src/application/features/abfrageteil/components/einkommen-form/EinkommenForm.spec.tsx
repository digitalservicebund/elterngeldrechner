import userEvent from "@testing-library/user-event";
import { produce } from "immer";
import { describe, expect, it, vi } from "vitest";
import { EinkommenForm } from "./EinkommenForm";
import { YesNo } from "@/application/features/abfrageteil/state";
import {
  INITIAL_STATE,
  render,
  screen,
  within,
} from "@/application/test-utils";
import {
  KassenArt,
  KinderFreiBetrag,
  RentenArt,
  SteuerKlasse,
} from "@/elterngeldrechner/model";

vi.mock(import("@/elterngeldrechner/basis-eg-algorithmus"));

describe("Einkommen Page", () => {
  const getElternteil1Section = () => screen.getByLabelText("Elternteil 1");

  it("should show form elements for both Elternteile if two were selected", () => {
    const ET1 = "Finn";
    const ET2 = "Fiona";

    const preloadedState = produce(INITIAL_STATE, (draft) => {
      draft.stepAllgemeineAngaben.antragstellende = "FuerBeide";
      draft.stepAllgemeineAngaben.pseudonym = { ET1, ET2 };
      draft.stepNachwuchs.wahrscheinlichesGeburtsDatum = "08.08.2022";
      draft.stepErwerbstaetigkeit.ET1.isNichtSelbststaendig = true;
      draft.stepErwerbstaetigkeit.ET1.isSelbststaendig = false;
      draft.stepErwerbstaetigkeit.ET1.monatlichesBrutto = "MehrAlsMiniJob";
      draft.stepErwerbstaetigkeit.ET2.isNichtSelbststaendig = true;
      draft.stepErwerbstaetigkeit.ET2.isSelbststaendig = false;
      draft.stepErwerbstaetigkeit.ET2.monatlichesBrutto = "MehrAlsMiniJob";
    });

    render(<EinkommenForm />, { preloadedState });

    expect(screen.getByText(ET1)).toBeInTheDocument();
    expect(screen.getByText(ET2)).toBeInTheDocument();
  });

  it("should show notification message per Elternteil if Elternteil hasn't a Job", () => {
    const ET1 = "Finn";
    const ET2 = "Fiona";

    const preloadedState = produce(INITIAL_STATE, (draft) => {
      draft.stepAllgemeineAngaben.antragstellende = "FuerBeide";
      draft.stepAllgemeineAngaben.pseudonym = { ET1, ET2 };
      draft.stepNachwuchs.wahrscheinlichesGeburtsDatum = "08.08.2022";
      draft.stepErwerbstaetigkeit.ET1.isNichtSelbststaendig = false;
      draft.stepErwerbstaetigkeit.ET1.monatlichesBrutto = "MiniJob";
      draft.stepErwerbstaetigkeit.ET2.isNichtSelbststaendig = false;
      draft.stepErwerbstaetigkeit.ET2.monatlichesBrutto = "MiniJob";
    });

    render(<EinkommenForm />, { preloadedState });

    const messages = screen.getAllByText(
      "Da Sie in den letzten 12 Monaten kein Einkommen angegeben haben, wird für Sie mit dem Mindestsatz gerechnet und Sie müssen keine weiteren Angaben zum Einkommen machen.",
    );

    expect(messages).toHaveLength(2);
  });

  describe("Submitting the form when only 'erwerbstätig' and no minijob", () => {
    it("should transfer all input fields into the store after clicking to next page", async () => {
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
        draft.stepEinkommen.limitEinkommenUeberschritten = YesNo.NO;
      });

      const { store } = render(<EinkommenForm />, {
        preloadedState: stateFromPreviousSteps,
      });
      const elternteil1Section = getElternteil1Section();

      // Field Bruttoeinkommen Durchschnitt
      const bruttoEinkommenAverageField = within(
        elternteil1Section,
      ).getByLabelText("Monatliches Einkommen in Brutto");
      await userEvent.type(bruttoEinkommenAverageField, "1000");

      // Field Bruttoeinkommen per month
      const einkommenErwerbstaetigSection = within(
        elternteil1Section,
      ).getByLabelText("Einkünfte aus nichtselbständiger Arbeit");
      const btn = within(einkommenErwerbstaetigSection).getByRole("button", {
        name: /ausführlichen Eingabe/i,
      });
      await userEvent.click(btn);
      for (let monthIndex = 1; monthIndex <= 12; monthIndex++) {
        await userEvent.type(
          within(einkommenErwerbstaetigSection).getByLabelText(
            `${monthIndex}. Monat`,
          ),
          "1000",
        );
      }

      // Field Steuerklasse
      await userEvent.selectOptions(
        within(elternteil1Section).getByLabelText(/welche Steuerklasse/i),
        "4",
      );

      // Field Kinderfreibeträge
      await userEvent.selectOptions(
        within(elternteil1Section).getByLabelText(
          /wie viele Kinderfreibeträge/i,
        ),
        "4,0",
      );

      // Field Kirchensteuer
      const kirchensteuerSection =
        within(elternteil1Section).getByLabelText("Kirchensteuer");
      await userEvent.click(within(kirchensteuerSection).getByLabelText("Ja"));

      // Field Krankenversicherung
      const krankenversicherungSection = within(
        elternteil1Section,
      ).getByLabelText("Krankenversicherung");
      await userEvent.click(
        within(krankenversicherungSection).getByLabelText(/^Ja/),
      );

      await userEvent.click(screen.getByRole("button", { name: "Weiter" }));

      expect(store.getState().stepEinkommen).toMatchObject({
        ET1: {
          bruttoEinkommenNichtSelbstaendig: {
            type: "monthly",
            average: 1000,
            perYear: null,
            perMonth: Array.from<number>({
              length: 12,
            }).fill(1000),
          },
          steuerKlasse: SteuerKlasse.SKL4,
          splittingFaktor: null,
          kinderFreiBetrag: KinderFreiBetrag.ZKF4,
          zahlenSieKirchenSteuer: YesNo.YES,
          kassenArt: KassenArt.GESETZLICH_PFLICHTVERSICHERT,
        },
      });
    });
  });

  describe("Submitting the form for 'selbständig'", () => {
    it("should transfer all input fields into the store after clicking to next page", async () => {
      const stateFromPreviousSteps = produce(INITIAL_STATE, (draft) => {
        draft.stepAllgemeineAngaben.antragstellende = "FuerBeide";
        draft.stepAllgemeineAngaben.pseudonym = {
          ET1: "Elternteil 1",
          ET2: "Elternteil 2",
        };
        draft.stepNachwuchs.wahrscheinlichesGeburtsDatum = "08.08.2022";
        draft.stepErwerbstaetigkeit.ET1.vorGeburt = YesNo.YES;
        draft.stepErwerbstaetigkeit.ET1.isNichtSelbststaendig = false;
        draft.stepErwerbstaetigkeit.ET1.isSelbststaendig = true;
        draft.stepErwerbstaetigkeit.ET1.monatlichesBrutto = "MehrAlsMiniJob";
        draft.stepEinkommen.ET1.istErwerbstaetig = YesNo.YES;
        draft.stepEinkommen.ET1.hasMischEinkommen = YesNo.NO;
        draft.stepEinkommen.ET1.istNichtSelbststaendig = false;
        draft.stepEinkommen.ET1.istSelbststaendig = true;
        draft.stepEinkommen.antragstellende = "EinenElternteil";
      });

      const { store } = render(<EinkommenForm />, {
        preloadedState: stateFromPreviousSteps,
      });
      const elternteil1Section = getElternteil1Section();

      // Field Einkommensgrenze
      const elterngeldAnspruch = screen.getByRole("radiogroup", {
        name: /^Hatten Sie im Kalenderjahr vor der Geburt ein Gesamteinkommen von mehr als/,
      });
      await userEvent.click(
        within(elterngeldAnspruch).getByRole("radio", { name: "Nein" }),
      );

      const einkommenAusSelbstaendigkeit =
        within(elternteil1Section).getByLabelText("Gewinneinkünfte");

      const gewinnYearlyField = within(
        einkommenAusSelbstaendigkeit,
      ).getByLabelText(/Gewinn im letzten Kalenderjahr in Brutto/);

      await userEvent.type(gewinnYearlyField, "12000");

      // Field Kirchensteuer
      const kirchensteuerSection =
        within(elternteil1Section).getByLabelText("Kirchensteuer");
      await userEvent.click(within(kirchensteuerSection).getByLabelText("Ja"));

      // Field Krankenversicherung
      const krankenversicherungSection = within(
        elternteil1Section,
      ).getByLabelText("Krankenversicherung");
      await userEvent.click(
        within(krankenversicherungSection).getByLabelText(/^Ja/),
      );

      // Field Rentenversicherung
      const rentenversicherung =
        within(elternteil1Section).getByLabelText("Rentenversicherung");
      await userEvent.click(
        within(rentenversicherung).getByLabelText(
          "gesetzliche Rentenversicherung",
        ),
      );

      await userEvent.click(screen.getByRole("button", { name: "Weiter" }));

      expect(store.getState().stepEinkommen).toMatchObject({
        limitEinkommenUeberschritten: YesNo.NO,
        ET1: {
          gewinnSelbstaendig: {
            type: "yearly",
            average: null,
            perYear: 12000,
            perMonth: [],
          },
          rentenVersicherung: RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG,
          kassenArt: KassenArt.GESETZLICH_PFLICHTVERSICHERT,
          zahlenSieKirchenSteuer: YesNo.YES,
          istErwerbstaetig: YesNo.YES,
          hasMischEinkommen: YesNo.NO,
          istNichtSelbststaendig: false,
          istSelbststaendig: true,
        },
      });
    });
  });

  describe("Submitting the form for 'selbständig' and 'erwerbstätig'", () => {
    it("should transfer all input fields into the store after clicking to next page", async () => {
      const preloadedState = produce(INITIAL_STATE, (draft) => {
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
        draft.stepErwerbstaetigkeit.ET1.isSelbststaendig = true;
      });

      const { store } = render(<EinkommenForm />, { preloadedState });

      // Field Einkommensgrenze
      const elterngeldAnspruch = screen.getByRole("radiogroup", {
        name: /^Hatten Sie im Kalenderjahr vor der Geburt ein Gesamteinkommen von mehr als/,
      });
      await userEvent.click(
        within(elterngeldAnspruch).getByRole("radio", { name: "Nein" }),
      );

      const elternteil1Section = getElternteil1Section();
      //
      // // Field
      // const kirchensteuerSection =
      //   within(elternteil1Section).getByLabelText("Kirchensteuer");
      // await userEvent.click(within(kirchensteuerSection).getByLabelText("Ja"));

      // Field Kirchensteuer
      const kirchensteuerSection =
        within(elternteil1Section).getByLabelText("Kirchensteuer");
      await userEvent.click(within(kirchensteuerSection).getByLabelText("Ja"));

      // Field Steuerklasse
      await userEvent.selectOptions(
        within(elternteil1Section).getByLabelText(/welche Steuerklasse/i),
        "4",
      );

      // Field Kinderfreibeträge
      await userEvent.selectOptions(
        within(elternteil1Section).getByLabelText(
          /wie viele Kinderfreibeträge/i,
        ),
        "4,0",
      );

      const btnElternteil1 = within(elternteil1Section).getByRole("button", {
        name: "eine Tätigkeit hinzufügen",
      });
      await userEvent.click(btnElternteil1);

      const taetigkeit1Section =
        within(elternteil1Section).getByLabelText("1. Tätigkeit");
      await userEvent.selectOptions(
        within(taetigkeit1Section).getByLabelText("Art der Tätigkeit"),
        "nichtselbständige Arbeit",
      );

      await userEvent.type(
        within(taetigkeit1Section).getByLabelText(
          "Durchschnittliches Bruttoeinkommen",
        ),
        "1000",
      );

      await userEvent.click(within(taetigkeit1Section).getByLabelText("Nein"));

      await userEvent.selectOptions(
        within(taetigkeit1Section).getByLabelText("von"),
        "10",
      );
      await userEvent.selectOptions(
        within(taetigkeit1Section).getByLabelText("bis"),
        "12",
      );
      await userEvent.click(
        within(taetigkeit1Section).getByLabelText(
          "rentenversicherungspflichtig",
        ),
      );
      await userEvent.click(
        within(taetigkeit1Section).getByLabelText(
          "krankenversicherungspflichtig",
        ),
      );
      await userEvent.click(screen.getByRole("button", { name: "Weiter" }));

      expect(store.getState().stepEinkommen).toMatchObject({
        ET1: {
          zahlenSieKirchenSteuer: YesNo.YES,
          kassenArt: null,
          kinderFreiBetrag: KinderFreiBetrag.ZKF4,
          steuerKlasse: SteuerKlasse.SKL4,
          taetigkeitenNichtSelbstaendigUndSelbstaendig: [
            {
              artTaetigkeit: "NichtSelbststaendig",
              isMinijob: YesNo.NO,
              bruttoEinkommenDurchschnitt: 1000,
              versicherungen: {
                hasArbeitslosenversicherung: false,
                hasKrankenversicherung: true,
                hasRentenversicherung: true,
                none: false,
              },
              zeitraum: [
                {
                  from: "10",
                  to: "12",
                },
              ],
            },
          ],
        },
      });
    });
  });
});
