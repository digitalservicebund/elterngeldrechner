import { useFieldArray, useFormContext } from "react-hook-form";
import { Taetigkeit } from "./Taetigkeit";
import type { ElternteilType } from "@/redux/elternteil-type";
import {
  StepEinkommenState,
  initialTaetigkeit,
} from "@/redux/stepEinkommenSlice";
import { Button } from "@/components/atoms";
import { SelectOption } from "@/components/molecules";

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
  const { control } = useFormContext<StepEinkommenState>();

  const name =
    `${elternteil}.taetigkeitenNichtSelbstaendigUndSelbstaendig` as const;
  const taetigkeitenFields = useFieldArray({
    name,
    control,
  });

  return (
    <>
      {taetigkeitenFields.fields.map((field, index) => (
        <Taetigkeit
          key={field.id}
          elternteil={elternteil}
          taetigkeitsIndex={index}
          isSelbststaendig={isSelbststaendig}
          monthsBeforeBirth={monthsBeforeBirth}
          onRemove={() => taetigkeitenFields.remove(index)}
        />
      ))}
      <Button
        buttonStyle="primary"
        onClick={() => taetigkeitenFields.append(initialTaetigkeit)}
        label={
          taetigkeitenFields.fields.length
            ? "weitere Tätigkeit hinzufügen"
            : "eine Tätigkeit hinzufügen"
        }
      />
    </>
  );
}
