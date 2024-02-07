import { StepAllgemeineAngabenState } from "../../../redux/stepAllgemeineAngabenSlice";
import { StepNachwuchsState } from "../../../redux/stepNachwuchsSlice";
import { QuestionAnswer } from "../../atoms/question-answer";
import nsp from "../../../globals/js/namespace";
import { antragstellendeLabels } from "../../organisms";
import { yesNoLabels } from "../yes-no-radio";

type Props = {
  allgemeineDaten: StepAllgemeineAngabenState & StepNachwuchsState;
};

const ZusammenfassungUndDatenAllgemein = ({ allgemeineDaten }: Props) => {
  return (
    <div className={nsp("zusammenfassung-und-daten-allgemein")}>
      <h4>Allgemeine Daten</h4>

      <QuestionAnswer
        question="Für wen planen Sie Elterngeld zu beantragen?"
        answer={antragstellendeLabels[allgemeineDaten.antragstellende!]}
      />

      <QuestionAnswer
        question="Bezieht einer der beiden Elternteile Mutterschaftsgeld?"
        answer={yesNoLabels[allgemeineDaten.mutterschaftssleistungen!]}
      />

      <QuestionAnswer
        question="Wann wird Ihr Kind voraussichtlich geboren?"
        answer={allgemeineDaten.wahrscheinlichesGeburtsDatum.toString()}
      />

      <QuestionAnswer
        question="Anzahl erwarteter Kinder"
        answer={allgemeineDaten.anzahlKuenftigerKinder.toString()}
      />
    </div>
  );
};

export default ZusammenfassungUndDatenAllgemein;
