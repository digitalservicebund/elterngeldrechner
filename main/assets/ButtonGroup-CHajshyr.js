import { j as jsxRuntimeExports, c as classNames, n as nsp, B as Button } from "./index-C1rUknhs.js";
function ButtonGroup({
  onClickBackButton,
  onClickResetForm,
  isStepOne = false
}) {
  const secondButtonAttributes = onClickResetForm ? { onClick: onClickResetForm, label: "Neu starten" } : { isSubmitButton: true, label: "Weiter" };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      className: classNames(
        nsp("button-group"),
        isStepOne && nsp("button-group--step-one")
      ),
      children: [
        !isStepOne && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: onClickBackButton,
            label: "Zurück",
            buttonStyle: "secondary"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { ...secondButtonAttributes })
      ]
    }
  );
}
export {
  ButtonGroup as B
};
