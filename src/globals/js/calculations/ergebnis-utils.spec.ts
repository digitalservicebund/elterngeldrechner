import { ElternGeldArt, ElternGeldAusgabe } from "./model";
import { ErgebnisUtils } from "./ergebnis-utils";
import Big from "big.js";
import { MathUtil } from "./common/math-util";

describe("ergebnis-utils", () => {
  describe("should convert simulation result to result table for:", () => {
    it("empty ergebnis", () => {
      // when
      const table = ErgebnisUtils.elternGeldSimulationErgebnisOf([], [], []);

      // then
      expect(table).not.toBeUndefined();
      expect(table.rows.length).toBe(0);
    });

    it("ergebnis is one month Basiselterngeld", () => {
      // given
      const basisElternGeld = [
        elterngeldAusgabeOf(1, ElternGeldArt.BASIS_ELTERNGELD, 300),
      ];

      // when
      const table = ErgebnisUtils.elternGeldSimulationErgebnisOf(
        basisElternGeld,
        [],
        [],
      );

      // then
      expect(table).not.toBeUndefined();
      expect(table.rows.length).toBe(1);
      expect(table.rows[0].vonLebensMonat).toBe(1);
      expect(table.rows[0].bisLebensMonat).toBe(1);
      expect(table.rows[0].basisElternGeld.toNumber()).toBe(300);
      expect(table.rows[0].elternGeldPlus.toNumber()).toBe(0);
      expect(table.rows[0].nettoEinkommen.toNumber()).toBe(0);
    });

    it("ergebnis are two months ElterngeldPlus with same value", () => {
      // given
      const elternGeldPlus = [
        elterngeldAusgabeOf(1, ElternGeldArt.ELTERNGELD_PLUS, 150),
        elterngeldAusgabeOf(2, ElternGeldArt.ELTERNGELD_PLUS, 150),
      ];

      // when
      const table = ErgebnisUtils.elternGeldSimulationErgebnisOf(
        [],
        elternGeldPlus,
        [],
      );

      // then
      expect(table).not.toBeUndefined();
      expect(table.rows.length).toBe(1);
      expect(table.rows[0].vonLebensMonat).toBe(1);
      expect(table.rows[0].bisLebensMonat).toBe(2);
      expect(table.rows[0].basisElternGeld.toNumber()).toBe(0);
      expect(table.rows[0].elternGeldPlus.toNumber()).toBe(150);
      expect(table.rows[0].nettoEinkommen.toNumber()).toBe(0);
    });

    it("ergebnis are three months ElterngeldPlus with same value", () => {
      // given
      const elternGeldPlus = [
        elterngeldAusgabeOf(1, ElternGeldArt.KEIN_BEZUG),
        elterngeldAusgabeOf(2, ElternGeldArt.KEIN_BEZUG),
        elterngeldAusgabeOf(3, ElternGeldArt.ELTERNGELD_PLUS, 150),
        elterngeldAusgabeOf(4, ElternGeldArt.ELTERNGELD_PLUS, 150),
        elterngeldAusgabeOf(5, ElternGeldArt.ELTERNGELD_PLUS, 150),
        elterngeldAusgabeOf(6, ElternGeldArt.KEIN_BEZUG),
      ];

      // when
      const table = ErgebnisUtils.elternGeldSimulationErgebnisOf(
        [],
        elternGeldPlus,
        [],
      );

      // then
      expect(table).not.toBeUndefined();
      expect(table.rows.length).toBe(2);
      expect(table.rows[0].vonLebensMonat).toBe(1);
      expect(table.rows[0].bisLebensMonat).toBe(2);
      expect(table.rows[0].basisElternGeld.toNumber()).toBe(0);
      expect(table.rows[0].elternGeldPlus.toNumber()).toBe(0);
      expect(table.rows[0].nettoEinkommen.toNumber()).toBe(0);
      expect(table.rows[1].vonLebensMonat).toBe(3);
      expect(table.rows[1].bisLebensMonat).toBe(5);
      expect(table.rows[1].basisElternGeld.toNumber()).toBe(0);
      expect(table.rows[1].elternGeldPlus.toNumber()).toBe(150);
      expect(table.rows[1].nettoEinkommen.toNumber()).toBe(0);
    });

    it("ergebnis are Basiselterngeld and ElterngeldPlus with different values", () => {
      // given
      const basisElternGeld = [
        elterngeldAusgabeOf(1, ElternGeldArt.KEIN_BEZUG),
        elterngeldAusgabeOf(2, ElternGeldArt.BASIS_ELTERNGELD, 300),
        elterngeldAusgabeOf(3, ElternGeldArt.BASIS_ELTERNGELD, 300),
        elterngeldAusgabeOf(4, ElternGeldArt.BASIS_ELTERNGELD, 450),
        elterngeldAusgabeOf(5, ElternGeldArt.BASIS_ELTERNGELD, 150),
        elterngeldAusgabeOf(6, ElternGeldArt.KEIN_BEZUG),
        elterngeldAusgabeOf(7, ElternGeldArt.KEIN_BEZUG),
        elterngeldAusgabeOf(8, ElternGeldArt.KEIN_BEZUG),
        elterngeldAusgabeOf(9, ElternGeldArt.KEIN_BEZUG),
        elterngeldAusgabeOf(10, ElternGeldArt.KEIN_BEZUG),
        elterngeldAusgabeOf(11, ElternGeldArt.BASIS_ELTERNGELD, 400),
      ];
      const elternGeldPlus = [
        elterngeldAusgabeOf(1, ElternGeldArt.KEIN_BEZUG),
        elterngeldAusgabeOf(2, ElternGeldArt.KEIN_BEZUG),
        elterngeldAusgabeOf(3, ElternGeldArt.KEIN_BEZUG),
        elterngeldAusgabeOf(4, ElternGeldArt.KEIN_BEZUG),
        elterngeldAusgabeOf(5, ElternGeldArt.KEIN_BEZUG),
        elterngeldAusgabeOf(6, ElternGeldArt.ELTERNGELD_PLUS, 600),
        elterngeldAusgabeOf(7, ElternGeldArt.ELTERNGELD_PLUS, 600),
        elterngeldAusgabeOf(8, ElternGeldArt.ELTERNGELD_PLUS, 600),
        elterngeldAusgabeOf(9, ElternGeldArt.ELTERNGELD_PLUS, 1200),
        elterngeldAusgabeOf(10, ElternGeldArt.KEIN_BEZUG),
        elterngeldAusgabeOf(11, ElternGeldArt.KEIN_BEZUG),
      ];
      // when
      const table = ErgebnisUtils.elternGeldSimulationErgebnisOf(
        basisElternGeld,
        elternGeldPlus,
        [],
      );

      // then
      expect(table).not.toBeUndefined();
      expect(table.rows.length).toBe(7);
      expect(table.rows[0].vonLebensMonat).toBe(1);
      expect(table.rows[0].bisLebensMonat).toBe(1);
      expect(table.rows[0].basisElternGeld.toNumber()).toBe(0);
      expect(table.rows[0].elternGeldPlus.toNumber()).toBe(0);
      expect(table.rows[0].nettoEinkommen.toNumber()).toBe(0);

      expect(table.rows[1].vonLebensMonat).toBe(2);
      expect(table.rows[1].bisLebensMonat).toBe(3);
      expect(table.rows[1].basisElternGeld.toNumber()).toBe(300);
      expect(table.rows[1].elternGeldPlus.toNumber()).toBe(0);
      expect(table.rows[1].nettoEinkommen.toNumber()).toBe(0);

      expect(table.rows[2].vonLebensMonat).toBe(4);
      expect(table.rows[2].bisLebensMonat).toBe(4);
      expect(table.rows[2].basisElternGeld.toNumber()).toBe(450);
      expect(table.rows[2].elternGeldPlus.toNumber()).toBe(0);
      expect(table.rows[2].nettoEinkommen.toNumber()).toBe(0);

      expect(table.rows[3].vonLebensMonat).toBe(5);
      expect(table.rows[3].bisLebensMonat).toBe(5);
      expect(table.rows[3].basisElternGeld.toNumber()).toBe(150);
      expect(table.rows[3].elternGeldPlus.toNumber()).toBe(0);
      expect(table.rows[3].nettoEinkommen.toNumber()).toBe(0);

      expect(table.rows[4].vonLebensMonat).toBe(6);
      expect(table.rows[4].bisLebensMonat).toBe(8);
      expect(table.rows[4].basisElternGeld.toNumber()).toBe(0);
      expect(table.rows[4].elternGeldPlus.toNumber()).toBe(600);
      expect(table.rows[4].nettoEinkommen.toNumber()).toBe(0);

      expect(table.rows[5].vonLebensMonat).toBe(9);
      expect(table.rows[5].bisLebensMonat).toBe(9);
      expect(table.rows[5].basisElternGeld.toNumber()).toBe(0);
      expect(table.rows[5].elternGeldPlus.toNumber()).toBe(1200);
      expect(table.rows[5].nettoEinkommen.toNumber()).toBe(0);

      expect(table.rows[6].vonLebensMonat).toBe(11);
      expect(table.rows[6].bisLebensMonat).toBe(11);
      expect(table.rows[6].basisElternGeld.toNumber()).toBe(400);
      expect(table.rows[6].elternGeldPlus.toNumber()).toBe(0);
      expect(table.rows[6].nettoEinkommen.toNumber()).toBe(0);
    });

    it("ergebnis are Basiselterngeld and ElterngeldPlus with different values and netto", () => {
      // given
      const basisElternGeld = [
        elterngeldAusgabeOf(1, ElternGeldArt.KEIN_BEZUG),
        elterngeldAusgabeOf(2, ElternGeldArt.BASIS_ELTERNGELD, 300),
        elterngeldAusgabeOf(3, ElternGeldArt.BASIS_ELTERNGELD, 300),
        elterngeldAusgabeOf(4, ElternGeldArt.BASIS_ELTERNGELD, 450),
        elterngeldAusgabeOf(5, ElternGeldArt.BASIS_ELTERNGELD, 150),
        elterngeldAusgabeOf(6, ElternGeldArt.KEIN_BEZUG),
        elterngeldAusgabeOf(7, ElternGeldArt.KEIN_BEZUG),
        elterngeldAusgabeOf(8, ElternGeldArt.KEIN_BEZUG),
        elterngeldAusgabeOf(9, ElternGeldArt.KEIN_BEZUG),
        elterngeldAusgabeOf(10, ElternGeldArt.KEIN_BEZUG),
        elterngeldAusgabeOf(11, ElternGeldArt.BASIS_ELTERNGELD, 400),
      ];
      const elternGeldPlus = [
        elterngeldAusgabeOf(1, ElternGeldArt.KEIN_BEZUG),
        elterngeldAusgabeOf(2, ElternGeldArt.KEIN_BEZUG),
        elterngeldAusgabeOf(3, ElternGeldArt.KEIN_BEZUG),
        elterngeldAusgabeOf(4, ElternGeldArt.KEIN_BEZUG),
        elterngeldAusgabeOf(5, ElternGeldArt.KEIN_BEZUG),
        elterngeldAusgabeOf(6, ElternGeldArt.ELTERNGELD_PLUS, 600),
        elterngeldAusgabeOf(7, ElternGeldArt.ELTERNGELD_PLUS, 600),
        elterngeldAusgabeOf(8, ElternGeldArt.ELTERNGELD_PLUS, 600),
        elterngeldAusgabeOf(9, ElternGeldArt.ELTERNGELD_PLUS, 1200),
        elterngeldAusgabeOf(10, ElternGeldArt.KEIN_BEZUG),
        elterngeldAusgabeOf(11, ElternGeldArt.KEIN_BEZUG),
      ];
      const nettoLebensMonat = [
        new Big(200),
        MathUtil.BIG_ZERO,
        new Big(500),
        MathUtil.BIG_ZERO,
        MathUtil.BIG_ZERO,
        new Big(750),
        MathUtil.BIG_ZERO,
        MathUtil.BIG_ZERO,
        MathUtil.BIG_ZERO,
      ];

      // when
      const table = ErgebnisUtils.elternGeldSimulationErgebnisOf(
        basisElternGeld,
        elternGeldPlus,
        nettoLebensMonat,
      );

      // then
      expect(table).not.toBeUndefined();
      expect(table.rows.length).toBe(9);
      expect(table.rows[0].vonLebensMonat).toBe(1);
      expect(table.rows[0].bisLebensMonat).toBe(1);
      expect(table.rows[0].basisElternGeld.toNumber()).toBe(0);
      expect(table.rows[0].elternGeldPlus.toNumber()).toBe(0);
      expect(table.rows[0].nettoEinkommen.toNumber()).toBe(200);

      expect(table.rows[1].vonLebensMonat).toBe(2);
      expect(table.rows[1].bisLebensMonat).toBe(2);
      expect(table.rows[1].basisElternGeld.toNumber()).toBe(300);
      expect(table.rows[1].elternGeldPlus.toNumber()).toBe(0);
      expect(table.rows[1].nettoEinkommen.toNumber()).toBe(0);

      expect(table.rows[2].vonLebensMonat).toBe(3);
      expect(table.rows[2].bisLebensMonat).toBe(3);
      expect(table.rows[2].basisElternGeld.toNumber()).toBe(300);
      expect(table.rows[2].elternGeldPlus.toNumber()).toBe(0);
      expect(table.rows[2].nettoEinkommen.toNumber()).toBe(500);

      expect(table.rows[3].vonLebensMonat).toBe(4);
      expect(table.rows[3].bisLebensMonat).toBe(4);
      expect(table.rows[3].basisElternGeld.toNumber()).toBe(450);
      expect(table.rows[3].elternGeldPlus.toNumber()).toBe(0);
      expect(table.rows[3].nettoEinkommen.toNumber()).toBe(0);

      expect(table.rows[4].vonLebensMonat).toBe(5);
      expect(table.rows[4].bisLebensMonat).toBe(5);
      expect(table.rows[4].basisElternGeld.toNumber()).toBe(150);
      expect(table.rows[4].elternGeldPlus.toNumber()).toBe(0);
      expect(table.rows[4].nettoEinkommen.toNumber()).toBe(0);

      expect(table.rows[5].vonLebensMonat).toBe(6);
      expect(table.rows[5].bisLebensMonat).toBe(6);
      expect(table.rows[5].basisElternGeld.toNumber()).toBe(0);
      expect(table.rows[5].elternGeldPlus.toNumber()).toBe(600);
      expect(table.rows[5].nettoEinkommen.toNumber()).toBe(750);

      expect(table.rows[6].vonLebensMonat).toBe(7);
      expect(table.rows[6].bisLebensMonat).toBe(8);
      expect(table.rows[6].basisElternGeld.toNumber()).toBe(0);
      expect(table.rows[6].elternGeldPlus.toNumber()).toBe(600);
      expect(table.rows[6].nettoEinkommen.toNumber()).toBe(0);

      expect(table.rows[7].vonLebensMonat).toBe(9);
      expect(table.rows[7].bisLebensMonat).toBe(9);
      expect(table.rows[7].basisElternGeld.toNumber()).toBe(0);
      expect(table.rows[7].elternGeldPlus.toNumber()).toBe(1200);
      expect(table.rows[7].nettoEinkommen.toNumber()).toBe(0);

      expect(table.rows[8].vonLebensMonat).toBe(11);
      expect(table.rows[8].bisLebensMonat).toBe(11);
      expect(table.rows[8].basisElternGeld.toNumber()).toBe(400);
      expect(table.rows[8].elternGeldPlus.toNumber()).toBe(0);
      expect(table.rows[8].nettoEinkommen.toNumber()).toBe(0);
    });
  });
});

function elterngeldAusgabeOf(
  lebensMonat: number,
  elterngeldArt: ElternGeldArt,
  elternGeld: number = 0,
  geschwisterBonus: number = 0,
  mehrlingsZulage: number = 0,
  mutterschaftsLeistungMonat: boolean = false,
): ElternGeldAusgabe {
  return {
    lebensMonat,
    elterngeldArt,
    elternGeld: new Big(elternGeld),
    geschwisterBonus: new Big(geschwisterBonus),
    mehrlingsZulage: new Big(mehrlingsZulage),
    mutterschaftsLeistungMonat,
  };
}
