import { j as jsxRuntimeExports, Y as YesNo, n as nsp, u as useAppDispatch, r as reactExports, s as stepRechnerActions, B as Button, o as initialBruttoEinkommenZeitraum, b as useAppSelector, q as _default$1, k as stepAllgemeineAngabenSelectors, t as numberOfMutterschutzMonths, E as EgrBerechnungParamId, P as Page, f as formSteps } from "./index-B7cZhPzB.js";
import { j as FootNoteNumber, u as useForm, d as useFieldArray, g as get, F as FormFieldGroup, D as Description, e as CustomCheckbox, k as CustomNumberField, Z as Zeitraum, _ as _default, l as availableZeitraumOptions, R as RechnerResultTable, T as Toast, M as Monatsplaner } from "./Monatsplaner-VMXTUSwH.js";
import { E as EgrConst } from "./egr-configuration-Cwpx2zXF.js";
function NotificationBEGResultWasRecalculated({
  elternteilName,
  alleinerziehend
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: alleinerziehend !== YesNo.YES ? `Das Ergebnis der Berechnung für ${elternteilName} hat sich verändert, da Sie Angaben im Formular geändert haben.` : "Das Ergebnis der Berechnung hat sich verändert, da Sie Angaben im Formular geändert haben." });
}
function NotificationMaxElterngeld() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Von Ihrem Netto Einkommen werden höchstens 2770 Euro für die Festlegung des Elterngelds berücksichtigt. In den Lebensmonaten, in denen Sie kein Einkommen haben, bekommen Sie den Elterngeld-Höchstbetrag von 1800 Euro (ohne Geschwisterbonus). In den Lebensmonaten, in denen Sie Einkommen haben, wird Ihr Elterngeld berechnet aus dem Unterschied zwischen 2770 Euro und Ihrem Einkommen nach der Geburt." });
}
function FootNote({ id, number, prefix, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id, className: nsp("foot-note"), children: [
    !!number && /* @__PURE__ */ jsxRuntimeExports.jsx(
      FootNoteNumber,
      {
        type: "note",
        number,
        prefix,
        className: nsp("foot-note__number")
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: nsp("foot-note__note"), children })
  ] });
}
function RechnerForm({
  elternteilName,
  elternteil,
  initialValues,
  onSubmit,
  isResultPending,
  previousFormStepsChanged
}) {
  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    register,
    formState: { errors }
  } = useForm({
    defaultValues: initialValues
  });
  const dispatch = useAppDispatch();
  const name = `${elternteil}.bruttoEinkommenZeitraum`;
  const keinEinkommenName = `${elternteil}.keinEinkommen`;
  const { fields, append, remove } = useFieldArray({
    name,
    control
  });
  const monthsAfterBirthOptions = () => {
    const months = [];
    for (let i = 0; i < EgrConst.lebensMonateMaxNumber; i++) {
      const month = `${i + 1}`;
      months.push({
        label: month,
        value: month
      });
    }
    return months;
  };
  const [addButtonDisabled, setAddButtonDisabled] = reactExports.useState(() => false);
  const [monthsAfterBirthList, setMonthsAfterBirthList] = reactExports.useState(
    new Array(fields.length).fill({
      from: monthsAfterBirthOptions(),
      to: monthsAfterBirthOptions()
    })
  );
  const availableMonthsAfterBirth = (lastZeitraumValue) => availableZeitraumOptions(
    monthsAfterBirthList.map((v, index) => getValues(`${name}.${index}.zeitraum`)).map((v) => {
      return { from: v.from, to: v.to };
    }),
    {
      from: monthsAfterBirthOptions(),
      to: monthsAfterBirthOptions()
    },
    "Integer",
    lastZeitraumValue
  );
  const onChangeKeinEinkommen = (keinEinkommen) => {
    if (keinEinkommen) {
      setValue(name, []);
    } else if (getValues(name).length < 1) {
      setValue(name, [initialBruttoEinkommenZeitraum]);
      setMonthsAfterBirthList(() => [
        {
          from: monthsAfterBirthOptions(),
          to: monthsAfterBirthOptions()
        }
      ]);
    }
  };
  const appendEinkommen = () => {
    const availableMonths = availableMonthsAfterBirth();
    setMonthsAfterBirthList((prevState) => [...prevState, availableMonths]);
    append(initialBruttoEinkommenZeitraum);
    setValue(keinEinkommenName, false);
    const availableMonthsSize = availableMonths.from.filter(
      (availableMonth) => !availableMonth.hidden
    ).length;
    setAddButtonDisabled(availableMonthsSize === 1);
  };
  const removeEinkommen = (index) => {
    setMonthsAfterBirthList(
      (monthsAfterBirthList2) => monthsAfterBirthList2.filter((month, indexMonth) => indexMonth !== index)
    );
    remove(index);
    if (getValues(name).length < 1) {
      setValue(keinEinkommenName, true);
    }
    setAddButtonDisabled(false);
  };
  const onChangeZeitraum = (zeitraumIndex, zeitraumValue) => {
    const restFrom = availableMonthsAfterBirth(zeitraumValue).from.filter(
      (value) => !value.hidden
    );
    setAddButtonDisabled(restFrom.length === 0);
  };
  const optionsKeinEinkommen = reactExports.useMemo(
    () => ({
      validate: {
        requireKeinEinkommenOrEinkommen: (keinEinkommen) => {
          const einkommenList = getValues(name);
          if (keinEinkommen) {
            return true;
          }
          if (einkommenList.length > 0) {
            return true;
          }
          return 'Bitte geben Sie ihr Einkommen während des Elterngeldbezugs an oder wählen sie "kein Einkommen beziehen"';
        }
      }
    }),
    [getValues, name]
  );
  const errorKeinEinkommen = get(
    errors,
    keinEinkommenName
  );
  reactExports.useEffect(() => {
    if (previousFormStepsChanged) {
      dispatch(
        stepRechnerActions.resetHasBEGResultChangedDueToPrevFormSteps({
          elternteil
        })
      );
    }
  }, [previousFormStepsChanged, dispatch, elternteil]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "form",
    {
      onSubmit: handleSubmit(onSubmit),
      className: nsp("rechner-form"),
      noValidate: true,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(FormFieldGroup, { headline: elternteilName, "data-testid": "egr-rechner-form", children: [
        !!errorKeinEinkommen && /* @__PURE__ */ jsxRuntimeExports.jsx(Description, { id: `${keinEinkommenName}-error`, error: true, children: errorKeinEinkommen.message }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          CustomCheckbox,
          {
            register,
            name: keinEinkommenName,
            label: "Ich werde während des gesamten Elterngeldbezugs kein Einkommen beziehen",
            onChange: onChangeKeinEinkommen,
            registerOptions: optionsKeinEinkommen,
            "aria-invalid": !!errorKeinEinkommen
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "oder" }),
        fields.map((field, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "section",
          {
            "aria-label": `${index + 1}. Einkommen`,
            className: nsp("rechner-form__zeitraum-section"),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                CustomNumberField,
                {
                  className: nsp("rechner-form__einkommen"),
                  control,
                  name: `${name}.${index}.bruttoEinkommen`,
                  label: "Ihr monatliches Bruttoeinkommen oder durchschnittlicher monatlicher Gewinn während des Bezugs von Elterngeld",
                  suffix: "Euro",
                  stretch: true,
                  required: true,
                  ariaDescribedByIfNoError: `${name}.${index}.zeitraum`
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Zeitraum,
                {
                  disabled: index + 1 !== fields.length,
                  className: nsp("rechner-form__zeitraum"),
                  register,
                  setValue,
                  getValues,
                  name: `${name}.${index}.zeitraum`,
                  suffix: "Lebensmonat",
                  options: monthsAfterBirthList[index].from,
                  optionsTo: monthsAfterBirthList[index].to,
                  onChange: (zeitraum) => onChangeZeitraum(index, zeitraum),
                  type: "Integer",
                  errors,
                  required: true
                },
                field.id
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: nsp("rechner-form__remove-action"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  buttonStyle: "link",
                  label: "Einkommen entfernen",
                  iconAfter: /* @__PURE__ */ jsxRuntimeExports.jsx(_default, {}),
                  onClick: () => {
                    removeEinkommen(index);
                  }
                }
              ) })
            ]
          },
          field.id
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: nsp("rechner-form__actions"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: nsp("rechner-form__add-action"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              buttonStyle: "secondary",
              onClick: () => appendEinkommen(),
              label: "Einkommen hinzufügen",
              disabled: addButtonDisabled
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              buttonStyle: "primary",
              disabled: isResultPending,
              label: "Elterngeld berechnen",
              isSubmitButton: true
            }
          )
        ] })
      ] })
    }
  );
}
const getRechnerResultTableRows = (pickAmountElterngeld, rows) => {
  return rows.filter((row) => row.elternGeldPlus !== 0 || row.basisElternGeld !== 0).map((row) => {
    const amountElterngeld = pickAmountElterngeld(row);
    return {
      vonLebensMonat: row.vonLebensMonat,
      bisLebensMonat: row.bisLebensMonat,
      amountElterngeld,
      amountTotal: amountElterngeld + row.nettoEinkommen
    };
  });
};
function RechnerResult({ elternteil }) {
  const result = useAppSelector(
    (state) => state.stepRechner[elternteil].elterngeldResult
  );
  const [notificationMessages, setNotificationMessages] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (result.state === "success") {
      result.data.every((value) => {
        if (value.basisElternGeld >= 1800 || value.nettoEinkommen >= 2770) {
          setNotificationMessages([
            /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationMaxElterngeld, {}, value.vonLebensMonat)
          ]);
          return false;
        }
        return true;
      });
    } else {
      setNotificationMessages(null);
    }
  }, [result]);
  if (result.state === "init") {
    return null;
  }
  if (result.state === "pending") {
    return null;
  }
  if (result.state === "error") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: nsp("rechner-result-error"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(_default$1, {}),
      " Das Elterngeld konnte nicht berechnet werden."
    ] });
  }
  const begTableRows = getRechnerResultTableRows(
    (row) => row.basisElternGeld,
    result.data
  );
  const egplusTableRows = getRechnerResultTableRows(
    (row) => row.elternGeldPlus,
    result.data
  );
  const psbTableRows = getRechnerResultTableRows(
    (row) => row.elternGeldPlus,
    result.data
  );
  const isAnyBEGMonthOver14Months = begTableRows.some(
    (row) => row.vonLebensMonat > 14 || row.bisLebensMonat > 14
  );
  const onUnMountToast = () => {
    setNotificationMessages(null);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      className: nsp("rechner-result"),
      "aria-label": "Elterngeld berechnen Ergebnis",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          RechnerResultTable,
          {
            className: nsp("rechner-result__basiselterngeld"),
            rows: begTableRows,
            elterngeldType: "Basis",
            elternteil,
            titleTotal: "Basis + Netto-Einkommen",
            markOver14Month: isAnyBEGMonthOver14Months
          }
        ),
        !!isAnyBEGMonthOver14Months && /* @__PURE__ */ jsxRuntimeExports.jsx(FootNote, { number: 1, prefix: "rechner", children: "*Basiselterngeld können Sie nur bis zum 14. Lebensmonat beantragen" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          RechnerResultTable,
          {
            className: nsp("rechner-result__elterngeldplus"),
            rows: egplusTableRows,
            elterngeldType: "Plus",
            elternteil,
            titleTotal: "Plus + Netto-Einkommen",
            hideLebensmonate: true
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          RechnerResultTable,
          {
            className: nsp("rechner-result__elterngeldbonus"),
            rows: psbTableRows,
            elterngeldType: "Bonus",
            elternteil,
            titleTotal: "Bonus + Netto-Einkommen",
            hideLebensmonate: true
          }
        ),
        !!notificationMessages && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Toast,
          {
            messages: notificationMessages,
            active: !!notificationMessages,
            onUnMount: onUnMountToast,
            timeout: 12e3
          }
        )
      ]
    }
  );
}
function Rechner() {
  const dispatch = useAppDispatch();
  const initialValues = useAppSelector((state) => state.stepRechner);
  const [notificationMessages, setNotificationMessages] = reactExports.useState(null);
  const hasElternteil1BEGResultChangedDueToPrevFormSteps = useAppSelector(
    (state) => state.stepRechner.ET1.hasBEGResultChangedDueToPrevFormSteps
  );
  const hasElternteil2BEGResultChangedDueToPrevFormSteps = useAppSelector(
    (state) => state.stepRechner.ET2.hasBEGResultChangedDueToPrevFormSteps
  );
  const elternteilNames = useAppSelector(
    stepAllgemeineAngabenSelectors.getElternteilNames
  );
  const antragstellende = useAppSelector(
    stepAllgemeineAngabenSelectors.getAntragssteller
  );
  const alleinerziehend = useAppSelector(
    stepAllgemeineAngabenSelectors.getAlleinerziehend
  );
  const elterngeldResultStateElternteil1 = useAppSelector(
    (state) => state.stepRechner.ET1.elterngeldResult.state
  );
  const elterngeldResultStateElternteil2 = useAppSelector(
    (state) => state.stepRechner.ET2.elterngeldResult.state
  );
  const handleSubmitElternteil1 = ({ ET1 }) => {
    dispatch(
      stepRechnerActions.calculateBEG({
        elternteil: "ET1",
        bruttoEinkommenZeitraum: ET1.bruttoEinkommenZeitraum
      })
    );
  };
  const handleSubmitElternteil2 = ({ ET2 }) => {
    dispatch(
      stepRechnerActions.calculateBEG({
        elternteil: "ET2",
        bruttoEinkommenZeitraum: ET2.bruttoEinkommenZeitraum
      })
    );
  };
  reactExports.useEffect(() => {
    if (hasElternteil1BEGResultChangedDueToPrevFormSteps) {
      handleSubmitElternteil1(initialValues);
    }
    if (hasElternteil2BEGResultChangedDueToPrevFormSteps) {
      handleSubmitElternteil2(initialValues);
    }
  }, []);
  reactExports.useEffect(() => {
    const name = [];
    if (hasElternteil1BEGResultChangedDueToPrevFormSteps) {
      name.push(elternteilNames.ET1);
    }
    if (hasElternteil2BEGResultChangedDueToPrevFormSteps) {
      name.push(elternteilNames.ET2);
    }
    if (name.length > 0) {
      setNotificationMessages([
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          NotificationBEGResultWasRecalculated,
          {
            elternteilName: name.join(" und "),
            alleinerziehend
          },
          "beg-result-was-recalculated"
        )
      ]);
    }
  }, [
    hasElternteil1BEGResultChangedDueToPrevFormSteps,
    hasElternteil2BEGResultChangedDueToPrevFormSteps,
    elternteilNames,
    alleinerziehend
  ]);
  const onUnMountToast = () => {
    setNotificationMessages(null);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: nsp("rechner"), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(FootNote, { prefix: "rechner", children: "Elterngeld wird monatsweise gezahlt – allerdings nicht nach Kalendermonaten, sondern nach den Lebensmonaten Ihres Kindes. Diese beginnen nicht am Ersten des Kalendermonats, sondern je nach Geburtstag Ihres Kindes. Wenn Ihr Kind am 14. Februar geboren ist, dann ist der 1. Lebensmonat vom 14. Februar bis zum 13. März, der 2. Lebensmonat vom 14. März bis zum 13. April und so weiter." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: nsp("rechner__description"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold", children: "Hier können Sie beispielhaft berechnen, wie viel Elterngeld Sie in welcher Phase Ihrer Elternzeit erwarten können. Bitte beachten Sie, dass das hier berechnete Ergebnis nur eine Orientierung für Sie sein kann. Das Ergebnis ist daher nicht bindend." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Die Höhe des Elterngelds hängt von 3 Faktoren ab:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "der Höhe Ihres monatlichen Bruttoeinkommens vor der Geburt," }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "der von Ihnen gewählten Variante des Elterngelds" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "und der Höhe des monatlichen Bruttoeinkommens während des Bezugs von Elterngeld" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Im Folgenden können Sie unter Berücksichtigung dieser Faktoren berechnen und probieren, was am besten zu Ihren Vorstellungen für die Zeit nach der Geburt passt." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      RechnerForm,
      {
        elternteilName: alleinerziehend === YesNo.YES ? "Elterngeld-Anspruch" : elternteilNames.ET1,
        elternteil: "ET1",
        initialValues,
        isResultPending: elterngeldResultStateElternteil1 === "pending",
        onSubmit: handleSubmitElternteil1,
        previousFormStepsChanged: hasElternteil1BEGResultChangedDueToPrevFormSteps
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(RechnerResult, { elternteil: "ET1" }),
    antragstellende === "FuerBeide" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        RechnerForm,
        {
          elternteilName: alleinerziehend === YesNo.YES ? "Elterngeld-Anspruch" : elternteilNames.ET2,
          elternteil: "ET2",
          initialValues,
          isResultPending: elterngeldResultStateElternteil2 === "pending",
          onSubmit: handleSubmitElternteil2,
          previousFormStepsChanged: hasElternteil2BEGResultChangedDueToPrevFormSteps
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(RechnerResult, { elternteil: "ET2" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Toast,
      {
        messages: notificationMessages,
        active: !!notificationMessages,
        onUnMount: onUnMountToast,
        timeout: 1e4
      }
    )
  ] });
}
function ModalPupup({ text, buttonLabel, onClick }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: nsp("modal-popup"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: nsp("modal-popup__info"), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: text }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        className: nsp("modal-popup__btn"),
        onClick,
        label: buttonLabel,
        buttonStyle: "primary"
      }
    )
  ] }) });
}
function RechnerPlanerPage() {
  const nachwuchs = useAppSelector((state) => state.stepNachwuchs);
  const allgemein = useAppSelector((state) => state.stepAllgemeineAngaben);
  const isLimitEinkommenUeberschritten = useAppSelector(
    (state) => state.stepEinkommen.limitEinkommenUeberschritten === YesNo.YES ? true : null
  );
  const mutterSchutzMonate = numberOfMutterschutzMonths(
    nachwuchs.anzahlKuenftigerKinder,
    allgemein.mutterschaftssleistungen
  );
  const [showModalPopup, setShowModalPopup] = reactExports.useState(
    isLimitEinkommenUeberschritten
  );
  const alleinerziehend = useAppSelector(
    stepAllgemeineAngabenSelectors.getAlleinerziehend
  );
  const amountLimitEinkommen = alleinerziehend === YesNo.YES ? EgrBerechnungParamId.MAX_EINKOMMEN_ALLEIN : EgrBerechnungParamId.MAX_EINKOMMEN_BEIDE;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Page, { step: formSteps.rechnerUndPlaner, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mb-10", children: "Rechner und Planer" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Rechner, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Monatsplaner, { mutterSchutzMonate }),
    !!showModalPopup && // TODO: fix text after check with ministry
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ModalPupup,
      {
        text: `Wenn Sie besonders viel Einkommen haben, können Sie kein Elterngeld bekommen. Falls noch nicht feststeht, ob Sie die Grenze von ${amountLimitEinkommen.toLocaleString()} Euro überschreiten, können Sie trotzdem einen Antrag stellen.`,
        buttonLabel: "Dialog schließen",
        onClick: () => {
          setShowModalPopup(false);
        }
      }
    )
  ] });
}
export {
  RechnerPlanerPage as default
};
