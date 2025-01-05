import { Programmablaufplan } from "./Programmablaufplan";
import {
  aufDenCentAbrunden,
  aufDenEuroAbrunden,
  aufDenEuroAufrunden,
} from "./auf-und-abrunden";

/*
 * !!! READ CAREFULLY !!!
 *
 * The approach to implement a Programmablaufplan for tax levies deviates from
 * how to write clean code. The correctness of these programs is hard to test,
 * as there is not enough and high quality test data. Therefore, it is
 * especially important to follow the original specification strictly. That
 * means the flowcharts get implemented almost 1:1 where possible. Only
 * deviation should be due to the TypeScript language and its syntax.
 *
 * The basic rules are the following:
 * - It MUST NOT be attempted to derive any abstract logic to improve the code.
 *   This is especially the case for defining an abstract program for all the
 *   programs over the years with parametrization.
 * - All [predefined] processes (statements/methods) or data names MUST be used
 *   without any changes. Only exception are not allowed characters in
 *   TypeScript (e.g. `-` in a method name).
 * - It MUST NOT any type-driven-development be used. The flowcharts use plain
 *   numbers exclusively. No enumeration MUST be used. Not even booleans.
 *   Though, constant number unions MAY be used where it aligns with the
 *   specification (e.g. `1 | 2 | 3`).
 * - A "decision symbol" MUST be implemented as if-else or if-if_else-if block.
 * - In relation to the previous point: no ternary operator (`a ? b : c`) MUST
 *   be used..
 * - No assignments with operator MUST be used (e.g. `+=` or `*=`).
 * - Methods MUST NOT use any local data. Any assignment MUST happen on the data
 *   owned by the program. No functional programming MUST be used.
 * - Each method MUST have a signature with zero arguments and no return value.
 * - Descriptions in the flowcharts MUST be copy-pasted as annotations to
 *   describe data fields or a process. Newlines MUST be kept as they are.
 * - Comments within a process MAY be skipped.
 *   as they are hard to located correctly and barely help.
 * - The order methods are defined MUST align with the process order in the
 *   flowchart. No "optimizations" based on call-tree order MUST be done.
 * - A program implementation MUST define a method for its original start
 *   process (usually called `LST` followed by the year of the program). It will
 *   be triggered by {@link Programmablaufplan.prototype.start} of the unified
 *   interface. That means the process MUST NOT be implemented within the
 *   `start` method itself.
 *
 * Notice that there are currently no non-functional tests which could enforce
 * these rules. So be extra careful when working on changes to maintain the
 * "standard".
 *
 * In result, it is pretty straight forward to implement a new Programmablauf.
 * Almost no thinking is required for the most part. Furthermore, and most
 * importantly, it allows to verify the "correct" implementation by eye. It
 * should be possible to view code and flowchart next to each other and easily
 * compare them bit by bit. This is especially helpful when adding the newest
 * Programmablauf based on a copy of the latest implemented program. Usually
 * changes between the years are rather minimal.
 *
 * After all, a Programmablaufplan is quite big and includes plenty of special
 * tax cases. It is not desirable to maintain a complete implementation of the
 * whole program. It would lead to much more code than necessary, making it
 * harder to maintain. It would also require plenty of unavailable input data.
 * And finally it would bloat up the bundle size of the delivered application.
 * Anyhow, due to the fact that the program is specified as a flowchart, it is
 * extremely hard to reason about. The effect of not setting a data field or to
 * skip an entire process is hard to grasp and understand. It therefore must be
 * very carefully done. Small "gains" should be avoided in advantage not to have
 * to reason about it (e.g. a static Lohnzahlungszeitraum). But for example it
 * will be never relevant to calculate "mehrjährige Tätigkeiten".
 *
 * To maintain the properties from above in this context, the additional rules
 * are the following:
 * - Any part of a process that is skipped, MUST be annotated as comment where
 *   is would appear otherwise.
 * - A comment that signals a skipped process SHOULD copy-paste the skipped
 *   statements when not too complex (e.g. not the whole tree of a decision
 *   branch).
 * - A method that implements a process that is not fully implemented MUST be
 *   annotated with a reason why.
 *
 *
 * -- Steps to create a new program --
 *
 * Any time a new Programmablaufplan for tax levies is released by the
 * Bundesfinanzministerium (every year), a new implementation must be added.
 *
 * Steps to create a new program are:
 * - The whole last (the year before) implementation MUST be copied.
 * - This documentation here MUST be copied too. Though, it MAY get updated.
 * - The code MUST be carefully compared with the flowchart to make necessary
 *   adjustments. This works best by viewing both documents next to each other.
 *   Notice that the specification includes (partially) black bars on the left
 *   to indicate changes to the last version.
 * - New internal data fields MUST be added. Obsolete ones SHOULD be removed.
 * - Any code documentation and comments MUST be checked against the
 *   specification.
 * - It MUST be verified if the {@link Programmablaufplan} interface is still
 *   matching. That includes the meaning of the data fields defined there
 *   (including their documentation).
 * - The data in the test cases MUST be replaced with the new data from the
 *   flowchart test section (editor macros help a lot).
 * - The Programmablaufplan MUST be registered for the respective Lohnsteuerjahr
 *   so it will be used automatically.
 */

/**
 * Programmablaufplan für die maschinelle Berechnung
 * der vom Arbeitslohn einzubehaltenden Lohnsteuer, des Solidaritätszuschlags
 * und der Maßstabsteuer für die Kirchenlohnsteuer für 2023
 */
export class PAP_2021 extends Programmablaufplan {
  /**
   * Altersentlastungsbetrag
   * (§ 39b Absatz 2 Satz 3 EStG)
   */
  private ALTE: number = 0;

  /**
   * Arbeitnehmer-Pauschbetrag/Werbungskosten-Pauschbetrag in Euro
   */
  private ANP: number = 0;

  /**
   * Auf den Lohnzahlungszeitraum entfallender Anteil von Jahreswerten
   * auf ganze Cent abgerundet
   */
  private ANTEIL1: number = 0;

  /**
   * Beitragsbemessungsgrenze in der gesetzlichen
   * Krankenversicherung und der sozialen Pflegeversicherung in Euro
   */
  private BBGKVPV: number = 0;

  /**
   * Allgemeine Beitragsbemessungsgrenze in der allgemeinen
   * Rentenversicherung in Euro
   */
  private BBGRV: number = 0;

  /**
   * Differenz zwischen ST1 und ST2 in Euro
   */
  private DIFF: number = 0;

  /**
   * Entlastungsbetrag für Alleinerziehende in Euro
   */
  private EFA: number = 0;

  /**
   * Versorgungsfreibetrag in Euro, Cent (2 Dezimalstellen)
   */
  private FVB: number = 0;

  /**
   * Zuschlag zum Versorgungsfreibetrag in Euro
   */
  private FVBZ: number = 0;

  /**
   * Grundfreibetrag in Euro
   */
  private GFB: number = 0;

  /**
   * Zwischenfeld zu X für die Berechnung der Steuer nach § 39b
   * Absatz 2 Satz 7 EStG in Euro
   */
  private HOCH: number = 0;

  /**
   * Jahressteuer nach § 51a EStG, aus der Solidaritätszuschlag und
   * Bemessungsgrundlage für die Kirchenlohnsteuer ermittelt werden, in
   * Euro
   */
  private JBMG: number = 0;

  /**
   * Auf einen Jahreslohn hochgerechneter LZZFREIB in Euro, Cent
   * (2 Dezimalstellen)
   */
  private JLFREIB: number = 0;

  /**
   * Auf einen Jahreslohn hochgerechneter LZZHINZU in Euro, Cent
   * (2 Dezimalstellen)
   */
  private JLHINZU: number = 0;

  /**
   * Jahreswert, dessen Anteil für einen Lohnzahlungszeitraum in
   * UPANTEIL errechnet werden soll, in Cent
   */
  private JW: number = 0;

  /**
   * Summe der Freibeträge für Kinder in Euro
   */
  private KFB: number = 0;

  /**
   * Beitragssatz des Arbeitgebers zur Krankenversicherung unter
   * Berücksichtigung des durchschnittlichen Zusatzbeitragssatzes für die
   * Ermittlung des Arbeitgeberzuschusses (5 Dezimalstellen)
   */
  private KVSATZAG: number = 0;

  /**
   * Beitragssatz des Arbeitnehmers zur Krankenversicherung
   * (5 Dezimalstellen)
   */
  private KVSATZAN: number = 0;

  /**
   * Kennzahl für Einkommensteuer-Tarifarten
   * 1 = Grundtarif
   * 2 = Splittingverfahren
   */
  private KZTAB: 1 | 2 = 1;

  /**
   * Jahreslohnsteuer in Euro
   */
  private LSTJAHR: number = 0;

  /**
   * Beitragssatz des Arbeitgebers zur Pflegeversicherung
   * (5 Dezimalstellen)
   */
  private PVSATZAG: number = 0;

  /**
   * Beitragssatz des Arbeitnehmers zur Pflegeversicherung
   * (5 Dezimalstellen)
   */
  private PVSATZAN: number = 0;

  /**
   * Mindeststeuer für die Steuerklassen V und VI in Euro
   */
  private MIST: number = 0;

  /**
   * Beitragssatz des Arbeitnehmers in der allgemeinen gesetzlichen
   * Rentenversicherung (4 Dezimalstellen)
   */
  private RVSATZAN: number = 0;

  /**
   * Rechenwert in Gleitkommadarstellung
   */
  private RW: number = 0;

  /**
   * Sonderausgaben-Pauschbetrag in Euro
   */
  private SAP: number = 0;

  /**
   * Freigrenze für den Solidaritätszuschlag in Euro
   */
  private SOLZFREI: number = 0;

  /**
   * Solidaritätszuschlag auf die Jahreslohnsteuer in Euro, Cent
   * (2 Dezimalstellen)
   */
  private SOLZJ: number = 0;

  /**
   * Zwischenwert für den Solidaritätszuschlag auf die Jahreslohnsteuer
   * in Euro, Cent (2 Dezimalstellen)
   */
  private SOLZMIN: number = 0;

  /**
   * Tarifliche Einkommensteuer in Euro
   */
  private ST: number = 0;

  /**
   * Tarifliche Einkommensteuer auf das 1,25-fache ZX in Euro
   */
  private ST1: number = 0;

  /**
   * Tarifliche Einkommensteuer auf das 0,75-fache ZX in Euro
   */
  private ST2: number = 0;

  /**
   * Teilbetragssatz der Vorsorgepauschale für die Rentenversicherung
   * (2 Dezimalstellen)
   */
  private TBSVORV: number = 0;

  /**
   * Zwischenfeld zu X für die Berechnung der Steuer nach § 39b
   * Absatz 2 Satz 7 EStG in Euro
   */
  private VERGL: number = 0;

  /**
   * Höchstbetrag der Mindestvorsorgepauschale für die Kranken- und
   * Pflegeversicherung in Euro, Cent (2 Dezimalstellen)
   */
  private VHB: number | undefined;

  /**
   * Jahreswert der berücksichtigten Beiträge zur privaten Basis-
   * Krankenversicherung und privaten Pflege-Pflichtversicherung (ggf.
   * auch die Mindestvorsorgepauschale) in Cent
   */
  private VKV: number = 0;

  /**
   * Vorsorgepauschale mit Teilbeträgen für die Rentenversicherung
   * sowie die gesetzliche Kranken- und soziale Pflegeversicherung nach
   * fiktiven Beträgen oder ggf. für die private Basiskrankenversicherung
   * und private Pflege-Pflichtversicherung in Euro, Cent
   * (2 Dezimalstellen)
   */
  private VSP: number = 0;

  /**
   * Vorsorgepauschale mit Teilbeträgen für die Rentenversicherung
   * sowie der Mindestvorsorgepauschale für die Kranken- und
   * Pflegeversicherung in Euro, Cent (2 Dezimalstellen)
   */
  private VSPN: number | undefined;

  /**
   * Zwischenwert 1 bei der Berechnung der Vorsorgepauschale in Euro,
   * Cent (2 Dezimalstellen)
   */
  private VSP1: number = 0;

  /**
   * Zwischenwert 2 bei der Berechnung der Vorsorgepauschale in Euro,
   * Cent (2 Dezimalstellen)
   */
  private VSP2: number = 0;

  /**
   * Vorsorgepauschale mit Teilbeträgen für die gesetzliche Kranken-
   * und soziale Pflegeversicherung nach fiktiven Beträgen oder ggf. für
   * die private Basiskrankenversicherung und private Pflege-
   * Pflichtversicherung in Euro, Cent (2 Dezimalstellen)
   */
  private VSP3: number = 0;

  /**
   * Erster Grenzwert in Steuerklasse V/VI in Euro
   */
  private W1STKL5: number = 0;

  /**
   * Zweiter Grenzwert in Steuerklasse V/VI in Euro
   */
  private W2STKL5: number = 0;

  /**
   * Dritter Grenzwert in Steuerklasse V/VI in Euro
   */
  private W3STKL5: number = 0;

  /**
   * Zu versteuerndes Einkommen gem. § 32a Absatz 1 und 5 EStG in
   * Euro, Cent (2 Dezimalstellen)
   */
  private X: number = 0;

  /**
   * Gem. § 32a Absatz 1 EStG (6 Dezimalstellen)
   */
  private Y: number = 0;

  /**
   * Auf einen Jahreslohn hochgerechnetes RE4 in Euro, Cent
   * (2 Dezimalstellen) nach Abzug der Freibeträge nach § 39b Absatz 2
   * Satz 3 und 4 EStG
   */
  private ZRE4: number = 0;

  /**
   * Auf einen Jahreslohn hochgerechnetes RE4 in Euro, Cent
   * (2 Dezimalstellen)
   */
  private ZRE4J: number = 0;

  /**
   * Auf einen Jahreslohn hochgerechnetes RE4, ggf. nach Abzug der
   * Entschädigungen i.S.d. § 24 Nummer 1 EStG in Euro, Cent
   * (2 Dezimalstellen)
   */
  private ZRE4VP: number = 0;

  /**
   * Feste Tabellenfreibeträge (ohne Vorsorgepauschale) in Euro, Cent
   * (2 Dezimalstellen)
   */
  private ZTABFB: number = 0;

  /**
   * Auf einen Jahreslohn hochgerechnetes VBEZ abzüglich FVB in
   * Euro, Cent (2 Dezimalstellen)
   */
  private ZVBEZ: number = 0;

  /**
   * Auf einen Jahreslohn hochgerechnetes VBEZ abzüglich FVB in
   * Euro, Cent (2 Dezimalstellen)
   */
  private ZVBEZJ: number = 0;

  /**
   * Zu versteuerndes Einkommen in Euro, Cent (2 Dezimalstellen)
   */
  private ZVE: number = 0;

  /**
   * Zwischenfeld zu X für die Berechnung der Steuer nach § 39b
   * Absatz 2 Satz 7 EStG in Euro
   */
  private ZX: number = 0;

  /**
   * Zwischenfeld zu X für die Berechnung der Steuer nach § 39b
   * Absatz 2 Satz 7 EStG in Euro
   */
  private ZZX: number = 0;

  protected start(): void {
    this.LST2021();
  }

  /**
   * 5. Programmablaufplan 2021
   * Steuerung
   *
   * Bemerkungen:
   * - vereinfacht da Lohnsteuer für mehrjährige nicht relevant ist
   * - vereinfacht da sonstige Einnahmen nicht relevant sind.
   */
  private LST2021(): void {
    this.MPARA();
    this.MRE4JL();

    // überspringe da nicht relevant:
    // VBEZBSO = 0
    // KENNVMT = 0

    this.MRE4();
    this.MRE4ABZ();
    this.MBERECH();

    // Überspringe da nicht relevant:
    // MSONST()
    // MVMT()
  }
  /**
   * Zuweisung von Werten für bestimmte Sozialversicherungsparameter.
   */
  private MPARA(): void {
    if (this.eingangsparameter.KRV < 2) {
      if (this.eingangsparameter.KRV === 0) {
        this.BBGRV = 85200;
      } else {
        this.BBGRV = 80400;
      }

      this.RVSATZAN = 0.093;
      this.TBSVORV = 0.84;
    }

    this.BBGKVPV = 58050;
    this.KVSATZAN = this.eingangsparameter.KVZ / 2 / 100 + 0.07;
    this.KVSATZAG = 0.0065 + 0.07;

    if (this.eingangsparameter.PVS === 1) {
      this.PVSATZAN = 0.02025;
      this.PVSATZAG = 0.01025;
    } else {
      this.PVSATZAN = 0.01525;
      this.PVSATZAG = 0.01525;
    }

    if (this.eingangsparameter.PVZ === 1) {
      this.PVSATZAN = this.PVSATZAN + 0.0025;
    }

    this.W1STKL5 = 11237;
    this.W2STKL5 = 28959;
    this.W3STKL5 = 219690;
    this.GFB = 9744;
    this.SOLZFREI = 16956;
  }

  /**
   * Ermittlung des Jahresarbeitslohns und der Freibeträge.
   * (§ 39b Absatz 2 Satz 2 EStG)
   */
  private MRE4JL(): void {
    if (this.eingangsparameter.LZZ === 1) {
      this.ZRE4J = this.eingangsparameter.RE4 / 100;
      this.ZVBEZJ = this.eingangsparameter.VBEZ / 100;
      this.JLFREIB = this.eingangsparameter.LZZFREIB / 100;
      this.JLHINZU = this.eingangsparameter.LZZHINZU / 100;
    } else if (this.eingangsparameter.LZZ === 2) {
      this.ZRE4J = (this.eingangsparameter.RE4 * 12) / 100;
      this.ZVBEZJ = (this.eingangsparameter.VBEZ * 12) / 100;
      this.JLFREIB = (this.eingangsparameter.LZZFREIB * 12) / 100;
      this.JLHINZU = (this.eingangsparameter.LZZHINZU * 12) / 100;
    } else if (this.eingangsparameter.LZZ === 3) {
      this.ZRE4J = (this.eingangsparameter.RE4 * 360) / 7 / 100;
      this.ZVBEZJ = (this.eingangsparameter.VBEZ * 360) / 7 / 100;
      this.JLFREIB = (this.eingangsparameter.LZZFREIB * 360) / 7 / 100;
      this.JLHINZU = (this.eingangsparameter.LZZHINZU * 360) / 7 / 100;
    } else {
      this.ZRE4J = (this.eingangsparameter.RE4 * 360) / 100;
      this.ZVBEZJ = (this.eingangsparameter.VBEZ * 360) / 100;
      this.JLFREIB = (this.eingangsparameter.LZZFREIB * 360) / 100;
      this.JLHINZU = (this.eingangsparameter.LZZHINZU * 360) / 100;
    }

    if (this.eingangsparameter.AF === 0) {
      this.eingangsparameter.F = 1;
    }
  }

  /**
   * Freibeträge für Versorgungs-
   * bezüge, Altersentlastungsbetrag
   * (§ 39b Absatz 2 Satz 3 EStG)
   *
   * Bemerkungen:
   * - vereinfacht mit Annahme das "ZVBEZ" immer "0" ist (Kontext
   *   Sondereinkünfte und Versorgebezüge) [siehe Anmerkungen im Code]
   * - vereinfacht auf relevante Felder die benötigt werden [siehe Anmerkungen im Code]
   */
  private MRE4(): void {
    // Überspringe da mutmaßlich nicht relevant:
    // if (ZVBEZJ === 0) { ... } else if (VJAHR < 2006) ...

    this.FVBZ = 0;
    this.FVB = 0;

    // Überspringe da nicht relevant:
    // FVBZSO = 0
    // FVBSO = 0

    this.MRE4ALTE();
  }

  /**
   * Altersentlastungsbetrag
   * (§ 39b Absatz 2 Satz 3 EStG)
   *
   * Bemerkungen:
   * - vereinfacht da das "ALTER1" Feld fix als "0" angenommen wird (Kontext:
   *   Altersentlastung) [siehe Anmerkungen im Code]
   */
  private MRE4ALTE(): void {
    // Überspringe da nicht relevant:
    // if (ALTER1 === 0) { ... } else if (AJAHR < 2006) ...

    this.ALTE = 0;
  }

  /**
   * Ermittlung des Jahresarbeitslohns nach Abzug der
   * Freibeträge nach
   * § 39b Absatz 2 Satz 3 und 4 EStG
   *
   * Bemerkungen:
   * - vereinfacht da das "KENNVMT" Feld fix auf "0" steht (Kontext: Merker für
   *   Berechnung Lohnsteuer für mehrjährige Tätigkeit) [siehe Anmerkungen im
   *   Code]
   */
  private MRE4ABZ(): void {
    this.ZRE4 = this.ZRE4J - this.FVB - this.ALTE - this.JLFREIB + this.JLHINZU;

    if (this.ZRE4 < 0) {
      this.ZRE4 = 0;
    }

    this.ZRE4VP = this.ZRE4J;

    // Überspringe da nicht relevant:
    // if (KENNVMT === 2) {
    //   ZRE4VP = ZRE4VP - ENTSCH /100
    // }

    this.ZVBEZ = this.ZVBEZJ - this.FVB;

    if (this.ZVBEZ < 0) {
      this.ZVBEZ = 0;
    }
  }

  /**
   * Ermittlung der Jahreslohnsteuer auf laufende Bezüge.
   */
  private MBERECH(): void {
    this.MZTABFB();

    // Überspringe da nicht relevant:
    // VFRB = (ANP + FVB + FVBZ) * 100

    this.MLSTJAHR();

    // Überspringe da nicht relevant:
    // WVFRB = (this.ZVE – this.GFB) * 100
    // if (WVFRB < 0) WVFRB = 0

    this.LSTJAHR = this.ST * this.eingangsparameter.F;
    this.UPLSTLZZ();
    this.UPVKVLZZ();

    if (this.eingangsparameter.ZKF > 0) {
      this.ZTABFB = this.ZTABFB + this.KFB;
      this.MRE4ABZ();
      this.MLSTJAHR();
      this.JBMG = this.ST * this.eingangsparameter.F;
    } else {
      this.JBMG = this.LSTJAHR;
    }

    this.MSOLZ();
  }

  /**
   * Ermittelung der festen Tabellenfreibeträten (ohne Vorsorgepauschale).
   *
   * Bemerkungen:
   * - vereinfacht auf relevante Felder die benötigt werden [siehe Anmerkungen
   *   im Code]
   */
  private MZTABFB(): void {
    this.ANP = 0;

    if (this.ZVBEZ >= 0) {
      if (this.ZVBEZ < this.FVBZ) {
        this.FVBZ = this.ZVBEZ;
      }
    }

    if (this.eingangsparameter.STKL < 6) {
      if (this.ZVBEZ > 0) {
        if (this.ZVBEZ - this.FVBZ < 102) {
          this.ANP = aufDenEuroAufrunden(this.ZVBEZ - this.FVBZ);
        } else {
          this.ANP = 102;
        }
      }
    } else {
      this.FVBZ = 0;

      // Überspringe da nicht relevant:
      // FVBZSO = 0
    }

    if (this.eingangsparameter.STKL < 6) {
      if (this.ZRE4 > this.ZVBEZ) {
        if (this.ZRE4 - this.ZVBEZ < 1000) {
          this.ANP = aufDenEuroAufrunden(this.ANP + this.ZRE4 - this.ZVBEZ);
        } else {
          this.ANP = this.ANP + 1000;
        }
      }
    }

    this.KZTAB = 1;

    if (this.eingangsparameter.STKL === 1) {
      this.SAP = 36;
      this.KFB = this.eingangsparameter.ZKF * 8388;
    } else if (this.eingangsparameter.STKL === 2) {
      this.EFA = 1908;
      this.SAP = 36;
      this.KFB = this.eingangsparameter.ZKF * 8388;
    } else if (this.eingangsparameter.STKL === 3) {
      this.KZTAB = 2;
      this.SAP = 36;
      this.KFB = this.eingangsparameter.ZKF * 8388;
    } else if (this.eingangsparameter.STKL === 4) {
      this.SAP = 36;
      this.KFB = this.eingangsparameter.ZKF * 4194;
    } else if (this.eingangsparameter.STKL === 5) {
      this.SAP = 36;
      this.KFB = 0;
    } else {
      this.KFB = 0;
    }

    this.ZTABFB = this.EFA + this.ANP + this.SAP + this.FVBZ;
  }

  /**
   * Ermittlung Jahreslohnsteuer
   *
   * Bemerkungen:
   * - vereinfacht da das "KENNVMT" Feld fix auf "0" steht (Kontext: Merker für
   *   Berechnung Lohnsteuer für mehrjährige Tätigkeit) [siehe Anmerkungen im
   *   Code]
   */
  private MLSTJAHR(): void {
    this.UPEVP();

    // Überspringe da nicht relevant:
    // if (KENNVMT !== 1) {...} else {...}

    this.ZVE = this.ZRE4 - this.ZTABFB - this.VSP;
    this.UPMLST();
  }

  /**
   * Ermittlung des Anteils der berücksichtigten
   * Vorsorgeaufwendungen für den Lohnzahlungszeitraum
   */
  private UPVKVLZZ(): void {
    this.UPVKV();
    this.JW = this.VKV;
    this.UPANTEIL();
    this.ausgangsparameter.VKVLZZ = this.ANTEIL1;
  }

  /**
   * Ermittlung des Jahreswertes der
   * berücksichtigten privaten Kranken- und
   * Pflegeversicherungsbeiträge
   */
  private UPVKV(): void {
    if (this.eingangsparameter.PKV > 0) {
      if (this.VSP2 > this.VSP3) {
        this.VKV = this.VSP2 * 100;
      } else {
        this.VKV = this.VSP3 * 100;
      }
    } else {
      this.VKV = 0;
    }
  }

  /**
   * Ermittlung des Anteils der
   * Jahreslohnsteuer für den Lohnzahlungszeitraum
   */
  private UPLSTLZZ(): void {
    this.JW = this.LSTJAHR * 100;
    this.UPANTEIL();
    this.ausgangsparameter.LSTLZZ = this.ANTEIL1;
  }

  private UPMLST(): void {
    if (this.ZVE < 1) {
      this.ZVE = 0;
      this.X = 0;
    } else {
      this.X = aufDenEuroAbrunden(this.ZVE / this.KZTAB);
    }

    if (this.eingangsparameter.STKL < 5) {
      this.UPTAB21();
    } else {
      this.MST5_6();
    }
  }

  /**
   * Vorsorgepauschale
   * (§ 39b Absatz 2 Satz 5 Nummer 3 und
   * Absatz 4 EStG)
   */
  private UPEVP(): void {
    if (this.eingangsparameter.KRV > 1) {
      this.VSP1 = 0;
    } else {
      if (this.ZRE4VP > this.BBGRV) {
        this.ZRE4VP = this.BBGRV;
      }

      this.VSP1 = this.TBSVORV * this.ZRE4VP;
      this.VSP1 = this.VSP1 * this.RVSATZAN;
    }

    this.VSP2 = 0.12 * this.ZRE4VP;

    if (this.eingangsparameter.STKL === 3) {
      this.VHB = 3000;
    } else {
      this.VHB = 1900;
    }

    if (this.VSP2 > this.VHB) {
      this.VSP2 = this.VHB;
    }

    this.VSPN = aufDenEuroAufrunden(this.VSP1 + this.VSP2);
    this.MVSP();

    if (this.VSPN > this.VSP) {
      this.VSP = this.VSPN;
    }
  }

  /**
   * Vorsorgepauschale
   * (§ 39b Absatz 2 Satz 5 Nummer 3 EStG)
   * Vergleichsberechnung zur
   * Mindestvorsorgepauschale
   */
  private MVSP(): void {
    if (this.ZRE4VP > this.BBGKVPV) {
      this.ZRE4VP = this.BBGKVPV;
    }

    if (this.eingangsparameter.PKV > 0) {
      if (this.eingangsparameter.STKL === 6) {
        this.VSP3 = 0;
      } else {
        this.VSP3 = (this.eingangsparameter.PKPV * 12) / 100;

        if (this.eingangsparameter.PKV === 2) {
          this.VSP3 = this.VSP3 - this.ZRE4VP * (this.KVSATZAG + this.PVSATZAG);
        }
      }
    } else {
      this.VSP3 = this.ZRE4VP * (this.KVSATZAN + this.PVSATZAN);
    }

    this.VSP = aufDenEuroAufrunden(this.VSP3 + this.VSP1);
  }

  /**
   * Lohnsteuer für die Steuerklassen V und VI
   * (§ 39b Absatz 2 Satz 7 EStG)
   */
  private MST5_6(): void {
    this.ZZX = this.X;

    if (this.ZZX > this.W2STKL5) {
      this.ZX = this.W2STKL5;
      this.UP5_6();

      if (this.ZZX > this.W3STKL5) {
        this.ST = aufDenEuroAbrunden(
          this.ST + (this.W3STKL5 - this.W2STKL5) * 0.42,
        );
        this.ST = aufDenEuroAbrunden(
          this.ST + (this.ZZX - this.W3STKL5) * 0.45,
        );
      } else {
        this.ST = aufDenEuroAbrunden(
          this.ST + (this.ZZX - this.W2STKL5) * 0.42,
        );
      }
    } else {
      this.ZX = this.ZZX;
      this.UP5_6();

      if (this.ZZX > this.W1STKL5) {
        this.VERGL = this.ST;
        this.ZX = this.W1STKL5;
        this.UP5_6();
        this.HOCH = aufDenEuroAbrunden(
          this.ST + (this.ZZX - this.W1STKL5) * 0.42,
        );

        if (this.HOCH < this.VERGL) {
          this.ST = this.HOCH;
        } else {
          this.ST = this.VERGL;
        }
      }
    }
  }

  private UP5_6(): void {
    this.X = this.ZX * 1.25;
    this.UPTAB21();
    this.ST1 = this.ST;
    this.X = this.ZX * 0.75;
    this.UPTAB21();
    this.ST2 = this.ST;
    this.DIFF = (this.ST1 - this.ST2) * 2;
    this.MIST = aufDenEuroAbrunden(this.ZX * 0.14);

    if (this.MIST > this.DIFF) {
      this.ST = this.MIST;
    } else {
      this.ST = this.DIFF;
    }
  }

  /**
   * Solidaritätszuschlag
   */
  private MSOLZ(): void {
    this.SOLZFREI = this.SOLZFREI * this.KZTAB;

    if (this.JBMG > this.SOLZFREI) {
      this.SOLZJ = aufDenCentAbrunden((this.JBMG * 5.5) / 100);
      this.SOLZMIN = ((this.JBMG - this.SOLZFREI) * 11.9) / 100;

      if (this.SOLZMIN < this.SOLZJ) {
        this.SOLZJ = this.SOLZMIN;
      }

      this.JW = this.SOLZJ * 100;
      this.UPANTEIL();
      this.ausgangsparameter.SOLZLZZ = this.ANTEIL1;
    } else {
      this.ausgangsparameter.SOLZLZZ = 0;
    }

    if (this.eingangsparameter.R > 0) {
      this.JW = this.JBMG * 100;
      this.UPANTEIL();
      this.ausgangsparameter.BK = this.ANTEIL1;
    } else {
      this.ausgangsparameter.BK = 0;
    }
  }

  /**
   * Anteil von Jahresbeträgen für einen
   * LZZ (§ 39b Absatz 2 Satz 9 EStG)
   */
  private UPANTEIL(): void {
    if (this.eingangsparameter.LZZ === 1) {
      this.ANTEIL1 = this.JW;
    } else if (this.eingangsparameter.LZZ === 2) {
      this.ANTEIL1 = aufDenEuroAbrunden(this.JW / 12);
    } else if (this.eingangsparameter.LZZ === 3) {
      this.ANTEIL1 = aufDenEuroAbrunden((this.JW * 7) / 360);
    } else {
      this.ANTEIL1 = aufDenEuroAbrunden(this.JW / 360);
    }
  }

  /**
   * Tarifliche Einkommensteuer
   * (§ 32a EStG)
   */
  private UPTAB21(): void {
    if (this.X < this.GFB + 1) {
      this.ST = 0;
    }
    //
    else if (this.X < 14754) {
      this.Y = (this.X - this.GFB) / 10000;
      this.RW = this.Y * 995.21;
      this.RW = this.RW + 1400;
      this.ST = aufDenEuroAbrunden(this.RW * this.Y);
    }
    //
    else if (this.X < 57919) {
      this.Y = (this.X - 14753) / 10000;
      this.RW = this.Y * 208.85;
      this.RW = this.RW + 2397;
      this.RW = this.RW * this.Y;
      this.ST = aufDenEuroAbrunden(this.RW + 950.96);
    }
    //
    else if (this.X < 274613) {
      this.ST = aufDenEuroAbrunden(this.X * 0.42 - 9136.63);
    }
    //
    else {
      this.ST = aufDenEuroAbrunden(this.X * 0.45 - 17373.99);
    }

    this.ST = this.ST * this.KZTAB;
  }
}

if (import.meta.vitest) {
  const { describe, test, expect } = import.meta.vitest;

  describe("Programmablaufplan 2023", () => {
    test.each<{
      jahreslohn: number;
      steuerklasse: 1 | 2 | 3 | 4 | 5 | 6;
      jahreslohnsteuer: number;
    }>([
      // Zeile 1
      { jahreslohn: 5000, steuerklasse: 1, jahreslohnsteuer: 0 },
      { jahreslohn: 5000, steuerklasse: 2, jahreslohnsteuer: 0 },
      { jahreslohn: 5000, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 5000, steuerklasse: 4, jahreslohnsteuer: 0 },
      { jahreslohn: 5000, steuerklasse: 5, jahreslohnsteuer: 416 },
      { jahreslohn: 5000, steuerklasse: 6, jahreslohnsteuer: 561 },
      // Zeile 2
      { jahreslohn: 7500, steuerklasse: 1, jahreslohnsteuer: 0 },
      { jahreslohn: 7500, steuerklasse: 2, jahreslohnsteuer: 0 },
      { jahreslohn: 7500, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 7500, steuerklasse: 4, jahreslohnsteuer: 0 },
      { jahreslohn: 7500, steuerklasse: 5, jahreslohnsteuer: 696 },
      { jahreslohn: 7500, steuerklasse: 6, jahreslohnsteuer: 841 },
      // Zeile 3
      { jahreslohn: 10000, steuerklasse: 1, jahreslohnsteuer: 0 },
      { jahreslohn: 10000, steuerklasse: 2, jahreslohnsteuer: 0 },
      { jahreslohn: 10000, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 10000, steuerklasse: 4, jahreslohnsteuer: 0 },
      { jahreslohn: 10000, steuerklasse: 5, jahreslohnsteuer: 977 },
      { jahreslohn: 10000, steuerklasse: 6, jahreslohnsteuer: 1122 },
      // Zeile 4
      { jahreslohn: 12500, steuerklasse: 1, jahreslohnsteuer: 0 },
      { jahreslohn: 12500, steuerklasse: 2, jahreslohnsteuer: 0 },
      { jahreslohn: 12500, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 12500, steuerklasse: 4, jahreslohnsteuer: 0 },
      { jahreslohn: 12500, steuerklasse: 5, jahreslohnsteuer: 1258 },
      { jahreslohn: 12500, steuerklasse: 6, jahreslohnsteuer: 1403 },
      // Zeile 5
      { jahreslohn: 15000, steuerklasse: 1, jahreslohnsteuer: 190 },
      { jahreslohn: 15000, steuerklasse: 2, jahreslohnsteuer: 0 },
      { jahreslohn: 15000, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 15000, steuerklasse: 4, jahreslohnsteuer: 190 },
      { jahreslohn: 15000, steuerklasse: 5, jahreslohnsteuer: 1538 },
      { jahreslohn: 15000, steuerklasse: 6, jahreslohnsteuer: 1905 },
      // Zeile 6
      { jahreslohn: 17500, steuerklasse: 1, jahreslohnsteuer: 601 },
      { jahreslohn: 17500, steuerklasse: 2, jahreslohnsteuer: 239 },
      { jahreslohn: 17500, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 17500, steuerklasse: 4, jahreslohnsteuer: 601 },
      { jahreslohn: 17500, steuerklasse: 5, jahreslohnsteuer: 2395 },
      { jahreslohn: 17500, steuerklasse: 6, jahreslohnsteuer: 2830 },
      // Zeile 7
      { jahreslohn: 20000, steuerklasse: 1, jahreslohnsteuer: 1131 },
      { jahreslohn: 20000, steuerklasse: 2, jahreslohnsteuer: 686 },
      { jahreslohn: 20000, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 20000, steuerklasse: 4, jahreslohnsteuer: 1131 },
      { jahreslohn: 20000, steuerklasse: 5, jahreslohnsteuer: 3363 },
      { jahreslohn: 20000, steuerklasse: 6, jahreslohnsteuer: 3799 },
      // Zeile 8
      { jahreslohn: 22500, steuerklasse: 1, jahreslohnsteuer: 1646 },
      { jahreslohn: 22500, steuerklasse: 2, jahreslohnsteuer: 1187 },
      { jahreslohn: 22500, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 22500, steuerklasse: 4, jahreslohnsteuer: 1646 },
      { jahreslohn: 22500, steuerklasse: 5, jahreslohnsteuer: 4239 },
      { jahreslohn: 22500, steuerklasse: 6, jahreslohnsteuer: 4674 },
      // Zeile 9
      { jahreslohn: 25000, steuerklasse: 1, jahreslohnsteuer: 2175 },
      { jahreslohn: 25000, steuerklasse: 2, jahreslohnsteuer: 1702 },
      { jahreslohn: 25000, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 25000, steuerklasse: 4, jahreslohnsteuer: 2175 },
      { jahreslohn: 25000, steuerklasse: 5, jahreslohnsteuer: 5108 },
      { jahreslohn: 25000, steuerklasse: 6, jahreslohnsteuer: 5472 },
      // Zeile 10
      { jahreslohn: 27500, steuerklasse: 1, jahreslohnsteuer: 2723 },
      { jahreslohn: 27500, steuerklasse: 2, jahreslohnsteuer: 2235 },
      { jahreslohn: 27500, steuerklasse: 3, jahreslohnsteuer: 272 },
      { jahreslohn: 27500, steuerklasse: 4, jahreslohnsteuer: 2723 },
      { jahreslohn: 27500, steuerklasse: 5, jahreslohnsteuer: 5840 },
      { jahreslohn: 27500, steuerklasse: 6, jahreslohnsteuer: 6216 },
      // Zeile 11
      { jahreslohn: 30000, steuerklasse: 1, jahreslohnsteuer: 3288 },
      { jahreslohn: 30000, steuerklasse: 2, jahreslohnsteuer: 2786 },
      { jahreslohn: 30000, steuerklasse: 3, jahreslohnsteuer: 662 },
      { jahreslohn: 30000, steuerklasse: 4, jahreslohnsteuer: 3288 },
      { jahreslohn: 30000, steuerklasse: 5, jahreslohnsteuer: 6602 },
      { jahreslohn: 30000, steuerklasse: 6, jahreslohnsteuer: 6996 },
      // Zeile 12
      { jahreslohn: 32500, steuerklasse: 1, jahreslohnsteuer: 3871 },
      { jahreslohn: 32500, steuerklasse: 2, jahreslohnsteuer: 3355 },
      { jahreslohn: 32500, steuerklasse: 3, jahreslohnsteuer: 1094 },
      { jahreslohn: 32500, steuerklasse: 4, jahreslohnsteuer: 3871 },
      { jahreslohn: 32500, steuerklasse: 5, jahreslohnsteuer: 7400 },
      { jahreslohn: 32500, steuerklasse: 6, jahreslohnsteuer: 7812 },
      // Zeile 13
      { jahreslohn: 35000, steuerklasse: 1, jahreslohnsteuer: 4472 },
      { jahreslohn: 35000, steuerklasse: 2, jahreslohnsteuer: 3942 },
      { jahreslohn: 35000, steuerklasse: 3, jahreslohnsteuer: 1536 },
      { jahreslohn: 35000, steuerklasse: 4, jahreslohnsteuer: 4472 },
      { jahreslohn: 35000, steuerklasse: 5, jahreslohnsteuer: 8232 },
      { jahreslohn: 35000, steuerklasse: 6, jahreslohnsteuer: 8663 },
      // Zeile 14
      { jahreslohn: 37500, steuerklasse: 1, jahreslohnsteuer: 5091 },
      { jahreslohn: 37500, steuerklasse: 2, jahreslohnsteuer: 4547 },
      { jahreslohn: 37500, steuerklasse: 3, jahreslohnsteuer: 2020 },
      { jahreslohn: 37500, steuerklasse: 4, jahreslohnsteuer: 5091 },
      { jahreslohn: 37500, steuerklasse: 5, jahreslohnsteuer: 9097 },
      { jahreslohn: 37500, steuerklasse: 6, jahreslohnsteuer: 9532 },
      // Zeile 15
      { jahreslohn: 40000, steuerklasse: 1, jahreslohnsteuer: 5727 },
      { jahreslohn: 40000, steuerklasse: 2, jahreslohnsteuer: 5170 },
      { jahreslohn: 40000, steuerklasse: 3, jahreslohnsteuer: 2522 },
      { jahreslohn: 40000, steuerklasse: 4, jahreslohnsteuer: 5727 },
      { jahreslohn: 40000, steuerklasse: 5, jahreslohnsteuer: 9966 },
      { jahreslohn: 40000, steuerklasse: 6, jahreslohnsteuer: 10401 },
      // Zeile 16
      { jahreslohn: 42500, steuerklasse: 1, jahreslohnsteuer: 6382 },
      { jahreslohn: 42500, steuerklasse: 2, jahreslohnsteuer: 5811 },
      { jahreslohn: 42500, steuerklasse: 3, jahreslohnsteuer: 3034 },
      { jahreslohn: 42500, steuerklasse: 4, jahreslohnsteuer: 6382 },
      { jahreslohn: 42500, steuerklasse: 5, jahreslohnsteuer: 10835 },
      { jahreslohn: 42500, steuerklasse: 6, jahreslohnsteuer: 11270 },
      // Zeile 17
      { jahreslohn: 45000, steuerklasse: 1, jahreslohnsteuer: 7054 },
      { jahreslohn: 45000, steuerklasse: 2, jahreslohnsteuer: 6470 },
      { jahreslohn: 45000, steuerklasse: 3, jahreslohnsteuer: 3554 },
      { jahreslohn: 45000, steuerklasse: 4, jahreslohnsteuer: 7054 },
      { jahreslohn: 45000, steuerklasse: 5, jahreslohnsteuer: 11704 },
      { jahreslohn: 45000, steuerklasse: 6, jahreslohnsteuer: 12139 },
      // Zeile 18
      { jahreslohn: 47500, steuerklasse: 1, jahreslohnsteuer: 7745 },
      { jahreslohn: 47500, steuerklasse: 2, jahreslohnsteuer: 7147 },
      { jahreslohn: 47500, steuerklasse: 3, jahreslohnsteuer: 4084 },
      { jahreslohn: 47500, steuerklasse: 4, jahreslohnsteuer: 7745 },
      { jahreslohn: 47500, steuerklasse: 5, jahreslohnsteuer: 12573 },
      { jahreslohn: 47500, steuerklasse: 6, jahreslohnsteuer: 13008 },
      // Zeile 19
      { jahreslohn: 50000, steuerklasse: 1, jahreslohnsteuer: 8453 },
      { jahreslohn: 50000, steuerklasse: 2, jahreslohnsteuer: 7841 },
      { jahreslohn: 50000, steuerklasse: 3, jahreslohnsteuer: 4622 },
      { jahreslohn: 50000, steuerklasse: 4, jahreslohnsteuer: 8453 },
      { jahreslohn: 50000, steuerklasse: 5, jahreslohnsteuer: 13442 },
      { jahreslohn: 50000, steuerklasse: 6, jahreslohnsteuer: 13877 },
      // Zeile 20
      { jahreslohn: 52500, steuerklasse: 1, jahreslohnsteuer: 9179 },
      { jahreslohn: 52500, steuerklasse: 2, jahreslohnsteuer: 8554 },
      { jahreslohn: 52500, steuerklasse: 3, jahreslohnsteuer: 5168 },
      { jahreslohn: 52500, steuerklasse: 4, jahreslohnsteuer: 9179 },
      { jahreslohn: 52500, steuerklasse: 5, jahreslohnsteuer: 14311 },
      { jahreslohn: 52500, steuerklasse: 6, jahreslohnsteuer: 14746 },
      // Zeile 21
      { jahreslohn: 55000, steuerklasse: 1, jahreslohnsteuer: 9923 },
      { jahreslohn: 55000, steuerklasse: 2, jahreslohnsteuer: 9285 },
      { jahreslohn: 55000, steuerklasse: 3, jahreslohnsteuer: 5724 },
      { jahreslohn: 55000, steuerklasse: 4, jahreslohnsteuer: 9923 },
      { jahreslohn: 55000, steuerklasse: 5, jahreslohnsteuer: 15180 },
      { jahreslohn: 55000, steuerklasse: 6, jahreslohnsteuer: 15615 },
      // Zeile 22
      { jahreslohn: 57500, steuerklasse: 1, jahreslohnsteuer: 10685 },
      { jahreslohn: 57500, steuerklasse: 2, jahreslohnsteuer: 10034 },
      { jahreslohn: 57500, steuerklasse: 3, jahreslohnsteuer: 6290 },
      { jahreslohn: 57500, steuerklasse: 4, jahreslohnsteuer: 10685 },
      { jahreslohn: 57500, steuerklasse: 5, jahreslohnsteuer: 16049 },
      { jahreslohn: 57500, steuerklasse: 6, jahreslohnsteuer: 16484 },
      // Zeile 23
      { jahreslohn: 60000, steuerklasse: 1, jahreslohnsteuer: 11534 },
      { jahreslohn: 60000, steuerklasse: 2, jahreslohnsteuer: 10868 },
      { jahreslohn: 60000, steuerklasse: 3, jahreslohnsteuer: 6916 },
      { jahreslohn: 60000, steuerklasse: 4, jahreslohnsteuer: 11534 },
      { jahreslohn: 60000, steuerklasse: 5, jahreslohnsteuer: 16995 },
      { jahreslohn: 60000, steuerklasse: 6, jahreslohnsteuer: 17430 },
      // Zeile 24
      { jahreslohn: 62500, steuerklasse: 1, jahreslohnsteuer: 12426 },
      { jahreslohn: 62500, steuerklasse: 2, jahreslohnsteuer: 11742 },
      { jahreslohn: 62500, steuerklasse: 3, jahreslohnsteuer: 7566 },
      { jahreslohn: 62500, steuerklasse: 4, jahreslohnsteuer: 12426 },
      { jahreslohn: 62500, steuerklasse: 5, jahreslohnsteuer: 17963 },
      { jahreslohn: 62500, steuerklasse: 6, jahreslohnsteuer: 18398 },
      // Zeile 25
      { jahreslohn: 65000, steuerklasse: 1, jahreslohnsteuer: 13339 },
      { jahreslohn: 65000, steuerklasse: 2, jahreslohnsteuer: 12639 },
      { jahreslohn: 65000, steuerklasse: 3, jahreslohnsteuer: 8228 },
      { jahreslohn: 65000, steuerklasse: 4, jahreslohnsteuer: 13339 },
      { jahreslohn: 65000, steuerklasse: 5, jahreslohnsteuer: 18931 },
      { jahreslohn: 65000, steuerklasse: 6, jahreslohnsteuer: 19366 },
      // Zeile 26
      { jahreslohn: 67500, steuerklasse: 1, jahreslohnsteuer: 14275 },
      { jahreslohn: 67500, steuerklasse: 2, jahreslohnsteuer: 13557 },
      { jahreslohn: 67500, steuerklasse: 3, jahreslohnsteuer: 8902 },
      { jahreslohn: 67500, steuerklasse: 4, jahreslohnsteuer: 14275 },
      { jahreslohn: 67500, steuerklasse: 5, jahreslohnsteuer: 19899 },
      { jahreslohn: 67500, steuerklasse: 6, jahreslohnsteuer: 20334 },
      // Zeile 27
      { jahreslohn: 70000, steuerklasse: 1, jahreslohnsteuer: 15233 },
      { jahreslohn: 70000, steuerklasse: 2, jahreslohnsteuer: 14498 },
      { jahreslohn: 70000, steuerklasse: 3, jahreslohnsteuer: 9586 },
      { jahreslohn: 70000, steuerklasse: 4, jahreslohnsteuer: 15233 },
      { jahreslohn: 70000, steuerklasse: 5, jahreslohnsteuer: 20867 },
      { jahreslohn: 70000, steuerklasse: 6, jahreslohnsteuer: 21302 },
      // Zeile 28
      { jahreslohn: 72500, steuerklasse: 1, jahreslohnsteuer: 16201 },
      { jahreslohn: 72500, steuerklasse: 2, jahreslohnsteuer: 15461 },
      { jahreslohn: 72500, steuerklasse: 3, jahreslohnsteuer: 10280 },
      { jahreslohn: 72500, steuerklasse: 4, jahreslohnsteuer: 16201 },
      { jahreslohn: 72500, steuerklasse: 5, jahreslohnsteuer: 21835 },
      { jahreslohn: 72500, steuerklasse: 6, jahreslohnsteuer: 22270 },
      // Zeile 29
      { jahreslohn: 75000, steuerklasse: 1, jahreslohnsteuer: 17169 },
      { jahreslohn: 75000, steuerklasse: 2, jahreslohnsteuer: 16428 },
      { jahreslohn: 75000, steuerklasse: 3, jahreslohnsteuer: 10988 },
      { jahreslohn: 75000, steuerklasse: 4, jahreslohnsteuer: 17169 },
      { jahreslohn: 75000, steuerklasse: 5, jahreslohnsteuer: 22803 },
      { jahreslohn: 75000, steuerklasse: 6, jahreslohnsteuer: 23238 },
      // Zeile 30
      { jahreslohn: 77500, steuerklasse: 1, jahreslohnsteuer: 18137 },
      { jahreslohn: 77500, steuerklasse: 2, jahreslohnsteuer: 17396 },
      { jahreslohn: 77500, steuerklasse: 3, jahreslohnsteuer: 11704 },
      { jahreslohn: 77500, steuerklasse: 4, jahreslohnsteuer: 18137 },
      { jahreslohn: 77500, steuerklasse: 5, jahreslohnsteuer: 23771 },
      { jahreslohn: 77500, steuerklasse: 6, jahreslohnsteuer: 24206 },
      // Zeile 31
      { jahreslohn: 80000, steuerklasse: 1, jahreslohnsteuer: 19105 },
      { jahreslohn: 80000, steuerklasse: 2, jahreslohnsteuer: 18364 },
      { jahreslohn: 80000, steuerklasse: 3, jahreslohnsteuer: 12434 },
      { jahreslohn: 80000, steuerklasse: 4, jahreslohnsteuer: 19105 },
      { jahreslohn: 80000, steuerklasse: 5, jahreslohnsteuer: 24739 },
      { jahreslohn: 80000, steuerklasse: 6, jahreslohnsteuer: 25174 },
      // Zeile 32
      { jahreslohn: 82500, steuerklasse: 1, jahreslohnsteuer: 20073 },
      { jahreslohn: 82500, steuerklasse: 2, jahreslohnsteuer: 19333 },
      { jahreslohn: 82500, steuerklasse: 3, jahreslohnsteuer: 13172 },
      { jahreslohn: 82500, steuerklasse: 4, jahreslohnsteuer: 20073 },
      { jahreslohn: 82500, steuerklasse: 5, jahreslohnsteuer: 25706 },
      { jahreslohn: 82500, steuerklasse: 6, jahreslohnsteuer: 26142 },
      // Zeile 33
      { jahreslohn: 85000, steuerklasse: 1, jahreslohnsteuer: 21041 },
      { jahreslohn: 85000, steuerklasse: 2, jahreslohnsteuer: 20300 },
      { jahreslohn: 85000, steuerklasse: 3, jahreslohnsteuer: 13924 },
      { jahreslohn: 85000, steuerklasse: 4, jahreslohnsteuer: 21041 },
      { jahreslohn: 85000, steuerklasse: 5, jahreslohnsteuer: 26675 },
      { jahreslohn: 85000, steuerklasse: 6, jahreslohnsteuer: 27110 },
      // Zeile 34
      { jahreslohn: 87500, steuerklasse: 1, jahreslohnsteuer: 22084 },
      { jahreslohn: 87500, steuerklasse: 2, jahreslohnsteuer: 21344 },
      { jahreslohn: 87500, steuerklasse: 3, jahreslohnsteuer: 14746 },
      { jahreslohn: 87500, steuerklasse: 4, jahreslohnsteuer: 22084 },
      { jahreslohn: 87500, steuerklasse: 5, jahreslohnsteuer: 27718 },
      { jahreslohn: 87500, steuerklasse: 6, jahreslohnsteuer: 28153 },
      // Zeile 35
      { jahreslohn: 90000, steuerklasse: 1, jahreslohnsteuer: 23134 },
      { jahreslohn: 90000, steuerklasse: 2, jahreslohnsteuer: 22394 },
      { jahreslohn: 90000, steuerklasse: 3, jahreslohnsteuer: 15586 },
      { jahreslohn: 90000, steuerklasse: 4, jahreslohnsteuer: 23134 },
      { jahreslohn: 90000, steuerklasse: 5, jahreslohnsteuer: 28768 },
      { jahreslohn: 90000, steuerklasse: 6, jahreslohnsteuer: 29203 },
    ])(
      "Allgemeine Prüftabelle - Jahreslohn: '$jahreslohn' Euro; Steuerklasse: '$steuerklasse';",
      ({ jahreslohn, steuerklasse, jahreslohnsteuer }) => {
        const programm = new PAP_2021({
          AF: 0,
          F: 0,
          KRV: 0,
          KVZ: 1.3,
          LZZ: 1,
          LZZFREIB: 0,
          LZZHINZU: 0,
          PKPV: 0,
          PKV: 0,
          PVA: 0,
          PVS: 0,
          PVZ: steuerklasse === 2 ? 0 : 1,
          R: 0,
          RE4: jahreslohn * 100,
          STKL: steuerklasse,
          VBEZ: 0,
          ZKF: 0,
        });

        const { LSTLZZ } = programm.ausfuehren();
        const berechneteJahreslohnsteuerInEuro = aufDenEuroAbrunden(
          LSTLZZ / 100,
        );

        expect(berechneteJahreslohnsteuerInEuro).toEqual(jahreslohnsteuer);
      },
    );

    test.each<{
      jahreslohn: number;
      steuerklasse: 1 | 2 | 3 | 4 | 5 | 6;
      jahreslohnsteuer: number;
    }>([
      // Zeile 1
      { jahreslohn: 5000, steuerklasse: 1, jahreslohnsteuer: 0 },
      { jahreslohn: 5000, steuerklasse: 2, jahreslohnsteuer: 0 },
      { jahreslohn: 5000, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 5000, steuerklasse: 4, jahreslohnsteuer: 0 },
      { jahreslohn: 5000, steuerklasse: 5, jahreslohnsteuer: 470 },
      { jahreslohn: 5000, steuerklasse: 6, jahreslohnsteuer: 616 },
      // Zeile 2
      { jahreslohn: 7500, steuerklasse: 1, jahreslohnsteuer: 0 },
      { jahreslohn: 7500, steuerklasse: 2, jahreslohnsteuer: 0 },
      { jahreslohn: 7500, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 7500, steuerklasse: 4, jahreslohnsteuer: 0 },
      { jahreslohn: 7500, steuerklasse: 5, jahreslohnsteuer: 778 },
      { jahreslohn: 7500, steuerklasse: 6, jahreslohnsteuer: 924 },
      // Zeile 3
      { jahreslohn: 10000, steuerklasse: 1, jahreslohnsteuer: 0 },
      { jahreslohn: 10000, steuerklasse: 2, jahreslohnsteuer: 0 },
      { jahreslohn: 10000, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 10000, steuerklasse: 4, jahreslohnsteuer: 0 },
      { jahreslohn: 10000, steuerklasse: 5, jahreslohnsteuer: 1086 },
      { jahreslohn: 10000, steuerklasse: 6, jahreslohnsteuer: 1232 },
      // Zeile 4
      { jahreslohn: 12500, steuerklasse: 1, jahreslohnsteuer: 31 },
      { jahreslohn: 12500, steuerklasse: 2, jahreslohnsteuer: 0 },
      { jahreslohn: 12500, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 12500, steuerklasse: 4, jahreslohnsteuer: 31 },
      { jahreslohn: 12500, steuerklasse: 5, jahreslohnsteuer: 1394 },
      { jahreslohn: 12500, steuerklasse: 6, jahreslohnsteuer: 1540 },
      // Zeile 5
      { jahreslohn: 15000, steuerklasse: 1, jahreslohnsteuer: 397 },
      { jahreslohn: 15000, steuerklasse: 2, jahreslohnsteuer: 74 },
      { jahreslohn: 15000, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 15000, steuerklasse: 4, jahreslohnsteuer: 397 },
      { jahreslohn: 15000, steuerklasse: 5, jahreslohnsteuer: 1962 },
      { jahreslohn: 15000, steuerklasse: 6, jahreslohnsteuer: 2397 },
      // Zeile 6
      { jahreslohn: 17500, steuerklasse: 1, jahreslohnsteuer: 906 },
      { jahreslohn: 17500, steuerklasse: 2, jahreslohnsteuer: 492 },
      { jahreslohn: 17500, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 17500, steuerklasse: 4, jahreslohnsteuer: 906 },
      { jahreslohn: 17500, steuerklasse: 5, jahreslohnsteuer: 2970 },
      { jahreslohn: 17500, steuerklasse: 6, jahreslohnsteuer: 3405 },
      // Zeile 7
      { jahreslohn: 20000, steuerklasse: 1, jahreslohnsteuer: 1516 },
      { jahreslohn: 20000, steuerklasse: 2, jahreslohnsteuer: 1047 },
      { jahreslohn: 20000, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 20000, steuerklasse: 4, jahreslohnsteuer: 1516 },
      { jahreslohn: 20000, steuerklasse: 5, jahreslohnsteuer: 4020 },
      { jahreslohn: 20000, steuerklasse: 6, jahreslohnsteuer: 4455 },
      // Zeile 8
      { jahreslohn: 22500, steuerklasse: 1, jahreslohnsteuer: 2152 },
      { jahreslohn: 22500, steuerklasse: 2, jahreslohnsteuer: 1664 },
      { jahreslohn: 22500, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 22500, steuerklasse: 4, jahreslohnsteuer: 2152 },
      { jahreslohn: 22500, steuerklasse: 5, jahreslohnsteuer: 5070 },
      { jahreslohn: 22500, steuerklasse: 6, jahreslohnsteuer: 5440 },
      // Zeile 9
      { jahreslohn: 25000, steuerklasse: 1, jahreslohnsteuer: 2815 },
      { jahreslohn: 25000, steuerklasse: 2, jahreslohnsteuer: 2307 },
      { jahreslohn: 25000, steuerklasse: 3, jahreslohnsteuer: 216 },
      { jahreslohn: 25000, steuerklasse: 4, jahreslohnsteuer: 2815 },
      { jahreslohn: 25000, steuerklasse: 5, jahreslohnsteuer: 5964 },
      { jahreslohn: 25000, steuerklasse: 6, jahreslohnsteuer: 6342 },
      // Zeile 10
      { jahreslohn: 27500, steuerklasse: 1, jahreslohnsteuer: 3503 },
      { jahreslohn: 27500, steuerklasse: 2, jahreslohnsteuer: 2975 },
      { jahreslohn: 27500, steuerklasse: 3, jahreslohnsteuer: 634 },
      { jahreslohn: 27500, steuerklasse: 4, jahreslohnsteuer: 3503 },
      { jahreslohn: 27500, steuerklasse: 5, jahreslohnsteuer: 6896 },
      { jahreslohn: 27500, steuerklasse: 6, jahreslohnsteuer: 7296 },
      // Zeile 11
      { jahreslohn: 30000, steuerklasse: 1, jahreslohnsteuer: 4218 },
      { jahreslohn: 30000, steuerklasse: 2, jahreslohnsteuer: 3670 },
      { jahreslohn: 30000, steuerklasse: 3, jahreslohnsteuer: 1114 },
      { jahreslohn: 30000, steuerklasse: 4, jahreslohnsteuer: 4218 },
      { jahreslohn: 30000, steuerklasse: 5, jahreslohnsteuer: 7878 },
      { jahreslohn: 30000, steuerklasse: 6, jahreslohnsteuer: 8302 },
      // Zeile 12
      { jahreslohn: 32500, steuerklasse: 1, jahreslohnsteuer: 4959 },
      { jahreslohn: 32500, steuerklasse: 2, jahreslohnsteuer: 4391 },
      { jahreslohn: 32500, steuerklasse: 3, jahreslohnsteuer: 1656 },
      { jahreslohn: 32500, steuerklasse: 4, jahreslohnsteuer: 4959 },
      { jahreslohn: 32500, steuerklasse: 5, jahreslohnsteuer: 8914 },
      { jahreslohn: 32500, steuerklasse: 6, jahreslohnsteuer: 9349 },
      // Zeile 13
      { jahreslohn: 35000, steuerklasse: 1, jahreslohnsteuer: 5726 },
      { jahreslohn: 35000, steuerklasse: 2, jahreslohnsteuer: 5138 },
      { jahreslohn: 35000, steuerklasse: 3, jahreslohnsteuer: 2252 },
      { jahreslohn: 35000, steuerklasse: 4, jahreslohnsteuer: 5726 },
      { jahreslohn: 35000, steuerklasse: 5, jahreslohnsteuer: 9964 },
      { jahreslohn: 35000, steuerklasse: 6, jahreslohnsteuer: 10399 },
      // Zeile 14
      { jahreslohn: 37500, steuerklasse: 1, jahreslohnsteuer: 6519 },
      { jahreslohn: 37500, steuerklasse: 2, jahreslohnsteuer: 5911 },
      { jahreslohn: 37500, steuerklasse: 3, jahreslohnsteuer: 2866 },
      { jahreslohn: 37500, steuerklasse: 4, jahreslohnsteuer: 6519 },
      { jahreslohn: 37500, steuerklasse: 5, jahreslohnsteuer: 11014 },
      { jahreslohn: 37500, steuerklasse: 6, jahreslohnsteuer: 11449 },
      // Zeile 15
      { jahreslohn: 40000, steuerklasse: 1, jahreslohnsteuer: 7338 },
      { jahreslohn: 40000, steuerklasse: 2, jahreslohnsteuer: 6710 },
      { jahreslohn: 40000, steuerklasse: 3, jahreslohnsteuer: 3492 },
      { jahreslohn: 40000, steuerklasse: 4, jahreslohnsteuer: 7338 },
      { jahreslohn: 40000, steuerklasse: 5, jahreslohnsteuer: 12064 },
      { jahreslohn: 40000, steuerklasse: 6, jahreslohnsteuer: 12499 },
      // Zeile 16
      { jahreslohn: 42500, steuerklasse: 1, jahreslohnsteuer: 8183 },
      { jahreslohn: 42500, steuerklasse: 2, jahreslohnsteuer: 7536 },
      { jahreslohn: 42500, steuerklasse: 3, jahreslohnsteuer: 4132 },
      { jahreslohn: 42500, steuerklasse: 4, jahreslohnsteuer: 8183 },
      { jahreslohn: 42500, steuerklasse: 5, jahreslohnsteuer: 13114 },
      { jahreslohn: 42500, steuerklasse: 6, jahreslohnsteuer: 13549 },
      // Zeile 17
      { jahreslohn: 45000, steuerklasse: 1, jahreslohnsteuer: 9055 },
      { jahreslohn: 45000, steuerklasse: 2, jahreslohnsteuer: 8387 },
      { jahreslohn: 45000, steuerklasse: 3, jahreslohnsteuer: 4784 },
      { jahreslohn: 45000, steuerklasse: 4, jahreslohnsteuer: 9055 },
      { jahreslohn: 45000, steuerklasse: 5, jahreslohnsteuer: 14164 },
      { jahreslohn: 45000, steuerklasse: 6, jahreslohnsteuer: 14599 },
      // Zeile 18
      { jahreslohn: 47500, steuerklasse: 1, jahreslohnsteuer: 9952 },
      { jahreslohn: 47500, steuerklasse: 2, jahreslohnsteuer: 9265 },
      { jahreslohn: 47500, steuerklasse: 3, jahreslohnsteuer: 5450 },
      { jahreslohn: 47500, steuerklasse: 4, jahreslohnsteuer: 9952 },
      { jahreslohn: 47500, steuerklasse: 5, jahreslohnsteuer: 15214 },
      { jahreslohn: 47500, steuerklasse: 6, jahreslohnsteuer: 15649 },
      // Zeile 19
      { jahreslohn: 50000, steuerklasse: 1, jahreslohnsteuer: 10876 },
      { jahreslohn: 50000, steuerklasse: 2, jahreslohnsteuer: 10169 },
      { jahreslohn: 50000, steuerklasse: 3, jahreslohnsteuer: 6128 },
      { jahreslohn: 50000, steuerklasse: 4, jahreslohnsteuer: 10876 },
      { jahreslohn: 50000, steuerklasse: 5, jahreslohnsteuer: 16264 },
      { jahreslohn: 50000, steuerklasse: 6, jahreslohnsteuer: 16699 },
      // Zeile 20
      { jahreslohn: 52500, steuerklasse: 1, jahreslohnsteuer: 11826 },
      { jahreslohn: 52500, steuerklasse: 2, jahreslohnsteuer: 11098 },
      { jahreslohn: 52500, steuerklasse: 3, jahreslohnsteuer: 6820 },
      { jahreslohn: 52500, steuerklasse: 4, jahreslohnsteuer: 11826 },
      { jahreslohn: 52500, steuerklasse: 5, jahreslohnsteuer: 17314 },
      { jahreslohn: 52500, steuerklasse: 6, jahreslohnsteuer: 17749 },
      // Zeile 21
      { jahreslohn: 55000, steuerklasse: 1, jahreslohnsteuer: 12801 },
      { jahreslohn: 55000, steuerklasse: 2, jahreslohnsteuer: 12054 },
      { jahreslohn: 55000, steuerklasse: 3, jahreslohnsteuer: 7526 },
      { jahreslohn: 55000, steuerklasse: 4, jahreslohnsteuer: 12801 },
      { jahreslohn: 55000, steuerklasse: 5, jahreslohnsteuer: 18364 },
      { jahreslohn: 55000, steuerklasse: 6, jahreslohnsteuer: 18799 },
      // Zeile 22
      { jahreslohn: 57500, steuerklasse: 1, jahreslohnsteuer: 13803 },
      { jahreslohn: 57500, steuerklasse: 2, jahreslohnsteuer: 13036 },
      { jahreslohn: 57500, steuerklasse: 3, jahreslohnsteuer: 8244 },
      { jahreslohn: 57500, steuerklasse: 4, jahreslohnsteuer: 13803 },
      { jahreslohn: 57500, steuerklasse: 5, jahreslohnsteuer: 19414 },
      { jahreslohn: 57500, steuerklasse: 6, jahreslohnsteuer: 19849 },
      // Zeile 23
      { jahreslohn: 60000, steuerklasse: 1, jahreslohnsteuer: 14831 },
      { jahreslohn: 60000, steuerklasse: 2, jahreslohnsteuer: 14044 },
      { jahreslohn: 60000, steuerklasse: 3, jahreslohnsteuer: 8974 },
      { jahreslohn: 60000, steuerklasse: 4, jahreslohnsteuer: 14831 },
      { jahreslohn: 60000, steuerklasse: 5, jahreslohnsteuer: 20464 },
      { jahreslohn: 60000, steuerklasse: 6, jahreslohnsteuer: 20899 },
      // Zeile 24
      { jahreslohn: 62500, steuerklasse: 1, jahreslohnsteuer: 15880 },
      { jahreslohn: 62500, steuerklasse: 2, jahreslohnsteuer: 15079 },
      { jahreslohn: 62500, steuerklasse: 3, jahreslohnsteuer: 9718 },
      { jahreslohn: 62500, steuerklasse: 4, jahreslohnsteuer: 15880 },
      { jahreslohn: 62500, steuerklasse: 5, jahreslohnsteuer: 21514 },
      { jahreslohn: 62500, steuerklasse: 6, jahreslohnsteuer: 21949 },
      // Zeile 25
      { jahreslohn: 65000, steuerklasse: 1, jahreslohnsteuer: 16930 },
      { jahreslohn: 65000, steuerklasse: 2, jahreslohnsteuer: 16128 },
      { jahreslohn: 65000, steuerklasse: 3, jahreslohnsteuer: 10474 },
      { jahreslohn: 65000, steuerklasse: 4, jahreslohnsteuer: 16930 },
      { jahreslohn: 65000, steuerklasse: 5, jahreslohnsteuer: 22564 },
      { jahreslohn: 65000, steuerklasse: 6, jahreslohnsteuer: 22999 },
      // Zeile 26
      { jahreslohn: 67500, steuerklasse: 1, jahreslohnsteuer: 17980 },
      { jahreslohn: 67500, steuerklasse: 2, jahreslohnsteuer: 17178 },
      { jahreslohn: 67500, steuerklasse: 3, jahreslohnsteuer: 11244 },
      { jahreslohn: 67500, steuerklasse: 4, jahreslohnsteuer: 17980 },
      { jahreslohn: 67500, steuerklasse: 5, jahreslohnsteuer: 23614 },
      { jahreslohn: 67500, steuerklasse: 6, jahreslohnsteuer: 24049 },
      // Zeile 27
      { jahreslohn: 70000, steuerklasse: 1, jahreslohnsteuer: 19030 },
      { jahreslohn: 70000, steuerklasse: 2, jahreslohnsteuer: 18228 },
      { jahreslohn: 70000, steuerklasse: 3, jahreslohnsteuer: 12028 },
      { jahreslohn: 70000, steuerklasse: 4, jahreslohnsteuer: 19030 },
      { jahreslohn: 70000, steuerklasse: 5, jahreslohnsteuer: 24664 },
      { jahreslohn: 70000, steuerklasse: 6, jahreslohnsteuer: 25099 },
      // Zeile 28
      { jahreslohn: 72500, steuerklasse: 1, jahreslohnsteuer: 20080 },
      { jahreslohn: 72500, steuerklasse: 2, jahreslohnsteuer: 19278 },
      { jahreslohn: 72500, steuerklasse: 3, jahreslohnsteuer: 12824 },
      { jahreslohn: 72500, steuerklasse: 4, jahreslohnsteuer: 20080 },
      { jahreslohn: 72500, steuerklasse: 5, jahreslohnsteuer: 25714 },
      { jahreslohn: 72500, steuerklasse: 6, jahreslohnsteuer: 26149 },
      // Zeile 29
      { jahreslohn: 75000, steuerklasse: 1, jahreslohnsteuer: 21130 },
      { jahreslohn: 75000, steuerklasse: 2, jahreslohnsteuer: 20328 },
      { jahreslohn: 75000, steuerklasse: 3, jahreslohnsteuer: 13634 },
      { jahreslohn: 75000, steuerklasse: 4, jahreslohnsteuer: 21130 },
      { jahreslohn: 75000, steuerklasse: 5, jahreslohnsteuer: 26764 },
      { jahreslohn: 75000, steuerklasse: 6, jahreslohnsteuer: 27199 },
      // Zeile 30
      { jahreslohn: 77500, steuerklasse: 1, jahreslohnsteuer: 22180 },
      { jahreslohn: 77500, steuerklasse: 2, jahreslohnsteuer: 21378 },
      { jahreslohn: 77500, steuerklasse: 3, jahreslohnsteuer: 14456 },
      { jahreslohn: 77500, steuerklasse: 4, jahreslohnsteuer: 22180 },
      { jahreslohn: 77500, steuerklasse: 5, jahreslohnsteuer: 27814 },
      { jahreslohn: 77500, steuerklasse: 6, jahreslohnsteuer: 28249 },
      // Zeile 31
      { jahreslohn: 80000, steuerklasse: 1, jahreslohnsteuer: 23230 },
      { jahreslohn: 80000, steuerklasse: 2, jahreslohnsteuer: 22428 },
      { jahreslohn: 80000, steuerklasse: 3, jahreslohnsteuer: 15290 },
      { jahreslohn: 80000, steuerklasse: 4, jahreslohnsteuer: 23230 },
      { jahreslohn: 80000, steuerklasse: 5, jahreslohnsteuer: 28864 },
      { jahreslohn: 80000, steuerklasse: 6, jahreslohnsteuer: 29299 },
      // Zeile 32
      { jahreslohn: 82500, steuerklasse: 1, jahreslohnsteuer: 24280 },
      { jahreslohn: 82500, steuerklasse: 2, jahreslohnsteuer: 23478 },
      { jahreslohn: 82500, steuerklasse: 3, jahreslohnsteuer: 16140 },
      { jahreslohn: 82500, steuerklasse: 4, jahreslohnsteuer: 24280 },
      { jahreslohn: 82500, steuerklasse: 5, jahreslohnsteuer: 29914 },
      { jahreslohn: 82500, steuerklasse: 6, jahreslohnsteuer: 30349 },
      // Zeile 33
      { jahreslohn: 85000, steuerklasse: 1, jahreslohnsteuer: 25330 },
      { jahreslohn: 85000, steuerklasse: 2, jahreslohnsteuer: 24528 },
      { jahreslohn: 85000, steuerklasse: 3, jahreslohnsteuer: 17000 },
      { jahreslohn: 85000, steuerklasse: 4, jahreslohnsteuer: 25330 },
      { jahreslohn: 85000, steuerklasse: 5, jahreslohnsteuer: 30964 },
      { jahreslohn: 85000, steuerklasse: 6, jahreslohnsteuer: 31399 },
      // Zeile 34
      { jahreslohn: 87500, steuerklasse: 1, jahreslohnsteuer: 26380 },
      { jahreslohn: 87500, steuerklasse: 2, jahreslohnsteuer: 25578 },
      { jahreslohn: 87500, steuerklasse: 3, jahreslohnsteuer: 17874 },
      { jahreslohn: 87500, steuerklasse: 4, jahreslohnsteuer: 26380 },
      { jahreslohn: 87500, steuerklasse: 5, jahreslohnsteuer: 32014 },
      { jahreslohn: 87500, steuerklasse: 6, jahreslohnsteuer: 32449 },
      // Zeile 35
      { jahreslohn: 90000, steuerklasse: 1, jahreslohnsteuer: 27430 },
      { jahreslohn: 90000, steuerklasse: 2, jahreslohnsteuer: 26628 },
      { jahreslohn: 90000, steuerklasse: 3, jahreslohnsteuer: 18762 },
      { jahreslohn: 90000, steuerklasse: 4, jahreslohnsteuer: 27430 },
      { jahreslohn: 90000, steuerklasse: 5, jahreslohnsteuer: 33064 },
      { jahreslohn: 90000, steuerklasse: 6, jahreslohnsteuer: 33499 },
    ])(
      "Besondere Prüftabelle - Jahreseinkommen: '$jahreslohn' Euro; Steuerklasse: '$steuerklasse';",
      ({ jahreslohn, steuerklasse, jahreslohnsteuer }) => {
        const programm = new PAP_2021({
          AF: 0,
          F: 0,
          KRV: 2,
          KVZ: 0,
          LZZ: 1,
          LZZFREIB: 0,
          LZZHINZU: 0,
          PKPV: 0,
          PKV: 1,
          PVA: 0,
          PVS: 0,
          PVZ: steuerklasse === 2 ? 0 : 1,
          R: 0,
          RE4: jahreslohn * 100,
          STKL: steuerklasse,
          VBEZ: 0,
          ZKF: 0,
        });

        const { LSTLZZ } = programm.ausfuehren();
        const berechneteJahreslohnsteuerInEuro = aufDenEuroAbrunden(
          LSTLZZ / 100,
        );

        expect(berechneteJahreslohnsteuerInEuro).toEqual(jahreslohnsteuer);
      },
    );
  });
}
