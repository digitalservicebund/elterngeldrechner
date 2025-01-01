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
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { useAnchorPositioning } from "@/components/molecules/info-dialog/positioning/anchor";
import { useMarginPositioning } from "@/components/molecules/info-dialog/positioning/margin";

interface Props {
  readonly ariaLabelForDialog?: string;
  readonly info: string | ReactNode;
  readonly isMonatsplanner?: boolean;
  readonly isElternteilOne?: boolean;
  readonly id?: string;
  readonly className?: string;
  readonly style?: CSSProperties;
}

export function InfoDialog({
  ariaLabelForDialog,
  info,
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
  useOnClickOutside(
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

  // Prefer modern CSS anchoring for simplicity, with a fallback to manual
  // positioning if anchoring is unsupported. The goal is to remove
  // marginPosition once anchor positioning is supported across all major
  // browsers. Reference: https://caniuse.com/css-anchor-positioning
  const isAnchoringSupported = "anchorName" in document.documentElement.style;

  const marginPosition = useMarginPositioning(isModalOpen, openButtonElement);
  const anchorPosition = useAnchorPositioning();

  const { button, tooltip } = isAnchoringSupported
    ? anchorPosition
    : marginPosition;

  return (
    <div
      className={classNames(
        "egr-info-dialog",
        isMonatsplanner && "egr-info-dialog--monatsplanner",
        className,
      )}
      style={style}
      ref={wrapperElement}
    >
      <button
        id={id}
        className={classNames(
          "egr-info-dialog__button",
          isMonatsplanner && "egr-info-dialog__button--monatsplanner",
        )}
        style={button.style}
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
          "egr-info-dialog-box",
          isElternteilOne && "egr-info-dialog-box--monatsplanner-et-one",
          { hidden: !isModalOpen },
          ...tooltip.className,
        )}
        style={tooltip.style}
        aria-hidden={!isModalOpen}
        aria-label={ariaLabelForDialog}
        aria-describedby={dialogContentIdentifier}
      >
        <div
          id={dialogContentIdentifier}
          className="egr-info-dialog-box__text"
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
          className="egr-info-dialog-box__button"
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
