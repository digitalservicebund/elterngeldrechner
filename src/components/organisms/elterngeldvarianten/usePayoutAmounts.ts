import { useEffect, useState } from "react";
import {
  BruttoEinkommenZeitraum,
  ElterngeldRow,
  calculateElterngeld,
} from "../../../redux/stepRechnerSlice";
import { useAppStore } from "../../../redux/hooks";
import { PayoutAmountsForAllVariants } from "./types";

/**
 * Wrapper around the currently messy approach to use the calculation of the
 * payout amounts defined in the Redux store. As the whole calculation is very
 * tangled and hard to use independently of the stores, this hook should
 * simplify the usage.
 * The hook is fully optimized and typed for its specific usage and context
 * within the component tree.
 */
export function usePayoutAmounts() {
  const store = useAppStore();
  const [payoutAmounts, setPayoutAmounts] =
    useState<PayoutAmountsForAllVariants>();

  useEffect(() => {
    const state = store.getState();

    Promise.all([
      calculateElterngeld(state, "ET1", EMPTY_FUTURE_INCOME),
      calculateElterngeld(state, "ET2", EMPTY_FUTURE_INCOME),
    ]).then(([rowsET1, rowsET2]) => {
      const payoutAmounts = formatRowsToPayoutAmounts(
        findFristRepresentativeMonth(rowsET1),
        findFristRepresentativeMonth(rowsET2),
      );
      setPayoutAmounts(payoutAmounts);
    });
  }, [store]);

  return payoutAmounts;
}

/**
 * The goal is to find a single amount per variant that is representative and
 * give the user an idea how much the payout would be. But the calculated result
 * provides a list with amounts per month. As there is no better evaluation,
 * just the first month is taken.
 * But as there can be scenarios like maternity protection, the first months are
 * skipped, till the first month with a non zero payout amount. This might
 * differ between both parents, especially in the maternity protection scenario.
 */
function findFristRepresentativeMonth(rows: ElterngeldRow[]): ElterngeldRow {
  return rows.find((row) => row.basisElternGeld > 0) ?? rows[0];
}

function formatRowsToPayoutAmounts(
  rowET1: ElterngeldRow,
  rowET2: ElterngeldRow,
): PayoutAmountsForAllVariants {
  return {
    basiselterngeld: {
      ET1: rowET1.basisElternGeld,
      ET2: rowET2.basisElternGeld,
    },
    elterngeldplus: {
      ET1: rowET1.elternGeldPlus,
      ET2: rowET2.elternGeldPlus,
    },
    partnerschaftsbonus: {
      ET1: rowET1.elternGeldPlus,
      ET2: rowET2.elternGeldPlus,
    },
  };
}

/**
 * The actual calculation (at the used level) includes the values of some
 * potential additional income while receiving parental allowance. To "just" get
 * some payout amounts as an initial overview, there is no income to calculate
 * with.
 */
const EMPTY_FUTURE_INCOME: BruttoEinkommenZeitraum[] = [];
