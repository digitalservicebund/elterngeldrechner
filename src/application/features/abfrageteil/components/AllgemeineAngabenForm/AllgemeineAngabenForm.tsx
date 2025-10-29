import { FieldError, get, useForm } from "react-hook-form";
import { InfoZuAlleinerziehenden } from "./InfoFuerAlleinerziehenden";
import { InfoZuAntragstellenden } from "./InfoZuAntragstellenden";
import { InfoZuVornamen } from "./InfoZuVornamen";
import { InfoZumMutterschutz } from "./InfoZumMutterschutz";
import {
  CustomRadioGroup,
  CustomRadioGroupOption,
} from "@/application/components";
import { Alert } from "@/application/components/Alert";
import {
  CustomSelect,
  SelectOption,
  YesNoRadio,
} from "@/application/features/abfrageteil/components/common";
import {
  StepAllgemeineAngabenState,
  YesNo,
} from "@/application/features/abfrageteil/state";
import { bundeslaender } from "@/application/features/pdfAntrag";

const antragstellendeOptions: CustomRadioGroupOption[] = [
  {
    value: "FuerBeide",
    label: "Ja, beide Elternteile sollen Elterngeld bekommen",
  },
  {
    value: "EinenElternteil",
    label: "Nein, ein Elternteil kann oder möchte kein Elterngeld bekommen",
  },
  {
    value: "FuerBeideUnentschlossen",
    label: "Wir wissen es noch nicht: Ein Elternteil überlegt noch",
  },
];

type Props = {
  readonly id?: string;
  readonly initialState?: StepAllgemeineAngabenState;
  readonly onSubmit?: (data: StepAllgemeineAngabenState) => void;
};

export function AllgemeineAngabenForm({ id, initialState, onSubmit }: Props) {
  const { register, handleSubmit, watch, formState, setValue } = useForm({
    defaultValues: initialState,
  });

  const submitAllgemeineAngaben = (values: StepAllgemeineAngabenState) => {
    onSubmit?.(values);
  };

  const antragstellendeFormValue = watch("antragstellende");
  const alleinerziehendenFormValue = watch("alleinerziehend");

  const pseudonymFormValue = watch("pseudonym");

  const pseudonym1Error = get(formState.errors, "pseudonym.ET1") as
    | FieldError
    | undefined;
  const pseudonym2Error = get(formState.errors, "pseudonym.ET2") as
    | FieldError
    | undefined;

  const initializeAntragstellendeIfAlleinerziehend = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if ((event.target.value as YesNo) === YesNo.YES) {
      setValue("antragstellende", "EinenElternteil");
    }
  };

  const bundeslandOptions: SelectOption<string>[] = bundeslaender.map(
    (bundesland) => ({ value: bundesland.name, label: bundesland.name }),
  );

  return (
    <form
      id={id}
      className="flex flex-col gap-56"
      onSubmit={handleSubmit(submitAllgemeineAngaben)}
      noValidate
    >
      <CustomSelect
        autoWidth
        register={register}
        registerOptions={{
          required: "Ein Bundesland muss ausgewählt sein",
        }}
        name="bundesland"
        label="In welchem Bundesland planen Sie Elterngeld zu beantragen?"
        errors={formState.errors}
        options={bundeslandOptions}
        required
      />

      <YesNoRadio
        legend="Sind Sie alleinerziehend?"
        register={register}
        registerOptions={{
          required: "Dieses Feld ist erforderlich",
          onChange: initializeAntragstellendeIfAlleinerziehend,
        }}
        name="alleinerziehend"
        errors={formState.errors}
        required
        slotBetweenLegendAndOptions={<InfoZuAlleinerziehenden />}
      />

      {alleinerziehendenFormValue === YesNo.NO && (
        <CustomRadioGroup
          legend="Sollen beide Elternteile Elterngeld bekommen? Dann bekommen beide mehr und länger Elterngeld."
          register={register}
          registerOptions={{ required: "Dieses Feld ist erforderlich" }}
          name="antragstellende"
          errors={formState.errors}
          options={antragstellendeOptions}
          required
          slotBetweenLegendAndOptions={<InfoZuAntragstellenden />}
        />
      )}

      {antragstellendeFormValue === "FuerBeideUnentschlossen" && (
        <Alert headline="Hinweis" className="-mt-20">
          Auf den nächsten Seiten planen Sie Ihr Elterngeld gemeinsam mit dem
          anderen Elternteil. So sehen Sie, welche Vorteile es hat, wenn Sie
          zusammen planen. Außerdem bekommen Sie einen Überblick, wie Sie das
          Geld aufteilen können.
        </Alert>
      )}

      {(antragstellendeFormValue === "FuerBeide" ||
        antragstellendeFormValue === "FuerBeideUnentschlossen") && (
        <fieldset>
          <legend>Bitte geben Sie Ihre Vornamen an.</legend>

          <InfoZuVornamen />
          <div className="flex flex-wrap gap-x-56 gap-y-16 pt-16">
            <div>
              <label className="flex flex-col gap-8">
                Name für Elternteil 1
                <input
                  className={CLASS_NAME_PSEUDONYM_INPUT}
                  {...register("pseudonym.ET1", {
                    required: "Dieses Feld ist erforderlich",
                  })}
                  required
                />
              </label>
              {!!pseudonym1Error && (
                <span className="mt-8 text-14 text-danger">
                  {pseudonym1Error.message}
                </span>
              )}
            </div>

            <div>
              <label className="flex flex-col gap-8">
                Name für Elternteil 2
                <input
                  className={CLASS_NAME_PSEUDONYM_INPUT}
                  {...register("pseudonym.ET2", {
                    required: "Dieses Feld ist erforderlich",
                  })}
                  required
                />
              </label>
              {!!pseudonym2Error && (
                <span className="mt-8 text-14 text-danger">
                  {pseudonym2Error.message}
                </span>
              )}
            </div>
          </div>
        </fieldset>
      )}

      {((alleinerziehendenFormValue === YesNo.NO &&
        antragstellendeFormValue !== null) ||
        alleinerziehendenFormValue === YesNo.YES) && (
        <CustomRadioGroup
          legend="Sind Sie im Mutterschutz oder werden Sie im Mutterschutz sein?"
          register={register}
          registerOptions={{ required: "Dieses Feld ist erforderlich" }}
          name="mutterschutz"
          errors={formState.errors}
          required
          options={
            alleinerziehendenFormValue === YesNo.YES ||
            antragstellendeFormValue === "EinenElternteil"
              ? [
                  {
                    label: "Ja, ich bin oder werde im Mutterschutz sein",
                    value: "ET1",
                  },
                  {
                    label:
                      "Nein, ich bin nicht oder werde nicht im Mutterschutz sein",
                    value: YesNo.NO,
                  },
                  { label: "Ich weiß es noch nicht", value: YesNo.NO },
                ]
              : [
                  {
                    label: `Ja, ${pseudonymFormValue.ET1 || "Elternteil 1"} ist oder wird im Mutterschutz sein`,
                    value: "ET1",
                  },
                  {
                    label: `Ja, ${pseudonymFormValue.ET2 || "Elternteil 2"} ist oder wird im Mutterschutz sein`,
                    value: "ET2",
                  },
                  {
                    label:
                      "Nein, kein Elternteil ist oder wird im Mutterschutz sein",
                    value: YesNo.NO,
                  },
                  { label: "Ich weiß es noch nicht", value: YesNo.NO },
                ]
          }
          slotBetweenLegendAndOptions={<InfoZumMutterschutz />}
        />
      )}
    </form>
  );
}

// TODO: style dictionary / TailwindCSS component?
const CLASS_NAME_PSEUDONYM_INPUT =
  "max-w-[14.25rem] border border-solid border-grey-dark px-16 py-8 focus:!outline focus:!outline-2 focus:!outline-primary";

if (import.meta.vitest) {
  const { describe, expect, it } = import.meta.vitest;

  describe("Allgemeine Angaben Form", async () => {
    const { render, screen } = await import("@/application/test-utils");
    const { userEvent } = await import("@testing-library/user-event");

    const initialState: StepAllgemeineAngabenState = {
      bundesland: null,
      antragstellende: null,
      pseudonym: {
        ET1: "",
        ET2: "",
      },
      alleinerziehend: null,
      mutterschutz: null,
    };

    it("should display the Alleinerziehendenstatus part of the form right away", () => {
      render(<AllgemeineAngabenForm initialState={initialState} />);

      expect(screen.getByText("Sind Sie alleinerziehend?")).toBeInTheDocument();
    });

    it("should display the Antragstellenden part of the form after the Alleinerziehendenstatus", async () => {
      render(<AllgemeineAngabenForm initialState={initialState} />);

      await userEvent.click(screen.getByLabelText("Nein"));

      expect(
        screen.getByText(
          "Sollen beide Elternteile Elterngeld bekommen? Dann bekommen beide mehr und länger Elterngeld.",
        ),
      ).toBeInTheDocument();
    });

    it("should display the optional naming part of the form after the Antragstellenden part", async () => {
      render(<AllgemeineAngabenForm initialState={initialState} />);

      await userEvent.click(screen.getByLabelText("Nein"));

      await userEvent.click(
        screen.getByLabelText(
          "Ja, beide Elternteile sollen Elterngeld bekommen",
        ),
      );

      expect(screen.getByText("Name für Elternteil 1")).toBeInTheDocument();
      expect(screen.getByText("Name für Elternteil 2")).toBeInTheDocument();
    });

    it("should ask for Mutterschutz if Gemeinsam Erziehende", async () => {
      render(<AllgemeineAngabenForm initialState={initialState} />);

      await userEvent.click(screen.getByLabelText("Nein"));

      await userEvent.click(
        screen.getByLabelText(
          "Ja, beide Elternteile sollen Elterngeld bekommen",
        ),
      );

      expect(
        screen.getByText(
          "Sind Sie im Mutterschutz oder werden Sie im Mutterschutz sein?",
        ),
      ).toBeInTheDocument();
    });

    it("should show correct Mutterschutz options if Gemeinsam Erziehende", async () => {
      render(<AllgemeineAngabenForm initialState={initialState} />);

      await userEvent.click(screen.getByLabelText("Nein"));

      await userEvent.click(
        screen.getByLabelText(
          "Ja, beide Elternteile sollen Elterngeld bekommen",
        ),
      );

      expect(
        screen.getByText("Ja, Elternteil 1 ist oder wird im Mutterschutz sein"),
      ).toBeInTheDocument();

      expect(
        screen.getByText("Ja, Elternteil 2 ist oder wird im Mutterschutz sein"),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "Nein, kein Elternteil ist oder wird im Mutterschutz sein",
        ),
      ).toBeInTheDocument();

      expect(screen.getByText("Ich weiß es noch nicht")).toBeInTheDocument();
    });

    it("should ask for Mutterschutz if Alleinerziehend", async () => {
      render(<AllgemeineAngabenForm initialState={initialState} />);

      await userEvent.click(screen.getByLabelText("Ja"));

      expect(
        screen.getByText(
          "Sind Sie im Mutterschutz oder werden Sie im Mutterschutz sein?",
        ),
      ).toBeInTheDocument();
    });

    it("should show correct Mutterschutz options if Alleinerziehend", async () => {
      render(<AllgemeineAngabenForm initialState={initialState} />);

      await userEvent.click(screen.getByLabelText("Ja"));

      expect(
        screen.getByText("Ja, ich bin oder werde im Mutterschutz sein"),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "Nein, ich bin nicht oder werde nicht im Mutterschutz sein",
        ),
      ).toBeInTheDocument();

      expect(screen.getByText("Ich weiß es noch nicht")).toBeInTheDocument();
    });

    it("should show correct Mutterschutz options if Ein Elternteil", async () => {
      render(<AllgemeineAngabenForm initialState={initialState} />);

      await userEvent.click(screen.getByLabelText("Nein"));

      await userEvent.click(
        screen.getByLabelText(
          "Nein, ein Elternteil kann oder möchte kein Elterngeld bekommen",
        ),
      );

      expect(
        screen.getByText("Ja, ich bin oder werde im Mutterschutz sein"),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "Nein, ich bin nicht oder werde nicht im Mutterschutz sein",
        ),
      ).toBeInTheDocument();

      expect(screen.getByText("Ich weiß es noch nicht")).toBeInTheDocument();
    });
  });

  describe("Allgemeine Angaben Form Validation", async () => {
    const { fireEvent, renderForm, waitFor, screen } = await import(
      "@/application/test-utils"
    );

    const initialState: StepAllgemeineAngabenState = {
      bundesland: null,
      antragstellende: null,
      pseudonym: {
        ET1: "",
        ET2: "",
      },
      alleinerziehend: null,
      mutterschutz: null,
    };

    it("should show a validation error if some information is missing", async () => {
      const form = renderForm(AllgemeineAngabenForm, {
        initialState: initialState,
      });

      fireEvent.submit(form);

      await waitFor(() => {
        expect(
          screen.getByText("Dieses Feld ist erforderlich"),
        ).toBeInTheDocument();
      });
    });
  });
}
