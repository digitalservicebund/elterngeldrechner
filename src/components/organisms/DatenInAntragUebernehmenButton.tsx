// import { Button } from "@/components/atoms";
import { AntragstellendeSelektor } from "@/redux/stepAllgemeineAngabenSlice";
import { YesNo } from "@/globals/js/calculations/model";
import { Taetigkeit } from "@/redux/stepEinkommenSlice";
import { Month } from "@/monatsplaner";
import { useAppStore } from "@/redux/hooks";

export function DatenInAntragUebernehmenButton() {
  const store = useAppStore();
  const {
    stepAllgemeineAngaben,
    stepNachwuchs,
    stepErwerbstaetigkeit,
    stepEinkommen,
    stepRechner,
    monatsplaner,
    configuration,
  } = store.getState();

  const mapYesNo = (yesNo: YesNo | null): string => {
    return yesNo === YesNo.YES ? "1" : "0";
  };

  const getAlleinerziehend = (): string => {
    return mapYesNo(stepAllgemeineAngaben.alleinerziehend);
  };

  const getSteuerklasse = (elternteil: AntragstellendeSelektor): string => {
    return stepEinkommen[elternteil].steuerKlasse ?? "";
  };

  const getMischTaetigkeit = (
    elternteil: AntragstellendeSelektor,
    position: number,
  ): string => {
    const taetigkeit: Taetigkeit =
      stepEinkommen[elternteil].taetigkeitenNichtSelbstaendigUndSelbstaendig[
        position
      ];
    switch (taetigkeit?.artTaetigkeit) {
      case "NichtSelbststaendig":
        return "2";
      case "Selbststaendig":
        return "1";
    }
    return "";
  };

  const getEinkommenNachGeburt = (
    elternteil: AntragstellendeSelektor,
  ): string => {
    return stepRechner[elternteil].bruttoEinkommenZeitraum.length > 0
      ? "1"
      : "0";
  };

  const isET2Present = (): boolean => {
    return stepAllgemeineAngaben.antragstellende !== "EinenElternteil";
  };

  const hasET2Mischtaetigkeit = (): boolean => {
    return isET2Present() && isMischtaetigkeit("ET2");
  };

  const isMischtaetigkeit = (elternteil: AntragstellendeSelektor): boolean => {
    const erwerbstaetigkeit = stepErwerbstaetigkeit[elternteil];
    return (
      erwerbstaetigkeit.isNichtSelbststaendig &&
      erwerbstaetigkeit.isSelbststaendig
    );
  };

  const getKirchensteuer = (elternteil: AntragstellendeSelektor): string => {
    return mapYesNo(stepEinkommen[elternteil].zahlenSieKirchenSteuer);
  };

  const getEinkommenVorgeburt = (
    elternteil: AntragstellendeSelektor,
  ): string => {
    return mapYesNo(stepErwerbstaetigkeit[elternteil].vorGeburt);
  };

  const getMutterschaftsleistungen = (): string => {
    return mapYesNo(stepAllgemeineAngaben.mutterschaftssleistungen);
  };

  const monthPlanner = (elternteil: AntragstellendeSelektor): string => {
    const months = monatsplaner.elternteile[elternteil].months;
    return months
      .map((month: Month) => {
        switch (month.type) {
          case "BEG":
            return "1";
          case "EG+":
            return "2";
          case "PSB":
            return "3";
        }
        return "0";
      })
      .join(",");
  };

  return (
    <>
      <form
        method="post"
        id="anton-remote-eao-post-form"
        action={configuration.elternGeldDigitalWizardUrl}
        encType="application/x-www-form-urlencoded"
      >
        <input
          name="planungP1"
          defaultValue={monthPlanner("ET1")}
          readOnly
          type="hidden"
        />
        <input
          name="mehrlinge_anzahl"
          defaultValue={stepNachwuchs.anzahlKuenftigerKinder}
          readOnly
          type="hidden"
        />
        <input
          name="kind_geburtstag"
          defaultValue={stepNachwuchs.wahrscheinlichesGeburtsDatum}
          readOnly
          type="hidden"
        />
        <input
          name="alleinerziehend"
          defaultValue={getAlleinerziehend()}
          readOnly
          type="hidden"
        />
        <input
          name="mutterschaftsleistung"
          defaultValue={getMutterschaftsleistungen()}
          readOnly
          type="hidden"
        />
        <input
          name="p1_et_vorgeburt"
          defaultValue={getEinkommenVorgeburt("ET1")}
          readOnly
          type="hidden"
        />
        {isMischtaetigkeit("ET1") ? (
          <>
            <input
              name="p1_vg_misch_t1"
              defaultValue={getMischTaetigkeit("ET1", 0)}
              readOnly
              type="hidden"
            />
            <input
              name="p1_vg_misch_t2"
              defaultValue={getMischTaetigkeit("ET1", 1)}
              readOnly
              type="hidden"
            />
            <input
              name="p1_vg_misch_t3"
              defaultValue={getMischTaetigkeit("ET1", 2)}
              readOnly
              type="hidden"
            />
            <input
              name="p1_misch_kirche"
              defaultValue={getKirchensteuer("ET1")}
              readOnly
              type="hidden"
            />
          </>
        ) : null}
        <input
          name="p1_et_nachgeburt"
          defaultValue={getEinkommenNachGeburt("ET1")}
          readOnly
          type="hidden"
        />
        {hasET2Mischtaetigkeit() ? (
          <>
            <input
              name="p2_vg_misch_t1"
              defaultValue={getMischTaetigkeit("ET2", 0)}
              readOnly
              type="hidden"
            />
            <input
              name="p2_vg_misch_t2"
              defaultValue={getMischTaetigkeit("ET2", 1)}
              readOnly
              type="hidden"
            />
            <input
              name="p2_vg_misch_t3"
              defaultValue={getMischTaetigkeit("ET2", 2)}
              readOnly
              type="hidden"
            />
            <input
              name="p2_misch_kirche"
              defaultValue={getKirchensteuer("ET2")}
              readOnly
              type="hidden"
            />
          </>
        ) : null}
        <input
          name="p1_vg_kirchensteuer"
          defaultValue={getKirchensteuer("ET1")}
          readOnly
          type="hidden"
        />
        <input
          name="p1_vg_nselbst_steuerklasse"
          defaultValue={getSteuerklasse("ET1")}
          readOnly
          type="hidden"
        />
        {isET2Present() ? (
          <>
            <input
              name="planungP2"
              defaultValue={monthPlanner("ET2")}
              readOnly
              type="hidden"
            />
            <input
              name="p2_et_vorgeburt"
              defaultValue={getEinkommenVorgeburt("ET2")}
              readOnly
              type="hidden"
            />
            <input
              name="p2_et_nachgeburt"
              defaultValue={getEinkommenNachGeburt("ET2")}
              readOnly
              type="hidden"
            />
            <input
              name="p2_vg_kirchensteuer"
              defaultValue={getKirchensteuer("ET2")}
              readOnly
              type="hidden"
            />
            <input
              name="p2_vg_nselbst_steuerklasse"
              defaultValue={getSteuerklasse("ET2")}
              readOnly
              type="hidden"
            />
          </>
        ) : null}
        {/* Hide button until data filling is fixed in Antrag <Button label="Daten in Elterngeldantrag übernehmen" isSubmitButton /> */}
      </form>
    </>
  );
}
