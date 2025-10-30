import { useId } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/application/components";
import { NachwuchsForm } from "@/application/features/abfrageteil";
import {
  StepNachwuchsState,
  parseGermanDateString,
  stepNachwuchsSlice,
} from "@/application/features/abfrageteil/state";
import { Page } from "@/application/pages/Page";
import { useAppStore } from "@/application/redux/hooks";
import { formSteps } from "@/application/routing/formSteps";
import { trackNutzergruppe } from "@/application/user-tracking";

export function NachwuchsPage() {
  const store = useAppStore();
  const navigate = useNavigate();

  const formIdentifier = useId();
  const initialState = store.getState().stepNachwuchs;

  const onFormSubmission = (values: StepNachwuchsState) => {
    store.dispatch(stepNachwuchsSlice.actions.submitStep(values));

    trackNutzergruppe(
      parseGermanDateString(values.wahrscheinlichesGeburtsDatum),
    );

    void navigate(formSteps.erwerbstaetigkeit.route);
  };

  return (
    <Page step={formSteps.nachwuchs}>
      <div className="flex flex-col gap-56">
        <NachwuchsForm
          id={formIdentifier}
          defaultValues={initialState}
          onSubmit={onFormSubmission}
        />

        <div className="flex gap-16">
          <Button
            type="button"
            buttonStyle="secondary"
            onClick={() => navigate(formSteps.allgemeinAngaben.route)}
          >
            Zurück
          </Button>

          <Button type="submit" form={formIdentifier}>
            Weiter
          </Button>
        </div>
      </div>
    </Page>
  );
}

if (import.meta.vitest) {
  const { describe, it, expect, vi, beforeEach } = import.meta.vitest;

  const currentYear = new Date().getFullYear();

  describe("Nachwuchs Page", async () => {
    const { userEvent } = await import("@testing-library/user-event");
    const { render, screen } = await import("@/application/test-utils");

    beforeEach(() => {
      vi.mock(import("react-router-dom"), async (importOriginal) => {
        const actual = await importOriginal();

        return {
          ...actual,
          useNavigate: () => vi.fn(),
        };
      });
    });

    it("should persist the step", async () => {
      const { store } = render(<NachwuchsPage />);

      for (let i = 0; i < 2; i++) {
        await userEvent.click(screen.getByTestId("erhöhen"));
      }

      await userEvent.type(
        screen.getByRole("textbox", {
          name: "Geburtsdatum des Kindes",
        }),
        "a12.12lasd!" + currentYear,
      );

      const addButton = screen.getByRole("button", {
        name: /älteres geschwisterkind hinzufügen/i,
      });
      await userEvent.click(addButton);

      const dateFieldGeschwister = screen.getByLabelText(
        "Wann wurde das Geschwisterkind geboren?",
      );

      await userEvent.type(dateFieldGeschwister, "01031985");

      const checkbox = screen.getByLabelText(
        "Das Geschwisterkind hat eine Behinderung",
      );

      await userEvent.click(checkbox);

      await userEvent.click(screen.getByText("Weiter"));

      expect(store.getState().stepNachwuchs).toMatchObject({
        anzahlKuenftigerKinder: 3,
        wahrscheinlichesGeburtsDatum: "12.12." + currentYear,
        geschwisterkinder: [
          {
            geburtsdatum: "01.03.1985",
            istBehindert: true,
          },
        ],
      });
    });
  });
}
