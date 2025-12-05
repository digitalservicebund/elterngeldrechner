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
 * Geänderter Programmablaufplan für die maschinelle Berechnung
 * der vom Arbeitslohn einzubehaltenden Lohnsteuer, des Solidaritätszuschlags
 * und der Maßstabsteuer für die Kirchenlohnsteuer für 2025
 *
 * https://www.bundesfinanzministerium.de/Content/DE/Downloads/Steuern/Steuerarten/Lohnsteuer/Programmablaufplan/2024-11-22-PAP-2025_anlage.pdf?__blob=publicationFile&v=2
 */
export class PAP_2025 extends Programmablaufplan {
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
   * Mindeststeuer für die Steuerklassen V und VI in Euro
   */
  private MIST: number = 0;

  /**
   * Beitragssatz des Arbeitgebers zur Pflegeversicherung
   * (6 Dezimalstellen)
   */
  private PVSATZAG: number = 0;

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
    this.LST2025();
  }

  /**
   * 5. Programmablaufplan 2025
   * Steuerung
   *
   * Bemerkungen:
   * - vereinfacht da Lohnsteuer für mehrjährige nicht relevant ist
   * - vereinfacht da sonstige Einnahmen nicht relevant sind.
   */
  private LST2025(): void {
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
   * Zuweisung von Werten für bestimmte Sozialversicherungsparameter.
   */
  private MPARA(): void {
    if (this.eingangsparameter.KRV <= 1) {
      this.BBGRV = 96600;
      this.RVSATZAN = 0.093;
    }

    this.BBGKVPV = 66150;
    this.KVSATZAN = this.eingangsparameter.KVZ / 2 / 100 + 0.07;
    this.KVSATZAG = 0.0125 + 0.07;

    if (this.eingangsparameter.PVS === 1) {
      this.PVSATZAN = 0.023;
      this.PVSATZAG = 0.013;
    } else {
      this.PVSATZAN = 0.018;
      this.PVSATZAG = 0.018;
    }

    if (this.eingangsparameter.PVZ === 1) {
      this.PVSATZAN = this.PVSATZAN + 0.006;
    } else {
      this.PVSATZAN = this.PVSATZAN - this.eingangsparameter.PVA * 0.0025;
    }

    this.W1STKL5 = 13432;
    this.W2STKL5 = 33380;
    this.W3STKL5 = 222260;
    this.GFB = 11784;
    this.SOLZFREI = 18130;
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
      this.KFB = this.eingangsparameter.ZKF * 9540;
    } else if (this.eingangsparameter.STKL === 2) {
      this.EFA = 4260;
      this.SAP = 36;
      this.KFB = this.eingangsparameter.ZKF * 9540;
    } else if (this.eingangsparameter.STKL === 3) {
      this.KZTAB = 2;
      this.SAP = 36;
      this.KFB = this.eingangsparameter.ZKF * 9540;
    } else if (this.eingangsparameter.STKL === 4) {
      this.SAP = 36;
      this.KFB = this.eingangsparameter.ZKF * 4770;
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
      this.UPTAB24();
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
    if (this.eingangsparameter.KRV === 1) {
      this.VSP1 = 0;
    } else {
      if (this.ZRE4VP > this.BBGRV) {
        this.ZRE4VP = this.BBGRV;
      }

      this.VSP1 = this.ZRE4VP * this.RVSATZAN;
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
    this.UPTAB24();
    this.ST1 = this.ST;
    this.X = this.ZX * 0.75;
    this.UPTAB24();
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
  private UPTAB24(): void {
    if (this.X < this.GFB + 1) {
      this.ST = 0;
    }
    //
    else if (this.X < 17006) {
      this.Y = (this.X - this.GFB) / 10000;
      this.RW = this.Y * 954.8;
      this.RW = this.RW + 1400;
      this.ST = aufDenEuroAbrunden(this.RW * this.Y);
    }
    //
    else if (this.X < 66761) {
      this.Y = (this.X - 17005) / 10000;
      this.RW = this.Y * 181.19;
      this.RW = this.RW + 2397;
      this.RW = this.RW * this.Y;
      this.ST = aufDenEuroAbrunden(this.RW + 991.21);
    }
    //
    else if (this.X < 277826) {
      this.ST = aufDenEuroAbrunden(this.X * 0.42 - 10636.31);
    }
    //
    else {
      this.ST = aufDenEuroAbrunden(this.X * 0.45 - 18971.06);
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

  describe("Programmablaufplan 2025", () => {
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
      { jahreslohn: 5000, steuerklasse: 5, jahreslohnsteuer: 373 },
      { jahreslohn: 5000, steuerklasse: 6, jahreslohnsteuer: 550 },
      // Zeile 2
      { jahreslohn: 7500, steuerklasse: 1, jahreslohnsteuer: 0 },
      { jahreslohn: 7500, steuerklasse: 2, jahreslohnsteuer: 0 },
      { jahreslohn: 7500, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 7500, steuerklasse: 4, jahreslohnsteuer: 0 },
      { jahreslohn: 7500, steuerklasse: 5, jahreslohnsteuer: 649 },
      { jahreslohn: 7500, steuerklasse: 6, jahreslohnsteuer: 826 },
      // Zeile 3
      { jahreslohn: 10000, steuerklasse: 1, jahreslohnsteuer: 0 },
      { jahreslohn: 10000, steuerklasse: 2, jahreslohnsteuer: 0 },
      { jahreslohn: 10000, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 10000, steuerklasse: 4, jahreslohnsteuer: 0 },
      { jahreslohn: 10000, steuerklasse: 5, jahreslohnsteuer: 924 },
      { jahreslohn: 10000, steuerklasse: 6, jahreslohnsteuer: 1101 },
      // Zeile 4
      { jahreslohn: 12500, steuerklasse: 1, jahreslohnsteuer: 0 },
      { jahreslohn: 12500, steuerklasse: 2, jahreslohnsteuer: 0 },
      { jahreslohn: 12500, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 12500, steuerklasse: 4, jahreslohnsteuer: 0 },
      { jahreslohn: 12500, steuerklasse: 5, jahreslohnsteuer: 1199 },
      { jahreslohn: 12500, steuerklasse: 6, jahreslohnsteuer: 1377 },
      // Zeile 5
      { jahreslohn: 15000, steuerklasse: 1, jahreslohnsteuer: 0 },
      { jahreslohn: 15000, steuerklasse: 2, jahreslohnsteuer: 0 },
      { jahreslohn: 15000, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 15000, steuerklasse: 4, jahreslohnsteuer: 0 },
      { jahreslohn: 15000, steuerklasse: 5, jahreslohnsteuer: 1475 },
      { jahreslohn: 15000, steuerklasse: 6, jahreslohnsteuer: 1652 },
      // Zeile 6
      { jahreslohn: 17500, steuerklasse: 1, jahreslohnsteuer: 137 },
      { jahreslohn: 17500, steuerklasse: 2, jahreslohnsteuer: 0 },
      { jahreslohn: 17500, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 17500, steuerklasse: 4, jahreslohnsteuer: 137 },
      { jahreslohn: 17500, steuerklasse: 5, jahreslohnsteuer: 1778 },
      { jahreslohn: 17500, steuerklasse: 6, jahreslohnsteuer: 2106 },
      // Zeile 7
      { jahreslohn: 20000, steuerklasse: 1, jahreslohnsteuer: 498 },
      { jahreslohn: 20000, steuerklasse: 2, jahreslohnsteuer: 0 },
      { jahreslohn: 20000, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 20000, steuerklasse: 4, jahreslohnsteuer: 498 },
      { jahreslohn: 20000, steuerklasse: 5, jahreslohnsteuer: 2431 },
      { jahreslohn: 20000, steuerklasse: 6, jahreslohnsteuer: 2962 },
      // Zeile 8
      { jahreslohn: 22500, steuerklasse: 1, jahreslohnsteuer: 929 },
      { jahreslohn: 22500, steuerklasse: 2, jahreslohnsteuer: 123 },
      { jahreslohn: 22500, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 22500, steuerklasse: 4, jahreslohnsteuer: 929 },
      { jahreslohn: 22500, steuerklasse: 5, jahreslohnsteuer: 3271 },
      { jahreslohn: 22500, steuerklasse: 6, jahreslohnsteuer: 3803 },
      // Zeile 9
      { jahreslohn: 25000, steuerklasse: 1, jahreslohnsteuer: 1414 },
      { jahreslohn: 25000, steuerklasse: 2, jahreslohnsteuer: 476 },
      { jahreslohn: 25000, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 25000, steuerklasse: 4, jahreslohnsteuer: 1414 },
      { jahreslohn: 25000, steuerklasse: 5, jahreslohnsteuer: 4111 },
      { jahreslohn: 25000, steuerklasse: 6, jahreslohnsteuer: 4643 },
      // Zeile 10
      { jahreslohn: 27500, steuerklasse: 1, jahreslohnsteuer: 1913 },
      { jahreslohn: 27500, steuerklasse: 2, jahreslohnsteuer: 907 },
      { jahreslohn: 27500, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 27500, steuerklasse: 4, jahreslohnsteuer: 1913 },
      { jahreslohn: 27500, steuerklasse: 5, jahreslohnsteuer: 4952 },
      { jahreslohn: 27500, steuerklasse: 6, jahreslohnsteuer: 5484 },
      // Zeile 11
      { jahreslohn: 30000, steuerklasse: 1, jahreslohnsteuer: 2427 },
      { jahreslohn: 30000, steuerklasse: 2, jahreslohnsteuer: 1395 },
      { jahreslohn: 30000, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 30000, steuerklasse: 4, jahreslohnsteuer: 2427 },
      { jahreslohn: 30000, steuerklasse: 5, jahreslohnsteuer: 5793 },
      { jahreslohn: 30000, steuerklasse: 6, jahreslohnsteuer: 6324 },
      // Zeile 12
      { jahreslohn: 32500, steuerklasse: 1, jahreslohnsteuer: 2956 },
      { jahreslohn: 32500, steuerklasse: 2, jahreslohnsteuer: 1897 },
      { jahreslohn: 32500, steuerklasse: 3, jahreslohnsteuer: 172 },
      { jahreslohn: 32500, steuerklasse: 4, jahreslohnsteuer: 2956 },
      { jahreslohn: 32500, steuerklasse: 5, jahreslohnsteuer: 6628 },
      { jahreslohn: 32500, steuerklasse: 6, jahreslohnsteuer: 7086 },
      // Zeile 13
      { jahreslohn: 35000, steuerklasse: 1, jahreslohnsteuer: 3499 },
      { jahreslohn: 35000, steuerklasse: 2, jahreslohnsteuer: 2415 },
      { jahreslohn: 35000, steuerklasse: 3, jahreslohnsteuer: 492 },
      { jahreslohn: 35000, steuerklasse: 4, jahreslohnsteuer: 3499 },
      { jahreslohn: 35000, steuerklasse: 5, jahreslohnsteuer: 7356 },
      { jahreslohn: 35000, steuerklasse: 6, jahreslohnsteuer: 7834 },
      // Zeile 14
      { jahreslohn: 37500, steuerklasse: 1, jahreslohnsteuer: 4056 },
      { jahreslohn: 37500, steuerklasse: 2, jahreslohnsteuer: 2947 },
      { jahreslohn: 37500, steuerklasse: 3, jahreslohnsteuer: 854 },
      { jahreslohn: 37500, steuerklasse: 4, jahreslohnsteuer: 4056 },
      { jahreslohn: 37500, steuerklasse: 5, jahreslohnsteuer: 8116 },
      { jahreslohn: 37500, steuerklasse: 6, jahreslohnsteuer: 8612 },
      // Zeile 15
      { jahreslohn: 40000, steuerklasse: 1, jahreslohnsteuer: 4629 },
      { jahreslohn: 40000, steuerklasse: 2, jahreslohnsteuer: 3494 },
      { jahreslohn: 40000, steuerklasse: 3, jahreslohnsteuer: 1252 },
      { jahreslohn: 40000, steuerklasse: 4, jahreslohnsteuer: 4629 },
      { jahreslohn: 40000, steuerklasse: 5, jahreslohnsteuer: 8904 },
      { jahreslohn: 40000, steuerklasse: 6, jahreslohnsteuer: 9418 },
      // Zeile 16
      { jahreslohn: 42500, steuerklasse: 1, jahreslohnsteuer: 5215 },
      { jahreslohn: 42500, steuerklasse: 2, jahreslohnsteuer: 4056 },
      { jahreslohn: 42500, steuerklasse: 3, jahreslohnsteuer: 1688 },
      { jahreslohn: 42500, steuerklasse: 4, jahreslohnsteuer: 5215 },
      { jahreslohn: 42500, steuerklasse: 5, jahreslohnsteuer: 9720 },
      { jahreslohn: 42500, steuerklasse: 6, jahreslohnsteuer: 10251 },
      // Zeile 17
      { jahreslohn: 45000, steuerklasse: 1, jahreslohnsteuer: 5817 },
      { jahreslohn: 45000, steuerklasse: 2, jahreslohnsteuer: 4632 },
      { jahreslohn: 45000, steuerklasse: 3, jahreslohnsteuer: 2160 },
      { jahreslohn: 45000, steuerklasse: 4, jahreslohnsteuer: 5817 },
      { jahreslohn: 45000, steuerklasse: 5, jahreslohnsteuer: 10559 },
      { jahreslohn: 45000, steuerklasse: 6, jahreslohnsteuer: 11091 },
      // Zeile 18
      { jahreslohn: 47500, steuerklasse: 1, jahreslohnsteuer: 6432 },
      { jahreslohn: 47500, steuerklasse: 2, jahreslohnsteuer: 5223 },
      { jahreslohn: 47500, steuerklasse: 3, jahreslohnsteuer: 2646 },
      { jahreslohn: 47500, steuerklasse: 4, jahreslohnsteuer: 6432 },
      { jahreslohn: 47500, steuerklasse: 5, jahreslohnsteuer: 11400 },
      { jahreslohn: 47500, steuerklasse: 6, jahreslohnsteuer: 11932 },
      // Zeile 19
      { jahreslohn: 50000, steuerklasse: 1, jahreslohnsteuer: 7063 },
      { jahreslohn: 50000, steuerklasse: 2, jahreslohnsteuer: 5830 },
      { jahreslohn: 50000, steuerklasse: 3, jahreslohnsteuer: 3140 },
      { jahreslohn: 50000, steuerklasse: 4, jahreslohnsteuer: 7063 },
      { jahreslohn: 50000, steuerklasse: 5, jahreslohnsteuer: 12241 },
      { jahreslohn: 50000, steuerklasse: 6, jahreslohnsteuer: 12772 },
      // Zeile 20
      { jahreslohn: 52500, steuerklasse: 1, jahreslohnsteuer: 7707 },
      { jahreslohn: 52500, steuerklasse: 2, jahreslohnsteuer: 6450 },
      { jahreslohn: 52500, steuerklasse: 3, jahreslohnsteuer: 3640 },
      { jahreslohn: 52500, steuerklasse: 4, jahreslohnsteuer: 7707 },
      { jahreslohn: 52500, steuerklasse: 5, jahreslohnsteuer: 13081 },
      { jahreslohn: 52500, steuerklasse: 6, jahreslohnsteuer: 13613 },
      // Zeile 21
      { jahreslohn: 55000, steuerklasse: 1, jahreslohnsteuer: 8366 },
      { jahreslohn: 55000, steuerklasse: 2, jahreslohnsteuer: 7086 },
      { jahreslohn: 55000, steuerklasse: 3, jahreslohnsteuer: 4148 },
      { jahreslohn: 55000, steuerklasse: 4, jahreslohnsteuer: 8366 },
      { jahreslohn: 55000, steuerklasse: 5, jahreslohnsteuer: 13922 },
      { jahreslohn: 55000, steuerklasse: 6, jahreslohnsteuer: 14453 },
      // Zeile 22
      { jahreslohn: 57500, steuerklasse: 1, jahreslohnsteuer: 9040 },
      { jahreslohn: 57500, steuerklasse: 2, jahreslohnsteuer: 7736 },
      { jahreslohn: 57500, steuerklasse: 3, jahreslohnsteuer: 4664 },
      { jahreslohn: 57500, steuerklasse: 4, jahreslohnsteuer: 9040 },
      { jahreslohn: 57500, steuerklasse: 5, jahreslohnsteuer: 14762 },
      { jahreslohn: 57500, steuerklasse: 6, jahreslohnsteuer: 15294 },
      // Zeile 23
      { jahreslohn: 60000, steuerklasse: 1, jahreslohnsteuer: 9729 },
      { jahreslohn: 60000, steuerklasse: 2, jahreslohnsteuer: 8401 },
      { jahreslohn: 60000, steuerklasse: 3, jahreslohnsteuer: 5186 },
      { jahreslohn: 60000, steuerklasse: 4, jahreslohnsteuer: 9729 },
      { jahreslohn: 60000, steuerklasse: 5, jahreslohnsteuer: 15603 },
      { jahreslohn: 60000, steuerklasse: 6, jahreslohnsteuer: 16135 },
      // Zeile 24
      { jahreslohn: 62500, steuerklasse: 1, jahreslohnsteuer: 10431 },
      { jahreslohn: 62500, steuerklasse: 2, jahreslohnsteuer: 9080 },
      { jahreslohn: 62500, steuerklasse: 3, jahreslohnsteuer: 5716 },
      { jahreslohn: 62500, steuerklasse: 4, jahreslohnsteuer: 10431 },
      { jahreslohn: 62500, steuerklasse: 5, jahreslohnsteuer: 16443 },
      { jahreslohn: 62500, steuerklasse: 6, jahreslohnsteuer: 16975 },
      // Zeile 25
      { jahreslohn: 65000, steuerklasse: 1, jahreslohnsteuer: 11148 },
      { jahreslohn: 65000, steuerklasse: 2, jahreslohnsteuer: 9774 },
      { jahreslohn: 65000, steuerklasse: 3, jahreslohnsteuer: 6252 },
      { jahreslohn: 65000, steuerklasse: 4, jahreslohnsteuer: 11148 },
      { jahreslohn: 65000, steuerklasse: 5, jahreslohnsteuer: 17284 },
      { jahreslohn: 65000, steuerklasse: 6, jahreslohnsteuer: 17815 },
      // Zeile 26
      { jahreslohn: 67500, steuerklasse: 1, jahreslohnsteuer: 11933 },
      { jahreslohn: 67500, steuerklasse: 2, jahreslohnsteuer: 10532 },
      { jahreslohn: 67500, steuerklasse: 3, jahreslohnsteuer: 6836 },
      { jahreslohn: 67500, steuerklasse: 4, jahreslohnsteuer: 11933 },
      { jahreslohn: 67500, steuerklasse: 5, jahreslohnsteuer: 18185 },
      { jahreslohn: 67500, steuerklasse: 6, jahreslohnsteuer: 18716 },
      // Zeile 27
      { jahreslohn: 70000, steuerklasse: 1, jahreslohnsteuer: 12781 },
      { jahreslohn: 70000, steuerklasse: 2, jahreslohnsteuer: 11348 },
      { jahreslohn: 70000, steuerklasse: 3, jahreslohnsteuer: 7462 },
      { jahreslohn: 70000, steuerklasse: 4, jahreslohnsteuer: 12781 },
      { jahreslohn: 70000, steuerklasse: 5, jahreslohnsteuer: 19137 },
      { jahreslohn: 70000, steuerklasse: 6, jahreslohnsteuer: 19669 },
      // Zeile 28
      { jahreslohn: 72500, steuerklasse: 1, jahreslohnsteuer: 13648 },
      { jahreslohn: 72500, steuerklasse: 2, jahreslohnsteuer: 12183 },
      { jahreslohn: 72500, steuerklasse: 3, jahreslohnsteuer: 8096 },
      { jahreslohn: 72500, steuerklasse: 4, jahreslohnsteuer: 13648 },
      { jahreslohn: 72500, steuerklasse: 5, jahreslohnsteuer: 20089 },
      { jahreslohn: 72500, steuerklasse: 6, jahreslohnsteuer: 20621 },
      // Zeile 29
      { jahreslohn: 75000, steuerklasse: 1, jahreslohnsteuer: 14533 },
      { jahreslohn: 75000, steuerklasse: 2, jahreslohnsteuer: 13036 },
      { jahreslohn: 75000, steuerklasse: 3, jahreslohnsteuer: 8742 },
      { jahreslohn: 75000, steuerklasse: 4, jahreslohnsteuer: 14533 },
      { jahreslohn: 75000, steuerklasse: 5, jahreslohnsteuer: 21042 },
      { jahreslohn: 75000, steuerklasse: 6, jahreslohnsteuer: 21574 },
      // Zeile 30
      { jahreslohn: 77500, steuerklasse: 1, jahreslohnsteuer: 15437 },
      { jahreslohn: 77500, steuerklasse: 2, jahreslohnsteuer: 13908 },
      { jahreslohn: 77500, steuerklasse: 3, jahreslohnsteuer: 9394 },
      { jahreslohn: 77500, steuerklasse: 4, jahreslohnsteuer: 15437 },
      { jahreslohn: 77500, steuerklasse: 5, jahreslohnsteuer: 21994 },
      { jahreslohn: 77500, steuerklasse: 6, jahreslohnsteuer: 22526 },
      // Zeile 31
      { jahreslohn: 80000, steuerklasse: 1, jahreslohnsteuer: 16359 },
      { jahreslohn: 80000, steuerklasse: 2, jahreslohnsteuer: 14799 },
      { jahreslohn: 80000, steuerklasse: 3, jahreslohnsteuer: 10058 },
      { jahreslohn: 80000, steuerklasse: 4, jahreslohnsteuer: 16359 },
      { jahreslohn: 80000, steuerklasse: 5, jahreslohnsteuer: 22946 },
      { jahreslohn: 80000, steuerklasse: 6, jahreslohnsteuer: 23478 },
      // Zeile 32
      { jahreslohn: 82500, steuerklasse: 1, jahreslohnsteuer: 17300 },
      { jahreslohn: 82500, steuerklasse: 2, jahreslohnsteuer: 15708 },
      { jahreslohn: 82500, steuerklasse: 3, jahreslohnsteuer: 10730 },
      { jahreslohn: 82500, steuerklasse: 4, jahreslohnsteuer: 17300 },
      { jahreslohn: 82500, steuerklasse: 5, jahreslohnsteuer: 23899 },
      { jahreslohn: 82500, steuerklasse: 6, jahreslohnsteuer: 24430 },
      // Zeile 33
      { jahreslohn: 85000, steuerklasse: 1, jahreslohnsteuer: 18252 },
      { jahreslohn: 85000, steuerklasse: 2, jahreslohnsteuer: 16636 },
      { jahreslohn: 85000, steuerklasse: 3, jahreslohnsteuer: 11412 },
      { jahreslohn: 85000, steuerklasse: 4, jahreslohnsteuer: 18252 },
      { jahreslohn: 85000, steuerklasse: 5, jahreslohnsteuer: 24851 },
      { jahreslohn: 85000, steuerklasse: 6, jahreslohnsteuer: 25383 },
      // Zeile 34
      { jahreslohn: 87500, steuerklasse: 1, jahreslohnsteuer: 19205 },
      { jahreslohn: 87500, steuerklasse: 2, jahreslohnsteuer: 17582 },
      { jahreslohn: 87500, steuerklasse: 3, jahreslohnsteuer: 12102 },
      { jahreslohn: 87500, steuerklasse: 4, jahreslohnsteuer: 19205 },
      { jahreslohn: 87500, steuerklasse: 5, jahreslohnsteuer: 25803 },
      { jahreslohn: 87500, steuerklasse: 6, jahreslohnsteuer: 26335 },
      // Zeile 35
      { jahreslohn: 90000, steuerklasse: 1, jahreslohnsteuer: 20157 },
      { jahreslohn: 90000, steuerklasse: 2, jahreslohnsteuer: 18534 },
      { jahreslohn: 90000, steuerklasse: 3, jahreslohnsteuer: 12804 },
      { jahreslohn: 90000, steuerklasse: 4, jahreslohnsteuer: 20157 },
      { jahreslohn: 90000, steuerklasse: 5, jahreslohnsteuer: 26756 },
      { jahreslohn: 90000, steuerklasse: 6, jahreslohnsteuer: 27288 },
      // Zeile 36
      { jahreslohn: 92500, steuerklasse: 1, jahreslohnsteuer: 21109 },
      { jahreslohn: 92500, steuerklasse: 2, jahreslohnsteuer: 19487 },
      { jahreslohn: 92500, steuerklasse: 3, jahreslohnsteuer: 13514 },
      { jahreslohn: 92500, steuerklasse: 4, jahreslohnsteuer: 21109 },
      { jahreslohn: 92500, steuerklasse: 5, jahreslohnsteuer: 27708 },
      { jahreslohn: 92500, steuerklasse: 6, jahreslohnsteuer: 28240 },
      // Zeile 37
      { jahreslohn: 95000, steuerklasse: 1, jahreslohnsteuer: 22062 },
      { jahreslohn: 95000, steuerklasse: 2, jahreslohnsteuer: 20439 },
      { jahreslohn: 95000, steuerklasse: 3, jahreslohnsteuer: 14232 },
      { jahreslohn: 95000, steuerklasse: 4, jahreslohnsteuer: 22062 },
      { jahreslohn: 95000, steuerklasse: 5, jahreslohnsteuer: 28661 },
      { jahreslohn: 95000, steuerklasse: 6, jahreslohnsteuer: 29192 },
      // Zeile 38
      { jahreslohn: 97500, steuerklasse: 1, jahreslohnsteuer: 23049 },
      { jahreslohn: 97500, steuerklasse: 2, jahreslohnsteuer: 21427 },
      { jahreslohn: 97500, steuerklasse: 3, jahreslohnsteuer: 14988 },
      { jahreslohn: 97500, steuerklasse: 4, jahreslohnsteuer: 23049 },
      { jahreslohn: 97500, steuerklasse: 5, jahreslohnsteuer: 29648 },
      { jahreslohn: 97500, steuerklasse: 6, jahreslohnsteuer: 30180 },
      // Zeile 39
      { jahreslohn: 100000, steuerklasse: 1, jahreslohnsteuer: 24099 },
      { jahreslohn: 100000, steuerklasse: 2, jahreslohnsteuer: 22477 },
      { jahreslohn: 100000, steuerklasse: 3, jahreslohnsteuer: 15802 },
      { jahreslohn: 100000, steuerklasse: 4, jahreslohnsteuer: 24099 },
      { jahreslohn: 100000, steuerklasse: 5, jahreslohnsteuer: 30698 },
      { jahreslohn: 100000, steuerklasse: 6, jahreslohnsteuer: 31230 },
    ])(
      "Allgemeine Prüftabelle - Jahreslohn: '$jahreslohn' Euro; Steuerklasse: '$steuerklasse';",
      ({ jahreslohn, steuerklasse, jahreslohnsteuer }) => {
        const programm = new PAP_2025({
          AF: 0,
          F: 0,
          KRV: 0,
          KVZ: 2.5,
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
      { jahreslohn: 5000, steuerklasse: 5, jahreslohnsteuer: 438 },
      { jahreslohn: 5000, steuerklasse: 6, jahreslohnsteuer: 616 },
      // Zeile 2
      { jahreslohn: 7500, steuerklasse: 1, jahreslohnsteuer: 0 },
      { jahreslohn: 7500, steuerklasse: 2, jahreslohnsteuer: 0 },
      { jahreslohn: 7500, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 7500, steuerklasse: 4, jahreslohnsteuer: 0 },
      { jahreslohn: 7500, steuerklasse: 5, jahreslohnsteuer: 746 },
      { jahreslohn: 7500, steuerklasse: 6, jahreslohnsteuer: 924 },
      // Zeile 3
      { jahreslohn: 10000, steuerklasse: 1, jahreslohnsteuer: 0 },
      { jahreslohn: 10000, steuerklasse: 2, jahreslohnsteuer: 0 },
      { jahreslohn: 10000, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 10000, steuerklasse: 4, jahreslohnsteuer: 0 },
      { jahreslohn: 10000, steuerklasse: 5, jahreslohnsteuer: 1054 },
      { jahreslohn: 10000, steuerklasse: 6, jahreslohnsteuer: 1232 },
      // Zeile 4
      { jahreslohn: 12500, steuerklasse: 1, jahreslohnsteuer: 0 },
      { jahreslohn: 12500, steuerklasse: 2, jahreslohnsteuer: 0 },
      { jahreslohn: 12500, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 12500, steuerklasse: 4, jahreslohnsteuer: 0 },
      { jahreslohn: 12500, steuerklasse: 5, jahreslohnsteuer: 1362 },
      { jahreslohn: 12500, steuerklasse: 6, jahreslohnsteuer: 1540 },
      // Zeile 5
      { jahreslohn: 15000, steuerklasse: 1, jahreslohnsteuer: 21 },
      { jahreslohn: 15000, steuerklasse: 2, jahreslohnsteuer: 0 },
      { jahreslohn: 15000, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 15000, steuerklasse: 4, jahreslohnsteuer: 21 },
      { jahreslohn: 15000, steuerklasse: 5, jahreslohnsteuer: 1670 },
      { jahreslohn: 15000, steuerklasse: 6, jahreslohnsteuer: 1848 },
      // Zeile 6
      { jahreslohn: 17500, steuerklasse: 1, jahreslohnsteuer: 419 },
      { jahreslohn: 17500, steuerklasse: 2, jahreslohnsteuer: 0 },
      { jahreslohn: 17500, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 17500, steuerklasse: 4, jahreslohnsteuer: 419 },
      { jahreslohn: 17500, steuerklasse: 5, jahreslohnsteuer: 2258 },
      { jahreslohn: 17500, steuerklasse: 6, jahreslohnsteuer: 2790 },
      // Zeile 7
      { jahreslohn: 20000, steuerklasse: 1, jahreslohnsteuer: 950 },
      { jahreslohn: 20000, steuerklasse: 2, jahreslohnsteuer: 116 },
      { jahreslohn: 20000, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 20000, steuerklasse: 4, jahreslohnsteuer: 950 },
      { jahreslohn: 20000, steuerklasse: 5, jahreslohnsteuer: 3308 },
      { jahreslohn: 20000, steuerklasse: 6, jahreslohnsteuer: 3840 },
      // Zeile 8
      { jahreslohn: 22500, steuerklasse: 1, jahreslohnsteuer: 1559 },
      { jahreslohn: 22500, steuerklasse: 2, jahreslohnsteuer: 563 },
      { jahreslohn: 22500, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 22500, steuerklasse: 4, jahreslohnsteuer: 1559 },
      { jahreslohn: 22500, steuerklasse: 5, jahreslohnsteuer: 4358 },
      { jahreslohn: 22500, steuerklasse: 6, jahreslohnsteuer: 4890 },
      // Zeile 9
      { jahreslohn: 25000, steuerklasse: 1, jahreslohnsteuer: 2190 },
      { jahreslohn: 25000, steuerklasse: 2, jahreslohnsteuer: 1128 },
      { jahreslohn: 25000, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 25000, steuerklasse: 4, jahreslohnsteuer: 2190 },
      { jahreslohn: 25000, steuerklasse: 5, jahreslohnsteuer: 5408 },
      { jahreslohn: 25000, steuerklasse: 6, jahreslohnsteuer: 5940 },
      // Zeile 10
      { jahreslohn: 27500, steuerklasse: 1, jahreslohnsteuer: 2845 },
      { jahreslohn: 27500, steuerklasse: 2, jahreslohnsteuer: 1743 },
      { jahreslohn: 27500, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 27500, steuerklasse: 4, jahreslohnsteuer: 2845 },
      { jahreslohn: 27500, steuerklasse: 5, jahreslohnsteuer: 6458 },
      { jahreslohn: 27500, steuerklasse: 6, jahreslohnsteuer: 6932 },
      // Zeile 11
      { jahreslohn: 30000, steuerklasse: 1, jahreslohnsteuer: 3522 },
      { jahreslohn: 30000, steuerklasse: 2, jahreslohnsteuer: 2382 },
      { jahreslohn: 30000, steuerklasse: 3, jahreslohnsteuer: 324 },
      { jahreslohn: 30000, steuerklasse: 4, jahreslohnsteuer: 3522 },
      { jahreslohn: 30000, steuerklasse: 5, jahreslohnsteuer: 7388 },
      { jahreslohn: 30000, steuerklasse: 6, jahreslohnsteuer: 7866 },
      // Zeile 12
      { jahreslohn: 32500, steuerklasse: 1, jahreslohnsteuer: 4221 },
      { jahreslohn: 32500, steuerklasse: 2, jahreslohnsteuer: 3043 },
      { jahreslohn: 32500, steuerklasse: 3, jahreslohnsteuer: 756 },
      { jahreslohn: 32500, steuerklasse: 4, jahreslohnsteuer: 4221 },
      { jahreslohn: 32500, steuerklasse: 5, jahreslohnsteuer: 8342 },
      { jahreslohn: 32500, steuerklasse: 6, jahreslohnsteuer: 8842 },
      // Zeile 13
      { jahreslohn: 35000, steuerklasse: 1, jahreslohnsteuer: 4944 },
      { jahreslohn: 35000, steuerklasse: 2, jahreslohnsteuer: 3726 },
      { jahreslohn: 35000, steuerklasse: 3, jahreslohnsteuer: 1248 },
      { jahreslohn: 35000, steuerklasse: 4, jahreslohnsteuer: 4944 },
      { jahreslohn: 35000, steuerklasse: 5, jahreslohnsteuer: 9342 },
      { jahreslohn: 35000, steuerklasse: 6, jahreslohnsteuer: 9864 },
      // Zeile 14
      { jahreslohn: 37500, steuerklasse: 1, jahreslohnsteuer: 5689 },
      { jahreslohn: 37500, steuerklasse: 2, jahreslohnsteuer: 4433 },
      { jahreslohn: 37500, steuerklasse: 3, jahreslohnsteuer: 1798 },
      { jahreslohn: 37500, steuerklasse: 4, jahreslohnsteuer: 5689 },
      { jahreslohn: 37500, steuerklasse: 5, jahreslohnsteuer: 10382 },
      { jahreslohn: 37500, steuerklasse: 6, jahreslohnsteuer: 10914 },
      // Zeile 15
      { jahreslohn: 40000, steuerklasse: 1, jahreslohnsteuer: 6456 },
      { jahreslohn: 40000, steuerklasse: 2, jahreslohnsteuer: 5162 },
      { jahreslohn: 40000, steuerklasse: 3, jahreslohnsteuer: 2398 },
      { jahreslohn: 40000, steuerklasse: 4, jahreslohnsteuer: 6456 },
      { jahreslohn: 40000, steuerklasse: 5, jahreslohnsteuer: 11432 },
      { jahreslohn: 40000, steuerklasse: 6, jahreslohnsteuer: 11964 },
      // Zeile 16
      { jahreslohn: 42500, steuerklasse: 1, jahreslohnsteuer: 7246 },
      { jahreslohn: 42500, steuerklasse: 2, jahreslohnsteuer: 5913 },
      { jahreslohn: 42500, steuerklasse: 3, jahreslohnsteuer: 3010 },
      { jahreslohn: 42500, steuerklasse: 4, jahreslohnsteuer: 7246 },
      { jahreslohn: 42500, steuerklasse: 5, jahreslohnsteuer: 12482 },
      { jahreslohn: 42500, steuerklasse: 6, jahreslohnsteuer: 13014 },
      // Zeile 17
      { jahreslohn: 45000, steuerklasse: 1, jahreslohnsteuer: 8059 },
      { jahreslohn: 45000, steuerklasse: 2, jahreslohnsteuer: 6688 },
      { jahreslohn: 45000, steuerklasse: 3, jahreslohnsteuer: 3634 },
      { jahreslohn: 45000, steuerklasse: 4, jahreslohnsteuer: 8059 },
      { jahreslohn: 45000, steuerklasse: 5, jahreslohnsteuer: 13532 },
      { jahreslohn: 45000, steuerklasse: 6, jahreslohnsteuer: 14064 },
      // Zeile 18
      { jahreslohn: 47500, steuerklasse: 1, jahreslohnsteuer: 8895 },
      { jahreslohn: 47500, steuerklasse: 2, jahreslohnsteuer: 7485 },
      { jahreslohn: 47500, steuerklasse: 3, jahreslohnsteuer: 4270 },
      { jahreslohn: 47500, steuerklasse: 4, jahreslohnsteuer: 8895 },
      { jahreslohn: 47500, steuerklasse: 5, jahreslohnsteuer: 14582 },
      { jahreslohn: 47500, steuerklasse: 6, jahreslohnsteuer: 15114 },
      // Zeile 19
      { jahreslohn: 50000, steuerklasse: 1, jahreslohnsteuer: 9753 },
      { jahreslohn: 50000, steuerklasse: 2, jahreslohnsteuer: 8304 },
      { jahreslohn: 50000, steuerklasse: 3, jahreslohnsteuer: 4916 },
      { jahreslohn: 50000, steuerklasse: 4, jahreslohnsteuer: 9753 },
      { jahreslohn: 50000, steuerklasse: 5, jahreslohnsteuer: 15632 },
      { jahreslohn: 50000, steuerklasse: 6, jahreslohnsteuer: 16164 },
      // Zeile 20
      { jahreslohn: 52500, steuerklasse: 1, jahreslohnsteuer: 10634 },
      { jahreslohn: 52500, steuerklasse: 2, jahreslohnsteuer: 9146 },
      { jahreslohn: 52500, steuerklasse: 3, jahreslohnsteuer: 5574 },
      { jahreslohn: 52500, steuerklasse: 4, jahreslohnsteuer: 10634 },
      { jahreslohn: 52500, steuerklasse: 5, jahreslohnsteuer: 16682 },
      { jahreslohn: 52500, steuerklasse: 6, jahreslohnsteuer: 17214 },
      // Zeile 21
      { jahreslohn: 55000, steuerklasse: 1, jahreslohnsteuer: 11537 },
      { jahreslohn: 55000, steuerklasse: 2, jahreslohnsteuer: 10011 },
      { jahreslohn: 55000, steuerklasse: 3, jahreslohnsteuer: 6244 },
      { jahreslohn: 55000, steuerklasse: 4, jahreslohnsteuer: 11537 },
      { jahreslohn: 55000, steuerklasse: 5, jahreslohnsteuer: 17732 },
      { jahreslohn: 55000, steuerklasse: 6, jahreslohnsteuer: 18264 },
      // Zeile 22
      { jahreslohn: 57500, steuerklasse: 1, jahreslohnsteuer: 12463 },
      { jahreslohn: 57500, steuerklasse: 2, jahreslohnsteuer: 10899 },
      { jahreslohn: 57500, steuerklasse: 3, jahreslohnsteuer: 6924 },
      { jahreslohn: 57500, steuerklasse: 4, jahreslohnsteuer: 12463 },
      { jahreslohn: 57500, steuerklasse: 5, jahreslohnsteuer: 18782 },
      { jahreslohn: 57500, steuerklasse: 6, jahreslohnsteuer: 19314 },
      // Zeile 23
      { jahreslohn: 60000, steuerklasse: 1, jahreslohnsteuer: 13412 },
      { jahreslohn: 60000, steuerklasse: 2, jahreslohnsteuer: 11809 },
      { jahreslohn: 60000, steuerklasse: 3, jahreslohnsteuer: 7616 },
      { jahreslohn: 60000, steuerklasse: 4, jahreslohnsteuer: 13412 },
      { jahreslohn: 60000, steuerklasse: 5, jahreslohnsteuer: 19832 },
      { jahreslohn: 60000, steuerklasse: 6, jahreslohnsteuer: 20364 },
      // Zeile 24
      { jahreslohn: 62500, steuerklasse: 1, jahreslohnsteuer: 14383 },
      { jahreslohn: 62500, steuerklasse: 2, jahreslohnsteuer: 12742 },
      { jahreslohn: 62500, steuerklasse: 3, jahreslohnsteuer: 8320 },
      { jahreslohn: 62500, steuerklasse: 4, jahreslohnsteuer: 14383 },
      { jahreslohn: 62500, steuerklasse: 5, jahreslohnsteuer: 20882 },
      { jahreslohn: 62500, steuerklasse: 6, jahreslohnsteuer: 21414 },
      // Zeile 25
      { jahreslohn: 65000, steuerklasse: 1, jahreslohnsteuer: 15377 },
      { jahreslohn: 65000, steuerklasse: 2, jahreslohnsteuer: 13697 },
      { jahreslohn: 65000, steuerklasse: 3, jahreslohnsteuer: 9034 },
      { jahreslohn: 65000, steuerklasse: 4, jahreslohnsteuer: 15377 },
      { jahreslohn: 65000, steuerklasse: 5, jahreslohnsteuer: 21932 },
      { jahreslohn: 65000, steuerklasse: 6, jahreslohnsteuer: 22464 },
      // Zeile 26
      { jahreslohn: 67500, steuerklasse: 1, jahreslohnsteuer: 16394 },
      { jahreslohn: 67500, steuerklasse: 2, jahreslohnsteuer: 14675 },
      { jahreslohn: 67500, steuerklasse: 3, jahreslohnsteuer: 9760 },
      { jahreslohn: 67500, steuerklasse: 4, jahreslohnsteuer: 16394 },
      { jahreslohn: 67500, steuerklasse: 5, jahreslohnsteuer: 22982 },
      { jahreslohn: 67500, steuerklasse: 6, jahreslohnsteuer: 23514 },
      // Zeile 27
      { jahreslohn: 70000, steuerklasse: 1, jahreslohnsteuer: 17433 },
      { jahreslohn: 70000, steuerklasse: 2, jahreslohnsteuer: 15676 },
      { jahreslohn: 70000, steuerklasse: 3, jahreslohnsteuer: 10498 },
      { jahreslohn: 70000, steuerklasse: 4, jahreslohnsteuer: 17433 },
      { jahreslohn: 70000, steuerklasse: 5, jahreslohnsteuer: 24032 },
      { jahreslohn: 70000, steuerklasse: 6, jahreslohnsteuer: 24564 },
      // Zeile 28
      { jahreslohn: 72500, steuerklasse: 1, jahreslohnsteuer: 18483 },
      { jahreslohn: 72500, steuerklasse: 2, jahreslohnsteuer: 16699 },
      { jahreslohn: 72500, steuerklasse: 3, jahreslohnsteuer: 11246 },
      { jahreslohn: 72500, steuerklasse: 4, jahreslohnsteuer: 18483 },
      { jahreslohn: 72500, steuerklasse: 5, jahreslohnsteuer: 25082 },
      { jahreslohn: 72500, steuerklasse: 6, jahreslohnsteuer: 25614 },
      // Zeile 29
      { jahreslohn: 75000, steuerklasse: 1, jahreslohnsteuer: 19533 },
      { jahreslohn: 75000, steuerklasse: 2, jahreslohnsteuer: 17744 },
      { jahreslohn: 75000, steuerklasse: 3, jahreslohnsteuer: 12006 },
      { jahreslohn: 75000, steuerklasse: 4, jahreslohnsteuer: 19533 },
      { jahreslohn: 75000, steuerklasse: 5, jahreslohnsteuer: 26132 },
      { jahreslohn: 75000, steuerklasse: 6, jahreslohnsteuer: 26664 },
      // Zeile 30
      { jahreslohn: 77500, steuerklasse: 1, jahreslohnsteuer: 20583 },
      { jahreslohn: 77500, steuerklasse: 2, jahreslohnsteuer: 18794 },
      { jahreslohn: 77500, steuerklasse: 3, jahreslohnsteuer: 12778 },
      { jahreslohn: 77500, steuerklasse: 4, jahreslohnsteuer: 20583 },
      { jahreslohn: 77500, steuerklasse: 5, jahreslohnsteuer: 27182 },
      { jahreslohn: 77500, steuerklasse: 6, jahreslohnsteuer: 27714 },
      // Zeile 31
      { jahreslohn: 80000, steuerklasse: 1, jahreslohnsteuer: 21633 },
      { jahreslohn: 80000, steuerklasse: 2, jahreslohnsteuer: 19844 },
      { jahreslohn: 80000, steuerklasse: 3, jahreslohnsteuer: 13560 },
      { jahreslohn: 80000, steuerklasse: 4, jahreslohnsteuer: 21633 },
      { jahreslohn: 80000, steuerklasse: 5, jahreslohnsteuer: 28232 },
      { jahreslohn: 80000, steuerklasse: 6, jahreslohnsteuer: 28764 },
      // Zeile 32
      { jahreslohn: 82500, steuerklasse: 1, jahreslohnsteuer: 22683 },
      { jahreslohn: 82500, steuerklasse: 2, jahreslohnsteuer: 20894 },
      { jahreslohn: 82500, steuerklasse: 3, jahreslohnsteuer: 14354 },
      { jahreslohn: 82500, steuerklasse: 4, jahreslohnsteuer: 22683 },
      { jahreslohn: 82500, steuerklasse: 5, jahreslohnsteuer: 29282 },
      { jahreslohn: 82500, steuerklasse: 6, jahreslohnsteuer: 29814 },
      // Zeile 33
      { jahreslohn: 85000, steuerklasse: 1, jahreslohnsteuer: 23733 },
      { jahreslohn: 85000, steuerklasse: 2, jahreslohnsteuer: 21944 },
      { jahreslohn: 85000, steuerklasse: 3, jahreslohnsteuer: 15158 },
      { jahreslohn: 85000, steuerklasse: 4, jahreslohnsteuer: 23733 },
      { jahreslohn: 85000, steuerklasse: 5, jahreslohnsteuer: 30332 },
      { jahreslohn: 85000, steuerklasse: 6, jahreslohnsteuer: 30864 },
      // Zeile 34
      { jahreslohn: 87500, steuerklasse: 1, jahreslohnsteuer: 24783 },
      { jahreslohn: 87500, steuerklasse: 2, jahreslohnsteuer: 22994 },
      { jahreslohn: 87500, steuerklasse: 3, jahreslohnsteuer: 15976 },
      { jahreslohn: 87500, steuerklasse: 4, jahreslohnsteuer: 24783 },
      { jahreslohn: 87500, steuerklasse: 5, jahreslohnsteuer: 31382 },
      { jahreslohn: 87500, steuerklasse: 6, jahreslohnsteuer: 31914 },
      // Zeile 35
      { jahreslohn: 90000, steuerklasse: 1, jahreslohnsteuer: 25833 },
      { jahreslohn: 90000, steuerklasse: 2, jahreslohnsteuer: 24044 },
      { jahreslohn: 90000, steuerklasse: 3, jahreslohnsteuer: 16804 },
      { jahreslohn: 90000, steuerklasse: 4, jahreslohnsteuer: 25833 },
      { jahreslohn: 90000, steuerklasse: 5, jahreslohnsteuer: 32432 },
      { jahreslohn: 90000, steuerklasse: 6, jahreslohnsteuer: 32964 },
      // Zeile 36
      { jahreslohn: 92500, steuerklasse: 1, jahreslohnsteuer: 26883 },
      { jahreslohn: 92500, steuerklasse: 2, jahreslohnsteuer: 25094 },
      { jahreslohn: 92500, steuerklasse: 3, jahreslohnsteuer: 17642 },
      { jahreslohn: 92500, steuerklasse: 4, jahreslohnsteuer: 26883 },
      { jahreslohn: 92500, steuerklasse: 5, jahreslohnsteuer: 33482 },
      { jahreslohn: 92500, steuerklasse: 6, jahreslohnsteuer: 34014 },
      // Zeile 37
      { jahreslohn: 95000, steuerklasse: 1, jahreslohnsteuer: 27933 },
      { jahreslohn: 95000, steuerklasse: 2, jahreslohnsteuer: 26144 },
      { jahreslohn: 95000, steuerklasse: 3, jahreslohnsteuer: 18494 },
      { jahreslohn: 95000, steuerklasse: 4, jahreslohnsteuer: 27933 },
      { jahreslohn: 95000, steuerklasse: 5, jahreslohnsteuer: 34532 },
      { jahreslohn: 95000, steuerklasse: 6, jahreslohnsteuer: 35064 },
      // Zeile 38
      { jahreslohn: 97500, steuerklasse: 1, jahreslohnsteuer: 28983 },
      { jahreslohn: 97500, steuerklasse: 2, jahreslohnsteuer: 27194 },
      { jahreslohn: 97500, steuerklasse: 3, jahreslohnsteuer: 19356 },
      { jahreslohn: 97500, steuerklasse: 4, jahreslohnsteuer: 28983 },
      { jahreslohn: 97500, steuerklasse: 5, jahreslohnsteuer: 35582 },
      { jahreslohn: 97500, steuerklasse: 6, jahreslohnsteuer: 36114 },
      // Zeile 39
      { jahreslohn: 100000, steuerklasse: 1, jahreslohnsteuer: 30033 },
      { jahreslohn: 100000, steuerklasse: 2, jahreslohnsteuer: 28244 },
      { jahreslohn: 100000, steuerklasse: 3, jahreslohnsteuer: 20228 },
      { jahreslohn: 100000, steuerklasse: 4, jahreslohnsteuer: 30033 },
      { jahreslohn: 100000, steuerklasse: 5, jahreslohnsteuer: 36632 },
      { jahreslohn: 100000, steuerklasse: 6, jahreslohnsteuer: 37164 },
    ])(
      "Besondere Prüftabelle - Jahreseinkommen: '$jahreslohn' Euro; Steuerklasse: '$steuerklasse';",
      ({ jahreslohn, steuerklasse, jahreslohnsteuer }) => {
        const programm = new PAP_2025({
          AF: 0,
          F: 0,
          KRV: 1,
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
