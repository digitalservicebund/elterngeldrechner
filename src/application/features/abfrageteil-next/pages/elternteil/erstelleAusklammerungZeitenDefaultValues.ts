import type { ElternteilAusklammerungszeitenInput } from "./ElternteilAusklammerungZeitenPage";
import type {
  ElternteilAusklammerungGruende,
  ElternteilAusklammerungZeiten,
} from "./ElternteilSchema";

type AusklammerungGruendeAktiv = Extract<
  ElternteilAusklammerungGruende,
  { hatKeineAusklammerungsgruende: false }
>;

const schemaMapping: Record<
  keyof ElternteilAusklammerungZeiten,
  keyof AusklammerungGruendeAktiv
> = {
  mutterschutzGeschwisterkind: "hatMutterschutzAelteresKind",
  elterngeldGeschwisterkind: "hatElterngeldAelteresKind",
  erkrankungSchwangerschaft: "hatSchwangerschaftsbedingteErkrankung",
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
    if (!ausklammerungsgruende) {
      return { ...acc, [ausklammerungsgrund]: [] };
    }

    if (ausklammerungsgruende.hatKeineAusklammerungsgruende) {
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
    hatKeineAusklammerungsgruende: true,
  };

  const vorhandeneZeiten: ElternteilAusklammerungszeitenInput = {
    mutterschutzGeschwisterkind: [
      { von: "01.01.2023", bis: "28.02.2023" },
      { von: "01.03.2023", bis: "31.03.2023" },
    ],
    elterngeldGeschwisterkind: [{ von: "01.04.2023", bis: "30.04.2023" }],
    erkrankungSchwangerschaft: [{ von: "01.05.2023", bis: "31.05.2023" }],
  };

  describe("erstelleAusklammerungZeitenDefaultValues", () => {
    it("returns one empty date pair per key when no event and no decoded data", () => {
      expect(
        erstelleAusklammerungZeitenDefaultValues(undefined, undefined),
      ).toEqual({
        mutterschutzGeschwisterkind: [],
        elterngeldGeschwisterkind: [],
        erkrankungSchwangerschaft: [],
      });
    });

    it("returns one empty date pair per key when decoded data is present but no gruende event", () => {
      expect(
        erstelleAusklammerungZeitenDefaultValues(vorhandeneZeiten, undefined),
      ).toEqual({
        mutterschutzGeschwisterkind: [],
        elterngeldGeschwisterkind: [],
        erkrankungSchwangerschaft: [],
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

    it("returns empty array when hatKeineAusklammerungsgruende is true", () => {
      expect(
        erstelleAusklammerungZeitenDefaultValues(
          vorhandeneZeiten,
          keineGruende,
        ),
      ).toEqual({
        mutterschutzGeschwisterkind: [],
        elterngeldGeschwisterkind: [],
        erkrankungSchwangerschaft: [],
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
        mutterschutzGeschwisterkind:
          vorhandeneZeiten.mutterschutzGeschwisterkind,
        erkrankungSchwangerschaft: vorhandeneZeiten.erkrankungSchwangerschaft,
        elterngeldGeschwisterkind: [],
      });
    });

    it("returns one empty date pair per key when gruende event present but no decoded data", () => {
      expect(
        erstelleAusklammerungZeitenDefaultValues(undefined, alleGruendeAktiv),
      ).toEqual({
        mutterschutzGeschwisterkind: [{ von: "", bis: "" }],
        elterngeldGeschwisterkind: [{ von: "", bis: "" }],
        erkrankungSchwangerschaft: [{ von: "", bis: "" }],
      });
    });
  });
}
