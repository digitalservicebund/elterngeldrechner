"use strict";
(self["webpackChunk_egr_egr_app"] = self["webpackChunk_egr_egr_app"] || []).push([[81],{

/***/ 8081:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ pages_RechnerPlanerPage)
});

// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(2791);
// EXTERNAL MODULE: ./src/redux/hooks.ts
var hooks = __webpack_require__(3153);
// EXTERNAL MODULE: ./src/utils/formSteps.ts
var formSteps = __webpack_require__(8137);
// EXTERNAL MODULE: ./src/components/organisms/index.ts + 70 modules
var organisms = __webpack_require__(3597);
// EXTERNAL MODULE: ./src/components/organisms/page/index.ts + 4 modules
var page = __webpack_require__(2995);
// EXTERNAL MODULE: ./src/globals/js/elternteile-utils.ts
var elternteile_utils = __webpack_require__(1648);
// EXTERNAL MODULE: ./src/globals/js/namespace.js + 1 modules
var namespace = __webpack_require__(9242);
// EXTERNAL MODULE: ./src/components/atoms/index.ts + 33 modules
var atoms = __webpack_require__(165);
// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(184);
;// CONCATENATED MODULE: ./src/components/organisms/modal-popup/ModalPopup.tsx
function ModalPupup(_ref){let{text,buttonLabel,onClick}=_ref;return/*#__PURE__*/(0,jsx_runtime.jsx)("div",{className:(0,namespace/* default */.Z)("modal-popup"),children:/*#__PURE__*/(0,jsx_runtime.jsxs)("div",{className:(0,namespace/* default */.Z)("modal-popup__info"),children:[/*#__PURE__*/(0,jsx_runtime.jsx)("p",{children:text}),/*#__PURE__*/(0,jsx_runtime.jsx)(atoms/* Button */.zx,{className:(0,namespace/* default */.Z)("modal-popup__btn"),onClick:onClick,label:buttonLabel,buttonStyle:"primary"})]})});}
// EXTERNAL MODULE: ./src/globals/js/calculations/model/index.ts + 15 modules
var model = __webpack_require__(3444);
// EXTERNAL MODULE: ./src/redux/stepAllgemeineAngabenSlice.ts
var stepAllgemeineAngabenSlice = __webpack_require__(177);
// EXTERNAL MODULE: ./src/globals/js/calculations/model/egr-berechnung-param-id.ts
var egr_berechnung_param_id = __webpack_require__(4223);
;// CONCATENATED MODULE: ./src/components/pages/RechnerPlanerPage.tsx
function RechnerPlanerPage(){const nachwuchs=(0,hooks/* useAppSelector */.CG)(state=>state.stepNachwuchs);const allgemein=(0,hooks/* useAppSelector */.CG)(state=>state.stepAllgemeineAngaben);const isLimitEinkommenUeberschritten=(0,hooks/* useAppSelector */.CG)(state=>state.stepEinkommen.limitEinkommenUeberschritten===model/* YesNo */.l.YES?true:null);const mutterSchutzMonate=(0,elternteile_utils/* numberOfMutterschutzMonths */.r)(nachwuchs.anzahlKuenftigerKinder,allgemein.mutterschaftssleistungen);const[showModalPopup,setShowModalPopup]=(0,react.useState)(isLimitEinkommenUeberschritten);const alleinerziehend=(0,hooks/* useAppSelector */.CG)(stepAllgemeineAngabenSlice/* stepAllgemeineAngabenSelectors */.cI.getAlleinerziehend);const amountLimitEinkommen=alleinerziehend===model/* YesNo */.l.YES?egr_berechnung_param_id/* EgrBerechnungParamId */.k.MAX_EINKOMMEN_ALLEIN:egr_berechnung_param_id/* EgrBerechnungParamId */.k.MAX_EINKOMMEN_BEIDE;return/*#__PURE__*/(0,jsx_runtime.jsxs)(page/* Page */.T,{step:formSteps/* formSteps */.w.rechnerUndPlaner,children:[/*#__PURE__*/(0,jsx_runtime.jsx)("h3",{className:"mb-10",children:"Rechner und Planer"}),/*#__PURE__*/(0,jsx_runtime.jsx)(organisms/* Rechner */.oG,{}),/*#__PURE__*/(0,jsx_runtime.jsx)(organisms/* Monatsplaner */.v4,{mutterSchutzMonate:mutterSchutzMonate}),!!showModalPopup&&/*#__PURE__*/ // TODO: fix text after check with ministry
(0,jsx_runtime.jsx)(ModalPupup,{text:"Wenn Sie besonders viel Einkommen haben, k\xF6nnen Sie kein Elterngeld bekommen. Falls noch nicht feststeht, ob Sie die Grenze von ".concat(amountLimitEinkommen.toLocaleString()," Euro \xFCberschreiten, k\xF6nnen Sie trotzdem einen Antrag stellen."),buttonLabel:"Dialog schlie\xDFen",onClick:()=>{setShowModalPopup(false);}})]});}/* harmony default export */ const pages_RechnerPlanerPage = (RechnerPlanerPage);

/***/ })

}]);
//# sourceMappingURL=81.17386c77.chunk.js.map