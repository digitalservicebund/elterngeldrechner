import { type CSSProperties, ReactNode } from "react";

import posthog from "posthog-js";

type Props = {
  readonly question: string;
  readonly answer: ReactNode;
  readonly className?: string;
  readonly style?: CSSProperties;
};

export function InfoText(properties: Props): ReactNode {
  const { question, answer, className, style } = properties;

  const onToggle = (event: React.ToggleEvent) => {
    // Avoid confusion for listeners on parent <details /> elements.
    event.stopPropagation();

    if (event.newState === "open") {
      posthog.capture("info_text_ausgeklappt", { frage: question });
    }
  };

  return (
    <details className={className} style={style} onToggle={onToggle}>
      <summary className="text-primary">
        <u>{question}</u>
      </summary>

      <div className="mt-4 border-0 border-l-4 border-solid border-grey pl-10 [&_ul]:ml-24 [&_ul]:list-disc">
        {typeof answer === "string" ? <p>{answer}</p> : answer}
      </div>
    </details>
  );
}
