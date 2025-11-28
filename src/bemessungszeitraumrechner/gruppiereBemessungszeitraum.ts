import { Ausklammerung } from "./ausklammerung";
import { Zeitraum, naechsterMonat } from "./zeitraum";

type GruppiereBemessungszeitraumOptions = {
  bemessungszeitraum: Zeitraum[];
  ausklammerungen: Ausklammerung[];
};

type GruppiereBemessungszeitraumResult = Array<Date[] | Ausklammerung>;

export function gruppiereBemessungszeitraum(
  options: GruppiereBemessungszeitraumOptions,
): GruppiereBemessungszeitraumResult {
  const { bemessungszeitraum, ausklammerungen } = options;

  const monatsgruppen: Date[][] = bemessungszeitraum.map(generiereMonate);

  const alleElemente: GruppiereBemessungszeitraumResult = [
    ...monatsgruppen,
    ...ausklammerungen,
  ];

  const sortierteElemente = [...alleElemente].sort((a, b) => {
    const datumLeft = Array.isArray(a) ? a[0] : a.von;
    const datumRight = Array.isArray(b) ? b[0] : b.von;

    if (!datumLeft || !datumRight) {
      return 0;
    }

    return datumLeft.getTime() - datumRight.getTime();
  });

  return sortierteElemente;
}

function generiereMonate(zeitraum: Zeitraum): Date[] {
  const startDatum = new Date(zeitraum.von.getTime());
  startDatum.setUTCDate(1);
  const endDatum = new Date(zeitraum.bis.getTime());

  return generiereMonateRekursiv(startDatum, endDatum);
}

function generiereMonateRekursiv(startDatum: Date, endDatum: Date): Date[] {
  if (startDatum > endDatum) {
    return [];
  }

  const weitereMonate = generiereMonateRekursiv(
    naechsterMonat(startDatum),
    endDatum,
  );

  return [new Date(startDatum.getTime()), ...weitereMonate];
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("gruppiereBemessungszeitraum", () => {
    it("fans out the Monate of a Bemessungszeitraum", () => {
      const bemessungszeitraum = [
        {
          von: new Date("2024-01-01T00:00:00.000Z"),
          bis: new Date("2024-06-01T00:00:00.000Z"),
        },
      ];

      const result = gruppiereBemessungszeitraum({
        bemessungszeitraum,
        ausklammerungen: [],
      });

      const expectation: GruppiereBemessungszeitraumResult = [
        [
          new Date("2024-01-01T00:00:00.000Z"),
          new Date("2024-02-01T00:00:00.000Z"),
          new Date("2024-03-01T00:00:00.000Z"),
          new Date("2024-04-01T00:00:00.000Z"),
          new Date("2024-05-01T00:00:00.000Z"),
          new Date("2024-06-01T00:00:00.000Z"),
        ],
      ];

      expect(result).toEqual(expectation);
    });

    it("inserts the dividing Ausklammerung in between the groups of Monate", () => {
      const bemessungszeitraum = [
        {
          von: new Date("2024-01-01T00:00:00.000Z"),
          bis: new Date("2024-02-01T00:00:00.000Z"),
        },
        {
          von: new Date("2024-04-01T00:00:00.000Z"),
          bis: new Date("2024-07-01T00:00:00.000Z"),
        },
      ];

      const ausklammerungen = [
        {
          von: new Date("2024-03-05T00:00:00.000Z"),
          bis: new Date("2024-03-07T00:00:00.000Z"),
          beschreibung: "Krankheit",
        },
      ];

      const result = gruppiereBemessungszeitraum({
        bemessungszeitraum,
        ausklammerungen,
      });

      const expectation: GruppiereBemessungszeitraumResult = [
        [
          new Date("2024-01-01T00:00:00.000Z"),
          new Date("2024-02-01T00:00:00.000Z"),
        ],
        {
          von: new Date("2024-03-05T00:00:00.000Z"),
          bis: new Date("2024-03-07T00:00:00.000Z"),
          beschreibung: "Krankheit",
        },
        [
          new Date("2024-04-01T00:00:00.000Z"),
          new Date("2024-05-01T00:00:00.000Z"),
          new Date("2024-06-01T00:00:00.000Z"),
          new Date("2024-07-01T00:00:00.000Z"),
        ],
      ];

      expect(result).toEqual(expectation);
    });
  });
}
