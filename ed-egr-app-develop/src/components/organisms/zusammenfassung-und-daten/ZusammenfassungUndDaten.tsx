import { FC } from "react";
import nsp from "../../../globals/js/namespace";
import { Button, P } from "../../atoms";
import {
  ZusammenfassungUndDatenAllgemein,
  ZusammenfassungUndDatenElternteil,
} from "../../molecules";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  AntragstellendeSelektor,
  stepAllgemeineAngabenSelectors,
} from "../../../redux/stepAllgemeineAngabenSlice";
import { resetStoreAction } from "../../../redux/resetStoreAction";
import { useNavigate } from "react-router-dom";
import { formSteps } from "../../../utils/formSteps";
import { YesNo } from "../../../globals/js/calculations/model";
import { Taetigkeit } from "../../../redux/stepEinkommenSlice";
import { Month } from "@egr/monatsplaner-app";

export const ZusammenfassungUndDaten: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    stepAllgemeineAngaben,
    stepNachwuchs,
    stepErwerbstaetigkeit,
    stepEinkommen,
    stepRechner,
    monatsplaner,
    configuration,
  } = useAppSelector((state) => state);

  const { ET1, ET2 } = useAppSelector(
    stepAllgemeineAngabenSelectors.getElternteilNames,
  );

  const allgemeineDaten = {
    nameET1: ET1,
    nameET2: ET2,
    ...stepAllgemeineAngaben,
    ...stepNachwuchs,
    ...stepRechner,
  };

  const elternteil1 = {
    stepNachwuchs,
    elternteilName: ET1,
    stepErwerbstaetigkeit: stepErwerbstaetigkeit.ET1,
    stepEinkommen: stepEinkommen.ET1,
    monatsplaner: monatsplaner.elternteile.ET1.months,
  };

  const elternteil2 = {
    stepNachwuchs,
    elternteilName: ET2,
    stepErwerbstaetigkeit: stepErwerbstaetigkeit.ET2,
    stepEinkommen: stepEinkommen.ET2,
    monatsplaner: monatsplaner.elternteile.ET2.months,
  };

  const onReset = () => {
    navigate("/");
    dispatch(resetStoreAction());
  };

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

  const getKey = (): string => {
    return `transfer-${Math.random()}`;
  };

  const isET2Present = (): boolean => {
    return stepAllgemeineAngaben.antragstellende !== "FuerMichSelbst";
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

  const onBack = () => {
    navigate(formSteps.rechnerUndPlaner.route);
  };

  return (
    <>
      <h3>Übernahme von Daten in den Elterngeld-Antrag</h3>
      <P>
        Die folgenden Eingaben könne Sie in Ihren Elterngeld-Antrag übernehmen.
        Bei Bedarf können Sie diese im Antrag noch einmal anpassen.
        <br /> Möchten Sie die Daten nicht in den Antrag übernehmen, sondern mit
        einem neuen Antrag starten, klicken Sie auf "Verwerfen".
      </P>
      <div className={nsp("zusammenfassung-und-daten")}>
        <ZusammenfassungUndDatenAllgemein allgemeineDaten={allgemeineDaten} />
        <ZusammenfassungUndDatenElternteil {...elternteil1} />
        {stepAllgemeineAngaben.antragstellende === "FuerBeide" && (
          <ZusammenfassungUndDatenElternteil {...elternteil2} />
        )}
      </div>
      <section className={nsp("zusammenfassung-und-daten-buttons")}>
        <Button onClick={onBack} label="Zurück" buttonStyle="secondary" />
        <Button
          onClick={onReset}
          label="Daten verwerfen"
          buttonStyle="secondary"
        />
        <form
          key={getKey()}
          method={"post"}
          id={"anton-remote-eao-post-form"}
          action={configuration.elternGeldDigitalWizardUrl}
          encType={"application/x-www-form-urlencoded"}
        >
          <input
            key={getKey()}
            name={"planungP1"}
            defaultValue={monthPlanner("ET1")}
            readOnly={true}
            type={"hidden"}
          />
          <input
            key={getKey()}
            name={"mehrlinge_anzahl"}
            defaultValue={stepNachwuchs.anzahlKuenftigerKinder}
            readOnly={true}
            type={"hidden"}
          />
          <input
            key={getKey()}
            name={"kind_geburtstag"}
            defaultValue={stepNachwuchs.wahrscheinlichesGeburtsDatum}
            readOnly={true}
            type={"hidden"}
          />
          <input
            key={getKey()}
            name={"alleinerziehend"}
            defaultValue={getAlleinerziehend()}
            readOnly={true}
            type={"hidden"}
          />
          <input
            key={getKey()}
            name={"mutterschaftsleistung"}
            defaultValue={getMutterschaftsleistungen()}
            readOnly={true}
            type={"hidden"}
          />
          <input
            key={getKey()}
            name={"p1_et_vorgeburt"}
            defaultValue={getEinkommenVorgeburt("ET1")}
            readOnly={true}
            type={"hidden"}
          />
          {isMischtaetigkeit("ET1") && (
              <input
                key={getKey()}
                name={"p1_vg_misch_t1"}
                defaultValue={getMischTaetigkeit("ET1", 0)}
                readOnly={true}
                type={"hidden"}
              />
            ) && (
              <input
                key={getKey()}
                name={"p1_vg_misch_t2"}
                defaultValue={getMischTaetigkeit("ET1", 1)}
                readOnly={true}
                type={"hidden"}
              />
            ) && (
              <input
                key={getKey()}
                name={"p1_vg_misch_t3"}
                defaultValue={getMischTaetigkeit("ET1", 2)}
                readOnly={true}
                type={"hidden"}
              />
            ) && (
              <input
                key={getKey()}
                name={"p1_misch_kirche"}
                defaultValue={getKirchensteuer("ET1")}
                readOnly={true}
                type={"hidden"}
              />
            )}
          <input
            key={getKey()}
            name={"p1_et_nachgeburt"}
            defaultValue={getEinkommenNachGeburt("ET1")}
            readOnly={true}
            type={"hidden"}
          />
          {hasET2Mischtaetigkeit() && (
              <input
                key={getKey()}
                name={"p2_vg_misch_t1"}
                defaultValue={getMischTaetigkeit("ET2", 0)}
                readOnly={true}
                type={"hidden"}
              />
            ) && (
              <input
                key={getKey()}
                name={"p2_vg_misch_t2"}
                defaultValue={getMischTaetigkeit("ET2", 1)}
                readOnly={true}
                type={"hidden"}
              />
            ) && (
              <input
                key={getKey()}
                name={"p2_vg_misch_t3"}
                defaultValue={getMischTaetigkeit("ET2", 2)}
                readOnly={true}
                type={"hidden"}
              />
            ) && (
              <input
                key={getKey()}
                name={"p2_misch_kirche"}
                defaultValue={getKirchensteuer("ET2")}
                readOnly={true}
                type={"hidden"}
              />
            )}
          <input
            key={getKey()}
            name={"p1_vg_kirchensteuer"}
            defaultValue={getKirchensteuer("ET1")}
            readOnly={true}
            type={"hidden"}
          />
          <input
            key={getKey()}
            name={"p1_vg_nselbst_steuerklasse"}
            defaultValue={getSteuerklasse("ET1")}
            readOnly={true}
            type={"hidden"}
          />
          {isET2Present() && (
              <input
                key={getKey()}
                name={"planungP2"}
                defaultValue={monthPlanner("ET2")}
                readOnly={true}
                type={"hidden"}
              />
            ) && (
              <input
                key={getKey()}
                name={"p2_et_vorgeburt"}
                defaultValue={getEinkommenVorgeburt("ET2")}
                readOnly={true}
                type={"hidden"}
              />
            ) && (
              <input
                key={getKey()}
                name={"p2_et_nachgeburt"}
                defaultValue={getEinkommenNachGeburt("ET2")}
                readOnly={true}
                type={"hidden"}
              />
            ) && (
              <input
                key={getKey()}
                name={"p2_vg_kirchensteuer"}
                defaultValue={getKirchensteuer("ET2")}
                readOnly={true}
                type={"hidden"}
              />
            ) && (
              <input
                key={getKey()}
                name={"p2_vg_nselbst_steuerklasse"}
                defaultValue={getSteuerklasse("ET2")}
                readOnly={true}
                type={"hidden"}
              />
            )}
          <Button label="Daten übernehmen" type={"submit"} />
        </form>
      </section>
    </>
  );
};
