import { persoenlicheDatenOfUi } from "./persoenlicheDatenFactory";
import { RootState } from "./index";
import {
  BruttoEinkommenZeitraum,
  initialStepRechnerState,
} from "./stepRechnerSlice";
import { initialMonatsplanerState } from "./monatsplanerSlice";
import { initialAverageOrMonthlyStateNichtSelbstaendig } from "./stepEinkommenSlice";
import * as reactRedux from "react-redux";
import {
  ErwerbsArt,
  KinderFreiBetrag,
  YesNo,
} from "../globals/js/calculations/model";
import {
  MonatlichesBrutto,
  StepErwerbstaetigkeitElternteil,
} from "./stepErwerbstaetigkeitSlice";
import { initialStepConfigurationState } from "./configurationSlice";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

describe("persoenlicheDatenFactory", () => {
  beforeEach(() => {
    // @ts-ignore
    useDispatchMock.mockImplementation(() => () => {});
    // @ts-ignore
    useSelectorMock.mockImplementation((selector) => selector(mockStore));
  });
  afterEach(() => {
    // @ts-ignore
    useDispatchMock.mockClear();
    // @ts-ignore
    useSelectorMock.mockClear();
  });

  const useSelectorMock = reactRedux.useSelector;
  const useDispatchMock = reactRedux.useDispatch;

  const mockStore: RootState = {
    monatsplaner: initialMonatsplanerState,
    stepAllgemeineAngaben: {
      antragstellende: null,
      pseudonym: {
        ET1: "",
        ET2: "",
      },
      alleinerziehend: null,
      mutterschaftssleistungen: null,
      mutterschaftssleistungenWer: null,
    },
    stepNachwuchs: {
      anzahlKuenftigerKinder: 1,
      wahrscheinlichesGeburtsDatum: "30.10.2022",
      geschwisterkinder: [
        {
          geburtsdatum: "02.03.2017",
          istBehindert: false,
        },
        {
          geburtsdatum: "31.05.2008",
          istBehindert: true,
        },
      ],
      mutterschaftssleistungen: YesNo.NO,
    },
    stepErwerbstaetigkeit: {
      ET1: {
        mehrereTaetigkeiten: YesNo.NO,
        vorGeburt: null,
        isNichtSelbststaendig: false,
        isSelbststaendig: false,
        sozialVersicherungsPflichtig: null,
        monatlichesBrutto: null,
      },
      ET2: {
        mehrereTaetigkeiten: YesNo.NO,
        vorGeburt: YesNo.YES,
        isNichtSelbststaendig: true,
        isSelbststaendig: false,
        sozialVersicherungsPflichtig: null,
        monatlichesBrutto: null,
      },
    },
    stepEinkommen: {
      ET1: {
        bruttoEinkommenNichtSelbstaendig:
          initialAverageOrMonthlyStateNichtSelbstaendig,
        steuerKlasse: null,
        splittingFaktor: null,
        kinderFreiBetrag: KinderFreiBetrag.ZKF1,
        gewinnSelbstaendig: initialAverageOrMonthlyStateNichtSelbstaendig,
        rentenVersicherung: null,
        zahlenSieKirchenSteuer: null,
        kassenArt: null,
        taetigkeitenNichtSelbstaendigUndSelbstaendig: [],
        istErwerbstaetig: null,
        hasMischEinkommen: null,
        istNichtSelbststaendig: null,
        istSelbststaendig: null,
      },
      ET2: {
        bruttoEinkommenNichtSelbstaendig:
          initialAverageOrMonthlyStateNichtSelbstaendig,
        steuerKlasse: null,
        splittingFaktor: null,
        kinderFreiBetrag: KinderFreiBetrag.ZKF1,
        gewinnSelbstaendig: initialAverageOrMonthlyStateNichtSelbstaendig,
        rentenVersicherung: null,
        zahlenSieKirchenSteuer: null,
        kassenArt: null,
        taetigkeitenNichtSelbstaendigUndSelbstaendig: [],
        istErwerbstaetig: null,
        hasMischEinkommen: null,
        istNichtSelbststaendig: null,
        istSelbststaendig: null,
      },
      antragstellende: null,
      limitEinkommenUeberschritten: null,
    },
    stepRechner: initialStepRechnerState,
    configuration: initialStepConfigurationState,
  };

  it("should create PersoenlicheDaten for ET1", () => {
    // when
    const persoenlicheDaten = persoenlicheDatenOfUi(mockStore, "ET1", []);

    // then
    expect(persoenlicheDaten.wahrscheinlichesGeburtsDatum.getDate()).toBe(30);
    expect(persoenlicheDaten.wahrscheinlichesGeburtsDatum.getMonth()).toBe(9);
    expect(persoenlicheDaten.wahrscheinlichesGeburtsDatum.getFullYear()).toBe(
      2022,
    );
    expect(persoenlicheDaten.kinder[1].geburtsdatum?.getDate()).toBe(2);
    expect(persoenlicheDaten.kinder[1].geburtsdatum?.getMonth()).toBe(2);
    expect(persoenlicheDaten.kinder[1].geburtsdatum?.getFullYear()).toBe(2017);
    expect(persoenlicheDaten.kinder[2].geburtsdatum?.getDate()).toBe(31);
    expect(persoenlicheDaten.kinder[2].geburtsdatum?.getMonth()).toBe(4);
    expect(persoenlicheDaten.kinder[2].geburtsdatum?.getFullYear()).toBe(2008);
    expect(persoenlicheDaten.sindSieAlleinerziehend).toBe(YesNo.NO);
    expect(persoenlicheDaten.anzahlKuenftigerKinder).toBe(1);
    expect(persoenlicheDaten.getAnzahlGeschwister()).toBe(2);
    expect(persoenlicheDaten.etVorGeburt).toBe(ErwerbsArt.NEIN);
    expect(persoenlicheDaten.etNachGeburt).toBe(YesNo.NO);
  });

  it("should create PersoenlicheDaten for ET2 with ErwerbsTaetigkeitNachGeburt", () => {
    // given
    let bruttoEinkommenZeitraumList: BruttoEinkommenZeitraum[] = [
      { bruttoEinkommen: 1000, zeitraum: { from: "1", to: "1" } },
    ];

    // when
    const persoenlicheDaten = persoenlicheDatenOfUi(
      mockStore,
      "ET2",
      bruttoEinkommenZeitraumList,
    );

    // then
    expect(persoenlicheDaten.wahrscheinlichesGeburtsDatum.getDate()).toBe(30);
    expect(persoenlicheDaten.wahrscheinlichesGeburtsDatum.getMonth()).toBe(9);
    expect(persoenlicheDaten.wahrscheinlichesGeburtsDatum.getFullYear()).toBe(
      2022,
    );
    expect(persoenlicheDaten.kinder[1].geburtsdatum?.getDate()).toBe(2);
    expect(persoenlicheDaten.kinder[1].geburtsdatum?.getMonth()).toBe(2);
    expect(persoenlicheDaten.kinder[1].geburtsdatum?.getFullYear()).toBe(2017);
    expect(persoenlicheDaten.kinder[2].geburtsdatum?.getDate()).toBe(31);
    expect(persoenlicheDaten.kinder[2].geburtsdatum?.getMonth()).toBe(4);
    expect(persoenlicheDaten.kinder[2].geburtsdatum?.getFullYear()).toBe(2008);
    expect(persoenlicheDaten.sindSieAlleinerziehend).toBe(YesNo.NO);
    expect(persoenlicheDaten.anzahlKuenftigerKinder).toBe(1);
    expect(persoenlicheDaten.getAnzahlGeschwister()).toBe(2);
    expect(persoenlicheDaten.etVorGeburt).toBe(
      ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI,
    );
    expect(persoenlicheDaten.etNachGeburt).toBe(YesNo.YES);
  });

  it("should create PersoenlicheDaten for Alleinerziehend", () => {
    // given
    mockStore.stepAllgemeineAngaben.alleinerziehend = YesNo.YES;

    // when
    const persoenlicheDaten = persoenlicheDatenOfUi(mockStore, "ET1", []);

    // then
    expect(persoenlicheDaten.sindSieAlleinerziehend).toBe(YesNo.YES);
    expect(persoenlicheDaten.anzahlKuenftigerKinder).toBe(1);

    mockStore.stepAllgemeineAngaben.alleinerziehend = YesNo.NO;
  });

  describe.each([
    [
      {
        mehrereTaetigkeiten: YesNo.NO,
        vorGeburt: null,
        isNichtSelbststaendig: false,
        isSelbststaendig: false,
        sozialVersicherungsPflichtig: null,
        monatlichesBrutto: null,
      },
      ErwerbsArt.NEIN,
    ],
    [
      {
        mehrereTaetigkeiten: YesNo.NO,
        vorGeburt: YesNo.NO,
        isNichtSelbststaendig: false,
        isSelbststaendig: false,
        sozialVersicherungsPflichtig: null,
        monatlichesBrutto: null,
      },
      ErwerbsArt.NEIN,
    ],
    [
      {
        mehrereTaetigkeiten: YesNo.NO,
        vorGeburt: YesNo.YES,
        isNichtSelbststaendig: true,
        isSelbststaendig: false,
        sozialVersicherungsPflichtig: null,
        monatlichesBrutto: null,
      },
      ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI,
    ],
    [
      {
        mehrereTaetigkeiten: YesNo.NO,
        vorGeburt: YesNo.YES,
        isNichtSelbststaendig: true,
        isSelbststaendig: false,
        sozialVersicherungsPflichtig: YesNo.NO,
        monatlichesBrutto: null,
      },
      ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI,
    ],
    [
      {
        mehrereTaetigkeiten: YesNo.NO,
        vorGeburt: YesNo.YES,
        isNichtSelbststaendig: true,
        isSelbststaendig: false,
        sozialVersicherungsPflichtig: YesNo.YES,
        monatlichesBrutto: null,
      },
      ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI,
    ],
    [
      {
        mehrereTaetigkeiten: YesNo.NO,
        vorGeburt: YesNo.YES,
        isNichtSelbststaendig: true,
        isSelbststaendig: false,
        sozialVersicherungsPflichtig: YesNo.YES,
        monatlichesBrutto: "MehrAlsMiniJob" as MonatlichesBrutto,
      },
      ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI,
    ],
    [
      {
        mehrereTaetigkeiten: YesNo.NO,
        vorGeburt: YesNo.YES,
        isNichtSelbststaendig: true,
        isSelbststaendig: false,
        sozialVersicherungsPflichtig: YesNo.YES,
        monatlichesBrutto: "MiniJob" as MonatlichesBrutto,
      },
      ErwerbsArt.JA_NICHT_SELBST_MINI,
    ],
    [
      {
        mehrereTaetigkeiten: YesNo.NO,
        vorGeburt: YesNo.YES,
        isNichtSelbststaendig: false,
        isSelbststaendig: true,
        sozialVersicherungsPflichtig: null,
        monatlichesBrutto: null,
      },
      ErwerbsArt.JA_SELBSTSTAENDIG,
    ],
    [
      {
        mehrereTaetigkeiten: YesNo.NO,
        vorGeburt: YesNo.YES,
        isNichtSelbststaendig: true,
        isSelbststaendig: true,
        sozialVersicherungsPflichtig: null,
        monatlichesBrutto: null,
      },
      ErwerbsArt.JA_MISCHEINKOMMEN,
    ],
  ])(
    "when ui stepErwerbstaetigkeit is %p, then PersoenlicheDaten.etVorGeburt are %p",
    (
      erwerbstaetigkeit: StepErwerbstaetigkeitElternteil,
      expected: ErwerbsArt,
    ) => {
      it("should create PersoenlicheDaten with ErwerbsArt", () => {
        // setup
        const etSave = mockStore.stepErwerbstaetigkeit.ET1;

        // given
        mockStore.stepErwerbstaetigkeit.ET1 = erwerbstaetigkeit;

        // when
        const persoenlicheDaten = persoenlicheDatenOfUi(mockStore, "ET1", []);

        // then
        expect(persoenlicheDaten.etVorGeburt).toBe(expected);

        // cleanup
        mockStore.stepErwerbstaetigkeit.ET1 = etSave;
      });
    },
  );
});
