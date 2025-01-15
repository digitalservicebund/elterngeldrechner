import Big from "big.js";
import { useCallback, useRef } from "react";
import {
  type Auswahloption,
  type BerechneElterngeldbezuegeCallback,
  type ElterngeldbezuegeFuerElternteil,
  Elternteil,
  KeinElterngeld,
  Lebensmonatszahlen,
  type Monat,
  Variante,
  isVariante,
} from "@/features/planer/domain";
import { EgrSteuerRechner } from "@/globals/js/calculations/brutto-netto-rechner/egr-steuer-rechner";
import { EgrCalculation } from "@/globals/js/calculations/egr-calculation";
import {
  Einkommen,
  ElternGeldArt,
  type ElternGeldDaten,
  type ElternGeldPlusErgebnis,
  ErwerbsZeitraumLebensMonat,
  FinanzDaten,
  type Lohnsteuerjahr,
  MutterschaftsLeistung,
  type PersoenlicheDaten,
  type PlanungsDaten,
} from "@/globals/js/calculations/model";
import type { RootState } from "@/redux";
import type { ElternteilType } from "@/redux/elternteil-type";
import { finanzDatenOfUi } from "@/redux/finanzDatenFactory";
import { useAppStore } from "@/redux/hooks";
import { persoenlicheDatenOfUi } from "@/redux/persoenlicheDatenFactory";

export function useBerechneElterngeldbezuege(): BerechneElterngeldbezuegeCallback {
  const store = useAppStore();
  const parameter = useRef(createStaticCalculationParameter(store.getState()));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(
    berechneElterngeldbezuege.bind(null, parameter.current),
    [],
  );
}

function createStaticCalculationParameter(
  state: RootState,
): StaticCalculationParameter {
  return {
    [Elternteil.Eins]: createStaticCalculationParameterForElternteil(
      state,
      "ET1",
    ),
    [Elternteil.Zwei]: createStaticCalculationParameterForElternteil(
      state,
      "ET2",
    ),
  };
}

function berechneElterngeldbezuege(
  staticParameter: StaticCalculationParameter,
  elternteil: Elternteil,
  monate: GeplanteMonate,
): ElterngeldbezuegeFuerElternteil {
  const { elterngelddaten, lohnsteuerjahr } = buildParameterForCalculation(
    staticParameter[elternteil],
    monate,
  );

  const ergebnis = new EgrCalculation().calculateElternGeld(
    elterngelddaten,
    lohnsteuerjahr,
  );

  return elterngeldbezuegeFrom(ergebnis);
}

function buildParameterForCalculation(
  staticParameter: StaticCalculationParameterForElternteil,
  monate: GeplanteMonate,
): { elterngelddaten: ElternGeldDaten; lohnsteuerjahr: Lohnsteuerjahr } {
  const { persoenlicheDaten, finanzdaten, lohnsteuerjahr } = staticParameter;

  const monateMitErwerbstaetigkeit = transformMonateForFinanzdaten(monate);
  const planungsdaten = transformMonateToPlanungsdaten(monate);

  /*
   * Attention:
   * Parameters are not cloned but the same memory is manipulated on every
   * calculation. This is effective as this algorithm runs over and over again.
   * Though, you need to be mindful about this. For example in testing.
   */
  persoenlicheDaten.hasEtNachGeburt = monateMitErwerbstaetigkeit.length > 0;
  finanzdaten.erwerbsZeitraumLebensMonatList = monateMitErwerbstaetigkeit;

  const elterngelddaten = {
    persoenlicheDaten,
    finanzDaten: finanzdaten,
    planungsDaten: planungsdaten,
  };

  return { elterngelddaten, lohnsteuerjahr };
}

function transformMonateForFinanzdaten(
  monate: GeplanteMonate,
): ErwerbsZeitraumLebensMonat[] {
  return Object.entries(monate)
    .filter(isEntryWithDefinedMonthValue)
    .filter(isEntryWithRelevantEinkommen)
    .map(
      ([lebensmonatszahl, monat]) =>
        new ErwerbsZeitraumLebensMonat(
          Number.parseInt(lebensmonatszahl),
          Number.parseInt(lebensmonatszahl),
          new Einkommen(monat.bruttoeinkommen),
        ),
    );
}

function transformMonateToPlanungsdaten(monate: GeplanteMonate): PlanungsDaten {
  return {
    mutterschaftsLeistung: MutterschaftsLeistung.MUTTERSCHAFTS_LEISTUNG_NEIN, // Does not matter.
    planung: Lebensmonatszahlen.map((lebensmonatszahl) =>
      elterngeldartFrom(monate[lebensmonatszahl]?.gewaehlteOption),
    ),
  };
}

function elterngeldbezuegeFrom(
  ergebnis: ElternGeldPlusErgebnis,
): ElterngeldbezuegeFuerElternteil {
  return ergebnis.elternGeldAusgabe.reduce(
    (elterngeldbezuege, ausgabe) => ({
      ...elterngeldbezuege,
      [ausgabe.lebensMonat]: ausgabe.elternGeld.toNumber(),
    }),
    {},
  );
}

function isEntryWithDefinedMonthValue<Key>(
  entry: [Key, Monat | undefined],
): entry is [Key, Monat] {
  return entry[1] !== undefined;
}

function isEntryWithRelevantEinkommen<Key>(
  entry: [Key, Monat],
): entry is [Key, Monat & { bruttoeinkommen: number }] {
  const monat = entry[1];
  return isVariante(monat.gewaehlteOption) && !!monat.bruttoeinkommen;
}

function elterngeldartFrom(option?: Auswahloption): ElternGeldArt {
  switch (option) {
    case Variante.Basis:
      return ElternGeldArt.BASIS_ELTERNGELD;

    case Variante.Plus:
    case Variante.Bonus:
      return ElternGeldArt.ELTERNGELD_PLUS;

    case KeinElterngeld:
    case undefined:
      return ElternGeldArt.KEIN_BEZUG;
  }
}

function createStaticCalculationParameterForElternteil(
  state: RootState,
  elternteil: ElternteilType,
): StaticCalculationParameterForElternteil {
  const persoenlicheDaten = persoenlicheDatenOfUi(state, elternteil);
  const finanzdaten = finanzDatenOfUi(state, elternteil, []);
  const lohnsteuerjahr = EgrSteuerRechner.bestLohnSteuerJahrOf(
    persoenlicheDaten.wahrscheinlichesGeburtsDatum,
  );
  return {
    persoenlicheDaten,
    finanzdaten,
    lohnsteuerjahr,
  };
}

type StaticCalculationParameter = Record<
  Elternteil,
  StaticCalculationParameterForElternteil
>;

type StaticCalculationParameterForElternteil = {
  persoenlicheDaten: PersoenlicheDaten;
  finanzdaten: FinanzDaten;
  lohnsteuerjahr: Lohnsteuerjahr;
};

type GeplanteMonate = Parameters<BerechneElterngeldbezuegeCallback>[1];

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("errechnete Elterngeldbezüge selector", async () => {
    const { renderHook } = await import("@/test-utils/test-utils");
    const { ErwerbsArt, KassenArt, SteuerKlasse, RentenArt, KinderFreiBetrag } =
      await import("@/globals/js/calculations/model");
    const { KeinElterngeld } = await import("@/features/planer/domain");

    vi.mock(import("@/redux/persoenlicheDatenFactory"));
    vi.mock(import("@/redux/finanzDatenFactory"));

    beforeEach(() => {
      vi.mocked(persoenlicheDatenOfUi).mockReturnValue(ANY_PERSOENLICHE_DATEN);
      vi.mocked(finanzDatenOfUi).mockReturnValue(ANY_FINANZDATEN);
    });

    it("calls the methods to create the static calculation parameter only once initially", () => {
      const { result } = renderHook(() => useBerechneElterngeldbezuege());

      expect(persoenlicheDatenOfUi).toHaveBeenCalled();
      expect(finanzDatenOfUi).toHaveBeenCalled();
      vi.clearAllMocks();

      result.current(ANY_ELTERNTEIL, ANY_MONATE);
      result.current(ANY_ELTERNTEIL, ANY_MONATE);

      expect(persoenlicheDatenOfUi).not.toHaveBeenCalled();
      expect(finanzDatenOfUi).not.toHaveBeenCalled();
    });

    it("uses the initially created static calculation parameters for the calculation calls", () => {
      const persoenlicheDaten = ANY_PERSOENLICHE_DATEN;
      vi.mocked(persoenlicheDatenOfUi).mockReturnValue(persoenlicheDaten);

      const finanzDaten = ANY_FINANZDATEN;
      vi.mocked(finanzDatenOfUi).mockReturnValue(finanzDaten);

      const calculateElternGeld = vi.spyOn(
        EgrCalculation.prototype,
        "calculateElternGeld",
      );

      const { result } = renderHook(() => useBerechneElterngeldbezuege());
      result.current(ANY_ELTERNTEIL, {});

      expect(calculateElternGeld).toHaveBeenCalledWith(
        {
          persoenlicheDaten,
          finanzDaten,
          planungsDaten: expect.anything() as PlanungsDaten,
        },
        expect.any(Number),
      );
    });

    it("transforms the chosen Variante of the geplante Monate for the calculation", () => {
      const calculateElternGeld = vi.spyOn(
        EgrCalculation.prototype,
        "calculateElternGeld",
      );

      const { result } = renderHook(() => useBerechneElterngeldbezuege());
      result.current(ANY_ELTERNTEIL, {
        1: monat(Variante.Plus),
        2: monat(Variante.Basis),
        4: monat(KeinElterngeld),
        5: monat(Variante.Bonus),
        6: monat(undefined),
      });

      expect(calculateElternGeld).toHaveBeenCalledOnce();
      expect(
        calculateElternGeld.mock.calls[0]?.[0].planungsDaten.planung,
      ).toStrictEqual([
        ElternGeldArt.ELTERNGELD_PLUS,
        ElternGeldArt.BASIS_ELTERNGELD,
        ElternGeldArt.KEIN_BEZUG,
        ElternGeldArt.KEIN_BEZUG,
        ElternGeldArt.ELTERNGELD_PLUS,
        ElternGeldArt.KEIN_BEZUG,
        ...Array<ElternGeldArt>(26).fill(ElternGeldArt.KEIN_BEZUG),
      ]);
    });

    it("reads the correct values for each Lebensmonat if calculation was successful", () => {
      vi.spyOn(EgrCalculation.prototype, "calculateElternGeld").mockReturnValue(
        calculationResult([100, 200]),
      );

      const { result } = renderHook(() => useBerechneElterngeldbezuege());
      const elterngeldbezuege = result.current(ANY_ELTERNTEIL, {});

      expect(elterngeldbezuege).toStrictEqual({ 1: 100, 2: 200 });
    });

    it("skips Monate without a Variante chosen when transforming the Finanzdaten", () => {
      const observeredErwerbsZeitraumLebensMonatListen =
        spyOnCalculationAndObserveErwerbsZeitraumLebensMonatListen();

      const { result } = renderHook(() => useBerechneElterngeldbezuege());
      result.current(ANY_ELTERNTEIL, {
        1: monat(KeinElterngeld, 100),
        2: monat(Variante.Plus, 200),
        5: monat(Variante.Bonus, 500),
        8: monat(undefined, 800),
      });

      expect(observeredErwerbsZeitraumLebensMonatListen).toStrictEqual([
        [
          new ErwerbsZeitraumLebensMonat(2, 2, new Einkommen(200)),
          new ErwerbsZeitraumLebensMonat(5, 5, new Einkommen(500)),
        ],
      ]);
    });

    it("skips Monate without Bruttoeinkommen when transforming Lebensmonate for the Finanzdaten", () => {
      const observeredErwerbsZeitraumLebensMonatListen =
        spyOnCalculationAndObserveErwerbsZeitraumLebensMonatListen();

      const { result } = renderHook(() => useBerechneElterngeldbezuege());
      result.current(ANY_ELTERNTEIL, {
        1: monat(Variante.Basis, 100),
        2: monat(Variante.Plus, null),
        5: monat(Variante.Basis, 0),
        8: monat(Variante.Bonus, 800),
      });

      expect(observeredErwerbsZeitraumLebensMonatListen).toStrictEqual([
        [
          new ErwerbsZeitraumLebensMonat(1, 1, new Einkommen(100)),
          new ErwerbsZeitraumLebensMonat(8, 8, new Einkommen(800)),
        ],
      ]);
    });

    const ANY_ELTERNTEIL = Elternteil.Eins;
    const ANY_MONATE = {};
    const ANY_PERSOENLICHE_DATEN = {
      anzahlKuenftigerKinder: 1,
      wahrscheinlichesGeburtsDatum: new Date(),
      etVorGeburt: ErwerbsArt.NEIN,
    };

    const ANY_FINANZDATEN = {
      bruttoEinkommen: new Einkommen(0),
      steuerKlasse: SteuerKlasse.SKL1,
      kinderFreiBetrag: KinderFreiBetrag.ZKF0,
      kassenArt: KassenArt.GESETZLICH_PFLICHTVERSICHERT,
      rentenVersicherung: RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG,
      splittingFaktor: 1.0,
      mischEinkommenTaetigkeiten: [],
      erwerbsZeitraumLebensMonatList: [],
    };

    function monat(
      gewaehlteOption?: Auswahloption,
      bruttoeinkommen?: number | null,
    ): Monat {
      return {
        gewaehlteOption,
        bruttoeinkommen,
        imMutterschutz: false as const,
      };
    }

    /**
     * Spy on the {@link EgrCalculation.prototype.calculateElternGeld} method and capture
     * the {@link FinanzDaten.prototype.erwerbsZeitraumLebensMonatList} it was
     * called with.
     *
     * This is a special "implementation" to overcome some limitations. The
     * tested code implicitly uses shared memory objects. Thereby, it is not
     * possible to observe call (parameters) via the {@link MockInstance}. As
     * these data structures can't be properly cloned, only some properties are
     * captured, navigating around this issue.
     *
     * @returns list that continuously captures the observed parameters
     */
    function spyOnCalculationAndObserveErwerbsZeitraumLebensMonatListen(): ErwerbsZeitraumLebensMonat[][] {
      const observeredErwerbsZeitraumLebensMonatListen: ErwerbsZeitraumLebensMonat[][] =
        [];

      vi.spyOn(
        EgrCalculation.prototype,
        "calculateElternGeld",
      ).mockImplementation((daten) => {
        observeredErwerbsZeitraumLebensMonatListen.push(
          daten.finanzDaten.erwerbsZeitraumLebensMonatList,
        );
        return calculationResult([]);
      });

      return observeredErwerbsZeitraumLebensMonatListen;
    }

    function calculationResult(
      elterngeldbezugProMonatsIndex: number[],
    ): ElternGeldPlusErgebnis {
      const zero = Big(0);

      const elternGeldAusgabe = elterngeldbezugProMonatsIndex.map(
        (elterngeldbezug, monthIndex) => ({
          lebensMonat: monthIndex + 1,
          elternGeld: Big(elterngeldbezug),
          mehrlingsZulage: zero,
          geschwisterBonus: zero,
          elterngeldArt: ElternGeldArt.KEIN_BEZUG,
          mutterschaftsLeistungMonat: false,
        }),
      );

      return {
        elternGeldAusgabe,
        ersatzRate: zero,
        geschwisterBonusDeadLine: null,
        nettoNachGeburtDurch: zero,
        geschwisterBonus: zero,
        mehrlingsZulage: zero,
        bruttoBasis: zero,
        nettoBasis: zero,
        elternGeldBasis: zero,
        elternGeldErwBasis: zero,
        bruttoPlus: zero,
        nettoPlus: zero,
        elternGeldEtPlus: zero,
        elternGeldKeineEtPlus: zero,
        message: "",
        hasPartnerBonusError: false,
        etVorGeburt: false,
      };
    }
  });
}
