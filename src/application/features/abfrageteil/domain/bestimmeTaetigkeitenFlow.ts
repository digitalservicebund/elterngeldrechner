import type { ElternteilTaetigkeitenAbfrage } from "@/application/features/abfrageteil/pages/elternteil";

export function bestimmeTaetigkeitenFlow(
  taetigkeiten: ElternteilTaetigkeitenAbfrage,
): "Selbstaendig" | "Nicht-Selbstaendig" {
  return taetigkeiten.istSelbststaendig ? "Selbstaendig" : "Nicht-Selbstaendig";
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  const base = {
    istNichtSelbststaendig: false,
    istVerbeamtet: false,
    hatAndereLeistungen: false,
    hatPeriodenOhneEinkommen: false,
  };

  describe("bestimmeTaetigkeitenFlow", () => {
    it("returns Selbstaendig when istSelbststaendig is true", () => {
      expect(
        bestimmeTaetigkeitenFlow({ ...base, istSelbststaendig: true }),
      ).toBe("Selbstaendig");
    });

    it("returns Selbstaendig even when also nicht-selbststaendig", () => {
      expect(
        bestimmeTaetigkeitenFlow({
          ...base,
          istSelbststaendig: true,
          istNichtSelbststaendig: true,
        }),
      ).toBe("Selbstaendig");
    });

    it("returns Selbstaendig even when also verbeamtet", () => {
      expect(
        bestimmeTaetigkeitenFlow({
          ...base,
          istSelbststaendig: true,
          istVerbeamtet: true,
        }),
      ).toBe("Selbstaendig");
    });

    it("returns Nicht-Selbstaendig when istSelbststaendig is false", () => {
      expect(
        bestimmeTaetigkeitenFlow({ ...base, istSelbststaendig: false }),
      ).toBe("Nicht-Selbstaendig");
    });
  });
}
