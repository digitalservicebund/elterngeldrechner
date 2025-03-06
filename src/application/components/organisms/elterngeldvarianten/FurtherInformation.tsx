import { ReactNode } from "react";

export function FurtherInformation(): ReactNode {
  return (
    <p className="p-0">
      Weitere Informationen finden Sie im{" "}
      <a
        target="_blank"
        rel="noreferrer"
        href="https://familienportal.de/familienportal/familienleistungen/elterngeld"
        className="underline"
      >
        Familienportal
      </a>
    </p>
  );
}
