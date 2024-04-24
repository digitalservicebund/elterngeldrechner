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
      const payoutAmounts = formatRowsToPayoutAmounts(rowsET1, rowsET2);
      setPayoutAmounts(payoutAmounts);
    });
  }, [store]);

  return payoutAmounts;
}

function formatRowsToPayoutAmounts(
  rowsET1: ElterngeldRow[],
  rowsET2: ElterngeldRow[],
) {
  const presentativeRowET1 = rowsET1[REPRESENTATIVE_MONTH_INDEX];
  const presentativeRowET2 = rowsET2[REPRESENTATIVE_MONTH_INDEX];

  return {
    basiselterngeld: {
      ET1: presentativeRowET1.basisElternGeld,
      ET2: presentativeRowET2.basisElternGeld,
    },
    elterngeldplus: {
      ET1: presentativeRowET1.elternGeldPlus,
      ET2: presentativeRowET2.elternGeldPlus,
    },
    partnerschaftsbonus: {
      ET1: presentativeRowET1.elternGeldPlus,
      ET2: presentativeRowET2.elternGeldPlus,
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

/**
 * The actual result of the current calculation is a list of values per month.
 * To provide a representative value of "that amount for that variant", the
 * first month is taken to read the values from. This strongly assumes that the
 * calculation was done without any additional income values.
 */
const REPRESENTATIVE_MONTH_INDEX = 0;
