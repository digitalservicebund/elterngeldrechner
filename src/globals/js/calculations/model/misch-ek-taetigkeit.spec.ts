import { MischEkTaetigkeit } from "./misch-ek-taetigkeit";

describe("misch-ek-taetigkeit", () => {
  describe.each([[true], [false]])(
    "when create MischEkTaetigkeit with %s, then expect all bemessungsZeitraumMonate are set",
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
});
