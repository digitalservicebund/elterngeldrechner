import { ReactNode } from "react";

export interface InfoTextProps {
  readonly question: string;
  readonly answer: ReactNode;
  readonly className?: string;
}

export function InfoText({
  question,
  answer,
  className,
}: InfoTextProps): ReactNode {
  return (
    <details className={className}>
      <summary className="text-primary">
        <u>{question}</u>
      </summary>

      <div className="mt-4 border-0 border-l-4 border-solid border-grey pl-10">
        {typeof answer === "string" ? <p>{answer}</p> : answer}
      </div>
    </details>
  );
}
