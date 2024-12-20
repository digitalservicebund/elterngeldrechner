import { Button } from "@/components/atoms";

interface Props {
  readonly text: string;
  readonly buttonLabel: string;
  readonly onClick: () => void;
}

export default function ModalPupup({ text, buttonLabel, onClick }: Props) {
  return (
    <div className="egr-modal-popup">
      <div className="egr-modal-popup__info">
        <p>{text}</p>
        <Button
          className="egr-modal-popup__btn"
          onClick={onClick}
          label={buttonLabel}
          buttonStyle="primary"
        />
      </div>
    </div>
  );
}
