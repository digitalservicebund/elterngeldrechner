import { ElterngeldType } from "@/monatsplaner";
import React, { FC } from "react";
import classNames from "classnames";
import nsp from "@/globals/js/namespace";
import { InfoDialog, infoTexts } from "@/components/molecules/info-dialog";

interface Props {
  isSelected?: boolean;
  isMutterschutzMonth?: boolean;
  isElternteilOne?: boolean;
  isHighlighted?: boolean;
  elterngeldType: ElterngeldType;
  label: string;
  children: React.ReactNode;
  onToggle: () => void;
  onDragOver: () => void;
  onMouseOver?: () => void;
  onMouseLeave?: () => void;
}

export const MonatsplanerMonth: FC<Props> = ({
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
}) => {
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

  function onFocus(event: React.FocusEvent) {
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
          isMonatsplanner={true}
          isElternteilOne={isElternteilOne}
          info={infoTexts.monatsplannerMutterschaftsleistungen}
        />
      ) : (
        <>
          <button
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
};
