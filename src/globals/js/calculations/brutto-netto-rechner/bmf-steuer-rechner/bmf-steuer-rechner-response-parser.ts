import Big from "big.js";
import { BmfSteuerRechnerResponse } from "./bmf-steuer-rechner-response";

/**
 * Parser for XML response from BMF Lohn- und Einkommensteuerrechner.
 *
 * Response and interface descriptions:
 * - https://www.bmf-steuerrechner.de/interface/einganginterface.xhtml
 * - https://issues.init.de/secure/attachment/708773/708773_2021-11-05-PAP-2022-anlage-1.pdf
 */
export namespace BmfSteuerRechnerResponseParser {
  const parser = new DOMParser();

  const fillResponseFromXmlElement = (
    xmlElement: Element,
    response: BmfSteuerRechnerResponse,
  ) => {
    const name = xmlElement.getAttribute("name");
    if (name == null) {
      return;
    }

    const value = xmlElement.getAttribute("value");
    if (value == null) {
      return;
    }

    let fieldName: keyof BmfSteuerRechnerResponse;
    for (fieldName in response) {
      if (fieldName === name) {
        // Values from bmf xml are cents, response values are euros
        response[fieldName] = Big(value).div(100);
      }
    }
  };

  /**
   * Parse XML response from BMF Lohn- und Einkommensteuerrechner from a string into BmfLohnRechnerResponse.
   *
   * @param xml XML response from BMF Lohn- und Einkommensteuerrechner
   *
   * @return BmfLohnRechnerResponse from BMF Lohn- und Einkommensteuerrechner
   */
  export function parse(xml: string): BmfSteuerRechnerResponse {
    const response = new BmfSteuerRechnerResponse();
    const document = parser.parseFromString(xml, "text/xml");
    const ausgabeElementList = document.getElementsByTagName("ausgabe");

    for (let i = 0; i < ausgabeElementList.length; i++) {
      const xmlElement = ausgabeElementList.item(i);
      if (xmlElement) {
        fillResponseFromXmlElement(xmlElement, response);
      }
    }

    return response;
  }
}
