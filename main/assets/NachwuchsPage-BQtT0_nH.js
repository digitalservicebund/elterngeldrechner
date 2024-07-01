import { e as setTrackingVariable, j as jsxRuntimeExports, c as classNames, n as nsp, a as useNavigate, p as parseGermanDateString, r as reactExports, B as Button, D as DateTime, u as useAppDispatch, b as useAppSelector, P as Page, f as formSteps, s as stepRechnerActions, g as stepNachwuchsActions } from "./index-BSa1_k3q.js";
import { g as get, _ as _default, D as Description, a as useController, I as InfoDialog, b as IMaskInput, c as IMask, u as useForm, d as useFieldArray, F as FormFieldGroup, i as infoTexts, e as CustomCheckbox, f as _default$2 } from "./Monatsplaner-DYBVVM3B.js";
import { _ as _default$1 } from "./egr-configuration-C2Zf_Eby.js";
import { B as ButtonGroup } from "./ButtonGroup-CrKhCTTi.js";
function trackNutzergruppe(birthdate) {
  const nutzergruppe = mapDateToNutzergruppe(birthdate);
  setTrackingVariable(TRACKING_VARIABLE_NAME, nutzergruppe);
}
function mapDateToNutzergruppe(birthdate) {
  const today = /* @__PURE__ */ new Date();
  const dayThreeMonthsAgo = new Date((/* @__PURE__ */ new Date()).setMonth(today.getMonth() - 3));
  const isInFuture = birthdate > today;
  const wasWithinLastThreeMonths = dayThreeMonthsAgo <= birthdate && birthdate <= today;
  return isInFuture ? "werdende Eltern" : wasWithinLastThreeMonths ? "junge Eltern" : "nachbeantragende Eltern";
}
const TRACKING_VARIABLE_NAME = "nutzergruppe";
function Counter({
  register,
  registerOptions,
  name,
  label,
  errors,
  onIncrease,
  onDecrease,
  required
}) {
  const error = get(errors, name);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: classNames(nsp("counter"), error && nsp("counter--error")), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: nsp("counter__label"), htmlFor: name, children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: nsp("counter__controls"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: nsp("counter__button"),
          type: "button",
          onClick: onDecrease,
          "aria-label": "verringern",
          "aria-controls": name,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(_default, {})
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          ...register(name, registerOptions),
          className: nsp("counter__input"),
          type: "number",
          id: name,
          "aria-describedby": error ? `${name}-error` : void 0,
          "aria-invalid": !!error,
          required
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: nsp("counter__button"),
          type: "button",
          onClick: onIncrease,
          "aria-label": "erhöhen",
          "aria-controls": name,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(_default$1, {})
        }
      )
    ] }),
    !!error && /* @__PURE__ */ jsxRuntimeExports.jsx(Description, { id: `${name}-error`, error: true, children: error.message })
  ] });
}
function CustomDate({
  control,
  rules,
  name,
  label,
  required,
  info
}) {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error }
  } = useController({ control, rules, name });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: nsp("custom-date"), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: nsp("custom-date__label"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: name, children: label }),
      !!info && /* @__PURE__ */ jsxRuntimeExports.jsx(InfoDialog, { info })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: classNames(
          nsp("custom-date__field"),
          error && nsp("custom-date__field--error")
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: nsp("custom-date__placeholder"), "aria-hidden": true, children: "TT.MM.JJJJ" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            IMaskInput,
            {
              className: nsp("custom-date__input"),
              name,
              id: name,
              inputRef: ref,
              mask: Date,
              lazy: true,
              autofix: "pad",
              value,
              blocks: {
                d: {
                  mask: IMask.MaskedRange,
                  placeholderChar: "_",
                  from: 1,
                  to: 31,
                  maxLength: 2
                },
                m: {
                  mask: IMask.MaskedRange,
                  placeholderChar: "_",
                  from: 1,
                  to: 12,
                  maxLength: 2
                },
                Y: {
                  mask: IMask.MaskedRange,
                  placeholderChar: "_",
                  from: 1900,
                  to: 2999,
                  maxLength: 4
                }
              },
              onAccept: (value2) => onChange(value2),
              onBlur,
              placeholder: "__.__.___",
              "aria-placeholder": "Eingabeformat Tag Monat Jahr zum Beispiel 12.05.2022",
              "aria-invalid": !!error,
              "aria-describedby": error ? `${name}-error` : void 0,
              required
            }
          )
        ]
      }
    ),
    !!error && /* @__PURE__ */ jsxRuntimeExports.jsx(Description, { id: `${name}-error`, error: true, children: error.message })
  ] });
}
const validateMonth = (date) => {
  const [inputDay, inputMonth, inputYear] = date.split(".");
  const inputDate = DateTime.fromISO(`${inputYear}-${inputMonth}-${inputDay}`).startOf("month").toMillis();
  const maxMonthAgo = 32;
  const dateMaxMonthAgo = DateTime.now().minus({ month: maxMonthAgo }).startOf("month").toMillis();
  if (inputDate >= dateMaxMonthAgo) {
    return true;
  } else {
    return `Elterngeld wird maximal für ${maxMonthAgo} Lebensmonate rückwirkend gezahlt.`;
  }
};
function NachwuchsForm({
  initialValues,
  onSubmit,
  handleDirtyForm
}) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState,
    getValues
  } = useForm({
    defaultValues: initialValues
  });
  const { fields, append, remove } = useFieldArray({
    name: "geschwisterkinder",
    control
  });
  const navigate = useNavigate();
  const handlePageBack = () => navigate("/allgemeine-angaben");
  const { isDirty, dirtyFields } = formState;
  register("anzahlKuenftigerKinder", { valueAsNumber: true });
  const anzahlKuenftigerKinder = watch("anzahlKuenftigerKinder");
  const geburtsdatum = watch("wahrscheinlichesGeburtsDatum");
  trackNutzergruppe(parseGermanDateString(geburtsdatum));
  const handleDecrease = () => setValue(
    "anzahlKuenftigerKinder",
    Math.max(anzahlKuenftigerKinder - 1, 0),
    { shouldDirty: true }
  );
  const handleIncrease = () => setValue(
    "anzahlKuenftigerKinder",
    Math.min(anzahlKuenftigerKinder + 1, 8),
    { shouldDirty: true }
  );
  const handleAppendGeschwisterkind = () => append({
    geburtsdatum: "",
    istBehindert: false
  });
  reactExports.useEffect(() => {
    handleDirtyForm(isDirty, dirtyFields);
  }, [isDirty, dirtyFields, handleDirtyForm]);
  const wahrscheinlichesGeburtsDatumName = "wahrscheinlichesGeburtsDatum";
  const wahrscheinlichesGeburtsDatum = getValues(
    wahrscheinlichesGeburtsDatumName
  );
  const dateOf = (germanDate) => {
    const [day, month, year] = germanDate.split(".");
    return DateTime.fromISO(`${year}-${month}-${day}`);
  };
  const geburtValidation = (date) => {
    if (date === "") {
      return true;
    }
    const geburtGeschwisterKind = dateOf(date);
    const geburtKind = dateOf(wahrscheinlichesGeburtsDatum);
    if (geburtGeschwisterKind < geburtKind) {
      return true;
    } else {
      return "Das Geschwisterkind muss älter als das Kind oben sein.";
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit(onSubmit), name: "Ihr Nachwuchs", noValidate: true, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(FormFieldGroup, { headline: "Kinder", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        CustomDate,
        {
          control,
          rules: {
            required: "Dieses Feld ist erforderlich",
            pattern: {
              value: /^\d{2}\.\d{2}\.\d{4}$/,
              message: "Bitte das Feld vollständig ausfüllen oder leer lassen"
            },
            validate: {
              validateMonth
            }
          },
          name: wahrscheinlichesGeburtsDatumName,
          label: "Wann wird Ihr Kind voraussichtlich geboren?",
          required: true,
          info: infoTexts.kindGeburtsdatum
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Counter,
        {
          register,
          registerOptions: {
            max: {
              value: 8,
              message: "Es können nicht mehr als 8 Kinder angegeben werden"
            },
            min: {
              value: 1,
              message: "Es muss mindestens ein Kind angegeben werden"
            },
            required: "Dieses Feld ist erforderlich"
          },
          name: "anzahlKuenftigerKinder",
          label: "Wie viele Kinder erwarten Sie (z.B. Zwillinge)?",
          errors: formState.errors,
          onIncrease: handleIncrease,
          onDecrease: handleDecrease,
          required: true
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      FormFieldGroup,
      {
        headline: "Ältere Geschwisterkinder (falls vorhanden)",
        description: "Wenn es kein Geschwisterkind gibt, können Sie diesen Schritt einfach\n          überspringen.",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: nsp("nachwuchs-form__geschwisterkinder"), children: fields.map((field, index) => {
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "li",
              {
                role: "region",
                "aria-label": `${index + 1}. Geschwisterkind`,
                children: [
                  index > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mb-10", children: "Geschwisterkind" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    CustomDate,
                    {
                      control,
                      rules: {
                        pattern: {
                          value: /^\d{2}\.\d{2}\.\d{4}$/,
                          message: "Bitte das Feld vollständig ausfüllen oder leer lassen"
                        },
                        validate: geburtValidation
                      },
                      name: `geschwisterkinder.${index}.geburtsdatum`,
                      label: "Wann wurde das Geschwisterkind geboren?"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    CustomCheckbox,
                    {
                      register,
                      name: `geschwisterkinder.${index}.istBehindert`,
                      label: "Das Geschwisterkind hat eine Behinderung"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      onClick: () => remove(index),
                      iconAfter: /* @__PURE__ */ jsxRuntimeExports.jsx(_default$2, {}),
                      className: nsp("nachwuchs-form__geschwisterkinder-delete"),
                      buttonStyle: "link",
                      label: "Geschwisterkind entfernen"
                    }
                  )
                ]
              },
              field.id
            );
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleAppendGeschwisterkind,
              iconBefore: /* @__PURE__ */ jsxRuntimeExports.jsx(_default$1, {}),
              ariaLabel: `${!fields.length ? "Älteres" : "Weiteres"} Geschwisterkind hinzufügen`,
              buttonStyle: "secondary",
              label: `${!fields.length ? "Älteres" : "Weiteres"} Geschwisterkind hinzufügen`
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ButtonGroup, { onClickBackButton: handlePageBack })
  ] });
}
function NachwuchsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const initialValues = useAppSelector((state) => state.stepNachwuchs);
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
    dispatch(stepNachwuchsActions.submitStep(values));
    navigate(formSteps.erwerbstaetigkeit.route);
  };
  const handleDirtyForm = (isFormDirty2) => {
    setIsFormDirty(isFormDirty2);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Page, { step: formSteps.nachwuchs, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    NachwuchsForm,
    {
      initialValues,
      onSubmit: handleSubmit,
      handleDirtyForm
    }
  ) });
}
export {
  NachwuchsPage as default
};
