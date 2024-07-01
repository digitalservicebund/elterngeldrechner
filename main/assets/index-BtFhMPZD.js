const __vite__fileDeps=["assets/AllgemeineAngabenPage-j2_9zHKS.js","assets/Monatsplaner-nokPzFHG.js","assets/egr-configuration-CQt2ffdT.js","assets/Split-CaS9lp_z.js","assets/ButtonGroup-C-QMXmQO.js","assets/NachwuchsPage-ByUDLxG7.js","assets/ErwerbstaetigkeitPage-CB2sLASB.js","assets/EinkommenPage-B2YjSp0S.js","assets/RechnerPlanerPage-jHWUVCjq.js","assets/ZusammenfassungUndDatenPage-DIj7DDpj.js"],__vite__mapDeps=i=>i.map(i=>__vite__fileDeps[i]);
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
function _mergeNamespaces(n2, m2) {
  for (var i = 0; i < m2.length; i++) {
    const e = m2[i];
    if (typeof e !== "string" && !Array.isArray(e)) {
      for (const k2 in e) {
        if (k2 !== "default" && !(k2 in n2)) {
          const d = Object.getOwnPropertyDescriptor(e, k2);
          if (d) {
            Object.defineProperty(n2, k2, d.get ? d : {
              enumerable: true,
              get: () => e[k2]
            });
          }
        }
      }
    }
  }
  return Object.freeze(Object.defineProperty(n2, Symbol.toStringTag, { value: "Module" }));
}
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x2) {
  return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
}
function getAugmentedNamespace(n2) {
  if (n2.__esModule) return n2;
  var f2 = n2.default;
  if (typeof f2 == "function") {
    var a = function a2() {
      if (this instanceof a2) {
        return Reflect.construct(f2, arguments, this.constructor);
      }
      return f2.apply(this, arguments);
    };
    a.prototype = f2.prototype;
  } else a = {};
  Object.defineProperty(a, "__esModule", { value: true });
  Object.keys(n2).forEach(function(k2) {
    var d = Object.getOwnPropertyDescriptor(n2, k2);
    Object.defineProperty(a, k2, d.get ? d : {
      enumerable: true,
      get: function() {
        return n2[k2];
      }
    });
  });
  return a;
}
var jsxRuntime = { exports: {} };
var reactJsxRuntime_production_min = {};
var react = { exports: {} };
var react_production_min = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var l$2 = Symbol.for("react.element"), n$3 = Symbol.for("react.portal"), p$3 = Symbol.for("react.fragment"), q$2 = Symbol.for("react.strict_mode"), r$1 = Symbol.for("react.profiler"), t$1 = Symbol.for("react.provider"), u$1 = Symbol.for("react.context"), v$2 = Symbol.for("react.forward_ref"), w = Symbol.for("react.suspense"), x = Symbol.for("react.memo"), y = Symbol.for("react.lazy"), z$1 = Symbol.iterator;
function A$1(a) {
  if (null === a || "object" !== typeof a) return null;
  a = z$1 && a[z$1] || a["@@iterator"];
  return "function" === typeof a ? a : null;
}
var B$1 = { isMounted: function() {
  return false;
}, enqueueForceUpdate: function() {
}, enqueueReplaceState: function() {
}, enqueueSetState: function() {
} }, C$1 = Object.assign, D$1 = {};
function E$1(a, b, e) {
  this.props = a;
  this.context = b;
  this.refs = D$1;
  this.updater = e || B$1;
}
E$1.prototype.isReactComponent = {};
E$1.prototype.setState = function(a, b) {
  if ("object" !== typeof a && "function" !== typeof a && null != a) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
  this.updater.enqueueSetState(this, a, b, "setState");
};
E$1.prototype.forceUpdate = function(a) {
  this.updater.enqueueForceUpdate(this, a, "forceUpdate");
};
function F() {
}
F.prototype = E$1.prototype;
function G$1(a, b, e) {
  this.props = a;
  this.context = b;
  this.refs = D$1;
  this.updater = e || B$1;
}
var H$1 = G$1.prototype = new F();
H$1.constructor = G$1;
C$1(H$1, E$1.prototype);
H$1.isPureReactComponent = true;
var I$1 = Array.isArray, J = Object.prototype.hasOwnProperty, K$1 = { current: null }, L$1 = { key: true, ref: true, __self: true, __source: true };
function M$1(a, b, e) {
  var d, c = {}, k2 = null, h = null;
  if (null != b) for (d in void 0 !== b.ref && (h = b.ref), void 0 !== b.key && (k2 = "" + b.key), b) J.call(b, d) && !L$1.hasOwnProperty(d) && (c[d] = b[d]);
  var g2 = arguments.length - 2;
  if (1 === g2) c.children = e;
  else if (1 < g2) {
    for (var f2 = Array(g2), m2 = 0; m2 < g2; m2++) f2[m2] = arguments[m2 + 2];
    c.children = f2;
  }
  if (a && a.defaultProps) for (d in g2 = a.defaultProps, g2) void 0 === c[d] && (c[d] = g2[d]);
  return { $$typeof: l$2, type: a, key: k2, ref: h, props: c, _owner: K$1.current };
}
function N$1(a, b) {
  return { $$typeof: l$2, type: a.type, key: b, ref: a.ref, props: a.props, _owner: a._owner };
}
function O$1(a) {
  return "object" === typeof a && null !== a && a.$$typeof === l$2;
}
function escape(a) {
  var b = { "=": "=0", ":": "=2" };
  return "$" + a.replace(/[=:]/g, function(a2) {
    return b[a2];
  });
}
var P$2 = /\/+/g;
function Q$1(a, b) {
  return "object" === typeof a && null !== a && null != a.key ? escape("" + a.key) : b.toString(36);
}
function R$1(a, b, e, d, c) {
  var k2 = typeof a;
  if ("undefined" === k2 || "boolean" === k2) a = null;
  var h = false;
  if (null === a) h = true;
  else switch (k2) {
    case "string":
    case "number":
      h = true;
      break;
    case "object":
      switch (a.$$typeof) {
        case l$2:
        case n$3:
          h = true;
      }
  }
  if (h) return h = a, c = c(h), a = "" === d ? "." + Q$1(h, 0) : d, I$1(c) ? (e = "", null != a && (e = a.replace(P$2, "$&/") + "/"), R$1(c, b, e, "", function(a2) {
    return a2;
  })) : null != c && (O$1(c) && (c = N$1(c, e + (!c.key || h && h.key === c.key ? "" : ("" + c.key).replace(P$2, "$&/") + "/") + a)), b.push(c)), 1;
  h = 0;
  d = "" === d ? "." : d + ":";
  if (I$1(a)) for (var g2 = 0; g2 < a.length; g2++) {
    k2 = a[g2];
    var f2 = d + Q$1(k2, g2);
    h += R$1(k2, b, e, f2, c);
  }
  else if (f2 = A$1(a), "function" === typeof f2) for (a = f2.call(a), g2 = 0; !(k2 = a.next()).done; ) k2 = k2.value, f2 = d + Q$1(k2, g2++), h += R$1(k2, b, e, f2, c);
  else if ("object" === k2) throw b = String(a), Error("Objects are not valid as a React child (found: " + ("[object Object]" === b ? "object with keys {" + Object.keys(a).join(", ") + "}" : b) + "). If you meant to render a collection of children, use an array instead.");
  return h;
}
function S$1(a, b, e) {
  if (null == a) return a;
  var d = [], c = 0;
  R$1(a, d, "", "", function(a2) {
    return b.call(e, a2, c++);
  });
  return d;
}
function T$1(a) {
  if (-1 === a._status) {
    var b = a._result;
    b = b();
    b.then(function(b2) {
      if (0 === a._status || -1 === a._status) a._status = 1, a._result = b2;
    }, function(b2) {
      if (0 === a._status || -1 === a._status) a._status = 2, a._result = b2;
    });
    -1 === a._status && (a._status = 0, a._result = b);
  }
  if (1 === a._status) return a._result.default;
  throw a._result;
}
var U$1 = { current: null }, V$1 = { transition: null }, W$1 = { ReactCurrentDispatcher: U$1, ReactCurrentBatchConfig: V$1, ReactCurrentOwner: K$1 };
react_production_min.Children = { map: S$1, forEach: function(a, b, e) {
  S$1(a, function() {
    b.apply(this, arguments);
  }, e);
}, count: function(a) {
  var b = 0;
  S$1(a, function() {
    b++;
  });
  return b;
}, toArray: function(a) {
  return S$1(a, function(a2) {
    return a2;
  }) || [];
}, only: function(a) {
  if (!O$1(a)) throw Error("React.Children.only expected to receive a single React element child.");
  return a;
} };
react_production_min.Component = E$1;
react_production_min.Fragment = p$3;
react_production_min.Profiler = r$1;
react_production_min.PureComponent = G$1;
react_production_min.StrictMode = q$2;
react_production_min.Suspense = w;
react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W$1;
react_production_min.cloneElement = function(a, b, e) {
  if (null === a || void 0 === a) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a + ".");
  var d = C$1({}, a.props), c = a.key, k2 = a.ref, h = a._owner;
  if (null != b) {
    void 0 !== b.ref && (k2 = b.ref, h = K$1.current);
    void 0 !== b.key && (c = "" + b.key);
    if (a.type && a.type.defaultProps) var g2 = a.type.defaultProps;
    for (f2 in b) J.call(b, f2) && !L$1.hasOwnProperty(f2) && (d[f2] = void 0 === b[f2] && void 0 !== g2 ? g2[f2] : b[f2]);
  }
  var f2 = arguments.length - 2;
  if (1 === f2) d.children = e;
  else if (1 < f2) {
    g2 = Array(f2);
    for (var m2 = 0; m2 < f2; m2++) g2[m2] = arguments[m2 + 2];
    d.children = g2;
  }
  return { $$typeof: l$2, type: a.type, key: c, ref: k2, props: d, _owner: h };
};
react_production_min.createContext = function(a) {
  a = { $$typeof: u$1, _currentValue: a, _currentValue2: a, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null };
  a.Provider = { $$typeof: t$1, _context: a };
  return a.Consumer = a;
};
react_production_min.createElement = M$1;
react_production_min.createFactory = function(a) {
  var b = M$1.bind(null, a);
  b.type = a;
  return b;
};
react_production_min.createRef = function() {
  return { current: null };
};
react_production_min.forwardRef = function(a) {
  return { $$typeof: v$2, render: a };
};
react_production_min.isValidElement = O$1;
react_production_min.lazy = function(a) {
  return { $$typeof: y, _payload: { _status: -1, _result: a }, _init: T$1 };
};
react_production_min.memo = function(a, b) {
  return { $$typeof: x, type: a, compare: void 0 === b ? null : b };
};
react_production_min.startTransition = function(a) {
  var b = V$1.transition;
  V$1.transition = {};
  try {
    a();
  } finally {
    V$1.transition = b;
  }
};
react_production_min.unstable_act = function() {
  throw Error("act(...) is not supported in production builds of React.");
};
react_production_min.useCallback = function(a, b) {
  return U$1.current.useCallback(a, b);
};
react_production_min.useContext = function(a) {
  return U$1.current.useContext(a);
};
react_production_min.useDebugValue = function() {
};
react_production_min.useDeferredValue = function(a) {
  return U$1.current.useDeferredValue(a);
};
react_production_min.useEffect = function(a, b) {
  return U$1.current.useEffect(a, b);
};
react_production_min.useId = function() {
  return U$1.current.useId();
};
react_production_min.useImperativeHandle = function(a, b, e) {
  return U$1.current.useImperativeHandle(a, b, e);
};
react_production_min.useInsertionEffect = function(a, b) {
  return U$1.current.useInsertionEffect(a, b);
};
react_production_min.useLayoutEffect = function(a, b) {
  return U$1.current.useLayoutEffect(a, b);
};
react_production_min.useMemo = function(a, b) {
  return U$1.current.useMemo(a, b);
};
react_production_min.useReducer = function(a, b, e) {
  return U$1.current.useReducer(a, b, e);
};
react_production_min.useRef = function(a) {
  return U$1.current.useRef(a);
};
react_production_min.useState = function(a) {
  return U$1.current.useState(a);
};
react_production_min.useSyncExternalStore = function(a, b, e) {
  return U$1.current.useSyncExternalStore(a, b, e);
};
react_production_min.useTransition = function() {
  return U$1.current.useTransition();
};
react_production_min.version = "18.2.0";
{
  react.exports = react_production_min;
}
var reactExports = react.exports;
const React$1 = /* @__PURE__ */ getDefaultExportFromCjs(reactExports);
const React$2 = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  default: React$1
}, [reactExports]);
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f = reactExports, k = Symbol.for("react.element"), l$1 = Symbol.for("react.fragment"), m$1 = Object.prototype.hasOwnProperty, n$2 = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p$2 = { key: true, ref: true, __self: true, __source: true };
function q$1(c, a, g2) {
  var b, d = {}, e = null, h = null;
  void 0 !== g2 && (e = "" + g2);
  void 0 !== a.key && (e = "" + a.key);
  void 0 !== a.ref && (h = a.ref);
  for (b in a) m$1.call(a, b) && !p$2.hasOwnProperty(b) && (d[b] = a[b]);
  if (c && c.defaultProps) for (b in a = c.defaultProps, a) void 0 === d[b] && (d[b] = a[b]);
  return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n$2.current };
}
reactJsxRuntime_production_min.Fragment = l$1;
reactJsxRuntime_production_min.jsx = q$1;
reactJsxRuntime_production_min.jsxs = q$1;
{
  jsxRuntime.exports = reactJsxRuntime_production_min;
}
var jsxRuntimeExports = jsxRuntime.exports;
var reactDom = { exports: {} };
var reactDom_production_min = {};
var scheduler = { exports: {} };
var scheduler_production_min = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(function(exports) {
  function f2(a, b) {
    var c = a.length;
    a.push(b);
    a: for (; 0 < c; ) {
      var d = c - 1 >>> 1, e = a[d];
      if (0 < g2(e, b)) a[d] = b, a[c] = e, c = d;
      else break a;
    }
  }
  function h(a) {
    return 0 === a.length ? null : a[0];
  }
  function k2(a) {
    if (0 === a.length) return null;
    var b = a[0], c = a.pop();
    if (c !== b) {
      a[0] = c;
      a: for (var d = 0, e = a.length, w2 = e >>> 1; d < w2; ) {
        var m2 = 2 * (d + 1) - 1, C2 = a[m2], n2 = m2 + 1, x2 = a[n2];
        if (0 > g2(C2, c)) n2 < e && 0 > g2(x2, C2) ? (a[d] = x2, a[n2] = c, d = n2) : (a[d] = C2, a[m2] = c, d = m2);
        else if (n2 < e && 0 > g2(x2, c)) a[d] = x2, a[n2] = c, d = n2;
        else break a;
      }
    }
    return b;
  }
  function g2(a, b) {
    var c = a.sortIndex - b.sortIndex;
    return 0 !== c ? c : a.id - b.id;
  }
  if ("object" === typeof performance && "function" === typeof performance.now) {
    var l2 = performance;
    exports.unstable_now = function() {
      return l2.now();
    };
  } else {
    var p2 = Date, q2 = p2.now();
    exports.unstable_now = function() {
      return p2.now() - q2;
    };
  }
  var r2 = [], t2 = [], u2 = 1, v2 = null, y2 = 3, z2 = false, A2 = false, B2 = false, D2 = "function" === typeof setTimeout ? setTimeout : null, E2 = "function" === typeof clearTimeout ? clearTimeout : null, F2 = "undefined" !== typeof setImmediate ? setImmediate : null;
  "undefined" !== typeof navigator && void 0 !== navigator.scheduling && void 0 !== navigator.scheduling.isInputPending && navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function G2(a) {
    for (var b = h(t2); null !== b; ) {
      if (null === b.callback) k2(t2);
      else if (b.startTime <= a) k2(t2), b.sortIndex = b.expirationTime, f2(r2, b);
      else break;
      b = h(t2);
    }
  }
  function H2(a) {
    B2 = false;
    G2(a);
    if (!A2) if (null !== h(r2)) A2 = true, I2(J2);
    else {
      var b = h(t2);
      null !== b && K2(H2, b.startTime - a);
    }
  }
  function J2(a, b) {
    A2 = false;
    B2 && (B2 = false, E2(L2), L2 = -1);
    z2 = true;
    var c = y2;
    try {
      G2(b);
      for (v2 = h(r2); null !== v2 && (!(v2.expirationTime > b) || a && !M2()); ) {
        var d = v2.callback;
        if ("function" === typeof d) {
          v2.callback = null;
          y2 = v2.priorityLevel;
          var e = d(v2.expirationTime <= b);
          b = exports.unstable_now();
          "function" === typeof e ? v2.callback = e : v2 === h(r2) && k2(r2);
          G2(b);
        } else k2(r2);
        v2 = h(r2);
      }
      if (null !== v2) var w2 = true;
      else {
        var m2 = h(t2);
        null !== m2 && K2(H2, m2.startTime - b);
        w2 = false;
      }
      return w2;
    } finally {
      v2 = null, y2 = c, z2 = false;
    }
  }
  var N2 = false, O2 = null, L2 = -1, P2 = 5, Q2 = -1;
  function M2() {
    return exports.unstable_now() - Q2 < P2 ? false : true;
  }
  function R2() {
    if (null !== O2) {
      var a = exports.unstable_now();
      Q2 = a;
      var b = true;
      try {
        b = O2(true, a);
      } finally {
        b ? S2() : (N2 = false, O2 = null);
      }
    } else N2 = false;
  }
  var S2;
  if ("function" === typeof F2) S2 = function() {
    F2(R2);
  };
  else if ("undefined" !== typeof MessageChannel) {
    var T2 = new MessageChannel(), U2 = T2.port2;
    T2.port1.onmessage = R2;
    S2 = function() {
      U2.postMessage(null);
    };
  } else S2 = function() {
    D2(R2, 0);
  };
  function I2(a) {
    O2 = a;
    N2 || (N2 = true, S2());
  }
  function K2(a, b) {
    L2 = D2(function() {
      a(exports.unstable_now());
    }, b);
  }
  exports.unstable_IdlePriority = 5;
  exports.unstable_ImmediatePriority = 1;
  exports.unstable_LowPriority = 4;
  exports.unstable_NormalPriority = 3;
  exports.unstable_Profiling = null;
  exports.unstable_UserBlockingPriority = 2;
  exports.unstable_cancelCallback = function(a) {
    a.callback = null;
  };
  exports.unstable_continueExecution = function() {
    A2 || z2 || (A2 = true, I2(J2));
  };
  exports.unstable_forceFrameRate = function(a) {
    0 > a || 125 < a ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : P2 = 0 < a ? Math.floor(1e3 / a) : 5;
  };
  exports.unstable_getCurrentPriorityLevel = function() {
    return y2;
  };
  exports.unstable_getFirstCallbackNode = function() {
    return h(r2);
  };
  exports.unstable_next = function(a) {
    switch (y2) {
      case 1:
      case 2:
      case 3:
        var b = 3;
        break;
      default:
        b = y2;
    }
    var c = y2;
    y2 = b;
    try {
      return a();
    } finally {
      y2 = c;
    }
  };
  exports.unstable_pauseExecution = function() {
  };
  exports.unstable_requestPaint = function() {
  };
  exports.unstable_runWithPriority = function(a, b) {
    switch (a) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        break;
      default:
        a = 3;
    }
    var c = y2;
    y2 = a;
    try {
      return b();
    } finally {
      y2 = c;
    }
  };
  exports.unstable_scheduleCallback = function(a, b, c) {
    var d = exports.unstable_now();
    "object" === typeof c && null !== c ? (c = c.delay, c = "number" === typeof c && 0 < c ? d + c : d) : c = d;
    switch (a) {
      case 1:
        var e = -1;
        break;
      case 2:
        e = 250;
        break;
      case 5:
        e = 1073741823;
        break;
      case 4:
        e = 1e4;
        break;
      default:
        e = 5e3;
    }
    e = c + e;
    a = { id: u2++, callback: b, priorityLevel: a, startTime: c, expirationTime: e, sortIndex: -1 };
    c > d ? (a.sortIndex = c, f2(t2, a), null === h(r2) && a === h(t2) && (B2 ? (E2(L2), L2 = -1) : B2 = true, K2(H2, c - d))) : (a.sortIndex = e, f2(r2, a), A2 || z2 || (A2 = true, I2(J2)));
    return a;
  };
  exports.unstable_shouldYield = M2;
  exports.unstable_wrapCallback = function(a) {
    var b = y2;
    return function() {
      var c = y2;
      y2 = b;
      try {
        return a.apply(this, arguments);
      } finally {
        y2 = c;
      }
    };
  };
})(scheduler_production_min);
{
  scheduler.exports = scheduler_production_min;
}
var schedulerExports = scheduler.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var aa = reactExports, ca = schedulerExports;
function p$1(a) {
  for (var b = "https://reactjs.org/docs/error-decoder.html?invariant=" + a, c = 1; c < arguments.length; c++) b += "&args[]=" + encodeURIComponent(arguments[c]);
  return "Minified React error #" + a + "; visit " + b + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
var da = /* @__PURE__ */ new Set(), ea = {};
function fa(a, b) {
  ha(a, b);
  ha(a + "Capture", b);
}
function ha(a, b) {
  ea[a] = b;
  for (a = 0; a < b.length; a++) da.add(b[a]);
}
var ia = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement), ja = Object.prototype.hasOwnProperty, ka = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, la = {}, ma = {};
function oa(a) {
  if (ja.call(ma, a)) return true;
  if (ja.call(la, a)) return false;
  if (ka.test(a)) return ma[a] = true;
  la[a] = true;
  return false;
}
function pa(a, b, c, d) {
  if (null !== c && 0 === c.type) return false;
  switch (typeof b) {
    case "function":
    case "symbol":
      return true;
    case "boolean":
      if (d) return false;
      if (null !== c) return !c.acceptsBooleans;
      a = a.toLowerCase().slice(0, 5);
      return "data-" !== a && "aria-" !== a;
    default:
      return false;
  }
}
function qa(a, b, c, d) {
  if (null === b || "undefined" === typeof b || pa(a, b, c, d)) return true;
  if (d) return false;
  if (null !== c) switch (c.type) {
    case 3:
      return !b;
    case 4:
      return false === b;
    case 5:
      return isNaN(b);
    case 6:
      return isNaN(b) || 1 > b;
  }
  return false;
}
function v$1(a, b, c, d, e, f2, g2) {
  this.acceptsBooleans = 2 === b || 3 === b || 4 === b;
  this.attributeName = d;
  this.attributeNamespace = e;
  this.mustUseProperty = c;
  this.propertyName = a;
  this.type = b;
  this.sanitizeURL = f2;
  this.removeEmptyString = g2;
}
var z = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a) {
  z[a] = new v$1(a, 0, false, a, null, false, false);
});
[["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(a) {
  var b = a[0];
  z[b] = new v$1(b, 1, false, a[1], null, false, false);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function(a) {
  z[a] = new v$1(a, 2, false, a.toLowerCase(), null, false, false);
});
["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(a) {
  z[a] = new v$1(a, 2, false, a, null, false, false);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a) {
  z[a] = new v$1(a, 3, false, a.toLowerCase(), null, false, false);
});
["checked", "multiple", "muted", "selected"].forEach(function(a) {
  z[a] = new v$1(a, 3, true, a, null, false, false);
});
["capture", "download"].forEach(function(a) {
  z[a] = new v$1(a, 4, false, a, null, false, false);
});
["cols", "rows", "size", "span"].forEach(function(a) {
  z[a] = new v$1(a, 6, false, a, null, false, false);
});
["rowSpan", "start"].forEach(function(a) {
  z[a] = new v$1(a, 5, false, a.toLowerCase(), null, false, false);
});
var ra = /[\-:]([a-z])/g;
function sa(a) {
  return a[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a) {
  var b = a.replace(
    ra,
    sa
  );
  z[b] = new v$1(b, 1, false, a, null, false, false);
});
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a) {
  var b = a.replace(ra, sa);
  z[b] = new v$1(b, 1, false, a, "http://www.w3.org/1999/xlink", false, false);
});
["xml:base", "xml:lang", "xml:space"].forEach(function(a) {
  var b = a.replace(ra, sa);
  z[b] = new v$1(b, 1, false, a, "http://www.w3.org/XML/1998/namespace", false, false);
});
["tabIndex", "crossOrigin"].forEach(function(a) {
  z[a] = new v$1(a, 1, false, a.toLowerCase(), null, false, false);
});
z.xlinkHref = new v$1("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false);
["src", "href", "action", "formAction"].forEach(function(a) {
  z[a] = new v$1(a, 1, false, a.toLowerCase(), null, true, true);
});
function ta(a, b, c, d) {
  var e = z.hasOwnProperty(b) ? z[b] : null;
  if (null !== e ? 0 !== e.type : d || !(2 < b.length) || "o" !== b[0] && "O" !== b[0] || "n" !== b[1] && "N" !== b[1]) qa(b, c, e, d) && (c = null), d || null === e ? oa(b) && (null === c ? a.removeAttribute(b) : a.setAttribute(b, "" + c)) : e.mustUseProperty ? a[e.propertyName] = null === c ? 3 === e.type ? false : "" : c : (b = e.attributeName, d = e.attributeNamespace, null === c ? a.removeAttribute(b) : (e = e.type, c = 3 === e || 4 === e && true === c ? "" : "" + c, d ? a.setAttributeNS(d, b, c) : a.setAttribute(b, c)));
}
var ua = aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, va = Symbol.for("react.element"), wa = Symbol.for("react.portal"), ya = Symbol.for("react.fragment"), za = Symbol.for("react.strict_mode"), Aa = Symbol.for("react.profiler"), Ba = Symbol.for("react.provider"), Ca = Symbol.for("react.context"), Da = Symbol.for("react.forward_ref"), Ea = Symbol.for("react.suspense"), Fa = Symbol.for("react.suspense_list"), Ga = Symbol.for("react.memo"), Ha = Symbol.for("react.lazy");
var Ia = Symbol.for("react.offscreen");
var Ja = Symbol.iterator;
function Ka(a) {
  if (null === a || "object" !== typeof a) return null;
  a = Ja && a[Ja] || a["@@iterator"];
  return "function" === typeof a ? a : null;
}
var A = Object.assign, La;
function Ma(a) {
  if (void 0 === La) try {
    throw Error();
  } catch (c) {
    var b = c.stack.trim().match(/\n( *(at )?)/);
    La = b && b[1] || "";
  }
  return "\n" + La + a;
}
var Na = false;
function Oa(a, b) {
  if (!a || Na) return "";
  Na = true;
  var c = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (b) if (b = function() {
      throw Error();
    }, Object.defineProperty(b.prototype, "props", { set: function() {
      throw Error();
    } }), "object" === typeof Reflect && Reflect.construct) {
      try {
        Reflect.construct(b, []);
      } catch (l2) {
        var d = l2;
      }
      Reflect.construct(a, [], b);
    } else {
      try {
        b.call();
      } catch (l2) {
        d = l2;
      }
      a.call(b.prototype);
    }
    else {
      try {
        throw Error();
      } catch (l2) {
        d = l2;
      }
      a();
    }
  } catch (l2) {
    if (l2 && d && "string" === typeof l2.stack) {
      for (var e = l2.stack.split("\n"), f2 = d.stack.split("\n"), g2 = e.length - 1, h = f2.length - 1; 1 <= g2 && 0 <= h && e[g2] !== f2[h]; ) h--;
      for (; 1 <= g2 && 0 <= h; g2--, h--) if (e[g2] !== f2[h]) {
        if (1 !== g2 || 1 !== h) {
          do
            if (g2--, h--, 0 > h || e[g2] !== f2[h]) {
              var k2 = "\n" + e[g2].replace(" at new ", " at ");
              a.displayName && k2.includes("<anonymous>") && (k2 = k2.replace("<anonymous>", a.displayName));
              return k2;
            }
          while (1 <= g2 && 0 <= h);
        }
        break;
      }
    }
  } finally {
    Na = false, Error.prepareStackTrace = c;
  }
  return (a = a ? a.displayName || a.name : "") ? Ma(a) : "";
}
function Pa(a) {
  switch (a.tag) {
    case 5:
      return Ma(a.type);
    case 16:
      return Ma("Lazy");
    case 13:
      return Ma("Suspense");
    case 19:
      return Ma("SuspenseList");
    case 0:
    case 2:
    case 15:
      return a = Oa(a.type, false), a;
    case 11:
      return a = Oa(a.type.render, false), a;
    case 1:
      return a = Oa(a.type, true), a;
    default:
      return "";
  }
}
function Qa(a) {
  if (null == a) return null;
  if ("function" === typeof a) return a.displayName || a.name || null;
  if ("string" === typeof a) return a;
  switch (a) {
    case ya:
      return "Fragment";
    case wa:
      return "Portal";
    case Aa:
      return "Profiler";
    case za:
      return "StrictMode";
    case Ea:
      return "Suspense";
    case Fa:
      return "SuspenseList";
  }
  if ("object" === typeof a) switch (a.$$typeof) {
    case Ca:
      return (a.displayName || "Context") + ".Consumer";
    case Ba:
      return (a._context.displayName || "Context") + ".Provider";
    case Da:
      var b = a.render;
      a = a.displayName;
      a || (a = b.displayName || b.name || "", a = "" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
      return a;
    case Ga:
      return b = a.displayName || null, null !== b ? b : Qa(a.type) || "Memo";
    case Ha:
      b = a._payload;
      a = a._init;
      try {
        return Qa(a(b));
      } catch (c) {
      }
  }
  return null;
}
function Ra(a) {
  var b = a.type;
  switch (a.tag) {
    case 24:
      return "Cache";
    case 9:
      return (b.displayName || "Context") + ".Consumer";
    case 10:
      return (b._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return a = b.render, a = a.displayName || a.name || "", b.displayName || ("" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
    case 7:
      return "Fragment";
    case 5:
      return b;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return Qa(b);
    case 8:
      return b === za ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if ("function" === typeof b) return b.displayName || b.name || null;
      if ("string" === typeof b) return b;
  }
  return null;
}
function Sa(a) {
  switch (typeof a) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return a;
    case "object":
      return a;
    default:
      return "";
  }
}
function Ta(a) {
  var b = a.type;
  return (a = a.nodeName) && "input" === a.toLowerCase() && ("checkbox" === b || "radio" === b);
}
function Ua(a) {
  var b = Ta(a) ? "checked" : "value", c = Object.getOwnPropertyDescriptor(a.constructor.prototype, b), d = "" + a[b];
  if (!a.hasOwnProperty(b) && "undefined" !== typeof c && "function" === typeof c.get && "function" === typeof c.set) {
    var e = c.get, f2 = c.set;
    Object.defineProperty(a, b, { configurable: true, get: function() {
      return e.call(this);
    }, set: function(a2) {
      d = "" + a2;
      f2.call(this, a2);
    } });
    Object.defineProperty(a, b, { enumerable: c.enumerable });
    return { getValue: function() {
      return d;
    }, setValue: function(a2) {
      d = "" + a2;
    }, stopTracking: function() {
      a._valueTracker = null;
      delete a[b];
    } };
  }
}
function Va(a) {
  a._valueTracker || (a._valueTracker = Ua(a));
}
function Wa(a) {
  if (!a) return false;
  var b = a._valueTracker;
  if (!b) return true;
  var c = b.getValue();
  var d = "";
  a && (d = Ta(a) ? a.checked ? "true" : "false" : a.value);
  a = d;
  return a !== c ? (b.setValue(a), true) : false;
}
function Xa(a) {
  a = a || ("undefined" !== typeof document ? document : void 0);
  if ("undefined" === typeof a) return null;
  try {
    return a.activeElement || a.body;
  } catch (b) {
    return a.body;
  }
}
function Ya(a, b) {
  var c = b.checked;
  return A({}, b, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: null != c ? c : a._wrapperState.initialChecked });
}
function Za(a, b) {
  var c = null == b.defaultValue ? "" : b.defaultValue, d = null != b.checked ? b.checked : b.defaultChecked;
  c = Sa(null != b.value ? b.value : c);
  a._wrapperState = { initialChecked: d, initialValue: c, controlled: "checkbox" === b.type || "radio" === b.type ? null != b.checked : null != b.value };
}
function ab(a, b) {
  b = b.checked;
  null != b && ta(a, "checked", b, false);
}
function bb(a, b) {
  ab(a, b);
  var c = Sa(b.value), d = b.type;
  if (null != c) if ("number" === d) {
    if (0 === c && "" === a.value || a.value != c) a.value = "" + c;
  } else a.value !== "" + c && (a.value = "" + c);
  else if ("submit" === d || "reset" === d) {
    a.removeAttribute("value");
    return;
  }
  b.hasOwnProperty("value") ? cb(a, b.type, c) : b.hasOwnProperty("defaultValue") && cb(a, b.type, Sa(b.defaultValue));
  null == b.checked && null != b.defaultChecked && (a.defaultChecked = !!b.defaultChecked);
}
function db(a, b, c) {
  if (b.hasOwnProperty("value") || b.hasOwnProperty("defaultValue")) {
    var d = b.type;
    if (!("submit" !== d && "reset" !== d || void 0 !== b.value && null !== b.value)) return;
    b = "" + a._wrapperState.initialValue;
    c || b === a.value || (a.value = b);
    a.defaultValue = b;
  }
  c = a.name;
  "" !== c && (a.name = "");
  a.defaultChecked = !!a._wrapperState.initialChecked;
  "" !== c && (a.name = c);
}
function cb(a, b, c) {
  if ("number" !== b || Xa(a.ownerDocument) !== a) null == c ? a.defaultValue = "" + a._wrapperState.initialValue : a.defaultValue !== "" + c && (a.defaultValue = "" + c);
}
var eb = Array.isArray;
function fb(a, b, c, d) {
  a = a.options;
  if (b) {
    b = {};
    for (var e = 0; e < c.length; e++) b["$" + c[e]] = true;
    for (c = 0; c < a.length; c++) e = b.hasOwnProperty("$" + a[c].value), a[c].selected !== e && (a[c].selected = e), e && d && (a[c].defaultSelected = true);
  } else {
    c = "" + Sa(c);
    b = null;
    for (e = 0; e < a.length; e++) {
      if (a[e].value === c) {
        a[e].selected = true;
        d && (a[e].defaultSelected = true);
        return;
      }
      null !== b || a[e].disabled || (b = a[e]);
    }
    null !== b && (b.selected = true);
  }
}
function gb(a, b) {
  if (null != b.dangerouslySetInnerHTML) throw Error(p$1(91));
  return A({}, b, { value: void 0, defaultValue: void 0, children: "" + a._wrapperState.initialValue });
}
function hb(a, b) {
  var c = b.value;
  if (null == c) {
    c = b.children;
    b = b.defaultValue;
    if (null != c) {
      if (null != b) throw Error(p$1(92));
      if (eb(c)) {
        if (1 < c.length) throw Error(p$1(93));
        c = c[0];
      }
      b = c;
    }
    null == b && (b = "");
    c = b;
  }
  a._wrapperState = { initialValue: Sa(c) };
}
function ib(a, b) {
  var c = Sa(b.value), d = Sa(b.defaultValue);
  null != c && (c = "" + c, c !== a.value && (a.value = c), null == b.defaultValue && a.defaultValue !== c && (a.defaultValue = c));
  null != d && (a.defaultValue = "" + d);
}
function jb(a) {
  var b = a.textContent;
  b === a._wrapperState.initialValue && "" !== b && null !== b && (a.value = b);
}
function kb(a) {
  switch (a) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function lb(a, b) {
  return null == a || "http://www.w3.org/1999/xhtml" === a ? kb(b) : "http://www.w3.org/2000/svg" === a && "foreignObject" === b ? "http://www.w3.org/1999/xhtml" : a;
}
var mb, nb = function(a) {
  return "undefined" !== typeof MSApp && MSApp.execUnsafeLocalFunction ? function(b, c, d, e) {
    MSApp.execUnsafeLocalFunction(function() {
      return a(b, c, d, e);
    });
  } : a;
}(function(a, b) {
  if ("http://www.w3.org/2000/svg" !== a.namespaceURI || "innerHTML" in a) a.innerHTML = b;
  else {
    mb = mb || document.createElement("div");
    mb.innerHTML = "<svg>" + b.valueOf().toString() + "</svg>";
    for (b = mb.firstChild; a.firstChild; ) a.removeChild(a.firstChild);
    for (; b.firstChild; ) a.appendChild(b.firstChild);
  }
});
function ob(a, b) {
  if (b) {
    var c = a.firstChild;
    if (c && c === a.lastChild && 3 === c.nodeType) {
      c.nodeValue = b;
      return;
    }
  }
  a.textContent = b;
}
var pb = {
  animationIterationCount: true,
  aspectRatio: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridArea: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true
}, qb = ["Webkit", "ms", "Moz", "O"];
Object.keys(pb).forEach(function(a) {
  qb.forEach(function(b) {
    b = b + a.charAt(0).toUpperCase() + a.substring(1);
    pb[b] = pb[a];
  });
});
function rb(a, b, c) {
  return null == b || "boolean" === typeof b || "" === b ? "" : c || "number" !== typeof b || 0 === b || pb.hasOwnProperty(a) && pb[a] ? ("" + b).trim() : b + "px";
}
function sb(a, b) {
  a = a.style;
  for (var c in b) if (b.hasOwnProperty(c)) {
    var d = 0 === c.indexOf("--"), e = rb(c, b[c], d);
    "float" === c && (c = "cssFloat");
    d ? a.setProperty(c, e) : a[c] = e;
  }
}
var tb = A({ menuitem: true }, { area: true, base: true, br: true, col: true, embed: true, hr: true, img: true, input: true, keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true });
function ub(a, b) {
  if (b) {
    if (tb[a] && (null != b.children || null != b.dangerouslySetInnerHTML)) throw Error(p$1(137, a));
    if (null != b.dangerouslySetInnerHTML) {
      if (null != b.children) throw Error(p$1(60));
      if ("object" !== typeof b.dangerouslySetInnerHTML || !("__html" in b.dangerouslySetInnerHTML)) throw Error(p$1(61));
    }
    if (null != b.style && "object" !== typeof b.style) throw Error(p$1(62));
  }
}
function vb(a, b) {
  if (-1 === a.indexOf("-")) return "string" === typeof b.is;
  switch (a) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return false;
    default:
      return true;
  }
}
var wb = null;
function xb(a) {
  a = a.target || a.srcElement || window;
  a.correspondingUseElement && (a = a.correspondingUseElement);
  return 3 === a.nodeType ? a.parentNode : a;
}
var yb = null, zb = null, Ab = null;
function Bb(a) {
  if (a = Cb(a)) {
    if ("function" !== typeof yb) throw Error(p$1(280));
    var b = a.stateNode;
    b && (b = Db(b), yb(a.stateNode, a.type, b));
  }
}
function Eb(a) {
  zb ? Ab ? Ab.push(a) : Ab = [a] : zb = a;
}
function Fb() {
  if (zb) {
    var a = zb, b = Ab;
    Ab = zb = null;
    Bb(a);
    if (b) for (a = 0; a < b.length; a++) Bb(b[a]);
  }
}
function Gb(a, b) {
  return a(b);
}
function Hb() {
}
var Ib = false;
function Jb(a, b, c) {
  if (Ib) return a(b, c);
  Ib = true;
  try {
    return Gb(a, b, c);
  } finally {
    if (Ib = false, null !== zb || null !== Ab) Hb(), Fb();
  }
}
function Kb(a, b) {
  var c = a.stateNode;
  if (null === c) return null;
  var d = Db(c);
  if (null === d) return null;
  c = d[b];
  a: switch (b) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      (d = !d.disabled) || (a = a.type, d = !("button" === a || "input" === a || "select" === a || "textarea" === a));
      a = !d;
      break a;
    default:
      a = false;
  }
  if (a) return null;
  if (c && "function" !== typeof c) throw Error(p$1(231, b, typeof c));
  return c;
}
var Lb = false;
if (ia) try {
  var Mb = {};
  Object.defineProperty(Mb, "passive", { get: function() {
    Lb = true;
  } });
  window.addEventListener("test", Mb, Mb);
  window.removeEventListener("test", Mb, Mb);
} catch (a) {
  Lb = false;
}
function Nb(a, b, c, d, e, f2, g2, h, k2) {
  var l2 = Array.prototype.slice.call(arguments, 3);
  try {
    b.apply(c, l2);
  } catch (m2) {
    this.onError(m2);
  }
}
var Ob = false, Pb = null, Qb = false, Rb = null, Sb = { onError: function(a) {
  Ob = true;
  Pb = a;
} };
function Tb(a, b, c, d, e, f2, g2, h, k2) {
  Ob = false;
  Pb = null;
  Nb.apply(Sb, arguments);
}
function Ub(a, b, c, d, e, f2, g2, h, k2) {
  Tb.apply(this, arguments);
  if (Ob) {
    if (Ob) {
      var l2 = Pb;
      Ob = false;
      Pb = null;
    } else throw Error(p$1(198));
    Qb || (Qb = true, Rb = l2);
  }
}
function Vb(a) {
  var b = a, c = a;
  if (a.alternate) for (; b.return; ) b = b.return;
  else {
    a = b;
    do
      b = a, 0 !== (b.flags & 4098) && (c = b.return), a = b.return;
    while (a);
  }
  return 3 === b.tag ? c : null;
}
function Wb(a) {
  if (13 === a.tag) {
    var b = a.memoizedState;
    null === b && (a = a.alternate, null !== a && (b = a.memoizedState));
    if (null !== b) return b.dehydrated;
  }
  return null;
}
function Xb(a) {
  if (Vb(a) !== a) throw Error(p$1(188));
}
function Yb(a) {
  var b = a.alternate;
  if (!b) {
    b = Vb(a);
    if (null === b) throw Error(p$1(188));
    return b !== a ? null : a;
  }
  for (var c = a, d = b; ; ) {
    var e = c.return;
    if (null === e) break;
    var f2 = e.alternate;
    if (null === f2) {
      d = e.return;
      if (null !== d) {
        c = d;
        continue;
      }
      break;
    }
    if (e.child === f2.child) {
      for (f2 = e.child; f2; ) {
        if (f2 === c) return Xb(e), a;
        if (f2 === d) return Xb(e), b;
        f2 = f2.sibling;
      }
      throw Error(p$1(188));
    }
    if (c.return !== d.return) c = e, d = f2;
    else {
      for (var g2 = false, h = e.child; h; ) {
        if (h === c) {
          g2 = true;
          c = e;
          d = f2;
          break;
        }
        if (h === d) {
          g2 = true;
          d = e;
          c = f2;
          break;
        }
        h = h.sibling;
      }
      if (!g2) {
        for (h = f2.child; h; ) {
          if (h === c) {
            g2 = true;
            c = f2;
            d = e;
            break;
          }
          if (h === d) {
            g2 = true;
            d = f2;
            c = e;
            break;
          }
          h = h.sibling;
        }
        if (!g2) throw Error(p$1(189));
      }
    }
    if (c.alternate !== d) throw Error(p$1(190));
  }
  if (3 !== c.tag) throw Error(p$1(188));
  return c.stateNode.current === c ? a : b;
}
function Zb(a) {
  a = Yb(a);
  return null !== a ? $b(a) : null;
}
function $b(a) {
  if (5 === a.tag || 6 === a.tag) return a;
  for (a = a.child; null !== a; ) {
    var b = $b(a);
    if (null !== b) return b;
    a = a.sibling;
  }
  return null;
}
var ac = ca.unstable_scheduleCallback, bc = ca.unstable_cancelCallback, cc = ca.unstable_shouldYield, dc = ca.unstable_requestPaint, B = ca.unstable_now, ec = ca.unstable_getCurrentPriorityLevel, fc = ca.unstable_ImmediatePriority, gc = ca.unstable_UserBlockingPriority, hc = ca.unstable_NormalPriority, ic = ca.unstable_LowPriority, jc = ca.unstable_IdlePriority, kc = null, lc = null;
function mc(a) {
  if (lc && "function" === typeof lc.onCommitFiberRoot) try {
    lc.onCommitFiberRoot(kc, a, void 0, 128 === (a.current.flags & 128));
  } catch (b) {
  }
}
var oc = Math.clz32 ? Math.clz32 : nc, pc = Math.log, qc = Math.LN2;
function nc(a) {
  a >>>= 0;
  return 0 === a ? 32 : 31 - (pc(a) / qc | 0) | 0;
}
var rc = 64, sc = 4194304;
function tc(a) {
  switch (a & -a) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return a & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return a & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return a;
  }
}
function uc(a, b) {
  var c = a.pendingLanes;
  if (0 === c) return 0;
  var d = 0, e = a.suspendedLanes, f2 = a.pingedLanes, g2 = c & 268435455;
  if (0 !== g2) {
    var h = g2 & ~e;
    0 !== h ? d = tc(h) : (f2 &= g2, 0 !== f2 && (d = tc(f2)));
  } else g2 = c & ~e, 0 !== g2 ? d = tc(g2) : 0 !== f2 && (d = tc(f2));
  if (0 === d) return 0;
  if (0 !== b && b !== d && 0 === (b & e) && (e = d & -d, f2 = b & -b, e >= f2 || 16 === e && 0 !== (f2 & 4194240))) return b;
  0 !== (d & 4) && (d |= c & 16);
  b = a.entangledLanes;
  if (0 !== b) for (a = a.entanglements, b &= d; 0 < b; ) c = 31 - oc(b), e = 1 << c, d |= a[c], b &= ~e;
  return d;
}
function vc(a, b) {
  switch (a) {
    case 1:
    case 2:
    case 4:
      return b + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return b + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function wc(a, b) {
  for (var c = a.suspendedLanes, d = a.pingedLanes, e = a.expirationTimes, f2 = a.pendingLanes; 0 < f2; ) {
    var g2 = 31 - oc(f2), h = 1 << g2, k2 = e[g2];
    if (-1 === k2) {
      if (0 === (h & c) || 0 !== (h & d)) e[g2] = vc(h, b);
    } else k2 <= b && (a.expiredLanes |= h);
    f2 &= ~h;
  }
}
function xc(a) {
  a = a.pendingLanes & -1073741825;
  return 0 !== a ? a : a & 1073741824 ? 1073741824 : 0;
}
function yc() {
  var a = rc;
  rc <<= 1;
  0 === (rc & 4194240) && (rc = 64);
  return a;
}
function zc(a) {
  for (var b = [], c = 0; 31 > c; c++) b.push(a);
  return b;
}
function Ac(a, b, c) {
  a.pendingLanes |= b;
  536870912 !== b && (a.suspendedLanes = 0, a.pingedLanes = 0);
  a = a.eventTimes;
  b = 31 - oc(b);
  a[b] = c;
}
function Bc(a, b) {
  var c = a.pendingLanes & ~b;
  a.pendingLanes = b;
  a.suspendedLanes = 0;
  a.pingedLanes = 0;
  a.expiredLanes &= b;
  a.mutableReadLanes &= b;
  a.entangledLanes &= b;
  b = a.entanglements;
  var d = a.eventTimes;
  for (a = a.expirationTimes; 0 < c; ) {
    var e = 31 - oc(c), f2 = 1 << e;
    b[e] = 0;
    d[e] = -1;
    a[e] = -1;
    c &= ~f2;
  }
}
function Cc(a, b) {
  var c = a.entangledLanes |= b;
  for (a = a.entanglements; c; ) {
    var d = 31 - oc(c), e = 1 << d;
    e & b | a[d] & b && (a[d] |= b);
    c &= ~e;
  }
}
var C = 0;
function Dc(a) {
  a &= -a;
  return 1 < a ? 4 < a ? 0 !== (a & 268435455) ? 16 : 536870912 : 4 : 1;
}
var Ec, Fc, Gc, Hc, Ic, Jc = false, Kc = [], Lc = null, Mc = null, Nc = null, Oc = /* @__PURE__ */ new Map(), Pc = /* @__PURE__ */ new Map(), Qc = [], Rc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function Sc(a, b) {
  switch (a) {
    case "focusin":
    case "focusout":
      Lc = null;
      break;
    case "dragenter":
    case "dragleave":
      Mc = null;
      break;
    case "mouseover":
    case "mouseout":
      Nc = null;
      break;
    case "pointerover":
    case "pointerout":
      Oc.delete(b.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      Pc.delete(b.pointerId);
  }
}
function Tc(a, b, c, d, e, f2) {
  if (null === a || a.nativeEvent !== f2) return a = { blockedOn: b, domEventName: c, eventSystemFlags: d, nativeEvent: f2, targetContainers: [e] }, null !== b && (b = Cb(b), null !== b && Fc(b)), a;
  a.eventSystemFlags |= d;
  b = a.targetContainers;
  null !== e && -1 === b.indexOf(e) && b.push(e);
  return a;
}
function Uc(a, b, c, d, e) {
  switch (b) {
    case "focusin":
      return Lc = Tc(Lc, a, b, c, d, e), true;
    case "dragenter":
      return Mc = Tc(Mc, a, b, c, d, e), true;
    case "mouseover":
      return Nc = Tc(Nc, a, b, c, d, e), true;
    case "pointerover":
      var f2 = e.pointerId;
      Oc.set(f2, Tc(Oc.get(f2) || null, a, b, c, d, e));
      return true;
    case "gotpointercapture":
      return f2 = e.pointerId, Pc.set(f2, Tc(Pc.get(f2) || null, a, b, c, d, e)), true;
  }
  return false;
}
function Vc(a) {
  var b = Wc(a.target);
  if (null !== b) {
    var c = Vb(b);
    if (null !== c) {
      if (b = c.tag, 13 === b) {
        if (b = Wb(c), null !== b) {
          a.blockedOn = b;
          Ic(a.priority, function() {
            Gc(c);
          });
          return;
        }
      } else if (3 === b && c.stateNode.current.memoizedState.isDehydrated) {
        a.blockedOn = 3 === c.tag ? c.stateNode.containerInfo : null;
        return;
      }
    }
  }
  a.blockedOn = null;
}
function Xc(a) {
  if (null !== a.blockedOn) return false;
  for (var b = a.targetContainers; 0 < b.length; ) {
    var c = Yc(a.domEventName, a.eventSystemFlags, b[0], a.nativeEvent);
    if (null === c) {
      c = a.nativeEvent;
      var d = new c.constructor(c.type, c);
      wb = d;
      c.target.dispatchEvent(d);
      wb = null;
    } else return b = Cb(c), null !== b && Fc(b), a.blockedOn = c, false;
    b.shift();
  }
  return true;
}
function Zc(a, b, c) {
  Xc(a) && c.delete(b);
}
function $c() {
  Jc = false;
  null !== Lc && Xc(Lc) && (Lc = null);
  null !== Mc && Xc(Mc) && (Mc = null);
  null !== Nc && Xc(Nc) && (Nc = null);
  Oc.forEach(Zc);
  Pc.forEach(Zc);
}
function ad(a, b) {
  a.blockedOn === b && (a.blockedOn = null, Jc || (Jc = true, ca.unstable_scheduleCallback(ca.unstable_NormalPriority, $c)));
}
function bd(a) {
  function b(b2) {
    return ad(b2, a);
  }
  if (0 < Kc.length) {
    ad(Kc[0], a);
    for (var c = 1; c < Kc.length; c++) {
      var d = Kc[c];
      d.blockedOn === a && (d.blockedOn = null);
    }
  }
  null !== Lc && ad(Lc, a);
  null !== Mc && ad(Mc, a);
  null !== Nc && ad(Nc, a);
  Oc.forEach(b);
  Pc.forEach(b);
  for (c = 0; c < Qc.length; c++) d = Qc[c], d.blockedOn === a && (d.blockedOn = null);
  for (; 0 < Qc.length && (c = Qc[0], null === c.blockedOn); ) Vc(c), null === c.blockedOn && Qc.shift();
}
var cd = ua.ReactCurrentBatchConfig, dd = true;
function ed(a, b, c, d) {
  var e = C, f2 = cd.transition;
  cd.transition = null;
  try {
    C = 1, fd(a, b, c, d);
  } finally {
    C = e, cd.transition = f2;
  }
}
function gd(a, b, c, d) {
  var e = C, f2 = cd.transition;
  cd.transition = null;
  try {
    C = 4, fd(a, b, c, d);
  } finally {
    C = e, cd.transition = f2;
  }
}
function fd(a, b, c, d) {
  if (dd) {
    var e = Yc(a, b, c, d);
    if (null === e) hd(a, b, d, id, c), Sc(a, d);
    else if (Uc(e, a, b, c, d)) d.stopPropagation();
    else if (Sc(a, d), b & 4 && -1 < Rc.indexOf(a)) {
      for (; null !== e; ) {
        var f2 = Cb(e);
        null !== f2 && Ec(f2);
        f2 = Yc(a, b, c, d);
        null === f2 && hd(a, b, d, id, c);
        if (f2 === e) break;
        e = f2;
      }
      null !== e && d.stopPropagation();
    } else hd(a, b, d, null, c);
  }
}
var id = null;
function Yc(a, b, c, d) {
  id = null;
  a = xb(d);
  a = Wc(a);
  if (null !== a) if (b = Vb(a), null === b) a = null;
  else if (c = b.tag, 13 === c) {
    a = Wb(b);
    if (null !== a) return a;
    a = null;
  } else if (3 === c) {
    if (b.stateNode.current.memoizedState.isDehydrated) return 3 === b.tag ? b.stateNode.containerInfo : null;
    a = null;
  } else b !== a && (a = null);
  id = a;
  return null;
}
function jd(a) {
  switch (a) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (ec()) {
        case fc:
          return 1;
        case gc:
          return 4;
        case hc:
        case ic:
          return 16;
        case jc:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var kd = null, ld = null, md = null;
function nd() {
  if (md) return md;
  var a, b = ld, c = b.length, d, e = "value" in kd ? kd.value : kd.textContent, f2 = e.length;
  for (a = 0; a < c && b[a] === e[a]; a++) ;
  var g2 = c - a;
  for (d = 1; d <= g2 && b[c - d] === e[f2 - d]; d++) ;
  return md = e.slice(a, 1 < d ? 1 - d : void 0);
}
function od(a) {
  var b = a.keyCode;
  "charCode" in a ? (a = a.charCode, 0 === a && 13 === b && (a = 13)) : a = b;
  10 === a && (a = 13);
  return 32 <= a || 13 === a ? a : 0;
}
function pd() {
  return true;
}
function qd() {
  return false;
}
function rd(a) {
  function b(b2, d, e, f2, g2) {
    this._reactName = b2;
    this._targetInst = e;
    this.type = d;
    this.nativeEvent = f2;
    this.target = g2;
    this.currentTarget = null;
    for (var c in a) a.hasOwnProperty(c) && (b2 = a[c], this[c] = b2 ? b2(f2) : f2[c]);
    this.isDefaultPrevented = (null != f2.defaultPrevented ? f2.defaultPrevented : false === f2.returnValue) ? pd : qd;
    this.isPropagationStopped = qd;
    return this;
  }
  A(b.prototype, { preventDefault: function() {
    this.defaultPrevented = true;
    var a2 = this.nativeEvent;
    a2 && (a2.preventDefault ? a2.preventDefault() : "unknown" !== typeof a2.returnValue && (a2.returnValue = false), this.isDefaultPrevented = pd);
  }, stopPropagation: function() {
    var a2 = this.nativeEvent;
    a2 && (a2.stopPropagation ? a2.stopPropagation() : "unknown" !== typeof a2.cancelBubble && (a2.cancelBubble = true), this.isPropagationStopped = pd);
  }, persist: function() {
  }, isPersistent: pd });
  return b;
}
var sd = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(a) {
  return a.timeStamp || Date.now();
}, defaultPrevented: 0, isTrusted: 0 }, td = rd(sd), ud = A({}, sd, { view: 0, detail: 0 }), vd = rd(ud), wd, xd, yd, Ad = A({}, ud, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: zd, button: 0, buttons: 0, relatedTarget: function(a) {
  return void 0 === a.relatedTarget ? a.fromElement === a.srcElement ? a.toElement : a.fromElement : a.relatedTarget;
}, movementX: function(a) {
  if ("movementX" in a) return a.movementX;
  a !== yd && (yd && "mousemove" === a.type ? (wd = a.screenX - yd.screenX, xd = a.screenY - yd.screenY) : xd = wd = 0, yd = a);
  return wd;
}, movementY: function(a) {
  return "movementY" in a ? a.movementY : xd;
} }), Bd = rd(Ad), Cd = A({}, Ad, { dataTransfer: 0 }), Dd = rd(Cd), Ed = A({}, ud, { relatedTarget: 0 }), Fd = rd(Ed), Gd = A({}, sd, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Hd = rd(Gd), Id = A({}, sd, { clipboardData: function(a) {
  return "clipboardData" in a ? a.clipboardData : window.clipboardData;
} }), Jd = rd(Id), Kd = A({}, sd, { data: 0 }), Ld = rd(Kd), Md = {
  Esc: "Escape",
  Spacebar: " ",
  Left: "ArrowLeft",
  Up: "ArrowUp",
  Right: "ArrowRight",
  Down: "ArrowDown",
  Del: "Delete",
  Win: "OS",
  Menu: "ContextMenu",
  Apps: "ContextMenu",
  Scroll: "ScrollLock",
  MozPrintableKey: "Unidentified"
}, Nd = {
  8: "Backspace",
  9: "Tab",
  12: "Clear",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  19: "Pause",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  45: "Insert",
  46: "Delete",
  112: "F1",
  113: "F2",
  114: "F3",
  115: "F4",
  116: "F5",
  117: "F6",
  118: "F7",
  119: "F8",
  120: "F9",
  121: "F10",
  122: "F11",
  123: "F12",
  144: "NumLock",
  145: "ScrollLock",
  224: "Meta"
}, Od = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
function Pd(a) {
  var b = this.nativeEvent;
  return b.getModifierState ? b.getModifierState(a) : (a = Od[a]) ? !!b[a] : false;
}
function zd() {
  return Pd;
}
var Qd = A({}, ud, { key: function(a) {
  if (a.key) {
    var b = Md[a.key] || a.key;
    if ("Unidentified" !== b) return b;
  }
  return "keypress" === a.type ? (a = od(a), 13 === a ? "Enter" : String.fromCharCode(a)) : "keydown" === a.type || "keyup" === a.type ? Nd[a.keyCode] || "Unidentified" : "";
}, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: zd, charCode: function(a) {
  return "keypress" === a.type ? od(a) : 0;
}, keyCode: function(a) {
  return "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
}, which: function(a) {
  return "keypress" === a.type ? od(a) : "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
} }), Rd = rd(Qd), Sd = A({}, Ad, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Td = rd(Sd), Ud = A({}, ud, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: zd }), Vd = rd(Ud), Wd = A({}, sd, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Xd = rd(Wd), Yd = A({}, Ad, {
  deltaX: function(a) {
    return "deltaX" in a ? a.deltaX : "wheelDeltaX" in a ? -a.wheelDeltaX : 0;
  },
  deltaY: function(a) {
    return "deltaY" in a ? a.deltaY : "wheelDeltaY" in a ? -a.wheelDeltaY : "wheelDelta" in a ? -a.wheelDelta : 0;
  },
  deltaZ: 0,
  deltaMode: 0
}), Zd = rd(Yd), $d = [9, 13, 27, 32], ae = ia && "CompositionEvent" in window, be = null;
ia && "documentMode" in document && (be = document.documentMode);
var ce = ia && "TextEvent" in window && !be, de = ia && (!ae || be && 8 < be && 11 >= be), ee = String.fromCharCode(32), fe = false;
function ge(a, b) {
  switch (a) {
    case "keyup":
      return -1 !== $d.indexOf(b.keyCode);
    case "keydown":
      return 229 !== b.keyCode;
    case "keypress":
    case "mousedown":
    case "focusout":
      return true;
    default:
      return false;
  }
}
function he(a) {
  a = a.detail;
  return "object" === typeof a && "data" in a ? a.data : null;
}
var ie = false;
function je(a, b) {
  switch (a) {
    case "compositionend":
      return he(b);
    case "keypress":
      if (32 !== b.which) return null;
      fe = true;
      return ee;
    case "textInput":
      return a = b.data, a === ee && fe ? null : a;
    default:
      return null;
  }
}
function ke(a, b) {
  if (ie) return "compositionend" === a || !ae && ge(a, b) ? (a = nd(), md = ld = kd = null, ie = false, a) : null;
  switch (a) {
    case "paste":
      return null;
    case "keypress":
      if (!(b.ctrlKey || b.altKey || b.metaKey) || b.ctrlKey && b.altKey) {
        if (b.char && 1 < b.char.length) return b.char;
        if (b.which) return String.fromCharCode(b.which);
      }
      return null;
    case "compositionend":
      return de && "ko" !== b.locale ? null : b.data;
    default:
      return null;
  }
}
var le = { color: true, date: true, datetime: true, "datetime-local": true, email: true, month: true, number: true, password: true, range: true, search: true, tel: true, text: true, time: true, url: true, week: true };
function me(a) {
  var b = a && a.nodeName && a.nodeName.toLowerCase();
  return "input" === b ? !!le[a.type] : "textarea" === b ? true : false;
}
function ne(a, b, c, d) {
  Eb(d);
  b = oe(b, "onChange");
  0 < b.length && (c = new td("onChange", "change", null, c, d), a.push({ event: c, listeners: b }));
}
var pe = null, qe = null;
function re(a) {
  se(a, 0);
}
function te(a) {
  var b = ue(a);
  if (Wa(b)) return a;
}
function ve(a, b) {
  if ("change" === a) return b;
}
var we = false;
if (ia) {
  var xe;
  if (ia) {
    var ye = "oninput" in document;
    if (!ye) {
      var ze = document.createElement("div");
      ze.setAttribute("oninput", "return;");
      ye = "function" === typeof ze.oninput;
    }
    xe = ye;
  } else xe = false;
  we = xe && (!document.documentMode || 9 < document.documentMode);
}
function Ae() {
  pe && (pe.detachEvent("onpropertychange", Be), qe = pe = null);
}
function Be(a) {
  if ("value" === a.propertyName && te(qe)) {
    var b = [];
    ne(b, qe, a, xb(a));
    Jb(re, b);
  }
}
function Ce(a, b, c) {
  "focusin" === a ? (Ae(), pe = b, qe = c, pe.attachEvent("onpropertychange", Be)) : "focusout" === a && Ae();
}
function De(a) {
  if ("selectionchange" === a || "keyup" === a || "keydown" === a) return te(qe);
}
function Ee(a, b) {
  if ("click" === a) return te(b);
}
function Fe(a, b) {
  if ("input" === a || "change" === a) return te(b);
}
function Ge(a, b) {
  return a === b && (0 !== a || 1 / a === 1 / b) || a !== a && b !== b;
}
var He = "function" === typeof Object.is ? Object.is : Ge;
function Ie(a, b) {
  if (He(a, b)) return true;
  if ("object" !== typeof a || null === a || "object" !== typeof b || null === b) return false;
  var c = Object.keys(a), d = Object.keys(b);
  if (c.length !== d.length) return false;
  for (d = 0; d < c.length; d++) {
    var e = c[d];
    if (!ja.call(b, e) || !He(a[e], b[e])) return false;
  }
  return true;
}
function Je(a) {
  for (; a && a.firstChild; ) a = a.firstChild;
  return a;
}
function Ke(a, b) {
  var c = Je(a);
  a = 0;
  for (var d; c; ) {
    if (3 === c.nodeType) {
      d = a + c.textContent.length;
      if (a <= b && d >= b) return { node: c, offset: b - a };
      a = d;
    }
    a: {
      for (; c; ) {
        if (c.nextSibling) {
          c = c.nextSibling;
          break a;
        }
        c = c.parentNode;
      }
      c = void 0;
    }
    c = Je(c);
  }
}
function Le(a, b) {
  return a && b ? a === b ? true : a && 3 === a.nodeType ? false : b && 3 === b.nodeType ? Le(a, b.parentNode) : "contains" in a ? a.contains(b) : a.compareDocumentPosition ? !!(a.compareDocumentPosition(b) & 16) : false : false;
}
function Me() {
  for (var a = window, b = Xa(); b instanceof a.HTMLIFrameElement; ) {
    try {
      var c = "string" === typeof b.contentWindow.location.href;
    } catch (d) {
      c = false;
    }
    if (c) a = b.contentWindow;
    else break;
    b = Xa(a.document);
  }
  return b;
}
function Ne(a) {
  var b = a && a.nodeName && a.nodeName.toLowerCase();
  return b && ("input" === b && ("text" === a.type || "search" === a.type || "tel" === a.type || "url" === a.type || "password" === a.type) || "textarea" === b || "true" === a.contentEditable);
}
function Oe(a) {
  var b = Me(), c = a.focusedElem, d = a.selectionRange;
  if (b !== c && c && c.ownerDocument && Le(c.ownerDocument.documentElement, c)) {
    if (null !== d && Ne(c)) {
      if (b = d.start, a = d.end, void 0 === a && (a = b), "selectionStart" in c) c.selectionStart = b, c.selectionEnd = Math.min(a, c.value.length);
      else if (a = (b = c.ownerDocument || document) && b.defaultView || window, a.getSelection) {
        a = a.getSelection();
        var e = c.textContent.length, f2 = Math.min(d.start, e);
        d = void 0 === d.end ? f2 : Math.min(d.end, e);
        !a.extend && f2 > d && (e = d, d = f2, f2 = e);
        e = Ke(c, f2);
        var g2 = Ke(
          c,
          d
        );
        e && g2 && (1 !== a.rangeCount || a.anchorNode !== e.node || a.anchorOffset !== e.offset || a.focusNode !== g2.node || a.focusOffset !== g2.offset) && (b = b.createRange(), b.setStart(e.node, e.offset), a.removeAllRanges(), f2 > d ? (a.addRange(b), a.extend(g2.node, g2.offset)) : (b.setEnd(g2.node, g2.offset), a.addRange(b)));
      }
    }
    b = [];
    for (a = c; a = a.parentNode; ) 1 === a.nodeType && b.push({ element: a, left: a.scrollLeft, top: a.scrollTop });
    "function" === typeof c.focus && c.focus();
    for (c = 0; c < b.length; c++) a = b[c], a.element.scrollLeft = a.left, a.element.scrollTop = a.top;
  }
}
var Pe = ia && "documentMode" in document && 11 >= document.documentMode, Qe = null, Re = null, Se = null, Te = false;
function Ue(a, b, c) {
  var d = c.window === c ? c.document : 9 === c.nodeType ? c : c.ownerDocument;
  Te || null == Qe || Qe !== Xa(d) || (d = Qe, "selectionStart" in d && Ne(d) ? d = { start: d.selectionStart, end: d.selectionEnd } : (d = (d.ownerDocument && d.ownerDocument.defaultView || window).getSelection(), d = { anchorNode: d.anchorNode, anchorOffset: d.anchorOffset, focusNode: d.focusNode, focusOffset: d.focusOffset }), Se && Ie(Se, d) || (Se = d, d = oe(Re, "onSelect"), 0 < d.length && (b = new td("onSelect", "select", null, b, c), a.push({ event: b, listeners: d }), b.target = Qe)));
}
function Ve(a, b) {
  var c = {};
  c[a.toLowerCase()] = b.toLowerCase();
  c["Webkit" + a] = "webkit" + b;
  c["Moz" + a] = "moz" + b;
  return c;
}
var We = { animationend: Ve("Animation", "AnimationEnd"), animationiteration: Ve("Animation", "AnimationIteration"), animationstart: Ve("Animation", "AnimationStart"), transitionend: Ve("Transition", "TransitionEnd") }, Xe = {}, Ye = {};
ia && (Ye = document.createElement("div").style, "AnimationEvent" in window || (delete We.animationend.animation, delete We.animationiteration.animation, delete We.animationstart.animation), "TransitionEvent" in window || delete We.transitionend.transition);
function Ze(a) {
  if (Xe[a]) return Xe[a];
  if (!We[a]) return a;
  var b = We[a], c;
  for (c in b) if (b.hasOwnProperty(c) && c in Ye) return Xe[a] = b[c];
  return a;
}
var $e = Ze("animationend"), af = Ze("animationiteration"), bf = Ze("animationstart"), cf = Ze("transitionend"), df = /* @__PURE__ */ new Map(), ef = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
function ff(a, b) {
  df.set(a, b);
  fa(b, [a]);
}
for (var gf = 0; gf < ef.length; gf++) {
  var hf = ef[gf], jf = hf.toLowerCase(), kf = hf[0].toUpperCase() + hf.slice(1);
  ff(jf, "on" + kf);
}
ff($e, "onAnimationEnd");
ff(af, "onAnimationIteration");
ff(bf, "onAnimationStart");
ff("dblclick", "onDoubleClick");
ff("focusin", "onFocus");
ff("focusout", "onBlur");
ff(cf, "onTransitionEnd");
ha("onMouseEnter", ["mouseout", "mouseover"]);
ha("onMouseLeave", ["mouseout", "mouseover"]);
ha("onPointerEnter", ["pointerout", "pointerover"]);
ha("onPointerLeave", ["pointerout", "pointerover"]);
fa("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
fa("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
fa("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
fa("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
var lf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), mf = new Set("cancel close invalid load scroll toggle".split(" ").concat(lf));
function nf(a, b, c) {
  var d = a.type || "unknown-event";
  a.currentTarget = c;
  Ub(d, b, void 0, a);
  a.currentTarget = null;
}
function se(a, b) {
  b = 0 !== (b & 4);
  for (var c = 0; c < a.length; c++) {
    var d = a[c], e = d.event;
    d = d.listeners;
    a: {
      var f2 = void 0;
      if (b) for (var g2 = d.length - 1; 0 <= g2; g2--) {
        var h = d[g2], k2 = h.instance, l2 = h.currentTarget;
        h = h.listener;
        if (k2 !== f2 && e.isPropagationStopped()) break a;
        nf(e, h, l2);
        f2 = k2;
      }
      else for (g2 = 0; g2 < d.length; g2++) {
        h = d[g2];
        k2 = h.instance;
        l2 = h.currentTarget;
        h = h.listener;
        if (k2 !== f2 && e.isPropagationStopped()) break a;
        nf(e, h, l2);
        f2 = k2;
      }
    }
  }
  if (Qb) throw a = Rb, Qb = false, Rb = null, a;
}
function D(a, b) {
  var c = b[of];
  void 0 === c && (c = b[of] = /* @__PURE__ */ new Set());
  var d = a + "__bubble";
  c.has(d) || (pf(b, a, 2, false), c.add(d));
}
function qf(a, b, c) {
  var d = 0;
  b && (d |= 4);
  pf(c, a, d, b);
}
var rf = "_reactListening" + Math.random().toString(36).slice(2);
function sf(a) {
  if (!a[rf]) {
    a[rf] = true;
    da.forEach(function(b2) {
      "selectionchange" !== b2 && (mf.has(b2) || qf(b2, false, a), qf(b2, true, a));
    });
    var b = 9 === a.nodeType ? a : a.ownerDocument;
    null === b || b[rf] || (b[rf] = true, qf("selectionchange", false, b));
  }
}
function pf(a, b, c, d) {
  switch (jd(b)) {
    case 1:
      var e = ed;
      break;
    case 4:
      e = gd;
      break;
    default:
      e = fd;
  }
  c = e.bind(null, b, c, a);
  e = void 0;
  !Lb || "touchstart" !== b && "touchmove" !== b && "wheel" !== b || (e = true);
  d ? void 0 !== e ? a.addEventListener(b, c, { capture: true, passive: e }) : a.addEventListener(b, c, true) : void 0 !== e ? a.addEventListener(b, c, { passive: e }) : a.addEventListener(b, c, false);
}
function hd(a, b, c, d, e) {
  var f2 = d;
  if (0 === (b & 1) && 0 === (b & 2) && null !== d) a: for (; ; ) {
    if (null === d) return;
    var g2 = d.tag;
    if (3 === g2 || 4 === g2) {
      var h = d.stateNode.containerInfo;
      if (h === e || 8 === h.nodeType && h.parentNode === e) break;
      if (4 === g2) for (g2 = d.return; null !== g2; ) {
        var k2 = g2.tag;
        if (3 === k2 || 4 === k2) {
          if (k2 = g2.stateNode.containerInfo, k2 === e || 8 === k2.nodeType && k2.parentNode === e) return;
        }
        g2 = g2.return;
      }
      for (; null !== h; ) {
        g2 = Wc(h);
        if (null === g2) return;
        k2 = g2.tag;
        if (5 === k2 || 6 === k2) {
          d = f2 = g2;
          continue a;
        }
        h = h.parentNode;
      }
    }
    d = d.return;
  }
  Jb(function() {
    var d2 = f2, e2 = xb(c), g3 = [];
    a: {
      var h2 = df.get(a);
      if (void 0 !== h2) {
        var k3 = td, n2 = a;
        switch (a) {
          case "keypress":
            if (0 === od(c)) break a;
          case "keydown":
          case "keyup":
            k3 = Rd;
            break;
          case "focusin":
            n2 = "focus";
            k3 = Fd;
            break;
          case "focusout":
            n2 = "blur";
            k3 = Fd;
            break;
          case "beforeblur":
          case "afterblur":
            k3 = Fd;
            break;
          case "click":
            if (2 === c.button) break a;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            k3 = Bd;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            k3 = Dd;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            k3 = Vd;
            break;
          case $e:
          case af:
          case bf:
            k3 = Hd;
            break;
          case cf:
            k3 = Xd;
            break;
          case "scroll":
            k3 = vd;
            break;
          case "wheel":
            k3 = Zd;
            break;
          case "copy":
          case "cut":
          case "paste":
            k3 = Jd;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            k3 = Td;
        }
        var t2 = 0 !== (b & 4), J2 = !t2 && "scroll" === a, x2 = t2 ? null !== h2 ? h2 + "Capture" : null : h2;
        t2 = [];
        for (var w2 = d2, u2; null !== w2; ) {
          u2 = w2;
          var F2 = u2.stateNode;
          5 === u2.tag && null !== F2 && (u2 = F2, null !== x2 && (F2 = Kb(w2, x2), null != F2 && t2.push(tf(w2, F2, u2))));
          if (J2) break;
          w2 = w2.return;
        }
        0 < t2.length && (h2 = new k3(h2, n2, null, c, e2), g3.push({ event: h2, listeners: t2 }));
      }
    }
    if (0 === (b & 7)) {
      a: {
        h2 = "mouseover" === a || "pointerover" === a;
        k3 = "mouseout" === a || "pointerout" === a;
        if (h2 && c !== wb && (n2 = c.relatedTarget || c.fromElement) && (Wc(n2) || n2[uf])) break a;
        if (k3 || h2) {
          h2 = e2.window === e2 ? e2 : (h2 = e2.ownerDocument) ? h2.defaultView || h2.parentWindow : window;
          if (k3) {
            if (n2 = c.relatedTarget || c.toElement, k3 = d2, n2 = n2 ? Wc(n2) : null, null !== n2 && (J2 = Vb(n2), n2 !== J2 || 5 !== n2.tag && 6 !== n2.tag)) n2 = null;
          } else k3 = null, n2 = d2;
          if (k3 !== n2) {
            t2 = Bd;
            F2 = "onMouseLeave";
            x2 = "onMouseEnter";
            w2 = "mouse";
            if ("pointerout" === a || "pointerover" === a) t2 = Td, F2 = "onPointerLeave", x2 = "onPointerEnter", w2 = "pointer";
            J2 = null == k3 ? h2 : ue(k3);
            u2 = null == n2 ? h2 : ue(n2);
            h2 = new t2(F2, w2 + "leave", k3, c, e2);
            h2.target = J2;
            h2.relatedTarget = u2;
            F2 = null;
            Wc(e2) === d2 && (t2 = new t2(x2, w2 + "enter", n2, c, e2), t2.target = u2, t2.relatedTarget = J2, F2 = t2);
            J2 = F2;
            if (k3 && n2) b: {
              t2 = k3;
              x2 = n2;
              w2 = 0;
              for (u2 = t2; u2; u2 = vf(u2)) w2++;
              u2 = 0;
              for (F2 = x2; F2; F2 = vf(F2)) u2++;
              for (; 0 < w2 - u2; ) t2 = vf(t2), w2--;
              for (; 0 < u2 - w2; ) x2 = vf(x2), u2--;
              for (; w2--; ) {
                if (t2 === x2 || null !== x2 && t2 === x2.alternate) break b;
                t2 = vf(t2);
                x2 = vf(x2);
              }
              t2 = null;
            }
            else t2 = null;
            null !== k3 && wf(g3, h2, k3, t2, false);
            null !== n2 && null !== J2 && wf(g3, J2, n2, t2, true);
          }
        }
      }
      a: {
        h2 = d2 ? ue(d2) : window;
        k3 = h2.nodeName && h2.nodeName.toLowerCase();
        if ("select" === k3 || "input" === k3 && "file" === h2.type) var na = ve;
        else if (me(h2)) if (we) na = Fe;
        else {
          na = De;
          var xa = Ce;
        }
        else (k3 = h2.nodeName) && "input" === k3.toLowerCase() && ("checkbox" === h2.type || "radio" === h2.type) && (na = Ee);
        if (na && (na = na(a, d2))) {
          ne(g3, na, c, e2);
          break a;
        }
        xa && xa(a, h2, d2);
        "focusout" === a && (xa = h2._wrapperState) && xa.controlled && "number" === h2.type && cb(h2, "number", h2.value);
      }
      xa = d2 ? ue(d2) : window;
      switch (a) {
        case "focusin":
          if (me(xa) || "true" === xa.contentEditable) Qe = xa, Re = d2, Se = null;
          break;
        case "focusout":
          Se = Re = Qe = null;
          break;
        case "mousedown":
          Te = true;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          Te = false;
          Ue(g3, c, e2);
          break;
        case "selectionchange":
          if (Pe) break;
        case "keydown":
        case "keyup":
          Ue(g3, c, e2);
      }
      var $a;
      if (ae) b: {
        switch (a) {
          case "compositionstart":
            var ba = "onCompositionStart";
            break b;
          case "compositionend":
            ba = "onCompositionEnd";
            break b;
          case "compositionupdate":
            ba = "onCompositionUpdate";
            break b;
        }
        ba = void 0;
      }
      else ie ? ge(a, c) && (ba = "onCompositionEnd") : "keydown" === a && 229 === c.keyCode && (ba = "onCompositionStart");
      ba && (de && "ko" !== c.locale && (ie || "onCompositionStart" !== ba ? "onCompositionEnd" === ba && ie && ($a = nd()) : (kd = e2, ld = "value" in kd ? kd.value : kd.textContent, ie = true)), xa = oe(d2, ba), 0 < xa.length && (ba = new Ld(ba, a, null, c, e2), g3.push({ event: ba, listeners: xa }), $a ? ba.data = $a : ($a = he(c), null !== $a && (ba.data = $a))));
      if ($a = ce ? je(a, c) : ke(a, c)) d2 = oe(d2, "onBeforeInput"), 0 < d2.length && (e2 = new Ld("onBeforeInput", "beforeinput", null, c, e2), g3.push({ event: e2, listeners: d2 }), e2.data = $a);
    }
    se(g3, b);
  });
}
function tf(a, b, c) {
  return { instance: a, listener: b, currentTarget: c };
}
function oe(a, b) {
  for (var c = b + "Capture", d = []; null !== a; ) {
    var e = a, f2 = e.stateNode;
    5 === e.tag && null !== f2 && (e = f2, f2 = Kb(a, c), null != f2 && d.unshift(tf(a, f2, e)), f2 = Kb(a, b), null != f2 && d.push(tf(a, f2, e)));
    a = a.return;
  }
  return d;
}
function vf(a) {
  if (null === a) return null;
  do
    a = a.return;
  while (a && 5 !== a.tag);
  return a ? a : null;
}
function wf(a, b, c, d, e) {
  for (var f2 = b._reactName, g2 = []; null !== c && c !== d; ) {
    var h = c, k2 = h.alternate, l2 = h.stateNode;
    if (null !== k2 && k2 === d) break;
    5 === h.tag && null !== l2 && (h = l2, e ? (k2 = Kb(c, f2), null != k2 && g2.unshift(tf(c, k2, h))) : e || (k2 = Kb(c, f2), null != k2 && g2.push(tf(c, k2, h))));
    c = c.return;
  }
  0 !== g2.length && a.push({ event: b, listeners: g2 });
}
var xf = /\r\n?/g, yf = /\u0000|\uFFFD/g;
function zf(a) {
  return ("string" === typeof a ? a : "" + a).replace(xf, "\n").replace(yf, "");
}
function Af(a, b, c) {
  b = zf(b);
  if (zf(a) !== b && c) throw Error(p$1(425));
}
function Bf() {
}
var Cf = null, Df = null;
function Ef(a, b) {
  return "textarea" === a || "noscript" === a || "string" === typeof b.children || "number" === typeof b.children || "object" === typeof b.dangerouslySetInnerHTML && null !== b.dangerouslySetInnerHTML && null != b.dangerouslySetInnerHTML.__html;
}
var Ff = "function" === typeof setTimeout ? setTimeout : void 0, Gf = "function" === typeof clearTimeout ? clearTimeout : void 0, Hf = "function" === typeof Promise ? Promise : void 0, Jf = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof Hf ? function(a) {
  return Hf.resolve(null).then(a).catch(If);
} : Ff;
function If(a) {
  setTimeout(function() {
    throw a;
  });
}
function Kf(a, b) {
  var c = b, d = 0;
  do {
    var e = c.nextSibling;
    a.removeChild(c);
    if (e && 8 === e.nodeType) if (c = e.data, "/$" === c) {
      if (0 === d) {
        a.removeChild(e);
        bd(b);
        return;
      }
      d--;
    } else "$" !== c && "$?" !== c && "$!" !== c || d++;
    c = e;
  } while (c);
  bd(b);
}
function Lf(a) {
  for (; null != a; a = a.nextSibling) {
    var b = a.nodeType;
    if (1 === b || 3 === b) break;
    if (8 === b) {
      b = a.data;
      if ("$" === b || "$!" === b || "$?" === b) break;
      if ("/$" === b) return null;
    }
  }
  return a;
}
function Mf(a) {
  a = a.previousSibling;
  for (var b = 0; a; ) {
    if (8 === a.nodeType) {
      var c = a.data;
      if ("$" === c || "$!" === c || "$?" === c) {
        if (0 === b) return a;
        b--;
      } else "/$" === c && b++;
    }
    a = a.previousSibling;
  }
  return null;
}
var Nf = Math.random().toString(36).slice(2), Of = "__reactFiber$" + Nf, Pf = "__reactProps$" + Nf, uf = "__reactContainer$" + Nf, of = "__reactEvents$" + Nf, Qf = "__reactListeners$" + Nf, Rf = "__reactHandles$" + Nf;
function Wc(a) {
  var b = a[Of];
  if (b) return b;
  for (var c = a.parentNode; c; ) {
    if (b = c[uf] || c[Of]) {
      c = b.alternate;
      if (null !== b.child || null !== c && null !== c.child) for (a = Mf(a); null !== a; ) {
        if (c = a[Of]) return c;
        a = Mf(a);
      }
      return b;
    }
    a = c;
    c = a.parentNode;
  }
  return null;
}
function Cb(a) {
  a = a[Of] || a[uf];
  return !a || 5 !== a.tag && 6 !== a.tag && 13 !== a.tag && 3 !== a.tag ? null : a;
}
function ue(a) {
  if (5 === a.tag || 6 === a.tag) return a.stateNode;
  throw Error(p$1(33));
}
function Db(a) {
  return a[Pf] || null;
}
var Sf = [], Tf = -1;
function Uf(a) {
  return { current: a };
}
function E(a) {
  0 > Tf || (a.current = Sf[Tf], Sf[Tf] = null, Tf--);
}
function G(a, b) {
  Tf++;
  Sf[Tf] = a.current;
  a.current = b;
}
var Vf = {}, H = Uf(Vf), Wf = Uf(false), Xf = Vf;
function Yf(a, b) {
  var c = a.type.contextTypes;
  if (!c) return Vf;
  var d = a.stateNode;
  if (d && d.__reactInternalMemoizedUnmaskedChildContext === b) return d.__reactInternalMemoizedMaskedChildContext;
  var e = {}, f2;
  for (f2 in c) e[f2] = b[f2];
  d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = b, a.__reactInternalMemoizedMaskedChildContext = e);
  return e;
}
function Zf(a) {
  a = a.childContextTypes;
  return null !== a && void 0 !== a;
}
function $f() {
  E(Wf);
  E(H);
}
function ag(a, b, c) {
  if (H.current !== Vf) throw Error(p$1(168));
  G(H, b);
  G(Wf, c);
}
function bg(a, b, c) {
  var d = a.stateNode;
  b = b.childContextTypes;
  if ("function" !== typeof d.getChildContext) return c;
  d = d.getChildContext();
  for (var e in d) if (!(e in b)) throw Error(p$1(108, Ra(a) || "Unknown", e));
  return A({}, c, d);
}
function cg(a) {
  a = (a = a.stateNode) && a.__reactInternalMemoizedMergedChildContext || Vf;
  Xf = H.current;
  G(H, a);
  G(Wf, Wf.current);
  return true;
}
function dg(a, b, c) {
  var d = a.stateNode;
  if (!d) throw Error(p$1(169));
  c ? (a = bg(a, b, Xf), d.__reactInternalMemoizedMergedChildContext = a, E(Wf), E(H), G(H, a)) : E(Wf);
  G(Wf, c);
}
var eg = null, fg = false, gg = false;
function hg(a) {
  null === eg ? eg = [a] : eg.push(a);
}
function ig(a) {
  fg = true;
  hg(a);
}
function jg() {
  if (!gg && null !== eg) {
    gg = true;
    var a = 0, b = C;
    try {
      var c = eg;
      for (C = 1; a < c.length; a++) {
        var d = c[a];
        do
          d = d(true);
        while (null !== d);
      }
      eg = null;
      fg = false;
    } catch (e) {
      throw null !== eg && (eg = eg.slice(a + 1)), ac(fc, jg), e;
    } finally {
      C = b, gg = false;
    }
  }
  return null;
}
var kg = [], lg = 0, mg = null, ng = 0, og = [], pg = 0, qg = null, rg = 1, sg = "";
function tg(a, b) {
  kg[lg++] = ng;
  kg[lg++] = mg;
  mg = a;
  ng = b;
}
function ug(a, b, c) {
  og[pg++] = rg;
  og[pg++] = sg;
  og[pg++] = qg;
  qg = a;
  var d = rg;
  a = sg;
  var e = 32 - oc(d) - 1;
  d &= ~(1 << e);
  c += 1;
  var f2 = 32 - oc(b) + e;
  if (30 < f2) {
    var g2 = e - e % 5;
    f2 = (d & (1 << g2) - 1).toString(32);
    d >>= g2;
    e -= g2;
    rg = 1 << 32 - oc(b) + e | c << e | d;
    sg = f2 + a;
  } else rg = 1 << f2 | c << e | d, sg = a;
}
function vg(a) {
  null !== a.return && (tg(a, 1), ug(a, 1, 0));
}
function wg(a) {
  for (; a === mg; ) mg = kg[--lg], kg[lg] = null, ng = kg[--lg], kg[lg] = null;
  for (; a === qg; ) qg = og[--pg], og[pg] = null, sg = og[--pg], og[pg] = null, rg = og[--pg], og[pg] = null;
}
var xg = null, yg = null, I = false, zg = null;
function Ag(a, b) {
  var c = Bg(5, null, null, 0);
  c.elementType = "DELETED";
  c.stateNode = b;
  c.return = a;
  b = a.deletions;
  null === b ? (a.deletions = [c], a.flags |= 16) : b.push(c);
}
function Cg(a, b) {
  switch (a.tag) {
    case 5:
      var c = a.type;
      b = 1 !== b.nodeType || c.toLowerCase() !== b.nodeName.toLowerCase() ? null : b;
      return null !== b ? (a.stateNode = b, xg = a, yg = Lf(b.firstChild), true) : false;
    case 6:
      return b = "" === a.pendingProps || 3 !== b.nodeType ? null : b, null !== b ? (a.stateNode = b, xg = a, yg = null, true) : false;
    case 13:
      return b = 8 !== b.nodeType ? null : b, null !== b ? (c = null !== qg ? { id: rg, overflow: sg } : null, a.memoizedState = { dehydrated: b, treeContext: c, retryLane: 1073741824 }, c = Bg(18, null, null, 0), c.stateNode = b, c.return = a, a.child = c, xg = a, yg = null, true) : false;
    default:
      return false;
  }
}
function Dg(a) {
  return 0 !== (a.mode & 1) && 0 === (a.flags & 128);
}
function Eg(a) {
  if (I) {
    var b = yg;
    if (b) {
      var c = b;
      if (!Cg(a, b)) {
        if (Dg(a)) throw Error(p$1(418));
        b = Lf(c.nextSibling);
        var d = xg;
        b && Cg(a, b) ? Ag(d, c) : (a.flags = a.flags & -4097 | 2, I = false, xg = a);
      }
    } else {
      if (Dg(a)) throw Error(p$1(418));
      a.flags = a.flags & -4097 | 2;
      I = false;
      xg = a;
    }
  }
}
function Fg(a) {
  for (a = a.return; null !== a && 5 !== a.tag && 3 !== a.tag && 13 !== a.tag; ) a = a.return;
  xg = a;
}
function Gg(a) {
  if (a !== xg) return false;
  if (!I) return Fg(a), I = true, false;
  var b;
  (b = 3 !== a.tag) && !(b = 5 !== a.tag) && (b = a.type, b = "head" !== b && "body" !== b && !Ef(a.type, a.memoizedProps));
  if (b && (b = yg)) {
    if (Dg(a)) throw Hg(), Error(p$1(418));
    for (; b; ) Ag(a, b), b = Lf(b.nextSibling);
  }
  Fg(a);
  if (13 === a.tag) {
    a = a.memoizedState;
    a = null !== a ? a.dehydrated : null;
    if (!a) throw Error(p$1(317));
    a: {
      a = a.nextSibling;
      for (b = 0; a; ) {
        if (8 === a.nodeType) {
          var c = a.data;
          if ("/$" === c) {
            if (0 === b) {
              yg = Lf(a.nextSibling);
              break a;
            }
            b--;
          } else "$" !== c && "$!" !== c && "$?" !== c || b++;
        }
        a = a.nextSibling;
      }
      yg = null;
    }
  } else yg = xg ? Lf(a.stateNode.nextSibling) : null;
  return true;
}
function Hg() {
  for (var a = yg; a; ) a = Lf(a.nextSibling);
}
function Ig() {
  yg = xg = null;
  I = false;
}
function Jg(a) {
  null === zg ? zg = [a] : zg.push(a);
}
var Kg = ua.ReactCurrentBatchConfig;
function Lg(a, b) {
  if (a && a.defaultProps) {
    b = A({}, b);
    a = a.defaultProps;
    for (var c in a) void 0 === b[c] && (b[c] = a[c]);
    return b;
  }
  return b;
}
var Mg = Uf(null), Ng = null, Og = null, Pg = null;
function Qg() {
  Pg = Og = Ng = null;
}
function Rg(a) {
  var b = Mg.current;
  E(Mg);
  a._currentValue = b;
}
function Sg(a, b, c) {
  for (; null !== a; ) {
    var d = a.alternate;
    (a.childLanes & b) !== b ? (a.childLanes |= b, null !== d && (d.childLanes |= b)) : null !== d && (d.childLanes & b) !== b && (d.childLanes |= b);
    if (a === c) break;
    a = a.return;
  }
}
function Tg(a, b) {
  Ng = a;
  Pg = Og = null;
  a = a.dependencies;
  null !== a && null !== a.firstContext && (0 !== (a.lanes & b) && (Ug = true), a.firstContext = null);
}
function Vg(a) {
  var b = a._currentValue;
  if (Pg !== a) if (a = { context: a, memoizedValue: b, next: null }, null === Og) {
    if (null === Ng) throw Error(p$1(308));
    Og = a;
    Ng.dependencies = { lanes: 0, firstContext: a };
  } else Og = Og.next = a;
  return b;
}
var Wg = null;
function Xg(a) {
  null === Wg ? Wg = [a] : Wg.push(a);
}
function Yg(a, b, c, d) {
  var e = b.interleaved;
  null === e ? (c.next = c, Xg(b)) : (c.next = e.next, e.next = c);
  b.interleaved = c;
  return Zg(a, d);
}
function Zg(a, b) {
  a.lanes |= b;
  var c = a.alternate;
  null !== c && (c.lanes |= b);
  c = a;
  for (a = a.return; null !== a; ) a.childLanes |= b, c = a.alternate, null !== c && (c.childLanes |= b), c = a, a = a.return;
  return 3 === c.tag ? c.stateNode : null;
}
var $g = false;
function ah(a) {
  a.updateQueue = { baseState: a.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
}
function bh(a, b) {
  a = a.updateQueue;
  b.updateQueue === a && (b.updateQueue = { baseState: a.baseState, firstBaseUpdate: a.firstBaseUpdate, lastBaseUpdate: a.lastBaseUpdate, shared: a.shared, effects: a.effects });
}
function ch(a, b) {
  return { eventTime: a, lane: b, tag: 0, payload: null, callback: null, next: null };
}
function dh(a, b, c) {
  var d = a.updateQueue;
  if (null === d) return null;
  d = d.shared;
  if (0 !== (K & 2)) {
    var e = d.pending;
    null === e ? b.next = b : (b.next = e.next, e.next = b);
    d.pending = b;
    return Zg(a, c);
  }
  e = d.interleaved;
  null === e ? (b.next = b, Xg(d)) : (b.next = e.next, e.next = b);
  d.interleaved = b;
  return Zg(a, c);
}
function eh(a, b, c) {
  b = b.updateQueue;
  if (null !== b && (b = b.shared, 0 !== (c & 4194240))) {
    var d = b.lanes;
    d &= a.pendingLanes;
    c |= d;
    b.lanes = c;
    Cc(a, c);
  }
}
function fh(a, b) {
  var c = a.updateQueue, d = a.alternate;
  if (null !== d && (d = d.updateQueue, c === d)) {
    var e = null, f2 = null;
    c = c.firstBaseUpdate;
    if (null !== c) {
      do {
        var g2 = { eventTime: c.eventTime, lane: c.lane, tag: c.tag, payload: c.payload, callback: c.callback, next: null };
        null === f2 ? e = f2 = g2 : f2 = f2.next = g2;
        c = c.next;
      } while (null !== c);
      null === f2 ? e = f2 = b : f2 = f2.next = b;
    } else e = f2 = b;
    c = { baseState: d.baseState, firstBaseUpdate: e, lastBaseUpdate: f2, shared: d.shared, effects: d.effects };
    a.updateQueue = c;
    return;
  }
  a = c.lastBaseUpdate;
  null === a ? c.firstBaseUpdate = b : a.next = b;
  c.lastBaseUpdate = b;
}
function gh(a, b, c, d) {
  var e = a.updateQueue;
  $g = false;
  var f2 = e.firstBaseUpdate, g2 = e.lastBaseUpdate, h = e.shared.pending;
  if (null !== h) {
    e.shared.pending = null;
    var k2 = h, l2 = k2.next;
    k2.next = null;
    null === g2 ? f2 = l2 : g2.next = l2;
    g2 = k2;
    var m2 = a.alternate;
    null !== m2 && (m2 = m2.updateQueue, h = m2.lastBaseUpdate, h !== g2 && (null === h ? m2.firstBaseUpdate = l2 : h.next = l2, m2.lastBaseUpdate = k2));
  }
  if (null !== f2) {
    var q2 = e.baseState;
    g2 = 0;
    m2 = l2 = k2 = null;
    h = f2;
    do {
      var r2 = h.lane, y2 = h.eventTime;
      if ((d & r2) === r2) {
        null !== m2 && (m2 = m2.next = {
          eventTime: y2,
          lane: 0,
          tag: h.tag,
          payload: h.payload,
          callback: h.callback,
          next: null
        });
        a: {
          var n2 = a, t2 = h;
          r2 = b;
          y2 = c;
          switch (t2.tag) {
            case 1:
              n2 = t2.payload;
              if ("function" === typeof n2) {
                q2 = n2.call(y2, q2, r2);
                break a;
              }
              q2 = n2;
              break a;
            case 3:
              n2.flags = n2.flags & -65537 | 128;
            case 0:
              n2 = t2.payload;
              r2 = "function" === typeof n2 ? n2.call(y2, q2, r2) : n2;
              if (null === r2 || void 0 === r2) break a;
              q2 = A({}, q2, r2);
              break a;
            case 2:
              $g = true;
          }
        }
        null !== h.callback && 0 !== h.lane && (a.flags |= 64, r2 = e.effects, null === r2 ? e.effects = [h] : r2.push(h));
      } else y2 = { eventTime: y2, lane: r2, tag: h.tag, payload: h.payload, callback: h.callback, next: null }, null === m2 ? (l2 = m2 = y2, k2 = q2) : m2 = m2.next = y2, g2 |= r2;
      h = h.next;
      if (null === h) if (h = e.shared.pending, null === h) break;
      else r2 = h, h = r2.next, r2.next = null, e.lastBaseUpdate = r2, e.shared.pending = null;
    } while (1);
    null === m2 && (k2 = q2);
    e.baseState = k2;
    e.firstBaseUpdate = l2;
    e.lastBaseUpdate = m2;
    b = e.shared.interleaved;
    if (null !== b) {
      e = b;
      do
        g2 |= e.lane, e = e.next;
      while (e !== b);
    } else null === f2 && (e.shared.lanes = 0);
    hh |= g2;
    a.lanes = g2;
    a.memoizedState = q2;
  }
}
function ih(a, b, c) {
  a = b.effects;
  b.effects = null;
  if (null !== a) for (b = 0; b < a.length; b++) {
    var d = a[b], e = d.callback;
    if (null !== e) {
      d.callback = null;
      d = c;
      if ("function" !== typeof e) throw Error(p$1(191, e));
      e.call(d);
    }
  }
}
var jh = new aa.Component().refs;
function kh(a, b, c, d) {
  b = a.memoizedState;
  c = c(d, b);
  c = null === c || void 0 === c ? b : A({}, b, c);
  a.memoizedState = c;
  0 === a.lanes && (a.updateQueue.baseState = c);
}
var nh = { isMounted: function(a) {
  return (a = a._reactInternals) ? Vb(a) === a : false;
}, enqueueSetState: function(a, b, c) {
  a = a._reactInternals;
  var d = L(), e = lh(a), f2 = ch(d, e);
  f2.payload = b;
  void 0 !== c && null !== c && (f2.callback = c);
  b = dh(a, f2, e);
  null !== b && (mh(b, a, e, d), eh(b, a, e));
}, enqueueReplaceState: function(a, b, c) {
  a = a._reactInternals;
  var d = L(), e = lh(a), f2 = ch(d, e);
  f2.tag = 1;
  f2.payload = b;
  void 0 !== c && null !== c && (f2.callback = c);
  b = dh(a, f2, e);
  null !== b && (mh(b, a, e, d), eh(b, a, e));
}, enqueueForceUpdate: function(a, b) {
  a = a._reactInternals;
  var c = L(), d = lh(a), e = ch(c, d);
  e.tag = 2;
  void 0 !== b && null !== b && (e.callback = b);
  b = dh(a, e, d);
  null !== b && (mh(b, a, d, c), eh(b, a, d));
} };
function oh(a, b, c, d, e, f2, g2) {
  a = a.stateNode;
  return "function" === typeof a.shouldComponentUpdate ? a.shouldComponentUpdate(d, f2, g2) : b.prototype && b.prototype.isPureReactComponent ? !Ie(c, d) || !Ie(e, f2) : true;
}
function ph(a, b, c) {
  var d = false, e = Vf;
  var f2 = b.contextType;
  "object" === typeof f2 && null !== f2 ? f2 = Vg(f2) : (e = Zf(b) ? Xf : H.current, d = b.contextTypes, f2 = (d = null !== d && void 0 !== d) ? Yf(a, e) : Vf);
  b = new b(c, f2);
  a.memoizedState = null !== b.state && void 0 !== b.state ? b.state : null;
  b.updater = nh;
  a.stateNode = b;
  b._reactInternals = a;
  d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = e, a.__reactInternalMemoizedMaskedChildContext = f2);
  return b;
}
function qh(a, b, c, d) {
  a = b.state;
  "function" === typeof b.componentWillReceiveProps && b.componentWillReceiveProps(c, d);
  "function" === typeof b.UNSAFE_componentWillReceiveProps && b.UNSAFE_componentWillReceiveProps(c, d);
  b.state !== a && nh.enqueueReplaceState(b, b.state, null);
}
function rh(a, b, c, d) {
  var e = a.stateNode;
  e.props = c;
  e.state = a.memoizedState;
  e.refs = jh;
  ah(a);
  var f2 = b.contextType;
  "object" === typeof f2 && null !== f2 ? e.context = Vg(f2) : (f2 = Zf(b) ? Xf : H.current, e.context = Yf(a, f2));
  e.state = a.memoizedState;
  f2 = b.getDerivedStateFromProps;
  "function" === typeof f2 && (kh(a, b, f2, c), e.state = a.memoizedState);
  "function" === typeof b.getDerivedStateFromProps || "function" === typeof e.getSnapshotBeforeUpdate || "function" !== typeof e.UNSAFE_componentWillMount && "function" !== typeof e.componentWillMount || (b = e.state, "function" === typeof e.componentWillMount && e.componentWillMount(), "function" === typeof e.UNSAFE_componentWillMount && e.UNSAFE_componentWillMount(), b !== e.state && nh.enqueueReplaceState(e, e.state, null), gh(a, c, e, d), e.state = a.memoizedState);
  "function" === typeof e.componentDidMount && (a.flags |= 4194308);
}
function sh(a, b, c) {
  a = c.ref;
  if (null !== a && "function" !== typeof a && "object" !== typeof a) {
    if (c._owner) {
      c = c._owner;
      if (c) {
        if (1 !== c.tag) throw Error(p$1(309));
        var d = c.stateNode;
      }
      if (!d) throw Error(p$1(147, a));
      var e = d, f2 = "" + a;
      if (null !== b && null !== b.ref && "function" === typeof b.ref && b.ref._stringRef === f2) return b.ref;
      b = function(a2) {
        var b2 = e.refs;
        b2 === jh && (b2 = e.refs = {});
        null === a2 ? delete b2[f2] : b2[f2] = a2;
      };
      b._stringRef = f2;
      return b;
    }
    if ("string" !== typeof a) throw Error(p$1(284));
    if (!c._owner) throw Error(p$1(290, a));
  }
  return a;
}
function th(a, b) {
  a = Object.prototype.toString.call(b);
  throw Error(p$1(31, "[object Object]" === a ? "object with keys {" + Object.keys(b).join(", ") + "}" : a));
}
function uh(a) {
  var b = a._init;
  return b(a._payload);
}
function vh(a) {
  function b(b2, c2) {
    if (a) {
      var d2 = b2.deletions;
      null === d2 ? (b2.deletions = [c2], b2.flags |= 16) : d2.push(c2);
    }
  }
  function c(c2, d2) {
    if (!a) return null;
    for (; null !== d2; ) b(c2, d2), d2 = d2.sibling;
    return null;
  }
  function d(a2, b2) {
    for (a2 = /* @__PURE__ */ new Map(); null !== b2; ) null !== b2.key ? a2.set(b2.key, b2) : a2.set(b2.index, b2), b2 = b2.sibling;
    return a2;
  }
  function e(a2, b2) {
    a2 = wh(a2, b2);
    a2.index = 0;
    a2.sibling = null;
    return a2;
  }
  function f2(b2, c2, d2) {
    b2.index = d2;
    if (!a) return b2.flags |= 1048576, c2;
    d2 = b2.alternate;
    if (null !== d2) return d2 = d2.index, d2 < c2 ? (b2.flags |= 2, c2) : d2;
    b2.flags |= 2;
    return c2;
  }
  function g2(b2) {
    a && null === b2.alternate && (b2.flags |= 2);
    return b2;
  }
  function h(a2, b2, c2, d2) {
    if (null === b2 || 6 !== b2.tag) return b2 = xh(c2, a2.mode, d2), b2.return = a2, b2;
    b2 = e(b2, c2);
    b2.return = a2;
    return b2;
  }
  function k2(a2, b2, c2, d2) {
    var f3 = c2.type;
    if (f3 === ya) return m2(a2, b2, c2.props.children, d2, c2.key);
    if (null !== b2 && (b2.elementType === f3 || "object" === typeof f3 && null !== f3 && f3.$$typeof === Ha && uh(f3) === b2.type)) return d2 = e(b2, c2.props), d2.ref = sh(a2, b2, c2), d2.return = a2, d2;
    d2 = yh(c2.type, c2.key, c2.props, null, a2.mode, d2);
    d2.ref = sh(a2, b2, c2);
    d2.return = a2;
    return d2;
  }
  function l2(a2, b2, c2, d2) {
    if (null === b2 || 4 !== b2.tag || b2.stateNode.containerInfo !== c2.containerInfo || b2.stateNode.implementation !== c2.implementation) return b2 = zh(c2, a2.mode, d2), b2.return = a2, b2;
    b2 = e(b2, c2.children || []);
    b2.return = a2;
    return b2;
  }
  function m2(a2, b2, c2, d2, f3) {
    if (null === b2 || 7 !== b2.tag) return b2 = Ah(c2, a2.mode, d2, f3), b2.return = a2, b2;
    b2 = e(b2, c2);
    b2.return = a2;
    return b2;
  }
  function q2(a2, b2, c2) {
    if ("string" === typeof b2 && "" !== b2 || "number" === typeof b2) return b2 = xh("" + b2, a2.mode, c2), b2.return = a2, b2;
    if ("object" === typeof b2 && null !== b2) {
      switch (b2.$$typeof) {
        case va:
          return c2 = yh(b2.type, b2.key, b2.props, null, a2.mode, c2), c2.ref = sh(a2, null, b2), c2.return = a2, c2;
        case wa:
          return b2 = zh(b2, a2.mode, c2), b2.return = a2, b2;
        case Ha:
          var d2 = b2._init;
          return q2(a2, d2(b2._payload), c2);
      }
      if (eb(b2) || Ka(b2)) return b2 = Ah(b2, a2.mode, c2, null), b2.return = a2, b2;
      th(a2, b2);
    }
    return null;
  }
  function r2(a2, b2, c2, d2) {
    var e2 = null !== b2 ? b2.key : null;
    if ("string" === typeof c2 && "" !== c2 || "number" === typeof c2) return null !== e2 ? null : h(a2, b2, "" + c2, d2);
    if ("object" === typeof c2 && null !== c2) {
      switch (c2.$$typeof) {
        case va:
          return c2.key === e2 ? k2(a2, b2, c2, d2) : null;
        case wa:
          return c2.key === e2 ? l2(a2, b2, c2, d2) : null;
        case Ha:
          return e2 = c2._init, r2(
            a2,
            b2,
            e2(c2._payload),
            d2
          );
      }
      if (eb(c2) || Ka(c2)) return null !== e2 ? null : m2(a2, b2, c2, d2, null);
      th(a2, c2);
    }
    return null;
  }
  function y2(a2, b2, c2, d2, e2) {
    if ("string" === typeof d2 && "" !== d2 || "number" === typeof d2) return a2 = a2.get(c2) || null, h(b2, a2, "" + d2, e2);
    if ("object" === typeof d2 && null !== d2) {
      switch (d2.$$typeof) {
        case va:
          return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, k2(b2, a2, d2, e2);
        case wa:
          return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, l2(b2, a2, d2, e2);
        case Ha:
          var f3 = d2._init;
          return y2(a2, b2, c2, f3(d2._payload), e2);
      }
      if (eb(d2) || Ka(d2)) return a2 = a2.get(c2) || null, m2(b2, a2, d2, e2, null);
      th(b2, d2);
    }
    return null;
  }
  function n2(e2, g3, h2, k3) {
    for (var l3 = null, m3 = null, u2 = g3, w2 = g3 = 0, x2 = null; null !== u2 && w2 < h2.length; w2++) {
      u2.index > w2 ? (x2 = u2, u2 = null) : x2 = u2.sibling;
      var n3 = r2(e2, u2, h2[w2], k3);
      if (null === n3) {
        null === u2 && (u2 = x2);
        break;
      }
      a && u2 && null === n3.alternate && b(e2, u2);
      g3 = f2(n3, g3, w2);
      null === m3 ? l3 = n3 : m3.sibling = n3;
      m3 = n3;
      u2 = x2;
    }
    if (w2 === h2.length) return c(e2, u2), I && tg(e2, w2), l3;
    if (null === u2) {
      for (; w2 < h2.length; w2++) u2 = q2(e2, h2[w2], k3), null !== u2 && (g3 = f2(u2, g3, w2), null === m3 ? l3 = u2 : m3.sibling = u2, m3 = u2);
      I && tg(e2, w2);
      return l3;
    }
    for (u2 = d(e2, u2); w2 < h2.length; w2++) x2 = y2(u2, e2, w2, h2[w2], k3), null !== x2 && (a && null !== x2.alternate && u2.delete(null === x2.key ? w2 : x2.key), g3 = f2(x2, g3, w2), null === m3 ? l3 = x2 : m3.sibling = x2, m3 = x2);
    a && u2.forEach(function(a2) {
      return b(e2, a2);
    });
    I && tg(e2, w2);
    return l3;
  }
  function t2(e2, g3, h2, k3) {
    var l3 = Ka(h2);
    if ("function" !== typeof l3) throw Error(p$1(150));
    h2 = l3.call(h2);
    if (null == h2) throw Error(p$1(151));
    for (var u2 = l3 = null, m3 = g3, w2 = g3 = 0, x2 = null, n3 = h2.next(); null !== m3 && !n3.done; w2++, n3 = h2.next()) {
      m3.index > w2 ? (x2 = m3, m3 = null) : x2 = m3.sibling;
      var t3 = r2(e2, m3, n3.value, k3);
      if (null === t3) {
        null === m3 && (m3 = x2);
        break;
      }
      a && m3 && null === t3.alternate && b(e2, m3);
      g3 = f2(t3, g3, w2);
      null === u2 ? l3 = t3 : u2.sibling = t3;
      u2 = t3;
      m3 = x2;
    }
    if (n3.done) return c(
      e2,
      m3
    ), I && tg(e2, w2), l3;
    if (null === m3) {
      for (; !n3.done; w2++, n3 = h2.next()) n3 = q2(e2, n3.value, k3), null !== n3 && (g3 = f2(n3, g3, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
      I && tg(e2, w2);
      return l3;
    }
    for (m3 = d(e2, m3); !n3.done; w2++, n3 = h2.next()) n3 = y2(m3, e2, w2, n3.value, k3), null !== n3 && (a && null !== n3.alternate && m3.delete(null === n3.key ? w2 : n3.key), g3 = f2(n3, g3, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
    a && m3.forEach(function(a2) {
      return b(e2, a2);
    });
    I && tg(e2, w2);
    return l3;
  }
  function J2(a2, d2, f3, h2) {
    "object" === typeof f3 && null !== f3 && f3.type === ya && null === f3.key && (f3 = f3.props.children);
    if ("object" === typeof f3 && null !== f3) {
      switch (f3.$$typeof) {
        case va:
          a: {
            for (var k3 = f3.key, l3 = d2; null !== l3; ) {
              if (l3.key === k3) {
                k3 = f3.type;
                if (k3 === ya) {
                  if (7 === l3.tag) {
                    c(a2, l3.sibling);
                    d2 = e(l3, f3.props.children);
                    d2.return = a2;
                    a2 = d2;
                    break a;
                  }
                } else if (l3.elementType === k3 || "object" === typeof k3 && null !== k3 && k3.$$typeof === Ha && uh(k3) === l3.type) {
                  c(a2, l3.sibling);
                  d2 = e(l3, f3.props);
                  d2.ref = sh(a2, l3, f3);
                  d2.return = a2;
                  a2 = d2;
                  break a;
                }
                c(a2, l3);
                break;
              } else b(a2, l3);
              l3 = l3.sibling;
            }
            f3.type === ya ? (d2 = Ah(f3.props.children, a2.mode, h2, f3.key), d2.return = a2, a2 = d2) : (h2 = yh(f3.type, f3.key, f3.props, null, a2.mode, h2), h2.ref = sh(a2, d2, f3), h2.return = a2, a2 = h2);
          }
          return g2(a2);
        case wa:
          a: {
            for (l3 = f3.key; null !== d2; ) {
              if (d2.key === l3) if (4 === d2.tag && d2.stateNode.containerInfo === f3.containerInfo && d2.stateNode.implementation === f3.implementation) {
                c(a2, d2.sibling);
                d2 = e(d2, f3.children || []);
                d2.return = a2;
                a2 = d2;
                break a;
              } else {
                c(a2, d2);
                break;
              }
              else b(a2, d2);
              d2 = d2.sibling;
            }
            d2 = zh(f3, a2.mode, h2);
            d2.return = a2;
            a2 = d2;
          }
          return g2(a2);
        case Ha:
          return l3 = f3._init, J2(a2, d2, l3(f3._payload), h2);
      }
      if (eb(f3)) return n2(a2, d2, f3, h2);
      if (Ka(f3)) return t2(a2, d2, f3, h2);
      th(a2, f3);
    }
    return "string" === typeof f3 && "" !== f3 || "number" === typeof f3 ? (f3 = "" + f3, null !== d2 && 6 === d2.tag ? (c(a2, d2.sibling), d2 = e(d2, f3), d2.return = a2, a2 = d2) : (c(a2, d2), d2 = xh(f3, a2.mode, h2), d2.return = a2, a2 = d2), g2(a2)) : c(a2, d2);
  }
  return J2;
}
var Bh = vh(true), Ch = vh(false), Dh = {}, Eh = Uf(Dh), Fh = Uf(Dh), Gh = Uf(Dh);
function Hh(a) {
  if (a === Dh) throw Error(p$1(174));
  return a;
}
function Ih(a, b) {
  G(Gh, b);
  G(Fh, a);
  G(Eh, Dh);
  a = b.nodeType;
  switch (a) {
    case 9:
    case 11:
      b = (b = b.documentElement) ? b.namespaceURI : lb(null, "");
      break;
    default:
      a = 8 === a ? b.parentNode : b, b = a.namespaceURI || null, a = a.tagName, b = lb(b, a);
  }
  E(Eh);
  G(Eh, b);
}
function Jh() {
  E(Eh);
  E(Fh);
  E(Gh);
}
function Kh(a) {
  Hh(Gh.current);
  var b = Hh(Eh.current);
  var c = lb(b, a.type);
  b !== c && (G(Fh, a), G(Eh, c));
}
function Lh(a) {
  Fh.current === a && (E(Eh), E(Fh));
}
var M = Uf(0);
function Mh(a) {
  for (var b = a; null !== b; ) {
    if (13 === b.tag) {
      var c = b.memoizedState;
      if (null !== c && (c = c.dehydrated, null === c || "$?" === c.data || "$!" === c.data)) return b;
    } else if (19 === b.tag && void 0 !== b.memoizedProps.revealOrder) {
      if (0 !== (b.flags & 128)) return b;
    } else if (null !== b.child) {
      b.child.return = b;
      b = b.child;
      continue;
    }
    if (b === a) break;
    for (; null === b.sibling; ) {
      if (null === b.return || b.return === a) return null;
      b = b.return;
    }
    b.sibling.return = b.return;
    b = b.sibling;
  }
  return null;
}
var Nh = [];
function Oh() {
  for (var a = 0; a < Nh.length; a++) Nh[a]._workInProgressVersionPrimary = null;
  Nh.length = 0;
}
var Ph = ua.ReactCurrentDispatcher, Qh = ua.ReactCurrentBatchConfig, Rh = 0, N = null, O = null, P$1 = null, Sh = false, Th = false, Uh = 0, Vh = 0;
function Q() {
  throw Error(p$1(321));
}
function Wh(a, b) {
  if (null === b) return false;
  for (var c = 0; c < b.length && c < a.length; c++) if (!He(a[c], b[c])) return false;
  return true;
}
function Xh(a, b, c, d, e, f2) {
  Rh = f2;
  N = b;
  b.memoizedState = null;
  b.updateQueue = null;
  b.lanes = 0;
  Ph.current = null === a || null === a.memoizedState ? Yh : Zh;
  a = c(d, e);
  if (Th) {
    f2 = 0;
    do {
      Th = false;
      Uh = 0;
      if (25 <= f2) throw Error(p$1(301));
      f2 += 1;
      P$1 = O = null;
      b.updateQueue = null;
      Ph.current = $h;
      a = c(d, e);
    } while (Th);
  }
  Ph.current = ai;
  b = null !== O && null !== O.next;
  Rh = 0;
  P$1 = O = N = null;
  Sh = false;
  if (b) throw Error(p$1(300));
  return a;
}
function bi() {
  var a = 0 !== Uh;
  Uh = 0;
  return a;
}
function ci() {
  var a = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
  null === P$1 ? N.memoizedState = P$1 = a : P$1 = P$1.next = a;
  return P$1;
}
function di() {
  if (null === O) {
    var a = N.alternate;
    a = null !== a ? a.memoizedState : null;
  } else a = O.next;
  var b = null === P$1 ? N.memoizedState : P$1.next;
  if (null !== b) P$1 = b, O = a;
  else {
    if (null === a) throw Error(p$1(310));
    O = a;
    a = { memoizedState: O.memoizedState, baseState: O.baseState, baseQueue: O.baseQueue, queue: O.queue, next: null };
    null === P$1 ? N.memoizedState = P$1 = a : P$1 = P$1.next = a;
  }
  return P$1;
}
function ei(a, b) {
  return "function" === typeof b ? b(a) : b;
}
function fi(a) {
  var b = di(), c = b.queue;
  if (null === c) throw Error(p$1(311));
  c.lastRenderedReducer = a;
  var d = O, e = d.baseQueue, f2 = c.pending;
  if (null !== f2) {
    if (null !== e) {
      var g2 = e.next;
      e.next = f2.next;
      f2.next = g2;
    }
    d.baseQueue = e = f2;
    c.pending = null;
  }
  if (null !== e) {
    f2 = e.next;
    d = d.baseState;
    var h = g2 = null, k2 = null, l2 = f2;
    do {
      var m2 = l2.lane;
      if ((Rh & m2) === m2) null !== k2 && (k2 = k2.next = { lane: 0, action: l2.action, hasEagerState: l2.hasEagerState, eagerState: l2.eagerState, next: null }), d = l2.hasEagerState ? l2.eagerState : a(d, l2.action);
      else {
        var q2 = {
          lane: m2,
          action: l2.action,
          hasEagerState: l2.hasEagerState,
          eagerState: l2.eagerState,
          next: null
        };
        null === k2 ? (h = k2 = q2, g2 = d) : k2 = k2.next = q2;
        N.lanes |= m2;
        hh |= m2;
      }
      l2 = l2.next;
    } while (null !== l2 && l2 !== f2);
    null === k2 ? g2 = d : k2.next = h;
    He(d, b.memoizedState) || (Ug = true);
    b.memoizedState = d;
    b.baseState = g2;
    b.baseQueue = k2;
    c.lastRenderedState = d;
  }
  a = c.interleaved;
  if (null !== a) {
    e = a;
    do
      f2 = e.lane, N.lanes |= f2, hh |= f2, e = e.next;
    while (e !== a);
  } else null === e && (c.lanes = 0);
  return [b.memoizedState, c.dispatch];
}
function gi(a) {
  var b = di(), c = b.queue;
  if (null === c) throw Error(p$1(311));
  c.lastRenderedReducer = a;
  var d = c.dispatch, e = c.pending, f2 = b.memoizedState;
  if (null !== e) {
    c.pending = null;
    var g2 = e = e.next;
    do
      f2 = a(f2, g2.action), g2 = g2.next;
    while (g2 !== e);
    He(f2, b.memoizedState) || (Ug = true);
    b.memoizedState = f2;
    null === b.baseQueue && (b.baseState = f2);
    c.lastRenderedState = f2;
  }
  return [f2, d];
}
function hi() {
}
function ii(a, b) {
  var c = N, d = di(), e = b(), f2 = !He(d.memoizedState, e);
  f2 && (d.memoizedState = e, Ug = true);
  d = d.queue;
  ji(ki.bind(null, c, d, a), [a]);
  if (d.getSnapshot !== b || f2 || null !== P$1 && P$1.memoizedState.tag & 1) {
    c.flags |= 2048;
    li(9, mi.bind(null, c, d, e, b), void 0, null);
    if (null === R) throw Error(p$1(349));
    0 !== (Rh & 30) || ni(c, b, e);
  }
  return e;
}
function ni(a, b, c) {
  a.flags |= 16384;
  a = { getSnapshot: b, value: c };
  b = N.updateQueue;
  null === b ? (b = { lastEffect: null, stores: null }, N.updateQueue = b, b.stores = [a]) : (c = b.stores, null === c ? b.stores = [a] : c.push(a));
}
function mi(a, b, c, d) {
  b.value = c;
  b.getSnapshot = d;
  oi(b) && pi(a);
}
function ki(a, b, c) {
  return c(function() {
    oi(b) && pi(a);
  });
}
function oi(a) {
  var b = a.getSnapshot;
  a = a.value;
  try {
    var c = b();
    return !He(a, c);
  } catch (d) {
    return true;
  }
}
function pi(a) {
  var b = Zg(a, 1);
  null !== b && mh(b, a, 1, -1);
}
function qi(a) {
  var b = ci();
  "function" === typeof a && (a = a());
  b.memoizedState = b.baseState = a;
  a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: ei, lastRenderedState: a };
  b.queue = a;
  a = a.dispatch = ri.bind(null, N, a);
  return [b.memoizedState, a];
}
function li(a, b, c, d) {
  a = { tag: a, create: b, destroy: c, deps: d, next: null };
  b = N.updateQueue;
  null === b ? (b = { lastEffect: null, stores: null }, N.updateQueue = b, b.lastEffect = a.next = a) : (c = b.lastEffect, null === c ? b.lastEffect = a.next = a : (d = c.next, c.next = a, a.next = d, b.lastEffect = a));
  return a;
}
function si() {
  return di().memoizedState;
}
function ti(a, b, c, d) {
  var e = ci();
  N.flags |= a;
  e.memoizedState = li(1 | b, c, void 0, void 0 === d ? null : d);
}
function ui(a, b, c, d) {
  var e = di();
  d = void 0 === d ? null : d;
  var f2 = void 0;
  if (null !== O) {
    var g2 = O.memoizedState;
    f2 = g2.destroy;
    if (null !== d && Wh(d, g2.deps)) {
      e.memoizedState = li(b, c, f2, d);
      return;
    }
  }
  N.flags |= a;
  e.memoizedState = li(1 | b, c, f2, d);
}
function vi(a, b) {
  return ti(8390656, 8, a, b);
}
function ji(a, b) {
  return ui(2048, 8, a, b);
}
function wi(a, b) {
  return ui(4, 2, a, b);
}
function xi(a, b) {
  return ui(4, 4, a, b);
}
function yi(a, b) {
  if ("function" === typeof b) return a = a(), b(a), function() {
    b(null);
  };
  if (null !== b && void 0 !== b) return a = a(), b.current = a, function() {
    b.current = null;
  };
}
function zi(a, b, c) {
  c = null !== c && void 0 !== c ? c.concat([a]) : null;
  return ui(4, 4, yi.bind(null, b, a), c);
}
function Ai() {
}
function Bi(a, b) {
  var c = di();
  b = void 0 === b ? null : b;
  var d = c.memoizedState;
  if (null !== d && null !== b && Wh(b, d[1])) return d[0];
  c.memoizedState = [a, b];
  return a;
}
function Ci(a, b) {
  var c = di();
  b = void 0 === b ? null : b;
  var d = c.memoizedState;
  if (null !== d && null !== b && Wh(b, d[1])) return d[0];
  a = a();
  c.memoizedState = [a, b];
  return a;
}
function Di(a, b, c) {
  if (0 === (Rh & 21)) return a.baseState && (a.baseState = false, Ug = true), a.memoizedState = c;
  He(c, b) || (c = yc(), N.lanes |= c, hh |= c, a.baseState = true);
  return b;
}
function Ei(a, b) {
  var c = C;
  C = 0 !== c && 4 > c ? c : 4;
  a(true);
  var d = Qh.transition;
  Qh.transition = {};
  try {
    a(false), b();
  } finally {
    C = c, Qh.transition = d;
  }
}
function Fi() {
  return di().memoizedState;
}
function Gi(a, b, c) {
  var d = lh(a);
  c = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
  if (Hi(a)) Ii(b, c);
  else if (c = Yg(a, b, c, d), null !== c) {
    var e = L();
    mh(c, a, d, e);
    Ji(c, b, d);
  }
}
function ri(a, b, c) {
  var d = lh(a), e = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
  if (Hi(a)) Ii(b, e);
  else {
    var f2 = a.alternate;
    if (0 === a.lanes && (null === f2 || 0 === f2.lanes) && (f2 = b.lastRenderedReducer, null !== f2)) try {
      var g2 = b.lastRenderedState, h = f2(g2, c);
      e.hasEagerState = true;
      e.eagerState = h;
      if (He(h, g2)) {
        var k2 = b.interleaved;
        null === k2 ? (e.next = e, Xg(b)) : (e.next = k2.next, k2.next = e);
        b.interleaved = e;
        return;
      }
    } catch (l2) {
    } finally {
    }
    c = Yg(a, b, e, d);
    null !== c && (e = L(), mh(c, a, d, e), Ji(c, b, d));
  }
}
function Hi(a) {
  var b = a.alternate;
  return a === N || null !== b && b === N;
}
function Ii(a, b) {
  Th = Sh = true;
  var c = a.pending;
  null === c ? b.next = b : (b.next = c.next, c.next = b);
  a.pending = b;
}
function Ji(a, b, c) {
  if (0 !== (c & 4194240)) {
    var d = b.lanes;
    d &= a.pendingLanes;
    c |= d;
    b.lanes = c;
    Cc(a, c);
  }
}
var ai = { readContext: Vg, useCallback: Q, useContext: Q, useEffect: Q, useImperativeHandle: Q, useInsertionEffect: Q, useLayoutEffect: Q, useMemo: Q, useReducer: Q, useRef: Q, useState: Q, useDebugValue: Q, useDeferredValue: Q, useTransition: Q, useMutableSource: Q, useSyncExternalStore: Q, useId: Q, unstable_isNewReconciler: false }, Yh = { readContext: Vg, useCallback: function(a, b) {
  ci().memoizedState = [a, void 0 === b ? null : b];
  return a;
}, useContext: Vg, useEffect: vi, useImperativeHandle: function(a, b, c) {
  c = null !== c && void 0 !== c ? c.concat([a]) : null;
  return ti(
    4194308,
    4,
    yi.bind(null, b, a),
    c
  );
}, useLayoutEffect: function(a, b) {
  return ti(4194308, 4, a, b);
}, useInsertionEffect: function(a, b) {
  return ti(4, 2, a, b);
}, useMemo: function(a, b) {
  var c = ci();
  b = void 0 === b ? null : b;
  a = a();
  c.memoizedState = [a, b];
  return a;
}, useReducer: function(a, b, c) {
  var d = ci();
  b = void 0 !== c ? c(b) : b;
  d.memoizedState = d.baseState = b;
  a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: a, lastRenderedState: b };
  d.queue = a;
  a = a.dispatch = Gi.bind(null, N, a);
  return [d.memoizedState, a];
}, useRef: function(a) {
  var b = ci();
  a = { current: a };
  return b.memoizedState = a;
}, useState: qi, useDebugValue: Ai, useDeferredValue: function(a) {
  return ci().memoizedState = a;
}, useTransition: function() {
  var a = qi(false), b = a[0];
  a = Ei.bind(null, a[1]);
  ci().memoizedState = a;
  return [b, a];
}, useMutableSource: function() {
}, useSyncExternalStore: function(a, b, c) {
  var d = N, e = ci();
  if (I) {
    if (void 0 === c) throw Error(p$1(407));
    c = c();
  } else {
    c = b();
    if (null === R) throw Error(p$1(349));
    0 !== (Rh & 30) || ni(d, b, c);
  }
  e.memoizedState = c;
  var f2 = { value: c, getSnapshot: b };
  e.queue = f2;
  vi(ki.bind(
    null,
    d,
    f2,
    a
  ), [a]);
  d.flags |= 2048;
  li(9, mi.bind(null, d, f2, c, b), void 0, null);
  return c;
}, useId: function() {
  var a = ci(), b = R.identifierPrefix;
  if (I) {
    var c = sg;
    var d = rg;
    c = (d & ~(1 << 32 - oc(d) - 1)).toString(32) + c;
    b = ":" + b + "R" + c;
    c = Uh++;
    0 < c && (b += "H" + c.toString(32));
    b += ":";
  } else c = Vh++, b = ":" + b + "r" + c.toString(32) + ":";
  return a.memoizedState = b;
}, unstable_isNewReconciler: false }, Zh = {
  readContext: Vg,
  useCallback: Bi,
  useContext: Vg,
  useEffect: ji,
  useImperativeHandle: zi,
  useInsertionEffect: wi,
  useLayoutEffect: xi,
  useMemo: Ci,
  useReducer: fi,
  useRef: si,
  useState: function() {
    return fi(ei);
  },
  useDebugValue: Ai,
  useDeferredValue: function(a) {
    var b = di();
    return Di(b, O.memoizedState, a);
  },
  useTransition: function() {
    var a = fi(ei)[0], b = di().memoizedState;
    return [a, b];
  },
  useMutableSource: hi,
  useSyncExternalStore: ii,
  useId: Fi,
  unstable_isNewReconciler: false
}, $h = { readContext: Vg, useCallback: Bi, useContext: Vg, useEffect: ji, useImperativeHandle: zi, useInsertionEffect: wi, useLayoutEffect: xi, useMemo: Ci, useReducer: gi, useRef: si, useState: function() {
  return gi(ei);
}, useDebugValue: Ai, useDeferredValue: function(a) {
  var b = di();
  return null === O ? b.memoizedState = a : Di(b, O.memoizedState, a);
}, useTransition: function() {
  var a = gi(ei)[0], b = di().memoizedState;
  return [a, b];
}, useMutableSource: hi, useSyncExternalStore: ii, useId: Fi, unstable_isNewReconciler: false };
function Ki(a, b) {
  try {
    var c = "", d = b;
    do
      c += Pa(d), d = d.return;
    while (d);
    var e = c;
  } catch (f2) {
    e = "\nError generating stack: " + f2.message + "\n" + f2.stack;
  }
  return { value: a, source: b, stack: e, digest: null };
}
function Li(a, b, c) {
  return { value: a, source: null, stack: null != c ? c : null, digest: null != b ? b : null };
}
function Mi(a, b) {
  try {
    console.error(b.value);
  } catch (c) {
    setTimeout(function() {
      throw c;
    });
  }
}
var Ni = "function" === typeof WeakMap ? WeakMap : Map;
function Oi(a, b, c) {
  c = ch(-1, c);
  c.tag = 3;
  c.payload = { element: null };
  var d = b.value;
  c.callback = function() {
    Pi || (Pi = true, Qi = d);
    Mi(a, b);
  };
  return c;
}
function Ri(a, b, c) {
  c = ch(-1, c);
  c.tag = 3;
  var d = a.type.getDerivedStateFromError;
  if ("function" === typeof d) {
    var e = b.value;
    c.payload = function() {
      return d(e);
    };
    c.callback = function() {
      Mi(a, b);
    };
  }
  var f2 = a.stateNode;
  null !== f2 && "function" === typeof f2.componentDidCatch && (c.callback = function() {
    Mi(a, b);
    "function" !== typeof d && (null === Si ? Si = /* @__PURE__ */ new Set([this]) : Si.add(this));
    var c2 = b.stack;
    this.componentDidCatch(b.value, { componentStack: null !== c2 ? c2 : "" });
  });
  return c;
}
function Ti(a, b, c) {
  var d = a.pingCache;
  if (null === d) {
    d = a.pingCache = new Ni();
    var e = /* @__PURE__ */ new Set();
    d.set(b, e);
  } else e = d.get(b), void 0 === e && (e = /* @__PURE__ */ new Set(), d.set(b, e));
  e.has(c) || (e.add(c), a = Ui.bind(null, a, b, c), b.then(a, a));
}
function Vi(a) {
  do {
    var b;
    if (b = 13 === a.tag) b = a.memoizedState, b = null !== b ? null !== b.dehydrated ? true : false : true;
    if (b) return a;
    a = a.return;
  } while (null !== a);
  return null;
}
function Wi(a, b, c, d, e) {
  if (0 === (a.mode & 1)) return a === b ? a.flags |= 65536 : (a.flags |= 128, c.flags |= 131072, c.flags &= -52805, 1 === c.tag && (null === c.alternate ? c.tag = 17 : (b = ch(-1, 1), b.tag = 2, dh(c, b, 1))), c.lanes |= 1), a;
  a.flags |= 65536;
  a.lanes = e;
  return a;
}
var Xi = ua.ReactCurrentOwner, Ug = false;
function Yi(a, b, c, d) {
  b.child = null === a ? Ch(b, null, c, d) : Bh(b, a.child, c, d);
}
function Zi(a, b, c, d, e) {
  c = c.render;
  var f2 = b.ref;
  Tg(b, e);
  d = Xh(a, b, c, d, f2, e);
  c = bi();
  if (null !== a && !Ug) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, $i(a, b, e);
  I && c && vg(b);
  b.flags |= 1;
  Yi(a, b, d, e);
  return b.child;
}
function aj(a, b, c, d, e) {
  if (null === a) {
    var f2 = c.type;
    if ("function" === typeof f2 && !bj(f2) && void 0 === f2.defaultProps && null === c.compare && void 0 === c.defaultProps) return b.tag = 15, b.type = f2, cj(a, b, f2, d, e);
    a = yh(c.type, null, d, b, b.mode, e);
    a.ref = b.ref;
    a.return = b;
    return b.child = a;
  }
  f2 = a.child;
  if (0 === (a.lanes & e)) {
    var g2 = f2.memoizedProps;
    c = c.compare;
    c = null !== c ? c : Ie;
    if (c(g2, d) && a.ref === b.ref) return $i(a, b, e);
  }
  b.flags |= 1;
  a = wh(f2, d);
  a.ref = b.ref;
  a.return = b;
  return b.child = a;
}
function cj(a, b, c, d, e) {
  if (null !== a) {
    var f2 = a.memoizedProps;
    if (Ie(f2, d) && a.ref === b.ref) if (Ug = false, b.pendingProps = d = f2, 0 !== (a.lanes & e)) 0 !== (a.flags & 131072) && (Ug = true);
    else return b.lanes = a.lanes, $i(a, b, e);
  }
  return dj(a, b, c, d, e);
}
function ej(a, b, c) {
  var d = b.pendingProps, e = d.children, f2 = null !== a ? a.memoizedState : null;
  if ("hidden" === d.mode) if (0 === (b.mode & 1)) b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, G(fj, gj), gj |= c;
  else {
    if (0 === (c & 1073741824)) return a = null !== f2 ? f2.baseLanes | c : c, b.lanes = b.childLanes = 1073741824, b.memoizedState = { baseLanes: a, cachePool: null, transitions: null }, b.updateQueue = null, G(fj, gj), gj |= a, null;
    b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null };
    d = null !== f2 ? f2.baseLanes : c;
    G(fj, gj);
    gj |= d;
  }
  else null !== f2 ? (d = f2.baseLanes | c, b.memoizedState = null) : d = c, G(fj, gj), gj |= d;
  Yi(a, b, e, c);
  return b.child;
}
function hj(a, b) {
  var c = b.ref;
  if (null === a && null !== c || null !== a && a.ref !== c) b.flags |= 512, b.flags |= 2097152;
}
function dj(a, b, c, d, e) {
  var f2 = Zf(c) ? Xf : H.current;
  f2 = Yf(b, f2);
  Tg(b, e);
  c = Xh(a, b, c, d, f2, e);
  d = bi();
  if (null !== a && !Ug) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, $i(a, b, e);
  I && d && vg(b);
  b.flags |= 1;
  Yi(a, b, c, e);
  return b.child;
}
function ij(a, b, c, d, e) {
  if (Zf(c)) {
    var f2 = true;
    cg(b);
  } else f2 = false;
  Tg(b, e);
  if (null === b.stateNode) jj(a, b), ph(b, c, d), rh(b, c, d, e), d = true;
  else if (null === a) {
    var g2 = b.stateNode, h = b.memoizedProps;
    g2.props = h;
    var k2 = g2.context, l2 = c.contextType;
    "object" === typeof l2 && null !== l2 ? l2 = Vg(l2) : (l2 = Zf(c) ? Xf : H.current, l2 = Yf(b, l2));
    var m2 = c.getDerivedStateFromProps, q2 = "function" === typeof m2 || "function" === typeof g2.getSnapshotBeforeUpdate;
    q2 || "function" !== typeof g2.UNSAFE_componentWillReceiveProps && "function" !== typeof g2.componentWillReceiveProps || (h !== d || k2 !== l2) && qh(b, g2, d, l2);
    $g = false;
    var r2 = b.memoizedState;
    g2.state = r2;
    gh(b, d, g2, e);
    k2 = b.memoizedState;
    h !== d || r2 !== k2 || Wf.current || $g ? ("function" === typeof m2 && (kh(b, c, m2, d), k2 = b.memoizedState), (h = $g || oh(b, c, h, d, r2, k2, l2)) ? (q2 || "function" !== typeof g2.UNSAFE_componentWillMount && "function" !== typeof g2.componentWillMount || ("function" === typeof g2.componentWillMount && g2.componentWillMount(), "function" === typeof g2.UNSAFE_componentWillMount && g2.UNSAFE_componentWillMount()), "function" === typeof g2.componentDidMount && (b.flags |= 4194308)) : ("function" === typeof g2.componentDidMount && (b.flags |= 4194308), b.memoizedProps = d, b.memoizedState = k2), g2.props = d, g2.state = k2, g2.context = l2, d = h) : ("function" === typeof g2.componentDidMount && (b.flags |= 4194308), d = false);
  } else {
    g2 = b.stateNode;
    bh(a, b);
    h = b.memoizedProps;
    l2 = b.type === b.elementType ? h : Lg(b.type, h);
    g2.props = l2;
    q2 = b.pendingProps;
    r2 = g2.context;
    k2 = c.contextType;
    "object" === typeof k2 && null !== k2 ? k2 = Vg(k2) : (k2 = Zf(c) ? Xf : H.current, k2 = Yf(b, k2));
    var y2 = c.getDerivedStateFromProps;
    (m2 = "function" === typeof y2 || "function" === typeof g2.getSnapshotBeforeUpdate) || "function" !== typeof g2.UNSAFE_componentWillReceiveProps && "function" !== typeof g2.componentWillReceiveProps || (h !== q2 || r2 !== k2) && qh(b, g2, d, k2);
    $g = false;
    r2 = b.memoizedState;
    g2.state = r2;
    gh(b, d, g2, e);
    var n2 = b.memoizedState;
    h !== q2 || r2 !== n2 || Wf.current || $g ? ("function" === typeof y2 && (kh(b, c, y2, d), n2 = b.memoizedState), (l2 = $g || oh(b, c, l2, d, r2, n2, k2) || false) ? (m2 || "function" !== typeof g2.UNSAFE_componentWillUpdate && "function" !== typeof g2.componentWillUpdate || ("function" === typeof g2.componentWillUpdate && g2.componentWillUpdate(d, n2, k2), "function" === typeof g2.UNSAFE_componentWillUpdate && g2.UNSAFE_componentWillUpdate(d, n2, k2)), "function" === typeof g2.componentDidUpdate && (b.flags |= 4), "function" === typeof g2.getSnapshotBeforeUpdate && (b.flags |= 1024)) : ("function" !== typeof g2.componentDidUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 4), "function" !== typeof g2.getSnapshotBeforeUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 1024), b.memoizedProps = d, b.memoizedState = n2), g2.props = d, g2.state = n2, g2.context = k2, d = l2) : ("function" !== typeof g2.componentDidUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 4), "function" !== typeof g2.getSnapshotBeforeUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 1024), d = false);
  }
  return kj(a, b, c, d, f2, e);
}
function kj(a, b, c, d, e, f2) {
  hj(a, b);
  var g2 = 0 !== (b.flags & 128);
  if (!d && !g2) return e && dg(b, c, false), $i(a, b, f2);
  d = b.stateNode;
  Xi.current = b;
  var h = g2 && "function" !== typeof c.getDerivedStateFromError ? null : d.render();
  b.flags |= 1;
  null !== a && g2 ? (b.child = Bh(b, a.child, null, f2), b.child = Bh(b, null, h, f2)) : Yi(a, b, h, f2);
  b.memoizedState = d.state;
  e && dg(b, c, true);
  return b.child;
}
function lj(a) {
  var b = a.stateNode;
  b.pendingContext ? ag(a, b.pendingContext, b.pendingContext !== b.context) : b.context && ag(a, b.context, false);
  Ih(a, b.containerInfo);
}
function mj(a, b, c, d, e) {
  Ig();
  Jg(e);
  b.flags |= 256;
  Yi(a, b, c, d);
  return b.child;
}
var nj = { dehydrated: null, treeContext: null, retryLane: 0 };
function oj(a) {
  return { baseLanes: a, cachePool: null, transitions: null };
}
function pj(a, b, c) {
  var d = b.pendingProps, e = M.current, f2 = false, g2 = 0 !== (b.flags & 128), h;
  (h = g2) || (h = null !== a && null === a.memoizedState ? false : 0 !== (e & 2));
  if (h) f2 = true, b.flags &= -129;
  else if (null === a || null !== a.memoizedState) e |= 1;
  G(M, e & 1);
  if (null === a) {
    Eg(b);
    a = b.memoizedState;
    if (null !== a && (a = a.dehydrated, null !== a)) return 0 === (b.mode & 1) ? b.lanes = 1 : "$!" === a.data ? b.lanes = 8 : b.lanes = 1073741824, null;
    g2 = d.children;
    a = d.fallback;
    return f2 ? (d = b.mode, f2 = b.child, g2 = { mode: "hidden", children: g2 }, 0 === (d & 1) && null !== f2 ? (f2.childLanes = 0, f2.pendingProps = g2) : f2 = qj(g2, d, 0, null), a = Ah(a, d, c, null), f2.return = b, a.return = b, f2.sibling = a, b.child = f2, b.child.memoizedState = oj(c), b.memoizedState = nj, a) : rj(b, g2);
  }
  e = a.memoizedState;
  if (null !== e && (h = e.dehydrated, null !== h)) return sj(a, b, g2, d, h, e, c);
  if (f2) {
    f2 = d.fallback;
    g2 = b.mode;
    e = a.child;
    h = e.sibling;
    var k2 = { mode: "hidden", children: d.children };
    0 === (g2 & 1) && b.child !== e ? (d = b.child, d.childLanes = 0, d.pendingProps = k2, b.deletions = null) : (d = wh(e, k2), d.subtreeFlags = e.subtreeFlags & 14680064);
    null !== h ? f2 = wh(h, f2) : (f2 = Ah(f2, g2, c, null), f2.flags |= 2);
    f2.return = b;
    d.return = b;
    d.sibling = f2;
    b.child = d;
    d = f2;
    f2 = b.child;
    g2 = a.child.memoizedState;
    g2 = null === g2 ? oj(c) : { baseLanes: g2.baseLanes | c, cachePool: null, transitions: g2.transitions };
    f2.memoizedState = g2;
    f2.childLanes = a.childLanes & ~c;
    b.memoizedState = nj;
    return d;
  }
  f2 = a.child;
  a = f2.sibling;
  d = wh(f2, { mode: "visible", children: d.children });
  0 === (b.mode & 1) && (d.lanes = c);
  d.return = b;
  d.sibling = null;
  null !== a && (c = b.deletions, null === c ? (b.deletions = [a], b.flags |= 16) : c.push(a));
  b.child = d;
  b.memoizedState = null;
  return d;
}
function rj(a, b) {
  b = qj({ mode: "visible", children: b }, a.mode, 0, null);
  b.return = a;
  return a.child = b;
}
function tj(a, b, c, d) {
  null !== d && Jg(d);
  Bh(b, a.child, null, c);
  a = rj(b, b.pendingProps.children);
  a.flags |= 2;
  b.memoizedState = null;
  return a;
}
function sj(a, b, c, d, e, f2, g2) {
  if (c) {
    if (b.flags & 256) return b.flags &= -257, d = Li(Error(p$1(422))), tj(a, b, g2, d);
    if (null !== b.memoizedState) return b.child = a.child, b.flags |= 128, null;
    f2 = d.fallback;
    e = b.mode;
    d = qj({ mode: "visible", children: d.children }, e, 0, null);
    f2 = Ah(f2, e, g2, null);
    f2.flags |= 2;
    d.return = b;
    f2.return = b;
    d.sibling = f2;
    b.child = d;
    0 !== (b.mode & 1) && Bh(b, a.child, null, g2);
    b.child.memoizedState = oj(g2);
    b.memoizedState = nj;
    return f2;
  }
  if (0 === (b.mode & 1)) return tj(a, b, g2, null);
  if ("$!" === e.data) {
    d = e.nextSibling && e.nextSibling.dataset;
    if (d) var h = d.dgst;
    d = h;
    f2 = Error(p$1(419));
    d = Li(f2, d, void 0);
    return tj(a, b, g2, d);
  }
  h = 0 !== (g2 & a.childLanes);
  if (Ug || h) {
    d = R;
    if (null !== d) {
      switch (g2 & -g2) {
        case 4:
          e = 2;
          break;
        case 16:
          e = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          e = 32;
          break;
        case 536870912:
          e = 268435456;
          break;
        default:
          e = 0;
      }
      e = 0 !== (e & (d.suspendedLanes | g2)) ? 0 : e;
      0 !== e && e !== f2.retryLane && (f2.retryLane = e, Zg(a, e), mh(d, a, e, -1));
    }
    uj();
    d = Li(Error(p$1(421)));
    return tj(a, b, g2, d);
  }
  if ("$?" === e.data) return b.flags |= 128, b.child = a.child, b = vj.bind(null, a), e._reactRetry = b, null;
  a = f2.treeContext;
  yg = Lf(e.nextSibling);
  xg = b;
  I = true;
  zg = null;
  null !== a && (og[pg++] = rg, og[pg++] = sg, og[pg++] = qg, rg = a.id, sg = a.overflow, qg = b);
  b = rj(b, d.children);
  b.flags |= 4096;
  return b;
}
function wj(a, b, c) {
  a.lanes |= b;
  var d = a.alternate;
  null !== d && (d.lanes |= b);
  Sg(a.return, b, c);
}
function xj(a, b, c, d, e) {
  var f2 = a.memoizedState;
  null === f2 ? a.memoizedState = { isBackwards: b, rendering: null, renderingStartTime: 0, last: d, tail: c, tailMode: e } : (f2.isBackwards = b, f2.rendering = null, f2.renderingStartTime = 0, f2.last = d, f2.tail = c, f2.tailMode = e);
}
function yj(a, b, c) {
  var d = b.pendingProps, e = d.revealOrder, f2 = d.tail;
  Yi(a, b, d.children, c);
  d = M.current;
  if (0 !== (d & 2)) d = d & 1 | 2, b.flags |= 128;
  else {
    if (null !== a && 0 !== (a.flags & 128)) a: for (a = b.child; null !== a; ) {
      if (13 === a.tag) null !== a.memoizedState && wj(a, c, b);
      else if (19 === a.tag) wj(a, c, b);
      else if (null !== a.child) {
        a.child.return = a;
        a = a.child;
        continue;
      }
      if (a === b) break a;
      for (; null === a.sibling; ) {
        if (null === a.return || a.return === b) break a;
        a = a.return;
      }
      a.sibling.return = a.return;
      a = a.sibling;
    }
    d &= 1;
  }
  G(M, d);
  if (0 === (b.mode & 1)) b.memoizedState = null;
  else switch (e) {
    case "forwards":
      c = b.child;
      for (e = null; null !== c; ) a = c.alternate, null !== a && null === Mh(a) && (e = c), c = c.sibling;
      c = e;
      null === c ? (e = b.child, b.child = null) : (e = c.sibling, c.sibling = null);
      xj(b, false, e, c, f2);
      break;
    case "backwards":
      c = null;
      e = b.child;
      for (b.child = null; null !== e; ) {
        a = e.alternate;
        if (null !== a && null === Mh(a)) {
          b.child = e;
          break;
        }
        a = e.sibling;
        e.sibling = c;
        c = e;
        e = a;
      }
      xj(b, true, c, null, f2);
      break;
    case "together":
      xj(b, false, null, null, void 0);
      break;
    default:
      b.memoizedState = null;
  }
  return b.child;
}
function jj(a, b) {
  0 === (b.mode & 1) && null !== a && (a.alternate = null, b.alternate = null, b.flags |= 2);
}
function $i(a, b, c) {
  null !== a && (b.dependencies = a.dependencies);
  hh |= b.lanes;
  if (0 === (c & b.childLanes)) return null;
  if (null !== a && b.child !== a.child) throw Error(p$1(153));
  if (null !== b.child) {
    a = b.child;
    c = wh(a, a.pendingProps);
    b.child = c;
    for (c.return = b; null !== a.sibling; ) a = a.sibling, c = c.sibling = wh(a, a.pendingProps), c.return = b;
    c.sibling = null;
  }
  return b.child;
}
function zj(a, b, c) {
  switch (b.tag) {
    case 3:
      lj(b);
      Ig();
      break;
    case 5:
      Kh(b);
      break;
    case 1:
      Zf(b.type) && cg(b);
      break;
    case 4:
      Ih(b, b.stateNode.containerInfo);
      break;
    case 10:
      var d = b.type._context, e = b.memoizedProps.value;
      G(Mg, d._currentValue);
      d._currentValue = e;
      break;
    case 13:
      d = b.memoizedState;
      if (null !== d) {
        if (null !== d.dehydrated) return G(M, M.current & 1), b.flags |= 128, null;
        if (0 !== (c & b.child.childLanes)) return pj(a, b, c);
        G(M, M.current & 1);
        a = $i(a, b, c);
        return null !== a ? a.sibling : null;
      }
      G(M, M.current & 1);
      break;
    case 19:
      d = 0 !== (c & b.childLanes);
      if (0 !== (a.flags & 128)) {
        if (d) return yj(a, b, c);
        b.flags |= 128;
      }
      e = b.memoizedState;
      null !== e && (e.rendering = null, e.tail = null, e.lastEffect = null);
      G(M, M.current);
      if (d) break;
      else return null;
    case 22:
    case 23:
      return b.lanes = 0, ej(a, b, c);
  }
  return $i(a, b, c);
}
var Aj, Bj, Cj, Dj;
Aj = function(a, b) {
  for (var c = b.child; null !== c; ) {
    if (5 === c.tag || 6 === c.tag) a.appendChild(c.stateNode);
    else if (4 !== c.tag && null !== c.child) {
      c.child.return = c;
      c = c.child;
      continue;
    }
    if (c === b) break;
    for (; null === c.sibling; ) {
      if (null === c.return || c.return === b) return;
      c = c.return;
    }
    c.sibling.return = c.return;
    c = c.sibling;
  }
};
Bj = function() {
};
Cj = function(a, b, c, d) {
  var e = a.memoizedProps;
  if (e !== d) {
    a = b.stateNode;
    Hh(Eh.current);
    var f2 = null;
    switch (c) {
      case "input":
        e = Ya(a, e);
        d = Ya(a, d);
        f2 = [];
        break;
      case "select":
        e = A({}, e, { value: void 0 });
        d = A({}, d, { value: void 0 });
        f2 = [];
        break;
      case "textarea":
        e = gb(a, e);
        d = gb(a, d);
        f2 = [];
        break;
      default:
        "function" !== typeof e.onClick && "function" === typeof d.onClick && (a.onclick = Bf);
    }
    ub(c, d);
    var g2;
    c = null;
    for (l2 in e) if (!d.hasOwnProperty(l2) && e.hasOwnProperty(l2) && null != e[l2]) if ("style" === l2) {
      var h = e[l2];
      for (g2 in h) h.hasOwnProperty(g2) && (c || (c = {}), c[g2] = "");
    } else "dangerouslySetInnerHTML" !== l2 && "children" !== l2 && "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && "autoFocus" !== l2 && (ea.hasOwnProperty(l2) ? f2 || (f2 = []) : (f2 = f2 || []).push(l2, null));
    for (l2 in d) {
      var k2 = d[l2];
      h = null != e ? e[l2] : void 0;
      if (d.hasOwnProperty(l2) && k2 !== h && (null != k2 || null != h)) if ("style" === l2) if (h) {
        for (g2 in h) !h.hasOwnProperty(g2) || k2 && k2.hasOwnProperty(g2) || (c || (c = {}), c[g2] = "");
        for (g2 in k2) k2.hasOwnProperty(g2) && h[g2] !== k2[g2] && (c || (c = {}), c[g2] = k2[g2]);
      } else c || (f2 || (f2 = []), f2.push(
        l2,
        c
      )), c = k2;
      else "dangerouslySetInnerHTML" === l2 ? (k2 = k2 ? k2.__html : void 0, h = h ? h.__html : void 0, null != k2 && h !== k2 && (f2 = f2 || []).push(l2, k2)) : "children" === l2 ? "string" !== typeof k2 && "number" !== typeof k2 || (f2 = f2 || []).push(l2, "" + k2) : "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && (ea.hasOwnProperty(l2) ? (null != k2 && "onScroll" === l2 && D("scroll", a), f2 || h === k2 || (f2 = [])) : (f2 = f2 || []).push(l2, k2));
    }
    c && (f2 = f2 || []).push("style", c);
    var l2 = f2;
    if (b.updateQueue = l2) b.flags |= 4;
  }
};
Dj = function(a, b, c, d) {
  c !== d && (b.flags |= 4);
};
function Ej(a, b) {
  if (!I) switch (a.tailMode) {
    case "hidden":
      b = a.tail;
      for (var c = null; null !== b; ) null !== b.alternate && (c = b), b = b.sibling;
      null === c ? a.tail = null : c.sibling = null;
      break;
    case "collapsed":
      c = a.tail;
      for (var d = null; null !== c; ) null !== c.alternate && (d = c), c = c.sibling;
      null === d ? b || null === a.tail ? a.tail = null : a.tail.sibling = null : d.sibling = null;
  }
}
function S(a) {
  var b = null !== a.alternate && a.alternate.child === a.child, c = 0, d = 0;
  if (b) for (var e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags & 14680064, d |= e.flags & 14680064, e.return = a, e = e.sibling;
  else for (e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags, d |= e.flags, e.return = a, e = e.sibling;
  a.subtreeFlags |= d;
  a.childLanes = c;
  return b;
}
function Fj(a, b, c) {
  var d = b.pendingProps;
  wg(b);
  switch (b.tag) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return S(b), null;
    case 1:
      return Zf(b.type) && $f(), S(b), null;
    case 3:
      d = b.stateNode;
      Jh();
      E(Wf);
      E(H);
      Oh();
      d.pendingContext && (d.context = d.pendingContext, d.pendingContext = null);
      if (null === a || null === a.child) Gg(b) ? b.flags |= 4 : null === a || a.memoizedState.isDehydrated && 0 === (b.flags & 256) || (b.flags |= 1024, null !== zg && (Gj(zg), zg = null));
      Bj(a, b);
      S(b);
      return null;
    case 5:
      Lh(b);
      var e = Hh(Gh.current);
      c = b.type;
      if (null !== a && null != b.stateNode) Cj(a, b, c, d, e), a.ref !== b.ref && (b.flags |= 512, b.flags |= 2097152);
      else {
        if (!d) {
          if (null === b.stateNode) throw Error(p$1(166));
          S(b);
          return null;
        }
        a = Hh(Eh.current);
        if (Gg(b)) {
          d = b.stateNode;
          c = b.type;
          var f2 = b.memoizedProps;
          d[Of] = b;
          d[Pf] = f2;
          a = 0 !== (b.mode & 1);
          switch (c) {
            case "dialog":
              D("cancel", d);
              D("close", d);
              break;
            case "iframe":
            case "object":
            case "embed":
              D("load", d);
              break;
            case "video":
            case "audio":
              for (e = 0; e < lf.length; e++) D(lf[e], d);
              break;
            case "source":
              D("error", d);
              break;
            case "img":
            case "image":
            case "link":
              D(
                "error",
                d
              );
              D("load", d);
              break;
            case "details":
              D("toggle", d);
              break;
            case "input":
              Za(d, f2);
              D("invalid", d);
              break;
            case "select":
              d._wrapperState = { wasMultiple: !!f2.multiple };
              D("invalid", d);
              break;
            case "textarea":
              hb(d, f2), D("invalid", d);
          }
          ub(c, f2);
          e = null;
          for (var g2 in f2) if (f2.hasOwnProperty(g2)) {
            var h = f2[g2];
            "children" === g2 ? "string" === typeof h ? d.textContent !== h && (true !== f2.suppressHydrationWarning && Af(d.textContent, h, a), e = ["children", h]) : "number" === typeof h && d.textContent !== "" + h && (true !== f2.suppressHydrationWarning && Af(
              d.textContent,
              h,
              a
            ), e = ["children", "" + h]) : ea.hasOwnProperty(g2) && null != h && "onScroll" === g2 && D("scroll", d);
          }
          switch (c) {
            case "input":
              Va(d);
              db(d, f2, true);
              break;
            case "textarea":
              Va(d);
              jb(d);
              break;
            case "select":
            case "option":
              break;
            default:
              "function" === typeof f2.onClick && (d.onclick = Bf);
          }
          d = e;
          b.updateQueue = d;
          null !== d && (b.flags |= 4);
        } else {
          g2 = 9 === e.nodeType ? e : e.ownerDocument;
          "http://www.w3.org/1999/xhtml" === a && (a = kb(c));
          "http://www.w3.org/1999/xhtml" === a ? "script" === c ? (a = g2.createElement("div"), a.innerHTML = "<script><\/script>", a = a.removeChild(a.firstChild)) : "string" === typeof d.is ? a = g2.createElement(c, { is: d.is }) : (a = g2.createElement(c), "select" === c && (g2 = a, d.multiple ? g2.multiple = true : d.size && (g2.size = d.size))) : a = g2.createElementNS(a, c);
          a[Of] = b;
          a[Pf] = d;
          Aj(a, b, false, false);
          b.stateNode = a;
          a: {
            g2 = vb(c, d);
            switch (c) {
              case "dialog":
                D("cancel", a);
                D("close", a);
                e = d;
                break;
              case "iframe":
              case "object":
              case "embed":
                D("load", a);
                e = d;
                break;
              case "video":
              case "audio":
                for (e = 0; e < lf.length; e++) D(lf[e], a);
                e = d;
                break;
              case "source":
                D("error", a);
                e = d;
                break;
              case "img":
              case "image":
              case "link":
                D(
                  "error",
                  a
                );
                D("load", a);
                e = d;
                break;
              case "details":
                D("toggle", a);
                e = d;
                break;
              case "input":
                Za(a, d);
                e = Ya(a, d);
                D("invalid", a);
                break;
              case "option":
                e = d;
                break;
              case "select":
                a._wrapperState = { wasMultiple: !!d.multiple };
                e = A({}, d, { value: void 0 });
                D("invalid", a);
                break;
              case "textarea":
                hb(a, d);
                e = gb(a, d);
                D("invalid", a);
                break;
              default:
                e = d;
            }
            ub(c, e);
            h = e;
            for (f2 in h) if (h.hasOwnProperty(f2)) {
              var k2 = h[f2];
              "style" === f2 ? sb(a, k2) : "dangerouslySetInnerHTML" === f2 ? (k2 = k2 ? k2.__html : void 0, null != k2 && nb(a, k2)) : "children" === f2 ? "string" === typeof k2 ? ("textarea" !== c || "" !== k2) && ob(a, k2) : "number" === typeof k2 && ob(a, "" + k2) : "suppressContentEditableWarning" !== f2 && "suppressHydrationWarning" !== f2 && "autoFocus" !== f2 && (ea.hasOwnProperty(f2) ? null != k2 && "onScroll" === f2 && D("scroll", a) : null != k2 && ta(a, f2, k2, g2));
            }
            switch (c) {
              case "input":
                Va(a);
                db(a, d, false);
                break;
              case "textarea":
                Va(a);
                jb(a);
                break;
              case "option":
                null != d.value && a.setAttribute("value", "" + Sa(d.value));
                break;
              case "select":
                a.multiple = !!d.multiple;
                f2 = d.value;
                null != f2 ? fb(a, !!d.multiple, f2, false) : null != d.defaultValue && fb(
                  a,
                  !!d.multiple,
                  d.defaultValue,
                  true
                );
                break;
              default:
                "function" === typeof e.onClick && (a.onclick = Bf);
            }
            switch (c) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                d = !!d.autoFocus;
                break a;
              case "img":
                d = true;
                break a;
              default:
                d = false;
            }
          }
          d && (b.flags |= 4);
        }
        null !== b.ref && (b.flags |= 512, b.flags |= 2097152);
      }
      S(b);
      return null;
    case 6:
      if (a && null != b.stateNode) Dj(a, b, a.memoizedProps, d);
      else {
        if ("string" !== typeof d && null === b.stateNode) throw Error(p$1(166));
        c = Hh(Gh.current);
        Hh(Eh.current);
        if (Gg(b)) {
          d = b.stateNode;
          c = b.memoizedProps;
          d[Of] = b;
          if (f2 = d.nodeValue !== c) {
            if (a = xg, null !== a) switch (a.tag) {
              case 3:
                Af(d.nodeValue, c, 0 !== (a.mode & 1));
                break;
              case 5:
                true !== a.memoizedProps.suppressHydrationWarning && Af(d.nodeValue, c, 0 !== (a.mode & 1));
            }
          }
          f2 && (b.flags |= 4);
        } else d = (9 === c.nodeType ? c : c.ownerDocument).createTextNode(d), d[Of] = b, b.stateNode = d;
      }
      S(b);
      return null;
    case 13:
      E(M);
      d = b.memoizedState;
      if (null === a || null !== a.memoizedState && null !== a.memoizedState.dehydrated) {
        if (I && null !== yg && 0 !== (b.mode & 1) && 0 === (b.flags & 128)) Hg(), Ig(), b.flags |= 98560, f2 = false;
        else if (f2 = Gg(b), null !== d && null !== d.dehydrated) {
          if (null === a) {
            if (!f2) throw Error(p$1(318));
            f2 = b.memoizedState;
            f2 = null !== f2 ? f2.dehydrated : null;
            if (!f2) throw Error(p$1(317));
            f2[Of] = b;
          } else Ig(), 0 === (b.flags & 128) && (b.memoizedState = null), b.flags |= 4;
          S(b);
          f2 = false;
        } else null !== zg && (Gj(zg), zg = null), f2 = true;
        if (!f2) return b.flags & 65536 ? b : null;
      }
      if (0 !== (b.flags & 128)) return b.lanes = c, b;
      d = null !== d;
      d !== (null !== a && null !== a.memoizedState) && d && (b.child.flags |= 8192, 0 !== (b.mode & 1) && (null === a || 0 !== (M.current & 1) ? 0 === T && (T = 3) : uj()));
      null !== b.updateQueue && (b.flags |= 4);
      S(b);
      return null;
    case 4:
      return Jh(), Bj(a, b), null === a && sf(b.stateNode.containerInfo), S(b), null;
    case 10:
      return Rg(b.type._context), S(b), null;
    case 17:
      return Zf(b.type) && $f(), S(b), null;
    case 19:
      E(M);
      f2 = b.memoizedState;
      if (null === f2) return S(b), null;
      d = 0 !== (b.flags & 128);
      g2 = f2.rendering;
      if (null === g2) if (d) Ej(f2, false);
      else {
        if (0 !== T || null !== a && 0 !== (a.flags & 128)) for (a = b.child; null !== a; ) {
          g2 = Mh(a);
          if (null !== g2) {
            b.flags |= 128;
            Ej(f2, false);
            d = g2.updateQueue;
            null !== d && (b.updateQueue = d, b.flags |= 4);
            b.subtreeFlags = 0;
            d = c;
            for (c = b.child; null !== c; ) f2 = c, a = d, f2.flags &= 14680066, g2 = f2.alternate, null === g2 ? (f2.childLanes = 0, f2.lanes = a, f2.child = null, f2.subtreeFlags = 0, f2.memoizedProps = null, f2.memoizedState = null, f2.updateQueue = null, f2.dependencies = null, f2.stateNode = null) : (f2.childLanes = g2.childLanes, f2.lanes = g2.lanes, f2.child = g2.child, f2.subtreeFlags = 0, f2.deletions = null, f2.memoizedProps = g2.memoizedProps, f2.memoizedState = g2.memoizedState, f2.updateQueue = g2.updateQueue, f2.type = g2.type, a = g2.dependencies, f2.dependencies = null === a ? null : { lanes: a.lanes, firstContext: a.firstContext }), c = c.sibling;
            G(M, M.current & 1 | 2);
            return b.child;
          }
          a = a.sibling;
        }
        null !== f2.tail && B() > Hj && (b.flags |= 128, d = true, Ej(f2, false), b.lanes = 4194304);
      }
      else {
        if (!d) if (a = Mh(g2), null !== a) {
          if (b.flags |= 128, d = true, c = a.updateQueue, null !== c && (b.updateQueue = c, b.flags |= 4), Ej(f2, true), null === f2.tail && "hidden" === f2.tailMode && !g2.alternate && !I) return S(b), null;
        } else 2 * B() - f2.renderingStartTime > Hj && 1073741824 !== c && (b.flags |= 128, d = true, Ej(f2, false), b.lanes = 4194304);
        f2.isBackwards ? (g2.sibling = b.child, b.child = g2) : (c = f2.last, null !== c ? c.sibling = g2 : b.child = g2, f2.last = g2);
      }
      if (null !== f2.tail) return b = f2.tail, f2.rendering = b, f2.tail = b.sibling, f2.renderingStartTime = B(), b.sibling = null, c = M.current, G(M, d ? c & 1 | 2 : c & 1), b;
      S(b);
      return null;
    case 22:
    case 23:
      return Ij(), d = null !== b.memoizedState, null !== a && null !== a.memoizedState !== d && (b.flags |= 8192), d && 0 !== (b.mode & 1) ? 0 !== (gj & 1073741824) && (S(b), b.subtreeFlags & 6 && (b.flags |= 8192)) : S(b), null;
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(p$1(156, b.tag));
}
function Jj(a, b) {
  wg(b);
  switch (b.tag) {
    case 1:
      return Zf(b.type) && $f(), a = b.flags, a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
    case 3:
      return Jh(), E(Wf), E(H), Oh(), a = b.flags, 0 !== (a & 65536) && 0 === (a & 128) ? (b.flags = a & -65537 | 128, b) : null;
    case 5:
      return Lh(b), null;
    case 13:
      E(M);
      a = b.memoizedState;
      if (null !== a && null !== a.dehydrated) {
        if (null === b.alternate) throw Error(p$1(340));
        Ig();
      }
      a = b.flags;
      return a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
    case 19:
      return E(M), null;
    case 4:
      return Jh(), null;
    case 10:
      return Rg(b.type._context), null;
    case 22:
    case 23:
      return Ij(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var Kj = false, U = false, Lj = "function" === typeof WeakSet ? WeakSet : Set, V = null;
function Mj(a, b) {
  var c = a.ref;
  if (null !== c) if ("function" === typeof c) try {
    c(null);
  } catch (d) {
    W(a, b, d);
  }
  else c.current = null;
}
function Nj(a, b, c) {
  try {
    c();
  } catch (d) {
    W(a, b, d);
  }
}
var Oj = false;
function Pj(a, b) {
  Cf = dd;
  a = Me();
  if (Ne(a)) {
    if ("selectionStart" in a) var c = { start: a.selectionStart, end: a.selectionEnd };
    else a: {
      c = (c = a.ownerDocument) && c.defaultView || window;
      var d = c.getSelection && c.getSelection();
      if (d && 0 !== d.rangeCount) {
        c = d.anchorNode;
        var e = d.anchorOffset, f2 = d.focusNode;
        d = d.focusOffset;
        try {
          c.nodeType, f2.nodeType;
        } catch (F2) {
          c = null;
          break a;
        }
        var g2 = 0, h = -1, k2 = -1, l2 = 0, m2 = 0, q2 = a, r2 = null;
        b: for (; ; ) {
          for (var y2; ; ) {
            q2 !== c || 0 !== e && 3 !== q2.nodeType || (h = g2 + e);
            q2 !== f2 || 0 !== d && 3 !== q2.nodeType || (k2 = g2 + d);
            3 === q2.nodeType && (g2 += q2.nodeValue.length);
            if (null === (y2 = q2.firstChild)) break;
            r2 = q2;
            q2 = y2;
          }
          for (; ; ) {
            if (q2 === a) break b;
            r2 === c && ++l2 === e && (h = g2);
            r2 === f2 && ++m2 === d && (k2 = g2);
            if (null !== (y2 = q2.nextSibling)) break;
            q2 = r2;
            r2 = q2.parentNode;
          }
          q2 = y2;
        }
        c = -1 === h || -1 === k2 ? null : { start: h, end: k2 };
      } else c = null;
    }
    c = c || { start: 0, end: 0 };
  } else c = null;
  Df = { focusedElem: a, selectionRange: c };
  dd = false;
  for (V = b; null !== V; ) if (b = V, a = b.child, 0 !== (b.subtreeFlags & 1028) && null !== a) a.return = b, V = a;
  else for (; null !== V; ) {
    b = V;
    try {
      var n2 = b.alternate;
      if (0 !== (b.flags & 1024)) switch (b.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if (null !== n2) {
            var t2 = n2.memoizedProps, J2 = n2.memoizedState, x2 = b.stateNode, w2 = x2.getSnapshotBeforeUpdate(b.elementType === b.type ? t2 : Lg(b.type, t2), J2);
            x2.__reactInternalSnapshotBeforeUpdate = w2;
          }
          break;
        case 3:
          var u2 = b.stateNode.containerInfo;
          1 === u2.nodeType ? u2.textContent = "" : 9 === u2.nodeType && u2.documentElement && u2.removeChild(u2.documentElement);
          break;
        case 5:
        case 6:
        case 4:
        case 17:
          break;
        default:
          throw Error(p$1(163));
      }
    } catch (F2) {
      W(b, b.return, F2);
    }
    a = b.sibling;
    if (null !== a) {
      a.return = b.return;
      V = a;
      break;
    }
    V = b.return;
  }
  n2 = Oj;
  Oj = false;
  return n2;
}
function Qj(a, b, c) {
  var d = b.updateQueue;
  d = null !== d ? d.lastEffect : null;
  if (null !== d) {
    var e = d = d.next;
    do {
      if ((e.tag & a) === a) {
        var f2 = e.destroy;
        e.destroy = void 0;
        void 0 !== f2 && Nj(b, c, f2);
      }
      e = e.next;
    } while (e !== d);
  }
}
function Rj(a, b) {
  b = b.updateQueue;
  b = null !== b ? b.lastEffect : null;
  if (null !== b) {
    var c = b = b.next;
    do {
      if ((c.tag & a) === a) {
        var d = c.create;
        c.destroy = d();
      }
      c = c.next;
    } while (c !== b);
  }
}
function Sj(a) {
  var b = a.ref;
  if (null !== b) {
    var c = a.stateNode;
    switch (a.tag) {
      case 5:
        a = c;
        break;
      default:
        a = c;
    }
    "function" === typeof b ? b(a) : b.current = a;
  }
}
function Tj(a) {
  var b = a.alternate;
  null !== b && (a.alternate = null, Tj(b));
  a.child = null;
  a.deletions = null;
  a.sibling = null;
  5 === a.tag && (b = a.stateNode, null !== b && (delete b[Of], delete b[Pf], delete b[of], delete b[Qf], delete b[Rf]));
  a.stateNode = null;
  a.return = null;
  a.dependencies = null;
  a.memoizedProps = null;
  a.memoizedState = null;
  a.pendingProps = null;
  a.stateNode = null;
  a.updateQueue = null;
}
function Uj(a) {
  return 5 === a.tag || 3 === a.tag || 4 === a.tag;
}
function Vj(a) {
  a: for (; ; ) {
    for (; null === a.sibling; ) {
      if (null === a.return || Uj(a.return)) return null;
      a = a.return;
    }
    a.sibling.return = a.return;
    for (a = a.sibling; 5 !== a.tag && 6 !== a.tag && 18 !== a.tag; ) {
      if (a.flags & 2) continue a;
      if (null === a.child || 4 === a.tag) continue a;
      else a.child.return = a, a = a.child;
    }
    if (!(a.flags & 2)) return a.stateNode;
  }
}
function Wj(a, b, c) {
  var d = a.tag;
  if (5 === d || 6 === d) a = a.stateNode, b ? 8 === c.nodeType ? c.parentNode.insertBefore(a, b) : c.insertBefore(a, b) : (8 === c.nodeType ? (b = c.parentNode, b.insertBefore(a, c)) : (b = c, b.appendChild(a)), c = c._reactRootContainer, null !== c && void 0 !== c || null !== b.onclick || (b.onclick = Bf));
  else if (4 !== d && (a = a.child, null !== a)) for (Wj(a, b, c), a = a.sibling; null !== a; ) Wj(a, b, c), a = a.sibling;
}
function Xj(a, b, c) {
  var d = a.tag;
  if (5 === d || 6 === d) a = a.stateNode, b ? c.insertBefore(a, b) : c.appendChild(a);
  else if (4 !== d && (a = a.child, null !== a)) for (Xj(a, b, c), a = a.sibling; null !== a; ) Xj(a, b, c), a = a.sibling;
}
var X = null, Yj = false;
function Zj(a, b, c) {
  for (c = c.child; null !== c; ) ak(a, b, c), c = c.sibling;
}
function ak(a, b, c) {
  if (lc && "function" === typeof lc.onCommitFiberUnmount) try {
    lc.onCommitFiberUnmount(kc, c);
  } catch (h) {
  }
  switch (c.tag) {
    case 5:
      U || Mj(c, b);
    case 6:
      var d = X, e = Yj;
      X = null;
      Zj(a, b, c);
      X = d;
      Yj = e;
      null !== X && (Yj ? (a = X, c = c.stateNode, 8 === a.nodeType ? a.parentNode.removeChild(c) : a.removeChild(c)) : X.removeChild(c.stateNode));
      break;
    case 18:
      null !== X && (Yj ? (a = X, c = c.stateNode, 8 === a.nodeType ? Kf(a.parentNode, c) : 1 === a.nodeType && Kf(a, c), bd(a)) : Kf(X, c.stateNode));
      break;
    case 4:
      d = X;
      e = Yj;
      X = c.stateNode.containerInfo;
      Yj = true;
      Zj(a, b, c);
      X = d;
      Yj = e;
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (!U && (d = c.updateQueue, null !== d && (d = d.lastEffect, null !== d))) {
        e = d = d.next;
        do {
          var f2 = e, g2 = f2.destroy;
          f2 = f2.tag;
          void 0 !== g2 && (0 !== (f2 & 2) ? Nj(c, b, g2) : 0 !== (f2 & 4) && Nj(c, b, g2));
          e = e.next;
        } while (e !== d);
      }
      Zj(a, b, c);
      break;
    case 1:
      if (!U && (Mj(c, b), d = c.stateNode, "function" === typeof d.componentWillUnmount)) try {
        d.props = c.memoizedProps, d.state = c.memoizedState, d.componentWillUnmount();
      } catch (h) {
        W(c, b, h);
      }
      Zj(a, b, c);
      break;
    case 21:
      Zj(a, b, c);
      break;
    case 22:
      c.mode & 1 ? (U = (d = U) || null !== c.memoizedState, Zj(a, b, c), U = d) : Zj(a, b, c);
      break;
    default:
      Zj(a, b, c);
  }
}
function bk(a) {
  var b = a.updateQueue;
  if (null !== b) {
    a.updateQueue = null;
    var c = a.stateNode;
    null === c && (c = a.stateNode = new Lj());
    b.forEach(function(b2) {
      var d = ck.bind(null, a, b2);
      c.has(b2) || (c.add(b2), b2.then(d, d));
    });
  }
}
function dk(a, b) {
  var c = b.deletions;
  if (null !== c) for (var d = 0; d < c.length; d++) {
    var e = c[d];
    try {
      var f2 = a, g2 = b, h = g2;
      a: for (; null !== h; ) {
        switch (h.tag) {
          case 5:
            X = h.stateNode;
            Yj = false;
            break a;
          case 3:
            X = h.stateNode.containerInfo;
            Yj = true;
            break a;
          case 4:
            X = h.stateNode.containerInfo;
            Yj = true;
            break a;
        }
        h = h.return;
      }
      if (null === X) throw Error(p$1(160));
      ak(f2, g2, e);
      X = null;
      Yj = false;
      var k2 = e.alternate;
      null !== k2 && (k2.return = null);
      e.return = null;
    } catch (l2) {
      W(e, b, l2);
    }
  }
  if (b.subtreeFlags & 12854) for (b = b.child; null !== b; ) ek(b, a), b = b.sibling;
}
function ek(a, b) {
  var c = a.alternate, d = a.flags;
  switch (a.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      dk(b, a);
      fk(a);
      if (d & 4) {
        try {
          Qj(3, a, a.return), Rj(3, a);
        } catch (t2) {
          W(a, a.return, t2);
        }
        try {
          Qj(5, a, a.return);
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 1:
      dk(b, a);
      fk(a);
      d & 512 && null !== c && Mj(c, c.return);
      break;
    case 5:
      dk(b, a);
      fk(a);
      d & 512 && null !== c && Mj(c, c.return);
      if (a.flags & 32) {
        var e = a.stateNode;
        try {
          ob(e, "");
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      if (d & 4 && (e = a.stateNode, null != e)) {
        var f2 = a.memoizedProps, g2 = null !== c ? c.memoizedProps : f2, h = a.type, k2 = a.updateQueue;
        a.updateQueue = null;
        if (null !== k2) try {
          "input" === h && "radio" === f2.type && null != f2.name && ab(e, f2);
          vb(h, g2);
          var l2 = vb(h, f2);
          for (g2 = 0; g2 < k2.length; g2 += 2) {
            var m2 = k2[g2], q2 = k2[g2 + 1];
            "style" === m2 ? sb(e, q2) : "dangerouslySetInnerHTML" === m2 ? nb(e, q2) : "children" === m2 ? ob(e, q2) : ta(e, m2, q2, l2);
          }
          switch (h) {
            case "input":
              bb(e, f2);
              break;
            case "textarea":
              ib(e, f2);
              break;
            case "select":
              var r2 = e._wrapperState.wasMultiple;
              e._wrapperState.wasMultiple = !!f2.multiple;
              var y2 = f2.value;
              null != y2 ? fb(e, !!f2.multiple, y2, false) : r2 !== !!f2.multiple && (null != f2.defaultValue ? fb(
                e,
                !!f2.multiple,
                f2.defaultValue,
                true
              ) : fb(e, !!f2.multiple, f2.multiple ? [] : "", false));
          }
          e[Pf] = f2;
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 6:
      dk(b, a);
      fk(a);
      if (d & 4) {
        if (null === a.stateNode) throw Error(p$1(162));
        e = a.stateNode;
        f2 = a.memoizedProps;
        try {
          e.nodeValue = f2;
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 3:
      dk(b, a);
      fk(a);
      if (d & 4 && null !== c && c.memoizedState.isDehydrated) try {
        bd(b.containerInfo);
      } catch (t2) {
        W(a, a.return, t2);
      }
      break;
    case 4:
      dk(b, a);
      fk(a);
      break;
    case 13:
      dk(b, a);
      fk(a);
      e = a.child;
      e.flags & 8192 && (f2 = null !== e.memoizedState, e.stateNode.isHidden = f2, !f2 || null !== e.alternate && null !== e.alternate.memoizedState || (gk = B()));
      d & 4 && bk(a);
      break;
    case 22:
      m2 = null !== c && null !== c.memoizedState;
      a.mode & 1 ? (U = (l2 = U) || m2, dk(b, a), U = l2) : dk(b, a);
      fk(a);
      if (d & 8192) {
        l2 = null !== a.memoizedState;
        if ((a.stateNode.isHidden = l2) && !m2 && 0 !== (a.mode & 1)) for (V = a, m2 = a.child; null !== m2; ) {
          for (q2 = V = m2; null !== V; ) {
            r2 = V;
            y2 = r2.child;
            switch (r2.tag) {
              case 0:
              case 11:
              case 14:
              case 15:
                Qj(4, r2, r2.return);
                break;
              case 1:
                Mj(r2, r2.return);
                var n2 = r2.stateNode;
                if ("function" === typeof n2.componentWillUnmount) {
                  d = r2;
                  c = r2.return;
                  try {
                    b = d, n2.props = b.memoizedProps, n2.state = b.memoizedState, n2.componentWillUnmount();
                  } catch (t2) {
                    W(d, c, t2);
                  }
                }
                break;
              case 5:
                Mj(r2, r2.return);
                break;
              case 22:
                if (null !== r2.memoizedState) {
                  hk(q2);
                  continue;
                }
            }
            null !== y2 ? (y2.return = r2, V = y2) : hk(q2);
          }
          m2 = m2.sibling;
        }
        a: for (m2 = null, q2 = a; ; ) {
          if (5 === q2.tag) {
            if (null === m2) {
              m2 = q2;
              try {
                e = q2.stateNode, l2 ? (f2 = e.style, "function" === typeof f2.setProperty ? f2.setProperty("display", "none", "important") : f2.display = "none") : (h = q2.stateNode, k2 = q2.memoizedProps.style, g2 = void 0 !== k2 && null !== k2 && k2.hasOwnProperty("display") ? k2.display : null, h.style.display = rb("display", g2));
              } catch (t2) {
                W(a, a.return, t2);
              }
            }
          } else if (6 === q2.tag) {
            if (null === m2) try {
              q2.stateNode.nodeValue = l2 ? "" : q2.memoizedProps;
            } catch (t2) {
              W(a, a.return, t2);
            }
          } else if ((22 !== q2.tag && 23 !== q2.tag || null === q2.memoizedState || q2 === a) && null !== q2.child) {
            q2.child.return = q2;
            q2 = q2.child;
            continue;
          }
          if (q2 === a) break a;
          for (; null === q2.sibling; ) {
            if (null === q2.return || q2.return === a) break a;
            m2 === q2 && (m2 = null);
            q2 = q2.return;
          }
          m2 === q2 && (m2 = null);
          q2.sibling.return = q2.return;
          q2 = q2.sibling;
        }
      }
      break;
    case 19:
      dk(b, a);
      fk(a);
      d & 4 && bk(a);
      break;
    case 21:
      break;
    default:
      dk(
        b,
        a
      ), fk(a);
  }
}
function fk(a) {
  var b = a.flags;
  if (b & 2) {
    try {
      a: {
        for (var c = a.return; null !== c; ) {
          if (Uj(c)) {
            var d = c;
            break a;
          }
          c = c.return;
        }
        throw Error(p$1(160));
      }
      switch (d.tag) {
        case 5:
          var e = d.stateNode;
          d.flags & 32 && (ob(e, ""), d.flags &= -33);
          var f2 = Vj(a);
          Xj(a, f2, e);
          break;
        case 3:
        case 4:
          var g2 = d.stateNode.containerInfo, h = Vj(a);
          Wj(a, h, g2);
          break;
        default:
          throw Error(p$1(161));
      }
    } catch (k2) {
      W(a, a.return, k2);
    }
    a.flags &= -3;
  }
  b & 4096 && (a.flags &= -4097);
}
function ik(a, b, c) {
  V = a;
  jk(a);
}
function jk(a, b, c) {
  for (var d = 0 !== (a.mode & 1); null !== V; ) {
    var e = V, f2 = e.child;
    if (22 === e.tag && d) {
      var g2 = null !== e.memoizedState || Kj;
      if (!g2) {
        var h = e.alternate, k2 = null !== h && null !== h.memoizedState || U;
        h = Kj;
        var l2 = U;
        Kj = g2;
        if ((U = k2) && !l2) for (V = e; null !== V; ) g2 = V, k2 = g2.child, 22 === g2.tag && null !== g2.memoizedState ? kk(e) : null !== k2 ? (k2.return = g2, V = k2) : kk(e);
        for (; null !== f2; ) V = f2, jk(f2), f2 = f2.sibling;
        V = e;
        Kj = h;
        U = l2;
      }
      lk(a);
    } else 0 !== (e.subtreeFlags & 8772) && null !== f2 ? (f2.return = e, V = f2) : lk(a);
  }
}
function lk(a) {
  for (; null !== V; ) {
    var b = V;
    if (0 !== (b.flags & 8772)) {
      var c = b.alternate;
      try {
        if (0 !== (b.flags & 8772)) switch (b.tag) {
          case 0:
          case 11:
          case 15:
            U || Rj(5, b);
            break;
          case 1:
            var d = b.stateNode;
            if (b.flags & 4 && !U) if (null === c) d.componentDidMount();
            else {
              var e = b.elementType === b.type ? c.memoizedProps : Lg(b.type, c.memoizedProps);
              d.componentDidUpdate(e, c.memoizedState, d.__reactInternalSnapshotBeforeUpdate);
            }
            var f2 = b.updateQueue;
            null !== f2 && ih(b, f2, d);
            break;
          case 3:
            var g2 = b.updateQueue;
            if (null !== g2) {
              c = null;
              if (null !== b.child) switch (b.child.tag) {
                case 5:
                  c = b.child.stateNode;
                  break;
                case 1:
                  c = b.child.stateNode;
              }
              ih(b, g2, c);
            }
            break;
          case 5:
            var h = b.stateNode;
            if (null === c && b.flags & 4) {
              c = h;
              var k2 = b.memoizedProps;
              switch (b.type) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  k2.autoFocus && c.focus();
                  break;
                case "img":
                  k2.src && (c.src = k2.src);
              }
            }
            break;
          case 6:
            break;
          case 4:
            break;
          case 12:
            break;
          case 13:
            if (null === b.memoizedState) {
              var l2 = b.alternate;
              if (null !== l2) {
                var m2 = l2.memoizedState;
                if (null !== m2) {
                  var q2 = m2.dehydrated;
                  null !== q2 && bd(q2);
                }
              }
            }
            break;
          case 19:
          case 17:
          case 21:
          case 22:
          case 23:
          case 25:
            break;
          default:
            throw Error(p$1(163));
        }
        U || b.flags & 512 && Sj(b);
      } catch (r2) {
        W(b, b.return, r2);
      }
    }
    if (b === a) {
      V = null;
      break;
    }
    c = b.sibling;
    if (null !== c) {
      c.return = b.return;
      V = c;
      break;
    }
    V = b.return;
  }
}
function hk(a) {
  for (; null !== V; ) {
    var b = V;
    if (b === a) {
      V = null;
      break;
    }
    var c = b.sibling;
    if (null !== c) {
      c.return = b.return;
      V = c;
      break;
    }
    V = b.return;
  }
}
function kk(a) {
  for (; null !== V; ) {
    var b = V;
    try {
      switch (b.tag) {
        case 0:
        case 11:
        case 15:
          var c = b.return;
          try {
            Rj(4, b);
          } catch (k2) {
            W(b, c, k2);
          }
          break;
        case 1:
          var d = b.stateNode;
          if ("function" === typeof d.componentDidMount) {
            var e = b.return;
            try {
              d.componentDidMount();
            } catch (k2) {
              W(b, e, k2);
            }
          }
          var f2 = b.return;
          try {
            Sj(b);
          } catch (k2) {
            W(b, f2, k2);
          }
          break;
        case 5:
          var g2 = b.return;
          try {
            Sj(b);
          } catch (k2) {
            W(b, g2, k2);
          }
      }
    } catch (k2) {
      W(b, b.return, k2);
    }
    if (b === a) {
      V = null;
      break;
    }
    var h = b.sibling;
    if (null !== h) {
      h.return = b.return;
      V = h;
      break;
    }
    V = b.return;
  }
}
var mk = Math.ceil, nk = ua.ReactCurrentDispatcher, ok = ua.ReactCurrentOwner, pk = ua.ReactCurrentBatchConfig, K = 0, R = null, Y = null, Z = 0, gj = 0, fj = Uf(0), T = 0, qk = null, hh = 0, rk = 0, sk = 0, tk = null, uk = null, gk = 0, Hj = Infinity, vk = null, Pi = false, Qi = null, Si = null, wk = false, xk = null, yk = 0, zk = 0, Ak = null, Bk = -1, Ck = 0;
function L() {
  return 0 !== (K & 6) ? B() : -1 !== Bk ? Bk : Bk = B();
}
function lh(a) {
  if (0 === (a.mode & 1)) return 1;
  if (0 !== (K & 2) && 0 !== Z) return Z & -Z;
  if (null !== Kg.transition) return 0 === Ck && (Ck = yc()), Ck;
  a = C;
  if (0 !== a) return a;
  a = window.event;
  a = void 0 === a ? 16 : jd(a.type);
  return a;
}
function mh(a, b, c, d) {
  if (50 < zk) throw zk = 0, Ak = null, Error(p$1(185));
  Ac(a, c, d);
  if (0 === (K & 2) || a !== R) a === R && (0 === (K & 2) && (rk |= c), 4 === T && Dk(a, Z)), Ek(a, d), 1 === c && 0 === K && 0 === (b.mode & 1) && (Hj = B() + 500, fg && jg());
}
function Ek(a, b) {
  var c = a.callbackNode;
  wc(a, b);
  var d = uc(a, a === R ? Z : 0);
  if (0 === d) null !== c && bc(c), a.callbackNode = null, a.callbackPriority = 0;
  else if (b = d & -d, a.callbackPriority !== b) {
    null != c && bc(c);
    if (1 === b) 0 === a.tag ? ig(Fk.bind(null, a)) : hg(Fk.bind(null, a)), Jf(function() {
      0 === (K & 6) && jg();
    }), c = null;
    else {
      switch (Dc(d)) {
        case 1:
          c = fc;
          break;
        case 4:
          c = gc;
          break;
        case 16:
          c = hc;
          break;
        case 536870912:
          c = jc;
          break;
        default:
          c = hc;
      }
      c = Gk(c, Hk.bind(null, a));
    }
    a.callbackPriority = b;
    a.callbackNode = c;
  }
}
function Hk(a, b) {
  Bk = -1;
  Ck = 0;
  if (0 !== (K & 6)) throw Error(p$1(327));
  var c = a.callbackNode;
  if (Ik() && a.callbackNode !== c) return null;
  var d = uc(a, a === R ? Z : 0);
  if (0 === d) return null;
  if (0 !== (d & 30) || 0 !== (d & a.expiredLanes) || b) b = Jk(a, d);
  else {
    b = d;
    var e = K;
    K |= 2;
    var f2 = Kk();
    if (R !== a || Z !== b) vk = null, Hj = B() + 500, Lk(a, b);
    do
      try {
        Mk();
        break;
      } catch (h) {
        Nk(a, h);
      }
    while (1);
    Qg();
    nk.current = f2;
    K = e;
    null !== Y ? b = 0 : (R = null, Z = 0, b = T);
  }
  if (0 !== b) {
    2 === b && (e = xc(a), 0 !== e && (d = e, b = Ok(a, e)));
    if (1 === b) throw c = qk, Lk(a, 0), Dk(a, d), Ek(a, B()), c;
    if (6 === b) Dk(a, d);
    else {
      e = a.current.alternate;
      if (0 === (d & 30) && !Pk(e) && (b = Jk(a, d), 2 === b && (f2 = xc(a), 0 !== f2 && (d = f2, b = Ok(a, f2))), 1 === b)) throw c = qk, Lk(a, 0), Dk(a, d), Ek(a, B()), c;
      a.finishedWork = e;
      a.finishedLanes = d;
      switch (b) {
        case 0:
        case 1:
          throw Error(p$1(345));
        case 2:
          Qk(a, uk, vk);
          break;
        case 3:
          Dk(a, d);
          if ((d & 130023424) === d && (b = gk + 500 - B(), 10 < b)) {
            if (0 !== uc(a, 0)) break;
            e = a.suspendedLanes;
            if ((e & d) !== d) {
              L();
              a.pingedLanes |= a.suspendedLanes & e;
              break;
            }
            a.timeoutHandle = Ff(Qk.bind(null, a, uk, vk), b);
            break;
          }
          Qk(a, uk, vk);
          break;
        case 4:
          Dk(a, d);
          if ((d & 4194240) === d) break;
          b = a.eventTimes;
          for (e = -1; 0 < d; ) {
            var g2 = 31 - oc(d);
            f2 = 1 << g2;
            g2 = b[g2];
            g2 > e && (e = g2);
            d &= ~f2;
          }
          d = e;
          d = B() - d;
          d = (120 > d ? 120 : 480 > d ? 480 : 1080 > d ? 1080 : 1920 > d ? 1920 : 3e3 > d ? 3e3 : 4320 > d ? 4320 : 1960 * mk(d / 1960)) - d;
          if (10 < d) {
            a.timeoutHandle = Ff(Qk.bind(null, a, uk, vk), d);
            break;
          }
          Qk(a, uk, vk);
          break;
        case 5:
          Qk(a, uk, vk);
          break;
        default:
          throw Error(p$1(329));
      }
    }
  }
  Ek(a, B());
  return a.callbackNode === c ? Hk.bind(null, a) : null;
}
function Ok(a, b) {
  var c = tk;
  a.current.memoizedState.isDehydrated && (Lk(a, b).flags |= 256);
  a = Jk(a, b);
  2 !== a && (b = uk, uk = c, null !== b && Gj(b));
  return a;
}
function Gj(a) {
  null === uk ? uk = a : uk.push.apply(uk, a);
}
function Pk(a) {
  for (var b = a; ; ) {
    if (b.flags & 16384) {
      var c = b.updateQueue;
      if (null !== c && (c = c.stores, null !== c)) for (var d = 0; d < c.length; d++) {
        var e = c[d], f2 = e.getSnapshot;
        e = e.value;
        try {
          if (!He(f2(), e)) return false;
        } catch (g2) {
          return false;
        }
      }
    }
    c = b.child;
    if (b.subtreeFlags & 16384 && null !== c) c.return = b, b = c;
    else {
      if (b === a) break;
      for (; null === b.sibling; ) {
        if (null === b.return || b.return === a) return true;
        b = b.return;
      }
      b.sibling.return = b.return;
      b = b.sibling;
    }
  }
  return true;
}
function Dk(a, b) {
  b &= ~sk;
  b &= ~rk;
  a.suspendedLanes |= b;
  a.pingedLanes &= ~b;
  for (a = a.expirationTimes; 0 < b; ) {
    var c = 31 - oc(b), d = 1 << c;
    a[c] = -1;
    b &= ~d;
  }
}
function Fk(a) {
  if (0 !== (K & 6)) throw Error(p$1(327));
  Ik();
  var b = uc(a, 0);
  if (0 === (b & 1)) return Ek(a, B()), null;
  var c = Jk(a, b);
  if (0 !== a.tag && 2 === c) {
    var d = xc(a);
    0 !== d && (b = d, c = Ok(a, d));
  }
  if (1 === c) throw c = qk, Lk(a, 0), Dk(a, b), Ek(a, B()), c;
  if (6 === c) throw Error(p$1(345));
  a.finishedWork = a.current.alternate;
  a.finishedLanes = b;
  Qk(a, uk, vk);
  Ek(a, B());
  return null;
}
function Rk(a, b) {
  var c = K;
  K |= 1;
  try {
    return a(b);
  } finally {
    K = c, 0 === K && (Hj = B() + 500, fg && jg());
  }
}
function Sk(a) {
  null !== xk && 0 === xk.tag && 0 === (K & 6) && Ik();
  var b = K;
  K |= 1;
  var c = pk.transition, d = C;
  try {
    if (pk.transition = null, C = 1, a) return a();
  } finally {
    C = d, pk.transition = c, K = b, 0 === (K & 6) && jg();
  }
}
function Ij() {
  gj = fj.current;
  E(fj);
}
function Lk(a, b) {
  a.finishedWork = null;
  a.finishedLanes = 0;
  var c = a.timeoutHandle;
  -1 !== c && (a.timeoutHandle = -1, Gf(c));
  if (null !== Y) for (c = Y.return; null !== c; ) {
    var d = c;
    wg(d);
    switch (d.tag) {
      case 1:
        d = d.type.childContextTypes;
        null !== d && void 0 !== d && $f();
        break;
      case 3:
        Jh();
        E(Wf);
        E(H);
        Oh();
        break;
      case 5:
        Lh(d);
        break;
      case 4:
        Jh();
        break;
      case 13:
        E(M);
        break;
      case 19:
        E(M);
        break;
      case 10:
        Rg(d.type._context);
        break;
      case 22:
      case 23:
        Ij();
    }
    c = c.return;
  }
  R = a;
  Y = a = wh(a.current, null);
  Z = gj = b;
  T = 0;
  qk = null;
  sk = rk = hh = 0;
  uk = tk = null;
  if (null !== Wg) {
    for (b = 0; b < Wg.length; b++) if (c = Wg[b], d = c.interleaved, null !== d) {
      c.interleaved = null;
      var e = d.next, f2 = c.pending;
      if (null !== f2) {
        var g2 = f2.next;
        f2.next = e;
        d.next = g2;
      }
      c.pending = d;
    }
    Wg = null;
  }
  return a;
}
function Nk(a, b) {
  do {
    var c = Y;
    try {
      Qg();
      Ph.current = ai;
      if (Sh) {
        for (var d = N.memoizedState; null !== d; ) {
          var e = d.queue;
          null !== e && (e.pending = null);
          d = d.next;
        }
        Sh = false;
      }
      Rh = 0;
      P$1 = O = N = null;
      Th = false;
      Uh = 0;
      ok.current = null;
      if (null === c || null === c.return) {
        T = 1;
        qk = b;
        Y = null;
        break;
      }
      a: {
        var f2 = a, g2 = c.return, h = c, k2 = b;
        b = Z;
        h.flags |= 32768;
        if (null !== k2 && "object" === typeof k2 && "function" === typeof k2.then) {
          var l2 = k2, m2 = h, q2 = m2.tag;
          if (0 === (m2.mode & 1) && (0 === q2 || 11 === q2 || 15 === q2)) {
            var r2 = m2.alternate;
            r2 ? (m2.updateQueue = r2.updateQueue, m2.memoizedState = r2.memoizedState, m2.lanes = r2.lanes) : (m2.updateQueue = null, m2.memoizedState = null);
          }
          var y2 = Vi(g2);
          if (null !== y2) {
            y2.flags &= -257;
            Wi(y2, g2, h, f2, b);
            y2.mode & 1 && Ti(f2, l2, b);
            b = y2;
            k2 = l2;
            var n2 = b.updateQueue;
            if (null === n2) {
              var t2 = /* @__PURE__ */ new Set();
              t2.add(k2);
              b.updateQueue = t2;
            } else n2.add(k2);
            break a;
          } else {
            if (0 === (b & 1)) {
              Ti(f2, l2, b);
              uj();
              break a;
            }
            k2 = Error(p$1(426));
          }
        } else if (I && h.mode & 1) {
          var J2 = Vi(g2);
          if (null !== J2) {
            0 === (J2.flags & 65536) && (J2.flags |= 256);
            Wi(J2, g2, h, f2, b);
            Jg(Ki(k2, h));
            break a;
          }
        }
        f2 = k2 = Ki(k2, h);
        4 !== T && (T = 2);
        null === tk ? tk = [f2] : tk.push(f2);
        f2 = g2;
        do {
          switch (f2.tag) {
            case 3:
              f2.flags |= 65536;
              b &= -b;
              f2.lanes |= b;
              var x2 = Oi(f2, k2, b);
              fh(f2, x2);
              break a;
            case 1:
              h = k2;
              var w2 = f2.type, u2 = f2.stateNode;
              if (0 === (f2.flags & 128) && ("function" === typeof w2.getDerivedStateFromError || null !== u2 && "function" === typeof u2.componentDidCatch && (null === Si || !Si.has(u2)))) {
                f2.flags |= 65536;
                b &= -b;
                f2.lanes |= b;
                var F2 = Ri(f2, h, b);
                fh(f2, F2);
                break a;
              }
          }
          f2 = f2.return;
        } while (null !== f2);
      }
      Tk(c);
    } catch (na) {
      b = na;
      Y === c && null !== c && (Y = c = c.return);
      continue;
    }
    break;
  } while (1);
}
function Kk() {
  var a = nk.current;
  nk.current = ai;
  return null === a ? ai : a;
}
function uj() {
  if (0 === T || 3 === T || 2 === T) T = 4;
  null === R || 0 === (hh & 268435455) && 0 === (rk & 268435455) || Dk(R, Z);
}
function Jk(a, b) {
  var c = K;
  K |= 2;
  var d = Kk();
  if (R !== a || Z !== b) vk = null, Lk(a, b);
  do
    try {
      Uk();
      break;
    } catch (e) {
      Nk(a, e);
    }
  while (1);
  Qg();
  K = c;
  nk.current = d;
  if (null !== Y) throw Error(p$1(261));
  R = null;
  Z = 0;
  return T;
}
function Uk() {
  for (; null !== Y; ) Vk(Y);
}
function Mk() {
  for (; null !== Y && !cc(); ) Vk(Y);
}
function Vk(a) {
  var b = Wk(a.alternate, a, gj);
  a.memoizedProps = a.pendingProps;
  null === b ? Tk(a) : Y = b;
  ok.current = null;
}
function Tk(a) {
  var b = a;
  do {
    var c = b.alternate;
    a = b.return;
    if (0 === (b.flags & 32768)) {
      if (c = Fj(c, b, gj), null !== c) {
        Y = c;
        return;
      }
    } else {
      c = Jj(c, b);
      if (null !== c) {
        c.flags &= 32767;
        Y = c;
        return;
      }
      if (null !== a) a.flags |= 32768, a.subtreeFlags = 0, a.deletions = null;
      else {
        T = 6;
        Y = null;
        return;
      }
    }
    b = b.sibling;
    if (null !== b) {
      Y = b;
      return;
    }
    Y = b = a;
  } while (null !== b);
  0 === T && (T = 5);
}
function Qk(a, b, c) {
  var d = C, e = pk.transition;
  try {
    pk.transition = null, C = 1, Xk(a, b, c, d);
  } finally {
    pk.transition = e, C = d;
  }
  return null;
}
function Xk(a, b, c, d) {
  do
    Ik();
  while (null !== xk);
  if (0 !== (K & 6)) throw Error(p$1(327));
  c = a.finishedWork;
  var e = a.finishedLanes;
  if (null === c) return null;
  a.finishedWork = null;
  a.finishedLanes = 0;
  if (c === a.current) throw Error(p$1(177));
  a.callbackNode = null;
  a.callbackPriority = 0;
  var f2 = c.lanes | c.childLanes;
  Bc(a, f2);
  a === R && (Y = R = null, Z = 0);
  0 === (c.subtreeFlags & 2064) && 0 === (c.flags & 2064) || wk || (wk = true, Gk(hc, function() {
    Ik();
    return null;
  }));
  f2 = 0 !== (c.flags & 15990);
  if (0 !== (c.subtreeFlags & 15990) || f2) {
    f2 = pk.transition;
    pk.transition = null;
    var g2 = C;
    C = 1;
    var h = K;
    K |= 4;
    ok.current = null;
    Pj(a, c);
    ek(c, a);
    Oe(Df);
    dd = !!Cf;
    Df = Cf = null;
    a.current = c;
    ik(c);
    dc();
    K = h;
    C = g2;
    pk.transition = f2;
  } else a.current = c;
  wk && (wk = false, xk = a, yk = e);
  f2 = a.pendingLanes;
  0 === f2 && (Si = null);
  mc(c.stateNode);
  Ek(a, B());
  if (null !== b) for (d = a.onRecoverableError, c = 0; c < b.length; c++) e = b[c], d(e.value, { componentStack: e.stack, digest: e.digest });
  if (Pi) throw Pi = false, a = Qi, Qi = null, a;
  0 !== (yk & 1) && 0 !== a.tag && Ik();
  f2 = a.pendingLanes;
  0 !== (f2 & 1) ? a === Ak ? zk++ : (zk = 0, Ak = a) : zk = 0;
  jg();
  return null;
}
function Ik() {
  if (null !== xk) {
    var a = Dc(yk), b = pk.transition, c = C;
    try {
      pk.transition = null;
      C = 16 > a ? 16 : a;
      if (null === xk) var d = false;
      else {
        a = xk;
        xk = null;
        yk = 0;
        if (0 !== (K & 6)) throw Error(p$1(331));
        var e = K;
        K |= 4;
        for (V = a.current; null !== V; ) {
          var f2 = V, g2 = f2.child;
          if (0 !== (V.flags & 16)) {
            var h = f2.deletions;
            if (null !== h) {
              for (var k2 = 0; k2 < h.length; k2++) {
                var l2 = h[k2];
                for (V = l2; null !== V; ) {
                  var m2 = V;
                  switch (m2.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Qj(8, m2, f2);
                  }
                  var q2 = m2.child;
                  if (null !== q2) q2.return = m2, V = q2;
                  else for (; null !== V; ) {
                    m2 = V;
                    var r2 = m2.sibling, y2 = m2.return;
                    Tj(m2);
                    if (m2 === l2) {
                      V = null;
                      break;
                    }
                    if (null !== r2) {
                      r2.return = y2;
                      V = r2;
                      break;
                    }
                    V = y2;
                  }
                }
              }
              var n2 = f2.alternate;
              if (null !== n2) {
                var t2 = n2.child;
                if (null !== t2) {
                  n2.child = null;
                  do {
                    var J2 = t2.sibling;
                    t2.sibling = null;
                    t2 = J2;
                  } while (null !== t2);
                }
              }
              V = f2;
            }
          }
          if (0 !== (f2.subtreeFlags & 2064) && null !== g2) g2.return = f2, V = g2;
          else b: for (; null !== V; ) {
            f2 = V;
            if (0 !== (f2.flags & 2048)) switch (f2.tag) {
              case 0:
              case 11:
              case 15:
                Qj(9, f2, f2.return);
            }
            var x2 = f2.sibling;
            if (null !== x2) {
              x2.return = f2.return;
              V = x2;
              break b;
            }
            V = f2.return;
          }
        }
        var w2 = a.current;
        for (V = w2; null !== V; ) {
          g2 = V;
          var u2 = g2.child;
          if (0 !== (g2.subtreeFlags & 2064) && null !== u2) u2.return = g2, V = u2;
          else b: for (g2 = w2; null !== V; ) {
            h = V;
            if (0 !== (h.flags & 2048)) try {
              switch (h.tag) {
                case 0:
                case 11:
                case 15:
                  Rj(9, h);
              }
            } catch (na) {
              W(h, h.return, na);
            }
            if (h === g2) {
              V = null;
              break b;
            }
            var F2 = h.sibling;
            if (null !== F2) {
              F2.return = h.return;
              V = F2;
              break b;
            }
            V = h.return;
          }
        }
        K = e;
        jg();
        if (lc && "function" === typeof lc.onPostCommitFiberRoot) try {
          lc.onPostCommitFiberRoot(kc, a);
        } catch (na) {
        }
        d = true;
      }
      return d;
    } finally {
      C = c, pk.transition = b;
    }
  }
  return false;
}
function Yk(a, b, c) {
  b = Ki(c, b);
  b = Oi(a, b, 1);
  a = dh(a, b, 1);
  b = L();
  null !== a && (Ac(a, 1, b), Ek(a, b));
}
function W(a, b, c) {
  if (3 === a.tag) Yk(a, a, c);
  else for (; null !== b; ) {
    if (3 === b.tag) {
      Yk(b, a, c);
      break;
    } else if (1 === b.tag) {
      var d = b.stateNode;
      if ("function" === typeof b.type.getDerivedStateFromError || "function" === typeof d.componentDidCatch && (null === Si || !Si.has(d))) {
        a = Ki(c, a);
        a = Ri(b, a, 1);
        b = dh(b, a, 1);
        a = L();
        null !== b && (Ac(b, 1, a), Ek(b, a));
        break;
      }
    }
    b = b.return;
  }
}
function Ui(a, b, c) {
  var d = a.pingCache;
  null !== d && d.delete(b);
  b = L();
  a.pingedLanes |= a.suspendedLanes & c;
  R === a && (Z & c) === c && (4 === T || 3 === T && (Z & 130023424) === Z && 500 > B() - gk ? Lk(a, 0) : sk |= c);
  Ek(a, b);
}
function Zk(a, b) {
  0 === b && (0 === (a.mode & 1) ? b = 1 : (b = sc, sc <<= 1, 0 === (sc & 130023424) && (sc = 4194304)));
  var c = L();
  a = Zg(a, b);
  null !== a && (Ac(a, b, c), Ek(a, c));
}
function vj(a) {
  var b = a.memoizedState, c = 0;
  null !== b && (c = b.retryLane);
  Zk(a, c);
}
function ck(a, b) {
  var c = 0;
  switch (a.tag) {
    case 13:
      var d = a.stateNode;
      var e = a.memoizedState;
      null !== e && (c = e.retryLane);
      break;
    case 19:
      d = a.stateNode;
      break;
    default:
      throw Error(p$1(314));
  }
  null !== d && d.delete(b);
  Zk(a, c);
}
var Wk;
Wk = function(a, b, c) {
  if (null !== a) if (a.memoizedProps !== b.pendingProps || Wf.current) Ug = true;
  else {
    if (0 === (a.lanes & c) && 0 === (b.flags & 128)) return Ug = false, zj(a, b, c);
    Ug = 0 !== (a.flags & 131072) ? true : false;
  }
  else Ug = false, I && 0 !== (b.flags & 1048576) && ug(b, ng, b.index);
  b.lanes = 0;
  switch (b.tag) {
    case 2:
      var d = b.type;
      jj(a, b);
      a = b.pendingProps;
      var e = Yf(b, H.current);
      Tg(b, c);
      e = Xh(null, b, d, a, e, c);
      var f2 = bi();
      b.flags |= 1;
      "object" === typeof e && null !== e && "function" === typeof e.render && void 0 === e.$$typeof ? (b.tag = 1, b.memoizedState = null, b.updateQueue = null, Zf(d) ? (f2 = true, cg(b)) : f2 = false, b.memoizedState = null !== e.state && void 0 !== e.state ? e.state : null, ah(b), e.updater = nh, b.stateNode = e, e._reactInternals = b, rh(b, d, a, c), b = kj(null, b, d, true, f2, c)) : (b.tag = 0, I && f2 && vg(b), Yi(null, b, e, c), b = b.child);
      return b;
    case 16:
      d = b.elementType;
      a: {
        jj(a, b);
        a = b.pendingProps;
        e = d._init;
        d = e(d._payload);
        b.type = d;
        e = b.tag = $k(d);
        a = Lg(d, a);
        switch (e) {
          case 0:
            b = dj(null, b, d, a, c);
            break a;
          case 1:
            b = ij(null, b, d, a, c);
            break a;
          case 11:
            b = Zi(null, b, d, a, c);
            break a;
          case 14:
            b = aj(null, b, d, Lg(d.type, a), c);
            break a;
        }
        throw Error(p$1(
          306,
          d,
          ""
        ));
      }
      return b;
    case 0:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Lg(d, e), dj(a, b, d, e, c);
    case 1:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Lg(d, e), ij(a, b, d, e, c);
    case 3:
      a: {
        lj(b);
        if (null === a) throw Error(p$1(387));
        d = b.pendingProps;
        f2 = b.memoizedState;
        e = f2.element;
        bh(a, b);
        gh(b, d, null, c);
        var g2 = b.memoizedState;
        d = g2.element;
        if (f2.isDehydrated) if (f2 = { element: d, isDehydrated: false, cache: g2.cache, pendingSuspenseBoundaries: g2.pendingSuspenseBoundaries, transitions: g2.transitions }, b.updateQueue.baseState = f2, b.memoizedState = f2, b.flags & 256) {
          e = Ki(Error(p$1(423)), b);
          b = mj(a, b, d, c, e);
          break a;
        } else if (d !== e) {
          e = Ki(Error(p$1(424)), b);
          b = mj(a, b, d, c, e);
          break a;
        } else for (yg = Lf(b.stateNode.containerInfo.firstChild), xg = b, I = true, zg = null, c = Ch(b, null, d, c), b.child = c; c; ) c.flags = c.flags & -3 | 4096, c = c.sibling;
        else {
          Ig();
          if (d === e) {
            b = $i(a, b, c);
            break a;
          }
          Yi(a, b, d, c);
        }
        b = b.child;
      }
      return b;
    case 5:
      return Kh(b), null === a && Eg(b), d = b.type, e = b.pendingProps, f2 = null !== a ? a.memoizedProps : null, g2 = e.children, Ef(d, e) ? g2 = null : null !== f2 && Ef(d, f2) && (b.flags |= 32), hj(a, b), Yi(a, b, g2, c), b.child;
    case 6:
      return null === a && Eg(b), null;
    case 13:
      return pj(a, b, c);
    case 4:
      return Ih(b, b.stateNode.containerInfo), d = b.pendingProps, null === a ? b.child = Bh(b, null, d, c) : Yi(a, b, d, c), b.child;
    case 11:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Lg(d, e), Zi(a, b, d, e, c);
    case 7:
      return Yi(a, b, b.pendingProps, c), b.child;
    case 8:
      return Yi(a, b, b.pendingProps.children, c), b.child;
    case 12:
      return Yi(a, b, b.pendingProps.children, c), b.child;
    case 10:
      a: {
        d = b.type._context;
        e = b.pendingProps;
        f2 = b.memoizedProps;
        g2 = e.value;
        G(Mg, d._currentValue);
        d._currentValue = g2;
        if (null !== f2) if (He(f2.value, g2)) {
          if (f2.children === e.children && !Wf.current) {
            b = $i(a, b, c);
            break a;
          }
        } else for (f2 = b.child, null !== f2 && (f2.return = b); null !== f2; ) {
          var h = f2.dependencies;
          if (null !== h) {
            g2 = f2.child;
            for (var k2 = h.firstContext; null !== k2; ) {
              if (k2.context === d) {
                if (1 === f2.tag) {
                  k2 = ch(-1, c & -c);
                  k2.tag = 2;
                  var l2 = f2.updateQueue;
                  if (null !== l2) {
                    l2 = l2.shared;
                    var m2 = l2.pending;
                    null === m2 ? k2.next = k2 : (k2.next = m2.next, m2.next = k2);
                    l2.pending = k2;
                  }
                }
                f2.lanes |= c;
                k2 = f2.alternate;
                null !== k2 && (k2.lanes |= c);
                Sg(
                  f2.return,
                  c,
                  b
                );
                h.lanes |= c;
                break;
              }
              k2 = k2.next;
            }
          } else if (10 === f2.tag) g2 = f2.type === b.type ? null : f2.child;
          else if (18 === f2.tag) {
            g2 = f2.return;
            if (null === g2) throw Error(p$1(341));
            g2.lanes |= c;
            h = g2.alternate;
            null !== h && (h.lanes |= c);
            Sg(g2, c, b);
            g2 = f2.sibling;
          } else g2 = f2.child;
          if (null !== g2) g2.return = f2;
          else for (g2 = f2; null !== g2; ) {
            if (g2 === b) {
              g2 = null;
              break;
            }
            f2 = g2.sibling;
            if (null !== f2) {
              f2.return = g2.return;
              g2 = f2;
              break;
            }
            g2 = g2.return;
          }
          f2 = g2;
        }
        Yi(a, b, e.children, c);
        b = b.child;
      }
      return b;
    case 9:
      return e = b.type, d = b.pendingProps.children, Tg(b, c), e = Vg(e), d = d(e), b.flags |= 1, Yi(a, b, d, c), b.child;
    case 14:
      return d = b.type, e = Lg(d, b.pendingProps), e = Lg(d.type, e), aj(a, b, d, e, c);
    case 15:
      return cj(a, b, b.type, b.pendingProps, c);
    case 17:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Lg(d, e), jj(a, b), b.tag = 1, Zf(d) ? (a = true, cg(b)) : a = false, Tg(b, c), ph(b, d, e), rh(b, d, e, c), kj(null, b, d, true, a, c);
    case 19:
      return yj(a, b, c);
    case 22:
      return ej(a, b, c);
  }
  throw Error(p$1(156, b.tag));
};
function Gk(a, b) {
  return ac(a, b);
}
function al(a, b, c, d) {
  this.tag = a;
  this.key = c;
  this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
  this.index = 0;
  this.ref = null;
  this.pendingProps = b;
  this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
  this.mode = d;
  this.subtreeFlags = this.flags = 0;
  this.deletions = null;
  this.childLanes = this.lanes = 0;
  this.alternate = null;
}
function Bg(a, b, c, d) {
  return new al(a, b, c, d);
}
function bj(a) {
  a = a.prototype;
  return !(!a || !a.isReactComponent);
}
function $k(a) {
  if ("function" === typeof a) return bj(a) ? 1 : 0;
  if (void 0 !== a && null !== a) {
    a = a.$$typeof;
    if (a === Da) return 11;
    if (a === Ga) return 14;
  }
  return 2;
}
function wh(a, b) {
  var c = a.alternate;
  null === c ? (c = Bg(a.tag, b, a.key, a.mode), c.elementType = a.elementType, c.type = a.type, c.stateNode = a.stateNode, c.alternate = a, a.alternate = c) : (c.pendingProps = b, c.type = a.type, c.flags = 0, c.subtreeFlags = 0, c.deletions = null);
  c.flags = a.flags & 14680064;
  c.childLanes = a.childLanes;
  c.lanes = a.lanes;
  c.child = a.child;
  c.memoizedProps = a.memoizedProps;
  c.memoizedState = a.memoizedState;
  c.updateQueue = a.updateQueue;
  b = a.dependencies;
  c.dependencies = null === b ? null : { lanes: b.lanes, firstContext: b.firstContext };
  c.sibling = a.sibling;
  c.index = a.index;
  c.ref = a.ref;
  return c;
}
function yh(a, b, c, d, e, f2) {
  var g2 = 2;
  d = a;
  if ("function" === typeof a) bj(a) && (g2 = 1);
  else if ("string" === typeof a) g2 = 5;
  else a: switch (a) {
    case ya:
      return Ah(c.children, e, f2, b);
    case za:
      g2 = 8;
      e |= 8;
      break;
    case Aa:
      return a = Bg(12, c, b, e | 2), a.elementType = Aa, a.lanes = f2, a;
    case Ea:
      return a = Bg(13, c, b, e), a.elementType = Ea, a.lanes = f2, a;
    case Fa:
      return a = Bg(19, c, b, e), a.elementType = Fa, a.lanes = f2, a;
    case Ia:
      return qj(c, e, f2, b);
    default:
      if ("object" === typeof a && null !== a) switch (a.$$typeof) {
        case Ba:
          g2 = 10;
          break a;
        case Ca:
          g2 = 9;
          break a;
        case Da:
          g2 = 11;
          break a;
        case Ga:
          g2 = 14;
          break a;
        case Ha:
          g2 = 16;
          d = null;
          break a;
      }
      throw Error(p$1(130, null == a ? a : typeof a, ""));
  }
  b = Bg(g2, c, b, e);
  b.elementType = a;
  b.type = d;
  b.lanes = f2;
  return b;
}
function Ah(a, b, c, d) {
  a = Bg(7, a, d, b);
  a.lanes = c;
  return a;
}
function qj(a, b, c, d) {
  a = Bg(22, a, d, b);
  a.elementType = Ia;
  a.lanes = c;
  a.stateNode = { isHidden: false };
  return a;
}
function xh(a, b, c) {
  a = Bg(6, a, null, b);
  a.lanes = c;
  return a;
}
function zh(a, b, c) {
  b = Bg(4, null !== a.children ? a.children : [], a.key, b);
  b.lanes = c;
  b.stateNode = { containerInfo: a.containerInfo, pendingChildren: null, implementation: a.implementation };
  return b;
}
function bl(a, b, c, d, e) {
  this.tag = b;
  this.containerInfo = a;
  this.finishedWork = this.pingCache = this.current = this.pendingChildren = null;
  this.timeoutHandle = -1;
  this.callbackNode = this.pendingContext = this.context = null;
  this.callbackPriority = 0;
  this.eventTimes = zc(0);
  this.expirationTimes = zc(-1);
  this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
  this.entanglements = zc(0);
  this.identifierPrefix = d;
  this.onRecoverableError = e;
  this.mutableSourceEagerHydrationData = null;
}
function cl(a, b, c, d, e, f2, g2, h, k2) {
  a = new bl(a, b, c, h, k2);
  1 === b ? (b = 1, true === f2 && (b |= 8)) : b = 0;
  f2 = Bg(3, null, null, b);
  a.current = f2;
  f2.stateNode = a;
  f2.memoizedState = { element: d, isDehydrated: c, cache: null, transitions: null, pendingSuspenseBoundaries: null };
  ah(f2);
  return a;
}
function dl(a, b, c) {
  var d = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
  return { $$typeof: wa, key: null == d ? null : "" + d, children: a, containerInfo: b, implementation: c };
}
function el(a) {
  if (!a) return Vf;
  a = a._reactInternals;
  a: {
    if (Vb(a) !== a || 1 !== a.tag) throw Error(p$1(170));
    var b = a;
    do {
      switch (b.tag) {
        case 3:
          b = b.stateNode.context;
          break a;
        case 1:
          if (Zf(b.type)) {
            b = b.stateNode.__reactInternalMemoizedMergedChildContext;
            break a;
          }
      }
      b = b.return;
    } while (null !== b);
    throw Error(p$1(171));
  }
  if (1 === a.tag) {
    var c = a.type;
    if (Zf(c)) return bg(a, c, b);
  }
  return b;
}
function fl(a, b, c, d, e, f2, g2, h, k2) {
  a = cl(c, d, true, a, e, f2, g2, h, k2);
  a.context = el(null);
  c = a.current;
  d = L();
  e = lh(c);
  f2 = ch(d, e);
  f2.callback = void 0 !== b && null !== b ? b : null;
  dh(c, f2, e);
  a.current.lanes = e;
  Ac(a, e, d);
  Ek(a, d);
  return a;
}
function gl(a, b, c, d) {
  var e = b.current, f2 = L(), g2 = lh(e);
  c = el(c);
  null === b.context ? b.context = c : b.pendingContext = c;
  b = ch(f2, g2);
  b.payload = { element: a };
  d = void 0 === d ? null : d;
  null !== d && (b.callback = d);
  a = dh(e, b, g2);
  null !== a && (mh(a, e, g2, f2), eh(a, e, g2));
  return g2;
}
function hl(a) {
  a = a.current;
  if (!a.child) return null;
  switch (a.child.tag) {
    case 5:
      return a.child.stateNode;
    default:
      return a.child.stateNode;
  }
}
function il(a, b) {
  a = a.memoizedState;
  if (null !== a && null !== a.dehydrated) {
    var c = a.retryLane;
    a.retryLane = 0 !== c && c < b ? c : b;
  }
}
function jl(a, b) {
  il(a, b);
  (a = a.alternate) && il(a, b);
}
function kl() {
  return null;
}
var ll = "function" === typeof reportError ? reportError : function(a) {
  console.error(a);
};
function ml(a) {
  this._internalRoot = a;
}
nl.prototype.render = ml.prototype.render = function(a) {
  var b = this._internalRoot;
  if (null === b) throw Error(p$1(409));
  gl(a, b, null, null);
};
nl.prototype.unmount = ml.prototype.unmount = function() {
  var a = this._internalRoot;
  if (null !== a) {
    this._internalRoot = null;
    var b = a.containerInfo;
    Sk(function() {
      gl(null, a, null, null);
    });
    b[uf] = null;
  }
};
function nl(a) {
  this._internalRoot = a;
}
nl.prototype.unstable_scheduleHydration = function(a) {
  if (a) {
    var b = Hc();
    a = { blockedOn: null, target: a, priority: b };
    for (var c = 0; c < Qc.length && 0 !== b && b < Qc[c].priority; c++) ;
    Qc.splice(c, 0, a);
    0 === c && Vc(a);
  }
};
function ol(a) {
  return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType);
}
function pl(a) {
  return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType && (8 !== a.nodeType || " react-mount-point-unstable " !== a.nodeValue));
}
function ql() {
}
function rl(a, b, c, d, e) {
  if (e) {
    if ("function" === typeof d) {
      var f2 = d;
      d = function() {
        var a2 = hl(g2);
        f2.call(a2);
      };
    }
    var g2 = fl(b, d, a, 0, null, false, false, "", ql);
    a._reactRootContainer = g2;
    a[uf] = g2.current;
    sf(8 === a.nodeType ? a.parentNode : a);
    Sk();
    return g2;
  }
  for (; e = a.lastChild; ) a.removeChild(e);
  if ("function" === typeof d) {
    var h = d;
    d = function() {
      var a2 = hl(k2);
      h.call(a2);
    };
  }
  var k2 = cl(a, 0, false, null, null, false, false, "", ql);
  a._reactRootContainer = k2;
  a[uf] = k2.current;
  sf(8 === a.nodeType ? a.parentNode : a);
  Sk(function() {
    gl(b, k2, c, d);
  });
  return k2;
}
function sl(a, b, c, d, e) {
  var f2 = c._reactRootContainer;
  if (f2) {
    var g2 = f2;
    if ("function" === typeof e) {
      var h = e;
      e = function() {
        var a2 = hl(g2);
        h.call(a2);
      };
    }
    gl(b, g2, a, e);
  } else g2 = rl(c, b, a, e, d);
  return hl(g2);
}
Ec = function(a) {
  switch (a.tag) {
    case 3:
      var b = a.stateNode;
      if (b.current.memoizedState.isDehydrated) {
        var c = tc(b.pendingLanes);
        0 !== c && (Cc(b, c | 1), Ek(b, B()), 0 === (K & 6) && (Hj = B() + 500, jg()));
      }
      break;
    case 13:
      Sk(function() {
        var b2 = Zg(a, 1);
        if (null !== b2) {
          var c2 = L();
          mh(b2, a, 1, c2);
        }
      }), jl(a, 1);
  }
};
Fc = function(a) {
  if (13 === a.tag) {
    var b = Zg(a, 134217728);
    if (null !== b) {
      var c = L();
      mh(b, a, 134217728, c);
    }
    jl(a, 134217728);
  }
};
Gc = function(a) {
  if (13 === a.tag) {
    var b = lh(a), c = Zg(a, b);
    if (null !== c) {
      var d = L();
      mh(c, a, b, d);
    }
    jl(a, b);
  }
};
Hc = function() {
  return C;
};
Ic = function(a, b) {
  var c = C;
  try {
    return C = a, b();
  } finally {
    C = c;
  }
};
yb = function(a, b, c) {
  switch (b) {
    case "input":
      bb(a, c);
      b = c.name;
      if ("radio" === c.type && null != b) {
        for (c = a; c.parentNode; ) c = c.parentNode;
        c = c.querySelectorAll("input[name=" + JSON.stringify("" + b) + '][type="radio"]');
        for (b = 0; b < c.length; b++) {
          var d = c[b];
          if (d !== a && d.form === a.form) {
            var e = Db(d);
            if (!e) throw Error(p$1(90));
            Wa(d);
            bb(d, e);
          }
        }
      }
      break;
    case "textarea":
      ib(a, c);
      break;
    case "select":
      b = c.value, null != b && fb(a, !!c.multiple, b, false);
  }
};
Gb = Rk;
Hb = Sk;
var tl = { usingClientEntryPoint: false, Events: [Cb, ue, Db, Eb, Fb, Rk] }, ul = { findFiberByHostInstance: Wc, bundleType: 0, version: "18.2.0", rendererPackageName: "react-dom" };
var vl = { bundleType: ul.bundleType, version: ul.version, rendererPackageName: ul.rendererPackageName, rendererConfig: ul.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ua.ReactCurrentDispatcher, findHostInstanceByFiber: function(a) {
  a = Zb(a);
  return null === a ? null : a.stateNode;
}, findFiberByHostInstance: ul.findFiberByHostInstance || kl, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.2.0-next-9e3b772b8-20220608" };
if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
  var wl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!wl.isDisabled && wl.supportsFiber) try {
    kc = wl.inject(vl), lc = wl;
  } catch (a) {
  }
}
reactDom_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = tl;
reactDom_production_min.createPortal = function(a, b) {
  var c = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
  if (!ol(b)) throw Error(p$1(200));
  return dl(a, b, null, c);
};
reactDom_production_min.createRoot = function(a, b) {
  if (!ol(a)) throw Error(p$1(299));
  var c = false, d = "", e = ll;
  null !== b && void 0 !== b && (true === b.unstable_strictMode && (c = true), void 0 !== b.identifierPrefix && (d = b.identifierPrefix), void 0 !== b.onRecoverableError && (e = b.onRecoverableError));
  b = cl(a, 1, false, null, null, c, false, d, e);
  a[uf] = b.current;
  sf(8 === a.nodeType ? a.parentNode : a);
  return new ml(b);
};
reactDom_production_min.findDOMNode = function(a) {
  if (null == a) return null;
  if (1 === a.nodeType) return a;
  var b = a._reactInternals;
  if (void 0 === b) {
    if ("function" === typeof a.render) throw Error(p$1(188));
    a = Object.keys(a).join(",");
    throw Error(p$1(268, a));
  }
  a = Zb(b);
  a = null === a ? null : a.stateNode;
  return a;
};
reactDom_production_min.flushSync = function(a) {
  return Sk(a);
};
reactDom_production_min.hydrate = function(a, b, c) {
  if (!pl(b)) throw Error(p$1(200));
  return sl(null, a, b, true, c);
};
reactDom_production_min.hydrateRoot = function(a, b, c) {
  if (!ol(a)) throw Error(p$1(405));
  var d = null != c && c.hydratedSources || null, e = false, f2 = "", g2 = ll;
  null !== c && void 0 !== c && (true === c.unstable_strictMode && (e = true), void 0 !== c.identifierPrefix && (f2 = c.identifierPrefix), void 0 !== c.onRecoverableError && (g2 = c.onRecoverableError));
  b = fl(b, null, a, 1, null != c ? c : null, e, false, f2, g2);
  a[uf] = b.current;
  sf(a);
  if (d) for (a = 0; a < d.length; a++) c = d[a], e = c._getVersion, e = e(c._source), null == b.mutableSourceEagerHydrationData ? b.mutableSourceEagerHydrationData = [c, e] : b.mutableSourceEagerHydrationData.push(
    c,
    e
  );
  return new nl(b);
};
reactDom_production_min.render = function(a, b, c) {
  if (!pl(b)) throw Error(p$1(200));
  return sl(null, a, b, false, c);
};
reactDom_production_min.unmountComponentAtNode = function(a) {
  if (!pl(a)) throw Error(p$1(40));
  return a._reactRootContainer ? (Sk(function() {
    sl(null, null, a, false, function() {
      a._reactRootContainer = null;
      a[uf] = null;
    });
  }), true) : false;
};
reactDom_production_min.unstable_batchedUpdates = Rk;
reactDom_production_min.unstable_renderSubtreeIntoContainer = function(a, b, c, d) {
  if (!pl(c)) throw Error(p$1(200));
  if (null == a || void 0 === a._reactInternals) throw Error(p$1(38));
  return sl(a, b, c, false, d);
};
reactDom_production_min.version = "18.2.0-next-9e3b772b8-20220608";
function checkDCE() {
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
    return;
  }
  try {
    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
  } catch (err) {
    console.error(err);
  }
}
{
  checkDCE();
  reactDom.exports = reactDom_production_min;
}
var reactDomExports = reactDom.exports;
const ReactDOM = /* @__PURE__ */ getDefaultExportFromCjs(reactDomExports);
var createRoot;
var m = reactDomExports;
{
  createRoot = m.createRoot;
  m.hydrateRoot;
}
var withSelector = { exports: {} };
var useSyncExternalStoreWithSelector_production_min = {};
/**
 * @license React
 * use-sync-external-store-with-selector.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var g = reactExports;
function n$1(a, b) {
  return a === b && (0 !== a || 1 / a === 1 / b) || a !== a && b !== b;
}
var p = "function" === typeof Object.is ? Object.is : n$1, q = g.useSyncExternalStore, r = g.useRef, t = g.useEffect, u = g.useMemo, v = g.useDebugValue;
useSyncExternalStoreWithSelector_production_min.useSyncExternalStoreWithSelector = function(a, b, e, l2, h) {
  var c = r(null);
  if (null === c.current) {
    var f2 = { hasValue: false, value: null };
    c.current = f2;
  } else f2 = c.current;
  c = u(function() {
    function a2(a3) {
      if (!c2) {
        c2 = true;
        d2 = a3;
        a3 = l2(a3);
        if (void 0 !== h && f2.hasValue) {
          var b2 = f2.value;
          if (h(b2, a3)) return k2 = b2;
        }
        return k2 = a3;
      }
      b2 = k2;
      if (p(d2, a3)) return b2;
      var e2 = l2(a3);
      if (void 0 !== h && h(b2, e2)) return b2;
      d2 = a3;
      return k2 = e2;
    }
    var c2 = false, d2, k2, m2 = void 0 === e ? null : e;
    return [function() {
      return a2(b());
    }, null === m2 ? void 0 : function() {
      return a2(m2());
    }];
  }, [b, e, l2, h]);
  var d = q(a, c[0], c[1]);
  t(function() {
    f2.hasValue = true;
    f2.value = d;
  }, [d]);
  v(d);
  return d;
};
{
  withSelector.exports = useSyncExternalStoreWithSelector_production_min;
}
var withSelectorExports = withSelector.exports;
var React = (
  // prettier-ignore
  // @ts-ignore
  "default" in React$2 ? React$1 : React$2
);
var ContextKey = Symbol.for(`react-redux-context`);
var gT = typeof globalThis !== "undefined" ? globalThis : (
  /* fall back to a per-module scope (pre-8.1 behaviour) if `globalThis` is not available */
  {}
);
function getContext() {
  if (!React.createContext)
    return {};
  const contextMap = gT[ContextKey] ?? (gT[ContextKey] = /* @__PURE__ */ new Map());
  let realContext = contextMap.get(React.createContext);
  if (!realContext) {
    realContext = React.createContext(
      null
    );
    contextMap.set(React.createContext, realContext);
  }
  return realContext;
}
var ReactReduxContext = /* @__PURE__ */ getContext();
var notInitialized = () => {
  throw new Error("uSES not initialized!");
};
function createReduxContextHook(context = ReactReduxContext) {
  return function useReduxContext2() {
    const contextValue = React.useContext(context);
    return contextValue;
  };
}
var useReduxContext = /* @__PURE__ */ createReduxContextHook();
var useSyncExternalStoreWithSelector = notInitialized;
var initializeUseSelector = (fn) => {
  useSyncExternalStoreWithSelector = fn;
};
var refEquality = (a, b) => a === b;
function createSelectorHook(context = ReactReduxContext) {
  const useReduxContext2 = context === ReactReduxContext ? useReduxContext : createReduxContextHook(context);
  const useSelector2 = (selector, equalityFnOrOptions = {}) => {
    const { equalityFn = refEquality, devModeChecks = {} } = typeof equalityFnOrOptions === "function" ? { equalityFn: equalityFnOrOptions } : equalityFnOrOptions;
    const {
      store: store2,
      subscription,
      getServerState,
      stabilityCheck,
      identityFunctionCheck
    } = useReduxContext2();
    React.useRef(true);
    const wrappedSelector = React.useCallback(
      {
        [selector.name](state) {
          const selected = selector(state);
          return selected;
        }
      }[selector.name],
      [selector, stabilityCheck, devModeChecks.stabilityCheck]
    );
    const selectedState = useSyncExternalStoreWithSelector(
      subscription.addNestedSub,
      store2.getState,
      getServerState || store2.getState,
      wrappedSelector,
      equalityFn
    );
    React.useDebugValue(selectedState);
    return selectedState;
  };
  Object.assign(useSelector2, {
    withTypes: () => useSelector2
  });
  return useSelector2;
}
var useSelector = /* @__PURE__ */ createSelectorHook();
function defaultNoopBatch(callback) {
  callback();
}
function createListenerCollection() {
  let first = null;
  let last = null;
  return {
    clear() {
      first = null;
      last = null;
    },
    notify() {
      defaultNoopBatch(() => {
        let listener = first;
        while (listener) {
          listener.callback();
          listener = listener.next;
        }
      });
    },
    get() {
      const listeners = [];
      let listener = first;
      while (listener) {
        listeners.push(listener);
        listener = listener.next;
      }
      return listeners;
    },
    subscribe(callback) {
      let isSubscribed = true;
      const listener = last = {
        callback,
        next: null,
        prev: last
      };
      if (listener.prev) {
        listener.prev.next = listener;
      } else {
        first = listener;
      }
      return function unsubscribe() {
        if (!isSubscribed || first === null)
          return;
        isSubscribed = false;
        if (listener.next) {
          listener.next.prev = listener.prev;
        } else {
          last = listener.prev;
        }
        if (listener.prev) {
          listener.prev.next = listener.next;
        } else {
          first = listener.next;
        }
      };
    }
  };
}
var nullListeners = {
  notify() {
  },
  get: () => []
};
function createSubscription(store2, parentSub) {
  let unsubscribe;
  let listeners = nullListeners;
  let subscriptionsAmount = 0;
  let selfSubscribed = false;
  function addNestedSub(listener) {
    trySubscribe();
    const cleanupListener = listeners.subscribe(listener);
    let removed = false;
    return () => {
      if (!removed) {
        removed = true;
        cleanupListener();
        tryUnsubscribe();
      }
    };
  }
  function notifyNestedSubs() {
    listeners.notify();
  }
  function handleChangeWrapper() {
    if (subscription.onStateChange) {
      subscription.onStateChange();
    }
  }
  function isSubscribed() {
    return selfSubscribed;
  }
  function trySubscribe() {
    subscriptionsAmount++;
    if (!unsubscribe) {
      unsubscribe = store2.subscribe(handleChangeWrapper);
      listeners = createListenerCollection();
    }
  }
  function tryUnsubscribe() {
    subscriptionsAmount--;
    if (unsubscribe && subscriptionsAmount === 0) {
      unsubscribe();
      unsubscribe = void 0;
      listeners.clear();
      listeners = nullListeners;
    }
  }
  function trySubscribeSelf() {
    if (!selfSubscribed) {
      selfSubscribed = true;
      trySubscribe();
    }
  }
  function tryUnsubscribeSelf() {
    if (selfSubscribed) {
      selfSubscribed = false;
      tryUnsubscribe();
    }
  }
  const subscription = {
    addNestedSub,
    notifyNestedSubs,
    handleChangeWrapper,
    isSubscribed,
    trySubscribe: trySubscribeSelf,
    tryUnsubscribe: tryUnsubscribeSelf,
    getListeners: () => listeners
  };
  return subscription;
}
var canUseDOM = !!(typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined");
var useIsomorphicLayoutEffect$1 = canUseDOM ? React.useLayoutEffect : React.useEffect;
function Provider({
  store: store2,
  context,
  children,
  serverState,
  stabilityCheck = "once",
  identityFunctionCheck = "once"
}) {
  const contextValue = React.useMemo(() => {
    const subscription = createSubscription(store2);
    return {
      store: store2,
      subscription,
      getServerState: serverState ? () => serverState : void 0,
      stabilityCheck,
      identityFunctionCheck
    };
  }, [store2, serverState, stabilityCheck, identityFunctionCheck]);
  const previousState = React.useMemo(() => store2.getState(), [store2]);
  useIsomorphicLayoutEffect$1(() => {
    const { subscription } = contextValue;
    subscription.onStateChange = subscription.notifyNestedSubs;
    subscription.trySubscribe();
    if (previousState !== store2.getState()) {
      subscription.notifyNestedSubs();
    }
    return () => {
      subscription.tryUnsubscribe();
      subscription.onStateChange = void 0;
    };
  }, [contextValue, previousState]);
  const Context = context || ReactReduxContext;
  return /* @__PURE__ */ React.createElement(Context.Provider, { value: contextValue }, children);
}
var Provider_default = Provider;
function createStoreHook(context = ReactReduxContext) {
  const useReduxContext2 = context === ReactReduxContext ? useReduxContext : (
    // @ts-ignore
    createReduxContextHook(context)
  );
  const useStore2 = () => {
    const { store: store2 } = useReduxContext2();
    return store2;
  };
  Object.assign(useStore2, {
    withTypes: () => useStore2
  });
  return useStore2;
}
var useStore = /* @__PURE__ */ createStoreHook();
function createDispatchHook(context = ReactReduxContext) {
  const useStore2 = context === ReactReduxContext ? useStore : createStoreHook(context);
  const useDispatch2 = () => {
    const store2 = useStore2();
    return store2.dispatch;
  };
  Object.assign(useDispatch2, {
    withTypes: () => useDispatch2
  });
  return useDispatch2;
}
var useDispatch = /* @__PURE__ */ createDispatchHook();
initializeUseSelector(withSelectorExports.useSyncExternalStoreWithSelector);
const scriptRel = "modulepreload";
const assetsURL = function(dep) {
  return "/" + dep;
};
const seen = {};
const __vitePreload = function preload(baseModule, deps, importerUrl) {
  let promise = Promise.resolve();
  if (deps && deps.length > 0) {
    document.getElementsByTagName("link");
    const cspNonceMeta = document.querySelector(
      "meta[property=csp-nonce]"
    );
    const cspNonce = (cspNonceMeta == null ? void 0 : cspNonceMeta.nonce) || (cspNonceMeta == null ? void 0 : cspNonceMeta.getAttribute("nonce"));
    promise = Promise.all(
      deps.map((dep) => {
        dep = assetsURL(dep);
        if (dep in seen) return;
        seen[dep] = true;
        const isCss = dep.endsWith(".css");
        const cssSelector = isCss ? '[rel="stylesheet"]' : "";
        if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
          return;
        }
        const link = document.createElement("link");
        link.rel = isCss ? "stylesheet" : scriptRel;
        if (!isCss) {
          link.as = "script";
          link.crossOrigin = "";
        }
        link.href = dep;
        if (cspNonce) {
          link.setAttribute("nonce", cspNonce);
        }
        document.head.appendChild(link);
        if (isCss) {
          return new Promise((res, rej) => {
            link.addEventListener("load", res);
            link.addEventListener(
              "error",
              () => rej(new Error(`Unable to preload CSS for ${dep}`))
            );
          });
        }
      })
    );
  }
  return promise.then(() => baseModule()).catch((err) => {
    const e = new Event("vite:preloadError", { cancelable: true });
    e.payload = err;
    window.dispatchEvent(e);
    if (!e.defaultPrevented) {
      throw err;
    }
  });
};
/**
 * @remix-run/router v1.15.3
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function _extends$2() {
  _extends$2 = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$2.apply(this, arguments);
}
var Action;
(function(Action2) {
  Action2["Pop"] = "POP";
  Action2["Push"] = "PUSH";
  Action2["Replace"] = "REPLACE";
})(Action || (Action = {}));
function createMemoryHistory(options) {
  if (options === void 0) {
    options = {};
  }
  let {
    initialEntries = ["/"],
    initialIndex,
    v5Compat = false
  } = options;
  let entries;
  entries = initialEntries.map((entry, index2) => createMemoryLocation(entry, typeof entry === "string" ? null : entry.state, index2 === 0 ? "default" : void 0));
  let index = clampIndex(initialIndex == null ? entries.length - 1 : initialIndex);
  let action = Action.Pop;
  let listener = null;
  function clampIndex(n2) {
    return Math.min(Math.max(n2, 0), entries.length - 1);
  }
  function getCurrentLocation() {
    return entries[index];
  }
  function createMemoryLocation(to, state, key) {
    if (state === void 0) {
      state = null;
    }
    let location = createLocation(entries ? getCurrentLocation().pathname : "/", to, state, key);
    warning(location.pathname.charAt(0) === "/", "relative pathnames are not supported in memory history: " + JSON.stringify(to));
    return location;
  }
  function createHref(to) {
    return typeof to === "string" ? to : createPath(to);
  }
  let history = {
    get index() {
      return index;
    },
    get action() {
      return action;
    },
    get location() {
      return getCurrentLocation();
    },
    createHref,
    createURL(to) {
      return new URL(createHref(to), "http://localhost");
    },
    encodeLocation(to) {
      let path = typeof to === "string" ? parsePath(to) : to;
      return {
        pathname: path.pathname || "",
        search: path.search || "",
        hash: path.hash || ""
      };
    },
    push(to, state) {
      action = Action.Push;
      let nextLocation = createMemoryLocation(to, state);
      index += 1;
      entries.splice(index, entries.length, nextLocation);
      if (v5Compat && listener) {
        listener({
          action,
          location: nextLocation,
          delta: 1
        });
      }
    },
    replace(to, state) {
      action = Action.Replace;
      let nextLocation = createMemoryLocation(to, state);
      entries[index] = nextLocation;
      if (v5Compat && listener) {
        listener({
          action,
          location: nextLocation,
          delta: 0
        });
      }
    },
    go(delta) {
      action = Action.Pop;
      let nextIndex = clampIndex(index + delta);
      let nextLocation = entries[nextIndex];
      index = nextIndex;
      if (listener) {
        listener({
          action,
          location: nextLocation,
          delta
        });
      }
    },
    listen(fn) {
      listener = fn;
      return () => {
        listener = null;
      };
    }
  };
  return history;
}
function invariant(value, message) {
  if (value === false || value === null || typeof value === "undefined") {
    throw new Error(message);
  }
}
function warning(cond, message) {
  if (!cond) {
    if (typeof console !== "undefined") console.warn(message);
    try {
      throw new Error(message);
    } catch (e) {
    }
  }
}
function createKey() {
  return Math.random().toString(36).substr(2, 8);
}
function createLocation(current2, to, state, key) {
  if (state === void 0) {
    state = null;
  }
  let location = _extends$2({
    pathname: typeof current2 === "string" ? current2 : current2.pathname,
    search: "",
    hash: ""
  }, typeof to === "string" ? parsePath(to) : to, {
    state,
    // TODO: This could be cleaned up.  push/replace should probably just take
    // full Locations now and avoid the need to run through this flow at all
    // But that's a pretty big refactor to the current test suite so going to
    // keep as is for the time being and just let any incoming keys take precedence
    key: to && to.key || key || createKey()
  });
  return location;
}
function createPath(_ref) {
  let {
    pathname = "/",
    search = "",
    hash = ""
  } = _ref;
  if (search && search !== "?") pathname += search.charAt(0) === "?" ? search : "?" + search;
  if (hash && hash !== "#") pathname += hash.charAt(0) === "#" ? hash : "#" + hash;
  return pathname;
}
function parsePath(path) {
  let parsedPath = {};
  if (path) {
    let hashIndex = path.indexOf("#");
    if (hashIndex >= 0) {
      parsedPath.hash = path.substr(hashIndex);
      path = path.substr(0, hashIndex);
    }
    let searchIndex = path.indexOf("?");
    if (searchIndex >= 0) {
      parsedPath.search = path.substr(searchIndex);
      path = path.substr(0, searchIndex);
    }
    if (path) {
      parsedPath.pathname = path;
    }
  }
  return parsedPath;
}
var ResultType;
(function(ResultType2) {
  ResultType2["data"] = "data";
  ResultType2["deferred"] = "deferred";
  ResultType2["redirect"] = "redirect";
  ResultType2["error"] = "error";
})(ResultType || (ResultType = {}));
function matchRoutes(routes, locationArg, basename) {
  if (basename === void 0) {
    basename = "/";
  }
  let location = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
  let pathname = stripBasename(location.pathname || "/", basename);
  if (pathname == null) {
    return null;
  }
  let branches = flattenRoutes(routes);
  rankRouteBranches(branches);
  let matches2 = null;
  for (let i = 0; matches2 == null && i < branches.length; ++i) {
    let decoded = decodePath(pathname);
    matches2 = matchRouteBranch(branches[i], decoded);
  }
  return matches2;
}
function flattenRoutes(routes, branches, parentsMeta, parentPath) {
  if (branches === void 0) {
    branches = [];
  }
  if (parentsMeta === void 0) {
    parentsMeta = [];
  }
  if (parentPath === void 0) {
    parentPath = "";
  }
  let flattenRoute = (route, index, relativePath) => {
    let meta = {
      relativePath: relativePath === void 0 ? route.path || "" : relativePath,
      caseSensitive: route.caseSensitive === true,
      childrenIndex: index,
      route
    };
    if (meta.relativePath.startsWith("/")) {
      invariant(meta.relativePath.startsWith(parentPath), 'Absolute route path "' + meta.relativePath + '" nested under path ' + ('"' + parentPath + '" is not valid. An absolute child route path ') + "must start with the combined path of all its parent routes.");
      meta.relativePath = meta.relativePath.slice(parentPath.length);
    }
    let path = joinPaths([parentPath, meta.relativePath]);
    let routesMeta = parentsMeta.concat(meta);
    if (route.children && route.children.length > 0) {
      invariant(
        // Our types know better, but runtime JS may not!
        // @ts-expect-error
        route.index !== true,
        "Index routes must not have child routes. Please remove " + ('all child routes from route path "' + path + '".')
      );
      flattenRoutes(route.children, branches, routesMeta, path);
    }
    if (route.path == null && !route.index) {
      return;
    }
    branches.push({
      path,
      score: computeScore(path, route.index),
      routesMeta
    });
  };
  routes.forEach((route, index) => {
    var _route$path;
    if (route.path === "" || !((_route$path = route.path) != null && _route$path.includes("?"))) {
      flattenRoute(route, index);
    } else {
      for (let exploded of explodeOptionalSegments(route.path)) {
        flattenRoute(route, index, exploded);
      }
    }
  });
  return branches;
}
function explodeOptionalSegments(path) {
  let segments = path.split("/");
  if (segments.length === 0) return [];
  let [first, ...rest] = segments;
  let isOptional = first.endsWith("?");
  let required = first.replace(/\?$/, "");
  if (rest.length === 0) {
    return isOptional ? [required, ""] : [required];
  }
  let restExploded = explodeOptionalSegments(rest.join("/"));
  let result = [];
  result.push(...restExploded.map((subpath) => subpath === "" ? required : [required, subpath].join("/")));
  if (isOptional) {
    result.push(...restExploded);
  }
  return result.map((exploded) => path.startsWith("/") && exploded === "" ? "/" : exploded);
}
function rankRouteBranches(branches) {
  branches.sort((a, b) => a.score !== b.score ? b.score - a.score : compareIndexes(a.routesMeta.map((meta) => meta.childrenIndex), b.routesMeta.map((meta) => meta.childrenIndex)));
}
const paramRe = /^:[\w-]+$/;
const dynamicSegmentValue = 3;
const indexRouteValue = 2;
const emptySegmentValue = 1;
const staticSegmentValue = 10;
const splatPenalty = -2;
const isSplat = (s2) => s2 === "*";
function computeScore(path, index) {
  let segments = path.split("/");
  let initialScore = segments.length;
  if (segments.some(isSplat)) {
    initialScore += splatPenalty;
  }
  if (index) {
    initialScore += indexRouteValue;
  }
  return segments.filter((s2) => !isSplat(s2)).reduce((score, segment) => score + (paramRe.test(segment) ? dynamicSegmentValue : segment === "" ? emptySegmentValue : staticSegmentValue), initialScore);
}
function compareIndexes(a, b) {
  let siblings = a.length === b.length && a.slice(0, -1).every((n2, i) => n2 === b[i]);
  return siblings ? (
    // If two routes are siblings, we should try to match the earlier sibling
    // first. This allows people to have fine-grained control over the matching
    // behavior by simply putting routes with identical paths in the order they
    // want them tried.
    a[a.length - 1] - b[b.length - 1]
  ) : (
    // Otherwise, it doesn't really make sense to rank non-siblings by index,
    // so they sort equally.
    0
  );
}
function matchRouteBranch(branch, pathname) {
  let {
    routesMeta
  } = branch;
  let matchedParams = {};
  let matchedPathname = "/";
  let matches2 = [];
  for (let i = 0; i < routesMeta.length; ++i) {
    let meta = routesMeta[i];
    let end = i === routesMeta.length - 1;
    let remainingPathname = matchedPathname === "/" ? pathname : pathname.slice(matchedPathname.length) || "/";
    let match2 = matchPath({
      path: meta.relativePath,
      caseSensitive: meta.caseSensitive,
      end
    }, remainingPathname);
    if (!match2) return null;
    Object.assign(matchedParams, match2.params);
    let route = meta.route;
    matches2.push({
      // TODO: Can this as be avoided?
      params: matchedParams,
      pathname: joinPaths([matchedPathname, match2.pathname]),
      pathnameBase: normalizePathname(joinPaths([matchedPathname, match2.pathnameBase])),
      route
    });
    if (match2.pathnameBase !== "/") {
      matchedPathname = joinPaths([matchedPathname, match2.pathnameBase]);
    }
  }
  return matches2;
}
function matchPath(pattern, pathname) {
  if (typeof pattern === "string") {
    pattern = {
      path: pattern,
      caseSensitive: false,
      end: true
    };
  }
  let [matcher, compiledParams] = compilePath(pattern.path, pattern.caseSensitive, pattern.end);
  let match2 = pathname.match(matcher);
  if (!match2) return null;
  let matchedPathname = match2[0];
  let pathnameBase = matchedPathname.replace(/(.)\/+$/, "$1");
  let captureGroups = match2.slice(1);
  let params = compiledParams.reduce((memo, _ref, index) => {
    let {
      paramName,
      isOptional
    } = _ref;
    if (paramName === "*") {
      let splatValue = captureGroups[index] || "";
      pathnameBase = matchedPathname.slice(0, matchedPathname.length - splatValue.length).replace(/(.)\/+$/, "$1");
    }
    const value = captureGroups[index];
    if (isOptional && !value) {
      memo[paramName] = void 0;
    } else {
      memo[paramName] = (value || "").replace(/%2F/g, "/");
    }
    return memo;
  }, {});
  return {
    params,
    pathname: matchedPathname,
    pathnameBase,
    pattern
  };
}
function compilePath(path, caseSensitive, end) {
  if (caseSensitive === void 0) {
    caseSensitive = false;
  }
  if (end === void 0) {
    end = true;
  }
  warning(path === "*" || !path.endsWith("*") || path.endsWith("/*"), 'Route path "' + path + '" will be treated as if it were ' + ('"' + path.replace(/\*$/, "/*") + '" because the `*` character must ') + "always follow a `/` in the pattern. To get rid of this warning, " + ('please change the route path to "' + path.replace(/\*$/, "/*") + '".'));
  let params = [];
  let regexpSource = "^" + path.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(/\/:([\w-]+)(\?)?/g, (_, paramName, isOptional) => {
    params.push({
      paramName,
      isOptional: isOptional != null
    });
    return isOptional ? "/?([^\\/]+)?" : "/([^\\/]+)";
  });
  if (path.endsWith("*")) {
    params.push({
      paramName: "*"
    });
    regexpSource += path === "*" || path === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$";
  } else if (end) {
    regexpSource += "\\/*$";
  } else if (path !== "" && path !== "/") {
    regexpSource += "(?:(?=\\/|$))";
  } else ;
  let matcher = new RegExp(regexpSource, caseSensitive ? void 0 : "i");
  return [matcher, params];
}
function decodePath(value) {
  try {
    return value.split("/").map((v2) => decodeURIComponent(v2).replace(/\//g, "%2F")).join("/");
  } catch (error) {
    warning(false, 'The URL path "' + value + '" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent ' + ("encoding (" + error + ")."));
    return value;
  }
}
function stripBasename(pathname, basename) {
  if (basename === "/") return pathname;
  if (!pathname.toLowerCase().startsWith(basename.toLowerCase())) {
    return null;
  }
  let startIndex = basename.endsWith("/") ? basename.length - 1 : basename.length;
  let nextChar = pathname.charAt(startIndex);
  if (nextChar && nextChar !== "/") {
    return null;
  }
  return pathname.slice(startIndex) || "/";
}
function resolvePath(to, fromPathname) {
  if (fromPathname === void 0) {
    fromPathname = "/";
  }
  let {
    pathname: toPathname,
    search = "",
    hash = ""
  } = typeof to === "string" ? parsePath(to) : to;
  let pathname = toPathname ? toPathname.startsWith("/") ? toPathname : resolvePathname(toPathname, fromPathname) : fromPathname;
  return {
    pathname,
    search: normalizeSearch(search),
    hash: normalizeHash(hash)
  };
}
function resolvePathname(relativePath, fromPathname) {
  let segments = fromPathname.replace(/\/+$/, "").split("/");
  let relativeSegments = relativePath.split("/");
  relativeSegments.forEach((segment) => {
    if (segment === "..") {
      if (segments.length > 1) segments.pop();
    } else if (segment !== ".") {
      segments.push(segment);
    }
  });
  return segments.length > 1 ? segments.join("/") : "/";
}
function getInvalidPathError(char, field, dest, path) {
  return "Cannot include a '" + char + "' character in a manually specified " + ("`to." + field + "` field [" + JSON.stringify(path) + "].  Please separate it out to the ") + ("`to." + dest + "` field. Alternatively you may provide the full path as ") + 'a string in <Link to="..."> and the router will parse it for you.';
}
function getPathContributingMatches(matches2) {
  return matches2.filter((match2, index) => index === 0 || match2.route.path && match2.route.path.length > 0);
}
function getResolveToMatches(matches2, v7_relativeSplatPath) {
  let pathMatches = getPathContributingMatches(matches2);
  if (v7_relativeSplatPath) {
    return pathMatches.map((match2, idx) => idx === matches2.length - 1 ? match2.pathname : match2.pathnameBase);
  }
  return pathMatches.map((match2) => match2.pathnameBase);
}
function resolveTo(toArg, routePathnames, locationPathname, isPathRelative) {
  if (isPathRelative === void 0) {
    isPathRelative = false;
  }
  let to;
  if (typeof toArg === "string") {
    to = parsePath(toArg);
  } else {
    to = _extends$2({}, toArg);
    invariant(!to.pathname || !to.pathname.includes("?"), getInvalidPathError("?", "pathname", "search", to));
    invariant(!to.pathname || !to.pathname.includes("#"), getInvalidPathError("#", "pathname", "hash", to));
    invariant(!to.search || !to.search.includes("#"), getInvalidPathError("#", "search", "hash", to));
  }
  let isEmptyPath = toArg === "" || to.pathname === "";
  let toPathname = isEmptyPath ? "/" : to.pathname;
  let from;
  if (toPathname == null) {
    from = locationPathname;
  } else {
    let routePathnameIndex = routePathnames.length - 1;
    if (!isPathRelative && toPathname.startsWith("..")) {
      let toSegments = toPathname.split("/");
      while (toSegments[0] === "..") {
        toSegments.shift();
        routePathnameIndex -= 1;
      }
      to.pathname = toSegments.join("/");
    }
    from = routePathnameIndex >= 0 ? routePathnames[routePathnameIndex] : "/";
  }
  let path = resolvePath(to, from);
  let hasExplicitTrailingSlash = toPathname && toPathname !== "/" && toPathname.endsWith("/");
  let hasCurrentTrailingSlash = (isEmptyPath || toPathname === ".") && locationPathname.endsWith("/");
  if (!path.pathname.endsWith("/") && (hasExplicitTrailingSlash || hasCurrentTrailingSlash)) {
    path.pathname += "/";
  }
  return path;
}
const joinPaths = (paths) => paths.join("/").replace(/\/\/+/g, "/");
const normalizePathname = (pathname) => pathname.replace(/\/+$/, "").replace(/^\/*/, "/");
const normalizeSearch = (search) => !search || search === "?" ? "" : search.startsWith("?") ? search : "?" + search;
const normalizeHash = (hash) => !hash || hash === "#" ? "" : hash.startsWith("#") ? hash : "#" + hash;
function isRouteErrorResponse(error) {
  return error != null && typeof error.status === "number" && typeof error.statusText === "string" && typeof error.internal === "boolean" && "data" in error;
}
const validMutationMethodsArr = ["post", "put", "patch", "delete"];
new Set(validMutationMethodsArr);
const validRequestMethodsArr = ["get", ...validMutationMethodsArr];
new Set(validRequestMethodsArr);
/**
 * React Router v6.22.3
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function _extends$1() {
  _extends$1 = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$1.apply(this, arguments);
}
const DataRouterContext = /* @__PURE__ */ reactExports.createContext(null);
const DataRouterStateContext = /* @__PURE__ */ reactExports.createContext(null);
const NavigationContext = /* @__PURE__ */ reactExports.createContext(null);
const LocationContext = /* @__PURE__ */ reactExports.createContext(null);
const RouteContext = /* @__PURE__ */ reactExports.createContext({
  outlet: null,
  matches: [],
  isDataRoute: false
});
const RouteErrorContext = /* @__PURE__ */ reactExports.createContext(null);
function useHref(to, _temp) {
  let {
    relative
  } = _temp === void 0 ? {} : _temp;
  !useInRouterContext() ? invariant(false) : void 0;
  let {
    basename,
    navigator: navigator2
  } = reactExports.useContext(NavigationContext);
  let {
    hash,
    pathname,
    search
  } = useResolvedPath(to, {
    relative
  });
  let joinedPathname = pathname;
  if (basename !== "/") {
    joinedPathname = pathname === "/" ? basename : joinPaths([basename, pathname]);
  }
  return navigator2.createHref({
    pathname: joinedPathname,
    search,
    hash
  });
}
function useInRouterContext() {
  return reactExports.useContext(LocationContext) != null;
}
function useLocation() {
  !useInRouterContext() ? invariant(false) : void 0;
  return reactExports.useContext(LocationContext).location;
}
function useIsomorphicLayoutEffect(cb2) {
  let isStatic = reactExports.useContext(NavigationContext).static;
  if (!isStatic) {
    reactExports.useLayoutEffect(cb2);
  }
}
function useNavigate() {
  let {
    isDataRoute
  } = reactExports.useContext(RouteContext);
  return isDataRoute ? useNavigateStable() : useNavigateUnstable();
}
function useNavigateUnstable() {
  !useInRouterContext() ? invariant(false) : void 0;
  let dataRouterContext = reactExports.useContext(DataRouterContext);
  let {
    basename,
    future,
    navigator: navigator2
  } = reactExports.useContext(NavigationContext);
  let {
    matches: matches2
  } = reactExports.useContext(RouteContext);
  let {
    pathname: locationPathname
  } = useLocation();
  let routePathnamesJson = JSON.stringify(getResolveToMatches(matches2, future.v7_relativeSplatPath));
  let activeRef = reactExports.useRef(false);
  useIsomorphicLayoutEffect(() => {
    activeRef.current = true;
  });
  let navigate = reactExports.useCallback(function(to, options) {
    if (options === void 0) {
      options = {};
    }
    if (!activeRef.current) return;
    if (typeof to === "number") {
      navigator2.go(to);
      return;
    }
    let path = resolveTo(to, JSON.parse(routePathnamesJson), locationPathname, options.relative === "path");
    if (dataRouterContext == null && basename !== "/") {
      path.pathname = path.pathname === "/" ? basename : joinPaths([basename, path.pathname]);
    }
    (!!options.replace ? navigator2.replace : navigator2.push)(path, options.state, options);
  }, [basename, navigator2, routePathnamesJson, locationPathname, dataRouterContext]);
  return navigate;
}
function useResolvedPath(to, _temp2) {
  let {
    relative
  } = _temp2 === void 0 ? {} : _temp2;
  let {
    future
  } = reactExports.useContext(NavigationContext);
  let {
    matches: matches2
  } = reactExports.useContext(RouteContext);
  let {
    pathname: locationPathname
  } = useLocation();
  let routePathnamesJson = JSON.stringify(getResolveToMatches(matches2, future.v7_relativeSplatPath));
  return reactExports.useMemo(() => resolveTo(to, JSON.parse(routePathnamesJson), locationPathname, relative === "path"), [to, routePathnamesJson, locationPathname, relative]);
}
function useRoutes(routes, locationArg) {
  return useRoutesImpl(routes, locationArg);
}
function useRoutesImpl(routes, locationArg, dataRouterState, future) {
  !useInRouterContext() ? invariant(false) : void 0;
  let {
    navigator: navigator2
  } = reactExports.useContext(NavigationContext);
  let {
    matches: parentMatches
  } = reactExports.useContext(RouteContext);
  let routeMatch = parentMatches[parentMatches.length - 1];
  let parentParams = routeMatch ? routeMatch.params : {};
  routeMatch ? routeMatch.pathname : "/";
  let parentPathnameBase = routeMatch ? routeMatch.pathnameBase : "/";
  routeMatch && routeMatch.route;
  let locationFromContext = useLocation();
  let location;
  if (locationArg) {
    var _parsedLocationArg$pa;
    let parsedLocationArg = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
    !(parentPathnameBase === "/" || ((_parsedLocationArg$pa = parsedLocationArg.pathname) == null ? void 0 : _parsedLocationArg$pa.startsWith(parentPathnameBase))) ? invariant(false) : void 0;
    location = parsedLocationArg;
  } else {
    location = locationFromContext;
  }
  let pathname = location.pathname || "/";
  let remainingPathname = pathname;
  if (parentPathnameBase !== "/") {
    let parentSegments = parentPathnameBase.replace(/^\//, "").split("/");
    let segments = pathname.replace(/^\//, "").split("/");
    remainingPathname = "/" + segments.slice(parentSegments.length).join("/");
  }
  let matches2 = matchRoutes(routes, {
    pathname: remainingPathname
  });
  let renderedMatches = _renderMatches(matches2 && matches2.map((match2) => Object.assign({}, match2, {
    params: Object.assign({}, parentParams, match2.params),
    pathname: joinPaths([
      parentPathnameBase,
      // Re-encode pathnames that were decoded inside matchRoutes
      navigator2.encodeLocation ? navigator2.encodeLocation(match2.pathname).pathname : match2.pathname
    ]),
    pathnameBase: match2.pathnameBase === "/" ? parentPathnameBase : joinPaths([
      parentPathnameBase,
      // Re-encode pathnames that were decoded inside matchRoutes
      navigator2.encodeLocation ? navigator2.encodeLocation(match2.pathnameBase).pathname : match2.pathnameBase
    ])
  })), parentMatches, dataRouterState, future);
  if (locationArg && renderedMatches) {
    return /* @__PURE__ */ reactExports.createElement(LocationContext.Provider, {
      value: {
        location: _extends$1({
          pathname: "/",
          search: "",
          hash: "",
          state: null,
          key: "default"
        }, location),
        navigationType: Action.Pop
      }
    }, renderedMatches);
  }
  return renderedMatches;
}
function DefaultErrorComponent() {
  let error = useRouteError();
  let message = isRouteErrorResponse(error) ? error.status + " " + error.statusText : error instanceof Error ? error.message : JSON.stringify(error);
  let stack = error instanceof Error ? error.stack : null;
  let lightgrey = "rgba(200,200,200, 0.5)";
  let preStyles = {
    padding: "0.5rem",
    backgroundColor: lightgrey
  };
  let devInfo = null;
  return /* @__PURE__ */ reactExports.createElement(reactExports.Fragment, null, /* @__PURE__ */ reactExports.createElement("h2", null, "Unexpected Application Error!"), /* @__PURE__ */ reactExports.createElement("h3", {
    style: {
      fontStyle: "italic"
    }
  }, message), stack ? /* @__PURE__ */ reactExports.createElement("pre", {
    style: preStyles
  }, stack) : null, devInfo);
}
const defaultErrorElement = /* @__PURE__ */ reactExports.createElement(DefaultErrorComponent, null);
class RenderErrorBoundary extends reactExports.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: props.location,
      revalidation: props.revalidation,
      error: props.error
    };
  }
  static getDerivedStateFromError(error) {
    return {
      error
    };
  }
  static getDerivedStateFromProps(props, state) {
    if (state.location !== props.location || state.revalidation !== "idle" && props.revalidation === "idle") {
      return {
        error: props.error,
        location: props.location,
        revalidation: props.revalidation
      };
    }
    return {
      error: props.error !== void 0 ? props.error : state.error,
      location: state.location,
      revalidation: props.revalidation || state.revalidation
    };
  }
  componentDidCatch(error, errorInfo) {
    console.error("React Router caught the following error during render", error, errorInfo);
  }
  render() {
    return this.state.error !== void 0 ? /* @__PURE__ */ reactExports.createElement(RouteContext.Provider, {
      value: this.props.routeContext
    }, /* @__PURE__ */ reactExports.createElement(RouteErrorContext.Provider, {
      value: this.state.error,
      children: this.props.component
    })) : this.props.children;
  }
}
function RenderedRoute(_ref) {
  let {
    routeContext,
    match: match2,
    children
  } = _ref;
  let dataRouterContext = reactExports.useContext(DataRouterContext);
  if (dataRouterContext && dataRouterContext.static && dataRouterContext.staticContext && (match2.route.errorElement || match2.route.ErrorBoundary)) {
    dataRouterContext.staticContext._deepestRenderedBoundaryId = match2.route.id;
  }
  return /* @__PURE__ */ reactExports.createElement(RouteContext.Provider, {
    value: routeContext
  }, children);
}
function _renderMatches(matches2, parentMatches, dataRouterState, future) {
  var _dataRouterState2;
  if (parentMatches === void 0) {
    parentMatches = [];
  }
  if (dataRouterState === void 0) {
    dataRouterState = null;
  }
  if (future === void 0) {
    future = null;
  }
  if (matches2 == null) {
    var _dataRouterState;
    if ((_dataRouterState = dataRouterState) != null && _dataRouterState.errors) {
      matches2 = dataRouterState.matches;
    } else {
      return null;
    }
  }
  let renderedMatches = matches2;
  let errors = (_dataRouterState2 = dataRouterState) == null ? void 0 : _dataRouterState2.errors;
  if (errors != null) {
    let errorIndex = renderedMatches.findIndex((m2) => m2.route.id && (errors == null ? void 0 : errors[m2.route.id]));
    !(errorIndex >= 0) ? invariant(false) : void 0;
    renderedMatches = renderedMatches.slice(0, Math.min(renderedMatches.length, errorIndex + 1));
  }
  let renderFallback = false;
  let fallbackIndex = -1;
  if (dataRouterState && future && future.v7_partialHydration) {
    for (let i = 0; i < renderedMatches.length; i++) {
      let match2 = renderedMatches[i];
      if (match2.route.HydrateFallback || match2.route.hydrateFallbackElement) {
        fallbackIndex = i;
      }
      if (match2.route.id) {
        let {
          loaderData,
          errors: errors2
        } = dataRouterState;
        let needsToRunLoader = match2.route.loader && loaderData[match2.route.id] === void 0 && (!errors2 || errors2[match2.route.id] === void 0);
        if (match2.route.lazy || needsToRunLoader) {
          renderFallback = true;
          if (fallbackIndex >= 0) {
            renderedMatches = renderedMatches.slice(0, fallbackIndex + 1);
          } else {
            renderedMatches = [renderedMatches[0]];
          }
          break;
        }
      }
    }
  }
  return renderedMatches.reduceRight((outlet, match2, index) => {
    let error;
    let shouldRenderHydrateFallback = false;
    let errorElement = null;
    let hydrateFallbackElement = null;
    if (dataRouterState) {
      error = errors && match2.route.id ? errors[match2.route.id] : void 0;
      errorElement = match2.route.errorElement || defaultErrorElement;
      if (renderFallback) {
        if (fallbackIndex < 0 && index === 0) {
          shouldRenderHydrateFallback = true;
          hydrateFallbackElement = null;
        } else if (fallbackIndex === index) {
          shouldRenderHydrateFallback = true;
          hydrateFallbackElement = match2.route.hydrateFallbackElement || null;
        }
      }
    }
    let matches22 = parentMatches.concat(renderedMatches.slice(0, index + 1));
    let getChildren = () => {
      let children;
      if (error) {
        children = errorElement;
      } else if (shouldRenderHydrateFallback) {
        children = hydrateFallbackElement;
      } else if (match2.route.Component) {
        children = /* @__PURE__ */ reactExports.createElement(match2.route.Component, null);
      } else if (match2.route.element) {
        children = match2.route.element;
      } else {
        children = outlet;
      }
      return /* @__PURE__ */ reactExports.createElement(RenderedRoute, {
        match: match2,
        routeContext: {
          outlet,
          matches: matches22,
          isDataRoute: dataRouterState != null
        },
        children
      });
    };
    return dataRouterState && (match2.route.ErrorBoundary || match2.route.errorElement || index === 0) ? /* @__PURE__ */ reactExports.createElement(RenderErrorBoundary, {
      location: dataRouterState.location,
      revalidation: dataRouterState.revalidation,
      component: errorElement,
      error,
      children: getChildren(),
      routeContext: {
        outlet: null,
        matches: matches22,
        isDataRoute: true
      }
    }) : getChildren();
  }, null);
}
var DataRouterHook$1 = /* @__PURE__ */ function(DataRouterHook2) {
  DataRouterHook2["UseBlocker"] = "useBlocker";
  DataRouterHook2["UseRevalidator"] = "useRevalidator";
  DataRouterHook2["UseNavigateStable"] = "useNavigate";
  return DataRouterHook2;
}(DataRouterHook$1 || {});
var DataRouterStateHook$1 = /* @__PURE__ */ function(DataRouterStateHook2) {
  DataRouterStateHook2["UseBlocker"] = "useBlocker";
  DataRouterStateHook2["UseLoaderData"] = "useLoaderData";
  DataRouterStateHook2["UseActionData"] = "useActionData";
  DataRouterStateHook2["UseRouteError"] = "useRouteError";
  DataRouterStateHook2["UseNavigation"] = "useNavigation";
  DataRouterStateHook2["UseRouteLoaderData"] = "useRouteLoaderData";
  DataRouterStateHook2["UseMatches"] = "useMatches";
  DataRouterStateHook2["UseRevalidator"] = "useRevalidator";
  DataRouterStateHook2["UseNavigateStable"] = "useNavigate";
  DataRouterStateHook2["UseRouteId"] = "useRouteId";
  return DataRouterStateHook2;
}(DataRouterStateHook$1 || {});
function useDataRouterContext(hookName) {
  let ctx = reactExports.useContext(DataRouterContext);
  !ctx ? invariant(false) : void 0;
  return ctx;
}
function useDataRouterState(hookName) {
  let state = reactExports.useContext(DataRouterStateContext);
  !state ? invariant(false) : void 0;
  return state;
}
function useRouteContext(hookName) {
  let route = reactExports.useContext(RouteContext);
  !route ? invariant(false) : void 0;
  return route;
}
function useCurrentRouteId(hookName) {
  let route = useRouteContext();
  let thisRoute = route.matches[route.matches.length - 1];
  !thisRoute.route.id ? invariant(false) : void 0;
  return thisRoute.route.id;
}
function useRouteError() {
  var _state$errors;
  let error = reactExports.useContext(RouteErrorContext);
  let state = useDataRouterState(DataRouterStateHook$1.UseRouteError);
  let routeId = useCurrentRouteId(DataRouterStateHook$1.UseRouteError);
  if (error !== void 0) {
    return error;
  }
  return (_state$errors = state.errors) == null ? void 0 : _state$errors[routeId];
}
function useNavigateStable() {
  let {
    router
  } = useDataRouterContext(DataRouterHook$1.UseNavigateStable);
  let id2 = useCurrentRouteId(DataRouterStateHook$1.UseNavigateStable);
  let activeRef = reactExports.useRef(false);
  useIsomorphicLayoutEffect(() => {
    activeRef.current = true;
  });
  let navigate = reactExports.useCallback(function(to, options) {
    if (options === void 0) {
      options = {};
    }
    if (!activeRef.current) return;
    if (typeof to === "number") {
      router.navigate(to);
    } else {
      router.navigate(to, _extends$1({
        fromRouteId: id2
      }, options));
    }
  }, [router, id2]);
  return navigate;
}
const START_TRANSITION = "startTransition";
const startTransitionImpl = React$2[START_TRANSITION];
function MemoryRouter(_ref3) {
  let {
    basename,
    children,
    initialEntries,
    initialIndex,
    future
  } = _ref3;
  let historyRef = reactExports.useRef();
  if (historyRef.current == null) {
    historyRef.current = createMemoryHistory({
      initialEntries,
      initialIndex,
      v5Compat: true
    });
  }
  let history = historyRef.current;
  let [state, setStateImpl] = reactExports.useState({
    action: history.action,
    location: history.location
  });
  let {
    v7_startTransition
  } = future || {};
  let setState = reactExports.useCallback((newState) => {
    v7_startTransition && startTransitionImpl ? startTransitionImpl(() => setStateImpl(newState)) : setStateImpl(newState);
  }, [setStateImpl, v7_startTransition]);
  reactExports.useLayoutEffect(() => history.listen(setState), [history, setState]);
  return /* @__PURE__ */ reactExports.createElement(Router, {
    basename,
    children,
    location: state.location,
    navigationType: state.action,
    navigator: history,
    future
  });
}
function Navigate(_ref4) {
  let {
    to,
    replace,
    state,
    relative
  } = _ref4;
  !useInRouterContext() ? invariant(false) : void 0;
  let {
    future,
    static: isStatic
  } = reactExports.useContext(NavigationContext);
  let {
    matches: matches2
  } = reactExports.useContext(RouteContext);
  let {
    pathname: locationPathname
  } = useLocation();
  let navigate = useNavigate();
  let path = resolveTo(to, getResolveToMatches(matches2, future.v7_relativeSplatPath), locationPathname, relative === "path");
  let jsonPath = JSON.stringify(path);
  reactExports.useEffect(() => navigate(JSON.parse(jsonPath), {
    replace,
    state,
    relative
  }), [navigate, jsonPath, relative, replace, state]);
  return null;
}
function Route(_props) {
  invariant(false);
}
function Router(_ref5) {
  let {
    basename: basenameProp = "/",
    children = null,
    location: locationProp,
    navigationType = Action.Pop,
    navigator: navigator2,
    static: staticProp = false,
    future
  } = _ref5;
  !!useInRouterContext() ? invariant(false) : void 0;
  let basename = basenameProp.replace(/^\/*/, "/");
  let navigationContext = reactExports.useMemo(() => ({
    basename,
    navigator: navigator2,
    static: staticProp,
    future: _extends$1({
      v7_relativeSplatPath: false
    }, future)
  }), [basename, future, navigator2, staticProp]);
  if (typeof locationProp === "string") {
    locationProp = parsePath(locationProp);
  }
  let {
    pathname = "/",
    search = "",
    hash = "",
    state = null,
    key = "default"
  } = locationProp;
  let locationContext = reactExports.useMemo(() => {
    let trailingPathname = stripBasename(pathname, basename);
    if (trailingPathname == null) {
      return null;
    }
    return {
      location: {
        pathname: trailingPathname,
        search,
        hash,
        state,
        key
      },
      navigationType
    };
  }, [basename, pathname, search, hash, state, key, navigationType]);
  if (locationContext == null) {
    return null;
  }
  return /* @__PURE__ */ reactExports.createElement(NavigationContext.Provider, {
    value: navigationContext
  }, /* @__PURE__ */ reactExports.createElement(LocationContext.Provider, {
    children,
    value: locationContext
  }));
}
function Routes(_ref6) {
  let {
    children,
    location
  } = _ref6;
  return useRoutes(createRoutesFromChildren(children), location);
}
new Promise(() => {
});
function createRoutesFromChildren(children, parentPath) {
  if (parentPath === void 0) {
    parentPath = [];
  }
  let routes = [];
  reactExports.Children.forEach(children, (element, index) => {
    if (!/* @__PURE__ */ reactExports.isValidElement(element)) {
      return;
    }
    let treePath = [...parentPath, index];
    if (element.type === reactExports.Fragment) {
      routes.push.apply(routes, createRoutesFromChildren(element.props.children, treePath));
      return;
    }
    !(element.type === Route) ? invariant(false) : void 0;
    !(!element.props.index || !element.props.children) ? invariant(false) : void 0;
    let route = {
      id: element.props.id || treePath.join("-"),
      caseSensitive: element.props.caseSensitive,
      element: element.props.element,
      Component: element.props.Component,
      index: element.props.index,
      path: element.props.path,
      loader: element.props.loader,
      action: element.props.action,
      errorElement: element.props.errorElement,
      ErrorBoundary: element.props.ErrorBoundary,
      hasErrorBoundary: element.props.ErrorBoundary != null || element.props.errorElement != null,
      shouldRevalidate: element.props.shouldRevalidate,
      handle: element.props.handle,
      lazy: element.props.lazy
    };
    if (element.props.children) {
      route.children = createRoutesFromChildren(element.props.children, treePath);
    }
    routes.push(route);
  });
  return routes;
}
/**
 * React Router DOM v6.22.3
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}
function shouldProcessLinkClick(event, target) {
  return event.button === 0 && // Ignore everything but left clicks
  (!target || target === "_self") && // Let browser handle "target=_blank" etc.
  !isModifiedEvent(event);
}
const _excluded = ["onClick", "relative", "reloadDocument", "replace", "state", "target", "to", "preventScrollReset", "unstable_viewTransition"];
const REACT_ROUTER_VERSION = "6";
try {
  window.__reactRouterVersion = REACT_ROUTER_VERSION;
} catch (e) {
}
const isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined";
const ABSOLUTE_URL_REGEX = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
const Link = /* @__PURE__ */ reactExports.forwardRef(function LinkWithRef(_ref7, ref) {
  let {
    onClick,
    relative,
    reloadDocument,
    replace,
    state,
    target,
    to,
    preventScrollReset,
    unstable_viewTransition
  } = _ref7, rest = _objectWithoutPropertiesLoose(_ref7, _excluded);
  let {
    basename
  } = reactExports.useContext(NavigationContext);
  let absoluteHref;
  let isExternal = false;
  if (typeof to === "string" && ABSOLUTE_URL_REGEX.test(to)) {
    absoluteHref = to;
    if (isBrowser) {
      try {
        let currentUrl = new URL(window.location.href);
        let targetUrl = to.startsWith("//") ? new URL(currentUrl.protocol + to) : new URL(to);
        let path = stripBasename(targetUrl.pathname, basename);
        if (targetUrl.origin === currentUrl.origin && path != null) {
          to = path + targetUrl.search + targetUrl.hash;
        } else {
          isExternal = true;
        }
      } catch (e) {
      }
    }
  }
  let href = useHref(to, {
    relative
  });
  let internalOnClick = useLinkClickHandler(to, {
    replace,
    state,
    target,
    preventScrollReset,
    relative,
    unstable_viewTransition
  });
  function handleClick(event) {
    if (onClick) onClick(event);
    if (!event.defaultPrevented) {
      internalOnClick(event);
    }
  }
  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    /* @__PURE__ */ reactExports.createElement("a", _extends({}, rest, {
      href: absoluteHref || href,
      onClick: isExternal || reloadDocument ? onClick : handleClick,
      ref,
      target
    }))
  );
});
var DataRouterHook;
(function(DataRouterHook2) {
  DataRouterHook2["UseScrollRestoration"] = "useScrollRestoration";
  DataRouterHook2["UseSubmit"] = "useSubmit";
  DataRouterHook2["UseSubmitFetcher"] = "useSubmitFetcher";
  DataRouterHook2["UseFetcher"] = "useFetcher";
  DataRouterHook2["useViewTransitionState"] = "useViewTransitionState";
})(DataRouterHook || (DataRouterHook = {}));
var DataRouterStateHook;
(function(DataRouterStateHook2) {
  DataRouterStateHook2["UseFetcher"] = "useFetcher";
  DataRouterStateHook2["UseFetchers"] = "useFetchers";
  DataRouterStateHook2["UseScrollRestoration"] = "useScrollRestoration";
})(DataRouterStateHook || (DataRouterStateHook = {}));
function useLinkClickHandler(to, _temp) {
  let {
    target,
    replace: replaceProp,
    state,
    preventScrollReset,
    relative,
    unstable_viewTransition
  } = _temp === void 0 ? {} : _temp;
  let navigate = useNavigate();
  let location = useLocation();
  let path = useResolvedPath(to, {
    relative
  });
  return reactExports.useCallback((event) => {
    if (shouldProcessLinkClick(event, target)) {
      event.preventDefault();
      let replace = replaceProp !== void 0 ? replaceProp : createPath(location) === createPath(path);
      navigate(to, {
        replace,
        state,
        preventScrollReset,
        relative,
        unstable_viewTransition
      });
    }
  }, [location, navigate, path, replaceProp, state, target, to, preventScrollReset, relative, unstable_viewTransition]);
}
const PROJECT_NAMESPACE = "egr";
const nsp = (...classNames2) => classNames2.map((classList) => classList.split(/\s/).filter(Boolean)).flat().map((className) => `${PROJECT_NAMESPACE}-${className}`).join(" ");
const AriaLogContext = reactExports.createContext(void 0);
function AriaLogProvider({ children }) {
  const [messages, setMessages] = reactExports.useState([]);
  const addMessage = reactExports.useCallback((message) => {
    setMessages((existing) => [message, ...existing]);
    return () => setMessages(
      (existing) => existing.filter((otherMessage) => otherMessage !== message)
    );
  }, []);
  const context = reactExports.useMemo(() => ({ addMessage }), [addMessage]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AriaLogContext.Provider, { value: context, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { role: "log", className: nsp("aria-log"), children: messages.map((message) => /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: message }, message)) }),
    children
  ] });
}
const useAriaLog = () => {
  const context = reactExports.useContext(AriaLogContext);
  if (!context) {
    throw new Error("Missing context for 'useAriaLog' hook.");
  }
  return context;
};
function AriaMessage({ children: message }) {
  const { addMessage } = useAriaLog();
  reactExports.useEffect(() => addMessage(message), [addMessage, message]);
  return null;
}
var classnames = { exports: {} };
/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/
(function(module) {
  (function() {
    var hasOwn = {}.hasOwnProperty;
    function classNames2() {
      var classes = "";
      for (var i = 0; i < arguments.length; i++) {
        var arg = arguments[i];
        if (arg) {
          classes = appendClass(classes, parseValue(arg));
        }
      }
      return classes;
    }
    function parseValue(arg) {
      if (typeof arg === "string" || typeof arg === "number") {
        return arg;
      }
      if (typeof arg !== "object") {
        return "";
      }
      if (Array.isArray(arg)) {
        return classNames2.apply(null, arg);
      }
      if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes("[native code]")) {
        return arg.toString();
      }
      var classes = "";
      for (var key in arg) {
        if (hasOwn.call(arg, key) && arg[key]) {
          classes = appendClass(classes, key);
        }
      }
      return classes;
    }
    function appendClass(value, newClass) {
      if (!newClass) {
        return value;
      }
      if (value) {
        return value + " " + newClass;
      }
      return value + newClass;
    }
    if (module.exports) {
      classNames2.default = classNames2;
      module.exports = classNames2;
    } else {
      window.classNames = classNames2;
    }
  })();
})(classnames);
var classnamesExports = classnames.exports;
const classNames = /* @__PURE__ */ getDefaultExportFromCjs(classnamesExports);
function Button({
  id: id2,
  className,
  buttonStyle = "primary",
  label,
  iconBefore,
  iconAfter,
  onClick,
  disabled = false,
  ariaLabel,
  ariaControls,
  isSubmitButton = false
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      id: id2,
      className: classNames(
        nsp("button"),
        buttonStyle === "primary" && nsp("button--primary"),
        buttonStyle === "secondary" && nsp("button--secondary"),
        buttonStyle === "link" && nsp("button--link"),
        disabled && nsp("button--disabled"),
        className
      ),
      type: isSubmitButton ? "submit" : "button",
      onClick,
      disabled,
      "aria-label": ariaLabel,
      "aria-controls": ariaControls,
      children: [
        !!iconBefore && iconBefore,
        !!iconBefore && /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: " " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label }),
        !!iconAfter && /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: " " }),
        !!iconAfter && iconAfter
      ]
    }
  );
}
var InfoOutlined = {};
var __assign$h = commonjsGlobal && commonjsGlobal.__assign || function() {
  __assign$h = Object.assign || function(t2) {
    for (var s2, i = 1, n2 = arguments.length; i < n2; i++) {
      s2 = arguments[i];
      for (var p2 in s2) if (Object.prototype.hasOwnProperty.call(s2, p2))
        t2[p2] = s2[p2];
    }
    return t2;
  };
  return __assign$h.apply(this, arguments);
};
Object.defineProperty(InfoOutlined, "__esModule", { value: true });
var jsx_runtime_1$6 = jsxRuntimeExports;
var SvgInfoOutlined = function(props) {
  return (0, jsx_runtime_1$6.jsxs)("svg", __assign$h({ xmlns: "http://www.w3.org/2000/svg", height: 24, viewBox: "0 0 24 24", width: 24, "data-testid": "InfoOutlinedIcon", role: "graphics-symbol img", focusable: "false", "aria-hidden": "true" }, props, { children: [(0, jsx_runtime_1$6.jsx)("path", { d: "M0 0h24v24H0V0z", fill: "none" }), (0, jsx_runtime_1$6.jsx)("path", { d: "M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" })] }));
};
var _default$6 = InfoOutlined.default = SvgInfoOutlined;
var Close = {};
var __assign$g = commonjsGlobal && commonjsGlobal.__assign || function() {
  __assign$g = Object.assign || function(t2) {
    for (var s2, i = 1, n2 = arguments.length; i < n2; i++) {
      s2 = arguments[i];
      for (var p2 in s2) if (Object.prototype.hasOwnProperty.call(s2, p2))
        t2[p2] = s2[p2];
    }
    return t2;
  };
  return __assign$g.apply(this, arguments);
};
Object.defineProperty(Close, "__esModule", { value: true });
var jsx_runtime_1$5 = jsxRuntimeExports;
var SvgClose = function(props) {
  return (0, jsx_runtime_1$5.jsxs)("svg", __assign$g({ xmlns: "http://www.w3.org/2000/svg", height: 24, viewBox: "0 0 24 24", width: 24, "data-testid": "CloseIcon", role: "graphics-symbol img", focusable: "false", "aria-hidden": "true" }, props, { children: [(0, jsx_runtime_1$5.jsx)("path", { d: "M0 0h24v24H0z", fill: "none" }), (0, jsx_runtime_1$5.jsx)("path", { d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" })] }));
};
var _default$5 = Close.default = SvgClose;
var YesNo = /* @__PURE__ */ ((YesNo2) => {
  YesNo2["YES"] = "YES";
  YesNo2["NO"] = "NO";
  return YesNo2;
})(YesNo || {});
var DP = 20, RM = 1, MAX_DP = 1e6, MAX_POWER = 1e6, NE = -7, PE = 21, STRICT = false, NAME = "[big.js] ", INVALID$3 = NAME + "Invalid ", INVALID_DP = INVALID$3 + "decimal places", INVALID_RM = INVALID$3 + "rounding mode", DIV_BY_ZERO = NAME + "Division by zero", P = {}, UNDEFINED = void 0, NUMERIC = /^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;
function _Big_() {
  function Big2(n2) {
    var x2 = this;
    if (!(x2 instanceof Big2)) return n2 === UNDEFINED ? _Big_() : new Big2(n2);
    if (n2 instanceof Big2) {
      x2.s = n2.s;
      x2.e = n2.e;
      x2.c = n2.c.slice();
    } else {
      if (typeof n2 !== "string") {
        if (Big2.strict === true && typeof n2 !== "bigint") {
          throw TypeError(INVALID$3 + "value");
        }
        n2 = n2 === 0 && 1 / n2 < 0 ? "-0" : String(n2);
      }
      parse$1(x2, n2);
    }
    x2.constructor = Big2;
  }
  Big2.prototype = P;
  Big2.DP = DP;
  Big2.RM = RM;
  Big2.NE = NE;
  Big2.PE = PE;
  Big2.strict = STRICT;
  Big2.roundDown = 0;
  Big2.roundHalfUp = 1;
  Big2.roundHalfEven = 2;
  Big2.roundUp = 3;
  return Big2;
}
function parse$1(x2, n2) {
  var e, i, nl2;
  if (!NUMERIC.test(n2)) {
    throw Error(INVALID$3 + "number");
  }
  x2.s = n2.charAt(0) == "-" ? (n2 = n2.slice(1), -1) : 1;
  if ((e = n2.indexOf(".")) > -1) n2 = n2.replace(".", "");
  if ((i = n2.search(/e/i)) > 0) {
    if (e < 0) e = i;
    e += +n2.slice(i + 1);
    n2 = n2.substring(0, i);
  } else if (e < 0) {
    e = n2.length;
  }
  nl2 = n2.length;
  for (i = 0; i < nl2 && n2.charAt(i) == "0"; ) ++i;
  if (i == nl2) {
    x2.c = [x2.e = 0];
  } else {
    for (; nl2 > 0 && n2.charAt(--nl2) == "0"; ) ;
    x2.e = e - i - 1;
    x2.c = [];
    for (e = 0; i <= nl2; ) x2.c[e++] = +n2.charAt(i++);
  }
  return x2;
}
function round(x2, sd2, rm, more) {
  var xc2 = x2.c;
  if (rm === UNDEFINED) rm = x2.constructor.RM;
  if (rm !== 0 && rm !== 1 && rm !== 2 && rm !== 3) {
    throw Error(INVALID_RM);
  }
  if (sd2 < 1) {
    more = rm === 3 && (more || !!xc2[0]) || sd2 === 0 && (rm === 1 && xc2[0] >= 5 || rm === 2 && (xc2[0] > 5 || xc2[0] === 5 && (more || xc2[1] !== UNDEFINED)));
    xc2.length = 1;
    if (more) {
      x2.e = x2.e - sd2 + 1;
      xc2[0] = 1;
    } else {
      xc2[0] = x2.e = 0;
    }
  } else if (sd2 < xc2.length) {
    more = rm === 1 && xc2[sd2] >= 5 || rm === 2 && (xc2[sd2] > 5 || xc2[sd2] === 5 && (more || xc2[sd2 + 1] !== UNDEFINED || xc2[sd2 - 1] & 1)) || rm === 3 && (more || !!xc2[0]);
    xc2.length = sd2;
    if (more) {
      for (; ++xc2[--sd2] > 9; ) {
        xc2[sd2] = 0;
        if (sd2 === 0) {
          ++x2.e;
          xc2.unshift(1);
          break;
        }
      }
    }
    for (sd2 = xc2.length; !xc2[--sd2]; ) xc2.pop();
  }
  return x2;
}
function stringify(x2, doExponential, isNonzero) {
  var e = x2.e, s2 = x2.c.join(""), n2 = s2.length;
  if (doExponential) {
    s2 = s2.charAt(0) + (n2 > 1 ? "." + s2.slice(1) : "") + (e < 0 ? "e" : "e+") + e;
  } else if (e < 0) {
    for (; ++e; ) s2 = "0" + s2;
    s2 = "0." + s2;
  } else if (e > 0) {
    if (++e > n2) {
      for (e -= n2; e--; ) s2 += "0";
    } else if (e < n2) {
      s2 = s2.slice(0, e) + "." + s2.slice(e);
    }
  } else if (n2 > 1) {
    s2 = s2.charAt(0) + "." + s2.slice(1);
  }
  return x2.s < 0 && isNonzero ? "-" + s2 : s2;
}
P.abs = function() {
  var x2 = new this.constructor(this);
  x2.s = 1;
  return x2;
};
P.cmp = function(y2) {
  var isneg, x2 = this, xc2 = x2.c, yc2 = (y2 = new x2.constructor(y2)).c, i = x2.s, j = y2.s, k2 = x2.e, l2 = y2.e;
  if (!xc2[0] || !yc2[0]) return !xc2[0] ? !yc2[0] ? 0 : -j : i;
  if (i != j) return i;
  isneg = i < 0;
  if (k2 != l2) return k2 > l2 ^ isneg ? 1 : -1;
  j = (k2 = xc2.length) < (l2 = yc2.length) ? k2 : l2;
  for (i = -1; ++i < j; ) {
    if (xc2[i] != yc2[i]) return xc2[i] > yc2[i] ^ isneg ? 1 : -1;
  }
  return k2 == l2 ? 0 : k2 > l2 ^ isneg ? 1 : -1;
};
P.div = function(y2) {
  var x2 = this, Big2 = x2.constructor, a = x2.c, b = (y2 = new Big2(y2)).c, k2 = x2.s == y2.s ? 1 : -1, dp = Big2.DP;
  if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
    throw Error(INVALID_DP);
  }
  if (!b[0]) {
    throw Error(DIV_BY_ZERO);
  }
  if (!a[0]) {
    y2.s = k2;
    y2.c = [y2.e = 0];
    return y2;
  }
  var bl2, bt, n2, cmp, ri2, bz = b.slice(), ai2 = bl2 = b.length, al2 = a.length, r2 = a.slice(0, bl2), rl2 = r2.length, q2 = y2, qc2 = q2.c = [], qi2 = 0, p2 = dp + (q2.e = x2.e - y2.e) + 1;
  q2.s = k2;
  k2 = p2 < 0 ? 0 : p2;
  bz.unshift(0);
  for (; rl2++ < bl2; ) r2.push(0);
  do {
    for (n2 = 0; n2 < 10; n2++) {
      if (bl2 != (rl2 = r2.length)) {
        cmp = bl2 > rl2 ? 1 : -1;
      } else {
        for (ri2 = -1, cmp = 0; ++ri2 < bl2; ) {
          if (b[ri2] != r2[ri2]) {
            cmp = b[ri2] > r2[ri2] ? 1 : -1;
            break;
          }
        }
      }
      if (cmp < 0) {
        for (bt = rl2 == bl2 ? b : bz; rl2; ) {
          if (r2[--rl2] < bt[rl2]) {
            ri2 = rl2;
            for (; ri2 && !r2[--ri2]; ) r2[ri2] = 9;
            --r2[ri2];
            r2[rl2] += 10;
          }
          r2[rl2] -= bt[rl2];
        }
        for (; !r2[0]; ) r2.shift();
      } else {
        break;
      }
    }
    qc2[qi2++] = cmp ? n2 : ++n2;
    if (r2[0] && cmp) r2[rl2] = a[ai2] || 0;
    else r2 = [a[ai2]];
  } while ((ai2++ < al2 || r2[0] !== UNDEFINED) && k2--);
  if (!qc2[0] && qi2 != 1) {
    qc2.shift();
    q2.e--;
    p2--;
  }
  if (qi2 > p2) round(q2, p2, Big2.RM, r2[0] !== UNDEFINED);
  return q2;
};
P.eq = function(y2) {
  return this.cmp(y2) === 0;
};
P.gt = function(y2) {
  return this.cmp(y2) > 0;
};
P.gte = function(y2) {
  return this.cmp(y2) > -1;
};
P.lt = function(y2) {
  return this.cmp(y2) < 0;
};
P.lte = function(y2) {
  return this.cmp(y2) < 1;
};
P.minus = P.sub = function(y2) {
  var i, j, t2, xlty, x2 = this, Big2 = x2.constructor, a = x2.s, b = (y2 = new Big2(y2)).s;
  if (a != b) {
    y2.s = -b;
    return x2.plus(y2);
  }
  var xc2 = x2.c.slice(), xe = x2.e, yc2 = y2.c, ye = y2.e;
  if (!xc2[0] || !yc2[0]) {
    if (yc2[0]) {
      y2.s = -b;
    } else if (xc2[0]) {
      y2 = new Big2(x2);
    } else {
      y2.s = 1;
    }
    return y2;
  }
  if (a = xe - ye) {
    if (xlty = a < 0) {
      a = -a;
      t2 = xc2;
    } else {
      ye = xe;
      t2 = yc2;
    }
    t2.reverse();
    for (b = a; b--; ) t2.push(0);
    t2.reverse();
  } else {
    j = ((xlty = xc2.length < yc2.length) ? xc2 : yc2).length;
    for (a = b = 0; b < j; b++) {
      if (xc2[b] != yc2[b]) {
        xlty = xc2[b] < yc2[b];
        break;
      }
    }
  }
  if (xlty) {
    t2 = xc2;
    xc2 = yc2;
    yc2 = t2;
    y2.s = -y2.s;
  }
  if ((b = (j = yc2.length) - (i = xc2.length)) > 0) for (; b--; ) xc2[i++] = 0;
  for (b = i; j > a; ) {
    if (xc2[--j] < yc2[j]) {
      for (i = j; i && !xc2[--i]; ) xc2[i] = 9;
      --xc2[i];
      xc2[j] += 10;
    }
    xc2[j] -= yc2[j];
  }
  for (; xc2[--b] === 0; ) xc2.pop();
  for (; xc2[0] === 0; ) {
    xc2.shift();
    --ye;
  }
  if (!xc2[0]) {
    y2.s = 1;
    xc2 = [ye = 0];
  }
  y2.c = xc2;
  y2.e = ye;
  return y2;
};
P.mod = function(y2) {
  var ygtx, x2 = this, Big2 = x2.constructor, a = x2.s, b = (y2 = new Big2(y2)).s;
  if (!y2.c[0]) {
    throw Error(DIV_BY_ZERO);
  }
  x2.s = y2.s = 1;
  ygtx = y2.cmp(x2) == 1;
  x2.s = a;
  y2.s = b;
  if (ygtx) return new Big2(x2);
  a = Big2.DP;
  b = Big2.RM;
  Big2.DP = Big2.RM = 0;
  x2 = x2.div(y2);
  Big2.DP = a;
  Big2.RM = b;
  return this.minus(x2.times(y2));
};
P.neg = function() {
  var x2 = new this.constructor(this);
  x2.s = -x2.s;
  return x2;
};
P.plus = P.add = function(y2) {
  var e, k2, t2, x2 = this, Big2 = x2.constructor;
  y2 = new Big2(y2);
  if (x2.s != y2.s) {
    y2.s = -y2.s;
    return x2.minus(y2);
  }
  var xe = x2.e, xc2 = x2.c, ye = y2.e, yc2 = y2.c;
  if (!xc2[0] || !yc2[0]) {
    if (!yc2[0]) {
      if (xc2[0]) {
        y2 = new Big2(x2);
      } else {
        y2.s = x2.s;
      }
    }
    return y2;
  }
  xc2 = xc2.slice();
  if (e = xe - ye) {
    if (e > 0) {
      ye = xe;
      t2 = yc2;
    } else {
      e = -e;
      t2 = xc2;
    }
    t2.reverse();
    for (; e--; ) t2.push(0);
    t2.reverse();
  }
  if (xc2.length - yc2.length < 0) {
    t2 = yc2;
    yc2 = xc2;
    xc2 = t2;
  }
  e = yc2.length;
  for (k2 = 0; e; xc2[e] %= 10) k2 = (xc2[--e] = xc2[e] + yc2[e] + k2) / 10 | 0;
  if (k2) {
    xc2.unshift(k2);
    ++ye;
  }
  for (e = xc2.length; xc2[--e] === 0; ) xc2.pop();
  y2.c = xc2;
  y2.e = ye;
  return y2;
};
P.pow = function(n2) {
  var x2 = this, one = new x2.constructor("1"), y2 = one, isneg = n2 < 0;
  if (n2 !== ~~n2 || n2 < -MAX_POWER || n2 > MAX_POWER) {
    throw Error(INVALID$3 + "exponent");
  }
  if (isneg) n2 = -n2;
  for (; ; ) {
    if (n2 & 1) y2 = y2.times(x2);
    n2 >>= 1;
    if (!n2) break;
    x2 = x2.times(x2);
  }
  return isneg ? one.div(y2) : y2;
};
P.prec = function(sd2, rm) {
  if (sd2 !== ~~sd2 || sd2 < 1 || sd2 > MAX_DP) {
    throw Error(INVALID$3 + "precision");
  }
  return round(new this.constructor(this), sd2, rm);
};
P.round = function(dp, rm) {
  if (dp === UNDEFINED) dp = 0;
  else if (dp !== ~~dp || dp < -MAX_DP || dp > MAX_DP) {
    throw Error(INVALID_DP);
  }
  return round(new this.constructor(this), dp + this.e + 1, rm);
};
P.sqrt = function() {
  var r2, c, t2, x2 = this, Big2 = x2.constructor, s2 = x2.s, e = x2.e, half = new Big2("0.5");
  if (!x2.c[0]) return new Big2(x2);
  if (s2 < 0) {
    throw Error(NAME + "No square root");
  }
  s2 = Math.sqrt(x2 + "");
  if (s2 === 0 || s2 === 1 / 0) {
    c = x2.c.join("");
    if (!(c.length + e & 1)) c += "0";
    s2 = Math.sqrt(c);
    e = ((e + 1) / 2 | 0) - (e < 0 || e & 1);
    r2 = new Big2((s2 == 1 / 0 ? "5e" : (s2 = s2.toExponential()).slice(0, s2.indexOf("e") + 1)) + e);
  } else {
    r2 = new Big2(s2 + "");
  }
  e = r2.e + (Big2.DP += 4);
  do {
    t2 = r2;
    r2 = half.times(t2.plus(x2.div(t2)));
  } while (t2.c.slice(0, e).join("") !== r2.c.slice(0, e).join(""));
  return round(r2, (Big2.DP -= 4) + r2.e + 1, Big2.RM);
};
P.times = P.mul = function(y2) {
  var c, x2 = this, Big2 = x2.constructor, xc2 = x2.c, yc2 = (y2 = new Big2(y2)).c, a = xc2.length, b = yc2.length, i = x2.e, j = y2.e;
  y2.s = x2.s == y2.s ? 1 : -1;
  if (!xc2[0] || !yc2[0]) {
    y2.c = [y2.e = 0];
    return y2;
  }
  y2.e = i + j;
  if (a < b) {
    c = xc2;
    xc2 = yc2;
    yc2 = c;
    j = a;
    a = b;
    b = j;
  }
  for (c = new Array(j = a + b); j--; ) c[j] = 0;
  for (i = b; i--; ) {
    b = 0;
    for (j = a + i; j > i; ) {
      b = c[j] + yc2[i] * xc2[j - i - 1] + b;
      c[j--] = b % 10;
      b = b / 10 | 0;
    }
    c[j] = b;
  }
  if (b) ++y2.e;
  else c.shift();
  for (i = c.length; !c[--i]; ) c.pop();
  y2.c = c;
  return y2;
};
P.toExponential = function(dp, rm) {
  var x2 = this, n2 = x2.c[0];
  if (dp !== UNDEFINED) {
    if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
      throw Error(INVALID_DP);
    }
    x2 = round(new x2.constructor(x2), ++dp, rm);
    for (; x2.c.length < dp; ) x2.c.push(0);
  }
  return stringify(x2, true, !!n2);
};
P.toFixed = function(dp, rm) {
  var x2 = this, n2 = x2.c[0];
  if (dp !== UNDEFINED) {
    if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
      throw Error(INVALID_DP);
    }
    x2 = round(new x2.constructor(x2), dp + x2.e + 1, rm);
    for (dp = dp + x2.e + 1; x2.c.length < dp; ) x2.c.push(0);
  }
  return stringify(x2, false, !!n2);
};
P[Symbol.for("nodejs.util.inspect.custom")] = P.toJSON = P.toString = function() {
  var x2 = this, Big2 = x2.constructor;
  return stringify(x2, x2.e <= Big2.NE || x2.e >= Big2.PE, !!x2.c[0]);
};
P.toNumber = function() {
  var n2 = Number(stringify(this, true, true));
  if (this.constructor.strict === true && !this.eq(n2.toString())) {
    throw Error(NAME + "Imprecise conversion");
  }
  return n2;
};
P.toPrecision = function(sd2, rm) {
  var x2 = this, Big2 = x2.constructor, n2 = x2.c[0];
  if (sd2 !== UNDEFINED) {
    if (sd2 !== ~~sd2 || sd2 < 1 || sd2 > MAX_DP) {
      throw Error(INVALID$3 + "precision");
    }
    x2 = round(new Big2(x2), sd2, rm);
    for (; x2.c.length < sd2; ) x2.c.push(0);
  }
  return stringify(x2, sd2 <= x2.e || x2.e <= Big2.NE || x2.e >= Big2.PE, !!n2);
};
P.valueOf = function() {
  var x2 = this, Big2 = x2.constructor;
  if (Big2.strict === true) {
    throw Error(NAME + "valueOf disallowed");
  }
  return stringify(x2, x2.e <= Big2.NE || x2.e >= Big2.PE, true);
};
var Big = _Big_();
const big = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Big,
  default: Big
}, Symbol.toStringTag, { value: "Module" }));
var MathUtil;
((MathUtil2) => {
  MathUtil2.BIG_ZERO = Big(0);
  MathUtil2.BIG_ONE = Big(1);
  MathUtil2.BIG_100 = Big(100);
  function round2(value, scale = 2) {
    return value.round(scale, Big.roundHalfUp);
  }
  MathUtil2.round = round2;
  function floor(b) {
    if (b.lt(MathUtil2.BIG_ZERO)) {
      return b.round(0, Big.roundUp);
    } else {
      return b.round(0, Big.roundDown);
    }
  }
  MathUtil2.floor = floor;
  function fMin(a, b) {
    return a.lte(b) ? a : b;
  }
  MathUtil2.fMin = fMin;
  function fMax(a, b) {
    return a.gte(b) ? a : b;
  }
  MathUtil2.fMax = fMax;
  function isEqual(a, b) {
    return a.eq(b);
  }
  MathUtil2.isEqual = isEqual;
  function greater(a, b) {
    return a.gt(b);
  }
  MathUtil2.greater = greater;
  function lessOrEqual(a, b) {
    return a.lte(b);
  }
  MathUtil2.lessOrEqual = lessOrEqual;
})(MathUtil || (MathUtil = {}));
var ErwerbsTaetigkeit = /* @__PURE__ */ ((ErwerbsTaetigkeit2) => {
  ErwerbsTaetigkeit2["SELBSTSTAENDIG"] = "SELBSTSTAENDIG";
  ErwerbsTaetigkeit2["NICHT_SELBSTSTAENDIG"] = "NICHT_SELBSTSTAENDIG";
  ErwerbsTaetigkeit2["MINIJOB"] = "MINIJOB";
  return ErwerbsTaetigkeit2;
})(ErwerbsTaetigkeit || {});
const ANZAHL_MONATE_PRO_JAHR$2 = 12;
class MischEkTaetigkeit {
  constructor(falseOrTrue = false) {
    this.erwerbsTaetigkeit = "NICHT_SELBSTSTAENDIG";
    this.bruttoEinkommenDurchschnitt = MathUtil.BIG_ZERO;
    this.bruttoEinkommenDurchschnittMidi = MathUtil.BIG_ZERO;
    this.bemessungsZeitraumMonate = [];
    this.rentenVersicherungsPflichtig = YesNo.YES;
    this.krankenVersicherungsPflichtig = YesNo.YES;
    this.arbeitslosenVersicherungsPflichtig = YesNo.YES;
    this.bemessungsZeitraumMonate = new Array(ANZAHL_MONATE_PRO_JAHR$2).fill(
      falseOrTrue
    );
  }
  getAnzahlBemessungsZeitraumMonate() {
    return this.bemessungsZeitraumMonate.filter((value) => value).length;
  }
}
var EgrBerechnungParamId;
((EgrBerechnungParamId2) => {
  EgrBerechnungParamId2.F_FAKTOR = Big(0.7509);
  EgrBerechnungParamId2.SATZ_KVPV_BEEG = Big(0.09);
  EgrBerechnungParamId2.SATZ_RV_BEEG = Big(0.1);
  EgrBerechnungParamId2.SATZ_ALV_BEEG = Big(0.02);
  EgrBerechnungParamId2.BETRAG_MEHRLINGSZUSCHLAG = Big(300);
  EgrBerechnungParamId2.MIN_GESCHWISTERBONUS = Big(75);
  EgrBerechnungParamId2.RATE_BONUS = Big(0.1);
  EgrBerechnungParamId2.ERSATZRATE1 = Big(0.67);
  EgrBerechnungParamId2.ERSATZRATE2 = Big(0.65);
  EgrBerechnungParamId2.HOECHSTSATZ = Big(1800);
  EgrBerechnungParamId2.MINDESTSATZ = Big(300);
  EgrBerechnungParamId2.GRENZE1 = Big(1240);
  EgrBerechnungParamId2.GRENZE2 = Big(1200);
  EgrBerechnungParamId2.GRENZE3 = Big(1e3);
  EgrBerechnungParamId2.HOECHST_ET = Big(2770);
  EgrBerechnungParamId2.GRENZE_MINI_MIDI = Big(520);
  EgrBerechnungParamId2.GRENZE_MIDI_MAX = Big(1300);
  EgrBerechnungParamId2.PAUSCH = Big(1e3).div(Big(12)).prec(Big.DP, Big.RM);
  EgrBerechnungParamId2.MAX_EINKOMMEN_ALLEIN = 2e5;
  EgrBerechnungParamId2.MAX_EINKOMMEN_BEIDE = 2e5;
})(EgrBerechnungParamId || (EgrBerechnungParamId = {}));
class Einkommen {
  constructor(value) {
    this._value = Big(0);
    this.value = value;
  }
  set value(value) {
    this._value = Big(value).round(2, Big.roundHalfUp);
  }
  get value() {
    return this._value;
  }
}
var ElternGeldArt = /* @__PURE__ */ ((ElternGeldArt2) => {
  ElternGeldArt2["KEIN_BEZUG"] = "KEIN_BEZUG";
  ElternGeldArt2["BASIS_ELTERNGELD"] = "BASIS_ELTERNGELD";
  ElternGeldArt2["ELTERNGELD_PLUS"] = "ELTERNGELD_PLUS";
  ElternGeldArt2["PARTNERSCHAFTS_BONUS"] = "PARTNERSCHAFTS_BONUS";
  return ElternGeldArt2;
})(ElternGeldArt || {});
var ElternGeldKategorie = /* @__PURE__ */ ((ElternGeldKategorie2) => {
  ElternGeldKategorie2[ElternGeldKategorie2["KEIN_ELTERN_GELD"] = 0] = "KEIN_ELTERN_GELD";
  ElternGeldKategorie2[ElternGeldKategorie2["BASIS_ELTERN_GELD"] = 1] = "BASIS_ELTERN_GELD";
  ElternGeldKategorie2[ElternGeldKategorie2["BASIS_ELTERN_GELD_MIT_ERWERBS_TAETIGKEIT"] = 2] = "BASIS_ELTERN_GELD_MIT_ERWERBS_TAETIGKEIT";
  ElternGeldKategorie2[ElternGeldKategorie2["ELTERN_GELD_PLUS_OHNE_ERWERBS_TAETIGKEIT"] = 3] = "ELTERN_GELD_PLUS_OHNE_ERWERBS_TAETIGKEIT";
  ElternGeldKategorie2[ElternGeldKategorie2["ELTERN_GELD_PLUS_MIT_ERWERBS_TAETIGKEIT"] = 4] = "ELTERN_GELD_PLUS_MIT_ERWERBS_TAETIGKEIT";
  return ElternGeldKategorie2;
})(ElternGeldKategorie || {});
var ErwerbsArt = /* @__PURE__ */ ((ErwerbsArt2) => {
  ErwerbsArt2["NEIN"] = "NEIN";
  ErwerbsArt2["JA_SELBSTSTAENDIG"] = "JA_SELBSTSTAENDIG";
  ErwerbsArt2["JA_NICHT_SELBST_MIT_SOZI"] = "JA_NICHT_SELBST_MIT_SOZI";
  ErwerbsArt2["JA_NICHT_SELBST_MINI"] = "JA_NICHT_SELBST_MINI";
  ErwerbsArt2["JA_NICHT_SELBST_OHNE_SOZI"] = "JA_NICHT_SELBST_OHNE_SOZI";
  ErwerbsArt2["JA_MISCHEINKOMMEN"] = "JA_MISCHEINKOMMEN";
  return ErwerbsArt2;
})(ErwerbsArt || {});
const PLANUNG_ANZAHL_MONATE = 32;
class PlanungsDaten {
  constructor(alleinerziehend, erwerbsStatus, partnerBonus, mutterschaftsLeistung) {
    this.alleinerziehend = alleinerziehend;
    this.erwerbsStatus = erwerbsStatus;
    this.partnerBonus = partnerBonus;
    this.mutterschaftsLeistung = mutterschaftsLeistung;
    this.planung = PlanungsDaten.createEmptyPlanung();
  }
  // public isAlleinerziehendJN(): boolean {
  //   return this.getAlleinerziehend() === de.init.anton.plugins.egr.fwl.YesNo.YES;
  // }
  //
  // public isErwerbstaetigJN(): boolean {
  //   return this.getErwerbstatus() === de.init.anton.plugins.egr.fwl.YesNo.YES;
  // }
  //
  // public isEmptyPlanung(): boolean {
  //   for (let index = 0; index < this.planung.length; index++) {
  //     let monat = this.planung[index];
  //     {
  //       if (monat.getElterngeldArt() !== de.init.anton.plugins.egr.fwl.ElterngeldArt.KEIN_BEZUG) {
  //         return false;
  //       }
  //     }
  //   }
  //   return true;
  // }
  //
  // public hasPartnerbonusJN(): boolean {
  //   return this.partnerbonus === de.init.anton.plugins.egr.fwl.YesNo.YES;
  // }
  //
  // public getPlanungIntList(): Array<number> {
  //   const intList: Array<number> = <any>([]);
  //   for (let index = 0; index < this.planung.length; index++) {
  //     let monat = this.planung[index];
  //     {
  //       /* add */
  //       (intList.push(de.init.anton.plugins.egr.fwl.ElterngeldArt["_$wrappers"][monat.getElterngeldArt()].getIndex()) > 0);
  //     }
  //   }
  //   return intList;
  // }
  //
  // /**
  //  * Planungswerte als String, Javascript FunktionalitÃ¤t greift hierauf zu.
  //  *
  //  * @return
  //  * @return {string}
  //  */
  // public getPlanungValues(): string {
  //   if (this.planung == null || /* isEmpty */(this.planung.length == 0)) {
  //     return this.createEmptyPlanung();
  //   }
  //   const sb: { str: string, toString: Function } = {
  //     str: "", toString: function () {
  //       return this.str;
  //     }
  //   };
  //   for (let index = 0; index < this.planung.length; index++) {
  //     let monat = this.planung[index];
  //     {
  //       /* append */
  //       (sb => {
  //         sb.str += <any>de.init.anton.plugins.egr.fwl.ElterngeldArt["_$wrappers"][monat.getElterngeldArt()].getIndex();
  //         return sb;
  //       })(sb);
  //       /* append */
  //       (sb => {
  //         sb.str += <any>",";
  //         return sb;
  //       })(sb);
  //     }
  //   }
  //   return this.cutLastComma(/* toString */sb.str);
  // }
  //
  // /*private*/
  // cutLastComma(values: string): string {
  //   if (values == null) {
  //     values = "";
  //   }
  //   if (/* endsWith */((str, searchString) => {
  //     let pos = str.length - searchString.length;
  //     let lastIndex = str.indexOf(searchString, pos);
  //     return lastIndex !== -1 && lastIndex === pos;
  //   })(values, ",") && values.length >= 2) {
  //     values = values.substring(0, values.length - 1);
  //   } else {
  //     values = /* replace */values.split(",").join("");
  //   }
  //   return values;
  // }
  //
  // public setPlanungValues$java_util_List(listPlanungIdx: Array<number>) {
  //   if (listPlanungIdx != null && !/* isEmpty */(listPlanungIdx.length == 0)) {
  //     let lebensMonat: number = 0;
  //     for (let index = 0; index < listPlanungIdx.length; index++) {
  //       let idx = listPlanungIdx[index];
  //       {
  //         if (idx >= 0 && idx <= 3) {
  //           this.set(++lebensMonat, /* Enum.values */function () {
  //             let result: de.init.anton.plugins.egr.fwl.ElterngeldArt[] = [];
  //             for (let val in de.init.anton.plugins.egr.fwl.ElterngeldArt) {
  //               if (!isNaN(<any>val)) {
  //                 result.push(parseInt(val, 10));
  //               }
  //             }
  //             return result;
  //           }()[idx]);
  //         } else {
  //         }
  //       }
  //     }
  //   }
  // }
  //
  // public setPlanungValues$java_lang_String(planungValues: string) {
  //   this.setPlanungValues$java_lang_String$java_lang_String(planungValues, ",");
  // }
  //
  // public setPlanungValues$java_lang_String$java_lang_String(planungValues: string, splitRegEx: string) {
  //   const planungValuesArray: string[] = planungValues.split(splitRegEx);
  //   if (planungValuesArray.length !== Planungsdaten.ANZAHL_MONATE) {
  //   }
  //   let lebensMonat: number = 0;
  //   for (let index = 0; index < planungValuesArray.length; index++) {
  //     let value = planungValuesArray[index];
  //     {
  //       const elterngeldIndex: number = /* parseInt */parseInt(value);
  //       if (elterngeldIndex >= 0 && elterngeldIndex <= 3) {
  //         this.set(++lebensMonat, /* Enum.values */function () {
  //           let result: de.init.anton.plugins.egr.fwl.ElterngeldArt[] = [];
  //           for (let val in de.init.anton.plugins.egr.fwl.ElterngeldArt) {
  //             if (!isNaN(<any>val)) {
  //               result.push(parseInt(val, 10));
  //             }
  //           }
  //           return result;
  //         }()[elterngeldIndex]);
  //       } else {
  //       }
  //     }
  //   }
  // }
  //
  // public setPlanungValues(planungValues?: any, splitRegEx?: any) {
  //   if (((typeof planungValues === 'string') || planungValues === null) && ((typeof splitRegEx === 'string') || splitRegEx === null)) {
  //     return <any>this.setPlanungValues$java_lang_String$java_lang_String(planungValues, splitRegEx);
  //   } else if (((planungValues != null && (planungValues instanceof Array)) || planungValues === null) && splitRegEx === undefined) {
  //     return <any>this.setPlanungValues$java_util_List(planungValues);
  //   } else if (((typeof planungValues === 'string') || planungValues === null) && splitRegEx === undefined) {
  //     return <any>this.setPlanungValues$java_lang_String(planungValues);
  //   } else throw new Error('invalid overload');
  // }
  //
  // /*private*/
  // createEmptyPlanung(): string {
  //   const sb: { str: string, toString: Function } = {
  //     str: "", toString: function () {
  //       return this.str;
  //     }
  //   };
  //   for (let i: number = 1; i <= Planungsdaten.ANZAHL_MONATE; i++) {
  //     {
  //       /* append */
  //       (sb => {
  //         sb.str += <any>"0,";
  //         return sb;
  //       })(sb);
  //     }
  //     ;
  //   }
  //   const result: string = /* toString */sb.str.substring(0, /* toString */sb.str.length - 2);
  //   return result;
  // }
  //
  /**
   * Gibt die Elterngeldart für einen anhand des Index spezifizierten Monats zurück.
   *
   * @param {number} lebensMonat Lebensmonat des Kindes (nicht Index!!!)
   * @return {ElternGeldArt} ElterngeldArt des abgefragten Monats
   */
  get(lebensMonat) {
    const index = lebensMonat - 1;
    if (lebensMonat > PLANUNG_ANZAHL_MONATE) {
      return ElternGeldArt.KEIN_BEZUG;
    }
    return this.planung[index];
  }
  // public getPlanungBezugsarten(): Array<de.init.anton.plugins.egr.fwl.ElterngeldArt> {
  //   const result: Array<de.init.anton.plugins.egr.fwl.ElterngeldArt> = <any>([]);
  //   {
  //     let array = this.getPlanung();
  //     for (let index = 0; index < array.length; index++) {
  //       let monat = array[index];
  //       {
  //         /* add */
  //         (result.push(monat.getElterngeldArt()) > 0);
  //       }
  //     }
  //   }
  //   return result;
  // }
  static createEmptyPlanung() {
    const planungList = [];
    for (let i = 0; i < PLANUNG_ANZAHL_MONATE; i++) {
      planungList[i] = ElternGeldArt.KEIN_BEZUG;
    }
    return planungList;
  }
}
class ErwerbsZeitraumLebensMonat {
  constructor() {
    this.vonLebensMonat = 0;
    this.bisLebensMonat = 0;
    this.bruttoProMonat = new Einkommen(0);
  }
  // TODO TW prüfen, ob die Felder noch benötigt werden.
  // nettoProMonat: NettoEinkommen = new Einkommen(0);
  // endeEGPeriode: number | null = null;
  // anfangEGPeriode: number | null = null;
  getAnzahlMonate() {
    if (!this.isVonEqualOrLessBis() || this.isLMTooHigh() || this.isLMTooSmall()) {
      return 0;
    }
    return this.bisLebensMonat - this.vonLebensMonat + 1;
  }
  getLebensMonateList() {
    if (!this.isVonEqualOrLessBis() || this.isLMTooHigh() || this.isLMTooSmall()) {
      return [];
    }
    const lebensMonate = [];
    for (let lebensMonat = this.vonLebensMonat; lebensMonat <= this.bisLebensMonat; lebensMonat++) {
      lebensMonate.push(lebensMonat);
    }
    return lebensMonate;
  }
  isVonEqualOrLessBis() {
    return this.vonLebensMonat <= this.bisLebensMonat;
  }
  isLMTooHigh() {
    return this.vonLebensMonat > PLANUNG_ANZAHL_MONATE || this.bisLebensMonat > PLANUNG_ANZAHL_MONATE;
  }
  isLMTooSmall() {
    return this.vonLebensMonat <= 0 || this.bisLebensMonat <= 0;
  }
}
function zaehleMonateErwerbsTaetigkeit(erwerbsZeitraeume) {
  let anzahlMonate = 0;
  if (erwerbsZeitraeume == null || erwerbsZeitraeume.length === 0 || erwerbsZeitraeume[0].vonLebensMonat == null) {
    return 0;
  }
  for (let index = 0; index < erwerbsZeitraeume.length; index++) {
    const curr = erwerbsZeitraeume[index];
    anzahlMonate += curr.getAnzahlMonate();
  }
  return anzahlMonate;
}
var KassenArt = /* @__PURE__ */ ((KassenArt2) => {
  KassenArt2["GESETZLICH_PFLICHTVERSICHERT"] = "GESETZLICH_PFLICHTVERSICHERT";
  KassenArt2["NICHT_GESETZLICH_PFLICHTVERSICHERT"] = "NICHT_GESETZLICH_PFLICHTVERSICHERT";
  return KassenArt2;
})(KassenArt || {});
var KinderFreiBetrag = /* @__PURE__ */ ((KinderFreiBetrag2) => {
  KinderFreiBetrag2["ZKF0"] = "0";
  KinderFreiBetrag2["ZKF0_5"] = "0,5";
  KinderFreiBetrag2["ZKF1"] = "1";
  KinderFreiBetrag2["ZKF1_5"] = "1,5";
  KinderFreiBetrag2["ZKF2"] = "2";
  KinderFreiBetrag2["ZKF2_5"] = "2,5";
  KinderFreiBetrag2["ZKF3"] = "3";
  KinderFreiBetrag2["ZKF3_5"] = "3,5";
  KinderFreiBetrag2["ZKF4"] = "4";
  KinderFreiBetrag2["ZKF4_5"] = "4,5";
  KinderFreiBetrag2["ZKF5"] = "5";
  return KinderFreiBetrag2;
})(KinderFreiBetrag || {});
function kinderFreiBetragToNumber(kinderFreiBetrag) {
  return Number.parseFloat(kinderFreiBetrag.valueOf().replace(",", "."));
}
var SteuerKlasse = /* @__PURE__ */ ((SteuerKlasse2) => {
  SteuerKlasse2["SKL_UNBEKANNT"] = "UNBEKANNT";
  SteuerKlasse2["SKL1"] = "1";
  SteuerKlasse2["SKL2"] = "2";
  SteuerKlasse2["SKL3"] = "3";
  SteuerKlasse2["SKL4"] = "4";
  SteuerKlasse2["SKL4_FAKTOR"] = "4 mit Faktor";
  SteuerKlasse2["SKL5"] = "5";
  SteuerKlasse2["SKL6"] = "6";
  return SteuerKlasse2;
})(SteuerKlasse || {});
function steuerklasseToNumber(steuerKlasse) {
  switch (steuerKlasse) {
    case "1":
      return 1;
    case "2":
      return 2;
    case "3":
      return 3;
    case "4":
    case "4 mit Faktor":
      return 4;
    case "5":
      return 5;
    case "6":
      return 6;
    default:
      return void 0;
  }
}
var RentenArt = /* @__PURE__ */ ((RentenArt2) => {
  RentenArt2["GESETZLICHE_RENTEN_VERSICHERUNG"] = "GESETZLICHE_RENTEN_VERSICHERUNG";
  RentenArt2["KEINE_GESETZLICHE_RENTEN_VERSICHERUNG"] = "KEINE_GESETZLICHE_RENTEN_VERSICHERUNG";
  return RentenArt2;
})(RentenArt || {});
class FinanzDaten {
  constructor() {
    this.bruttoEinkommen = new Einkommen(0);
    this.zahlenSieKirchenSteuer = YesNo.NO;
    this.kinderFreiBetrag = KinderFreiBetrag.ZKF0;
    this.steuerKlasse = SteuerKlasse.SKL_UNBEKANNT;
    this.kassenArt = KassenArt.GESETZLICH_PFLICHTVERSICHERT;
    this.rentenVersicherung = RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG;
    this.splittingFaktor = 1;
    this.mischEinkommenTaetigkeiten = [];
    this.erwerbsZeitraumLebensMonatList = [];
  }
  /**
   * Zeigt an ob Daten für Mischeinkünfte vorliegen.
   * Wichtig: wenn keine Mischeinkommen berechnet werden soll, dann dürfen auch keine Werte da sein. Es reicht nicht,
   * die {@link PersoenlicheDaten#etVorGeburt} auf einen Wert anders als {@link ErwerbsArt#JA_MISCHEINKOMMEN} zu setzen
   *
   * @return true, wenn Daten für Mischeinkommen vorhanden sind.
   */
  isMischeinkommen() {
    return this.mischEinkommenTaetigkeiten.length > 0;
  }
  bruttoLeistungsMonate() {
    const bruttoLM = new Array(PLANUNG_ANZAHL_MONATE + 1).fill(
      MathUtil.BIG_ZERO
    );
    for (let index = 0; index < this.erwerbsZeitraumLebensMonatList.length; index++) {
      const erwerbszeitraum = this.erwerbsZeitraumLebensMonatList[index];
      for (let lm = erwerbszeitraum.vonLebensMonat; lm <= erwerbszeitraum.bisLebensMonat; lm++) {
        const bruttoProMonat = erwerbszeitraum.bruttoProMonat.value;
        if (MathUtil.greater(bruttoProMonat, MathUtil.BIG_ZERO)) {
          bruttoLM[lm] = bruttoProMonat;
        }
      }
    }
    return bruttoLM;
  }
  bruttoLeistungsMonateWithPlanung(isPlus, planungsdaten) {
    const bruttoLM = new Array(PLANUNG_ANZAHL_MONATE + 1).fill(
      MathUtil.BIG_ZERO
    );
    for (let index = 0; index < this.erwerbsZeitraumLebensMonatList.length; index++) {
      const erwerbszeitraum = this.erwerbsZeitraumLebensMonatList[index];
      for (let lm = erwerbszeitraum.vonLebensMonat; lm <= erwerbszeitraum.bisLebensMonat; lm++) {
        const bruttoProMonat = erwerbszeitraum.bruttoProMonat.value;
        if (MathUtil.greater(bruttoProMonat, MathUtil.BIG_ZERO)) {
          const elterngeldArt = planungsdaten.planung[lm - 1];
          if (isPlus) {
            if (elterngeldArt === ElternGeldArt.PARTNERSCHAFTS_BONUS || elterngeldArt === ElternGeldArt.ELTERNGELD_PLUS) {
              bruttoLM[lm] = bruttoProMonat;
            }
          } else {
            if (elterngeldArt === ElternGeldArt.BASIS_ELTERNGELD) {
              bruttoLM[lm] = bruttoProMonat;
            }
          }
        }
      }
    }
    return bruttoLM;
  }
}
function finanzDatenOf(source) {
  const copy = new FinanzDaten();
  Object.assign(copy, source);
  return copy;
}
var MutterschaftsLeistung = /* @__PURE__ */ ((MutterschaftsLeistung2) => {
  MutterschaftsLeistung2["MUTTERSCHAFTS_LEISTUNG_NEIN"] = "MUTTERSCHAFTS_LEISTUNG_NEIN";
  MutterschaftsLeistung2["MUTTERSCHAFTS_LEISTUNG_8_WOCHEN"] = "MUTTERSCHAFTS_LEISTUNG_8_WOCHEN";
  MutterschaftsLeistung2["MUTTERSCHAFTS_LEISTUNG_12_WOCHEN"] = "MUTTERSCHAFTS_LEISTUNG_12_WOCHEN";
  return MutterschaftsLeistung2;
})(MutterschaftsLeistung || {});
function mutterschaftsLeistungInWochen(mutterschaftsLeistung) {
  switch (mutterschaftsLeistung) {
    case "MUTTERSCHAFTS_LEISTUNG_NEIN":
      return 0;
    case "MUTTERSCHAFTS_LEISTUNG_8_WOCHEN":
      return 8;
    case "MUTTERSCHAFTS_LEISTUNG_12_WOCHEN":
      return 12;
  }
}
function mutterschaftsLeistungInMonaten(mutterschaftsLeistung) {
  return mutterschaftsLeistungInWochen(mutterschaftsLeistung) / 4;
}
var KindUtil;
((KindUtil2) => {
  function findLastBornChild(kindList) {
    if (kindList.length === 0) {
      return void 0;
    }
    if (kindList.length === 1) {
      return kindList[0];
    }
    const cleanKindList = sortByGeburtsdatumExcludesFutureChildren(kindList);
    return cleanKindList[cleanKindList.length - 1];
  }
  KindUtil2.findLastBornChild = findLastBornChild;
  function findSecondLastBornChild(kindList) {
    if (kindList.length < 2) {
      return void 0;
    }
    const cleanKindList = sortByGeburtsdatumExcludesFutureChildren(kindList);
    return cleanKindList[cleanKindList.length - 2];
  }
  KindUtil2.findSecondLastBornChild = findSecondLastBornChild;
  const sortByGeburtsdatum = (kindList) => {
    return kindList.sort((a, b) => {
      var _a, _b;
      if (a.geburtsdatum === void 0) {
        if (b.geburtsdatum === void 0) {
          return 0;
        }
        return -1;
      }
      if (b.geburtsdatum === void 0) {
        return 1;
      }
      return ((_a = a.geburtsdatum) == null ? void 0 : _a.valueOf()) - ((_b = b.geburtsdatum) == null ? void 0 : _b.valueOf());
    });
  };
  KindUtil2.excludesFutureChildren = (kindList) => kindList.filter((value) => value.geburtsdatum !== void 0);
  const sortByGeburtsdatumExcludesFutureChildren = (kindList) => sortByGeburtsdatum((0, KindUtil2.excludesFutureChildren)(kindList));
})(KindUtil || (KindUtil = {}));
class PersoenlicheDaten {
  constructor(wahrscheinlichesGeburtsDatum) {
    this.wahrscheinlichesGeburtsDatum = wahrscheinlichesGeburtsDatum;
    this.sindSieAlleinerziehend = YesNo.NO;
    this.etVorGeburt = ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI;
    this.etNachGeburt = YesNo.NO;
    this.anfangLM = [];
    this.endeLM = [];
    this.anzahlKuenftigerKinder = 1;
    this.kinder = [
      {
        nummer: 1,
        geburtsdatum: void 0,
        istBehindert: false
      }
    ];
  }
  isETNachGeburt() {
    return this.etNachGeburt === YesNo.YES;
  }
  isETVorGeburt() {
    return this.etVorGeburt !== ErwerbsArt.NEIN;
  }
  isAlleinerziehend() {
    return this.sindSieAlleinerziehend === YesNo.YES;
  }
  isGeschwisterVorhanden() {
    return this.getAnzahlGeschwister() > 0;
  }
  getAnzahlGeschwister() {
    return KindUtil.excludesFutureChildren(this.kinder).length;
  }
}
function persoenlicheDatenOf(source) {
  const copy = new PersoenlicheDaten(source.wahrscheinlichesGeburtsDatum);
  Object.assign(copy, source);
  return copy;
}
function Spinner() {
  const [show, setShow] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const timeout = setTimeout(() => setShow(true), 500);
    return () => {
      clearTimeout(timeout);
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: !!show && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: nsp("spinner") }) });
}
var SaveAlt = {};
var __assign$f = commonjsGlobal && commonjsGlobal.__assign || function() {
  __assign$f = Object.assign || function(t2) {
    for (var s2, i = 1, n2 = arguments.length; i < n2; i++) {
      s2 = arguments[i];
      for (var p2 in s2) if (Object.prototype.hasOwnProperty.call(s2, p2))
        t2[p2] = s2[p2];
    }
    return t2;
  };
  return __assign$f.apply(this, arguments);
};
Object.defineProperty(SaveAlt, "__esModule", { value: true });
var jsx_runtime_1$4 = jsxRuntimeExports;
var SvgSaveAlt = function(props) {
  return (0, jsx_runtime_1$4.jsxs)("svg", __assign$f({ xmlns: "http://www.w3.org/2000/svg", height: 24, viewBox: "0 0 24 24", width: 24, "data-testid": "SaveAltIcon", role: "graphics-symbol img", focusable: "false", "aria-hidden": "true" }, props, { children: [(0, jsx_runtime_1$4.jsx)("path", { d: "M0 0h24v24H0z", fill: "none" }), (0, jsx_runtime_1$4.jsx)("path", { d: "M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z" })] }));
};
var _default$4 = SaveAlt.default = SvgSaveAlt;
const formSteps = {
  allgemeinAngaben: {
    text: "Allgemeine Angaben",
    route: "/allgemeine-angaben"
  },
  nachwuchs: {
    text: "Ihr Nachwuchs",
    route: "/nachwuchs"
  },
  erwerbstaetigkeit: {
    text: "Erwerbstätigkeit",
    route: "/erwerbstaetigkeit"
  },
  einkommen: {
    text: "Ihr Einkommen",
    route: "/einkommen"
  },
  elterngeldvarianten: {
    text: "Elterngeldvarianten",
    route: "/elterngeldvarianten"
  },
  rechnerUndPlaner: {
    text: "Rechner und Planer",
    route: "/rechner-planer"
  },
  zusammenfassungUndDaten: {
    text: "Zusammenfassung",
    route: "/zusammenfassung-und-daten"
  }
};
function formatProdErrorMessage$1(code) {
  return `Minified Redux error #${code}; visit https://redux.js.org/Errors?code=${code} for the full message or use the non-minified dev environment for full errors. `;
}
var $$observable = /* @__PURE__ */ (() => typeof Symbol === "function" && Symbol.observable || "@@observable")();
var symbol_observable_default = $$observable;
var randomString = () => Math.random().toString(36).substring(7).split("").join(".");
var ActionTypes = {
  INIT: `@@redux/INIT${/* @__PURE__ */ randomString()}`,
  REPLACE: `@@redux/REPLACE${/* @__PURE__ */ randomString()}`,
  PROBE_UNKNOWN_ACTION: () => `@@redux/PROBE_UNKNOWN_ACTION${randomString()}`
};
var actionTypes_default = ActionTypes;
function isPlainObject$1(obj) {
  if (typeof obj !== "object" || obj === null)
    return false;
  let proto = obj;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(obj) === proto || Object.getPrototypeOf(obj) === null;
}
function createStore(reducer, preloadedState, enhancer) {
  if (typeof reducer !== "function") {
    throw new Error(formatProdErrorMessage$1(2));
  }
  if (typeof preloadedState === "function" && typeof enhancer === "function" || typeof enhancer === "function" && typeof arguments[3] === "function") {
    throw new Error(formatProdErrorMessage$1(0));
  }
  if (typeof preloadedState === "function" && typeof enhancer === "undefined") {
    enhancer = preloadedState;
    preloadedState = void 0;
  }
  if (typeof enhancer !== "undefined") {
    if (typeof enhancer !== "function") {
      throw new Error(formatProdErrorMessage$1(1));
    }
    return enhancer(createStore)(reducer, preloadedState);
  }
  let currentReducer = reducer;
  let currentState = preloadedState;
  let currentListeners = /* @__PURE__ */ new Map();
  let nextListeners = currentListeners;
  let listenerIdCounter = 0;
  let isDispatching = false;
  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = /* @__PURE__ */ new Map();
      currentListeners.forEach((listener, key) => {
        nextListeners.set(key, listener);
      });
    }
  }
  function getState() {
    if (isDispatching) {
      throw new Error(formatProdErrorMessage$1(3));
    }
    return currentState;
  }
  function subscribe(listener) {
    if (typeof listener !== "function") {
      throw new Error(formatProdErrorMessage$1(4));
    }
    if (isDispatching) {
      throw new Error(formatProdErrorMessage$1(5));
    }
    let isSubscribed = true;
    ensureCanMutateNextListeners();
    const listenerId = listenerIdCounter++;
    nextListeners.set(listenerId, listener);
    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }
      if (isDispatching) {
        throw new Error(formatProdErrorMessage$1(6));
      }
      isSubscribed = false;
      ensureCanMutateNextListeners();
      nextListeners.delete(listenerId);
      currentListeners = null;
    };
  }
  function dispatch(action) {
    if (!isPlainObject$1(action)) {
      throw new Error(formatProdErrorMessage$1(7));
    }
    if (typeof action.type === "undefined") {
      throw new Error(formatProdErrorMessage$1(8));
    }
    if (typeof action.type !== "string") {
      throw new Error(formatProdErrorMessage$1(17));
    }
    if (isDispatching) {
      throw new Error(formatProdErrorMessage$1(9));
    }
    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }
    const listeners = currentListeners = nextListeners;
    listeners.forEach((listener) => {
      listener();
    });
    return action;
  }
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== "function") {
      throw new Error(formatProdErrorMessage$1(10));
    }
    currentReducer = nextReducer;
    dispatch({
      type: actionTypes_default.REPLACE
    });
  }
  function observable() {
    const outerSubscribe = subscribe;
    return {
      /**
       * The minimal observable subscription method.
       * @param observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe(observer) {
        if (typeof observer !== "object" || observer === null) {
          throw new Error(formatProdErrorMessage$1(11));
        }
        function observeState() {
          const observerAsObserver = observer;
          if (observerAsObserver.next) {
            observerAsObserver.next(getState());
          }
        }
        observeState();
        const unsubscribe = outerSubscribe(observeState);
        return {
          unsubscribe
        };
      },
      [symbol_observable_default]() {
        return this;
      }
    };
  }
  dispatch({
    type: actionTypes_default.INIT
  });
  const store2 = {
    dispatch,
    subscribe,
    getState,
    replaceReducer,
    [symbol_observable_default]: observable
  };
  return store2;
}
function assertReducerShape(reducers2) {
  Object.keys(reducers2).forEach((key) => {
    const reducer = reducers2[key];
    const initialState = reducer(void 0, {
      type: actionTypes_default.INIT
    });
    if (typeof initialState === "undefined") {
      throw new Error(formatProdErrorMessage$1(12));
    }
    if (typeof reducer(void 0, {
      type: actionTypes_default.PROBE_UNKNOWN_ACTION()
    }) === "undefined") {
      throw new Error(formatProdErrorMessage$1(13));
    }
  });
}
function combineReducers(reducers2) {
  const reducerKeys = Object.keys(reducers2);
  const finalReducers = {};
  for (let i = 0; i < reducerKeys.length; i++) {
    const key = reducerKeys[i];
    if (typeof reducers2[key] === "function") {
      finalReducers[key] = reducers2[key];
    }
  }
  const finalReducerKeys = Object.keys(finalReducers);
  let shapeAssertionError;
  try {
    assertReducerShape(finalReducers);
  } catch (e) {
    shapeAssertionError = e;
  }
  return function combination(state = {}, action) {
    if (shapeAssertionError) {
      throw shapeAssertionError;
    }
    let hasChanged = false;
    const nextState = {};
    for (let i = 0; i < finalReducerKeys.length; i++) {
      const key = finalReducerKeys[i];
      const reducer = finalReducers[key];
      const previousStateForKey = state[key];
      const nextStateForKey = reducer(previousStateForKey, action);
      if (typeof nextStateForKey === "undefined") {
        action && action.type;
        throw new Error(formatProdErrorMessage$1(14));
      }
      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    hasChanged = hasChanged || finalReducerKeys.length !== Object.keys(state).length;
    return hasChanged ? nextState : state;
  };
}
function compose(...funcs) {
  if (funcs.length === 0) {
    return (arg) => arg;
  }
  if (funcs.length === 1) {
    return funcs[0];
  }
  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}
function applyMiddleware(...middlewares) {
  return (createStore2) => (reducer, preloadedState) => {
    const store2 = createStore2(reducer, preloadedState);
    let dispatch = () => {
      throw new Error(formatProdErrorMessage$1(15));
    };
    const middlewareAPI = {
      getState: store2.getState,
      dispatch: (action, ...args) => dispatch(action, ...args)
    };
    const chain = middlewares.map((middleware) => middleware(middlewareAPI));
    dispatch = compose(...chain)(store2.dispatch);
    return {
      ...store2,
      dispatch
    };
  };
}
function isAction(action) {
  return isPlainObject$1(action) && "type" in action && typeof action.type === "string";
}
var NOTHING = Symbol.for("immer-nothing");
var DRAFTABLE = Symbol.for("immer-draftable");
var DRAFT_STATE = Symbol.for("immer-state");
function die(error, ...args) {
  throw new Error(
    `[Immer] minified error nr: ${error}. Full error at: https://bit.ly/3cXEKWf`
  );
}
var getPrototypeOf = Object.getPrototypeOf;
function isDraft(value) {
  return !!value && !!value[DRAFT_STATE];
}
function isDraftable(value) {
  var _a;
  if (!value)
    return false;
  return isPlainObject(value) || Array.isArray(value) || !!value[DRAFTABLE] || !!((_a = value.constructor) == null ? void 0 : _a[DRAFTABLE]) || isMap(value) || isSet(value);
}
var objectCtorString = Object.prototype.constructor.toString();
function isPlainObject(value) {
  if (!value || typeof value !== "object")
    return false;
  const proto = getPrototypeOf(value);
  if (proto === null) {
    return true;
  }
  const Ctor = Object.hasOwnProperty.call(proto, "constructor") && proto.constructor;
  if (Ctor === Object)
    return true;
  return typeof Ctor == "function" && Function.toString.call(Ctor) === objectCtorString;
}
function each(obj, iter) {
  if (getArchtype(obj) === 0) {
    Reflect.ownKeys(obj).forEach((key) => {
      iter(key, obj[key], obj);
    });
  } else {
    obj.forEach((entry, index) => iter(index, entry, obj));
  }
}
function getArchtype(thing) {
  const state = thing[DRAFT_STATE];
  return state ? state.type_ : Array.isArray(thing) ? 1 : isMap(thing) ? 2 : isSet(thing) ? 3 : 0;
}
function has(thing, prop) {
  return getArchtype(thing) === 2 ? thing.has(prop) : Object.prototype.hasOwnProperty.call(thing, prop);
}
function set(thing, propOrOldValue, value) {
  const t2 = getArchtype(thing);
  if (t2 === 2)
    thing.set(propOrOldValue, value);
  else if (t2 === 3) {
    thing.add(value);
  } else
    thing[propOrOldValue] = value;
}
function is(x2, y2) {
  if (x2 === y2) {
    return x2 !== 0 || 1 / x2 === 1 / y2;
  } else {
    return x2 !== x2 && y2 !== y2;
  }
}
function isMap(target) {
  return target instanceof Map;
}
function isSet(target) {
  return target instanceof Set;
}
function latest(state) {
  return state.copy_ || state.base_;
}
function shallowCopy(base, strict) {
  if (isMap(base)) {
    return new Map(base);
  }
  if (isSet(base)) {
    return new Set(base);
  }
  if (Array.isArray(base))
    return Array.prototype.slice.call(base);
  const isPlain = isPlainObject(base);
  if (strict === true || strict === "class_only" && !isPlain) {
    const descriptors = Object.getOwnPropertyDescriptors(base);
    delete descriptors[DRAFT_STATE];
    let keys = Reflect.ownKeys(descriptors);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const desc = descriptors[key];
      if (desc.writable === false) {
        desc.writable = true;
        desc.configurable = true;
      }
      if (desc.get || desc.set)
        descriptors[key] = {
          configurable: true,
          writable: true,
          // could live with !!desc.set as well here...
          enumerable: desc.enumerable,
          value: base[key]
        };
    }
    return Object.create(getPrototypeOf(base), descriptors);
  } else {
    const proto = getPrototypeOf(base);
    if (proto !== null && isPlain) {
      return { ...base };
    }
    const obj = Object.create(proto);
    return Object.assign(obj, base);
  }
}
function freeze(obj, deep = false) {
  if (isFrozen(obj) || isDraft(obj) || !isDraftable(obj))
    return obj;
  if (getArchtype(obj) > 1) {
    obj.set = obj.add = obj.clear = obj.delete = dontMutateFrozenCollections;
  }
  Object.freeze(obj);
  if (deep)
    Object.entries(obj).forEach(([key, value]) => freeze(value, true));
  return obj;
}
function dontMutateFrozenCollections() {
  die(2);
}
function isFrozen(obj) {
  return Object.isFrozen(obj);
}
var plugins = {};
function getPlugin(pluginKey) {
  const plugin = plugins[pluginKey];
  if (!plugin) {
    die(0, pluginKey);
  }
  return plugin;
}
var currentScope;
function getCurrentScope() {
  return currentScope;
}
function createScope(parent_, immer_) {
  return {
    drafts_: [],
    parent_,
    immer_,
    // Whenever the modified draft contains a draft from another scope, we
    // need to prevent auto-freezing so the unowned draft can be finalized.
    canAutoFreeze_: true,
    unfinalizedDrafts_: 0
  };
}
function usePatchesInScope(scope, patchListener) {
  if (patchListener) {
    getPlugin("Patches");
    scope.patches_ = [];
    scope.inversePatches_ = [];
    scope.patchListener_ = patchListener;
  }
}
function revokeScope(scope) {
  leaveScope(scope);
  scope.drafts_.forEach(revokeDraft);
  scope.drafts_ = null;
}
function leaveScope(scope) {
  if (scope === currentScope) {
    currentScope = scope.parent_;
  }
}
function enterScope(immer2) {
  return currentScope = createScope(currentScope, immer2);
}
function revokeDraft(draft) {
  const state = draft[DRAFT_STATE];
  if (state.type_ === 0 || state.type_ === 1)
    state.revoke_();
  else
    state.revoked_ = true;
}
function processResult(result, scope) {
  scope.unfinalizedDrafts_ = scope.drafts_.length;
  const baseDraft = scope.drafts_[0];
  const isReplaced = result !== void 0 && result !== baseDraft;
  if (isReplaced) {
    if (baseDraft[DRAFT_STATE].modified_) {
      revokeScope(scope);
      die(4);
    }
    if (isDraftable(result)) {
      result = finalize(scope, result);
      if (!scope.parent_)
        maybeFreeze(scope, result);
    }
    if (scope.patches_) {
      getPlugin("Patches").generateReplacementPatches_(
        baseDraft[DRAFT_STATE].base_,
        result,
        scope.patches_,
        scope.inversePatches_
      );
    }
  } else {
    result = finalize(scope, baseDraft, []);
  }
  revokeScope(scope);
  if (scope.patches_) {
    scope.patchListener_(scope.patches_, scope.inversePatches_);
  }
  return result !== NOTHING ? result : void 0;
}
function finalize(rootScope, value, path) {
  if (isFrozen(value))
    return value;
  const state = value[DRAFT_STATE];
  if (!state) {
    each(
      value,
      (key, childValue) => finalizeProperty(rootScope, state, value, key, childValue, path)
    );
    return value;
  }
  if (state.scope_ !== rootScope)
    return value;
  if (!state.modified_) {
    maybeFreeze(rootScope, state.base_, true);
    return state.base_;
  }
  if (!state.finalized_) {
    state.finalized_ = true;
    state.scope_.unfinalizedDrafts_--;
    const result = state.copy_;
    let resultEach = result;
    let isSet2 = false;
    if (state.type_ === 3) {
      resultEach = new Set(result);
      result.clear();
      isSet2 = true;
    }
    each(
      resultEach,
      (key, childValue) => finalizeProperty(rootScope, state, result, key, childValue, path, isSet2)
    );
    maybeFreeze(rootScope, result, false);
    if (path && rootScope.patches_) {
      getPlugin("Patches").generatePatches_(
        state,
        path,
        rootScope.patches_,
        rootScope.inversePatches_
      );
    }
  }
  return state.copy_;
}
function finalizeProperty(rootScope, parentState, targetObject, prop, childValue, rootPath, targetIsSet) {
  if (isDraft(childValue)) {
    const path = rootPath && parentState && parentState.type_ !== 3 && // Set objects are atomic since they have no keys.
    !has(parentState.assigned_, prop) ? rootPath.concat(prop) : void 0;
    const res = finalize(rootScope, childValue, path);
    set(targetObject, prop, res);
    if (isDraft(res)) {
      rootScope.canAutoFreeze_ = false;
    } else
      return;
  } else if (targetIsSet) {
    targetObject.add(childValue);
  }
  if (isDraftable(childValue) && !isFrozen(childValue)) {
    if (!rootScope.immer_.autoFreeze_ && rootScope.unfinalizedDrafts_ < 1) {
      return;
    }
    finalize(rootScope, childValue);
    if ((!parentState || !parentState.scope_.parent_) && typeof prop !== "symbol" && Object.prototype.propertyIsEnumerable.call(targetObject, prop))
      maybeFreeze(rootScope, childValue);
  }
}
function maybeFreeze(scope, value, deep = false) {
  if (!scope.parent_ && scope.immer_.autoFreeze_ && scope.canAutoFreeze_) {
    freeze(value, deep);
  }
}
function createProxyProxy(base, parent) {
  const isArray = Array.isArray(base);
  const state = {
    type_: isArray ? 1 : 0,
    // Track which produce call this is associated with.
    scope_: parent ? parent.scope_ : getCurrentScope(),
    // True for both shallow and deep changes.
    modified_: false,
    // Used during finalization.
    finalized_: false,
    // Track which properties have been assigned (true) or deleted (false).
    assigned_: {},
    // The parent draft state.
    parent_: parent,
    // The base state.
    base_: base,
    // The base proxy.
    draft_: null,
    // set below
    // The base copy with any updated values.
    copy_: null,
    // Called by the `produce` function.
    revoke_: null,
    isManual_: false
  };
  let target = state;
  let traps = objectTraps;
  if (isArray) {
    target = [state];
    traps = arrayTraps;
  }
  const { revoke, proxy } = Proxy.revocable(target, traps);
  state.draft_ = proxy;
  state.revoke_ = revoke;
  return proxy;
}
var objectTraps = {
  get(state, prop) {
    if (prop === DRAFT_STATE)
      return state;
    const source = latest(state);
    if (!has(source, prop)) {
      return readPropFromProto(state, source, prop);
    }
    const value = source[prop];
    if (state.finalized_ || !isDraftable(value)) {
      return value;
    }
    if (value === peek(state.base_, prop)) {
      prepareCopy(state);
      return state.copy_[prop] = createProxy(value, state);
    }
    return value;
  },
  has(state, prop) {
    return prop in latest(state);
  },
  ownKeys(state) {
    return Reflect.ownKeys(latest(state));
  },
  set(state, prop, value) {
    const desc = getDescriptorFromProto(latest(state), prop);
    if (desc == null ? void 0 : desc.set) {
      desc.set.call(state.draft_, value);
      return true;
    }
    if (!state.modified_) {
      const current2 = peek(latest(state), prop);
      const currentState = current2 == null ? void 0 : current2[DRAFT_STATE];
      if (currentState && currentState.base_ === value) {
        state.copy_[prop] = value;
        state.assigned_[prop] = false;
        return true;
      }
      if (is(value, current2) && (value !== void 0 || has(state.base_, prop)))
        return true;
      prepareCopy(state);
      markChanged(state);
    }
    if (state.copy_[prop] === value && // special case: handle new props with value 'undefined'
    (value !== void 0 || prop in state.copy_) || // special case: NaN
    Number.isNaN(value) && Number.isNaN(state.copy_[prop]))
      return true;
    state.copy_[prop] = value;
    state.assigned_[prop] = true;
    return true;
  },
  deleteProperty(state, prop) {
    if (peek(state.base_, prop) !== void 0 || prop in state.base_) {
      state.assigned_[prop] = false;
      prepareCopy(state);
      markChanged(state);
    } else {
      delete state.assigned_[prop];
    }
    if (state.copy_) {
      delete state.copy_[prop];
    }
    return true;
  },
  // Note: We never coerce `desc.value` into an Immer draft, because we can't make
  // the same guarantee in ES5 mode.
  getOwnPropertyDescriptor(state, prop) {
    const owner = latest(state);
    const desc = Reflect.getOwnPropertyDescriptor(owner, prop);
    if (!desc)
      return desc;
    return {
      writable: true,
      configurable: state.type_ !== 1 || prop !== "length",
      enumerable: desc.enumerable,
      value: owner[prop]
    };
  },
  defineProperty() {
    die(11);
  },
  getPrototypeOf(state) {
    return getPrototypeOf(state.base_);
  },
  setPrototypeOf() {
    die(12);
  }
};
var arrayTraps = {};
each(objectTraps, (key, fn) => {
  arrayTraps[key] = function() {
    arguments[0] = arguments[0][0];
    return fn.apply(this, arguments);
  };
});
arrayTraps.deleteProperty = function(state, prop) {
  return arrayTraps.set.call(this, state, prop, void 0);
};
arrayTraps.set = function(state, prop, value) {
  return objectTraps.set.call(this, state[0], prop, value, state[0]);
};
function peek(draft, prop) {
  const state = draft[DRAFT_STATE];
  const source = state ? latest(state) : draft;
  return source[prop];
}
function readPropFromProto(state, source, prop) {
  var _a;
  const desc = getDescriptorFromProto(source, prop);
  return desc ? `value` in desc ? desc.value : (
    // This is a very special case, if the prop is a getter defined by the
    // prototype, we should invoke it with the draft as context!
    (_a = desc.get) == null ? void 0 : _a.call(state.draft_)
  ) : void 0;
}
function getDescriptorFromProto(source, prop) {
  if (!(prop in source))
    return void 0;
  let proto = getPrototypeOf(source);
  while (proto) {
    const desc = Object.getOwnPropertyDescriptor(proto, prop);
    if (desc)
      return desc;
    proto = getPrototypeOf(proto);
  }
  return void 0;
}
function markChanged(state) {
  if (!state.modified_) {
    state.modified_ = true;
    if (state.parent_) {
      markChanged(state.parent_);
    }
  }
}
function prepareCopy(state) {
  if (!state.copy_) {
    state.copy_ = shallowCopy(
      state.base_,
      state.scope_.immer_.useStrictShallowCopy_
    );
  }
}
var Immer2 = class {
  constructor(config2) {
    this.autoFreeze_ = true;
    this.useStrictShallowCopy_ = false;
    this.produce = (base, recipe, patchListener) => {
      if (typeof base === "function" && typeof recipe !== "function") {
        const defaultBase = recipe;
        recipe = base;
        const self2 = this;
        return function curriedProduce(base2 = defaultBase, ...args) {
          return self2.produce(base2, (draft) => recipe.call(this, draft, ...args));
        };
      }
      if (typeof recipe !== "function")
        die(6);
      if (patchListener !== void 0 && typeof patchListener !== "function")
        die(7);
      let result;
      if (isDraftable(base)) {
        const scope = enterScope(this);
        const proxy = createProxy(base, void 0);
        let hasError = true;
        try {
          result = recipe(proxy);
          hasError = false;
        } finally {
          if (hasError)
            revokeScope(scope);
          else
            leaveScope(scope);
        }
        usePatchesInScope(scope, patchListener);
        return processResult(result, scope);
      } else if (!base || typeof base !== "object") {
        result = recipe(base);
        if (result === void 0)
          result = base;
        if (result === NOTHING)
          result = void 0;
        if (this.autoFreeze_)
          freeze(result, true);
        if (patchListener) {
          const p2 = [];
          const ip = [];
          getPlugin("Patches").generateReplacementPatches_(base, result, p2, ip);
          patchListener(p2, ip);
        }
        return result;
      } else
        die(1, base);
    };
    this.produceWithPatches = (base, recipe) => {
      if (typeof base === "function") {
        return (state, ...args) => this.produceWithPatches(state, (draft) => base(draft, ...args));
      }
      let patches, inversePatches;
      const result = this.produce(base, recipe, (p2, ip) => {
        patches = p2;
        inversePatches = ip;
      });
      return [result, patches, inversePatches];
    };
    if (typeof (config2 == null ? void 0 : config2.autoFreeze) === "boolean")
      this.setAutoFreeze(config2.autoFreeze);
    if (typeof (config2 == null ? void 0 : config2.useStrictShallowCopy) === "boolean")
      this.setUseStrictShallowCopy(config2.useStrictShallowCopy);
  }
  createDraft(base) {
    if (!isDraftable(base))
      die(8);
    if (isDraft(base))
      base = current(base);
    const scope = enterScope(this);
    const proxy = createProxy(base, void 0);
    proxy[DRAFT_STATE].isManual_ = true;
    leaveScope(scope);
    return proxy;
  }
  finishDraft(draft, patchListener) {
    const state = draft && draft[DRAFT_STATE];
    if (!state || !state.isManual_)
      die(9);
    const { scope_: scope } = state;
    usePatchesInScope(scope, patchListener);
    return processResult(void 0, scope);
  }
  /**
   * Pass true to automatically freeze all copies created by Immer.
   *
   * By default, auto-freezing is enabled.
   */
  setAutoFreeze(value) {
    this.autoFreeze_ = value;
  }
  /**
   * Pass true to enable strict shallow copy.
   *
   * By default, immer does not copy the object descriptors such as getter, setter and non-enumrable properties.
   */
  setUseStrictShallowCopy(value) {
    this.useStrictShallowCopy_ = value;
  }
  applyPatches(base, patches) {
    let i;
    for (i = patches.length - 1; i >= 0; i--) {
      const patch = patches[i];
      if (patch.path.length === 0 && patch.op === "replace") {
        base = patch.value;
        break;
      }
    }
    if (i > -1) {
      patches = patches.slice(i + 1);
    }
    const applyPatchesImpl = getPlugin("Patches").applyPatches_;
    if (isDraft(base)) {
      return applyPatchesImpl(base, patches);
    }
    return this.produce(
      base,
      (draft) => applyPatchesImpl(draft, patches)
    );
  }
};
function createProxy(value, parent) {
  const draft = isMap(value) ? getPlugin("MapSet").proxyMap_(value, parent) : isSet(value) ? getPlugin("MapSet").proxySet_(value, parent) : createProxyProxy(value, parent);
  const scope = parent ? parent.scope_ : getCurrentScope();
  scope.drafts_.push(draft);
  return draft;
}
function current(value) {
  if (!isDraft(value))
    die(10, value);
  return currentImpl(value);
}
function currentImpl(value) {
  if (!isDraftable(value) || isFrozen(value))
    return value;
  const state = value[DRAFT_STATE];
  let copy;
  if (state) {
    if (!state.modified_)
      return state.base_;
    state.finalized_ = true;
    copy = shallowCopy(value, state.scope_.immer_.useStrictShallowCopy_);
  } else {
    copy = shallowCopy(value, true);
  }
  each(copy, (key, childValue) => {
    set(copy, key, currentImpl(childValue));
  });
  if (state) {
    state.finalized_ = false;
  }
  return copy;
}
var immer = new Immer2();
var produce = immer.produce;
immer.produceWithPatches.bind(
  immer
);
immer.setAutoFreeze.bind(immer);
immer.setUseStrictShallowCopy.bind(immer);
immer.applyPatches.bind(immer);
immer.createDraft.bind(immer);
immer.finishDraft.bind(immer);
function assertIsFunction(func, errorMessage = `expected a function, instead received ${typeof func}`) {
  if (typeof func !== "function") {
    throw new TypeError(errorMessage);
  }
}
function assertIsObject(object, errorMessage = `expected an object, instead received ${typeof object}`) {
  if (typeof object !== "object") {
    throw new TypeError(errorMessage);
  }
}
function assertIsArrayOfFunctions(array, errorMessage = `expected all items to be functions, instead received the following types: `) {
  if (!array.every((item) => typeof item === "function")) {
    const itemTypes = array.map(
      (item) => typeof item === "function" ? `function ${item.name || "unnamed"}()` : typeof item
    ).join(", ");
    throw new TypeError(`${errorMessage}[${itemTypes}]`);
  }
}
var ensureIsArray = (item) => {
  return Array.isArray(item) ? item : [item];
};
function getDependencies(createSelectorArgs) {
  const dependencies = Array.isArray(createSelectorArgs[0]) ? createSelectorArgs[0] : createSelectorArgs;
  assertIsArrayOfFunctions(
    dependencies,
    `createSelector expects all input-selectors to be functions, but received the following types: `
  );
  return dependencies;
}
function collectInputSelectorResults(dependencies, inputSelectorArgs) {
  const inputSelectorResults = [];
  const { length } = dependencies;
  for (let i = 0; i < length; i++) {
    inputSelectorResults.push(dependencies[i].apply(null, inputSelectorArgs));
  }
  return inputSelectorResults;
}
var StrongRef = class {
  constructor(value) {
    this.value = value;
  }
  deref() {
    return this.value;
  }
};
var Ref = typeof WeakRef !== "undefined" ? WeakRef : StrongRef;
var UNTERMINATED = 0;
var TERMINATED = 1;
function createCacheNode() {
  return {
    s: UNTERMINATED,
    v: void 0,
    o: null,
    p: null
  };
}
function weakMapMemoize(func, options = {}) {
  let fnNode = createCacheNode();
  const { resultEqualityCheck } = options;
  let lastResult;
  let resultsCount = 0;
  function memoized() {
    var _a;
    let cacheNode = fnNode;
    const { length } = arguments;
    for (let i = 0, l2 = length; i < l2; i++) {
      const arg = arguments[i];
      if (typeof arg === "function" || typeof arg === "object" && arg !== null) {
        let objectCache = cacheNode.o;
        if (objectCache === null) {
          cacheNode.o = objectCache = /* @__PURE__ */ new WeakMap();
        }
        const objectNode = objectCache.get(arg);
        if (objectNode === void 0) {
          cacheNode = createCacheNode();
          objectCache.set(arg, cacheNode);
        } else {
          cacheNode = objectNode;
        }
      } else {
        let primitiveCache = cacheNode.p;
        if (primitiveCache === null) {
          cacheNode.p = primitiveCache = /* @__PURE__ */ new Map();
        }
        const primitiveNode = primitiveCache.get(arg);
        if (primitiveNode === void 0) {
          cacheNode = createCacheNode();
          primitiveCache.set(arg, cacheNode);
        } else {
          cacheNode = primitiveNode;
        }
      }
    }
    const terminatedNode = cacheNode;
    let result;
    if (cacheNode.s === TERMINATED) {
      result = cacheNode.v;
    } else {
      result = func.apply(null, arguments);
      resultsCount++;
    }
    terminatedNode.s = TERMINATED;
    if (resultEqualityCheck) {
      const lastResultValue = ((_a = lastResult == null ? void 0 : lastResult.deref) == null ? void 0 : _a.call(lastResult)) ?? lastResult;
      if (lastResultValue != null && resultEqualityCheck(lastResultValue, result)) {
        result = lastResultValue;
        resultsCount !== 0 && resultsCount--;
      }
      const needsWeakRef = typeof result === "object" && result !== null || typeof result === "function";
      lastResult = needsWeakRef ? new Ref(result) : result;
    }
    terminatedNode.v = result;
    return result;
  }
  memoized.clearCache = () => {
    fnNode = createCacheNode();
    memoized.resetResultsCount();
  };
  memoized.resultsCount = () => resultsCount;
  memoized.resetResultsCount = () => {
    resultsCount = 0;
  };
  return memoized;
}
function createSelectorCreator(memoizeOrOptions, ...memoizeOptionsFromArgs) {
  const createSelectorCreatorOptions = typeof memoizeOrOptions === "function" ? {
    memoize: memoizeOrOptions,
    memoizeOptions: memoizeOptionsFromArgs
  } : memoizeOrOptions;
  const createSelector2 = (...createSelectorArgs) => {
    let recomputations = 0;
    let dependencyRecomputations = 0;
    let lastResult;
    let directlyPassedOptions = {};
    let resultFunc = createSelectorArgs.pop();
    if (typeof resultFunc === "object") {
      directlyPassedOptions = resultFunc;
      resultFunc = createSelectorArgs.pop();
    }
    assertIsFunction(
      resultFunc,
      `createSelector expects an output function after the inputs, but received: [${typeof resultFunc}]`
    );
    const combinedOptions = {
      ...createSelectorCreatorOptions,
      ...directlyPassedOptions
    };
    const {
      memoize,
      memoizeOptions = [],
      argsMemoize = weakMapMemoize,
      argsMemoizeOptions = [],
      devModeChecks = {}
    } = combinedOptions;
    const finalMemoizeOptions = ensureIsArray(memoizeOptions);
    const finalArgsMemoizeOptions = ensureIsArray(argsMemoizeOptions);
    const dependencies = getDependencies(createSelectorArgs);
    const memoizedResultFunc = memoize(function recomputationWrapper() {
      recomputations++;
      return resultFunc.apply(
        null,
        arguments
      );
    }, ...finalMemoizeOptions);
    const selector = argsMemoize(function dependenciesChecker() {
      dependencyRecomputations++;
      const inputSelectorResults = collectInputSelectorResults(
        dependencies,
        arguments
      );
      lastResult = memoizedResultFunc.apply(null, inputSelectorResults);
      return lastResult;
    }, ...finalArgsMemoizeOptions);
    return Object.assign(selector, {
      resultFunc,
      memoizedResultFunc,
      dependencies,
      dependencyRecomputations: () => dependencyRecomputations,
      resetDependencyRecomputations: () => {
        dependencyRecomputations = 0;
      },
      lastResult: () => lastResult,
      recomputations: () => recomputations,
      resetRecomputations: () => {
        recomputations = 0;
      },
      memoize,
      argsMemoize
    });
  };
  Object.assign(createSelector2, {
    withTypes: () => createSelector2
  });
  return createSelector2;
}
var createSelector = /* @__PURE__ */ createSelectorCreator(weakMapMemoize);
var createStructuredSelector = Object.assign(
  (inputSelectorsObject, selectorCreator = createSelector) => {
    assertIsObject(
      inputSelectorsObject,
      `createStructuredSelector expects first argument to be an object where each property is a selector, instead received a ${typeof inputSelectorsObject}`
    );
    const inputSelectorKeys = Object.keys(inputSelectorsObject);
    const dependencies = inputSelectorKeys.map(
      (key) => inputSelectorsObject[key]
    );
    const structuredSelector = selectorCreator(
      dependencies,
      (...inputSelectorResults) => {
        return inputSelectorResults.reduce((composition, value, index) => {
          composition[inputSelectorKeys[index]] = value;
          return composition;
        }, {});
      }
    );
    return structuredSelector;
  },
  { withTypes: () => createStructuredSelector }
);
function createThunkMiddleware(extraArgument) {
  const middleware = ({ dispatch, getState }) => (next) => (action) => {
    if (typeof action === "function") {
      return action(dispatch, getState, extraArgument);
    }
    return next(action);
  };
  return middleware;
}
var thunk = createThunkMiddleware();
var withExtraArgument = createThunkMiddleware;
var createDraftSafeSelectorCreator = (...args) => {
  const createSelector2 = createSelectorCreator(...args);
  const createDraftSafeSelector2 = Object.assign((...args2) => {
    const selector = createSelector2(...args2);
    const wrappedSelector = (value, ...rest) => selector(isDraft(value) ? current(value) : value, ...rest);
    Object.assign(wrappedSelector, selector);
    return wrappedSelector;
  }, {
    withTypes: () => createDraftSafeSelector2
  });
  return createDraftSafeSelector2;
};
createDraftSafeSelectorCreator(weakMapMemoize);
var composeWithDevTools = typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : function() {
  if (arguments.length === 0)
    return void 0;
  if (typeof arguments[0] === "object")
    return compose;
  return compose.apply(null, arguments);
};
var hasMatchFunction = (v2) => {
  return v2 && typeof v2.match === "function";
};
function createAction(type, prepareAction) {
  function actionCreator(...args) {
    if (prepareAction) {
      let prepared = prepareAction(...args);
      if (!prepared) {
        throw new Error(formatProdErrorMessage(0));
      }
      return {
        type,
        payload: prepared.payload,
        ..."meta" in prepared && {
          meta: prepared.meta
        },
        ..."error" in prepared && {
          error: prepared.error
        }
      };
    }
    return {
      type,
      payload: args[0]
    };
  }
  actionCreator.toString = () => `${type}`;
  actionCreator.type = type;
  actionCreator.match = (action) => isAction(action) && action.type === type;
  return actionCreator;
}
var Tuple = class _Tuple extends Array {
  constructor(...items) {
    super(...items);
    Object.setPrototypeOf(this, _Tuple.prototype);
  }
  static get [Symbol.species]() {
    return _Tuple;
  }
  concat(...arr) {
    return super.concat.apply(this, arr);
  }
  prepend(...arr) {
    if (arr.length === 1 && Array.isArray(arr[0])) {
      return new _Tuple(...arr[0].concat(this));
    }
    return new _Tuple(...arr.concat(this));
  }
};
function freezeDraftable(val) {
  return isDraftable(val) ? produce(val, () => {
  }) : val;
}
function emplace(map, key, handler) {
  if (map.has(key)) {
    let value = map.get(key);
    if (handler.update) {
      value = handler.update(value, key, map);
      map.set(key, value);
    }
    return value;
  }
  if (!handler.insert)
    throw new Error(formatProdErrorMessage(10));
  const inserted = handler.insert(key, map);
  map.set(key, inserted);
  return inserted;
}
function isBoolean(x2) {
  return typeof x2 === "boolean";
}
var buildGetDefaultMiddleware = () => function getDefaultMiddleware(options) {
  const {
    thunk: thunk$1 = true,
    immutableCheck = true,
    serializableCheck = true,
    actionCreatorCheck = true
  } = options ?? {};
  let middlewareArray = new Tuple();
  if (thunk$1) {
    if (isBoolean(thunk$1)) {
      middlewareArray.push(thunk);
    } else {
      middlewareArray.push(withExtraArgument(thunk$1.extraArgument));
    }
  }
  return middlewareArray;
};
var SHOULD_AUTOBATCH = "RTK_autoBatch";
var createQueueWithTimer = (timeout) => {
  return (notify) => {
    setTimeout(notify, timeout);
  };
};
var rAF = typeof window !== "undefined" && window.requestAnimationFrame ? window.requestAnimationFrame : createQueueWithTimer(10);
var autoBatchEnhancer = (options = {
  type: "raf"
}) => (next) => (...args) => {
  const store2 = next(...args);
  let notifying = true;
  let shouldNotifyAtEndOfTick = false;
  let notificationQueued = false;
  const listeners = /* @__PURE__ */ new Set();
  const queueCallback = options.type === "tick" ? queueMicrotask : options.type === "raf" ? rAF : options.type === "callback" ? options.queueNotification : createQueueWithTimer(options.timeout);
  const notifyListeners = () => {
    notificationQueued = false;
    if (shouldNotifyAtEndOfTick) {
      shouldNotifyAtEndOfTick = false;
      listeners.forEach((l2) => l2());
    }
  };
  return Object.assign({}, store2, {
    // Override the base `store.subscribe` method to keep original listeners
    // from running if we're delaying notifications
    subscribe(listener2) {
      const wrappedListener = () => notifying && listener2();
      const unsubscribe = store2.subscribe(wrappedListener);
      listeners.add(listener2);
      return () => {
        unsubscribe();
        listeners.delete(listener2);
      };
    },
    // Override the base `store.dispatch` method so that we can check actions
    // for the `shouldAutoBatch` flag and determine if batching is active
    dispatch(action) {
      var _a;
      try {
        notifying = !((_a = action == null ? void 0 : action.meta) == null ? void 0 : _a[SHOULD_AUTOBATCH]);
        shouldNotifyAtEndOfTick = !notifying;
        if (shouldNotifyAtEndOfTick) {
          if (!notificationQueued) {
            notificationQueued = true;
            queueCallback(notifyListeners);
          }
        }
        return store2.dispatch(action);
      } finally {
        notifying = true;
      }
    }
  });
};
var buildGetDefaultEnhancers = (middlewareEnhancer) => function getDefaultEnhancers(options) {
  const {
    autoBatch = true
  } = options ?? {};
  let enhancerArray = new Tuple(middlewareEnhancer);
  if (autoBatch) {
    enhancerArray.push(autoBatchEnhancer(typeof autoBatch === "object" ? autoBatch : void 0));
  }
  return enhancerArray;
};
var IS_PRODUCTION = true;
function configureStore(options) {
  const getDefaultMiddleware = buildGetDefaultMiddleware();
  const {
    reducer = void 0,
    middleware,
    devTools = true,
    preloadedState = void 0,
    enhancers = void 0
  } = options || {};
  let rootReducer;
  if (typeof reducer === "function") {
    rootReducer = reducer;
  } else if (isPlainObject$1(reducer)) {
    rootReducer = combineReducers(reducer);
  } else {
    throw new Error(formatProdErrorMessage(1));
  }
  let finalMiddleware;
  if (typeof middleware === "function") {
    finalMiddleware = middleware(getDefaultMiddleware);
  } else {
    finalMiddleware = getDefaultMiddleware();
  }
  let finalCompose = compose;
  if (devTools) {
    finalCompose = composeWithDevTools({
      // Enable capture of stack traces for dispatched Redux actions
      trace: !IS_PRODUCTION,
      ...typeof devTools === "object" && devTools
    });
  }
  const middlewareEnhancer = applyMiddleware(...finalMiddleware);
  const getDefaultEnhancers = buildGetDefaultEnhancers(middlewareEnhancer);
  let storeEnhancers = typeof enhancers === "function" ? enhancers(getDefaultEnhancers) : getDefaultEnhancers();
  const composedEnhancer = finalCompose(...storeEnhancers);
  return createStore(rootReducer, preloadedState, composedEnhancer);
}
function executeReducerBuilderCallback(builderCallback) {
  const actionsMap = {};
  const actionMatchers = [];
  let defaultCaseReducer;
  const builder = {
    addCase(typeOrActionCreator, reducer) {
      const type = typeof typeOrActionCreator === "string" ? typeOrActionCreator : typeOrActionCreator.type;
      if (!type) {
        throw new Error(formatProdErrorMessage(28));
      }
      if (type in actionsMap) {
        throw new Error(formatProdErrorMessage(29));
      }
      actionsMap[type] = reducer;
      return builder;
    },
    addMatcher(matcher, reducer) {
      actionMatchers.push({
        matcher,
        reducer
      });
      return builder;
    },
    addDefaultCase(reducer) {
      defaultCaseReducer = reducer;
      return builder;
    }
  };
  builderCallback(builder);
  return [actionsMap, actionMatchers, defaultCaseReducer];
}
function isStateFunction(x2) {
  return typeof x2 === "function";
}
function createReducer(initialState, mapOrBuilderCallback) {
  let [actionsMap, finalActionMatchers, finalDefaultCaseReducer] = executeReducerBuilderCallback(mapOrBuilderCallback);
  let getInitialState;
  if (isStateFunction(initialState)) {
    getInitialState = () => freezeDraftable(initialState());
  } else {
    const frozenInitialState = freezeDraftable(initialState);
    getInitialState = () => frozenInitialState;
  }
  function reducer(state = getInitialState(), action) {
    let caseReducers = [actionsMap[action.type], ...finalActionMatchers.filter(({
      matcher
    }) => matcher(action)).map(({
      reducer: reducer2
    }) => reducer2)];
    if (caseReducers.filter((cr) => !!cr).length === 0) {
      caseReducers = [finalDefaultCaseReducer];
    }
    return caseReducers.reduce((previousState, caseReducer) => {
      if (caseReducer) {
        if (isDraft(previousState)) {
          const draft = previousState;
          const result = caseReducer(draft, action);
          if (result === void 0) {
            return previousState;
          }
          return result;
        } else if (!isDraftable(previousState)) {
          const result = caseReducer(previousState, action);
          if (result === void 0) {
            if (previousState === null) {
              return previousState;
            }
            throw new Error(formatProdErrorMessage(9));
          }
          return result;
        } else {
          return produce(previousState, (draft) => {
            return caseReducer(draft, action);
          });
        }
      }
      return previousState;
    }, state);
  }
  reducer.getInitialState = getInitialState;
  return reducer;
}
var urlAlphabet = "ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW";
var nanoid = (size = 21) => {
  let id2 = "";
  let i = size;
  while (i--) {
    id2 += urlAlphabet[Math.random() * 64 | 0];
  }
  return id2;
};
var matches = (matcher, action) => {
  if (hasMatchFunction(matcher)) {
    return matcher.match(action);
  } else {
    return matcher(action);
  }
};
function isAnyOf(...matchers) {
  return (action) => {
    return matchers.some((matcher) => matches(matcher, action));
  };
}
var commonProperties = ["name", "message", "stack", "code"];
var RejectWithValue = class {
  constructor(payload, meta) {
    /*
    type-only property to distinguish between RejectWithValue and FulfillWithMeta
    does not exist at runtime
    */
    __publicField(this, "_type");
    this.payload = payload;
    this.meta = meta;
  }
};
var FulfillWithMeta = class {
  constructor(payload, meta) {
    /*
    type-only property to distinguish between RejectWithValue and FulfillWithMeta
    does not exist at runtime
    */
    __publicField(this, "_type");
    this.payload = payload;
    this.meta = meta;
  }
};
var miniSerializeError = (value) => {
  if (typeof value === "object" && value !== null) {
    const simpleError = {};
    for (const property of commonProperties) {
      if (typeof value[property] === "string") {
        simpleError[property] = value[property];
      }
    }
    return simpleError;
  }
  return {
    message: String(value)
  };
};
var createAsyncThunk = /* @__PURE__ */ (() => {
  function createAsyncThunk2(typePrefix, payloadCreator, options) {
    const fulfilled = createAction(typePrefix + "/fulfilled", (payload, requestId, arg, meta) => ({
      payload,
      meta: {
        ...meta || {},
        arg,
        requestId,
        requestStatus: "fulfilled"
      }
    }));
    const pending = createAction(typePrefix + "/pending", (requestId, arg, meta) => ({
      payload: void 0,
      meta: {
        ...meta || {},
        arg,
        requestId,
        requestStatus: "pending"
      }
    }));
    const rejected = createAction(typePrefix + "/rejected", (error, requestId, arg, payload, meta) => ({
      payload,
      error: (options && options.serializeError || miniSerializeError)(error || "Rejected"),
      meta: {
        ...meta || {},
        arg,
        requestId,
        rejectedWithValue: !!payload,
        requestStatus: "rejected",
        aborted: (error == null ? void 0 : error.name) === "AbortError",
        condition: (error == null ? void 0 : error.name) === "ConditionError"
      }
    }));
    function actionCreator(arg) {
      return (dispatch, getState, extra) => {
        const requestId = (options == null ? void 0 : options.idGenerator) ? options.idGenerator(arg) : nanoid();
        const abortController = new AbortController();
        let abortHandler;
        let abortReason;
        function abort(reason) {
          abortReason = reason;
          abortController.abort();
        }
        const promise = async function() {
          var _a, _b;
          let finalAction;
          try {
            let conditionResult = (_a = options == null ? void 0 : options.condition) == null ? void 0 : _a.call(options, arg, {
              getState,
              extra
            });
            if (isThenable(conditionResult)) {
              conditionResult = await conditionResult;
            }
            if (conditionResult === false || abortController.signal.aborted) {
              throw {
                name: "ConditionError",
                message: "Aborted due to condition callback returning false."
              };
            }
            const abortedPromise = new Promise((_, reject) => {
              abortHandler = () => {
                reject({
                  name: "AbortError",
                  message: abortReason || "Aborted"
                });
              };
              abortController.signal.addEventListener("abort", abortHandler);
            });
            dispatch(pending(requestId, arg, (_b = options == null ? void 0 : options.getPendingMeta) == null ? void 0 : _b.call(options, {
              requestId,
              arg
            }, {
              getState,
              extra
            })));
            finalAction = await Promise.race([abortedPromise, Promise.resolve(payloadCreator(arg, {
              dispatch,
              getState,
              extra,
              requestId,
              signal: abortController.signal,
              abort,
              rejectWithValue: (value, meta) => {
                return new RejectWithValue(value, meta);
              },
              fulfillWithValue: (value, meta) => {
                return new FulfillWithMeta(value, meta);
              }
            })).then((result) => {
              if (result instanceof RejectWithValue) {
                throw result;
              }
              if (result instanceof FulfillWithMeta) {
                return fulfilled(result.payload, requestId, arg, result.meta);
              }
              return fulfilled(result, requestId, arg);
            })]);
          } catch (err) {
            finalAction = err instanceof RejectWithValue ? rejected(null, requestId, arg, err.payload, err.meta) : rejected(err, requestId, arg);
          } finally {
            if (abortHandler) {
              abortController.signal.removeEventListener("abort", abortHandler);
            }
          }
          const skipDispatch = options && !options.dispatchConditionRejection && rejected.match(finalAction) && finalAction.meta.condition;
          if (!skipDispatch) {
            dispatch(finalAction);
          }
          return finalAction;
        }();
        return Object.assign(promise, {
          abort,
          requestId,
          arg,
          unwrap() {
            return promise.then(unwrapResult);
          }
        });
      };
    }
    return Object.assign(actionCreator, {
      pending,
      rejected,
      fulfilled,
      settled: isAnyOf(rejected, fulfilled),
      typePrefix
    });
  }
  createAsyncThunk2.withTypes = () => createAsyncThunk2;
  return createAsyncThunk2;
})();
function unwrapResult(action) {
  if (action.meta && action.meta.rejectedWithValue) {
    throw action.payload;
  }
  if (action.error) {
    throw action.error;
  }
  return action.payload;
}
function isThenable(value) {
  return value !== null && typeof value === "object" && typeof value.then === "function";
}
var asyncThunkSymbol = /* @__PURE__ */ Symbol.for("rtk-slice-createasyncthunk");
function getType(slice, actionKey) {
  return `${slice}/${actionKey}`;
}
function buildCreateSlice({
  creators
} = {}) {
  var _a;
  const cAT = (_a = creators == null ? void 0 : creators.asyncThunk) == null ? void 0 : _a[asyncThunkSymbol];
  return function createSlice2(options) {
    const {
      name,
      reducerPath = name
    } = options;
    if (!name) {
      throw new Error(formatProdErrorMessage(11));
    }
    if (typeof process !== "undefined" && false) {
      if (options.initialState === void 0) {
        console.error("You must provide an `initialState` value that is not `undefined`. You may have misspelled `initialState`");
      }
    }
    const reducers2 = (typeof options.reducers === "function" ? options.reducers(buildReducerCreators()) : options.reducers) || {};
    const reducerNames = Object.keys(reducers2);
    const context = {
      sliceCaseReducersByName: {},
      sliceCaseReducersByType: {},
      actionCreators: {},
      sliceMatchers: []
    };
    const contextMethods = {
      addCase(typeOrActionCreator, reducer2) {
        const type = typeof typeOrActionCreator === "string" ? typeOrActionCreator : typeOrActionCreator.type;
        if (!type) {
          throw new Error(formatProdErrorMessage(12));
        }
        if (type in context.sliceCaseReducersByType) {
          throw new Error(formatProdErrorMessage(13));
        }
        context.sliceCaseReducersByType[type] = reducer2;
        return contextMethods;
      },
      addMatcher(matcher, reducer2) {
        context.sliceMatchers.push({
          matcher,
          reducer: reducer2
        });
        return contextMethods;
      },
      exposeAction(name2, actionCreator) {
        context.actionCreators[name2] = actionCreator;
        return contextMethods;
      },
      exposeCaseReducer(name2, reducer2) {
        context.sliceCaseReducersByName[name2] = reducer2;
        return contextMethods;
      }
    };
    reducerNames.forEach((reducerName) => {
      const reducerDefinition = reducers2[reducerName];
      const reducerDetails = {
        reducerName,
        type: getType(name, reducerName),
        createNotation: typeof options.reducers === "function"
      };
      if (isAsyncThunkSliceReducerDefinition(reducerDefinition)) {
        handleThunkCaseReducerDefinition(reducerDetails, reducerDefinition, contextMethods, cAT);
      } else {
        handleNormalReducerDefinition(reducerDetails, reducerDefinition, contextMethods);
      }
    });
    function buildReducer() {
      const [extraReducers = {}, actionMatchers = [], defaultCaseReducer = void 0] = typeof options.extraReducers === "function" ? executeReducerBuilderCallback(options.extraReducers) : [options.extraReducers];
      const finalCaseReducers = {
        ...extraReducers,
        ...context.sliceCaseReducersByType
      };
      return createReducer(options.initialState, (builder) => {
        for (let key in finalCaseReducers) {
          builder.addCase(key, finalCaseReducers[key]);
        }
        for (let sM of context.sliceMatchers) {
          builder.addMatcher(sM.matcher, sM.reducer);
        }
        for (let m2 of actionMatchers) {
          builder.addMatcher(m2.matcher, m2.reducer);
        }
        if (defaultCaseReducer) {
          builder.addDefaultCase(defaultCaseReducer);
        }
      });
    }
    const selectSelf = (state) => state;
    const injectedSelectorCache = /* @__PURE__ */ new Map();
    let _reducer;
    function reducer(state, action) {
      if (!_reducer)
        _reducer = buildReducer();
      return _reducer(state, action);
    }
    function getInitialState() {
      if (!_reducer)
        _reducer = buildReducer();
      return _reducer.getInitialState();
    }
    function makeSelectorProps(reducerPath2, injected = false) {
      function selectSlice(state) {
        let sliceState = state[reducerPath2];
        if (typeof sliceState === "undefined") {
          if (injected) {
            sliceState = getInitialState();
          }
        }
        return sliceState;
      }
      function getSelectors(selectState = selectSelf) {
        const selectorCache = emplace(injectedSelectorCache, injected, {
          insert: () => /* @__PURE__ */ new WeakMap()
        });
        return emplace(selectorCache, selectState, {
          insert: () => {
            const map = {};
            for (const [name2, selector] of Object.entries(options.selectors ?? {})) {
              map[name2] = wrapSelector(selector, selectState, getInitialState, injected);
            }
            return map;
          }
        });
      }
      return {
        reducerPath: reducerPath2,
        getSelectors,
        get selectors() {
          return getSelectors(selectSlice);
        },
        selectSlice
      };
    }
    const slice = {
      name,
      reducer,
      actions: context.actionCreators,
      caseReducers: context.sliceCaseReducersByName,
      getInitialState,
      ...makeSelectorProps(reducerPath),
      injectInto(injectable, {
        reducerPath: pathOpt,
        ...config2
      } = {}) {
        const newReducerPath = pathOpt ?? reducerPath;
        injectable.inject({
          reducerPath: newReducerPath,
          reducer
        }, config2);
        return {
          ...slice,
          ...makeSelectorProps(newReducerPath, true)
        };
      }
    };
    return slice;
  };
}
function wrapSelector(selector, selectState, getInitialState, injected) {
  function wrapper(rootState, ...args) {
    let sliceState = selectState(rootState);
    if (typeof sliceState === "undefined") {
      if (injected) {
        sliceState = getInitialState();
      }
    }
    return selector(sliceState, ...args);
  }
  wrapper.unwrapped = selector;
  return wrapper;
}
var createSlice = /* @__PURE__ */ buildCreateSlice();
function buildReducerCreators() {
  function asyncThunk(payloadCreator, config2) {
    return {
      _reducerDefinitionType: "asyncThunk",
      payloadCreator,
      ...config2
    };
  }
  asyncThunk.withTypes = () => asyncThunk;
  return {
    reducer(caseReducer) {
      return Object.assign({
        // hack so the wrapping function has the same name as the original
        // we need to create a wrapper so the `reducerDefinitionType` is not assigned to the original
        [caseReducer.name](...args) {
          return caseReducer(...args);
        }
      }[caseReducer.name], {
        _reducerDefinitionType: "reducer"
        /* reducer */
      });
    },
    preparedReducer(prepare, reducer) {
      return {
        _reducerDefinitionType: "reducerWithPrepare",
        prepare,
        reducer
      };
    },
    asyncThunk
  };
}
function handleNormalReducerDefinition({
  type,
  reducerName,
  createNotation
}, maybeReducerWithPrepare, context) {
  let caseReducer;
  let prepareCallback;
  if ("reducer" in maybeReducerWithPrepare) {
    if (createNotation && !isCaseReducerWithPrepareDefinition(maybeReducerWithPrepare)) {
      throw new Error(formatProdErrorMessage(17));
    }
    caseReducer = maybeReducerWithPrepare.reducer;
    prepareCallback = maybeReducerWithPrepare.prepare;
  } else {
    caseReducer = maybeReducerWithPrepare;
  }
  context.addCase(type, caseReducer).exposeCaseReducer(reducerName, caseReducer).exposeAction(reducerName, prepareCallback ? createAction(type, prepareCallback) : createAction(type));
}
function isAsyncThunkSliceReducerDefinition(reducerDefinition) {
  return reducerDefinition._reducerDefinitionType === "asyncThunk";
}
function isCaseReducerWithPrepareDefinition(reducerDefinition) {
  return reducerDefinition._reducerDefinitionType === "reducerWithPrepare";
}
function handleThunkCaseReducerDefinition({
  type,
  reducerName
}, reducerDefinition, context, cAT) {
  if (!cAT) {
    throw new Error(formatProdErrorMessage(18));
  }
  const {
    payloadCreator,
    fulfilled,
    pending,
    rejected,
    settled,
    options
  } = reducerDefinition;
  const thunk2 = cAT(type, payloadCreator, options);
  context.exposeAction(reducerName, thunk2);
  if (fulfilled) {
    context.addCase(thunk2.fulfilled, fulfilled);
  }
  if (pending) {
    context.addCase(thunk2.pending, pending);
  }
  if (rejected) {
    context.addCase(thunk2.rejected, rejected);
  }
  if (settled) {
    context.addMatcher(thunk2.settled, settled);
  }
  context.exposeCaseReducer(reducerName, {
    fulfilled: fulfilled || noop,
    pending: pending || noop,
    rejected: rejected || noop,
    settled: settled || noop
  });
}
function noop() {
}
var assertFunction = (func, expected) => {
  if (typeof func !== "function") {
    throw new Error(formatProdErrorMessage(32));
  }
};
var alm = "listenerMiddleware";
var getListenerEntryPropsFrom = (options) => {
  let {
    type,
    actionCreator,
    matcher,
    predicate,
    effect
  } = options;
  if (type) {
    predicate = createAction(type).match;
  } else if (actionCreator) {
    type = actionCreator.type;
    predicate = actionCreator.match;
  } else if (matcher) {
    predicate = matcher;
  } else if (predicate) ;
  else {
    throw new Error(formatProdErrorMessage(21));
  }
  assertFunction(effect);
  return {
    predicate,
    type,
    effect
  };
};
var createListenerEntry = Object.assign((options) => {
  const {
    type,
    predicate,
    effect
  } = getListenerEntryPropsFrom(options);
  const id2 = nanoid();
  const entry = {
    id: id2,
    effect,
    type,
    predicate,
    pending: /* @__PURE__ */ new Set(),
    unsubscribe: () => {
      throw new Error(formatProdErrorMessage(22));
    }
  };
  return entry;
}, {
  withTypes: () => createListenerEntry
});
var addListener = Object.assign(createAction(`${alm}/add`), {
  withTypes: () => addListener
});
createAction(`${alm}/removeAll`);
var removeListener = Object.assign(createAction(`${alm}/remove`), {
  withTypes: () => removeListener
});
function formatProdErrorMessage(code) {
  return `Minified Redux Toolkit error #${code}; visit https://redux-toolkit.js.org/Errors?code=${code} for the full message or use the non-minified dev environment for full errors. `;
}
const useAppDispatch = () => useDispatch();
const createAppSelector = createSelector.withTypes();
const useAppSelector = useSelector;
const useAppStore = useStore.withTypes();
const initialStepConfigurationState = {
  elternGeldDigitalWizardUrl: ""
};
const configurationSlice = createSlice({
  name: "configuration",
  initialState: initialStepConfigurationState,
  reducers: {
    configure: (_, action) => {
      return action.payload;
    }
  }
});
const configurationActions = configurationSlice.actions;
const configurationReducer = configurationSlice.reducer;
var ExpandLess = {};
var __assign$e = commonjsGlobal && commonjsGlobal.__assign || function() {
  __assign$e = Object.assign || function(t2) {
    for (var s2, i = 1, n2 = arguments.length; i < n2; i++) {
      s2 = arguments[i];
      for (var p2 in s2) if (Object.prototype.hasOwnProperty.call(s2, p2))
        t2[p2] = s2[p2];
    }
    return t2;
  };
  return __assign$e.apply(this, arguments);
};
Object.defineProperty(ExpandLess, "__esModule", { value: true });
var jsx_runtime_1$3 = jsxRuntimeExports;
var SvgExpandLess = function(props) {
  return (0, jsx_runtime_1$3.jsxs)("svg", __assign$e({ xmlns: "http://www.w3.org/2000/svg", height: 24, viewBox: "0 0 24 24", width: 24, "data-testid": "ExpandLessIcon", role: "graphics-symbol img", focusable: "false", "aria-hidden": "true" }, props, { children: [(0, jsx_runtime_1$3.jsx)("path", { d: "M0 0h24v24H0z", fill: "none" }), (0, jsx_runtime_1$3.jsx)("path", { d: "M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z" })] }));
};
var _default$3 = ExpandLess.default = SvgExpandLess;
var ExpandMore = {};
var __assign$d = commonjsGlobal && commonjsGlobal.__assign || function() {
  __assign$d = Object.assign || function(t2) {
    for (var s2, i = 1, n2 = arguments.length; i < n2; i++) {
      s2 = arguments[i];
      for (var p2 in s2) if (Object.prototype.hasOwnProperty.call(s2, p2))
        t2[p2] = s2[p2];
    }
    return t2;
  };
  return __assign$d.apply(this, arguments);
};
Object.defineProperty(ExpandMore, "__esModule", { value: true });
var jsx_runtime_1$2 = jsxRuntimeExports;
var SvgExpandMore = function(props) {
  return (0, jsx_runtime_1$2.jsxs)("svg", __assign$d({ xmlns: "http://www.w3.org/2000/svg", height: 24, viewBox: "0 0 24 24", width: 24, "data-testid": "ExpandMoreIcon", role: "graphics-symbol img", focusable: "false", "aria-hidden": "true" }, props, { children: [(0, jsx_runtime_1$2.jsx)("path", { d: "M0 0h24v24H0z", fill: "none" }), (0, jsx_runtime_1$2.jsx)("path", { d: "M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" })] }));
};
var _default$2 = ExpandMore.default = SvgExpandMore;
function Sidebar({ currentStep }) {
  const [isOpen, setIsOpen] = reactExports.useState(false);
  const currentStepIndex = Object.values(formSteps).findIndex(
    (step) => step === currentStep
  );
  const stepsTotal = Object.entries(formSteps).length;
  const stepLabel = `${currentStepIndex + 1}/${stepsTotal}`;
  const buttonLabel = /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: stepLabel }),
    currentStep.text
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: classNames(nsp("sidebar")), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        className: nsp("sidebar__collapse-btn"),
        onClick: () => setIsOpen(!isOpen),
        label: buttonLabel,
        iconAfter: isOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(_default$3, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(_default$2, {})
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "ol",
      {
        className: classNames(
          nsp("sidebar-list"),
          isOpen && nsp("sidebar-list--open")
        ),
        children: Object.values(formSteps).map((step, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "li",
          {
            className: classNames(
              nsp("sidebar-list__step"),
              index < currentStepIndex && nsp("sidebar-list__step--done"),
              step === currentStep && nsp("sidebar-list__step--current")
            ),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: step.route, children: step.text })
          },
          index
        ))
      }
    )
  ] });
}
function Page({ step, children }) {
  reactExports.useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: nsp("page"), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: nsp("page__sidebar"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, { currentStep: step }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AriaMessage, { children: step.text }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: classNames(nsp("page__content"), "relative"),
        id: step.text,
        children
      }
    )
  ] });
}
var PermIdentity = {};
var __assign$c = commonjsGlobal && commonjsGlobal.__assign || function() {
  __assign$c = Object.assign || function(t2) {
    for (var s2, i = 1, n2 = arguments.length; i < n2; i++) {
      s2 = arguments[i];
      for (var p2 in s2) if (Object.prototype.hasOwnProperty.call(s2, p2))
        t2[p2] = s2[p2];
    }
    return t2;
  };
  return __assign$c.apply(this, arguments);
};
Object.defineProperty(PermIdentity, "__esModule", { value: true });
var jsx_runtime_1$1 = jsxRuntimeExports;
var SvgPermIdentity = function(props) {
  return (0, jsx_runtime_1$1.jsxs)("svg", __assign$c({ xmlns: "http://www.w3.org/2000/svg", height: 24, viewBox: "0 0 24 24", width: 24, "data-testid": "PermIdentityIcon", role: "graphics-symbol img", focusable: "false", "aria-hidden": "true" }, props, { children: [(0, jsx_runtime_1$1.jsx)("path", { d: "M0 0h24v24H0z", fill: "none" }), (0, jsx_runtime_1$1.jsx)("path", { d: "M12 5.9c1.16 0 2.1.94 2.1 2.1s-.94 2.1-2.1 2.1S9.9 9.16 9.9 8s.94-2.1 2.1-2.1m0 9c2.97 0 6.1 1.46 6.1 2.1v1.1H5.9V17c0-.64 3.13-2.1 6.1-2.1M12 4C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 9c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z" })] }));
};
var _default$1 = PermIdentity.default = SvgPermIdentity;
function formatAsCurrency(amount) {
  const rounded = Math.floor(amount);
  return rounded.toLocaleString(void 0, {
    style: "currency",
    currency: "EUR",
    currencyDisplay: "symbol",
    maximumFractionDigits: 0
  });
}
function parseGermanDateString(dateString) {
  const [day, month, year] = dateString.split(".");
  return new Date(
    Number.parseInt(year),
    Number.parseInt(month) - 1,
    Number.parseInt(day)
  );
}
function PayoutInformation({ name, amount }) {
  const formattedAmount = formatAsCurrency(amount);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(_default$1, {}),
    " ",
    !!name && `${name} | `,
    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: formattedAmount }),
    " pro Monat"
  ] });
}
function DetailsElterngeldvariante({
  summaryTitle,
  summaryClassName,
  monthsAvailable,
  payoutAmounts,
  children
}) {
  const isSingleParent = payoutAmounts.length === 1;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { className: "group overflow-hidden rounded bg-grey", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "summary",
      {
        className: classNames(
          "flex justify-between list-none items-center cursor-pointer px-24 py-16",
          summaryClassName
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-y-10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "flex basis-full flex-wrap items-center gap-x-8 text-24", children: [
              summaryTitle,
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-base font-regular", children: [
                "(",
                monthsAvailable,
                " Monate verfügbar)"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-x-24 gap-y-8", children: payoutAmounts.map(({ name, amount }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              PayoutInformation,
              {
                name: isSingleParent ? void 0 : name,
                amount
              },
              name
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(_default$2, { className: "min-h-40 min-w-40 group-open:hidden" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(_default$3, { className: "hidden min-h-40 min-w-40 group-open:block" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-off-white p-32 pb-56", children })
  ] });
}
var PersonOutline = {};
var __assign$b = commonjsGlobal && commonjsGlobal.__assign || function() {
  __assign$b = Object.assign || function(t2) {
    for (var s2, i = 1, n2 = arguments.length; i < n2; i++) {
      s2 = arguments[i];
      for (var p2 in s2) if (Object.prototype.hasOwnProperty.call(s2, p2))
        t2[p2] = s2[p2];
    }
    return t2;
  };
  return __assign$b.apply(this, arguments);
};
Object.defineProperty(PersonOutline, "__esModule", { value: true });
var jsx_runtime_1 = jsxRuntimeExports;
var SvgPersonOutline = function(props) {
  return (0, jsx_runtime_1.jsxs)("svg", __assign$b({ xmlns: "http://www.w3.org/2000/svg", height: 24, viewBox: "0 0 24 24", width: 24, "data-testid": "PersonOutlineIcon", role: "graphics-symbol img", focusable: "false", "aria-hidden": "true" }, props, { children: [(0, jsx_runtime_1.jsx)("path", { d: "M0 0h24v24H0z", fill: "none" }), (0, jsx_runtime_1.jsx)("path", { d: "M12 5.9c1.16 0 2.1.94 2.1 2.1s-.94 2.1-2.1 2.1S9.9 9.16 9.9 8s.94-2.1 2.1-2.1m0 9c2.97 0 6.1 1.46 6.1 2.1v1.1H5.9V17c0-.64 3.13-2.1 6.1-2.1M12 4C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 9c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z" })] }));
};
var _default = PersonOutline.default = SvgPersonOutline;
function Example({ title, months: months2 }) {
  const monthClassName = (month) => {
    return classNames(
      "rounded w-[1.75rem] aspect-square flex items-center justify-center leading-none pb-4",
      {
        "egr-elterngeld-basis": month === "Basis",
        "egr-elterngeld-plus": month === "Plus",
        "egr-elterngeld-bonus": month === "Bonus",
        "egr-elterngeld-none": month === null
      }
    );
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-20 md:pl-56", role: "presentation", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0 content-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(_default, {}),
      title
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-8", children: months2.map((month, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: monthClassName(month), children: index + 1 }, index)) })
  ] });
}
function FurtherInformation() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "p-0", children: [
    "Weitere Informationen finden Sie auf der",
    " ",
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "a",
      {
        target: "_blank",
        rel: "noreferrer",
        href: "https://www.bmfsfj.de/bmfsfj/themen/familie/familienleistungen/elterngeld/elterngeld-73752",
        className: "underline",
        children: "Webseite des Familienministeriums"
      }
    )
  ] });
}
class LuxonError extends Error {
}
class InvalidDateTimeError extends LuxonError {
  constructor(reason) {
    super(`Invalid DateTime: ${reason.toMessage()}`);
  }
}
class InvalidIntervalError extends LuxonError {
  constructor(reason) {
    super(`Invalid Interval: ${reason.toMessage()}`);
  }
}
class InvalidDurationError extends LuxonError {
  constructor(reason) {
    super(`Invalid Duration: ${reason.toMessage()}`);
  }
}
class ConflictingSpecificationError extends LuxonError {
}
class InvalidUnitError extends LuxonError {
  constructor(unit) {
    super(`Invalid unit ${unit}`);
  }
}
class InvalidArgumentError extends LuxonError {
}
class ZoneIsAbstractError extends LuxonError {
  constructor() {
    super("Zone is an abstract class");
  }
}
const n = "numeric", s = "short", l = "long";
const DATE_SHORT = {
  year: n,
  month: n,
  day: n
};
const DATE_MED = {
  year: n,
  month: s,
  day: n
};
const DATE_MED_WITH_WEEKDAY = {
  year: n,
  month: s,
  day: n,
  weekday: s
};
const DATE_FULL = {
  year: n,
  month: l,
  day: n
};
const DATE_HUGE = {
  year: n,
  month: l,
  day: n,
  weekday: l
};
const TIME_SIMPLE = {
  hour: n,
  minute: n
};
const TIME_WITH_SECONDS = {
  hour: n,
  minute: n,
  second: n
};
const TIME_WITH_SHORT_OFFSET = {
  hour: n,
  minute: n,
  second: n,
  timeZoneName: s
};
const TIME_WITH_LONG_OFFSET = {
  hour: n,
  minute: n,
  second: n,
  timeZoneName: l
};
const TIME_24_SIMPLE = {
  hour: n,
  minute: n,
  hourCycle: "h23"
};
const TIME_24_WITH_SECONDS = {
  hour: n,
  minute: n,
  second: n,
  hourCycle: "h23"
};
const TIME_24_WITH_SHORT_OFFSET = {
  hour: n,
  minute: n,
  second: n,
  hourCycle: "h23",
  timeZoneName: s
};
const TIME_24_WITH_LONG_OFFSET = {
  hour: n,
  minute: n,
  second: n,
  hourCycle: "h23",
  timeZoneName: l
};
const DATETIME_SHORT = {
  year: n,
  month: n,
  day: n,
  hour: n,
  minute: n
};
const DATETIME_SHORT_WITH_SECONDS = {
  year: n,
  month: n,
  day: n,
  hour: n,
  minute: n,
  second: n
};
const DATETIME_MED = {
  year: n,
  month: s,
  day: n,
  hour: n,
  minute: n
};
const DATETIME_MED_WITH_SECONDS = {
  year: n,
  month: s,
  day: n,
  hour: n,
  minute: n,
  second: n
};
const DATETIME_MED_WITH_WEEKDAY = {
  year: n,
  month: s,
  day: n,
  weekday: s,
  hour: n,
  minute: n
};
const DATETIME_FULL = {
  year: n,
  month: l,
  day: n,
  hour: n,
  minute: n,
  timeZoneName: s
};
const DATETIME_FULL_WITH_SECONDS = {
  year: n,
  month: l,
  day: n,
  hour: n,
  minute: n,
  second: n,
  timeZoneName: s
};
const DATETIME_HUGE = {
  year: n,
  month: l,
  day: n,
  weekday: l,
  hour: n,
  minute: n,
  timeZoneName: l
};
const DATETIME_HUGE_WITH_SECONDS = {
  year: n,
  month: l,
  day: n,
  weekday: l,
  hour: n,
  minute: n,
  second: n,
  timeZoneName: l
};
class Zone {
  /**
   * The type of zone
   * @abstract
   * @type {string}
   */
  get type() {
    throw new ZoneIsAbstractError();
  }
  /**
   * The name of this zone.
   * @abstract
   * @type {string}
   */
  get name() {
    throw new ZoneIsAbstractError();
  }
  get ianaName() {
    return this.name;
  }
  /**
   * Returns whether the offset is known to be fixed for the whole year.
   * @abstract
   * @type {boolean}
   */
  get isUniversal() {
    throw new ZoneIsAbstractError();
  }
  /**
   * Returns the offset's common name (such as EST) at the specified timestamp
   * @abstract
   * @param {number} ts - Epoch milliseconds for which to get the name
   * @param {Object} opts - Options to affect the format
   * @param {string} opts.format - What style of offset to return. Accepts 'long' or 'short'.
   * @param {string} opts.locale - What locale to return the offset name in.
   * @return {string}
   */
  offsetName(ts, opts) {
    throw new ZoneIsAbstractError();
  }
  /**
   * Returns the offset's value as a string
   * @abstract
   * @param {number} ts - Epoch milliseconds for which to get the offset
   * @param {string} format - What style of offset to return.
   *                          Accepts 'narrow', 'short', or 'techie'. Returning '+6', '+06:00', or '+0600' respectively
   * @return {string}
   */
  formatOffset(ts, format) {
    throw new ZoneIsAbstractError();
  }
  /**
   * Return the offset in minutes for this zone at the specified timestamp.
   * @abstract
   * @param {number} ts - Epoch milliseconds for which to compute the offset
   * @return {number}
   */
  offset(ts) {
    throw new ZoneIsAbstractError();
  }
  /**
   * Return whether this Zone is equal to another zone
   * @abstract
   * @param {Zone} otherZone - the zone to compare
   * @return {boolean}
   */
  equals(otherZone) {
    throw new ZoneIsAbstractError();
  }
  /**
   * Return whether this Zone is valid.
   * @abstract
   * @type {boolean}
   */
  get isValid() {
    throw new ZoneIsAbstractError();
  }
}
let singleton$1 = null;
class SystemZone extends Zone {
  /**
   * Get a singleton instance of the local zone
   * @return {SystemZone}
   */
  static get instance() {
    if (singleton$1 === null) {
      singleton$1 = new SystemZone();
    }
    return singleton$1;
  }
  /** @override **/
  get type() {
    return "system";
  }
  /** @override **/
  get name() {
    return new Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
  /** @override **/
  get isUniversal() {
    return false;
  }
  /** @override **/
  offsetName(ts, { format, locale }) {
    return parseZoneInfo(ts, format, locale);
  }
  /** @override **/
  formatOffset(ts, format) {
    return formatOffset(this.offset(ts), format);
  }
  /** @override **/
  offset(ts) {
    return -new Date(ts).getTimezoneOffset();
  }
  /** @override **/
  equals(otherZone) {
    return otherZone.type === "system";
  }
  /** @override **/
  get isValid() {
    return true;
  }
}
let dtfCache = {};
function makeDTF(zone) {
  if (!dtfCache[zone]) {
    dtfCache[zone] = new Intl.DateTimeFormat("en-US", {
      hour12: false,
      timeZone: zone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      era: "short"
    });
  }
  return dtfCache[zone];
}
const typeToPos = {
  year: 0,
  month: 1,
  day: 2,
  era: 3,
  hour: 4,
  minute: 5,
  second: 6
};
function hackyOffset(dtf, date) {
  const formatted = dtf.format(date).replace(/\u200E/g, ""), parsed = /(\d+)\/(\d+)\/(\d+) (AD|BC),? (\d+):(\d+):(\d+)/.exec(formatted), [, fMonth, fDay, fYear, fadOrBc, fHour, fMinute, fSecond] = parsed;
  return [fYear, fMonth, fDay, fadOrBc, fHour, fMinute, fSecond];
}
function partsOffset(dtf, date) {
  const formatted = dtf.formatToParts(date);
  const filled = [];
  for (let i = 0; i < formatted.length; i++) {
    const { type, value } = formatted[i];
    const pos = typeToPos[type];
    if (type === "era") {
      filled[pos] = value;
    } else if (!isUndefined(pos)) {
      filled[pos] = parseInt(value, 10);
    }
  }
  return filled;
}
let ianaZoneCache = {};
class IANAZone extends Zone {
  /**
   * @param {string} name - Zone name
   * @return {IANAZone}
   */
  static create(name) {
    if (!ianaZoneCache[name]) {
      ianaZoneCache[name] = new IANAZone(name);
    }
    return ianaZoneCache[name];
  }
  /**
   * Reset local caches. Should only be necessary in testing scenarios.
   * @return {void}
   */
  static resetCache() {
    ianaZoneCache = {};
    dtfCache = {};
  }
  /**
   * Returns whether the provided string is a valid specifier. This only checks the string's format, not that the specifier identifies a known zone; see isValidZone for that.
   * @param {string} s - The string to check validity on
   * @example IANAZone.isValidSpecifier("America/New_York") //=> true
   * @example IANAZone.isValidSpecifier("Sport~~blorp") //=> false
   * @deprecated This method returns false for some valid IANA names. Use isValidZone instead.
   * @return {boolean}
   */
  static isValidSpecifier(s2) {
    return this.isValidZone(s2);
  }
  /**
   * Returns whether the provided string identifies a real zone
   * @param {string} zone - The string to check
   * @example IANAZone.isValidZone("America/New_York") //=> true
   * @example IANAZone.isValidZone("Fantasia/Castle") //=> false
   * @example IANAZone.isValidZone("Sport~~blorp") //=> false
   * @return {boolean}
   */
  static isValidZone(zone) {
    if (!zone) {
      return false;
    }
    try {
      new Intl.DateTimeFormat("en-US", { timeZone: zone }).format();
      return true;
    } catch (e) {
      return false;
    }
  }
  constructor(name) {
    super();
    this.zoneName = name;
    this.valid = IANAZone.isValidZone(name);
  }
  /** @override **/
  get type() {
    return "iana";
  }
  /** @override **/
  get name() {
    return this.zoneName;
  }
  /** @override **/
  get isUniversal() {
    return false;
  }
  /** @override **/
  offsetName(ts, { format, locale }) {
    return parseZoneInfo(ts, format, locale, this.name);
  }
  /** @override **/
  formatOffset(ts, format) {
    return formatOffset(this.offset(ts), format);
  }
  /** @override **/
  offset(ts) {
    const date = new Date(ts);
    if (isNaN(date)) return NaN;
    const dtf = makeDTF(this.name);
    let [year, month, day, adOrBc, hour, minute, second] = dtf.formatToParts ? partsOffset(dtf, date) : hackyOffset(dtf, date);
    if (adOrBc === "BC") {
      year = -Math.abs(year) + 1;
    }
    const adjustedHour = hour === 24 ? 0 : hour;
    const asUTC = objToLocalTS({
      year,
      month,
      day,
      hour: adjustedHour,
      minute,
      second,
      millisecond: 0
    });
    let asTS = +date;
    const over = asTS % 1e3;
    asTS -= over >= 0 ? over : 1e3 + over;
    return (asUTC - asTS) / (60 * 1e3);
  }
  /** @override **/
  equals(otherZone) {
    return otherZone.type === "iana" && otherZone.name === this.name;
  }
  /** @override **/
  get isValid() {
    return this.valid;
  }
}
let intlLFCache = {};
function getCachedLF(locString, opts = {}) {
  const key = JSON.stringify([locString, opts]);
  let dtf = intlLFCache[key];
  if (!dtf) {
    dtf = new Intl.ListFormat(locString, opts);
    intlLFCache[key] = dtf;
  }
  return dtf;
}
let intlDTCache = {};
function getCachedDTF(locString, opts = {}) {
  const key = JSON.stringify([locString, opts]);
  let dtf = intlDTCache[key];
  if (!dtf) {
    dtf = new Intl.DateTimeFormat(locString, opts);
    intlDTCache[key] = dtf;
  }
  return dtf;
}
let intlNumCache = {};
function getCachedINF(locString, opts = {}) {
  const key = JSON.stringify([locString, opts]);
  let inf = intlNumCache[key];
  if (!inf) {
    inf = new Intl.NumberFormat(locString, opts);
    intlNumCache[key] = inf;
  }
  return inf;
}
let intlRelCache = {};
function getCachedRTF(locString, opts = {}) {
  const { base, ...cacheKeyOpts } = opts;
  const key = JSON.stringify([locString, cacheKeyOpts]);
  let inf = intlRelCache[key];
  if (!inf) {
    inf = new Intl.RelativeTimeFormat(locString, opts);
    intlRelCache[key] = inf;
  }
  return inf;
}
let sysLocaleCache = null;
function systemLocale() {
  if (sysLocaleCache) {
    return sysLocaleCache;
  } else {
    sysLocaleCache = new Intl.DateTimeFormat().resolvedOptions().locale;
    return sysLocaleCache;
  }
}
let weekInfoCache = {};
function getCachedWeekInfo(locString) {
  let data = weekInfoCache[locString];
  if (!data) {
    const locale = new Intl.Locale(locString);
    data = "getWeekInfo" in locale ? locale.getWeekInfo() : locale.weekInfo;
    weekInfoCache[locString] = data;
  }
  return data;
}
function parseLocaleString(localeStr) {
  const xIndex = localeStr.indexOf("-x-");
  if (xIndex !== -1) {
    localeStr = localeStr.substring(0, xIndex);
  }
  const uIndex = localeStr.indexOf("-u-");
  if (uIndex === -1) {
    return [localeStr];
  } else {
    let options;
    let selectedStr;
    try {
      options = getCachedDTF(localeStr).resolvedOptions();
      selectedStr = localeStr;
    } catch (e) {
      const smaller = localeStr.substring(0, uIndex);
      options = getCachedDTF(smaller).resolvedOptions();
      selectedStr = smaller;
    }
    const { numberingSystem, calendar } = options;
    return [selectedStr, numberingSystem, calendar];
  }
}
function intlConfigString(localeStr, numberingSystem, outputCalendar) {
  if (outputCalendar || numberingSystem) {
    if (!localeStr.includes("-u-")) {
      localeStr += "-u";
    }
    if (outputCalendar) {
      localeStr += `-ca-${outputCalendar}`;
    }
    if (numberingSystem) {
      localeStr += `-nu-${numberingSystem}`;
    }
    return localeStr;
  } else {
    return localeStr;
  }
}
function mapMonths(f2) {
  const ms = [];
  for (let i = 1; i <= 12; i++) {
    const dt = DateTime.utc(2009, i, 1);
    ms.push(f2(dt));
  }
  return ms;
}
function mapWeekdays(f2) {
  const ms = [];
  for (let i = 1; i <= 7; i++) {
    const dt = DateTime.utc(2016, 11, 13 + i);
    ms.push(f2(dt));
  }
  return ms;
}
function listStuff(loc, length, englishFn, intlFn) {
  const mode = loc.listingMode();
  if (mode === "error") {
    return null;
  } else if (mode === "en") {
    return englishFn(length);
  } else {
    return intlFn(length);
  }
}
function supportsFastNumbers(loc) {
  if (loc.numberingSystem && loc.numberingSystem !== "latn") {
    return false;
  } else {
    return loc.numberingSystem === "latn" || !loc.locale || loc.locale.startsWith("en") || new Intl.DateTimeFormat(loc.intl).resolvedOptions().numberingSystem === "latn";
  }
}
class PolyNumberFormatter {
  constructor(intl, forceSimple, opts) {
    this.padTo = opts.padTo || 0;
    this.floor = opts.floor || false;
    const { padTo, floor, ...otherOpts } = opts;
    if (!forceSimple || Object.keys(otherOpts).length > 0) {
      const intlOpts = { useGrouping: false, ...opts };
      if (opts.padTo > 0) intlOpts.minimumIntegerDigits = opts.padTo;
      this.inf = getCachedINF(intl, intlOpts);
    }
  }
  format(i) {
    if (this.inf) {
      const fixed = this.floor ? Math.floor(i) : i;
      return this.inf.format(fixed);
    } else {
      const fixed = this.floor ? Math.floor(i) : roundTo(i, 3);
      return padStart(fixed, this.padTo);
    }
  }
}
class PolyDateFormatter {
  constructor(dt, intl, opts) {
    this.opts = opts;
    this.originalZone = void 0;
    let z2 = void 0;
    if (this.opts.timeZone) {
      this.dt = dt;
    } else if (dt.zone.type === "fixed") {
      const gmtOffset = -1 * (dt.offset / 60);
      const offsetZ = gmtOffset >= 0 ? `Etc/GMT+${gmtOffset}` : `Etc/GMT${gmtOffset}`;
      if (dt.offset !== 0 && IANAZone.create(offsetZ).valid) {
        z2 = offsetZ;
        this.dt = dt;
      } else {
        z2 = "UTC";
        this.dt = dt.offset === 0 ? dt : dt.setZone("UTC").plus({ minutes: dt.offset });
        this.originalZone = dt.zone;
      }
    } else if (dt.zone.type === "system") {
      this.dt = dt;
    } else if (dt.zone.type === "iana") {
      this.dt = dt;
      z2 = dt.zone.name;
    } else {
      z2 = "UTC";
      this.dt = dt.setZone("UTC").plus({ minutes: dt.offset });
      this.originalZone = dt.zone;
    }
    const intlOpts = { ...this.opts };
    intlOpts.timeZone = intlOpts.timeZone || z2;
    this.dtf = getCachedDTF(intl, intlOpts);
  }
  format() {
    if (this.originalZone) {
      return this.formatToParts().map(({ value }) => value).join("");
    }
    return this.dtf.format(this.dt.toJSDate());
  }
  formatToParts() {
    const parts = this.dtf.formatToParts(this.dt.toJSDate());
    if (this.originalZone) {
      return parts.map((part) => {
        if (part.type === "timeZoneName") {
          const offsetName = this.originalZone.offsetName(this.dt.ts, {
            locale: this.dt.locale,
            format: this.opts.timeZoneName
          });
          return {
            ...part,
            value: offsetName
          };
        } else {
          return part;
        }
      });
    }
    return parts;
  }
  resolvedOptions() {
    return this.dtf.resolvedOptions();
  }
}
class PolyRelFormatter {
  constructor(intl, isEnglish, opts) {
    this.opts = { style: "long", ...opts };
    if (!isEnglish && hasRelative()) {
      this.rtf = getCachedRTF(intl, opts);
    }
  }
  format(count, unit) {
    if (this.rtf) {
      return this.rtf.format(count, unit);
    } else {
      return formatRelativeTime(unit, count, this.opts.numeric, this.opts.style !== "long");
    }
  }
  formatToParts(count, unit) {
    if (this.rtf) {
      return this.rtf.formatToParts(count, unit);
    } else {
      return [];
    }
  }
}
const fallbackWeekSettings = {
  firstDay: 1,
  minimalDays: 4,
  weekend: [6, 7]
};
class Locale {
  static fromOpts(opts) {
    return Locale.create(
      opts.locale,
      opts.numberingSystem,
      opts.outputCalendar,
      opts.weekSettings,
      opts.defaultToEN
    );
  }
  static create(locale, numberingSystem, outputCalendar, weekSettings, defaultToEN = false) {
    const specifiedLocale = locale || Settings.defaultLocale;
    const localeR = specifiedLocale || (defaultToEN ? "en-US" : systemLocale());
    const numberingSystemR = numberingSystem || Settings.defaultNumberingSystem;
    const outputCalendarR = outputCalendar || Settings.defaultOutputCalendar;
    const weekSettingsR = validateWeekSettings(weekSettings) || Settings.defaultWeekSettings;
    return new Locale(localeR, numberingSystemR, outputCalendarR, weekSettingsR, specifiedLocale);
  }
  static resetCache() {
    sysLocaleCache = null;
    intlDTCache = {};
    intlNumCache = {};
    intlRelCache = {};
  }
  static fromObject({ locale, numberingSystem, outputCalendar, weekSettings } = {}) {
    return Locale.create(locale, numberingSystem, outputCalendar, weekSettings);
  }
  constructor(locale, numbering, outputCalendar, weekSettings, specifiedLocale) {
    const [parsedLocale, parsedNumberingSystem, parsedOutputCalendar] = parseLocaleString(locale);
    this.locale = parsedLocale;
    this.numberingSystem = numbering || parsedNumberingSystem || null;
    this.outputCalendar = outputCalendar || parsedOutputCalendar || null;
    this.weekSettings = weekSettings;
    this.intl = intlConfigString(this.locale, this.numberingSystem, this.outputCalendar);
    this.weekdaysCache = { format: {}, standalone: {} };
    this.monthsCache = { format: {}, standalone: {} };
    this.meridiemCache = null;
    this.eraCache = {};
    this.specifiedLocale = specifiedLocale;
    this.fastNumbersCached = null;
  }
  get fastNumbers() {
    if (this.fastNumbersCached == null) {
      this.fastNumbersCached = supportsFastNumbers(this);
    }
    return this.fastNumbersCached;
  }
  listingMode() {
    const isActuallyEn = this.isEnglish();
    const hasNoWeirdness = (this.numberingSystem === null || this.numberingSystem === "latn") && (this.outputCalendar === null || this.outputCalendar === "gregory");
    return isActuallyEn && hasNoWeirdness ? "en" : "intl";
  }
  clone(alts) {
    if (!alts || Object.getOwnPropertyNames(alts).length === 0) {
      return this;
    } else {
      return Locale.create(
        alts.locale || this.specifiedLocale,
        alts.numberingSystem || this.numberingSystem,
        alts.outputCalendar || this.outputCalendar,
        validateWeekSettings(alts.weekSettings) || this.weekSettings,
        alts.defaultToEN || false
      );
    }
  }
  redefaultToEN(alts = {}) {
    return this.clone({ ...alts, defaultToEN: true });
  }
  redefaultToSystem(alts = {}) {
    return this.clone({ ...alts, defaultToEN: false });
  }
  months(length, format = false) {
    return listStuff(this, length, months, () => {
      const intl = format ? { month: length, day: "numeric" } : { month: length }, formatStr = format ? "format" : "standalone";
      if (!this.monthsCache[formatStr][length]) {
        this.monthsCache[formatStr][length] = mapMonths((dt) => this.extract(dt, intl, "month"));
      }
      return this.monthsCache[formatStr][length];
    });
  }
  weekdays(length, format = false) {
    return listStuff(this, length, weekdays, () => {
      const intl = format ? { weekday: length, year: "numeric", month: "long", day: "numeric" } : { weekday: length }, formatStr = format ? "format" : "standalone";
      if (!this.weekdaysCache[formatStr][length]) {
        this.weekdaysCache[formatStr][length] = mapWeekdays(
          (dt) => this.extract(dt, intl, "weekday")
        );
      }
      return this.weekdaysCache[formatStr][length];
    });
  }
  meridiems() {
    return listStuff(
      this,
      void 0,
      () => meridiems,
      () => {
        if (!this.meridiemCache) {
          const intl = { hour: "numeric", hourCycle: "h12" };
          this.meridiemCache = [DateTime.utc(2016, 11, 13, 9), DateTime.utc(2016, 11, 13, 19)].map(
            (dt) => this.extract(dt, intl, "dayperiod")
          );
        }
        return this.meridiemCache;
      }
    );
  }
  eras(length) {
    return listStuff(this, length, eras, () => {
      const intl = { era: length };
      if (!this.eraCache[length]) {
        this.eraCache[length] = [DateTime.utc(-40, 1, 1), DateTime.utc(2017, 1, 1)].map(
          (dt) => this.extract(dt, intl, "era")
        );
      }
      return this.eraCache[length];
    });
  }
  extract(dt, intlOpts, field) {
    const df2 = this.dtFormatter(dt, intlOpts), results = df2.formatToParts(), matching = results.find((m2) => m2.type.toLowerCase() === field);
    return matching ? matching.value : null;
  }
  numberFormatter(opts = {}) {
    return new PolyNumberFormatter(this.intl, opts.forceSimple || this.fastNumbers, opts);
  }
  dtFormatter(dt, intlOpts = {}) {
    return new PolyDateFormatter(dt, this.intl, intlOpts);
  }
  relFormatter(opts = {}) {
    return new PolyRelFormatter(this.intl, this.isEnglish(), opts);
  }
  listFormatter(opts = {}) {
    return getCachedLF(this.intl, opts);
  }
  isEnglish() {
    return this.locale === "en" || this.locale.toLowerCase() === "en-us" || new Intl.DateTimeFormat(this.intl).resolvedOptions().locale.startsWith("en-us");
  }
  getWeekSettings() {
    if (this.weekSettings) {
      return this.weekSettings;
    } else if (!hasLocaleWeekInfo()) {
      return fallbackWeekSettings;
    } else {
      return getCachedWeekInfo(this.locale);
    }
  }
  getStartOfWeek() {
    return this.getWeekSettings().firstDay;
  }
  getMinDaysInFirstWeek() {
    return this.getWeekSettings().minimalDays;
  }
  getWeekendDays() {
    return this.getWeekSettings().weekend;
  }
  equals(other) {
    return this.locale === other.locale && this.numberingSystem === other.numberingSystem && this.outputCalendar === other.outputCalendar;
  }
}
let singleton = null;
class FixedOffsetZone extends Zone {
  /**
   * Get a singleton instance of UTC
   * @return {FixedOffsetZone}
   */
  static get utcInstance() {
    if (singleton === null) {
      singleton = new FixedOffsetZone(0);
    }
    return singleton;
  }
  /**
   * Get an instance with a specified offset
   * @param {number} offset - The offset in minutes
   * @return {FixedOffsetZone}
   */
  static instance(offset2) {
    return offset2 === 0 ? FixedOffsetZone.utcInstance : new FixedOffsetZone(offset2);
  }
  /**
   * Get an instance of FixedOffsetZone from a UTC offset string, like "UTC+6"
   * @param {string} s - The offset string to parse
   * @example FixedOffsetZone.parseSpecifier("UTC+6")
   * @example FixedOffsetZone.parseSpecifier("UTC+06")
   * @example FixedOffsetZone.parseSpecifier("UTC-6:00")
   * @return {FixedOffsetZone}
   */
  static parseSpecifier(s2) {
    if (s2) {
      const r2 = s2.match(/^utc(?:([+-]\d{1,2})(?::(\d{2}))?)?$/i);
      if (r2) {
        return new FixedOffsetZone(signedOffset(r2[1], r2[2]));
      }
    }
    return null;
  }
  constructor(offset2) {
    super();
    this.fixed = offset2;
  }
  /** @override **/
  get type() {
    return "fixed";
  }
  /** @override **/
  get name() {
    return this.fixed === 0 ? "UTC" : `UTC${formatOffset(this.fixed, "narrow")}`;
  }
  get ianaName() {
    if (this.fixed === 0) {
      return "Etc/UTC";
    } else {
      return `Etc/GMT${formatOffset(-this.fixed, "narrow")}`;
    }
  }
  /** @override **/
  offsetName() {
    return this.name;
  }
  /** @override **/
  formatOffset(ts, format) {
    return formatOffset(this.fixed, format);
  }
  /** @override **/
  get isUniversal() {
    return true;
  }
  /** @override **/
  offset() {
    return this.fixed;
  }
  /** @override **/
  equals(otherZone) {
    return otherZone.type === "fixed" && otherZone.fixed === this.fixed;
  }
  /** @override **/
  get isValid() {
    return true;
  }
}
class InvalidZone extends Zone {
  constructor(zoneName) {
    super();
    this.zoneName = zoneName;
  }
  /** @override **/
  get type() {
    return "invalid";
  }
  /** @override **/
  get name() {
    return this.zoneName;
  }
  /** @override **/
  get isUniversal() {
    return false;
  }
  /** @override **/
  offsetName() {
    return null;
  }
  /** @override **/
  formatOffset() {
    return "";
  }
  /** @override **/
  offset() {
    return NaN;
  }
  /** @override **/
  equals() {
    return false;
  }
  /** @override **/
  get isValid() {
    return false;
  }
}
function normalizeZone(input2, defaultZone2) {
  if (isUndefined(input2) || input2 === null) {
    return defaultZone2;
  } else if (input2 instanceof Zone) {
    return input2;
  } else if (isString(input2)) {
    const lowered = input2.toLowerCase();
    if (lowered === "default") return defaultZone2;
    else if (lowered === "local" || lowered === "system") return SystemZone.instance;
    else if (lowered === "utc" || lowered === "gmt") return FixedOffsetZone.utcInstance;
    else return FixedOffsetZone.parseSpecifier(lowered) || IANAZone.create(input2);
  } else if (isNumber(input2)) {
    return FixedOffsetZone.instance(input2);
  } else if (typeof input2 === "object" && "offset" in input2 && typeof input2.offset === "function") {
    return input2;
  } else {
    return new InvalidZone(input2);
  }
}
let now = () => Date.now(), defaultZone = "system", defaultLocale = null, defaultNumberingSystem = null, defaultOutputCalendar = null, twoDigitCutoffYear = 60, throwOnInvalid, defaultWeekSettings = null;
class Settings {
  /**
   * Get the callback for returning the current timestamp.
   * @type {function}
   */
  static get now() {
    return now;
  }
  /**
   * Set the callback for returning the current timestamp.
   * The function should return a number, which will be interpreted as an Epoch millisecond count
   * @type {function}
   * @example Settings.now = () => Date.now() + 3000 // pretend it is 3 seconds in the future
   * @example Settings.now = () => 0 // always pretend it's Jan 1, 1970 at midnight in UTC time
   */
  static set now(n2) {
    now = n2;
  }
  /**
   * Set the default time zone to create DateTimes in. Does not affect existing instances.
   * Use the value "system" to reset this value to the system's time zone.
   * @type {string}
   */
  static set defaultZone(zone) {
    defaultZone = zone;
  }
  /**
   * Get the default time zone object currently used to create DateTimes. Does not affect existing instances.
   * The default value is the system's time zone (the one set on the machine that runs this code).
   * @type {Zone}
   */
  static get defaultZone() {
    return normalizeZone(defaultZone, SystemZone.instance);
  }
  /**
   * Get the default locale to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static get defaultLocale() {
    return defaultLocale;
  }
  /**
   * Set the default locale to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static set defaultLocale(locale) {
    defaultLocale = locale;
  }
  /**
   * Get the default numbering system to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static get defaultNumberingSystem() {
    return defaultNumberingSystem;
  }
  /**
   * Set the default numbering system to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static set defaultNumberingSystem(numberingSystem) {
    defaultNumberingSystem = numberingSystem;
  }
  /**
   * Get the default output calendar to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static get defaultOutputCalendar() {
    return defaultOutputCalendar;
  }
  /**
   * Set the default output calendar to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static set defaultOutputCalendar(outputCalendar) {
    defaultOutputCalendar = outputCalendar;
  }
  /**
   * @typedef {Object} WeekSettings
   * @property {number} firstDay
   * @property {number} minimalDays
   * @property {number[]} weekend
   */
  /**
   * @return {WeekSettings|null}
   */
  static get defaultWeekSettings() {
    return defaultWeekSettings;
  }
  /**
   * Allows overriding the default locale week settings, i.e. the start of the week, the weekend and
   * how many days are required in the first week of a year.
   * Does not affect existing instances.
   *
   * @param {WeekSettings|null} weekSettings
   */
  static set defaultWeekSettings(weekSettings) {
    defaultWeekSettings = validateWeekSettings(weekSettings);
  }
  /**
   * Get the cutoff year after which a string encoding a year as two digits is interpreted to occur in the current century.
   * @type {number}
   */
  static get twoDigitCutoffYear() {
    return twoDigitCutoffYear;
  }
  /**
   * Set the cutoff year after which a string encoding a year as two digits is interpreted to occur in the current century.
   * @type {number}
   * @example Settings.twoDigitCutoffYear = 0 // cut-off year is 0, so all 'yy' are interpreted as current century
   * @example Settings.twoDigitCutoffYear = 50 // '49' -> 1949; '50' -> 2050
   * @example Settings.twoDigitCutoffYear = 1950 // interpreted as 50
   * @example Settings.twoDigitCutoffYear = 2050 // ALSO interpreted as 50
   */
  static set twoDigitCutoffYear(cutoffYear) {
    twoDigitCutoffYear = cutoffYear % 100;
  }
  /**
   * Get whether Luxon will throw when it encounters invalid DateTimes, Durations, or Intervals
   * @type {boolean}
   */
  static get throwOnInvalid() {
    return throwOnInvalid;
  }
  /**
   * Set whether Luxon will throw when it encounters invalid DateTimes, Durations, or Intervals
   * @type {boolean}
   */
  static set throwOnInvalid(t2) {
    throwOnInvalid = t2;
  }
  /**
   * Reset Luxon's global caches. Should only be necessary in testing scenarios.
   * @return {void}
   */
  static resetCaches() {
    Locale.resetCache();
    IANAZone.resetCache();
  }
}
class Invalid {
  constructor(reason, explanation) {
    this.reason = reason;
    this.explanation = explanation;
  }
  toMessage() {
    if (this.explanation) {
      return `${this.reason}: ${this.explanation}`;
    } else {
      return this.reason;
    }
  }
}
const nonLeapLadder = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334], leapLadder = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];
function unitOutOfRange(unit, value) {
  return new Invalid(
    "unit out of range",
    `you specified ${value} (of type ${typeof value}) as a ${unit}, which is invalid`
  );
}
function dayOfWeek(year, month, day) {
  const d = new Date(Date.UTC(year, month - 1, day));
  if (year < 100 && year >= 0) {
    d.setUTCFullYear(d.getUTCFullYear() - 1900);
  }
  const js = d.getUTCDay();
  return js === 0 ? 7 : js;
}
function computeOrdinal(year, month, day) {
  return day + (isLeapYear(year) ? leapLadder : nonLeapLadder)[month - 1];
}
function uncomputeOrdinal(year, ordinal) {
  const table = isLeapYear(year) ? leapLadder : nonLeapLadder, month0 = table.findIndex((i) => i < ordinal), day = ordinal - table[month0];
  return { month: month0 + 1, day };
}
function isoWeekdayToLocal(isoWeekday, startOfWeek) {
  return (isoWeekday - startOfWeek + 7) % 7 + 1;
}
function gregorianToWeek(gregObj, minDaysInFirstWeek = 4, startOfWeek = 1) {
  const { year, month, day } = gregObj, ordinal = computeOrdinal(year, month, day), weekday = isoWeekdayToLocal(dayOfWeek(year, month, day), startOfWeek);
  let weekNumber = Math.floor((ordinal - weekday + 14 - minDaysInFirstWeek) / 7), weekYear;
  if (weekNumber < 1) {
    weekYear = year - 1;
    weekNumber = weeksInWeekYear(weekYear, minDaysInFirstWeek, startOfWeek);
  } else if (weekNumber > weeksInWeekYear(year, minDaysInFirstWeek, startOfWeek)) {
    weekYear = year + 1;
    weekNumber = 1;
  } else {
    weekYear = year;
  }
  return { weekYear, weekNumber, weekday, ...timeObject(gregObj) };
}
function weekToGregorian(weekData, minDaysInFirstWeek = 4, startOfWeek = 1) {
  const { weekYear, weekNumber, weekday } = weekData, weekdayOfJan4 = isoWeekdayToLocal(dayOfWeek(weekYear, 1, minDaysInFirstWeek), startOfWeek), yearInDays = daysInYear(weekYear);
  let ordinal = weekNumber * 7 + weekday - weekdayOfJan4 - 7 + minDaysInFirstWeek, year;
  if (ordinal < 1) {
    year = weekYear - 1;
    ordinal += daysInYear(year);
  } else if (ordinal > yearInDays) {
    year = weekYear + 1;
    ordinal -= daysInYear(weekYear);
  } else {
    year = weekYear;
  }
  const { month, day } = uncomputeOrdinal(year, ordinal);
  return { year, month, day, ...timeObject(weekData) };
}
function gregorianToOrdinal(gregData) {
  const { year, month, day } = gregData;
  const ordinal = computeOrdinal(year, month, day);
  return { year, ordinal, ...timeObject(gregData) };
}
function ordinalToGregorian(ordinalData) {
  const { year, ordinal } = ordinalData;
  const { month, day } = uncomputeOrdinal(year, ordinal);
  return { year, month, day, ...timeObject(ordinalData) };
}
function usesLocalWeekValues(obj, loc) {
  const hasLocaleWeekData = !isUndefined(obj.localWeekday) || !isUndefined(obj.localWeekNumber) || !isUndefined(obj.localWeekYear);
  if (hasLocaleWeekData) {
    const hasIsoWeekData = !isUndefined(obj.weekday) || !isUndefined(obj.weekNumber) || !isUndefined(obj.weekYear);
    if (hasIsoWeekData) {
      throw new ConflictingSpecificationError(
        "Cannot mix locale-based week fields with ISO-based week fields"
      );
    }
    if (!isUndefined(obj.localWeekday)) obj.weekday = obj.localWeekday;
    if (!isUndefined(obj.localWeekNumber)) obj.weekNumber = obj.localWeekNumber;
    if (!isUndefined(obj.localWeekYear)) obj.weekYear = obj.localWeekYear;
    delete obj.localWeekday;
    delete obj.localWeekNumber;
    delete obj.localWeekYear;
    return {
      minDaysInFirstWeek: loc.getMinDaysInFirstWeek(),
      startOfWeek: loc.getStartOfWeek()
    };
  } else {
    return { minDaysInFirstWeek: 4, startOfWeek: 1 };
  }
}
function hasInvalidWeekData(obj, minDaysInFirstWeek = 4, startOfWeek = 1) {
  const validYear = isInteger(obj.weekYear), validWeek = integerBetween(
    obj.weekNumber,
    1,
    weeksInWeekYear(obj.weekYear, minDaysInFirstWeek, startOfWeek)
  ), validWeekday = integerBetween(obj.weekday, 1, 7);
  if (!validYear) {
    return unitOutOfRange("weekYear", obj.weekYear);
  } else if (!validWeek) {
    return unitOutOfRange("week", obj.weekNumber);
  } else if (!validWeekday) {
    return unitOutOfRange("weekday", obj.weekday);
  } else return false;
}
function hasInvalidOrdinalData(obj) {
  const validYear = isInteger(obj.year), validOrdinal = integerBetween(obj.ordinal, 1, daysInYear(obj.year));
  if (!validYear) {
    return unitOutOfRange("year", obj.year);
  } else if (!validOrdinal) {
    return unitOutOfRange("ordinal", obj.ordinal);
  } else return false;
}
function hasInvalidGregorianData(obj) {
  const validYear = isInteger(obj.year), validMonth = integerBetween(obj.month, 1, 12), validDay = integerBetween(obj.day, 1, daysInMonth(obj.year, obj.month));
  if (!validYear) {
    return unitOutOfRange("year", obj.year);
  } else if (!validMonth) {
    return unitOutOfRange("month", obj.month);
  } else if (!validDay) {
    return unitOutOfRange("day", obj.day);
  } else return false;
}
function hasInvalidTimeData(obj) {
  const { hour, minute, second, millisecond } = obj;
  const validHour = integerBetween(hour, 0, 23) || hour === 24 && minute === 0 && second === 0 && millisecond === 0, validMinute = integerBetween(minute, 0, 59), validSecond = integerBetween(second, 0, 59), validMillisecond = integerBetween(millisecond, 0, 999);
  if (!validHour) {
    return unitOutOfRange("hour", hour);
  } else if (!validMinute) {
    return unitOutOfRange("minute", minute);
  } else if (!validSecond) {
    return unitOutOfRange("second", second);
  } else if (!validMillisecond) {
    return unitOutOfRange("millisecond", millisecond);
  } else return false;
}
function isUndefined(o) {
  return typeof o === "undefined";
}
function isNumber(o) {
  return typeof o === "number";
}
function isInteger(o) {
  return typeof o === "number" && o % 1 === 0;
}
function isString(o) {
  return typeof o === "string";
}
function isDate(o) {
  return Object.prototype.toString.call(o) === "[object Date]";
}
function hasRelative() {
  try {
    return typeof Intl !== "undefined" && !!Intl.RelativeTimeFormat;
  } catch (e) {
    return false;
  }
}
function hasLocaleWeekInfo() {
  try {
    return typeof Intl !== "undefined" && !!Intl.Locale && ("weekInfo" in Intl.Locale.prototype || "getWeekInfo" in Intl.Locale.prototype);
  } catch (e) {
    return false;
  }
}
function maybeArray(thing) {
  return Array.isArray(thing) ? thing : [thing];
}
function bestBy(arr, by, compare) {
  if (arr.length === 0) {
    return void 0;
  }
  return arr.reduce((best, next) => {
    const pair = [by(next), next];
    if (!best) {
      return pair;
    } else if (compare(best[0], pair[0]) === best[0]) {
      return best;
    } else {
      return pair;
    }
  }, null)[1];
}
function pick(obj, keys) {
  return keys.reduce((a, k2) => {
    a[k2] = obj[k2];
    return a;
  }, {});
}
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
function validateWeekSettings(settings) {
  if (settings == null) {
    return null;
  } else if (typeof settings !== "object") {
    throw new InvalidArgumentError("Week settings must be an object");
  } else {
    if (!integerBetween(settings.firstDay, 1, 7) || !integerBetween(settings.minimalDays, 1, 7) || !Array.isArray(settings.weekend) || settings.weekend.some((v2) => !integerBetween(v2, 1, 7))) {
      throw new InvalidArgumentError("Invalid week settings");
    }
    return {
      firstDay: settings.firstDay,
      minimalDays: settings.minimalDays,
      weekend: Array.from(settings.weekend)
    };
  }
}
function integerBetween(thing, bottom, top) {
  return isInteger(thing) && thing >= bottom && thing <= top;
}
function floorMod(x2, n2) {
  return x2 - n2 * Math.floor(x2 / n2);
}
function padStart(input2, n2 = 2) {
  const isNeg = input2 < 0;
  let padded;
  if (isNeg) {
    padded = "-" + ("" + -input2).padStart(n2, "0");
  } else {
    padded = ("" + input2).padStart(n2, "0");
  }
  return padded;
}
function parseInteger(string) {
  if (isUndefined(string) || string === null || string === "") {
    return void 0;
  } else {
    return parseInt(string, 10);
  }
}
function parseFloating(string) {
  if (isUndefined(string) || string === null || string === "") {
    return void 0;
  } else {
    return parseFloat(string);
  }
}
function parseMillis(fraction) {
  if (isUndefined(fraction) || fraction === null || fraction === "") {
    return void 0;
  } else {
    const f2 = parseFloat("0." + fraction) * 1e3;
    return Math.floor(f2);
  }
}
function roundTo(number, digits, towardZero = false) {
  const factor = 10 ** digits, rounder = towardZero ? Math.trunc : Math.round;
  return rounder(number * factor) / factor;
}
function isLeapYear(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}
function daysInYear(year) {
  return isLeapYear(year) ? 366 : 365;
}
function daysInMonth(year, month) {
  const modMonth = floorMod(month - 1, 12) + 1, modYear = year + (month - modMonth) / 12;
  if (modMonth === 2) {
    return isLeapYear(modYear) ? 29 : 28;
  } else {
    return [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][modMonth - 1];
  }
}
function objToLocalTS(obj) {
  let d = Date.UTC(
    obj.year,
    obj.month - 1,
    obj.day,
    obj.hour,
    obj.minute,
    obj.second,
    obj.millisecond
  );
  if (obj.year < 100 && obj.year >= 0) {
    d = new Date(d);
    d.setUTCFullYear(obj.year, obj.month - 1, obj.day);
  }
  return +d;
}
function firstWeekOffset(year, minDaysInFirstWeek, startOfWeek) {
  const fwdlw = isoWeekdayToLocal(dayOfWeek(year, 1, minDaysInFirstWeek), startOfWeek);
  return -fwdlw + minDaysInFirstWeek - 1;
}
function weeksInWeekYear(weekYear, minDaysInFirstWeek = 4, startOfWeek = 1) {
  const weekOffset = firstWeekOffset(weekYear, minDaysInFirstWeek, startOfWeek);
  const weekOffsetNext = firstWeekOffset(weekYear + 1, minDaysInFirstWeek, startOfWeek);
  return (daysInYear(weekYear) - weekOffset + weekOffsetNext) / 7;
}
function untruncateYear(year) {
  if (year > 99) {
    return year;
  } else return year > Settings.twoDigitCutoffYear ? 1900 + year : 2e3 + year;
}
function parseZoneInfo(ts, offsetFormat, locale, timeZone = null) {
  const date = new Date(ts), intlOpts = {
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  };
  if (timeZone) {
    intlOpts.timeZone = timeZone;
  }
  const modified = { timeZoneName: offsetFormat, ...intlOpts };
  const parsed = new Intl.DateTimeFormat(locale, modified).formatToParts(date).find((m2) => m2.type.toLowerCase() === "timezonename");
  return parsed ? parsed.value : null;
}
function signedOffset(offHourStr, offMinuteStr) {
  let offHour = parseInt(offHourStr, 10);
  if (Number.isNaN(offHour)) {
    offHour = 0;
  }
  const offMin = parseInt(offMinuteStr, 10) || 0, offMinSigned = offHour < 0 || Object.is(offHour, -0) ? -offMin : offMin;
  return offHour * 60 + offMinSigned;
}
function asNumber(value) {
  const numericValue = Number(value);
  if (typeof value === "boolean" || value === "" || Number.isNaN(numericValue))
    throw new InvalidArgumentError(`Invalid unit value ${value}`);
  return numericValue;
}
function normalizeObject(obj, normalizer) {
  const normalized = {};
  for (const u2 in obj) {
    if (hasOwnProperty(obj, u2)) {
      const v2 = obj[u2];
      if (v2 === void 0 || v2 === null) continue;
      normalized[normalizer(u2)] = asNumber(v2);
    }
  }
  return normalized;
}
function formatOffset(offset2, format) {
  const hours = Math.trunc(Math.abs(offset2 / 60)), minutes = Math.trunc(Math.abs(offset2 % 60)), sign = offset2 >= 0 ? "+" : "-";
  switch (format) {
    case "short":
      return `${sign}${padStart(hours, 2)}:${padStart(minutes, 2)}`;
    case "narrow":
      return `${sign}${hours}${minutes > 0 ? `:${minutes}` : ""}`;
    case "techie":
      return `${sign}${padStart(hours, 2)}${padStart(minutes, 2)}`;
    default:
      throw new RangeError(`Value format ${format} is out of range for property format`);
  }
}
function timeObject(obj) {
  return pick(obj, ["hour", "minute", "second", "millisecond"]);
}
const monthsLong = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
const monthsShort = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];
const monthsNarrow = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
function months(length) {
  switch (length) {
    case "narrow":
      return [...monthsNarrow];
    case "short":
      return [...monthsShort];
    case "long":
      return [...monthsLong];
    case "numeric":
      return ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
    case "2-digit":
      return ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    default:
      return null;
  }
}
const weekdaysLong = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];
const weekdaysShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const weekdaysNarrow = ["M", "T", "W", "T", "F", "S", "S"];
function weekdays(length) {
  switch (length) {
    case "narrow":
      return [...weekdaysNarrow];
    case "short":
      return [...weekdaysShort];
    case "long":
      return [...weekdaysLong];
    case "numeric":
      return ["1", "2", "3", "4", "5", "6", "7"];
    default:
      return null;
  }
}
const meridiems = ["AM", "PM"];
const erasLong = ["Before Christ", "Anno Domini"];
const erasShort = ["BC", "AD"];
const erasNarrow = ["B", "A"];
function eras(length) {
  switch (length) {
    case "narrow":
      return [...erasNarrow];
    case "short":
      return [...erasShort];
    case "long":
      return [...erasLong];
    default:
      return null;
  }
}
function meridiemForDateTime(dt) {
  return meridiems[dt.hour < 12 ? 0 : 1];
}
function weekdayForDateTime(dt, length) {
  return weekdays(length)[dt.weekday - 1];
}
function monthForDateTime(dt, length) {
  return months(length)[dt.month - 1];
}
function eraForDateTime(dt, length) {
  return eras(length)[dt.year < 0 ? 0 : 1];
}
function formatRelativeTime(unit, count, numeric = "always", narrow = false) {
  const units = {
    years: ["year", "yr."],
    quarters: ["quarter", "qtr."],
    months: ["month", "mo."],
    weeks: ["week", "wk."],
    days: ["day", "day", "days"],
    hours: ["hour", "hr."],
    minutes: ["minute", "min."],
    seconds: ["second", "sec."]
  };
  const lastable = ["hours", "minutes", "seconds"].indexOf(unit) === -1;
  if (numeric === "auto" && lastable) {
    const isDay = unit === "days";
    switch (count) {
      case 1:
        return isDay ? "tomorrow" : `next ${units[unit][0]}`;
      case -1:
        return isDay ? "yesterday" : `last ${units[unit][0]}`;
      case 0:
        return isDay ? "today" : `this ${units[unit][0]}`;
    }
  }
  const isInPast = Object.is(count, -0) || count < 0, fmtValue = Math.abs(count), singular = fmtValue === 1, lilUnits = units[unit], fmtUnit = narrow ? singular ? lilUnits[1] : lilUnits[2] || lilUnits[1] : singular ? units[unit][0] : unit;
  return isInPast ? `${fmtValue} ${fmtUnit} ago` : `in ${fmtValue} ${fmtUnit}`;
}
function stringifyTokens(splits, tokenToString) {
  let s2 = "";
  for (const token of splits) {
    if (token.literal) {
      s2 += token.val;
    } else {
      s2 += tokenToString(token.val);
    }
  }
  return s2;
}
const macroTokenToFormatOpts = {
  D: DATE_SHORT,
  DD: DATE_MED,
  DDD: DATE_FULL,
  DDDD: DATE_HUGE,
  t: TIME_SIMPLE,
  tt: TIME_WITH_SECONDS,
  ttt: TIME_WITH_SHORT_OFFSET,
  tttt: TIME_WITH_LONG_OFFSET,
  T: TIME_24_SIMPLE,
  TT: TIME_24_WITH_SECONDS,
  TTT: TIME_24_WITH_SHORT_OFFSET,
  TTTT: TIME_24_WITH_LONG_OFFSET,
  f: DATETIME_SHORT,
  ff: DATETIME_MED,
  fff: DATETIME_FULL,
  ffff: DATETIME_HUGE,
  F: DATETIME_SHORT_WITH_SECONDS,
  FF: DATETIME_MED_WITH_SECONDS,
  FFF: DATETIME_FULL_WITH_SECONDS,
  FFFF: DATETIME_HUGE_WITH_SECONDS
};
class Formatter {
  static create(locale, opts = {}) {
    return new Formatter(locale, opts);
  }
  static parseFormat(fmt) {
    let current2 = null, currentFull = "", bracketed = false;
    const splits = [];
    for (let i = 0; i < fmt.length; i++) {
      const c = fmt.charAt(i);
      if (c === "'") {
        if (currentFull.length > 0) {
          splits.push({ literal: bracketed || /^\s+$/.test(currentFull), val: currentFull });
        }
        current2 = null;
        currentFull = "";
        bracketed = !bracketed;
      } else if (bracketed) {
        currentFull += c;
      } else if (c === current2) {
        currentFull += c;
      } else {
        if (currentFull.length > 0) {
          splits.push({ literal: /^\s+$/.test(currentFull), val: currentFull });
        }
        currentFull = c;
        current2 = c;
      }
    }
    if (currentFull.length > 0) {
      splits.push({ literal: bracketed || /^\s+$/.test(currentFull), val: currentFull });
    }
    return splits;
  }
  static macroTokenToFormatOpts(token) {
    return macroTokenToFormatOpts[token];
  }
  constructor(locale, formatOpts) {
    this.opts = formatOpts;
    this.loc = locale;
    this.systemLoc = null;
  }
  formatWithSystemDefault(dt, opts) {
    if (this.systemLoc === null) {
      this.systemLoc = this.loc.redefaultToSystem();
    }
    const df2 = this.systemLoc.dtFormatter(dt, { ...this.opts, ...opts });
    return df2.format();
  }
  dtFormatter(dt, opts = {}) {
    return this.loc.dtFormatter(dt, { ...this.opts, ...opts });
  }
  formatDateTime(dt, opts) {
    return this.dtFormatter(dt, opts).format();
  }
  formatDateTimeParts(dt, opts) {
    return this.dtFormatter(dt, opts).formatToParts();
  }
  formatInterval(interval, opts) {
    const df2 = this.dtFormatter(interval.start, opts);
    return df2.dtf.formatRange(interval.start.toJSDate(), interval.end.toJSDate());
  }
  resolvedOptions(dt, opts) {
    return this.dtFormatter(dt, opts).resolvedOptions();
  }
  num(n2, p2 = 0) {
    if (this.opts.forceSimple) {
      return padStart(n2, p2);
    }
    const opts = { ...this.opts };
    if (p2 > 0) {
      opts.padTo = p2;
    }
    return this.loc.numberFormatter(opts).format(n2);
  }
  formatDateTimeFromString(dt, fmt) {
    const knownEnglish = this.loc.listingMode() === "en", useDateTimeFormatter = this.loc.outputCalendar && this.loc.outputCalendar !== "gregory", string = (opts, extract) => this.loc.extract(dt, opts, extract), formatOffset2 = (opts) => {
      if (dt.isOffsetFixed && dt.offset === 0 && opts.allowZ) {
        return "Z";
      }
      return dt.isValid ? dt.zone.formatOffset(dt.ts, opts.format) : "";
    }, meridiem = () => knownEnglish ? meridiemForDateTime(dt) : string({ hour: "numeric", hourCycle: "h12" }, "dayperiod"), month = (length, standalone) => knownEnglish ? monthForDateTime(dt, length) : string(standalone ? { month: length } : { month: length, day: "numeric" }, "month"), weekday = (length, standalone) => knownEnglish ? weekdayForDateTime(dt, length) : string(
      standalone ? { weekday: length } : { weekday: length, month: "long", day: "numeric" },
      "weekday"
    ), maybeMacro = (token) => {
      const formatOpts = Formatter.macroTokenToFormatOpts(token);
      if (formatOpts) {
        return this.formatWithSystemDefault(dt, formatOpts);
      } else {
        return token;
      }
    }, era = (length) => knownEnglish ? eraForDateTime(dt, length) : string({ era: length }, "era"), tokenToString = (token) => {
      switch (token) {
        case "S":
          return this.num(dt.millisecond);
        case "u":
        case "SSS":
          return this.num(dt.millisecond, 3);
        case "s":
          return this.num(dt.second);
        case "ss":
          return this.num(dt.second, 2);
        case "uu":
          return this.num(Math.floor(dt.millisecond / 10), 2);
        case "uuu":
          return this.num(Math.floor(dt.millisecond / 100));
        case "m":
          return this.num(dt.minute);
        case "mm":
          return this.num(dt.minute, 2);
        case "h":
          return this.num(dt.hour % 12 === 0 ? 12 : dt.hour % 12);
        case "hh":
          return this.num(dt.hour % 12 === 0 ? 12 : dt.hour % 12, 2);
        case "H":
          return this.num(dt.hour);
        case "HH":
          return this.num(dt.hour, 2);
        case "Z":
          return formatOffset2({ format: "narrow", allowZ: this.opts.allowZ });
        case "ZZ":
          return formatOffset2({ format: "short", allowZ: this.opts.allowZ });
        case "ZZZ":
          return formatOffset2({ format: "techie", allowZ: this.opts.allowZ });
        case "ZZZZ":
          return dt.zone.offsetName(dt.ts, { format: "short", locale: this.loc.locale });
        case "ZZZZZ":
          return dt.zone.offsetName(dt.ts, { format: "long", locale: this.loc.locale });
        case "z":
          return dt.zoneName;
        case "a":
          return meridiem();
        case "d":
          return useDateTimeFormatter ? string({ day: "numeric" }, "day") : this.num(dt.day);
        case "dd":
          return useDateTimeFormatter ? string({ day: "2-digit" }, "day") : this.num(dt.day, 2);
        case "c":
          return this.num(dt.weekday);
        case "ccc":
          return weekday("short", true);
        case "cccc":
          return weekday("long", true);
        case "ccccc":
          return weekday("narrow", true);
        case "E":
          return this.num(dt.weekday);
        case "EEE":
          return weekday("short", false);
        case "EEEE":
          return weekday("long", false);
        case "EEEEE":
          return weekday("narrow", false);
        case "L":
          return useDateTimeFormatter ? string({ month: "numeric", day: "numeric" }, "month") : this.num(dt.month);
        case "LL":
          return useDateTimeFormatter ? string({ month: "2-digit", day: "numeric" }, "month") : this.num(dt.month, 2);
        case "LLL":
          return month("short", true);
        case "LLLL":
          return month("long", true);
        case "LLLLL":
          return month("narrow", true);
        case "M":
          return useDateTimeFormatter ? string({ month: "numeric" }, "month") : this.num(dt.month);
        case "MM":
          return useDateTimeFormatter ? string({ month: "2-digit" }, "month") : this.num(dt.month, 2);
        case "MMM":
          return month("short", false);
        case "MMMM":
          return month("long", false);
        case "MMMMM":
          return month("narrow", false);
        case "y":
          return useDateTimeFormatter ? string({ year: "numeric" }, "year") : this.num(dt.year);
        case "yy":
          return useDateTimeFormatter ? string({ year: "2-digit" }, "year") : this.num(dt.year.toString().slice(-2), 2);
        case "yyyy":
          return useDateTimeFormatter ? string({ year: "numeric" }, "year") : this.num(dt.year, 4);
        case "yyyyyy":
          return useDateTimeFormatter ? string({ year: "numeric" }, "year") : this.num(dt.year, 6);
        case "G":
          return era("short");
        case "GG":
          return era("long");
        case "GGGGG":
          return era("narrow");
        case "kk":
          return this.num(dt.weekYear.toString().slice(-2), 2);
        case "kkkk":
          return this.num(dt.weekYear, 4);
        case "W":
          return this.num(dt.weekNumber);
        case "WW":
          return this.num(dt.weekNumber, 2);
        case "n":
          return this.num(dt.localWeekNumber);
        case "nn":
          return this.num(dt.localWeekNumber, 2);
        case "ii":
          return this.num(dt.localWeekYear.toString().slice(-2), 2);
        case "iiii":
          return this.num(dt.localWeekYear, 4);
        case "o":
          return this.num(dt.ordinal);
        case "ooo":
          return this.num(dt.ordinal, 3);
        case "q":
          return this.num(dt.quarter);
        case "qq":
          return this.num(dt.quarter, 2);
        case "X":
          return this.num(Math.floor(dt.ts / 1e3));
        case "x":
          return this.num(dt.ts);
        default:
          return maybeMacro(token);
      }
    };
    return stringifyTokens(Formatter.parseFormat(fmt), tokenToString);
  }
  formatDurationFromString(dur, fmt) {
    const tokenToField = (token) => {
      switch (token[0]) {
        case "S":
          return "millisecond";
        case "s":
          return "second";
        case "m":
          return "minute";
        case "h":
          return "hour";
        case "d":
          return "day";
        case "w":
          return "week";
        case "M":
          return "month";
        case "y":
          return "year";
        default:
          return null;
      }
    }, tokenToString = (lildur) => (token) => {
      const mapped = tokenToField(token);
      if (mapped) {
        return this.num(lildur.get(mapped), token.length);
      } else {
        return token;
      }
    }, tokens = Formatter.parseFormat(fmt), realTokens = tokens.reduce(
      (found, { literal, val }) => literal ? found : found.concat(val),
      []
    ), collapsed = dur.shiftTo(...realTokens.map(tokenToField).filter((t2) => t2));
    return stringifyTokens(tokens, tokenToString(collapsed));
  }
}
const ianaRegex = /[A-Za-z_+-]{1,256}(?::?\/[A-Za-z0-9_+-]{1,256}(?:\/[A-Za-z0-9_+-]{1,256})?)?/;
function combineRegexes(...regexes) {
  const full = regexes.reduce((f2, r2) => f2 + r2.source, "");
  return RegExp(`^${full}$`);
}
function combineExtractors(...extractors) {
  return (m2) => extractors.reduce(
    ([mergedVals, mergedZone, cursor], ex) => {
      const [val, zone, next] = ex(m2, cursor);
      return [{ ...mergedVals, ...val }, zone || mergedZone, next];
    },
    [{}, null, 1]
  ).slice(0, 2);
}
function parse(s2, ...patterns) {
  if (s2 == null) {
    return [null, null];
  }
  for (const [regex, extractor] of patterns) {
    const m2 = regex.exec(s2);
    if (m2) {
      return extractor(m2);
    }
  }
  return [null, null];
}
function simpleParse(...keys) {
  return (match2, cursor) => {
    const ret = {};
    let i;
    for (i = 0; i < keys.length; i++) {
      ret[keys[i]] = parseInteger(match2[cursor + i]);
    }
    return [ret, null, cursor + i];
  };
}
const offsetRegex = /(?:(Z)|([+-]\d\d)(?::?(\d\d))?)/;
const isoExtendedZone = `(?:${offsetRegex.source}?(?:\\[(${ianaRegex.source})\\])?)?`;
const isoTimeBaseRegex = /(\d\d)(?::?(\d\d)(?::?(\d\d)(?:[.,](\d{1,30}))?)?)?/;
const isoTimeRegex = RegExp(`${isoTimeBaseRegex.source}${isoExtendedZone}`);
const isoTimeExtensionRegex = RegExp(`(?:T${isoTimeRegex.source})?`);
const isoYmdRegex = /([+-]\d{6}|\d{4})(?:-?(\d\d)(?:-?(\d\d))?)?/;
const isoWeekRegex = /(\d{4})-?W(\d\d)(?:-?(\d))?/;
const isoOrdinalRegex = /(\d{4})-?(\d{3})/;
const extractISOWeekData = simpleParse("weekYear", "weekNumber", "weekDay");
const extractISOOrdinalData = simpleParse("year", "ordinal");
const sqlYmdRegex = /(\d{4})-(\d\d)-(\d\d)/;
const sqlTimeRegex = RegExp(
  `${isoTimeBaseRegex.source} ?(?:${offsetRegex.source}|(${ianaRegex.source}))?`
);
const sqlTimeExtensionRegex = RegExp(`(?: ${sqlTimeRegex.source})?`);
function int(match2, pos, fallback) {
  const m2 = match2[pos];
  return isUndefined(m2) ? fallback : parseInteger(m2);
}
function extractISOYmd(match2, cursor) {
  const item = {
    year: int(match2, cursor),
    month: int(match2, cursor + 1, 1),
    day: int(match2, cursor + 2, 1)
  };
  return [item, null, cursor + 3];
}
function extractISOTime(match2, cursor) {
  const item = {
    hours: int(match2, cursor, 0),
    minutes: int(match2, cursor + 1, 0),
    seconds: int(match2, cursor + 2, 0),
    milliseconds: parseMillis(match2[cursor + 3])
  };
  return [item, null, cursor + 4];
}
function extractISOOffset(match2, cursor) {
  const local = !match2[cursor] && !match2[cursor + 1], fullOffset = signedOffset(match2[cursor + 1], match2[cursor + 2]), zone = local ? null : FixedOffsetZone.instance(fullOffset);
  return [{}, zone, cursor + 3];
}
function extractIANAZone(match2, cursor) {
  const zone = match2[cursor] ? IANAZone.create(match2[cursor]) : null;
  return [{}, zone, cursor + 1];
}
const isoTimeOnly = RegExp(`^T?${isoTimeBaseRegex.source}$`);
const isoDuration = /^-?P(?:(?:(-?\d{1,20}(?:\.\d{1,20})?)Y)?(?:(-?\d{1,20}(?:\.\d{1,20})?)M)?(?:(-?\d{1,20}(?:\.\d{1,20})?)W)?(?:(-?\d{1,20}(?:\.\d{1,20})?)D)?(?:T(?:(-?\d{1,20}(?:\.\d{1,20})?)H)?(?:(-?\d{1,20}(?:\.\d{1,20})?)M)?(?:(-?\d{1,20})(?:[.,](-?\d{1,20}))?S)?)?)$/;
function extractISODuration(match2) {
  const [s2, yearStr, monthStr, weekStr, dayStr, hourStr, minuteStr, secondStr, millisecondsStr] = match2;
  const hasNegativePrefix = s2[0] === "-";
  const negativeSeconds = secondStr && secondStr[0] === "-";
  const maybeNegate = (num, force = false) => num !== void 0 && (force || num && hasNegativePrefix) ? -num : num;
  return [
    {
      years: maybeNegate(parseFloating(yearStr)),
      months: maybeNegate(parseFloating(monthStr)),
      weeks: maybeNegate(parseFloating(weekStr)),
      days: maybeNegate(parseFloating(dayStr)),
      hours: maybeNegate(parseFloating(hourStr)),
      minutes: maybeNegate(parseFloating(minuteStr)),
      seconds: maybeNegate(parseFloating(secondStr), secondStr === "-0"),
      milliseconds: maybeNegate(parseMillis(millisecondsStr), negativeSeconds)
    }
  ];
}
const obsOffsets = {
  GMT: 0,
  EDT: -4 * 60,
  EST: -5 * 60,
  CDT: -5 * 60,
  CST: -6 * 60,
  MDT: -6 * 60,
  MST: -7 * 60,
  PDT: -7 * 60,
  PST: -8 * 60
};
function fromStrings(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr) {
  const result = {
    year: yearStr.length === 2 ? untruncateYear(parseInteger(yearStr)) : parseInteger(yearStr),
    month: monthsShort.indexOf(monthStr) + 1,
    day: parseInteger(dayStr),
    hour: parseInteger(hourStr),
    minute: parseInteger(minuteStr)
  };
  if (secondStr) result.second = parseInteger(secondStr);
  if (weekdayStr) {
    result.weekday = weekdayStr.length > 3 ? weekdaysLong.indexOf(weekdayStr) + 1 : weekdaysShort.indexOf(weekdayStr) + 1;
  }
  return result;
}
const rfc2822 = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|(?:([+-]\d\d)(\d\d)))$/;
function extractRFC2822(match2) {
  const [
    ,
    weekdayStr,
    dayStr,
    monthStr,
    yearStr,
    hourStr,
    minuteStr,
    secondStr,
    obsOffset,
    milOffset,
    offHourStr,
    offMinuteStr
  ] = match2, result = fromStrings(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr);
  let offset2;
  if (obsOffset) {
    offset2 = obsOffsets[obsOffset];
  } else if (milOffset) {
    offset2 = 0;
  } else {
    offset2 = signedOffset(offHourStr, offMinuteStr);
  }
  return [result, new FixedOffsetZone(offset2)];
}
function preprocessRFC2822(s2) {
  return s2.replace(/\([^()]*\)|[\n\t]/g, " ").replace(/(\s\s+)/g, " ").trim();
}
const rfc1123 = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d\d) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d\d):(\d\d):(\d\d) GMT$/, rfc850 = /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d\d)-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d\d) (\d\d):(\d\d):(\d\d) GMT$/, ascii = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( \d|\d\d) (\d\d):(\d\d):(\d\d) (\d{4})$/;
function extractRFC1123Or850(match2) {
  const [, weekdayStr, dayStr, monthStr, yearStr, hourStr, minuteStr, secondStr] = match2, result = fromStrings(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr);
  return [result, FixedOffsetZone.utcInstance];
}
function extractASCII(match2) {
  const [, weekdayStr, monthStr, dayStr, hourStr, minuteStr, secondStr, yearStr] = match2, result = fromStrings(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr);
  return [result, FixedOffsetZone.utcInstance];
}
const isoYmdWithTimeExtensionRegex = combineRegexes(isoYmdRegex, isoTimeExtensionRegex);
const isoWeekWithTimeExtensionRegex = combineRegexes(isoWeekRegex, isoTimeExtensionRegex);
const isoOrdinalWithTimeExtensionRegex = combineRegexes(isoOrdinalRegex, isoTimeExtensionRegex);
const isoTimeCombinedRegex = combineRegexes(isoTimeRegex);
const extractISOYmdTimeAndOffset = combineExtractors(
  extractISOYmd,
  extractISOTime,
  extractISOOffset,
  extractIANAZone
);
const extractISOWeekTimeAndOffset = combineExtractors(
  extractISOWeekData,
  extractISOTime,
  extractISOOffset,
  extractIANAZone
);
const extractISOOrdinalDateAndTime = combineExtractors(
  extractISOOrdinalData,
  extractISOTime,
  extractISOOffset,
  extractIANAZone
);
const extractISOTimeAndOffset = combineExtractors(
  extractISOTime,
  extractISOOffset,
  extractIANAZone
);
function parseISODate(s2) {
  return parse(
    s2,
    [isoYmdWithTimeExtensionRegex, extractISOYmdTimeAndOffset],
    [isoWeekWithTimeExtensionRegex, extractISOWeekTimeAndOffset],
    [isoOrdinalWithTimeExtensionRegex, extractISOOrdinalDateAndTime],
    [isoTimeCombinedRegex, extractISOTimeAndOffset]
  );
}
function parseRFC2822Date(s2) {
  return parse(preprocessRFC2822(s2), [rfc2822, extractRFC2822]);
}
function parseHTTPDate(s2) {
  return parse(
    s2,
    [rfc1123, extractRFC1123Or850],
    [rfc850, extractRFC1123Or850],
    [ascii, extractASCII]
  );
}
function parseISODuration(s2) {
  return parse(s2, [isoDuration, extractISODuration]);
}
const extractISOTimeOnly = combineExtractors(extractISOTime);
function parseISOTimeOnly(s2) {
  return parse(s2, [isoTimeOnly, extractISOTimeOnly]);
}
const sqlYmdWithTimeExtensionRegex = combineRegexes(sqlYmdRegex, sqlTimeExtensionRegex);
const sqlTimeCombinedRegex = combineRegexes(sqlTimeRegex);
const extractISOTimeOffsetAndIANAZone = combineExtractors(
  extractISOTime,
  extractISOOffset,
  extractIANAZone
);
function parseSQL(s2) {
  return parse(
    s2,
    [sqlYmdWithTimeExtensionRegex, extractISOYmdTimeAndOffset],
    [sqlTimeCombinedRegex, extractISOTimeOffsetAndIANAZone]
  );
}
const INVALID$2 = "Invalid Duration";
const lowOrderMatrix = {
  weeks: {
    days: 7,
    hours: 7 * 24,
    minutes: 7 * 24 * 60,
    seconds: 7 * 24 * 60 * 60,
    milliseconds: 7 * 24 * 60 * 60 * 1e3
  },
  days: {
    hours: 24,
    minutes: 24 * 60,
    seconds: 24 * 60 * 60,
    milliseconds: 24 * 60 * 60 * 1e3
  },
  hours: { minutes: 60, seconds: 60 * 60, milliseconds: 60 * 60 * 1e3 },
  minutes: { seconds: 60, milliseconds: 60 * 1e3 },
  seconds: { milliseconds: 1e3 }
}, casualMatrix = {
  years: {
    quarters: 4,
    months: 12,
    weeks: 52,
    days: 365,
    hours: 365 * 24,
    minutes: 365 * 24 * 60,
    seconds: 365 * 24 * 60 * 60,
    milliseconds: 365 * 24 * 60 * 60 * 1e3
  },
  quarters: {
    months: 3,
    weeks: 13,
    days: 91,
    hours: 91 * 24,
    minutes: 91 * 24 * 60,
    seconds: 91 * 24 * 60 * 60,
    milliseconds: 91 * 24 * 60 * 60 * 1e3
  },
  months: {
    weeks: 4,
    days: 30,
    hours: 30 * 24,
    minutes: 30 * 24 * 60,
    seconds: 30 * 24 * 60 * 60,
    milliseconds: 30 * 24 * 60 * 60 * 1e3
  },
  ...lowOrderMatrix
}, daysInYearAccurate = 146097 / 400, daysInMonthAccurate = 146097 / 4800, accurateMatrix = {
  years: {
    quarters: 4,
    months: 12,
    weeks: daysInYearAccurate / 7,
    days: daysInYearAccurate,
    hours: daysInYearAccurate * 24,
    minutes: daysInYearAccurate * 24 * 60,
    seconds: daysInYearAccurate * 24 * 60 * 60,
    milliseconds: daysInYearAccurate * 24 * 60 * 60 * 1e3
  },
  quarters: {
    months: 3,
    weeks: daysInYearAccurate / 28,
    days: daysInYearAccurate / 4,
    hours: daysInYearAccurate * 24 / 4,
    minutes: daysInYearAccurate * 24 * 60 / 4,
    seconds: daysInYearAccurate * 24 * 60 * 60 / 4,
    milliseconds: daysInYearAccurate * 24 * 60 * 60 * 1e3 / 4
  },
  months: {
    weeks: daysInMonthAccurate / 7,
    days: daysInMonthAccurate,
    hours: daysInMonthAccurate * 24,
    minutes: daysInMonthAccurate * 24 * 60,
    seconds: daysInMonthAccurate * 24 * 60 * 60,
    milliseconds: daysInMonthAccurate * 24 * 60 * 60 * 1e3
  },
  ...lowOrderMatrix
};
const orderedUnits$1 = [
  "years",
  "quarters",
  "months",
  "weeks",
  "days",
  "hours",
  "minutes",
  "seconds",
  "milliseconds"
];
const reverseUnits = orderedUnits$1.slice(0).reverse();
function clone$1(dur, alts, clear = false) {
  const conf = {
    values: clear ? alts.values : { ...dur.values, ...alts.values || {} },
    loc: dur.loc.clone(alts.loc),
    conversionAccuracy: alts.conversionAccuracy || dur.conversionAccuracy,
    matrix: alts.matrix || dur.matrix
  };
  return new Duration(conf);
}
function durationToMillis(matrix, vals) {
  let sum = vals.milliseconds ?? 0;
  for (const unit of reverseUnits.slice(1)) {
    if (vals[unit]) {
      sum += vals[unit] * matrix[unit]["milliseconds"];
    }
  }
  return sum;
}
function normalizeValues(matrix, vals) {
  const factor = durationToMillis(matrix, vals) < 0 ? -1 : 1;
  orderedUnits$1.reduceRight((previous, current2) => {
    if (!isUndefined(vals[current2])) {
      if (previous) {
        const previousVal = vals[previous] * factor;
        const conv = matrix[current2][previous];
        const rollUp = Math.floor(previousVal / conv);
        vals[current2] += rollUp * factor;
        vals[previous] -= rollUp * conv * factor;
      }
      return current2;
    } else {
      return previous;
    }
  }, null);
  orderedUnits$1.reduce((previous, current2) => {
    if (!isUndefined(vals[current2])) {
      if (previous) {
        const fraction = vals[previous] % 1;
        vals[previous] -= fraction;
        vals[current2] += fraction * matrix[previous][current2];
      }
      return current2;
    } else {
      return previous;
    }
  }, null);
}
function removeZeroes(vals) {
  const newVals = {};
  for (const [key, value] of Object.entries(vals)) {
    if (value !== 0) {
      newVals[key] = value;
    }
  }
  return newVals;
}
class Duration {
  /**
   * @private
   */
  constructor(config2) {
    const accurate = config2.conversionAccuracy === "longterm" || false;
    let matrix = accurate ? accurateMatrix : casualMatrix;
    if (config2.matrix) {
      matrix = config2.matrix;
    }
    this.values = config2.values;
    this.loc = config2.loc || Locale.create();
    this.conversionAccuracy = accurate ? "longterm" : "casual";
    this.invalid = config2.invalid || null;
    this.matrix = matrix;
    this.isLuxonDuration = true;
  }
  /**
   * Create Duration from a number of milliseconds.
   * @param {number} count of milliseconds
   * @param {Object} opts - options for parsing
   * @param {string} [opts.locale='en-US'] - the locale to use
   * @param {string} opts.numberingSystem - the numbering system to use
   * @param {string} [opts.conversionAccuracy='casual'] - the conversion system to use
   * @return {Duration}
   */
  static fromMillis(count, opts) {
    return Duration.fromObject({ milliseconds: count }, opts);
  }
  /**
   * Create a Duration from a JavaScript object with keys like 'years' and 'hours'.
   * If this object is empty then a zero milliseconds duration is returned.
   * @param {Object} obj - the object to create the DateTime from
   * @param {number} obj.years
   * @param {number} obj.quarters
   * @param {number} obj.months
   * @param {number} obj.weeks
   * @param {number} obj.days
   * @param {number} obj.hours
   * @param {number} obj.minutes
   * @param {number} obj.seconds
   * @param {number} obj.milliseconds
   * @param {Object} [opts=[]] - options for creating this Duration
   * @param {string} [opts.locale='en-US'] - the locale to use
   * @param {string} opts.numberingSystem - the numbering system to use
   * @param {string} [opts.conversionAccuracy='casual'] - the preset conversion system to use
   * @param {string} [opts.matrix=Object] - the custom conversion system to use
   * @return {Duration}
   */
  static fromObject(obj, opts = {}) {
    if (obj == null || typeof obj !== "object") {
      throw new InvalidArgumentError(
        `Duration.fromObject: argument expected to be an object, got ${obj === null ? "null" : typeof obj}`
      );
    }
    return new Duration({
      values: normalizeObject(obj, Duration.normalizeUnit),
      loc: Locale.fromObject(opts),
      conversionAccuracy: opts.conversionAccuracy,
      matrix: opts.matrix
    });
  }
  /**
   * Create a Duration from DurationLike.
   *
   * @param {Object | number | Duration} durationLike
   * One of:
   * - object with keys like 'years' and 'hours'.
   * - number representing milliseconds
   * - Duration instance
   * @return {Duration}
   */
  static fromDurationLike(durationLike) {
    if (isNumber(durationLike)) {
      return Duration.fromMillis(durationLike);
    } else if (Duration.isDuration(durationLike)) {
      return durationLike;
    } else if (typeof durationLike === "object") {
      return Duration.fromObject(durationLike);
    } else {
      throw new InvalidArgumentError(
        `Unknown duration argument ${durationLike} of type ${typeof durationLike}`
      );
    }
  }
  /**
   * Create a Duration from an ISO 8601 duration string.
   * @param {string} text - text to parse
   * @param {Object} opts - options for parsing
   * @param {string} [opts.locale='en-US'] - the locale to use
   * @param {string} opts.numberingSystem - the numbering system to use
   * @param {string} [opts.conversionAccuracy='casual'] - the preset conversion system to use
   * @param {string} [opts.matrix=Object] - the preset conversion system to use
   * @see https://en.wikipedia.org/wiki/ISO_8601#Durations
   * @example Duration.fromISO('P3Y6M1W4DT12H30M5S').toObject() //=> { years: 3, months: 6, weeks: 1, days: 4, hours: 12, minutes: 30, seconds: 5 }
   * @example Duration.fromISO('PT23H').toObject() //=> { hours: 23 }
   * @example Duration.fromISO('P5Y3M').toObject() //=> { years: 5, months: 3 }
   * @return {Duration}
   */
  static fromISO(text, opts) {
    const [parsed] = parseISODuration(text);
    if (parsed) {
      return Duration.fromObject(parsed, opts);
    } else {
      return Duration.invalid("unparsable", `the input "${text}" can't be parsed as ISO 8601`);
    }
  }
  /**
   * Create a Duration from an ISO 8601 time string.
   * @param {string} text - text to parse
   * @param {Object} opts - options for parsing
   * @param {string} [opts.locale='en-US'] - the locale to use
   * @param {string} opts.numberingSystem - the numbering system to use
   * @param {string} [opts.conversionAccuracy='casual'] - the preset conversion system to use
   * @param {string} [opts.matrix=Object] - the conversion system to use
   * @see https://en.wikipedia.org/wiki/ISO_8601#Times
   * @example Duration.fromISOTime('11:22:33.444').toObject() //=> { hours: 11, minutes: 22, seconds: 33, milliseconds: 444 }
   * @example Duration.fromISOTime('11:00').toObject() //=> { hours: 11, minutes: 0, seconds: 0 }
   * @example Duration.fromISOTime('T11:00').toObject() //=> { hours: 11, minutes: 0, seconds: 0 }
   * @example Duration.fromISOTime('1100').toObject() //=> { hours: 11, minutes: 0, seconds: 0 }
   * @example Duration.fromISOTime('T1100').toObject() //=> { hours: 11, minutes: 0, seconds: 0 }
   * @return {Duration}
   */
  static fromISOTime(text, opts) {
    const [parsed] = parseISOTimeOnly(text);
    if (parsed) {
      return Duration.fromObject(parsed, opts);
    } else {
      return Duration.invalid("unparsable", `the input "${text}" can't be parsed as ISO 8601`);
    }
  }
  /**
   * Create an invalid Duration.
   * @param {string} reason - simple string of why this datetime is invalid. Should not contain parameters or anything else data-dependent
   * @param {string} [explanation=null] - longer explanation, may include parameters and other useful debugging information
   * @return {Duration}
   */
  static invalid(reason, explanation = null) {
    if (!reason) {
      throw new InvalidArgumentError("need to specify a reason the Duration is invalid");
    }
    const invalid = reason instanceof Invalid ? reason : new Invalid(reason, explanation);
    if (Settings.throwOnInvalid) {
      throw new InvalidDurationError(invalid);
    } else {
      return new Duration({ invalid });
    }
  }
  /**
   * @private
   */
  static normalizeUnit(unit) {
    const normalized = {
      year: "years",
      years: "years",
      quarter: "quarters",
      quarters: "quarters",
      month: "months",
      months: "months",
      week: "weeks",
      weeks: "weeks",
      day: "days",
      days: "days",
      hour: "hours",
      hours: "hours",
      minute: "minutes",
      minutes: "minutes",
      second: "seconds",
      seconds: "seconds",
      millisecond: "milliseconds",
      milliseconds: "milliseconds"
    }[unit ? unit.toLowerCase() : unit];
    if (!normalized) throw new InvalidUnitError(unit);
    return normalized;
  }
  /**
   * Check if an object is a Duration. Works across context boundaries
   * @param {object} o
   * @return {boolean}
   */
  static isDuration(o) {
    return o && o.isLuxonDuration || false;
  }
  /**
   * Get  the locale of a Duration, such 'en-GB'
   * @type {string}
   */
  get locale() {
    return this.isValid ? this.loc.locale : null;
  }
  /**
   * Get the numbering system of a Duration, such 'beng'. The numbering system is used when formatting the Duration
   *
   * @type {string}
   */
  get numberingSystem() {
    return this.isValid ? this.loc.numberingSystem : null;
  }
  /**
   * Returns a string representation of this Duration formatted according to the specified format string. You may use these tokens:
   * * `S` for milliseconds
   * * `s` for seconds
   * * `m` for minutes
   * * `h` for hours
   * * `d` for days
   * * `w` for weeks
   * * `M` for months
   * * `y` for years
   * Notes:
   * * Add padding by repeating the token, e.g. "yy" pads the years to two digits, "hhhh" pads the hours out to four digits
   * * Tokens can be escaped by wrapping with single quotes.
   * * The duration will be converted to the set of units in the format string using {@link Duration#shiftTo} and the Durations's conversion accuracy setting.
   * @param {string} fmt - the format string
   * @param {Object} opts - options
   * @param {boolean} [opts.floor=true] - floor numerical values
   * @example Duration.fromObject({ years: 1, days: 6, seconds: 2 }).toFormat("y d s") //=> "1 6 2"
   * @example Duration.fromObject({ years: 1, days: 6, seconds: 2 }).toFormat("yy dd sss") //=> "01 06 002"
   * @example Duration.fromObject({ years: 1, days: 6, seconds: 2 }).toFormat("M S") //=> "12 518402000"
   * @return {string}
   */
  toFormat(fmt, opts = {}) {
    const fmtOpts = {
      ...opts,
      floor: opts.round !== false && opts.floor !== false
    };
    return this.isValid ? Formatter.create(this.loc, fmtOpts).formatDurationFromString(this, fmt) : INVALID$2;
  }
  /**
   * Returns a string representation of a Duration with all units included.
   * To modify its behavior, use `listStyle` and any Intl.NumberFormat option, though `unitDisplay` is especially relevant.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#options
   * @param {Object} opts - Formatting options. Accepts the same keys as the options parameter of the native `Intl.NumberFormat` constructor, as well as `listStyle`.
   * @param {string} [opts.listStyle='narrow'] - How to format the merged list. Corresponds to the `style` property of the options parameter of the native `Intl.ListFormat` constructor.
   * @example
   * ```js
   * var dur = Duration.fromObject({ days: 1, hours: 5, minutes: 6 })
   * dur.toHuman() //=> '1 day, 5 hours, 6 minutes'
   * dur.toHuman({ listStyle: "long" }) //=> '1 day, 5 hours, and 6 minutes'
   * dur.toHuman({ unitDisplay: "short" }) //=> '1 day, 5 hr, 6 min'
   * ```
   */
  toHuman(opts = {}) {
    if (!this.isValid) return INVALID$2;
    const l2 = orderedUnits$1.map((unit) => {
      const val = this.values[unit];
      if (isUndefined(val)) {
        return null;
      }
      return this.loc.numberFormatter({ style: "unit", unitDisplay: "long", ...opts, unit: unit.slice(0, -1) }).format(val);
    }).filter((n2) => n2);
    return this.loc.listFormatter({ type: "conjunction", style: opts.listStyle || "narrow", ...opts }).format(l2);
  }
  /**
   * Returns a JavaScript object with this Duration's values.
   * @example Duration.fromObject({ years: 1, days: 6, seconds: 2 }).toObject() //=> { years: 1, days: 6, seconds: 2 }
   * @return {Object}
   */
  toObject() {
    if (!this.isValid) return {};
    return { ...this.values };
  }
  /**
   * Returns an ISO 8601-compliant string representation of this Duration.
   * @see https://en.wikipedia.org/wiki/ISO_8601#Durations
   * @example Duration.fromObject({ years: 3, seconds: 45 }).toISO() //=> 'P3YT45S'
   * @example Duration.fromObject({ months: 4, seconds: 45 }).toISO() //=> 'P4MT45S'
   * @example Duration.fromObject({ months: 5 }).toISO() //=> 'P5M'
   * @example Duration.fromObject({ minutes: 5 }).toISO() //=> 'PT5M'
   * @example Duration.fromObject({ milliseconds: 6 }).toISO() //=> 'PT0.006S'
   * @return {string}
   */
  toISO() {
    if (!this.isValid) return null;
    let s2 = "P";
    if (this.years !== 0) s2 += this.years + "Y";
    if (this.months !== 0 || this.quarters !== 0) s2 += this.months + this.quarters * 3 + "M";
    if (this.weeks !== 0) s2 += this.weeks + "W";
    if (this.days !== 0) s2 += this.days + "D";
    if (this.hours !== 0 || this.minutes !== 0 || this.seconds !== 0 || this.milliseconds !== 0)
      s2 += "T";
    if (this.hours !== 0) s2 += this.hours + "H";
    if (this.minutes !== 0) s2 += this.minutes + "M";
    if (this.seconds !== 0 || this.milliseconds !== 0)
      s2 += roundTo(this.seconds + this.milliseconds / 1e3, 3) + "S";
    if (s2 === "P") s2 += "T0S";
    return s2;
  }
  /**
   * Returns an ISO 8601-compliant string representation of this Duration, formatted as a time of day.
   * Note that this will return null if the duration is invalid, negative, or equal to or greater than 24 hours.
   * @see https://en.wikipedia.org/wiki/ISO_8601#Times
   * @param {Object} opts - options
   * @param {boolean} [opts.suppressMilliseconds=false] - exclude milliseconds from the format if they're 0
   * @param {boolean} [opts.suppressSeconds=false] - exclude seconds from the format if they're 0
   * @param {boolean} [opts.includePrefix=false] - include the `T` prefix
   * @param {string} [opts.format='extended'] - choose between the basic and extended format
   * @example Duration.fromObject({ hours: 11 }).toISOTime() //=> '11:00:00.000'
   * @example Duration.fromObject({ hours: 11 }).toISOTime({ suppressMilliseconds: true }) //=> '11:00:00'
   * @example Duration.fromObject({ hours: 11 }).toISOTime({ suppressSeconds: true }) //=> '11:00'
   * @example Duration.fromObject({ hours: 11 }).toISOTime({ includePrefix: true }) //=> 'T11:00:00.000'
   * @example Duration.fromObject({ hours: 11 }).toISOTime({ format: 'basic' }) //=> '110000.000'
   * @return {string}
   */
  toISOTime(opts = {}) {
    if (!this.isValid) return null;
    const millis = this.toMillis();
    if (millis < 0 || millis >= 864e5) return null;
    opts = {
      suppressMilliseconds: false,
      suppressSeconds: false,
      includePrefix: false,
      format: "extended",
      ...opts,
      includeOffset: false
    };
    const dateTime = DateTime.fromMillis(millis, { zone: "UTC" });
    return dateTime.toISOTime(opts);
  }
  /**
   * Returns an ISO 8601 representation of this Duration appropriate for use in JSON.
   * @return {string}
   */
  toJSON() {
    return this.toISO();
  }
  /**
   * Returns an ISO 8601 representation of this Duration appropriate for use in debugging.
   * @return {string}
   */
  toString() {
    return this.toISO();
  }
  /**
   * Returns a string representation of this Duration appropriate for the REPL.
   * @return {string}
   */
  [Symbol.for("nodejs.util.inspect.custom")]() {
    if (this.isValid) {
      return `Duration { values: ${JSON.stringify(this.values)} }`;
    } else {
      return `Duration { Invalid, reason: ${this.invalidReason} }`;
    }
  }
  /**
   * Returns an milliseconds value of this Duration.
   * @return {number}
   */
  toMillis() {
    if (!this.isValid) return NaN;
    return durationToMillis(this.matrix, this.values);
  }
  /**
   * Returns an milliseconds value of this Duration. Alias of {@link toMillis}
   * @return {number}
   */
  valueOf() {
    return this.toMillis();
  }
  /**
   * Make this Duration longer by the specified amount. Return a newly-constructed Duration.
   * @param {Duration|Object|number} duration - The amount to add. Either a Luxon Duration, a number of milliseconds, the object argument to Duration.fromObject()
   * @return {Duration}
   */
  plus(duration) {
    if (!this.isValid) return this;
    const dur = Duration.fromDurationLike(duration), result = {};
    for (const k2 of orderedUnits$1) {
      if (hasOwnProperty(dur.values, k2) || hasOwnProperty(this.values, k2)) {
        result[k2] = dur.get(k2) + this.get(k2);
      }
    }
    return clone$1(this, { values: result }, true);
  }
  /**
   * Make this Duration shorter by the specified amount. Return a newly-constructed Duration.
   * @param {Duration|Object|number} duration - The amount to subtract. Either a Luxon Duration, a number of milliseconds, the object argument to Duration.fromObject()
   * @return {Duration}
   */
  minus(duration) {
    if (!this.isValid) return this;
    const dur = Duration.fromDurationLike(duration);
    return this.plus(dur.negate());
  }
  /**
   * Scale this Duration by the specified amount. Return a newly-constructed Duration.
   * @param {function} fn - The function to apply to each unit. Arity is 1 or 2: the value of the unit and, optionally, the unit name. Must return a number.
   * @example Duration.fromObject({ hours: 1, minutes: 30 }).mapUnits(x => x * 2) //=> { hours: 2, minutes: 60 }
   * @example Duration.fromObject({ hours: 1, minutes: 30 }).mapUnits((x, u) => u === "hours" ? x * 2 : x) //=> { hours: 2, minutes: 30 }
   * @return {Duration}
   */
  mapUnits(fn) {
    if (!this.isValid) return this;
    const result = {};
    for (const k2 of Object.keys(this.values)) {
      result[k2] = asNumber(fn(this.values[k2], k2));
    }
    return clone$1(this, { values: result }, true);
  }
  /**
   * Get the value of unit.
   * @param {string} unit - a unit such as 'minute' or 'day'
   * @example Duration.fromObject({years: 2, days: 3}).get('years') //=> 2
   * @example Duration.fromObject({years: 2, days: 3}).get('months') //=> 0
   * @example Duration.fromObject({years: 2, days: 3}).get('days') //=> 3
   * @return {number}
   */
  get(unit) {
    return this[Duration.normalizeUnit(unit)];
  }
  /**
   * "Set" the values of specified units. Return a newly-constructed Duration.
   * @param {Object} values - a mapping of units to numbers
   * @example dur.set({ years: 2017 })
   * @example dur.set({ hours: 8, minutes: 30 })
   * @return {Duration}
   */
  set(values) {
    if (!this.isValid) return this;
    const mixed = { ...this.values, ...normalizeObject(values, Duration.normalizeUnit) };
    return clone$1(this, { values: mixed });
  }
  /**
   * "Set" the locale and/or numberingSystem.  Returns a newly-constructed Duration.
   * @example dur.reconfigure({ locale: 'en-GB' })
   * @return {Duration}
   */
  reconfigure({ locale, numberingSystem, conversionAccuracy, matrix } = {}) {
    const loc = this.loc.clone({ locale, numberingSystem });
    const opts = { loc, matrix, conversionAccuracy };
    return clone$1(this, opts);
  }
  /**
   * Return the length of the duration in the specified unit.
   * @param {string} unit - a unit such as 'minutes' or 'days'
   * @example Duration.fromObject({years: 1}).as('days') //=> 365
   * @example Duration.fromObject({years: 1}).as('months') //=> 12
   * @example Duration.fromObject({hours: 60}).as('days') //=> 2.5
   * @return {number}
   */
  as(unit) {
    return this.isValid ? this.shiftTo(unit).get(unit) : NaN;
  }
  /**
   * Reduce this Duration to its canonical representation in its current units.
   * Assuming the overall value of the Duration is positive, this means:
   * - excessive values for lower-order units are converted to higher-order units (if possible, see first and second example)
   * - negative lower-order units are converted to higher order units (there must be such a higher order unit, otherwise
   *   the overall value would be negative, see third example)
   * - fractional values for higher-order units are converted to lower-order units (if possible, see fourth example)
   *
   * If the overall value is negative, the result of this method is equivalent to `this.negate().normalize().negate()`.
   * @example Duration.fromObject({ years: 2, days: 5000 }).normalize().toObject() //=> { years: 15, days: 255 }
   * @example Duration.fromObject({ days: 5000 }).normalize().toObject() //=> { days: 5000 }
   * @example Duration.fromObject({ hours: 12, minutes: -45 }).normalize().toObject() //=> { hours: 11, minutes: 15 }
   * @example Duration.fromObject({ years: 2.5, days: 0, hours: 0 }).normalize().toObject() //=> { years: 2, days: 182, hours: 12 }
   * @return {Duration}
   */
  normalize() {
    if (!this.isValid) return this;
    const vals = this.toObject();
    normalizeValues(this.matrix, vals);
    return clone$1(this, { values: vals }, true);
  }
  /**
   * Rescale units to its largest representation
   * @example Duration.fromObject({ milliseconds: 90000 }).rescale().toObject() //=> { minutes: 1, seconds: 30 }
   * @return {Duration}
   */
  rescale() {
    if (!this.isValid) return this;
    const vals = removeZeroes(this.normalize().shiftToAll().toObject());
    return clone$1(this, { values: vals }, true);
  }
  /**
   * Convert this Duration into its representation in a different set of units.
   * @example Duration.fromObject({ hours: 1, seconds: 30 }).shiftTo('minutes', 'milliseconds').toObject() //=> { minutes: 60, milliseconds: 30000 }
   * @return {Duration}
   */
  shiftTo(...units) {
    if (!this.isValid) return this;
    if (units.length === 0) {
      return this;
    }
    units = units.map((u2) => Duration.normalizeUnit(u2));
    const built = {}, accumulated = {}, vals = this.toObject();
    let lastUnit;
    for (const k2 of orderedUnits$1) {
      if (units.indexOf(k2) >= 0) {
        lastUnit = k2;
        let own = 0;
        for (const ak2 in accumulated) {
          own += this.matrix[ak2][k2] * accumulated[ak2];
          accumulated[ak2] = 0;
        }
        if (isNumber(vals[k2])) {
          own += vals[k2];
        }
        const i = Math.trunc(own);
        built[k2] = i;
        accumulated[k2] = (own * 1e3 - i * 1e3) / 1e3;
      } else if (isNumber(vals[k2])) {
        accumulated[k2] = vals[k2];
      }
    }
    for (const key in accumulated) {
      if (accumulated[key] !== 0) {
        built[lastUnit] += key === lastUnit ? accumulated[key] : accumulated[key] / this.matrix[lastUnit][key];
      }
    }
    normalizeValues(this.matrix, built);
    return clone$1(this, { values: built }, true);
  }
  /**
   * Shift this Duration to all available units.
   * Same as shiftTo("years", "months", "weeks", "days", "hours", "minutes", "seconds", "milliseconds")
   * @return {Duration}
   */
  shiftToAll() {
    if (!this.isValid) return this;
    return this.shiftTo(
      "years",
      "months",
      "weeks",
      "days",
      "hours",
      "minutes",
      "seconds",
      "milliseconds"
    );
  }
  /**
   * Return the negative of this Duration.
   * @example Duration.fromObject({ hours: 1, seconds: 30 }).negate().toObject() //=> { hours: -1, seconds: -30 }
   * @return {Duration}
   */
  negate() {
    if (!this.isValid) return this;
    const negated = {};
    for (const k2 of Object.keys(this.values)) {
      negated[k2] = this.values[k2] === 0 ? 0 : -this.values[k2];
    }
    return clone$1(this, { values: negated }, true);
  }
  /**
   * Get the years.
   * @type {number}
   */
  get years() {
    return this.isValid ? this.values.years || 0 : NaN;
  }
  /**
   * Get the quarters.
   * @type {number}
   */
  get quarters() {
    return this.isValid ? this.values.quarters || 0 : NaN;
  }
  /**
   * Get the months.
   * @type {number}
   */
  get months() {
    return this.isValid ? this.values.months || 0 : NaN;
  }
  /**
   * Get the weeks
   * @type {number}
   */
  get weeks() {
    return this.isValid ? this.values.weeks || 0 : NaN;
  }
  /**
   * Get the days.
   * @type {number}
   */
  get days() {
    return this.isValid ? this.values.days || 0 : NaN;
  }
  /**
   * Get the hours.
   * @type {number}
   */
  get hours() {
    return this.isValid ? this.values.hours || 0 : NaN;
  }
  /**
   * Get the minutes.
   * @type {number}
   */
  get minutes() {
    return this.isValid ? this.values.minutes || 0 : NaN;
  }
  /**
   * Get the seconds.
   * @return {number}
   */
  get seconds() {
    return this.isValid ? this.values.seconds || 0 : NaN;
  }
  /**
   * Get the milliseconds.
   * @return {number}
   */
  get milliseconds() {
    return this.isValid ? this.values.milliseconds || 0 : NaN;
  }
  /**
   * Returns whether the Duration is invalid. Invalid durations are returned by diff operations
   * on invalid DateTimes or Intervals.
   * @return {boolean}
   */
  get isValid() {
    return this.invalid === null;
  }
  /**
   * Returns an error code if this Duration became invalid, or null if the Duration is valid
   * @return {string}
   */
  get invalidReason() {
    return this.invalid ? this.invalid.reason : null;
  }
  /**
   * Returns an explanation of why this Duration became invalid, or null if the Duration is valid
   * @type {string}
   */
  get invalidExplanation() {
    return this.invalid ? this.invalid.explanation : null;
  }
  /**
   * Equality check
   * Two Durations are equal iff they have the same units and the same values for each unit.
   * @param {Duration} other
   * @return {boolean}
   */
  equals(other) {
    if (!this.isValid || !other.isValid) {
      return false;
    }
    if (!this.loc.equals(other.loc)) {
      return false;
    }
    function eq(v1, v2) {
      if (v1 === void 0 || v1 === 0) return v2 === void 0 || v2 === 0;
      return v1 === v2;
    }
    for (const u2 of orderedUnits$1) {
      if (!eq(this.values[u2], other.values[u2])) {
        return false;
      }
    }
    return true;
  }
}
const INVALID$1 = "Invalid Interval";
function validateStartEnd(start, end) {
  if (!start || !start.isValid) {
    return Interval.invalid("missing or invalid start");
  } else if (!end || !end.isValid) {
    return Interval.invalid("missing or invalid end");
  } else if (end < start) {
    return Interval.invalid(
      "end before start",
      `The end of an interval must be after its start, but you had start=${start.toISO()} and end=${end.toISO()}`
    );
  } else {
    return null;
  }
}
class Interval {
  /**
   * @private
   */
  constructor(config2) {
    this.s = config2.start;
    this.e = config2.end;
    this.invalid = config2.invalid || null;
    this.isLuxonInterval = true;
  }
  /**
   * Create an invalid Interval.
   * @param {string} reason - simple string of why this Interval is invalid. Should not contain parameters or anything else data-dependent
   * @param {string} [explanation=null] - longer explanation, may include parameters and other useful debugging information
   * @return {Interval}
   */
  static invalid(reason, explanation = null) {
    if (!reason) {
      throw new InvalidArgumentError("need to specify a reason the Interval is invalid");
    }
    const invalid = reason instanceof Invalid ? reason : new Invalid(reason, explanation);
    if (Settings.throwOnInvalid) {
      throw new InvalidIntervalError(invalid);
    } else {
      return new Interval({ invalid });
    }
  }
  /**
   * Create an Interval from a start DateTime and an end DateTime. Inclusive of the start but not the end.
   * @param {DateTime|Date|Object} start
   * @param {DateTime|Date|Object} end
   * @return {Interval}
   */
  static fromDateTimes(start, end) {
    const builtStart = friendlyDateTime(start), builtEnd = friendlyDateTime(end);
    const validateError = validateStartEnd(builtStart, builtEnd);
    if (validateError == null) {
      return new Interval({
        start: builtStart,
        end: builtEnd
      });
    } else {
      return validateError;
    }
  }
  /**
   * Create an Interval from a start DateTime and a Duration to extend to.
   * @param {DateTime|Date|Object} start
   * @param {Duration|Object|number} duration - the length of the Interval.
   * @return {Interval}
   */
  static after(start, duration) {
    const dur = Duration.fromDurationLike(duration), dt = friendlyDateTime(start);
    return Interval.fromDateTimes(dt, dt.plus(dur));
  }
  /**
   * Create an Interval from an end DateTime and a Duration to extend backwards to.
   * @param {DateTime|Date|Object} end
   * @param {Duration|Object|number} duration - the length of the Interval.
   * @return {Interval}
   */
  static before(end, duration) {
    const dur = Duration.fromDurationLike(duration), dt = friendlyDateTime(end);
    return Interval.fromDateTimes(dt.minus(dur), dt);
  }
  /**
   * Create an Interval from an ISO 8601 string.
   * Accepts `<start>/<end>`, `<start>/<duration>`, and `<duration>/<end>` formats.
   * @param {string} text - the ISO string to parse
   * @param {Object} [opts] - options to pass {@link DateTime#fromISO} and optionally {@link Duration#fromISO}
   * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
   * @return {Interval}
   */
  static fromISO(text, opts) {
    const [s2, e] = (text || "").split("/", 2);
    if (s2 && e) {
      let start, startIsValid;
      try {
        start = DateTime.fromISO(s2, opts);
        startIsValid = start.isValid;
      } catch (e2) {
        startIsValid = false;
      }
      let end, endIsValid;
      try {
        end = DateTime.fromISO(e, opts);
        endIsValid = end.isValid;
      } catch (e2) {
        endIsValid = false;
      }
      if (startIsValid && endIsValid) {
        return Interval.fromDateTimes(start, end);
      }
      if (startIsValid) {
        const dur = Duration.fromISO(e, opts);
        if (dur.isValid) {
          return Interval.after(start, dur);
        }
      } else if (endIsValid) {
        const dur = Duration.fromISO(s2, opts);
        if (dur.isValid) {
          return Interval.before(end, dur);
        }
      }
    }
    return Interval.invalid("unparsable", `the input "${text}" can't be parsed as ISO 8601`);
  }
  /**
   * Check if an object is an Interval. Works across context boundaries
   * @param {object} o
   * @return {boolean}
   */
  static isInterval(o) {
    return o && o.isLuxonInterval || false;
  }
  /**
   * Returns the start of the Interval
   * @type {DateTime}
   */
  get start() {
    return this.isValid ? this.s : null;
  }
  /**
   * Returns the end of the Interval
   * @type {DateTime}
   */
  get end() {
    return this.isValid ? this.e : null;
  }
  /**
   * Returns whether this Interval's end is at least its start, meaning that the Interval isn't 'backwards'.
   * @type {boolean}
   */
  get isValid() {
    return this.invalidReason === null;
  }
  /**
   * Returns an error code if this Interval is invalid, or null if the Interval is valid
   * @type {string}
   */
  get invalidReason() {
    return this.invalid ? this.invalid.reason : null;
  }
  /**
   * Returns an explanation of why this Interval became invalid, or null if the Interval is valid
   * @type {string}
   */
  get invalidExplanation() {
    return this.invalid ? this.invalid.explanation : null;
  }
  /**
   * Returns the length of the Interval in the specified unit.
   * @param {string} unit - the unit (such as 'hours' or 'days') to return the length in.
   * @return {number}
   */
  length(unit = "milliseconds") {
    return this.isValid ? this.toDuration(...[unit]).get(unit) : NaN;
  }
  /**
   * Returns the count of minutes, hours, days, months, or years included in the Interval, even in part.
   * Unlike {@link Interval#length} this counts sections of the calendar, not periods of time, e.g. specifying 'day'
   * asks 'what dates are included in this interval?', not 'how many days long is this interval?'
   * @param {string} [unit='milliseconds'] - the unit of time to count.
   * @param {Object} opts - options
   * @param {boolean} [opts.useLocaleWeeks=false] - If true, use weeks based on the locale, i.e. use the locale-dependent start of the week; this operation will always use the locale of the start DateTime
   * @return {number}
   */
  count(unit = "milliseconds", opts) {
    if (!this.isValid) return NaN;
    const start = this.start.startOf(unit, opts);
    let end;
    if (opts == null ? void 0 : opts.useLocaleWeeks) {
      end = this.end.reconfigure({ locale: start.locale });
    } else {
      end = this.end;
    }
    end = end.startOf(unit, opts);
    return Math.floor(end.diff(start, unit).get(unit)) + (end.valueOf() !== this.end.valueOf());
  }
  /**
   * Returns whether this Interval's start and end are both in the same unit of time
   * @param {string} unit - the unit of time to check sameness on
   * @return {boolean}
   */
  hasSame(unit) {
    return this.isValid ? this.isEmpty() || this.e.minus(1).hasSame(this.s, unit) : false;
  }
  /**
   * Return whether this Interval has the same start and end DateTimes.
   * @return {boolean}
   */
  isEmpty() {
    return this.s.valueOf() === this.e.valueOf();
  }
  /**
   * Return whether this Interval's start is after the specified DateTime.
   * @param {DateTime} dateTime
   * @return {boolean}
   */
  isAfter(dateTime) {
    if (!this.isValid) return false;
    return this.s > dateTime;
  }
  /**
   * Return whether this Interval's end is before the specified DateTime.
   * @param {DateTime} dateTime
   * @return {boolean}
   */
  isBefore(dateTime) {
    if (!this.isValid) return false;
    return this.e <= dateTime;
  }
  /**
   * Return whether this Interval contains the specified DateTime.
   * @param {DateTime} dateTime
   * @return {boolean}
   */
  contains(dateTime) {
    if (!this.isValid) return false;
    return this.s <= dateTime && this.e > dateTime;
  }
  /**
   * "Sets" the start and/or end dates. Returns a newly-constructed Interval.
   * @param {Object} values - the values to set
   * @param {DateTime} values.start - the starting DateTime
   * @param {DateTime} values.end - the ending DateTime
   * @return {Interval}
   */
  set({ start, end } = {}) {
    if (!this.isValid) return this;
    return Interval.fromDateTimes(start || this.s, end || this.e);
  }
  /**
   * Split this Interval at each of the specified DateTimes
   * @param {...DateTime} dateTimes - the unit of time to count.
   * @return {Array}
   */
  splitAt(...dateTimes) {
    if (!this.isValid) return [];
    const sorted = dateTimes.map(friendlyDateTime).filter((d) => this.contains(d)).sort((a, b) => a.toMillis() - b.toMillis()), results = [];
    let { s: s2 } = this, i = 0;
    while (s2 < this.e) {
      const added = sorted[i] || this.e, next = +added > +this.e ? this.e : added;
      results.push(Interval.fromDateTimes(s2, next));
      s2 = next;
      i += 1;
    }
    return results;
  }
  /**
   * Split this Interval into smaller Intervals, each of the specified length.
   * Left over time is grouped into a smaller interval
   * @param {Duration|Object|number} duration - The length of each resulting interval.
   * @return {Array}
   */
  splitBy(duration) {
    const dur = Duration.fromDurationLike(duration);
    if (!this.isValid || !dur.isValid || dur.as("milliseconds") === 0) {
      return [];
    }
    let { s: s2 } = this, idx = 1, next;
    const results = [];
    while (s2 < this.e) {
      const added = this.start.plus(dur.mapUnits((x2) => x2 * idx));
      next = +added > +this.e ? this.e : added;
      results.push(Interval.fromDateTimes(s2, next));
      s2 = next;
      idx += 1;
    }
    return results;
  }
  /**
   * Split this Interval into the specified number of smaller intervals.
   * @param {number} numberOfParts - The number of Intervals to divide the Interval into.
   * @return {Array}
   */
  divideEqually(numberOfParts) {
    if (!this.isValid) return [];
    return this.splitBy(this.length() / numberOfParts).slice(0, numberOfParts);
  }
  /**
   * Return whether this Interval overlaps with the specified Interval
   * @param {Interval} other
   * @return {boolean}
   */
  overlaps(other) {
    return this.e > other.s && this.s < other.e;
  }
  /**
   * Return whether this Interval's end is adjacent to the specified Interval's start.
   * @param {Interval} other
   * @return {boolean}
   */
  abutsStart(other) {
    if (!this.isValid) return false;
    return +this.e === +other.s;
  }
  /**
   * Return whether this Interval's start is adjacent to the specified Interval's end.
   * @param {Interval} other
   * @return {boolean}
   */
  abutsEnd(other) {
    if (!this.isValid) return false;
    return +other.e === +this.s;
  }
  /**
   * Return whether this Interval engulfs the start and end of the specified Interval.
   * @param {Interval} other
   * @return {boolean}
   */
  engulfs(other) {
    if (!this.isValid) return false;
    return this.s <= other.s && this.e >= other.e;
  }
  /**
   * Return whether this Interval has the same start and end as the specified Interval.
   * @param {Interval} other
   * @return {boolean}
   */
  equals(other) {
    if (!this.isValid || !other.isValid) {
      return false;
    }
    return this.s.equals(other.s) && this.e.equals(other.e);
  }
  /**
   * Return an Interval representing the intersection of this Interval and the specified Interval.
   * Specifically, the resulting Interval has the maximum start time and the minimum end time of the two Intervals.
   * Returns null if the intersection is empty, meaning, the intervals don't intersect.
   * @param {Interval} other
   * @return {Interval}
   */
  intersection(other) {
    if (!this.isValid) return this;
    const s2 = this.s > other.s ? this.s : other.s, e = this.e < other.e ? this.e : other.e;
    if (s2 >= e) {
      return null;
    } else {
      return Interval.fromDateTimes(s2, e);
    }
  }
  /**
   * Return an Interval representing the union of this Interval and the specified Interval.
   * Specifically, the resulting Interval has the minimum start time and the maximum end time of the two Intervals.
   * @param {Interval} other
   * @return {Interval}
   */
  union(other) {
    if (!this.isValid) return this;
    const s2 = this.s < other.s ? this.s : other.s, e = this.e > other.e ? this.e : other.e;
    return Interval.fromDateTimes(s2, e);
  }
  /**
   * Merge an array of Intervals into a equivalent minimal set of Intervals.
   * Combines overlapping and adjacent Intervals.
   * @param {Array} intervals
   * @return {Array}
   */
  static merge(intervals) {
    const [found, final] = intervals.sort((a, b) => a.s - b.s).reduce(
      ([sofar, current2], item) => {
        if (!current2) {
          return [sofar, item];
        } else if (current2.overlaps(item) || current2.abutsStart(item)) {
          return [sofar, current2.union(item)];
        } else {
          return [sofar.concat([current2]), item];
        }
      },
      [[], null]
    );
    if (final) {
      found.push(final);
    }
    return found;
  }
  /**
   * Return an array of Intervals representing the spans of time that only appear in one of the specified Intervals.
   * @param {Array} intervals
   * @return {Array}
   */
  static xor(intervals) {
    let start = null, currentCount = 0;
    const results = [], ends = intervals.map((i) => [
      { time: i.s, type: "s" },
      { time: i.e, type: "e" }
    ]), flattened = Array.prototype.concat(...ends), arr = flattened.sort((a, b) => a.time - b.time);
    for (const i of arr) {
      currentCount += i.type === "s" ? 1 : -1;
      if (currentCount === 1) {
        start = i.time;
      } else {
        if (start && +start !== +i.time) {
          results.push(Interval.fromDateTimes(start, i.time));
        }
        start = null;
      }
    }
    return Interval.merge(results);
  }
  /**
   * Return an Interval representing the span of time in this Interval that doesn't overlap with any of the specified Intervals.
   * @param {...Interval} intervals
   * @return {Array}
   */
  difference(...intervals) {
    return Interval.xor([this].concat(intervals)).map((i) => this.intersection(i)).filter((i) => i && !i.isEmpty());
  }
  /**
   * Returns a string representation of this Interval appropriate for debugging.
   * @return {string}
   */
  toString() {
    if (!this.isValid) return INVALID$1;
    return `[${this.s.toISO()} – ${this.e.toISO()})`;
  }
  /**
   * Returns a string representation of this Interval appropriate for the REPL.
   * @return {string}
   */
  [Symbol.for("nodejs.util.inspect.custom")]() {
    if (this.isValid) {
      return `Interval { start: ${this.s.toISO()}, end: ${this.e.toISO()} }`;
    } else {
      return `Interval { Invalid, reason: ${this.invalidReason} }`;
    }
  }
  /**
   * Returns a localized string representing this Interval. Accepts the same options as the
   * Intl.DateTimeFormat constructor and any presets defined by Luxon, such as
   * {@link DateTime.DATE_FULL} or {@link DateTime.TIME_SIMPLE}. The exact behavior of this method
   * is browser-specific, but in general it will return an appropriate representation of the
   * Interval in the assigned locale. Defaults to the system's locale if no locale has been
   * specified.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
   * @param {Object} [formatOpts=DateTime.DATE_SHORT] - Either a DateTime preset or
   * Intl.DateTimeFormat constructor options.
   * @param {Object} opts - Options to override the configuration of the start DateTime.
   * @example Interval.fromISO('2022-11-07T09:00Z/2022-11-08T09:00Z').toLocaleString(); //=> 11/7/2022 – 11/8/2022
   * @example Interval.fromISO('2022-11-07T09:00Z/2022-11-08T09:00Z').toLocaleString(DateTime.DATE_FULL); //=> November 7 – 8, 2022
   * @example Interval.fromISO('2022-11-07T09:00Z/2022-11-08T09:00Z').toLocaleString(DateTime.DATE_FULL, { locale: 'fr-FR' }); //=> 7–8 novembre 2022
   * @example Interval.fromISO('2022-11-07T17:00Z/2022-11-07T19:00Z').toLocaleString(DateTime.TIME_SIMPLE); //=> 6:00 – 8:00 PM
   * @example Interval.fromISO('2022-11-07T17:00Z/2022-11-07T19:00Z').toLocaleString({ weekday: 'short', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }); //=> Mon, Nov 07, 6:00 – 8:00 p
   * @return {string}
   */
  toLocaleString(formatOpts = DATE_SHORT, opts = {}) {
    return this.isValid ? Formatter.create(this.s.loc.clone(opts), formatOpts).formatInterval(this) : INVALID$1;
  }
  /**
   * Returns an ISO 8601-compliant string representation of this Interval.
   * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
   * @param {Object} opts - The same options as {@link DateTime#toISO}
   * @return {string}
   */
  toISO(opts) {
    if (!this.isValid) return INVALID$1;
    return `${this.s.toISO(opts)}/${this.e.toISO(opts)}`;
  }
  /**
   * Returns an ISO 8601-compliant string representation of date of this Interval.
   * The time components are ignored.
   * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
   * @return {string}
   */
  toISODate() {
    if (!this.isValid) return INVALID$1;
    return `${this.s.toISODate()}/${this.e.toISODate()}`;
  }
  /**
   * Returns an ISO 8601-compliant string representation of time of this Interval.
   * The date components are ignored.
   * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
   * @param {Object} opts - The same options as {@link DateTime#toISO}
   * @return {string}
   */
  toISOTime(opts) {
    if (!this.isValid) return INVALID$1;
    return `${this.s.toISOTime(opts)}/${this.e.toISOTime(opts)}`;
  }
  /**
   * Returns a string representation of this Interval formatted according to the specified format
   * string. **You may not want this.** See {@link Interval#toLocaleString} for a more flexible
   * formatting tool.
   * @param {string} dateFormat - The format string. This string formats the start and end time.
   * See {@link DateTime#toFormat} for details.
   * @param {Object} opts - Options.
   * @param {string} [opts.separator =  ' – '] - A separator to place between the start and end
   * representations.
   * @return {string}
   */
  toFormat(dateFormat, { separator = " – " } = {}) {
    if (!this.isValid) return INVALID$1;
    return `${this.s.toFormat(dateFormat)}${separator}${this.e.toFormat(dateFormat)}`;
  }
  /**
   * Return a Duration representing the time spanned by this interval.
   * @param {string|string[]} [unit=['milliseconds']] - the unit or units (such as 'hours' or 'days') to include in the duration.
   * @param {Object} opts - options that affect the creation of the Duration
   * @param {string} [opts.conversionAccuracy='casual'] - the conversion system to use
   * @example Interval.fromDateTimes(dt1, dt2).toDuration().toObject() //=> { milliseconds: 88489257 }
   * @example Interval.fromDateTimes(dt1, dt2).toDuration('days').toObject() //=> { days: 1.0241812152777778 }
   * @example Interval.fromDateTimes(dt1, dt2).toDuration(['hours', 'minutes']).toObject() //=> { hours: 24, minutes: 34.82095 }
   * @example Interval.fromDateTimes(dt1, dt2).toDuration(['hours', 'minutes', 'seconds']).toObject() //=> { hours: 24, minutes: 34, seconds: 49.257 }
   * @example Interval.fromDateTimes(dt1, dt2).toDuration('seconds').toObject() //=> { seconds: 88489.257 }
   * @return {Duration}
   */
  toDuration(unit, opts) {
    if (!this.isValid) {
      return Duration.invalid(this.invalidReason);
    }
    return this.e.diff(this.s, unit, opts);
  }
  /**
   * Run mapFn on the interval start and end, returning a new Interval from the resulting DateTimes
   * @param {function} mapFn
   * @return {Interval}
   * @example Interval.fromDateTimes(dt1, dt2).mapEndpoints(endpoint => endpoint.toUTC())
   * @example Interval.fromDateTimes(dt1, dt2).mapEndpoints(endpoint => endpoint.plus({ hours: 2 }))
   */
  mapEndpoints(mapFn) {
    return Interval.fromDateTimes(mapFn(this.s), mapFn(this.e));
  }
}
class Info {
  /**
   * Return whether the specified zone contains a DST.
   * @param {string|Zone} [zone='local'] - Zone to check. Defaults to the environment's local zone.
   * @return {boolean}
   */
  static hasDST(zone = Settings.defaultZone) {
    const proto = DateTime.now().setZone(zone).set({ month: 12 });
    return !zone.isUniversal && proto.offset !== proto.set({ month: 6 }).offset;
  }
  /**
   * Return whether the specified zone is a valid IANA specifier.
   * @param {string} zone - Zone to check
   * @return {boolean}
   */
  static isValidIANAZone(zone) {
    return IANAZone.isValidZone(zone);
  }
  /**
   * Converts the input into a {@link Zone} instance.
   *
   * * If `input` is already a Zone instance, it is returned unchanged.
   * * If `input` is a string containing a valid time zone name, a Zone instance
   *   with that name is returned.
   * * If `input` is a string that doesn't refer to a known time zone, a Zone
   *   instance with {@link Zone#isValid} == false is returned.
   * * If `input is a number, a Zone instance with the specified fixed offset
   *   in minutes is returned.
   * * If `input` is `null` or `undefined`, the default zone is returned.
   * @param {string|Zone|number} [input] - the value to be converted
   * @return {Zone}
   */
  static normalizeZone(input2) {
    return normalizeZone(input2, Settings.defaultZone);
  }
  /**
   * Get the weekday on which the week starts according to the given locale.
   * @param {Object} opts - options
   * @param {string} [opts.locale] - the locale code
   * @param {string} [opts.locObj=null] - an existing locale object to use
   * @returns {number} the start of the week, 1 for Monday through 7 for Sunday
   */
  static getStartOfWeek({ locale = null, locObj = null } = {}) {
    return (locObj || Locale.create(locale)).getStartOfWeek();
  }
  /**
   * Get the minimum number of days necessary in a week before it is considered part of the next year according
   * to the given locale.
   * @param {Object} opts - options
   * @param {string} [opts.locale] - the locale code
   * @param {string} [opts.locObj=null] - an existing locale object to use
   * @returns {number}
   */
  static getMinimumDaysInFirstWeek({ locale = null, locObj = null } = {}) {
    return (locObj || Locale.create(locale)).getMinDaysInFirstWeek();
  }
  /**
   * Get the weekdays, which are considered the weekend according to the given locale
   * @param {Object} opts - options
   * @param {string} [opts.locale] - the locale code
   * @param {string} [opts.locObj=null] - an existing locale object to use
   * @returns {number[]} an array of weekdays, 1 for Monday through 7 for Sunday
   */
  static getWeekendWeekdays({ locale = null, locObj = null } = {}) {
    return (locObj || Locale.create(locale)).getWeekendDays().slice();
  }
  /**
   * Return an array of standalone month names.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
   * @param {string} [length='long'] - the length of the month representation, such as "numeric", "2-digit", "narrow", "short", "long"
   * @param {Object} opts - options
   * @param {string} [opts.locale] - the locale code
   * @param {string} [opts.numberingSystem=null] - the numbering system
   * @param {string} [opts.locObj=null] - an existing locale object to use
   * @param {string} [opts.outputCalendar='gregory'] - the calendar
   * @example Info.months()[0] //=> 'January'
   * @example Info.months('short')[0] //=> 'Jan'
   * @example Info.months('numeric')[0] //=> '1'
   * @example Info.months('short', { locale: 'fr-CA' } )[0] //=> 'janv.'
   * @example Info.months('numeric', { locale: 'ar' })[0] //=> '١'
   * @example Info.months('long', { outputCalendar: 'islamic' })[0] //=> 'Rabiʻ I'
   * @return {Array}
   */
  static months(length = "long", { locale = null, numberingSystem = null, locObj = null, outputCalendar = "gregory" } = {}) {
    return (locObj || Locale.create(locale, numberingSystem, outputCalendar)).months(length);
  }
  /**
   * Return an array of format month names.
   * Format months differ from standalone months in that they're meant to appear next to the day of the month. In some languages, that
   * changes the string.
   * See {@link Info#months}
   * @param {string} [length='long'] - the length of the month representation, such as "numeric", "2-digit", "narrow", "short", "long"
   * @param {Object} opts - options
   * @param {string} [opts.locale] - the locale code
   * @param {string} [opts.numberingSystem=null] - the numbering system
   * @param {string} [opts.locObj=null] - an existing locale object to use
   * @param {string} [opts.outputCalendar='gregory'] - the calendar
   * @return {Array}
   */
  static monthsFormat(length = "long", { locale = null, numberingSystem = null, locObj = null, outputCalendar = "gregory" } = {}) {
    return (locObj || Locale.create(locale, numberingSystem, outputCalendar)).months(length, true);
  }
  /**
   * Return an array of standalone week names.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
   * @param {string} [length='long'] - the length of the weekday representation, such as "narrow", "short", "long".
   * @param {Object} opts - options
   * @param {string} [opts.locale] - the locale code
   * @param {string} [opts.numberingSystem=null] - the numbering system
   * @param {string} [opts.locObj=null] - an existing locale object to use
   * @example Info.weekdays()[0] //=> 'Monday'
   * @example Info.weekdays('short')[0] //=> 'Mon'
   * @example Info.weekdays('short', { locale: 'fr-CA' })[0] //=> 'lun.'
   * @example Info.weekdays('short', { locale: 'ar' })[0] //=> 'الاثنين'
   * @return {Array}
   */
  static weekdays(length = "long", { locale = null, numberingSystem = null, locObj = null } = {}) {
    return (locObj || Locale.create(locale, numberingSystem, null)).weekdays(length);
  }
  /**
   * Return an array of format week names.
   * Format weekdays differ from standalone weekdays in that they're meant to appear next to more date information. In some languages, that
   * changes the string.
   * See {@link Info#weekdays}
   * @param {string} [length='long'] - the length of the month representation, such as "narrow", "short", "long".
   * @param {Object} opts - options
   * @param {string} [opts.locale=null] - the locale code
   * @param {string} [opts.numberingSystem=null] - the numbering system
   * @param {string} [opts.locObj=null] - an existing locale object to use
   * @return {Array}
   */
  static weekdaysFormat(length = "long", { locale = null, numberingSystem = null, locObj = null } = {}) {
    return (locObj || Locale.create(locale, numberingSystem, null)).weekdays(length, true);
  }
  /**
   * Return an array of meridiems.
   * @param {Object} opts - options
   * @param {string} [opts.locale] - the locale code
   * @example Info.meridiems() //=> [ 'AM', 'PM' ]
   * @example Info.meridiems({ locale: 'my' }) //=> [ 'နံနက်', 'ညနေ' ]
   * @return {Array}
   */
  static meridiems({ locale = null } = {}) {
    return Locale.create(locale).meridiems();
  }
  /**
   * Return an array of eras, such as ['BC', 'AD']. The locale can be specified, but the calendar system is always Gregorian.
   * @param {string} [length='short'] - the length of the era representation, such as "short" or "long".
   * @param {Object} opts - options
   * @param {string} [opts.locale] - the locale code
   * @example Info.eras() //=> [ 'BC', 'AD' ]
   * @example Info.eras('long') //=> [ 'Before Christ', 'Anno Domini' ]
   * @example Info.eras('long', { locale: 'fr' }) //=> [ 'avant Jésus-Christ', 'après Jésus-Christ' ]
   * @return {Array}
   */
  static eras(length = "short", { locale = null } = {}) {
    return Locale.create(locale, null, "gregory").eras(length);
  }
  /**
   * Return the set of available features in this environment.
   * Some features of Luxon are not available in all environments. For example, on older browsers, relative time formatting support is not available. Use this function to figure out if that's the case.
   * Keys:
   * * `relative`: whether this environment supports relative time formatting
   * * `localeWeek`: whether this environment supports different weekdays for the start of the week based on the locale
   * @example Info.features() //=> { relative: false, localeWeek: true }
   * @return {Object}
   */
  static features() {
    return { relative: hasRelative(), localeWeek: hasLocaleWeekInfo() };
  }
}
function dayDiff(earlier, later) {
  const utcDayStart = (dt) => dt.toUTC(0, { keepLocalTime: true }).startOf("day").valueOf(), ms = utcDayStart(later) - utcDayStart(earlier);
  return Math.floor(Duration.fromMillis(ms).as("days"));
}
function highOrderDiffs(cursor, later, units) {
  const differs = [
    ["years", (a, b) => b.year - a.year],
    ["quarters", (a, b) => b.quarter - a.quarter + (b.year - a.year) * 4],
    ["months", (a, b) => b.month - a.month + (b.year - a.year) * 12],
    [
      "weeks",
      (a, b) => {
        const days = dayDiff(a, b);
        return (days - days % 7) / 7;
      }
    ],
    ["days", dayDiff]
  ];
  const results = {};
  const earlier = cursor;
  let lowestOrder, highWater;
  for (const [unit, differ] of differs) {
    if (units.indexOf(unit) >= 0) {
      lowestOrder = unit;
      results[unit] = differ(cursor, later);
      highWater = earlier.plus(results);
      if (highWater > later) {
        results[unit]--;
        cursor = earlier.plus(results);
        if (cursor > later) {
          highWater = cursor;
          results[unit]--;
          cursor = earlier.plus(results);
        }
      } else {
        cursor = highWater;
      }
    }
  }
  return [cursor, results, highWater, lowestOrder];
}
function diff(earlier, later, units, opts) {
  let [cursor, results, highWater, lowestOrder] = highOrderDiffs(earlier, later, units);
  const remainingMillis = later - cursor;
  const lowerOrderUnits = units.filter(
    (u2) => ["hours", "minutes", "seconds", "milliseconds"].indexOf(u2) >= 0
  );
  if (lowerOrderUnits.length === 0) {
    if (highWater < later) {
      highWater = cursor.plus({ [lowestOrder]: 1 });
    }
    if (highWater !== cursor) {
      results[lowestOrder] = (results[lowestOrder] || 0) + remainingMillis / (highWater - cursor);
    }
  }
  const duration = Duration.fromObject(results, opts);
  if (lowerOrderUnits.length > 0) {
    return Duration.fromMillis(remainingMillis, opts).shiftTo(...lowerOrderUnits).plus(duration);
  } else {
    return duration;
  }
}
const numberingSystems = {
  arab: "[٠-٩]",
  arabext: "[۰-۹]",
  bali: "[᭐-᭙]",
  beng: "[০-৯]",
  deva: "[०-९]",
  fullwide: "[０-９]",
  gujr: "[૦-૯]",
  hanidec: "[〇|一|二|三|四|五|六|七|八|九]",
  khmr: "[០-៩]",
  knda: "[೦-೯]",
  laoo: "[໐-໙]",
  limb: "[᥆-᥏]",
  mlym: "[൦-൯]",
  mong: "[᠐-᠙]",
  mymr: "[၀-၉]",
  orya: "[୦-୯]",
  tamldec: "[௦-௯]",
  telu: "[౦-౯]",
  thai: "[๐-๙]",
  tibt: "[༠-༩]",
  latn: "\\d"
};
const numberingSystemsUTF16 = {
  arab: [1632, 1641],
  arabext: [1776, 1785],
  bali: [6992, 7001],
  beng: [2534, 2543],
  deva: [2406, 2415],
  fullwide: [65296, 65303],
  gujr: [2790, 2799],
  khmr: [6112, 6121],
  knda: [3302, 3311],
  laoo: [3792, 3801],
  limb: [6470, 6479],
  mlym: [3430, 3439],
  mong: [6160, 6169],
  mymr: [4160, 4169],
  orya: [2918, 2927],
  tamldec: [3046, 3055],
  telu: [3174, 3183],
  thai: [3664, 3673],
  tibt: [3872, 3881]
};
const hanidecChars = numberingSystems.hanidec.replace(/[\[|\]]/g, "").split("");
function parseDigits(str) {
  let value = parseInt(str, 10);
  if (isNaN(value)) {
    value = "";
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      if (str[i].search(numberingSystems.hanidec) !== -1) {
        value += hanidecChars.indexOf(str[i]);
      } else {
        for (const key in numberingSystemsUTF16) {
          const [min, max] = numberingSystemsUTF16[key];
          if (code >= min && code <= max) {
            value += code - min;
          }
        }
      }
    }
    return parseInt(value, 10);
  } else {
    return value;
  }
}
function digitRegex({ numberingSystem }, append = "") {
  return new RegExp(`${numberingSystems[numberingSystem || "latn"]}${append}`);
}
const MISSING_FTP = "missing Intl.DateTimeFormat.formatToParts support";
function intUnit(regex, post = (i) => i) {
  return { regex, deser: ([s2]) => post(parseDigits(s2)) };
}
const NBSP = String.fromCharCode(160);
const spaceOrNBSP = `[ ${NBSP}]`;
const spaceOrNBSPRegExp = new RegExp(spaceOrNBSP, "g");
function fixListRegex(s2) {
  return s2.replace(/\./g, "\\.?").replace(spaceOrNBSPRegExp, spaceOrNBSP);
}
function stripInsensitivities(s2) {
  return s2.replace(/\./g, "").replace(spaceOrNBSPRegExp, " ").toLowerCase();
}
function oneOf(strings, startIndex) {
  if (strings === null) {
    return null;
  } else {
    return {
      regex: RegExp(strings.map(fixListRegex).join("|")),
      deser: ([s2]) => strings.findIndex((i) => stripInsensitivities(s2) === stripInsensitivities(i)) + startIndex
    };
  }
}
function offset(regex, groups) {
  return { regex, deser: ([, h, m2]) => signedOffset(h, m2), groups };
}
function simple(regex) {
  return { regex, deser: ([s2]) => s2 };
}
function escapeToken(value) {
  return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
}
function unitForToken(token, loc) {
  const one = digitRegex(loc), two = digitRegex(loc, "{2}"), three = digitRegex(loc, "{3}"), four = digitRegex(loc, "{4}"), six = digitRegex(loc, "{6}"), oneOrTwo = digitRegex(loc, "{1,2}"), oneToThree = digitRegex(loc, "{1,3}"), oneToSix = digitRegex(loc, "{1,6}"), oneToNine = digitRegex(loc, "{1,9}"), twoToFour = digitRegex(loc, "{2,4}"), fourToSix = digitRegex(loc, "{4,6}"), literal = (t2) => ({ regex: RegExp(escapeToken(t2.val)), deser: ([s2]) => s2, literal: true }), unitate = (t2) => {
    if (token.literal) {
      return literal(t2);
    }
    switch (t2.val) {
      case "G":
        return oneOf(loc.eras("short"), 0);
      case "GG":
        return oneOf(loc.eras("long"), 0);
      case "y":
        return intUnit(oneToSix);
      case "yy":
        return intUnit(twoToFour, untruncateYear);
      case "yyyy":
        return intUnit(four);
      case "yyyyy":
        return intUnit(fourToSix);
      case "yyyyyy":
        return intUnit(six);
      case "M":
        return intUnit(oneOrTwo);
      case "MM":
        return intUnit(two);
      case "MMM":
        return oneOf(loc.months("short", true), 1);
      case "MMMM":
        return oneOf(loc.months("long", true), 1);
      case "L":
        return intUnit(oneOrTwo);
      case "LL":
        return intUnit(two);
      case "LLL":
        return oneOf(loc.months("short", false), 1);
      case "LLLL":
        return oneOf(loc.months("long", false), 1);
      case "d":
        return intUnit(oneOrTwo);
      case "dd":
        return intUnit(two);
      case "o":
        return intUnit(oneToThree);
      case "ooo":
        return intUnit(three);
      case "HH":
        return intUnit(two);
      case "H":
        return intUnit(oneOrTwo);
      case "hh":
        return intUnit(two);
      case "h":
        return intUnit(oneOrTwo);
      case "mm":
        return intUnit(two);
      case "m":
        return intUnit(oneOrTwo);
      case "q":
        return intUnit(oneOrTwo);
      case "qq":
        return intUnit(two);
      case "s":
        return intUnit(oneOrTwo);
      case "ss":
        return intUnit(two);
      case "S":
        return intUnit(oneToThree);
      case "SSS":
        return intUnit(three);
      case "u":
        return simple(oneToNine);
      case "uu":
        return simple(oneOrTwo);
      case "uuu":
        return intUnit(one);
      case "a":
        return oneOf(loc.meridiems(), 0);
      case "kkkk":
        return intUnit(four);
      case "kk":
        return intUnit(twoToFour, untruncateYear);
      case "W":
        return intUnit(oneOrTwo);
      case "WW":
        return intUnit(two);
      case "E":
      case "c":
        return intUnit(one);
      case "EEE":
        return oneOf(loc.weekdays("short", false), 1);
      case "EEEE":
        return oneOf(loc.weekdays("long", false), 1);
      case "ccc":
        return oneOf(loc.weekdays("short", true), 1);
      case "cccc":
        return oneOf(loc.weekdays("long", true), 1);
      case "Z":
      case "ZZ":
        return offset(new RegExp(`([+-]${oneOrTwo.source})(?::(${two.source}))?`), 2);
      case "ZZZ":
        return offset(new RegExp(`([+-]${oneOrTwo.source})(${two.source})?`), 2);
      case "z":
        return simple(/[a-z_+-/]{1,256}?/i);
      case " ":
        return simple(/[^\S\n\r]/);
      default:
        return literal(t2);
    }
  };
  const unit = unitate(token) || {
    invalidReason: MISSING_FTP
  };
  unit.token = token;
  return unit;
}
const partTypeStyleToTokenVal = {
  year: {
    "2-digit": "yy",
    numeric: "yyyyy"
  },
  month: {
    numeric: "M",
    "2-digit": "MM",
    short: "MMM",
    long: "MMMM"
  },
  day: {
    numeric: "d",
    "2-digit": "dd"
  },
  weekday: {
    short: "EEE",
    long: "EEEE"
  },
  dayperiod: "a",
  dayPeriod: "a",
  hour12: {
    numeric: "h",
    "2-digit": "hh"
  },
  hour24: {
    numeric: "H",
    "2-digit": "HH"
  },
  minute: {
    numeric: "m",
    "2-digit": "mm"
  },
  second: {
    numeric: "s",
    "2-digit": "ss"
  },
  timeZoneName: {
    long: "ZZZZZ",
    short: "ZZZ"
  }
};
function tokenForPart(part, formatOpts, resolvedOpts) {
  const { type, value } = part;
  if (type === "literal") {
    const isSpace = /^\s+$/.test(value);
    return {
      literal: !isSpace,
      val: isSpace ? " " : value
    };
  }
  const style = formatOpts[type];
  let actualType = type;
  if (type === "hour") {
    if (formatOpts.hour12 != null) {
      actualType = formatOpts.hour12 ? "hour12" : "hour24";
    } else if (formatOpts.hourCycle != null) {
      if (formatOpts.hourCycle === "h11" || formatOpts.hourCycle === "h12") {
        actualType = "hour12";
      } else {
        actualType = "hour24";
      }
    } else {
      actualType = resolvedOpts.hour12 ? "hour12" : "hour24";
    }
  }
  let val = partTypeStyleToTokenVal[actualType];
  if (typeof val === "object") {
    val = val[style];
  }
  if (val) {
    return {
      literal: false,
      val
    };
  }
  return void 0;
}
function buildRegex(units) {
  const re2 = units.map((u2) => u2.regex).reduce((f2, r2) => `${f2}(${r2.source})`, "");
  return [`^${re2}$`, units];
}
function match(input2, regex, handlers) {
  const matches2 = input2.match(regex);
  if (matches2) {
    const all = {};
    let matchIndex = 1;
    for (const i in handlers) {
      if (hasOwnProperty(handlers, i)) {
        const h = handlers[i], groups = h.groups ? h.groups + 1 : 1;
        if (!h.literal && h.token) {
          all[h.token.val[0]] = h.deser(matches2.slice(matchIndex, matchIndex + groups));
        }
        matchIndex += groups;
      }
    }
    return [matches2, all];
  } else {
    return [matches2, {}];
  }
}
function dateTimeFromMatches(matches2) {
  const toField = (token) => {
    switch (token) {
      case "S":
        return "millisecond";
      case "s":
        return "second";
      case "m":
        return "minute";
      case "h":
      case "H":
        return "hour";
      case "d":
        return "day";
      case "o":
        return "ordinal";
      case "L":
      case "M":
        return "month";
      case "y":
        return "year";
      case "E":
      case "c":
        return "weekday";
      case "W":
        return "weekNumber";
      case "k":
        return "weekYear";
      case "q":
        return "quarter";
      default:
        return null;
    }
  };
  let zone = null;
  let specificOffset;
  if (!isUndefined(matches2.z)) {
    zone = IANAZone.create(matches2.z);
  }
  if (!isUndefined(matches2.Z)) {
    if (!zone) {
      zone = new FixedOffsetZone(matches2.Z);
    }
    specificOffset = matches2.Z;
  }
  if (!isUndefined(matches2.q)) {
    matches2.M = (matches2.q - 1) * 3 + 1;
  }
  if (!isUndefined(matches2.h)) {
    if (matches2.h < 12 && matches2.a === 1) {
      matches2.h += 12;
    } else if (matches2.h === 12 && matches2.a === 0) {
      matches2.h = 0;
    }
  }
  if (matches2.G === 0 && matches2.y) {
    matches2.y = -matches2.y;
  }
  if (!isUndefined(matches2.u)) {
    matches2.S = parseMillis(matches2.u);
  }
  const vals = Object.keys(matches2).reduce((r2, k2) => {
    const f2 = toField(k2);
    if (f2) {
      r2[f2] = matches2[k2];
    }
    return r2;
  }, {});
  return [vals, zone, specificOffset];
}
let dummyDateTimeCache = null;
function getDummyDateTime() {
  if (!dummyDateTimeCache) {
    dummyDateTimeCache = DateTime.fromMillis(1555555555555);
  }
  return dummyDateTimeCache;
}
function maybeExpandMacroToken(token, locale) {
  if (token.literal) {
    return token;
  }
  const formatOpts = Formatter.macroTokenToFormatOpts(token.val);
  const tokens = formatOptsToTokens(formatOpts, locale);
  if (tokens == null || tokens.includes(void 0)) {
    return token;
  }
  return tokens;
}
function expandMacroTokens(tokens, locale) {
  return Array.prototype.concat(...tokens.map((t2) => maybeExpandMacroToken(t2, locale)));
}
function explainFromTokens(locale, input2, format) {
  const tokens = expandMacroTokens(Formatter.parseFormat(format), locale), units = tokens.map((t2) => unitForToken(t2, locale)), disqualifyingUnit = units.find((t2) => t2.invalidReason);
  if (disqualifyingUnit) {
    return { input: input2, tokens, invalidReason: disqualifyingUnit.invalidReason };
  } else {
    const [regexString, handlers] = buildRegex(units), regex = RegExp(regexString, "i"), [rawMatches, matches2] = match(input2, regex, handlers), [result, zone, specificOffset] = matches2 ? dateTimeFromMatches(matches2) : [null, null, void 0];
    if (hasOwnProperty(matches2, "a") && hasOwnProperty(matches2, "H")) {
      throw new ConflictingSpecificationError(
        "Can't include meridiem when specifying 24-hour format"
      );
    }
    return { input: input2, tokens, regex, rawMatches, matches: matches2, result, zone, specificOffset };
  }
}
function parseFromTokens(locale, input2, format) {
  const { result, zone, specificOffset, invalidReason } = explainFromTokens(locale, input2, format);
  return [result, zone, specificOffset, invalidReason];
}
function formatOptsToTokens(formatOpts, locale) {
  if (!formatOpts) {
    return null;
  }
  const formatter = Formatter.create(locale, formatOpts);
  const df2 = formatter.dtFormatter(getDummyDateTime());
  const parts = df2.formatToParts();
  const resolvedOpts = df2.resolvedOptions();
  return parts.map((p2) => tokenForPart(p2, formatOpts, resolvedOpts));
}
const INVALID = "Invalid DateTime";
const MAX_DATE = 864e13;
function unsupportedZone(zone) {
  return new Invalid("unsupported zone", `the zone "${zone.name}" is not supported`);
}
function possiblyCachedWeekData(dt) {
  if (dt.weekData === null) {
    dt.weekData = gregorianToWeek(dt.c);
  }
  return dt.weekData;
}
function possiblyCachedLocalWeekData(dt) {
  if (dt.localWeekData === null) {
    dt.localWeekData = gregorianToWeek(
      dt.c,
      dt.loc.getMinDaysInFirstWeek(),
      dt.loc.getStartOfWeek()
    );
  }
  return dt.localWeekData;
}
function clone(inst, alts) {
  const current2 = {
    ts: inst.ts,
    zone: inst.zone,
    c: inst.c,
    o: inst.o,
    loc: inst.loc,
    invalid: inst.invalid
  };
  return new DateTime({ ...current2, ...alts, old: current2 });
}
function fixOffset(localTS, o, tz) {
  let utcGuess = localTS - o * 60 * 1e3;
  const o2 = tz.offset(utcGuess);
  if (o === o2) {
    return [utcGuess, o];
  }
  utcGuess -= (o2 - o) * 60 * 1e3;
  const o3 = tz.offset(utcGuess);
  if (o2 === o3) {
    return [utcGuess, o2];
  }
  return [localTS - Math.min(o2, o3) * 60 * 1e3, Math.max(o2, o3)];
}
function tsToObj(ts, offset2) {
  ts += offset2 * 60 * 1e3;
  const d = new Date(ts);
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
    hour: d.getUTCHours(),
    minute: d.getUTCMinutes(),
    second: d.getUTCSeconds(),
    millisecond: d.getUTCMilliseconds()
  };
}
function objToTS(obj, offset2, zone) {
  return fixOffset(objToLocalTS(obj), offset2, zone);
}
function adjustTime(inst, dur) {
  const oPre = inst.o, year = inst.c.year + Math.trunc(dur.years), month = inst.c.month + Math.trunc(dur.months) + Math.trunc(dur.quarters) * 3, c = {
    ...inst.c,
    year,
    month,
    day: Math.min(inst.c.day, daysInMonth(year, month)) + Math.trunc(dur.days) + Math.trunc(dur.weeks) * 7
  }, millisToAdd = Duration.fromObject({
    years: dur.years - Math.trunc(dur.years),
    quarters: dur.quarters - Math.trunc(dur.quarters),
    months: dur.months - Math.trunc(dur.months),
    weeks: dur.weeks - Math.trunc(dur.weeks),
    days: dur.days - Math.trunc(dur.days),
    hours: dur.hours,
    minutes: dur.minutes,
    seconds: dur.seconds,
    milliseconds: dur.milliseconds
  }).as("milliseconds"), localTS = objToLocalTS(c);
  let [ts, o] = fixOffset(localTS, oPre, inst.zone);
  if (millisToAdd !== 0) {
    ts += millisToAdd;
    o = inst.zone.offset(ts);
  }
  return { ts, o };
}
function parseDataToDateTime(parsed, parsedZone, opts, format, text, specificOffset) {
  const { setZone, zone } = opts;
  if (parsed && Object.keys(parsed).length !== 0 || parsedZone) {
    const interpretationZone = parsedZone || zone, inst = DateTime.fromObject(parsed, {
      ...opts,
      zone: interpretationZone,
      specificOffset
    });
    return setZone ? inst : inst.setZone(zone);
  } else {
    return DateTime.invalid(
      new Invalid("unparsable", `the input "${text}" can't be parsed as ${format}`)
    );
  }
}
function toTechFormat(dt, format, allowZ = true) {
  return dt.isValid ? Formatter.create(Locale.create("en-US"), {
    allowZ,
    forceSimple: true
  }).formatDateTimeFromString(dt, format) : null;
}
function toISODate(o, extended) {
  const longFormat = o.c.year > 9999 || o.c.year < 0;
  let c = "";
  if (longFormat && o.c.year >= 0) c += "+";
  c += padStart(o.c.year, longFormat ? 6 : 4);
  if (extended) {
    c += "-";
    c += padStart(o.c.month);
    c += "-";
    c += padStart(o.c.day);
  } else {
    c += padStart(o.c.month);
    c += padStart(o.c.day);
  }
  return c;
}
function toISOTime(o, extended, suppressSeconds, suppressMilliseconds, includeOffset, extendedZone) {
  let c = padStart(o.c.hour);
  if (extended) {
    c += ":";
    c += padStart(o.c.minute);
    if (o.c.millisecond !== 0 || o.c.second !== 0 || !suppressSeconds) {
      c += ":";
    }
  } else {
    c += padStart(o.c.minute);
  }
  if (o.c.millisecond !== 0 || o.c.second !== 0 || !suppressSeconds) {
    c += padStart(o.c.second);
    if (o.c.millisecond !== 0 || !suppressMilliseconds) {
      c += ".";
      c += padStart(o.c.millisecond, 3);
    }
  }
  if (includeOffset) {
    if (o.isOffsetFixed && o.offset === 0 && !extendedZone) {
      c += "Z";
    } else if (o.o < 0) {
      c += "-";
      c += padStart(Math.trunc(-o.o / 60));
      c += ":";
      c += padStart(Math.trunc(-o.o % 60));
    } else {
      c += "+";
      c += padStart(Math.trunc(o.o / 60));
      c += ":";
      c += padStart(Math.trunc(o.o % 60));
    }
  }
  if (extendedZone) {
    c += "[" + o.zone.ianaName + "]";
  }
  return c;
}
const defaultUnitValues = {
  month: 1,
  day: 1,
  hour: 0,
  minute: 0,
  second: 0,
  millisecond: 0
}, defaultWeekUnitValues = {
  weekNumber: 1,
  weekday: 1,
  hour: 0,
  minute: 0,
  second: 0,
  millisecond: 0
}, defaultOrdinalUnitValues = {
  ordinal: 1,
  hour: 0,
  minute: 0,
  second: 0,
  millisecond: 0
};
const orderedUnits = ["year", "month", "day", "hour", "minute", "second", "millisecond"], orderedWeekUnits = [
  "weekYear",
  "weekNumber",
  "weekday",
  "hour",
  "minute",
  "second",
  "millisecond"
], orderedOrdinalUnits = ["year", "ordinal", "hour", "minute", "second", "millisecond"];
function normalizeUnit(unit) {
  const normalized = {
    year: "year",
    years: "year",
    month: "month",
    months: "month",
    day: "day",
    days: "day",
    hour: "hour",
    hours: "hour",
    minute: "minute",
    minutes: "minute",
    quarter: "quarter",
    quarters: "quarter",
    second: "second",
    seconds: "second",
    millisecond: "millisecond",
    milliseconds: "millisecond",
    weekday: "weekday",
    weekdays: "weekday",
    weeknumber: "weekNumber",
    weeksnumber: "weekNumber",
    weeknumbers: "weekNumber",
    weekyear: "weekYear",
    weekyears: "weekYear",
    ordinal: "ordinal"
  }[unit.toLowerCase()];
  if (!normalized) throw new InvalidUnitError(unit);
  return normalized;
}
function normalizeUnitWithLocalWeeks(unit) {
  switch (unit.toLowerCase()) {
    case "localweekday":
    case "localweekdays":
      return "localWeekday";
    case "localweeknumber":
    case "localweeknumbers":
      return "localWeekNumber";
    case "localweekyear":
    case "localweekyears":
      return "localWeekYear";
    default:
      return normalizeUnit(unit);
  }
}
function quickDT(obj, opts) {
  const zone = normalizeZone(opts.zone, Settings.defaultZone), loc = Locale.fromObject(opts), tsNow = Settings.now();
  let ts, o;
  if (!isUndefined(obj.year)) {
    for (const u2 of orderedUnits) {
      if (isUndefined(obj[u2])) {
        obj[u2] = defaultUnitValues[u2];
      }
    }
    const invalid = hasInvalidGregorianData(obj) || hasInvalidTimeData(obj);
    if (invalid) {
      return DateTime.invalid(invalid);
    }
    const offsetProvis = zone.offset(tsNow);
    [ts, o] = objToTS(obj, offsetProvis, zone);
  } else {
    ts = tsNow;
  }
  return new DateTime({ ts, zone, loc, o });
}
function diffRelative(start, end, opts) {
  const round2 = isUndefined(opts.round) ? true : opts.round, format = (c, unit) => {
    c = roundTo(c, round2 || opts.calendary ? 0 : 2, true);
    const formatter = end.loc.clone(opts).relFormatter(opts);
    return formatter.format(c, unit);
  }, differ = (unit) => {
    if (opts.calendary) {
      if (!end.hasSame(start, unit)) {
        return end.startOf(unit).diff(start.startOf(unit), unit).get(unit);
      } else return 0;
    } else {
      return end.diff(start, unit).get(unit);
    }
  };
  if (opts.unit) {
    return format(differ(opts.unit), opts.unit);
  }
  for (const unit of opts.units) {
    const count = differ(unit);
    if (Math.abs(count) >= 1) {
      return format(count, unit);
    }
  }
  return format(start > end ? -0 : 0, opts.units[opts.units.length - 1]);
}
function lastOpts(argList) {
  let opts = {}, args;
  if (argList.length > 0 && typeof argList[argList.length - 1] === "object") {
    opts = argList[argList.length - 1];
    args = Array.from(argList).slice(0, argList.length - 1);
  } else {
    args = Array.from(argList);
  }
  return [opts, args];
}
class DateTime {
  /**
   * @access private
   */
  constructor(config2) {
    const zone = config2.zone || Settings.defaultZone;
    let invalid = config2.invalid || (Number.isNaN(config2.ts) ? new Invalid("invalid input") : null) || (!zone.isValid ? unsupportedZone(zone) : null);
    this.ts = isUndefined(config2.ts) ? Settings.now() : config2.ts;
    let c = null, o = null;
    if (!invalid) {
      const unchanged = config2.old && config2.old.ts === this.ts && config2.old.zone.equals(zone);
      if (unchanged) {
        [c, o] = [config2.old.c, config2.old.o];
      } else {
        const ot = zone.offset(this.ts);
        c = tsToObj(this.ts, ot);
        invalid = Number.isNaN(c.year) ? new Invalid("invalid input") : null;
        c = invalid ? null : c;
        o = invalid ? null : ot;
      }
    }
    this._zone = zone;
    this.loc = config2.loc || Locale.create();
    this.invalid = invalid;
    this.weekData = null;
    this.localWeekData = null;
    this.c = c;
    this.o = o;
    this.isLuxonDateTime = true;
  }
  // CONSTRUCT
  /**
   * Create a DateTime for the current instant, in the system's time zone.
   *
   * Use Settings to override these default values if needed.
   * @example DateTime.now().toISO() //~> now in the ISO format
   * @return {DateTime}
   */
  static now() {
    return new DateTime({});
  }
  /**
   * Create a local DateTime
   * @param {number} [year] - The calendar year. If omitted (as in, call `local()` with no arguments), the current time will be used
   * @param {number} [month=1] - The month, 1-indexed
   * @param {number} [day=1] - The day of the month, 1-indexed
   * @param {number} [hour=0] - The hour of the day, in 24-hour time
   * @param {number} [minute=0] - The minute of the hour, meaning a number between 0 and 59
   * @param {number} [second=0] - The second of the minute, meaning a number between 0 and 59
   * @param {number} [millisecond=0] - The millisecond of the second, meaning a number between 0 and 999
   * @example DateTime.local()                                  //~> now
   * @example DateTime.local({ zone: "America/New_York" })      //~> now, in US east coast time
   * @example DateTime.local(2017)                              //~> 2017-01-01T00:00:00
   * @example DateTime.local(2017, 3)                           //~> 2017-03-01T00:00:00
   * @example DateTime.local(2017, 3, 12, { locale: "fr" })     //~> 2017-03-12T00:00:00, with a French locale
   * @example DateTime.local(2017, 3, 12, 5)                    //~> 2017-03-12T05:00:00
   * @example DateTime.local(2017, 3, 12, 5, { zone: "utc" })   //~> 2017-03-12T05:00:00, in UTC
   * @example DateTime.local(2017, 3, 12, 5, 45)                //~> 2017-03-12T05:45:00
   * @example DateTime.local(2017, 3, 12, 5, 45, 10)            //~> 2017-03-12T05:45:10
   * @example DateTime.local(2017, 3, 12, 5, 45, 10, 765)       //~> 2017-03-12T05:45:10.765
   * @return {DateTime}
   */
  static local() {
    const [opts, args] = lastOpts(arguments), [year, month, day, hour, minute, second, millisecond] = args;
    return quickDT({ year, month, day, hour, minute, second, millisecond }, opts);
  }
  /**
   * Create a DateTime in UTC
   * @param {number} [year] - The calendar year. If omitted (as in, call `utc()` with no arguments), the current time will be used
   * @param {number} [month=1] - The month, 1-indexed
   * @param {number} [day=1] - The day of the month
   * @param {number} [hour=0] - The hour of the day, in 24-hour time
   * @param {number} [minute=0] - The minute of the hour, meaning a number between 0 and 59
   * @param {number} [second=0] - The second of the minute, meaning a number between 0 and 59
   * @param {number} [millisecond=0] - The millisecond of the second, meaning a number between 0 and 999
   * @param {Object} options - configuration options for the DateTime
   * @param {string} [options.locale] - a locale to set on the resulting DateTime instance
   * @param {string} [options.outputCalendar] - the output calendar to set on the resulting DateTime instance
   * @param {string} [options.numberingSystem] - the numbering system to set on the resulting DateTime instance
   * @example DateTime.utc()                                              //~> now
   * @example DateTime.utc(2017)                                          //~> 2017-01-01T00:00:00Z
   * @example DateTime.utc(2017, 3)                                       //~> 2017-03-01T00:00:00Z
   * @example DateTime.utc(2017, 3, 12)                                   //~> 2017-03-12T00:00:00Z
   * @example DateTime.utc(2017, 3, 12, 5)                                //~> 2017-03-12T05:00:00Z
   * @example DateTime.utc(2017, 3, 12, 5, 45)                            //~> 2017-03-12T05:45:00Z
   * @example DateTime.utc(2017, 3, 12, 5, 45, { locale: "fr" })          //~> 2017-03-12T05:45:00Z with a French locale
   * @example DateTime.utc(2017, 3, 12, 5, 45, 10)                        //~> 2017-03-12T05:45:10Z
   * @example DateTime.utc(2017, 3, 12, 5, 45, 10, 765, { locale: "fr" }) //~> 2017-03-12T05:45:10.765Z with a French locale
   * @return {DateTime}
   */
  static utc() {
    const [opts, args] = lastOpts(arguments), [year, month, day, hour, minute, second, millisecond] = args;
    opts.zone = FixedOffsetZone.utcInstance;
    return quickDT({ year, month, day, hour, minute, second, millisecond }, opts);
  }
  /**
   * Create a DateTime from a JavaScript Date object. Uses the default zone.
   * @param {Date} date - a JavaScript Date object
   * @param {Object} options - configuration options for the DateTime
   * @param {string|Zone} [options.zone='local'] - the zone to place the DateTime into
   * @return {DateTime}
   */
  static fromJSDate(date, options = {}) {
    const ts = isDate(date) ? date.valueOf() : NaN;
    if (Number.isNaN(ts)) {
      return DateTime.invalid("invalid input");
    }
    const zoneToUse = normalizeZone(options.zone, Settings.defaultZone);
    if (!zoneToUse.isValid) {
      return DateTime.invalid(unsupportedZone(zoneToUse));
    }
    return new DateTime({
      ts,
      zone: zoneToUse,
      loc: Locale.fromObject(options)
    });
  }
  /**
   * Create a DateTime from a number of milliseconds since the epoch (meaning since 1 January 1970 00:00:00 UTC). Uses the default zone.
   * @param {number} milliseconds - a number of milliseconds since 1970 UTC
   * @param {Object} options - configuration options for the DateTime
   * @param {string|Zone} [options.zone='local'] - the zone to place the DateTime into
   * @param {string} [options.locale] - a locale to set on the resulting DateTime instance
   * @param {string} options.outputCalendar - the output calendar to set on the resulting DateTime instance
   * @param {string} options.numberingSystem - the numbering system to set on the resulting DateTime instance
   * @return {DateTime}
   */
  static fromMillis(milliseconds, options = {}) {
    if (!isNumber(milliseconds)) {
      throw new InvalidArgumentError(
        `fromMillis requires a numerical input, but received a ${typeof milliseconds} with value ${milliseconds}`
      );
    } else if (milliseconds < -MAX_DATE || milliseconds > MAX_DATE) {
      return DateTime.invalid("Timestamp out of range");
    } else {
      return new DateTime({
        ts: milliseconds,
        zone: normalizeZone(options.zone, Settings.defaultZone),
        loc: Locale.fromObject(options)
      });
    }
  }
  /**
   * Create a DateTime from a number of seconds since the epoch (meaning since 1 January 1970 00:00:00 UTC). Uses the default zone.
   * @param {number} seconds - a number of seconds since 1970 UTC
   * @param {Object} options - configuration options for the DateTime
   * @param {string|Zone} [options.zone='local'] - the zone to place the DateTime into
   * @param {string} [options.locale] - a locale to set on the resulting DateTime instance
   * @param {string} options.outputCalendar - the output calendar to set on the resulting DateTime instance
   * @param {string} options.numberingSystem - the numbering system to set on the resulting DateTime instance
   * @return {DateTime}
   */
  static fromSeconds(seconds, options = {}) {
    if (!isNumber(seconds)) {
      throw new InvalidArgumentError("fromSeconds requires a numerical input");
    } else {
      return new DateTime({
        ts: seconds * 1e3,
        zone: normalizeZone(options.zone, Settings.defaultZone),
        loc: Locale.fromObject(options)
      });
    }
  }
  /**
   * Create a DateTime from a JavaScript object with keys like 'year' and 'hour' with reasonable defaults.
   * @param {Object} obj - the object to create the DateTime from
   * @param {number} obj.year - a year, such as 1987
   * @param {number} obj.month - a month, 1-12
   * @param {number} obj.day - a day of the month, 1-31, depending on the month
   * @param {number} obj.ordinal - day of the year, 1-365 or 366
   * @param {number} obj.weekYear - an ISO week year
   * @param {number} obj.weekNumber - an ISO week number, between 1 and 52 or 53, depending on the year
   * @param {number} obj.weekday - an ISO weekday, 1-7, where 1 is Monday and 7 is Sunday
   * @param {number} obj.localWeekYear - a week year, according to the locale
   * @param {number} obj.localWeekNumber - a week number, between 1 and 52 or 53, depending on the year, according to the locale
   * @param {number} obj.localWeekday - a weekday, 1-7, where 1 is the first and 7 is the last day of the week, according to the locale
   * @param {number} obj.hour - hour of the day, 0-23
   * @param {number} obj.minute - minute of the hour, 0-59
   * @param {number} obj.second - second of the minute, 0-59
   * @param {number} obj.millisecond - millisecond of the second, 0-999
   * @param {Object} opts - options for creating this DateTime
   * @param {string|Zone} [opts.zone='local'] - interpret the numbers in the context of a particular zone. Can take any value taken as the first argument to setZone()
   * @param {string} [opts.locale='system\'s locale'] - a locale to set on the resulting DateTime instance
   * @param {string} opts.outputCalendar - the output calendar to set on the resulting DateTime instance
   * @param {string} opts.numberingSystem - the numbering system to set on the resulting DateTime instance
   * @example DateTime.fromObject({ year: 1982, month: 5, day: 25}).toISODate() //=> '1982-05-25'
   * @example DateTime.fromObject({ year: 1982 }).toISODate() //=> '1982-01-01'
   * @example DateTime.fromObject({ hour: 10, minute: 26, second: 6 }) //~> today at 10:26:06
   * @example DateTime.fromObject({ hour: 10, minute: 26, second: 6 }, { zone: 'utc' }),
   * @example DateTime.fromObject({ hour: 10, minute: 26, second: 6 }, { zone: 'local' })
   * @example DateTime.fromObject({ hour: 10, minute: 26, second: 6 }, { zone: 'America/New_York' })
   * @example DateTime.fromObject({ weekYear: 2016, weekNumber: 2, weekday: 3 }).toISODate() //=> '2016-01-13'
   * @example DateTime.fromObject({ localWeekYear: 2022, localWeekNumber: 1, localWeekday: 1 }, { locale: "en-US" }).toISODate() //=> '2021-12-26'
   * @return {DateTime}
   */
  static fromObject(obj, opts = {}) {
    obj = obj || {};
    const zoneToUse = normalizeZone(opts.zone, Settings.defaultZone);
    if (!zoneToUse.isValid) {
      return DateTime.invalid(unsupportedZone(zoneToUse));
    }
    const loc = Locale.fromObject(opts);
    const normalized = normalizeObject(obj, normalizeUnitWithLocalWeeks);
    const { minDaysInFirstWeek, startOfWeek } = usesLocalWeekValues(normalized, loc);
    const tsNow = Settings.now(), offsetProvis = !isUndefined(opts.specificOffset) ? opts.specificOffset : zoneToUse.offset(tsNow), containsOrdinal = !isUndefined(normalized.ordinal), containsGregorYear = !isUndefined(normalized.year), containsGregorMD = !isUndefined(normalized.month) || !isUndefined(normalized.day), containsGregor = containsGregorYear || containsGregorMD, definiteWeekDef = normalized.weekYear || normalized.weekNumber;
    if ((containsGregor || containsOrdinal) && definiteWeekDef) {
      throw new ConflictingSpecificationError(
        "Can't mix weekYear/weekNumber units with year/month/day or ordinals"
      );
    }
    if (containsGregorMD && containsOrdinal) {
      throw new ConflictingSpecificationError("Can't mix ordinal dates with month/day");
    }
    const useWeekData = definiteWeekDef || normalized.weekday && !containsGregor;
    let units, defaultValues, objNow = tsToObj(tsNow, offsetProvis);
    if (useWeekData) {
      units = orderedWeekUnits;
      defaultValues = defaultWeekUnitValues;
      objNow = gregorianToWeek(objNow, minDaysInFirstWeek, startOfWeek);
    } else if (containsOrdinal) {
      units = orderedOrdinalUnits;
      defaultValues = defaultOrdinalUnitValues;
      objNow = gregorianToOrdinal(objNow);
    } else {
      units = orderedUnits;
      defaultValues = defaultUnitValues;
    }
    let foundFirst = false;
    for (const u2 of units) {
      const v2 = normalized[u2];
      if (!isUndefined(v2)) {
        foundFirst = true;
      } else if (foundFirst) {
        normalized[u2] = defaultValues[u2];
      } else {
        normalized[u2] = objNow[u2];
      }
    }
    const higherOrderInvalid = useWeekData ? hasInvalidWeekData(normalized, minDaysInFirstWeek, startOfWeek) : containsOrdinal ? hasInvalidOrdinalData(normalized) : hasInvalidGregorianData(normalized), invalid = higherOrderInvalid || hasInvalidTimeData(normalized);
    if (invalid) {
      return DateTime.invalid(invalid);
    }
    const gregorian = useWeekData ? weekToGregorian(normalized, minDaysInFirstWeek, startOfWeek) : containsOrdinal ? ordinalToGregorian(normalized) : normalized, [tsFinal, offsetFinal] = objToTS(gregorian, offsetProvis, zoneToUse), inst = new DateTime({
      ts: tsFinal,
      zone: zoneToUse,
      o: offsetFinal,
      loc
    });
    if (normalized.weekday && containsGregor && obj.weekday !== inst.weekday) {
      return DateTime.invalid(
        "mismatched weekday",
        `you can't specify both a weekday of ${normalized.weekday} and a date of ${inst.toISO()}`
      );
    }
    return inst;
  }
  /**
   * Create a DateTime from an ISO 8601 string
   * @param {string} text - the ISO string
   * @param {Object} opts - options to affect the creation
   * @param {string|Zone} [opts.zone='local'] - use this zone if no offset is specified in the input string itself. Will also convert the time to this zone
   * @param {boolean} [opts.setZone=false] - override the zone with a fixed-offset zone specified in the string itself, if it specifies one
   * @param {string} [opts.locale='system's locale'] - a locale to set on the resulting DateTime instance
   * @param {string} [opts.outputCalendar] - the output calendar to set on the resulting DateTime instance
   * @param {string} [opts.numberingSystem] - the numbering system to set on the resulting DateTime instance
   * @example DateTime.fromISO('2016-05-25T09:08:34.123')
   * @example DateTime.fromISO('2016-05-25T09:08:34.123+06:00')
   * @example DateTime.fromISO('2016-05-25T09:08:34.123+06:00', {setZone: true})
   * @example DateTime.fromISO('2016-05-25T09:08:34.123', {zone: 'utc'})
   * @example DateTime.fromISO('2016-W05-4')
   * @return {DateTime}
   */
  static fromISO(text, opts = {}) {
    const [vals, parsedZone] = parseISODate(text);
    return parseDataToDateTime(vals, parsedZone, opts, "ISO 8601", text);
  }
  /**
   * Create a DateTime from an RFC 2822 string
   * @param {string} text - the RFC 2822 string
   * @param {Object} opts - options to affect the creation
   * @param {string|Zone} [opts.zone='local'] - convert the time to this zone. Since the offset is always specified in the string itself, this has no effect on the interpretation of string, merely the zone the resulting DateTime is expressed in.
   * @param {boolean} [opts.setZone=false] - override the zone with a fixed-offset zone specified in the string itself, if it specifies one
   * @param {string} [opts.locale='system's locale'] - a locale to set on the resulting DateTime instance
   * @param {string} opts.outputCalendar - the output calendar to set on the resulting DateTime instance
   * @param {string} opts.numberingSystem - the numbering system to set on the resulting DateTime instance
   * @example DateTime.fromRFC2822('25 Nov 2016 13:23:12 GMT')
   * @example DateTime.fromRFC2822('Fri, 25 Nov 2016 13:23:12 +0600')
   * @example DateTime.fromRFC2822('25 Nov 2016 13:23 Z')
   * @return {DateTime}
   */
  static fromRFC2822(text, opts = {}) {
    const [vals, parsedZone] = parseRFC2822Date(text);
    return parseDataToDateTime(vals, parsedZone, opts, "RFC 2822", text);
  }
  /**
   * Create a DateTime from an HTTP header date
   * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec3.html#sec3.3.1
   * @param {string} text - the HTTP header date
   * @param {Object} opts - options to affect the creation
   * @param {string|Zone} [opts.zone='local'] - convert the time to this zone. Since HTTP dates are always in UTC, this has no effect on the interpretation of string, merely the zone the resulting DateTime is expressed in.
   * @param {boolean} [opts.setZone=false] - override the zone with the fixed-offset zone specified in the string. For HTTP dates, this is always UTC, so this option is equivalent to setting the `zone` option to 'utc', but this option is included for consistency with similar methods.
   * @param {string} [opts.locale='system's locale'] - a locale to set on the resulting DateTime instance
   * @param {string} opts.outputCalendar - the output calendar to set on the resulting DateTime instance
   * @param {string} opts.numberingSystem - the numbering system to set on the resulting DateTime instance
   * @example DateTime.fromHTTP('Sun, 06 Nov 1994 08:49:37 GMT')
   * @example DateTime.fromHTTP('Sunday, 06-Nov-94 08:49:37 GMT')
   * @example DateTime.fromHTTP('Sun Nov  6 08:49:37 1994')
   * @return {DateTime}
   */
  static fromHTTP(text, opts = {}) {
    const [vals, parsedZone] = parseHTTPDate(text);
    return parseDataToDateTime(vals, parsedZone, opts, "HTTP", opts);
  }
  /**
   * Create a DateTime from an input string and format string.
   * Defaults to en-US if no locale has been specified, regardless of the system's locale. For a table of tokens and their interpretations, see [here](https://moment.github.io/luxon/#/parsing?id=table-of-tokens).
   * @param {string} text - the string to parse
   * @param {string} fmt - the format the string is expected to be in (see the link below for the formats)
   * @param {Object} opts - options to affect the creation
   * @param {string|Zone} [opts.zone='local'] - use this zone if no offset is specified in the input string itself. Will also convert the DateTime to this zone
   * @param {boolean} [opts.setZone=false] - override the zone with a zone specified in the string itself, if it specifies one
   * @param {string} [opts.locale='en-US'] - a locale string to use when parsing. Will also set the DateTime to this locale
   * @param {string} opts.numberingSystem - the numbering system to use when parsing. Will also set the resulting DateTime to this numbering system
   * @param {string} opts.outputCalendar - the output calendar to set on the resulting DateTime instance
   * @return {DateTime}
   */
  static fromFormat(text, fmt, opts = {}) {
    if (isUndefined(text) || isUndefined(fmt)) {
      throw new InvalidArgumentError("fromFormat requires an input string and a format");
    }
    const { locale = null, numberingSystem = null } = opts, localeToUse = Locale.fromOpts({
      locale,
      numberingSystem,
      defaultToEN: true
    }), [vals, parsedZone, specificOffset, invalid] = parseFromTokens(localeToUse, text, fmt);
    if (invalid) {
      return DateTime.invalid(invalid);
    } else {
      return parseDataToDateTime(vals, parsedZone, opts, `format ${fmt}`, text, specificOffset);
    }
  }
  /**
   * @deprecated use fromFormat instead
   */
  static fromString(text, fmt, opts = {}) {
    return DateTime.fromFormat(text, fmt, opts);
  }
  /**
   * Create a DateTime from a SQL date, time, or datetime
   * Defaults to en-US if no locale has been specified, regardless of the system's locale
   * @param {string} text - the string to parse
   * @param {Object} opts - options to affect the creation
   * @param {string|Zone} [opts.zone='local'] - use this zone if no offset is specified in the input string itself. Will also convert the DateTime to this zone
   * @param {boolean} [opts.setZone=false] - override the zone with a zone specified in the string itself, if it specifies one
   * @param {string} [opts.locale='en-US'] - a locale string to use when parsing. Will also set the DateTime to this locale
   * @param {string} opts.numberingSystem - the numbering system to use when parsing. Will also set the resulting DateTime to this numbering system
   * @param {string} opts.outputCalendar - the output calendar to set on the resulting DateTime instance
   * @example DateTime.fromSQL('2017-05-15')
   * @example DateTime.fromSQL('2017-05-15 09:12:34')
   * @example DateTime.fromSQL('2017-05-15 09:12:34.342')
   * @example DateTime.fromSQL('2017-05-15 09:12:34.342+06:00')
   * @example DateTime.fromSQL('2017-05-15 09:12:34.342 America/Los_Angeles')
   * @example DateTime.fromSQL('2017-05-15 09:12:34.342 America/Los_Angeles', { setZone: true })
   * @example DateTime.fromSQL('2017-05-15 09:12:34.342', { zone: 'America/Los_Angeles' })
   * @example DateTime.fromSQL('09:12:34.342')
   * @return {DateTime}
   */
  static fromSQL(text, opts = {}) {
    const [vals, parsedZone] = parseSQL(text);
    return parseDataToDateTime(vals, parsedZone, opts, "SQL", text);
  }
  /**
   * Create an invalid DateTime.
   * @param {string} reason - simple string of why this DateTime is invalid. Should not contain parameters or anything else data-dependent.
   * @param {string} [explanation=null] - longer explanation, may include parameters and other useful debugging information
   * @return {DateTime}
   */
  static invalid(reason, explanation = null) {
    if (!reason) {
      throw new InvalidArgumentError("need to specify a reason the DateTime is invalid");
    }
    const invalid = reason instanceof Invalid ? reason : new Invalid(reason, explanation);
    if (Settings.throwOnInvalid) {
      throw new InvalidDateTimeError(invalid);
    } else {
      return new DateTime({ invalid });
    }
  }
  /**
   * Check if an object is an instance of DateTime. Works across context boundaries
   * @param {object} o
   * @return {boolean}
   */
  static isDateTime(o) {
    return o && o.isLuxonDateTime || false;
  }
  /**
   * Produce the format string for a set of options
   * @param formatOpts
   * @param localeOpts
   * @returns {string}
   */
  static parseFormatForOpts(formatOpts, localeOpts = {}) {
    const tokenList = formatOptsToTokens(formatOpts, Locale.fromObject(localeOpts));
    return !tokenList ? null : tokenList.map((t2) => t2 ? t2.val : null).join("");
  }
  /**
   * Produce the the fully expanded format token for the locale
   * Does NOT quote characters, so quoted tokens will not round trip correctly
   * @param fmt
   * @param localeOpts
   * @returns {string}
   */
  static expandFormat(fmt, localeOpts = {}) {
    const expanded = expandMacroTokens(Formatter.parseFormat(fmt), Locale.fromObject(localeOpts));
    return expanded.map((t2) => t2.val).join("");
  }
  // INFO
  /**
   * Get the value of unit.
   * @param {string} unit - a unit such as 'minute' or 'day'
   * @example DateTime.local(2017, 7, 4).get('month'); //=> 7
   * @example DateTime.local(2017, 7, 4).get('day'); //=> 4
   * @return {number}
   */
  get(unit) {
    return this[unit];
  }
  /**
   * Returns whether the DateTime is valid. Invalid DateTimes occur when:
   * * The DateTime was created from invalid calendar information, such as the 13th month or February 30
   * * The DateTime was created by an operation on another invalid date
   * @type {boolean}
   */
  get isValid() {
    return this.invalid === null;
  }
  /**
   * Returns an error code if this DateTime is invalid, or null if the DateTime is valid
   * @type {string}
   */
  get invalidReason() {
    return this.invalid ? this.invalid.reason : null;
  }
  /**
   * Returns an explanation of why this DateTime became invalid, or null if the DateTime is valid
   * @type {string}
   */
  get invalidExplanation() {
    return this.invalid ? this.invalid.explanation : null;
  }
  /**
   * Get the locale of a DateTime, such 'en-GB'. The locale is used when formatting the DateTime
   *
   * @type {string}
   */
  get locale() {
    return this.isValid ? this.loc.locale : null;
  }
  /**
   * Get the numbering system of a DateTime, such 'beng'. The numbering system is used when formatting the DateTime
   *
   * @type {string}
   */
  get numberingSystem() {
    return this.isValid ? this.loc.numberingSystem : null;
  }
  /**
   * Get the output calendar of a DateTime, such 'islamic'. The output calendar is used when formatting the DateTime
   *
   * @type {string}
   */
  get outputCalendar() {
    return this.isValid ? this.loc.outputCalendar : null;
  }
  /**
   * Get the time zone associated with this DateTime.
   * @type {Zone}
   */
  get zone() {
    return this._zone;
  }
  /**
   * Get the name of the time zone.
   * @type {string}
   */
  get zoneName() {
    return this.isValid ? this.zone.name : null;
  }
  /**
   * Get the year
   * @example DateTime.local(2017, 5, 25).year //=> 2017
   * @type {number}
   */
  get year() {
    return this.isValid ? this.c.year : NaN;
  }
  /**
   * Get the quarter
   * @example DateTime.local(2017, 5, 25).quarter //=> 2
   * @type {number}
   */
  get quarter() {
    return this.isValid ? Math.ceil(this.c.month / 3) : NaN;
  }
  /**
   * Get the month (1-12).
   * @example DateTime.local(2017, 5, 25).month //=> 5
   * @type {number}
   */
  get month() {
    return this.isValid ? this.c.month : NaN;
  }
  /**
   * Get the day of the month (1-30ish).
   * @example DateTime.local(2017, 5, 25).day //=> 25
   * @type {number}
   */
  get day() {
    return this.isValid ? this.c.day : NaN;
  }
  /**
   * Get the hour of the day (0-23).
   * @example DateTime.local(2017, 5, 25, 9).hour //=> 9
   * @type {number}
   */
  get hour() {
    return this.isValid ? this.c.hour : NaN;
  }
  /**
   * Get the minute of the hour (0-59).
   * @example DateTime.local(2017, 5, 25, 9, 30).minute //=> 30
   * @type {number}
   */
  get minute() {
    return this.isValid ? this.c.minute : NaN;
  }
  /**
   * Get the second of the minute (0-59).
   * @example DateTime.local(2017, 5, 25, 9, 30, 52).second //=> 52
   * @type {number}
   */
  get second() {
    return this.isValid ? this.c.second : NaN;
  }
  /**
   * Get the millisecond of the second (0-999).
   * @example DateTime.local(2017, 5, 25, 9, 30, 52, 654).millisecond //=> 654
   * @type {number}
   */
  get millisecond() {
    return this.isValid ? this.c.millisecond : NaN;
  }
  /**
   * Get the week year
   * @see https://en.wikipedia.org/wiki/ISO_week_date
   * @example DateTime.local(2014, 12, 31).weekYear //=> 2015
   * @type {number}
   */
  get weekYear() {
    return this.isValid ? possiblyCachedWeekData(this).weekYear : NaN;
  }
  /**
   * Get the week number of the week year (1-52ish).
   * @see https://en.wikipedia.org/wiki/ISO_week_date
   * @example DateTime.local(2017, 5, 25).weekNumber //=> 21
   * @type {number}
   */
  get weekNumber() {
    return this.isValid ? possiblyCachedWeekData(this).weekNumber : NaN;
  }
  /**
   * Get the day of the week.
   * 1 is Monday and 7 is Sunday
   * @see https://en.wikipedia.org/wiki/ISO_week_date
   * @example DateTime.local(2014, 11, 31).weekday //=> 4
   * @type {number}
   */
  get weekday() {
    return this.isValid ? possiblyCachedWeekData(this).weekday : NaN;
  }
  /**
   * Returns true if this date is on a weekend according to the locale, false otherwise
   * @returns {boolean}
   */
  get isWeekend() {
    return this.isValid && this.loc.getWeekendDays().includes(this.weekday);
  }
  /**
   * Get the day of the week according to the locale.
   * 1 is the first day of the week and 7 is the last day of the week.
   * If the locale assigns Sunday as the first day of the week, then a date which is a Sunday will return 1,
   * @returns {number}
   */
  get localWeekday() {
    return this.isValid ? possiblyCachedLocalWeekData(this).weekday : NaN;
  }
  /**
   * Get the week number of the week year according to the locale. Different locales assign week numbers differently,
   * because the week can start on different days of the week (see localWeekday) and because a different number of days
   * is required for a week to count as the first week of a year.
   * @returns {number}
   */
  get localWeekNumber() {
    return this.isValid ? possiblyCachedLocalWeekData(this).weekNumber : NaN;
  }
  /**
   * Get the week year according to the locale. Different locales assign week numbers (and therefor week years)
   * differently, see localWeekNumber.
   * @returns {number}
   */
  get localWeekYear() {
    return this.isValid ? possiblyCachedLocalWeekData(this).weekYear : NaN;
  }
  /**
   * Get the ordinal (meaning the day of the year)
   * @example DateTime.local(2017, 5, 25).ordinal //=> 145
   * @type {number|DateTime}
   */
  get ordinal() {
    return this.isValid ? gregorianToOrdinal(this.c).ordinal : NaN;
  }
  /**
   * Get the human readable short month name, such as 'Oct'.
   * Defaults to the system's locale if no locale has been specified
   * @example DateTime.local(2017, 10, 30).monthShort //=> Oct
   * @type {string}
   */
  get monthShort() {
    return this.isValid ? Info.months("short", { locObj: this.loc })[this.month - 1] : null;
  }
  /**
   * Get the human readable long month name, such as 'October'.
   * Defaults to the system's locale if no locale has been specified
   * @example DateTime.local(2017, 10, 30).monthLong //=> October
   * @type {string}
   */
  get monthLong() {
    return this.isValid ? Info.months("long", { locObj: this.loc })[this.month - 1] : null;
  }
  /**
   * Get the human readable short weekday, such as 'Mon'.
   * Defaults to the system's locale if no locale has been specified
   * @example DateTime.local(2017, 10, 30).weekdayShort //=> Mon
   * @type {string}
   */
  get weekdayShort() {
    return this.isValid ? Info.weekdays("short", { locObj: this.loc })[this.weekday - 1] : null;
  }
  /**
   * Get the human readable long weekday, such as 'Monday'.
   * Defaults to the system's locale if no locale has been specified
   * @example DateTime.local(2017, 10, 30).weekdayLong //=> Monday
   * @type {string}
   */
  get weekdayLong() {
    return this.isValid ? Info.weekdays("long", { locObj: this.loc })[this.weekday - 1] : null;
  }
  /**
   * Get the UTC offset of this DateTime in minutes
   * @example DateTime.now().offset //=> -240
   * @example DateTime.utc().offset //=> 0
   * @type {number}
   */
  get offset() {
    return this.isValid ? +this.o : NaN;
  }
  /**
   * Get the short human name for the zone's current offset, for example "EST" or "EDT".
   * Defaults to the system's locale if no locale has been specified
   * @type {string}
   */
  get offsetNameShort() {
    if (this.isValid) {
      return this.zone.offsetName(this.ts, {
        format: "short",
        locale: this.locale
      });
    } else {
      return null;
    }
  }
  /**
   * Get the long human name for the zone's current offset, for example "Eastern Standard Time" or "Eastern Daylight Time".
   * Defaults to the system's locale if no locale has been specified
   * @type {string}
   */
  get offsetNameLong() {
    if (this.isValid) {
      return this.zone.offsetName(this.ts, {
        format: "long",
        locale: this.locale
      });
    } else {
      return null;
    }
  }
  /**
   * Get whether this zone's offset ever changes, as in a DST.
   * @type {boolean}
   */
  get isOffsetFixed() {
    return this.isValid ? this.zone.isUniversal : null;
  }
  /**
   * Get whether the DateTime is in a DST.
   * @type {boolean}
   */
  get isInDST() {
    if (this.isOffsetFixed) {
      return false;
    } else {
      return this.offset > this.set({ month: 1, day: 1 }).offset || this.offset > this.set({ month: 5 }).offset;
    }
  }
  /**
   * Get those DateTimes which have the same local time as this DateTime, but a different offset from UTC
   * in this DateTime's zone. During DST changes local time can be ambiguous, for example
   * `2023-10-29T02:30:00` in `Europe/Berlin` can have offset `+01:00` or `+02:00`.
   * This method will return both possible DateTimes if this DateTime's local time is ambiguous.
   * @returns {DateTime[]}
   */
  getPossibleOffsets() {
    if (!this.isValid || this.isOffsetFixed) {
      return [this];
    }
    const dayMs = 864e5;
    const minuteMs = 6e4;
    const localTS = objToLocalTS(this.c);
    const oEarlier = this.zone.offset(localTS - dayMs);
    const oLater = this.zone.offset(localTS + dayMs);
    const o1 = this.zone.offset(localTS - oEarlier * minuteMs);
    const o2 = this.zone.offset(localTS - oLater * minuteMs);
    if (o1 === o2) {
      return [this];
    }
    const ts1 = localTS - o1 * minuteMs;
    const ts2 = localTS - o2 * minuteMs;
    const c1 = tsToObj(ts1, o1);
    const c2 = tsToObj(ts2, o2);
    if (c1.hour === c2.hour && c1.minute === c2.minute && c1.second === c2.second && c1.millisecond === c2.millisecond) {
      return [clone(this, { ts: ts1 }), clone(this, { ts: ts2 })];
    }
    return [this];
  }
  /**
   * Returns true if this DateTime is in a leap year, false otherwise
   * @example DateTime.local(2016).isInLeapYear //=> true
   * @example DateTime.local(2013).isInLeapYear //=> false
   * @type {boolean}
   */
  get isInLeapYear() {
    return isLeapYear(this.year);
  }
  /**
   * Returns the number of days in this DateTime's month
   * @example DateTime.local(2016, 2).daysInMonth //=> 29
   * @example DateTime.local(2016, 3).daysInMonth //=> 31
   * @type {number}
   */
  get daysInMonth() {
    return daysInMonth(this.year, this.month);
  }
  /**
   * Returns the number of days in this DateTime's year
   * @example DateTime.local(2016).daysInYear //=> 366
   * @example DateTime.local(2013).daysInYear //=> 365
   * @type {number}
   */
  get daysInYear() {
    return this.isValid ? daysInYear(this.year) : NaN;
  }
  /**
   * Returns the number of weeks in this DateTime's year
   * @see https://en.wikipedia.org/wiki/ISO_week_date
   * @example DateTime.local(2004).weeksInWeekYear //=> 53
   * @example DateTime.local(2013).weeksInWeekYear //=> 52
   * @type {number}
   */
  get weeksInWeekYear() {
    return this.isValid ? weeksInWeekYear(this.weekYear) : NaN;
  }
  /**
   * Returns the number of weeks in this DateTime's local week year
   * @example DateTime.local(2020, 6, {locale: 'en-US'}).weeksInLocalWeekYear //=> 52
   * @example DateTime.local(2020, 6, {locale: 'de-DE'}).weeksInLocalWeekYear //=> 53
   * @type {number}
   */
  get weeksInLocalWeekYear() {
    return this.isValid ? weeksInWeekYear(
      this.localWeekYear,
      this.loc.getMinDaysInFirstWeek(),
      this.loc.getStartOfWeek()
    ) : NaN;
  }
  /**
   * Returns the resolved Intl options for this DateTime.
   * This is useful in understanding the behavior of formatting methods
   * @param {Object} opts - the same options as toLocaleString
   * @return {Object}
   */
  resolvedLocaleOptions(opts = {}) {
    const { locale, numberingSystem, calendar } = Formatter.create(
      this.loc.clone(opts),
      opts
    ).resolvedOptions(this);
    return { locale, numberingSystem, outputCalendar: calendar };
  }
  // TRANSFORM
  /**
   * "Set" the DateTime's zone to UTC. Returns a newly-constructed DateTime.
   *
   * Equivalent to {@link DateTime#setZone}('utc')
   * @param {number} [offset=0] - optionally, an offset from UTC in minutes
   * @param {Object} [opts={}] - options to pass to `setZone()`
   * @return {DateTime}
   */
  toUTC(offset2 = 0, opts = {}) {
    return this.setZone(FixedOffsetZone.instance(offset2), opts);
  }
  /**
   * "Set" the DateTime's zone to the host's local zone. Returns a newly-constructed DateTime.
   *
   * Equivalent to `setZone('local')`
   * @return {DateTime}
   */
  toLocal() {
    return this.setZone(Settings.defaultZone);
  }
  /**
   * "Set" the DateTime's zone to specified zone. Returns a newly-constructed DateTime.
   *
   * By default, the setter keeps the underlying time the same (as in, the same timestamp), but the new instance will report different local times and consider DSTs when making computations, as with {@link DateTime#plus}. You may wish to use {@link DateTime#toLocal} and {@link DateTime#toUTC} which provide simple convenience wrappers for commonly used zones.
   * @param {string|Zone} [zone='local'] - a zone identifier. As a string, that can be any IANA zone supported by the host environment, or a fixed-offset name of the form 'UTC+3', or the strings 'local' or 'utc'. You may also supply an instance of a {@link DateTime#Zone} class.
   * @param {Object} opts - options
   * @param {boolean} [opts.keepLocalTime=false] - If true, adjust the underlying time so that the local time stays the same, but in the target zone. You should rarely need this.
   * @return {DateTime}
   */
  setZone(zone, { keepLocalTime = false, keepCalendarTime = false } = {}) {
    zone = normalizeZone(zone, Settings.defaultZone);
    if (zone.equals(this.zone)) {
      return this;
    } else if (!zone.isValid) {
      return DateTime.invalid(unsupportedZone(zone));
    } else {
      let newTS = this.ts;
      if (keepLocalTime || keepCalendarTime) {
        const offsetGuess = zone.offset(this.ts);
        const asObj = this.toObject();
        [newTS] = objToTS(asObj, offsetGuess, zone);
      }
      return clone(this, { ts: newTS, zone });
    }
  }
  /**
   * "Set" the locale, numberingSystem, or outputCalendar. Returns a newly-constructed DateTime.
   * @param {Object} properties - the properties to set
   * @example DateTime.local(2017, 5, 25).reconfigure({ locale: 'en-GB' })
   * @return {DateTime}
   */
  reconfigure({ locale, numberingSystem, outputCalendar } = {}) {
    const loc = this.loc.clone({ locale, numberingSystem, outputCalendar });
    return clone(this, { loc });
  }
  /**
   * "Set" the locale. Returns a newly-constructed DateTime.
   * Just a convenient alias for reconfigure({ locale })
   * @example DateTime.local(2017, 5, 25).setLocale('en-GB')
   * @return {DateTime}
   */
  setLocale(locale) {
    return this.reconfigure({ locale });
  }
  /**
   * "Set" the values of specified units. Returns a newly-constructed DateTime.
   * You can only set units with this method; for "setting" metadata, see {@link DateTime#reconfigure} and {@link DateTime#setZone}.
   *
   * This method also supports setting locale-based week units, i.e. `localWeekday`, `localWeekNumber` and `localWeekYear`.
   * They cannot be mixed with ISO-week units like `weekday`.
   * @param {Object} values - a mapping of units to numbers
   * @example dt.set({ year: 2017 })
   * @example dt.set({ hour: 8, minute: 30 })
   * @example dt.set({ weekday: 5 })
   * @example dt.set({ year: 2005, ordinal: 234 })
   * @return {DateTime}
   */
  set(values) {
    if (!this.isValid) return this;
    const normalized = normalizeObject(values, normalizeUnitWithLocalWeeks);
    const { minDaysInFirstWeek, startOfWeek } = usesLocalWeekValues(normalized, this.loc);
    const settingWeekStuff = !isUndefined(normalized.weekYear) || !isUndefined(normalized.weekNumber) || !isUndefined(normalized.weekday), containsOrdinal = !isUndefined(normalized.ordinal), containsGregorYear = !isUndefined(normalized.year), containsGregorMD = !isUndefined(normalized.month) || !isUndefined(normalized.day), containsGregor = containsGregorYear || containsGregorMD, definiteWeekDef = normalized.weekYear || normalized.weekNumber;
    if ((containsGregor || containsOrdinal) && definiteWeekDef) {
      throw new ConflictingSpecificationError(
        "Can't mix weekYear/weekNumber units with year/month/day or ordinals"
      );
    }
    if (containsGregorMD && containsOrdinal) {
      throw new ConflictingSpecificationError("Can't mix ordinal dates with month/day");
    }
    let mixed;
    if (settingWeekStuff) {
      mixed = weekToGregorian(
        { ...gregorianToWeek(this.c, minDaysInFirstWeek, startOfWeek), ...normalized },
        minDaysInFirstWeek,
        startOfWeek
      );
    } else if (!isUndefined(normalized.ordinal)) {
      mixed = ordinalToGregorian({ ...gregorianToOrdinal(this.c), ...normalized });
    } else {
      mixed = { ...this.toObject(), ...normalized };
      if (isUndefined(normalized.day)) {
        mixed.day = Math.min(daysInMonth(mixed.year, mixed.month), mixed.day);
      }
    }
    const [ts, o] = objToTS(mixed, this.o, this.zone);
    return clone(this, { ts, o });
  }
  /**
   * Add a period of time to this DateTime and return the resulting DateTime
   *
   * Adding hours, minutes, seconds, or milliseconds increases the timestamp by the right number of milliseconds. Adding days, months, or years shifts the calendar, accounting for DSTs and leap years along the way. Thus, `dt.plus({ hours: 24 })` may result in a different time than `dt.plus({ days: 1 })` if there's a DST shift in between.
   * @param {Duration|Object|number} duration - The amount to add. Either a Luxon Duration, a number of milliseconds, the object argument to Duration.fromObject()
   * @example DateTime.now().plus(123) //~> in 123 milliseconds
   * @example DateTime.now().plus({ minutes: 15 }) //~> in 15 minutes
   * @example DateTime.now().plus({ days: 1 }) //~> this time tomorrow
   * @example DateTime.now().plus({ days: -1 }) //~> this time yesterday
   * @example DateTime.now().plus({ hours: 3, minutes: 13 }) //~> in 3 hr, 13 min
   * @example DateTime.now().plus(Duration.fromObject({ hours: 3, minutes: 13 })) //~> in 3 hr, 13 min
   * @return {DateTime}
   */
  plus(duration) {
    if (!this.isValid) return this;
    const dur = Duration.fromDurationLike(duration);
    return clone(this, adjustTime(this, dur));
  }
  /**
   * Subtract a period of time to this DateTime and return the resulting DateTime
   * See {@link DateTime#plus}
   * @param {Duration|Object|number} duration - The amount to subtract. Either a Luxon Duration, a number of milliseconds, the object argument to Duration.fromObject()
   @return {DateTime}
   */
  minus(duration) {
    if (!this.isValid) return this;
    const dur = Duration.fromDurationLike(duration).negate();
    return clone(this, adjustTime(this, dur));
  }
  /**
   * "Set" this DateTime to the beginning of a unit of time.
   * @param {string} unit - The unit to go to the beginning of. Can be 'year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', or 'millisecond'.
   * @param {Object} opts - options
   * @param {boolean} [opts.useLocaleWeeks=false] - If true, use weeks based on the locale, i.e. use the locale-dependent start of the week
   * @example DateTime.local(2014, 3, 3).startOf('month').toISODate(); //=> '2014-03-01'
   * @example DateTime.local(2014, 3, 3).startOf('year').toISODate(); //=> '2014-01-01'
   * @example DateTime.local(2014, 3, 3).startOf('week').toISODate(); //=> '2014-03-03', weeks always start on Mondays
   * @example DateTime.local(2014, 3, 3, 5, 30).startOf('day').toISOTime(); //=> '00:00.000-05:00'
   * @example DateTime.local(2014, 3, 3, 5, 30).startOf('hour').toISOTime(); //=> '05:00:00.000-05:00'
   * @return {DateTime}
   */
  startOf(unit, { useLocaleWeeks = false } = {}) {
    if (!this.isValid) return this;
    const o = {}, normalizedUnit = Duration.normalizeUnit(unit);
    switch (normalizedUnit) {
      case "years":
        o.month = 1;
      case "quarters":
      case "months":
        o.day = 1;
      case "weeks":
      case "days":
        o.hour = 0;
      case "hours":
        o.minute = 0;
      case "minutes":
        o.second = 0;
      case "seconds":
        o.millisecond = 0;
        break;
    }
    if (normalizedUnit === "weeks") {
      if (useLocaleWeeks) {
        const startOfWeek = this.loc.getStartOfWeek();
        const { weekday } = this;
        if (weekday < startOfWeek) {
          o.weekNumber = this.weekNumber - 1;
        }
        o.weekday = startOfWeek;
      } else {
        o.weekday = 1;
      }
    }
    if (normalizedUnit === "quarters") {
      const q2 = Math.ceil(this.month / 3);
      o.month = (q2 - 1) * 3 + 1;
    }
    return this.set(o);
  }
  /**
   * "Set" this DateTime to the end (meaning the last millisecond) of a unit of time
   * @param {string} unit - The unit to go to the end of. Can be 'year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', or 'millisecond'.
   * @param {Object} opts - options
   * @param {boolean} [opts.useLocaleWeeks=false] - If true, use weeks based on the locale, i.e. use the locale-dependent start of the week
   * @example DateTime.local(2014, 3, 3).endOf('month').toISO(); //=> '2014-03-31T23:59:59.999-05:00'
   * @example DateTime.local(2014, 3, 3).endOf('year').toISO(); //=> '2014-12-31T23:59:59.999-05:00'
   * @example DateTime.local(2014, 3, 3).endOf('week').toISO(); // => '2014-03-09T23:59:59.999-05:00', weeks start on Mondays
   * @example DateTime.local(2014, 3, 3, 5, 30).endOf('day').toISO(); //=> '2014-03-03T23:59:59.999-05:00'
   * @example DateTime.local(2014, 3, 3, 5, 30).endOf('hour').toISO(); //=> '2014-03-03T05:59:59.999-05:00'
   * @return {DateTime}
   */
  endOf(unit, opts) {
    return this.isValid ? this.plus({ [unit]: 1 }).startOf(unit, opts).minus(1) : this;
  }
  // OUTPUT
  /**
   * Returns a string representation of this DateTime formatted according to the specified format string.
   * **You may not want this.** See {@link DateTime#toLocaleString} for a more flexible formatting tool. For a table of tokens and their interpretations, see [here](https://moment.github.io/luxon/#/formatting?id=table-of-tokens).
   * Defaults to en-US if no locale has been specified, regardless of the system's locale.
   * @param {string} fmt - the format string
   * @param {Object} opts - opts to override the configuration options on this DateTime
   * @example DateTime.now().toFormat('yyyy LLL dd') //=> '2017 Apr 22'
   * @example DateTime.now().setLocale('fr').toFormat('yyyy LLL dd') //=> '2017 avr. 22'
   * @example DateTime.now().toFormat('yyyy LLL dd', { locale: "fr" }) //=> '2017 avr. 22'
   * @example DateTime.now().toFormat("HH 'hours and' mm 'minutes'") //=> '20 hours and 55 minutes'
   * @return {string}
   */
  toFormat(fmt, opts = {}) {
    return this.isValid ? Formatter.create(this.loc.redefaultToEN(opts)).formatDateTimeFromString(this, fmt) : INVALID;
  }
  /**
   * Returns a localized string representing this date. Accepts the same options as the Intl.DateTimeFormat constructor and any presets defined by Luxon, such as `DateTime.DATE_FULL` or `DateTime.TIME_SIMPLE`.
   * The exact behavior of this method is browser-specific, but in general it will return an appropriate representation
   * of the DateTime in the assigned locale.
   * Defaults to the system's locale if no locale has been specified
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
   * @param formatOpts {Object} - Intl.DateTimeFormat constructor options and configuration options
   * @param {Object} opts - opts to override the configuration options on this DateTime
   * @example DateTime.now().toLocaleString(); //=> 4/20/2017
   * @example DateTime.now().setLocale('en-gb').toLocaleString(); //=> '20/04/2017'
   * @example DateTime.now().toLocaleString(DateTime.DATE_FULL); //=> 'April 20, 2017'
   * @example DateTime.now().toLocaleString(DateTime.DATE_FULL, { locale: 'fr' }); //=> '28 août 2022'
   * @example DateTime.now().toLocaleString(DateTime.TIME_SIMPLE); //=> '11:32 AM'
   * @example DateTime.now().toLocaleString(DateTime.DATETIME_SHORT); //=> '4/20/2017, 11:32 AM'
   * @example DateTime.now().toLocaleString({ weekday: 'long', month: 'long', day: '2-digit' }); //=> 'Thursday, April 20'
   * @example DateTime.now().toLocaleString({ weekday: 'short', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }); //=> 'Thu, Apr 20, 11:27 AM'
   * @example DateTime.now().toLocaleString({ hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }); //=> '11:32'
   * @return {string}
   */
  toLocaleString(formatOpts = DATE_SHORT, opts = {}) {
    return this.isValid ? Formatter.create(this.loc.clone(opts), formatOpts).formatDateTime(this) : INVALID;
  }
  /**
   * Returns an array of format "parts", meaning individual tokens along with metadata. This is allows callers to post-process individual sections of the formatted output.
   * Defaults to the system's locale if no locale has been specified
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat/formatToParts
   * @param opts {Object} - Intl.DateTimeFormat constructor options, same as `toLocaleString`.
   * @example DateTime.now().toLocaleParts(); //=> [
   *                                   //=>   { type: 'day', value: '25' },
   *                                   //=>   { type: 'literal', value: '/' },
   *                                   //=>   { type: 'month', value: '05' },
   *                                   //=>   { type: 'literal', value: '/' },
   *                                   //=>   { type: 'year', value: '1982' }
   *                                   //=> ]
   */
  toLocaleParts(opts = {}) {
    return this.isValid ? Formatter.create(this.loc.clone(opts), opts).formatDateTimeParts(this) : [];
  }
  /**
   * Returns an ISO 8601-compliant string representation of this DateTime
   * @param {Object} opts - options
   * @param {boolean} [opts.suppressMilliseconds=false] - exclude milliseconds from the format if they're 0
   * @param {boolean} [opts.suppressSeconds=false] - exclude seconds from the format if they're 0
   * @param {boolean} [opts.includeOffset=true] - include the offset, such as 'Z' or '-04:00'
   * @param {boolean} [opts.extendedZone=false] - add the time zone format extension
   * @param {string} [opts.format='extended'] - choose between the basic and extended format
   * @example DateTime.utc(1983, 5, 25).toISO() //=> '1982-05-25T00:00:00.000Z'
   * @example DateTime.now().toISO() //=> '2017-04-22T20:47:05.335-04:00'
   * @example DateTime.now().toISO({ includeOffset: false }) //=> '2017-04-22T20:47:05.335'
   * @example DateTime.now().toISO({ format: 'basic' }) //=> '20170422T204705.335-0400'
   * @return {string}
   */
  toISO({
    format = "extended",
    suppressSeconds = false,
    suppressMilliseconds = false,
    includeOffset = true,
    extendedZone = false
  } = {}) {
    if (!this.isValid) {
      return null;
    }
    const ext = format === "extended";
    let c = toISODate(this, ext);
    c += "T";
    c += toISOTime(this, ext, suppressSeconds, suppressMilliseconds, includeOffset, extendedZone);
    return c;
  }
  /**
   * Returns an ISO 8601-compliant string representation of this DateTime's date component
   * @param {Object} opts - options
   * @param {string} [opts.format='extended'] - choose between the basic and extended format
   * @example DateTime.utc(1982, 5, 25).toISODate() //=> '1982-05-25'
   * @example DateTime.utc(1982, 5, 25).toISODate({ format: 'basic' }) //=> '19820525'
   * @return {string}
   */
  toISODate({ format = "extended" } = {}) {
    if (!this.isValid) {
      return null;
    }
    return toISODate(this, format === "extended");
  }
  /**
   * Returns an ISO 8601-compliant string representation of this DateTime's week date
   * @example DateTime.utc(1982, 5, 25).toISOWeekDate() //=> '1982-W21-2'
   * @return {string}
   */
  toISOWeekDate() {
    return toTechFormat(this, "kkkk-'W'WW-c");
  }
  /**
   * Returns an ISO 8601-compliant string representation of this DateTime's time component
   * @param {Object} opts - options
   * @param {boolean} [opts.suppressMilliseconds=false] - exclude milliseconds from the format if they're 0
   * @param {boolean} [opts.suppressSeconds=false] - exclude seconds from the format if they're 0
   * @param {boolean} [opts.includeOffset=true] - include the offset, such as 'Z' or '-04:00'
   * @param {boolean} [opts.extendedZone=true] - add the time zone format extension
   * @param {boolean} [opts.includePrefix=false] - include the `T` prefix
   * @param {string} [opts.format='extended'] - choose between the basic and extended format
   * @example DateTime.utc().set({ hour: 7, minute: 34 }).toISOTime() //=> '07:34:19.361Z'
   * @example DateTime.utc().set({ hour: 7, minute: 34, seconds: 0, milliseconds: 0 }).toISOTime({ suppressSeconds: true }) //=> '07:34Z'
   * @example DateTime.utc().set({ hour: 7, minute: 34 }).toISOTime({ format: 'basic' }) //=> '073419.361Z'
   * @example DateTime.utc().set({ hour: 7, minute: 34 }).toISOTime({ includePrefix: true }) //=> 'T07:34:19.361Z'
   * @return {string}
   */
  toISOTime({
    suppressMilliseconds = false,
    suppressSeconds = false,
    includeOffset = true,
    includePrefix = false,
    extendedZone = false,
    format = "extended"
  } = {}) {
    if (!this.isValid) {
      return null;
    }
    let c = includePrefix ? "T" : "";
    return c + toISOTime(
      this,
      format === "extended",
      suppressSeconds,
      suppressMilliseconds,
      includeOffset,
      extendedZone
    );
  }
  /**
   * Returns an RFC 2822-compatible string representation of this DateTime
   * @example DateTime.utc(2014, 7, 13).toRFC2822() //=> 'Sun, 13 Jul 2014 00:00:00 +0000'
   * @example DateTime.local(2014, 7, 13).toRFC2822() //=> 'Sun, 13 Jul 2014 00:00:00 -0400'
   * @return {string}
   */
  toRFC2822() {
    return toTechFormat(this, "EEE, dd LLL yyyy HH:mm:ss ZZZ", false);
  }
  /**
   * Returns a string representation of this DateTime appropriate for use in HTTP headers. The output is always expressed in GMT.
   * Specifically, the string conforms to RFC 1123.
   * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec3.html#sec3.3.1
   * @example DateTime.utc(2014, 7, 13).toHTTP() //=> 'Sun, 13 Jul 2014 00:00:00 GMT'
   * @example DateTime.utc(2014, 7, 13, 19).toHTTP() //=> 'Sun, 13 Jul 2014 19:00:00 GMT'
   * @return {string}
   */
  toHTTP() {
    return toTechFormat(this.toUTC(), "EEE, dd LLL yyyy HH:mm:ss 'GMT'");
  }
  /**
   * Returns a string representation of this DateTime appropriate for use in SQL Date
   * @example DateTime.utc(2014, 7, 13).toSQLDate() //=> '2014-07-13'
   * @return {string}
   */
  toSQLDate() {
    if (!this.isValid) {
      return null;
    }
    return toISODate(this, true);
  }
  /**
   * Returns a string representation of this DateTime appropriate for use in SQL Time
   * @param {Object} opts - options
   * @param {boolean} [opts.includeZone=false] - include the zone, such as 'America/New_York'. Overrides includeOffset.
   * @param {boolean} [opts.includeOffset=true] - include the offset, such as 'Z' or '-04:00'
   * @param {boolean} [opts.includeOffsetSpace=true] - include the space between the time and the offset, such as '05:15:16.345 -04:00'
   * @example DateTime.utc().toSQL() //=> '05:15:16.345'
   * @example DateTime.now().toSQL() //=> '05:15:16.345 -04:00'
   * @example DateTime.now().toSQL({ includeOffset: false }) //=> '05:15:16.345'
   * @example DateTime.now().toSQL({ includeZone: false }) //=> '05:15:16.345 America/New_York'
   * @return {string}
   */
  toSQLTime({ includeOffset = true, includeZone = false, includeOffsetSpace = true } = {}) {
    let fmt = "HH:mm:ss.SSS";
    if (includeZone || includeOffset) {
      if (includeOffsetSpace) {
        fmt += " ";
      }
      if (includeZone) {
        fmt += "z";
      } else if (includeOffset) {
        fmt += "ZZ";
      }
    }
    return toTechFormat(this, fmt, true);
  }
  /**
   * Returns a string representation of this DateTime appropriate for use in SQL DateTime
   * @param {Object} opts - options
   * @param {boolean} [opts.includeZone=false] - include the zone, such as 'America/New_York'. Overrides includeOffset.
   * @param {boolean} [opts.includeOffset=true] - include the offset, such as 'Z' or '-04:00'
   * @param {boolean} [opts.includeOffsetSpace=true] - include the space between the time and the offset, such as '05:15:16.345 -04:00'
   * @example DateTime.utc(2014, 7, 13).toSQL() //=> '2014-07-13 00:00:00.000 Z'
   * @example DateTime.local(2014, 7, 13).toSQL() //=> '2014-07-13 00:00:00.000 -04:00'
   * @example DateTime.local(2014, 7, 13).toSQL({ includeOffset: false }) //=> '2014-07-13 00:00:00.000'
   * @example DateTime.local(2014, 7, 13).toSQL({ includeZone: true }) //=> '2014-07-13 00:00:00.000 America/New_York'
   * @return {string}
   */
  toSQL(opts = {}) {
    if (!this.isValid) {
      return null;
    }
    return `${this.toSQLDate()} ${this.toSQLTime(opts)}`;
  }
  /**
   * Returns a string representation of this DateTime appropriate for debugging
   * @return {string}
   */
  toString() {
    return this.isValid ? this.toISO() : INVALID;
  }
  /**
   * Returns a string representation of this DateTime appropriate for the REPL.
   * @return {string}
   */
  [Symbol.for("nodejs.util.inspect.custom")]() {
    if (this.isValid) {
      return `DateTime { ts: ${this.toISO()}, zone: ${this.zone.name}, locale: ${this.locale} }`;
    } else {
      return `DateTime { Invalid, reason: ${this.invalidReason} }`;
    }
  }
  /**
   * Returns the epoch milliseconds of this DateTime. Alias of {@link DateTime#toMillis}
   * @return {number}
   */
  valueOf() {
    return this.toMillis();
  }
  /**
   * Returns the epoch milliseconds of this DateTime.
   * @return {number}
   */
  toMillis() {
    return this.isValid ? this.ts : NaN;
  }
  /**
   * Returns the epoch seconds of this DateTime.
   * @return {number}
   */
  toSeconds() {
    return this.isValid ? this.ts / 1e3 : NaN;
  }
  /**
   * Returns the epoch seconds (as a whole number) of this DateTime.
   * @return {number}
   */
  toUnixInteger() {
    return this.isValid ? Math.floor(this.ts / 1e3) : NaN;
  }
  /**
   * Returns an ISO 8601 representation of this DateTime appropriate for use in JSON.
   * @return {string}
   */
  toJSON() {
    return this.toISO();
  }
  /**
   * Returns a BSON serializable equivalent to this DateTime.
   * @return {Date}
   */
  toBSON() {
    return this.toJSDate();
  }
  /**
   * Returns a JavaScript object with this DateTime's year, month, day, and so on.
   * @param opts - options for generating the object
   * @param {boolean} [opts.includeConfig=false] - include configuration attributes in the output
   * @example DateTime.now().toObject() //=> { year: 2017, month: 4, day: 22, hour: 20, minute: 49, second: 42, millisecond: 268 }
   * @return {Object}
   */
  toObject(opts = {}) {
    if (!this.isValid) return {};
    const base = { ...this.c };
    if (opts.includeConfig) {
      base.outputCalendar = this.outputCalendar;
      base.numberingSystem = this.loc.numberingSystem;
      base.locale = this.loc.locale;
    }
    return base;
  }
  /**
   * Returns a JavaScript Date equivalent to this DateTime.
   * @return {Date}
   */
  toJSDate() {
    return new Date(this.isValid ? this.ts : NaN);
  }
  // COMPARE
  /**
   * Return the difference between two DateTimes as a Duration.
   * @param {DateTime} otherDateTime - the DateTime to compare this one to
   * @param {string|string[]} [unit=['milliseconds']] - the unit or array of units (such as 'hours' or 'days') to include in the duration.
   * @param {Object} opts - options that affect the creation of the Duration
   * @param {string} [opts.conversionAccuracy='casual'] - the conversion system to use
   * @example
   * var i1 = DateTime.fromISO('1982-05-25T09:45'),
   *     i2 = DateTime.fromISO('1983-10-14T10:30');
   * i2.diff(i1).toObject() //=> { milliseconds: 43807500000 }
   * i2.diff(i1, 'hours').toObject() //=> { hours: 12168.75 }
   * i2.diff(i1, ['months', 'days']).toObject() //=> { months: 16, days: 19.03125 }
   * i2.diff(i1, ['months', 'days', 'hours']).toObject() //=> { months: 16, days: 19, hours: 0.75 }
   * @return {Duration}
   */
  diff(otherDateTime, unit = "milliseconds", opts = {}) {
    if (!this.isValid || !otherDateTime.isValid) {
      return Duration.invalid("created by diffing an invalid DateTime");
    }
    const durOpts = { locale: this.locale, numberingSystem: this.numberingSystem, ...opts };
    const units = maybeArray(unit).map(Duration.normalizeUnit), otherIsLater = otherDateTime.valueOf() > this.valueOf(), earlier = otherIsLater ? this : otherDateTime, later = otherIsLater ? otherDateTime : this, diffed = diff(earlier, later, units, durOpts);
    return otherIsLater ? diffed.negate() : diffed;
  }
  /**
   * Return the difference between this DateTime and right now.
   * See {@link DateTime#diff}
   * @param {string|string[]} [unit=['milliseconds']] - the unit or units units (such as 'hours' or 'days') to include in the duration
   * @param {Object} opts - options that affect the creation of the Duration
   * @param {string} [opts.conversionAccuracy='casual'] - the conversion system to use
   * @return {Duration}
   */
  diffNow(unit = "milliseconds", opts = {}) {
    return this.diff(DateTime.now(), unit, opts);
  }
  /**
   * Return an Interval spanning between this DateTime and another DateTime
   * @param {DateTime} otherDateTime - the other end point of the Interval
   * @return {Interval}
   */
  until(otherDateTime) {
    return this.isValid ? Interval.fromDateTimes(this, otherDateTime) : this;
  }
  /**
   * Return whether this DateTime is in the same unit of time as another DateTime.
   * Higher-order units must also be identical for this function to return `true`.
   * Note that time zones are **ignored** in this comparison, which compares the **local** calendar time. Use {@link DateTime#setZone} to convert one of the dates if needed.
   * @param {DateTime} otherDateTime - the other DateTime
   * @param {string} unit - the unit of time to check sameness on
   * @param {Object} opts - options
   * @param {boolean} [opts.useLocaleWeeks=false] - If true, use weeks based on the locale, i.e. use the locale-dependent start of the week; only the locale of this DateTime is used
   * @example DateTime.now().hasSame(otherDT, 'day'); //~> true if otherDT is in the same current calendar day
   * @return {boolean}
   */
  hasSame(otherDateTime, unit, opts) {
    if (!this.isValid) return false;
    const inputMs = otherDateTime.valueOf();
    const adjustedToZone = this.setZone(otherDateTime.zone, { keepLocalTime: true });
    return adjustedToZone.startOf(unit, opts) <= inputMs && inputMs <= adjustedToZone.endOf(unit, opts);
  }
  /**
   * Equality check
   * Two DateTimes are equal if and only if they represent the same millisecond, have the same zone and location, and are both valid.
   * To compare just the millisecond values, use `+dt1 === +dt2`.
   * @param {DateTime} other - the other DateTime
   * @return {boolean}
   */
  equals(other) {
    return this.isValid && other.isValid && this.valueOf() === other.valueOf() && this.zone.equals(other.zone) && this.loc.equals(other.loc);
  }
  /**
   * Returns a string representation of a this time relative to now, such as "in two days". Can only internationalize if your
   * platform supports Intl.RelativeTimeFormat. Rounds down by default.
   * @param {Object} options - options that affect the output
   * @param {DateTime} [options.base=DateTime.now()] - the DateTime to use as the basis to which this time is compared. Defaults to now.
   * @param {string} [options.style="long"] - the style of units, must be "long", "short", or "narrow"
   * @param {string|string[]} options.unit - use a specific unit or array of units; if omitted, or an array, the method will pick the best unit. Use an array or one of "years", "quarters", "months", "weeks", "days", "hours", "minutes", or "seconds"
   * @param {boolean} [options.round=true] - whether to round the numbers in the output.
   * @param {number} [options.padding=0] - padding in milliseconds. This allows you to round up the result if it fits inside the threshold. Don't use in combination with {round: false} because the decimal output will include the padding.
   * @param {string} options.locale - override the locale of this DateTime
   * @param {string} options.numberingSystem - override the numberingSystem of this DateTime. The Intl system may choose not to honor this
   * @example DateTime.now().plus({ days: 1 }).toRelative() //=> "in 1 day"
   * @example DateTime.now().setLocale("es").toRelative({ days: 1 }) //=> "dentro de 1 día"
   * @example DateTime.now().plus({ days: 1 }).toRelative({ locale: "fr" }) //=> "dans 23 heures"
   * @example DateTime.now().minus({ days: 2 }).toRelative() //=> "2 days ago"
   * @example DateTime.now().minus({ days: 2 }).toRelative({ unit: "hours" }) //=> "48 hours ago"
   * @example DateTime.now().minus({ hours: 36 }).toRelative({ round: false }) //=> "1.5 days ago"
   */
  toRelative(options = {}) {
    if (!this.isValid) return null;
    const base = options.base || DateTime.fromObject({}, { zone: this.zone }), padding = options.padding ? this < base ? -options.padding : options.padding : 0;
    let units = ["years", "months", "days", "hours", "minutes", "seconds"];
    let unit = options.unit;
    if (Array.isArray(options.unit)) {
      units = options.unit;
      unit = void 0;
    }
    return diffRelative(base, this.plus(padding), {
      ...options,
      numeric: "always",
      units,
      unit
    });
  }
  /**
   * Returns a string representation of this date relative to today, such as "yesterday" or "next month".
   * Only internationalizes on platforms that supports Intl.RelativeTimeFormat.
   * @param {Object} options - options that affect the output
   * @param {DateTime} [options.base=DateTime.now()] - the DateTime to use as the basis to which this time is compared. Defaults to now.
   * @param {string} options.locale - override the locale of this DateTime
   * @param {string} options.unit - use a specific unit; if omitted, the method will pick the unit. Use one of "years", "quarters", "months", "weeks", or "days"
   * @param {string} options.numberingSystem - override the numberingSystem of this DateTime. The Intl system may choose not to honor this
   * @example DateTime.now().plus({ days: 1 }).toRelativeCalendar() //=> "tomorrow"
   * @example DateTime.now().setLocale("es").plus({ days: 1 }).toRelative() //=> ""mañana"
   * @example DateTime.now().plus({ days: 1 }).toRelativeCalendar({ locale: "fr" }) //=> "demain"
   * @example DateTime.now().minus({ days: 2 }).toRelativeCalendar() //=> "2 days ago"
   */
  toRelativeCalendar(options = {}) {
    if (!this.isValid) return null;
    return diffRelative(options.base || DateTime.fromObject({}, { zone: this.zone }), this, {
      ...options,
      numeric: "auto",
      units: ["years", "months", "days"],
      calendary: true
    });
  }
  /**
   * Return the min of several date times
   * @param {...DateTime} dateTimes - the DateTimes from which to choose the minimum
   * @return {DateTime} the min DateTime, or undefined if called with no argument
   */
  static min(...dateTimes) {
    if (!dateTimes.every(DateTime.isDateTime)) {
      throw new InvalidArgumentError("min requires all arguments be DateTimes");
    }
    return bestBy(dateTimes, (i) => i.valueOf(), Math.min);
  }
  /**
   * Return the max of several date times
   * @param {...DateTime} dateTimes - the DateTimes from which to choose the maximum
   * @return {DateTime} the max DateTime, or undefined if called with no argument
   */
  static max(...dateTimes) {
    if (!dateTimes.every(DateTime.isDateTime)) {
      throw new InvalidArgumentError("max requires all arguments be DateTimes");
    }
    return bestBy(dateTimes, (i) => i.valueOf(), Math.max);
  }
  // MISC
  /**
   * Explain how a string would be parsed by fromFormat()
   * @param {string} text - the string to parse
   * @param {string} fmt - the format the string is expected to be in (see description)
   * @param {Object} options - options taken by fromFormat()
   * @return {Object}
   */
  static fromFormatExplain(text, fmt, options = {}) {
    const { locale = null, numberingSystem = null } = options, localeToUse = Locale.fromOpts({
      locale,
      numberingSystem,
      defaultToEN: true
    });
    return explainFromTokens(localeToUse, text, fmt);
  }
  /**
   * @deprecated use fromFormatExplain instead
   */
  static fromStringExplain(text, fmt, options = {}) {
    return DateTime.fromFormatExplain(text, fmt, options);
  }
  // FORMAT PRESETS
  /**
   * {@link DateTime#toLocaleString} format like 10/14/1983
   * @type {Object}
   */
  static get DATE_SHORT() {
    return DATE_SHORT;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Oct 14, 1983'
   * @type {Object}
   */
  static get DATE_MED() {
    return DATE_MED;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Fri, Oct 14, 1983'
   * @type {Object}
   */
  static get DATE_MED_WITH_WEEKDAY() {
    return DATE_MED_WITH_WEEKDAY;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'October 14, 1983'
   * @type {Object}
   */
  static get DATE_FULL() {
    return DATE_FULL;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Tuesday, October 14, 1983'
   * @type {Object}
   */
  static get DATE_HUGE() {
    return DATE_HUGE;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get TIME_SIMPLE() {
    return TIME_SIMPLE;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get TIME_WITH_SECONDS() {
    return TIME_WITH_SECONDS;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23 AM EDT'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get TIME_WITH_SHORT_OFFSET() {
    return TIME_WITH_SHORT_OFFSET;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23 AM Eastern Daylight Time'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get TIME_WITH_LONG_OFFSET() {
    return TIME_WITH_LONG_OFFSET;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30', always 24-hour.
   * @type {Object}
   */
  static get TIME_24_SIMPLE() {
    return TIME_24_SIMPLE;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23', always 24-hour.
   * @type {Object}
   */
  static get TIME_24_WITH_SECONDS() {
    return TIME_24_WITH_SECONDS;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23 EDT', always 24-hour.
   * @type {Object}
   */
  static get TIME_24_WITH_SHORT_OFFSET() {
    return TIME_24_WITH_SHORT_OFFSET;
  }
  /**
   * {@link DateTime#toLocaleString} format like '09:30:23 Eastern Daylight Time', always 24-hour.
   * @type {Object}
   */
  static get TIME_24_WITH_LONG_OFFSET() {
    return TIME_24_WITH_LONG_OFFSET;
  }
  /**
   * {@link DateTime#toLocaleString} format like '10/14/1983, 9:30 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_SHORT() {
    return DATETIME_SHORT;
  }
  /**
   * {@link DateTime#toLocaleString} format like '10/14/1983, 9:30:33 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_SHORT_WITH_SECONDS() {
    return DATETIME_SHORT_WITH_SECONDS;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Oct 14, 1983, 9:30 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_MED() {
    return DATETIME_MED;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Oct 14, 1983, 9:30:33 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_MED_WITH_SECONDS() {
    return DATETIME_MED_WITH_SECONDS;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Fri, 14 Oct 1983, 9:30 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_MED_WITH_WEEKDAY() {
    return DATETIME_MED_WITH_WEEKDAY;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'October 14, 1983, 9:30 AM EDT'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_FULL() {
    return DATETIME_FULL;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'October 14, 1983, 9:30:33 AM EDT'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_FULL_WITH_SECONDS() {
    return DATETIME_FULL_WITH_SECONDS;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Friday, October 14, 1983, 9:30 AM Eastern Daylight Time'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_HUGE() {
    return DATETIME_HUGE;
  }
  /**
   * {@link DateTime#toLocaleString} format like 'Friday, October 14, 1983, 9:30:33 AM Eastern Daylight Time'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_HUGE_WITH_SECONDS() {
    return DATETIME_HUGE_WITH_SECONDS;
  }
}
function friendlyDateTime(dateTimeish) {
  if (DateTime.isDateTime(dateTimeish)) {
    return dateTimeish;
  } else if (dateTimeish && dateTimeish.valueOf && isNumber(dateTimeish.valueOf())) {
    return DateTime.fromJSDate(dateTimeish);
  } else if (dateTimeish && typeof dateTimeish === "object") {
    return DateTime.fromObject(dateTimeish);
  } else {
    throw new InvalidArgumentError(
      `Unknown datetime argument: ${dateTimeish}, of type ${typeof dateTimeish}`
    );
  }
}
const initialStepAllgemeineAngabenState = {
  antragstellende: null,
  pseudonym: {
    ET1: "",
    ET2: ""
  },
  alleinerziehend: null,
  mutterschaftssleistungen: null,
  mutterschaftssleistungenWer: null
};
const stepAllgemeineAngabenSlice = createSlice({
  name: "stepAllgemeineAngaben",
  initialState: initialStepAllgemeineAngabenState,
  reducers: {
    submitStep: (_, action) => {
      const alleinerziehend = action.payload.antragstellende === "FuerBeide" ? null : action.payload.alleinerziehend;
      return {
        ...action.payload,
        alleinerziehend
      };
    }
  }
});
const getAntragssteller = (state) => state.stepAllgemeineAngaben.antragstellende;
const getElternteilNames = createSelector(
  (state) => state.stepAllgemeineAngaben.pseudonym.ET1,
  (state) => state.stepAllgemeineAngaben.pseudonym.ET2,
  (pseudonymElternteil1, pseudonymElternteil2) => {
    return {
      ET1: pseudonymElternteil1 || "Elternteil 1",
      ET2: pseudonymElternteil2 || "Elternteil 2"
    };
  }
);
const getAlleinerziehend = (state) => state.stepAllgemeineAngaben.alleinerziehend;
const stepAllgemeineAngabenActions = stepAllgemeineAngabenSlice.actions;
const stepAllgemeineAngabenReducer = stepAllgemeineAngabenSlice.reducer;
const stepAllgemeineAngabenSelectors = {
  getAntragssteller,
  getElternteilNames,
  getAlleinerziehend
};
const numberOfLebensmonate = 32;
const maxNumberOfPartnerschaftbonus = 4;
const minNumberOfElterngeld = 2;
const maxNumberOfSimultaneousBEGMonths = 1;
const lebensmonate = Array.from({
  length: numberOfLebensmonate
}).map(() => ({}));
const getLebensmonate = (geburtstag) => {
  if (!geburtstag) {
    return lebensmonate;
  }
  return lebensmonate.map((_, index) => {
    const fromDate = DateTime.fromJSDate(geburtstag).plus({ months: index }).startOf("day");
    const toDate = fromDate.plus({ months: 1 }).minus({ day: 1 }).endOf("day");
    return {
      from: fromDate.toISO({ includeOffset: false }),
      to: toDate.toISO({ includeOffset: false })
    };
  });
};
const hasMutterschutzSettings = (settings) => {
  return "mutterschutz" in settings;
};
const hasPartnerMonateSettings = (settings) => {
  return "partnerMonate" in settings;
};
const hasGeburtstagSettings = (settings) => {
  return "geburtstag" in settings;
};
const getGeburtstagSettings = (settings) => settings && hasGeburtstagSettings(settings) ? settings.geburtstag : void 0;
const getPartnerMonateSettings = (settings) => settings && hasPartnerMonateSettings(settings) ? settings.partnerMonate : false;
const getFruehchen = (geburtstag) => {
  const weeks = DateTime.fromISO(geburtstag.errechnet).diff(DateTime.fromISO(geburtstag.geburt)).as("weeks");
  if (weeks >= 16) {
    return "16Weeks";
  }
  if (weeks >= 12) {
    return "12Weeks";
  }
  if (weeks >= 8) {
    return "8Weeks";
  }
  if (weeks >= 6) {
    return "6Weeks";
  }
  return "NotAFruehchen";
};
const getBEGAnspruch = (geburtstag) => {
  if (!geburtstag) {
    return 12;
  }
  switch (getFruehchen(geburtstag)) {
    case "16Weeks":
      return 16;
    case "12Weeks":
      return 15;
    case "8Weeks":
      return 14;
    case "6Weeks":
      return 13;
    case "NotAFruehchen":
      return 12;
  }
};
const getNumberOfMutterschutzMonths = (geburtstag, mutterschutzEndDate) => {
  return Math.ceil(
    DateTime.fromISO(mutterschutzEndDate).diff(DateTime.fromISO(geburtstag.geburt)).as("months")
  );
};
const createElternteile = (settings) => {
  const emptyMonth = {
    type: "None",
    isMutterschutzMonth: false
  };
  const emptyMonths = Array.from({
    length: numberOfLebensmonate
  }).fill(emptyMonth);
  let begAnspruch = getBEGAnspruch(getGeburtstagSettings(settings));
  let elternteil1 = { months: emptyMonths };
  let elternteil2 = elternteil1;
  if (settings && hasMutterschutzSettings(settings)) {
    const { elternteil, endDate } = settings.mutterschutz;
    const numberOfMutterschutzMonths2 = getNumberOfMutterschutzMonths(
      settings.geburtstag,
      endDate
    );
    const months2 = emptyMonths.map((month, index) => {
      if (index < numberOfMutterschutzMonths2) {
        return { ...month, type: "BEG", isMutterschutzMonth: true };
      }
      return month;
    });
    switch (elternteil) {
      case "ET1":
        elternteil1 = { months: months2 };
        break;
      case "ET2":
        elternteil2 = { months: months2 };
        break;
    }
    begAnspruch -= numberOfMutterschutzMonths2;
  }
  let partnerschaftsbonus = maxNumberOfPartnerschaftbonus;
  if (getPartnerMonateSettings(settings)) {
    begAnspruch = begAnspruch + 2;
  } else {
    partnerschaftsbonus = 0;
  }
  return {
    remainingMonths: {
      basiselterngeld: begAnspruch,
      elterngeldplus: begAnspruch * 2,
      partnerschaftsbonus
    },
    ET1: elternteil1,
    ET2: elternteil2
  };
};
const getModifiablePSBMonthIndices = (months2, remainingMonthsPSB) => {
  const currentPSBIndices = months2.flatMap(
    (month, index) => month.type === "PSB" ? [index] : []
  );
  if (currentPSBIndices.length === 0) {
    return {
      selectableIndices: months2.map((_, index) => index),
      deselectableIndices: []
    };
  }
  const lowestIndex = currentPSBIndices[0];
  const highestIndex = currentPSBIndices[currentPSBIndices.length - 1];
  if (remainingMonthsPSB > 0) {
    return {
      selectableIndices: [lowestIndex - 1, highestIndex + 1],
      deselectableIndices: [lowestIndex, highestIndex]
    };
  } else {
    return {
      selectableIndices: [],
      deselectableIndices: [lowestIndex, highestIndex]
    };
  }
};
const lastIndexOfType = (months2, ...types) => {
  return months2.reduceRight((lastIndex, month, index) => {
    if (lastIndex === -1 && types.includes(month.type)) {
      return index;
    }
    return lastIndex;
  }, -1);
};
const countMonthsByType = (type) => (months2) => {
  return months2.filter((month) => month.type === type).length;
};
const countBEGMonths = countMonthsByType("BEG");
const countEGPlusMonths = countMonthsByType("EG+");
const countPSBMonths = countMonthsByType("PSB");
const countFilledMonths = (months2) => {
  return months2.filter((month) => month.type !== "None").length;
};
const hasContinuousMonthsOfType = (months2, startIndex, ...types) => {
  const endIndex = lastIndexOfType(months2, ...types);
  return !months2.slice(startIndex, endIndex + 1).some((month) => !types.includes(month.type));
};
const calculateBEGAnspruch = (currentElternteilMonths, otherElternteilMonths, partnerMonate, geburtstag) => {
  let anspruch = getBEGAnspruch(geburtstag);
  if (partnerMonate) {
    anspruch += 2;
  }
  return anspruch;
};
const roundUp = (x2) => Math.ceil(x2 / 2);
const canNotBeChangedDueToMutterschutz = ({ elternteil, monthIndex, targetType }, settings) => {
  return hasMutterschutzSettings(settings) && (settings.mutterschutz.elternteil === elternteil || targetType === "PSB") && monthIndex < getNumberOfMutterschutzMonths(
    settings.geburtstag,
    settings.mutterschutz.endDate
  );
};
const canNotBeChangedDueToUnmodifiablePSB = ({ elternteil, monthIndex, targetType }, elternteile) => {
  const currentType = elternteile[elternteil].months[monthIndex].type;
  const { selectableIndices, deselectableIndices } = getModifiablePSBMonthIndices(
    elternteile[elternteil].months,
    elternteile.remainingMonths.partnerschaftsbonus
  );
  return targetType === "PSB" && !selectableIndices.includes(monthIndex) || targetType === "None" && currentType === "PSB" && !deselectableIndices.includes(monthIndex);
};
function canNotChangePSBBecauseNoPartnerMonths({ targetType }, elternteileSettings) {
  return targetType === "PSB" && !!elternteileSettings && !getPartnerMonateSettings(elternteileSettings);
}
function choosingASimultaneousBEGMonth(changeMonthSettings, elternteile) {
  const { targetType, elternteil, monthIndex } = changeMonthSettings;
  const choosingBEG = targetType === "BEG";
  const otherParent = elternteil === "ET1" ? elternteile.ET2 : elternteile.ET1;
  const otherParentChoseBEGForSameMonth = otherParent.months[monthIndex].type === "BEG";
  return choosingBEG && otherParentChoseBEGForSameMonth;
}
function isExceptionToSimulatenousMonthRestrictions(elternteileSettings) {
  if (elternteileSettings) {
    const { mehrlinge, behindertesGeschwisterkind } = elternteileSettings;
    return mehrlinge || behindertesGeschwisterkind;
  } else {
    return false;
  }
}
function reachedLimitOfSimultaneousBEGMonths(elternteile) {
  const typesET1 = elternteile.ET1.months.map(({ type }) => type);
  const typesET2 = elternteile.ET2.months.map(({ type }) => type);
  const typePairs = typesET1.map((type, index) => [type, typesET2[index]]);
  const numberOfSimultanuousMonths = typePairs.filter(
    ([a, b]) => a === "BEG" && b === "BEG"
  ).length;
  return numberOfSimultanuousMonths >= maxNumberOfSimultaneousBEGMonths;
}
function canNotChangeBEGDueToSimultaneousMonthRules(changeMonthSettings, elternteile, elternteileSettings) {
  if (!choosingASimultaneousBEGMonth(changeMonthSettings, elternteile) || isExceptionToSimulatenousMonthRestrictions(elternteileSettings)) {
    return false;
  }
  const choosingAfterTheTwelveMonth = changeMonthSettings.monthIndex >= 12;
  const reachedLimit = reachedLimitOfSimultaneousBEGMonths(elternteile);
  return choosingAfterTheTwelveMonth || reachedLimit;
}
function canNotChangeBEGDueToLimitReachedPerParent(changeMonthSettings, elternteile, elternteileSettings) {
  const choosingBEGMonth = changeMonthSettings.targetType === "BEG";
  const limit = limitOfMonthsPerParentAsEgp(elternteileSettings);
  const months2 = elternteile[changeMonthSettings.elternteil].months;
  const numberOfTakenMonths = getCombinedNumberOfMonthsAsEGP(months2);
  const isLimitReached = limit - numberOfTakenMonths < BEG_TO_EGP_RATIO;
  return choosingBEGMonth && isLimitReached;
}
function canNotChangeEGPDueToLimitReachedPerParent(changeMonthSettings, elternteile, elternteileSettings) {
  const choosingEGPMonth = changeMonthSettings.targetType === "EG+";
  const limit = limitOfMonthsPerParentAsEgp(elternteileSettings);
  const months2 = elternteile[changeMonthSettings.elternteil].months;
  const numberOfTakenMonths = getCombinedNumberOfMonthsAsEGP(months2);
  const isLimitReached = limit - numberOfTakenMonths < 1;
  return choosingEGPMonth && isLimitReached;
}
function canNotChangeDueToLimitReachedPerParent(changeMonthSettings, elternteile, elternteileSettings) {
  const hasReachedBegLimit = canNotChangeBEGDueToLimitReachedPerParent(
    changeMonthSettings,
    elternteile,
    elternteileSettings
  );
  const hasReachedEgpLimit = canNotChangeEGPDueToLimitReachedPerParent(
    changeMonthSettings,
    elternteile,
    elternteileSettings
  );
  return hasReachedBegLimit || hasReachedEgpLimit;
}
const replaceMonthAtIndex = (replacement, monthIndex, months2) => {
  const modifiedMonths = [...months2];
  modifiedMonths[monthIndex] = replacement;
  return modifiedMonths;
};
const changeMonth = (elternteile, changeMonthSettings, elternteileSettings) => {
  const { elternteil, monthIndex, targetType } = changeMonthSettings;
  const otherETKey = elternteil === "ET1" ? "ET2" : "ET1";
  const currentET = elternteile[elternteil];
  const otherET = elternteile[otherETKey];
  const currentType = currentET.months[monthIndex].type;
  if (currentET.months[monthIndex].type === targetType) {
    return elternteile;
  }
  if (elternteileSettings && canNotBeChangedDueToMutterschutz(changeMonthSettings, elternteileSettings)) {
    return elternteile;
  }
  if (canNotBeChangedDueToUnmodifiablePSB(changeMonthSettings, elternteile)) {
    return elternteile;
  }
  if (canNotChangePSBBecauseNoPartnerMonths(
    changeMonthSettings,
    elternteileSettings
  )) {
    return elternteile;
  }
  if (canNotChangeBEGDueToSimultaneousMonthRules(
    changeMonthSettings,
    elternteile,
    elternteileSettings
  )) {
    return elternteile;
  }
  if (canNotChangeDueToLimitReachedPerParent(
    changeMonthSettings,
    elternteile,
    elternteileSettings
  )) {
    return elternteile;
  }
  let currentMonths = replaceMonthAtIndex(
    { type: targetType, isMutterschutzMonth: false },
    monthIndex,
    currentET.months
  );
  let otherMonths = otherET.months;
  if (currentET.months[monthIndex].type === "PSB") {
    otherMonths = replaceMonthAtIndex(
      { type: "None", isMutterschutzMonth: false },
      monthIndex,
      otherMonths
    );
  }
  if (targetType === "PSB") {
    otherMonths = replaceMonthAtIndex(
      { type: targetType, isMutterschutzMonth: false },
      monthIndex,
      otherMonths
    );
    const hasAtLeastOnePSBMonth = currentET.months.some(
      (month) => month.type === "PSB"
    );
    if (!hasAtLeastOnePSBMonth) {
      const isLastMonthIndex = monthIndex === currentET.months.length - 1;
      const automaticallySelectedPSBMonthIndex = isLastMonthIndex ? monthIndex - 1 : monthIndex + 1;
      otherMonths = replaceMonthAtIndex(
        { type: targetType, isMutterschutzMonth: false },
        automaticallySelectedPSBMonthIndex,
        otherMonths
      );
      currentMonths = replaceMonthAtIndex(
        { type: targetType, isMutterschutzMonth: false },
        automaticallySelectedPSBMonthIndex,
        currentMonths
      );
    }
  }
  if (targetType === "None" && currentType === "PSB") {
    const existingPSBIndices = currentMonths.flatMap(
      (month, index) => month.type === "PSB" && index !== monthIndex ? [index] : []
    );
    if (existingPSBIndices.length === 1) {
      const existingPSBIndex = existingPSBIndices[0];
      otherMonths = replaceMonthAtIndex(
        { type: targetType, isMutterschutzMonth: false },
        existingPSBIndex,
        otherMonths
      );
      currentMonths = replaceMonthAtIndex(
        { type: targetType, isMutterschutzMonth: false },
        existingPSBIndex,
        currentMonths
      );
    }
  }
  const anspruch = calculateBEGAnspruch(
    currentMonths,
    otherMonths,
    getPartnerMonateSettings(elternteileSettings),
    getGeburtstagSettings(elternteileSettings)
  );
  const begMonthsTakenByBoth = countBEGMonths(currentMonths) + countBEGMonths(otherMonths);
  const egPlusMonthsTakenByBoth = countEGPlusMonths(currentMonths) + countEGPlusMonths(otherMonths);
  let remainingMonthsBEG = anspruch - begMonthsTakenByBoth;
  if (remainingMonthsBEG > 0) {
    remainingMonthsBEG = Math.max(
      0,
      remainingMonthsBEG - roundUp(egPlusMonthsTakenByBoth)
    );
  }
  const remainingMonthsEGPlus = 2 * (anspruch - begMonthsTakenByBoth) - egPlusMonthsTakenByBoth;
  const remainingPartnerschaftsbonus = maxNumberOfPartnerschaftbonus - countPSBMonths(currentMonths);
  const changedCurrentET = {
    ...currentET,
    months: currentMonths
  };
  const changedOtherET = {
    ...otherET,
    months: otherMonths
  };
  return {
    ...elternteile,
    remainingMonths: {
      basiselterngeld: remainingMonthsBEG,
      elterngeldplus: remainingMonthsEGPlus,
      partnerschaftsbonus: remainingPartnerschaftsbonus
    },
    [elternteil]: changedCurrentET,
    [otherETKey]: changedOtherET
  };
};
function limitOfMonthsPerParentAsEgp(settings) {
  return (settings == null ? void 0 : settings.alleinerziehend) ? 28 : 24;
}
function getCombinedNumberOfMonthsAsEGP(months2) {
  const begMonthCount = months2.filter(isBEGMonth).length;
  const egpMonthCount = months2.filter(isEGPMonth).length;
  const begAsEgpMonthCount = begMonthCount * BEG_TO_EGP_RATIO;
  return begAsEgpMonthCount + egpMonthCount;
}
function isBEGMonth(month) {
  return month.type === "BEG";
}
function isEGPMonth(month) {
  return month.type === "EG+";
}
const BEG_TO_EGP_RATIO = 2;
const initialStepNachwuchsState = {
  anzahlKuenftigerKinder: 0,
  wahrscheinlichesGeburtsDatum: "",
  geschwisterkinder: [],
  mutterschaftssleistungen: YesNo.NO
};
const stepNachwuchsSlice = createSlice({
  name: "stepNachwuchs",
  initialState: initialStepNachwuchsState,
  reducers: {
    submitStep: (_, { payload }) => {
      const filteredEmptyGeschwisterkinder = payload.geschwisterkinder.filter(
        (value) => value.geburtsdatum !== ""
      );
      return {
        ...payload,
        geschwisterkinder: filteredEmptyGeschwisterkinder
      };
    }
  },
  extraReducers: (builder) => {
    builder.addCase(
      stepAllgemeineAngabenActions.submitStep,
      (state, { payload }) => {
        if (payload.mutterschaftssleistungen === YesNo.YES) {
          state.mutterschaftssleistungen = YesNo.YES;
        } else {
          state.mutterschaftssleistungen = YesNo.NO;
        }
      }
    );
  }
});
const getWahrscheinlichesGeburtsDatum = createSelector(
  (state) => state.stepNachwuchs.wahrscheinlichesGeburtsDatum,
  (wahrscheinlichesGeburtsDatum) => parseGermanDateString(wahrscheinlichesGeburtsDatum)
);
const getLebensmonateAfterBirth = createSelector(
  getWahrscheinlichesGeburtsDatum,
  (wahrscheinlichesGeburtsDatum) => {
    const lebensmonate2 = getLebensmonate(wahrscheinlichesGeburtsDatum);
    return lebensmonate2.map((month) => ({
      monthIsoString: month.from,
      labelShort: new Date(month.from).toLocaleDateString("de-DE", {
        month: "short"
      }),
      labelLong: new Date(month.from).toLocaleDateString("de-DE", {
        month: "long"
      })
    }));
  }
);
const stepNachwuchsSelectors = {
  getWahrscheinlichesGeburtsDatum,
  getLebensmonateAfterBirth
};
const stepNachwuchsActions = stepNachwuchsSlice.actions;
const stepNachwuchsReducer = stepNachwuchsSlice.reducer;
const initialStepErwerbstaetigkeitElternteil = {
  vorGeburt: null,
  isNichtSelbststaendig: false,
  isSelbststaendig: false,
  mehrereTaetigkeiten: YesNo.NO,
  sozialVersicherungsPflichtig: null,
  monatlichesBrutto: null
};
const initialStepErwerbstaetigkeitState = {
  ET1: initialStepErwerbstaetigkeitElternteil,
  ET2: initialStepErwerbstaetigkeitElternteil
};
const stepErwerbstaetigkeitSlice = createSlice({
  name: "stepErwerbstaetigkeit",
  initialState: initialStepErwerbstaetigkeitState,
  reducers: {
    submitStep: (_, action) => {
      return action.payload;
    }
  }
});
const isErwerbstaetigVorGeburt = (state) => {
  return state.vorGeburt === YesNo.YES;
};
const hasAnyTypeOfSelbstaendigkeit = (state) => state.vorGeburt === YesNo.YES && state.isSelbststaendig;
const isOnlyErwerbstaetig = (state) => {
  return state.vorGeburt === YesNo.YES && state.isNichtSelbststaendig && !hasAnyTypeOfSelbstaendigkeit(state);
};
const isOnlySelbstaendig = (state) => {
  return state.vorGeburt === YesNo.YES && !state.isNichtSelbststaendig && hasAnyTypeOfSelbstaendigkeit(state);
};
const isSelbstaendigOrNoMiniJob = (state) => {
  return state.vorGeburt === YesNo.YES && (hasAnyTypeOfSelbstaendigkeit(state) || state.monatlichesBrutto !== "MiniJob");
};
const isSelbstaendigAndErwerbstaetig = (state) => {
  return state.vorGeburt === YesNo.YES && state.isNichtSelbststaendig && hasAnyTypeOfSelbstaendigkeit(state);
};
const stepErwerbstaetigkeitActions = stepErwerbstaetigkeitSlice.actions;
const stepErwerbstaetigkeitElternteilSelectors = {
  isErwerbstaetigVorGeburt,
  isOnlyErwerbstaetig,
  isOnlySelbstaendig,
  isSelbstaendigOrNoMiniJob,
  isSelbstaendigAndErwerbstaetig
};
const stepErwerbstaetigkeitReducer = stepErwerbstaetigkeitSlice.reducer;
const erwerbsTaetigkeitVorGeburtOf = (state, elternteil) => {
  const erwerbsTaetigkeit = state.stepErwerbstaetigkeit[elternteil];
  if (erwerbsTaetigkeit.vorGeburt === null || erwerbsTaetigkeit.vorGeburt === YesNo.NO) {
    return ErwerbsArt.NEIN;
  }
  const onlySelbstaendig = stepErwerbstaetigkeitElternteilSelectors.isOnlySelbstaendig(
    erwerbsTaetigkeit
  );
  if (onlySelbstaendig) {
    return ErwerbsArt.JA_SELBSTSTAENDIG;
  }
  const isMischeinkommen = stepErwerbstaetigkeitElternteilSelectors.isSelbstaendigAndErwerbstaetig(
    erwerbsTaetigkeit
  );
  const mehrereEinkommen = erwerbsTaetigkeit.mehrereTaetigkeiten === YesNo.YES;
  if (isMischeinkommen || mehrereEinkommen) {
    return ErwerbsArt.JA_MISCHEINKOMMEN;
  }
  if (erwerbsTaetigkeit.monatlichesBrutto === "MiniJob") {
    return ErwerbsArt.JA_NICHT_SELBST_MINI;
  }
  return erwerbsTaetigkeit.sozialVersicherungsPflichtig === YesNo.YES ? ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI : ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI;
};
const dateOf = (date) => {
  const [day, month, year] = date.split(".");
  const dateTime = DateTime.fromISO(`${year}-${month}-${day}`);
  return dateTime.toJSDate();
};
const persoenlicheDatenOfUi = (state, elternteil, bruttoEinkommenZeitraum) => {
  const wahrscheinlichesGeburtsdatum = stepNachwuchsSelectors.getWahrscheinlichesGeburtsDatum(state);
  const persoenlicheDaten = new PersoenlicheDaten(wahrscheinlichesGeburtsdatum);
  persoenlicheDaten.anzahlKuenftigerKinder = state.stepNachwuchs.anzahlKuenftigerKinder;
  persoenlicheDaten.sindSieAlleinerziehend = state.stepAllgemeineAngaben.alleinerziehend ?? YesNo.NO;
  persoenlicheDaten.etVorGeburt = erwerbsTaetigkeitVorGeburtOf(
    state,
    elternteil
  );
  persoenlicheDaten.etNachGeburt = bruttoEinkommenZeitraum.length > 0 ? YesNo.YES : YesNo.NO;
  const kuenftigeKinder = Array.from(
    { length: state.stepNachwuchs.anzahlKuenftigerKinder },
    (_, index) => ({
      nummer: index + 1,
      geburtsdatum: void 0,
      istBehindert: false
    })
  );
  const geschwisterKinder = state.stepNachwuchs.geschwisterkinder.map(
    (kind, index) => ({
      nummer: index + 1 + state.stepNachwuchs.anzahlKuenftigerKinder,
      geburtsdatum: dateOf(kind.geburtsdatum),
      istBehindert: kind.istBehindert
    })
  );
  persoenlicheDaten.kinder = [...kuenftigeKinder, ...geschwisterKinder];
  return persoenlicheDaten;
};
const averageFromAverageOrMonthly = (averageOrMonthly) => {
  switch (averageOrMonthly.type) {
    case "average":
      return averageOrMonthly.average ?? 0;
    case "monthly":
      return averageOrMonthly.perMonth.map((value) => value ?? 0).reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      ) / averageOrMonthly.perMonth.length;
    case "yearly":
      return (averageOrMonthly.perYear ?? 0) / 12;
  }
  throw new Error("Unknown AverageOrMonthlyState Type.");
};
const ANZAHL_MONATE_PRO_JAHR$1 = 12;
const mischEinkommenTaetigkeitenOf = (taetigkeiten) => taetigkeiten.map((taetigkeit) => {
  const mischEinkommenTaetigkeiten = new MischEkTaetigkeit();
  if (taetigkeit.artTaetigkeit === "Selbststaendig") {
    mischEinkommenTaetigkeiten.erwerbsTaetigkeit = ErwerbsTaetigkeit.SELBSTSTAENDIG;
  }
  if (taetigkeit.isMinijob === YesNo.YES) {
    mischEinkommenTaetigkeiten.erwerbsTaetigkeit = ErwerbsTaetigkeit.MINIJOB;
  }
  mischEinkommenTaetigkeiten.bruttoEinkommenDurchschnitt = Big(
    taetigkeit.bruttoEinkommenDurchschnitt ?? MathUtil.BIG_ZERO
  );
  mischEinkommenTaetigkeiten.rentenVersicherungsPflichtig = taetigkeit.versicherungen.hasRentenversicherung ? YesNo.YES : YesNo.NO;
  mischEinkommenTaetigkeiten.krankenVersicherungsPflichtig = taetigkeit.versicherungen.hasKrankenversicherung ? YesNo.YES : YesNo.NO;
  mischEinkommenTaetigkeiten.arbeitslosenVersicherungsPflichtig = taetigkeit.versicherungen.hasArbeitslosenversicherung ? YesNo.YES : YesNo.NO;
  mischEinkommenTaetigkeiten.bemessungsZeitraumMonate = Array.from(
    { length: ANZAHL_MONATE_PRO_JAHR$1 },
    (_, monthIndex) => {
      const taetigkeitHasZeitraumIncludingThisMonth = taetigkeit.zeitraum.some(({ from, to }) => {
        const indexStart = Number.parseInt(from) - 1;
        const indexEnd = Number.parseInt(to) - 1;
        return monthIndex >= indexStart && monthIndex <= indexEnd;
      });
      return taetigkeitHasZeitraumIncludingThisMonth;
    }
  );
  return mischEinkommenTaetigkeiten;
}).filter((value) => value.getAnzahlBemessungsZeitraumMonate() > 0);
const erwerbsZeitraumLebensMonatListOf = (bruttoEinkommenZeitraumList) => bruttoEinkommenZeitraumList.map((bruttoEinkommenZeitraum) => {
  const erwerbsZeitraumLebensMonat = new ErwerbsZeitraumLebensMonat();
  erwerbsZeitraumLebensMonat.vonLebensMonat = Number.parseInt(
    bruttoEinkommenZeitraum.zeitraum.from
  );
  erwerbsZeitraumLebensMonat.bisLebensMonat = Number.parseInt(
    bruttoEinkommenZeitraum.zeitraum.to
  );
  const bruttoEinkommen = bruttoEinkommenZeitraum.bruttoEinkommen ?? 0;
  erwerbsZeitraumLebensMonat.bruttoProMonat = new Einkommen(bruttoEinkommen);
  return erwerbsZeitraumLebensMonat;
});
const finanzDatenOfUi = (state, elternteil, bruttoEinkommenZeitraumSanitized) => {
  const finanzDaten = new FinanzDaten();
  const stateErwerbsTaetigkeit = state.stepErwerbstaetigkeit[elternteil];
  const isOnlySelbstaendig2 = stepErwerbstaetigkeitElternteilSelectors.isOnlySelbstaendig(
    stateErwerbsTaetigkeit
  );
  const isSelbstaendigAndErwerbstaetig2 = stepErwerbstaetigkeitElternteilSelectors.isSelbstaendigAndErwerbstaetig(
    stateErwerbsTaetigkeit
  );
  const mehrereEinkommen = stateErwerbsTaetigkeit.mehrereTaetigkeiten === YesNo.YES;
  const isMiniJob = stateErwerbsTaetigkeit.monatlichesBrutto === "MiniJob";
  let bruttoEinkommenBeforeBirth = 0;
  if (stateErwerbsTaetigkeit.isNichtSelbststaendig && !isSelbstaendigAndErwerbstaetig2) {
    bruttoEinkommenBeforeBirth = averageFromAverageOrMonthly(
      state.stepEinkommen[elternteil].bruttoEinkommenNichtSelbstaendig
    );
  }
  if (isOnlySelbstaendig2 && !isMiniJob) {
    bruttoEinkommenBeforeBirth = averageFromAverageOrMonthly(
      state.stepEinkommen[elternteil].gewinnSelbstaendig
    );
  }
  finanzDaten.bruttoEinkommen = new Einkommen(bruttoEinkommenBeforeBirth);
  finanzDaten.zahlenSieKirchenSteuer = state.stepEinkommen[elternteil].zahlenSieKirchenSteuer ?? YesNo.NO;
  finanzDaten.kinderFreiBetrag = state.stepEinkommen[elternteil].kinderFreiBetrag ?? KinderFreiBetrag.ZKF0;
  finanzDaten.steuerKlasse = state.stepEinkommen[elternteil].steuerKlasse ?? SteuerKlasse.SKL_UNBEKANNT;
  finanzDaten.kassenArt = state.stepEinkommen[elternteil].kassenArt ?? KassenArt.GESETZLICH_PFLICHTVERSICHERT;
  finanzDaten.rentenVersicherung = state.stepEinkommen[elternteil].rentenVersicherung ?? RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG;
  finanzDaten.splittingFaktor = state.stepEinkommen[elternteil].splittingFaktor ?? 1;
  if (isSelbstaendigAndErwerbstaetig2 || mehrereEinkommen) {
    finanzDaten.mischEinkommenTaetigkeiten = mischEinkommenTaetigkeitenOf(
      state.stepEinkommen[elternteil].taetigkeitenNichtSelbstaendigUndSelbstaendig
    );
  }
  finanzDaten.erwerbsZeitraumLebensMonatList = erwerbsZeitraumLebensMonatListOf(
    bruttoEinkommenZeitraumSanitized
  );
  return finanzDaten;
};
class AbstractAlgorithmus {
  ersatzrate_eg(ek_vor_copy) {
    const ek_vor = ek_vor_copy;
    const ersatzrate1 = EgrBerechnungParamId.ERSATZRATE1;
    const ersatzrate2 = EgrBerechnungParamId.ERSATZRATE2;
    const grenze1 = EgrBerechnungParamId.GRENZE1;
    const grenze2 = EgrBerechnungParamId.GRENZE2;
    const grenze3 = EgrBerechnungParamId.GRENZE3;
    let ersatzrate_eg = ersatzrate1;
    if (ek_vor.gt(grenze1)) {
      ersatzrate_eg = ersatzrate2;
    }
    if (ek_vor.gt(grenze2) && ek_vor.lte(grenze1)) {
      let y2 = ek_vor.sub(grenze2);
      y2 = y2.div(Big(2));
      y2 = MathUtil.floor(y2);
      y2 = y2.mul(Big(1e-3));
      ersatzrate_eg = ersatzrate1.sub(y2);
    }
    if (ek_vor.lt(grenze3)) {
      let y2 = grenze3.sub(ek_vor);
      y2 = y2.div(Big(2));
      y2 = MathUtil.floor(y2);
      y2 = y2.mul(Big(1e-3));
      ersatzrate_eg = ersatzrate1.add(y2);
      ersatzrate_eg = MathUtil.fMin(ersatzrate_eg, MathUtil.BIG_ONE);
    }
    return ersatzrate_eg;
  }
  /**
   * Suche das Geburtsdatum des jüngsten Kindes.
   *
   * @param kindList Eine Liste von {@link Kind}.
   * @return Das {@link Date} des jüngsten Kindes oder undefined, wenn die Liste leer ist.
   */
  fktMax(kindList) {
    var _a;
    return (_a = KindUtil.findLastBornChild(kindList)) == null ? void 0 : _a.geburtsdatum;
  }
  /**
   * Suche das Geburtsdatum des zweitjüngsten Kindes.
   *
   * @param kindList Eine Liste von {@link Kind}.
   * @return Das {@link Date} des zweitjüngsten Kindes oder undefined, wenn die Liste leer ist oder nur ein Kind enthält.
   */
  fktZweitMax(kindList) {
    var _a;
    return (_a = KindUtil.findSecondLastBornChild(kindList)) == null ? void 0 : _a.geburtsdatum;
  }
  elterngeld_keine_et(ekVor) {
    let ersatzrate = EgrBerechnungParamId.ERSATZRATE1;
    let elterngeld_keine_et = ekVor.mul(ersatzrate);
    if (ekVor.gt(EgrBerechnungParamId.GRENZE1)) {
      elterngeld_keine_et = MathUtil.fMin(
        EgrBerechnungParamId.ERSATZRATE2.mul(ekVor),
        EgrBerechnungParamId.HOECHSTSATZ
      );
    }
    if (ekVor.gt(EgrBerechnungParamId.GRENZE2) && ekVor.lte(EgrBerechnungParamId.GRENZE1)) {
      ersatzrate = EgrBerechnungParamId.ERSATZRATE1.sub(
        MathUtil.floor(
          ekVor.sub(EgrBerechnungParamId.GRENZE2).div(Big(2))
        ).mul(Big(1e-3))
      );
      elterngeld_keine_et = ekVor.mul(ersatzrate);
    }
    if (ekVor.lt(EgrBerechnungParamId.GRENZE3)) {
      ersatzrate = EgrBerechnungParamId.ERSATZRATE1.add(
        MathUtil.floor(EgrBerechnungParamId.GRENZE3.sub(ekVor).div(Big(2))).mul(
          Big(1e-3)
        )
      );
      ersatzrate = MathUtil.fMin(ersatzrate, Big(1));
      elterngeld_keine_et = ekVor.mul(ersatzrate);
    }
    elterngeld_keine_et = MathUtil.fMax(
      elterngeld_keine_et,
      EgrBerechnungParamId.MINDESTSATZ
    );
    return elterngeld_keine_et;
  }
  elterngeld_et(ekVor, ekNach) {
    let ersatzrate = MathUtil.BIG_ZERO;
    const ek_diff = MathUtil.fMax(
      MathUtil.fMin(ekVor, EgrBerechnungParamId.HOECHST_ET).sub(ekNach),
      MathUtil.BIG_ZERO
    );
    let elterngeld_et = ek_diff.mul(EgrBerechnungParamId.ERSATZRATE1);
    if (ekVor.gt(EgrBerechnungParamId.GRENZE1)) {
      elterngeld_et = MathUtil.fMin(
        EgrBerechnungParamId.ERSATZRATE2.mul(ek_diff),
        EgrBerechnungParamId.HOECHSTSATZ
      );
    }
    if (ekVor.gt(EgrBerechnungParamId.GRENZE2) && ekVor.lte(EgrBerechnungParamId.GRENZE1)) {
      ersatzrate = EgrBerechnungParamId.ERSATZRATE1.sub(
        MathUtil.floor(
          ekVor.sub(EgrBerechnungParamId.GRENZE2).div(Big(2))
        ).mul(Big(1e-3))
      );
      elterngeld_et = ek_diff.mul(ersatzrate);
    }
    if (ekVor.lt(EgrBerechnungParamId.GRENZE3)) {
      ersatzrate = EgrBerechnungParamId.ERSATZRATE1.add(
        MathUtil.floor(EgrBerechnungParamId.GRENZE3.sub(ekVor).div(Big(2))).mul(
          Big(1e-3)
        )
      );
      ersatzrate = MathUtil.fMin(ersatzrate, Big(1));
      elterngeld_et = ek_diff.mul(ersatzrate);
    }
    elterngeld_et = MathUtil.fMax(
      elterngeld_et,
      EgrBerechnungParamId.MINDESTSATZ
    );
    return elterngeld_et;
  }
  elterngeldplus_et(ekVor, ekNach) {
    let ersatzrate = MathUtil.BIG_ZERO;
    const ek_diff = MathUtil.fMax(
      MathUtil.fMin(ekVor, EgrBerechnungParamId.HOECHST_ET).sub(ekNach),
      MathUtil.BIG_ZERO
    );
    let elterngeldplus_et = ek_diff.mul(EgrBerechnungParamId.ERSATZRATE1);
    if (ekVor.gt(EgrBerechnungParamId.GRENZE1)) {
      elterngeldplus_et = MathUtil.fMin(
        EgrBerechnungParamId.ERSATZRATE2.mul(ek_diff),
        EgrBerechnungParamId.HOECHSTSATZ
      );
    }
    if (ekVor.gt(EgrBerechnungParamId.GRENZE2) && ekVor.lte(EgrBerechnungParamId.GRENZE1)) {
      ersatzrate = EgrBerechnungParamId.ERSATZRATE1.sub(
        MathUtil.floor(
          ekVor.sub(EgrBerechnungParamId.GRENZE2).div(Big(2))
        ).mul(Big(1e-3))
      );
      elterngeldplus_et = ek_diff.mul(ersatzrate);
    }
    if (ekVor.lt(EgrBerechnungParamId.GRENZE3)) {
      ersatzrate = EgrBerechnungParamId.ERSATZRATE1.add(
        MathUtil.floor(EgrBerechnungParamId.GRENZE3.sub(ekVor).div(Big(2))).mul(
          Big(1e-3)
        )
      );
      ersatzrate = MathUtil.fMin(ersatzrate, Big(1));
      elterngeldplus_et = ek_diff.mul(ersatzrate);
    }
    elterngeldplus_et = MathUtil.fMax(
      elterngeldplus_et,
      EgrBerechnungParamId.MINDESTSATZ.div(Big(2))
    );
    if (elterngeldplus_et.gt(Big(900))) {
      elterngeldplus_et = Big(900);
    }
    return elterngeldplus_et;
  }
}
class BmfAbgaben {
  constructor() {
    this.lstlzz = new Big(0);
    this.solzlzz = new Big(0);
    this.bk = new Big(0);
    this.bks = new Big(0);
    this.bkv = new Big(0);
    this.solzs = new Big(0);
    this.solzv = new Big(0);
    this.sts = new Big(0);
    this.stv = new Big(0);
  }
}
function bmfAbgabenOf(bmfResponse) {
  const bmfAbgaben = new BmfAbgaben();
  bmfAbgaben.bk = bmfResponse.BK;
  bmfAbgaben.bks = bmfResponse.BKS;
  bmfAbgaben.bkv = bmfResponse.BKV;
  bmfAbgaben.lstlzz = bmfResponse.LSTLZZ;
  bmfAbgaben.solzlzz = bmfResponse.SOLZLZZ;
  bmfAbgaben.solzs = bmfResponse.SOLZS;
  bmfAbgaben.solzv = bmfResponse.SOLZV;
  bmfAbgaben.sts = bmfResponse.STS;
  bmfAbgaben.stv = bmfResponse.STV;
  return bmfAbgaben;
}
var cjs = {};
var lst$1 = {};
var mpara = {};
var config = {};
const require$$0 = /* @__PURE__ */ getAugmentedNamespace(big);
var constants = {};
Object.defineProperty(constants, "__esModule", { value: true });
constants.TAB5 = constants.TAB4 = constants.TAB3 = constants.TAB2 = constants.TAB1 = constants.KENNVMT = constants.KZTAB = constants.STKL = constants.PKV = constants.LZZ = constants.KRV = void 0;
var big_js_1$l = require$$0;
var KRV;
(function(KRV2) {
  KRV2[KRV2["BBGW"] = 0] = "BBGW";
  KRV2[KRV2["BBGO"] = 1] = "BBGO";
  KRV2[KRV2["NONE"] = 2] = "NONE";
})(KRV || (constants.KRV = KRV = {}));
var LZZ;
(function(LZZ2) {
  LZZ2[LZZ2["JAHR"] = 1] = "JAHR";
  LZZ2[LZZ2["MONAT"] = 2] = "MONAT";
  LZZ2[LZZ2["WOCHE"] = 3] = "WOCHE";
  LZZ2[LZZ2["TAG"] = 4] = "TAG";
})(LZZ || (constants.LZZ = LZZ = {}));
var PKV;
(function(PKV2) {
  PKV2[PKV2["GKA"] = 0] = "GKA";
  PKV2[PKV2["PKAO"] = 1] = "PKAO";
  PKV2[PKV2["PKAM"] = 2] = "PKAM";
})(PKV || (constants.PKV = PKV = {}));
var STKL;
(function(STKL2) {
  STKL2[STKL2["I"] = 1] = "I";
  STKL2[STKL2["II"] = 2] = "II";
  STKL2[STKL2["III"] = 3] = "III";
  STKL2[STKL2["IV"] = 4] = "IV";
  STKL2[STKL2["V"] = 5] = "V";
  STKL2[STKL2["VI"] = 6] = "VI";
})(STKL || (constants.STKL = STKL = {}));
var KZTAB;
(function(KZTAB2) {
  KZTAB2[KZTAB2["GRUND"] = 1] = "GRUND";
  KZTAB2[KZTAB2["SPLIT"] = 2] = "SPLIT";
})(KZTAB || (constants.KZTAB = KZTAB = {}));
var KENNVMT;
(function(KENNVMT2) {
  KENNVMT2[KENNVMT2["NORMAL"] = 0] = "NORMAL";
  KENNVMT2[KENNVMT2["MJTAT"] = 1] = "MJTAT";
  KENNVMT2[KENNVMT2["VORPAU"] = 2] = "VORPAU";
})(KENNVMT || (constants.KENNVMT = KENNVMT = {}));
constants.TAB1 = {
  "2005": new big_js_1$l.default(0.4),
  "2006": new big_js_1$l.default(0.384),
  "2007": new big_js_1$l.default(0.368),
  "2008": new big_js_1$l.default(0.352),
  "2009": new big_js_1$l.default(0.336),
  "2010": new big_js_1$l.default(0.32),
  "2011": new big_js_1$l.default(0.304),
  "2012": new big_js_1$l.default(0.288),
  "2013": new big_js_1$l.default(0.272),
  "2014": new big_js_1$l.default(0.256),
  "2015": new big_js_1$l.default(0.24),
  "2016": new big_js_1$l.default(0.224),
  "2017": new big_js_1$l.default(0.208),
  "2018": new big_js_1$l.default(0.192),
  "2019": new big_js_1$l.default(0.176),
  "2020": new big_js_1$l.default(0.16),
  "2021": new big_js_1$l.default(0.152),
  "2022": new big_js_1$l.default(0.144),
  "2023": new big_js_1$l.default(0.136),
  "2024": new big_js_1$l.default(0.128),
  "2025": new big_js_1$l.default(0.12),
  "2026": new big_js_1$l.default(0.112),
  "2027": new big_js_1$l.default(0.104),
  "2028": new big_js_1$l.default(0.096),
  "2029": new big_js_1$l.default(0.088),
  "2030": new big_js_1$l.default(0.08),
  "2031": new big_js_1$l.default(0.072),
  "2032": new big_js_1$l.default(0.064),
  "2033": new big_js_1$l.default(0.056),
  "2034": new big_js_1$l.default(0.048),
  "2035": new big_js_1$l.default(0.04),
  "2036": new big_js_1$l.default(0.032),
  "2037": new big_js_1$l.default(0.024),
  "2038": new big_js_1$l.default(0.016),
  "2039": new big_js_1$l.default(8e-3),
  "2040": new big_js_1$l.default(0)
};
constants.TAB2 = {
  "2005": new big_js_1$l.default(3e3),
  "2006": new big_js_1$l.default(2880),
  "2007": new big_js_1$l.default(2760),
  "2008": new big_js_1$l.default(2640),
  "2009": new big_js_1$l.default(2520),
  "2010": new big_js_1$l.default(2400),
  "2011": new big_js_1$l.default(2280),
  "2012": new big_js_1$l.default(2160),
  "2013": new big_js_1$l.default(2040),
  "2014": new big_js_1$l.default(1920),
  "2015": new big_js_1$l.default(1800),
  "2016": new big_js_1$l.default(1680),
  "2017": new big_js_1$l.default(1560),
  "2018": new big_js_1$l.default(1440),
  "2019": new big_js_1$l.default(1320),
  "2020": new big_js_1$l.default(1200),
  "2021": new big_js_1$l.default(1140),
  "2022": new big_js_1$l.default(1080),
  "2023": new big_js_1$l.default(1020),
  "2024": new big_js_1$l.default(960),
  "2025": new big_js_1$l.default(900),
  "2026": new big_js_1$l.default(840),
  "2027": new big_js_1$l.default(780),
  "2028": new big_js_1$l.default(720),
  "2029": new big_js_1$l.default(660),
  "2030": new big_js_1$l.default(600),
  "2031": new big_js_1$l.default(540),
  "2032": new big_js_1$l.default(480),
  "2033": new big_js_1$l.default(420),
  "2034": new big_js_1$l.default(360),
  "2035": new big_js_1$l.default(300),
  "2036": new big_js_1$l.default(240),
  "2037": new big_js_1$l.default(180),
  "2038": new big_js_1$l.default(120),
  "2039": new big_js_1$l.default(60),
  "2040": new big_js_1$l.default(0)
};
constants.TAB3 = {
  "2005": new big_js_1$l.default(900),
  "2006": new big_js_1$l.default(864),
  "2007": new big_js_1$l.default(828),
  "2008": new big_js_1$l.default(792),
  "2009": new big_js_1$l.default(756),
  "2010": new big_js_1$l.default(720),
  "2011": new big_js_1$l.default(684),
  "2012": new big_js_1$l.default(648),
  "2013": new big_js_1$l.default(612),
  "2014": new big_js_1$l.default(576),
  "2015": new big_js_1$l.default(540),
  "2016": new big_js_1$l.default(504),
  "2017": new big_js_1$l.default(468),
  "2018": new big_js_1$l.default(432),
  "2019": new big_js_1$l.default(396),
  "2020": new big_js_1$l.default(360),
  "2021": new big_js_1$l.default(342),
  "2022": new big_js_1$l.default(324),
  "2023": new big_js_1$l.default(306),
  "2024": new big_js_1$l.default(288),
  "2025": new big_js_1$l.default(270),
  "2026": new big_js_1$l.default(252),
  "2027": new big_js_1$l.default(234),
  "2028": new big_js_1$l.default(216),
  "2029": new big_js_1$l.default(198),
  "2030": new big_js_1$l.default(180),
  "2031": new big_js_1$l.default(162),
  "2032": new big_js_1$l.default(144),
  "2033": new big_js_1$l.default(126),
  "2034": new big_js_1$l.default(108),
  "2035": new big_js_1$l.default(90),
  "2036": new big_js_1$l.default(72),
  "2037": new big_js_1$l.default(54),
  "2038": new big_js_1$l.default(36),
  "2039": new big_js_1$l.default(18),
  "2040": new big_js_1$l.default(0)
};
constants.TAB4 = {
  "2005": new big_js_1$l.default(0.4),
  "2006": new big_js_1$l.default(0.384),
  "2007": new big_js_1$l.default(0.368),
  "2008": new big_js_1$l.default(0.352),
  "2009": new big_js_1$l.default(0.336),
  "2010": new big_js_1$l.default(0.32),
  "2011": new big_js_1$l.default(0.304),
  "2012": new big_js_1$l.default(0.288),
  "2013": new big_js_1$l.default(0.272),
  "2014": new big_js_1$l.default(0.256),
  "2015": new big_js_1$l.default(0.24),
  "2016": new big_js_1$l.default(0.224),
  "2017": new big_js_1$l.default(0.208),
  "2018": new big_js_1$l.default(0.192),
  "2019": new big_js_1$l.default(0.176),
  "2020": new big_js_1$l.default(0.16),
  "2021": new big_js_1$l.default(0.152),
  "2022": new big_js_1$l.default(0.144),
  "2023": new big_js_1$l.default(0.136),
  "2024": new big_js_1$l.default(0.128),
  "2025": new big_js_1$l.default(0.12),
  "2026": new big_js_1$l.default(0.112),
  "2027": new big_js_1$l.default(0.104),
  "2028": new big_js_1$l.default(0.096),
  "2029": new big_js_1$l.default(0.088),
  "2030": new big_js_1$l.default(0.08),
  "2031": new big_js_1$l.default(0.072),
  "2032": new big_js_1$l.default(0.064),
  "2033": new big_js_1$l.default(0.056),
  "2034": new big_js_1$l.default(0.048),
  "2035": new big_js_1$l.default(0.04),
  "2036": new big_js_1$l.default(0.032),
  "2037": new big_js_1$l.default(0.024),
  "2038": new big_js_1$l.default(0.016),
  "2039": new big_js_1$l.default(8e-3),
  "2040": new big_js_1$l.default(0)
};
constants.TAB5 = {
  "2005": new big_js_1$l.default(1900),
  "2006": new big_js_1$l.default(1824),
  "2007": new big_js_1$l.default(1748),
  "2008": new big_js_1$l.default(1672),
  "2009": new big_js_1$l.default(1596),
  "2010": new big_js_1$l.default(1520),
  "2011": new big_js_1$l.default(1444),
  "2012": new big_js_1$l.default(1368),
  "2013": new big_js_1$l.default(1292),
  "2014": new big_js_1$l.default(1216),
  "2015": new big_js_1$l.default(1140),
  "2016": new big_js_1$l.default(1064),
  "2017": new big_js_1$l.default(988),
  "2018": new big_js_1$l.default(912),
  "2019": new big_js_1$l.default(836),
  "2020": new big_js_1$l.default(760),
  "2021": new big_js_1$l.default(722),
  "2022": new big_js_1$l.default(684),
  "2023": new big_js_1$l.default(646),
  "2024": new big_js_1$l.default(608),
  "2025": new big_js_1$l.default(570),
  "2026": new big_js_1$l.default(532),
  "2027": new big_js_1$l.default(494),
  "2028": new big_js_1$l.default(456),
  "2029": new big_js_1$l.default(418),
  "2030": new big_js_1$l.default(380),
  "2031": new big_js_1$l.default(342),
  "2032": new big_js_1$l.default(304),
  "2033": new big_js_1$l.default(266),
  "2034": new big_js_1$l.default(228),
  "2035": new big_js_1$l.default(190),
  "2036": new big_js_1$l.default(152),
  "2037": new big_js_1$l.default(114),
  "2038": new big_js_1$l.default(76),
  "2039": new big_js_1$l.default(38),
  "2040": new big_js_1$l.default(0)
};
var _2022 = {};
(function(exports) {
  var __assign2 = commonjsGlobal && commonjsGlobal.__assign || function() {
    __assign2 = Object.assign || function(t2) {
      for (var s2, i = 1, n2 = arguments.length; i < n2; i++) {
        s2 = arguments[i];
        for (var p2 in s2) if (Object.prototype.hasOwnProperty.call(s2, p2))
          t2[p2] = s2[p2];
      }
      return t2;
    };
    return __assign2.apply(this, arguments);
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.config = void 0;
  var big_js_12 = require$$0;
  var initial = function(_a, base) {
    var KRV2 = _a.KRV, KVZ = _a.KVZ, PVS = _a.PVS, PVZ = _a.PVZ;
    var defaults;
    defaults = __assign2(__assign2({}, base), { GFB: new big_js_12.default(9984), SOLZFREI: new big_js_12.default(16956), W1STKL5: new big_js_12.default(11480), W2STKL5: new big_js_12.default(29298), BBGKVPV: new big_js_12.default(58050), KVSATZAN: KVZ.div(2).div(100).add(0.07), KVSATZAG: new big_js_12.default(65e-4).add(0.07) });
    if (KRV2 < 2) {
      defaults = __assign2(__assign2({}, defaults), { BBGRV: KRV2 === 0 ? new big_js_12.default(84600) : new big_js_12.default(81e3), RVSATZAN: new big_js_12.default(0.093), TBSVORV: new big_js_12.default(0.88) });
    }
    if (PVS) {
      defaults = __assign2(__assign2({}, defaults), { PVSATZAN: new big_js_12.default(0.02025), PVSATZAG: new big_js_12.default(0.01025) });
    } else {
      defaults = __assign2(__assign2({}, defaults), { PVSATZAN: new big_js_12.default(0.01525), PVSATZAG: new big_js_12.default(0.01525) });
    }
    if (PVZ) {
      defaults = __assign2(__assign2({}, defaults), { PVSATZAN: defaults.PVSATZAN.add(35e-4) });
    }
    return __assign2({}, defaults);
  };
  var june = function(_a, base) {
    var KRV2 = _a.KRV, KVZ = _a.KVZ, PVS = _a.PVS, PVZ = _a.PVZ;
    var defaults;
    defaults = __assign2(__assign2({}, base), { GFB: new big_js_12.default(10347), SOLZFREI: new big_js_12.default(16956), W1STKL5: new big_js_12.default(11793), W2STKL5: new big_js_12.default(29298), BBGKVPV: new big_js_12.default(58050), KVSATZAN: KVZ.div(2).div(100).add(0.07), KVSATZAG: new big_js_12.default(65e-4).add(0.07) });
    if (KRV2 < 2) {
      defaults = __assign2(__assign2({}, defaults), { BBGRV: KRV2 === 0 ? new big_js_12.default(84600) : new big_js_12.default(81e3), RVSATZAN: new big_js_12.default(0.093), TBSVORV: new big_js_12.default(0.88) });
    }
    if (PVS) {
      defaults = __assign2(__assign2({}, defaults), { PVSATZAN: new big_js_12.default(0.02025), PVSATZAG: new big_js_12.default(0.01025) });
    } else {
      defaults = __assign2(__assign2({}, defaults), { PVSATZAN: new big_js_12.default(0.01525), PVSATZAG: new big_js_12.default(0.01525) });
    }
    if (PVZ) {
      defaults = __assign2(__assign2({}, defaults), { PVSATZAN: defaults.PVSATZAN.add(35e-4) });
    }
    return __assign2({}, defaults);
  };
  var config2 = function(CONFIG, base) {
    var PATCH = base.PATCH;
    if (PATCH && PATCH === "1")
      return __assign2({}, initial(CONFIG, base));
    return __assign2({}, june(CONFIG, base));
  };
  exports.config = config2;
  exports.default = exports.config;
})(_2022);
var _2023 = {};
(function(exports) {
  var __assign2 = commonjsGlobal && commonjsGlobal.__assign || function() {
    __assign2 = Object.assign || function(t2) {
      for (var s2, i = 1, n2 = arguments.length; i < n2; i++) {
        s2 = arguments[i];
        for (var p2 in s2) if (Object.prototype.hasOwnProperty.call(s2, p2))
          t2[p2] = s2[p2];
      }
      return t2;
    };
    return __assign2.apply(this, arguments);
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.config = void 0;
  var big_js_12 = require$$0;
  var initial = function(_a, base) {
    var KRV2 = _a.KRV, KVZ = _a.KVZ, PVS = _a.PVS, PVZ = _a.PVZ;
    var defaults;
    defaults = __assign2(__assign2({}, base), { GFB: new big_js_12.default(10908), SOLZFREI: new big_js_12.default(17543), W1STKL5: new big_js_12.default(12485), W2STKL5: new big_js_12.default(31404), BBGKVPV: new big_js_12.default(59850), KVSATZAN: KVZ.div(2).div(100).add(0.07), KVSATZAG: new big_js_12.default(8e-3).add(0.07) });
    if (KRV2 < 2) {
      defaults = __assign2(__assign2({}, defaults), { BBGRV: KRV2 === 0 ? new big_js_12.default(87600) : new big_js_12.default(85200), RVSATZAN: new big_js_12.default(0.093), TBSVORV: new big_js_12.default(1) });
    }
    if (PVS) {
      defaults = __assign2(__assign2({}, defaults), { PVSATZAN: new big_js_12.default(0.02025), PVSATZAG: new big_js_12.default(0.01025) });
    } else {
      defaults = __assign2(__assign2({}, defaults), { PVSATZAN: new big_js_12.default(0.01525), PVSATZAG: new big_js_12.default(0.01525) });
    }
    if (PVZ) {
      defaults = __assign2(__assign2({}, defaults), { PVSATZAN: defaults.PVSATZAN.add(35e-4) });
    }
    return __assign2({}, defaults);
  };
  var july = function(_a, base) {
    var KRV2 = _a.KRV, KVZ = _a.KVZ, PVS = _a.PVS, PVZ = _a.PVZ, LZZ2 = _a.LZZ;
    var defaults;
    defaults = __assign2(__assign2({}, base), { GFB: new big_js_12.default(10908), SOLZFREI: new big_js_12.default(17543), W1STKL5: new big_js_12.default(12485), W2STKL5: new big_js_12.default(31404), BBGKVPV: new big_js_12.default(59850), KVSATZAN: KVZ.div(2).div(100).add(0.07), KVSATZAG: new big_js_12.default(8e-3).add(0.07) });
    if (KRV2 < 2) {
      defaults = __assign2(__assign2({}, defaults), { BBGRV: KRV2 === 0 ? new big_js_12.default(87600) : new big_js_12.default(85200), RVSATZAN: new big_js_12.default(0.093), TBSVORV: new big_js_12.default(1) });
    }
    if (LZZ2 === 1) {
      if (PVS) {
        defaults = __assign2(__assign2({}, defaults), { PVSATZAN: new big_js_12.default(0.021125), PVSATZAG: new big_js_12.default(0.011125) });
      } else {
        defaults = __assign2(__assign2({}, defaults), { PVSATZAN: new big_js_12.default(0.016125), PVSATZAG: new big_js_12.default(0.016125) });
      }
      if (PVZ) {
        defaults = __assign2(__assign2({}, defaults), { PVSATZAN: defaults.PVSATZAN.add(new big_js_12.default(475e-5)) });
      }
    } else {
      if (PVS) {
        defaults = __assign2(__assign2({}, defaults), { PVSATZAN: new big_js_12.default(0.022), PVSATZAG: new big_js_12.default(0.012) });
      } else {
        defaults = __assign2(__assign2({}, defaults), { PVSATZAN: new big_js_12.default(0.017), PVSATZAG: new big_js_12.default(0.017) });
      }
      if (PVZ) {
        defaults = __assign2(__assign2({}, defaults), { PVSATZAN: defaults.PVSATZAN.add(new big_js_12.default(6e-3)) });
      }
    }
    return __assign2({}, defaults);
  };
  var config2 = function(CONFIG, base) {
    var PATCH = base.PATCH;
    if (PATCH && PATCH === "1")
      return __assign2({}, initial(CONFIG, base));
    return __assign2({}, july(CONFIG, base));
  };
  exports.config = config2;
  exports.default = exports.config;
})(_2023);
var __assign$a = commonjsGlobal && commonjsGlobal.__assign || function() {
  __assign$a = Object.assign || function(t2) {
    for (var s2, i = 1, n2 = arguments.length; i < n2; i++) {
      s2 = arguments[i];
      for (var p2 in s2) if (Object.prototype.hasOwnProperty.call(s2, p2))
        t2[p2] = s2[p2];
    }
    return t2;
  };
  return __assign$a.apply(this, arguments);
};
Object.defineProperty(config, "__esModule", { value: true });
config.PARAMS = void 0;
var big_js_1$k = require$$0;
var constants_1$4 = constants;
var _2022_1 = _2022;
var _2023_1 = _2023;
var parseYEAR = function(inputYear) {
  var calculationYear;
  var calculationPatch;
  if (typeof inputYear === "number") {
    calculationYear = inputYear;
    calculationPatch = "";
  } else {
    var _a = inputYear.split("."), cYear = _a[0], cPatch = _a[1];
    calculationYear = parseInt(cYear);
    calculationPatch = cPatch;
  }
  return {
    BJAHR: calculationYear,
    PATCH: calculationPatch
  };
};
var PARAMS = function(year, CONFIG) {
  var _a = parseYEAR(year), BJAHR = _a.BJAHR, PATCH = _a.PATCH;
  var base = {
    BJAHR,
    PATCH,
    KENNVMT: constants_1$4.KENNVMT.NORMAL,
    GFB: new big_js_1$k.default(0),
    SOLZFREI: new big_js_1$k.default(0),
    TBSVORV: new big_js_1$k.default(0),
    W1STKL5: new big_js_1$k.default(0),
    W2STKL5: new big_js_1$k.default(0),
    W3STKL5: new big_js_1$k.default(222260),
    RVSATZAN: new big_js_1$k.default(0),
    BBGRV: new big_js_1$k.default(0),
    VBEZBSO: new big_js_1$k.default(0),
    PVSATZAG: new big_js_1$k.default(0),
    PVSATZAN: new big_js_1$k.default(0),
    KVSATZAG: new big_js_1$k.default(0),
    KVSATZAN: new big_js_1$k.default(0),
    BBGKVPV: new big_js_1$k.default(0)
  };
  return __assign$a(__assign$a(__assign$a({}, base), BJAHR === 2022 ? (0, _2022_1.default)(CONFIG, base) : {}), BJAHR === 2023 ? (0, _2023_1.default)(CONFIG, base) : {});
};
config.PARAMS = PARAMS;
var __assign$9 = commonjsGlobal && commonjsGlobal.__assign || function() {
  __assign$9 = Object.assign || function(t2) {
    for (var s2, i = 1, n2 = arguments.length; i < n2; i++) {
      s2 = arguments[i];
      for (var p2 in s2) if (Object.prototype.hasOwnProperty.call(s2, p2))
        t2[p2] = s2[p2];
    }
    return t2;
  };
  return __assign$9.apply(this, arguments);
};
Object.defineProperty(mpara, "__esModule", { value: true });
mpara.MPARA = void 0;
var config_1 = config;
var MPARA = function(YEAR, P2) {
  var CONFIGURATION = (0, config_1.PARAMS)(YEAR, P2);
  return __assign$9({}, CONFIGURATION);
};
mpara.MPARA = MPARA;
var mre4jl = {};
Object.defineProperty(mre4jl, "__esModule", { value: true });
mre4jl.MRE4JL = void 0;
var big_js_1$j = require$$0;
var MRE4JL = function(_a) {
  var AF = _a.AF, F2 = _a.F, LZZ2 = _a.LZZ, RE4 = _a.RE4, VBEZ = _a.VBEZ, LZZFREIB = _a.LZZFREIB, LZZHINZU = _a.LZZHINZU;
  var jahr = function(input2) {
    return input2.div(100);
  };
  var monat = function(input2) {
    return input2.mul(12).div(100);
  };
  var woche = function(input2) {
    return input2.mul(360).div(7).div(100);
  };
  var tag = function(input2) {
    return input2.mul(360).div(100);
  };
  var ZRE4J = new big_js_1$j.default(0);
  var ZVBEZJ = new big_js_1$j.default(0);
  var JLFREIB = new big_js_1$j.default(0);
  var JLHINZU = new big_js_1$j.default(0);
  var f2 = F2;
  var re4 = RE4 || new big_js_1$j.default(0);
  var vbez = VBEZ || new big_js_1$j.default(0);
  var lzzfreib = LZZFREIB || new big_js_1$j.default(0);
  var lzzhinzu = LZZHINZU || new big_js_1$j.default(0);
  if (LZZ2 === 1) {
    ZRE4J = jahr(re4);
    ZVBEZJ = jahr(vbez);
    JLFREIB = jahr(lzzfreib);
    JLHINZU = jahr(lzzhinzu);
  }
  if (LZZ2 === 2) {
    ZRE4J = monat(re4);
    ZVBEZJ = monat(vbez);
    JLFREIB = monat(lzzfreib);
    JLHINZU = monat(lzzhinzu);
  }
  if (LZZ2 === 3) {
    ZRE4J = woche(re4);
    ZVBEZJ = woche(vbez);
    JLFREIB = woche(lzzfreib);
    JLHINZU = woche(lzzhinzu);
  }
  if (LZZ2 === 4) {
    ZRE4J = tag(re4);
    ZVBEZJ = tag(vbez);
    JLFREIB = tag(lzzfreib);
    JLHINZU = tag(lzzhinzu);
  }
  if (!AF) {
    f2 = new big_js_1$j.default(1);
  }
  return {
    ZRE4J,
    ZVBEZJ,
    JLFREIB,
    JLHINZU,
    F: f2
  };
};
mre4jl.MRE4JL = MRE4JL;
var mre4 = {};
var mre4alte = {};
Object.defineProperty(mre4alte, "__esModule", { value: true });
mre4alte.MRE4ALTE = void 0;
var big_js_1$i = require$$0;
var constants_1$3 = constants;
var MRE4ALTE = function(_a, INPUTDATA) {
  var ZRE4J = _a.ZRE4J, ZVBEZJ = _a.ZVBEZJ;
  var ALTER1 = INPUTDATA.ALTER1, AJAHR = INPUTDATA.AJAHR;
  var ALTE = new big_js_1$i.default(0);
  var HBALTE = new big_js_1$i.default(0);
  var K2 = "36";
  var BMG = new big_js_1$i.default(0);
  if (ALTER1) {
    if (AJAHR && AJAHR.year < 2006) {
      K2 = "1";
    } else if (AJAHR && AJAHR.year < 2040) {
      K2 = AJAHR.minus({ year: 2004 }).year.toString();
    }
    BMG = ZRE4J.minus(ZVBEZJ);
    ALTE = BMG.mul(constants_1$3.TAB4[K2]).round(-1, big_js_1$i.default.roundUp);
    HBALTE = constants_1$3.TAB5[K2];
    if (ALTE.gt(HBALTE)) {
      ALTE = HBALTE;
    }
  }
  return { ALTE };
};
mre4alte.MRE4ALTE = MRE4ALTE;
var __assign$8 = commonjsGlobal && commonjsGlobal.__assign || function() {
  __assign$8 = Object.assign || function(t2) {
    for (var s2, i = 1, n2 = arguments.length; i < n2; i++) {
      s2 = arguments[i];
      for (var p2 in s2) if (Object.prototype.hasOwnProperty.call(s2, p2))
        t2[p2] = s2[p2];
    }
    return t2;
  };
  return __assign$8.apply(this, arguments);
};
Object.defineProperty(mre4, "__esModule", { value: true });
mre4.MRE4 = void 0;
var big_js_1$h = require$$0;
var constants_1$2 = constants;
var mre4alte_1 = mre4alte;
var MRE4 = function(PARAMS2, CONFIG) {
  var LZZ2 = PARAMS2.LZZ, VJAHR = PARAMS2.VJAHR, ZRE4J = PARAMS2.ZRE4J, ZVBEZJ = PARAMS2.ZVBEZJ, ZMVB = PARAMS2.ZMVB, VBEZS = PARAMS2.VBEZS, VBEZM = PARAMS2.VBEZM;
  var FVB = new big_js_1$h.default(0);
  var FVBZ = new big_js_1$h.default(0);
  var FVBSO = new big_js_1$h.default(0);
  var FVBZSO = new big_js_1$h.default(0);
  var VBEZB = new big_js_1$h.default(0);
  var HFVB = new big_js_1$h.default(0);
  var HFVBZ = new big_js_1$h.default(0);
  var HFVBZSO = new big_js_1$h.default(0);
  var J2 = "";
  var vbezm = VBEZM || new big_js_1$h.default(0);
  var zmvb = ZMVB || new big_js_1$h.default(0);
  var vbezs = VBEZS || new big_js_1$h.default(0);
  var VBEZBSO = CONFIG.VBEZBSO;
  if (ZVBEZJ.gt(0)) {
    if (VJAHR && VJAHR.year < 2006) {
      J2 = "1";
    } else if (VJAHR && VJAHR.year < 2040) {
      J2 = VJAHR.minus({ year: 2004 }).year.toString();
    } else {
      J2 = "36";
    }
    if (LZZ2 === 1) {
      VBEZB = vbezm.mul(zmvb).add(vbezs);
      HFVB = constants_1$2.TAB2[J2].div(12).mul(zmvb);
      FVBZ = constants_1$2.TAB3[J2].div(12).mul(zmvb).round(0, big_js_1$h.default.roundUp);
    } else {
      VBEZB = vbezm.mul(12).add(vbezs);
      HFVB = constants_1$2.TAB2[J2];
      FVBZ = constants_1$2.TAB3[J2];
    }
    FVB = VBEZB.mul(constants_1$2.TAB1[J2]).div(100).round(2, big_js_1$h.default.roundUp);
    if (FVB.gt(HFVB)) {
      FVB = HFVB;
    }
    if (FVB.gt(ZVBEZJ)) {
      FVB = ZVBEZJ;
    }
    FVBSO = FVB.add(VBEZBSO.mul(constants_1$2.TAB1[J2].div(100))).round(2, big_js_1$h.default.roundUp);
    if (FVBSO.gt(constants_1$2.TAB2[J2])) {
      FVBSO = constants_1$2.TAB2[J2];
    }
    HFVBZSO = VBEZB.add(VBEZBSO).div(100).minus(FVBSO);
    FVBZSO = FVBZ.add(VBEZBSO.div(100)).round(0, big_js_1$h.default.roundUp);
    if (FVBZSO.gt(HFVBZSO)) {
      FVBZSO = HFVBZSO.round(0, big_js_1$h.default.roundUp);
    }
    if (FVBZSO.gt(constants_1$2.TAB3[J2])) {
      FVBZSO = constants_1$2.TAB3[J2];
    }
    HFVBZ = VBEZB.div(100).minus(FVB);
    if (FVBZ.gt(HFVBZ)) {
      FVBZ = HFVBZ.round(0, big_js_1$h.default.roundUp);
    }
  }
  var ALTE = (0, mre4alte_1.MRE4ALTE)(__assign$8(__assign$8({}, PARAMS2), { ZRE4J, ZVBEZJ }), __assign$8({}, PARAMS2)).ALTE;
  return {
    ALTE,
    FVB,
    FVBSO,
    FVBZ,
    FVBZSO
  };
};
mre4.MRE4 = MRE4;
var mre4abz = {};
Object.defineProperty(mre4abz, "__esModule", { value: true });
mre4abz.MRE4ABZ = void 0;
var big_js_1$g = require$$0;
var MRE4ABZ = function(_a, CONFIG) {
  var ZRE4J = _a.ZRE4J, ZVBEZJ = _a.ZVBEZJ, FVB = _a.FVB, ALTE = _a.ALTE, JLFREIB = _a.JLFREIB, JLHINZU = _a.JLHINZU, ENTSCH = _a.ENTSCH;
  var ZRE4;
  var ZRE4VP;
  var ZVBEZ;
  var KENNVMT2 = CONFIG.KENNVMT;
  ZRE4 = ZRE4J.minus(FVB).minus(ALTE).minus(JLFREIB).add(JLHINZU).round(2, big_js_1$g.default.roundDown);
  if (ZRE4.lt(0)) {
    ZRE4 = new big_js_1$g.default(0);
  }
  ZRE4VP = ZRE4J;
  if (KENNVMT2 === 2) {
    ZRE4VP = ZRE4VP.minus(ENTSCH.div(100)).round(2, big_js_1$g.default.roundDown);
  }
  ZVBEZ = ZVBEZJ.minus(FVB);
  if (ZVBEZ.lt(0)) {
    ZVBEZ = new big_js_1$g.default(0);
  }
  return {
    ZRE4,
    ZRE4VP,
    ZVBEZ
  };
};
mre4abz.MRE4ABZ = MRE4ABZ;
var mberech = {};
var mztabfb = {};
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.MZTABFB23 = exports.MZTABFB22 = exports.MZTABFB = void 0;
  var big_js_12 = require$$0;
  var constants_12 = constants;
  var MZTABFB = function(P2, CONFIG) {
    var BJAHR = CONFIG.BJAHR, PATCH = CONFIG.PATCH;
    if (BJAHR === 2023) {
      return (0, exports.MZTABFB23)(P2);
    }
    return (0, exports.MZTABFB22)(P2, PATCH);
  };
  exports.MZTABFB = MZTABFB;
  var MZTABFB22 = function(_a, patch) {
    var ZRE4 = _a.ZRE4, ZVBEZ = _a.ZVBEZ, FVBZ = _a.FVBZ, FVBZSO = _a.FVBZSO, STKL2 = _a.STKL, ZKF = _a.ZKF;
    var ANP = new big_js_12.default(0);
    var fvbz = FVBZ;
    var fvbzso = FVBZSO;
    var kztab = constants_12.KZTAB.GRUND;
    var KFB = new big_js_12.default(0);
    var EFA = new big_js_12.default(0);
    var SAP;
    if (ZVBEZ.gte(0) && ZVBEZ.lt(FVBZ)) {
      fvbz = ZVBEZ;
    }
    if (STKL2 < 6) {
      if (ZVBEZ.gt(0)) {
        if (ZVBEZ.minus(fvbz).lt(102)) {
          ANP = ZVBEZ.minus(fvbz).round(0, big_js_12.default.roundUp);
        } else {
          ANP = new big_js_12.default(102);
        }
      }
    } else {
      fvbz = new big_js_12.default(0);
      fvbzso = new big_js_12.default(0);
    }
    if (STKL2 < 6) {
      if (ZRE4.gt(ZVBEZ)) {
        if (ZRE4.minus(ZVBEZ).lt(patch === "1" ? 1e3 : 1200)) {
          ANP = ANP.add(ZRE4).minus(ZVBEZ).round(0, big_js_12.default.roundUp);
        } else {
          ANP = ANP.add(1200);
        }
      }
    }
    switch (STKL2) {
      case 1:
        SAP = new big_js_12.default(36);
        KFB = ZKF.mul(8388).round(0, big_js_12.default.roundDown);
        break;
      case 2:
        EFA = new big_js_12.default(4008);
        SAP = new big_js_12.default(36);
        KFB = ZKF.mul(8388).round(0, big_js_12.default.roundDown);
        break;
      case 3:
        kztab = constants_12.KZTAB.SPLIT;
        SAP = new big_js_12.default(36);
        KFB = ZKF.mul(8388).round(0, big_js_12.default.roundDown);
        break;
      case 4:
        SAP = new big_js_12.default(36);
        KFB = ZKF.mul(4194).round(0, big_js_12.default.roundDown);
        break;
      case 5:
        SAP = new big_js_12.default(36);
        KFB = new big_js_12.default(0);
        break;
      default:
        SAP = new big_js_12.default(0);
        break;
    }
    var ZTABFB = EFA.add(ANP).add(SAP).add(fvbz);
    return {
      ANP,
      KFB,
      FVBZ: fvbz,
      FVBZSO: fvbzso,
      KZTAB: kztab,
      ZTABFB
    };
  };
  exports.MZTABFB22 = MZTABFB22;
  var MZTABFB23 = function(_a) {
    var ZRE4 = _a.ZRE4, ZVBEZ = _a.ZVBEZ, FVBZ = _a.FVBZ, FVBZSO = _a.FVBZSO, STKL2 = _a.STKL, ZKF = _a.ZKF;
    var ANP = new big_js_12.default(0);
    var fvbz = FVBZ;
    var fvbzso = FVBZSO;
    var kztab = constants_12.KZTAB.GRUND;
    var KFB = new big_js_12.default(0);
    var EFA = new big_js_12.default(0);
    var SAP;
    if (ZVBEZ.gte(0) && ZVBEZ.lt(FVBZ)) {
      fvbz = ZVBEZ;
    }
    if (STKL2 < 6) {
      if (ZVBEZ.gt(0)) {
        if (ZVBEZ.minus(fvbz).lt(102)) {
          ANP = ZVBEZ.minus(fvbz).round(0, big_js_12.default.roundUp);
        } else {
          ANP = new big_js_12.default(102);
        }
      }
    } else {
      fvbz = new big_js_12.default(0);
      fvbzso = new big_js_12.default(0);
    }
    if (STKL2 < 6) {
      if (ZRE4.gt(ZVBEZ)) {
        if (ZRE4.minus(ZVBEZ).lt(1230)) {
          ANP = ANP.add(ZRE4).minus(ZVBEZ).round(0, big_js_12.default.roundUp);
        } else {
          ANP = ANP.add(1230);
        }
      }
    }
    switch (STKL2) {
      case 1:
        SAP = new big_js_12.default(36);
        KFB = ZKF.mul(8952).round(0, big_js_12.default.roundDown);
        break;
      case 2:
        EFA = new big_js_12.default(4260);
        SAP = new big_js_12.default(36);
        KFB = ZKF.mul(8952).round(0, big_js_12.default.roundDown);
        break;
      case 3:
        kztab = constants_12.KZTAB.SPLIT;
        SAP = new big_js_12.default(36);
        KFB = ZKF.mul(8952).round(0, big_js_12.default.roundDown);
        break;
      case 4:
        SAP = new big_js_12.default(36);
        KFB = ZKF.mul(4476).round(0, big_js_12.default.roundDown);
        break;
      case 5:
        SAP = new big_js_12.default(36);
        KFB = new big_js_12.default(0);
        break;
      default:
        SAP = new big_js_12.default(0);
        break;
    }
    var ZTABFB = EFA.add(ANP).add(SAP).add(fvbz);
    return {
      ANP,
      KFB,
      FVBZ: fvbz,
      FVBZSO: fvbzso,
      KZTAB: kztab,
      ZTABFB
    };
  };
  exports.MZTABFB23 = MZTABFB23;
})(mztabfb);
var mlstjahr = {};
var upevp = {};
var mvsp = {};
Object.defineProperty(mvsp, "__esModule", { value: true });
mvsp.MVSP = void 0;
var big_js_1$f = require$$0;
var MVSP = function(_a, CONFIG) {
  var VSP1 = _a.VSP1, PKV2 = _a.PKV, STKL2 = _a.STKL, PKPV = _a.PKPV, ZRE4VP = _a.ZRE4VP;
  var zre4vp = ZRE4VP;
  var VSP3;
  var VSP;
  var BBGKVPV = CONFIG.BBGKVPV, KVSATZAG = CONFIG.KVSATZAG, PVSATZAG = CONFIG.PVSATZAG, KVSATZAN = CONFIG.KVSATZAN, PVSATZAN = CONFIG.PVSATZAN;
  if (ZRE4VP.gt(BBGKVPV)) {
    zre4vp = BBGKVPV;
  }
  if (PKV2 > 0) {
    if (STKL2 === 6) {
      VSP3 = new big_js_1$f.default(0);
    } else {
      VSP3 = PKPV.mul(12).div(100);
      if (PKV2 === 2) {
        VSP3 = VSP3.minus(zre4vp.mul(KVSATZAG.add(PVSATZAG)));
      }
    }
  } else {
    VSP3 = zre4vp.mul(KVSATZAN.add(PVSATZAN));
  }
  VSP = VSP3.add(VSP1).round(0, big_js_1$f.default.roundUp);
  return {
    VSP,
    VSP3
  };
};
mvsp.MVSP = MVSP;
Object.defineProperty(upevp, "__esModule", { value: true });
upevp.UPEVP = void 0;
var big_js_1$e = require$$0;
var mvsp_1 = mvsp;
var UPEVP = function(_a, CONFIG) {
  var PKV2 = _a.PKV, KRV2 = _a.KRV, STKL2 = _a.STKL, PKPV = _a.PKPV, ZRE4VP = _a.ZRE4VP;
  var VSP1;
  var VSP2;
  var VHB;
  var VSPN;
  var BBGRV = CONFIG.BBGRV, RVSATZAN = CONFIG.RVSATZAN, TBSVORV = CONFIG.TBSVORV;
  var zre4vp = ZRE4VP;
  if (KRV2 > 1) {
    VSP1 = new big_js_1$e.default(0);
  } else {
    if (zre4vp.gt(BBGRV)) {
      zre4vp = BBGRV;
    }
    VSP1 = TBSVORV.mul(zre4vp);
    VSP1 = VSP1.mul(RVSATZAN);
  }
  VSP2 = zre4vp.mul(0.12);
  if (STKL2 === 3) {
    VHB = new big_js_1$e.default(3e3);
  } else {
    VHB = new big_js_1$e.default(1900);
  }
  if (VSP2.gt(VHB)) {
    VSP2 = VHB;
  }
  VSPN = VSP1.add(VSP2).round(0, big_js_1$e.default.roundUp);
  var _b = (0, mvsp_1.MVSP)({
    VSP1,
    PKV: PKV2,
    STKL: STKL2,
    PKPV,
    ZRE4VP: zre4vp
  }, CONFIG), VSP = _b.VSP, VSP3 = _b.VSP3;
  var vsp = VSP;
  if (VSPN.gt(VSP)) {
    vsp = VSPN;
  }
  return {
    VSP2,
    VSP3,
    VSP: vsp
  };
};
upevp.UPEVP = UPEVP;
var upmlst = {};
var uptab = {};
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.UPTAB23 = exports.UPTAB22 = exports.UPTAB = void 0;
  var big_js_12 = require$$0;
  var UPTAB = function(INPUT_DATA, CONFIG) {
    var BJAHR = CONFIG.BJAHR;
    if (BJAHR === 2023) {
      return (0, exports.UPTAB23)(INPUT_DATA, CONFIG);
    }
    return (0, exports.UPTAB22)(INPUT_DATA, CONFIG);
  };
  exports.UPTAB = UPTAB;
  var UPTAB22 = function(_a, CONFIG) {
    var X2 = _a.X, KZTAB2 = _a.KZTAB;
    var ST;
    var Y2;
    var RW;
    var GFB = CONFIG.GFB, PATCH = CONFIG.PATCH;
    if (X2.lt(GFB.add(1))) {
      ST = new big_js_12.default(0);
    } else {
      if (X2.lt(new big_js_12.default(14927))) {
        Y2 = X2.minus(GFB).div(1e4).round(6, big_js_12.default.roundDown);
        RW = Y2.mul(new big_js_12.default(PATCH === "1" ? 1008.7 : 1088.67));
        RW = RW.add(1400);
        ST = RW.mul(Y2).round(0, big_js_12.default.roundDown);
      } else if (X2.lt(new big_js_12.default(58597))) {
        Y2 = X2.minus(14926).div(1e4).round(6, big_js_12.default.roundDown);
        RW = Y2.mul(206.43);
        RW = RW.add(2397);
        RW = RW.mul(Y2);
        ST = RW.add(PATCH === "1" ? 938.24 : 869.32).round(0, big_js_12.default.roundDown);
      } else if (X2.lt(new big_js_12.default(277826))) {
        ST = X2.mul(0.42).minus(PATCH === "1" ? 9267.53 : 9336.45).round(0, big_js_12.default.roundDown);
      } else {
        ST = X2.mul(0.45).minus(PATCH === "1" ? 17602.28 : 17671.2).round(0, big_js_12.default.roundDown);
      }
    }
    ST = ST.mul(KZTAB2);
    return ST;
  };
  exports.UPTAB22 = UPTAB22;
  var UPTAB23 = function(_a, CONFIG) {
    var X2 = _a.X, KZTAB2 = _a.KZTAB;
    var ST;
    var Y2;
    var RW;
    var GFB = CONFIG.GFB;
    if (X2.lt(GFB.add(1))) {
      ST = new big_js_12.default(0);
    } else {
      if (X2.lt(new big_js_12.default(16e3))) {
        Y2 = X2.minus(GFB).div(1e4).round(6, big_js_12.default.roundDown);
        RW = Y2.mul(new big_js_12.default(979.18));
        RW = RW.add(1400);
        ST = RW.mul(Y2).round(0, big_js_12.default.roundDown);
      } else if (X2.lt(new big_js_12.default(62810))) {
        Y2 = X2.minus(15999).div(1e4).round(6, big_js_12.default.roundDown);
        RW = Y2.mul(192.59);
        RW = RW.add(2397);
        RW = RW.mul(Y2);
        ST = RW.add(966.53).round(0, big_js_12.default.roundDown);
      } else if (X2.lt(new big_js_12.default(277826))) {
        ST = X2.mul(0.42).minus(9972.98).round(0, big_js_12.default.roundDown);
      } else {
        ST = X2.mul(0.45).minus(18307.73).round(0, big_js_12.default.roundDown);
      }
    }
    ST = ST.mul(KZTAB2);
    return ST;
  };
  exports.UPTAB23 = UPTAB23;
})(uptab);
var mst56 = {};
var up56 = {};
var __assign$7 = commonjsGlobal && commonjsGlobal.__assign || function() {
  __assign$7 = Object.assign || function(t2) {
    for (var s2, i = 1, n2 = arguments.length; i < n2; i++) {
      s2 = arguments[i];
      for (var p2 in s2) if (Object.prototype.hasOwnProperty.call(s2, p2))
        t2[p2] = s2[p2];
    }
    return t2;
  };
  return __assign$7.apply(this, arguments);
};
var __rest$6 = commonjsGlobal && commonjsGlobal.__rest || function(s2, e) {
  var t2 = {};
  for (var p2 in s2) if (Object.prototype.hasOwnProperty.call(s2, p2) && e.indexOf(p2) < 0)
    t2[p2] = s2[p2];
  if (s2 != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p2 = Object.getOwnPropertySymbols(s2); i < p2.length; i++) {
      if (e.indexOf(p2[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s2, p2[i]))
        t2[p2[i]] = s2[p2[i]];
    }
  return t2;
};
Object.defineProperty(up56, "__esModule", { value: true });
up56.UP56 = void 0;
var big_js_1$d = require$$0;
var uptab_1$2 = uptab;
var UP56 = function(_a, CONFIG) {
  var ZX = _a.ZX, rest = __rest$6(_a, ["ZX"]);
  var ST1 = (0, uptab_1$2.UPTAB)(__assign$7(__assign$7({}, rest), { X: ZX.mul(1.25).round(2, big_js_1$d.default.roundDown) }), CONFIG);
  var ST2 = (0, uptab_1$2.UPTAB)(__assign$7(__assign$7({}, rest), { X: ZX.mul(0.75).round(2, big_js_1$d.default.roundDown) }), CONFIG);
  var DIFF = ST1.minus(ST2).mul(2);
  var MIST = ZX.mul(0.14).round(0, big_js_1$d.default.roundDown);
  return MIST.gt(DIFF) ? MIST : DIFF;
};
up56.UP56 = UP56;
var __assign$6 = commonjsGlobal && commonjsGlobal.__assign || function() {
  __assign$6 = Object.assign || function(t2) {
    for (var s2, i = 1, n2 = arguments.length; i < n2; i++) {
      s2 = arguments[i];
      for (var p2 in s2) if (Object.prototype.hasOwnProperty.call(s2, p2))
        t2[p2] = s2[p2];
    }
    return t2;
  };
  return __assign$6.apply(this, arguments);
};
var __rest$5 = commonjsGlobal && commonjsGlobal.__rest || function(s2, e) {
  var t2 = {};
  for (var p2 in s2) if (Object.prototype.hasOwnProperty.call(s2, p2) && e.indexOf(p2) < 0)
    t2[p2] = s2[p2];
  if (s2 != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p2 = Object.getOwnPropertySymbols(s2); i < p2.length; i++) {
      if (e.indexOf(p2[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s2, p2[i]))
        t2[p2[i]] = s2[p2[i]];
    }
  return t2;
};
Object.defineProperty(mst56, "__esModule", { value: true });
mst56.MST56 = void 0;
var big_js_1$c = require$$0;
var up56_1 = up56;
var MST56 = function(_a, CONFIG) {
  var X2 = _a.X, rest = __rest$5(_a, ["X"]);
  var ZX;
  var VERGL;
  var st = new big_js_1$c.default(0);
  var ZZX = X2;
  var W1STKL5 = CONFIG.W1STKL5, W2STKL5 = CONFIG.W2STKL5, W3STKL5 = CONFIG.W3STKL5;
  if (ZZX.gt(W2STKL5)) {
    ZX = W2STKL5;
    var stup56 = (0, up56_1.UP56)(__assign$6({ X: X2, ZX }, rest), CONFIG);
    if (ZZX.gt(W3STKL5)) {
      st = stup56.add(W3STKL5.minus(W2STKL5).mul(0.42)).round(0, big_js_1$c.default.roundDown);
      st = st.add(ZZX.minus(W3STKL5).mul(0.45)).round(0, big_js_1$c.default.roundDown);
    } else {
      st = stup56.add(ZZX.minus(W2STKL5).mul(0.42)).round(0, big_js_1$c.default.roundDown);
    }
  } else {
    ZX = ZZX;
    st = (0, up56_1.UP56)(__assign$6({ X: X2, ZX }, rest), CONFIG);
    if (ZZX.gt(W1STKL5)) {
      VERGL = st;
      ZX = W1STKL5;
      var stvergl = (0, up56_1.UP56)(__assign$6({ X: X2, ZX }, rest), CONFIG);
      var HOCH = stvergl.add(ZZX.minus(W1STKL5).mul(0.42)).round(0, big_js_1$c.default.roundDown);
      st = HOCH.lt(VERGL) ? HOCH : VERGL;
    }
  }
  return st;
};
mst56.MST56 = MST56;
Object.defineProperty(upmlst, "__esModule", { value: true });
upmlst.UPMLST = void 0;
var big_js_1$b = require$$0;
var uptab_1$1 = uptab;
var mst56_1$1 = mst56;
var UPMLST = function(_a, CONFIG) {
  var STKL2 = _a.STKL, ZVE = _a.ZVE, KZTAB2 = _a.KZTAB;
  var X2;
  if (ZVE.lt(1)) {
    X2 = new big_js_1$b.default(0);
  } else {
    X2 = ZVE.div(KZTAB2).round(0, big_js_1$b.default.roundDown);
  }
  return STKL2 !== 5 && STKL2 !== 6 ? (0, uptab_1$1.UPTAB)({ X: X2, KZTAB: KZTAB2 }, CONFIG) : (0, mst56_1$1.MST56)({ X: X2, KZTAB: KZTAB2 }, CONFIG);
};
upmlst.UPMLST = UPMLST;
var __assign$5 = commonjsGlobal && commonjsGlobal.__assign || function() {
  __assign$5 = Object.assign || function(t2) {
    for (var s2, i = 1, n2 = arguments.length; i < n2; i++) {
      s2 = arguments[i];
      for (var p2 in s2) if (Object.prototype.hasOwnProperty.call(s2, p2))
        t2[p2] = s2[p2];
    }
    return t2;
  };
  return __assign$5.apply(this, arguments);
};
var __rest$4 = commonjsGlobal && commonjsGlobal.__rest || function(s2, e) {
  var t2 = {};
  for (var p2 in s2) if (Object.prototype.hasOwnProperty.call(s2, p2) && e.indexOf(p2) < 0)
    t2[p2] = s2[p2];
  if (s2 != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p2 = Object.getOwnPropertySymbols(s2); i < p2.length; i++) {
      if (e.indexOf(p2[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s2, p2[i]))
        t2[p2[i]] = s2[p2[i]];
    }
  return t2;
};
Object.defineProperty(mlstjahr, "__esModule", { value: true });
mlstjahr.MLSTJAHR = void 0;
var big_js_1$a = require$$0;
var upevp_1 = upevp;
var upmlst_1 = upmlst;
var MLSTJAHR = function(PARAMS2, CONFIG) {
  var VKAPA = PARAMS2.VKAPA, VMT = PARAMS2.VMT, ZTABFB = PARAMS2.ZTABFB, ZRE4 = PARAMS2.ZRE4, STKL2 = PARAMS2.STKL, KZTAB2 = PARAMS2.KZTAB, UPEVP_INPUT = __rest$4(PARAMS2, ["VKAPA", "VMT", "ZTABFB", "ZRE4", "STKL", "KZTAB"]);
  var ZVE;
  var vmt100 = VMT.div(100);
  var vkapa100 = VKAPA.div(100);
  var ST;
  var STOVMT = new big_js_1$a.default(0);
  var KENNVMT2 = CONFIG.KENNVMT;
  var _a = (0, upevp_1.UPEVP)(__assign$5({ STKL: STKL2 }, UPEVP_INPUT), CONFIG), VSP = _a.VSP, VSP2 = _a.VSP2, VSP3 = _a.VSP3;
  if (KENNVMT2 !== 1) {
    ZVE = ZRE4.minus(ZTABFB).minus(VSP).round(2, big_js_1$a.default.roundDown);
    ST = (0, upmlst_1.UPMLST)({ ZVE, STKL: STKL2, KZTAB: KZTAB2 }, CONFIG);
  } else {
    ZVE = ZRE4.minus(ZTABFB).minus(VSP).minus(vmt100).minus(vkapa100).round(2, big_js_1$a.default.roundDown);
    if (ZVE.lt(0)) {
      ZVE = ZVE.add(vmt100).add(vkapa100).div(5).round(2, big_js_1$a.default.roundDown);
      var tempST = (0, upmlst_1.UPMLST)({ STKL: STKL2, KZTAB: KZTAB2, ZVE }, CONFIG);
      ST = tempST.mul(5).round(0, big_js_1$a.default.roundDown);
    } else {
      STOVMT = (0, upmlst_1.UPMLST)({ STKL: STKL2, KZTAB: KZTAB2, ZVE }, CONFIG);
      ZVE = ZVE.add(VMT.add(VKAPA).div(500)).round(2, big_js_1$a.default.roundDown);
      ST = (0, upmlst_1.UPMLST)({ ZVE, STKL: STKL2, KZTAB: KZTAB2 }, CONFIG).minus(STOVMT).mul(5).add(STOVMT).round(0, big_js_1$a.default.roundDown);
    }
  }
  return {
    ST,
    VSP2,
    VSP3,
    ZVE
  };
};
mlstjahr.MLSTJAHR = MLSTJAHR;
var uplstlzz = {};
var upanteil = {};
Object.defineProperty(upanteil, "__esModule", { value: true });
upanteil.UPANTEIL = void 0;
var big_js_1$9 = require$$0;
var UPANTEIL = function(_a) {
  var JW = _a.JW, LZZ2 = _a.LZZ;
  var ANTEIL1;
  switch (LZZ2) {
    case 1:
      ANTEIL1 = JW;
      break;
    case 2:
      ANTEIL1 = JW.div(12).round(0, big_js_1$9.default.roundDown);
      break;
    case 3:
      ANTEIL1 = JW.mul(7).div(360).round(0, big_js_1$9.default.roundDown);
      break;
    default:
      ANTEIL1 = JW.div(360).round(0, big_js_1$9.default.roundDown);
  }
  return { ANTEIL1 };
};
upanteil.UPANTEIL = UPANTEIL;
Object.defineProperty(uplstlzz, "__esModule", { value: true });
uplstlzz.UPLSTLZZ = void 0;
var upanteil_1$2 = upanteil;
var UPLSTLZZ = function(_a) {
  var LSTJAHR = _a.LSTJAHR, LZZ2 = _a.LZZ;
  var JW = LSTJAHR.mul(100);
  var LSTLZZ = (0, upanteil_1$2.UPANTEIL)({ JW, LZZ: LZZ2 }).ANTEIL1;
  return { LSTLZZ };
};
uplstlzz.UPLSTLZZ = UPLSTLZZ;
var upvklzz = {};
var upvkv = {};
Object.defineProperty(upvkv, "__esModule", { value: true });
upvkv.UPVKV = void 0;
var big_js_1$8 = require$$0;
var UPVKV = function(_a) {
  var PKV2 = _a.PKV, VSP2 = _a.VSP2, VSP3 = _a.VSP3;
  var VKV;
  if (PKV2 > 0) {
    if (VSP2.gt(VSP3)) {
      VKV = VSP2.mul(100);
    } else {
      VKV = VSP3.mul(100);
    }
  } else {
    VKV = new big_js_1$8.default(0);
  }
  return { VKV };
};
upvkv.UPVKV = UPVKV;
Object.defineProperty(upvklzz, "__esModule", { value: true });
upvklzz.UPVKLZZ = void 0;
var upvkv_1$1 = upvkv;
var upanteil_1$1 = upanteil;
var UPVKLZZ = function(_a) {
  var LZZ2 = _a.LZZ, PKV2 = _a.PKV, VSP2 = _a.VSP2, VSP3 = _a.VSP3;
  var JW = (0, upvkv_1$1.UPVKV)({ PKV: PKV2, VSP2, VSP3 }).VKV;
  var VKVLZZ = (0, upanteil_1$1.UPANTEIL)({ JW, LZZ: LZZ2 }).ANTEIL1;
  return { VKVLZZ };
};
upvklzz.UPVKLZZ = UPVKLZZ;
var msolz = {};
Object.defineProperty(msolz, "__esModule", { value: true });
msolz.MSOLZ = void 0;
var big_js_1$7 = require$$0;
var upanteil_1 = upanteil;
var MSOLZ = function(_a) {
  var KZTAB2 = _a.KZTAB, LZZ2 = _a.LZZ, R2 = _a.R, JBMG = _a.JBMG, SOLZFREI = _a.SOLZFREI;
  var solzfrei = SOLZFREI.mul(KZTAB2);
  var JW;
  var SOLZLZZ;
  var BK;
  if (JBMG.gt(solzfrei)) {
    var SOLZJ = JBMG.mul(5.5).div(100);
    var SOLZMIN = JBMG.add(solzfrei).mul(11.9).div(100);
    if (SOLZMIN.lt(SOLZJ)) {
      SOLZJ = SOLZMIN;
    }
    JW = SOLZJ.mul(100);
    var ANTEIL1 = (0, upanteil_1.UPANTEIL)({ JW, LZZ: LZZ2 }).ANTEIL1;
    SOLZLZZ = ANTEIL1;
  } else {
    SOLZLZZ = new big_js_1$7.default(0);
  }
  if (R2 > 0) {
    JW = JBMG.mul(100);
    var ANTEIL1 = (0, upanteil_1.UPANTEIL)({ JW, LZZ: LZZ2 }).ANTEIL1;
    BK = ANTEIL1;
  } else {
    BK = new big_js_1$7.default(0);
  }
  return { SOLZLZZ, BK };
};
msolz.MSOLZ = MSOLZ;
var __assign$4 = commonjsGlobal && commonjsGlobal.__assign || function() {
  __assign$4 = Object.assign || function(t2) {
    for (var s2, i = 1, n2 = arguments.length; i < n2; i++) {
      s2 = arguments[i];
      for (var p2 in s2) if (Object.prototype.hasOwnProperty.call(s2, p2))
        t2[p2] = s2[p2];
    }
    return t2;
  };
  return __assign$4.apply(this, arguments);
};
var __rest$3 = commonjsGlobal && commonjsGlobal.__rest || function(s2, e) {
  var t2 = {};
  for (var p2 in s2) if (Object.prototype.hasOwnProperty.call(s2, p2) && e.indexOf(p2) < 0)
    t2[p2] = s2[p2];
  if (s2 != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p2 = Object.getOwnPropertySymbols(s2); i < p2.length; i++) {
      if (e.indexOf(p2[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s2, p2[i]))
        t2[p2[i]] = s2[p2[i]];
    }
  return t2;
};
Object.defineProperty(mberech, "__esModule", { value: true });
mberech.MBERECH = void 0;
var big_js_1$6 = require$$0;
var mztabfb_1$2 = mztabfb;
var mlstjahr_1$3 = mlstjahr;
var uplstlzz_1 = uplstlzz;
var upvklzz_1 = upvklzz;
var mre4abz_1$3 = mre4abz;
var msolz_1 = msolz;
var MBERECH = function(_a, CONFIG) {
  var FVB = _a.FVB, FVBZ = _a.FVBZ, FVBZSO = _a.FVBZSO, ZRE4 = _a.ZRE4, ZRE4VP = _a.ZRE4VP, ZRE4J = _a.ZRE4J, ZVBEZ = _a.ZVBEZ, ZVBEZJ = _a.ZVBEZJ, ALTE = _a.ALTE, JLFREIB = _a.JLFREIB, JLHINZU = _a.JLHINZU, INPUTDATA = __rest$3(_a, ["FVB", "FVBZ", "FVBZSO", "ZRE4", "ZRE4VP", "ZRE4J", "ZVBEZ", "ZVBEZJ", "ALTE", "JLFREIB", "JLHINZU"]);
  var WVFRB;
  var JBMG;
  var GFB = CONFIG.GFB, SOLZFREI = CONFIG.SOLZFREI;
  var _b = (0, mztabfb_1$2.MZTABFB)(__assign$4(__assign$4({}, INPUTDATA), { ZRE4, ZVBEZ, FVBZ, FVBZSO }), CONFIG), ANP = _b.ANP, KFB = _b.KFB, ZTABFB = _b.ZTABFB, fvbz = _b.FVBZ, KZTAB2 = _b.KZTAB;
  var VFRB = ANP.add(FVB).add(fvbz).mul(100);
  var _c = (0, mlstjahr_1$3.MLSTJAHR)(__assign$4(__assign$4({}, INPUTDATA), { ZRE4, ZRE4VP, KZTAB: KZTAB2, ZTABFB }), CONFIG), ST = _c.ST, ZVE = _c.ZVE, VSP2 = _c.VSP2, VSP3 = _c.VSP3;
  WVFRB = ZVE.minus(GFB).mul(100);
  if (WVFRB.lt(0)) {
    WVFRB = new big_js_1$6.default(0);
  }
  var F2 = INPUTDATA.F, R2 = INPUTDATA.R, ZKF = INPUTDATA.ZKF, LZZ2 = INPUTDATA.LZZ, PKV2 = INPUTDATA.PKV;
  var LSTJAHR = ST.mul(F2).round(0, big_js_1$6.default.roundDown);
  var LSTLZZ = (0, uplstlzz_1.UPLSTLZZ)({ LSTJAHR, LZZ: LZZ2 }).LSTLZZ;
  var VKVLZZ = (0, upvklzz_1.UPVKLZZ)({ LZZ: LZZ2, PKV: PKV2, VSP2, VSP3 }).VKVLZZ;
  if (ZKF.gt(0)) {
    var ztabfb = ZTABFB.add(KFB);
    var _d = (0, mre4abz_1$3.MRE4ABZ)(__assign$4({ ZRE4J, ZVBEZJ, FVB, ALTE, JLFREIB, JLHINZU }, INPUTDATA), CONFIG), zre4 = _d.ZRE4, zre4vp = _d.ZRE4VP;
    var ST_1 = (0, mlstjahr_1$3.MLSTJAHR)(__assign$4(__assign$4({}, INPUTDATA), { ZRE4: zre4, ZRE4VP: zre4vp, ZTABFB: ztabfb, KZTAB: KZTAB2 }), CONFIG).ST;
    JBMG = ST_1.mul(F2).round(0, big_js_1$6.default.roundDown);
  } else {
    JBMG = LSTJAHR;
  }
  var _e = (0, msolz_1.MSOLZ)({ KZTAB: KZTAB2, LZZ: LZZ2, R: R2, JBMG, SOLZFREI }), SOLZLZZ = _e.SOLZLZZ, BK = _e.BK;
  return {
    BK,
    JBMG,
    SOLZLZZ,
    LSTLZZ,
    VKVLZZ,
    VFRB,
    WVFRB,
    KZTAB: KZTAB2,
    ZTABFB
  };
};
mberech.MBERECH = MBERECH;
var msonst = {};
var mosonst = {};
var __assign$3 = commonjsGlobal && commonjsGlobal.__assign || function() {
  __assign$3 = Object.assign || function(t2) {
    for (var s2, i = 1, n2 = arguments.length; i < n2; i++) {
      s2 = arguments[i];
      for (var p2 in s2) if (Object.prototype.hasOwnProperty.call(s2, p2))
        t2[p2] = s2[p2];
    }
    return t2;
  };
  return __assign$3.apply(this, arguments);
};
var __rest$2 = commonjsGlobal && commonjsGlobal.__rest || function(s2, e) {
  var t2 = {};
  for (var p2 in s2) if (Object.prototype.hasOwnProperty.call(s2, p2) && e.indexOf(p2) < 0)
    t2[p2] = s2[p2];
  if (s2 != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p2 = Object.getOwnPropertySymbols(s2); i < p2.length; i++) {
      if (e.indexOf(p2[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s2, p2[i]))
        t2[p2[i]] = s2[p2[i]];
    }
  return t2;
};
Object.defineProperty(mosonst, "__esModule", { value: true });
mosonst.MOSONST = void 0;
var big_js_1$5 = require$$0;
var mre4_1$1 = mre4;
var mre4abz_1$2 = mre4abz;
var mztabfb_1$1 = mztabfb;
var mlstjahr_1$2 = mlstjahr;
var MOSONST = function(_a, CONFIG) {
  var INPUTDATA = __rest$2(_a, []);
  var JRE4 = INPUTDATA.JRE4, JRE4ENT = INPUTDATA.JRE4ENT, JVBEZ = INPUTDATA.JVBEZ, JFREIB = INPUTDATA.JFREIB, JHINZU = INPUTDATA.JHINZU;
  var zre4j = JRE4.div(100);
  var zvbezj = JVBEZ.div(100);
  var jlfreib = JFREIB.div(100);
  var jlhinzu = JHINZU.div(100);
  var _b = (0, mre4_1$1.MRE4)(__assign$3(__assign$3({}, INPUTDATA), { ZRE4J: zre4j, ZVBEZJ: zvbezj }), CONFIG), FVB = _b.FVB, FVBZ = _b.FVBZ, FVBZSO = _b.FVBZSO, ALTE = _b.ALTE;
  var _c = (0, mre4abz_1$2.MRE4ABZ)(__assign$3(__assign$3({}, INPUTDATA), { ZRE4J: zre4j, ZVBEZJ: zvbezj, JLFREIB: jlfreib, JLHINZU: jlhinzu, FVB, ALTE }), CONFIG), ZRE4 = _c.ZRE4, ZRE4VP = _c.ZRE4VP, ZVBEZ = _c.ZVBEZ;
  var zre4vp = ZRE4VP.minus(JRE4ENT.div(100));
  var _d = (0, mztabfb_1$1.MZTABFB)(__assign$3(__assign$3({}, INPUTDATA), { ZRE4, ZVBEZ, FVBZ, FVBZSO }), CONFIG), ANP = _d.ANP, fvbzNew = _d.FVBZ, KZTAB2 = _d.KZTAB, ZTABFB = _d.ZTABFB, KFB = _d.KFB;
  var VFRBS1 = ANP.add(FVB).add(fvbzNew).mul(100);
  var _e = (0, mlstjahr_1$2.MLSTJAHR)(__assign$3(__assign$3({}, INPUTDATA), { ZRE4VP: zre4vp, ZTABFB, ZRE4, KZTAB: KZTAB2 }), CONFIG), ST = _e.ST, ZVE = _e.ZVE, VSP2 = _e.VSP2, VSP3 = _e.VSP3;
  var GFB = CONFIG.GFB;
  var WVFRBO = ZVE.minus(GFB).mul(100);
  if (WVFRBO.lt(0)) {
    WVFRBO = new big_js_1$5.default(0);
  }
  var LSTOSO = ST.mul(100);
  return { VFRBS1, WVFRBO, LSTOSO, VSP2, VSP3, KZTAB: KZTAB2, ZTABFB, KFB, ZRE4, ZRE4VP: zre4vp };
};
mosonst.MOSONST = MOSONST;
var mre4sonst = {};
var __assign$2 = commonjsGlobal && commonjsGlobal.__assign || function() {
  __assign$2 = Object.assign || function(t2) {
    for (var s2, i = 1, n2 = arguments.length; i < n2; i++) {
      s2 = arguments[i];
      for (var p2 in s2) if (Object.prototype.hasOwnProperty.call(s2, p2))
        t2[p2] = s2[p2];
    }
    return t2;
  };
  return __assign$2.apply(this, arguments);
};
Object.defineProperty(mre4sonst, "__esModule", { value: true });
mre4sonst.MRE4SONST = void 0;
var mre4_1 = mre4;
var mre4abz_1$1 = mre4abz;
var mztabfb_1 = mztabfb;
var MRE4SONST = function(PARAMS2, CONFIG) {
  var STKL2 = PARAMS2.STKL, ZKF = PARAMS2.ZKF, ZRE4J = PARAMS2.ZRE4J, ZVBEZJ = PARAMS2.ZVBEZJ, JLFREIB = PARAMS2.JLFREIB, JLHINZU = PARAMS2.JLHINZU, JRE4ENT = PARAMS2.JRE4ENT, MBV = PARAMS2.MBV, SONSTENT = PARAMS2.SONSTENT, VFRBS1 = PARAMS2.VFRBS1;
  var mbv100 = MBV.div(100);
  var jre4ent100 = JRE4ENT.div(100);
  var sonstent100 = SONSTENT.div(100);
  var _a = (0, mre4_1.MRE4)(PARAMS2, CONFIG), FVBSO = _a.FVBSO, ALTE = _a.ALTE, FVBZSO = _a.FVBZSO;
  var fvb = FVBSO;
  var _b = (0, mre4abz_1$1.MRE4ABZ)(__assign$2(__assign$2({}, PARAMS2), { FVB: fvb, ZRE4J, ZVBEZJ, ALTE, JLFREIB, JLHINZU }), CONFIG), ZRE4 = _b.ZRE4, ZVBEZ = _b.ZVBEZ, ZRE4VP = _b.ZRE4VP;
  var zre4vp = ZRE4VP.add(mbv100).minus(jre4ent100).minus(sonstent100);
  var fvbz = FVBZSO;
  var ANP = (0, mztabfb_1.MZTABFB)({
    ZRE4,
    ZVBEZ,
    FVBZ: fvbz,
    FVBZSO,
    ZKF,
    STKL: STKL2
  }, CONFIG).ANP;
  var VFRBS2 = ANP.add(fvb).add(fvbz).mul(100).minus(VFRBS1);
  return {
    VFRBS2,
    FVB: fvb,
    FVBZ: fvbz,
    ZRE4VP: zre4vp
  };
};
mre4sonst.MRE4SONST = MRE4SONST;
var stsmin = {};
var msolzsts = {};
Object.defineProperty(msolzsts, "__esModule", { value: true });
msolzsts.MSOLZSTS = void 0;
var big_js_1$4 = require$$0;
var uptab_1 = uptab;
var mst56_1 = mst56;
var MSOLZSTS = function(_a, CONFIG) {
  var F2 = _a.F, STS = _a.STS, ZKF = _a.ZKF, STKL2 = _a.STKL, ZVE = _a.ZVE, KFB = _a.KFB, KZTAB2 = _a.KZTAB;
  var SOLZS;
  var SOLZSZVE;
  var X2;
  var ST;
  var SOLZFREI = CONFIG.SOLZFREI;
  if (ZKF.gt(0)) {
    SOLZSZVE = ZVE.minus(KFB);
  } else {
    SOLZSZVE = ZVE;
  }
  if (SOLZSZVE.lt(1)) {
    SOLZSZVE = new big_js_1$4.default(0);
    X2 = new big_js_1$4.default(0);
  } else {
    X2 = SOLZSZVE.div(KZTAB2).round(-1, big_js_1$4.default.roundDown);
  }
  if (STKL2 < 5) {
    ST = (0, uptab_1.UPTAB)({ X: X2, KZTAB: KZTAB2 }, CONFIG);
  } else {
    ST = (0, mst56_1.MST56)({ X: X2, KZTAB: KZTAB2 }, CONFIG);
  }
  var SOLZSBMG = ST.mul(F2).round(-1, big_js_1$4.default.roundDown);
  if (SOLZSBMG.gt(SOLZFREI)) {
    SOLZS = STS.mul("5.5").div(100).round(2, big_js_1$4.default.roundDown);
  } else {
    SOLZS = new big_js_1$4.default(0);
  }
  return {
    SOLZS,
    SOLZSBMG,
    SOLZSZVE
  };
};
msolzsts.MSOLZSTS = MSOLZSTS;
Object.defineProperty(stsmin, "__esModule", { value: true });
stsmin.STSMIN = void 0;
var big_js_1$3 = require$$0;
var msolzsts_1 = msolzsts;
var STSMIN = function(_a, CONFIG) {
  var R2 = _a.R, F2 = _a.F, STKL2 = _a.STKL, STS = _a.STS, MBV = _a.MBV, BK = _a.BK, LSTLZZ = _a.LSTLZZ, SOLZLZZ = _a.SOLZLZZ, ZKF = _a.ZKF, ZVE = _a.ZVE, KZTAB2 = _a.KZTAB, KFB = _a.KFB;
  var BKS;
  var SOLZS;
  var sts = STS;
  var solzlzz = SOLZLZZ;
  var lstlzz = LSTLZZ;
  var bk2 = BK;
  if (STS.lt(0)) {
    if (!MBV.eq(0)) {
      lstlzz = LSTLZZ.add(STS);
      if (lstlzz.lt(0)) {
        lstlzz = new big_js_1$3.default(0);
      }
      solzlzz = SOLZLZZ.add(STS.mul("5,5").div(100)).round(2, big_js_1$3.default.roundDown);
      if (solzlzz.lt(0)) {
        solzlzz = new big_js_1$3.default(0);
      }
      bk2 = BK.add(STS);
      if (bk2.lt(0)) {
        bk2 = new big_js_1$3.default(0);
      }
    }
    sts = new big_js_1$3.default(0);
    SOLZS = new big_js_1$3.default(0);
  } else {
    var solzs = (0, msolzsts_1.MSOLZSTS)({
      F: F2,
      STS,
      ZKF,
      STKL: STKL2,
      ZVE,
      KFB,
      KZTAB: KZTAB2
    }, CONFIG).SOLZS;
    SOLZS = solzs;
  }
  if (R2 > 0) {
    BKS = sts;
  } else {
    BKS = new big_js_1$3.default(0);
  }
  return {
    BK: bk2,
    BKS,
    STS: sts,
    SOLZS,
    LSTLZZ: lstlzz,
    SOLZLZZ: solzlzz
  };
};
stsmin.STSMIN = STSMIN;
var __assign$1 = commonjsGlobal && commonjsGlobal.__assign || function() {
  __assign$1 = Object.assign || function(t2) {
    for (var s2, i = 1, n2 = arguments.length; i < n2; i++) {
      s2 = arguments[i];
      for (var p2 in s2) if (Object.prototype.hasOwnProperty.call(s2, p2))
        t2[p2] = s2[p2];
    }
    return t2;
  };
  return __assign$1.apply(this, arguments);
};
var __rest$1 = commonjsGlobal && commonjsGlobal.__rest || function(s2, e) {
  var t2 = {};
  for (var p2 in s2) if (Object.prototype.hasOwnProperty.call(s2, p2) && e.indexOf(p2) < 0)
    t2[p2] = s2[p2];
  if (s2 != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p2 = Object.getOwnPropertySymbols(s2); i < p2.length; i++) {
      if (e.indexOf(p2[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s2, p2[i]))
        t2[p2[i]] = s2[p2[i]];
    }
  return t2;
};
Object.defineProperty(msonst, "__esModule", { value: true });
msonst.MSONST = void 0;
var big_js_1$2 = require$$0;
var mosonst_1$1 = mosonst;
var upvkv_1 = upvkv;
var mre4sonst_1$1 = mre4sonst;
var mlstjahr_1$1 = mlstjahr;
var stsmin_1 = stsmin;
var MSONST = function(_a, CONFIG) {
  var MOSONSTCONFIG = __rest$1(_a, []);
  var BK = MOSONSTCONFIG.BK, F2 = MOSONSTCONFIG.F, ZMVB = MOSONSTCONFIG.ZMVB, MBV = MOSONSTCONFIG.MBV, SONSTB = MOSONSTCONFIG.SONSTB, JRE4 = MOSONSTCONFIG.JRE4, PKV2 = MOSONSTCONFIG.PKV, VBS = MOSONSTCONFIG.VBS, JVBEZ = MOSONSTCONFIG.JVBEZ, STERBE = MOSONSTCONFIG.STERBE;
  var lzz = 1;
  var VKVSONST;
  var LSTSO;
  var STS;
  var SOLZS;
  var BKS;
  var WVFRBO = new big_js_1$2.default(0);
  var WVFRBM = new big_js_1$2.default(0);
  var VFRBS1 = new big_js_1$2.default(0);
  var VFRBS2 = new big_js_1$2.default(0);
  var bkNeu = BK;
  var GFB = CONFIG.GFB;
  var zmvb = ZMVB === 0 ? 12 : ZMVB;
  if (SONSTB.eq(0) && MBV.eq(0)) {
    VKVSONST = new big_js_1$2.default(0);
    LSTSO = new big_js_1$2.default(0);
    STS = new big_js_1$2.default(0);
    SOLZS = new big_js_1$2.default(0);
    BKS = new big_js_1$2.default(0);
  } else {
    var _b = (0, mosonst_1$1.MOSONST)(__assign$1(__assign$1({}, MOSONSTCONFIG), { LZZ: lzz, ZMVB: zmvb }), CONFIG), vfrbs1 = _b.VFRBS1, wvfrbo = _b.WVFRBO, LSTOSO = _b.LSTOSO, vsp2mosonst = _b.VSP2, vsp3mosonst = _b.VSP3, KZTAB2 = _b.KZTAB, ZTABFB = _b.ZTABFB, ZRE4 = _b.ZRE4, KFB = _b.KFB;
    VFRBS1 = vfrbs1;
    WVFRBO = wvfrbo;
    var vkv1 = (0, upvkv_1.UPVKV)({ PKV: PKV2, VSP2: vsp2mosonst, VSP3: vsp3mosonst }).VKV;
    VKVSONST = vkv1;
    var zre4j = JRE4.add(SONSTB).div(100);
    var zvbezj = JVBEZ.add(VBS).div(100);
    var _c = (0, mre4sonst_1$1.MRE4SONST)(__assign$1(__assign$1({}, MOSONSTCONFIG), { LZZ: lzz, VFRBS1: vfrbs1, ZRE4J: zre4j, ZVBEZJ: zvbezj, ZMVB: zmvb }), __assign$1(__assign$1({}, CONFIG), { VBEZBSO: STERBE })), vfrbs2 = _c.VFRBS2, ZRE4VP = _c.ZRE4VP;
    VFRBS2 = vfrbs2;
    var _d = (0, mlstjahr_1$1.MLSTJAHR)(__assign$1(__assign$1({}, MOSONSTCONFIG), { ZTABFB, ZRE4, ZRE4VP, KZTAB: KZTAB2 }), __assign$1(__assign$1({}, CONFIG), { VBEZBSO: STERBE })), ST = _d.ST, ZVE = _d.ZVE, vsp2mlstjahr = _d.VSP2, vsp3mlstjahr = _d.VSP3;
    var WVFRBM_1 = ZVE.minus(GFB).mul(100);
    if (WVFRBM_1.lt(0)) {
      WVFRBM_1 = new big_js_1$2.default(0);
    }
    var vkv2 = (0, upvkv_1.UPVKV)({ PKV: PKV2, VSP2: vsp2mlstjahr, VSP3: vsp3mlstjahr }).VKV;
    VKVSONST = vkv2.minus(VKVSONST);
    LSTSO = ST.mul(100);
    STS = LSTSO.minus(LSTOSO).mul(F2);
    var _e = (0, stsmin_1.STSMIN)(__assign$1(__assign$1({}, MOSONSTCONFIG), { KZTAB: KZTAB2, STS, ZVE, KFB }), CONFIG), bk2 = _e.BK, bks = _e.BKS, solzs = _e.SOLZS;
    bkNeu = bk2;
    BKS = bks;
    SOLZS = solzs;
  }
  return {
    VKVSONST,
    VFRBS1,
    VFRBS2,
    STS,
    BKS,
    BK: bkNeu,
    SOLZS,
    LSTSO,
    WVFRBM,
    WVFRBO
  };
};
msonst.MSONST = MSONST;
var mvmt = {};
var __assign = commonjsGlobal && commonjsGlobal.__assign || function() {
  __assign = Object.assign || function(t2) {
    for (var s2, i = 1, n2 = arguments.length; i < n2; i++) {
      s2 = arguments[i];
      for (var p2 in s2) if (Object.prototype.hasOwnProperty.call(s2, p2))
        t2[p2] = s2[p2];
    }
    return t2;
  };
  return __assign.apply(this, arguments);
};
var __rest = commonjsGlobal && commonjsGlobal.__rest || function(s2, e) {
  var t2 = {};
  for (var p2 in s2) if (Object.prototype.hasOwnProperty.call(s2, p2) && e.indexOf(p2) < 0)
    t2[p2] = s2[p2];
  if (s2 != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p2 = Object.getOwnPropertySymbols(s2); i < p2.length; i++) {
      if (e.indexOf(p2[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s2, p2[i]))
        t2[p2[i]] = s2[p2[i]];
    }
  return t2;
};
Object.defineProperty(mvmt, "__esModule", { value: true });
mvmt.MVMT = void 0;
var big_js_1$1 = require$$0;
var mosonst_1 = mosonst;
var constants_1$1 = constants;
var mre4sonst_1 = mre4sonst;
var mlstjahr_1 = mlstjahr;
var mre4abz_1 = mre4abz;
var MVMT = function(_a, CONFIG) {
  var MOSONSTCONFIG = __rest(_a, []);
  var R2 = MOSONSTCONFIG.R, F2 = MOSONSTCONFIG.F, VFRBS1 = MOSONSTCONFIG.VFRBS1, JRE4 = MOSONSTCONFIG.JRE4, JRE4ENT = MOSONSTCONFIG.JRE4ENT, JVBEZ = MOSONSTCONFIG.JVBEZ, ZRE4 = MOSONSTCONFIG.ZRE4, ZTABFB = MOSONSTCONFIG.ZTABFB, VKAPA = MOSONSTCONFIG.VKAPA, VMT = MOSONSTCONFIG.VMT, VBS = MOSONSTCONFIG.VBS, LSTSO = MOSONSTCONFIG.LSTSO, STERBE = MOSONSTCONFIG.STERBE, SONSTB = MOSONSTCONFIG.SONSTB, SONSTENT = MOSONSTCONFIG.SONSTENT, JBMG = MOSONSTCONFIG.JBMG, KZTAB2 = MOSONSTCONFIG.KZTAB;
  var SOLZVBMG;
  var STV;
  var SOLZV;
  var BKV;
  var vbezbso;
  var zre4j;
  var zre4vp;
  var zvbezj;
  var kennvmt;
  var vfrbs1 = VFRBS1;
  var kztab = KZTAB2;
  var zre4 = ZRE4;
  var ztabfb = ZTABFB;
  var LST1 = new big_js_1$1.default(0);
  var LST2 = new big_js_1$1.default(0);
  var LST3 = new big_js_1$1.default(0);
  var vkapa = VKAPA;
  var SOLZFREI = CONFIG.SOLZFREI;
  if (VKAPA.lt(0)) {
    vkapa = new big_js_1$1.default(0);
  }
  if (VMT.add(vkapa).gt(0)) {
    if (LSTSO.eq(0)) {
      var _b = (0, mosonst_1.MOSONST)(__assign(__assign({}, MOSONSTCONFIG), { VKAPA: vkapa }), CONFIG), LSTOSO = _b.LSTOSO, VFRBS1_1 = _b.VFRBS1, ZTABFB_1 = _b.ZTABFB, KZTAB_1 = _b.KZTAB, ZRE4_1 = _b.ZRE4;
      vfrbs1 = VFRBS1_1;
      kztab = KZTAB_1;
      zre4 = ZRE4_1;
      ztabfb = ZTABFB_1;
      LST1 = LSTOSO;
    } else {
      LST1 = LSTSO;
    }
    vbezbso = STERBE.add(VKAPA);
    zre4j = JRE4.add(SONSTB).add(VMT).add(VKAPA).div(100);
    zvbezj = JVBEZ.add(VBS).add(VKAPA).div(100);
    kennvmt = constants_1$1.KENNVMT.VORPAU;
    var _c = (0, mre4sonst_1.MRE4SONST)(__assign(__assign({}, MOSONSTCONFIG), { VFRBS1: vfrbs1, ZRE4J: zre4j, ZVBEZJ: zvbezj, VKAPA: vkapa }), __assign(__assign({}, CONFIG), { VBEZBSO: vbezbso, KENNVMT: kennvmt })), zrevp1 = _c.ZRE4VP, FVB = _c.FVB;
    var st1 = (0, mlstjahr_1.MLSTJAHR)(__assign(__assign({}, MOSONSTCONFIG), { KZTAB: kztab, VKAPA: vkapa, ZRE4VP: zrevp1, ZRE4: zre4, ZTABFB: ztabfb }), CONFIG).ST;
    LST3 = st1.mul(100);
    var zre4vp2 = (0, mre4abz_1.MRE4ABZ)(__assign(__assign({}, MOSONSTCONFIG), { ZRE4J: zre4j, ZVBEZJ: zvbezj, FVB }), __assign(__assign({}, CONFIG), { VBEZBSO: vbezbso, KENNVMT: kennvmt })).ZRE4VP;
    zre4vp = zre4vp2.minus(JRE4ENT.div(100)).minus(SONSTENT.div(100));
    kennvmt = constants_1$1.KENNVMT.MJTAT;
    var st2 = (0, mlstjahr_1.MLSTJAHR)(__assign(__assign({}, MOSONSTCONFIG), { KZTAB: kztab, ZRE4VP: zre4vp, ZRE4: zre4, ZTABFB: ztabfb, VKAPA, VMT }), __assign(__assign({}, CONFIG), { VBEZBSO: vbezbso, KENNVMT: kennvmt })).ST;
    LST2 = st2.mul(100);
    STV = LST2.minus(LST1);
    LST3 = LST3.minus(LST1);
    if (LST3.lt(STV)) {
      STV = LST3;
    }
    if (STV.lt(0)) {
      STV = new big_js_1$1.default(0);
    } else {
      STV = STV.mul(F2).round(-1, big_js_1$1.default.roundDown);
    }
    SOLZVBMG = STV.div(100).add(JBMG);
    if (SOLZVBMG.gt(SOLZFREI)) {
      SOLZV = STV.mul("5,5").div(100).round(2, big_js_1$1.default.roundDown);
    } else {
      SOLZV = new big_js_1$1.default(0);
    }
    if (R2 > 0) {
      BKV = STV;
    } else {
      BKV = new big_js_1$1.default(0);
    }
  } else {
    STV = new big_js_1$1.default(0);
    SOLZV = new big_js_1$1.default(0);
    BKV = new big_js_1$1.default(0);
  }
  return {
    STV,
    BKV,
    SOLZV
  };
};
mvmt.MVMT = MVMT;
var input = {};
Object.defineProperty(input, "__esModule", { value: true });
input.INPUTS = void 0;
var big_js_1 = require$$0;
var constants_1 = constants;
var INPUTS = (
  /** @class */
  /* @__PURE__ */ function() {
    function INPUTS2(PARAMETER) {
      this.AJAHR = 0;
      this.VJAHR = 0;
      this.STKL = PARAMETER.STKL;
      this.LZZ = PARAMETER.LZZ;
      this.RE4 = PARAMETER.RE4;
      this.AF = void 0 === PARAMETER.AF ? false : PARAMETER.AF;
      this.F = void 0 === PARAMETER.F ? new big_js_1.default(0) : PARAMETER.F;
      this.R = void 0 === PARAMETER.R ? 0 : PARAMETER.R;
      this.ALTER1 = void 0 === PARAMETER.ALTER1 ? false : PARAMETER.ALTER1;
      this.AJAHR = void 0 === PARAMETER.AJAHR ? 0 : PARAMETER.AJAHR;
      this.VJAHR = void 0 === PARAMETER.VJAHR ? 0 : PARAMETER.VJAHR;
      this.ZMVB = void 0 === PARAMETER.ZMVB ? 0 : PARAMETER.ZMVB;
      this.PVS = void 0 === PARAMETER.PVS ? false : PARAMETER.PVS;
      this.PVZ = void 0 === PARAMETER.PVZ ? false : PARAMETER.PVZ;
      this.KRV = void 0 === PARAMETER.KRV ? constants_1.KRV.BBGW : PARAMETER.KRV;
      this.PKV = void 0 === PARAMETER.PKV ? constants_1.PKV.GKA : PARAMETER.PKV;
      this.PKPV = void 0 === PARAMETER.PKPV ? new big_js_1.default(0) : PARAMETER.PKPV;
      this.ZKF = void 0 === PARAMETER.ZKF ? new big_js_1.default(0) : PARAMETER.ZKF;
      this.JFREIB = void 0 === PARAMETER.JFREIB ? new big_js_1.default(0) : PARAMETER.JFREIB;
      this.JHINZU = void 0 === PARAMETER.JHINZU ? new big_js_1.default(0) : PARAMETER.JHINZU;
      this.KVZ = void 0 === PARAMETER.KVZ ? new big_js_1.default(0) : PARAMETER.KVZ;
      this.ENTSCH = void 0 === PARAMETER.ENTSCH ? new big_js_1.default(0) : PARAMETER.ENTSCH;
      this.LZZHINZU = void 0 === PARAMETER.LZZHINZU ? new big_js_1.default(0) : PARAMETER.LZZHINZU;
      this.LZZFREIB = void 0 === PARAMETER.LZZFREIB ? new big_js_1.default(0) : PARAMETER.LZZFREIB;
      this.MBV = void 0 === PARAMETER.MBV ? new big_js_1.default(0) : PARAMETER.MBV;
      this.JRE4 = void 0 === PARAMETER.JRE4 ? new big_js_1.default(0) : PARAMETER.JRE4;
      this.JRE4ENT = void 0 === PARAMETER.JRE4ENT ? new big_js_1.default(0) : PARAMETER.JRE4ENT;
      this.VBEZ = void 0 === PARAMETER.VBEZ ? new big_js_1.default(0) : PARAMETER.VBEZ;
      this.JVBEZ = void 0 === PARAMETER.JVBEZ ? new big_js_1.default(0) : PARAMETER.JVBEZ;
      this.VBEZS = void 0 === PARAMETER.VBEZS ? new big_js_1.default(0) : PARAMETER.VBEZS;
      this.VBEZM = void 0 === PARAMETER.VBEZM ? new big_js_1.default(0) : PARAMETER.VBEZM;
      this.VKAPA = void 0 === PARAMETER.VKAPA ? new big_js_1.default(0) : PARAMETER.VKAPA;
      this.VMT = void 0 === PARAMETER.VMT ? new big_js_1.default(0) : PARAMETER.VMT;
      this.SONSTB = void 0 === PARAMETER.SONSTB ? new big_js_1.default(0) : PARAMETER.SONSTB;
      this.SONSTENT = void 0 === PARAMETER.SONSTENT ? new big_js_1.default(0) : PARAMETER.SONSTENT;
      this.VBS = void 0 === PARAMETER.VBS ? new big_js_1.default(0) : PARAMETER.VBS;
      this.STERBE = void 0 === PARAMETER.STERBE ? new big_js_1.default(0) : PARAMETER.STERBE;
      return this;
    }
    return INPUTS2;
  }()
);
input.INPUTS = INPUTS;
(function(exports) {
  var __assign2 = commonjsGlobal && commonjsGlobal.__assign || function() {
    __assign2 = Object.assign || function(t2) {
      for (var s2, i = 1, n2 = arguments.length; i < n2; i++) {
        s2 = arguments[i];
        for (var p2 in s2) if (Object.prototype.hasOwnProperty.call(s2, p2))
          t2[p2] = s2[p2];
      }
      return t2;
    };
    return __assign2.apply(this, arguments);
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.LST2023 = exports.LST2022 = exports.LST = void 0;
  var mpara_1 = mpara;
  var mre4jl_1 = mre4jl;
  var mre4_12 = mre4;
  var mre4abz_12 = mre4abz;
  var mberech_1 = mberech;
  var msonst_1 = msonst;
  var mvmt_1 = mvmt;
  var input_1 = input;
  var LST = function(YEAR, INPUT) {
    var INPUTDATA = new input_1.INPUTS(INPUT);
    var CONFIGURATION = (0, mpara_1.MPARA)(YEAR, INPUTDATA);
    var _a = (0, mre4jl_1.MRE4JL)(INPUTDATA), ZRE4J = _a.ZRE4J, JLHINZU = _a.JLHINZU, JLFREIB = _a.JLFREIB, ZVBEZJ = _a.ZVBEZJ, f2 = _a.F;
    INPUTDATA.F = f2;
    var _b = (0, mre4_12.MRE4)(__assign2(__assign2({}, INPUTDATA), { ZVBEZJ, ZRE4J }), CONFIGURATION), ALTE = _b.ALTE, FVB = _b.FVB, FVBZ = _b.FVBZ, FVBZSO = _b.FVBZSO;
    var _c = (0, mre4abz_12.MRE4ABZ)(__assign2(__assign2({}, INPUTDATA), { ZRE4J, ZVBEZJ, FVB, ALTE, JLFREIB, JLHINZU }), CONFIGURATION), ZRE4 = _c.ZRE4, ZRE4VP = _c.ZRE4VP, ZVBEZ = _c.ZVBEZ;
    var _d = (0, mberech_1.MBERECH)(__assign2(__assign2({}, INPUTDATA), { ZRE4, ZRE4J, ZRE4VP, ZVBEZ, ZVBEZJ, FVB, FVBZ, FVBZSO, ALTE, JLFREIB, JLHINZU }), CONFIGURATION), mberechBK = _d.BK, VFRB = _d.VFRB, VKVLZZ = _d.VKVLZZ, SOLZLZZ = _d.SOLZLZZ, LSTLZZ = _d.LSTLZZ, JBMG = _d.JBMG, KZTAB2 = _d.KZTAB, ZTABFB = _d.ZTABFB, WVFRB = _d.WVFRB;
    var _e = (0, msonst_1.MSONST)(__assign2(__assign2({}, INPUTDATA), { BK: mberechBK, JLFREIB, JLHINZU, LSTLZZ, SOLZLZZ }), CONFIGURATION), VKVSONST = _e.VKVSONST, VFRBS1 = _e.VFRBS1, VFRBS2 = _e.VFRBS2, SOLZS = _e.SOLZS, STS = _e.STS, BKS = _e.BKS, BK = _e.BK, LSTSO = _e.LSTSO, WVFRBM = _e.WVFRBM, WVFRBO = _e.WVFRBO;
    var _f = (0, mvmt_1.MVMT)(__assign2(__assign2({}, INPUTDATA), { LSTSO, VFRBS1, KZTAB: KZTAB2, ZTABFB, ALTE, JLFREIB, JLHINZU, ZRE4, JBMG }), CONFIGURATION), BKV = _f.BKV, SOLZV = _f.SOLZV, STV = _f.STV;
    return {
      BK: BK.toNumber(),
      BKS: BKS.toNumber(),
      BKV: BKV.toNumber(),
      LSTLZZ: LSTLZZ.toNumber(),
      SOLZLZZ: SOLZLZZ.toNumber(),
      SOLZS: SOLZS.toNumber(),
      SOLZV: SOLZV.toNumber(),
      STS: STS.toNumber(),
      STV: STV.toNumber(),
      VKVLZZ: VKVLZZ.toNumber(),
      VKVSONST: VKVSONST.toNumber(),
      VFRB: VFRB.toNumber(),
      VFRBS1: VFRBS1.toNumber(),
      VFRBS2: VFRBS2.toNumber(),
      WVFRB: WVFRB.toNumber(),
      WVFRBO: WVFRBO.toNumber(),
      WVFRBM: WVFRBM.toNumber()
    };
  };
  exports.LST = LST;
  var LST2022 = function(INPUT) {
    return (0, exports.LST)(2022, INPUT);
  };
  exports.LST2022 = LST2022;
  var LST2023 = function(INPUT) {
    return (0, exports.LST)(2023, INPUT);
  };
  exports.LST2023 = LST2023;
})(lst$1);
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.LST2023 = exports.LST2022 = exports.LST = void 0;
  var lst_1 = lst$1;
  Object.defineProperty(exports, "LST", { enumerable: true, get: function() {
    return lst_1.LST;
  } });
  Object.defineProperty(exports, "LST2022", { enumerable: true, get: function() {
    return lst_1.LST2022;
  } });
  Object.defineProperty(exports, "LST2023", { enumerable: true, get: function() {
    return lst_1.LST2023;
  } });
})(cjs);
class BmfSteuerRechnerParameter {
  constructor() {
    this.LZZ = 0;
    this.RE4 = 0;
    this.STKL = 1;
    this.ZKF = 0;
    this.R = 0;
    this.PKV = 0;
    this.KVZ = 0;
    this.PVS = 0;
    this.PVZ = 0;
    this.KRV = 0;
    this.ALTER1 = 0;
    this.AF = 0;
    this.F = 0;
  }
}
function urlSearchParamsOf(bmfSteuerRechnerParameter) {
  return new URLSearchParams(
    JSON.parse(JSON.stringify(bmfSteuerRechnerParameter))
  );
}
function errorOf(calculationErrorCode) {
  return new Error(calculationErrorCode);
}
const bmfSteuerRechnerAvailableYearsRemote = "2021,2022".split(
  ","
).map((year) => Number.parseInt(year));
const bmfSteuerRechnerAvailableYearsLib = "2022,2023".split(
  ","
).map((year) => Number.parseInt(year));
function bmfSteuerRechnerUrlOf(lohnSteuerJahr, bmfSteuerRechnerParameter) {
  if (!bmfSteuerRechnerAvailableYearsRemote.includes(lohnSteuerJahr)) {
    throw errorOf("BmfSteuerRechnerNotImplementedForLohnsteuerjahr");
  }
  const version = `${lohnSteuerJahr}Version1`;
  const searchParams = urlSearchParamsOf(bmfSteuerRechnerParameter);
  searchParams.append("code", "2022eP");
  const urlPath = `/interface/${version}.xhtml?${searchParams.toString()}`;
  const domain = "";
  if (domain.length > 0) {
    return `https://${domain}${urlPath}`;
  } else {
    return urlPath;
  }
}
class BmfSteuerRechnerResponse {
  constructor() {
    this.BK = new Big(0);
    this.BKS = new Big(0);
    this.BKV = new Big(0);
    this.LSTLZZ = new Big(0);
    this.SOLZLZZ = new Big(0);
    this.SOLZS = new Big(0);
    this.SOLZV = new Big(0);
    this.STS = new Big(0);
    this.STV = new Big(0);
    this.VKVLZZ = new Big(0);
    this.VKVSONST = new Big(0);
  }
}
var BmfSteuerRechnerResponseParser;
((BmfSteuerRechnerResponseParser2) => {
  const parser = new DOMParser();
  const fillResponseFromXmlElement = (xmlElement, response) => {
    const name = xmlElement.getAttribute("name");
    if (name == null) {
      return;
    }
    const value = xmlElement.getAttribute("value");
    if (value == null) {
      return;
    }
    let fieldName;
    for (fieldName in response) {
      if (fieldName === name) {
        response[fieldName] = Big(value).div(100);
      }
    }
  };
  function parse2(xml) {
    const response = new BmfSteuerRechnerResponse();
    const document2 = parser.parseFromString(xml, "text/xml");
    const ausgabeElementList = document2.getElementsByTagName("ausgabe");
    for (let i = 0; i < ausgabeElementList.length; i++) {
      const xmlElement = ausgabeElementList.item(i);
      if (xmlElement) {
        fillResponseFromXmlElement(xmlElement, response);
      }
    }
    return response;
  }
  BmfSteuerRechnerResponseParser2.parse = parse2;
})(BmfSteuerRechnerResponseParser || (BmfSteuerRechnerResponseParser = {}));
var BmfSteuerRechnerResponseConverter;
((BmfSteuerRechnerResponseConverter2) => {
  BmfSteuerRechnerResponseConverter2.convert = (lstOutput) => ({
    BK: toBigEuro(lstOutput.BK),
    BKS: toBigEuro(lstOutput.BKS),
    BKV: toBigEuro(lstOutput.BKV),
    LSTLZZ: toBigEuro(lstOutput.LSTLZZ),
    SOLZLZZ: toBigEuro(lstOutput.SOLZLZZ),
    SOLZS: toBigEuro(lstOutput.SOLZS),
    SOLZV: toBigEuro(lstOutput.SOLZV),
    STS: toBigEuro(lstOutput.STS),
    STV: toBigEuro(lstOutput.STV),
    VKVLZZ: toBigEuro(lstOutput.VKVLZZ),
    VKVSONST: toBigEuro(lstOutput.VKVSONST)
  });
  const toBigEuro = (cent) => Big(cent).div(100);
})(BmfSteuerRechnerResponseConverter || (BmfSteuerRechnerResponseConverter = {}));
var BmfSteuerRechnerParameterConverter;
((BmfSteuerRechnerParameterConverter2) => {
  BmfSteuerRechnerParameterConverter2.convert = (parameter) => ({
    LZZ: parameter.LZZ,
    RE4: Big(parameter.RE4),
    STKL: parameter.STKL,
    ZKF: Big(parameter.ZKF),
    R: parameter.R,
    PKV: parameter.PKV,
    KVZ: Big(parameter.KVZ),
    PVS: parameter.PVS === 1,
    PVZ: parameter.PVZ === 1,
    KRV: parameter.KRV,
    ALTER1: parameter.ALTER1 === 1,
    AF: parameter.AF === 1,
    F: Big(parameter.F)
  });
})(BmfSteuerRechnerParameterConverter || (BmfSteuerRechnerParameterConverter = {}));
var BmfSteuerRechner;
((BmfSteuerRechner2) => {
  BmfSteuerRechner2.USE_REMOTE_STEUER_RECHNER = false;
  async function call(lohnSteuerJahr, bmfSteuerRechnerParameter) {
    let response;
    if (BmfSteuerRechner2.USE_REMOTE_STEUER_RECHNER) {
      response = await callRemoteRechner(
        lohnSteuerJahr,
        bmfSteuerRechnerParameter
      );
    } else {
      response = await callRechnerLib(
        lohnSteuerJahr,
        bmfSteuerRechnerParameter
      );
    }
    return response;
  }
  BmfSteuerRechner2.call = call;
})(BmfSteuerRechner || (BmfSteuerRechner = {}));
async function callRechnerLib(lohnSteuerJahr, bmfSteuerRechnerParameter) {
  const lstInput = BmfSteuerRechnerParameterConverter.convert(
    bmfSteuerRechnerParameter
  );
  const lstOutput = lst(lohnSteuerJahr, lstInput);
  return BmfSteuerRechnerResponseConverter.convert(lstOutput);
}
function lst(lohnSteuerJahr, lstInput) {
  if (lohnSteuerJahr === 2022) {
    return cjs.LST("2022.1", lstInput);
  }
  return cjs.LST("2023.1", lstInput);
}
async function callRemoteRechner(lohnSteuerJahr, bmfSteuerRechnerParameter) {
  const url = bmfSteuerRechnerUrlOf(lohnSteuerJahr, bmfSteuerRechnerParameter);
  const xml = await queryBmfSteuerRechner(url);
  return BmfSteuerRechnerResponseParser.parse(xml);
}
const queryBmfSteuerRechner = (url) => {
  return fetch(url).then(function(response) {
    return response.text();
  }).catch(function(reason) {
    console.error(reason);
    throw errorOf("BmfSteuerRechnerCallFailed");
  });
};
var Logger;
((Logger2) => {
  function log(message) {
  }
  Logger2.log = log;
})(Logger || (Logger = {}));
class EgrSteuerRechner {
  static bestLohnSteuerJahrOf(wahrscheinlichesGeburtsDatum) {
    const geburtsDatumJahr = wahrscheinlichesGeburtsDatum.getFullYear();
    const jahrVorDerGeburt = geburtsDatumJahr - 1;
    const availableYears = BmfSteuerRechner.USE_REMOTE_STEUER_RECHNER ? bmfSteuerRechnerAvailableYearsRemote : bmfSteuerRechnerAvailableYearsLib;
    if (availableYears.includes(jahrVorDerGeburt)) {
      return jahrVorDerGeburt;
    }
    const minAvailableYear = Math.min(...availableYears);
    if (jahrVorDerGeburt < minAvailableYear) {
      return minAvailableYear;
    }
    const maxAvailableYear = Math.max(...availableYears);
    if (jahrVorDerGeburt > maxAvailableYear) {
      return maxAvailableYear;
    }
    throw errorOf("BmfSteuerRechnerNotImplementedForLohnsteuerjahr");
  }
  /**
   * Ermittlung der Abgaben unter Nutzung der Schnittstelle des Brutto-Netto-Rechners des BMF.
   *
   * Source: de.init.anton.plugins.egr.service.BruttoNettoRechner.abgabenSteuern(...)
   *
   * @param {FinanzDaten} finanzDaten Angaben zum Einkommen.
   * @param {ErwerbsArt} erwerbsArt Art des Einkommens (selbstständig, angestellt, ...)
   * @param bruttoProMonat Steuerpflichtiger durchschnittlicher Arbeitslohn pro Monat für das angegebene Jahr.
   * @param lohnSteuerJahr Das Lohnsteuerjahr des angegebenen steuerpflichtigen Arbeitslohns.
   */
  async abgabenSteuern(finanzDaten, erwerbsArt, bruttoProMonat, lohnSteuerJahr) {
    const parameter = new BmfSteuerRechnerParameter();
    if (erwerbsArt === ErwerbsArt.JA_NICHT_SELBST_MINI) {
      finanzDaten.kinderFreiBetrag = KinderFreiBetrag.ZKF0;
    }
    parameter.KVZ = 0.9;
    parameter.ALTER1 = 0;
    if (finanzDaten.steuerKlasse === SteuerKlasse.SKL4_FAKTOR) {
      parameter.AF = 1;
      parameter.F = finanzDaten.splittingFaktor ?? 1;
    } else {
      parameter.AF = 0;
      parameter.F = 1;
    }
    const steuerklasseNumber = steuerklasseToNumber(finanzDaten.steuerKlasse);
    parameter.STKL = steuerklasseNumber === void 0 ? 1 : steuerklasseNumber;
    parameter.ZKF = kinderFreiBetragToNumber(finanzDaten.kinderFreiBetrag);
    parameter.R = finanzDaten.zahlenSieKirchenSteuer === YesNo.NO ? 0 : 1;
    parameter.KRV = erwerbsArt === ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI ? 2 : 0;
    parameter.LZZ = 2;
    let einkommenInCent = bruttoProMonat.mul(Big(100));
    if (ErwerbsArt.JA_SELBSTSTAENDIG === erwerbsArt) {
      einkommenInCent = einkommenInCent.add(
        EgrBerechnungParamId.PAUSCH.mul(Big(100))
      );
    }
    parameter.RE4 = einkommenInCent.round(0, Big.roundHalfUp).toNumber();
    try {
      const bmfResponse = await BmfSteuerRechner.call(
        lohnSteuerJahr,
        parameter
      );
      return bmfAbgabenOf(bmfResponse);
    } catch (e) {
      Logger.log(e);
      throw errorOf("BmfSteuerRechnerCallFailed");
    }
  }
}
class BruttoNettoRechner {
  constructor() {
    this.egrSteuerRechner = new EgrSteuerRechner();
  }
  /**
   * Methode zum Ermitteln der Abzüge anhand des durchschnittlichen monatlichen Bruttogehaltes
   *
   * @param {Big} bruttoProMonat Steuerpflichtiger durchschnittlicher Arbeitslohn pro Monat für das angegebene Jahr.
   * @param {number} lohnSteuerJahr Das Lohnsteuerjahr des angegebenen steuerpflichtigen Arbeitslohns.
   * @param {FinanzDaten} finanzDaten Angaben zum Einkommen.
   * @param {ErwerbsArt} erwerbsArt Art des Einkommens (selbstständig, angestellt, ...)
   * @return {Big} Die Höhe der Abzüge.
   * @throws EgrBerechnungException
   */
  async abzuege(bruttoProMonat, lohnSteuerJahr, finanzDaten, erwerbsArt) {
    let rentenversicherungspflichtig = finanzDaten.rentenVersicherung === RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG;
    let krankenversicherungspflichtig = finanzDaten.kassenArt === KassenArt.GESETZLICH_PFLICHTVERSICHERT;
    if (erwerbsArt === ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI) {
      rentenversicherungspflichtig = true;
    }
    if (erwerbsArt === ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI) {
      rentenversicherungspflichtig = false;
      krankenversicherungspflichtig = false;
    }
    if (erwerbsArt === ErwerbsArt.JA_NICHT_SELBST_MINI) {
      krankenversicherungspflichtig = false;
      rentenversicherungspflichtig = true;
    }
    let steuerKlasse = finanzDaten.steuerKlasse;
    let splittingFaktor = finanzDaten.splittingFaktor;
    if (erwerbsArt === ErwerbsArt.JA_SELBSTSTAENDIG) {
      steuerKlasse = SteuerKlasse.SKL4;
      splittingFaktor = 1;
    }
    finanzDaten.steuerKlasse = steuerKlasse;
    finanzDaten.splittingFaktor = splittingFaktor;
    return await this.berechneSteuernAbgaben(
      finanzDaten,
      krankenversicherungspflichtig,
      rentenversicherungspflichtig,
      erwerbsArt,
      bruttoProMonat,
      lohnSteuerJahr
    );
  }
  /**
   * Methode zum Ermitteln des Zwischenergebnisses, wurde aus VB übernommen. Variablen haben identische Namen wie in
   * VB. Soll auch so bleiben.
   *
   * @param {FinanzDaten} finanzdaten
   * @param erwerbsArtVorGeburt
   * @param lohnSteuerJahr
   * @return {NettoEinkommen}
   */
  async nettoEinkommenZwischenErgebnis(finanzdaten, erwerbsArtVorGeburt, lohnSteuerJahr) {
    const netto = new Einkommen(0);
    const status = erwerbsArtVorGeburt;
    const brutto = finanzdaten.bruttoEinkommen.value;
    const art_rv = finanzdaten.rentenVersicherung;
    const art_kv = finanzdaten.kassenArt;
    let rentenversicherungspflichtig;
    let krankenversicherungspflichtig;
    rentenversicherungspflichtig = art_rv === RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG;
    krankenversicherungspflichtig = art_kv === KassenArt.GESETZLICH_PFLICHTVERSICHERT;
    if (status === ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI) {
      rentenversicherungspflichtig = false;
      krankenversicherungspflichtig = false;
    }
    if (status === ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI) {
      rentenversicherungspflichtig = true;
    }
    if (status !== ErwerbsArt.JA_NICHT_SELBST_MINI) {
      const steuerUndAbgaben = await this.berechneSteuernAbgaben(
        finanzdaten,
        krankenversicherungspflichtig,
        rentenversicherungspflichtig,
        status,
        brutto,
        lohnSteuerJahr
      );
      netto.value = brutto.sub(steuerUndAbgaben);
    } else {
      netto.value = brutto;
    }
    return netto;
  }
  /**
   * Methode errechnet Abzüge (Lohnsteuer, Kirchensteuer) vom Bruttogehalt.
   */
  async summeSteuer(finanzdaten, erwerbsArt, bruttoProMonat, lohnSteuerJahr) {
    const charge = await this.egrSteuerRechner.abgabenSteuern(
      finanzdaten,
      erwerbsArt,
      bruttoProMonat,
      lohnSteuerJahr
    );
    const kirchensteuersatz = 8;
    let kirchenlohnsteuer = BruttoNettoRechner.calculateChurchTaxes(
      kirchensteuersatz,
      charge.bk
    );
    kirchenlohnsteuer = MathUtil.round(kirchenlohnsteuer);
    let summeSteuer = charge.lstlzz.add(charge.solzlzz);
    if (bruttoProMonat.lte(EgrBerechnungParamId.GRENZE_MINI_MIDI)) {
      kirchenlohnsteuer = MathUtil.BIG_ZERO;
      summeSteuer = MathUtil.BIG_ZERO;
    }
    Logger.log(`Lohnsteuer: ${charge.lstlzz}`);
    Logger.log(`SoliZuschlag: ${charge.solzlzz}`);
    Logger.log(`Kirchensteuer: ${kirchenlohnsteuer}`);
    return summeSteuer.add(kirchenlohnsteuer);
  }
  /**
   * Methode errechnet Abzüge vom Bruttogehalt in Summe (Lohnsteuer, Kirchensteuer und Sozialabgaben).
   */
  async berechneSteuernAbgaben(finanzdaten, krankenversicherungspflichtig, rentenversicherungspflichtig, status, bruttoProMonat, lohnSteuerJahr) {
    const summeSteuer = await this.summeSteuer(
      finanzdaten,
      status,
      bruttoProMonat,
      lohnSteuerJahr
    );
    let summe_sozab = BruttoNettoRechner.summer_svb(
      krankenversicherungspflichtig,
      rentenversicherungspflichtig,
      status,
      bruttoProMonat
    );
    summe_sozab = MathUtil.round(summe_sozab);
    Logger.log(`Summe Sozialabgaben: ${summe_sozab}`);
    return summeSteuer.add(summe_sozab);
  }
  /**
   * Ermittlung der Sozialversicherungsabgaben in Summe.
   */
  static summer_svb(krankenversicherungspflichtig_sub, rentenversicherungspflichtig_sub, status_sub, brutto_sub) {
    let abgaben_kvpv = MathUtil.BIG_ZERO;
    let abgaben_rv = MathUtil.BIG_ZERO;
    let abgaben_alv = MathUtil.BIG_ZERO;
    let abgaben_gleitzone = MathUtil.BIG_ZERO;
    const brutto_rech_sub = brutto_sub;
    const satz_kvpv_beeg = EgrBerechnungParamId.SATZ_KVPV_BEEG;
    const satz_rv_beeg = EgrBerechnungParamId.SATZ_RV_BEEG;
    const satz_alv_beeg = EgrBerechnungParamId.SATZ_ALV_BEEG;
    const f_faktor = EgrBerechnungParamId.F_FAKTOR;
    const grenze_mini_midi = EgrBerechnungParamId.GRENZE_MINI_MIDI;
    const grenze_midi_max = EgrBerechnungParamId.GRENZE_MIDI_MAX;
    if (brutto_rech_sub.gt(grenze_midi_max) || brutto_rech_sub.lte(grenze_mini_midi)) {
      if (krankenversicherungspflichtig_sub) {
        abgaben_kvpv = brutto_rech_sub.mul(satz_kvpv_beeg);
      }
      if (rentenversicherungspflichtig_sub) {
        abgaben_rv = brutto_rech_sub.mul(satz_rv_beeg);
      }
      if (status_sub === ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI) {
        abgaben_alv = brutto_rech_sub.mul(satz_alv_beeg);
      }
    }
    if (brutto_rech_sub.gt(grenze_mini_midi) && brutto_rech_sub.lte(grenze_midi_max)) {
      let beitragsatz = MathUtil.BIG_ZERO;
      const tmp = f_faktor.mul(grenze_mini_midi);
      const bd850_450 = grenze_midi_max.sub(grenze_mini_midi);
      const bd850 = grenze_midi_max;
      const bd450 = grenze_mini_midi;
      let x2;
      let y2;
      x2 = bd850.div(bd850_450);
      y2 = bd450.mul(f_faktor);
      y2 = y2.div(bd850_450);
      const tmp2 = x2.sub(y2);
      const tmp3 = brutto_rech_sub.sub(grenze_mini_midi);
      let bemessungsentgelt = tmp2.mul(tmp3);
      bemessungsentgelt = bemessungsentgelt.add(tmp);
      if (krankenversicherungspflichtig_sub) {
        beitragsatz = beitragsatz.add(satz_kvpv_beeg);
      }
      if (rentenversicherungspflichtig_sub) {
        beitragsatz = beitragsatz.add(satz_rv_beeg);
      }
      if (status_sub === ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI) {
        beitragsatz = beitragsatz.add(satz_alv_beeg);
      }
      abgaben_gleitzone = beitragsatz.mul(bemessungsentgelt);
      abgaben_kvpv = MathUtil.round(abgaben_kvpv);
      abgaben_rv = MathUtil.round(abgaben_rv);
      abgaben_alv = MathUtil.round(abgaben_alv);
      abgaben_gleitzone = MathUtil.round(abgaben_gleitzone);
    }
    Logger.log(`KV: ${abgaben_kvpv}`);
    Logger.log(`RV: ${abgaben_rv}`);
    Logger.log(`ALV: ${abgaben_alv}`);
    Logger.log(`Gleitzone: ${abgaben_gleitzone}`);
    return abgaben_kvpv.add(abgaben_rv).add(abgaben_alv).add(abgaben_gleitzone);
  }
  /**
   * Ermittlung der Sozialversicherungsabgaben in Summe für Mischeinkünfte
   *
   * //@formatter:off
   * Public Function summe_svb_misch(grenze_rv_sub, krankenversicherungspflichtig_sub, rentenversicherungspflichtig_sub, status_sub, brutto_sub)
   *
   * 'Berechnung Sozialabgaben
   *
   * abgaben_kvpv = 0
   * abgaben_rv = 0
   * abgaben_alv = 0
   * abgaben_gleitzone = 0
   * brutto_rech_sub = brutto_sub
   *
   * If krankenversicherungspflichtig_sub = 1 Then abgaben_kvpv = brutto_rech_sub * satz_kvpv_beeg
   * If rentenversicherungspflichtig_sub = 1 Then abgaben_rv = brutto_rech_sub * satz_rv_beeg
   * If status_sub = 2 Then abgaben_alv = brutto_rech_sub * satz_alv_beeg
   *
   * abgaben_kvpv = Round(abgaben_kvpv, 2)
   * abgaben_rv = Round(abgaben_rv, 2)
   * abgaben_alv = Round(abgaben_alv, 2)
   * summe_svb_misch = Round(abgaben_kvpv + abgaben_rv + abgaben_alv, 2)
   * End Function
   * //@formatter:on
   *
   * @param {boolean} krankenversicherungspflichtig_sub
   * @param {boolean} rentenversicherungspflichtig_sub
   * @param {ErwerbsArt} status_sub
   * @param {Big} brutto_sub
   * @return {Big}
   */
  summe_svb_misch(krankenversicherungspflichtig_sub, rentenversicherungspflichtig_sub, status_sub, brutto_sub) {
    let abgaben_kvpv = MathUtil.BIG_ZERO;
    let abgaben_rv = MathUtil.BIG_ZERO;
    let abgaben_alv = MathUtil.BIG_ZERO;
    const brutto_rech_sub = brutto_sub;
    const satz_kvpv_beeg = EgrBerechnungParamId.SATZ_KVPV_BEEG;
    const satz_rv_beeg = EgrBerechnungParamId.SATZ_RV_BEEG;
    const satz_alv_beeg = EgrBerechnungParamId.SATZ_ALV_BEEG;
    if (krankenversicherungspflichtig_sub) {
      abgaben_kvpv = brutto_rech_sub.mul(satz_kvpv_beeg);
    }
    if (rentenversicherungspflichtig_sub) {
      abgaben_rv = brutto_rech_sub.mul(satz_rv_beeg);
    }
    if (status_sub === ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI) {
      abgaben_alv = brutto_rech_sub.mul(satz_alv_beeg);
    }
    abgaben_kvpv = MathUtil.round(abgaben_kvpv);
    abgaben_rv = MathUtil.round(abgaben_rv);
    abgaben_alv = MathUtil.round(abgaben_alv);
    Logger.log(`KV: ${abgaben_kvpv}`);
    Logger.log(`RV: ${abgaben_rv}`);
    Logger.log(`ALV: ${abgaben_alv}`);
    return MathUtil.round(abgaben_kvpv.add(abgaben_rv).add(abgaben_alv));
  }
  static calculateChurchTaxes(kirchensteuersatz, bk2) {
    return bk2.div(MathUtil.BIG_100).mul(Big(kirchensteuersatz));
  }
}
const ANZAHL_MONATE_PRO_JAHR = 12;
class BasisEgAlgorithmus extends AbstractAlgorithmus {
  /**
   * Bildet die Berechnung von Netto und Basiselterngeld für Mischeinkommen ab.
   *
   * @param {PersoenlicheDaten} persoenlicheDaten Persönliche Angaben für die Berechnung des Elterngeldes.
   * @param {FinanzDaten} finanzDaten Angaben zum Einkommen.
   * @param {number} lohnSteuerJahr Das Lohnsteuerjahr des angegebenen steuerpflichtigen Arbeitslohns.
   *
   * @return Das Zwischenergebnis bei Mischeinkommen.
   */
  async berechneMischNettoUndBasiselterngeld(persoenlicheDaten, finanzDaten, lohnSteuerJahr) {
    let netto;
    let steuern = Big(0);
    let abgaben = Big(0);
    finanzDaten.mischEinkommenTaetigkeiten.forEach((mischEkTaetigkeit) => {
      if (MathUtil.greater(
        mischEkTaetigkeit.bruttoEinkommenDurchschnitt,
        EgrBerechnungParamId.GRENZE_MINI_MIDI
      ) && MathUtil.lessOrEqual(
        mischEkTaetigkeit.bruttoEinkommenDurchschnitt,
        EgrBerechnungParamId.GRENZE_MIDI_MAX
      ) && mischEkTaetigkeit.erwerbsTaetigkeit === ErwerbsTaetigkeit.NICHT_SELBSTSTAENDIG) {
        const midiRange = EgrBerechnungParamId.GRENZE_MIDI_MAX.sub(
          EgrBerechnungParamId.GRENZE_MINI_MIDI
        );
        const overMini = mischEkTaetigkeit.bruttoEinkommenDurchschnitt.sub(
          EgrBerechnungParamId.GRENZE_MINI_MIDI
        );
        const faktoredMin = EgrBerechnungParamId.F_FAKTOR.mul(
          EgrBerechnungParamId.GRENZE_MINI_MIDI
        );
        const faktoredMidi = EgrBerechnungParamId.GRENZE_MIDI_MAX.sub(
          faktoredMin
        ).div(midiRange).mul(overMini);
        mischEkTaetigkeit.bruttoEinkommenDurchschnittMidi = faktoredMin.add(faktoredMidi);
      }
    });
    let betrachtungsmonate = 0;
    let letzter_Betrachtungsmonat = 0;
    let zaehler_Pauschmonate = 0;
    const monate_pausch = new Array(12).fill(0);
    for (let i = 0; i < ANZAHL_MONATE_PRO_JAHR; i++) {
      let tmpBetrachtungsmonateFlag = false;
      const array2 = finanzDaten.mischEinkommenTaetigkeiten;
      for (let index = 0; index < array2.length; index++) {
        const mischEkTaetigkeit = array2[index];
        if (mischEkTaetigkeit.bemessungsZeitraumMonate[i]) {
          tmpBetrachtungsmonateFlag = true;
        }
        if (mischEkTaetigkeit.bemessungsZeitraumMonate[i] && mischEkTaetigkeit.erwerbsTaetigkeit !== ErwerbsTaetigkeit.SELBSTSTAENDIG && monate_pausch[i] === 0) {
          zaehler_Pauschmonate++;
          monate_pausch[i] = 1;
        }
      }
      if (tmpBetrachtungsmonateFlag) {
        betrachtungsmonate++;
        letzter_Betrachtungsmonat = i;
      }
    }
    let summe_EK_SS = MathUtil.BIG_ZERO;
    let summe_EK_NS = MathUtil.BIG_ZERO;
    let summe_EK_NS_SV = MathUtil.BIG_ZERO;
    let summe_EK_GNS = MathUtil.BIG_ZERO;
    const array = finanzDaten.mischEinkommenTaetigkeiten;
    for (let index = 0; index < array.length; index++) {
      const mischEkTaetigkeit = array[index];
      const bruttoGesamt = mischEkTaetigkeit.bruttoEinkommenDurchschnitt.mul(
        new Big(mischEkTaetigkeit.getAnzahlBemessungsZeitraumMonate())
      );
      switch (mischEkTaetigkeit.erwerbsTaetigkeit) {
        case ErwerbsTaetigkeit.SELBSTSTAENDIG:
          summe_EK_SS = summe_EK_SS.add(
            mischEkTaetigkeit.bruttoEinkommenDurchschnitt.mul(
              new Big(mischEkTaetigkeit.getAnzahlBemessungsZeitraumMonate())
            )
          );
          break;
        case ErwerbsTaetigkeit.NICHT_SELBSTSTAENDIG:
          summe_EK_NS = summe_EK_NS.add(bruttoGesamt);
          if (MathUtil.isEqual(
            mischEkTaetigkeit.bruttoEinkommenDurchschnittMidi,
            MathUtil.BIG_ZERO
          )) {
            summe_EK_NS_SV = summe_EK_NS_SV.add(bruttoGesamt);
          } else if (MathUtil.greater(
            mischEkTaetigkeit.bruttoEinkommenDurchschnittMidi,
            MathUtil.BIG_ZERO
          )) {
            summe_EK_NS_SV = summe_EK_NS_SV.add(
              mischEkTaetigkeit.bruttoEinkommenDurchschnittMidi.mul(
                new Big(mischEkTaetigkeit.getAnzahlBemessungsZeitraumMonate())
              )
            );
          }
          break;
        case ErwerbsTaetigkeit.MINIJOB:
          summe_EK_GNS = summe_EK_GNS.add(bruttoGesamt);
          break;
      }
    }
    const brutto_elg = MathUtil.round(
      summe_EK_SS.add(summe_EK_NS).add(summe_EK_GNS).sub(Big(zaehler_Pauschmonate).mul(EgrBerechnungParamId.PAUSCH)).div(ANZAHL_MONATE_PRO_JAHR),
      2
    );
    const brutto_steuer = MathUtil.round(
      summe_EK_SS.add(summe_EK_NS).div(ANZAHL_MONATE_PRO_JAHR),
      2
    );
    const brutto_sv = MathUtil.round(
      summe_EK_SS.add(summe_EK_NS_SV).div(ANZAHL_MONATE_PRO_JAHR),
      2
    );
    const betrachtungszeitraumRV = [];
    const betrachtungszeitraumKV = [];
    const betrachtungszeitraumAV = [];
    for (let i = 0; i < ANZAHL_MONATE_PRO_JAHR; i++) {
      betrachtungszeitraumRV.push(false);
      betrachtungszeitraumKV.push(false);
      betrachtungszeitraumAV.push(false);
      {
        const array2 = finanzDaten.mischEinkommenTaetigkeiten;
        for (let index = 0; index < array2.length; index++) {
          const mischEkTaetigkeit = array2[index];
          if (mischEkTaetigkeit.bemessungsZeitraumMonate[i] && mischEkTaetigkeit.erwerbsTaetigkeit !== ErwerbsTaetigkeit.MINIJOB) {
            if (mischEkTaetigkeit.rentenVersicherungsPflichtig === YesNo.YES) {
              betrachtungszeitraumRV[i] = true;
            }
            if (mischEkTaetigkeit.krankenVersicherungsPflichtig === YesNo.YES) {
              betrachtungszeitraumKV[i] = true;
            }
            if (mischEkTaetigkeit.arbeitslosenVersicherungsPflichtig === YesNo.YES) {
              betrachtungszeitraumAV[i] = true;
            }
          }
        }
      }
    }
    const betrachtungsmonate_grenze = Big(betrachtungsmonate).div(Big(2));
    let anzahl_monate_rv = MathUtil.BIG_ZERO;
    let anzahl_monate_kv = MathUtil.BIG_ZERO;
    let anzahl_monate_av = MathUtil.BIG_ZERO;
    for (let i = 0; i < ANZAHL_MONATE_PRO_JAHR; i++) {
      if (betrachtungszeitraumRV[i]) {
        anzahl_monate_rv = anzahl_monate_rv.add(MathUtil.BIG_ONE);
      }
      if (betrachtungszeitraumKV[i]) {
        anzahl_monate_kv = anzahl_monate_kv.add(MathUtil.BIG_ONE);
      }
      if (betrachtungszeitraumAV[i]) {
        anzahl_monate_av = anzahl_monate_av.add(MathUtil.BIG_ONE);
      }
    }
    let rentenversicherungspflichtig = 0;
    let krankenversicherungspflichtig = 0;
    let arbeitslosenversicherungspflichtig = 0;
    if (MathUtil.greater(anzahl_monate_rv, betrachtungsmonate_grenze)) {
      rentenversicherungspflichtig = 1;
    }
    if (MathUtil.isEqual(anzahl_monate_rv, betrachtungsmonate_grenze) && betrachtungszeitraumRV[letzter_Betrachtungsmonat]) {
      rentenversicherungspflichtig = 1;
    }
    if (MathUtil.greater(anzahl_monate_kv, betrachtungsmonate_grenze)) {
      krankenversicherungspflichtig = 1;
    }
    if (MathUtil.isEqual(anzahl_monate_kv, betrachtungsmonate_grenze) && betrachtungszeitraumKV[letzter_Betrachtungsmonat]) {
      krankenversicherungspflichtig = 1;
    }
    if (MathUtil.greater(anzahl_monate_av, betrachtungsmonate_grenze)) {
      arbeitslosenversicherungspflichtig = 1;
    }
    if (MathUtil.isEqual(anzahl_monate_av, betrachtungsmonate_grenze) && betrachtungszeitraumAV[letzter_Betrachtungsmonat]) {
      arbeitslosenversicherungspflichtig = 1;
    }
    let status = ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI;
    if (rentenversicherungspflichtig + krankenversicherungspflichtig + arbeitslosenversicherungspflichtig === 0) {
      status = ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI;
    }
    if (MathUtil.greater(summe_EK_SS, summe_EK_NS.add(summe_EK_GNS))) {
      status = ErwerbsArt.JA_SELBSTSTAENDIG;
    }
    if (MathUtil.lessOrEqual(brutto_elg, EgrBerechnungParamId.GRENZE_MINI_MIDI) && status !== ErwerbsArt.JA_SELBSTSTAENDIG) {
      status = ErwerbsArt.JA_NICHT_SELBST_MINI;
    }
    persoenlicheDaten.etVorGeburt = status;
    if (rentenversicherungspflichtig === 1) {
      finanzDaten.rentenVersicherung = RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG;
    }
    if (krankenversicherungspflichtig === 1) {
      finanzDaten.kassenArt = KassenArt.GESETZLICH_PFLICHTVERSICHERT;
    }
    if (status === ErwerbsArt.JA_NICHT_SELBST_MINI) {
      netto = brutto_elg;
    } else {
      if (status === ErwerbsArt.JA_SELBSTSTAENDIG) {
        finanzDaten.steuerKlasse = SteuerKlasse.SKL4;
        finanzDaten.splittingFaktor = 1;
      }
      if (finanzDaten.steuerKlasse === SteuerKlasse.SKL4) {
        finanzDaten.splittingFaktor = 1;
      }
      if (finanzDaten.steuerKlasse === SteuerKlasse.SKL4_FAKTOR) {
        finanzDaten.steuerKlasse = SteuerKlasse.SKL4;
      }
      Logger.log(
        `Berechne Summe der Sozialabgaben mit: kv=${krankenversicherungspflichtig}, rv=${rentenversicherungspflichtig}, status=${status}, brutto_sv=${brutto_sv}`
      );
      const summe_sozab = new BruttoNettoRechner().summe_svb_misch(
        krankenversicherungspflichtig > 0,
        rentenversicherungspflichtig > 0,
        status,
        brutto_sv
      );
      const summe_steuer_abzug = await new BruttoNettoRechner().summeSteuer(
        finanzDaten,
        status,
        brutto_steuer,
        lohnSteuerJahr
      );
      netto = brutto_elg.sub(summe_steuer_abzug).sub(summe_sozab);
      steuern = summe_steuer_abzug;
      abgaben = summe_sozab;
      Logger.log(
        `Netto (${netto}) berechnet aus Brutto ${brutto_elg} und Abgaben SV=${summe_sozab}, Steuer=${summe_steuer_abzug}`
      );
    }
    const ek_vor = netto;
    const elterngeldbasis = MathUtil.round(
      this.elterngeld_keine_et(ek_vor),
      2
    );
    return {
      krankenversicherungspflichtig: krankenversicherungspflichtig === 1,
      rentenversicherungspflichtig: rentenversicherungspflichtig === 1,
      netto,
      brutto: brutto_elg,
      steuern,
      abgaben,
      elterngeldbasis,
      status
    };
  }
}
var DateUtil;
((DateUtil2) => {
  function dateWithoutTimeOf(date) {
    return DateTime.fromJSDate(date).set({ hour: 0 }).set({ minute: 0 }).set({ second: 0 }).set({ millisecond: 0 }).toJSDate();
  }
  DateUtil2.dateWithoutTimeOf = dateWithoutTimeOf;
  function plusDays(date, days) {
    return DateTime.fromJSDate(date).plus({ days }).toJSDate();
  }
  DateUtil2.plusDays = plusDays;
  function minusDays(date, days) {
    return DateTime.fromJSDate(date).minus({ days }).toJSDate();
  }
  DateUtil2.minusDays = minusDays;
  function plusMonths(date, months2) {
    return DateTime.fromJSDate(date).plus({ months: months2 }).toJSDate();
  }
  DateUtil2.plusMonths = plusMonths;
  function plusYears(date, years) {
    return DateTime.fromJSDate(date).plus({ years }).toJSDate();
  }
  DateUtil2.plusYears = plusYears;
  function daysBetween(date1, date2) {
    return utcDateWithoutTimeOf(date2).diff(utcDateWithoutTimeOf(date1)).as("days");
  }
  DateUtil2.daysBetween = daysBetween;
  function setDayOfMonth(date, dayOfMonth) {
    return DateTime.fromJSDate(date).set({ day: dayOfMonth }).toJSDate();
  }
  DateUtil2.setDayOfMonth = setDayOfMonth;
})(DateUtil || (DateUtil = {}));
function utcDateWithoutTimeOf(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const dayOfMonth = date.getDate().toString().padStart(2, "0");
  const isoDate = `${year}-${month}-${dayOfMonth}`;
  return DateTime.fromISO(isoDate, { zone: "utc" });
}
class EgZwischenErgebnisAlgorithmus extends AbstractAlgorithmus {
  /**
   * Berechnet das Zwischenergebnis des Elterngeldrechners.
   *
   * @param {PersoenlicheDaten} persoenlicheDaten Die persönlichen Daten eines Elternteils.
   * @param {NettoEinkommen} nettoEinkommen Nettoeinkommen vor der Geburt.
   * @return {ZwischenErgebnis} Das Zwischenergebnis des Elterngeldrechners.
   */
  elterngeldZwischenergebnis(persoenlicheDaten, nettoEinkommen) {
    if (persoenlicheDaten.wahrscheinlichesGeburtsDatum === void 0) {
      throw new Error("wahrscheinlichesGeburtsDatum is undefined");
    }
    const geburt = persoenlicheDaten.wahrscheinlichesGeburtsDatum;
    const geschw = persoenlicheDaten.kinder;
    let ende = void 0;
    const ind_geschw = persoenlicheDaten.isGeschwisterVorhanden();
    const no_kinder = persoenlicheDaten.anzahlKuenftigerKinder;
    const ek_vor = ErwerbsArt.NEIN !== persoenlicheDaten.etVorGeburt ? nettoEinkommen : new Einkommen(0);
    let ek_vor_copy = MathUtil.BIG_ZERO;
    ek_vor_copy = ek_vor_copy.add(ek_vor.value);
    const status_et = persoenlicheDaten.etVorGeburt;
    let mehrlingszuschlag;
    let ende_bonus_u2_final;
    let ende_bonus_u14_final;
    let ende_bonus_u6_final;
    const pausch = EgrBerechnungParamId.PAUSCH;
    let elterngeldbasis;
    let ersatzrate_ausgabe;
    const betrag_Mehrlingszuschlag = EgrBerechnungParamId.BETRAG_MEHRLINGSZUSCHLAG;
    let geschwisterbonus;
    const rate_bonus = EgrBerechnungParamId.RATE_BONUS;
    const min_geschwisterbonus = EgrBerechnungParamId.MIN_GESCHWISTERBONUS;
    if (ind_geschw) {
      ende_bonus_u2_final = DateUtil.dateWithoutTimeOf(
        this.ende_bonus_u2(geburt, geschw)
      );
      ende_bonus_u14_final = DateUtil.dateWithoutTimeOf(
        this.ende_bonus_u14(geburt, geschw)
      );
      ende_bonus_u6_final = DateUtil.dateWithoutTimeOf(
        this.ende_bonus_u6(geburt, geschw)
      );
      if (ende_bonus_u2_final >= ende_bonus_u14_final && ende_bonus_u2_final >= ende_bonus_u6_final && ende_bonus_u2_final >= geburt) {
        ende = ende_bonus_u2_final;
      } else if (ende_bonus_u6_final >= ende_bonus_u2_final && ende_bonus_u6_final >= ende_bonus_u14_final && ende_bonus_u6_final >= geburt) {
        ende = ende_bonus_u6_final;
      } else if (ende_bonus_u14_final >= ende_bonus_u2_final && ende_bonus_u14_final >= ende_bonus_u6_final && ende_bonus_u14_final >= geburt) {
        ende = ende_bonus_u14_final;
      } else {
        ende = geburt;
      }
    }
    if (ende === void 0 || ende < geburt) {
      ende = geburt;
    }
    if (status_et === ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI || status_et === ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI || status_et === ErwerbsArt.JA_NICHT_SELBST_MINI) {
      ek_vor_copy = MathUtil.fMax(ek_vor_copy.sub(pausch), MathUtil.BIG_ZERO);
    }
    elterngeldbasis = this.elterngeld_keine_et(ek_vor_copy);
    ersatzrate_ausgabe = this.ersatzrate_eg(ek_vor_copy);
    if (no_kinder > 1) {
      mehrlingszuschlag = betrag_Mehrlingszuschlag.mul(Big(no_kinder - 1));
    } else {
      mehrlingszuschlag = MathUtil.BIG_ZERO;
    }
    if (ende !== void 0 && ende > geburt) {
      geschwisterbonus = MathUtil.fMax(
        elterngeldbasis.mul(rate_bonus),
        min_geschwisterbonus
      );
    } else {
      geschwisterbonus = MathUtil.BIG_ZERO;
    }
    elterngeldbasis = MathUtil.round(elterngeldbasis);
    ersatzrate_ausgabe = MathUtil.round(ersatzrate_ausgabe);
    geschwisterbonus = MathUtil.round(geschwisterbonus, 3);
    return {
      elternGeld: elterngeldbasis,
      ersatzRate: ersatzrate_ausgabe,
      geschwisterBonus: geschwisterbonus,
      mehrlingsZulage: mehrlingszuschlag,
      zeitraumGeschwisterBonus: ende,
      nettoVorGeburt: nettoEinkommen.value
    };
  }
  ende_bonus_u6(geburt, geschw) {
    const geschw_jung = this.fktZweitMax(
      this.onlyGeschwisterVorGeburt(geburt, geschw)
    );
    return this.ende_bonus(geburt, geschw_jung, 6);
  }
  ende_bonus_u14(geburt, geschw) {
    const geschw_b = [];
    geschw.forEach((act) => {
      if (act.istBehindert) {
        geschw_b.push(act);
      } else {
        geschw_b.push({
          nummer: act.nummer,
          geburtsdatum: new Date(1899, 11, 31),
          istBehindert: act.istBehindert
        });
      }
    });
    const geschw_jung = this.fktMax(
      this.onlyGeschwisterVorGeburt(geburt, geschw_b)
    );
    return this.ende_bonus(geburt, geschw_jung, 14);
  }
  /**
   * Geschwisterbonus wird bis zu dem Zeitpunkt gezahlt an dem ein Geschwisterkind 3 Jahre alt wird.
   * Der Zeitraum endet mit dem Ende des jeweiligen Lebensmonats des Kindes, für das Elterngeld bezogen wird.
   *
   * Public Function ende_bonus_u2(geburt, geschw)
   * geschw_jung = fktMax(geschw)
   * zweiter_geb_geschw_jung = DateSerial(Year(geschw_jung) + 3, Month(geschw_jung), Day(geschw_jung))
   * zeit_bis_ende_bonus_u2 = Max(zweiter_geb_geschw_jung - geburt, 0)
   * ende_bonus_u2 = DateSerial(Year(geburt), Month(geburt), Day(geburt) + zeit_bis_ende_bonus_u2)
   * zusatz = Day(DateSerial(Year(geburt), Month(geburt) + Dauer, Day(geburt))) - Day(ende_bonus_u2) - 1
   * If ende_bonus_u2 > geburt Then
   * If zusatz >= 0 Then
   * ende_bonus_u2 = DateSerial(Year(ende_bonus_u2), Month(ende_bonus_u2), Day(ende_bonus_u2) + zusatz)
   * ElseIf zusatz < 0 Then
   * ende_bonus_u2 = DateSerial(Year(ende_bonus_u2), Month(ende_bonus_u2) + 1, Day(ende_bonus_u2) + zusatz)
   * End If
   * End If
   * End Function
   *
   * @param {Date} geburt
   * @param {Kind[]} geschw
   * @return
   */
  ende_bonus_u2(geburt, geschw) {
    const geschw_jung = this.fktMax(
      this.onlyGeschwisterVorGeburt(geburt, geschw)
    );
    return this.ende_bonus(geburt, geschw_jung, 3);
  }
  onlyGeschwisterVorGeburt(geburt, geschw) {
    return geschw.filter((value) => {
      return value.geburtsdatum !== void 0 && value.geburtsdatum < geburt;
    });
  }
  ende_bonus(geburt, geburtstag_geschw, bonusYears) {
    let zeit_bis_ende_bonus_days = -1;
    if (geburtstag_geschw !== void 0) {
      const bonus_geb_geschw_jung = DateUtil.plusYears(
        geburtstag_geschw,
        bonusYears
      );
      if (bonus_geb_geschw_jung >= geburt) {
        zeit_bis_ende_bonus_days = DateUtil.daysBetween(
          geburt,
          bonus_geb_geschw_jung
        );
      }
    }
    let ende_bonus = DateUtil.plusDays(geburt, zeit_bis_ende_bonus_days);
    if (ende_bonus >= geburt) {
      if (geburt.getDate() <= 28) {
        ende_bonus = DateTime.fromJSDate(ende_bonus).set({ day: geburt.getDate() }).plus({ month: 1 }).minus({ day: 1 }).toJSDate();
      } else {
        ende_bonus = DateTime.fromJSDate(ende_bonus).set({ day: geburt.getDate() }).minus({ day: 1 }).plus({ month: 1 }).toJSDate();
      }
    }
    return ende_bonus;
  }
}
var ElternGeldBruttoRechner;
((ElternGeldBruttoRechner2) => {
  function bruttoEGPlusNeu(planungsergebnis, finanzDaten) {
    const bruttoLM = finanzDaten.bruttoLeistungsMonate();
    const brutto_LM_Plus = finanzDaten.bruttoLeistungsMonateWithPlanung(
      true,
      planungsergebnis
    );
    const brutto_LM_Basis = finanzDaten.bruttoLeistungsMonateWithPlanung(
      false,
      planungsergebnis
    );
    let lm_mit_et_basis = 0;
    let lm_mit_et_plus = 0;
    let summe_brutto_basis = MathUtil.BIG_ZERO;
    let summe_brutto_plus = MathUtil.BIG_ZERO;
    let brutto_basis = MathUtil.BIG_ZERO;
    let brutto_plus = MathUtil.BIG_ZERO;
    for (let i = 1; i <= PLANUNG_ANZAHL_MONATE; i++) {
      if (planungsergebnis.get(i) === ElternGeldArt.KEIN_BEZUG && MathUtil.greater(bruttoLM[i], MathUtil.BIG_ZERO)) ;
      if (!MathUtil.isEqual(brutto_LM_Basis[i], MathUtil.BIG_ZERO) && planungsergebnis.get(i) === ElternGeldArt.BASIS_ELTERNGELD) {
        lm_mit_et_basis = lm_mit_et_basis + 1;
        summe_brutto_basis = summe_brutto_basis.add(brutto_LM_Basis[i]);
      }
      if (!MathUtil.isEqual(brutto_LM_Plus[i], MathUtil.BIG_ZERO) && planungsergebnis.get(i) === ElternGeldArt.ELTERNGELD_PLUS || planungsergebnis.get(i) === ElternGeldArt.PARTNERSCHAFTS_BONUS) {
        lm_mit_et_plus = lm_mit_et_plus + 1;
        summe_brutto_plus = summe_brutto_plus.add(brutto_LM_Plus[i]);
      }
    }
    if (lm_mit_et_basis > 0) {
      brutto_basis = MathUtil.round(summe_brutto_basis.div(lm_mit_et_basis));
    }
    if (lm_mit_et_plus > 0) {
      brutto_plus = MathUtil.round(summe_brutto_plus.div(lm_mit_et_plus));
    }
    return {
      summeBruttoBasis: summe_brutto_basis,
      summeBruttoPlus: summe_brutto_plus,
      bruttoLMBasis: brutto_LM_Basis,
      bruttoLMPlus: brutto_LM_Plus,
      bruttoEinkommenDurch: brutto_basis,
      bruttoEinkommenPlusDurch: brutto_plus,
      lmMitETBasis: lm_mit_et_basis,
      lmMitETPlus: lm_mit_et_plus
    };
  }
  ElternGeldBruttoRechner2.bruttoEGPlusNeu = bruttoEGPlusNeu;
})(ElternGeldBruttoRechner || (ElternGeldBruttoRechner = {}));
class PlusEgAlgorithmus extends AbstractAlgorithmus {
  constructor() {
    super(...arguments);
    this.bruttoNettoRechner = new BruttoNettoRechner();
    this.pb_von = null;
    this.pb_bis = null;
    this.partnerbonus = YesNo.NO;
    this.anfang_LM = new Array(PLANUNG_ANZAHL_MONATE + 1);
    this.ende_LM = new Array(PLANUNG_ANZAHL_MONATE + 1);
  }
  async elterngeldPlusErgebnis(planungsergebnis, persoenlicheDaten, finanzDaten, lohnSteuerJahr, mischEkZwischenErgebnis, z2) {
    let brutto_LM_Plus = new Array(PLANUNG_ANZAHL_MONATE + 1);
    let brutto_LM_Basis = new Array(PLANUNG_ANZAHL_MONATE + 1);
    brutto_LM_Plus.fill(MathUtil.BIG_ZERO);
    brutto_LM_Basis.fill(MathUtil.BIG_ZERO);
    const etVorGeburt = persoenlicheDaten.etVorGeburt !== ErwerbsArt.NEIN;
    const eg_verlauf = planungsergebnis.planung;
    let ergebnis;
    const finanzDatenBerechnet = {
      bruttoEinkommenDurch: MathUtil.BIG_ZERO,
      bruttoEinkommenPlusDurch: MathUtil.BIG_ZERO,
      bruttoLMBasis: [],
      bruttoLMPlus: [],
      lmMitETBasis: 0,
      lmMitETPlus: 0,
      summeBruttoBasis: MathUtil.BIG_ZERO,
      summeBruttoPlus: MathUtil.BIG_ZERO
    };
    if (!etVorGeburt) {
      ergebnis = PlusEgAlgorithmus.ohneETVorGeburt();
    } else {
      ergebnis = await this.mitETVorGeburt(
        planungsergebnis,
        persoenlicheDaten,
        finanzDaten,
        lohnSteuerJahr,
        mischEkZwischenErgebnis,
        z2
      );
    }
    this.partnerbonus = YesNo.NO;
    const listBruttoLMPlus = finanzDaten.bruttoLeistungsMonateWithPlanung(
      true,
      planungsergebnis
    );
    const listBruttoLMBasis = finanzDaten.bruttoLeistungsMonateWithPlanung(
      false,
      planungsergebnis
    );
    if (listBruttoLMBasis != null && listBruttoLMBasis.length > 0) {
      brutto_LM_Basis = listBruttoLMBasis;
    }
    if (listBruttoLMPlus != null && listBruttoLMPlus.length > 0) {
      brutto_LM_Plus = listBruttoLMPlus;
    }
    finanzDatenBerechnet.bruttoLMBasis = listBruttoLMBasis;
    finanzDatenBerechnet.bruttoLMPlus = listBruttoLMPlus;
    if (!etVorGeburt) {
      finanzDatenBerechnet.bruttoLMPlus = new Array(
        PLANUNG_ANZAHL_MONATE + 1
      ).fill(MathUtil.BIG_ZERO);
    }
    const verlauf = this.determineElternGeldKategorie(
      finanzDatenBerechnet,
      eg_verlauf,
      brutto_LM_Basis,
      brutto_LM_Plus,
      etVorGeburt
    );
    ergebnis = this.validateEinkommenPartnerBonus(ergebnis);
    return this.createElterngeldAusgabe(
      persoenlicheDaten,
      finanzDaten,
      ergebnis,
      z2,
      mischEkZwischenErgebnis,
      verlauf,
      planungsergebnis
    );
  }
  static getEKVor(finanzDaten, ek_vor, mischEkZwischenErgebnis) {
    if (finanzDaten.isMischeinkommen()) {
      if (mischEkZwischenErgebnis === null) {
        throw errorOf("MischEinkommenEnabledButMissingMischEinkommen");
      }
      ek_vor = mischEkZwischenErgebnis.netto;
      if (mischEkZwischenErgebnis.status !== ErwerbsArt.JA_SELBSTSTAENDIG) {
        ek_vor = ek_vor.add(EgrBerechnungParamId.PAUSCH);
      }
    }
    return ek_vor;
  }
  static ohneETVorGeburt() {
    return {
      anfangEGPeriode: [],
      elternGeldAusgabe: [],
      endeEGPeriode: [],
      ersatzRate: MathUtil.BIG_ZERO,
      etVorGeburt: false,
      geschwisterBonus: MathUtil.BIG_ZERO,
      geschwisterBonusDeadLine: null,
      hasPartnerBonusError: false,
      mehrlingsZulage: MathUtil.BIG_ZERO,
      nettoNachGeburtDurch: MathUtil.BIG_ZERO,
      elternGeldBasis: EgrBerechnungParamId.MINDESTSATZ,
      elternGeldKeineEtPlus: EgrBerechnungParamId.MINDESTSATZ.div(Big(2)),
      message: "Sie erhalten 300 Euro Elterngeld sowie evtl. Geschwisterbonus und/oder Mehrlingszuschlag",
      bruttoBasis: MathUtil.BIG_ZERO,
      nettoBasis: MathUtil.BIG_ZERO,
      elternGeldErwBasis: MathUtil.BIG_ZERO,
      bruttoPlus: MathUtil.BIG_ZERO,
      nettoPlus: MathUtil.BIG_ZERO,
      elternGeldEtPlus: MathUtil.BIG_ZERO
    };
  }
  async mitETVorGeburt(planungsergebnis, persoenlicheDaten, finanzDaten, lohnSteuerJahr, mischEkZwischenErgebnis, z2) {
    const nicht_erw = persoenlicheDaten.etNachGeburt;
    let ek_nach_plus;
    let elterngeld_erw_plus;
    let brutto_basis = MathUtil.BIG_ZERO;
    let netto_basis = MathUtil.BIG_ZERO;
    let elterngeld_erw_basis = MathUtil.BIG_ZERO;
    let brutto_plus = MathUtil.BIG_ZERO;
    let netto_plus = MathUtil.BIG_ZERO;
    let elterngeld_et_plus = MathUtil.BIG_ZERO;
    let elterngeld_keine_et_plus = MathUtil.BIG_ZERO;
    let elternGeldPerioden = { anfang: [], ende: [] };
    if (nicht_erw === YesNo.YES) {
      const pausch = EgrBerechnungParamId.PAUSCH;
      if (persoenlicheDaten.wahrscheinlichesGeburtsDatum === void 0) {
        throw new Error("wahrscheinlichesGeburtsDatum === undefined");
      }
      const geburt = persoenlicheDaten.wahrscheinlichesGeburtsDatum;
      const anzahl_monate = zaehleMonateErwerbsTaetigkeit(
        finanzDaten.erwerbsZeitraumLebensMonatList
      );
      if (anzahl_monate != null && anzahl_monate !== 0) {
        elternGeldPerioden = PlusEgAlgorithmus.determineEGPerioden(
          finanzDaten,
          planungsergebnis
        );
        let summe_brutto_basis = MathUtil.BIG_ZERO;
        let summe_brutto_plus = MathUtil.BIG_ZERO;
        this.fillLebensMonateList(geburt);
        persoenlicheDaten.anfangLM = this.anfang_LM;
        persoenlicheDaten.endeLM = this.ende_LM;
        const finanzDatenBerechnet = ElternGeldBruttoRechner.bruttoEGPlusNeu(
          planungsergebnis,
          finanzDaten
        );
        const lm_mit_et_basis = finanzDatenBerechnet.lmMitETBasis;
        const lm_mit_et_plus = finanzDatenBerechnet.lmMitETPlus;
        const bruttoLMPlus = finanzDaten.bruttoLeistungsMonateWithPlanung(true, planungsergebnis);
        const bruttoLMBasis = finanzDaten.bruttoLeistungsMonateWithPlanung(false, planungsergebnis);
        const brutto_LM_Plus = (
          /* toArray */
          bruttoLMPlus.slice(0)
        );
        const brutto_LM_Basis = (
          /* toArray */
          bruttoLMBasis.slice(0)
        );
        let steuer_sozab_basis = MathUtil.BIG_ZERO;
        let steuer_sozab_plus = MathUtil.BIG_ZERO;
        brutto_basis = finanzDatenBerechnet.bruttoEinkommenDurch;
        brutto_plus = finanzDatenBerechnet.bruttoEinkommenPlusDurch;
        if (persoenlicheDaten.etVorGeburt === ErwerbsArt.JA_NICHT_SELBST_MINI) {
          netto_basis = brutto_basis;
          netto_plus = brutto_plus;
        } else {
          if (MathUtil.greater(brutto_basis, MathUtil.BIG_ZERO)) {
            steuer_sozab_basis = await this.bruttoNettoRechner.abzuege(
              brutto_basis,
              lohnSteuerJahr,
              finanzDaten,
              persoenlicheDaten.etVorGeburt
            );
          }
          if (MathUtil.greater(brutto_plus, MathUtil.BIG_ZERO)) {
            steuer_sozab_plus = await this.bruttoNettoRechner.abzuege(
              brutto_plus,
              lohnSteuerJahr,
              finanzDaten,
              persoenlicheDaten.etVorGeburt
            );
          }
        }
        let ek_vor = z2.nettoVorGeburt;
        ek_vor = PlusEgAlgorithmus.getEKVor(
          finanzDaten,
          ek_vor,
          mischEkZwischenErgebnis
        );
        if (MathUtil.greater(brutto_basis, MathUtil.BIG_ZERO)) {
          switch (persoenlicheDaten.etVorGeburt) {
            case ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI:
            case ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI:
            case ErwerbsArt.JA_NICHT_SELBST_MINI:
              ek_vor = MathUtil.fMax(
                MathUtil.round(ek_vor.sub(EgrBerechnungParamId.PAUSCH)),
                MathUtil.BIG_ZERO
              );
              summe_brutto_basis = MathUtil.BIG_ZERO;
              for (let i = 1; i <= PLANUNG_ANZAHL_MONATE; i++) {
                if (!MathUtil.isEqual(brutto_LM_Basis[i], MathUtil.BIG_ZERO) && planungsergebnis.get(i) === ElternGeldArt.BASIS_ELTERNGELD) {
                  summe_brutto_basis = summe_brutto_basis.add(
                    MathUtil.round(
                      MathUtil.fMax(
                        brutto_LM_Basis[i].sub(pausch),
                        MathUtil.BIG_ZERO
                      ),
                      2
                    )
                  );
                }
              }
              if (lm_mit_et_basis > 0) {
                brutto_basis = MathUtil.round(
                  summe_brutto_basis.div(Big(lm_mit_et_basis)),
                  2
                );
              }
              break;
          }
          netto_basis = MathUtil.fMax(
            brutto_basis.sub(steuer_sozab_basis),
            MathUtil.BIG_ZERO
          );
          const ek_nach_basis = netto_basis;
          elterngeld_erw_basis = MathUtil.round(
            this.elterngeld_et(ek_vor, ek_nach_basis),
            2
          );
        }
        if (MathUtil.greater(brutto_plus, MathUtil.BIG_ZERO)) {
          let status;
          if (finanzDaten.isMischeinkommen()) {
            if (mischEkZwischenErgebnis === null) {
              throw errorOf("MischEinkommenEnabledButMissingMischEinkommen");
            }
            status = mischEkZwischenErgebnis.status;
          } else {
            status = persoenlicheDaten.etVorGeburt;
          }
          ek_vor = z2.nettoVorGeburt;
          ek_vor = PlusEgAlgorithmus.getEKVor(
            finanzDaten,
            ek_vor,
            mischEkZwischenErgebnis
          );
          switch (status) {
            case ErwerbsArt.JA_NICHT_SELBST_MINI:
            case ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI:
            case ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI:
              ek_vor = MathUtil.fMax(
                ek_vor.sub(EgrBerechnungParamId.PAUSCH),
                MathUtil.BIG_ZERO
              );
              summe_brutto_plus = MathUtil.BIG_ZERO;
              for (let i = 1; i <= PLANUNG_ANZAHL_MONATE; i++) {
                if (!MathUtil.isEqual(brutto_LM_Plus[i], MathUtil.BIG_ZERO) && (planungsergebnis.get(i) === ElternGeldArt.ELTERNGELD_PLUS || planungsergebnis.get(i) === ElternGeldArt.PARTNERSCHAFTS_BONUS)) {
                  summe_brutto_plus = summe_brutto_plus.add(
                    MathUtil.round(
                      MathUtil.fMax(
                        brutto_LM_Plus[i].sub(pausch),
                        MathUtil.BIG_ZERO
                      ),
                      2
                    )
                  );
                }
              }
              if (lm_mit_et_plus > 0) {
                brutto_plus = MathUtil.round(
                  summe_brutto_plus.div(Big(lm_mit_et_plus)),
                  2
                );
              }
              break;
          }
        }
        netto_plus = MathUtil.fMax(
          brutto_plus.sub(steuer_sozab_plus),
          MathUtil.BIG_ZERO
        );
        ek_nach_plus = netto_plus;
        elterngeld_erw_plus = MathUtil.round(
          this.elterngeldplus_et(ek_vor, ek_nach_plus),
          2
        );
        elterngeld_keine_et_plus = z2.elternGeld;
        if (finanzDaten.isMischeinkommen()) {
          if (mischEkZwischenErgebnis === null) {
            throw errorOf("MischEinkommenEnabledButMissingMischEinkommen");
          }
          elterngeld_keine_et_plus = mischEkZwischenErgebnis.elterngeldbasis;
        }
        elterngeld_keine_et_plus = elterngeld_keine_et_plus.div(Big(2));
        elterngeld_et_plus = MathUtil.fMin(
          elterngeld_keine_et_plus,
          elterngeld_erw_plus
        );
      }
    } else {
      netto_plus = MathUtil.BIG_ZERO;
      elterngeld_keine_et_plus = MathUtil.BIG_ZERO;
      elterngeld_et_plus = MathUtil.BIG_ZERO;
    }
    return {
      anfangEGPeriode: elternGeldPerioden.anfang,
      endeEGPeriode: elternGeldPerioden.ende,
      elternGeldErwBasis: MathUtil.round(elterngeld_erw_basis, 2),
      bruttoBasis: MathUtil.round(brutto_basis, 2),
      nettoBasis: MathUtil.round(netto_basis, 2),
      bruttoPlus: MathUtil.round(brutto_plus, 2),
      nettoPlus: MathUtil.round(netto_plus, 2),
      elternGeldEtPlus: MathUtil.round(elterngeld_et_plus, 2),
      elternGeldKeineEtPlus: MathUtil.round(elterngeld_keine_et_plus, 2),
      elternGeldAusgabe: [],
      elternGeldBasis: MathUtil.BIG_ZERO,
      ersatzRate: MathUtil.BIG_ZERO,
      etVorGeburt: false,
      geschwisterBonus: MathUtil.BIG_ZERO,
      geschwisterBonusDeadLine: null,
      hasPartnerBonusError: false,
      mehrlingsZulage: MathUtil.BIG_ZERO,
      message: "",
      nettoNachGeburtDurch: MathUtil.BIG_ZERO
    };
  }
  fillLebensMonateList(geburt) {
    for (let i = 0; i < PLANUNG_ANZAHL_MONATE; i++) {
      const anfang = DateUtil.plusMonths(geburt, i);
      const ende = DateUtil.minusDays(
        DateUtil.plusMonths(geburt, i + 1),
        1
      );
      this.anfang_LM[i + 1] = anfang;
      this.ende_LM[i + 1] = ende;
      if (geburt.getDay() > 28 && anfang.getMonth() === 2 && anfang.getDay() < 5) {
        this.anfang_LM[i + 1] = DateUtil.setDayOfMonth(
          DateUtil.plusMonths(geburt, i + 1),
          1
        );
      }
      if (geburt.getDay() > 28 && ende.getMonth() === 2 && ende.getDay() < 5) {
        this.anfang_LM[i + 1] = DateUtil.minusDays(
          DateUtil.setDayOfMonth(DateUtil.plusMonths(geburt, i + 2), 1),
          1
        );
      }
    }
  }
  determineElternGeldKategorie(finanzDatenBerechnet, eg_verlauf, brutto_LM_Basis, brutto_LM_Plus, etVorGeburt) {
    const verlauf = new Array(PLANUNG_ANZAHL_MONATE);
    this.partnerbonus = YesNo.NO;
    let pbMonatVon = 0;
    let pbMonatBis = 0;
    let counter = 0;
    for (let index = 0; index < eg_verlauf.length; index++) {
      const monat = eg_verlauf[index];
      counter++;
      if (monat === ElternGeldArt.PARTNERSCHAFTS_BONUS && pbMonatVon === 0) {
        pbMonatVon = counter;
        pbMonatBis = counter;
      } else if (monat === ElternGeldArt.PARTNERSCHAFTS_BONUS) {
        pbMonatBis = counter;
      }
    }
    if (!etVorGeburt) {
      const brutto_LM_Plus_pb = finanzDatenBerechnet.bruttoLMPlus;
      for (let i = 1; i <= PLANUNG_ANZAHL_MONATE; i++) {
        if (eg_verlauf[i - 1] !== ElternGeldArt.BASIS_ELTERNGELD) {
          verlauf[i - 1] = ElternGeldKategorie.KEIN_ELTERN_GELD;
        }
        if (eg_verlauf[i - 1] === ElternGeldArt.BASIS_ELTERNGELD) {
          verlauf[i - 1] = ElternGeldKategorie.BASIS_ELTERN_GELD;
        }
        if (eg_verlauf[i - 1] === ElternGeldArt.ELTERNGELD_PLUS && MathUtil.isEqual(brutto_LM_Plus_pb[i], MathUtil.BIG_ZERO)) {
          verlauf[i - 1] = ElternGeldKategorie.ELTERN_GELD_PLUS_OHNE_ERWERBS_TAETIGKEIT;
        }
        if (eg_verlauf[i - 1] === ElternGeldArt.PARTNERSCHAFTS_BONUS && MathUtil.isEqual(brutto_LM_Plus_pb[i], MathUtil.BIG_ZERO)) {
          verlauf[i - 1] = ElternGeldKategorie.ELTERN_GELD_PLUS_OHNE_ERWERBS_TAETIGKEIT;
        }
        if (eg_verlauf[i - 1] === ElternGeldArt.PARTNERSCHAFTS_BONUS && MathUtil.isEqual(brutto_LM_Plus[i], MathUtil.BIG_ZERO)) {
          this.partnerbonus = YesNo.YES;
          break;
        }
      }
    } else {
      for (let i = 1; i <= PLANUNG_ANZAHL_MONATE; i++) {
        if (eg_verlauf[i - 1] === ElternGeldArt.KEIN_BEZUG) {
          verlauf[i - 1] = ElternGeldKategorie.KEIN_ELTERN_GELD;
        }
        if (eg_verlauf[i - 1] === ElternGeldArt.BASIS_ELTERNGELD && MathUtil.isEqual(brutto_LM_Basis[i], MathUtil.BIG_ZERO)) {
          verlauf[i - 1] = ElternGeldKategorie.BASIS_ELTERN_GELD;
        }
        if (eg_verlauf[i - 1] === ElternGeldArt.BASIS_ELTERNGELD && MathUtil.greater(brutto_LM_Basis[i], MathUtil.BIG_ZERO)) {
          verlauf[i - 1] = ElternGeldKategorie.BASIS_ELTERN_GELD_MIT_ERWERBS_TAETIGKEIT;
        }
        if (eg_verlauf[i - 1] === ElternGeldArt.ELTERNGELD_PLUS && MathUtil.isEqual(brutto_LM_Plus[i], MathUtil.BIG_ZERO)) {
          verlauf[i - 1] = ElternGeldKategorie.ELTERN_GELD_PLUS_OHNE_ERWERBS_TAETIGKEIT;
        }
        if (eg_verlauf[i - 1] === ElternGeldArt.PARTNERSCHAFTS_BONUS && MathUtil.isEqual(brutto_LM_Plus[i], MathUtil.BIG_ZERO)) {
          this.partnerbonus = YesNo.YES;
          break;
        }
        if (eg_verlauf[i - 1] === ElternGeldArt.ELTERNGELD_PLUS && MathUtil.greater(brutto_LM_Plus[i], MathUtil.BIG_ZERO)) {
          verlauf[i - 1] = ElternGeldKategorie.ELTERN_GELD_PLUS_MIT_ERWERBS_TAETIGKEIT;
        }
        if (eg_verlauf[i - 1] === ElternGeldArt.PARTNERSCHAFTS_BONUS && MathUtil.greater(brutto_LM_Plus[i], MathUtil.BIG_ZERO)) {
          verlauf[i - 1] = ElternGeldKategorie.ELTERN_GELD_PLUS_MIT_ERWERBS_TAETIGKEIT;
        }
      }
    }
    if (pbMonatVon !== 0 && pbMonatBis !== 0 && this.partnerbonus === YesNo.YES) {
      if (this.anfang_LM[pbMonatVon - 1] != null && this.ende_LM[pbMonatBis - 1] != null) {
        this.pb_von = this.anfang_LM[pbMonatVon - 1];
        this.pb_bis = this.ende_LM[pbMonatBis - 1];
      }
    }
    return verlauf;
  }
  createElterngeldAusgabe(persoenlicheDaten, finanzDaten, ergebnis, z2, misch, verlauf, planungsergebnis) {
    if (persoenlicheDaten.wahrscheinlichesGeburtsDatum === void 0) {
      throw new Error("wahrscheinlichesGeburtsDatum === undefined");
    }
    const ende_geschwisterbonus = z2.zeitraumGeschwisterBonus;
    const geschw = new Array(PLANUNG_ANZAHL_MONATE).fill(0);
    if (persoenlicheDaten.isGeschwisterVorhanden()) {
      const geburt = persoenlicheDaten.wahrscheinlichesGeburtsDatum;
      if (ende_geschwisterbonus != null && ende_geschwisterbonus >= geburt) {
        for (let i = 1; i <= PLANUNG_ANZAHL_MONATE; i++) {
          this.anfang_LM[i] = DateUtil.plusMonths(geburt, i - 1);
        }
        for (let i = 1; i <= PLANUNG_ANZAHL_MONATE; i++) {
          this.ende_LM[i] = DateUtil.minusDays(
            DateUtil.plusMonths(geburt, i),
            1
          );
        }
      }
      for (let i = 1; i <= PLANUNG_ANZAHL_MONATE; i++) {
        if (ende_geschwisterbonus != null && ende_geschwisterbonus >= this.ende_LM[i]) {
          geschw[i - 1] = 1;
        }
      }
    }
    ergebnis.geschwisterBonusDeadLine = ende_geschwisterbonus;
    const ausgabeLebensmonate = [];
    let basiselterngeld = z2.elternGeld;
    if (finanzDaten.isMischeinkommen()) {
      if (misch === null) {
        throw errorOf("MischEinkommenEnabledButMissingMischEinkommen");
      }
      basiselterngeld = misch.elterngeldbasis;
    }
    const basiselterngeld_erw = ergebnis.elternGeldErwBasis;
    const elterngeldplus = MathUtil.round(basiselterngeld.div(Big(2)), 2);
    const elterngeldplus_erw = ergebnis.elternGeldEtPlus;
    const betrag_mehrlingszuschlag = EgrBerechnungParamId.BETRAG_MEHRLINGSZUSCHLAG;
    const min_geschwisterbonus = EgrBerechnungParamId.MIN_GESCHWISTERBONUS;
    const rate_bonus = EgrBerechnungParamId.RATE_BONUS;
    let mehrling = 0;
    if (persoenlicheDaten.anzahlKuenftigerKinder > 0) {
      mehrling = persoenlicheDaten.anzahlKuenftigerKinder - 1;
    }
    for (let i = 1; i <= PLANUNG_ANZAHL_MONATE; i++) {
      const ausgabe = {
        lebensMonat: i,
        elterngeldArt: planungsergebnis.get(i),
        elternGeld: MathUtil.BIG_ZERO,
        geschwisterBonus: MathUtil.BIG_ZERO,
        mehrlingsZulage: MathUtil.BIG_ZERO,
        mutterschaftsLeistungMonat: false
      };
      if (PlusEgAlgorithmus.isMutterschaftsLeistungImMonat(i, planungsergebnis)) {
        ausgabe.mutterschaftsLeistungMonat = true;
      } else if (this.partnerbonus === YesNo.YES) ;
      else {
        let geschwisterbonus = MathUtil.BIG_ZERO;
        let mehrlingszuschlag = MathUtil.BIG_ZERO;
        let elterngeld = MathUtil.BIG_ZERO;
        if (verlauf[i - 1] === ElternGeldKategorie.KEIN_ELTERN_GELD) {
          geschwisterbonus = MathUtil.BIG_ZERO;
          mehrlingszuschlag = MathUtil.BIG_ZERO;
          elterngeld = MathUtil.BIG_ZERO;
        }
        if (verlauf[i - 1] === ElternGeldKategorie.BASIS_ELTERN_GELD) {
          geschwisterbonus = MathUtil.round(
            MathUtil.fMax(
              min_geschwisterbonus,
              basiselterngeld.mul(rate_bonus)
            ).mul(Big(geschw[i - 1])),
            2
          );
          mehrlingszuschlag = betrag_mehrlingszuschlag.mul(Big(mehrling));
          elterngeld = basiselterngeld.add(geschwisterbonus).add(mehrlingszuschlag);
        }
        if (verlauf[i - 1] === ElternGeldKategorie.BASIS_ELTERN_GELD_MIT_ERWERBS_TAETIGKEIT) {
          mehrlingszuschlag = betrag_mehrlingszuschlag.mul(Big(mehrling));
          geschwisterbonus = MathUtil.round(
            MathUtil.fMax(
              min_geschwisterbonus,
              basiselterngeld_erw.mul(rate_bonus)
            ).mul(Big(geschw[i - 1])),
            2
          );
          elterngeld = basiselterngeld_erw.add(geschwisterbonus).add(mehrlingszuschlag);
        }
        if (verlauf[i - 1] === ElternGeldKategorie.ELTERN_GELD_PLUS_OHNE_ERWERBS_TAETIGKEIT) {
          mehrlingszuschlag = betrag_mehrlingszuschlag.mul(Big(mehrling)).div(Big(2));
          geschwisterbonus = MathUtil.round(
            MathUtil.fMax(
              min_geschwisterbonus.div(Big(2)),
              elterngeldplus.mul(rate_bonus)
            ).mul(Big(geschw[i - 1])),
            2
          );
          elterngeld = elterngeldplus.add(geschwisterbonus).add(mehrlingszuschlag);
        }
        if (verlauf[i - 1] === ElternGeldKategorie.ELTERN_GELD_PLUS_MIT_ERWERBS_TAETIGKEIT) {
          mehrlingszuschlag = betrag_mehrlingszuschlag.mul(Big(mehrling)).div(Big(2));
          geschwisterbonus = MathUtil.round(
            MathUtil.fMax(
              min_geschwisterbonus.div(Big(2)),
              elterngeldplus_erw.mul(rate_bonus)
            ).mul(Big(geschw[i - 1])),
            2
          );
          elterngeld = elterngeldplus_erw.add(geschwisterbonus).add(mehrlingszuschlag);
        }
        ausgabe.elternGeld = MathUtil.round(elterngeld);
        ausgabe.mehrlingsZulage = MathUtil.round(mehrlingszuschlag);
        ausgabe.geschwisterBonus = MathUtil.round(geschwisterbonus);
      }
      ausgabeLebensmonate.push(ausgabe);
    }
    if (ergebnis.ersatzRate == null) {
      ergebnis.ersatzRate = MathUtil.round(z2.ersatzRate);
    }
    ergebnis.elternGeldBasis = MathUtil.round(basiselterngeld);
    ergebnis.elternGeldErwBasis = MathUtil.round(basiselterngeld_erw);
    ergebnis.elternGeldKeineEtPlus = MathUtil.round(elterngeldplus);
    ergebnis.elternGeldEtPlus = MathUtil.round(elterngeldplus_erw);
    ergebnis.mehrlingsZulage = MathUtil.round(z2.mehrlingsZulage);
    ergebnis.geschwisterBonus = MathUtil.round(z2.geschwisterBonus);
    if (!persoenlicheDaten.etVorGeburt || persoenlicheDaten.etVorGeburt === ErwerbsArt.NEIN) {
      ergebnis.etVorGeburt = false;
    }
    ergebnis.elternGeldAusgabe = ausgabeLebensmonate;
    return ergebnis;
  }
  static isMutterschaftsLeistungImMonat(monat, planungsergebnis) {
    return planungsergebnis.mutterschaftsLeistung != null && planungsergebnis.mutterschaftsLeistung !== MutterschaftsLeistung.MUTTERSCHAFTS_LEISTUNG_NEIN && monat <= mutterschaftsLeistungInMonaten(planungsergebnis.mutterschaftsLeistung);
  }
  validateEinkommenPartnerBonus(ergebnis) {
    ergebnis.hasPartnerBonusError = false;
    if (this.partnerbonus === YesNo.YES) {
      ergebnis.hasPartnerBonusError = true;
      ergebnis.message = "Während des Bezugs des Partnerschaftsbonus muss Erwerbstätigkeit vorliegen.";
      ergebnis.bruttoBasis = MathUtil.BIG_ZERO;
      ergebnis.nettoBasis = MathUtil.BIG_ZERO;
      ergebnis.elternGeldErwBasis = MathUtil.BIG_ZERO;
      ergebnis.bruttoPlus = MathUtil.BIG_ZERO;
      ergebnis.nettoPlus = MathUtil.BIG_ZERO;
      ergebnis.elternGeldEtPlus = MathUtil.BIG_ZERO;
      ergebnis.elternGeldKeineEtPlus = MathUtil.BIG_ZERO;
    }
    return ergebnis;
  }
  /**
   * Methode zum Ermitteln der Elterngeldperioden (ausgedrückt in Lebensmonaten des Kindes) - abhängig von dem
   * Ergebnis der Elterngeldplanung
   *
   * @param {FinanzDaten} finanzDaten
   * @param {PlanungsDaten} planungsDaten
   * @return {ElternGeldPerioden}
   */
  static determineEGPerioden(finanzDaten, planungsDaten) {
    const anfang_eg_per = [];
    const ende_eg_per = [];
    let start = true;
    for (let i = 1; i <= PLANUNG_ANZAHL_MONATE; i++) {
      if (planungsDaten.get(i) !== ElternGeldArt.KEIN_BEZUG) {
        if (start) {
          anfang_eg_per.push(i);
          start = false;
        }
        if (anfang_eg_per.length === ende_eg_per.length) {
          ende_eg_per[anfang_eg_per.length - 1] = i;
        } else {
          ende_eg_per.push(i);
        }
      } else {
        start = true;
      }
    }
    if (ende_eg_per.length === anfang_eg_per.length - 1) {
      ende_eg_per.push(PLANUNG_ANZAHL_MONATE);
    }
    return {
      anfang: anfang_eg_per,
      ende: ende_eg_per
    };
  }
}
const BIG_ZERO = MathUtil.BIG_ZERO;
var ErgebnisUtils;
((ErgebnisUtils2) => {
  function elternGeldSimulationErgebnisOf(basisElternGeld, elternGeldPlus, nettoLebensMonat) {
    if (basisElternGeld.length + elternGeldPlus.length === 0) {
      return {
        rows: []
      };
    }
    const rows = [];
    let previousRow = null;
    let previous = new ElternGeldAmount();
    for (let i = 0; i < PLANUNG_ANZAHL_MONATE; i++) {
      const lebensMonat = i + 1;
      const current2 = new ElternGeldAmount();
      if (i < basisElternGeld.length) {
        current2.basisElternGeld = basisElternGeld[i].elternGeld;
      }
      if (i < elternGeldPlus.length) {
        current2.elterngeldPlus = elternGeldPlus[i].elternGeld;
      }
      if (i < nettoLebensMonat.length) {
        current2.nettoEinkommen = nettoLebensMonat[i];
      }
      if (i === 0 || current2.isNotEquals(previous) && current2.greaterZero()) {
        previous = current2;
        previousRow = {
          vonLebensMonat: lebensMonat,
          bisLebensMonat: lebensMonat,
          basisElternGeld: current2.basisElternGeld,
          elternGeldPlus: current2.elterngeldPlus,
          nettoEinkommen: current2.nettoEinkommen
        };
        rows.push(previousRow);
      } else if (i > 0 && previousRow && current2.isEquals(previous)) {
        previousRow.bisLebensMonat = lebensMonat;
      }
    }
    return {
      rows
    };
  }
  ErgebnisUtils2.elternGeldSimulationErgebnisOf = elternGeldSimulationErgebnisOf;
})(ErgebnisUtils || (ErgebnisUtils = {}));
class ElternGeldAmount {
  constructor(basisElternGeld = BIG_ZERO, elterngeldPlus = BIG_ZERO, nettoEinkommen = BIG_ZERO) {
    this.basisElternGeld = basisElternGeld;
    this.elterngeldPlus = elterngeldPlus;
    this.nettoEinkommen = nettoEinkommen;
  }
  isEquals(other) {
    return MathUtil.isEqual(this.basisElternGeld, other.basisElternGeld) && MathUtil.isEqual(this.elterngeldPlus, other.elterngeldPlus) && MathUtil.isEqual(this.nettoEinkommen, other.nettoEinkommen);
  }
  isNotEquals(other) {
    return !this.isEquals(other);
  }
  greaterZero() {
    return this.basisElternGeld.gt(BIG_ZERO) || this.elterngeldPlus.gt(BIG_ZERO) || this.nettoEinkommen.gt(BIG_ZERO);
  }
}
const _EgrCalculation = class _EgrCalculation {
  constructor() {
    this.bruttoNettoRechner = new BruttoNettoRechner();
    this.basisEgAlgorithmus = new BasisEgAlgorithmus();
    this.zwischenErgebnisAlgorithmus = new EgZwischenErgebnisAlgorithmus();
  }
  /**
   * Aus den angegebenen Daten wird sowohl das Basiselterngeld als auch das ElterngeldPlus errechnet.
   * Beides wird sozusagen simuliert, damit es im Monatsplaner angezeigt werden kann.
   *
   * @param persoenlicheDaten Persönliche Angaben für die Berechnung des Elterngeldes.
   * @param finanzDaten Angaben zum Einkommen für die Berechnung des Elterngeldes.
   * @param lohnSteuerJahr Das Lohnsteuerjahr für den Brutto-Netto-Rechner.
   * @param mutterschaftsLeistung Die Angaben zum Bezug von Mutterschaftsleistungen.
   */
  async simulate(persoenlicheDaten, finanzDaten, lohnSteuerJahr, mutterschaftsLeistung) {
    const planungsDaten = new PlanungsDaten(
      persoenlicheDaten.isAlleinerziehend(),
      persoenlicheDaten.isETVorGeburt(),
      false,
      mutterschaftsLeistung
    );
    planungsDaten.planung = new Array(
      _EgrCalculation.BASIS_ELTERN_GELD_MAX_MONATE
    ).fill(ElternGeldArt.BASIS_ELTERNGELD);
    const basisElternGeldErgebnis = await this.calculateElternGeld(
      {
        // The current algorithms have side effects. It changes the input data, e.g. persoenlicheDaten.etVorGeburt in basis-eg-algorithmus.ts:259
        finanzDaten: finanzDatenOf(finanzDaten),
        persoenlicheDaten: persoenlicheDatenOf(persoenlicheDaten),
        planungsDaten
      },
      lohnSteuerJahr
    );
    planungsDaten.planung = new Array(
      PLANUNG_ANZAHL_MONATE
    ).fill(ElternGeldArt.ELTERNGELD_PLUS);
    const elternGeldPlusErgebnis = await this.calculateElternGeld(
      {
        // The current algorithms have side effects. It changes the input data, e.g. persoenlicheDaten.etVorGeburt in basis-eg-algorithmus.ts:259
        finanzDaten: finanzDatenOf(finanzDaten),
        persoenlicheDaten: persoenlicheDatenOf(persoenlicheDaten),
        planungsDaten
      },
      lohnSteuerJahr
    );
    const nettoLebensMonat = await this.nettoLebensMonatOf(
      finanzDaten,
      lohnSteuerJahr,
      persoenlicheDaten.etVorGeburt
    );
    return ErgebnisUtils.elternGeldSimulationErgebnisOf(
      basisElternGeldErgebnis.elternGeldAusgabe,
      elternGeldPlusErgebnis.elternGeldAusgabe,
      nettoLebensMonat
    );
  }
  async calculate(elternTeil1, elternTeil2, lohnSteuerJahr) {
    const plusErgebnisElternTeil1 = await this.calculateElternGeld(
      elternTeil1,
      lohnSteuerJahr
    );
    const plusErgebnisElternTeil2 = await this.calculateElternGeld(
      elternTeil2,
      lohnSteuerJahr
    );
    return {
      elternTeil1: plusErgebnisElternTeil1,
      elternTeil2: plusErgebnisElternTeil2
    };
  }
  /**
   * Create a list of netto for each Lebensmonat. Similar to ElternGeldAusgabe for each Lebensmonat.
   */
  async nettoLebensMonatOf(finanzDaten, lohnSteuerJahr, etVorGeburt) {
    const nettoLebensMonat = new Array(PLANUNG_ANZAHL_MONATE).fill(
      MathUtil.BIG_ZERO
    );
    for (const erwerbsZeitraumLebensMonat of finanzDaten.erwerbsZeitraumLebensMonatList) {
      const brutto = erwerbsZeitraumLebensMonat.bruttoProMonat.value;
      const abzuege = await this.bruttoNettoRechner.abzuege(
        brutto,
        lohnSteuerJahr,
        finanzDaten,
        etVorGeburt
      );
      const netto = brutto.sub(abzuege);
      erwerbsZeitraumLebensMonat.getLebensMonateList().forEach((lebensMonat) => nettoLebensMonat[lebensMonat - 1] = netto);
    }
    return nettoLebensMonat;
  }
  async calculateElternGeld(elternGeldDaten, lohnSteuerJahr) {
    const zwischenErgebnisEinkommen = await this.zwischenErgebnisEinkommenOf(
      elternGeldDaten,
      lohnSteuerJahr
    );
    const zwischenErgebnis = this.zwischenErgebnisAlgorithmus.elterngeldZwischenergebnis(
      elternGeldDaten.persoenlicheDaten,
      zwischenErgebnisEinkommen.nettoEinkommen
    );
    if (elternGeldDaten.persoenlicheDaten.etNachGeburt !== YesNo.YES) {
      elternGeldDaten.finanzDaten.erwerbsZeitraumLebensMonatList = [];
    }
    if (elternGeldDaten.finanzDaten.isMischeinkommen() && zwischenErgebnisEinkommen.mischEkZwischenErgebnis === null) {
      throw errorOf("MischEinkommenEnabledButMissingMischEinkommen");
    }
    return await new PlusEgAlgorithmus().elterngeldPlusErgebnis(
      elternGeldDaten.planungsDaten,
      elternGeldDaten.persoenlicheDaten,
      elternGeldDaten.finanzDaten,
      lohnSteuerJahr,
      zwischenErgebnisEinkommen.mischEkZwischenErgebnis,
      zwischenErgebnis
    );
  }
  async zwischenErgebnisEinkommenOf(elternGeldDaten, lohnSteuerJahr) {
    _EgrCalculation.korrigiereErwerbsart(elternGeldDaten);
    const zwischenErgebnisEinkommen = {
      mischEkZwischenErgebnis: null,
      nettoEinkommen: new Einkommen(0)
    };
    if (elternGeldDaten.persoenlicheDaten.etVorGeburt !== ErwerbsArt.NEIN) {
      if (elternGeldDaten.persoenlicheDaten.etVorGeburt === ErwerbsArt.JA_MISCHEINKOMMEN) {
        zwischenErgebnisEinkommen.mischEkZwischenErgebnis = await this.basisEgAlgorithmus.berechneMischNettoUndBasiselterngeld(
          elternGeldDaten.persoenlicheDaten,
          elternGeldDaten.finanzDaten,
          lohnSteuerJahr
        );
      } else {
        zwischenErgebnisEinkommen.nettoEinkommen = await this.bruttoNettoRechner.nettoEinkommenZwischenErgebnis(
          elternGeldDaten.finanzDaten,
          elternGeldDaten.persoenlicheDaten.etVorGeburt,
          lohnSteuerJahr
        );
      }
    }
    return zwischenErgebnisEinkommen;
  }
  static korrigiereErwerbsart(elternGeldDaten) {
    if (elternGeldDaten.persoenlicheDaten.etVorGeburt !== ErwerbsArt.JA_MISCHEINKOMMEN && elternGeldDaten.finanzDaten.mischEinkommenTaetigkeiten.length > 0) {
      elternGeldDaten.finanzDaten.mischEinkommenTaetigkeiten = [];
    }
  }
};
_EgrCalculation.BASIS_ELTERN_GELD_MAX_MONATE = 14;
let EgrCalculation = _EgrCalculation;
const initialBruttoEinkommenZeitraum = {
  bruttoEinkommen: null,
  zeitraum: {
    from: "",
    to: ""
  }
};
const initialStepRechnerElternteilState = {
  bruttoEinkommenZeitraum: [],
  keinEinkommen: false,
  elterngeldResult: { state: "init" },
  hasBEGResultChangedDueToPrevFormSteps: false
};
const initialStepRechnerState = {
  ET1: initialStepRechnerElternteilState,
  ET2: initialStepRechnerElternteilState
};
const mutterschaftsLeistungOfUi = (state, elternteil) => {
  if (state.stepAllgemeineAngaben.mutterschaftssleistungen === YesNo.YES && state.stepAllgemeineAngaben.mutterschaftssleistungenWer === elternteil) {
    return state.stepNachwuchs.anzahlKuenftigerKinder > 1 ? MutterschaftsLeistung.MUTTERSCHAFTS_LEISTUNG_12_WOCHEN : MutterschaftsLeistung.MUTTERSCHAFTS_LEISTUNG_8_WOCHEN;
  }
  return MutterschaftsLeistung.MUTTERSCHAFTS_LEISTUNG_NEIN;
};
const calculateElterngeld = async (state, elternteil, bruttoEinkommenZeitraum) => {
  const bruttoEinkommenZeitraumSanitized = bruttoEinkommenZeitraum.filter(
    (value) => value.bruttoEinkommen !== null && value.bruttoEinkommen > 0
  );
  const persoenlicheDaten = persoenlicheDatenOfUi(
    state,
    elternteil,
    bruttoEinkommenZeitraumSanitized
  );
  const finanzDaten = finanzDatenOfUi(
    state,
    elternteil,
    bruttoEinkommenZeitraumSanitized
  );
  const mutterschaftsLeistung = mutterschaftsLeistungOfUi(state, elternteil);
  const lohnSteuerJahr = EgrSteuerRechner.bestLohnSteuerJahrOf(
    persoenlicheDaten.wahrscheinlichesGeburtsDatum
  );
  const result = await new EgrCalculation().simulate(
    persoenlicheDaten,
    finanzDaten,
    lohnSteuerJahr,
    mutterschaftsLeistung
  );
  return result.rows.map(
    (row) => ({
      vonLebensMonat: row.vonLebensMonat,
      bisLebensMonat: row.bisLebensMonat,
      basisElternGeld: row.basisElternGeld.toNumber(),
      elternGeldPlus: row.elternGeldPlus.toNumber(),
      nettoEinkommen: row.nettoEinkommen.toNumber()
    })
  );
};
const calculateBEG = createAsyncThunk(
  "stepRechner/calculateBEG",
  async ({ elternteil, bruttoEinkommenZeitraum }, thunkAPI) => {
    const state = thunkAPI.getState();
    const rows = await calculateElterngeld(
      state,
      elternteil,
      bruttoEinkommenZeitraum
    );
    return {
      elternteil,
      bruttoEinkommenZeitraum,
      rows
    };
  }
);
const recalculateBEG = createAsyncThunk(
  "stepRechner/recalculateBEG",
  async ({ elternteil, bruttoEinkommenZeitraum }, thunkAPI) => {
    const state = thunkAPI.getState();
    const rows = await calculateElterngeld(
      state,
      elternteil,
      bruttoEinkommenZeitraum
    );
    return {
      elternteil,
      bruttoEinkommenZeitraum,
      hasResultChanged: false,
      rows
    };
  }
);
const stepRechnerSlice = createSlice({
  name: "stepRechner",
  initialState: initialStepRechnerState,
  reducers: {
    setHasBEGResultChangedDueToPrevFormSteps: (state, action) => {
      const recalculateIfNecessary = (changes, state2) => state2.hasBEGResultChangedDueToPrevFormSteps = state2.elterngeldResult.state !== "init" && changes;
      recalculateIfNecessary(action.payload.ET1, state.ET1);
      recalculateIfNecessary(action.payload.ET2, state.ET2);
      return state;
    },
    resetHasBEGResultChangedDueToPrevFormSteps: (state, action) => {
      const { elternteil } = action.payload;
      if (elternteil === "ET1") {
        state.ET1.hasBEGResultChangedDueToPrevFormSteps = initialStepRechnerState.ET1.hasBEGResultChangedDueToPrevFormSteps;
      }
      if (elternteil === "ET2") {
        state.ET2.hasBEGResultChangedDueToPrevFormSteps = initialStepRechnerState.ET2.hasBEGResultChangedDueToPrevFormSteps;
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(calculateBEG.pending, (state, { meta }) => {
      state[meta.arg.elternteil].elterngeldResult = {
        state: "pending"
      };
    });
    builder.addCase(calculateBEG.rejected, (state, { meta }) => {
      state[meta.arg.elternteil].elterngeldResult = { state: "error" };
    });
    builder.addCase(
      calculateBEG.fulfilled,
      (state, { payload: { elternteil, bruttoEinkommenZeitraum, rows } }) => {
        state[elternteil].bruttoEinkommenZeitraum = bruttoEinkommenZeitraum;
        state[elternteil].keinEinkommen = bruttoEinkommenZeitraum.length === 0;
        state[elternteil].elterngeldResult = {
          state: "success",
          data: rows
        };
      }
    );
    builder.addCase(recalculateBEG.pending, (state, { meta }) => {
      state[meta.arg.elternteil].elterngeldResult = {
        state: "pending"
      };
    });
    builder.addCase(recalculateBEG.rejected, (state, { meta }) => {
      state[meta.arg.elternteil].elterngeldResult = { state: "error" };
    });
    builder.addCase(
      recalculateBEG.fulfilled,
      (state, {
        payload: {
          elternteil,
          bruttoEinkommenZeitraum,
          hasResultChanged,
          rows
        }
      }) => {
        state[elternteil].bruttoEinkommenZeitraum = bruttoEinkommenZeitraum;
        state[elternteil].keinEinkommen = bruttoEinkommenZeitraum.length === 0;
        state[elternteil].elterngeldResult = {
          state: "success",
          data: rows
        };
        state[elternteil].hasBEGResultChangedDueToPrevFormSteps = hasResultChanged;
      }
    );
  }
});
const isMonatsplanerOverlayVisible = (state) => {
  const antragstellende = state.stepAllgemeineAngaben.antragstellende;
  const stateResultElternteil1 = state.stepRechner.ET1.elterngeldResult.state;
  const stateResultElternteil2 = state.stepRechner.ET2.elterngeldResult.state;
  if (antragstellende === "EinenElternteil") {
    return stateResultElternteil1 !== "success";
  } else {
    return stateResultElternteil1 !== "success" || stateResultElternteil2 !== "success";
  }
};
const hasElterngeldResult = createSelector(
  (state) => state.stepRechner.ET1.elterngeldResult.state,
  (state) => state.stepRechner.ET2.elterngeldResult.state,
  (stateResultElternteil1, stateResultElternteil2) => {
    return {
      ET1: stateResultElternteil1 !== "init",
      ET2: stateResultElternteil2 !== "init"
    };
  }
);
const stepRechnerSelectors = {
  isMonatsplanerOverlayVisible,
  hasElterngeldResult
};
const stepRechnerActions = {
  ...stepRechnerSlice.actions,
  calculateBEG,
  recalculateBEG
};
const stepRechnerReducer = stepRechnerSlice.reducer;
function usePayoutAmounts() {
  const store2 = useAppStore();
  const [payoutAmounts, setPayoutAmounts] = reactExports.useState();
  const applicant = useAppSelector(
    (state) => state.stepAllgemeineAngaben.antragstellende
  );
  const isSingleParent = applicant === "EinenElternteil";
  const parentNames = useAppSelector(
    stepAllgemeineAngabenSelectors.getElternteilNames
  );
  reactExports.useEffect(() => {
    const promises = [
      determinePayoutAmountForParent(store2, "ET1", parentNames.ET1)
    ];
    if (!isSingleParent) {
      promises.push(
        determinePayoutAmountForParent(store2, "ET2", parentNames.ET2)
      );
    }
    Promise.all(promises).then(setPayoutAmounts);
  }, [store2, isSingleParent, parentNames]);
  return payoutAmounts;
}
async function determinePayoutAmountForParent(store2, parent, name) {
  const state = store2.getState();
  const rows = await calculateElterngeld(state, parent, EMPTY_FUTURE_INCOME);
  const { basisElternGeld, elternGeldPlus } = findFristRepresentativeMonth(rows);
  return {
    name,
    basiselterngeld: basisElternGeld,
    elterngeldplus: elternGeldPlus,
    partnerschaftsbonus: elternGeldPlus
  };
}
function findFristRepresentativeMonth(rows) {
  return rows.find((row) => row.basisElternGeld > 0) ?? rows[0];
}
const EMPTY_FUTURE_INCOME = [];
function ElterngeldvariantenDescriptions() {
  const payoutAmounts = usePayoutAmounts();
  if (payoutAmounts === void 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, {});
  } else {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        DetailsElterngeldvariante,
        {
          summaryTitle: "Basiselterngeld",
          summaryClassName: "bg-Basis text-white",
          monthsAvailable: 14,
          payoutAmounts: pickAmountsOfVariant(payoutAmounts, "basiselterngeld"),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mb-24 list-disc pl-24", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Als Basiselterngeld bekommen Sie normalerweise 65 Prozent des Nettoeinkommens, dass Sie vor der Geburt Ihres Kindes hatten und das nach der Geburt wegfällt" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Basiselterngeld beträgt mindestens 300 Euro und höchstens 1.800 Euro monatlich" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h5", { className: "text-base", children: "Für Paare und getrennt Erziehende gilt:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mb-24 list-disc pl-24", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "die 14 Basiselterngeldmonate können Sie untereinander aufteilen" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Voraussetzung: mindestens einer von Ihnen hat in 2 Lebensmonaten nach der Geburt weniger Einkommen als davor" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                "zwei Einschränkungen gibt es:",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "list-disc pl-24", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Jeder Elternteil kann maximal 12 Monate Basiselterngeld bekommen" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Gleichzeitiger Bezug von Basiselterngeld mit Ihrem Partner oder Ihrer Partnerin ist nur maximal einen Monat in den ersten 12 Lebensmonaten Ihres Kindes möglich" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h5", { className: "text-base", children: "Für Alleinerziehende gilt:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mb-24 list-disc pl-24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "14 Monate Basiselterngeld können beantragt werden" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h5", { className: "text-base", children: "Ausnahmen:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "p-0", children: "Basiselterngeld kann für mehr als einen Monat gleichzeitig bezogen werden, wenn einer der folgenden Sachverhalte auf Sie zutrifft:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mb-32 list-disc pl-24", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Sie sind Eltern von besonders früh geborenen Kindern, die mindestens sechs Wochen vor dem errechneten Geburtstermin geboren wurden" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Sie sind Eltern von Zwillingen, Drillingen und weiteren Mehrlingen" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Sie haben ein neugeborenes Kind mit Behinderung oder ein Geschwisterkind mit Behinderung" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h5", { className: "text-base", children: "Beispiele für Paare und getrennt Erziehende:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-20 p-0", children: "Elternteil 1 beantragt in den Lebensmonaten 1 bis 7 Basiselterngeld und Elternteil 2 in den Lebensmonaten 7 bis 13. Im Lebensmonat 7 planen Sie einen Monat parallel." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Example,
              {
                title: "Elternteil 1",
                months: [
                  "Basis",
                  "Basis",
                  "Basis",
                  "Basis",
                  "Basis",
                  "Basis",
                  "Basis",
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-32", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Example,
              {
                title: "Elternteil 2",
                months: [
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  "Basis",
                  "Basis",
                  "Basis",
                  "Basis",
                  "Basis",
                  "Basis",
                  "Basis",
                  null
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-20 p-0", children: "Elternteil 1 beantragt in den Lebensmonaten 1 bis 10 Basiselterngeld. Elternteil 2 beantragt in den Lebensmonaten 11 bis 14 Basiselterngeld. Damit haben die Eltern ihren Anspruch auf 14 Monate Basiselterngeld ausgeschöpft." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Example,
              {
                title: "Elternteil 1",
                months: [
                  "Basis",
                  "Basis",
                  "Basis",
                  "Basis",
                  "Basis",
                  "Basis",
                  "Basis",
                  "Basis",
                  "Basis",
                  "Basis",
                  null,
                  null,
                  null,
                  null
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-32", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Example,
              {
                title: "Elternteil 2",
                months: [
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  "Basis",
                  "Basis",
                  "Basis",
                  "Basis"
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FurtherInformation, {})
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        DetailsElterngeldvariante,
        {
          summaryTitle: "ElterngeldPlus",
          summaryClassName: "bg-Plus text-black",
          monthsAvailable: 28,
          payoutAmounts: pickAmountsOfVariant(payoutAmounts, "elterngeldplus"),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mb-24 list-disc pl-24", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Statt eines Lebensmonats Basiselterngeld können Sie 2 Lebensmonate ElterngeldPlus bekommen – das heißt, halb so hoch wie Basiselterngeld, aber doppelter Zeitraum" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "ElterngeldPlus kann auch nach dem 14. Lebensmonat bezogen werden, ab dann darf der Elterngeldbezug nicht mehr unterbrochen werden" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Besonders lohnend, wenn Eltern nach der Geburt in Teilzeit arbeiten" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h5", { className: "text-base", children: "Für Paare und getrennt Erziehende gilt:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mb-24 list-disc pl-24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Basiselterngeld und ElterngeldPlus können Sie miteinander kombinieren und abwechseln" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h5", { className: "text-base", children: "Für Alleinerziehende gilt:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mb-32 list-disc pl-24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "28 Monate ElterngeldPlus können beantragt werden" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h5", { className: "text-base", children: "Beispiele für Paare und getrennt Erziehende:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-20 p-0", children: "Elternteil 1 bekommt Basiselterngeld in den ersten 4 Lebensmonaten, Elternteil 2 in den Lebensmonaten 5 und 6. Beide Eltern bekommen ElterngeldPlus in den Lebensmonaten 7 bis 14. Damit haben die Eltern 6 Monate Basiselterngeld und 16 Monate ElterngeldPlus (8 Monate ElterngeldPlus pro Elternteil) verbraucht; das entspricht 14 Monaten Basiselterngeld." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Example,
              {
                title: "Elternteil 1",
                months: [
                  "Basis",
                  "Basis",
                  "Basis",
                  "Basis",
                  null,
                  null,
                  "Plus",
                  "Plus",
                  "Plus",
                  "Plus",
                  "Plus",
                  "Plus",
                  "Plus",
                  "Plus"
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-32", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Example,
              {
                title: "Elternteil 2",
                months: [
                  null,
                  null,
                  null,
                  null,
                  "Basis",
                  "Basis",
                  "Plus",
                  "Plus",
                  "Plus",
                  "Plus",
                  "Plus",
                  "Plus",
                  "Plus",
                  "Plus"
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-20 p-0", children: "Elternteil 1 bekommt Basiselterngeld in den Lebensmonaten 1 bis 6. Parallel bezieht der Elternteil 2 in Lebensmonat 1 Basiselterngeld und in den Lebensmonaten 2 und 3 ElterngeldPlus. In den Lebensmonaten 7 bis 10 beziehen beide Elternteile ElterngeldPlus. Elternteil 2 bekommt in den Lebensmonaten 11 und 12 ElterngeldPlus und in Lebensmonat 13 Basiselterngeld. Damit haben die Eltern ihren Anspruch auf 14 Monate Basiselterngeld ausgeschöpft." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Example,
              {
                title: "Elternteil 1",
                months: [
                  "Basis",
                  "Basis",
                  "Basis",
                  "Basis",
                  "Basis",
                  "Basis",
                  "Plus",
                  "Plus",
                  "Plus",
                  "Plus",
                  null,
                  null,
                  null,
                  null
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-32", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Example,
              {
                title: "Elternteil 2",
                months: [
                  "Basis",
                  "Plus",
                  "Plus",
                  null,
                  null,
                  null,
                  "Plus",
                  "Plus",
                  "Plus",
                  "Plus",
                  "Plus",
                  "Plus",
                  "Basis",
                  null
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FurtherInformation, {})
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        DetailsElterngeldvariante,
        {
          summaryTitle: "+ Partnerschaftsbonus",
          summaryClassName: "bg-Bonus text-black",
          monthsAvailable: 4,
          payoutAmounts: pickAmountsOfVariant(
            payoutAmounts,
            "partnerschaftsbonus"
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mb-24 list-disc pl-24", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Zusätzliche 2, 3 oder 4 Monate ElterngeldPlus – direkt aufeinander folgend" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Für den Partnerschaftsbonus muss man 24 bis 32 Stunden pro Woche in Teilzeit arbeiten" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h5", { className: "text-base", children: "Für Paare und getrennt Erziehende gilt:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mb-24 list-disc pl-24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Beide Elternteile nutzen den Partnerschaftsbonus gleichzeitig" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h5", { className: "text-base", children: "Für Alleinerziehende gilt:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mb-32 list-disc pl-24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Der Partnerschaftsbonus kann auch allein beantragt werden" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h5", { className: "text-base", children: "Beispiele für Paare und getrennt Erziehende:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-20 p-0", children: "Das Elternteil 1 bezieht in den ersten 6 Lebensmonaten Basiselterngeld. Vom Lebensmonat 7 bis 10 bezieht der Elternteil 2 Basiselterngeld. Die Elternteile beziehen parallel ElterngeldPlus in den Lebensmonaten 11 bis 14. In den Lebensmonaten 15 bis 18 nutzen die Elternteile den Partnerschaftsbonus." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Example,
              {
                title: "Elternteil 1",
                months: [
                  "Basis",
                  "Basis",
                  "Basis",
                  "Basis",
                  "Basis",
                  "Basis",
                  null,
                  null,
                  null,
                  null,
                  "Plus",
                  "Plus",
                  "Plus",
                  "Plus",
                  "Bonus",
                  "Bonus",
                  "Bonus",
                  "Bonus"
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-32", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Example,
              {
                title: "Elternteil 2",
                months: [
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  "Basis",
                  "Basis",
                  "Basis",
                  "Basis",
                  "Plus",
                  "Plus",
                  "Plus",
                  "Plus",
                  "Bonus",
                  "Bonus",
                  "Bonus",
                  "Bonus"
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h5", { className: "text-base", children: "Ein Beispiel für Alleinerziehende:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-20 p-0", children: "Das alleinerziehende Elternteil bezieht in den ersten 8 Lebensmonaten Basiselterngeld. Danach bezieht es für 2 Monate kein Elterngeld. Im Lebensmonat 11 bis 16 bezieht es ElterngeldPlus, vom Lebensmonat 17 bis 20 den Partnerschaftsbonus und vom Lebensmonat 21 bis 26 nochmals ElterngeldPlus." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-32", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Example,
              {
                title: "Elternteil",
                months: [
                  "Basis",
                  "Basis",
                  "Basis",
                  "Basis",
                  "Basis",
                  "Basis",
                  "Basis",
                  "Basis",
                  null,
                  null,
                  "Plus",
                  "Plus",
                  "Plus",
                  "Plus",
                  "Plus",
                  "Plus",
                  "Bonus",
                  "Bonus",
                  "Bonus",
                  "Bonus",
                  "Plus",
                  "Plus",
                  "Plus",
                  "Plus",
                  "Plus",
                  "Plus"
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FurtherInformation, {})
          ]
        }
      )
    ] });
  }
}
function pickAmountsOfVariant(payoutAmounts, variant) {
  return payoutAmounts.map((entry) => ({
    name: entry.name,
    amount: entry[variant]
  }));
}
function ElterngeldvariantenPage() {
  const descriptionIdentifier = reactExports.useId();
  const navigate = useNavigate();
  const navigateToPreviousStep = () => navigate(formSteps.einkommen.route);
  const navigateToNextStep = () => navigate(formSteps.rechnerUndPlaner.route);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Page, { step: formSteps.elterngeldvarianten, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap justify-between gap-y-80", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        className: "flex basis-full flex-col gap-24",
        "aria-describedby": descriptionIdentifier,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Elterngeldvarianten" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { id: descriptionIdentifier, children: [
            "Elterngeld gibt es in 3 Varianten.",
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            "Hier finden Sie eine Übersicht über die einzelnen Elterngeldvarianten. Diese können Sie im nächsten Schritt miteinander kombinieren."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ElterngeldvariantenDescriptions, {})
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        buttonStyle: "secondary",
        label: "Zurück",
        onClick: navigateToPreviousStep
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { label: "Zum Monatsplaner", onClick: navigateToNextStep })
  ] }) });
}
const AllgemeineAngabenPage = reactExports.lazy(
  () => __vitePreload(() => import("./AllgemeineAngabenPage-j2_9zHKS.js"), true ? __vite__mapDeps([0,1,2,3,4]) : void 0)
);
const NachwuchsPage = reactExports.lazy(() => __vitePreload(() => import("./NachwuchsPage-ByUDLxG7.js"), true ? __vite__mapDeps([5,1,2,4]) : void 0));
const ErwerbstaetigkeitPage = reactExports.lazy(
  () => __vitePreload(() => import("./ErwerbstaetigkeitPage-CB2sLASB.js"), true ? __vite__mapDeps([6,1,2,3,4]) : void 0)
);
const EinkommenPage = reactExports.lazy(() => __vitePreload(() => import("./EinkommenPage-B2YjSp0S.js"), true ? __vite__mapDeps([7,1,2,3,4]) : void 0));
const RechnerPlanerPage = reactExports.lazy(
  () => __vitePreload(() => import("./RechnerPlanerPage-jHWUVCjq.js"), true ? __vite__mapDeps([8,1,2]) : void 0)
);
const ZusammenfassungUndDatenPage = reactExports.lazy(
  () => __vitePreload(() => import("./ZusammenfassungUndDatenPage-DIj7DDpj.js"), true ? __vite__mapDeps([9,2]) : void 0)
);
function App({ elternGeldDigitalWizardUrl }) {
  const dispatch = useAppDispatch();
  dispatch(
    configurationActions.configure({
      elternGeldDigitalWizardUrl
    })
  );
  const url = new URL(window.location.href);
  const showAllPagesAtOnce = url.searchParams.get("allpages") === "1";
  const allPages = /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AllgemeineAngabenPage, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(NachwuchsPage, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ErwerbstaetigkeitPage, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(EinkommenPage, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ElterngeldvariantenPage, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(RechnerPlanerPage, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ZusammenfassungUndDatenPage, {})
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(MemoryRouter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AriaLogProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Routes, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Route,
      {
        index: true,
        element: /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: formSteps.allgemeinAngaben.route, replace: true })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Route,
      {
        path: formSteps.allgemeinAngaben.route,
        element: /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: showAllPagesAtOnce ? allPages : /* @__PURE__ */ jsxRuntimeExports.jsx(AllgemeineAngabenPage, {}) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Route,
      {
        path: formSteps.nachwuchs.route,
        element: /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: showAllPagesAtOnce ? allPages : /* @__PURE__ */ jsxRuntimeExports.jsx(NachwuchsPage, {}) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Route,
      {
        path: formSteps.erwerbstaetigkeit.route,
        element: /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: showAllPagesAtOnce ? allPages : /* @__PURE__ */ jsxRuntimeExports.jsx(ErwerbstaetigkeitPage, {}) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Route,
      {
        path: formSteps.einkommen.route,
        element: /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: showAllPagesAtOnce ? allPages : /* @__PURE__ */ jsxRuntimeExports.jsx(EinkommenPage, {}) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Route,
      {
        path: formSteps.elterngeldvarianten.route,
        element: /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: showAllPagesAtOnce ? allPages : /* @__PURE__ */ jsxRuntimeExports.jsx(ElterngeldvariantenPage, {}) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Route,
      {
        path: formSteps.rechnerUndPlaner.route,
        element: /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: showAllPagesAtOnce ? allPages : /* @__PURE__ */ jsxRuntimeExports.jsx(RechnerPlanerPage, {}) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Route,
      {
        path: formSteps.zusammenfassungUndDaten.route,
        element: /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: showAllPagesAtOnce ? allPages : /* @__PURE__ */ jsxRuntimeExports.jsx(ZusammenfassungUndDatenPage, {}) })
      }
    )
  ] }) }) }) });
}
var NumberOfMutterschutzMonths;
((NumberOfMutterschutzMonths2) => {
  NumberOfMutterschutzMonths2.oneChild = 2;
  NumberOfMutterschutzMonths2.moreThanOneChild = 3;
})(NumberOfMutterschutzMonths || (NumberOfMutterschutzMonths = {}));
const numberOfMutterschutzMonths = (anzahlKuenftigerKinder, hasMutterschutz) => {
  if (hasMutterschutz === "YES") {
    return anzahlKuenftigerKinder === 1 ? NumberOfMutterschutzMonths.oneChild : NumberOfMutterschutzMonths.moreThanOneChild;
  } else {
    return 0;
  }
};
const createDefaultElternteileSettings = (mehrlinge, behindertesGeschwisterkind, isoGeburtstag, mutterschutzElternteil, numberOfMutterschutzMonths2, partnerMonate, alleinerziehend) => {
  const geburtstag = {
    geburt: isoGeburtstag,
    errechnet: isoGeburtstag
  };
  let settings = {
    mehrlinge,
    behindertesGeschwisterkind,
    geburtstag,
    partnerMonate,
    alleinerziehend
  };
  if (numberOfMutterschutzMonths2) {
    const mutterschutz = {
      elternteil: mutterschutzElternteil,
      endDate: DateTime.fromISO(isoGeburtstag).plus({
        month: numberOfMutterschutzMonths2
      }).plus({ days: numberOfMutterschutzMonths2 * -1 }).toUTC().toISO({ suppressMilliseconds: true })
    };
    settings = { ...settings, mutterschutz };
  }
  return settings;
};
const initialMonatsplanerState = {
  mutterschutzElternteil: null,
  settings: void 0,
  // EGR-244 - no conditions to get Partner Monate for only one Elternteil - property default value is true
  partnerMonate: true,
  elternteile: createElternteile({
    mehrlinge: false,
    behindertesGeschwisterkind: false,
    partnerMonate: true
  })
};
const getSelectablePSBMonthIndices = createSelector(
  (state) => state.monatsplaner.elternteile.ET1.months,
  (state) => state.monatsplaner.elternteile.remainingMonths.partnerschaftsbonus,
  (months2, remainingMonthsPSB) => {
    const currentPSBIndices = months2.flatMap(
      (month, index) => month.type === "PSB" ? [index] : []
    );
    if (currentPSBIndices.length === 0) {
      return {
        selectableIndices: months2.map((_, index) => index),
        deselectableIndices: []
      };
    }
    const lowestIndex = currentPSBIndices[0];
    const highestIndex = currentPSBIndices[currentPSBIndices.length - 1];
    if (remainingMonthsPSB > 0) {
      return {
        selectableIndices: [lowestIndex - 1, highestIndex + 1],
        deselectableIndices: [lowestIndex, highestIndex]
      };
    } else {
      return {
        selectableIndices: [],
        deselectableIndices: [lowestIndex, highestIndex]
      };
    }
  }
);
const getAutomaticallySelectedPSBMonthIndex = (months2, selectedMonthIndex) => {
  const hasAtLeastOnePSBMonth = months2.some((month) => month.type === "PSB");
  if (!hasAtLeastOnePSBMonth) {
    if (selectedMonthIndex === months2.length - 1) {
      return selectedMonthIndex - 1;
    } else {
      return selectedMonthIndex + 1;
    }
  }
};
const monatsplanerSlice = createSlice({
  name: "monatsplaner",
  initialState: initialMonatsplanerState,
  reducers: {
    changeMonth: (state, {
      payload: { elternteil, targetType, monthIndex }
    }) => {
      const nextElternteile = changeMonth(
        state.elternteile,
        {
          elternteil,
          targetType,
          monthIndex
        },
        state.settings
      );
      return {
        ...state,
        elternteile: nextElternteile
      };
    },
    resetMonths: (state) => ({
      ...state,
      elternteile: createElternteile(state.settings)
    })
  },
  extraReducers: (builder) => {
    builder.addCase(
      stepAllgemeineAngabenActions.submitStep,
      (state, { payload }) => {
        if (payload.mutterschaftssleistungen === YesNo.YES) {
          if (payload.antragstellende === "EinenElternteil") {
            state.mutterschutzElternteil = "ET1";
          } else {
            state.mutterschutzElternteil = payload.mutterschaftssleistungenWer;
          }
        }
        const alleinerziehend = payload.alleinerziehend === YesNo.YES;
        const partnerMonate = alleinerziehend || payload.antragstellende === "FuerBeide";
        state.settings = {
          alleinerziehend,
          partnerMonate,
          mehrlinge: false,
          behindertesGeschwisterkind: false
        };
        state.partnerMonate = partnerMonate;
        state.elternteile = createElternteile(state.settings);
      }
    );
    builder.addCase(stepNachwuchsActions.submitStep, (state, { payload }) => {
      var _a;
      const mehrlinge = payload.anzahlKuenftigerKinder > 1;
      const behindertesGeschwisterkind = payload.geschwisterkinder.filter((kind) => kind.istBehindert).length > 0;
      const [day, month, year] = payload.wahrscheinlichesGeburtsDatum.split(".");
      const mutterSchutzMonate = numberOfMutterschutzMonths(
        payload.anzahlKuenftigerKinder,
        payload.mutterschaftssleistungen
      );
      const wahrscheinlichesISOGeburtsDatum = `${year}-${month}-${day}T00:00:00Z`;
      const settings = createDefaultElternteileSettings(
        mehrlinge,
        behindertesGeschwisterkind,
        wahrscheinlichesISOGeburtsDatum,
        state.mutterschutzElternteil,
        mutterSchutzMonate,
        state.partnerMonate,
        (_a = state.settings) == null ? void 0 : _a.alleinerziehend
      );
      return {
        ...state,
        settings,
        elternteile: createElternteile(settings)
      };
    });
  }
});
const monatsplanerSelectors = {
  getSelectablePSBMonthIndices
};
const monatsplanerActions = monatsplanerSlice.actions;
const monatsplanerReducer = monatsplanerSlice.reducer;
const initialAverageOrMonthlyStateNichtSelbstaendig = {
  type: "average",
  average: null,
  perYear: null,
  perMonth: Array.from({ length: 12 }).fill(null)
};
const initialAverageOrMonthlyStateSelbstaendig = {
  type: "yearly",
  average: null,
  perYear: null,
  perMonth: []
};
const initialTaetigkeit = {
  artTaetigkeit: "NichtSelbststaendig",
  bruttoEinkommenDurchschnitt: null,
  isMinijob: null,
  zeitraum: [
    {
      from: "",
      to: ""
    }
  ],
  versicherungen: {
    hasRentenversicherung: false,
    hasArbeitslosenversicherung: false,
    hasKrankenversicherung: false,
    none: false
  }
};
const initialStepEinkommenElternteil = {
  bruttoEinkommenNichtSelbstaendig: initialAverageOrMonthlyStateNichtSelbstaendig,
  steuerKlasse: null,
  splittingFaktor: null,
  kinderFreiBetrag: KinderFreiBetrag.ZKF1,
  gewinnSelbstaendig: initialAverageOrMonthlyStateSelbstaendig,
  rentenVersicherung: null,
  zahlenSieKirchenSteuer: null,
  kassenArt: null,
  taetigkeitenNichtSelbstaendigUndSelbstaendig: [],
  istErwerbstaetig: null,
  hasMischEinkommen: null,
  istSelbststaendig: null,
  istNichtSelbststaendig: null
};
const resetStepEinkommenElternteil = {
  ...initialStepEinkommenElternteil,
  istErwerbstaetig: YesNo.NO
};
const initialStepEinkommenState = {
  ET1: initialStepEinkommenElternteil,
  ET2: initialStepEinkommenElternteil,
  antragstellende: null,
  limitEinkommenUeberschritten: null
};
const sumBruttoEinkommen = (payload, elternteil) => {
  var _a;
  const incomeInputType = payload[elternteil].bruttoEinkommenNichtSelbstaendig.type;
  if (incomeInputType === "average") {
    return payload[elternteil].bruttoEinkommenNichtSelbstaendig.average * 12 || 0;
  }
  if (incomeInputType === "monthly") {
    return ((_a = payload[elternteil].bruttoEinkommenNichtSelbstaendig.perMonth) == null ? void 0 : _a.reduce(
      (a, b) => a + b,
      0
    )) || 0;
  }
  return 0;
};
const sumGewinnEinkommen = (payload, elternteil) => {
  const sumGewinnPerYear = payload[elternteil].gewinnSelbstaendig.perYear || 0;
  return sumGewinnPerYear;
};
const sumMischEinkommen = (payload, elternteil) => {
  const mischEinkommen = payload[elternteil].taetigkeitenNichtSelbstaendigUndSelbstaendig.map((period) => {
    const einkommen = period.bruttoEinkommenDurchschnitt;
    const numOfMonths = period.zeitraum.map((zeitraum) => {
      return DateTime.fromISO(zeitraum.to).diff(DateTime.fromISO(zeitraum.from), "months").toObject().months + 1;
    }).reduce((a, b) => a + b, 0);
    return einkommen * numOfMonths;
  }).reduce((a, b) => a + b, 0);
  return mischEinkommen;
};
const stepEinkommenSlice = createSlice({
  name: "stepEinkommen",
  initialState: initialStepEinkommenState,
  reducers: {
    submitStep: (_, { payload }) => {
      const einkommen = {
        ET1: 0,
        ET2: 0
      };
      const mischEinkommen = {
        ET1: 0,
        ET2: 0
      };
      const elternteile = ["ET1", "ET2"];
      elternteile.forEach(function(elternteil) {
        if (payload[elternteil] && payload[elternteil].istErwerbstaetig === YesNo.YES) {
          if (_[elternteil].istNichtSelbststaendig) {
            einkommen[elternteil] = sumBruttoEinkommen(payload, elternteil);
          }
          if (_[elternteil].istSelbststaendig) {
            einkommen[elternteil] = sumGewinnEinkommen(payload, elternteil);
          }
          if (_[elternteil].hasMischEinkommen) {
            mischEinkommen[elternteil] = sumMischEinkommen(payload, elternteil);
          }
          _[elternteil].hasMischEinkommen === YesNo.YES ? mischEinkommen[elternteil] : einkommen[elternteil];
        }
      });
      return {
        ..._,
        ...payload
      };
    }
  },
  extraReducers: (builder) => {
    builder.addCase(
      stepErwerbstaetigkeitActions.submitStep,
      (state, { payload }) => {
        const istErwerbstaetigET1 = payload.ET1.vorGeburt;
        const istErwerbstaetigET2 = payload.ET2.vorGeburt;
        const hasMischEinkommenET1 = payload.ET1.isNichtSelbststaendig && payload.ET1.isSelbststaendig ? YesNo.YES : YesNo.NO;
        const hasMischEinkommenET2 = payload.ET2.isNichtSelbststaendig && payload.ET2.isSelbststaendig ? YesNo.YES : YesNo.NO;
        const istNichtSelbststaendigET1 = payload.ET1.isNichtSelbststaendig === true && payload.ET1.isSelbststaendig === false;
        const istNichtSelbststaendigET2 = payload.ET2.isNichtSelbststaendig === true && payload.ET2.isSelbststaendig === false;
        const istSelbststaendigET1 = payload.ET1.isNichtSelbststaendig === false && payload.ET1.isSelbststaendig === true;
        const istSelbststaendigET2 = payload.ET2.isNichtSelbststaendig === false && payload.ET2.isSelbststaendig === true;
        const et1 = istErwerbstaetigET1 === YesNo.YES ? {
          ...state.ET1,
          istErwerbstaetig: istErwerbstaetigET1,
          hasMischEinkommen: hasMischEinkommenET1,
          istSelbststaendig: istSelbststaendigET1,
          istNichtSelbststaendig: istNichtSelbststaendigET1
        } : {
          ...resetStepEinkommenElternteil
        };
        const et2 = istErwerbstaetigET2 === YesNo.YES ? {
          ...state.ET2,
          istErwerbstaetig: istErwerbstaetigET2,
          hasMischEinkommen: hasMischEinkommenET2,
          istSelbststaendig: istSelbststaendigET2,
          istNichtSelbststaendig: istNichtSelbststaendigET2
        } : {
          ...resetStepEinkommenElternteil
        };
        return {
          ...state,
          ET1: {
            ...et1
          },
          ET2: {
            ...et2
          }
        };
      }
    );
    builder.addCase(
      stepAllgemeineAngabenActions.submitStep,
      (state, { payload }) => {
        state.antragstellende = payload.antragstellende;
      }
    );
  }
});
const stepEinkommenActions = stepEinkommenSlice.actions;
const stepEinkommenReducer = stepEinkommenSlice.reducer;
({
  stepAllgemeineAngaben: {
    antragstellende: "FuerBeide",
    pseudonym: {
      ET1: "Jasper Darwin Artus",
      ET2: "Salomé Loreley Zoe"
    },
    alleinerziehend: null,
    mutterschaftssleistungen: "NO"
  },
  stepNachwuchs: {
    anzahlKuenftigerKinder: 1,
    wahrscheinlichesGeburtsDatum: "01.04.2024",
    geschwisterkinder: [
      {
        geburtsdatum: "24.10.2019",
        istBehindert: false
      }
    ]
  },
  stepErwerbstaetigkeit: {
    ET1: {
      vorGeburt: "YES",
      isNichtSelbststaendig: true,
      isSelbststaendig: true,
      sozialVersicherungsPflichtig: "YES",
      monatlichesBrutto: "MehrAlsMiniJob"
    },
    ET2: {
      vorGeburt: "YES",
      isNichtSelbststaendig: true,
      isSelbststaendig: false,
      sozialVersicherungsPflichtig: "YES",
      monatlichesBrutto: "MehrAlsMiniJob",
      mehrereTaetigkeiten: "NO"
    }
  },
  stepEinkommen: {
    limitEinkommenUeberschritten: "NO",
    ET1: {
      bruttoEinkommenNichtSelbstaendig: {
        type: "average",
        average: null,
        perMonth: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null
        ]
      },
      steuerKlasse: SteuerKlasse.SKL3,
      splittingFaktor: null,
      kinderFreiBetrag: "1",
      gewinnSelbstaendig: {
        type: "average",
        average: null,
        perMonth: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null
        ]
      },
      rentenVersicherung: null,
      zahlenSieKirchenSteuer: "YES",
      kassenArt: "GESETZLICH_PFLICHTVERSICHERT",
      taetigkeitenNichtSelbstaendigUndSelbstaendig: [
        {
          artTaetigkeit: "NichtSelbststaendig",
          bruttoEinkommenDurchschnitt: 1e3,
          isMinijob: "YES",
          zeitraum: [
            { from: "1", to: "3" },
            { from: "6", to: "9" }
          ],
          versicherungen: {
            hasRentenversicherung: true,
            hasArbeitslosenversicherung: false,
            hasKrankenversicherung: true,
            none: false
          }
        },
        {
          artTaetigkeit: "Selbststaendig",
          bruttoEinkommenDurchschnitt: 2e3,
          isMinijob: "NO",
          zeitraum: [
            { from: "1", to: "5" },
            { from: "10", to: "12" }
          ],
          versicherungen: {
            hasRentenversicherung: true,
            hasArbeitslosenversicherung: false,
            hasKrankenversicherung: true,
            none: false
          }
        }
      ]
    },
    ET2: {
      bruttoEinkommenNichtSelbstaendig: {
        type: "monthly",
        average: null,
        perMonth: [
          800,
          900,
          1e3,
          800,
          2e3,
          1200,
          1500,
          1300,
          1e3,
          1800,
          1600,
          2500
        ]
      },
      steuerKlasse: "1",
      splittingFaktor: null,
      kinderFreiBetrag: "1",
      gewinnSelbstaendig: {
        type: "average",
        average: null,
        perMonth: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null
        ]
      },
      rentenVersicherung: null,
      zahlenSieKirchenSteuer: "NO",
      kassenArt: "GESETZLICH_PFLICHTVERSICHERT",
      taetigkeitenNichtSelbstaendigUndSelbstaendig: []
    }
  }
});
const reducers = combineReducers({
  monatsplaner: monatsplanerReducer,
  stepAllgemeineAngaben: stepAllgemeineAngabenReducer,
  stepNachwuchs: stepNachwuchsReducer,
  stepErwerbstaetigkeit: stepErwerbstaetigkeitReducer,
  stepEinkommen: stepEinkommenReducer,
  stepRechner: stepRechnerReducer,
  configuration: configurationReducer
});
const store = configureStore({
  reducer: reducers,
  preloadedState: void 0
});
function setupCalculation() {
  Big.DP = 34;
  Big.RM = Big.roundHalfEven;
}
function waitForCookieValue(name, pollingInterval) {
  return new Promise((resolve) => {
    const intervalId = setInterval(() => {
      const value = getCookies()[name];
      if (value !== void 0) {
        clearInterval(intervalId);
        resolve(value);
      }
    }, pollingInterval);
  });
}
function getCookies() {
  return document.cookie.split(";").map((rawKeyValuePair) => rawKeyValuePair.split("=")).reduce(
    (cookieMap, [name, value]) => ({ ...cookieMap, [name.trim()]: value }),
    {}
  );
}
function establishDataLayer() {
  const timeNow = Date.now();
  window._mtm = window._mtm || [];
  window._mtm[0] = { event: "mtm.Start", "mtm.startTime": timeNow };
}
function setTrackingVariable(name, value) {
  if (window._mtm) {
    window._mtm.push({ [name]: value });
  }
}
function setupTagManager(sourceUrl) {
  const isAlreadyPresent = isTagManagerScriptPresent(sourceUrl);
  if (!isAlreadyPresent) {
    addTagManagerScript(sourceUrl);
  }
}
function isTagManagerScriptPresent(sourceUrl) {
  const allScripts = Array.from(document.getElementsByTagName("script"));
  return allScripts.some((script) => script.src === sourceUrl);
}
function addTagManagerScript(sourceUrl) {
  var _a;
  const tagManagerScript = document.createElement("script");
  tagManagerScript.async = true;
  tagManagerScript.src = sourceUrl;
  const firstScript = document.getElementsByTagName("script")[0];
  (_a = firstScript.parentNode) == null ? void 0 : _a.insertBefore(tagManagerScript, firstScript);
}
var define_import_meta_env_default = { VITE_APP_BMF_STEUER_RECHNER_DOMAIN: "", VITE_APP_BMF_STEUER_RECHNER_CODE: "2022eP", VITE_APP_BMF_STEUER_RECHNER_AVAILABLE_YEARS_REMOTE: "2021,2022", VITE_APP_BMF_STEUER_RECHNER_AVAILABLE_YEARS_LIB: "2022,2023", VITE_APP_CALCULATIONS_LOGGER_ENABLED: "false", BASE_URL: "/", MODE: "production", DEV: false, PROD: true, SSR: false };
async function setupUserTracking() {
  const tagMangerSourceUrl = getTagMangerSourceUrl();
  const isConfigured = !!tagMangerSourceUrl;
  if (isConfigured && await isTrackingAllowedByUser()) {
    establishDataLayer();
    setupTagManager(tagMangerSourceUrl);
  }
}
function getTagMangerSourceUrl() {
  return define_import_meta_env_default.VITE_APP_USER_TRACKING_TAG_MANAGER_SOURCE;
}
async function isTrackingAllowedByUser() {
  const cookieValue = await waitForCookieValue(
    ALLOW_TRACKING_COOKIE_NAME,
    COOKIE_POLLING_INTERVAL
  );
  return cookieValue === "1";
}
const ALLOW_TRACKING_COOKIE_NAME = "cookie-allow-tracking";
const COOKIE_POLLING_INTERVAL = 500;
document.addEventListener("DOMContentLoaded", function() {
  const rootDiv = document.getElementById(nsp("root"));
  if (!rootDiv) return;
  const elternGeldDigitalWizardUrl = rootDiv.dataset.elternGeldDigitalWizardUrl;
  createRoot(rootDiv).render(
    /* @__PURE__ */ jsxRuntimeExports.jsxs(reactExports.StrictMode, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Provider_default, { store, children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, { elternGeldDigitalWizardUrl }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: nsp("toast") })
    ] })
  );
  setupUserTracking();
});
setupCalculation();
export {
  monatsplanerActions as $,
  lastIndexOfType as A,
  Button as B,
  hasContinuousMonthsOfType as C,
  DateTime as D,
  EgrBerechnungParamId as E,
  React$1 as F,
  getDefaultExportFromCjs as G,
  commonjsGlobal as H,
  Big as I,
  getAutomaticallySelectedPSBMonthIndex as J,
  KinderFreiBetrag as K,
  KassenArt as L,
  RentenArt as M,
  stepErwerbstaetigkeitElternteilSelectors as N,
  initialTaetigkeit as O,
  Page as P,
  formatAsCurrency as Q,
  ReactDOM as R,
  SteuerKlasse as S,
  _default$1 as T,
  createAppSelector as U,
  stepRechnerSelectors as V,
  stepNachwuchsSelectors as W,
  monatsplanerSelectors as X,
  YesNo as Y,
  _default$4 as Z,
  _default$6 as _,
  useNavigate as a,
  canNotChangeBEGDueToSimultaneousMonthRules as a0,
  canNotChangeBEGDueToLimitReachedPerParent as a1,
  canNotChangeEGPDueToLimitReachedPerParent as a2,
  reachedLimitOfSimultaneousBEGMonths as a3,
  isExceptionToSimulatenousMonthRestrictions as a4,
  useAppStore as a5,
  _default as a6,
  useAppSelector as b,
  classNames as c,
  stepAllgemeineAngabenActions as d,
  setTrackingVariable as e,
  formSteps as f,
  stepNachwuchsActions as g,
  stepAllgemeineAngabenSelectors as h,
  initialStepErwerbstaetigkeitElternteil as i,
  jsxRuntimeExports as j,
  stepErwerbstaetigkeitActions as k,
  stepEinkommenActions as l,
  initialBruttoEinkommenZeitraum as m,
  nsp as n,
  numberOfMutterschutzMonths as o,
  parseGermanDateString as p,
  _default$5 as q,
  reactExports as r,
  stepRechnerActions as s,
  getGeburtstagSettings as t,
  useAppDispatch as u,
  getFruehchen as v,
  countFilledMonths as w,
  countBEGMonths as x,
  countEGPlusMonths as y,
  minNumberOfElterngeld as z
};
