import { useCallback, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import ErwerbstaetigkeitFormElternteil from "./ErwerbstaetigkeitFormElternteil";
import { Split } from "@/application/features/abfrageteil/components/common";
import {
  type Antragstellende,
  type StepErwerbstaetigkeitState,
  initialStepErwerbstaetigkeitElternteil,
} from "@/application/features/abfrageteil/state";

type Props = {
  readonly id?: string;
  readonly nameElternteilEins: string;
  readonly nameElternteilZwei: string;
  readonly antragssteller: Antragstellende | null;
  readonly defaultValues?: StepErwerbstaetigkeitState;
  readonly onSubmit?: (data: StepErwerbstaetigkeitState) => void;
};

export function ErwerbstaetigkeitForm({
  id,
  antragssteller,
  nameElternteilEins,
  nameElternteilZwei,
  defaultValues,
  onSubmit,
}: Props) {
  const methods = useForm({
    defaultValues,
  });

  const { handleSubmit, setValue } = methods;

  const submitErwerbstaetigkeit = useCallback(
    (values: StepErwerbstaetigkeitState) => {
      onSubmit?.(values);
    },
    [onSubmit],
  );

  // reset state if ET2 is not displayed anymore
  useEffect(() => {
    if (antragssteller !== "FuerBeide") {
      setValue("ET2", initialStepErwerbstaetigkeitElternteil);
    }
  }, [antragssteller, setValue]);

  return (
    <FormProvider {...methods}>
      <form id={id} onSubmit={handleSubmit(submitErwerbstaetigkeit)} noValidate>
        <Split>
          <ErwerbstaetigkeitFormElternteil
            elternteil="ET1"
            elternteilName={nameElternteilEins}
            antragssteller={antragssteller}
          />

          {antragssteller === "FuerBeide" && (
            <ErwerbstaetigkeitFormElternteil
              elternteil="ET2"
              elternteilName={nameElternteilZwei}
              antragssteller={antragssteller}
            />
          )}
        </Split>
      </form>
    </FormProvider>
  );
}

if (import.meta.vitest) {
  const { describe, expect, it } = import.meta.vitest;

  describe("Erwerbstaetigkeit Form", async () => {
    const { render, screen } = await import("@/application/test-utils");
    const { userEvent } = await import("@testing-library/user-event");

    it("should show the pseudonym for Elternteil 1 and 2", () => {
      const [elternteilEins, elternteilZwei] = renderForm("FuerBeide");

      expect(screen.getByText(elternteilEins)).toBeInTheDocument();
      expect(screen.getByText(elternteilZwei)).toBeInTheDocument();
    });

    it("should expand the form options if Elternteil 1 is nicht Selbststaendig", async () => {
      renderForm("EinenElternteil");

      await userEvent.click(screen.getByTestId("ET1.vorGeburt_option_0"));
      await userEvent.click(
        screen.getByLabelText("Einkünfte aus nichtselbständiger Arbeit"),
      );

      expect(
        screen.getByText(
          "Bestand Ihre nichtselbständige Arbeit aus mehreren Tätigkeiten?",
        ),
      ).toBeInTheDocument();
      await userEvent.click(
        screen.getByTestId("ET1.mehrereTaetigkeiten_option_1"),
      );

      expect(
        screen.getByText(
          "Waren Sie in den 12 Monaten vor der Geburt Ihres Kindes sozialversicherungspflichtig?",
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Hatten Sie Einkommen aus einem Mini-Job?"),
      ).toBeInTheDocument();
    });

    it("should expand the form options if Elternteil 1 is nicht Selbststaendig and mehreren Tätigkeiten", async () => {
      renderForm("EinenElternteil");

      await userEvent.click(screen.getByTestId("ET1.vorGeburt_option_0"));
      await userEvent.click(
        screen.getByLabelText("Einkünfte aus nichtselbständiger Arbeit"),
      );

      expect(
        screen.getByText(
          "Bestand Ihre nichtselbständige Arbeit aus mehreren Tätigkeiten?",
        ),
      ).toBeInTheDocument();

      await userEvent.click(
        screen.getByTestId("ET1.mehrereTaetigkeiten_option_0"),
      );

      expect(
        screen.queryByText(
          "Waren Sie in den 12 Monaten vor der Geburt Ihres Kindes sozialversicherungspflichtig?",
        ),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("Hatten Sie Einkommen aus einem Mini-Job?"),
      ).not.toBeInTheDocument();
    });

    describe.each([["Gewinneinkünfte"]])(
      "when Elternteil has %s",
      (selbststaendigLabeltext: string) => {
        it("should not expand the form options", async () => {
          renderForm("FuerBeide");

          await userEvent.click(screen.getByTestId("ET1.vorGeburt_option_0"));
          await userEvent.click(screen.getByLabelText(selbststaendigLabeltext));

          expect(
            screen.queryByText(
              "Waren Sie in den 12 Monaten vor der Geburt Ihres Kindes sozialversicherungspflichtig?",
            ),
          ).not.toBeInTheDocument();
          expect(
            screen.queryByText("Hatten Sie Einkommen aus einem Mini-Job?"),
          ).not.toBeInTheDocument();
        });

        it("should not expand the form options for Mischeinkommen", async () => {
          renderForm("FuerBeide");

          await userEvent.click(screen.getByTestId("ET1.vorGeburt_option_0"));
          await userEvent.click(
            screen.getByLabelText("Einkünfte aus nichtselbständiger Arbeit"),
          );
          await userEvent.click(screen.getByLabelText(selbststaendigLabeltext));

          expect(
            screen.queryByText(
              "Waren Sie in den 12 Monaten vor der Geburt Ihres Kindes sozialversicherungspflichtig?",
            ),
          ).not.toBeInTheDocument();
          expect(
            screen.queryByText("Hatten Sie Einkommen aus einem Mini-Job?"),
          ).not.toBeInTheDocument();
        });
      },
    );

    function renderForm(antragstellende: Antragstellende): [string, string] {
      const elternteile: [string, string] = ["Finn", "Fiona"];

      render(
        <ErwerbstaetigkeitForm
          antragssteller={antragstellende}
          nameElternteilEins={elternteile[0]}
          nameElternteilZwei={elternteile[1]}
        />,
      );

      return elternteile;
    }
  });
}
