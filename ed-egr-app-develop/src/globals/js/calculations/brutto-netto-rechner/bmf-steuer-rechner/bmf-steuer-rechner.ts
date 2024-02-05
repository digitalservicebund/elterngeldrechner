import { bmfSteuerRechnerUrlOf } from "./bmf-steuer-rechner-configuration";
import { errorOf } from "../../calculation-error-code";
import { BmfSteuerRechnerResponseParser } from "./bmf-steuer-rechner-response-parser";
import { BmfSteuerRechnerParameter } from "./bmf-steuer-rechner-parameter";
import { BmfSteuerRechnerResponse } from "./bmf-steuer-rechner-response";
import { LST2022 } from "@bmfin/steuerrechner";
import { BmfSteuerRechnerResponseConverter } from "./bmf-steuer-rechner-response-converter";
import { BmfSteuerRechnerParameterConverter } from "./bmf-steuer-rechner-parameter-converter";

/**
 * Namespace for function to call the BMF Lohn- und Einkommensteuerrechner.
 *
 * BMF Lohn- und Einkommensteuerrechner descriptions:
 * - https://www.bmf-steuerrechner.de/interface/einganginterface.xhtml
 * - https://issues.init.de/secure/attachment/708773/708773_2021-11-05-PAP-2022-anlage-1.pdf
 */
export namespace BmfSteuerRechner {
  const USE_REMOTE_STEUER_RECHNER = false;

  /**
   * Calls the BMF Lohn- und Einkommensteuerrechner.
   *
   * @param lohnSteuerJahr Lohnsteuerjahr for correct version of BMF Lohn- und Einkommensteuerrechner Must be greater than 2020.
   * @param bmfSteuerRechnerParameter Parameter for BMF Lohn- und Einkommensteuerrechner.
   *
   * @return Response from BMF Lohn- und Einkommensteuerrechner as promise.
   */
  export async function call(
    lohnSteuerJahr: number,
    bmfSteuerRechnerParameter: BmfSteuerRechnerParameter,
  ): Promise<BmfSteuerRechnerResponse> {
    let response: BmfSteuerRechnerResponse;
    if (USE_REMOTE_STEUER_RECHNER) {
      response = await callRemoteRechner(
        lohnSteuerJahr,
        bmfSteuerRechnerParameter,
      );
    } else {
      response = await callRechnerLib(bmfSteuerRechnerParameter);
    }
    return response;
  }
}

export async function callRechnerLib(
  bmfSteuerRechnerParameter: BmfSteuerRechnerParameter,
): Promise<BmfSteuerRechnerResponse> {
  const lstInput = BmfSteuerRechnerParameterConverter.convert(
    bmfSteuerRechnerParameter,
  );
  const lstOutput = LST2022(lstInput);
  return BmfSteuerRechnerResponseConverter.convert(lstOutput);
}

export async function callRemoteRechner(
  lohnSteuerJahr: number,
  bmfSteuerRechnerParameter: BmfSteuerRechnerParameter,
) {
  const url = bmfSteuerRechnerUrlOf(lohnSteuerJahr, bmfSteuerRechnerParameter);
  const xml = await queryBmfSteuerRechner(url);
  return BmfSteuerRechnerResponseParser.parse(xml);
}

const queryBmfSteuerRechner = (url: string): Promise<string> => {
  return fetch(url)
    .then(function (response: Response) {
      return response.text();
    })
    .catch(function (reason) {
      console.error(reason);
      throw errorOf("BmfSteuerRechnerCallFailed");
    });
};
