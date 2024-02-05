import nsp from "./namespace";
import PROJECT_NAMESPACE from "../../projectNamespace";

describe("namespace", () => {
  it("adds namespace to single className", () => {
    expect(nsp("class")).toBe(`${PROJECT_NAMESPACE}-class`);
  });

  it("adds namespace to multiple className arguments", () => {
    expect(nsp("A", "B")).toBe(`${PROJECT_NAMESPACE}-A ${PROJECT_NAMESPACE}-B`);
  });

  it("adds namespace to classNames separated by space", () => {
    expect(nsp("A B")).toBe(`${PROJECT_NAMESPACE}-A ${PROJECT_NAMESPACE}-B`);
  });

  it("returns empty string if no argument supplied", () => {
    expect(nsp()).toBe("");
  });
});
