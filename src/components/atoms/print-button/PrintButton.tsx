import SaveAltIcon from "@digitalservicebund/icons/SaveAlt";
import { Button } from "@/components/atoms/button";

export function PrintButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Button
      buttonStyle="link"
      label="Download der Planung"
      iconBefore={<SaveAltIcon />}
      onClick={handlePrint}
    />
  );
}
