import { ReactNode } from "react";

export function FurtherInformation(): ReactNode {
  return (
    <p className="p-0">
      Weitere Informationen finden Sie auf der{" "}
      <a
        target="_blank"
        rel="noreferrer"
        href="https://www.bmfsfj.de/bmfsfj/themen/familie/familienleistungen/elterngeld/elterngeld-73752"
        className="underline"
      >
        Webseite des Familienministeriums
      </a>
    </p>
  );
}
