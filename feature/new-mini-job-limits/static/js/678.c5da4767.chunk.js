"use strict";
(self["webpackChunk_egr_egr_app"] = self["webpackChunk_egr_egr_app"] || []).push([[678],{

/***/ 5678:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2791);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(7689);
/* harmony import */ var _redux_hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3153);
/* harmony import */ var _redux_stepEinkommenSlice__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5353);
/* harmony import */ var _redux_stepRechnerSlice__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2760);
/* harmony import */ var _utils_formSteps__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(8137);
/* harmony import */ var _components_organisms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(8336);
/* harmony import */ var _components_organisms_page__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(2995);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(184);
function EinkommenPage(){const dispatch=(0,_redux_hooks__WEBPACK_IMPORTED_MODULE_1__/* .useAppDispatch */ .TL)();const navigate=(0,react_router_dom__WEBPACK_IMPORTED_MODULE_8__/* .useNavigate */ .s0)();const initialValues=(0,_redux_hooks__WEBPACK_IMPORTED_MODULE_1__/* .useAppSelector */ .CG)(state=>state.stepEinkommen);const[isFormDirty,setIsFormDirty]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);const[dirtyFields,setDirtyFields]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({});const handleSubmit=values=>{// dirty check doesn't work on switch between average and monthly income - therefore additional checks added
if(isFormDirty||values.ET1.bruttoEinkommenNichtSelbstaendig.type!==initialValues.ET1.bruttoEinkommenNichtSelbstaendig.type||values.ET2.bruttoEinkommenNichtSelbstaendig.type!==initialValues.ET2.bruttoEinkommenNichtSelbstaendig.type){dispatch(_redux_stepRechnerSlice__WEBPACK_IMPORTED_MODULE_3__/* .stepRechnerActions */ .lq.setHasBEGResultChangedDueToPrevFormSteps({ET1:Object.hasOwn(dirtyFields,"ET1")||values.ET1.bruttoEinkommenNichtSelbstaendig.type!==initialValues.ET1.bruttoEinkommenNichtSelbstaendig.type,ET2:Object.hasOwn(dirtyFields,"ET2")||values.ET2.bruttoEinkommenNichtSelbstaendig.type!==initialValues.ET2.bruttoEinkommenNichtSelbstaendig.type}));}dispatch(_redux_stepEinkommenSlice__WEBPACK_IMPORTED_MODULE_2__/* .stepEinkommenActions */ .KH.submitStep(values));navigate(_utils_formSteps__WEBPACK_IMPORTED_MODULE_4__/* .formSteps */ .w.elterngeldvarianten.route);};const handleDirtyForm=(isFormDirty,dirtyFields)=>{setIsFormDirty(isFormDirty);setDirtyFields(dirtyFields);};return/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_components_organisms_page__WEBPACK_IMPORTED_MODULE_6__/* .Page */ .T,{step:_utils_formSteps__WEBPACK_IMPORTED_MODULE_4__/* .formSteps */ .w.einkommen,children:/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_components_organisms__WEBPACK_IMPORTED_MODULE_5__/* .EinkommenForm */ .vV,{initialValues:initialValues,onSubmit:handleSubmit,handleDirtyForm:handleDirtyForm})});}/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (EinkommenPage);

/***/ })

}]);
//# sourceMappingURL=678.c5da4767.chunk.js.map