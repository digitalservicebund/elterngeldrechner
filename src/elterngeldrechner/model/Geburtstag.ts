/**
 * A date with no time. Just year, month and day. Specifically used to represent
 * birthdays.
 *
 * It is (almost) fully compatible to the native `Date`. Any created
 * `Geburtstag` will have no time value (i.e. it being midnight at
 * "00:00:00.000"). Trying to manipulate the time of a `Geburtstag` will result
 * in errors being thrown. All other operations just work, despite the time will
 * be zeroed again.
 */
export class Geburtstag extends Date {
  constructor(...parameters: ConstructorParameters<typeof Date>) {
    super(...parameters);
    super.setHours(0, 0, 0, 0);
  }

  override setTime(time: number): number {
    super.setTime(time);
    super.setHours(0, 0, 0, 0);
    return this.getTime();
  }

  override setHours(): number {
    throw Error("Can not modify time of a timeless Geburtstag.");
  }

  override setMinutes(): number {
    throw Error("Can not modify time of a timeless Geburtstag.");
  }

  override setSeconds(): number {
    throw Error("Can not modify time of a timeless Geburtstag.");
  }

  override setMilliseconds(): number {
    throw Error("Can not modify time of a timeless Geburtstag.");
  }
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("Geburtstag", async () => {
    const {
      assert,
      property,
      date: arbitraryDate,
    } = await import("fast-check");

    it("automatically sets the time to zero when created from a raw date", () => {
      assert(
        property(arbitraryDate({ min: OLDEST_REPRESENTABLE_DATE }), (date) => {
          const geburtstag = new Geburtstag(date);

          expect(geburtstag.getHours()).toBe(0);
          expect(geburtstag.getMinutes()).toBe(0);
          expect(geburtstag.getSeconds()).toBe(0);
          expect(geburtstag.getMilliseconds()).toBe(0);
        }),
      );
    });

    it("automatically sets the time to zero when created from an ISO string", () => {
      assert(
        property(arbitraryDate({ min: OLDEST_REPRESENTABLE_DATE }), (date) => {
          const geburtstag = new Geburtstag(date.toISOString());

          expect(geburtstag.getHours()).toBe(0);
          expect(geburtstag.getMinutes()).toBe(0);
          expect(geburtstag.getSeconds()).toBe(0);
          expect(geburtstag.getMilliseconds()).toBe(0);
        }),
      );
    });

    it("automatically sets the time to zero when created from milliseconds", () => {
      assert(
        property(arbitraryDate({ min: OLDEST_REPRESENTABLE_DATE }), (date) => {
          const geburtstag = new Geburtstag(date.getTime());

          expect(geburtstag.getHours()).toBe(0);
          expect(geburtstag.getMinutes()).toBe(0);
          expect(geburtstag.getSeconds()).toBe(0);
          expect(geburtstag.getMilliseconds()).toBe(0);
        }),
      );
    });

    it("automatically sets the time to zero when setting the epoche milliseconds", () => {
      const geburtstag = new Geburtstag(Date.now());
      geburtstag.setTime(123456);

      expect(geburtstag.getHours()).toBe(0);
      expect(geburtstag.getMinutes()).toBe(0);
      expect(geburtstag.getSeconds()).toBe(0);
      expect(geburtstag.getMilliseconds()).toBe(0);
    });

    it("throws an error when trying to set any time value", () => {
      const geburtstag = new Geburtstag(Date.now());

      expect(() => geburtstag.setHours()).toThrowError();
      expect(() => geburtstag.setMinutes()).toThrowError();
      expect(() => geburtstag.setSeconds()).toThrowError();
      expect(() => geburtstag.setMilliseconds()).toThrowError();
    });
  });

  /* Trying to set the hours on this date will make it become invalid as it
   * exceed the internal numeric representation. */
  const OLDEST_REPRESENTABLE_DATE = new Date("-271821-04-21");
}
