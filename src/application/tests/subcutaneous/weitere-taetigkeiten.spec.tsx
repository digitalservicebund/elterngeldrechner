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
 * Ausgangslage: Nur eine Person plant Elterngeld für das erste Kind, kein
 * Mutterschutz.
 *
 * Person 1 hatte im Bemessungszeitraum drei Tätigkeiten: zwei selbstständige
 * (20.000 € und 10.000 € Jahresgewinn) und eine angestellte (1.000 € brutto
 * im Monat). Nach jeder Tätigkeit fragt der Rechner „Weitere Tätigkeit?" und
 * anschließend deren Art (angestellt oder selbstständig).
 *
 * Alle Erwerbseinkünfte fließen in die Bemessung ein (§ 2 Abs. 1, § 2d BEEG);
 * die selbstständigen Einkünfte verschieben den Bemessungszeitraum auf das
 * letzte Kalenderjahr (§ 2b Abs. 2, 3 BEEG).
 */
test("Weitere Tätigkeiten: mehrere selbstständige und angestellte Tätigkeiten je Person (§ 2d BEEG)", async () => {
  const user = userEvent.setup();

  const render = useRender();

  const { unmount } = render();

  const weiter = () =>
    user.click(screen.getByRole("button", { name: "Weiter" }));

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
  await weiter();

  // Kind
  await user.click(await screen.findByTestId("istGeboren_option_0")); // Ja
  await weiter();

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
  await weiter();

  // Geschwisterkinder: keine
  await user.click(await screen.findByTestId("istVorhanden_option_1")); // Nein
  await weiter();

  // Angaben Person 1
  await user.type(await screen.findByLabelText("Vorname Person 1"), "Person 1");
  await user.click(screen.getByTestId("istAlleinerziehend_option_1")); // Nein
  await user.click(screen.getByTestId("istImMutterschutz_option_1")); // Nein
  await weiter();

  // Gemeinsame Planung: nur eine Person
  await user.click(
    await screen.findByTestId("wirdZweitePersonBeruecksichtigt_option_1"),
  );
  await weiter();

  // Ausklammerung: Erkrankung wegen Schwangerschaft -> Nein
  await user.click(
    await screen.findByTestId("hatSchwangerschaftsbedingteErkrankung_option_1"),
  );
  await weiter();

  // Finanzielle Situation Person 1: selbstständig
  await user.click(
    await screen.findByRole("checkbox", {
      name: "Person 1 war oder ist selbstständig",
    }),
  );
  await weiter();

  // Bemessungszeitraum-Übersicht Person 1
  await user.click(
    await screen.findByRole("button", { name: "Verstanden und weiter" }),
  );

  // Tätigkeit 1 (selbstständig): 20.000 € Jahresgewinn
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
  await weiter();

  // Weitere Tätigkeit? Ja -> Art-Abfrage
  await user.click(
    await screen.findByTestId("istWeitereTaetigkeitVorhanden_option_0"), // Ja
  );
  await weiter();

  // Art der weiteren Tätigkeit: selbstständig
  await user.click(
    await screen.findByTestId(
      "istWeitereTaetigkeitSelbststaendigeTaetigkeit_option_1", // selbstständig
    ),
  );
  await weiter();

  // Tätigkeit 2 (selbstständig): 10.000 € Jahresgewinn
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
    "10000",
  );
  await weiter();

  // Weitere Tätigkeit? Ja -> Art-Abfrage
  await user.click(
    await screen.findByTestId("istWeitereTaetigkeitVorhanden_option_0"), // Ja
  );
  await weiter();

  // Art der weiteren Tätigkeit: angestellt
  await user.click(
    await screen.findByTestId(
      "istWeitereTaetigkeitSelbststaendigeTaetigkeit_option_0", // angestellt
    ),
  );
  await weiter();

  // Tätigkeit 3 (angestellt): Minijob?
  await user.click(await screen.findByTestId("istTaetigkeitMinijob_option_1")); // Nein
  await weiter();

  // Tätigkeit 3: Sozialversicherungen + Steuerklasse III
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
  await weiter();

  // Tätigkeit 3: Einkommen
  await user.type(
    await screen.findByLabelText("Monatliches Brutto-Einkommen"),
    "1000",
  );
  await weiter();

  // Weitere Tätigkeit? -> DONE
  await user.click(
    await screen.findByTestId("istWeitereTaetigkeitVorhanden_option_1"), // Nein
  );
  await weiter();

  expect(
    await screen.findByText("Wollen Sie einen Vorschlag für Ihre Planung?"),
  ).toBeVisible();

  unmount();

  const berechneElterngeldbezuege = useBerechneElterngeldbezuege();

  const plan: Readonly<Partial<Record<Lebensmonatszahl, Monat>>> = {
    2: { gewaehlteOption: Variante.Basis, imMutterschutz: false },
    4: { gewaehlteOption: Variante.Plus, imMutterschutz: false },
  };

  // Drei Tätigkeiten kombiniert (Charakterisierung)
  expect(berechneElterngeldbezuege(Elternteil.Eins, plan)).toEqual(
    expect.objectContaining({
      "2": 1501.59,
      "4": 750.8,
    }),
  );
});
