import { useId } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/application/components";
import { ErwerbstaetigkeitForm } from "@/application/features/abfrageteil";
import {
  StepErwerbstaetigkeitState,
  stepAllgemeineAngabenSelectors,
  stepAllgemeineAngabenSlice,
  stepErwerbstaetigkeitSlice,
} from "@/application/features/abfrageteil/state";
import { Page } from "@/application/pages/Page";
import { useAppSelector, useAppStore } from "@/application/redux/hooks";
import { formSteps } from "@/application/routing/formSteps";

export function ErwerbstaetigkeitPage() {
  const store = useAppStore();
  const navigate = useNavigate();

  const formIdentifier = useId();
  const initialState = store.getState().stepErwerbstaetigkeit;

  const onFormSubmission = (values: StepErwerbstaetigkeitState) => {
    store.dispatch(stepErwerbstaetigkeitSlice.actions.submitStep(values));
    void navigate(formSteps.einkommen.route);
  };

  const antragssteller = useAppSelector(
    stepAllgemeineAngabenSelectors.getAntragssteller,
  );

  const { ET1, ET2 } = useAppSelector(
    stepAllgemeineAngabenSelectors.getElternteilNames,
  );

  return (
    <Page step={formSteps.erwerbstaetigkeit}>
      <div className="flex flex-col gap-56">
        <ErwerbstaetigkeitForm
          id={formIdentifier}
          nameElternteilEins={ET1}
          nameElternteilZwei={ET2}
          antragssteller={antragssteller}
          initialState={initialState}
          onSubmit={onFormSubmission}
        />

        <div className="flex gap-16">
          <Button
            type="button"
            buttonStyle="secondary"
            onClick={() => navigate(formSteps.nachwuchs.route)}
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

  describe("Erwerbstaetigkeit Page", async () => {
    const { userEvent } = await import("@testing-library/user-event");
    const { INITIAL_STATE, render, screen } = await import(
      "@/application/test-utils"
    );
    const { produce } = await import("immer");

    const { YesNo } = await import("@/application/features/abfrageteil/state");

    beforeEach(() => {
      vi.mock(import("react-router-dom"), async (importOriginal) => {
        const actual = await importOriginal();

        return {
          ...actual,
          useNavigate: () => vi.fn(),
        };
      });
    });

    const preloadedState = produce(INITIAL_STATE, (draft) => {
      draft.stepAllgemeineAngaben.antragstellende = "FuerBeide";
    });

    it("should persist the step", async () => {
      const { store } = render(<ErwerbstaetigkeitPage />, { preloadedState });

      // ET1:
      await userEvent.click(screen.getByTestId("ET1.vorGeburt_option_0"));
      await userEvent.click(
        screen.getByLabelText("Einkünfte aus nichtselbständiger Arbeit"),
      );
      await userEvent.click(
        screen.getByTestId("ET1.mehrereTaetigkeiten_option_1"),
      );
      await userEvent.click(
        screen.getByTestId("ET1.sozialVersicherungsPflichtig_option_0"),
      );
      await userEvent.click(
        screen.getByTestId("ET1.monatlichesBrutto_option_1"),
      );

      // ET2:
      await userEvent.click(screen.getByTestId("ET2.vorGeburt_option_1"));

      await userEvent.click(screen.getByText("Weiter"));

      expect(store.getState().stepErwerbstaetigkeit).toMatchObject({
        ET1: {
          vorGeburt: YesNo.YES,
          isNichtSelbststaendig: true,
          mehrereTaetigkeiten: YesNo.NO,
          sozialVersicherungsPflichtig: YesNo.YES,
          monatlichesBrutto: "MehrAlsMiniJob",
        },
        ET2: {
          vorGeburt: YesNo.NO,
        },
      });
    });

    it("should persist the step for mehreren Tätigkeiten", async () => {
      const { store } = render(<ErwerbstaetigkeitPage />, { preloadedState });

      // ET1:
      await userEvent.click(screen.getByTestId("ET1.vorGeburt_option_0"));
      await userEvent.click(
        screen.getByLabelText("Einkünfte aus nichtselbständiger Arbeit"),
      );
      await userEvent.click(
        screen.getByTestId("ET1.mehrereTaetigkeiten_option_0"),
      );

      // ET2:
      await userEvent.click(screen.getByTestId("ET2.vorGeburt_option_1"));

      await userEvent.click(screen.getByText("Weiter"));

      expect(store.getState().stepErwerbstaetigkeit).toMatchObject({
        ET1: {
          vorGeburt: YesNo.YES,
          isNichtSelbststaendig: true,
          mehrereTaetigkeiten: YesNo.YES,
          sozialVersicherungsPflichtig: null,
          monatlichesBrutto: null,
        },
        ET2: {
          vorGeburt: YesNo.NO,
        },
      });
    });

    it("should reset the state of elternteil zwei after antragsteller changed", async () => {
      const { store } = render(<ErwerbstaetigkeitPage />, { preloadedState });

      // Elternteil 1
      await userEvent.click(screen.getByTestId("ET1.vorGeburt_option_1"));

      // Elternteil 2
      await userEvent.click(screen.getByTestId("ET2.vorGeburt_option_0"));
      await userEvent.click(
        screen.getByLabelText("Einkünfte aus nichtselbständiger Arbeit"),
      );
      await userEvent.click(
        screen.getByTestId("ET2.mehrereTaetigkeiten_option_1"),
      );
      await userEvent.click(
        screen.getByTestId("ET2.sozialVersicherungsPflichtig_option_0"),
      );
      await userEvent.click(
        screen.getByTestId("ET2.monatlichesBrutto_option_1"),
      );

      await userEvent.click(screen.getByText("Weiter"));

      expect(store.getState().stepErwerbstaetigkeit).toMatchObject({
        ET1: {
          vorGeburt: YesNo.NO,
        },
        ET2: {
          vorGeburt: YesNo.YES,
          isNichtSelbststaendig: true,
          mehrereTaetigkeiten: YesNo.NO,
          sozialVersicherungsPflichtig: YesNo.YES,
          monatlichesBrutto: "MehrAlsMiniJob",
        },
      });

      store.dispatch(
        stepAllgemeineAngabenSlice.actions.submitStep({
          ...preloadedState.stepAllgemeineAngaben,
          antragstellende: "EinenElternteil",
        }),
      );

      await userEvent.click(screen.getByText("Weiter"));

      expect(store.getState().stepErwerbstaetigkeit).toMatchObject({
        ET1: {
          vorGeburt: YesNo.NO,
        },
        ET2: {
          vorGeburt: null,
        },
      });
    });
  });
}
