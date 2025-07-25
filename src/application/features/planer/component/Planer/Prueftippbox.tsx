import AddIcon from "@digitalservicebund/icons/Add";
import LightbulbIcon from "@digitalservicebund/icons/LightbulbOutlined";
import { ReactNode } from "react";
import { Tips } from "./Pruefbuttonbox";
import { Button } from "@/application/components/Button";

type Props = {
  readonly tips: Tips;
  readonly onBonusFreischalten?: () => void;
};

export function Prueftippbox({ tips, onBonusFreischalten }: Props): ReactNode {
  return (
    <>
      {tips.hasSpecialBonusTip === true && (
        <div className="my-10 flex flex-col items-center gap-24 bg-white p-40">
          <div className="flex gap-10">
            <LightbulbIcon className="-mt-8 text-[2.3rem]" />
            <span>
              Tipp: Wenn Sie im Anschluss an Ihre Planung beide in Teilzeit
              arbeiten, können Sie den Partnerschaftsbonus bekommen. Sie
              bekommen dann zusammen noch vier Monate zusätzlich Elterngeld.
            </span>
          </div>

          <Button
            type="button"
            buttonStyle="secondary"
            className="bg-white"
            onClick={onBonusFreischalten}
          >
            <AddIcon /> zusätzlich Bonus freischalten
          </Button>
        </div>
      )}

      {tips.normalTips.length > 0 && (
        <div className="my-10 bg-white p-40">
          {tips.normalTips.length === 1 ? (
            <p>
              <LightbulbIcon className="mr-10 text-primary" />
              Tipp:&nbsp; {tips.normalTips[0]}
            </p>
          ) : (
            <>
              <p className="-mt-8">
                <LightbulbIcon className="mr-10 text-primary" />
                Tipp:&nbsp;
              </p>
              <ul className="ml-40 mt-10 list-disc pl-24">
                {tips.normalTips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </>
  );
}
