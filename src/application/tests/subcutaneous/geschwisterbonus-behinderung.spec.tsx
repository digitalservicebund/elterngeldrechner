import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { Elternteil, Lebensmonatszahl, Monat, Variante } from "@/monatsplaner";
import {
  useBerechneElterngeldbezuege,
  useErstelleAusgangslage,
  useRender,
} from "./testHooks";

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2025-12-30"));
});

afterEach(() => {
  vi.useRealTimers();
});

/*
 * Ausgangslage: Ein Paar plant gemeinsam Elterngeld für das jüngste Kind
 * (geboren am 24.12.2025). Es gibt ein älteres Geschwisterkind (geboren am
 * 24.12.2014) mit Behinderung.
 *
 * Beide sind angestellt mit je 3.000 € brutto im Monat, gesetzlich
 * sozialversichert, nicht kirchensteuerpflichtig. Person 1 (Steuerklasse III)
 * war vor der Geburt im Mutterschutz, Person 2 (Steuerklasse V) nicht.
 *
 * Für ein Geschwisterkind mit Behinderung gilt beim Geschwisterbonus die
 * Altersgrenze von 14 Jahren (§ 2a Abs. 1 Satz 1 Nr. 2 BEEG). Das elf Jahre
 * alte Geschwisterkind begründet daher den Anspruch: das Elterngeld steigt
 * um 10 %. Die ersten zwei Lebensmonate von Person 1 sind wegen des
 * Mutterschutzes blockiert (§ 3 BEEG).
 */
test("Geschwisterbonus bei Geschwisterkind mit Behinderung: Altersgrenze 14 Jahre (§ 2a BEEG)", async () => {
  const user = userEvent.setup();

  const render = useRender();

  const { unmount } = render();

  // Startseite
  await user.click(
    await screen.findByRole("button", { name: "Verstanden und weiter" }),
  );

  // Allgemeine Angaben
  await user.selectOptions(
    await screen.findByLabelText("Bundesland"),
    "Thüringen",
  );
  await user.click(
    screen.getByTestId("gesamteinkommenGrenzeUeberschritten_option_1"), // Nein
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Kind
  await user.click(await screen.findByTestId("istGeboren_option_0")); // Ja
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Angaben zur Geburt
  await user.type(
    await screen.findByLabelText("Errechneter Entbindungstermin (TT.MM.JJJJ)"),
    "24.12.2025",
  );
  await user.type(
    screen.getByLabelText("Geburtsdatum (TT.MM.JJJJ)"),
    "24.12.2025",
  );
  await user.type(screen.getByLabelText("Anzahl der Kinder"), "1");
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Geschwisterkinder: vorhanden
  await user.click(await screen.findByTestId("istVorhanden_option_0")); // Ja
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Anzahl der Geschwisterkinder
  await user.type(await screen.findByLabelText("Anzahl Geschwister"), "1");
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Angaben zum Geschwisterkind
  await user.type(
    await screen.findByLabelText("Geburtsdatum (TT.MM.JJJJ)"),
    "24.12.2014",
  );
  await user.click(screen.getByTestId("hatBehinderung_option_0")); // Ja
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Geschwisterbonus-Übersicht
  await user.click(
    await screen.findByRole("button", { name: "Verstanden und weiter" }),
  );

  // Angaben Person 1
  await user.type(await screen.findByLabelText("Vorname Person 1"), "Person 1");
  await user.click(screen.getByTestId("istAlleinerziehend_option_1")); // Nein
  await user.click(screen.getByTestId("istImMutterschutz_option_0")); // Ja
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Gemeinsame Planung
  await user.click(
    await screen.findByTestId("wirdZweitePersonBeruecksichtigt_option_0"), // Ja, beide
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Ausklammerung: Erkrankung wegen Schwangerschaft (Person 1)
  await user.click(
    await screen.findByTestId("hatSchwangerschaftsbedingteErkrankung_option_1"), // Nein
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Finanzielle Situation Person 1: Tätigkeiten
  await user.click(
    await screen.findByRole("checkbox", {
      name: "Person 1 war oder ist angestellt",
    }),
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Bemessungszeitraum-Übersicht Person 1
  await user.click(
    await screen.findByRole("button", { name: "Verstanden und weiter" }),
  );

  // Tätigkeit Person 1: Minijob?
  await user.click(await screen.findByTestId("istTaetigkeitMinijob_option_1")); // Nein
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Tätigkeit Person 1: Sozialversicherungen + Steuerklasse
  await user.selectOptions(
    await screen.findByLabelText("Steuerklasse"),
    screen.getByRole("option", { name: "3" }),
  );
  await user.click(screen.getByTestId("istKirchensteuerpflichtig_option_1")); // Nein
  await user.click(
    screen.getByTestId("istGesetzlichKrankenpflichtversichert_option_0"), // Ja
  );
  await user.click(
    screen.getByTestId("istGesetzlichRentenversichert_option_0"),
  ); // Ja
  await user.click(
    screen.getByTestId("istGesetzlichArbeitlosenversichert_option_0"), // Ja
  );
  await user.click(screen.getByTestId("istEinkommenGleichVerteilt_option_0")); // Ja
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Tätigkeit Person 1: Einkommen
  await user.type(
    await screen.findByLabelText("Monatliches Brutto-Einkommen"),
    "3000",
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Weitere Tätigkeiten Person 1?
  await user.click(
    await screen.findByTestId("istWeitereTaetigkeitVorhanden_option_1"), // Nein
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Angaben Person 2 (kein Mutterschutz-Feld, da Person 1 im Mutterschutz war)
  await user.type(await screen.findByLabelText("Vorname Person 2"), "Person 2");
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Finanzielle Situation Person 2: Tätigkeiten
  await user.click(
    await screen.findByRole("checkbox", {
      name: "Person 2 war oder ist angestellt",
    }),
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Bemessungszeitraum-Übersicht Person 2
  await user.click(
    await screen.findByRole("button", { name: "Verstanden und weiter" }),
  );

  // Tätigkeit Person 2: Minijob?
  await user.click(await screen.findByTestId("istTaetigkeitMinijob_option_1")); // Nein
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Tätigkeit Person 2: Sozialversicherungen + Steuerklasse
  await user.selectOptions(
    await screen.findByLabelText("Steuerklasse"),
    screen.getByRole("option", { name: "5" }),
  );
  await user.click(screen.getByTestId("istKirchensteuerpflichtig_option_1")); // Nein
  await user.click(
    screen.getByTestId("istGesetzlichKrankenpflichtversichert_option_0"), // Ja
  );
  await user.click(
    screen.getByTestId("istGesetzlichRentenversichert_option_0"),
  ); // Ja
  await user.click(
    screen.getByTestId("istGesetzlichArbeitlosenversichert_option_0"), // Ja
  );
  await user.click(screen.getByTestId("istEinkommenGleichVerteilt_option_0")); // Ja
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Tätigkeit Person 2: Einkommen
  await user.type(
    await screen.findByLabelText("Monatliches Brutto-Einkommen"),
    "3000",
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Weitere Tätigkeiten Person 2? -> DONE, Abfrageteil ist durchlaufen
  await user.click(
    await screen.findByTestId("istWeitereTaetigkeitVorhanden_option_1"), // Nein
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  expect(
    await screen.findByText("Wollen Sie einen Vorschlag für Ihre Planung?"),
  ).toBeVisible();

  unmount();

  const berechneElterngeldbezuege = useBerechneElterngeldbezuege();

  const plan: Readonly<Partial<Record<Lebensmonatszahl, Monat>>> = {
    2: { gewaehlteOption: Variante.Basis, imMutterschutz: false },
    4: { gewaehlteOption: Variante.Plus, imMutterschutz: false },
  };

  // Person 1: 3.000 € brutto, Steuerklasse III, mit Geschwisterbonus (+10 %)
  expect(berechneElterngeldbezuege(Elternteil.Eins, plan)).toEqual(
    expect.objectContaining({
      "2": 1575.63,
      "4": 787.82,
    }),
  );

  // Person 2: 3.000 € brutto, Steuerklasse V, mit Geschwisterbonus (+10 %)
  expect(berechneElterngeldbezuege(Elternteil.Zwei, plan)).toEqual(
    expect.objectContaining({
      "2": 1156.05,
      "4": 578.03,
    }),
  );

  const erstelleAusgangslage = useErstelleAusgangslage();

  // Die ersten zwei Lebensmonate von Person 1 sind wegen Mutterschutz blockiert
  expect(erstelleAusgangslage().informationenZumMutterschutz).toEqual({
    empfaenger: Elternteil.Eins,
    letzterLebensmonatMitSchutz: 2,
  });
});
