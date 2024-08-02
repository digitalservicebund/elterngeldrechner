import { j as jsxRuntimeExports, c as classNames, n as nsp, r as reactExports, v as useDetectClickOutside_1, q as _default$3, w as _default$4, R as ReactDOM, x as getGeburtstagSettings, y as getFruehchen, z as countFilledMonths, A as countBEGMonths, C as countEGPlusMonths, F as minNumberOfElterngeld, G as lastIndexOfType, H as hasContinuousMonthsOfType, e as setTrackingVariable, I as React, J as getDefaultExportFromCjs, Y as YesNo, B as Button, K as Big, L as getAutomaticallySelectedPSBMonthIndex, M as commonjsGlobal, S as SteuerKlasse, N as KinderFreiBetrag, O as KassenArt, Q as RentenArt, b as useAppSelector, T as stepErwerbstaetigkeitElternteilSelectors, U as initialTaetigkeit, k as stepAllgemeineAngabenSelectors, V as formatAsCurrency, W as createAppSelector, u as useAppDispatch, a as useNavigate, X as stepRechnerSelectors, Z as stepNachwuchsSelectors, $ as monatsplanerSelectors, g as _default$5, a0 as _default$6, f as formSteps, a1 as monatsplanerActions, a2 as canNotChangeBEGDueToSimultaneousMonthRules, a3 as canNotChangeBEGDueToLimitReachedPerParent, a4 as canNotChangeEGPDueToLimitReachedPerParent, a5 as reachedLimitOfSimultaneousBEGMonths, a6 as isExceptionToSimulatenousMonthRestrictions } from "./index-B7cZhPzB.js";
import { E as EgrConst } from "./egr-configuration-Cwpx2zXF.js";
function Description({ id, error = false, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: classNames(nsp("info-text"), error && nsp("info-text--error")),
      id,
      children
    }
  );
}
function FootNoteNumber({ type, number, prefix, className }) {
  const formatted_prefix = prefix ? `${prefix}-` : "";
  const id = `footnote_${formatted_prefix}${number}_${Date.now()}`;
  const allClassNames = classNames(nsp("foot-note-number"), className);
  switch (type) {
    case "note":
      return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { id, className: allClassNames, children: number });
    case "anchor":
      return /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `#${id}`, className: allClassNames, children: number });
    default:
      throw new Error("Unknown FootNoteType: " + type);
  }
}
function InfoDialog({
  info,
  isLarge,
  isMonatsplanner,
  isElternteilOne
}) {
  const [isModalOpen, setIsModalOpen] = reactExports.useState(false);
  const ref = useDetectClickOutside_1({
    onTriggered: () => setIsModalOpen(false)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: classNames(
        nsp("info-dialog"),
        isLarge && nsp("info-dialog--large"),
        isMonatsplanner && nsp("info-dialog--monatsplanner")
      ),
      ref,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: classNames(
              nsp("info-dialog__button"),
              isMonatsplanner && nsp("info-dialog__button--monatsplanner")
            ),
            type: "button",
            onClick: () => setIsModalOpen(true),
            "aria-label": "Zugehörige Information zeigen",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(_default$3, {})
          }
        ),
        !!isModalOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: classNames(
              nsp("info-dialog-box"),
              isElternteilOne && nsp("info-dialog-box--monatsplanner-et-one")
            ),
            role: "dialog",
            "aria-describedby": info.id,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  className: nsp("info-dialog-box__button"),
                  type: "button",
                  onClick: () => setIsModalOpen(false),
                  "aria-label": "Information schließen",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(_default$4, {})
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: info.id, className: nsp("info-dialog-box__text"), children: typeof info.text === "string" ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "whitespace-pre-line", children: info.text }) : info.text })
            ]
          }
        )
      ]
    }
  );
}
const infoTexts = {
  erwerbstaetigkeitNichtSelbststaendig: {
    id: "info-1",
    text: "z.B. Lohn, Gehalt (auch aus einem Minijob)"
  },
  erwerbstaetigkeitGewinneinkuenfte: {
    id: "info-2",
    text: "Einkünfte aus einem Gewerbebetrieb (auch z.B. aus dem Betrieb einer Fotovoltaik-Anlage), Einkünfte aus selbständiger Arbeit (auch z.B. aus einem Nebenberuf), Einkünfte aus Land- und Forstwirtschaft"
  },
  erwerbstaetigkeitNichtSelbststaendigGewinneinkuenfte: {
    id: "info-2",
    text: "Einkünfte aus nichtselbständiger Arbeit: z.B. Lohn Gehalt (auch aus einem Minijob) oder Gewinneinkünfte: Einkünfte aus einem Gewerbebetrieb (auch z.B. aus dem Betrieb einer Fotovoltaik-Anlage), Einkünfte aus selbständiger Arbeit (auch z.B. aus einem Nebenberuf), Einkünfte aus Land- und Forstwirtschaft"
  },
  einkommenNichtSelbststaendig: {
    id: "info-3",
    text: "Als Einkommen werden alle Einkünfte aus Ihrer nicht-selbständigen Tätigkeit im Bemessungszeitraum berücksichtigt. Nicht berücksichtigt werden sonstige Bezüge, z.B. Abfindungen, Leistungsprämien, Provisionen, 13. Monatsgehälter. Steuerfreie Einnahmen werden ebenfalls nicht berücksichtigt, z.B. Trinkgelder, steuerfreie Zuschläge, Krankengeld, Kurzarbeitergeld, ALG II"
  },
  einkommenGewinneinkuenfte: {
    id: "info-4",
    text: "Dies ergibt sich aus Ihrem letzten oder vorletzten Steuerbescheid oder Sie können schätzen"
  },
  einkommenSteuerklasse: {
    id: "info-5",
    text: "Das Faktorverfahren in der Steuerklassenkombination IV/IV wird in der vorliegenden Berechnung nicht berücksichtigt. Der Standardwert 1,0 ist festgelegt. Sollte Ihr Faktor kleiner als 1,0 sein, wirkt sich dies entsprechend auf die Höhe des Elterngeldes aus. Sie erhalten dann mehr Elterngeld (im unteren zweistelligen Bereich)"
  },
  minijobsMaxZahl: {
    id: "info-6",
    text: `Mini-Job - geringfügige Beschäftigung bis maximal 538 Euro monatlich
- vor dem 01.01.2024: bis maximal 520 Euro monatlich
- vor dem 01.10.2022: bis maximal 450 Euro monatlich`
  },
  monatsplannerMutterschaftsleistungen: {
    id: "info-10",
    text: "In den ersten zwei oder drei Lebensmonaten bekommt die leibliche Mutter meistens Mutterschaftsleistungen. Dann gelten diese Monate bei ihr automatisch als Monate mit Basiselterngeld"
  },
  kindGeburtsdatum: {
    id: "info-11",
    text: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Wenn Ihr Kind zu früh zur Welt kommt, können Sie länger Elterngeld bekommen. Dabei kommt es auf den errechneten Geburtstermin an:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "mindestens 6 Wochen zu früh:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "ml-0", children: "1 zusätzlicher Monat Basiselterngeld" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "mindestens 8 Wochen zu früh:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "ml-0", children: "2 zusätzliche Monate Basiselterngeld" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "mindestens 12 Wochen zu früh:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "ml-0", children: "3 zusätzliche Monate Basiselterngeld" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "mindestens 16 Wochen zu früh:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "ml-0", children: "4 zusätzliche Monate Basiselterngeld" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Wie sonst auch, können Sie jeden dieser Monate mit Basiselterngeld tauschen in jeweils 2 Monate mit ElterngeldPlus." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Für die vorliegende Berechnung werden diese zusätzlichen Monate nicht berücksichtigt." })
    ] })
  },
  alleinerziehend: {
    id: "info-12",
    text: "Als alleinerziehend gelten Sie, wenn der andere Elternteil weder mit Ihnen noch mit dem Kind zusammen wohnt und Sie steuerrechtlich als alleinerziehend gelten."
  },
  einkommenLimitÜberschritten: {
    id: "info-13",
    text: "Wenn Sie besonders viel Einkommen haben, können Sie kein Elterngeld bekommen. Elterngeld ist ausgeschlossen ab einem zu versteuernden Jahreseinkommen von mehr als 200.000 Euro bei Alleinerziehenden, Paaren und getrennt Erziehenden. Diese Angabe finden Sie beispielsweise auf Ihrem Steuerbescheid. Wenn Sie Ihr Kind alleine erziehen, geben Sie nur Ihr eigenes Einkommen an. Als Paar oder getrennt erziehende Eltern rechnen Sie das Einkommen beider Elternteile zusammen."
  },
  mutterschaftsleistungen: {
    id: "info-14",
    text: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Während des Mutterschutzes erhalten Sie Mutterschaftsleistungen, zum Beispiel:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "list-disc pl-24", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "das Mutterschaftsgeld der gesetzlichen Krankenkassen" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "der Arbeitgeber-Zuschuss zum Mutterschaftsgeld" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "die Bezüge für Beamtinnen während des Mutterschutzes" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Diese werden – wenn ein Anspruch darauf besteht – normalerweise in den ersten acht Wochen nach der Geburt gezahlt." })
    ] })
  }
};
function MonatsplanerMonth({
  isSelected,
  isMutterschutzMonth,
  isElternteilOne,
  isHighlighted,
  label,
  elterngeldType,
  onToggle,
  onDragOver,
  onMouseOver,
  onMouseLeave,
  children
}) {
  const handleMouseDown = () => {
    onToggle();
  };
  const handleClick = (e) => {
    e.preventDefault();
  };
  const handleMouseOver = (e) => {
    if (e.buttons !== 0) {
      onDragOver();
    }
    onMouseOver && onMouseOver();
  };
  function onFocus() {
    onMouseOver && onMouseOver();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: classNames(
        nsp("monatsplaner-month"),
        isSelected && nsp("monatsplaner-month--selected"),
        isHighlighted && nsp("monatsplaner-month--highlighted"),
        elterngeldType === "BEG" && nsp("monatsplaner-month--beg"),
        elterngeldType === "EG+" && nsp("monatsplaner-month--egplus"),
        elterngeldType === "PSB" && nsp("monatsplaner-month--psb")
      ),
      "data-testid": label,
      children: isMutterschutzMonth ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        InfoDialog,
        {
          isMonatsplanner: true,
          isElternteilOne,
          info: infoTexts.monatsplannerMutterschaftsleistungen
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          "aria-label": label,
          onMouseDown: handleMouseDown,
          onClick: handleClick,
          onMouseOver: handleMouseOver,
          onFocus,
          onBlur: onMouseLeave,
          onMouseLeave,
          children
        }
      ) })
    }
  );
}
function NotificationBEGHintMinMax() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Jeder Elternteil muss mindestens 2 und darf maximal 12 Monate Elterngeld beantragen." });
}
function NotificationBEGHintMin() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Sie müssen mindestens zwei Monate Elterngeld beantragen." });
}
const getTargetTypeName = (targetType) => {
  if (targetType === "BEG") {
    return "Basiselterngeld";
  }
  if (targetType === "BEGAndEG+") {
    return "Basiselterngeld- und ElterngeldPlus";
  }
};
function NotificationNoFurtherMonthAvailable({ targetType }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    "Ihre verfügbaren ",
    getTargetTypeName(targetType),
    "-Monate sind aufgebraucht."
  ] });
}
function NotificationPSBAutomaticallySelection({ label }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: `Auch Monat ${label} wurde automatisch ausgewählt, weil Sie Partnerschaftsbonus mindestens 2 Monate nehmen müssen.` });
}
function NotificationPSBNotDeselectable() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Dieser Monat kann nicht abgewählt werden. Der Partnerschaftsbonus muss am Stück genommen werden." });
}
function NotificationPSBChangeOtherElternteil() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Der Partnerschaftsbonus ändert sich immer auch beim anderen Elternteil." });
}
function NotificationValidationMonatsplaner({ errorCodes }) {
  const messages = errorCodes.map((code) => {
    switch (code) {
      case "HasNoSelection":
        return "Mindestens ein Elternteil muss Elterngeld beantragen.";
      case "HasTakenMoreThanTheAvailableBEGMonths":
        return "Reduzieren Sie auf die verfügbare Anzahl von Basiselterngeld-Monaten.";
      case "DoesNotHaveTheMinimumAmountOfEGMonthsOrNoneAtAll":
        return "Nur 1 Monat Elterngeld für ein Elternteil ist nicht zulässig.";
      case "DoesNotHaveContinuousEGAfterBEGAnspruch":
        return "Elterngeld muss ab dem 15. Monat durchgängig genommen werden.";
      case "HasTakenBEGAfterBEGAnspruch":
        return "Basiselterngeld kann nicht nach dem 15. Monat genommen werden";
      default:
        return "";
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: messages.map((message) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: message }, message)) });
}
function NotificationBEGMax() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Ein Elternteil darf maximal 12 Monate Basiselterngeld beantragen." });
}
function ToastContent({ messages, active }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `${nsp("toast")} ${active ? nsp("toast--active") : ""}`, children: messages !== null && messages.map((message, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Fragment, { children: message }, index)) });
}
const Toast = ({ messages, active, onUnMount, timeout }) => {
  reactExports.useEffect(() => {
    let timerId;
    if (messages !== null && messages.length > 0) {
      timerId = setTimeout(() => {
        onUnMount();
      }, timeout);
    }
    return () => clearTimeout(timerId);
  }, [messages, onUnMount, timeout]);
  return ReactDOM.createPortal(
    /* @__PURE__ */ jsxRuntimeExports.jsx(ToastContent, { messages, active }),
    document.getElementById("egr-toast")
  );
};
const validResult$1 = {
  isValid: true
};
const allOf = (...validationResults) => {
  return validationResults.reduce((previousResult, current) => {
    if (current.isValid) {
      return previousResult;
    }
    const previousErrorCodes = previousResult.isValid ? [] : previousResult.errorCodes;
    return {
      isValid: false,
      errorCodes: [...previousErrorCodes, ...current.errorCodes]
    };
  }, validResult$1);
};
function validationRule(errorCode, predicate) {
  return (target, arg) => {
    if (predicate(target, arg)) {
      return validResult$1;
    } else {
      return {
        isValid: false,
        errorCodes: [errorCode]
      };
    }
  };
}
const hasAnySelection = validationRule(
  "HasNoSelection",
  (elternteile) => {
    return countFilledMonths(elternteile.ET1.months) > 0 || countFilledMonths(elternteile.ET2.months) > 0;
  }
);
const hasNotTakenMoreThanTheAvailableBEGMonths = validationRule(
  "HasTakenMoreThanTheAvailableBEGMonths",
  (elternteile) => {
    return elternteile.remainingMonths.basiselterngeld >= 0;
  }
);
const hasAtLeast2EGMonthsOrNoneAtAll = validationRule(
  "DoesNotHaveTheMinimumAmountOfEGMonthsOrNoneAtAll",
  (elternteile) => {
    const begMonthsET1 = countBEGMonths(elternteile.ET1.months);
    const begMonthsET2 = countBEGMonths(elternteile.ET2.months);
    const egPlusMonthsET1 = countEGPlusMonths(elternteile.ET1.months);
    const egPlusMonthsET2 = countEGPlusMonths(elternteile.ET2.months);
    const egMonthsET1 = begMonthsET1 + egPlusMonthsET1;
    const egMonthsET2 = begMonthsET2 + egPlusMonthsET2;
    return (egMonthsET1 === 0 || egMonthsET1 >= minNumberOfElterngeld) && (egMonthsET2 === 0 || egMonthsET2 >= minNumberOfElterngeld);
  }
);
const hasContinuousEGAfterBEGAnspruch = validationRule(
  "DoesNotHaveContinuousEGAfterBEGAnspruch",
  (elternteile, lastMonthBEGAnspruch) => {
    const monthOfBoth = elternteile.ET1.months.map(
      (et1Month, index) => {
        if (et1Month.type === "None") {
          return elternteile.ET2.months[index];
        }
        return et1Month;
      }
    );
    const lastIndexOfEGOfBoth = lastIndexOfType(monthOfBoth, "EG+", "PSB");
    return lastIndexOfEGOfBoth <= lastMonthBEGAnspruch || hasContinuousMonthsOfType(monthOfBoth, lastMonthBEGAnspruch, "EG+", "PSB");
  }
);
const hasNotTakenBEGAfterBEGAnspruch = validationRule(
  "HasTakenBEGAfterBEGAnspruch",
  (elternteile, lastMonthBEGAnspruch) => {
    return lastIndexOfType(elternteile.ET1.months, "BEG") < lastMonthBEGAnspruch && lastIndexOfType(elternteile.ET2.months, "BEG") < lastMonthBEGAnspruch;
  }
);
const getLastMonthOfBEGAnspruch = (geburtstag) => {
  if (geburtstag) {
    switch (getFruehchen(geburtstag)) {
      case "16Weeks":
        return 18;
      case "12Weeks":
        return 17;
      case "8Weeks":
        return 16;
      case "6Weeks":
        return 15;
      case "NotAFruehchen":
        return 14;
    }
  }
  return 14;
};
const validateElternteile = (elternteile, settings) => {
  const lastMonthOfBEGAnspruch = getLastMonthOfBEGAnspruch(
    getGeburtstagSettings(settings)
  );
  return allOf(
    hasAnySelection(elternteile),
    hasNotTakenMoreThanTheAvailableBEGMonths(elternteile),
    hasAtLeast2EGMonthsOrNoneAtAll(elternteile),
    hasContinuousEGAfterBEGAnspruch(elternteile, lastMonthOfBEGAnspruch),
    hasNotTakenBEGAfterBEGAnspruch(elternteile, lastMonthOfBEGAnspruch)
  );
};
function trackPartnerschaftlicheVerteilung(monthsET1, monthsET2, singleApplicant) {
  if (!singleApplicant) {
    const verteilung = calculatePartnerschaftlichkeiteVerteilung(
      monthsET1,
      monthsET2
    );
    setTrackingVariable(TRACKING_VARIABLE_NAME, verteilung);
  }
}
function calculatePartnerschaftlichkeiteVerteilung(monthsET1, monthsET2) {
  const valueET1 = calculateValueOfElternteil(monthsET1);
  const valueET2 = calculateValueOfElternteil(monthsET2);
  const smallerValue = Math.min(valueET1, valueET2);
  const biggerValue = Math.max(valueET1, valueET2);
  const hasNoPartnerschaftlichkeit = biggerValue === 0;
  const quotient = smallerValue / biggerValue;
  return hasNoPartnerschaftlichkeit ? 0 : quotient;
}
function calculateValueOfElternteil(months) {
  return months.map((type) => ELTERNGELD_TYPE_TO_PARTNERSCHAFTLICHKEITS_VALUE[type]).reduce((sum, value) => sum + value, 0);
}
const ELTERNGELD_TYPE_TO_PARTNERSCHAFTLICHKEITS_VALUE = {
  BEG: 1,
  "EG+": 0.5,
  PSB: 0.5,
  None: 0
};
const TRACKING_VARIABLE_NAME = "partnerschaftlicheverteilung";
var isCheckBoxInput = (element) => element.type === "checkbox";
var isDateObject = (value) => value instanceof Date;
var isNullOrUndefined = (value) => value == null;
const isObjectType = (value) => typeof value === "object";
var isObject$1 = (value) => !isNullOrUndefined(value) && !Array.isArray(value) && isObjectType(value) && !isDateObject(value);
var getEventValue = (event) => isObject$1(event) && event.target ? isCheckBoxInput(event.target) ? event.target.checked : event.target.value : event;
var getNodeParentName = (name) => name.substring(0, name.search(/\.\d+(\.|$)/)) || name;
var isNameInFieldArray = (names, name) => names.has(getNodeParentName(name));
var isPlainObject = (tempObject) => {
  const prototypeCopy = tempObject.constructor && tempObject.constructor.prototype;
  return isObject$1(prototypeCopy) && prototypeCopy.hasOwnProperty("isPrototypeOf");
};
var isWeb = typeof window !== "undefined" && typeof window.HTMLElement !== "undefined" && typeof document !== "undefined";
function cloneObject(data) {
  let copy;
  const isArray = Array.isArray(data);
  if (data instanceof Date) {
    copy = new Date(data);
  } else if (data instanceof Set) {
    copy = new Set(data);
  } else if (!(isWeb && (data instanceof Blob || data instanceof FileList)) && (isArray || isObject$1(data))) {
    copy = isArray ? [] : {};
    if (!isArray && !isPlainObject(data)) {
      copy = data;
    } else {
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          copy[key] = cloneObject(data[key]);
        }
      }
    }
  } else {
    return data;
  }
  return copy;
}
var compact = (value) => Array.isArray(value) ? value.filter(Boolean) : [];
var isUndefined = (val) => val === void 0;
var get = (object, path, defaultValue) => {
  if (!path || !isObject$1(object)) {
    return defaultValue;
  }
  const result = compact(path.split(/[,[\].]+?/)).reduce((result2, key) => isNullOrUndefined(result2) ? result2 : result2[key], object);
  return isUndefined(result) || result === object ? isUndefined(object[path]) ? defaultValue : object[path] : result;
};
var isBoolean = (value) => typeof value === "boolean";
const EVENTS = {
  BLUR: "blur",
  FOCUS_OUT: "focusout",
  CHANGE: "change"
};
const VALIDATION_MODE = {
  onBlur: "onBlur",
  onChange: "onChange",
  onSubmit: "onSubmit",
  onTouched: "onTouched",
  all: "all"
};
const INPUT_VALIDATION_RULES = {
  max: "max",
  min: "min",
  maxLength: "maxLength",
  minLength: "minLength",
  pattern: "pattern",
  required: "required",
  validate: "validate"
};
const HookFormContext = React.createContext(null);
const useFormContext = () => React.useContext(HookFormContext);
const FormProvider = (props) => {
  const { children, ...data } = props;
  return React.createElement(HookFormContext.Provider, { value: data }, children);
};
var getProxyFormState = (formState, control, localProxyFormState, isRoot = true) => {
  const result = {
    defaultValues: control._defaultValues
  };
  for (const key in formState) {
    Object.defineProperty(result, key, {
      get: () => {
        const _key = key;
        if (control._proxyFormState[_key] !== VALIDATION_MODE.all) {
          control._proxyFormState[_key] = !isRoot || VALIDATION_MODE.all;
        }
        localProxyFormState && (localProxyFormState[_key] = true);
        return formState[_key];
      }
    });
  }
  return result;
};
var isEmptyObject = (value) => isObject$1(value) && !Object.keys(value).length;
var shouldRenderFormState = (formStateData, _proxyFormState, updateFormState, isRoot) => {
  updateFormState(formStateData);
  const { name, ...formState } = formStateData;
  return isEmptyObject(formState) || Object.keys(formState).length >= Object.keys(_proxyFormState).length || Object.keys(formState).find((key) => _proxyFormState[key] === (!isRoot || VALIDATION_MODE.all));
};
var convertToArrayPayload = (value) => Array.isArray(value) ? value : [value];
var shouldSubscribeByName = (name, signalName, exact) => !name || !signalName || name === signalName || convertToArrayPayload(name).some((currentName) => currentName && (exact ? currentName === signalName : currentName.startsWith(signalName) || signalName.startsWith(currentName)));
function useSubscribe(props) {
  const _props = React.useRef(props);
  _props.current = props;
  React.useEffect(() => {
    const subscription = !props.disabled && _props.current.subject && _props.current.subject.subscribe({
      next: _props.current.next
    });
    return () => {
      subscription && subscription.unsubscribe();
    };
  }, [props.disabled]);
}
function useFormState(props) {
  const methods = useFormContext();
  const { control = methods.control, disabled, name, exact } = props || {};
  const [formState, updateFormState] = React.useState(control._formState);
  const _mounted = React.useRef(true);
  const _localProxyFormState = React.useRef({
    isDirty: false,
    isLoading: false,
    dirtyFields: false,
    touchedFields: false,
    validatingFields: false,
    isValidating: false,
    isValid: false,
    errors: false
  });
  const _name = React.useRef(name);
  _name.current = name;
  useSubscribe({
    disabled,
    next: (value) => _mounted.current && shouldSubscribeByName(_name.current, value.name, exact) && shouldRenderFormState(value, _localProxyFormState.current, control._updateFormState) && updateFormState({
      ...control._formState,
      ...value
    }),
    subject: control._subjects.state
  });
  React.useEffect(() => {
    _mounted.current = true;
    _localProxyFormState.current.isValid && control._updateValid(true);
    return () => {
      _mounted.current = false;
    };
  }, [control]);
  return getProxyFormState(formState, control, _localProxyFormState.current, false);
}
var isString$1 = (value) => typeof value === "string";
var generateWatchOutput = (names, _names, formValues, isGlobal, defaultValue) => {
  if (isString$1(names)) {
    isGlobal && _names.watch.add(names);
    return get(formValues, names, defaultValue);
  }
  if (Array.isArray(names)) {
    return names.map((fieldName) => (isGlobal && _names.watch.add(fieldName), get(formValues, fieldName)));
  }
  isGlobal && (_names.watchAll = true);
  return formValues;
};
function useWatch(props) {
  const methods = useFormContext();
  const { control = methods.control, name, defaultValue, disabled, exact } = props || {};
  const _name = React.useRef(name);
  _name.current = name;
  useSubscribe({
    disabled,
    subject: control._subjects.values,
    next: (formState) => {
      if (shouldSubscribeByName(_name.current, formState.name, exact)) {
        updateValue(cloneObject(generateWatchOutput(_name.current, control._names, formState.values || control._formValues, false, defaultValue)));
      }
    }
  });
  const [value, updateValue] = React.useState(control._getWatch(name, defaultValue));
  React.useEffect(() => control._removeUnmounted());
  return value;
}
var isKey = (value) => /^\w*$/.test(value);
var stringToPath = (input) => compact(input.replace(/["|']|\]/g, "").split(/\.|\[/));
var set = (object, path, value) => {
  let index = -1;
  const tempPath = isKey(path) ? [path] : stringToPath(path);
  const length = tempPath.length;
  const lastIndex = length - 1;
  while (++index < length) {
    const key = tempPath[index];
    let newValue = value;
    if (index !== lastIndex) {
      const objValue = object[key];
      newValue = isObject$1(objValue) || Array.isArray(objValue) ? objValue : !isNaN(+tempPath[index + 1]) ? [] : {};
    }
    object[key] = newValue;
    object = object[key];
  }
  return object;
};
function useController(props) {
  const methods = useFormContext();
  const { name, disabled, control = methods.control, shouldUnregister } = props;
  const isArrayField = isNameInFieldArray(control._names.array, name);
  const value = useWatch({
    control,
    name,
    defaultValue: get(control._formValues, name, get(control._defaultValues, name, props.defaultValue)),
    exact: true
  });
  const formState = useFormState({
    control,
    name
  });
  const _registerProps = React.useRef(control.register(name, {
    ...props.rules,
    value,
    ...isBoolean(props.disabled) ? { disabled: props.disabled } : {}
  }));
  React.useEffect(() => {
    const _shouldUnregisterField = control._options.shouldUnregister || shouldUnregister;
    const updateMounted = (name2, value2) => {
      const field = get(control._fields, name2);
      if (field) {
        field._f.mount = value2;
      }
    };
    updateMounted(name, true);
    if (_shouldUnregisterField) {
      const value2 = cloneObject(get(control._options.defaultValues, name));
      set(control._defaultValues, name, value2);
      if (isUndefined(get(control._formValues, name))) {
        set(control._formValues, name, value2);
      }
    }
    return () => {
      (isArrayField ? _shouldUnregisterField && !control._state.action : _shouldUnregisterField) ? control.unregister(name) : updateMounted(name, false);
    };
  }, [name, control, isArrayField, shouldUnregister]);
  React.useEffect(() => {
    if (get(control._fields, name)) {
      control._updateDisabledField({
        disabled,
        fields: control._fields,
        name,
        value: get(control._fields, name)._f.value
      });
    }
  }, [disabled, name, control]);
  return {
    field: {
      name,
      value,
      ...isBoolean(disabled) || formState.disabled ? { disabled: formState.disabled || disabled } : {},
      onChange: React.useCallback((event) => _registerProps.current.onChange({
        target: {
          value: getEventValue(event),
          name
        },
        type: EVENTS.CHANGE
      }), [name]),
      onBlur: React.useCallback(() => _registerProps.current.onBlur({
        target: {
          value: get(control._formValues, name),
          name
        },
        type: EVENTS.BLUR
      }), [name, control]),
      ref: (elm) => {
        const field = get(control._fields, name);
        if (field && elm) {
          field._f.ref = {
            focus: () => elm.focus(),
            select: () => elm.select(),
            setCustomValidity: (message) => elm.setCustomValidity(message),
            reportValidity: () => elm.reportValidity()
          };
        }
      }
    },
    formState,
    fieldState: Object.defineProperties({}, {
      invalid: {
        enumerable: true,
        get: () => !!get(formState.errors, name)
      },
      isDirty: {
        enumerable: true,
        get: () => !!get(formState.dirtyFields, name)
      },
      isTouched: {
        enumerable: true,
        get: () => !!get(formState.touchedFields, name)
      },
      isValidating: {
        enumerable: true,
        get: () => !!get(formState.validatingFields, name)
      },
      error: {
        enumerable: true,
        get: () => get(formState.errors, name)
      }
    })
  };
}
var appendErrors = (name, validateAllFieldCriteria, errors, type, message) => validateAllFieldCriteria ? {
  ...errors[name],
  types: {
    ...errors[name] && errors[name].types ? errors[name].types : {},
    [type]: message || true
  }
} : {};
var generateId = () => {
  const d = typeof performance === "undefined" ? Date.now() : performance.now() * 1e3;
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16 + d) % 16 | 0;
    return (c == "x" ? r : r & 3 | 8).toString(16);
  });
};
var getFocusFieldName = (name, index, options = {}) => options.shouldFocus || isUndefined(options.shouldFocus) ? options.focusName || `${name}.${isUndefined(options.focusIndex) ? index : options.focusIndex}.` : "";
var getValidationModes = (mode) => ({
  isOnSubmit: !mode || mode === VALIDATION_MODE.onSubmit,
  isOnBlur: mode === VALIDATION_MODE.onBlur,
  isOnChange: mode === VALIDATION_MODE.onChange,
  isOnAll: mode === VALIDATION_MODE.all,
  isOnTouch: mode === VALIDATION_MODE.onTouched
});
var isWatched = (name, _names, isBlurEvent) => !isBlurEvent && (_names.watchAll || _names.watch.has(name) || [..._names.watch].some((watchName) => name.startsWith(watchName) && /^\.\w+/.test(name.slice(watchName.length))));
const iterateFieldsByAction = (fields, action, fieldsNames, abortEarly) => {
  for (const key of fieldsNames || Object.keys(fields)) {
    const field = get(fields, key);
    if (field) {
      const { _f, ...currentField } = field;
      if (_f) {
        if (_f.refs && _f.refs[0] && action(_f.refs[0], key) && !abortEarly) {
          break;
        } else if (_f.ref && action(_f.ref, _f.name) && !abortEarly) {
          break;
        } else {
          iterateFieldsByAction(currentField, action);
        }
      } else if (isObject$1(currentField)) {
        iterateFieldsByAction(currentField, action);
      }
    }
  }
};
var updateFieldArrayRootError = (errors, error, name) => {
  const fieldArrayErrors = compact(get(errors, name));
  set(fieldArrayErrors, "root", error[name]);
  set(errors, name, fieldArrayErrors);
  return errors;
};
var isFileInput = (element) => element.type === "file";
var isFunction = (value) => typeof value === "function";
var isHTMLElement = (value) => {
  if (!isWeb) {
    return false;
  }
  const owner = value ? value.ownerDocument : 0;
  return value instanceof (owner && owner.defaultView ? owner.defaultView.HTMLElement : HTMLElement);
};
var isMessage = (value) => isString$1(value);
var isRadioInput = (element) => element.type === "radio";
var isRegex = (value) => value instanceof RegExp;
const defaultResult = {
  value: false,
  isValid: false
};
const validResult = { value: true, isValid: true };
var getCheckboxValue = (options) => {
  if (Array.isArray(options)) {
    if (options.length > 1) {
      const values = options.filter((option) => option && option.checked && !option.disabled).map((option) => option.value);
      return { value: values, isValid: !!values.length };
    }
    return options[0].checked && !options[0].disabled ? (
      // @ts-expect-error expected to work in the browser
      options[0].attributes && !isUndefined(options[0].attributes.value) ? isUndefined(options[0].value) || options[0].value === "" ? validResult : { value: options[0].value, isValid: true } : validResult
    ) : defaultResult;
  }
  return defaultResult;
};
const defaultReturn = {
  isValid: false,
  value: null
};
var getRadioValue = (options) => Array.isArray(options) ? options.reduce((previous, option) => option && option.checked && !option.disabled ? {
  isValid: true,
  value: option.value
} : previous, defaultReturn) : defaultReturn;
function getValidateError(result, ref, type = "validate") {
  if (isMessage(result) || Array.isArray(result) && result.every(isMessage) || isBoolean(result) && !result) {
    return {
      type,
      message: isMessage(result) ? result : "",
      ref
    };
  }
}
var getValueAndMessage = (validationData) => isObject$1(validationData) && !isRegex(validationData) ? validationData : {
  value: validationData,
  message: ""
};
var validateField = async (field, formValues, validateAllFieldCriteria, shouldUseNativeValidation, isFieldArray) => {
  const { ref, refs, required, maxLength, minLength, min, max, pattern, validate, name, valueAsNumber, mount, disabled } = field._f;
  const inputValue = get(formValues, name);
  if (!mount || disabled) {
    return {};
  }
  const inputRef = refs ? refs[0] : ref;
  const setCustomValidity = (message) => {
    if (shouldUseNativeValidation && inputRef.reportValidity) {
      inputRef.setCustomValidity(isBoolean(message) ? "" : message || "");
      inputRef.reportValidity();
    }
  };
  const error = {};
  const isRadio = isRadioInput(ref);
  const isCheckBox = isCheckBoxInput(ref);
  const isRadioOrCheckbox2 = isRadio || isCheckBox;
  const isEmpty = (valueAsNumber || isFileInput(ref)) && isUndefined(ref.value) && isUndefined(inputValue) || isHTMLElement(ref) && ref.value === "" || inputValue === "" || Array.isArray(inputValue) && !inputValue.length;
  const appendErrorsCurry = appendErrors.bind(null, name, validateAllFieldCriteria, error);
  const getMinMaxMessage = (exceedMax, maxLengthMessage, minLengthMessage, maxType = INPUT_VALIDATION_RULES.maxLength, minType = INPUT_VALIDATION_RULES.minLength) => {
    const message = exceedMax ? maxLengthMessage : minLengthMessage;
    error[name] = {
      type: exceedMax ? maxType : minType,
      message,
      ref,
      ...appendErrorsCurry(exceedMax ? maxType : minType, message)
    };
  };
  if (isFieldArray ? !Array.isArray(inputValue) || !inputValue.length : required && (!isRadioOrCheckbox2 && (isEmpty || isNullOrUndefined(inputValue)) || isBoolean(inputValue) && !inputValue || isCheckBox && !getCheckboxValue(refs).isValid || isRadio && !getRadioValue(refs).isValid)) {
    const { value, message } = isMessage(required) ? { value: !!required, message: required } : getValueAndMessage(required);
    if (value) {
      error[name] = {
        type: INPUT_VALIDATION_RULES.required,
        message,
        ref: inputRef,
        ...appendErrorsCurry(INPUT_VALIDATION_RULES.required, message)
      };
      if (!validateAllFieldCriteria) {
        setCustomValidity(message);
        return error;
      }
    }
  }
  if (!isEmpty && (!isNullOrUndefined(min) || !isNullOrUndefined(max))) {
    let exceedMax;
    let exceedMin;
    const maxOutput = getValueAndMessage(max);
    const minOutput = getValueAndMessage(min);
    if (!isNullOrUndefined(inputValue) && !isNaN(inputValue)) {
      const valueNumber = ref.valueAsNumber || (inputValue ? +inputValue : inputValue);
      if (!isNullOrUndefined(maxOutput.value)) {
        exceedMax = valueNumber > maxOutput.value;
      }
      if (!isNullOrUndefined(minOutput.value)) {
        exceedMin = valueNumber < minOutput.value;
      }
    } else {
      const valueDate = ref.valueAsDate || new Date(inputValue);
      const convertTimeToDate = (time) => /* @__PURE__ */ new Date((/* @__PURE__ */ new Date()).toDateString() + " " + time);
      const isTime = ref.type == "time";
      const isWeek = ref.type == "week";
      if (isString$1(maxOutput.value) && inputValue) {
        exceedMax = isTime ? convertTimeToDate(inputValue) > convertTimeToDate(maxOutput.value) : isWeek ? inputValue > maxOutput.value : valueDate > new Date(maxOutput.value);
      }
      if (isString$1(minOutput.value) && inputValue) {
        exceedMin = isTime ? convertTimeToDate(inputValue) < convertTimeToDate(minOutput.value) : isWeek ? inputValue < minOutput.value : valueDate < new Date(minOutput.value);
      }
    }
    if (exceedMax || exceedMin) {
      getMinMaxMessage(!!exceedMax, maxOutput.message, minOutput.message, INPUT_VALIDATION_RULES.max, INPUT_VALIDATION_RULES.min);
      if (!validateAllFieldCriteria) {
        setCustomValidity(error[name].message);
        return error;
      }
    }
  }
  if ((maxLength || minLength) && !isEmpty && (isString$1(inputValue) || isFieldArray && Array.isArray(inputValue))) {
    const maxLengthOutput = getValueAndMessage(maxLength);
    const minLengthOutput = getValueAndMessage(minLength);
    const exceedMax = !isNullOrUndefined(maxLengthOutput.value) && inputValue.length > +maxLengthOutput.value;
    const exceedMin = !isNullOrUndefined(minLengthOutput.value) && inputValue.length < +minLengthOutput.value;
    if (exceedMax || exceedMin) {
      getMinMaxMessage(exceedMax, maxLengthOutput.message, minLengthOutput.message);
      if (!validateAllFieldCriteria) {
        setCustomValidity(error[name].message);
        return error;
      }
    }
  }
  if (pattern && !isEmpty && isString$1(inputValue)) {
    const { value: patternValue, message } = getValueAndMessage(pattern);
    if (isRegex(patternValue) && !inputValue.match(patternValue)) {
      error[name] = {
        type: INPUT_VALIDATION_RULES.pattern,
        message,
        ref,
        ...appendErrorsCurry(INPUT_VALIDATION_RULES.pattern, message)
      };
      if (!validateAllFieldCriteria) {
        setCustomValidity(message);
        return error;
      }
    }
  }
  if (validate) {
    if (isFunction(validate)) {
      const result = await validate(inputValue, formValues);
      const validateError = getValidateError(result, inputRef);
      if (validateError) {
        error[name] = {
          ...validateError,
          ...appendErrorsCurry(INPUT_VALIDATION_RULES.validate, validateError.message)
        };
        if (!validateAllFieldCriteria) {
          setCustomValidity(validateError.message);
          return error;
        }
      }
    } else if (isObject$1(validate)) {
      let validationResult = {};
      for (const key in validate) {
        if (!isEmptyObject(validationResult) && !validateAllFieldCriteria) {
          break;
        }
        const validateError = getValidateError(await validate[key](inputValue, formValues), inputRef, key);
        if (validateError) {
          validationResult = {
            ...validateError,
            ...appendErrorsCurry(key, validateError.message)
          };
          setCustomValidity(validateError.message);
          if (validateAllFieldCriteria) {
            error[name] = validationResult;
          }
        }
      }
      if (!isEmptyObject(validationResult)) {
        error[name] = {
          ref: inputRef,
          ...validationResult
        };
        if (!validateAllFieldCriteria) {
          return error;
        }
      }
    }
  }
  setCustomValidity(true);
  return error;
};
var appendAt = (data, value) => [
  ...data,
  ...convertToArrayPayload(value)
];
var fillEmptyArray = (value) => Array.isArray(value) ? value.map(() => void 0) : void 0;
function insert(data, index, value) {
  return [
    ...data.slice(0, index),
    ...convertToArrayPayload(value),
    ...data.slice(index)
  ];
}
var moveArrayAt = (data, from, to) => {
  if (!Array.isArray(data)) {
    return [];
  }
  if (isUndefined(data[to])) {
    data[to] = void 0;
  }
  data.splice(to, 0, data.splice(from, 1)[0]);
  return data;
};
var prependAt = (data, value) => [
  ...convertToArrayPayload(value),
  ...convertToArrayPayload(data)
];
function removeAtIndexes(data, indexes) {
  let i = 0;
  const temp = [...data];
  for (const index of indexes) {
    temp.splice(index - i, 1);
    i++;
  }
  return compact(temp).length ? temp : [];
}
var removeArrayAt = (data, index) => isUndefined(index) ? [] : removeAtIndexes(data, convertToArrayPayload(index).sort((a, b) => a - b));
var swapArrayAt = (data, indexA, indexB) => {
  [data[indexA], data[indexB]] = [data[indexB], data[indexA]];
};
function baseGet(object, updatePath) {
  const length = updatePath.slice(0, -1).length;
  let index = 0;
  while (index < length) {
    object = isUndefined(object) ? index++ : object[updatePath[index++]];
  }
  return object;
}
function isEmptyArray(obj) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && !isUndefined(obj[key])) {
      return false;
    }
  }
  return true;
}
function unset(object, path) {
  const paths = Array.isArray(path) ? path : isKey(path) ? [path] : stringToPath(path);
  const childObject = paths.length === 1 ? object : baseGet(object, paths);
  const index = paths.length - 1;
  const key = paths[index];
  if (childObject) {
    delete childObject[key];
  }
  if (index !== 0 && (isObject$1(childObject) && isEmptyObject(childObject) || Array.isArray(childObject) && isEmptyArray(childObject))) {
    unset(object, paths.slice(0, -1));
  }
  return object;
}
var updateAt = (fieldValues, index, value) => {
  fieldValues[index] = value;
  return fieldValues;
};
function useFieldArray(props) {
  const methods = useFormContext();
  const { control = methods.control, name, keyName = "id", shouldUnregister } = props;
  const [fields, setFields] = React.useState(control._getFieldArray(name));
  const ids = React.useRef(control._getFieldArray(name).map(generateId));
  const _fieldIds = React.useRef(fields);
  const _name = React.useRef(name);
  const _actioned = React.useRef(false);
  _name.current = name;
  _fieldIds.current = fields;
  control._names.array.add(name);
  props.rules && control.register(name, props.rules);
  useSubscribe({
    next: ({ values, name: fieldArrayName }) => {
      if (fieldArrayName === _name.current || !fieldArrayName) {
        const fieldValues = get(values, _name.current);
        if (Array.isArray(fieldValues)) {
          setFields(fieldValues);
          ids.current = fieldValues.map(generateId);
        }
      }
    },
    subject: control._subjects.array
  });
  const updateValues = React.useCallback((updatedFieldArrayValues) => {
    _actioned.current = true;
    control._updateFieldArray(name, updatedFieldArrayValues);
  }, [control, name]);
  const append = (value, options) => {
    const appendValue = convertToArrayPayload(cloneObject(value));
    const updatedFieldArrayValues = appendAt(control._getFieldArray(name), appendValue);
    control._names.focus = getFocusFieldName(name, updatedFieldArrayValues.length - 1, options);
    ids.current = appendAt(ids.current, appendValue.map(generateId));
    updateValues(updatedFieldArrayValues);
    setFields(updatedFieldArrayValues);
    control._updateFieldArray(name, updatedFieldArrayValues, appendAt, {
      argA: fillEmptyArray(value)
    });
  };
  const prepend = (value, options) => {
    const prependValue = convertToArrayPayload(cloneObject(value));
    const updatedFieldArrayValues = prependAt(control._getFieldArray(name), prependValue);
    control._names.focus = getFocusFieldName(name, 0, options);
    ids.current = prependAt(ids.current, prependValue.map(generateId));
    updateValues(updatedFieldArrayValues);
    setFields(updatedFieldArrayValues);
    control._updateFieldArray(name, updatedFieldArrayValues, prependAt, {
      argA: fillEmptyArray(value)
    });
  };
  const remove = (index) => {
    const updatedFieldArrayValues = removeArrayAt(control._getFieldArray(name), index);
    ids.current = removeArrayAt(ids.current, index);
    updateValues(updatedFieldArrayValues);
    setFields(updatedFieldArrayValues);
    control._updateFieldArray(name, updatedFieldArrayValues, removeArrayAt, {
      argA: index
    });
  };
  const insert$1 = (index, value, options) => {
    const insertValue = convertToArrayPayload(cloneObject(value));
    const updatedFieldArrayValues = insert(control._getFieldArray(name), index, insertValue);
    control._names.focus = getFocusFieldName(name, index, options);
    ids.current = insert(ids.current, index, insertValue.map(generateId));
    updateValues(updatedFieldArrayValues);
    setFields(updatedFieldArrayValues);
    control._updateFieldArray(name, updatedFieldArrayValues, insert, {
      argA: index,
      argB: fillEmptyArray(value)
    });
  };
  const swap = (indexA, indexB) => {
    const updatedFieldArrayValues = control._getFieldArray(name);
    swapArrayAt(updatedFieldArrayValues, indexA, indexB);
    swapArrayAt(ids.current, indexA, indexB);
    updateValues(updatedFieldArrayValues);
    setFields(updatedFieldArrayValues);
    control._updateFieldArray(name, updatedFieldArrayValues, swapArrayAt, {
      argA: indexA,
      argB: indexB
    }, false);
  };
  const move = (from, to) => {
    const updatedFieldArrayValues = control._getFieldArray(name);
    moveArrayAt(updatedFieldArrayValues, from, to);
    moveArrayAt(ids.current, from, to);
    updateValues(updatedFieldArrayValues);
    setFields(updatedFieldArrayValues);
    control._updateFieldArray(name, updatedFieldArrayValues, moveArrayAt, {
      argA: from,
      argB: to
    }, false);
  };
  const update = (index, value) => {
    const updateValue = cloneObject(value);
    const updatedFieldArrayValues = updateAt(control._getFieldArray(name), index, updateValue);
    ids.current = [...updatedFieldArrayValues].map((item, i) => !item || i === index ? generateId() : ids.current[i]);
    updateValues(updatedFieldArrayValues);
    setFields([...updatedFieldArrayValues]);
    control._updateFieldArray(name, updatedFieldArrayValues, updateAt, {
      argA: index,
      argB: updateValue
    }, true, false);
  };
  const replace = (value) => {
    const updatedFieldArrayValues = convertToArrayPayload(cloneObject(value));
    ids.current = updatedFieldArrayValues.map(generateId);
    updateValues([...updatedFieldArrayValues]);
    setFields([...updatedFieldArrayValues]);
    control._updateFieldArray(name, [...updatedFieldArrayValues], (data) => data, {}, true, false);
  };
  React.useEffect(() => {
    control._state.action = false;
    isWatched(name, control._names) && control._subjects.state.next({
      ...control._formState
    });
    if (_actioned.current && (!getValidationModes(control._options.mode).isOnSubmit || control._formState.isSubmitted)) {
      if (control._options.resolver) {
        control._executeSchema([name]).then((result) => {
          const error = get(result.errors, name);
          const existingError = get(control._formState.errors, name);
          if (existingError ? !error && existingError.type || error && (existingError.type !== error.type || existingError.message !== error.message) : error && error.type) {
            error ? set(control._formState.errors, name, error) : unset(control._formState.errors, name);
            control._subjects.state.next({
              errors: control._formState.errors
            });
          }
        });
      } else {
        const field = get(control._fields, name);
        if (field && field._f && !(getValidationModes(control._options.reValidateMode).isOnSubmit && getValidationModes(control._options.mode).isOnSubmit)) {
          validateField(field, control._formValues, control._options.criteriaMode === VALIDATION_MODE.all, control._options.shouldUseNativeValidation, true).then((error) => !isEmptyObject(error) && control._subjects.state.next({
            errors: updateFieldArrayRootError(control._formState.errors, error, name)
          }));
        }
      }
    }
    control._subjects.values.next({
      name,
      values: { ...control._formValues }
    });
    control._names.focus && iterateFieldsByAction(control._fields, (ref, key) => {
      if (control._names.focus && key.startsWith(control._names.focus) && ref.focus) {
        ref.focus();
        return 1;
      }
      return;
    });
    control._names.focus = "";
    control._updateValid();
    _actioned.current = false;
  }, [fields, name, control]);
  React.useEffect(() => {
    !get(control._formValues, name) && control._updateFieldArray(name);
    return () => {
      (control._options.shouldUnregister || shouldUnregister) && control.unregister(name);
    };
  }, [name, control, keyName, shouldUnregister]);
  return {
    swap: React.useCallback(swap, [updateValues, name, control]),
    move: React.useCallback(move, [updateValues, name, control]),
    prepend: React.useCallback(prepend, [updateValues, name, control]),
    append: React.useCallback(append, [updateValues, name, control]),
    remove: React.useCallback(remove, [updateValues, name, control]),
    insert: React.useCallback(insert$1, [updateValues, name, control]),
    update: React.useCallback(update, [updateValues, name, control]),
    replace: React.useCallback(replace, [updateValues, name, control]),
    fields: React.useMemo(() => fields.map((field, index) => ({
      ...field,
      [keyName]: ids.current[index] || generateId()
    })), [fields, keyName])
  };
}
var createSubject = () => {
  let _observers = [];
  const next = (value) => {
    for (const observer of _observers) {
      observer.next && observer.next(value);
    }
  };
  const subscribe = (observer) => {
    _observers.push(observer);
    return {
      unsubscribe: () => {
        _observers = _observers.filter((o) => o !== observer);
      }
    };
  };
  const unsubscribe = () => {
    _observers = [];
  };
  return {
    get observers() {
      return _observers;
    },
    next,
    subscribe,
    unsubscribe
  };
};
var isPrimitive = (value) => isNullOrUndefined(value) || !isObjectType(value);
function deepEqual(object1, object2) {
  if (isPrimitive(object1) || isPrimitive(object2)) {
    return object1 === object2;
  }
  if (isDateObject(object1) && isDateObject(object2)) {
    return object1.getTime() === object2.getTime();
  }
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (const key of keys1) {
    const val1 = object1[key];
    if (!keys2.includes(key)) {
      return false;
    }
    if (key !== "ref") {
      const val2 = object2[key];
      if (isDateObject(val1) && isDateObject(val2) || isObject$1(val1) && isObject$1(val2) || Array.isArray(val1) && Array.isArray(val2) ? !deepEqual(val1, val2) : val1 !== val2) {
        return false;
      }
    }
  }
  return true;
}
var isMultipleSelect = (element) => element.type === `select-multiple`;
var isRadioOrCheckbox = (ref) => isRadioInput(ref) || isCheckBoxInput(ref);
var live = (ref) => isHTMLElement(ref) && ref.isConnected;
var objectHasFunction = (data) => {
  for (const key in data) {
    if (isFunction(data[key])) {
      return true;
    }
  }
  return false;
};
function markFieldsDirty(data, fields = {}) {
  const isParentNodeArray = Array.isArray(data);
  if (isObject$1(data) || isParentNodeArray) {
    for (const key in data) {
      if (Array.isArray(data[key]) || isObject$1(data[key]) && !objectHasFunction(data[key])) {
        fields[key] = Array.isArray(data[key]) ? [] : {};
        markFieldsDirty(data[key], fields[key]);
      } else if (!isNullOrUndefined(data[key])) {
        fields[key] = true;
      }
    }
  }
  return fields;
}
function getDirtyFieldsFromDefaultValues(data, formValues, dirtyFieldsFromValues) {
  const isParentNodeArray = Array.isArray(data);
  if (isObject$1(data) || isParentNodeArray) {
    for (const key in data) {
      if (Array.isArray(data[key]) || isObject$1(data[key]) && !objectHasFunction(data[key])) {
        if (isUndefined(formValues) || isPrimitive(dirtyFieldsFromValues[key])) {
          dirtyFieldsFromValues[key] = Array.isArray(data[key]) ? markFieldsDirty(data[key], []) : { ...markFieldsDirty(data[key]) };
        } else {
          getDirtyFieldsFromDefaultValues(data[key], isNullOrUndefined(formValues) ? {} : formValues[key], dirtyFieldsFromValues[key]);
        }
      } else {
        dirtyFieldsFromValues[key] = !deepEqual(data[key], formValues[key]);
      }
    }
  }
  return dirtyFieldsFromValues;
}
var getDirtyFields = (defaultValues, formValues) => getDirtyFieldsFromDefaultValues(defaultValues, formValues, markFieldsDirty(formValues));
var getFieldValueAs = (value, { valueAsNumber, valueAsDate, setValueAs }) => isUndefined(value) ? value : valueAsNumber ? value === "" ? NaN : value ? +value : value : valueAsDate && isString$1(value) ? new Date(value) : setValueAs ? setValueAs(value) : value;
function getFieldValue(_f) {
  const ref = _f.ref;
  if (_f.refs ? _f.refs.every((ref2) => ref2.disabled) : ref.disabled) {
    return;
  }
  if (isFileInput(ref)) {
    return ref.files;
  }
  if (isRadioInput(ref)) {
    return getRadioValue(_f.refs).value;
  }
  if (isMultipleSelect(ref)) {
    return [...ref.selectedOptions].map(({ value }) => value);
  }
  if (isCheckBoxInput(ref)) {
    return getCheckboxValue(_f.refs).value;
  }
  return getFieldValueAs(isUndefined(ref.value) ? _f.ref.value : ref.value, _f);
}
var getResolverOptions = (fieldsNames, _fields, criteriaMode, shouldUseNativeValidation) => {
  const fields = {};
  for (const name of fieldsNames) {
    const field = get(_fields, name);
    field && set(fields, name, field._f);
  }
  return {
    criteriaMode,
    names: [...fieldsNames],
    fields,
    shouldUseNativeValidation
  };
};
var getRuleValue = (rule) => isUndefined(rule) ? rule : isRegex(rule) ? rule.source : isObject$1(rule) ? isRegex(rule.value) ? rule.value.source : rule.value : rule;
var hasValidation = (options) => options.mount && (options.required || options.min || options.max || options.maxLength || options.minLength || options.pattern || options.validate);
function schemaErrorLookup(errors, _fields, name) {
  const error = get(errors, name);
  if (error || isKey(name)) {
    return {
      error,
      name
    };
  }
  const names = name.split(".");
  while (names.length) {
    const fieldName = names.join(".");
    const field = get(_fields, fieldName);
    const foundError = get(errors, fieldName);
    if (field && !Array.isArray(field) && name !== fieldName) {
      return { name };
    }
    if (foundError && foundError.type) {
      return {
        name: fieldName,
        error: foundError
      };
    }
    names.pop();
  }
  return {
    name
  };
}
var skipValidation = (isBlurEvent, isTouched, isSubmitted, reValidateMode, mode) => {
  if (mode.isOnAll) {
    return false;
  } else if (!isSubmitted && mode.isOnTouch) {
    return !(isTouched || isBlurEvent);
  } else if (isSubmitted ? reValidateMode.isOnBlur : mode.isOnBlur) {
    return !isBlurEvent;
  } else if (isSubmitted ? reValidateMode.isOnChange : mode.isOnChange) {
    return isBlurEvent;
  }
  return true;
};
var unsetEmptyArray = (ref, name) => !compact(get(ref, name)).length && unset(ref, name);
const defaultOptions = {
  mode: VALIDATION_MODE.onSubmit,
  reValidateMode: VALIDATION_MODE.onChange,
  shouldFocusError: true
};
function createFormControl(props = {}) {
  let _options = {
    ...defaultOptions,
    ...props
  };
  let _formState = {
    submitCount: 0,
    isDirty: false,
    isLoading: isFunction(_options.defaultValues),
    isValidating: false,
    isSubmitted: false,
    isSubmitting: false,
    isSubmitSuccessful: false,
    isValid: false,
    touchedFields: {},
    dirtyFields: {},
    validatingFields: {},
    errors: _options.errors || {},
    disabled: _options.disabled || false
  };
  let _fields = {};
  let _defaultValues = isObject$1(_options.defaultValues) || isObject$1(_options.values) ? cloneObject(_options.defaultValues || _options.values) || {} : {};
  let _formValues = _options.shouldUnregister ? {} : cloneObject(_defaultValues);
  let _state = {
    action: false,
    mount: false,
    watch: false
  };
  let _names = {
    mount: /* @__PURE__ */ new Set(),
    unMount: /* @__PURE__ */ new Set(),
    array: /* @__PURE__ */ new Set(),
    watch: /* @__PURE__ */ new Set()
  };
  let delayErrorCallback;
  let timer = 0;
  const _proxyFormState = {
    isDirty: false,
    dirtyFields: false,
    validatingFields: false,
    touchedFields: false,
    isValidating: false,
    isValid: false,
    errors: false
  };
  const _subjects = {
    values: createSubject(),
    array: createSubject(),
    state: createSubject()
  };
  const validationModeBeforeSubmit = getValidationModes(_options.mode);
  const validationModeAfterSubmit = getValidationModes(_options.reValidateMode);
  const shouldDisplayAllAssociatedErrors = _options.criteriaMode === VALIDATION_MODE.all;
  const debounce = (callback) => (wait) => {
    clearTimeout(timer);
    timer = setTimeout(callback, wait);
  };
  const _updateValid = async (shouldUpdateValid) => {
    if (_proxyFormState.isValid || shouldUpdateValid) {
      const isValid = _options.resolver ? isEmptyObject((await _executeSchema()).errors) : await executeBuiltInValidation(_fields, true);
      if (isValid !== _formState.isValid) {
        _subjects.state.next({
          isValid
        });
      }
    }
  };
  const _updateIsValidating = (names, isValidating) => {
    if (_proxyFormState.isValidating || _proxyFormState.validatingFields) {
      (names || Array.from(_names.mount)).forEach((name) => name && set(_formState.validatingFields, name, !!isValidating));
      _formState.isValidating = Object.values(_formState.validatingFields).some((val) => val);
      _subjects.state.next({
        validatingFields: _formState.validatingFields,
        isValidating: _formState.isValidating
      });
    }
  };
  const _updateFieldArray = (name, values = [], method, args, shouldSetValues = true, shouldUpdateFieldsAndState = true) => {
    if (args && method) {
      _state.action = true;
      if (shouldUpdateFieldsAndState && Array.isArray(get(_fields, name))) {
        const fieldValues = method(get(_fields, name), args.argA, args.argB);
        shouldSetValues && set(_fields, name, fieldValues);
      }
      if (shouldUpdateFieldsAndState && Array.isArray(get(_formState.errors, name))) {
        const errors = method(get(_formState.errors, name), args.argA, args.argB);
        shouldSetValues && set(_formState.errors, name, errors);
        unsetEmptyArray(_formState.errors, name);
      }
      if (_proxyFormState.touchedFields && shouldUpdateFieldsAndState && Array.isArray(get(_formState.touchedFields, name))) {
        const touchedFields = method(get(_formState.touchedFields, name), args.argA, args.argB);
        shouldSetValues && set(_formState.touchedFields, name, touchedFields);
      }
      if (_proxyFormState.dirtyFields) {
        _formState.dirtyFields = getDirtyFields(_defaultValues, _formValues);
      }
      _subjects.state.next({
        name,
        isDirty: _getDirty(name, values),
        dirtyFields: _formState.dirtyFields,
        errors: _formState.errors,
        isValid: _formState.isValid
      });
    } else {
      set(_formValues, name, values);
    }
  };
  const updateErrors = (name, error) => {
    set(_formState.errors, name, error);
    _subjects.state.next({
      errors: _formState.errors
    });
  };
  const _setErrors = (errors) => {
    _formState.errors = errors;
    _subjects.state.next({
      errors: _formState.errors,
      isValid: false
    });
  };
  const updateValidAndValue = (name, shouldSkipSetValueAs, value, ref) => {
    const field = get(_fields, name);
    if (field) {
      const defaultValue = get(_formValues, name, isUndefined(value) ? get(_defaultValues, name) : value);
      isUndefined(defaultValue) || ref && ref.defaultChecked || shouldSkipSetValueAs ? set(_formValues, name, shouldSkipSetValueAs ? defaultValue : getFieldValue(field._f)) : setFieldValue(name, defaultValue);
      _state.mount && _updateValid();
    }
  };
  const updateTouchAndDirty = (name, fieldValue, isBlurEvent, shouldDirty, shouldRender) => {
    let shouldUpdateField = false;
    let isPreviousDirty = false;
    const output = {
      name
    };
    const disabledField = !!(get(_fields, name) && get(_fields, name)._f.disabled);
    if (!isBlurEvent || shouldDirty) {
      if (_proxyFormState.isDirty) {
        isPreviousDirty = _formState.isDirty;
        _formState.isDirty = output.isDirty = _getDirty();
        shouldUpdateField = isPreviousDirty !== output.isDirty;
      }
      const isCurrentFieldPristine = disabledField || deepEqual(get(_defaultValues, name), fieldValue);
      isPreviousDirty = !!(!disabledField && get(_formState.dirtyFields, name));
      isCurrentFieldPristine || disabledField ? unset(_formState.dirtyFields, name) : set(_formState.dirtyFields, name, true);
      output.dirtyFields = _formState.dirtyFields;
      shouldUpdateField = shouldUpdateField || _proxyFormState.dirtyFields && isPreviousDirty !== !isCurrentFieldPristine;
    }
    if (isBlurEvent) {
      const isPreviousFieldTouched = get(_formState.touchedFields, name);
      if (!isPreviousFieldTouched) {
        set(_formState.touchedFields, name, isBlurEvent);
        output.touchedFields = _formState.touchedFields;
        shouldUpdateField = shouldUpdateField || _proxyFormState.touchedFields && isPreviousFieldTouched !== isBlurEvent;
      }
    }
    shouldUpdateField && shouldRender && _subjects.state.next(output);
    return shouldUpdateField ? output : {};
  };
  const shouldRenderByError = (name, isValid, error, fieldState) => {
    const previousFieldError = get(_formState.errors, name);
    const shouldUpdateValid = _proxyFormState.isValid && isBoolean(isValid) && _formState.isValid !== isValid;
    if (props.delayError && error) {
      delayErrorCallback = debounce(() => updateErrors(name, error));
      delayErrorCallback(props.delayError);
    } else {
      clearTimeout(timer);
      delayErrorCallback = null;
      error ? set(_formState.errors, name, error) : unset(_formState.errors, name);
    }
    if ((error ? !deepEqual(previousFieldError, error) : previousFieldError) || !isEmptyObject(fieldState) || shouldUpdateValid) {
      const updatedFormState = {
        ...fieldState,
        ...shouldUpdateValid && isBoolean(isValid) ? { isValid } : {},
        errors: _formState.errors,
        name
      };
      _formState = {
        ..._formState,
        ...updatedFormState
      };
      _subjects.state.next(updatedFormState);
    }
  };
  const _executeSchema = async (name) => {
    _updateIsValidating(name, true);
    const result = await _options.resolver(_formValues, _options.context, getResolverOptions(name || _names.mount, _fields, _options.criteriaMode, _options.shouldUseNativeValidation));
    _updateIsValidating(name);
    return result;
  };
  const executeSchemaAndUpdateState = async (names) => {
    const { errors } = await _executeSchema(names);
    if (names) {
      for (const name of names) {
        const error = get(errors, name);
        error ? set(_formState.errors, name, error) : unset(_formState.errors, name);
      }
    } else {
      _formState.errors = errors;
    }
    return errors;
  };
  const executeBuiltInValidation = async (fields, shouldOnlyCheckValid, context = {
    valid: true
  }) => {
    for (const name in fields) {
      const field = fields[name];
      if (field) {
        const { _f, ...fieldValue } = field;
        if (_f) {
          const isFieldArrayRoot = _names.array.has(_f.name);
          _updateIsValidating([name], true);
          const fieldError = await validateField(field, _formValues, shouldDisplayAllAssociatedErrors, _options.shouldUseNativeValidation && !shouldOnlyCheckValid, isFieldArrayRoot);
          _updateIsValidating([name]);
          if (fieldError[_f.name]) {
            context.valid = false;
            if (shouldOnlyCheckValid) {
              break;
            }
          }
          !shouldOnlyCheckValid && (get(fieldError, _f.name) ? isFieldArrayRoot ? updateFieldArrayRootError(_formState.errors, fieldError, _f.name) : set(_formState.errors, _f.name, fieldError[_f.name]) : unset(_formState.errors, _f.name));
        }
        fieldValue && await executeBuiltInValidation(fieldValue, shouldOnlyCheckValid, context);
      }
    }
    return context.valid;
  };
  const _removeUnmounted = () => {
    for (const name of _names.unMount) {
      const field = get(_fields, name);
      field && (field._f.refs ? field._f.refs.every((ref) => !live(ref)) : !live(field._f.ref)) && unregister(name);
    }
    _names.unMount = /* @__PURE__ */ new Set();
  };
  const _getDirty = (name, data) => (name && data && set(_formValues, name, data), !deepEqual(getValues(), _defaultValues));
  const _getWatch = (names, defaultValue, isGlobal) => generateWatchOutput(names, _names, {
    ..._state.mount ? _formValues : isUndefined(defaultValue) ? _defaultValues : isString$1(names) ? { [names]: defaultValue } : defaultValue
  }, isGlobal, defaultValue);
  const _getFieldArray = (name) => compact(get(_state.mount ? _formValues : _defaultValues, name, props.shouldUnregister ? get(_defaultValues, name, []) : []));
  const setFieldValue = (name, value, options = {}) => {
    const field = get(_fields, name);
    let fieldValue = value;
    if (field) {
      const fieldReference = field._f;
      if (fieldReference) {
        !fieldReference.disabled && set(_formValues, name, getFieldValueAs(value, fieldReference));
        fieldValue = isHTMLElement(fieldReference.ref) && isNullOrUndefined(value) ? "" : value;
        if (isMultipleSelect(fieldReference.ref)) {
          [...fieldReference.ref.options].forEach((optionRef) => optionRef.selected = fieldValue.includes(optionRef.value));
        } else if (fieldReference.refs) {
          if (isCheckBoxInput(fieldReference.ref)) {
            fieldReference.refs.length > 1 ? fieldReference.refs.forEach((checkboxRef) => (!checkboxRef.defaultChecked || !checkboxRef.disabled) && (checkboxRef.checked = Array.isArray(fieldValue) ? !!fieldValue.find((data) => data === checkboxRef.value) : fieldValue === checkboxRef.value)) : fieldReference.refs[0] && (fieldReference.refs[0].checked = !!fieldValue);
          } else {
            fieldReference.refs.forEach((radioRef) => radioRef.checked = radioRef.value === fieldValue);
          }
        } else if (isFileInput(fieldReference.ref)) {
          fieldReference.ref.value = "";
        } else {
          fieldReference.ref.value = fieldValue;
          if (!fieldReference.ref.type) {
            _subjects.values.next({
              name,
              values: { ..._formValues }
            });
          }
        }
      }
    }
    (options.shouldDirty || options.shouldTouch) && updateTouchAndDirty(name, fieldValue, options.shouldTouch, options.shouldDirty, true);
    options.shouldValidate && trigger(name);
  };
  const setValues = (name, value, options) => {
    for (const fieldKey in value) {
      const fieldValue = value[fieldKey];
      const fieldName = `${name}.${fieldKey}`;
      const field = get(_fields, fieldName);
      (_names.array.has(name) || !isPrimitive(fieldValue) || field && !field._f) && !isDateObject(fieldValue) ? setValues(fieldName, fieldValue, options) : setFieldValue(fieldName, fieldValue, options);
    }
  };
  const setValue = (name, value, options = {}) => {
    const field = get(_fields, name);
    const isFieldArray = _names.array.has(name);
    const cloneValue = cloneObject(value);
    set(_formValues, name, cloneValue);
    if (isFieldArray) {
      _subjects.array.next({
        name,
        values: { ..._formValues }
      });
      if ((_proxyFormState.isDirty || _proxyFormState.dirtyFields) && options.shouldDirty) {
        _subjects.state.next({
          name,
          dirtyFields: getDirtyFields(_defaultValues, _formValues),
          isDirty: _getDirty(name, cloneValue)
        });
      }
    } else {
      field && !field._f && !isNullOrUndefined(cloneValue) ? setValues(name, cloneValue, options) : setFieldValue(name, cloneValue, options);
    }
    isWatched(name, _names) && _subjects.state.next({ ..._formState });
    _subjects.values.next({
      name: _state.mount ? name : void 0,
      values: { ..._formValues }
    });
  };
  const onChange = async (event) => {
    const target = event.target;
    let name = target.name;
    let isFieldValueUpdated = true;
    const field = get(_fields, name);
    const getCurrentFieldValue = () => target.type ? getFieldValue(field._f) : getEventValue(event);
    const _updateIsFieldValueUpdated = (fieldValue) => {
      isFieldValueUpdated = Number.isNaN(fieldValue) || fieldValue === get(_formValues, name, fieldValue);
    };
    if (field) {
      let error;
      let isValid;
      const fieldValue = getCurrentFieldValue();
      const isBlurEvent = event.type === EVENTS.BLUR || event.type === EVENTS.FOCUS_OUT;
      const shouldSkipValidation = !hasValidation(field._f) && !_options.resolver && !get(_formState.errors, name) && !field._f.deps || skipValidation(isBlurEvent, get(_formState.touchedFields, name), _formState.isSubmitted, validationModeAfterSubmit, validationModeBeforeSubmit);
      const watched = isWatched(name, _names, isBlurEvent);
      set(_formValues, name, fieldValue);
      if (isBlurEvent) {
        field._f.onBlur && field._f.onBlur(event);
        delayErrorCallback && delayErrorCallback(0);
      } else if (field._f.onChange) {
        field._f.onChange(event);
      }
      const fieldState = updateTouchAndDirty(name, fieldValue, isBlurEvent, false);
      const shouldRender = !isEmptyObject(fieldState) || watched;
      !isBlurEvent && _subjects.values.next({
        name,
        type: event.type,
        values: { ..._formValues }
      });
      if (shouldSkipValidation) {
        _proxyFormState.isValid && _updateValid();
        return shouldRender && _subjects.state.next({ name, ...watched ? {} : fieldState });
      }
      !isBlurEvent && watched && _subjects.state.next({ ..._formState });
      if (_options.resolver) {
        const { errors } = await _executeSchema([name]);
        _updateIsFieldValueUpdated(fieldValue);
        if (isFieldValueUpdated) {
          const previousErrorLookupResult = schemaErrorLookup(_formState.errors, _fields, name);
          const errorLookupResult = schemaErrorLookup(errors, _fields, previousErrorLookupResult.name || name);
          error = errorLookupResult.error;
          name = errorLookupResult.name;
          isValid = isEmptyObject(errors);
        }
      } else {
        _updateIsValidating([name], true);
        error = (await validateField(field, _formValues, shouldDisplayAllAssociatedErrors, _options.shouldUseNativeValidation))[name];
        _updateIsValidating([name]);
        _updateIsFieldValueUpdated(fieldValue);
        if (isFieldValueUpdated) {
          if (error) {
            isValid = false;
          } else if (_proxyFormState.isValid) {
            isValid = await executeBuiltInValidation(_fields, true);
          }
        }
      }
      if (isFieldValueUpdated) {
        field._f.deps && trigger(field._f.deps);
        shouldRenderByError(name, isValid, error, fieldState);
      }
    }
  };
  const _focusInput = (ref, key) => {
    if (get(_formState.errors, key) && ref.focus) {
      ref.focus();
      return 1;
    }
    return;
  };
  const trigger = async (name, options = {}) => {
    let isValid;
    let validationResult;
    const fieldNames = convertToArrayPayload(name);
    if (_options.resolver) {
      const errors = await executeSchemaAndUpdateState(isUndefined(name) ? name : fieldNames);
      isValid = isEmptyObject(errors);
      validationResult = name ? !fieldNames.some((name2) => get(errors, name2)) : isValid;
    } else if (name) {
      validationResult = (await Promise.all(fieldNames.map(async (fieldName) => {
        const field = get(_fields, fieldName);
        return await executeBuiltInValidation(field && field._f ? { [fieldName]: field } : field);
      }))).every(Boolean);
      !(!validationResult && !_formState.isValid) && _updateValid();
    } else {
      validationResult = isValid = await executeBuiltInValidation(_fields);
    }
    _subjects.state.next({
      ...!isString$1(name) || _proxyFormState.isValid && isValid !== _formState.isValid ? {} : { name },
      ..._options.resolver || !name ? { isValid } : {},
      errors: _formState.errors
    });
    options.shouldFocus && !validationResult && iterateFieldsByAction(_fields, _focusInput, name ? fieldNames : _names.mount);
    return validationResult;
  };
  const getValues = (fieldNames) => {
    const values = {
      ..._defaultValues,
      ..._state.mount ? _formValues : {}
    };
    return isUndefined(fieldNames) ? values : isString$1(fieldNames) ? get(values, fieldNames) : fieldNames.map((name) => get(values, name));
  };
  const getFieldState = (name, formState) => ({
    invalid: !!get((formState || _formState).errors, name),
    isDirty: !!get((formState || _formState).dirtyFields, name),
    isTouched: !!get((formState || _formState).touchedFields, name),
    isValidating: !!get((formState || _formState).validatingFields, name),
    error: get((formState || _formState).errors, name)
  });
  const clearErrors = (name) => {
    name && convertToArrayPayload(name).forEach((inputName) => unset(_formState.errors, inputName));
    _subjects.state.next({
      errors: name ? _formState.errors : {}
    });
  };
  const setError = (name, error, options) => {
    const ref = (get(_fields, name, { _f: {} })._f || {}).ref;
    set(_formState.errors, name, {
      ...error,
      ref
    });
    _subjects.state.next({
      name,
      errors: _formState.errors,
      isValid: false
    });
    options && options.shouldFocus && ref && ref.focus && ref.focus();
  };
  const watch = (name, defaultValue) => isFunction(name) ? _subjects.values.subscribe({
    next: (payload) => name(_getWatch(void 0, defaultValue), payload)
  }) : _getWatch(name, defaultValue, true);
  const unregister = (name, options = {}) => {
    for (const fieldName of name ? convertToArrayPayload(name) : _names.mount) {
      _names.mount.delete(fieldName);
      _names.array.delete(fieldName);
      if (!options.keepValue) {
        unset(_fields, fieldName);
        unset(_formValues, fieldName);
      }
      !options.keepError && unset(_formState.errors, fieldName);
      !options.keepDirty && unset(_formState.dirtyFields, fieldName);
      !options.keepTouched && unset(_formState.touchedFields, fieldName);
      !options.keepIsValidating && unset(_formState.validatingFields, fieldName);
      !_options.shouldUnregister && !options.keepDefaultValue && unset(_defaultValues, fieldName);
    }
    _subjects.values.next({
      values: { ..._formValues }
    });
    _subjects.state.next({
      ..._formState,
      ...!options.keepDirty ? {} : { isDirty: _getDirty() }
    });
    !options.keepIsValid && _updateValid();
  };
  const _updateDisabledField = ({ disabled, name, field, fields, value }) => {
    if (isBoolean(disabled)) {
      const inputValue = disabled ? void 0 : isUndefined(value) ? getFieldValue(field ? field._f : get(fields, name)._f) : value;
      set(_formValues, name, inputValue);
      updateTouchAndDirty(name, inputValue, false, false, true);
    }
  };
  const register = (name, options = {}) => {
    let field = get(_fields, name);
    const disabledIsDefined = isBoolean(options.disabled);
    set(_fields, name, {
      ...field || {},
      _f: {
        ...field && field._f ? field._f : { ref: { name } },
        name,
        mount: true,
        ...options
      }
    });
    _names.mount.add(name);
    if (field) {
      _updateDisabledField({
        field,
        disabled: options.disabled,
        name,
        value: options.value
      });
    } else {
      updateValidAndValue(name, true, options.value);
    }
    return {
      ...disabledIsDefined ? { disabled: options.disabled } : {},
      ..._options.progressive ? {
        required: !!options.required,
        min: getRuleValue(options.min),
        max: getRuleValue(options.max),
        minLength: getRuleValue(options.minLength),
        maxLength: getRuleValue(options.maxLength),
        pattern: getRuleValue(options.pattern)
      } : {},
      name,
      onChange,
      onBlur: onChange,
      ref: (ref) => {
        if (ref) {
          register(name, options);
          field = get(_fields, name);
          const fieldRef = isUndefined(ref.value) ? ref.querySelectorAll ? ref.querySelectorAll("input,select,textarea")[0] || ref : ref : ref;
          const radioOrCheckbox = isRadioOrCheckbox(fieldRef);
          const refs = field._f.refs || [];
          if (radioOrCheckbox ? refs.find((option) => option === fieldRef) : fieldRef === field._f.ref) {
            return;
          }
          set(_fields, name, {
            _f: {
              ...field._f,
              ...radioOrCheckbox ? {
                refs: [
                  ...refs.filter(live),
                  fieldRef,
                  ...Array.isArray(get(_defaultValues, name)) ? [{}] : []
                ],
                ref: { type: fieldRef.type, name }
              } : { ref: fieldRef }
            }
          });
          updateValidAndValue(name, false, void 0, fieldRef);
        } else {
          field = get(_fields, name, {});
          if (field._f) {
            field._f.mount = false;
          }
          (_options.shouldUnregister || options.shouldUnregister) && !(isNameInFieldArray(_names.array, name) && _state.action) && _names.unMount.add(name);
        }
      }
    };
  };
  const _focusError = () => _options.shouldFocusError && iterateFieldsByAction(_fields, _focusInput, _names.mount);
  const _disableForm = (disabled) => {
    if (isBoolean(disabled)) {
      _subjects.state.next({ disabled });
      iterateFieldsByAction(_fields, (ref, name) => {
        let requiredDisabledState = disabled;
        const currentField = get(_fields, name);
        if (currentField && isBoolean(currentField._f.disabled)) {
          requiredDisabledState || (requiredDisabledState = currentField._f.disabled);
        }
        ref.disabled = requiredDisabledState;
      }, 0, false);
    }
  };
  const handleSubmit = (onValid, onInvalid) => async (e) => {
    let onValidError = void 0;
    if (e) {
      e.preventDefault && e.preventDefault();
      e.persist && e.persist();
    }
    let fieldValues = cloneObject(_formValues);
    _subjects.state.next({
      isSubmitting: true
    });
    if (_options.resolver) {
      const { errors, values } = await _executeSchema();
      _formState.errors = errors;
      fieldValues = values;
    } else {
      await executeBuiltInValidation(_fields);
    }
    unset(_formState.errors, "root");
    if (isEmptyObject(_formState.errors)) {
      _subjects.state.next({
        errors: {}
      });
      try {
        await onValid(fieldValues, e);
      } catch (error) {
        onValidError = error;
      }
    } else {
      if (onInvalid) {
        await onInvalid({ ..._formState.errors }, e);
      }
      _focusError();
      setTimeout(_focusError);
    }
    _subjects.state.next({
      isSubmitted: true,
      isSubmitting: false,
      isSubmitSuccessful: isEmptyObject(_formState.errors) && !onValidError,
      submitCount: _formState.submitCount + 1,
      errors: _formState.errors
    });
    if (onValidError) {
      throw onValidError;
    }
  };
  const resetField = (name, options = {}) => {
    if (get(_fields, name)) {
      if (isUndefined(options.defaultValue)) {
        setValue(name, cloneObject(get(_defaultValues, name)));
      } else {
        setValue(name, options.defaultValue);
        set(_defaultValues, name, cloneObject(options.defaultValue));
      }
      if (!options.keepTouched) {
        unset(_formState.touchedFields, name);
      }
      if (!options.keepDirty) {
        unset(_formState.dirtyFields, name);
        _formState.isDirty = options.defaultValue ? _getDirty(name, cloneObject(get(_defaultValues, name))) : _getDirty();
      }
      if (!options.keepError) {
        unset(_formState.errors, name);
        _proxyFormState.isValid && _updateValid();
      }
      _subjects.state.next({ ..._formState });
    }
  };
  const _reset = (formValues, keepStateOptions = {}) => {
    const updatedValues = formValues ? cloneObject(formValues) : _defaultValues;
    const cloneUpdatedValues = cloneObject(updatedValues);
    const isEmptyResetValues = isEmptyObject(formValues);
    const values = isEmptyResetValues ? _defaultValues : cloneUpdatedValues;
    if (!keepStateOptions.keepDefaultValues) {
      _defaultValues = updatedValues;
    }
    if (!keepStateOptions.keepValues) {
      if (keepStateOptions.keepDirtyValues) {
        for (const fieldName of _names.mount) {
          get(_formState.dirtyFields, fieldName) ? set(values, fieldName, get(_formValues, fieldName)) : setValue(fieldName, get(values, fieldName));
        }
      } else {
        if (isWeb && isUndefined(formValues)) {
          for (const name of _names.mount) {
            const field = get(_fields, name);
            if (field && field._f) {
              const fieldReference = Array.isArray(field._f.refs) ? field._f.refs[0] : field._f.ref;
              if (isHTMLElement(fieldReference)) {
                const form = fieldReference.closest("form");
                if (form) {
                  form.reset();
                  break;
                }
              }
            }
          }
        }
        _fields = {};
      }
      _formValues = props.shouldUnregister ? keepStateOptions.keepDefaultValues ? cloneObject(_defaultValues) : {} : cloneObject(values);
      _subjects.array.next({
        values: { ...values }
      });
      _subjects.values.next({
        values: { ...values }
      });
    }
    _names = {
      mount: keepStateOptions.keepDirtyValues ? _names.mount : /* @__PURE__ */ new Set(),
      unMount: /* @__PURE__ */ new Set(),
      array: /* @__PURE__ */ new Set(),
      watch: /* @__PURE__ */ new Set(),
      watchAll: false,
      focus: ""
    };
    _state.mount = !_proxyFormState.isValid || !!keepStateOptions.keepIsValid || !!keepStateOptions.keepDirtyValues;
    _state.watch = !!props.shouldUnregister;
    _subjects.state.next({
      submitCount: keepStateOptions.keepSubmitCount ? _formState.submitCount : 0,
      isDirty: isEmptyResetValues ? false : keepStateOptions.keepDirty ? _formState.isDirty : !!(keepStateOptions.keepDefaultValues && !deepEqual(formValues, _defaultValues)),
      isSubmitted: keepStateOptions.keepIsSubmitted ? _formState.isSubmitted : false,
      dirtyFields: isEmptyResetValues ? [] : keepStateOptions.keepDirtyValues ? keepStateOptions.keepDefaultValues && _formValues ? getDirtyFields(_defaultValues, _formValues) : _formState.dirtyFields : keepStateOptions.keepDefaultValues && formValues ? getDirtyFields(_defaultValues, formValues) : {},
      touchedFields: keepStateOptions.keepTouched ? _formState.touchedFields : {},
      errors: keepStateOptions.keepErrors ? _formState.errors : {},
      isSubmitSuccessful: keepStateOptions.keepIsSubmitSuccessful ? _formState.isSubmitSuccessful : false,
      isSubmitting: false
    });
  };
  const reset = (formValues, keepStateOptions) => _reset(isFunction(formValues) ? formValues(_formValues) : formValues, keepStateOptions);
  const setFocus = (name, options = {}) => {
    const field = get(_fields, name);
    const fieldReference = field && field._f;
    if (fieldReference) {
      const fieldRef = fieldReference.refs ? fieldReference.refs[0] : fieldReference.ref;
      if (fieldRef.focus) {
        fieldRef.focus();
        options.shouldSelect && fieldRef.select();
      }
    }
  };
  const _updateFormState = (updatedFormState) => {
    _formState = {
      ..._formState,
      ...updatedFormState
    };
  };
  const _resetDefaultValues = () => isFunction(_options.defaultValues) && _options.defaultValues().then((values) => {
    reset(values, _options.resetOptions);
    _subjects.state.next({
      isLoading: false
    });
  });
  return {
    control: {
      register,
      unregister,
      getFieldState,
      handleSubmit,
      setError,
      _executeSchema,
      _getWatch,
      _getDirty,
      _updateValid,
      _removeUnmounted,
      _updateFieldArray,
      _updateDisabledField,
      _getFieldArray,
      _reset,
      _resetDefaultValues,
      _updateFormState,
      _disableForm,
      _subjects,
      _proxyFormState,
      _setErrors,
      get _fields() {
        return _fields;
      },
      get _formValues() {
        return _formValues;
      },
      get _state() {
        return _state;
      },
      set _state(value) {
        _state = value;
      },
      get _defaultValues() {
        return _defaultValues;
      },
      get _names() {
        return _names;
      },
      set _names(value) {
        _names = value;
      },
      get _formState() {
        return _formState;
      },
      set _formState(value) {
        _formState = value;
      },
      get _options() {
        return _options;
      },
      set _options(value) {
        _options = {
          ..._options,
          ...value
        };
      }
    },
    trigger,
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    resetField,
    clearErrors,
    unregister,
    setError,
    setFocus,
    getFieldState
  };
}
function useForm(props = {}) {
  const _formControl = React.useRef();
  const _values = React.useRef();
  const [formState, updateFormState] = React.useState({
    isDirty: false,
    isValidating: false,
    isLoading: isFunction(props.defaultValues),
    isSubmitted: false,
    isSubmitting: false,
    isSubmitSuccessful: false,
    isValid: false,
    submitCount: 0,
    dirtyFields: {},
    touchedFields: {},
    validatingFields: {},
    errors: props.errors || {},
    disabled: props.disabled || false,
    defaultValues: isFunction(props.defaultValues) ? void 0 : props.defaultValues
  });
  if (!_formControl.current) {
    _formControl.current = {
      ...createFormControl(props),
      formState
    };
  }
  const control = _formControl.current.control;
  control._options = props;
  useSubscribe({
    subject: control._subjects.state,
    next: (value) => {
      if (shouldRenderFormState(value, control._proxyFormState, control._updateFormState, true)) {
        updateFormState({ ...control._formState });
      }
    }
  });
  React.useEffect(() => control._disableForm(props.disabled), [control, props.disabled]);
  React.useEffect(() => {
    if (control._proxyFormState.isDirty) {
      const isDirty = control._getDirty();
      if (isDirty !== formState.isDirty) {
        control._subjects.state.next({
          isDirty
        });
      }
    }
  }, [control, formState.isDirty]);
  React.useEffect(() => {
    if (props.values && !deepEqual(props.values, _values.current)) {
      control._reset(props.values, control._options.resetOptions);
      _values.current = props.values;
      updateFormState((state) => ({ ...state }));
    } else {
      control._resetDefaultValues();
    }
  }, [props.values, control]);
  React.useEffect(() => {
    if (props.errors) {
      control._setErrors(props.errors);
    }
  }, [props.errors, control]);
  React.useEffect(() => {
    if (!control._state.mount) {
      control._updateValid();
      control._state.mount = true;
    }
    if (control._state.watch) {
      control._state.watch = false;
      control._subjects.state.next({ ...control._formState });
    }
    control._removeUnmounted();
  });
  React.useEffect(() => {
    props.shouldUnregister && control._subjects.values.next({
      values: control._getWatch()
    });
  }, [props.shouldUnregister, control]);
  _formControl.current.formState = getProxyFormState(formState, control);
  return _formControl.current;
}
function CustomCheckbox({
  register,
  registerOptions,
  name,
  label,
  errors,
  onChange,
  info
}) {
  let hasError = false;
  let errorMessage = "";
  if (typeof errors === "boolean") {
    hasError = errors;
  } else {
    const error = get(errors, name);
    if (error) {
      hasError = !!error;
      errorMessage = error.message || "";
    }
  }
  const onClick = (event) => {
    if (onChange) {
      onChange(event.currentTarget.checked);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: nsp("custom-checkbox"), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          ...register(name, registerOptions),
          type: "checkbox",
          className: classNames(
            nsp("custom-checkbox__input"),
            hasError && nsp("custom-checkbox__input--error")
          ),
          id: name,
          onClick,
          "aria-invalid": hasError,
          "aria-describedby": errorMessage && `${name}-error` ? errorMessage && `${name}-error` : void 0
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "label",
        {
          className: classNames(
            nsp("custom-checkbox__label"),
            hasError && nsp("custom-checkbox__label--error")
          ),
          htmlFor: name,
          children: label
        }
      ),
      !!errorMessage && /* @__PURE__ */ jsxRuntimeExports.jsx(Description, { id: `${name}-error`, error: true, children: errorMessage })
    ] }),
    !!info && /* @__PURE__ */ jsxRuntimeExports.jsx(InfoDialog, { info })
  ] });
}
function CustomRadio({
  register,
  registerOptions,
  name,
  options,
  errors,
  required,
  info
}) {
  const error = get(errors, name);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: nsp("custom-radio"), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { role: "radiogroup", className: nsp("custom-radio__options"), children: options.map((option, i) => {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: nsp("custom-radio__option"),
          children: [
            /* @__PURE__ */ reactExports.createElement(
              "input",
              {
                ...register(name, registerOptions),
                className: classNames(
                  nsp("custom-radio__input"),
                  error && nsp("custom-radio__input--error")
                ),
                type: "radio",
                id: name + "_option_" + i,
                "data-testid": name + "_option_" + i,
                value: option.value,
                key: name + "_option_" + i,
                "aria-describedby": error ? `${name}-error` : void 0,
                required
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                className: classNames(
                  nsp("custom-radio__label"),
                  error && nsp("custom-radio__label--error")
                ),
                htmlFor: name + "_option_" + i,
                children: option.label
              },
              name + "_label_" + i
            ),
            options.length - 1 === i && !!error && /* @__PURE__ */ jsxRuntimeExports.jsx(Description, { id: `${name}-error`, error: true, children: error.message })
          ]
        },
        name + "_option_" + i
      );
    }) }),
    !!info && /* @__PURE__ */ jsxRuntimeExports.jsx(InfoDialog, { info })
  ] });
}
const cloneOptionsList = (options) => options.map((o) => {
  return { label: o.label, value: o.value, hidden: o.hidden };
});
function CustomSelect({
  register,
  registerOptions,
  name,
  label,
  errors,
  options,
  autoWidth,
  required,
  disabled,
  info,
  ...aria
}) {
  const error = get(errors, name);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: classNames(
        nsp("custom-select"),
        autoWidth && nsp("custom-select--auto-width")
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: nsp("custom-select-question"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: nsp("custom-select-question__label"), htmlFor: name, children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: nsp("custom-select-question__control"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              ...register(name, registerOptions),
              className: classNames(
                nsp("custom-select-question__input"),
                error && nsp("custom-select-question__input--error")
              ),
              id: name,
              disabled,
              "aria-invalid": !!error,
              "aria-describedby": error ? `${name}-error` : void 0,
              required,
              ...aria,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "option",
                  {
                    className: nsp("custom-select-question__option"),
                    value: "",
                    disabled: required,
                    hidden: required,
                    children: "Bitte wählen"
                  }
                ),
                options.map((option) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "option",
                  {
                    className: nsp("custom-select-question__option"),
                    value: option.value,
                    hidden: option.hidden,
                    children: option.label
                  },
                  option.value
                ))
              ]
            }
          ) }),
          !!error && /* @__PURE__ */ jsxRuntimeExports.jsx(Description, { id: `${name}-error`, error: true, children: error.message })
        ] }),
        !!info && /* @__PURE__ */ jsxRuntimeExports.jsx(InfoDialog, { info })
      ]
    }
  );
}
function FormFieldGroup({
  headline,
  description,
  info,
  children,
  ...aria
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      "aria-label": headline,
      "aria-roledescription": description,
      className: nsp("form-field-group"),
      ...aria,
      children: [
        !!headline && /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mb-10", children: headline }),
        !!description && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: nsp("form-field-group-description"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: nsp("form-field-group-description__text"), children: description }),
          !!info && /* @__PURE__ */ jsxRuntimeExports.jsx(InfoDialog, { info })
        ] }),
        children
      ]
    }
  );
}
function isString(str) {
  return typeof str === "string" || str instanceof String;
}
function isObject(obj) {
  var _obj$constructor;
  return typeof obj === "object" && obj != null && (obj == null || (_obj$constructor = obj.constructor) == null ? void 0 : _obj$constructor.name) === "Object";
}
function pick(obj, keys) {
  if (Array.isArray(keys)) return pick(obj, (_, k) => keys.includes(k));
  return Object.entries(obj).reduce((acc, _ref) => {
    let [k, v] = _ref;
    if (keys(v, k)) acc[k] = v;
    return acc;
  }, {});
}
const DIRECTION = {
  NONE: "NONE",
  LEFT: "LEFT",
  FORCE_LEFT: "FORCE_LEFT",
  RIGHT: "RIGHT",
  FORCE_RIGHT: "FORCE_RIGHT"
};
function forceDirection(direction) {
  switch (direction) {
    case DIRECTION.LEFT:
      return DIRECTION.FORCE_LEFT;
    case DIRECTION.RIGHT:
      return DIRECTION.FORCE_RIGHT;
    default:
      return direction;
  }
}
function escapeRegExp(str) {
  return str.replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1");
}
function objectIncludes(b, a) {
  if (a === b) return true;
  const arrA = Array.isArray(a), arrB = Array.isArray(b);
  let i;
  if (arrA && arrB) {
    if (a.length != b.length) return false;
    for (i = 0; i < a.length; i++) if (!objectIncludes(a[i], b[i])) return false;
    return true;
  }
  if (arrA != arrB) return false;
  if (a && b && typeof a === "object" && typeof b === "object") {
    const dateA = a instanceof Date, dateB = b instanceof Date;
    if (dateA && dateB) return a.getTime() == b.getTime();
    if (dateA != dateB) return false;
    const regexpA = a instanceof RegExp, regexpB = b instanceof RegExp;
    if (regexpA && regexpB) return a.toString() == b.toString();
    if (regexpA != regexpB) return false;
    const keys = Object.keys(a);
    for (i = 0; i < keys.length; i++) if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
    for (i = 0; i < keys.length; i++) if (!objectIncludes(b[keys[i]], a[keys[i]])) return false;
    return true;
  } else if (a && b && typeof a === "function" && typeof b === "function") {
    return a.toString() === b.toString();
  }
  return false;
}
class ActionDetails {
  /** Current input value */
  /** Current cursor position */
  /** Old input value */
  /** Old selection */
  constructor(opts) {
    Object.assign(this, opts);
    while (this.value.slice(0, this.startChangePos) !== this.oldValue.slice(0, this.startChangePos)) {
      --this.oldSelection.start;
    }
    if (this.insertedCount) {
      while (this.value.slice(this.cursorPos) !== this.oldValue.slice(this.oldSelection.end)) {
        if (this.value.length - this.cursorPos < this.oldValue.length - this.oldSelection.end) ++this.oldSelection.end;
        else ++this.cursorPos;
      }
    }
  }
  /** Start changing position */
  get startChangePos() {
    return Math.min(this.cursorPos, this.oldSelection.start);
  }
  /** Inserted symbols count */
  get insertedCount() {
    return this.cursorPos - this.startChangePos;
  }
  /** Inserted symbols */
  get inserted() {
    return this.value.substr(this.startChangePos, this.insertedCount);
  }
  /** Removed symbols count */
  get removedCount() {
    return Math.max(this.oldSelection.end - this.startChangePos || // for Delete
    this.oldValue.length - this.value.length, 0);
  }
  /** Removed symbols */
  get removed() {
    return this.oldValue.substr(this.startChangePos, this.removedCount);
  }
  /** Unchanged head symbols */
  get head() {
    return this.value.substring(0, this.startChangePos);
  }
  /** Unchanged tail symbols */
  get tail() {
    return this.value.substring(this.startChangePos + this.insertedCount);
  }
  /** Remove direction */
  get removeDirection() {
    if (!this.removedCount || this.insertedCount) return DIRECTION.NONE;
    return (this.oldSelection.end === this.cursorPos || this.oldSelection.start === this.cursorPos) && // if not range removed (event with backspace)
    this.oldSelection.end === this.oldSelection.start ? DIRECTION.RIGHT : DIRECTION.LEFT;
  }
}
function IMask(el, opts) {
  return new IMask.InputMask(el, opts);
}
function maskedClass(mask) {
  if (mask == null) throw new Error("mask property should be defined");
  if (mask instanceof RegExp) return IMask.MaskedRegExp;
  if (isString(mask)) return IMask.MaskedPattern;
  if (mask === Date) return IMask.MaskedDate;
  if (mask === Number) return IMask.MaskedNumber;
  if (Array.isArray(mask) || mask === Array) return IMask.MaskedDynamic;
  if (IMask.Masked && mask.prototype instanceof IMask.Masked) return mask;
  if (IMask.Masked && mask instanceof IMask.Masked) return mask.constructor;
  if (mask instanceof Function) return IMask.MaskedFunction;
  console.warn("Mask not found for mask", mask);
  return IMask.Masked;
}
function normalizeOpts(opts) {
  if (!opts) throw new Error("Options in not defined");
  if (IMask.Masked) {
    if (opts.prototype instanceof IMask.Masked) return {
      mask: opts
    };
    const {
      mask = void 0,
      ...instanceOpts
    } = opts instanceof IMask.Masked ? {
      mask: opts
    } : isObject(opts) && opts.mask instanceof IMask.Masked ? opts : {};
    if (mask) {
      const _mask = mask.mask;
      return {
        ...pick(mask, (_, k) => !k.startsWith("_")),
        mask: mask.constructor,
        _mask,
        ...instanceOpts
      };
    }
  }
  if (!isObject(opts)) return {
    mask: opts
  };
  return {
    ...opts
  };
}
function createMask(opts) {
  if (IMask.Masked && opts instanceof IMask.Masked) return opts;
  const nOpts = normalizeOpts(opts);
  const MaskedClass = maskedClass(nOpts.mask);
  if (!MaskedClass) throw new Error("Masked class is not found for provided mask " + nOpts.mask + ", appropriate module needs to be imported manually before creating mask.");
  if (nOpts.mask === MaskedClass) delete nOpts.mask;
  if (nOpts._mask) {
    nOpts.mask = nOpts._mask;
    delete nOpts._mask;
  }
  return new MaskedClass(nOpts);
}
IMask.createMask = createMask;
class MaskElement {
  /** */
  /** */
  /** */
  /** Safely returns selection start */
  get selectionStart() {
    let start;
    try {
      start = this._unsafeSelectionStart;
    } catch {
    }
    return start != null ? start : this.value.length;
  }
  /** Safely returns selection end */
  get selectionEnd() {
    let end;
    try {
      end = this._unsafeSelectionEnd;
    } catch {
    }
    return end != null ? end : this.value.length;
  }
  /** Safely sets element selection */
  select(start, end) {
    if (start == null || end == null || start === this.selectionStart && end === this.selectionEnd) return;
    try {
      this._unsafeSelect(start, end);
    } catch {
    }
  }
  /** */
  get isActive() {
    return false;
  }
  /** */
  /** */
  /** */
}
IMask.MaskElement = MaskElement;
const KEY_Z = 90;
const KEY_Y = 89;
class HTMLMaskElement extends MaskElement {
  /** HTMLElement to use mask on */
  constructor(input) {
    super();
    this.input = input;
    this._onKeydown = this._onKeydown.bind(this);
    this._onInput = this._onInput.bind(this);
    this._onBeforeinput = this._onBeforeinput.bind(this);
    this._onCompositionEnd = this._onCompositionEnd.bind(this);
  }
  get rootElement() {
    var _this$input$getRootNo, _this$input$getRootNo2, _this$input;
    return (_this$input$getRootNo = (_this$input$getRootNo2 = (_this$input = this.input).getRootNode) == null ? void 0 : _this$input$getRootNo2.call(_this$input)) != null ? _this$input$getRootNo : document;
  }
  /** Is element in focus */
  get isActive() {
    return this.input === this.rootElement.activeElement;
  }
  /** Binds HTMLElement events to mask internal events */
  bindEvents(handlers) {
    this.input.addEventListener("keydown", this._onKeydown);
    this.input.addEventListener("input", this._onInput);
    this.input.addEventListener("beforeinput", this._onBeforeinput);
    this.input.addEventListener("compositionend", this._onCompositionEnd);
    this.input.addEventListener("drop", handlers.drop);
    this.input.addEventListener("click", handlers.click);
    this.input.addEventListener("focus", handlers.focus);
    this.input.addEventListener("blur", handlers.commit);
    this._handlers = handlers;
  }
  _onKeydown(e) {
    if (this._handlers.redo && (e.keyCode === KEY_Z && e.shiftKey && (e.metaKey || e.ctrlKey) || e.keyCode === KEY_Y && e.ctrlKey)) {
      e.preventDefault();
      return this._handlers.redo(e);
    }
    if (this._handlers.undo && e.keyCode === KEY_Z && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      return this._handlers.undo(e);
    }
    if (!e.isComposing) this._handlers.selectionChange(e);
  }
  _onBeforeinput(e) {
    if (e.inputType === "historyUndo" && this._handlers.undo) {
      e.preventDefault();
      return this._handlers.undo(e);
    }
    if (e.inputType === "historyRedo" && this._handlers.redo) {
      e.preventDefault();
      return this._handlers.redo(e);
    }
  }
  _onCompositionEnd(e) {
    this._handlers.input(e);
  }
  _onInput(e) {
    if (!e.isComposing) this._handlers.input(e);
  }
  /** Unbinds HTMLElement events to mask internal events */
  unbindEvents() {
    this.input.removeEventListener("keydown", this._onKeydown);
    this.input.removeEventListener("input", this._onInput);
    this.input.removeEventListener("beforeinput", this._onBeforeinput);
    this.input.removeEventListener("compositionend", this._onCompositionEnd);
    this.input.removeEventListener("drop", this._handlers.drop);
    this.input.removeEventListener("click", this._handlers.click);
    this.input.removeEventListener("focus", this._handlers.focus);
    this.input.removeEventListener("blur", this._handlers.commit);
    this._handlers = {};
  }
}
IMask.HTMLMaskElement = HTMLMaskElement;
class HTMLInputMaskElement extends HTMLMaskElement {
  /** InputElement to use mask on */
  constructor(input) {
    super(input);
    this.input = input;
  }
  /** Returns InputElement selection start */
  get _unsafeSelectionStart() {
    return this.input.selectionStart != null ? this.input.selectionStart : this.value.length;
  }
  /** Returns InputElement selection end */
  get _unsafeSelectionEnd() {
    return this.input.selectionEnd;
  }
  /** Sets InputElement selection */
  _unsafeSelect(start, end) {
    this.input.setSelectionRange(start, end);
  }
  get value() {
    return this.input.value;
  }
  set value(value) {
    this.input.value = value;
  }
}
IMask.HTMLMaskElement = HTMLMaskElement;
class HTMLContenteditableMaskElement extends HTMLMaskElement {
  /** Returns HTMLElement selection start */
  get _unsafeSelectionStart() {
    const root = this.rootElement;
    const selection = root.getSelection && root.getSelection();
    const anchorOffset = selection && selection.anchorOffset;
    const focusOffset = selection && selection.focusOffset;
    if (focusOffset == null || anchorOffset == null || anchorOffset < focusOffset) {
      return anchorOffset;
    }
    return focusOffset;
  }
  /** Returns HTMLElement selection end */
  get _unsafeSelectionEnd() {
    const root = this.rootElement;
    const selection = root.getSelection && root.getSelection();
    const anchorOffset = selection && selection.anchorOffset;
    const focusOffset = selection && selection.focusOffset;
    if (focusOffset == null || anchorOffset == null || anchorOffset > focusOffset) {
      return anchorOffset;
    }
    return focusOffset;
  }
  /** Sets HTMLElement selection */
  _unsafeSelect(start, end) {
    if (!this.rootElement.createRange) return;
    const range = this.rootElement.createRange();
    range.setStart(this.input.firstChild || this.input, start);
    range.setEnd(this.input.lastChild || this.input, end);
    const root = this.rootElement;
    const selection = root.getSelection && root.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
  /** HTMLElement value */
  get value() {
    return this.input.textContent || "";
  }
  set value(value) {
    this.input.textContent = value;
  }
}
IMask.HTMLContenteditableMaskElement = HTMLContenteditableMaskElement;
class InputHistory {
  constructor() {
    this.states = [];
    this.currentIndex = 0;
  }
  get currentState() {
    return this.states[this.currentIndex];
  }
  get isEmpty() {
    return this.states.length === 0;
  }
  push(state) {
    if (this.currentIndex < this.states.length - 1) this.states.length = this.currentIndex + 1;
    this.states.push(state);
    if (this.states.length > InputHistory.MAX_LENGTH) this.states.shift();
    this.currentIndex = this.states.length - 1;
  }
  go(steps) {
    this.currentIndex = Math.min(Math.max(this.currentIndex + steps, 0), this.states.length - 1);
    return this.currentState;
  }
  undo() {
    return this.go(-1);
  }
  redo() {
    return this.go(1);
  }
  clear() {
    this.states.length = 0;
    this.currentIndex = 0;
  }
}
InputHistory.MAX_LENGTH = 100;
class InputMask {
  /**
    View element
  */
  /** Internal {@link Masked} model */
  constructor(el, opts) {
    this.el = el instanceof MaskElement ? el : el.isContentEditable && el.tagName !== "INPUT" && el.tagName !== "TEXTAREA" ? new HTMLContenteditableMaskElement(el) : new HTMLInputMaskElement(el);
    this.masked = createMask(opts);
    this._listeners = {};
    this._value = "";
    this._unmaskedValue = "";
    this._rawInputValue = "";
    this.history = new InputHistory();
    this._saveSelection = this._saveSelection.bind(this);
    this._onInput = this._onInput.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onDrop = this._onDrop.bind(this);
    this._onFocus = this._onFocus.bind(this);
    this._onClick = this._onClick.bind(this);
    this._onUndo = this._onUndo.bind(this);
    this._onRedo = this._onRedo.bind(this);
    this.alignCursor = this.alignCursor.bind(this);
    this.alignCursorFriendly = this.alignCursorFriendly.bind(this);
    this._bindEvents();
    this.updateValue();
    this._onChange();
  }
  maskEquals(mask) {
    var _this$masked;
    return mask == null || ((_this$masked = this.masked) == null ? void 0 : _this$masked.maskEquals(mask));
  }
  /** Masked */
  get mask() {
    return this.masked.mask;
  }
  set mask(mask) {
    if (this.maskEquals(mask)) return;
    if (!(mask instanceof IMask.Masked) && this.masked.constructor === maskedClass(mask)) {
      this.masked.updateOptions({
        mask
      });
      return;
    }
    const masked = mask instanceof IMask.Masked ? mask : createMask({
      mask
    });
    masked.unmaskedValue = this.masked.unmaskedValue;
    this.masked = masked;
  }
  /** Raw value */
  get value() {
    return this._value;
  }
  set value(str) {
    if (this.value === str) return;
    this.masked.value = str;
    this.updateControl("auto");
  }
  /** Unmasked value */
  get unmaskedValue() {
    return this._unmaskedValue;
  }
  set unmaskedValue(str) {
    if (this.unmaskedValue === str) return;
    this.masked.unmaskedValue = str;
    this.updateControl("auto");
  }
  /** Raw input value */
  get rawInputValue() {
    return this._rawInputValue;
  }
  set rawInputValue(str) {
    if (this.rawInputValue === str) return;
    this.masked.rawInputValue = str;
    this.updateControl();
    this.alignCursor();
  }
  /** Typed unmasked value */
  get typedValue() {
    return this.masked.typedValue;
  }
  set typedValue(val) {
    if (this.masked.typedValueEquals(val)) return;
    this.masked.typedValue = val;
    this.updateControl("auto");
  }
  /** Display value */
  get displayValue() {
    return this.masked.displayValue;
  }
  /** Starts listening to element events */
  _bindEvents() {
    this.el.bindEvents({
      selectionChange: this._saveSelection,
      input: this._onInput,
      drop: this._onDrop,
      click: this._onClick,
      focus: this._onFocus,
      commit: this._onChange,
      undo: this._onUndo,
      redo: this._onRedo
    });
  }
  /** Stops listening to element events */
  _unbindEvents() {
    if (this.el) this.el.unbindEvents();
  }
  /** Fires custom event */
  _fireEvent(ev, e) {
    const listeners = this._listeners[ev];
    if (!listeners) return;
    listeners.forEach((l) => l(e));
  }
  /** Current selection start */
  get selectionStart() {
    return this._cursorChanging ? this._changingCursorPos : this.el.selectionStart;
  }
  /** Current cursor position */
  get cursorPos() {
    return this._cursorChanging ? this._changingCursorPos : this.el.selectionEnd;
  }
  set cursorPos(pos) {
    if (!this.el || !this.el.isActive) return;
    this.el.select(pos, pos);
    this._saveSelection();
  }
  /** Stores current selection */
  _saveSelection() {
    if (this.displayValue !== this.el.value) {
      console.warn("Element value was changed outside of mask. Syncronize mask using `mask.updateValue()` to work properly.");
    }
    this._selection = {
      start: this.selectionStart,
      end: this.cursorPos
    };
  }
  /** Syncronizes model value from view */
  updateValue() {
    this.masked.value = this.el.value;
    this._value = this.masked.value;
  }
  /** Syncronizes view from model value, fires change events */
  updateControl(cursorPos) {
    const newUnmaskedValue = this.masked.unmaskedValue;
    const newValue = this.masked.value;
    const newRawInputValue = this.masked.rawInputValue;
    const newDisplayValue = this.displayValue;
    const isChanged = this.unmaskedValue !== newUnmaskedValue || this.value !== newValue || this._rawInputValue !== newRawInputValue;
    this._unmaskedValue = newUnmaskedValue;
    this._value = newValue;
    this._rawInputValue = newRawInputValue;
    if (this.el.value !== newDisplayValue) this.el.value = newDisplayValue;
    if (cursorPos === "auto") this.alignCursor();
    else if (cursorPos != null) this.cursorPos = cursorPos;
    if (isChanged) this._fireChangeEvents();
    if (!this._historyChanging && (isChanged || this.history.isEmpty)) this.history.push({
      unmaskedValue: newUnmaskedValue,
      selection: {
        start: this.selectionStart,
        end: this.cursorPos
      }
    });
  }
  /** Updates options with deep equal check, recreates {@link Masked} model if mask type changes */
  updateOptions(opts) {
    const {
      mask,
      ...restOpts
    } = opts;
    const updateMask = !this.maskEquals(mask);
    const updateOpts = this.masked.optionsIsChanged(restOpts);
    if (updateMask) this.mask = mask;
    if (updateOpts) this.masked.updateOptions(restOpts);
    if (updateMask || updateOpts) this.updateControl();
  }
  /** Updates cursor */
  updateCursor(cursorPos) {
    if (cursorPos == null) return;
    this.cursorPos = cursorPos;
    this._delayUpdateCursor(cursorPos);
  }
  /** Delays cursor update to support mobile browsers */
  _delayUpdateCursor(cursorPos) {
    this._abortUpdateCursor();
    this._changingCursorPos = cursorPos;
    this._cursorChanging = setTimeout(() => {
      if (!this.el) return;
      this.cursorPos = this._changingCursorPos;
      this._abortUpdateCursor();
    }, 10);
  }
  /** Fires custom events */
  _fireChangeEvents() {
    this._fireEvent("accept", this._inputEvent);
    if (this.masked.isComplete) this._fireEvent("complete", this._inputEvent);
  }
  /** Aborts delayed cursor update */
  _abortUpdateCursor() {
    if (this._cursorChanging) {
      clearTimeout(this._cursorChanging);
      delete this._cursorChanging;
    }
  }
  /** Aligns cursor to nearest available position */
  alignCursor() {
    this.cursorPos = this.masked.nearestInputPos(this.masked.nearestInputPos(this.cursorPos, DIRECTION.LEFT));
  }
  /** Aligns cursor only if selection is empty */
  alignCursorFriendly() {
    if (this.selectionStart !== this.cursorPos) return;
    this.alignCursor();
  }
  /** Adds listener on custom event */
  on(ev, handler) {
    if (!this._listeners[ev]) this._listeners[ev] = [];
    this._listeners[ev].push(handler);
    return this;
  }
  /** Removes custom event listener */
  off(ev, handler) {
    if (!this._listeners[ev]) return this;
    if (!handler) {
      delete this._listeners[ev];
      return this;
    }
    const hIndex = this._listeners[ev].indexOf(handler);
    if (hIndex >= 0) this._listeners[ev].splice(hIndex, 1);
    return this;
  }
  /** Handles view input event */
  _onInput(e) {
    this._inputEvent = e;
    this._abortUpdateCursor();
    const details = new ActionDetails({
      // new state
      value: this.el.value,
      cursorPos: this.cursorPos,
      // old state
      oldValue: this.displayValue,
      oldSelection: this._selection
    });
    const oldRawValue = this.masked.rawInputValue;
    const offset = this.masked.splice(details.startChangePos, details.removed.length, details.inserted, details.removeDirection, {
      input: true,
      raw: true
    }).offset;
    const removeDirection = oldRawValue === this.masked.rawInputValue ? details.removeDirection : DIRECTION.NONE;
    let cursorPos = this.masked.nearestInputPos(details.startChangePos + offset, removeDirection);
    if (removeDirection !== DIRECTION.NONE) cursorPos = this.masked.nearestInputPos(cursorPos, DIRECTION.NONE);
    this.updateControl(cursorPos);
    delete this._inputEvent;
  }
  /** Handles view change event and commits model value */
  _onChange() {
    if (this.displayValue !== this.el.value) {
      this.updateValue();
    }
    this.masked.doCommit();
    this.updateControl();
    this._saveSelection();
  }
  /** Handles view drop event, prevents by default */
  _onDrop(ev) {
    ev.preventDefault();
    ev.stopPropagation();
  }
  /** Restore last selection on focus */
  _onFocus(ev) {
    this.alignCursorFriendly();
  }
  /** Restore last selection on focus */
  _onClick(ev) {
    this.alignCursorFriendly();
  }
  _onUndo() {
    this._applyHistoryState(this.history.undo());
  }
  _onRedo() {
    this._applyHistoryState(this.history.redo());
  }
  _applyHistoryState(state) {
    if (!state) return;
    this._historyChanging = true;
    this.unmaskedValue = state.unmaskedValue;
    this.el.select(state.selection.start, state.selection.end);
    this._saveSelection();
    this._historyChanging = false;
  }
  /** Unbind view events and removes element reference */
  destroy() {
    this._unbindEvents();
    this._listeners.length = 0;
    delete this.el;
  }
}
IMask.InputMask = InputMask;
class ChangeDetails {
  /** Inserted symbols */
  /** Additional offset if any changes occurred before tail */
  /** Raw inserted is used by dynamic mask */
  /** Can skip chars */
  static normalize(prep) {
    return Array.isArray(prep) ? prep : [prep, new ChangeDetails()];
  }
  constructor(details) {
    Object.assign(this, {
      inserted: "",
      rawInserted: "",
      tailShift: 0,
      skip: false
    }, details);
  }
  /** Aggregate changes */
  aggregate(details) {
    this.inserted += details.inserted;
    this.rawInserted += details.rawInserted;
    this.tailShift += details.tailShift;
    this.skip = this.skip || details.skip;
    return this;
  }
  /** Total offset considering all changes */
  get offset() {
    return this.tailShift + this.inserted.length;
  }
  get consumed() {
    return Boolean(this.rawInserted) || this.skip;
  }
  equals(details) {
    return this.inserted === details.inserted && this.tailShift === details.tailShift && this.rawInserted === details.rawInserted && this.skip === details.skip;
  }
}
IMask.ChangeDetails = ChangeDetails;
class ContinuousTailDetails {
  /** Tail value as string */
  /** Tail start position */
  /** Start position */
  constructor(value, from, stop) {
    if (value === void 0) {
      value = "";
    }
    if (from === void 0) {
      from = 0;
    }
    this.value = value;
    this.from = from;
    this.stop = stop;
  }
  toString() {
    return this.value;
  }
  extend(tail) {
    this.value += String(tail);
  }
  appendTo(masked) {
    return masked.append(this.toString(), {
      tail: true
    }).aggregate(masked._appendPlaceholder());
  }
  get state() {
    return {
      value: this.value,
      from: this.from,
      stop: this.stop
    };
  }
  set state(state) {
    Object.assign(this, state);
  }
  unshift(beforePos) {
    if (!this.value.length || beforePos != null && this.from >= beforePos) return "";
    const shiftChar = this.value[0];
    this.value = this.value.slice(1);
    return shiftChar;
  }
  shift() {
    if (!this.value.length) return "";
    const shiftChar = this.value[this.value.length - 1];
    this.value = this.value.slice(0, -1);
    return shiftChar;
  }
}
class Masked {
  /** */
  /** */
  /** Transforms value before mask processing */
  /** Transforms each char before mask processing */
  /** Validates if value is acceptable */
  /** Does additional processing at the end of editing */
  /** Format typed value to string */
  /** Parse string to get typed value */
  /** Enable characters overwriting */
  /** */
  /** */
  /** */
  /** */
  constructor(opts) {
    this._value = "";
    this._update({
      ...Masked.DEFAULTS,
      ...opts
    });
    this._initialized = true;
  }
  /** Sets and applies new options */
  updateOptions(opts) {
    if (!this.optionsIsChanged(opts)) return;
    this.withValueRefresh(this._update.bind(this, opts));
  }
  /** Sets new options */
  _update(opts) {
    Object.assign(this, opts);
  }
  /** Mask state */
  get state() {
    return {
      _value: this.value,
      _rawInputValue: this.rawInputValue
    };
  }
  set state(state) {
    this._value = state._value;
  }
  /** Resets value */
  reset() {
    this._value = "";
  }
  get value() {
    return this._value;
  }
  set value(value) {
    this.resolve(value, {
      input: true
    });
  }
  /** Resolve new value */
  resolve(value, flags) {
    if (flags === void 0) {
      flags = {
        input: true
      };
    }
    this.reset();
    this.append(value, flags, "");
    this.doCommit();
  }
  get unmaskedValue() {
    return this.value;
  }
  set unmaskedValue(value) {
    this.resolve(value, {});
  }
  get typedValue() {
    return this.parse ? this.parse(this.value, this) : this.unmaskedValue;
  }
  set typedValue(value) {
    if (this.format) {
      this.value = this.format(value, this);
    } else {
      this.unmaskedValue = String(value);
    }
  }
  /** Value that includes raw user input */
  get rawInputValue() {
    return this.extractInput(0, this.displayValue.length, {
      raw: true
    });
  }
  set rawInputValue(value) {
    this.resolve(value, {
      raw: true
    });
  }
  get displayValue() {
    return this.value;
  }
  get isComplete() {
    return true;
  }
  get isFilled() {
    return this.isComplete;
  }
  /** Finds nearest input position in direction */
  nearestInputPos(cursorPos, direction) {
    return cursorPos;
  }
  totalInputPositions(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    return Math.min(this.displayValue.length, toPos - fromPos);
  }
  /** Extracts value in range considering flags */
  extractInput(fromPos, toPos, flags) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    return this.displayValue.slice(fromPos, toPos);
  }
  /** Extracts tail in range */
  extractTail(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    return new ContinuousTailDetails(this.extractInput(fromPos, toPos), fromPos);
  }
  /** Appends tail */
  appendTail(tail) {
    if (isString(tail)) tail = new ContinuousTailDetails(String(tail));
    return tail.appendTo(this);
  }
  /** Appends char */
  _appendCharRaw(ch, flags) {
    if (!ch) return new ChangeDetails();
    this._value += ch;
    return new ChangeDetails({
      inserted: ch,
      rawInserted: ch
    });
  }
  /** Appends char */
  _appendChar(ch, flags, checkTail) {
    if (flags === void 0) {
      flags = {};
    }
    const consistentState = this.state;
    let details;
    [ch, details] = this.doPrepareChar(ch, flags);
    if (ch) {
      details = details.aggregate(this._appendCharRaw(ch, flags));
      if (!details.rawInserted && this.autofix === "pad") {
        const noFixState = this.state;
        this.state = consistentState;
        let fixDetails = this.pad(flags);
        const chDetails = this._appendCharRaw(ch, flags);
        fixDetails = fixDetails.aggregate(chDetails);
        if (chDetails.rawInserted || fixDetails.equals(details)) {
          details = fixDetails;
        } else {
          this.state = noFixState;
        }
      }
    }
    if (details.inserted) {
      let consistentTail;
      let appended = this.doValidate(flags) !== false;
      if (appended && checkTail != null) {
        const beforeTailState = this.state;
        if (this.overwrite === true) {
          consistentTail = checkTail.state;
          for (let i = 0; i < details.rawInserted.length; ++i) {
            checkTail.unshift(this.displayValue.length - details.tailShift);
          }
        }
        let tailDetails = this.appendTail(checkTail);
        appended = tailDetails.rawInserted.length === checkTail.toString().length;
        if (!(appended && tailDetails.inserted) && this.overwrite === "shift") {
          this.state = beforeTailState;
          consistentTail = checkTail.state;
          for (let i = 0; i < details.rawInserted.length; ++i) {
            checkTail.shift();
          }
          tailDetails = this.appendTail(checkTail);
          appended = tailDetails.rawInserted.length === checkTail.toString().length;
        }
        if (appended && tailDetails.inserted) this.state = beforeTailState;
      }
      if (!appended) {
        details = new ChangeDetails();
        this.state = consistentState;
        if (checkTail && consistentTail) checkTail.state = consistentTail;
      }
    }
    return details;
  }
  /** Appends optional placeholder at the end */
  _appendPlaceholder() {
    return new ChangeDetails();
  }
  /** Appends optional eager placeholder at the end */
  _appendEager() {
    return new ChangeDetails();
  }
  /** Appends symbols considering flags */
  append(str, flags, tail) {
    if (!isString(str)) throw new Error("value should be string");
    const checkTail = isString(tail) ? new ContinuousTailDetails(String(tail)) : tail;
    if (flags != null && flags.tail) flags._beforeTailState = this.state;
    let details;
    [str, details] = this.doPrepare(str, flags);
    for (let ci = 0; ci < str.length; ++ci) {
      const d = this._appendChar(str[ci], flags, checkTail);
      if (!d.rawInserted && !this.doSkipInvalid(str[ci], flags, checkTail)) break;
      details.aggregate(d);
    }
    if ((this.eager === true || this.eager === "append") && flags != null && flags.input && str) {
      details.aggregate(this._appendEager());
    }
    if (checkTail != null) {
      details.tailShift += this.appendTail(checkTail).tailShift;
    }
    return details;
  }
  remove(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    this._value = this.displayValue.slice(0, fromPos) + this.displayValue.slice(toPos);
    return new ChangeDetails();
  }
  /** Calls function and reapplies current value */
  withValueRefresh(fn) {
    if (this._refreshing || !this._initialized) return fn();
    this._refreshing = true;
    const rawInput = this.rawInputValue;
    const value = this.value;
    const ret = fn();
    this.rawInputValue = rawInput;
    if (this.value && this.value !== value && value.indexOf(this.value) === 0) {
      this.append(value.slice(this.displayValue.length), {}, "");
      this.doCommit();
    }
    delete this._refreshing;
    return ret;
  }
  runIsolated(fn) {
    if (this._isolated || !this._initialized) return fn(this);
    this._isolated = true;
    const state = this.state;
    const ret = fn(this);
    this.state = state;
    delete this._isolated;
    return ret;
  }
  doSkipInvalid(ch, flags, checkTail) {
    return Boolean(this.skipInvalid);
  }
  /** Prepares string before mask processing */
  doPrepare(str, flags) {
    if (flags === void 0) {
      flags = {};
    }
    return ChangeDetails.normalize(this.prepare ? this.prepare(str, this, flags) : str);
  }
  /** Prepares each char before mask processing */
  doPrepareChar(str, flags) {
    if (flags === void 0) {
      flags = {};
    }
    return ChangeDetails.normalize(this.prepareChar ? this.prepareChar(str, this, flags) : str);
  }
  /** Validates if value is acceptable */
  doValidate(flags) {
    return (!this.validate || this.validate(this.value, this, flags)) && (!this.parent || this.parent.doValidate(flags));
  }
  /** Does additional processing at the end of editing */
  doCommit() {
    if (this.commit) this.commit(this.value, this);
  }
  splice(start, deleteCount, inserted, removeDirection, flags) {
    if (inserted === void 0) {
      inserted = "";
    }
    if (removeDirection === void 0) {
      removeDirection = DIRECTION.NONE;
    }
    if (flags === void 0) {
      flags = {
        input: true
      };
    }
    const tailPos = start + deleteCount;
    const tail = this.extractTail(tailPos);
    const eagerRemove = this.eager === true || this.eager === "remove";
    let oldRawValue;
    if (eagerRemove) {
      removeDirection = forceDirection(removeDirection);
      oldRawValue = this.extractInput(0, tailPos, {
        raw: true
      });
    }
    let startChangePos = start;
    const details = new ChangeDetails();
    if (removeDirection !== DIRECTION.NONE) {
      startChangePos = this.nearestInputPos(start, deleteCount > 1 && start !== 0 && !eagerRemove ? DIRECTION.NONE : removeDirection);
      details.tailShift = startChangePos - start;
    }
    details.aggregate(this.remove(startChangePos));
    if (eagerRemove && removeDirection !== DIRECTION.NONE && oldRawValue === this.rawInputValue) {
      if (removeDirection === DIRECTION.FORCE_LEFT) {
        let valLength;
        while (oldRawValue === this.rawInputValue && (valLength = this.displayValue.length)) {
          details.aggregate(new ChangeDetails({
            tailShift: -1
          })).aggregate(this.remove(valLength - 1));
        }
      } else if (removeDirection === DIRECTION.FORCE_RIGHT) {
        tail.unshift();
      }
    }
    return details.aggregate(this.append(inserted, flags, tail));
  }
  maskEquals(mask) {
    return this.mask === mask;
  }
  optionsIsChanged(opts) {
    return !objectIncludes(this, opts);
  }
  typedValueEquals(value) {
    const tval = this.typedValue;
    return value === tval || Masked.EMPTY_VALUES.includes(value) && Masked.EMPTY_VALUES.includes(tval) || (this.format ? this.format(value, this) === this.format(this.typedValue, this) : false);
  }
  pad(flags) {
    return new ChangeDetails();
  }
}
Masked.DEFAULTS = {
  skipInvalid: true
};
Masked.EMPTY_VALUES = [void 0, null, ""];
IMask.Masked = Masked;
class ChunksTailDetails {
  /** */
  constructor(chunks, from) {
    if (chunks === void 0) {
      chunks = [];
    }
    if (from === void 0) {
      from = 0;
    }
    this.chunks = chunks;
    this.from = from;
  }
  toString() {
    return this.chunks.map(String).join("");
  }
  extend(tailChunk) {
    if (!String(tailChunk)) return;
    tailChunk = isString(tailChunk) ? new ContinuousTailDetails(String(tailChunk)) : tailChunk;
    const lastChunk = this.chunks[this.chunks.length - 1];
    const extendLast = lastChunk && // if stops are same or tail has no stop
    (lastChunk.stop === tailChunk.stop || tailChunk.stop == null) && // if tail chunk goes just after last chunk
    tailChunk.from === lastChunk.from + lastChunk.toString().length;
    if (tailChunk instanceof ContinuousTailDetails) {
      if (extendLast) {
        lastChunk.extend(tailChunk.toString());
      } else {
        this.chunks.push(tailChunk);
      }
    } else if (tailChunk instanceof ChunksTailDetails) {
      if (tailChunk.stop == null) {
        let firstTailChunk;
        while (tailChunk.chunks.length && tailChunk.chunks[0].stop == null) {
          firstTailChunk = tailChunk.chunks.shift();
          firstTailChunk.from += tailChunk.from;
          this.extend(firstTailChunk);
        }
      }
      if (tailChunk.toString()) {
        tailChunk.stop = tailChunk.blockIndex;
        this.chunks.push(tailChunk);
      }
    }
  }
  appendTo(masked) {
    if (!(masked instanceof IMask.MaskedPattern)) {
      const tail = new ContinuousTailDetails(this.toString());
      return tail.appendTo(masked);
    }
    const details = new ChangeDetails();
    for (let ci = 0; ci < this.chunks.length; ++ci) {
      const chunk = this.chunks[ci];
      const lastBlockIter = masked._mapPosToBlock(masked.displayValue.length);
      const stop = chunk.stop;
      let chunkBlock;
      if (stop != null && // if block not found or stop is behind lastBlock
      (!lastBlockIter || lastBlockIter.index <= stop)) {
        if (chunk instanceof ChunksTailDetails || // for continuous block also check if stop is exist
        masked._stops.indexOf(stop) >= 0) {
          details.aggregate(masked._appendPlaceholder(stop));
        }
        chunkBlock = chunk instanceof ChunksTailDetails && masked._blocks[stop];
      }
      if (chunkBlock) {
        const tailDetails = chunkBlock.appendTail(chunk);
        details.aggregate(tailDetails);
        const remainChars = chunk.toString().slice(tailDetails.rawInserted.length);
        if (remainChars) details.aggregate(masked.append(remainChars, {
          tail: true
        }));
      } else {
        details.aggregate(masked.append(chunk.toString(), {
          tail: true
        }));
      }
    }
    return details;
  }
  get state() {
    return {
      chunks: this.chunks.map((c) => c.state),
      from: this.from,
      stop: this.stop,
      blockIndex: this.blockIndex
    };
  }
  set state(state) {
    const {
      chunks,
      ...props
    } = state;
    Object.assign(this, props);
    this.chunks = chunks.map((cstate) => {
      const chunk = "chunks" in cstate ? new ChunksTailDetails() : new ContinuousTailDetails();
      chunk.state = cstate;
      return chunk;
    });
  }
  unshift(beforePos) {
    if (!this.chunks.length || beforePos != null && this.from >= beforePos) return "";
    const chunkShiftPos = beforePos != null ? beforePos - this.from : beforePos;
    let ci = 0;
    while (ci < this.chunks.length) {
      const chunk = this.chunks[ci];
      const shiftChar = chunk.unshift(chunkShiftPos);
      if (chunk.toString()) {
        if (!shiftChar) break;
        ++ci;
      } else {
        this.chunks.splice(ci, 1);
      }
      if (shiftChar) return shiftChar;
    }
    return "";
  }
  shift() {
    if (!this.chunks.length) return "";
    let ci = this.chunks.length - 1;
    while (0 <= ci) {
      const chunk = this.chunks[ci];
      const shiftChar = chunk.shift();
      if (chunk.toString()) {
        if (!shiftChar) break;
        --ci;
      } else {
        this.chunks.splice(ci, 1);
      }
      if (shiftChar) return shiftChar;
    }
    return "";
  }
}
class PatternCursor {
  constructor(masked, pos) {
    this.masked = masked;
    this._log = [];
    const {
      offset,
      index
    } = masked._mapPosToBlock(pos) || (pos < 0 ? (
      // first
      {
        index: 0,
        offset: 0
      }
    ) : (
      // last
      {
        index: this.masked._blocks.length,
        offset: 0
      }
    ));
    this.offset = offset;
    this.index = index;
    this.ok = false;
  }
  get block() {
    return this.masked._blocks[this.index];
  }
  get pos() {
    return this.masked._blockStartPos(this.index) + this.offset;
  }
  get state() {
    return {
      index: this.index,
      offset: this.offset,
      ok: this.ok
    };
  }
  set state(s) {
    Object.assign(this, s);
  }
  pushState() {
    this._log.push(this.state);
  }
  popState() {
    const s = this._log.pop();
    if (s) this.state = s;
    return s;
  }
  bindBlock() {
    if (this.block) return;
    if (this.index < 0) {
      this.index = 0;
      this.offset = 0;
    }
    if (this.index >= this.masked._blocks.length) {
      this.index = this.masked._blocks.length - 1;
      this.offset = this.block.displayValue.length;
    }
  }
  _pushLeft(fn) {
    this.pushState();
    for (this.bindBlock(); 0 <= this.index; --this.index, this.offset = ((_this$block = this.block) == null ? void 0 : _this$block.displayValue.length) || 0) {
      var _this$block;
      if (fn()) return this.ok = true;
    }
    return this.ok = false;
  }
  _pushRight(fn) {
    this.pushState();
    for (this.bindBlock(); this.index < this.masked._blocks.length; ++this.index, this.offset = 0) {
      if (fn()) return this.ok = true;
    }
    return this.ok = false;
  }
  pushLeftBeforeFilled() {
    return this._pushLeft(() => {
      if (this.block.isFixed || !this.block.value) return;
      this.offset = this.block.nearestInputPos(this.offset, DIRECTION.FORCE_LEFT);
      if (this.offset !== 0) return true;
    });
  }
  pushLeftBeforeInput() {
    return this._pushLeft(() => {
      if (this.block.isFixed) return;
      this.offset = this.block.nearestInputPos(this.offset, DIRECTION.LEFT);
      return true;
    });
  }
  pushLeftBeforeRequired() {
    return this._pushLeft(() => {
      if (this.block.isFixed || this.block.isOptional && !this.block.value) return;
      this.offset = this.block.nearestInputPos(this.offset, DIRECTION.LEFT);
      return true;
    });
  }
  pushRightBeforeFilled() {
    return this._pushRight(() => {
      if (this.block.isFixed || !this.block.value) return;
      this.offset = this.block.nearestInputPos(this.offset, DIRECTION.FORCE_RIGHT);
      if (this.offset !== this.block.value.length) return true;
    });
  }
  pushRightBeforeInput() {
    return this._pushRight(() => {
      if (this.block.isFixed) return;
      this.offset = this.block.nearestInputPos(this.offset, DIRECTION.NONE);
      return true;
    });
  }
  pushRightBeforeRequired() {
    return this._pushRight(() => {
      if (this.block.isFixed || this.block.isOptional && !this.block.value) return;
      this.offset = this.block.nearestInputPos(this.offset, DIRECTION.NONE);
      return true;
    });
  }
}
class PatternFixedDefinition {
  /** */
  /** */
  /** */
  /** */
  /** */
  /** */
  constructor(opts) {
    Object.assign(this, opts);
    this._value = "";
    this.isFixed = true;
  }
  get value() {
    return this._value;
  }
  get unmaskedValue() {
    return this.isUnmasking ? this.value : "";
  }
  get rawInputValue() {
    return this._isRawInput ? this.value : "";
  }
  get displayValue() {
    return this.value;
  }
  reset() {
    this._isRawInput = false;
    this._value = "";
  }
  remove(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this._value.length;
    }
    this._value = this._value.slice(0, fromPos) + this._value.slice(toPos);
    if (!this._value) this._isRawInput = false;
    return new ChangeDetails();
  }
  nearestInputPos(cursorPos, direction) {
    if (direction === void 0) {
      direction = DIRECTION.NONE;
    }
    const minPos = 0;
    const maxPos = this._value.length;
    switch (direction) {
      case DIRECTION.LEFT:
      case DIRECTION.FORCE_LEFT:
        return minPos;
      case DIRECTION.NONE:
      case DIRECTION.RIGHT:
      case DIRECTION.FORCE_RIGHT:
      default:
        return maxPos;
    }
  }
  totalInputPositions(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this._value.length;
    }
    return this._isRawInput ? toPos - fromPos : 0;
  }
  extractInput(fromPos, toPos, flags) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this._value.length;
    }
    if (flags === void 0) {
      flags = {};
    }
    return flags.raw && this._isRawInput && this._value.slice(fromPos, toPos) || "";
  }
  get isComplete() {
    return true;
  }
  get isFilled() {
    return Boolean(this._value);
  }
  _appendChar(ch, flags) {
    if (flags === void 0) {
      flags = {};
    }
    if (this.isFilled) return new ChangeDetails();
    const appendEager = this.eager === true || this.eager === "append";
    const appended = this.char === ch;
    const isResolved = appended && (this.isUnmasking || flags.input || flags.raw) && (!flags.raw || !appendEager) && !flags.tail;
    const details = new ChangeDetails({
      inserted: this.char,
      rawInserted: isResolved ? this.char : ""
    });
    this._value = this.char;
    this._isRawInput = isResolved && (flags.raw || flags.input);
    return details;
  }
  _appendEager() {
    return this._appendChar(this.char, {
      tail: true
    });
  }
  _appendPlaceholder() {
    const details = new ChangeDetails();
    if (this.isFilled) return details;
    this._value = details.inserted = this.char;
    return details;
  }
  extractTail() {
    return new ContinuousTailDetails("");
  }
  appendTail(tail) {
    if (isString(tail)) tail = new ContinuousTailDetails(String(tail));
    return tail.appendTo(this);
  }
  append(str, flags, tail) {
    const details = this._appendChar(str[0], flags);
    if (tail != null) {
      details.tailShift += this.appendTail(tail).tailShift;
    }
    return details;
  }
  doCommit() {
  }
  get state() {
    return {
      _value: this._value,
      _rawInputValue: this.rawInputValue
    };
  }
  set state(state) {
    this._value = state._value;
    this._isRawInput = Boolean(state._rawInputValue);
  }
  pad(flags) {
    return this._appendPlaceholder();
  }
}
class PatternInputDefinition {
  /** */
  /** */
  /** */
  /** */
  /** */
  /** */
  /** */
  /** */
  constructor(opts) {
    const {
      parent,
      isOptional,
      placeholderChar,
      displayChar,
      lazy,
      eager,
      ...maskOpts
    } = opts;
    this.masked = createMask(maskOpts);
    Object.assign(this, {
      parent,
      isOptional,
      placeholderChar,
      displayChar,
      lazy,
      eager
    });
  }
  reset() {
    this.isFilled = false;
    this.masked.reset();
  }
  remove(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.value.length;
    }
    if (fromPos === 0 && toPos >= 1) {
      this.isFilled = false;
      return this.masked.remove(fromPos, toPos);
    }
    return new ChangeDetails();
  }
  get value() {
    return this.masked.value || (this.isFilled && !this.isOptional ? this.placeholderChar : "");
  }
  get unmaskedValue() {
    return this.masked.unmaskedValue;
  }
  get rawInputValue() {
    return this.masked.rawInputValue;
  }
  get displayValue() {
    return this.masked.value && this.displayChar || this.value;
  }
  get isComplete() {
    return Boolean(this.masked.value) || this.isOptional;
  }
  _appendChar(ch, flags) {
    if (flags === void 0) {
      flags = {};
    }
    if (this.isFilled) return new ChangeDetails();
    const state = this.masked.state;
    let details = this.masked._appendChar(ch, this.currentMaskFlags(flags));
    if (details.inserted && this.doValidate(flags) === false) {
      details = new ChangeDetails();
      this.masked.state = state;
    }
    if (!details.inserted && !this.isOptional && !this.lazy && !flags.input) {
      details.inserted = this.placeholderChar;
    }
    details.skip = !details.inserted && !this.isOptional;
    this.isFilled = Boolean(details.inserted);
    return details;
  }
  append(str, flags, tail) {
    return this.masked.append(str, this.currentMaskFlags(flags), tail);
  }
  _appendPlaceholder() {
    if (this.isFilled || this.isOptional) return new ChangeDetails();
    this.isFilled = true;
    return new ChangeDetails({
      inserted: this.placeholderChar
    });
  }
  _appendEager() {
    return new ChangeDetails();
  }
  extractTail(fromPos, toPos) {
    return this.masked.extractTail(fromPos, toPos);
  }
  appendTail(tail) {
    return this.masked.appendTail(tail);
  }
  extractInput(fromPos, toPos, flags) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.value.length;
    }
    return this.masked.extractInput(fromPos, toPos, flags);
  }
  nearestInputPos(cursorPos, direction) {
    if (direction === void 0) {
      direction = DIRECTION.NONE;
    }
    const minPos = 0;
    const maxPos = this.value.length;
    const boundPos = Math.min(Math.max(cursorPos, minPos), maxPos);
    switch (direction) {
      case DIRECTION.LEFT:
      case DIRECTION.FORCE_LEFT:
        return this.isComplete ? boundPos : minPos;
      case DIRECTION.RIGHT:
      case DIRECTION.FORCE_RIGHT:
        return this.isComplete ? boundPos : maxPos;
      case DIRECTION.NONE:
      default:
        return boundPos;
    }
  }
  totalInputPositions(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.value.length;
    }
    return this.value.slice(fromPos, toPos).length;
  }
  doValidate(flags) {
    return this.masked.doValidate(this.currentMaskFlags(flags)) && (!this.parent || this.parent.doValidate(this.currentMaskFlags(flags)));
  }
  doCommit() {
    this.masked.doCommit();
  }
  get state() {
    return {
      _value: this.value,
      _rawInputValue: this.rawInputValue,
      masked: this.masked.state,
      isFilled: this.isFilled
    };
  }
  set state(state) {
    this.masked.state = state.masked;
    this.isFilled = state.isFilled;
  }
  currentMaskFlags(flags) {
    var _flags$_beforeTailSta;
    return {
      ...flags,
      _beforeTailState: (flags == null || (_flags$_beforeTailSta = flags._beforeTailState) == null ? void 0 : _flags$_beforeTailSta.masked) || (flags == null ? void 0 : flags._beforeTailState)
    };
  }
  pad(flags) {
    return new ChangeDetails();
  }
}
PatternInputDefinition.DEFAULT_DEFINITIONS = {
  "0": /\d/,
  "a": /[\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,
  // http://stackoverflow.com/a/22075070
  "*": /./
};
class MaskedRegExp extends Masked {
  /** */
  /** Enable characters overwriting */
  /** */
  /** */
  /** */
  updateOptions(opts) {
    super.updateOptions(opts);
  }
  _update(opts) {
    const mask = opts.mask;
    if (mask) opts.validate = (value) => value.search(mask) >= 0;
    super._update(opts);
  }
}
IMask.MaskedRegExp = MaskedRegExp;
class MaskedPattern extends Masked {
  /** */
  /** */
  /** Single char for empty input */
  /** Single char for filled input */
  /** Show placeholder only when needed */
  /** Enable characters overwriting */
  /** */
  /** */
  /** */
  constructor(opts) {
    super({
      ...MaskedPattern.DEFAULTS,
      ...opts,
      definitions: Object.assign({}, PatternInputDefinition.DEFAULT_DEFINITIONS, opts == null ? void 0 : opts.definitions)
    });
  }
  updateOptions(opts) {
    super.updateOptions(opts);
  }
  _update(opts) {
    opts.definitions = Object.assign({}, this.definitions, opts.definitions);
    super._update(opts);
    this._rebuildMask();
  }
  _rebuildMask() {
    const defs = this.definitions;
    this._blocks = [];
    this.exposeBlock = void 0;
    this._stops = [];
    this._maskedBlocks = {};
    const pattern = this.mask;
    if (!pattern || !defs) return;
    let unmaskingBlock = false;
    let optionalBlock = false;
    for (let i = 0; i < pattern.length; ++i) {
      if (this.blocks) {
        const p = pattern.slice(i);
        const bNames = Object.keys(this.blocks).filter((bName2) => p.indexOf(bName2) === 0);
        bNames.sort((a, b) => b.length - a.length);
        const bName = bNames[0];
        if (bName) {
          const {
            expose,
            repeat,
            ...bOpts
          } = normalizeOpts(this.blocks[bName]);
          const blockOpts = {
            lazy: this.lazy,
            eager: this.eager,
            placeholderChar: this.placeholderChar,
            displayChar: this.displayChar,
            overwrite: this.overwrite,
            autofix: this.autofix,
            ...bOpts,
            repeat,
            parent: this
          };
          const maskedBlock = repeat != null ? new IMask.RepeatBlock(
            blockOpts
            /* TODO */
          ) : createMask(blockOpts);
          if (maskedBlock) {
            this._blocks.push(maskedBlock);
            if (expose) this.exposeBlock = maskedBlock;
            if (!this._maskedBlocks[bName]) this._maskedBlocks[bName] = [];
            this._maskedBlocks[bName].push(this._blocks.length - 1);
          }
          i += bName.length - 1;
          continue;
        }
      }
      let char = pattern[i];
      let isInput = char in defs;
      if (char === MaskedPattern.STOP_CHAR) {
        this._stops.push(this._blocks.length);
        continue;
      }
      if (char === "{" || char === "}") {
        unmaskingBlock = !unmaskingBlock;
        continue;
      }
      if (char === "[" || char === "]") {
        optionalBlock = !optionalBlock;
        continue;
      }
      if (char === MaskedPattern.ESCAPE_CHAR) {
        ++i;
        char = pattern[i];
        if (!char) break;
        isInput = false;
      }
      const def = isInput ? new PatternInputDefinition({
        isOptional: optionalBlock,
        lazy: this.lazy,
        eager: this.eager,
        placeholderChar: this.placeholderChar,
        displayChar: this.displayChar,
        ...normalizeOpts(defs[char]),
        parent: this
      }) : new PatternFixedDefinition({
        char,
        eager: this.eager,
        isUnmasking: unmaskingBlock
      });
      this._blocks.push(def);
    }
  }
  get state() {
    return {
      ...super.state,
      _blocks: this._blocks.map((b) => b.state)
    };
  }
  set state(state) {
    if (!state) {
      this.reset();
      return;
    }
    const {
      _blocks,
      ...maskedState
    } = state;
    this._blocks.forEach((b, bi) => b.state = _blocks[bi]);
    super.state = maskedState;
  }
  reset() {
    super.reset();
    this._blocks.forEach((b) => b.reset());
  }
  get isComplete() {
    return this.exposeBlock ? this.exposeBlock.isComplete : this._blocks.every((b) => b.isComplete);
  }
  get isFilled() {
    return this._blocks.every((b) => b.isFilled);
  }
  get isFixed() {
    return this._blocks.every((b) => b.isFixed);
  }
  get isOptional() {
    return this._blocks.every((b) => b.isOptional);
  }
  doCommit() {
    this._blocks.forEach((b) => b.doCommit());
    super.doCommit();
  }
  get unmaskedValue() {
    return this.exposeBlock ? this.exposeBlock.unmaskedValue : this._blocks.reduce((str, b) => str += b.unmaskedValue, "");
  }
  set unmaskedValue(unmaskedValue) {
    if (this.exposeBlock) {
      const tail = this.extractTail(this._blockStartPos(this._blocks.indexOf(this.exposeBlock)) + this.exposeBlock.displayValue.length);
      this.exposeBlock.unmaskedValue = unmaskedValue;
      this.appendTail(tail);
      this.doCommit();
    } else super.unmaskedValue = unmaskedValue;
  }
  get value() {
    return this.exposeBlock ? this.exposeBlock.value : (
      // TODO return _value when not in change?
      this._blocks.reduce((str, b) => str += b.value, "")
    );
  }
  set value(value) {
    if (this.exposeBlock) {
      const tail = this.extractTail(this._blockStartPos(this._blocks.indexOf(this.exposeBlock)) + this.exposeBlock.displayValue.length);
      this.exposeBlock.value = value;
      this.appendTail(tail);
      this.doCommit();
    } else super.value = value;
  }
  get typedValue() {
    return this.exposeBlock ? this.exposeBlock.typedValue : super.typedValue;
  }
  set typedValue(value) {
    if (this.exposeBlock) {
      const tail = this.extractTail(this._blockStartPos(this._blocks.indexOf(this.exposeBlock)) + this.exposeBlock.displayValue.length);
      this.exposeBlock.typedValue = value;
      this.appendTail(tail);
      this.doCommit();
    } else super.typedValue = value;
  }
  get displayValue() {
    return this._blocks.reduce((str, b) => str += b.displayValue, "");
  }
  appendTail(tail) {
    return super.appendTail(tail).aggregate(this._appendPlaceholder());
  }
  _appendEager() {
    var _this$_mapPosToBlock;
    const details = new ChangeDetails();
    let startBlockIndex = (_this$_mapPosToBlock = this._mapPosToBlock(this.displayValue.length)) == null ? void 0 : _this$_mapPosToBlock.index;
    if (startBlockIndex == null) return details;
    if (this._blocks[startBlockIndex].isFilled) ++startBlockIndex;
    for (let bi = startBlockIndex; bi < this._blocks.length; ++bi) {
      const d = this._blocks[bi]._appendEager();
      if (!d.inserted) break;
      details.aggregate(d);
    }
    return details;
  }
  _appendCharRaw(ch, flags) {
    if (flags === void 0) {
      flags = {};
    }
    const blockIter = this._mapPosToBlock(this.displayValue.length);
    const details = new ChangeDetails();
    if (!blockIter) return details;
    for (let bi = blockIter.index, block; block = this._blocks[bi]; ++bi) {
      var _flags$_beforeTailSta;
      const blockDetails = block._appendChar(ch, {
        ...flags,
        _beforeTailState: (_flags$_beforeTailSta = flags._beforeTailState) == null || (_flags$_beforeTailSta = _flags$_beforeTailSta._blocks) == null ? void 0 : _flags$_beforeTailSta[bi]
      });
      details.aggregate(blockDetails);
      if (blockDetails.consumed) break;
    }
    return details;
  }
  extractTail(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    const chunkTail = new ChunksTailDetails();
    if (fromPos === toPos) return chunkTail;
    this._forEachBlocksInRange(fromPos, toPos, (b, bi, bFromPos, bToPos) => {
      const blockChunk = b.extractTail(bFromPos, bToPos);
      blockChunk.stop = this._findStopBefore(bi);
      blockChunk.from = this._blockStartPos(bi);
      if (blockChunk instanceof ChunksTailDetails) blockChunk.blockIndex = bi;
      chunkTail.extend(blockChunk);
    });
    return chunkTail;
  }
  extractInput(fromPos, toPos, flags) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    if (flags === void 0) {
      flags = {};
    }
    if (fromPos === toPos) return "";
    let input = "";
    this._forEachBlocksInRange(fromPos, toPos, (b, _, fromPos2, toPos2) => {
      input += b.extractInput(fromPos2, toPos2, flags);
    });
    return input;
  }
  _findStopBefore(blockIndex) {
    let stopBefore;
    for (let si = 0; si < this._stops.length; ++si) {
      const stop = this._stops[si];
      if (stop <= blockIndex) stopBefore = stop;
      else break;
    }
    return stopBefore;
  }
  /** Appends placeholder depending on laziness */
  _appendPlaceholder(toBlockIndex) {
    const details = new ChangeDetails();
    if (this.lazy && toBlockIndex == null) return details;
    const startBlockIter = this._mapPosToBlock(this.displayValue.length);
    if (!startBlockIter) return details;
    const startBlockIndex = startBlockIter.index;
    const endBlockIndex = toBlockIndex != null ? toBlockIndex : this._blocks.length;
    this._blocks.slice(startBlockIndex, endBlockIndex).forEach((b) => {
      if (!b.lazy || toBlockIndex != null) {
        var _blocks2;
        details.aggregate(b._appendPlaceholder((_blocks2 = b._blocks) == null ? void 0 : _blocks2.length));
      }
    });
    return details;
  }
  /** Finds block in pos */
  _mapPosToBlock(pos) {
    let accVal = "";
    for (let bi = 0; bi < this._blocks.length; ++bi) {
      const block = this._blocks[bi];
      const blockStartPos = accVal.length;
      accVal += block.displayValue;
      if (pos <= accVal.length) {
        return {
          index: bi,
          offset: pos - blockStartPos
        };
      }
    }
  }
  _blockStartPos(blockIndex) {
    return this._blocks.slice(0, blockIndex).reduce((pos, b) => pos += b.displayValue.length, 0);
  }
  _forEachBlocksInRange(fromPos, toPos, fn) {
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    const fromBlockIter = this._mapPosToBlock(fromPos);
    if (fromBlockIter) {
      const toBlockIter = this._mapPosToBlock(toPos);
      const isSameBlock = toBlockIter && fromBlockIter.index === toBlockIter.index;
      const fromBlockStartPos = fromBlockIter.offset;
      const fromBlockEndPos = toBlockIter && isSameBlock ? toBlockIter.offset : this._blocks[fromBlockIter.index].displayValue.length;
      fn(this._blocks[fromBlockIter.index], fromBlockIter.index, fromBlockStartPos, fromBlockEndPos);
      if (toBlockIter && !isSameBlock) {
        for (let bi = fromBlockIter.index + 1; bi < toBlockIter.index; ++bi) {
          fn(this._blocks[bi], bi, 0, this._blocks[bi].displayValue.length);
        }
        fn(this._blocks[toBlockIter.index], toBlockIter.index, 0, toBlockIter.offset);
      }
    }
  }
  remove(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    const removeDetails = super.remove(fromPos, toPos);
    this._forEachBlocksInRange(fromPos, toPos, (b, _, bFromPos, bToPos) => {
      removeDetails.aggregate(b.remove(bFromPos, bToPos));
    });
    return removeDetails;
  }
  nearestInputPos(cursorPos, direction) {
    if (direction === void 0) {
      direction = DIRECTION.NONE;
    }
    if (!this._blocks.length) return 0;
    const cursor = new PatternCursor(this, cursorPos);
    if (direction === DIRECTION.NONE) {
      if (cursor.pushRightBeforeInput()) return cursor.pos;
      cursor.popState();
      if (cursor.pushLeftBeforeInput()) return cursor.pos;
      return this.displayValue.length;
    }
    if (direction === DIRECTION.LEFT || direction === DIRECTION.FORCE_LEFT) {
      if (direction === DIRECTION.LEFT) {
        cursor.pushRightBeforeFilled();
        if (cursor.ok && cursor.pos === cursorPos) return cursorPos;
        cursor.popState();
      }
      cursor.pushLeftBeforeInput();
      cursor.pushLeftBeforeRequired();
      cursor.pushLeftBeforeFilled();
      if (direction === DIRECTION.LEFT) {
        cursor.pushRightBeforeInput();
        cursor.pushRightBeforeRequired();
        if (cursor.ok && cursor.pos <= cursorPos) return cursor.pos;
        cursor.popState();
        if (cursor.ok && cursor.pos <= cursorPos) return cursor.pos;
        cursor.popState();
      }
      if (cursor.ok) return cursor.pos;
      if (direction === DIRECTION.FORCE_LEFT) return 0;
      cursor.popState();
      if (cursor.ok) return cursor.pos;
      cursor.popState();
      if (cursor.ok) return cursor.pos;
      return 0;
    }
    if (direction === DIRECTION.RIGHT || direction === DIRECTION.FORCE_RIGHT) {
      cursor.pushRightBeforeInput();
      cursor.pushRightBeforeRequired();
      if (cursor.pushRightBeforeFilled()) return cursor.pos;
      if (direction === DIRECTION.FORCE_RIGHT) return this.displayValue.length;
      cursor.popState();
      if (cursor.ok) return cursor.pos;
      cursor.popState();
      if (cursor.ok) return cursor.pos;
      return this.nearestInputPos(cursorPos, DIRECTION.LEFT);
    }
    return cursorPos;
  }
  totalInputPositions(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    let total = 0;
    this._forEachBlocksInRange(fromPos, toPos, (b, _, bFromPos, bToPos) => {
      total += b.totalInputPositions(bFromPos, bToPos);
    });
    return total;
  }
  /** Get block by name */
  maskedBlock(name) {
    return this.maskedBlocks(name)[0];
  }
  /** Get all blocks by name */
  maskedBlocks(name) {
    const indices = this._maskedBlocks[name];
    if (!indices) return [];
    return indices.map((gi) => this._blocks[gi]);
  }
  pad(flags) {
    const details = new ChangeDetails();
    this._forEachBlocksInRange(0, this.displayValue.length, (b) => details.aggregate(b.pad(flags)));
    return details;
  }
}
MaskedPattern.DEFAULTS = {
  ...Masked.DEFAULTS,
  lazy: true,
  placeholderChar: "_"
};
MaskedPattern.STOP_CHAR = "`";
MaskedPattern.ESCAPE_CHAR = "\\";
MaskedPattern.InputDefinition = PatternInputDefinition;
MaskedPattern.FixedDefinition = PatternFixedDefinition;
IMask.MaskedPattern = MaskedPattern;
class MaskedRange extends MaskedPattern {
  /**
    Optionally sets max length of pattern.
    Used when pattern length is longer then `to` param length. Pads zeros at start in this case.
  */
  /** Min bound */
  /** Max bound */
  get _matchFrom() {
    return this.maxLength - String(this.from).length;
  }
  constructor(opts) {
    super(opts);
  }
  updateOptions(opts) {
    super.updateOptions(opts);
  }
  _update(opts) {
    const {
      to = this.to || 0,
      from = this.from || 0,
      maxLength = this.maxLength || 0,
      autofix = this.autofix,
      ...patternOpts
    } = opts;
    this.to = to;
    this.from = from;
    this.maxLength = Math.max(String(to).length, maxLength);
    this.autofix = autofix;
    const fromStr = String(this.from).padStart(this.maxLength, "0");
    const toStr = String(this.to).padStart(this.maxLength, "0");
    let sameCharsCount = 0;
    while (sameCharsCount < toStr.length && toStr[sameCharsCount] === fromStr[sameCharsCount]) ++sameCharsCount;
    patternOpts.mask = toStr.slice(0, sameCharsCount).replace(/0/g, "\\0") + "0".repeat(this.maxLength - sameCharsCount);
    super._update(patternOpts);
  }
  get isComplete() {
    return super.isComplete && Boolean(this.value);
  }
  boundaries(str) {
    let minstr = "";
    let maxstr = "";
    const [, placeholder, num] = str.match(/^(\D*)(\d*)(\D*)/) || [];
    if (num) {
      minstr = "0".repeat(placeholder.length) + num;
      maxstr = "9".repeat(placeholder.length) + num;
    }
    minstr = minstr.padEnd(this.maxLength, "0");
    maxstr = maxstr.padEnd(this.maxLength, "9");
    return [minstr, maxstr];
  }
  doPrepareChar(ch, flags) {
    if (flags === void 0) {
      flags = {};
    }
    let details;
    [ch, details] = super.doPrepareChar(ch.replace(/\D/g, ""), flags);
    if (!ch) details.skip = !this.isComplete;
    return [ch, details];
  }
  _appendCharRaw(ch, flags) {
    if (flags === void 0) {
      flags = {};
    }
    if (!this.autofix || this.value.length + 1 > this.maxLength) return super._appendCharRaw(ch, flags);
    const fromStr = String(this.from).padStart(this.maxLength, "0");
    const toStr = String(this.to).padStart(this.maxLength, "0");
    const [minstr, maxstr] = this.boundaries(this.value + ch);
    if (Number(maxstr) < this.from) return super._appendCharRaw(fromStr[this.value.length], flags);
    if (Number(minstr) > this.to) {
      if (!flags.tail && this.autofix === "pad" && this.value.length + 1 < this.maxLength) {
        return super._appendCharRaw(fromStr[this.value.length], flags).aggregate(this._appendCharRaw(ch, flags));
      }
      return super._appendCharRaw(toStr[this.value.length], flags);
    }
    return super._appendCharRaw(ch, flags);
  }
  doValidate(flags) {
    const str = this.value;
    const firstNonZero = str.search(/[^0]/);
    if (firstNonZero === -1 && str.length <= this._matchFrom) return true;
    const [minstr, maxstr] = this.boundaries(str);
    return this.from <= Number(maxstr) && Number(minstr) <= this.to && super.doValidate(flags);
  }
  pad(flags) {
    const details = new ChangeDetails();
    if (this.value.length === this.maxLength) return details;
    const value = this.value;
    const padLength = this.maxLength - this.value.length;
    if (padLength) {
      this.reset();
      for (let i = 0; i < padLength; ++i) {
        details.aggregate(super._appendCharRaw("0", flags));
      }
      value.split("").forEach((ch) => this._appendCharRaw(ch));
    }
    return details;
  }
}
IMask.MaskedRange = MaskedRange;
class MaskedDate extends MaskedPattern {
  static extractPatternOptions(opts) {
    const {
      mask,
      pattern,
      ...patternOpts
    } = opts;
    return {
      ...patternOpts,
      mask: isString(mask) ? mask : pattern
    };
  }
  /** Pattern mask for date according to {@link MaskedDate#format} */
  /** Start date */
  /** End date */
  /** Format typed value to string */
  /** Parse string to get typed value */
  constructor(opts) {
    super(MaskedDate.extractPatternOptions({
      ...MaskedDate.DEFAULTS,
      ...opts
    }));
  }
  updateOptions(opts) {
    super.updateOptions(opts);
  }
  _update(opts) {
    const {
      mask,
      pattern,
      blocks,
      ...patternOpts
    } = {
      ...MaskedDate.DEFAULTS,
      ...opts
    };
    const patternBlocks = Object.assign({}, MaskedDate.GET_DEFAULT_BLOCKS());
    if (opts.min) patternBlocks.Y.from = opts.min.getFullYear();
    if (opts.max) patternBlocks.Y.to = opts.max.getFullYear();
    if (opts.min && opts.max && patternBlocks.Y.from === patternBlocks.Y.to) {
      patternBlocks.m.from = opts.min.getMonth() + 1;
      patternBlocks.m.to = opts.max.getMonth() + 1;
      if (patternBlocks.m.from === patternBlocks.m.to) {
        patternBlocks.d.from = opts.min.getDate();
        patternBlocks.d.to = opts.max.getDate();
      }
    }
    Object.assign(patternBlocks, this.blocks, blocks);
    super._update({
      ...patternOpts,
      mask: isString(mask) ? mask : pattern,
      blocks: patternBlocks
    });
  }
  doValidate(flags) {
    const date = this.date;
    return super.doValidate(flags) && (!this.isComplete || this.isDateExist(this.value) && date != null && (this.min == null || this.min <= date) && (this.max == null || date <= this.max));
  }
  /** Checks if date is exists */
  isDateExist(str) {
    return this.format(this.parse(str, this), this).indexOf(str) >= 0;
  }
  /** Parsed Date */
  get date() {
    return this.typedValue;
  }
  set date(date) {
    this.typedValue = date;
  }
  get typedValue() {
    return this.isComplete ? super.typedValue : null;
  }
  set typedValue(value) {
    super.typedValue = value;
  }
  maskEquals(mask) {
    return mask === Date || super.maskEquals(mask);
  }
  optionsIsChanged(opts) {
    return super.optionsIsChanged(MaskedDate.extractPatternOptions(opts));
  }
}
MaskedDate.GET_DEFAULT_BLOCKS = () => ({
  d: {
    mask: MaskedRange,
    from: 1,
    to: 31,
    maxLength: 2
  },
  m: {
    mask: MaskedRange,
    from: 1,
    to: 12,
    maxLength: 2
  },
  Y: {
    mask: MaskedRange,
    from: 1900,
    to: 9999
  }
});
MaskedDate.DEFAULTS = {
  ...MaskedPattern.DEFAULTS,
  mask: Date,
  pattern: "d{.}`m{.}`Y",
  format: (date, masked) => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return [day, month, year].join(".");
  },
  parse: (str, masked) => {
    const [day, month, year] = str.split(".").map(Number);
    return new Date(year, month - 1, day);
  }
};
IMask.MaskedDate = MaskedDate;
class MaskedDynamic extends Masked {
  constructor(opts) {
    super({
      ...MaskedDynamic.DEFAULTS,
      ...opts
    });
    this.currentMask = void 0;
  }
  updateOptions(opts) {
    super.updateOptions(opts);
  }
  _update(opts) {
    super._update(opts);
    if ("mask" in opts) {
      this.exposeMask = void 0;
      this.compiledMasks = Array.isArray(opts.mask) ? opts.mask.map((m) => {
        const {
          expose,
          ...maskOpts
        } = normalizeOpts(m);
        const masked = createMask({
          overwrite: this._overwrite,
          eager: this._eager,
          skipInvalid: this._skipInvalid,
          ...maskOpts
        });
        if (expose) this.exposeMask = masked;
        return masked;
      }) : [];
    }
  }
  _appendCharRaw(ch, flags) {
    if (flags === void 0) {
      flags = {};
    }
    const details = this._applyDispatch(ch, flags);
    if (this.currentMask) {
      details.aggregate(this.currentMask._appendChar(ch, this.currentMaskFlags(flags)));
    }
    return details;
  }
  _applyDispatch(appended, flags, tail) {
    if (appended === void 0) {
      appended = "";
    }
    if (flags === void 0) {
      flags = {};
    }
    if (tail === void 0) {
      tail = "";
    }
    const prevValueBeforeTail = flags.tail && flags._beforeTailState != null ? flags._beforeTailState._value : this.value;
    const inputValue = this.rawInputValue;
    const insertValue = flags.tail && flags._beforeTailState != null ? flags._beforeTailState._rawInputValue : inputValue;
    const tailValue = inputValue.slice(insertValue.length);
    const prevMask = this.currentMask;
    const details = new ChangeDetails();
    const prevMaskState = prevMask == null ? void 0 : prevMask.state;
    this.currentMask = this.doDispatch(appended, {
      ...flags
    }, tail);
    if (this.currentMask) {
      if (this.currentMask !== prevMask) {
        this.currentMask.reset();
        if (insertValue) {
          this.currentMask.append(insertValue, {
            raw: true
          });
          details.tailShift = this.currentMask.value.length - prevValueBeforeTail.length;
        }
        if (tailValue) {
          details.tailShift += this.currentMask.append(tailValue, {
            raw: true,
            tail: true
          }).tailShift;
        }
      } else if (prevMaskState) {
        this.currentMask.state = prevMaskState;
      }
    }
    return details;
  }
  _appendPlaceholder() {
    const details = this._applyDispatch();
    if (this.currentMask) {
      details.aggregate(this.currentMask._appendPlaceholder());
    }
    return details;
  }
  _appendEager() {
    const details = this._applyDispatch();
    if (this.currentMask) {
      details.aggregate(this.currentMask._appendEager());
    }
    return details;
  }
  appendTail(tail) {
    const details = new ChangeDetails();
    if (tail) details.aggregate(this._applyDispatch("", {}, tail));
    return details.aggregate(this.currentMask ? this.currentMask.appendTail(tail) : super.appendTail(tail));
  }
  currentMaskFlags(flags) {
    var _flags$_beforeTailSta, _flags$_beforeTailSta2;
    return {
      ...flags,
      _beforeTailState: ((_flags$_beforeTailSta = flags._beforeTailState) == null ? void 0 : _flags$_beforeTailSta.currentMaskRef) === this.currentMask && ((_flags$_beforeTailSta2 = flags._beforeTailState) == null ? void 0 : _flags$_beforeTailSta2.currentMask) || flags._beforeTailState
    };
  }
  doDispatch(appended, flags, tail) {
    if (flags === void 0) {
      flags = {};
    }
    if (tail === void 0) {
      tail = "";
    }
    return this.dispatch(appended, this, flags, tail);
  }
  doValidate(flags) {
    return super.doValidate(flags) && (!this.currentMask || this.currentMask.doValidate(this.currentMaskFlags(flags)));
  }
  doPrepare(str, flags) {
    if (flags === void 0) {
      flags = {};
    }
    let [s, details] = super.doPrepare(str, flags);
    if (this.currentMask) {
      let currentDetails;
      [s, currentDetails] = super.doPrepare(s, this.currentMaskFlags(flags));
      details = details.aggregate(currentDetails);
    }
    return [s, details];
  }
  doPrepareChar(str, flags) {
    if (flags === void 0) {
      flags = {};
    }
    let [s, details] = super.doPrepareChar(str, flags);
    if (this.currentMask) {
      let currentDetails;
      [s, currentDetails] = super.doPrepareChar(s, this.currentMaskFlags(flags));
      details = details.aggregate(currentDetails);
    }
    return [s, details];
  }
  reset() {
    var _this$currentMask;
    (_this$currentMask = this.currentMask) == null || _this$currentMask.reset();
    this.compiledMasks.forEach((m) => m.reset());
  }
  get value() {
    return this.exposeMask ? this.exposeMask.value : this.currentMask ? this.currentMask.value : "";
  }
  set value(value) {
    if (this.exposeMask) {
      this.exposeMask.value = value;
      this.currentMask = this.exposeMask;
      this._applyDispatch();
    } else super.value = value;
  }
  get unmaskedValue() {
    return this.exposeMask ? this.exposeMask.unmaskedValue : this.currentMask ? this.currentMask.unmaskedValue : "";
  }
  set unmaskedValue(unmaskedValue) {
    if (this.exposeMask) {
      this.exposeMask.unmaskedValue = unmaskedValue;
      this.currentMask = this.exposeMask;
      this._applyDispatch();
    } else super.unmaskedValue = unmaskedValue;
  }
  get typedValue() {
    return this.exposeMask ? this.exposeMask.typedValue : this.currentMask ? this.currentMask.typedValue : "";
  }
  set typedValue(typedValue) {
    if (this.exposeMask) {
      this.exposeMask.typedValue = typedValue;
      this.currentMask = this.exposeMask;
      this._applyDispatch();
      return;
    }
    let unmaskedValue = String(typedValue);
    if (this.currentMask) {
      this.currentMask.typedValue = typedValue;
      unmaskedValue = this.currentMask.unmaskedValue;
    }
    this.unmaskedValue = unmaskedValue;
  }
  get displayValue() {
    return this.currentMask ? this.currentMask.displayValue : "";
  }
  get isComplete() {
    var _this$currentMask2;
    return Boolean((_this$currentMask2 = this.currentMask) == null ? void 0 : _this$currentMask2.isComplete);
  }
  get isFilled() {
    var _this$currentMask3;
    return Boolean((_this$currentMask3 = this.currentMask) == null ? void 0 : _this$currentMask3.isFilled);
  }
  remove(fromPos, toPos) {
    const details = new ChangeDetails();
    if (this.currentMask) {
      details.aggregate(this.currentMask.remove(fromPos, toPos)).aggregate(this._applyDispatch());
    }
    return details;
  }
  get state() {
    var _this$currentMask4;
    return {
      ...super.state,
      _rawInputValue: this.rawInputValue,
      compiledMasks: this.compiledMasks.map((m) => m.state),
      currentMaskRef: this.currentMask,
      currentMask: (_this$currentMask4 = this.currentMask) == null ? void 0 : _this$currentMask4.state
    };
  }
  set state(state) {
    const {
      compiledMasks,
      currentMaskRef,
      currentMask,
      ...maskedState
    } = state;
    if (compiledMasks) this.compiledMasks.forEach((m, mi) => m.state = compiledMasks[mi]);
    if (currentMaskRef != null) {
      this.currentMask = currentMaskRef;
      this.currentMask.state = currentMask;
    }
    super.state = maskedState;
  }
  extractInput(fromPos, toPos, flags) {
    return this.currentMask ? this.currentMask.extractInput(fromPos, toPos, flags) : "";
  }
  extractTail(fromPos, toPos) {
    return this.currentMask ? this.currentMask.extractTail(fromPos, toPos) : super.extractTail(fromPos, toPos);
  }
  doCommit() {
    if (this.currentMask) this.currentMask.doCommit();
    super.doCommit();
  }
  nearestInputPos(cursorPos, direction) {
    return this.currentMask ? this.currentMask.nearestInputPos(cursorPos, direction) : super.nearestInputPos(cursorPos, direction);
  }
  get overwrite() {
    return this.currentMask ? this.currentMask.overwrite : this._overwrite;
  }
  set overwrite(overwrite) {
    this._overwrite = overwrite;
  }
  get eager() {
    return this.currentMask ? this.currentMask.eager : this._eager;
  }
  set eager(eager) {
    this._eager = eager;
  }
  get skipInvalid() {
    return this.currentMask ? this.currentMask.skipInvalid : this._skipInvalid;
  }
  set skipInvalid(skipInvalid) {
    this._skipInvalid = skipInvalid;
  }
  get autofix() {
    return this.currentMask ? this.currentMask.autofix : this._autofix;
  }
  set autofix(autofix) {
    this._autofix = autofix;
  }
  maskEquals(mask) {
    return Array.isArray(mask) ? this.compiledMasks.every((m, mi) => {
      if (!mask[mi]) return;
      const {
        mask: oldMask,
        ...restOpts
      } = mask[mi];
      return objectIncludes(m, restOpts) && m.maskEquals(oldMask);
    }) : super.maskEquals(mask);
  }
  typedValueEquals(value) {
    var _this$currentMask5;
    return Boolean((_this$currentMask5 = this.currentMask) == null ? void 0 : _this$currentMask5.typedValueEquals(value));
  }
}
MaskedDynamic.DEFAULTS = {
  ...Masked.DEFAULTS,
  dispatch: (appended, masked, flags, tail) => {
    if (!masked.compiledMasks.length) return;
    const inputValue = masked.rawInputValue;
    const inputs = masked.compiledMasks.map((m, index) => {
      const isCurrent = masked.currentMask === m;
      const startInputPos = isCurrent ? m.displayValue.length : m.nearestInputPos(m.displayValue.length, DIRECTION.FORCE_LEFT);
      if (m.rawInputValue !== inputValue) {
        m.reset();
        m.append(inputValue, {
          raw: true
        });
      } else if (!isCurrent) {
        m.remove(startInputPos);
      }
      m.append(appended, masked.currentMaskFlags(flags));
      m.appendTail(tail);
      return {
        index,
        weight: m.rawInputValue.length,
        totalInputPositions: m.totalInputPositions(0, Math.max(startInputPos, m.nearestInputPos(m.displayValue.length, DIRECTION.FORCE_LEFT)))
      };
    });
    inputs.sort((i1, i2) => i2.weight - i1.weight || i2.totalInputPositions - i1.totalInputPositions);
    return masked.compiledMasks[inputs[0].index];
  }
};
IMask.MaskedDynamic = MaskedDynamic;
class MaskedEnum extends MaskedPattern {
  constructor(opts) {
    super({
      ...MaskedEnum.DEFAULTS,
      ...opts
    });
  }
  updateOptions(opts) {
    super.updateOptions(opts);
  }
  _update(opts) {
    const {
      enum: enum_,
      ...eopts
    } = opts;
    if (enum_) {
      const lengths = enum_.map((e) => e.length);
      const requiredLength = Math.min(...lengths);
      const optionalLength = Math.max(...lengths) - requiredLength;
      eopts.mask = "*".repeat(requiredLength);
      if (optionalLength) eopts.mask += "[" + "*".repeat(optionalLength) + "]";
      this.enum = enum_;
    }
    super._update(eopts);
  }
  _appendCharRaw(ch, flags) {
    if (flags === void 0) {
      flags = {};
    }
    const matchFrom = Math.min(this.nearestInputPos(0, DIRECTION.FORCE_RIGHT), this.value.length);
    const matches = this.enum.filter((e) => this.matchValue(e, this.unmaskedValue + ch, matchFrom));
    if (matches.length) {
      if (matches.length === 1) {
        this._forEachBlocksInRange(0, this.value.length, (b, bi) => {
          const mch = matches[0][bi];
          if (bi >= this.value.length || mch === b.value) return;
          b.reset();
          b._appendChar(mch, flags);
        });
      }
      const d = super._appendCharRaw(matches[0][this.value.length], flags);
      if (matches.length === 1) {
        matches[0].slice(this.unmaskedValue.length).split("").forEach((mch) => d.aggregate(super._appendCharRaw(mch)));
      }
      return d;
    }
    return new ChangeDetails();
  }
  extractTail(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    return new ContinuousTailDetails("", fromPos);
  }
  remove(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    if (fromPos === toPos) return new ChangeDetails();
    const matchFrom = Math.min(super.nearestInputPos(0, DIRECTION.FORCE_RIGHT), this.value.length);
    let pos;
    for (pos = fromPos; pos >= 0; --pos) {
      const matches = this.enum.filter((e) => this.matchValue(e, this.value.slice(matchFrom, pos), matchFrom));
      if (matches.length > 1) break;
    }
    const details = super.remove(pos, toPos);
    details.tailShift += pos - fromPos;
    return details;
  }
}
MaskedEnum.DEFAULTS = {
  ...MaskedPattern.DEFAULTS,
  matchValue: (estr, istr, matchFrom) => estr.indexOf(istr, matchFrom) === matchFrom
};
IMask.MaskedEnum = MaskedEnum;
class MaskedFunction extends Masked {
  /** */
  /** Enable characters overwriting */
  /** */
  /** */
  /** */
  updateOptions(opts) {
    super.updateOptions(opts);
  }
  _update(opts) {
    super._update({
      ...opts,
      validate: opts.mask
    });
  }
}
IMask.MaskedFunction = MaskedFunction;
var _MaskedNumber;
class MaskedNumber extends Masked {
  /** Single char */
  /** Single char */
  /** Array of single chars */
  /** */
  /** */
  /** Digits after point */
  /** Flag to remove leading and trailing zeros in the end of editing */
  /** Flag to pad trailing zeros after point in the end of editing */
  /** Enable characters overwriting */
  /** */
  /** */
  /** */
  /** Format typed value to string */
  /** Parse string to get typed value */
  constructor(opts) {
    super({
      ...MaskedNumber.DEFAULTS,
      ...opts
    });
  }
  updateOptions(opts) {
    super.updateOptions(opts);
  }
  _update(opts) {
    super._update(opts);
    this._updateRegExps();
  }
  _updateRegExps() {
    const start = "^" + (this.allowNegative ? "[+|\\-]?" : "");
    const mid = "\\d*";
    const end = (this.scale ? "(" + escapeRegExp(this.radix) + "\\d{0," + this.scale + "})?" : "") + "$";
    this._numberRegExp = new RegExp(start + mid + end);
    this._mapToRadixRegExp = new RegExp("[" + this.mapToRadix.map(escapeRegExp).join("") + "]", "g");
    this._thousandsSeparatorRegExp = new RegExp(escapeRegExp(this.thousandsSeparator), "g");
  }
  _removeThousandsSeparators(value) {
    return value.replace(this._thousandsSeparatorRegExp, "");
  }
  _insertThousandsSeparators(value) {
    const parts = value.split(this.radix);
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, this.thousandsSeparator);
    return parts.join(this.radix);
  }
  doPrepareChar(ch, flags) {
    if (flags === void 0) {
      flags = {};
    }
    const [prepCh, details] = super.doPrepareChar(this._removeThousandsSeparators(this.scale && this.mapToRadix.length && /*
      radix should be mapped when
      1) input is done from keyboard = flags.input && flags.raw
      2) unmasked value is set = !flags.input && !flags.raw
      and should not be mapped when
      1) value is set = flags.input && !flags.raw
      2) raw value is set = !flags.input && flags.raw
    */
    (flags.input && flags.raw || !flags.input && !flags.raw) ? ch.replace(this._mapToRadixRegExp, this.radix) : ch), flags);
    if (ch && !prepCh) details.skip = true;
    if (prepCh && !this.allowPositive && !this.value && prepCh !== "-") details.aggregate(this._appendChar("-"));
    return [prepCh, details];
  }
  _separatorsCount(to, extendOnSeparators) {
    if (extendOnSeparators === void 0) {
      extendOnSeparators = false;
    }
    let count = 0;
    for (let pos = 0; pos < to; ++pos) {
      if (this._value.indexOf(this.thousandsSeparator, pos) === pos) {
        ++count;
        if (extendOnSeparators) to += this.thousandsSeparator.length;
      }
    }
    return count;
  }
  _separatorsCountFromSlice(slice) {
    if (slice === void 0) {
      slice = this._value;
    }
    return this._separatorsCount(this._removeThousandsSeparators(slice).length, true);
  }
  extractInput(fromPos, toPos, flags) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    [fromPos, toPos] = this._adjustRangeWithSeparators(fromPos, toPos);
    return this._removeThousandsSeparators(super.extractInput(fromPos, toPos, flags));
  }
  _appendCharRaw(ch, flags) {
    if (flags === void 0) {
      flags = {};
    }
    const prevBeforeTailValue = flags.tail && flags._beforeTailState ? flags._beforeTailState._value : this._value;
    const prevBeforeTailSeparatorsCount = this._separatorsCountFromSlice(prevBeforeTailValue);
    this._value = this._removeThousandsSeparators(this.value);
    const oldValue = this._value;
    this._value += ch;
    const num = this.number;
    let accepted = !isNaN(num);
    let skip = false;
    if (accepted) {
      let fixedNum;
      if (this.min != null && this.min < 0 && this.number < this.min) fixedNum = this.min;
      if (this.max != null && this.max > 0 && this.number > this.max) fixedNum = this.max;
      if (fixedNum != null) {
        if (this.autofix) {
          this._value = this.format(fixedNum, this).replace(MaskedNumber.UNMASKED_RADIX, this.radix);
          skip || (skip = oldValue === this._value && !flags.tail);
        } else {
          accepted = false;
        }
      }
      accepted && (accepted = Boolean(this._value.match(this._numberRegExp)));
    }
    let appendDetails;
    if (!accepted) {
      this._value = oldValue;
      appendDetails = new ChangeDetails();
    } else {
      appendDetails = new ChangeDetails({
        inserted: this._value.slice(oldValue.length),
        rawInserted: skip ? "" : ch,
        skip
      });
    }
    this._value = this._insertThousandsSeparators(this._value);
    const beforeTailValue = flags.tail && flags._beforeTailState ? flags._beforeTailState._value : this._value;
    const beforeTailSeparatorsCount = this._separatorsCountFromSlice(beforeTailValue);
    appendDetails.tailShift += (beforeTailSeparatorsCount - prevBeforeTailSeparatorsCount) * this.thousandsSeparator.length;
    return appendDetails;
  }
  _findSeparatorAround(pos) {
    if (this.thousandsSeparator) {
      const searchFrom = pos - this.thousandsSeparator.length + 1;
      const separatorPos = this.value.indexOf(this.thousandsSeparator, searchFrom);
      if (separatorPos <= pos) return separatorPos;
    }
    return -1;
  }
  _adjustRangeWithSeparators(from, to) {
    const separatorAroundFromPos = this._findSeparatorAround(from);
    if (separatorAroundFromPos >= 0) from = separatorAroundFromPos;
    const separatorAroundToPos = this._findSeparatorAround(to);
    if (separatorAroundToPos >= 0) to = separatorAroundToPos + this.thousandsSeparator.length;
    return [from, to];
  }
  remove(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    [fromPos, toPos] = this._adjustRangeWithSeparators(fromPos, toPos);
    const valueBeforePos = this.value.slice(0, fromPos);
    const valueAfterPos = this.value.slice(toPos);
    const prevBeforeTailSeparatorsCount = this._separatorsCount(valueBeforePos.length);
    this._value = this._insertThousandsSeparators(this._removeThousandsSeparators(valueBeforePos + valueAfterPos));
    const beforeTailSeparatorsCount = this._separatorsCountFromSlice(valueBeforePos);
    return new ChangeDetails({
      tailShift: (beforeTailSeparatorsCount - prevBeforeTailSeparatorsCount) * this.thousandsSeparator.length
    });
  }
  nearestInputPos(cursorPos, direction) {
    if (!this.thousandsSeparator) return cursorPos;
    switch (direction) {
      case DIRECTION.NONE:
      case DIRECTION.LEFT:
      case DIRECTION.FORCE_LEFT: {
        const separatorAtLeftPos = this._findSeparatorAround(cursorPos - 1);
        if (separatorAtLeftPos >= 0) {
          const separatorAtLeftEndPos = separatorAtLeftPos + this.thousandsSeparator.length;
          if (cursorPos < separatorAtLeftEndPos || this.value.length <= separatorAtLeftEndPos || direction === DIRECTION.FORCE_LEFT) {
            return separatorAtLeftPos;
          }
        }
        break;
      }
      case DIRECTION.RIGHT:
      case DIRECTION.FORCE_RIGHT: {
        const separatorAtRightPos = this._findSeparatorAround(cursorPos);
        if (separatorAtRightPos >= 0) {
          return separatorAtRightPos + this.thousandsSeparator.length;
        }
      }
    }
    return cursorPos;
  }
  doCommit() {
    if (this.value) {
      const number = this.number;
      let validnum = number;
      if (this.min != null) validnum = Math.max(validnum, this.min);
      if (this.max != null) validnum = Math.min(validnum, this.max);
      if (validnum !== number) this.unmaskedValue = this.format(validnum, this);
      let formatted = this.value;
      if (this.normalizeZeros) formatted = this._normalizeZeros(formatted);
      if (this.padFractionalZeros && this.scale > 0) formatted = this._padFractionalZeros(formatted);
      this._value = formatted;
    }
    super.doCommit();
  }
  _normalizeZeros(value) {
    const parts = this._removeThousandsSeparators(value).split(this.radix);
    parts[0] = parts[0].replace(/^(\D*)(0*)(\d*)/, (match, sign, zeros, num) => sign + num);
    if (value.length && !/\d$/.test(parts[0])) parts[0] = parts[0] + "0";
    if (parts.length > 1) {
      parts[1] = parts[1].replace(/0*$/, "");
      if (!parts[1].length) parts.length = 1;
    }
    return this._insertThousandsSeparators(parts.join(this.radix));
  }
  _padFractionalZeros(value) {
    if (!value) return value;
    const parts = value.split(this.radix);
    if (parts.length < 2) parts.push("");
    parts[1] = parts[1].padEnd(this.scale, "0");
    return parts.join(this.radix);
  }
  doSkipInvalid(ch, flags, checkTail) {
    if (flags === void 0) {
      flags = {};
    }
    const dropFractional = this.scale === 0 && ch !== this.thousandsSeparator && (ch === this.radix || ch === MaskedNumber.UNMASKED_RADIX || this.mapToRadix.includes(ch));
    return super.doSkipInvalid(ch, flags, checkTail) && !dropFractional;
  }
  get unmaskedValue() {
    return this._removeThousandsSeparators(this._normalizeZeros(this.value)).replace(this.radix, MaskedNumber.UNMASKED_RADIX);
  }
  set unmaskedValue(unmaskedValue) {
    super.unmaskedValue = unmaskedValue;
  }
  get typedValue() {
    return this.parse(this.unmaskedValue, this);
  }
  set typedValue(n) {
    this.rawInputValue = this.format(n, this).replace(MaskedNumber.UNMASKED_RADIX, this.radix);
  }
  /** Parsed Number */
  get number() {
    return this.typedValue;
  }
  set number(number) {
    this.typedValue = number;
  }
  get allowNegative() {
    return this.min != null && this.min < 0 || this.max != null && this.max < 0;
  }
  get allowPositive() {
    return this.min != null && this.min > 0 || this.max != null && this.max > 0;
  }
  typedValueEquals(value) {
    return (super.typedValueEquals(value) || MaskedNumber.EMPTY_VALUES.includes(value) && MaskedNumber.EMPTY_VALUES.includes(this.typedValue)) && !(value === 0 && this.value === "");
  }
}
_MaskedNumber = MaskedNumber;
MaskedNumber.UNMASKED_RADIX = ".";
MaskedNumber.EMPTY_VALUES = [...Masked.EMPTY_VALUES, 0];
MaskedNumber.DEFAULTS = {
  ...Masked.DEFAULTS,
  mask: Number,
  radix: ",",
  thousandsSeparator: "",
  mapToRadix: [_MaskedNumber.UNMASKED_RADIX],
  min: Number.MIN_SAFE_INTEGER,
  max: Number.MAX_SAFE_INTEGER,
  scale: 2,
  normalizeZeros: true,
  padFractionalZeros: false,
  parse: Number,
  format: (n) => n.toLocaleString("en-US", {
    useGrouping: false,
    maximumFractionDigits: 20
  })
};
IMask.MaskedNumber = MaskedNumber;
const PIPE_TYPE = {
  MASKED: "value",
  UNMASKED: "unmaskedValue",
  TYPED: "typedValue"
};
function createPipe(arg, from, to) {
  if (from === void 0) {
    from = PIPE_TYPE.MASKED;
  }
  if (to === void 0) {
    to = PIPE_TYPE.MASKED;
  }
  const masked = createMask(arg);
  return (value) => masked.runIsolated((m) => {
    m[from] = value;
    return m[to];
  });
}
function pipe(value, mask, from, to) {
  return createPipe(mask, from, to)(value);
}
IMask.PIPE_TYPE = PIPE_TYPE;
IMask.createPipe = createPipe;
IMask.pipe = pipe;
class RepeatBlock extends MaskedPattern {
  get repeatFrom() {
    var _ref;
    return (_ref = Array.isArray(this.repeat) ? this.repeat[0] : this.repeat === Infinity ? 0 : this.repeat) != null ? _ref : 0;
  }
  get repeatTo() {
    var _ref2;
    return (_ref2 = Array.isArray(this.repeat) ? this.repeat[1] : this.repeat) != null ? _ref2 : Infinity;
  }
  constructor(opts) {
    super(opts);
  }
  updateOptions(opts) {
    super.updateOptions(opts);
  }
  _update(opts) {
    var _ref3, _ref4, _this$_blocks;
    const {
      repeat,
      ...blockOpts
    } = normalizeOpts(opts);
    this._blockOpts = Object.assign({}, this._blockOpts, blockOpts);
    const block = createMask(this._blockOpts);
    this.repeat = (_ref3 = (_ref4 = repeat != null ? repeat : block.repeat) != null ? _ref4 : this.repeat) != null ? _ref3 : Infinity;
    super._update({
      mask: "m".repeat(Math.max(this.repeatTo === Infinity && ((_this$_blocks = this._blocks) == null ? void 0 : _this$_blocks.length) || 0, this.repeatFrom)),
      blocks: {
        m: block
      },
      eager: block.eager,
      overwrite: block.overwrite,
      skipInvalid: block.skipInvalid,
      lazy: block.lazy,
      placeholderChar: block.placeholderChar,
      displayChar: block.displayChar
    });
  }
  _allocateBlock(bi) {
    if (bi < this._blocks.length) return this._blocks[bi];
    if (this.repeatTo === Infinity || this._blocks.length < this.repeatTo) {
      this._blocks.push(createMask(this._blockOpts));
      this.mask += "m";
      return this._blocks[this._blocks.length - 1];
    }
  }
  _appendCharRaw(ch, flags) {
    if (flags === void 0) {
      flags = {};
    }
    const details = new ChangeDetails();
    for (
      let bi = (_this$_mapPosToBlock$ = (_this$_mapPosToBlock = this._mapPosToBlock(this.displayValue.length)) == null ? void 0 : _this$_mapPosToBlock.index) != null ? _this$_mapPosToBlock$ : Math.max(this._blocks.length - 1, 0), block, allocated;
      // try to get a block or
      // try to allocate a new block if not allocated already
      block = (_this$_blocks$bi = this._blocks[bi]) != null ? _this$_blocks$bi : allocated = !allocated && this._allocateBlock(bi);
      ++bi
    ) {
      var _this$_mapPosToBlock$, _this$_mapPosToBlock, _this$_blocks$bi, _flags$_beforeTailSta;
      const blockDetails = block._appendChar(ch, {
        ...flags,
        _beforeTailState: (_flags$_beforeTailSta = flags._beforeTailState) == null || (_flags$_beforeTailSta = _flags$_beforeTailSta._blocks) == null ? void 0 : _flags$_beforeTailSta[bi]
      });
      if (blockDetails.skip && allocated) {
        this._blocks.pop();
        this.mask = this.mask.slice(1);
        break;
      }
      details.aggregate(blockDetails);
      if (blockDetails.consumed) break;
    }
    return details;
  }
  _trimEmptyTail(fromPos, toPos) {
    var _this$_mapPosToBlock2, _this$_mapPosToBlock3;
    if (fromPos === void 0) {
      fromPos = 0;
    }
    const firstBlockIndex = Math.max(((_this$_mapPosToBlock2 = this._mapPosToBlock(fromPos)) == null ? void 0 : _this$_mapPosToBlock2.index) || 0, this.repeatFrom, 0);
    let lastBlockIndex;
    if (toPos != null) lastBlockIndex = (_this$_mapPosToBlock3 = this._mapPosToBlock(toPos)) == null ? void 0 : _this$_mapPosToBlock3.index;
    if (lastBlockIndex == null) lastBlockIndex = this._blocks.length - 1;
    let removeCount = 0;
    for (let blockIndex = lastBlockIndex; firstBlockIndex <= blockIndex; --blockIndex, ++removeCount) {
      if (this._blocks[blockIndex].unmaskedValue) break;
    }
    if (removeCount) {
      this._blocks.splice(lastBlockIndex - removeCount + 1, removeCount);
      this.mask = this.mask.slice(removeCount);
    }
  }
  reset() {
    super.reset();
    this._trimEmptyTail();
  }
  remove(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    const removeDetails = super.remove(fromPos, toPos);
    this._trimEmptyTail(fromPos, toPos);
    return removeDetails;
  }
  totalInputPositions(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos == null && this.repeatTo === Infinity) return Infinity;
    return super.totalInputPositions(fromPos, toPos);
  }
  get state() {
    return super.state;
  }
  set state(state) {
    this._blocks.length = state._blocks.length;
    this.mask = this.mask.slice(0, this._blocks.length);
    super.state = state;
  }
}
IMask.RepeatBlock = RepeatBlock;
try {
  globalThis.IMask = IMask;
} catch {
}
var propTypes = { exports: {} };
var ReactPropTypesSecret$1 = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
var ReactPropTypesSecret_1 = ReactPropTypesSecret$1;
var ReactPropTypesSecret = ReactPropTypesSecret_1;
function emptyFunction() {
}
function emptyFunctionWithReset() {
}
emptyFunctionWithReset.resetWarningCache = emptyFunction;
var factoryWithThrowingShims = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
      return;
    }
    var err = new Error(
      "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types"
    );
    err.name = "Invariant Violation";
    throw err;
  }
  shim.isRequired = shim;
  function getShim() {
    return shim;
  }
  var ReactPropTypes = {
    array: shim,
    bigint: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,
    any: shim,
    arrayOf: getShim,
    element: shim,
    elementType: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim,
    checkPropTypes: emptyFunctionWithReset,
    resetWarningCache: emptyFunction
  };
  ReactPropTypes.PropTypes = ReactPropTypes;
  return ReactPropTypes;
};
{
  propTypes.exports = factoryWithThrowingShims();
}
var propTypesExports = propTypes.exports;
const PropTypes = /* @__PURE__ */ getDefaultExportFromCjs(propTypesExports);
const MASK_PROPS = {
  // common
  mask: PropTypes.oneOfType([PropTypes.array, PropTypes.func, PropTypes.string, PropTypes.instanceOf(RegExp), PropTypes.oneOf([Date, Number, IMask.Masked]), PropTypes.instanceOf(IMask.Masked)]),
  value: PropTypes.any,
  unmask: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(["typed"])]),
  prepare: PropTypes.func,
  prepareChar: PropTypes.func,
  validate: PropTypes.func,
  commit: PropTypes.func,
  overwrite: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(["shift"])]),
  eager: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(["append", "remove"])]),
  skipInvalid: PropTypes.bool,
  // events
  onAccept: PropTypes.func,
  onComplete: PropTypes.func,
  // pattern
  placeholderChar: PropTypes.string,
  displayChar: PropTypes.string,
  lazy: PropTypes.bool,
  definitions: PropTypes.object,
  blocks: PropTypes.object,
  // enum
  enum: PropTypes.arrayOf(PropTypes.string),
  // range
  maxLength: PropTypes.number,
  from: PropTypes.number,
  to: PropTypes.number,
  // date
  pattern: PropTypes.string,
  format: PropTypes.func,
  parse: PropTypes.func,
  autofix: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(["pad"])]),
  // number
  radix: PropTypes.string,
  thousandsSeparator: PropTypes.string,
  mapToRadix: PropTypes.arrayOf(PropTypes.string),
  scale: PropTypes.number,
  normalizeZeros: PropTypes.bool,
  padFractionalZeros: PropTypes.bool,
  min: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(Date)]),
  max: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(Date)]),
  // dynamic
  dispatch: PropTypes.func,
  // ref
  inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({
    current: PropTypes.object
  })])
};
const MASK_PROPS_NAMES = Object.keys(MASK_PROPS).filter((p) => p !== "value");
const NON_MASK_OPTIONS_NAMES = ["value", "unmask", "onAccept", "onComplete", "inputRef"];
const MASK_OPTIONS_NAMES = MASK_PROPS_NAMES.filter((pName) => NON_MASK_OPTIONS_NAMES.indexOf(pName) < 0);
function IMaskMixin(ComposedComponent) {
  var _Class;
  const MaskedComponent = (_Class = class MaskedComponent extends React.Component {
    constructor(props) {
      super(props);
      this._inputRef = this._inputRef.bind(this);
    }
    componentDidMount() {
      if (!this.props.mask) return;
      this.initMask();
    }
    componentDidUpdate() {
      const props = this.props;
      const maskOptions = this._extractMaskOptionsFromProps(props);
      if (maskOptions.mask) {
        if (this.maskRef) {
          this.maskRef.updateOptions(maskOptions);
          if ("value" in props && props.value !== void 0) this.maskValue = props.value;
        } else {
          this.initMask(maskOptions);
        }
      } else {
        this.destroyMask();
        if ("value" in props && props.value !== void 0) {
          var _this$element;
          if ((_this$element = this.element) != null && _this$element.isContentEditable && this.element.tagName !== "INPUT" && this.element.tagName !== "TEXTAREA") this.element.textContent = props.value;
          else this.element.value = props.value;
        }
      }
    }
    componentWillUnmount() {
      this.destroyMask();
    }
    _inputRef(el) {
      this.element = el;
      if (this.props.inputRef) {
        if (Object.prototype.hasOwnProperty.call(this.props.inputRef, "current")) this.props.inputRef.current = el;
        else this.props.inputRef(el);
      }
    }
    initMask(maskOptions) {
      if (maskOptions === void 0) {
        maskOptions = this._extractMaskOptionsFromProps(this.props);
      }
      this.maskRef = IMask(this.element, maskOptions).on("accept", this._onAccept.bind(this)).on("complete", this._onComplete.bind(this));
      if ("value" in this.props && this.props.value !== void 0) this.maskValue = this.props.value;
    }
    destroyMask() {
      if (this.maskRef) {
        this.maskRef.destroy();
        delete this.maskRef;
      }
    }
    _extractMaskOptionsFromProps(props) {
      const {
        ...cloneProps
      } = props;
      Object.keys(cloneProps).filter((prop) => MASK_OPTIONS_NAMES.indexOf(prop) < 0).forEach((nonMaskProp) => {
        delete cloneProps[nonMaskProp];
      });
      return cloneProps;
    }
    _extractNonMaskProps(props) {
      const {
        ...cloneProps
      } = props;
      MASK_PROPS_NAMES.forEach((maskProp) => {
        if (maskProp !== "maxLength") delete cloneProps[maskProp];
      });
      if (!("defaultValue" in cloneProps)) cloneProps.defaultValue = props.mask ? "" : cloneProps.value;
      delete cloneProps.value;
      return cloneProps;
    }
    get maskValue() {
      if (!this.maskRef) return "";
      if (this.props.unmask === "typed") return this.maskRef.typedValue;
      if (this.props.unmask) return this.maskRef.unmaskedValue;
      return this.maskRef.value;
    }
    set maskValue(value) {
      if (!this.maskRef) return;
      value = value == null && this.props.unmask !== "typed" ? "" : value;
      if (this.props.unmask === "typed") this.maskRef.typedValue = value;
      else if (this.props.unmask) this.maskRef.unmaskedValue = value;
      else this.maskRef.value = value;
    }
    _onAccept(e) {
      if (this.props.onAccept && this.maskRef) this.props.onAccept(this.maskValue, this.maskRef, e);
    }
    _onComplete(e) {
      if (this.props.onComplete && this.maskRef) this.props.onComplete(this.maskValue, this.maskRef, e);
    }
    render() {
      return React.createElement(ComposedComponent, {
        ...this._extractNonMaskProps(this.props),
        inputRef: this._inputRef
      });
    }
  }, _Class.displayName = void 0, _Class.propTypes = void 0, _Class);
  const nestedComponentName = ComposedComponent.displayName || ComposedComponent.name || "Component";
  MaskedComponent.displayName = "IMask(" + nestedComponentName + ")";
  MaskedComponent.propTypes = MASK_PROPS;
  return React.forwardRef((props, ref) => React.createElement(MaskedComponent, {
    ...props,
    ref
  }));
}
const IMaskInputClass = IMaskMixin((_ref) => {
  let {
    inputRef,
    ...props
  } = _ref;
  return React.createElement("input", {
    ...props,
    ref: inputRef
  });
});
const IMaskInputFn = (props, ref) => React.createElement(IMaskInputClass, {
  ...props,
  ref
});
const IMaskInput = React.forwardRef(IMaskInputFn);
function CustomNumberField({
  control,
  name,
  label,
  allowedDecimalPlaces = 2,
  min = 0,
  max = 99999,
  suffix,
  className,
  placeholder,
  stretch = false,
  required,
  ariaDescribedByIfNoError,
  info
}) {
  const registerOptions = reactExports.useMemo(() => {
    return {
      required: "Dieses Feld ist erforderlich"
    };
  }, []);
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error }
  } = useController({ control, name, rules: registerOptions });
  const mask = suffix ? `num ${suffix}` : "num";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: classNames(
        nsp("custom-input"),
        !stretch && nsp("custom-input--small"),
        error && nsp("custom-input--error"),
        className
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: nsp("custom-input-question"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: nsp("custom-input-question__label"), htmlFor: name, children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            IMaskInput,
            {
              className: nsp("custom-input-question__input"),
              inputRef: ref,
              mask,
              unmask: true,
              blocks: {
                num: {
                  mask: Number,
                  max,
                  min,
                  thousandsSeparator: ".",
                  scale: allowedDecimalPlaces
                }
              },
              lazy: false,
              autofix: true,
              value: value === null ? "" : String(value),
              onAccept: (value2) => {
                if (!value2) {
                  onChange(null);
                } else {
                  onChange(+value2);
                }
              },
              onBlur,
              type: "text",
              inputMode: "numeric",
              name,
              id: name,
              placeholder,
              "aria-invalid": !!error,
              "aria-describedby": error ? `${name}-error` : ariaDescribedByIfNoError ? ariaDescribedByIfNoError : void 0,
              required
            }
          ),
          !!error && /* @__PURE__ */ jsxRuntimeExports.jsx(Description, { id: `${name}-error`, error: true, children: error.message })
        ] }),
        !!info && /* @__PURE__ */ jsxRuntimeExports.jsx(InfoDialog, { info })
      ]
    }
  );
}
const yesNoLabels = {
  [YesNo.YES]: "Ja",
  [YesNo.NO]: "Nein"
};
const booleanOptions = [
  { value: YesNo.YES, label: yesNoLabels.YES },
  { value: YesNo.NO, label: yesNoLabels.NO }
];
function YesNoRadio(props) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(CustomRadio, { ...props, options: booleanOptions });
}
function AccessControl() {
  const handleScrollToTop = () => {
    const firstRechnerForm = document.getElementsByClassName(
      "egr-rechner-form"
    )[0];
    const firstRechnerFormOffset = firstRechnerForm.offsetTop - 20;
    window.scrollTo({
      top: firstRechnerFormOffset,
      behavior: "smooth"
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: `${nsp("access-control")}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${nsp("access-control__content")}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Bevor Sie den Monatsplaner nutzen können, machen Sie bitte Angaben zu Ihrem Brutto-Einkommen während des Elterngeldbezugs" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleScrollToTop, label: "Jetzt berechnen" })
  ] }) });
}
const roundAndFormatMoney = (amount) => formatMoney(Big(amount).round(0).toNumber(), 0);
const formatMoney = (number, fractionDigits) => {
  return number.toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
    currencyDisplay: "symbol",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  });
};
function RechnerResultTable({
  rows,
  elterngeldType,
  elternteil,
  titleTotal,
  markOver14Month,
  hideLebensmonate,
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "table",
    {
      className: classNames(
        nsp("rechner-result-table"),
        elterngeldType === "Basis" && nsp("rechner-result-table--basiselterngeld"),
        elterngeldType === "Plus" && nsp("rechner-result-table--elterngeldplus"),
        elterngeldType === "Bonus" && nsp("rechner-result-table--partnerschaftsbonus"),
        className
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "th",
            {
              className: classNames(
                nsp("rechner-result-table__lebensmonate"),
                hideLebensmonate && nsp("rechner-result-table__lebensmonate--hidden")
              ),
              children: "Lebensmonate"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: nsp("rechner-result-table__cell"), children: elterngeldType }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: nsp("rechner-result-table__cell"), children: titleTotal })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: rows.map(
          ({
            vonLebensMonat,
            bisLebensMonat,
            amountElterngeld,
            amountTotal
          }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "td",
              {
                className: classNames(
                  "rechner-result-table__cell",
                  hideLebensmonate && nsp("rechner-result-table__cell--hidden")
                ),
                "aria-label": vonLebensMonat === bisLebensMonat ? `Lebensmonat ${vonLebensMonat}` : `Lebensmonat von ${vonLebensMonat} bis ${bisLebensMonat}`,
                children: vonLebensMonat === bisLebensMonat ? vonLebensMonat : `${vonLebensMonat} - ${bisLebensMonat}`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "td",
              {
                className: nsp("rechner-result-table__cell--result"),
                "data-testid": `result-${elternteil}-${vonLebensMonat}-${bisLebensMonat}-${elterngeldType}`,
                children: [
                  roundAndFormatMoney(amountElterngeld),
                  markOver14Month && (vonLebensMonat > 14 || bisLebensMonat > 14) ? /* @__PURE__ */ jsxRuntimeExports.jsx(FootNoteNumber, { number: 1, type: "anchor", prefix: "rechner" }) : null
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "td",
              {
                className: nsp("rechner-result-table__cell--result"),
                "data-testid": `result-total-${elternteil}-${vonLebensMonat}-${bisLebensMonat}-${elterngeldType}`,
                children: [
                  roundAndFormatMoney(amountTotal),
                  markOver14Month && (vonLebensMonat > 14 || bisLebensMonat > 14) ? /* @__PURE__ */ jsxRuntimeExports.jsx(FootNoteNumber, { number: 1, type: "anchor", prefix: "rechner" }) : null
                ]
              }
            )
          ] }, vonLebensMonat)
        ) })
      ]
    }
  );
}
function Elternteil({
  lebensmonate,
  selectablePSBMonths,
  elternteil,
  elternteilName,
  onToggleMonth,
  onDragOverMonth,
  isBEGMonthSelectable,
  isEGPMonthSelectable,
  amounts,
  hasMutterschutz,
  mutterSchutzMonate,
  remainingMonths,
  hideLebensmonateOnDesktop,
  className,
  isElternteilOne,
  partnerMonate
}) {
  const [hoverPSBIndex, setHoverPSBIndex] = reactExports.useState(null);
  const allPSBIndices = [
    ...selectablePSBMonths.selectableIndices,
    ...selectablePSBMonths.deselectableIndices
  ];
  const highestAllowedPSBIndex = Math.max(...allPSBIndices);
  const lowestAllowedPSBIndex = Math.min(...allPSBIndices);
  const automaticallySelectedPSBMonthIndex = hoverPSBIndex !== null && getAutomaticallySelectedPSBMonthIndex(elternteil.months, hoverPSBIndex);
  const getLabel = (index, elterngeldTypeName) => {
    return `${elternteilName} ${elterngeldTypeName} für Lebensmonat ${index + 1}`;
  };
  const roundAndFormatMoney2 = (amount) => formatMoney(Big(amount).round(0).toNumber(), 0);
  const getBasiselterngeld = (row) => {
    if (!row || row === "empty") {
      return "-";
    }
    return roundAndFormatMoney2(row.amountBasiselterngeld);
  };
  const getElterngeldplus = (row) => {
    if (!row || row === "empty") {
      return "-";
    }
    return roundAndFormatMoney2(row.amountElterngeldPlus);
  };
  function isBEGCellVisible(index) {
    const isAlreadySelected = elternteil.months[index].type === "BEG";
    const isSelectable = isBEGMonthSelectable(index);
    return isAlreadySelected || isSelectable;
  }
  function isEGPCellVisible(index) {
    const isAlreadySelected = elternteil.months[index].type === "EG+";
    const isSelectable = isEGPMonthSelectable(index);
    return isAlreadySelected || isSelectable;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: classNames(nsp("elternteil"), className), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("thead", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "th",
          {
            colSpan: 1,
            className: classNames(
              nsp("elternteil__lebensmonat"),
              hideLebensmonateOnDesktop && nsp("elternteil__lebensmonat--hidden")
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { colSpan: 3, className: nsp("elternteil__name"), children: elternteilName })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "th",
          {
            className: classNames(
              nsp("elternteil__lebensmonat"),
              hideLebensmonateOnDesktop && nsp("elternteil__lebensmonat--hidden")
            ),
            children: "Lebens-monat"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "th",
          {
            className: classNames(
              nsp("elternteil__th"),
              nsp("elternteil__th--basiselterngeld")
            ),
            children: "Basis"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "th",
          {
            className: classNames(
              nsp("elternteil__th"),
              nsp("elternteil__th--elterngeldplus")
            ),
            children: "Plus"
          }
        ),
        !!partnerMonate && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "th",
          {
            className: classNames(
              nsp("elternteil__th"),
              nsp("elternteil__th--partnerschaftsbonus")
            ),
            children: "Bonus"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: lebensmonate.map((lebensmonat, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "td",
        {
          "aria-label": `${index + 1} ${lebensmonat.labelLong}`,
          className: classNames(
            nsp("lebensmonate-cell"),
            hideLebensmonateOnDesktop && nsp("lebensmonate-cell--hidden")
          ),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: classNames(
                nsp("lebensmonate-cell__lebensmonat-content")
              ),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: nsp("lebensmonate-cell__number"), children: index + 1 })
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: isBEGCellVisible(index) && /* @__PURE__ */ jsxRuntimeExports.jsx(
        MonatsplanerMonth,
        {
          isSelected: elternteil.months[index].type === "BEG",
          label: getLabel(index, "Basiselterngeld"),
          elterngeldType: "BEG",
          onToggle: () => onToggleMonth("BEG", index),
          onDragOver: () => onDragOverMonth("BEG", index),
          isMutterschutzMonth: elternteil.months[index].isMutterschutzMonth,
          isElternteilOne,
          children: getBasiselterngeld(amounts[index])
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: isEGPCellVisible(index) && (!hasMutterschutz || index >= mutterSchutzMonate) && (remainingMonths.elterngeldplus > 0 || elternteil.months[index].type === "EG+") && /* @__PURE__ */ jsxRuntimeExports.jsx(
        MonatsplanerMonth,
        {
          isSelected: elternteil.months[index].type === "EG+",
          label: getLabel(index, "ElterngeldPlus"),
          elterngeldType: "EG+",
          onToggle: () => onToggleMonth("EG+", index),
          onDragOver: () => onDragOverMonth("EG+", index),
          children: getElterngeldplus(amounts[index])
        }
      ) }),
      !!partnerMonate && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: index >= mutterSchutzMonate && index >= lowestAllowedPSBIndex && index <= highestAllowedPSBIndex && /* @__PURE__ */ jsxRuntimeExports.jsx(
        MonatsplanerMonth,
        {
          isSelected: elternteil.months[index].type === "PSB",
          isHighlighted: automaticallySelectedPSBMonthIndex === index,
          label: getLabel(index, "Partnerschaftsbonus"),
          elterngeldType: "PSB",
          onToggle: () => onToggleMonth("PSB", index),
          onDragOver: () => onDragOverMonth("PSB", index),
          onMouseOver: () => setHoverPSBIndex(index),
          onMouseLeave: () => setHoverPSBIndex(null),
          children: getElterngeldplus(amounts[index])
        }
      ) })
    ] }, lebensmonat.monthIsoString)) })
  ] });
}
function VariantLabel({
  name,
  monthsAvailable,
  monthsTaken,
  className
}) {
  const monthsTotal = monthsAvailable + monthsTaken;
  const label = `${monthsAvailable} von ${monthsTotal} ${name} Monaten noch verfügbar`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "aria-label": label, className: classNames("rounded p-8", className), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: name }),
    " ",
    monthsAvailable,
    "/",
    monthsTotal,
    " ",
    "Monate"
  ] });
}
function BoxGraph({ months, className }) {
  const { basis, plus, bonus } = months;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "aria-hidden": true, className: classNames("grid min-h-24 gap-4", className), children: [
    repeatBox(basis.available, "col-span-2 bg-Basis", "basis-available"),
    repeatBox(basis.taken, "col-span-2 bg-grey", "basis-taken"),
    repeatBox(plus.available, "row-start-2 bg-Plus", "plus-available"),
    repeatBox(plus.taken, "row-start-2 bg-grey", "plus-taken"),
    repeatBox(
      bonus.available,
      "row-start-1 row-span-2 bg-Bonus",
      "bonus-available"
    ),
    repeatBox(bonus.taken, "row-start-1 row-span-2 bg-grey", "bonus-taken")
  ] });
}
function repeatBox(times, className, testId) {
  return [...Array(times)].map((_, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: classNames("rounded-2", className),
      "data-testid": testId
    },
    index
  ));
}
function PlanningContingent({ months, className }) {
  const isBonusAvailable = months.bonus.available + months.bonus.taken > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "header",
    {
      "aria-label": "Kontingent von planbaren Monaten",
      className: classNames("flex flex-wrap justify-between gap-8", className),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          VariantLabel,
          {
            name: "Basis",
            monthsAvailable: months.basis.available,
            monthsTaken: months.basis.taken,
            className: "bg-Basis text-white"
          }
        ),
        !!isBonusAvailable && /* @__PURE__ */ jsxRuntimeExports.jsx(
          VariantLabel,
          {
            name: "Bonus",
            monthsAvailable: months.bonus.available,
            monthsTaken: months.bonus.taken,
            className: "bg-Bonus text-black"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(BoxGraph, { months, className: "basis-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          VariantLabel,
          {
            name: "Plus",
            monthsAvailable: months.plus.available,
            monthsTaken: months.plus.taken,
            className: "bg-Plus text-black"
          }
        )
      ]
    }
  );
}
var Clear = {};
var __assign$2 = commonjsGlobal && commonjsGlobal.__assign || function() {
  __assign$2 = Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
        t[p] = s[p];
    }
    return t;
  };
  return __assign$2.apply(this, arguments);
};
Object.defineProperty(Clear, "__esModule", { value: true });
var jsx_runtime_1$2 = jsxRuntimeExports;
var SvgClear = function(props) {
  return (0, jsx_runtime_1$2.jsxs)("svg", __assign$2({ xmlns: "http://www.w3.org/2000/svg", height: 24, viewBox: "0 0 24 24", width: 24, "data-testid": "ClearIcon", role: "graphics-symbol img", focusable: "false", "aria-hidden": "true" }, props, { children: [(0, jsx_runtime_1$2.jsx)("path", { d: "M0 0h24v24H0z", fill: "none" }), (0, jsx_runtime_1$2.jsx)("path", { d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" })] }));
};
var _default$2 = Clear.default = SvgClear;
function NurErwerbstaetig({
  elternteil,
  monthsBeforeBirth
}) {
  const { control, setValue, watch } = useFormContext();
  const averageOrMonthlyNichtSelbstaendig = watch(
    `${elternteil}.bruttoEinkommenNichtSelbstaendig.type`
  );
  const toggleBruttoEinkommenNichtSelbstaendigState = () => setValue(
    `${elternteil}.bruttoEinkommenNichtSelbstaendig.type`,
    averageOrMonthlyNichtSelbstaendig === "average" ? "monthly" : "average"
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(FormFieldGroup, { headline: "Einkünfte aus nichtselbständiger Arbeit", children: [
    averageOrMonthlyNichtSelbstaendig === "average" && /* @__PURE__ */ jsxRuntimeExports.jsx(
      CustomNumberField,
      {
        control,
        name: `${elternteil}.bruttoEinkommenNichtSelbstaendig.average`,
        label: "Wie viel haben Sie in den 12 Kalendermonaten vor der Geburt ihres Kindes monatlich brutto verdient?",
        suffix: "Euro",
        required: true,
        info: infoTexts.einkommenNichtSelbststaendig
      }
    ),
    averageOrMonthlyNichtSelbstaendig === "average" && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "p",
      {
        className: nsp(
          `einkommen-form__ausfuerliche-eingabe-text-${elternteil.toLowerCase()}`
        ),
        children: "Wenn das Einkommen zwischen den Monaten sehr schwankte, klicken Sie bitte auf „ausführliche Eingabe“ und geben die Monate einzeln ein."
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        buttonStyle: "secondary",
        onClick: toggleBruttoEinkommenNichtSelbstaendigState,
        label: averageOrMonthlyNichtSelbstaendig === "average" ? "Zur ausführlichen Eingabe" : "Zur einfachen Eingabe"
      }
    ),
    averageOrMonthlyNichtSelbstaendig === "monthly" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "fieldset",
      {
        name: "Einkommen pro Monat",
        className: nsp("einkommen-form__per-month"),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("legend", { className: "mb-10", children: [
            "Geben Sie an, wie viel Sie in den 12 Monaten vor der Geburt Ihres Kindes monatlich verdient haben.",
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            "Ausgenommen sind:",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Monate in denen Sie im Mutterschutz waren" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Monate in denen Sie Elterngeld für ein älteres Kind in dessen ersten 14 Lebensmonaten bekommen haben" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Monate, in denen Sie weniger Einkommen hatten wegen einer Erkrankung, die maßgeblich auf Ihre Schwangerschaft zurückzuführen war" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Monate, in denen Sie weniger Einkommen wegen Ihres Wehrdienstes oder Zivildienstes hatten" })
            ] }),
            "Stattdessen werden frühere Monate berücksichtigt, damit der Zeitraum, der für die Feststellung Ihres Einkommens vor der Geburt zählt, insgesamt 12 Monate enthält."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-16 [&_input]:w-full", children: monthsBeforeBirth.map(({ label }, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            CustomNumberField,
            {
              control,
              name: `${elternteil}.bruttoEinkommenNichtSelbstaendig.perMonth.${index}`,
              label,
              suffix: "Euro",
              required: true
            },
            label
          )) })
        ]
      }
    )
  ] }) });
}
function NurSelbstaendig({ elternteil }) {
  const { setValue, control } = useFormContext();
  setValue(`${elternteil}.gewinnSelbstaendig.type`, "yearly");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(FormFieldGroup, { headline: "Gewinneinkünfte", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    CustomNumberField,
    {
      control,
      name: `${elternteil}.gewinnSelbstaendig.perYear`,
      label: "Wie hoch war Ihr Gewinn im Kalenderjahr vor der Geburt Ihres Kindes?",
      suffix: "Euro",
      max: 999999,
      required: true,
      info: infoTexts.einkommenGewinneinkuenfte
    }
  ) }) });
}
const steuerKlasseOptions = [
  { value: SteuerKlasse.SKL1, label: "1" },
  { value: SteuerKlasse.SKL2, label: "2" },
  { value: SteuerKlasse.SKL3, label: "3" },
  { value: SteuerKlasse.SKL4, label: "4" },
  { value: SteuerKlasse.SKL5, label: "5" }
];
const kinderFreiBetragOptions = [
  { value: KinderFreiBetrag.ZKF0, label: "0" },
  { value: KinderFreiBetrag.ZKF0_5, label: "0,5" },
  { value: KinderFreiBetrag.ZKF1, label: "1,0" },
  { value: KinderFreiBetrag.ZKF1_5, label: "1,5" },
  { value: KinderFreiBetrag.ZKF2, label: "2,0" },
  { value: KinderFreiBetrag.ZKF2_5, label: "2,5" },
  { value: KinderFreiBetrag.ZKF3, label: "3,0" },
  { value: KinderFreiBetrag.ZKF3_5, label: "3,5" },
  { value: KinderFreiBetrag.ZKF4, label: "4,0" },
  { value: KinderFreiBetrag.ZKF4_5, label: "4,5" },
  { value: KinderFreiBetrag.ZKF5, label: "5,0" }
];
const kassenArtLabels = {
  [KassenArt.GESETZLICH_PFLICHTVERSICHERT]: "gesetzlich pflichtversichert",
  [KassenArt.NICHT_GESETZLICH_PFLICHTVERSICHERT]: "nicht gesetzlich pflichtversichert"
};
const kassenArtOptions = [
  {
    value: KassenArt.GESETZLICH_PFLICHTVERSICHERT,
    label: kassenArtLabels.GESETZLICH_PFLICHTVERSICHERT
  },
  {
    value: KassenArt.NICHT_GESETZLICH_PFLICHTVERSICHERT,
    label: kassenArtLabels.NICHT_GESETZLICH_PFLICHTVERSICHERT
  }
];
const rentenVersicherungLabels = {
  [RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG]: "gesetzliche Rentenversicherung",
  [RentenArt.KEINE_GESETZLICHE_RENTEN_VERSICHERUNG]: "keine gesetzliche Rentenversicherung"
};
const rentenVersicherungOptions = [
  {
    value: RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG,
    label: rentenVersicherungLabels.GESETZLICHE_RENTEN_VERSICHERUNG
  },
  {
    value: RentenArt.KEINE_GESETZLICHE_RENTEN_VERSICHERUNG,
    label: rentenVersicherungLabels.KEINE_GESETZLICHE_RENTEN_VERSICHERUNG
  }
];
function SteuerUndVersicherung({
  elternteil,
  isSelbstaendigAndErwerbstaetigOrMehrereTaetigkeiten
}) {
  const {
    register,
    formState: { errors }
  } = useFormContext();
  const numberOfGeschwisterKinder = useAppSelector(
    (state) => state.stepNachwuchs.geschwisterkinder.length
  );
  const isOnlySelbstaendig = useAppSelector(
    (state) => stepErwerbstaetigkeitElternteilSelectors.isOnlySelbstaendig(
      state.stepErwerbstaetigkeit[elternteil]
    )
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    !isOnlySelbstaendig && /* @__PURE__ */ jsxRuntimeExports.jsx(FormFieldGroup, { headline: "Steuerklasse", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      CustomSelect,
      {
        autoWidth: true,
        register,
        registerOptions: {
          required: "Eine Option muss ausgewählt sein"
        },
        name: `${elternteil}.steuerKlasse`,
        label: "Welche Steuerklasse haben Sie?",
        errors,
        options: steuerKlasseOptions,
        required: true,
        info: infoTexts.einkommenSteuerklasse
      }
    ) }),
    !isOnlySelbstaendig && numberOfGeschwisterKinder > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(FormFieldGroup, { headline: "Kinderfreibeträge", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      CustomSelect,
      {
        autoWidth: true,
        register,
        registerOptions: {
          required: "Eine Option muss ausgewählt sein"
        },
        name: `${elternteil}.kinderFreiBetrag`,
        label: "Wie viele Kinderfreibeträge sind aus Ihrer Lohn- und\n        Gehaltsbescheinigung ersichtlich?",
        errors,
        options: kinderFreiBetragOptions,
        required: true
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      FormFieldGroup,
      {
        headline: "Kirchensteuer",
        description: "Sind Sie kirchensteuerpflichtig?",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          YesNoRadio,
          {
            register,
            registerOptions: {
              required: "Dieses Feld ist erforderlich"
            },
            name: `${elternteil}.zahlenSieKirchenSteuer`,
            errors,
            required: true
          }
        )
      }
    ),
    !isSelbstaendigAndErwerbstaetigOrMehrereTaetigkeiten && /* @__PURE__ */ jsxRuntimeExports.jsx(
      FormFieldGroup,
      {
        headline: "Krankenversicherung",
        description: "Wie sind Sie krankenversichert?",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          CustomRadio,
          {
            register,
            registerOptions: {
              required: "Dieses Feld ist erforderlich"
            },
            name: `${elternteil}.kassenArt`,
            options: kassenArtOptions,
            errors,
            required: true
          }
        )
      }
    ),
    !!isOnlySelbstaendig && /* @__PURE__ */ jsxRuntimeExports.jsx(
      FormFieldGroup,
      {
        headline: "Rentenversicherung",
        description: "Wie sind Sie rentenversichert?",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          CustomRadio,
          {
            register,
            registerOptions: {
              required: "Dieses Feld ist erforderlich"
            },
            name: `${elternteil}.rentenVersicherung`,
            options: rentenVersicherungOptions,
            errors,
            required: true
          }
        )
      }
    )
  ] });
}
const typeOfVersicherungenLabels = {
  hasRentenversicherung: "rentenversicherungspflichtig",
  hasKrankenversicherung: "krankenversicherungspflichtig",
  hasArbeitslosenversicherung: "arbeitslosenversicherungspflichtig",
  none: "keines der Genannten"
};
function Versicherungen({
  hasRentenversicherungName,
  hasArbeitslosenversicherungName,
  hasKrankenversicherungName,
  noneName
}) {
  const {
    register,
    formState: { errors },
    setValue,
    getValues
  } = useFormContext();
  const versicherungenError = get(errors, noneName);
  const handleChangeNoneVersicherung = (event) => {
    if (!event.target.checked) return;
    setValue(hasRentenversicherungName, false);
    setValue(hasKrankenversicherungName, false);
    setValue(hasArbeitslosenversicherungName, false);
  };
  const versicherungenRegisterOptions = reactExports.useMemo(
    () => ({
      onChange: (event) => {
        if (!event.target.checked) return;
        setValue(noneName, false);
      },
      deps: [noneName]
    }),
    [noneName, setValue]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    FormFieldGroup,
    {
      description: "Ich war während der Ausübung dieser Tätigkeit",
      "aria-describedby": versicherungenError ? "versicherungen-checkbox-group-error" : void 0,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          CustomCheckbox,
          {
            register,
            registerOptions: versicherungenRegisterOptions,
            name: hasRentenversicherungName,
            label: typeOfVersicherungenLabels.hasRentenversicherung
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          CustomCheckbox,
          {
            register,
            registerOptions: versicherungenRegisterOptions,
            name: hasKrankenversicherungName,
            label: typeOfVersicherungenLabels.hasKrankenversicherung
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          CustomCheckbox,
          {
            register,
            registerOptions: versicherungenRegisterOptions,
            name: hasArbeitslosenversicherungName,
            label: typeOfVersicherungenLabels.hasArbeitslosenversicherung
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          CustomCheckbox,
          {
            register,
            name: noneName,
            label: typeOfVersicherungenLabels.none,
            registerOptions: {
              validate: {
                validVersicherungOrNone: (value) => {
                  if (value === true) {
                    return true;
                  }
                  const hasOtherSelection = [
                    hasRentenversicherungName,
                    hasKrankenversicherungName,
                    hasArbeitslosenversicherungName
                  ].some((fieldName) => getValues(fieldName) === true);
                  return hasOtherSelection || "Mindestens eine Option muss gewählt werden";
                }
              },
              onChange: handleChangeNoneVersicherung
            }
          }
        ),
        versicherungenError ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { id: "versicherungen-checkbox-group-error", children: versicherungenError.message }) : null
      ]
    }
  );
}
var ZeitraumValue;
((ZeitraumValue2) => {
  ZeitraumValue2.valueOf = (value, type) => {
    switch (type) {
      case "Date":
        return new Date(value).getTime();
      case "Integer":
        return Number.parseInt(value);
    }
    throw new Error("Unknown ZeitraumValueType");
  };
})(ZeitraumValue || (ZeitraumValue = {}));
function Zeitraum({
  register,
  name,
  getValues,
  setValue,
  errors,
  options,
  optionsTo,
  className,
  suffix,
  type = "Date",
  disabled,
  onChange,
  required,
  ...aria
}) {
  const fromName = `${name}.from`;
  const toName = `${name}.to`;
  suffix = suffix ? ` ${suffix}` : "";
  const fromLabel = `von${suffix}`;
  const toLabel = `bis${suffix}`;
  const valueOf = reactExports.useCallback(
    (value) => ZeitraumValue.valueOf(value, type),
    [type]
  );
  const allToOptions = reactExports.useMemo(() => {
    return [
      // lists must be cloned to prevent side effects
      ...optionsTo ? cloneOptionsList(optionsTo) : cloneOptionsList(options)
    ];
  }, [options, optionsTo]);
  const [toOptions, setToOptions] = reactExports.useState(
    () => cloneOptionsList(allToOptions)
  );
  const onChangeFrom = reactExports.useCallback(
    (fromValue2) => {
      setToOptions((toOptions2) => {
        const nextHiddenToValue = allToOptions.filter((allToOption) => allToOption.hidden).filter(
          (allToOption) => valueOf(allToOption.value) > valueOf(fromValue2)
        ).reduce(
          (prev, curr) => valueOf(prev.value) < valueOf(curr.value) ? prev : curr,
          // start value is a maximum date
          { label: "", value: "9999-12-31" }
        );
        toOptions2.forEach((toOption, index) => {
          const toOptionCanBeShown = !allToOptions[index].hidden;
          const toOptionIsRealValue = toOption.value !== "";
          if (toOptionCanBeShown && toOptionIsRealValue) {
            const beforeNextHiddenToValue = valueOf(toOption.value) < valueOf(nextHiddenToValue.value);
            if (beforeNextHiddenToValue) {
              const fromOptionIsRealValue = fromValue2 !== "";
              toOption.hidden = fromOptionIsRealValue && valueOf(toOption.value) < valueOf(fromValue2);
            } else {
              toOption.hidden = true;
            }
          }
        });
        const to2 = getValues(toName);
        const currentToIsInList = toOptions2.find(
          (anvalibleOption) => !anvalibleOption.hidden && anvalibleOption.value === to2
        ) !== void 0;
        if (!currentToIsInList) {
          setValue(toName, "");
        }
        return [...toOptions2];
      });
      const to = getValues(toName);
      if (onChange) {
        if (valueOf(to) < valueOf(fromValue2) || fromValue2 === "") {
          onChange({ from: fromValue2, to: "" });
        } else {
          onChange({ from: fromValue2, to });
        }
      }
      setFromValue(fromValue2);
    },
    [allToOptions, getValues, onChange, setValue, toName, valueOf]
  );
  const onChangeTo = reactExports.useCallback(
    (toValue2) => {
      if (onChange) {
        onChange({ from: getValues(fromName), to: toValue2 });
      }
      setToValue(toValue2);
    },
    [fromName, getValues, onChange]
  );
  const zeitraumToRegisterOptions = reactExports.useMemo(
    () => ({
      onChange: (event) => onChangeTo(event.target.value),
      validate: {
        requireFromAndTo: (toValue2) => {
          const hasToValue = toValue2 !== "";
          const hasFromValue = getValues(fromName) !== "";
          if (hasToValue && hasFromValue) {
            return true;
          }
          if (!hasFromValue && !hasToValue) {
            return "Feld 'von' und 'bis' sind erforderlich";
          }
          if (!hasFromValue) {
            return "Feld 'von' ist erforderlich";
          }
          if (!hasToValue) {
            return "Feld 'bis' ist erforderlich";
          }
        },
        fromIsBeforeTo: (toValue2) => {
          const fromValue2 = getValues(fromName);
          if (toValue2 === "" || fromValue2 === "") {
            return true;
          }
          const fromTime = valueOf(fromValue2);
          const toTime = valueOf(toValue2);
          return fromTime <= toTime || "Zeitraum 'bis' muss nach 'von' liegen";
        }
      }
    }),
    [onChangeTo, getValues, fromName, valueOf]
  );
  const zeitraumFromRegisterOptions = reactExports.useMemo(
    () => ({
      deps: [toName],
      onChange: (event) => onChangeFrom(event.target.value)
    }),
    [onChangeFrom, toName]
  );
  const error = get(errors, toName);
  const [toValue, setToValue] = reactExports.useState("");
  const [fromValue, setFromValue] = reactExports.useState("");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: classNames(nsp("zeitraum"), className), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: nsp("zeitraum__controls"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        CustomSelect,
        {
          register,
          registerOptions: zeitraumFromRegisterOptions,
          name: fromName,
          label: fromLabel,
          options,
          disabled,
          "aria-invalid": !!error,
          "aria-describedby": error ? `${name}-error` : void 0,
          required,
          ...aria
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        CustomSelect,
        {
          register,
          registerOptions: zeitraumToRegisterOptions,
          name: toName,
          label: toLabel,
          options: toOptions,
          disabled,
          "aria-invalid": !!error,
          "aria-describedby": error ? `${name}-error` : void 0,
          required,
          ...aria
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { id: name, className: "sr-only", children: fromValue && toValue ? `im Zeitraum ${fromLabel} ${fromValue} ${toLabel} ${toValue} :` : "" })
    ] }),
    !!error && /* @__PURE__ */ jsxRuntimeExports.jsx(Description, { id: `${toName}-error`, error: true, children: error.message })
  ] });
}
const availableZeitraumOptions = (currentZeitraumList, initialZeitraumOptions, zeitraumValueType, lastZeitraumValue) => {
  const valueOf = (date) => ZeitraumValue.valueOf(date, zeitraumValueType);
  const zeitraumOptions = {
    from: cloneOptionsList(initialZeitraumOptions.from),
    to: cloneOptionsList(initialZeitraumOptions.to)
  };
  const zeitraumList = currentZeitraumList.map((v) => {
    return { from: v.from, to: v.to };
  });
  if (lastZeitraumValue) {
    zeitraumList.pop();
    zeitraumList.push({
      from: lastZeitraumValue.from,
      to: lastZeitraumValue.to
    });
  }
  zeitraumList.sort((z1, z2) => {
    return valueOf(z1.from) - valueOf(z2.from);
  });
  zeitraumList.forEach((previousZeitraum) => {
    const previousFromValue = valueOf(previousZeitraum.from);
    const previousToValue = valueOf(previousZeitraum.to);
    if (previousZeitraum.from !== "") {
      zeitraumOptions.from.filter((fromOption) => !fromOption.hidden).forEach((fromOption) => {
        const fromOptionValue = valueOf(fromOption.value);
        fromOption.hidden = fromOptionValue >= previousFromValue && fromOptionValue <= previousToValue;
      });
    }
    if (previousZeitraum.from !== "" || previousZeitraum.to !== "") {
      zeitraumOptions.to.filter((toOption) => !toOption.hidden).forEach((toOption) => {
        const toOptionValue = valueOf(toOption.value);
        toOption.hidden = toOptionValue >= previousFromValue && toOptionValue <= previousToValue;
      });
    }
  });
  return zeitraumOptions;
};
const erwerbstaetigkeitLabels = {
  NichtSelbststaendig: "nichtselbständige Arbeit",
  Selbststaendig: "Gewinneinkünfte"
};
const erwerbstaetigkeitOptions = [
  {
    value: "NichtSelbststaendig",
    label: erwerbstaetigkeitLabels.NichtSelbststaendig
  },
  { value: "Selbststaendig", label: erwerbstaetigkeitLabels.Selbststaendig }
];
function Taetigkeit({
  elternteil,
  taetigkeitsIndex,
  isSelbststaendig,
  monthsBeforeBirth,
  onRemove
}) {
  const name = `${elternteil}.taetigkeitenNichtSelbstaendigUndSelbstaendig`;
  const {
    register,
    control,
    getValues,
    setValue,
    formState: { errors }
  } = useFormContext();
  const zeitraum = `${name}.${taetigkeitsIndex}.zeitraum`;
  const artTaetigkeitName = `${name}.${taetigkeitsIndex}.artTaetigkeit`;
  const bruttoEinkommenDurchschnitt = `${name}.${taetigkeitsIndex}.bruttoEinkommenDurchschnitt`;
  const isMinijob = `${name}.${taetigkeitsIndex}.isMinijob`;
  const versicherungen = `${name}.${taetigkeitsIndex}.versicherungen`;
  const {
    fields: zeitraumFields,
    append,
    remove
  } = useFieldArray({
    name: zeitraum,
    control
  });
  const [addButtonDisabled, setAddButtonDisabled] = reactExports.useState(() => false);
  const [monthsBeforeBirthList, setMonthsBeforeBirthList] = reactExports.useState(
    new Array(zeitraumFields.length).fill({
      from: cloneOptionsList(monthsBeforeBirth),
      to: cloneOptionsList(monthsBeforeBirth)
    })
  );
  const availableMonthsBeforeBirth = (lastZeitraumValue) => availableZeitraumOptions(
    monthsBeforeBirthList.map((v, index) => getValues(`${zeitraum}.${index}`)).map((v) => {
      return { from: v.from, to: v.to };
    }),
    {
      from: cloneOptionsList(monthsBeforeBirth),
      to: cloneOptionsList(monthsBeforeBirth)
    },
    "Integer",
    lastZeitraumValue
  );
  const onChangeZeitraum = (zeitraumIndex, zeitraumValue) => {
    const restFrom = availableMonthsBeforeBirth(zeitraumValue).from.filter(
      (value) => !value.hidden
    );
    setAddButtonDisabled(restFrom.length === 0);
  };
  useWatch({ name: artTaetigkeitName });
  const artTaetigkeit = getValues(artTaetigkeitName);
  const selbststaendig = artTaetigkeit === "Selbststaendig";
  const einkommenLabel = selbststaendig ? "Durchschnittlicher monatlicher Gewinn" : "Durchschnittliches Brutto-Einkommen";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(FormFieldGroup, { headline: `${taetigkeitsIndex + 1}. Tätigkeit`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(FormFieldGroup, { children: !!isSelbststaendig && /* @__PURE__ */ jsxRuntimeExports.jsx(
      CustomSelect,
      {
        autoWidth: true,
        register,
        name: artTaetigkeitName,
        label: "Art der Tätigkeit",
        options: erwerbstaetigkeitOptions,
        registerOptions: {
          required: "Dieses Feld ist erforderlich"
        },
        errors,
        required: true,
        info: infoTexts.erwerbstaetigkeitNichtSelbststaendigGewinneinkuenfte
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FormFieldGroup, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      CustomNumberField,
      {
        control,
        name: bruttoEinkommenDurchschnitt,
        label: einkommenLabel,
        suffix: "Euro",
        info: selbststaendig ? infoTexts.einkommenGewinneinkuenfte : infoTexts.einkommenNichtSelbststaendig
      }
    ) }),
    !selbststaendig && /* @__PURE__ */ jsxRuntimeExports.jsx(
      FormFieldGroup,
      {
        description: "War diese Tätigkeit ein Mini-Job?",
        info: infoTexts.minijobsMaxZahl,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          YesNoRadio,
          {
            name: isMinijob,
            register,
            registerOptions: {
              required: "Dieses Feld ist erforderlich"
            },
            errors,
            required: true
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(FormFieldGroup, { description: "In welchem Zeitraum haben Sie diese Tätigkeit ausgeübt?", children: [
      zeitraumFields.map((field, zeitraumIndex) => {
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: nsp("einkommen-form__zeitraum"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Zeitraum,
            {
              disabled: zeitraumIndex + 1 !== zeitraumFields.length,
              register,
              setValue,
              getValues,
              name: `${zeitraum}.${zeitraumIndex}`,
              "aria-label": `${zeitraumIndex + 1}. Zeitraum`,
              options: monthsBeforeBirthList[zeitraumIndex].from,
              optionsTo: monthsBeforeBirthList[zeitraumIndex].to,
              onChange: (zeitraum2) => onChangeZeitraum(zeitraumIndex, zeitraum2),
              errors,
              type: "Integer"
            }
          ),
          zeitraumFields.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              buttonStyle: "link",
              label: "Zeitraum entfernen",
              iconAfter: /* @__PURE__ */ jsxRuntimeExports.jsx(_default$2, {}),
              onClick: () => {
                setMonthsBeforeBirthList(
                  (monthsBeforeBirthList2) => monthsBeforeBirthList2.filter(
                    (month, indexMonth) => indexMonth !== zeitraumIndex
                  )
                );
                remove(zeitraumIndex);
                setAddButtonDisabled(false);
              }
            }
          )
        ] }, field.id);
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: nsp("einkommen-form__taetigkeit-buttons"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          buttonStyle: "secondary",
          disabled: addButtonDisabled,
          onClick: () => {
            const availableMonths = availableMonthsBeforeBirth();
            setMonthsBeforeBirthList([
              ...monthsBeforeBirthList,
              availableMonths
            ]);
            append({ from: "", to: "" });
            const availableMonthsSize = availableMonths.from.filter(
              (availableMonth) => !availableMonth.hidden
            ).length;
            setAddButtonDisabled(availableMonthsSize === 1);
          },
          label: "weiteren Zeitraum hinzufügen"
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Versicherungen,
      {
        hasRentenversicherungName: `${versicherungen}.hasRentenversicherung`,
        hasKrankenversicherungName: `${versicherungen}.hasKrankenversicherung`,
        hasArbeitslosenversicherungName: `${versicherungen}.hasArbeitslosenversicherung`,
        noneName: `${versicherungen}.none`
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        buttonStyle: "secondary",
        onClick: onRemove,
        label: "Tätigkeit löschen"
      }
    )
  ] });
}
function SelbstaendigAndErwerbstaetig({
  elternteil,
  isSelbststaendig,
  monthsBeforeBirth
}) {
  const { control } = useFormContext();
  const name = `${elternteil}.taetigkeitenNichtSelbstaendigUndSelbstaendig`;
  const taetigkeitenFields = useFieldArray({
    name,
    control
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    taetigkeitenFields.fields.map((field, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Taetigkeit,
      {
        elternteil,
        taetigkeitsIndex: index,
        isSelbststaendig,
        monthsBeforeBirth,
        onRemove: () => taetigkeitenFields.remove(index)
      },
      field.id
    )),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        buttonStyle: "primary",
        onClick: () => taetigkeitenFields.append(initialTaetigkeit),
        label: taetigkeitenFields.fields.length ? "weitere Tätigkeit hinzufügen" : "eine Tätigkeit hinzufügen"
      }
    )
  ] });
}
const MONTHS_BEFORE_BIRTH_OPTIONS = Array.from({ length: 12 }, (_, index) => ({
  label: `${index + 1}. Monat`,
  value: `${index + 1}`
}));
function EinkommenFormElternteil({ elternteil, elternteilName }) {
  const isErwerbstaetigVorGeburt = useAppSelector(
    (state) => stepErwerbstaetigkeitElternteilSelectors.isErwerbstaetigVorGeburt(
      state.stepErwerbstaetigkeit[elternteil]
    )
  );
  const isOnlyErwerbstaetig = useAppSelector(
    (state) => stepErwerbstaetigkeitElternteilSelectors.isOnlyErwerbstaetig(
      state.stepErwerbstaetigkeit[elternteil]
    )
  );
  const erwerbstaetigkeit = useAppSelector(
    (state) => state.stepErwerbstaetigkeit
  );
  const isSelbststaendig = erwerbstaetigkeit[elternteil].isSelbststaendig;
  const isMehrereTaetigkeiten = erwerbstaetigkeit[elternteil].mehrereTaetigkeiten === YesNo.YES;
  const isSelbstaendigAndErwerbstaetig = useAppSelector(
    (state) => stepErwerbstaetigkeitElternteilSelectors.isSelbstaendigAndErwerbstaetig(
      state.stepErwerbstaetigkeit[elternteil]
    )
  );
  const isOnlySelbstaendig = useAppSelector(
    (state) => stepErwerbstaetigkeitElternteilSelectors.isOnlySelbstaendig(
      state.stepErwerbstaetigkeit[elternteil]
    )
  );
  const hasMiniJob = useAppSelector(
    (state) => isErwerbstaetigVorGeburt && state.stepErwerbstaetigkeit[elternteil].monatlichesBrutto === "MiniJob"
  );
  const isSelbstaendigAndErwerbstaetigOrMehrereTaetigkeiten = isSelbstaendigAndErwerbstaetig || isMehrereTaetigkeiten;
  const isOnlyErwerbstaetigWithOneTaetigkeit = isOnlyErwerbstaetig && !isMehrereTaetigkeiten;
  const antragssteller = useAppSelector(
    stepAllgemeineAngabenSelectors.getAntragssteller
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "aria-label": elternteilName, children: [
    antragssteller === "FuerBeide" && /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-10", children: elternteilName }),
    !isErwerbstaetigVorGeburt && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Da Sie in den letzten 12 Monaten kein Einkommen angegeben haben, wird für Sie mit dem Mindestsatz gerechnet und Sie müssen keine weiteren Angaben zum Einkommen machen." }),
    !!isErwerbstaetigVorGeburt && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      !!isOnlyErwerbstaetigWithOneTaetigkeit && /* @__PURE__ */ jsxRuntimeExports.jsx(
        NurErwerbstaetig,
        {
          elternteil,
          monthsBeforeBirth: MONTHS_BEFORE_BIRTH_OPTIONS
        }
      ),
      !!isOnlySelbstaendig && /* @__PURE__ */ jsxRuntimeExports.jsx(NurSelbstaendig, { elternteil }),
      !hasMiniJob && /* @__PURE__ */ jsxRuntimeExports.jsx(
        SteuerUndVersicherung,
        {
          elternteil,
          isSelbstaendigAndErwerbstaetigOrMehrereTaetigkeiten
        }
      ),
      !!isSelbstaendigAndErwerbstaetigOrMehrereTaetigkeiten && /* @__PURE__ */ jsxRuntimeExports.jsx(
        SelbstaendigAndErwerbstaetig,
        {
          elternteil,
          isSelbststaendig,
          monthsBeforeBirth: MONTHS_BEFORE_BIRTH_OPTIONS
        }
      )
    ] })
  ] });
}
var RestartAlt = {};
var __assign$1 = commonjsGlobal && commonjsGlobal.__assign || function() {
  __assign$1 = Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
        t[p] = s[p];
    }
    return t;
  };
  return __assign$1.apply(this, arguments);
};
Object.defineProperty(RestartAlt, "__esModule", { value: true });
var jsx_runtime_1$1 = jsxRuntimeExports;
var SvgRestartAlt = function(props) {
  return (0, jsx_runtime_1$1.jsxs)("svg", __assign$1({ xmlns: "http://www.w3.org/2000/svg", enableBackground: "new 0 0 24 24", height: 24, viewBox: "0 0 24 24", width: 24, "data-testid": "RestartAltIcon", role: "graphics-symbol img", focusable: "false", "aria-hidden": "true" }, props, { children: [(0, jsx_runtime_1$1.jsx)("g", { children: (0, jsx_runtime_1$1.jsx)("path", { d: "M0,0h24v24H0V0z", fill: "none" }) }), (0, jsx_runtime_1$1.jsx)("g", { children: (0, jsx_runtime_1$1.jsxs)("g", { children: [(0, jsx_runtime_1$1.jsx)("path", { d: "M12,5V2L8,6l4,4V7c3.31,0,6,2.69,6,6c0,2.97-2.17,5.43-5,5.91v2.02c3.95-0.49,7-3.85,7-7.93C20,8.58,16.42,5,12,5z" }), (0, jsx_runtime_1$1.jsx)("path", { d: "M6,13c0-1.65,0.67-3.15,1.76-4.24L6.34,7.34C4.9,8.79,4,10.79,4,13c0,4.08,3.05,7.44,7,7.93v-2.02 C8.17,18.43,6,15.97,6,13z" })] }) })] }));
};
var _default$1 = RestartAlt.default = SvgRestartAlt;
var PermIdentity = {};
var __assign = commonjsGlobal && commonjsGlobal.__assign || function() {
  __assign = Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
        t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
Object.defineProperty(PermIdentity, "__esModule", { value: true });
var jsx_runtime_1 = jsxRuntimeExports;
var SvgPermIdentity = function(props) {
  return (0, jsx_runtime_1.jsxs)("svg", __assign({ xmlns: "http://www.w3.org/2000/svg", height: 24, viewBox: "0 0 24 24", width: 24, "data-testid": "PermIdentityIcon", role: "graphics-symbol img", focusable: "false", "aria-hidden": "true" }, props, { children: [(0, jsx_runtime_1.jsx)("path", { d: "M0 0h24v24H0z", fill: "none" }), (0, jsx_runtime_1.jsx)("path", { d: "M12 5.9c1.16 0 2.1.94 2.1 2.1s-.94 2.1-2.1 2.1S9.9 9.16 9.9 8s.94-2.1 2.1-2.1m0 9c2.97 0 6.1 1.46 6.1 2.1v1.1H5.9V17c0-.64 3.13-2.1 6.1-2.1M12 4C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 9c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z" })] }));
};
var _default = PermIdentity.default = SvgPermIdentity;
function ParentSummation({
  name,
  monthCount,
  totalPayoutAmount,
  totalIncomeAmount,
  hideSum
}) {
  const formattedMonthText = `${monthCount} Monat${monthCount > 1 ? "e" : ""}`;
  const formattedTotalPayoutAmount = formatAsCurrency(totalPayoutAmount);
  const formattedTotalIncomeAmount = formatAsCurrency(totalIncomeAmount);
  const formattedTotalSum = formatAsCurrency(
    totalPayoutAmount + totalIncomeAmount
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(_default, {}),
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: name }),
      " ",
      formattedMonthText
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "mt-auto", children: [
      "Elterngeld: ",
      formattedTotalPayoutAmount
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
      "Einkommen: ",
      formattedTotalIncomeAmount
    ] }),
    !hideSum && /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
      "Summe: ",
      formattedTotalSum
    ] })
  ] });
}
function SummationFooter({ data, className }) {
  const isSingleParent = data.length === 1;
  const formattedSumOfAllAmounts = formatAsCurrency(sumUpAllAmounts(data));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "footer",
    {
      "aria-label": "Gesamtsumme",
      className: classNames(
        className,
        "flex flex-wrap justify-evenly gap-24 text-center"
      ),
      children: [
        data.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex basis-[30ch] flex-col items-center",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              ParentSummation,
              {
                ...entry,
                name: isSingleParent ? void 0 : entry.name,
                hideSum: isSingleParent
              }
            )
          },
          entry.name
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "basis-full", children: [
          "Gesamtsumme der Planung: ",
          formattedSumOfAllAmounts
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "basis-full text-14", children: "Hinweis: Mutterschutz wird nicht in der Summe berücksichtigt" })
      ]
    }
  );
}
function sumUpAllAmounts(data) {
  return data.reduce(
    (sum, { totalPayoutAmount, totalIncomeAmount }) => sum + totalPayoutAmount + totalIncomeAmount,
    0
  );
}
function useSummarizeData() {
  const applicant = useAppSelector(
    (state) => state.stepAllgemeineAngaben.antragstellende
  );
  const isSingleParent = applicant === "EinenElternteil";
  const parentNames = useAppSelector(
    stepAllgemeineAngabenSelectors.getElternteilNames
  );
  const months = useAppSelector(monthsSelector);
  const amounts = useAppSelector(amountsSelector);
  const data = [
    {
      name: parentNames.ET1,
      monthCount: countNumberOfPlannedMonths(months.ET1),
      totalPayoutAmount: sumUpTotalPayoutAmount(months.ET1, amounts.ET1),
      totalIncomeAmount: sumUpTotalIncomeAmount(amounts.ET1)
    }
  ];
  if (!isSingleParent) {
    data.push({
      name: parentNames.ET2,
      monthCount: countNumberOfPlannedMonths(months.ET2),
      totalPayoutAmount: sumUpTotalPayoutAmount(months.ET2, amounts.ET2),
      totalIncomeAmount: sumUpTotalIncomeAmount(amounts.ET2)
    });
  }
  return data;
}
const monthsSelector = createAppSelector(
  (state) => state.monatsplaner.elternteile.ET1.months,
  (state) => state.monatsplaner.elternteile.ET2.months,
  (monthsET1, monthsET2) => ({ ET1: monthsET1, ET2: monthsET2 })
);
const amountsSelector = createAppSelector(
  (state) => state.stepRechner.ET1.elterngeldResult,
  (state) => state.stepRechner.ET2.elterngeldResult,
  (monthsET1, monthsET2) => ({ ET1: monthsET1, ET2: monthsET2 })
);
function countNumberOfPlannedMonths(months) {
  return months.filter((month) => month.type !== "None").length;
}
function sumUpTotalPayoutAmount(months, amounts) {
  const rows = amounts.state === "success" ? amounts.data : [];
  const amountsPerMonth = getAmountsPerMonth(rows);
  const payoutPerMonth = amountsPerMonth.map(
    (row, index) => {
      var _a;
      return getPayoutAmount(row, (_a = months[index]) == null ? void 0 : _a.type);
    }
  );
  return sumUp(payoutPerMonth);
}
function sumUpTotalIncomeAmount(amounts) {
  const rows = amounts.state === "success" ? amounts.data : [];
  const amountsPerMonth = getAmountsPerMonth(rows);
  const incomePerMonth = amountsPerMonth.map((row) => row.nettoEinkommen);
  return sumUp(incomePerMonth);
}
function getPayoutAmount(row, type) {
  switch (type) {
    case "BEG":
      return row.basisElternGeld;
    case "EG+":
    case "PSB":
      return row.elternGeldPlus;
    case "None":
    case void 0:
      return 0;
  }
}
function getAmountsPerMonth(rows) {
  return Array.from(
    { length: EgrConst.lebensMonateMaxNumber },
    (_, monthIndex) => rows.find((row) => rowIncludesMonthIndex(row, monthIndex)) ?? getEmptyElterngeldRow(monthIndex)
  );
}
function rowIncludesMonthIndex(row, monthIndex) {
  const fromMonthIndex = row.vonLebensMonat - 1;
  const tillMonthIndex = row.bisLebensMonat - 1;
  return fromMonthIndex <= monthIndex && monthIndex <= tillMonthIndex;
}
function getEmptyElterngeldRow(monthIndex) {
  return {
    vonLebensMonat: monthIndex,
    bisLebensMonat: monthIndex,
    basisElternGeld: 0,
    elternGeldPlus: 0,
    nettoEinkommen: 0
  };
}
function sumUp(values) {
  return values.reduce((sum, value) => sum + value, 0);
}
function usePlanningContingentMonths() {
  const elternteile = useAppSelector((state) => state.monatsplaner.elternteile);
  const basisAvailable = elternteile.remainingMonths.basiselterngeld;
  const plusAvailable = elternteile.remainingMonths.elterngeldplus;
  const bonusAvailable = elternteile.remainingMonths.partnerschaftsbonus;
  const basisTaken = countTakenMonthsByBothParents(elternteile, "BEG");
  const plusTaken = countTakenMonthsByBothParents(elternteile, "EG+");
  const bonusTaken = countTakenMonthsByBothParents(elternteile, "PSB");
  return {
    basis: {
      available: basisAvailable,
      taken: basisMonthsTakenIncludingPlusMonths(basisTaken, plusTaken)
    },
    plus: {
      available: plusAvailable,
      taken: plusMonthsTakenIncludingBasisMonths(plusTaken, basisTaken)
    },
    bonus: {
      available: bonusAvailable,
      taken: bonusMonthsTakenInParallel(bonusTaken)
    }
  };
}
function countTakenMonthsByBothParents(elternteile, variant) {
  const allMonths = [...elternteile.ET1.months, ...elternteile.ET2.months];
  return allMonths.filter(({ type }) => type === variant).length;
}
function basisMonthsTakenIncludingPlusMonths(basisTaken, plusTaken) {
  return basisTaken + Math.ceil(plusTaken / 2);
}
function plusMonthsTakenIncludingBasisMonths(plusTaken, basisTaken) {
  return plusTaken + basisTaken * 2;
}
function bonusMonthsTakenInParallel(bonusTaken) {
  return bonusTaken / 2;
}
function usePartnerschaftlicheVerteilungTracking() {
  const calculationParameters = useAppSelector(calculationParameterSelector);
  reactExports.useEffect(() => {
    const { monthsET1, monthsET2, singleApplicant } = calculationParameters;
    trackPartnerschaftlicheVerteilung(monthsET1, monthsET2, singleApplicant);
  }, [calculationParameters]);
}
const calculationParameterSelector = createAppSelector(
  [
    (state) => state.monatsplaner.elternteile.ET1.months,
    (state) => state.monatsplaner.elternteile.ET2.months,
    (state) => state.stepAllgemeineAngaben.antragstellende
  ],
  (monthsET1, monthsET2, antragstellende) => ({
    monthsET1: monthsET1.map((month) => month.type),
    monthsET2: monthsET2.map((month) => month.type),
    singleApplicant: antragstellende === "EinenElternteil"
  })
);
function NotificationMaxSimultaneousBEGMonths() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    "Basiselterngeld können Sie nur für einen Lebensmonat in den ersten 12 Lebensmonaten gleichzeitig bekommen.",
    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
    "Diese Einschränkung gilt nicht für besonders früh geborene Kinder, Mehrlinge, Neugeborene mit Behinderung und Geschwisterkinder mit Behinderung."
  ] });
}
const initialLebensmonateVisibleLength = 18;
const emptyAmountElterngeldRows = Array.from({
  length: EgrConst.lebensMonateMaxNumber
}).fill("empty");
const getAmountElterngeldRow = (result) => {
  if (result.state !== "success") {
    return emptyAmountElterngeldRows;
  }
  return emptyAmountElterngeldRows.map((_, index) => {
    const lebensmonat = index + 1;
    const resultRow = result.data.find(
      (row) => lebensmonat >= row.vonLebensMonat && lebensmonat <= row.bisLebensMonat
    );
    if (!resultRow) return "empty";
    return {
      amountBasiselterngeld: resultRow.basisElternGeld,
      amountElterngeldPlus: resultRow.elternGeldPlus
    };
  });
};
const begCountOf = (months) => months.filter((month) => month.type === "BEG").length;
const checkForNotificationBEGHintMinMax = (elternteile, antragstellende) => {
  const begEt1 = begCountOf(elternteile.ET1.months);
  const begEt2 = begCountOf(elternteile.ET2.months);
  return antragstellende === "FuerBeide" && (begEt1 >= 11 && begEt2 <= 1 || begEt2 >= 11 && begEt1 <= 1);
};
const checkMaxBEG = (elternteile, antragstellende) => {
  const begEt1 = begCountOf(elternteile.ET1.months);
  const begEt2 = begCountOf(elternteile.ET2.months);
  return antragstellende === "FuerBeide" && (begEt1 > 12 || begEt2 > 12);
};
function Monatsplaner({ mutterSchutzMonate }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const partnerMonate = useAppSelector(
    (state) => state.monatsplaner.partnerMonate
  );
  const isMonatsplanerOverlayVisible = useAppSelector(
    stepRechnerSelectors.isMonatsplanerOverlayVisible
  );
  const lebensmonate = useAppSelector(
    stepNachwuchsSelectors.getLebensmonateAfterBirth
  );
  const elternteile = useAppSelector((state) => state.monatsplaner.elternteile);
  const elternteilNames = useAppSelector(
    stepAllgemeineAngabenSelectors.getElternteilNames
  );
  const antragstellende = useAppSelector(
    (state) => state.stepAllgemeineAngaben.antragstellende
  );
  const selectablePSBMonths = useAppSelector(
    monatsplanerSelectors.getSelectablePSBMonthIndices
  );
  const mutterschutzElternteil = useAppSelector(
    (state) => state.monatsplaner.mutterschutzElternteil
  );
  const amountElterngeldRowsET1 = useAppSelector(
    createAppSelector(
      (state) => state.stepRechner.ET1.elterngeldResult,
      getAmountElterngeldRow
    )
  );
  const amountElterngeldRowsET2 = useAppSelector(
    createAppSelector(
      (state) => state.stepRechner.ET2.elterngeldResult,
      getAmountElterngeldRow
    )
  );
  const alleinerziehend = useAppSelector(
    (state) => state.stepAllgemeineAngaben.alleinerziehend
  );
  const elternteileSettings = useAppSelector(
    (state) => state.monatsplaner.settings
  );
  const [notificationMessages, setNotificationMessages] = reactExports.useState(null);
  const [lebensmonateVisibleLength, setLebensmonateVisibleLength] = reactExports.useState(
    initialLebensmonateVisibleLength
  );
  const lastToggledElterngeldTypeRef = reactExports.useRef();
  const {
    basiselterngeld: BEGRemainingMonth,
    elterngeldplus: EGPlusRemainingMonth
  } = elternteile.remainingMonths;
  const handleNextPage = () => {
    const validation = validateElternteile(elternteile);
    const validationMaxBEGFailed = checkMaxBEG(elternteile, antragstellende);
    if (validationMaxBEGFailed) {
      setNotificationMessages([/* @__PURE__ */ jsxRuntimeExports.jsx(NotificationBEGMax, {}, "beg-max")]);
    } else if (!validation.isValid) {
      setNotificationMessages([
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          NotificationValidationMonatsplaner,
          {
            errorCodes: validation.errorCodes
          },
          "validation-monatsplaner-generic-error-codes"
        )
      ]);
    } else {
      navigate(formSteps.zusammenfassungUndDaten.route);
    }
  };
  const handlePrint = () => {
    window.print();
  };
  const onUnMountToast = () => setNotificationMessages(null);
  reactExports.useEffect(() => {
    const validation = validateElternteile(elternteile);
    const doesNotHaveContinuousEGAfterBEGAnspruch = validation && !validation.isValid && validation.errorCodes.includes("DoesNotHaveContinuousEGAfterBEGAnspruch");
    const doesNotHaveTheMinimumAmountOfEGMonthsOrNoneAtAll = validation && !validation.isValid && validation.errorCodes.includes(
      "DoesNotHaveTheMinimumAmountOfEGMonthsOrNoneAtAll"
    );
    const showNotificationBEGHintMinMax = checkForNotificationBEGHintMinMax(
      elternteile,
      antragstellende
    );
    const validationMaxBEGFailed = checkMaxBEG(elternteile, antragstellende);
    const begAndEgPlusEmpty = BEGRemainingMonth === 0 && EGPlusRemainingMonth === 0;
    const begEmptyOnly = BEGRemainingMonth === 0 && EGPlusRemainingMonth !== 0;
    if (validationMaxBEGFailed) {
      setNotificationMessages([/* @__PURE__ */ jsxRuntimeExports.jsx(NotificationBEGMax, {}, "beg-max")]);
    } else if (doesNotHaveTheMinimumAmountOfEGMonthsOrNoneAtAll && alleinerziehend) {
      setNotificationMessages([/* @__PURE__ */ jsxRuntimeExports.jsx(NotificationBEGHintMin, {}, "beg-hint-min")]);
    } else if (doesNotHaveTheMinimumAmountOfEGMonthsOrNoneAtAll && !alleinerziehend || showNotificationBEGHintMinMax) {
      setNotificationMessages([
        /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationBEGHintMinMax, {}, "beg-hint-min-max")
      ]);
    } else if (doesNotHaveContinuousEGAfterBEGAnspruch) {
      setNotificationMessages([
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          NotificationValidationMonatsplaner,
          {
            errorCodes: ["DoesNotHaveContinuousEGAfterBEGAnspruch"]
          },
          "validation-monatsplaner-does-not-have-continuous-eg-after-beg-anspruch"
        )
      ]);
    } else if (begAndEgPlusEmpty) {
      setNotificationMessages([
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          NotificationNoFurtherMonthAvailable,
          {
            targetType: "BEGAndEG+"
          },
          "no-further-month-available-beg-and-egplus"
        )
      ]);
    } else if (begEmptyOnly) {
      setNotificationMessages([
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          NotificationNoFurtherMonthAvailable,
          {
            targetType: "BEG"
          },
          "no-further-month-available-beg"
        )
      ]);
    }
  }, [
    BEGRemainingMonth,
    EGPlusRemainingMonth,
    antragstellende,
    elternteile,
    elternteile.ET1.months,
    elternteile.ET2.months,
    alleinerziehend
  ]);
  reactExports.useEffect(() => {
  }, []);
  const {
    highestAllowedDeselectablePSBIndex,
    lowestAllowedDeselectablePSBIndex
  } = {
    highestAllowedDeselectablePSBIndex: Math.max(
      ...selectablePSBMonths.deselectableIndices
    ),
    lowestAllowedDeselectablePSBIndex: Math.min(
      ...selectablePSBMonths.deselectableIndices
    )
  };
  const handleToggleMonth = (elternteil, columnType, monthIndex) => {
    const targetType = elternteile[elternteil].months[monthIndex].type === columnType ? "None" : columnType;
    if (monthIndex > lowestAllowedDeselectablePSBIndex && monthIndex < highestAllowedDeselectablePSBIndex) {
      setNotificationMessages([
        /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationPSBNotDeselectable, {}, "psb-not-deselectable")
      ]);
      return;
    }
    dispatch(
      monatsplanerActions.changeMonth({
        elternteil,
        targetType,
        partnerMonate,
        monthIndex
      })
    );
    if (columnType === "PSB") {
      const automaticallySelectedIndex = getAutomaticallySelectedPSBMonthIndex(
        elternteile.ET1.months,
        monthIndex
      );
      setNotificationMessages([
        ...antragstellende === "FuerBeide" ? [
          /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationPSBChangeOtherElternteil, {}, "psb-change-other-elternteil")
        ] : [],
        ...automaticallySelectedIndex ? [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            NotificationPSBAutomaticallySelection,
            {
              label: lebensmonate[automaticallySelectedIndex].labelLong
            },
            "psb-automatically-selection"
          )
        ] : []
      ]);
    }
    lastToggledElterngeldTypeRef.current = {
      targetType,
      targetColumnType: columnType
    };
  };
  const handleDragOver = (elternteil, columnType, monthIndex) => {
    if (!lastToggledElterngeldTypeRef.current) return;
    const { targetType, targetColumnType } = lastToggledElterngeldTypeRef.current;
    if (columnType !== targetColumnType) return;
    if (monthIndex > lowestAllowedDeselectablePSBIndex && monthIndex < highestAllowedDeselectablePSBIndex) {
      setNotificationMessages([
        /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationPSBNotDeselectable, {}, "psb-not-deselectable")
      ]);
      return;
    }
    dispatch(
      monatsplanerActions.changeMonth({
        elternteil,
        targetType,
        partnerMonate,
        monthIndex
      })
    );
  };
  const handlePageBack = () => navigate(formSteps.elterngeldvarianten.route);
  function isBEGMonthSelectable(elternteil, monthIndex) {
    const lastPossibleMonthIndex = partnerMonate ? 13 : 11;
    const isInValidRange = monthIndex <= lastPossibleMonthIndex;
    const moreMonthsAvailable = elternteile.remainingMonths.basiselterngeld > 0;
    const changeMonthSettings = {
      targetType: "BEG",
      elternteil,
      monthIndex
    };
    const isBlockedBySimulataneousMonth = canNotChangeBEGDueToSimultaneousMonthRules(
      changeMonthSettings,
      elternteile,
      elternteileSettings
    );
    const isBlockedByLimitReached = canNotChangeBEGDueToLimitReachedPerParent(
      changeMonthSettings,
      elternteile,
      elternteileSettings
    );
    return moreMonthsAvailable && isInValidRange && !isBlockedBySimulataneousMonth && !isBlockedByLimitReached;
  }
  function isEGPMonthSelectable(elternteil, monthIndex) {
    const changeMonthSettings = {
      targetType: "EG+",
      elternteil,
      monthIndex
    };
    const isBlockedByLimitReached = canNotChangeEGPDueToLimitReachedPerParent(
      changeMonthSettings,
      elternteile,
      elternteileSettings
    );
    return !isBlockedByLimitReached;
  }
  const [
    showedNotificationForMaxSimultaneousBEGMonths,
    setShowedNotificationForMaxSimultaneousBEGMonths
  ] = reactExports.useState(false);
  function possiblyShowNotificationForMaxSimultaneousBEGMonths() {
    const reachedLimit = reachedLimitOfSimultaneousBEGMonths(elternteile);
    const isException = isExceptionToSimulatenousMonthRestrictions(elternteileSettings);
    if (reachedLimit && !isException) {
      if (!showedNotificationForMaxSimultaneousBEGMonths) {
        setShowedNotificationForMaxSimultaneousBEGMonths(true);
        setNotificationMessages([
          /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationMaxSimultaneousBEGMonths, {}, "max-simultatenous-beg-months")
        ]);
      }
    } else {
      setShowedNotificationForMaxSimultaneousBEGMonths(false);
    }
  }
  reactExports.useEffect(possiblyShowNotificationForMaxSimultaneousBEGMonths, [
    elternteile,
    elternteileSettings,
    showedNotificationForMaxSimultaneousBEGMonths
  ]);
  const summationData = useSummarizeData();
  const planningContingentMonths = usePlanningContingentMonths();
  const elementToViewOnRepeatPlanning = reactExports.useRef(null);
  function repeatPlanning() {
    var _a, _b;
    dispatch(monatsplanerActions.resetMonths());
    (_a = elementToViewOnRepeatPlanning.current) == null ? void 0 : _a.scrollIntoView({
      behavior: "smooth"
    });
    (_b = elementToViewOnRepeatPlanning.current) == null ? void 0 : _b.focus({ preventScroll: true });
  }
  usePartnerschaftlicheVerteilungTracking();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: classNames(
          nsp("monatsplaner"),
          alleinerziehend === YesNo.YES && nsp("monatsplaner--alleinerziehend")
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: nsp("monatsplaner__header"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "h2",
              {
                ref: elementToViewOnRepeatPlanning,
                tabIndex: -1,
                className: "mb-10",
                children: "Monatsplaner"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Im Monatsplaner können Sie Ihre individuelle Kombination von Elterngeld für jeden Lebensmonat Ihres Kindes planen. In der Tabelle unten können Sie durch anklicken des jeweiligen Monats wählen, wann Sie welches Elterngeld bekommen möchten. Darüber sehen Sie jeweils wie viele Monate Sie noch zur Verfügung haben." })
          ] }),
          !!isMonatsplanerOverlayVisible && /* @__PURE__ */ jsxRuntimeExports.jsx(AccessControl, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: classNames(
                isMonatsplanerOverlayVisible && nsp("monatsplaner__blur")
              ),
              "aria-hidden": isMonatsplanerOverlayVisible,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  PlanningContingent,
                  {
                    className: "print:hidden",
                    months: planningContingentMonths
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: nsp("monatsplaner__tables"), children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Elternteil,
                    {
                      className: nsp("monatsplaner__sticky-elternteil"),
                      elternteil: elternteile.ET1,
                      selectablePSBMonths,
                      elternteilName: alleinerziehend === YesNo.YES ? "" : elternteilNames.ET1,
                      onToggleMonth: (columnType, monthIndex) => handleToggleMonth("ET1", columnType, monthIndex),
                      onDragOverMonth: (columnType, monthIndex) => handleDragOver("ET1", columnType, monthIndex),
                      isBEGMonthSelectable: (monthIndex) => isBEGMonthSelectable("ET1", monthIndex),
                      isEGPMonthSelectable: (monthIndex) => isEGPMonthSelectable("ET1", monthIndex),
                      lebensmonate: lebensmonate.slice(0, lebensmonateVisibleLength),
                      amounts: amountElterngeldRowsET1,
                      hasMutterschutz: mutterschutzElternteil === "ET1",
                      mutterSchutzMonate,
                      partnerMonate,
                      remainingMonths: elternteile.remainingMonths,
                      isElternteilOne: true
                    }
                  ),
                  antragstellende === "FuerBeide" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Elternteil,
                    {
                      className: nsp("monatsplaner__sticky-elternteil"),
                      elternteil: elternteile.ET2,
                      selectablePSBMonths,
                      elternteilName: elternteilNames.ET2,
                      onToggleMonth: (columnType, monthIndex) => handleToggleMonth("ET2", columnType, monthIndex),
                      onDragOverMonth: (columnType, monthIndex) => handleDragOver("ET2", columnType, monthIndex),
                      isBEGMonthSelectable: (monthIndex) => isBEGMonthSelectable("ET2", monthIndex),
                      isEGPMonthSelectable: (monthIndex) => isEGPMonthSelectable("ET2", monthIndex),
                      lebensmonate: lebensmonate.slice(0, lebensmonateVisibleLength),
                      amounts: amountElterngeldRowsET2,
                      hasMutterschutz: mutterschutzElternteil === "ET2",
                      mutterSchutzMonate,
                      partnerMonate,
                      remainingMonths: elternteile.remainingMonths,
                      hideLebensmonateOnDesktop: true
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: nsp("monatsplaner__footer"), children: [
                  lebensmonateVisibleLength === initialLebensmonateVisibleLength && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      buttonStyle: "secondary",
                      label: "Alle Monate anzeigen",
                      iconBefore: /* @__PURE__ */ jsxRuntimeExports.jsx(_default$5, {}),
                      onClick: () => setLebensmonateVisibleLength(lebensmonate.length)
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SummationFooter,
                    {
                      className: "w-full bg-white p-16",
                      data: summationData
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Dieses Ergebnis ist nicht rechtsverbindlich. Erst nach der Geburt Ihres Kindes kann Ihre zuständige Elterngeldstelle eine konkrete und rechtsverbindliche Berechnung Ihres Anspruchs vornehmen." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Toast,
                    {
                      messages: notificationMessages,
                      active: notificationMessages !== null && notificationMessages.length > 0,
                      onUnMount: onUnMountToast,
                      timeout: 4500
                    }
                  )
                ] })
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "my-40 flex flex-wrap gap-32 print:hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          buttonStyle: "link",
          label: "Planung wiederholen",
          iconBefore: /* @__PURE__ */ jsxRuntimeExports.jsx(_default$1, {}),
          onClick: repeatPlanning
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          buttonStyle: "link",
          label: "Download der Planung",
          iconBefore: /* @__PURE__ */ jsxRuntimeExports.jsx(_default$6, {}),
          onClick: handlePrint
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: nsp("monatsplaner__button-group"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: handlePageBack,
          label: "Zurück",
          buttonStyle: "secondary"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleNextPage, label: "Zur Übersicht" })
    ] })
  ] });
}
export {
  CustomRadio as C,
  Description as D,
  EinkommenFormElternteil as E,
  FormFieldGroup as F,
  InfoDialog as I,
  Monatsplaner as M,
  RechnerResultTable as R,
  Toast as T,
  YesNoRadio as Y,
  Zeitraum as Z,
  _default$2 as _,
  useController as a,
  IMaskInput as b,
  IMask as c,
  useFieldArray as d,
  CustomCheckbox as e,
  useFormContext as f,
  get as g,
  FormProvider as h,
  infoTexts as i,
  FootNoteNumber as j,
  CustomNumberField as k,
  availableZeitraumOptions as l,
  useForm as u
};
