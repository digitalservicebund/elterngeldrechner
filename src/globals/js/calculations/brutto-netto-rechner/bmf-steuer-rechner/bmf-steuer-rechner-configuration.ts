import {
  BmfSteuerRechnerParameter,
  urlSearchParamsOf,
} from "./bmf-steuer-rechner-parameter";
import { errorOf } from "@/globals/js/calculations/calculation-error-code";

export const bmfSteuerRechnerAvailableYearsRemote =
  import.meta.env.VITE_APP_BMF_STEUER_RECHNER_AVAILABLE_YEARS_REMOTE.split(
    ",",
  ).map((year) => Number.parseInt(year));

export const bmfSteuerRechnerAvailableYearsLib =
  import.meta.env.VITE_APP_BMF_STEUER_RECHNER_AVAILABLE_YEARS_LIB.split(
    ",",
  ).map((year) => Number.parseInt(year));

/**
 * Creates url for bmf steuerrechner call.
 *
 * @param lohnSteuerJahr Lohnsteuerjahr for correct version page. Must be greater than 2020.
 * @param bmfSteuerRechnerParameter Parameter for BMF Lohn- und Einkommensteuerrechner.
 * @return {RequestOptions} with correct hostname and path.
 *
 * @see https://www.bmf-steuerrechner.de/interface/einganginterface.xhtml
 */
export function bmfSteuerRechnerUrlOf(
  lohnSteuerJahr: number,
  bmfSteuerRechnerParameter: BmfSteuerRechnerParameter,
): string {
  if (!bmfSteuerRechnerAvailableYearsRemote.includes(lohnSteuerJahr)) {
    throw errorOf("BmfSteuerRechnerNotImplementedForLohnsteuerjahr");
  }

  const version = `${lohnSteuerJahr}Version1`;
  const searchParams = urlSearchParamsOf(bmfSteuerRechnerParameter);
  searchParams.append("code", import.meta.env.VITE_APP_BMF_STEUER_RECHNER_CODE);
  const urlPath = `/interface/${version}.xhtml?${searchParams.toString()}`;

  const domain = import.meta.env.VITE_APP_BMF_STEUER_RECHNER_DOMAIN;

  if (domain.length > 0) {
    return `https://${domain}${urlPath}`;
  } else {
    return urlPath;
  }
}
