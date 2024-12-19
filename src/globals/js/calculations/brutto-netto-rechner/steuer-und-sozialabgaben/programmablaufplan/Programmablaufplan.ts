/**
 * Definition of the interface for an Programmablaufplan of the
 * Finanzministerium to calculates tax levies etc. It acts as an abstraction
 * layer that allows to have multiple implementations (per year) and use them
 * interchangeably.
 *
 * This only includes the necessary data fields that go into the program and out
 * of it. Any internal fields are kept by the implementations. This is based on
 * the assumption that these fields stay quite stable over the years of tax
 * laws. Only calculation constants and flow changes frequently. Any change in
 * the interface needs to rethink the (possible extension of this) design chosen
 * here. So it is important to double check the data types and their
 * documentation before each extension carefully.
 * Simple cases are added or removed parameters. In the first case, the
 * interface can be simply added. In the latter case they remain in the
 * interface. The respective program will either use or ignore them. Hints in
 * documentation are helpful.
 *
 * The terminology is chosen from the general concept of flowcharts (German:
 * Programmablaufplan). Extended by terms used in the original flowcharts that
 * are implemented (e.g. "Eingangsparameter"). The language is kept German
 * thoroughly as this is the original language of the domain with its flowcharts
 * and related documentation. Notice that the flowcharts follow the ISO 5807.
 *
 * The usage of record types for the input and output data was chosen solely for
 * better interface usage. The names, coming from the specification(s), are not
 * very expressive and are often just acronyms. Therefore, the annotations are
 * important to understand what an input or output field is for. Having these
 * fields defined in a re-usable record type allows to carry this documentation
 * cross boundaries. Like regular lists of function arguments could not.
 * A disadvantage of this design is, that the program implementations need to
 * access the data via the this "proxy" property, slightly bloating the process
 * code.
 *
 * Further details about how the original flowchart descriptions are implemented
 * is kept within the implementations themselves. They also continue to provide
 * instructions with steps how to add a new one.
 */
export abstract class Programmablaufplan {
  protected readonly eingangsparameter: Eingangsparameter;
  protected readonly ausgangsparameter: Ausgangsparameter;

  constructor(eingangsparameter: Eingangsparameter) {
    this.eingangsparameter = structuredClone(eingangsparameter);
    this.ausgangsparameter = structuredClone(INITIALE_AUSGANGSPARAMETER);
  }

  public ausfuehren(): Ausgangsparameter {
    this.start();
    return this.ausgangsparameter;
  }

  protected abstract start(): void;
}

const INITIALE_AUSGANGSPARAMETER: Ausgangsparameter = {
  BK: 0,
  LSTLZZ: 0,
  SOLZLZZ: 0,
  VKVLZZ: 0,
};

// Unfortunately can't be read-only.
export type Eingangsparameter = {
  /**
   * 1, wenn die Anwendung des Faktorverfahrens gewählt wurde (nur in
   * Steuerklasse IV)
   */
  AF: 0 | 1;

  /**
   * eingetragener Faktor mit drei Nachkommastellen
   */
  F: number;

  /**
   * Merker für die Vorsorgepauschale
   * 0 = der Arbeitnehmer ist in der gesetzlichen Rentenversicherung
   * oder einer berufsständischen Versorgungseinrichtung
   * pflichtversichert oder bei Befreiung von der Versicherungspflicht
   * freiwillig versichert; es gilt die allgemeine
   * Beitragsbemessungsgrenze (BBG West)
   * 1 = der Arbeitnehmer ist in der gesetzlichen Rentenversicherung
   * oder einer berufsständischen Versorgungseinrichtung
   * pflichtversichert oder bei Befreiung von der Versicherungspflicht
   * freiwillig versichert; es gilt die Beitragsbemessungsgrenze Ost
   * (BBG Ost)
   * 2 = wenn nicht 0 oder 1
   */
  KRV: 0 | 1 | 2;

  /**
   * Kassenindividueller Zusatzbeitragssatz bei einem gesetzlich
   * krankenversicherten Arbeitnehmer in Prozent (bspw. 1,70 für
   * 1,70 %) mit 2 Dezimalstellen. Es ist der volle Zusatzbeitragssatz
   * anzugeben. Die Aufteilung in Arbeitnehmer- und Arbeitgeberanteil
   * erfolgt im Programmablauf
   */
  KVZ: number;

  /**
   * Lohnzahlungszeitraum:
   * 1 = Jahr
   * 2 = Monat
   * 3 = Woche
   * 4 = Tag
   */
  LZZ: 0 | 1 | 2 | 3 | 4;

  /**
   * Der als elektronisches Lohnsteuerabzugsmerkmal für den
   * Arbeitgeber nach § 39e EStG festgestellte oder in der Bescheinigung
   * für den Lohnsteuerabzug eingetragene Freibetrag für den
   * Lohnzahlungszeitraum in Cent
   */
  LZZFREIB: number;

  /**
   * Der als elektronisches Lohnsteuerabzugsmerkmal für den
   * Arbeitgeber nach § 39e EStG festgestellte oder in der Bescheinigung
   * für den Lohnsteuerabzug eingetragene Hinzurechnungsbetrag
   * für den Lohnzahlungszeitraum in Cent
   */
  LZZHINZU: number;

  /**
   * Dem Arbeitgeber mitgeteilte Beiträge des Arbeitnehmers für eine
   * protected Basiskranken- bzw. Pflege-Pflichtversicherung im Sinne des
   * § 10 Absatz 1 Nummer 3 EStG in Cent; der Wert ist unabhängig vom
   * Lohnzahlungszeitraum immer als Monatsbetrag anzugeben
   */
  PKPV: number;

  /**
   * 0 = gesetzlich krankenversicherte Arbeitnehmer
   * 1 = ausschließlich privat krankenversicherte Arbeitnehmer ohne
   * Arbeitgeberzuschuss
   * 2 = ausschließlich privat krankenversicherte Arbeitnehmer mit
   * Arbeitgeberzuschuss
   */
  PKV: 0 | 1 | 2;

  /**
   * Seit 2024:
   *
   * Zahl der beim Arbeitnehmer zu berücksichtigenden
   * Beitragsabschläge in der sozialen Pflegeversicherung bei mehr als
   * einem Kind
   * 0 = kein Abschlag
   * 1 = Beitragsabschlag für das 2. Kind
   * 2 = Beitragsabschläge für das 2. und 3. Kind
   * 3 = Beitragsabschläge für 2. bis 4. Kinder
   * 4 = Beitragsabschläge für 2. bis 5. oder mehr Kinder
   */
  PVA: 0 | 1 | 2 | 3 | 4;

  /**
   * 1, wenn bei der sozialen Pflegeversicherung die Besonderheiten
   * in Sachsen zu berücksichtigen sind bzw. zu berücksichtigen wären
   */
  PVS: 0 | 1;

  /**
   * 1, wenn der Arbeitnehmer den Zuschlag zur sozialen
   * Pflegeversicherung zu zahlen hat
   */
  PVZ: 0 | 1;

  /**
   * Religionsgemeinschaft des Arbeitnehmers lt. elektronischer
   * Lohnsteuerabzugsmerkmale oder der Bescheinigung für den
   * Lohnsteuerabzug (bei keiner Religionszugehörigkeit = 0)
   */
  R: 0 | 1;

  /**
   * Steuerpflichtiger Arbeitslohn für den Lohnzahlungszeitraum vor
   * Berücksichtigung des Versorgungsfreibetrags und des Zuschlags
   * zum Versorgungsfreibetrag, des Altersentlastungsbetrags und des
   * als elektronisches Lohnsteuerabzugsmerkmal festgestellten oder in
   * der Bescheinigung für den Lohnsteuerabzug für den
   * Lohnzahlungszeitraum eingetragenen Freibetrags bzw.
   * Hinzurechnungsbetrags in Cent
   */
  RE4: number;

  /**
   * Steuerklasse:
   * 1 = I
   * 2 = II
   * 3 = III
   * 4 = IV
   * 5 = V
   * 6 = VI
   */
  STKL: 0 | 1 | 2 | 3 | 4 | 5 | 6;

  /**
   * In RE4 enthaltene Versorgungsbezüge in Cent (ggf. 0) ggf. unter
   * Berücksichtigung einer geänderten Bemessungsgrundlage nach
   * § 19 Absatz 2 Satz 10 und 11 EStG
   */
  VBEZ: number;

  /**
   * Zahl der Freibeträge für Kinder (eine Dezimalstelle, nur bei
   * Steuerklassen I, II, III und IV)
   */
  ZKF: number;
};

export type Ausgangsparameter = {
  /**
   * Bemessungsgrundlage für die Kirchenlohnsteuer in Cent
   */
  BK: number;

  /**
   * Für den Lohnzahlungszeitraum einzubehaltende Lohnsteuer in Cent
   */
  LSTLZZ: number;

  /**
   * Für den Lohnzahlungszeitraum einzubehaltender
   * Solidaritätszuschlag in Cent
   */
  SOLZLZZ: number;

  /**
   * Für den Lohnzahlungszeitraum berücksichtigte Beiträge des
   * Arbeitnehmers zur protectedn Basis-Krankenversicherung und privaten
   * Pflege-Pflichtversicherung (ggf. auch die Mindestvorsorgepauschale)
   * in Cent beim laufenden Arbeitslohn. Für Zwecke der
   * Lohnsteuerbescheinigung sind die einzelnen Ausgabewerte
   * außerhalb des eigentlichen Lohnsteuerberechnungsprogramms zu
   * addieren; hinzuzurechnen sind auch die Ausgabewerte VKVSONST.
   */
  VKVLZZ: number;
};
