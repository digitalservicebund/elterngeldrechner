import { render, screen } from "@testing-library/react";
import { FootNote } from "./FootNote";

describe("Foot Note Number", () => {
  it("should create foot note without text", () => {
    render(
      <div data-testid="wrapper">
        <FootNote number={1} />
      </div>,
    );

    const footNoteNumber1 = screen.getByText("1");
    expect(footNoteNumber1).toBeInTheDocument();
    expect(footNoteNumber1.localName).toBe("span");
    expect(footNoteNumber1.className).toBe(
      "egr-foot-note-number egr-foot-note__number",
    );
    expect(footNoteNumber1.id).toContain("footnote_1");

    const wrapper = screen.getByTestId("wrapper");
    const footNote1 = wrapper.querySelector(".egr-foot-note__note");
    if (footNote1 === null) {
      throw new Error("footNote1 not found");
    }
    expect(footNote1).toBeInTheDocument();
    expect(footNote1.localName).toBe("div");
  });

  it("should create foot note with prefix and text", () => {
    render(
      <div data-testid="wrapper">
        <FootNote number={2} prefix="test">
          Der Text
        </FootNote>
      </div>,
    );

    const footNoteNumber2 = screen.getByText("2");
    expect(footNoteNumber2).toBeInTheDocument();
    expect(footNoteNumber2.localName).toBe("span");
    expect(footNoteNumber2.className).toBe(
      "egr-foot-note-number egr-foot-note__number",
    );
    expect(footNoteNumber2.id).toContain("footnote_test-2");

    const footNote2 = screen.getByText("Der Text");
    expect(footNote2).toBeInTheDocument();
    expect(footNote2.localName).toBe("div");
  });
});
