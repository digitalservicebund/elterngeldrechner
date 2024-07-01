import { a as useNavigate, b as useAppSelector, h as stepAllgemeineAngabenSelectors, Y as YesNo, E as EgrBerechnungParamId, r as reactExports, j as jsxRuntimeExports, u as useAppDispatch, P as Page, f as formSteps, s as stepRechnerActions, l as stepEinkommenActions } from "./index-BSa1_k3q.js";
import { u as useForm, j as FormProvider, F as FormFieldGroup, i as infoTexts, Y as YesNoRadio, E as EinkommenFormElternteil } from "./Monatsplaner-DYBVVM3B.js";
import "./egr-configuration-C2Zf_Eby.js";
import { S as Split, a as SplitItem } from "./Split-B7zlNWZL.js";
import { B as ButtonGroup } from "./ButtonGroup-CrKhCTTi.js";
function EinkommenForm({
  initialValues,
  onSubmit,
  handleDirtyForm
}) {
  const navigate = useNavigate();
  const methods = useForm({ defaultValues: initialValues });
  const { isDirty, dirtyFields, errors } = methods.formState;
  const antragstellende = useAppSelector(
    stepAllgemeineAngabenSelectors.getAntragssteller
  );
  const { ET1, ET2 } = useAppSelector(
    stepAllgemeineAngabenSelectors.getElternteilNames
  );
  const alleinerziehend = useAppSelector(
    stepAllgemeineAngabenSelectors.getAlleinerziehend
  );
  const amountLimitEinkommen = alleinerziehend === YesNo.YES ? EgrBerechnungParamId.MAX_EINKOMMEN_ALLEIN : EgrBerechnungParamId.MAX_EINKOMMEN_BEIDE;
  const handlePageBack = () => navigate("/erwerbstaetigkeit");
  reactExports.useEffect(() => {
    handleDirtyForm(isDirty, dirtyFields);
  }, [isDirty, dirtyFields, handleDirtyForm]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mb-10", children: "Ihr Einkommen" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FormProvider, { ...methods, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: methods.handleSubmit(onSubmit), noValidate: true, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        FormFieldGroup,
        {
          "data-testid": "egr-anspruch",
          description: `Hatten Sie im Kalenderjahr vor der Geburt ein Gesamteinkommen von mehr als ${amountLimitEinkommen.toLocaleString()} Euro?`,
          info: infoTexts.einkommenLimitÜberschritten,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            YesNoRadio,
            {
              register: methods.register,
              registerOptions: { required: "Dieses Feld ist erforderlich" },
              name: "limitEinkommenUeberschritten",
              errors,
              required: true
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Split, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SplitItem, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(EinkommenFormElternteil, { elternteil: "ET1", elternteilName: ET1 }) }),
        antragstellende === "FuerBeide" && /* @__PURE__ */ jsxRuntimeExports.jsx(SplitItem, { hasDivider: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          EinkommenFormElternteil,
          {
            elternteil: "ET2",
            elternteilName: ET2
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ButtonGroup, { onClickBackButton: handlePageBack })
    ] }) })
  ] });
}
function EinkommenPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const initialValues = useAppSelector((state) => state.stepEinkommen);
  const [isFormDirty, setIsFormDirty] = reactExports.useState(false);
  const [dirtyFields, setDirtyFields] = reactExports.useState({});
  const handleSubmit = (values) => {
    if (isFormDirty || values.ET1.bruttoEinkommenNichtSelbstaendig.type !== initialValues.ET1.bruttoEinkommenNichtSelbstaendig.type || values.ET2.bruttoEinkommenNichtSelbstaendig.type !== initialValues.ET2.bruttoEinkommenNichtSelbstaendig.type) {
      dispatch(
        stepRechnerActions.setHasBEGResultChangedDueToPrevFormSteps({
          ET1: Object.hasOwn(dirtyFields, "ET1") || values.ET1.bruttoEinkommenNichtSelbstaendig.type !== initialValues.ET1.bruttoEinkommenNichtSelbstaendig.type,
          ET2: Object.hasOwn(dirtyFields, "ET2") || values.ET2.bruttoEinkommenNichtSelbstaendig.type !== initialValues.ET2.bruttoEinkommenNichtSelbstaendig.type
        })
      );
    }
    dispatch(stepEinkommenActions.submitStep(values));
    navigate(formSteps.elterngeldvarianten.route);
  };
  const handleDirtyForm = (isFormDirty2, dirtyFields2) => {
    setIsFormDirty(isFormDirty2);
    setDirtyFields(dirtyFields2);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Page, { step: formSteps.einkommen, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    EinkommenForm,
    {
      initialValues,
      onSubmit: handleSubmit,
      handleDirtyForm
    }
  ) });
}
export {
  EinkommenPage as default
};
