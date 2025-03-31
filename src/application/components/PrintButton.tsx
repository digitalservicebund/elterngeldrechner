import SaveAltIcon from "@digitalservicebund/icons/SaveAlt";
import { ReactNode } from "react";
import { Button } from "@/application/components";

export function PrintButton(): ReactNode {
  return (
    <div className="print:hidden">
      <Button type="button" buttonStyle="link" onClick={window.print}>
        <SaveAltIcon /> Drucken der Planung
      </Button>

      <p>
        Um Ihre Planung zu speichern, wählen Sie in der Druckvorschau „als PDF
        speichern“ aus.
      </p>
    </div>
  );
}
