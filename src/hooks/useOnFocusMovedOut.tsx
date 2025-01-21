import { type RefObject, useCallback, useEffect } from "react";

export function useOnFocusMovedOut(
  element: RefObject<HTMLElement>,
  onFocusMovedOut: () => void,
) {
  const checkIfFocusHasMovedOut = useCallback(
    (event: FocusEvent) => {
      const hasFocusMovedOut =
        event.relatedTarget instanceof Node &&
        !element.current?.contains(event.relatedTarget);

      if (hasFocusMovedOut) onFocusMovedOut();
    },
    [element, onFocusMovedOut],
  );

  useEffect(() => {
    if (element.current != null) {
      document.addEventListener("focusout", checkIfFocusHasMovedOut);
      return () =>
        document.removeEventListener("focusout", checkIfFocusHasMovedOut);
    }
  }, [element, checkIfFocusHasMovedOut]);
}

if (import.meta.vitest) {
  const { describe, it, expect, vi } = import.meta.vitest;

  describe("detect click outside hook", async () => {
    const { render } = await import("@testing-library/react");
    const { useRef } = await import("react");
    const { userEvent } = await import("@testing-library/user-event");

    it("does not trigger the callback when clicking a focusable element outside and then inside", async () => {
      const onFocusMovedOut = vi.fn();
      render(<WrapperWithHook onFocusMovedOut={onFocusMovedOut} />);

      await userEvent.click(
        document.getElementById("focusable-element-outside")!,
      );
      await userEvent.click(
        document.getElementById("first-focusable-element-inside")!,
      );

      expect(onFocusMovedOut).not.toHaveBeenCalled();
    });

    it("triggers the callback when clicking a focusable element inside and then outside", async () => {
      const onFocusMovedOut = vi.fn();
      render(<WrapperWithHook onFocusMovedOut={onFocusMovedOut} />);

      await userEvent.click(
        document.getElementById("first-focusable-element-inside")!,
      );
      await userEvent.click(
        document.getElementById("focusable-element-outside")!,
      );

      expect(onFocusMovedOut).toHaveBeenCalledOnce();
    });

    it("does not trigger the callback when clicking a focusable element inside and then a non focusable outside", async () => {
      const onFocusMovedOut = vi.fn();
      render(<WrapperWithHook onFocusMovedOut={onFocusMovedOut} />);

      await userEvent.click(
        document.getElementById("first-focusable-element-inside")!,
      );
      await userEvent.click(
        document.getElementById("non-focusable-element-outside")!,
      );

      expect(onFocusMovedOut).not.toHaveBeenCalled();
    });

    it("does not trigger the callback when tabbing between a focusable elements inside", async () => {
      const onFocusMovedOut = vi.fn();
      render(<WrapperWithHook onFocusMovedOut={onFocusMovedOut} />);

      await userEvent.tab();
      await userEvent.tab();

      expect(
        document.getElementById("second-focusable-element-inside"),
      ).toHaveFocus();
      expect(onFocusMovedOut).not.toHaveBeenCalled();
    });

    it("does trigger the callback when tabbing from a focusable element inside to one outside", async () => {
      const onFocusMovedOut = vi.fn();
      render(<WrapperWithHook onFocusMovedOut={onFocusMovedOut} />);

      await userEvent.tab();
      await userEvent.tab();
      await userEvent.tab();

      expect(
        document.getElementById("focusable-element-outside"),
      ).toHaveFocus();
      expect(onFocusMovedOut).toHaveBeenCalledOnce();
    });

    function WrapperWithHook(props: { readonly onFocusMovedOut: () => void }) {
      const { onFocusMovedOut } = props;
      const element = useRef<HTMLDivElement>(null);
      useOnFocusMovedOut(element, onFocusMovedOut);

      return (
        <>
          <div id="element" ref={element}>
            <a id="first-focusable-element-inside" href="/">
              first link
            </a>

            <a id="second-focusable-element-inside" href="/">
              second link
            </a>
          </div>

          <button type="button" id="focusable-element-outside">
            button
          </button>

          <span id="non-focusable-element-outside">text</span>
        </>
      );
    }
  });
}
