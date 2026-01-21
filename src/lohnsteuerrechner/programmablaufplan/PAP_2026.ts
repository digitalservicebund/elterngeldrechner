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
 * und der Maßstabsteuer für die Kirchenlohnsteuer für 2026
 *
 * https://www.bundesfinanzministerium.de/Content/DE/Downloads/Steuern/Steuerarten/Lohnsteuer/Programmablaufplan/2025-11-12-PAP-2026-anlage-1.pdf?__blob=publicationFile&v=2
 */
export class PAP_2026 extends Programmablaufplan {
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
   * Beitragssatz des Arbeitnehmers zur Arbeitslosenversicherung
   *(4 Dezimalstellen)
   */
  private AVSATZAN: number = 0;

  /**
   * Beitragsbemessungsgrenze in der gesetzlichen
   * Krankenversicherung und der sozialen Pflegeversicherung in Euro
   */
  private BBGKVPV: number = 0;

  /**
   * Allgemeine Beitragsbemessungsgrenze in der allgemeinen
   * Rentenversicherung und Arbeitslosenversicherung in Euro
   */
  private BBGRVALV: number = 0;

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
   * Mindeststeuer für die Steuerklassen V und VI in Euro
   */
  private MIST: number = 0;

  /**
   * Auf einen Jahreswert hochgerechneter steuerfreier
   * Arbeitgeberzuschuss für eine private Krankenversicherung und für
   * eine private Pflegeversicherung in Euro, Cent (2 Dezimalstellen)
   */
  private PKPVAGZJ: number = 0;

  /**
   * Beitragssatz des Arbeitnehmers zur Pflegeversicherung
   * (6 Dezimalstellen)
   */
  private PVSATZAN: number = 0;

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
   * Zwischenfeld zu X für die Berechnung der Steuer nach § 39b
   * Absatz 2 Satz 7 EStG in Euro
   */
  private VERGL: number = 0;

  /**
   * Auf den Höchstbetrag begrenzte Beiträge zur
   * Arbeitslosenversicherung einschließlich Kranken- und
   * Pflegeversicherung in Euro, Cent (2 Dezimalstellen)
   */
  private VSPHB: number | undefined;

  /**
   * Vorsorgepauschale mit Teilbeträgen für die Rentenversicherung, die
   * gesetzliche Kranken- und soziale Pflegeversicherung nach fiktiven
   * Beträgen oder ggf. für die private Basiskrankenversicherung und
   * private Pflege-Pflichtversicherung sowie ggf. auf den Höchstbetrag
   * begrenzten Beiträgen zur Arbeitslosenversicherung in Euro, Cent
   * (2 Dezimalstellen)
   */
  private VSP: number = 0;

  /**
   * Vorsorgepauschale mit Teilbeträgen für die Rentenversicherung
   * sowie auf den Höchstbetrag begrenzten Teilbeträgen für die
   * Arbeitslosenversicherung, die gesetzliche Kranken- und soziale
   * Pflegeversicherung nach fiktiven Beträgen oder ggf. für die private
   * Basiskrankenversicherung und private Pflege-Pflichtversicherung in
   * Euro, Cent (2 Dezimalstellen)
   */
  private VSPN: number | undefined;

  /**
   * Teilbetrag für die Arbeitslosenversicherung bei der Berechnung der
   * Vorsorgepauschale in Euro, Cent (2 Dezimalstellen)
   */
  private VSPALV: number = 0;

  /**
   * Vorsorgepauschale mit Teilbeträgen für die gesetzliche Kranken-
   * und soziale Pflegeversicherung nach fiktiven Beträgen oder ggf. für
   * die private Basiskrankenversicherung und private Pflege-
   * Pflichtversicherung in Euro, Cent (2 Dezimalstellen)
   */
  private VSPKVPV: number = 0;

  /**
   * Teilbetrag für die Rentenversicherung bei der Berechnung der
   * Vorsorgepauschale in Euro, Cent (2 Dezimalstellen)
   */
  private VSPR: number = 0;

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
   * Zwischenfeld zu ZRE4VP für die Begrenzung auf die jeweilige
   * Beitragsbemessungsgrenze in Euro, Cent (2 Dezimalstellen)
   */
  private ZRE4VPR: number = 0;

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
    this.LST2026();
  }

  /**
   * 5. Programmablaufplan 2026
   * Steuerung
   *
   * Bemerkungen:
   * - vereinfacht da Lohnsteuer für mehrjährige nicht relevant ist
   * - vereinfacht da sonstige Einnahmen nicht relevant sind.
   */
  private LST2026(): void {
    this.MPARA();
    this.MRE4JL();

    // VBEZBSO = 0

    this.MRE4();
    this.MRE4ABZ();
    this.MBERECH();

    // Überspringe da nicht relevant:
    // MSONST()
  }

  /**
   * Zuweisung von Werten für bestimmte
   * Steuer- und Sozialversicherungsparameter.
   */
  private MPARA(): void {
    this.BBGRVALV = 101400;
    this.AVSATZAN = 0.013;
    this.RVSATZAN = 0.093;
    this.BBGKVPV = 69750;
    this.KVSATZAN = this.eingangsparameter.KVZ / 2 / 100 + 0.07;

    if (this.eingangsparameter.PVS === 1) {
      this.PVSATZAN = 0.023;
    } else {
      this.PVSATZAN = 0.018;
    }

    if (this.eingangsparameter.PVZ === 1) {
      this.PVSATZAN = this.PVSATZAN + 0.006;
    } else {
      this.PVSATZAN = this.PVSATZAN - this.eingangsparameter.PVA * 0.0025;
    }

    this.W1STKL5 = 14071;
    this.W2STKL5 = 34939;
    this.W3STKL5 = 222260;
    this.GFB = 12348;
    this.SOLZFREI = 20350;
  }

  /**
   * Ermittlung des Jahresarbeitslohns nach
   * § 39b Absatz 2 Satz 2 EStG
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
   * Ermittlung der Freibeträge nach § 39b
   * Absatz 2 Satz 3 EStG
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
   * Abzug der Freibeträge nach § 39b Absatz 2
   * Satz 3 und 4 EStG vom Jahresarbeitslohn
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

    this.ZVBEZ = this.ZVBEZJ - this.FVB;

    if (this.ZVBEZ < 0) {
      this.ZVBEZ = 0;
    }
  }

  /**
   * Ermittlung der Jahreslohnsteuer auf laufende Bezüge
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
   * Ermittlung der festen Tabellenfreibeträge
   * (ohne Vorsorgepauschale)
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
        if (this.ZRE4 - this.ZVBEZ < 1230) {
          this.ANP = aufDenEuroAufrunden(this.ANP + this.ZRE4 - this.ZVBEZ);
        } else {
          this.ANP = this.ANP + 1230;
        }
      }
    }

    this.KZTAB = 1;

    if (this.eingangsparameter.STKL === 1) {
      this.SAP = 36;
      this.KFB = this.eingangsparameter.ZKF * 9756;
    } else if (this.eingangsparameter.STKL === 2) {
      this.EFA = 4260;
      this.SAP = 36;
      this.KFB = this.eingangsparameter.ZKF * 9756;
    } else if (this.eingangsparameter.STKL === 3) {
      this.KZTAB = 2;
      this.SAP = 36;
      this.KFB = this.eingangsparameter.ZKF * 9756;
    } else if (this.eingangsparameter.STKL === 4) {
      this.SAP = 36;
      this.KFB = this.eingangsparameter.ZKF * 4878;
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

    this.ZVE = this.ZRE4 - this.ZTABFB - this.VSP;

    this.UPMLST();
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
      this.UPTAB26();
    } else {
      this.MST5_6();
    }
  }

  /**
   * Vorsorgepauschale
   * (§ 39b Absatz 2 Satz 5 Nummer 3 EStG)
   */
  private UPEVP(): void {
    if (this.eingangsparameter.KRV === 1) {
      this.VSPR = 0;
    } else {
      if (this.ZRE4VP > this.BBGRVALV) {
        this.ZRE4VPR = this.BBGRVALV;
      } else {
        this.ZRE4VPR = this.ZRE4VP;
      }

      this.VSPR = this.ZRE4VPR * this.RVSATZAN;
    }

    this.MVSPKVPV();

    if (this.eingangsparameter.ALV === 1) {
      //
    } else {
      if (this.eingangsparameter.STKL === 6) {
        //
      } else {
        this.MVSPHB();
      }
    }
  }

  /**
   * Vorsorgepauschale
   * (§ 39b Absatz 2 Satz 5 Nummer 3 EStG)
   * Vergleichsberechnung zur
   * Mindestvorsorgepauschale
   */
  private MVSPKVPV(): void {
    if (this.ZRE4VP > this.BBGKVPV) {
      this.ZRE4VPR = this.BBGKVPV;
    } else {
      this.ZRE4VPR = this.ZRE4VP;
    }

    if (this.eingangsparameter.PKV > 0) {
      if (this.eingangsparameter.STKL === 6) {
        this.VSPKVPV = 0;
      } else {
        this.PKPVAGZJ = (this.eingangsparameter.PKPVAGZ * 12) / 100;
        this.VSPKVPV = (this.eingangsparameter.PKPV * 12) / 100;
        this.VSPKVPV = this.VSPKVPV - this.PKPVAGZJ;

        if (this.VSPKVPV < 0) {
          this.VSPKVPV = 0;
        }
      }
    } else {
      this.VSPKVPV = aufDenCentAbrunden(
        this.ZRE4VPR * (this.KVSATZAN + this.PVSATZAN),
      );
    }

    this.VSP = aufDenEuroAufrunden(this.VSPKVPV + this.VSPR);
  }

  /**
   * Höchstbetragsberechnung zur
   * Arbeitslosenversicherung
   * (§ 39b Absatz 2 Satz 5 Nummer 3 Buchstabe e EStG)
   */
  private MVSPHB(): void {
    if (this.ZRE4VP > this.BBGRVALV) {
      this.ZRE4VPR = this.BBGRVALV;
    } else {
      this.ZRE4VPR = this.ZRE4VP;
    }

    this.VSPALV = aufDenCentAbrunden(this.AVSATZAN * this.ZRE4VPR);

    this.VSPHB = aufDenCentAbrunden(this.VSPALV + this.VSPKVPV);

    if (this.VSPHB > 1900) {
      this.VSPHB = 1900;
    }

    this.VSPN = aufDenEuroAufrunden(this.VSPR + this.VSPHB);

    if (this.VSPN > this.VSP) {
      this.VSP = this.VSPN;
    }
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
    this.X = aufDenEuroAbrunden(this.ZX * 1.25);
    this.UPTAB26();
    this.ST1 = this.ST;
    this.X = aufDenEuroAbrunden(this.ZX * 0.75);
    this.UPTAB26();
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
  private UPTAB26(): void {
    if (this.X < this.GFB + 1) {
      this.ST = 0;
    }
    //
    else if (this.X < 17800) {
      this.Y = (this.X - this.GFB) / 10000;
      this.RW = this.Y * 914.51;
      this.RW = this.RW + 1400;
      this.ST = aufDenEuroAbrunden(this.RW * this.Y);
    }
    //
    else if (this.X < 69879) {
      this.Y = (this.X - 17799) / 10000;
      this.RW = this.Y * 173.1;
      this.RW = this.RW + 2397;
      this.RW = this.RW * this.Y;
      this.ST = aufDenEuroAbrunden(this.RW + 1034.87);
    }
    //
    else if (this.X < 277826) {
      this.ST = aufDenEuroAbrunden(this.X * 0.42 - 11135.63);
    }
    //
    else {
      this.ST = aufDenEuroAbrunden(this.X * 0.45 - 19470.38);
    }

    this.ST = this.ST * this.KZTAB;
  }
}

if (import.meta.vitest) {
  const { describe, test, expect } = import.meta.vitest;

  // Tests are based on the Prüftabelle in the attachments of the Programmablaufplan.

  // Tip: One strategy to transfer the data is to copy the table into a new file, bring
  // it into a structure well suited for multiline editing, split the editor view so the
  // data is next to the test implementation and then use multicursor to copy it block by
  // block.

  describe("Programmablaufplan 2026", () => {
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
      { jahreslohn: 5000, steuerklasse: 5, jahreslohnsteuer: 372 },
      { jahreslohn: 5000, steuerklasse: 6, jahreslohnsteuer: 558 },
      // Zeile 2
      { jahreslohn: 7500, steuerklasse: 1, jahreslohnsteuer: 0 },
      { jahreslohn: 7500, steuerklasse: 2, jahreslohnsteuer: 0 },
      { jahreslohn: 7500, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 7500, steuerklasse: 4, jahreslohnsteuer: 0 },
      { jahreslohn: 7500, steuerklasse: 5, jahreslohnsteuer: 647 },
      { jahreslohn: 7500, steuerklasse: 6, jahreslohnsteuer: 838 },
      // Zeile 3
      { jahreslohn: 10000, steuerklasse: 1, jahreslohnsteuer: 0 },
      { jahreslohn: 10000, steuerklasse: 2, jahreslohnsteuer: 0 },
      { jahreslohn: 10000, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 10000, steuerklasse: 4, jahreslohnsteuer: 0 },
      { jahreslohn: 10000, steuerklasse: 5, jahreslohnsteuer: 922 },
      { jahreslohn: 10000, steuerklasse: 6, jahreslohnsteuer: 1117 },
      // Zeile 4
      { jahreslohn: 12500, steuerklasse: 1, jahreslohnsteuer: 0 },
      { jahreslohn: 12500, steuerklasse: 2, jahreslohnsteuer: 0 },
      { jahreslohn: 12500, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 12500, steuerklasse: 4, jahreslohnsteuer: 0 },
      { jahreslohn: 12500, steuerklasse: 5, jahreslohnsteuer: 1197 },
      { jahreslohn: 12500, steuerklasse: 6, jahreslohnsteuer: 1397 },
      // Zeile 5
      { jahreslohn: 15000, steuerklasse: 1, jahreslohnsteuer: 0 },
      { jahreslohn: 15000, steuerklasse: 2, jahreslohnsteuer: 0 },
      { jahreslohn: 15000, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 15000, steuerklasse: 4, jahreslohnsteuer: 0 },
      { jahreslohn: 15000, steuerklasse: 5, jahreslohnsteuer: 1472 },
      { jahreslohn: 15000, steuerklasse: 6, jahreslohnsteuer: 1676 },
      // Zeile 6
      { jahreslohn: 17500, steuerklasse: 1, jahreslohnsteuer: 51 },
      { jahreslohn: 17500, steuerklasse: 2, jahreslohnsteuer: 0 },
      { jahreslohn: 17500, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 17500, steuerklasse: 4, jahreslohnsteuer: 51 },
      { jahreslohn: 17500, steuerklasse: 5, jahreslohnsteuer: 1778 },
      { jahreslohn: 17500, steuerklasse: 6, jahreslohnsteuer: 1956 },
      // Zeile 7
      { jahreslohn: 20000, steuerklasse: 1, jahreslohnsteuer: 380 },
      { jahreslohn: 20000, steuerklasse: 2, jahreslohnsteuer: 0 },
      { jahreslohn: 20000, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 20000, steuerklasse: 4, jahreslohnsteuer: 380 },
      { jahreslohn: 20000, steuerklasse: 5, jahreslohnsteuer: 2234 },
      { jahreslohn: 20000, steuerklasse: 6, jahreslohnsteuer: 2766 },
      // Zeile 8
      { jahreslohn: 22500, steuerklasse: 1, jahreslohnsteuer: 782 },
      { jahreslohn: 22500, steuerklasse: 2, jahreslohnsteuer: 32 },
      { jahreslohn: 22500, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 22500, steuerklasse: 4, jahreslohnsteuer: 782 },
      { jahreslohn: 22500, steuerklasse: 5, jahreslohnsteuer: 3073 },
      { jahreslohn: 22500, steuerklasse: 6, jahreslohnsteuer: 3604 },
      // Zeile 9
      { jahreslohn: 25000, steuerklasse: 1, jahreslohnsteuer: 1251 },
      { jahreslohn: 25000, steuerklasse: 2, jahreslohnsteuer: 359 },
      { jahreslohn: 25000, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 25000, steuerklasse: 4, jahreslohnsteuer: 1251 },
      { jahreslohn: 25000, steuerklasse: 5, jahreslohnsteuer: 3911 },
      { jahreslohn: 25000, steuerklasse: 6, jahreslohnsteuer: 4443 },
      // Zeile 10
      { jahreslohn: 27500, steuerklasse: 1, jahreslohnsteuer: 1742 },
      { jahreslohn: 27500, steuerklasse: 2, jahreslohnsteuer: 759 },
      { jahreslohn: 27500, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 27500, steuerklasse: 4, jahreslohnsteuer: 1742 },
      { jahreslohn: 27500, steuerklasse: 5, jahreslohnsteuer: 4749 },
      { jahreslohn: 27500, steuerklasse: 6, jahreslohnsteuer: 5281 },
      // Zeile 11
      { jahreslohn: 30000, steuerklasse: 1, jahreslohnsteuer: 2248 },
      { jahreslohn: 30000, steuerklasse: 2, jahreslohnsteuer: 1230 },
      { jahreslohn: 30000, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 30000, steuerklasse: 4, jahreslohnsteuer: 2248 },
      { jahreslohn: 30000, steuerklasse: 5, jahreslohnsteuer: 5588 },
      { jahreslohn: 30000, steuerklasse: 6, jahreslohnsteuer: 6120 },
      // Zeile 12
      { jahreslohn: 32500, steuerklasse: 1, jahreslohnsteuer: 2767 },
      { jahreslohn: 32500, steuerklasse: 2, jahreslohnsteuer: 1724 },
      { jahreslohn: 32500, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 32500, steuerklasse: 4, jahreslohnsteuer: 2767 },
      { jahreslohn: 32500, steuerklasse: 5, jahreslohnsteuer: 6426 },
      { jahreslohn: 32500, steuerklasse: 6, jahreslohnsteuer: 6952 },
      // Zeile 13
      { jahreslohn: 35000, steuerklasse: 1, jahreslohnsteuer: 3300 },
      { jahreslohn: 35000, steuerklasse: 2, jahreslohnsteuer: 2233 },
      { jahreslohn: 35000, steuerklasse: 3, jahreslohnsteuer: 294 },
      { jahreslohn: 35000, steuerklasse: 4, jahreslohnsteuer: 3300 },
      { jahreslohn: 35000, steuerklasse: 5, jahreslohnsteuer: 7216 },
      { jahreslohn: 35000, steuerklasse: 6, jahreslohnsteuer: 7682 },
      // Zeile 14
      { jahreslohn: 37500, steuerklasse: 1, jahreslohnsteuer: 3847 },
      { jahreslohn: 37500, steuerklasse: 2, jahreslohnsteuer: 2756 },
      { jahreslohn: 37500, steuerklasse: 3, jahreslohnsteuer: 628 },
      { jahreslohn: 37500, steuerklasse: 4, jahreslohnsteuer: 3847 },
      { jahreslohn: 37500, steuerklasse: 5, jahreslohnsteuer: 7954 },
      { jahreslohn: 37500, steuerklasse: 6, jahreslohnsteuer: 8436 },
      // Zeile 15
      { jahreslohn: 40000, steuerklasse: 1, jahreslohnsteuer: 4407 },
      { jahreslohn: 40000, steuerklasse: 2, jahreslohnsteuer: 3293 },
      { jahreslohn: 40000, steuerklasse: 3, jahreslohnsteuer: 1000 },
      { jahreslohn: 40000, steuerklasse: 4, jahreslohnsteuer: 4407 },
      { jahreslohn: 40000, steuerklasse: 5, jahreslohnsteuer: 8720 },
      { jahreslohn: 40000, steuerklasse: 6, jahreslohnsteuer: 9218 },
      // Zeile 16
      { jahreslohn: 42500, steuerklasse: 1, jahreslohnsteuer: 4982 },
      { jahreslohn: 42500, steuerklasse: 2, jahreslohnsteuer: 3843 },
      { jahreslohn: 42500, steuerklasse: 3, jahreslohnsteuer: 1406 },
      { jahreslohn: 42500, steuerklasse: 4, jahreslohnsteuer: 4982 },
      { jahreslohn: 42500, steuerklasse: 5, jahreslohnsteuer: 9512 },
      { jahreslohn: 42500, steuerklasse: 6, jahreslohnsteuer: 10030 },
      // Zeile 17
      { jahreslohn: 45000, steuerklasse: 1, jahreslohnsteuer: 5570 },
      { jahreslohn: 45000, steuerklasse: 2, jahreslohnsteuer: 4408 },
      { jahreslohn: 45000, steuerklasse: 3, jahreslohnsteuer: 1850 },
      { jahreslohn: 45000, steuerklasse: 4, jahreslohnsteuer: 5570 },
      { jahreslohn: 45000, steuerklasse: 5, jahreslohnsteuer: 10334 },
      { jahreslohn: 45000, steuerklasse: 6, jahreslohnsteuer: 10865 },
      // Zeile 18
      { jahreslohn: 47500, steuerklasse: 1, jahreslohnsteuer: 6172 },
      { jahreslohn: 47500, steuerklasse: 2, jahreslohnsteuer: 4987 },
      { jahreslohn: 47500, steuerklasse: 3, jahreslohnsteuer: 2324 },
      { jahreslohn: 47500, steuerklasse: 4, jahreslohnsteuer: 6172 },
      { jahreslohn: 47500, steuerklasse: 5, jahreslohnsteuer: 11171 },
      { jahreslohn: 47500, steuerklasse: 6, jahreslohnsteuer: 11703 },
      // Zeile 19
      { jahreslohn: 50000, steuerklasse: 1, jahreslohnsteuer: 6788 },
      { jahreslohn: 50000, steuerklasse: 2, jahreslohnsteuer: 5580 },
      { jahreslohn: 50000, steuerklasse: 3, jahreslohnsteuer: 2810 },
      { jahreslohn: 50000, steuerklasse: 4, jahreslohnsteuer: 6788 },
      { jahreslohn: 50000, steuerklasse: 5, jahreslohnsteuer: 12010 },
      { jahreslohn: 50000, steuerklasse: 6, jahreslohnsteuer: 12542 },
      // Zeile 20
      { jahreslohn: 52500, steuerklasse: 1, jahreslohnsteuer: 7417 },
      { jahreslohn: 52500, steuerklasse: 2, jahreslohnsteuer: 6186 },
      { jahreslohn: 52500, steuerklasse: 3, jahreslohnsteuer: 3302 },
      { jahreslohn: 52500, steuerklasse: 4, jahreslohnsteuer: 7417 },
      { jahreslohn: 52500, steuerklasse: 5, jahreslohnsteuer: 12848 },
      { jahreslohn: 52500, steuerklasse: 6, jahreslohnsteuer: 13380 },
      // Zeile 21
      { jahreslohn: 55000, steuerklasse: 1, jahreslohnsteuer: 8060 },
      { jahreslohn: 55000, steuerklasse: 2, jahreslohnsteuer: 6807 },
      { jahreslohn: 55000, steuerklasse: 3, jahreslohnsteuer: 3802 },
      { jahreslohn: 55000, steuerklasse: 4, jahreslohnsteuer: 8060 },
      { jahreslohn: 55000, steuerklasse: 5, jahreslohnsteuer: 13687 },
      { jahreslohn: 55000, steuerklasse: 6, jahreslohnsteuer: 14218 },
      // Zeile 22
      { jahreslohn: 57500, steuerklasse: 1, jahreslohnsteuer: 8718 },
      { jahreslohn: 57500, steuerklasse: 2, jahreslohnsteuer: 7442 },
      { jahreslohn: 57500, steuerklasse: 3, jahreslohnsteuer: 4308 },
      { jahreslohn: 57500, steuerklasse: 4, jahreslohnsteuer: 8718 },
      { jahreslohn: 57500, steuerklasse: 5, jahreslohnsteuer: 14525 },
      { jahreslohn: 57500, steuerklasse: 6, jahreslohnsteuer: 15057 },
      // Zeile 23
      { jahreslohn: 60000, steuerklasse: 1, jahreslohnsteuer: 9389 },
      { jahreslohn: 60000, steuerklasse: 2, jahreslohnsteuer: 8091 },
      { jahreslohn: 60000, steuerklasse: 3, jahreslohnsteuer: 4822 },
      { jahreslohn: 60000, steuerklasse: 4, jahreslohnsteuer: 9389 },
      { jahreslohn: 60000, steuerklasse: 5, jahreslohnsteuer: 15364 },
      { jahreslohn: 60000, steuerklasse: 6, jahreslohnsteuer: 15895 },
      // Zeile 24
      { jahreslohn: 62500, steuerklasse: 1, jahreslohnsteuer: 10073 },
      { jahreslohn: 62500, steuerklasse: 2, jahreslohnsteuer: 8754 },
      { jahreslohn: 62500, steuerklasse: 3, jahreslohnsteuer: 5342 },
      { jahreslohn: 62500, steuerklasse: 4, jahreslohnsteuer: 10073 },
      { jahreslohn: 62500, steuerklasse: 5, jahreslohnsteuer: 16202 },
      { jahreslohn: 62500, steuerklasse: 6, jahreslohnsteuer: 16734 },
      // Zeile 25
      { jahreslohn: 65000, steuerklasse: 1, jahreslohnsteuer: 10772 },
      { jahreslohn: 65000, steuerklasse: 2, jahreslohnsteuer: 9430 },
      { jahreslohn: 65000, steuerklasse: 3, jahreslohnsteuer: 5870 },
      { jahreslohn: 65000, steuerklasse: 4, jahreslohnsteuer: 10772 },
      { jahreslohn: 65000, steuerklasse: 5, jahreslohnsteuer: 17040 },
      { jahreslohn: 65000, steuerklasse: 6, jahreslohnsteuer: 17572 },
      // Zeile 26
      { jahreslohn: 67500, steuerklasse: 1, jahreslohnsteuer: 11484 },
      { jahreslohn: 67500, steuerklasse: 2, jahreslohnsteuer: 10121 },
      { jahreslohn: 67500, steuerklasse: 3, jahreslohnsteuer: 6402 },
      { jahreslohn: 67500, steuerklasse: 4, jahreslohnsteuer: 11484 },
      { jahreslohn: 67500, steuerklasse: 5, jahreslohnsteuer: 17879 },
      { jahreslohn: 67500, steuerklasse: 6, jahreslohnsteuer: 18410 },
      // Zeile 27
      { jahreslohn: 70000, steuerklasse: 1, jahreslohnsteuer: 12220 },
      { jahreslohn: 70000, steuerklasse: 2, jahreslohnsteuer: 10835 },
      { jahreslohn: 70000, steuerklasse: 3, jahreslohnsteuer: 6952 },
      { jahreslohn: 70000, steuerklasse: 4, jahreslohnsteuer: 12220 },
      { jahreslohn: 70000, steuerklasse: 5, jahreslohnsteuer: 18729 },
      { jahreslohn: 70000, steuerklasse: 6, jahreslohnsteuer: 19260 },
      // Zeile 28
      { jahreslohn: 72500, steuerklasse: 1, jahreslohnsteuer: 13062 },
      { jahreslohn: 72500, steuerklasse: 2, jahreslohnsteuer: 11647 },
      { jahreslohn: 72500, steuerklasse: 3, jahreslohnsteuer: 7574 },
      { jahreslohn: 72500, steuerklasse: 4, jahreslohnsteuer: 13062 },
      { jahreslohn: 72500, steuerklasse: 5, jahreslohnsteuer: 19681 },
      { jahreslohn: 72500, steuerklasse: 6, jahreslohnsteuer: 20213 },
      // Zeile 29
      { jahreslohn: 75000, steuerklasse: 1, jahreslohnsteuer: 13922 },
      { jahreslohn: 75000, steuerklasse: 2, jahreslohnsteuer: 12476 },
      { jahreslohn: 75000, steuerklasse: 3, jahreslohnsteuer: 8206 },
      { jahreslohn: 75000, steuerklasse: 4, jahreslohnsteuer: 13922 },
      { jahreslohn: 75000, steuerklasse: 5, jahreslohnsteuer: 20633 },
      { jahreslohn: 75000, steuerklasse: 6, jahreslohnsteuer: 21165 },
      // Zeile 30
      { jahreslohn: 77500, steuerklasse: 1, jahreslohnsteuer: 14799 },
      { jahreslohn: 77500, steuerklasse: 2, jahreslohnsteuer: 13323 },
      { jahreslohn: 77500, steuerklasse: 3, jahreslohnsteuer: 8846 },
      { jahreslohn: 77500, steuerklasse: 4, jahreslohnsteuer: 14799 },
      { jahreslohn: 77500, steuerklasse: 5, jahreslohnsteuer: 21585 },
      { jahreslohn: 77500, steuerklasse: 6, jahreslohnsteuer: 22117 },
      // Zeile 31
      { jahreslohn: 80000, steuerklasse: 1, jahreslohnsteuer: 15694 },
      { jahreslohn: 80000, steuerklasse: 2, jahreslohnsteuer: 14188 },
      { jahreslohn: 80000, steuerklasse: 3, jahreslohnsteuer: 9496 },
      { jahreslohn: 80000, steuerklasse: 4, jahreslohnsteuer: 15694 },
      { jahreslohn: 80000, steuerklasse: 5, jahreslohnsteuer: 22538 },
      { jahreslohn: 80000, steuerklasse: 6, jahreslohnsteuer: 23070 },
      // Zeile 32
      { jahreslohn: 82500, steuerklasse: 1, jahreslohnsteuer: 16607 },
      { jahreslohn: 82500, steuerklasse: 2, jahreslohnsteuer: 15071 },
      { jahreslohn: 82500, steuerklasse: 3, jahreslohnsteuer: 10154 },
      { jahreslohn: 82500, steuerklasse: 4, jahreslohnsteuer: 16607 },
      { jahreslohn: 82500, steuerklasse: 5, jahreslohnsteuer: 23490 },
      { jahreslohn: 82500, steuerklasse: 6, jahreslohnsteuer: 24022 },
      // Zeile 33
      { jahreslohn: 85000, steuerklasse: 1, jahreslohnsteuer: 17538 },
      { jahreslohn: 85000, steuerklasse: 2, jahreslohnsteuer: 15971 },
      { jahreslohn: 85000, steuerklasse: 3, jahreslohnsteuer: 10822 },
      { jahreslohn: 85000, steuerklasse: 4, jahreslohnsteuer: 17538 },
      { jahreslohn: 85000, steuerklasse: 5, jahreslohnsteuer: 24443 },
      { jahreslohn: 85000, steuerklasse: 6, jahreslohnsteuer: 24974 },
      // Zeile 34
      { jahreslohn: 87500, steuerklasse: 1, jahreslohnsteuer: 18486 },
      { jahreslohn: 87500, steuerklasse: 2, jahreslohnsteuer: 16890 },
      { jahreslohn: 87500, steuerklasse: 3, jahreslohnsteuer: 11498 },
      { jahreslohn: 87500, steuerklasse: 4, jahreslohnsteuer: 18486 },
      { jahreslohn: 87500, steuerklasse: 5, jahreslohnsteuer: 25395 },
      { jahreslohn: 87500, steuerklasse: 6, jahreslohnsteuer: 25927 },
      // Zeile 35
      { jahreslohn: 90000, steuerklasse: 1, jahreslohnsteuer: 19438 },
      { jahreslohn: 90000, steuerklasse: 2, jahreslohnsteuer: 17826 },
      { jahreslohn: 90000, steuerklasse: 3, jahreslohnsteuer: 12182 },
      { jahreslohn: 90000, steuerklasse: 4, jahreslohnsteuer: 19438 },
      { jahreslohn: 90000, steuerklasse: 5, jahreslohnsteuer: 26347 },
      { jahreslohn: 90000, steuerklasse: 6, jahreslohnsteuer: 26879 },
      // Zeile 36
      { jahreslohn: 92500, steuerklasse: 1, jahreslohnsteuer: 20390 },
      { jahreslohn: 92500, steuerklasse: 2, jahreslohnsteuer: 18777 },
      { jahreslohn: 92500, steuerklasse: 3, jahreslohnsteuer: 12876 },
      { jahreslohn: 92500, steuerklasse: 4, jahreslohnsteuer: 20390 },
      { jahreslohn: 92500, steuerklasse: 5, jahreslohnsteuer: 27300 },
      { jahreslohn: 92500, steuerklasse: 6, jahreslohnsteuer: 27831 },
      // Zeile 37
      { jahreslohn: 95000, steuerklasse: 1, jahreslohnsteuer: 21343 },
      { jahreslohn: 95000, steuerklasse: 2, jahreslohnsteuer: 19729 },
      { jahreslohn: 95000, steuerklasse: 3, jahreslohnsteuer: 13580 },
      { jahreslohn: 95000, steuerklasse: 4, jahreslohnsteuer: 21343 },
      { jahreslohn: 95000, steuerklasse: 5, jahreslohnsteuer: 28252 },
      { jahreslohn: 95000, steuerklasse: 6, jahreslohnsteuer: 28784 },
      // Zeile 38
      { jahreslohn: 97500, steuerklasse: 1, jahreslohnsteuer: 22295 },
      { jahreslohn: 97500, steuerklasse: 2, jahreslohnsteuer: 20682 },
      { jahreslohn: 97500, steuerklasse: 3, jahreslohnsteuer: 14292 },
      { jahreslohn: 97500, steuerklasse: 4, jahreslohnsteuer: 22295 },
      { jahreslohn: 97500, steuerklasse: 5, jahreslohnsteuer: 29204 },
      { jahreslohn: 97500, steuerklasse: 6, jahreslohnsteuer: 29736 },
      // Zeile 39
      { jahreslohn: 100000, steuerklasse: 1, jahreslohnsteuer: 23248 },
      { jahreslohn: 100000, steuerklasse: 2, jahreslohnsteuer: 21634 },
      { jahreslohn: 100000, steuerklasse: 3, jahreslohnsteuer: 15012 },
      { jahreslohn: 100000, steuerklasse: 4, jahreslohnsteuer: 23248 },
      { jahreslohn: 100000, steuerklasse: 5, jahreslohnsteuer: 30157 },
      { jahreslohn: 100000, steuerklasse: 6, jahreslohnsteuer: 30689 },
      // Zeile 40
      { jahreslohn: 102500, steuerklasse: 1, jahreslohnsteuer: 24243 },
      { jahreslohn: 102500, steuerklasse: 2, jahreslohnsteuer: 22629 },
      { jahreslohn: 102500, steuerklasse: 3, jahreslohnsteuer: 15774 },
      { jahreslohn: 102500, steuerklasse: 4, jahreslohnsteuer: 24243 },
      { jahreslohn: 102500, steuerklasse: 5, jahreslohnsteuer: 31152 },
      { jahreslohn: 102500, steuerklasse: 6, jahreslohnsteuer: 31684 },
      // Zeile 41
      { jahreslohn: 105000, steuerklasse: 1, jahreslohnsteuer: 25293 },
      { jahreslohn: 105000, steuerklasse: 2, jahreslohnsteuer: 23679 },
      { jahreslohn: 105000, steuerklasse: 3, jahreslohnsteuer: 16590 },
      { jahreslohn: 105000, steuerklasse: 4, jahreslohnsteuer: 25293 },
      { jahreslohn: 105000, steuerklasse: 5, jahreslohnsteuer: 32202 },
      { jahreslohn: 105000, steuerklasse: 6, jahreslohnsteuer: 32734 },
      // Zeile 42
      { jahreslohn: 107500, steuerklasse: 1, jahreslohnsteuer: 26343 },
      { jahreslohn: 107500, steuerklasse: 2, jahreslohnsteuer: 24729 },
      { jahreslohn: 107500, steuerklasse: 3, jahreslohnsteuer: 17416 },
      { jahreslohn: 107500, steuerklasse: 4, jahreslohnsteuer: 26343 },
      { jahreslohn: 107500, steuerklasse: 5, jahreslohnsteuer: 33252 },
      { jahreslohn: 107500, steuerklasse: 6, jahreslohnsteuer: 33784 },
      // Zeile 43
      { jahreslohn: 110000, steuerklasse: 1, jahreslohnsteuer: 27393 },
      { jahreslohn: 110000, steuerklasse: 2, jahreslohnsteuer: 25779 },
      { jahreslohn: 110000, steuerklasse: 3, jahreslohnsteuer: 18252 },
      { jahreslohn: 110000, steuerklasse: 4, jahreslohnsteuer: 27393 },
      { jahreslohn: 110000, steuerklasse: 5, jahreslohnsteuer: 34302 },
      { jahreslohn: 110000, steuerklasse: 6, jahreslohnsteuer: 34834 },
    ])(
      "Allgemeine Prüftabelle - Jahreslohn: '$jahreslohn' Euro; Steuerklasse: '$steuerklasse';",
      ({ jahreslohn, steuerklasse, jahreslohnsteuer }) => {
        const programm = new PAP_2026({
          AF: 0,
          F: 0,
          KRV: 0,
          KVZ: 2.9,
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
          ALV: 0,
          PKPVAGZ: 0,
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
      { jahreslohn: 5000, steuerklasse: 5, jahreslohnsteuer: 18 },
      { jahreslohn: 5000, steuerklasse: 6, jahreslohnsteuer: 700 },
      // Zeile 2
      { jahreslohn: 7500, steuerklasse: 1, jahreslohnsteuer: 0 },
      { jahreslohn: 7500, steuerklasse: 2, jahreslohnsteuer: 0 },
      { jahreslohn: 7500, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 7500, steuerklasse: 4, jahreslohnsteuer: 0 },
      { jahreslohn: 7500, steuerklasse: 5, jahreslohnsteuer: 368 },
      { jahreslohn: 7500, steuerklasse: 6, jahreslohnsteuer: 1050 },
      // Zeile 3
      { jahreslohn: 10000, steuerklasse: 1, jahreslohnsteuer: 0 },
      { jahreslohn: 10000, steuerklasse: 2, jahreslohnsteuer: 0 },
      { jahreslohn: 10000, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 10000, steuerklasse: 4, jahreslohnsteuer: 0 },
      { jahreslohn: 10000, steuerklasse: 5, jahreslohnsteuer: 718 },
      { jahreslohn: 10000, steuerklasse: 6, jahreslohnsteuer: 1400 },
      // Zeile 4
      { jahreslohn: 12500, steuerklasse: 1, jahreslohnsteuer: 0 },
      { jahreslohn: 12500, steuerklasse: 2, jahreslohnsteuer: 0 },
      { jahreslohn: 12500, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 12500, steuerklasse: 4, jahreslohnsteuer: 0 },
      { jahreslohn: 12500, steuerklasse: 5, jahreslohnsteuer: 1068 },
      { jahreslohn: 12500, steuerklasse: 6, jahreslohnsteuer: 1750 },
      // Zeile 5
      { jahreslohn: 15000, steuerklasse: 1, jahreslohnsteuer: 0 },
      { jahreslohn: 15000, steuerklasse: 2, jahreslohnsteuer: 0 },
      { jahreslohn: 15000, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 15000, steuerklasse: 4, jahreslohnsteuer: 0 },
      { jahreslohn: 15000, steuerklasse: 5, jahreslohnsteuer: 1418 },
      { jahreslohn: 15000, steuerklasse: 6, jahreslohnsteuer: 2359 },
      // Zeile 6
      { jahreslohn: 17500, steuerklasse: 1, jahreslohnsteuer: 40 },
      { jahreslohn: 17500, steuerklasse: 2, jahreslohnsteuer: 0 },
      { jahreslohn: 17500, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 17500, steuerklasse: 4, jahreslohnsteuer: 40 },
      { jahreslohn: 17500, steuerklasse: 5, jahreslohnsteuer: 1768 },
      { jahreslohn: 17500, steuerklasse: 6, jahreslohnsteuer: 3409 },
      // Zeile 7
      { jahreslohn: 20000, steuerklasse: 1, jahreslohnsteuer: 461 },
      { jahreslohn: 20000, steuerklasse: 2, jahreslohnsteuer: 0 },
      { jahreslohn: 20000, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 20000, steuerklasse: 4, jahreslohnsteuer: 461 },
      { jahreslohn: 20000, steuerklasse: 5, jahreslohnsteuer: 2415 },
      { jahreslohn: 20000, steuerklasse: 6, jahreslohnsteuer: 4459 },
      // Zeile 8
      { jahreslohn: 22500, steuerklasse: 1, jahreslohnsteuer: 995 },
      { jahreslohn: 22500, steuerklasse: 2, jahreslohnsteuer: 153 },
      { jahreslohn: 22500, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 22500, steuerklasse: 4, jahreslohnsteuer: 995 },
      { jahreslohn: 22500, steuerklasse: 5, jahreslohnsteuer: 3465 },
      { jahreslohn: 22500, steuerklasse: 6, jahreslohnsteuer: 5509 },
      // Zeile 9
      { jahreslohn: 25000, steuerklasse: 1, jahreslohnsteuer: 1604 },
      { jahreslohn: 25000, steuerklasse: 2, jahreslohnsteuer: 607 },
      { jahreslohn: 25000, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 25000, steuerklasse: 4, jahreslohnsteuer: 1604 },
      { jahreslohn: 25000, steuerklasse: 5, jahreslohnsteuer: 4515 },
      { jahreslohn: 25000, steuerklasse: 6, jahreslohnsteuer: 6559 },
      // Zeile 10
      { jahreslohn: 27500, steuerklasse: 1, jahreslohnsteuer: 2234 },
      { jahreslohn: 27500, steuerklasse: 2, jahreslohnsteuer: 1173 },
      { jahreslohn: 27500, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 27500, steuerklasse: 4, jahreslohnsteuer: 2234 },
      { jahreslohn: 27500, steuerklasse: 5, jahreslohnsteuer: 5565 },
      { jahreslohn: 27500, steuerklasse: 6, jahreslohnsteuer: 7514 },
      // Zeile 11
      { jahreslohn: 30000, steuerklasse: 1, jahreslohnsteuer: 2886 },
      { jahreslohn: 30000, steuerklasse: 2, jahreslohnsteuer: 1788 },
      { jahreslohn: 30000, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 30000, steuerklasse: 4, jahreslohnsteuer: 2886 },
      { jahreslohn: 30000, steuerklasse: 5, jahreslohnsteuer: 6615 },
      { jahreslohn: 30000, steuerklasse: 6, jahreslohnsteuer: 8460 },
      // Zeile 12
      { jahreslohn: 32500, steuerklasse: 1, jahreslohnsteuer: 3559 },
      { jahreslohn: 32500, steuerklasse: 2, jahreslohnsteuer: 2424 },
      { jahreslohn: 32500, steuerklasse: 3, jahreslohnsteuer: 76 },
      { jahreslohn: 32500, steuerklasse: 4, jahreslohnsteuer: 3559 },
      { jahreslohn: 32500, steuerklasse: 5, jahreslohnsteuer: 7564 },
      { jahreslohn: 32500, steuerklasse: 6, jahreslohnsteuer: 9446 },
      // Zeile 13
      { jahreslohn: 35000, steuerklasse: 1, jahreslohnsteuer: 4254 },
      { jahreslohn: 35000, steuerklasse: 2, jahreslohnsteuer: 3083 },
      { jahreslohn: 35000, steuerklasse: 3, jahreslohnsteuer: 466 },
      { jahreslohn: 35000, steuerklasse: 4, jahreslohnsteuer: 4254 },
      { jahreslohn: 35000, steuerklasse: 5, jahreslohnsteuer: 8510 },
      { jahreslohn: 35000, steuerklasse: 6, jahreslohnsteuer: 10473 },
      // Zeile 14
      { jahreslohn: 37500, steuerklasse: 1, jahreslohnsteuer: 4971 },
      { jahreslohn: 37500, steuerklasse: 2, jahreslohnsteuer: 3763 },
      { jahreslohn: 37500, steuerklasse: 3, jahreslohnsteuer: 914 },
      { jahreslohn: 37500, steuerklasse: 4, jahreslohnsteuer: 4971 },
      { jahreslohn: 37500, steuerklasse: 5, jahreslohnsteuer: 9498 },
      { jahreslohn: 37500, steuerklasse: 6, jahreslohnsteuer: 11523 },
      // Zeile 15
      { jahreslohn: 40000, steuerklasse: 1, jahreslohnsteuer: 5710 },
      { jahreslohn: 40000, steuerklasse: 2, jahreslohnsteuer: 4464 },
      { jahreslohn: 40000, steuerklasse: 3, jahreslohnsteuer: 1420 },
      { jahreslohn: 40000, steuerklasse: 4, jahreslohnsteuer: 5710 },
      { jahreslohn: 40000, steuerklasse: 5, jahreslohnsteuer: 10529 },
      { jahreslohn: 40000, steuerklasse: 6, jahreslohnsteuer: 12573 },
      // Zeile 16
      { jahreslohn: 42500, steuerklasse: 1, jahreslohnsteuer: 6470 },
      { jahreslohn: 42500, steuerklasse: 2, jahreslohnsteuer: 5188 },
      { jahreslohn: 42500, steuerklasse: 3, jahreslohnsteuer: 1982 },
      { jahreslohn: 42500, steuerklasse: 4, jahreslohnsteuer: 6470 },
      { jahreslohn: 42500, steuerklasse: 5, jahreslohnsteuer: 11579 },
      { jahreslohn: 42500, steuerklasse: 6, jahreslohnsteuer: 13623 },
      // Zeile 17
      { jahreslohn: 45000, steuerklasse: 1, jahreslohnsteuer: 7252 },
      { jahreslohn: 45000, steuerklasse: 2, jahreslohnsteuer: 5932 },
      { jahreslohn: 45000, steuerklasse: 3, jahreslohnsteuer: 2584 },
      { jahreslohn: 45000, steuerklasse: 4, jahreslohnsteuer: 7252 },
      { jahreslohn: 45000, steuerklasse: 5, jahreslohnsteuer: 12629 },
      { jahreslohn: 45000, steuerklasse: 6, jahreslohnsteuer: 14673 },
      // Zeile 18
      { jahreslohn: 47500, steuerklasse: 1, jahreslohnsteuer: 8055 },
      { jahreslohn: 47500, steuerklasse: 2, jahreslohnsteuer: 6699 },
      { jahreslohn: 47500, steuerklasse: 3, jahreslohnsteuer: 3198 },
      { jahreslohn: 47500, steuerklasse: 4, jahreslohnsteuer: 8055 },
      { jahreslohn: 47500, steuerklasse: 5, jahreslohnsteuer: 13679 },
      { jahreslohn: 47500, steuerklasse: 6, jahreslohnsteuer: 15723 },
      // Zeile 19
      { jahreslohn: 50000, steuerklasse: 1, jahreslohnsteuer: 8880 },
      { jahreslohn: 50000, steuerklasse: 2, jahreslohnsteuer: 7487 },
      { jahreslohn: 50000, steuerklasse: 3, jahreslohnsteuer: 3824 },
      { jahreslohn: 50000, steuerklasse: 4, jahreslohnsteuer: 8880 },
      { jahreslohn: 50000, steuerklasse: 5, jahreslohnsteuer: 14729 },
      { jahreslohn: 50000, steuerklasse: 6, jahreslohnsteuer: 16773 },
      // Zeile 20
      { jahreslohn: 52500, steuerklasse: 1, jahreslohnsteuer: 9727 },
      { jahreslohn: 52500, steuerklasse: 2, jahreslohnsteuer: 8297 },
      { jahreslohn: 52500, steuerklasse: 3, jahreslohnsteuer: 4458 },
      { jahreslohn: 52500, steuerklasse: 4, jahreslohnsteuer: 9727 },
      { jahreslohn: 52500, steuerklasse: 5, jahreslohnsteuer: 15779 },
      { jahreslohn: 52500, steuerklasse: 6, jahreslohnsteuer: 17823 },
      // Zeile 21
      { jahreslohn: 55000, steuerklasse: 1, jahreslohnsteuer: 10595 },
      { jahreslohn: 55000, steuerklasse: 2, jahreslohnsteuer: 9128 },
      { jahreslohn: 55000, steuerklasse: 3, jahreslohnsteuer: 5106 },
      { jahreslohn: 55000, steuerklasse: 4, jahreslohnsteuer: 10595 },
      { jahreslohn: 55000, steuerklasse: 5, jahreslohnsteuer: 16829 },
      { jahreslohn: 55000, steuerklasse: 6, jahreslohnsteuer: 18873 },
      // Zeile 22
      { jahreslohn: 57500, steuerklasse: 1, jahreslohnsteuer: 11485 },
      { jahreslohn: 57500, steuerklasse: 2, jahreslohnsteuer: 9981 },
      { jahreslohn: 57500, steuerklasse: 3, jahreslohnsteuer: 5762 },
      { jahreslohn: 57500, steuerklasse: 4, jahreslohnsteuer: 11485 },
      { jahreslohn: 57500, steuerklasse: 5, jahreslohnsteuer: 17879 },
      { jahreslohn: 57500, steuerklasse: 6, jahreslohnsteuer: 19923 },
      // Zeile 23
      { jahreslohn: 60000, steuerklasse: 1, jahreslohnsteuer: 12396 },
      { jahreslohn: 60000, steuerklasse: 2, jahreslohnsteuer: 10856 },
      { jahreslohn: 60000, steuerklasse: 3, jahreslohnsteuer: 6430 },
      { jahreslohn: 60000, steuerklasse: 4, jahreslohnsteuer: 12396 },
      { jahreslohn: 60000, steuerklasse: 5, jahreslohnsteuer: 18929 },
      { jahreslohn: 60000, steuerklasse: 6, jahreslohnsteuer: 20973 },
      // Zeile 24
      { jahreslohn: 62500, steuerklasse: 1, jahreslohnsteuer: 13330 },
      { jahreslohn: 62500, steuerklasse: 2, jahreslohnsteuer: 11752 },
      { jahreslohn: 62500, steuerklasse: 3, jahreslohnsteuer: 7110 },
      { jahreslohn: 62500, steuerklasse: 4, jahreslohnsteuer: 13330 },
      { jahreslohn: 62500, steuerklasse: 5, jahreslohnsteuer: 19979 },
      { jahreslohn: 62500, steuerklasse: 6, jahreslohnsteuer: 22023 },
      // Zeile 25
      { jahreslohn: 65000, steuerklasse: 1, jahreslohnsteuer: 14284 },
      { jahreslohn: 65000, steuerklasse: 2, jahreslohnsteuer: 12670 },
      { jahreslohn: 65000, steuerklasse: 3, jahreslohnsteuer: 7798 },
      { jahreslohn: 65000, steuerklasse: 4, jahreslohnsteuer: 14284 },
      { jahreslohn: 65000, steuerklasse: 5, jahreslohnsteuer: 21029 },
      { jahreslohn: 65000, steuerklasse: 6, jahreslohnsteuer: 23073 },
      // Zeile 26
      { jahreslohn: 67500, steuerklasse: 1, jahreslohnsteuer: 15261 },
      { jahreslohn: 67500, steuerklasse: 2, jahreslohnsteuer: 13610 },
      { jahreslohn: 67500, steuerklasse: 3, jahreslohnsteuer: 8500 },
      { jahreslohn: 67500, steuerklasse: 4, jahreslohnsteuer: 15261 },
      { jahreslohn: 67500, steuerklasse: 5, jahreslohnsteuer: 22079 },
      { jahreslohn: 67500, steuerklasse: 6, jahreslohnsteuer: 24123 },
      // Zeile 27
      { jahreslohn: 70000, steuerklasse: 1, jahreslohnsteuer: 16259 },
      { jahreslohn: 70000, steuerklasse: 2, jahreslohnsteuer: 14571 },
      { jahreslohn: 70000, steuerklasse: 3, jahreslohnsteuer: 9210 },
      { jahreslohn: 70000, steuerklasse: 4, jahreslohnsteuer: 16259 },
      { jahreslohn: 70000, steuerklasse: 5, jahreslohnsteuer: 23129 },
      { jahreslohn: 70000, steuerklasse: 6, jahreslohnsteuer: 25173 },
      // Zeile 28
      { jahreslohn: 72500, steuerklasse: 1, jahreslohnsteuer: 17279 },
      { jahreslohn: 72500, steuerklasse: 2, jahreslohnsteuer: 15554 },
      { jahreslohn: 72500, steuerklasse: 3, jahreslohnsteuer: 9932 },
      { jahreslohn: 72500, steuerklasse: 4, jahreslohnsteuer: 17279 },
      { jahreslohn: 72500, steuerklasse: 5, jahreslohnsteuer: 24179 },
      { jahreslohn: 72500, steuerklasse: 6, jahreslohnsteuer: 26223 },
      // Zeile 29
      { jahreslohn: 75000, steuerklasse: 1, jahreslohnsteuer: 18320 },
      { jahreslohn: 75000, steuerklasse: 2, jahreslohnsteuer: 16559 },
      { jahreslohn: 75000, steuerklasse: 3, jahreslohnsteuer: 10666 },
      { jahreslohn: 75000, steuerklasse: 4, jahreslohnsteuer: 18320 },
      { jahreslohn: 75000, steuerklasse: 5, jahreslohnsteuer: 25229 },
      { jahreslohn: 75000, steuerklasse: 6, jahreslohnsteuer: 27273 },
      // Zeile 30
      { jahreslohn: 77500, steuerklasse: 1, jahreslohnsteuer: 19370 },
      { jahreslohn: 77500, steuerklasse: 2, jahreslohnsteuer: 17585 },
      { jahreslohn: 77500, steuerklasse: 3, jahreslohnsteuer: 11410 },
      { jahreslohn: 77500, steuerklasse: 4, jahreslohnsteuer: 19370 },
      { jahreslohn: 77500, steuerklasse: 5, jahreslohnsteuer: 26279 },
      { jahreslohn: 77500, steuerklasse: 6, jahreslohnsteuer: 28323 },
      // Zeile 31
      { jahreslohn: 80000, steuerklasse: 1, jahreslohnsteuer: 20420 },
      { jahreslohn: 80000, steuerklasse: 2, jahreslohnsteuer: 18631 },
      { jahreslohn: 80000, steuerklasse: 3, jahreslohnsteuer: 12164 },
      { jahreslohn: 80000, steuerklasse: 4, jahreslohnsteuer: 20420 },
      { jahreslohn: 80000, steuerklasse: 5, jahreslohnsteuer: 27329 },
      { jahreslohn: 80000, steuerklasse: 6, jahreslohnsteuer: 29373 },
      // Zeile 32
      { jahreslohn: 82500, steuerklasse: 1, jahreslohnsteuer: 21470 },
      { jahreslohn: 82500, steuerklasse: 2, jahreslohnsteuer: 19681 },
      { jahreslohn: 82500, steuerklasse: 3, jahreslohnsteuer: 12930 },
      { jahreslohn: 82500, steuerklasse: 4, jahreslohnsteuer: 21470 },
      { jahreslohn: 82500, steuerklasse: 5, jahreslohnsteuer: 28379 },
      { jahreslohn: 82500, steuerklasse: 6, jahreslohnsteuer: 30423 },
      // Zeile 33
      { jahreslohn: 85000, steuerklasse: 1, jahreslohnsteuer: 22520 },
      { jahreslohn: 85000, steuerklasse: 2, jahreslohnsteuer: 20731 },
      { jahreslohn: 85000, steuerklasse: 3, jahreslohnsteuer: 13706 },
      { jahreslohn: 85000, steuerklasse: 4, jahreslohnsteuer: 22520 },
      { jahreslohn: 85000, steuerklasse: 5, jahreslohnsteuer: 29429 },
      { jahreslohn: 85000, steuerklasse: 6, jahreslohnsteuer: 31473 },
      // Zeile 34
      { jahreslohn: 87500, steuerklasse: 1, jahreslohnsteuer: 23570 },
      { jahreslohn: 87500, steuerklasse: 2, jahreslohnsteuer: 21781 },
      { jahreslohn: 87500, steuerklasse: 3, jahreslohnsteuer: 14492 },
      { jahreslohn: 87500, steuerklasse: 4, jahreslohnsteuer: 23570 },
      { jahreslohn: 87500, steuerklasse: 5, jahreslohnsteuer: 30479 },
      { jahreslohn: 87500, steuerklasse: 6, jahreslohnsteuer: 32523 },
      // Zeile 35
      { jahreslohn: 90000, steuerklasse: 1, jahreslohnsteuer: 24620 },
      { jahreslohn: 90000, steuerklasse: 2, jahreslohnsteuer: 22831 },
      { jahreslohn: 90000, steuerklasse: 3, jahreslohnsteuer: 15290 },
      { jahreslohn: 90000, steuerklasse: 4, jahreslohnsteuer: 24620 },
      { jahreslohn: 90000, steuerklasse: 5, jahreslohnsteuer: 31529 },
      { jahreslohn: 90000, steuerklasse: 6, jahreslohnsteuer: 33573 },
      // Zeile 36
      { jahreslohn: 92500, steuerklasse: 1, jahreslohnsteuer: 25670 },
      { jahreslohn: 92500, steuerklasse: 2, jahreslohnsteuer: 23881 },
      { jahreslohn: 92500, steuerklasse: 3, jahreslohnsteuer: 16098 },
      { jahreslohn: 92500, steuerklasse: 4, jahreslohnsteuer: 25670 },
      { jahreslohn: 92500, steuerklasse: 5, jahreslohnsteuer: 32579 },
      { jahreslohn: 92500, steuerklasse: 6, jahreslohnsteuer: 34623 },
      // Zeile 37
      { jahreslohn: 95000, steuerklasse: 1, jahreslohnsteuer: 26720 },
      { jahreslohn: 95000, steuerklasse: 2, jahreslohnsteuer: 24931 },
      { jahreslohn: 95000, steuerklasse: 3, jahreslohnsteuer: 16918 },
      { jahreslohn: 95000, steuerklasse: 4, jahreslohnsteuer: 26720 },
      { jahreslohn: 95000, steuerklasse: 5, jahreslohnsteuer: 33629 },
      { jahreslohn: 95000, steuerklasse: 6, jahreslohnsteuer: 35673 },
      // Zeile 38
      { jahreslohn: 97500, steuerklasse: 1, jahreslohnsteuer: 27770 },
      { jahreslohn: 97500, steuerklasse: 2, jahreslohnsteuer: 25981 },
      { jahreslohn: 97500, steuerklasse: 3, jahreslohnsteuer: 17748 },
      { jahreslohn: 97500, steuerklasse: 4, jahreslohnsteuer: 27770 },
      { jahreslohn: 97500, steuerklasse: 5, jahreslohnsteuer: 34679 },
      { jahreslohn: 97500, steuerklasse: 6, jahreslohnsteuer: 36723 },
      // Zeile 39
      { jahreslohn: 100000, steuerklasse: 1, jahreslohnsteuer: 28820 },
      { jahreslohn: 100000, steuerklasse: 2, jahreslohnsteuer: 27031 },
      { jahreslohn: 100000, steuerklasse: 3, jahreslohnsteuer: 18590 },
      { jahreslohn: 100000, steuerklasse: 4, jahreslohnsteuer: 28820 },
      { jahreslohn: 100000, steuerklasse: 5, jahreslohnsteuer: 35729 },
      { jahreslohn: 100000, steuerklasse: 6, jahreslohnsteuer: 37773 },
      // Zeile 40
      { jahreslohn: 102500, steuerklasse: 1, jahreslohnsteuer: 29870 },
      { jahreslohn: 102500, steuerklasse: 2, jahreslohnsteuer: 28081 },
      { jahreslohn: 102500, steuerklasse: 3, jahreslohnsteuer: 19442 },
      { jahreslohn: 102500, steuerklasse: 4, jahreslohnsteuer: 29870 },
      { jahreslohn: 102500, steuerklasse: 5, jahreslohnsteuer: 36779 },
      { jahreslohn: 102500, steuerklasse: 6, jahreslohnsteuer: 38823 },
      // Zeile 41
      { jahreslohn: 105000, steuerklasse: 1, jahreslohnsteuer: 30920 },
      { jahreslohn: 105000, steuerklasse: 2, jahreslohnsteuer: 29131 },
      { jahreslohn: 105000, steuerklasse: 3, jahreslohnsteuer: 20304 },
      { jahreslohn: 105000, steuerklasse: 4, jahreslohnsteuer: 30920 },
      { jahreslohn: 105000, steuerklasse: 5, jahreslohnsteuer: 37829 },
      { jahreslohn: 105000, steuerklasse: 6, jahreslohnsteuer: 39873 },
      // Zeile 42
      { jahreslohn: 107500, steuerklasse: 1, jahreslohnsteuer: 31970 },
      { jahreslohn: 107500, steuerklasse: 2, jahreslohnsteuer: 30181 },
      { jahreslohn: 107500, steuerklasse: 3, jahreslohnsteuer: 21178 },
      { jahreslohn: 107500, steuerklasse: 4, jahreslohnsteuer: 31970 },
      { jahreslohn: 107500, steuerklasse: 5, jahreslohnsteuer: 38879 },
      { jahreslohn: 107500, steuerklasse: 6, jahreslohnsteuer: 40923 },
      // Zeile 43
      { jahreslohn: 110000, steuerklasse: 1, jahreslohnsteuer: 33020 },
      { jahreslohn: 110000, steuerklasse: 2, jahreslohnsteuer: 31231 },
      { jahreslohn: 110000, steuerklasse: 3, jahreslohnsteuer: 22062 },
      { jahreslohn: 110000, steuerklasse: 4, jahreslohnsteuer: 33020 },
      { jahreslohn: 110000, steuerklasse: 5, jahreslohnsteuer: 39929 },
      { jahreslohn: 110000, steuerklasse: 6, jahreslohnsteuer: 41973 },
    ])(
      "Besondere Prüftabelle - Jahreseinkommen: '$jahreslohn' Euro; Steuerklasse: '$steuerklasse';",
      ({ jahreslohn, steuerklasse, jahreslohnsteuer }) => {
        const programm = new PAP_2026({
          AF: 0,
          F: 0,
          KRV: 1,
          KVZ: 0,
          LZZ: 1,
          LZZFREIB: 0,
          LZZHINZU: 0,
          PKPV: steuerklasse === 3 ? 50000 : steuerklasse === 6 ? 0 : 30000,
          PKV: 1,
          PVA: 0,
          PVS: 0,
          PVZ: steuerklasse === 2 ? 0 : 1,
          R: 0,
          RE4: jahreslohn * 100,
          STKL: steuerklasse,
          VBEZ: 0,
          ZKF: 0,
          ALV: 1,
          PKPVAGZ: 0,
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
