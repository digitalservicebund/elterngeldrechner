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
  vi.setSystemTime(new Date("2025-12-20"));
});

afterEach(() => {
  vi.useRealTimers();
});

/*
 * Ausgangslage: Ein Paar plant gemeinsam Elterngeld für ein Kind (geboren am
 * 24.12.2025); beide haben Mischeinkünfte aus je zwei Tätigkeiten. Person 1
 * (Steuerklasse III, im Mutterschutz) ist angestellt mit 3.000 € brutto im
 * Monat und selbstständig mit 20.000 € Jahresgewinn. Person 2
 * (Steuerklasse V) ist angestellt mit 3.000 € brutto im Monat und hat einen
 * Minijob mit 450 € im Monat.
 *
 * Wegen des selbstständigen Einkommens verschiebt sich der Bemessungszeitraum
 * für Person 1 auf das letzte abgeschlossene Kalenderjahr (§ 2b Abs. 2, 3
 * BEEG). Aus der Summe der Einkünfte ergibt sich für Person 1 der
 * Höchstbetrag von 1.800 € (§ 2 Abs. 1 Satz 2 BEEG); ElterngeldPlus ist die
 * Hälfte davon (§ 4a BEEG). Die ersten zwei Lebensmonate von Person 1 sind
 * wegen des Mutterschutzes blockiert (§ 3 BEEG).
 */
test("Mischeinkünfte: angestellt und selbstständig verschieben den Bemessungszeitraum aufs Vorjahr (§ 2b BEEG)", async () => {
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

  // Geschwisterkinder: keine
  await user.click(await screen.findByTestId("istVorhanden_option_1")); // Nein
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Angaben Person 1
  await user.type(await screen.findByLabelText("Vorname Person 1"), "Person 1");
  await user.click(screen.getByTestId("istAlleinerziehend_option_1")); // Nein
  await user.click(screen.getByTestId("istImMutterschutz_option_0")); // Ja
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Gemeinsame Planung: beide
  await user.click(
    await screen.findByTestId("wirdZweitePersonBeruecksichtigt_option_0"),
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Ausklammerung: Erkrankung wegen Schwangerschaft (Person 1)
  await user.click(
    await screen.findByTestId("hatSchwangerschaftsbedingteErkrankung_option_1"), // Nein
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Finanzielle Situation Person 1: Tätigkeiten (angestellt + selbstständig)
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
    "3000",
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Tätigkeit 2 Person 1: selbstständig (Mischeinkunft, 20.000 € Jahresgewinn)
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

  // Weitere Tätigkeiten Person 1?
  await user.click(
    await screen.findByTestId("istWeitereTaetigkeitVorhanden_option_1"), // Nein
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Angaben Person 2
  await user.type(await screen.findByLabelText("Vorname Person 2"), "Person 2");
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Finanzielle Situation Person 2: Tätigkeiten (nur angestellt)
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

  // Tätigkeit 1 Person 2 (angestellt): Minijob?
  await user.click(await screen.findByTestId("istTaetigkeitMinijob_option_1")); // Nein
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Tätigkeit 1 Person 2: Sozialversicherungen + Steuerklasse V
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

  // Tätigkeit 1 Person 2: Einkommen angestellt
  await user.type(
    await screen.findByLabelText("Monatliches Brutto-Einkommen"),
    "3000",
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Weitere Tätigkeiten Person 2? Ja (Minijob)
  await user.click(
    await screen.findByTestId("istWeitereTaetigkeitVorhanden_option_0"), // Ja
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Tätigkeit 2 Person 2 (angestellt): Minijob?
  await user.click(await screen.findByTestId("istTaetigkeitMinijob_option_0")); // Ja
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Tätigkeit 2 Person 2 (Minijob): gleich verteilt?
  await user.click(
    await screen.findByTestId("istEinkommenGleichVerteilt_option_0"), // Ja
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Tätigkeit 2 Person 2: Einkommen Minijob
  await user.type(
    await screen.findByLabelText("Monatliches Brutto-Einkommen"),
    "450",
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

  // Person 1: angestellt (3.000 €) + selbstständig (20.000 €/Jahr) -> Höchstsatz
  expect(monatsbetrag(Elternteil.Eins, Variante.Basis)).toBe(1800);
  expect(monatsbetrag(Elternteil.Eins, Variante.Plus)).toBe(900);

  // Person 2: angestellt (3.000 €, Steuerklasse V) + Minijob (450 €)
  expect(monatsbetrag(Elternteil.Zwei, Variante.Basis)).toBe(1343);
  expect(monatsbetrag(Elternteil.Zwei, Variante.Plus)).toBe(672);

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
