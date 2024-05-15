import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FootNoteNumber } from "./FootNoteNumber";

describe("Foot Note Number", () => {
  describe("should create foot note number with id and anchor for it", () => {
    render(
      <div>
        <FootNoteNumber number={1} type="note" />
        <FootNoteNumber number={1} type="anchor" />
      </div>,
    );

    const footNoteNumbers = screen.getAllByText("1");
    expect(footNoteNumbers.length).toBe(2);

    const footNoteNumber1 = footNoteNumbers.filter((it) => {
      return it.id.length > 0;
    })[0];
    const footNoteAnchor1 = footNoteNumbers.filter((it) => {
      return it.id.length === 0;
    })[0];

    expect(footNoteNumber1).toBeInTheDocument();
    expect(footNoteAnchor1).toBeInTheDocument();

    it("then footnote number is correct created", () => {
      expect(footNoteNumber1.localName).toBe("span");
      expect(footNoteAnchor1.localName).toBe("a");

      expect(footNoteNumber1.className).toBe("egr-foot-note-number");
      expect(footNoteAnchor1.className).toBe("egr-foot-note-number");

      expect(footNoteNumber1.id).toContain("footnote_1");
      expect(footNoteAnchor1.id).toBe("");

      expect(footNoteAnchor1.getAttribute("href")).toContain("#footnote_1");
    });

    it("click footnote anchor", async () => {
      await userEvent.click(footNoteAnchor1);
    });
  });

  it("should create foot note number with prefixed id and anchor for it", () => {
    render(
      <div>
        <FootNoteNumber number={2} type="note" prefix="otherPage" />
        <FootNoteNumber number={2} type="anchor" prefix="otherPage" />
      </div>,
    );

    const footNoteNumbers = screen.getAllByText("2");
    expect(footNoteNumbers.length).toBe(2);

    const footNoteNumber2 = footNoteNumbers.filter((it) => {
      return it.id.length > 0;
    })[0];
    const footNoteAnchor2 = footNoteNumbers.filter((it) => {
      return it.id.length === 0;
    })[0];

    expect(footNoteNumber2).toBeInTheDocument();
    expect(footNoteAnchor2).toBeInTheDocument();

    expect(footNoteNumber2.localName).toBe("span");
    expect(footNoteAnchor2.localName).toBe("a");

    expect(footNoteNumber2.className).toBe("egr-foot-note-number");
    expect(footNoteAnchor2.className).toBe("egr-foot-note-number");

    expect(footNoteNumber2.id).toContain("footnote_otherPage-2");
    expect(footNoteAnchor2.id).toBe("");

    expect(footNoteAnchor2.getAttribute("href")).toContain(
      "#footnote_otherPage-2",
    );
  });

  it("should create foot note number with additional external className", () => {
    render(
      <div>
        <FootNoteNumber number={2} type="note" className="xyz__number1" />
        <FootNoteNumber number={2} type="anchor" className="xyz__number2" />
      </div>,
    );

    const footNoteNumbers = screen.getAllByText("2");
    expect(footNoteNumbers.length).toBe(2);

    const footNoteNumber2 = footNoteNumbers.filter((it) => {
      return it.id.length > 0;
    })[0];
    const footNoteAnchor2 = footNoteNumbers.filter((it) => {
      return it.id.length === 0;
    })[0];

    expect(footNoteNumber2).toBeInTheDocument();
    expect(footNoteAnchor2).toBeInTheDocument();

    expect(footNoteNumber2.className).toBe("egr-foot-note-number xyz__number1");
    expect(footNoteAnchor2.className).toBe("egr-foot-note-number xyz__number2");
  });
});
