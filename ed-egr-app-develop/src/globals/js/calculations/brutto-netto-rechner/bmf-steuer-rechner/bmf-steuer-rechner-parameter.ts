/**
 * Parameter for BMF Lohn- und Einkommensteuerrechner.
 *
 * Parameter and interface descriptions:
 * - https://www.bmf-steuerrechner.de/interface/einganginterface.xhtml
 * - https://issues.init.de/secure/attachment/708773/708773_2021-11-05-PAP-2022-anlage-1.pdf
 *
 * Field descriptions are copied from:
 * https://issues.init.de/secure/attachment/708773/708773_2021-11-05-PAP-2022-anlage-1.pdf
 */
export class BmfSteuerRechnerParameter {
  /**
   * Der Lohnzahlungszeitraum. Angabe wie folgt:
   * 1 = Jahr
   * 2 = Monat
   * 3 = Woche
   * 4 = Tag
   */
  LZZ: number = 0;

  /**
   * Steuerpflichtiger Arbeitslohn für den Lohnzahlungszeitraum vor Berücksichtigung des Versorgungsfreibetrags und
   * des Zuschlags zum Versorgungsfreibetrag, des Altersentlastungsbetrags und des als elektronisches
   * Lohnsteuerabzugsmerkmal festgestellten oder in der Bescheinigung für den Lohnsteuerabzug 2022 für den
   * Lohnzahlungszeitraum eingetragenen Freibetrags bzw. Hinzurechnungsbetrags in Cent.
   */
  RE4: number = 0;

  /**
   * Steuerklasse:
   * 1 = I
   * 2 = II
   * 3 = III
   * 4 = IV
   * 5 = V
   * 6 = VI
   */
  STKL: number = 1;

  /**
   * Zahl der Freibeträge für Kinder (eine Dezimalstelle, nur bei Steuerklassen I, II, III und IV).
   */
  ZKF: number = 0;

  /**
   * Religionsgemeinschaft des Arbeitnehmers lt. elektronischer Lohnsteuerabzugsmerkmale oder der Bescheinigung für den
   * Lohnsteuerabzug 2022 (bei keiner Religionszugehörigkeit = 0).
   */
  R: number = 0;

  /**
   * Art der Krankenversicherung:
   * 0 = gesetzlich krankenversicherte Arbeitnehmer
   * 1 = ausschließlich privat krankenversicherte Arbeitnehmer ohne Arbeitgeberzuschuss
   * 2 = ausschließlich privat krankenversicherte Arbeitnehmer mit Arbeitgeberzuschuss
   */
  PKV: number = 0;

  /**
   * Kassenindividueller Zusatzbeitragssatz bei einem gesetzlich krankenversicherten Arbeitnehmer in Prozent
   * (bspw. 1,30 für 1,30 %) mit 2 Dezimalstellen. Es ist der volle Zusatzbeitragssatz anzugeben. Die Aufteilung
   * in Arbeitnehmer- und Arbeitgeberanteil erfolgt im Programmablauf.
   */
  KVZ: number = 0;

  /**
   * 1, wenn bei der sozialen Pflegeversicherung die Besonderheiten in Sachsen zu berücksichtigen sind
   * bzw. zu berücksichtigen wären.
   */
  PVS: number = 0;

  /**
   * 1, wenn der Arbeitnehmer den Zuschlag zur sozialen Pflegeversicherung zu zahlen hat.
   */
  PVZ: number = 0;

  /**
   * KRV Merker für die Vorsorgepauschale:
   * 0 = der Arbeitnehmer ist in der gesetzlichen Rentenversicherung oder einer berufsständischen Versorgungseinrichtung
   * pflichtversichert oder bei Befreiung von der Versicherungspflicht freiwillig versichert; es gilt die
   * allgemeine Beitragsbemessungsgrenze (BBG West)
   *
   * 1 = der Arbeitnehmer ist in der gesetzlichen Rentenversicherung oder einer berufsständischen Versorgungseinrichtung
   * pflichtversichert oder bei Befreiung von der Versicherungspflicht freiwillig versichert; es gilt die
   * Beitragsbemessungsgrenze Ost (BBG Ost)
   *
   * 2 = wenn nicht 0 oder 1
   */
  KRV: number = 0;

  /**
   * 1, wenn das 64. Lebensjahr vor Beginn des Kalenderjahres vollendet wurde, in dem der Lohnzahlungszeitraum
   * endet (§ 24a EStG), sonst = 0.
   */
  ALTER1: number = 0;

  /**
   * 1, wenn die Anwendung des Faktorverfahrens gewählt wurde (nur in Steuerklasse IV).
   */
  AF: number = 0;

  /**
   * Eingetragener Faktor mit drei Nachkommastellen.
   */
  F: number = 0;
}

export function urlSearchParamsOf(
  bmfSteuerRechnerParameter: BmfSteuerRechnerParameter,
) {
  return new URLSearchParams(
    JSON.parse(JSON.stringify(bmfSteuerRechnerParameter)),
  );
}
