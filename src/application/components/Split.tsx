import { ReactNode } from "react";

type Props = {
  readonly children?: ReactNode;
};

export function Split({ children }: Props): ReactNode {
  return (
    <div className="flex flex-wrap gap-56 *:grow *:basis-[22rem]">
      {children}
    </div>
  );
}
