import CloseIcon from "@digitalservicebund/icons/Close";
import InfoOutlinedIcon from "@digitalservicebund/icons/InfoOutlined";
import classNames from "classnames";
import {
  CSSProperties,
  KeyboardEvent,
  type ReactNode,
  useRef,
  useState,
} from "react";
import { useAnchorPositioning } from "./positioning/anchor";
import { useMarginPositioning } from "./positioning/margin";
import { useOnClickOutside } from "@/application/hooks/useOnClickOutside";

export type Info = string | ReactNode;

type Props = {
  readonly ariaLabelForDialog?: string;
  readonly info: Info;
  readonly id?: string;
  readonly className?: string;
  readonly style?: CSSProperties;
};

export function InfoDialog({
  ariaLabelForDialog,
  info,
  id,
  className,
  style,
}: Props) {
  ariaLabelForDialog ??= "zusätzliche Informationen";
  const ariaLabelForOpenButton = `Öffne ${ariaLabelForDialog}`;

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
    <div className={className} style={style} ref={wrapperElement}>
      <button
        id={id}
        className="border-none bg-transparent text-primary"
        style={button.style}
        type="button"
        ref={openButtonElement}
        onClick={openModal}
        aria-haspopup="dialog"
        aria-label={ariaLabelForOpenButton}
      >
        <InfoOutlinedIcon />
      </button>

      <div
        className={classNames(
          "egr-info-dialog-box",
          "absolute z-[100] flex flex-col rounded bg-primary-light py-10 pl-20 pr-56 shadow-lg",
          "[@media(max-width:481px)]:fixed [@media(max-width:481px)]:inset-0 [@media(max-width:481px)]:z-[99] [@media(max-width:481px)]:!m-0 [@media(max-width:481px)]:!w-full [@media(max-width:481px)]:overflow-auto",
          { hidden: !isModalOpen },
          ...tooltip.className,
        )}
        style={tooltip.style}
        role="dialog"
        aria-modal
        aria-hidden={!isModalOpen}
        aria-label={ariaLabelForDialog}
      >
        <div
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
          className="media-max-[481px]:top-4 absolute right-4 border-none bg-transparent text-primary"
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
