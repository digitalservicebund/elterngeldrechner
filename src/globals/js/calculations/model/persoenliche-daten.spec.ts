import { ErwerbsArt } from "./erwerbs-art";
import { PersoenlicheDaten } from "./persoenliche-daten";
import { YesNo } from "./yes-no";

describe("persoenliche-daten", () => {
  it("should create persoenliche daten with defaults", () => {
    // given
    const geburtsDatum = new Date("2006-09-08T10:37:00.000Z");

    // when
    const persoenlicheDaten = new PersoenlicheDaten(geburtsDatum);

    // then
    expect(persoenlicheDaten.kinder.length).toBe(1);
    expect(persoenlicheDaten.kinder[0].nummer).toBe(1);
    expect(persoenlicheDaten.kinder[0].istBehindert).toBe(false);
    expect(persoenlicheDaten.kinder[0].geburtsdatum).toBeUndefined();
    expect(persoenlicheDaten.wahrscheinlichesGeburtsDatum?.toISOString()).toBe(
      geburtsDatum.toISOString(),
    );
    expect(persoenlicheDaten.anzahlKuenftigerKinder).toBe(1);
    expect(persoenlicheDaten.etVorGeburt).toBe(
      ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI,
    );
    expect(persoenlicheDaten.isETVorGeburt()).toBe(true);
    expect(persoenlicheDaten.etNachGeburt).toBe(YesNo.NO);
    expect(persoenlicheDaten.isETNachGeburt()).toBe(false);
  });

  // birthdate of "" will be set to undefined in kind-util - means future child
  describe.each([
    [[], 0],
    [
      [
        "2006-09-08T10:37:00.000Z",
        "1995-02-24T03:24:00.000Z",
        "1994-01-12T10:25:00.000Z",
      ],
      3,
    ],
    [["2006-09-08T10:37:00.000Z", "", "1994-01-12T10:25:00.000Z"], 2],
  ])("when children birthdays are %p", (birthdayList, anzahlGeschwister) => {
    it("should check anzahl Geschwister", () => {
      // given
      const persoenlicheDaten = new PersoenlicheDaten(
        new Date("2022-01-01T10:37:00.000Z"),
      );

      // when
      persoenlicheDaten.kinder = birthdayList.map((value, index) => {
        return {
          nummer: index + 1,
          geburtsdatum: value === "" ? undefined : new Date(value),
          istBehindert: false,
        };
      });

      // then
      expect(persoenlicheDaten.wahrscheinlichesGeburtsDatum.toISOString()).toBe(
        "2022-01-01T10:37:00.000Z",
      );
      expect(persoenlicheDaten.kinder.length).toBe(birthdayList.length);
      expect(persoenlicheDaten.getAnzahlGeschwister()).toBe(anzahlGeschwister);
    });
  });
});
