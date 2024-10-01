import { createContext, useContext, type ReactNode } from "react";
import type {
  BestimmeAuswahlmoeglichkeitenFuerLebensmonat,
  GebeEinkommenInLebensmonatAn,
  WaehleOptionInLebensmonat,
} from "@/features/planer/user-interface/service/callbackTypes";
import type {
  Elternteil,
  Lebensmonat,
  Lebensmonatszahl,
  PseudonymeDerElternteile,
} from "@/features/planer/user-interface/service";

export function ProvideInformationenZumLebensmonat<
  E extends Elternteil,
>(props: {
  readonly informationen: InformationenZumLebensmonat<E>;
  readonly children?: ReactNode;
}): ReactNode {
  const { informationen, children } = props;
  return (
    <LebensmonatContext.Provider value={informationen}>
      {children}
    </LebensmonatContext.Provider>
  );
}

export function useInformationenZumLebensmonat<
  E extends Elternteil,
>(): InformationenZumLebensmonat<E> {
  return useContext(LebensmonatContext);
}

/*
 * There is no way to postpone the generic resolution here. At the same time it
 * is not possible to properly specify the generic type so TypeScript
 * understands it. The `any` is horrible, but an escape mechanism. The code that
 * uses the context ensures the proper typing again for the rest of the code
 * base.
 * In the end it is only important for the provider and consumer that the
 * set of Elternteile is constant across all aspects.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LebensmonatContext = createContext<InformationenZumLebensmonat<any>>(
  /* Should be never used without provider, let it crash if used wrongly  */
  undefined!,
);

type InformationenZumLebensmonat<E extends Elternteil> = {
  lebensmonatszahl: Lebensmonatszahl;
  lebensmonat: Lebensmonat<E>;
  pseudonymeDerElternteile: PseudonymeDerElternteile<E>;
  geburtsdatumDesKindes: Date;
  bestimmeAuswahlmoeglichkeiten: BestimmeAuswahlmoeglichkeitenFuerLebensmonat<E>;
  waehleOption: WaehleOptionInLebensmonat<E>;
  gebeEinkommenAn: GebeEinkommenInLebensmonatAn<E>;
};
