import classnames from "classnames";
import { useState } from "react";
import InfoOutlinedIcon from "@digitalservicebund/icons/InfoOutlined";
import CloseIcon from "@digitalservicebund/icons/Close";
import { Info } from "./infoTexts";
import nsp from "@/globals/js/namespace";

interface Props {
  readonly info: Info;
  readonly isLarge?: boolean;
  readonly isMonatsplanner?: boolean;
  readonly isElternteilOne?: boolean;
}

export function InfoDialog({
  info,
  isLarge,
  isMonatsplanner,
  isElternteilOne,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        onClick={() => setIsModalOpen(true)}
        aria-label="Zugehörige Information zeigen"
      >
        <InfoOutlinedIcon />
      </button>

      {!!isModalOpen && (
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
            onClick={() => setIsModalOpen(false)}
            aria-label="Information schließen"
          >
            <CloseIcon />
          </button>
          <div id={info.id} className={nsp("info-dialog-box__text")}>
            {typeof info.text === "string" ? (
              <p className="whitespace-pre-line">{info.text}</p>
            ) : (
              info.text
            )}
          </div>
        </div>
      )}
    </div>
  );
}
