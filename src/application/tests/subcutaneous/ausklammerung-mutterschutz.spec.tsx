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
  vi.setSystemTime(new Date("2026-02-20"));
});

afterEach(() => {
  vi.useRealTimers();
});

/*
 * Ausgangslage: Ein Paar plant gemeinsam Elterngeld für ein Kind (geboren
 * am 13.02.2026). Ein älteres Geschwisterkind (geboren am 24.05.2024, ohne
 * Behinderung) begründet den Anspruch auf den Geschwisterbonus
 * (§ 2a Abs. 1 Satz 1 Nr. 1 BEEG).
 *
 * Beide Personen sind angestellt mit je 3.000 € brutto im Monat, gesetzlich
 * sozialversichert, nicht kirchensteuerpflichtig. Person 1 (Steuerklasse III)
 * war vor der Geburt im Mutterschutz, Person 2 (Steuerklasse V) nicht.
 *
 * Für das ältere Geschwisterkind war Person 1 vom 24.03.2024 bis 23.07.2024
 * im Mutterschutz. Dieser Zeitraum überschneidet sich mit dem
 * Bemessungszeitraum und wird ausgeklammert (§ 2b Abs. 1 Satz 2 BEEG),
 * sodass das Einkommen aus früheren Monaten herangezogen wird.
 *
 * Der Geschwisterbonus erhöht das Elterngeld um 10 %, mindestens 75 €
 * (§ 2a Abs. 1 BEEG). Die ersten zwei Lebensmonate von Person 1 sind
 * wegen des Mutterschutzes blockiert (§ 3 BEEG).
 */
test("Ausklammerung Mutterschutz älteres Kind: Geschwisterbonus bei ausgeklammertem Mutterschutz-Zeitraum (§§ 2a, 2b BEEG)", async () => {
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
    "Sachsen",
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
    "07.02.2026",
  );
  await user.type(
    screen.getByLabelText("Geburtsdatum (TT.MM.JJJJ)"),
    "13.02.2026",
  );
  await user.type(screen.getByLabelText("Anzahl der Kinder"), "1");
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Geschwisterkinder: eins vorhanden
  await user.click(await screen.findByTestId("istVorhanden_option_0")); // Ja
  await user.click(screen.getByRole("button", { name: "Weiter" }));
  await user.type(await screen.findByLabelText("Anzahl Geschwister"), "1");
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Geschwisterkind 1: geboren 24.05.2024, keine Behinderung
  await user.type(
    await screen.findByLabelText("Geburtsdatum (TT.MM.JJJJ)"),
    "24.05.2024",
  );
  await user.click(screen.getByTestId("hatBehinderung_option_1")); // Nein
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
    await screen.findByTestId("wirdZweitePersonBeruecksichtigt_option_0"), // beide
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Ausklammerungs-Sequenz Person 1 (im Mutterschutz, ein relevantes
  // Geschwisterkind): Erkrankung -> Elternzeit -> Mutterschutz -> Zeiten.

  // Erkrankung wegen Schwangerschaft: Nein
  await user.click(
    await screen.findByTestId("hatSchwangerschaftsbedingteErkrankung_option_1"),
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Elterngeld älteres Kind (Elternzeit): Nein
  await user.click(
    await screen.findByTestId("hatElterngeldGeschwisterkind_option_1"),
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Mutterschutz älteres Kind: Ja
  await user.click(
    await screen.findByTestId("hatMutterschutzGeschwisterkind_option_0"),
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Mutterschutz-Zeiten: 24.03.2024 bis 23.07.2024
  await user.type(
    await screen.findByLabelText("Beginn des Mutterschutzes (TT.MM.JJJJ)"),
    "24.03.2024",
  );
  await user.type(
    screen.getByLabelText("Ende des Mutterschutzes (TT.MM.JJJJ)"),
    "23.07.2024",
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

  // Tätigkeit Person 1: Sozialversicherungen + Steuerklasse III
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

  // Person 2 war nicht im Mutterschutz, daher entfällt die Erkrankungs- und
  // die Mutterschutz-Abfrage. Es bleibt nur die Elternzeit-Abfrage für das
  // relevante Geschwisterkind: Nein.
  await user.click(
    await screen.findByTestId("hatElterngeldGeschwisterkind_option_1"),
  );
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

  // Tätigkeit Person 2: Sozialversicherungen + Steuerklasse V
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

  // Weitere Tätigkeiten Person 2? -> DONE
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

  // Person 1: 3.000 € brutto + Geschwisterbonus
  expect(berechneElterngeldbezuege(Elternteil.Eins, plan)).toEqual(
    expect.objectContaining({
      "2": 1587.91,
      "4": 793.96,
    }),
  );

  // Person 2: 3.000 € brutto + Geschwisterbonus (1.059 € × 1,1 = 1.164 €).
  expect(berechneElterngeldbezuege(Elternteil.Zwei, plan)).toEqual(
    expect.objectContaining({
      "2": 1164.38,
      "4": 582.2,
    }),
  );

  const erstelleAusgangslage = useErstelleAusgangslage();

  // Mutterschutz Person 1 blockiert die ersten zwei Lebensmonate (§ 3 BEEG).
  expect(erstelleAusgangslage().informationenZumMutterschutz).toEqual({
    empfaenger: Elternteil.Eins,
    letzterLebensmonatMitSchutz: 2,
  });
});
