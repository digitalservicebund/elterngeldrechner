import Big from "big.js";

/**
 * Response from BMF Lohn- und Einkommensteuerrechner.
 *
 * Response and interface descriptions:
 * - https://www.bmf-steuerrechner.de/interface/einganginterface.xhtml
 * - https://issues.init.de/secure/attachment/708773/708773_2021-11-05-PAP-2022-anlage-1.pdf
 *
 * Only "Ausgangsparameter" of the response are mapped. "Ausgangsparameter DBA" not included.
 *
 * Field descriptions are copied from:
 * https://issues.init.de/secure/attachment/708773/708773_2021-11-05-PAP-2022-anlage-1.pdf
 */
export class BmfSteuerRechnerResponse {
  /**
   * Bemessungsgrundlage für die Kirchenlohnsteuer in Cent
   */
  BK: Big = new Big(0);

  /**
   * Bemessungsgrundlage der sonstigen Bezüge (ohne Vergütung für
   * mehrjährige Tätigkeit) für die Kirchenlohnsteuer in Cent.
   * Hinweis: Negativbeträge, die aus nicht zu besteuernden Vorteilen bei
   * Vermögensbeteiligungen (§ 19a Absatz 1 Satz 4 EStG) resultieren,
   * mindern BK (maximal bis 0). Der Sonderausgabenabzug für
   * tatsächlich erbrachte Vorsorgeaufwendungen im Rahmen der
   * Veranlagung zur Einkommensteuer bleibt unberührt.
   */
  BKS: Big = new Big(0);

  /**
   * Bemessungsgrundlage der Vergütung für mehrjährige Tätigkeit und
   * der tarifermäßigt zu besteuernden Vorteile bei
   * Vermögensbeteiligungen für die Kirchenlohnsteuer in Cent
   */
  BKV: Big = new Big(0);

  /**
   * Für den Lohnzahlungszeitraum einzubehaltende Lohnsteuer in Cent
   */
  LSTLZZ: Big = new Big(0);

  /**
   * Für den Lohnzahlungszeitraum einzubehaltender
   * Solidaritätszuschlag in Cent
   */
  SOLZLZZ: Big = new Big(0);

  /**
   * Solidaritätszuschlag für sonstige Bezüge (ohne Vergütung für
   * mehrjährige Tätigkeit in Cent.
   * Hinweis: Negativbeträge, die aus nicht zu besteuernden Vorteilen bei
   * Vermögensbeteiligungen (§ 19a Absatz 1 Satz 4 EStG) resultieren,
   * mindern SOLZLZZ (maximal bis 0). Der Sonderausgabenabzug für
   * tatsächlich erbrachte Vorsorgeaufwendungen im Rahmen der
   * Veranlagung zur Einkommensteuer bleibt unberührt.
   */
  SOLZS: Big = new Big(0);

  /**
   * Solidaritätszuschlag für die Vergütung für mehrjährige Tätigkeit und
   * der tarifermäßigt zu besteuernden Vorteile bei
   * Vermögensbeteiligungen in Cent
   */
  SOLZV: Big = new Big(0);

  /**
   * Lohnsteuer für sonstige Bezüge (ohne Vergütung für mehrjährige
   * Tätigkeit und ohne tarifermäßigt zu besteuernde Vorteile bei
   * Vermögensbeteiligungen) in Cent
   * Hinweis: Negativbeträge, die aus nicht zu besteuernden Vorteilen bei
   * Vermögensbeteiligungen (§ 19a Absatz 1 Satz 4 EStG) resultieren,
   * mindern LSTLZZ (maximal bis 0). Der Sonderausgabenabzug für
   * tatsächlich erbrachte Vorsorgeaufwendungen im Rahmen der
   * Veranlagung zur Einkommensteuer bleibt unberührt.
   */
  STS: Big = new Big(0);

  /**
   * Lohnsteuer für die Vergütung für mehrjährige Tätigkeit und der
   * tarifermäßigt zu besteuernden Vorteile bei Vermögensbeteiligungen
   * in Cent
   */
  STV: Big = new Big(0);

  /**
   * Für den Lohnzahlungszeitraum berücksichtigte Beiträge des
   * Arbeitnehmers zur privaten Basis-Krankenversicherung und privaten
   * Pflege-Pflichtversicherung (ggf. auch die Mindestvorsorgepauschale)
   * in Cent beim laufenden Arbeitslohn. Für Zwecke der
   * Lohnsteuerbescheinigung sind die einzelnen Ausgabewerte
   * außerhalb des eigentlichen Lohnsteuerberechnungsprogramms zu
   * addieren; hinzuzurechnen sind auch die Ausgabewerte VKVSONST.
   */
  VKVLZZ: Big = new Big(0);

  /**
   * Für den Lohnzahlungszeitraum berücksichtigte Beiträge des
   * Arbeitnehmers zur privaten Basis-Krankenversicherung und privaten
   * Pflege-Pflichtversicherung (ggf. auch die Mindestvorsorgepauschale)
   * in Cent bei sonstigen Bezügen. Der Ausgabewert kann auch negativ
   * sein. Für tarifermäßigt zu besteuernde Vergütungen für mehrjährige
   * Tätigkeiten enthält der PAP keinen entsprechenden Ausgabewert.
   */
  VKVSONST: Big = new Big(0);
}
