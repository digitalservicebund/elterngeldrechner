import React from "react";
import classNames from "classnames";
import { ElterngeldType } from "@/monatsplaner";
import nsp from "@/globals/js/namespace";
import { InfoDialog, infoTexts } from "@/components/molecules/info-dialog";

interface Props {
  readonly isSelected?: boolean;
  readonly isMutterschutzMonth?: boolean;
  readonly isElternteilOne?: boolean;
  readonly isHighlighted?: boolean;
  readonly elterngeldType: ElterngeldType;
  readonly label: string;
  readonly children: React.ReactNode;
  readonly onToggle: () => void;
  readonly onDragOver: () => void;
  readonly onMouseOver?: () => void;
  readonly onMouseLeave?: () => void;
}

export function MonatsplanerMonth({
  isSelected,
  isMutterschutzMonth,
  isElternteilOne,
  isHighlighted,
  label,
  elterngeldType,
  onToggle,
  onDragOver,
  onMouseOver,
  onMouseLeave,
  children,
}: Props) {
  const handleMouseDown = () => {
    onToggle();
  };
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleMouseOver = (e: React.MouseEvent) => {
    if (e.buttons !== 0) {
      onDragOver();
    }
    onMouseOver && onMouseOver();
  };

  function onFocus() {
    onMouseOver && onMouseOver();
  }

  return (
    <div
      className={classNames(
        nsp("monatsplaner-month"),
        isSelected && nsp("monatsplaner-month--selected"),
        isHighlighted && nsp("monatsplaner-month--highlighted"),
        elterngeldType === "BEG" && nsp("monatsplaner-month--beg"),
        elterngeldType === "EG+" && nsp("monatsplaner-month--egplus"),
        elterngeldType === "PSB" && nsp("monatsplaner-month--psb"),
      )}
      data-testid={label}
    >
      {isMutterschutzMonth ? (
        <InfoDialog
          isMonatsplanner
          isElternteilOne={isElternteilOne}
          info={infoTexts.monatsplannerMutterschaftsleistungen}
        />
      ) : (
        <>
          <button
            type="button"
            aria-label={label}
            onMouseDown={handleMouseDown}
            onClick={handleClick}
            onMouseOver={handleMouseOver}
            onFocus={onFocus}
            onBlur={onMouseLeave}
            onMouseLeave={onMouseLeave}
          >
            {children}
          </button>
        </>
      )}
    </div>
  );
}
