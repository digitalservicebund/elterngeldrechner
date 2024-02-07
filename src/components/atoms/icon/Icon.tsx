import { IconNames, icons } from "./Icons";

interface IconProps {
  name: IconNames;
  size?: number;
  color?: string;
  className?: string;
}

export const Icon = ({
  name,
  size = 24,
  color = "currentColor",
  className,
}: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      fill={color}
      stroke={color}
      width={size}
      height={size}
      className={className}
    >
      {icons[name]}
    </svg>
  );
};
