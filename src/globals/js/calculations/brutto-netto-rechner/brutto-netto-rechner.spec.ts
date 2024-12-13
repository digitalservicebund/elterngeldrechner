import Big from "big.js";
import { BruttoNettoRechner } from "./brutto-netto-rechner";
import {
  ErwerbsArt,
  FinanzDaten,
  KinderFreiBetrag,
  SteuerKlasse,
} from "@/globals/js/calculations/model";

describe("brutto-netto-rechner", () => {
  const bruttoNettoRechner = new BruttoNettoRechner();

  it("should calculate test from TestErweiterterAlgorithmus.java", () => {
    // given
    const finanzDaten = new FinanzDaten();
    finanzDaten.steuerKlasse = SteuerKlasse.SKL4;
    finanzDaten.kinderFreiBetrag = KinderFreiBetrag.ZKF1;

    // when
    const actual = bruttoNettoRechner.abzuege(
      Big(2000),
      2022,
      finanzDaten,
      ErwerbsArt.JA_SELBSTSTAENDIG,
    );

    // then
    expect(actual.toNumber()).toBe(556.83);
  });
});
