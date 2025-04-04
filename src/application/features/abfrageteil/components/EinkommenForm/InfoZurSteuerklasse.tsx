import type { ReactNode } from "react";
import { InfoText } from "@/application/components";

export function InfoZurSteuerklasse(): ReactNode {
  return (
    <InfoText
      question="Ich habe die Steuerklasse gewechselt"
      answer="Wenn Sie die Steuerklasse in den letzten 12 Monaten vor der Geburt Ihres Kindes gewechselt haben: Nehmen Sie die Steuerklasse, die Sie am längsten hatten. Wenn Sie beide gleich lang hatten: Nehmen Sie die aktuellere."
    />
  );
}
