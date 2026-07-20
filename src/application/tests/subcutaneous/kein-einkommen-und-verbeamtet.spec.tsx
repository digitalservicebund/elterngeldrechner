import { render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { EventProvider } from "@/application/features/abfrageteil/events/EventContext";
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
  vi.setSystemTime(new Date("2026-03-10"));
});

afterEach(() => {
  vi.useRealTimers();
});

/*
 * Ausgangslage: Ein Paar plant gemeinsam Elterngeld für das erste Kind;
 * keine der beiden Personen ist im Mutterschutz. Person 1 hatte im
 * Bemessungszeitraum kein Einkommen. Person 2 ist verbeamtet (3.000 € brutto
 * im Monat, Steuerklasse IV) und daher nicht gesetzlich kranken-, renten-
 * oder arbeitslosenversichert.
 *
 * Ohne wegfallendes Einkommen erhält Person 1 den Mindestbetrag von 300 €
 * Basiselterngeld bzw. 150 € ElterngeldPlus (§ 2 Abs. 4 BEEG). Bei Person 2
 * fließt das Brutto ohne Abzug von Sozialabgaben in die Berechnung ein.
 */
test("Kein Einkommen und Beamtin: Mindestbetrag für Person 1, Beamtenbezüge für Person 2 (§ 2 Abs. 4 BEEG)", async () => {
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

  // Gemeinsame Planung: beide
  await user.click(
    await screen.findByTestId("wirdZweitePersonBeruecksichtigt_option_0"),
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Ausklammerung: Erkrankung wegen Schwangerschaft (Person 1) -> Nein
  await user.click(
    await screen.findByTestId("hatSchwangerschaftsbedingteErkrankung_option_1"),
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Finanzielle Situation Person 1: nur "kein Einkommen"
  await user.click(
    await screen.findByRole("checkbox", {
      name: "Person 1 hatte oder hat kein Einkommen",
    }),
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Angaben Person 2: kein Mutterschutz
  await user.type(await screen.findByLabelText("Vorname Person 2"), "Person 2");
  await user.click(screen.getByTestId("istImMutterschutz_option_1")); // Nein
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Ausklammerung: Erkrankung wegen Schwangerschaft (Person 2) -> Nein
  await user.click(
    await screen.findByTestId("hatSchwangerschaftsbedingteErkrankung_option_1"),
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Finanzielle Situation Person 2: verbeamtet
  await user.click(
    await screen.findByRole("checkbox", {
      name: "Person 2 war oder ist verbeamtet",
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

  // Tätigkeit Person 2: Sozialversicherungen + Steuerklasse IV (Beamtin:
  // nicht gesetzlich kranken-/renten-/arbeitslosenversichert)
  await user.selectOptions(
    await screen.findByLabelText("Steuerklasse"),
    screen.getByRole("option", { name: "4" }),
  );
  await user.click(screen.getByTestId("istKirchensteuerpflichtig_option_1")); // Nein
  await user.click(
    screen.getByTestId("istGesetzlichKrankenpflichtversichert_option_1"), // Nein
  );
  await user.click(
    screen.getByTestId("istGesetzlichRentenversichert_option_1"),
  ); // Nein
  await user.click(
    screen.getByTestId("istGesetzlichArbeitlosenversichert_option_1"), // Nein
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

  const hook = renderHook(() => useBerechneElterngeldbezuege(), {
    wrapper: EventProvider,
  });
  const berechneElterngeldbezuege = hook.result.current;
  const monatsbetrag = monatsbetragAusBerechneElterngeldbezuege.bind(
    null,
    berechneElterngeldbezuege,
  );

  // Person 1: kein Einkommen -> Mindestbetrag (§ 2 Abs. 4 BEEG)
  expect(monatsbetrag(Elternteil.Eins, Variante.Basis)).toBe(300);
  expect(monatsbetrag(Elternteil.Eins, Variante.Plus)).toBe(150);

  // Person 2: verbeamtet, 3.000 € brutto, Steuerklasse IV (Charakterisierung)
  expect(monatsbetrag(Elternteil.Zwei, Variante.Basis)).toBe(1633);
  expect(monatsbetrag(Elternteil.Zwei, Variante.Plus)).toBe(817);
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
