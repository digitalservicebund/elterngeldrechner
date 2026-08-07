import { describe, expect, it } from "vitest";
import type { FormEvent } from "@/application/routing";
import { Route } from "@/application/routing";
import { Steuerklasse, ErwerbsTaetigkeit } from "@/elterngeldrechner";
import type { FinanzDaten } from "@/elterngeldrechner";
import { erstelleFinanzDaten as erstelleFinanzDatenAlt } from "./erstelleFinanzdaten";
import { erstelleFinanzDaten as erstelleFinanzDatenNeu } from "./erstelleFinanzdatenNew";

/*
 * Vergleicht den alten Einkommensflow (erstelleFinanzdaten.ts, alte
 * ElternteilTaetigkeitAngaben*-Routen) mit dem neuen dedizierten
 * Angestellt-/Minijob-/Selbstständig-Flow (erstelleFinanzdatenNew.ts), um
 * sicherzustellen, dass die Migration keine unbeabsichtigten
 * Verhaltensänderungen einführt. Für dieselbe wirtschaftliche Situation
 * sollten beide Flows dieselben FinanzDaten liefern.
 *
 * Bekannte, beabsichtigte Ausnahmen (nicht auf Gleichheit geprüft, sondern
 * unten separat dokumentiert):
 *
 * 1. Bei Mischeinkommen-Tätigkeiten mit echten einkommenslosen Monaten
 *    (Lücken) berechnet der neue Flow bruttoEinkommenDurchschnitt als
 *    Durchschnitt über die aktiven Monate, während der alte Flow durch die
 *    festen 12 Monate teilt. Das ist eine bewusste Korrektur (siehe
 *    Kommentar in erstelleFinanzdatenMischeinkunft.ts), keine Regression.
 *
 * 2. Der alte Flow setzt kassenArt/rentenVersicherung bei JEDEM
 *    Mischeinkommen bedingungslos auf GESETZLICH_PFLICHTVERSICHERT /
 *    GESETZLICHE_RENTEN_VERSICHERUNG (erstelleFinanzdaten.ts,
 *    erstelleMischeinkommenFinanzDaten), auch wenn gar keine
 *    sozialversicherungspflichtige Tätigkeit beteiligt ist (z. B. reine
 *    Minijob+Selbstständig-Kombination). Der neue Flow leitet diese Felder
 *    korrekt aus den tatsächlichen Angaben ab. Das ist ein Bug
 *    im alten Flow, den der neue Flow behebt.
 *
 * 3. Bei mehreren Tätigkeiten derselben Kategorie (mehrere Angestellt-Jobs
 *    oder mehrere Minijobs) innerhalb eines Mischeinkommens erzeugt der alte
 *    Flow einen eigenen mischEinkommenTaetigkeiten-Eintrag pro einzelner
 *    Tätigkeit, während der neue Flow gleichkategorische Tätigkeiten zu
 *    einem gemeinsamen Eintrag zusammenfasst (Selbstständigkeit bleibt in
 *    beiden Flows pro Tätigkeit getrennt). Für Angestellt ist das
 *    Zusammenfassen nicht nur kosmetisch, sondern korrekter: der
 *    Midi-Job-Schwellenwert in basis-eg-algorithmus.ts
 *    (istArbeitsentgeldImUebergangsbereich) muss laut deutschem
 *    Sozialversicherungsrecht auf das kombinierte Entgelt mehrerer
 *    gleichzeitiger Beschäftigungen angewendet werden, nicht auf jeden Job
 *    einzeln — der alte Flow würde hier pro Job prüfen und Midi-Job-Status
 *    potenziell falsch zuordnen.
 *
 * Die Reihenfolge der Einträge in mischEinkommenTaetigkeiten unterscheidet
 * sich zwischen altem (sortiert nach taetigkeitIndex) und neuem Flow
 * (Angestellt vor Minijob vor Selbstständig) — das wirkt sich laut
 * basis-eg-algorithmus.ts nicht auf das Ergebnis aus (Summenbildung ist
 * reihenfolgeunabhängig, Monatszählung dedupliziert pro Monat unabhängig
 * von der Reihenfolge), daher wird beim Vergleich unten sortiert.
 */

function sortiereMischEinkommen(
  finanzDaten: Omit<FinanzDaten, "kinderFreiBetrag">,
) {
  return {
    ...finanzDaten,
    mischEinkommenTaetigkeiten: [
      ...finanzDaten.mischEinkommenTaetigkeiten,
    ].sort((a, b) => a.erwerbsTaetigkeit.localeCompare(b.erwerbsTaetigkeit)),
  };
}

function summeProKategorie(
  finanzDaten: Omit<FinanzDaten, "kinderFreiBetrag">,
  kategorie: FinanzDaten["mischEinkommenTaetigkeiten"][number]["erwerbsTaetigkeit"],
): number {
  return finanzDaten.mischEinkommenTaetigkeiten
    .filter((taetigkeit) => taetigkeit.erwerbsTaetigkeit === kategorie)
    .reduce(
      (summe, taetigkeit) => summe + taetigkeit.bruttoEinkommenDurchschnitt,
      0,
    );
}

function findeKategorie(
  finanzDaten: Omit<FinanzDaten, "kinderFreiBetrag">,
  kategorie: FinanzDaten["mischEinkommenTaetigkeiten"][number]["erwerbsTaetigkeit"],
) {
  return finanzDaten.mischEinkommenTaetigkeiten.find(
    (taetigkeit) => taetigkeit.erwerbsTaetigkeit === kategorie,
  );
}

// --- Event-Fabriken: alter Flow ---

function abfrageAlt(
  elternteilIndex: number,
  overrides: Partial<{
    istNichtSelbststaendig: boolean;
    istSelbststaendig: boolean;
    istVerbeamtet: boolean;
    hatPeriodenOhneEinkommen: boolean;
  }>,
): FormEvent {
  return {
    route: Route.ElternteilTaetigkeitenAbfrage,
    params: { elternteilIndex },
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
      wirdZweitePersonBeruecksichtigt: elternteilIndex === 1,
    },
  };
}

function nichtSelbststaendigAlt(
  elternteilIndex: number,
  taetigkeitIndex: number,
  istTaetigkeitMinijob: boolean,
): FormEvent {
  return {
    route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
    params: { elternteilIndex, taetigkeitIndex },
    payload: { istTaetigkeitMinijob },
    dependentValues: { kannDurchschnittAngegebenWerden: true },
  };
}

function sozialversicherungenAlt(
  elternteilIndex: number,
  taetigkeitIndex: number,
  overrides: Partial<{
    steuerklasse: Steuerklasse;
    istKirchensteuerpflichtig: boolean;
    istGesetzlichKrankenpflichtversichert: boolean;
    istGesetzlichRentenversichert: boolean;
    istGesetzlichArbeitlosenversichert: boolean;
  }> = {},
): FormEvent {
  return {
    route: Route.ElternteilTaetigkeitAngabenSozialversicherungen,
    params: { elternteilIndex, taetigkeitIndex },
    payload: {
      steuerklasse: Steuerklasse.I,
      istKirchensteuerpflichtig: false,
      istGesetzlichKrankenpflichtversichert: true,
      istGesetzlichRentenversichert: true,
      istGesetzlichArbeitlosenversichert: true,
      istEinkommenGleichVerteilt: true,
      ...overrides,
    },
  };
}

function einkommenAlt(
  elternteilIndex: number,
  taetigkeitIndex: number,
  durchschnittlichesMonatsbrutto: number,
): FormEvent {
  return {
    route: Route.ElternteilTaetigkeitAngabenEinkommen,
    params: { elternteilIndex, taetigkeitIndex },
    payload: { durchschnittlichesMonatsbrutto },
    dependentValues: { istMischeinkunft: false },
  };
}

function einkommenDetailsAlt(
  elternteilIndex: number,
  taetigkeitIndex: number,
  monatsbrutto: number[],
): FormEvent {
  return {
    route: Route.ElternteilTaetigkeitAngabenEinkommenDetails,
    params: { elternteilIndex, taetigkeitIndex },
    payload: { monatsbrutto },
    dependentValues: { istMischeinkunft: false },
  };
}

function selbststaendigAlt(
  elternteilIndex: number,
  taetigkeitIndex: number,
  overrides: Partial<{
    istKirchensteuerpflichtig: boolean;
    istGesetzlichKrankenpflichtversichert: boolean;
    istGesetzlichRentenversichert: boolean;
    istGesetzlichArbeitlosenversichert: boolean;
  }> = {},
  bruttoJahresgewinn = 0,
): FormEvent {
  return {
    route: Route.ElternteilTaetigkeitAngabenSelbststaendig,
    params: { elternteilIndex, taetigkeitIndex },
    payload: {
      istKirchensteuerpflichtig: false,
      istGesetzlichKrankenpflichtversichert: false,
      istGesetzlichRentenversichert: false,
      istGesetzlichArbeitlosenversichert: false,
      bruttoJahresgewinn,
      ...overrides,
    },
  };
}

// --- Event-Fabriken: neuer Flow ---

function abfrageNeu(
  elternteilIndex: number,
  overrides: Partial<{
    istNichtSelbststaendig: boolean;
    istSelbststaendig: boolean;
    istVerbeamtet: boolean;
    hatMinijob: boolean;
    hatPeriodenOhneEinkommen: boolean;
  }>,
): FormEvent {
  return {
    route: Route.ElternteilTaetigkeitenAbfrage,
    params: { elternteilIndex },
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
      wirdZweitePersonBeruecksichtigt: elternteilIndex === 1,
    },
  };
}

function hauptjobNeu(
  elternteilIndex: number,
  angestelltIndex: number,
  overrides: Partial<{
    steuerklasse: Steuerklasse;
    istKirchensteuerpflichtig: boolean;
    istGesetzlichKrankenpflichtversichert: boolean;
    istGesetzlichRentenversichert: boolean;
    istGesetzlichArbeitlosenversichert: boolean;
  }> = {},
): FormEvent {
  return {
    route: Route.ElternteilTaetigkeitenAngestelltHauptjob,
    params: { elternteilIndex, angestelltIndex },
    payload: {
      steuerklasse: Steuerklasse.I,
      istKirchensteuerpflichtig: false,
      istGesetzlichKrankenpflichtversichert: true,
      istGesetzlichRentenversichert: true,
      istGesetzlichArbeitlosenversichert: true,
      ...overrides,
    },
    dependentValues: { kannDurchschnittAngegebenWerden: true },
  };
}

function angestelltEinkommenNeu(
  elternteilIndex: number,
  angestelltIndex: number,
  durchschnittlichesMonatsbrutto: number,
): FormEvent {
  return {
    route: Route.ElternteilTaetigkeitenAngestelltEinkommen,
    params: { elternteilIndex, angestelltIndex },
    payload: { durchschnittlichesMonatsbrutto },
  };
}

function angestelltEinkommenDetailliertNeu(
  elternteilIndex: number,
  angestelltIndex: number,
  monatsbrutto: number[],
): FormEvent {
  return {
    route: Route.ElternteilTaetigkeitenAngestelltEinkommenDetailliert,
    params: { elternteilIndex, angestelltIndex },
    payload: { monatsbrutto },
  };
}

function minijobEinkommenNeu(
  elternteilIndex: number,
  minijobIndex: number,
  durchschnittlichesMonatsbrutto: number,
): FormEvent {
  return {
    route: Route.ElternteilTaetigkeitenMinijobEinkommen,
    params: { elternteilIndex, minijobIndex },
    payload: { durchschnittlichesMonatsbrutto },
  };
}

function minijobEinkommenDetailliertNeu(
  elternteilIndex: number,
  minijobIndex: number,
  monatsbrutto: number[],
): FormEvent {
  return {
    route: Route.ElternteilTaetigkeitenMinijobEinkommenDetailliert,
    params: { elternteilIndex, minijobIndex },
    payload: { monatsbrutto },
  };
}

function selbststaendigNeu(
  elternteilIndex: number,
  selbststaendigIndex: number,
  overrides: Partial<{
    istKirchensteuerpflichtig: boolean;
    istGesetzlichKrankenpflichtversichert: boolean;
    istGesetzlichRentenversichert: boolean;
    istGesetzlichArbeitlosenversichert: boolean;
  }> = {},
  bruttoJahresgewinn = 0,
): FormEvent {
  return {
    route: Route.ElternteilTaetigkeitenSelbststaendigAngaben,
    params: { elternteilIndex, selbststaendigIndex },
    payload: {
      istKirchensteuerpflichtig: false,
      istGesetzlichKrankenpflichtversichert: false,
      istGesetzlichRentenversichert: false,
      istGesetzlichArbeitlosenversichert: false,
      bruttoJahresgewinn,
      ...overrides,
    },
  };
}

describe("erstelleFinanzDaten: Parität zwischen altem und neuem Einkommensfluss", () => {
  describe("Kein Einkommen", () => {
    it("hatPeriodenOhneEinkommen ohne weitere Angaben", () => {
      const alt = erstelleFinanzDatenAlt(
        [abfrageAlt(0, { hatPeriodenOhneEinkommen: true })],
        0,
      );
      const neu = erstelleFinanzDatenNeu(
        [abfrageNeu(0, { hatPeriodenOhneEinkommen: true })],
        0,
      );

      expect(sortiereMischEinkommen(neu)).toEqual(sortiereMischEinkommen(alt));
    });
  });

  describe("Nicht-selbstständig", () => {
    it("ein Job, gleichverteiltes Einkommen", () => {
      const alt = erstelleFinanzDatenAlt(
        [
          abfrageAlt(0, { istNichtSelbststaendig: true }),
          nichtSelbststaendigAlt(0, 0, false),
          sozialversicherungenAlt(0, 0, { steuerklasse: Steuerklasse.III }),
          einkommenAlt(0, 0, 3000),
        ],
        0,
      );
      const neu = erstelleFinanzDatenNeu(
        [
          abfrageNeu(0, { istNichtSelbststaendig: true }),
          hauptjobNeu(0, 0, { steuerklasse: Steuerklasse.III }),
          angestelltEinkommenNeu(0, 0, 3000),
        ],
        0,
      );

      expect(sortiereMischEinkommen(neu)).toEqual(sortiereMischEinkommen(alt));
    });

    it("ein Job, detailliertes Einkommen ohne Lücken", () => {
      const monatsbrutto = [
        2000, 2500, 3000, 3500, 4000, 3000, 2000, 2500, 3000, 3500, 4000, 3000,
      ];

      const alt = erstelleFinanzDatenAlt(
        [
          abfrageAlt(0, { istNichtSelbststaendig: true }),
          nichtSelbststaendigAlt(0, 0, false),
          sozialversicherungenAlt(0, 0),
          einkommenDetailsAlt(0, 0, monatsbrutto),
        ],
        0,
      );
      const neu = erstelleFinanzDatenNeu(
        [
          abfrageNeu(0, { istNichtSelbststaendig: true }),
          hauptjobNeu(0, 0),
          angestelltEinkommenDetailliertNeu(0, 0, monatsbrutto),
        ],
        0,
      );

      expect(sortiereMischEinkommen(neu)).toEqual(sortiereMischEinkommen(alt));
    });

    it("ein Job, detailliertes Einkommen mit einkommenslosen Monaten (kein Mischeinkommen, daher unkritisch)", () => {
      const monatsbrutto = [
        3000, 3000, 3000, 0, 0, 0, 3000, 3000, 3000, 3000, 3000, 3000,
      ];

      const alt = erstelleFinanzDatenAlt(
        [
          abfrageAlt(0, { istNichtSelbststaendig: true }),
          nichtSelbststaendigAlt(0, 0, false),
          sozialversicherungenAlt(0, 0),
          einkommenDetailsAlt(0, 0, monatsbrutto),
        ],
        0,
      );
      const neu = erstelleFinanzDatenNeu(
        [
          abfrageNeu(0, { istNichtSelbststaendig: true }),
          hauptjobNeu(0, 0),
          angestelltEinkommenDetailliertNeu(0, 0, monatsbrutto),
        ],
        0,
      );

      expect(sortiereMischEinkommen(neu)).toEqual(sortiereMischEinkommen(alt));
    });

    it("Hauptjob und Nebenjob werden zu einem Gesamteinkommen aggregiert", () => {
      const alt = erstelleFinanzDatenAlt(
        [
          abfrageAlt(0, { istNichtSelbststaendig: true }),
          nichtSelbststaendigAlt(0, 0, false),
          sozialversicherungenAlt(0, 0, { istKirchensteuerpflichtig: true }),
          einkommenAlt(0, 0, 3000),
          nichtSelbststaendigAlt(0, 1, false),
          einkommenAlt(0, 1, 800),
        ],
        0,
      );
      const neu = erstelleFinanzDatenNeu(
        [
          abfrageNeu(0, { istNichtSelbststaendig: true }),
          hauptjobNeu(0, 0, { istKirchensteuerpflichtig: true }),
          angestelltEinkommenNeu(0, 0, 3000),
          angestelltEinkommenNeu(0, 1, 800),
        ],
        0,
      );

      expect(sortiereMischEinkommen(neu)).toEqual(sortiereMischEinkommen(alt));
    });

    it("throws, wenn keine Sozialversicherungen-Angaben vorliegen", () => {
      expect(() =>
        erstelleFinanzDatenAlt(
          [
            abfrageAlt(0, { istNichtSelbststaendig: true }),
            nichtSelbststaendigAlt(0, 0, false),
          ],
          0,
        ),
      ).toThrow("No Sozialversicherungen event found");
      expect(() =>
        erstelleFinanzDatenNeu(
          [abfrageNeu(0, { istNichtSelbststaendig: true })],
          0,
        ),
      ).toThrow("No Hauptjob event found");
    });
  });

  describe("Verbeamtet", () => {
    it("verhält sich wie eine nicht-selbstständige Tätigkeit", () => {
      const alt = erstelleFinanzDatenAlt(
        [
          abfrageAlt(0, { istVerbeamtet: true }),
          nichtSelbststaendigAlt(0, 0, false),
          sozialversicherungenAlt(0, 0, {
            istGesetzlichRentenversichert: false,
          }),
          einkommenAlt(0, 0, 3000),
        ],
        0,
      );
      const neu = erstelleFinanzDatenNeu(
        [
          abfrageNeu(0, { istVerbeamtet: true }),
          hauptjobNeu(0, 0, { istGesetzlichRentenversichert: false }),
          angestelltEinkommenNeu(0, 0, 3000),
        ],
        0,
      );

      expect(sortiereMischEinkommen(neu)).toEqual(sortiereMischEinkommen(alt));
    });
  });

  describe("Minijob", () => {
    it("gleichverteiltes Einkommen", () => {
      const alt = erstelleFinanzDatenAlt(
        [
          abfrageAlt(0, { istNichtSelbststaendig: true }),
          nichtSelbststaendigAlt(0, 0, true),
          einkommenAlt(0, 0, 450),
        ],
        0,
      );
      const neu = erstelleFinanzDatenNeu(
        [abfrageNeu(0, { hatMinijob: true }), minijobEinkommenNeu(0, 0, 450)],
        0,
      );

      expect(sortiereMischEinkommen(neu)).toEqual(sortiereMischEinkommen(alt));
    });

    it("detailliertes Einkommen mit einkommenslosen Monaten (kein Mischeinkommen, daher unkritisch)", () => {
      const monatsbrutto = [0, 0, 0, 0, 0, 0, 450, 450, 450, 450, 450, 450];

      const alt = erstelleFinanzDatenAlt(
        [
          abfrageAlt(0, { istNichtSelbststaendig: true }),
          nichtSelbststaendigAlt(0, 0, true),
          einkommenDetailsAlt(0, 0, monatsbrutto),
        ],
        0,
      );
      const neu = erstelleFinanzDatenNeu(
        [
          abfrageNeu(0, { hatMinijob: true }),
          minijobEinkommenDetailliertNeu(0, 0, monatsbrutto),
        ],
        0,
      );

      expect(sortiereMischEinkommen(neu)).toEqual(sortiereMischEinkommen(alt));
    });

    it("zwei Minijobs werden aggregiert", () => {
      const alt = erstelleFinanzDatenAlt(
        [
          abfrageAlt(0, { istNichtSelbststaendig: true }),
          nichtSelbststaendigAlt(0, 0, true),
          einkommenAlt(0, 0, 300),
          nichtSelbststaendigAlt(0, 1, true),
          einkommenAlt(0, 1, 200),
        ],
        0,
      );
      const neu = erstelleFinanzDatenNeu(
        [
          abfrageNeu(0, { hatMinijob: true }),
          minijobEinkommenNeu(0, 0, 300),
          minijobEinkommenNeu(0, 1, 200),
        ],
        0,
      );

      expect(sortiereMischEinkommen(neu)).toEqual(sortiereMischEinkommen(alt));
    });
  });

  describe("Selbstständig", () => {
    it("ein Jahresgewinn", () => {
      const alt = erstelleFinanzDatenAlt(
        [
          abfrageAlt(0, { istSelbststaendig: true }),
          selbststaendigAlt(0, 0, { istKirchensteuerpflichtig: true }, 24000),
        ],
        0,
      );
      const neu = erstelleFinanzDatenNeu(
        [
          abfrageNeu(0, { istSelbststaendig: true }),
          selbststaendigNeu(0, 0, { istKirchensteuerpflichtig: true }, 24000),
        ],
        0,
      );

      expect(sortiereMischEinkommen(neu)).toEqual(sortiereMischEinkommen(alt));
    });

    it("negativer Jahresgewinn wird auf 0 begrenzt", () => {
      const alt = erstelleFinanzDatenAlt(
        [
          abfrageAlt(0, { istSelbststaendig: true }),
          selbststaendigAlt(0, 0, {}, -60000),
        ],
        0,
      );
      const neu = erstelleFinanzDatenNeu(
        [
          abfrageNeu(0, { istSelbststaendig: true }),
          selbststaendigNeu(0, 0, {}, -60000),
        ],
        0,
      );

      expect(sortiereMischEinkommen(neu)).toEqual(sortiereMischEinkommen(alt));
    });

    it("mehrere Tätigkeiten werden aggregiert, SV-Status der ersten zählt", () => {
      const alt = erstelleFinanzDatenAlt(
        [
          abfrageAlt(0, { istSelbststaendig: true }),
          selbststaendigAlt(0, 0, { istKirchensteuerpflichtig: true }, 24000),
          selbststaendigAlt(0, 1, { istKirchensteuerpflichtig: false }, 12000),
        ],
        0,
      );
      const neu = erstelleFinanzDatenNeu(
        [
          abfrageNeu(0, { istSelbststaendig: true }),
          selbststaendigNeu(0, 0, { istKirchensteuerpflichtig: true }, 24000),
          selbststaendigNeu(0, 1, { istKirchensteuerpflichtig: false }, 12000),
        ],
        0,
      );

      expect(sortiereMischEinkommen(neu)).toEqual(sortiereMischEinkommen(alt));
    });
  });

  describe("Mischeinkommen ohne Lücken", () => {
    it("Nicht-selbstständig und Minijob, jeweils volle 12 Monate", () => {
      const alt = erstelleFinanzDatenAlt(
        [
          abfrageAlt(0, { istNichtSelbststaendig: true }),
          nichtSelbststaendigAlt(0, 0, false),
          sozialversicherungenAlt(0, 0),
          einkommenAlt(0, 0, 3000),
          nichtSelbststaendigAlt(0, 1, true),
          einkommenAlt(0, 1, 400),
        ],
        0,
      );
      const neu = erstelleFinanzDatenNeu(
        [
          abfrageNeu(0, { istNichtSelbststaendig: true, hatMinijob: true }),
          hauptjobNeu(0, 0),
          angestelltEinkommenNeu(0, 0, 3000),
          minijobEinkommenNeu(0, 1, 400),
        ],
        0,
      );

      expect(sortiereMischEinkommen(neu)).toEqual(sortiereMischEinkommen(alt));
    });

    it("Nicht-selbstständig und Selbstständig", () => {
      const alt = erstelleFinanzDatenAlt(
        [
          abfrageAlt(0, {
            istNichtSelbststaendig: true,
            istSelbststaendig: true,
          }),
          selbststaendigAlt(0, 0, {}, 12000),
          nichtSelbststaendigAlt(0, 1, false),
          sozialversicherungenAlt(0, 1),
          einkommenAlt(0, 1, 1500),
        ],
        0,
      );
      const neu = erstelleFinanzDatenNeu(
        [
          abfrageNeu(0, {
            istNichtSelbststaendig: true,
            istSelbststaendig: true,
          }),
          hauptjobNeu(0, 0),
          angestelltEinkommenNeu(0, 0, 1500),
          selbststaendigNeu(0, 0, {}, 12000),
        ],
        0,
      );

      expect(sortiereMischEinkommen(neu)).toEqual(sortiereMischEinkommen(alt));
    });

    it("Minijob und Selbstständig: mischEinkommenTaetigkeiten stimmen überein", () => {
      const alt = erstelleFinanzDatenAlt(
        [
          abfrageAlt(0, {
            istNichtSelbststaendig: true,
            istSelbststaendig: true,
          }),
          selbststaendigAlt(0, 0, {}, 24000),
          nichtSelbststaendigAlt(0, 1, true),
          einkommenAlt(0, 1, 400),
        ],
        0,
      );
      const neu = erstelleFinanzDatenNeu(
        [
          abfrageNeu(0, { hatMinijob: true, istSelbststaendig: true }),
          minijobEinkommenNeu(0, 0, 400),
          selbststaendigNeu(0, 0, {}, 24000),
        ],
        0,
      );

      expect(sortiereMischEinkommen(neu).mischEinkommenTaetigkeiten).toEqual(
        sortiereMischEinkommen(alt).mischEinkommenTaetigkeiten,
      );
    });

    /*
     * Bekannter, beabsichtigter Unterschied (siehe Kommentar am Dateianfang,
     * Punkt 2): Weder Minijob noch Selbstständigkeit sind gesetzlich
     * sozialversicherungspflichtig, trotzdem setzt der alte Flow
     * kassenArt/rentenVersicherung unconditional auf die
     * "pflichtig"-Varianten. Der neue Flow leitet sie korrekt aus den
     * tatsächlichen Angaben ab (hier: keine Nicht-selbstständigkeit/
     * Verbeamtung vorhanden, also "nicht pflichtig").
     */
    it("Minijob und Selbstständig: alter Flow setzt kassenArt/rentenVersicherung fälschlich auf pflichtig", () => {
      const alt = erstelleFinanzDatenAlt(
        [
          abfrageAlt(0, {
            istNichtSelbststaendig: true,
            istSelbststaendig: true,
          }),
          selbststaendigAlt(0, 0, {}, 24000),
          nichtSelbststaendigAlt(0, 1, true),
          einkommenAlt(0, 1, 400),
        ],
        0,
      );

      expect(alt.kassenArt).toBe("GESETZLICH_PFLICHTVERSICHERT");
      expect(alt.rentenVersicherung).toBe("GESETZLICHE_RENTEN_VERSICHERUNG");
    });

    it("Minijob und Selbstständig: neuer Flow setzt kassenArt/rentenVersicherung korrekt auf nicht pflichtig", () => {
      const neu = erstelleFinanzDatenNeu(
        [
          abfrageNeu(0, { hatMinijob: true, istSelbststaendig: true }),
          minijobEinkommenNeu(0, 0, 400),
          selbststaendigNeu(0, 0, {}, 24000),
        ],
        0,
      );

      expect(neu.kassenArt).toBe("NICHT_GESETZLICH_PFLICHTVERSICHERT");
      expect(neu.rentenVersicherung).toBe(
        "KEINE_GESETZLICHE_RENTEN_VERSICHERUNG",
      );
    });
  });

  /*
   * Bekannte Ausnahme: Bei Mischeinkommen-Tätigkeiten mit echten
   * einkommenslosen Monaten weichen bruttoEinkommenDurchschnitt und damit
   * bruttoEinkommen absichtlich voneinander ab (siehe Kommentar oben). Beide
   * Seiten werden hier trotzdem gegen ihr jeweils eigenes, bekanntes
   * Verhalten abgesichert, damit eine unbeabsichtigte Änderung auf einer der
   * beiden Seiten trotzdem auffällt.
   */
  describe("Mischeinkommen mit Monaten ohne Einkommen (bekannter, beabsichtigter Unterschied)", () => {
    const monatsbrutto = [
      3000, 3000, 3000, 0, 0, 0, 3000, 3000, 3000, 3000, 3000, 3000,
    ];

    it("alter Flow: bruttoEinkommenDurchschnitt teilt durch feste 12 Monate", () => {
      const alt = erstelleFinanzDatenAlt(
        [
          abfrageAlt(0, { istNichtSelbststaendig: true }),
          nichtSelbststaendigAlt(0, 0, false),
          sozialversicherungenAlt(0, 0),
          einkommenDetailsAlt(0, 0, monatsbrutto),
          nichtSelbststaendigAlt(0, 1, true),
          einkommenAlt(0, 1, 400),
        ],
        0,
      );

      expect(
        alt.mischEinkommenTaetigkeiten[0]?.bruttoEinkommenDurchschnitt,
      ).toBe(2250);
    });

    it("neuer Flow: bruttoEinkommenDurchschnitt teilt durch die aktiven Monate", () => {
      const neu = erstelleFinanzDatenNeu(
        [
          abfrageNeu(0, { istNichtSelbststaendig: true, hatMinijob: true }),
          hauptjobNeu(0, 0),
          angestelltEinkommenDetailliertNeu(0, 0, monatsbrutto),
          minijobEinkommenNeu(0, 1, 400),
        ],
        0,
      );

      expect(
        neu.mischEinkommenTaetigkeiten[0]?.bruttoEinkommenDurchschnitt,
      ).toBe(3000);
    });
  });

  describe("Mischeinkommen mit mehreren Tätigkeiten je Kategorie", () => {
    /*
     * Bekannter, beabsichtigter Unterschied (siehe Kommentar am Dateianfang,
     * Punkt 3): der alte Flow legt für die beiden Angestellt-Jobs zwei
     * getrennte Einträge an, der neue Flow fasst sie zu einem zusammen. Statt
     * das komplette FinanzDaten-Objekt zu vergleichen, wird hier geprüft, dass
     * der Minijob-Eintrag übereinstimmt und die Summe über alle
     * NICHT_SELBSTSTAENDIG-Einträge auf beiden Seiten identisch bleibt.
     */
    it("zwei Angestellt-Jobs gemischt mit einem Minijob", () => {
      const alt = erstelleFinanzDatenAlt(
        [
          abfrageAlt(0, { istNichtSelbststaendig: true }),
          nichtSelbststaendigAlt(0, 0, false),
          sozialversicherungenAlt(0, 0),
          einkommenAlt(0, 0, 2000),
          nichtSelbststaendigAlt(0, 1, false),
          sozialversicherungenAlt(0, 1),
          einkommenAlt(0, 1, 800),
          nichtSelbststaendigAlt(0, 2, true),
          einkommenAlt(0, 2, 400),
        ],
        0,
      );
      const neu = erstelleFinanzDatenNeu(
        [
          abfrageNeu(0, { istNichtSelbststaendig: true, hatMinijob: true }),
          hauptjobNeu(0, 0),
          angestelltEinkommenNeu(0, 0, 2000),
          angestelltEinkommenNeu(0, 1, 800),
          minijobEinkommenNeu(0, 0, 400),
        ],
        0,
      );

      expect(alt.mischEinkommenTaetigkeiten).toHaveLength(3);
      expect(neu.mischEinkommenTaetigkeiten).toHaveLength(2);
      expect(
        summeProKategorie(neu, ErwerbsTaetigkeit.NICHT_SELBSTSTAENDIG),
      ).toBe(summeProKategorie(alt, ErwerbsTaetigkeit.NICHT_SELBSTSTAENDIG));
      expect(findeKategorie(neu, ErwerbsTaetigkeit.MINIJOB)).toEqual(
        findeKategorie(alt, ErwerbsTaetigkeit.MINIJOB),
      );
    });

    it("ein Angestellt-Job gemischt mit zwei Minijobs", () => {
      const alt = erstelleFinanzDatenAlt(
        [
          abfrageAlt(0, { istNichtSelbststaendig: true }),
          nichtSelbststaendigAlt(0, 0, false),
          sozialversicherungenAlt(0, 0),
          einkommenAlt(0, 0, 3000),
          nichtSelbststaendigAlt(0, 1, true),
          einkommenAlt(0, 1, 300),
          nichtSelbststaendigAlt(0, 2, true),
          einkommenAlt(0, 2, 200),
        ],
        0,
      );
      const neu = erstelleFinanzDatenNeu(
        [
          abfrageNeu(0, { istNichtSelbststaendig: true, hatMinijob: true }),
          hauptjobNeu(0, 0),
          angestelltEinkommenNeu(0, 0, 3000),
          minijobEinkommenNeu(0, 0, 300),
          minijobEinkommenNeu(0, 1, 200),
        ],
        0,
      );

      expect(alt.mischEinkommenTaetigkeiten).toHaveLength(3);
      expect(neu.mischEinkommenTaetigkeiten).toHaveLength(2);
      expect(summeProKategorie(neu, ErwerbsTaetigkeit.MINIJOB)).toBe(
        summeProKategorie(alt, ErwerbsTaetigkeit.MINIJOB),
      );
      expect(
        findeKategorie(neu, ErwerbsTaetigkeit.NICHT_SELBSTSTAENDIG),
      ).toEqual(findeKategorie(alt, ErwerbsTaetigkeit.NICHT_SELBSTSTAENDIG));
    });

    it("ein Angestellt-Job gemischt mit zwei selbstständigen Tätigkeiten", () => {
      const alt = erstelleFinanzDatenAlt(
        [
          abfrageAlt(0, {
            istNichtSelbststaendig: true,
            istSelbststaendig: true,
          }),
          selbststaendigAlt(0, 0, { istKirchensteuerpflichtig: true }, 12000),
          selbststaendigAlt(0, 1, { istKirchensteuerpflichtig: false }, 6000),
          nichtSelbststaendigAlt(0, 2, false),
          sozialversicherungenAlt(0, 2),
          einkommenAlt(0, 2, 1000),
        ],
        0,
      );
      const neu = erstelleFinanzDatenNeu(
        [
          abfrageNeu(0, {
            istNichtSelbststaendig: true,
            istSelbststaendig: true,
          }),
          hauptjobNeu(0, 0),
          angestelltEinkommenNeu(0, 0, 1000),
          selbststaendigNeu(0, 0, { istKirchensteuerpflichtig: true }, 12000),
          selbststaendigNeu(0, 1, { istKirchensteuerpflichtig: false }, 6000),
        ],
        0,
      );

      expect(sortiereMischEinkommen(neu)).toEqual(sortiereMischEinkommen(alt));
    });

    it("je zwei Tätigkeiten in allen drei Kategorien gleichzeitig", () => {
      const alt = erstelleFinanzDatenAlt(
        [
          abfrageAlt(0, {
            istNichtSelbststaendig: true,
            istSelbststaendig: true,
          }),
          selbststaendigAlt(0, 0, {}, 12000),
          selbststaendigAlt(0, 1, {}, 6000),
          nichtSelbststaendigAlt(0, 2, false),
          sozialversicherungenAlt(0, 2),
          einkommenAlt(0, 2, 1000),
          nichtSelbststaendigAlt(0, 3, false),
          sozialversicherungenAlt(0, 3),
          einkommenAlt(0, 3, 400),
          nichtSelbststaendigAlt(0, 4, true),
          einkommenAlt(0, 4, 200),
          nichtSelbststaendigAlt(0, 5, true),
          einkommenAlt(0, 5, 100),
        ],
        0,
      );
      const neu = erstelleFinanzDatenNeu(
        [
          abfrageNeu(0, {
            istNichtSelbststaendig: true,
            hatMinijob: true,
            istSelbststaendig: true,
          }),
          hauptjobNeu(0, 0),
          angestelltEinkommenNeu(0, 0, 1000),
          angestelltEinkommenNeu(0, 1, 400),
          minijobEinkommenNeu(0, 0, 200),
          minijobEinkommenNeu(0, 1, 100),
          selbststaendigNeu(0, 0, {}, 12000),
          selbststaendigNeu(0, 1, {}, 6000),
        ],
        0,
      );

      expect(alt.mischEinkommenTaetigkeiten).toHaveLength(6);
      expect(neu.mischEinkommenTaetigkeiten).toHaveLength(4);
      expect(
        summeProKategorie(neu, ErwerbsTaetigkeit.NICHT_SELBSTSTAENDIG),
      ).toBe(summeProKategorie(alt, ErwerbsTaetigkeit.NICHT_SELBSTSTAENDIG));
      expect(summeProKategorie(neu, ErwerbsTaetigkeit.MINIJOB)).toBe(
        summeProKategorie(alt, ErwerbsTaetigkeit.MINIJOB),
      );
      const selbststaendigSortiert = (finanzDaten: typeof alt) =>
        finanzDaten.mischEinkommenTaetigkeiten
          .filter(
            (taetigkeit) =>
              taetigkeit.erwerbsTaetigkeit === ErwerbsTaetigkeit.SELBSTSTAENDIG,
          )
          .sort(
            (a, b) =>
              a.bruttoEinkommenDurchschnitt - b.bruttoEinkommenDurchschnitt,
          );
      expect(selbststaendigSortiert(neu)).toEqual(selbststaendigSortiert(alt));
    });
  });

  describe("Mehrere Elternteile", () => {
    it("erstelleFinanzdatenAllerElternteile liefert für beide Elternteile identische Ergebnisse", async () => {
      const { erstelleFinanzdatenAllerElternteile: allerAlt } =
        await import("./erstelleFinanzdaten");
      const { erstelleFinanzdatenAllerElternteile: allerNeu } =
        await import("./erstelleFinanzdatenNew");

      const gemeinsamAbfrage: FormEvent = {
        route: Route.ElternteilGemeinsamePlanungAbfrage,
        payload: { wirdZweitePersonBeruecksichtigt: true },
      };
      const elternteilZweiAngaben: FormEvent = {
        route: Route.ElternteilZweiAllgemeineAngaben,
        payload: { name: "Max" },
        dependentValues: {
          istSchwangerschaftsbedingteErkrankungMoeglich: true,
          naechsterGeschwisterIndexMitRelevanzFuerAusklammerung: 0,
        },
      };

      const alt = allerAlt([
        abfrageAlt(0, { istNichtSelbststaendig: true }),
        nichtSelbststaendigAlt(0, 0, false),
        sozialversicherungenAlt(0, 0),
        einkommenAlt(0, 0, 3000),
        gemeinsamAbfrage,
        elternteilZweiAngaben,
        abfrageAlt(1, { istSelbststaendig: true }),
        selbststaendigAlt(1, 0, {}, 24000),
      ]);
      const neu = allerNeu([
        abfrageNeu(0, { istNichtSelbststaendig: true }),
        hauptjobNeu(0, 0),
        angestelltEinkommenNeu(0, 0, 3000),
        gemeinsamAbfrage,
        elternteilZweiAngaben,
        abfrageNeu(1, { istSelbststaendig: true }),
        selbststaendigNeu(1, 0, {}, 24000),
      ]);

      expect(neu).toEqual(alt);
    });
  });
});
