import type { ElternteilTaetigkeitenAbfrage } from "./ElternteilSchema";

export type Einkommensart =
  | "Selbstständig"
  | "Angestellt"
  | "Beamte"
  | "Sozial- oder Lohnersatzleistungen"
  | "Kein Einkommen";

export function bestimmeEinkommensarten(
  taetigkeiten: ElternteilTaetigkeitenAbfrage,
): Einkommensart[] {
  const einkommensarten: Einkommensart[] = [];

  if (taetigkeiten.istSelbststaendig) {
    einkommensarten.push("Selbstständig");
  }

  if (taetigkeiten.istNichtSelbststaendig) {
    einkommensarten.push("Angestellt");
  }

  if (taetigkeiten.istVerbeamtet) {
    einkommensarten.push("Beamte");
  }

  if (taetigkeiten.hatAndereLeistungen) {
    einkommensarten.push("Sozial- oder Lohnersatzleistungen");
  }

  if (taetigkeiten.hatPeriodenOhneEinkommen) {
    einkommensarten.push("Kein Einkommen");
  }

  return einkommensarten;
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("bestimmeEinkommensarten", () => {
    it("returns 'Selbstständig' for a self-employed person", () => {
      expect(
        bestimmeEinkommensarten({
          istSelbststaendig: true,
          istNichtSelbststaendig: false,
          istVerbeamtet: false,
          hatAndereLeistungen: false,
          hatPeriodenOhneEinkommen: false,
        }),
      ).toEqual(["Selbstständig"]);
    });

    it("returns 'Angestellt' for an employed person", () => {
      expect(
        bestimmeEinkommensarten({
          istSelbststaendig: false,
          istNichtSelbststaendig: true,
          istVerbeamtet: false,
          hatAndereLeistungen: false,
          hatPeriodenOhneEinkommen: false,
        }),
      ).toEqual(["Angestellt"]);
    });

    it("returns 'Beamte' for a civil servant", () => {
      expect(
        bestimmeEinkommensarten({
          istSelbststaendig: false,
          istNichtSelbststaendig: false,
          istVerbeamtet: true,
          hatAndereLeistungen: false,
          hatPeriodenOhneEinkommen: false,
        }),
      ).toEqual(["Beamte"]);
    });

    it("returns every kind a person with mixed income belongs to", () => {
      expect(
        bestimmeEinkommensarten({
          istSelbststaendig: true,
          istNichtSelbststaendig: true,
          istVerbeamtet: false,
          hatAndereLeistungen: false,
          hatPeriodenOhneEinkommen: false,
        }),
      ).toEqual(["Selbstständig", "Angestellt"]);
    });

    it("returns all three kinds of employment", () => {
      expect(
        bestimmeEinkommensarten({
          istSelbststaendig: true,
          istNichtSelbststaendig: true,
          istVerbeamtet: true,
          hatAndereLeistungen: false,
          hatPeriodenOhneEinkommen: false,
        }),
      ).toEqual(["Selbstständig", "Angestellt", "Beamte"]);
    });

    it("returns 'Sozial- oder Lohnersatzleistungen' when only benefits are received", () => {
      expect(
        bestimmeEinkommensarten({
          istSelbststaendig: false,
          istNichtSelbststaendig: false,
          istVerbeamtet: false,
          hatAndereLeistungen: true,
          hatPeriodenOhneEinkommen: false,
        }),
      ).toEqual(["Sozial- oder Lohnersatzleistungen"]);
    });

    it("returns 'Kein Einkommen' when only periods without income exist", () => {
      expect(
        bestimmeEinkommensarten({
          istSelbststaendig: false,
          istNichtSelbststaendig: false,
          istVerbeamtet: false,
          hatAndereLeistungen: false,
          hatPeriodenOhneEinkommen: true,
        }),
      ).toEqual(["Kein Einkommen"]);
    });

    it("keeps employment and periods without income side by side", () => {
      expect(
        bestimmeEinkommensarten({
          istSelbststaendig: false,
          istNichtSelbststaendig: true,
          istVerbeamtet: false,
          hatAndereLeistungen: false,
          hatPeriodenOhneEinkommen: true,
        }),
      ).toEqual(["Angestellt", "Kein Einkommen"]);
    });
  });
}
