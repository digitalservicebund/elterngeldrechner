export function sindMinijobUndSozialversicherungspflichtigeTaetigkeitGemischt(
  taetigkeiten: readonly { payload: { istTaetigkeitMinijob: boolean } }[],
): boolean {
  const minijobs = taetigkeiten.filter((t) => t.payload.istTaetigkeitMinijob);

  return minijobs.length > 0 && taetigkeiten.length > minijobs.length;
}

if (import.meta.vitest) {
  const { describe, expect, test } = import.meta.vitest;

  describe("sindMinijobUndSozialversicherungspflichtigeTaetigkeitGemischt", () => {
    const minijob = true;
    const sozialversicherungspflichtig = false;

    test.for([
      { taetigkeiten: [], sindGemischt: false },
      { taetigkeiten: [minijob], sindGemischt: false },
      { taetigkeiten: [sozialversicherungspflichtig], sindGemischt: false },
      { taetigkeiten: [minijob, minijob], sindGemischt: false },
      {
        taetigkeiten: [
          sozialversicherungspflichtig,
          sozialversicherungspflichtig,
        ],
        sindGemischt: false,
      },
      {
        taetigkeiten: [minijob, sozialversicherungspflichtig],
        sindGemischt: true,
      },
      {
        taetigkeiten: [sozialversicherungspflichtig, minijob],
        sindGemischt: true,
      },
    ])(
      "Taetigkeiten sind Minijob: $taetigkeiten -> Sind gemischt = $sindGemischt",
      ({ taetigkeiten, sindGemischt: expected }) => {
        const payload = taetigkeiten.map((istTaetigkeitMinijob) => {
          return { payload: { istTaetigkeitMinijob } };
        });

        const result =
          sindMinijobUndSozialversicherungspflichtigeTaetigkeitGemischt(
            payload,
          );

        expect(result).toBe(expected);
      },
    );
  });
}
