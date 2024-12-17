import Big from "big.js";
import {
  ElternGeldAusgabe,
  ElternGeldSimulationErgebnis,
  ElternGeldSimulationErgebnisRow,
  PLANUNG_ANZAHL_MONATE,
} from "./model";
import { BIG_ZERO, isEqual } from "./common/math-util";

export function elternGeldSimulationErgebnisOf(
  basisElternGeld: ElternGeldAusgabe[],
  elternGeldPlus: ElternGeldAusgabe[],
  nettoLebensMonat: Big[],
): ElternGeldSimulationErgebnis {
  if (basisElternGeld.length + elternGeldPlus.length === 0) {
    return {
      rows: [],
    };
  }

  const rows: ElternGeldSimulationErgebnisRow[] = [];
  let previousRow: ElternGeldSimulationErgebnisRow | null = null;
  let previous = new ElternGeldAmount();

  for (let i = 0; i < PLANUNG_ANZAHL_MONATE; i++) {
    const lebensMonat = i + 1;

    const current = new ElternGeldAmount();
    if (i < basisElternGeld.length) {
      current.basisElternGeld = basisElternGeld[i].elternGeld;
    }
    if (i < elternGeldPlus.length) {
      current.elterngeldPlus = elternGeldPlus[i].elternGeld;
    }
    if (i < nettoLebensMonat.length) {
      current.nettoEinkommen = nettoLebensMonat[i];
    }

    if (i === 0 || (current.isNotEquals(previous) && current.greaterZero())) {
      previous = current;
      previousRow = {
        vonLebensMonat: lebensMonat,
        bisLebensMonat: lebensMonat,
        basisElternGeld: current.basisElternGeld,
        elternGeldPlus: current.elterngeldPlus,
        nettoEinkommen: current.nettoEinkommen,
      };
      rows.push(previousRow);
    } else if (i > 0 && previousRow && current.isEquals(previous)) {
      previousRow.bisLebensMonat = lebensMonat;
    }
  }

  return {
    rows,
  };
}

class ElternGeldAmount {
  constructor(
    public basisElternGeld: Big = BIG_ZERO,
    public elterngeldPlus: Big = BIG_ZERO,
    public nettoEinkommen: Big = BIG_ZERO,
  ) {}

  isEquals(other: ElternGeldAmount) {
    return (
      isEqual(this.basisElternGeld, other.basisElternGeld) &&
      isEqual(this.elterngeldPlus, other.elterngeldPlus) &&
      isEqual(this.nettoEinkommen, other.nettoEinkommen)
    );
  }

  isNotEquals(other: ElternGeldAmount) {
    return !this.isEquals(other);
  }

  greaterZero() {
    return (
      this.basisElternGeld.gt(BIG_ZERO) ||
      this.elterngeldPlus.gt(BIG_ZERO) ||
      this.nettoEinkommen.gt(BIG_ZERO)
    );
  }
}
