import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { Elternteil, Lebensmonatszahl, Monat, Variante } from "@/monatsplaner";
import { useBerechneElterngeldbezuege, useRender } from "./testHooks";

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-03-10"));
});

afterEach(() => {
  vi.useRealTimers();
});

/*
 * Ausgangslage: Eine Person plant allein Elterngeld für das erste Kind, ohne
 * Mutterschutz. Person 1 hat alle drei Tätigkeitsarten gleichzeitig: eine
 * sozialversicherungspflichtige Anstellung mit 1.500 € brutto im Monat
 * (Steuerklasse III), einen Minijob mit 350 € im Monat und eine
 * selbstständige Tätigkeit mit 6.000 € Gewinn im gesamten Kalenderjahr.
 * Bewusst niedriger angesetzt als die einzelnen Referenzszenarien, damit die
 * Summe unter dem Höchstbetrag von 1.800 € bleibt (§ 2 Abs. 1 Satz 2 BEEG) —
 * sonst würde eine Regression in der Kombination der drei Einkommensarten
 * durch die Deckelung verdeckt.
 *
 * Referenzszenario für die Umstellung auf den neuen Einkommensfluss (siehe
 * ElternteilTaetigkeitenAbfragePageNew): friert das Ergebnis für "alle drei
 * Tätigkeitsarten kombiniert" ein, um es später gegen den neuen Fluss zu
 * vergleichen.
 */
test("Tätigkeitsarten: alle drei Tätigkeitsarten kombiniert", async () => {
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
    "Bayern",
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
    "01.03.2026",
  );
  await user.type(
    screen.getByLabelText("Geburtsdatum (TT.MM.JJJJ)"),
    "06.03.2026",
  );
  await user.type(screen.getByLabelText("Anzahl der Kinder"), "1");
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Geschwisterkinder: keine
  await user.click(await screen.findByTestId("istVorhanden_option_1")); // Nein
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Angaben Person 1: kein Mutterschutz
  await user.type(await screen.findByLabelText("Vorname Person 1"), "Person 1");
  await user.click(screen.getByTestId("istAlleinerziehend_option_1")); // Nein
  await user.click(screen.getByTestId("istImMutterschutz_option_1")); // Nein
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Gemeinsame Planung: nur ein Elternteil
  await user.click(
    await screen.findByTestId("wirdZweitePersonBeruecksichtigt_option_1"),
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Ausklammerung: Erkrankung wegen Schwangerschaft -> Nein
  await user.click(
    await screen.findByTestId("hatSchwangerschaftsbedingteErkrankung_option_1"),
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Finanzielle Situation Person 1: angestellt (deckt sowohl die reguläre
  // Anstellung als auch den Minijob ab) + selbstständig
  await user.click(
    await screen.findByRole("checkbox", {
      name: "Person 1 war oder ist angestellt",
    }),
  );
  await user.click(
    screen.getByRole("checkbox", {
      name: "Person 1 war oder ist selbstständig",
    }),
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Bemessungszeitraum-Übersicht Person 1
  await user.click(
    await screen.findByRole("button", { name: "Verstanden und weiter" }),
  );

  // Tätigkeit 1 Person 1 (angestellt): Minijob?
  await user.click(await screen.findByTestId("istTaetigkeitMinijob_option_1")); // Nein
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Tätigkeit 1 Person 1: Sozialversicherungen + Steuerklasse III
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

  // Tätigkeit 1 Person 1: Einkommen angestellt
  await user.type(
    await screen.findByLabelText("Monatliches Brutto-Einkommen"),
    "1500",
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Tätigkeit 2 Person 1: selbstständig, 6.000 € Jahresgewinn (folgt direkt
  // auf Tätigkeit 1, da beide Checkboxen bereits automatische Tätigkeits-
  // Slots erzeugt haben; kein Minijob-Zwischenschritt für Selbstständige)
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
    "6000",
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Weitere Tätigkeiten Person 1? Ja (Minijob, zusätzlich zur Anstellung)
  await user.click(
    await screen.findByTestId("istWeitereTaetigkeitVorhanden_option_0"), // Ja
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Um was handelt es sich bei der weiteren Tätigkeit? -> angestellt
  await user.click(
    await screen.findByTestId(
      "istWeitereTaetigkeitSelbststaendigeTaetigkeit_option_0",
    ), // Nein, angestellt
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Tätigkeit 3 Person 1 (angestellt): Minijob?
  await user.click(await screen.findByTestId("istTaetigkeitMinijob_option_0")); // Ja
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Tätigkeit 3 Person 1 (Minijob): Einkommen gleich verteilt?
  await user.click(
    await screen.findByTestId("istEinkommenGleichVerteilt_option_0"), // Ja
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Tätigkeit 3 Person 1: Einkommen Minijob
  await user.type(
    await screen.findByLabelText("Monatliches Brutto-Einkommen"),
    "350",
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Weitere Tätigkeiten Person 1? -> DONE
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

  // Person 1: angestellt (1.500 €) + Minijob (350 €) + selbstständig
  // (6.000 €/Jahr), unter dem Höchstbetrag von 1.800 €
  expect(berechneElterngeldbezuege(Elternteil.Eins, plan)).toEqual(
    expect.objectContaining({
      "2": 1196.25,
      "4": 598.13,
    }),
  );
});
