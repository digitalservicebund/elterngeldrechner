import { render, screen, within } from "@/test-utils/test-utils";
import userEvent from "@testing-library/user-event";
import { configureStore, Store } from "@reduxjs/toolkit";
import {
  ErwerbsArt,
  KassenArt,
  KinderFreiBetrag,
  MischEkZwischenErgebnis,
  RentenArt,
  SteuerKlasse,
  YesNo,
} from "@/globals/js/calculations/model";
import { reducers, RootState } from "@/redux";
import {
  initialStepErwerbstaetigkeitState,
  StepErwerbstaetigkeitElternteil,
  StepErwerbstaetigkeitState,
} from "@/redux/stepErwerbstaetigkeitSlice";
import { initialStepNachwuchsState } from "@/redux/stepNachwuchsSlice";
import {
  initialStepEinkommenState,
  StepEinkommenElternteil,
  StepEinkommenState,
} from "@/redux/stepEinkommenSlice";
import { initialStepAllgemeineAngabenState } from "@/redux/stepAllgemeineAngabenSlice";
import EinkommenPage from "./EinkommenPage";
import {
  initialStepRechnerState,
  StepRechnerElternteilState,
} from "@/redux/stepRechnerSlice";
import Big from "big.js";
import { BasisEgAlgorithmus } from "@/globals/js/calculations/basis-eg-algorithmus";
import { MathUtil } from "@/globals/js/calculations/common/math-util";

jest.mock("../../globals/js/calculations/basis-eg-algorithmus");

describe("Einkommen Page", () => {
  const getElternteil1Section = () => screen.getByLabelText("Elternteil 1");

  it("should show form elements for both Elternteile if two were selected", () => {
    const ET1 = "Finn";
    const ET2 = "Fiona";

    const elternteilStepErwerbstaetigkeit: StepErwerbstaetigkeitElternteil = {
      ...initialStepErwerbstaetigkeitState.ET1,
      isNichtSelbststaendig: true,
      isSelbststaendig: false,
      monatlichesBrutto: "MehrAlsMiniJob",
    };

    const preloadedState: Partial<RootState> = {
      stepAllgemeineAngaben: {
        ...initialStepAllgemeineAngabenState,
        antragstellende: "FuerBeide",
        pseudonym: {
          ET1,
          ET2,
        },
      },
      stepNachwuchs: {
        ...initialStepNachwuchsState,
        wahrscheinlichesGeburtsDatum: "08.08.2022",
      },
      stepErwerbstaetigkeit: {
        ET1: elternteilStepErwerbstaetigkeit,
        ET2: elternteilStepErwerbstaetigkeit,
      },
    };

    render(<EinkommenPage />, { preloadedState });

    expect(screen.getByText(ET1)).toBeInTheDocument();
    expect(screen.getByText(ET2)).toBeInTheDocument();
  });

  it("should show notification message per Elternteil if Elternteil hasn't a Job", () => {
    const ET1 = "Finn";
    const ET2 = "Fiona";

    const elternteilStepErwerbstaetigkeit: StepErwerbstaetigkeitElternteil = {
      ...initialStepErwerbstaetigkeitState.ET1,
      isNichtSelbststaendig: false,
      monatlichesBrutto: "MiniJob",
    };

    const preloadedState: Partial<RootState> = {
      stepAllgemeineAngaben: {
        ...initialStepAllgemeineAngabenState,
        antragstellende: "FuerBeide",
        pseudonym: {
          ET1,
          ET2,
        },
      },
      stepNachwuchs: {
        ...initialStepNachwuchsState,
        wahrscheinlichesGeburtsDatum: "08.08.2022",
      },
      stepErwerbstaetigkeit: {
        ET1: elternteilStepErwerbstaetigkeit,
        ET2: elternteilStepErwerbstaetigkeit,
      },
    };

    render(<EinkommenPage />, { preloadedState });

    const messages = screen.getAllByText(
      "Da Sie in den letzten 12 Monaten kein Einkommen angegeben haben, wird für Sie mit dem Mindestsatz gerechnet und Sie müssen keine weiteren Angaben zum Einkommen machen.",
    );

    expect(messages).toHaveLength(2);
    expect(
      screen.queryByText(
        "Da Sie unter 520 € einnehmen, wird für Sie mit dem Mindestsatz gerechnet und Sie müssen keine weiteren Angaben zum Einkommen machen.",
      ),
    ).not.toBeInTheDocument();
  });

  describe("Submitting the form when only 'erwerbstätig' and no minijob", () => {
    let store: Store<RootState>;
    const einkommenAverage = 1000;

    const elternteil1Erwerbstaetigkeit: StepErwerbstaetigkeitElternteil = {
      ...initialStepErwerbstaetigkeitState.ET1,
      vorGeburt: YesNo.YES,
      isNichtSelbststaendig: true,
      isSelbststaendig: false,
      monatlichesBrutto: "MehrAlsMiniJob",
    };

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
          ...elternteil1Erwerbstaetigkeit,
        },
      },
      stepEinkommen: {
        ...initialStepEinkommenState,
        limitEinkommenUeberschritten: YesNo.NO,
      },
    };

    const expectedState: StepEinkommenState = {
      ...initialStepEinkommenState,
      limitEinkommenUeberschritten: YesNo.NO,
      ET1: {
        ...initialStepEinkommenState.ET1,
        bruttoEinkommenNichtSelbstaendig: {
          type: "monthly",
          average: einkommenAverage,
          perYear: null,
          perMonth: Array.from<number>({
            length: 12,
          }).fill(einkommenAverage),
        },
        steuerKlasse: SteuerKlasse.SKL4,
        splittingFaktor: null,
        kinderFreiBetrag: KinderFreiBetrag.ZKF4,
        zahlenSieKirchenSteuer: YesNo.YES,
        kassenArt: KassenArt.GESETZLICH_PFLICHTVERSICHERT,
      },
    };

    beforeEach(() => {
      store = configureStore({
        reducer: reducers,
        preloadedState: stateFromPreviousSteps,
      });
    });

    it("should transfer all input fields into the store after clicking to next page", async () => {
      render(<EinkommenPage />, { store });
      const elternteil1Section = getElternteil1Section();

      // Field Brutto-Einkommen Durchschnitt
      const bruttoEinkommenAverageField = within(
        elternteil1Section,
      ).getByLabelText(/monatlich brutto verdient/);
      await userEvent.type(
        bruttoEinkommenAverageField,
        String(einkommenAverage),
      );

      // Field Brutto-Einkommen per month
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
          String(einkommenAverage),
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
        within(krankenversicherungSection).getByLabelText(
          /^gesetzlich pflichtversichert/,
        ),
      );

      await userEvent.click(screen.getByRole("button", { name: "Weiter" }));

      expect(store.getState().stepEinkommen).toEqual(expectedState);
    });
  });

  describe("Submitting the form for 'selbständig'", () => {
    let store: Store<RootState>;
    const einkommenYearly = 12000;
    const elternteil1Erwerbstaetigkeit: StepErwerbstaetigkeitElternteil = {
      ...initialStepErwerbstaetigkeitState.ET1,
      vorGeburt: YesNo.YES,
      isNichtSelbststaendig: false,
      isSelbststaendig: true,
      monatlichesBrutto: "MehrAlsMiniJob",
    };

    const stateFromPreviousSteps: Partial<RootState> = {
      stepNachwuchs: {
        ...initialStepNachwuchsState,
        wahrscheinlichesGeburtsDatum: "08.08.2022",
      },
      stepErwerbstaetigkeit: {
        ...initialStepErwerbstaetigkeitState,
        ET1: elternteil1Erwerbstaetigkeit,
      },
      stepEinkommen: {
        ...initialStepEinkommenState,
        ET1: {
          ...initialStepEinkommenState.ET1,
          istErwerbstaetig: YesNo.YES,
          hasMischEinkommen: YesNo.NO,
          istNichtSelbststaendig: false,
          istSelbststaendig: true,
        },
        antragstellende: "EinenElternteil",
      },
    };

    beforeEach(() => {
      store = configureStore({
        reducer: reducers,
        preloadedState: stateFromPreviousSteps,
      });
    });

    it("should transfer all input fields into the store after clicking to next page", async () => {
      const expectedState: StepEinkommenState = {
        ...initialStepEinkommenState,
        limitEinkommenUeberschritten: YesNo.NO,
        ET1: {
          ...initialStepEinkommenState.ET1,
          gewinnSelbstaendig: {
            type: "yearly",
            average: null,
            perYear: einkommenYearly,
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
        antragstellende: "EinenElternteil",
      };

      render(<EinkommenPage />, { store });
      const elternteil1Section = getElternteil1Section();

      // Field Einkommensgrenze
      const elterngeldAnspruch = screen.getByTestId("egr-anspruch");
      await userEvent.click(within(elterngeldAnspruch).getByLabelText("Nein"));

      const einkommenAusSelbstaendigkeit =
        within(elternteil1Section).getByLabelText("Gewinneinkünfte");

      const gewinnYearlyField = within(
        einkommenAusSelbstaendigkeit,
      ).getByLabelText(/Gewinn im Kalenderjahr vor der Geburt/);

      await userEvent.type(gewinnYearlyField, String(einkommenYearly));

      // Field Kirchensteuer
      const kirchensteuerSection =
        within(elternteil1Section).getByLabelText("Kirchensteuer");
      await userEvent.click(within(kirchensteuerSection).getByLabelText("Ja"));

      // Field Krankenversicherung
      const krankenversicherungSection = within(
        elternteil1Section,
      ).getByLabelText("Krankenversicherung");
      await userEvent.click(
        within(krankenversicherungSection).getByLabelText(
          /^gesetzlich pflichtversichert/,
        ),
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

      expect(store.getState().stepEinkommen).toEqual(expectedState);
    });

    // TEST DISABLED: limitEinkommenUeberschritten will be set by form input directly - doesn't make sense any more
    // it("shoud have limitEinkommenUeberschritten = true in store on income above 250000 Euro considering one elternteil", async () => {
    //   const expectedState: StepEinkommenState = {
    //     ...initialStepEinkommenState,
    //     ET1: {
    //       ...initialStepEinkommenState.ET1,
    //       gewinnSelbstaendig: {
    //         type: "yearly",
    //         average: null,
    //         perYear: 250001,
    //         perMonth: [],
    //       },
    //       rentenVersicherung: RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG,
    //       kassenArt: KassenArt.GESETZLICH_PFLICHTVERSICHERT,
    //       zahlenSieKirchenSteuer: YesNo.YES,
    //       istErwerbstaetig: YesNo.YES,
    //       hasMischEinkommen: YesNo.NO,
    //       istNichtSelbststaendig: false,
    //       istSelbststaendig: true,
    //     },
    //     antragstellende: "FuerMichSelbst",
    //     limitEinkommenUeberschritten: YesNo.YES,
    //   };
    //   render(<EinkommenPage />, { store });
    //   const elternteil1Section = getElternteil1Section();

    //   const einkommenAusSelbstaendigkeit =
    //     within(elternteil1Section).getByLabelText("Gewinneinkünfte");

    //   const gewinnYearlyField = within(
    //     einkommenAusSelbstaendigkeit,
    //   ).getByLabelText(/Gewinn im Kalenderjahr vor der Geburt/);

    //   await userEvent.type(gewinnYearlyField, String(250001));

    //   // Field Kirchensteuer
    //   const kirchensteuerSection =
    //     within(elternteil1Section).getByLabelText("Kirchensteuer");
    //   await userEvent.click(within(kirchensteuerSection).getByLabelText("Ja"));

    //   // Field Krankenversicherung
    //   const krankenversicherungSection = within(
    //     elternteil1Section,
    //   ).getByLabelText("Krankenversicherung");
    //   await userEvent.click(
    //     within(krankenversicherungSection).getByLabelText(
    //       /^gesetzlich pflichtversichert/,
    //     ),
    //   );

    //   // Field Rentenversicherung
    //   const rentenversicherung =
    //     within(elternteil1Section).getByLabelText("Rentenversicherung");
    //   await userEvent.click(
    //     within(rentenversicherung).getByLabelText(
    //       "gesetzliche Rentenversicherung",
    //     ),
    //   );

    //   await userEvent.click(screen.getByRole("button", { name: "Weiter" }));

    //   expect(store.getState().stepEinkommen).toEqual(expectedState);
    //   expect(store.getState().stepEinkommen.limitEinkommenUeberschritten).toBe(
    //     true,
    //   );
    // });
  });

  describe("Submitting the form for 'selbständig' and 'erwerbstätig'", () => {
    let store: Store<RootState>;
    const einkommenAverage = 1000;
    const stepErwerbstaetigkeitState: StepErwerbstaetigkeitState = {
      ...initialStepErwerbstaetigkeitState,
      ET1: {
        ...initialStepErwerbstaetigkeitState.ET1,
        vorGeburt: YesNo.YES,
        isNichtSelbststaendig: true,
        isSelbststaendig: true,
      },
    };

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
      stepErwerbstaetigkeit: stepErwerbstaetigkeitState,
    };

    beforeEach(() => {
      store = configureStore({
        reducer: reducers,
        preloadedState: stateFromPreviousSteps,
      });
    });

    it("should transfer all input fields into the store after clicking to next page", async () => {
      const expectedState: StepEinkommenState = {
        ...initialStepEinkommenState,
        limitEinkommenUeberschritten: YesNo.NO,
        ET1: {
          ...initialStepEinkommenState.ET1,
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
      };
      render(<EinkommenPage />, { store });
      // Field Einkommensgrenze
      const elterngeldAnspruch = screen.getByTestId("egr-anspruch");
      await userEvent.click(within(elterngeldAnspruch).getByLabelText("Nein"));

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
          "Durchschnittliches Brutto-Einkommen",
        ),
        String(einkommenAverage),
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

      expect(store.getState().stepEinkommen).toEqual(expectedState);
    });
  });

  describe("Recalculate on change", () => {
    let store: Store<RootState>;

    const ET1 = "Finn";
    const ET2 = "Fiona";

    const elternteilStepErwerbstaetigkeit: StepErwerbstaetigkeitElternteil = {
      mehrereTaetigkeiten: YesNo.NO,
      vorGeburt: YesNo.YES,
      isNichtSelbststaendig: true,
      isSelbststaendig: true,
      sozialVersicherungsPflichtig: YesNo.YES,
      monatlichesBrutto: "MehrAlsMiniJob",
    };

    const elternteilStepEinkommen: StepEinkommenElternteil = {
      ...initialStepEinkommenState.ET1,
      zahlenSieKirchenSteuer: YesNo.YES,
      kassenArt: KassenArt.GESETZLICH_PFLICHTVERSICHERT,
      steuerKlasse: SteuerKlasse.SKL1,
      taetigkeitenNichtSelbstaendigUndSelbstaendig: [
        {
          artTaetigkeit: "NichtSelbststaendig",
          bruttoEinkommenDurchschnitt: 1000,
          isMinijob: YesNo.NO,
          zeitraum: [
            {
              from: "2022-02-01",
              to: "2022-05-01",
            },
            {
              from: "2022-01-01",
              to: "2022-04-01",
            },
          ],
          versicherungen: {
            hasRentenversicherung: true,
            hasArbeitslosenversicherung: false,
            hasKrankenversicherung: true,
            none: false,
          },
        },
        {
          artTaetigkeit: "Selbststaendig",
          bruttoEinkommenDurchschnitt: 1000,
          isMinijob: YesNo.NO,
          zeitraum: [
            {
              from: "2022-01-01",
              to: "2022-03-01",
            },
            {
              from: "2022-02-01",
              to: "2022-04-01",
            },
          ],
          versicherungen: {
            hasRentenversicherung: true,
            hasArbeitslosenversicherung: false,
            hasKrankenversicherung: true,
            none: false,
          },
        },
      ],
    };

    const elternteilStepRechner: StepRechnerElternteilState = {
      ...initialStepRechnerState.ET1,
      bruttoEinkommenZeitraum: [
        {
          bruttoEinkommen: 1000,
          zeitraum: { from: "2022-12-01", to: "2023-01-01" },
        },
      ],
      hasBEGResultChangedDueToPrevFormSteps: false,
      elterngeldResult: {
        state: "success",
        data: [
          {
            vonLebensMonat: 1,
            bisLebensMonat: 12,
            basisElternGeld: 1000,
            elternGeldPlus: 2000,
            nettoEinkommen: 3000,
          },
        ],
      },
    };

    const preloadedState: Partial<RootState> = {
      stepAllgemeineAngaben: {
        ...initialStepAllgemeineAngabenState,
        antragstellende: "FuerBeide",
        pseudonym: {
          ET1,
          ET2,
        },
        alleinerziehend: YesNo.NO,
        mutterschaftssleistungen: YesNo.NO,
      },
      stepNachwuchs: {
        ...initialStepNachwuchsState,
        anzahlKuenftigerKinder: 1,
        wahrscheinlichesGeburtsDatum: "08.08.2022",
      },
      stepErwerbstaetigkeit: {
        ET1: elternteilStepErwerbstaetigkeit,
        ET2: elternteilStepErwerbstaetigkeit,
      },
      stepEinkommen: {
        ET1: elternteilStepEinkommen,
        ET2: elternteilStepEinkommen,
        antragstellende: null,
        limitEinkommenUeberschritten: null,
      },
      stepRechner: {
        ET1: elternteilStepRechner,
        ET2: elternteilStepRechner,
      },
    };

    const mockBegAlgorithmus = {
      berechneMischNettoUndBasiselterngeld: jest.fn(),
    };

    beforeEach(() => {
      const begAlgorithmusResult: MischEkZwischenErgebnis = {
        elterngeldbasis: new Big(1234.5),
        netto: new Big(2467.9),
        steuern: MathUtil.BIG_ZERO,
        brutto: MathUtil.BIG_ZERO,
        abgaben: MathUtil.BIG_ZERO,
        krankenversicherungspflichtig: false,
        rentenversicherungspflichtig: false,
        status: ErwerbsArt.NEIN,
      };

      mockBegAlgorithmus.berechneMischNettoUndBasiselterngeld.mockClear();

      mockBegAlgorithmus.berechneMischNettoUndBasiselterngeld.mockResolvedValue(
        begAlgorithmusResult,
      ); // mock resolved Promise return
      (BasisEgAlgorithmus as jest.Mock).mockImplementation(
        () => mockBegAlgorithmus,
      ); // mock Class BasisEgAlgorithmus with mock method berechneMischNettoUndBasiselterngeld above

      store = configureStore({
        reducer: reducers,
        preloadedState,
      });
    });

    it("should be executed for Basiselterngeld ET1 if user has already calculated it and changes inputs in related form steps", async () => {
      render(<EinkommenPage />, { store });
      // Field Einkommensgrenze
      const elterngeldAnspruch = screen.getByTestId("egr-anspruch");
      await userEvent.click(within(elterngeldAnspruch).getByLabelText("Nein"));

      const elternteil1Section = screen.getByLabelText("Finn");
      const ersteTaetigkeit =
        within(elternteil1Section).getByLabelText("1. Tätigkeit");

      // Field Durchschnittliches Brutto-Einkommen
      await userEvent.type(
        within(ersteTaetigkeit).getByLabelText(
          "Durchschnittliches Brutto-Einkommen",
        ),
        "5555",
      );

      await userEvent.click(screen.getByRole("button", { name: "Weiter" }));

      expect(
        store.getState().stepRechner.ET1.hasBEGResultChangedDueToPrevFormSteps,
      ).toBe(true);

      expect(
        store.getState().stepRechner.ET2.hasBEGResultChangedDueToPrevFormSteps,
      ).toBe(false);
    });

    it("should be executed for Basiselterngeld ET2 if user has already calculated it and changes inputs in related form steps", async () => {
      render(<EinkommenPage />, { store });
      // Field Einkommensgrenze
      const elterngeldAnspruch = screen.getByTestId("egr-anspruch");
      await userEvent.click(within(elterngeldAnspruch).getByLabelText("Nein"));

      const elternteil2Section = screen.getByLabelText("Fiona");

      const ersteTaetigkeit =
        within(elternteil2Section).getByLabelText("1. Tätigkeit");

      // Field Durchschnittliches Brutto-Einkommen
      await userEvent.type(
        within(ersteTaetigkeit).getByLabelText(
          "Durchschnittliches Brutto-Einkommen",
        ),
        "5555",
      );

      await userEvent.click(screen.getByRole("button", { name: "Weiter" }));

      expect(
        store.getState().stepRechner.ET1.hasBEGResultChangedDueToPrevFormSteps,
      ).toBe(false);

      expect(
        store.getState().stepRechner.ET2.hasBEGResultChangedDueToPrevFormSteps,
      ).toBe(true);
    });
  });
});
