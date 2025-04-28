import ClearIcon from "@digitalservicebund/icons/Clear";
import { type ReactNode, useRef, useState } from "react";
import { type FieldPath, useFieldArray, useFormContext } from "react-hook-form";
import { Zeitraum } from "./Zeitraum";
import {
  type ZeitraumData,
  type ZeitraumOptionType,
  availableZeitraumOptions,
} from "./ZeitraumUtil";
import { Button } from "@/application/components";
import { InfoEinkommenFuerErwerbstaetige } from "@/application/features/abfrageteil/components/EinkommenForm/InfoEinkommenFuerErwerbstaetige";
import { Versicherungen } from "@/application/features/abfrageteil/components/EinkommenForm/Taetigkeit/Versicherungen";
import {
  InfoZuMiniJobs,
  type SelectOption,
  cloneOptionsList,
} from "@/application/features/abfrageteil/components/common";
import {
  CustomNumberField,
  YesNoRadio,
} from "@/application/features/abfrageteil/components/common";
import {
  Antragstellende,
  type ElternteilType,
  type StepEinkommenState,
} from "@/application/features/abfrageteil/state";

type Props = {
  readonly elternteil: ElternteilType;
  readonly elternteilName: string;
  readonly antragstellende: Antragstellende | null;
  readonly taetigkeitsIndex: number;
  readonly monthsBeforeBirth: SelectOption[];
};

export function NichtSelbstaendig({
  elternteil,
  elternteilName,
  antragstellende,
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
        slotBetweenLabelAndOptions={<InfoEinkommenFuerErwerbstaetige />}
        suffix="Euro"
      />

      <YesNoRadio
        legend="War diese Tätigkeit ein Mini-Job?"
        slotBetweenLegendAndOptions={<InfoZuMiniJobs />}
        name={`${baseFieldPath}.isMinijob`}
        register={register}
        registerOptions={{ required: "Dieses Feld ist erforderlich" }}
        errors={errors}
        required
      />

      <fieldset>
        <legend className="mb-8">
          {antragstellende === "FuerBeide" ? (
            <>
              In welchem Zeitraum hat {elternteilName} diese Tätigkeit ausgeübt?
            </>
          ) : (
            <>In welchem Zeitraum haben Sie diese Tätigkeit ausgeübt?</>
          )}
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
                    type="button"
                    buttonStyle="link"
                    onClick={() => {
                      entferneZeitraum(zeitraumIndex);
                      remove(zeitraumIndex);
                      setAddButtonDisabled(false);
                      focusZeitraumHinzufuegenButton();
                    }}
                  >
                    Zeitraum entfernen <ClearIcon />
                  </Button>
                )}
              </li>
            );
          })}
        </ul>

        <div className="flex flex-col gap-16">
          <Button
            ref={zeitraumHinzufuegenButtonElement}
            type="button"
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
          >
            weiteren Zeitraum hinzufügen
          </Button>
        </div>
      </fieldset>

      <Versicherungen
        elternteilName={elternteilName}
        antragstellende={antragstellende}
        hasRentenversicherungName={`${baseFieldPath}.versicherungen.hasRentenversicherung`}
        hasKrankenversicherungName={`${baseFieldPath}.versicherungen.hasKrankenversicherung`}
        hasArbeitslosenversicherungName={`${baseFieldPath}.versicherungen.hasArbeitslosenversicherung`}
        noneName={`${baseFieldPath}.versicherungen.none`}
      />
    </>
  );
}
