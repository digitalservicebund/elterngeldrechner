import { j as jsxRuntimeExports, c as classNames, n as nsp } from "./index-BtFhMPZD.js";
function SplitItem({ hasDivider, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: classNames(
        nsp("split-item"),
        hasDivider && nsp("split-item--has-divider")
      ),
      children
    }
  );
}
function Split({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: nsp("split"), children });
}
export {
  Split as S,
  SplitItem as a
};
