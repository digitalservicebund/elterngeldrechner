import Big from "big.js";

export class BmfAbgaben {
  /**
   * Lohnsteuerzahlung
   */
  lstlzz: Big = new Big(0);

  /**
   * Für den Lohnzahlungszeitraum einzubehaltender Solidaritätszuschlag
   */
  solzlzz: Big = new Big(0);

  /**
   * Bemessungsgrundlage für die Kirchenlohnsteuer
   */
  bk: Big = new Big(0);

  /**
   * Bemessungsgrundlage der sonstigen Bezüge (ohne Vergütung für mehrjährige Tätigkeit) für die Kirchenlohnsteuer
   */
  bks: Big = new Big(0);

  /**
   * Bemessungsgrundlage der Vergütung für mehrjährige Tätigkeit für die Kirchenlohnsteuer
   */
  bkv: Big = new Big(0);

  /**
   * Solidaritätszuschlag für sonstige Bezüge (ohne Vergütung für mehrjährige Tätigkeit)
   */
  solzs: Big = new Big(0);

  /**
   * Solidaritätszuschlag für die Vergütung für mehrjährige Tätigkeit
   */
  solzv: Big = new Big(0);

  /**
   * Lohnsteuer für sonstige Bezüge (ohne Vergütung für mehrjährige Tätigkeit)
   */
  sts: Big = new Big(0);

  /**
   * Lohnsteuer für die Vergütung für mehrjährige Tätigkeit
   */
  stv: Big = new Big(0);
}
