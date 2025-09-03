import ReadMoreIcon from "@digitalservicebund/icons/ReadMore";
import { type ReactNode, useId } from "react";
import { Button } from "@/application/components";

type Props = {
  readonly children: ReactNode;
  readonly onOpenErklaerung: () => void;
};

export function Anleitung({ children, onOpenErklaerung }: Props): ReactNode {
  const headingIdentifier = useId();

  return (
    <section aria-labelledby={headingIdentifier}>
      <h3 id={headingIdentifier} className="sr-only">
        Anleitung
      </h3>

      {children}

      <Button
        className="pt-20 text-left !text-base"
        type="button"
        buttonStyle="link"
        onClick={onOpenErklaerung}
      >
        <ReadMoreIcon className="mr-4" />
        Hier finden Sie weitere Informationen zu Elterngeld
      </Button>
    </section>
  );
}

if (import.meta.vitest) {
  const { describe, it, expect, vi } = import.meta.vitest;

  describe("Anleitung", async () => {
    const { render, screen } = await import("@testing-library/react");
    const { userEvent } = await import("@testing-library/user-event");

    it("shows a section for the initial instruction", () => {
      const onOpenErklaerung = vi.fn();

      render(
        <Anleitung onOpenErklaerung={onOpenErklaerung}>
          <p>Lorem Ipsum</p>
        </Anleitung>,
      );

      expect(screen.getByLabelText("Anleitung")).toBeVisible();
    });

    it("triggers the given callback when clicking on the Button to show additional information", async () => {
      const onOpenErklaerung = vi.fn();

      render(
        <Anleitung onOpenErklaerung={onOpenErklaerung}>
          <p>Lorem Ipsum</p>
        </Anleitung>,
      );

      await userEvent.click(
        screen.getByRole("button", {
          name: "Hier finden Sie weitere Informationen zu Elterngeld",
        }),
      );

      expect(onOpenErklaerung).toHaveBeenCalledOnce();
    });
  });
}
