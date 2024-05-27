import { useState } from "react";
import classNames from "classnames";
import Big from "big.js";
import {
  Elternteil as MonatsplanerElternteil,
  RemainingMonthByType,
} from "@/monatsplaner";
import { LebensmonateAfterBirth } from "@/redux/stepNachwuchsSlice";
import {
  getAutomaticallySelectedPSBMonthIndex,
  SelectedPSBMonthIndices,
} from "@/redux/monatsplanerSlice";
import { MonatsplanerMonth } from "@/components/atoms";
import type { ColumnType } from "@/components/organisms/monatsplaner/Monatsplaner";
import nsp from "@/globals/js/namespace";
import { formatMoney } from "@/components/molecules/rechner-result-table/RechnerResultTable";

export type AmountElterngeldRow =
  | "empty"
  | {
      amountElterngeldPlus: number;
      amountBasiselterngeld: number;
    };

interface Props {
  readonly lebensmonate: LebensmonateAfterBirth[];
  readonly selectablePSBMonths: SelectedPSBMonthIndices;
  readonly elternteil: MonatsplanerElternteil;
  readonly elternteilName: string;
  readonly onToggleMonth: (columnType: ColumnType, monthIndex: number) => void;
  readonly onDragOverMonth: (
    columnType: ColumnType,
    monthIndex: number,
  ) => void;
  readonly isBEGMonthSelectable: (index: number) => boolean;
  readonly isEGPMonthSelectable: (index: number) => boolean;
  readonly amounts: AmountElterngeldRow[];
  readonly hasMutterschutz: boolean;
  readonly mutterSchutzMonate: number;
  readonly remainingMonths: RemainingMonthByType;
  readonly hideLebensmonateOnDesktop?: boolean;
  readonly className?: string;
  readonly isElternteilOne?: boolean;
  readonly partnerMonate?: boolean;
}

export function Elternteil({
  lebensmonate,
  selectablePSBMonths,
  elternteil,
  elternteilName,
  onToggleMonth,
  onDragOverMonth,
  isBEGMonthSelectable,
  isEGPMonthSelectable,
  amounts,
  hasMutterschutz,
  mutterSchutzMonate,
  remainingMonths,
  hideLebensmonateOnDesktop,
  className,
  isElternteilOne,
  partnerMonate,
}: Props) {
  const [hoverPSBIndex, setHoverPSBIndex] = useState<number | null>(null);

  const allPSBIndices = [
    ...selectablePSBMonths.selectableIndices,
    ...selectablePSBMonths.deselectableIndices,
  ];
  const highestAllowedPSBIndex = Math.max(...allPSBIndices);
  const lowestAllowedPSBIndex = Math.min(...allPSBIndices);

  const automaticallySelectedPSBMonthIndex =
    hoverPSBIndex !== null &&
    getAutomaticallySelectedPSBMonthIndex(elternteil.months, hoverPSBIndex);

  const getLabel = (index: number, elterngeldTypeName: string) => {
    return `${elternteilName} ${elterngeldTypeName} für Lebensmonat ${
      index + 1
    }`;
  };

  const roundAndFormatMoney = (amount: number) =>
    formatMoney(Big(amount).round(0).toNumber(), 0);

  const getBasiselterngeld = (row: AmountElterngeldRow) => {
    if (row === "empty") {
      return "-";
    }
    return roundAndFormatMoney(row.amountBasiselterngeld);
  };

  const getElterngeldplus = (row: AmountElterngeldRow) => {
    if (row === "empty") {
      return "-";
    }
    return roundAndFormatMoney(row.amountElterngeldPlus);
  };

  function isBEGCellVisible(index: number): boolean {
    const isAlreadySelected = elternteil.months[index].type === "BEG";
    const isSelectable = isBEGMonthSelectable(index);
    return isAlreadySelected || isSelectable;
  }

  function isEGPCellVisible(index: number): boolean {
    const isAlreadySelected = elternteil.months[index].type === "EG+";
    const isSelectable = isEGPMonthSelectable(index);
    return isAlreadySelected || isSelectable;
  }

  return (
    <table className={classNames(nsp("elternteil"), className)}>
      <thead>
        <tr>
          <th
            colSpan={1}
            className={classNames(
              nsp("elternteil__lebensmonat"),
              hideLebensmonateOnDesktop &&
                nsp("elternteil__lebensmonat--hidden"),
            )}
          />
          <th colSpan={3} className={nsp("elternteil__name")}>
            {elternteilName}
          </th>
        </tr>
        <tr>
          <th
            className={classNames(
              nsp("elternteil__lebensmonat"),
              hideLebensmonateOnDesktop &&
                nsp("elternteil__lebensmonat--hidden"),
            )}
          >
            Lebens-monat
          </th>
          <th
            className={classNames(
              nsp("elternteil__th"),
              nsp("elternteil__th--basiselterngeld"),
            )}
          >
            Basis
          </th>
          <th
            className={classNames(
              nsp("elternteil__th"),
              nsp("elternteil__th--elterngeldplus"),
            )}
          >
            Plus
          </th>
          {!!partnerMonate && (
            <th
              className={classNames(
                nsp("elternteil__th"),
                nsp("elternteil__th--partnerschaftsbonus"),
              )}
            >
              Bonus
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {lebensmonate.map((lebensmonat, index) => (
          <tr key={lebensmonat.monthIsoString}>
            <td
              aria-label={`${index + 1} ${lebensmonat.labelLong}`}
              className={classNames(
                nsp("lebensmonate-cell"),
                hideLebensmonateOnDesktop && nsp("lebensmonate-cell--hidden"),
              )}
            >
              <div
                className={classNames(
                  nsp("lebensmonate-cell__lebensmonat-content"),
                )}
              >
                <span className={nsp("lebensmonate-cell__number")}>
                  {index + 1}
                </span>
              </div>
            </td>
            <td>
              {isBEGCellVisible(index) && (
                <MonatsplanerMonth
                  isSelected={elternteil.months[index].type === "BEG"}
                  label={getLabel(index, "Basiselterngeld")}
                  elterngeldType="BEG"
                  onToggle={() => onToggleMonth("BEG", index)}
                  onDragOver={() => onDragOverMonth("BEG", index)}
                  isMutterschutzMonth={
                    elternteil.months[index].isMutterschutzMonth
                  }
                  isElternteilOne={isElternteilOne}
                >
                  {getBasiselterngeld(amounts[index])}
                </MonatsplanerMonth>
              )}
            </td>
            <td>
              {isEGPCellVisible(index) &&
                (!hasMutterschutz || index >= mutterSchutzMonate) &&
                (remainingMonths.elterngeldplus > 0 ||
                  elternteil.months[index].type === "EG+") && (
                  <MonatsplanerMonth
                    isSelected={elternteil.months[index].type === "EG+"}
                    label={getLabel(index, "ElterngeldPlus")}
                    elterngeldType="EG+"
                    onToggle={() => onToggleMonth("EG+", index)}
                    onDragOver={() => onDragOverMonth("EG+", index)}
                  >
                    {getElterngeldplus(amounts[index])}
                  </MonatsplanerMonth>
                )}
            </td>
            {!!partnerMonate && (
              <td>
                {index >= mutterSchutzMonate &&
                  index >= lowestAllowedPSBIndex &&
                  index <= highestAllowedPSBIndex && (
                    <MonatsplanerMonth
                      isSelected={elternteil.months[index].type === "PSB"}
                      isHighlighted={
                        automaticallySelectedPSBMonthIndex === index
                      }
                      label={getLabel(index, "Partnerschaftsbonus")}
                      elterngeldType="PSB"
                      onToggle={() => onToggleMonth("PSB", index)}
                      onDragOver={() => onDragOverMonth("PSB", index)}
                      onMouseOver={() => setHoverPSBIndex(index)}
                      onMouseLeave={() => setHoverPSBIndex(null)}
                    >
                      {getElterngeldplus(amounts[index])}
                    </MonatsplanerMonth>
                  )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
