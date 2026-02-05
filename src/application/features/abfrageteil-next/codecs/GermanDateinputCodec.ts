import { Temporal } from "@js-temporal/polyfill";
import { z } from "zod";

export const GermanDateinputCodec = z.codec(
  z.string().regex(/^\d{2}\.\d{2}\.\d{4}$/, {
    error: "Bitte geben Sie ein gültiges Datum im Format TT.MM.JJJJ ein",
  }),
  z.instanceof(Temporal.PlainDate),
  {
    decode: (value) => {
      const [day, month, year] = value.split(".");
      return Temporal.PlainDate.from(`${year}-${month}-${day}`);
    },
    encode: (date) => {
      const day = String(date.day).padStart(2, "0");
      const month = String(date.month).padStart(2, "0");
      return `${day}.${month}.${date.year}`;
    },
  },
);

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("GermanDateinputCodec", () => {
    it("decodes a German date string to a Temporal.PlainDate", () => {
      const result = GermanDateinputCodec.parse("15.03.2024");
      expect(result).toEqual(Temporal.PlainDate.from("2024-03-15"));
    });

    it("encodes a Temporal.PlainDate to a German date string", () => {
      const date = Temporal.PlainDate.from("2024-03-15");
      expect(GermanDateinputCodec.encode(date)).toEqual("15.03.2024");
    });
  });
}
