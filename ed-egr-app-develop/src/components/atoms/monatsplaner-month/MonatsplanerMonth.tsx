import { ElterngeldType } from "@egr/monatsplaner-app";
import React, { FC } from "react";
import classNames from "classnames";
import nsp from "../../../globals/js/namespace";
import { InfoDialog, infoTexts } from "../../molecules/info-dialog";

interface Props {
  isSelected?: boolean;
  isMutterschutzMonth?: boolean;
  isElternteilOne?: boolean;
  isHighlighted?: boolean;
  elterngeldType: ElterngeldType;
  label: string;
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
          <input
            id={label.replace(/ /g, "_")}
            className={nsp("monatsplaner-month__checkbox")}
            type="checkbox"
            checked={isSelected}
            onChange={onToggle}
          />
          <label
            htmlFor={label.replace(/ /g, "_")}
            aria-label={label}
            onMouseDown={handleMouseDown}
            onClick={handleClick}
            onMouseOver={handleMouseOver}
            onMouseLeave={onMouseLeave}
          >
            {children}
          </label>
        </>
      )}
    </div>
  );
};
