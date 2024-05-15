import React, { useMemo, useState, useEffect } from "react";
import {
  FieldError,
  get,
  RegisterOptions,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import ClearIcon from "@digitalservicebund/icons/Clear";
import {
  CustomCheckbox,
  CustomNumberField,
  FormFieldGroup,
  SelectOption,
} from "..";
import type { ElternteilType } from "@/monatsplaner";
import { useAppDispatch } from "@/redux/hooks";
import {
  stepRechnerActions,
  initialBruttoEinkommenZeitraum,
  StepRechnerState,
} from "@/redux/stepRechnerSlice";
import nsp from "@/globals/js/namespace";
import { Button, Description } from "@/components/atoms";
import {
  availableZeitraumOptions,
  Zeitraum,
  ZeitraumData,
  ZeitraumOptionType,
} from "@/components/organisms";
import { EgrConst } from "@/globals/js/egr-configuration";

interface RechnerFormProps {
  elternteilName: string;
  elternteil: ElternteilType;
  initialValues: StepRechnerState;
  onSubmit: SubmitHandler<StepRechnerState>;
  isResultPending: boolean;
  previousFormStepsChanged: boolean;
}

export const RechnerForm = ({
  elternteilName,
  elternteil,
  initialValues,
  onSubmit,
  isResultPending,
  previousFormStepsChanged,
}: RechnerFormProps) => {
  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
  });

  const dispatch = useAppDispatch();

  const name = `${elternteil}.bruttoEinkommenZeitraum` as const;
  const keinEinkommenName = `${elternteil}.keinEinkommen` as const;

  const { fields, append, remove } = useFieldArray({
    name,
    control,
  });

  const monthsAfterBirthOptions = () => {
    const months: SelectOption[] = [];
    for (let i = 0; i < EgrConst.lebensMonateMaxNumber; i++) {
      const month = `${i + 1}`;
      months.push({
        label: month,
        value: month,
      });
    }

    return months;
  };

  const [addButtonDisabled, setAddButtonDisabled] = useState(() => false);

  const [monthsAfterBirthList, setMonthsAfterBirthList] = useState(
    new Array<ZeitraumOptionType>(fields.length).fill({
      from: monthsAfterBirthOptions(),
      to: monthsAfterBirthOptions(),
    }),
  );

  const availableMonthsAfterBirth = (lastZeitraumValue?: ZeitraumData) =>
    availableZeitraumOptions(
      monthsAfterBirthList
        .map((v, index) => getValues(`${name}.${index}.zeitraum`))
        .map((v) => {
          return { from: v.from, to: v.to };
        }),
      {
        from: monthsAfterBirthOptions(),
        to: monthsAfterBirthOptions(),
      },
      "Integer",
      lastZeitraumValue,
    );

  const onChangeKeinEinkommen = (keinEinkommen: boolean) => {
    if (keinEinkommen) {
      setValue(name, []);
    } else if (getValues(name).length < 1) {
      setValue(name, [initialBruttoEinkommenZeitraum]);
      setMonthsAfterBirthList(() => [
        {
          from: monthsAfterBirthOptions(),
          to: monthsAfterBirthOptions(),
        },
      ]);
    }
  };

  const appendEinkommen = () => {
    const availableMonths = availableMonthsAfterBirth();
    setMonthsAfterBirthList((prevState) => [...prevState, availableMonths]);
    append(initialBruttoEinkommenZeitraum);

    setValue(keinEinkommenName, false);

    const availableMonthsSize = availableMonths.from.filter(
      (availableMonth: SelectOption) => !availableMonth.hidden,
    ).length;
    setAddButtonDisabled(availableMonthsSize === 1);
  };

  const removeEinkommen = (index: number) => {
    setMonthsAfterBirthList((monthsAfterBirthList) =>
      monthsAfterBirthList.filter((month, indexMonth) => indexMonth !== index),
    );
    remove(index);

    if (getValues(name).length < 1) {
      setValue(keinEinkommenName, true);
    }

    setAddButtonDisabled(false);
  };

  const onChangeZeitraum = (
    zeitraumIndex: number,
    zeitraumValue: { from: string; to: string },
  ) => {
    const restFrom = availableMonthsAfterBirth(zeitraumValue).from.filter(
      (value: SelectOption) => !value.hidden,
    );
    setAddButtonDisabled(restFrom.length === 0);
  };

  const optionsKeinEinkommen: RegisterOptions = useMemo(
    () => ({
      validate: {
        requireKeinEinkommenOrEinkommen: (keinEinkommen) => {
          const einkommenList = getValues(name);
          if (keinEinkommen) {
            return true;
          }
          if (einkommenList.length > 0) {
            return true;
          }
          return 'Bitte geben Sie ihr Einkommen während des Elterngeldbezugs an oder wählen sie "kein Einkommen beziehen"';
        },
      },
    }),
    [getValues, name],
  );

  const errorKeinEinkommen: FieldError | undefined = get(
    errors,
    keinEinkommenName,
  );

  useEffect(() => {
    if (previousFormStepsChanged) {
      dispatch(
        stepRechnerActions.resetHasBEGResultChangedDueToPrevFormSteps({
          elternteil: elternteil,
        }),
      );
    }
  }, [previousFormStepsChanged, dispatch, elternteil]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={nsp("rechner-form")}
      noValidate
    >
      <FormFieldGroup
        headline={elternteilName}
        data-testid={"egr-rechner-form"}
      >
        {errorKeinEinkommen && (
          <Description id={`${keinEinkommenName}-error`} error={true}>
            {errorKeinEinkommen.message}
          </Description>
        )}
        <CustomCheckbox
          register={register}
          name={keinEinkommenName}
          label="Ich werde während des gesamten Elterngeldbezugs kein Einkommen beziehen"
          onChange={onChangeKeinEinkommen}
          registerOptions={optionsKeinEinkommen}
          aria-invalid={!!errorKeinEinkommen}
        />
        <p>oder</p>
        {fields.map((field, index) => (
          <section
            key={field.id}
            aria-label={`${index + 1}. Einkommen`}
            className={nsp("rechner-form__zeitraum-section")}
          >
            <CustomNumberField
              className={nsp("rechner-form__einkommen")}
              control={control}
              name={`${name}.${index}.bruttoEinkommen`}
              label="Ihr monatliches Bruttoeinkommen oder durchschnittlicher monatlicher Gewinn während des Bezugs von Elterngeld"
              suffix="Euro"
              stretch={true}
              required={true}
              ariaDescribedByIfNoError={`${name}.${index}.zeitraum`}
            />
            <Zeitraum
              disabled={index + 1 !== fields.length}
              className={nsp("rechner-form__zeitraum")}
              key={field.id}
              register={register}
              setValue={setValue}
              getValues={getValues}
              name={`${name}.${index}.zeitraum`}
              suffix="Lebensmonat"
              options={monthsAfterBirthList[index].from}
              optionsTo={monthsAfterBirthList[index].to}
              onChange={(zeitraum) => onChangeZeitraum(index, zeitraum)}
              type="Integer"
              errors={errors}
              required={true}
            />
            <div className={nsp("rechner-form__remove-action")}>
              <Button
                buttonStyle="link"
                label="Einkommen entfernen"
                iconAfter={<ClearIcon />}
                onClick={() => {
                  removeEinkommen(index);
                }}
              />
            </div>
          </section>
        ))}
        <div className={nsp("rechner-form__actions")}>
          <div className={nsp("rechner-form__add-action")}>
            <Button
              buttonStyle="secondary"
              onClick={() => appendEinkommen()}
              label="Einkommen hinzufügen"
              disabled={addButtonDisabled}
            />
          </div>
          <Button
            type="submit"
            buttonStyle="primary"
            disabled={isResultPending}
            label="Elterngeld berechnen"
          />
        </div>
      </FormFieldGroup>
    </form>
  );
};
