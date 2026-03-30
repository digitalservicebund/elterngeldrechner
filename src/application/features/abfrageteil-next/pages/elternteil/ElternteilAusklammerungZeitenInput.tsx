import AddIcon from "@digitalservicebund/icons/AddCircleOutline";
import CloseIcon from "@digitalservicebund/icons/Close";
import classNames from "classnames";
import { Control, FieldErrors, useFieldArray } from "react-hook-form";
import { Button } from "@/application/components";
import { DateInput } from "@/application/features/abfrageteil-next/components/DateInput";
import {
  ElternteilAusklammerungszeitenInput,
  ElternteilAusklammerungszeitenOutput,
} from "@/application/features/abfrageteil-next/pages/elternteil/ElternteilAusklammerungZeitenPage";

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
  const { fields, append, remove } = useFieldArray({ control, name: grund });

  return (
    <div>
      <h5 className="pb-16 font-bold">{title}</h5>

      <div className="flex flex-col gap-32">
        {fields.map((field, index) => (
          <div key={field.id} className="flex flex-col">
            <div className="flex flex-wrap gap-10 *:grow *:basis-[22rem]">
              <div>
                <label
                  className={classNames("mb-4 block text-16", {
                    "text-danger": errors[grund]?.[index]?.von,
                  })}
                  htmlFor={`${field.id}-von`}
                >
                  Beginn (TT.MM.JJJJ)
                </label>
                <DateInput
                  id={`${field.id}-von`}
                  {...control.register(`${grund}.${index}.von`)}
                  error={errors[grund]?.[index]?.von?.message}
                />
              </div>

              <div>
                <label
                  className={classNames("mb-4 block text-16", {
                    "text-danger": errors[grund]?.[index]?.bis,
                  })}
                  htmlFor={`${field.id}-bis`}
                >
                  Ende (TT.MM.JJJJ)
                </label>
                <DateInput
                  id={`${field.id}-bis`}
                  {...control.register(`${grund}.${index}.bis`)}
                  error={errors[grund]?.[index]?.bis?.message}
                />
              </div>
            </div>

            {index > 0 && (
              <Button
                type="button"
                buttonStyle="link"
                className="mb-16 p-4"
                onClick={() => remove(index)}
                aria-label="Zeile löschen"
              >
                <span className="flex items-center gap-4 text-16">
                  <CloseIcon className="mt-4" />
                  <span>Zeitraum löschen</span>
                </span>
              </Button>
            )}
          </div>
        ))}
      </div>

      <Button
        type="button"
        buttonStyle="link"
        className="p-4"
        onClick={() => append({ von: "", bis: "" })}
      >
        <span className="flex items-center gap-4 text-16">
          <AddIcon className="mt-4" />
          <span>Weiteren Zeitraum hinzufügen</span>
        </span>
      </Button>
    </div>
  );
}
