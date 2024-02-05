import type { ElternteilType } from "@egr/monatsplaner-app";
import { VFC } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import {
  StepEinkommenState,
  initialTaetigkeit,
} from "../../../redux/stepEinkommenSlice";
import { Button } from "../../atoms";
import { SelectOption } from "../../molecules";
import { Taetigkeit } from "./Taetigkeit";

interface SelbstaendigAndErwerbstaetigProps {
  elternteil: ElternteilType;
  isSelbststaendig: boolean;
  monthsBeforeBirth: SelectOption[];
}

export const SelbstaendigAndErwerbstaetig: VFC<
  SelbstaendigAndErwerbstaetigProps
> = ({ elternteil, isSelbststaendig, monthsBeforeBirth }) => {
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
};
