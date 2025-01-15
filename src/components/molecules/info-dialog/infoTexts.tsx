import { ReactNode } from "react";

export type Info = string | ReactNode;

export const infoTexts = {
  erwerbstaetigkeitNichtSelbststaendig:
    "z.B. Lohn, Gehalt (auch aus einem Minijob)",

  erwerbstaetigkeitGewinneinkuenfte:
    "Einkünfte aus einem Gewerbebetrieb (auch z.B. aus dem Betrieb einer Fotovoltaik-Anlage), Einkünfte aus selbständiger Arbeit (auch z.B. aus einem Nebenberuf), Einkünfte aus Land- und Forstwirtschaft",

  erwerbstaetigkeitNichtSelbststaendigGewinneinkuenfte:
    "Einkünfte aus nichtselbständiger Arbeit: z.B. Lohn Gehalt (auch aus einem Minijob) oder Gewinneinkünfte: Einkünfte aus einem Gewerbebetrieb (auch z.B. aus dem Betrieb einer Fotovoltaik-Anlage), Einkünfte aus selbständiger Arbeit (auch z.B. aus einem Nebenberuf), Einkünfte aus Land- und Forstwirtschaft",

  einkommenNichtSelbststaendig:
    "Als Einkommen werden alle Einkünfte aus Ihrer nicht-selbständigen Tätigkeit im Bemessungszeitraum berücksichtigt. Nicht berücksichtigt werden sonstige Bezüge, z.B. Abfindungen, Leistungsprämien, Provisionen, 13. Monatsgehälter. Steuerfreie Einnahmen werden ebenfalls nicht berücksichtigt, z.B. Trinkgelder, steuerfreie Zuschläge, Krankengeld, Kurzarbeitergeld, ALG II",

  einkommenGewinneinkuenfte:
    "Dies ergibt sich aus Ihrem letzten oder vorletzten Steuerbescheid oder Sie können schätzen",

  einkommenSteuerklasse:
    "Das Faktorverfahren in der Steuerklassenkombination IV/IV wird in der vorliegenden Berechnung nicht berücksichtigt. Der Standardwert 1,0 ist festgelegt. Sollte Ihr Faktor kleiner als 1,0 sein, wirkt sich dies entsprechend auf die Höhe des Elterngeldes aus. Sie erhalten dann mehr Elterngeld (im unteren zweistelligen Bereich)",

  minijobsMaxZahl: `Mini-Job - geringfügige Beschäftigung bis maximal 538 Euro monatlich
- vor dem 01.01.2024: bis maximal 520 Euro monatlich
- vor dem 01.10.2022: bis maximal 450 Euro monatlich`,

  monatsplannerMutterschaftsleistungen:
    "In den ersten zwei oder drei Lebensmonaten bekommt die leibliche Mutter meistens Mutterschaftsleistungen. Dann gelten diese Monate bei ihr automatisch als Monate mit Basiselterngeld",

  kindGeburtsdatum: (
    <>
      <p>
        Wenn Ihr Kind zu früh zur Welt kommt, können Sie länger Elterngeld
        bekommen. Dabei kommt es auf den errechneten Geburtstermin an:
      </p>
      <dl>
        <div className="mb-8">
          <dt>mindestens 6 Wochen zu früh:</dt>
          <dd className="ml-0">1 zusätzlicher Monat Basiselterngeld</dd>
        </div>
        <div className="mb-8">
          <dt>mindestens 8 Wochen zu früh:</dt>
          <dd className="ml-0">2 zusätzliche Monate Basiselterngeld</dd>
        </div>
        <div className="mb-8">
          <dt>mindestens 12 Wochen zu früh:</dt>
          <dd className="ml-0">3 zusätzliche Monate Basiselterngeld</dd>
        </div>
        <div>
          <dt>mindestens 16 Wochen zu früh:</dt>
          <dd className="ml-0">4 zusätzliche Monate Basiselterngeld</dd>
        </div>
      </dl>
      <p>
        Wie sonst auch, können Sie jeden dieser Monate mit Basiselterngeld
        tauschen in jeweils 2 Monate mit ElterngeldPlus.
      </p>
      <p>
        Für die vorliegende Berechnung werden diese zusätzlichen Monate nicht
        berücksichtigt.
      </p>
      <p>
        Diese Fälle bilden wir mit dem Elterngeldrechner mit Planer nicht ab.
        Wenden Sie sich bei Fragen bitte an{" "}
        <a
          href="https://familienportal.de/familienportal/125008!zip-search?state=H4sIAAAAAAAA_1WOuw7CMAxFfwV5zgBrNlToXKRuqEPUuBApJMV2eFX9d9LC0G6-D-vcAawRLCneQIfkvZp1HZdqSmt8ybqxdBLj_mnIHnICujOecTaPDwyyMntvXCidF6RTQnLIoM-Ngs60KPkeRgVXJ1whVeaS_3ZbBffcfIMGUPBxfREt_gRHyhOA20i4scgtzNQJWMTAQpklf_T4BeexQ4PqAAAA&service=99041006&zipCodeCityQuery"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          Ihre Elterngeldstelle
        </a>
        .
      </p>
    </>
  ),

  alleinerziehend:
    "Als alleinerziehend gelten Sie, wenn der andere Elternteil weder mit Ihnen noch mit dem Kind zusammen wohnt und Sie steuerrechtlich als alleinerziehend gelten.",

  einkommenLimitUeberschritten:
    "Wenn Sie besonders viel Einkommen haben, können Sie kein Elterngeld bekommen. Elterngeld ist ausgeschlossen ab einem zu versteuernden Jahreseinkommen von mehr als 200.000 Euro bei Alleinerziehenden, Paaren und getrennt Erziehenden. Diese Angabe finden Sie beispielsweise auf Ihrem Steuerbescheid. Wenn Sie Ihr Kind alleine erziehen, geben Sie nur Ihr eigenes Einkommen an. Als Paar oder getrennt erziehende Eltern rechnen Sie das Einkommen beider Elternteile zusammen.",

  mutterschaftsleistungen: (
    <>
      <p>
        Während des Mutterschutzes erhalten Sie Mutterschaftsleistungen, zum
        Beispiel:
      </p>
      <ul className="list-disc pl-24">
        <li>das Mutterschaftsgeld der gesetzlichen Krankenkassen</li>
        <li>der Arbeitgeber-Zuschuss zum Mutterschaftsgeld</li>
        <li>die Bezüge für Beamtinnen während des Mutterschutzes</li>
      </ul>
      <p>
        Diese werden – wenn ein Anspruch darauf besteht – normalerweise in den
        ersten acht Wochen nach der Geburt gezahlt.
      </p>
    </>
  ),
};
