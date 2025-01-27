import { describe, expect, it } from "vitest";
import { BruttoNettoRechner } from "./brutto-netto-rechner";
import {
  Einkommen,
  ErwerbsArt,
  KassenArt,
  KinderFreiBetrag,
  RentenArt,
  SteuerKlasse,
} from "@/globals/js/calculations/model";

describe("brutto-netto-rechner", () => {
  const bruttoNettoRechner = new BruttoNettoRechner();

  it("should calculate test from TestErweiterterAlgorithmus.java", () => {
    // given
    const finanzDaten = {
      bruttoEinkommen: new Einkommen(0),
      steuerKlasse: SteuerKlasse.SKL4,
      kinderFreiBetrag: KinderFreiBetrag.ZKF1,
      kassenArt: KassenArt.GESETZLICH_PFLICHTVERSICHERT,
      rentenVersicherung: RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG,
      splittingFaktor: 1.0,
      mischEinkommenTaetigkeiten: [],
      erwerbsZeitraumLebensMonatList: [],
    };

    // when
    const actual = bruttoNettoRechner.abzuege(
      2000,
      2022,
      finanzDaten,
      ErwerbsArt.JA_SELBSTSTAENDIG,
    );

    // then
    expect(actual).toBe(556.83);
  });
});
