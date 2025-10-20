import classNames from "classnames";
import {
  ReactNode,
  Ref,
  SyntheticEvent,
  useImperativeHandle,
  useRef,
} from "react";
import { Gesamtsummenanzeige } from "./Gesamtsummenanzeige";
import { KontingentUebersicht } from "./KontingentUebersicht";
import { Lebensmonatsliste } from "./Lebensmonatsliste";
import { LebensmonatslisteHTMLElement } from "./Lebensmonatsliste/Lebensmonatsliste";
import { Pruefbuttonbox } from "@/application/features/planer/component/Pruefbutton/Pruefbuttonbox";
import {
  type InitialInformation,
  type PlanerServiceCallbacks,
  usePlanerService,
} from "@/application/features/planer/hooks";
import { GridLayoutProvider } from "@/application/features/planer/layout";
import { useEffectWithSignal } from "@/application/hooks/useEffectWithSignal";
import { Lebensmonatszahl } from "@/lebensmonatrechner/Lebensmonatszahl";
import {
  type BerechneElterngeldbezuegeCallback,
  PlanMitBeliebigenElternteilen,
} from "@/monatsplaner";

type Props = {
  readonly initialInformation: InitialInformation;
  readonly berechneElterngeldbezuege: BerechneElterngeldbezuegeCallback;
  readonly planInAntragUebernehmen: (
    plan: PlanMitBeliebigenElternteilen,
  ) => void;
  readonly callbacks: PlanerServiceCallbacks & {
    onOpenLebensmonat?: () => void;
  };
  readonly ref?: Ref<PlanerHandle>;
};

export type PlanerHandle = {
  setzePlanZurueck: () => void;
};

export function Planer({
  initialInformation,
  berechneElterngeldbezuege,
  callbacks,
  planInAntragUebernehmen,
  ref,
}: Props): ReactNode {
  const {
    onPlanungDrucken,
    onOpenLebensmonat,
    onWaehleOption: onWaehleOptionFromProps,
    onSetzePlanZurueck: onSetzePlanZurueckFromProps,
    ...remaingingPlanerServiceCallbacks
  } = callbacks;

  const planerServiceCallbacks = {
    ...remaingingPlanerServiceCallbacks,
    onWaehleOption: onWaehleOptionFromProps,
    onSetzePlanZurueck: onSetzePlanZurueckFromProps,
  };

  const {
    plan,
    erstelleUngeplantenLebensmonat,
    bestimmeAuswahlmoeglichkeiten,
    waehleOption,
    erstelleVorschlaegeFuerAngabeDesEinkommens,
    gebeEinkommenAn,
    ergaenzeBruttoeinkommenFuerPartnerschaftsbonus,
    setzePlanZurueck,
    ueberpruefePlanung,
    schalteBonusFrei,
  } = usePlanerService(
    initialInformation,
    berechneElterngeldbezuege,
    planerServiceCallbacks,
  );

  const lebensmonatslistenElement = useRef<LebensmonatslisteHTMLElement>(null);

  useImperativeHandle(ref, () => {
    // TODO: Fix ref in Lebensmonatsliste to allow the use of .focus()
    // lebensmonatslistenElement.current?.focus({ preventScroll: true })

    return {
      setzePlanZurueck,
    };
  }, [setzePlanZurueck]);

  const { triggerEffectBySignal: openLebensmonatsSummary } =
    useEffectWithSignal((lebensmonatszahl: Lebensmonatszahl) =>
      lebensmonatslistenElement.current?.openLebensmonatsSummary(
        lebensmonatszahl,
      ),
    );

  function bonusFreischalten(event: SyntheticEvent) {
    // The click event emitted by the bonus freischalten button
    // triggers both this function and thus the focusOnBonus and
    // the onClickOutside listener resulting in a race condition
    // setting the open state of the LebensmonatDetail to false.
    //
    // The stopPropagation() prevents the onClickOutside listener
    // from beeing triggered.
    event.stopPropagation();

    const ersterBonusMonat = schalteBonusFrei();

    if (ersterBonusMonat) {
      openLebensmonatsSummary(ersterBonusMonat);
    }
  }

  return (
    <GridLayoutProvider anzahlElternteile={plan.ausgangslage.anzahlElternteile}>
      <div
        className={classNames(
          "mx-[-15px] sm:mx-0",
          "flex flex-col",
          "divide-x-0 divide-y-2 divide-solid divide-off-white",
          "border-2 border-solid border-off-white",
        )}
      >
        <KontingentUebersicht className="bg-off-white py-10" plan={plan} />

        <Gesamtsummenanzeige
          className="border-t-2 border-solid !border-white bg-off-white py-10"
          plan={plan}
        >
          {!!initialInformation.beispiel && (
            <p>{initialInformation.beispiel.titel}</p>
          )}
        </Gesamtsummenanzeige>

        <div>
          <Lebensmonatsliste
            ref={lebensmonatslistenElement}
            className="py-2"
            plan={plan}
            erstelleUngeplantenLebensmonat={erstelleUngeplantenLebensmonat}
            bestimmeAuswahlmoeglichkeiten={bestimmeAuswahlmoeglichkeiten}
            waehleOption={waehleOption}
            erstelleVorschlaegeFuerAngabeDesEinkommens={
              erstelleVorschlaegeFuerAngabeDesEinkommens
            }
            gebeEinkommenAn={gebeEinkommenAn}
            ergaenzeBruttoeinkommenFuerPartnerschaftsbonus={
              ergaenzeBruttoeinkommenFuerPartnerschaftsbonus
            }
            onOpenLebensmonat={onOpenLebensmonat}
          />

          <Pruefbuttonbox
            className="p-16"
            plan={plan}
            ueberpruefePlanung={ueberpruefePlanung}
            planInAntragUebernehmen={() => planInAntragUebernehmen(plan)}
            bonusFreischalten={bonusFreischalten}
            onPlanungDrucken={onPlanungDrucken}
          />
        </div>
      </div>
    </GridLayoutProvider>
  );
}
