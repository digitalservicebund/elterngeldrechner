import { VFC } from "react";
import classNames from "classnames";
import nsp from "../../../globals/js/namespace";
import { FootNoteNumber } from "../../atoms";
import Big from "big.js";

export interface RechnerResultTableRow {
  vonLebensMonat: number;
  bisLebensMonat: number;
  amountElterngeld: number;
  amountTotal: number;
}

interface Props {
  rows: RechnerResultTableRow[];
  elterngeldType: "Basis" | "Plus/Bonus";
  titleTotal: string;
  markOver14Month?: boolean;
  hideLebensmonate?: boolean;
  className?: string;
}

const roundAndFormatMoney = (amount: number) =>
  formatMoney(Big(amount).round(0).toNumber(), 0);

export const formatMoney = (number: number, fractionDigits?: number) => {
  return number.toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
    currencyDisplay: "symbol",
    minimumFractionDigits: fractionDigits ?? 2,
    maximumFractionDigits: fractionDigits ?? 2,
  });
};

export const RechnerResultTable: VFC<Props> = ({
  rows,
  elterngeldType,
  titleTotal,
  markOver14Month,
  hideLebensmonate,
  className,
}) => {
  return (
    <table
      className={classNames(
        nsp("rechner-result-table"),
        elterngeldType !== "Basis" &&
          nsp("rechner-result-table--elterngeldplus"),
        className,
      )}
    >
      <thead>
        <tr>
          <th
            className={classNames(
              nsp("rechner-result-table__lebensmonate"),
              hideLebensmonate && nsp("hide-on-desktop"),
            )}
          >
            Lebensmonate
          </th>
          <th className={nsp("rechner-result-table__cell")}>
            {elterngeldType}
          </th>
          <th className={nsp("rechner-result-table__cell")}>{titleTotal}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(
          ({
            vonLebensMonat,
            bisLebensMonat,
            amountElterngeld,
            amountTotal,
          }) => (
            <tr key={vonLebensMonat}>
              <td
                className={classNames(
                  hideLebensmonate && nsp("hide-on-desktop"),
                )}
                aria-label={
                  vonLebensMonat === bisLebensMonat
                    ? `Lebensmonat ${vonLebensMonat}`
                    : `Lebensmonat von ${vonLebensMonat} bis ${bisLebensMonat}`
                }
              >
                {vonLebensMonat === bisLebensMonat
                  ? vonLebensMonat
                  : `${vonLebensMonat} - ${bisLebensMonat}`}
              </td>
              <td className={nsp("rechner-result-table__cell--result")}>
                {roundAndFormatMoney(amountElterngeld)}
                {markOver14Month &&
                  (vonLebensMonat > 14 || bisLebensMonat > 14) && (
                    <FootNoteNumber number={1} type="anchor" prefix="rechner" />
                  )}
              </td>
              <td className={nsp("rechner-result-table__cell--total")}>
                {roundAndFormatMoney(amountTotal)}
                {markOver14Month &&
                  (vonLebensMonat > 14 || bisLebensMonat > 14) && (
                    <FootNoteNumber number={1} type="anchor" prefix="rechner" />
                  )}
              </td>
            </tr>
          ),
        )}
      </tbody>
    </table>
  );
};
