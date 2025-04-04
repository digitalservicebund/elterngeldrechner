import type { ReactNode } from "react";
import { InfoText } from "@/application/components";

export function InfoZuAlleinerziehenden(): ReactNode {
  return (
    <InfoText
      question="Was bedeutet alleinerziehend?"
      answer="Als alleinerziehend gelten Sie, wenn der andere Elternteil weder mit Ihnen noch mit dem Kind zusammen wohnt und Sie steuerrechtlich als alleinerziehend gelten."
    />
  );
}
