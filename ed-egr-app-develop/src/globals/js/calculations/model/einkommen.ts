import Big from "big.js";

/**
 * Einkommen with correct precision fraction 2.
 */
export class Einkommen {
  _value: Big = Big(0);

  constructor(value: Big | number) {
    this.value = value;
  }

  set value(value: Big | number) {
    this._value = Big(value).round(2, Big.roundHalfUp);
  }

  get value(): Big {
    return this._value;
  }
}
