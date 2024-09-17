import { produce } from "immer";
import { usePlanungdaten } from "./usePlanungsdaten";
import { INITIAL_STATE, renderHook } from "@/test-utils/test-utils";

describe("usePlanungsdaten", () => {
  it("provides two data set entries for each parent if no single parent", () => {
    const preloadedState = produce(INITIAL_STATE, (recipe) => {
      recipe.stepAllgemeineAngaben.antragstellende = "FuerBeide";
    });

    const { result } = renderHook(() => usePlanungdaten(), { preloadedState });

    expect(result.current).toHaveLength(2);
  });

  it("provides one data set entry if single parent", () => {
    const preloadedState = produce(INITIAL_STATE, (recipe) => {
      recipe.stepAllgemeineAngaben.antragstellende = "EinenElternteil";
    });

    const { result } = renderHook(() => usePlanungdaten(), { preloadedState });

    expect(result.current).toHaveLength(1);
  });

  it("provides the pseudonyms of both parents as names", () => {
    const preloadedState = produce(INITIAL_STATE, (recipe) => {
      recipe.stepAllgemeineAngaben.pseudonym = { ET1: "Jane", ET2: "" };
    });

    const { result } = renderHook(() => usePlanungdaten(), { preloadedState });

    expect(result.current[0].name).toEqual("Jane");
    expect(result.current[1].name).toEqual("Elternteil 2");
  });
});
