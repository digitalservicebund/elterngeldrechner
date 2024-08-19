import { Planer as TypedPlaner } from "./user-interface/component/Planer";
import { usePlanerService } from "./user-interface/service/usePlanerService";

type Props = {
  readonly className?: string;
};

export function Planer({ className }: Props) {
  const serviceProperties = usePlanerService();
  return <TypedPlaner className={className} {...serviceProperties} />;
}
