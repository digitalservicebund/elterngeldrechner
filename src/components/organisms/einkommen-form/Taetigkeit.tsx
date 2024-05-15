import React, { useState, VFC } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import ClearIcon from "@digitalservicebund/icons/Clear";
import { Versicherungen } from "./Versicherungen";
import type { ElternteilType } from "@/monatsplaner";
import {
  CustomNumberField,
  CustomSelect,
  FormFieldGroup,
  SelectOption,
  YesNoRadio,
} from "@/components/molecules";
import { Erwerbstaetigkeiten } from "@/redux/stepErwerbstaetigkeitSlice";
import { StepEinkommenState } from "@/redux/stepEinkommenSlice";
import { Button } from "@/components/atoms";
import nsp from "@/globals/js/namespace";
import { cloneOptionsList } from "@/components/molecules/custom-select/CustomSelect";
import {
  availableZeitraumOptions,
  Zeitraum,
  ZeitraumData,
  ZeitraumOptionType,
} from "@/components/organisms/zeitraum";
import { infoTexts } from "@/components/molecules/info-dialog";

export const erwerbstaetigkeitLabels: {
  [K in Erwerbstaetigkeiten]: string;
} = {
  NichtSelbststaendig: "nichtselbständige Arbeit",
  Selbststaendig: "Gewinneinkünfte",
};

const erwerbstaetigkeitOptions: SelectOption<Erwerbstaetigkeiten | "">[] = [
  {
    value: "NichtSelbststaendig",
    label: erwerbstaetigkeitLabels.NichtSelbststaendig,
  },
  { value: "Selbststaendig", label: erwerbstaetigkeitLabels.Selbststaendig },
];

interface TaetigkeitsFormProps {
  elternteil: ElternteilType;
  taetigkeitsIndex: number;
  isSelbststaendig: boolean;
  monthsBeforeBirth: SelectOption[];
  onRemove: () => void;
}

export const Taetigkeit: VFC<TaetigkeitsFormProps> = ({
  elternteil,
  taetigkeitsIndex,
  isSelbststaendig,
  monthsBeforeBirth,
  onRemove,
}) => {
  const name =
    `${elternteil}.taetigkeitenNichtSelbstaendigUndSelbstaendig` as const;

  const {
    register,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext<StepEinkommenState>();

  const zeitraum = `${name}.${taetigkeitsIndex}.zeitraum` as const;
  const artTaetigkeitName =
    `${name}.${taetigkeitsIndex}.artTaetigkeit` as const;
  const bruttoEinkommenDurchschnitt =
    `${name}.${taetigkeitsIndex}.bruttoEinkommenDurchschnitt` as const;
  const isMinijob = `${name}.${taetigkeitsIndex}.isMinijob` as const;
  const versicherungen = `${name}.${taetigkeitsIndex}.versicherungen` as const;

  const {
    fields: zeitraumFields,
    append,
    remove,
  } = useFieldArray({
    name: zeitraum,
    control,
  });

  const [addButtonDisabled, setAddButtonDisabled] = useState(() => false);

  const [monthsBeforeBirthList, setMonthsBeforeBirthList] = useState(
    new Array<ZeitraumOptionType>(zeitraumFields.length).fill({
      from: cloneOptionsList(monthsBeforeBirth),
      to: cloneOptionsList(monthsBeforeBirth),
    }),
  );
  const availableMonthsBeforeBirth = (
    lastZeitraumValue?: ZeitraumData,
  ): ZeitraumOptionType =>
    availableZeitraumOptions(
      monthsBeforeBirthList
        .map((v, index) => getValues(`${zeitraum}.${index}`))
        .map((v) => {
          return { from: v.from, to: v.to };
        }),
      {
        from: cloneOptionsList(monthsBeforeBirth),
        to: cloneOptionsList(monthsBeforeBirth),
      },
      "Integer",
      lastZeitraumValue,
    );

  const onChangeZeitraum = (
    zeitraumIndex: number,
    zeitraumValue: { from: string; to: string },
  ) => {
    const restFrom = availableMonthsBeforeBirth(zeitraumValue).from.filter(
      (value: SelectOption) => !value.hidden,
    );
    setAddButtonDisabled(restFrom.length === 0);
  };

  useWatch({ name: artTaetigkeitName });
  const artTaetigkeit = getValues(artTaetigkeitName);
  const selbststaendig = artTaetigkeit === "Selbststaendig";
  const einkommenLabel = selbststaendig
    ? "Durchschnittlicher monatlicher Gewinn"
    : "Durchschnittliches Brutto-Einkommen";

  return (
    <FormFieldGroup headline={`${taetigkeitsIndex + 1}. Tätigkeit`}>
      <FormFieldGroup>
        {isSelbststaendig && (
          <CustomSelect
            autoWidth={true}
            register={register}
            name={artTaetigkeitName}
            label="Art der Tätigkeit"
            options={erwerbstaetigkeitOptions}
            registerOptions={{
              required: "Dieses Feld ist erforderlich",
            }}
            errors={errors}
            required={true}
            info={
              infoTexts.erwerbstaetigkeitNichtSelbststaendigGewinneinkuenfte
            }
          />
        )}
      </FormFieldGroup>
      <FormFieldGroup>
        <CustomNumberField
          control={control}
          name={bruttoEinkommenDurchschnitt}
          label={einkommenLabel}
          suffix="Euro"
          info={
            selbststaendig
              ? infoTexts.einkommenGewinneinkuenfte
              : infoTexts.einkommenNichtSelbststaendig
          }
        />
      </FormFieldGroup>
      {!selbststaendig && (
        <FormFieldGroup
          description="War diese Anstellung ein Minijob, mit einer maximalen Vergütung von
          520 Euro im Monat?"
        >
          <YesNoRadio
            name={isMinijob}
            register={register}
            registerOptions={{
              required: "Dieses Feld ist erforderlich",
            }}
            errors={errors}
            required={true}
            info={infoTexts.minijobsMaxZahl}
          />
        </FormFieldGroup>
      )}
      <FormFieldGroup description="In welchem Zeitraum haben Sie diese Tätigkeit ausgeübt?">
        {zeitraumFields.map((field, zeitraumIndex) => {
          return (
            <div key={field.id} className={nsp("einkommen-form__zeitraum")}>
              <Zeitraum
                disabled={zeitraumIndex + 1 !== zeitraumFields.length}
                register={register}
                setValue={setValue}
                getValues={getValues}
                name={`${zeitraum}.${zeitraumIndex}`}
                aria-label={`${zeitraumIndex + 1}. Zeitraum`}
                options={monthsBeforeBirthList[zeitraumIndex].from}
                optionsTo={monthsBeforeBirthList[zeitraumIndex].to}
                onChange={(zeitraum) =>
                  onChangeZeitraum(zeitraumIndex, zeitraum)
                }
                errors={errors}
                type="Integer"
              />
              {zeitraumFields.length > 1 && (
                <Button
                  buttonStyle="link"
                  label="Zeitraum entfernen"
                  iconAfter={<ClearIcon />}
                  onClick={() => {
                    setMonthsBeforeBirthList((monthsBeforeBirthList) =>
                      monthsBeforeBirthList.filter(
                        (month, indexMonth) => indexMonth !== zeitraumIndex,
                      ),
                    );
                    remove(zeitraumIndex);
                    setAddButtonDisabled(false);
                  }}
                />
              )}
            </div>
          );
        })}
        <div className={nsp("einkommen-form__taetigkeit-buttons")}>
          <Button
            buttonStyle="secondary"
            disabled={addButtonDisabled}
            onClick={() => {
              const availableMonths = availableMonthsBeforeBirth();
              setMonthsBeforeBirthList([
                ...monthsBeforeBirthList,
                availableMonths,
              ]);
              append({ from: "", to: "" });

              const availableMonthsSize = availableMonths.from.filter(
                (availableMonth: SelectOption) => !availableMonth.hidden,
              ).length;
              setAddButtonDisabled(availableMonthsSize === 1);
            }}
            label="weiteren Zeitraum hinzufügen"
          />
        </div>
      </FormFieldGroup>
      <Versicherungen
        hasRentenversicherungName={`${versicherungen}.hasRentenversicherung`}
        hasKrankenversicherungName={`${versicherungen}.hasKrankenversicherung`}
        hasArbeitslosenversicherungName={`${versicherungen}.hasArbeitslosenversicherung`}
        noneName={`${versicherungen}.none`}
      />
      <Button
        buttonStyle="secondary"
        onClick={onRemove}
        label="Tätigkeit löschen"
      />
    </FormFieldGroup>
  );
};
