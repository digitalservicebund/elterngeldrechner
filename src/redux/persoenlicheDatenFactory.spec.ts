import { initialStepConfigurationState } from "./configurationSlice";
import { persoenlicheDatenOfUi } from "./persoenlicheDatenFactory";
import { initialAverageOrMonthlyStateNichtSelbstaendig } from "./stepEinkommenSlice";
import {
  MonatlichesBrutto,
  StepErwerbstaetigkeitElternteil,
} from "./stepErwerbstaetigkeitSlice";
import { YesNo } from "./yes-no";
import { RootState } from "./index";
import { ErwerbsArt, KinderFreiBetrag } from "@/globals/js/calculations/model";
import { initialFeedbackState } from "@/redux/feedbackSlice";

vi.mock("react-redux", () => ({
  useSelector: vi.fn(),
  useDispatch: vi.fn(),
}));

describe("persoenlicheDatenFactory", () => {
  const mockStore: RootState = {
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
    configuration: initialStepConfigurationState,
    feedback: initialFeedbackState,
  };

  it("should create PersoenlicheDaten for ET1", () => {
    // when
    const persoenlicheDaten = persoenlicheDatenOfUi(mockStore, "ET1");

    // then
    expect(persoenlicheDaten.wahrscheinlichesGeburtsDatum.getDate()).toBe(30);
    expect(persoenlicheDaten.wahrscheinlichesGeburtsDatum.getMonth()).toBe(9);
    expect(persoenlicheDaten.wahrscheinlichesGeburtsDatum.getFullYear()).toBe(
      2022,
    );
    expect(persoenlicheDaten.geschwister?.[0].geburtsdatum?.getDate()).toBe(2);
    expect(persoenlicheDaten.geschwister?.[0].geburtsdatum?.getMonth()).toBe(2);
    expect(persoenlicheDaten.geschwister?.[0].geburtsdatum?.getFullYear()).toBe(
      2017,
    );
    expect(persoenlicheDaten.geschwister?.[1].geburtsdatum?.getDate()).toBe(31);
    expect(persoenlicheDaten.geschwister?.[1].geburtsdatum?.getMonth()).toBe(4);
    expect(persoenlicheDaten.geschwister?.[1].geburtsdatum?.getFullYear()).toBe(
      2008,
    );
    expect(persoenlicheDaten.anzahlKuenftigerKinder).toBe(1);
    expect(persoenlicheDaten.geschwister).toHaveLength(2);
    expect(persoenlicheDaten.etVorGeburt).toBe(ErwerbsArt.NEIN);
    expect(persoenlicheDaten.hasEtNachGeburt).toBeUndefined();
  });

  it("should create PersoenlicheDaten for Alleinerziehend", () => {
    // given
    mockStore.stepAllgemeineAngaben.alleinerziehend = YesNo.YES;

    // when
    const persoenlicheDaten = persoenlicheDatenOfUi(mockStore, "ET1");

    // then
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
    "when ui stepErwerbstaetigkeit is %s, then PersoenlicheDaten.etVorGeburt are %s",
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
        const persoenlicheDaten = persoenlicheDatenOfUi(mockStore, "ET1");

        // then
        expect(persoenlicheDaten.etVorGeburt).toBe(expected);

        // cleanup
        mockStore.stepErwerbstaetigkeit.ET1 = etSave;
      });
    },
  );
});
