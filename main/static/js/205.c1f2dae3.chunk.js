"use strict";
(self["webpackChunk_egr_egr_app"] = self["webpackChunk_egr_egr_app"] || []).push([[205],{

/***/ 7205:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ pages_ZusammenfassungUndDatenPage)
});

// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(2791);
// EXTERNAL MODULE: ./node_modules/react-router/dist/index.js
var dist = __webpack_require__(7689);
// EXTERNAL MODULE: ./src/components/atoms/index.ts + 35 modules
var atoms = __webpack_require__(2932);
// EXTERNAL MODULE: ./src/globals/js/calculations/model/index.ts + 15 modules
var model = __webpack_require__(3444);
// EXTERNAL MODULE: ./src/redux/hooks.ts
var hooks = __webpack_require__(3153);
// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(184);
;// CONCATENATED MODULE: ./src/components/organisms/DatenInAntragUebernehmenButton.tsx
function DatenInAntragUebernehmenButton(){const store=(0,hooks/* useAppStore */.qr)();const{stepAllgemeineAngaben,stepNachwuchs,stepErwerbstaetigkeit,stepEinkommen,stepRechner,monatsplaner,configuration}=store.getState();const mapYesNo=yesNo=>{return yesNo===model/* YesNo */.l.YES?"1":"0";};const getAlleinerziehend=()=>{return mapYesNo(stepAllgemeineAngaben.alleinerziehend);};const getSteuerklasse=elternteil=>{var _stepEinkommen$eltern;return(_stepEinkommen$eltern=stepEinkommen[elternteil].steuerKlasse)!==null&&_stepEinkommen$eltern!==void 0?_stepEinkommen$eltern:"";};const getMischTaetigkeit=(elternteil,position)=>{const taetigkeit=stepEinkommen[elternteil].taetigkeitenNichtSelbstaendigUndSelbstaendig[position];switch(taetigkeit===null||taetigkeit===void 0?void 0:taetigkeit.artTaetigkeit){case"NichtSelbststaendig":return"2";case"Selbststaendig":return"1";}return"";};const getEinkommenNachGeburt=elternteil=>{return stepRechner[elternteil].bruttoEinkommenZeitraum.length>0?"1":"0";};const isET2Present=()=>{return stepAllgemeineAngaben.antragstellende!=="EinenElternteil";};const hasET2Mischtaetigkeit=()=>{return isET2Present()&&isMischtaetigkeit("ET2");};const isMischtaetigkeit=elternteil=>{const erwerbstaetigkeit=stepErwerbstaetigkeit[elternteil];return erwerbstaetigkeit.isNichtSelbststaendig&&erwerbstaetigkeit.isSelbststaendig;};const getKirchensteuer=elternteil=>{return mapYesNo(stepEinkommen[elternteil].zahlenSieKirchenSteuer);};const getEinkommenVorgeburt=elternteil=>{return mapYesNo(stepErwerbstaetigkeit[elternteil].vorGeburt);};const getMutterschaftsleistungen=()=>{return mapYesNo(stepAllgemeineAngaben.mutterschaftssleistungen);};const monthPlanner=elternteil=>{const months=monatsplaner.elternteile[elternteil].months;return months.map(month=>{switch(month.type){case"BEG":return"1";case"EG+":return"2";case"PSB":return"3";}return"0";}).join(",");};return/*#__PURE__*/(0,jsx_runtime.jsx)(jsx_runtime.Fragment,{children:/*#__PURE__*/(0,jsx_runtime.jsxs)("form",{method:"post",id:"anton-remote-eao-post-form",action:configuration.elternGeldDigitalWizardUrl,encType:"application/x-www-form-urlencoded",children:[/*#__PURE__*/(0,jsx_runtime.jsx)("input",{name:"planungP1",defaultValue:monthPlanner("ET1"),readOnly:true,type:"hidden"}),/*#__PURE__*/(0,jsx_runtime.jsx)("input",{name:"mehrlinge_anzahl",defaultValue:stepNachwuchs.anzahlKuenftigerKinder,readOnly:true,type:"hidden"}),/*#__PURE__*/(0,jsx_runtime.jsx)("input",{name:"kind_geburtstag",defaultValue:stepNachwuchs.wahrscheinlichesGeburtsDatum,readOnly:true,type:"hidden"}),/*#__PURE__*/(0,jsx_runtime.jsx)("input",{name:"alleinerziehend",defaultValue:getAlleinerziehend(),readOnly:true,type:"hidden"}),/*#__PURE__*/(0,jsx_runtime.jsx)("input",{name:"mutterschaftsleistung",defaultValue:getMutterschaftsleistungen(),readOnly:true,type:"hidden"}),/*#__PURE__*/(0,jsx_runtime.jsx)("input",{name:"p1_et_vorgeburt",defaultValue:getEinkommenVorgeburt("ET1"),readOnly:true,type:"hidden"}),isMischtaetigkeit("ET1")&&/*#__PURE__*/(0,jsx_runtime.jsx)("input",{name:"p1_vg_misch_t1",defaultValue:getMischTaetigkeit("ET1",0),readOnly:true,type:"hidden"})&&/*#__PURE__*/(0,jsx_runtime.jsx)("input",{name:"p1_vg_misch_t2",defaultValue:getMischTaetigkeit("ET1",1),readOnly:true,type:"hidden"})&&/*#__PURE__*/(0,jsx_runtime.jsx)("input",{name:"p1_vg_misch_t3",defaultValue:getMischTaetigkeit("ET1",2),readOnly:true,type:"hidden"})?/*#__PURE__*/(0,jsx_runtime.jsx)("input",{name:"p1_misch_kirche",defaultValue:getKirchensteuer("ET1"),readOnly:true,type:"hidden"}):null,/*#__PURE__*/(0,jsx_runtime.jsx)("input",{name:"p1_et_nachgeburt",defaultValue:getEinkommenNachGeburt("ET1"),readOnly:true,type:"hidden"}),hasET2Mischtaetigkeit()&&/*#__PURE__*/(0,jsx_runtime.jsx)("input",{name:"p2_vg_misch_t1",defaultValue:getMischTaetigkeit("ET2",0),readOnly:true,type:"hidden"})&&/*#__PURE__*/(0,jsx_runtime.jsx)("input",{name:"p2_vg_misch_t2",defaultValue:getMischTaetigkeit("ET2",1),readOnly:true,type:"hidden"})&&/*#__PURE__*/(0,jsx_runtime.jsx)("input",{name:"p2_vg_misch_t3",defaultValue:getMischTaetigkeit("ET2",2),readOnly:true,type:"hidden"})?/*#__PURE__*/(0,jsx_runtime.jsx)("input",{name:"p2_misch_kirche",defaultValue:getKirchensteuer("ET2"),readOnly:true,type:"hidden"}):null,/*#__PURE__*/(0,jsx_runtime.jsx)("input",{name:"p1_vg_kirchensteuer",defaultValue:getKirchensteuer("ET1"),readOnly:true,type:"hidden"}),/*#__PURE__*/(0,jsx_runtime.jsx)("input",{name:"p1_vg_nselbst_steuerklasse",defaultValue:getSteuerklasse("ET1"),readOnly:true,type:"hidden"}),isET2Present()&&/*#__PURE__*/(0,jsx_runtime.jsx)("input",{name:"planungP2",defaultValue:monthPlanner("ET2"),readOnly:true,type:"hidden"})&&/*#__PURE__*/(0,jsx_runtime.jsx)("input",{name:"p2_et_vorgeburt",defaultValue:getEinkommenVorgeburt("ET2"),readOnly:true,type:"hidden"})&&/*#__PURE__*/(0,jsx_runtime.jsx)("input",{name:"p2_et_nachgeburt",defaultValue:getEinkommenNachGeburt("ET2"),readOnly:true,type:"hidden"})&&/*#__PURE__*/(0,jsx_runtime.jsx)("input",{name:"p2_vg_kirchensteuer",defaultValue:getKirchensteuer("ET2"),readOnly:true,type:"hidden"})?/*#__PURE__*/(0,jsx_runtime.jsx)("input",{name:"p2_vg_nselbst_steuerklasse",defaultValue:getSteuerklasse("ET2"),readOnly:true,type:"hidden"}):null,/*#__PURE__*/(0,jsx_runtime.jsx)(atoms/* Button */.zx,{label:"Daten in Elterngeldantrag \xFCbernehmen",isSubmitButton:true})]})});}
// EXTERNAL MODULE: ./node_modules/@digitalservicebund/icons/PersonOutline.js
var PersonOutline = __webpack_require__(1539);
var PersonOutline_default = /*#__PURE__*/__webpack_require__.n(PersonOutline);
// EXTERNAL MODULE: ./node_modules/classnames/index.js
var classnames = __webpack_require__(1418);
var classnames_default = /*#__PURE__*/__webpack_require__.n(classnames);
// EXTERNAL MODULE: ./node_modules/@digitalservicebund/icons/Add.js
var Add = __webpack_require__(996);
var Add_default = /*#__PURE__*/__webpack_require__.n(Add);
;// CONCATENATED MODULE: ./src/components/atoms/ElterngeldVarianteBadge.tsx
function ElterngeldvarianteBadge(_ref){let{variante,className}=_ref;const label=variante?LABELS[variante]:/*#__PURE__*/(0,jsx_runtime.jsx)((Add_default()),{});const variantClassName=CLASS_NAME[variante];return/*#__PURE__*/(0,jsx_runtime.jsx)("span",{className:classnames_default()("px-8 pt-6 pb-10 text-center rounded font-bold flex items-center justify-center leading-[1.444]",className,variantClassName),children:label});}const LABELS={BEG:"Basis","EG+":"Plus",PSB:"Bonus",None:"kein Elterngeld"};const CLASS_NAME={BEG:"bg-Basis text-white","EG+":"bg-Plus text-black",PSB:"bg-Bonus text-black",None:"bg-white text-black border-grey border-2"};
// EXTERNAL MODULE: ./src/utils/locale-formatting.ts
var locale_formatting = __webpack_require__(3227);
;// CONCATENATED MODULE: ./src/components/organisms/planungsuebersicht/VariantenDetails.tsx
function VariantenDetails(_ref){let{variante,details}=_ref;const label=LABEL_PER_VARIANTE[variante];const{elterngeld,nettoEinkommen,numberOfMonths}=details;const formattedElterngeld=(0,locale_formatting/* formatAsCurrency */.c)(elterngeld);const formattedNettoEinkommen=(0,locale_formatting/* formatAsCurrency */.c)(nettoEinkommen);return/*#__PURE__*/(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[/*#__PURE__*/(0,jsx_runtime.jsx)(ElterngeldvarianteBadge,{variante:variante,className:"min-w-[7ch]"}),/*#__PURE__*/(0,jsx_runtime.jsxs)("span",{children:[label," | ",numberOfMonths," Monate",/*#__PURE__*/(0,jsx_runtime.jsx)("br",{}),/*#__PURE__*/(0,jsx_runtime.jsx)("strong",{children:formattedElterngeld}),nettoEinkommen>0&&" | zus\xE4tzliches Einkommen ".concat(formattedNettoEinkommen)]})]});}const LABEL_PER_VARIANTE={BEG:"BasisElterngeld","EG+":"ElterngeldPlus",PSB:"Partnerschaftbonus"};
;// CONCATENATED MODULE: ./src/utils/formatZeitraum.ts
function formatZeitraum(zeitraum){const{from,to}=zeitraum;const isSpanningTwoYears=from.getFullYear()<to.getFullYear();const formattedFrom=zeitraum.from.toLocaleDateString(undefined,{day:"2-digit",month:"2-digit",year:isSpanningTwoYears?"numeric":undefined});const formattedTo=zeitraum.to.toLocaleDateString(undefined,{day:"2-digit",month:"2-digit",year:"numeric"});return"".concat(formattedFrom," bis ").concat(formattedTo);}
;// CONCATENATED MODULE: ./src/components/organisms/planungsuebersicht/Elternteil.tsx
function Elternteil(_ref){let{name,totalNumberOfMonths,geldInsgesamt,zeitraeueme,details}=_ref;const formattedGeldInsgesamt=(0,locale_formatting/* formatAsCurrency */.c)(geldInsgesamt);const zeitraeumeHeadingIdentifier=(0,react.useId)();const formattedZeitraeume=zeitraeueme.map(formatZeitraum);return/*#__PURE__*/(0,jsx_runtime.jsxs)("div",{className:"flex flex-col gap-8",children:[/*#__PURE__*/(0,jsx_runtime.jsxs)("h4",{className:"text-base",children:[/*#__PURE__*/(0,jsx_runtime.jsx)((PersonOutline_default()),{})," ",name]}),/*#__PURE__*/(0,jsx_runtime.jsxs)("span",{children:[totalNumberOfMonths," Monate Elterngeld |"," ",/*#__PURE__*/(0,jsx_runtime.jsxs)("span",{className:"font-bold",children:["insgesamt ",formattedGeldInsgesamt]})]}),/*#__PURE__*/(0,jsx_runtime.jsxs)("div",{"aria-labelledby":zeitraeumeHeadingIdentifier,className:"mb-auto",children:[/*#__PURE__*/(0,jsx_runtime.jsx)("span",{className:"text-basis",id:zeitraeumeHeadingIdentifier,children:"Elterngeld im Zeitraum:"}),/*#__PURE__*/(0,jsx_runtime.jsx)("ul",{className:"list-none",children:formattedZeitraeume.map(zeitraum=>/*#__PURE__*/(0,jsx_runtime.jsx)("li",{children:zeitraum},zeitraum))})]}),/*#__PURE__*/(0,jsx_runtime.jsx)("ul",{"aria-label":"Details pro Elterngeldvariante",className:classnames_default()("list-none",/* TODO: shorten list when utility classes work properly again */"divide-x-0 divide-y-2 divide-solid divide-off-white","border-x-0 border-y-2 border-solid border-off-white"),children:ELTERNGELD_VARIANTEN.map(variante=>/*#__PURE__*/(0,jsx_runtime.jsx)("li",{className:"flex items-start gap-24 py-8",children:/*#__PURE__*/(0,jsx_runtime.jsx)(VariantenDetails,{variante:variante,details:details[variante]})},variante))})]});}const ELTERNGELD_VARIANTEN=["BEG","EG+","PSB"];
;// CONCATENATED MODULE: ./src/components/organisms/planungsuebersicht/Planungsuebersicht.tsx
function Planungsuebersicht(_ref){let{data}=_ref;return/*#__PURE__*/(0,jsx_runtime.jsx)("div",{className:"flex flex-wrap gap-16 *:grow",children:data.map(entry=>/*#__PURE__*/(0,jsx_runtime.jsx)(Elternteil,{...entry},entry.name))});}
// EXTERNAL MODULE: ./node_modules/@digitalservicebund/icons/BusinessCenterOutlined.js
var BusinessCenterOutlined = __webpack_require__(2758);
var BusinessCenterOutlined_default = /*#__PURE__*/__webpack_require__.n(BusinessCenterOutlined);
;// CONCATENATED MODULE: ./src/components/organisms/planungsuebersicht/PlanungsdetailsMonth.tsx
function PlanungsdetailsMonth(_ref){let{month={type:"None"}}=_ref;const{type,isMutterschutzMonth,elterngeld,nettoEinkommen,verfuegbaresEinkommen}=month;const isVariant=["BEG","EG+","PSB"].includes(type)&&!isMutterschutzMonth;return/*#__PURE__*/(0,jsx_runtime.jsxs)("div",{className:"flex items-start gap-x-8",children:[type==="None"?"– kein Elterngeld –":"",isMutterschutzMonth?"Mutterschutz":"",isVariant?/*#__PURE__*/(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[/*#__PURE__*/(0,jsx_runtime.jsx)(ElterngeldvarianteBadge,{variante:type,className:"min-w-[7ch]"}),typeof nettoEinkommen==="number"?/*#__PURE__*/(0,jsx_runtime.jsxs)("div",{children:[/*#__PURE__*/(0,jsx_runtime.jsxs)("div",{children:[typeof elterngeld==="number"?(0,locale_formatting/* formatAsCurrency */.c)(elterngeld):""," ",nettoEinkommen?/*#__PURE__*/(0,jsx_runtime.jsxs)("span",{children:["| ",/*#__PURE__*/(0,jsx_runtime.jsx)((BusinessCenterOutlined_default()),{})," Einkommen"," ",(0,locale_formatting/* formatAsCurrency */.c)(nettoEinkommen)]}):""]}),nettoEinkommen&&verfuegbaresEinkommen?/*#__PURE__*/(0,jsx_runtime.jsxs)("div",{className:"font-bold leading-[0.5]",children:["= ",/*#__PURE__*/(0,jsx_runtime.jsx)("span",{className:"sr-only",children:"verf\xFCgbares Einkommen"}),(0,locale_formatting/* formatAsCurrency */.c)(verfuegbaresEinkommen)]}):""]}):/*#__PURE__*/(0,jsx_runtime.jsx)("span",{className:"font-bold",children:typeof elterngeld==="number"?(0,locale_formatting/* formatAsCurrency */.c)(elterngeld):""})]}):""]});}
;// CONCATENATED MODULE: ./src/components/organisms/planungsuebersicht/PlanungsdetailsTable.tsx
const monthLabel=_ref=>{let{birthdate,index}=_ref;const from=new Date(birthdate);from.setMonth(from.getMonth()+index);const to=new Date(from);to.setMonth(to.getMonth()+1);to.setDate(to.getDate()-1);return formatZeitraum({from,to});};function PlanungsdetailsTable(_ref2){let{sumMonths,birthdate,elternteile}=_ref2;return/*#__PURE__*/(0,jsx_runtime.jsxs)("table",{className:"w-full border-collapse [&_td]:pb-16 [&_th]:pb-16 [&_tr]:border-0 [&_tr]:border-b-2 [&_tr]:border-solid [&_tr]:border-grey-light",children:[/*#__PURE__*/(0,jsx_runtime.jsx)("thead",{children:/*#__PURE__*/(0,jsx_runtime.jsxs)("tr",{className:"text-left font-bold",children:[/*#__PURE__*/(0,jsx_runtime.jsx)("th",{scope:"col",children:"Lebensmonate"}),elternteile.map(_ref3=>{let{name}=_ref3;return/*#__PURE__*/(0,jsx_runtime.jsxs)("th",{scope:"col",abbr:name,className:"pl-32 last:pr-8",children:[/*#__PURE__*/(0,jsx_runtime.jsx)((PersonOutline_default()),{})," ",name]},name);})]})}),/*#__PURE__*/(0,jsx_runtime.jsx)("tbody",{className:"[&_td]:pt-10 [&_th]:pt-10",children:[...Array(sumMonths)].map((_,index)=>/*#__PURE__*/(0,jsx_runtime.jsxs)("tr",{className:"leading-[2.333]",children:[/*#__PURE__*/(0,jsx_runtime.jsxs)("th",{scope:"row",abbr:"".concat(index+1),className:"flex items-center px-8 text-left font-regular",children:[/*#__PURE__*/(0,jsx_runtime.jsx)("div",{className:"min-w-[3ch] font-bold",children:index+1}),/*#__PURE__*/(0,jsx_runtime.jsx)("div",{className:"leading-tight",children:monthLabel({birthdate,index})})]}),elternteile.map((_ref4,i)=>{let{months}=_ref4;return/*#__PURE__*/(0,jsx_runtime.jsx)("td",{className:"pl-32 align-top last:pr-8",children:/*#__PURE__*/(0,jsx_runtime.jsx)(PlanungsdetailsMonth,{month:months[index]})},"".concat(index).concat(i));})]},index))})]});}
// EXTERNAL MODULE: ./src/redux/stepNachwuchsSlice.ts
var stepNachwuchsSlice = __webpack_require__(8632);
;// CONCATENATED MODULE: ./src/components/organisms/planungsuebersicht/Planungsdetails.tsx
function Planungsdetails(_ref){let{data}=_ref;const birthdate=(0,hooks/* useAppSelector */.CG)(stepNachwuchsSlice/* stepNachwuchsSelectors */.yb.getWahrscheinlichesGeburtsDatum);const sumMonths=data[1]?Math.max(data[0].months.length,data[1].months.length):data[0].months.length;const elternteile=data;return/*#__PURE__*/(0,jsx_runtime.jsxs)("div",{className:"@container/planungs-details",children:[/*#__PURE__*/(0,jsx_runtime.jsxs)("div",{className:"flex flex-col gap-y-32 @2xl/planungs-details:hidden",children:[/*#__PURE__*/(0,jsx_runtime.jsx)(PlanungsdetailsTable,{sumMonths:sumMonths,birthdate:birthdate,elternteile:[elternteile[0]]}),elternteile[1]?/*#__PURE__*/(0,jsx_runtime.jsx)(PlanungsdetailsTable,{sumMonths:sumMonths,birthdate:birthdate,elternteile:[elternteile[1]]}):""]}),/*#__PURE__*/(0,jsx_runtime.jsx)("div",{className:"hidden @2xl/planungs-details:block",children:/*#__PURE__*/(0,jsx_runtime.jsx)(PlanungsdetailsTable,{sumMonths:sumMonths,birthdate:birthdate,elternteile:elternteile})})]});}
;// CONCATENATED MODULE: ./src/components/organisms/planungsuebersicht/index.ts

// EXTERNAL MODULE: ./src/components/organisms/page/index.ts + 4 modules
var page = __webpack_require__(2995);
// EXTERNAL MODULE: ./src/utils/formSteps.ts
var formSteps = __webpack_require__(8137);
// EXTERNAL MODULE: ./src/globals/js/namespace.js + 1 modules
var namespace = __webpack_require__(9242);
// EXTERNAL MODULE: ./src/globals/js/egr-configuration.ts
var egr_configuration = __webpack_require__(6746);
;// CONCATENATED MODULE: ./src/components/organisms/planungsuebersicht/usePlanungsdaten.ts
function usePlanungdaten(){const isSingleParent=(0,hooks/* useAppSelector */.CG)(isSingleParentSelector);const planungsdatenET1=(0,hooks/* useAppSelector */.CG)(planungsdatenET1Selector);const planungsdatenET2=(0,hooks/* useAppSelector */.CG)(planungsdatenET2Selector);return isSingleParent?[planungsdatenET1]:[planungsdatenET1,planungsdatenET2];}const isSingleParentSelector=(0,hooks/* createAppSelector */.v6)([state=>state.stepAllgemeineAngaben.antragstellende],antragstellende=>antragstellende==="EinenElternteil");const planungsdatenET1Selector=createPlanungsdatenSelector("ET1");const planungsdatenET2Selector=createPlanungsdatenSelector("ET2");function createPlanungsdatenSelector(elternteil){return (0,hooks/* createAppSelector */.v6)([state=>state.stepAllgemeineAngaben.pseudonym[elternteil]||elternteil.replace("ET","Elternteil "),state=>state.monatsplaner.elternteile[elternteil].months,state=>state.stepRechner[elternteil].elterngeldResult,stepNachwuchsSlice/* stepNachwuchsSelectors */.yb.getWahrscheinlichesGeburtsDatum],(pseudonym,months,elterngeldResult,birthdate)=>({name:pseudonym,totalNumberOfMonths:countPlannedMonths(months),geldInsgesamt:sumUpElterngeld(months,elterngeldResult)+sumUpNettoEinkommen(months,elterngeldResult),zeitraeueme:assembleZeitraeume(months,birthdate),details:combineDetails(months,elterngeldResult),months:trimMonths(combineMonths(months,elterngeldResult))}));}function combineMonths(months,elterngeldResult){const resultPerMonth=flattenElterngeldResult(elterngeldResult);return months.map((month,index)=>{const elterngeld=readElterngeld(resultPerMonth[index],month.type);const nettoEinkommen=resultPerMonth[index].nettoEinkommen;return{...month,elterngeld,nettoEinkommen,verfuegbaresEinkommen:elterngeld+nettoEinkommen};});}function trimMonths(months){const lastRelevantIndex=months.findLastIndex(month=>month.type!=="None");return months.slice(0,lastRelevantIndex+1);}function combineDetails(months,elterngeldResult){return{BEG:combineDetailsOfVariante("BEG",months,elterngeldResult),"EG+":combineDetailsOfVariante("EG+",months,elterngeldResult),PSB:combineDetailsOfVariante("PSB",months,elterngeldResult)};}function combineDetailsOfVariante(variante,months,elterngeldResult){return{numberOfMonths:countPlannedMonths(months,[variante]),elterngeld:sumUpElterngeld(months,elterngeldResult,[variante]),nettoEinkommen:sumUpNettoEinkommen(months,elterngeldResult,[variante])};}function countPlannedMonths(months){let filter=arguments.length>1&&arguments[1]!==undefined?arguments[1]:["BEG","EG+","PSB"];return months.filter(month=>month.type!=="None"&&filter.includes(month.type)).length;}function sumUpElterngeld(months,elterngeldResult){let filter=arguments.length>2&&arguments[2]!==undefined?arguments[2]:["BEG","EG+","PSB"];const resultPerMonth=flattenElterngeldResult(elterngeldResult);const elterngeldPerMonth=months.map((month,monthIndex)=>{const isOfInterest=month.type!=="None"&&filter.includes(month.type);const resultForMonth=resultPerMonth[monthIndex];return isOfInterest?readElterngeld(resultForMonth,month.type):0;});return elterngeldPerMonth.reduce((sum,elterngeld)=>sum+elterngeld,0);}function sumUpNettoEinkommen(months,elterngeldResult){let filter=arguments.length>2&&arguments[2]!==undefined?arguments[2]:["BEG","EG+","PSB","None"];const resultPerMonth=flattenElterngeldResult(elterngeldResult);const nettoEinkommenPerMonth=months.map((month,monthIndex)=>{const isOfInterest=filter.includes(month.type);const resultForMonth=resultPerMonth[monthIndex];return isOfInterest?resultForMonth.nettoEinkommen:0;});return nettoEinkommenPerMonth.reduce((sum,einkommen)=>sum+einkommen,0);}function flattenElterngeldResult(elterngeldResult){const rows=elterngeldResult.state==="success"?elterngeldResult.data:[];return Array.from({length:egr_configuration/* EgrConst */.r.lebensMonateMaxNumber},(_,monthIndex)=>{const row=rows.find(checkRowIncludesMonth.bind({monthIndex}));return row!==null&&row!==void 0?row:createRowWithNoElterngeld(monthIndex);});}function readElterngeld(resultForMonth,variante){switch(variante){case"BEG":return resultForMonth.basisElternGeld;case"EG+":case"PSB":return resultForMonth.elternGeldPlus;case"None":return 0;}}function checkRowIncludesMonth(row){const fromMonthIndex=row.vonLebensMonat-1;const tillMonthIndex=row.bisLebensMonat-1;return fromMonthIndex<=this.monthIndex&&this.monthIndex<=tillMonthIndex;}function createRowWithNoElterngeld(monthIndex){return{vonLebensMonat:monthIndex,bisLebensMonat:monthIndex,basisElternGeld:0,elternGeldPlus:0,nettoEinkommen:0};}function assembleZeitraeume(months,birthdate){// ["BEG", "EG+", "None", "PSB"] -> [[0, 1], [3]]
const groupsOfFollowingMonthIndexesWithElterngeld=months.reduce((groups,month,index)=>{if(month.type==="None"){groups.push([]);}else{const lastGroup=groups[groups.length-1];lastGroup.push(index);}return groups;},[[]]).filter(group=>group.length>0);const zeitraeumeByLebensmonate=groupsOfFollowingMonthIndexesWithElterngeld.map(group=>({fromLebensmonat:group[0]+1,toLebensmonat:group[group.length-1]+1}));return zeitraeumeByLebensmonate.map(zeitraum=>({from:copyAndShiftDate(birthdate,{months:zeitraum.fromLebensmonat-1}),to:copyAndShiftDate(birthdate,{months:zeitraum.toLebensmonat,days:-1// Zeitraum ends one day before next Lebensmonat begins.
})}));}function copyAndShiftDate(date,shiftBy){var _shiftBy$months,_shiftBy$days;const copiedDate=new Date(date);copiedDate.setMonth(copiedDate.getMonth()+((_shiftBy$months=shiftBy.months)!==null&&_shiftBy$months!==void 0?_shiftBy$months:0));copiedDate.setDate(copiedDate.getDate()+((_shiftBy$days=shiftBy.days)!==null&&_shiftBy$days!==void 0?_shiftBy$days:0));return copiedDate;}
;// CONCATENATED MODULE: ./src/components/pages/ZusammenfassungUndDatenPage.tsx
function ZusammenfassungUndDatenPage(){const descriptionIdentifier=(0,react.useId)();const data=usePlanungdaten();const navigate=(0,dist/* useNavigate */.s0)();const navigateToPreviousStep=()=>navigate(formSteps/* formSteps */.w.rechnerUndPlaner.route);return/*#__PURE__*/(0,jsx_runtime.jsxs)(page/* Page */.T,{step:formSteps/* formSteps */.w.zusammenfassungUndDaten,children:[/*#__PURE__*/(0,jsx_runtime.jsxs)("div",{className:"mb-40 flex flex-wrap justify-between gap-y-80",children:[/*#__PURE__*/(0,jsx_runtime.jsxs)("section",{className:"flex basis-full flex-col gap-24","aria-describedby":descriptionIdentifier,children:[/*#__PURE__*/(0,jsx_runtime.jsx)("h3",{children:"Zusammenfassung"}),/*#__PURE__*/(0,jsx_runtime.jsx)("p",{id:descriptionIdentifier,children:"Hier finden sie eine \xDCbersicht Ihrer Planung der Elterngeldmonate"}),/*#__PURE__*/(0,jsx_runtime.jsx)(Planungsuebersicht,{data:data})]}),/*#__PURE__*/(0,jsx_runtime.jsxs)("section",{className:"flex basis-full break-before-page break-inside-avoid flex-col gap-y-16",children:[/*#__PURE__*/(0,jsx_runtime.jsx)("h3",{children:"Planung der Monate im Detail"}),/*#__PURE__*/(0,jsx_runtime.jsx)(Planungsdetails,{data:data})]})]}),/*#__PURE__*/(0,jsx_runtime.jsxs)("div",{className:"flex flex-col gap-y-32",children:[/*#__PURE__*/(0,jsx_runtime.jsx)("div",{children:/*#__PURE__*/(0,jsx_runtime.jsx)(atoms/* PrintButton */.g3,{})}),/*#__PURE__*/(0,jsx_runtime.jsxs)("section",{className:(0,namespace/* default */.Z)("monatsplaner__button-group"),children:[/*#__PURE__*/(0,jsx_runtime.jsx)(atoms/* Button */.zx,{buttonStyle:"secondary",label:"Zur\xFCck",onClick:navigateToPreviousStep}),/*#__PURE__*/(0,jsx_runtime.jsx)(DatenInAntragUebernehmenButton,{})]})]})]});}/* harmony default export */ const pages_ZusammenfassungUndDatenPage = (ZusammenfassungUndDatenPage);

/***/ }),

/***/ 6746:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   r: () => (/* binding */ EgrConst)
/* harmony export */ });
const EgrConst={lebensMonateMaxNumber:32};

/***/ }),

/***/ 996:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
var jsx_runtime_1 = __webpack_require__(184);
var SvgAdd = function (props) {
  return (0, jsx_runtime_1.jsxs)("svg", __assign({
    xmlns: "http://www.w3.org/2000/svg",
    height: 24,
    viewBox: "0 0 24 24",
    width: 24,
    "data-testid": "AddIcon",
    role: "graphics-symbol img",
    focusable: "false",
    "aria-hidden": "true"
  }, props, {
    children: [(0, jsx_runtime_1.jsx)("path", {
      d: "M0 0h24v24H0z",
      fill: "none"
    }), (0, jsx_runtime_1.jsx)("path", {
      d: "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"
    })]
  }));
};
exports["default"] = SvgAdd;

/***/ }),

/***/ 2758:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
var jsx_runtime_1 = __webpack_require__(184);
var SvgBusinessCenterOutlined = function (props) {
  return (0, jsx_runtime_1.jsxs)("svg", __assign({
    xmlns: "http://www.w3.org/2000/svg",
    height: 24,
    viewBox: "0 0 24 24",
    width: 24,
    "data-testid": "BusinessCenterOutlinedIcon",
    role: "graphics-symbol img",
    focusable: "false",
    "aria-hidden": "true"
  }, props, {
    children: [(0, jsx_runtime_1.jsx)("path", {
      d: "M0 0h24v24H0V0z",
      fill: "none"
    }), (0, jsx_runtime_1.jsx)("path", {
      d: "M20 7h-4V5l-2-2h-4L8 5v2H4c-1.1 0-2 .9-2 2v5c0 .75.4 1.38 1 1.73V19c0 1.11.89 2 2 2h14c1.11 0 2-.89 2-2v-3.28c.59-.35 1-.99 1-1.72V9c0-1.1-.9-2-2-2zM10 5h4v2h-4V5zM4 9h16v5h-5v-3H9v3H4V9zm9 6h-2v-2h2v2zm6 4H5v-3h4v1h6v-1h4v3z"
    })]
  }));
};
exports["default"] = SvgBusinessCenterOutlined;

/***/ })

}]);
//# sourceMappingURL=205.c1f2dae3.chunk.js.map