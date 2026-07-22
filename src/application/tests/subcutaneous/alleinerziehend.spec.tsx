import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import {
  BerechneElterngeldbezuegeCallback,
  Elternteil,
  Variante,
} from "@/monatsplaner";
import {
  useBerechneElterngeldbezuege,
  useErstelleAusgangslage,
  useRender,
} from "./testHooks";

beforeEach(() => {
  sessionStorage.clear();

  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-03-10"));
});

afterEach(() => {
  vi.useRealTimers();
});

/*
 * Ausgangslage: Eine alleinerziehende Person plant Elterngeld für das erste
 * Kind. Person 1 ist angestellt mit 3.000 € brutto im Monat (Steuerklasse I,
 * kirchensteuerpflichtig, gesetzlich sozialversichert) und war vor der
 * Geburt im Mutterschutz.
 *
 * Das Basiselterngeld beträgt 65 % des wegfallenden Nettoeinkommens
 * (§ 2 Abs. 1 Satz 1 BEEG) und bleibt unter dem Höchstbetrag von 1.800 €.
 * ElterngeldPlus beträgt die Hälfte des Basisbetrags (§ 4a BEEG). Die
 * ersten zwei Lebensmonate sind wegen des Mutterschutzes blockiert
 * (§ 3 BEEG).
 */
test("Alleinerziehend: mittleres Einkommen, Steuerklasse I (§ 2 Abs. 1 BEEG)", async () => {
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

  // Geschwisterkinder
  await user.click(await screen.findByTestId("istVorhanden_option_1")); // Nein
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Angaben Person 1
  await user.type(await screen.findByLabelText("Vorname Person 1"), "Person 1");
  await user.click(screen.getByTestId("istAlleinerziehend_option_0")); // Ja
  await user.click(screen.getByTestId("istImMutterschutz_option_0")); // Ja
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
    screen.getByRole("option", { name: "1" }),
  );
  await user.click(screen.getByTestId("istKirchensteuerpflichtig_option_0")); // Ja
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

  // Weitere Tätigkeiten Person 1? -> DONE, Abfrageteil ist durchlaufen
  await user.click(
    await screen.findByTestId("istWeitereTaetigkeitVorhanden_option_1"), // Nein
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  expect(
    await screen.findByText("Wollen Sie einen Vorschlag für Ihre Planung?"),
  ).toBeVisible();

  unmount();

  const berechneElterngeldbezuege = useBerechneElterngeldbezuege();

  const monatsbetrag = monatsbetragAusBerechneElterngeldbezuege.bind(
    null,
    berechneElterngeldbezuege,
  );

  expect(monatsbetrag(Elternteil.Eins, Variante.Basis)).toBe(1259);
  expect(monatsbetrag(Elternteil.Eins, Variante.Plus)).toBe(629);
  expect(monatsbetrag(Elternteil.Eins, Variante.Bonus, 1_500)).toBe(556);

  const erstelleAusgangslage = useErstelleAusgangslage();

  expect(erstelleAusgangslage().informationenZumMutterschutz).toEqual({
    empfaenger: Elternteil.Eins,
    letzterLebensmonatMitSchutz: 2,
  });
});

function monatsbetragAusBerechneElterngeldbezuege(
  berechneElterngeldbezuege: BerechneElterngeldbezuegeCallback,
  elternteil: Elternteil,
  variante: Variante,
  bruttoeinkommen?: number,
) {
  const lebensmonat = {
    gewaehlteOption: variante,
    imMutterschutz: false,
    bruttoeinkommen,
  };

  const lebensmonate = Object.fromEntries(
    Array.from({ length: 12 }, (_, index) => [index + 1, lebensmonat]),
  );

  const bezuege = berechneElterngeldbezuege(elternteil, lebensmonate);

  return Math.round(bezuege[6] ?? Number.NaN);
}
