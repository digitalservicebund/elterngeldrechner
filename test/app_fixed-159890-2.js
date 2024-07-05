"use strict";
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
/*! jQuery v3.2.1 | (c) JS Foundation and other contributors | jquery.org/license */
!function (a, b) {
  "use strict";
  "object" == (typeof module === "undefined" ? "undefined" : _typeof(module)) && "object" == _typeof(module.exports) ? module.exports = a.document ? b(a, !0) : function (a) {
    if (!a.document) throw new Error("jQuery requires a window with a document");return b(a);
  } : b(a);
}("undefined" != typeof window ? window : undefined, function (a, b) {
  "use strict";
  var c = [],
      d = a.document,
      e = Object.getPrototypeOf,
      f = c.slice,
      g = c.concat,
      h = c.push,
      i = c.indexOf,
      j = {},
      k = j.toString,
      l = j.hasOwnProperty,
      m = l.toString,
      n = m.call(Object),
      o = {};function p(a, b) {
    b = b || d;var c = b.createElement("script");c.text = a, b.head.appendChild(c).parentNode.removeChild(c);
  }var q = "3.2.1",
      r = function r(a, b) {
    return new r.fn.init(a, b);
  },
      s = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
      t = /^-ms-/,
      u = /-([a-z])/g,
      v = function v(a, b) {
    return b.toUpperCase();
  };r.fn = r.prototype = { jquery: q, constructor: r, length: 0, toArray: function toArray() {
      return f.call(this);
    }, get: function get(a) {
      return null == a ? f.call(this) : a < 0 ? this[a + this.length] : this[a];
    }, pushStack: function pushStack(a) {
      var b = r.merge(this.constructor(), a);return b.prevObject = this, b;
    }, each: function each(a) {
      return r.each(this, a);
    }, map: function map(a) {
      return this.pushStack(r.map(this, function (b, c) {
        return a.call(b, c, b);
      }));
    }, slice: function slice() {
      return this.pushStack(f.apply(this, arguments));
    }, first: function first() {
      return this.eq(0);
    }, last: function last() {
      return this.eq(-1);
    }, eq: function eq(a) {
      var b = this.length,
          c = +a + (a < 0 ? b : 0);return this.pushStack(c >= 0 && c < b ? [this[c]] : []);
    }, end: function end() {
      return this.prevObject || this.constructor();
    }, push: h, sort: c.sort, splice: c.splice }, r.extend = r.fn.extend = function () {
    var a,
        b,
        c,
        d,
        e,
        f,
        g = arguments[0] || {},
        h = 1,
        i = arguments.length,
        j = !1;for ("boolean" == typeof g && (j = g, g = arguments[h] || {}, h++), "object" == (typeof g === "undefined" ? "undefined" : _typeof(g)) || r.isFunction(g) || (g = {}), h === i && (g = this, h--); h < i; h++) {
      if (null != (a = arguments[h])) for (b in a) {
        c = g[b], d = a[b], g !== d && (j && d && (r.isPlainObject(d) || (e = Array.isArray(d))) ? (e ? (e = !1, f = c && Array.isArray(c) ? c : []) : f = c && r.isPlainObject(c) ? c : {}, g[b] = r.extend(j, f, d)) : void 0 !== d && (g[b] = d));
      }
    }return g;
  }, r.extend({ expando: "jQuery" + (q + Math.random()).replace(/\D/g, ""), isReady: !0, error: function error(a) {
      throw new Error(a);
    }, noop: function noop() {}, isFunction: function isFunction(a) {
      return "function" === r.type(a);
    }, isWindow: function isWindow(a) {
      return null != a && a === a.window;
    }, isNumeric: function isNumeric(a) {
      var b = r.type(a);return ("number" === b || "string" === b) && !isNaN(a - parseFloat(a));
    }, isPlainObject: function isPlainObject(a) {
      var b, c;return !(!a || "[object Object]" !== k.call(a)) && (!(b = e(a)) || (c = l.call(b, "constructor") && b.constructor, "function" == typeof c && m.call(c) === n));
    }, isEmptyObject: function isEmptyObject(a) {
      var b;for (b in a) {
        return !1;
      }return !0;
    }, type: function type(a) {
      return null == a ? a + "" : "object" == (typeof a === "undefined" ? "undefined" : _typeof(a)) || "function" == typeof a ? j[k.call(a)] || "object" : typeof a === "undefined" ? "undefined" : _typeof(a);
    }, globalEval: function globalEval(a) {
      p(a);
    }, camelCase: function camelCase(a) {
      return a.replace(t, "ms-").replace(u, v);
    }, each: function each(a, b) {
      var c,
          d = 0;if (w(a)) {
        for (c = a.length; d < c; d++) {
          if (b.call(a[d], d, a[d]) === !1) break;
        }
      } else for (d in a) {
        if (b.call(a[d], d, a[d]) === !1) break;
      }return a;
    }, trim: function trim(a) {
      return null == a ? "" : (a + "").replace(s, "");
    }, makeArray: function makeArray(a, b) {
      var c = b || [];return null != a && (w(Object(a)) ? r.merge(c, "string" == typeof a ? [a] : a) : h.call(c, a)), c;
    }, inArray: function inArray(a, b, c) {
      return null == b ? -1 : i.call(b, a, c);
    }, merge: function merge(a, b) {
      for (var c = +b.length, d = 0, e = a.length; d < c; d++) {
        a[e++] = b[d];
      }return a.length = e, a;
    }, grep: function grep(a, b, c) {
      for (var d, e = [], f = 0, g = a.length, h = !c; f < g; f++) {
        d = !b(a[f], f), d !== h && e.push(a[f]);
      }return e;
    }, map: function map(a, b, c) {
      var d,
          e,
          f = 0,
          h = [];if (w(a)) for (d = a.length; f < d; f++) {
        e = b(a[f], f, c), null != e && h.push(e);
      } else for (f in a) {
        e = b(a[f], f, c), null != e && h.push(e);
      }return g.apply([], h);
    }, guid: 1, proxy: function proxy(a, b) {
      var c, d, e;if ("string" == typeof b && (c = a[b], b = a, a = c), r.isFunction(a)) return d = f.call(arguments, 2), e = function e() {
        return a.apply(b || this, d.concat(f.call(arguments)));
      }, e.guid = a.guid = a.guid || r.guid++, e;
    }, now: Date.now, support: o }), "function" == typeof Symbol && (r.fn[Symbol.iterator] = c[Symbol.iterator]), r.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function (a, b) {
    j["[object " + b + "]"] = b.toLowerCase();
  });function w(a) {
    var b = !!a && "length" in a && a.length,
        c = r.type(a);return "function" !== c && !r.isWindow(a) && ("array" === c || 0 === b || "number" == typeof b && b > 0 && b - 1 in a);
  }var x = function (a) {
    var b,
        c,
        d,
        e,
        f,
        g,
        h,
        i,
        j,
        k,
        l,
        m,
        n,
        o,
        p,
        q,
        r,
        s,
        t,
        u = "sizzle" + 1 * new Date(),
        v = a.document,
        w = 0,
        x = 0,
        y = ha(),
        z = ha(),
        A = ha(),
        B = function B(a, b) {
      return a === b && (l = !0), 0;
    },
        C = {}.hasOwnProperty,
        D = [],
        E = D.pop,
        F = D.push,
        G = D.push,
        H = D.slice,
        I = function I(a, b) {
      for (var c = 0, d = a.length; c < d; c++) {
        if (a[c] === b) return c;
      }return -1;
    },
        J = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
        K = "[\\x20\\t\\r\\n\\f]",
        L = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",
        M = "\\[" + K + "*(" + L + ")(?:" + K + "*([*^$|!~]?=)" + K + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + L + "))|)" + K + "*\\]",
        N = ":(" + L + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + M + ")*)|.*)\\)|)",
        O = new RegExp(K + "+", "g"),
        P = new RegExp("^" + K + "+|((?:^|[^\\\\])(?:\\\\.)*)" + K + "+$", "g"),
        Q = new RegExp("^" + K + "*," + K + "*"),
        R = new RegExp("^" + K + "*([>+~]|" + K + ")" + K + "*"),
        S = new RegExp("=" + K + "*([^\\]'\"]*?)" + K + "*\\]", "g"),
        T = new RegExp(N),
        U = new RegExp("^" + L + "$"),
        V = { ID: new RegExp("^#(" + L + ")"), CLASS: new RegExp("^\\.(" + L + ")"), TAG: new RegExp("^(" + L + "|[*])"), ATTR: new RegExp("^" + M), PSEUDO: new RegExp("^" + N), CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + K + "*(even|odd|(([+-]|)(\\d*)n|)" + K + "*(?:([+-]|)" + K + "*(\\d+)|))" + K + "*\\)|)", "i"), bool: new RegExp("^(?:" + J + ")$", "i"), needsContext: new RegExp("^" + K + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + K + "*((?:-\\d)?\\d*)" + K + "*\\)|)(?=[^-]|$)", "i") },
        W = /^(?:input|select|textarea|button)$/i,
        X = /^h\d$/i,
        Y = /^[^{]+\{\s*\[native \w/,
        Z = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
        $ = /[+~]/,
        _ = new RegExp("\\\\([\\da-f]{1,6}" + K + "?|(" + K + ")|.)", "ig"),
        aa = function aa(a, b, c) {
      var d = "0x" + b - 65536;return d !== d || c ? b : d < 0 ? String.fromCharCode(d + 65536) : String.fromCharCode(d >> 10 | 55296, 1023 & d | 56320);
    },
        ba = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
        ca = function ca(a, b) {
      return b ? "\0" === a ? "\uFFFD" : a.slice(0, -1) + "\\" + a.charCodeAt(a.length - 1).toString(16) + " " : "\\" + a;
    },
        da = function da() {
      m();
    },
        ea = ta(function (a) {
      return a.disabled === !0 && ("form" in a || "label" in a);
    }, { dir: "parentNode", next: "legend" });try {
      G.apply(D = H.call(v.childNodes), v.childNodes), D[v.childNodes.length].nodeType;
    } catch (fa) {
      G = { apply: D.length ? function (a, b) {
          F.apply(a, H.call(b));
        } : function (a, b) {
          var c = a.length,
              d = 0;while (a[c++] = b[d++]) {}a.length = c - 1;
        } };
    }function ga(a, b, d, e) {
      var f,
          h,
          j,
          k,
          l,
          o,
          r,
          s = b && b.ownerDocument,
          w = b ? b.nodeType : 9;if (d = d || [], "string" != typeof a || !a || 1 !== w && 9 !== w && 11 !== w) return d;if (!e && ((b ? b.ownerDocument || b : v) !== n && m(b), b = b || n, p)) {
        if (11 !== w && (l = Z.exec(a))) if (f = l[1]) {
          if (9 === w) {
            if (!(j = b.getElementById(f))) return d;if (j.id === f) return d.push(j), d;
          } else if (s && (j = s.getElementById(f)) && t(b, j) && j.id === f) return d.push(j), d;
        } else {
          if (l[2]) return G.apply(d, b.getElementsByTagName(a)), d;if ((f = l[3]) && c.getElementsByClassName && b.getElementsByClassName) return G.apply(d, b.getElementsByClassName(f)), d;
        }if (c.qsa && !A[a + " "] && (!q || !q.test(a))) {
          if (1 !== w) s = b, r = a;else if ("object" !== b.nodeName.toLowerCase()) {
            (k = b.getAttribute("id")) ? k = k.replace(ba, ca) : b.setAttribute("id", k = u), o = g(a), h = o.length;while (h--) {
              o[h] = "#" + k + " " + sa(o[h]);
            }r = o.join(","), s = $.test(a) && qa(b.parentNode) || b;
          }if (r) try {
            return G.apply(d, s.querySelectorAll(r)), d;
          } catch (x) {} finally {
            k === u && b.removeAttribute("id");
          }
        }
      }return i(a.replace(P, "$1"), b, d, e);
    }function ha() {
      var a = [];function b(c, e) {
        return a.push(c + " ") > d.cacheLength && delete b[a.shift()], b[c + " "] = e;
      }return b;
    }function ia(a) {
      return a[u] = !0, a;
    }function ja(a) {
      var b = n.createElement("fieldset");try {
        return !!a(b);
      } catch (c) {
        return !1;
      } finally {
        b.parentNode && b.parentNode.removeChild(b), b = null;
      }
    }function ka(a, b) {
      var c = a.split("|"),
          e = c.length;while (e--) {
        d.attrHandle[c[e]] = b;
      }
    }function la(a, b) {
      var c = b && a,
          d = c && 1 === a.nodeType && 1 === b.nodeType && a.sourceIndex - b.sourceIndex;if (d) return d;if (c) while (c = c.nextSibling) {
        if (c === b) return -1;
      }return a ? 1 : -1;
    }function ma(a) {
      return function (b) {
        var c = b.nodeName.toLowerCase();return "input" === c && b.type === a;
      };
    }function na(a) {
      return function (b) {
        var c = b.nodeName.toLowerCase();return ("input" === c || "button" === c) && b.type === a;
      };
    }function oa(a) {
      return function (b) {
        return "form" in b ? b.parentNode && b.disabled === !1 ? "label" in b ? "label" in b.parentNode ? b.parentNode.disabled === a : b.disabled === a : b.isDisabled === a || b.isDisabled !== !a && ea(b) === a : b.disabled === a : "label" in b && b.disabled === a;
      };
    }function pa(a) {
      return ia(function (b) {
        return b = +b, ia(function (c, d) {
          var e,
              f = a([], c.length, b),
              g = f.length;while (g--) {
            c[e = f[g]] && (c[e] = !(d[e] = c[e]));
          }
        });
      });
    }function qa(a) {
      return a && "undefined" != typeof a.getElementsByTagName && a;
    }c = ga.support = {}, f = ga.isXML = function (a) {
      var b = a && (a.ownerDocument || a).documentElement;return !!b && "HTML" !== b.nodeName;
    }, m = ga.setDocument = function (a) {
      var b,
          e,
          g = a ? a.ownerDocument || a : v;return g !== n && 9 === g.nodeType && g.documentElement ? (n = g, o = n.documentElement, p = !f(n), v !== n && (e = n.defaultView) && e.top !== e && (e.addEventListener ? e.addEventListener("unload", da, !1) : e.attachEvent && e.attachEvent("onunload", da)), c.attributes = ja(function (a) {
        return a.className = "i", !a.getAttribute("className");
      }), c.getElementsByTagName = ja(function (a) {
        return a.appendChild(n.createComment("")), !a.getElementsByTagName("*").length;
      }), c.getElementsByClassName = Y.test(n.getElementsByClassName), c.getById = ja(function (a) {
        return o.appendChild(a).id = u, !n.getElementsByName || !n.getElementsByName(u).length;
      }), c.getById ? (d.filter.ID = function (a) {
        var b = a.replace(_, aa);return function (a) {
          return a.getAttribute("id") === b;
        };
      }, d.find.ID = function (a, b) {
        if ("undefined" != typeof b.getElementById && p) {
          var c = b.getElementById(a);return c ? [c] : [];
        }
      }) : (d.filter.ID = function (a) {
        var b = a.replace(_, aa);return function (a) {
          var c = "undefined" != typeof a.getAttributeNode && a.getAttributeNode("id");return c && c.value === b;
        };
      }, d.find.ID = function (a, b) {
        if ("undefined" != typeof b.getElementById && p) {
          var c,
              d,
              e,
              f = b.getElementById(a);if (f) {
            if (c = f.getAttributeNode("id"), c && c.value === a) return [f];e = b.getElementsByName(a), d = 0;while (f = e[d++]) {
              if (c = f.getAttributeNode("id"), c && c.value === a) return [f];
            }
          }return [];
        }
      }), d.find.TAG = c.getElementsByTagName ? function (a, b) {
        return "undefined" != typeof b.getElementsByTagName ? b.getElementsByTagName(a) : c.qsa ? b.querySelectorAll(a) : void 0;
      } : function (a, b) {
        var c,
            d = [],
            e = 0,
            f = b.getElementsByTagName(a);if ("*" === a) {
          while (c = f[e++]) {
            1 === c.nodeType && d.push(c);
          }return d;
        }return f;
      }, d.find.CLASS = c.getElementsByClassName && function (a, b) {
        if ("undefined" != typeof b.getElementsByClassName && p) return b.getElementsByClassName(a);
      }, r = [], q = [], (c.qsa = Y.test(n.querySelectorAll)) && (ja(function (a) {
        o.appendChild(a).innerHTML = "<a id='" + u + "'></a><select id='" + u + "-\r\\' msallowcapture=''><option selected=''></option></select>", a.querySelectorAll("[msallowcapture^='']").length && q.push("[*^$]=" + K + "*(?:''|\"\")"), a.querySelectorAll("[selected]").length || q.push("\\[" + K + "*(?:value|" + J + ")"), a.querySelectorAll("[id~=" + u + "-]").length || q.push("~="), a.querySelectorAll(":checked").length || q.push(":checked"), a.querySelectorAll("a#" + u + "+*").length || q.push(".#.+[+~]");
      }), ja(function (a) {
        a.innerHTML = "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";var b = n.createElement("input");b.setAttribute("type", "hidden"), a.appendChild(b).setAttribute("name", "D"), a.querySelectorAll("[name=d]").length && q.push("name" + K + "*[*^$|!~]?="), 2 !== a.querySelectorAll(":enabled").length && q.push(":enabled", ":disabled"), o.appendChild(a).disabled = !0, 2 !== a.querySelectorAll(":disabled").length && q.push(":enabled", ":disabled"), a.querySelectorAll("*,:x"), q.push(",.*:");
      })), (c.matchesSelector = Y.test(s = o.matches || o.webkitMatchesSelector || o.mozMatchesSelector || o.oMatchesSelector || o.msMatchesSelector)) && ja(function (a) {
        c.disconnectedMatch = s.call(a, "*"), s.call(a, "[s!='']:x"), r.push("!=", N);
      }), q = q.length && new RegExp(q.join("|")), r = r.length && new RegExp(r.join("|")), b = Y.test(o.compareDocumentPosition), t = b || Y.test(o.contains) ? function (a, b) {
        var c = 9 === a.nodeType ? a.documentElement : a,
            d = b && b.parentNode;return a === d || !(!d || 1 !== d.nodeType || !(c.contains ? c.contains(d) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(d)));
      } : function (a, b) {
        if (b) while (b = b.parentNode) {
          if (b === a) return !0;
        }return !1;
      }, B = b ? function (a, b) {
        if (a === b) return l = !0, 0;var d = !a.compareDocumentPosition - !b.compareDocumentPosition;return d ? d : (d = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1, 1 & d || !c.sortDetached && b.compareDocumentPosition(a) === d ? a === n || a.ownerDocument === v && t(v, a) ? -1 : b === n || b.ownerDocument === v && t(v, b) ? 1 : k ? I(k, a) - I(k, b) : 0 : 4 & d ? -1 : 1);
      } : function (a, b) {
        if (a === b) return l = !0, 0;var c,
            d = 0,
            e = a.parentNode,
            f = b.parentNode,
            g = [a],
            h = [b];if (!e || !f) return a === n ? -1 : b === n ? 1 : e ? -1 : f ? 1 : k ? I(k, a) - I(k, b) : 0;if (e === f) return la(a, b);c = a;while (c = c.parentNode) {
          g.unshift(c);
        }c = b;while (c = c.parentNode) {
          h.unshift(c);
        }while (g[d] === h[d]) {
          d++;
        }return d ? la(g[d], h[d]) : g[d] === v ? -1 : h[d] === v ? 1 : 0;
      }, n) : n;
    }, ga.matches = function (a, b) {
      return ga(a, null, null, b);
    }, ga.matchesSelector = function (a, b) {
      if ((a.ownerDocument || a) !== n && m(a), b = b.replace(S, "='$1']"), c.matchesSelector && p && !A[b + " "] && (!r || !r.test(b)) && (!q || !q.test(b))) try {
        var d = s.call(a, b);if (d || c.disconnectedMatch || a.document && 11 !== a.document.nodeType) return d;
      } catch (e) {}return ga(b, n, null, [a]).length > 0;
    }, ga.contains = function (a, b) {
      return (a.ownerDocument || a) !== n && m(a), t(a, b);
    }, ga.attr = function (a, b) {
      (a.ownerDocument || a) !== n && m(a);var e = d.attrHandle[b.toLowerCase()],
          f = e && C.call(d.attrHandle, b.toLowerCase()) ? e(a, b, !p) : void 0;return void 0 !== f ? f : c.attributes || !p ? a.getAttribute(b) : (f = a.getAttributeNode(b)) && f.specified ? f.value : null;
    }, ga.escape = function (a) {
      return (a + "").replace(ba, ca);
    }, ga.error = function (a) {
      throw new Error("Syntax error, unrecognized expression: " + a);
    }, ga.uniqueSort = function (a) {
      var b,
          d = [],
          e = 0,
          f = 0;if (l = !c.detectDuplicates, k = !c.sortStable && a.slice(0), a.sort(B), l) {
        while (b = a[f++]) {
          b === a[f] && (e = d.push(f));
        }while (e--) {
          a.splice(d[e], 1);
        }
      }return k = null, a;
    }, e = ga.getText = function (a) {
      var b,
          c = "",
          d = 0,
          f = a.nodeType;if (f) {
        if (1 === f || 9 === f || 11 === f) {
          if ("string" == typeof a.textContent) return a.textContent;for (a = a.firstChild; a; a = a.nextSibling) {
            c += e(a);
          }
        } else if (3 === f || 4 === f) return a.nodeValue;
      } else while (b = a[d++]) {
        c += e(b);
      }return c;
    }, d = ga.selectors = { cacheLength: 50, createPseudo: ia, match: V, attrHandle: {}, find: {}, relative: { ">": { dir: "parentNode", first: !0 }, " ": { dir: "parentNode" }, "+": { dir: "previousSibling", first: !0 }, "~": { dir: "previousSibling" } }, preFilter: { ATTR: function ATTR(a) {
          return a[1] = a[1].replace(_, aa), a[3] = (a[3] || a[4] || a[5] || "").replace(_, aa), "~=" === a[2] && (a[3] = " " + a[3] + " "), a.slice(0, 4);
        }, CHILD: function CHILD(a) {
          return a[1] = a[1].toLowerCase(), "nth" === a[1].slice(0, 3) ? (a[3] || ga.error(a[0]), a[4] = +(a[4] ? a[5] + (a[6] || 1) : 2 * ("even" === a[3] || "odd" === a[3])), a[5] = +(a[7] + a[8] || "odd" === a[3])) : a[3] && ga.error(a[0]), a;
        }, PSEUDO: function PSEUDO(a) {
          var b,
              c = !a[6] && a[2];return V.CHILD.test(a[0]) ? null : (a[3] ? a[2] = a[4] || a[5] || "" : c && T.test(c) && (b = g(c, !0)) && (b = c.indexOf(")", c.length - b) - c.length) && (a[0] = a[0].slice(0, b), a[2] = c.slice(0, b)), a.slice(0, 3));
        } }, filter: { TAG: function TAG(a) {
          var b = a.replace(_, aa).toLowerCase();return "*" === a ? function () {
            return !0;
          } : function (a) {
            return a.nodeName && a.nodeName.toLowerCase() === b;
          };
        }, CLASS: function CLASS(a) {
          var b = y[a + " "];return b || (b = new RegExp("(^|" + K + ")" + a + "(" + K + "|$)")) && y(a, function (a) {
            return b.test("string" == typeof a.className && a.className || "undefined" != typeof a.getAttribute && a.getAttribute("class") || "");
          });
        }, ATTR: function ATTR(a, b, c) {
          return function (d) {
            var e = ga.attr(d, a);return null == e ? "!=" === b : !b || (e += "", "=" === b ? e === c : "!=" === b ? e !== c : "^=" === b ? c && 0 === e.indexOf(c) : "*=" === b ? c && e.indexOf(c) > -1 : "$=" === b ? c && e.slice(-c.length) === c : "~=" === b ? (" " + e.replace(O, " ") + " ").indexOf(c) > -1 : "|=" === b && (e === c || e.slice(0, c.length + 1) === c + "-"));
          };
        }, CHILD: function CHILD(a, b, c, d, e) {
          var f = "nth" !== a.slice(0, 3),
              g = "last" !== a.slice(-4),
              h = "of-type" === b;return 1 === d && 0 === e ? function (a) {
            return !!a.parentNode;
          } : function (b, c, i) {
            var j,
                k,
                l,
                m,
                n,
                o,
                p = f !== g ? "nextSibling" : "previousSibling",
                q = b.parentNode,
                r = h && b.nodeName.toLowerCase(),
                s = !i && !h,
                t = !1;if (q) {
              if (f) {
                while (p) {
                  m = b;while (m = m[p]) {
                    if (h ? m.nodeName.toLowerCase() === r : 1 === m.nodeType) return !1;
                  }o = p = "only" === a && !o && "nextSibling";
                }return !0;
              }if (o = [g ? q.firstChild : q.lastChild], g && s) {
                m = q, l = m[u] || (m[u] = {}), k = l[m.uniqueID] || (l[m.uniqueID] = {}), j = k[a] || [], n = j[0] === w && j[1], t = n && j[2], m = n && q.childNodes[n];while (m = ++n && m && m[p] || (t = n = 0) || o.pop()) {
                  if (1 === m.nodeType && ++t && m === b) {
                    k[a] = [w, n, t];break;
                  }
                }
              } else if (s && (m = b, l = m[u] || (m[u] = {}), k = l[m.uniqueID] || (l[m.uniqueID] = {}), j = k[a] || [], n = j[0] === w && j[1], t = n), t === !1) while (m = ++n && m && m[p] || (t = n = 0) || o.pop()) {
                if ((h ? m.nodeName.toLowerCase() === r : 1 === m.nodeType) && ++t && (s && (l = m[u] || (m[u] = {}), k = l[m.uniqueID] || (l[m.uniqueID] = {}), k[a] = [w, t]), m === b)) break;
              }return t -= e, t === d || t % d === 0 && t / d >= 0;
            }
          };
        }, PSEUDO: function PSEUDO(a, b) {
          var c,
              e = d.pseudos[a] || d.setFilters[a.toLowerCase()] || ga.error("unsupported pseudo: " + a);return e[u] ? e(b) : e.length > 1 ? (c = [a, a, "", b], d.setFilters.hasOwnProperty(a.toLowerCase()) ? ia(function (a, c) {
            var d,
                f = e(a, b),
                g = f.length;while (g--) {
              d = I(a, f[g]), a[d] = !(c[d] = f[g]);
            }
          }) : function (a) {
            return e(a, 0, c);
          }) : e;
        } }, pseudos: { not: ia(function (a) {
          var b = [],
              c = [],
              d = h(a.replace(P, "$1"));return d[u] ? ia(function (a, b, c, e) {
            var f,
                g = d(a, null, e, []),
                h = a.length;while (h--) {
              (f = g[h]) && (a[h] = !(b[h] = f));
            }
          }) : function (a, e, f) {
            return b[0] = a, d(b, null, f, c), b[0] = null, !c.pop();
          };
        }), has: ia(function (a) {
          return function (b) {
            return ga(a, b).length > 0;
          };
        }), contains: ia(function (a) {
          return a = a.replace(_, aa), function (b) {
            return (b.textContent || b.innerText || e(b)).indexOf(a) > -1;
          };
        }), lang: ia(function (a) {
          return U.test(a || "") || ga.error("unsupported lang: " + a), a = a.replace(_, aa).toLowerCase(), function (b) {
            var c;do {
              if (c = p ? b.lang : b.getAttribute("xml:lang") || b.getAttribute("lang")) return c = c.toLowerCase(), c === a || 0 === c.indexOf(a + "-");
            } while ((b = b.parentNode) && 1 === b.nodeType);return !1;
          };
        }), target: function target(b) {
          var c = a.location && a.location.hash;return c && c.slice(1) === b.id;
        }, root: function root(a) {
          return a === o;
        }, focus: function focus(a) {
          return a === n.activeElement && (!n.hasFocus || n.hasFocus()) && !!(a.type || a.href || ~a.tabIndex);
        }, enabled: oa(!1), disabled: oa(!0), checked: function checked(a) {
          var b = a.nodeName.toLowerCase();return "input" === b && !!a.checked || "option" === b && !!a.selected;
        }, selected: function selected(a) {
          return a.parentNode && a.parentNode.selectedIndex, a.selected === !0;
        }, empty: function empty(a) {
          for (a = a.firstChild; a; a = a.nextSibling) {
            if (a.nodeType < 6) return !1;
          }return !0;
        }, parent: function parent(a) {
          return !d.pseudos.empty(a);
        }, header: function header(a) {
          return X.test(a.nodeName);
        }, input: function input(a) {
          return W.test(a.nodeName);
        }, button: function button(a) {
          var b = a.nodeName.toLowerCase();return "input" === b && "button" === a.type || "button" === b;
        }, text: function text(a) {
          var b;return "input" === a.nodeName.toLowerCase() && "text" === a.type && (null == (b = a.getAttribute("type")) || "text" === b.toLowerCase());
        }, first: pa(function () {
          return [0];
        }), last: pa(function (a, b) {
          return [b - 1];
        }), eq: pa(function (a, b, c) {
          return [c < 0 ? c + b : c];
        }), even: pa(function (a, b) {
          for (var c = 0; c < b; c += 2) {
            a.push(c);
          }return a;
        }), odd: pa(function (a, b) {
          for (var c = 1; c < b; c += 2) {
            a.push(c);
          }return a;
        }), lt: pa(function (a, b, c) {
          for (var d = c < 0 ? c + b : c; --d >= 0;) {
            a.push(d);
          }return a;
        }), gt: pa(function (a, b, c) {
          for (var d = c < 0 ? c + b : c; ++d < b;) {
            a.push(d);
          }return a;
        }) } }, d.pseudos.nth = d.pseudos.eq;for (b in { radio: !0, checkbox: !0, file: !0, password: !0, image: !0 }) {
      d.pseudos[b] = ma(b);
    }for (b in { submit: !0, reset: !0 }) {
      d.pseudos[b] = na(b);
    }function ra() {}ra.prototype = d.filters = d.pseudos, d.setFilters = new ra(), g = ga.tokenize = function (a, b) {
      var c,
          e,
          f,
          g,
          h,
          i,
          j,
          k = z[a + " "];if (k) return b ? 0 : k.slice(0);h = a, i = [], j = d.preFilter;while (h) {
        c && !(e = Q.exec(h)) || (e && (h = h.slice(e[0].length) || h), i.push(f = [])), c = !1, (e = R.exec(h)) && (c = e.shift(), f.push({ value: c, type: e[0].replace(P, " ") }), h = h.slice(c.length));for (g in d.filter) {
          !(e = V[g].exec(h)) || j[g] && !(e = j[g](e)) || (c = e.shift(), f.push({ value: c, type: g, matches: e }), h = h.slice(c.length));
        }if (!c) break;
      }return b ? h.length : h ? ga.error(a) : z(a, i).slice(0);
    };function sa(a) {
      for (var b = 0, c = a.length, d = ""; b < c; b++) {
        d += a[b].value;
      }return d;
    }function ta(a, b, c) {
      var d = b.dir,
          e = b.next,
          f = e || d,
          g = c && "parentNode" === f,
          h = x++;return b.first ? function (b, c, e) {
        while (b = b[d]) {
          if (1 === b.nodeType || g) return a(b, c, e);
        }return !1;
      } : function (b, c, i) {
        var j,
            k,
            l,
            m = [w, h];if (i) {
          while (b = b[d]) {
            if ((1 === b.nodeType || g) && a(b, c, i)) return !0;
          }
        } else while (b = b[d]) {
          if (1 === b.nodeType || g) if (l = b[u] || (b[u] = {}), k = l[b.uniqueID] || (l[b.uniqueID] = {}), e && e === b.nodeName.toLowerCase()) b = b[d] || b;else {
            if ((j = k[f]) && j[0] === w && j[1] === h) return m[2] = j[2];if (k[f] = m, m[2] = a(b, c, i)) return !0;
          }
        }return !1;
      };
    }function ua(a) {
      return a.length > 1 ? function (b, c, d) {
        var e = a.length;while (e--) {
          if (!a[e](b, c, d)) return !1;
        }return !0;
      } : a[0];
    }function va(a, b, c) {
      for (var d = 0, e = b.length; d < e; d++) {
        ga(a, b[d], c);
      }return c;
    }function wa(a, b, c, d, e) {
      for (var f, g = [], h = 0, i = a.length, j = null != b; h < i; h++) {
        (f = a[h]) && (c && !c(f, d, e) || (g.push(f), j && b.push(h)));
      }return g;
    }function xa(a, b, c, d, e, f) {
      return d && !d[u] && (d = xa(d)), e && !e[u] && (e = xa(e, f)), ia(function (f, g, h, i) {
        var j,
            k,
            l,
            m = [],
            n = [],
            o = g.length,
            p = f || va(b || "*", h.nodeType ? [h] : h, []),
            q = !a || !f && b ? p : wa(p, m, a, h, i),
            r = c ? e || (f ? a : o || d) ? [] : g : q;if (c && c(q, r, h, i), d) {
          j = wa(r, n), d(j, [], h, i), k = j.length;while (k--) {
            (l = j[k]) && (r[n[k]] = !(q[n[k]] = l));
          }
        }if (f) {
          if (e || a) {
            if (e) {
              j = [], k = r.length;while (k--) {
                (l = r[k]) && j.push(q[k] = l);
              }e(null, r = [], j, i);
            }k = r.length;while (k--) {
              (l = r[k]) && (j = e ? I(f, l) : m[k]) > -1 && (f[j] = !(g[j] = l));
            }
          }
        } else r = wa(r === g ? r.splice(o, r.length) : r), e ? e(null, g, r, i) : G.apply(g, r);
      });
    }function ya(a) {
      for (var b, c, e, f = a.length, g = d.relative[a[0].type], h = g || d.relative[" "], i = g ? 1 : 0, k = ta(function (a) {
        return a === b;
      }, h, !0), l = ta(function (a) {
        return I(b, a) > -1;
      }, h, !0), m = [function (a, c, d) {
        var e = !g && (d || c !== j) || ((b = c).nodeType ? k(a, c, d) : l(a, c, d));return b = null, e;
      }]; i < f; i++) {
        if (c = d.relative[a[i].type]) m = [ta(ua(m), c)];else {
          if (c = d.filter[a[i].type].apply(null, a[i].matches), c[u]) {
            for (e = ++i; e < f; e++) {
              if (d.relative[a[e].type]) break;
            }return xa(i > 1 && ua(m), i > 1 && sa(a.slice(0, i - 1).concat({ value: " " === a[i - 2].type ? "*" : "" })).replace(P, "$1"), c, i < e && ya(a.slice(i, e)), e < f && ya(a = a.slice(e)), e < f && sa(a));
          }m.push(c);
        }
      }return ua(m);
    }function za(a, b) {
      var c = b.length > 0,
          e = a.length > 0,
          f = function f(_f, g, h, i, k) {
        var l,
            o,
            q,
            r = 0,
            s = "0",
            t = _f && [],
            u = [],
            v = j,
            x = _f || e && d.find.TAG("*", k),
            y = w += null == v ? 1 : Math.random() || .1,
            z = x.length;for (k && (j = g === n || g || k); s !== z && null != (l = x[s]); s++) {
          if (e && l) {
            o = 0, g || l.ownerDocument === n || (m(l), h = !p);while (q = a[o++]) {
              if (q(l, g || n, h)) {
                i.push(l);break;
              }
            }k && (w = y);
          }c && ((l = !q && l) && r--, _f && t.push(l));
        }if (r += s, c && s !== r) {
          o = 0;while (q = b[o++]) {
            q(t, u, g, h);
          }if (_f) {
            if (r > 0) while (s--) {
              t[s] || u[s] || (u[s] = E.call(i));
            }u = wa(u);
          }G.apply(i, u), k && !_f && u.length > 0 && r + b.length > 1 && ga.uniqueSort(i);
        }return k && (w = y, j = v), t;
      };return c ? ia(f) : f;
    }return h = ga.compile = function (a, b) {
      var c,
          d = [],
          e = [],
          f = A[a + " "];if (!f) {
        b || (b = g(a)), c = b.length;while (c--) {
          f = ya(b[c]), f[u] ? d.push(f) : e.push(f);
        }f = A(a, za(e, d)), f.selector = a;
      }return f;
    }, i = ga.select = function (a, b, c, e) {
      var f,
          i,
          j,
          k,
          l,
          m = "function" == typeof a && a,
          n = !e && g(a = m.selector || a);if (c = c || [], 1 === n.length) {
        if (i = n[0] = n[0].slice(0), i.length > 2 && "ID" === (j = i[0]).type && 9 === b.nodeType && p && d.relative[i[1].type]) {
          if (b = (d.find.ID(j.matches[0].replace(_, aa), b) || [])[0], !b) return c;m && (b = b.parentNode), a = a.slice(i.shift().value.length);
        }f = V.needsContext.test(a) ? 0 : i.length;while (f--) {
          if (j = i[f], d.relative[k = j.type]) break;if ((l = d.find[k]) && (e = l(j.matches[0].replace(_, aa), $.test(i[0].type) && qa(b.parentNode) || b))) {
            if (i.splice(f, 1), a = e.length && sa(i), !a) return G.apply(c, e), c;break;
          }
        }
      }return (m || h(a, n))(e, b, !p, c, !b || $.test(a) && qa(b.parentNode) || b), c;
    }, c.sortStable = u.split("").sort(B).join("") === u, c.detectDuplicates = !!l, m(), c.sortDetached = ja(function (a) {
      return 1 & a.compareDocumentPosition(n.createElement("fieldset"));
    }), ja(function (a) {
      return a.innerHTML = "<a href='#'></a>", "#" === a.firstChild.getAttribute("href");
    }) || ka("type|href|height|width", function (a, b, c) {
      if (!c) return a.getAttribute(b, "type" === b.toLowerCase() ? 1 : 2);
    }), c.attributes && ja(function (a) {
      return a.innerHTML = "<input/>", a.firstChild.setAttribute("value", ""), "" === a.firstChild.getAttribute("value");
    }) || ka("value", function (a, b, c) {
      if (!c && "input" === a.nodeName.toLowerCase()) return a.defaultValue;
    }), ja(function (a) {
      return null == a.getAttribute("disabled");
    }) || ka(J, function (a, b, c) {
      var d;if (!c) return a[b] === !0 ? b.toLowerCase() : (d = a.getAttributeNode(b)) && d.specified ? d.value : null;
    }), ga;
  }(a);r.find = x, r.expr = x.selectors, r.expr[":"] = r.expr.pseudos, r.uniqueSort = r.unique = x.uniqueSort, r.text = x.getText, r.isXMLDoc = x.isXML, r.contains = x.contains, r.escapeSelector = x.escape;var y = function y(a, b, c) {
    var d = [],
        e = void 0 !== c;while ((a = a[b]) && 9 !== a.nodeType) {
      if (1 === a.nodeType) {
        if (e && r(a).is(c)) break;d.push(a);
      }
    }return d;
  },
      z = function z(a, b) {
    for (var c = []; a; a = a.nextSibling) {
      1 === a.nodeType && a !== b && c.push(a);
    }return c;
  },
      A = r.expr.match.needsContext;function B(a, b) {
    return a.nodeName && a.nodeName.toLowerCase() === b.toLowerCase();
  }var C = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i,
      D = /^.[^:#\[\.,]*$/;function E(a, b, c) {
    return r.isFunction(b) ? r.grep(a, function (a, d) {
      return !!b.call(a, d, a) !== c;
    }) : b.nodeType ? r.grep(a, function (a) {
      return a === b !== c;
    }) : "string" != typeof b ? r.grep(a, function (a) {
      return i.call(b, a) > -1 !== c;
    }) : D.test(b) ? r.filter(b, a, c) : (b = r.filter(b, a), r.grep(a, function (a) {
      return i.call(b, a) > -1 !== c && 1 === a.nodeType;
    }));
  }r.filter = function (a, b, c) {
    var d = b[0];return c && (a = ":not(" + a + ")"), 1 === b.length && 1 === d.nodeType ? r.find.matchesSelector(d, a) ? [d] : [] : r.find.matches(a, r.grep(b, function (a) {
      return 1 === a.nodeType;
    }));
  }, r.fn.extend({ find: function find(a) {
      var b,
          c,
          d = this.length,
          e = this;if ("string" != typeof a) return this.pushStack(r(a).filter(function () {
        for (b = 0; b < d; b++) {
          if (r.contains(e[b], this)) return !0;
        }
      }));for (c = this.pushStack([]), b = 0; b < d; b++) {
        r.find(a, e[b], c);
      }return d > 1 ? r.uniqueSort(c) : c;
    }, filter: function filter(a) {
      return this.pushStack(E(this, a || [], !1));
    }, not: function not(a) {
      return this.pushStack(E(this, a || [], !0));
    }, is: function is(a) {
      return !!E(this, "string" == typeof a && A.test(a) ? r(a) : a || [], !1).length;
    } });var F,
      G = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,
      H = r.fn.init = function (a, b, c) {
    var e, f;if (!a) return this;if (c = c || F, "string" == typeof a) {
      if (e = "<" === a[0] && ">" === a[a.length - 1] && a.length >= 3 ? [null, a, null] : G.exec(a), !e || !e[1] && b) return !b || b.jquery ? (b || c).find(a) : this.constructor(b).find(a);if (e[1]) {
        if (b = b instanceof r ? b[0] : b, r.merge(this, r.parseHTML(e[1], b && b.nodeType ? b.ownerDocument || b : d, !0)), C.test(e[1]) && r.isPlainObject(b)) for (e in b) {
          r.isFunction(this[e]) ? this[e](b[e]) : this.attr(e, b[e]);
        }return this;
      }return f = d.getElementById(e[2]), f && (this[0] = f, this.length = 1), this;
    }return a.nodeType ? (this[0] = a, this.length = 1, this) : r.isFunction(a) ? void 0 !== c.ready ? c.ready(a) : a(r) : r.makeArray(a, this);
  };H.prototype = r.fn, F = r(d);var I = /^(?:parents|prev(?:Until|All))/,
      J = { children: !0, contents: !0, next: !0, prev: !0 };r.fn.extend({ has: function has(a) {
      var b = r(a, this),
          c = b.length;return this.filter(function () {
        for (var a = 0; a < c; a++) {
          if (r.contains(this, b[a])) return !0;
        }
      });
    }, closest: function closest(a, b) {
      var c,
          d = 0,
          e = this.length,
          f = [],
          g = "string" != typeof a && r(a);if (!A.test(a)) for (; d < e; d++) {
        for (c = this[d]; c && c !== b; c = c.parentNode) {
          if (c.nodeType < 11 && (g ? g.index(c) > -1 : 1 === c.nodeType && r.find.matchesSelector(c, a))) {
            f.push(c);break;
          }
        }
      }return this.pushStack(f.length > 1 ? r.uniqueSort(f) : f);
    }, index: function index(a) {
      return a ? "string" == typeof a ? i.call(r(a), this[0]) : i.call(this, a.jquery ? a[0] : a) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
    }, add: function add(a, b) {
      return this.pushStack(r.uniqueSort(r.merge(this.get(), r(a, b))));
    }, addBack: function addBack(a) {
      return this.add(null == a ? this.prevObject : this.prevObject.filter(a));
    } });function K(a, b) {
    while ((a = a[b]) && 1 !== a.nodeType) {}return a;
  }r.each({ parent: function parent(a) {
      var b = a.parentNode;return b && 11 !== b.nodeType ? b : null;
    }, parents: function parents(a) {
      return y(a, "parentNode");
    }, parentsUntil: function parentsUntil(a, b, c) {
      return y(a, "parentNode", c);
    }, next: function next(a) {
      return K(a, "nextSibling");
    }, prev: function prev(a) {
      return K(a, "previousSibling");
    }, nextAll: function nextAll(a) {
      return y(a, "nextSibling");
    }, prevAll: function prevAll(a) {
      return y(a, "previousSibling");
    }, nextUntil: function nextUntil(a, b, c) {
      return y(a, "nextSibling", c);
    }, prevUntil: function prevUntil(a, b, c) {
      return y(a, "previousSibling", c);
    }, siblings: function siblings(a) {
      return z((a.parentNode || {}).firstChild, a);
    }, children: function children(a) {
      return z(a.firstChild);
    }, contents: function contents(a) {
      return B(a, "iframe") ? a.contentDocument : (B(a, "template") && (a = a.content || a), r.merge([], a.childNodes));
    } }, function (a, b) {
    r.fn[a] = function (c, d) {
      var e = r.map(this, b, c);return "Until" !== a.slice(-5) && (d = c), d && "string" == typeof d && (e = r.filter(d, e)), this.length > 1 && (J[a] || r.uniqueSort(e), I.test(a) && e.reverse()), this.pushStack(e);
    };
  });var L = /[^\x20\t\r\n\f]+/g;function M(a) {
    var b = {};return r.each(a.match(L) || [], function (a, c) {
      b[c] = !0;
    }), b;
  }r.Callbacks = function (a) {
    a = "string" == typeof a ? M(a) : r.extend({}, a);var b,
        c,
        d,
        e,
        f = [],
        g = [],
        h = -1,
        i = function i() {
      for (e = e || a.once, d = b = !0; g.length; h = -1) {
        c = g.shift();while (++h < f.length) {
          f[h].apply(c[0], c[1]) === !1 && a.stopOnFalse && (h = f.length, c = !1);
        }
      }a.memory || (c = !1), b = !1, e && (f = c ? [] : "");
    },
        j = { add: function add() {
        return f && (c && !b && (h = f.length - 1, g.push(c)), function d(b) {
          r.each(b, function (b, c) {
            r.isFunction(c) ? a.unique && j.has(c) || f.push(c) : c && c.length && "string" !== r.type(c) && d(c);
          });
        }(arguments), c && !b && i()), this;
      }, remove: function remove() {
        return r.each(arguments, function (a, b) {
          var c;while ((c = r.inArray(b, f, c)) > -1) {
            f.splice(c, 1), c <= h && h--;
          }
        }), this;
      }, has: function has(a) {
        return a ? r.inArray(a, f) > -1 : f.length > 0;
      }, empty: function empty() {
        return f && (f = []), this;
      }, disable: function disable() {
        return e = g = [], f = c = "", this;
      }, disabled: function disabled() {
        return !f;
      }, lock: function lock() {
        return e = g = [], c || b || (f = c = ""), this;
      }, locked: function locked() {
        return !!e;
      }, fireWith: function fireWith(a, c) {
        return e || (c = c || [], c = [a, c.slice ? c.slice() : c], g.push(c), b || i()), this;
      }, fire: function fire() {
        return j.fireWith(this, arguments), this;
      }, fired: function fired() {
        return !!d;
      } };return j;
  };function N(a) {
    return a;
  }function O(a) {
    throw a;
  }function P(a, b, c, d) {
    var e;try {
      a && r.isFunction(e = a.promise) ? e.call(a).done(b).fail(c) : a && r.isFunction(e = a.then) ? e.call(a, b, c) : b.apply(void 0, [a].slice(d));
    } catch (a) {
      c.apply(void 0, [a]);
    }
  }r.extend({ Deferred: function Deferred(b) {
      var c = [["notify", "progress", r.Callbacks("memory"), r.Callbacks("memory"), 2], ["resolve", "done", r.Callbacks("once memory"), r.Callbacks("once memory"), 0, "resolved"], ["reject", "fail", r.Callbacks("once memory"), r.Callbacks("once memory"), 1, "rejected"]],
          d = "pending",
          e = { state: function state() {
          return d;
        }, always: function always() {
          return f.done(arguments).fail(arguments), this;
        }, "catch": function _catch(a) {
          return e.then(null, a);
        }, pipe: function pipe() {
          var a = arguments;return r.Deferred(function (b) {
            r.each(c, function (c, d) {
              var e = r.isFunction(a[d[4]]) && a[d[4]];f[d[1]](function () {
                var a = e && e.apply(this, arguments);a && r.isFunction(a.promise) ? a.promise().progress(b.notify).done(b.resolve).fail(b.reject) : b[d[0] + "With"](this, e ? [a] : arguments);
              });
            }), a = null;
          }).promise();
        }, then: function then(b, d, e) {
          var f = 0;function g(b, c, d, e) {
            return function () {
              var h = this,
                  i = arguments,
                  j = function j() {
                var a, j;if (!(b < f)) {
                  if (a = d.apply(h, i), a === c.promise()) throw new TypeError("Thenable self-resolution");j = a && ("object" == (typeof a === "undefined" ? "undefined" : _typeof(a)) || "function" == typeof a) && a.then, r.isFunction(j) ? e ? j.call(a, g(f, c, N, e), g(f, c, O, e)) : (f++, j.call(a, g(f, c, N, e), g(f, c, O, e), g(f, c, N, c.notifyWith))) : (d !== N && (h = void 0, i = [a]), (e || c.resolveWith)(h, i));
                }
              },
                  k = e ? j : function () {
                try {
                  j();
                } catch (a) {
                  r.Deferred.exceptionHook && r.Deferred.exceptionHook(a, k.stackTrace), b + 1 >= f && (d !== O && (h = void 0, i = [a]), c.rejectWith(h, i));
                }
              };b ? k() : (r.Deferred.getStackHook && (k.stackTrace = r.Deferred.getStackHook()), a.setTimeout(k));
            };
          }return r.Deferred(function (a) {
            c[0][3].add(g(0, a, r.isFunction(e) ? e : N, a.notifyWith)), c[1][3].add(g(0, a, r.isFunction(b) ? b : N)), c[2][3].add(g(0, a, r.isFunction(d) ? d : O));
          }).promise();
        }, promise: function promise(a) {
          return null != a ? r.extend(a, e) : e;
        } },
          f = {};return r.each(c, function (a, b) {
        var g = b[2],
            h = b[5];e[b[1]] = g.add, h && g.add(function () {
          d = h;
        }, c[3 - a][2].disable, c[0][2].lock), g.add(b[3].fire), f[b[0]] = function () {
          return f[b[0] + "With"](this === f ? void 0 : this, arguments), this;
        }, f[b[0] + "With"] = g.fireWith;
      }), e.promise(f), b && b.call(f, f), f;
    }, when: function when(a) {
      var b = arguments.length,
          c = b,
          d = Array(c),
          e = f.call(arguments),
          g = r.Deferred(),
          h = function h(a) {
        return function (c) {
          d[a] = this, e[a] = arguments.length > 1 ? f.call(arguments) : c, --b || g.resolveWith(d, e);
        };
      };if (b <= 1 && (P(a, g.done(h(c)).resolve, g.reject, !b), "pending" === g.state() || r.isFunction(e[c] && e[c].then))) return g.then();while (c--) {
        P(e[c], h(c), g.reject);
      }return g.promise();
    } });var Q = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;r.Deferred.exceptionHook = function (b, c) {
    a.console && a.console.warn && b && Q.test(b.name) && a.console.warn("jQuery.Deferred exception: " + b.message, b.stack, c);
  }, r.readyException = function (b) {
    a.setTimeout(function () {
      throw b;
    });
  };var R = r.Deferred();r.fn.ready = function (a) {
    return R.then(a)["catch"](function (a) {
      r.readyException(a);
    }), this;
  }, r.extend({ isReady: !1, readyWait: 1, ready: function ready(a) {
      (a === !0 ? --r.readyWait : r.isReady) || (r.isReady = !0, a !== !0 && --r.readyWait > 0 || R.resolveWith(d, [r]));
    } }), r.ready.then = R.then;function S() {
    d.removeEventListener("DOMContentLoaded", S), a.removeEventListener("load", S), r.ready();
  }"complete" === d.readyState || "loading" !== d.readyState && !d.documentElement.doScroll ? a.setTimeout(r.ready) : (d.addEventListener("DOMContentLoaded", S), a.addEventListener("load", S));var T = function T(a, b, c, d, e, f, g) {
    var h = 0,
        i = a.length,
        j = null == c;if ("object" === r.type(c)) {
      e = !0;for (h in c) {
        T(a, b, h, c[h], !0, f, g);
      }
    } else if (void 0 !== d && (e = !0, r.isFunction(d) || (g = !0), j && (g ? (b.call(a, d), b = null) : (j = b, b = function b(a, _b, c) {
      return j.call(r(a), c);
    })), b)) for (; h < i; h++) {
      b(a[h], c, g ? d : d.call(a[h], h, b(a[h], c)));
    }return e ? a : j ? b.call(a) : i ? b(a[0], c) : f;
  },
      U = function U(a) {
    return 1 === a.nodeType || 9 === a.nodeType || !+a.nodeType;
  };function V() {
    this.expando = r.expando + V.uid++;
  }V.uid = 1, V.prototype = { cache: function cache(a) {
      var b = a[this.expando];return b || (b = {}, U(a) && (a.nodeType ? a[this.expando] = b : Object.defineProperty(a, this.expando, { value: b, configurable: !0 }))), b;
    }, set: function set(a, b, c) {
      var d,
          e = this.cache(a);if ("string" == typeof b) e[r.camelCase(b)] = c;else for (d in b) {
        e[r.camelCase(d)] = b[d];
      }return e;
    }, get: function get(a, b) {
      return void 0 === b ? this.cache(a) : a[this.expando] && a[this.expando][r.camelCase(b)];
    }, access: function access(a, b, c) {
      return void 0 === b || b && "string" == typeof b && void 0 === c ? this.get(a, b) : (this.set(a, b, c), void 0 !== c ? c : b);
    }, remove: function remove(a, b) {
      var c,
          d = a[this.expando];if (void 0 !== d) {
        if (void 0 !== b) {
          Array.isArray(b) ? b = b.map(r.camelCase) : (b = r.camelCase(b), b = b in d ? [b] : b.match(L) || []), c = b.length;while (c--) {
            delete d[b[c]];
          }
        }(void 0 === b || r.isEmptyObject(d)) && (a.nodeType ? a[this.expando] = void 0 : delete a[this.expando]);
      }
    }, hasData: function hasData(a) {
      var b = a[this.expando];return void 0 !== b && !r.isEmptyObject(b);
    } };var W = new V(),
      X = new V(),
      Y = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
      Z = /[A-Z]/g;function $(a) {
    return "true" === a || "false" !== a && ("null" === a ? null : a === +a + "" ? +a : Y.test(a) ? JSON.parse(a) : a);
  }function _(a, b, c) {
    var d;if (void 0 === c && 1 === a.nodeType) if (d = "data-" + b.replace(Z, "-$&").toLowerCase(), c = a.getAttribute(d), "string" == typeof c) {
      try {
        c = $(c);
      } catch (e) {}X.set(a, b, c);
    } else c = void 0;return c;
  }r.extend({ hasData: function hasData(a) {
      return X.hasData(a) || W.hasData(a);
    }, data: function data(a, b, c) {
      return X.access(a, b, c);
    }, removeData: function removeData(a, b) {
      X.remove(a, b);
    }, _data: function _data(a, b, c) {
      return W.access(a, b, c);
    }, _removeData: function _removeData(a, b) {
      W.remove(a, b);
    } }), r.fn.extend({ data: function data(a, b) {
      var c,
          d,
          e,
          f = this[0],
          g = f && f.attributes;if (void 0 === a) {
        if (this.length && (e = X.get(f), 1 === f.nodeType && !W.get(f, "hasDataAttrs"))) {
          c = g.length;while (c--) {
            g[c] && (d = g[c].name, 0 === d.indexOf("data-") && (d = r.camelCase(d.slice(5)), _(f, d, e[d])));
          }W.set(f, "hasDataAttrs", !0);
        }return e;
      }return "object" == (typeof a === "undefined" ? "undefined" : _typeof(a)) ? this.each(function () {
        X.set(this, a);
      }) : T(this, function (b) {
        var c;if (f && void 0 === b) {
          if (c = X.get(f, a), void 0 !== c) return c;if (c = _(f, a), void 0 !== c) return c;
        } else this.each(function () {
          X.set(this, a, b);
        });
      }, null, b, arguments.length > 1, null, !0);
    }, removeData: function removeData(a) {
      return this.each(function () {
        X.remove(this, a);
      });
    } }), r.extend({ queue: function queue(a, b, c) {
      var d;if (a) return b = (b || "fx") + "queue", d = W.get(a, b), c && (!d || Array.isArray(c) ? d = W.access(a, b, r.makeArray(c)) : d.push(c)), d || [];
    }, dequeue: function dequeue(a, b) {
      b = b || "fx";var c = r.queue(a, b),
          d = c.length,
          e = c.shift(),
          f = r._queueHooks(a, b),
          g = function g() {
        r.dequeue(a, b);
      };"inprogress" === e && (e = c.shift(), d--), e && ("fx" === b && c.unshift("inprogress"), delete f.stop, e.call(a, g, f)), !d && f && f.empty.fire();
    }, _queueHooks: function _queueHooks(a, b) {
      var c = b + "queueHooks";return W.get(a, c) || W.access(a, c, { empty: r.Callbacks("once memory").add(function () {
          W.remove(a, [b + "queue", c]);
        }) });
    } }), r.fn.extend({ queue: function queue(a, b) {
      var c = 2;return "string" != typeof a && (b = a, a = "fx", c--), arguments.length < c ? r.queue(this[0], a) : void 0 === b ? this : this.each(function () {
        var c = r.queue(this, a, b);r._queueHooks(this, a), "fx" === a && "inprogress" !== c[0] && r.dequeue(this, a);
      });
    }, dequeue: function dequeue(a) {
      return this.each(function () {
        r.dequeue(this, a);
      });
    }, clearQueue: function clearQueue(a) {
      return this.queue(a || "fx", []);
    }, promise: function promise(a, b) {
      var c,
          d = 1,
          e = r.Deferred(),
          f = this,
          g = this.length,
          h = function h() {
        --d || e.resolveWith(f, [f]);
      };"string" != typeof a && (b = a, a = void 0), a = a || "fx";while (g--) {
        c = W.get(f[g], a + "queueHooks"), c && c.empty && (d++, c.empty.add(h));
      }return h(), e.promise(b);
    } });var aa = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
      ba = new RegExp("^(?:([+-])=|)(" + aa + ")([a-z%]*)$", "i"),
      ca = ["Top", "Right", "Bottom", "Left"],
      da = function da(a, b) {
    return a = b || a, "none" === a.style.display || "" === a.style.display && r.contains(a.ownerDocument, a) && "none" === r.css(a, "display");
  },
      ea = function ea(a, b, c, d) {
    var e,
        f,
        g = {};for (f in b) {
      g[f] = a.style[f], a.style[f] = b[f];
    }e = c.apply(a, d || []);for (f in b) {
      a.style[f] = g[f];
    }return e;
  };function fa(a, b, c, d) {
    var e,
        f = 1,
        g = 20,
        h = d ? function () {
      return d.cur();
    } : function () {
      return r.css(a, b, "");
    },
        i = h(),
        j = c && c[3] || (r.cssNumber[b] ? "" : "px"),
        k = (r.cssNumber[b] || "px" !== j && +i) && ba.exec(r.css(a, b));if (k && k[3] !== j) {
      j = j || k[3], c = c || [], k = +i || 1;do {
        f = f || ".5", k /= f, r.style(a, b, k + j);
      } while (f !== (f = h() / i) && 1 !== f && --g);
    }return c && (k = +k || +i || 0, e = c[1] ? k + (c[1] + 1) * c[2] : +c[2], d && (d.unit = j, d.start = k, d.end = e)), e;
  }var ga = {};function ha(a) {
    var b,
        c = a.ownerDocument,
        d = a.nodeName,
        e = ga[d];return e ? e : (b = c.body.appendChild(c.createElement(d)), e = r.css(b, "display"), b.parentNode.removeChild(b), "none" === e && (e = "block"), ga[d] = e, e);
  }function ia(a, b) {
    for (var c, d, e = [], f = 0, g = a.length; f < g; f++) {
      d = a[f], d.style && (c = d.style.display, b ? ("none" === c && (e[f] = W.get(d, "display") || null, e[f] || (d.style.display = "")), "" === d.style.display && da(d) && (e[f] = ha(d))) : "none" !== c && (e[f] = "none", W.set(d, "display", c)));
    }for (f = 0; f < g; f++) {
      null != e[f] && (a[f].style.display = e[f]);
    }return a;
  }r.fn.extend({ show: function show() {
      return ia(this, !0);
    }, hide: function hide() {
      return ia(this);
    }, toggle: function toggle(a) {
      return "boolean" == typeof a ? a ? this.show() : this.hide() : this.each(function () {
        da(this) ? r(this).show() : r(this).hide();
      });
    } });var ja = /^(?:checkbox|radio)$/i,
      ka = /<([a-z][^\/\0>\x20\t\r\n\f]+)/i,
      la = /^$|\/(?:java|ecma)script/i,
      ma = { option: [1, "<select multiple='multiple'>", "</select>"], thead: [1, "<table>", "</table>"], col: [2, "<table><colgroup>", "</colgroup></table>"], tr: [2, "<table><tbody>", "</tbody></table>"], td: [3, "<table><tbody><tr>", "</tr></tbody></table>"], _default: [0, "", ""] };ma.optgroup = ma.option, ma.tbody = ma.tfoot = ma.colgroup = ma.caption = ma.thead, ma.th = ma.td;function na(a, b) {
    var c;return c = "undefined" != typeof a.getElementsByTagName ? a.getElementsByTagName(b || "*") : "undefined" != typeof a.querySelectorAll ? a.querySelectorAll(b || "*") : [], void 0 === b || b && B(a, b) ? r.merge([a], c) : c;
  }function oa(a, b) {
    for (var c = 0, d = a.length; c < d; c++) {
      W.set(a[c], "globalEval", !b || W.get(b[c], "globalEval"));
    }
  }var pa = /<|&#?\w+;/;function qa(a, b, c, d, e) {
    for (var f, g, h, i, j, k, l = b.createDocumentFragment(), m = [], n = 0, o = a.length; n < o; n++) {
      if (f = a[n], f || 0 === f) if ("object" === r.type(f)) r.merge(m, f.nodeType ? [f] : f);else if (pa.test(f)) {
        g = g || l.appendChild(b.createElement("div")), h = (ka.exec(f) || ["", ""])[1].toLowerCase(), i = ma[h] || ma._default, g.innerHTML = i[1] + r.htmlPrefilter(f) + i[2], k = i[0];while (k--) {
          g = g.lastChild;
        }r.merge(m, g.childNodes), g = l.firstChild, g.textContent = "";
      } else m.push(b.createTextNode(f));
    }l.textContent = "", n = 0;while (f = m[n++]) {
      if (d && r.inArray(f, d) > -1) e && e.push(f);else if (j = r.contains(f.ownerDocument, f), g = na(l.appendChild(f), "script"), j && oa(g), c) {
        k = 0;while (f = g[k++]) {
          la.test(f.type || "") && c.push(f);
        }
      }
    }return l;
  }!function () {
    var a = d.createDocumentFragment(),
        b = a.appendChild(d.createElement("div")),
        c = d.createElement("input");c.setAttribute("type", "radio"), c.setAttribute("checked", "checked"), c.setAttribute("name", "t"), b.appendChild(c), o.checkClone = b.cloneNode(!0).cloneNode(!0).lastChild.checked, b.innerHTML = "<textarea>x</textarea>", o.noCloneChecked = !!b.cloneNode(!0).lastChild.defaultValue;
  }();var ra = d.documentElement,
      sa = /^key/,
      ta = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
      ua = /^([^.]*)(?:\.(.+)|)/;function va() {
    return !0;
  }function wa() {
    return !1;
  }function xa() {
    try {
      return d.activeElement;
    } catch (a) {}
  }function ya(a, b, c, d, e, f) {
    var g, h;if ("object" == (typeof b === "undefined" ? "undefined" : _typeof(b))) {
      "string" != typeof c && (d = d || c, c = void 0);for (h in b) {
        ya(a, h, c, d, b[h], f);
      }return a;
    }if (null == d && null == e ? (e = c, d = c = void 0) : null == e && ("string" == typeof c ? (e = d, d = void 0) : (e = d, d = c, c = void 0)), e === !1) e = wa;else if (!e) return a;return 1 === f && (g = e, e = function e(a) {
      return r().off(a), g.apply(this, arguments);
    }, e.guid = g.guid || (g.guid = r.guid++)), a.each(function () {
      r.event.add(this, b, e, d, c);
    });
  }r.event = { global: {}, add: function add(a, b, c, d, e) {
      var f,
          g,
          h,
          i,
          j,
          k,
          l,
          m,
          n,
          o,
          p,
          q = W.get(a);if (q) {
        c.handler && (f = c, c = f.handler, e = f.selector), e && r.find.matchesSelector(ra, e), c.guid || (c.guid = r.guid++), (i = q.events) || (i = q.events = {}), (g = q.handle) || (g = q.handle = function (b) {
          return "undefined" != typeof r && r.event.triggered !== b.type ? r.event.dispatch.apply(a, arguments) : void 0;
        }), b = (b || "").match(L) || [""], j = b.length;while (j--) {
          h = ua.exec(b[j]) || [], n = p = h[1], o = (h[2] || "").split(".").sort(), n && (l = r.event.special[n] || {}, n = (e ? l.delegateType : l.bindType) || n, l = r.event.special[n] || {}, k = r.extend({ type: n, origType: p, data: d, handler: c, guid: c.guid, selector: e, needsContext: e && r.expr.match.needsContext.test(e), namespace: o.join(".") }, f), (m = i[n]) || (m = i[n] = [], m.delegateCount = 0, l.setup && l.setup.call(a, d, o, g) !== !1 || a.addEventListener && a.addEventListener(n, g)), l.add && (l.add.call(a, k), k.handler.guid || (k.handler.guid = c.guid)), e ? m.splice(m.delegateCount++, 0, k) : m.push(k), r.event.global[n] = !0);
        }
      }
    }, remove: function remove(a, b, c, d, e) {
      var f,
          g,
          h,
          i,
          j,
          k,
          l,
          m,
          n,
          o,
          p,
          q = W.hasData(a) && W.get(a);if (q && (i = q.events)) {
        b = (b || "").match(L) || [""], j = b.length;while (j--) {
          if (h = ua.exec(b[j]) || [], n = p = h[1], o = (h[2] || "").split(".").sort(), n) {
            l = r.event.special[n] || {}, n = (d ? l.delegateType : l.bindType) || n, m = i[n] || [], h = h[2] && new RegExp("(^|\\.)" + o.join("\\.(?:.*\\.|)") + "(\\.|$)"), g = f = m.length;while (f--) {
              k = m[f], !e && p !== k.origType || c && c.guid !== k.guid || h && !h.test(k.namespace) || d && d !== k.selector && ("**" !== d || !k.selector) || (m.splice(f, 1), k.selector && m.delegateCount--, l.remove && l.remove.call(a, k));
            }g && !m.length && (l.teardown && l.teardown.call(a, o, q.handle) !== !1 || r.removeEvent(a, n, q.handle), delete i[n]);
          } else for (n in i) {
            r.event.remove(a, n + b[j], c, d, !0);
          }
        }r.isEmptyObject(i) && W.remove(a, "handle events");
      }
    }, dispatch: function dispatch(a) {
      var b = r.event.fix(a),
          c,
          d,
          e,
          f,
          g,
          h,
          i = new Array(arguments.length),
          j = (W.get(this, "events") || {})[b.type] || [],
          k = r.event.special[b.type] || {};for (i[0] = b, c = 1; c < arguments.length; c++) {
        i[c] = arguments[c];
      }if (b.delegateTarget = this, !k.preDispatch || k.preDispatch.call(this, b) !== !1) {
        h = r.event.handlers.call(this, b, j), c = 0;while ((f = h[c++]) && !b.isPropagationStopped()) {
          b.currentTarget = f.elem, d = 0;while ((g = f.handlers[d++]) && !b.isImmediatePropagationStopped()) {
            b.rnamespace && !b.rnamespace.test(g.namespace) || (b.handleObj = g, b.data = g.data, e = ((r.event.special[g.origType] || {}).handle || g.handler).apply(f.elem, i), void 0 !== e && (b.result = e) === !1 && (b.preventDefault(), b.stopPropagation()));
          }
        }return k.postDispatch && k.postDispatch.call(this, b), b.result;
      }
    }, handlers: function handlers(a, b) {
      var c,
          d,
          e,
          f,
          g,
          h = [],
          i = b.delegateCount,
          j = a.target;if (i && j.nodeType && !("click" === a.type && a.button >= 1)) for (; j !== this; j = j.parentNode || this) {
        if (1 === j.nodeType && ("click" !== a.type || j.disabled !== !0)) {
          for (f = [], g = {}, c = 0; c < i; c++) {
            d = b[c], e = d.selector + " ", void 0 === g[e] && (g[e] = d.needsContext ? r(e, this).index(j) > -1 : r.find(e, this, null, [j]).length), g[e] && f.push(d);
          }f.length && h.push({ elem: j, handlers: f });
        }
      }return j = this, i < b.length && h.push({ elem: j, handlers: b.slice(i) }), h;
    }, addProp: function addProp(a, b) {
      Object.defineProperty(r.Event.prototype, a, { enumerable: !0, configurable: !0, get: r.isFunction(b) ? function () {
          if (this.originalEvent) return b(this.originalEvent);
        } : function () {
          if (this.originalEvent) return this.originalEvent[a];
        }, set: function set(b) {
          Object.defineProperty(this, a, { enumerable: !0, configurable: !0, writable: !0, value: b });
        } });
    }, fix: function fix(a) {
      return a[r.expando] ? a : new r.Event(a);
    }, special: { load: { noBubble: !0 }, focus: { trigger: function trigger() {
          if (this !== xa() && this.focus) return this.focus(), !1;
        }, delegateType: "focusin" }, blur: { trigger: function trigger() {
          if (this === xa() && this.blur) return this.blur(), !1;
        }, delegateType: "focusout" }, click: { trigger: function trigger() {
          if ("checkbox" === this.type && this.click && B(this, "input")) return this.click(), !1;
        }, _default: function _default(a) {
          return B(a.target, "a");
        } }, beforeunload: { postDispatch: function postDispatch(a) {
          void 0 !== a.result && a.originalEvent && (a.originalEvent.returnValue = a.result);
        } } } }, r.removeEvent = function (a, b, c) {
    a.removeEventListener && a.removeEventListener(b, c);
  }, r.Event = function (a, b) {
    return this instanceof r.Event ? (a && a.type ? (this.originalEvent = a, this.type = a.type, this.isDefaultPrevented = a.defaultPrevented || void 0 === a.defaultPrevented && a.returnValue === !1 ? va : wa, this.target = a.target && 3 === a.target.nodeType ? a.target.parentNode : a.target, this.currentTarget = a.currentTarget, this.relatedTarget = a.relatedTarget) : this.type = a, b && r.extend(this, b), this.timeStamp = a && a.timeStamp || r.now(), void (this[r.expando] = !0)) : new r.Event(a, b);
  }, r.Event.prototype = { constructor: r.Event, isDefaultPrevented: wa, isPropagationStopped: wa, isImmediatePropagationStopped: wa, isSimulated: !1, preventDefault: function preventDefault() {
      var a = this.originalEvent;this.isDefaultPrevented = va, a && !this.isSimulated && a.preventDefault();
    }, stopPropagation: function stopPropagation() {
      var a = this.originalEvent;this.isPropagationStopped = va, a && !this.isSimulated && a.stopPropagation();
    }, stopImmediatePropagation: function stopImmediatePropagation() {
      var a = this.originalEvent;this.isImmediatePropagationStopped = va, a && !this.isSimulated && a.stopImmediatePropagation(), this.stopPropagation();
    } }, r.each({ altKey: !0, bubbles: !0, cancelable: !0, changedTouches: !0, ctrlKey: !0, detail: !0, eventPhase: !0, metaKey: !0, pageX: !0, pageY: !0, shiftKey: !0, view: !0, "char": !0, charCode: !0, key: !0, keyCode: !0, button: !0, buttons: !0, clientX: !0, clientY: !0, offsetX: !0, offsetY: !0, pointerId: !0, pointerType: !0, screenX: !0, screenY: !0, targetTouches: !0, toElement: !0, touches: !0, which: function which(a) {
      var b = a.button;return null == a.which && sa.test(a.type) ? null != a.charCode ? a.charCode : a.keyCode : !a.which && void 0 !== b && ta.test(a.type) ? 1 & b ? 1 : 2 & b ? 3 : 4 & b ? 2 : 0 : a.which;
    } }, r.event.addProp), r.each({ mouseenter: "mouseover", mouseleave: "mouseout", pointerenter: "pointerover", pointerleave: "pointerout" }, function (a, b) {
    r.event.special[a] = { delegateType: b, bindType: b, handle: function handle(a) {
        var c,
            d = this,
            e = a.relatedTarget,
            f = a.handleObj;return e && (e === d || r.contains(d, e)) || (a.type = f.origType, c = f.handler.apply(this, arguments), a.type = b), c;
      } };
  }), r.fn.extend({ on: function on(a, b, c, d) {
      return ya(this, a, b, c, d);
    }, one: function one(a, b, c, d) {
      return ya(this, a, b, c, d, 1);
    }, off: function off(a, b, c) {
      var d, e;if (a && a.preventDefault && a.handleObj) return d = a.handleObj, r(a.delegateTarget).off(d.namespace ? d.origType + "." + d.namespace : d.origType, d.selector, d.handler), this;if ("object" == (typeof a === "undefined" ? "undefined" : _typeof(a))) {
        for (e in a) {
          this.off(e, b, a[e]);
        }return this;
      }return b !== !1 && "function" != typeof b || (c = b, b = void 0), c === !1 && (c = wa), this.each(function () {
        r.event.remove(this, a, c, b);
      });
    } });var za = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,
      Aa = /<script|<style|<link/i,
      Ba = /checked\s*(?:[^=]|=\s*.checked.)/i,
      Ca = /^true\/(.*)/,
      Da = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;function Ea(a, b) {
    return B(a, "table") && B(11 !== b.nodeType ? b : b.firstChild, "tr") ? r(">tbody", a)[0] || a : a;
  }function Fa(a) {
    return a.type = (null !== a.getAttribute("type")) + "/" + a.type, a;
  }function Ga(a) {
    var b = Ca.exec(a.type);return b ? a.type = b[1] : a.removeAttribute("type"), a;
  }function Ha(a, b) {
    var c, d, e, f, g, h, i, j;if (1 === b.nodeType) {
      if (W.hasData(a) && (f = W.access(a), g = W.set(b, f), j = f.events)) {
        delete g.handle, g.events = {};for (e in j) {
          for (c = 0, d = j[e].length; c < d; c++) {
            r.event.add(b, e, j[e][c]);
          }
        }
      }X.hasData(a) && (h = X.access(a), i = r.extend({}, h), X.set(b, i));
    }
  }function Ia(a, b) {
    var c = b.nodeName.toLowerCase();"input" === c && ja.test(a.type) ? b.checked = a.checked : "input" !== c && "textarea" !== c || (b.defaultValue = a.defaultValue);
  }function Ja(a, b, c, d) {
    b = g.apply([], b);var e,
        f,
        h,
        i,
        j,
        k,
        l = 0,
        m = a.length,
        n = m - 1,
        q = b[0],
        s = r.isFunction(q);if (s || m > 1 && "string" == typeof q && !o.checkClone && Ba.test(q)) return a.each(function (e) {
      var f = a.eq(e);s && (b[0] = q.call(this, e, f.html())), Ja(f, b, c, d);
    });if (m && (e = qa(b, a[0].ownerDocument, !1, a, d), f = e.firstChild, 1 === e.childNodes.length && (e = f), f || d)) {
      for (h = r.map(na(e, "script"), Fa), i = h.length; l < m; l++) {
        j = e, l !== n && (j = r.clone(j, !0, !0), i && r.merge(h, na(j, "script"))), c.call(a[l], j, l);
      }if (i) for (k = h[h.length - 1].ownerDocument, r.map(h, Ga), l = 0; l < i; l++) {
        j = h[l], la.test(j.type || "") && !W.access(j, "globalEval") && r.contains(k, j) && (j.src ? r._evalUrl && r._evalUrl(j.src) : p(j.textContent.replace(Da, ""), k));
      }
    }return a;
  }function Ka(a, b, c) {
    for (var d, e = b ? r.filter(b, a) : a, f = 0; null != (d = e[f]); f++) {
      c || 1 !== d.nodeType || r.cleanData(na(d)), d.parentNode && (c && r.contains(d.ownerDocument, d) && oa(na(d, "script")), d.parentNode.removeChild(d));
    }return a;
  }r.extend({ htmlPrefilter: function htmlPrefilter(a) {
      return a.replace(za, "<$1></$2>");
    }, clone: function clone(a, b, c) {
      var d,
          e,
          f,
          g,
          h = a.cloneNode(!0),
          i = r.contains(a.ownerDocument, a);if (!(o.noCloneChecked || 1 !== a.nodeType && 11 !== a.nodeType || r.isXMLDoc(a))) for (g = na(h), f = na(a), d = 0, e = f.length; d < e; d++) {
        Ia(f[d], g[d]);
      }if (b) if (c) for (f = f || na(a), g = g || na(h), d = 0, e = f.length; d < e; d++) {
        Ha(f[d], g[d]);
      } else Ha(a, h);return g = na(h, "script"), g.length > 0 && oa(g, !i && na(a, "script")), h;
    }, cleanData: function cleanData(a) {
      for (var b, c, d, e = r.event.special, f = 0; void 0 !== (c = a[f]); f++) {
        if (U(c)) {
          if (b = c[W.expando]) {
            if (b.events) for (d in b.events) {
              e[d] ? r.event.remove(c, d) : r.removeEvent(c, d, b.handle);
            }c[W.expando] = void 0;
          }c[X.expando] && (c[X.expando] = void 0);
        }
      }
    } }), r.fn.extend({ detach: function detach(a) {
      return Ka(this, a, !0);
    }, remove: function remove(a) {
      return Ka(this, a);
    }, text: function text(a) {
      return T(this, function (a) {
        return void 0 === a ? r.text(this) : this.empty().each(function () {
          1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (this.textContent = a);
        });
      }, null, a, arguments.length);
    }, append: function append() {
      return Ja(this, arguments, function (a) {
        if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
          var b = Ea(this, a);b.appendChild(a);
        }
      });
    }, prepend: function prepend() {
      return Ja(this, arguments, function (a) {
        if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
          var b = Ea(this, a);b.insertBefore(a, b.firstChild);
        }
      });
    }, before: function before() {
      return Ja(this, arguments, function (a) {
        this.parentNode && this.parentNode.insertBefore(a, this);
      });
    }, after: function after() {
      return Ja(this, arguments, function (a) {
        this.parentNode && this.parentNode.insertBefore(a, this.nextSibling);
      });
    }, empty: function empty() {
      for (var a, b = 0; null != (a = this[b]); b++) {
        1 === a.nodeType && (r.cleanData(na(a, !1)), a.textContent = "");
      }return this;
    }, clone: function clone(a, b) {
      return a = null != a && a, b = null == b ? a : b, this.map(function () {
        return r.clone(this, a, b);
      });
    }, html: function html(a) {
      return T(this, function (a) {
        var b = this[0] || {},
            c = 0,
            d = this.length;if (void 0 === a && 1 === b.nodeType) return b.innerHTML;if ("string" == typeof a && !Aa.test(a) && !ma[(ka.exec(a) || ["", ""])[1].toLowerCase()]) {
          a = r.htmlPrefilter(a);try {
            for (; c < d; c++) {
              b = this[c] || {}, 1 === b.nodeType && (r.cleanData(na(b, !1)), b.innerHTML = a);
            }b = 0;
          } catch (e) {}
        }b && this.empty().append(a);
      }, null, a, arguments.length);
    }, replaceWith: function replaceWith() {
      var a = [];return Ja(this, arguments, function (b) {
        var c = this.parentNode;r.inArray(this, a) < 0 && (r.cleanData(na(this)), c && c.replaceChild(b, this));
      }, a);
    } }), r.each({ appendTo: "append", prependTo: "prepend", insertBefore: "before", insertAfter: "after", replaceAll: "replaceWith" }, function (a, b) {
    r.fn[a] = function (a) {
      for (var c, d = [], e = r(a), f = e.length - 1, g = 0; g <= f; g++) {
        c = g === f ? this : this.clone(!0), r(e[g])[b](c), h.apply(d, c.get());
      }return this.pushStack(d);
    };
  });var La = /^margin/,
      Ma = new RegExp("^(" + aa + ")(?!px)[a-z%]+$", "i"),
      Na = function Na(b) {
    var c = b.ownerDocument.defaultView;return c && c.opener || (c = a), c.getComputedStyle(b);
  };!function () {
    function b() {
      if (i) {
        i.style.cssText = "box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%", i.innerHTML = "", ra.appendChild(h);var b = a.getComputedStyle(i);c = "1%" !== b.top, g = "2px" === b.marginLeft, e = "4px" === b.width, i.style.marginRight = "50%", f = "4px" === b.marginRight, ra.removeChild(h), i = null;
      }
    }var c,
        e,
        f,
        g,
        h = d.createElement("div"),
        i = d.createElement("div");i.style && (i.style.backgroundClip = "content-box", i.cloneNode(!0).style.backgroundClip = "", o.clearCloneStyle = "content-box" === i.style.backgroundClip, h.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute", h.appendChild(i), r.extend(o, { pixelPosition: function pixelPosition() {
        return b(), c;
      }, boxSizingReliable: function boxSizingReliable() {
        return b(), e;
      }, pixelMarginRight: function pixelMarginRight() {
        return b(), f;
      }, reliableMarginLeft: function reliableMarginLeft() {
        return b(), g;
      } }));
  }();function Oa(a, b, c) {
    var d,
        e,
        f,
        g,
        h = a.style;return c = c || Na(a), c && (g = c.getPropertyValue(b) || c[b], "" !== g || r.contains(a.ownerDocument, a) || (g = r.style(a, b)), !o.pixelMarginRight() && Ma.test(g) && La.test(b) && (d = h.width, e = h.minWidth, f = h.maxWidth, h.minWidth = h.maxWidth = h.width = g, g = c.width, h.width = d, h.minWidth = e, h.maxWidth = f)), void 0 !== g ? g + "" : g;
  }function Pa(a, b) {
    return { get: function get() {
        return a() ? void delete this.get : (this.get = b).apply(this, arguments);
      } };
  }var Qa = /^(none|table(?!-c[ea]).+)/,
      Ra = /^--/,
      Sa = { position: "absolute", visibility: "hidden", display: "block" },
      Ta = { letterSpacing: "0", fontWeight: "400" },
      Ua = ["Webkit", "Moz", "ms"],
      Va = d.createElement("div").style;function Wa(a) {
    if (a in Va) return a;var b = a[0].toUpperCase() + a.slice(1),
        c = Ua.length;while (c--) {
      if (a = Ua[c] + b, a in Va) return a;
    }
  }function Xa(a) {
    var b = r.cssProps[a];return b || (b = r.cssProps[a] = Wa(a) || a), b;
  }function Ya(a, b, c) {
    var d = ba.exec(b);return d ? Math.max(0, d[2] - (c || 0)) + (d[3] || "px") : b;
  }function Za(a, b, c, d, e) {
    var f,
        g = 0;for (f = c === (d ? "border" : "content") ? 4 : "width" === b ? 1 : 0; f < 4; f += 2) {
      "margin" === c && (g += r.css(a, c + ca[f], !0, e)), d ? ("content" === c && (g -= r.css(a, "padding" + ca[f], !0, e)), "margin" !== c && (g -= r.css(a, "border" + ca[f] + "Width", !0, e))) : (g += r.css(a, "padding" + ca[f], !0, e), "padding" !== c && (g += r.css(a, "border" + ca[f] + "Width", !0, e)));
    }return g;
  }function $a(a, b, c) {
    var d,
        e = Na(a),
        f = Oa(a, b, e),
        g = "border-box" === r.css(a, "boxSizing", !1, e);return Ma.test(f) ? f : (d = g && (o.boxSizingReliable() || f === a.style[b]), "auto" === f && (f = a["offset" + b[0].toUpperCase() + b.slice(1)]), f = parseFloat(f) || 0, f + Za(a, b, c || (g ? "border" : "content"), d, e) + "px");
  }r.extend({ cssHooks: { opacity: { get: function get(a, b) {
          if (b) {
            var c = Oa(a, "opacity");return "" === c ? "1" : c;
          }
        } } }, cssNumber: { animationIterationCount: !0, columnCount: !0, fillOpacity: !0, flexGrow: !0, flexShrink: !0, fontWeight: !0, lineHeight: !0, opacity: !0, order: !0, orphans: !0, widows: !0, zIndex: !0, zoom: !0 }, cssProps: { "float": "cssFloat" }, style: function style(a, b, c, d) {
      if (a && 3 !== a.nodeType && 8 !== a.nodeType && a.style) {
        var e,
            f,
            g,
            h = r.camelCase(b),
            i = Ra.test(b),
            j = a.style;return i || (b = Xa(h)), g = r.cssHooks[b] || r.cssHooks[h], void 0 === c ? g && "get" in g && void 0 !== (e = g.get(a, !1, d)) ? e : j[b] : (f = typeof c === "undefined" ? "undefined" : _typeof(c), "string" === f && (e = ba.exec(c)) && e[1] && (c = fa(a, b, e), f = "number"), null != c && c === c && ("number" === f && (c += e && e[3] || (r.cssNumber[h] ? "" : "px")), o.clearCloneStyle || "" !== c || 0 !== b.indexOf("background") || (j[b] = "inherit"), g && "set" in g && void 0 === (c = g.set(a, c, d)) || (i ? j.setProperty(b, c) : j[b] = c)), void 0);
      }
    }, css: function css(a, b, c, d) {
      var e,
          f,
          g,
          h = r.camelCase(b),
          i = Ra.test(b);return i || (b = Xa(h)), g = r.cssHooks[b] || r.cssHooks[h], g && "get" in g && (e = g.get(a, !0, c)), void 0 === e && (e = Oa(a, b, d)), "normal" === e && b in Ta && (e = Ta[b]), "" === c || c ? (f = parseFloat(e), c === !0 || isFinite(f) ? f || 0 : e) : e;
    } }), r.each(["height", "width"], function (a, b) {
    r.cssHooks[b] = { get: function get(a, c, d) {
        if (c) return !Qa.test(r.css(a, "display")) || a.getClientRects().length && a.getBoundingClientRect().width ? $a(a, b, d) : ea(a, Sa, function () {
          return $a(a, b, d);
        });
      }, set: function set(a, c, d) {
        var e,
            f = d && Na(a),
            g = d && Za(a, b, d, "border-box" === r.css(a, "boxSizing", !1, f), f);return g && (e = ba.exec(c)) && "px" !== (e[3] || "px") && (a.style[b] = c, c = r.css(a, b)), Ya(a, c, g);
      } };
  }), r.cssHooks.marginLeft = Pa(o.reliableMarginLeft, function (a, b) {
    if (b) return (parseFloat(Oa(a, "marginLeft")) || a.getBoundingClientRect().left - ea(a, { marginLeft: 0 }, function () {
      return a.getBoundingClientRect().left;
    })) + "px";
  }), r.each({ margin: "", padding: "", border: "Width" }, function (a, b) {
    r.cssHooks[a + b] = { expand: function expand(c) {
        for (var d = 0, e = {}, f = "string" == typeof c ? c.split(" ") : [c]; d < 4; d++) {
          e[a + ca[d] + b] = f[d] || f[d - 2] || f[0];
        }return e;
      } }, La.test(a) || (r.cssHooks[a + b].set = Ya);
  }), r.fn.extend({ css: function css(a, b) {
      return T(this, function (a, b, c) {
        var d,
            e,
            f = {},
            g = 0;if (Array.isArray(b)) {
          for (d = Na(a), e = b.length; g < e; g++) {
            f[b[g]] = r.css(a, b[g], !1, d);
          }return f;
        }return void 0 !== c ? r.style(a, b, c) : r.css(a, b);
      }, a, b, arguments.length > 1);
    } });function _a(a, b, c, d, e) {
    return new _a.prototype.init(a, b, c, d, e);
  }r.Tween = _a, _a.prototype = { constructor: _a, init: function init(a, b, c, d, e, f) {
      this.elem = a, this.prop = c, this.easing = e || r.easing._default, this.options = b, this.start = this.now = this.cur(), this.end = d, this.unit = f || (r.cssNumber[c] ? "" : "px");
    }, cur: function cur() {
      var a = _a.propHooks[this.prop];return a && a.get ? a.get(this) : _a.propHooks._default.get(this);
    }, run: function run(a) {
      var b,
          c = _a.propHooks[this.prop];return this.options.duration ? this.pos = b = r.easing[this.easing](a, this.options.duration * a, 0, 1, this.options.duration) : this.pos = b = a, this.now = (this.end - this.start) * b + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), c && c.set ? c.set(this) : _a.propHooks._default.set(this), this;
    } }, _a.prototype.init.prototype = _a.prototype, _a.propHooks = { _default: { get: function get(a) {
        var b;return 1 !== a.elem.nodeType || null != a.elem[a.prop] && null == a.elem.style[a.prop] ? a.elem[a.prop] : (b = r.css(a.elem, a.prop, ""), b && "auto" !== b ? b : 0);
      }, set: function set(a) {
        r.fx.step[a.prop] ? r.fx.step[a.prop](a) : 1 !== a.elem.nodeType || null == a.elem.style[r.cssProps[a.prop]] && !r.cssHooks[a.prop] ? a.elem[a.prop] = a.now : r.style(a.elem, a.prop, a.now + a.unit);
      } } }, _a.propHooks.scrollTop = _a.propHooks.scrollLeft = { set: function set(a) {
      a.elem.nodeType && a.elem.parentNode && (a.elem[a.prop] = a.now);
    } }, r.easing = { linear: function linear(a) {
      return a;
    }, swing: function swing(a) {
      return .5 - Math.cos(a * Math.PI) / 2;
    }, _default: "swing" }, r.fx = _a.prototype.init, r.fx.step = {};var ab,
      bb,
      cb = /^(?:toggle|show|hide)$/,
      db = /queueHooks$/;function eb() {
    bb && (d.hidden === !1 && a.requestAnimationFrame ? a.requestAnimationFrame(eb) : a.setTimeout(eb, r.fx.interval), r.fx.tick());
  }function fb() {
    return a.setTimeout(function () {
      ab = void 0;
    }), ab = r.now();
  }function gb(a, b) {
    var c,
        d = 0,
        e = { height: a };for (b = b ? 1 : 0; d < 4; d += 2 - b) {
      c = ca[d], e["margin" + c] = e["padding" + c] = a;
    }return b && (e.opacity = e.width = a), e;
  }function hb(a, b, c) {
    for (var d, e = (kb.tweeners[b] || []).concat(kb.tweeners["*"]), f = 0, g = e.length; f < g; f++) {
      if (d = e[f].call(c, b, a)) return d;
    }
  }function ib(a, b, c) {
    var d,
        e,
        f,
        g,
        h,
        i,
        j,
        k,
        l = "width" in b || "height" in b,
        m = this,
        n = {},
        o = a.style,
        p = a.nodeType && da(a),
        q = W.get(a, "fxshow");c.queue || (g = r._queueHooks(a, "fx"), null == g.unqueued && (g.unqueued = 0, h = g.empty.fire, g.empty.fire = function () {
      g.unqueued || h();
    }), g.unqueued++, m.always(function () {
      m.always(function () {
        g.unqueued--, r.queue(a, "fx").length || g.empty.fire();
      });
    }));for (d in b) {
      if (e = b[d], cb.test(e)) {
        if (delete b[d], f = f || "toggle" === e, e === (p ? "hide" : "show")) {
          if ("show" !== e || !q || void 0 === q[d]) continue;p = !0;
        }n[d] = q && q[d] || r.style(a, d);
      }
    }if (i = !r.isEmptyObject(b), i || !r.isEmptyObject(n)) {
      l && 1 === a.nodeType && (c.overflow = [o.overflow, o.overflowX, o.overflowY], j = q && q.display, null == j && (j = W.get(a, "display")), k = r.css(a, "display"), "none" === k && (j ? k = j : (ia([a], !0), j = a.style.display || j, k = r.css(a, "display"), ia([a]))), ("inline" === k || "inline-block" === k && null != j) && "none" === r.css(a, "float") && (i || (m.done(function () {
        o.display = j;
      }), null == j && (k = o.display, j = "none" === k ? "" : k)), o.display = "inline-block")), c.overflow && (o.overflow = "hidden", m.always(function () {
        o.overflow = c.overflow[0], o.overflowX = c.overflow[1], o.overflowY = c.overflow[2];
      })), i = !1;for (d in n) {
        i || (q ? "hidden" in q && (p = q.hidden) : q = W.access(a, "fxshow", { display: j }), f && (q.hidden = !p), p && ia([a], !0), m.done(function () {
          p || ia([a]), W.remove(a, "fxshow");for (d in n) {
            r.style(a, d, n[d]);
          }
        })), i = hb(p ? q[d] : 0, d, m), d in q || (q[d] = i.start, p && (i.end = i.start, i.start = 0));
      }
    }
  }function jb(a, b) {
    var c, d, e, f, g;for (c in a) {
      if (d = r.camelCase(c), e = b[d], f = a[c], Array.isArray(f) && (e = f[1], f = a[c] = f[0]), c !== d && (a[d] = f, delete a[c]), g = r.cssHooks[d], g && "expand" in g) {
        f = g.expand(f), delete a[d];for (c in f) {
          c in a || (a[c] = f[c], b[c] = e);
        }
      } else b[d] = e;
    }
  }function kb(a, b, c) {
    var d,
        e,
        f = 0,
        g = kb.prefilters.length,
        h = r.Deferred().always(function () {
      delete i.elem;
    }),
        i = function i() {
      if (e) return !1;for (var b = ab || fb(), c = Math.max(0, j.startTime + j.duration - b), d = c / j.duration || 0, f = 1 - d, g = 0, i = j.tweens.length; g < i; g++) {
        j.tweens[g].run(f);
      }return h.notifyWith(a, [j, f, c]), f < 1 && i ? c : (i || h.notifyWith(a, [j, 1, 0]), h.resolveWith(a, [j]), !1);
    },
        j = h.promise({ elem: a, props: r.extend({}, b), opts: r.extend(!0, { specialEasing: {}, easing: r.easing._default }, c), originalProperties: b, originalOptions: c, startTime: ab || fb(), duration: c.duration, tweens: [], createTween: function createTween(b, c) {
        var d = r.Tween(a, j.opts, b, c, j.opts.specialEasing[b] || j.opts.easing);return j.tweens.push(d), d;
      }, stop: function stop(b) {
        var c = 0,
            d = b ? j.tweens.length : 0;if (e) return this;for (e = !0; c < d; c++) {
          j.tweens[c].run(1);
        }return b ? (h.notifyWith(a, [j, 1, 0]), h.resolveWith(a, [j, b])) : h.rejectWith(a, [j, b]), this;
      } }),
        k = j.props;for (jb(k, j.opts.specialEasing); f < g; f++) {
      if (d = kb.prefilters[f].call(j, a, k, j.opts)) return r.isFunction(d.stop) && (r._queueHooks(j.elem, j.opts.queue).stop = r.proxy(d.stop, d)), d;
    }return r.map(k, hb, j), r.isFunction(j.opts.start) && j.opts.start.call(a, j), j.progress(j.opts.progress).done(j.opts.done, j.opts.complete).fail(j.opts.fail).always(j.opts.always), r.fx.timer(r.extend(i, { elem: a, anim: j, queue: j.opts.queue })), j;
  }r.Animation = r.extend(kb, { tweeners: { "*": [function (a, b) {
        var c = this.createTween(a, b);return fa(c.elem, a, ba.exec(b), c), c;
      }] }, tweener: function tweener(a, b) {
      r.isFunction(a) ? (b = a, a = ["*"]) : a = a.match(L);for (var c, d = 0, e = a.length; d < e; d++) {
        c = a[d], kb.tweeners[c] = kb.tweeners[c] || [], kb.tweeners[c].unshift(b);
      }
    }, prefilters: [ib], prefilter: function prefilter(a, b) {
      b ? kb.prefilters.unshift(a) : kb.prefilters.push(a);
    } }), r.speed = function (a, b, c) {
    var d = a && "object" == (typeof a === "undefined" ? "undefined" : _typeof(a)) ? r.extend({}, a) : { complete: c || !c && b || r.isFunction(a) && a, duration: a, easing: c && b || b && !r.isFunction(b) && b };return r.fx.off ? d.duration = 0 : "number" != typeof d.duration && (d.duration in r.fx.speeds ? d.duration = r.fx.speeds[d.duration] : d.duration = r.fx.speeds._default), null != d.queue && d.queue !== !0 || (d.queue = "fx"), d.old = d.complete, d.complete = function () {
      r.isFunction(d.old) && d.old.call(this), d.queue && r.dequeue(this, d.queue);
    }, d;
  }, r.fn.extend({ fadeTo: function fadeTo(a, b, c, d) {
      return this.filter(da).css("opacity", 0).show().end().animate({ opacity: b }, a, c, d);
    }, animate: function animate(a, b, c, d) {
      var e = r.isEmptyObject(a),
          f = r.speed(b, c, d),
          g = function g() {
        var b = kb(this, r.extend({}, a), f);(e || W.get(this, "finish")) && b.stop(!0);
      };return g.finish = g, e || f.queue === !1 ? this.each(g) : this.queue(f.queue, g);
    }, stop: function stop(a, b, c) {
      var d = function d(a) {
        var b = a.stop;delete a.stop, b(c);
      };return "string" != typeof a && (c = b, b = a, a = void 0), b && a !== !1 && this.queue(a || "fx", []), this.each(function () {
        var b = !0,
            e = null != a && a + "queueHooks",
            f = r.timers,
            g = W.get(this);if (e) g[e] && g[e].stop && d(g[e]);else for (e in g) {
          g[e] && g[e].stop && db.test(e) && d(g[e]);
        }for (e = f.length; e--;) {
          f[e].elem !== this || null != a && f[e].queue !== a || (f[e].anim.stop(c), b = !1, f.splice(e, 1));
        }!b && c || r.dequeue(this, a);
      });
    }, finish: function finish(a) {
      return a !== !1 && (a = a || "fx"), this.each(function () {
        var b,
            c = W.get(this),
            d = c[a + "queue"],
            e = c[a + "queueHooks"],
            f = r.timers,
            g = d ? d.length : 0;for (c.finish = !0, r.queue(this, a, []), e && e.stop && e.stop.call(this, !0), b = f.length; b--;) {
          f[b].elem === this && f[b].queue === a && (f[b].anim.stop(!0), f.splice(b, 1));
        }for (b = 0; b < g; b++) {
          d[b] && d[b].finish && d[b].finish.call(this);
        }delete c.finish;
      });
    } }), r.each(["toggle", "show", "hide"], function (a, b) {
    var c = r.fn[b];r.fn[b] = function (a, d, e) {
      return null == a || "boolean" == typeof a ? c.apply(this, arguments) : this.animate(gb(b, !0), a, d, e);
    };
  }), r.each({ slideDown: gb("show"), slideUp: gb("hide"), slideToggle: gb("toggle"), fadeIn: { opacity: "show" }, fadeOut: { opacity: "hide" }, fadeToggle: { opacity: "toggle" } }, function (a, b) {
    r.fn[a] = function (a, c, d) {
      return this.animate(b, a, c, d);
    };
  }), r.timers = [], r.fx.tick = function () {
    var a,
        b = 0,
        c = r.timers;for (ab = r.now(); b < c.length; b++) {
      a = c[b], a() || c[b] !== a || c.splice(b--, 1);
    }c.length || r.fx.stop(), ab = void 0;
  }, r.fx.timer = function (a) {
    r.timers.push(a), r.fx.start();
  }, r.fx.interval = 13, r.fx.start = function () {
    bb || (bb = !0, eb());
  }, r.fx.stop = function () {
    bb = null;
  }, r.fx.speeds = { slow: 600, fast: 200, _default: 400 }, r.fn.delay = function (b, c) {
    return b = r.fx ? r.fx.speeds[b] || b : b, c = c || "fx", this.queue(c, function (c, d) {
      var e = a.setTimeout(c, b);d.stop = function () {
        a.clearTimeout(e);
      };
    });
  }, function () {
    var a = d.createElement("input"),
        b = d.createElement("select"),
        c = b.appendChild(d.createElement("option"));a.type = "checkbox", o.checkOn = "" !== a.value, o.optSelected = c.selected, a = d.createElement("input"), a.value = "t", a.type = "radio", o.radioValue = "t" === a.value;
  }();var lb,
      mb = r.expr.attrHandle;r.fn.extend({ attr: function attr(a, b) {
      return T(this, r.attr, a, b, arguments.length > 1);
    }, removeAttr: function removeAttr(a) {
      return this.each(function () {
        r.removeAttr(this, a);
      });
    } }), r.extend({ attr: function attr(a, b, c) {
      var d,
          e,
          f = a.nodeType;if (3 !== f && 8 !== f && 2 !== f) return "undefined" == typeof a.getAttribute ? r.prop(a, b, c) : (1 === f && r.isXMLDoc(a) || (e = r.attrHooks[b.toLowerCase()] || (r.expr.match.bool.test(b) ? lb : void 0)), void 0 !== c ? null === c ? void r.removeAttr(a, b) : e && "set" in e && void 0 !== (d = e.set(a, c, b)) ? d : (a.setAttribute(b, c + ""), c) : e && "get" in e && null !== (d = e.get(a, b)) ? d : (d = r.find.attr(a, b), null == d ? void 0 : d));
    }, attrHooks: { type: { set: function set(a, b) {
          if (!o.radioValue && "radio" === b && B(a, "input")) {
            var c = a.value;return a.setAttribute("type", b), c && (a.value = c), b;
          }
        } } }, removeAttr: function removeAttr(a, b) {
      var c,
          d = 0,
          e = b && b.match(L);if (e && 1 === a.nodeType) while (c = e[d++]) {
        a.removeAttribute(c);
      }
    } }), lb = { set: function set(a, b, c) {
      return b === !1 ? r.removeAttr(a, c) : a.setAttribute(c, c), c;
    } }, r.each(r.expr.match.bool.source.match(/\w+/g), function (a, b) {
    var c = mb[b] || r.find.attr;mb[b] = function (a, b, d) {
      var e,
          f,
          g = b.toLowerCase();return d || (f = mb[g], mb[g] = e, e = null != c(a, b, d) ? g : null, mb[g] = f), e;
    };
  });var nb = /^(?:input|select|textarea|button)$/i,
      ob = /^(?:a|area)$/i;r.fn.extend({ prop: function prop(a, b) {
      return T(this, r.prop, a, b, arguments.length > 1);
    }, removeProp: function removeProp(a) {
      return this.each(function () {
        delete this[r.propFix[a] || a];
      });
    } }), r.extend({ prop: function prop(a, b, c) {
      var d,
          e,
          f = a.nodeType;if (3 !== f && 8 !== f && 2 !== f) return 1 === f && r.isXMLDoc(a) || (b = r.propFix[b] || b, e = r.propHooks[b]), void 0 !== c ? e && "set" in e && void 0 !== (d = e.set(a, c, b)) ? d : a[b] = c : e && "get" in e && null !== (d = e.get(a, b)) ? d : a[b];
    }, propHooks: { tabIndex: { get: function get(a) {
          var b = r.find.attr(a, "tabindex");return b ? parseInt(b, 10) : nb.test(a.nodeName) || ob.test(a.nodeName) && a.href ? 0 : -1;
        } } }, propFix: { "for": "htmlFor", "class": "className" } }), o.optSelected || (r.propHooks.selected = { get: function get(a) {
      var b = a.parentNode;return b && b.parentNode && b.parentNode.selectedIndex, null;
    }, set: function set(a) {
      var b = a.parentNode;b && (b.selectedIndex, b.parentNode && b.parentNode.selectedIndex);
    } }), r.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function () {
    r.propFix[this.toLowerCase()] = this;
  });function pb(a) {
    var b = a.match(L) || [];return b.join(" ");
  }function qb(a) {
    return a.getAttribute && a.getAttribute("class") || "";
  }r.fn.extend({ addClass: function addClass(a) {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          i = 0;if (r.isFunction(a)) return this.each(function (b) {
        r(this).addClass(a.call(this, b, qb(this)));
      });if ("string" == typeof a && a) {
        b = a.match(L) || [];while (c = this[i++]) {
          if (e = qb(c), d = 1 === c.nodeType && " " + pb(e) + " ") {
            g = 0;while (f = b[g++]) {
              d.indexOf(" " + f + " ") < 0 && (d += f + " ");
            }h = pb(d), e !== h && c.setAttribute("class", h);
          }
        }
      }return this;
    }, removeClass: function removeClass(a) {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          i = 0;if (r.isFunction(a)) return this.each(function (b) {
        r(this).removeClass(a.call(this, b, qb(this)));
      });if (!arguments.length) return this.attr("class", "");if ("string" == typeof a && a) {
        b = a.match(L) || [];while (c = this[i++]) {
          if (e = qb(c), d = 1 === c.nodeType && " " + pb(e) + " ") {
            g = 0;while (f = b[g++]) {
              while (d.indexOf(" " + f + " ") > -1) {
                d = d.replace(" " + f + " ", " ");
              }
            }h = pb(d), e !== h && c.setAttribute("class", h);
          }
        }
      }return this;
    }, toggleClass: function toggleClass(a, b) {
      var c = typeof a === "undefined" ? "undefined" : _typeof(a);return "boolean" == typeof b && "string" === c ? b ? this.addClass(a) : this.removeClass(a) : r.isFunction(a) ? this.each(function (c) {
        r(this).toggleClass(a.call(this, c, qb(this), b), b);
      }) : this.each(function () {
        var b, d, e, f;if ("string" === c) {
          d = 0, e = r(this), f = a.match(L) || [];while (b = f[d++]) {
            e.hasClass(b) ? e.removeClass(b) : e.addClass(b);
          }
        } else void 0 !== a && "boolean" !== c || (b = qb(this), b && W.set(this, "__className__", b), this.setAttribute && this.setAttribute("class", b || a === !1 ? "" : W.get(this, "__className__") || ""));
      });
    }, hasClass: function hasClass(a) {
      var b,
          c,
          d = 0;b = " " + a + " ";while (c = this[d++]) {
        if (1 === c.nodeType && (" " + pb(qb(c)) + " ").indexOf(b) > -1) return !0;
      }return !1;
    } });var rb = /\r/g;r.fn.extend({ val: function val(a) {
      var b,
          c,
          d,
          e = this[0];{
        if (arguments.length) return d = r.isFunction(a), this.each(function (c) {
          var e;1 === this.nodeType && (e = d ? a.call(this, c, r(this).val()) : a, null == e ? e = "" : "number" == typeof e ? e += "" : Array.isArray(e) && (e = r.map(e, function (a) {
            return null == a ? "" : a + "";
          })), b = r.valHooks[this.type] || r.valHooks[this.nodeName.toLowerCase()], b && "set" in b && void 0 !== b.set(this, e, "value") || (this.value = e));
        });if (e) return b = r.valHooks[e.type] || r.valHooks[e.nodeName.toLowerCase()], b && "get" in b && void 0 !== (c = b.get(e, "value")) ? c : (c = e.value, "string" == typeof c ? c.replace(rb, "") : null == c ? "" : c);
      }
    } }), r.extend({ valHooks: { option: { get: function get(a) {
          var b = r.find.attr(a, "value");return null != b ? b : pb(r.text(a));
        } }, select: { get: function get(a) {
          var b,
              c,
              d,
              e = a.options,
              f = a.selectedIndex,
              g = "select-one" === a.type,
              h = g ? null : [],
              i = g ? f + 1 : e.length;for (d = f < 0 ? i : g ? f : 0; d < i; d++) {
            if (c = e[d], (c.selected || d === f) && !c.disabled && (!c.parentNode.disabled || !B(c.parentNode, "optgroup"))) {
              if (b = r(c).val(), g) return b;h.push(b);
            }
          }return h;
        }, set: function set(a, b) {
          var c,
              d,
              e = a.options,
              f = r.makeArray(b),
              g = e.length;while (g--) {
            d = e[g], (d.selected = r.inArray(r.valHooks.option.get(d), f) > -1) && (c = !0);
          }return c || (a.selectedIndex = -1), f;
        } } } }), r.each(["radio", "checkbox"], function () {
    r.valHooks[this] = { set: function set(a, b) {
        if (Array.isArray(b)) return a.checked = r.inArray(r(a).val(), b) > -1;
      } }, o.checkOn || (r.valHooks[this].get = function (a) {
      return null === a.getAttribute("value") ? "on" : a.value;
    });
  });var sb = /^(?:focusinfocus|focusoutblur)$/;r.extend(r.event, { trigger: function trigger(b, c, e, f) {
      var g,
          h,
          i,
          j,
          k,
          m,
          n,
          o = [e || d],
          p = l.call(b, "type") ? b.type : b,
          q = l.call(b, "namespace") ? b.namespace.split(".") : [];if (h = i = e = e || d, 3 !== e.nodeType && 8 !== e.nodeType && !sb.test(p + r.event.triggered) && (p.indexOf(".") > -1 && (q = p.split("."), p = q.shift(), q.sort()), k = p.indexOf(":") < 0 && "on" + p, b = b[r.expando] ? b : new r.Event(p, "object" == (typeof b === "undefined" ? "undefined" : _typeof(b)) && b), b.isTrigger = f ? 2 : 3, b.namespace = q.join("."), b.rnamespace = b.namespace ? new RegExp("(^|\\.)" + q.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, b.result = void 0, b.target || (b.target = e), c = null == c ? [b] : r.makeArray(c, [b]), n = r.event.special[p] || {}, f || !n.trigger || n.trigger.apply(e, c) !== !1)) {
        if (!f && !n.noBubble && !r.isWindow(e)) {
          for (j = n.delegateType || p, sb.test(j + p) || (h = h.parentNode); h; h = h.parentNode) {
            o.push(h), i = h;
          }i === (e.ownerDocument || d) && o.push(i.defaultView || i.parentWindow || a);
        }g = 0;while ((h = o[g++]) && !b.isPropagationStopped()) {
          b.type = g > 1 ? j : n.bindType || p, m = (W.get(h, "events") || {})[b.type] && W.get(h, "handle"), m && m.apply(h, c), m = k && h[k], m && m.apply && U(h) && (b.result = m.apply(h, c), b.result === !1 && b.preventDefault());
        }return b.type = p, f || b.isDefaultPrevented() || n._default && n._default.apply(o.pop(), c) !== !1 || !U(e) || k && r.isFunction(e[p]) && !r.isWindow(e) && (i = e[k], i && (e[k] = null), r.event.triggered = p, e[p](), r.event.triggered = void 0, i && (e[k] = i)), b.result;
      }
    }, simulate: function simulate(a, b, c) {
      var d = r.extend(new r.Event(), c, { type: a, isSimulated: !0 });r.event.trigger(d, null, b);
    } }), r.fn.extend({ trigger: function trigger(a, b) {
      return this.each(function () {
        r.event.trigger(a, b, this);
      });
    }, triggerHandler: function triggerHandler(a, b) {
      var c = this[0];if (c) return r.event.trigger(a, b, c, !0);
    } }), r.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "), function (a, b) {
    r.fn[b] = function (a, c) {
      return arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b);
    };
  }), r.fn.extend({ hover: function hover(a, b) {
      return this.mouseenter(a).mouseleave(b || a);
    } }), o.focusin = "onfocusin" in a, o.focusin || r.each({ focus: "focusin", blur: "focusout" }, function (a, b) {
    var c = function c(a) {
      r.event.simulate(b, a.target, r.event.fix(a));
    };r.event.special[b] = { setup: function setup() {
        var d = this.ownerDocument || this,
            e = W.access(d, b);e || d.addEventListener(a, c, !0), W.access(d, b, (e || 0) + 1);
      }, teardown: function teardown() {
        var d = this.ownerDocument || this,
            e = W.access(d, b) - 1;e ? W.access(d, b, e) : (d.removeEventListener(a, c, !0), W.remove(d, b));
      } };
  });var tb = a.location,
      ub = r.now(),
      vb = /\?/;r.parseXML = function (b) {
    var c;if (!b || "string" != typeof b) return null;try {
      c = new a.DOMParser().parseFromString(b, "text/xml");
    } catch (d) {
      c = void 0;
    }return c && !c.getElementsByTagName("parsererror").length || r.error("Invalid XML: " + b), c;
  };var wb = /\[\]$/,
      xb = /\r?\n/g,
      yb = /^(?:submit|button|image|reset|file)$/i,
      zb = /^(?:input|select|textarea|keygen)/i;function Ab(a, b, c, d) {
    var e;if (Array.isArray(b)) r.each(b, function (b, e) {
      c || wb.test(a) ? d(a, e) : Ab(a + "[" + ("object" == (typeof e === "undefined" ? "undefined" : _typeof(e)) && null != e ? b : "") + "]", e, c, d);
    });else if (c || "object" !== r.type(b)) d(a, b);else for (e in b) {
      Ab(a + "[" + e + "]", b[e], c, d);
    }
  }r.param = function (a, b) {
    var c,
        d = [],
        e = function e(a, b) {
      var c = r.isFunction(b) ? b() : b;d[d.length] = encodeURIComponent(a) + "=" + encodeURIComponent(null == c ? "" : c);
    };if (Array.isArray(a) || a.jquery && !r.isPlainObject(a)) r.each(a, function () {
      e(this.name, this.value);
    });else for (c in a) {
      Ab(c, a[c], b, e);
    }return d.join("&");
  }, r.fn.extend({ serialize: function serialize() {
      return r.param(this.serializeArray());
    }, serializeArray: function serializeArray() {
      return this.map(function () {
        var a = r.prop(this, "elements");return a ? r.makeArray(a) : this;
      }).filter(function () {
        var a = this.type;return this.name && !r(this).is(":disabled") && zb.test(this.nodeName) && !yb.test(a) && (this.checked || !ja.test(a));
      }).map(function (a, b) {
        var c = r(this).val();return null == c ? null : Array.isArray(c) ? r.map(c, function (a) {
          return { name: b.name, value: a.replace(xb, "\r\n") };
        }) : { name: b.name, value: c.replace(xb, "\r\n") };
      }).get();
    } });var Bb = /%20/g,
      Cb = /#.*$/,
      Db = /([?&])_=[^&]*/,
      Eb = /^(.*?):[ \t]*([^\r\n]*)$/gm,
      Fb = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
      Gb = /^(?:GET|HEAD)$/,
      Hb = /^\/\//,
      Ib = {},
      Jb = {},
      Kb = "*/".concat("*"),
      Lb = d.createElement("a");Lb.href = tb.href;function Mb(a) {
    return function (b, c) {
      "string" != typeof b && (c = b, b = "*");var d,
          e = 0,
          f = b.toLowerCase().match(L) || [];if (r.isFunction(c)) while (d = f[e++]) {
        "+" === d[0] ? (d = d.slice(1) || "*", (a[d] = a[d] || []).unshift(c)) : (a[d] = a[d] || []).push(c);
      }
    };
  }function Nb(a, b, c, d) {
    var e = {},
        f = a === Jb;function g(h) {
      var i;return e[h] = !0, r.each(a[h] || [], function (a, h) {
        var j = h(b, c, d);return "string" != typeof j || f || e[j] ? f ? !(i = j) : void 0 : (b.dataTypes.unshift(j), g(j), !1);
      }), i;
    }return g(b.dataTypes[0]) || !e["*"] && g("*");
  }function Ob(a, b) {
    var c,
        d,
        e = r.ajaxSettings.flatOptions || {};for (c in b) {
      void 0 !== b[c] && ((e[c] ? a : d || (d = {}))[c] = b[c]);
    }return d && r.extend(!0, a, d), a;
  }function Pb(a, b, c) {
    var d,
        e,
        f,
        g,
        h = a.contents,
        i = a.dataTypes;while ("*" === i[0]) {
      i.shift(), void 0 === d && (d = a.mimeType || b.getResponseHeader("Content-Type"));
    }if (d) for (e in h) {
      if (h[e] && h[e].test(d)) {
        i.unshift(e);break;
      }
    }if (i[0] in c) f = i[0];else {
      for (e in c) {
        if (!i[0] || a.converters[e + " " + i[0]]) {
          f = e;break;
        }g || (g = e);
      }f = f || g;
    }if (f) return f !== i[0] && i.unshift(f), c[f];
  }function Qb(a, b, c, d) {
    var e,
        f,
        g,
        h,
        i,
        j = {},
        k = a.dataTypes.slice();if (k[1]) for (g in a.converters) {
      j[g.toLowerCase()] = a.converters[g];
    }f = k.shift();while (f) {
      if (a.responseFields[f] && (c[a.responseFields[f]] = b), !i && d && a.dataFilter && (b = a.dataFilter(b, a.dataType)), i = f, f = k.shift()) if ("*" === f) f = i;else if ("*" !== i && i !== f) {
        if (g = j[i + " " + f] || j["* " + f], !g) for (e in j) {
          if (h = e.split(" "), h[1] === f && (g = j[i + " " + h[0]] || j["* " + h[0]])) {
            g === !0 ? g = j[e] : j[e] !== !0 && (f = h[0], k.unshift(h[1]));break;
          }
        }if (g !== !0) if (g && a["throws"]) b = g(b);else try {
          b = g(b);
        } catch (l) {
          return { state: "parsererror", error: g ? l : "No conversion from " + i + " to " + f };
        }
      }
    }return { state: "success", data: b };
  }r.extend({ active: 0, lastModified: {}, etag: {}, ajaxSettings: { url: tb.href, type: "GET", isLocal: Fb.test(tb.protocol), global: !0, processData: !0, async: !0, contentType: "application/x-www-form-urlencoded; charset=UTF-8", accepts: { "*": Kb, text: "text/plain", html: "text/html", xml: "application/xml, text/xml", json: "application/json, text/javascript" }, contents: { xml: /\bxml\b/, html: /\bhtml/, json: /\bjson\b/ }, responseFields: { xml: "responseXML", text: "responseText", json: "responseJSON" }, converters: { "* text": String, "text html": !0, "text json": JSON.parse, "text xml": r.parseXML }, flatOptions: { url: !0, context: !0 } }, ajaxSetup: function ajaxSetup(a, b) {
      return b ? Ob(Ob(a, r.ajaxSettings), b) : Ob(r.ajaxSettings, a);
    }, ajaxPrefilter: Mb(Ib), ajaxTransport: Mb(Jb), ajax: function ajax(b, c) {
      "object" == (typeof b === "undefined" ? "undefined" : _typeof(b)) && (c = b, b = void 0), c = c || {};var e,
          f,
          g,
          h,
          i,
          j,
          k,
          l,
          m,
          n,
          o = r.ajaxSetup({}, c),
          p = o.context || o,
          q = o.context && (p.nodeType || p.jquery) ? r(p) : r.event,
          s = r.Deferred(),
          t = r.Callbacks("once memory"),
          u = o.statusCode || {},
          v = {},
          w = {},
          x = "canceled",
          y = { readyState: 0, getResponseHeader: function getResponseHeader(a) {
          var b;if (k) {
            if (!h) {
              h = {};while (b = Eb.exec(g)) {
                h[b[1].toLowerCase()] = b[2];
              }
            }b = h[a.toLowerCase()];
          }return null == b ? null : b;
        }, getAllResponseHeaders: function getAllResponseHeaders() {
          return k ? g : null;
        }, setRequestHeader: function setRequestHeader(a, b) {
          return null == k && (a = w[a.toLowerCase()] = w[a.toLowerCase()] || a, v[a] = b), this;
        }, overrideMimeType: function overrideMimeType(a) {
          return null == k && (o.mimeType = a), this;
        }, statusCode: function statusCode(a) {
          var b;if (a) if (k) y.always(a[y.status]);else for (b in a) {
            u[b] = [u[b], a[b]];
          }return this;
        }, abort: function abort(a) {
          var b = a || x;return e && e.abort(b), A(0, b), this;
        } };if (s.promise(y), o.url = ((b || o.url || tb.href) + "").replace(Hb, tb.protocol + "//"), o.type = c.method || c.type || o.method || o.type, o.dataTypes = (o.dataType || "*").toLowerCase().match(L) || [""], null == o.crossDomain) {
        j = d.createElement("a");try {
          j.href = o.url, j.href = j.href, o.crossDomain = Lb.protocol + "//" + Lb.host != j.protocol + "//" + j.host;
        } catch (z) {
          o.crossDomain = !0;
        }
      }if (o.data && o.processData && "string" != typeof o.data && (o.data = r.param(o.data, o.traditional)), Nb(Ib, o, c, y), k) return y;l = r.event && o.global, l && 0 === r.active++ && r.event.trigger("ajaxStart"), o.type = o.type.toUpperCase(), o.hasContent = !Gb.test(o.type), f = o.url.replace(Cb, ""), o.hasContent ? o.data && o.processData && 0 === (o.contentType || "").indexOf("application/x-www-form-urlencoded") && (o.data = o.data.replace(Bb, "+")) : (n = o.url.slice(f.length), o.data && (f += (vb.test(f) ? "&" : "?") + o.data, delete o.data), o.cache === !1 && (f = f.replace(Db, "$1"), n = (vb.test(f) ? "&" : "?") + "_=" + ub++ + n), o.url = f + n), o.ifModified && (r.lastModified[f] && y.setRequestHeader("If-Modified-Since", r.lastModified[f]), r.etag[f] && y.setRequestHeader("If-None-Match", r.etag[f])), (o.data && o.hasContent && o.contentType !== !1 || c.contentType) && y.setRequestHeader("Content-Type", o.contentType), y.setRequestHeader("Accept", o.dataTypes[0] && o.accepts[o.dataTypes[0]] ? o.accepts[o.dataTypes[0]] + ("*" !== o.dataTypes[0] ? ", " + Kb + "; q=0.01" : "") : o.accepts["*"]);for (m in o.headers) {
        y.setRequestHeader(m, o.headers[m]);
      }if (o.beforeSend && (o.beforeSend.call(p, y, o) === !1 || k)) return y.abort();if (x = "abort", t.add(o.complete), y.done(o.success), y.fail(o.error), e = Nb(Jb, o, c, y)) {
        if (y.readyState = 1, l && q.trigger("ajaxSend", [y, o]), k) return y;o.async && o.timeout > 0 && (i = a.setTimeout(function () {
          y.abort("timeout");
        }, o.timeout));try {
          k = !1, e.send(v, A);
        } catch (z) {
          if (k) throw z;A(-1, z);
        }
      } else A(-1, "No Transport");function A(b, c, d, h) {
        var j,
            m,
            n,
            v,
            w,
            x = c;k || (k = !0, i && a.clearTimeout(i), e = void 0, g = h || "", y.readyState = b > 0 ? 4 : 0, j = b >= 200 && b < 300 || 304 === b, d && (v = Pb(o, y, d)), v = Qb(o, v, y, j), j ? (o.ifModified && (w = y.getResponseHeader("Last-Modified"), w && (r.lastModified[f] = w), w = y.getResponseHeader("etag"), w && (r.etag[f] = w)), 204 === b || "HEAD" === o.type ? x = "nocontent" : 304 === b ? x = "notmodified" : (x = v.state, m = v.data, n = v.error, j = !n)) : (n = x, !b && x || (x = "error", b < 0 && (b = 0))), y.status = b, y.statusText = (c || x) + "", j ? s.resolveWith(p, [m, x, y]) : s.rejectWith(p, [y, x, n]), y.statusCode(u), u = void 0, l && q.trigger(j ? "ajaxSuccess" : "ajaxError", [y, o, j ? m : n]), t.fireWith(p, [y, x]), l && (q.trigger("ajaxComplete", [y, o]), --r.active || r.event.trigger("ajaxStop")));
      }return y;
    }, getJSON: function getJSON(a, b, c) {
      return r.get(a, b, c, "json");
    }, getScript: function getScript(a, b) {
      return r.get(a, void 0, b, "script");
    } }), r.each(["get", "post"], function (a, b) {
    r[b] = function (a, c, d, e) {
      return r.isFunction(c) && (e = e || d, d = c, c = void 0), r.ajax(r.extend({ url: a, type: b, dataType: e, data: c, success: d }, r.isPlainObject(a) && a));
    };
  }), r._evalUrl = function (a) {
    return r.ajax({ url: a, type: "GET", dataType: "script", cache: !0, async: !1, global: !1, "throws": !0 });
  }, r.fn.extend({ wrapAll: function wrapAll(a) {
      var b;return this[0] && (r.isFunction(a) && (a = a.call(this[0])), b = r(a, this[0].ownerDocument).eq(0).clone(!0), this[0].parentNode && b.insertBefore(this[0]), b.map(function () {
        var a = this;while (a.firstElementChild) {
          a = a.firstElementChild;
        }return a;
      }).append(this)), this;
    }, wrapInner: function wrapInner(a) {
      return r.isFunction(a) ? this.each(function (b) {
        r(this).wrapInner(a.call(this, b));
      }) : this.each(function () {
        var b = r(this),
            c = b.contents();c.length ? c.wrapAll(a) : b.append(a);
      });
    }, wrap: function wrap(a) {
      var b = r.isFunction(a);return this.each(function (c) {
        r(this).wrapAll(b ? a.call(this, c) : a);
      });
    }, unwrap: function unwrap(a) {
      return this.parent(a).not("body").each(function () {
        r(this).replaceWith(this.childNodes);
      }), this;
    } }), r.expr.pseudos.hidden = function (a) {
    return !r.expr.pseudos.visible(a);
  }, r.expr.pseudos.visible = function (a) {
    return !!(a.offsetWidth || a.offsetHeight || a.getClientRects().length);
  }, r.ajaxSettings.xhr = function () {
    try {
      return new a.XMLHttpRequest();
    } catch (b) {}
  };var Rb = { 0: 200, 1223: 204 },
      Sb = r.ajaxSettings.xhr();o.cors = !!Sb && "withCredentials" in Sb, o.ajax = Sb = !!Sb, r.ajaxTransport(function (b) {
    var _c, d;if (o.cors || Sb && !b.crossDomain) return { send: function send(e, f) {
        var g,
            h = b.xhr();if (h.open(b.type, b.url, b.async, b.username, b.password), b.xhrFields) for (g in b.xhrFields) {
          h[g] = b.xhrFields[g];
        }b.mimeType && h.overrideMimeType && h.overrideMimeType(b.mimeType), b.crossDomain || e["X-Requested-With"] || (e["X-Requested-With"] = "XMLHttpRequest");for (g in e) {
          h.setRequestHeader(g, e[g]);
        }_c = function c(a) {
          return function () {
            _c && (_c = d = h.onload = h.onerror = h.onabort = h.onreadystatechange = null, "abort" === a ? h.abort() : "error" === a ? "number" != typeof h.status ? f(0, "error") : f(h.status, h.statusText) : f(Rb[h.status] || h.status, h.statusText, "text" !== (h.responseType || "text") || "string" != typeof h.responseText ? { binary: h.response } : { text: h.responseText }, h.getAllResponseHeaders()));
          };
        }, h.onload = _c(), d = h.onerror = _c("error"), void 0 !== h.onabort ? h.onabort = d : h.onreadystatechange = function () {
          4 === h.readyState && a.setTimeout(function () {
            _c && d();
          });
        }, _c = _c("abort");try {
          h.send(b.hasContent && b.data || null);
        } catch (i) {
          if (_c) throw i;
        }
      }, abort: function abort() {
        _c && _c();
      } };
  }), r.ajaxPrefilter(function (a) {
    a.crossDomain && (a.contents.script = !1);
  }), r.ajaxSetup({ accepts: { script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript" }, contents: { script: /\b(?:java|ecma)script\b/ }, converters: { "text script": function textScript(a) {
        return r.globalEval(a), a;
      } } }), r.ajaxPrefilter("script", function (a) {
    void 0 === a.cache && (a.cache = !1), a.crossDomain && (a.type = "GET");
  }), r.ajaxTransport("script", function (a) {
    if (a.crossDomain) {
      var b, _c2;return { send: function send(e, f) {
          b = r("<script>").prop({ charset: a.scriptCharset, src: a.url }).on("load error", _c2 = function c(a) {
            b.remove(), _c2 = null, a && f("error" === a.type ? 404 : 200, a.type);
          }), d.head.appendChild(b[0]);
        }, abort: function abort() {
          _c2 && _c2();
        } };
    }
  });var Tb = [],
      Ub = /(=)\?(?=&|$)|\?\?/;r.ajaxSetup({ jsonp: "callback", jsonpCallback: function jsonpCallback() {
      var a = Tb.pop() || r.expando + "_" + ub++;return this[a] = !0, a;
    } }), r.ajaxPrefilter("json jsonp", function (b, c, d) {
    var e,
        f,
        g,
        h = b.jsonp !== !1 && (Ub.test(b.url) ? "url" : "string" == typeof b.data && 0 === (b.contentType || "").indexOf("application/x-www-form-urlencoded") && Ub.test(b.data) && "data");if (h || "jsonp" === b.dataTypes[0]) return e = b.jsonpCallback = r.isFunction(b.jsonpCallback) ? b.jsonpCallback() : b.jsonpCallback, h ? b[h] = b[h].replace(Ub, "$1" + e) : b.jsonp !== !1 && (b.url += (vb.test(b.url) ? "&" : "?") + b.jsonp + "=" + e), b.converters["script json"] = function () {
      return g || r.error(e + " was not called"), g[0];
    }, b.dataTypes[0] = "json", f = a[e], a[e] = function () {
      g = arguments;
    }, d.always(function () {
      void 0 === f ? r(a).removeProp(e) : a[e] = f, b[e] && (b.jsonpCallback = c.jsonpCallback, Tb.push(e)), g && r.isFunction(f) && f(g[0]), g = f = void 0;
    }), "script";
  }), o.createHTMLDocument = function () {
    var a = d.implementation.createHTMLDocument("").body;return a.innerHTML = "<form></form><form></form>", 2 === a.childNodes.length;
  }(), r.parseHTML = function (a, b, c) {
    if ("string" != typeof a) return [];"boolean" == typeof b && (c = b, b = !1);var e, f, g;return b || (o.createHTMLDocument ? (b = d.implementation.createHTMLDocument(""), e = b.createElement("base"), e.href = d.location.href, b.head.appendChild(e)) : b = d), f = C.exec(a), g = !c && [], f ? [b.createElement(f[1])] : (f = qa([a], b, g), g && g.length && r(g).remove(), r.merge([], f.childNodes));
  }, r.fn.load = function (a, b, c) {
    var d,
        e,
        f,
        g = this,
        h = a.indexOf(" ");return h > -1 && (d = pb(a.slice(h)), a = a.slice(0, h)), r.isFunction(b) ? (c = b, b = void 0) : b && "object" == (typeof b === "undefined" ? "undefined" : _typeof(b)) && (e = "POST"), g.length > 0 && r.ajax({ url: a, type: e || "GET", dataType: "html", data: b }).done(function (a) {
      f = arguments, g.html(d ? r("<div>").append(r.parseHTML(a)).find(d) : a);
    }).always(c && function (a, b) {
      g.each(function () {
        c.apply(this, f || [a.responseText, b, a]);
      });
    }), this;
  }, r.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (a, b) {
    r.fn[b] = function (a) {
      return this.on(b, a);
    };
  }), r.expr.pseudos.animated = function (a) {
    return r.grep(r.timers, function (b) {
      return a === b.elem;
    }).length;
  }, r.offset = { setOffset: function setOffset(a, b, c) {
      var d,
          e,
          f,
          g,
          h,
          i,
          j,
          k = r.css(a, "position"),
          l = r(a),
          m = {};"static" === k && (a.style.position = "relative"), h = l.offset(), f = r.css(a, "top"), i = r.css(a, "left"), j = ("absolute" === k || "fixed" === k) && (f + i).indexOf("auto") > -1, j ? (d = l.position(), g = d.top, e = d.left) : (g = parseFloat(f) || 0, e = parseFloat(i) || 0), r.isFunction(b) && (b = b.call(a, c, r.extend({}, h))), null != b.top && (m.top = b.top - h.top + g), null != b.left && (m.left = b.left - h.left + e), "using" in b ? b.using.call(a, m) : l.css(m);
    } }, r.fn.extend({ offset: function offset(a) {
      if (arguments.length) return void 0 === a ? this : this.each(function (b) {
        r.offset.setOffset(this, a, b);
      });var b,
          c,
          d,
          e,
          f = this[0];if (f) return f.getClientRects().length ? (d = f.getBoundingClientRect(), b = f.ownerDocument, c = b.documentElement, e = b.defaultView, { top: d.top + e.pageYOffset - c.clientTop, left: d.left + e.pageXOffset - c.clientLeft }) : { top: 0, left: 0 };
    }, position: function position() {
      if (this[0]) {
        var a,
            b,
            c = this[0],
            d = { top: 0, left: 0 };return "fixed" === r.css(c, "position") ? b = c.getBoundingClientRect() : (a = this.offsetParent(), b = this.offset(), B(a[0], "html") || (d = a.offset()), d = { top: d.top + r.css(a[0], "borderTopWidth", !0), left: d.left + r.css(a[0], "borderLeftWidth", !0) }), { top: b.top - d.top - r.css(c, "marginTop", !0), left: b.left - d.left - r.css(c, "marginLeft", !0) };
      }
    }, offsetParent: function offsetParent() {
      return this.map(function () {
        var a = this.offsetParent;while (a && "static" === r.css(a, "position")) {
          a = a.offsetParent;
        }return a || ra;
      });
    } }), r.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function (a, b) {
    var c = "pageYOffset" === b;r.fn[a] = function (d) {
      return T(this, function (a, d, e) {
        var f;return r.isWindow(a) ? f = a : 9 === a.nodeType && (f = a.defaultView), void 0 === e ? f ? f[b] : a[d] : void (f ? f.scrollTo(c ? f.pageXOffset : e, c ? e : f.pageYOffset) : a[d] = e);
      }, a, d, arguments.length);
    };
  }), r.each(["top", "left"], function (a, b) {
    r.cssHooks[b] = Pa(o.pixelPosition, function (a, c) {
      if (c) return c = Oa(a, b), Ma.test(c) ? r(a).position()[b] + "px" : c;
    });
  }), r.each({ Height: "height", Width: "width" }, function (a, b) {
    r.each({ padding: "inner" + a, content: b, "": "outer" + a }, function (c, d) {
      r.fn[d] = function (e, f) {
        var g = arguments.length && (c || "boolean" != typeof e),
            h = c || (e === !0 || f === !0 ? "margin" : "border");return T(this, function (b, c, e) {
          var f;return r.isWindow(b) ? 0 === d.indexOf("outer") ? b["inner" + a] : b.document.documentElement["client" + a] : 9 === b.nodeType ? (f = b.documentElement, Math.max(b.body["scroll" + a], f["scroll" + a], b.body["offset" + a], f["offset" + a], f["client" + a])) : void 0 === e ? r.css(b, c, h) : r.style(b, c, e, h);
        }, b, g ? e : void 0, g);
      };
    });
  }), r.fn.extend({ bind: function bind(a, b, c) {
      return this.on(a, null, b, c);
    }, unbind: function unbind(a, b) {
      return this.off(a, null, b);
    }, delegate: function delegate(a, b, c, d) {
      return this.on(b, a, c, d);
    }, undelegate: function undelegate(a, b, c) {
      return 1 === arguments.length ? this.off(a, "**") : this.off(b, a || "**", c);
    } }), r.holdReady = function (a) {
    a ? r.readyWait++ : r.ready(!0);
  }, r.isArray = Array.isArray, r.parseJSON = JSON.parse, r.nodeName = B, "function" == typeof define && define.amd && define("jquery", [], function () {
    return r;
  });var Vb = a.jQuery,
      Wb = a.$;return r.noConflict = function (b) {
    return a.$ === r && (a.$ = Wb), b && a.jQuery === r && (a.jQuery = Vb), r;
  }, b || (a.jQuery = a.$ = r), r;
});
'use strict';
/* global Microsoft _ */
var INIT = window.INIT || {};
INIT.helpers = {
  /**
   * debouncing, executes the function if there was no new event in $wait milliseconds
   * @param func
   * @param wait
   * @param scope
   * @returns {Function}
   */
  init: function init() {
    this.forcePopstateOldMSBrowser();
  },
  debounce: function debounce(func, wait, scope) {
    var timeout;
    return function () {
      var context = scope || this;
      var args = arguments;
      var later = function later() {
        timeout = null;
        func.apply(context, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  viewportIsDesktop: function viewportIsDesktop() {
    return window.matchMedia('(min-width: 960px)').matches;
  },
  viewportIsMobile: function viewportIsMobile() {
    // return !this.viewportIsDesktop;
    return window.matchMedia('(max-width: 959px)').matches;
  },
  browserIsIE: function browserIsIE() {
    /* For IE 10-11 - https://stackoverflow.com/questions/10207409/print-preview-using-javascript */
    return navigator.userAgent.match(/(MSIE |Trident.*rv[ :])([0-9]+)/);
  },
  forcePopstateOldMSBrowser: function forcePopstateOldMSBrowser() {
    // workaround FPO-533 - trigger window.popstate always (used in scrollToPlugin.js)
    // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/3740423/
    history.pushState({}, '');
  }
};
'use strict';
var INIT = window.INIT || {};
INIT.accessibility = {
  init: function init() {
    document.addEventListener('keydown', function (e) {
      if (e.keyCode === 9) {
        $('body').addClass('show-focus-outlines');
      }
    });
    document.addEventListener('click', function (e) {
      $('body').removeClass('show-focus-outlines');
    });
  }
};
'use strict';
var INIT = window.INIT || {};
INIT.icon = {
  init: function init() {
    var ajax = new XMLHttpRequest();
    var svgPath = $('body').data('svg-sprite');
    ajax.open('GET', svgPath, true);
    ajax.send();
    ajax.onload = function () {
      var div = document.createElement('div');
      div.innerHTML = ajax.responseText;
      document.body.insertBefore(div, document.body.childNodes[0]);
    };
  }
};
'use strict';
var INIT = window.INIT || {};
INIT.button = {
  init: function init() {
    $('.button[onmousedown*="Textmodul"]').each(function () {
      $(this).mousedown(function () {
        $(this).removeAttr('onmousedown');
      });
    });
  }
};
'use strict';
var INIT = window.INIT || {};
INIT.video = {
  init: function init() {
    jwplayer.key = 'emSKrPhw8tcpxw3aO4oEmjHAukdwTTzowBjtGKx5I54=';
    var $dropdown = $('.media-figure__collapse');
    var $videoElement = $('.video-player');
    this.configs($videoElement);
  },
  configs: function configs(element) {
    element.each(function (index) {
      var $this = $(this);
      var sources = $this.data('video');
      var image = $this.data('image');
      var file = $this.data('text');
      var tracks = $this.data('tracks');
      var customLocalization = {};
      var customCCLabelForOff = 'Closed Captions Off';
      if ($('html').attr('lang') === 'de') {
        customCCLabelForOff = 'Untertitel aus';
        customLocalization = {
          prev: 'Zurück',
          next: 'Vor',
          fullscreen: 'Vollbildschirm',
          hd: 'Qualität',
          cc: 'Untertitel',
          videoInfo: 'Video-Informationen',
          buffer: 'Lädt',
          close: 'Schließen',
          settings: 'Einstellungen',
          more: 'Mehr',
          play: 'Abspielen',
          rewind: '10 Sekunden zurückspulen',
          replay: 'Erneut abspielen'
          // JWPlayer defaults
          // player: "Video Player",
          // play: "Play",
          // playback: "Start Playback",
          // pause: "Pause",
          // stop: "Stop",
          // volume: "Volume",
          // prev: "Previous",
          // next: "Next",
          // cast: "Chromecast",
          // airplay: "AirPlay",
          // fullscreen: "Fullscreen",
          // playlist: "Playlist",
          // hd: "Quality",
          // cc: "Closed Captions",
          // audioTracks: "Audio Tracks",
          // playbackRates: "Playback Rates",
          // replay: "Replay",
          // buffer: "Loading",
          // more: "More",
          // liveBroadcast: "Live",
          // loadingAd: "Loading ad",
          // rewind: "Rewind 10 Seconds",
          // nextUp: "Next Up",
          // nextUpClose: "Next Up Close",
          // related: "More Videos",
          // close: "Close",
          // settings: "Settings",
          // unmute: "Unmute",
          // copied: "Copied",
          // videoInfo: "About this video"
        };
      }
      $(this).attr('id', 'video-player-' + (index + 1));
      jwplayer(this.id).setup({
        width: '100%',
        aspectratio: '16:9',
        sources: sources,
        image: image,
        tracks: tracks,
        skin: {
          name: 'seven',
          active: '#007EB5'
        },
        localization: customLocalization
      });
      // Translate "Off" in Settings Menu for Closed Captions
      jwplayer(this.id).on('ready', function () {
        $('.jw-reset.jw-settings-content-item:contains(\'Off\')').text(customCCLabelForOff);
      });
    });
  }
};
'use strict';
var INIT = window.INIT || {};
INIT.stickyHeader = {
  init: function init() {
    var toggleClass = 'sticky',
        changeOn = 100,
        $sticky = $('.header');
    if ($sticky.length > 0) {
      handleSticky($sticky);
    }
    function handleSticky(elem) {
      var $elem = elem;
      $(window).scroll(function () {
        var scrollTop = $(window).scrollTop();
        if (scrollTop >= changeOn) {
          $elem.addClass(toggleClass);
        } else {
          $elem.removeClass(toggleClass);
        }
      });
    }
  }
};
'use strict';
var INIT = window.INIT || {};
INIT.footer = {
  init: function init() {
    var button = $('.to-top');
    $(window).scroll(function () {
      if ($(window).scrollTop() > 100) {
        button.addClass('active');
      } else {
        button.removeClass('active');
      }
    });
  }
};
'use strict';
var INIT = window.INIT || {};
INIT.headerSearch = {
  init: function init() {
    var $header = $('.header');
    var $magnifier = $('.header__search-button');
    var $headerSearchBar = $('.header__search-form');
    var headerSearchIsActive = false;
    var clickOutsideSearch = new ClickOutside([$('.header__search')[0]], closeHeaderSearch);
    $magnifier.on('click', function () {
      headerSearchIsActive ? closeHeaderSearch() : openHeaderSearch();
    });
    function openHeaderSearch() {
      clickOutsideSearch.listen(true);
      headerSearchIsActive = true;
      INIT.noScroll.addNoScrollClass();
      $headerSearchBar.attr('aria-hidden', false);
      $magnifier.attr('aria-expanded', true);
      $('.header__search-input').focus();
    }
    function closeHeaderSearch() {
      clickOutsideSearch.listen(false);
      headerSearchIsActive = false;
      INIT.noScroll.removeNoScrollClass();
      $headerSearchBar.attr('aria-hidden', true);
      $magnifier.attr('aria-expanded', false);
      $('.header__search-result_container').css({ 'position': 'absolute', 'display': 'none', 'z-index': '9999' });
      $('#header-search').val('');
    }
  }
};
'use strict';
var INIT = window.INIT || {};
INIT.mainSearch = {
  init: function init() {
    var $mainSearch = $('[data-trigger="main-search"]');
    if ($mainSearch.length) {
      $mainSearch.tabs({
        tablist: '.main-search__buttons',
        controls: '.main-search__button',
        activeClassControl: 'main-search__button--active',
        panels: '.main-search__form',
        activeClassPanel: 'main-search__form--active',
        controlsId: 'main-search-tab',
        panelsId: 'main-search-panel'
      });
    }
  }
};
'use strict';
var INIT = window.INIT || {};
INIT.noScroll = {
  noScrollClass: 'no-scroll',
  noScrollElementsSelector: 'body, .header__wrapper, .contact-flap, .link.to-top',
  htmlSelector: 'html',
  helperClass: 'no-scroll-touch',
  init: function init() {
    var scrollbarWidth = this.getScrollbarWidth();
    if (scrollbarWidth > 0) {
      // $('head').append('<style type="text/css">@media screen and (max-width: 959px){ .' + this.noScrollClass + ' {margin-right: ' + scrollbarWidth + 'px;}}</style>');
      $('head').append('<style type="text/css"> .' + this.noScrollClass + ' {margin-right: ' + scrollbarWidth + 'px;}</style>');
    }
  },
  addNoScrollClass: function addNoScrollClass() {
    $(this.noScrollElementsSelector).addClass(this.noScrollClass);
    $(this.htmlSelector).addClass(this.helperClass);
  },
  removeNoScrollClass: function removeNoScrollClass() {
    $(this.noScrollElementsSelector).removeClass(this.noScrollClass);
    $(this.htmlSelector).removeClass(this.helperClass);
  },
  getScrollbarWidth: function getScrollbarWidth() {
    var outer;
    var widthNoScroll;
    var inner;
    var widthWithScroll;
    outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.width = '100px';
    outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
    document.body.appendChild(outer);
    widthNoScroll = outer.offsetWidth;
    // force scrollbars
    outer.style.overflow = 'scroll';
    // add innerdiv
    inner = document.createElement('div');
    inner.style.width = '100%';
    outer.appendChild(inner);
    widthWithScroll = inner.offsetWidth;
    // remove divs
    outer.parentNode.removeChild(outer);
    return widthNoScroll - widthWithScroll;
  }
};
/* eslint-disable */
/*
         888      888                           888                                 d8b
         888      888                           888                                 Y8P
         888      888                           888
 8888b.  888  888 888  888  .d88b.  888d888 .d88888  .d88b.   .d88b.  88888b.      8888 .d8888b
    "88b 888 .88P 888 .88P d88""88b 888P"  d88" 888 d8P  Y8b d88""88b 888 "88b     "888 88K
.d888888 888888K  888888K  888  888 888    888  888 88888888 888  888 888  888      888 "Y8888b.
888  888 888 "88b 888 "88b Y88..88P 888    Y88b 888 Y8b.     Y88..88P 888  888 d8b  888      X88
"Y888888 888  888 888  888  "Y88P"  888     "Y88888  "Y8888P  "Y88P"  888  888 Y8P  888 "Y8888P'
                                                                                    888
                                                                                   d88P
                                                                                 888P"
 Version: 1.0.0
  Author: Sascha Geyer
 Website: http://saschageyer.com
    Docs: http://saschageyer.github.io/akkordeon
    Repo: http://github.com/saschageyer/akkordeon
*/
/*! akkordeon.js v1.0.0 | (c) Sascha Geyer */
'use strict';
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var INIT = window.INIT || {};
INIT.plugins = INIT.plugins || {};
INIT.plugins.akkordeon = {
  init: function init() {
    var Akkordeon = function () {
      function Akkordeon($element, options) {
        _classCallCheck(this, Akkordeon);
        Akkordeon.count = ++Akkordeon.count || 1;
        this.defaults = {
          controls: 'even',
          panels: 'odd',
          activeClass: 'akkordeon-active',
          activeElements: 'controls',
          duration: 400,
          easing: 'swing',
          closeOthers: true,
          opened: false,
          forceOpen: false,
          mediaQuery: undefined
        };
        this.opts = this.getOptions(options);
        this.originalOptions = this.opts;
        this.$accordion = $element;
        this.$controls = this.getControls();
        this.$panels = this.getPanels();
        this.$activeElements = this.getActiveElements();
        this.controlObjects = [];
        this.destroy = false;
        this.init();
      }
      _createClass(Akkordeon, [{
        key: 'getOptions',
        value: function getOptions(options) {
          return (typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object' ? $.extend({}, this.defaults, options) : this.defaults;
        }
      }, {
        key: 'getControls',
        value: function getControls() {
          return this.opts.controls === 'even' ? this.$accordion.children().filter(':even') : this.$accordion.find(this.opts.controls);
        }
      }, {
        key: 'getPanels',
        value: function getPanels() {
          return this.opts.panels === 'odd' ? this.$accordion.children().filter(':odd') : this.$accordion.find(this.opts.panels);
        }
      }, {
        key: 'getActiveElements',
        value: function getActiveElements() {
          switch (this.opts.activeElements) {
            case 'controls':
              return this.$controls;
            case 'panels':
              return this.$panels;
            default:
              return this.$accordion.find(this.opts.activeElements);
          }
        }
      }, {
        key: 'buildAkkordeon',
        value: function buildAkkordeon() {
          var _this = this;
          this.controlObjects = [];
          this.$controls.each(function (index, controlElement) {
            _this.controlObjects.push(new Control($(controlElement), _this));
          });
          $.each(this.controlObjects, function (index, controlObject) {
            _this.destroy ? controlObject.destroy() : controlObject.init();
          });
        }
      }, {
        key: 'reInit',
        value: function reInit(mql) {
          if (mql.matches && mql.opts === 'destroy') {
            this.destroy = true;
            this.$accordion.trigger('destroy', this);
          } else if (mql.matches) {
            this.opts = mql.opts;
          } else {
            this.opts = this.originalOptions;
          }
          this.buildAkkordeon();
          this.destroy = false;
        }
      }, {
        key: 'getMediaQueryList',
        value: function getMediaQueryList() {
          var mediaQueryString = Object.keys(this.opts.mediaQuery)[0];
          var mql = window.matchMedia(mediaQueryString);
          var rawOpts = this.opts.mediaQuery[mediaQueryString];
          mql.opts = rawOpts === 'destroy' ? rawOpts : $.extend({}, this.opts, rawOpts);
          return mql;
        }
      }, {
        key: 'init',
        value: function init() {
          if (this.opts.mediaQuery !== undefined) {
            var mql = this.getMediaQueryList();
            this.reInit(mql);
            mql.addListener(this.reInit.bind(this, mql));
          } else {
            this.buildAkkordeon();
          }
        }
      }]);
      return Akkordeon;
    }();
    var Control = function () {
      function Control($controlElement, akkordeonClass) {
        _classCallCheck(this, Control);
        this.controlObjects = akkordeonClass.controlObjects;
        this.opts = akkordeonClass.opts;
        this.$controls = akkordeonClass.$controls;
        this.$panels = akkordeonClass.$panels;
        this.$activeElements = akkordeonClass.$activeElements;
        this.$control = $controlElement;
        this.index = this.$controls.index(this.$control);
        this.$panel = this.$panels.eq(this.index);
        this.state = this.getState();
        this.$firstControl = this.$controls.first();
        this.$lastControl = this.$controls.last();
        this.$prevControl = this.getPrevControl();
        this.$nextControl = this.getNextControl();
        this.$initialTab = this.getInitialTab();
        this.$activeElement = this.$activeElements.eq(this.index);
      }
      _createClass(Control, [{
        key: 'getState',
        value: function getState() {
          var state = this.opts.opened === true ? 'opened' : 'closed';
          if (this.opts.opened === this.index) {
            state = 'opened';
          }
          return state;
        }
      }, {
        key: 'getPrevControl',
        value: function getPrevControl() {
          return this.$controls.eq(this.index - 1);
        }
      }, {
        key: 'getNextControl',
        value: function getNextControl() {
          return this.$control.is(this.$lastControl) ? this.$firstControl : this.$controls.eq(this.index + 1);
        }
      }, {
        key: 'getInitialTab',
        value: function getInitialTab() {
          return typeof this.opts.opened === 'number' ? this.$controls.eq(this.opts.opened) : this.$firstControl;
        }
      }, {
        key: 'destroy',
        value: function destroy() {
          this.$activeElement.removeClass(this.opts.activeClass);
          this.$panel.css('display', '');
          this.removeEvents();
        }
      }, {
        key: 'init',
        value: function init() {
          if (this.state === 'closed') {
            this.$activeElement.removeClass(this.opts.activeClass);
          } else if (this.state === 'opened') {
            this.$panel.show();
            this.$activeElement.addClass(this.opts.activeClass);
          }
          this.removeEvents();
          this.addEvents();
        }
      }, {
        key: 'toggle',
        value: function toggle(slideMethod, toggleClassMethod, startState, endState, hidden) {
          var _this2 = this;
          this.$panel[slideMethod]({
            duration: this.opts.duration,
            easing: this.opts.easing,
            start: function start() {
              _this2.$control.trigger(startState, [_this2, _this2.$control, _this2.$index]);
              _this2.state = startState;
              _this2.$activeElement[toggleClassMethod](_this2.opts.activeClass);
              _this2.$control.attr('aria-expanded', !hidden);
              _this2.$panel.attr('aria-hidden', hidden);
            },
            done: function done() {
              _this2.$control.trigger(endState, [_this2, _this2.$control, _this2.$index]);
              _this2.state = endState;
            }
          });
        }
      }, {
        key: 'close',
        value: function close() {
          this.toggle('slideUp', 'removeClass', 'closing', 'closed', true);
        }
      }, {
        key: 'open',
        value: function open() {
          this.toggle('slideDown', 'addClass', 'opening', 'opened', false);
        }
      }, {
        key: 'closeOthers',
        value: function closeOthers() {
          var _this3 = this;
          $.each(this.controlObjects, function (index, ControlObject) {
            if (ControlObject.state !== 'closed' && index !== _this3.index) {
              ControlObject.close();
            }
          });
        }
      }, {
        key: 'forceOpen',
        value: function forceOpen() {
          var _this4 = this;
          $.each(this.controlObjects, function (index, ControlObject) {
            if (ControlObject.state === 'opened' && index !== _this4.index) {
              _this4.close();
            }
          });
        }
      }, {
        key: 'toggleTabIndex',
        value: function toggleTabIndex() {
          this.$controls.attr({
            'aria-selected': false
          });
          this.$control.attr({
            'aria-selected': true
          });
        }
      }, {
        key: 'togglePanel',
        value: function togglePanel() {
          switch (this.state) {
            case 'opening':
            case 'opened':
              this.opts.forceOpen ? this.forceOpen() : this.close();
              break;
            case 'closing':
            case 'closed':
              if (this.opts.closeOthers) this.closeOthers();
              this.open();
              break;
          }
        }
      }, {
        key: 'keyNavigation',
        value: function keyNavigation(event) {
          switch (event.keyCode) {
            case 13: // enter
            case 32:
              // space
              event.preventDefault();
              this.togglePanel.call(this);
              break;
            case 35:
              // end
              event.preventDefault();
              this.$lastControl.focus();
              break;
            case 36:
              // home
              event.preventDefault();
              this.$firstControl.focus();
              break;
            case 37: // left
            case 38:
              // up
              event.preventDefault();
              this.$prevControl.focus();
              break;
            case 39: // right
            case 40:
              // down
              event.preventDefault();
              this.$nextControl.focus();
              break;
          }
        }
      }, {
        key: 'addEvents',
        value: function addEvents() {
          this.$control.on('click.akkordeon', this.togglePanel.bind(this));
          this.$control.on('keydown.akkordeon', this.keyNavigation.bind(this));
          this.$control.on('focus.akkordeon', this.toggleTabIndex.bind(this));
        }
      }, {
        key: 'removeEvents',
        value: function removeEvents() {
          this.$control.off('click.akkordeon');
          this.$control.off('keydown.akkordeon');
          this.$control.off('focus.akkordeon');
        }
      }]);
      return Control;
    }();
    $.fn.akkordeon = function (opts) {
      return this.each(function () {
        this.akkordeon = new Akkordeon($(this), opts);
      });
    };
  }
};
'use strict';
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var INIT = window.INIT || {};
INIT.plugins = INIT.plugins || {};
INIT.plugins.clickOutside = {
  init: function init() {
    if (!Node.prototype.contains) {
      Node.prototype.contains = function (node) {
        do {
          if (this === node) {
            return true;
          }
        } while (node = node && node.parentNode);
        return false;
      };
    }
    var ClickOutside = function () {
      function ClickOutside(excludes, callback) {
        _classCallCheck(this, ClickOutside);
        this.excludes = excludes instanceof Array ? excludes : [excludes];
        this.callback = callback;
        this.evaluateClick = this.evaluateClick.bind(this);
      }
      _createClass(ClickOutside, [{
        key: 'listen',
        value: function listen(boolean) {
          if (boolean) {
            document.addEventListener('mouseup', this.evaluateClick);
            document.addEventListener('keyup', this.evaluateClick);
          } else {
            document.removeEventListener('mouseup', this.evaluateClick);
            document.removeEventListener('keyup', this.evaluateClick);
          }
        }
      }, {
        key: 'evaluateClick',
        value: function evaluateClick(e) {
          var clickedElement = e.target;
          for (var i = 0; i < this.excludes.length; i++) {
            var excludingElement = this.excludes[i];
            if (clickedElement === excludingElement || excludingElement.contains(clickedElement)) {
              return null;
            }
          }
          return this.callback(); // this.removeListener();
        }
      }]);
      return ClickOutside;
    }();
    window.ClickOutside = ClickOutside;
  }
};
'use strict';
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
/* eslint-disable */
var INIT = window.INIT || {};
INIT.plugins = INIT.plugins || {};
INIT.plugins.dropdown = {
  init: function init() {
    var Dropdown = function () {
      function Dropdown($element, options) {
        _classCallCheck(this, Dropdown);
        this.defaults = {
          controls: '.js-dropdown__control',
          panels: '.js-dropdown__panel',
          selectRadio: 'input[type=\'radio\']',
          selectLink: '.js-dropdown-select-link',
          duration: 400,
          easing: 'swing'
        };
        this.opts = $.extend({}, this.defaults, options);
        this.$dropdown = $element;
        this.$control = this.$dropdown.find(this.opts.controls);
        this.$panel = this.$dropdown.find(this.opts.panels);
        this.selectRadio = this.$dropdown.find(this.opts.selectRadio);
        this.selectLink = this.$dropdown.find(this.opts.selectLink);
        this.expanded = this.$control.attr('aria-expanded') === 'true';
        this.dropdownPanelCssPosition = this.$panel.css('position');
        this.$formSubmitButton = this.$dropdown.closest('form').find('button[type="submit"]');
        this.init();
      }
      _createClass(Dropdown, [{
        key: 'toggleDropdown',
        value: function toggleDropdown() {
          this.$panel.slideToggle(this.opts.duration);
          this.$panel.attr('aria-hidden', this.expanded);
          this.$control.attr('aria-expanded', !this.expanded);
          if (this.dropdownPanelCssPosition === 'absolute' || this.dropdownPanelCssPosition === 'fixed') {
            this.dropdownClickOutside.listen(!this.expanded);
          }
          this.expanded = !this.expanded;
        }
      }, {
        key: 'setSelection',
        value: function setSelection(e) {
          var isIE11 = !!navigator.userAgent.match(/Trident.*rv\:11\./);
          var activeFilter = this.selectRadio.filter(':checked').prev().text();
          this.$dropdown.find('.dropdown__selection').html(activeFilter);
          if (activeFilter) {
            this.$formSubmitButton.prop('disabled', false);
          }
          // Only for real click
          if (isIE11 && e.type === 'click' && e.screenX === 0 && e.screenY === 0) {
            this.toggleDropdown();
          }
          if (!isIE11 && e.type === 'click' && e.clientX !== 0 && e.clientY !== 0) {
            this.toggleDropdown();
          }
        }
      }, {
        key: 'setLinkSelection',
        value: function setLinkSelection(e) {
          var isIE11 = !!navigator.userAgent.match(/Trident.*rv\:11\./);
          var activeFilter = $(event.currentTarget).text();
          this.$dropdown.find('.js-dropdown__control > .link__label').html(activeFilter);
          // Only for real click
          if (isIE11 && e.type === 'click' && e.screenX === 0 && e.screenY === 0) {
            this.toggleDropdown();
          }
          if (!isIE11 && e.type === 'click' && e.clientX !== 0 && e.clientY !== 0) {
            this.toggleDropdown();
          }
        }
      }, {
        key: 'checkIfPreselected',
        value: function checkIfPreselected() {
          this.$dropdown.closest('form').on('keyup keypress', function (e) {
            if ($(this).find('button[type="submit"]').prop('disabled')) {
              var keyCode = e.keyCode || e.which;
              if (keyCode === 13) {
                e.preventDefault();
                return false;
              }
            }
          });
          if (this.selectRadio.filter(':checked').length) {
            this.$formSubmitButton.removeAttr('disabled');
          }
        }
      }, {
        key: 'init',
        value: function init() {
          this.dropdownClickOutside = new ClickOutside(this.$dropdown[0], this.toggleDropdown.bind(this));
          this.$control.on('click', this.toggleDropdown.bind(this));
          this.selectRadio.on('click', this.setSelection.bind(this));
          this.selectLink.on('click', this.setLinkSelection.bind(this));
          this.checkIfPreselected();
        }
      }]);
      return Dropdown;
    }();
    $.fn.dropdown = function (opts) {
      return this.each(function () {
        this.dropdownInstance = new Dropdown($(this), opts);
      });
    };
  }
};
'use strict';
/* eslint-disable */
var INIT = window.INIT || {};
INIT.ie10 = {
  init: function init() {
    if ( /*@cc_on!@*/false && document.documentMode === 10) {
      document.documentElement.className += ' ie10';
    }
  }
};
'use strict';
var INIT = window.INIT || {};
INIT.plugins = INIT.plugins || {};
INIT.plugins.iframe = {
  init: function init() {
    // https://issues.init.de/browse/FPO-648
    var $iframe = $('#itf-iframe');
    if ($iframe.length > 0) {
      $iframe.iFrameResize();
    }
  }
};
'use strict';
var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var INIT = window.INIT || {};
INIT.plugins = INIT.plugins || {};
INIT.plugins.nav = {
  init: function init() {
    var Nav = function () {
      function Nav($element, options) {
        _classCallCheck(this, Nav);
        Nav.count = ++Nav.count || 1;
        this.defaults = {
          navList: '.header-nav__list',
          controls: '.header-nav__button',
          panels: '.header-nav__panel',
          closePanelButton: '.button--close-level-2',
          mobileContainer: '.header__navs',
          activeClassControl: 'active',
          activeClassPanel: 'active',
          controlsId: 'nav-tab',
          panelsId: 'nav-panel',
          transitionLevelClass: 'level-2',
          closePanelOn: false
        };
        this.opts = this.getOptions(options);
        this.$container = $element;
        this.$navList = this.$container.find(this.opts.navList);
        this.$controls = this.$container.find(this.opts.controls);
        this.$panels = this.$container.find(this.opts.panels);
        this.$closePanelButtons = this.$container.find(this.opts.closePanelButton);
        this.$mobileContainer = $(this.opts.mobileContainer);
        this.$firstControl = this.$controls.first();
        this.$lastControl = this.$controls.last();
        this.$activeControl = false;
        this.$header = $('.header');
        this.init();
      }
      _createClass(Nav, [{
        key: 'getOptions',
        value: function getOptions(options) {
          return (typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object' ? $.extend({}, this.defaults, options) : this.defaults;
        }
        // use data jquery
      }, {
        key: 'getPrevControl',
        value: function getPrevControl($control) {
          var index = this.$controls.index($control);
          return this.$controls.eq(index - 1);
        }
        // use data jquery
      }, {
        key: 'getNextControl',
        value: function getNextControl($control) {
          var index = this.$controls.index($control);
          return $control.is(this.$lastControl) ? this.$firstControl : this.$controls.eq(index + 1);
        }
      }, {
        key: 'addAccessibility',
        value: function addAccessibility() {
          var that = this;
          this.$navList.attr({
            'role': 'tablist'
          });
          this.$controls.each(function (index) {
            var suffix = '-' + Nav.count + '-' + (index + 1);
            var controlId = that.opts.controlsId + suffix;
            var panelId = that.opts.panelsId + suffix;
            $(this)[0].id = $(this)[0].id || controlId;
            $(this).data('panel')[0].id = $(this).data('panel')[0].id || panelId;
            $(this).attr({
              'role': 'tab',
              'aria-controls': $(this).data('panel')[0].id,
              'aria-selected': false,
              'aria-expanded': false
            });
            $(this).data('panel').attr({
              'role': 'tabpanel',
              'aria-labelledby': $(this)[0].id,
              'aria-hidden': true
            });
          });
        }
      }, {
        key: 'init',
        value: function init() {
          var that = this;
          this.$controls.each(function (index) {
            $(this).data('panel', that.$panels.eq(index));
          });
          this.addAccessibility();
          this.addEvents();
          if (this.opts.closePanelOn) {
            this.$header.on(this.opts.closePanelOn, function () {
              if (that.$activeControl) {
                that.handlePanel(that.$activeControl);
              }
            });
          }
        }
      }, {
        key: 'closeActivePanel',
        value: function closeActivePanel() {
          this.hidePanel(this.$activeControl);
          this.$activeControl = false;
        }
      }, {
        key: 'changeActivePanel',
        value: function changeActivePanel() {
          this.hidePanel(this.$activeControl);
          this.showPanel(this.$clickedControl);
          this.$activeControl = this.$clickedControl;
        }
      }, {
        key: 'openPanel',
        value: function openPanel() {
          this.showPanel(this.$clickedControl);
          this.$activeControl = this.$clickedControl;
        }
      }, {
        key: 'handlePanel',
        value: function handlePanel($clickedControl) {
          this.$clickedControl = $clickedControl;
          // if clicked on active
          if (this.$activeControl && this.$clickedControl.is(this.$activeControl)) {
            this.closeActivePanel();
            // if clicked on other than active
          } else if (this.$activeControl) {
            this.changeActivePanel();
            // if clicked on non-active
          } else if (!this.$activeControl) {
            this.openPanel();
          }
        }
      }, {
        key: 'hidePanel',
        value: function hidePanel($control) {
          $control.removeClass(this.opts.activeClassControl).attr({
            'aria-expanded': false,
            'aria-selected': false
          }).data('panel').attr('aria-hidden', true).removeClass(this.opts.activeClassPanel);
          this.$mobileContainer.removeClass(this.opts.transitionLevelClass);
        }
      }, {
        key: 'showPanel',
        value: function showPanel($control) {
          var that = this;
          this.$panels.removeClass('active-mobile');
          $control.addClass(this.opts.activeClassControl).attr({
            'aria-expanded': true,
            'aria-selected': true
          }).data('panel').addClass(this.opts.activeClassPanel).addClass('active-mobile').attr('aria-hidden', false);
          this.$mobileContainer.addClass(this.opts.transitionLevelClass);
          if (this.opts.openedClass) {
            this.$mobileContainer.addClass(this.opts.openedClass);
          }
        }
      }, {
        key: 'toggleAriaSelected',
        value: function toggleAriaSelected($clickedControl, event) {
          this.$controls.attr({
            'aria-selected': false
          });
          $clickedControl.attr({
            'aria-selected': true
          });
        }
      }, {
        key: 'keyNavigation',
        value: function keyNavigation($keyControl, event) {
          switch (event.keyCode) {
            case 13: // enter
            case 32:
              // space
              event.preventDefault();
              this.handlePanel.call(this, $keyControl);
              break;
            case 35:
              // end
              event.preventDefault();
              this.$lastControl.focus();
              break;
            case 36:
              // home
              event.preventDefault();
              this.$firstControl.focus();
              break;
            case 37: // left
            case 38:
              // up
              event.preventDefault();
              this.getPrevControl($keyControl).focus();
              break;
            case 39: // right
            case 40:
              // down
              event.preventDefault();
              this.getNextControl($keyControl).focus();
              break;
          }
        }
      }, {
        key: 'addEvents',
        value: function addEvents() {
          var that = this;
          this.$controls.each(function () {
            $(this).off('click.nav').on('click.nav', that.handlePanel.bind(that, $(this)));
            $(this).off('keydown.nav').on('keydown.nav', that.keyNavigation.bind(that, $(this)));
            $(this).off('focus.nav').on('focus.nav', that.toggleAriaSelected.bind(that, $(this)));
          });
          this.$closePanelButtons.each(function () {
            $(this).on('click', function () {
              that.handlePanel(that.$activeControl);
            });
          });
        }
      }]);
      return Nav;
    }();
    $.fn.nav = function (opts) {
      return this.each(function () {
        this.nav = new Nav($(this), opts);
      });
    };
    var MainNav = function (_Nav) {
      _inherits(MainNav, _Nav);
      function MainNav($element, options) {
        _classCallCheck(this, MainNav);
        var _this = _possibleConstructorReturn(this, (MainNav.__proto__ || Object.getPrototypeOf(MainNav)).call(this, $element, options));
        _this.$body = $('body');
        _this.$header = $('.header');
        // include in config?
        _this.$burger = $('.burger');
        _this.burgerNavIsActive = false;
        _this.burgerNavActiveClass = 'burger-nav-active';
        _this.initBurger();
        return _this;
      }
      _createClass(MainNav, [{
        key: 'initBurger',
        value: function initBurger() {
          var that = this;
          var excludes = [$('.header-nav')[0], $('.burger')[0], $('.meta-nav__item--language')[0]];
          var clickOutsideBurger = new ClickOutside(excludes, function () {
            that.closeBurgerNav(true);
          });
          this.clickOutsideBurger = clickOutsideBurger;
          this.$burger.on('click', function () {
            that.burgerNavIsActive ? that.closeBurgerNav(true) : that.openBurgerNav();
          });
        }
      }, {
        key: 'openPanel',
        value: function openPanel() {
          if (!this.burgerNavIsActive) {
            this.openBurgerNav();
          }
          _get(MainNav.prototype.__proto__ || Object.getPrototypeOf(MainNav.prototype), 'openPanel', this).call(this);
        }
      }, {
        key: 'closeActivePanel',
        value: function closeActivePanel() {
          if (INIT.helpers.viewportIsDesktop() && this.burgerNavIsActive) {
            this.closeBurgerNav(false);
          }
          _get(MainNav.prototype.__proto__ || Object.getPrototypeOf(MainNav.prototype), 'closeActivePanel', this).call(this);
        }
      }, {
        key: 'openBurgerNav',
        value: function openBurgerNav() {
          INIT.noScroll.addNoScrollClass();
          this.$body.addClass(this.burgerNavActiveClass);
          this.burgerNavIsActive = true;
          this.clickOutsideBurger.listen(true);
          this.$burger.attr('aria-expanded', true);
          // $(window).one('resize', function () {
          //   if (INIT.helpers.viewportIsMobile()) {
          //     closeBurgerNav();
          //   }
          // });
        }
      }, {
        key: 'closeBurgerNav',
        value: function closeBurgerNav(deepClosing) {
          INIT.noScroll.removeNoScrollClass();
          this.$body.removeClass(this.burgerNavActiveClass);
          this.burgerNavIsActive = false;
          this.clickOutsideBurger.listen(false);
          this.$burger.attr('aria-expanded', false);
          // check for (active) in the opnening and closing instead?
          if (deepClosing && this.$activeControl) {
            this.closeActivePanel();
          }
        }
      }, {
        key: 'hidePanel',
        value: function hidePanel($control) {
          _get(MainNav.prototype.__proto__ || Object.getPrototypeOf(MainNav.prototype), 'hidePanel', this).call(this, $control);
          // trigger close of level 2 in order to close level 3 when active panel changes
          this.$header.trigger('closing-level-2');
        }
      }]);
      return MainNav;
    }(Nav);
    $.fn.mainNav = function (opts) {
      return this.each(function () {
        this.mainNav = new MainNav($(this), opts);
      });
    };
  }
};
'use strict';
/* eslint-disable */
var INIT = window.INIT || {};
INIT.printView = {
  init: function init() {
    $('.js-print-button').on('click', function () {
      if (INIT.helpers.browserIsIE()) {
        var OLECMDID = 7;
        var PROMPT = 1;
        var WebBrowser = '<OBJECT ID="WebBrowser1" WIDTH=0 HEIGHT=0 CLASSID="CLSID:8856F961-340A-11D0-A96B-00C04FD705A2"></OBJECT>';
        document.body.insertAdjacentHTML('beforeEnd', WebBrowser);
        WebBrowser1.ExecWB(OLECMDID, PROMPT);
        WebBrowser1.outerHTML = "";
      } else {
        window.print();
      }
    });
  }
};
'use strict';
var INIT = window.INIT || {};
INIT.scrollTo = {
  init: function init() {
    var $htmlBody = $('html, body');
    var isMS = navigator.userAgent.indexOf('MSIE') > -1 || navigator.userAgent.indexOf('Edge') > -1; // eslint-disable-line
    var headerOffset = $('.header__wrapper').height();
    var scrollTo = function scrollTo(hash) {
      var target = $(hash);
      if (target.length) {
        $htmlBody.animate({
          scrollTop: target.offset().top - headerOffset
        }, 0);
      }
    };
    if (window.location.hash) {
      if (isMS) {
        setTimeout(function () {
          scrollTo(window.location.hash);
        }, 200);
      } else {
        scrollTo(window.location.hash);
      }
    }
    if (isMS) {
      window.onpopstate = function (event) {
        if (!window.location.hash.length) {
          window.scrollTo(0, 0);
        }
      };
    }
    $('.rte-container a').click(function () {
      var target = $(this).attr('href');
      $htmlBody.animate({
        scrollTop: $(target).offset().top - headerOffset + 60
      }, 200);
    });
  }
};
'use strict';
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
var INIT = window.INIT || {};
INIT.plugins = INIT.plugins || {};
INIT.plugins.tabs = {
  init: function init() {
    function Tabs($element, options) {
      Tabs.count = ++Tabs.count || 1;
      this.defaults = {
        tablist: '.tabs__tablist',
        controls: '.tabs__control',
        panels: '.tabs__panel',
        activeClassControl: 'tabs__control--active',
        activeClassPanel: 'tabs__panel--active',
        controlsId: 'tab',
        panelsId: 'tabpanel'
      };
      this.opts = this.getOptions(options);
      this.$container = $element;
      this.$tablist = this.$container.find(this.opts.tablist);
      this.$controls = this.$container.find(this.opts.controls);
      this.$panels = this.$container.find(this.opts.panels);
      this.$firstControl = this.$controls.first();
      this.$lastControl = this.$controls.last();
      this.$activeControl = this.$container.find('.' + this.opts.activeClassControl);
      this.init();
    }
    Tabs.prototype = {
      getOptions: function getOptions(options) {
        return (typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object' ? $.extend({}, this.defaults, options) : this.defaults;
      },
      // use data jquery
      getPrevControl: function getPrevControl($control) {
        var index = this.$controls.index($control);
        return this.$controls.eq(index - 1);
      },
      // use data jquery
      getNextControl: function getNextControl($control) {
        var index = this.$controls.index($control);
        return $control.is(this.$lastControl) ? this.$firstControl : this.$controls.eq(index + 1);
      },
      addAccessibility: function addAccessibility() {
        var that = this;
        this.$tablist.attr({
          'role': 'tablist'
        });
        this.$controls.each(function (index) {
          var suffix = '-' + Tabs.count + '-' + (index + 1);
          var controlId = that.opts.controlsId + suffix;
          var panelId = that.opts.panelsId + suffix;
          $(this)[0].id = $(this)[0].id || controlId;
          $(this).data('panel')[0].id = $(this).data('panel')[0].id || panelId;
          $(this).attr({
            'role': 'tab',
            'aria-controls': $(this).data('panel')[0].id,
            'tabindex': -1,
            'aria-selected': false,
            'aria-expanded': false
          });
          $(this).data('panel').attr({
            'role': 'tabpanel',
            'aria-labelledby': $(this)[0].id,
            'aria-hidden': true
          });
        });
        this.$activeControl.attr({
          'tabindex': 0,
          'aria-selected': true,
          'aria-expanded': true
        }).data('panel').attr({
          'aria-hidden': false
        });
      },
      init: function init() {
        var that = this;
        this.$controls.each(function (index) {
          $(this).data('panel', that.$panels.eq(index));
        });
        this.addAccessibility();
        this.addEvents();
      },
      changePanel: function changePanel($clickedControl) {
        if (!$clickedControl.is(this.$activeControl)) {
          this.hidePanel(this.$activeControl);
          this.showPanel($clickedControl);
          this.$activeControl = $clickedControl;
        }
      },
      hidePanel: function hidePanel($control) {
        $control.removeClass(this.opts.activeClassControl).attr({
          'aria-expanded': false,
          'aria-selected': false,
          'tabindex': -1
        }).data('panel').removeClass(this.opts.activeClassPanel).attr('aria-hidden', true);
      },
      showPanel: function showPanel($control) {
        $control.focus().addClass(this.opts.activeClassControl).attr({
          'aria-expanded': true,
          'aria-selected': true,
          'tabindex': 0
        }).data('panel').addClass(this.opts.activeClassPanel).attr('aria-hidden', false);
      },
      keyNavigation: function keyNavigation($keyControl, event) {
        switch (event.keyCode) {
          case 35:
            // end
            event.preventDefault();
            this.changePanel(this.$lastControl);
            break;
          case 36:
            // home
            event.preventDefault();
            this.changePanel(this.$firstControl);
            break;
          case 37: // left
          case 38:
            // up
            event.preventDefault();
            this.changePanel(this.getPrevControl($keyControl));
            break;
          case 39: // right
          case 40:
            // down
            event.preventDefault();
            this.changePanel(this.getNextControl($keyControl));
            break;
        }
      },
      addEvents: function addEvents() {
        var that = this;
        this.$controls.each(function () {
          $(this).off('click.tabs').on('click.tabs', that.changePanel.bind(that, $(this)));
          $(this).off('keydown.tabs').on('keydown.tabs', that.keyNavigation.bind(that, $(this)));
        });
      }
    };
    $.fn.tabs = function (opts) {
      return this.each(function () {
        this.tabs = new Tabs($(this), opts);
      });
    };
  }
};
'use strict';
var INIT = window.INIT || {};
INIT.autocomplete = {
  init: function init() {
    var $searchHeader = $('.js-header-search');
    var $searchMainstage = $('.search-input-autosuggest');
    var mainSetup = {
      minChars: 4,
      noCache: true,
      deferRequestBy: 100,
      triggerSelectOnValidInput: false,
      maxHeight: false,
      width: false,
      groupBy: 'category',
      paramName: 'query',
      dataType: 'json',
      transformResult: function transformResult(response) {
        // empty previous renderings to avoid dead links
        $('.header__search-result_container').empty();
        var suggestionsArray = $.map(response.suggestions, function (key) {
          return {
            value: key.label,
            data: {
              title: key.value
            }
          };
        });
        var spellcheckArray = $.map(response.spellcheck, function (key) {
          return {
            value: key.value,
            data: {
              category: response.labels.spellcheck,
              title: key.value
            }
          };
        });
        var keywordSuggestionsArray = $.map(response.keywordSuggestions, function (key) {
          return {
            value: key.value,
            data: {
              category: response.labels.keywordSuggestions,
              title: key.value
            }
          };
        });
        var recommendationsArray = $.map(response.recommendations, function (key) {
          return {
            value: key.value,
            data: {
              category: response.labels.recommendations,
              url: key.url,
              icon: key.icon
            }
          };
        });
        var dataArray = [];
        dataArray = dataArray.concat(suggestionsArray, spellcheckArray, keywordSuggestionsArray, recommendationsArray);
        return {
          suggestions: dataArray
        };
      },
      beforeRender: function beforeRender(container) {
        $(container).css('position', 'relative');
      },
      formatGroup: function formatGroup(suggestion, category) {
        var formatGroup = category ? '<div class="autocomplete-group"> <span class="autocomplete-title">' + category + '</span> </div>' : false;
        return formatGroup;
      },
      formatResult: function formatResult(suggestion, currentValue) {
        currentValue = currentValue.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); // eslint-disable-line
        var re = new RegExp('(' + currentValue.split(' ').join('|') + ')', 'gi');
        var newValue = suggestion.value.replace(re, '<b>$1</b>');
        if (suggestion.data.icon && suggestion.data.url) {
          return '<svg class="icon" viewBox="0 0 28 28" width="28px" height="28px"><use xlink:href="#' + suggestion.data.icon + '" /></svg> <a href="' + suggestion.data.url + '">' + newValue + '</a>';
        } else if (suggestion.data.url) {
          return '<a href="' + suggestion.data.url + '">' + newValue + '</a>';
        }
        return newValue;
      },
      onSelect: function onSelect(suggestion) {
        if (suggestion.data.title) {
          this.value = suggestion.data.title;
          $(this).closest('form').submit();
        } else if (suggestion.data.url) {
          location.href = suggestion.data.url;
        }
      }
    };
    $searchHeader.each(function () {
      var searchHeaderSetup = {
        serviceUrl: $searchHeader.data('url'),
        appendTo: '.header__search-result_row',
        containerClass: 'header__search-result_container'
      };
      searchHeaderSetup = $.extend({}, mainSetup, searchHeaderSetup);
      $(this).autocomplete(searchHeaderSetup);
    });
    $searchMainstage.each(function () {
      var appendTo = $('#main-search-panel-1-1').find('.input-group__suggestions');
      var searchMainstageSetup = {
        serviceUrl: $searchMainstage.data('url'),
        appendTo: appendTo,
        containerClass: 'input-group__suggestions-container'
      };
      searchMainstageSetup = $.extend({}, mainSetup, searchMainstageSetup);
      $(this).autocomplete(searchMainstageSetup);
    });
  }
};
"use strict";
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
/**
 *  Ajax Autocomplete for jQuery, version 1.4.7
 *  (c) 2017 Tomas Kirda
 *
 *  Ajax Autocomplete for jQuery is freely distributable under the terms of an MIT-style license.
 *  For details, see the web site: https://github.com/devbridge/jQuery-Autocomplete
 */
!function (a) {
  "use strict";
  "function" == typeof define && define.amd ? define(["jquery"], a) : a("object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) && "function" == typeof require ? require("jquery") : jQuery);
}(function (a) {
  "use strict";
  function b(c, d) {
    var e = this;
    e.element = c, e.el = a(c), e.suggestions = [], e.badQueries = [], e.selectedIndex = -1, e.currentValue = e.element.value, e.timeoutId = null, e.cachedResponse = {}, e.onChangeTimeout = null, e.onChange = null, e.isLocal = !1, e.suggestionsContainer = null, e.noSuggestionsContainer = null, e.options = a.extend({}, b.defaults, d), e.classes = {
      selected: "autocomplete-selected",
      suggestion: "autocomplete-suggestion"
    }, e.hint = null, e.hintValue = "", e.selection = null, e.initialize(), e.setOptions(d);
  }
  function c(a, b, c) {
    return a.value.toLowerCase().indexOf(c) !== -1;
  }
  function d(b) {
    return "string" == typeof b ? a.parseJSON(b) : b;
  }
  function e(a, b) {
    if (!b) return a.value;
    var c = "(" + g.escapeRegExChars(b) + ")";
    return a.value.replace(new RegExp(c, "gi"), "<strong>$1</strong>").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/&lt;(\/?strong)&gt;/g, "<$1>");
  }
  function f(a, b) {
    return '<div class="autocomplete-group">' + b + "</div>";
  }
  var g = function () {
    return {
      escapeRegExChars: function escapeRegExChars(a) {
        return a.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
      },
      createNode: function createNode(a) {
        var b = document.createElement("div");
        return b.className = a, b.style.position = "absolute", b.style.display = "none", b;
      }
    };
  }(),
      h = { ESC: 27, TAB: 9, RETURN: 13, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 },
      i = a.noop;
  b.utils = g, a.Autocomplete = b, b.defaults = {
    ajaxSettings: {},
    autoSelectFirst: !1,
    appendTo: "body",
    serviceUrl: null,
    lookup: null,
    onSelect: null,
    width: "auto",
    minChars: 1,
    maxHeight: 300,
    deferRequestBy: 0,
    params: {},
    formatResult: e,
    formatGroup: f,
    delimiter: null,
    zIndex: 9999,
    type: "GET",
    noCache: !1,
    onSearchStart: i,
    onSearchComplete: i,
    onSearchError: i,
    preserveInput: !1,
    containerClass: "autocomplete-suggestions",
    tabDisabled: !1,
    dataType: "text",
    currentRequest: null,
    triggerSelectOnValidInput: !0,
    preventBadQueries: !0,
    lookupFilter: c,
    paramName: "query",
    transformResult: d,
    showNoSuggestionNotice: !1,
    noSuggestionNotice: "No results",
    orientation: "bottom",
    forceFixPosition: !1
  }, b.prototype = {
    initialize: function initialize() {
      var c,
          d = this,
          e = "." + d.classes.suggestion,
          f = d.classes.selected,
          g = d.options;
      d.element.setAttribute("autocomplete", "off"), d.noSuggestionsContainer = a('<div class="autocomplete-no-suggestion"></div>').html(this.options.noSuggestionNotice).get(0), d.suggestionsContainer = b.utils.createNode(g.containerClass), c = a(d.suggestionsContainer), c.appendTo(g.appendTo || "body"), "auto" !== g.width && c.css("width", g.width), c.on("mouseover.autocomplete", e, function () {
        d.activate(a(this).data("index"));
      }), c.on("mouseout.autocomplete", function () {
        d.selectedIndex = -1, c.children("." + f).removeClass(f);
      }), c.on("click.autocomplete", e, function () {
        d.select(a(this).data("index"));
      }), c.on("click.autocomplete", function () {
        clearTimeout(d.blurTimeoutId);
      }), d.fixPositionCapture = function () {
        d.visible && d.fixPosition();
      }, a(window).on("resize.autocomplete", d.fixPositionCapture), d.el.on("keydown.autocomplete", function (a) {
        d.onKeyPress(a);
      }), d.el.on("keyup.autocomplete", function (a) {
        d.onKeyUp(a);
      }), d.el.on("blur.autocomplete", function () {
        d.onBlur();
      }), d.el.on("focus.autocomplete", function () {
        d.onFocus();
      }), d.el.on("change.autocomplete", function (a) {
        d.onKeyUp(a);
      }), d.el.on("input.autocomplete", function (a) {
        d.onKeyUp(a);
      });
    },
    onFocus: function onFocus() {
      var a = this;
      a.fixPosition(), a.el.val().length >= a.options.minChars && a.onValueChange();
    },
    onBlur: function onBlur() {
      var a = this;
      a.blurTimeoutId = setTimeout(function () {
        //a.hide(); //FPO-539
      }, 200);
    },
    abortAjax: function abortAjax() {
      var a = this;
      a.currentRequest && (a.currentRequest.abort(), a.currentRequest = null);
    },
    setOptions: function setOptions(b) {
      var c = this,
          d = a.extend({}, c.options, b);
      c.isLocal = Array.isArray(d.lookup), c.isLocal && (d.lookup = c.verifySuggestionsFormat(d.lookup)), d.orientation = c.validateOrientation(d.orientation, "bottom"), a(c.suggestionsContainer).css({
        "max-height": d.maxHeight + "px",
        width: d.width + "px",
        "z-index": d.zIndex
      }), this.options = d;
    },
    clearCache: function clearCache() {
      this.cachedResponse = {}, this.badQueries = [];
    },
    clear: function clear() {
      this.clearCache(), this.currentValue = "", this.suggestions = [];
    },
    disable: function disable() {
      var a = this;
      a.disabled = !0, clearTimeout(a.onChangeTimeout), a.abortAjax();
    },
    enable: function enable() {
      this.disabled = !1;
    },
    fixPosition: function fixPosition() {
      var b = this,
          c = a(b.suggestionsContainer),
          d = c.parent().get(0);
      if (d === document.body || b.options.forceFixPosition) {
        var e = b.options.orientation,
            f = c.outerHeight(),
            g = b.el.outerHeight(),
            h = b.el.offset(),
            i = { top: h.top, left: h.left };
        if ("auto" === e) {
          var j = a(window).height(),
              k = a(window).scrollTop(),
              l = -k + h.top - f,
              m = k + j - (h.top + g + f);
          e = Math.max(l, m) === l ? "top" : "bottom";
        }
        if ("top" === e ? i.top += -f : i.top += g, d !== document.body) {
          var n,
              o = c.css("opacity");
          b.visible || c.css("opacity", 0).show(), n = c.offsetParent().offset(), i.top -= n.top, i.top += d.scrollTop, i.left -= n.left, b.visible || c.css("opacity", o).hide();
        }
        "auto" === b.options.width && (i.width = b.el.outerWidth() + "px"), c.css(i);
      }
    },
    isCursorAtEnd: function isCursorAtEnd() {
      var a,
          b = this,
          c = b.el.val().length,
          d = b.element.selectionStart;
      return "number" == typeof d ? d === c : !document.selection || (a = document.selection.createRange(), a.moveStart("character", -c), c === a.text.length);
    },
    onKeyPress: function onKeyPress(a) {
      var b = this;
      if (!b.disabled && !b.visible && a.which === h.DOWN && b.currentValue) return void b.suggest();
      if (!b.disabled && b.visible) {
        switch (a.which) {
          case h.ESC:
            b.el.val(b.currentValue), b.hide();
            break;
          case h.RIGHT:
            if (b.hint && b.options.onHint && b.isCursorAtEnd()) {
              b.selectHint();
              break;
            }
            return;
          case h.TAB:
            if (b.hint && b.options.onHint) return void b.selectHint();
            if (b.selectedIndex === -1) return void b.hide();
            if (b.select(b.selectedIndex), b.options.tabDisabled === !1) return;
            break;
          case h.RETURN:
            if (b.selectedIndex === -1) return void b.hide();
            b.select(b.selectedIndex);
            break;
          case h.UP:
            b.moveUp();
            break;
          case h.DOWN:
            b.moveDown();
            break;
          default:
            return;
        }
        a.stopImmediatePropagation(), a.preventDefault();
      }
    },
    onKeyUp: function onKeyUp(a) {
      var b = this;
      if (!b.disabled) {
        switch (a.which) {
          case h.UP:
          case h.DOWN:
            return;
        }
        clearTimeout(b.onChangeTimeout), b.currentValue !== b.el.val() && (b.findBestHint(), b.options.deferRequestBy > 0 ? b.onChangeTimeout = setTimeout(function () {
          b.onValueChange();
        }, b.options.deferRequestBy) : b.onValueChange());
      }
    },
    onValueChange: function onValueChange() {
      if (this.ignoreValueChange) return void (this.ignoreValueChange = !1);
      var b = this,
          c = b.options,
          d = b.el.val(),
          e = b.getQuery(d);
      return b.selection && b.currentValue !== e && (b.selection = null, (c.onInvalidateSelection || a.noop).call(b.element)), clearTimeout(b.onChangeTimeout), b.currentValue = d, b.selectedIndex = -1, c.triggerSelectOnValidInput && b.isExactMatch(e) ? void b.select(0) : void (e.length < c.minChars ? b.hide() : b.getSuggestions(e));
    },
    isExactMatch: function isExactMatch(a) {
      var b = this.suggestions;
      return 1 === b.length && b[0].value.toLowerCase() === a.toLowerCase();
    },
    getQuery: function getQuery(b) {
      var c,
          d = this.options.delimiter;
      return d ? (c = b.split(d), a.trim(c[c.length - 1])) : b;
    },
    getSuggestionsLocal: function getSuggestionsLocal(b) {
      var c,
          d = this,
          e = d.options,
          f = b.toLowerCase(),
          g = e.lookupFilter,
          h = parseInt(e.lookupLimit, 10);
      return c = {
        suggestions: a.grep(e.lookup, function (a) {
          return g(a, b, f);
        })
      }, h && c.suggestions.length > h && (c.suggestions = c.suggestions.slice(0, h)), c;
    },
    getSuggestions: function getSuggestions(b) {
      var c,
          d,
          e,
          f,
          g = this,
          h = g.options,
          i = h.serviceUrl;
      if (h.params[h.paramName] = b, h.onSearchStart.call(g.element, h.params) !== !1) {
        if (d = h.ignoreParams ? null : h.params, a.isFunction(h.lookup)) return void h.lookup(b, function (a) {
          g.suggestions = a.suggestions, g.suggest(), h.onSearchComplete.call(g.element, b, a.suggestions);
        });
        g.isLocal ? c = g.getSuggestionsLocal(b) : (a.isFunction(i) && (i = i.call(g.element, b)), e = i + "?" + a.param(d || {}), c = g.cachedResponse[e]), c && Array.isArray(c.suggestions) ? (g.suggestions = c.suggestions, g.suggest(), h.onSearchComplete.call(g.element, b, c.suggestions)) : g.isBadQuery(b) ? h.onSearchComplete.call(g.element, b, []) : (g.abortAjax(), f = { url: i, data: d, type: h.type, dataType: h.dataType }, a.extend(f, h.ajaxSettings), g.currentRequest = a.ajax(f).done(function (a) {
          var c;
          g.currentRequest = null, c = h.transformResult(a, b), g.processResponse(c, b, e), h.onSearchComplete.call(g.element, b, c.suggestions);
        }).fail(function (a, c, d) {
          h.onSearchError.call(g.element, b, a, c, d);
        }));
      }
    },
    isBadQuery: function isBadQuery(a) {
      if (!this.options.preventBadQueries) return !1;
      for (var b = this.badQueries, c = b.length; c--;) {
        if (0 === a.indexOf(b[c])) return !0;
      }return !1;
    },
    hide: function hide() {
      var b = this,
          c = a(b.suggestionsContainer);
      a.isFunction(b.options.onHide) && b.visible && b.options.onHide.call(b.element, c), b.visible = !1, b.selectedIndex = -1, clearTimeout(b.onChangeTimeout), a(b.suggestionsContainer).hide(), b.signalHint(null);
    },
    suggest: function suggest() {
      if (!this.suggestions.length) return void (this.options.showNoSuggestionNotice ? this.noSuggestions() : this.hide());
      var b,
          c = this,
          d = c.options,
          e = d.groupBy,
          f = d.formatResult,
          g = c.getQuery(c.currentValue),
          h = c.classes.suggestion,
          i = c.classes.selected,
          j = a(c.suggestionsContainer),
          k = a(c.noSuggestionsContainer),
          l = d.beforeRender,
          m = "",
          n = function n(a, c) {
        var f = a.data[e];
        return b === f ? "" : (b = f, d.formatGroup(a, b));
      };
      return d.triggerSelectOnValidInput && c.isExactMatch(g) ? void c.select(0) : (a.each(c.suggestions, function (a, b) {
        e && (m += n(b, g, a)), m += '<div class="' + h + '" data-index="' + a + '">' + f(b, g, a) + "</div>";
      }), this.adjustContainerWidth(), k.detach(), j.html(m), a.isFunction(l) && l.call(c.element, j, c.suggestions), c.fixPosition(), j.show(), d.autoSelectFirst && (c.selectedIndex = 0, j.scrollTop(0), j.children("." + h).first().addClass(i)), c.visible = !0, void c.findBestHint());
    },
    noSuggestions: function noSuggestions() {
      var b = this,
          c = b.options.beforeRender,
          d = a(b.suggestionsContainer),
          e = a(b.noSuggestionsContainer);
      this.adjustContainerWidth(), e.detach(), d.empty(), d.append(e), a.isFunction(c) && c.call(b.element, d, b.suggestions), b.fixPosition(), d.show(), b.visible = !0;
    },
    adjustContainerWidth: function adjustContainerWidth() {
      var b,
          c = this,
          d = c.options,
          e = a(c.suggestionsContainer);
      "auto" === d.width ? (b = c.el.outerWidth(), e.css("width", b > 0 ? b : 300)) : "flex" === d.width && e.css("width", "");
    },
    findBestHint: function findBestHint() {
      var b = this,
          c = b.el.val().toLowerCase(),
          d = null;
      c && (a.each(b.suggestions, function (a, b) {
        var e = 0 === b.value.toLowerCase().indexOf(c);
        return e && (d = b), !e;
      }), b.signalHint(d));
    },
    signalHint: function signalHint(b) {
      var c = "",
          d = this;
      b && (c = d.currentValue + b.value.substr(d.currentValue.length)), d.hintValue !== c && (d.hintValue = c, d.hint = b, (this.options.onHint || a.noop)(c));
    },
    verifySuggestionsFormat: function verifySuggestionsFormat(b) {
      return b.length && "string" == typeof b[0] ? a.map(b, function (a) {
        return { value: a, data: null };
      }) : b;
    },
    validateOrientation: function validateOrientation(b, c) {
      return b = a.trim(b || "").toLowerCase(), a.inArray(b, ["auto", "bottom", "top"]) === -1 && (b = c), b;
    },
    processResponse: function processResponse(a, b, c) {
      var d = this,
          e = d.options;
      a.suggestions = d.verifySuggestionsFormat(a.suggestions), e.noCache || (d.cachedResponse[c] = a, e.preventBadQueries && !a.suggestions.length && d.badQueries.push(b)), b === d.getQuery(d.currentValue) && (d.suggestions = a.suggestions, d.suggest());
    },
    activate: function activate(b) {
      var c,
          d = this,
          e = d.classes.selected,
          f = a(d.suggestionsContainer),
          g = f.find("." + d.classes.suggestion);
      return f.find("." + e).removeClass(e), d.selectedIndex = b, d.selectedIndex !== -1 && g.length > d.selectedIndex ? (c = g.get(d.selectedIndex), a(c).addClass(e), c) : null;
    },
    selectHint: function selectHint() {
      var b = this,
          c = a.inArray(b.hint, b.suggestions);
      b.select(c);
    },
    select: function select(a) {
      var b = this;
      b.hide(), b.onSelect(a);
    },
    moveUp: function moveUp() {
      var b = this;
      if (b.selectedIndex !== -1) return 0 === b.selectedIndex ? (a(b.suggestionsContainer).children("." + b.classes.suggestion).first().removeClass(b.classes.selected), b.selectedIndex = -1, b.ignoreValueChange = !1, b.el.val(b.currentValue), void b.findBestHint()) : void b.adjustScroll(b.selectedIndex - 1);
    },
    moveDown: function moveDown() {
      var a = this;
      a.selectedIndex !== a.suggestions.length - 1 && a.adjustScroll(a.selectedIndex + 1);
    },
    adjustScroll: function adjustScroll(b) {
      var c = this,
          d = c.activate(b);
      if (d) {
        var e,
            f,
            g,
            h = a(d).outerHeight();
        e = d.offsetTop, f = a(c.suggestionsContainer).scrollTop(), g = f + c.options.maxHeight - h, e < f ? a(c.suggestionsContainer).scrollTop(e) : e > g && a(c.suggestionsContainer).scrollTop(e - c.options.maxHeight + h), c.options.preserveInput || (c.ignoreValueChange = !0, c.el.val(c.getValue(c.suggestions[b].value))), c.signalHint(null);
      }
    },
    onSelect: function onSelect(b) {
      var c = this,
          d = c.options.onSelect,
          e = c.suggestions[b];
      c.currentValue = c.getValue(e.value), c.currentValue === c.el.val() || c.options.preserveInput || c.el.val(c.currentValue), c.signalHint(null), c.suggestions = [], c.selection = e, a.isFunction(d) && d.call(c.element, e);
    },
    getValue: function getValue(a) {
      var b,
          c,
          d = this,
          e = d.options.delimiter;
      return e ? (b = d.currentValue, c = b.split(e), 1 === c.length ? a : b.substr(0, b.length - c[c.length - 1].length) + a) : a;
    },
    dispose: function dispose() {
      var b = this;
      b.el.off(".autocomplete").removeData("autocomplete"), a(window).off("resize.autocomplete", b.fixPositionCapture), a(b.suggestionsContainer).remove();
    }
  }, a.fn.devbridgeAutocomplete = function (c, d) {
    var e = "autocomplete";
    return arguments.length ? this.each(function () {
      var f = a(this),
          g = f.data(e);
      "string" == typeof c ? g && "function" == typeof g[c] && g[c](d) : (g && g.dispose && g.dispose(), g = new b(this, c), f.data(e, g));
    }) : this.first().data(e);
  }, a.fn.autocomplete || (a.fn.autocomplete = a.fn.devbridgeAutocomplete);
});
'use strict';
var INIT = window.INIT || {};
INIT.nav = {
  init: function init() {
    $('.header-nav').mainNav({
      navList: '.header-nav__list',
      controls: '.header-nav__button',
      panels: '.header-nav__panel',
      mobileContainer: '.header__navs',
      closePanelButton: '.button--close-level-2',
      activeClassControl: 'active',
      activeClassPanel: 'active',
      transitionLevelClass: 'level-2',
      openedClass: 'opened'
    });
    $('.list--benefits').nav({
      navList: '.list__ul',
      controls: '.button.header-nav__link',
      panels: '.header-nav__list--level-3',
      closePanelButton: '.button--close-level-3',
      activeClassControl: 'active',
      activeClassPanel: 'active',
      transitionLevelClass: 'level-3',
      closePanelOn: 'closing-level-2'
    });
    $('.list--topics').nav({
      navList: '.list__ul',
      controls: '.button.header-nav__link',
      panels: '.header-nav__list--level-3',
      closePanelButton: '.button--close-level-3',
      activeClassControl: 'active',
      activeClassPanel: 'active',
      transitionLevelClass: 'level-3',
      closePanelOn: 'closing-level-2'
    });
    $('.list--services').nav({
      navList: '.list__ul',
      controls: '.button.header-nav__link',
      panels: '.header-nav__list--level-3',
      closePanelButton: '.button--close-level-3',
      activeClassControl: 'active',
      activeClassPanel: 'active',
      transitionLevelClass: 'level-3',
      closePanelOn: 'closing-level-2'
    });
    $('.header').on('closing-level-2', function () {
      setTimeout(function () {
        $('.header__navs').removeClass('opened');
      }, 300);
    });
  }
};
'use strict';
var INIT = window.INIT || {};
INIT.Skipnav = {
  init: function init() {
    var $skipnavLinks = $('.skipnav__link');
    $skipnavLinks.each(function () {
      var idSelector = $(this).attr('href');
      var $target = $(idSelector);
      $target.attr('tabindex', -1).on('blur focusout', function () {
        $(this).removeAttr('tabindex');
      });
      $(this).on('click', function () {
        if (idSelector === '#search') {
          $('.button.header__search-button').click();
        } else {
          $target.focus();
        }
      });
    });
  }
};
'use strict';
var INIT = window.INIT || {};
INIT.accordion = {
  init: function init() {
    var $accordion = $('.accordion');
    if ($accordion.length) {
      $accordion.akkordeon({
        controls: '.accordion__control',
        panels: '.accordion__panel',
        closeOthers: false
      });
    }
  }
};
'use strict';
var INIT = window.INIT || {};
INIT.flap = {
  init: function init() {
    var $contactFlap = $('.contact-flap');
    var $contactFlapButton = $('.contact-flap__button');
    var $contactFlapCard = $('.contact-flap__card');
    var $contactFlapLinks = $('.contact-flap .link');
    var contactFlapActiveClass = 'active';
    var contactFlapIsActive = false;
    var clickOutsideContactFlap = new ClickOutside([$contactFlap[0]], closeContactflap);
    // provide this in markup already!
    $contactFlapLinks.attr('tabindex', '-1');
    $contactFlapButton.attr('aria-expanded', 'false');
    $contactFlapCard.attr('aria-hidden', 'true');
    $contactFlapButton.on('click', function () {
      contactFlapIsActive ? closeContactflap() : openContactflap();
    });
    function openContactflap() {
      clickOutsideContactFlap.listen(true);
      // $contactFlap.trigger('opening-contact-flap');
      $contactFlap.addClass(contactFlapActiveClass);
      $contactFlapButton.attr('aria-expanded', 'true');
      $contactFlapCard.attr('aria-hidden', 'false');
      $contactFlapLinks.attr('tabindex', '0');
      contactFlapIsActive = true;
    }
    function closeContactflap() {
      clickOutsideContactFlap.listen(false);
      // $contactFlap.trigger('closing-contact-flap');
      $contactFlap.removeClass(contactFlapActiveClass);
      $contactFlapButton.attr('aria-expanded', 'false');
      $contactFlapCard.attr('aria-hidden', 'true');
      $contactFlapLinks.attr('tabindex', '-1');
      contactFlapIsActive = false;
    }
    // $contactFlap.toggleClickOutsideListener({
    //   addListenerOn: 'opening-contact-flap',
    //   removeListenerOn: 'closing-contact-flap',
    //   exclude: $contactFlap,
    //   action: function() {
    //     closeContactflap();
    //   }
    // });
  }
};
'use strict';
var INIT = window.INIT || {};
INIT.callout = {
  init: function init() {
    $('.button.callout__close').on('click', function () {
      $('.callout').slideUp('fast');
    });
  }
};
'use strict';
var INIT = window.INIT || {};
INIT.cookieBanner = {
  screenOrientation: 0,
  init: function init() {
    var that = this;
    var cookiesAgreed = localStorage && localStorage.getItem('cookiesAgreed');
    var currentTimeoutId = null;
    if (cookiesAgreed !== 'true') {
      var resizeListener = null;
      var $main = $('.main');
      var $headerNavs = $('.header__navs');
      var $headerSearchForm = $('#header__search-form');
      var $headerSearchResult = $('.header__search-result');
      var currentWidth = $main.width();
      $('.cookie-banner').show(1, function () {
        var $header = $('.header');
        var $headerHeigth = $header.height();
        $main.css({ paddingTop: $headerHeigth });
        $headerNavs.css({ top: $headerHeigth });
        $headerSearchForm.css({ top: $headerHeigth });
        $headerSearchResult.css({ top: $headerHeigth + 60 });
      });
      $('.js-cookie-banner-button').on('click', function () {
        $('.cookie-banner').fadeOut({ duration: 'slow', queue: false }).slideUp('slow');
        $main.removeAttr('style');
        $headerNavs.removeAttr('style');
        $headerSearchForm.removeAttr('style');
        $headerSearchResult.removeAttr('style');
        localStorage && localStorage.setItem('cookiesAgreed', 'true');
        that.resizeListener && that.resizeListener.off('resize');
      });
      this.screenOrientation = this.getScreenOrientation();
    }
    // check for orientation change and do it again
    this.resizeListener = $(window).one('resize', function () {
      var screenOrientation = that.getScreenOrientation();
      // handle orientation change on mobile
      if (screenOrientation != that.screenOrientation) {
        that.init();
      }
      // handle resize
      if (that.currentWidth != $('.main').width()) {
        if (that.currentTimeoutId) {
          clearTimeout(that.currentTimeoutId);
        }
        that.currentTimeoutId = setTimeout(function (context) {
          context.init();
        }, 300, that);
      }
    });
  },
  getScreenOrientation: function getScreenOrientation() {
    return $(window).width() > $(window).height() ? 90 : 0;
  }
};
'use strict';
var INIT = window.INIT || {};
INIT.dropdown = {
  init: function init() {
    var $dropdown = $('.js-dropdown');
    // init default dropdown seetings, see dropdownPlugin.js
    $dropdown.dropdown({});
    $('div.js-dropdown + p').each(function () {
      if ($(this).text() === '') {
        $(this).remove();
      }
    });
  }
};
'use strict';
var INIT = window.INIT || {};
INIT.feedback = {
  init: function init() {
    var $form = $('.feedback__form');
    var $textarea = $('.feedback__form .form-group');
    var $submit = $('.feedback__form .button.wine');
    var $button = $('.feedback__button');
    var $checkbox = $('.feedback__checkbox');
    var url = $form.attr('action');
    $('.feedback__buttons').on('click', function () {
      $textarea.slideDown().attr('aria-hidden', false);
      $submit.removeAttr('disabled');
    });
    $form.submit(function (event) {
      event.preventDefault();
      $.ajax({
        type: 'POST',
        url: url,
        data: $form.serialize(),
        success: function success(data) {
          // Only for debug
          // console.log('Submission was successful.');
          // console.log(url);
          // console.log(data);
        },
        error: function error(data) {
          // Only for debug
          // console.log('An error occurred.');
          // console.log(data);
        }
      }).done(function (response) {
        $textarea.slideUp().attr('aria-hidden', true);
        $submit.attr('disabled', 'disabled');
        $('.sidebar-module--feedback').slideUp(1000).delay(1000, function () {
          $('.sidebar-module--feedback--success').slideDown(1000);
        });
      }).fail(function (data) {
        console.log('ERROR');
      });
    });
    $button.on('click', function () {
      if ($(this).attr('value') === 'on') {
        $checkbox.prop('checked', true);
      } else {
        $checkbox.prop('checked', false);
      }
      $button.removeClass('active');
      $(this).addClass('active');
    });
  }
};
'use strict';
var INIT = window.INIT || {};
INIT.sharing = {
  init: function init() {
    var dropdowns = $('.sharing');
    dropdowns.dropdown({
      controls: '.sharing__button',
      panels: '.sharing_list',
      duration: 0
    });
  }
};
'use strict';
var INIT = window.INIT || {};
INIT.tabs = {
  init: function init() {
    $('.tabs').tabs({
      opened: 2
    });
  }
};
'use strict';
var INIT = window.INIT || {};
INIT.topicZip = {
  init: function init() {
    var $searchZip = $('#zip-select');
    if (!$searchZip.length) {
      return;
    }
    var $searchZipMainstage = $('.main-search__form #zip-select');
    var $searchZipSidebar = $('.sidebar-module--zip #zip-select');
    var $selectRadio = $('.form--topic-zip input[type=\'radio\']');
    var $suggestPanel = $searchZip.closest('.input-group').find('.input-group__suggestions');
    var $clickOutside = new ClickOutside([$searchZip[0], $suggestPanel[0]], this.toggleSuggestPanel);
    var closestMatch = null;
    var selected = false;
    var mainSetup = {
      serviceUrl: $searchZip.data('url'),
      dataType: 'json',
      paramName: 'query',
      minChars: 2,
      noCache: false,
      width: false,
      beforeRender: function beforeRender(container) {
        $(container).css('position', 'relative');
      },
      transformResult: function transformResult(response) {
        var zipDataArray = $.map(response, function (value) {
          return {
            value: value
          };
        });
        return {
          suggestions: zipDataArray
        };
      },
      onSelect: function onSelect(suggestion) {
        selected = true;
        if ($selectRadio.filter(':checked').length) {
          //$(this).closest('form').submit(); // FPO-539
        }
      },
      onSearchStart: function onSearchStart(query) {
        $clickOutside.listen(true);
      },
      onSearchComplete: function onSearchComplete(query, suggestions) {
        selected = false;
        $.each(suggestions, function (index, object) {
          var value = object.value;
          var regEx = new RegExp(query, 'i');
          if (regEx.test(value)) {
            closestMatch = value;
            return false;
          }
          return true;
        });
      }
    };
    $searchZipSidebar.each(function () {
      var searchZipSidebarSetup = {
        appendTo: '.sidebar-module--zip .input-group__suggestions'
      };
      searchZipSidebarSetup = $.extend({}, mainSetup, searchZipSidebarSetup);
      $(this).autocomplete(searchZipSidebarSetup);
    });
    $searchZipMainstage.each(function () {
      var searchZipMainstageSetup = {
        appendTo: $('#main-search-panel-1-2').find('.input-group__suggestions')
      };
      searchZipMainstageSetup = $.extend({}, mainSetup, searchZipMainstageSetup);
      $(this).autocomplete(searchZipMainstageSetup);
    });
    $searchZip.on('focusout', focusoutHandler).bind(this);
    $searchZip.on('focusin', focusinHandler).bind(this);
    function focusoutHandler() {
      if (!selected && closestMatch !== null) {
        $(this).val(closestMatch);
      }
    }
    function focusinHandler() {
      //$(this).val(''); // // FPO-539
      closestMatch = null;
    }
    function triggerSearchOnDocumentReady(that) {
      var initialValue = $searchZip.val();
      var regexPLZ = /(?!01000|99999)(0[1-9]\d{3}|[1-9]\d{4})/g;
      var plz = initialValue && initialValue.match(regexPLZ)[0];
      if (plz && plz.length) {
        $searchZip.val(initialValue + ' ');
        that.putCursorAtEnd($searchZip);
      }
    }
    // check if zip code allready supplied on load - if supplied trigger suggestions
    $(triggerSearchOnDocumentReady(this));
  },
  toggleSuggestPanel: function toggleSuggestPanel() {
    $('#zip-select').autocomplete('hide');
    this.listen(false);
  },
  putCursorAtEnd: function putCursorAtEnd($element) {
    if (!$element.is(':focus')) {
      $element.focus();
    }
    // from Chris Coyier: https://codepen.io/chriscoyier/pen/CagnJ
    var $el = $element,
        el = $element && $element[0],
        val = $element && $element.val();
    // If this function exists... (IE 9+)
    if (el && el.setSelectionRange) {
      // Double the length because Opera is inconsistent about whether a carriage return is one character or two.
      var len = val && val.length * 2;
      // Timeout seems to be required for Blink
      setTimeout(function () {
        el.setSelectionRange(len, len);
      }, 1);
    } else {
      // As a fallback, replace the contents with itself
      // Doesn't work in Chrome, but Chrome supports setSelectionRange
      $el.val(val);
    }
    // Scroll to the bottom, in case we're in a tall textarea
    // (Necessary for Firefox and Chrome)
    this.scrollTop = 999999;
  }
};
"use strict";
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
/*! iFrame Resizer (iframeSizer.min.js ) - v3.6.3 - 2018-10-28
 *  Desc: Force cross domain iframes to size to content.
 *  Requires: iframeResizer.contentWindow.min.js to be loaded into the target frame.
 *  Copyright: (c) 2018 David J. Bradshaw - dave@bradshaw.net
 *  License: MIT
 */
/* eslint-disable */
!function (a) {
  "use strict";
  function b(a, b, c) {
    "addEventListener" in window ? a.addEventListener(b, c, !1) : "attachEvent" in window && a.attachEvent("on" + b, c);
  }function c(a, b, c) {
    "removeEventListener" in window ? a.removeEventListener(b, c, !1) : "detachEvent" in window && a.detachEvent("on" + b, c);
  }function d() {
    var a,
        b = ["moz", "webkit", "o", "ms"];for (a = 0; a < b.length && !P; a += 1) {
      P = window[b[a] + "RequestAnimationFrame"];
    }P || h("setup", "RequestAnimationFrame not supported");
  }function e(a) {
    var b = "Host page: " + a;return window.top !== window.self && (b = window.parentIFrame && window.parentIFrame.getId ? window.parentIFrame.getId() + ": " + a : "Nested host page: " + a), b;
  }function f(a) {
    return M + "[" + e(a) + "]";
  }function g(a) {
    return R[a] ? R[a].log : I;
  }function h(a, b) {
    k("log", a, b, g(a));
  }function i(a, b) {
    k("info", a, b, g(a));
  }function j(a, b) {
    k("warn", a, b, !0);
  }function k(a, b, c, d) {
    !0 === d && "object" == _typeof(window.console) && console[a](f(b), c);
  }function l(a) {
    function d() {
      function a() {
        t(U), q(V), I("resizedCallback", U);
      }f("Height"), f("Width"), u(a, U, "init");
    }function e() {
      var a = S.substr(N).split(":");return { iframe: R[a[0]] && R[a[0]].iframe, id: a[0], height: a[1], width: a[2], type: a[3] };
    }function f(a) {
      var b = Number(R[V]["max" + a]),
          c = Number(R[V]["min" + a]),
          d = a.toLowerCase(),
          e = Number(U[d]);h(V, "Checking " + d + " is in range " + c + "-" + b), e < c && (e = c, h(V, "Set " + d + " to min value")), e > b && (e = b, h(V, "Set " + d + " to max value")), U[d] = "" + e;
    }function g() {
      function b() {
        function a() {
          var a = 0,
              b = !1;for (h(V, "Checking connection is from allowed list of origins: " + d); a < d.length; a++) {
            if (d[a] === c) {
              b = !0;break;
            }
          }return b;
        }function b() {
          var a = R[V] && R[V].remoteHost;return h(V, "Checking connection is from: " + a), c === a;
        }return d.constructor === Array ? a() : b();
      }var c = a.origin,
          d = R[V] && R[V].checkOrigin;if (d && "" + c != "null" && !b()) throw new Error("Unexpected message received from: " + c + " for " + U.iframe.id + ". Message was: " + a.data + ". This error can be disabled by setting the checkOrigin: false option or by providing of array of trusted domains.");return !0;
    }function k() {
      return M === ("" + S).substr(0, N) && S.substr(N).split(":")[0] in R;
    }function l() {
      var a = U.type in { true: 1, false: 1, undefined: 1 };return a && h(V, "Ignoring init message from meta parent page"), a;
    }function n(a) {
      return S.substr(S.indexOf(":") + L + a);
    }function x(a) {
      h(V, "MessageCallback passed: {iframe: " + U.iframe.id + ", message: " + a + "}"), I("messageCallback", { iframe: U.iframe, message: JSON.parse(a) }), h(V, "--");
    }function y() {
      var a = document.body.getBoundingClientRect(),
          b = U.iframe.getBoundingClientRect();return JSON.stringify({ iframeHeight: b.height, iframeWidth: b.width, clientHeight: Math.max(document.documentElement.clientHeight, window.innerHeight || 0), clientWidth: Math.max(document.documentElement.clientWidth, window.innerWidth || 0), offsetTop: parseInt(b.top - a.top, 10), offsetLeft: parseInt(b.left - a.left, 10), scrollTop: window.pageYOffset, scrollLeft: window.pageXOffset });
    }function A(a, b) {
      function c() {
        v("Send Page Info", "pageInfo:" + y(), a, b);
      }z(c, 32, b);
    }function B() {
      function a(a, b) {
        function c() {
          R[f] ? A(R[f].iframe, f) : d();
        }["scroll", "resize"].forEach(function (d) {
          h(f, a + d + " listener for sendPageInfo"), b(window, d, c);
        });
      }function d() {
        a("Remove ", c);
      }function e() {
        a("Add ", b);
      }var f = V;e(), R[f] && (R[f].stopPageInfo = d);
    }function C() {
      R[V] && R[V].stopPageInfo && (R[V].stopPageInfo(), delete R[V].stopPageInfo);
    }function D() {
      var a = !0;return null === U.iframe && (j(V, "IFrame (" + U.id + ") not found"), a = !1), a;
    }function E(a) {
      var b = a.getBoundingClientRect();return p(V), { x: Math.floor(Number(b.left) + Number(O.x)), y: Math.floor(Number(b.top) + Number(O.y)) };
    }function F(a) {
      function b() {
        O = f, G(), h(V, "--");
      }function c() {
        return { x: Number(U.width) + e.x, y: Number(U.height) + e.y };
      }function d() {
        window.parentIFrame ? window.parentIFrame["scrollTo" + (a ? "Offset" : "")](f.x, f.y) : j(V, "Unable to scroll to requested position, window.parentIFrame not found");
      }var e = a ? E(U.iframe) : { x: 0, y: 0 },
          f = c();h(V, "Reposition requested from iFrame (offset x:" + e.x + " y:" + e.y + ")"), window.top !== window.self ? d() : b();
    }function G() {
      !1 !== I("scrollCallback", O) ? q(V) : r();
    }function H(a) {
      function b() {
        var a = E(f);h(V, "Moving to in page link (#" + d + ") at x: " + a.x + " y: " + a.y), O = { x: a.x, y: a.y }, G(), h(V, "--");
      }function c() {
        window.parentIFrame ? window.parentIFrame.moveToAnchor(d) : h(V, "In page link #" + d + " not found and window.parentIFrame not found");
      }var d = a.split("#")[1] || "",
          e = decodeURIComponent(d),
          f = document.getElementById(e) || document.getElementsByName(e)[0];f ? b() : window.top !== window.self ? c() : h(V, "In page link #" + d + " not found");
    }function I(a, b) {
      return m(V, a, b);
    }function J() {
      switch (R[V] && R[V].firstRun && Q(), U.type) {case "close":
          R[V].closeRequestCallback ? m(V, "closeRequestCallback", R[V].iframe) : o(U.iframe);break;case "message":
          x(n(6));break;case "scrollTo":
          F(!1);break;case "scrollToOffset":
          F(!0);break;case "pageInfo":
          A(R[V] && R[V].iframe, V), B();break;case "pageInfoStop":
          C();break;case "inPageLink":
          H(n(9));break;case "reset":
          s(U);break;case "init":
          d(), I("initCallback", U.iframe);break;default:
          d();}
    }function K(a) {
      var b = !0;return R[a] || (b = !1, j(U.type + " No settings for " + a + ". Message was: " + S)), b;
    }function P() {
      for (var a in R) {
        v("iFrame requested init", w(a), document.getElementById(a), a);
      }
    }function Q() {
      R[V] && (R[V].firstRun = !1);
    }var S = a.data,
        U = {},
        V = null;"[iFrameResizerChild]Ready" === S ? P() : k() ? (U = e(), V = T = U.id, R[V] && (R[V].loaded = !0), !l() && K(V) && (h(V, "Received: " + S), D() && g() && J())) : i(V, "Ignored: " + S);
  }function m(a, b, c) {
    var d = null,
        e = null;if (R[a]) {
      if ("function" != typeof (d = R[a][b])) throw new TypeError(b + " on iFrame[" + a + "] is not a function");e = d(c);
    }return e;
  }function n(a) {
    var b = a.id;delete R[b];
  }function o(a) {
    var b = a.id;h(b, "Removing iFrame: " + b);try {
      a.parentNode && a.parentNode.removeChild(a);
    } catch (c) {}m(b, "closedCallback", b), h(b, "--"), n(a);
  }function p(b) {
    null === O && (O = { x: window.pageXOffset !== a ? window.pageXOffset : document.documentElement.scrollLeft, y: window.pageYOffset !== a ? window.pageYOffset : document.documentElement.scrollTop }, h(b, "Get page position: " + O.x + "," + O.y));
  }function q(a) {
    null !== O && (window.scrollTo(O.x, O.y), h(a, "Set page position: " + O.x + "," + O.y), r());
  }function r() {
    O = null;
  }function s(a) {
    function b() {
      t(a), v("reset", "reset", a.iframe, a.id);
    }h(a.id, "Size reset requested by " + ("init" === a.type ? "host page" : "iFrame")), p(a.id), u(b, a, "reset");
  }function t(a) {
    function b(b) {
      if (!a.id) return void h("undefined", "messageData id not set");a.iframe.style[b] = a[b] + "px", h(a.id, "IFrame (" + e + ") " + b + " set to " + a[b] + "px");
    }function c(b) {
      J || "0" !== a[b] || (J = !0, h(e, "Hidden iFrame detected, creating visibility listener"), A());
    }function d(a) {
      b(a), c(a);
    }var e = a.iframe.id;R[e] && (R[e].sizeHeight && d("height"), R[e].sizeWidth && d("width"));
  }function u(a, b, c) {
    c !== b.type && P ? (h(b.id, "Requesting animation frame"), P(a)) : a();
  }function v(a, b, c, d, e) {
    function f() {
      var e = R[d] && R[d].targetOrigin;h(d, "[" + a + "] Sending msg to iframe[" + d + "] (" + b + ") targetOrigin: " + e), c.contentWindow.postMessage(M + b, e);
    }function g() {
      j(d, "[" + a + "] IFrame(" + d + ") not found");
    }function i() {
      c && "contentWindow" in c && null !== c.contentWindow ? f() : g();
    }function k() {
      function a() {
        !R[d] || R[d].loaded || l || (l = !0, j(d, "IFrame has not responded within " + R[d].warningTimeout / 1e3 + " seconds. Check iFrameResizer.contentWindow.js has been loaded in iFrame. This message can be ignored if everything is working, or you can set the warningTimeout option to a higher value or zero to suppress this warning."));
      }e && R[d] && R[d].warningTimeout && (R[d].msgTimeout = setTimeout(a, R[d].warningTimeout));
    }var l = !1;d = d || c.id, R[d] && (i(), k());
  }function w(a) {
    return a + ":" + R[a].bodyMarginV1 + ":" + R[a].sizeWidth + ":" + R[a].log + ":" + R[a].interval + ":" + R[a].enablePublicMethods + ":" + R[a].autoResize + ":" + R[a].bodyMargin + ":" + R[a].heightCalculationMethod + ":" + R[a].bodyBackground + ":" + R[a].bodyPadding + ":" + R[a].tolerance + ":" + R[a].inPageLinks + ":" + R[a].resizeFrom + ":" + R[a].widthCalculationMethod;
  }function x(c, d) {
    function e() {
      function a(a) {
        1 / 0 !== R[y][a] && 0 !== R[y][a] && (c.style[a] = R[y][a] + "px", h(y, "Set " + a + " = " + R[y][a] + "px"));
      }function b(a) {
        if (R[y]["min" + a] > R[y]["max" + a]) throw new Error("Value for min" + a + " can not be greater than max" + a);
      }b("Height"), b("Width"), a("maxHeight"), a("minHeight"), a("maxWidth"), a("minWidth");
    }function f() {
      var a = d && d.id || U.id + H++;return null !== document.getElementById(a) && (a += H++), a;
    }function g(a) {
      return T = a, "" === a && (c.id = a = f(), I = (d || {}).log, T = a, h(a, "Added missing iframe ID: " + a + " (" + c.src + ")")), a;
    }function i() {
      switch (h(y, "IFrame scrolling " + (R[y] && R[y].scrolling ? "enabled" : "disabled") + " for " + y), c.style.overflow = !1 === (R[y] && R[y].scrolling) ? "hidden" : "auto", R[y] && R[y].scrolling) {case "omit":
          break;case !0:
          c.scrolling = "yes";break;case !1:
          c.scrolling = "no";break;default:
          c.scrolling = R[y] ? R[y].scrolling : "no";}
    }function k() {
      "number" != typeof (R[y] && R[y].bodyMargin) && "0" !== (R[y] && R[y].bodyMargin) || (R[y].bodyMarginV1 = R[y].bodyMargin, R[y].bodyMargin = R[y].bodyMargin + "px");
    }function l() {
      var a = R[y] && R[y].firstRun,
          b = R[y] && R[y].heightCalculationMethod in Q;!a && b && s({ iframe: c, height: 0, width: 0, type: "init" });
    }function m() {
      Function.prototype.bind && R[y] && (R[y].iframe.iFrameResizer = { close: o.bind(null, R[y].iframe), removeListeners: n.bind(null, R[y].iframe), resize: v.bind(null, "Window resize", "resize", R[y].iframe), moveToAnchor: function moveToAnchor(a) {
          v("Move to anchor", "moveToAnchor:" + a, R[y].iframe, y);
        }, sendMessage: function sendMessage(a) {
          a = JSON.stringify(a), v("Send Message", "message:" + a, R[y].iframe, y);
        } });
    }function p(d) {
      function e() {
        v("iFrame.onload", d, c, a, !0), l();
      }b(c, "load", e), v("init", d, c, a, !0);
    }function q(a) {
      if ("object" != (typeof a === "undefined" ? "undefined" : _typeof(a))) throw new TypeError("Options is not an object");
    }function r(a) {
      for (var b in U) {
        U.hasOwnProperty(b) && (R[y][b] = a.hasOwnProperty(b) ? a[b] : U[b]);
      }
    }function t(a) {
      return "" === a || "file://" === a ? "*" : a;
    }function u(a) {
      a = a || {}, R[y] = { firstRun: !0, iframe: c, remoteHost: c.src.split("/").slice(0, 3).join("/") }, q(a), r(a), R[y] && (R[y].targetOrigin = !0 === R[y].checkOrigin ? t(R[y].remoteHost) : "*");
    }function x() {
      return y in R && "iFrameResizer" in c;
    }var y = g(c.id);x() ? j(y, "Ignored iFrame, already setup.") : (u(d), i(), e(), k(), p(w(y)), m());
  }function y(a, b) {
    null === S && (S = setTimeout(function () {
      S = null, a();
    }, b));
  }function z(a, b, c) {
    V[c] || (V[c] = setTimeout(function () {
      V[c] = null, a();
    }, b));
  }function A() {
    function a() {
      function a(a) {
        function b(b) {
          return "0px" === (R[a] && R[a].iframe.style[b]);
        }function c(a) {
          return null !== a.offsetParent;
        }R[a] && c(R[a].iframe) && (b("height") || b("width")) && v("Visibility change", "resize", R[a].iframe, a);
      }for (var b in R) {
        a(b);
      }
    }function b(b) {
      h("window", "Mutation observed: " + b[0].target + " " + b[0].type), y(a, 16);
    }function c() {
      var a = document.querySelector("body"),
          c = { attributes: !0, attributeOldValue: !1, characterData: !0, characterDataOldValue: !1, childList: !0, subtree: !0 };new d(b).observe(a, c);
    }var d = window.MutationObserver || window.WebKitMutationObserver;d && c();
  }function B(a) {
    function b() {
      D("Window " + a, "resize");
    }h("window", "Trigger event: " + a), y(b, 16);
  }function C() {
    function a() {
      D("Tab Visable", "resize");
    }"hidden" !== document.visibilityState && (h("document", "Trigger event: Visiblity change"), y(a, 16));
  }function D(a, b) {
    function c(a) {
      return R[a] && "parent" === R[a].resizeFrom && R[a].autoResize && !R[a].firstRun;
    }for (var d in R) {
      c(d) && v(a, b, document.getElementById(d), d);
    }
  }function E() {
    b(window, "message", l), b(window, "resize", function () {
      B("resize");
    }), b(document, "visibilitychange", C), b(document, "-webkit-visibilitychange", C), b(window, "focusin", function () {
      B("focus");
    }), b(window, "focus", function () {
      B("focus");
    });
  }function F() {
    function b(a, b) {
      function c() {
        if (!b.tagName) throw new TypeError("Object is not a valid DOM element");if ("IFRAME" !== b.tagName.toUpperCase()) throw new TypeError("Expected <IFRAME> tag, found <" + b.tagName + ">");
      }b && (c(), x(b, a), e.push(b));
    }function c(a) {
      a && a.enablePublicMethods && j("enablePublicMethods option has been removed, public methods are now always available in the iFrame");
    }var e;return d(), E(), function (d, f) {
      switch (e = [], c(d), typeof f === "undefined" ? "undefined" : _typeof(f)) {case "undefined":case "string":
          Array.prototype.forEach.call(document.querySelectorAll(f || "iframe"), b.bind(a, d));break;case "object":
          b(d, f);break;default:
          throw new TypeError("Unexpected data type (" + (typeof f === "undefined" ? "undefined" : _typeof(f)) + ")");}return e;
    };
  }function G(a) {
    a.fn ? a.fn.iFrameResize || (a.fn.iFrameResize = function (a) {
      function b(b, c) {
        x(c, a);
      }return this.filter("iframe").each(b).end();
    }) : i("", "Unable to bind to jQuery, it is not fully loaded.");
  }if ("undefined" != typeof window) {
    var H = 0,
        I = !1,
        J = !1,
        K = "message",
        L = K.length,
        M = "[iFrameSizer]",
        N = M.length,
        O = null,
        P = window.requestAnimationFrame,
        Q = { max: 1, scroll: 1, bodyScroll: 1, documentElementScroll: 1 },
        R = {},
        S = null,
        T = "Host Page",
        U = { autoResize: !0, bodyBackground: null, bodyMargin: null, bodyMarginV1: 8, bodyPadding: null, checkOrigin: !0, inPageLinks: !1, enablePublicMethods: !0, heightCalculationMethod: "bodyOffset", id: "iFrameResizer", interval: 32, log: !1, maxHeight: 1 / 0, maxWidth: 1 / 0, minHeight: 0, minWidth: 0, resizeFrom: "parent", scrolling: !1, sizeHeight: !0, sizeWidth: !1, warningTimeout: 5e3, tolerance: 0, widthCalculationMethod: "scroll", closedCallback: function closedCallback() {}, initCallback: function initCallback() {}, messageCallback: function messageCallback() {
        j("MessageCallback function not defined");
      }, resizedCallback: function resizedCallback() {}, scrollCallback: function scrollCallback() {
        return !0;
      } },
        V = {};window.jQuery && G(window.jQuery), "function" == typeof define && define.amd ? define([], F) : "object" == (typeof module === "undefined" ? "undefined" : _typeof(module)) && "object" == _typeof(module.exports) ? module.exports = F() : window.iFrameResize = window.iFrameResize || F();
  }
}();
/* eslint-enable */
"use strict";
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
/*!
   JW Player version 8.6.2
   Copyright (c) 2018, JW Player, All Rights Reserved
   This source code and its use and distribution is subject to the terms
   and conditions of the applicable license agreement.
   https://www.jwplayer.com/tos/
   This product includes portions of other software. For the full text of licenses, see
   https://ssl.p.jwpcdn.com/player/v/8.6.2/notice.txt
*/
window.jwplayer = function (t) {
   function e(e) {
      for (var n, i, o = e[0], u = e[1], a = 0, s = []; a < o.length; a++) {
         i = o[a], r[i] && s.push(r[i][0]), r[i] = 0;
      }for (n in u) {
         Object.prototype.hasOwnProperty.call(u, n) && (t[n] = u[n]);
      }for (c && c(e); s.length;) {
         s.shift()();
      }
   }var n = {},
       r = { 17: 0 };function i(e) {
      if (n[e]) return n[e].exports;var r = n[e] = { i: e, l: !1, exports: {} };return t[e].call(r.exports, r, r.exports, i), r.l = !0, r.exports;
   }i.e = function (t) {
      var e = [],
          n = r[t];if (0 !== n) if (n) e.push(n[2]);else {
         var s = function s(e) {
            a.onerror = a.onload = null, clearTimeout(c);var n = r[t];if (0 !== n) {
               if (n) {
                  var i = e && ("load" === e.type ? "missing" : e.type),
                      o = e && e.target && e.target.src,
                      u = new Error("Loading chunk " + t + " failed.\n(" + i + ": " + o + ")");u.type = i, u.request = o, n[1](u);
               }r[t] = void 0;
            }
         };
         var o = new Promise(function (e, i) {
            n = r[t] = [e, i];
         });e.push(n[2] = o);var u = document.getElementsByTagName("head")[0],
             a = document.createElement("script");a.charset = "utf-8", a.timeout = 55, i.nc && a.setAttribute("nonce", i.nc), a.src = i.p + "" + ({ 0: "related", 1: "provider.html5", 2: "jwplayer.controls", 3: "polyfills.intersection-observer", 4: "jwplayer.core", 5: "jwplayer.core.controls", 6: "jwplayer.core.controls.polyfills", 7: "jwplayer.core.controls.html5", 8: "jwplayer.core.controls.polyfills.html5", 9: "provider.flash", 10: "provider.hlsjs", 11: "provider.shaka", 12: "polyfills.webvtt", 13: "jwplayer.vr", 14: "provider.airplay", 15: "provider.cast", 16: "vttparser" }[t] || t) + ".js";var c = setTimeout(function () {
            s({ type: "timeout", target: a });
         }, 55e3);a.onerror = a.onload = s, u.appendChild(a);
      }return Promise.all(e);
   }, i.m = t, i.c = n, i.d = function (t, e, n) {
      i.o(t, e) || Object.defineProperty(t, e, { configurable: !1, enumerable: !0, get: n });
   }, i.r = function (t) {
      Object.defineProperty(t, "__esModule", { value: !0 });
   }, i.n = function (t) {
      var e = t && t.__esModule ? function () {
         return t.default;
      } : function () {
         return t;
      };return i.d(e, "a", e), e;
   }, i.o = function (t, e) {
      return Object.prototype.hasOwnProperty.call(t, e);
   }, i.p = "", i.oe = function (t) {
      throw console.error(t), t;
   };var o = window.webpackJsonpjwplayer = window.webpackJsonpjwplayer || [],
       u = o.push.bind(o);o.push = e, o = o.slice();for (var a = 0; a < o.length; a++) {
      e(o[a]);
   }var c = u;return i(i.s = 60);
}([function (t, e, n) {
   "use strict";
   n.d(e, "i", function () {
      return k;
   }), n.d(e, "A", function () {
      return x;
   }), n.d(e, "F", function () {
      return S;
   }), n.d(e, "l", function () {
      return _;
   }), n.d(e, "k", function () {
      return N;
   }), n.d(e, "a", function () {
      return I;
   }), n.d(e, "b", function () {
      return L;
   }), n.d(e, "G", function () {
      return D;
   }), n.d(e, "n", function () {
      return V;
   }), n.d(e, "H", function () {
      return Q;
   }), n.d(e, "e", function () {
      return W;
   }), n.d(e, "J", function () {
      return U;
   }), n.d(e, "m", function () {
      return J;
   }), n.d(e, "h", function () {
      return K;
   }), n.d(e, "p", function () {
      return Y;
   }), n.d(e, "c", function () {
      return $;
   }), n.d(e, "C", function () {
      return et;
   }), n.d(e, "I", function () {
      return it;
   }), n.d(e, "q", function () {
      return at;
   }), n.d(e, "g", function () {
      return ct;
   }), n.d(e, "j", function () {
      return st;
   }), n.d(e, "D", function () {
      return lt;
   }), n.d(e, "w", function () {
      return dt;
   }), n.d(e, "t", function () {
      return gt;
   }), n.d(e, "v", function () {
      return mt;
   }), n.d(e, "x", function () {
      return bt;
   }), n.d(e, "s", function () {
      return yt;
   }), n.d(e, "u", function () {
      return jt;
   }), n.d(e, "r", function () {
      return wt;
   }), n.d(e, "y", function () {
      return Ot;
   }), n.d(e, "o", function () {
      return Ct;
   }), n.d(e, "d", function () {
      return xt;
   }), n.d(e, "E", function () {
      return Pt;
   }), n.d(e, "B", function () {
      return St;
   }), n.d(e, "z", function () {
      return Et;
   });var r = n(16),
       i = {},
       o = Array.prototype,
       u = Object.prototype,
       a = Function.prototype,
       c = o.slice,
       s = o.concat,
       l = u.toString,
       f = u.hasOwnProperty,
       d = o.map,
       p = o.reduce,
       h = o.forEach,
       v = o.filter,
       g = o.every,
       m = o.some,
       b = o.indexOf,
       y = Array.isArray,
       j = Object.keys,
       w = a.bind,
       O = window.isFinite,
       k = function k(t, e, n) {
      var r = void 0,
          o = void 0;if (null == t) return t;if (h && t.forEach === h) t.forEach(e, n);else if (t.length === +t.length) {
         for (r = 0, o = t.length; r < o; r++) {
            if (e.call(n, t[r], r, t) === i) return;
         }
      } else {
         var u = ot(t);for (r = 0, o = u.length; r < o; r++) {
            if (e.call(n, t[u[r]], u[r], t) === i) return;
         }
      }return t;
   },
       C = k,
       x = function x(t, e, n) {
      var r = [];return null == t ? r : d && t.map === d ? t.map(e, n) : (k(t, function (t, i, o) {
         r.push(e.call(n, t, i, o));
      }), r);
   },
       P = x,
       S = function S(t, e, n, r) {
      var i = arguments.length > 2;if (null == t && (t = []), p && t.reduce === p) return r && (e = $(e, r)), i ? t.reduce(e, n) : t.reduce(e);if (k(t, function (t, o, u) {
         i ? n = e.call(r, n, t, o, u) : (n = t, i = !0);
      }), !i) throw new TypeError("Reduce of empty array with no initial value");return n;
   },
       T = S,
       E = S,
       _ = function _(t, e, n) {
      var r = void 0;return L(t, function (t, i, o) {
         if (e.call(n, t, i, o)) return r = t, !0;
      }), r;
   },
       A = _,
       N = function N(t, e, n) {
      var r = [];return null == t ? r : v && t.filter === v ? t.filter(e, n) : (k(t, function (t, i, o) {
         e.call(n, t, i, o) && r.push(t);
      }), r);
   },
       M = N,
       I = function I(t, e, n) {
      e || (e = Ct);var r = !0;return null == t ? r : g && t.every === g ? t.every(e, n) : (k(t, function (t, o, u) {
         if (!(r = r && e.call(n, t, o, u))) return i;
      }), !!r);
   },
       F = I,
       L = function L(t, e, n) {
      e || (e = Ct);var r = !1;return null == t ? r : m && t.some === m ? t.some(e, n) : (k(t, function (t, o, u) {
         if (r || (r = e.call(n, t, o, u))) return i;
      }), !!r);
   },
       R = L,
       D = function D(t) {
      return null == t ? 0 : t.length === +t.length ? t.length : ot(t).length;
   },
       B = function B(t, e) {
      var n = void 0;return function () {
         return --t > 0 && (n = e.apply(this, arguments)), t <= 1 && (e = null), n;
      };
   },
       z = function z(t) {
      return null == t ? Ct : gt(t) ? t : Pt(t);
   },
       q = function q(t) {
      return function (e, n, r) {
         var i = {};return n = z(n), k(e, function (o, u) {
            var a = n.call(r, o, u, e);t(i, a, o);
         }), i;
      };
   },
       V = q(function (t, e, n) {
      kt(t, e) ? t[e].push(n) : t[e] = [n];
   }),
       X = q(function (t, e, n) {
      t[e] = n;
   }),
       Q = function Q(t, e, n, r) {
      for (var i = (n = z(n)).call(r, e), o = 0, u = t.length; o < u;) {
         var a = o + u >>> 1;n.call(r, t[a]) < i ? o = a + 1 : u = a;
      }return o;
   },
       W = function W(t, e) {
      return null != t && (t.length !== +t.length && (t = ut(t)), Y(t, e) >= 0);
   },
       H = W,
       U = function U(t, e) {
      return N(t, St(e));
   },
       J = function J(t, e) {
      return _(t, St(e));
   },
       K = function K(t) {
      var e = s.apply(o, c.call(arguments, 1));return N(t, function (t) {
         return !W(e, t);
      });
   },
       Y = function Y(t, e, n) {
      if (null == t) return -1;var r = 0,
          i = t.length;if (n) {
         if ("number" != typeof n) return t[r = Q(t, e)] === e ? r : -1;r = n < 0 ? Math.max(0, i + n) : n;
      }if (b && t.indexOf === b) return t.indexOf(e, n);for (; r < i; r++) {
         if (t[r] === e) return r;
      }return -1;
   },
       G = function G() {},
       $ = function $(t, e) {
      var n = void 0,
          _r = void 0;if (w && t.bind === w) return w.apply(t, c.call(arguments, 1));if (!gt(t)) throw new TypeError();return n = c.call(arguments, 2), _r = function r() {
         if (!(this instanceof _r)) return t.apply(e, n.concat(c.call(arguments)));G.prototype = t.prototype;var i = new G();G.prototype = null;var o = t.apply(i, n.concat(c.call(arguments)));return Object(o) === o ? o : i;
      };
   },
       Z = function Z(t) {
      var e = c.call(arguments, 1);return function () {
         for (var n = 0, r = e.slice(), i = 0, o = r.length; i < o; i++) {
            kt(r[i], "partial") && (r[i] = arguments[n++]);
         }for (; n < arguments.length;) {
            r.push(arguments[n++]);
         }return t.apply(this, r);
      };
   },
       tt = Z(B, 2),
       et = function et(t, e) {
      var n = {};return e || (e = Ct), function () {
         var r = e.apply(this, arguments);return kt(n, r) ? n[r] : n[r] = t.apply(this, arguments);
      };
   },
       nt = function nt(t, e) {
      var n = c.call(arguments, 2);return setTimeout(function () {
         return t.apply(null, n);
      }, e);
   },
       rt = Z(nt, { partial: Z }, 1),
       it = function it(t, e, n) {
      var r = void 0,
          i = void 0,
          o = void 0,
          u = null,
          a = 0;n || (n = {});var c = function c() {
         a = !1 === n.leading ? 0 : Tt(), u = null, o = t.apply(r, i), r = i = null;
      };return function () {
         a || !1 !== n.leading || (a = Tt);var s = e - (Tt - a);return r = this, i = arguments, s <= 0 ? (clearTimeout(u), u = null, a = Tt, o = t.apply(r, i), r = i = null) : u || !1 === n.trailing || (u = setTimeout(c, s)), o;
      };
   },
       ot = function ot(t) {
      if (!dt(t)) return [];if (j) return j(t);var e = [];for (var n in t) {
         kt(t, n) && e.push(n);
      }return e;
   },
       ut = function ut(t) {
      for (var e = ot(t), n = ot.length, r = Array(n), i = 0; i < n; i++) {
         r[i] = t[e[i]];
      }return r;
   },
       at = function at(t) {
      for (var e = {}, n = ot(t), r = 0, i = n.length; r < i; r++) {
         e[t[n[r]]] = n[r];
      }return e;
   },
       ct = function ct(t) {
      return k(c.call(arguments, 1), function (e) {
         if (e) for (var n in e) {
            void 0 === t[n] && (t[n] = e[n]);
         }
      }), t;
   },
       st = Object.assign || function (t) {
      return k(c.call(arguments, 1), function (e) {
         if (e) for (var n in e) {
            Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
         }
      }), t;
   },
       lt = function lt(t) {
      var e = {},
          n = s.apply(o, c.call(arguments, 1));return k(n, function (n) {
         n in t && (e[n] = t[n]);
      }), e;
   },
       ft = y || function (t) {
      return "[object Array]" == l.call(t);
   },
       dt = function dt(t) {
      return t === Object(t);
   },
       pt = [];k(["Function", "String", "Number", "Date", "RegExp"], function (t) {
      pt[t] = function (e) {
         return l.call(e) == "[object " + t + "]";
      };
   }), pt.Function = function (t) {
      return "function" == typeof t;
   };var ht = pt.Date,
       vt = pt.RegExp,
       gt = pt.Function,
       mt = pt.Number,
       bt = pt.String,
       yt = function yt(t) {
      return O(t) && !jt(parseFloat(t));
   },
       jt = function jt(t) {
      return mt(t) && t != +t;
   },
       wt = function wt(t) {
      return !0 === t || !1 === t || "[object Boolean]" == l.call(t);
   },
       Ot = function Ot(t) {
      return void 0 === t;
   },
       kt = function kt(t, e) {
      return f.call(t, e);
   },
       Ct = function Ct(t) {
      return t;
   },
       xt = function xt(t) {
      return function () {
         return t;
      };
   },
       Pt = function Pt(t) {
      return function (e) {
         return e[t];
      };
   },
       St = function St(t) {
      return function (e) {
         if (e === t) return !0;for (var n in t) {
            if (t[n] !== e[n]) return !1;
         }return !0;
      };
   },
       Tt = r.a,
       Et = function Et(t) {
      return mt(t) && !jt(t);
   };e.f = { after: function after(t, e) {
         return function () {
            if (--t < 1) return e.apply(this, arguments);
         };
      }, all: I, any: L, before: B, bind: $, clone: function clone(t) {
         return dt(t) ? ft(t) ? t.slice() : st({}, t) : t;
      }, collect: P, compact: function compact(t) {
         return N(t, Ct);
      }, constant: xt, contains: W, defaults: ct, defer: rt, delay: nt, detect: A, difference: K, each: k, every: F, extend: st, filter: N, find: _, findWhere: J, foldl: T, forEach: C, groupBy: V, has: kt, identity: Ct, include: H, indexBy: X, indexOf: Y, inject: E, invert: at, isArray: ft, isBoolean: wt, isDate: ht, isFinite: yt, isFunction: gt, isNaN: jt, isNull: function isNull(t) {
         return null === t;
      }, isNumber: mt, isObject: dt, isRegExp: vt, isString: bt, isUndefined: Ot, isValidNumber: Et, keys: ot, last: function last(t, e, n) {
         if (null != t) return null == e || n ? t[t.length - 1] : c.call(t, Math.max(t.length - e, 0));
      }, map: x, matches: St, max: function max(t, e, n) {
         if (!e && ft(t) && t[0] === +t[0] && t.length < 65535) return Math.max.apply(Math, t);var r = -1 / 0,
             i = -1 / 0;return k(t, function (t, o, u) {
            var a = e ? e.call(n, t, o, u) : t;a > i && (r = t, i = a);
         }), r;
      }, memoize: et, now: Tt, omit: function omit(t) {
         var e = {},
             n = s.apply(o, c.call(arguments, 1));for (var r in t) {
            W(n, r) || (e[r] = t[r]);
         }return e;
      }, once: tt, partial: Z, pick: lt, pluck: function pluck(t, e) {
         return x(t, Pt(e));
      }, property: Pt, propertyOf: function propertyOf(t) {
         return null == t ? function () {} : function (e) {
            return t[e];
         };
      }, reduce: S, reject: function reject(t, e, n) {
         return N(t, function (t, r, i) {
            return !e.call(n, t, r, i);
         }, n);
      }, result: function result(t, e) {
         if (null != t) {
            var n = t[e];return gt(n) ? n.call(t) : n;
         }
      }, select: M, size: D, some: R, sortedIndex: Q, throttle: it, where: U, without: function without(t) {
         return K(t, c.call(arguments, 1));
      } };
}, function (t, e, n) {
   "use strict";
   n.d(e, "y", function () {
      return o;
   }), n.d(e, "x", function () {
      return u;
   }), n.d(e, "w", function () {
      return a;
   }), n.d(e, "t", function () {
      return c;
   }), n.d(e, "u", function () {
      return s;
   }), n.d(e, "a", function () {
      return l;
   }), n.d(e, "c", function () {
      return f;
   }), n.d(e, "v", function () {
      return d;
   }), n.d(e, "d", function () {
      return p;
   }), n.d(e, "h", function () {
      return h;
   }), n.d(e, "e", function () {
      return v;
   }), n.d(e, "k", function () {
      return g;
   }), n.d(e, "i", function () {
      return m;
   }), n.d(e, "j", function () {
      return b;
   }), n.d(e, "b", function () {
      return x;
   }), n.d(e, "f", function () {
      return P;
   }), n.d(e, "g", function () {
      return S;
   }), n.d(e, "o", function () {
      return T;
   }), n.d(e, "l", function () {
      return E;
   }), n.d(e, "m", function () {
      return _;
   }), n.d(e, "n", function () {
      return A;
   }), n.d(e, "p", function () {
      return N;
   }), n.d(e, "q", function () {
      return M;
   }), n.d(e, "r", function () {
      return I;
   }), n.d(e, "s", function () {
      return F;
   }), n.d(e, "A", function () {
      return L;
   }), n.d(e, "z", function () {
      return R;
   }), n.d(e, "B", function () {
      return D;
   });var r = n(0),
       i = function () {
      function t(t, e) {
         for (var n = 0; n < e.length; n++) {
            var r = e[n];r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r);
         }
      }return function (e, n, r) {
         return n && t(e.prototype, n), r && t(e, r), e;
      };
   }();var o = 1e5,
       u = 100001,
       a = 100002,
       c = 101e3,
       s = 102e3,
       l = 200001,
       f = 202e3,
       d = 104e3,
       p = 203e3,
       h = 203640,
       v = 204e3,
       g = 210001,
       m = 21e4,
       b = 214e3,
       y = 303200,
       j = 303210,
       w = 303212,
       O = 303213,
       k = 303220,
       C = 303230,
       x = 306e3,
       P = 308e3,
       S = 308640,
       T = "cantPlayVideo",
       E = "badConnection",
       _ = "cantLoadPlayer",
       A = "cantPlayInBrowser",
       N = "liveStreamDown",
       M = "protectedContent",
       I = "technicalError",
       F = function () {
      function t(e, n) {
         var i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null;!function (t, e) {
            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
         }(this, t), this.code = Object(r.z)(n) ? n : 0, this.sourceError = i, e && (this.key = e);
      }return i(t, null, [{ key: "logMessage", value: function value(t) {
            var e = t % 1e3,
                n = Math.floor((t - e) / 1e3),
                r = t;return e >= 400 && e < 600 && (r = n + "400-" + n + "599"), "JW Player " + (t > 299999 && t < 4e5 ? "Warning" : "Error") + " " + t + ". For more information see https://developer.jwplayer.com/jw-player/docs/developer-guide/api/errors-reference#" + r;
         } }]), t;
   }();function L(t, e, n) {
      return n instanceof F && n.code ? n : new F(t, e, n);
   }function R(t, e) {
      var n = L(I, e, t);return n.code = (t && t.code || 0) + e, n;
   }function D(t) {
      var e = t.name,
          n = t.message;switch (e) {case "AbortError":
            return (/pause/.test(n) ? O : /load/.test(n) ? w : j
            );case "NotAllowedError":
            return k;case "NotSupportedError":
            return C;default:
            return y;}
   }
}, function (t, e, n) {
   "use strict";
   n.d(e, "h", function () {
      return o;
   }), n.d(e, "d", function () {
      return u;
   }), n.d(e, "i", function () {
      return a;
   }), n.d(e, "a", function () {
      return c;
   }), n.d(e, "b", function () {
      return s;
   }), n.d(e, "f", function () {
      return l;
   }), n.d(e, "c", function () {
      return f;
   }), n.d(e, "e", function () {
      return d;
   }), n.d(e, "g", function () {
      return p;
   });var r = n(0),
       i = window.parseFloat;function o(t) {
      return t.replace(/^\s+|\s+$/g, "");
   }function u(t, e, n) {
      for (t = "" + t, n = n || "0"; t.length < e;) {
         t = n + t;
      }return t;
   }function a(t, e) {
      for (var n = t.attributes, r = 0; r < n.length; r++) {
         if (n[r].name && n[r].name.toLowerCase() === e.toLowerCase()) return n[r].value.toString();
      }return "";
   }function c(t) {
      if (!t || "rtmp" === t.substr(0, 4)) return "";var e = /[(,]format=(m3u8|mpd)-/i.exec(t);return e ? e[1] : (t = t.split("?")[0].split("#")[0]).lastIndexOf(".") > -1 ? t.substr(t.lastIndexOf(".") + 1, t.length).toLowerCase() : void 0;
   }function s(t) {
      var e = (t / 60 | 0) % 60,
          n = t % 60;return u(t / 3600 | 0, 2) + ":" + u(e, 2) + ":" + u(n.toFixed(3), 6);
   }function l(t, e) {
      if (!t) return 0;if (Object(r.z)(t)) return t;var n = t.replace(",", "."),
          o = n.slice(-1),
          u = n.split(":"),
          a = u.length,
          c = 0;if ("s" === o) c = i(n);else if ("m" === o) c = 60 * i(n);else if ("h" === o) c = 3600 * i(n);else if (a > 1) {
         var s = a - 1;4 === a && (e && (c = i(u[s]) / e), s -= 1), c += i(u[s]), c += 60 * i(u[s - 1]), a >= 3 && (c += 3600 * i(u[s - 2]));
      } else c = i(n);return Object(r.z)(c) ? c : 0;
   }function f(t, e, n) {
      if (Object(r.x)(t) && "%" === t.slice(-1)) {
         var o = i(t);return e && Object(r.z)(e) && Object(r.z)(o) ? e * o / 100 : null;
      }return l(t, n);
   }function d(t, e) {
      return t.map(function (t) {
         return e + t;
      });
   }function p(t, e) {
      return t.map(function (t) {
         return t + e;
      });
   }
}, function (t, e, n) {
   "use strict";
   n.d(e, "Ja", function () {
      return r;
   }), n.d(e, "Ma", function () {
      return i;
   }), n.d(e, "Ka", function () {
      return o;
   }), n.d(e, "Oa", function () {
      return u;
   }), n.d(e, "Pa", function () {
      return a;
   }), n.d(e, "La", function () {
      return c;
   }), n.d(e, "Na", function () {
      return s;
   }), n.d(e, "Qa", function () {
      return l;
   }), n.d(e, "s", function () {
      return f;
   }), n.d(e, "u", function () {
      return d;
   }), n.d(e, "t", function () {
      return p;
   }), n.d(e, "n", function () {
      return h;
   }), n.d(e, "q", function () {
      return v;
   }), n.d(e, "Ra", function () {
      return g;
   }), n.d(e, "r", function () {
      return m;
   }), n.d(e, "Y", function () {
      return b;
   }), n.d(e, "V", function () {
      return y;
   }), n.d(e, "v", function () {
      return j;
   }), n.d(e, "X", function () {
      return w;
   }), n.d(e, "w", function () {
      return O;
   }), n.d(e, "Ta", function () {
      return k;
   }), n.d(e, "a", function () {
      return C;
   }), n.d(e, "b", function () {
      return x;
   }), n.d(e, "c", function () {
      return P;
   }), n.d(e, "d", function () {
      return S;
   }), n.d(e, "e", function () {
      return T;
   }), n.d(e, "h", function () {
      return E;
   }), n.d(e, "F", function () {
      return _;
   }), n.d(e, "Ga", function () {
      return A;
   }), n.d(e, "P", function () {
      return N;
   }), n.d(e, "C", function () {
      return M;
   }), n.d(e, "B", function () {
      return I;
   }), n.d(e, "E", function () {
      return F;
   }), n.d(e, "p", function () {
      return L;
   }), n.d(e, "Ba", function () {
      return R;
   }), n.d(e, "m", function () {
      return D;
   }), n.d(e, "G", function () {
      return B;
   }), n.d(e, "H", function () {
      return z;
   }), n.d(e, "M", function () {
      return q;
   }), n.d(e, "N", function () {
      return V;
   }), n.d(e, "Q", function () {
      return X;
   }), n.d(e, "Ia", function () {
      return Q;
   }), n.d(e, "Aa", function () {
      return W;
   }), n.d(e, "D", function () {
      return H;
   }), n.d(e, "R", function () {
      return U;
   }), n.d(e, "O", function () {
      return J;
   }), n.d(e, "S", function () {
      return K;
   }), n.d(e, "U", function () {
      return Y;
   }), n.d(e, "L", function () {
      return G;
   }), n.d(e, "K", function () {
      return $;
   }), n.d(e, "I", function () {
      return Z;
   }), n.d(e, "J", function () {
      return tt;
   }), n.d(e, "T", function () {
      return et;
   }), n.d(e, "o", function () {
      return nt;
   }), n.d(e, "y", function () {
      return rt;
   }), n.d(e, "Ha", function () {
      return it;
   }), n.d(e, "Ca", function () {
      return ot;
   }), n.d(e, "Da", function () {
      return ut;
   }), n.d(e, "f", function () {
      return at;
   }), n.d(e, "g", function () {
      return ct;
   }), n.d(e, "Z", function () {
      return st;
   }), n.d(e, "A", function () {
      return lt;
   }), n.d(e, "l", function () {
      return ft;
   }), n.d(e, "k", function () {
      return dt;
   }), n.d(e, "Ea", function () {
      return pt;
   }), n.d(e, "Fa", function () {
      return ht;
   }), n.d(e, "Sa", function () {
      return vt;
   }), n.d(e, "z", function () {
      return gt;
   }), n.d(e, "j", function () {
      return mt;
   }), n.d(e, "W", function () {
      return bt;
   }), n.d(e, "i", function () {
      return yt;
   }), n.d(e, "x", function () {
      return jt;
   });var r = "buffering",
       i = "idle",
       o = "complete",
       u = "paused",
       a = "playing",
       c = "error",
       s = "loading",
       l = "stalled",
       f = "drag",
       d = "dragStart",
       p = "dragEnd",
       h = "click",
       v = "doubleClick",
       g = "tap",
       m = "doubleTap",
       b = "over",
       y = "move",
       j = "enter",
       w = "out",
       O = c,
       k = "warning",
       C = "adClick",
       x = "adPause",
       P = "adPlay",
       S = "adSkipped",
       T = "adTime",
       E = "autostartNotAllowed",
       _ = o,
       A = "ready",
       N = "seek",
       M = "beforePlay",
       I = "beforeComplete",
       F = "bufferFull",
       L = "displayClick",
       R = "playlistComplete",
       D = "cast",
       B = "mediaError",
       z = "firstFrame",
       q = "playAttempt",
       V = "playAttemptFailed",
       X = "seeked",
       Q = "setupError",
       W = "state",
       H = "bufferChange",
       U = "time",
       J = "ratechange",
       K = "mediaType",
       Y = "volume",
       G = "mute",
       $ = "meta",
       Z = "levels",
       tt = "levelsChanged",
       et = "visualQuality",
       nt = "controls",
       rt = "fullscreen",
       it = "resize",
       ot = "playlistItem",
       ut = "playlist",
       at = "audioTracks",
       ct = "audioTrackChanged",
       st = "playbackRateChanged",
       lt = "logoClick",
       ft = "captionsList",
       dt = "captionsChanged",
       pt = "providerChanged",
       ht = "providerFirstFrame",
       vt = "userAction",
       gt = "instreamClick",
       mt = "breakpoint",
       bt = "fullscreenchange",
       yt = "bandwidthEstimate",
       jt = "float";
}, function (t, e, n) {
   "use strict";
   n.d(e, "b", function () {
      return i;
   }), n.d(e, "d", function () {
      return o;
   }), n.d(e, "a", function () {
      return u;
   }), n.d(e, "c", function () {
      return a;
   });var r = n(2);function i(t) {
      var e = "";return t && (t.localName ? e = t.localName : t.baseName && (e = t.baseName)), e;
   }function o(t) {
      var e = "";return t && (t.textContent ? e = Object(r.h)(t.textContent) : t.text && (e = Object(r.h)(t.text))), e;
   }function u(t, e) {
      return t.childNodes[e];
   }function a(t) {
      return t.childNodes ? t.childNodes.length : 0;
   }
}, function (t, e, n) {
   "use strict";
   n.d(e, "c", function () {
      return o;
   }), n.d(e, "d", function () {
      return u;
   }), n.d(e, "b", function () {
      return a;
   }), n.d(e, "e", function () {
      return c;
   }), n.d(e, "f", function () {
      return s;
   });var r = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (t) {
      return typeof t === "undefined" ? "undefined" : _typeof(t);
   } : function (t) {
      return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t === "undefined" ? "undefined" : _typeof(t);
   },
       i = [].slice;function o(t, e, n) {
      if (!f(this, "on", t, [e, n]) || !e) return this;var r = this._events || (this._events = {});return (r[t] || (r[t] = [])).push({ callback: e, context: n }), this;
   }function u(t, e, n) {
      if (!f(this, "once", t, [e, n]) || !e) return this;var r = 0,
          i = this,
          o = function n() {
         r++ || (i.off(t, n), e.apply(this, arguments));
      };return o._callback = e, this.on(t, o, n);
   }function a(t, e, n) {
      if (!this._events || !f(this, "off", t, [e, n])) return this;if (!t && !e && !n) return delete this._events, this;for (var r = t ? [t] : Object.keys(this._events), i = 0, o = r.length; i < o; i++) {
         t = r[i];var u = this._events[t];if (u) {
            var a = this._events[t] = [];if (e || n) for (var c = 0, s = u.length; c < s; c++) {
               var l = u[c];(e && e !== l.callback && e !== l.callback._callback || n && n !== l.context) && a.push(l);
            }a.length || delete this._events[t];
         }
      }return this;
   }function c(t) {
      if (!this._events) return this;var e = i.call(arguments, 1);if (!f(this, "trigger", t, e)) return this;var n = this._events[t],
          r = this._events.all;return n && d(n, e, this), r && d(r, arguments, this), this;
   }function s(t) {
      if (!this._events) return this;var e = i.call(arguments, 1);if (!f(this, "trigger", t, e)) return this;var n = this._events[t],
          r = this._events.all;return n && d(n, e, this, t), r && d(r, arguments, this, t), this;
   }var l = /\s+/;function f(t, e, n, i) {
      if (!n) return !0;if ("object" === (void 0 === n ? "undefined" : r(n))) {
         for (var o in n) {
            Object.prototype.hasOwnProperty.call(n, o) && t[e].apply(t, [o, n[o]].concat(i));
         }return !1;
      }if (l.test(n)) {
         for (var u = n.split(l), a = 0, c = u.length; a < c; a++) {
            t[e].apply(t, [u[a]].concat(i));
         }return !1;
      }return !0;
   }function d(t, e, n, r) {
      for (var i = -1, o = t.length; ++i < o;) {
         var u = t[i];if (r) try {
            u.callback.apply(u.context || n, e);
         } catch (t) {
            console.log('Error in "' + r + '" event handler:', t);
         } else u.callback.apply(u.context || n, e);
      }
   }e.a = { on: o, once: u, off: a, trigger: c };
}, function (t, e, n) {
   "use strict";
   n.d(e, "h", function () {
      return u;
   }), n.d(e, "f", function () {
      return a;
   }), n.d(e, "l", function () {
      return s;
   }), n.d(e, "k", function () {
      return l;
   }), n.d(e, "p", function () {
      return f;
   }), n.d(e, "g", function () {
      return d;
   }), n.d(e, "e", function () {
      return p;
   }), n.d(e, "n", function () {
      return h;
   }), n.d(e, "d", function () {
      return v;
   }), n.d(e, "i", function () {
      return g;
   }), n.d(e, "q", function () {
      return m;
   }), n.d(e, "j", function () {
      return b;
   }), n.d(e, "c", function () {
      return y;
   }), n.d(e, "b", function () {
      return j;
   }), n.d(e, "o", function () {
      return w;
   }), n.d(e, "m", function () {
      return O;
   }), n.d(e, "a", function () {
      return k;
   });var r = navigator.userAgent;function i(t) {
      return null !== r.match(t);
   }function o(t) {
      return function () {
         return i(t);
      };
   }function u() {
      var t = k();return !!(t && t >= 18);
   }var a = o(/gecko\//i),
       c = o(/trident\/.+rv:\s*11/i),
       s = o(/iP(hone|od)/i),
       l = o(/iPad/i),
       f = o(/Macintosh/i),
       d = o(/FBAV/i);function p() {
      return i(/\sEdge\/\d+/i);
   }function h() {
      return i(/msie/i);
   }function v() {
      return i(/\s(?:(?:Headless)?Chrome|CriOS)\//i) && !p() && !i(/UCBrowser/i);
   }function g() {
      return p() || c() || h();
   }function m() {
      return i(/safari/i) && !i(/(?:Chrome|CriOS|chromium|android|phantom)/i);
   }function b() {
      return i(/iP(hone|ad|od)/i);
   }function y() {
      return !(i(/chrome\/[123456789]/i) && !i(/chrome\/18/i) && !a()) && j();
   }function j() {
      return i(/Android/i) && !i(/Windows Phone/i);
   }function w() {
      return b() || j() || i(/Windows Phone/i);
   }function O() {
      try {
         return window.self !== window.top;
      } catch (t) {
         return !0;
      }
   }function k() {
      if (j()) return 0;var t = navigator.plugins,
          e = void 0;if (t && (e = t["Shockwave Flash"]) && e.description) return parseFloat(e.description.replace(/\D+(\d+\.?\d*).*/, "$1"));if (void 0 !== window.ActiveXObject) {
         try {
            if (e = new window.ActiveXObject("ShockwaveFlash.ShockwaveFlash")) return parseFloat(e.GetVariable("$version").split(" ")[1].replace(/\s*,\s*/, "."));
         } catch (t) {
            return 0;
         }return e;
      }return 0;
   }
}, function (t, e, n) {
   "use strict";
   n.r(e);var r = n(6);function i(t, e) {
      if (t && t.length > e) return t[e];
   }var o = n(0);n.d(e, "Browser", function () {
      return a;
   }), n.d(e, "OS", function () {
      return c;
   }), n.d(e, "Features", function () {
      return s;
   });var u = navigator.userAgent;var a = {},
       c = {},
       s = {};Object.defineProperties(a, { androidNative: { get: Object(o.C)(r.c), enumerable: !0 }, chrome: { get: Object(o.C)(r.d), enumerable: !0 }, edge: { get: Object(o.C)(r.e), enumerable: !0 }, facebook: { get: Object(o.C)(r.g), enumerable: !0 }, firefox: { get: Object(o.C)(r.f), enumerable: !0 }, ie: { get: Object(o.C)(r.i), enumerable: !0 }, msie: { get: Object(o.C)(r.n), enumerable: !0 }, safari: { get: Object(o.C)(r.q), enumerable: !0 }, version: { get: Object(o.C)(function (t, e) {
            var n = void 0,
                r = void 0,
                i = void 0,
                o = void 0;return t.chrome ? n = -1 !== e.indexOf("Chrome") ? e.substring(e.indexOf("Chrome") + 7) : e.substring(e.indexOf("CriOS") + 6) : t.safari ? n = e.substring(e.indexOf("Version") + 8) : t.firefox ? n = e.substring(e.indexOf("Firefox") + 8) : t.edge ? n = e.substring(e.indexOf("Edge") + 5) : t.ie && (-1 !== e.indexOf("rv:") ? n = e.substring(e.indexOf("rv:") + 3) : -1 !== e.indexOf("MSIE") && (n = e.substring(e.indexOf("MSIE") + 5))), n && (-1 !== (o = n.indexOf(";")) && (n = n.substring(0, o)), -1 !== (o = n.indexOf(" ")) && (n = n.substring(0, o)), -1 !== (o = n.indexOf(")")) && (n = n.substring(0, o)), r = parseInt(n, 10), i = parseInt(n.split(".")[1], 10)), { version: n, major: r, minor: i };
         }.bind(void 0, a, u)), enumerable: !0 } }), Object.defineProperties(c, { android: { get: Object(o.C)(r.b), enumerable: !0 }, iOS: { get: Object(o.C)(r.j), enumerable: !0 }, mobile: { get: Object(o.C)(r.o), enumerable: !0 }, mac: { get: Object(o.C)(r.p), enumerable: !0 }, iPad: { get: Object(o.C)(r.k), enumerable: !0 }, iPhone: { get: Object(o.C)(r.l), enumerable: !0 }, windows: { get: Object(o.C)(function () {
            return u.indexOf("Windows") > -1;
         }), enumerable: !0 }, version: { get: Object(o.C)(function (t, e) {
            var n = void 0,
                r = void 0,
                o = void 0;if (t.windows) switch (n = i(/Windows(?: NT|)? ([._\d]+)/.exec(e), 1)) {case "6.1":
                  n = "7.0";break;case "6.2":
                  n = "8.0";break;case "6.3":
                  n = "8.1";} else t.android ? n = i(/Android ([._\d]+)/.exec(e), 1) : t.iOS ? n = i(/OS ([._\d]+)/.exec(e), 1) : t.mac && (n = i(/Mac OS X (10[._\d]+)/.exec(e), 1));if (n) {
               r = parseInt(n, 10);var u = n.split(/[._]/);u && (o = parseInt(u[1], 10));
            }return { version: n, major: r, minor: o };
         }.bind(void 0, c, u)), enumerable: !0 } }), Object.defineProperties(s, { flash: { get: Object(o.C)(r.h), enumerable: !0 }, flashVersion: { get: Object(o.C)(r.a), enumerable: !0 }, iframe: { get: Object(o.C)(r.m), enumerable: !0 }, passiveEvents: { get: Object(o.C)(function () {
            var t = !1;try {
               var e = Object.defineProperty({}, "passive", { get: function get() {
                     return t = !0;
                  } });window.addEventListener("testPassive", null, e), window.removeEventListener("testPassive", null, e);
            } catch (t) {}return t;
         }), enumerable: !0 }, backgroundLoading: { get: Object(o.C)(function () {
            return !(c.iOS || a.safari);
         }), enumerable: !0 } });
}, function (t, e, n) {
   "use strict";
   n.d(e, "a", function () {
      return l;
   }), n.d(e, "d", function () {
      return f;
   }), n.d(e, "b", function () {
      return d;
   }), n.d(e, "c", function () {
      return p;
   });var r = n(28),
       i = n(29),
       o = n(15),
       u = n(14),
       a = n(38),
       c = n(1),
       s = null,
       l = {};function f(t) {
      return s || (s = function (t) {
         var e = t.get("controls"),
             s = h(),
             f = function (t, e) {
            var n = t.get("playlist");if (Array.isArray(n) && n.length) for (var u = Object(i.c)(Object(r.a)(n[0]), t), a = 0; a < u.length; a++) {
               for (var c = u[a], s = t.getProviders(), l = 0; l < o.a.length; l++) {
                  var f = o.a[l];if (s.providerSupports(f, c)) return f.name === e;
               }
            }return !1;
         }(t, "html5");if (e && s && f) return function () {
            var t = n.e(8).then(function (t) {
               n(36);var e = n(20).default;return a.a.controls = n(21).default, Object(u.a)(n(128).default), e;
            }.bind(null, n)).catch(d(c.t + 105));return l.html5 = t, t;
         }();if (e && f) return function () {
            var t = n.e(7).then(function (t) {
               var e = n(20).default;return a.a.controls = n(21).default, Object(u.a)(n(128).default), e;
            }.bind(null, n)).catch(d(c.t + 104));return l.html5 = t, t;
         }();if (e && s) return n.e(6).then(function (t) {
            n(36);var e = n(20).default;return a.a.controls = n(21).default, e;
         }.bind(null, n)).catch(d(c.t + 103));if (e) return n.e(5).then(function (t) {
            var e = n(20).default;return a.a.controls = n(21).default, e;
         }.bind(null, n)).catch(d(c.t + 102));return (h() ? n.e(3).then(function (t) {
            return n(36);
         }.bind(null, n)).catch(d(c.t + 120)) : Promise.resolve()).then(function () {
            return n.e(4).then(function (t) {
               return n(20).default;
            }.bind(null, n)).catch(d(c.t + 101));
         });
      }(t)), s;
   }function d(t, e) {
      return function () {
         throw new c.s(c.m, t, e);
      };
   }function p(t, e) {
      return function () {
         throw new c.s(null, t, e);
      };
   }function h() {
      var t = window.IntersectionObserverEntry;return !(t && "IntersectionObserver" in window && "intersectionRatio" in t.prototype);
   }
}, function (t, e, n) {
   "use strict";
   n.r(e), n.d(e, "exists", function () {
      return i;
   }), n.d(e, "isHTTPS", function () {
      return o;
   }), n.d(e, "isRtmp", function () {
      return u;
   }), n.d(e, "isYouTube", function () {
      return a;
   }), n.d(e, "typeOf", function () {
      return c;
   }), n.d(e, "isDeepKeyCompliant", function () {
      return s;
   });var r = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (t) {
      return typeof t === "undefined" ? "undefined" : _typeof(t);
   } : function (t) {
      return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t === "undefined" ? "undefined" : _typeof(t);
   };function i(t) {
      switch (void 0 === t ? "undefined" : r(t)) {case "string":
            return t.length > 0;case "object":
            return null !== t;case "undefined":
            return !1;default:
            return !0;}
   }function o() {
      return "https:" === window.location.protocol;
   }function u(t, e) {
      return 0 === t.indexOf("rtmp:") || "rtmp" === e;
   }function a(t, e) {
      return "youtube" === e || /^(http|\/\/).*(youtube\.com|youtu\.be)\/.+/.test(t);
   }function c(t) {
      if (null === t) return "null";var e = void 0 === t ? "undefined" : r(t);return "object" === e && Array.isArray(t) ? "array" : e;
   }function s(t, e, n) {
      var i = Object.keys(t);return Object.keys(e).length >= i.length && i.every(function (i) {
         var o = t[i],
             u = e[i];return o && "object" === (void 0 === o ? "undefined" : r(o)) ? !(!u || "object" !== (void 0 === u ? "undefined" : r(u))) && s(o, u, n) : n(i, t);
      });
   }
}, function (t, e, n) {
   "use strict";
   n.d(e, "h", function () {
      return o;
   }), n.d(e, "e", function () {
      return u;
   }), n.d(e, "o", function () {
      return a;
   }), n.d(e, "d", function () {
      return l;
   }), n.d(e, "a", function () {
      return f;
   }), n.d(e, "l", function () {
      return d;
   }), n.d(e, "m", function () {
      return p;
   }), n.d(e, "p", function () {
      return h;
   }), n.d(e, "n", function () {
      return v;
   }), n.d(e, "g", function () {
      return g;
   }), n.d(e, "b", function () {
      return m;
   }), n.d(e, "f", function () {
      return b;
   }), n.d(e, "c", function () {
      return y;
   }), n.d(e, "j", function () {
      return j;
   }), n.d(e, "i", function () {
      return w;
   }), n.d(e, "k", function () {
      return O;
   });var r = n(2),
       i = n(0);function o(t, e) {
      return t.classList.contains(e);
   }function u(t) {
      var e = document.createElement("div");return e.innerHTML = t, e.firstChild;
   }function a(t) {
      return t + (t.toString().indexOf("%") > 0 ? "" : "px");
   }function c(t) {
      return Object(i.x)(t.className) ? t.className.split(" ") : [];
   }function s(t, e) {
      e = Object(r.h)(e), t.className !== e && (t.className = e);
   }function l(t) {
      return t.classList ? t.classList : c(t);
   }function f(t, e) {
      var n = c(t);(Array.isArray(e) ? e : e.split(" ")).forEach(function (t) {
         Object(i.e)(n, t) || n.push(t);
      }), s(t, n.join(" "));
   }function d(t, e) {
      var n = c(t),
          r = Array.isArray(e) ? e : e.split(" ");s(t, Object(i.h)(n, r).join(" "));
   }function p(t, e, n) {
      var r = t.className || "";e.test(r) ? r = r.replace(e, n) : n && (r += " " + n), s(t, r);
   }function h(t, e, n) {
      var r = o(t, e);(n = Object(i.r)(n) ? n : !r) !== r && (n ? f(t, e) : d(t, e));
   }function v(t, e, n) {
      t.setAttribute(e, n);
   }function g(t) {
      for (; t.firstChild;) {
         t.removeChild(t.firstChild);
      }
   }function m(t) {
      var e = document.createElement("link");e.rel = "stylesheet", e.href = t, document.getElementsByTagName("head")[0].appendChild(e);
   }function b(t) {
      t && g(t);
   }function y(t) {
      var e = { left: 0, right: 0, width: 0, height: 0, top: 0, bottom: 0 };if (!t || !document.body.contains(t)) return e;var n = t.getBoundingClientRect(),
          r = window.pageYOffset,
          i = window.pageXOffset;return n.width || n.height || n.left || n.top ? (e.left = n.left + i, e.right = n.right + i, e.top = n.top + r, e.bottom = n.bottom + r, e.width = n.right - n.left, e.height = n.bottom - n.top, e) : e;
   }function j(t, e) {
      t.insertBefore(e, t.firstChild);
   }function w(t) {
      return t.nextElementSibling;
   }function O(t) {
      return t.previousElementSibling;
   }
}, function (t, e, n) {
   "use strict";
   n.r(e), n.d(e, "getAbsolutePath", function () {
      return o;
   }), n.d(e, "isAbsolutePath", function () {
      return u;
   }), n.d(e, "parseXML", function () {
      return c;
   }), n.d(e, "serialize", function () {
      return s;
   }), n.d(e, "parseDimension", function () {
      return l;
   }), n.d(e, "timeFormat", function () {
      return f;
   });var r = n(9),
       i = n(0);function o(t, e) {
      if (Object(r.exists)(e) || (e = document.location.href), Object(r.exists)(t)) {
         if (u(t)) return t;var n = e.substring(0, e.indexOf("://") + 3),
             i = e.substring(n.length, e.indexOf("/", n.length + 1)),
             o = void 0;if (0 === t.indexOf("/")) o = t.split("/");else {
            var a = e.split("?")[0];o = (a = a.substring(n.length + i.length + 1, a.lastIndexOf("/"))).split("/").concat(t.split("/"));
         }for (var c = [], s = 0; s < o.length; s++) {
            o[s] && Object(r.exists)(o[s]) && "." !== o[s] && (".." === o[s] ? c.pop() : c.push(o[s]));
         }return n + i + "/" + c.join("/");
      }
   }function u(t) {
      return (/^(?:(?:https?|file):)?\/\//.test(t)
      );
   }function a(t) {
      return Object(i.b)(t, function (t) {
         return "parsererror" === t.nodeName;
      });
   }function c(t) {
      var e = null;try {
         (a((e = new window.DOMParser().parseFromString(t, "text/xml")).childNodes) || e.childNodes && a(e.childNodes[0].childNodes)) && (e = null);
      } catch (t) {}return e;
   }function s(t) {
      if (void 0 === t) return null;if ("string" == typeof t && t.length < 6) {
         var e = t.toLowerCase();if ("true" === e) return !0;if ("false" === e) return !1;if (!Object(i.u)(Number(t)) && !Object(i.u)(parseFloat(t))) return Number(t);
      }return t;
   }function l(t) {
      return "string" == typeof t ? "" === t ? 0 : t.lastIndexOf("%") > -1 ? t : parseInt(t.replace("px", ""), 10) : t;
   }function f(t, e) {
      if (t <= 0 && !e || Object(i.u)(parseInt(t))) return "00:00";var n = t < 0 ? "-" : "";t = Math.abs(t);var r = Math.floor(t / 3600),
          o = Math.floor((t - 3600 * r) / 60),
          u = Math.floor(t % 60);return n + (r ? r + ":" : "") + (o < 10 ? "0" : "") + o + ":" + (u < 10 ? "0" : "") + u;
   }
}, function (t, e, n) {
   "use strict";
   n.d(e, "b", function () {
      return i;
   }), n.d(e, "c", function () {
      return o;
   }), n.d(e, "a", function () {
      return u;
   });var r = n(0),
       i = function i(t) {
      return t.replace(/^(.*\/)?([^-]*)-?.*\.(js)$/, "$2");
   };function o(t) {
      var e = 305e3;if (!t) return e;switch (i(t)) {case "jwpsrv":
            e = 305001;break;case "googima":
            e = 305002;break;case "vast":
            e = 305003;break;case "freewheel":
            e = 305004;break;case "dai":
            e = 305005;break;case "gapro":
            e = 305006;}return e;
   }function u(t, e, n) {
      var i = t.name,
          o = document.createElement("div");o.id = n.id + "_" + i, o.className = "jw-plugin jw-reset";var u = Object(r.j)({}, e),
          a = t.getNewInstance(n, u, o);return n.addPlugin(i, a), a;
   }
}, function (t, e, n) {
   "use strict";
   e.a = [];
}, function (t, e, n) {
   "use strict";
   n.d(e, "a", function () {
      return a;
   });var r = n(34),
       i = n(15),
       o = n(55),
       u = n(0);function a(t) {
      var e = t.getName().name;if (!r.a[e]) {
         if (!Object(u.l)(i.a, Object(u.B)({ name: e }))) {
            if (!Object(u.t)(t.supports)) throw new Error("Tried to register a provider with an invalid object");i.a.unshift({ name: e, supports: t.supports });
         }Object(u.g)(t.prototype, o.a), r.a[e] = t;
      }
   }
}, function (t, e, n) {
   "use strict";
   var r = n(32),
       i = n(7),
       o = n(17),
       u = n(0),
       a = n(9),
       c = n(37),
       s = Object(u.l)(r.a, Object(u.B)({ name: "html5" })),
       l = s.supports;function f(t) {
      var e = window.MediaSource;return Object(u.a)(t, function (t) {
         return !!e && !!e.isTypeSupported && e.isTypeSupported(t);
      });
   }s.supports = function (t, e) {
      var n = l.apply(this, arguments);if (n && t.drm && "hls" === t.type) {
         var r = Object(o.a)(e)("drm");if (r && t.drm.fairplay) {
            var i = window.WebKitMediaKeys;return i && i.isTypeSupported && i.isTypeSupported("com.apple.fps.1_0", "video/mp4");
         }return r;
      }return n;
   }, r.a.push({ name: "shaka", supports: function supports(t) {
         return !(t.drm && !Object(c.a)(t.drm)) && !(!window.HTMLVideoElement || !window.MediaSource) && f(t.mediaTypes) && ("dash" === t.type || "mpd" === t.type || (t.file || "").indexOf("mpd-time-csf") > -1);
      } }), r.a.splice(0, 0, { name: "hlsjs", supports: function supports(t) {
         if (t.drm) return !1;var e = t.file.indexOf(".m3u8") > -1,
             n = "hls" === t.type || "m3u8" === t.type;if (!e && !n) return !1;var r = i.Browser.chrome || i.Browser.firefox || i.Browser.edge || i.Browser.ie && 11 === i.Browser.version.major,
             o = i.OS.android && !1 === t.hlsjsdefault,
             u = i.Browser.safari && !!t.safarihlsjs;return f(t.mediaTypes || ['video/mp4;codecs="avc1.4d400d,mp4a.40.2"']) && (r || u) && !o;
      } }), r.a.push({ name: "flash", supports: function supports(t) {
         if (!i.Features.flash || t.drm) return !1;var e = t.type;return "hls" === e || "m3u8" === e || !Object(a.isRtmp)(t.file, e) && ["flv", "f4v", "mov", "m4a", "m4v", "mp4", "aac", "f4a", "mp3", "mpeg", "smil"].indexOf(e) > -1;
      } }), e.a = r.a;
}, function (t, e, n) {
   "use strict";
   n.d(e, "a", function () {
      return r;
   });var r = Date.now || function () {
      return new Date().getTime();
   };
}, function (t, e, n) {
   "use strict";
   n.d(e, "a", function () {
      return p;
   });var r = "free",
       i = "starter",
       o = "business",
       u = "premium",
       a = "enterprise",
       c = "platinum",
       s = "ads",
       l = "unlimited",
       f = "trial",
       d = "invalid";function p(t) {
      var e = { setup: [r, i, o, u, a, s, l, f, c], drm: [a, s, l, f], ads: [s, l, f, c, a], jwpsrv: [r, i, o, u, a, s, f, c, d], discovery: [s, a, f, l] };return function (n) {
         return e[n] && e[n].indexOf(t) > -1;
      };
   }
}, function (t, e, n) {
   "use strict";
   n.r(e), n.d(e, "getScriptPath", function () {
      return i;
   }), n.d(e, "repo", function () {
      return o;
   }), n.d(e, "versionCheck", function () {
      return u;
   }), n.d(e, "loadFrom", function () {
      return a;
   });var r = n(31),
       i = function i(t) {
      for (var e = document.getElementsByTagName("script"), n = 0; n < e.length; n++) {
         var r = e[n].src;if (r) {
            var i = r.lastIndexOf("/" + t);if (i >= 0) return r.substr(0, i + 1);
         }
      }return "";
   },
       o = function o() {
      var t = "//ssl.p.jwpcdn.com/player/v/8.6.2/";return "" + ("file:" === window.location.protocol ? "https:" : "") + t;
   },
       u = function u(t) {
      var e = ("0" + t).split(/\W/),
          n = r.a.split(/\W/),
          i = parseFloat(e[0]),
          o = parseFloat(n[0]);return !(i > o) && !(i === o && parseFloat("0" + e[1]) > parseFloat(n[1]));
   },
       a = function a() {
      return o();
   };
}, function (t, e, n) {
   "use strict";
   n.d(e, "d", function () {
      return p;
   }), n.d(e, "b", function () {
      return h;
   }), n.d(e, "e", function () {
      return g;
   }), n.d(e, "g", function () {
      return b;
   }), n.d(e, "c", function () {
      return y;
   }), n.d(e, "f", function () {
      return j;
   }), n.d(e, "h", function () {
      return w;
   }), n.d(e, "a", function () {
      return O;
   });var r = n(0),
       i = n(6),
       o = n(27),
       u = n(9),
       a = n(39),
       c = {},
       s = { zh: "Chinese", nl: "Dutch", en: "English", fr: "French", de: "German", it: "Italian", ja: "Japanese", pt: "Portuguese", ru: "Russian", es: "Spanish", el: "Greek" },
       l = Object(r.q)(s);function f(t) {
      var e = d(t),
          n = e.indexOf("_");return -1 === n ? e : e.substring(0, n);
   }function d(t) {
      return t.toLowerCase().replace("-", "_");
   }function p(t) {
      if (t) return 3 === t.length ? t : s[f(t)] || t;
   }function h(t) {
      return l[t] || "";
   }function v(t) {
      var e = t.querySelector("html");return e ? e.getAttribute("lang") : null;
   }function g() {
      var t = v(document);if (!t && Object(i.m)()) try {
         t = v(window.top.document);
      } catch (t) {}return t || navigator.language || "en";
   }var m = ["ar", "da", "de", "es", "fr", "it", "ja", "nl", "no", "pt", "ro", "sv", "tr", "zh"];function b(t) {
      return m.indexOf(f(t)) >= 0;
   }function y(t, e, n) {
      return e = function (t) {
         return Object.keys(t).reduce(function (e, n) {
            return e[d(n)] = t[n], e;
         }, {});
      }(e), Object(r.j)({}, t, e[f(n)], e[d(n)]);
   }function j(t) {
      return Object(u.isDeepKeyCompliant)(a.a, t, function (t, e) {
         return "string" == typeof e[t];
      });
   }function w(t, e) {
      var n = c[e];if (!n) {
         var r = t + "translations/" + f(e) + ".json";c[e] = n = new Promise(function (t, n) {
            Object(o.a)({ url: r, oncomplete: t, onerror: function onerror(t, r, i, o) {
                  c[e] = null, n(o);
               }, responseType: "json" });
         });
      }return n;
   }function O(t, e) {
      var n = Object(r.j)({}, t, e);return k(n, "errors", t, e), k(n, "related", t, e), k(n, "sharing", t, e), k(n, "advertising", t, e), n;
   }function k(t, e, n, i) {
      t[e] = Object(r.j)({}, n[e], i[e]);
   }
},,, function (t, e, n) {
   "use strict";
   e.a = { debug: !1 };
}, function (t, e, n) {
   "use strict";
   n.d(e, "a", function () {
      return a;
   }), n.d(e, "b", function () {
      return c;
   }), n.d(e, "d", function () {
      return s;
   }), n.d(e, "e", function () {
      return d;
   }), n.d(e, "c", function () {
      return h;
   });var r = n(2),
       i = n(41),
       o = n.n(i),
       u = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (t) {
      return typeof t === "undefined" ? "undefined" : _typeof(t);
   } : function (t) {
      return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t === "undefined" ? "undefined" : _typeof(t);
   },
       a = o.a.clear;function c(t, e, n, r) {
      n = n || "all-players";var i = "";if ("object" === (void 0 === e ? "undefined" : u(e))) {
         var a = document.createElement("div");s(a, e);var c = a.style.cssText;r && c && (c = c.replace(/;/g, " !important;")), i = "{" + c + "}";
      } else "string" == typeof e && (i = e);"" !== i && "{}" !== i ? o.a.style([[t, t + i]], n) : o.a.clear(n, t);
   }function s(t, e) {
      if (void 0 !== t && null !== t) {
         void 0 === t.length && (t = [t]);var n = void 0,
             r = {};for (n in e) {
            Object.prototype.hasOwnProperty.call(e, n) && (r[n] = f(n, e[n]));
         }for (var i = 0; i < t.length; i++) {
            var o = t[i],
                u = void 0;if (void 0 !== o && null !== o) for (n in r) {
               Object.prototype.hasOwnProperty.call(r, n) && (u = l(n), o.style[u] !== r[n] && (o.style[u] = r[n]));
            }
         }
      }
   }function l(t) {
      t = t.split("-");for (var e = 1; e < t.length; e++) {
         t[e] = t[e].charAt(0).toUpperCase() + t[e].slice(1);
      }return t.join("");
   }function f(t, e) {
      return "" === e || void 0 === e || null === e ? "" : "string" == typeof e && isNaN(e) ? /png|gif|jpe?g/i.test(e) && e.indexOf("url") < 0 ? "url(" + e + ")" : e : 0 === e || "z-index" === t || "opacity" === t ? "" + e : /color/i.test(t) ? "#" + Object(r.d)(e.toString(16).replace(/^0x/i, ""), 6) : Math.ceil(e) + "px";
   }function d(t, e) {
      s(t, { transform: e, webkitTransform: e, msTransform: e, mozTransform: e, oTransform: e });
   }var p = void 0;function h(t, e) {
      var n = "rgb",
          r = void 0 !== e && 100 !== e;if (r && (n += "a"), !p) {
         var i = document.createElement("canvas");i.height = 1, i.width = 1, p = i.getContext("2d");
      }t ? isNaN(parseInt(t, 16)) || (t = "#" + t) : t = "#000000", p.clearRect(0, 0, 1, 1), p.fillStyle = t, p.fillRect(0, 0, 1, 1);var o = p.getImageData(0, 0, 1, 1).data;return n += "(" + o[0] + ", " + o[1] + ", " + o[2], r && (n += ", " + e / 100), n + ")";
   }
}, function (t, e, n) {
   "use strict";
   var r = n(0),
       i = n(5),
       o = n(3),
       u = {},
       a = 45e3,
       c = 2,
       s = 3;function l(t) {
      var e = document.createElement("link");return e.type = "text/css", e.rel = "stylesheet", e.href = t, e;
   }function f(t) {
      var e = document.createElement("script");return e.type = "text/javascript", e.charset = "utf-8", e.async = !0, e.timeout = a, e.src = t, e;
   }var d = function d(t, e) {
      var n = this,
          r = 0;function i(t) {
         r = c, n.trigger(o.w, t).off();
      }function d(t) {
         r = s, n.trigger(o.Ka, t).off();
      }this.getStatus = function () {
         return r;
      }, this.load = function () {
         var n = u[t];return 0 !== r ? n : (n && n.then(d).catch(i), r = 1, n = new Promise(function (n, r) {
            var o = (e ? l : f)(t),
                u = function u() {
               o.onerror = o.onload = null, clearTimeout(s);
            },
                c = function c(t) {
               u(), i(t), r(t);
            },
                s = setTimeout(function () {
               c(new Error("Network timeout " + t));
            }, a);o.onerror = function () {
               c(new Error("Failed to load " + t));
            }, o.onload = function (t) {
               u(), d(t), n(t);
            };var p = document.getElementsByTagName("head")[0] || document.documentElement;p.insertBefore(o, p.firstChild);
         }), u[t] = n, n);
      };
   };Object(r.j)(d.prototype, i.a), e.a = d;
}, function (t, e, n) {
   "use strict";
   var r = n(1),
       i = n(12),
       o = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (t) {
      return typeof t === "undefined" ? "undefined" : _typeof(t);
   } : function (t) {
      return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t === "undefined" ? "undefined" : _typeof(t);
   },
       u = function u() {
      this.load = function (t, e, n, u) {
         return n && "object" === (void 0 === n ? "undefined" : o(n)) ? Promise.all(Object.keys(n).filter(function (t) {
            return t;
         }).map(function (o) {
            var a = n[o];return e.setupPlugin(o).then(function (e) {
               if (!u.attributes._destroyed) return Object(i.a)(e, a, t);
            }).catch(function (t) {
               return e.removePlugin(o), t.code ? t : new r.s(null, Object(i.c)(o), t);
            });
         })) : Promise.resolve();
      };
   },
       a = n(48),
       c = n(47),
       s = {},
       l = function l() {},
       f = l.prototype;f.setupPlugin = function (t) {
      var e = this.getPlugin(t);return e ? (e.url !== t && Object(c.a)('JW Plugin "' + Object(i.b)(t) + '" already loaded from "' + e.url + '". Ignoring "' + t + '."'), e.promise) : this.addPlugin(t).load();
   }, f.addPlugin = function (t) {
      var e = Object(i.b)(t),
          n = s[e];return n || (n = new a.a(t), s[e] = n), n;
   }, f.getPlugin = function (t) {
      return s[Object(i.b)(t)];
   }, f.removePlugin = function (t) {
      delete s[Object(i.b)(t)];
   }, f.getPlugins = function () {
      return s;
   };var d = l;n.d(e, "b", function () {
      return h;
   }), n.d(e, "a", function () {
      return v;
   });var p = new d(),
       h = function h(t, e, n) {
      var r = p.addPlugin(t);r.js || r.registerPlugin(t, e, n);
   };function v(t, e) {
      var n = t.get("plugins");return window.jwplayerPluginJsonp = h, (t.pluginLoader = t.pluginLoader || new u()).load(e, p, n, t).then(function (e) {
         if (!t.attributes._destroyed) return delete window.jwplayerPluginJsonp, e;
      });
   }
}, function (t, e, n) {
   "use strict";
   n.d(e, "a", function () {
      return a;
   });var r = n(46),
       i = n(17),
       o = n(44),
       u = n(1),
       a = 100013;e.b = function (t) {
      var e = void 0,
          n = void 0,
          c = void 0;try {
         var s = Object(r.a)(t || "", Object(o.a)("NDh2aU1Cb0NHRG5hcDFRZQ==")).split("/");if ("pro" === (e = s[0]) && (e = "premium"), Object(i.a)(e)("setup") || (e = "invalid"), s.length > 2) {
            n = s[1];var l = parseInt(s[2]);l > 0 && (c = new Date()).setTime(l);
         }
      } catch (t) {
         e = "invalid";
      }this.edition = function () {
         return e;
      }, this.token = function () {
         return n;
      }, this.expiration = function () {
         return c;
      }, this.duration = function () {
         return c ? c.getTime() - new Date().getTime() : 0;
      }, this.error = function () {
         var r = void 0;return void 0 === t ? r = 100011 : "invalid" !== e && n ? this.duration() < 0 && (r = a) : r = 100012, r ? new u.s(u.m, r) : null;
      };
   };
}, function (t, e, n) {
   "use strict";
   n.d(e, "a", function () {
      return g;
   });var r = n(0),
       i = n(11),
       o = n(1),
       u = 1,
       a = 2,
       c = 3,
       s = 4,
       l = 5,
       f = 6,
       d = 601,
       p = 602,
       h = 611,
       v = function v() {};function g(t, e, n, d) {
      t === Object(t) && (t = (d = t).url);var j = void 0,
          w = Object(r.j)({ xhr: null, url: t, withCredentials: !1, retryWithoutCredentials: !1, timeout: 6e4, timeoutId: -1, oncomplete: e || v, onerror: n || v, mimeType: d && !d.responseType ? "text/xml" : "", requireValidXML: !1, responseType: d && d.plainText ? "text" : "", useDomParser: !1, requestFilter: null }, d),
          O = function (t, e) {
         return function (t, n) {
            var i = t.currentTarget || e.xhr;if (clearTimeout(e.timeoutId), e.retryWithoutCredentials && e.xhr.withCredentials) {
               m(i);var u = Object(r.j)({}, e, { xhr: null, withCredentials: !1, retryWithoutCredentials: !1 });g(u);
            } else !n && i.status >= 400 && i.status < 600 && (n = i.status), b(e, n ? o.o : o.r, n || f, t);
         };
      }(0, w);if ("XMLHttpRequest" in window) {
         if (j = w.xhr = w.xhr || new window.XMLHttpRequest(), "function" == typeof w.requestFilter) {
            var k = void 0;try {
               k = w.requestFilter({ url: t, xhr: j });
            } catch (t) {
               return O(t, l), j;
            }k && "open" in k && "send" in k && (j = w.xhr = k);
         }j.onreadystatechange = function (t) {
            return function (e) {
               var n = e.currentTarget || t.xhr;if (4 === n.readyState) {
                  if (clearTimeout(t.timeoutId), n.status >= 400) return void b(t, o.o, n.status < 600 ? n.status : f);if (200 === n.status) return function (t) {
                     return function (e) {
                        var n = e.currentTarget || t.xhr;if (clearTimeout(t.timeoutId), t.responseType) {
                           if ("json" === t.responseType) return function (t, e) {
                              if (!t.response || "string" == typeof t.response && '"' !== t.responseText.substr(1)) try {
                                 t = Object(r.j)({}, t, { response: JSON.parse(t.responseText) });
                              } catch (t) {
                                 return void b(e, o.o, h, t);
                              }return e.oncomplete(t);
                           }(n, t);
                        } else {
                           var u = n.responseXML,
                               a = void 0;if (u) try {
                              a = u.firstChild;
                           } catch (t) {}if (u && a) return y(n, u, t);if (t.useDomParser && n.responseText && !u && (u = Object(i.parseXML)(n.responseText)) && u.firstChild) return y(n, u, t);if (t.requireValidXML) return void b(t, o.o, p);
                        }t.oncomplete(n);
                     };
                  }(t)(e);
               }
            };
         }(w), j.onerror = O, "overrideMimeType" in j ? w.mimeType && j.overrideMimeType(w.mimeType) : w.useDomParser = !0;try {
            t = t.replace(/#.*$/, ""), j.open("GET", t, !0);
         } catch (t) {
            return O(t, c), j;
         }if (w.responseType) try {
            j.responseType = w.responseType;
         } catch (t) {}w.timeout && (w.timeoutId = setTimeout(function () {
            m(j), b(w, o.r, u);
         }, w.timeout), j.onabort = function () {
            clearTimeout(w.timeoutId);
         });try {
            w.withCredentials && "withCredentials" in j && (j.withCredentials = !0), j.send();
         } catch (t) {
            O(t, s);
         }return j;
      }b(w, o.r, a);
   }function m(t) {
      t.onload = null, t.onprogress = null, t.onreadystatechange = null, t.onerror = null, "abort" in t && t.abort();
   }function b(t, e, n, r) {
      t.onerror(e, t.url, t.xhr, new o.s(e, n, r));
   }function y(t, e, n) {
      var i = e.documentElement;if (!n.requireValidXML || "parsererror" !== i.nodeName && !i.getElementsByTagName("parsererror").length) return t.responseXML || (t = Object(r.j)({}, t, { responseXML: e })), n.oncomplete(t);b(n, o.o, d);
   }
}, function (t, e, n) {
   "use strict";
   var r = n(0),
       i = n(33),
       o = function o(t) {
      if (t && t.file) return Object(r.j)({}, { kind: "captions", default: !1 }, t);
   },
       u = Array.isArray;e.a = function (t) {
      u((t = t || {}).tracks) || delete t.tracks;var e = Object(r.j)({}, { sources: [], tracks: [], minDvrWindow: 120, dvrSeekLimit: 25 }, t);e.dvrSeekLimit < 5 && (e.dvrSeekLimit = 5), e.sources !== Object(e.sources) || u(e.sources) || (e.sources = [Object(i.a)(e.sources)]), u(e.sources) && 0 !== e.sources.length || (t.levels ? e.sources = t.levels : e.sources = [Object(i.a)(t)]);for (var n = 0; n < e.sources.length; n++) {
         var a = e.sources[n];if (a) {
            var c = a.default;a.default = !!c && "true" === c.toString(), e.sources[n].label || (e.sources[n].label = n.toString()), e.sources[n] = Object(i.a)(e.sources[n]);
         }
      }return e.sources = e.sources.filter(function (t) {
         return !!t;
      }), u(e.tracks) || (e.tracks = []), u(e.captions) && (e.tracks = e.tracks.concat(e.captions), delete e.captions), e.tracks = e.tracks.map(o).filter(function (t) {
         return !!t;
      }), e;
   };
}, function (t, e, n) {
   "use strict";
   var r = n(0),
       i = { none: !0, metadata: !0, auto: !0 };function o(t, e) {
      return i[t] ? t : i[e] ? e : "metadata";
   }var u = n(28),
       a = n(33),
       c = n(42),
       s = n(1);n.d(e, "b", function () {
      return l;
   }), n.d(e, "e", function () {
      return f;
   }), n.d(e, "d", function () {
      return d;
   }), n.d(e, "c", function () {
      return p;
   });function l(t, e, n) {
      return delete Object(r.j)({}, n).playlist, t.map(function (t) {
         return d(e, t, n);
      }).filter(function (t) {
         return !!t;
      });
   }function f(t) {
      if (!Array.isArray(t) || 0 === t.length) throw new s.s(s.o, 630);
   }function d(t, e, n) {
      var i = t.getProviders(),
          u = t.get("preload"),
          a = Object(r.j)({}, e);if (a.preload = o(e.preload, u), a.allSources = h(e, t), a.sources = v(a.allSources, i), a.sources.length) return a.file = a.sources[0].file, a.feedData = n, a;
   }var p = function p(t, e) {
      return v(h(t, e), e.getProviders());
   };function h(t, e) {
      var n = e.attributes,
          r = t.sources,
          i = t.allSources,
          u = t.preload,
          c = t.drm,
          s = g(t.withCredentials, n.withCredentials);return (i || r).map(function (t) {
         if (t !== Object(t)) return null;m(t, n, "androidhls"), m(t, n, "hlsjsdefault"), m(t, n, "safarihlsjs"), t.preload = o(t.preload, u);var e = t.drm || c || n.drm;e && (t.drm = e);var r = g(t.withCredentials, s);return void 0 !== r && (t.withCredentials = r), Object(a.a)(t);
      }).filter(function (t) {
         return !!t;
      });
   }function v(t, e) {
      e && e.choose || (e = new c.a());var n = function (t, e) {
         for (var n = 0; n < t.length; n++) {
            var r = t[n],
                i = e.choose(r),
                o = i.providerToCheck;if (o) return { type: r.type, provider: o };
         }return null;
      }(t, e);if (!n) return [];var r = n.provider,
          i = n.type;return t.filter(function (t) {
         return t.type === i && e.providerSupports(r, t);
      });
   }function g(t, e) {
      return void 0 === t ? e : t;
   }function m(t, e, n) {
      n in e && (t[n] = e[n]);
   }e.a = function (t) {
      return (Array.isArray(t) ? t : [t]).map(u.a);
   };
}, function (t, e, n) {
   "use strict";
   var r = n(0),
       i = n(16),
       o = window.performance || { timing: {} },
       u = o.timing.navigationStart || Object(i.a)();function a() {
      return u + o.now();
   }"now" in o || (o.now = function () {
      return Object(i.a)() - u;
   });e.a = function () {
      var t = {},
          e = {},
          n = {},
          i = {};return { start: function start(e) {
            t[e] = a(), n[e] = n[e] + 1 || 1;
         }, end: function end(n) {
            if (t[n]) {
               var r = a() - t[n];delete t[n], e[n] = e[n] + r || r;
            }
         }, dump: function dump() {
            var o = Object(r.j)({}, e);for (var u in t) {
               if (Object.prototype.hasOwnProperty.call(t, u)) {
                  var c = a() - t[u];o[u] = o[u] + c || c;
               }
            }return { counts: Object(r.j)({}, n), sums: o, events: Object(r.j)({}, i) };
         }, tick: function tick(t) {
            i[t] = a();
         }, clear: function clear(t) {
            delete i[t];
         }, between: function between(t, e) {
            return i[e] && i[t] ? i[e] - i[t] : null;
         } };
   };
}, function (t, e, n) {
   "use strict";
   n.d(e, "a", function () {
      return r;
   });var r = "8.6.2+commercial_v8-6-2.295.commercial.54a805c.hlsjs..jwplayer.cb419c0.dai.f0547f4.freewheel.31a10c7.googima.182acac.vast.993be40.analytics.3dadfbd.gapro.f664e4e.related.6aa5ac5";
}, function (t, e, n) {
   "use strict";
   n.d(e, "b", function () {
      return c;
   });var r = n(59),
       i = n(9),
       o = n(40),
       u = { aac: "audio/mp4", mp4: "video/mp4", f4v: "video/mp4", m4v: "video/mp4", mov: "video/mp4", mp3: "audio/mpeg", mpeg: "audio/mpeg", ogv: "video/ogg", ogg: "video/ogg", oga: "video/ogg", vorbis: "video/ogg", webm: "video/webm", f4a: "video/aac", m3u8: "application/vnd.apple.mpegurl", m3u: "application/vnd.apple.mpegurl", hls: "application/vnd.apple.mpegurl" },
       a = [{ name: "html5", supports: c }];function c(t) {
      if (!1 === Object(r.a)(t)) return !1;if (!o.a.canPlayType) return !1;var e = t.file,
          n = t.type;if (Object(i.isRtmp)(e, n)) return !1;var a = t.mimeType || u[n];if (!a) return !1;var c = t.mediaTypes;return c && c.length && (a = [a].concat(c.slice()).join("; ")), !!o.a.canPlayType(a);
   }e.a = a;
}, function (t, e, n) {
   "use strict";
   var r = n(0),
       i = n(9),
       o = n(2);e.a = function (t) {
      if (t && t.file) {
         var e = Object(r.j)({}, { default: !1 }, t);e.file = Object(o.h)("" + e.file);var n = /^[^/]+\/(?:x-)?([^/]+)$/;if (n.test(e.type) && (e.mimeType = e.type, e.type = e.type.replace(n, "$1")), Object(i.isYouTube)(e.file) ? e.type = "youtube" : Object(i.isRtmp)(e.file) ? e.type = "rtmp" : e.type || (e.type = Object(o.a)(e.file)), e.type) {
            switch (e.type) {case "m3u8":case "vnd.apple.mpegurl":
                  e.type = "hls";break;case "dash+xml":
                  e.type = "dash";break;case "m4a":
                  e.type = "aac";break;case "smil":
                  e.type = "rtmp";}return Object.keys(e).forEach(function (t) {
               "" === e[t] && delete e[t];
            }), e;
         }
      }
   };
}, function (t, e, n) {
   "use strict";
   e.a = {};
}, function (t, e, n) {
   "use strict";
   n.d(e, "b", function () {
      return x;
   });var r = n(7),
       i = n(3),
       o = n(51),
       u = n(16),
       a = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (t) {
      return typeof t === "undefined" ? "undefined" : _typeof(t);
   } : function (t) {
      return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t === "undefined" ? "undefined" : _typeof(t);
   },
       c = function () {
      function t(t, e) {
         for (var n = 0; n < e.length; n++) {
            var r = e[n];r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r);
         }
      }return function (e, n, r) {
         return n && t(e.prototype, n), r && t(e, r), e;
      };
   }(),
       s = function t(e, n, r) {
      null === e && (e = Function.prototype);var i = Object.getOwnPropertyDescriptor(e, n);if (void 0 === i) {
         var o = Object.getPrototypeOf(e);return null === o ? void 0 : t(o, n, r);
      }if ("value" in i) return i.value;var u = i.get;return void 0 !== u ? u.call(r) : void 0;
   };var l = "ontouchstart" in window,
       f = "PointerEvent" in window && !r.OS.android,
       d = !(f || l && r.OS.mobile),
       p = "window",
       h = r.Features.passiveEvents,
       v = !!h && { passive: !0 },
       g = 6,
       m = 300,
       b = 500,
       y = void 0,
       j = function (t) {
      function e(t, n) {
         !function (t, e) {
            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
         }(this, e);var r = function (t, e) {
            if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return !e || "object" != (typeof e === "undefined" ? "undefined" : _typeof(e)) && "function" != typeof e ? t : e;
         }(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this)),
             i = !(n = n || {}).preventScrolling;return r.directSelect = !!n.directSelect, r.dragged = !1, r.enableDoubleTap = !1, r.el = t, r.handlers = {}, r.lastClick = 0, r.lastStart = 0, r.passive = i, r.pointerId = null, r.startX = 0, r.startY = 0, r;
      }return function (t, e) {
         if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + (typeof e === "undefined" ? "undefined" : _typeof(e)));t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
      }(e, o["a"]), c(e, [{ key: "on", value: function value(t, n, r) {
            return O(t) && (this.handlers[t] || C[t](this)), s(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "on", this).call(this, t, n, r);
         } }, { key: "off", value: function value(t, n, r) {
            var i = this;if (O(t)) S(this, t);else if (!t) {
               var o = this.handlers;Object.keys(o).forEach(function (t) {
                  S(i, t);
               });
            }return s(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "off", this).call(this, t, n, r);
         } }, { key: "destroy", value: function value() {
            this.off(), f && T(this), this.el = null;
         } }]), e;
   }();e.a = j;var w = /\s+/;function O(t) {
      return t && !(w.test(t) || "object" === (void 0 === t ? "undefined" : a(t)));
   }function k(t) {
      if (!t.handlers.init) {
         var e = t.el,
             n = t.passive,
             r = !!h && { passive: n },
             o = function o(i) {
            if (!function (t) {
               if ("which" in t) return 3 === t.which;if ("button" in t) return 2 === t.button;return !1;
            }(i)) {
               var o = i.target,
                   s = i.type;if (!t.directSelect || o === e) {
                  var l = A(i),
                      f = l.pageX,
                      d = l.pageY;if (t.dragged = !1, t.lastStart = Object(u.a)(), t.startX = f, t.startY = d, S(t, p), "pointerdown" === s && i.isPrimary) {
                     if (!n) {
                        var h = i.pointerId;t.pointerId = h, e.setPointerCapture(h);
                     }P(t, p, "pointermove", a, r), P(t, p, "pointercancel", c), P(t, p, "pointerup", c);
                  } else "mousedown" === s ? (P(t, p, "mousemove", a, r), P(t, p, "mouseup", c)) : "touchstart" === s && (P(t, p, "touchmove", a, r), P(t, p, "touchcancel", c), P(t, p, "touchend", c), n || N(i));
               }
            }
         },
             a = function a(e) {
            if (t.dragged) _(t, i.s, e);else {
               var r = A(e),
                   o = r.pageX,
                   u = r.pageY,
                   a = o - t.startX,
                   c = u - t.startY;a * a + c * c > g * g && (_(t, i.u, e), t.dragged = !0, _(t, i.s, e));
            }n || "touchmove" !== e.type || N(e);
         },
             c = function c(n) {
            if (clearTimeout(y), T(t), S(t, p), t.dragged) t.dragged = !1, _(t, i.t, n);else if (-1 === n.type.indexOf("cancel") && e.contains(n.target)) {
               if (Object(u.a)() - t.lastStart > b) return;var r = "pointerup" === n.type || "pointercancel" === n.type,
                   o = "mouseup" === n.type || r && "mouse" === n.pointerType;!function (t, e, n) {
                  if (t.enableDoubleTap) if (Object(u.a)() - t.lastClick < m) {
                     var r = n ? i.q : i.r;_(t, r, e), t.lastClick = 0;
                  } else t.lastClick = Object(u.a)();
               }(t, n, o), o ? _(t, i.n, n) : (_(t, i.Ra, n), "touchend" !== n.type || h || N(n));
            }
         };f ? P(t, "init", "pointerdown", o, r) : (d && P(t, "init", "mousedown", o, r), P(t, "init", "touchstart", o, r));
      }
   }var C = { drag: function drag(t) {
         k(t);
      }, dragStart: function dragStart(t) {
         k(t);
      }, dragEnd: function dragEnd(t) {
         k(t);
      }, click: function click(t) {
         k(t);
      }, tap: function tap(t) {
         k(t);
      }, doubleTap: function doubleTap(t) {
         t.enableDoubleTap = !0, k(t);
      }, doubleClick: function doubleClick(t) {
         t.enableDoubleTap = !0, k(t);
      }, longPress: function longPress(t) {
         if (r.OS.iOS) {
            var e = function e() {
               clearTimeout(y);
            };P(t, "longPress", "touchstart", function (n) {
               e(), y = setTimeout(function () {
                  _(t, "longPress", n);
               }, b);
            }), P(t, "longPress", "touchmove", e), P(t, "longPress", "touchcancel", e), P(t, "longPress", "touchend", e);
         } else t.el.oncontextmenu = function (e) {
            return _(t, "longPress", e), !1;
         };
      }, focus: function focus(t) {
         P(t, "focus", "focus", function (e) {
            E(t, "focus", e);
         });
      }, blur: function blur(t) {
         P(t, "blur", "blur", function (e) {
            E(t, "blur", e);
         });
      }, over: function over(t) {
         (f || d) && P(t, i.Y, f ? "pointerover" : "mouseover", function (e) {
            "touch" !== e.pointerType && _(t, i.Y, e);
         });
      }, out: function out(t) {
         if (f) {
            var e = t.el;P(t, i.X, "pointerout", function (n) {
               if ("touch" !== n.pointerType && "x" in n) {
                  var r = document.elementFromPoint(n.x, n.y);e.contains(r) || _(t, i.X, n);
               }
            });
         } else d && P(t, i.X, "mouseout", function (e) {
            _(t, i.X, e);
         });
      }, move: function move(t) {
         (f || d) && P(t, i.V, f ? "pointermove" : "mousemove", function (e) {
            "touch" !== e.pointerType && _(t, i.V, e);
         });
      }, enter: function enter(t) {
         P(t, i.v, "keydown", function (e) {
            "Enter" !== e.key && 13 !== e.keyCode || (e.stopPropagation(), E(t, i.v, e));
         });
      }, gesture: function gesture(t) {
         var e = function e(_e) {
            return _(t, "gesture", _e);
         };P(t, "gesture", "click", e), P(t, "gesture", "keydown", e);
      } };function x(t) {
      var e = t.ownerDocument || t;return e.defaultView || e.parentWindow || window;
   }function P(t, e, n, r, i) {
      var o = t.handlers[e];if (o || (o = t.handlers[e] = {}), o[n]) throw new Error(e + " " + n + " already registered");o[n] = r;var u = t.el;(e === p ? x(u) : u).addEventListener(n, r, i || v);
   }function S(t, e) {
      var n = t.el,
          r = t.handlers,
          i = e === p ? x(n) : n,
          o = r[e];o && (Object.keys(o).forEach(function (t) {
         i.removeEventListener(t, o[t]);
      }), r[e] = null);
   }function T(t) {
      var e = t.el;null !== t.pointerId && (e.releasePointerCapture(t.pointerId), t.pointerId = null);
   }function E(t, e, n) {
      var r = t.el,
          i = n.target;t.trigger(e, { type: e, sourceEvent: n, currentTarget: r, target: i });
   }function _(t, e, n) {
      var r = function (t, e, n) {
         var r = e.target,
             i = e.touches,
             o = e.changedTouches,
             u = e.pointerType,
             a = void 0;i || o ? (a = i && i.length ? i[0] : o[0], u = u || "touch") : (a = e, u = u || "mouse");var c = a,
             s = c.pageX,
             l = c.pageY;return { type: t, pointerType: u, pageX: s, pageY: l, sourceEvent: e, currentTarget: n, target: r };
      }(e, n, t.el);t.trigger(e, r);
   }function A(t) {
      return 0 === t.type.indexOf("touch") ? (t.originalEvent || t).changedTouches[0] : t;
   }function N(t) {
      t.preventDefault && t.preventDefault();
   }
},, function (t, e, n) {
   "use strict";
   n.d(e, "b", function () {
      return c;
   }), n.d(e, "d", function () {
      return s;
   }), n.d(e, "c", function () {
      return l;
   }), n.d(e, "a", function () {
      return f;
   });var r = n(17),
       i = [{ configName: "clearkey", keyName: "org.w3.clearkey" }, { configName: "widevine", keyName: "com.widevine.alpha" }, { configName: "playready", keyName: "com.microsoft.playready" }],
       o = [],
       u = {},
       a = void 0;function c(t) {
      return t.some(function (t) {
         return !!t.drm || t.sources.some(function (t) {
            return !!t.drm;
         });
      });
   }function s(t) {
      return a || ((navigator.requestMediaKeySystemAccess && MediaKeySystemAccess.prototype.getConfiguration || window.MSMediaKeys) && Object(r.a)(t)("drm") ? (i.forEach(function (t) {
         var e = function (t, e) {
            return navigator.requestMediaKeySystemAccess ? navigator.requestMediaKeySystemAccess(t, e) : new Promise(function (e, n) {
               var r = void 0;try {
                  r = new window.MSMediaKeys(t);
               } catch (t) {
                  return void n(t);
               }e(r);
            });
         }(t.keyName, [{ initDataTypes: ["cenc"], videoCapabilities: [{ contentType: 'video/mp4;codecs="avc1.4d401e"' }], audioCapabilities: [{ contentType: 'audio/mp4;codecs="mp4a.40.2"' }] }]).then(function () {
            u[t.configName] = !0;
         }).catch(function () {
            u[t.configName] = !1;
         });o.push(e);
      }), a = Promise.all(o)) : Promise.resolve());
   }function l(t) {
      return u[t];
   }function f(t) {
      if (a) return Object.keys(t).some(function (t) {
         return l(t);
      });
   }
}, function (t, e, n) {
   "use strict";
   n.d(e, "a", function () {
      return o;
   }), n.d(e, "b", function () {
      return u;
   });var r = n(8),
       i = null,
       o = {};function u() {
      return i || (i = n.e(2).then(function (t) {
         var e = n(21).default;return o.controls = e, e;
      }.bind(null, n)).catch(function () {
         i = null, Object(r.c)(301130)();
      })), i;
   }
}, function (t, e, n) {
   "use strict";
   e.a = { advertising: { admessage: "This ad will end in xx", cuetext: "Advertisement", loadingAd: "Loading ad", podmessage: "Ad __AD_POD_CURRENT__ of __AD_POD_LENGTH__. ", skipmessage: "Skip ad in xx", skiptext: "Skip", displayHeading: "Advertisement" }, airplay: "AirPlay", audioTracks: "Audio Tracks", auto: "Auto", buffer: "Loading", cast: "Chromecast", cc: "Closed Captions", close: "Close", errors: { badConnection: "This video cannot be played because of a problem with your internet connection.", cantLoadPlayer: "Sorry, the video player failed to load.", cantPlayInBrowser: "The video cannot be played in this browser.", cantPlayVideo: "This video file cannot be played.", errorCode: "Error Code", liveStreamDown: "The live stream is either down or has ended.", protectedContent: "There was a problem providing access to protected content.", technicalError: "This video cannot be played because of a technical error." }, fullscreen: "Fullscreen", hd: "Quality", liveBroadcast: "Live", logo: "Logo", next: "Next", nextUp: "Next Up", notLive: "Not Live", off: "Off", pause: "Pause", play: "Play", playback: "Play", playbackRates: "Playback Rates", player: "Video Player", playlist: "Playlist", poweredBy: "Powered by", prev: "Previous", related: { autoplaymessage: "Next up in xx", heading: "More Videos" }, replay: "Replay", rewind: "Rewind 10 Seconds", settings: "Settings", sharing: { copied: "Copied", email: "Email", embed: "Embed", heading: "Share", link: "Link" }, slider: "Seek Slider", stop: "Stop", videoInfo: "About This Video", volume: "Volume", volumeSlider: "Volume Slider" };
}, function (t, e, n) {
   "use strict";
   var r = document.createElement("video");e.a = r;
}, function (t, e) {
   var n = {},
       r = {},
       i = function (t) {
      var e;return function () {
         return void 0 === e && (e = t.apply(this, arguments)), e;
      };
   }(function () {
      return document.head || document.getElementsByTagName("head")[0];
   });function o(t) {
      var e = document.createElement("style");return e.type = "text/css", e.setAttribute("data-jwplayer-id", t), function (t) {
         i().appendChild(t);
      }(e), e;
   }function u(t, e) {
      var n,
          i,
          u,
          a = r[t];a || (a = r[t] = { element: o(t), counter: 0 });var s = a.counter++;return n = a.element, u = function u() {
         c(n, s, "");
      }, (i = function i(t) {
         c(n, s, t);
      })(e.css), function (t) {
         if (t) {
            if (t.css === e.css && t.media === e.media) return;i((e = t).css);
         } else u();
      };
   }t.exports = { style: function style(t, e) {
         !function (t, e) {
            for (var r = 0; r < e.length; r++) {
               var i = e[r],
                   o = (n[t] || {})[i.id];if (o) {
                  for (var a = 0; a < o.parts.length; a++) {
                     o.parts[a](i.parts[a]);
                  }for (; a < i.parts.length; a++) {
                     o.parts.push(u(t, i.parts[a]));
                  }
               } else {
                  for (var c = [], a = 0; a < i.parts.length; a++) {
                     c.push(u(t, i.parts[a]));
                  }n[t] = n[t] || {}, n[t][i.id] = { id: i.id, parts: c };
               }
            }
         }(e, function (t) {
            for (var e = [], n = {}, r = 0; r < t.length; r++) {
               var i = t[r],
                   o = i[0],
                   u = i[1],
                   a = i[2],
                   c = { css: u, media: a };n[o] ? n[o].parts.push(c) : e.push(n[o] = { id: o, parts: [c] });
            }return e;
         }(t));
      }, clear: function clear(t, e) {
         var r = n[t];if (!r) return;if (e) {
            var i = r[e];if (i) for (var o = 0; o < i.parts.length; o += 1) {
               i.parts[o]();
            }return;
         }for (var u = Object.keys(r), a = 0; a < u.length; a += 1) {
            for (var c = r[u[a]], s = 0; s < c.parts.length; s += 1) {
               c.parts[s]();
            }
         }delete n[t];
      } };var a = function () {
      var t = [];return function (e, n) {
         return t[e] = n, t.filter(Boolean).join("\n");
      };
   }();function c(t, e, n) {
      if (t.styleSheet) t.styleSheet.cssText = a(e, n);else {
         var r = document.createTextNode(n),
             i = t.childNodes[e];i ? t.replaceChild(r, i) : t.appendChild(r);
      }
   }
}, function (t, e, n) {
   "use strict";
   var r = n(0),
       i = n(15),
       o = n(14),
       u = n(34),
       a = n(8);function c(t) {
      this.config = t || {};
   }var s = { html5: function html5() {
         return n.e(1).then(function (t) {
            var e = n(128).default;return Object(o.a)(e), e;
         }.bind(null, n)).catch(Object(a.b)(152));
      } };Object(r.j)(c.prototype, { load: function load(t) {
         var e = s[t],
             n = function n() {
            return Promise.reject(new Error("Failed to load media"));
         };return e ? e().then(function () {
            var e = u.a[t];return e || n();
         }) : n();
      }, providerSupports: function providerSupports(t, e) {
         return t.supports(e);
      }, choose: function choose(t) {
         if (t === Object(t)) for (var e = i.a.length, n = 0; n < e; n++) {
            var r = i.a[n];if (this.providerSupports(r, t)) return { priority: e - n - 1, name: r.name, type: t.type, providerToCheck: r, provider: u.a[r.name] };
         }return {};
      } });var l = c,
       f = void 0;Object(r.j)(s, { shaka: function shaka() {
         return n.e(11).then(function (t) {
            var e = n(147).default;return Object(o.a)(e), e;
         }.bind(null, n)).catch(Object(a.b)(154));
      }, hlsjs: function hlsjs() {
         return n.e(10).then(function (t) {
            var e = n(148).default;return e.setEdition && e.setEdition(f), Object(o.a)(e), e;
         }.bind(null, n)).catch(Object(a.b)(153));
      }, flash: function flash() {
         return n.e(9).then(function (t) {
            var e = n(145).default;return Object(o.a)(e), e;
         }.bind(null, n)).catch(Object(a.b)(151));
      } }), l.prototype.providerSupports = function (t, e) {
      return f = this.config.edition, t.supports(e, f);
   };e.a = l;
}, function (t, e, n) {
   "use strict";
   var r = function r(t, e, n, _r2) {
      var i = _r2 ? ("(" + n + ": " + _r2 + ")").replace(/\s+/g, "&nbsp;") : "";return '<div id="' + t + '" class="jw-error jw-reset"><div class="jw-error-msg jw-info-overlay jw-reset"><style>[id="' + t + '"].jw-error{background:#000;overflow:hidden;position:relative}[id="' + t + '"] .jw-error-msg{top:50%;left:50%;position:absolute;transform:translate(-50%,-50%)}[id="' + t + '"] .jw-error-text{color:#FFF;font:14px/1.35 Arial,Helvetica,sans-serif}</style><div class="jw-icon jw-reset"></div><div class="jw-info-container jw-reset"><div class="jw-error-text jw-reset">' + (e || "") + '<span class="jw-break jw-reset"></span>' + i + "</div></div></div></div>";
   },
       i = n(10),
       o = n(23);function u(t, e) {
      var n = e.message,
          u = e.code,
          a = r(t.get("id"), n, t.get("localization").errors.errorCode, u),
          c = t.get("width"),
          s = t.get("height"),
          l = Object(i.e)(a);return Object(o.d)(l, { width: c.toString().indexOf("%") > 0 ? c : c + "px", height: s.toString().indexOf("%") > 0 ? s : s + "px" }), l;
   }n.d(e, "a", function () {
      return u;
   });
}, function (t, e, n) {
   "use strict";
   n.d(e, "a", function () {
      return r;
   });var r = window.atob;
}, function (t, e, n) {
   "use strict";
   var r = n(4),
       i = n(2);function o(t) {
      for (var e = [], n = 0; n < Object(r.c)(t); n++) {
         var i = t.childNodes[n];"jwplayer" === i.prefix && "mediatypes" === Object(r.b)(i).toLowerCase() && e.push(Object(r.d)(i));
      }return e;
   }var u = function t(e, n) {
      var u = [];function a(t) {
         var e = { zh: "Chinese", nl: "Dutch", en: "English", fr: "French", de: "German", it: "Italian", ja: "Japanese", pt: "Portuguese", ru: "Russian", es: "Spanish" };return e[t] ? e[t] : t;
      }for (var c = 0; c < Object(r.c)(e); c++) {
         var s = e.childNodes[c];if ("media" === s.prefix) {
            if (!Object(r.b)(s)) continue;switch (Object(r.b)(s).toLowerCase()) {case "content":
                  if (Object(i.i)(s, "duration") && (n.duration = Object(i.f)(Object(i.i)(s, "duration"))), Object(i.i)(s, "url")) {
                     n.sources || (n.sources = []);var l = { file: Object(i.i)(s, "url"), type: Object(i.i)(s, "type"), width: Object(i.i)(s, "width"), label: Object(i.i)(s, "label") },
                         f = o(s);f.length && (l.mediaTypes = f), n.sources.push(l);
                  }Object(r.c)(s) > 0 && (n = t(s, n));break;case "title":
                  n.title = Object(r.d)(s);break;case "description":
                  n.description = Object(r.d)(s);break;case "guid":
                  n.mediaid = Object(r.d)(s);break;case "thumbnail":
                  n.image || (n.image = Object(i.i)(s, "url"));break;case "group":
                  t(s, n);break;case "subtitle":
                  var d = {};d.file = Object(i.i)(s, "url"), d.kind = "captions", Object(i.i)(s, "lang").length > 0 && (d.label = a(Object(i.i)(s, "lang"))), u.push(d);}
         }
      }n.hasOwnProperty("tracks") || (n.tracks = []);for (var p = 0; p < u.length; p++) {
         n.tracks.push(u[p]);
      }return n;
   },
       a = n(11),
       c = function c(t, e) {
      for (var n = "default", o = [], u = [], c = 0; c < t.childNodes.length; c++) {
         var s = t.childNodes[c];if ("jwplayer" === s.prefix) {
            var l = Object(r.b)(s);"source" === l ? (delete e.sources, o.push({ file: Object(i.i)(s, "file"), default: Object(i.i)(s, n), label: Object(i.i)(s, "label"), type: Object(i.i)(s, "type") })) : "track" === l ? (delete e.tracks, u.push({ file: Object(i.i)(s, "file"), default: Object(i.i)(s, n), kind: Object(i.i)(s, "kind"), label: Object(i.i)(s, "label") })) : (e[l] = Object(a.serialize)(Object(r.d)(s)), "file" === l && e.sources && delete e.sources);
         }e.file || (e.file = e.link);
      }if (o.length) {
         e.sources = [];for (var f = 0; f < o.length; f++) {
            o[f].file.length > 0 && (o[f][n] = "true" === o[f][n], o[f].label.length || delete o[f].label, e.sources.push(o[f]));
         }
      }if (u.length) {
         e.tracks = [];for (var d = 0; d < u.length; d++) {
            u[d].file.length > 0 && (u[d][n] = "true" === u[d][n], u[d].kind = u[d].kind.length ? u[d].kind : "captions", u[d].label.length || delete u[d].label, e.tracks.push(u[d]));
         }
      }return e;
   },
       s = n(28);function l(t) {
      var e = [];e.feedData = {};for (var n = 0; n < Object(r.c)(t); n++) {
         var i = Object(r.a)(t, n);if ("channel" === Object(r.b)(i).toLowerCase()) for (var o = 0; o < Object(r.c)(i); o++) {
            var u = Object(r.a)(i, o),
                a = Object(r.b)(u).toLowerCase();"item" === a ? e.push(f(u)) : a && (e.feedData[a] = Object(r.d)(u));
         }
      }return e;
   }function f(t) {
      for (var e = {}, n = 0; n < t.childNodes.length; n++) {
         var o = t.childNodes[n],
             a = Object(r.b)(o);if (a) switch (a.toLowerCase()) {case "enclosure":
               e.file = Object(i.i)(o, "url");break;case "title":
               e.title = Object(r.d)(o);break;case "guid":
               e.mediaid = Object(r.d)(o);break;case "pubdate":
               e.date = Object(r.d)(o);break;case "description":
               e.description = Object(r.d)(o);break;case "link":
               e.link = Object(r.d)(o);break;case "category":
               e.tags ? e.tags += Object(r.d)(o) : e.tags = Object(r.d)(o);}
      }return new s.a(c(t, u(t, e)));
   }n.d(e, "a", function () {
      return l;
   });
}, function (t, e, n) {
   "use strict";
   n.d(e, "a", function () {
      return o;
   });var r = n(44);function i(t) {
      for (var e = new Array(Math.ceil(t.length / 4)), n = 0; n < e.length; n++) {
         e[n] = t.charCodeAt(4 * n) + (t.charCodeAt(4 * n + 1) << 8) + (t.charCodeAt(4 * n + 2) << 16) + (t.charCodeAt(4 * n + 3) << 24);
      }return e;
   }function o(t, e) {
      if (t = String(t), e = String(e), 0 === t.length) return "";for (var n = i(Object(r.a)(t)), o = i(function (t) {
         return unescape(encodeURIComponent(t));
      }(e).slice(0, 16)), u = n.length, a = n[u - 1], c = n[0], s = void 0, l = void 0, f = 2654435769 * Math.floor(6 + 52 / u); f;) {
         l = f >>> 2 & 3;for (var d = u - 1; d >= 0; d--) {
            s = ((a = n[d > 0 ? d - 1 : u - 1]) >>> 5 ^ c << 2) + (c >>> 3 ^ a << 4) ^ (f ^ c) + (o[3 & d ^ l] ^ a), c = n[d] -= s;
         }f -= 2654435769;
      }return function (t) {
         try {
            return decodeURIComponent(escape(t));
         } catch (e) {
            return t;
         }
      }(function (t) {
         for (var e = new Array(t.length), n = 0; n < t.length; n++) {
            e[n] = String.fromCharCode(255 & t[n], t[n] >>> 8 & 255, t[n] >>> 16 & 255, t[n] >>> 24 & 255);
         }return e.join("");
      }(n).replace(/\0+$/, ""));
   }
}, function (t, e, n) {
   "use strict";
   n.d(e, "a", function () {
      return r;
   });var r = "function" == typeof console.log ? console.log.bind(console) : function () {};
}, function (t, e, n) {
   "use strict";
   var r = n(0),
       i = n(24),
       o = n(11),
       u = n(2),
       a = n(1),
       c = n(12),
       s = 0,
       l = 1,
       f = function f(t) {
      if ("string" == typeof t) {
         var e = (t = t.split("?")[0]).indexOf("://");if (e > 0) return s;var n = t.indexOf("/"),
             r = Object(u.a)(t);return !(e < 0 && n < 0) || r && isNaN(r) ? l : 2;
      }
   };var d = function d(t) {
      this.url = t, this.promise_ = null;
   };Object.defineProperties(d.prototype, { promise: { get: function get() {
            return this.promise_ || this.load();
         }, set: function set() {} } }), Object(r.j)(d.prototype, { load: function load() {
         var t = this,
             e = this.promise_;if (!e) {
            if (2 === f(this.url)) e = Promise.resolve(this);else {
               var n = new i.a(function (t) {
                  switch (f(t)) {case s:
                        return t;case l:
                        return Object(o.getAbsolutePath)(t, window.location.href);}
               }(this.url));this.loader = n, e = n.load().then(function () {
                  return t;
               });
            }this.promise_ = e;
         }return e;
      }, registerPlugin: function registerPlugin(t, e, n) {
         this.name = t, this.target = e, this.js = n;
      }, getNewInstance: function getNewInstance(t, e, n) {
         var r = this.js;if ("function" != typeof r) throw new a.s(null, Object(c.c)(this.url) + 100);var i = new r(t, e, n);return i.addToPlayer = function () {
            var e = t.getContainer().querySelector(".jw-overlays");e && (n.left = e.style.left, n.top = e.style.top, e.appendChild(n), i.displayArea = e);
         }, i.resizeHandler = function () {
            var t = i.displayArea;t && i.resize(t.clientWidth, t.clientHeight);
         }, i;
      } }), e.a = d;
}, function (t, e, n) {
   "use strict";
   n.d(e, "b", function () {
      return r;
   }), n.d(e, "a", function () {
      return i;
   });var r = { audioMode: !1, flashBlocked: !1, item: 0, itemMeta: {}, playbackRate: 1, playRejected: !1, state: n(3).Ma, itemReady: !1, controlsEnabled: !1 },
       i = { position: 0, duration: 0, buffer: 0, currentTime: 0 };
}, function (t, e, n) {
   "use strict";
   n.d(e, "a", function () {
      return r;
   });var r = function r(t, e, n) {
      return Math.max(Math.min(t, n), e);
   };
}, function (t, e, n) {
   "use strict";
   var r = n(0),
       i = n(5);var o = function t() {
      !function (t, e) {
         if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
      }(this, t);
   };e.a = o, o.prototype = Object(r.j)({}, i.a);
}, function (t, e, n) {
   "use strict";
   var r = n(5),
       i = { on: r.a.on, once: r.a.once, off: r.a.off, trigger: r.a.trigger, get: function get(t) {
         return this.attributes = this.attributes || {}, this.attributes[t];
      }, set: function set(t, e) {
         if (this.attributes = this.attributes || {}, this.attributes[t] !== e) {
            var n = this.attributes[t];this.attributes[t] = e, this.trigger("change:" + t, this, e, n);
         }
      }, clone: function clone() {
         var t = {},
             e = this.attributes;if (e) for (var n in e) {
            t[n] = e[n];
         }return t;
      }, change: function change(t, e, n) {
         this.on("change:" + t, e, n);var r = this.get(t);return e.call(n, this, r, r), this;
      } };e.a = i;
}, function (t, e, n) {
   "use strict";
   n.d(e, "c", function () {
      return r;
   }), n.d(e, "b", function () {
      return i;
   }), n.d(e, "a", function () {
      return o;
   });var r = 4,
       i = 2,
       o = 1;
}, function (t, e, n) {
   "use strict";
   function r(t, e, n) {
      var r = [],
          i = {};function o() {
         for (; r.length > 0;) {
            var e = r.shift(),
                n = e.command,
                o = e.args;(i[n] || t[n]).apply(t, o);
         }
      }e.forEach(function (e) {
         var u = t[e];i[e] = u, t[e] = function () {
            var t = Array.prototype.slice.call(arguments, 0);n() ? r.push({ command: e, args: t }) : (o(), u && u.apply(this, t));
         };
      }), Object.defineProperty(this, "queue", { enumerable: !0, get: function get() {
            return r;
         } }), this.flush = o, this.empty = function () {
         r.length = 0;
      }, this.off = function () {
         e.forEach(function (e) {
            var n = i[e];n && (t[e] = n, delete i[e]);
         });
      }, this.destroy = function () {
         this.off(), this.empty();
      };
   }n.d(e, "a", function () {
      return r;
   });
}, function (t, e, n) {
   "use strict";
   var r = n(3),
       i = function i() {},
       o = function o() {
      return !1;
   },
       u = { name: "default" },
       a = { supports: o, play: i, pause: i, preload: i, load: i, stop: i, volume: i, mute: i, seek: i, resize: i, remove: i, destroy: i, eventsOn_: i, eventsOff_: i, setVisibility: i, setFullscreen: i, getFullscreen: o, supportsFullscreen: o, getContainer: i, setContainer: i, getName: function getName() {
         return u;
      }, getQualityLevels: i, getCurrentQuality: i, setCurrentQuality: i, getAudioTracks: i, getCurrentAudioTrack: i, setCurrentAudioTrack: i, getSeekRange: function getSeekRange() {
         return { start: 0, end: this.getDuration() };
      }, setPlaybackRate: i, getPlaybackRate: function getPlaybackRate() {
         return 1;
      }, getBandwidthEstimate: function getBandwidthEstimate() {
         return null;
      }, setControls: i, attachMedia: i, detachMedia: i, init: i, setState: function setState(t) {
         this.state = t, this.trigger(r.Aa, { newstate: t });
      }, sendMediaType: function sendMediaType(t) {
         var e = t[0],
             n = e.type,
             i = e.mimeType,
             o = "aac" === n || "mp3" === n || "mpeg" === n || i && 0 === i.indexOf("audio/");this.trigger(r.S, { mediaType: o ? "audio" : "video" });
      } };e.a = a;
}, function (t, e, n) {
   "use strict";
   var r = n(0),
       i = n(54),
       o = n(18),
       u = n(11),
       a = n(7),
       c = n(39),
       s = n(19),
       l = { autostart: !1, bandwidthEstimate: null, bitrateSelection: null, castAvailable: !1, controls: !0, defaultPlaybackRate: 1, displaydescription: !0, displaytitle: !0, displayPlaybackLabel: !1, height: 360, intl: {}, language: "en", liveTimeout: null, localization: c.a, mute: !1, nextUpDisplay: !0, playbackRateControls: !1, playbackRates: [.5, 1, 1.25, 1.5, 2], renderCaptionsNatively: !1, repeat: !1, stretching: "uniform", volume: 90, width: 640 };function f(t) {
      return t.slice && "px" === t.slice(-2) && (t = t.slice(0, -2)), t;
   }function d(t, e, n) {
      var r = t[n] || e[n];r && (t[n] = r);
   }var p = function p(t, e) {
      var i = Object(r.j)({}, (window.jwplayer || {}).defaults, e, t);!function (t) {
         var e = t.advertising,
             n = t.related,
             i = t.sharing,
             o = t.abouttext,
             u = Object(r.j)({}, t.localization);e && (u.advertising = u.advertising || {}, d(u.advertising, e, "admessage"), d(u.advertising, e, "cuetext"), d(u.advertising, e, "loadingAd"), d(u.advertising, e, "podmessage"), d(u.advertising, e, "skipmessage"), d(u.advertising, e, "skiptext")), "string" == typeof u.related ? u.related = { heading: u.related } : u.related = u.related || {}, n && d(u.related, n, "autoplaymessage"), i && (u.sharing = u.sharing || {}, d(u.sharing, i, "heading"), d(u.sharing, i, "copied")), o && d(u, t, "abouttext");var a = u.close || u.nextUpClose;a && (u.close = a), t.localization = u;
      }(i), function (t) {
         Object.keys(t).forEach(function (e) {
            "id" !== e && (t[e] = Object(u.serialize)(t[e]));
         });
      }(i);var p = i.forceLocalizationDefaults ? l.language : Object(s.e)(),
          h = i.localization,
          v = i.intl;i.localization = Object(s.a)(c.a, Object(s.c)(h, v || {}, p));var g = Object(r.j)({}, l, i);"." === g.base && (g.base = Object(o.getScriptPath)("jwplayer.js")), g.base = (g.base || Object(o.loadFrom)()).replace(/\/?$/, "/"), n.p = g.base, g.width = f(g.width), g.height = f(g.height), g.aspectratio = function (t, e) {
         if (-1 === e.toString().indexOf("%")) return 0;if ("string" != typeof t || !t) return 0;if (/^\d*\.?\d+%$/.test(t)) return t;var n = t.indexOf(":");if (-1 === n) return 0;var r = parseFloat(t.substr(0, n)),
             i = parseFloat(t.substr(n + 1));return r <= 0 || i <= 0 ? 0 : i / r * 100 + "%";
      }(g.aspectratio, g.width), g.volume = Object(r.z)(g.volume) ? Math.min(Math.max(0, g.volume), 100) : l.volume, g.mute = !!g.mute, g.language = p;var m = g.playbackRateControls;if (m) {
         var b = g.playbackRates;Array.isArray(m) && (b = m), (b = b.filter(function (t) {
            return Object(r.v)(t) && t >= .25 && t <= 4;
         }).map(function (t) {
            return Math.round(100 * t) / 100;
         })).indexOf(1) < 0 && b.push(1), b.sort(), g.playbackRateControls = !0, g.playbackRates = b;
      }(!g.playbackRateControls || g.playbackRates.indexOf(g.defaultPlaybackRate) < 0) && (g.defaultPlaybackRate = 1), g.playbackRate = g.defaultPlaybackRate, g.aspectratio || delete g.aspectratio;var y = g.playlist;if (y) Array.isArray(y.playlist) && (g.feedData = y, g.playlist = y.playlist);else {
         var j = Object(r.D)(g, ["title", "description", "type", "mediaid", "image", "file", "sources", "tracks", "preload", "duration"]);g.playlist = [j];
      }g.qualityLabels = g.qualityLabels || g.hlslabels, delete g.duration;var w = g.liveTimeout;null !== w && (Object(r.z)(w) ? 0 !== w && (w = Math.max(30, w)) : w = null, g.liveTimeout = w);var O = parseFloat(g.bandwidthEstimate),
          k = parseFloat(g.bitrateSelection);return g.bandwidthEstimate = Object(r.z)(O) ? O : function (t) {
         var e = parseFloat(t);return Object(r.z)(e) ? Math.max(e, 1) : l.bandwidthEstimate;
      }(g.defaultBandwidthEstimate), g.bitrateSelection = Object(r.z)(k) ? k : l.bitrateSelection, g.backgroundLoading = Object(r.r)(g.backgroundLoading) ? g.backgroundLoading : a.Features.backgroundLoading, g;
   },
       h = n(26),
       v = n(17),
       g = "__CONTEXTUAL__";function m(t) {
      var e = "file:" === window.location.protocol ? "https:" : "",
          n = { jwpsrv: "//ssl.p.jwpcdn.com/player/v/8.6.2/jwpsrv.js", dai: "//ssl.p.jwpcdn.com/player/plugins/dai/v/0.4.4/dai.js", vast: "//ssl.p.jwpcdn.com/player/plugins/vast/v/8.4.13/vast.js", googima: "//ssl.p.jwpcdn.com/player/plugins/googima/v/8.5.5/googima.js", freewheel: "//ssl.p.jwpcdn.com/player/plugins/freewheel/v/2.1.13/freewheel.js", related: "//ssl.p.jwpcdn.com/player/plugins/related/v/7.1.2/related.js", gapro: "//ssl.p.jwpcdn.com/player/plugins/gapro/v/2.1.3/gapro.js" }[t];return n ? e + n : "";
   }function b(t, e, n) {
      e && (t[e.client || m(n)] = e, delete e.client);
   }var y = function y(t, e) {
      var i = p(t, e),
          u = i.key || window.jwplayer && window.jwplayer.key,
          a = new h.b(u),
          c = a.edition();if (i.key = u, i.edition = c, i.error = a.error(), "unlimited" === c) {
         var s = Object(o.getScriptPath)("jwplayer.js");if (!s) throw new Error("Error setting up player: Could not locate jwplayer.js script tag");n.p = s;
      }return i.flashplayer = function (t) {
         var e = t.flashplayer;return e || (e = (Object(o.getScriptPath)("jwplayer.js") || t.base) + "jwplayer.flash.swf"), "http:" === window.location.protocol && (e = e.replace(/^https/, "http")), e;
      }(i), i.plugins = function (t) {
         var e = Object(r.j)({}, t.plugins),
             n = t.edition,
             i = Object(v.a)(n);if (i("ads")) {
            var o = Object(r.j)({}, t.advertising),
                u = o.client;if (u) {
               var a = m(u) || u;e[a] = o, delete o.client;
            }
         }if (i("jwpsrv")) {
            var c = t.analytics;c !== Object(c) && (c = {}), b(e, c, "jwpsrv");
         }return b(e, t.ga, "gapro"), e;
      }(i), i.ab && (i.ab = function (t) {
         var e = t.ab;return e.clone && (e = e.clone()), Object.keys(e.tests).forEach(function (n) {
            e.tests[n].forEach(function (e) {
               e.addConfig && e.addConfig(t, e.selection);
            });
         }), e;
      }(i)), function (t) {
         return !!Object(r.x)(t) && t.indexOf(g) > -1;
      }(i.playlist) && (i.playlist = function (t, e) {
         var n = function (t) {
            var e = t.querySelector('meta[property="og:title"]');if (e) return e.getAttribute("content");
         }(t),
             r = (t.querySelector("title") || {}).textContent,
             i = encodeURIComponent(n || r || "");return e.replace(g, i);
      }(document, i.playlist), i.contextual = !0), i;
   },
       j = n(8),
       w = n(25),
       O = n(3),
       k = n(58),
       C = n(29),
       x = n(24),
       P = n(1);function S(t) {
      var e = t.get("playlist");return new Promise(function (n, r) {
         if ("string" != typeof e) {
            var i = t.get("feedData") || {};return T(t, e, i), n();
         }var o = new k.a();o.on(O.Da, function (e) {
            var r = e.playlist;delete e.playlist, T(t, r, e), n();
         }), o.on(O.w, function (e) {
            T(t, [], {}), r(Object(P.z)(e, P.u));
         }), o.load(e);
      });
   }function T(t, e, n) {
      var r = t.attributes;r.playlist = Object(C.a)(e), r.feedData = n;
   }function E(t) {
      return t.attributes._destroyed;
   }var _ = n(37),
       A = n(48),
       N = n(12),
       M = 301129;function I(t) {
      return L(t) ? Promise.resolve() : S(t).then(function () {
         if (t.get("drm") || Object(_.b)(t.get("playlist"))) return Object(_.d)(t.get("edition"));
      }).then(function () {
         return function (t) {
            return S(t).then(function () {
               if (!E(t)) {
                  var e = Object(C.b)(t.get("playlist"), t);t.attributes.playlist = e;try {
                     Object(C.e)(e);
                  } catch (t) {
                     throw t.code += P.u, t;
                  }var n = t.getProviders(),
                      r = n.choose(e[0].sources[0]),
                      i = r.provider,
                      o = r.name;return "function" == typeof i ? i : j.a.html5 && "html5" === o ? j.a.html5 : n.load(o).catch(function (t) {
                     throw Object(P.z)(t, P.v);
                  });
               }
            });
         }(t);
      });
   }function F(t, e) {
      var r = [function (t) {
         var e = t.attributes,
             n = e.error;if (n && n.code === h.a) {
            var r = e.pid,
                i = e.ph,
                o = new h.b(e.key);if (i > 0 && i < 4 && r && o.duration() > -7776e6) {
               var u = new x.a("//content.jwplatform.com/libraries/" + r + ".js");return u.load().then(function () {
                  var t = window.jwplayer.defaults.key,
                      n = new h.b(t);n.error() || n.token() !== o.token() || (e.key = t, e.edition = n.edition(), e.error = n.error());
               }).catch(function () {});
            }
         }return Promise.resolve();
      }(t)];return L(t) || r.push(function (t, e) {
         var r = t.get("related"),
             i = Object(v.a)(t.get("edition")),
             o = r === Object(r) && i("discovery");if (!1 !== t.get("controls") || o) {
            var u = !1 !== t.get("visualplaylist") || o;return o || (r = { disableRelated: !0 }), r.showButton = u, n.e(0).then(function (i) {
               if (!t.attributes._destroyed) {
                  var o = new A.a();o.name = "related", o.js = n(149).default, Object(N.a)(o, r, e);
               }
            }.bind(null, n)).catch(Object(j.b)(M)).catch(function (t) {
               return t;
            });
         }return Promise.resolve();
      }(t, e), Promise.resolve()), Promise.all(r);
   }function L(t) {
      var e = t.get("advertising");return !(!e || !e.outstream);
   }var R = function R(t) {
      var e = t.get("skin") ? t.get("skin").url : void 0;if ("string" == typeof e && !function (t) {
         for (var e = document.styleSheets, n = 0, r = e.length; n < r; n++) {
            if (e[n].href === t) return !0;
         }return !1;
      }(e)) return new x.a(e, !0).load().catch(function (t) {
         return t;
      });return Promise.resolve();
   },
       D = function D(t) {
      var e = t.attributes,
          n = e.language,
          r = e.base,
          i = e.setupConfig,
          o = e.intl,
          u = Object(s.c)(i.localization, o, n);return !Object(s.g)(n) || Object(s.f)(u) ? Promise.resolve() : new Promise(function (i) {
         return Object(s.h)(r, n).then(function (n) {
            var r = n.response;if (!E(t)) {
               if (!r) throw new P.s(null, P.g);e.localization = Object(s.a)(r, u), i();
            }
         }).catch(function (t) {
            i(t.code === P.g ? t : Object(P.z)(t, P.f));
         });
      });
   };var B = function B(t) {
      var e = void 0;this.start = function (n) {
         var r = Object(w.a)(t, n),
             i = Promise.all([Object(j.d)(t), r, I(t), F(t, n), R(t), D(t)]),
             o = new Promise(function (t, n) {
            e = setTimeout(function () {
               n(new P.s(P.m, P.x));
            }, 6e4);var r = function r() {
               clearTimeout(e), setTimeout(t, 6e4);
            };i.then(r).catch(r);
         });return Promise.race([i, o]).catch(function (t) {
            var e = function e() {
               throw t;
            };return r.then(e).catch(e);
         }).then(function (t) {
            return function (t) {
               if (!t || !t.length) return { core: null, warnings: [] };var e = t.reduce(function (t, e) {
                  return t.concat(e);
               }, []).filter(function (t) {
                  return t && t.code;
               });return { core: t[0], warnings: e };
            }(t);
         });
      }, this.destroy = function () {
         clearTimeout(e), t.set("_destroyed", !0), t = null;
      };
   },
       z = n(42),
       q = n(30),
       V = n(22),
       X = { removeItem: function removeItem() {} };try {
      X = window.localStorage || X;
   } catch (t) {}function Q(t, e) {
      this.namespace = t, this.items = e;
   }Object(r.j)(Q.prototype, { getAllItems: function getAllItems() {
         var t = this;return this.items.reduce(function (e, n) {
            var r = X[t.namespace + "." + n];return r && (e[n] = Object(u.serialize)(r)), e;
         }, {});
      }, track: function track(t) {
         var e = this;this.items.forEach(function (n) {
            t.on("change:" + n, function (t, r) {
               try {
                  X[e.namespace + "." + n] = r;
               } catch (t) {
                  V.a.debug && console.error(t);
               }
            });
         });
      }, clear: function clear() {
         var t = this;this.items.forEach(function (e) {
            X.removeItem(t.namespace + "." + e);
         });
      } });var W = Q,
       H = n(52),
       U = n(49),
       J = n(5),
       K = n(43),
       Y = n(53);function G(t) {
      t.src || t.load();
   }function $() {
      var t = document.createElement("video");return t.className = "jw-video jw-reset", t.setAttribute("tabindex", "-1"), t.setAttribute("disableRemotePlayback", ""), t.setAttribute("webkit-playsinline", ""), t.setAttribute("playsinline", ""), t;
   }var Z = n(57),
       tt = n(35);n.d(e, "b", function () {
      return ot;
   });var et = function et() {};Object(r.j)(et.prototype, H.a);var nt = function nt(t) {
      this._events = {}, this.modelShim = new et(), this.modelShim._qoeItem = new q.a(), this.mediaShim = {}, this.setup = new B(this.modelShim), this.currentContainer = this.originalContainer = t, this.apiQueue = new i.a(this, ["load", "play", "pause", "seek", "stop", "playlistItem", "playlistNext", "playlistPrev", "next", "preload", "setConfig", "setCurrentAudioTrack", "setCurrentCaptions", "setCurrentQuality", "setFullscreen", "addButton", "removeButton", "castToggle", "setMute", "setVolume", "setPlaybackRate", "setCues", "setPlaylistItem", "resize", "setCaptions", "setControls"], function () {
         return !0;
      });
   };function rt(t, e) {
      e && e.code && (e.sourceError && console.error(e.sourceError), console.error(P.s.logMessage(e.code)));
   }function it(t) {
      t && t.code && console.warn(P.s.logMessage(t.code));
   }function ot(t, e) {
      if (!document.body.contains(t.currentContainer)) {
         var n = document.getElementById(t.get("id"));n && (t.currentContainer = n);
      }t.currentContainer.parentElement && t.currentContainer.parentElement.replaceChild(e, t.currentContainer), t.currentContainer = e;
   }Object(r.j)(nt.prototype, { on: J.a.on, once: J.a.once, off: J.a.off, trigger: J.a.trigger, init: function init(t, e) {
         var n = this,
             i = this.modelShim,
             o = new W("jwplayer", ["volume", "mute", "captionLabel", "bandwidthEstimate", "bitrateSelection", "qualityLabel"]),
             u = o && o.getAllItems();i.attributes = i.attributes || {}, Object(r.j)(this.mediaShim, U.a);var a = t,
             c = y(Object(r.j)({}, t), u);c.id = e.id, c.setupConfig = a, Object(r.j)(i.attributes, c, U.b), i.getProviders = function () {
            return new z.a(c);
         }, i.setProvider = function () {};var s = function () {
            for (var t = Y.c, e = [], n = [], r = 0; r < t; r++) {
               var i = $();e.push(i), n.push(i), G(i);
            }var o = n.shift(),
                u = n.shift(),
                a = !1;return { primed: function primed() {
                  return a;
               }, prime: function prime() {
                  e.forEach(G), a = !0;
               }, played: function played() {
                  a = !0;
               }, getPrimedElement: function getPrimedElement() {
                  return n.length ? n.shift() : null;
               }, getAdElement: function getAdElement() {
                  return o;
               }, getTestElement: function getTestElement() {
                  return u;
               }, clean: function clean(t) {
                  if (t.src) {
                     t.removeAttribute("src");try {
                        t.load();
                     } catch (t) {}
                  }
               }, recycle: function recycle(t) {
                  t && !n.some(function (e) {
                     return e === t;
                  }) && (this.clean(t), n.push(t));
               }, syncVolume: function syncVolume(t) {
                  var n = Math.min(Math.max(0, t / 100), 1);e.forEach(function (t) {
                     t.volume = n;
                  });
               }, syncMute: function syncMute(t) {
                  e.forEach(function (e) {
                     e.muted = t;
                  });
               } };
         }();i.get("backgroundLoading") || (s = Object(Z.a)(s.getPrimedElement(), s));var l = new tt.a(Object(tt.b)(this.originalContainer)).once("gesture", function () {
            s.prime(), n.preload(), l.destroy();
         });return i.on("change:errorEvent", rt), this.setup.start(e).then(function (t) {
            var u = t.core;if (!u) throw Object(P.z)(null, P.w);if (n.setup) {
               n.on(O.Ta, it), t.warnings.forEach(function (t) {
                  n.trigger(O.Ta, t);
               });var a = n.modelShim.clone();if (a.error) throw a.error;var c = n.apiQueue.queue.slice(0);n.apiQueue.destroy(), Object(r.j)(n, u.prototype), n.setup(a, e, n.originalContainer, n._events, c, s);var l = n._model;return i.off("change:errorEvent", rt), l.on("change:errorEvent", rt), o.track(l), n.updatePlaylist(l.get("playlist"), l.get("feedData")).catch(function (t) {
                  throw Object(P.z)(t, P.u);
               });
            }
         }).then(function () {
            n.setup && n.playerReady();
         }).catch(function (t) {
            n.setup && function (t, e, n) {
               Promise.resolve().then(function () {
                  var r = Object(P.A)(P.r, P.y, n),
                      i = t._model || t.modelShim;r.message = r.message || i.get("localization").errors[r.key], delete r.key;var o = i.get("contextual");if (!o) {
                     var u = Object(K.a)(t, r);K.a.cloneIcon && u.querySelector(".jw-icon").appendChild(K.a.cloneIcon("error")), ot(t, u);
                  }i.set("errorEvent", r), i.set("state", O.La), t.trigger(O.Ia, r), o && e.remove();
               });
            }(n, e, t);
         });
      }, playerDestroy: function playerDestroy() {
         this.apiQueue && this.apiQueue.destroy(), this.setup && this.setup.destroy(), this.off(), this._events = this._model = this.modelShim = this.originalContainer = this.apiQueue = this.setup = null;
      }, getContainer: function getContainer() {
         return this.currentContainer;
      }, get: function get(t) {
         if (this.modelShim) return t in this.mediaShim ? this.mediaShim[t] : this.modelShim.get(t);
      }, getItemQoe: function getItemQoe() {
         return this.modelShim._qoeItem;
      }, getConfig: function getConfig() {
         return Object(r.j)({}, this.modelShim.attributes, this.mediaShim);
      }, getCurrentCaptions: function getCurrentCaptions() {
         return this.get("captionsIndex");
      }, getWidth: function getWidth() {
         return this.get("containerWidth");
      }, getHeight: function getHeight() {
         return this.get("containerHeight");
      }, getMute: function getMute() {
         return this.get("mute");
      }, getProvider: function getProvider() {
         return this.get("provider");
      }, getState: function getState() {
         return this.get("state");
      }, getAudioTracks: function getAudioTracks() {
         return null;
      }, getCaptionsList: function getCaptionsList() {
         return null;
      }, getQualityLevels: function getQualityLevels() {
         return null;
      }, getVisualQuality: function getVisualQuality() {
         return null;
      }, getCurrentQuality: function getCurrentQuality() {
         return -1;
      }, getCurrentAudioTrack: function getCurrentAudioTrack() {
         return -1;
      }, getSafeRegion: function getSafeRegion() {
         return { x: 0, y: 0, width: 0, height: 0 };
      }, isBeforeComplete: function isBeforeComplete() {
         return !1;
      }, isBeforePlay: function isBeforePlay() {
         return !1;
      }, createInstream: function createInstream() {
         return null;
      }, skipAd: function skipAd() {}, attachMedia: function attachMedia() {}, detachMedia: function detachMedia() {
         return null;
      } });e.a = nt;
}, function (t, e, n) {
   "use strict";
   n.d(e, "a", function () {
      return i;
   });var r = n(0);function i(t, e) {
      return Object(r.j)({}, e, { prime: function prime() {
            t.src || t.load();
         }, getPrimedElement: function getPrimedElement() {
            return t;
         }, clean: function clean() {
            e.clean(t);
         }, recycle: function recycle() {
            e.clean(t);
         } });
   }
}, function (t, e, n) {
   "use strict";
   var r = n(0),
       i = n(3),
       o = n(4),
       u = n(45),
       a = n(27),
       c = n(5),
       s = n(1);e.a = function () {
      var t = Object(r.j)(this, c.a);function e(e) {
         try {
            var a = e.responseXML ? e.responseXML.childNodes : null,
                c = "",
                l = void 0;if (a) {
               for (var f = 0; f < a.length && 8 === (c = a[f]).nodeType; f++) {}if ("xml" === Object(o.b)(c) && (c = c.nextSibling), "rss" === Object(o.b)(c)) {
                  var d = Object(u.a)(c);l = Object(r.j)({ playlist: d }, d.feedData);
               }
            }if (!l) try {
               var p = JSON.parse(e.responseText);if (Array.isArray(p)) l = { playlist: p };else {
                  if (!Array.isArray(p.playlist)) throw Error("Playlist is not an array");l = p;
               }
            } catch (t) {
               throw new s.s(s.o, 621, t);
            }t.trigger(i.Da, l);
         } catch (t) {
            n(t);
         }
      }function n(e) {
         e.code || (e = new s.s(s.o, 0)), t.trigger(i.w, e);
      }this.load = function (t) {
         Object(a.a)(t, e, function (t, e, r, i) {
            n(i);
         });
      }, this.destroy = function () {
         this.off();
      };
   };
}, function (t, e, n) {
   "use strict";
   n.d(e, "a", function () {
      return i;
   });var r = n(7);function i(t) {
      return "hls" === t.type && r.OS.android ? !1 !== t.androidhls && !r.Browser.firefox && parseFloat(r.OS.version.version) >= 4.4 : null;
   }
}, function (t, e, n) {
   "use strict";
   n.r(e);var r = n(0),
       i = setTimeout;function o() {}function u(t) {
      if (!(this instanceof u)) throw new TypeError("Promises must be constructed via new");if ("function" != typeof t) throw new TypeError("not a function");this._state = 0, this._handled = !1, this._value = void 0, this._deferreds = [], f(t, this);
   }function a(t, e) {
      for (; 3 === t._state;) {
         t = t._value;
      }0 !== t._state ? (t._handled = !0, u._immediateFn(function () {
         var n = 1 === t._state ? e.onFulfilled : e.onRejected;if (null !== n) {
            var r;try {
               r = n(t._value);
            } catch (t) {
               return void s(e.promise, t);
            }c(e.promise, r);
         } else (1 === t._state ? c : s)(e.promise, t._value);
      })) : t._deferreds.push(e);
   }function c(t, e) {
      try {
         if (e === t) throw new TypeError("A promise cannot be resolved with itself.");if (e && ("object" == (typeof e === "undefined" ? "undefined" : _typeof(e)) || "function" == typeof e)) {
            var n = e.then;if (e instanceof u) return t._state = 3, t._value = e, void l(t);if ("function" == typeof n) return void f(function (t, e) {
               return function () {
                  t.apply(e, arguments);
               };
            }(n, e), t);
         }t._state = 1, t._value = e, l(t);
      } catch (e) {
         s(t, e);
      }
   }function s(t, e) {
      t._state = 2, t._value = e, l(t);
   }function l(t) {
      2 === t._state && 0 === t._deferreds.length && u._immediateFn(function () {
         t._handled || u._unhandledRejectionFn(t._value);
      });for (var e = 0, n = t._deferreds.length; e < n; e++) {
         a(t, t._deferreds[e]);
      }t._deferreds = null;
   }function f(t, e) {
      var n = !1;try {
         t(function (t) {
            n || (n = !0, c(e, t));
         }, function (t) {
            n || (n = !0, s(e, t));
         });
      } catch (t) {
         if (n) return;n = !0, s(e, t);
      }
   }u.prototype.catch = function (t) {
      return this.then(null, t);
   }, u.prototype.then = function (t, e) {
      var n = new this.constructor(o);return a(this, new function (t, e, n) {
         this.onFulfilled = "function" == typeof t ? t : null, this.onRejected = "function" == typeof e ? e : null, this.promise = n;
      }(t, e, n)), n;
   }, u.prototype.finally = function (t) {
      var e = this.constructor;return this.then(function (n) {
         return e.resolve(t()).then(function () {
            return n;
         });
      }, function (n) {
         return e.resolve(t()).then(function () {
            return e.reject(n);
         });
      });
   }, u.all = function (t) {
      return new u(function (e, n) {
         if (!t || void 0 === t.length) throw new TypeError("Promise.all accepts an array");var r = Array.prototype.slice.call(t);if (0 === r.length) return e([]);var i = r.length;function o(t, u) {
            try {
               if (u && ("object" == (typeof u === "undefined" ? "undefined" : _typeof(u)) || "function" == typeof u)) {
                  var a = u.then;if ("function" == typeof a) return void a.call(u, function (e) {
                     o(t, e);
                  }, n);
               }r[t] = u, 0 == --i && e(r);
            } catch (t) {
               n(t);
            }
         }for (var u = 0; u < r.length; u++) {
            o(u, r[u]);
         }
      });
   }, u.resolve = function (t) {
      return t && "object" == (typeof t === "undefined" ? "undefined" : _typeof(t)) && t.constructor === u ? t : new u(function (e) {
         e(t);
      });
   }, u.reject = function (t) {
      return new u(function (e, n) {
         n(t);
      });
   }, u.race = function (t) {
      return new u(function (e, n) {
         for (var r = 0, i = t.length; r < i; r++) {
            t[r].then(e, n);
         }
      });
   }, u._immediateFn = "function" == typeof setImmediate && function (t) {
      setImmediate(t);
   } || function (t) {
      i(t, 0);
   }, u._unhandledRejectionFn = function (t) {
      "undefined" != typeof console && console && console.warn("Possible Unhandled Promise Rejection:", t);
   };var d = u;window.Promise || (window.Promise = d);var p = n(18),
       h = n(13),
       v = n(15),
       g = n(14),
       m = { availableProviders: v.a, registerProvider: g.a },
       b = n(25);m.registerPlugin = function (t, e, n) {
      "jwpsrv" !== t && Object(b.b)(t, e, n);
   };var y = m,
       j = n(31),
       w = n(22),
       O = n(7),
       k = n(56),
       C = n(3),
       x = n(30),
       P = n(5),
       S = n(9),
       T = n(11),
       E = n(2);function _(t, e) {
      this.name = t, this.message = e.message || e.toString(), this.error = e;
   }var A = n(6),
       N = n(10),
       M = n(23),
       I = n(27),
       F = n(50),
       L = n(47);var R = Object(r.j)({}, T, S, p, { addClass: N.a, hasClass: N.h, removeClass: N.l, replaceClass: N.m, toggleClass: N.p, classList: N.d, styleDimension: N.o, createElement: N.e, emptyElement: N.g, addStyleSheet: N.b, bounds: N.c, css: M.b, clearCss: M.a, style: M.d, transform: M.e, getRgba: M.c, ajax: I.a, crossdomain: function crossdomain(t) {
         var e = document.createElement("a"),
             n = document.createElement("a");e.href = location.href;try {
            return n.href = t, n.href = n.href, e.protocol + "//" + e.host != n.protocol + "//" + n.host;
         } catch (t) {}return !0;
      }, tryCatch: function tryCatch(t, e) {
         var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : [];if (w.a.debug) return t.apply(e || this, n);try {
            return t.apply(e || this, n);
         } catch (e) {
            return new _(t.name, e);
         }
      }, Error: _, Timer: x.a, log: L.a, between: F.a, foreach: function foreach(t, e) {
         for (var n in t) {
            Object.prototype.hasOwnProperty.call(t, n) && e(n, t[n]);
         }
      }, flashVersion: A.a, isIframe: A.m, indexOf: r.p, trim: E.h, pad: E.d, extension: E.a, hms: E.b, seconds: E.f, prefix: E.e, suffix: E.g, noop: function noop() {} }),
       D = 0;function B(t, e) {
      var n = new k.a(e);return n.on(C.Ga, function (e) {
         t._qoe.tick("ready"), e.setupTime = t._qoe.between("setup", "ready");
      }), n.on("all", function (e, n) {
         t.trigger(e, n);
      }), n;
   }function z(t, e) {
      var n = t.plugins;Object.keys(n).forEach(function (t) {
         delete n[t];
      }), e.get("setupConfig") && t.trigger("remove"), t.off(), e.playerDestroy(), e.getContainer().removeAttribute("data-jwplayer-id");
   }function q(t) {
      var e = ++D,
          n = t.id || "player-" + e,
          i = new x.a(),
          o = {},
          u = B(this, t);i.tick("init"), t.setAttribute("data-jwplayer-id", n), Object.defineProperties(this, { id: { get: function get() {
               return n;
            } }, uniqueId: { get: function get() {
               return e;
            } }, plugins: { get: function get() {
               return o;
            } }, _qoe: { get: function get() {
               return i;
            } }, version: { get: function get() {
               return j.a;
            } }, Events: { get: function get() {
               return P.a;
            } }, utils: { get: function get() {
               return R;
            } }, _: { get: function get() {
               return r.f;
            } } }), Object(r.j)(this, { _events: {}, setup: function setup(e) {
            return i.clear("ready"), i.tick("setup"), z(this, u), (u = B(this, t)).init(e, this), this.on(e.events, null, this);
         }, remove: function remove() {
            return function (t) {
               for (var e = h.a.length; e--;) {
                  if (h.a[e].uniqueId === t.uniqueId) {
                     h.a.splice(e, 1);break;
                  }
               }
            }(this), z(this, u), this;
         }, qoe: function qoe() {
            var t = u.getItemQoe();return { setupTime: this._qoe.between("setup", "ready"), firstFrame: t.getFirstFrame ? t.getFirstFrame() : null, player: this._qoe.dump(), item: t.dump() };
         }, getAudioTracks: function getAudioTracks() {
            return u.getAudioTracks();
         }, getBuffer: function getBuffer() {
            return u.get("buffer");
         }, getCaptions: function getCaptions() {
            return u.get("captions");
         }, getCaptionsList: function getCaptionsList() {
            return u.getCaptionsList();
         }, getConfig: function getConfig() {
            return u.getConfig();
         }, getContainer: function getContainer() {
            return u.getContainer();
         }, getControls: function getControls() {
            return u.get("controls");
         }, getCurrentAudioTrack: function getCurrentAudioTrack() {
            return u.getCurrentAudioTrack();
         }, getCurrentCaptions: function getCurrentCaptions() {
            return u.getCurrentCaptions();
         }, getCurrentQuality: function getCurrentQuality() {
            return u.getCurrentQuality();
         }, getCurrentTime: function getCurrentTime() {
            return u.get("currentTime");
         }, getDuration: function getDuration() {
            return u.get("duration");
         }, getEnvironment: function getEnvironment() {
            return O;
         }, getFullscreen: function getFullscreen() {
            return u.get("fullscreen");
         }, getHeight: function getHeight() {
            return u.getHeight();
         }, getItemMeta: function getItemMeta() {
            return u.get("itemMeta") || {};
         }, getMute: function getMute() {
            return u.getMute();
         }, getPlaybackRate: function getPlaybackRate() {
            return u.get("playbackRate");
         }, getPlaylist: function getPlaylist() {
            return u.get("playlist");
         }, getPlaylistIndex: function getPlaylistIndex() {
            return u.get("item");
         }, getPlaylistItem: function getPlaylistItem(t) {
            if (!R.exists(t)) return u.get("playlistItem");var e = this.getPlaylist();return e ? e[t] : null;
         }, getPosition: function getPosition() {
            return u.get("position");
         }, getProvider: function getProvider() {
            return u.getProvider();
         }, getQualityLevels: function getQualityLevels() {
            return u.getQualityLevels();
         }, getSafeRegion: function getSafeRegion() {
            var t = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];return u.getSafeRegion(t);
         }, getState: function getState() {
            return u.getState();
         }, getStretching: function getStretching() {
            return u.get("stretching");
         }, getViewable: function getViewable() {
            return u.get("viewable");
         }, getVisualQuality: function getVisualQuality() {
            return u.getVisualQuality();
         }, getVolume: function getVolume() {
            return u.get("volume");
         }, getWidth: function getWidth() {
            return u.getWidth();
         }, setCaptions: function setCaptions(t) {
            return u.setCaptions(t), this;
         }, setConfig: function setConfig(t) {
            return u.setConfig(t), this;
         }, setControls: function setControls(t) {
            return u.setControls(t), this;
         }, setCurrentAudioTrack: function setCurrentAudioTrack(t) {
            u.setCurrentAudioTrack(t);
         }, setCurrentCaptions: function setCurrentCaptions(t) {
            u.setCurrentCaptions(t);
         }, setCurrentQuality: function setCurrentQuality(t) {
            u.setCurrentQuality(t);
         }, setFullscreen: function setFullscreen(t) {
            return u.setFullscreen(t), this;
         }, setMute: function setMute(t) {
            return u.setMute(t), this;
         }, setPlaybackRate: function setPlaybackRate(t) {
            return u.setPlaybackRate(t), this;
         }, setPlaylistItem: function setPlaylistItem(t, e) {
            return u.setPlaylistItem(t, e), this;
         }, setCues: function setCues(t) {
            return u.setCues(t), this;
         }, setVolume: function setVolume(t) {
            return u.setVolume(t), this;
         }, load: function load(t, e) {
            return u.load(t, e), this;
         }, play: function play(t) {
            return u.play(t), this;
         }, pause: function pause(t) {
            return u.pause(t), this;
         }, playToggle: function playToggle(t) {
            switch (this.getState()) {case C.Pa:case C.Ja:
                  return this.pause(t);default:
                  return this.play(t);}
         }, seek: function seek(t, e) {
            return u.seek(t, e), this;
         }, playlistItem: function playlistItem(t, e) {
            return u.playlistItem(t, e), this;
         }, playlistNext: function playlistNext(t) {
            return u.playlistNext(t), this;
         }, playlistPrev: function playlistPrev(t) {
            return u.playlistPrev(t), this;
         }, next: function next(t) {
            return u.next(t), this;
         }, castToggle: function castToggle() {
            return u.castToggle(), this;
         }, createInstream: function createInstream() {
            return u.createInstream();
         }, skipAd: function skipAd() {
            return u.skipAd(), this;
         }, stop: function stop() {
            return u.stop(), this;
         }, resize: function resize(t, e) {
            return u.resize(t, e), this;
         }, addButton: function addButton(t, e, n, r, i) {
            return u.addButton(t, e, n, r, i), this;
         }, removeButton: function removeButton(t) {
            return u.removeButton(t), this;
         }, attachMedia: function attachMedia() {
            return u.attachMedia(), this;
         }, detachMedia: function detachMedia() {
            return u.detachMedia(), this;
         }, isBeforeComplete: function isBeforeComplete() {
            return u.isBeforeComplete();
         }, isBeforePlay: function isBeforePlay() {
            return u.isBeforePlay();
         } });
   }Object(r.j)(q.prototype, { on: function on(t, e, n) {
         return P.c.call(this, t, e, n);
      }, once: function once(t, e, n) {
         return P.d.call(this, t, e, n);
      }, off: function off(t, e, n) {
         return P.b.call(this, t, e, n);
      }, trigger: function trigger(t, e) {
         return (e = r.f.isObject(e) ? Object(r.j)({}, e) : {}).type = t, w.a.debug ? P.e.call(this, t, e) : P.f.call(this, t, e);
      }, getPlugin: function getPlugin(t) {
         return this.plugins[t];
      }, addPlugin: function addPlugin(t, e) {
         this.plugins[t] = e, this.on("ready", e.addToPlayer), e.resize && this.on("resize", e.resizeHandler);
      }, registerPlugin: function registerPlugin(t, e, n) {
         Object(b.b)(t, e, n);
      }, getAdBlock: function getAdBlock() {
         return !1;
      }, playAd: function playAd(t) {}, pauseAd: function pauseAd(t) {} }), n.p = Object(p.loadFrom)();var V = function V(t) {
      var e = void 0,
          n = void 0;if (t ? "string" == typeof t ? (e = X(t)) || (n = document.getElementById(t)) : "number" == typeof t ? e = h.a[t] : t.nodeType && (e = X((n = t).id || n.getAttribute("data-jwplayer-id"))) : e = h.a[0], e) return e;if (n) {
         var r = new q(n);return h.a.push(r), r;
      }return { registerPlugin: b.b };
   };function X(t) {
      for (var e = 0; e < h.a.length; e++) {
         if (h.a[e].id === t) return h.a[e];
      }return null;
   }Object.defineProperties(V, { api: { get: function get() {
            return y;
         }, set: function set() {} }, version: { get: function get() {
            return j.a;
         }, set: function set() {} }, debug: { get: function get() {
            return w.a.debug;
         }, set: function set(t) {
            w.a.debug = !!t;
         } } });var Q = V,
       W = n(35),
       H = n(26),
       U = n(24),
       J = n(46),
       K = n(45),
       Y = n(40),
       G = r.f.extend,
       $ = {};$.api = y, $._ = r.f, $.version = "8.6.2+commercial_v8-6-2.295.commercial.54a805c.hlsjs..jwplayer.cb419c0.dai.f0547f4.freewheel.31a10c7.googima.182acac.vast.993be40.analytics.3dadfbd.gapro.f664e4e.related.6aa5ac5", $.utils = Object(r.j)(R, { key: H.b, extend: G, scriptloader: U.a, rssparser: { parse: K.a }, tea: J.a, UI: W.a }), $.utils.css.style = $.utils.style, $.vid = Y.a;var Z = $,
       tt = window;Object(r.j)(Q, Z), "function" == typeof tt.define && tt.define.amd && tt.define([], function () {
      return Q;
   });var et = Q;tt.jwplayer && (et = tt.jwplayer);e.default = et;
}]).default;
"use strict";
var SVGAnim = function (root) {
  SVGAnim.version = "0.0.2";
  var GarbagePool = function GarbagePool() {
    this.EMPTY_POOL = []; //if empty remove
    this.REF_POOL = []; //if no reference remove
  };
  GarbagePool.prototype.addEmpty = function (el) {
    this.EMPTY_POOL.push(el);
  };
  /**
   * manages adding of references
   *
   */
  GarbagePool.prototype.addRef = function (el, refs) {
    var i, j;
    for (i = 0; i < this.REF_POOL.length; i += 1) {
      if (this.REF_POOL[i].el.id == el.id) {
        for (j = 0; j < refs.length; j += 1) {
          this.REF_POOL[i].refs.push(refs[j]);
        }
        return;
      }
    }
    this.REF_POOL.push({ el: el, refs: refs });
  };
  GarbagePool.prototype.purge = function () {
    this.purgeEmptyPool();
    this.purgeRefPool();
  };
  /**
   * check if empty and remove
   *
   */
  GarbagePool.prototype.purgeEmptyPool = function () {
    var i, el;
    for (i = this.EMPTY_POOL.length - 1; i > -1; i -= 1) {
      el = this.EMPTY_POOL[i];
      if (el.children().length === 0) {
        el.remove();
        this.EMPTY_POOL.splice(i, 1);
      }
    }
  };
  /**
   * check if all references are removed then remove
   *
   */
  GarbagePool.prototype.purgeRefPool = function () {
    var i, j, k, item;
    for (i = this.REF_POOL.length - 1; i > -1; i -= 1) {
      item = this.REF_POOL[i];
      k = 0;
      for (j = 0; j < item.refs.length; j += 1) {
        if (item.refs[j].removed) {
          k += 1;
        }
        if (k == item.refs.length) {
          item.el.remove();
          this.REF_POOL.splice(i, 1);
        }
      }
    }
  };
  var GP = new GarbagePool();
  var Bitmap = function Bitmap(parentMC, resourceManager, charId, ObjectId, placeAfter, transform) {
    var instance = this,
        parentEl = parentMC.el;
    this.create = function () {
      var j, k, transformArray, transformMat;
      instance.el = parentMC.el.g();
      instance.id = ObjectId;
      instance.el.attr({ class: "shape", token: instance.id });
      instance.children = [];
      instance.isMask = false;
      instance.isMasked = false;
      instance.mask = null;
      instance.maskTill = null;
      for (var b = 0; b < resourceManager.m_data.DOMDocument.Bitmaps.length; b++) {
        if (resourceManager.m_data.DOMDocument.Bitmaps[b].charid == charId) {
          var path = resourceManager.m_data.DOMDocument.Bitmaps[b].bitmapPath;
          var bitmap = parentMC.el.paper.image(path);
          instance.el.add(bitmap);
        }
      }
      transformArray = transform.split(",");
      transformMat = new Snap.Matrix(transformArray[0], transformArray[1], transformArray[2], transformArray[3], transformArray[4], transformArray[5]);
      instance.el.transform(transformMat);
      if (placeAfter && parseInt(placeAfter) !== 0) {
        afterMC = parentMC.getChildById(parseInt(placeAfter));
        if (afterMC.isMasked) {
          //if masked add outside mask group
          afterMC.el.parent().before(instance.el);
        } else {
          afterMC.el.before(instance.el);
        }
      } else {
        parentEl.add(instance.el); //TODO:: handle after
      }
    };
    this.create();
  };
  var Text = function Text(parentMC, resourceManager, charId, ObjectId, placeAfter, transform, bounds) {
    var instance = this,
        parentEl = parentMC.el;
    this.create = function () {
      var j, k, transformArray, transformMat;
      instance.el = parentMC.el.g();
      instance.id = ObjectId;
      instance.el.attr({ class: "text", token: instance.id });
      instance.children = [];
      instance.isMask = false;
      instance.isMasked = false;
      instance.mask = null;
      instance.maskTill = null;
      for (j = 0; j < resourceManager.m_data.DOMDocument.Text.length; j++) {
        if (resourceManager.m_data.DOMDocument.Text[j].charid == charId) {
          instance.addText(resourceManager.m_data.DOMDocument.Text[j]);
        }
      }
      transformArray = transform.split(",");
      transformMat = new Snap.Matrix(transformArray[0], transformArray[1], transformArray[2], transformArray[3], transformArray[4], transformArray[5]);
      instance.el.transform(transformMat);
      if (placeAfter && parseInt(placeAfter) !== 0) {
        afterMC = parentMC.getChildById(parseInt(placeAfter));
        if (afterMC.isMasked) {
          //if masked add outside mask group
          afterMC.el.parent().before(instance.el);
        } else {
          afterMC.el.before(instance.el);
        }
      } else {
        parentEl.add(instance.el);
      }
    };
    this.addText = function (data) {
      var text, bbox, textBox, textX, textY, lineMode, fontSize, fontName, fontColor, textAlign, textAnchor, textIndent, textBaseline, textBounds, textStyles;
      textBox = instance.el.g();
      if (bounds) {
        textBounds = bounds.split(",");
      } else {
        textBounds = [0, 0, 200, 100];
      }
      lineMode = data.behaviour.lineMode;
      textAlign = data.paras[0].alignment;
      textBaseline = lineMode == "single" ? "central" : "auto";
      fontSize = data.paras[0].textRun[0].style.fontSize;
      fontName = data.paras[0].textRun[0].style.fontName;
      fontColor = data.paras[0].textRun[0].style.fontColor;
      letterSpacing = data.paras[0].textRun[0].style.letterSpacing;
      if (textAlign == "left") {
        textAnchor = "start";
      } else if (textAlign == "center") {
        textAnchor = "middle";
      } else if (textAlign == "right") {
        textAnchor = "end";
      }
      textStyles = {
        "text-anchor": textAnchor,
        "dominant-baseline": textBaseline,
        "font-family": fontName,
        "font-size": fontSize,
        "letter-spacing": letterSpacing,
        fill: fontColor
      };
      //rect
      if (data.behaviour.isBorderDrawn !== "false") {
        textRect = textBox.rect(textBounds[0], textBounds[1], textBounds[2], textBounds[3]);
        textRect.attr({
          stroke: "black",
          fill: "transparent"
        });
      }
      //make text and y
      if (lineMode == "single") {
        text = textBox.text(0, 0, data.txt);
        textY = parseFloat(textBounds[1]) + parseFloat(textBounds[3]) / 2;
      } else {
        text = instance.multiLine(textBox, data, textBounds, textStyles);
        textY = parseFloat(textBounds[1]) - parseFloat(data.paras[0].linespacing) * 2;
      }
      //x
      if (textAlign == "left") {
        textX = parseFloat(textBounds[0]);
      } else {
        textX = parseFloat(textBounds[0]) + parseFloat(textBounds[2]) / 2;
      }
      text.attr(textStyles);
      text.transform("translate(" + textX + "," + textY + ")");
    };
    this.multiLine = function (textBox, data, textBounds, textStyles) {
      var string = data.txt,
          spans = [],
          chars = "",
          substr,
          tempTxt,
          boundsWidth = parseFloat(textBounds[2]),
          sp,
          bbox,
          i = 0;
      //break into spans
      while (i > -1) {
        chars += data.txt.charAt(i);
        tempTxt = textBox.text(0, 0, chars);
        tempTxt.attr(textStyles);
        bbox = tempTxt.getBBox();
        if (bbox.w > boundsWidth) {
          newIndex = chars.lastIndexOf(" ");
          substr = chars.slice(0, newIndex);
          spans.push(substr);
          i = i - (chars.length - substr.length) + 2;
          chars = "";
        } else {
          i += 1;
        }
        if (i >= data.txt.length) {
          substr = chars.slice(0, newIndex);
          spans.push(substr);
          i = -1;
        }
        tempTxt.remove();
      }
      text = textBox.text(0, 0, spans);
      sp = text.selectAll("tspan");
      sp.attr({
        x: 0,
        dy: bbox.h + parseFloat(data.paras[0].linespacing)
      });
      return text;
    };
    this.create();
  };
  var Shape = function Shape(parentMC, resourceManager, charId, ObjectId, placeAfter, transform) {
    var instance = this,
        parentEl = parentMC.el;
    this.create = function () {
      var j, k, transformArray, transformMat;
      instance.el = parentMC.el.g();
      instance.id = ObjectId;
      instance.el.attr({ class: "shape", token: instance.id });
      instance.children = [];
      instance.isMask = false;
      instance.isMasked = false;
      instance.mask = null;
      instance.maskTill = null;
      for (j = 0; j < resourceManager.m_data.DOMDocument.Shape.length; j++) {
        if (resourceManager.m_data.DOMDocument.Shape[j].charid == charId) {
          for (k = 0; k < resourceManager.m_data.DOMDocument.Shape[j].path.length; k++) {
            instance.addPath(j, k);
          }
        }
      }
      transformArray = transform.split(",");
      transformMat = new Snap.Matrix(transformArray[0], transformArray[1], transformArray[2], transformArray[3], transformArray[4], transformArray[5]);
      instance.el.transform(transformMat);
      if (placeAfter && parseInt(placeAfter) !== 0) {
        afterMC = parentMC.getChildById(parseInt(placeAfter));
        if (afterMC.isMasked) {
          //if masked add outside mask group
          afterMC.el.parent().before(instance.el);
        } else {
          afterMC.el.before(instance.el);
        }
      } else {
        parentEl.add(instance.el); //TODO:: handle after
      }
    };
    this.addPath = function (j, k) {
      var clr, crlOpacity, shape1, path;
      var shape = instance.el.path();
      var resourcePath = resourceManager.m_data.DOMDocument.Shape[j].path[k];
      path = resourcePath.d;
      shape.attr({ fill: "transparent" });
      shape.attr({ d: path });
      if (resourcePath.pathType == "Fill") {
        this.addFill(shape, resourcePath);
      } else if (resourcePath.pathType == "Stroke") {
        this.addStroke(shape, resourcePath);
      }
    };
    this.getFillColor = function (resoucePath) {
      var clr, r, g, b, a, colStr;
      clr = resourcePath.color;
      r = parseInt(clr.substring(1, 3), 16);
      g = parseInt(clr.substring(3, 5), 16);
      b = parseInt(clr.substring(5, 7), 16);
      a = resourcePath.colorOpacity;
      colStr = "rgba(" + r + "," + g + "," + b + "," + a + ")";
      return colStr;
    };
    this.getFillImage = function (resourceImg) {
      var p = 0,
          patternArray,
          mat,
          src,
          exists;
      patternArray = resourceImg.patternTransform.split(",");
      p = 0;
      mat = new Snap.Matrix(patternArray[p], patternArray[p + 1], patternArray[p + 1], patternArray[p + 3], patternArray[p + 4], patternArray[p + 5]);
      src = resourceImg.bitmapPath;
      exists = parentMC.el.paper.select("defs pattern image");
      if (exists) {
        if (exists.attr("href") == src) {
          //check if image href matches as well as other props
          fillImage = exists.parent();
        } else {
          fillImage = newPattern(src, resourceImg, mat);
        }
      } else {
        fillImage = newPattern(src, resourceImg, mat);
      }
      return fillImage;
    };
    this.getFillGradient = function (grad, type, shape1) {
      var _x, _y, _x2, _y2, _fx, _fy, gradientString, gradientFill, i, rgb;
      if (type == "linear") {
        _x = parseFloat(grad.x1);
        _y = parseFloat(grad.y1);
        _x2 = parseFloat(grad.x2);
        _y2 = parseFloat(grad.y2);
        gradientString = "L(";
        gradientString += _x + ", ";
        gradientString += _y + ", ";
        gradientString += _x2 + ", ";
        gradientString += _y2 + ")";
      } else {
        _x = shape1.getBBox().x + shape1.getBBox().width / 2 + grad.cx / 10;
        _y = shape1.getBBox().y + shape1.getBBox().height / 2 + grad.cy / 10;
        _fx = shape1.getBBox().x + shape1.getBBox().width / 2 + parseFloat(grad.fx);
        _fy = shape1.getBBox().y + shape1.getBBox().height / 2 + parseFloat(grad.fy);
        gradientString = "R(";
        gradientString += _x + ", ";
        gradientString += _y + ", ";
        gradientString += grad.r + ", ";
        gradientString += _fx + ", ";
        gradientString += _fy + ")";
      }
      for (i = 0; i < grad.stop.length; i += 1) {
        rgb = hexToRgb(grad.stop[i].stopColor);
        gradientString += "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + grad.stop[i].stopOpacity + ")";
        gradientString += ":";
        gradientString += grad.stop[i].offset;
        if (i !== grad.stop.length - 1) {
          gradientString += "-";
        }
      }
      gradientFill = parentMC.el.paper.gradient(gradientString);
      return gradientFill;
    };
    this.addFill = function (shape, resourcePath) {
      var fillColor, fillImage, fillGradient, img, grad;
      if (resourcePath.color) {
        fillColor = instance.getFillColor(resourcePath);
        shape.attr({ fill: fillColor });
      }
      if (resourcePath.image) {
        img = resourcePath.image;
        fillImage = instance.getFillImage(img);
        shape.attr({ fill: fillImage });
      }
      if (resourcePath.linearGradient) {
        grad = resourcePath.linearGradient;
        fillGradient = instance.getFillGradient(grad, "linear");
        shape.attr({ fill: fillGradient });
      }
      if (resourcePath.radialGradient) {
        grad = resourcePath.radialGradient;
        fillGradient = instance.getFillGradient(grad, "radial", shape);
        shape.attr({ fill: fillGradient });
      }
    };
    this.addStroke = function (shape, resourcePath) {
      var r, g, b, a, colStr;
      if (resourcePath.color) {
        var clr = resourcePath.color;
        r = parseInt(clr.substring(1, 3), 16);
        g = parseInt(clr.substring(3, 5), 16);
        b = parseInt(clr.substring(5, 7), 16);
        a = resourcePath.colorOpacity;
        colStr = "rgba(" + r + "," + g + "," + b + "," + a + ")";
        shape.attr({ stroke: colStr, strokeWidth: resourcePath.strokeWidth });
      }
    };
    function hexToRgb(hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    }
    function newPattern(src, resourceImg, mat) {
      var image, pattern;
      image = instance.el.image(src);
      pattern = image.pattern(0, 0, resourceImg.width, resourceImg.height);
      pattern.attr({ x: mat.e, y: mat.f });
      return pattern;
    }
    this.create();
  };
  var MovieClip = function MovieClip(commandTimeline, s, resourceManager, objectID, name, transform) {
    var i, transformData, transformArray;
    var parentEl = s.type == "svg" ? s : s.el; //parent is stage if svg
    if (objectID) {
      this.id = objectID;
    }
    if (name) {
      this.name = name;
    }
    this.el = parentEl.g();
    this.el.attr({ class: "movieclip", token: this.id });
    this.transform = transform;
    this.m_timeline = commandTimeline;
    this.m_currentFrameNo = 0;
    this.m_frameCount = this.m_timeline.frameCount;
    this._scripts = {};
    this._labels = [];
    this.children = [];
    this.isMask = false;
    this.isMasked = false;
    this.mask = null;
    this.maskElement = null;
    this.maskTill = null;
    this.loops = true;
    this.playing = true;
    this.resourceManager = resourceManager;
    this.commandList = [];
    this.matrix = new Snap.Matrix();
    if (typeof this.m_timeline.Label !== "undefined") {
      this._labels = this.m_timeline.Label;
    }
    if (this.transform !== undefined) {
      transformData = this.transform;
      transformArray = transformData.split(",");
      this.matrix = new Snap.Matrix(transformArray[0], transformArray[1], transformArray[2], transformArray[3], transformArray[4], transformArray[5]);
      this.el.transform(this.matrix);
    }
    /*
    if (placeAfter && parseInt(placeAfter) !== 0) {
        afterMC = parentMC.getChildById(parseInt(placeAfter));
         if (afterMC.isMasked) {  //if masked add outside mask group
            afterMC.el.parent().before(this.el);
        } else {
            afterMC.el.before(this.el);
        }
     } else {
        parentEl.add(this.el);
    }
    */
  };
  MovieClip.prototype.addChild = function (child, placeAfter) {
    placeAfter = placeAfter ? placeAfter : 0;
    this.insertAtIndex(child, placeAfter);
  };
  MovieClip.prototype._addChild = function (child, placeAfter) {
    if (child.name) {
      this[child.name] = child;
    }
    if (placeAfter && parseInt(placeAfter) !== 0) {
      var afterMC = this.getChildById(parseInt(placeAfter));
      if (afterMC.isMasked) {
        //if masked add outside mask group
        afterMC.el.parent().before(child.el);
      } else {
        afterMC.el.before(child.el);
      }
    } else {
      this.el.add(child.el);
    }
  };
  //manage children methods
  MovieClip.prototype.getChildById = function (id) {
    var i;
    for (i = 0; i < this.children.length; i += 1) {
      if (this.children[i].id == id) {
        return this.children[i];
      }
    }
    return false;
  };
  MovieClip.prototype.getChildIndexById = function (id) {
    var i;
    for (i = 0; i < this.children.length; i += 1) {
      if (this.children[i].id == id) {
        return i;
      }
    }
    return false;
  };
  MovieClip.prototype.removeChildById = function (id) {
    var i;
    for (i = 0; i < this.children.length; i += 1) {
      if (this.children[i].id == id) {
        this.children.splice(i, 1);
        return;
      }
    }
  };
  MovieClip.prototype.swapChildIndex = function (id, placeAfter) {
    var i, child;
    for (i = 0; i < this.children.length; i += 1) {
      if (this.children[i].id == id) {
        child = this.children.splice(i, 1);
        break;
      }
    }
    for (i = 0; i < this.children.length; i += 1) {
      if (this.children[i].id == placeAfter) {
        this.children.splice(i + 1, 0, child[0]);
        break;
      }
    }
  };
  MovieClip.prototype.insertAtIndex = function (child, placeAfter) {
    var i;
    this._addChild(child, placeAfter);
    if (parseInt(placeAfter) === 0) {
      this.children.unshift(child);
    }
    for (i = 0; i < this.children.length; i += 1) {
      if (this.children[i].id == placeAfter) {
        this.children.splice(i + 1, 0, child);
        break;
      }
    }
  };
  MovieClip.prototype.containsMask = function () {
    var i;
    for (i = 0; i < this.children.length; i += 1) {
      if (this.children[i].isMask) {
        return true;
      }
    }
    return false;
  };
  MovieClip.prototype.getFrameLabels = function () {
    return this._labels;
  };
  MovieClip.prototype.getMatrix = function () {
    //TODO:: set to newM if exists
    if (this.matrix) {
      return this.matrix;
    } else {
      return new Snap.Matrix();
    }
  };
  MovieClip.prototype.getX = function () {
    var _x = 0;
    if (this.matrix) {
      _x = this.matrix.x();
    }
    return _x;
  };
  MovieClip.prototype.getY = function () {
    var _y = 0;
    if (this.matrix) {
      _y = this.matrix.y();
    }
    return _y;
  };
  //mouse event handlers
  MovieClip.prototype.mouseover = function (cb) {
    this.el.mouseover(cb);
  };
  MovieClip.prototype.mouseout = function (cb) {
    this.el.mouseout(cb);
  };
  MovieClip.prototype.mousedown = function (cb) {
    this.el.mousedown(cb);
  };
  MovieClip.prototype.mousemove = function (cb) {
    this.el.mousemove(cb);
  };
  MovieClip.prototype.click = function (cb) {
    this.el.click(cb);
  };
  //script methods
  MovieClip.prototype.executeFrameScript = function (script) {
    eval("(function () {" + script + "}).call(this);");
  };
  MovieClip.prototype.removeFrameScript = function (id) {
    delete this._scripts[id];
  };
  MovieClip.prototype.addFrameScript = function (id, script) {
    this._scripts[id] = script;
  };
  MovieClip.prototype.getFrame = function (num) {
    var i;
    for (i = 0; i < this.m_timeline.Frame.length; i += 1) {
      if (this.m_timeline.Frame[i].num == num) {
        return this.m_timeline.Frame[i];
      }
    }
  };
  MovieClip.prototype._checkLoop = function () {
    if (this.m_currentFrameNo == this.m_frameCount) {
      if (!this.loops) {
        return;
      }
      this._loop();
    }
  };
  //playback methods
  MovieClip.prototype._loop = function () {
    var frame, commands, children, i, found, cmData, type;
    this.m_currentFrameNo = 0;
    frame = this.getFrame(this.m_currentFrameNo);
    if (!frame) {
      this.clearChildren();
      return;
    }
    //Get the commands for the first frame
    commands = frame.Command;
    // Iterate through all the elements in the display list
    // check if same instance exists in the first frame
    for (i = 0; i < this.children.length; i += 1) {
      found = false;
      child = this.children[i];
      for (c = 0; c < commands.length; ++c) {
        cmdData = commands[c];
        type = cmdData.cmdType;
        if (type == "Place") {
          if (parseInt(child.id) == parseInt(cmdData.objectId)) {
            found = true;
            break;
          }
        }
      }
      if (found === false) {
        command = new CMD.RemoveObjectCommand(child.id);
        this.commandList.push(command);
      }
    }
  };
  MovieClip.prototype.clearChildren = function () {
    var i, child, command;
    for (i = 0; i < this.children.length; i += 1) {
      child = this.children[i];
      command = new CMD.RemoveObjectCommand(child.id);
      this.commandList.push(command);
    }
  };
  MovieClip.prototype._animate = function () {
    var i;
    //if (!this.playing) {
    //  return;
    //}
    this.step_1_animTimeline();
    this.step_2_enterFrame();
    //this.step_3_addPending();
    this.step_4_frameConstructed();
    this.step_5_frameScripts();
    this.step_6_exitFrame();
    for (i = 0; i < this.children.length; i += 1) {
      if (this.children[i]._animate) {
        this.children[i]._animate();
      }
    }
    GP.purge();
  };
  MovieClip.prototype._runCommands = function (commands) {
    var c, cmdData, command, type, found;
    for (c = 0; c < commands.length; c += 1) {
      cmdData = commands[c];
      type = cmdData.cmdType;
      command = null;
      switch (type) {
        case "Place":
          found = this.getChildById(cmdData.objectId);
          if (!found) {
            command = new CMD.PlaceObjectCommand(cmdData.charid, cmdData.objectId, cmdData.name, cmdData.placeAfter, cmdData.transformMatrix, cmdData.bounds);
            this.commandList.push(command);
          } else {
            command = new CMD.MoveObjectCommand(cmdData.objectId, cmdData.transformMatrix);
            this.commandList.push(command);
            command = new CMD.UpdateObjectCommand(cmdData.objectId, cmdData.placeAfter);
            this.commandList.push(command);
          }
          break;
        case "Move":
          command = new CMD.MoveObjectCommand(cmdData.objectId, cmdData.transformMatrix);
          this.commandList.push(command);
          break;
        case "Remove":
          command = new CMD.RemoveObjectCommand(cmdData.objectId);
          this.commandList.push(command);
          break;
        case "UpdateZOrder":
          command = new CMD.UpdateObjectCommand(cmdData.objectId, cmdData.placeAfter);
          this.commandList.push(command);
          break;
        case "UpdateVisibility":
          command = new CMD.UpdateVisibilityCommand(cmdData.objectId, cmdData.visibility);
          this.commandList.push(command);
          break;
        case "UpdateColorTransform":
          command = new CMD.UpdateColorTransformCommand(cmdData.objectId, cmdData.colorMatrix);
          this.commandList.push(command);
          break;
        case "UpdateBlendMode":
          //  command = new CMD.UpdateBlendMode(cmdData.objectId , cmdData.blendMode);
          //  this.commandList.push(command);
          break;
        case "UpdateMask":
          command = new CMD.UpdateMaskCommand(cmdData.objectId, cmdData.maskTill);
          this.commandList.push(command);
          break;
        case "AddFrameScript":
          command = new CMD.AddFrameScriptCommand(cmdData.scriptId, cmdData.script);
          this.commandList.push(command);
          break;
        case "RemoveFrameScript":
          command = new CMD.RemoveFrameScriptCommand(cmdData.scriptId);
          this.commandList.push(command);
          break;
        case "SetFrameLabel":
          command = new CMD.SetFrameLabelCommand(cmdData.Name);
          this.commandList.push(command);
          break;
      }
    }
    if (this.containsMask) {
      command = new CMD.ApplyMaskCommand();
      this.commandList.push(command);
    }
    this.executeCommands(this.commandList, this.resourceManager);
  };
  //update timeline animations
  MovieClip.prototype.step_1_animTimeline = function (seekMode, seekEnd) {
    if (typeof seekMode === "undefined") {
      seekMode = false;
    }
    if (typeof seekEnd === "undefined") {
      seekEnd = false;
    }
    var commands, frame;
    if (!this.playing) {
      return;
    }
    this.commandList = [];
    this._checkLoop();
    frame = this.getFrame(this.m_currentFrameNo);
    this.m_currentFrameNo++;
    if (!frame) {
      return;
    }
    commands = frame.Command;
    this._runCommands(commands);
  };
  MovieClip.prototype.step_2_enterFrame = function () {
    //dispatch enter frame event
    //trigger on children
  };
  MovieClip.prototype.step_3_addPending = function () {};
  MovieClip.prototype.step_4_frameConstructed = function () {
    //dispatch frame constructed event
    //trigger on children
  };
  MovieClip.prototype.step_5_frameScripts = function () {
    //trigger framescripts
    //trigger on children
    for (var i in this._scripts) {
      this.executeFrameScript(this._scripts[i]);
    }
  };
  MovieClip.prototype.step_6_exitFrame = function () {
    //dispatch exit frame event
    //trigger on children
  };
  MovieClip.prototype.play = function () {
    this.playing = true;
  };
  MovieClip.prototype.stop = function () {
    this.playing = false;
  };
  MovieClip.prototype.gotoAndStop = function (fr) {
    this._gotoAndPlayStop(fr, true);
  };
  MovieClip.prototype.gotoAndPlay = function (fr) {
    this._gotoAndPlayStop(fr, false);
  };
  MovieClip.prototype._gotoAndPlayStop = function (frame, bStop) {
    //TODO::handle labels
    if (typeof frame === "string") {
      var labels = this.getFrameLabels();
      var bFound = false;
      for (var i = labels.length - 1; i >= 0; i--) {
        if (frame === labels[i].name) {
          frame = parseInt(labels[i].frameNum) + 1;
          bFound = true;
          break;
        }
      }
      if (bFound === false) {
        return;
      }
    }
    //if frame number is invalid, don't do anything
    if (frame < 1 || frame > this.m_frameCount) {
      return;
    }
    // If we are already at the destination frame, don't do anythin
    if (frame == this.m_currentFrameNo) {
      if (bStop === false) {
        this.play();
      } else {
        this.stop();
      }
      return;
    }
    // First ensure that the timeline is in a good state to start jumping around
    //this.step_3_addPending(true);
    this.play();
    // Loop around if necessary
    if (frame < this.m_currentFrameNo) {
      var bSeekEnd = frame == 1;
      this._loopAround(true, bSeekEnd);
      //this.step_3_addPending(!bSeekEnd);
    }
    while (this.m_currentFrameNo < frame) {
      var bSeekEnd = frame == this.m_currentFrameNo;
      this.step_1_animTimeline(true, bSeekEnd);
      for (var i = 0; i < this.children.length; i += 1) {
        if (this.children[i].step_1_animTimeline) {
          this.children[i].step_1_animTimeline(true, bSeekEnd);
        }
      }
      //this.step_3_addPending(!bSeekEnd);
    }
    if (bStop === false) {
      this.play();
    } else {
      this.stop();
    }
    this.step_4_frameConstructed();
    this.step_5_frameScripts();
    this.step_6_exitFrame();
  };
  MovieClip.prototype._loopAround = function (seekMode, seekEnd) {
    if (typeof seekMode === "undefined") {
      seekMode = false;
    }
    if (typeof seekEnd === "undefined") {
      seekEnd = false;
    }
    this.commandList = [];
    this._checkLoop();
    this.m_currentFrameNo = 0;
    frame = this.getFrame(this.m_currentFrameNo);
    if (!frame) {
      return;
    }
    //Get the commands for the first frame
    commands = frame.Command;
    this._runCommands(commands);
  };
  MovieClip.prototype.executeCommands = function (commandList, resourceManager) {
    var i;
    for (i = 0; i < commandList.length; i++) {
      if (commandList[i] !== undefined) {
        commandList[i].execute(this, resourceManager);
      }
    }
  };
  MovieClip.prototype.log = function () {
    if (this.id.indexOf("svg") > -1) {
      //only on main timeline
      var args = Array.prototype.slice.call(arguments);
      args.unshift(this.id.toUpperCase());
      //console.log.apply(console, args);
    }
  };
  var CMD = {};
  //PlaceObjectCommand Class
  CMD.PlaceObjectCommand = function (charID, objectID, name, placeAfter, transform, bounds) {
    this.m_charID = charID;
    this.m_objectID = objectID;
    this.m_name = name;
    this.m_placeAfter = placeAfter;
    this.m_transform = transform;
    this.m_bounds = bounds;
  };
  //Execute function for PlaceObjectCommand
  CMD.PlaceObjectCommand.prototype.execute = function (parentMC, resourceManager) {
    var shape = resourceManager.getShape(this.m_charID),
        bitmap = resourceManager.getBitmap(this.m_charID),
        text = resourceManager.getText(this.m_charID),
        textObject,
        shapeObject,
        bmpObject,
        movieclipTimeline,
        movieclip;
    if (shape !== null && shape !== undefined) {
      shapeObject = new Shape(parentMC, resourceManager, this.m_charID, this.m_objectID, this.m_placeAfter, this.m_transform);
      parentMC.insertAtIndex(shapeObject, this.m_placeAfter);
    } else if (bitmap !== null && bitmap !== undefined) {
      bmpObject = new Bitmap(parentMC, resourceManager, this.m_charID, this.m_objectID, this.m_placeAfter, this.m_transform);
      parentMC.insertAtIndex(bmpObject, this.m_placeAfter);
    } else if (text !== null && text !== undefined) {
      textObject = new Text(parentMC, resourceManager, this.m_charID, this.m_objectID, this.m_placeAfter, this.m_transform, this.m_bounds);
      parentMC.insertAtIndex(textObject, this.m_placeAfter);
    } else {
      movieclipTimeline = resourceManager.getMovieClip(this.m_charID);
      if (movieclipTimeline) {
        movieclip = new MovieClip(movieclipTimeline, parentMC, resourceManager, this.m_objectID, this.m_name, this.m_transform);
        parentMC.insertAtIndex(movieclip, this.m_placeAfter);
        movieclip.play();
      }
    }
  };
  //MoveObjectCommand Class
  CMD.MoveObjectCommand = function (objectID, transform) {
    this.m_objectID = objectID;
    this.m_transform = transform;
  };
  //Execute function for PlaceObjectCommand
  CMD.MoveObjectCommand.prototype.execute = function (parentMC, resourceManager) {
    var transform, transformArray, transformMat;
    transform = this.m_transform;
    transformArray = transform.split(",");
    transformMat = new Snap.Matrix(transformArray[0], transformArray[1], transformArray[2], transformArray[3], transformArray[4], transformArray[5]);
    child = parentMC.getChildById(this.m_objectID);
    child.matrix = transformMat;
    child.el.transform(transformMat);
  };
  //UpdateObjectCommand Class
  CMD.UpdateObjectCommand = function (objectID, placeAfter) {
    this.m_objectID = objectID;
    this.m_placeAfter = placeAfter;
  };
  //Execute function for UpdateObjectCommand
  CMD.UpdateObjectCommand.prototype.execute = function (parentMC, resourceManager) {
    //console.log('update', this.m_objectID, this.m_placeAfter);
  };
  //RemoveObjectCommand Class
  CMD.RemoveObjectCommand = function (objectID) {
    this.m_objectID = objectID;
  };
  //Execute function for RemoveObjectCommand
  CMD.RemoveObjectCommand.prototype.execute = function (parentMC, resourceManager) {
    var child;
    child = parentMC.getChildById(this.m_objectID);
    child.el.remove();
    parentMC.removeChildById(this.m_objectID);
  };
  //UpdateVisbilityCommand Class
  CMD.UpdateVisibilityCommand = function (objectID, visibility) {
    this.m_objectID = objectID;
    this.m_visibility = visibility;
  };
  //Execute function for UpdateVisbilityCommand
  CMD.UpdateVisibilityCommand.prototype.execute = function (parentMC, resourceManager) {
    var child, visibleValue;
    child = parentMC.getChildById(this.m_objectID);
    visibleValue = this.m_visibility == "true" ? "visible" : "hidden";
    child.el.attr({ visibility: visibleValue });
  };
  CMD.UpdateMaskCommand = function (objectID, maskTill) {
    this.m_objectID = objectID;
    this.m_maskTill = maskTill;
  };
  function updateMaskContent(parentMC, child) {
    var def = child.maskElement,
        orig = parentMC.getChildById(child.id);
    def.clear();
    clone = orig.el.clone();
    clone.attr({ visibility: "visible" });
    def.append(clone);
  }
  CMD.UpdateMaskCommand.prototype.execute = function (parentMC, resourceManager) {
    //console.log('updatemask', this.m_objectID, this.m_maskTill);
    var maskConetent, mask, def, i;
    maskContent = parentMC.getChildById(this.m_objectID);
    maskContent.isMask = true;
    maskContent.maskTill = this.m_maskTill;
    mask = parentMC.el.mask();
    mask.attr("mask-type", "alpha");
    //use clone to keep element in DOM for placement, just hide
    clone = maskContent.el.clone();
    clone.attr({ visibility: "visible" });
    def = mask.toDefs();
    def.append(clone);
    maskContent.maskElement = def;
    maskContent.el.attr({ visibility: "hidden" });
  };
  CMD.ApplyMaskCommand = function () {};
  /**
   * create group for mask and add masked content
   */
  CMD.ApplyMaskCommand.prototype.execute = function (parentMC, resourceManager) {
    var i,
        insideMask = false,
        currentMask = null,
        currentMaskEl = null,
        currentTill = null,
        currentMaskGroup;
    for (i = 0; i < parentMC.children.length; i += 1) {
      var child = parentMC.children[i];
      if (child.isMask) {
        updateMaskContent(parentMC, child); //mask needs to update
        insideMask = true;
        currentMask = child;
        currentMaskEl = child.maskElement;
        currentTill = child.maskTill;
        currentMaskGroup = parentMC.el.g();
        currentMaskGroup.attr({ class: "maskGroup" });
        child.el.after(currentMaskGroup);
        currentMaskGroup.attr({ mask: currentMaskEl });
        GP.addEmpty(currentMaskGroup);
        GP.addRef(currentMaskEl, [currentMaskGroup]);
        if (child.id == child.maskTill) {
          insideMask = false;
        }
      } else {
        if (insideMask) {
          currentMaskGroup.prepend(child.el);
          child.isMasked = true;
          child.mask = currentMask.id;
          if (child.id == currentTill) {
            insideMask = false;
            currentMask = null;
            currentTill = null;
          }
        }
      }
    }
  };
  CMD.UpdateColorTransformCommand = function (objectID, colorMatrix) {
    this.m_objectID = objectID;
    this.m_colorMatrix = colorMatrix;
  };
  CMD.UpdateColorTransformCommand.prototype.execute = function (parentMC, resourceManager) {
    var child, matrix;
    child = parentMC.getChildById(this.m_objectID);
    matrix = this.m_colorMatrix.split(",", 7);
    child.el.attr({ opacity: parseFloat(matrix[6]) }); //currently only alpha
  };
  CMD.AddFrameScriptCommand = function (scriptID, script) {
    this.m_scriptID = scriptID;
    this.m_script = script;
  };
  CMD.AddFrameScriptCommand.prototype.execute = function (parentMC, resourceManager) {
    parentMC.addFrameScript(this.m_scriptID, this.m_script);
  };
  CMD.RemoveFrameScriptCommand = function (scriptID) {
    this.m_scriptID = scriptID;
  };
  CMD.RemoveFrameScriptCommand.prototype.execute = function (parentMC, resourceManager) {
    parentMC.removeFrameScript(this.m_scriptID);
  };
  CMD.SetFrameLabelCommand = function (name) {
    this.m_labelName = name;
  };
  CMD.SetFrameLabelCommand.prototype.execute = function (parentMC, resourceManager) {};
  var ResourceManager = function ResourceManager(data) {
    var id;
    this.m_shapes = [];
    this.m_movieClips = [];
    this.m_bitmaps = [];
    this.m_text = [];
    this.m_data = data;
    //Parse shapes and movieClips
    for (var shapeIndex = 0; shapeIndex < this.m_data.DOMDocument.Shape.length; shapeIndex++) {
      id = this.m_data.DOMDocument.Shape[shapeIndex].charid;
      var shapeData = this.m_data.DOMDocument.Shape[shapeIndex];
      this.m_shapes[id] = shapeData;
    }
    for (var bitmapIndex = 0; bitmapIndex < this.m_data.DOMDocument.Bitmaps.length; bitmapIndex++) {
      id = this.m_data.DOMDocument.Bitmaps[bitmapIndex].charid;
      var bitmapData = this.m_data.DOMDocument.Bitmaps[bitmapIndex];
      this.m_bitmaps[id] = bitmapData;
    }
    for (var textIndex = 0; textIndex < this.m_data.DOMDocument.Text.length; textIndex++) {
      id = this.m_data.DOMDocument.Text[textIndex].charid;
      var textData = this.m_data.DOMDocument.Text[textIndex];
      this.m_text[id] = textData;
    }
    if (this.m_data.DOMDocument.Timeline !== undefined) {
      for (var movieClipIndex = 0; movieClipIndex < this.m_data.DOMDocument.Timeline.length - 1; movieClipIndex++) {
        id = this.m_data.DOMDocument.Timeline[movieClipIndex].charid;
        var movieClipData = this.m_data.DOMDocument.Timeline[movieClipIndex];
        this.m_movieClips[id] = movieClipData;
      }
    }
  };
  //Member functions
  ResourceManager.prototype.getShape = function (id) {
    return this.m_shapes[id];
  };
  ResourceManager.prototype.getMovieClip = function (id) {
    return this.m_movieClips[id];
  };
  ResourceManager.prototype.getBitmap = function (id) {
    return this.m_bitmaps[id];
  };
  ResourceManager.prototype.getText = function (id) {
    return this.m_text[id];
  };
  /**
   * SVGAnim
   * initialize animation component
   *
   */
  function SVGAnim(data, w, h, fps, params) {
    var instance = this,
        timeline,
        playing,
        autoplay,
        cbk;
    params = params || {};
    fps = fps || 24;
    w = w || 100;
    h = h || 100;
    autoplay = params.autoplay || true;
    playing = autoplay;
    instance.debug = false;
    SVGAnim.prototype.toString = function () {
      return "SnapSVGAnimator v" + this.version;
    };
    instance.MovieClip = MovieClip;
    instance.resourceManager = new ResourceManager(data);
    //TODO:: RENDERER
    instance.s = new Snap(w, h);
    var id = instance.s.id;
    instance.s.attr("id", id);
    instance.s.attr("viewBox", "0 0 " + w + " " + h);
    instance.s.attr("preserveAspectRatio", "xMidYMid meet"); //TODO::make this adjustable
    //TODO:: set bg color here
    create(instance.s);
    if (instance.debug) {
      playing = false;
      window.addEventListener("keydown", handleKeyDown);
    }
    function create(s) {
      var maintimelineIndex, mainTimeline, i;
      if (instance.rootAnimator !== undefined) {
        instance.rootAnimator.dispose();
      }
      //generate linked movieclips
      instance.linkage = {};
      for (i = data.DOMDocument.Timeline.length - 1; i > -1; i -= 1) {
        if (typeof data.DOMDocument.Timeline[i].linkageName !== "undefined") {
          instance.linkage[data.DOMDocument.Timeline[i].linkageName] = data.DOMDocument.Timeline[i];
        } else {
          maintimelineIndex = i;
          break;
        }
      }
      mainTimeline = instance.resourceManager.m_data.DOMDocument.Timeline[maintimelineIndex];
      instance.mc = new MovieClip(mainTimeline, instance.s, instance.resourceManager, id);
      cbk = setTimeout(interval, 1000 / fps);
    }
    this.play = function () {
      instance.mc.play();
      playing = true;
    };
    this.stop = function () {
      instance.mc.stop();
      playing = false;
    };
    this.setLoop = function (l) {
      instance.mc.loops = l;
    };
    function interval() {
      instance.mc._animate();
      clearTimeout(cbk);
      if (playing) {
        cbk = setTimeout(interval, 1000 / fps);
      }
    }
    function handleKeyDown(e) {
      switch (e.keyCode) {
        case 39:
          interval();
          break;
        case 32:
          if (instance.mc.playing) {
            instance.stop();
          } else {
            instance.play();
          }
          break;
      }
    }
    if (instance.debug) {
      setInterval(traceDisplayList, 100);
    }
    /**
     * debug output for displaylist
     *
     */
    function traceDisplayList() {
      var debug = document.getElementById("debug"),
          str = "";
      if (!debug) {
        debug = document.createElement("div");
        debug.id = "debug";
        debug.style.position = "absolute";
        debug.style.top = "0";
        debug.style.right = "0";
        debug.style.backgroundColor = "black";
        debug.style.color = "white";
        debug.style.padding = "1em";
        document.body.appendChild(debug);
      }
      function traceChildren(j, el) {
        var k, i;
        for (i = 0; i < el.children.length; i += 1) {
          for (k = 0; k < j; k += 1) {
            str += "-";
          }
          str += el.children[i].id + ":" + el.children[i].children.length;
          if (el.children[i].isMask) {
            str += " (MASK till:" + el.children[i].maskTill + ")";
          }
          if (el.children[i].isMasked) {
            str += " (masked by: " + el.children[i].mask + ")";
          }
          str += "<br/>";
          traceChildren(j + 5, el.children[i]);
        }
      }
      str += instance.mc.id + "<br/>";
      str += instance.mc.m_currentFrameNo + "<br/>";
      traceChildren(2, instance.mc);
      debug.innerHTML = str;
    }
    function reset() {}
    if (autoplay) {
      instance.play();
    } else {
      interval();
    }
  }
  window.SVGAnim = SVGAnim;
  return SVGAnim;
}(window || undefined);
"use strict";
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
// Snap.svg 0.4.1
//
// Copyright (c) 2013 – 2015 Adobe Systems Incorporated. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// build: 2015-04-13
// Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
// http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// ?????????????????????????????????????????????????????????????? \\
// ? Eve 0.4.2 - JavaScript Events Library                      ? \\
// ?????????????????????????????????????????????????????????????? \\
// ? Author Dmitry Baranovskiy (http://dmitry.baranovskiy.com/) ? \\
// ?????????????????????????????????????????????????????????????? \\
(function (glob) {
    var version = "0.4.2",
        has = "hasOwnProperty",
        separator = /[\.\/]/,
        comaseparator = /\s*,\s*/,
        wildcard = "*",
        fun = function fun() {},
        numsort = function numsort(a, b) {
        return a - b;
    },
        current_event,
        stop,
        events = { n: {} },
        firstDefined = function firstDefined() {
        for (var i = 0, ii = this.length; i < ii; i++) {
            if (typeof this[i] != "undefined") {
                return this[i];
            }
        }
    },
        lastDefined = function lastDefined() {
        var i = this.length;
        while (--i) {
            if (typeof this[i] != "undefined") {
                return this[i];
            }
        }
    },
    /*\
     * eve
     [ method ]
          * Fires event with given `name`, given scope and other parameters.
          > Arguments
          - name (string) name of the *event*, dot (`.`) or slash (`/`) separated
     - scope (object) context for the event handlers
     - varargs (...) the rest of arguments will be sent to event handlers
          = (object) array of returned values from the listeners. Array has two methods `.firstDefined()` and `.lastDefined()` to get first or last not `undefined` value.
    \*/
    eve = function eve(name, scope) {
        name = String(name);
        var e = events,
            oldstop = stop,
            args = Array.prototype.slice.call(arguments, 2),
            listeners = eve.listeners(name),
            z = 0,
            f = false,
            l,
            indexed = [],
            queue = {},
            out = [],
            ce = current_event,
            errors = [];
        out.firstDefined = firstDefined;
        out.lastDefined = lastDefined;
        current_event = name;
        stop = 0;
        for (var i = 0, ii = listeners.length; i < ii; i++) {
            if ("zIndex" in listeners[i]) {
                indexed.push(listeners[i].zIndex);
                if (listeners[i].zIndex < 0) {
                    queue[listeners[i].zIndex] = listeners[i];
                }
            }
        }indexed.sort(numsort);
        while (indexed[z] < 0) {
            l = queue[indexed[z++]];
            out.push(l.apply(scope, args));
            if (stop) {
                stop = oldstop;
                return out;
            }
        }
        for (i = 0; i < ii; i++) {
            l = listeners[i];
            if ("zIndex" in l) {
                if (l.zIndex == indexed[z]) {
                    out.push(l.apply(scope, args));
                    if (stop) {
                        break;
                    }
                    do {
                        z++;
                        l = queue[indexed[z]];
                        l && out.push(l.apply(scope, args));
                        if (stop) {
                            break;
                        }
                    } while (l);
                } else {
                    queue[l.zIndex] = l;
                }
            } else {
                out.push(l.apply(scope, args));
                if (stop) {
                    break;
                }
            }
        }
        stop = oldstop;
        current_event = ce;
        return out;
    };
    // Undocumented. Debug only.
    eve._events = events;
    /*\
     * eve.listeners
     [ method ]
      * Internal method which gives you array of all event handlers that will be triggered by the given `name`.
      > Arguments
      - name (string) name of the event, dot (`.`) or slash (`/`) separated
      = (array) array of event handlers
    \*/
    eve.listeners = function (name) {
        var names = name.split(separator),
            e = events,
            item,
            items,
            k,
            i,
            ii,
            j,
            jj,
            nes,
            es = [e],
            out = [];
        for (i = 0, ii = names.length; i < ii; i++) {
            nes = [];
            for (j = 0, jj = es.length; j < jj; j++) {
                e = es[j].n;
                items = [e[names[i]], e[wildcard]];
                k = 2;
                while (k--) {
                    item = items[k];
                    if (item) {
                        nes.push(item);
                        out = out.concat(item.f || []);
                    }
                }
            }
            es = nes;
        }
        return out;
    };
    /*\
     * eve.on
     [ method ]
     **
     * Binds given event handler with a given name. You can use wildcards “`*`” for the names:
     | eve.on("*.under.*", f);
     | eve("mouse.under.floor"); // triggers f
     * Use @eve to trigger the listener.
     **
     > Arguments
     **
     - name (string) name of the event, dot (`.`) or slash (`/`) separated, with optional wildcards
     - f (function) event handler function
     **
     = (function) returned function accepts a single numeric parameter that represents z-index of the handler. It is an optional feature and only used when you need to ensure that some subset of handlers will be invoked in a given order, despite of the order of assignment. 
     > Example:
     | eve.on("mouse", eatIt)(2);
     | eve.on("mouse", scream);
     | eve.on("mouse", catchIt)(1);
     * This will ensure that `catchIt` function will be called before `eatIt`.
     *
     * If you want to put your handler before non-indexed handlers, specify a negative value.
     * Note: I assume most of the time you don’t need to worry about z-index, but it’s nice to have this feature “just in case”.
    \*/
    eve.on = function (name, f) {
        name = String(name);
        if (typeof f != "function") {
            return function () {};
        }
        var names = name.split(comaseparator);
        for (var i = 0, ii = names.length; i < ii; i++) {
            (function (name) {
                var names = name.split(separator),
                    e = events,
                    exist;
                for (var i = 0, ii = names.length; i < ii; i++) {
                    e = e.n;
                    e = e.hasOwnProperty(names[i]) && e[names[i]] || (e[names[i]] = { n: {} });
                }
                e.f = e.f || [];
                for (i = 0, ii = e.f.length; i < ii; i++) {
                    if (e.f[i] == f) {
                        exist = true;
                        break;
                    }
                }!exist && e.f.push(f);
            })(names[i]);
        }
        return function (zIndex) {
            if (+zIndex == +zIndex) {
                f.zIndex = +zIndex;
            }
        };
    };
    /*\
     * eve.f
     [ method ]
     **
     * Returns function that will fire given event with optional arguments.
     * Arguments that will be passed to the result function will be also
     * concated to the list of final arguments.
     | el.onclick = eve.f("click", 1, 2);
     | eve.on("click", function (a, b, c) {
     |     console.log(a, b, c); // 1, 2, [event object]
     | });
     > Arguments
     - event (string) event name
     - varargs (…) and any other arguments
     = (function) possible event handler function
    \*/
    eve.f = function (event) {
        var attrs = [].slice.call(arguments, 1);
        return function () {
            eve.apply(null, [event, null].concat(attrs).concat([].slice.call(arguments, 0)));
        };
    };
    /*\
     * eve.stop
     [ method ]
     **
     * Is used inside an event handler to stop the event, preventing any subsequent listeners from firing.
    \*/
    eve.stop = function () {
        stop = 1;
    };
    /*\
     * eve.nt
     [ method ]
     **
     * Could be used inside event handler to figure out actual name of the event.
     **
     > Arguments
     **
     - subname (string) #optional subname of the event
     **
     = (string) name of the event, if `subname` is not specified
     * or
     = (boolean) `true`, if current event’s name contains `subname`
    \*/
    eve.nt = function (subname) {
        if (subname) {
            return new RegExp("(?:\\.|\\/|^)" + subname + "(?:\\.|\\/|$)").test(current_event);
        }
        return current_event;
    };
    /*\
     * eve.nts
     [ method ]
     **
     * Could be used inside event handler to figure out actual name of the event.
     **
     **
     = (array) names of the event
    \*/
    eve.nts = function () {
        return current_event.split(separator);
    };
    /*\
     * eve.off
     [ method ]
     **
     * Removes given function from the list of event listeners assigned to given name.
     * If no arguments specified all the events will be cleared.
     **
     > Arguments
     **
     - name (string) name of the event, dot (`.`) or slash (`/`) separated, with optional wildcards
     - f (function) event handler function
    \*/
    /*\
     * eve.unbind
     [ method ]
     **
     * See @eve.off
    \*/
    eve.off = eve.unbind = function (name, f) {
        if (!name) {
            eve._events = events = { n: {} };
            return;
        }
        var names = name.split(comaseparator);
        if (names.length > 1) {
            for (var i = 0, ii = names.length; i < ii; i++) {
                eve.off(names[i], f);
            }
            return;
        }
        names = name.split(separator);
        var e,
            key,
            splice,
            i,
            ii,
            j,
            jj,
            cur = [events];
        for (i = 0, ii = names.length; i < ii; i++) {
            for (j = 0; j < cur.length; j += splice.length - 2) {
                splice = [j, 1];
                e = cur[j].n;
                if (names[i] != wildcard) {
                    if (e[names[i]]) {
                        splice.push(e[names[i]]);
                    }
                } else {
                    for (key in e) {
                        if (e[has](key)) {
                            splice.push(e[key]);
                        }
                    }
                }
                cur.splice.apply(cur, splice);
            }
        }
        for (i = 0, ii = cur.length; i < ii; i++) {
            e = cur[i];
            while (e.n) {
                if (f) {
                    if (e.f) {
                        for (j = 0, jj = e.f.length; j < jj; j++) {
                            if (e.f[j] == f) {
                                e.f.splice(j, 1);
                                break;
                            }
                        }!e.f.length && delete e.f;
                    }
                    for (key in e.n) {
                        if (e.n[has](key) && e.n[key].f) {
                            var funcs = e.n[key].f;
                            for (j = 0, jj = funcs.length; j < jj; j++) {
                                if (funcs[j] == f) {
                                    funcs.splice(j, 1);
                                    break;
                                }
                            }!funcs.length && delete e.n[key].f;
                        }
                    }
                } else {
                    delete e.f;
                    for (key in e.n) {
                        if (e.n[has](key) && e.n[key].f) {
                            delete e.n[key].f;
                        }
                    }
                }
                e = e.n;
            }
        }
    };
    /*\
     * eve.once
     [ method ]
     **
     * Binds given event handler with a given name to only run once then unbind itself.
     | eve.once("login", f);
     | eve("login"); // triggers f
     | eve("login"); // no listeners
     * Use @eve to trigger the listener.
     **
     > Arguments
     **
     - name (string) name of the event, dot (`.`) or slash (`/`) separated, with optional wildcards
     - f (function) event handler function
     **
     = (function) same return function as @eve.on
    \*/
    eve.once = function (name, f) {
        var f2 = function f2() {
            eve.unbind(name, f2);
            return f.apply(this, arguments);
        };
        return eve.on(name, f2);
    };
    /*\
     * eve.version
     [ property (string) ]
     **
     * Current version of the library.
    \*/
    eve.version = version;
    eve.toString = function () {
        return "You are running Eve " + version;
    };
    typeof module != "undefined" && module.exports ? module.exports = eve : typeof define === "function" && define.amd ? define("eve", [], function () {
        return eve;
    }) : glob.eve = eve;
})(window);
(function (glob, factory) {
    // AMD support
    if (typeof define == "function" && define.amd) {
        // Define as an anonymous module
        define(["eve"], function (eve) {
            return factory(glob, eve);
        });
    } else if (typeof exports != 'undefined') {
        // Next for Node.js or CommonJS
        var eve = require('eve');
        module.exports = factory(glob, eve);
    } else {
        // Browser globals (glob is window)
        // Snap adds itself to window
        factory(glob, glob.eve);
    }
})(window, function (window, eve) {
    // Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
    // 
    // Licensed under the Apache License, Version 2.0 (the "License");
    // you may not use this file except in compliance with the License.
    // You may obtain a copy of the License at
    // 
    // http://www.apache.org/licenses/LICENSE-2.0
    // 
    // Unless required by applicable law or agreed to in writing, software
    // distributed under the License is distributed on an "AS IS" BASIS,
    // WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    // See the License for the specific language governing permissions and
    // limitations under the License.
    var mina = function (eve) {
        var animations = {},
            requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
            setTimeout(callback, 16);
        },
            isArray = Array.isArray || function (a) {
            return a instanceof Array || Object.prototype.toString.call(a) == "[object Array]";
        },
            idgen = 0,
            idprefix = "M" + (+new Date()).toString(36),
            ID = function ID() {
            return idprefix + (idgen++).toString(36);
        },
            diff = function diff(a, b, A, B) {
            if (isArray(a)) {
                res = [];
                for (var i = 0, ii = a.length; i < ii; i++) {
                    res[i] = diff(a[i], b, A[i], B);
                }
                return res;
            }
            var dif = (A - a) / (B - b);
            return function (bb) {
                return a + dif * (bb - b);
            };
        },
            timer = Date.now || function () {
            return +new Date();
        },
            sta = function sta(val) {
            var a = this;
            if (val == null) {
                return a.s;
            }
            var ds = a.s - val;
            a.b += a.dur * ds;
            a.B += a.dur * ds;
            a.s = val;
        },
            speed = function speed(val) {
            var a = this;
            if (val == null) {
                return a.spd;
            }
            a.spd = val;
        },
            duration = function duration(val) {
            var a = this;
            if (val == null) {
                return a.dur;
            }
            a.s = a.s * val / a.dur;
            a.dur = val;
        },
            stopit = function stopit() {
            var a = this;
            delete animations[a.id];
            a.update();
            eve("mina.stop." + a.id, a);
        },
            pause = function pause() {
            var a = this;
            if (a.pdif) {
                return;
            }
            delete animations[a.id];
            a.update();
            a.pdif = a.get() - a.b;
        },
            resume = function resume() {
            var a = this;
            if (!a.pdif) {
                return;
            }
            a.b = a.get() - a.pdif;
            delete a.pdif;
            animations[a.id] = a;
        },
            update = function update() {
            var a = this,
                res;
            if (isArray(a.start)) {
                res = [];
                for (var j = 0, jj = a.start.length; j < jj; j++) {
                    res[j] = +a.start[j] + (a.end[j] - a.start[j]) * a.easing(a.s);
                }
            } else {
                res = +a.start + (a.end - a.start) * a.easing(a.s);
            }
            a.set(res);
        },
            frame = function frame() {
            var len = 0;
            for (var i in animations) {
                if (animations.hasOwnProperty(i)) {
                    var a = animations[i],
                        b = a.get(),
                        res;
                    len++;
                    a.s = (b - a.b) / (a.dur / a.spd);
                    if (a.s >= 1) {
                        delete animations[i];
                        a.s = 1;
                        len--;
                        (function (a) {
                            setTimeout(function () {
                                eve("mina.finish." + a.id, a);
                            });
                        })(a);
                    }
                    a.update();
                }
            }len && requestAnimFrame(frame);
        },
        /*\
         * mina
         [ method ]
         **
         * Generic animation of numbers
         **
         - a (number) start _slave_ number
         - A (number) end _slave_ number
         - b (number) start _master_ number (start time in general case)
         - B (number) end _master_ number (end time in gereal case)
         - get (function) getter of _master_ number (see @mina.time)
         - set (function) setter of _slave_ number
         - easing (function) #optional easing function, default is @mina.linear
         = (object) animation descriptor
         o {
         o         id (string) animation id,
         o         start (number) start _slave_ number,
         o         end (number) end _slave_ number,
         o         b (number) start _master_ number,
         o         s (number) animation status (0..1),
         o         dur (number) animation duration,
         o         spd (number) animation speed,
         o         get (function) getter of _master_ number (see @mina.time),
         o         set (function) setter of _slave_ number,
         o         easing (function) easing function, default is @mina.linear,
         o         status (function) status getter/setter,
         o         speed (function) speed getter/setter,
         o         duration (function) duration getter/setter,
         o         stop (function) animation stopper
         o         pause (function) pauses the animation
         o         resume (function) resumes the animation
         o         update (function) calles setter with the right value of the animation
         o }
        \*/
        mina = function mina(a, A, b, B, get, set, easing) {
            var anim = {
                id: ID(),
                start: a,
                end: A,
                b: b,
                s: 0,
                dur: B - b,
                spd: 1,
                get: get,
                set: set,
                easing: easing || mina.linear,
                status: sta,
                speed: speed,
                duration: duration,
                stop: stopit,
                pause: pause,
                resume: resume,
                update: update
            };
            animations[anim.id] = anim;
            var len = 0,
                i;
            for (i in animations) {
                if (animations.hasOwnProperty(i)) {
                    len++;
                    if (len == 2) {
                        break;
                    }
                }
            }len == 1 && requestAnimFrame(frame);
            return anim;
        };
        /*\
         * mina.time
         [ method ]
         **
         * Returns the current time. Equivalent to:
         | function () {
         |     return (new Date).getTime();
         | }
        \*/
        mina.time = timer;
        /*\
         * mina.getById
         [ method ]
         **
         * Returns an animation by its id
         - id (string) animation's id
         = (object) See @mina
        \*/
        mina.getById = function (id) {
            return animations[id] || null;
        };
        /*\
         * mina.linear
         [ method ]
         **
         * Default linear easing
         - n (number) input 0..1
         = (number) output 0..1
        \*/
        mina.linear = function (n) {
            return n;
        };
        /*\
         * mina.easeout
         [ method ]
         **
         * Easeout easing
         - n (number) input 0..1
         = (number) output 0..1
        \*/
        mina.easeout = function (n) {
            return Math.pow(n, 1.7);
        };
        /*\
         * mina.easein
         [ method ]
         **
         * Easein easing
         - n (number) input 0..1
         = (number) output 0..1
        \*/
        mina.easein = function (n) {
            return Math.pow(n, .48);
        };
        /*\
         * mina.easeinout
         [ method ]
         **
         * Easeinout easing
         - n (number) input 0..1
         = (number) output 0..1
        \*/
        mina.easeinout = function (n) {
            if (n == 1) {
                return 1;
            }
            if (n == 0) {
                return 0;
            }
            var q = .48 - n / 1.04,
                Q = Math.sqrt(.1734 + q * q),
                x = Q - q,
                X = Math.pow(Math.abs(x), 1 / 3) * (x < 0 ? -1 : 1),
                y = -Q - q,
                Y = Math.pow(Math.abs(y), 1 / 3) * (y < 0 ? -1 : 1),
                t = X + Y + .5;
            return (1 - t) * 3 * t * t + t * t * t;
        };
        /*\
         * mina.backin
         [ method ]
         **
         * Backin easing
         - n (number) input 0..1
         = (number) output 0..1
        \*/
        mina.backin = function (n) {
            if (n == 1) {
                return 1;
            }
            var s = 1.70158;
            return n * n * ((s + 1) * n - s);
        };
        /*\
         * mina.backout
         [ method ]
         **
         * Backout easing
         - n (number) input 0..1
         = (number) output 0..1
        \*/
        mina.backout = function (n) {
            if (n == 0) {
                return 0;
            }
            n = n - 1;
            var s = 1.70158;
            return n * n * ((s + 1) * n + s) + 1;
        };
        /*\
         * mina.elastic
         [ method ]
         **
         * Elastic easing
         - n (number) input 0..1
         = (number) output 0..1
        \*/
        mina.elastic = function (n) {
            if (n == !!n) {
                return n;
            }
            return Math.pow(2, -10 * n) * Math.sin((n - .075) * (2 * Math.PI) / .3) + 1;
        };
        /*\
         * mina.bounce
         [ method ]
         **
         * Bounce easing
         - n (number) input 0..1
         = (number) output 0..1
        \*/
        mina.bounce = function (n) {
            var s = 7.5625,
                p = 2.75,
                l;
            if (n < 1 / p) {
                l = s * n * n;
            } else {
                if (n < 2 / p) {
                    n -= 1.5 / p;
                    l = s * n * n + .75;
                } else {
                    if (n < 2.5 / p) {
                        n -= 2.25 / p;
                        l = s * n * n + .9375;
                    } else {
                        n -= 2.625 / p;
                        l = s * n * n + .984375;
                    }
                }
            }
            return l;
        };
        window.mina = mina;
        return mina;
    }(typeof eve == "undefined" ? function () {} : eve);
    // Copyright (c) 2013 - 2015 Adobe Systems Incorporated. All rights reserved.
    // 
    // Licensed under the Apache License, Version 2.0 (the "License");
    // you may not use this file except in compliance with the License.
    // You may obtain a copy of the License at
    // 
    // http://www.apache.org/licenses/LICENSE-2.0
    // 
    // Unless required by applicable law or agreed to in writing, software
    // distributed under the License is distributed on an "AS IS" BASIS,
    // WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    // See the License for the specific language governing permissions and
    // limitations under the License.
    var Snap = function (root) {
        Snap.version = "0.4.0";
        /*\
         * Snap
         [ method ]
         **
         * Creates a drawing surface or wraps existing SVG element.
         **
         - width (number|string) width of surface
         - height (number|string) height of surface
         * or
         - DOM (SVGElement) element to be wrapped into Snap structure
         * or
         - array (array) array of elements (will return set of elements)
         * or
         - query (string) CSS query selector
         = (object) @Element
        \*/
        function Snap(w, h) {
            if (w) {
                if (w.nodeType) {
                    return wrap(w);
                }
                if (is(w, "array") && Snap.set) {
                    return Snap.set.apply(Snap, w);
                }
                if (w instanceof Element) {
                    return w;
                }
                if (h == null) {
                    w = glob.doc.querySelector(String(w));
                    return wrap(w);
                }
            }
            w = w == null ? "100%" : w;
            h = h == null ? "100%" : h;
            return new Paper(w, h);
        }
        Snap.toString = function () {
            return "Snap v" + this.version;
        };
        Snap._ = {};
        var glob = {
            win: root.window,
            doc: root.window.document
        };
        Snap._.glob = glob;
        var has = "hasOwnProperty",
            Str = String,
            toFloat = parseFloat,
            toInt = parseInt,
            math = Math,
            mmax = math.max,
            mmin = math.min,
            abs = math.abs,
            pow = math.pow,
            PI = math.PI,
            round = math.round,
            E = "",
            S = " ",
            objectToString = Object.prototype.toString,
            ISURL = /^url\(['"]?([^\)]+?)['"]?\)$/i,
            colourRegExp = /^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+%?)?)\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?%?)\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?%?)\s*\))\s*$/i,
            bezierrg = /^(?:cubic-)?bezier\(([^,]+),([^,]+),([^,]+),([^\)]+)\)/,
            reURLValue = /^url\(#?([^)]+)\)$/,
            separator = Snap._.separator = /[,\s]+/,
            whitespace = /[\s]/g,
            commaSpaces = /[\s]*,[\s]*/,
            hsrg = { hs: 1, rg: 1 },
            pathCommand = /([a-z])[\s,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\s]*,?[\s]*)+)/ig,
            tCommand = /([rstm])[\s,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\s]*,?[\s]*)+)/ig,
            pathValues = /(-?\d*\.?\d*(?:e[\-+]?\\d+)?)[\s]*,?[\s]*/ig,
            idgen = 0,
            idprefix = "S" + (+new Date()).toString(36),
            ID = function ID(el) {
            return (el && el.type ? el.type : E) + idprefix + (idgen++).toString(36);
        },
            xlink = "http://www.w3.org/1999/xlink",
            xmlns = "http://www.w3.org/2000/svg",
            hub = {},
            URL = Snap.url = function (url) {
            return "url('#" + url + "')";
        };
        function $(el, attr) {
            if (attr) {
                if (el == "#text") {
                    el = glob.doc.createTextNode(attr.text || attr["#text"] || "");
                }
                if (el == "#comment") {
                    el = glob.doc.createComment(attr.text || attr["#text"] || "");
                }
                if (typeof el == "string") {
                    el = $(el);
                }
                if (typeof attr == "string") {
                    if (el.nodeType == 1) {
                        if (attr.substring(0, 6) == "xlink:") {
                            return el.getAttributeNS(xlink, attr.substring(6));
                        }
                        if (attr.substring(0, 4) == "xml:") {
                            return el.getAttributeNS(xmlns, attr.substring(4));
                        }
                        return el.getAttribute(attr);
                    } else if (attr == "text") {
                        return el.nodeValue;
                    } else {
                        return null;
                    }
                }
                if (el.nodeType == 1) {
                    for (var key in attr) {
                        if (attr[has](key)) {
                            var val = Str(attr[key]);
                            if (val) {
                                if (key.substring(0, 6) == "xlink:") {
                                    el.setAttributeNS(xlink, key.substring(6), val);
                                } else if (key.substring(0, 4) == "xml:") {
                                    el.setAttributeNS(xmlns, key.substring(4), val);
                                } else {
                                    el.setAttribute(key, val);
                                }
                            } else {
                                el.removeAttribute(key);
                            }
                        }
                    }
                } else if ("text" in attr) {
                    el.nodeValue = attr.text;
                }
            } else {
                el = glob.doc.createElementNS(xmlns, el);
            }
            return el;
        }
        Snap._.$ = $;
        Snap._.id = ID;
        function getAttrs(el) {
            var attrs = el.attributes,
                name,
                out = {};
            for (var i = 0; i < attrs.length; i++) {
                if (attrs[i].namespaceURI == xlink) {
                    name = "xlink:";
                } else {
                    name = "";
                }
                name += attrs[i].name;
                out[name] = attrs[i].textContent;
            }
            return out;
        }
        function is(o, type) {
            type = Str.prototype.toLowerCase.call(type);
            if (type == "finite") {
                return isFinite(o);
            }
            if (type == "array" && (o instanceof Array || Array.isArray && Array.isArray(o))) {
                return true;
            }
            return type == "null" && o === null || type == (typeof o === "undefined" ? "undefined" : _typeof(o)) && o !== null || type == "object" && o === Object(o) || objectToString.call(o).slice(8, -1).toLowerCase() == type;
        }
        /*\
         * Snap.format
         [ method ]
         **
         * Replaces construction of type `{<name>}` to the corresponding argument
         **
         - token (string) string to format
         - json (object) object which properties are used as a replacement
         = (string) formatted string
         > Usage
         | // this draws a rectangular shape equivalent to "M10,20h40v50h-40z"
         | paper.path(Snap.format("M{x},{y}h{dim.width}v{dim.height}h{dim['negative width']}z", {
         |     x: 10,
         |     y: 20,
         |     dim: {
         |         width: 40,
         |         height: 50,
         |         "negative width": -40
         |     }
         | }));
        \*/
        Snap.format = function () {
            var tokenRegex = /\{([^\}]+)\}/g,
                objNotationRegex = /(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g,
                // matches .xxxxx or ["xxxxx"] to run over object properties
            replacer = function replacer(all, key, obj) {
                var res = obj;
                key.replace(objNotationRegex, function (all, name, quote, quotedName, isFunc) {
                    name = name || quotedName;
                    if (res) {
                        if (name in res) {
                            res = res[name];
                        }
                        typeof res == "function" && isFunc && (res = res());
                    }
                });
                res = (res == null || res == obj ? all : res) + "";
                return res;
            };
            return function (str, obj) {
                return Str(str).replace(tokenRegex, function (all, key) {
                    return replacer(all, key, obj);
                });
            };
        }();
        function clone(obj) {
            if (typeof obj == "function" || Object(obj) !== obj) {
                return obj;
            }
            var res = new obj.constructor();
            for (var key in obj) {
                if (obj[has](key)) {
                    res[key] = clone(obj[key]);
                }
            }return res;
        }
        Snap._.clone = clone;
        function repush(array, item) {
            for (var i = 0, ii = array.length; i < ii; i++) {
                if (array[i] === item) {
                    return array.push(array.splice(i, 1)[0]);
                }
            }
        }
        function cacher(f, scope, postprocessor) {
            function newf() {
                var arg = Array.prototype.slice.call(arguments, 0),
                    args = arg.join("\u2400"),
                    cache = newf.cache = newf.cache || {},
                    count = newf.count = newf.count || [];
                if (cache[has](args)) {
                    repush(count, args);
                    return postprocessor ? postprocessor(cache[args]) : cache[args];
                }
                count.length >= 1e3 && delete cache[count.shift()];
                count.push(args);
                cache[args] = f.apply(scope, arg);
                return postprocessor ? postprocessor(cache[args]) : cache[args];
            }
            return newf;
        }
        Snap._.cacher = cacher;
        function angle(x1, y1, x2, y2, x3, y3) {
            if (x3 == null) {
                var x = x1 - x2,
                    y = y1 - y2;
                if (!x && !y) {
                    return 0;
                }
                return (180 + math.atan2(-y, -x) * 180 / PI + 360) % 360;
            } else {
                return angle(x1, y1, x3, y3) - angle(x2, y2, x3, y3);
            }
        }
        function rad(deg) {
            return deg % 360 * PI / 180;
        }
        function deg(rad) {
            return rad * 180 / PI % 360;
        }
        function x_y() {
            return this.x + S + this.y;
        }
        function x_y_w_h() {
            return this.x + S + this.y + S + this.width + " \xd7 " + this.height;
        }
        /*\
         * Snap.rad
         [ method ]
         **
         * Transform angle to radians
         - deg (number) angle in degrees
         = (number) angle in radians
        \*/
        Snap.rad = rad;
        /*\
         * Snap.deg
         [ method ]
         **
         * Transform angle to degrees
         - rad (number) angle in radians
         = (number) angle in degrees
        \*/
        Snap.deg = deg;
        /*\
         * Snap.sin
         [ method ]
         **
         * Equivalent to `Math.sin()` only works with degrees, not radians.
         - angle (number) angle in degrees
         = (number) sin
        \*/
        Snap.sin = function (angle) {
            return math.sin(Snap.rad(angle));
        };
        /*\
         * Snap.tan
         [ method ]
         **
         * Equivalent to `Math.tan()` only works with degrees, not radians.
         - angle (number) angle in degrees
         = (number) tan
        \*/
        Snap.tan = function (angle) {
            return math.tan(Snap.rad(angle));
        };
        /*\
         * Snap.cos
         [ method ]
         **
         * Equivalent to `Math.cos()` only works with degrees, not radians.
         - angle (number) angle in degrees
         = (number) cos
        \*/
        Snap.cos = function (angle) {
            return math.cos(Snap.rad(angle));
        };
        /*\
         * Snap.asin
         [ method ]
         **
         * Equivalent to `Math.asin()` only works with degrees, not radians.
         - num (number) value
         = (number) asin in degrees
        \*/
        Snap.asin = function (num) {
            return Snap.deg(math.asin(num));
        };
        /*\
         * Snap.acos
         [ method ]
         **
         * Equivalent to `Math.acos()` only works with degrees, not radians.
         - num (number) value
         = (number) acos in degrees
        \*/
        Snap.acos = function (num) {
            return Snap.deg(math.acos(num));
        };
        /*\
         * Snap.atan
         [ method ]
         **
         * Equivalent to `Math.atan()` only works with degrees, not radians.
         - num (number) value
         = (number) atan in degrees
        \*/
        Snap.atan = function (num) {
            return Snap.deg(math.atan(num));
        };
        /*\
         * Snap.atan2
         [ method ]
         **
         * Equivalent to `Math.atan2()` only works with degrees, not radians.
         - num (number) value
         = (number) atan2 in degrees
        \*/
        Snap.atan2 = function (num) {
            return Snap.deg(math.atan2(num));
        };
        /*\
         * Snap.angle
         [ method ]
         **
         * Returns an angle between two or three points
         > Parameters
         - x1 (number) x coord of first point
         - y1 (number) y coord of first point
         - x2 (number) x coord of second point
         - y2 (number) y coord of second point
         - x3 (number) #optional x coord of third point
         - y3 (number) #optional y coord of third point
         = (number) angle in degrees
        \*/
        Snap.angle = angle;
        /*\
         * Snap.len
         [ method ]
         **
         * Returns distance between two points
         > Parameters
         - x1 (number) x coord of first point
         - y1 (number) y coord of first point
         - x2 (number) x coord of second point
         - y2 (number) y coord of second point
         = (number) distance
        \*/
        Snap.len = function (x1, y1, x2, y2) {
            return Math.sqrt(Snap.len2(x1, y1, x2, y2));
        };
        /*\
         * Snap.len2
         [ method ]
         **
         * Returns squared distance between two points
         > Parameters
         - x1 (number) x coord of first point
         - y1 (number) y coord of first point
         - x2 (number) x coord of second point
         - y2 (number) y coord of second point
         = (number) distance
        \*/
        Snap.len2 = function (x1, y1, x2, y2) {
            return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
        };
        /*\
         * Snap.closestPoint
         [ method ]
         **
         * Returns closest point to a given one on a given path.
         > Parameters
         - path (Element) path element
         - x (number) x coord of a point
         - y (number) y coord of a point
         = (object) in format
         {
            x (number) x coord of the point on the path
            y (number) y coord of the point on the path
            length (number) length of the path to the point
            distance (number) distance from the given point to the path
         }
        \*/
        // Copied from http://bl.ocks.org/mbostock/8027637
        Snap.closestPoint = function (path, x, y) {
            function distance2(p) {
                var dx = p.x - x,
                    dy = p.y - y;
                return dx * dx + dy * dy;
            }
            var pathNode = path.node,
                pathLength = pathNode.getTotalLength(),
                precision = pathLength / pathNode.pathSegList.numberOfItems * .125,
                best,
                bestLength,
                bestDistance = Infinity;
            // linear scan for coarse approximation
            for (var scan, scanLength = 0, scanDistance; scanLength <= pathLength; scanLength += precision) {
                if ((scanDistance = distance2(scan = pathNode.getPointAtLength(scanLength))) < bestDistance) {
                    best = scan, bestLength = scanLength, bestDistance = scanDistance;
                }
            }
            // binary search for precise estimate
            precision *= .5;
            while (precision > .5) {
                var before, after, beforeLength, afterLength, beforeDistance, afterDistance;
                if ((beforeLength = bestLength - precision) >= 0 && (beforeDistance = distance2(before = pathNode.getPointAtLength(beforeLength))) < bestDistance) {
                    best = before, bestLength = beforeLength, bestDistance = beforeDistance;
                } else if ((afterLength = bestLength + precision) <= pathLength && (afterDistance = distance2(after = pathNode.getPointAtLength(afterLength))) < bestDistance) {
                    best = after, bestLength = afterLength, bestDistance = afterDistance;
                } else {
                    precision *= .5;
                }
            }
            best = {
                x: best.x,
                y: best.y,
                length: bestLength,
                distance: Math.sqrt(bestDistance)
            };
            return best;
        };
        /*\
         * Snap.is
         [ method ]
         **
         * Handy replacement for the `typeof` operator
         - o (…) any object or primitive
         - type (string) name of the type, e.g., `string`, `function`, `number`, etc.
         = (boolean) `true` if given value is of given type
        \*/
        Snap.is = is;
        /*\
         * Snap.snapTo
         [ method ]
         **
         * Snaps given value to given grid
         - values (array|number) given array of values or step of the grid
         - value (number) value to adjust
         - tolerance (number) #optional maximum distance to the target value that would trigger the snap. Default is `10`.
         = (number) adjusted value
        \*/
        Snap.snapTo = function (values, value, tolerance) {
            tolerance = is(tolerance, "finite") ? tolerance : 10;
            if (is(values, "array")) {
                var i = values.length;
                while (i--) {
                    if (abs(values[i] - value) <= tolerance) {
                        return values[i];
                    }
                }
            } else {
                values = +values;
                var rem = value % values;
                if (rem < tolerance) {
                    return value - rem;
                }
                if (rem > values - tolerance) {
                    return value - rem + values;
                }
            }
            return value;
        };
        // Colour
        /*\
         * Snap.getRGB
         [ method ]
         **
         * Parses color string as RGB object
         - color (string) color string in one of the following formats:
         # <ul>
         #     <li>Color name (<code>red</code>, <code>green</code>, <code>cornflowerblue</code>, etc)</li>
         #     <li>#••• — shortened HTML color: (<code>#000</code>, <code>#fc0</code>, etc.)</li>
         #     <li>#•••••• — full length HTML color: (<code>#000000</code>, <code>#bd2300</code>)</li>
         #     <li>rgb(•••, •••, •••) — red, green and blue channels values: (<code>rgb(200,&nbsp;100,&nbsp;0)</code>)</li>
         #     <li>rgba(•••, •••, •••, •••) — also with opacity</li>
         #     <li>rgb(•••%, •••%, •••%) — same as above, but in %: (<code>rgb(100%,&nbsp;175%,&nbsp;0%)</code>)</li>
         #     <li>rgba(•••%, •••%, •••%, •••%) — also with opacity</li>
         #     <li>hsb(•••, •••, •••) — hue, saturation and brightness values: (<code>hsb(0.5,&nbsp;0.25,&nbsp;1)</code>)</li>
         #     <li>hsba(•••, •••, •••, •••) — also with opacity</li>
         #     <li>hsb(•••%, •••%, •••%) — same as above, but in %</li>
         #     <li>hsba(•••%, •••%, •••%, •••%) — also with opacity</li>
         #     <li>hsl(•••, •••, •••) — hue, saturation and luminosity values: (<code>hsb(0.5,&nbsp;0.25,&nbsp;0.5)</code>)</li>
         #     <li>hsla(•••, •••, •••, •••) — also with opacity</li>
         #     <li>hsl(•••%, •••%, •••%) — same as above, but in %</li>
         #     <li>hsla(•••%, •••%, •••%, •••%) — also with opacity</li>
         # </ul>
         * Note that `%` can be used any time: `rgb(20%, 255, 50%)`.
         = (object) RGB object in the following format:
         o {
         o     r (number) red,
         o     g (number) green,
         o     b (number) blue,
         o     hex (string) color in HTML/CSS format: #••••••,
         o     error (boolean) true if string can't be parsed
         o }
        \*/
        Snap.getRGB = cacher(function (colour) {
            if (!colour || !!((colour = Str(colour)).indexOf("-") + 1)) {
                return { r: -1, g: -1, b: -1, hex: "none", error: 1, toString: rgbtoString };
            }
            if (colour == "none") {
                return { r: -1, g: -1, b: -1, hex: "none", toString: rgbtoString };
            }
            !(hsrg[has](colour.toLowerCase().substring(0, 2)) || colour.charAt() == "#") && (colour = _toHex(colour));
            if (!colour) {
                return { r: -1, g: -1, b: -1, hex: "none", error: 1, toString: rgbtoString };
            }
            var res,
                red,
                green,
                blue,
                opacity,
                t,
                values,
                rgb = colour.match(colourRegExp);
            if (rgb) {
                if (rgb[2]) {
                    blue = toInt(rgb[2].substring(5), 16);
                    green = toInt(rgb[2].substring(3, 5), 16);
                    red = toInt(rgb[2].substring(1, 3), 16);
                }
                if (rgb[3]) {
                    blue = toInt((t = rgb[3].charAt(3)) + t, 16);
                    green = toInt((t = rgb[3].charAt(2)) + t, 16);
                    red = toInt((t = rgb[3].charAt(1)) + t, 16);
                }
                if (rgb[4]) {
                    values = rgb[4].split(commaSpaces);
                    red = toFloat(values[0]);
                    values[0].slice(-1) == "%" && (red *= 2.55);
                    green = toFloat(values[1]);
                    values[1].slice(-1) == "%" && (green *= 2.55);
                    blue = toFloat(values[2]);
                    values[2].slice(-1) == "%" && (blue *= 2.55);
                    rgb[1].toLowerCase().slice(0, 4) == "rgba" && (opacity = toFloat(values[3]));
                    values[3] && values[3].slice(-1) == "%" && (opacity /= 100);
                }
                if (rgb[5]) {
                    values = rgb[5].split(commaSpaces);
                    red = toFloat(values[0]);
                    values[0].slice(-1) == "%" && (red /= 100);
                    green = toFloat(values[1]);
                    values[1].slice(-1) == "%" && (green /= 100);
                    blue = toFloat(values[2]);
                    values[2].slice(-1) == "%" && (blue /= 100);
                    (values[0].slice(-3) == "deg" || values[0].slice(-1) == "\xb0") && (red /= 360);
                    rgb[1].toLowerCase().slice(0, 4) == "hsba" && (opacity = toFloat(values[3]));
                    values[3] && values[3].slice(-1) == "%" && (opacity /= 100);
                    return Snap.hsb2rgb(red, green, blue, opacity);
                }
                if (rgb[6]) {
                    values = rgb[6].split(commaSpaces);
                    red = toFloat(values[0]);
                    values[0].slice(-1) == "%" && (red /= 100);
                    green = toFloat(values[1]);
                    values[1].slice(-1) == "%" && (green /= 100);
                    blue = toFloat(values[2]);
                    values[2].slice(-1) == "%" && (blue /= 100);
                    (values[0].slice(-3) == "deg" || values[0].slice(-1) == "\xb0") && (red /= 360);
                    rgb[1].toLowerCase().slice(0, 4) == "hsla" && (opacity = toFloat(values[3]));
                    values[3] && values[3].slice(-1) == "%" && (opacity /= 100);
                    return Snap.hsl2rgb(red, green, blue, opacity);
                }
                red = mmin(math.round(red), 255);
                green = mmin(math.round(green), 255);
                blue = mmin(math.round(blue), 255);
                opacity = mmin(mmax(opacity, 0), 1);
                rgb = { r: red, g: green, b: blue, toString: rgbtoString };
                rgb.hex = "#" + (16777216 | blue | green << 8 | red << 16).toString(16).slice(1);
                rgb.opacity = is(opacity, "finite") ? opacity : 1;
                return rgb;
            }
            return { r: -1, g: -1, b: -1, hex: "none", error: 1, toString: rgbtoString };
        }, Snap);
        /*\
         * Snap.hsb
         [ method ]
         **
         * Converts HSB values to a hex representation of the color
         - h (number) hue
         - s (number) saturation
         - b (number) value or brightness
         = (string) hex representation of the color
        \*/
        Snap.hsb = cacher(function (h, s, b) {
            return Snap.hsb2rgb(h, s, b).hex;
        });
        /*\
         * Snap.hsl
         [ method ]
         **
         * Converts HSL values to a hex representation of the color
         - h (number) hue
         - s (number) saturation
         - l (number) luminosity
         = (string) hex representation of the color
        \*/
        Snap.hsl = cacher(function (h, s, l) {
            return Snap.hsl2rgb(h, s, l).hex;
        });
        /*\
         * Snap.rgb
         [ method ]
         **
         * Converts RGB values to a hex representation of the color
         - r (number) red
         - g (number) green
         - b (number) blue
         = (string) hex representation of the color
        \*/
        Snap.rgb = cacher(function (r, g, b, o) {
            if (is(o, "finite")) {
                var round = math.round;
                return "rgba(" + [round(r), round(g), round(b), +o.toFixed(2)] + ")";
            }
            return "#" + (16777216 | b | g << 8 | r << 16).toString(16).slice(1);
        });
        var _toHex = function toHex(color) {
            var i = glob.doc.getElementsByTagName("head")[0] || glob.doc.getElementsByTagName("svg")[0],
                red = "rgb(255, 0, 0)";
            _toHex = cacher(function (color) {
                if (color.toLowerCase() == "red") {
                    return red;
                }
                i.style.color = red;
                i.style.color = color;
                var out = glob.doc.defaultView.getComputedStyle(i, E).getPropertyValue("color");
                return out == red ? null : out;
            });
            return _toHex(color);
        },
            hsbtoString = function hsbtoString() {
            return "hsb(" + [this.h, this.s, this.b] + ")";
        },
            hsltoString = function hsltoString() {
            return "hsl(" + [this.h, this.s, this.l] + ")";
        },
            rgbtoString = function rgbtoString() {
            return this.opacity == 1 || this.opacity == null ? this.hex : "rgba(" + [this.r, this.g, this.b, this.opacity] + ")";
        },
            prepareRGB = function prepareRGB(r, g, b) {
            if (g == null && is(r, "object") && "r" in r && "g" in r && "b" in r) {
                b = r.b;
                g = r.g;
                r = r.r;
            }
            if (g == null && is(r, string)) {
                var clr = Snap.getRGB(r);
                r = clr.r;
                g = clr.g;
                b = clr.b;
            }
            if (r > 1 || g > 1 || b > 1) {
                r /= 255;
                g /= 255;
                b /= 255;
            }
            return [r, g, b];
        },
            packageRGB = function packageRGB(r, g, b, o) {
            r = math.round(r * 255);
            g = math.round(g * 255);
            b = math.round(b * 255);
            var rgb = {
                r: r,
                g: g,
                b: b,
                opacity: is(o, "finite") ? o : 1,
                hex: Snap.rgb(r, g, b),
                toString: rgbtoString
            };
            is(o, "finite") && (rgb.opacity = o);
            return rgb;
        };
        /*\
         * Snap.color
         [ method ]
         **
         * Parses the color string and returns an object featuring the color's component values
         - clr (string) color string in one of the supported formats (see @Snap.getRGB)
         = (object) Combined RGB/HSB object in the following format:
         o {
         o     r (number) red,
         o     g (number) green,
         o     b (number) blue,
         o     hex (string) color in HTML/CSS format: #••••••,
         o     error (boolean) `true` if string can't be parsed,
         o     h (number) hue,
         o     s (number) saturation,
         o     v (number) value (brightness),
         o     l (number) lightness
         o }
        \*/
        Snap.color = function (clr) {
            var rgb;
            if (is(clr, "object") && "h" in clr && "s" in clr && "b" in clr) {
                rgb = Snap.hsb2rgb(clr);
                clr.r = rgb.r;
                clr.g = rgb.g;
                clr.b = rgb.b;
                clr.opacity = 1;
                clr.hex = rgb.hex;
            } else if (is(clr, "object") && "h" in clr && "s" in clr && "l" in clr) {
                rgb = Snap.hsl2rgb(clr);
                clr.r = rgb.r;
                clr.g = rgb.g;
                clr.b = rgb.b;
                clr.opacity = 1;
                clr.hex = rgb.hex;
            } else {
                if (is(clr, "string")) {
                    clr = Snap.getRGB(clr);
                }
                if (is(clr, "object") && "r" in clr && "g" in clr && "b" in clr && !("error" in clr)) {
                    rgb = Snap.rgb2hsl(clr);
                    clr.h = rgb.h;
                    clr.s = rgb.s;
                    clr.l = rgb.l;
                    rgb = Snap.rgb2hsb(clr);
                    clr.v = rgb.b;
                } else {
                    clr = { hex: "none" };
                    clr.r = clr.g = clr.b = clr.h = clr.s = clr.v = clr.l = -1;
                    clr.error = 1;
                }
            }
            clr.toString = rgbtoString;
            return clr;
        };
        /*\
         * Snap.hsb2rgb
         [ method ]
         **
         * Converts HSB values to an RGB object
         - h (number) hue
         - s (number) saturation
         - v (number) value or brightness
         = (object) RGB object in the following format:
         o {
         o     r (number) red,
         o     g (number) green,
         o     b (number) blue,
         o     hex (string) color in HTML/CSS format: #••••••
         o }
        \*/
        Snap.hsb2rgb = function (h, s, v, o) {
            if (is(h, "object") && "h" in h && "s" in h && "b" in h) {
                v = h.b;
                s = h.s;
                o = h.o;
                h = h.h;
            }
            h *= 360;
            var R, G, B, X, C;
            h = h % 360 / 60;
            C = v * s;
            X = C * (1 - abs(h % 2 - 1));
            R = G = B = v - C;
            h = ~~h;
            R += [C, X, 0, 0, X, C][h];
            G += [X, C, C, X, 0, 0][h];
            B += [0, 0, X, C, C, X][h];
            return packageRGB(R, G, B, o);
        };
        /*\
         * Snap.hsl2rgb
         [ method ]
         **
         * Converts HSL values to an RGB object
         - h (number) hue
         - s (number) saturation
         - l (number) luminosity
         = (object) RGB object in the following format:
         o {
         o     r (number) red,
         o     g (number) green,
         o     b (number) blue,
         o     hex (string) color in HTML/CSS format: #••••••
         o }
        \*/
        Snap.hsl2rgb = function (h, s, l, o) {
            if (is(h, "object") && "h" in h && "s" in h && "l" in h) {
                l = h.l;
                s = h.s;
                h = h.h;
            }
            if (h > 1 || s > 1 || l > 1) {
                h /= 360;
                s /= 100;
                l /= 100;
            }
            h *= 360;
            var R, G, B, X, C;
            h = h % 360 / 60;
            C = 2 * s * (l < .5 ? l : 1 - l);
            X = C * (1 - abs(h % 2 - 1));
            R = G = B = l - C / 2;
            h = ~~h;
            R += [C, X, 0, 0, X, C][h];
            G += [X, C, C, X, 0, 0][h];
            B += [0, 0, X, C, C, X][h];
            return packageRGB(R, G, B, o);
        };
        /*\
         * Snap.rgb2hsb
         [ method ]
         **
         * Converts RGB values to an HSB object
         - r (number) red
         - g (number) green
         - b (number) blue
         = (object) HSB object in the following format:
         o {
         o     h (number) hue,
         o     s (number) saturation,
         o     b (number) brightness
         o }
        \*/
        Snap.rgb2hsb = function (r, g, b) {
            b = prepareRGB(r, g, b);
            r = b[0];
            g = b[1];
            b = b[2];
            var H, S, V, C;
            V = mmax(r, g, b);
            C = V - mmin(r, g, b);
            H = C == 0 ? null : V == r ? (g - b) / C : V == g ? (b - r) / C + 2 : (r - g) / C + 4;
            H = (H + 360) % 6 * 60 / 360;
            S = C == 0 ? 0 : C / V;
            return { h: H, s: S, b: V, toString: hsbtoString };
        };
        /*\
         * Snap.rgb2hsl
         [ method ]
         **
         * Converts RGB values to an HSL object
         - r (number) red
         - g (number) green
         - b (number) blue
         = (object) HSL object in the following format:
         o {
         o     h (number) hue,
         o     s (number) saturation,
         o     l (number) luminosity
         o }
        \*/
        Snap.rgb2hsl = function (r, g, b) {
            b = prepareRGB(r, g, b);
            r = b[0];
            g = b[1];
            b = b[2];
            var H, S, L, M, m, C;
            M = mmax(r, g, b);
            m = mmin(r, g, b);
            C = M - m;
            H = C == 0 ? null : M == r ? (g - b) / C : M == g ? (b - r) / C + 2 : (r - g) / C + 4;
            H = (H + 360) % 6 * 60 / 360;
            L = (M + m) / 2;
            S = C == 0 ? 0 : L < .5 ? C / (2 * L) : C / (2 - 2 * L);
            return { h: H, s: S, l: L, toString: hsltoString };
        };
        // Transformations
        /*\
         * Snap.parsePathString
         [ method ]
         **
         * Utility method
         **
         * Parses given path string into an array of arrays of path segments
         - pathString (string|array) path string or array of segments (in the last case it is returned straight away)
         = (array) array of segments
        \*/
        Snap.parsePathString = function (pathString) {
            if (!pathString) {
                return null;
            }
            var pth = Snap.path(pathString);
            if (pth.arr) {
                return Snap.path.clone(pth.arr);
            }
            var paramCounts = { a: 7, c: 6, o: 2, h: 1, l: 2, m: 2, r: 4, q: 4, s: 4, t: 2, v: 1, u: 3, z: 0 },
                data = [];
            if (is(pathString, "array") && is(pathString[0], "array")) {
                // rough assumption
                data = Snap.path.clone(pathString);
            }
            if (!data.length) {
                Str(pathString).replace(pathCommand, function (a, b, c) {
                    var params = [],
                        name = b.toLowerCase();
                    c.replace(pathValues, function (a, b) {
                        b && params.push(+b);
                    });
                    if (name == "m" && params.length > 2) {
                        data.push([b].concat(params.splice(0, 2)));
                        name = "l";
                        b = b == "m" ? "l" : "L";
                    }
                    if (name == "o" && params.length == 1) {
                        data.push([b, params[0]]);
                    }
                    if (name == "r") {
                        data.push([b].concat(params));
                    } else while (params.length >= paramCounts[name]) {
                        data.push([b].concat(params.splice(0, paramCounts[name])));
                        if (!paramCounts[name]) {
                            break;
                        }
                    }
                });
            }
            data.toString = Snap.path.toString;
            pth.arr = Snap.path.clone(data);
            return data;
        };
        /*\
         * Snap.parseTransformString
         [ method ]
         **
         * Utility method
         **
         * Parses given transform string into an array of transformations
         - TString (string|array) transform string or array of transformations (in the last case it is returned straight away)
         = (array) array of transformations
        \*/
        var parseTransformString = Snap.parseTransformString = function (TString) {
            if (!TString) {
                return null;
            }
            var paramCounts = { r: 3, s: 4, t: 2, m: 6 },
                data = [];
            if (is(TString, "array") && is(TString[0], "array")) {
                // rough assumption
                data = Snap.path.clone(TString);
            }
            if (!data.length) {
                Str(TString).replace(tCommand, function (a, b, c) {
                    var params = [],
                        name = b.toLowerCase();
                    c.replace(pathValues, function (a, b) {
                        b && params.push(+b);
                    });
                    data.push([b].concat(params));
                });
            }
            data.toString = Snap.path.toString;
            return data;
        };
        function svgTransform2string(tstr) {
            var res = [];
            tstr = tstr.replace(/(?:^|\s)(\w+)\(([^)]+)\)/g, function (all, name, params) {
                params = params.split(/\s*,\s*|\s+/);
                if (name == "rotate" && params.length == 1) {
                    params.push(0, 0);
                }
                if (name == "scale") {
                    if (params.length > 2) {
                        params = params.slice(0, 2);
                    } else if (params.length == 2) {
                        params.push(0, 0);
                    }
                    if (params.length == 1) {
                        params.push(params[0], 0, 0);
                    }
                }
                if (name == "skewX") {
                    res.push(["m", 1, 0, math.tan(rad(params[0])), 1, 0, 0]);
                } else if (name == "skewY") {
                    res.push(["m", 1, math.tan(rad(params[0])), 0, 1, 0, 0]);
                } else {
                    res.push([name.charAt(0)].concat(params));
                }
                return all;
            });
            return res;
        }
        Snap._.svgTransform2string = svgTransform2string;
        Snap._.rgTransform = /^[a-z][\s]*-?\.?\d/i;
        function transform2matrix(tstr, bbox) {
            var tdata = parseTransformString(tstr),
                m = new Snap.Matrix();
            if (tdata) {
                for (var i = 0, ii = tdata.length; i < ii; i++) {
                    var t = tdata[i],
                        tlen = t.length,
                        command = Str(t[0]).toLowerCase(),
                        absolute = t[0] != command,
                        inver = absolute ? m.invert() : 0,
                        x1,
                        y1,
                        x2,
                        y2,
                        bb;
                    if (command == "t" && tlen == 2) {
                        m.translate(t[1], 0);
                    } else if (command == "t" && tlen == 3) {
                        if (absolute) {
                            x1 = inver.x(0, 0);
                            y1 = inver.y(0, 0);
                            x2 = inver.x(t[1], t[2]);
                            y2 = inver.y(t[1], t[2]);
                            m.translate(x2 - x1, y2 - y1);
                        } else {
                            m.translate(t[1], t[2]);
                        }
                    } else if (command == "r") {
                        if (tlen == 2) {
                            bb = bb || bbox;
                            m.rotate(t[1], bb.x + bb.width / 2, bb.y + bb.height / 2);
                        } else if (tlen == 4) {
                            if (absolute) {
                                x2 = inver.x(t[2], t[3]);
                                y2 = inver.y(t[2], t[3]);
                                m.rotate(t[1], x2, y2);
                            } else {
                                m.rotate(t[1], t[2], t[3]);
                            }
                        }
                    } else if (command == "s") {
                        if (tlen == 2 || tlen == 3) {
                            bb = bb || bbox;
                            m.scale(t[1], t[tlen - 1], bb.x + bb.width / 2, bb.y + bb.height / 2);
                        } else if (tlen == 4) {
                            if (absolute) {
                                x2 = inver.x(t[2], t[3]);
                                y2 = inver.y(t[2], t[3]);
                                m.scale(t[1], t[1], x2, y2);
                            } else {
                                m.scale(t[1], t[1], t[2], t[3]);
                            }
                        } else if (tlen == 5) {
                            if (absolute) {
                                x2 = inver.x(t[3], t[4]);
                                y2 = inver.y(t[3], t[4]);
                                m.scale(t[1], t[2], x2, y2);
                            } else {
                                m.scale(t[1], t[2], t[3], t[4]);
                            }
                        }
                    } else if (command == "m" && tlen == 7) {
                        m.add(t[1], t[2], t[3], t[4], t[5], t[6]);
                    }
                }
            }
            return m;
        }
        Snap._.transform2matrix = transform2matrix;
        Snap._unit2px = unit2px;
        var contains = glob.doc.contains || glob.doc.compareDocumentPosition ? function (a, b) {
            var adown = a.nodeType == 9 ? a.documentElement : a,
                bup = b && b.parentNode;
            return a == bup || !!(bup && bup.nodeType == 1 && (adown.contains ? adown.contains(bup) : a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16));
        } : function (a, b) {
            if (b) {
                while (b) {
                    b = b.parentNode;
                    if (b == a) {
                        return true;
                    }
                }
            }
            return false;
        };
        function getSomeDefs(el) {
            var p = el.node.ownerSVGElement && wrap(el.node.ownerSVGElement) || el.node.parentNode && wrap(el.node.parentNode) || Snap.select("svg") || Snap(0, 0),
                pdefs = p.select("defs"),
                defs = pdefs == null ? false : pdefs.node;
            if (!defs) {
                defs = make("defs", p.node).node;
            }
            return defs;
        }
        function getSomeSVG(el) {
            return el.node.ownerSVGElement && wrap(el.node.ownerSVGElement) || Snap.select("svg");
        }
        Snap._.getSomeDefs = getSomeDefs;
        Snap._.getSomeSVG = getSomeSVG;
        function unit2px(el, name, value) {
            var svg = getSomeSVG(el).node,
                out = {},
                mgr = svg.querySelector(".svg---mgr");
            if (!mgr) {
                mgr = $("rect");
                $(mgr, { x: -9e9, y: -9e9, width: 10, height: 10, "class": "svg---mgr", fill: "none" });
                svg.appendChild(mgr);
            }
            function getW(val) {
                if (val == null) {
                    return E;
                }
                if (val == +val) {
                    return val;
                }
                $(mgr, { width: val });
                try {
                    return mgr.getBBox().width;
                } catch (e) {
                    return 0;
                }
            }
            function getH(val) {
                if (val == null) {
                    return E;
                }
                if (val == +val) {
                    return val;
                }
                $(mgr, { height: val });
                try {
                    return mgr.getBBox().height;
                } catch (e) {
                    return 0;
                }
            }
            function set(nam, f) {
                if (name == null) {
                    out[nam] = f(el.attr(nam) || 0);
                } else if (nam == name) {
                    out = f(value == null ? el.attr(nam) || 0 : value);
                }
            }
            switch (el.type) {
                case "rect":
                    set("rx", getW);
                    set("ry", getH);
                case "image":
                    set("width", getW);
                    set("height", getH);
                case "text":
                    set("x", getW);
                    set("y", getH);
                    break;
                case "circle":
                    set("cx", getW);
                    set("cy", getH);
                    set("r", getW);
                    break;
                case "ellipse":
                    set("cx", getW);
                    set("cy", getH);
                    set("rx", getW);
                    set("ry", getH);
                    break;
                case "line":
                    set("x1", getW);
                    set("x2", getW);
                    set("y1", getH);
                    set("y2", getH);
                    break;
                case "marker":
                    set("refX", getW);
                    set("markerWidth", getW);
                    set("refY", getH);
                    set("markerHeight", getH);
                    break;
                case "radialGradient":
                    set("fx", getW);
                    set("fy", getH);
                    break;
                case "tspan":
                    set("dx", getW);
                    set("dy", getH);
                    break;
                default:
                    set(name, getW);
            }
            svg.removeChild(mgr);
            return out;
        }
        /*\
         * Snap.select
         [ method ]
         **
         * Wraps a DOM element specified by CSS selector as @Element
         - query (string) CSS selector of the element
         = (Element) the current element
        \*/
        Snap.select = function (query) {
            query = Str(query).replace(/([^\\]):/g, "$1\\:");
            return wrap(glob.doc.querySelector(query));
        };
        /*\
         * Snap.selectAll
         [ method ]
         **
         * Wraps DOM elements specified by CSS selector as set or array of @Element
         - query (string) CSS selector of the element
         = (Element) the current element
        \*/
        Snap.selectAll = function (query) {
            var nodelist = glob.doc.querySelectorAll(query),
                set = (Snap.set || Array)();
            for (var i = 0; i < nodelist.length; i++) {
                set.push(wrap(nodelist[i]));
            }
            return set;
        };
        function add2group(list) {
            if (!is(list, "array")) {
                list = Array.prototype.slice.call(arguments, 0);
            }
            var i = 0,
                j = 0,
                node = this.node;
            while (this[i]) {
                delete this[i++];
            }for (i = 0; i < list.length; i++) {
                if (list[i].type == "set") {
                    list[i].forEach(function (el) {
                        node.appendChild(el.node);
                    });
                } else {
                    node.appendChild(list[i].node);
                }
            }
            var children = node.childNodes;
            for (i = 0; i < children.length; i++) {
                this[j++] = wrap(children[i]);
            }
            return this;
        }
        // Hub garbage collector every 10s
        setInterval(function () {
            for (var key in hub) {
                if (hub[has](key)) {
                    var el = hub[key],
                        node = el.node;
                    if (el.type != "svg" && !node.ownerSVGElement || el.type == "svg" && (!node.parentNode || "ownerSVGElement" in node.parentNode && !node.ownerSVGElement)) {
                        delete hub[key];
                    }
                }
            }
        }, 1e4);
        function Element(el) {
            if (el.snap in hub) {
                return hub[el.snap];
            }
            var svg;
            try {
                svg = el.ownerSVGElement;
            } catch (e) {}
            /*\
             * Element.node
             [ property (object) ]
             **
             * Gives you a reference to the DOM object, so you can assign event handlers or just mess around.
             > Usage
             | // draw a circle at coordinate 10,10 with radius of 10
             | var c = paper.circle(10, 10, 10);
             | c.node.onclick = function () {
             |     c.attr("fill", "red");
             | };
            \*/
            this.node = el;
            if (svg) {
                this.paper = new Paper(svg);
            }
            /*\
             * Element.type
             [ property (string) ]
             **
             * SVG tag name of the given element.
            \*/
            this.type = el.tagName || el.nodeName;
            var id = this.id = ID(this);
            this.anims = {};
            this._ = {
                transform: []
            };
            el.snap = id;
            hub[id] = this;
            if (this.type == "g") {
                this.add = add2group;
            }
            if (this.type in { g: 1, mask: 1, pattern: 1, symbol: 1 }) {
                for (var method in Paper.prototype) {
                    if (Paper.prototype[has](method)) {
                        this[method] = Paper.prototype[method];
                    }
                }
            }
        }
        /*\
          * Element.attr
          [ method ]
          **
          * Gets or sets given attributes of the element.
          **
          - params (object) contains key-value pairs of attributes you want to set
          * or
          - param (string) name of the attribute
          = (Element) the current element
          * or
          = (string) value of attribute
          > Usage
          | el.attr({
          |     fill: "#fc0",
          |     stroke: "#000",
          |     strokeWidth: 2, // CamelCase...
          |     "fill-opacity": 0.5, // or dash-separated names
          |     width: "*=2" // prefixed values
          | });
          | console.log(el.attr("fill")); // #fc0
          * Prefixed values in format `"+=10"` supported. All four operations
          * (`+`, `-`, `*` and `/`) could be used. Optionally you can use units for `+`
          * and `-`: `"+=2em"`.
         \*/
        Element.prototype.attr = function (params, value) {
            var el = this,
                node = el.node;
            if (!params) {
                if (node.nodeType != 1) {
                    return {
                        text: node.nodeValue
                    };
                }
                var attr = node.attributes,
                    out = {};
                for (var i = 0, ii = attr.length; i < ii; i++) {
                    out[attr[i].nodeName] = attr[i].nodeValue;
                }
                return out;
            }
            if (is(params, "string")) {
                if (arguments.length > 1) {
                    var json = {};
                    json[params] = value;
                    params = json;
                } else {
                    return eve("snap.util.getattr." + params, el).firstDefined();
                }
            }
            for (var att in params) {
                if (params[has](att)) {
                    eve("snap.util.attr." + att, el, params[att]);
                }
            }
            return el;
        };
        /*\
         * Snap.parse
         [ method ]
         **
         * Parses SVG fragment and converts it into a @Fragment
         **
         - svg (string) SVG string
         = (Fragment) the @Fragment
        \*/
        Snap.parse = function (svg) {
            var f = glob.doc.createDocumentFragment(),
                full = true,
                div = glob.doc.createElement("div");
            svg = Str(svg);
            if (!svg.match(/^\s*<\s*svg(?:\s|>)/)) {
                svg = "<svg>" + svg + "</svg>";
                full = false;
            }
            div.innerHTML = svg;
            svg = div.getElementsByTagName("svg")[0];
            if (svg) {
                if (full) {
                    f = svg;
                } else {
                    while (svg.firstChild) {
                        f.appendChild(svg.firstChild);
                    }
                }
            }
            return new Fragment(f);
        };
        function Fragment(frag) {
            this.node = frag;
        }
        /*\
         * Snap.fragment
         [ method ]
         **
         * Creates a DOM fragment from a given list of elements or strings
         **
         - varargs (…) SVG string
         = (Fragment) the @Fragment
        \*/
        Snap.fragment = function () {
            var args = Array.prototype.slice.call(arguments, 0),
                f = glob.doc.createDocumentFragment();
            for (var i = 0, ii = args.length; i < ii; i++) {
                var item = args[i];
                if (item.node && item.node.nodeType) {
                    f.appendChild(item.node);
                }
                if (item.nodeType) {
                    f.appendChild(item);
                }
                if (typeof item == "string") {
                    f.appendChild(Snap.parse(item).node);
                }
            }
            return new Fragment(f);
        };
        function make(name, parent) {
            var res = $(name);
            parent.appendChild(res);
            var el = wrap(res);
            return el;
        }
        function Paper(w, h) {
            var res,
                desc,
                defs,
                proto = Paper.prototype;
            if (w && w.tagName == "svg") {
                if (w.snap in hub) {
                    return hub[w.snap];
                }
                var doc = w.ownerDocument;
                res = new Element(w);
                desc = w.getElementsByTagName("desc")[0];
                defs = w.getElementsByTagName("defs")[0];
                if (!desc) {
                    desc = $("desc");
                    desc.appendChild(doc.createTextNode("Created with Snap"));
                    res.node.appendChild(desc);
                }
                if (!defs) {
                    defs = $("defs");
                    res.node.appendChild(defs);
                }
                res.defs = defs;
                for (var key in proto) {
                    if (proto[has](key)) {
                        res[key] = proto[key];
                    }
                }res.paper = res.root = res;
            } else {
                res = make("svg", glob.doc.body);
                $(res.node, {
                    height: h,
                    version: 1.1,
                    width: w,
                    xmlns: xmlns
                });
            }
            return res;
        }
        function wrap(dom) {
            if (!dom) {
                return dom;
            }
            if (dom instanceof Element || dom instanceof Fragment) {
                return dom;
            }
            if (dom.tagName && dom.tagName.toLowerCase() == "svg") {
                return new Paper(dom);
            }
            if (dom.tagName && dom.tagName.toLowerCase() == "object" && dom.type == "image/svg+xml") {
                return new Paper(dom.contentDocument.getElementsByTagName("svg")[0]);
            }
            return new Element(dom);
        }
        Snap._.make = make;
        Snap._.wrap = wrap;
        /*\
         * Paper.el
         [ method ]
         **
         * Creates an element on paper with a given name and no attributes
         **
         - name (string) tag name
         - attr (object) attributes
         = (Element) the current element
         > Usage
         | var c = paper.circle(10, 10, 10); // is the same as...
         | var c = paper.el("circle").attr({
         |     cx: 10,
         |     cy: 10,
         |     r: 10
         | });
         | // and the same as
         | var c = paper.el("circle", {
         |     cx: 10,
         |     cy: 10,
         |     r: 10
         | });
        \*/
        Paper.prototype.el = function (name, attr) {
            var el = make(name, this.node);
            attr && el.attr(attr);
            return el;
        };
        /*\
         * Element.children
         [ method ]
         **
         * Returns array of all the children of the element.
         = (array) array of Elements
        \*/
        Element.prototype.children = function () {
            var out = [],
                ch = this.node.childNodes;
            for (var i = 0, ii = ch.length; i < ii; i++) {
                out[i] = Snap(ch[i]);
            }
            return out;
        };
        function jsonFiller(root, o) {
            for (var i = 0, ii = root.length; i < ii; i++) {
                var item = {
                    type: root[i].type,
                    attr: root[i].attr()
                },
                    children = root[i].children();
                o.push(item);
                if (children.length) {
                    jsonFiller(children, item.childNodes = []);
                }
            }
        }
        /*\
         * Element.toJSON
         [ method ]
         **
         * Returns object representation of the given element and all its children.
         = (object) in format
         o {
         o     type (string) this.type,
         o     attr (object) attributes map,
         o     childNodes (array) optional array of children in the same format
         o }
        \*/
        Element.prototype.toJSON = function () {
            var out = [];
            jsonFiller([this], out);
            return out[0];
        };
        // default
        eve.on("snap.util.getattr", function () {
            var att = eve.nt();
            att = att.substring(att.lastIndexOf(".") + 1);
            var css = att.replace(/[A-Z]/g, function (letter) {
                return "-" + letter.toLowerCase();
            });
            if (cssAttr[has](css)) {
                return this.node.ownerDocument.defaultView.getComputedStyle(this.node, null).getPropertyValue(css);
            } else {
                return $(this.node, att);
            }
        });
        var cssAttr = {
            "alignment-baseline": 0,
            "baseline-shift": 0,
            "clip": 0,
            "clip-path": 0,
            "clip-rule": 0,
            "color": 0,
            "color-interpolation": 0,
            "color-interpolation-filters": 0,
            "color-profile": 0,
            "color-rendering": 0,
            "cursor": 0,
            "direction": 0,
            "display": 0,
            "dominant-baseline": 0,
            "enable-background": 0,
            "fill": 0,
            "fill-opacity": 0,
            "fill-rule": 0,
            "filter": 0,
            "flood-color": 0,
            "flood-opacity": 0,
            "font": 0,
            "font-family": 0,
            "font-size": 0,
            "font-size-adjust": 0,
            "font-stretch": 0,
            "font-style": 0,
            "font-variant": 0,
            "font-weight": 0,
            "glyph-orientation-horizontal": 0,
            "glyph-orientation-vertical": 0,
            "image-rendering": 0,
            "kerning": 0,
            "letter-spacing": 0,
            "lighting-color": 0,
            "marker": 0,
            "marker-end": 0,
            "marker-mid": 0,
            "marker-start": 0,
            "mask": 0,
            "opacity": 0,
            "overflow": 0,
            "pointer-events": 0,
            "shape-rendering": 0,
            "stop-color": 0,
            "stop-opacity": 0,
            "stroke": 0,
            "stroke-dasharray": 0,
            "stroke-dashoffset": 0,
            "stroke-linecap": 0,
            "stroke-linejoin": 0,
            "stroke-miterlimit": 0,
            "stroke-opacity": 0,
            "stroke-width": 0,
            "text-anchor": 0,
            "text-decoration": 0,
            "text-rendering": 0,
            "unicode-bidi": 0,
            "visibility": 0,
            "word-spacing": 0,
            "writing-mode": 0
        };
        eve.on("snap.util.attr", function (value) {
            var att = eve.nt(),
                attr = {};
            att = att.substring(att.lastIndexOf(".") + 1);
            attr[att] = value;
            var style = att.replace(/-(\w)/gi, function (all, letter) {
                return letter.toUpperCase();
            }),
                css = att.replace(/[A-Z]/g, function (letter) {
                return "-" + letter.toLowerCase();
            });
            if (cssAttr[has](css)) {
                this.node.style[style] = value == null ? E : value;
            } else {
                $(this.node, attr);
            }
        });
        (function (proto) {})(Paper.prototype);
        // simple ajax
        /*\
         * Snap.ajax
         [ method ]
         **
         * Simple implementation of Ajax
         **
         - url (string) URL
         - postData (object|string) data for post request
         - callback (function) callback
         - scope (object) #optional scope of callback
         * or
         - url (string) URL
         - callback (function) callback
         - scope (object) #optional scope of callback
         = (XMLHttpRequest) the XMLHttpRequest object, just in case
        \*/
        Snap.ajax = function (url, postData, callback, scope) {
            var req = new XMLHttpRequest(),
                id = ID();
            if (req) {
                if (is(postData, "function")) {
                    scope = callback;
                    callback = postData;
                    postData = null;
                } else if (is(postData, "object")) {
                    var pd = [];
                    for (var key in postData) {
                        if (postData.hasOwnProperty(key)) {
                            pd.push(encodeURIComponent(key) + "=" + encodeURIComponent(postData[key]));
                        }
                    }postData = pd.join("&");
                }
                req.open(postData ? "POST" : "GET", url, true);
                if (postData) {
                    req.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                }
                if (callback) {
                    eve.once("snap.ajax." + id + ".0", callback);
                    eve.once("snap.ajax." + id + ".200", callback);
                    eve.once("snap.ajax." + id + ".304", callback);
                }
                req.onreadystatechange = function () {
                    if (req.readyState != 4) return;
                    eve("snap.ajax." + id + "." + req.status, scope, req);
                };
                if (req.readyState == 4) {
                    return req;
                }
                req.send(postData);
                return req;
            }
        };
        /*\
         * Snap.load
         [ method ]
         **
         * Loads external SVG file as a @Fragment (see @Snap.ajax for more advanced AJAX)
         **
         - url (string) URL
         - callback (function) callback
         - scope (object) #optional scope of callback
        \*/
        Snap.load = function (url, callback, scope) {
            Snap.ajax(url, function (req) {
                var f = Snap.parse(req.responseText);
                scope ? callback.call(scope, f) : callback(f);
            });
        };
        var getOffset = function getOffset(elem) {
            var box = elem.getBoundingClientRect(),
                doc = elem.ownerDocument,
                body = doc.body,
                docElem = doc.documentElement,
                clientTop = docElem.clientTop || body.clientTop || 0,
                clientLeft = docElem.clientLeft || body.clientLeft || 0,
                top = box.top + (g.win.pageYOffset || docElem.scrollTop || body.scrollTop) - clientTop,
                left = box.left + (g.win.pageXOffset || docElem.scrollLeft || body.scrollLeft) - clientLeft;
            return {
                y: top,
                x: left
            };
        };
        /*\
         * Snap.getElementByPoint
         [ method ]
         **
         * Returns you topmost element under given point.
         **
         = (object) Snap element object
         - x (number) x coordinate from the top left corner of the window
         - y (number) y coordinate from the top left corner of the window
         > Usage
         | Snap.getElementByPoint(mouseX, mouseY).attr({stroke: "#f00"});
        \*/
        Snap.getElementByPoint = function (x, y) {
            var paper = this,
                svg = paper.canvas,
                target = glob.doc.elementFromPoint(x, y);
            if (glob.win.opera && target.tagName == "svg") {
                var so = getOffset(target),
                    sr = target.createSVGRect();
                sr.x = x - so.x;
                sr.y = y - so.y;
                sr.width = sr.height = 1;
                var hits = target.getIntersectionList(sr, null);
                if (hits.length) {
                    target = hits[hits.length - 1];
                }
            }
            if (!target) {
                return null;
            }
            return wrap(target);
        };
        /*\
         * Snap.plugin
         [ method ]
         **
         * Let you write plugins. You pass in a function with five arguments, like this:
         | Snap.plugin(function (Snap, Element, Paper, global, Fragment) {
         |     Snap.newmethod = function () {};
         |     Element.prototype.newmethod = function () {};
         |     Paper.prototype.newmethod = function () {};
         | });
         * Inside the function you have access to all main objects (and their
         * prototypes). This allow you to extend anything you want.
         **
         - f (function) your plugin body
        \*/
        Snap.plugin = function (f) {
            f(Snap, Element, Paper, glob, Fragment);
        };
        glob.win.Snap = Snap;
        return Snap;
    }(window || this);
    // Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
    //
    // Licensed under the Apache License, Version 2.0 (the "License");
    // you may not use this file except in compliance with the License.
    // You may obtain a copy of the License at
    //
    // http://www.apache.org/licenses/LICENSE-2.0
    //
    // Unless required by applicable law or agreed to in writing, software
    // distributed under the License is distributed on an "AS IS" BASIS,
    // WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    // See the License for the specific language governing permissions and
    // limitations under the License.
    Snap.plugin(function (Snap, Element, Paper, glob, Fragment) {
        var elproto = Element.prototype,
            is = Snap.is,
            Str = String,
            unit2px = Snap._unit2px,
            $ = Snap._.$,
            make = Snap._.make,
            getSomeDefs = Snap._.getSomeDefs,
            has = "hasOwnProperty",
            wrap = Snap._.wrap;
        /*\
         * Element.getBBox
         [ method ]
         **
         * Returns the bounding box descriptor for the given element
         **
         = (object) bounding box descriptor:
         o {
         o     cx: (number) x of the center,
         o     cy: (number) x of the center,
         o     h: (number) height,
         o     height: (number) height,
         o     path: (string) path command for the box,
         o     r0: (number) radius of a circle that fully encloses the box,
         o     r1: (number) radius of the smallest circle that can be enclosed,
         o     r2: (number) radius of the largest circle that can be enclosed,
         o     vb: (string) box as a viewbox command,
         o     w: (number) width,
         o     width: (number) width,
         o     x2: (number) x of the right side,
         o     x: (number) x of the left side,
         o     y2: (number) y of the bottom edge,
         o     y: (number) y of the top edge
         o }
        \*/
        elproto.getBBox = function (isWithoutTransform) {
            if (!Snap.Matrix || !Snap.path) {
                return this.node.getBBox();
            }
            var el = this,
                m = new Snap.Matrix();
            if (el.removed) {
                return Snap._.box();
            }
            while (el.type == "use") {
                if (!isWithoutTransform) {
                    m = m.add(el.transform().localMatrix.translate(el.attr("x") || 0, el.attr("y") || 0));
                }
                if (el.original) {
                    el = el.original;
                } else {
                    var href = el.attr("xlink:href");
                    el = el.original = el.node.ownerDocument.getElementById(href.substring(href.indexOf("#") + 1));
                }
            }
            var _ = el._,
                pathfinder = Snap.path.get[el.type] || Snap.path.get.deflt;
            try {
                if (isWithoutTransform) {
                    _.bboxwt = pathfinder ? Snap.path.getBBox(el.realPath = pathfinder(el)) : Snap._.box(el.node.getBBox());
                    return Snap._.box(_.bboxwt);
                } else {
                    el.realPath = pathfinder(el);
                    el.matrix = el.transform().localMatrix;
                    _.bbox = Snap.path.getBBox(Snap.path.map(el.realPath, m.add(el.matrix)));
                    return Snap._.box(_.bbox);
                }
            } catch (e) {
                // Firefox doesn’t give you bbox of hidden element
                return Snap._.box();
            }
        };
        var propString = function propString() {
            return this.string;
        };
        function extractTransform(el, tstr) {
            if (tstr == null) {
                var doReturn = true;
                if (el.type == "linearGradient" || el.type == "radialGradient") {
                    tstr = el.node.getAttribute("gradientTransform");
                } else if (el.type == "pattern") {
                    tstr = el.node.getAttribute("patternTransform");
                } else {
                    tstr = el.node.getAttribute("transform");
                }
                if (!tstr) {
                    return new Snap.Matrix();
                }
                tstr = Snap._.svgTransform2string(tstr);
            } else {
                if (!Snap._.rgTransform.test(tstr)) {
                    tstr = Snap._.svgTransform2string(tstr);
                } else {
                    tstr = Str(tstr).replace(/\.{3}|\u2026/g, el._.transform || "");
                }
                if (is(tstr, "array")) {
                    tstr = Snap.path ? Snap.path.toString.call(tstr) : Str(tstr);
                }
                el._.transform = tstr;
            }
            var m = Snap._.transform2matrix(tstr, el.getBBox(1));
            if (doReturn) {
                return m;
            } else {
                el.matrix = m;
            }
        }
        /*\
         * Element.transform
         [ method ]
         **
         * Gets or sets transformation of the element
         **
         - tstr (string) transform string in Snap or SVG format
         = (Element) the current element
         * or
         = (object) transformation descriptor:
         o {
         o     string (string) transform string,
         o     globalMatrix (Matrix) matrix of all transformations applied to element or its parents,
         o     localMatrix (Matrix) matrix of transformations applied only to the element,
         o     diffMatrix (Matrix) matrix of difference between global and local transformations,
         o     global (string) global transformation as string,
         o     local (string) local transformation as string,
         o     toString (function) returns `string` property
         o }
        \*/
        elproto.transform = function (tstr) {
            var _ = this._;
            if (tstr == null) {
                var papa = this,
                    global = new Snap.Matrix(this.node.getCTM()),
                    local = extractTransform(this),
                    ms = [local],
                    m = new Snap.Matrix(),
                    i,
                    localString = local.toTransformString(),
                    string = Str(local) == Str(this.matrix) ? Str(_.transform) : localString;
                while (papa.type != "svg" && (papa = papa.parent())) {
                    ms.push(extractTransform(papa));
                }
                i = ms.length;
                while (i--) {
                    m.add(ms[i]);
                }
                return {
                    string: string,
                    globalMatrix: global,
                    totalMatrix: m,
                    localMatrix: local,
                    diffMatrix: global.clone().add(local.invert()),
                    global: global.toTransformString(),
                    total: m.toTransformString(),
                    local: localString,
                    toString: propString
                };
            }
            if (tstr instanceof Snap.Matrix) {
                this.matrix = tstr;
                this._.transform = tstr.toTransformString();
            } else {
                extractTransform(this, tstr);
            }
            if (this.node) {
                if (this.type == "linearGradient" || this.type == "radialGradient") {
                    $(this.node, { gradientTransform: this.matrix });
                } else if (this.type == "pattern") {
                    $(this.node, { patternTransform: this.matrix });
                } else {
                    $(this.node, { transform: this.matrix });
                }
            }
            return this;
        };
        /*\
         * Element.parent
         [ method ]
         **
         * Returns the element's parent
         **
         = (Element) the parent element
        \*/
        elproto.parent = function () {
            return wrap(this.node.parentNode);
        };
        /*\
         * Element.append
         [ method ]
         **
         * Appends the given element to current one
         **
         - el (Element|Set) element to append
         = (Element) the parent element
        \*/
        /*\
         * Element.add
         [ method ]
         **
         * See @Element.append
        \*/
        elproto.append = elproto.add = function (el) {
            if (el) {
                if (el.type == "set") {
                    var it = this;
                    el.forEach(function (el) {
                        it.add(el);
                    });
                    return this;
                }
                el = wrap(el);
                this.node.appendChild(el.node);
                el.paper = this.paper;
            }
            return this;
        };
        /*\
         * Element.appendTo
         [ method ]
         **
         * Appends the current element to the given one
         **
         - el (Element) parent element to append to
         = (Element) the child element
        \*/
        elproto.appendTo = function (el) {
            if (el) {
                el = wrap(el);
                el.append(this);
            }
            return this;
        };
        /*\
         * Element.prepend
         [ method ]
         **
         * Prepends the given element to the current one
         **
         - el (Element) element to prepend
         = (Element) the parent element
        \*/
        elproto.prepend = function (el) {
            if (el) {
                if (el.type == "set") {
                    var it = this,
                        first;
                    el.forEach(function (el) {
                        if (first) {
                            first.after(el);
                        } else {
                            it.prepend(el);
                        }
                        first = el;
                    });
                    return this;
                }
                el = wrap(el);
                var parent = el.parent();
                this.node.insertBefore(el.node, this.node.firstChild);
                this.add && this.add();
                el.paper = this.paper;
                this.parent() && this.parent().add();
                parent && parent.add();
            }
            return this;
        };
        /*\
         * Element.prependTo
         [ method ]
         **
         * Prepends the current element to the given one
         **
         - el (Element) parent element to prepend to
         = (Element) the child element
        \*/
        elproto.prependTo = function (el) {
            el = wrap(el);
            el.prepend(this);
            return this;
        };
        /*\
         * Element.before
         [ method ]
         **
         * Inserts given element before the current one
         **
         - el (Element) element to insert
         = (Element) the parent element
        \*/
        elproto.before = function (el) {
            if (el.type == "set") {
                var it = this;
                el.forEach(function (el) {
                    var parent = el.parent();
                    it.node.parentNode.insertBefore(el.node, it.node);
                    parent && parent.add();
                });
                this.parent().add();
                return this;
            }
            el = wrap(el);
            var parent = el.parent();
            this.node.parentNode.insertBefore(el.node, this.node);
            this.parent() && this.parent().add();
            parent && parent.add();
            el.paper = this.paper;
            return this;
        };
        /*\
         * Element.after
         [ method ]
         **
         * Inserts given element after the current one
         **
         - el (Element) element to insert
         = (Element) the parent element
        \*/
        elproto.after = function (el) {
            el = wrap(el);
            var parent = el.parent();
            if (this.node.nextSibling) {
                this.node.parentNode.insertBefore(el.node, this.node.nextSibling);
            } else {
                this.node.parentNode.appendChild(el.node);
            }
            this.parent() && this.parent().add();
            parent && parent.add();
            el.paper = this.paper;
            return this;
        };
        /*\
         * Element.insertBefore
         [ method ]
         **
         * Inserts the element after the given one
         **
         - el (Element) element next to whom insert to
         = (Element) the parent element
        \*/
        elproto.insertBefore = function (el) {
            el = wrap(el);
            var parent = this.parent();
            el.node.parentNode.insertBefore(this.node, el.node);
            this.paper = el.paper;
            parent && parent.add();
            el.parent() && el.parent().add();
            return this;
        };
        /*\
         * Element.insertAfter
         [ method ]
         **
         * Inserts the element after the given one
         **
         - el (Element) element next to whom insert to
         = (Element) the parent element
        \*/
        elproto.insertAfter = function (el) {
            el = wrap(el);
            var parent = this.parent();
            el.node.parentNode.insertBefore(this.node, el.node.nextSibling);
            this.paper = el.paper;
            parent && parent.add();
            el.parent() && el.parent().add();
            return this;
        };
        /*\
         * Element.remove
         [ method ]
         **
         * Removes element from the DOM
         = (Element) the detached element
        \*/
        elproto.remove = function () {
            var parent = this.parent();
            this.node.parentNode && this.node.parentNode.removeChild(this.node);
            delete this.paper;
            this.removed = true;
            parent && parent.add();
            return this;
        };
        /*\
         * Element.select
         [ method ]
         **
         * Gathers the nested @Element matching the given set of CSS selectors
         **
         - query (string) CSS selector
         = (Element) result of query selection
        \*/
        elproto.select = function (query) {
            return wrap(this.node.querySelector(query));
        };
        /*\
         * Element.selectAll
         [ method ]
         **
         * Gathers nested @Element objects matching the given set of CSS selectors
         **
         - query (string) CSS selector
         = (Set|array) result of query selection
        \*/
        elproto.selectAll = function (query) {
            var nodelist = this.node.querySelectorAll(query),
                set = (Snap.set || Array)();
            for (var i = 0; i < nodelist.length; i++) {
                set.push(wrap(nodelist[i]));
            }
            return set;
        };
        /*\
         * Element.asPX
         [ method ]
         **
         * Returns given attribute of the element as a `px` value (not %, em, etc.)
         **
         - attr (string) attribute name
         - value (string) #optional attribute value
         = (Element) result of query selection
        \*/
        elproto.asPX = function (attr, value) {
            if (value == null) {
                value = this.attr(attr);
            }
            return +unit2px(this, attr, value);
        };
        // SIERRA Element.use(): I suggest adding a note about how to access the original element the returned <use> instantiates. It's a part of SVG with which ordinary web developers may be least familiar.
        /*\
         * Element.use
         [ method ]
         **
         * Creates a `<use>` element linked to the current element
         **
         = (Element) the `<use>` element
        \*/
        elproto.use = function () {
            var use,
                id = this.node.id;
            if (!id) {
                id = this.id;
                $(this.node, {
                    id: id
                });
            }
            if (this.type == "linearGradient" || this.type == "radialGradient" || this.type == "pattern") {
                use = make(this.type, this.node.parentNode);
            } else {
                use = make("use", this.node.parentNode);
            }
            $(use.node, {
                "xlink:href": "#" + id
            });
            use.original = this;
            return use;
        };
        function fixids(el) {
            var els = el.selectAll("*"),
                it,
                url = /^\s*url\(("|'|)(.*)\1\)\s*$/,
                ids = [],
                uses = {};
            function urltest(it, name) {
                var val = $(it.node, name);
                val = val && val.match(url);
                val = val && val[2];
                if (val && val.charAt() == "#") {
                    val = val.substring(1);
                } else {
                    return;
                }
                if (val) {
                    uses[val] = (uses[val] || []).concat(function (id) {
                        var attr = {};
                        attr[name] = URL(id);
                        $(it.node, attr);
                    });
                }
            }
            function linktest(it) {
                var val = $(it.node, "xlink:href");
                if (val && val.charAt() == "#") {
                    val = val.substring(1);
                } else {
                    return;
                }
                if (val) {
                    uses[val] = (uses[val] || []).concat(function (id) {
                        it.attr("xlink:href", "#" + id);
                    });
                }
            }
            for (var i = 0, ii = els.length; i < ii; i++) {
                it = els[i];
                urltest(it, "fill");
                urltest(it, "stroke");
                urltest(it, "filter");
                urltest(it, "mask");
                urltest(it, "clip-path");
                linktest(it);
                var oldid = $(it.node, "id");
                if (oldid) {
                    $(it.node, { id: it.id });
                    ids.push({
                        old: oldid,
                        id: it.id
                    });
                }
            }
            for (i = 0, ii = ids.length; i < ii; i++) {
                var fs = uses[ids[i].old];
                if (fs) {
                    for (var j = 0, jj = fs.length; j < jj; j++) {
                        fs[j](ids[i].id);
                    }
                }
            }
        }
        /*\
         * Element.clone
         [ method ]
         **
         * Creates a clone of the element and inserts it after the element
         **
         = (Element) the clone
        \*/
        elproto.clone = function () {
            var clone = wrap(this.node.cloneNode(true));
            if ($(clone.node, "id")) {
                $(clone.node, { id: clone.id });
            }
            fixids(clone);
            clone.insertAfter(this);
            return clone;
        };
        /*\
         * Element.toDefs
         [ method ]
         **
         * Moves element to the shared `<defs>` area
         **
         = (Element) the element
        \*/
        elproto.toDefs = function () {
            var defs = getSomeDefs(this);
            defs.appendChild(this.node);
            return this;
        };
        /*\
         * Element.toPattern
         [ method ]
         **
         * Creates a `<pattern>` element from the current element
         **
         * To create a pattern you have to specify the pattern rect:
         - x (string|number)
         - y (string|number)
         - width (string|number)
         - height (string|number)
         = (Element) the `<pattern>` element
         * You can use pattern later on as an argument for `fill` attribute:
         | var p = paper.path("M10-5-10,15M15,0,0,15M0-5-20,15").attr({
         |         fill: "none",
         |         stroke: "#bada55",
         |         strokeWidth: 5
         |     }).pattern(0, 0, 10, 10),
         |     c = paper.circle(200, 200, 100);
         | c.attr({
         |     fill: p
         | });
        \*/
        elproto.pattern = elproto.toPattern = function (x, y, width, height) {
            var p = make("pattern", getSomeDefs(this));
            if (x == null) {
                x = this.getBBox();
            }
            if (is(x, "object") && "x" in x) {
                y = x.y;
                width = x.width;
                height = x.height;
                x = x.x;
            }
            $(p.node, {
                x: x,
                y: y,
                width: width,
                height: height,
                patternUnits: "userSpaceOnUse",
                id: p.id,
                viewBox: [x, y, width, height].join(" ")
            });
            p.node.appendChild(this.node);
            return p;
        };
        // SIERRA Element.marker(): clarify what a reference point is. E.g., helps you offset the object from its edge such as when centering it over a path.
        // SIERRA Element.marker(): I suggest the method should accept default reference point values.  Perhaps centered with (refX = width/2) and (refY = height/2)? Also, couldn't it assume the element's current _width_ and _height_? And please specify what _x_ and _y_ mean: offsets? If so, from where?  Couldn't they also be assigned default values?
        /*\
         * Element.marker
         [ method ]
         **
         * Creates a `<marker>` element from the current element
         **
         * To create a marker you have to specify the bounding rect and reference point:
         - x (number)
         - y (number)
         - width (number)
         - height (number)
         - refX (number)
         - refY (number)
         = (Element) the `<marker>` element
         * You can specify the marker later as an argument for `marker-start`, `marker-end`, `marker-mid`, and `marker` attributes. The `marker` attribute places the marker at every point along the path, and `marker-mid` places them at every point except the start and end.
        \*/
        // TODO add usage for markers
        elproto.marker = function (x, y, width, height, refX, refY) {
            var p = make("marker", getSomeDefs(this));
            if (x == null) {
                x = this.getBBox();
            }
            if (is(x, "object") && "x" in x) {
                y = x.y;
                width = x.width;
                height = x.height;
                refX = x.refX || x.cx;
                refY = x.refY || x.cy;
                x = x.x;
            }
            $(p.node, {
                viewBox: [x, y, width, height].join(" "),
                markerWidth: width,
                markerHeight: height,
                orient: "auto",
                refX: refX || 0,
                refY: refY || 0,
                id: p.id
            });
            p.node.appendChild(this.node);
            return p;
        };
        // animation
        function slice(from, to, f) {
            return function (arr) {
                var res = arr.slice(from, to);
                if (res.length == 1) {
                    res = res[0];
                }
                return f ? f(res) : res;
            };
        }
        var Animation = function Animation(attr, ms, easing, callback) {
            if (typeof easing == "function" && !easing.length) {
                callback = easing;
                easing = mina.linear;
            }
            this.attr = attr;
            this.dur = ms;
            easing && (this.easing = easing);
            callback && (this.callback = callback);
        };
        Snap._.Animation = Animation;
        /*\
         * Snap.animation
         [ method ]
         **
         * Creates an animation object
         **
         - attr (object) attributes of final destination
         - duration (number) duration of the animation, in milliseconds
         - easing (function) #optional one of easing functions of @mina or custom one
         - callback (function) #optional callback function that fires when animation ends
         = (object) animation object
        \*/
        Snap.animation = function (attr, ms, easing, callback) {
            return new Animation(attr, ms, easing, callback);
        };
        /*\
         * Element.inAnim
         [ method ]
         **
         * Returns a set of animations that may be able to manipulate the current element
         **
         = (object) in format:
         o {
         o     anim (object) animation object,
         o     mina (object) @mina object,
         o     curStatus (number) 0..1 — status of the animation: 0 — just started, 1 — just finished,
         o     status (function) gets or sets the status of the animation,
         o     stop (function) stops the animation
         o }
        \*/
        elproto.inAnim = function () {
            var el = this,
                res = [];
            for (var id in el.anims) {
                if (el.anims[has](id)) {
                    (function (a) {
                        res.push({
                            anim: new Animation(a._attrs, a.dur, a.easing, a._callback),
                            mina: a,
                            curStatus: a.status(),
                            status: function status(val) {
                                return a.status(val);
                            },
                            stop: function stop() {
                                a.stop();
                            }
                        });
                    })(el.anims[id]);
                }
            }return res;
        };
        /*\
         * Snap.animate
         [ method ]
         **
         * Runs generic animation of one number into another with a caring function
         **
         - from (number|array) number or array of numbers
         - to (number|array) number or array of numbers
         - setter (function) caring function that accepts one number argument
         - duration (number) duration, in milliseconds
         - easing (function) #optional easing function from @mina or custom
         - callback (function) #optional callback function to execute when animation ends
         = (object) animation object in @mina format
         o {
         o     id (string) animation id, consider it read-only,
         o     duration (function) gets or sets the duration of the animation,
         o     easing (function) easing,
         o     speed (function) gets or sets the speed of the animation,
         o     status (function) gets or sets the status of the animation,
         o     stop (function) stops the animation
         o }
         | var rect = Snap().rect(0, 0, 10, 10);
         | Snap.animate(0, 10, function (val) {
         |     rect.attr({
         |         x: val
         |     });
         | }, 1000);
         | // in given context is equivalent to
         | rect.animate({x: 10}, 1000);
        \*/
        Snap.animate = function (from, to, setter, ms, easing, callback) {
            if (typeof easing == "function" && !easing.length) {
                callback = easing;
                easing = mina.linear;
            }
            var now = mina.time(),
                anim = mina(from, to, now, now + ms, mina.time, setter, easing);
            callback && eve.once("mina.finish." + anim.id, callback);
            return anim;
        };
        /*\
         * Element.stop
         [ method ]
         **
         * Stops all the animations for the current element
         **
         = (Element) the current element
        \*/
        elproto.stop = function () {
            var anims = this.inAnim();
            for (var i = 0, ii = anims.length; i < ii; i++) {
                anims[i].stop();
            }
            return this;
        };
        /*\
         * Element.animate
         [ method ]
         **
         * Animates the given attributes of the element
         **
         - attrs (object) key-value pairs of destination attributes
         - duration (number) duration of the animation in milliseconds
         - easing (function) #optional easing function from @mina or custom
         - callback (function) #optional callback function that executes when the animation ends
         = (Element) the current element
        \*/
        elproto.animate = function (attrs, ms, easing, callback) {
            if (typeof easing == "function" && !easing.length) {
                callback = easing;
                easing = mina.linear;
            }
            if (attrs instanceof Animation) {
                callback = attrs.callback;
                easing = attrs.easing;
                ms = attrs.dur;
                attrs = attrs.attr;
            }
            var fkeys = [],
                tkeys = [],
                keys = {},
                from,
                to,
                f,
                eq,
                el = this;
            for (var key in attrs) {
                if (attrs[has](key)) {
                    if (el.equal) {
                        eq = el.equal(key, Str(attrs[key]));
                        from = eq.from;
                        to = eq.to;
                        f = eq.f;
                    } else {
                        from = +el.attr(key);
                        to = +attrs[key];
                    }
                    var len = is(from, "array") ? from.length : 1;
                    keys[key] = slice(fkeys.length, fkeys.length + len, f);
                    fkeys = fkeys.concat(from);
                    tkeys = tkeys.concat(to);
                }
            }var now = mina.time(),
                anim = mina(fkeys, tkeys, now, now + ms, mina.time, function (val) {
                var attr = {};
                for (var key in keys) {
                    if (keys[has](key)) {
                        attr[key] = keys[key](val);
                    }
                }el.attr(attr);
            }, easing);
            el.anims[anim.id] = anim;
            anim._attrs = attrs;
            anim._callback = callback;
            eve("snap.animcreated." + el.id, anim);
            eve.once("mina.finish." + anim.id, function () {
                delete el.anims[anim.id];
                callback && callback.call(el);
            });
            eve.once("mina.stop." + anim.id, function () {
                delete el.anims[anim.id];
            });
            return el;
        };
        var eldata = {};
        /*\
         * Element.data
         [ method ]
         **
         * Adds or retrieves given value associated with given key. (Don’t confuse
         * with `data-` attributes)
         *
         * See also @Element.removeData
         - key (string) key to store data
         - value (any) #optional value to store
         = (object) @Element
         * or, if value is not specified:
         = (any) value
         > Usage
         | for (var i = 0, i < 5, i++) {
         |     paper.circle(10 + 15 * i, 10, 10)
         |          .attr({fill: "#000"})
         |          .data("i", i)
         |          .click(function () {
         |             alert(this.data("i"));
         |          });
         | }
        \*/
        elproto.data = function (key, value) {
            var data = eldata[this.id] = eldata[this.id] || {};
            if (arguments.length == 0) {
                eve("snap.data.get." + this.id, this, data, null);
                return data;
            }
            if (arguments.length == 1) {
                if (Snap.is(key, "object")) {
                    for (var i in key) {
                        if (key[has](i)) {
                            this.data(i, key[i]);
                        }
                    }return this;
                }
                eve("snap.data.get." + this.id, this, data[key], key);
                return data[key];
            }
            data[key] = value;
            eve("snap.data.set." + this.id, this, value, key);
            return this;
        };
        /*\
         * Element.removeData
         [ method ]
         **
         * Removes value associated with an element by given key.
         * If key is not provided, removes all the data of the element.
         - key (string) #optional key
         = (object) @Element
        \*/
        elproto.removeData = function (key) {
            if (key == null) {
                eldata[this.id] = {};
            } else {
                eldata[this.id] && delete eldata[this.id][key];
            }
            return this;
        };
        /*\
         * Element.outerSVG
         [ method ]
         **
         * Returns SVG code for the element, equivalent to HTML's `outerHTML`.
         *
         * See also @Element.innerSVG
         = (string) SVG code for the element
        \*/
        /*\
         * Element.toString
         [ method ]
         **
         * See @Element.outerSVG
        \*/
        elproto.outerSVG = elproto.toString = toString(1);
        /*\
         * Element.innerSVG
         [ method ]
         **
         * Returns SVG code for the element's contents, equivalent to HTML's `innerHTML`
         = (string) SVG code for the element
        \*/
        elproto.innerSVG = toString();
        function toString(type) {
            return function () {
                var res = type ? "<" + this.type : "",
                    attr = this.node.attributes,
                    chld = this.node.childNodes;
                if (type) {
                    for (var i = 0, ii = attr.length; i < ii; i++) {
                        res += " " + attr[i].name + '="' + attr[i].value.replace(/"/g, '\\"') + '"';
                    }
                }
                if (chld.length) {
                    type && (res += ">");
                    for (i = 0, ii = chld.length; i < ii; i++) {
                        if (chld[i].nodeType == 3) {
                            res += chld[i].nodeValue;
                        } else if (chld[i].nodeType == 1) {
                            res += wrap(chld[i]).toString();
                        }
                    }
                    type && (res += "</" + this.type + ">");
                } else {
                    type && (res += "/>");
                }
                return res;
            };
        }
        elproto.toDataURL = function () {
            if (window && window.btoa) {
                var bb = this.getBBox(),
                    svg = Snap.format('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{width}" height="{height}" viewBox="{x} {y} {width} {height}">{contents}</svg>', {
                    x: +bb.x.toFixed(3),
                    y: +bb.y.toFixed(3),
                    width: +bb.width.toFixed(3),
                    height: +bb.height.toFixed(3),
                    contents: this.outerSVG()
                });
                return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)));
            }
        };
        /*\
         * Fragment.select
         [ method ]
         **
         * See @Element.select
        \*/
        Fragment.prototype.select = elproto.select;
        /*\
         * Fragment.selectAll
         [ method ]
         **
         * See @Element.selectAll
        \*/
        Fragment.prototype.selectAll = elproto.selectAll;
    });
    // Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
    // 
    // Licensed under the Apache License, Version 2.0 (the "License");
    // you may not use this file except in compliance with the License.
    // You may obtain a copy of the License at
    // 
    // http://www.apache.org/licenses/LICENSE-2.0
    // 
    // Unless required by applicable law or agreed to in writing, software
    // distributed under the License is distributed on an "AS IS" BASIS,
    // WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    // See the License for the specific language governing permissions and
    // limitations under the License.
    Snap.plugin(function (Snap, Element, Paper, glob, Fragment) {
        var objectToString = Object.prototype.toString,
            Str = String,
            math = Math,
            E = "";
        function Matrix(a, b, c, d, e, f) {
            if (b == null && objectToString.call(a) == "[object SVGMatrix]") {
                this.a = a.a;
                this.b = a.b;
                this.c = a.c;
                this.d = a.d;
                this.e = a.e;
                this.f = a.f;
                return;
            }
            if (a != null) {
                this.a = +a;
                this.b = +b;
                this.c = +c;
                this.d = +d;
                this.e = +e;
                this.f = +f;
            } else {
                this.a = 1;
                this.b = 0;
                this.c = 0;
                this.d = 1;
                this.e = 0;
                this.f = 0;
            }
        }
        (function (matrixproto) {
            /*\
             * Matrix.add
             [ method ]
             **
             * Adds the given matrix to existing one
             - a (number)
             - b (number)
             - c (number)
             - d (number)
             - e (number)
             - f (number)
             * or
             - matrix (object) @Matrix
            \*/
            matrixproto.add = function (a, b, c, d, e, f) {
                var out = [[], [], []],
                    m = [[this.a, this.c, this.e], [this.b, this.d, this.f], [0, 0, 1]],
                    matrix = [[a, c, e], [b, d, f], [0, 0, 1]],
                    x,
                    y,
                    z,
                    res;
                if (a && a instanceof Matrix) {
                    matrix = [[a.a, a.c, a.e], [a.b, a.d, a.f], [0, 0, 1]];
                }
                for (x = 0; x < 3; x++) {
                    for (y = 0; y < 3; y++) {
                        res = 0;
                        for (z = 0; z < 3; z++) {
                            res += m[x][z] * matrix[z][y];
                        }
                        out[x][y] = res;
                    }
                }
                this.a = out[0][0];
                this.b = out[1][0];
                this.c = out[0][1];
                this.d = out[1][1];
                this.e = out[0][2];
                this.f = out[1][2];
                return this;
            };
            /*\
             * Matrix.invert
             [ method ]
             **
             * Returns an inverted version of the matrix
             = (object) @Matrix
            \*/
            matrixproto.invert = function () {
                var me = this,
                    x = me.a * me.d - me.b * me.c;
                return new Matrix(me.d / x, -me.b / x, -me.c / x, me.a / x, (me.c * me.f - me.d * me.e) / x, (me.b * me.e - me.a * me.f) / x);
            };
            /*\
             * Matrix.clone
             [ method ]
             **
             * Returns a copy of the matrix
             = (object) @Matrix
            \*/
            matrixproto.clone = function () {
                return new Matrix(this.a, this.b, this.c, this.d, this.e, this.f);
            };
            /*\
             * Matrix.translate
             [ method ]
             **
             * Translate the matrix
             - x (number) horizontal offset distance
             - y (number) vertical offset distance
            \*/
            matrixproto.translate = function (x, y) {
                return this.add(1, 0, 0, 1, x, y);
            };
            /*\
             * Matrix.scale
             [ method ]
             **
             * Scales the matrix
             - x (number) amount to be scaled, with `1` resulting in no change
             - y (number) #optional amount to scale along the vertical axis. (Otherwise `x` applies to both axes.)
             - cx (number) #optional horizontal origin point from which to scale
             - cy (number) #optional vertical origin point from which to scale
             * Default cx, cy is the middle point of the element.
            \*/
            matrixproto.scale = function (x, y, cx, cy) {
                y == null && (y = x);
                (cx || cy) && this.add(1, 0, 0, 1, cx, cy);
                this.add(x, 0, 0, y, 0, 0);
                (cx || cy) && this.add(1, 0, 0, 1, -cx, -cy);
                return this;
            };
            /*\
             * Matrix.rotate
             [ method ]
             **
             * Rotates the matrix
             - a (number) angle of rotation, in degrees
             - x (number) horizontal origin point from which to rotate
             - y (number) vertical origin point from which to rotate
            \*/
            matrixproto.rotate = function (a, x, y) {
                a = Snap.rad(a);
                x = x || 0;
                y = y || 0;
                var cos = +math.cos(a).toFixed(9),
                    sin = +math.sin(a).toFixed(9);
                this.add(cos, sin, -sin, cos, x, y);
                return this.add(1, 0, 0, 1, -x, -y);
            };
            /*\
             * Matrix.x
             [ method ]
             **
             * Returns x coordinate for given point after transformation described by the matrix. See also @Matrix.y
             - x (number)
             - y (number)
             = (number) x
            \*/
            matrixproto.x = function (x, y) {
                return x * this.a + y * this.c + this.e;
            };
            /*\
             * Matrix.y
             [ method ]
             **
             * Returns y coordinate for given point after transformation described by the matrix. See also @Matrix.x
             - x (number)
             - y (number)
             = (number) y
            \*/
            matrixproto.y = function (x, y) {
                return x * this.b + y * this.d + this.f;
            };
            matrixproto.get = function (i) {
                return +this[Str.fromCharCode(97 + i)].toFixed(4);
            };
            matrixproto.toString = function () {
                return "matrix(" + [this.get(0), this.get(1), this.get(2), this.get(3), this.get(4), this.get(5)].join() + ")";
            };
            matrixproto.offset = function () {
                return [this.e.toFixed(4), this.f.toFixed(4)];
            };
            function norm(a) {
                return a[0] * a[0] + a[1] * a[1];
            }
            function normalize(a) {
                var mag = math.sqrt(norm(a));
                a[0] && (a[0] /= mag);
                a[1] && (a[1] /= mag);
            }
            /*\
             * Matrix.determinant
             [ method ]
             **
             * Finds determinant of the given matrix.
             = (number) determinant
            \*/
            matrixproto.determinant = function () {
                return this.a * this.d - this.b * this.c;
            };
            /*\
             * Matrix.split
             [ method ]
             **
             * Splits matrix into primitive transformations
             = (object) in format:
             o dx (number) translation by x
             o dy (number) translation by y
             o scalex (number) scale by x
             o scaley (number) scale by y
             o shear (number) shear
             o rotate (number) rotation in deg
             o isSimple (boolean) could it be represented via simple transformations
            \*/
            matrixproto.split = function () {
                var out = {};
                // translation
                out.dx = this.e;
                out.dy = this.f;
                // scale and shear
                var row = [[this.a, this.c], [this.b, this.d]];
                out.scalex = math.sqrt(norm(row[0]));
                normalize(row[0]);
                out.shear = row[0][0] * row[1][0] + row[0][1] * row[1][1];
                row[1] = [row[1][0] - row[0][0] * out.shear, row[1][1] - row[0][1] * out.shear];
                out.scaley = math.sqrt(norm(row[1]));
                normalize(row[1]);
                out.shear /= out.scaley;
                if (this.determinant() < 0) {
                    out.scalex = -out.scalex;
                }
                // rotation
                var sin = -row[0][1],
                    cos = row[1][1];
                if (cos < 0) {
                    out.rotate = Snap.deg(math.acos(cos));
                    if (sin < 0) {
                        out.rotate = 360 - out.rotate;
                    }
                } else {
                    out.rotate = Snap.deg(math.asin(sin));
                }
                out.isSimple = !+out.shear.toFixed(9) && (out.scalex.toFixed(9) == out.scaley.toFixed(9) || !out.rotate);
                out.isSuperSimple = !+out.shear.toFixed(9) && out.scalex.toFixed(9) == out.scaley.toFixed(9) && !out.rotate;
                out.noRotation = !+out.shear.toFixed(9) && !out.rotate;
                return out;
            };
            /*\
             * Matrix.toTransformString
             [ method ]
             **
             * Returns transform string that represents given matrix
             = (string) transform string
            \*/
            matrixproto.toTransformString = function (shorter) {
                var s = shorter || this.split();
                if (!+s.shear.toFixed(9)) {
                    s.scalex = +s.scalex.toFixed(4);
                    s.scaley = +s.scaley.toFixed(4);
                    s.rotate = +s.rotate.toFixed(4);
                    return (s.dx || s.dy ? "t" + [+s.dx.toFixed(4), +s.dy.toFixed(4)] : E) + (s.scalex != 1 || s.scaley != 1 ? "s" + [s.scalex, s.scaley, 0, 0] : E) + (s.rotate ? "r" + [+s.rotate.toFixed(4), 0, 0] : E);
                } else {
                    return "m" + [this.get(0), this.get(1), this.get(2), this.get(3), this.get(4), this.get(5)];
                }
            };
        })(Matrix.prototype);
        /*\
         * Snap.Matrix
         [ method ]
         **
         * Matrix constructor, extend on your own risk.
         * To create matrices use @Snap.matrix.
        \*/
        Snap.Matrix = Matrix;
        /*\
         * Snap.matrix
         [ method ]
         **
         * Utility method
         **
         * Returns a matrix based on the given parameters
         - a (number)
         - b (number)
         - c (number)
         - d (number)
         - e (number)
         - f (number)
         * or
         - svgMatrix (SVGMatrix)
         = (object) @Matrix
        \*/
        Snap.matrix = function (a, b, c, d, e, f) {
            return new Matrix(a, b, c, d, e, f);
        };
    });
    // Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
    // 
    // Licensed under the Apache License, Version 2.0 (the "License");
    // you may not use this file except in compliance with the License.
    // You may obtain a copy of the License at
    // 
    // http://www.apache.org/licenses/LICENSE-2.0
    // 
    // Unless required by applicable law or agreed to in writing, software
    // distributed under the License is distributed on an "AS IS" BASIS,
    // WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    // See the License for the specific language governing permissions and
    // limitations under the License.
    Snap.plugin(function (Snap, Element, Paper, glob, Fragment) {
        var has = "hasOwnProperty",
            make = Snap._.make,
            wrap = Snap._.wrap,
            is = Snap.is,
            getSomeDefs = Snap._.getSomeDefs,
            reURLValue = /^url\(#?([^)]+)\)$/,
            $ = Snap._.$,
            URL = Snap.url,
            Str = String,
            separator = Snap._.separator,
            E = "";
        // Attributes event handlers
        eve.on("snap.util.attr.mask", function (value) {
            if (value instanceof Element || value instanceof Fragment) {
                eve.stop();
                if (value instanceof Fragment && value.node.childNodes.length == 1) {
                    value = value.node.firstChild;
                    getSomeDefs(this).appendChild(value);
                    value = wrap(value);
                }
                if (value.type == "mask") {
                    var mask = value;
                } else {
                    mask = make("mask", getSomeDefs(this));
                    mask.node.appendChild(value.node);
                }
                !mask.node.id && $(mask.node, {
                    id: mask.id
                });
                $(this.node, {
                    mask: URL(mask.id)
                });
            }
        });
        (function (clipIt) {
            eve.on("snap.util.attr.clip", clipIt);
            eve.on("snap.util.attr.clip-path", clipIt);
            eve.on("snap.util.attr.clipPath", clipIt);
        })(function (value) {
            if (value instanceof Element || value instanceof Fragment) {
                eve.stop();
                if (value.type == "clipPath") {
                    var clip = value;
                } else {
                    clip = make("clipPath", getSomeDefs(this));
                    clip.node.appendChild(value.node);
                    !clip.node.id && $(clip.node, {
                        id: clip.id
                    });
                }
                $(this.node, {
                    "clip-path": URL(clip.node.id || clip.id)
                });
            }
        });
        function fillStroke(name) {
            return function (value) {
                eve.stop();
                if (value instanceof Fragment && value.node.childNodes.length == 1 && (value.node.firstChild.tagName == "radialGradient" || value.node.firstChild.tagName == "linearGradient" || value.node.firstChild.tagName == "pattern")) {
                    value = value.node.firstChild;
                    getSomeDefs(this).appendChild(value);
                    value = wrap(value);
                }
                if (value instanceof Element) {
                    if (value.type == "radialGradient" || value.type == "linearGradient" || value.type == "pattern") {
                        if (!value.node.id) {
                            $(value.node, {
                                id: value.id
                            });
                        }
                        var fill = URL(value.node.id);
                    } else {
                        fill = value.attr(name);
                    }
                } else {
                    fill = Snap.color(value);
                    if (fill.error) {
                        var grad = Snap(getSomeDefs(this).ownerSVGElement).gradient(value);
                        if (grad) {
                            if (!grad.node.id) {
                                $(grad.node, {
                                    id: grad.id
                                });
                            }
                            fill = URL(grad.node.id);
                        } else {
                            fill = value;
                        }
                    } else {
                        fill = Str(fill);
                    }
                }
                var attrs = {};
                attrs[name] = fill;
                $(this.node, attrs);
                this.node.style[name] = E;
            };
        }
        eve.on("snap.util.attr.fill", fillStroke("fill"));
        eve.on("snap.util.attr.stroke", fillStroke("stroke"));
        var gradrg = /^([lr])(?:\(([^)]*)\))?(.*)$/i;
        eve.on("snap.util.grad.parse", function parseGrad(string) {
            string = Str(string);
            var tokens = string.match(gradrg);
            if (!tokens) {
                return null;
            }
            var type = tokens[1],
                params = tokens[2],
                stops = tokens[3];
            params = params.split(/\s*,\s*/).map(function (el) {
                return +el == el ? +el : el;
            });
            if (params.length == 1 && params[0] == 0) {
                params = [];
            }
            stops = stops.split("-");
            stops = stops.map(function (el) {
                el = el.split(":");
                var out = {
                    color: el[0]
                };
                if (el[1]) {
                    out.offset = parseFloat(el[1]);
                }
                return out;
            });
            return {
                type: type,
                params: params,
                stops: stops
            };
        });
        eve.on("snap.util.attr.d", function (value) {
            eve.stop();
            if (is(value, "array") && is(value[0], "array")) {
                value = Snap.path.toString.call(value);
            }
            value = Str(value);
            if (value.match(/[ruo]/i)) {
                value = Snap.path.toAbsolute(value);
            }
            $(this.node, { d: value });
        })(-1);
        eve.on("snap.util.attr.#text", function (value) {
            eve.stop();
            value = Str(value);
            var txt = glob.doc.createTextNode(value);
            while (this.node.firstChild) {
                this.node.removeChild(this.node.firstChild);
            }
            this.node.appendChild(txt);
        })(-1);
        eve.on("snap.util.attr.path", function (value) {
            eve.stop();
            this.attr({ d: value });
        })(-1);
        eve.on("snap.util.attr.class", function (value) {
            eve.stop();
            this.node.className.baseVal = value;
        })(-1);
        eve.on("snap.util.attr.viewBox", function (value) {
            var vb;
            if (is(value, "object") && "x" in value) {
                vb = [value.x, value.y, value.width, value.height].join(" ");
            } else if (is(value, "array")) {
                vb = value.join(" ");
            } else {
                vb = value;
            }
            $(this.node, {
                viewBox: vb
            });
            eve.stop();
        })(-1);
        eve.on("snap.util.attr.transform", function (value) {
            this.transform(value);
            eve.stop();
        })(-1);
        eve.on("snap.util.attr.r", function (value) {
            if (this.type == "rect") {
                eve.stop();
                $(this.node, {
                    rx: value,
                    ry: value
                });
            }
        })(-1);
        eve.on("snap.util.attr.textpath", function (value) {
            eve.stop();
            if (this.type == "text") {
                var id, tp, node;
                if (!value && this.textPath) {
                    tp = this.textPath;
                    while (tp.node.firstChild) {
                        this.node.appendChild(tp.node.firstChild);
                    }
                    tp.remove();
                    delete this.textPath;
                    return;
                }
                if (is(value, "string")) {
                    var defs = getSomeDefs(this),
                        path = wrap(defs.parentNode).path(value);
                    defs.appendChild(path.node);
                    id = path.id;
                    path.attr({ id: id });
                } else {
                    value = wrap(value);
                    if (value instanceof Element) {
                        id = value.attr("id");
                        if (!id) {
                            id = value.id;
                            value.attr({ id: id });
                        }
                    }
                }
                if (id) {
                    tp = this.textPath;
                    node = this.node;
                    if (tp) {
                        tp.attr({ "xlink:href": "#" + id });
                    } else {
                        tp = $("textPath", {
                            "xlink:href": "#" + id
                        });
                        while (node.firstChild) {
                            tp.appendChild(node.firstChild);
                        }
                        node.appendChild(tp);
                        this.textPath = wrap(tp);
                    }
                }
            }
        })(-1);
        eve.on("snap.util.attr.text", function (value) {
            if (this.type == "text") {
                var i = 0,
                    node = this.node,
                    tuner = function tuner(chunk) {
                    var out = $("tspan");
                    if (is(chunk, "array")) {
                        for (var i = 0; i < chunk.length; i++) {
                            out.appendChild(tuner(chunk[i]));
                        }
                    } else {
                        out.appendChild(glob.doc.createTextNode(chunk));
                    }
                    out.normalize && out.normalize();
                    return out;
                };
                while (node.firstChild) {
                    node.removeChild(node.firstChild);
                }
                var tuned = tuner(value);
                while (tuned.firstChild) {
                    node.appendChild(tuned.firstChild);
                }
            }
            eve.stop();
        })(-1);
        function setFontSize(value) {
            eve.stop();
            if (value == +value) {
                value += "px";
            }
            this.node.style.fontSize = value;
        }
        eve.on("snap.util.attr.fontSize", setFontSize)(-1);
        eve.on("snap.util.attr.font-size", setFontSize)(-1);
        eve.on("snap.util.getattr.transform", function () {
            eve.stop();
            return this.transform();
        })(-1);
        eve.on("snap.util.getattr.textpath", function () {
            eve.stop();
            return this.textPath;
        })(-1);
        // Markers
        (function () {
            function getter(end) {
                return function () {
                    eve.stop();
                    var style = glob.doc.defaultView.getComputedStyle(this.node, null).getPropertyValue("marker-" + end);
                    if (style == "none") {
                        return style;
                    } else {
                        return Snap(glob.doc.getElementById(style.match(reURLValue)[1]));
                    }
                };
            }
            function setter(end) {
                return function (value) {
                    eve.stop();
                    var name = "marker" + end.charAt(0).toUpperCase() + end.substring(1);
                    if (value == "" || !value) {
                        this.node.style[name] = "none";
                        return;
                    }
                    if (value.type == "marker") {
                        var id = value.node.id;
                        if (!id) {
                            $(value.node, { id: value.id });
                        }
                        this.node.style[name] = URL(id);
                        return;
                    }
                };
            }
            eve.on("snap.util.getattr.marker-end", getter("end"))(-1);
            eve.on("snap.util.getattr.markerEnd", getter("end"))(-1);
            eve.on("snap.util.getattr.marker-start", getter("start"))(-1);
            eve.on("snap.util.getattr.markerStart", getter("start"))(-1);
            eve.on("snap.util.getattr.marker-mid", getter("mid"))(-1);
            eve.on("snap.util.getattr.markerMid", getter("mid"))(-1);
            eve.on("snap.util.attr.marker-end", setter("end"))(-1);
            eve.on("snap.util.attr.markerEnd", setter("end"))(-1);
            eve.on("snap.util.attr.marker-start", setter("start"))(-1);
            eve.on("snap.util.attr.markerStart", setter("start"))(-1);
            eve.on("snap.util.attr.marker-mid", setter("mid"))(-1);
            eve.on("snap.util.attr.markerMid", setter("mid"))(-1);
        })();
        eve.on("snap.util.getattr.r", function () {
            if (this.type == "rect" && $(this.node, "rx") == $(this.node, "ry")) {
                eve.stop();
                return $(this.node, "rx");
            }
        })(-1);
        function textExtract(node) {
            var out = [];
            var children = node.childNodes;
            for (var i = 0, ii = children.length; i < ii; i++) {
                var chi = children[i];
                if (chi.nodeType == 3) {
                    out.push(chi.nodeValue);
                }
                if (chi.tagName == "tspan") {
                    if (chi.childNodes.length == 1 && chi.firstChild.nodeType == 3) {
                        out.push(chi.firstChild.nodeValue);
                    } else {
                        out.push(textExtract(chi));
                    }
                }
            }
            return out;
        }
        eve.on("snap.util.getattr.text", function () {
            if (this.type == "text" || this.type == "tspan") {
                eve.stop();
                var out = textExtract(this.node);
                return out.length == 1 ? out[0] : out;
            }
        })(-1);
        eve.on("snap.util.getattr.#text", function () {
            return this.node.textContent;
        })(-1);
        eve.on("snap.util.getattr.viewBox", function () {
            eve.stop();
            var vb = $(this.node, "viewBox");
            if (vb) {
                vb = vb.split(separator);
                return Snap._.box(+vb[0], +vb[1], +vb[2], +vb[3]);
            } else {
                return;
            }
        })(-1);
        eve.on("snap.util.getattr.points", function () {
            var p = $(this.node, "points");
            eve.stop();
            if (p) {
                return p.split(separator);
            } else {
                return;
            }
        })(-1);
        eve.on("snap.util.getattr.path", function () {
            var p = $(this.node, "d");
            eve.stop();
            return p;
        })(-1);
        eve.on("snap.util.getattr.class", function () {
            return this.node.className.baseVal;
        })(-1);
        function getFontSize() {
            eve.stop();
            return this.node.style.fontSize;
        }
        eve.on("snap.util.getattr.fontSize", getFontSize)(-1);
        eve.on("snap.util.getattr.font-size", getFontSize)(-1);
    });
    // Copyright (c) 2014 Adobe Systems Incorporated. All rights reserved.
    //
    // Licensed under the Apache License, Version 2.0 (the "License");
    // you may not use this file except in compliance with the License.
    // You may obtain a copy of the License at
    //
    // http://www.apache.org/licenses/LICENSE-2.0
    //
    // Unless required by applicable law or agreed to in writing, software
    // distributed under the License is distributed on an "AS IS" BASIS,
    // WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    // See the License for the specific language governing permissions and
    // limitations under the License.
    Snap.plugin(function (Snap, Element, Paper, glob, Fragment) {
        var rgNotSpace = /\S+/g,
            rgBadSpace = /[\t\r\n\f]/g,
            rgTrim = /(^\s+|\s+$)/g,
            Str = String,
            elproto = Element.prototype;
        /*\
         * Element.addClass
         [ method ]
         **
         * Adds given class name or list of class names to the element.
         - value (string) class name or space separated list of class names
         **
         = (Element) original element.
        \*/
        elproto.addClass = function (value) {
            var classes = Str(value || "").match(rgNotSpace) || [],
                elem = this.node,
                className = elem.className.baseVal,
                curClasses = className.match(rgNotSpace) || [],
                j,
                pos,
                clazz,
                finalValue;
            if (classes.length) {
                j = 0;
                while (clazz = classes[j++]) {
                    pos = curClasses.indexOf(clazz);
                    if (!~pos) {
                        curClasses.push(clazz);
                    }
                }
                finalValue = curClasses.join(" ");
                if (className != finalValue) {
                    elem.className.baseVal = finalValue;
                }
            }
            return this;
        };
        /*\
         * Element.removeClass
         [ method ]
         **
         * Removes given class name or list of class names from the element.
         - value (string) class name or space separated list of class names
         **
         = (Element) original element.
        \*/
        elproto.removeClass = function (value) {
            var classes = Str(value || "").match(rgNotSpace) || [],
                elem = this.node,
                className = elem.className.baseVal,
                curClasses = className.match(rgNotSpace) || [],
                j,
                pos,
                clazz,
                finalValue;
            if (curClasses.length) {
                j = 0;
                while (clazz = classes[j++]) {
                    pos = curClasses.indexOf(clazz);
                    if (~pos) {
                        curClasses.splice(pos, 1);
                    }
                }
                finalValue = curClasses.join(" ");
                if (className != finalValue) {
                    elem.className.baseVal = finalValue;
                }
            }
            return this;
        };
        /*\
         * Element.hasClass
         [ method ]
         **
         * Checks if the element has a given class name in the list of class names applied to it.
         - value (string) class name
         **
         = (boolean) `true` if the element has given class
        \*/
        elproto.hasClass = function (value) {
            var elem = this.node,
                className = elem.className.baseVal,
                curClasses = className.match(rgNotSpace) || [];
            return !!~curClasses.indexOf(value);
        };
        /*\
         * Element.toggleClass
         [ method ]
         **
         * Add or remove one or more classes from the element, depending on either
         * the class’s presence or the value of the `flag` argument.
         - value (string) class name or space separated list of class names
         - flag (boolean) value to determine whether the class should be added or removed
         **
         = (Element) original element.
        \*/
        elproto.toggleClass = function (value, flag) {
            if (flag != null) {
                if (flag) {
                    return this.addClass(value);
                } else {
                    return this.removeClass(value);
                }
            }
            var classes = (value || "").match(rgNotSpace) || [],
                elem = this.node,
                className = elem.className.baseVal,
                curClasses = className.match(rgNotSpace) || [],
                j,
                pos,
                clazz,
                finalValue;
            j = 0;
            while (clazz = classes[j++]) {
                pos = curClasses.indexOf(clazz);
                if (~pos) {
                    curClasses.splice(pos, 1);
                } else {
                    curClasses.push(clazz);
                }
            }
            finalValue = curClasses.join(" ");
            if (className != finalValue) {
                elem.className.baseVal = finalValue;
            }
            return this;
        };
    });
    // Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
    // 
    // Licensed under the Apache License, Version 2.0 (the "License");
    // you may not use this file except in compliance with the License.
    // You may obtain a copy of the License at
    // 
    // http://www.apache.org/licenses/LICENSE-2.0
    // 
    // Unless required by applicable law or agreed to in writing, software
    // distributed under the License is distributed on an "AS IS" BASIS,
    // WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    // See the License for the specific language governing permissions and
    // limitations under the License.
    Snap.plugin(function (Snap, Element, Paper, glob, Fragment) {
        var operators = {
            "+": function _(x, y) {
                return x + y;
            },
            "-": function _(x, y) {
                return x - y;
            },
            "/": function _(x, y) {
                return x / y;
            },
            "*": function _(x, y) {
                return x * y;
            }
        },
            Str = String,
            reUnit = /[a-z]+$/i,
            reAddon = /^\s*([+\-\/*])\s*=\s*([\d.eE+\-]+)\s*([^\d\s]+)?\s*$/;
        function getNumber(val) {
            return val;
        }
        function getUnit(unit) {
            return function (val) {
                return +val.toFixed(3) + unit;
            };
        }
        eve.on("snap.util.attr", function (val) {
            var plus = Str(val).match(reAddon);
            if (plus) {
                var evnt = eve.nt(),
                    name = evnt.substring(evnt.lastIndexOf(".") + 1),
                    a = this.attr(name),
                    atr = {};
                eve.stop();
                var unit = plus[3] || "",
                    aUnit = a.match(reUnit),
                    op = operators[plus[1]];
                if (aUnit && aUnit == unit) {
                    val = op(parseFloat(a), +plus[2]);
                } else {
                    a = this.asPX(name);
                    val = op(this.asPX(name), this.asPX(name, plus[2] + unit));
                }
                if (isNaN(a) || isNaN(val)) {
                    return;
                }
                atr[name] = val;
                this.attr(atr);
            }
        })(-10);
        eve.on("snap.util.equal", function (name, b) {
            var A,
                B,
                a = Str(this.attr(name) || ""),
                el = this,
                bplus = Str(b).match(reAddon);
            if (bplus) {
                eve.stop();
                var unit = bplus[3] || "",
                    aUnit = a.match(reUnit),
                    op = operators[bplus[1]];
                if (aUnit && aUnit == unit) {
                    return {
                        from: parseFloat(a),
                        to: op(parseFloat(a), +bplus[2]),
                        f: getUnit(aUnit)
                    };
                } else {
                    a = this.asPX(name);
                    return {
                        from: a,
                        to: op(a, this.asPX(name, bplus[2] + unit)),
                        f: getNumber
                    };
                }
            }
        })(-10);
    });
    // Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
    // 
    // Licensed under the Apache License, Version 2.0 (the "License");
    // you may not use this file except in compliance with the License.
    // You may obtain a copy of the License at
    // 
    // http://www.apache.org/licenses/LICENSE-2.0
    // 
    // Unless required by applicable law or agreed to in writing, software
    // distributed under the License is distributed on an "AS IS" BASIS,
    // WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    // See the License for the specific language governing permissions and
    // limitations under the License.
    Snap.plugin(function (Snap, Element, Paper, glob, Fragment) {
        var proto = Paper.prototype,
            is = Snap.is;
        /*\
         * Paper.rect
         [ method ]
         *
         * Draws a rectangle
         **
         - x (number) x coordinate of the top left corner
         - y (number) y coordinate of the top left corner
         - width (number) width
         - height (number) height
         - rx (number) #optional horizontal radius for rounded corners, default is 0
         - ry (number) #optional vertical radius for rounded corners, default is rx or 0
         = (object) the `rect` element
         **
         > Usage
         | // regular rectangle
         | var c = paper.rect(10, 10, 50, 50);
         | // rectangle with rounded corners
         | var c = paper.rect(40, 40, 50, 50, 10);
        \*/
        proto.rect = function (x, y, w, h, rx, ry) {
            var attr;
            if (ry == null) {
                ry = rx;
            }
            if (is(x, "object") && x == "[object Object]") {
                attr = x;
            } else if (x != null) {
                attr = {
                    x: x,
                    y: y,
                    width: w,
                    height: h
                };
                if (rx != null) {
                    attr.rx = rx;
                    attr.ry = ry;
                }
            }
            return this.el("rect", attr);
        };
        /*\
         * Paper.circle
         [ method ]
         **
         * Draws a circle
         **
         - x (number) x coordinate of the centre
         - y (number) y coordinate of the centre
         - r (number) radius
         = (object) the `circle` element
         **
         > Usage
         | var c = paper.circle(50, 50, 40);
        \*/
        proto.circle = function (cx, cy, r) {
            var attr;
            if (is(cx, "object") && cx == "[object Object]") {
                attr = cx;
            } else if (cx != null) {
                attr = {
                    cx: cx,
                    cy: cy,
                    r: r
                };
            }
            return this.el("circle", attr);
        };
        var preload = function () {
            function onerror() {
                this.parentNode.removeChild(this);
            }
            return function (src, f) {
                var img = glob.doc.createElement("img"),
                    body = glob.doc.body;
                img.style.cssText = "position:absolute;left:-9999em;top:-9999em";
                img.onload = function () {
                    f.call(img);
                    img.onload = img.onerror = null;
                    body.removeChild(img);
                };
                img.onerror = onerror;
                body.appendChild(img);
                img.src = src;
            };
        }();
        /*\
         * Paper.image
         [ method ]
         **
         * Places an image on the surface
         **
         - src (string) URI of the source image
         - x (number) x offset position
         - y (number) y offset position
         - width (number) width of the image
         - height (number) height of the image
         = (object) the `image` element
         * or
         = (object) Snap element object with type `image`
         **
         > Usage
         | var c = paper.image("apple.png", 10, 10, 80, 80);
        \*/
        proto.image = function (src, x, y, width, height) {
            var el = this.el("image");
            if (is(src, "object") && "src" in src) {
                el.attr(src);
            } else if (src != null) {
                var set = {
                    "xlink:href": src,
                    preserveAspectRatio: "none"
                };
                if (x != null && y != null) {
                    set.x = x;
                    set.y = y;
                }
                if (width != null && height != null) {
                    set.width = width;
                    set.height = height;
                } else {
                    preload(src, function () {
                        Snap._.$(el.node, {
                            width: this.offsetWidth,
                            height: this.offsetHeight
                        });
                    });
                }
                Snap._.$(el.node, set);
            }
            return el;
        };
        /*\
         * Paper.ellipse
         [ method ]
         **
         * Draws an ellipse
         **
         - x (number) x coordinate of the centre
         - y (number) y coordinate of the centre
         - rx (number) horizontal radius
         - ry (number) vertical radius
         = (object) the `ellipse` element
         **
         > Usage
         | var c = paper.ellipse(50, 50, 40, 20);
        \*/
        proto.ellipse = function (cx, cy, rx, ry) {
            var attr;
            if (is(cx, "object") && cx == "[object Object]") {
                attr = cx;
            } else if (cx != null) {
                attr = {
                    cx: cx,
                    cy: cy,
                    rx: rx,
                    ry: ry
                };
            }
            return this.el("ellipse", attr);
        };
        // SIERRA Paper.path(): Unclear from the link what a Catmull-Rom curveto is, and why it would make life any easier.
        /*\
         * Paper.path
         [ method ]
         **
         * Creates a `<path>` element using the given string as the path's definition
         - pathString (string) #optional path string in SVG format
         * Path string consists of one-letter commands, followed by comma seprarated arguments in numerical form. Example:
         | "M10,20L30,40"
         * This example features two commands: `M`, with arguments `(10, 20)` and `L` with arguments `(30, 40)`. Uppercase letter commands express coordinates in absolute terms, while lowercase commands express them in relative terms from the most recently declared coordinates.
         *
         # <p>Here is short list of commands available, for more details see <a href="http://www.w3.org/TR/SVG/paths.html#PathData" title="Details of a path's data attribute's format are described in the SVG specification.">SVG path string format</a> or <a href="https://developer.mozilla.org/en/SVG/Tutorial/Paths">article about path strings at MDN</a>.</p>
         # <table><thead><tr><th>Command</th><th>Name</th><th>Parameters</th></tr></thead><tbody>
         # <tr><td>M</td><td>moveto</td><td>(x y)+</td></tr>
         # <tr><td>Z</td><td>closepath</td><td>(none)</td></tr>
         # <tr><td>L</td><td>lineto</td><td>(x y)+</td></tr>
         # <tr><td>H</td><td>horizontal lineto</td><td>x+</td></tr>
         # <tr><td>V</td><td>vertical lineto</td><td>y+</td></tr>
         # <tr><td>C</td><td>curveto</td><td>(x1 y1 x2 y2 x y)+</td></tr>
         # <tr><td>S</td><td>smooth curveto</td><td>(x2 y2 x y)+</td></tr>
         # <tr><td>Q</td><td>quadratic Bézier curveto</td><td>(x1 y1 x y)+</td></tr>
         # <tr><td>T</td><td>smooth quadratic Bézier curveto</td><td>(x y)+</td></tr>
         # <tr><td>A</td><td>elliptical arc</td><td>(rx ry x-axis-rotation large-arc-flag sweep-flag x y)+</td></tr>
         # <tr><td>R</td><td><a href="http://en.wikipedia.org/wiki/Catmull–Rom_spline#Catmull.E2.80.93Rom_spline">Catmull-Rom curveto</a>*</td><td>x1 y1 (x y)+</td></tr></tbody></table>
         * * _Catmull-Rom curveto_ is a not standard SVG command and added to make life easier.
         * Note: there is a special case when a path consists of only three commands: `M10,10R…z`. In this case the path connects back to its starting point.
         > Usage
         | var c = paper.path("M10 10L90 90");
         | // draw a diagonal line:
         | // move to 10,10, line to 90,90
        \*/
        proto.path = function (d) {
            var attr;
            if (is(d, "object") && !is(d, "array")) {
                attr = d;
            } else if (d) {
                attr = { d: d };
            }
            return this.el("path", attr);
        };
        /*\
         * Paper.g
         [ method ]
         **
         * Creates a group element
         **
         - varargs (…) #optional elements to nest within the group
         = (object) the `g` element
         **
         > Usage
         | var c1 = paper.circle(),
         |     c2 = paper.rect(),
         |     g = paper.g(c2, c1); // note that the order of elements is different
         * or
         | var c1 = paper.circle(),
         |     c2 = paper.rect(),
         |     g = paper.g();
         | g.add(c2, c1);
        \*/
        /*\
         * Paper.group
         [ method ]
         **
         * See @Paper.g
        \*/
        proto.group = proto.g = function (first) {
            var attr,
                el = this.el("g");
            if (arguments.length == 1 && first && !first.type) {
                el.attr(first);
            } else if (arguments.length) {
                el.add(Array.prototype.slice.call(arguments, 0));
            }
            return el;
        };
        /*\
         * Paper.svg
         [ method ]
         **
         * Creates a nested SVG element.
         - x (number) @optional X of the element
         - y (number) @optional Y of the element
         - width (number) @optional width of the element
         - height (number) @optional height of the element
         - vbx (number) @optional viewbox X
         - vby (number) @optional viewbox Y
         - vbw (number) @optional viewbox width
         - vbh (number) @optional viewbox height
         **
         = (object) the `svg` element
         **
        \*/
        proto.svg = function (x, y, width, height, vbx, vby, vbw, vbh) {
            var attrs = {};
            if (is(x, "object") && y == null) {
                attrs = x;
            } else {
                if (x != null) {
                    attrs.x = x;
                }
                if (y != null) {
                    attrs.y = y;
                }
                if (width != null) {
                    attrs.width = width;
                }
                if (height != null) {
                    attrs.height = height;
                }
                if (vbx != null && vby != null && vbw != null && vbh != null) {
                    attrs.viewBox = [vbx, vby, vbw, vbh];
                }
            }
            return this.el("svg", attrs);
        };
        /*\
         * Paper.mask
         [ method ]
         **
         * Equivalent in behaviour to @Paper.g, except it’s a mask.
         **
         = (object) the `mask` element
         **
        \*/
        proto.mask = function (first) {
            var attr,
                el = this.el("mask");
            if (arguments.length == 1 && first && !first.type) {
                el.attr(first);
            } else if (arguments.length) {
                el.add(Array.prototype.slice.call(arguments, 0));
            }
            return el;
        };
        /*\
         * Paper.ptrn
         [ method ]
         **
         * Equivalent in behaviour to @Paper.g, except it’s a pattern.
         - x (number) @optional X of the element
         - y (number) @optional Y of the element
         - width (number) @optional width of the element
         - height (number) @optional height of the element
         - vbx (number) @optional viewbox X
         - vby (number) @optional viewbox Y
         - vbw (number) @optional viewbox width
         - vbh (number) @optional viewbox height
         **
         = (object) the `pattern` element
         **
        \*/
        proto.ptrn = function (x, y, width, height, vx, vy, vw, vh) {
            if (is(x, "object")) {
                var attr = x;
            } else {
                attr = { patternUnits: "userSpaceOnUse" };
                if (x) {
                    attr.x = x;
                }
                if (y) {
                    attr.y = y;
                }
                if (width != null) {
                    attr.width = width;
                }
                if (height != null) {
                    attr.height = height;
                }
                if (vx != null && vy != null && vw != null && vh != null) {
                    attr.viewBox = [vx, vy, vw, vh];
                } else {
                    attr.viewBox = [x || 0, y || 0, width || 0, height || 0];
                }
            }
            return this.el("pattern", attr);
        };
        /*\
         * Paper.use
         [ method ]
         **
         * Creates a <use> element.
         - id (string) @optional id of element to link
         * or
         - id (Element) @optional element to link
         **
         = (object) the `use` element
         **
        \*/
        proto.use = function (id) {
            if (id != null) {
                if (id instanceof Element) {
                    if (!id.attr("id")) {
                        id.attr({ id: Snap._.id(id) });
                    }
                    id = id.attr("id");
                }
                if (String(id).charAt() == "#") {
                    id = id.substring(1);
                }
                return this.el("use", { "xlink:href": "#" + id });
            } else {
                return Element.prototype.use.call(this);
            }
        };
        /*\
         * Paper.symbol
         [ method ]
         **
         * Creates a <symbol> element.
         - vbx (number) @optional viewbox X
         - vby (number) @optional viewbox Y
         - vbw (number) @optional viewbox width
         - vbh (number) @optional viewbox height
         = (object) the `symbol` element
         **
        \*/
        proto.symbol = function (vx, vy, vw, vh) {
            var attr = {};
            if (vx != null && vy != null && vw != null && vh != null) {
                attr.viewBox = [vx, vy, vw, vh];
            }
            return this.el("symbol", attr);
        };
        /*\
         * Paper.text
         [ method ]
         **
         * Draws a text string
         **
         - x (number) x coordinate position
         - y (number) y coordinate position
         - text (string|array) The text string to draw or array of strings to nest within separate `<tspan>` elements
         = (object) the `text` element
         **
         > Usage
         | var t1 = paper.text(50, 50, "Snap");
         | var t2 = paper.text(50, 50, ["S","n","a","p"]);
         | // Text path usage
         | t1.attr({textpath: "M10,10L100,100"});
         | // or
         | var pth = paper.path("M10,10L100,100");
         | t1.attr({textpath: pth});
        \*/
        proto.text = function (x, y, text) {
            var attr = {};
            if (is(x, "object")) {
                attr = x;
            } else if (x != null) {
                attr = {
                    x: x,
                    y: y,
                    text: text || ""
                };
            }
            return this.el("text", attr);
        };
        /*\
         * Paper.line
         [ method ]
         **
         * Draws a line
         **
         - x1 (number) x coordinate position of the start
         - y1 (number) y coordinate position of the start
         - x2 (number) x coordinate position of the end
         - y2 (number) y coordinate position of the end
         = (object) the `line` element
         **
         > Usage
         | var t1 = paper.line(50, 50, 100, 100);
        \*/
        proto.line = function (x1, y1, x2, y2) {
            var attr = {};
            if (is(x1, "object")) {
                attr = x1;
            } else if (x1 != null) {
                attr = {
                    x1: x1,
                    x2: x2,
                    y1: y1,
                    y2: y2
                };
            }
            return this.el("line", attr);
        };
        /*\
         * Paper.polyline
         [ method ]
         **
         * Draws a polyline
         **
         - points (array) array of points
         * or
         - varargs (…) points
         = (object) the `polyline` element
         **
         > Usage
         | var p1 = paper.polyline([10, 10, 100, 100]);
         | var p2 = paper.polyline(10, 10, 100, 100);
        \*/
        proto.polyline = function (points) {
            if (arguments.length > 1) {
                points = Array.prototype.slice.call(arguments, 0);
            }
            var attr = {};
            if (is(points, "object") && !is(points, "array")) {
                attr = points;
            } else if (points != null) {
                attr = { points: points };
            }
            return this.el("polyline", attr);
        };
        /*\
         * Paper.polygon
         [ method ]
         **
         * Draws a polygon. See @Paper.polyline
        \*/
        proto.polygon = function (points) {
            if (arguments.length > 1) {
                points = Array.prototype.slice.call(arguments, 0);
            }
            var attr = {};
            if (is(points, "object") && !is(points, "array")) {
                attr = points;
            } else if (points != null) {
                attr = { points: points };
            }
            return this.el("polygon", attr);
        };
        // gradients
        (function () {
            var $ = Snap._.$;
            // gradients' helpers
            function Gstops() {
                return this.selectAll("stop");
            }
            function GaddStop(color, offset) {
                var stop = $("stop"),
                    attr = {
                    offset: +offset + "%"
                };
                color = Snap.color(color);
                attr["stop-color"] = color.hex;
                if (color.opacity < 1) {
                    attr["stop-opacity"] = color.opacity;
                }
                $(stop, attr);
                this.node.appendChild(stop);
                return this;
            }
            function GgetBBox() {
                if (this.type == "linearGradient") {
                    var x1 = $(this.node, "x1") || 0,
                        x2 = $(this.node, "x2") || 1,
                        y1 = $(this.node, "y1") || 0,
                        y2 = $(this.node, "y2") || 0;
                    return Snap._.box(x1, y1, math.abs(x2 - x1), math.abs(y2 - y1));
                } else {
                    var cx = this.node.cx || .5,
                        cy = this.node.cy || .5,
                        r = this.node.r || 0;
                    return Snap._.box(cx - r, cy - r, r * 2, r * 2);
                }
            }
            function gradient(defs, str) {
                var grad = eve("snap.util.grad.parse", null, str).firstDefined(),
                    el;
                if (!grad) {
                    return null;
                }
                grad.params.unshift(defs);
                if (grad.type.toLowerCase() == "l") {
                    el = gradientLinear.apply(0, grad.params);
                } else {
                    el = gradientRadial.apply(0, grad.params);
                }
                if (grad.type != grad.type.toLowerCase()) {
                    $(el.node, {
                        gradientUnits: "userSpaceOnUse"
                    });
                }
                var stops = grad.stops,
                    len = stops.length,
                    start = 0,
                    j = 0;
                function seed(i, end) {
                    var step = (end - start) / (i - j);
                    for (var k = j; k < i; k++) {
                        stops[k].offset = +(+start + step * (k - j)).toFixed(2);
                    }
                    j = i;
                    start = end;
                }
                len--;
                for (var i = 0; i < len; i++) {
                    if ("offset" in stops[i]) {
                        seed(i, stops[i].offset);
                    }
                }stops[len].offset = stops[len].offset || 100;
                seed(len, stops[len].offset);
                for (i = 0; i <= len; i++) {
                    var stop = stops[i];
                    el.addStop(stop.color, stop.offset);
                }
                return el;
            }
            function gradientLinear(defs, x1, y1, x2, y2) {
                var el = Snap._.make("linearGradient", defs);
                el.stops = Gstops;
                el.addStop = GaddStop;
                el.getBBox = GgetBBox;
                if (x1 != null) {
                    $(el.node, {
                        x1: x1,
                        y1: y1,
                        x2: x2,
                        y2: y2
                    });
                }
                return el;
            }
            function gradientRadial(defs, cx, cy, r, fx, fy) {
                var el = Snap._.make("radialGradient", defs);
                el.stops = Gstops;
                el.addStop = GaddStop;
                el.getBBox = GgetBBox;
                if (cx != null) {
                    $(el.node, {
                        cx: cx,
                        cy: cy,
                        r: r
                    });
                }
                if (fx != null && fy != null) {
                    $(el.node, {
                        fx: fx,
                        fy: fy
                    });
                }
                return el;
            }
            /*\
             * Paper.gradient
             [ method ]
             **
             * Creates a gradient element
             **
             - gradient (string) gradient descriptor
             > Gradient Descriptor
             * The gradient descriptor is an expression formatted as
             * follows: `<type>(<coords>)<colors>`.  The `<type>` can be
             * either linear or radial.  The uppercase `L` or `R` letters
             * indicate absolute coordinates offset from the SVG surface.
             * Lowercase `l` or `r` letters indicate coordinates
             * calculated relative to the element to which the gradient is
             * applied.  Coordinates specify a linear gradient vector as
             * `x1`, `y1`, `x2`, `y2`, or a radial gradient as `cx`, `cy`,
             * `r` and optional `fx`, `fy` specifying a focal point away
             * from the center of the circle. Specify `<colors>` as a list
             * of dash-separated CSS color values.  Each color may be
             * followed by a custom offset value, separated with a colon
             * character.
             > Examples
             * Linear gradient, relative from top-left corner to bottom-right
             * corner, from black through red to white:
             | var g = paper.gradient("l(0, 0, 1, 1)#000-#f00-#fff");
             * Linear gradient, absolute from (0, 0) to (100, 100), from black
             * through red at 25% to white:
             | var g = paper.gradient("L(0, 0, 100, 100)#000-#f00:25-#fff");
             * Radial gradient, relative from the center of the element with radius
             * half the width, from black to white:
             | var g = paper.gradient("r(0.5, 0.5, 0.5)#000-#fff");
             * To apply the gradient:
             | paper.circle(50, 50, 40).attr({
             |     fill: g
             | });
             = (object) the `gradient` element
            \*/
            proto.gradient = function (str) {
                return gradient(this.defs, str);
            };
            proto.gradientLinear = function (x1, y1, x2, y2) {
                return gradientLinear(this.defs, x1, y1, x2, y2);
            };
            proto.gradientRadial = function (cx, cy, r, fx, fy) {
                return gradientRadial(this.defs, cx, cy, r, fx, fy);
            };
            /*\
             * Paper.toString
             [ method ]
             **
             * Returns SVG code for the @Paper
             = (string) SVG code for the @Paper
            \*/
            proto.toString = function () {
                var doc = this.node.ownerDocument,
                    f = doc.createDocumentFragment(),
                    d = doc.createElement("div"),
                    svg = this.node.cloneNode(true),
                    res;
                f.appendChild(d);
                d.appendChild(svg);
                Snap._.$(svg, { xmlns: "http://www.w3.org/2000/svg" });
                res = d.innerHTML;
                f.removeChild(f.firstChild);
                return res;
            };
            /*\
             * Paper.toDataURL
             [ method ]
             **
             * Returns SVG code for the @Paper as Data URI string.
             = (string) Data URI string
            \*/
            proto.toDataURL = function () {
                if (window && window.btoa) {
                    return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(this)));
                }
            };
            /*\
             * Paper.clear
             [ method ]
             **
             * Removes all child nodes of the paper, except <defs>.
            \*/
            proto.clear = function () {
                var node = this.node.firstChild,
                    next;
                while (node) {
                    next = node.nextSibling;
                    if (node.tagName != "defs") {
                        node.parentNode.removeChild(node);
                    } else {
                        proto.clear.call({ node: node });
                    }
                    node = next;
                }
            };
        })();
    });
    // Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
    // 
    // Licensed under the Apache License, Version 2.0 (the "License");
    // you may not use this file except in compliance with the License.
    // You may obtain a copy of the License at
    // 
    // http://www.apache.org/licenses/LICENSE-2.0
    // 
    // Unless required by applicable law or agreed to in writing, software
    // distributed under the License is distributed on an "AS IS" BASIS,
    // WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    // See the License for the specific language governing permissions and
    // limitations under the License.
    Snap.plugin(function (Snap, Element, Paper, glob) {
        var elproto = Element.prototype,
            is = Snap.is,
            clone = Snap._.clone,
            has = "hasOwnProperty",
            p2s = /,?([a-z]),?/gi,
            toFloat = parseFloat,
            math = Math,
            PI = math.PI,
            mmin = math.min,
            mmax = math.max,
            pow = math.pow,
            abs = math.abs;
        function paths(ps) {
            var p = paths.ps = paths.ps || {};
            if (p[ps]) {
                p[ps].sleep = 100;
            } else {
                p[ps] = {
                    sleep: 100
                };
            }
            setTimeout(function () {
                for (var key in p) {
                    if (p[has](key) && key != ps) {
                        p[key].sleep--;
                        !p[key].sleep && delete p[key];
                    }
                }
            });
            return p[ps];
        }
        function box(x, y, width, height) {
            if (x == null) {
                x = y = width = height = 0;
            }
            if (y == null) {
                y = x.y;
                width = x.width;
                height = x.height;
                x = x.x;
            }
            return {
                x: x,
                y: y,
                width: width,
                w: width,
                height: height,
                h: height,
                x2: x + width,
                y2: y + height,
                cx: x + width / 2,
                cy: y + height / 2,
                r1: math.min(width, height) / 2,
                r2: math.max(width, height) / 2,
                r0: math.sqrt(width * width + height * height) / 2,
                path: rectPath(x, y, width, height),
                vb: [x, y, width, height].join(" ")
            };
        }
        function toString() {
            return this.join(",").replace(p2s, "$1");
        }
        function pathClone(pathArray) {
            var res = clone(pathArray);
            res.toString = toString;
            return res;
        }
        function getPointAtSegmentLength(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, length) {
            if (length == null) {
                return bezlen(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y);
            } else {
                return findDotsAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, getTotLen(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, length));
            }
        }
        function getLengthFactory(istotal, subpath) {
            function O(val) {
                return +(+val).toFixed(3);
            }
            return Snap._.cacher(function (path, length, onlystart) {
                if (path instanceof Element) {
                    path = path.attr("d");
                }
                path = path2curve(path);
                var x,
                    y,
                    p,
                    l,
                    sp = "",
                    subpaths = {},
                    point,
                    len = 0;
                for (var i = 0, ii = path.length; i < ii; i++) {
                    p = path[i];
                    if (p[0] == "M") {
                        x = +p[1];
                        y = +p[2];
                    } else {
                        l = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6]);
                        if (len + l > length) {
                            if (subpath && !subpaths.start) {
                                point = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6], length - len);
                                sp += ["C" + O(point.start.x), O(point.start.y), O(point.m.x), O(point.m.y), O(point.x), O(point.y)];
                                if (onlystart) {
                                    return sp;
                                }
                                subpaths.start = sp;
                                sp = ["M" + O(point.x), O(point.y) + "C" + O(point.n.x), O(point.n.y), O(point.end.x), O(point.end.y), O(p[5]), O(p[6])].join();
                                len += l;
                                x = +p[5];
                                y = +p[6];
                                continue;
                            }
                            if (!istotal && !subpath) {
                                point = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6], length - len);
                                return point;
                            }
                        }
                        len += l;
                        x = +p[5];
                        y = +p[6];
                    }
                    sp += p.shift() + p;
                }
                subpaths.end = sp;
                point = istotal ? len : subpath ? subpaths : findDotsAtSegment(x, y, p[0], p[1], p[2], p[3], p[4], p[5], 1);
                return point;
            }, null, Snap._.clone);
        }
        var getTotalLength = getLengthFactory(1),
            getPointAtLength = getLengthFactory(),
            getSubpathsAtLength = getLengthFactory(0, 1);
        function findDotsAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) {
            var t1 = 1 - t,
                t13 = pow(t1, 3),
                t12 = pow(t1, 2),
                t2 = t * t,
                t3 = t2 * t,
                x = t13 * p1x + t12 * 3 * t * c1x + t1 * 3 * t * t * c2x + t3 * p2x,
                y = t13 * p1y + t12 * 3 * t * c1y + t1 * 3 * t * t * c2y + t3 * p2y,
                mx = p1x + 2 * t * (c1x - p1x) + t2 * (c2x - 2 * c1x + p1x),
                my = p1y + 2 * t * (c1y - p1y) + t2 * (c2y - 2 * c1y + p1y),
                nx = c1x + 2 * t * (c2x - c1x) + t2 * (p2x - 2 * c2x + c1x),
                ny = c1y + 2 * t * (c2y - c1y) + t2 * (p2y - 2 * c2y + c1y),
                ax = t1 * p1x + t * c1x,
                ay = t1 * p1y + t * c1y,
                cx = t1 * c2x + t * p2x,
                cy = t1 * c2y + t * p2y,
                alpha = 90 - math.atan2(mx - nx, my - ny) * 180 / PI;
            // (mx > nx || my < ny) && (alpha += 180);
            return {
                x: x,
                y: y,
                m: { x: mx, y: my },
                n: { x: nx, y: ny },
                start: { x: ax, y: ay },
                end: { x: cx, y: cy },
                alpha: alpha
            };
        }
        function bezierBBox(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y) {
            if (!Snap.is(p1x, "array")) {
                p1x = [p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y];
            }
            var bbox = curveDim.apply(null, p1x);
            return box(bbox.min.x, bbox.min.y, bbox.max.x - bbox.min.x, bbox.max.y - bbox.min.y);
        }
        function isPointInsideBBox(bbox, x, y) {
            return x >= bbox.x && x <= bbox.x + bbox.width && y >= bbox.y && y <= bbox.y + bbox.height;
        }
        function isBBoxIntersect(bbox1, bbox2) {
            bbox1 = box(bbox1);
            bbox2 = box(bbox2);
            return isPointInsideBBox(bbox2, bbox1.x, bbox1.y) || isPointInsideBBox(bbox2, bbox1.x2, bbox1.y) || isPointInsideBBox(bbox2, bbox1.x, bbox1.y2) || isPointInsideBBox(bbox2, bbox1.x2, bbox1.y2) || isPointInsideBBox(bbox1, bbox2.x, bbox2.y) || isPointInsideBBox(bbox1, bbox2.x2, bbox2.y) || isPointInsideBBox(bbox1, bbox2.x, bbox2.y2) || isPointInsideBBox(bbox1, bbox2.x2, bbox2.y2) || (bbox1.x < bbox2.x2 && bbox1.x > bbox2.x || bbox2.x < bbox1.x2 && bbox2.x > bbox1.x) && (bbox1.y < bbox2.y2 && bbox1.y > bbox2.y || bbox2.y < bbox1.y2 && bbox2.y > bbox1.y);
        }
        function base3(t, p1, p2, p3, p4) {
            var t1 = -3 * p1 + 9 * p2 - 9 * p3 + 3 * p4,
                t2 = t * t1 + 6 * p1 - 12 * p2 + 6 * p3;
            return t * t2 - 3 * p1 + 3 * p2;
        }
        function bezlen(x1, y1, x2, y2, x3, y3, x4, y4, z) {
            if (z == null) {
                z = 1;
            }
            z = z > 1 ? 1 : z < 0 ? 0 : z;
            var z2 = z / 2,
                n = 12,
                Tvalues = [-.1252, .1252, -.3678, .3678, -.5873, .5873, -.7699, .7699, -.9041, .9041, -.9816, .9816],
                Cvalues = [0.2491, 0.2491, 0.2335, 0.2335, 0.2032, 0.2032, 0.1601, 0.1601, 0.1069, 0.1069, 0.0472, 0.0472],
                sum = 0;
            for (var i = 0; i < n; i++) {
                var ct = z2 * Tvalues[i] + z2,
                    xbase = base3(ct, x1, x2, x3, x4),
                    ybase = base3(ct, y1, y2, y3, y4),
                    comb = xbase * xbase + ybase * ybase;
                sum += Cvalues[i] * math.sqrt(comb);
            }
            return z2 * sum;
        }
        function getTotLen(x1, y1, x2, y2, x3, y3, x4, y4, ll) {
            if (ll < 0 || bezlen(x1, y1, x2, y2, x3, y3, x4, y4) < ll) {
                return;
            }
            var t = 1,
                step = t / 2,
                t2 = t - step,
                l,
                e = .01;
            l = bezlen(x1, y1, x2, y2, x3, y3, x4, y4, t2);
            while (abs(l - ll) > e) {
                step /= 2;
                t2 += (l < ll ? 1 : -1) * step;
                l = bezlen(x1, y1, x2, y2, x3, y3, x4, y4, t2);
            }
            return t2;
        }
        function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
            if (mmax(x1, x2) < mmin(x3, x4) || mmin(x1, x2) > mmax(x3, x4) || mmax(y1, y2) < mmin(y3, y4) || mmin(y1, y2) > mmax(y3, y4)) {
                return;
            }
            var nx = (x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4),
                ny = (x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4),
                denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
            if (!denominator) {
                return;
            }
            var px = nx / denominator,
                py = ny / denominator,
                px2 = +px.toFixed(2),
                py2 = +py.toFixed(2);
            if (px2 < +mmin(x1, x2).toFixed(2) || px2 > +mmax(x1, x2).toFixed(2) || px2 < +mmin(x3, x4).toFixed(2) || px2 > +mmax(x3, x4).toFixed(2) || py2 < +mmin(y1, y2).toFixed(2) || py2 > +mmax(y1, y2).toFixed(2) || py2 < +mmin(y3, y4).toFixed(2) || py2 > +mmax(y3, y4).toFixed(2)) {
                return;
            }
            return { x: px, y: py };
        }
        function inter(bez1, bez2) {
            return interHelper(bez1, bez2);
        }
        function interCount(bez1, bez2) {
            return interHelper(bez1, bez2, 1);
        }
        function interHelper(bez1, bez2, justCount) {
            var bbox1 = bezierBBox(bez1),
                bbox2 = bezierBBox(bez2);
            if (!isBBoxIntersect(bbox1, bbox2)) {
                return justCount ? 0 : [];
            }
            var l1 = bezlen.apply(0, bez1),
                l2 = bezlen.apply(0, bez2),
                n1 = ~~(l1 / 8),
                n2 = ~~(l2 / 8),
                dots1 = [],
                dots2 = [],
                xy = {},
                res = justCount ? 0 : [];
            for (var i = 0; i < n1 + 1; i++) {
                var p = findDotsAtSegment.apply(0, bez1.concat(i / n1));
                dots1.push({ x: p.x, y: p.y, t: i / n1 });
            }
            for (i = 0; i < n2 + 1; i++) {
                p = findDotsAtSegment.apply(0, bez2.concat(i / n2));
                dots2.push({ x: p.x, y: p.y, t: i / n2 });
            }
            for (i = 0; i < n1; i++) {
                for (var j = 0; j < n2; j++) {
                    var di = dots1[i],
                        di1 = dots1[i + 1],
                        dj = dots2[j],
                        dj1 = dots2[j + 1],
                        ci = abs(di1.x - di.x) < .001 ? "y" : "x",
                        cj = abs(dj1.x - dj.x) < .001 ? "y" : "x",
                        is = intersect(di.x, di.y, di1.x, di1.y, dj.x, dj.y, dj1.x, dj1.y);
                    if (is) {
                        if (xy[is.x.toFixed(4)] == is.y.toFixed(4)) {
                            continue;
                        }
                        xy[is.x.toFixed(4)] = is.y.toFixed(4);
                        var t1 = di.t + abs((is[ci] - di[ci]) / (di1[ci] - di[ci])) * (di1.t - di.t),
                            t2 = dj.t + abs((is[cj] - dj[cj]) / (dj1[cj] - dj[cj])) * (dj1.t - dj.t);
                        if (t1 >= 0 && t1 <= 1 && t2 >= 0 && t2 <= 1) {
                            if (justCount) {
                                res++;
                            } else {
                                res.push({
                                    x: is.x,
                                    y: is.y,
                                    t1: t1,
                                    t2: t2
                                });
                            }
                        }
                    }
                }
            }
            return res;
        }
        function pathIntersection(path1, path2) {
            return interPathHelper(path1, path2);
        }
        function pathIntersectionNumber(path1, path2) {
            return interPathHelper(path1, path2, 1);
        }
        function interPathHelper(path1, path2, justCount) {
            path1 = path2curve(path1);
            path2 = path2curve(path2);
            var x1,
                y1,
                x2,
                y2,
                x1m,
                y1m,
                x2m,
                y2m,
                bez1,
                bez2,
                res = justCount ? 0 : [];
            for (var i = 0, ii = path1.length; i < ii; i++) {
                var pi = path1[i];
                if (pi[0] == "M") {
                    x1 = x1m = pi[1];
                    y1 = y1m = pi[2];
                } else {
                    if (pi[0] == "C") {
                        bez1 = [x1, y1].concat(pi.slice(1));
                        x1 = bez1[6];
                        y1 = bez1[7];
                    } else {
                        bez1 = [x1, y1, x1, y1, x1m, y1m, x1m, y1m];
                        x1 = x1m;
                        y1 = y1m;
                    }
                    for (var j = 0, jj = path2.length; j < jj; j++) {
                        var pj = path2[j];
                        if (pj[0] == "M") {
                            x2 = x2m = pj[1];
                            y2 = y2m = pj[2];
                        } else {
                            if (pj[0] == "C") {
                                bez2 = [x2, y2].concat(pj.slice(1));
                                x2 = bez2[6];
                                y2 = bez2[7];
                            } else {
                                bez2 = [x2, y2, x2, y2, x2m, y2m, x2m, y2m];
                                x2 = x2m;
                                y2 = y2m;
                            }
                            var intr = interHelper(bez1, bez2, justCount);
                            if (justCount) {
                                res += intr;
                            } else {
                                for (var k = 0, kk = intr.length; k < kk; k++) {
                                    intr[k].segment1 = i;
                                    intr[k].segment2 = j;
                                    intr[k].bez1 = bez1;
                                    intr[k].bez2 = bez2;
                                }
                                res = res.concat(intr);
                            }
                        }
                    }
                }
            }
            return res;
        }
        function isPointInsidePath(path, x, y) {
            var bbox = pathBBox(path);
            return isPointInsideBBox(bbox, x, y) && interPathHelper(path, [["M", x, y], ["H", bbox.x2 + 10]], 1) % 2 == 1;
        }
        function pathBBox(path) {
            var pth = paths(path);
            if (pth.bbox) {
                return clone(pth.bbox);
            }
            if (!path) {
                return box();
            }
            path = path2curve(path);
            var x = 0,
                y = 0,
                X = [],
                Y = [],
                p;
            for (var i = 0, ii = path.length; i < ii; i++) {
                p = path[i];
                if (p[0] == "M") {
                    x = p[1];
                    y = p[2];
                    X.push(x);
                    Y.push(y);
                } else {
                    var dim = curveDim(x, y, p[1], p[2], p[3], p[4], p[5], p[6]);
                    X = X.concat(dim.min.x, dim.max.x);
                    Y = Y.concat(dim.min.y, dim.max.y);
                    x = p[5];
                    y = p[6];
                }
            }
            var xmin = mmin.apply(0, X),
                ymin = mmin.apply(0, Y),
                xmax = mmax.apply(0, X),
                ymax = mmax.apply(0, Y),
                bb = box(xmin, ymin, xmax - xmin, ymax - ymin);
            pth.bbox = clone(bb);
            return bb;
        }
        function rectPath(x, y, w, h, r) {
            if (r) {
                return [["M", +x + +r, y], ["l", w - r * 2, 0], ["a", r, r, 0, 0, 1, r, r], ["l", 0, h - r * 2], ["a", r, r, 0, 0, 1, -r, r], ["l", r * 2 - w, 0], ["a", r, r, 0, 0, 1, -r, -r], ["l", 0, r * 2 - h], ["a", r, r, 0, 0, 1, r, -r], ["z"]];
            }
            var res = [["M", x, y], ["l", w, 0], ["l", 0, h], ["l", -w, 0], ["z"]];
            res.toString = toString;
            return res;
        }
        function ellipsePath(x, y, rx, ry, a) {
            if (a == null && ry == null) {
                ry = rx;
            }
            x = +x;
            y = +y;
            rx = +rx;
            ry = +ry;
            if (a != null) {
                var rad = Math.PI / 180,
                    x1 = x + rx * Math.cos(-ry * rad),
                    x2 = x + rx * Math.cos(-a * rad),
                    y1 = y + rx * Math.sin(-ry * rad),
                    y2 = y + rx * Math.sin(-a * rad),
                    res = [["M", x1, y1], ["A", rx, rx, 0, +(a - ry > 180), 0, x2, y2]];
            } else {
                res = [["M", x, y], ["m", 0, -ry], ["a", rx, ry, 0, 1, 1, 0, 2 * ry], ["a", rx, ry, 0, 1, 1, 0, -2 * ry], ["z"]];
            }
            res.toString = toString;
            return res;
        }
        var unit2px = Snap._unit2px,
            getPath = {
            path: function path(el) {
                return el.attr("path");
            },
            circle: function circle(el) {
                var attr = unit2px(el);
                return ellipsePath(attr.cx, attr.cy, attr.r);
            },
            ellipse: function ellipse(el) {
                var attr = unit2px(el);
                return ellipsePath(attr.cx || 0, attr.cy || 0, attr.rx, attr.ry);
            },
            rect: function rect(el) {
                var attr = unit2px(el);
                return rectPath(attr.x || 0, attr.y || 0, attr.width, attr.height, attr.rx, attr.ry);
            },
            image: function image(el) {
                var attr = unit2px(el);
                return rectPath(attr.x || 0, attr.y || 0, attr.width, attr.height);
            },
            line: function line(el) {
                return "M" + [el.attr("x1") || 0, el.attr("y1") || 0, el.attr("x2"), el.attr("y2")];
            },
            polyline: function polyline(el) {
                return "M" + el.attr("points");
            },
            polygon: function polygon(el) {
                return "M" + el.attr("points") + "z";
            },
            deflt: function deflt(el) {
                var bbox = el.node.getBBox();
                return rectPath(bbox.x, bbox.y, bbox.width, bbox.height);
            }
        };
        function pathToRelative(pathArray) {
            var pth = paths(pathArray),
                lowerCase = String.prototype.toLowerCase;
            if (pth.rel) {
                return pathClone(pth.rel);
            }
            if (!Snap.is(pathArray, "array") || !Snap.is(pathArray && pathArray[0], "array")) {
                pathArray = Snap.parsePathString(pathArray);
            }
            var res = [],
                x = 0,
                y = 0,
                mx = 0,
                my = 0,
                start = 0;
            if (pathArray[0][0] == "M") {
                x = pathArray[0][1];
                y = pathArray[0][2];
                mx = x;
                my = y;
                start++;
                res.push(["M", x, y]);
            }
            for (var i = start, ii = pathArray.length; i < ii; i++) {
                var r = res[i] = [],
                    pa = pathArray[i];
                if (pa[0] != lowerCase.call(pa[0])) {
                    r[0] = lowerCase.call(pa[0]);
                    switch (r[0]) {
                        case "a":
                            r[1] = pa[1];
                            r[2] = pa[2];
                            r[3] = pa[3];
                            r[4] = pa[4];
                            r[5] = pa[5];
                            r[6] = +(pa[6] - x).toFixed(3);
                            r[7] = +(pa[7] - y).toFixed(3);
                            break;
                        case "v":
                            r[1] = +(pa[1] - y).toFixed(3);
                            break;
                        case "m":
                            mx = pa[1];
                            my = pa[2];
                        default:
                            for (var j = 1, jj = pa.length; j < jj; j++) {
                                r[j] = +(pa[j] - (j % 2 ? x : y)).toFixed(3);
                            }
                    }
                } else {
                    r = res[i] = [];
                    if (pa[0] == "m") {
                        mx = pa[1] + x;
                        my = pa[2] + y;
                    }
                    for (var k = 0, kk = pa.length; k < kk; k++) {
                        res[i][k] = pa[k];
                    }
                }
                var len = res[i].length;
                switch (res[i][0]) {
                    case "z":
                        x = mx;
                        y = my;
                        break;
                    case "h":
                        x += +res[i][len - 1];
                        break;
                    case "v":
                        y += +res[i][len - 1];
                        break;
                    default:
                        x += +res[i][len - 2];
                        y += +res[i][len - 1];
                }
            }
            res.toString = toString;
            pth.rel = pathClone(res);
            return res;
        }
        function pathToAbsolute(pathArray) {
            var pth = paths(pathArray);
            if (pth.abs) {
                return pathClone(pth.abs);
            }
            if (!is(pathArray, "array") || !is(pathArray && pathArray[0], "array")) {
                // rough assumption
                pathArray = Snap.parsePathString(pathArray);
            }
            if (!pathArray || !pathArray.length) {
                return [["M", 0, 0]];
            }
            var res = [],
                x = 0,
                y = 0,
                mx = 0,
                my = 0,
                start = 0,
                pa0;
            if (pathArray[0][0] == "M") {
                x = +pathArray[0][1];
                y = +pathArray[0][2];
                mx = x;
                my = y;
                start++;
                res[0] = ["M", x, y];
            }
            var crz = pathArray.length == 3 && pathArray[0][0] == "M" && pathArray[1][0].toUpperCase() == "R" && pathArray[2][0].toUpperCase() == "Z";
            for (var r, pa, i = start, ii = pathArray.length; i < ii; i++) {
                res.push(r = []);
                pa = pathArray[i];
                pa0 = pa[0];
                if (pa0 != pa0.toUpperCase()) {
                    r[0] = pa0.toUpperCase();
                    switch (r[0]) {
                        case "A":
                            r[1] = pa[1];
                            r[2] = pa[2];
                            r[3] = pa[3];
                            r[4] = pa[4];
                            r[5] = pa[5];
                            r[6] = +pa[6] + x;
                            r[7] = +pa[7] + y;
                            break;
                        case "V":
                            r[1] = +pa[1] + y;
                            break;
                        case "H":
                            r[1] = +pa[1] + x;
                            break;
                        case "R":
                            var dots = [x, y].concat(pa.slice(1));
                            for (var j = 2, jj = dots.length; j < jj; j++) {
                                dots[j] = +dots[j] + x;
                                dots[++j] = +dots[j] + y;
                            }
                            res.pop();
                            res = res.concat(catmullRom2bezier(dots, crz));
                            break;
                        case "O":
                            res.pop();
                            dots = ellipsePath(x, y, pa[1], pa[2]);
                            dots.push(dots[0]);
                            res = res.concat(dots);
                            break;
                        case "U":
                            res.pop();
                            res = res.concat(ellipsePath(x, y, pa[1], pa[2], pa[3]));
                            r = ["U"].concat(res[res.length - 1].slice(-2));
                            break;
                        case "M":
                            mx = +pa[1] + x;
                            my = +pa[2] + y;
                        default:
                            for (j = 1, jj = pa.length; j < jj; j++) {
                                r[j] = +pa[j] + (j % 2 ? x : y);
                            }
                    }
                } else if (pa0 == "R") {
                    dots = [x, y].concat(pa.slice(1));
                    res.pop();
                    res = res.concat(catmullRom2bezier(dots, crz));
                    r = ["R"].concat(pa.slice(-2));
                } else if (pa0 == "O") {
                    res.pop();
                    dots = ellipsePath(x, y, pa[1], pa[2]);
                    dots.push(dots[0]);
                    res = res.concat(dots);
                } else if (pa0 == "U") {
                    res.pop();
                    res = res.concat(ellipsePath(x, y, pa[1], pa[2], pa[3]));
                    r = ["U"].concat(res[res.length - 1].slice(-2));
                } else {
                    for (var k = 0, kk = pa.length; k < kk; k++) {
                        r[k] = pa[k];
                    }
                }
                pa0 = pa0.toUpperCase();
                if (pa0 != "O") {
                    switch (r[0]) {
                        case "Z":
                            x = +mx;
                            y = +my;
                            break;
                        case "H":
                            x = r[1];
                            break;
                        case "V":
                            y = r[1];
                            break;
                        case "M":
                            mx = r[r.length - 2];
                            my = r[r.length - 1];
                        default:
                            x = r[r.length - 2];
                            y = r[r.length - 1];
                    }
                }
            }
            res.toString = toString;
            pth.abs = pathClone(res);
            return res;
        }
        function l2c(x1, y1, x2, y2) {
            return [x1, y1, x2, y2, x2, y2];
        }
        function q2c(x1, y1, ax, ay, x2, y2) {
            var _13 = 1 / 3,
                _23 = 2 / 3;
            return [_13 * x1 + _23 * ax, _13 * y1 + _23 * ay, _13 * x2 + _23 * ax, _13 * y2 + _23 * ay, x2, y2];
        }
        function a2c(x1, y1, rx, ry, angle, large_arc_flag, sweep_flag, x2, y2, recursive) {
            // for more information of where this math came from visit:
            // http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
            var _120 = PI * 120 / 180,
                rad = PI / 180 * (+angle || 0),
                res = [],
                xy,
                rotate = Snap._.cacher(function (x, y, rad) {
                var X = x * math.cos(rad) - y * math.sin(rad),
                    Y = x * math.sin(rad) + y * math.cos(rad);
                return { x: X, y: Y };
            });
            if (!recursive) {
                xy = rotate(x1, y1, -rad);
                x1 = xy.x;
                y1 = xy.y;
                xy = rotate(x2, y2, -rad);
                x2 = xy.x;
                y2 = xy.y;
                var cos = math.cos(PI / 180 * angle),
                    sin = math.sin(PI / 180 * angle),
                    x = (x1 - x2) / 2,
                    y = (y1 - y2) / 2;
                var h = x * x / (rx * rx) + y * y / (ry * ry);
                if (h > 1) {
                    h = math.sqrt(h);
                    rx = h * rx;
                    ry = h * ry;
                }
                var rx2 = rx * rx,
                    ry2 = ry * ry,
                    k = (large_arc_flag == sweep_flag ? -1 : 1) * math.sqrt(abs((rx2 * ry2 - rx2 * y * y - ry2 * x * x) / (rx2 * y * y + ry2 * x * x))),
                    cx = k * rx * y / ry + (x1 + x2) / 2,
                    cy = k * -ry * x / rx + (y1 + y2) / 2,
                    f1 = math.asin(((y1 - cy) / ry).toFixed(9)),
                    f2 = math.asin(((y2 - cy) / ry).toFixed(9));
                f1 = x1 < cx ? PI - f1 : f1;
                f2 = x2 < cx ? PI - f2 : f2;
                f1 < 0 && (f1 = PI * 2 + f1);
                f2 < 0 && (f2 = PI * 2 + f2);
                if (sweep_flag && f1 > f2) {
                    f1 = f1 - PI * 2;
                }
                if (!sweep_flag && f2 > f1) {
                    f2 = f2 - PI * 2;
                }
            } else {
                f1 = recursive[0];
                f2 = recursive[1];
                cx = recursive[2];
                cy = recursive[3];
            }
            var df = f2 - f1;
            if (abs(df) > _120) {
                var f2old = f2,
                    x2old = x2,
                    y2old = y2;
                f2 = f1 + _120 * (sweep_flag && f2 > f1 ? 1 : -1);
                x2 = cx + rx * math.cos(f2);
                y2 = cy + ry * math.sin(f2);
                res = a2c(x2, y2, rx, ry, angle, 0, sweep_flag, x2old, y2old, [f2, f2old, cx, cy]);
            }
            df = f2 - f1;
            var c1 = math.cos(f1),
                s1 = math.sin(f1),
                c2 = math.cos(f2),
                s2 = math.sin(f2),
                t = math.tan(df / 4),
                hx = 4 / 3 * rx * t,
                hy = 4 / 3 * ry * t,
                m1 = [x1, y1],
                m2 = [x1 + hx * s1, y1 - hy * c1],
                m3 = [x2 + hx * s2, y2 - hy * c2],
                m4 = [x2, y2];
            m2[0] = 2 * m1[0] - m2[0];
            m2[1] = 2 * m1[1] - m2[1];
            if (recursive) {
                return [m2, m3, m4].concat(res);
            } else {
                res = [m2, m3, m4].concat(res).join().split(",");
                var newres = [];
                for (var i = 0, ii = res.length; i < ii; i++) {
                    newres[i] = i % 2 ? rotate(res[i - 1], res[i], rad).y : rotate(res[i], res[i + 1], rad).x;
                }
                return newres;
            }
        }
        function findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) {
            var t1 = 1 - t;
            return {
                x: pow(t1, 3) * p1x + pow(t1, 2) * 3 * t * c1x + t1 * 3 * t * t * c2x + pow(t, 3) * p2x,
                y: pow(t1, 3) * p1y + pow(t1, 2) * 3 * t * c1y + t1 * 3 * t * t * c2y + pow(t, 3) * p2y
            };
        }
        // Returns bounding box of cubic bezier curve.
        // Source: http://blog.hackers-cafe.net/2009/06/how-to-calculate-bezier-curves-bounding.html
        // Original version: NISHIO Hirokazu
        // Modifications: https://github.com/timo22345
        function curveDim(x0, y0, x1, y1, x2, y2, x3, y3) {
            var tvalues = [],
                bounds = [[], []],
                a,
                b,
                c,
                t,
                t1,
                t2,
                b2ac,
                sqrtb2ac;
            for (var i = 0; i < 2; ++i) {
                if (i == 0) {
                    b = 6 * x0 - 12 * x1 + 6 * x2;
                    a = -3 * x0 + 9 * x1 - 9 * x2 + 3 * x3;
                    c = 3 * x1 - 3 * x0;
                } else {
                    b = 6 * y0 - 12 * y1 + 6 * y2;
                    a = -3 * y0 + 9 * y1 - 9 * y2 + 3 * y3;
                    c = 3 * y1 - 3 * y0;
                }
                if (abs(a) < 1e-12) {
                    if (abs(b) < 1e-12) {
                        continue;
                    }
                    t = -c / b;
                    if (0 < t && t < 1) {
                        tvalues.push(t);
                    }
                    continue;
                }
                b2ac = b * b - 4 * c * a;
                sqrtb2ac = math.sqrt(b2ac);
                if (b2ac < 0) {
                    continue;
                }
                t1 = (-b + sqrtb2ac) / (2 * a);
                if (0 < t1 && t1 < 1) {
                    tvalues.push(t1);
                }
                t2 = (-b - sqrtb2ac) / (2 * a);
                if (0 < t2 && t2 < 1) {
                    tvalues.push(t2);
                }
            }
            var x,
                y,
                j = tvalues.length,
                jlen = j,
                mt;
            while (j--) {
                t = tvalues[j];
                mt = 1 - t;
                bounds[0][j] = mt * mt * mt * x0 + 3 * mt * mt * t * x1 + 3 * mt * t * t * x2 + t * t * t * x3;
                bounds[1][j] = mt * mt * mt * y0 + 3 * mt * mt * t * y1 + 3 * mt * t * t * y2 + t * t * t * y3;
            }
            bounds[0][jlen] = x0;
            bounds[1][jlen] = y0;
            bounds[0][jlen + 1] = x3;
            bounds[1][jlen + 1] = y3;
            bounds[0].length = bounds[1].length = jlen + 2;
            return {
                min: { x: mmin.apply(0, bounds[0]), y: mmin.apply(0, bounds[1]) },
                max: { x: mmax.apply(0, bounds[0]), y: mmax.apply(0, bounds[1]) }
            };
        }
        function path2curve(path, path2) {
            var pth = !path2 && paths(path);
            if (!path2 && pth.curve) {
                return pathClone(pth.curve);
            }
            var p = pathToAbsolute(path),
                p2 = path2 && pathToAbsolute(path2),
                attrs = { x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null },
                attrs2 = { x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null },
                processPath = function processPath(path, d, pcom) {
                var nx, ny;
                if (!path) {
                    return ["C", d.x, d.y, d.x, d.y, d.x, d.y];
                }
                !(path[0] in { T: 1, Q: 1 }) && (d.qx = d.qy = null);
                switch (path[0]) {
                    case "M":
                        d.X = path[1];
                        d.Y = path[2];
                        break;
                    case "A":
                        path = ["C"].concat(a2c.apply(0, [d.x, d.y].concat(path.slice(1))));
                        break;
                    case "S":
                        if (pcom == "C" || pcom == "S") {
                            // In "S" case we have to take into account, if the previous command is C/S.
                            nx = d.x * 2 - d.bx; // And reflect the previous
                            ny = d.y * 2 - d.by; // command's control point relative to the current point.
                        } else {
                            // or some else or nothing
                            nx = d.x;
                            ny = d.y;
                        }
                        path = ["C", nx, ny].concat(path.slice(1));
                        break;
                    case "T":
                        if (pcom == "Q" || pcom == "T") {
                            // In "T" case we have to take into account, if the previous command is Q/T.
                            d.qx = d.x * 2 - d.qx; // And make a reflection similar
                            d.qy = d.y * 2 - d.qy; // to case "S".
                        } else {
                            // or something else or nothing
                            d.qx = d.x;
                            d.qy = d.y;
                        }
                        path = ["C"].concat(q2c(d.x, d.y, d.qx, d.qy, path[1], path[2]));
                        break;
                    case "Q":
                        d.qx = path[1];
                        d.qy = path[2];
                        path = ["C"].concat(q2c(d.x, d.y, path[1], path[2], path[3], path[4]));
                        break;
                    case "L":
                        path = ["C"].concat(l2c(d.x, d.y, path[1], path[2]));
                        break;
                    case "H":
                        path = ["C"].concat(l2c(d.x, d.y, path[1], d.y));
                        break;
                    case "V":
                        path = ["C"].concat(l2c(d.x, d.y, d.x, path[1]));
                        break;
                    case "Z":
                        path = ["C"].concat(l2c(d.x, d.y, d.X, d.Y));
                        break;
                }
                return path;
            },
                fixArc = function fixArc(pp, i) {
                if (pp[i].length > 7) {
                    pp[i].shift();
                    var pi = pp[i];
                    while (pi.length) {
                        pcoms1[i] = "A"; // if created multiple C:s, their original seg is saved
                        p2 && (pcoms2[i] = "A"); // the same as above
                        pp.splice(i++, 0, ["C"].concat(pi.splice(0, 6)));
                    }
                    pp.splice(i, 1);
                    ii = mmax(p.length, p2 && p2.length || 0);
                }
            },
                fixM = function fixM(path1, path2, a1, a2, i) {
                if (path1 && path2 && path1[i][0] == "M" && path2[i][0] != "M") {
                    path2.splice(i, 0, ["M", a2.x, a2.y]);
                    a1.bx = 0;
                    a1.by = 0;
                    a1.x = path1[i][1];
                    a1.y = path1[i][2];
                    ii = mmax(p.length, p2 && p2.length || 0);
                }
            },
                pcoms1 = [],
                // path commands of original path p
            pcoms2 = [],
                // path commands of original path p2
            pfirst = "",
                // temporary holder for original path command
            pcom = ""; // holder for previous path command of original path
            for (var i = 0, ii = mmax(p.length, p2 && p2.length || 0); i < ii; i++) {
                p[i] && (pfirst = p[i][0]); // save current path command
                if (pfirst != "C") // C is not saved yet, because it may be result of conversion
                    {
                        pcoms1[i] = pfirst; // Save current path command
                        i && (pcom = pcoms1[i - 1]); // Get previous path command pcom
                    }
                p[i] = processPath(p[i], attrs, pcom); // Previous path command is inputted to processPath
                if (pcoms1[i] != "A" && pfirst == "C") pcoms1[i] = "C"; // A is the only command
                // which may produce multiple C:s
                // so we have to make sure that C is also C in original path
                fixArc(p, i); // fixArc adds also the right amount of A:s to pcoms1
                if (p2) {
                    // the same procedures is done to p2
                    p2[i] && (pfirst = p2[i][0]);
                    if (pfirst != "C") {
                        pcoms2[i] = pfirst;
                        i && (pcom = pcoms2[i - 1]);
                    }
                    p2[i] = processPath(p2[i], attrs2, pcom);
                    if (pcoms2[i] != "A" && pfirst == "C") {
                        pcoms2[i] = "C";
                    }
                    fixArc(p2, i);
                }
                fixM(p, p2, attrs, attrs2, i);
                fixM(p2, p, attrs2, attrs, i);
                var seg = p[i],
                    seg2 = p2 && p2[i],
                    seglen = seg.length,
                    seg2len = p2 && seg2.length;
                attrs.x = seg[seglen - 2];
                attrs.y = seg[seglen - 1];
                attrs.bx = toFloat(seg[seglen - 4]) || attrs.x;
                attrs.by = toFloat(seg[seglen - 3]) || attrs.y;
                attrs2.bx = p2 && (toFloat(seg2[seg2len - 4]) || attrs2.x);
                attrs2.by = p2 && (toFloat(seg2[seg2len - 3]) || attrs2.y);
                attrs2.x = p2 && seg2[seg2len - 2];
                attrs2.y = p2 && seg2[seg2len - 1];
            }
            if (!p2) {
                pth.curve = pathClone(p);
            }
            return p2 ? [p, p2] : p;
        }
        function mapPath(path, matrix) {
            if (!matrix) {
                return path;
            }
            var x, y, i, j, ii, jj, pathi;
            path = path2curve(path);
            for (i = 0, ii = path.length; i < ii; i++) {
                pathi = path[i];
                for (j = 1, jj = pathi.length; j < jj; j += 2) {
                    x = matrix.x(pathi[j], pathi[j + 1]);
                    y = matrix.y(pathi[j], pathi[j + 1]);
                    pathi[j] = x;
                    pathi[j + 1] = y;
                }
            }
            return path;
        }
        // http://schepers.cc/getting-to-the-point
        function catmullRom2bezier(crp, z) {
            var d = [];
            for (var i = 0, iLen = crp.length; iLen - 2 * !z > i; i += 2) {
                var p = [{ x: +crp[i - 2], y: +crp[i - 1] }, { x: +crp[i], y: +crp[i + 1] }, { x: +crp[i + 2], y: +crp[i + 3] }, { x: +crp[i + 4], y: +crp[i + 5] }];
                if (z) {
                    if (!i) {
                        p[0] = { x: +crp[iLen - 2], y: +crp[iLen - 1] };
                    } else if (iLen - 4 == i) {
                        p[3] = { x: +crp[0], y: +crp[1] };
                    } else if (iLen - 2 == i) {
                        p[2] = { x: +crp[0], y: +crp[1] };
                        p[3] = { x: +crp[2], y: +crp[3] };
                    }
                } else {
                    if (iLen - 4 == i) {
                        p[3] = p[2];
                    } else if (!i) {
                        p[0] = { x: +crp[i], y: +crp[i + 1] };
                    }
                }
                d.push(["C", (-p[0].x + 6 * p[1].x + p[2].x) / 6, (-p[0].y + 6 * p[1].y + p[2].y) / 6, (p[1].x + 6 * p[2].x - p[3].x) / 6, (p[1].y + 6 * p[2].y - p[3].y) / 6, p[2].x, p[2].y]);
            }
            return d;
        }
        // export
        Snap.path = paths;
        /*\
         * Snap.path.getTotalLength
         [ method ]
         **
         * Returns the length of the given path in pixels
         **
         - path (string) SVG path string
         **
         = (number) length
        \*/
        Snap.path.getTotalLength = getTotalLength;
        /*\
         * Snap.path.getPointAtLength
         [ method ]
         **
         * Returns the coordinates of the point located at the given length along the given path
         **
         - path (string) SVG path string
         - length (number) length, in pixels, from the start of the path, excluding non-rendering jumps
         **
         = (object) representation of the point:
         o {
         o     x: (number) x coordinate,
         o     y: (number) y coordinate,
         o     alpha: (number) angle of derivative
         o }
        \*/
        Snap.path.getPointAtLength = getPointAtLength;
        /*\
         * Snap.path.getSubpath
         [ method ]
         **
         * Returns the subpath of a given path between given start and end lengths
         **
         - path (string) SVG path string
         - from (number) length, in pixels, from the start of the path to the start of the segment
         - to (number) length, in pixels, from the start of the path to the end of the segment
         **
         = (string) path string definition for the segment
        \*/
        Snap.path.getSubpath = function (path, from, to) {
            if (this.getTotalLength(path) - to < 1e-6) {
                return getSubpathsAtLength(path, from).end;
            }
            var a = getSubpathsAtLength(path, to, 1);
            return from ? getSubpathsAtLength(a, from).end : a;
        };
        /*\
         * Element.getTotalLength
         [ method ]
         **
         * Returns the length of the path in pixels (only works for `path` elements)
         = (number) length
        \*/
        elproto.getTotalLength = function () {
            if (this.node.getTotalLength) {
                return this.node.getTotalLength();
            }
        };
        // SIERRA Element.getPointAtLength()/Element.getTotalLength(): If a <path> is broken into different segments, is the jump distance to the new coordinates set by the _M_ or _m_ commands calculated as part of the path's total length?
        /*\
         * Element.getPointAtLength
         [ method ]
         **
         * Returns coordinates of the point located at the given length on the given path (only works for `path` elements)
         **
         - length (number) length, in pixels, from the start of the path, excluding non-rendering jumps
         **
         = (object) representation of the point:
         o {
         o     x: (number) x coordinate,
         o     y: (number) y coordinate,
         o     alpha: (number) angle of derivative
         o }
        \*/
        elproto.getPointAtLength = function (length) {
            return getPointAtLength(this.attr("d"), length);
        };
        // SIERRA Element.getSubpath(): Similar to the problem for Element.getPointAtLength(). Unclear how this would work for a segmented path. Overall, the concept of _subpath_ and what I'm calling a _segment_ (series of non-_M_ or _Z_ commands) is unclear.
        /*\
         * Element.getSubpath
         [ method ]
         **
         * Returns subpath of a given element from given start and end lengths (only works for `path` elements)
         **
         - from (number) length, in pixels, from the start of the path to the start of the segment
         - to (number) length, in pixels, from the start of the path to the end of the segment
         **
         = (string) path string definition for the segment
        \*/
        elproto.getSubpath = function (from, to) {
            return Snap.path.getSubpath(this.attr("d"), from, to);
        };
        Snap._.box = box;
        /*\
         * Snap.path.findDotsAtSegment
         [ method ]
         **
         * Utility method
         **
         * Finds dot coordinates on the given cubic beziér curve at the given t
         - p1x (number) x of the first point of the curve
         - p1y (number) y of the first point of the curve
         - c1x (number) x of the first anchor of the curve
         - c1y (number) y of the first anchor of the curve
         - c2x (number) x of the second anchor of the curve
         - c2y (number) y of the second anchor of the curve
         - p2x (number) x of the second point of the curve
         - p2y (number) y of the second point of the curve
         - t (number) position on the curve (0..1)
         = (object) point information in format:
         o {
         o     x: (number) x coordinate of the point,
         o     y: (number) y coordinate of the point,
         o     m: {
         o         x: (number) x coordinate of the left anchor,
         o         y: (number) y coordinate of the left anchor
         o     },
         o     n: {
         o         x: (number) x coordinate of the right anchor,
         o         y: (number) y coordinate of the right anchor
         o     },
         o     start: {
         o         x: (number) x coordinate of the start of the curve,
         o         y: (number) y coordinate of the start of the curve
         o     },
         o     end: {
         o         x: (number) x coordinate of the end of the curve,
         o         y: (number) y coordinate of the end of the curve
         o     },
         o     alpha: (number) angle of the curve derivative at the point
         o }
        \*/
        Snap.path.findDotsAtSegment = findDotsAtSegment;
        /*\
         * Snap.path.bezierBBox
         [ method ]
         **
         * Utility method
         **
         * Returns the bounding box of a given cubic beziér curve
         - p1x (number) x of the first point of the curve
         - p1y (number) y of the first point of the curve
         - c1x (number) x of the first anchor of the curve
         - c1y (number) y of the first anchor of the curve
         - c2x (number) x of the second anchor of the curve
         - c2y (number) y of the second anchor of the curve
         - p2x (number) x of the second point of the curve
         - p2y (number) y of the second point of the curve
         * or
         - bez (array) array of six points for beziér curve
         = (object) bounding box
         o {
         o     x: (number) x coordinate of the left top point of the box,
         o     y: (number) y coordinate of the left top point of the box,
         o     x2: (number) x coordinate of the right bottom point of the box,
         o     y2: (number) y coordinate of the right bottom point of the box,
         o     width: (number) width of the box,
         o     height: (number) height of the box
         o }
        \*/
        Snap.path.bezierBBox = bezierBBox;
        /*\
         * Snap.path.isPointInsideBBox
         [ method ]
         **
         * Utility method
         **
         * Returns `true` if given point is inside bounding box
         - bbox (string) bounding box
         - x (string) x coordinate of the point
         - y (string) y coordinate of the point
         = (boolean) `true` if point is inside
        \*/
        Snap.path.isPointInsideBBox = isPointInsideBBox;
        Snap.closest = function (x, y, X, Y) {
            var r = 100,
                b = box(x - r / 2, y - r / 2, r, r),
                inside = [],
                getter = X[0].hasOwnProperty("x") ? function (i) {
                return {
                    x: X[i].x,
                    y: X[i].y
                };
            } : function (i) {
                return {
                    x: X[i],
                    y: Y[i]
                };
            },
                found = 0;
            while (r <= 1e6 && !found) {
                for (var i = 0, ii = X.length; i < ii; i++) {
                    var xy = getter(i);
                    if (isPointInsideBBox(b, xy.x, xy.y)) {
                        found++;
                        inside.push(xy);
                        break;
                    }
                }
                if (!found) {
                    r *= 2;
                    b = box(x - r / 2, y - r / 2, r, r);
                }
            }
            if (r == 1e6) {
                return;
            }
            var len = Infinity,
                res;
            for (i = 0, ii = inside.length; i < ii; i++) {
                var l = Snap.len(x, y, inside[i].x, inside[i].y);
                if (len > l) {
                    len = l;
                    inside[i].len = l;
                    res = inside[i];
                }
            }
            return res;
        };
        /*\
         * Snap.path.isBBoxIntersect
         [ method ]
         **
         * Utility method
         **
         * Returns `true` if two bounding boxes intersect
         - bbox1 (string) first bounding box
         - bbox2 (string) second bounding box
         = (boolean) `true` if bounding boxes intersect
        \*/
        Snap.path.isBBoxIntersect = isBBoxIntersect;
        /*\
         * Snap.path.intersection
         [ method ]
         **
         * Utility method
         **
         * Finds intersections of two paths
         - path1 (string) path string
         - path2 (string) path string
         = (array) dots of intersection
         o [
         o     {
         o         x: (number) x coordinate of the point,
         o         y: (number) y coordinate of the point,
         o         t1: (number) t value for segment of path1,
         o         t2: (number) t value for segment of path2,
         o         segment1: (number) order number for segment of path1,
         o         segment2: (number) order number for segment of path2,
         o         bez1: (array) eight coordinates representing beziér curve for the segment of path1,
         o         bez2: (array) eight coordinates representing beziér curve for the segment of path2
         o     }
         o ]
        \*/
        Snap.path.intersection = pathIntersection;
        Snap.path.intersectionNumber = pathIntersectionNumber;
        /*\
         * Snap.path.isPointInside
         [ method ]
         **
         * Utility method
         **
         * Returns `true` if given point is inside a given closed path.
         *
         * Note: fill mode doesn’t affect the result of this method.
         - path (string) path string
         - x (number) x of the point
         - y (number) y of the point
         = (boolean) `true` if point is inside the path
        \*/
        Snap.path.isPointInside = isPointInsidePath;
        /*\
         * Snap.path.getBBox
         [ method ]
         **
         * Utility method
         **
         * Returns the bounding box of a given path
         - path (string) path string
         = (object) bounding box
         o {
         o     x: (number) x coordinate of the left top point of the box,
         o     y: (number) y coordinate of the left top point of the box,
         o     x2: (number) x coordinate of the right bottom point of the box,
         o     y2: (number) y coordinate of the right bottom point of the box,
         o     width: (number) width of the box,
         o     height: (number) height of the box
         o }
        \*/
        Snap.path.getBBox = pathBBox;
        Snap.path.get = getPath;
        /*\
         * Snap.path.toRelative
         [ method ]
         **
         * Utility method
         **
         * Converts path coordinates into relative values
         - path (string) path string
         = (array) path string
        \*/
        Snap.path.toRelative = pathToRelative;
        /*\
         * Snap.path.toAbsolute
         [ method ]
         **
         * Utility method
         **
         * Converts path coordinates into absolute values
         - path (string) path string
         = (array) path string
        \*/
        Snap.path.toAbsolute = pathToAbsolute;
        /*\
         * Snap.path.toCubic
         [ method ]
         **
         * Utility method
         **
         * Converts path to a new path where all segments are cubic beziér curves
         - pathString (string|array) path string or array of segments
         = (array) array of segments
        \*/
        Snap.path.toCubic = path2curve;
        /*\
         * Snap.path.map
         [ method ]
         **
         * Transform the path string with the given matrix
         - path (string) path string
         - matrix (object) see @Matrix
         = (string) transformed path string
        \*/
        Snap.path.map = mapPath;
        Snap.path.toString = toString;
        Snap.path.clone = pathClone;
    });
    // Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
    // 
    // Licensed under the Apache License, Version 2.0 (the "License");
    // you may not use this file except in compliance with the License.
    // You may obtain a copy of the License at
    // 
    // http://www.apache.org/licenses/LICENSE-2.0
    // 
    // Unless required by applicable law or agreed to in writing, software
    // distributed under the License is distributed on an "AS IS" BASIS,
    // WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    // See the License for the specific language governing permissions and
    // limitations under the License.
    Snap.plugin(function (Snap, Element, Paper, glob) {
        var mmax = Math.max,
            mmin = Math.min;
        // Set
        var Set = function Set(items) {
            this.items = [];
            this.bindings = {};
            this.length = 0;
            this.type = "set";
            if (items) {
                for (var i = 0, ii = items.length; i < ii; i++) {
                    if (items[i]) {
                        this[this.items.length] = this.items[this.items.length] = items[i];
                        this.length++;
                    }
                }
            }
        },
            setproto = Set.prototype;
        /*\
         * Set.push
         [ method ]
         **
         * Adds each argument to the current set
         = (object) original element
        \*/
        setproto.push = function () {
            var item, len;
            for (var i = 0, ii = arguments.length; i < ii; i++) {
                item = arguments[i];
                if (item) {
                    len = this.items.length;
                    this[len] = this.items[len] = item;
                    this.length++;
                }
            }
            return this;
        };
        /*\
         * Set.pop
         [ method ]
         **
         * Removes last element and returns it
         = (object) element
        \*/
        setproto.pop = function () {
            this.length && delete this[this.length--];
            return this.items.pop();
        };
        /*\
         * Set.forEach
         [ method ]
         **
         * Executes given function for each element in the set
         *
         * If the function returns `false`, the loop stops running.
         **
         - callback (function) function to run
         - thisArg (object) context object for the callback
         = (object) Set object
        \*/
        setproto.forEach = function (callback, thisArg) {
            for (var i = 0, ii = this.items.length; i < ii; i++) {
                if (callback.call(thisArg, this.items[i], i) === false) {
                    return this;
                }
            }
            return this;
        };
        /*\
         * Set.animate
         [ method ]
         **
         * Animates each element in set in sync.
         *
         **
         - attrs (object) key-value pairs of destination attributes
         - duration (number) duration of the animation in milliseconds
         - easing (function) #optional easing function from @mina or custom
         - callback (function) #optional callback function that executes when the animation ends
         * or
         - animation (array) array of animation parameter for each element in set in format `[attrs, duration, easing, callback]`
         > Usage
         | // animate all elements in set to radius 10
         | set.animate({r: 10}, 500, mina.easein);
         | // or
         | // animate first element to radius 10, but second to radius 20 and in different time
         | set.animate([{r: 10}, 500, mina.easein], [{r: 20}, 1500, mina.easein]);
         = (Element) the current element
        \*/
        setproto.animate = function (attrs, ms, easing, callback) {
            if (typeof easing == "function" && !easing.length) {
                callback = easing;
                easing = mina.linear;
            }
            if (attrs instanceof Snap._.Animation) {
                callback = attrs.callback;
                easing = attrs.easing;
                ms = easing.dur;
                attrs = attrs.attr;
            }
            var args = arguments;
            if (Snap.is(attrs, "array") && Snap.is(args[args.length - 1], "array")) {
                var each = true;
            }
            var begin,
                handler = function handler() {
                if (begin) {
                    this.b = begin;
                } else {
                    begin = this.b;
                }
            },
                cb = 0,
                set = this,
                callbacker = callback && function () {
                if (++cb == set.length) {
                    callback.call(this);
                }
            };
            return this.forEach(function (el, i) {
                eve.once("snap.animcreated." + el.id, handler);
                if (each) {
                    args[i] && el.animate.apply(el, args[i]);
                } else {
                    el.animate(attrs, ms, easing, callbacker);
                }
            });
        };
        setproto.remove = function () {
            while (this.length) {
                this.pop().remove();
            }
            return this;
        };
        /*\
         * Set.bind
         [ method ]
         **
         * Specifies how to handle a specific attribute when applied
         * to a set.
         *
         **
         - attr (string) attribute name
         - callback (function) function to run
         * or
         - attr (string) attribute name
         - element (Element) specific element in the set to apply the attribute to
         * or
         - attr (string) attribute name
         - element (Element) specific element in the set to apply the attribute to
         - eattr (string) attribute on the element to bind the attribute to
         = (object) Set object
        \*/
        setproto.bind = function (attr, a, b) {
            var data = {};
            if (typeof a == "function") {
                this.bindings[attr] = a;
            } else {
                var aname = b || attr;
                this.bindings[attr] = function (v) {
                    data[aname] = v;
                    a.attr(data);
                };
            }
            return this;
        };
        setproto.attr = function (value) {
            var unbound = {};
            for (var k in value) {
                if (this.bindings[k]) {
                    this.bindings[k](value[k]);
                } else {
                    unbound[k] = value[k];
                }
            }
            for (var i = 0, ii = this.items.length; i < ii; i++) {
                this.items[i].attr(unbound);
            }
            return this;
        };
        /*\
         * Set.clear
         [ method ]
         **
         * Removes all elements from the set
        \*/
        setproto.clear = function () {
            while (this.length) {
                this.pop();
            }
        };
        /*\
         * Set.splice
         [ method ]
         **
         * Removes range of elements from the set
         **
         - index (number) position of the deletion
         - count (number) number of element to remove
         - insertion… (object) #optional elements to insert
         = (object) set elements that were deleted
        \*/
        setproto.splice = function (index, count, insertion) {
            index = index < 0 ? mmax(this.length + index, 0) : index;
            count = mmax(0, mmin(this.length - index, count));
            var tail = [],
                todel = [],
                args = [],
                i;
            for (i = 2; i < arguments.length; i++) {
                args.push(arguments[i]);
            }
            for (i = 0; i < count; i++) {
                todel.push(this[index + i]);
            }
            for (; i < this.length - index; i++) {
                tail.push(this[index + i]);
            }
            var arglen = args.length;
            for (i = 0; i < arglen + tail.length; i++) {
                this.items[index + i] = this[index + i] = i < arglen ? args[i] : tail[i - arglen];
            }
            i = this.items.length = this.length -= count - arglen;
            while (this[i]) {
                delete this[i++];
            }
            return new Set(todel);
        };
        /*\
         * Set.exclude
         [ method ]
         **
         * Removes given element from the set
         **
         - element (object) element to remove
         = (boolean) `true` if object was found and removed from the set
        \*/
        setproto.exclude = function (el) {
            for (var i = 0, ii = this.length; i < ii; i++) {
                if (this[i] == el) {
                    this.splice(i, 1);
                    return true;
                }
            }return false;
        };
        setproto.insertAfter = function (el) {
            var i = this.items.length;
            while (i--) {
                this.items[i].insertAfter(el);
            }
            return this;
        };
        setproto.getBBox = function () {
            var x = [],
                y = [],
                x2 = [],
                y2 = [];
            for (var i = this.items.length; i--;) {
                if (!this.items[i].removed) {
                    var box = this.items[i].getBBox();
                    x.push(box.x);
                    y.push(box.y);
                    x2.push(box.x + box.width);
                    y2.push(box.y + box.height);
                }
            }x = mmin.apply(0, x);
            y = mmin.apply(0, y);
            x2 = mmax.apply(0, x2);
            y2 = mmax.apply(0, y2);
            return {
                x: x,
                y: y,
                x2: x2,
                y2: y2,
                width: x2 - x,
                height: y2 - y,
                cx: x + (x2 - x) / 2,
                cy: y + (y2 - y) / 2
            };
        };
        setproto.clone = function (s) {
            s = new Set();
            for (var i = 0, ii = this.items.length; i < ii; i++) {
                s.push(this.items[i].clone());
            }
            return s;
        };
        setproto.toString = function () {
            return "Snap\u2018s set";
        };
        setproto.type = "set";
        // export
        Snap.Set = Set;
        Snap.set = function () {
            var set = new Set();
            if (arguments.length) {
                set.push.apply(set, Array.prototype.slice.call(arguments, 0));
            }
            return set;
        };
    });
    // Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
    // 
    // Licensed under the Apache License, Version 2.0 (the "License");
    // you may not use this file except in compliance with the License.
    // You may obtain a copy of the License at
    // 
    // http://www.apache.org/licenses/LICENSE-2.0
    // 
    // Unless required by applicable law or agreed to in writing, software
    // distributed under the License is distributed on an "AS IS" BASIS,
    // WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    // See the License for the specific language governing permissions and
    // limitations under the License.
    Snap.plugin(function (Snap, Element, Paper, glob) {
        var names = {},
            reUnit = /[a-z]+$/i,
            Str = String;
        names.stroke = names.fill = "colour";
        function getEmpty(item) {
            var l = item[0];
            switch (l.toLowerCase()) {
                case "t":
                    return [l, 0, 0];
                case "m":
                    return [l, 1, 0, 0, 1, 0, 0];
                case "r":
                    if (item.length == 4) {
                        return [l, 0, item[2], item[3]];
                    } else {
                        return [l, 0];
                    }
                case "s":
                    if (item.length == 5) {
                        return [l, 1, 1, item[3], item[4]];
                    } else if (item.length == 3) {
                        return [l, 1, 1];
                    } else {
                        return [l, 1];
                    }
            }
        }
        function equaliseTransform(t1, t2, getBBox) {
            t2 = Str(t2).replace(/\.{3}|\u2026/g, t1);
            t1 = Snap.parseTransformString(t1) || [];
            t2 = Snap.parseTransformString(t2) || [];
            var maxlength = Math.max(t1.length, t2.length),
                from = [],
                to = [],
                i = 0,
                j,
                jj,
                tt1,
                tt2;
            for (; i < maxlength; i++) {
                tt1 = t1[i] || getEmpty(t2[i]);
                tt2 = t2[i] || getEmpty(tt1);
                if (tt1[0] != tt2[0] || tt1[0].toLowerCase() == "r" && (tt1[2] != tt2[2] || tt1[3] != tt2[3]) || tt1[0].toLowerCase() == "s" && (tt1[3] != tt2[3] || tt1[4] != tt2[4])) {
                    t1 = Snap._.transform2matrix(t1, getBBox());
                    t2 = Snap._.transform2matrix(t2, getBBox());
                    from = [["m", t1.a, t1.b, t1.c, t1.d, t1.e, t1.f]];
                    to = [["m", t2.a, t2.b, t2.c, t2.d, t2.e, t2.f]];
                    break;
                }
                from[i] = [];
                to[i] = [];
                for (j = 0, jj = Math.max(tt1.length, tt2.length); j < jj; j++) {
                    j in tt1 && (from[i][j] = tt1[j]);
                    j in tt2 && (to[i][j] = tt2[j]);
                }
            }
            return {
                from: path2array(from),
                to: path2array(to),
                f: getPath(from)
            };
        }
        function getNumber(val) {
            return val;
        }
        function getUnit(unit) {
            return function (val) {
                return +val.toFixed(3) + unit;
            };
        }
        function getViewBox(val) {
            return val.join(" ");
        }
        function getColour(clr) {
            return Snap.rgb(clr[0], clr[1], clr[2]);
        }
        function getPath(path) {
            var k = 0,
                i,
                ii,
                j,
                jj,
                out,
                a,
                b = [];
            for (i = 0, ii = path.length; i < ii; i++) {
                out = "[";
                a = ['"' + path[i][0] + '"'];
                for (j = 1, jj = path[i].length; j < jj; j++) {
                    a[j] = "val[" + k++ + "]";
                }
                out += a + "]";
                b[i] = out;
            }
            return Function("val", "return Snap.path.toString.call([" + b + "])");
        }
        function path2array(path) {
            var out = [];
            for (var i = 0, ii = path.length; i < ii; i++) {
                for (var j = 1, jj = path[i].length; j < jj; j++) {
                    out.push(path[i][j]);
                }
            }
            return out;
        }
        function isNumeric(obj) {
            return isFinite(parseFloat(obj));
        }
        function arrayEqual(arr1, arr2) {
            if (!Snap.is(arr1, "array") || !Snap.is(arr2, "array")) {
                return false;
            }
            return arr1.toString() == arr2.toString();
        }
        Element.prototype.equal = function (name, b) {
            return eve("snap.util.equal", this, name, b).firstDefined();
        };
        eve.on("snap.util.equal", function (name, b) {
            var A,
                B,
                a = Str(this.attr(name) || ""),
                el = this;
            if (isNumeric(a) && isNumeric(b)) {
                return {
                    from: parseFloat(a),
                    to: parseFloat(b),
                    f: getNumber
                };
            }
            if (names[name] == "colour") {
                A = Snap.color(a);
                B = Snap.color(b);
                return {
                    from: [A.r, A.g, A.b, A.opacity],
                    to: [B.r, B.g, B.b, B.opacity],
                    f: getColour
                };
            }
            if (name == "viewBox") {
                A = this.attr(name).vb.split(" ").map(Number);
                B = b.split(" ").map(Number);
                return {
                    from: A,
                    to: B,
                    f: getViewBox
                };
            }
            if (name == "transform" || name == "gradientTransform" || name == "patternTransform") {
                if (b instanceof Snap.Matrix) {
                    b = b.toTransformString();
                }
                if (!Snap._.rgTransform.test(b)) {
                    b = Snap._.svgTransform2string(b);
                }
                return equaliseTransform(a, b, function () {
                    return el.getBBox(1);
                });
            }
            if (name == "d" || name == "path") {
                A = Snap.path.toCubic(a, b);
                return {
                    from: path2array(A[0]),
                    to: path2array(A[1]),
                    f: getPath(A[0])
                };
            }
            if (name == "points") {
                A = Str(a).split(Snap._.separator);
                B = Str(b).split(Snap._.separator);
                return {
                    from: A,
                    to: B,
                    f: function f(val) {
                        return val;
                    }
                };
            }
            var aUnit = a.match(reUnit),
                bUnit = Str(b).match(reUnit);
            if (aUnit && arrayEqual(aUnit, bUnit)) {
                return {
                    from: parseFloat(a),
                    to: parseFloat(b),
                    f: getUnit(aUnit)
                };
            } else {
                return {
                    from: this.asPX(name),
                    to: this.asPX(name, b),
                    f: getNumber
                };
            }
        });
    });
    // Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
    // 
    // Licensed under the Apache License, Version 2.0 (the "License");
    // you may not use this file except in compliance with the License.
    // You may obtain a copy of the License at
    // 
    // http://www.apache.org/licenses/LICENSE-2.0
    // 
    // Unless required by applicable law or agreed to in writing, software
    // distributed under the License is distributed on an "AS IS" BASIS,
    // WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    // See the License for the specific language governing permissions and
    // limitations under the License.
    Snap.plugin(function (Snap, Element, Paper, glob) {
        var elproto = Element.prototype,
            has = "hasOwnProperty",
            supportsTouch = "createTouch" in glob.doc,
            events = ["click", "dblclick", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "touchstart", "touchmove", "touchend", "touchcancel"],
            touchMap = {
            mousedown: "touchstart",
            mousemove: "touchmove",
            mouseup: "touchend"
        },
            getScroll = function getScroll(xy, el) {
            var name = xy == "y" ? "scrollTop" : "scrollLeft",
                doc = el && el.node ? el.node.ownerDocument : glob.doc;
            return doc[name in doc.documentElement ? "documentElement" : "body"][name];
        },
            preventDefault = function preventDefault() {
            this.returnValue = false;
        },
            preventTouch = function preventTouch() {
            return this.originalEvent.preventDefault();
        },
            stopPropagation = function stopPropagation() {
            this.cancelBubble = true;
        },
            stopTouch = function stopTouch() {
            return this.originalEvent.stopPropagation();
        },
            addEvent = function addEvent(obj, type, fn, element) {
            var realName = supportsTouch && touchMap[type] ? touchMap[type] : type,
                f = function f(e) {
                var scrollY = getScroll("y", element),
                    scrollX = getScroll("x", element);
                if (supportsTouch && touchMap[has](type)) {
                    for (var i = 0, ii = e.targetTouches && e.targetTouches.length; i < ii; i++) {
                        if (e.targetTouches[i].target == obj || obj.contains(e.targetTouches[i].target)) {
                            var olde = e;
                            e = e.targetTouches[i];
                            e.originalEvent = olde;
                            e.preventDefault = preventTouch;
                            e.stopPropagation = stopTouch;
                            break;
                        }
                    }
                }
                var x = e.clientX + scrollX,
                    y = e.clientY + scrollY;
                return fn.call(element, e, x, y);
            };
            if (type !== realName) {
                obj.addEventListener(type, f, false);
            }
            obj.addEventListener(realName, f, false);
            return function () {
                if (type !== realName) {
                    obj.removeEventListener(type, f, false);
                }
                obj.removeEventListener(realName, f, false);
                return true;
            };
        },
            drag = [],
            dragMove = function dragMove(e) {
            var x = e.clientX,
                y = e.clientY,
                scrollY = getScroll("y"),
                scrollX = getScroll("x"),
                dragi,
                j = drag.length;
            while (j--) {
                dragi = drag[j];
                if (supportsTouch) {
                    var i = e.touches && e.touches.length,
                        touch;
                    while (i--) {
                        touch = e.touches[i];
                        if (touch.identifier == dragi.el._drag.id || dragi.el.node.contains(touch.target)) {
                            x = touch.clientX;
                            y = touch.clientY;
                            (e.originalEvent ? e.originalEvent : e).preventDefault();
                            break;
                        }
                    }
                } else {
                    e.preventDefault();
                }
                var node = dragi.el.node,
                    o,
                    next = node.nextSibling,
                    parent = node.parentNode,
                    display = node.style.display;
                // glob.win.opera && parent.removeChild(node);
                // node.style.display = "none";
                // o = dragi.el.paper.getElementByPoint(x, y);
                // node.style.display = display;
                // glob.win.opera && (next ? parent.insertBefore(node, next) : parent.appendChild(node));
                // o && eve("snap.drag.over." + dragi.el.id, dragi.el, o);
                x += scrollX;
                y += scrollY;
                eve("snap.drag.move." + dragi.el.id, dragi.move_scope || dragi.el, x - dragi.el._drag.x, y - dragi.el._drag.y, x, y, e);
            }
        },
            dragUp = function dragUp(e) {
            Snap.unmousemove(dragMove).unmouseup(dragUp);
            var i = drag.length,
                dragi;
            while (i--) {
                dragi = drag[i];
                dragi.el._drag = {};
                eve("snap.drag.end." + dragi.el.id, dragi.end_scope || dragi.start_scope || dragi.move_scope || dragi.el, e);
                eve.off("snap.drag.*." + dragi.el.id);
            }
            drag = [];
        };
        /*\
         * Element.click
         [ method ]
         **
         * Adds a click event handler to the element
         - handler (function) handler for the event
         = (object) @Element
        \*/
        /*\
         * Element.unclick
         [ method ]
         **
         * Removes a click event handler from the element
         - handler (function) handler for the event
         = (object) @Element
        \*/
        /*\
         * Element.dblclick
         [ method ]
         **
         * Adds a double click event handler to the element
         - handler (function) handler for the event
         = (object) @Element
        \*/
        /*\
         * Element.undblclick
         [ method ]
         **
         * Removes a double click event handler from the element
         - handler (function) handler for the event
         = (object) @Element
        \*/
        /*\
         * Element.mousedown
         [ method ]
         **
         * Adds a mousedown event handler to the element
         - handler (function) handler for the event
         = (object) @Element
        \*/
        /*\
         * Element.unmousedown
         [ method ]
         **
         * Removes a mousedown event handler from the element
         - handler (function) handler for the event
         = (object) @Element
        \*/
        /*\
         * Element.mousemove
         [ method ]
         **
         * Adds a mousemove event handler to the element
         - handler (function) handler for the event
         = (object) @Element
        \*/
        /*\
         * Element.unmousemove
         [ method ]
         **
         * Removes a mousemove event handler from the element
         - handler (function) handler for the event
         = (object) @Element
        \*/
        /*\
         * Element.mouseout
         [ method ]
         **
         * Adds a mouseout event handler to the element
         - handler (function) handler for the event
         = (object) @Element
        \*/
        /*\
         * Element.unmouseout
         [ method ]
         **
         * Removes a mouseout event handler from the element
         - handler (function) handler for the event
         = (object) @Element
        \*/
        /*\
         * Element.mouseover
         [ method ]
         **
         * Adds a mouseover event handler to the element
         - handler (function) handler for the event
         = (object) @Element
        \*/
        /*\
         * Element.unmouseover
         [ method ]
         **
         * Removes a mouseover event handler from the element
         - handler (function) handler for the event
         = (object) @Element
        \*/
        /*\
         * Element.mouseup
         [ method ]
         **
         * Adds a mouseup event handler to the element
         - handler (function) handler for the event
         = (object) @Element
        \*/
        /*\
         * Element.unmouseup
         [ method ]
         **
         * Removes a mouseup event handler from the element
         - handler (function) handler for the event
         = (object) @Element
        \*/
        /*\
         * Element.touchstart
         [ method ]
         **
         * Adds a touchstart event handler to the element
         - handler (function) handler for the event
         = (object) @Element
        \*/
        /*\
         * Element.untouchstart
         [ method ]
         **
         * Removes a touchstart event handler from the element
         - handler (function) handler for the event
         = (object) @Element
        \*/
        /*\
         * Element.touchmove
         [ method ]
         **
         * Adds a touchmove event handler to the element
         - handler (function) handler for the event
         = (object) @Element
        \*/
        /*\
         * Element.untouchmove
         [ method ]
         **
         * Removes a touchmove event handler from the element
         - handler (function) handler for the event
         = (object) @Element
        \*/
        /*\
         * Element.touchend
         [ method ]
         **
         * Adds a touchend event handler to the element
         - handler (function) handler for the event
         = (object) @Element
        \*/
        /*\
         * Element.untouchend
         [ method ]
         **
         * Removes a touchend event handler from the element
         - handler (function) handler for the event
         = (object) @Element
        \*/
        /*\
         * Element.touchcancel
         [ method ]
         **
         * Adds a touchcancel event handler to the element
         - handler (function) handler for the event
         = (object) @Element
        \*/
        /*\
         * Element.untouchcancel
         [ method ]
         **
         * Removes a touchcancel event handler from the element
         - handler (function) handler for the event
         = (object) @Element
        \*/
        for (var i = events.length; i--;) {
            (function (eventName) {
                Snap[eventName] = elproto[eventName] = function (fn, scope) {
                    if (Snap.is(fn, "function")) {
                        this.events = this.events || [];
                        this.events.push({
                            name: eventName,
                            f: fn,
                            unbind: addEvent(this.node || document, eventName, fn, scope || this)
                        });
                    } else {
                        for (var i = 0, ii = this.events.length; i < ii; i++) {
                            if (this.events[i].name == eventName) {
                                try {
                                    this.events[i].f.call(this);
                                } catch (e) {}
                            }
                        }
                    }
                    return this;
                };
                Snap["un" + eventName] = elproto["un" + eventName] = function (fn) {
                    var events = this.events || [],
                        l = events.length;
                    while (l--) {
                        if (events[l].name == eventName && (events[l].f == fn || !fn)) {
                            events[l].unbind();
                            events.splice(l, 1);
                            !events.length && delete this.events;
                            return this;
                        }
                    }return this;
                };
            })(events[i]);
        }
        /*\
         * Element.hover
         [ method ]
         **
         * Adds hover event handlers to the element
         - f_in (function) handler for hover in
         - f_out (function) handler for hover out
         - icontext (object) #optional context for hover in handler
         - ocontext (object) #optional context for hover out handler
         = (object) @Element
        \*/
        elproto.hover = function (f_in, f_out, scope_in, scope_out) {
            return this.mouseover(f_in, scope_in).mouseout(f_out, scope_out || scope_in);
        };
        /*\
         * Element.unhover
         [ method ]
         **
         * Removes hover event handlers from the element
         - f_in (function) handler for hover in
         - f_out (function) handler for hover out
         = (object) @Element
        \*/
        elproto.unhover = function (f_in, f_out) {
            return this.unmouseover(f_in).unmouseout(f_out);
        };
        var draggable = [];
        // SIERRA unclear what _context_ refers to for starting, ending, moving the drag gesture.
        // SIERRA Element.drag(): _x position of the mouse_: Where are the x/y values offset from?
        // SIERRA Element.drag(): much of this member's doc appears to be duplicated for some reason.
        // SIERRA Unclear about this sentence: _Additionally following drag events will be triggered: drag.start.<id> on start, drag.end.<id> on end and drag.move.<id> on every move._ Is there a global _drag_ object to which you can assign handlers keyed by an element's ID?
        /*\
         * Element.drag
         [ method ]
         **
         * Adds event handlers for an element's drag gesture
         **
         - onmove (function) handler for moving
         - onstart (function) handler for drag start
         - onend (function) handler for drag end
         - mcontext (object) #optional context for moving handler
         - scontext (object) #optional context for drag start handler
         - econtext (object) #optional context for drag end handler
         * Additionaly following `drag` events are triggered: `drag.start.<id>` on start, 
         * `drag.end.<id>` on end and `drag.move.<id>` on every move. When element is dragged over another element 
         * `drag.over.<id>` fires as well.
         *
         * Start event and start handler are called in specified context or in context of the element with following parameters:
         o x (number) x position of the mouse
         o y (number) y position of the mouse
         o event (object) DOM event object
         * Move event and move handler are called in specified context or in context of the element with following parameters:
         o dx (number) shift by x from the start point
         o dy (number) shift by y from the start point
         o x (number) x position of the mouse
         o y (number) y position of the mouse
         o event (object) DOM event object
         * End event and end handler are called in specified context or in context of the element with following parameters:
         o event (object) DOM event object
         = (object) @Element
        \*/
        elproto.drag = function (onmove, onstart, onend, move_scope, start_scope, end_scope) {
            var el = this;
            if (!arguments.length) {
                var origTransform;
                return el.drag(function (dx, dy) {
                    this.attr({
                        transform: origTransform + (origTransform ? "T" : "t") + [dx, dy]
                    });
                }, function () {
                    origTransform = this.transform().local;
                });
            }
            function start(e, x, y) {
                (e.originalEvent || e).preventDefault();
                el._drag.x = x;
                el._drag.y = y;
                el._drag.id = e.identifier;
                !drag.length && Snap.mousemove(dragMove).mouseup(dragUp);
                drag.push({ el: el, move_scope: move_scope, start_scope: start_scope, end_scope: end_scope });
                onstart && eve.on("snap.drag.start." + el.id, onstart);
                onmove && eve.on("snap.drag.move." + el.id, onmove);
                onend && eve.on("snap.drag.end." + el.id, onend);
                eve("snap.drag.start." + el.id, start_scope || move_scope || el, x, y, e);
            }
            function init(e, x, y) {
                eve("snap.draginit." + el.id, el, e, x, y);
            }
            eve.on("snap.draginit." + el.id, start);
            el._drag = {};
            draggable.push({ el: el, start: start, init: init });
            el.mousedown(init);
            return el;
        };
        /*
         * Element.onDragOver
         [ method ]
         **
         * Shortcut to assign event handler for `drag.over.<id>` event, where `id` is the element's `id` (see @Element.id)
         - f (function) handler for event, first argument would be the element you are dragging over
        \*/
        // elproto.onDragOver = function (f) {
        //     f ? eve.on("snap.drag.over." + this.id, f) : eve.unbind("snap.drag.over." + this.id);
        // };
        /*\
         * Element.undrag
         [ method ]
         **
         * Removes all drag event handlers from the given element
        \*/
        elproto.undrag = function () {
            var i = draggable.length;
            while (i--) {
                if (draggable[i].el == this) {
                    this.unmousedown(draggable[i].init);
                    draggable.splice(i, 1);
                    eve.unbind("snap.drag.*." + this.id);
                    eve.unbind("snap.draginit." + this.id);
                }
            }!draggable.length && Snap.unmousemove(dragMove).unmouseup(dragUp);
            return this;
        };
    });
    // Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
    // 
    // Licensed under the Apache License, Version 2.0 (the "License");
    // you may not use this file except in compliance with the License.
    // You may obtain a copy of the License at
    // 
    // http://www.apache.org/licenses/LICENSE-2.0
    // 
    // Unless required by applicable law or agreed to in writing, software
    // distributed under the License is distributed on an "AS IS" BASIS,
    // WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    // See the License for the specific language governing permissions and
    // limitations under the License.
    Snap.plugin(function (Snap, Element, Paper, glob) {
        var elproto = Element.prototype,
            pproto = Paper.prototype,
            rgurl = /^\s*url\((.+)\)/,
            Str = String,
            $ = Snap._.$;
        Snap.filter = {};
        /*\
         * Paper.filter
         [ method ]
         **
         * Creates a `<filter>` element
         **
         - filstr (string) SVG fragment of filter provided as a string
         = (object) @Element
         * Note: It is recommended to use filters embedded into the page inside an empty SVG element.
         > Usage
         | var f = paper.filter('<feGaussianBlur stdDeviation="2"/>'),
         |     c = paper.circle(10, 10, 10).attr({
         |         filter: f
         |     });
        \*/
        pproto.filter = function (filstr) {
            var paper = this;
            if (paper.type != "svg") {
                paper = paper.paper;
            }
            var f = Snap.parse(Str(filstr)),
                id = Snap._.id(),
                width = paper.node.offsetWidth,
                height = paper.node.offsetHeight,
                filter = $("filter");
            $(filter, {
                id: id,
                filterUnits: "userSpaceOnUse"
            });
            filter.appendChild(f.node);
            paper.defs.appendChild(filter);
            return new Element(filter);
        };
        eve.on("snap.util.getattr.filter", function () {
            eve.stop();
            var p = $(this.node, "filter");
            if (p) {
                var match = Str(p).match(rgurl);
                return match && Snap.select(match[1]);
            }
        });
        eve.on("snap.util.attr.filter", function (value) {
            if (value instanceof Element && value.type == "filter") {
                eve.stop();
                var id = value.node.id;
                if (!id) {
                    $(value.node, { id: value.id });
                    id = value.id;
                }
                $(this.node, {
                    filter: Snap.url(id)
                });
            }
            if (!value || value == "none") {
                eve.stop();
                this.node.removeAttribute("filter");
            }
        });
        /*\
         * Snap.filter.blur
         [ method ]
         **
         * Returns an SVG markup string for the blur filter
         **
         - x (number) amount of horizontal blur, in pixels
         - y (number) #optional amount of vertical blur, in pixels
         = (string) filter representation
         > Usage
         | var f = paper.filter(Snap.filter.blur(5, 10)),
         |     c = paper.circle(10, 10, 10).attr({
         |         filter: f
         |     });
        \*/
        Snap.filter.blur = function (x, y) {
            if (x == null) {
                x = 2;
            }
            var def = y == null ? x : [x, y];
            return Snap.format('\<feGaussianBlur stdDeviation="{def}"/>', {
                def: def
            });
        };
        Snap.filter.blur.toString = function () {
            return this();
        };
        /*\
         * Snap.filter.shadow
         [ method ]
         **
         * Returns an SVG markup string for the shadow filter
         **
         - dx (number) #optional horizontal shift of the shadow, in pixels
         - dy (number) #optional vertical shift of the shadow, in pixels
         - blur (number) #optional amount of blur
         - color (string) #optional color of the shadow
         - opacity (number) #optional `0..1` opacity of the shadow
         * or
         - dx (number) #optional horizontal shift of the shadow, in pixels
         - dy (number) #optional vertical shift of the shadow, in pixels
         - color (string) #optional color of the shadow
         - opacity (number) #optional `0..1` opacity of the shadow
         * which makes blur default to `4`. Or
         - dx (number) #optional horizontal shift of the shadow, in pixels
         - dy (number) #optional vertical shift of the shadow, in pixels
         - opacity (number) #optional `0..1` opacity of the shadow
         = (string) filter representation
         > Usage
         | var f = paper.filter(Snap.filter.shadow(0, 2, 3)),
         |     c = paper.circle(10, 10, 10).attr({
         |         filter: f
         |     });
        \*/
        Snap.filter.shadow = function (dx, dy, blur, color, opacity) {
            if (typeof blur == "string") {
                color = blur;
                opacity = color;
                blur = 4;
            }
            if (typeof color != "string") {
                opacity = color;
                color = "#000";
            }
            color = color || "#000";
            if (blur == null) {
                blur = 4;
            }
            if (opacity == null) {
                opacity = 1;
            }
            if (dx == null) {
                dx = 0;
                dy = 2;
            }
            if (dy == null) {
                dy = dx;
            }
            color = Snap.color(color);
            return Snap.format('<feGaussianBlur in="SourceAlpha" stdDeviation="{blur}"/><feOffset dx="{dx}" dy="{dy}" result="offsetblur"/><feFlood flood-color="{color}"/><feComposite in2="offsetblur" operator="in"/><feComponentTransfer><feFuncA type="linear" slope="{opacity}"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>', {
                color: color,
                dx: dx,
                dy: dy,
                blur: blur,
                opacity: opacity
            });
        };
        Snap.filter.shadow.toString = function () {
            return this();
        };
        /*\
         * Snap.filter.grayscale
         [ method ]
         **
         * Returns an SVG markup string for the grayscale filter
         **
         - amount (number) amount of filter (`0..1`)
         = (string) filter representation
        \*/
        Snap.filter.grayscale = function (amount) {
            if (amount == null) {
                amount = 1;
            }
            return Snap.format('<feColorMatrix type="matrix" values="{a} {b} {c} 0 0 {d} {e} {f} 0 0 {g} {b} {h} 0 0 0 0 0 1 0"/>', {
                a: 0.2126 + 0.7874 * (1 - amount),
                b: 0.7152 - 0.7152 * (1 - amount),
                c: 0.0722 - 0.0722 * (1 - amount),
                d: 0.2126 - 0.2126 * (1 - amount),
                e: 0.7152 + 0.2848 * (1 - amount),
                f: 0.0722 - 0.0722 * (1 - amount),
                g: 0.2126 - 0.2126 * (1 - amount),
                h: 0.0722 + 0.9278 * (1 - amount)
            });
        };
        Snap.filter.grayscale.toString = function () {
            return this();
        };
        /*\
         * Snap.filter.sepia
         [ method ]
         **
         * Returns an SVG markup string for the sepia filter
         **
         - amount (number) amount of filter (`0..1`)
         = (string) filter representation
        \*/
        Snap.filter.sepia = function (amount) {
            if (amount == null) {
                amount = 1;
            }
            return Snap.format('<feColorMatrix type="matrix" values="{a} {b} {c} 0 0 {d} {e} {f} 0 0 {g} {h} {i} 0 0 0 0 0 1 0"/>', {
                a: 0.393 + 0.607 * (1 - amount),
                b: 0.769 - 0.769 * (1 - amount),
                c: 0.189 - 0.189 * (1 - amount),
                d: 0.349 - 0.349 * (1 - amount),
                e: 0.686 + 0.314 * (1 - amount),
                f: 0.168 - 0.168 * (1 - amount),
                g: 0.272 - 0.272 * (1 - amount),
                h: 0.534 - 0.534 * (1 - amount),
                i: 0.131 + 0.869 * (1 - amount)
            });
        };
        Snap.filter.sepia.toString = function () {
            return this();
        };
        /*\
         * Snap.filter.saturate
         [ method ]
         **
         * Returns an SVG markup string for the saturate filter
         **
         - amount (number) amount of filter (`0..1`)
         = (string) filter representation
        \*/
        Snap.filter.saturate = function (amount) {
            if (amount == null) {
                amount = 1;
            }
            return Snap.format('<feColorMatrix type="saturate" values="{amount}"/>', {
                amount: 1 - amount
            });
        };
        Snap.filter.saturate.toString = function () {
            return this();
        };
        /*\
         * Snap.filter.hueRotate
         [ method ]
         **
         * Returns an SVG markup string for the hue-rotate filter
         **
         - angle (number) angle of rotation
         = (string) filter representation
        \*/
        Snap.filter.hueRotate = function (angle) {
            angle = angle || 0;
            return Snap.format('<feColorMatrix type="hueRotate" values="{angle}"/>', {
                angle: angle
            });
        };
        Snap.filter.hueRotate.toString = function () {
            return this();
        };
        /*\
         * Snap.filter.invert
         [ method ]
         **
         * Returns an SVG markup string for the invert filter
         **
         - amount (number) amount of filter (`0..1`)
         = (string) filter representation
        \*/
        Snap.filter.invert = function (amount) {
            if (amount == null) {
                amount = 1;
            }
            //        <feColorMatrix type="matrix" values="-1 0 0 0 1  0 -1 0 0 1  0 0 -1 0 1  0 0 0 1 0" color-interpolation-filters="sRGB"/>
            return Snap.format('<feComponentTransfer><feFuncR type="table" tableValues="{amount} {amount2}"/><feFuncG type="table" tableValues="{amount} {amount2}"/><feFuncB type="table" tableValues="{amount} {amount2}"/></feComponentTransfer>', {
                amount: amount,
                amount2: 1 - amount
            });
        };
        Snap.filter.invert.toString = function () {
            return this();
        };
        /*\
         * Snap.filter.brightness
         [ method ]
         **
         * Returns an SVG markup string for the brightness filter
         **
         - amount (number) amount of filter (`0..1`)
         = (string) filter representation
        \*/
        Snap.filter.brightness = function (amount) {
            if (amount == null) {
                amount = 1;
            }
            return Snap.format('<feComponentTransfer><feFuncR type="linear" slope="{amount}"/><feFuncG type="linear" slope="{amount}"/><feFuncB type="linear" slope="{amount}"/></feComponentTransfer>', {
                amount: amount
            });
        };
        Snap.filter.brightness.toString = function () {
            return this();
        };
        /*\
         * Snap.filter.contrast
         [ method ]
         **
         * Returns an SVG markup string for the contrast filter
         **
         - amount (number) amount of filter (`0..1`)
         = (string) filter representation
        \*/
        Snap.filter.contrast = function (amount) {
            if (amount == null) {
                amount = 1;
            }
            return Snap.format('<feComponentTransfer><feFuncR type="linear" slope="{amount}" intercept="{amount2}"/><feFuncG type="linear" slope="{amount}" intercept="{amount2}"/><feFuncB type="linear" slope="{amount}" intercept="{amount2}"/></feComponentTransfer>', {
                amount: amount,
                amount2: .5 - amount / 2
            });
        };
        Snap.filter.contrast.toString = function () {
            return this();
        };
    });
    // Copyright (c) 2014 Adobe Systems Incorporated. All rights reserved.
    //
    // Licensed under the Apache License, Version 2.0 (the "License");
    // you may not use this file except in compliance with the License.
    // You may obtain a copy of the License at
    //
    // http://www.apache.org/licenses/LICENSE-2.0
    //
    // Unless required by applicable law or agreed to in writing, software
    // distributed under the License is distributed on an "AS IS" BASIS,
    // WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    // See the License for the specific language governing permissions and
    // limitations under the License.
    Snap.plugin(function (Snap, Element, Paper, glob, Fragment) {
        var box = Snap._.box,
            is = Snap.is,
            firstLetter = /^[^a-z]*([tbmlrc])/i,
            toString = function toString() {
            return "T" + this.dx + "," + this.dy;
        };
        /*\
         * Element.getAlign
         [ method ]
         **
         * Returns shift needed to align the element relatively to given element.
         * If no elements specified, parent `<svg>` container will be used.
         - el (object) @optional alignment element
         - way (string) one of six values: `"top"`, `"middle"`, `"bottom"`, `"left"`, `"center"`, `"right"`
         = (object|string) Object in format `{dx: , dy: }` also has a string representation as a transformation string
         > Usage
         | el.transform(el.getAlign(el2, "top"));
         * or
         | var dy = el.getAlign(el2, "top").dy;
        \*/
        Element.prototype.getAlign = function (el, way) {
            if (way == null && is(el, "string")) {
                way = el;
                el = null;
            }
            el = el || this.paper;
            var bx = el.getBBox ? el.getBBox() : box(el),
                bb = this.getBBox(),
                out = {};
            way = way && way.match(firstLetter);
            way = way ? way[1].toLowerCase() : "c";
            switch (way) {
                case "t":
                    out.dx = 0;
                    out.dy = bx.y - bb.y;
                    break;
                case "b":
                    out.dx = 0;
                    out.dy = bx.y2 - bb.y2;
                    break;
                case "m":
                    out.dx = 0;
                    out.dy = bx.cy - bb.cy;
                    break;
                case "l":
                    out.dx = bx.x - bb.x;
                    out.dy = 0;
                    break;
                case "r":
                    out.dx = bx.x2 - bb.x2;
                    out.dy = 0;
                    break;
                default:
                    out.dx = bx.cx - bb.cx;
                    out.dy = 0;
                    break;
            }
            out.toString = toString;
            return out;
        };
        /*\
         * Element.align
         [ method ]
         **
         * Aligns the element relatively to given one via transformation.
         * If no elements specified, parent `<svg>` container will be used.
         - el (object) @optional alignment element
         - way (string) one of six values: `"top"`, `"middle"`, `"bottom"`, `"left"`, `"center"`, `"right"`
         = (object) this element
         > Usage
         | el.align(el2, "top");
         * or
         | el.align("middle");
        \*/
        Element.prototype.align = function (el, way) {
            return this.transform("..." + this.getAlign(el, way));
        };
    });
    return Snap;
});
"use strict";
var INIT = window.INIT || {};
$(document).ready(function () {
  INIT.icon.init();
  INIT.plugins.tabs.init();
  INIT.plugins.nav.init();
  INIT.plugins.akkordeon.init();
  INIT.plugins.clickOutside.init();
  INIT.plugins.dropdown.init();
  INIT.plugins.iframe.init();
  INIT.scrollTo.init();
  INIT.Skipnav.init();
  INIT.accessibility.init();
  INIT.noScroll.init();
  INIT.nav.init();
  INIT.headerSearch.init();
  INIT.stickyHeader.init();
  INIT.footer.init();
  INIT.mainSearch.init();
  INIT.autocomplete.init();
  INIT.topicZip.init();
  INIT.accordion.init();
  INIT.tabs.init();
  INIT.feedback.init();
  INIT.callout.init();
  INIT.flap.init();
  INIT.video.init();
  INIT.sharing.init();
  INIT.dropdown.init();
  INIT.printView.init();
  INIT.ie10.init();
  INIT.button.init();
  INIT.cookieBanner.init();
  INIT.helpers.init();
});
