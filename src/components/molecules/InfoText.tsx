import { ReactNode } from "react";

export interface InfoTextProps {
  readonly question: string;
  readonly answer: string;
  readonly className?: string;
}

export function InfoText({
  question,
  answer,
  className,
}: InfoTextProps): ReactNode {
  return (
    <details className={className}>
      <summary className="text-primary underline">{question}</summary>

      <p className="border-0 border-l-4 border-solid border-[#B1B4B6] pl-[12px]">
        {answer}
      </p>
    </details>
  );
}
