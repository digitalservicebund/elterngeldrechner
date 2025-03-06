import { beforeAll, describe, expect, it } from "vitest";
import {
  establishDataLayer,
  getTrackingVariable,
  setTrackingVariable,
} from "@/application/user-tracking/data-layer";

describe("getTrackingVariable", () => {
  beforeAll(() => establishDataLayer());

  it("returns the last variable even if it is null", () => {
    setTrackingVariable("my-var", 0);
    setTrackingVariable("my-var", 5);
    setTrackingVariable("my-var", 6);
    setTrackingVariable("my-var", null);

    expect(getTrackingVariable("my-var")).toBeNull();
  });

  it("returns the last variable ", () => {
    setTrackingVariable("my-var", 5);
    setTrackingVariable("my-var", 6);

    expect(getTrackingVariable("my-var")).toEqual(6);
  });
});
