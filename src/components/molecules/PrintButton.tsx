import SaveAltIcon from "@digitalservicebund/icons/SaveAlt";
import { ReactNode } from "react";
import { Button } from "@/components/atoms";

export function PrintButton(): ReactNode {
  return (
    <div className="print:hidden">
      <Button
        buttonStyle="link"
        label="Drucken der Planung"
        iconBefore={<SaveAltIcon />}
        onClick={window.print}
      />

      <p>
        Um Ihre Planung zu speichern, wählen Sie in der Druckvorschau „als PDF
        speichern“ aus.
      </p>
    </div>
  );
}
