import Big from "big.js";
import { finanzDatenOfUi } from "./finanzDatenFactory";
import {
  AverageOrMonthlyState,
  initialAverageOrMonthlyStateNichtSelbstaendig,
  StepEinkommenElternteil,
  Taetigkeit,
} from "./stepEinkommenSlice";
import { initialMonatsplanerState } from "./monatsplanerSlice";
import {
  BruttoEinkommenZeitraum,
  initialStepRechnerState,
} from "./stepRechnerSlice";
import { Erwerbstaetigkeiten } from "./stepErwerbstaetigkeitSlice";
import { initialStepConfigurationState } from "./configurationSlice";
import { RootState } from "./index";
import {
  createMischEkTaetigkeitOf,
  Einkommen,
  ErwerbsTaetigkeit,
  FinanzDaten,
  KassenArt,
  KinderFreiBetrag,
  MischEkTaetigkeit,
  RentenArt,
  SteuerKlasse,
  YesNo,
} from "@/globals/js/calculations/model";

vi.mock("react-redux", () => ({
  useSelector: vi.fn(),
  useDispatch: vi.fn(),
}));

const finanzDatenOf = (data: any) => {
  return Object.assign(new FinanzDaten(), data);
};

describe("finanzDatenFactory", () => {
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
      wahrscheinlichesGeburtsDatum: "06.07.2022",
      geschwisterkinder: [],
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
        istSelbststaendig: null,
        istNichtSelbststaendig: null,
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
        istSelbststaendig: null,
        istNichtSelbststaendig: null,
      },
      antragstellende: null,
      limitEinkommenUeberschritten: null,
    },
    stepRechner: initialStepRechnerState,
    configuration: initialStepConfigurationState,
  };

  it("should create FinanzDaten for ET1 without bruttoEinkommenZeitraumList", () => {
    // when
    const finanzDaten = finanzDatenOfUi(mockStore, "ET1", []);

    // then
    expect(finanzDaten.erwerbsZeitraumLebensMonatList.length).toBe(0);
  });

  it("should create FinanzDaten for ET2 with bruttoEinkommenZeitraumList", () => {
    // given
    const bruttoEinkommenZeitraumList: BruttoEinkommenZeitraum[] = [
      { bruttoEinkommen: 1000, zeitraum: { from: "1", to: "1" } },
    ];

    // when
    const finanzDaten = finanzDatenOfUi(
      mockStore,
      "ET2",
      bruttoEinkommenZeitraumList,
    );

    // then
    expect(finanzDaten.erwerbsZeitraumLebensMonatList.length).toBe(1);
    expect(finanzDaten.erwerbsZeitraumLebensMonatList[0].vonLebensMonat).toBe(
      1,
    );
    expect(finanzDaten.erwerbsZeitraumLebensMonatList[0].bisLebensMonat).toBe(
      1,
    );
    expect(
      finanzDaten.erwerbsZeitraumLebensMonatList[0].bruttoProMonat.value.toNumber(),
    ).toBe(1000);
  });

  it("should create FinanzDaten for ET2 with einkommen vor geburt - kein minijob", () => {
    // setup
    const erwerbsTaetigkeitSave = { ...mockStore.stepErwerbstaetigkeit.ET2 };
    const einkommenSave = { ...mockStore.stepEinkommen.ET2 };

    // given
    mockStore.stepErwerbstaetigkeit.ET2.isNichtSelbststaendig = true;
    mockStore.stepEinkommen.ET2.bruttoEinkommenNichtSelbstaendig = {
      type: "average",
      average: 1000,
      perYear: null,
      perMonth: [],
    };
    // when
    const finanzDaten = finanzDatenOfUi(mockStore, "ET2", []);

    // then
    expect(finanzDaten.bruttoEinkommen.value.toNumber()).toBe(1000);

    // cleanup
    mockStore.stepErwerbstaetigkeit.ET2 = erwerbsTaetigkeitSave;
    mockStore.stepEinkommen.ET2 = einkommenSave;
  });

  it("should create FinanzDaten for ET2 with average einkommen vor geburt - minijob", () => {
    // setup
    const erwerbsTaetigkeitSave = { ...mockStore.stepErwerbstaetigkeit.ET2 };
    const einkommenSave = { ...mockStore.stepEinkommen.ET2 };

    // given
    mockStore.stepErwerbstaetigkeit.ET2.isNichtSelbststaendig = true;
    mockStore.stepErwerbstaetigkeit.ET2.monatlichesBrutto = "MiniJob";
    mockStore.stepEinkommen.ET2.bruttoEinkommenNichtSelbstaendig = {
      type: "average",
      average: 1000,
      perYear: null,
      perMonth: [],
    };
    // when
    const finanzDaten = finanzDatenOfUi(mockStore, "ET2", []);

    // then
    expect(finanzDaten.bruttoEinkommen.value.toNumber()).toBe(1000);

    // cleanup
    mockStore.stepErwerbstaetigkeit.ET2 = erwerbsTaetigkeitSave;
    mockStore.stepEinkommen.ET2 = einkommenSave;
  });

  it("should create FinanzDaten for ET2 with monthly einkommen vor geburt - minijob", () => {
    // setup
    const erwerbsTaetigkeitSave = { ...mockStore.stepErwerbstaetigkeit.ET2 };
    const einkommenSave = { ...mockStore.stepEinkommen.ET2 };

    // given
    mockStore.stepErwerbstaetigkeit.ET2.isNichtSelbststaendig = true;
    mockStore.stepErwerbstaetigkeit.ET2.monatlichesBrutto = "MiniJob";
    mockStore.stepEinkommen.ET2.bruttoEinkommenNichtSelbstaendig = {
      type: "monthly",
      average: null,
      perYear: null,
      perMonth: [6000, 6000],
    };
    // when
    const finanzDaten = finanzDatenOfUi(mockStore, "ET2", []);

    // then
    expect(finanzDaten.bruttoEinkommen.value.toNumber()).toBe(6000);

    // cleanup
    mockStore.stepErwerbstaetigkeit.ET2 = erwerbsTaetigkeitSave;
    mockStore.stepEinkommen.ET2 = einkommenSave;
  });

  it("should create FinanzDaten for ET2 with yearly gewinn vor geburt - minijob", () => {
    // setup
    const erwerbsTaetigkeitSave = { ...mockStore.stepErwerbstaetigkeit.ET2 };
    const einkommenSave = { ...mockStore.stepEinkommen.ET2 };

    // given
    mockStore.stepErwerbstaetigkeit.ET2.isNichtSelbststaendig = false;
    mockStore.stepErwerbstaetigkeit.ET2.isSelbststaendig = true;
    mockStore.stepErwerbstaetigkeit.ET2.monatlichesBrutto = "MiniJob";
    mockStore.stepEinkommen.ET2.gewinnSelbstaendig = {
      type: "yearly",
      average: null,
      perYear: 12000,
      perMonth: [],
    };
    // when
    const finanzDaten = finanzDatenOfUi(mockStore, "ET2", []);

    // then
    expect(finanzDaten.bruttoEinkommen.value.toNumber()).toBe(0);

    // cleanup
    mockStore.stepErwerbstaetigkeit.ET2 = erwerbsTaetigkeitSave;
    mockStore.stepEinkommen.ET2 = einkommenSave;
  });

  describe.each([
    [
      "map initialAverageOrMonthlyState",
      initialAverageOrMonthlyStateNichtSelbstaendig,
      0,
    ],
    [
      "map average null",
      {
        type: "average",
        average: null,
        perYear: null,
        perMonth: [],
      } as AverageOrMonthlyState,
      0,
    ],
    [
      "map average 0",
      {
        type: "average",
        average: 0,
        perYear: null,
        perMonth: [],
      } as AverageOrMonthlyState,
      0,
    ],
    [
      "map average 1000",
      {
        type: "average",
        average: 1000,
        perYear: null,
        perMonth: [],
      } as AverageOrMonthlyState,
      1000,
    ],
    [
      "map monthly list with nulls",
      {
        type: "monthly",
        average: null,
        perYear: null,
        perMonth: [null, null, null, null],
      } as AverageOrMonthlyState,
      0,
    ],
    [
      "map monthly list with null and 0",
      {
        type: "monthly",
        average: null,
        perYear: null,
        perMonth: [null, 0, null, 0],
      } as AverageOrMonthlyState,
      0,
    ],
    [
      "map monthly list with null 0 and 1000",
      {
        type: "monthly",
        average: null,
        perYear: null,
        perMonth: [null, 0, null, 1000],
      } as AverageOrMonthlyState,
      250,
    ],
    [
      "map yearly 12000",
      {
        type: "yearly",
        average: null,
        perYear: 12000,
        perMonth: [],
      } as AverageOrMonthlyState,
      1000,
    ],
    [
      "map yearly null",
      {
        type: "yearly",
        average: null,
        perYear: null,
        perMonth: [],
      } as AverageOrMonthlyState,
      0,
    ],
    [
      "map yearly 0",
      {
        type: "yearly",
        average: null,
        perYear: 0,
        perMonth: [],
      } as AverageOrMonthlyState,
      0,
    ],
    [
      "map yearly 240000",
      {
        type: "yearly",
        average: null,
        perYear: 240000,
        perMonth: [],
      } as AverageOrMonthlyState,
      20000,
    ],
  ])(
    "%p",
    (
      message: string,
      gewinnSelbstaendig: AverageOrMonthlyState,
      finanzDatenBruttoEinkommen: number,
    ) => {
      it("should create FinanzDaten for ET2 with gewinnSelbstaendig", () => {
        // setup
        const erwerbsTaetigkeitSave = {
          ...mockStore.stepErwerbstaetigkeit.ET2,
        };
        const einkommenSave = { ...mockStore.stepEinkommen.ET2 };

        // given
        mockStore.stepErwerbstaetigkeit.ET2.isNichtSelbststaendig = false;
        mockStore.stepErwerbstaetigkeit.ET2.isSelbststaendig = true;
        mockStore.stepEinkommen.ET2.gewinnSelbstaendig = gewinnSelbstaendig;

        // when
        const finanzDaten = finanzDatenOfUi(mockStore, "ET2", []);

        // then
        expect(finanzDaten.bruttoEinkommen.value.toNumber()).toBe(
          finanzDatenBruttoEinkommen,
        );

        // cleanup
        mockStore.stepErwerbstaetigkeit.ET2 = erwerbsTaetigkeitSave;
        mockStore.stepEinkommen.ET2 = einkommenSave;
      });
    },
  );

  describe.each([
    [
      "map initialAverageOrMonthlyStateNichtSelbstaendig",
      initialAverageOrMonthlyStateNichtSelbstaendig,
      0,
    ],
    [
      "map average null",
      {
        type: "average",
        average: null,
        perYear: null,
        perMonth: [],
      } as AverageOrMonthlyState,
      0,
    ],
    [
      "map average 0",
      {
        type: "average",
        average: 0,
        perYear: null,
        perMonth: [],
      } as AverageOrMonthlyState,
      0,
    ],
    [
      "map average 1000",
      {
        type: "average",
        average: 1000,
        perYear: null,
        perMonth: [],
      } as AverageOrMonthlyState,
      1000,
    ],
    [
      "map monthly list with nulls",
      {
        type: "monthly",
        average: null,
        perYear: null,
        perMonth: [null, null, null, null],
      } as AverageOrMonthlyState,
      0,
    ],
    [
      "map monthly list with null and 0",
      {
        type: "monthly",
        average: null,
        perYear: null,
        perMonth: [null, 0, null, 0],
      } as AverageOrMonthlyState,
      0,
    ],
    [
      "map monthly list with null 0 and 1000",
      {
        type: "monthly",
        average: null,
        perYear: null,
        perMonth: [null, 0, null, 1000],
      } as AverageOrMonthlyState,
      250,
    ],
  ])(
    "%p",
    (
      message: string,
      bruttoEinkommenNichtSelbstaendig: AverageOrMonthlyState,
      finanzDatenBruttoEinkommen: number,
    ) => {
      it("should create FinanzDaten for ET2 with bruttoEinkommenNichtSelbstaendig", () => {
        // setup
        const erwerbsTaetigkeitSave = {
          ...mockStore.stepErwerbstaetigkeit.ET2,
        };
        const einkommenSave = { ...mockStore.stepEinkommen.ET2 };

        // given
        mockStore.stepErwerbstaetigkeit.ET2.isNichtSelbststaendig = true;
        mockStore.stepErwerbstaetigkeit.ET2.isSelbststaendig = false;
        mockStore.stepEinkommen.ET2.bruttoEinkommenNichtSelbstaendig =
          bruttoEinkommenNichtSelbstaendig;

        // when
        const finanzDaten = finanzDatenOfUi(mockStore, "ET2", []);

        // then
        expect(finanzDaten.bruttoEinkommen.value.toNumber()).toBe(
          finanzDatenBruttoEinkommen,
        );

        // cleanup
        mockStore.stepErwerbstaetigkeit.ET2 = erwerbsTaetigkeitSave;
        mockStore.stepEinkommen.ET2 = einkommenSave;
      });
    },
  );

  describe.each([
    ["map empty Mischeinkommen list", [], []],
    [
      "map list with empty Mischeinkommen",
      [
        {
          artTaetigkeit: null,
          bruttoEinkommenDurchschnitt: null,
          isMinijob: null,
          zeitraum: [],
          versicherungen: {
            hasRentenversicherung: false,
            hasKrankenversicherung: false,
            hasArbeitslosenversicherung: false,
            none: true,
          },
        },
      ],
      [],
    ],
    [
      "map list with one Mischeinkommen",
      [
        {
          artTaetigkeit: "NichtSelbststaendig" as Erwerbstaetigkeiten,
          bruttoEinkommenDurchschnitt: 1000,
          isMinijob: YesNo.NO,
          zeitraum: [{ from: "1", to: "1" }],
          versicherungen: {
            hasRentenversicherung: true,
            hasKrankenversicherung: true,
            hasArbeitslosenversicherung: true,
            none: false,
          },
        },
      ],
      [
        createMischEkTaetigkeitOf(
          ErwerbsTaetigkeit.NICHT_SELBSTSTAENDIG,
          Big(1000),
          [
            true,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
          ],
          YesNo.YES,
          YesNo.YES,
          YesNo.YES,
        ),
      ],
    ],
    [
      "map list with 5 Mischeinkommen - contains all kinds of Taetigkeit",
      [
        {
          artTaetigkeit: "NichtSelbststaendig" as Erwerbstaetigkeiten,
          bruttoEinkommenDurchschnitt: 1000,
          isMinijob: YesNo.NO,
          zeitraum: [{ from: "1", to: "1" }],
          versicherungen: {
            hasRentenversicherung: true,
            hasKrankenversicherung: true,
            hasArbeitslosenversicherung: true,
            none: false,
          },
        },
        {
          artTaetigkeit: "NichtSelbststaendig" as Erwerbstaetigkeiten,
          bruttoEinkommenDurchschnitt: 300,
          isMinijob: YesNo.YES,
          zeitraum: [{ from: "1", to: "1" }],
          versicherungen: {
            hasRentenversicherung: false,
            hasKrankenversicherung: true,
            hasArbeitslosenversicherung: false,
            none: false,
          },
        },
        {
          artTaetigkeit: "Selbststaendig" as Erwerbstaetigkeiten,
          bruttoEinkommenDurchschnitt: 500,
          isMinijob: YesNo.NO,
          zeitraum: [{ from: "3", to: "5" }],
          versicherungen: {
            hasRentenversicherung: false,
            hasKrankenversicherung: true,
            hasArbeitslosenversicherung: false,
            none: false,
          },
        },
        {
          artTaetigkeit: "Selbststaendig" as Erwerbstaetigkeiten,
          bruttoEinkommenDurchschnitt: 1100,
          isMinijob: YesNo.NO,
          zeitraum: [{ from: "2", to: "5" }],
          versicherungen: {
            hasRentenversicherung: true,
            hasKrankenversicherung: true,
            hasArbeitslosenversicherung: false,
            none: false,
          },
        },
        {
          artTaetigkeit: "Selbststaendig" as Erwerbstaetigkeiten,
          bruttoEinkommenDurchschnitt: 600,
          isMinijob: YesNo.NO,
          zeitraum: [{ from: "2", to: "5" }],
          versicherungen: {
            hasRentenversicherung: true,
            hasKrankenversicherung: true,
            hasArbeitslosenversicherung: false,
            none: false,
          },
        },
      ],
      [
        createMischEkTaetigkeitOf(
          ErwerbsTaetigkeit.NICHT_SELBSTSTAENDIG,
          Big(1000),
          [
            true,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
          ],
          YesNo.YES,
          YesNo.YES,
          YesNo.YES,
        ),
        createMischEkTaetigkeitOf(
          ErwerbsTaetigkeit.MINIJOB,
          Big(300),
          [
            true,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
          ],
          YesNo.NO,
          YesNo.YES,
          YesNo.NO,
        ),
        createMischEkTaetigkeitOf(
          ErwerbsTaetigkeit.SELBSTSTAENDIG,
          Big(500),
          [
            false,
            false,
            true,
            true,
            true,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
          ],
          YesNo.NO,
          YesNo.YES,
          YesNo.NO,
        ),
        createMischEkTaetigkeitOf(
          ErwerbsTaetigkeit.SELBSTSTAENDIG,
          Big(1100),
          [
            false,
            true,
            true,
            true,
            true,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
          ],
          YesNo.YES,
          YesNo.YES,
          YesNo.NO,
        ),
        createMischEkTaetigkeitOf(
          ErwerbsTaetigkeit.SELBSTSTAENDIG,
          Big(600),
          [
            false,
            true,
            true,
            true,
            true,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
          ],
          YesNo.YES,
          YesNo.YES,
          YesNo.NO,
        ),
      ],
    ],
  ])(
    "%p",
    (
      message: string,
      taetigkeitList: Taetigkeit[],
      mischEkTaetigkeitList: MischEkTaetigkeit[],
    ) => {
      it("should create FinanzDaten for ET2 with Mischeinkommen", () => {
        // setup
        const erwerbsTaetigkeitSave = {
          ...mockStore.stepErwerbstaetigkeit.ET2,
        };
        const einkommenSave = { ...mockStore.stepEinkommen.ET2 };

        // given
        mockStore.stepErwerbstaetigkeit.ET2.isNichtSelbststaendig = true;
        mockStore.stepErwerbstaetigkeit.ET2.isSelbststaendig = true;
        mockStore.stepEinkommen.ET2.bruttoEinkommenNichtSelbstaendig = {
          type: "average",
          average: 10,
          perYear: null,
          perMonth: [],
        };
        mockStore.stepEinkommen.ET2.taetigkeitenNichtSelbstaendigUndSelbstaendig =
          taetigkeitList;

        // when
        const finanzDaten = finanzDatenOfUi(mockStore, "ET2", []);

        // then
        expect(finanzDaten.bruttoEinkommen.value.toNumber()).toBe(0);
        expect(finanzDaten.mischEinkommenTaetigkeiten).toStrictEqual(
          mischEkTaetigkeitList,
        );

        // cleanup
        mockStore.stepErwerbstaetigkeit.ET2 = erwerbsTaetigkeitSave;
        mockStore.stepEinkommen.ET2 = einkommenSave;
      });
    },
  );

  describe.each([
    [null, SteuerKlasse.SKL_UNBEKANNT],
    [SteuerKlasse.SKL_UNBEKANNT, SteuerKlasse.SKL_UNBEKANNT],
    [SteuerKlasse.SKL1, SteuerKlasse.SKL1],
    [SteuerKlasse.SKL2, SteuerKlasse.SKL2],
    [SteuerKlasse.SKL3, SteuerKlasse.SKL3],
    [SteuerKlasse.SKL4, SteuerKlasse.SKL4],
    [SteuerKlasse.SKL4_FAKTOR, SteuerKlasse.SKL4_FAKTOR],
    [SteuerKlasse.SKL5, SteuerKlasse.SKL5],
    [SteuerKlasse.SKL6, SteuerKlasse.SKL6],
  ])(
    "when einkommen SteuerKlasse is %p, then finanzDaten Steuerklasse are %p",
    (
      einkommenSteuerKlasse: SteuerKlasse | null,
      finanzDatenSteuerklasse: SteuerKlasse,
    ) => {
      it("should create FinanzDaten for StepEinkommenElternteil", () => {
        // setup
        const einkommenSave = { ...mockStore.stepEinkommen.ET2 };

        // given
        mockStore.stepEinkommen.ET1.steuerKlasse = einkommenSteuerKlasse;

        // when
        const finanzDaten = finanzDatenOfUi(mockStore, "ET1", []);

        // then
        expect(finanzDaten.steuerKlasse).toBe(finanzDatenSteuerklasse);

        // cleanup
        mockStore.stepEinkommen.ET1 = einkommenSave;
      });
    },
  );

  describe.each([
    [null, KinderFreiBetrag.ZKF0],
    [KinderFreiBetrag.ZKF0, KinderFreiBetrag.ZKF0],
    [KinderFreiBetrag.ZKF0_5, KinderFreiBetrag.ZKF0_5],
    [KinderFreiBetrag.ZKF1, KinderFreiBetrag.ZKF1],
    [KinderFreiBetrag.ZKF1_5, KinderFreiBetrag.ZKF1_5],
    [KinderFreiBetrag.ZKF2, KinderFreiBetrag.ZKF2],
    [KinderFreiBetrag.ZKF2_5, KinderFreiBetrag.ZKF2_5],
    [KinderFreiBetrag.ZKF3, KinderFreiBetrag.ZKF3],
    [KinderFreiBetrag.ZKF3_5, KinderFreiBetrag.ZKF3_5],
    [KinderFreiBetrag.ZKF4, KinderFreiBetrag.ZKF4],
    [KinderFreiBetrag.ZKF4_5, KinderFreiBetrag.ZKF4_5],
    [KinderFreiBetrag.ZKF5, KinderFreiBetrag.ZKF5],
  ])(
    "when einkommen KinderFreiBetrag is %p, then finanzDaten KinderFreiBetrag are %p",
    (
      einkommenKinderFreiBetrag: KinderFreiBetrag | null,
      finanzDatenKinderFreiBetrag: KinderFreiBetrag,
    ) => {
      it("should create FinanzDaten for StepEinkommenElternteil", () => {
        // setup
        const einkommenSave = { ...mockStore.stepEinkommen.ET2 };

        // given
        mockStore.stepEinkommen.ET1.kinderFreiBetrag =
          einkommenKinderFreiBetrag;

        // when
        const finanzDaten = finanzDatenOfUi(mockStore, "ET1", []);

        // then
        expect(finanzDaten.kinderFreiBetrag).toBe(finanzDatenKinderFreiBetrag);

        // cleanup
        mockStore.stepEinkommen.ET1 = einkommenSave;
      });
    },
  );

  describe.each([
    [null, RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG],
    [
      RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG,
      RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG,
    ],
    [
      RentenArt.KEINE_GESETZLICHE_RENTEN_VERSICHERUNG,
      RentenArt.KEINE_GESETZLICHE_RENTEN_VERSICHERUNG,
    ],
  ])(
    "when einkommen RentenArt is %p, then finanzDaten RentenArt are %p",
    (einkommenRentenArt: RentenArt | null, finanzDatenRentenArt: RentenArt) => {
      it("should create FinanzDaten for StepEinkommenElternteil", () => {
        // setup
        const einkommenSave = { ...mockStore.stepEinkommen.ET2 };

        // given
        mockStore.stepEinkommen.ET1.rentenVersicherung = einkommenRentenArt;

        // when
        const finanzDaten = finanzDatenOfUi(mockStore, "ET1", []);

        // then
        expect(finanzDaten.rentenVersicherung).toBe(finanzDatenRentenArt);

        // cleanup
        mockStore.stepEinkommen.ET1 = einkommenSave;
      });
    },
  );

  describe.each([
    [null, KassenArt.GESETZLICH_PFLICHTVERSICHERT],
    [
      KassenArt.GESETZLICH_PFLICHTVERSICHERT,
      KassenArt.GESETZLICH_PFLICHTVERSICHERT,
    ],
    [
      KassenArt.NICHT_GESETZLICH_PFLICHTVERSICHERT,
      KassenArt.NICHT_GESETZLICH_PFLICHTVERSICHERT,
    ],
  ])(
    "when einkommen KassenArt is %p, then finanzDaten KassenArt are %p",
    (einkommenKassenArt: KassenArt | null, finanzDatenKassenArt: KassenArt) => {
      it("should create FinanzDaten for StepEinkommenElternteil", () => {
        // setup
        const einkommenSave = { ...mockStore.stepEinkommen.ET2 };

        // given
        mockStore.stepEinkommen.ET1.kassenArt = einkommenKassenArt;

        // when
        const finanzDaten = finanzDatenOfUi(mockStore, "ET1", []);

        // then
        expect(finanzDaten.kassenArt).toBe(finanzDatenKassenArt);

        // cleanup
        mockStore.stepEinkommen.ET1 = einkommenSave;
      });
    },
  );

  describe.each([
    [null, 1],
    [1, 1],
    [2, 2],
    [1.5, 1.5],
  ])(
    "when einkommen splittingFaktor is %p, then finanzDaten splittingFaktor are %p",
    (
      einkommenSplittingFaktor: number | null,
      finanzSplittingFaktor: number,
    ) => {
      it("should create FinanzDaten for StepEinkommenElternteil", () => {
        // setup
        const einkommenSave = { ...mockStore.stepEinkommen.ET2 };

        // given
        mockStore.stepEinkommen.ET1.splittingFaktor = einkommenSplittingFaktor;

        // when
        const finanzDaten = finanzDatenOfUi(mockStore, "ET1", []);

        // then
        expect(finanzDaten.splittingFaktor).toBe(finanzSplittingFaktor);

        // cleanup
        mockStore.stepEinkommen.ET1 = einkommenSave;
      });
    },
  );

  describe.each([
    [
      "map initial ui",
      {
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
        antragstellende: null,
        hasMischEinkommen: null,
        istSelbststaendig: null,
        istNichtSelbststaendig: null,
      },
      finanzDatenOf({
        bruttoEinkommen: new Einkommen(0),
        zahlenSieKirchenSteuer: YesNo.NO,
        kinderFreiBetrag: KinderFreiBetrag.ZKF1,
        steuerKlasse: SteuerKlasse.SKL_UNBEKANNT,
        kassenArt: KassenArt.GESETZLICH_PFLICHTVERSICHERT,
        rentenVersicherung: RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG,
        splittingFaktor: 1.0,
        mischEinkommenTaetigkeiten: [],
        erwerbsZeitraumLebensMonatList: [],
      }),
    ],
  ])(
    "%p",
    (
      message: string,
      einkommen: StepEinkommenElternteil,
      expected: FinanzDaten,
    ) => {
      it("should create FinanzDaten for StepEinkommenElternteil", () => {
        // setup
        const einkommenSave = mockStore.stepEinkommen.ET1;

        // given
        mockStore.stepEinkommen.ET1 = einkommen;

        // when
        const finanzDaten = finanzDatenOfUi(mockStore, "ET1", []);

        // then
        expect(finanzDaten).toStrictEqual(expected);

        // cleanup
        mockStore.stepEinkommen.ET1 = einkommenSave;
      });
    },
  );
});
