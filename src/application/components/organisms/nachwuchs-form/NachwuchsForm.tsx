import AddIcon from "@digitalservicebund/icons/Add";
import ClearIcon from "@digitalservicebund/icons/Clear";
import { useId } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { NachwuchsFormInfoText } from "./NachwuchsFormInfoText";
import { Button } from "@/application/components/atoms";
import {
  ButtonGroup,
  Counter,
  CustomCheckbox,
  CustomDate,
  InfoDialog,
} from "@/application/components/molecules";
import { StepNachwuchsState } from "@/application/redux/stepNachwuchsSlice";

interface NachwuchsFormProps {
  readonly initialValues: StepNachwuchsState;
  readonly onSubmit: SubmitHandler<StepNachwuchsState>;
}

const validateMonth = (date: string) => {
  const [inputDay, inputMonth, inputYear] = date.split(".");
  const year = Number.parseInt(inputYear ?? "0");
  const inputDate = new Date(`${year}-${inputMonth}-${inputDay}`);
  const now = new Date(Date.now());
  const dateMaxMonthAgo = new Date(
    now.setUTCFullYear(now.getUTCFullYear() - 3),
  );

  if (inputDate >= dateMaxMonthAgo) {
    return true;
  } else {
    return `Elterngeld wird maximal für 32 Lebensmonate rückwirkend gezahlt.`;
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

  const dateOf = (germanDate: string): Date => {
    const [day, month, year] = germanDate.split(".");
    return new Date(`${year}-${month}-${day}`);
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
      return "Wählen Sie ein anderes Datum. Geschwister müssen älter sein als das neue Kind.";
    }
  };

  const geschwisterHeadingIdentifier = useId();
  const geschwisterKindHeadingBaseIdentifier = useId();

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <CustomDate
        control={control}
        rules={{
          required: "Dieses Feld ist erforderlich",
          pattern: {
            value: /^\d{2}\.\d{2}\.\d{4}$/,
            message: "Bitte das Feld vollständig ausfüllen",
          },
          validate: {
            validateMonth,
          },
        }}
        name={wahrscheinlichesGeburtsDatumName}
        label="Wann ist der Geburtstermin oder das Geburtsdatum von Ihrem Kind?"
        required
        info={<NachwuchsFormInfoText />}
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
        label="Wie viele Kinder werden oder wurden geboren?"
        errors={formState.errors}
        onIncrease={handleIncrease}
        onDecrease={handleDecrease}
        required
      />

      <section
        className="mt-32"
        aria-describedby={geschwisterHeadingIdentifier}
      >
        <h3 id={geschwisterHeadingIdentifier} className="mb-10">
          Gibt es ältere Geschwister?
        </h3>

        <div className="mb-10 flex justify-between">
          Wenn Sie weitere Kinder haben, die ebenfalls in Ihrem Haushalt leben,
          können Sie vielleicht einen Zuschlag zum Elterngeld bekommen, den
          Geschwisterbonus.
          <InfoDialog
            info={
              <ul className="list-inside list-disc">
                Den Geschwisterbonus bekommen Sie, wenn in Ihrem Haushalt
                <li>mindestens ein weiteres Kind unter 3 Jahren lebt oder</li>
                <li>mindestens 2 weitere Kinder unter 6 Jahren leben oder</li>
                <li>
                  mindestens ein weiteres Kind mit Behinderung unter 14 Jahren
                  lebt.
                </li>
              </ul>
            }
          />
        </div>

        <ul className="m-0 list-none p-0">
          {fields.map((field, index) => {
            const headingIdentifier =
              geschwisterKindHeadingBaseIdentifier + field.id;

            return (
              <li
                key={field.id}
                aria-labelledby={headingIdentifier}
                className="mb-32"
              >
                <h4 id={headingIdentifier} className="mb-10 font-regular">
                  {index + 1}. Geschwisterkind
                </h4>

                <CustomDate
                  control={control}
                  rules={{
                    pattern: {
                      value: /^\d{2}\.\d{2}\.\d{4}$/,
                      message: "Bitte das Feld vollständig ausfüllen",
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
                  className="mt-16"
                  onClick={() => remove(index)}
                  iconAfter={<ClearIcon />}
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
      </section>

      <ButtonGroup onClickBackButton={handlePageBack} />
    </form>
  );
}
