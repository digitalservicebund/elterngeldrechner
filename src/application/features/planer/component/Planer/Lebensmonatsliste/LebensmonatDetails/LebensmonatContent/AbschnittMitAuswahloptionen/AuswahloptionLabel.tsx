import LockIcon from "@digitalservicebund/icons/Lock";
import classNames from "classnames";
import { ReactNode } from "react";
import { Geldbetrag } from "@/application/components";
import {
  type Auswahloption,
  type Elterngeldbezug,
  KeinElterngeld,
  Variante,
} from "@/monatsplaner";

type Props = {
  readonly option: Auswahloption;
  readonly istBasisImMutterschutz: boolean; // TODO: How to enforce relation with `option` caller friendly?
  readonly istBonusWithMissingBruttoeinkommen: boolean;
  readonly elterngeldbezug: Elterngeldbezug;
  readonly istAusgewaehlt?: boolean;
  readonly istAuswaehlbar?: boolean;
  readonly htmlFor: string;
};

export function AuswahloptionLabel({
  option,
  istBasisImMutterschutz,
  istBonusWithMissingBruttoeinkommen,
  elterngeldbezug,
  istAusgewaehlt,
  istAuswaehlbar,
  htmlFor,
}: Props): ReactNode {
  const { label, className } = getRenderProperties(
    option,
    istBasisImMutterschutz,
    istBonusWithMissingBruttoeinkommen,
    !!istAuswaehlbar,
  );

  const icon = getIcon(
    istBasisImMutterschutz,
    !!istAusgewaehlt,
    !!istAuswaehlbar,
  );

  return (
    <label
      className={classNames(
        "flex min-h-42 items-center rounded bg-Basis p-8 text-14",
        {
          "cursor-default !bg-grey !text-grey-dark": !istAuswaehlbar,
        },
        {
          "hover:underline hover:underline-offset-2":
            istAuswaehlbar && !istBasisImMutterschutz,
        },
        "outline-2 outline-offset-2 outline-Basis peer-focus-visible:outline",
        className,
      )}
      htmlFor={htmlFor}
    >
      <span aria-hidden className="flex items-center gap-6">
        {icon}
        <div className="text-2 pb-2 leading-none">
          <span className="font-bold">{label}</span>

          {!!elterngeldbezug && (
            <>
              &nbsp;
              <Geldbetrag betrag={elterngeldbezug} />
            </>
          )}
        </div>
      </span>
    </label>
  );
}

function getIcon(
  istBasisImMutterschutz: boolean,
  istAusgewaehlt: boolean,
  istAuswaehlbar: boolean,
) {
  if (istBasisImMutterschutz) {
    return <LockIcon className="text-Plus" />;
  }

  if (!istAuswaehlbar) {
    return undefined;
  }

  return (
    <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <circle
        cx="9"
        cy="9"
        r="8"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      />
      {!!istAusgewaehlt && (
        <path
          d="M 5,9 l 3,3 l 5,-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        />
      )}
    </svg>
  );
}

function getRenderProperties(
  option: Auswahloption,
  istBasisImMutterschutz: boolean,
  istBonusWithMissingBruttoeinkommen: boolean,
  istAuswaehlbar: boolean,
): RenderProperties {
  switch (option) {
    case Variante.Basis:
      return {
        label: istBasisImMutterschutz ? (
          "Mutterschutz"
        ) : (
          <>
            Basis{" "}
            {istAuswaehlbar ? (
              ""
            ) : (
              <span className="text-12 font-regular">(nicht verfügbar)</span>
            )}
          </>
        ),
        className: `bg-Basis text-white ${!istBasisImMutterschutz && "hover:bg-Basis-hover"}`,
      };

    case Variante.Plus:
      return {
        label: (
          <>
            Plus{" "}
            {istAuswaehlbar ? (
              ""
            ) : (
              <span className="text-12 font-regular">(nicht verfügbar)</span>
            )}
          </>
        ),
        className: "bg-Plus text-black hover:bg-Plus-hover",
      };

    case Variante.Bonus:
      return {
        label: (
          <>
            Bonus{" "}
            {istAuswaehlbar ? (
              ""
            ) : (
              <span className="text-12 font-regular">(nicht verfügbar)</span>
            )}
          </>
        ),
        className: istBonusWithMissingBruttoeinkommen
          ? "bg-Bonus-light text-black relative before:content-[''] before:absolute before:inset-0 before:border-2 before:border-Bonus-dark before:border-dashed before:rounded"
          : "bg-Bonus text-black hover:bg-Bonus-hover",
      };

    case KeinElterngeld:
      return {
        label: "kein Elterngeld",
        className: "bg-white text-black border-grey border-2 border-solid",
      };
  }
}

type RenderProperties = {
  label: ReactNode;
  className: string;
};
