import type { ElternteilTaetigkeitenAbfrage } from "@/application/features/abfrageteil/pages/elternteil";

export function sindMischeinkunft(
  taetigkeiten: ElternteilTaetigkeitenAbfrage,
): boolean {
  const nutztAngestelltenFlow =
    taetigkeiten.istNichtSelbststaendig || taetigkeiten.istVerbeamtet;

  return (
    [
      nutztAngestelltenFlow,
      taetigkeiten.hatMinijob,
      taetigkeiten.istSelbststaendig,
    ].filter(Boolean).length > 1
  );
}

if (import.meta.vitest) {
  const { describe, expect, test } = import.meta.vitest;

  describe("sindMischeinkunft", () => {
    const erstelleTaetigkeiten = (
      taetigkeiten: Partial<ElternteilTaetigkeitenAbfrage>,
    ): ElternteilTaetigkeitenAbfrage => ({
      istNichtSelbststaendig: false,
      istSelbststaendig: false,
      istVerbeamtet: false,
      hatMinijob: false,
      hatAndereLeistungen: false,
      hatPeriodenOhneEinkommen: false,
      ...taetigkeiten,
    });

    test.for([
      { taetigkeiten: {}, sindGemischt: false },
      { taetigkeiten: { istNichtSelbststaendig: true }, sindGemischt: false },
      { taetigkeiten: { istVerbeamtet: true }, sindGemischt: false },
      {
        taetigkeiten: { istNichtSelbststaendig: true, istVerbeamtet: true },
        sindGemischt: false,
      },
      { taetigkeiten: { hatMinijob: true }, sindGemischt: false },
      { taetigkeiten: { istSelbststaendig: true }, sindGemischt: false },
      {
        taetigkeiten: { istNichtSelbststaendig: true, hatMinijob: true },
        sindGemischt: true,
      },
      {
        taetigkeiten: { istVerbeamtet: true, hatMinijob: true },
        sindGemischt: true,
      },
      {
        taetigkeiten: { istNichtSelbststaendig: true, istSelbststaendig: true },
        sindGemischt: true,
      },
      {
        taetigkeiten: { istVerbeamtet: true, istSelbststaendig: true },
        sindGemischt: true,
      },
      {
        taetigkeiten: { hatMinijob: true, istSelbststaendig: true },
        sindGemischt: true,
      },
      {
        taetigkeiten: {
          istNichtSelbststaendig: true,
          hatMinijob: true,
          istSelbststaendig: true,
        },
        sindGemischt: true,
      },
      {
        taetigkeiten: {
          istNichtSelbststaendig: true,
          hatMinijob: true,
          istSelbststaendig: true,
          istVerbeamtet: true,
        },
        sindGemischt: true,
      },
    ])(
      "Taetigkeiten: $taetigkeiten -> sind gemischt = $sindGemischt",
      ({ taetigkeiten, sindGemischt: expected }) => {
        const result = sindMischeinkunft(erstelleTaetigkeiten(taetigkeiten));

        expect(result).toBe(expected);
      },
    );
  });
}
