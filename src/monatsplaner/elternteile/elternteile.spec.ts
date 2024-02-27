import { numberOfLebensmonate } from "../configuration";
import { DateTime } from "luxon";
import type { Geburtstag, Month } from "./elternteile-types";
import { MutterschutzSettings } from "./elternteile-setting";
import { createElternteile } from "./elternteile";

describe("Elternteile", () => {
  const expectedDateOfBirth = DateTime.fromISO("2022-03-04T00:00:00Z");

  it("should create Elternteile containing all 32 months with no Elterngeld Type selected", () => {
    const elternteile = createElternteile();
    const emptyMonth: Month = {
      type: "None",
      isMutterschutzMonth: false,
    };
    const emptyMonths: Month[] = Array.from({
      length: numberOfLebensmonate,
    }).map(() => emptyMonth);

    expect(elternteile.ET1.months).toEqual(emptyMonths);
    expect(elternteile.ET2.months).toEqual(emptyMonths);
  });

  it("should allow 12 Month of Basiselterngeld for each Elternteil", () => {
    const elternteile = createElternteile();

    expect(elternteile.remainingMonths.basiselterngeld).toBe(12);
  });

  it("should allow 14 Month of Basiselterngeld for each Elternteil with Partnerbonus", () => {
    const elternteile = createElternteile({
      partnerMonate: true,
      mehrlinge: false,
      behindertesGeschwisterkind: false,
    });

    expect(elternteile.remainingMonths.basiselterngeld).toBe(14);
  });

  it("should allow 13 Month of Basiselterngeld if the birth was at least 6 weeks earlier than expected", () => {
    const dateOfBirth = expectedDateOfBirth.minus({ weeks: 6 });

    const geburtstag: Geburtstag = {
      geburt: dateOfBirth.toISO() as string,
      errechnet: expectedDateOfBirth.toISO() as string,
    };

    const elternteile = createElternteile({
      geburtstag,
      mehrlinge: false,
      behindertesGeschwisterkind: false,
    });

    expect(elternteile.remainingMonths.basiselterngeld).toBe(13);
  });

  it("should allow 15 Month of Basiselterngeld if the birth was at least 6 weeks earlier than expected and with Partnerbonus", () => {
    const dateOfBirth = expectedDateOfBirth.minus({ weeks: 6 });

    const geburtstag: Geburtstag = {
      geburt: dateOfBirth.toISO() as string,
      errechnet: expectedDateOfBirth.toISO() as string,
    };

    const elternteile = createElternteile({
      partnerMonate: true,
      geburtstag: geburtstag,
      mehrlinge: false,
      behindertesGeschwisterkind: false,
    });

    expect(elternteile.remainingMonths.basiselterngeld).toBe(15);
  });

  it("should allow 14 Month of Basiselterngeld if the birth was at least 8 weeks earlier than expected", () => {
    const dateOfBirth = expectedDateOfBirth.minus({ weeks: 8 });

    const geburtstag: Geburtstag = {
      geburt: dateOfBirth.toISO() as string,
      errechnet: expectedDateOfBirth.toISO() as string,
    };

    const elternteile = createElternteile({
      geburtstag,
      mehrlinge: false,
      behindertesGeschwisterkind: false,
    });

    expect(elternteile.remainingMonths.basiselterngeld).toBe(14);
  });

  it("should allow 15 Month of Basiselterngeld if the birth was at least 12 weeks earlier than expected", () => {
    const dateOfBirth = expectedDateOfBirth.minus({ weeks: 12 });

    const geburtstag: Geburtstag = {
      geburt: dateOfBirth.toISO() as string,
      errechnet: expectedDateOfBirth.toISO() as string,
    };

    const elternteile = createElternteile({
      geburtstag,
      mehrlinge: false,
      behindertesGeschwisterkind: false,
    });

    expect(elternteile.remainingMonths.basiselterngeld).toBe(15);
  });

  it("should allow 16 Month of Basiselterngeld if the birth was at least 16 weeks earlier than expected", () => {
    const dateOfBirth = expectedDateOfBirth.minus({ weeks: 16 });

    const geburtstag: Geburtstag = {
      geburt: dateOfBirth.toISO() as string,
      errechnet: expectedDateOfBirth.toISO() as string,
    };
    const elternteile = createElternteile({
      geburtstag,
      mehrlinge: false,
      behindertesGeschwisterkind: false,
    });

    expect(elternteile.remainingMonths.basiselterngeld).toBe(16);
  });

  it("should allow 2 times the amount of Basiselterngeld to be used as Elterngeld+", () => {
    const elternteile = createElternteile();

    expect(elternteile.remainingMonths.elterngeldplus).toBe(24);
  });

  it("should allow 2 times the amount of Basiselterngeld to be used as Elterngeld+ for Partnermonate", () => {
    const elternteile = createElternteile({
      partnerMonate: true,
      mehrlinge: false,
      behindertesGeschwisterkind: false,
    });

    expect(elternteile.remainingMonths.elterngeldplus).toBe(28);
  });

  it("should set the month where Elternteil does get Mutterschutz to BEG", () => {
    const dateOfBirth = "2022-07-01T00:00:00Z";
    const mutterschutzEndDate = "2022-09-13T00:00:00Z";
    const mutterschutz: MutterschutzSettings = {
      elternteil: "ET1",
      endDate: mutterschutzEndDate,
    };
    const geburtstag: Geburtstag = {
      geburt: dateOfBirth,
      errechnet: dateOfBirth,
    };

    const elternteile = createElternteile({
      geburtstag,
      mutterschutz,
      mehrlinge: false,
      behindertesGeschwisterkind: false,
    });

    expect(elternteile.ET1.months[0].type).toBe("BEG");
    expect(elternteile.ET1.months[1].type).toBe("BEG");
    expect(elternteile.ET1.months[2].type).toBe("BEG");
    expect(elternteile.ET1.months[3].type).not.toBe("BEG");
    expect(elternteile.remainingMonths.basiselterngeld).toBe(9);
  });
});
