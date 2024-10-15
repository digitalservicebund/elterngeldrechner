import { SelectOption } from "@/components/molecules";
import { cloneOptionsList } from "@/components/molecules/custom-select/CustomSelect";
import { zeitraumValueOf, ZeitraumValueType } from "@/globals/js/ZeitraumValue";

// Bildet ein "von"/"bis" Zeitraum ab.
export interface ZeitraumData {
  from: string;
  to: string;
}

// Bildet mögliche Optionen eins "von"/"bis" Zeitraums ab.
export type ZeitraumOptionType = {
  from: SelectOption<string>[];
  to: SelectOption<string>[];
};

/**
 * Zeiträume können in mehreren Zeilen angezeigt werden. Wenn sich die Zeiträume in den einzelnen Zeilen nicht
 * überschneiden dürfen, kann diese Funktion benutzt werden, um die Optionen einer neuen Zeile zu ermitteln.
 *
 * @param currentZeitraumList Die bestehenden Zeiträume der einzelnen Zeilen.
 * @param initialZeitraumOptions Alle Optionen einer neuen Zeile.
 * @param zeitraumValueType Der Typ des Wertes (Integer oder Date).
 * @param lastZeitraumValue Optional, die letzte Zeile. Wird benutzt, falls sich diese Zeile ändert. Dieser Wert wird beim onChangeZeitraum, d.h. wenn der aktuelle Zeitraum (letzte Zeile) geändert wird, mitgegeben.
 */
export const availableZeitraumOptions = (
  currentZeitraumList: ZeitraumData[],
  initialZeitraumOptions: ZeitraumOptionType,
  zeitraumValueType: ZeitraumValueType,
  lastZeitraumValue?: ZeitraumData,
): ZeitraumOptionType => {
  const valueOf = (date: string) => zeitraumValueOf(date, zeitraumValueType);

  const zeitraumOptions = {
    from: cloneOptionsList(initialZeitraumOptions.from),
    to: cloneOptionsList(initialZeitraumOptions.to),
  };
  // from und to aller Zeiträume prüfen
  const zeitraumList = currentZeitraumList.map((v) => {
    return { from: v.from, to: v.to };
  });
  if (lastZeitraumValue) {
    zeitraumList.pop();
    zeitraumList.push({
      from: lastZeitraumValue.from,
      to: lastZeitraumValue.to,
    });
  }
  zeitraumList.sort((z1, z2) => {
    return valueOf(z1.from) - valueOf(z2.from);
  });
  zeitraumList.forEach((previousZeitraum) => {
    const previousFromValue = valueOf(previousZeitraum.from);
    const previousToValue = valueOf(previousZeitraum.to);
    if (previousZeitraum.from !== "") {
      // schon belegte "from" Zeiträume verstecken, falls sich nicht schon versteckt sind
      zeitraumOptions.from
        // schon versteckte rausfiltern
        .filter((fromOption) => !fromOption.hidden)
        .forEach((fromOption) => {
          const fromOptionValue = valueOf(fromOption.value);
          fromOption.hidden =
            fromOptionValue >= previousFromValue &&
            fromOptionValue <= previousToValue;
        });
    }
    if (previousZeitraum.from !== "" || previousZeitraum.to !== "") {
      // schon belegte "to" Zeiträume verstecken, falls sich nicht schon versteckt sind
      zeitraumOptions.to
        // schon versteckte rausfiltern
        .filter((toOption) => !toOption.hidden)
        .forEach((toOption) => {
          const toOptionValue = valueOf(toOption.value);
          toOption.hidden =
            toOptionValue >= previousFromValue &&
            toOptionValue <= previousToValue;
        });
    }
  });
  return zeitraumOptions;
};
