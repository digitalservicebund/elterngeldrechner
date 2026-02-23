import { Control, FieldErrors, useFieldArray } from "react-hook-form";
import { Button } from "@/application/components";
import { DateInput } from "@/application/features/abfrageteil-next/components/DateInput";
import {
  ElternteilAusklammerungszeitenInput,
  ElternteilAusklammerungszeitenOutput,
} from "@/application/features/abfrageteil-next/elternteil/ElternteilAusklammerungZeitenPage";

interface ElternteilAusklammerungZeitenInputProps {
  readonly grund: keyof ElternteilAusklammerungszeitenInput;
  readonly title: string;
  readonly control: Control<
    ElternteilAusklammerungszeitenInput,
    undefined,
    ElternteilAusklammerungszeitenOutput
  >;
  readonly errors: FieldErrors<ElternteilAusklammerungszeitenInput>;
}

export function ElternteilAusklammerungZeitenInput({
  grund,
  title,
  control,
  errors,
}: ElternteilAusklammerungZeitenInputProps) {
  const { fields, append } = useFieldArray({ control, name: grund });

  return (
    <div>
      <h5 className="pb-16 font-bold">{title}</h5>

      {fields.map((field, index) => (
        <div key={field.id} className="flex flex-col gap-16">
          <div className="flex flex-wrap gap-56 *:grow *:basis-[22rem]">
            <div>
              <label className="mb-4 block text-16" htmlFor={`${field.id}-von`}>
                Beginn (TT.MM.JJJJ)
              </label>
              <DateInput
                id={`${field.id}-von`}
                {...control.register(`${grund}.${index}.von`)}
                error={errors[grund]?.[index]?.von?.message}
              />
            </div>

            <div>
              <label className="mb-4 block text-16" htmlFor={`${field.id}-bis`}>
                Ende (TT.MM.JJJJ)
              </label>
              <DateInput
                id={`${field.id}-bis`}
                {...control.register(`${grund}.${index}.bis`)}
                error={errors[grund]?.[index]?.bis?.message}
              />
            </div>
          </div>
        </div>
      ))}

      <Button
        type="button"
        buttonStyle="link"
        className="self-start"
        onClick={() => append({ von: "", bis: "" })}
      >
        + Weiteren Zeitraum hinzufügen
      </Button>
    </div>
  );
}
