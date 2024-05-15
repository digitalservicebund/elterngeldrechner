import classnames from "classnames";
import React, { useState } from "react";
import InfoOutlinedIcon from "@digitalservicebund/icons/InfoOutlined";
import CloseIcon from "@digitalservicebund/icons/Close";
import { Info } from "./infoTexts";
import nsp from "@/globals/js/namespace";

interface Props {
  info: Info;
  isLarge?: boolean;
  isMonatsplanner?: boolean;
  isElternteilOne?: boolean;
}

export function InfoDialog({
  info,
  isLarge,
  isMonatsplanner,
  isElternteilOne,
}: Props) {
  const [isModalOpen, setIsDialogOpen] = useState(false);

  return (
    <div
      className={classnames(
        nsp("info-dialog"),
        isLarge && nsp("info-dialog--large"),
        isMonatsplanner && nsp("info-dialog--monatsplanner"),
      )}
    >
      <button
        className={classnames(
          nsp("info-dialog__button"),
          isMonatsplanner && nsp("info-dialog__button--monatsplanner"),
        )}
        type="button"
        onClick={() => setIsDialogOpen(true)}
        aria-label="Zugehörige Information zeigen"
      >
        <InfoOutlinedIcon />
      </button>

      {isModalOpen && (
        <div
          className={classnames(
            nsp("info-dialog-box"),
            isElternteilOne && nsp("info-dialog-box--monatsplanner-et-one"),
          )}
          role="dialog"
          aria-describedby={info.id}
        >
          <button
            className={nsp("info-dialog-box__button")}
            type="button"
            onClick={() => setIsDialogOpen(false)}
            aria-label="Information schließen"
          >
            <CloseIcon />
          </button>
          <p id={info.id} className={nsp("info-dialog-box__text")}>
            {info.text}
          </p>
        </div>
      )}
    </div>
  );
}
