import nsp from "../../../globals/js/namespace";
import { P } from "../paragraph";
import { VFC } from "react";

interface Props {
  question: string;
  answer: string;
}

export const QuestionAnswer: VFC<Props> = ({ question, answer }) => {
  return (
    <div className={nsp("question-answer")}>
      <P>{question}</P>
      <P className={nsp("question-answer__answer")}>{answer}</P>
    </div>
  );
};
