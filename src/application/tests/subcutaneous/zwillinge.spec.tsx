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
  vi.setSystemTime(new Date("2025-12-30"));
});

afterEach(() => {
  vi.useRealTimers();
});

/*
 * Ausgangslage: Ein Paar plant gemeinsam Elterngeld für Zwillinge. Beide
 * sind angestellt mit je 3.000 € brutto im Monat (Steuerklasse III,
 * gesetzlich sozialversichert, nicht kirchensteuerpflichtig). Person 1 war
 * vor der Geburt im Mutterschutz.
 *
 * Der Mehrlingszuschlag erhöht das Basiselterngeld um 300 € je weiterem Kind
 * (§ 2a Abs. 4 BEEG). Der bei Mehrlingen verlängerte Mutterschutz blockiert
 * die ersten drei Lebensmonate von Person 1 (§ 3 BEEG).
 */
test("Zwillinge: Mehrlingszuschlag erhöht das Elterngeld (§ 2a Abs. 4 BEEG)", async () => {
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
  await user.type(screen.getByLabelText("Anzahl der Kinder"), "2");
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

  // Person 1: 3.000 € brutto, Steuerklasse III, mit Mehrlingszuschlag
  expect(monatsbetrag(Elternteil.Eins, Variante.Basis)).toBe(1732);
  expect(monatsbetrag(Elternteil.Eins, Variante.Plus)).toBe(866);
  expect(monatsbetrag(Elternteil.Eins, Variante.Bonus)).toBe(866);
  expect(monatsbetrag(Elternteil.Eins, Variante.Bonus, 1000)).toBe(866);

  const erstelleAusgangslage = useErstelleAusgangslage();

  // Die ersten drei Lebensmonate von Person 1 sind wegen Mutterschutz blockiert
  expect(erstelleAusgangslage().informationenZumMutterschutz).toEqual({
    empfaenger: Elternteil.Eins,
    letzterLebensmonatMitSchutz: 3,
  });

  // Person 2: 3.000 € brutto, Steuerklasse III, mit Mehrlingszuschlag
  expect(monatsbetrag(Elternteil.Zwei, Variante.Basis)).toBe(1732);
  expect(monatsbetrag(Elternteil.Zwei, Variante.Plus)).toBe(866);
  expect(monatsbetrag(Elternteil.Zwei, Variante.Bonus)).toBe(866);
  expect(monatsbetrag(Elternteil.Zwei, Variante.Bonus, 1000)).toBe(866);
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
