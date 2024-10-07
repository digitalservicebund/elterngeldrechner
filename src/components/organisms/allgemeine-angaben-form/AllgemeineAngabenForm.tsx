import { SubmitHandler, useForm } from "react-hook-form";
import {
  Antragstellende,
  StepAllgemeineAngabenState,
} from "@/redux/stepAllgemeineAngabenSlice";
import {
  ButtonGroup,
  CustomInput,
  CustomRadio,
  FormFieldGroup,
  RadioOption,
  Split,
  YesNoRadio,
} from "@/components/molecules";
import { SplitItem } from "@/components/atoms";
import { YesNo } from "@/globals/js/calculations/model";
import { infoTexts } from "@/components/molecules/info-dialog";

const antragstellendeLabels: { [K in Antragstellende]: string } = {
  FuerBeide: "Für beide",
  EinenElternteil: "Für einen Elternteil",
};

const antragstellendeOptions: RadioOption<Antragstellende>[] = [
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

  const mutteschaftsleistungenOptions: RadioOption[] = [
    { value: "ET1", label: watch("pseudonym.ET1") || "Elternteil 1" },
    { value: "ET2", label: watch("pseudonym.ET2") || "Elternteil 2" },
  ];

  const showMutterschaftsleistungsWerGroup =
    antragstellendeFormValue === "FuerBeide" &&
    mutterschaftssleistungenFormValue === YesNo.YES;

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <h2 className="mb-10">Allgemeine Angaben</h2>
        <FormFieldGroup
          headline="Eltern"
          description="Für wen planen Sie Elterngeld?"
        >
          <CustomRadio
            register={register}
            registerOptions={{ required: "Dieses Feld ist erforderlich" }}
            name="antragstellende"
            errors={formState.errors}
            options={antragstellendeOptions}
            required
          />
        </FormFieldGroup>

        {antragstellendeFormValue === "FuerBeide" ? (
          <FormFieldGroup
            headline="Ihre Namen (optional)"
            description="Um auf die Begriffe Elternteil 1 und Elternteil 2 in den folgenden Schritten verzichten zu können, können Sie hier Ihre Namen oder ein Pseudonym angeben, welches wir dann verwenden werden."
          >
            <Split>
              <SplitItem>
                <CustomInput
                  register={register}
                  name="pseudonym.ET1"
                  label="Name für Elternteil 1"
                />
              </SplitItem>
              <SplitItem>
                <CustomInput
                  register={register}
                  name="pseudonym.ET2"
                  label="Name für Elternteil 2"
                />
              </SplitItem>
            </Split>
          </FormFieldGroup>
        ) : null}

        {antragstellendeFormValue === "EinenElternteil" ? (
          <FormFieldGroup
            headline="Alleinerziehendenstatus"
            description="Sind Sie alleinerziehend?"
            info={infoTexts.alleinerziehend}
          >
            <YesNoRadio
              register={register}
              registerOptions={{ required: "Dieses Feld ist erforderlich" }}
              name="alleinerziehend"
              errors={formState.errors}
              required
            />
          </FormFieldGroup>
        ) : null}
        <>
          {antragstellendeFormValue !== null ? (
            <>
              <FormFieldGroup
                headline="Mutterschaftsleistungen"
                description="Beziehen Sie Mutterschaftsleistungen?"
                info={infoTexts.mutterschaftsleistungen}
              >
                <YesNoRadio
                  register={register}
                  registerOptions={{ required: "Dieses Feld ist erforderlich" }}
                  name="mutterschaftssleistungen"
                  errors={formState.errors}
                  required
                />
              </FormFieldGroup>
              {!!showMutterschaftsleistungsWerGroup && (
                <FormFieldGroup description="Welcher Elternteil bezieht Mutterschaftsleistungen?">
                  <CustomRadio
                    register={register}
                    registerOptions={{
                      required: "Dieses Feld ist erforderlich",
                    }}
                    name="mutterschaftssleistungenWer"
                    options={mutteschaftsleistungenOptions}
                    errors={formState.errors}
                    required
                  />
                </FormFieldGroup>
              )}
            </>
          ) : null}
        </>
        <ButtonGroup isStepOne />
      </form>
    </>
  );
}
