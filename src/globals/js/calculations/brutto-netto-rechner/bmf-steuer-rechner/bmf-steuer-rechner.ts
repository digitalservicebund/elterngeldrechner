import { LST } from "@bmfin/steuerrechner";
import { LST_INPUT } from "@bmfin/steuerrechner/build/types/input";
import { bmfSteuerRechnerUrlOf } from "./bmf-steuer-rechner-configuration";
import { BmfSteuerRechnerParameter } from "./bmf-steuer-rechner-parameter";
import { BmfSteuerRechnerResponse } from "./bmf-steuer-rechner-response";
import { errorOf } from "@/globals/js/calculations/calculation-error-code";
import { convert as convertParameter } from "@/globals/js/calculations/brutto-netto-rechner/bmf-steuer-rechner/bmf-steuer-rechner-parameter-converter";
import { convert as convertResponse } from "@/globals/js/calculations/brutto-netto-rechner/bmf-steuer-rechner/bmf-steuer-rechner-response-converter";
import { parse as parseResponse } from "@/globals/js/calculations/brutto-netto-rechner/bmf-steuer-rechner/bmf-steuer-rechner-response-parser";

/**
 * Namespace for function to call the BMF Lohn- und Einkommensteuerrechner.
 *
 * BMF Lohn- und Einkommensteuerrechner descriptions:
 * - https://www.bmf-steuerrechner.de/interface/einganginterface.xhtml
 * - https://issues.init.de/secure/attachment/708773/708773_2021-11-05-PAP-2022-anlage-1.pdf
 */
export const USE_REMOTE_STEUER_RECHNER = false;

/**
 * Calls the BMF Lohn- und Einkommensteuerrechner.
 *
 * @param lohnSteuerJahr Lohnsteuerjahr for correct version of BMF Lohn- und Einkommensteuerrechner Must be greater than 2020.
 * @param bmfSteuerRechnerParameter Parameter for BMF Lohn- und Einkommensteuerrechner.
 *
 * @return Response from BMF Lohn- und Einkommensteuerrechner
 */
export function callBmfSteuerRechner(
  lohnSteuerJahr: number,
  bmfSteuerRechnerParameter: BmfSteuerRechnerParameter,
): BmfSteuerRechnerResponse {
  return callRechnerLib(lohnSteuerJahr, bmfSteuerRechnerParameter);
}

export function callRechnerLib(
  lohnSteuerJahr: number,
  bmfSteuerRechnerParameter: BmfSteuerRechnerParameter,
): BmfSteuerRechnerResponse {
  const lstInput = convertParameter(bmfSteuerRechnerParameter);
  const lstOutput = lst(lohnSteuerJahr, lstInput);
  return convertResponse(lstOutput);
}

function lst(lohnSteuerJahr: number, lstInput: LST_INPUT) {
  if (lohnSteuerJahr === 2022) {
    return LST("2022.1", lstInput);
  }

  return LST("2023.1", lstInput);
}

export async function callRemoteRechner(
  lohnSteuerJahr: number,
  bmfSteuerRechnerParameter: BmfSteuerRechnerParameter,
) {
  const url = bmfSteuerRechnerUrlOf(lohnSteuerJahr, bmfSteuerRechnerParameter);
  const xml = await queryBmfSteuerRechner(url);
  return parseResponse(xml);
}

const queryBmfSteuerRechner = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);

    return await response.text();
  } catch {
    throw errorOf("BmfSteuerRechnerCallFailed");
  }
};
