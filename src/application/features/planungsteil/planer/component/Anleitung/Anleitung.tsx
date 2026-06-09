import { type ReactNode, useId } from "react";
import { Button } from "@/application/features/components";
import ReadMoreIcon from "~icons/material-symbols/read-more";

type Props = {
  readonly className?: string;
  readonly children?: ReactNode;
  readonly description?: string;
  readonly onOpenErklaerung: () => void;
};

export function Anleitung({
  className,
  children,
  description,
  onOpenErklaerung,
}: Props): ReactNode {
  const headingIdentifier = useId();

  return (
    <section aria-labelledby={headingIdentifier} className={className}>
      <h4 id={headingIdentifier} className="sr-only">
        Anleitung
      </h4>

      {children}

      <Button
        className="pt-10 text-left"
        type="button"
        buttonStyle="link"
        onClick={onOpenErklaerung}
      >
        <ReadMoreIcon className="mr-4" />
        {description || "Hier erklären wir die verschiedenen Elterngeld-Arten"}
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
          name: "Hier erklären wir die verschiedenen Elterngeld-Arten",
        }),
      );

      expect(onOpenErklaerung).toHaveBeenCalledOnce();
    });
  });
}
