import nsp from "../../../globals/js/namespace";
import { VFC } from "react";

interface Props {
  question: string;
  answer: string;
}

export const QuestionAnswer: VFC<Props> = ({ question, answer }) => {
  return (
    <div className={nsp("question-answer")}>
      <span>{question}</span>
      <span className={nsp("question-answer__answer")}>{answer}</span>
    </div>
  );
};
