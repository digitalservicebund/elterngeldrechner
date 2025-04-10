import { type ForwardedRef, forwardRef, useId } from "react";
import { type FieldPath, useFormContext } from "react-hook-form";
import { InfoZurArtDerTaetigkeit } from "./InfoZurArtDerTaetigkeit";
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

type Props = {
  readonly elternteil: ElternteilType;
  readonly taetigkeitsIndex: number;
  readonly isSelbststaendig: boolean;
  readonly monthsBeforeBirth: SelectOption[];
  readonly onRemove: () => void;
};

export const Taetigkeit = forwardRef(function Taetigkeit(
  { elternteil, taetigkeitsIndex, monthsBeforeBirth, onRemove }: Props,
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
    <section ref={ref} aria-labelledby={headingIdentifier} tabIndex={-1}>
      <h3 id={headingIdentifier} className="mb-16">
        {taetigkeitsIndex + 1}. Tätigkeit
      </h3>

      <div className="flex flex-col gap-56">
        <CustomSelect
          autoWidth
          register={register}
          name={`${baseFieldPath}.artTaetigkeit`}
          label="Art der Tätigkeit"
          slotBetweenLabelAndSelect={<InfoZurArtDerTaetigkeit />}
          options={erwerbstaetigkeitOptions}
          registerOptions={{
            required: "Dieses Feld ist erforderlich",
          }}
          errors={errors}
          required
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
      </div>
      <Button type="button" buttonStyle="secondary" onClick={onRemove}>
        Tätigkeit löschen
      </Button>
    </section>
  );
});
