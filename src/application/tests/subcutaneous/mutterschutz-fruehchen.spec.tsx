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
  vi.setSystemTime(new Date("2026-01-15"));
});

afterEach(() => {
  vi.useRealTimers();
});

/*
 * Ausgangslage: Ein Paar plant gemeinsam Elterngeld für das erste Kind, das
 * rund acht Wochen vor dem errechneten Entbindungstermin geboren wurde
 * (errechneter Entbindungstermin 01.03.2026, Geburt 01.01.2026).
 *
 * Beide sind angestellt mit je 3.000 € brutto im Monat (Steuerklasse III,
 * gesetzlich sozialversichert, kirchensteuerpflichtig). Person 1 war vor der
 * Geburt im Mutterschutz.
 *
 * Bei einer Frühgeburt gibt es zusätzliche Monate Basiselterngeld, je
 * nachdem wie früh das Kind geboren wurde (§ 2 Abs. 1 Satz 2 f. BEEG). Der
 * monatliche Betrag bleibt davon unberührt: Basiselterngeld 1.441 €,
 * ElterngeldPlus 721 € pro Person. Die durch die Frühgeburt verlängerte
 * Mutterschutzfrist blockiert bei Person 1 fünf Lebensmonate (§ 3 BEEG).
 */
test("Mutterschutz bei Frühgeburt: der Monatsbetrag bleibt unverändert (§ 2 BEEG)", async () => {
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
    "01.03.2026",
  );
  await user.type(
    screen.getByLabelText("Geburtsdatum (TT.MM.JJJJ)"),
    "01.01.2026",
  );
  await user.type(screen.getByLabelText("Anzahl der Kinder"), "1");
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Geschwisterkinder
  await user.click(await screen.findByTestId("istVorhanden_option_1")); // Nein
  await user.click(screen.getByRole("button", { name: "Weiter" }));

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

  const monatsbetrag = monatsbetragAusBerechneElterngeldbezuege.bind(
    null,
    berechneElterngeldbezuege,
  );

  // Person 1: 3.000 € brutto, Steuerklasse III
  // (Bonus+1000-€-Einkommen aus dem Orakel — 978 € — ist über diesen Seam
  // nicht prüfbar, siehe Partnerschaftsbonus-Hinweis; daher hier ausgelassen.)
  expect(monatsbetrag(Elternteil.Eins, Variante.Basis)).toBe(1441);
  expect(monatsbetrag(Elternteil.Eins, Variante.Plus)).toBe(721);
  expect(monatsbetrag(Elternteil.Eins, Variante.Bonus)).toBe(721);

  const erstelleAusgangslage = useErstelleAusgangslage();

  // Frühgeburt verlängert den Mutterschutz: fünf blockierte Lebensmonate
  expect(erstelleAusgangslage().informationenZumMutterschutz).toEqual({
    empfaenger: Elternteil.Eins,
    letzterLebensmonatMitSchutz: 5,
  });

  // Person 2: 3.000 € brutto, Steuerklasse III
  expect(monatsbetrag(Elternteil.Zwei, Variante.Basis)).toBe(1441);
  expect(monatsbetrag(Elternteil.Zwei, Variante.Plus)).toBe(721);
  expect(monatsbetrag(Elternteil.Zwei, Variante.Bonus)).toBe(721);
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
