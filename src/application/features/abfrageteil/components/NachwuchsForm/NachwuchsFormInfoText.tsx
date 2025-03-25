export function NachwuchsFormInfoText() {
  return (
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
  );
}
