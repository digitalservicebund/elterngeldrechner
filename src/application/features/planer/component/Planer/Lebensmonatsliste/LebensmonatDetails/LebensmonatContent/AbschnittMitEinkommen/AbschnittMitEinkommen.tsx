import ErrorIcon from "@digitalservicebund/icons/Error";
import { ReactNode, useId } from "react";
import { BruttoeinkommenInput } from "./BruttoeinkommenInput";
import { HinweisZumMutterschutz } from "./HinweisZumMutterschutz";
import { InfoZumBonus } from "./InfoZumBonus";
import { InfoZumEinkommen } from "./InfoZumEinkommen";
import { InfoText } from "@/application/components";
import { useInformationenZumLebensmonat } from "@/application/features/planer/component/Planer/Lebensmonatsliste/LebensmonatDetails/informationenZumLebensmonat";
import {
  type GridColumnDefinition,
  type GridColumnDefinitionPerElternteil,
  useGridColumn,
  useGridColumnPerElternteil,
} from "@/application/features/planer/layout";
import {
  Elternteil,
  type Lebensmonatszahl,
  Variante,
  listeElternteileFuerAusgangslageAuf,
  listeMonateAuf,
} from "@/monatsplaner";

export function AbschnittMitEinkommen(): ReactNode {
  const headingColumn = useGridColumn(HEADING_COLUMN_DEFINITION);
  const bruttoeinkommenColumns = useGridColumnPerElternteil(
    BRUTTOEINKOMMEN_COLUMN_DEFINITIONS,
  );
  const {
    ausgangslage,
    lebensmonatszahl,
    lebensmonat,
    erstelleVorschlaegeFuerAngabeDesEinkommens,
    gebeEinkommenAn,
  } = useInformationenZumLebensmonat();

  const istLebensmonatMitBonus = listeMonateAuf(lebensmonat).some(
    ([, monat]) => monat.gewaehlteOption === Variante.Bonus,
  );

  const istBruttoeinkommenMissing = listeElternteileFuerAusgangslageAuf(
    ausgangslage,
  ).some((elternteil) => {
    const { bruttoeinkommen, gewaehlteOption } = lebensmonat[elternteil];
    return gewaehlteOption === Variante.Bonus && !bruttoeinkommen;
  });

  const hinweisZuWochenstundenIdentifier = useId();

  return (
    <div className="contents">
      <div className="mb-16 mt-32 flex flex-wrap gap-6" style={headingColumn}>
        {istLebensmonatMitBonus ? (
          <>
            <span className="font-bold">
              Geben Sie Ihr erwartetes Einkommen an
            </span>

            <p>
              Wenn Sie sich für Partnerschaftsbonus entscheiden, müssen Sie
              mindestens 24 bis maximal 32 Stunden in Teilzeit arbeiten.
            </p>
          </>
        ) : (
          <>
            <span className="font-bold">
              Haben Sie Einkommen? Dann tragen Sie es bitte ein.
            </span>

            <p>
              Wenn Sie Elterngeld bekommen, können Sie in Teilzeit arbeiten. Sie
              können bis maximal 32 Stunden pro Woche arbeiten.
            </p>
          </>
        )}

        {!!istBruttoeinkommenMissing && (
          <div className="mt-8 w-full rounded bg-warning-light px-8 py-6">
            <ErrorIcon className="text-warning" /> Beim Partnerschaftsbonus ist
            Arbeit in Teilzeit Pflicht. Geben Sie ein Einkommen ein.
          </div>
        )}
      </div>

      {listeElternteileFuerAusgangslageAuf(ausgangslage).map((elternteil) => {
        const { imMutterschutz, bruttoeinkommen, gewaehlteOption } =
          lebensmonat[elternteil];

        const bruttoEinkommenIsMissing =
          gewaehlteOption === Variante.Bonus && !bruttoeinkommen;

        if (imMutterschutz) {
          return (
            <HinweisZumMutterschutz
              key={elternteil}
              style={bruttoeinkommenColumns[elternteil]}
            />
          );
        } else {
          const vorschlaege =
            erstelleVorschlaegeFuerAngabeDesEinkommens(elternteil);
          const ariaLabel = composeAriaLabelForBruttoeinkommen(
            ausgangslage.pseudonymeDerElternteile?.[elternteil],
            lebensmonatszahl,
          );

          return (
            <div key={elternteil} style={bruttoeinkommenColumns[elternteil]}>
              <BruttoeinkommenInput
                key={elternteil}
                bruttoeinkommen={bruttoeinkommen}
                isMissing={bruttoEinkommenIsMissing}
                vorschlaege={vorschlaege}
                ariaLabel={ariaLabel}
                ariaDescribedBy={hinweisZuWochenstundenIdentifier}
                gebeEinkommenAn={gebeEinkommenAn.bind(null, elternteil)}
              />
            </div>
          );
        }
      })}

      <div className="my-16 flex flex-wrap gap-6" style={headingColumn}>
        <InfoText
          question="Wie funktioniert Einkommen mit Elterngeld?"
          answer={<InfoZumEinkommen />}
        />
        {!!istLebensmonatMitBonus && (
          <InfoText
            question="Wie funktioniert der Partnerschaftsbonus?"
            answer={<InfoZumBonus />}
          />
        )}
      </div>
    </div>
  );
}

function composeAriaLabelForBruttoeinkommen(
  pseudonym: string | undefined,
  lebensmonatszahl: Lebensmonatszahl,
): string {
  return pseudonym
    ? `Bruttoeinkommen von ${pseudonym} im ${lebensmonatszahl}. Lebensmonat`
    : `Bruttoeinkommen im ${lebensmonatszahl}. Lebensmonat`;
}

const HEADING_COLUMN_DEFINITION: GridColumnDefinition = {
  1: ["left-outside", "right-outside"],
  2: ["et1-middle", "et2-middle"],
};

const BRUTTOEINKOMMEN_COLUMN_DEFINITIONS: GridColumnDefinitionPerElternteil = {
  1: {
    [Elternteil.Eins]: ["left-middle", "right-middle"],
  },
  2: {
    [Elternteil.Eins]: ["et1-middle", "et1-inside"],
    [Elternteil.Zwei]: ["et2-inside", "et2-middle"],
  },
};
