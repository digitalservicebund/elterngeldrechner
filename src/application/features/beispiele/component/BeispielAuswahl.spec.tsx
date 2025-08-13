import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { BeispielAuswahl } from "./BeispielAuswahl";
import type { BeispielOhnePlan } from "@/application/features/beispiele/hooks";

/*
 * These tests currently heavily struggle because of how the component
 * responses to different container sizes. Basically every element in the DOM
 * exists twice. Always one version of them is hidden based on a CSS container
 * query. Unfortunately we don't have a testing strategy for this yet.
 * Therefore, the dump approach is to use the `*All*` locators and index the
 * list of elements. This is definitely not good.
 */
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
    const beispiele = [
      createBeispiel({
        titel: "Erster Titel",
        beschreibung: "Erste Beschreibung",
      }),
      createBeispiel({
        titel: "Zweiter Titel",
        beschreibung: "Zweite Beschreibung",
      }),
    ];

    render(<BeispielAuswahl {...ANY_PROPS} beispiele={beispiele} />);

    // TODO: Fix usage of proper regions instead if plain text.
    expect(screen.getAllByText("Erster Titel").at(0)).toBeVisible();
    expect(screen.getAllByText("Erste Beschreibung").at(0)).toBeVisible();
    expect(screen.getAllByText("Zweiter Titel").at(0)).toBeVisible();
    expect(screen.getAllByText("Zweite Beschreibung").at(0)).toBeVisible();
  });

  it("shows a button for each Beispiel to select it", () => {
    const beispiele = [
      createBeispiel({ titel: "Erster Titel" }),
      createBeispiel({ titel: "Zweiter Titel" }),
    ];

    render(<BeispielAuswahl {...ANY_PROPS} beispiele={beispiele} />);

    expect(
      screen
        .getAllByRole("button", {
          name: "Übernehme Beispielplan",
          description: "Erster Titel",
        })
        .at(0),
    ).toBeVisible();

    expect(
      screen
        .getAllByRole("button", {
          name: "Übernehme Beispielplan",
          description: "Zweiter Titel",
        })
        .at(0),
    ).toBeVisible();
  });
});

it("calls the given callback with the identifier of the Beispiel when the button is clicked", async () => {
  const waehleBeispielAus = vi.fn();
  const beispiele = [
    createBeispiel({
      identifier: "erster-identifier",
      titel: "Erster Titel",
    }),
    createBeispiel({
      identifier: "zweiter-identifier",
      titel: "Zweiter Titel",
    }),
  ];

  render(
    <BeispielAuswahl
      {...ANY_PROPS}
      beispiele={beispiele}
      waehleBeispielAus={waehleBeispielAus}
    />,
  );

  await userEvent.click(
    screen
      .getAllByRole("button", {
        name: "Übernehme Beispielplan",
        description: "Zweiter Titel",
      })
      .at(0)!,
  );

  expect(waehleBeispielAus).toHaveBeenCalledOnce();
  expect(waehleBeispielAus).toHaveBeenCalledWith("zweiter-identifier");
});

it("uses the given callback to determine if a Beispiel is selected or not", () => {
  const istBeispielAusgewaehlt = vi.fn().mockReturnValue(false);
  const beispiele = [
    createBeispiel({ identifier: "erster-identifier" }),
    createBeispiel({ identifier: "zweiter-identifier" }),
  ];

  render(
    <BeispielAuswahl
      {...ANY_PROPS}
      beispiele={beispiele}
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

  const beispiele = [
    createBeispiel({
      identifier: "erster-identifier",
      titel: "Erster Titel",
    }),
    createBeispiel({
      identifier: "zweiter-identifier",
      titel: "Zweiter Titel",
    }),
  ];

  render(
    <BeispielAuswahl
      {...ANY_PROPS}
      beispiele={beispiele}
      istBeispielAusgewaehlt={istBeispielAusgewaehlt}
    />,
  );

  const buttonFuerErstesBeispiel = screen
    .getAllByRole("button", {
      name: "Übernehme Beispielplan",
      description: "Erster Titel",
    })
    .at(0);

  const buttonFuerZweitesBeispiel = screen
    .getAllByRole("button", {
      name: "Übernehme Beispielplan",
      description: "Zweiter Titel",
    })
    .at(0);

  expect(buttonFuerErstesBeispiel).toHaveAttribute("aria-pressed", "false");
  expect(buttonFuerErstesBeispiel).toHaveAttribute("aria-disabled", "false");
  expect(buttonFuerZweitesBeispiel).toHaveAttribute("aria-pressed", "true");
  expect(buttonFuerZweitesBeispiel).toHaveAttribute("aria-disabled", "true");
});

function createBeispiel(
  beschreibung: Partial<BeispielOhnePlan>,
): BeispielOhnePlan {
  return {
    identifier: crypto.randomUUID(),
    titel: "Test Titel",
    beschreibung: "Test Beschreibung",
    ...beschreibung,
  };
}

const ANY_PROPS = {
  beispiele: [],
  waehleBeispielAus: () => {},
  istBeispielAusgewaehlt: () => false,
};
