import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { BeispielAuswahl } from "./BeispielAuswahl";
import type { BeschreibungFuerEinBeispiel } from "@/application/features/planer/hooks";

describe("Beispiel Auswahl", () => {
  it("shows a section for Auswahl of Beispiele", () => {
    render(<BeispielAuswahl {...ANY_PROPS} />);

    expect(
      screen.getByLabelText(
        "Nutzen Sie ein Beispiel oder machen Sie Ihre eigene Planung:",
      ),
    ).toBeVisible();
  });

  it("shows a section with Titel and Beschreibung for each Beispiel", () => {
    const beschreibungenDerBeispiele = [
      beschreibungFuerEinBeispiel({
        titel: "Erster Titel",
        beschreibung: "Erste Beschreibung",
      }),
      beschreibungFuerEinBeispiel({
        titel: "Zweiter Titel",
        beschreibung: "Zweite Beschreibung",
      }),
    ];

    render(
      <BeispielAuswahl
        {...ANY_PROPS}
        beschreibungenDerBeispiele={beschreibungenDerBeispiele}
      />,
    );

    // TODO: Fix usage of proper regions instead if plain text.
    expect(screen.getByText("Erster Titel")).toBeVisible();
    expect(screen.getByText("Erste Beschreibung")).toBeVisible();
    expect(screen.getByText("Zweiter Titel")).toBeVisible();
    expect(screen.getByText("Zweite Beschreibung")).toBeVisible();
  });

  it("shows a button for each Beispiel to select it", () => {
    const beschreibungenDerBeispiele = [
      beschreibungFuerEinBeispiel({ titel: "Erster Titel" }),
      beschreibungFuerEinBeispiel({ titel: "Zweiter Titel" }),
    ];

    render(
      <BeispielAuswahl
        {...ANY_PROPS}
        beschreibungenDerBeispiele={beschreibungenDerBeispiele}
      />,
    );

    expect(
      screen.getByRole("button", {
        name: "Übernehme Beispielplan",
        description: "Erster Titel",
      }),
    ).toBeVisible();

    expect(
      screen.getByRole("button", {
        name: "Übernehme Beispielplan",
        description: "Zweiter Titel",
      }),
    ).toBeVisible();
  });
});

it("calls the given callback with the identifier of the Beispiel when the button is clicked", async () => {
  const waehleBeispielAus = vi.fn();
  const beschreibungenDerBeispiele = [
    beschreibungFuerEinBeispiel({
      identifier: "erster-identifier",
      titel: "Erster Titel",
    }),
    beschreibungFuerEinBeispiel({
      identifier: "zweiter-identifier",
      titel: "Zweiter Titel",
    }),
  ];

  render(
    <BeispielAuswahl
      {...ANY_PROPS}
      beschreibungenDerBeispiele={beschreibungenDerBeispiele}
      waehleBeispielAus={waehleBeispielAus}
    />,
  );

  await userEvent.click(
    screen.getByRole("button", {
      name: "Übernehme Beispielplan",
      description: "Zweiter Titel",
    }),
  );

  expect(waehleBeispielAus).toHaveBeenCalledOnce();
  expect(waehleBeispielAus).toHaveBeenCalledWith("zweiter-identifier");
});

it("uses the given callback to determine if a Beispiel is selected or not", () => {
  const istBeispielAusgewaehlt = vi.fn().mockReturnValue(false);
  const beschreibungenDerBeispiele = [
    beschreibungFuerEinBeispiel({ identifier: "erster-identifier" }),
    beschreibungFuerEinBeispiel({ identifier: "zweiter-identifier" }),
  ];

  render(
    <BeispielAuswahl
      {...ANY_PROPS}
      beschreibungenDerBeispiele={beschreibungenDerBeispiele}
      istBeispielAusgewaehlt={istBeispielAusgewaehlt}
    />,
  );

  expect(istBeispielAusgewaehlt).toHaveBeenCalledTimes(2);
  expect(istBeispielAusgewaehlt).toHaveBeenCalledWith("erster-identifier");
  expect(istBeispielAusgewaehlt).toHaveBeenCalledWith("zweiter-identifier");
});

it("marks the button of a Beispiel that is selected", () => {
  const istBeispielAusgewaehlt = vi.fn(
    (identifier) => identifier === "zweiter-identifier",
  );

  const beschreibungenDerBeispiele = [
    beschreibungFuerEinBeispiel({
      identifier: "erster-identifier",
      titel: "Erster Titel",
    }),
    beschreibungFuerEinBeispiel({
      identifier: "zweiter-identifier",
      titel: "Zweiter Titel",
    }),
  ];

  render(
    <BeispielAuswahl
      {...ANY_PROPS}
      beschreibungenDerBeispiele={beschreibungenDerBeispiele}
      istBeispielAusgewaehlt={istBeispielAusgewaehlt}
    />,
  );

  const buttonFuerErstesBeispiel = screen.getByRole("button", {
    name: "Übernehme Beispielplan",
    description: "Erster Titel",
  });

  const buttonFuerZweitesBeispiel = screen.getByRole("button", {
    name: "Übernehme Beispielplan",
    description: "Zweiter Titel",
  });

  expect(buttonFuerErstesBeispiel).toHaveAttribute("aria-pressed", "false");
  expect(buttonFuerErstesBeispiel).toHaveAttribute("aria-disabled", "false");
  expect(buttonFuerZweitesBeispiel).toHaveAttribute("aria-pressed", "true");
  expect(buttonFuerZweitesBeispiel).toHaveAttribute("aria-disabled", "true");
});

function beschreibungFuerEinBeispiel(
  beschreibung: Partial<BeschreibungFuerEinBeispiel>,
): BeschreibungFuerEinBeispiel {
  return {
    identifier: crypto.randomUUID(),
    titel: "Test Titel",
    beschreibung: "Test Beschreibung",
    ...beschreibung,
  };
}

const ANY_PROPS = {
  beschreibungenDerBeispiele: [],
  waehleBeispielAus: () => {},
  istBeispielAusgewaehlt: () => false,
};
