import { Temporal } from "@js-temporal/polyfill";
import { AusklammerungMitGeschwisterindex } from "./findeAusklammerungen";
import { GeschwisterkindAngaben } from "@/application/features/abfrageteil/pages/geschwister";
import { berechneBetrachtungszeitraum } from "@/bemessungszeitraumrechner";

export function berechneNächstenGeschwisterIndexMitRelevanzFuerAusklammerung(
  geburtsdatum: Temporal.PlainDate,
  geschwisterkinder: GeschwisterkindAngaben[],
  ausklammerungen: AusklammerungMitGeschwisterindex[],
  geschwisterIndex?: number,
  istAbfrageMutterschutzGleichesGeschwisterkind?: boolean,
): number | undefined {
  if (geschwisterkinder.length === 0) return undefined;

  const geschwisterkinderNachGeburtsdatumSortiert =
    sortiereGeschwisterkinderNachGeburtsdatum(geschwisterkinder);
  const betrachtungszeitraum = berechneBetrachtungszeitraum(
    geburtsdatum,
    ausklammerungen,
  );

  if (geschwisterIndex === undefined) {
    const geburtsdatumJuengstesGeschwisterkind =
      geschwisterkinderNachGeburtsdatumSortiert[0]?.kind.geburtsdatum;
    const geburtsdatumPlus14Monate = geburtsdatumJuengstesGeschwisterkind?.add({
      months: 14,
    });
    return geburtsdatumPlus14Monate &&
      Temporal.PlainDate.compare(
        geburtsdatumPlus14Monate,
        betrachtungszeitraum.von,
      ) > 0
      ? geschwisterkinderNachGeburtsdatumSortiert[0]?.index
      : undefined;
  }

  const currentPosition = geschwisterkinderNachGeburtsdatumSortiert.findIndex(
    ({ index }) => index === geschwisterIndex,
  );

  if (currentPosition === -1) return undefined;

  if (istAbfrageMutterschutzGleichesGeschwisterkind) {
    const geburtsdatumDiesesGeschwisterkind =
      geschwisterkinderNachGeburtsdatumSortiert[currentPosition]?.kind
        .geburtsdatum;
    const geburtsdatumPlus12Wochen = geburtsdatumDiesesGeschwisterkind?.add({
      weeks: 12,
    });

    if (
      geburtsdatumPlus12Wochen &&
      Temporal.PlainDate.compare(
        geburtsdatumPlus12Wochen,
        betrachtungszeitraum.von,
      ) > 0
    ) {
      return geschwisterkinderNachGeburtsdatumSortiert[currentPosition]?.index;
    }
  }

  const geburtsdatumNaechstesGeschwisterkind =
    geschwisterkinderNachGeburtsdatumSortiert[currentPosition + 1]?.kind
      .geburtsdatum;
  const geburtsdatumPlus14Monate = geburtsdatumNaechstesGeschwisterkind?.add({
    months: 14,
  });
  return geburtsdatumPlus14Monate &&
    Temporal.PlainDate.compare(
      geburtsdatumPlus14Monate,
      betrachtungszeitraum.von,
    ) > 0
    ? geschwisterkinderNachGeburtsdatumSortiert[currentPosition + 1]?.index
    : undefined;
}

function sortiereGeschwisterkinderNachGeburtsdatum(
  geschwisterkinder: GeschwisterkindAngaben[],
) {
  return geschwisterkinder
    .map((kind, index) => ({ kind, index }))
    .sort((a, b) =>
      Temporal.PlainDate.compare(b.kind.geburtsdatum, a.kind.geburtsdatum),
    );
}
