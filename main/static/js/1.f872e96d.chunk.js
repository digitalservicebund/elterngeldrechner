"use strict";
(self["webpackChunk_egr_egr_app"] = self["webpackChunk_egr_egr_app"] || []).push([[1],{

/***/ 3001:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(7689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2791);
/* harmony import */ var _components_organisms_page__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2995);
/* harmony import */ var _components_organisms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3597);
/* harmony import */ var _redux_hooks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3153);
/* harmony import */ var _redux_stepErwerbstaetigkeitSlice__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(8049);
/* harmony import */ var _utils_formSteps__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(8137);
/* harmony import */ var _redux_stepRechnerSlice__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(2760);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(184);
function ErwerbstaetigkeitPage(){const dispatch=(0,_redux_hooks__WEBPACK_IMPORTED_MODULE_3__/* .useAppDispatch */ .TL)();const navigate=(0,react_router__WEBPACK_IMPORTED_MODULE_8__/* .useNavigate */ .s0)();const initialValues=(0,_redux_hooks__WEBPACK_IMPORTED_MODULE_3__/* .useAppSelector */ .CG)(state=>state.stepErwerbstaetigkeit);const[isFormDirty,setIsFormDirty]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);const[dirtyFields,setDirtyFields]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({});const handleSubmit=values=>{// dirty check doesn't work on vorGeburt field - therefore additional checks added
if(isFormDirty||values.ET1.vorGeburt!==initialValues.ET1.vorGeburt||values.ET2.vorGeburt!==initialValues.ET2.vorGeburt){dispatch(_redux_stepRechnerSlice__WEBPACK_IMPORTED_MODULE_6__/* .stepRechnerActions */ .lq.setHasBEGResultChangedDueToPrevFormSteps({ET1:Object.hasOwn(dirtyFields,"ET1")||values.ET1.vorGeburt!==initialValues.ET1.vorGeburt,ET2:Object.hasOwn(dirtyFields,"ET2")||values.ET2.vorGeburt!==initialValues.ET2.vorGeburt}));}dispatch(_redux_stepErwerbstaetigkeitSlice__WEBPACK_IMPORTED_MODULE_4__/* .stepErwerbstaetigkeitActions */ .lq.submitStep(values));navigate(_utils_formSteps__WEBPACK_IMPORTED_MODULE_5__/* .formSteps */ .w.einkommen.route);};const handleDirtyForm=(isFormDirty,dirtyFields)=>{setIsFormDirty(isFormDirty);setDirtyFields(dirtyFields);};return/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_components_organisms_page__WEBPACK_IMPORTED_MODULE_1__/* .Page */ .T,{step:_utils_formSteps__WEBPACK_IMPORTED_MODULE_5__/* .formSteps */ .w.erwerbstaetigkeit,children:/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_components_organisms__WEBPACK_IMPORTED_MODULE_2__/* .ErwerbstaetigkeitForm */ .sL,{initialValues:initialValues,onSubmit:handleSubmit,handleDirtyForm:handleDirtyForm})});}/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ErwerbstaetigkeitPage);

/***/ })

}]);
//# sourceMappingURL=1.f872e96d.chunk.js.map