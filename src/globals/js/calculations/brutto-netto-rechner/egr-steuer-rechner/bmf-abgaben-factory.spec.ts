import { BmfSteuerRechnerResponse } from "@/globals/js/calculations/brutto-netto-rechner/bmf-steuer-rechner";
import Big from "big.js";
import { bmfAbgabenOf } from "./bmf-abgaben-factory";
import { BmfAbgaben } from "./bmf-abgaben";

describe("bmf-abgaben-factory", () => {
  it("should map all fields from BmfSteuerRechnerResponse to BmfAbgaben", () => {
    // given
    const response = new BmfSteuerRechnerResponse();
    let value = Big(101.01);
    let bmfSteuerRechnerResponseFieldName: keyof BmfSteuerRechnerResponse;
    for (bmfSteuerRechnerResponseFieldName in response) {
      response[bmfSteuerRechnerResponseFieldName] = value;
      value = value.add(Big(1.01));
    }

    // when
    const bmfAbgaben = bmfAbgabenOf(response);

    // then
    let bmfAbgabenFieldName: keyof BmfAbgaben;
    for (bmfAbgabenFieldName in bmfAbgaben) {
      const responseFieldName =
        correspondingFieldNameOfBmfSteuerRechnerResponse(bmfAbgabenFieldName);

      const bmfAbgabenValue = bmfAbgaben[bmfAbgabenFieldName];
      const bmfSteuerRechnerResponseValue = response[responseFieldName];
      expect(bmfAbgabenValue).toBe(bmfSteuerRechnerResponseValue);
    }
  });
});

function correspondingFieldNameOfBmfSteuerRechnerResponse(
  bmfAbgabenFieldName: keyof BmfAbgaben,
): keyof BmfSteuerRechnerResponse {
  const response = new BmfSteuerRechnerResponse();
  let responseFieldName: keyof BmfSteuerRechnerResponse;
  for (responseFieldName in response) {
    if (responseFieldName === bmfAbgabenFieldName.toLocaleUpperCase()) {
      return responseFieldName;
    }
  }
  throw new Error(
    `Field with name ${bmfAbgabenFieldName.toLocaleUpperCase()} not found in BmfSteuerRechnerResponse.`,
  );
}
