import ClearIcon from "@digitalservicebund/icons/Clear";
import { type ForwardedRef, forwardRef, useId, useRef, useState } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { Versicherungen } from "./Versicherungen";
import { Button } from "@/components/atoms";
import {
  CustomNumberField,
  CustomSelect,
  SelectOption,
  YesNoRadio,
} from "@/components/molecules";
import { cloneOptionsList } from "@/components/molecules/custom-select/CustomSelect";
import {
  Zeitraum,
  ZeitraumData,
  ZeitraumOptionType,
  availableZeitraumOptions,
} from "@/components/organisms/zeitraum";
import type { ElternteilType } from "@/redux/elternteil-type";
import { StepEinkommenState } from "@/redux/stepEinkommenSlice";
import { Erwerbstaetigkeiten } from "@/redux/stepErwerbstaetigkeitSlice";

const erwerbstaetigkeitOptions: SelectOption<Erwerbstaetigkeiten | "">[] = [
  { value: "NichtSelbststaendig", label: "nichtselbständige Arbeit" },
  { value: "Selbststaendig", label: "Gewinneinkünfte" },
];

interface TaetigkeitsFormProps {
  readonly elternteil: ElternteilType;
  readonly taetigkeitsIndex: number;
  readonly isSelbststaendig: boolean;
  readonly monthsBeforeBirth: SelectOption[];
  readonly onRemove: () => void;
}

const infoTexts = {
  erwerbstaetigkeitNichtSelbststaendig:
    "z.B. Lohn, Gehalt (auch aus einem Minijob)",

  erwerbstaetigkeitNichtSelbststaendigGewinneinkuenfte:
    "Einkünfte aus nichtselbständiger Arbeit: z.B. Lohn Gehalt (auch aus einem Minijob) oder Gewinneinkünfte: Einkünfte aus einem Gewerbebetrieb (auch z.B. aus dem Betrieb einer Fotovoltaik-Anlage), Einkünfte aus selbständiger Arbeit (auch z.B. aus einem Nebenberuf), Einkünfte aus Land- und Forstwirtschaft",

  einkommenNichtSelbststaendig:
    "Als Einkommen werden alle Einkünfte aus Ihrer nicht-selbständigen Tätigkeit im Bemessungszeitraum berücksichtigt. Nicht berücksichtigt werden sonstige Bezüge, z.B. Abfindungen, Leistungsprämien, Provisionen, 13. Monatsgehälter. Steuerfreie Einnahmen werden ebenfalls nicht berücksichtigt, z.B. Trinkgelder, steuerfreie Zuschläge, Krankengeld, Kurzarbeitergeld, ALG II",

  einkommenGewinneinkuenfte:
    "Dies ergibt sich aus Ihrem letzten oder vorletzten Steuerbescheid oder Sie können schätzen",

  einkommenSteuerklasse:
    "Das Faktorverfahren in der Steuerklassenkombination IV/IV wird in der vorliegenden Berechnung nicht berücksichtigt. Der Standardwert 1,0 ist festgelegt. Sollte Ihr Faktor kleiner als 1,0 sein, wirkt sich dies entsprechend auf die Höhe des Elterngeldes aus. Sie erhalten dann mehr Elterngeld (im unteren zweistelligen Bereich)",

  minijobsMaxZahl: `Mini-Job - geringfügige Beschäftigung bis maximal 538 Euro monatlich
    - vor dem 01.01.2024: bis maximal 520 Euro monatlich
    - vor dem 01.10.2022: bis maximal 450 Euro monatlich`,
};

export const Taetigkeit = forwardRef(function Taetigkeit(
  {
    elternteil,
    taetigkeitsIndex,
    isSelbststaendig,
    monthsBeforeBirth,
    onRemove,
  }: TaetigkeitsFormProps,
  ref?: ForwardedRef<HTMLElement>,
) {
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

  const headingIdentifier = useId();

  return (
    <section
      ref={ref}
      className="flex flex-col gap-32"
      aria-labelledby={headingIdentifier}
      tabIndex={-1}
    >
      <h3 id={headingIdentifier}>{taetigkeitsIndex + 1}. Tätigkeit</h3>

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
          info={infoTexts.erwerbstaetigkeitNichtSelbststaendigGewinneinkuenfte}
        />
      )}

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

      {!selbststaendig && (
        <YesNoRadio
          legend="War diese Tätigkeit ein Mini-Job?"
          info={infoTexts.minijobsMaxZahl}
          name={isMinijob}
          register={register}
          registerOptions={{
            required: "Dieses Feld ist erforderlich",
          }}
          errors={errors}
          required
        />
      )}

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
                  name={`${zeitraum}.${zeitraumIndex}`}
                  options={monthsBeforeBirthList[zeitraumIndex]?.from ?? []}
                  optionsTo={monthsBeforeBirthList[zeitraumIndex]?.to ?? []}
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
    </section>
  );
});
