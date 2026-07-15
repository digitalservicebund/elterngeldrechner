export function sindMinijobUndSozialversicherungspflichtigeTaetigkeitGemischt(
  taetigkeiten: readonly { payload: { istTaetigkeitMinijob: boolean } }[],
): boolean {
  const hatMinijob = taetigkeiten.some((t) => t.payload.istTaetigkeitMinijob);
  const hatSozialversicherung = taetigkeiten.some(
    (t) => !t.payload.istTaetigkeitMinijob,
  );
  return hatMinijob && hatSozialversicherung;
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("sindMinijobUndSozialversicherungspflichtigeTaetigkeitGemischt", () => {
    const minijob = { payload: { istTaetigkeitMinijob: true } };
    const sozialversicherungspflichtig = {
      payload: { istTaetigkeitMinijob: false },
    };

    it("is false for an empty list", () => {
      expect(
        sindMinijobUndSozialversicherungspflichtigeTaetigkeitGemischt([]),
      ).toBe(false);
    });

    it("is false for a single Minijob", () => {
      expect(
        sindMinijobUndSozialversicherungspflichtigeTaetigkeitGemischt([
          minijob,
        ]),
      ).toBe(false);
    });

    it("is false for a single sozialversicherungspflichtige Taetigkeit", () => {
      expect(
        sindMinijobUndSozialversicherungspflichtigeTaetigkeitGemischt([
          sozialversicherungspflichtig,
        ]),
      ).toBe(false);
    });

    it("is false when all Taetigkeiten are Minijobs", () => {
      expect(
        sindMinijobUndSozialversicherungspflichtigeTaetigkeitGemischt([
          minijob,
          minijob,
        ]),
      ).toBe(false);
    });

    it("is false when all Taetigkeiten are sozialversicherungspflichtig", () => {
      expect(
        sindMinijobUndSozialversicherungspflichtigeTaetigkeitGemischt([
          sozialversicherungspflichtig,
          sozialversicherungspflichtig,
        ]),
      ).toBe(false);
    });

    it("is true for a mix of Minijob and sozialversicherungspflichtiger Taetigkeit, in either order", () => {
      expect(
        sindMinijobUndSozialversicherungspflichtigeTaetigkeitGemischt([
          minijob,
          sozialversicherungspflichtig,
        ]),
      ).toBe(true);
      expect(
        sindMinijobUndSozialversicherungspflichtigeTaetigkeitGemischt([
          sozialversicherungspflichtig,
          minijob,
        ]),
      ).toBe(true);
    });
  });
}
