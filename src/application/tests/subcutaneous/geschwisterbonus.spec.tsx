import { render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { erstelleAusgangslage } from "@/application/features/abfrageteil/domain/erstelleAusgangslage";
import {
  EventProvider,
  useEventContext,
} from "@/application/features/abfrageteil/events/EventContext";
import { useBerechneElterngeldbezuege } from "@/application/features/planungsteil/planer/hooks/useBerechneElterngeldbezuege";
import routeDefinition from "@/application/routing/RouteDefinition";
import {
  BerechneElterngeldbezuegeCallback,
  Elternteil,
  Variante,
} from "@/monatsplaner";

beforeEach(() => {
  sessionStorage.clear();

  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-02-20"));
});

afterEach(() => {
  vi.useRealTimers();
});

/*
 * Ausgangslage: Ein Paar plant gemeinsam Elterngeld für das jüngste Kind
 * (geboren am 13.02.2026). Es gibt ein älteres Geschwisterkind (geboren am
 * 24.05.2024, ohne Behinderung); für dieses hatte keine der beiden Personen
 * Mutterschutz oder Elternzeit, es wird also nichts ausgeklammert.
 *
 * Beide sind angestellt mit je 3.000 € brutto im Monat, gesetzlich
 * sozialversichert, nicht kirchensteuerpflichtig. Person 1 (Steuerklasse III)
 * war vor der Geburt im Mutterschutz, Person 2 (Steuerklasse V) nicht.
 *
 * Das Geschwisterkind ist jünger als drei Jahre und begründet den Anspruch
 * auf den Geschwisterbonus (§ 2a Abs. 1 Satz 1 Nr. 1 BEEG): das Elterngeld
 * steigt um 10 %, mindestens um 75 € Basis / 37,50 € Plus. Die ersten zwei
 * Lebensmonate von Person 1 sind wegen des Mutterschutzes blockiert
 * (§ 3 BEEG).
 */
test("Geschwisterbonus: älteres Kind unter drei Jahren erhöht das Elterngeld um 10 % (§ 2a BEEG)", async () => {
  const user = userEvent.setup();

  const router = createMemoryRouter(routeDefinition, {
    initialEntries: ["/abfrageteil/startseite"],
  });
  const { unmount } = render(<RouterProvider router={router} />);

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

  // --- Ausklammerung Person 1: nichts auszuklammern ---
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

  // Mutterschutz älteres Kind: Nein
  await user.click(
    await screen.findByTestId("hatMutterschutzGeschwisterkind_option_1"),
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

  // --- Ausklammerung Person 2: nur die Elternzeit-Abfrage, Nein ---
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

  expect(router.state.location.pathname).toBe("/beispiele");

  unmount();

  const hook = renderHook(
    () => ({
      berechneElterngeldbezuege: useBerechneElterngeldbezuege(),
      eventHistorie: useEventContext().filtereValideEventHistorie(),
    }),
    { wrapper: EventProvider },
  );
  const { berechneElterngeldbezuege, eventHistorie } = hook.result.current;

  const monatsbetrag = monatsbetragAusBerechneElterngeldbezuege.bind(
    null,
    berechneElterngeldbezuege,
  );

  // Person 1: 3.000 € brutto, Steuerklasse III, mit Geschwisterbonus (+10 %)
  expect(monatsbetrag(Elternteil.Eins, Variante.Basis)).toBe(1588);
  expect(monatsbetrag(Elternteil.Eins, Variante.Plus)).toBe(794);

  // Person 2: 3.000 € brutto, Steuerklasse V, mit Geschwisterbonus (+10 %)
  expect(monatsbetrag(Elternteil.Zwei, Variante.Basis)).toBe(1164);
  expect(monatsbetrag(Elternteil.Zwei, Variante.Plus)).toBe(582);

  // Mutterschutz Person 1 blockiert die ersten zwei Lebensmonate (§ 3 BEEG).
  expect(
    erstelleAusgangslage(eventHistorie).informationenZumMutterschutz,
  ).toEqual({
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
