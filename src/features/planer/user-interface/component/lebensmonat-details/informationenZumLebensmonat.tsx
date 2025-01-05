import { type ReactNode, createContext, useContext } from "react";
import type {
  Ausgangslage,
  ElternteileByAusgangslage,
  Lebensmonat,
  Lebensmonatszahl,
} from "@/features/planer/domain";
import type {
  BestimmeAuswahlmoeglichkeitenFuerLebensmonat,
  ErstelleVorschlaegeFuerAngabeDesEinkommensFuerLebensmonat,
  GebeEinkommenInLebensmonatAn,
  WaehleOptionInLebensmonat,
} from "@/features/planer/user-interface/service/callbackTypes";

export function ProvideInformationenZumLebensmonat<
  A extends Ausgangslage,
>(props: {
  readonly informationen: InformationenZumLebensmonat<A>;
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
  A extends Ausgangslage,
>(): InformationenZumLebensmonat<A> {
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

type InformationenZumLebensmonat<A extends Ausgangslage> = {
  ausgangslage: A;
  lebensmonatszahl: Lebensmonatszahl;
  lebensmonat: Lebensmonat<ElternteileByAusgangslage<A>>;
  bestimmeAuswahlmoeglichkeiten: BestimmeAuswahlmoeglichkeitenFuerLebensmonat<
    ElternteileByAusgangslage<A>
  >;
  waehleOption: WaehleOptionInLebensmonat<ElternteileByAusgangslage<A>>;
  erstelleVorschlaegeFuerAngabeDesEinkommens: ErstelleVorschlaegeFuerAngabeDesEinkommensFuerLebensmonat<
    ElternteileByAusgangslage<A>
  >;
  gebeEinkommenAn: GebeEinkommenInLebensmonatAn<ElternteileByAusgangslage<A>>;
};
