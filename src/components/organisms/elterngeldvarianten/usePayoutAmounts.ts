import { useEffect, useState } from "react";
import {
  BruttoEinkommenZeitraum,
  ElterngeldRow,
  calculateElterngeld,
} from "../../../redux/stepRechnerSlice";
import { useAppSelector, useAppStore } from "../../../redux/hooks";
import { PayoutAmountsForParent } from "./types";
import { stepAllgemeineAngabenSelectors } from "../../../redux/stepAllgemeineAngabenSlice";
import { AppStore } from "../../../redux";

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
    useState<PayoutAmountsForParent[]>();

  const applicant = useAppSelector(
    (state) => state.stepAllgemeineAngaben.antragstellende,
  );

  const isSingleParent = applicant === "EinenElternteil";
  const parentNames = useAppSelector(
    stepAllgemeineAngabenSelectors.getElternteilNames,
  );

  useEffect(() => {
    const promises = [
      determinePayoutAmountForParent(store, "ET1", parentNames.ET1),
    ];

    if (!isSingleParent) {
      promises.push(
        determinePayoutAmountForParent(store, "ET2", parentNames.ET2),
      );
    }

    Promise.all(promises).then(setPayoutAmounts);
  }, [store, isSingleParent, parentNames]);

  return payoutAmounts;
}

async function determinePayoutAmountForParent(
  store: AppStore,
  parent: "ET1" | "ET2",
  name: string,
): Promise<PayoutAmountsForParent> {
  const state = store.getState();
  const rows = await calculateElterngeld(state, parent, EMPTY_FUTURE_INCOME);
  const { basisElternGeld, elternGeldPlus } =
    findFristRepresentativeMonth(rows);
  return {
    name,
    basiselterngeld: basisElternGeld,
    elterngeldplus: elternGeldPlus,
    partnerschaftsbonus: elternGeldPlus,
  };
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

/**
 * The actual calculation (at the used level) includes the values of some
 * potential additional income while receiving parental allowance. To "just" get
 * some payout amounts as an initial overview, there is no income to calculate
 * with.
 */
const EMPTY_FUTURE_INCOME: BruttoEinkommenZeitraum[] = [];
