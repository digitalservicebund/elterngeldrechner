import ClearIcon from "@digitalservicebund/icons/Clear";
import AddIcon from "@digitalservicebund/icons/Add";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { DateTime } from "luxon";
import { StepNachwuchsState } from "@/redux/stepNachwuchsSlice";
import { Button } from "@/components/atoms";
import {
  CustomCheckbox,
  CustomDate,
  Counter,
  FormFieldGroup,
  ButtonGroup,
} from "@/components/molecules";
import nsp from "@/globals/js/namespace";
import { infoTexts } from "@/components/molecules/info-dialog";
import { trackNutzergruppe } from "@/user-tracking";
import { fromGermanDateString } from "@/utils/fromGermanDateString";

interface NachwuchsFormProps {
  readonly initialValues: StepNachwuchsState;
  readonly onSubmit: SubmitHandler<StepNachwuchsState>;
}

const validateMonth = (date: string) => {
  const [inputDay, inputMonth, inputYear] = date.split(".");
  const inputDate = DateTime.fromISO(`${inputYear}-${inputMonth}-${inputDay}`)
    .startOf("month")
    .toMillis();

  const maxMonthAgo = 32;
  const dateMaxMonthAgo = DateTime.now()
    .minus({ month: maxMonthAgo })
    .startOf("month")
    .toMillis();

  if (inputDate >= dateMaxMonthAgo) {
    return true;
  } else {
    return `Elterngeld wird maximal für ${maxMonthAgo} Lebensmonate rückwirkend gezahlt.`;
  }
};

export function NachwuchsForm({ initialValues, onSubmit }: NachwuchsFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState,
    getValues,
  } = useForm({
    defaultValues: initialValues,
  });

  const { fields, append, remove } = useFieldArray({
    name: "geschwisterkinder",
    control,
  });

  const navigate = useNavigate();
  const handlePageBack = () => navigate("/allgemeine-angaben");

  // Registration as a number is necessary because the addition "numberFutureChildren + 1" is added like a string and results in "21"
  register("anzahlKuenftigerKinder", { valueAsNumber: true });
  const anzahlKuenftigerKinder = watch("anzahlKuenftigerKinder");

  const geburtsdatum = watch("wahrscheinlichesGeburtsDatum");
  trackNutzergruppe(fromGermanDateString(geburtsdatum));

  const handleDecrease = () =>
    setValue(
      "anzahlKuenftigerKinder",
      Math.max(anzahlKuenftigerKinder - 1, 0),
      { shouldDirty: true },
    );
  const handleIncrease = () =>
    setValue(
      "anzahlKuenftigerKinder",
      Math.min(anzahlKuenftigerKinder + 1, 8),
      { shouldDirty: true },
    );

  const handleAppendGeschwisterkind = () =>
    append({
      geburtsdatum: "",
      istBehindert: false,
    });

  const wahrscheinlichesGeburtsDatumName = "wahrscheinlichesGeburtsDatum";
  const wahrscheinlichesGeburtsDatum = getValues(
    wahrscheinlichesGeburtsDatumName,
  );

  const dateOf = (germanDate: string): DateTime => {
    const [day, month, year] = germanDate.split(".");
    return DateTime.fromISO(`${year}-${month}-${day}`);
  };

  const geburtValidation = (date: string) => {
    if (date === "") {
      return true;
    }

    const geburtGeschwisterKind = dateOf(date);
    const geburtKind = dateOf(wahrscheinlichesGeburtsDatum);

    if (geburtGeschwisterKind < geburtKind) {
      return true;
    } else {
      return "Das Geschwisterkind muss älter als das Kind oben sein.";
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} name="Ihr Nachwuchs" noValidate>
      <h2>Ihr Nachwuchs</h2>

      <FormFieldGroup headline="Kinder">
        <CustomDate
          control={control}
          rules={{
            required: "Dieses Feld ist erforderlich",
            pattern: {
              value: /^\d{2}\.\d{2}\.\d{4}$/,
              message: "Bitte das Feld vollständig ausfüllen oder leer lassen",
            },
            validate: {
              validateMonth,
            },
          }}
          name={wahrscheinlichesGeburtsDatumName}
          label="Wann wird Ihr Kind voraussichtlich geboren?"
          required
          info={infoTexts.kindGeburtsdatum}
        />
        <Counter
          register={register}
          registerOptions={{
            max: {
              value: 8,
              message: "Es können nicht mehr als 8 Kinder angegeben werden",
            },
            min: {
              value: 1,
              message: "Es muss mindestens ein Kind angegeben werden",
            },
            required: "Dieses Feld ist erforderlich",
          }}
          name="anzahlKuenftigerKinder"
          label="Wie viele Kinder erwarten Sie (z.B. Zwillinge)?"
          errors={formState.errors}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
          required
        />
      </FormFieldGroup>
      <FormFieldGroup
        headline="Ältere Geschwisterkinder (falls vorhanden)"
        description="Wenn es kein Geschwisterkind gibt, können Sie diesen Schritt einfach
          überspringen."
      >
        <ul className={nsp("nachwuchs-form__geschwisterkinder")}>
          {fields.map((field, index) => {
            return (
              <li key={field.id} aria-label={`${index + 1}. Geschwisterkind`}>
                {index > 0 && <h3 className="mb-10">Geschwisterkind</h3>}
                <CustomDate
                  control={control}
                  rules={{
                    pattern: {
                      value: /^\d{2}\.\d{2}\.\d{4}$/,
                      message:
                        "Bitte das Feld vollständig ausfüllen oder leer lassen",
                    },
                    validate: geburtValidation,
                  }}
                  name={`geschwisterkinder.${index}.geburtsdatum`}
                  label="Wann wurde das Geschwisterkind geboren?"
                />
                <CustomCheckbox
                  register={register}
                  name={`geschwisterkinder.${index}.istBehindert`}
                  label="Das Geschwisterkind hat eine Behinderung"
                />
                <Button
                  onClick={() => remove(index)}
                  iconAfter={<ClearIcon />}
                  className={nsp("nachwuchs-form__geschwisterkinder-delete")}
                  buttonStyle="link"
                  label="Geschwisterkind entfernen"
                />
              </li>
            );
          })}
        </ul>
        <Button
          onClick={handleAppendGeschwisterkind}
          iconBefore={<AddIcon />}
          ariaLabel={`${
            !fields.length ? "Älteres" : "Weiteres"
          } Geschwisterkind hinzufügen`}
          buttonStyle="secondary"
          label={`${
            !fields.length ? "Älteres" : "Weiteres"
          } Geschwisterkind hinzufügen`}
        />
      </FormFieldGroup>
      <ButtonGroup onClickBackButton={handlePageBack} />
    </form>
  );
}
