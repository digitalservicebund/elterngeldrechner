import { errorOf } from "../../calculation-error-code";
import {
  BmfSteuerRechnerParameter,
  urlSearchParamsOf,
} from "./bmf-steuer-rechner-parameter";

/**
 * Reads domain for bmf steuerrechner call from env.
 *
 * @see https://www.bmf-steuerrechner.de/interface/einganginterface.xhtml
 */
const bmfSteuerRechnerDomainFromEnv = (): string => {
  const domain = process.env.REACT_APP_BMF_STEUER_RECHNER_DOMAIN;
  if (domain === undefined) {
    throw errorOf("BmfSteuerRechnerDomainUndefined");
  }
  return domain;
};

/**
 * Available years for bmf steuerrechner call.
 */
export const bmfSteuerRechnerAvailableYears = (): number[] => {
  const years = process.env.REACT_APP_BMF_STEUER_RECHNER_AVAILABLE_YEARS;
  if (years === undefined) {
    throw errorOf("BmfSteuerRechnerAvailableYearsUndefined");
  }
  return years.split(",").map((years) => Number.parseInt(years));
};

/**
 * Reads code for bmf steuerrechner call from env.
 *
 * @see https://www.bmf-steuerrechner.de/interface/einganginterface.xhtml
 */
export const bmfSteuerRechnerCodeFromEnv = (): string => {
  const code = process.env.REACT_APP_BMF_STEUER_RECHNER_CODE;
  if (code === undefined) {
    throw errorOf("BmfSteuerRechnerCodeUndefined");
  }
  return code;
};

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
  if (!bmfSteuerRechnerAvailableYears().includes(lohnSteuerJahr)) {
    throw errorOf("BmfSteuerRechnerNotImplementedForLohnsteuerjahr");
  }

  const version = `${lohnSteuerJahr}Version1`;
  const searchParams = urlSearchParamsOf(bmfSteuerRechnerParameter);
  searchParams.append("code", bmfSteuerRechnerCodeFromEnv());
  const urlPath = `/interface/${version}.xhtml?${searchParams.toString()}`;

  const bmfSteuerRechnerDomain = bmfSteuerRechnerDomainFromEnv();
  if (bmfSteuerRechnerDomain.length > 0) {
    return `https://${bmfSteuerRechnerDomainFromEnv()}${urlPath}`;
  } else {
    return urlPath;
  }
}
