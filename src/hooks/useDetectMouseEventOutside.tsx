import { render } from "@testing-library/react";
import { type RefObject, useCallback, useEffect } from "react";

export function useDetectClickOutside(
  element: RefObject<HTMLElement>,
  onClickOutside: () => void,
) {
  const checkIfClickedOutside = useCallback(
    (event: MouseEvent) => {
      const hasClickedOutside =
        event.target instanceof Node &&
        !element.current?.contains(event.target);

      if (hasClickedOutside) onClickOutside();
    },
    [element, onClickOutside],
  );

  useEffect(() => {
    if (element.current != null) {
      document.addEventListener("click", checkIfClickedOutside);
      return () => document.removeEventListener("click", checkIfClickedOutside);
    }
  }, [element, checkIfClickedOutside]);
}

if (import.meta.vitest) {
  const { describe, it, expect, vi } = import.meta.vitest;

  describe("detect click outside hook", async () => {
    const { useRef } = await import("react");
    const { userEvent } = await import("@testing-library/user-event");

    it("triggers the callback when clicking element no descendant of given element", async () => {
      const onClickOutside = vi.fn();
      render(<WrapperWithHook onClickOutside={onClickOutside} />);

      await userEvent.click(document.getElementById("outside-element")!);

      expect(onClickOutside).toHaveBeenCalledOnce();
    });

    it("does not trigger the callback when clicking the element itself", async () => {
      const onClickOutside = vi.fn();
      render(<WrapperWithHook onClickOutside={onClickOutside} />);

      await userEvent.click(document.getElementById("element")!);

      expect(onClickOutside).not.toHaveBeenCalled();
    });

    it("does not trigger the callback when clicking a descendant of the element", async () => {
      const onClickOutside = vi.fn();
      render(<WrapperWithHook onClickOutside={onClickOutside} />);

      await userEvent.click(document.getElementById("inside-element")!);

      expect(onClickOutside).not.toHaveBeenCalled();
    });

    function WrapperWithHook(props: { readonly onClickOutside: () => void }) {
      const { onClickOutside } = props;
      const element = useRef<HTMLDivElement>(null);
      useDetectClickOutside(element, onClickOutside);

      return (
        <>
          <div id="element" ref={element}>
            <span id="inside-element" />
          </div>
          <div id="outside-element" />
        </>
      );
    }
  });
}
