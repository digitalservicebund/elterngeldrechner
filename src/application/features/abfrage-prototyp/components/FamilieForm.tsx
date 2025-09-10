import AddIcon from "@digitalservicebund/icons/Add";
import ClearIcon from "@digitalservicebund/icons/Clear";
import { useCallback, useId } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/application/components";
import {
  type StepPrototypState,
  stepPrototypSlice,
} from "@/application/features/abfrage-prototyp/state";
import { InfoZumEinkommenslimit } from "@/application/features/abfrageteil/components/EinkommenForm/InfoZumEinkommenslimit";
import { CustomDate } from "@/application/features/abfrageteil/components/NachwuchsForm/CustomDate";
import { InfoZumGeschwisterbonus } from "@/application/features/abfrageteil/components/NachwuchsForm/InfoZumGeschwisterbonus";
import {
  CustomCheckbox,
  CustomSelect,
  SelectOption,
  YesNoRadio,
} from "@/application/features/abfrageteil/components/common";
import { bundeslaender } from "@/application/features/pdfAntrag";
import { useAppStore } from "@/application/redux/hooks";

type Props = {
  readonly id?: string;
  readonly onSubmit?: (values: StepPrototypState) => void;
  readonly hideSubmitButton?: boolean;
};

export function FamilieForm({ id, onSubmit }: Props) {
  const store = useAppStore();

  const { register, handleSubmit, control, formState, getValues } = useForm({
    defaultValues: store.getState().stepPrototyp,
  });
  const methods = useForm({ defaultValues: store.getState().stepPrototyp });
  const { errors } = methods.formState;

  const submitNachwuchs = useCallback(
    (values: StepPrototypState) => {
      store.dispatch(stepPrototypSlice.actions.submitStep(values));
      onSubmit?.(values);
    },
    [store, onSubmit],
  );

  const bundeslandOptions: SelectOption<string>[] = bundeslaender.map(
    (bundesland) => ({ value: bundesland.name, label: bundesland.name }),
  );

  const { fields, append, remove } = useFieldArray({
    name: "geschwisterkinder",
    control,
  });

  const handleAppendGeschwisterkind = () =>
    append({
      geburtsdatum: "",
      istBehindert: false,
    });

  const dateOf = (germanDate: string): Date => {
    const [day, month, year] = germanDate.split(".");
    return new Date(`${year}-${month}-${day}`);
  };

  const geburtValidation = (date: string) => {
    if (date === "") {
      return true;
    }

    const geburtGeschwisterKind = dateOf(date);
    const wahrscheinlichesGeburtsDatum = getValues(
      "wahrscheinlichesGeburtsDatum",
    );
    const geburtKind = dateOf(wahrscheinlichesGeburtsDatum);

    if (geburtGeschwisterKind < geburtKind) {
      return true;
    } else {
      return "Wählen Sie ein anderes Datum. Geschwister müssen älter sein als das neue Kind.";
    }
  };

  const geschwisterHeadingIdentifier = useId();

  return (
    <form
      id={id}
      className="flex flex-col gap-32"
      onSubmit={handleSubmit(submitNachwuchs)}
      noValidate
    >
      <div>
        <h3>In welchem Bundesland wollen Sie Elterngeld beantragen?</h3>

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
      </div>

      <section aria-describedby={geschwisterHeadingIdentifier}>
        <h3 id={geschwisterHeadingIdentifier} className="mb-10">
          Gibt es ältere Geschwisterkinder?
        </h3>

        <p className="flex justify-between">
          Wenn Sie weitere Kinder haben, die ebenfalls in Ihrem Haushalt leben,
          können Sie vielleicht einen Zuschlag zum Elterngeld bekommen, den
          Geschwisterbonus.
        </p>

        <InfoZumGeschwisterbonus />

        <ul className="m-0 mt-16 list-none p-0">
          {fields.map((field, index) => {
            const headingIdentifier = `${field.id}-heading`;
            const geburtsdatumInputIdentifier = `${field.id}-geburtsdatum`;

            return (
              <li
                key={field.id}
                aria-labelledby={headingIdentifier}
                className="mb-32"
              >
                <h4 id={headingIdentifier} className="mb-10 font-regular">
                  {index + 1}. Geschwisterkind
                </h4>

                <label htmlFor={geburtsdatumInputIdentifier}>
                  Wann wurde das Geschwisterkind geboren?
                </label>

                <CustomDate
                  id={geburtsdatumInputIdentifier}
                  className="mt-16"
                  error={
                    errors.geschwisterkinder?.[index]?.geburtsdatum?.message
                  }
                  {...register(`geschwisterkinder.${index}.geburtsdatum`, {
                    required: "Dieses Feld ist erforderlich",
                    pattern: {
                      value: /^\d{2}\.\d{2}\.\d{4}$/,
                      message: "Bitte das Feld vollständig ausfüllen",
                    },
                    validate: geburtValidation,
                  })}
                />

                <CustomCheckbox
                  register={register}
                  name={`geschwisterkinder.${index}.istBehindert`}
                  label="Das Geschwisterkind hat eine Behinderung"
                />

                <Button
                  className="mt-16"
                  type="button"
                  onClick={() => remove(index)}
                  buttonStyle="link"
                >
                  Geschwisterkind entfernen <ClearIcon />
                </Button>
              </li>
            );
          })}
        </ul>

        <Button
          type="button"
          buttonStyle="secondary"
          onClick={handleAppendGeschwisterkind}
        >
          <AddIcon /> {fields.length === 0 ? "Älteres" : "Weiteres"}{" "}
          Geschwisterkind hinzufügen
        </Button>
      </section>

      <div>
        <h3>
          Hatten Sie im Kalenderjahr vor der Geburt ein Gesamteinkommen von mehr
          als 175.000 Euro?
        </h3>

        <YesNoRadio
          className="mb-32"
          legend=""
          slotBetweenLegendAndOptions={<InfoZumEinkommenslimit />}
          register={register}
          registerOptions={{ required: "Dieses Feld ist erforderlich" }}
          name="limitEinkommenUeberschritten"
          errors={formState.errors}
        />
      </div>
    </form>
  );
}
