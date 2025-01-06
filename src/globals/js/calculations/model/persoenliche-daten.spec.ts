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
    expect(persoenlicheDaten.geschwister.length).toBe(0);
    expect(persoenlicheDaten.wahrscheinlichesGeburtsDatum?.toISOString()).toBe(
      geburtsDatum.toISOString(),
    );
    expect(persoenlicheDaten.anzahlKuenftigerKinder).toBe(1);
    expect(persoenlicheDaten.etVorGeburt).toBe(
      ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI,
    );
    expect(persoenlicheDaten.etNachGeburt).toBe(YesNo.NO);
  });
});
