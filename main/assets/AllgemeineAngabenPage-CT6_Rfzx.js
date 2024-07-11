import { j as jsxRuntimeExports, c as classNames, n as nsp, Y as YesNo, r as reactExports, u as useAppDispatch, a as useNavigate, b as useAppSelector, P as Page, f as formSteps, s as stepRechnerActions, d as stepAllgemeineAngabenActions } from "./index-CLJxrWwv.js";
import { g as get, D as Description, I as InfoDialog, u as useForm, F as FormFieldGroup, C as CustomRadio, i as infoTexts, Y as YesNoRadio } from "./Monatsplaner-4G9-NlYZ.js";
import { S as Split, a as SplitItem } from "./Split-BGMYp084.js";
import { B as ButtonGroup } from "./ButtonGroup-B0R3sbVU.js";
import "./egr-configuration-Cwpx2zXF.js";
function CustomInput({
  register,
  name,
  label,
  errors,
  placeholder,
  info
}) {
  const error = get(errors, name);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: classNames(
        nsp("custom-input"),
        error && nsp("custom-input--error")
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: nsp("custom-input-question"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: nsp("custom-input-question__label"), htmlFor: name, children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              className: nsp("custom-input-question__input"),
              ...register(name),
              type: "text",
              id: name,
              placeholder,
              "aria-describedby": error ? `${name}-error` : void 0,
              "aria-invalid": !!error
            }
          ),
          !!error && /* @__PURE__ */ jsxRuntimeExports.jsx(Description, { id: `${name}-error`, error: true, children: error.message })
        ] }),
        !!info && /* @__PURE__ */ jsxRuntimeExports.jsx(InfoDialog, { info })
      ]
    }
  );
}
const antragstellendeLabels = {
  FuerBeide: "Für beide",
  EinenElternteil: "Für einen Elternteil"
};
const antragstellendeOptions = [
  { value: "FuerBeide", label: antragstellendeLabels.FuerBeide },
  { value: "EinenElternteil", label: antragstellendeLabels.EinenElternteil }
];
function AllgemeineAngabenForm({
  initialValues,
  onSubmit,
  handleDirtyForm
}) {
  const { register, handleSubmit, watch, formState } = useForm({
    defaultValues: initialValues
  });
  const { isDirty, dirtyFields } = formState;
  const antragstellendeFormValue = watch("antragstellende");
  const mutterschaftssleistungenFormValue = watch("mutterschaftssleistungen");
  const mutteschaftsleistungenOptions = [
    { value: "ET1", label: watch("pseudonym.ET1") || "Elternteil 1" },
    { value: "ET2", label: watch("pseudonym.ET2") || "Elternteil 2" }
  ];
  const showMutterschaftsleistungsWerGroup = antragstellendeFormValue === "FuerBeide" && mutterschaftssleistungenFormValue === YesNo.YES;
  reactExports.useEffect(() => {
    handleDirtyForm(isDirty, dirtyFields);
  }, [isDirty, dirtyFields, handleDirtyForm]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit(onSubmit), noValidate: true, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mb-10", children: "Allgemeine Angaben" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      FormFieldGroup,
      {
        headline: "Eltern",
        description: "Für wen planen Sie Elterngeld?",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          CustomRadio,
          {
            register,
            registerOptions: { required: "Dieses Feld ist erforderlich" },
            name: "antragstellende",
            errors: formState.errors,
            options: antragstellendeOptions,
            required: true
          }
        )
      }
    ),
    antragstellendeFormValue === "FuerBeide" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      FormFieldGroup,
      {
        headline: "Ihre Namen (optional)",
        description: "Um auf die Begriffe Elternteil 1 und Elternteil 2 in den folgenden Schritten verzichten zu können, können Sie hier Ihre Namen oder ein Pseudonym angeben, welches wir dann verwenden werden.",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Split, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SplitItem, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            CustomInput,
            {
              register,
              name: "pseudonym.ET1",
              label: "Name für Elternteil 1"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SplitItem, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            CustomInput,
            {
              register,
              name: "pseudonym.ET2",
              label: "Name für Elternteil 2"
            }
          ) })
        ] })
      }
    ) : null,
    antragstellendeFormValue === "EinenElternteil" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      FormFieldGroup,
      {
        headline: "Alleinerziehendenstatus",
        description: "Sind Sie alleinerziehend?",
        info: infoTexts.alleinerziehend,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          YesNoRadio,
          {
            register,
            registerOptions: { required: "Dieses Feld ist erforderlich" },
            name: "alleinerziehend",
            errors: formState.errors,
            required: true
          }
        )
      }
    ) : null,
    /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: antragstellendeFormValue !== null ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        FormFieldGroup,
        {
          headline: "Mutterschaftsleistungen",
          description: "Beziehen Sie Mutterschaftsleistungen?",
          info: infoTexts.mutterschaftsleistungen,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            YesNoRadio,
            {
              register,
              registerOptions: { required: "Dieses Feld ist erforderlich" },
              name: "mutterschaftssleistungen",
              errors: formState.errors,
              required: true
            }
          )
        }
      ),
      !!showMutterschaftsleistungsWerGroup && /* @__PURE__ */ jsxRuntimeExports.jsx(FormFieldGroup, { description: "Welcher Elternteil bezieht Mutterschaftsleistungen?", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        CustomRadio,
        {
          register,
          registerOptions: {
            required: "Dieses Feld ist erforderlich"
          },
          name: "mutterschaftssleistungenWer",
          options: mutteschaftsleistungenOptions,
          errors: formState.errors,
          required: true
        }
      ) })
    ] }) : null }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ButtonGroup, { isStepOne: true })
  ] }) });
}
function AllgemeineAngabenPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const initialValues = useAppSelector((state) => state.stepAllgemeineAngaben);
  const [isFormDirty, setIsFormDirty] = reactExports.useState(false);
  const handleSubmit = (values) => {
    if (isFormDirty) {
      dispatch(
        stepRechnerActions.setHasBEGResultChangedDueToPrevFormSteps({
          ET1: true,
          ET2: true
        })
      );
    }
    dispatch(stepAllgemeineAngabenActions.submitStep(values));
    navigate(formSteps.nachwuchs.route);
  };
  const handleDirtyForm = (isFormDirty2) => {
    setIsFormDirty(isFormDirty2);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Page, { step: formSteps.allgemeinAngaben, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    AllgemeineAngabenForm,
    {
      initialValues,
      onSubmit: handleSubmit,
      handleDirtyForm
    }
  ) });
}
export {
  AllgemeineAngabenPage as default
};
