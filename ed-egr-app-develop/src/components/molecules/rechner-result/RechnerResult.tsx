import { ReactNode, useEffect, useState, VFC } from "react";
import type { ElternteilType } from "@egr/monatsplaner-app";
import {
  RechnerResultTable,
  RechnerResultTableRow,
} from "../rechner-result-table";
import nsp from "../../../globals/js/namespace";
import { useAppSelector } from "../../../redux/hooks";
import { ElterngeldRow } from "../../../redux/stepRechnerSlice";
import { Icon, NotificationMaxElterngeld, P, Toast } from "../../atoms";
import { FootNote } from "../foot-note";

interface Props {
  elternteil: ElternteilType;
}

const getRechnerResultTableRows = (
  pickAmountElterngeld: (resultRow: ElterngeldRow) => number,
  rows: ElterngeldRow[],
): RechnerResultTableRow[] => {
  return rows
    .filter((row) => row.elternGeldPlus !== 0 || row.basisElternGeld !== 0)
    .map((row) => {
      const amountElterngeld = pickAmountElterngeld(row);

      return {
        vonLebensMonat: row.vonLebensMonat,
        bisLebensMonat: row.bisLebensMonat,
        amountElterngeld: amountElterngeld,
        amountTotal: amountElterngeld + row.nettoEinkommen,
      };
    });
};

export const RechnerResult: VFC<Props> = ({ elternteil }) => {
  const result = useAppSelector(
    (state) => state.stepRechner[elternteil].elterngeldResult,
  );

  const [notificationMessages, setNotificationMessages] = useState<
    ReactNode[] | null
  >(null);

  useEffect(() => {
    if (result.state === "success") {
      result.data.every((value) => {
        if (value.basisElternGeld >= 1800 || value.nettoEinkommen >= 2770) {
          setNotificationMessages([<NotificationMaxElterngeld />]);
          return false;
        }
        return true;
      });
    } else {
      setNotificationMessages(null);
    }
  }, [result]);

  if (result.state === "init") {
    return null;
  }

  if (result.state === "pending") {
    return null;
  }

  if (result.state === "error") {
    return (
      <P className={nsp("rechner-result-error")}>
        <Icon name="info" /> Das Elterngeld konnte nicht berechnet werden.
      </P>
    );
  }

  const begTableRows: RechnerResultTableRow[] = getRechnerResultTableRows(
    (row) => row.basisElternGeld,
    result.data,
  );
  const egplusTableRows: RechnerResultTableRow[] = getRechnerResultTableRows(
    (row) => row.elternGeldPlus,
    result.data,
  );

  const isAnyBEGMonthOver14Months = begTableRows.some(
    (row) => row.vonLebensMonat > 14 || row.bisLebensMonat > 14,
  );

  const onUnMountToast = () => {
    setNotificationMessages(null);
  };

  return (
    <section
      className={nsp("rechner-result")}
      aria-label="Elterngeld berechnen Ergebnis"
    >
      <RechnerResultTable
        className={nsp("rechner-result__basiselterngeld")}
        rows={begTableRows}
        elterngeldType="Basis"
        titleTotal="Basis + Netto-Einkommen"
        markOver14Month={isAnyBEGMonthOver14Months}
      />
      {isAnyBEGMonthOver14Months && (
        <FootNote number={1} prefix="rechner">
          *Basiselterngeld können Sie nur bis zum 14. Lebensmonat beantragen
        </FootNote>
      )}
      <RechnerResultTable
        className={nsp("rechner-result__elterngeldplus")}
        rows={egplusTableRows}
        elterngeldType="Plus/Bonus"
        titleTotal="Plus/Bonus + Netto-Einkommen"
        hideLebensmonate={true}
      />
      {notificationMessages && (
        <Toast
          messages={notificationMessages}
          active={!!notificationMessages}
          onUnMount={onUnMountToast}
          timeout={12000}
        />
      )}
    </section>
  );
};
