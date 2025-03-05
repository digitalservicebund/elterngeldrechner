import ClearIcon from "@digitalservicebund/icons/Clear";
import { type ReactNode, useRef, useState } from "react";
import { type FieldPath, useFieldArray, useFormContext } from "react-hook-form";
import { Zeitraum } from "./Zeitraum";
import {
  type ZeitraumData,
  type ZeitraumOptionType,
  availableZeitraumOptions,
} from "./ZeitraumUtil";
import { Button } from "@/components/atoms";
import {
  CustomNumberField,
  type SelectOption,
  YesNoRadio,
  cloneOptionsList,
} from "@/components/molecules";
import { Versicherungen } from "@/components/organisms/einkommen-form/taetigkeit/Versicherungen";
import type { ElternteilType } from "@/redux/elternteil-type";
import type { StepEinkommenState } from "@/redux/stepEinkommenSlice";

type Props = {
  readonly elternteil: ElternteilType;
  readonly taetigkeitsIndex: number;
  readonly monthsBeforeBirth: SelectOption[];
};

export function NichtSelbstaendig({
  elternteil,
  taetigkeitsIndex,
  monthsBeforeBirth,
}: Props): ReactNode {
  const {
    register,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext<StepEinkommenState>();
  const baseFieldPath: FieldPath<StepEinkommenState> = `${elternteil}.taetigkeitenNichtSelbstaendigUndSelbstaendig.${taetigkeitsIndex}`;

  const {
    fields: zeitraumFields,
    append,
    remove,
  } = useFieldArray({
    name: `${baseFieldPath}.zeitraum`,
    control,
  });

  const [addButtonDisabled, setAddButtonDisabled] = useState(() => false);

  const [monthsBeforeBirthList, setMonthsBeforeBirthList] = useState(
    new Array<ZeitraumOptionType>(zeitraumFields.length).fill({
      from: cloneOptionsList(monthsBeforeBirth),
      to: cloneOptionsList(monthsBeforeBirth),
    }),
  );

  const zeitraumHinzufuegenButtonElement = useRef<HTMLButtonElement>(null);

  function focusZeitraumHinzufuegenButton() {
    zeitraumHinzufuegenButtonElement.current?.focus();
  }

  const letztesZeitraumListenElement = useRef<HTMLLIElement>(null);

  function focusLetztesZeitraumListenElement() {
    // Compensate for render delay to possibly create new element (non critical).
    setTimeout(() => letztesZeitraumListenElement.current?.focus());
  }

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
        .map((_, index) => getValues(`${baseFieldPath}.zeitraum.${index}`))
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

  const onChangeZeitraum = (zeitraumValue: { from: string; to: string }) => {
    const restFrom = availableMonthsBeforeBirth(zeitraumValue).from.filter(
      (value: SelectOption) => !value.hidden,
    );
    setAddButtonDisabled(restFrom.length === 0);
  };
  return (
    <>
      <CustomNumberField
        control={control}
        name={`${baseFieldPath}.bruttoEinkommenDurchschnitt`}
        label="Durchschnittliches Bruttoeinkommen"
        suffix="Euro"
        info="Als Einkommen werden alle Einkünfte aus Ihrer nicht-selbständigen Tätigkeit im Bemessungszeitraum berücksichtigt. Nicht berücksichtigt werden sonstige Bezüge, z.B. Abfindungen, Leistungsprämien, Provisionen, 13. Monatsgehälter. Steuerfreie Einnahmen werden ebenfalls nicht berücksichtigt, z.B. Trinkgelder, steuerfreie Zuschläge, Krankengeld, Kurzarbeitergeld, ALG II"
      />

      <YesNoRadio
        legend="War diese Tätigkeit ein Mini-Job?"
        info={`Mini-Job - geringfügige Beschäftigung bis maximal 538 Euro monatlich
  - vor dem 01.01.2024: bis maximal 520 Euro monatlich
  - vor dem 01.10.2022: bis maximal 450 Euro monatlich`}
        name={`${baseFieldPath}.isMinijob`}
        register={register}
        registerOptions={{ required: "Dieses Feld ist erforderlich" }}
        errors={errors}
        required
      />

      <fieldset className="mb-32">
        <legend className="mb-16">
          In welchem Zeitraum haben Sie diese Tätigkeit ausgeübt?
        </legend>

        <ul>
          {zeitraumFields.map((field, zeitraumIndex) => {
            const isLastZeitraum = zeitraumIndex === zeitraumFields.length - 1;
            const ref = isLastZeitraum
              ? letztesZeitraumListenElement
              : undefined;

            return (
              <li key={field.id} tabIndex={-1} ref={ref} className="mb-40">
                <Zeitraum
                  listingIndex={zeitraumIndex + 1}
                  disabled={zeitraumIndex + 1 !== zeitraumFields.length}
                  register={register}
                  setValue={setValue}
                  getValues={getValues}
                  name={`${baseFieldPath}.zeitraum.${zeitraumIndex}`}
                  options={monthsBeforeBirthList[zeitraumIndex]?.from ?? []}
                  optionsTo={monthsBeforeBirthList[zeitraumIndex]?.to ?? []}
                  onChange={onChangeZeitraum}
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
                      focusZeitraumHinzufuegenButton();
                    }}
                  />
                )}
              </li>
            );
          })}
        </ul>

        <div className="flex flex-col gap-16">
          <Button
            ref={zeitraumHinzufuegenButtonElement}
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

              focusLetztesZeitraumListenElement();
            }}
            label="weiteren Zeitraum hinzufügen"
          />
        </div>
      </fieldset>

      <Versicherungen
        hasRentenversicherungName={`${baseFieldPath}.versicherungen.hasRentenversicherung`}
        hasKrankenversicherungName={`${baseFieldPath}.versicherungen.hasKrankenversicherung`}
        hasArbeitslosenversicherungName={`${baseFieldPath}.versicherungen.hasArbeitslosenversicherung`}
        noneName={`${baseFieldPath}.versicherungen.none`}
      />
    </>
  );
}
