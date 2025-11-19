import AddIcon from "@digitalservicebund/icons/Add";
import LightbulbIcon from "@digitalservicebund/icons/LightbulbOutlined";
import { ReactNode, SyntheticEvent } from "react";
import { Tips } from "./generateTips";
import { Button } from "@/application/components/Button";

type Props = {
  readonly tips: Tips;
  readonly alleinerziehend?: boolean;
  readonly onBonusFreischalten?: (event: SyntheticEvent) => void;
};

export function Prueftippbox({
  tips,
  alleinerziehend,
  onBonusFreischalten,
}: Props): ReactNode {
  return (
    <>
      {tips.hasSpecialBonusTip === true && (
        <div className="my-10 flex flex-col items-center gap-24 bg-white p-40">
          <div className="flex gap-10">
            <LightbulbIcon className="-mt-8 text-[2.3rem]" />
            <p>
              Tipp: Wenn Sie im Anschluss an Ihre Planung{" "}
              {!alleinerziehend && <strong>beide </strong>}
              in Teilzeit arbeiten, können Sie den Partnerschaftsbonus bekommen.
              Sie bekommen dann {!alleinerziehend && (
                <span>zusammen </span>
              )}{" "}
              noch vier Monate zusätzlich Elterngeld.
            </p>
          </div>

          <Button
            type="button"
            buttonStyle="secondary"
            className="bg-white"
            id="bonus-freischalten-button"
            onClick={onBonusFreischalten}
          >
            <AddIcon /> zusätzlich Bonus freischalten
          </Button>
        </div>
      )}

      {tips.normalTips.length > 0 && (
        <div className="my-10 bg-white p-40">
          <p className="-mt-8">
            <LightbulbIcon className="mr-10 text-primary" />
            Tipp:&nbsp;
          </p>
          <ul className="ml-40 mt-10 list-disc pl-24">
            {tips.normalTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
