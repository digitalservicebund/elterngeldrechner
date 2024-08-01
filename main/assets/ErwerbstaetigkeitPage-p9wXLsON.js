import { r as reactExports, j as jsxRuntimeExports, Y as YesNo, i as initialStepErwerbstaetigkeitElternteil, a as useNavigate, b as useAppSelector, h as stepAllgemeineAngabenSelectors, u as useAppDispatch, P as Page, f as formSteps, s as stepRechnerActions, k as stepErwerbstaetigkeitActions } from "./index-wHl-L1Mm.js";
import { h as useFormContext, F as FormFieldGroup, e as CustomCheckbox, i as infoTexts, Y as YesNoRadio, C as CustomRadio, u as useForm, j as FormProvider } from "./Monatsplaner-D8D3n7LG.js";
import { S as Split, a as SplitItem } from "./Split-CujGvjwp.js";
import { B as ButtonGroup } from "./ButtonGroup-bPOGBYj7.js";
import "./egr-configuration-Cwpx2zXF.js";
const typeOfErwerbstaetigkeitLabels = {
  isNichtSelbststaendig: "Einkünfte aus nichtselbständiger Arbeit",
  isSelbststaendig: "Gewinneinkünfte"
};
function ErwerbstaetigkeitCheckboxGroup({ elternteil }) {
  var _a;
  const {
    register,
    getValues,
    formState: { errors }
  } = useFormContext();
  const hasSelbststaendigRegisterOptions = reactExports.useMemo(
    () => ({
      validate: {
        requireErwerbstaetigkeit: (isSelbststaendig) => {
          const isNichtSelbststaendig = getValues(
            `${elternteil}.isNichtSelbststaendig`
          );
          const isValid = !!isSelbststaendig || isNichtSelbststaendig;
          return isValid || "Bitte wählern sie eine Erwerbstätigkeit aus.";
        }
      }
    }),
    [getValues, elternteil]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(FormFieldGroup, { description: "Ich hatte in diesem Zeitraum…", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      CustomCheckbox,
      {
        register,
        registerOptions: {
          deps: [`${elternteil}.isSelbststaendig`]
        },
        name: `${elternteil}.isNichtSelbststaendig`,
        label: typeOfErwerbstaetigkeitLabels.isNichtSelbststaendig,
        errors: !!((_a = errors[elternteil]) == null ? void 0 : _a.isSelbststaendig),
        info: infoTexts.erwerbstaetigkeitNichtSelbststaendig
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      CustomCheckbox,
      {
        register,
        registerOptions: hasSelbststaendigRegisterOptions,
        name: `${elternteil}.isSelbststaendig`,
        label: typeOfErwerbstaetigkeitLabels.isSelbststaendig,
        errors,
        info: infoTexts.erwerbstaetigkeitGewinneinkuenfte
      }
    )
  ] });
}
const monatlichesBruttoLabels = {
  MiniJob: "Ja",
  MehrAlsMiniJob: "Nein"
};
const monatlichesBruttoOptions = [
  {
    value: "MiniJob",
    label: monatlichesBruttoLabels.MiniJob
  },
  {
    value: "MehrAlsMiniJob",
    label: monatlichesBruttoLabels.MehrAlsMiniJob
  }
];
function ErwerbstaetigkeitFormElternteil({
  elternteil,
  elternteilName,
  antragssteller
}) {
  const {
    register,
    formState: { errors },
    watch,
    reset,
    getValues
  } = useFormContext();
  const wasErwerbstaetig = watch(`${elternteil}.vorGeburt`);
  const isNichtSelbststaendig = watch(`${elternteil}.isNichtSelbststaendig`);
  const isSelbststaendig = watch(`${elternteil}.isSelbststaendig`);
  const mehrereTaetigkeiten = watch(`${elternteil}.mehrereTaetigkeiten`);
  reactExports.useEffect(() => {
    if (wasErwerbstaetig === YesNo.NO) {
      if (elternteil === "ET1") {
        reset({
          ...getValues(),
          ET1: {
            ...initialStepErwerbstaetigkeitElternteil,
            vorGeburt: YesNo.NO
          }
        });
      }
      if (elternteil === "ET2") {
        reset({
          ...getValues(),
          ET2: {
            ...initialStepErwerbstaetigkeitElternteil,
            vorGeburt: YesNo.NO
          }
        });
      }
    }
  }, [elternteil, reset, wasErwerbstaetig, getValues]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      FormFieldGroup,
      {
        headline: antragssteller === "FuerBeide" ? elternteilName : "",
        description: "Waren Sie in den 12 Monaten vor der Geburt Ihres Kindes erwerbstätig?",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          YesNoRadio,
          {
            register,
            registerOptions: { required: "Dieses Feld ist erforderlich" },
            name: `${elternteil}.vorGeburt`,
            errors,
            required: true
          }
        )
      }
    ),
    wasErwerbstaetig === YesNo.YES && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ErwerbstaetigkeitCheckboxGroup, { elternteil }),
      !!isNichtSelbststaendig && !isSelbststaendig && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FormFieldGroup, { description: "Bestand Ihre nichtselbständige Arbeit aus mehreren Tätigkeiten?", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          YesNoRadio,
          {
            register,
            registerOptions: { required: "Dieses Feld ist erforderlich" },
            name: `${elternteil}.mehrereTaetigkeiten`,
            errors,
            required: true
          }
        ) }),
        mehrereTaetigkeiten === YesNo.NO && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FormFieldGroup, { description: "Waren Sie in den 12 Monaten vor der Geburt Ihres Kindes sozialversicherungspflichtig?", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            YesNoRadio,
            {
              register,
              registerOptions: {
                required: "Dieses Feld ist erforderlich"
              },
              name: `${elternteil}.sozialVersicherungsPflichtig`,
              errors,
              required: true
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FormFieldGroup,
            {
              description: "Hatten Sie Einkommen aus einem Mini-Job?",
              info: infoTexts.minijobsMaxZahl,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                CustomRadio,
                {
                  register,
                  registerOptions: {
                    required: "Dieses Feld ist erforderlich"
                  },
                  name: `${elternteil}.monatlichesBrutto`,
                  errors,
                  options: monatlichesBruttoOptions,
                  required: true
                }
              )
            }
          )
        ] })
      ] })
    ] })
  ] });
}
function ErwerbstaetigkeitForm({
  initialValues,
  onSubmit,
  handleDirtyForm
}) {
  const navigate = useNavigate();
  const methods = useForm({
    defaultValues: initialValues
  });
  const { handleSubmit, reset, getValues } = methods;
  const { isDirty, dirtyFields } = methods.formState;
  const antragssteller = useAppSelector(
    stepAllgemeineAngabenSelectors.getAntragssteller
  );
  const { ET1, ET2 } = useAppSelector(
    stepAllgemeineAngabenSelectors.getElternteilNames
  );
  const handlePageBack = () => navigate("/nachwuchs");
  reactExports.useEffect(() => {
    handleDirtyForm(isDirty, dirtyFields);
  }, [isDirty, dirtyFields, handleDirtyForm]);
  reactExports.useEffect(() => {
    if (antragssteller !== "FuerBeide") {
      reset({
        ...getValues(),
        ET2: initialStepErwerbstaetigkeitElternteil
      });
    }
  }, [reset, antragssteller, getValues]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "mb-10", children: [
      "Erwerbstätigkeit",
      antragssteller === "EinenElternteil" ? " *" : ""
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FormProvider, { ...methods, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit(onSubmit), noValidate: true, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Split, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SplitItem, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          ErwerbstaetigkeitFormElternteil,
          {
            elternteil: "ET1",
            elternteilName: ET1,
            antragssteller
          }
        ) }),
        antragssteller === "FuerBeide" && /* @__PURE__ */ jsxRuntimeExports.jsx(SplitItem, { hasDivider: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          ErwerbstaetigkeitFormElternteil,
          {
            elternteil: "ET2",
            elternteilName: ET2,
            antragssteller
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ButtonGroup, { onClickBackButton: handlePageBack })
    ] }) })
  ] });
}
function ErwerbstaetigkeitPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const initialValues = useAppSelector((state) => state.stepErwerbstaetigkeit);
  const [isFormDirty, setIsFormDirty] = reactExports.useState(false);
  const [dirtyFields, setDirtyFields] = reactExports.useState({});
  const handleSubmit = (values) => {
    if (isFormDirty || values.ET1.vorGeburt !== initialValues.ET1.vorGeburt || values.ET2.vorGeburt !== initialValues.ET2.vorGeburt) {
      dispatch(
        stepRechnerActions.setHasBEGResultChangedDueToPrevFormSteps({
          ET1: Object.hasOwn(dirtyFields, "ET1") || values.ET1.vorGeburt !== initialValues.ET1.vorGeburt,
          ET2: Object.hasOwn(dirtyFields, "ET2") || values.ET2.vorGeburt !== initialValues.ET2.vorGeburt
        })
      );
    }
    dispatch(stepErwerbstaetigkeitActions.submitStep(values));
    navigate(formSteps.einkommen.route);
  };
  const handleDirtyForm = (isFormDirty2, dirtyFields2) => {
    setIsFormDirty(isFormDirty2);
    setDirtyFields(dirtyFields2);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Page, { step: formSteps.erwerbstaetigkeit, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    ErwerbstaetigkeitForm,
    {
      initialValues,
      onSubmit: handleSubmit,
      handleDirtyForm
    }
  ) });
}
export {
  ErwerbstaetigkeitPage as default
};
