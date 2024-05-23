import nsp from "@/globals/js/namespace";
import {
  StepErwerbstaetigkeitElternteil,
  stepErwerbstaetigkeitElternteilSelectors,
} from "@/redux/stepErwerbstaetigkeitSlice";
import { StepEinkommenElternteil } from "@/redux/stepEinkommenSlice";
import { QuestionAnswer } from "@/components/atoms/question-answer";
import { erwerbstaetigkeitLabels } from "@/components/organisms";
import { yesNoLabels } from "@/components/molecules/yes-no-radio";
import { StepNachwuchsState } from "@/redux/stepNachwuchsSlice";
import { Month } from "@/monatsplaner";
import { ElterngeldType } from "@/monatsplaner/elternteile/elternteile-types";

interface Props {
  elternteilName: string;
  stepNachwuchs: StepNachwuchsState;
  stepErwerbstaetigkeit: StepErwerbstaetigkeitElternteil;
  stepEinkommen: StepEinkommenElternteil;
  monatsplaner: readonly Month[];
}

const getHumanReadableMonthType: { [K in ElterngeldType]: string } = {
  None: "-",
  PSB: "Partnerschaftsbonus",
  BEG: "Basiselterngeld",
  "EG+": "ElterngeldPlus",
};

function ZusammenfassungUndDatenElternteil({
  elternteilName,
  stepErwerbstaetigkeit,
  stepEinkommen,
  monatsplaner,
}: Props) {
  const isErwerbstaetigVorGeburt =
    stepErwerbstaetigkeitElternteilSelectors.isErwerbstaetigVorGeburt(
      stepErwerbstaetigkeit,
    );
  const isOnlySelbstaendig =
    stepErwerbstaetigkeitElternteilSelectors.isOnlySelbstaendig(
      stepErwerbstaetigkeit,
    );
  const isSelbstaendigAndErwerbstaetig =
    stepErwerbstaetigkeitElternteilSelectors.isSelbstaendigAndErwerbstaetig(
      stepErwerbstaetigkeit,
    );
  const hasMiniJob =
    isErwerbstaetigVorGeburt &&
    stepErwerbstaetigkeit.monatlichesBrutto === "MiniJob";

  return (
    <div className={nsp("zusammenfassung-und-daten-elternteil")}>
      <h4>{elternteilName}</h4>
      <QuestionAnswer
        question="Waren Sie in den 12 Monaten vor der Geburt des Kindes erwerbstätig?"
        answer={yesNoLabels[stepErwerbstaetigkeit.vorGeburt!]}
      />
      {!!isErwerbstaetigVorGeburt && (
        <>
          {!hasMiniJob && (
            <>
              <QuestionAnswer
                question="Sind Sie kirchensteuerpflichtig?"
                answer={yesNoLabels[stepEinkommen.zahlenSieKirchenSteuer!]}
              />
              {!isOnlySelbstaendig && (
                <QuestionAnswer
                  question="Welche Steuerklasse haben Sie?"
                  answer={stepEinkommen.steuerKlasse!}
                />
              )}
            </>
          )}

          {!!isSelbstaendigAndErwerbstaetig && (
            <ol>
              {stepEinkommen.taetigkeitenNichtSelbstaendigUndSelbstaendig.map(
                (taetigkeit, index) => (
                  <li key={index}>
                    <h5>{index + 1}. Tätigkeit</h5>
                    <QuestionAnswer
                      question="Art der Tätigkeit"
                      answer={
                        erwerbstaetigkeitLabels[taetigkeit.artTaetigkeit!]
                      }
                    />
                  </li>
                ),
              )}
            </ol>
          )}
        </>
      )}
      <h5>Geplante Lebensmonate:</h5>
      {monatsplaner.filter((monat) => monat.type !== "None").length === 0 ? (
        "Keine"
      ) : (
        <ol>
          {monatsplaner.map((monat, index) => {
            if (monat.type === "None") return "";

            return (
              <li key={index}>{`${index + 1}. Lebensmonat: ${
                getHumanReadableMonthType[monat.type]
              }`}</li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

export default ZusammenfassungUndDatenElternteil;
