import { bestimmeKassenindividuellenZusatzbeitrag } from "./KassenindividuellerZusatzbeitrag";
import { bestimmeWerbekostenpauschale } from "@/elterngeldrechner/Werbekostenpauschale";
import {
  aufDenCentRunden,
  shiftNumberByDecimalsPrecisely,
} from "@/elterngeldrechner/common/math-util";
import {
  ErwerbsArt,
  FinanzDaten,
  Geburtstag,
  KinderFreiBetrag,
  Steuerklasse,
  kinderFreiBetragToNumber,
} from "@/elterngeldrechner/model";
import {
  type Eingangsparameter,
  type Lohnsteuerjahr,
  UnterstuetzteLohnsteuerjahre,
  berechneLohnsteuer,
} from "@/lohnsteuerrechner";

export function abgabenSteuern(
  finanzDaten: FinanzDaten,
  erwerbsArt: ErwerbsArt,
  bruttoProMonat: number,
  geburtstagDesKindes: Geburtstag,
): { bk: number; lstlzz: number; solzlzz: number } {
  const istSelbststaendig = erwerbsArt === ErwerbsArt.JA_SELBSTSTAENDIG;

  const steuerpflichtigesEinkommen =
    bruttoProMonat +
    (istSelbststaendig ? bestimmeWerbekostenpauschale(geburtstagDesKindes) : 0);

  /** Siehe {@link Eingangsparameter.KVZ } */
  const KVZ = aufDenCentRunden(
    shiftNumberByDecimalsPrecisely(
      bestimmeKassenindividuellenZusatzbeitrag(geburtstagDesKindes),
      2,
    ),
  );

  const lohnsteuerjahr = ermittelRelevantesLohnsteuerjahr(geburtstagDesKindes);

  const eingangsparameter: Eingangsparameter = {
    AF: finanzDaten.steuerklasse === Steuerklasse.IVMitFaktor ? 1 : 0,
    F:
      finanzDaten.steuerklasse === Steuerklasse.IVMitFaktor
        ? finanzDaten.splittingFaktor
        : 0,
    KRV:
      erwerbsArt === ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI
        ? lohnsteuerjahr >= 2025
          ? 1
          : 2
        : 0,
    KVZ,
    LZZ: 2,
    LZZFREIB: 0,
    LZZHINZU: 0,
    PKPV: 0,
    PKV: 0,
    PVA: 0, // Fix nach Richtlinien zum BEEG. Geschwister können nicht betrachtet werden.
    PVS: 0,
    PVZ: 0,
    R: finanzDaten.istKirchensteuerpflichtig ? 1 : 0,
    RE4: steuerpflichtigesEinkommen * 100,
    STKL: STEUERKLASSE_TO_STKL_EINGANGSPARAMETER[finanzDaten.steuerklasse],
    VBEZ: 0,
    ZKF: kinderFreiBetragToNumber(finanzDaten.kinderFreiBetrag),
  };

  const { BK, LSTLZZ, SOLZLZZ } = berechneLohnsteuer(
    lohnsteuerjahr,
    eingangsparameter,
  );

  return {
    bk: BK / 100,
    lstlzz: LSTLZZ / 100,
    solzlzz: SOLZLZZ / 100,
  };
}

export function ermittelRelevantesLohnsteuerjahr(
  geburtstagDesKindes: Geburtstag,
): Lohnsteuerjahr {
  const jahrVorDerGeburt = geburtstagDesKindes.getFullYear() - 1;
  const aeltestesLohnsteuerjahr = UnterstuetzteLohnsteuerjahre.toSorted()[0]!;

  return (
    UnterstuetzteLohnsteuerjahre.toSorted().findLast(
      (lohnsteuerjahr) => lohnsteuerjahr <= jahrVorDerGeburt,
    ) ?? aeltestesLohnsteuerjahr
  );
}

const STEUERKLASSE_TO_STKL_EINGANGSPARAMETER: Record<
  Steuerklasse,
  Eingangsparameter["STKL"]
> = {
  [Steuerklasse.I]: 1,
  [Steuerklasse.II]: 2,
  [Steuerklasse.III]: 3,
  [Steuerklasse.IV]: 4,
  [Steuerklasse.IVMitFaktor]: 4,
  [Steuerklasse.V]: 5,
  [Steuerklasse.VI]: 6,
};

if (import.meta.vitest) {
  const { describe, it, expect, beforeEach, vi, test } = import.meta.vitest;

  describe("erg-steuer-rechner", async () => {
    const { Einkommen, KassenArt, RentenArt } =
      await import("@/elterngeldrechner/model");

    beforeEach(async () => {
      vi.spyOn(await import("@/lohnsteuerrechner"), "berechneLohnsteuer");
    });

    test.each([
      [2024, 2],
      [2025, 2],
      [2026, 1],
      [2027, 1],
    ])(
      "when Geburtsjahr is %s then expect Merker für die Vorsorgepauschale to be %d",
      (geburtsjahr, krv) => {
        const geburtstag = new Geburtstag(`${geburtsjahr}-01-15T00:00:00`);

        abgabenSteuern(
          ANY_FINANZDATEN,
          ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI,
          1,
          geburtstag,
        );

        expect(berechneLohnsteuer).toHaveBeenLastCalledWith(
          expect.anything(),
          expect.objectContaining({ KRV: krv }),
        );
      },
    );

    describe.each([
      [new Geburtstag("2022-02-24T03:24:00"), 2021],
      [new Geburtstag("2021-02-24T03:24:00"), 2021],
      [new Geburtstag("2020-02-24T03:24:00"), 2021],
      [new Geburtstag("2016-02-24T03:24:00"), 2021],
      [new Geburtstag("2023-02-24T03:24:00"), 2022],
      [new Geburtstag("2024-02-24T03:24:00"), 2023],
      [new Geburtstag("2025-02-24T03:24:00"), 2024],
      [new Geburtstag("2026-02-24T03:24:00"), 2025],
    ])(
      "when Geburtstag des Kindes is %s then expect Lohnsteuerjahr %d",
      (geburtstagDesKindes, lohnSteuerJahr) => {
        it("should calculate Abgaben", () => {
          expect(ermittelRelevantesLohnsteuerjahr(geburtstagDesKindes)).toBe(
            lohnSteuerJahr,
          );
        });
      },
    );

    describe("should set Faktor Verfahren to", () => {
      it("1 if SteuerKlasse is SKL4_FAKTOR", () => {
        // when
        abgabenSteuern(
          {
            ...ANY_FINANZDATEN,
            steuerklasse: Steuerklasse.IVMitFaktor,
            splittingFaktor: 1,
          },
          ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI,
          1,
          ANY_GEBURTSTAG,
        );

        // then
        expect(berechneLohnsteuer).toHaveBeenLastCalledWith(
          expect.anything(),
          expect.objectContaining({ AF: 1, F: 1 }),
        );
      });

      it("0 if SteuerKlasse is not SKL4_FAKTOR", () => {
        // when
        abgabenSteuern(
          {
            ...ANY_FINANZDATEN,
            steuerklasse: Steuerklasse.IV,
            splittingFaktor: 0,
          },
          ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI,
          1,
          ANY_GEBURTSTAG,
        );

        // then
        expect(berechneLohnsteuer).toHaveBeenLastCalledWith(
          expect.anything(),
          expect.objectContaining({ AF: 0, F: 0 }),
        );
      });
    });

    describe("should set kinderFreiBetrag to", () => {
      it("1 if ErwerbsArt is not JA_NICHT_SELBST_MINI", () => {
        // when
        abgabenSteuern(
          {
            ...ANY_FINANZDATEN,
            steuerklasse: Steuerklasse.V,
            kinderFreiBetrag: KinderFreiBetrag.ZKF1,
          },
          ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI,
          1,
          ANY_GEBURTSTAG,
        );

        // then
        expect(berechneLohnsteuer).toHaveBeenLastCalledWith(
          expect.anything(),
          expect.objectContaining({ ZKF: 1 }),
        );
      });
    });

    it("formats the kassenindividuellen Zusatzbeitrag with a rounded precision of decimals and as Prozenwert beetween 1 and 100", async () => {
      vi.spyOn(
        await import("./KassenindividuellerZusatzbeitrag"),
        "bestimmeKassenindividuellenZusatzbeitrag",
      ).mockReturnValue(0.49715);

      abgabenSteuern(...ANY_PARAMETERS);

      expect(berechneLohnsteuer).toHaveBeenLastCalledWith(
        expect.anything(),
        expect.objectContaining({ KVZ: 49.72 }),
      );
    });

    const ANY_FINANZDATEN = {
      bruttoEinkommen: new Einkommen(0),
      steuerklasse: Steuerklasse.I,
      kinderFreiBetrag: KinderFreiBetrag.ZKF0,
      kassenArt: KassenArt.GESETZLICH_PFLICHTVERSICHERT,
      rentenVersicherung: RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG,
      splittingFaktor: 1.0,
      mischEinkommenTaetigkeiten: [],
      erwerbsZeitraumLebensMonatList: [],
    };

    const ANY_GEBURTSTAG = new Geburtstag(Date.now());

    const ANY_PARAMETERS: Parameters<typeof abgabenSteuern> = [
      ANY_FINANZDATEN,
      ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI,
      2000,
      ANY_GEBURTSTAG,
    ];
  });
}
