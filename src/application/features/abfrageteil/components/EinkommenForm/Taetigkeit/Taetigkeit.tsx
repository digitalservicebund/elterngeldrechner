import { type ForwardedRef, forwardRef, useId } from "react";
import { type FieldPath, useFormContext } from "react-hook-form";
import { NichtSelbstaendig } from "./NichtSelbstaendig";
import { Selbststaendig } from "./Selbstaendig";
import { Button } from "@/application/components";
import {
  CustomSelect,
  type SelectOption,
} from "@/application/features/abfrageteil/components/common";
import {
  type ElternteilType,
  type StepEinkommenState,
} from "@/application/features/abfrageteil/state";

const erwerbstaetigkeitOptions: SelectOption[] = [
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

export const Taetigkeit = forwardRef(function Taetigkeit(
  {
    elternteil,
    taetigkeitsIndex,
    monthsBeforeBirth,
    onRemove,
  }: TaetigkeitsFormProps,
  ref?: ForwardedRef<HTMLElement>,
) {
  const baseFieldPath: FieldPath<StepEinkommenState> = `${elternteil}.taetigkeitenNichtSelbstaendigUndSelbstaendig.${taetigkeitsIndex}`;

  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<StepEinkommenState>();

  const artTaetigkeit = watch(`${baseFieldPath}.artTaetigkeit`);
  const istSelbststaendig = artTaetigkeit === "Selbststaendig";

  const headingIdentifier = useId();

  return (
    <section
      ref={ref}
      className="flex flex-col gap-32"
      aria-labelledby={headingIdentifier}
      tabIndex={-1}
    >
      <h3 id={headingIdentifier}>{taetigkeitsIndex + 1}. Tätigkeit</h3>

      <CustomSelect
        autoWidth
        register={register}
        name={`${baseFieldPath}.artTaetigkeit`}
        label="Art der Tätigkeit"
        options={erwerbstaetigkeitOptions}
        registerOptions={{
          required: "Dieses Feld ist erforderlich",
        }}
        errors={errors}
        required
        info="Einkünfte aus nichtselbständiger Arbeit: z.B. Lohn Gehalt (auch aus einem Minijob) oder Gewinneinkünfte: Einkünfte aus einem Gewerbebetrieb (auch z.B. aus dem Betrieb einer Fotovoltaik-Anlage), Einkünfte aus selbständiger Arbeit (auch z.B. aus einem Nebenberuf), Einkünfte aus Land- und Forstwirtschaft"
      />

      {istSelbststaendig ? (
        <Selbststaendig
          elternteil={elternteil}
          taetigkeitsIndex={taetigkeitsIndex}
        />
      ) : (
        <NichtSelbstaendig
          elternteil={elternteil}
          taetigkeitsIndex={taetigkeitsIndex}
          monthsBeforeBirth={monthsBeforeBirth}
        />
      )}

      <Button
        buttonStyle="secondary"
        onClick={onRemove}
        label="Tätigkeit löschen"
      />
    </section>
  );
});
