import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import {
  BerechneElterngeldbezuegeCallback,
  Elternteil,
  Variante,
} from "@/monatsplaner";
import { useBerechneElterngeldbezuege, useRender } from "./testHooks";

beforeEach(() => {
  sessionStorage.clear();

  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-03-10"));
});

afterEach(() => {
  vi.useRealTimers();
});

/*
 * Ausgangslage: Nur eine Person plant Elterngeld für das erste Kind. Das
 * Kind ist laut Angabe noch nicht geboren, der errechnete Entbindungstermin
 * (15.01.2026) liegt aber mehr als zwei Wochen zurück. Der Rechner geht
 * deshalb von einer bereits erfolgten Geburt aus und fragt das tatsächliche
 * Geburtsdatum (20.01.2026) nach.
 *
 * Person 1 ist angestellt mit 3.000 € brutto im Monat (Steuerklasse III,
 * kirchensteuerpflichtig, gesetzlich sozialversichert). Die Beträge
 * entsprechen dem Szenario der Standard-Angestellten (§ 2 Abs. 1, § 4a BEEG).
 */
test("Ungeborenes Kind: bei überschrittenem Entbindungstermin wird das Geburtsdatum nacherfasst (§ 2 Abs. 1 BEEG)", async () => {
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

  // Kind: noch nicht geboren
  await user.click(await screen.findByTestId("istGeboren_option_1")); // Nein
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Angaben zum ungeborenen Kind: ET liegt > 2 Wochen zurück -> Geburt
  // wahrscheinlich
  await user.type(
    await screen.findByLabelText("Errechneter Entbindungstermin (TT.MM.JJJJ)"),
    "15.01.2026",
  );
  await user.type(screen.getByLabelText("Anzahl der Kinder"), "1");
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Wahrscheinlich geborenes Kind: tatsächliches Geburtsdatum
  await user.type(
    await screen.findByLabelText("Geburtsdatum (TT.MM.JJJJ)"),
    "20.01.2026",
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Geschwisterkinder: keine
  await user.click(await screen.findByTestId("istVorhanden_option_1")); // Nein
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Angaben Person 1
  await user.type(await screen.findByLabelText("Vorname Person 1"), "Person 1");
  await user.click(screen.getByTestId("istAlleinerziehend_option_1")); // Nein
  await user.click(screen.getByTestId("istImMutterschutz_option_1")); // Nein
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Gemeinsame Planung: nur eine Person
  await user.click(
    await screen.findByTestId("wirdZweitePersonBeruecksichtigt_option_1"),
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Ausklammerung: Erkrankung wegen Schwangerschaft -> Nein
  await user.click(
    await screen.findByTestId("hatSchwangerschaftsbedingteErkrankung_option_1"),
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
  const monatsbetrag = monatsbetragAusBerechneElterngeldbezuege.bind(
    null,
    berechneElterngeldbezuege,
  );

  // Person 1: 3.000 € brutto, Steuerklasse III (wie Standard-Angestellte)
  expect(monatsbetrag(Elternteil.Eins, Variante.Basis)).toBe(1441);
  expect(monatsbetrag(Elternteil.Eins, Variante.Plus)).toBe(721);
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
