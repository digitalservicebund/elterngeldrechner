import { DateTime } from "luxon";
import type { Geburtstag } from "./elternteile-types";
import { getPartnerMonateSettings } from "./elternteile-setting";

describe("Elternteile-Setting", () => {
  const expectedDateOfBirth = DateTime.fromISO("2022-03-04T00:00:00Z");
  const geburtstag: Geburtstag = {
    geburt: expectedDateOfBirth.toISO() as string,
    errechnet: expectedDateOfBirth.toISO() as string,
  };

  it("should not has Partnermonate", () => {
    expect(
      getPartnerMonateSettings({
        mehrlinge: false,
        behindertesGeschwisterkind: false,
        geburtstag: geburtstag,
      }),
    ).toBeFalsy();
  });

  it("should get Partnermonate false", () => {
    expect(
      getPartnerMonateSettings({
        partnerMonate: false,
        mehrlinge: false,
        behindertesGeschwisterkind: false,
      }),
    ).toBeFalsy();
  });

  it("should get Partnermonate true", () => {
    expect(
      getPartnerMonateSettings({
        partnerMonate: true,
        mehrlinge: false,
        behindertesGeschwisterkind: false,
      }),
    ).toBeTruthy();
  });

  it("should get Partnermonate false with Geburtstag", () => {
    expect(
      getPartnerMonateSettings({
        partnerMonate: false,
        geburtstag: geburtstag,
        mehrlinge: false,
        behindertesGeschwisterkind: false,
      }),
    ).toBeFalsy();
  });

  it("should get Partnermonate true with Geburtstag", () => {
    expect(
      getPartnerMonateSettings({
        partnerMonate: true,
        geburtstag: geburtstag,
        mehrlinge: false,
        behindertesGeschwisterkind: false,
      }),
    ).toBeTruthy();
  });
});
