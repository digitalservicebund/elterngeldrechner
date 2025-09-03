import RestartAltIcon from "@digitalservicebund/icons/RestartAlt";
import classNames from "classnames";
import {
  ReactNode,
  Ref,
  SyntheticEvent,
  useCallback,
  useId,
  useImperativeHandle,
  useRef,
} from "react";
import { Anleitung } from "./Anleitung";
import { Gesamtsummenanzeige } from "./Gesamtsummenanzeige";
import { KontingentUebersicht } from "./KontingentUebersicht";
import { Lebensmonatsliste } from "./Lebensmonatsliste";
import { LebensmonatslisteHTMLElement } from "./Lebensmonatsliste/Lebensmonatsliste";
import { Button } from "@/application/components";
import { Pruefbuttonbox } from "@/application/features/planer/component/Pruefbutton/Pruefbuttonbox";
import {
  type InitialInformation,
  type PlanerServiceCallbacks,
  usePlanerService,
} from "@/application/features/planer/hooks";
import { GridLayoutProvider } from "@/application/features/planer/layout";
import { useEffectWithSignal } from "@/application/hooks/useEffectWithSignal";
import { Lebensmonatszahl } from "@/lebensmonatrechner/Lebensmonatszahl";
import { type BerechneElterngeldbezuegeCallback } from "@/monatsplaner";

type Props = {
  readonly initialInformation: InitialInformation;
  readonly berechneElterngeldbezuege: BerechneElterngeldbezuegeCallback;
  readonly planInAntragUebernehmen: () => void;
  readonly callbacks: PlanerServiceCallbacks & {
    onOpenLebensmonat?: () => void;
    onOpenErklaerung: () => void;
  };
  readonly className?: string;
  readonly ref?: Ref<PlanerHandle>;
};

export type PlanerHandle = {
  setzePlanZurueck: () => void;
};

export function Planer({
  initialInformation,
  berechneElterngeldbezuege,
  callbacks,
  className,
  planInAntragUebernehmen,
  ref,
}: Props): ReactNode {
  const {
    onPlanungDrucken,
    onOpenLebensmonat,
    onOpenErklaerung,
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

  const headingIdentifier = useId();

  const lebensmonatslistenElement = useRef<LebensmonatslisteHTMLElement>(null);

  const neueLeerePlanungErstellen = useCallback(() => {
    setzePlanZurueck();
    // TODO: Fix ref in Lebensmonatsliste to allow the use of .focus()
    // lebensmonatslistenElement.current?.focus({ preventScroll: true });
  }, [setzePlanZurueck]);

  useImperativeHandle(ref, () => {
    return {
      setzePlanZurueck,
    };
  }, [setzePlanZurueck]);

  const mindestensEinLebensmonatGeplant =
    Object.keys(plan.lebensmonate).length > 0;

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
    <>
      <section
        className={classNames(className, "print:hidden")}
        aria-labelledby={headingIdentifier}
      >
        <h3 id={headingIdentifier} className="sr-only">
          Planer Anwendung
        </h3>

        <Anleitung onOpenErklaerung={onOpenErklaerung}>
          {initialInformation.beispiel ? (
            <p>
              Sie finden hier einen Vorschlag für eine Planung und die Höhe
              Ihres Elterngeldes. Zusätzlich können Sie angeben, ob und wie viel
              Einkommen Sie pro Monat haben werden. So erhalten Sie einen
              Überblick über Ihr voraussichtliches Haushaltseinkommen. Im
              nächsten Schritt können Sie Ihre Planung in den Antrag übernehmen.
            </p>
          ) : (
            <p>
              Mit dem Rechner und Planer können Sie Ihr Elterngeld für jeden
              Monat planen. Zusätzlich können Sie angeben, ob und wie viel
              Einkommen Sie pro Monat haben werden. So erhalten Sie einen
              Überblick über Ihr voraussichtliches Haushaltseinkommen. Im
              nächsten Schritt können Sie Ihre Planung in den Antrag übernehmen.
            </p>
          )}
        </Anleitung>

        <Button
          className="my-16 pt-32 print:hidden"
          type="button"
          buttonStyle="link"
          onClick={neueLeerePlanungErstellen}
          disabled={!mindestensEinLebensmonatGeplant}
        >
          <RestartAltIcon /> Neue leere Planung erstellen
        </Button>

        <GridLayoutProvider
          anzahlElternteile={plan.ausgangslage.anzahlElternteile}
        >
          <div
            className={classNames(
              CLASS_NAME_ERASE_MARGIN_ON_SMALL_SCREENS,
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
                planInAntragUebernehmen={planInAntragUebernehmen}
                bonusFreischalten={bonusFreischalten}
                onPlanungDrucken={onPlanungDrucken}
              />
            </div>
          </div>
        </GridLayoutProvider>
      </section>
    </>
  );
}

const CLASS_NAME_ERASE_MARGIN_ON_SMALL_SCREENS = "mx-[-15px] sm:mx-0";
