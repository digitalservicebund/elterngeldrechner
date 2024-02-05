import { bmfSteuerRechnerUrlOf } from "./bmf-steuer-rechner-configuration";
import { BmfSteuerRechnerResponseParser } from "./bmf-steuer-rechner-response-parser";
import { BmfSteuerRechnerParameter } from "./bmf-steuer-rechner-parameter";
import { BmfSteuerRechnerResponse } from "./bmf-steuer-rechner-response";
import * as https from "https";

/**
 * Namespace for function to call the BMF Lohn- und Einkommensteuerrechner with node https library.
 *
 * Only for test calls!
 *
 * BMF Lohn- und Einkommensteuerrechner descriptions:
 * - https://www.bmf-steuerrechner.de/interface/einganginterface.xhtml
 * - https://issues.init.de/secure/attachment/708773/708773_2021-11-05-PAP-2022-anlage-1.pdf
 */
export namespace BmfSteuerRechnerTestUtil {
  /**
   * Calls the BMF Lohn- und Einkommensteuerrechner with node js library.
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
    const url = bmfSteuerRechnerUrlOf(
      lohnSteuerJahr,
      bmfSteuerRechnerParameter,
    );
    const xml = await queryBmfSteuerRechner(url);
    // console.log(`url: ${url}`);
    // console.log(`xml: ${xml}`);
    return BmfSteuerRechnerResponseParser.parse(xml);
  }

  const queryBmfSteuerRechner = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      https
        .get(url, (response) => {
          if (200 !== response.statusCode) {
            reject(response.statusCode);
            response.resume();
            return;
          }

          let data = "";
          response.setEncoding("utf8");
          response.on("error", reject);
          response.on("data", (chunk) => (data += chunk));

          response.on("end", () => resolve(data));
        })
        .on("error", (err) => reject(err));
    });
  };
}
