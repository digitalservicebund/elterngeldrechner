import { setTrackingVariable } from "./data-layer";
import { trackObstacle } from "@/user-tracking/feedback";

vi.mock(import("./data-layer"));

describe("feedback", () => {
  it("resets the obstacles", () => {
    trackObstacle("Planer bedienen", ["Angaben machen"]);

    expect(setTrackingVariable).toHaveBeenCalledWith(
      "customer-effort-score-obstacle-planer-bedienen",
      1,
    );

    expect(setTrackingVariable).toHaveBeenCalledWith(
      "customer-effort-score-obstacle-angaben-machen",
      0,
    );
  });
});
