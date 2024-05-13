import { SubmitHandler, useForm } from "react-hook-form";
import {
  Antragstellende,
  StepAllgemeineAngabenState,
} from "../../../redux/stepAllgemeineAngabenSlice";
import {
  ButtonGroup,
  CustomInput,
  CustomRadio,
  FormFieldGroup,
  RadioOption,
  Split,
  YesNoRadio,
} from "../../molecules";
import { FC, useEffect } from "react";
import { SplitItem } from "../../atoms";
import { YesNo } from "../../../globals/js/calculations/model";
import { infoTexts } from "../../molecules/info-dialog";

export const antragstellendeLabels: { [K in Antragstellende]: string } = {
  FuerBeide: "Für beide",
  EinElternteil: "Ein Elternteil",
};

const antragstellendeOptions: RadioOption<Antragstellende>[] = [
  { value: "FuerBeide", label: antragstellendeLabels.FuerBeide },
  { value: "EinElternteil", label: antragstellendeLabels.EinElternteil },
];

interface AllgemeineAngabenFormProps {
  initialValues: StepAllgemeineAngabenState;
  onSubmit: SubmitHandler<StepAllgemeineAngabenState>;
  handleDirtyForm: (isFormDirty: boolean, dirtyFields: object) => void;
}

export const AllgemeineAngabenForm: FC<AllgemeineAngabenFormProps> = ({
  initialValues,
  onSubmit,
  handleDirtyForm,
}) => {
  const { register, handleSubmit, watch, formState } = useForm({
    defaultValues: initialValues,
  });
  const { isDirty, dirtyFields } = formState;

  const antragstellendeFormValue = watch("antragstellende");
  const mutterschaftssleistungenFormValue = watch("mutterschaftssleistungen");

  const mutteschaftsleistungenOptions: RadioOption[] = [
    { value: "ET1", label: watch("pseudonym.ET1") || "Elternteil 1" },
    { value: "ET2", label: watch("pseudonym.ET2") || "Elternteil 2" },
  ];

  const showMutterschaftsleistungsWerGroup =
    antragstellendeFormValue === "FuerBeide" &&
    mutterschaftssleistungenFormValue === YesNo.YES;

  useEffect(() => {
    handleDirtyForm(isDirty, dirtyFields);
  }, [isDirty, dirtyFields, handleDirtyForm]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <h3>Allgemeine Angaben</h3>
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
            required={true}
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

        {antragstellendeFormValue === "EinElternteil" ? (
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
              required={true}
            />
          </FormFieldGroup>
        ) : null}
        <>
          {antragstellendeFormValue !== null ? (
            <>
              <FormFieldGroup
                headline="Mutterschaftsleistungen"
                description="Beziehen Sie Mutterschaftsleistungen?"
              >
                <YesNoRadio
                  register={register}
                  registerOptions={{ required: "Dieses Feld ist erforderlich" }}
                  name="mutterschaftssleistungen"
                  errors={formState.errors}
                  required={true}
                />
              </FormFieldGroup>
              {showMutterschaftsleistungsWerGroup && (
                <FormFieldGroup description="Welcher Elternteil bezieht Mutterschaftsleistungen?">
                  <CustomRadio
                    register={register}
                    registerOptions={{
                      required: "Dieses Feld ist erforderlich",
                    }}
                    name="mutterschaftssleistungenWer"
                    options={mutteschaftsleistungenOptions}
                    errors={formState.errors}
                    required={true}
                  />
                </FormFieldGroup>
              )}
            </>
          ) : null}
        </>
        <ButtonGroup isStepOne={true} />
      </form>
    </>
  );
};
