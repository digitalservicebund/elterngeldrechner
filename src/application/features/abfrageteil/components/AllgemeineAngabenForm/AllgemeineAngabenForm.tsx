import { useCallback } from "react";
import { FieldError, get, useForm } from "react-hook-form";
import { InfoZuAlleinerziehenden } from "./InfoFuerAlleinerziehenden";
import { InfoZuAntragstellenden } from "./InfoZuAntragstellenden";
import { InfoZuVornamen } from "./InfoZuVornamen";
import { InfoZumMutterschutz } from "./InfoZumMutterschutz";
import {
  Button,
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
  stepAllgemeineAngabenSlice,
} from "@/application/features/abfrageteil/state";
import { bundeslaender } from "@/application/features/pdfAntrag";
import { useAppStore } from "@/application/redux/hooks";

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
  readonly onSubmit?: () => void;
  readonly hideSubmitButton?: boolean;
};

export function AllgemeineAngabenForm({
  id,
  onSubmit,
  hideSubmitButton,
}: Props) {
  const store = useAppStore();

  const { register, handleSubmit, watch, formState, setValue } = useForm({
    defaultValues: store.getState().stepAllgemeineAngaben,
  });

  const submitAllgemeineAngaben = useCallback(
    (values: StepAllgemeineAngabenState) => {
      store.dispatch(stepAllgemeineAngabenSlice.actions.submitStep(values));
      onSubmit?.();
    },
    [store, onSubmit],
  );

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

      {!hideSubmitButton && <Button type="submit">Weiter</Button>}
    </form>
  );
}

// TODO: style dictionary / TailwindCSS component?
const CLASS_NAME_PSEUDONYM_INPUT =
  "max-w-[14.25rem] border border-solid border-grey-dark px-16 py-8 focus:!outline focus:!outline-2 focus:!outline-primary";
