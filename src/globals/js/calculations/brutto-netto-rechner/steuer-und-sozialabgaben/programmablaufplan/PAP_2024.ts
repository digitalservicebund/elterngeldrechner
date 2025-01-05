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
 * und der Maßstabsteuer für die Kirchenlohnsteuer für 2024
 *
 * https://www.bundesfinanzministerium.de/Content/DE/Downloads/Steuern/Steuerarten/Lohnsteuer/Programmablaufplan/2024-02-23-geaenderte-PAP-2024-anwendung-ab-dem-1-april-2024-anlage-1.pdf?__blob=publicationFile&v=3
 */
export class PAP_2024 extends Programmablaufplan {
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
    this.LST2024();
  }

  /**
   * 5. Programmablaufplan 2024
   * Steuerung
   *
   * Bemerkungen:
   * - vereinfacht da Lohnsteuer für mehrjährige nicht relevant ist
   * - vereinfacht da sonstige Einnahmen nicht relevant sind.
   */
  private LST2024(): void {
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
        this.BBGRV = 90600;
      } else {
        this.BBGRV = 89400;
      }

      this.RVSATZAN = 0.093;
    }

    this.BBGKVPV = 62100;
    this.KVSATZAN = this.eingangsparameter.KVZ / 2 / 100 + 0.07;
    this.KVSATZAG = 0.0085 + 0.07;

    if (this.eingangsparameter.PVS === 1) {
      this.PVSATZAN = 0.022;
      this.PVSATZAG = 0.012;
    } else {
      this.PVSATZAN = 0.017;
      this.PVSATZAG = 0.017;
    }

    if (this.eingangsparameter.PVZ === 1) {
      this.PVSATZAN = this.PVSATZAN + 0.006;
    } else {
      this.PVSATZAN = this.PVSATZAN - this.eingangsparameter.PVA * 0.0025;
    }

    this.W1STKL5 = 13279;
    this.W2STKL5 = 33380;
    this.W3STKL5 = 222260;
    this.GFB = 11604;
    this.SOLZFREI = 18130;
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
   * Ermittlung der Jahreslohnsteuer auf laufende Lohnzahlungszeiträume
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
      this.KFB = this.eingangsparameter.ZKF * 9312;
    } else if (this.eingangsparameter.STKL === 2) {
      this.EFA = 4260;
      this.SAP = 36;
      this.KFB = this.eingangsparameter.ZKF * 9312;
    } else if (this.eingangsparameter.STKL === 3) {
      this.KZTAB = 2;
      this.SAP = 36;
      this.KFB = this.eingangsparameter.ZKF * 9312;
    } else if (this.eingangsparameter.STKL === 4) {
      this.SAP = 36;
      this.KFB = this.eingangsparameter.ZKF * 4656;
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
    if (this.eingangsparameter.KRV > 1) {
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
      this.RW = this.Y * 922.98;
      this.RW = this.RW + 1400;
      this.ST = aufDenEuroAbrunden(this.RW * this.Y);
    }
    //
    else if (this.X < 66761) {
      this.Y = (this.X - 17005) / 10000;
      this.RW = this.Y * 181.19;
      this.RW = this.RW + 2397;
      this.RW = this.RW * this.Y;
      this.ST = aufDenEuroAbrunden(this.RW + 1025.38);
    }
    //
    else if (this.X < 277826) {
      this.ST = aufDenEuroAbrunden(this.X * 0.42 - 10602.13);
    }
    //
    else {
      this.ST = aufDenEuroAbrunden(this.X * 0.45 - 18936.88);
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
      { jahreslohn: 17500, steuerklasse: 1, jahreslohnsteuer: 165 },
      { jahreslohn: 17500, steuerklasse: 2, jahreslohnsteuer: 0 },
      { jahreslohn: 17500, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 17500, steuerklasse: 4, jahreslohnsteuer: 165 },
      { jahreslohn: 17500, steuerklasse: 5, jahreslohnsteuer: 1778 },
      { jahreslohn: 17500, steuerklasse: 6, jahreslohnsteuer: 2150 },
      // Zeile 7
      { jahreslohn: 20000, steuerklasse: 1, jahreslohnsteuer: 550 },
      { jahreslohn: 20000, steuerklasse: 2, jahreslohnsteuer: 0 },
      { jahreslohn: 20000, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 20000, steuerklasse: 4, jahreslohnsteuer: 550 },
      { jahreslohn: 20000, steuerklasse: 5, jahreslohnsteuer: 2516 },
      { jahreslohn: 20000, steuerklasse: 6, jahreslohnsteuer: 3048 },
      // Zeile 8
      { jahreslohn: 22500, steuerklasse: 1, jahreslohnsteuer: 990 },
      { jahreslohn: 22500, steuerklasse: 2, jahreslohnsteuer: 169 },
      { jahreslohn: 22500, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 22500, steuerklasse: 4, jahreslohnsteuer: 990 },
      { jahreslohn: 22500, steuerklasse: 5, jahreslohnsteuer: 3361 },
      { jahreslohn: 22500, steuerklasse: 6, jahreslohnsteuer: 3893 },
      // Zeile 9
      { jahreslohn: 25000, steuerklasse: 1, jahreslohnsteuer: 1478 },
      { jahreslohn: 25000, steuerklasse: 2, jahreslohnsteuer: 533 },
      { jahreslohn: 25000, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 25000, steuerklasse: 4, jahreslohnsteuer: 1478 },
      { jahreslohn: 25000, steuerklasse: 5, jahreslohnsteuer: 4207 },
      { jahreslohn: 25000, steuerklasse: 6, jahreslohnsteuer: 4739 },
      // Zeile 10
      { jahreslohn: 27500, steuerklasse: 1, jahreslohnsteuer: 1982 },
      { jahreslohn: 27500, steuerklasse: 2, jahreslohnsteuer: 974 },
      { jahreslohn: 27500, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 27500, steuerklasse: 4, jahreslohnsteuer: 1982 },
      { jahreslohn: 27500, steuerklasse: 5, jahreslohnsteuer: 5053 },
      { jahreslohn: 27500, steuerklasse: 6, jahreslohnsteuer: 5585 },
      // Zeile 11
      { jahreslohn: 30000, steuerklasse: 1, jahreslohnsteuer: 2501 },
      { jahreslohn: 30000, steuerklasse: 2, jahreslohnsteuer: 1466 },
      { jahreslohn: 30000, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 30000, steuerklasse: 4, jahreslohnsteuer: 2501 },
      { jahreslohn: 30000, steuerklasse: 5, jahreslohnsteuer: 5899 },
      { jahreslohn: 30000, steuerklasse: 6, jahreslohnsteuer: 6420 },
      // Zeile 12
      { jahreslohn: 32500, steuerklasse: 1, jahreslohnsteuer: 3033 },
      { jahreslohn: 32500, steuerklasse: 2, jahreslohnsteuer: 1973 },
      { jahreslohn: 32500, steuerklasse: 3, jahreslohnsteuer: 250 },
      { jahreslohn: 32500, steuerklasse: 4, jahreslohnsteuer: 3033 },
      { jahreslohn: 32500, steuerklasse: 5, jahreslohnsteuer: 6686 },
      { jahreslohn: 32500, steuerklasse: 6, jahreslohnsteuer: 7146 },
      // Zeile 13
      { jahreslohn: 35000, steuerklasse: 1, jahreslohnsteuer: 3581 },
      { jahreslohn: 35000, steuerklasse: 2, jahreslohnsteuer: 2495 },
      { jahreslohn: 35000, steuerklasse: 3, jahreslohnsteuer: 584 },
      { jahreslohn: 35000, steuerklasse: 4, jahreslohnsteuer: 3581 },
      { jahreslohn: 35000, steuerklasse: 5, jahreslohnsteuer: 7422 },
      { jahreslohn: 35000, steuerklasse: 6, jahreslohnsteuer: 7900 },
      // Zeile 14
      { jahreslohn: 37500, steuerklasse: 1, jahreslohnsteuer: 4144 },
      { jahreslohn: 37500, steuerklasse: 2, jahreslohnsteuer: 3032 },
      { jahreslohn: 37500, steuerklasse: 3, jahreslohnsteuer: 954 },
      { jahreslohn: 37500, steuerklasse: 4, jahreslohnsteuer: 4144 },
      { jahreslohn: 37500, steuerklasse: 5, jahreslohnsteuer: 8190 },
      { jahreslohn: 37500, steuerklasse: 6, jahreslohnsteuer: 8686 },
      // Zeile 15
      { jahreslohn: 40000, steuerklasse: 1, jahreslohnsteuer: 4721 },
      { jahreslohn: 40000, steuerklasse: 2, jahreslohnsteuer: 3583 },
      { jahreslohn: 40000, steuerklasse: 3, jahreslohnsteuer: 1360 },
      { jahreslohn: 40000, steuerklasse: 4, jahreslohnsteuer: 4721 },
      { jahreslohn: 40000, steuerklasse: 5, jahreslohnsteuer: 8986 },
      { jahreslohn: 40000, steuerklasse: 6, jahreslohnsteuer: 9500 },
      // Zeile 16
      { jahreslohn: 42500, steuerklasse: 1, jahreslohnsteuer: 5313 },
      { jahreslohn: 42500, steuerklasse: 2, jahreslohnsteuer: 4150 },
      { jahreslohn: 42500, steuerklasse: 3, jahreslohnsteuer: 1804 },
      { jahreslohn: 42500, steuerklasse: 4, jahreslohnsteuer: 5313 },
      { jahreslohn: 42500, steuerklasse: 5, jahreslohnsteuer: 9810 },
      { jahreslohn: 42500, steuerklasse: 6, jahreslohnsteuer: 10338 },
      // Zeile 17
      { jahreslohn: 45000, steuerklasse: 1, jahreslohnsteuer: 5919 },
      { jahreslohn: 45000, steuerklasse: 2, jahreslohnsteuer: 4732 },
      { jahreslohn: 45000, steuerklasse: 3, jahreslohnsteuer: 2284 },
      { jahreslohn: 45000, steuerklasse: 4, jahreslohnsteuer: 5919 },
      { jahreslohn: 45000, steuerklasse: 5, jahreslohnsteuer: 10652 },
      { jahreslohn: 45000, steuerklasse: 6, jahreslohnsteuer: 11184 },
      // Zeile 18
      { jahreslohn: 47500, steuerklasse: 1, jahreslohnsteuer: 6541 },
      { jahreslohn: 47500, steuerklasse: 2, jahreslohnsteuer: 5328 },
      { jahreslohn: 47500, steuerklasse: 3, jahreslohnsteuer: 2774 },
      { jahreslohn: 47500, steuerklasse: 4, jahreslohnsteuer: 6541 },
      { jahreslohn: 47500, steuerklasse: 5, jahreslohnsteuer: 11498 },
      { jahreslohn: 47500, steuerklasse: 6, jahreslohnsteuer: 12030 },
      // Zeile 19
      { jahreslohn: 50000, steuerklasse: 1, jahreslohnsteuer: 7177 },
      { jahreslohn: 50000, steuerklasse: 2, jahreslohnsteuer: 5940 },
      { jahreslohn: 50000, steuerklasse: 3, jahreslohnsteuer: 3270 },
      { jahreslohn: 50000, steuerklasse: 4, jahreslohnsteuer: 7177 },
      { jahreslohn: 50000, steuerklasse: 5, jahreslohnsteuer: 12344 },
      { jahreslohn: 50000, steuerklasse: 6, jahreslohnsteuer: 12875 },
      // Zeile 20
      { jahreslohn: 52500, steuerklasse: 1, jahreslohnsteuer: 7827 },
      { jahreslohn: 52500, steuerklasse: 2, jahreslohnsteuer: 6566 },
      { jahreslohn: 52500, steuerklasse: 3, jahreslohnsteuer: 3776 },
      { jahreslohn: 52500, steuerklasse: 4, jahreslohnsteuer: 7827 },
      { jahreslohn: 52500, steuerklasse: 5, jahreslohnsteuer: 13189 },
      { jahreslohn: 52500, steuerklasse: 6, jahreslohnsteuer: 13721 },
      // Zeile 21
      { jahreslohn: 55000, steuerklasse: 1, jahreslohnsteuer: 8492 },
      { jahreslohn: 55000, steuerklasse: 2, jahreslohnsteuer: 7208 },
      { jahreslohn: 55000, steuerklasse: 3, jahreslohnsteuer: 4288 },
      { jahreslohn: 55000, steuerklasse: 4, jahreslohnsteuer: 8492 },
      { jahreslohn: 55000, steuerklasse: 5, jahreslohnsteuer: 14035 },
      { jahreslohn: 55000, steuerklasse: 6, jahreslohnsteuer: 14567 },
      // Zeile 22
      { jahreslohn: 57500, steuerklasse: 1, jahreslohnsteuer: 9172 },
      { jahreslohn: 57500, steuerklasse: 2, jahreslohnsteuer: 7864 },
      { jahreslohn: 57500, steuerklasse: 3, jahreslohnsteuer: 4806 },
      { jahreslohn: 57500, steuerklasse: 4, jahreslohnsteuer: 9172 },
      { jahreslohn: 57500, steuerklasse: 5, jahreslohnsteuer: 14881 },
      { jahreslohn: 57500, steuerklasse: 6, jahreslohnsteuer: 15413 },
      // Zeile 23
      { jahreslohn: 60000, steuerklasse: 1, jahreslohnsteuer: 9867 },
      { jahreslohn: 60000, steuerklasse: 2, jahreslohnsteuer: 8535 },
      { jahreslohn: 60000, steuerklasse: 3, jahreslohnsteuer: 5334 },
      { jahreslohn: 60000, steuerklasse: 4, jahreslohnsteuer: 9867 },
      { jahreslohn: 60000, steuerklasse: 5, jahreslohnsteuer: 15727 },
      { jahreslohn: 60000, steuerklasse: 6, jahreslohnsteuer: 16259 },
      // Zeile 24
      { jahreslohn: 62500, steuerklasse: 1, jahreslohnsteuer: 10591 },
      { jahreslohn: 62500, steuerklasse: 2, jahreslohnsteuer: 9234 },
      { jahreslohn: 62500, steuerklasse: 3, jahreslohnsteuer: 5878 },
      { jahreslohn: 62500, steuerklasse: 4, jahreslohnsteuer: 10591 },
      { jahreslohn: 62500, steuerklasse: 5, jahreslohnsteuer: 16589 },
      { jahreslohn: 62500, steuerklasse: 6, jahreslohnsteuer: 17121 },
      // Zeile 25
      { jahreslohn: 65000, steuerklasse: 1, jahreslohnsteuer: 11407 },
      { jahreslohn: 65000, steuerklasse: 2, jahreslohnsteuer: 10019 },
      { jahreslohn: 65000, steuerklasse: 3, jahreslohnsteuer: 6488 },
      { jahreslohn: 65000, steuerklasse: 4, jahreslohnsteuer: 11407 },
      { jahreslohn: 65000, steuerklasse: 5, jahreslohnsteuer: 17542 },
      { jahreslohn: 65000, steuerklasse: 6, jahreslohnsteuer: 18073 },
      // Zeile 26
      { jahreslohn: 67500, steuerklasse: 1, jahreslohnsteuer: 12243 },
      { jahreslohn: 67500, steuerklasse: 2, jahreslohnsteuer: 10822 },
      { jahreslohn: 67500, steuerklasse: 3, jahreslohnsteuer: 7108 },
      { jahreslohn: 67500, steuerklasse: 4, jahreslohnsteuer: 12243 },
      { jahreslohn: 67500, steuerklasse: 5, jahreslohnsteuer: 18494 },
      { jahreslohn: 67500, steuerklasse: 6, jahreslohnsteuer: 19026 },
      // Zeile 27
      { jahreslohn: 70000, steuerklasse: 1, jahreslohnsteuer: 13097 },
      { jahreslohn: 70000, steuerklasse: 2, jahreslohnsteuer: 11644 },
      { jahreslohn: 70000, steuerklasse: 3, jahreslohnsteuer: 7736 },
      { jahreslohn: 70000, steuerklasse: 4, jahreslohnsteuer: 13097 },
      { jahreslohn: 70000, steuerklasse: 5, jahreslohnsteuer: 19446 },
      { jahreslohn: 70000, steuerklasse: 6, jahreslohnsteuer: 19978 },
      // Zeile 28
      { jahreslohn: 72500, steuerklasse: 1, jahreslohnsteuer: 13969 },
      { jahreslohn: 72500, steuerklasse: 2, jahreslohnsteuer: 12485 },
      { jahreslohn: 72500, steuerklasse: 3, jahreslohnsteuer: 8374 },
      { jahreslohn: 72500, steuerklasse: 4, jahreslohnsteuer: 13969 },
      { jahreslohn: 72500, steuerklasse: 5, jahreslohnsteuer: 20399 },
      { jahreslohn: 72500, steuerklasse: 6, jahreslohnsteuer: 20931 },
      // Zeile 29
      { jahreslohn: 75000, steuerklasse: 1, jahreslohnsteuer: 14861 },
      { jahreslohn: 75000, steuerklasse: 2, jahreslohnsteuer: 13344 },
      { jahreslohn: 75000, steuerklasse: 3, jahreslohnsteuer: 9022 },
      { jahreslohn: 75000, steuerklasse: 4, jahreslohnsteuer: 14861 },
      { jahreslohn: 75000, steuerklasse: 5, jahreslohnsteuer: 21351 },
      { jahreslohn: 75000, steuerklasse: 6, jahreslohnsteuer: 21883 },
      // Zeile 30
      { jahreslohn: 77500, steuerklasse: 1, jahreslohnsteuer: 15771 },
      { jahreslohn: 77500, steuerklasse: 2, jahreslohnsteuer: 14222 },
      { jahreslohn: 77500, steuerklasse: 3, jahreslohnsteuer: 9678 },
      { jahreslohn: 77500, steuerklasse: 4, jahreslohnsteuer: 15771 },
      { jahreslohn: 77500, steuerklasse: 5, jahreslohnsteuer: 22304 },
      { jahreslohn: 77500, steuerklasse: 6, jahreslohnsteuer: 22835 },
      // Zeile 31
      { jahreslohn: 80000, steuerklasse: 1, jahreslohnsteuer: 16699 },
      { jahreslohn: 80000, steuerklasse: 2, jahreslohnsteuer: 15119 },
      { jahreslohn: 80000, steuerklasse: 3, jahreslohnsteuer: 10346 },
      { jahreslohn: 80000, steuerklasse: 4, jahreslohnsteuer: 16699 },
      { jahreslohn: 80000, steuerklasse: 5, jahreslohnsteuer: 23256 },
      { jahreslohn: 80000, steuerklasse: 6, jahreslohnsteuer: 23787 },
      // Zeile 32
      { jahreslohn: 82500, steuerklasse: 1, jahreslohnsteuer: 17646 },
      { jahreslohn: 82500, steuerklasse: 2, jahreslohnsteuer: 16034 },
      { jahreslohn: 82500, steuerklasse: 3, jahreslohnsteuer: 11020 },
      { jahreslohn: 82500, steuerklasse: 4, jahreslohnsteuer: 17646 },
      { jahreslohn: 82500, steuerklasse: 5, jahreslohnsteuer: 24208 },
      { jahreslohn: 82500, steuerklasse: 6, jahreslohnsteuer: 24740 },
      // Zeile 33
      { jahreslohn: 85000, steuerklasse: 1, jahreslohnsteuer: 18598 },
      { jahreslohn: 85000, steuerklasse: 2, jahreslohnsteuer: 16968 },
      { jahreslohn: 85000, steuerklasse: 3, jahreslohnsteuer: 11706 },
      { jahreslohn: 85000, steuerklasse: 4, jahreslohnsteuer: 18598 },
      { jahreslohn: 85000, steuerklasse: 5, jahreslohnsteuer: 25160 },
      { jahreslohn: 85000, steuerklasse: 6, jahreslohnsteuer: 25692 },
      // Zeile 34
      { jahreslohn: 87500, steuerklasse: 1, jahreslohnsteuer: 19550 },
      { jahreslohn: 87500, steuerklasse: 2, jahreslohnsteuer: 17917 },
      { jahreslohn: 87500, steuerklasse: 3, jahreslohnsteuer: 12400 },
      { jahreslohn: 87500, steuerklasse: 4, jahreslohnsteuer: 19550 },
      { jahreslohn: 87500, steuerklasse: 5, jahreslohnsteuer: 26113 },
      { jahreslohn: 87500, steuerklasse: 6, jahreslohnsteuer: 26645 },
      // Zeile 35
      { jahreslohn: 90000, steuerklasse: 1, jahreslohnsteuer: 20503 },
      { jahreslohn: 90000, steuerklasse: 2, jahreslohnsteuer: 18870 },
      { jahreslohn: 90000, steuerklasse: 3, jahreslohnsteuer: 13102 },
      { jahreslohn: 90000, steuerklasse: 4, jahreslohnsteuer: 20503 },
      { jahreslohn: 90000, steuerklasse: 5, jahreslohnsteuer: 27065 },
      { jahreslohn: 90000, steuerklasse: 6, jahreslohnsteuer: 27597 },
      // Zeile 36
      { jahreslohn: 92500, steuerklasse: 1, jahreslohnsteuer: 21529 },
      { jahreslohn: 92500, steuerklasse: 2, jahreslohnsteuer: 19897 },
      { jahreslohn: 92500, steuerklasse: 3, jahreslohnsteuer: 13872 },
      { jahreslohn: 92500, steuerklasse: 4, jahreslohnsteuer: 21529 },
      { jahreslohn: 92500, steuerklasse: 5, jahreslohnsteuer: 28092 },
      { jahreslohn: 92500, steuerklasse: 6, jahreslohnsteuer: 28624 },
      // Zeile 37
      { jahreslohn: 95000, steuerklasse: 1, jahreslohnsteuer: 22579 },
      { jahreslohn: 95000, steuerklasse: 2, jahreslohnsteuer: 20947 },
      { jahreslohn: 95000, steuerklasse: 3, jahreslohnsteuer: 14668 },
      { jahreslohn: 95000, steuerklasse: 4, jahreslohnsteuer: 22579 },
      { jahreslohn: 95000, steuerklasse: 5, jahreslohnsteuer: 29142 },
      { jahreslohn: 95000, steuerklasse: 6, jahreslohnsteuer: 29674 },
      // Zeile 38
      { jahreslohn: 97500, steuerklasse: 1, jahreslohnsteuer: 23629 },
      { jahreslohn: 97500, steuerklasse: 2, jahreslohnsteuer: 21997 },
      { jahreslohn: 97500, steuerklasse: 3, jahreslohnsteuer: 15478 },
      { jahreslohn: 97500, steuerklasse: 4, jahreslohnsteuer: 23629 },
      { jahreslohn: 97500, steuerklasse: 5, jahreslohnsteuer: 30192 },
      { jahreslohn: 97500, steuerklasse: 6, jahreslohnsteuer: 30724 },
      // Zeile 39
      { jahreslohn: 100000, steuerklasse: 1, jahreslohnsteuer: 24679 },
      { jahreslohn: 100000, steuerklasse: 2, jahreslohnsteuer: 23047 },
      { jahreslohn: 100000, steuerklasse: 3, jahreslohnsteuer: 16298 },
      { jahreslohn: 100000, steuerklasse: 4, jahreslohnsteuer: 24679 },
      { jahreslohn: 100000, steuerklasse: 5, jahreslohnsteuer: 31242 },
      { jahreslohn: 100000, steuerklasse: 6, jahreslohnsteuer: 31774 },
    ])(
      "Allgemeine Prüftabelle - Jahreslohn: '$jahreslohn' Euro; Steuerklasse: '$steuerklasse';",
      ({ jahreslohn, steuerklasse, jahreslohnsteuer }) => {
        const programm = new PAP_2024({
          AF: 0,
          F: 0,
          KRV: 0,
          KVZ: 1.7,
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
      { jahreslohn: 15000, steuerklasse: 1, jahreslohnsteuer: 47 },
      { jahreslohn: 15000, steuerklasse: 2, jahreslohnsteuer: 0 },
      { jahreslohn: 15000, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 15000, steuerklasse: 4, jahreslohnsteuer: 47 },
      { jahreslohn: 15000, steuerklasse: 5, jahreslohnsteuer: 1670 },
      { jahreslohn: 15000, steuerklasse: 6, jahreslohnsteuer: 1848 },
      // Zeile 6
      { jahreslohn: 17500, steuerklasse: 1, jahreslohnsteuer: 450 },
      { jahreslohn: 17500, steuerklasse: 2, jahreslohnsteuer: 0 },
      { jahreslohn: 17500, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 17500, steuerklasse: 4, jahreslohnsteuer: 450 },
      { jahreslohn: 17500, steuerklasse: 5, jahreslohnsteuer: 2302 },
      { jahreslohn: 17500, steuerklasse: 6, jahreslohnsteuer: 2833 },
      // Zeile 7
      { jahreslohn: 20000, steuerklasse: 1, jahreslohnsteuer: 984 },
      { jahreslohn: 20000, steuerklasse: 2, jahreslohnsteuer: 144 },
      { jahreslohn: 20000, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 20000, steuerklasse: 4, jahreslohnsteuer: 984 },
      { jahreslohn: 20000, steuerklasse: 5, jahreslohnsteuer: 3352 },
      { jahreslohn: 20000, steuerklasse: 6, jahreslohnsteuer: 3883 },
      // Zeile 8
      { jahreslohn: 22500, steuerklasse: 1, jahreslohnsteuer: 1593 },
      { jahreslohn: 22500, steuerklasse: 2, jahreslohnsteuer: 596 },
      { jahreslohn: 22500, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 22500, steuerklasse: 4, jahreslohnsteuer: 1593 },
      { jahreslohn: 22500, steuerklasse: 5, jahreslohnsteuer: 4402 },
      { jahreslohn: 22500, steuerklasse: 6, jahreslohnsteuer: 4933 },
      // Zeile 9
      { jahreslohn: 25000, steuerklasse: 1, jahreslohnsteuer: 2225 },
      { jahreslohn: 25000, steuerklasse: 2, jahreslohnsteuer: 1162 },
      { jahreslohn: 25000, steuerklasse: 3, jahreslohnsteuer: 0 },
      { jahreslohn: 25000, steuerklasse: 4, jahreslohnsteuer: 2225 },
      { jahreslohn: 25000, steuerklasse: 5, jahreslohnsteuer: 5452 },
      { jahreslohn: 25000, steuerklasse: 6, jahreslohnsteuer: 5983 },
      // Zeile 10
      { jahreslohn: 27500, steuerklasse: 1, jahreslohnsteuer: 2879 },
      { jahreslohn: 27500, steuerklasse: 2, jahreslohnsteuer: 1778 },
      { jahreslohn: 27500, steuerklasse: 3, jahreslohnsteuer: 2 },
      { jahreslohn: 27500, steuerklasse: 4, jahreslohnsteuer: 2879 },
      { jahreslohn: 27500, steuerklasse: 5, jahreslohnsteuer: 6480 },
      { jahreslohn: 27500, steuerklasse: 6, jahreslohnsteuer: 6934 },
      // Zeile 11
      { jahreslohn: 30000, steuerklasse: 1, jahreslohnsteuer: 3556 },
      { jahreslohn: 30000, steuerklasse: 2, jahreslohnsteuer: 2416 },
      { jahreslohn: 30000, steuerklasse: 3, jahreslohnsteuer: 382 },
      { jahreslohn: 30000, steuerklasse: 4, jahreslohnsteuer: 3556 },
      { jahreslohn: 30000, steuerklasse: 5, jahreslohnsteuer: 7386 },
      { jahreslohn: 30000, steuerklasse: 6, jahreslohnsteuer: 7866 },
      // Zeile 12
      { jahreslohn: 32500, steuerklasse: 1, jahreslohnsteuer: 4256 },
      { jahreslohn: 32500, steuerklasse: 2, jahreslohnsteuer: 3077 },
      { jahreslohn: 32500, steuerklasse: 3, jahreslohnsteuer: 820 },
      { jahreslohn: 32500, steuerklasse: 4, jahreslohnsteuer: 4256 },
      { jahreslohn: 32500, steuerklasse: 5, jahreslohnsteuer: 8340 },
      { jahreslohn: 32500, steuerklasse: 6, jahreslohnsteuer: 8842 },
      // Zeile 13
      { jahreslohn: 35000, steuerklasse: 1, jahreslohnsteuer: 4978 },
      { jahreslohn: 35000, steuerklasse: 2, jahreslohnsteuer: 3761 },
      { jahreslohn: 35000, steuerklasse: 3, jahreslohnsteuer: 1314 },
      { jahreslohn: 35000, steuerklasse: 4, jahreslohnsteuer: 4978 },
      { jahreslohn: 35000, steuerklasse: 5, jahreslohnsteuer: 9342 },
      { jahreslohn: 35000, steuerklasse: 6, jahreslohnsteuer: 9864 },
      // Zeile 14
      { jahreslohn: 37500, steuerklasse: 1, jahreslohnsteuer: 5723 },
      { jahreslohn: 37500, steuerklasse: 2, jahreslohnsteuer: 4467 },
      { jahreslohn: 37500, steuerklasse: 3, jahreslohnsteuer: 1866 },
      { jahreslohn: 37500, steuerklasse: 4, jahreslohnsteuer: 5723 },
      { jahreslohn: 37500, steuerklasse: 5, jahreslohnsteuer: 10380 },
      { jahreslohn: 37500, steuerklasse: 6, jahreslohnsteuer: 10912 },
      // Zeile 15
      { jahreslohn: 40000, steuerklasse: 1, jahreslohnsteuer: 6490 },
      { jahreslohn: 40000, steuerklasse: 2, jahreslohnsteuer: 5196 },
      { jahreslohn: 40000, steuerklasse: 3, jahreslohnsteuer: 2466 },
      { jahreslohn: 40000, steuerklasse: 4, jahreslohnsteuer: 6490 },
      { jahreslohn: 40000, steuerklasse: 5, jahreslohnsteuer: 11430 },
      { jahreslohn: 40000, steuerklasse: 6, jahreslohnsteuer: 11962 },
      // Zeile 16
      { jahreslohn: 42500, steuerklasse: 1, jahreslohnsteuer: 7281 },
      { jahreslohn: 42500, steuerklasse: 2, jahreslohnsteuer: 5948 },
      { jahreslohn: 42500, steuerklasse: 3, jahreslohnsteuer: 3078 },
      { jahreslohn: 42500, steuerklasse: 4, jahreslohnsteuer: 7281 },
      { jahreslohn: 42500, steuerklasse: 5, jahreslohnsteuer: 12480 },
      { jahreslohn: 42500, steuerklasse: 6, jahreslohnsteuer: 13012 },
      // Zeile 17
      { jahreslohn: 45000, steuerklasse: 1, jahreslohnsteuer: 8093 },
      { jahreslohn: 45000, steuerklasse: 2, jahreslohnsteuer: 6722 },
      { jahreslohn: 45000, steuerklasse: 3, jahreslohnsteuer: 3702 },
      { jahreslohn: 45000, steuerklasse: 4, jahreslohnsteuer: 8093 },
      { jahreslohn: 45000, steuerklasse: 5, jahreslohnsteuer: 13530 },
      { jahreslohn: 45000, steuerklasse: 6, jahreslohnsteuer: 14062 },
      // Zeile 18
      { jahreslohn: 47500, steuerklasse: 1, jahreslohnsteuer: 8929 },
      { jahreslohn: 47500, steuerklasse: 2, jahreslohnsteuer: 7519 },
      { jahreslohn: 47500, steuerklasse: 3, jahreslohnsteuer: 4338 },
      { jahreslohn: 47500, steuerklasse: 4, jahreslohnsteuer: 8929 },
      { jahreslohn: 47500, steuerklasse: 5, jahreslohnsteuer: 14580 },
      { jahreslohn: 47500, steuerklasse: 6, jahreslohnsteuer: 15112 },
      // Zeile 19
      { jahreslohn: 50000, steuerklasse: 1, jahreslohnsteuer: 9787 },
      { jahreslohn: 50000, steuerklasse: 2, jahreslohnsteuer: 8338 },
      { jahreslohn: 50000, steuerklasse: 3, jahreslohnsteuer: 4984 },
      { jahreslohn: 50000, steuerklasse: 4, jahreslohnsteuer: 9787 },
      { jahreslohn: 50000, steuerklasse: 5, jahreslohnsteuer: 15630 },
      { jahreslohn: 50000, steuerklasse: 6, jahreslohnsteuer: 16162 },
      // Zeile 20
      { jahreslohn: 52500, steuerklasse: 1, jahreslohnsteuer: 10668 },
      { jahreslohn: 52500, steuerklasse: 2, jahreslohnsteuer: 9181 },
      { jahreslohn: 52500, steuerklasse: 3, jahreslohnsteuer: 5642 },
      { jahreslohn: 52500, steuerklasse: 4, jahreslohnsteuer: 10668 },
      { jahreslohn: 52500, steuerklasse: 5, jahreslohnsteuer: 16680 },
      { jahreslohn: 52500, steuerklasse: 6, jahreslohnsteuer: 17212 },
      // Zeile 21
      { jahreslohn: 55000, steuerklasse: 1, jahreslohnsteuer: 11571 },
      { jahreslohn: 55000, steuerklasse: 2, jahreslohnsteuer: 10045 },
      { jahreslohn: 55000, steuerklasse: 3, jahreslohnsteuer: 6312 },
      { jahreslohn: 55000, steuerklasse: 4, jahreslohnsteuer: 11571 },
      { jahreslohn: 55000, steuerklasse: 5, jahreslohnsteuer: 17730 },
      { jahreslohn: 55000, steuerklasse: 6, jahreslohnsteuer: 18262 },
      // Zeile 22
      { jahreslohn: 57500, steuerklasse: 1, jahreslohnsteuer: 12497 },
      { jahreslohn: 57500, steuerklasse: 2, jahreslohnsteuer: 10933 },
      { jahreslohn: 57500, steuerklasse: 3, jahreslohnsteuer: 6992 },
      { jahreslohn: 57500, steuerklasse: 4, jahreslohnsteuer: 12497 },
      { jahreslohn: 57500, steuerklasse: 5, jahreslohnsteuer: 18780 },
      { jahreslohn: 57500, steuerklasse: 6, jahreslohnsteuer: 19312 },
      // Zeile 23
      { jahreslohn: 60000, steuerklasse: 1, jahreslohnsteuer: 13446 },
      { jahreslohn: 60000, steuerklasse: 2, jahreslohnsteuer: 11843 },
      { jahreslohn: 60000, steuerklasse: 3, jahreslohnsteuer: 7684 },
      { jahreslohn: 60000, steuerklasse: 4, jahreslohnsteuer: 13446 },
      { jahreslohn: 60000, steuerklasse: 5, jahreslohnsteuer: 19830 },
      { jahreslohn: 60000, steuerklasse: 6, jahreslohnsteuer: 20362 },
      // Zeile 24
      { jahreslohn: 62500, steuerklasse: 1, jahreslohnsteuer: 14418 },
      { jahreslohn: 62500, steuerklasse: 2, jahreslohnsteuer: 12776 },
      { jahreslohn: 62500, steuerklasse: 3, jahreslohnsteuer: 8388 },
      { jahreslohn: 62500, steuerklasse: 4, jahreslohnsteuer: 14418 },
      { jahreslohn: 62500, steuerklasse: 5, jahreslohnsteuer: 20880 },
      { jahreslohn: 62500, steuerklasse: 6, jahreslohnsteuer: 21412 },
      // Zeile 25
      { jahreslohn: 65000, steuerklasse: 1, jahreslohnsteuer: 15412 },
      { jahreslohn: 65000, steuerklasse: 2, jahreslohnsteuer: 13731 },
      { jahreslohn: 65000, steuerklasse: 3, jahreslohnsteuer: 9102 },
      { jahreslohn: 65000, steuerklasse: 4, jahreslohnsteuer: 15412 },
      { jahreslohn: 65000, steuerklasse: 5, jahreslohnsteuer: 21930 },
      { jahreslohn: 65000, steuerklasse: 6, jahreslohnsteuer: 22462 },
      // Zeile 26
      { jahreslohn: 67500, steuerklasse: 1, jahreslohnsteuer: 16428 },
      { jahreslohn: 67500, steuerklasse: 2, jahreslohnsteuer: 14709 },
      { jahreslohn: 67500, steuerklasse: 3, jahreslohnsteuer: 9828 },
      { jahreslohn: 67500, steuerklasse: 4, jahreslohnsteuer: 16428 },
      { jahreslohn: 67500, steuerklasse: 5, jahreslohnsteuer: 22980 },
      { jahreslohn: 67500, steuerklasse: 6, jahreslohnsteuer: 23512 },
      // Zeile 27
      { jahreslohn: 70000, steuerklasse: 1, jahreslohnsteuer: 17468 },
      { jahreslohn: 70000, steuerklasse: 2, jahreslohnsteuer: 15710 },
      { jahreslohn: 70000, steuerklasse: 3, jahreslohnsteuer: 10566 },
      { jahreslohn: 70000, steuerklasse: 4, jahreslohnsteuer: 17468 },
      { jahreslohn: 70000, steuerklasse: 5, jahreslohnsteuer: 24030 },
      { jahreslohn: 70000, steuerklasse: 6, jahreslohnsteuer: 24562 },
      // Zeile 28
      { jahreslohn: 72500, steuerklasse: 1, jahreslohnsteuer: 18518 },
      { jahreslohn: 72500, steuerklasse: 2, jahreslohnsteuer: 16734 },
      { jahreslohn: 72500, steuerklasse: 3, jahreslohnsteuer: 11314 },
      { jahreslohn: 72500, steuerklasse: 4, jahreslohnsteuer: 18518 },
      { jahreslohn: 72500, steuerklasse: 5, jahreslohnsteuer: 25080 },
      { jahreslohn: 72500, steuerklasse: 6, jahreslohnsteuer: 25612 },
      // Zeile 29
      { jahreslohn: 75000, steuerklasse: 1, jahreslohnsteuer: 19568 },
      { jahreslohn: 75000, steuerklasse: 2, jahreslohnsteuer: 17778 },
      { jahreslohn: 75000, steuerklasse: 3, jahreslohnsteuer: 12074 },
      { jahreslohn: 75000, steuerklasse: 4, jahreslohnsteuer: 19568 },
      { jahreslohn: 75000, steuerklasse: 5, jahreslohnsteuer: 26130 },
      { jahreslohn: 75000, steuerklasse: 6, jahreslohnsteuer: 26662 },
      // Zeile 30
      { jahreslohn: 77500, steuerklasse: 1, jahreslohnsteuer: 20618 },
      { jahreslohn: 77500, steuerklasse: 2, jahreslohnsteuer: 18828 },
      { jahreslohn: 77500, steuerklasse: 3, jahreslohnsteuer: 12846 },
      { jahreslohn: 77500, steuerklasse: 4, jahreslohnsteuer: 20618 },
      { jahreslohn: 77500, steuerklasse: 5, jahreslohnsteuer: 27180 },
      { jahreslohn: 77500, steuerklasse: 6, jahreslohnsteuer: 27712 },
      // Zeile 31
      { jahreslohn: 80000, steuerklasse: 1, jahreslohnsteuer: 21668 },
      { jahreslohn: 80000, steuerklasse: 2, jahreslohnsteuer: 19878 },
      { jahreslohn: 80000, steuerklasse: 3, jahreslohnsteuer: 13628 },
      { jahreslohn: 80000, steuerklasse: 4, jahreslohnsteuer: 21668 },
      { jahreslohn: 80000, steuerklasse: 5, jahreslohnsteuer: 28230 },
      { jahreslohn: 80000, steuerklasse: 6, jahreslohnsteuer: 28762 },
      // Zeile 32
      { jahreslohn: 82500, steuerklasse: 1, jahreslohnsteuer: 22718 },
      { jahreslohn: 82500, steuerklasse: 2, jahreslohnsteuer: 20928 },
      { jahreslohn: 82500, steuerklasse: 3, jahreslohnsteuer: 14422 },
      { jahreslohn: 82500, steuerklasse: 4, jahreslohnsteuer: 22718 },
      { jahreslohn: 82500, steuerklasse: 5, jahreslohnsteuer: 29280 },
      { jahreslohn: 82500, steuerklasse: 6, jahreslohnsteuer: 29812 },
      // Zeile 33
      { jahreslohn: 85000, steuerklasse: 1, jahreslohnsteuer: 23768 },
      { jahreslohn: 85000, steuerklasse: 2, jahreslohnsteuer: 21978 },
      { jahreslohn: 85000, steuerklasse: 3, jahreslohnsteuer: 15228 },
      { jahreslohn: 85000, steuerklasse: 4, jahreslohnsteuer: 23768 },
      { jahreslohn: 85000, steuerklasse: 5, jahreslohnsteuer: 30330 },
      { jahreslohn: 85000, steuerklasse: 6, jahreslohnsteuer: 30862 },
      // Zeile 34
      { jahreslohn: 87500, steuerklasse: 1, jahreslohnsteuer: 24818 },
      { jahreslohn: 87500, steuerklasse: 2, jahreslohnsteuer: 23028 },
      { jahreslohn: 87500, steuerklasse: 3, jahreslohnsteuer: 16044 },
      { jahreslohn: 87500, steuerklasse: 4, jahreslohnsteuer: 24818 },
      { jahreslohn: 87500, steuerklasse: 5, jahreslohnsteuer: 31380 },
      { jahreslohn: 87500, steuerklasse: 6, jahreslohnsteuer: 31912 },
      // Zeile 35
      { jahreslohn: 90000, steuerklasse: 1, jahreslohnsteuer: 25868 },
      { jahreslohn: 90000, steuerklasse: 2, jahreslohnsteuer: 24078 },
      { jahreslohn: 90000, steuerklasse: 3, jahreslohnsteuer: 16872 },
      { jahreslohn: 90000, steuerklasse: 4, jahreslohnsteuer: 25868 },
      { jahreslohn: 90000, steuerklasse: 5, jahreslohnsteuer: 32430 },
      { jahreslohn: 90000, steuerklasse: 6, jahreslohnsteuer: 32962 },
      // Zeile 36
      { jahreslohn: 92500, steuerklasse: 1, jahreslohnsteuer: 26918 },
      { jahreslohn: 92500, steuerklasse: 2, jahreslohnsteuer: 25128 },
      { jahreslohn: 92500, steuerklasse: 3, jahreslohnsteuer: 17710 },
      { jahreslohn: 92500, steuerklasse: 4, jahreslohnsteuer: 26918 },
      { jahreslohn: 92500, steuerklasse: 5, jahreslohnsteuer: 33480 },
      { jahreslohn: 92500, steuerklasse: 6, jahreslohnsteuer: 34012 },
      // Zeile 37
      { jahreslohn: 95000, steuerklasse: 1, jahreslohnsteuer: 27968 },
      { jahreslohn: 95000, steuerklasse: 2, jahreslohnsteuer: 26178 },
      { jahreslohn: 95000, steuerklasse: 3, jahreslohnsteuer: 18562 },
      { jahreslohn: 95000, steuerklasse: 4, jahreslohnsteuer: 27968 },
      { jahreslohn: 95000, steuerklasse: 5, jahreslohnsteuer: 34530 },
      { jahreslohn: 95000, steuerklasse: 6, jahreslohnsteuer: 35062 },
      // Zeile 38
      { jahreslohn: 97500, steuerklasse: 1, jahreslohnsteuer: 29018 },
      { jahreslohn: 97500, steuerklasse: 2, jahreslohnsteuer: 27228 },
      { jahreslohn: 97500, steuerklasse: 3, jahreslohnsteuer: 19424 },
      { jahreslohn: 97500, steuerklasse: 4, jahreslohnsteuer: 29018 },
      { jahreslohn: 97500, steuerklasse: 5, jahreslohnsteuer: 35580 },
      { jahreslohn: 97500, steuerklasse: 6, jahreslohnsteuer: 36112 },
      // Zeile 39
      { jahreslohn: 100000, steuerklasse: 1, jahreslohnsteuer: 30068 },
      { jahreslohn: 100000, steuerklasse: 2, jahreslohnsteuer: 28278 },
      { jahreslohn: 100000, steuerklasse: 3, jahreslohnsteuer: 20296 },
      { jahreslohn: 100000, steuerklasse: 4, jahreslohnsteuer: 30068 },
      { jahreslohn: 100000, steuerklasse: 5, jahreslohnsteuer: 36630 },
      { jahreslohn: 100000, steuerklasse: 6, jahreslohnsteuer: 37162 },
    ])(
      "Besondere Prüftabelle - Jahreseinkommen: '$jahreslohn' Euro; Steuerklasse: '$steuerklasse';",
      ({ jahreslohn, steuerklasse, jahreslohnsteuer }) => {
        const programm = new PAP_2024({
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
