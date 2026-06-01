// Whether any sibling entered so far has a Behinderung. The Geschwister-Angaben
// step repeats per sibling, so the flag accumulates: once any sibling qualifies
// it stays true until the Geschwister question is answered anew. A missing
// previous value (no sibling recorded yet) counts as false.
export function hatGeschwisterMitBehinderung(
  bisherMitBehinderung: boolean | undefined,
  hatBehinderung: boolean,
): boolean {
  return (bisherMitBehinderung ?? false) || hatBehinderung;
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("tracking", () => {
    describe("hatGeschwisterMitBehinderung", () => {
      it("is false when no sibling was recorded and the current one has none", () => {
        expect(hatGeschwisterMitBehinderung(undefined, false)).toEqual(false);
      });

      it("is true when no sibling was recorded but the current one has one", () => {
        expect(hatGeschwisterMitBehinderung(undefined, true)).toEqual(true);
      });

      it("is false when no sibling has a Behinderung", () => {
        expect(hatGeschwisterMitBehinderung(false, false)).toEqual(false);
      });

      it("is true when the current sibling has a Behinderung", () => {
        expect(hatGeschwisterMitBehinderung(false, true)).toEqual(true);
      });

      it("stays true when a previous sibling already had a Behinderung", () => {
        expect(hatGeschwisterMitBehinderung(true, false)).toEqual(true);
      });
    });
  });
}
