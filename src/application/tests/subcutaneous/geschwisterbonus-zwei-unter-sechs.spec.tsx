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
 * Ausgangslage: Ein Paar plant gemeinsam Elterngeld für ein Kind (geboren am
 * 24.12.2025). Es gibt zwei ältere Geschwisterkinder: eines geboren am
 * 24.12.2024 mit Behinderung, eines geboren am 01.06.2023 ohne Behinderung.
 *
 * Für den Geschwisterbonus zählt ein Kind mit Behinderung bis zum
 * 14. Lebensjahr, ein Kind ohne Behinderung bis zum 6. Lebensjahr
 * (§ 2a Abs. 1 Satz 1 Nr. 1 und 2 BEEG). Beide Kinder erfüllen die
 * Voraussetzungen, sodass der Geschwisterbonus (10 %, mindestens 75 €)
 * zusteht.
 *
 * Beide Personen sind angestellt mit je 3.000 € brutto im Monat, gesetzlich
 * sozialversichert, nicht kirchensteuerpflichtig. Person 1 (Steuerklasse III)
 * war vor der Geburt im Mutterschutz, Person 2 (Steuerklasse V) nicht. Alle
 * Ausklammerungs-Abfragen werden mit Nein beantwortet, obwohl die
 * Geschwisterkinder die Abfrageseiten auslösen.
 *
 * Die ersten zwei Lebensmonate von Person 1 sind wegen des Mutterschutzes
 * blockiert (§ 3 BEEG).
 */
test("Geschwisterbonus: zwei Geschwisterkinder unter sechs Jahren (§ 2a BEEG)", async () => {
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

  // Geschwisterkinder: zwei vorhanden
  await user.click(await screen.findByTestId("istVorhanden_option_0")); // Ja
  await user.click(screen.getByRole("button", { name: "Weiter" }));
  await user.type(await screen.findByLabelText("Anzahl Geschwister"), "2");
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Geschwisterkind 1: geboren 24.12.2024, mit Behinderung.
  await screen.findByRole("heading", {
    name: "Wann wurde Geschwisterkind 1 geboren?",
  });
  await user.type(
    screen.getByLabelText("Geburtsdatum (TT.MM.JJJJ)"),
    "24.12.2024",
  );
  await user.click(screen.getByTestId("hatBehinderung_option_0")); // Ja
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Geschwisterkind 2: geboren 01.06.2023, keine Behinderung
  await screen.findByRole("heading", {
    name: "Wann wurde Geschwisterkind 2 geboren?",
  });
  await user.type(
    screen.getByLabelText("Geburtsdatum (TT.MM.JJJJ)"),
    "01.06.2023",
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

  // --- Ausklammerung Person 1 ---
  await ausklammerungPerson1(user);

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

  // Angaben Person 2
  await user.type(await screen.findByLabelText("Vorname Person 2"), "Person 2");
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // --- Ausklammerung Person 2 ---
  await ausklammerungPerson2(user);

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

  const monatsbetrag = monatsbetragAusBerechneElterngeldbezuege.bind(
    null,
    berechneElterngeldbezuege,
  );

  expect(monatsbetrag(Elternteil.Eins, Variante.Basis)).toBe(1576);
  expect(monatsbetrag(Elternteil.Eins, Variante.Plus)).toBe(788);
  expect(monatsbetrag(Elternteil.Zwei, Variante.Basis)).toBe(1156);
  expect(monatsbetrag(Elternteil.Zwei, Variante.Plus)).toBe(578);

  const erstelleAusgangslage = useErstelleAusgangslage();

  expect(erstelleAusgangslage().informationenZumMutterschutz).toEqual({
    empfaenger: Elternteil.Eins,
    letzterLebensmonatMitSchutz: 2,
  });
});

async function ausklammerungPerson1(user: ReturnType<typeof userEvent.setup>) {
  // Ausklammerungs-Sequenz Person 1 (im Mutterschutz, zwei Geschwisterkinder;
  // beide jung genug, dass die Elternzeit-Abfrage erscheint, für das jüngste
  // zusätzlich die Mutterschutz-Abfrage). Alle Antworten Nein, daher keine
  // Zeiten-Seiten und keine tatsächliche Ausklammerung:
  //   erkrankung -> gk0 elternzeit -> gk0 mutterschutz -> gk1 elternzeit.

  await user.click(
    await screen.findByTestId("hatSchwangerschaftsbedingteErkrankung_option_1"),
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  await user.click(
    await screen.findByTestId("hatElterngeldGeschwisterkind_option_1"),
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  await user.click(
    await screen.findByTestId("hatMutterschutzGeschwisterkind_option_1"),
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  await user.click(
    await screen.findByTestId("hatElterngeldGeschwisterkind_option_1"),
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));
}

async function ausklammerungPerson2(user: ReturnType<typeof userEvent.setup>) {
  // Ausklammerungs-Sequenz Person 2 (nicht im Mutterschutz -> keine Erkrankungs-
  // Abfrage). Alle Antworten Nein:
  //   gk0 elternzeit -> gk0 mutterschutz -> gk1 elternzeit.

  await user.click(
    await screen.findByTestId("hatElterngeldGeschwisterkind_option_1"),
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  await user.click(
    await screen.findByTestId("hatMutterschutzGeschwisterkind_option_1"),
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  await user.click(
    await screen.findByTestId("hatElterngeldGeschwisterkind_option_1"),
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));
}

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
