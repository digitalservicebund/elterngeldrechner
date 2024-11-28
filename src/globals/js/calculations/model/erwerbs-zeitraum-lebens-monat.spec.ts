import { Einkommen } from "./einkommen";
import { ErwerbsZeitraumLebensMonat } from "./erwerbs-zeitraum-lebens-monat";

describe("erwerbs-zeitraum-lebens-monat", () => {
  describe.each([
    [0, 0, 0],
    [1, 1, 1],
    [1, 6, 6],
    [4, 6, 3],
  ])(
    "when vonLebensMonat %p and bisLebensMonat %p, then expect anzahlMonate are %p",
    (vonLebensMonat, bisLebensMonat, anzahlMonate) => {
      it("should create Zeitraum", () => {
        // given
        const erwerbsZeitraumLebensMonat = new ErwerbsZeitraumLebensMonat(
          vonLebensMonat,
          bisLebensMonat,
          new Einkommen(0),
        );

        // then
        expect(erwerbsZeitraumLebensMonat.getAnzahlMonate()).toBe(anzahlMonate);
      });
    },
  );

  describe.each([
    [0, 0, []],
    [1, 1, [1]],
    [1, 6, [1, 2, 3, 4, 5, 6]],
    [4, 6, [4, 5, 6]],
  ])(
    "when vonLebensMonat %p and bisLebensMonat %p, then expect lebensMonateList are %p",
    (vonLebensMonat, bisLebensMonat, lebensMonateList) => {
      it("should create Zeitraum", () => {
        // given
        const erwerbsZeitraumLebensMonat = new ErwerbsZeitraumLebensMonat(
          vonLebensMonat,
          bisLebensMonat,
          new Einkommen(0),
        );

        // then
        expect(erwerbsZeitraumLebensMonat.getLebensMonateList()).toStrictEqual(
          lebensMonateList,
        );
      });
    },
  );
});
