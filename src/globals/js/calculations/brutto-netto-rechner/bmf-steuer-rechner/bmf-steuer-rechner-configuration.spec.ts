import { beforeEach, describe, expect, it, vi } from "vitest";
import { bmfSteuerRechnerUrlOf } from "./bmf-steuer-rechner-configuration";
import { BmfSteuerRechnerParameter } from "./bmf-steuer-rechner-parameter";

describe("bmf-steuer-rechner-configuration", () => {
  beforeEach(() => {
    vi.stubEnv(
      "VITE_APP_BMF_STEUER_RECHNER_DOMAIN",
      "www.bmf-steuerrechner.de",
    );
  });

  it("should use correct hostname", () => {
    const actual = bmfSteuerRechnerUrlOf(2022, new BmfSteuerRechnerParameter());
    expect(actual.substring(0, actual.indexOf("/interface"))).toBe(
      "https://www.bmf-steuerrechner.de",
    );
  });

  describe("should create correct path, when Lohnsteuerjahr is", () => {
    it("2021", () => {
      const actual = bmfSteuerRechnerUrlOf(
        2021,
        new BmfSteuerRechnerParameter(),
      );
      expect(
        actual.substring(actual.indexOf("/interface"), actual.indexOf("?")),
      ).toBe("/interface/2021Version1.xhtml");
    });

    it("2022", () => {
      const actual = bmfSteuerRechnerUrlOf(
        2022,
        new BmfSteuerRechnerParameter(),
      );
      expect(
        actual.substring(actual.indexOf("/interface"), actual.indexOf("?")),
      ).toBe("/interface/2022Version1.xhtml");
    });
  });

  describe.each([
    [
      { LZZ: 1, RE4: 533333, STKL: 4, KVZ: 0.9, F: 1.0, ZKF: 1 },
      "https://www.bmf-steuerrechner.de/interface/2022Version1.xhtml?LZZ=1&RE4=533333&STKL=4&ZKF=1&R=0&PKV=0&KVZ=0.9&PVS=0&PVZ=0&KRV=0&ALTER1=0&AF=0&F=1&code=2022eP",
    ],
    [
      { LZZ: 3, RE4: 208333, STKL: 6, KVZ: 2.9, F: 1.2, ZKF: 3 },
      "https://www.bmf-steuerrechner.de/interface/2022Version1.xhtml?LZZ=3&RE4=208333&STKL=6&ZKF=3&R=0&PKV=0&KVZ=2.9&PVS=0&PVZ=0&KRV=0&ALTER1=0&AF=0&F=1.2&code=2022eP",
    ],
    [
      {
        LZZ: 2,
        RE4: 8333,
        STKL: 5,
        KVZ: 1.9,
        F: 1.1,
        ZKF: 2,
        R: 1,
        PVS: 6,
        PVZ: 7,
        KRV: 8,
        ALTER1: 9,
        AF: 10,
      },
      "https://www.bmf-steuerrechner.de/interface/2022Version1.xhtml?LZZ=2&RE4=8333&STKL=5&ZKF=2&R=1&PKV=0&KVZ=1.9&PVS=6&PVZ=7&KRV=8&ALTER1=9&AF=10&F=1.1&code=2022eP",
    ],
  ])("when parameter are %j, then expect url %s", (params, lstlzz) => {
    it("should build url", () => {
      const actual = bmfSteuerRechnerUrlOf(
        2022,
        Object.assign(new BmfSteuerRechnerParameter(), params),
      );
      expect(actual).toBe(lstlzz);
    });
  });

  describe("should throw error, when Lohnsteuerjahr is", () => {
    it("2023", () => {
      expect(() =>
        bmfSteuerRechnerUrlOf(2023, new BmfSteuerRechnerParameter()),
      ).toThrow("BmfSteuerRechnerNotImplementedForLohnsteuerjahr");
    });

    it("2020", () => {
      expect(() =>
        bmfSteuerRechnerUrlOf(2020, new BmfSteuerRechnerParameter()),
      ).toThrow("BmfSteuerRechnerNotImplementedForLohnsteuerjahr");
    });

    it("2019", () => {
      expect(() =>
        bmfSteuerRechnerUrlOf(2019, new BmfSteuerRechnerParameter()),
      ).toThrow("BmfSteuerRechnerNotImplementedForLohnsteuerjahr");
    });
  });
});
