import classNames from "classnames";
import { type CSSProperties, ReactNode } from "react";

type Props = {
  readonly question: string;
  readonly answer: ReactNode;
  readonly className?: string;
  readonly style?: CSSProperties;
};

export function InfoText({
  question,
  answer,
  className,
  style,
}: Props): ReactNode {
  return (
    <details
      className={className}
      style={style}
      onToggle={(event) => event.stopPropagation()} // Avoid confusion for listeners on parent <details /> elements.
    >
      <summary className="text-primary">
        <u>{question}</u>
      </summary>

      <div
        className={classNames(
          "mt-4 border-0 border-l-4 border-solid border-grey pl-10",
        )}
      >
        {typeof answer === "string" ? <p>{answer}</p> : answer}
      </div>
    </details>
  );
}
