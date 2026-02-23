import type { ElternteilAusklammerungszeitenInput } from "./ElternteilAusklammerungZeitenPage";
import type {
  ElternteilAusklammerungGruende,
  ElternteilAusklammerungZeiten,
} from "./ElternteilSchema";

const schemaMapping: Record<
  keyof ElternteilAusklammerungZeiten,
  keyof ElternteilAusklammerungGruende
> = {
  mutterschutz: "hatMutterschutzAelteresKind",
  elterngeld: "hatElterngeldAelteresKind",
  erkrankung: "hatSchwangerschaftsbedingteErkrankung",
};

// TODO: The function accepts undefined for ausklammerungsgruende because we cannot
// ensure the presence of its event in the event context
export function erstelleAusklammerungZeitenDefaultValues(
  existingValues: ElternteilAusklammerungszeitenInput | undefined,
  ausklammerungsgruende: ElternteilAusklammerungGruende | undefined,
): ElternteilAusklammerungszeitenInput {
  return (
    Object.keys(schemaMapping) as (keyof ElternteilAusklammerungZeiten)[]
  ).reduce<ElternteilAusklammerungszeitenInput>((acc, ausklammerungsgrund) => {
    if (ausklammerungsgruende === undefined) {
      return { ...acc, [ausklammerungsgrund]: [] };
    }

    const ausklammerungsgrundDeaktiviert = !(
      ausklammerungsgruende[schemaMapping[ausklammerungsgrund]] === true
    );

    if (ausklammerungsgrundDeaktiviert) {
      return { ...acc, [ausklammerungsgrund]: [] };
    }

    const wiederverwendbareZeiten = existingValues?.[ausklammerungsgrund];

    return {
      ...acc,
      [ausklammerungsgrund]: wiederverwendbareZeiten ?? [{ von: "", bis: "" }],
    };
  }, {} as ElternteilAusklammerungszeitenInput);
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  const alleGruendeAktiv: ElternteilAusklammerungGruende = {
    hatMutterschutzAelteresKind: true,
    hatElterngeldAelteresKind: true,
    hatSchwangerschaftsbedingteErkrankung: true,
    hatKeineAusklammerungsgruende: false,
  };

  const keineGruende: ElternteilAusklammerungGruende = {
    hatMutterschutzAelteresKind: false,
    hatElterngeldAelteresKind: false,
    hatSchwangerschaftsbedingteErkrankung: false,
    hatKeineAusklammerungsgruende: true,
  };

  const vorhandeneZeiten: ElternteilAusklammerungszeitenInput = {
    mutterschutz: [
      { von: "01.01.2023", bis: "28.02.2023" },
      { von: "01.03.2023", bis: "31.03.2023" },
    ],
    elterngeld: [{ von: "01.04.2023", bis: "30.04.2023" }],
    erkrankung: [{ von: "01.05.2023", bis: "31.05.2023" }],
  };

  describe("erstelleAusklammerungZeitenDefaultValues", () => {
    it("returns one empty date pair per key when no event and no decoded data", () => {
      expect(
        erstelleAusklammerungZeitenDefaultValues(undefined, undefined),
      ).toEqual({
        mutterschutz: [],
        elterngeld: [],
        erkrankung: [],
      });
    });

    it("returns one empty date pair per key when decoded data is present but no gruende event", () => {
      expect(
        erstelleAusklammerungZeitenDefaultValues(vorhandeneZeiten, undefined),
      ).toEqual({
        mutterschutz: [],
        elterngeld: [],
        erkrankung: [],
      });
    });

    it("uses decoded data for keys whose grund is still active", () => {
      expect(
        erstelleAusklammerungZeitenDefaultValues(
          vorhandeneZeiten,
          alleGruendeAktiv,
        ),
      ).toEqual(vorhandeneZeiten);
    });

    it("returns empty array when grund is explicitly deactivated and data existed", () => {
      expect(
        erstelleAusklammerungZeitenDefaultValues(
          vorhandeneZeiten,
          keineGruende,
        ),
      ).toEqual({
        mutterschutz: [],
        elterngeld: [],
        erkrankung: [],
      });
    });

    it("uses decoded data for active gruende and empty array for explicitly deactivated ones", () => {
      const teilweiseAktiv: ElternteilAusklammerungGruende = {
        hatMutterschutzAelteresKind: true,
        hatElterngeldAelteresKind: false,
        hatSchwangerschaftsbedingteErkrankung: true,
        hatKeineAusklammerungsgruende: false,
      };

      expect(
        erstelleAusklammerungZeitenDefaultValues(
          vorhandeneZeiten,
          teilweiseAktiv,
        ),
      ).toEqual({
        mutterschutz: vorhandeneZeiten.mutterschutz,
        erkrankung: vorhandeneZeiten.erkrankung,
        elterngeld: [],
      });
    });

    it("returns one empty date pair per key when gruende event present but no decoded data", () => {
      expect(
        erstelleAusklammerungZeitenDefaultValues(undefined, alleGruendeAktiv),
      ).toEqual({
        mutterschutz: [{ von: "", bis: "" }],
        elterngeld: [{ von: "", bis: "" }],
        erkrankung: [{ von: "", bis: "" }],
      });
    });
  });
}
