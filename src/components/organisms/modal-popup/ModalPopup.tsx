import React from "react";
import nsp from "../../../globals/js/namespace";
import { Button } from "../../atoms";

interface Props {
  text: string;
  buttonLabel: string;
  onClick: () => void;
}

export default function ModalPupup({ text, buttonLabel, onClick }: Props) {
  return (
    <div className={nsp("modal-popup")}>
      <div className={nsp("modal-popup__info")}>
        <p>{text}</p>
        <Button
          className={nsp("modal-popup__btn")}
          onClick={onClick}
          label={buttonLabel}
          buttonStyle="primary"
        />
      </div>
    </div>
  );
}
