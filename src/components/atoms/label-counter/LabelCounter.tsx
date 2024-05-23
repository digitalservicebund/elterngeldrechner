import nsp from "@/globals/js/namespace";

interface LabelCounterProps {
  label: string;
  count: number;
  maxCount: number;
}

export function LabelCounter({ label, count, maxCount }: LabelCounterProps) {
  return (
    <div className={nsp("label-counter")}>
      <p className={nsp("label-counter__label")}>{label}</p>
      <p>
        {count}/{maxCount}
      </p>
    </div>
  );
}
