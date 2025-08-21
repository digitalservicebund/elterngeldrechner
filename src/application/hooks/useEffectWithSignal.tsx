import type { ForwardedRef } from "react";
import { useEffect, useRef, useState } from "react";

/**
 * React hook to trigger an effect only after react has committed a state update.
 *
 * Useful when an action depends on dom and state changes that aren’t immediately
 * available during the same render cycle for example when operating on an element
 * that will be created in the next render cycle after state changes took place.
 *
 * Similar to using setTimout(...) but integrated with the render cycle of react.
 *
 * @param effectCallback - Function to run in the next tick.
 * @returns Callback function with an argument to schedule the effect.
 */
export function useEffectWithSignal<CallbackArgument>(
  effectCallback: (argument: CallbackArgument) => void,
) {
  // Argument can technically be undefined on first render
  const [signal, setSignal] = useState<Signal<CallbackArgument>>({
    nonce: 0,
    argument: Initial,
  });

  const callbackRef = useRef(effectCallback);

  useEffect(() => {
    if (signal.argument !== Initial) {
      callbackRef.current(signal.argument);
    }
  }, [signal]);

  const triggerEffectBySignal = (argument: CallbackArgument) => {
    setSignal({ nonce: signal.nonce + 1, argument });
  };

  return { triggerEffectBySignal };
}

const Initial: unique symbol = Symbol("initial");

export type Signal<T> = { nonce: number; argument: T | typeof Initial };

if (import.meta.vitest) {
  const { describe, it, expect, vi } = import.meta.vitest;

  describe("useEffectWithSignal", async () => {
    const { act, render, renderHook } = await import("@testing-library/react");
    const { createRef, useImperativeHandle, forwardRef } = await import(
      "react"
    );

    it("accepts undefined as an argument", () => {
      const deferredAction = vi.fn();

      const { result } = renderHook(() =>
        useEffectWithSignal(() => {
          deferredAction();
        }),
      );

      act(() => result.current.triggerEffectBySignal(undefined));

      expect(deferredAction).toBeCalled();
    });

    it("openLebensmonatsSummary runs correctly when accessing the new dom element after state change is committed", () => {
      const testComponent = createRef<TestComponentHTMLElement>();

      render(
        <TestComponentForwardedRef
          initialeLebensmonate={1}
          ref={testComponent}
        />,
      );

      expect(openStatesOfAllDetailsElements()).toEqual([false]);

      act(() => testComponent.current!.addLebensmonat());

      act(() => testComponent.current!.openLebensmonatsSummary(2));

      expect(openStatesOfAllDetailsElements()).toEqual([false, true]);
    });

    it("openLebensmonatsSummary crashes when trying to access the new dom element before state change is committed", () => {
      const testComponent = createRef<TestComponentHTMLElement>();

      render(
        <TestComponentForwardedRef
          initialeLebensmonate={1}
          ref={testComponent}
        />,
      );

      expect(() => {
        act(() => {
          testComponent.current!.addLebensmonat();
          testComponent.current!.openLebensmonatsSummary(2);
        });
      }).toThrowError("Cannot find Lebensmonat 2");
    });

    it("openLebensmonatsSummary runs correctly when deferring access to the new dom element with the useEffectWithSignal hook", () => {
      const testComponent = createRef<TestComponentHTMLElement>();

      render(
        <TestComponentForwardedRef
          initialeLebensmonate={1}
          ref={testComponent}
        />,
      );

      expect(openStatesOfAllDetailsElements()).toEqual([false]);

      function openLebensmonatsSummary(monat: number) {
        testComponent.current?.openLebensmonatsSummary(monat);
      }

      const { result } = renderHook(() =>
        useEffectWithSignal(openLebensmonatsSummary),
      );

      const { triggerEffectBySignal } = result.current;

      act(() => {
        testComponent.current!.addLebensmonat();

        triggerEffectBySignal(2);
      });

      expect(openStatesOfAllDetailsElements()).toEqual([false, true]);
    });

    const openStatesOfAllDetailsElements = () => {
      return Array.from(document.querySelectorAll("details")).map(
        (element) => element.open,
      );
    };

    interface TestComponentHTMLElement extends HTMLDivElement {
      openLebensmonatsSummary: (monat: number) => void;
      addLebensmonat: () => void;
    }

    interface TestComponentProps {
      readonly initialeLebensmonate: number;
    }

    function TestComponent(
      props: TestComponentProps,
      ref: ForwardedRef<TestComponentHTMLElement>,
    ) {
      const { initialeLebensmonate } = props;

      const [lebensmonate, setLebensmonate] = useState(initialeLebensmonate);

      const container = useRef<HTMLDivElement>(null);
      const elements = useRef<HTMLDetailsElement[]>([]);

      useImperativeHandle(ref, () => {
        function openLebensmonatsSummary(monat: number) {
          const targetElement = elements.current[monat];

          if (targetElement != undefined) {
            targetElement.open = true;
          } else {
            throw Error(`Cannot find Lebensmonat ${monat}`);
          }
        }

        function addLebensmonat() {
          setLebensmonate(lebensmonate + 1);
        }

        return {
          ...container.current!,
          openLebensmonatsSummary,
          addLebensmonat,
        };
      });

      const monatsliste = Array.from({ length: lebensmonate }, (_, i) => i + 1);

      return (
        <div ref={container}>
          {monatsliste.map((monatszahl) => (
            <details
              key={monatszahl}
              ref={(el) => {
                elements.current[monatszahl] = el!;
              }}
            >
              <summary>Lebensmonat mit Einkommenseingabe</summary>

              <input></input>
            </details>
          ))}
        </div>
      );
    }
    const TestComponentForwardedRef = forwardRef(TestComponent);
  });
}
