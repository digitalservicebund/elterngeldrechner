import { sindBeideElternteile } from "./sindBeideElternteile";
import type { FormEvent } from "@/application/routing/FormEvent";
import { Route } from "@/application/routing/Route";
import {
  Einkommen,
  type FinanzDaten,
  KassenArt,
  RentenArt,
  Steuerklasse,
} from "@/elterngeldrechner";

import { Elternteil } from "@/monatsplaner/Elternteil";
import { findeTaetigkeiten } from "./findeTaetigkeiten";
import { sindMischeinkunft } from "./sindMischeinkunft";
import { erstelleFinanzdatenAngestellt } from "./erstelleFinanzdatenAngestellt";
import { erstelleFinanzdatenMinijob } from "./erstelleFinanzdatenMinijob";
import { erstelleFinanzdatenSelbststaendig } from "./erstelleFinanzdatenSelbststaendig";
import { erstelleFinanzdatenMischeinkunft } from "./erstelleFinanzdatenMischeinkunft";

export function erstelleFinanzdatenAllerElternteile(
  events: FormEvent[],
): FinanzdatenAllerElternteile {
  if (sindBeideElternteile(events)) {
    return {
      anzahlElternteile: 2,
      [Elternteil.Eins]: erstelleFinanzDaten(events, 0),
      [Elternteil.Zwei]: erstelleFinanzDaten(events, 1),
    };
  }

  return {
    anzahlElternteile: 1,
    [Elternteil.Eins]: erstelleFinanzDaten(events, 0),
  };
}

type FinanzdatenEinesElternteils = {
  readonly anzahlElternteile: 1;
  readonly [Elternteil.Eins]: Omit<FinanzDaten, "kinderFreiBetrag">;
};

type FinanzdatenBeiderElternteile = {
  readonly anzahlElternteile: 2;
  readonly [Elternteil.Eins]: Omit<FinanzDaten, "kinderFreiBetrag">;
  readonly [Elternteil.Zwei]: Omit<FinanzDaten, "kinderFreiBetrag">;
};

export type FinanzdatenAllerElternteile =
  FinanzdatenEinesElternteils | FinanzdatenBeiderElternteile;

export function erstelleFinanzDaten(
  events: FormEvent[],
  elternteilIndex: number,
): Omit<FinanzDaten, "kinderFreiBetrag"> {
  const taetigkeiten = findeTaetigkeiten(events, elternteilIndex);
  const taetigkeitenEnthaltenMischeinkunft = sindMischeinkunft(taetigkeiten);

  if (taetigkeitenEnthaltenMischeinkunft) {
    return erstelleFinanzdatenMischeinkunft(events, elternteilIndex);
  }

  if (taetigkeiten.istNichtSelbststaendig || taetigkeiten.istVerbeamtet) {
    return erstelleFinanzdatenAngestellt(events, elternteilIndex);
  }

  if (taetigkeiten.hatMinijob === true) {
    return erstelleFinanzdatenMinijob(events, elternteilIndex);
  }

  if (taetigkeiten.istSelbststaendig) {
    return erstelleFinanzdatenSelbststaendig(events, elternteilIndex);
  }

  return {
    bruttoEinkommen: new Einkommen(0),
    istKirchensteuerpflichtig: false,
    steuerklasse: Steuerklasse.I,
    kassenArt: KassenArt.GESETZLICH_PFLICHTVERSICHERT,
    rentenVersicherung: RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG,
    splittingFaktor: 1,
    mischEinkommenTaetigkeiten: [],
    erwerbsZeitraumLebensMonatList: [],
  };
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("erstelleFinanzDatenBeiderElternteile", () => {
    it("returns anzahlElternteile 1 when zweite Person is not considered", () => {
      const events: FormEvent[] = [
        {
          route: Route.ElternteilTaetigkeitenAbfrage,
          params: { elternteilIndex: 0 },
          payload: {
            istNichtSelbststaendig: false,
            istSelbststaendig: false,
            istVerbeamtet: false,
            hatAndereLeistungen: false,
            hatPeriodenOhneEinkommen: true,
          },
          dependentValues: {
            istPersonAlleinerziehend: false,
            wirdZweitePersonBeruecksichtigt: false,
          },
        },
        {
          route: Route.ElternteilGemeinsamePlanungAbfrage,
          payload: {
            wirdZweitePersonBeruecksichtigt: false,
          },
        },
      ];

      const finanzdaten = erstelleFinanzdatenAllerElternteile(events);

      expect(finanzdaten).toEqual({
        anzahlElternteile: 1,
        [Elternteil.Eins]: {
          bruttoEinkommen: new Einkommen(0),
          istKirchensteuerpflichtig: false,
          steuerklasse: Steuerklasse.I,
          kassenArt: KassenArt.GESETZLICH_PFLICHTVERSICHERT,
          rentenVersicherung: RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG,
          splittingFaktor: 1,
          mischEinkommenTaetigkeiten: [],
          erwerbsZeitraumLebensMonatList: [],
        },
      });
    });

    it("returns anzahlElternteile 2 with both FinanzDaten when zweite Person is considered", () => {
      const events: FormEvent[] = [
        {
          route: Route.ElternteilTaetigkeitenAbfrage,
          params: { elternteilIndex: 0 },
          payload: {
            istNichtSelbststaendig: false,
            istSelbststaendig: false,
            istVerbeamtet: false,
            hatAndereLeistungen: false,
            hatPeriodenOhneEinkommen: true,
          },
          dependentValues: {
            istPersonAlleinerziehend: false,
            wirdZweitePersonBeruecksichtigt: false,
          },
        },
        {
          route: Route.ElternteilGemeinsamePlanungAbfrage,
          payload: {
            wirdZweitePersonBeruecksichtigt: true,
          },
        },
        {
          route: Route.ElternteilZweiAllgemeineAngaben,
          payload: { name: "Max" },
          dependentValues: {
            istSchwangerschaftsbedingteErkrankungMoeglich: true,
            naechsterGeschwisterIndexMitRelevanzFuerAusklammerung: 0,
          },
        },
        {
          route: Route.ElternteilTaetigkeitenAbfrage,
          params: { elternteilIndex: 1 },
          payload: {
            istNichtSelbststaendig: false,
            istSelbststaendig: false,
            istVerbeamtet: false,
            hatAndereLeistungen: false,
            hatPeriodenOhneEinkommen: true,
          },
          dependentValues: {
            istPersonAlleinerziehend: false,
            wirdZweitePersonBeruecksichtigt: false,
          },
        },
      ];

      const finanzdaten = erstelleFinanzdatenAllerElternteile(events);

      const leereFinanzDaten = {
        bruttoEinkommen: new Einkommen(0),
        istKirchensteuerpflichtig: false,
        steuerklasse: Steuerklasse.I,
        kassenArt: KassenArt.GESETZLICH_PFLICHTVERSICHERT,
        rentenVersicherung: RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG,
        splittingFaktor: 1,
        mischEinkommenTaetigkeiten: [],
        erwerbsZeitraumLebensMonatList: [],
      };

      expect(finanzdaten).toEqual({
        anzahlElternteile: 2,
        [Elternteil.Eins]: leereFinanzDaten,
        [Elternteil.Zwei]: leereFinanzDaten,
      });
    });
  });

  describe("erstelleFinanzDaten", () => {
    describe("Kein Einkommen", () => {
      it("returns Finanzdaten without Bruttoeinkommen if only hatPeriodenOhneEinkommen equals true", () => {
        const finanzdaten = erstelleFinanzDaten(
          [
            {
              route: Route.ElternteilTaetigkeitenAbfrage,
              params: { elternteilIndex: 0 },
              payload: {
                istNichtSelbststaendig: false,
                istSelbststaendig: false,
                istVerbeamtet: false,
                hatAndereLeistungen: false,
                hatPeriodenOhneEinkommen: true,
              },
              dependentValues: {
                istPersonAlleinerziehend: false,
                wirdZweitePersonBeruecksichtigt: false,
              },
            },
          ],
          0,
        );

        expect(finanzdaten).toEqual({
          bruttoEinkommen: new Einkommen(0),
          istKirchensteuerpflichtig: false,
          steuerklasse: Steuerklasse.I,
          kassenArt: KassenArt.GESETZLICH_PFLICHTVERSICHERT,
          rentenVersicherung: RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG,
          splittingFaktor: 1,
          mischEinkommenTaetigkeiten: [],
          erwerbsZeitraumLebensMonatList: [],
        });
      });
    });

    describe("Dispatch je Tätigkeitsart", () => {
      const erstelleAbfrageEvent = (
        overrides: Partial<{
          istNichtSelbststaendig: boolean;
          istSelbststaendig: boolean;
          istVerbeamtet: boolean;
          hatMinijob: boolean;
        }>,
      ): FormEvent => ({
        route: Route.ElternteilTaetigkeitenAbfrage,
        params: { elternteilIndex: 0 },
        payload: {
          istNichtSelbststaendig: false,
          istSelbststaendig: false,
          istVerbeamtet: false,
          hatAndereLeistungen: false,
          hatPeriodenOhneEinkommen: false,
          ...overrides,
        },
        dependentValues: {
          istPersonAlleinerziehend: false,
          wirdZweitePersonBeruecksichtigt: false,
        },
      });

      it("delegiert an erstelleFinanzdatenAngestellt, wenn istNichtSelbststaendig", () => {
        const events: FormEvent[] = [
          erstelleAbfrageEvent({ istNichtSelbststaendig: true }),
          {
            route: Route.ElternteilTaetigkeitenAngestelltHauptjob,
            params: { elternteilIndex: 0, angestelltIndex: 0 },
            payload: {
              steuerklasse: Steuerklasse.I,
              istKirchensteuerpflichtig: false,
              istGesetzlichKrankenpflichtversichert: true,
              istGesetzlichRentenversichert: true,
              istGesetzlichArbeitlosenversichert: true,
            },
            dependentValues: { kannDurchschnittAngegebenWerden: true },
          },
          {
            route: Route.ElternteilTaetigkeitenAngestelltEinkommen,
            params: { elternteilIndex: 0, angestelltIndex: 0 },
            payload: { durchschnittlichesMonatsbrutto: 3000 },
          },
        ];

        const finanzdaten = erstelleFinanzDaten(events, 0);

        expect(finanzdaten.bruttoEinkommen).toEqual(new Einkommen(3000));
        expect(finanzdaten.kassenArt).toBe(
          KassenArt.GESETZLICH_PFLICHTVERSICHERT,
        );
      });

      it("delegiert an erstelleFinanzdatenAngestellt, wenn istVerbeamtet", () => {
        const events: FormEvent[] = [
          erstelleAbfrageEvent({ istVerbeamtet: true }),
          {
            route: Route.ElternteilTaetigkeitenAngestelltHauptjob,
            params: { elternteilIndex: 0, angestelltIndex: 0 },
            payload: {
              steuerklasse: Steuerklasse.I,
              istKirchensteuerpflichtig: false,
              istGesetzlichKrankenpflichtversichert: true,
              istGesetzlichRentenversichert: true,
              istGesetzlichArbeitlosenversichert: true,
            },
            dependentValues: { kannDurchschnittAngegebenWerden: true },
          },
          {
            route: Route.ElternteilTaetigkeitenAngestelltEinkommen,
            params: { elternteilIndex: 0, angestelltIndex: 0 },
            payload: { durchschnittlichesMonatsbrutto: 2000 },
          },
        ];

        const finanzdaten = erstelleFinanzDaten(events, 0);

        expect(finanzdaten.bruttoEinkommen).toEqual(new Einkommen(2000));
      });

      it("delegiert an erstelleFinanzdatenMinijob, wenn hatMinijob", () => {
        const events: FormEvent[] = [
          erstelleAbfrageEvent({ hatMinijob: true }),
          {
            route: Route.ElternteilTaetigkeitenMinijobEinkommen,
            params: { elternteilIndex: 0, minijobIndex: 0 },
            payload: { durchschnittlichesMonatsbrutto: 450 },
          },
        ];

        const finanzdaten = erstelleFinanzDaten(events, 0);

        expect(finanzdaten.bruttoEinkommen).toEqual(new Einkommen(450));
        expect(finanzdaten.kassenArt).toBe(
          KassenArt.NICHT_GESETZLICH_PFLICHTVERSICHERT,
        );
      });

      it("delegiert an erstelleFinanzdatenSelbststaendig, wenn istSelbststaendig", () => {
        const events: FormEvent[] = [
          erstelleAbfrageEvent({ istSelbststaendig: true }),
          {
            route: Route.ElternteilTaetigkeitenSelbststaendigAngaben,
            params: { elternteilIndex: 0, selbststaendigIndex: 0 },
            payload: {
              istKirchensteuerpflichtig: true,
              istGesetzlichKrankenpflichtversichert: false,
              istGesetzlichRentenversichert: false,
              istGesetzlichArbeitlosenversichert: false,
              bruttoJahresgewinn: 24000,
            },
          },
        ];

        const finanzdaten = erstelleFinanzDaten(events, 0);

        expect(finanzdaten.bruttoEinkommen).toEqual(new Einkommen(2000));
        expect(finanzdaten.istKirchensteuerpflichtig).toBe(true);
      });

      it("delegiert an erstelleFinanzdatenMischeinkunft, wenn mehr als eine Tätigkeitsart kombiniert ist", () => {
        const events: FormEvent[] = [
          erstelleAbfrageEvent({ hatMinijob: true, istSelbststaendig: true }),
          {
            route: Route.ElternteilTaetigkeitenMinijobEinkommen,
            params: { elternteilIndex: 0, minijobIndex: 0 },
            payload: { durchschnittlichesMonatsbrutto: 450 },
          },
          {
            route: Route.ElternteilTaetigkeitenSelbststaendigAngaben,
            params: { elternteilIndex: 0, selbststaendigIndex: 0 },
            payload: {
              istKirchensteuerpflichtig: false,
              istGesetzlichKrankenpflichtversichert: false,
              istGesetzlichRentenversichert: false,
              istGesetzlichArbeitlosenversichert: false,
              bruttoJahresgewinn: 12000,
            },
          },
        ];

        const finanzdaten = erstelleFinanzDaten(events, 0);

        expect(finanzdaten.mischEinkommenTaetigkeiten).toHaveLength(2);
      });
    });
  });
}
