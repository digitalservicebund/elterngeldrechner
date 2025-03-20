import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Anleitung } from "./Anleitung";

describe("Anleitung", () => {
  it("shows a section for the initial instruction", () => {
    render(<Anleitung {...ANY_PROPS} />);

    expect(screen.getByLabelText("Anleitung")).toBeVisible();
  });

  it("triggers the given callback when clicking on the Button to show additional information", async () => {
    const onOpenErklaerung = vi.fn();
    render(<Anleitung onOpenErklaerung={onOpenErklaerung} />);

    await userEvent.click(
      screen.getByRole("button", {
        name: "Weitere Informationen wie Elterngeld funktioniert",
      }),
    );

    expect(onOpenErklaerung).toHaveBeenCalledOnce();
  });
});

const ANY_PROPS = {
  onOpenErklaerung: () => {},
};
