import { useId, ReactNode } from "react";
import ThumpUpOffAltIcon from "@digitalservicebund/icons/ThumbUpOffAlt";
import ThumpDownOffAltIcon from "@digitalservicebund/icons/ThumbDownOffAlt";
import classNames from "classnames";
import { Button } from "@/components/atoms";

type Props = {
  readonly className?: string;
};

export function UserFeedbackSection({ className }: Props): ReactNode {
  const labelIdentifier = useId();

  return (
    <aside
      aria-labelledby={labelIdentifier}
      className={classNames(
        "flex gap-y-16 gap-x-24 bg-primary-light flex-wrap p-24",
        className,
      )}
    >
      <h4 id={labelIdentifier} className="basis-full text-base">
        War der Elterngeldrechner mit Planer für Sie hilfreich?
      </h4>

      <Button
        id="feedback-button-ja-war-hilfreich"
        label="Ja"
        iconBefore={<ThumpUpOffAltIcon />}
        buttonStyle="secondary"
        className="bg-primary-light hover:bg-primary focus:bg-primary"
      />

      <Button
        id="feedback-button-nein-war-nicht-hilfreich"
        label="Nein"
        iconBefore={<ThumpDownOffAltIcon />}
        buttonStyle="secondary"
        className="bg-primary-light hover:bg-primary focus:bg-primary"
      />
    </aside>
  );
}
