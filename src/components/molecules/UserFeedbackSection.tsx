import { useId, ReactNode, useState } from "react";
import ThumpUpOffAltIcon from "@digitalservicebund/icons/ThumbUpOffAlt";
import ThumpDownOffAltIcon from "@digitalservicebund/icons/ThumbDownOffAlt";
import classNames from "classnames";
import { Button } from "@/components/atoms";

type Props = {
  readonly className?: string;
};

export function UserFeedbackSection({ className }: Props): ReactNode {
  const labelIdentifier = useId();

  const [isCompleted, setIsCompleted] = useState(false);

  function sendFeedback(): void {
    // Actual feedback is "send" via the tag manager of the user tracking system.
    setIsCompleted(true);
  }

  return (
    <aside
      aria-labelledby={labelIdentifier}
      className={classNames(
        "flex flex-wrap gap-x-24 gap-y-16 bg-primary-light p-24",
        className,
      )}
    >
      <h2 id={labelIdentifier} className="basis-full text-base font-bold">
        {isCompleted
          ? "Vielen Dank für Ihr Feedback!"
          : "War der Elterngeldrechner mit Planer für Sie hilfreich?"}
      </h2>

      {!isCompleted && (
        <>
          <Button
            id="feedback-button-ja-war-hilfreich"
            label="Ja"
            iconBefore={<ThumpUpOffAltIcon />}
            buttonStyle="secondary"
            onClick={sendFeedback}
          />

          <Button
            id="feedback-button-nein-war-nicht-hilfreich"
            label="Nein"
            iconBefore={<ThumpDownOffAltIcon />}
            buttonStyle="secondary"
            onClick={sendFeedback}
          />
        </>
      )}
    </aside>
  );
}
