import { z } from "zod";

export const OptionalBooleanRadiobuttonCodec = z.codec(
  z.enum(["yes", "no", "unknown"], {
    error: "Bitte treffen Sie eine Auswahl",
  }),
  z.boolean().optional(),
  {
    decode: (arg) => {
      if (arg === "yes") return true;
      if (arg === "no") return false;
      return undefined;
    },
    encode: (value) => {
      if (value === true) return "yes";
      if (value === false) return "no";
      return "unknown";
    },
  },
);

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("OptionalBooleanRadiobuttonCodec", () => {
    it("decodes 'yes' to true", () => {
      expect(OptionalBooleanRadiobuttonCodec.parse("yes")).toEqual(true);
    });

    it("decodes 'no' to false", () => {
      expect(OptionalBooleanRadiobuttonCodec.parse("no")).toEqual(false);
    });

    it("decodes 'unknown' to undefined", () => {
      expect(OptionalBooleanRadiobuttonCodec.parse("unknown")).toEqual(
        undefined,
      );
    });

    it("encodes true to 'yes'", () => {
      expect(OptionalBooleanRadiobuttonCodec.encode(true)).toEqual("yes");
    });

    it("encodes false to 'no'", () => {
      expect(OptionalBooleanRadiobuttonCodec.encode(false)).toEqual("no");
    });

    it("encodes undefined to 'unknown'", () => {
      expect(OptionalBooleanRadiobuttonCodec.encode(undefined)).toEqual(
        "unknown",
      );
    });
  });
}
