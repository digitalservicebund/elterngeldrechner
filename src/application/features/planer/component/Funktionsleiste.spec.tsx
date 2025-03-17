import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Funktionsleiste } from "./Funktionsleiste";

describe("Funktionsleiste", () => {
  it("shows a section for Funktionsleiste", () => {
    render(<Funktionsleiste />);

    expect(screen.getByLabelText("Funktionsleiste")).toBeVisible();
  });
});
