import CloseIcon from "@digitalservicebund/icons/Close";
import type { ReactNode } from "react";

export function BeispielLegend(): ReactNode {
  return (
    <ul className="flex gap-20">
      <li className="flex items-center gap-10">
        <span
          className="flex h-[32px] w-[64px] items-center justify-center bg-Basis text-white"
          aria-hidden="true"
        >
          B
        </span>
        <strong>Basiselterngeld</strong>
      </li>

      <li className="flex items-center gap-10">
        <span
          className="flex h-[32px] w-[64px] items-center justify-center bg-Plus"
          aria-hidden="true"
        >
          P
        </span>
        <strong>ElterngeldPlus</strong>
      </li>

      <li className="flex items-center gap-10">
        <span
          className="flex h-[32px] w-[64px] items-center justify-center border border-solid border-grey"
          aria-hidden="true"
        >
          <CloseIcon aria-hidden="true" focusable="false" />
        </span>
        <strong>Kein Elterngeld</strong>
      </li>
    </ul>
  );
}
