import {
  type Eingangsparameter,
  type Lohnsteuerjahr,
  UnterstuetzteLohnsteuerjahre,
  berechneSteuerUndSozialabgaben,
} from "@/elterngeldrechner/brutto-netto-rechner/steuer-und-sozialabgaben";
import {
  ErwerbsArt,
  FinanzDaten,
  KinderFreiBetrag,
  SteuerKlasse,
  kinderFreiBetragToNumber,
  steuerklasseToNumber,
} from "@/elterngeldrechner/model";
import { bestimmeWerbekostenpauschale } from "@/elterngeldrechner/werbekostenpauschale";

export function abgabenSteuern(
  finanzDaten: FinanzDaten,
  erwerbsArt: ErwerbsArt,
  bruttoProMonat: number,
  geburtsdatumDesKindes: Date,
): { bk: number; lstlzz: number; solzlzz: number } {
  const istSelbststaendig = erwerbsArt === ErwerbsArt.JA_SELBSTSTAENDIG;

  const steuerpflichtigesEinkommen =
    bruttoProMonat +
    (istSelbststaendig
      ? bestimmeWerbekostenpauschale(geburtsdatumDesKindes)
      : 0);

  const eingangsparameter: Eingangsparameter = {
    AF: finanzDaten.steuerKlasse === SteuerKlasse.SKL4_FAKTOR ? 1 : 0,
    F:
      finanzDaten.steuerKlasse === SteuerKlasse.SKL4_FAKTOR
        ? finanzDaten.splittingFaktor
        : 0,
    KRV: erwerbsArt === ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI ? 2 : 0,
    KVZ: 0.9, // TODO: verify this
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
    STKL: steuerklasseToNumber(finanzDaten.steuerKlasse),
    VBEZ: 0,
    ZKF: kinderFreiBetragToNumber(finanzDaten.kinderFreiBetrag),
  };

  const lohnsteuerjahr = ermittelRelevantesLohnsteuerjahr(
    geburtsdatumDesKindes,
  );

  const { BK, LSTLZZ, SOLZLZZ } = berechneSteuerUndSozialabgaben(
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
  geburtsdatumDesKindes: Date,
): Lohnsteuerjahr {
  const jahrVorDerGeburt = geburtsdatumDesKindes.getFullYear() - 1;
  const aeltestesLohnsteuerjahr = UnterstuetzteLohnsteuerjahre.toSorted()[0]!;

  return (
    UnterstuetzteLohnsteuerjahre.toSorted().findLast(
      (lohnsteuerjahr) => lohnsteuerjahr <= jahrVorDerGeburt,
    ) ?? aeltestesLohnsteuerjahr
  );
}

if (import.meta.vitest) {
  const { describe, it, expect, beforeEach, vi } = import.meta.vitest;

  describe("erg-steuer-rechner", async () => {
    const { Einkommen, KassenArt, RentenArt } = await import(
      "@/elterngeldrechner/model"
    );

    const steuerUndSozialabgabenModule = await import(
      "@/elterngeldrechner/brutto-netto-rechner/steuer-und-sozialabgaben"
    );

    beforeEach(() => {
      vi.spyOn(steuerUndSozialabgabenModule, "berechneSteuerUndSozialabgaben");
    });

    describe.each([
      ["2022-02-24T03:24:00", 2021],
      ["2021-02-24T03:24:00", 2021],
      ["2020-02-24T03:24:00", 2021],
      ["2016-02-24T03:24:00", 2021],
      ["2023-02-24T03:24:00", 2022],
      ["2024-02-24T03:24:00", 2023],
      ["2025-02-24T03:24:00", 2024],
      ["2026-02-24T03:24:00", 2024],
    ])(
      "when wahrscheinlichesGeburtsDatum is %s then expect Lohnsteuerjahr %d",
      (wahrscheinlichesGeburtsDatum, lohnSteuerJahr) => {
        it("should calculate Abgaben", () => {
          expect(
            ermittelRelevantesLohnsteuerjahr(
              new Date(wahrscheinlichesGeburtsDatum),
            ),
          ).toBe(lohnSteuerJahr);
        });
      },
    );

    describe("should set Faktor Verfahren to", () => {
      it("1 if SteuerKlasse is SKL4_FAKTOR", () => {
        // when
        abgabenSteuern(
          {
            ...ANY_FINANZDATEN,
            steuerKlasse: SteuerKlasse.SKL4_FAKTOR,
            splittingFaktor: 1,
          },
          ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI,
          1,
          ANY_DATE,
        );

        // then
        expect(berechneSteuerUndSozialabgaben).toHaveBeenLastCalledWith(
          expect.anything(),
          expect.objectContaining({ AF: 1, F: 1 }),
        );
      });

      it("0 if SteuerKlasse is not SKL4_FAKTOR", () => {
        // when
        abgabenSteuern(
          {
            ...ANY_FINANZDATEN,
            steuerKlasse: SteuerKlasse.SKL4,
            splittingFaktor: 0,
          },
          ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI,
          1,
          ANY_DATE,
        );

        // then
        expect(berechneSteuerUndSozialabgaben).toHaveBeenLastCalledWith(
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
            steuerKlasse: SteuerKlasse.SKL5,
            kinderFreiBetrag: KinderFreiBetrag.ZKF1,
          },
          ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI,
          1,
          ANY_DATE,
        );

        // then
        expect(berechneSteuerUndSozialabgaben).toHaveBeenLastCalledWith(
          expect.anything(),
          expect.objectContaining({ ZKF: 1 }),
        );
      });
    });

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

    const ANY_DATE = new Date();
  });
}
