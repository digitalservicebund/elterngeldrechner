import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { Elternteil, Lebensmonatszahl, Monat, Variante } from "@/monatsplaner";
import { useBerechneElterngeldbezuege, useRender } from "./testHooks";

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2025-12-20"));
});

afterEach(() => {
  vi.useRealTimers();
});

/*
 * Ausgangslage: Ein Paar plant gemeinsam Elterngeld für ein Kind (geboren
 * am 24.12.2025); keine der planenden Personen ist dafür im Mutterschutz.
 * Zwei ältere Geschwisterkinder (geboren am 24.12.2024 und 24.12.2023,
 * beide unter sechs Jahren) begründen den Anspruch auf den Geschwisterbonus
 * (§ 2a Abs. 1 Satz 1 Nr. 2 BEEG).
 *
 * Person 1 (Steuerklasse III) ist angestellt mit 3.000 € brutto im Monat.
 * Person 2 ist selbstständig mit 20.000 € Jahresgewinn. Für beide ältere
 * Kinder haben die Personen Elterngeld bzw. Mutterschutz bezogen; diese
 * Zeiträume überschneiden sich mit dem Bemessungszeitraum und werden
 * ausgeklammert (§ 2b Abs. 1 BEEG).
 */
test("Ausklammerung ohne Mutterschutz: selbstständige Person 2 wird eingebunden, Abfrageteil läuft durch (§ 2b BEEG)", async () => {
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
    "Berlin",
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

  // Geschwisterkinder: zwei vorhanden
  await user.click(await screen.findByTestId("istVorhanden_option_0")); // Ja
  await user.click(screen.getByRole("button", { name: "Weiter" }));
  await user.type(await screen.findByLabelText("Anzahl Geschwister"), "2");
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Geschwisterkind 0: geboren 24.12.2024, keine Behinderung.
  await screen.findByRole("heading", {
    name: "Wann wurde Geschwisterkind 1 geboren?",
  });
  await user.type(
    screen.getByLabelText("Geburtsdatum (TT.MM.JJJJ)"),
    "24.12.2024",
  );
  await user.click(screen.getByTestId("hatBehinderung_option_1")); // Nein
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Geschwisterkind 1: geboren 24.12.2023, keine Behinderung
  await screen.findByRole("heading", {
    name: "Wann wurde Geschwisterkind 2 geboren?",
  });
  await user.type(
    screen.getByLabelText("Geburtsdatum (TT.MM.JJJJ)"),
    "24.12.2023",
  );
  await user.click(screen.getByTestId("hatBehinderung_option_1")); // Nein
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Geschwisterbonus-Übersicht
  await user.click(
    await screen.findByRole("button", { name: "Verstanden und weiter" }),
  );

  // Angaben Person 1: kein Mutterschutz
  await user.type(await screen.findByLabelText("Vorname Person 1"), "Person 1");
  await user.click(screen.getByTestId("istAlleinerziehend_option_1")); // Nein
  await user.click(screen.getByTestId("istImMutterschutz_option_1")); // Nein
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Gemeinsame Planung: beide
  await user.click(
    await screen.findByTestId("wirdZweitePersonBeruecksichtigt_option_0"),
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // --- Ausklammerung Person 1 ---
  // Erkrankung wegen Schwangerschaft: Nein
  await user.click(
    await screen.findByTestId("hatSchwangerschaftsbedingteErkrankung_option_1"),
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Geschwisterkind 0: Elterngeld bezogen (01.03.2025 - 01.11.2025)
  await user.click(
    await screen.findByTestId("hatElterngeldGeschwisterkind_option_0"), // Ja
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));
  await user.type(
    await screen.findByLabelText("Von (TT.MM.JJJJ)"),
    "01.03.2025",
  );
  await user.type(screen.getByLabelText("Bis (TT.MM.JJJJ)"), "01.11.2025");
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Geschwisterkind 0: Mutterschutz (12.11.2024 - 18.02.2025)
  await user.click(
    await screen.findByTestId("hatMutterschutzGeschwisterkind_option_0"), // Ja
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));
  await user.type(
    await screen.findByLabelText("Beginn des Mutterschutzes (TT.MM.JJJJ)"),
    "12.11.2024",
  );
  await user.type(
    screen.getByLabelText("Ende des Mutterschutzes (TT.MM.JJJJ)"),
    "18.02.2025",
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Geschwisterkind 1: Elterngeld bezogen (01.03.2024 - 01.11.2024)
  await user.click(
    await screen.findByTestId("hatElterngeldGeschwisterkind_option_0"), // Ja
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));
  await user.type(
    await screen.findByLabelText("Von (TT.MM.JJJJ)"),
    "01.03.2024",
  );
  await user.type(screen.getByLabelText("Bis (TT.MM.JJJJ)"), "01.11.2024");
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Geschwisterkind 1: Mutterschutz (12.11.2023 - 18.02.2024)
  await user.click(
    await screen.findByTestId("hatMutterschutzGeschwisterkind_option_0"), // Ja
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));
  await user.type(
    await screen.findByLabelText("Beginn des Mutterschutzes (TT.MM.JJJJ)"),
    "12.11.2023",
  );
  await user.type(
    screen.getByLabelText("Ende des Mutterschutzes (TT.MM.JJJJ)"),
    "18.02.2024",
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Finanzielle Situation Person 1: Tätigkeiten (angestellt)
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

  // Angaben Person 2: kein Mutterschutz
  await user.type(await screen.findByLabelText("Vorname Person 2"), "Person 2");
  await user.click(screen.getByTestId("istImMutterschutz_option_1")); // Nein
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // --- Ausklammerung Person 2 (nur Elternzeit je Geschwisterkind) ---
  // Erkrankung wegen Schwangerschaft: Nein
  await user.click(
    await screen.findByTestId("hatSchwangerschaftsbedingteErkrankung_option_1"),
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Geschwisterkind 0: Elterngeld bezogen (01.03.2025 - 01.11.2025)
  await user.click(
    await screen.findByTestId("hatElterngeldGeschwisterkind_option_0"), // Ja
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));
  await user.type(
    await screen.findByLabelText("Von (TT.MM.JJJJ)"),
    "01.03.2025",
  );
  await user.type(screen.getByLabelText("Bis (TT.MM.JJJJ)"), "01.11.2025");
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Geschwisterkind 1: Elterngeld bezogen (01.03.2024 - 01.11.2024)
  await user.click(
    await screen.findByTestId("hatElterngeldGeschwisterkind_option_0"), // Ja
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));
  await user.type(
    await screen.findByLabelText("Von (TT.MM.JJJJ)"),
    "01.03.2024",
  );
  await user.type(screen.getByLabelText("Bis (TT.MM.JJJJ)"), "01.11.2024");
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Finanzielle Situation Person 2: Tätigkeiten (selbstständig)
  await user.click(
    await screen.findByRole("checkbox", {
      name: "Person 2 war oder ist selbstständig",
    }),
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Bemessungszeitraum-Übersicht Person 2
  await user.click(
    await screen.findByRole("button", { name: "Verstanden und weiter" }),
  );

  // Tätigkeit Person 2: selbstständig, 20.000 € Jahresgewinn
  await user.click(
    await screen.findByTestId("istKirchensteuerpflichtig_option_1"), // Nein
  );
  await user.click(
    screen.getByTestId("istGesetzlichKrankenpflichtversichert_option_0"), // Ja
  );
  await user.click(
    screen.getByTestId("istGesetzlichRentenversichert_option_1"),
  ); // Nein
  await user.click(
    screen.getByTestId("istGesetzlichArbeitlosenversichert_option_1"), // Nein
  );
  await user.type(
    screen.getByLabelText("Brutto-Gewinn im gesamten Kalenderjahr"),
    "20000",
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Weitere Tätigkeiten Person 2? -> DONE
  await user.click(
    await screen.findByTestId("istWeitereTaetigkeitVorhanden_option_1"), // Nein
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Der Abfrageteil läuft vollständig durch: Person 2 wurde eingebunden.
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

  // Person 2: selbstständig (20.000 €/Jahr), mit Geschwisterbonus (+10 %)
  expect(berechneElterngeldbezuege(Elternteil.Zwei, plan)).toEqual(
    expect.objectContaining({
      "2": 1040.28,
      "4": 520.15,
    }),
  );
});
