import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { Elternteil, Lebensmonatszahl, Monat, Variante } from "@/monatsplaner";
import { useBerechneElterngeldbezuege, useRender } from "./testHooks";

vi.mock("@/application/feature-flags", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/application/feature-flags")>();
  return { ...actual, isNewIncomeFlowEnabled: () => true };
});

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-03-10"));
});

afterEach(() => {
  vi.useRealTimers();
});

/*
 * Gegenstück zu taetigkeitsarten-alle-drei.spec.tsx im neuen Einkommensflow
 * (ElternteilTaetigkeitenAbfragePageNew): gleiche Ausgangslage und gleiche
 * Einkommensangaben, aber über die dedizierten Angestellt-/Minijob-/
 * Selbstständig-Unterseiten statt über die bisherige Tätigkeiten-Abfrage.
 * Erwartet dieselben Elterngeldbezüge wie das alte Referenzszenario, um
 * Flow-Parität nachzuweisen.
 */
test("Tätigkeitsarten (neuer Einkommensflow): alle drei Tätigkeitsarten kombiniert", async () => {
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

  // Finanzielle Situation Person 1: alle drei Tätigkeitsarten über die
  // dedizierten Checkboxen des neuen Flusses (inklusive eigener
  // Minijob-Checkbox)
  await user.click(
    await screen.findByRole("checkbox", { name: "Person 1 war angestellt" }),
  );
  await user.click(
    screen.getByRole("checkbox", { name: "Person 1 hatte einen Minijob" }),
  );
  await user.click(
    screen.getByRole("checkbox", { name: "Person 1 war selbstständig" }),
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Bemessungszeitraum-Übersicht Person 1
  await user.click(
    await screen.findByRole("button", { name: "Verstanden und weiter" }),
  );

  // Hauptjob Person 1 (angestellt): Sozialversicherungen + Steuerklasse III
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
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Hauptjob Person 1: Einkommen gleich verteilt?
  await user.click(
    await screen.findByTestId("istEinkommenGleichVerteilt_option_0"), // Ja
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Hauptjob Person 1: Einkommen angestellt
  await user.type(
    await screen.findByLabelText("Monatliches Brutto-Einkommen"),
    "1500",
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Weiterer Nebenjob Person 1? -> Nein (Minijob wird gesondert abgefragt)
  await user.click(
    await screen.findByTestId("istWeitereTaetigkeitVorhanden_option_1"),
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Minijob Person 1: Einkommen gleich verteilt?
  await user.click(
    await screen.findByTestId("istEinkommenGleichVerteilt_option_0"), // Ja
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Minijob Person 1: Einkommen
  await user.type(
    await screen.findByLabelText("Monatliches Brutto-Einkommen"),
    "350",
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Weiterer Minijob Person 1? -> Nein
  await user.click(
    await screen.findByTestId("istWeitereTaetigkeitVorhanden_option_1"),
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Selbstständigkeit Person 1: Sozialversicherungen + Gewinn
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

  // Weitere Selbstständigkeit Person 1? -> Nein, DONE
  await user.click(
    await screen.findByTestId("istWeitereTaetigkeitVorhanden_option_1"),
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
