export interface Info {
  id: string;
  text: string;
}

export const infoTexts: Record<string, Info> = {
  erwerbstaetigkeitNichtSelbststaendig: {
    id: "info-1",
    text: "z.B. Lohn, Gehalt (auch aus einem Minijob)",
  },

  erwerbstaetigkeitGewinneinkuenfte: {
    id: "info-2",
    text: "Einkünfte aus einem Gewerbebetrieb (auch z.B. aus dem Betrieb einer Fotovoltaik-Anlage), Einkünfte aus selbständiger Arbeit (auch z.B. aus einem Nebenberuf), Einkünfte aus Land- und Forstwirtschaft",
  },

  erwerbstaetigkeitNichtSelbststaendigGewinneinkuenfte: {
    id: "info-2",
    text: `Einkünfte aus nichtselbständiger Arbeit: z.B. Lohn Gehalt (auch aus einem Minijob) oder Gewinneinkünfte: Einkünfte aus einem Gewerbebetrieb (auch z.B. aus dem Betrieb einer Fotovoltaik-Anlage), Einkünfte aus selbständiger Arbeit (auch z.B. aus einem Nebenberuf), Einkünfte aus Land- und Forstwirtschaft`,
  },

  einkommenNichtSelbststaendig: {
    id: "info-3",
    text: "Als Einkommen werden alle Einkünfte aus Ihrer nicht-selbständigen Tätigkeit im Bemessungszeitraum berücksichtigt. Nicht berücksichtigt werden sonstige Bezüge, z.B. Abfindungen, Leistungsprämien, Provisionen, 13. Monatsgehälter. Steuerfreie Einnahmen werden ebenfalls nicht berücksichtigt, z.B. Trinkgelder, steuerfreie Zuschläge, Krankengeld, Kurzarbeitergeld, ALG II",
  },

  einkommenGewinneinkuenfte: {
    id: "info-4",
    text: "Dies ergibt sich aus Ihrem letzten oder vorletzten Steuerbescheid oder Sie können schätzen",
  },

  einkommenSteuerklasse: {
    id: "info-5",
    text: "Das Faktorverfahren in der Steuerklassenkombination IV/IV wird in der vorliegenden Berechnung nicht berücksichtigt. Der Standardwert 1,0 ist festgelegt. Sollte Ihr Faktor kleiner als 1,0 sein, wirkt sich dies entsprechend auf die Höhe des Elterngeldes aus. Sie erhalten dann mehr Elterngeld (im unteren zweistelligen Bereich)",
  },

  minijobsMaxZahl: {
    id: "info-6",
    text: "geringfügige Beschäftigung bis max. 520 Euro monatlich, vor dem 01.10.2022: bis max. 450 Euro monatlich",
  },

  monatsplannerBasis: {
    id: "info-7",
    text: `Basiselterngeld können Sie für bis zu 12 Lebensmonate Ihres Kindes bekommen. Wenn Sie beide Elterngeld beantragen und mindestens einer von Ihnen nach der Geburt weniger Einkommen hat als davor, können Sie 2 zusätzliche Monate erhalten, die sogenannten „Partnermonate“.

    Sie können die Elterngeldmonate nach Ihren Wünschen untereinander aufteilen. Sie können zum Beispiel gleichzeitig oder abwechselnd Elterngeld beantragen. Allerdings muss jeder von Ihnen mindestens 2 Monate beantragen. Jeden Lebensmonat, in dem Sie gleichzeitig Basiselterngeld beziehen, verbrauchen Sie zusammen 2 Monate Basiselterngeld.
    
    Die leibliche Mutter bekommt in den ersten Lebensmonaten meistens Mutterschaftsgeld oder andere Mutterschaftsleistungen, bei einer privaten Krankenversicherung möglicherweise Krankentagegeld während des Mutterschutzes. In diesen Fällen gelten diese Monate bei ihr automatisch als Monate mit Basiselterngeld. Das bedeutet: Sie verbraucht diese Monate als Basiselterngeldmonate. Als leibliche Mutter sollten Sie daher auf jeden Fall Basiselterngeld beantragen, solange Sie Mutterschaftsleistungen erhalten.
    
    Basiselterngeld können Sie nur in den ersten 14 Lebensmonaten beziehen.
    
    Wenn Sie alleinerziehend sind und nach der Geburt weniger Einkommen haben als davor, können Sie die Partnermonate auch bekommen, wenn der andere Elternteil weder mit Ihnen noch mit dem Kind zusammen wohnt und Sie steuerrechtlich als alleinerziehend gelten.`,
  },

  monatsplannerPlus: {
    id: "info-8",
    text: `Jeden Monat Basiselterngeld können Sie tauschen in 2 Monate ElterngeldPlus. Wenn Sie nach der Geburt kein zusätzliches Einkommen neben dem Elterngeld haben, ist das monatliche ElterngeldPlus dafür halb so hoch wie das monatliche Basiselterngeld. Sie bekommen also dasselbe Geld über den doppelten Zeitraum verteilt.
    
    Wenn Sie nach der Geburt zusätzliches Einkommen haben, zum Beispiel weil Sie Teilzeit arbeiten, dann kann das ElterngeldPlus genauso hoch sein wie das Basiselterngeld beim selben Einkommen. Dann können Sie mit zwei Monaten ElterngeldPlus also insgesamt mehr Geld bekommen als mit einem Monat Basiselterngeld.
    
    Basiselterngeld und ElterngeldPlus können Sie miteinander kombinieren und abwechseln.
    
    Anders als Basiselterngeld können Sie ElterngeldPlus auch noch nach dem 14. Lebensmonat bekommen. Ab dann dürfen Sie Elterngeld aber nur noch ohne Unterbrechungen beziehen. Das bedeutet: Sie können keine Pause vom Elterngeld machen und später wieder Elterngeld für das Kind bekommen. Wenn der andere Elternteil ebenfalls Elterngeld beantragt, können Sie sich aber abwechseln.
    
    Bei der leiblichen Mutter ist ElterngeldPlus nicht möglich in den Lebensmonaten, in denen sie Mutterschaftsleistungen bekommt.`,
  },

  monatsplannerBonus: {
    id: "info-9",
    text: `Mit dem Partnerschaftsbonus können Sie zusätzliche ElterngeldPlus- Monate bekommen. Er richtet sich an Eltern, die sich Familie und Beruf partnerschaftlich aufteilen. Jeder Elternteil kann zwischen zwei und vier zusätzliche Monate bekommen. Voraussetzungen:

    1. Beide Eltern nutzen den Partnerschaftsbonus gleichzeitig.
    2. Sie beantragen den Partnerschaftsbonus für mindestens zwei und höchstens vier Lebensmonate, die direkt aufeinander folgen.
    3. Sie beide arbeiten in dieser Zeit Teilzeit, und zwar jeder mindestens 24 und höchstens 32 Stunden pro Woche.

    Bei den Stunden zählt der Durchschnitt pro Lebensmonat. Wenn Sie alleinerziehend sind und 24 bis 32 Stunden pro Woche arbeiten, können Sie das Angebot auch allein nutzen (siehe unten: Erleichterung für Alleinerziehende)`,
  },

  monatsplannerMutterschaftsleistungen: {
    id: "info-10",
    text: `In den ersten zwei oder drei Lebensmonaten bekommt die leibliche Mutter meistens Mutterschaftsleistungen. Dann gelten diese Monate bei ihr automatisch als Monate mit Basiselterngeld`,
  },

  kindGeburtsdatum: {
    id: "info-11",
    text: `Wenn Ihr Kind zu früh zur Welt kommt, können Sie länger Elterngeld bekommen. Dabei kommt es auf den errechneten Geburtstermin an:
    
    mindestens 6 Wochen zu früh: 
    1 zusätzlicher Monat Basiselterngeld
    
    mindestens 8 Wochen zu früh: 
    2 zusätzliche Monate Basiselterngeld
    
    mindestens 12 Wochen zu früh: 
    3 zusätzliche Monat Basiselterngeld
    
    mindestens 16 Wochen zu früh: 
    4 zusätzliche Monate Basiselterngeld
    
    Wie sonst auch, können Sie jeden dieser Monate mit Basiselterngeld tauschen in jeweils 2 Monate mit ElterngeldPlus.
    Für die vorliegende Berechnung werden diese zusätzlichen Monate nicht berücksichtigt`,
  },

  alleinerziehend: {
    id: "info-12",
    text: `Als alleinerziehend gelten Sie, wenn der andere Elternteil weder mit Ihnen noch mit dem Kind zusammen wohnt und Sie steuerrechtlich als alleinerziehend gelten.`,
  },

  einkommenLimitÜberschritten: {
    id: "info-13",
    text: "Wenn Sie besonders viel Einkommen haben, können Sie kein Elterngeld bekommen. Elterngeld ist ausgeschlossen ab einem zu versteuernden Jahreseinkommen von mehr als 200.000 Euro bei Alleinerziehenden, Paaren und getrennt Erziehenden. Diese Angabe finden Sie beispielsweise auf Ihrem Steuerbescheid.",
  },
};
