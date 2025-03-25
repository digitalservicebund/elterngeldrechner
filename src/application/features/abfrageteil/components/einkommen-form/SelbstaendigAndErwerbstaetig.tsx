import { useRef } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Taetigkeit } from "./taetigkeit";
import { Button } from "@/application/components";
import { type SelectOption } from "@/application/features/abfrageteil/components/common";
import {
  type ElternteilType,
  type StepEinkommenState,
  initialTaetigkeit,
} from "@/application/features/abfrageteil/state";

interface SelbstaendigAndErwerbstaetigProps {
  readonly elternteil: ElternteilType;
  readonly isSelbststaendig: boolean;
  readonly monthsBeforeBirth: SelectOption[];
}

export function SelbstaendigAndErwerbstaetig({
  elternteil,
  isSelbststaendig,
  monthsBeforeBirth,
}: SelbstaendigAndErwerbstaetigProps) {
  const taetigkeitHinzfuegenButtonElement = useRef<HTMLButtonElement>(null);
  const letztesTaetigkeitsElement = useRef<HTMLElement>(null);

  const { control } = useFormContext<StepEinkommenState>();

  const name =
    `${elternteil}.taetigkeitenNichtSelbstaendigUndSelbstaendig` as const;
  const taetigkeitenFields = useFieldArray({
    name,
    control,
  });

  function fuegeTaetigkeitHinzu(): void {
    taetigkeitenFields.append(initialTaetigkeit);
    // Compensate for render delay adding new element for Taetigkeit (non critical).
    setTimeout(() => letztesTaetigkeitsElement.current?.focus());
  }

  function entferneTaetigkeit(index: number): void {
    taetigkeitenFields.remove(index);
    taetigkeitHinzfuegenButtonElement.current?.focus();
  }

  return (
    <>
      {taetigkeitenFields.fields.map((field, index) => {
        const isLastTaetigkeit = index === taetigkeitenFields.fields.length - 1;
        const ref = isLastTaetigkeit ? letztesTaetigkeitsElement : undefined;

        return (
          <Taetigkeit
            key={field.id}
            ref={ref}
            elternteil={elternteil}
            taetigkeitsIndex={index}
            isSelbststaendig={isSelbststaendig}
            monthsBeforeBirth={monthsBeforeBirth}
            onRemove={() => entferneTaetigkeit(index)}
          />
        );
      })}

      <Button
        ref={taetigkeitHinzfuegenButtonElement}
        buttonStyle="primary"
        onClick={fuegeTaetigkeitHinzu}
        label={
          taetigkeitenFields.fields.length
            ? "weitere Tätigkeit hinzufügen"
            : "eine Tätigkeit hinzufügen"
        }
      />
    </>
  );
}
