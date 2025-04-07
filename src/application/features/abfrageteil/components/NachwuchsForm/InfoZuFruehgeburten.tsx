import { InfoText } from "@/application/components";

export function InfoZuFruehgeburten() {
  return (
    <InfoText
      question="Kam Ihr Kind zu früh zur Welt?"
      answer={
        <>
          <p>
            Wenn Ihr Kind zu früh zur Welt kommt, können Sie länger Elterngeld
            bekommen. Dabei kommt es auf den errechneten Geburtstermin an:
          </p>

          <ul className="list-inside list-disc">
            <li>
              mindestens 6 Wochen zu früh: 1 zusätzlicher Monat Basiselterngeld
            </li>
            <li>
              mindestens 8 Wochen zu früh: 2 zusätzliche Monate Basiselterngeld
            </li>
            <li>
              mindestens 12 Wochen zu früh: 3 zusätzliche Monate Basiselterngeld
            </li>
            <li>
              mindestens 16 Wochen zu früh: 4 zusätzliche Monate Basiselterngeld
            </li>
          </ul>

          <p>
            Wie sonst auch, können Sie jeden dieser Monate mit Basiselterngeld
            tauschen in jeweils 2 Monate mit ElterngeldPlus.
            <br />
            Für die vorliegende Berechnung werden diese zusätzlichen Monate
            nicht berücksichtigt.
            <br />
            Diese Fälle bilden wir mit dem Elterngeldrechner mit Planer nicht
            ab. Wenden Sie sich bei Fragen bitte an{" "}
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
      }
    />
  );
}
