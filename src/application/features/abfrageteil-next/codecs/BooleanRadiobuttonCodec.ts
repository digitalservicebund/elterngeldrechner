import { z } from "zod";

export const BooleanRadiobuttonCodec = z.codec(
  z.enum(["yes", "no"], {
    error: "Wählen Sie bitte Ja oder Nein",
  }),
  z.boolean(),
  {
    decode: (arg) => arg === "yes",
    encode: (value) => (value ? "yes" : "no"),
  },
);

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("BooleanRadiobuttonCodec", () => {
    it("decodes 'yes' to true", () => {
      expect(BooleanRadiobuttonCodec.parse("yes")).toEqual(true);
    });

    it("decodes 'no' to false", () => {
      expect(BooleanRadiobuttonCodec.parse("no")).toEqual(false);
    });

    it("encodes true to 'yes'", () => {
      expect(BooleanRadiobuttonCodec.encode(true)).toEqual("yes");
    });

    it("encodes false to 'no'", () => {
      expect(BooleanRadiobuttonCodec.encode(false)).toEqual("no");
    });
  });
}
