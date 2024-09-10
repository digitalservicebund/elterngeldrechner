import { useId, useRef, useState, type ReactNode } from "react";
import { useDetectClickOutside } from "react-detect-click-outside";
import InfoOutlinedIcon from "@digitalservicebund/icons/InfoOutlined";
import CloseIcon from "@digitalservicebund/icons/Close";
import classNames from "classnames";
import nsp from "@/globals/js/namespace";

interface Props {
  readonly ariaLabelForDialog?: string;
  readonly info: string | ReactNode;
  readonly isLarge?: boolean;
  readonly isMonatsplanner?: boolean;
  readonly isElternteilOne?: boolean;
  readonly className?: string;
}

export function InfoDialog({
  ariaLabelForDialog,
  info,
  isLarge,
  isMonatsplanner,
  isElternteilOne,
  className,
}: Props) {
  const dialogContentIdentifier = useId();

  const ariaLabelForOpenButton = ariaLabelForDialog
    ? `Öffne ${ariaLabelForDialog}`
    : `Öffne zustätzliche Informationen`;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openButtonElement = useRef<HTMLButtonElement>(null);
  const dialogContentElement = useRef<HTMLDivElement>(null);

  function openModal() {
    setIsModalOpen(true);
    // Compensate for render delay to make button visible (non critical).
    setTimeout(() => dialogContentElement.current?.focus());
  }

  function closeModal() {
    setIsModalOpen(false);
    openButtonElement.current?.focus();
  }

  const ref = useDetectClickOutside({
    onTriggered: closeModal,
  });

  function preventTabOut(event: any) {
    if (event.key === "Tab" && isModalOpen) {
      event.preventDefault();
    }
  }

  return (
    <div
      className={classNames(
        nsp("info-dialog"),
        isLarge && nsp("info-dialog--large"),
        isMonatsplanner && nsp("info-dialog--monatsplanner"),
        className,
      )}
      ref={ref}
    >
      <button
        className={classNames(
          nsp("info-dialog__button"),
          isMonatsplanner && nsp("info-dialog__button--monatsplanner"),
        )}
        type="button"
        ref={openButtonElement}
        onClick={openModal}
        aria-haspopup="dialog"
        aria-expanded={isModalOpen}
        aria-label={ariaLabelForOpenButton}
      >
        <InfoOutlinedIcon />
      </button>

      <div
        className={classNames(
          nsp("info-dialog-box"),
          isElternteilOne && nsp("info-dialog-box--monatsplanner-et-one"),
          { hidden: !isModalOpen },
        )}
        role="dialog"
        aria-hidden={!isModalOpen}
        aria-label={ariaLabelForDialog}
        aria-describedby={dialogContentIdentifier}
      >
        <div
          id={dialogContentIdentifier}
          className={nsp("info-dialog-box__text")}
          tabIndex={-1}
          ref={dialogContentElement}
        >
          {typeof info === "string" ? (
            <p className="whitespace-pre-line">{info}</p>
          ) : (
            info
          )}
        </div>

        <button
          className={nsp("info-dialog-box__button")}
          type="button"
          onClick={closeModal}
          aria-label="Information schließen"
          onKeyDown={preventTabOut}
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
}
