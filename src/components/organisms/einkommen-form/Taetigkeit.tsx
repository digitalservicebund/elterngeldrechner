import { useState } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import ClearIcon from "@digitalservicebund/icons/Clear";
import { Versicherungen } from "./Versicherungen";
import type { ElternteilType } from "@/redux/elternteil-type";
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
import { cloneOptionsList } from "@/components/molecules/custom-select/CustomSelect";
import {
  availableZeitraumOptions,
  Zeitraum,
  ZeitraumData,
  ZeitraumOptionType,
} from "@/components/organisms/zeitraum";
import { infoTexts } from "@/components/molecules/info-dialog";

const erwerbstaetigkeitLabels: {
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
  readonly elternteil: ElternteilType;
  readonly taetigkeitsIndex: number;
  readonly isSelbststaendig: boolean;
  readonly monthsBeforeBirth: SelectOption[];
  readonly onRemove: () => void;
}

export function Taetigkeit({
  elternteil,
  taetigkeitsIndex,
  isSelbststaendig,
  monthsBeforeBirth,
  onRemove,
}: TaetigkeitsFormProps) {
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

  function entferneZeitraum(index: number): void {
    setMonthsBeforeBirthList((months) => {
      months.splice(index, 1);
      return months;
    });
  }

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
    : "Durchschnittliches Bruttoeinkommen";

  return (
    <FormFieldGroup headline={`${taetigkeitsIndex + 1}. Tätigkeit`}>
      <FormFieldGroup>
        {!!isSelbststaendig && (
          <CustomSelect
            autoWidth
            register={register}
            name={artTaetigkeitName}
            label="Art der Tätigkeit"
            options={erwerbstaetigkeitOptions}
            registerOptions={{
              required: "Dieses Feld ist erforderlich",
            }}
            errors={errors}
            required
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
          description="War diese Tätigkeit ein Mini-Job?"
          info={infoTexts.minijobsMaxZahl}
        >
          <YesNoRadio
            name={isMinijob}
            register={register}
            registerOptions={{
              required: "Dieses Feld ist erforderlich",
            }}
            errors={errors}
            required
          />
        </FormFieldGroup>
      )}
      <fieldset className="mb-32">
        <legend className="mb-16">
          In welchem Zeitraum haben Sie diese Tätigkeit ausgeübt?
        </legend>

        <ul>
          {zeitraumFields.map((field, zeitraumIndex) => (
            <li key={field.id} className="egr-einkommen-form__zeitraum">
              <Zeitraum
                listingIndex={zeitraumIndex + 1}
                disabled={zeitraumIndex + 1 !== zeitraumFields.length}
                register={register}
                setValue={setValue}
                getValues={getValues}
                name={`${zeitraum}.${zeitraumIndex}`}
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
                    entferneZeitraum(zeitraumIndex);
                    remove(zeitraumIndex);
                    setAddButtonDisabled(false);
                  }}
                />
              )}
            </li>
          ))}
        </ul>

        <div className="egr-einkommen-form__taetigkeit-buttons">
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
      </fieldset>

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
}
