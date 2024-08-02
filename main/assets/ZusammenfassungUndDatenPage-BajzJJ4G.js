import { j as jsxRuntimeExports, B as Button, a0 as _default$3, M as commonjsGlobal, r as reactExports, c as classNames, a7 as useAppStore, Y as YesNo, V as formatAsCurrency, a8 as ElterngeldvarianteBadge, a9 as _default$4, b as useAppSelector, Z as stepNachwuchsSelectors, W as createAppSelector, a as useNavigate, P as Page, f as formSteps, n as nsp } from "./index-CTUEB2yx.js";
import { E as EgrConst } from "./egr-configuration-Cwpx2zXF.js";
function PrintButton() {
  const handlePrint = () => {
    window.print();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Button,
    {
      buttonStyle: "link",
      label: "Download der Planung",
      iconBefore: /* @__PURE__ */ jsxRuntimeExports.jsx(_default$3, {}),
      onClick: handlePrint
    }
  );
}
var ThumbUpOffAlt = {};
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
Object.defineProperty(ThumbUpOffAlt, "__esModule", { value: true });
var jsx_runtime_1$2 = jsxRuntimeExports;
var SvgThumbUpOffAlt = function(props) {
  return (0, jsx_runtime_1$2.jsxs)("svg", __assign$2({ xmlns: "http://www.w3.org/2000/svg", height: 24, viewBox: "0 0 24 24", width: 24, "data-testid": "ThumbUpOffAltIcon", role: "graphics-symbol img", focusable: "false", "aria-hidden": "true" }, props, { children: [(0, jsx_runtime_1$2.jsx)("path", { d: "M0 0h24v24H0V0z", fill: "none" }), (0, jsx_runtime_1$2.jsx)("path", { d: "M13.11 5.72l-.57 2.89c-.12.59.04 1.2.42 1.66.38.46.94.73 1.54.73H20v1.08L17.43 18H9.34c-.18 0-.34-.16-.34-.34V9.82l4.11-4.1M14 2L7.59 8.41C7.21 8.79 7 9.3 7 9.83v7.83C7 18.95 8.05 20 9.34 20h8.1c.71 0 1.36-.37 1.72-.97l2.67-6.15c.11-.25.17-.52.17-.8V11c0-1.1-.9-2-2-2h-5.5l.92-4.65c.05-.22.02-.46-.08-.66-.23-.45-.52-.86-.88-1.22L14 2zM4 9H2v11h2c.55 0 1-.45 1-1v-9c0-.55-.45-1-1-1z" })] }));
};
var _default$2 = ThumbUpOffAlt.default = SvgThumbUpOffAlt;
var ThumbDownOffAlt = {};
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
Object.defineProperty(ThumbDownOffAlt, "__esModule", { value: true });
var jsx_runtime_1$1 = jsxRuntimeExports;
var SvgThumbDownOffAlt = function(props) {
  return (0, jsx_runtime_1$1.jsxs)("svg", __assign$1({ xmlns: "http://www.w3.org/2000/svg", height: 24, viewBox: "0 0 24 24", width: 24, "data-testid": "ThumbDownOffAltIcon", role: "graphics-symbol img", focusable: "false", "aria-hidden": "true" }, props, { children: [(0, jsx_runtime_1$1.jsx)("path", { d: "M24 24H0V0h24v24z", fill: "none" }), (0, jsx_runtime_1$1.jsx)("path", { d: "M10.89 18.28l.57-2.89c.12-.59-.04-1.2-.42-1.66-.38-.46-.94-.73-1.54-.73H4v-1.08L6.57 6h8.09c.18 0 .34.16.34.34v7.84l-4.11 4.1M10 22l6.41-6.41c.38-.38.59-.89.59-1.42V6.34C17 5.05 15.95 4 14.66 4h-8.1c-.71 0-1.36.37-1.72.97l-2.67 6.15c-.11.25-.17.52-.17.8V13c0 1.1.9 2 2 2h5.5l-.92 4.65c-.05.22-.02.46.08.66.23.45.52.86.88 1.22L10 22zm10-7h2V4h-2c-.55 0-1 .45-1 1v9c0 .55.45 1 1 1z" })] }));
};
var _default$1 = ThumbDownOffAlt.default = SvgThumbDownOffAlt;
function UserFeedbackSection({ className }) {
  const labelIdentifier = reactExports.useId();
  const [isCompleted, setIsCompleted] = reactExports.useState(false);
  function sendFeedback() {
    setIsCompleted(true);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "aside",
    {
      "aria-labelledby": labelIdentifier,
      className: classNames(
        "flex gap-y-16 gap-x-24 bg-primary-light flex-wrap p-24",
        className
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { id: labelIdentifier, className: "basis-full text-base font-bold", children: isCompleted ? "Vielen Dank für Ihr Feedback!" : "War der Elterngeldrechner mit Planer für Sie hilfreich?" }),
        !isCompleted && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              id: "feedback-button-ja-war-hilfreich",
              label: "Ja",
              iconBefore: /* @__PURE__ */ jsxRuntimeExports.jsx(_default$2, {}),
              buttonStyle: "secondary",
              onClick: sendFeedback
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              id: "feedback-button-nein-war-nicht-hilfreich",
              label: "Nein",
              iconBefore: /* @__PURE__ */ jsxRuntimeExports.jsx(_default$1, {}),
              buttonStyle: "secondary",
              onClick: sendFeedback
            }
          )
        ] })
      ]
    }
  );
}
function DatenInAntragUebernehmenButton() {
  const store = useAppStore();
  const {
    stepAllgemeineAngaben,
    stepNachwuchs,
    stepErwerbstaetigkeit,
    stepEinkommen,
    stepRechner,
    monatsplaner,
    configuration
  } = store.getState();
  const mapYesNo = (yesNo) => {
    return yesNo === YesNo.YES ? "1" : "0";
  };
  const getAlleinerziehend = () => {
    return mapYesNo(stepAllgemeineAngaben.alleinerziehend);
  };
  const getSteuerklasse = (elternteil) => {
    return stepEinkommen[elternteil].steuerKlasse ?? "";
  };
  const getMischTaetigkeit = (elternteil, position) => {
    const taetigkeit = stepEinkommen[elternteil].taetigkeitenNichtSelbstaendigUndSelbstaendig[position];
    switch (taetigkeit == null ? void 0 : taetigkeit.artTaetigkeit) {
      case "NichtSelbststaendig":
        return "2";
      case "Selbststaendig":
        return "1";
    }
    return "";
  };
  const getEinkommenNachGeburt = (elternteil) => {
    return stepRechner[elternteil].bruttoEinkommenZeitraum.length > 0 ? "1" : "0";
  };
  const isET2Present = () => {
    return stepAllgemeineAngaben.antragstellende !== "EinenElternteil";
  };
  const hasET2Mischtaetigkeit = () => {
    return isET2Present() && isMischtaetigkeit("ET2");
  };
  const isMischtaetigkeit = (elternteil) => {
    const erwerbstaetigkeit = stepErwerbstaetigkeit[elternteil];
    return erwerbstaetigkeit.isNichtSelbststaendig && erwerbstaetigkeit.isSelbststaendig;
  };
  const getKirchensteuer = (elternteil) => {
    return mapYesNo(stepEinkommen[elternteil].zahlenSieKirchenSteuer);
  };
  const getEinkommenVorgeburt = (elternteil) => {
    return mapYesNo(stepErwerbstaetigkeit[elternteil].vorGeburt);
  };
  const getMutterschaftsleistungen = () => {
    return mapYesNo(stepAllgemeineAngaben.mutterschaftssleistungen);
  };
  const monthPlanner = (elternteil) => {
    const months = monatsplaner.elternteile[elternteil].months;
    return months.map((month) => {
      switch (month.type) {
        case "BEG":
          return "1";
        case "EG+":
          return "2";
        case "PSB":
          return "3";
      }
      return "0";
    }).join(",");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "form",
    {
      method: "post",
      id: "anton-remote-eao-post-form",
      action: configuration.elternGeldDigitalWizardUrl,
      encType: "application/x-www-form-urlencoded",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            name: "planungP1",
            defaultValue: monthPlanner("ET1"),
            readOnly: true,
            type: "hidden"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            name: "mehrlinge_anzahl",
            defaultValue: stepNachwuchs.anzahlKuenftigerKinder,
            readOnly: true,
            type: "hidden"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            name: "kind_geburtstag",
            defaultValue: stepNachwuchs.wahrscheinlichesGeburtsDatum,
            readOnly: true,
            type: "hidden"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            name: "alleinerziehend",
            defaultValue: getAlleinerziehend(),
            readOnly: true,
            type: "hidden"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            name: "mutterschaftsleistung",
            defaultValue: getMutterschaftsleistungen(),
            readOnly: true,
            type: "hidden"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            name: "p1_et_vorgeburt",
            defaultValue: getEinkommenVorgeburt("ET1"),
            readOnly: true,
            type: "hidden"
          }
        ),
        isMischtaetigkeit("ET1") && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            name: "p1_vg_misch_t1",
            defaultValue: getMischTaetigkeit("ET1", 0),
            readOnly: true,
            type: "hidden"
          }
        ) && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            name: "p1_vg_misch_t2",
            defaultValue: getMischTaetigkeit("ET1", 1),
            readOnly: true,
            type: "hidden"
          }
        ) && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            name: "p1_vg_misch_t3",
            defaultValue: getMischTaetigkeit("ET1", 2),
            readOnly: true,
            type: "hidden"
          }
        ) ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            name: "p1_misch_kirche",
            defaultValue: getKirchensteuer("ET1"),
            readOnly: true,
            type: "hidden"
          }
        ) : null,
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            name: "p1_et_nachgeburt",
            defaultValue: getEinkommenNachGeburt("ET1"),
            readOnly: true,
            type: "hidden"
          }
        ),
        hasET2Mischtaetigkeit() && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            name: "p2_vg_misch_t1",
            defaultValue: getMischTaetigkeit("ET2", 0),
            readOnly: true,
            type: "hidden"
          }
        ) && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            name: "p2_vg_misch_t2",
            defaultValue: getMischTaetigkeit("ET2", 1),
            readOnly: true,
            type: "hidden"
          }
        ) && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            name: "p2_vg_misch_t3",
            defaultValue: getMischTaetigkeit("ET2", 2),
            readOnly: true,
            type: "hidden"
          }
        ) ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            name: "p2_misch_kirche",
            defaultValue: getKirchensteuer("ET2"),
            readOnly: true,
            type: "hidden"
          }
        ) : null,
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            name: "p1_vg_kirchensteuer",
            defaultValue: getKirchensteuer("ET1"),
            readOnly: true,
            type: "hidden"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            name: "p1_vg_nselbst_steuerklasse",
            defaultValue: getSteuerklasse("ET1"),
            readOnly: true,
            type: "hidden"
          }
        ),
        isET2Present() && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            name: "planungP2",
            defaultValue: monthPlanner("ET2"),
            readOnly: true,
            type: "hidden"
          }
        ) && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            name: "p2_et_vorgeburt",
            defaultValue: getEinkommenVorgeburt("ET2"),
            readOnly: true,
            type: "hidden"
          }
        ) && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            name: "p2_et_nachgeburt",
            defaultValue: getEinkommenNachGeburt("ET2"),
            readOnly: true,
            type: "hidden"
          }
        ) && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            name: "p2_vg_kirchensteuer",
            defaultValue: getKirchensteuer("ET2"),
            readOnly: true,
            type: "hidden"
          }
        ) ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            name: "p2_vg_nselbst_steuerklasse",
            defaultValue: getSteuerklasse("ET2"),
            readOnly: true,
            type: "hidden"
          }
        ) : null,
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { label: "Daten in Elterngeldantrag übernehmen", isSubmitButton: true })
      ]
    }
  ) });
}
function VariantenDetails({ variante, details }) {
  const label = LABEL_PER_VARIANTE[variante];
  const { elterngeld, nettoEinkommen, numberOfMonths } = details;
  const formattedElterngeld = formatAsCurrency(elterngeld);
  const formattedNettoEinkommen = formatAsCurrency(nettoEinkommen);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ElterngeldvarianteBadge, { variante, className: "min-w-[7ch]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
      label,
      " | ",
      numberOfMonths,
      " Monate",
      /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: formattedElterngeld }),
      nettoEinkommen > 0 && ` | zusätzliches Einkommen ${formattedNettoEinkommen}`
    ] })
  ] });
}
const LABEL_PER_VARIANTE = {
  BEG: "BasisElterngeld",
  "EG+": "ElterngeldPlus",
  PSB: "Partnerschaftsbonus",
  None: "kein Elterngeld"
};
function formatZeitraum(zeitraum) {
  const { from, to } = zeitraum;
  const isSpanningTwoYears = from.getFullYear() < to.getFullYear();
  const formattedFrom = zeitraum.from.toLocaleDateString(void 0, {
    day: "2-digit",
    month: "2-digit",
    year: isSpanningTwoYears ? "numeric" : void 0
  });
  const formattedTo = zeitraum.to.toLocaleDateString(void 0, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
  return `${formattedFrom} bis ${formattedTo}`;
}
function Elternteil({
  name,
  totalNumberOfMonths,
  geldInsgesamt,
  zeitraeueme,
  details
}) {
  const formattedGeldInsgesamt = formatAsCurrency(geldInsgesamt);
  const zeitraeumeHeadingIdentifier = reactExports.useId();
  const formattedZeitraeume = zeitraeueme.map(formatZeitraum);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-base", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(_default$4, {}),
      " ",
      name
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
      totalNumberOfMonths,
      " Monate Elterngeld |",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold", children: [
        "insgesamt ",
        formattedGeldInsgesamt
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "aria-labelledby": zeitraeumeHeadingIdentifier, className: "mb-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-basis", id: zeitraeumeHeadingIdentifier, children: "Elterngeld im Zeitraum:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "list-none", children: formattedZeitraeume.map((zeitraum) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: zeitraum }, zeitraum)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "ul",
      {
        "aria-label": "Details pro Elterngeldvariante",
        className: classNames(
          "list-none",
          /* TODO: shorten list when utility classes work properly again */
          "divide-x-0 divide-y-2 divide-solid divide-off-white",
          "border-x-0 border-y-2 border-solid border-off-white"
        ),
        children: ELTERNGELD_VARIANTEN_TO_SHOW.map((variante) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "flex items-start gap-24 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(VariantenDetails, { variante, details: details[variante] }) }, variante))
      }
    )
  ] });
}
const ELTERNGELD_VARIANTEN_TO_SHOW = ["BEG", "EG+", "PSB"];
function Planungsuebersicht({
  data
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-16 *:grow", children: data.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsx(Elternteil, { ...entry }, entry.name)) });
}
var BusinessCenterOutlined = {};
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
Object.defineProperty(BusinessCenterOutlined, "__esModule", { value: true });
var jsx_runtime_1 = jsxRuntimeExports;
var SvgBusinessCenterOutlined = function(props) {
  return (0, jsx_runtime_1.jsxs)("svg", __assign({ xmlns: "http://www.w3.org/2000/svg", height: 24, viewBox: "0 0 24 24", width: 24, "data-testid": "BusinessCenterOutlinedIcon", role: "graphics-symbol img", focusable: "false", "aria-hidden": "true" }, props, { children: [(0, jsx_runtime_1.jsx)("path", { d: "M0 0h24v24H0V0z", fill: "none" }), (0, jsx_runtime_1.jsx)("path", { d: "M20 7h-4V5l-2-2h-4L8 5v2H4c-1.1 0-2 .9-2 2v5c0 .75.4 1.38 1 1.73V19c0 1.11.89 2 2 2h14c1.11 0 2-.89 2-2v-3.28c.59-.35 1-.99 1-1.72V9c0-1.1-.9-2-2-2zM10 5h4v2h-4V5zM4 9h16v5h-5v-3H9v3H4V9zm9 6h-2v-2h2v2zm6 4H5v-3h4v1h6v-1h4v3z" })] }));
};
var _default = BusinessCenterOutlined.default = SvgBusinessCenterOutlined;
function PlanungsdetailsMonth({
  variante,
  isMutterschutzMonth,
  elterngeld,
  nettoEinkommen,
  verfuegbaresEinkommen
}) {
  const variantenElement = formatVarianteAsElement(
    variante,
    isMutterschutzMonth
  );
  const hasElterngeld = elterngeld > 0;
  const hasNettoEinkommen = nettoEinkommen > 0;
  const hasOnlyElterngeld = hasElterngeld && !hasNettoEinkommen;
  const hasOnlyNettoEinkommen = hasNettoEinkommen && !hasElterngeld;
  const showVerfuegbaresEinkommen = hasElterngeld && hasNettoEinkommen;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start gap-x-8", children: [
    variantenElement,
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col place-self-center leading-7", children: [
      !!hasElterngeld && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: classNames({ "font-bold": hasOnlyElterngeld }), children: formatAsCurrency(elterngeld) }),
      !!hasNettoEinkommen && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(_default, {}),
        " Einkommen",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: classNames({ "font-bold": hasOnlyNettoEinkommen }),
            children: formatAsCurrency(nettoEinkommen)
          }
        )
      ] }),
      !!showVerfuegbaresEinkommen && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "mt-8 font-bold", children: [
        "= ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "verfügbares Einkommen" }),
        formatAsCurrency(verfuegbaresEinkommen)
      ] })
    ] })
  ] });
}
function formatVarianteAsElement(variante, isMutterschutzMonth) {
  if (isMutterschutzMonth) {
    return "Mutterschutz";
  } else if (variante === "None") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "basis-full", children: "- kein Elterngeld -" });
  } else {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ElterngeldvarianteBadge, { variante, className: "min-w-[7ch]" });
  }
}
function PlanungsdetailsTable({
  lastMonthIndexToShow,
  birthdate,
  elternteile
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse [&_td]:pb-16 [&_th]:pb-16 [&_tr]:border-0 [&_tr]:border-b-2 [&_tr]:border-solid [&_tr]:border-grey-light", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-left font-bold", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { scope: "col", children: "Lebensmonate" }),
      elternteile.map(({ name }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("th", { scope: "col", abbr: name, className: "pl-32 last:pr-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(_default$4, {}),
        " ",
        name
      ] }, name))
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "[&_td]:pt-10 [&_th]:pt-10", children: [...Array(lastMonthIndexToShow + 1)].map((_, monthIndex) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "leading-[2.333]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "th",
        {
          scope: "row",
          abbr: `${monthIndex + 1}`,
          className: "flex items-center px-8 text-left font-regular",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-w-[3ch] font-bold", children: monthIndex + 1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "leading-tight", children: getLabelForLebensmonat(birthdate, monthIndex) })
          ]
        }
      ),
      elternteile.map(({ lebensmonate }, elternteilIndex) => {
        const lebensmonat = lebensmonate[monthIndex] ?? FILLER_LEBENSMONAT;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "td",
          {
            className: "pl-32 align-top last:pr-8",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(PlanungsdetailsMonth, { ...lebensmonat })
          },
          `${monthIndex}${elternteilIndex}`
        );
      })
    ] }, monthIndex)) })
  ] });
}
function getLabelForLebensmonat(birthdate, index) {
  const from = new Date(birthdate);
  from.setMonth(from.getMonth() + index);
  const to = new Date(from);
  to.setMonth(to.getMonth() + 1);
  to.setDate(to.getDate() - 1);
  return formatZeitraum({ from, to });
}
const FILLER_LEBENSMONAT = {
  variante: "None",
  isMutterschutzMonth: false,
  elterngeld: 0,
  nettoEinkommen: 0,
  verfuegbaresEinkommen: 0
};
function Planungsdetails({ data }) {
  const birthdate = useAppSelector(
    stepNachwuchsSelectors.getWahrscheinlichesGeburtsDatum
  );
  const lastMonthIndexToShow = Math.max(...data.map(({ lebensmonate }) => lebensmonate.length)) - 1;
  const elternteile = data;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "@container/planungs-details", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-y-32 @2xl/planungs-details:hidden", children: elternteile.map((elternteil) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      PlanungsdetailsTable,
      {
        lastMonthIndexToShow,
        birthdate,
        elternteile: [elternteil]
      },
      elternteil.name
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden @2xl/planungs-details:block", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      PlanungsdetailsTable,
      {
        lastMonthIndexToShow,
        birthdate,
        elternteile
      }
    ) })
  ] });
}
function usePlanungdaten() {
  const isSingleParent = useAppSelector(isSingleParentSelector);
  const planungsdatenET1 = useAppSelector(planungsdatenET1Selector);
  const planungsdatenET2 = useAppSelector(planungsdatenET2Selector);
  return isSingleParent ? [planungsdatenET1] : [planungsdatenET1, planungsdatenET2];
}
const isSingleParentSelector = createAppSelector(
  [(state) => state.stepAllgemeineAngaben.antragstellende],
  (antragstellende) => antragstellende === "EinenElternteil"
);
const planungsdatenET1Selector = createPlanungsdatenSelector("ET1");
const planungsdatenET2Selector = createPlanungsdatenSelector("ET2");
function createPlanungsdatenSelector(elternteil) {
  return createAppSelector(
    [
      (state) => state.stepAllgemeineAngaben.pseudonym[elternteil] || elternteil.replace("ET", "Elternteil "),
      (state) => state.monatsplaner.elternteile[elternteil].months,
      (state) => state.stepRechner[elternteil].elterngeldResult,
      stepNachwuchsSelectors.getWahrscheinlichesGeburtsDatum
    ],
    (pseudonym, months, elterngeldResult, birthdate) => ({
      name: pseudonym,
      totalNumberOfMonths: countPlannedMonths(months),
      geldInsgesamt: sumUpElterngeld(months, elterngeldResult) + sumUpNettoEinkommen(months, elterngeldResult),
      zeitraeueme: assembleZeitraeume(months, birthdate),
      details: combineDetails(months, elterngeldResult),
      lebensmonate: trimLebensmonate(
        combineLebensmonate(months, elterngeldResult)
      )
    })
  );
}
function combineLebensmonate(months, elterngeldResult) {
  const resultPerMonth = flattenElterngeldResult(elterngeldResult);
  return months.map((month, index) => {
    const { type: variante, isMutterschutzMonth } = month;
    const elterngeld = readElterngeld(resultPerMonth[index], month.type);
    const nettoEinkommen = resultPerMonth[index].nettoEinkommen;
    return {
      variante,
      isMutterschutzMonth,
      elterngeld,
      nettoEinkommen,
      verfuegbaresEinkommen: elterngeld + nettoEinkommen
    };
  });
}
function trimLebensmonate(lebensmonate) {
  const lastRelevantIndex = lebensmonate.findLastIndex(
    ({ variante }) => variante !== "None"
  );
  return lebensmonate.slice(0, lastRelevantIndex + 1);
}
function combineDetails(months, elterngeldResult) {
  return {
    BEG: combineDetailsOfVariante("BEG", months, elterngeldResult),
    "EG+": combineDetailsOfVariante("EG+", months, elterngeldResult),
    PSB: combineDetailsOfVariante("PSB", months, elterngeldResult)
  };
}
function combineDetailsOfVariante(variante, months, elterngeldResult) {
  return {
    numberOfMonths: countPlannedMonths(months, [variante]),
    elterngeld: sumUpElterngeld(months, elterngeldResult, [variante]),
    nettoEinkommen: sumUpNettoEinkommen(months, elterngeldResult, [variante])
  };
}
function countPlannedMonths(months, filter = ["BEG", "EG+", "PSB"]) {
  return months.filter(
    (month) => month.type !== "None" && filter.includes(month.type)
  ).length;
}
function sumUpElterngeld(months, elterngeldResult, filter = ["BEG", "EG+", "PSB"]) {
  const resultPerMonth = flattenElterngeldResult(elterngeldResult);
  const elterngeldPerMonth = months.map((month, monthIndex) => {
    const isOfInterest = month.type !== "None" && filter.includes(month.type);
    const resultForMonth = resultPerMonth[monthIndex];
    return isOfInterest ? readElterngeld(resultForMonth, month.type) : 0;
  });
  return elterngeldPerMonth.reduce((sum, elterngeld) => sum + elterngeld, 0);
}
function sumUpNettoEinkommen(months, elterngeldResult, filter = ["BEG", "EG+", "PSB", "None"]) {
  const resultPerMonth = flattenElterngeldResult(elterngeldResult);
  const nettoEinkommenPerMonth = months.map((month, monthIndex) => {
    const isOfInterest = filter.includes(month.type);
    const resultForMonth = resultPerMonth[monthIndex];
    return isOfInterest ? resultForMonth.nettoEinkommen : 0;
  });
  return nettoEinkommenPerMonth.reduce((sum, einkommen) => sum + einkommen, 0);
}
function flattenElterngeldResult(elterngeldResult) {
  const rows = elterngeldResult.state === "success" ? elterngeldResult.data : [];
  return Array.from(
    { length: EgrConst.lebensMonateMaxNumber },
    (_, monthIndex) => {
      const row = rows.find(checkRowIncludesMonth.bind({ monthIndex }));
      return row ?? createRowWithNoElterngeld(monthIndex);
    }
  );
}
function readElterngeld(resultForMonth, variante) {
  switch (variante) {
    case "BEG":
      return resultForMonth.basisElternGeld;
    case "EG+":
    case "PSB":
      return resultForMonth.elternGeldPlus;
    case "None":
      return 0;
  }
}
function checkRowIncludesMonth(row) {
  const fromMonthIndex = row.vonLebensMonat - 1;
  const tillMonthIndex = row.bisLebensMonat - 1;
  return fromMonthIndex <= this.monthIndex && this.monthIndex <= tillMonthIndex;
}
function createRowWithNoElterngeld(monthIndex) {
  return {
    vonLebensMonat: monthIndex,
    bisLebensMonat: monthIndex,
    basisElternGeld: 0,
    elternGeldPlus: 0,
    nettoEinkommen: 0
  };
}
function assembleZeitraeume(months, birthdate) {
  const groupsOfFollowingMonthIndexesWithElterngeld = months.reduce(
    (groups, month, index) => {
      if (month.type === "None") {
        groups.push([]);
      } else {
        const lastGroup = groups[groups.length - 1];
        lastGroup.push(index);
      }
      return groups;
    },
    [[]]
  ).filter((group) => group.length > 0);
  const zeitraeumeByLebensmonate = groupsOfFollowingMonthIndexesWithElterngeld.map((group) => ({
    fromLebensmonat: group[0] + 1,
    toLebensmonat: group[group.length - 1] + 1
  }));
  return zeitraeumeByLebensmonate.map((zeitraum) => ({
    from: copyAndShiftDate(birthdate, { months: zeitraum.fromLebensmonat - 1 }),
    to: copyAndShiftDate(birthdate, {
      months: zeitraum.toLebensmonat,
      days: -1
      // Zeitraum ends one day before next Lebensmonat begins.
    })
  }));
}
function copyAndShiftDate(date, shiftBy) {
  const copiedDate = new Date(date);
  copiedDate.setMonth(copiedDate.getMonth() + (shiftBy.months ?? 0));
  copiedDate.setDate(copiedDate.getDate() + (shiftBy.days ?? 0));
  return copiedDate;
}
function ZusammenfassungUndDatenPage() {
  const descriptionIdentifier = reactExports.useId();
  const data = usePlanungdaten();
  const navigate = useNavigate();
  const navigateToPreviousStep = () => navigate(formSteps.rechnerUndPlaner.route);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Page, { step: formSteps.zusammenfassungUndDaten, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-40 flex flex-wrap justify-between gap-y-80", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "section",
        {
          className: "flex basis-full flex-col gap-24",
          "aria-describedby": descriptionIdentifier,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Zusammenfassung" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { id: descriptionIdentifier, children: "Hier finden sie eine Übersicht Ihrer Planung der Elterngeldmonate" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Planungsuebersicht, { data })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "flex basis-full break-before-page break-inside-avoid flex-col gap-y-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Planung der Monate im Detail" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Planungsdetails, { data })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-y-32", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(PrintButton, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: nsp("monatsplaner__button-group"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            buttonStyle: "secondary",
            label: "Zurück",
            onClick: navigateToPreviousStep
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DatenInAntragUebernehmenButton, {})
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(UserFeedbackSection, { className: "mt-40" })
  ] });
}
export {
  ZusammenfassungUndDatenPage as default
};
