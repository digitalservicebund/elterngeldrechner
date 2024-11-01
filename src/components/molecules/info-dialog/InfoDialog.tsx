import {
  KeyboardEvent,
  CSSProperties,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import InfoOutlinedIcon from "@digitalservicebund/icons/InfoOutlined";
import CloseIcon from "@digitalservicebund/icons/Close";
import classNames from "classnames";
import nsp from "@/globals/js/namespace";
import { useDetectClickOutside } from "@/hooks/useDetectMouseEventOutside";

interface Props {
  readonly ariaLabelForDialog?: string;
  readonly info: string | ReactNode;
  readonly isLarge?: boolean;
  readonly isMonatsplanner?: boolean;
  readonly isElternteilOne?: boolean;
  readonly id?: string;
  readonly className?: string;
  readonly style?: CSSProperties;
}

export function InfoDialog({
  ariaLabelForDialog,
  info,
  isLarge,
  isMonatsplanner,
  isElternteilOne,
  id,
  className,
  style,
}: Props) {
  const dialogContentIdentifier = useId();

  const ariaLabelForOpenButton = ariaLabelForDialog
    ? `Öffne ${ariaLabelForDialog}`
    : `Öffne zusätzliche Informationen`;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openButtonElement = useRef<HTMLButtonElement>(null);
  const dialogContentElement = useRef<HTMLDivElement>(null);

  function openModal() {
    setIsModalOpen(true);
    // Compensate for render delay to make button visible (non critical).
    setTimeout(() => dialogContentElement.current?.focus());
  }

  function closeModal(restoreFocus: boolean) {
    setIsModalOpen(false);

    if (restoreFocus) {
      openButtonElement.current?.focus();
    }
  }

  const wrapperElement = useRef<HTMLDivElement>(null);
  useDetectClickOutside(
    wrapperElement,
    // This gets triggered a lot due to events on the whole page.
    () => {
      if (isModalOpen) closeModal(false);
    },
  );

  function preventTabOut(event: KeyboardEvent<HTMLButtonElement>) {
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
      style={style}
      ref={wrapperElement}
    >
      <button
        id={id}
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
          onClick={() => closeModal(true)}
          aria-label="Information schließen"
          onKeyDown={preventTabOut}
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
}
