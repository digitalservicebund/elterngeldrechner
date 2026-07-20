import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import routeDefinition from "@/application/routing/RouteDefinition";
import axe from "axe-core";

beforeEach(() => {
  sessionStorage.clear();

  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-01-15"));
});

afterEach(() => {
  vi.useRealTimers();
});

test("Barrierefreiheit: Beispielhafter Nutzenden Flow hat keine Axe Verstöße", async () => {
  const user = userEvent.setup();

  const router = createMemoryRouter(routeDefinition, {
    initialEntries: ["/abfrageteil/startseite"],
  });
  const { container } = render(<RouterProvider router={router} />);

  // Startseite
  await screen.findByRole("button", { name: "Verstanden und weiter" });
  expect(await collectAccessibilityViolations(container)).toEqual([]);

  await user.click(
    screen.getByRole("button", { name: "Verstanden und weiter" }),
  );

  // Allgemeine Angaben
  await screen.findByLabelText("Bundesland");
  expect(await collectAccessibilityViolations(container)).toEqual([]);
  await user.selectOptions(screen.getByLabelText("Bundesland"), "Berlin");
  await user.click(
    screen.getByTestId("gesamteinkommenGrenzeUeberschritten_option_1"), // Nein
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Kind
  await screen.findByTestId("istGeboren_option_0");
  expect(await collectAccessibilityViolations(container)).toEqual([]);
  await user.click(screen.getByTestId("istGeboren_option_0")); // Ja
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Angaben zur Geburt (geborenes Kind)
  await screen.findByLabelText("Errechneter Entbindungstermin (TT.MM.JJJJ)");
  expect(await collectAccessibilityViolations(container)).toEqual([]);
  await user.type(
    screen.getByLabelText("Errechneter Entbindungstermin (TT.MM.JJJJ)"),
    "30.12.2025",
  );
  await user.type(
    screen.getByLabelText("Geburtsdatum (TT.MM.JJJJ)"),
    "09.01.2026",
  );
  await user.type(screen.getByLabelText("Anzahl der Kinder"), "1");
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Geschwisterkinder
  await screen.findByTestId("istVorhanden_option_1");
  expect(await collectAccessibilityViolations(container)).toEqual([]);
  await user.click(screen.getByTestId("istVorhanden_option_1")); // Nein
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Angaben Person 1
  await screen.findByLabelText("Vorname Person 1");
  expect(await collectAccessibilityViolations(container)).toEqual([]);
  await user.type(screen.getByLabelText("Vorname Person 1"), "Person 1");
  await user.click(screen.getByTestId("istAlleinerziehend_option_1")); // Nein
  await user.click(screen.getByTestId("istImMutterschutz_option_0")); // Ja
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Gemeinsame Planung
  await screen.findByTestId("wirdZweitePersonBeruecksichtigt_option_0");
  expect(await collectAccessibilityViolations(container)).toEqual([]);
  await user.click(
    screen.getByTestId("wirdZweitePersonBeruecksichtigt_option_0"), // Ja, beide
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Ausklammerung: Erkrankung wegen Schwangerschaft (Person 1)
  await screen.findByTestId("hatSchwangerschaftsbedingteErkrankung_option_1");
  expect(await collectAccessibilityViolations(container)).toEqual([]);
  await user.click(
    screen.getByTestId("hatSchwangerschaftsbedingteErkrankung_option_1"), // Nein
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Finanzielle Situation Person 1: Tätigkeiten
  await screen.findByRole("checkbox", {
    name: "Person 1 war oder ist angestellt",
  });
  expect(await collectAccessibilityViolations(container)).toEqual([]);
  await user.click(
    screen.getByRole("checkbox", { name: "Person 1 war oder ist angestellt" }),
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Bemessungszeitraum-Übersicht Person 1
  await screen.findByRole("button", { name: "Verstanden und weiter" });
  expect(await collectAccessibilityViolations(container)).toEqual([]);
  await user.click(
    screen.getByRole("button", { name: "Verstanden und weiter" }),
  );

  // Tätigkeit Person 1: Minijob?
  await screen.findByTestId("istTaetigkeitMinijob_option_1");
  expect(await collectAccessibilityViolations(container)).toEqual([]);
  await user.click(screen.getByTestId("istTaetigkeitMinijob_option_1")); // Nein
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Tätigkeit Person 1: Sozialversicherungen + Steuerklasse
  await screen.findByLabelText("Steuerklasse");
  expect(await collectAccessibilityViolations(container)).toEqual([]);
  await user.selectOptions(
    screen.getByLabelText("Steuerklasse"),
    screen.getByRole("option", { name: "4" }),
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
  await screen.findByLabelText("Monatliches Brutto-Einkommen");

  expect(await collectAccessibilityViolations(container)).toEqual([]);
  await user.type(
    screen.getByLabelText("Monatliches Brutto-Einkommen"),
    "4600",
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Weitere Tätigkeiten Person 1?
  await screen.findByTestId("istWeitereTaetigkeitVorhanden_option_1");
  expect(await collectAccessibilityViolations(container)).toEqual([]);
  await user.click(
    screen.getByTestId("istWeitereTaetigkeitVorhanden_option_1"), // Nein
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Angaben Person 2 (kein Mutterschutz-Feld, da Person 1 im Mutterschutz war)
  await screen.findByLabelText("Vorname Person 2");
  expect(await collectAccessibilityViolations(container)).toEqual([]);
  await user.type(screen.getByLabelText("Vorname Person 2"), "Person 2");
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Finanzielle Situation Person 2: Tätigkeiten
  await screen.findByRole("checkbox", {
    name: "Person 2 war oder ist angestellt",
  });
  expect(await collectAccessibilityViolations(container)).toEqual([]);
  await user.click(
    screen.getByRole("checkbox", { name: "Person 2 war oder ist angestellt" }),
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Bemessungszeitraum-Übersicht Person 2
  await screen.findByRole("button", { name: "Verstanden und weiter" });
  expect(await collectAccessibilityViolations(container)).toEqual([]);
  await user.click(
    screen.getByRole("button", { name: "Verstanden und weiter" }),
  );

  // Tätigkeit Person 2: Minijob?
  await screen.findByTestId("istTaetigkeitMinijob_option_1");
  expect(await collectAccessibilityViolations(container)).toEqual([]);
  await user.click(screen.getByTestId("istTaetigkeitMinijob_option_1")); // Nein
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Tätigkeit Person 2: Sozialversicherungen + Steuerklasse
  await screen.findByLabelText("Steuerklasse");
  expect(await collectAccessibilityViolations(container)).toEqual([]);
  await user.selectOptions(
    screen.getByLabelText("Steuerklasse"),
    screen.getByRole("option", { name: "4" }),
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
  await screen.findByLabelText("Monatliches Brutto-Einkommen");
  expect(await collectAccessibilityViolations(container)).toEqual([]);
  await user.type(
    screen.getByLabelText("Monatliches Brutto-Einkommen"),
    "2500",
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Weitere Tätigkeiten Person 2? -> DONE
  await screen.findByTestId("istWeitereTaetigkeitVorhanden_option_1");
  expect(await collectAccessibilityViolations(container)).toEqual([]);
  await user.click(
    screen.getByTestId("istWeitereTaetigkeitVorhanden_option_1"), // Nein
  );
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  expect(router.state.location.pathname).toBe("/beispiele");

  // Beispiele: pick the first suggested plan (a valid, complete plan so the
  // Planer can be applied afterwards).
  await screen.findByRole("heading", {
    name: "Wollen Sie einen Vorschlag für Ihre Planung?",
  });
  expect(await collectAccessibilityViolations(container)).toEqual([]);
  await user.click(screen.getAllByRole("radio")[0]!);
  await user.click(screen.getByRole("button", { name: "Weiter" }));

  // Planer: apply the pre-filled plan into the Papierantrag.
  await screen.findByRole("button", { name: "Planung überprüfen" });
  expect(await collectAccessibilityViolations(container)).toEqual([]);
  await user.click(screen.getByRole("button", { name: "Planung überprüfen" }));
  await user.click(
    await screen.findByRole("button", {
      name: "Planung in den Papierantrag übernehmen",
    }),
  );

  // Datenübernahme (Papierantrag)
  await screen.findByRole("button", { name: /Antrag_auf_Elterngeld\.pdf/ });
  expect(await collectAccessibilityViolations(container)).toEqual([]);

  expect(router.state.location.pathname).toBe("/datenuebernahme-antrag");
});

export async function collectAccessibilityViolations(
  container: Element,
): Promise<string[]> {
  const { violations } = await axe.run(container, {
    resultTypes: ["violations"],
    rules: { "color-contrast": { enabled: false } },
  });

  // Map to readable one-liners so a failing assertion prints the rule and the
  // offending element rather than an opaque violation object graph.
  const violationLines = violations.map((violation) => {
    return `${violation.id} (${violation.impact}): ${violation.help} — ${violation.nodes
      .map((node) => node.target.join(" "))
      .join(", ")}`;
  });

  return violationLines;
}
