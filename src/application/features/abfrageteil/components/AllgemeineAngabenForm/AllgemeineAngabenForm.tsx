import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { CustomInput } from "./CustomInput";
import { InfoZuAlleinerziehenden } from "./InfoFuerAlleinerziehenden";
import { InfoZumMutterschutz } from "./InfoZumMutterschutz";
import {
  Button,
  CustomRadioGroup,
  CustomRadioGroupOption,
} from "@/application/components";
import { YesNoRadio } from "@/application/features/abfrageteil/components/common";
import {
  StepAllgemeineAngabenState,
  YesNo,
  stepAllgemeineAngabenSlice,
} from "@/application/features/abfrageteil/state";
import { useAppStore } from "@/application/redux/hooks";

const antragstellendeOptions: CustomRadioGroupOption[] = [
  { value: "EinenElternteil", label: "Für einen Elternteil" },
  { value: "FuerBeide", label: "Für zwei Elternteile" },
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

  const initializeAntragstellendeIfAlleinerziehend = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if ((event.target.value as YesNo) === YesNo.YES) {
      setValue("antragstellende", "EinenElternteil");
    }
  };

  return (
    <form
      id={id}
      className="flex flex-col gap-32"
      onSubmit={handleSubmit(submitAllgemeineAngaben)}
      noValidate
    >
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
          legend="Möchten Sie das Elterngeld für einen Elternteil oder zwei Elternteile berechnen?"
          register={register}
          registerOptions={{ required: "Dieses Feld ist erforderlich" }}
          name="antragstellende"
          errors={formState.errors}
          options={antragstellendeOptions}
          required
        />
      )}

      {antragstellendeFormValue === "FuerBeide" && (
        <div>
          <p className="mb-16">
            Um auf die Begriffe Elternteil 1 und Elternteil 2 in den folgenden
            Schritten verzichten zu können, können Sie hier Ihre Namen oder ein
            Pseudonym angeben, welches wir dann verwenden werden.
          </p>

          <div className="flex flex-wrap gap-x-56 gap-y-16">
            <CustomInput
              register={register}
              name="pseudonym.ET1"
              label="Name für Elternteil 1 (optional)"
            />

            <CustomInput
              register={register}
              name="pseudonym.ET2"
              label="Name für Elternteil 2 (optional)"
            />
          </div>
        </div>
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
