/**
 * A date with no time. Just year, month and day. Specifically used to represent
 * birthdays.
 *
 * It is (almost) fully compatible to the native `Date`. Any created
 * `Geburtstag` will have its time fixed to midnight based on the UTZ timezone.
 * Trying to manipulate the time of a `Geburtstag` will result in errors being
 * thrown. All other operations just work, despite the time will be zeroed
 * again.
 */
export class Geburtstag extends Date {
  constructor(...parameters: ConstructorParameters<typeof Date>) {
    super(...parameters);
    const utcYear = this.getUTCFullYear();
    const utcMonth = this.getUTCMonth();
    const utcDate = this.getUTCDate();
    super.setTime(Date.UTC(utcYear, utcMonth, utcDate));
  }

  override setTime(time: number): number {
    const date = new Date(time);
    return super.setTime(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
    );
  }

  override setHours(): number {
    throw Error("Can not modify time of a timeless Geburtstag.");
  }

  override setUTCHours(): number {
    throw Error("Can not modify time of a timeless Geburtstag.");
  }

  override setMinutes(): number {
    throw Error("Can not modify time of a timeless Geburtstag.");
  }

  override setUTCMinutes(): number {
    throw Error("Can not modify time of a timeless Geburtstag.");
  }

  override setSeconds(): number {
    throw Error("Can not modify time of a timeless Geburtstag.");
  }

  override setUTCSeconds(): number {
    throw Error("Can not modify time of a timeless Geburtstag.");
  }

  override setMilliseconds(): number {
    throw Error("Can not modify time of a timeless Geburtstag.");
  }

  override setUTCMilliseconds(): number {
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
        property(
          arbitraryDate({
            min: OLDEST_REPRESENTABLE_DATE,
            noInvalidDate: true,
          }),
          (date) => {
            const geburtstag = new Geburtstag(date);
            expect(getFormattedTime(geburtstag)).toBe("00:00:00.000");
          },
        ),
      );
    });

    it("automatically sets the time to zero when created from an ISO string", () => {
      assert(
        property(
          arbitraryDate({
            min: OLDEST_REPRESENTABLE_DATE,
            noInvalidDate: true,
          }),
          (date) => {
            const geburtstag = new Geburtstag(date.toISOString());
            expect(getFormattedTime(geburtstag)).toBe("00:00:00.000");
          },
        ),
      );
    });

    it("automatically sets the time to zero when created from milliseconds", () => {
      assert(
        property(
          arbitraryDate({
            min: OLDEST_REPRESENTABLE_DATE,
            noInvalidDate: true,
          }),
          (date) => {
            const geburtstag = new Geburtstag(date.getTime());
            expect(getFormattedTime(geburtstag)).toBe("00:00:00.000");
          },
        ),
      );
    });

    it("automatically sets the time to zero when setting the epoche milliseconds", () => {
      const geburtstag = new Geburtstag(Date.now());
      geburtstag.setTime(123456);

      expect(getFormattedTime(geburtstag)).toBe("00:00:00.000");
    });

    it("throws an error when trying to set any time value", () => {
      const geburtstag = new Geburtstag(Date.now());

      expect(() => geburtstag.setHours()).toThrowError();
      expect(() => geburtstag.setUTCHours()).toThrowError();
      expect(() => geburtstag.setUTCMinutes()).toThrowError();
      expect(() => geburtstag.setUTCMinutes()).toThrowError();
      expect(() => geburtstag.setUTCSeconds()).toThrowError();
      expect(() => geburtstag.setUTCSeconds()).toThrowError();
      expect(() => geburtstag.setUTCMilliseconds()).toThrowError();
      expect(() => geburtstag.setUTCMilliseconds()).toThrowError();
    });

    function getFormattedTime(geburtstag: Geburtstag): string {
      return geburtstag.toISOString().slice(-13, -1);
    }

    /* Trying to set the hours on this date will make it become invalid as it
     * exceed the internal numeric representation. */
    const OLDEST_REPRESENTABLE_DATE = new Date("-271821-04-21");
  });
}
