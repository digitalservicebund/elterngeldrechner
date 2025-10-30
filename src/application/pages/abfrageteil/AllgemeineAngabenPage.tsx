import { useId } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/application/components";
import { AllgemeineAngabenForm } from "@/application/features/abfrageteil";
import {
  StepAllgemeineAngabenState,
  stepAllgemeineAngabenSlice,
} from "@/application/features/abfrageteil/state";
import { Page } from "@/application/pages/Page";
import { useAppStore } from "@/application/redux/hooks";
import { formSteps } from "@/application/routing/formSteps";

export function AllgemeineAngabenPage() {
  const store = useAppStore();
  const navigate = useNavigate();

  const formIdentifier = useId();
  const initialState = store.getState().stepAllgemeineAngaben;

  const onFormSubmission = (data: StepAllgemeineAngabenState) => {
    store.dispatch(stepAllgemeineAngabenSlice.actions.submitStep(data));
    void navigate(formSteps.nachwuchs.route);
  };

  return (
    <Page step={formSteps.allgemeinAngaben}>
      <div className="flex flex-col gap-56">
        <AllgemeineAngabenForm
          id={formIdentifier}
          defaultValues={initialState}
          onSubmit={onFormSubmission}
        />

        <div>
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

  describe("Allgemeine Angaben Page", async () => {
    const { userEvent } = await import("@testing-library/user-event");
    const { render, screen } = await import("@/application/test-utils");
    const { YesNo } = await import("@/application/features/abfrageteil/state");
    const { INITIAL_STATE } = await import("@/application/test-utils");
    const { produce } = await import("immer");

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
      const { store } = render(<AllgemeineAngabenPage />);

      await userEvent.selectOptions(
        screen.getByLabelText(
          "In welchem Bundesland planen Sie Elterngeld zu beantragen?",
        ),
        "Berlin",
      );
      await userEvent.click(screen.getByLabelText("Ja"));
      await userEvent.click(screen.getByTestId("mutterschutz_option_0"));
      await userEvent.click(screen.getByText("Weiter"));

      expect(store.getState().stepAllgemeineAngaben).toMatchObject({
        antragstellende: "EinenElternteil",
        alleinerziehend: YesNo.YES,
        mutterschutz: "ET1",
      });
    });

    it("should persist the pseudonym", async () => {
      const { store } = render(<AllgemeineAngabenPage />);

      await userEvent.selectOptions(
        screen.getByLabelText(
          "In welchem Bundesland planen Sie Elterngeld zu beantragen?",
        ),
        "Berlin",
      );
      await userEvent.click(screen.getByLabelText("Nein"));
      await userEvent.click(
        screen.getByLabelText(
          "Ja, beide Elternteile sollen Elterngeld bekommen",
        ),
      );
      await userEvent.type(
        screen.getByLabelText("Name für Elternteil 1"),
        "Finn",
      );
      await userEvent.type(
        screen.getByLabelText("Name für Elternteil 2"),
        "Fiona",
      );
      await userEvent.click(screen.getByTestId("mutterschutz_option_0"));
      await userEvent.click(screen.getByText("Weiter"));

      expect(store.getState().stepAllgemeineAngaben).toMatchObject({
        alleinerziehend: YesNo.NO,
        antragstellende: "FuerBeide",
        mutterschutz: "ET1",
        pseudonym: {
          ET1: "Finn",
          ET2: "Fiona",
        },
      });
    });

    it("should reset alleinerziehend if Antragstellende für beide", async () => {
      const preloadedState = produce(INITIAL_STATE, (draft) => {
        draft.stepAllgemeineAngaben.antragstellende = "EinenElternteil";
        draft.stepAllgemeineAngaben.alleinerziehend = YesNo.YES;
      });

      const { store } = render(<AllgemeineAngabenPage />, { preloadedState });

      await userEvent.selectOptions(
        screen.getByLabelText(
          "In welchem Bundesland planen Sie Elterngeld zu beantragen?",
        ),
        "Berlin",
      );
      await userEvent.click(screen.getByLabelText("Nein"));
      await userEvent.click(
        screen.getByLabelText(
          "Ja, beide Elternteile sollen Elterngeld bekommen",
        ),
      );
      await userEvent.type(
        screen.getByLabelText("Name für Elternteil 1"),
        "Finn",
      );
      await userEvent.type(
        screen.getByLabelText("Name für Elternteil 2"),
        "Fiona",
      );
      await userEvent.click(screen.getByTestId("mutterschutz_option_2"));
      await userEvent.click(screen.getByText("Weiter"));

      expect(store.getState().stepAllgemeineAngaben).toMatchObject({
        antragstellende: "FuerBeide",
        alleinerziehend: YesNo.NO,
        mutterschutz: YesNo.NO,
      });
    });
  });
}
