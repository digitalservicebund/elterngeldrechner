import { SubmitHandler, useForm } from "react-hook-form";
import { useId } from "react";
import {
  Antragstellende,
  StepAllgemeineAngabenState,
} from "@/redux/stepAllgemeineAngabenSlice";
import {
  ButtonGroup,
  CustomInput,
  CustomRadioGroup,
  CustomRadioGroupOption,
  Split,
  YesNoRadio,
} from "@/components/molecules";
import { YesNo } from "@/globals/js/calculations/model";
import { InfoDialog, infoTexts } from "@/components/molecules/info-dialog";

const antragstellendeLabels: { [K in Antragstellende]: string } = {
  FuerBeide: "Für beide",
  EinenElternteil: "Für einen Elternteil",
};

const antragstellendeOptions: CustomRadioGroupOption<Antragstellende>[] = [
  { value: "FuerBeide", label: antragstellendeLabels.FuerBeide },
  { value: "EinenElternteil", label: antragstellendeLabels.EinenElternteil },
];

interface AllgemeineAngabenFormProps {
  readonly initialValues: StepAllgemeineAngabenState;
  readonly onSubmit: SubmitHandler<StepAllgemeineAngabenState>;
}

export function AllgemeineAngabenForm({
  initialValues,
  onSubmit,
}: AllgemeineAngabenFormProps) {
  const { register, handleSubmit, watch, formState } = useForm({
    defaultValues: initialValues,
  });

  const antragstellendeFormValue = watch("antragstellende");
  const mutterschaftssleistungenFormValue = watch("mutterschaftssleistungen");

  const mutteschaftsleistungenOptions: CustomRadioGroupOption[] = [
    { value: "ET1", label: watch("pseudonym.ET1") || "Elternteil 1" },
    { value: "ET2", label: watch("pseudonym.ET2") || "Elternteil 2" },
  ];

  const showMutterschaftsleistungsWerGroup =
    antragstellendeFormValue === "FuerBeide" &&
    mutterschaftssleistungenFormValue === YesNo.YES;

  const elternHeadingIdentifier = useId();
  const namenHeadingIdentifier = useId();
  const alleinerziehendHeadindIdentifier = useId();
  const mutterschaftsleistungenHeadingIdentifier = useId();

  return (
    <form
      className="flex flex-col gap-32"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <h2 className="mb-10">Allgemeine Angaben</h2>

      <section className="-mt-32" aria-labelledby={elternHeadingIdentifier}>
        <h3 id={elternHeadingIdentifier} className="mb-10">
          Eltern
        </h3>

        <CustomRadioGroup
          legend="Für wen planen Sie Elterngeld?"
          register={register}
          registerOptions={{ required: "Dieses Feld ist erforderlich" }}
          name="antragstellende"
          errors={formState.errors}
          options={antragstellendeOptions}
          required
        />
      </section>

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

      {antragstellendeFormValue === "EinenElternteil" && (
        <section aria-labelledby={alleinerziehendHeadindIdentifier}>
          <h3 id={alleinerziehendHeadindIdentifier} className="mb-10">
            Alleinerziehendenstatus
          </h3>

          <YesNoRadio
            legend={
              <div className="flex items-center justify-between">
                <span>Sind Sie alleinerziehend?</span>
                <InfoDialog info={infoTexts.alleinerziehend} />
              </div>
            }
            register={register}
            registerOptions={{ required: "Dieses Feld ist erforderlich" }}
            name="alleinerziehend"
            errors={formState.errors}
            required
          />
        </section>
      )}

      {antragstellendeFormValue !== null && (
        <section aria-labelledby={mutterschaftsleistungenHeadingIdentifier}>
          <h3 id={mutterschaftsleistungenHeadingIdentifier} className="mb-10">
            Mutterschaftsleistungen
          </h3>

          <YesNoRadio
            legend={
              <div className="flex items-center justify-between">
                <span>Beziehen Sie Mutterschaftsleistungen?</span>
                <InfoDialog info={infoTexts.mutterschaftsleistungen} />
              </div>
            }
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

      <ButtonGroup isStepOne />
    </form>
  );
}
