import { useEffect } from "react";

import { type FieldValues, type FieldErrors } from "react-hook-form";
import { type UseFormSubscribe } from "react-hook-form";

import { posthog } from "../posthog";

// TODO: Move into feature scoped tracking.ts file

export function useValidierungsfehlerTracking<
  TFieldValues extends FieldValues = FieldValues,
>(subscribe: UseFormSubscribe<TFieldValues>): void {
  useEffect(() => {
    const unsubscribe = subscribe({
      formState: { errors: true },
      callback: ({ errors }) => {
        if (errors) captureValidierungsfehler(errors);
      },
    });

    return unsubscribe;
  }, [subscribe]);
}

function captureValidierungsfehler<TFieldValues extends FieldValues>(
  errors: FieldErrors<TFieldValues>,
) {
  for (const [feld, fehlermeldung] of Object.entries(extractErrors(errors))) {
    posthog.capture("eingabe_validierungsfehler", {
      feld,
      fehlermeldung,
    });
  }
}

function extractErrors(
  errors: Record<string, unknown>,
  prefix?: string,
): Record<string, string> {
  return Object.entries(errors).reduce<Record<string, string>>(
    (result, [key, value]) => {
      if (!isRecord(value)) return result;

      const path = prefix ? `${prefix}.${key}` : key;

      if (typeof value["message"] === "string" && value["message"]) {
        return { ...result, [path]: value["message"] };
      }

      return { ...result, ...extractErrors(value, path) };
    },
    {},
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("extractErrors", () => {
    it("extracts flat errors", () => {
      const formError = { name: { message: "Pflichtfeld", type: "required" } };

      expect(extractErrors(formError)).toEqual({ name: "Pflichtfeld" });
    });

    it("extracts nested errors with dot-separated paths", () => {
      const formError = {
        address: { city: { message: "Pflichtfeld", type: "required" } },
      };

      expect(extractErrors(formError)).toEqual({
        "address.city": "Pflichtfeld",
      });
    });

    it("extracts errors from array-like indices", () => {
      const formError = {
        zeiten: { 0: { von: { message: "Ungültig", type: "invalid" } } },
      };

      expect(extractErrors(formError)).toEqual({ "zeiten.0.von": "Ungültig" });
    });

    it("skips entries without a message string", () => {
      expect(extractErrors({ tags: { type: "required" } })).toEqual({});
    });

    it("returns empty object when there are no errors", () => {
      expect(extractErrors({})).toEqual({});
    });
  });

  const { beforeEach, afterEach, vi } = import.meta.vitest;

  describe("useValidierungsfehlerTracking", async () => {
    const { render, screen, act } = await import("@testing-library/react");
    const { userEvent } = await import("@testing-library/user-event");
    const { useForm } = await import("react-hook-form");

    const { posthog } = await import("../posthog");

    let captureSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      captureSpy = vi.spyOn(posthog, "capture").mockReturnValue(undefined);
    });

    afterEach(() => vi.restoreAllMocks());

    function TestForm() {
      const { handleSubmit, register, subscribe } = useForm({
        defaultValues: { feld: "" },
      });

      useValidierungsfehlerTracking(subscribe);

      return (
        <form onSubmit={handleSubmit(() => {})}>
          <input
            {...register("feld", { required: "Dieses Feld ist erforderlich" })}
          />
          <button type="submit">Weiter</button>
        </form>
      );
    }

    it("captures an event when a validation error first appears", async () => {
      render(<TestForm />);

      await userEvent.click(screen.getByRole("button", { name: "Weiter" }));

      expect(captureSpy).toHaveBeenCalledWith("eingabe_validierungsfehler", {
        feld: "feld",
        fehlermeldung: "Dieses Feld ist erforderlich",
      });
    });

    it("captures again when the same error persists on repeated submissions", async () => {
      render(<TestForm />);

      await userEvent.click(screen.getByRole("button", { name: "Weiter" }));
      await userEvent.click(screen.getByRole("button", { name: "Weiter" }));

      expect(captureSpy).toHaveBeenCalledTimes(2);
    });

    it("does not capture on mount when the form has no errors", async () => {
      render(<TestForm />);

      await act(async () => {});

      expect(captureSpy).not.toHaveBeenCalled();
    });

    function TestFormMehrereEingaben() {
      const { handleSubmit, register, subscribe } = useForm({
        defaultValues: { erstesFeld: "", zweitesFeld: "" },
      });

      useValidierungsfehlerTracking(subscribe);

      return (
        <form onSubmit={handleSubmit(() => {})}>
          <input
            {...register("erstesFeld", {
              required: "Dieses Feld ist erforderlich",
            })}
          />
          <input
            {...register("zweitesFeld", {
              required: "Dieses Feld ist erforderlich",
            })}
          />
          <button type="submit">Weiter</button>
        </form>
      );
    }

    it("captures all events when multiple validation errors appear at once", async () => {
      render(<TestFormMehrereEingaben />);

      await userEvent.click(screen.getByRole("button", { name: "Weiter" }));

      expect(captureSpy).toHaveBeenCalledWith("eingabe_validierungsfehler", {
        feld: "erstesFeld",
        fehlermeldung: "Dieses Feld ist erforderlich",
      });

      expect(captureSpy).toHaveBeenCalledWith("eingabe_validierungsfehler", {
        feld: "zweitesFeld",
        fehlermeldung: "Dieses Feld ist erforderlich",
      });
    });
  });
}
