import { DateTime } from "luxon";
import type { Geburtstag } from "./elternteile-types";
import { getPartnerMonateSettings } from "./elternteile-setting";

describe("Elternteile-Setting", () => {
  const expectedDateOfBirth = DateTime.fromISO("2022-03-04T00:00:00Z");
  const geburtstag: Geburtstag = {
    geburt: expectedDateOfBirth.toISO(),
    errechnet: expectedDateOfBirth.toISO(),
  };

  it("should not has Partnermonate", () => {
    expect(getPartnerMonateSettings({ geburtstag: geburtstag })).toBeFalsy();
  });

  it("should get Partnermonate false", () => {
    expect(getPartnerMonateSettings({ partnerMonate: false })).toBeFalsy();
  });

  it("should get Partnermonate true", () => {
    expect(getPartnerMonateSettings({ partnerMonate: true })).toBeTruthy();
  });

  it("should get Partnermonate false with Geburtstag", () => {
    expect(getPartnerMonateSettings({ partnerMonate: false, geburtstag: geburtstag })).toBeFalsy();
  });

  it("should get Partnermonate true with Geburtstag", () => {
    expect(getPartnerMonateSettings({ partnerMonate: true, geburtstag: geburtstag })).toBeTruthy();
  });
});
