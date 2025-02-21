import { useId } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  ButtonGroup,
  CustomInput,
  CustomRadioGroup,
  CustomRadioGroupOption,
  Split,
  YesNoRadio,
} from "@/components/molecules";
import { infoTexts } from "@/components/molecules/info-dialog";
import {
  Antragstellende,
  StepAllgemeineAngabenState,
} from "@/redux/stepAllgemeineAngabenSlice";
import { YesNo } from "@/redux/yes-no";

const antragstellendeOptions: CustomRadioGroupOption<Antragstellende>[] = [
  { value: "FuerBeide", label: "Für zwei Elternteile" },
  { value: "EinenElternteil", label: "Für einen Elternteil" },
];

interface AllgemeineAngabenFormProps {
  readonly initialValues: StepAllgemeineAngabenState;
  readonly onSubmit: SubmitHandler<StepAllgemeineAngabenState>;
}

export function AllgemeineAngabenForm({
  initialValues,
  onSubmit,
}: AllgemeineAngabenFormProps) {
  const { register, handleSubmit, watch, formState, setValue } = useForm({
    defaultValues: initialValues,
  });

  const antragstellendeFormValue = watch("antragstellende");
  const alleinerziehendenFormValue = watch("alleinerziehend");
  const mutterschaftssleistungenFormValue = watch("mutterschaftssleistungen");

  const mutteschaftsleistungenOptions: CustomRadioGroupOption[] = [
    { value: "ET1", label: watch("pseudonym.ET1") || "Elternteil 1" },
    { value: "ET2", label: watch("pseudonym.ET2") || "Elternteil 2" },
  ];

  const alleinerziehendenOptions: CustomRadioGroupOption<YesNo>[] = [
    { value: YesNo.YES, label: "Alleinerziehende Person" },
    { value: YesNo.NO, label: "Gemeinsam Erziehende" },
  ];

  const showMutterschaftsleistungsWerGroup =
    antragstellendeFormValue === "FuerBeide" &&
    mutterschaftssleistungenFormValue === YesNo.YES;

  const elternHeadingIdentifier = useId();
  const namenHeadingIdentifier = useId();
  const alleinerziehendHeadindIdentifier = useId();
  const mutterschaftsleistungenHeadingIdentifier = useId();

  const initializeAntragstellendeIfAlleinerziehend = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if ((event.target.value as YesNo) === YesNo.YES) {
      setValue("antragstellende", "EinenElternteil");
    }
  };

  return (
    <form
      className="flex flex-col gap-32"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <section aria-labelledby={alleinerziehendHeadindIdentifier}>
        <h3 id={alleinerziehendHeadindIdentifier} className="mb-10">
          Alleinerziehendenstatus
        </h3>

        <CustomRadioGroup
          legend="Sind Sie alleinerziehend oder erziehen Sie das Kind mit jemandem zusammen?"
          info={infoTexts.alleinerziehend}
          register={register}
          registerOptions={{
            required: "Dieses Feld ist erforderlich",
            onChange: initializeAntragstellendeIfAlleinerziehend,
          }}
          name="alleinerziehend"
          errors={formState.errors}
          options={alleinerziehendenOptions}
          required
        />
      </section>

      {alleinerziehendenFormValue === YesNo.NO && (
        <section aria-labelledby={elternHeadingIdentifier}>
          <h3 id={elternHeadingIdentifier} className="mb-10">
            Eltern
          </h3>

          <CustomRadioGroup
            legend="Möchten Sie das Elterngeld für einen Elternteil oder zwei Elternteile berechnen?"
            register={register}
            registerOptions={{
              required: "Dieses Feld ist erforderlich",
            }}
            name="antragstellende"
            errors={formState.errors}
            options={antragstellendeOptions}
            required
          />
        </section>
      )}

      {antragstellendeFormValue === "FuerBeide" && (
        <section aria-labelledby={namenHeadingIdentifier}>
          <h3 id={namenHeadingIdentifier} className="mb-10">
            Ihre Namen (optional)
          </h3>

          <p>
            Um auf die Begriffe Elternteil 1 und Elternteil 2 in den folgenden
            Schritten verzichten zu können, können Sie hier Ihre Namen oder ein
            Pseudonym angeben, welches wir dann verwenden werden.
          </p>

          <Split>
            <CustomInput
              register={register}
              name="pseudonym.ET1"
              label="Name für Elternteil 1"
            />

            <CustomInput
              register={register}
              name="pseudonym.ET2"
              label="Name für Elternteil 2"
            />
          </Split>
        </section>
      )}

      {((alleinerziehendenFormValue === YesNo.NO &&
        antragstellendeFormValue !== null) ||
        alleinerziehendenFormValue === YesNo.YES) && (
        <section aria-labelledby={mutterschaftsleistungenHeadingIdentifier}>
          <h3 id={mutterschaftsleistungenHeadingIdentifier} className="mb-10">
            Mutterschaftsleistungen
          </h3>

          <YesNoRadio
            legend="Beziehen Sie Mutterschaftsleistungen?"
            info={infoTexts.mutterschaftsleistungen}
            register={register}
            registerOptions={{ required: "Dieses Feld ist erforderlich" }}
            name="mutterschaftssleistungen"
            errors={formState.errors}
            required
          />

          {!!showMutterschaftsleistungsWerGroup && (
            <CustomRadioGroup
              className="mt-32"
              legend="Welcher Elternteil bezieht Mutterschaftsleistungen?"
              register={register}
              registerOptions={{
                required: "Dieses Feld ist erforderlich",
              }}
              name="mutterschaftssleistungenWer"
              options={mutteschaftsleistungenOptions}
              errors={formState.errors}
              required
            />
          )}
        </section>
      )}

      <ButtonGroup />
    </form>
  );
}
