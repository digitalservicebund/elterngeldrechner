"use strict";
(self["webpackChunk_egr_egr_app"] = self["webpackChunk_egr_egr_app"] || []).push([[623],{

/***/ 4623:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2791);
/* harmony import */ var react_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(7689);
/* harmony import */ var _components_organisms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8336);
/* harmony import */ var _components_organisms_page__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2995);
/* harmony import */ var _redux_hooks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3153);
/* harmony import */ var _redux_stepAllgemeineAngabenSlice__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(177);
/* harmony import */ var _utils_formSteps__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(8137);
/* harmony import */ var _redux_stepRechnerSlice__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(2760);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(184);
function AllgemeineAngabenPage(){const dispatch=(0,_redux_hooks__WEBPACK_IMPORTED_MODULE_3__/* .useAppDispatch */ .TL)();const navigate=(0,react_router__WEBPACK_IMPORTED_MODULE_8__/* .useNavigate */ .s0)();const initialValues=(0,_redux_hooks__WEBPACK_IMPORTED_MODULE_3__/* .useAppSelector */ .CG)(state=>state.stepAllgemeineAngaben);const[isFormDirty,setIsFormDirty]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);const handleSubmit=values=>{if(isFormDirty){dispatch(_redux_stepRechnerSlice__WEBPACK_IMPORTED_MODULE_6__/* .stepRechnerActions */ .lq.setHasBEGResultChangedDueToPrevFormSteps({ET1:true,ET2:true}));}dispatch(_redux_stepAllgemeineAngabenSlice__WEBPACK_IMPORTED_MODULE_4__/* .stepAllgemeineAngabenActions */ .mk.submitStep(values));navigate(_utils_formSteps__WEBPACK_IMPORTED_MODULE_5__/* .formSteps */ .w.nachwuchs.route);};const handleDirtyForm=isFormDirty=>{setIsFormDirty(isFormDirty);};return/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_components_organisms_page__WEBPACK_IMPORTED_MODULE_2__/* .Page */ .T,{step:_utils_formSteps__WEBPACK_IMPORTED_MODULE_5__/* .formSteps */ .w.allgemeinAngaben,children:/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_components_organisms__WEBPACK_IMPORTED_MODULE_1__/* .AllgemeineAngabenForm */ .jZ,{initialValues:initialValues,onSubmit:handleSubmit,handleDirtyForm:handleDirtyForm})});}/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AllgemeineAngabenPage);

/***/ })

}]);
//# sourceMappingURL=623.fdc9e420.chunk.js.map