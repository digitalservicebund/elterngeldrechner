import { describe, expect, it } from "vitest";
import { MischEkTaetigkeit } from "./misch-ek-taetigkeit";

describe("misch-ek-taetigkeit", () => {
  describe.each([[true], [false]])(
    "when create MischEkTaetigkeit with %p, then expect all bemessungsZeitraumMonate are set",
    (falseOrTrue) => {
      it("should create Zeitraum", () => {
        // when
        const mischEkTaetigkeit = new MischEkTaetigkeit(falseOrTrue);

        // then
        expect(mischEkTaetigkeit.bemessungsZeitraumMonate.length).toBe(12);
        mischEkTaetigkeit.bemessungsZeitraumMonate.forEach((value) =>
          expect(value).toBe(falseOrTrue),
        );
      });
    },
  );

  describe.each([
    [
      [true, true, true, true, true, true, true, true, true, true, true, true],
      12,
    ],
    [
      [
        true,
        true,
        true,
        false,
        true,
        true,
        true,
        false,
        true,
        true,
        true,
        true,
      ],
      10,
    ],
    [
      [
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
        true,
      ],
      1,
    ],
    [
      [
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
        false,
      ],
      0,
    ],
  ])(
    "when create MischEkTaetigkeit with %p, then expect all bemessungsZeitraumMonate are %d",
    (bemessungsZeitraumMonateList, anzahlBemessungsZeitraumMonate) => {
      it("should create Zeitraum", () => {
        // when
        const mischEkTaetigkeit = new MischEkTaetigkeit(false);
        mischEkTaetigkeit.bemessungsZeitraumMonate =
          bemessungsZeitraumMonateList;

        // then
        expect(mischEkTaetigkeit.bemessungsZeitraumMonate.length).toBe(12);
        expect(mischEkTaetigkeit.getAnzahlBemessungsZeitraumMonate()).toBe(
          anzahlBemessungsZeitraumMonate,
        );
      });
    },
  );
});
