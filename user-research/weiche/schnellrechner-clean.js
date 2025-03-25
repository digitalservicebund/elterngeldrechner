"use strict";
var _createClass = (function () {
    function e(e, t) {
      for (var r, n = 0; n < t.length; n++)
        (r = t[n]),
          (r.enumerable = r.enumerable || !1),
          (r.configurable = !0),
          "value" in r && (r.writable = !0),
          Object.defineProperty(e, r.key, r);
    }
    return function (t, r, n) {
      return r && e(t.prototype, r), n && e(t, n), t;
    };
  })(),
  _typeof =
    "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
      ? function (e) {
          return typeof e;
        }
      : function (e) {
          return e &&
            "function" == typeof Symbol &&
            e.constructor === Symbol &&
            e !== Symbol.prototype
            ? "symbol"
            : typeof e;
        };

function _possibleConstructorReturn(e, t) {
  if (!e)
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called",
    );
  return t && ("object" == typeof t || "function" == typeof t) ? t : e;
}

function _inherits(e, t) {
  if ("function" != typeof t && null !== t)
    throw new TypeError(
      "Super expression must either be null or a function, not " + typeof t,
    );
  (e.prototype = Object.create(t && t.prototype, {
    constructor: {
      value: e,
      enumerable: !1,
      writable: !0,
      configurable: !0,
    },
  })),
    t &&
      (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : (e.__proto__ = t));
}

function _classCallCheck(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
(function c(p, e, t) {
  function r(i, o) {
    if (!e[i]) {
      if (!p[i]) {
        var s = "function" == typeof require && require;
        if (!o && s) return s(i, !0);
        if (n) return n(i, !0);
        var a = new Error("Cannot find module '" + i + "'");
        throw ((a.code = "MODULE_NOT_FOUND"), a);
      }
      var d = (e[i] = {
        exports: {},
      });
      p[i][0].call(
        d.exports,
        function (t) {
          var e = p[i][1][t];
          return r(e ? e : t);
        },
        d,
        d.exports,
        c,
        p,
        e,
        t,
      );
    }
    return e[i].exports;
  }
});

var EGR = window.EGR || {};
(function () {
  var e = Math.max,
    t = Math.floor,
    r = Math.min,
    n = 0.67,
    o = 0.65,
    a = 1240,
    l = 1200,
    i = 1e3,
    s = 1800,
    c = 300,
    p = (function () {
      function e() {
        _classCallCheck(this, e),
          (this.element = ""),
          (this.error = !1),
          (this.value = ""),
          (this.text = ""),
          (this.template = "");
      }
      return (
        _createClass(e, [
          {
            key: "createTemplate",
            value: function () {
              throw new Error("You have to implement createTemplate().");
            },
          },
          {
            key: "subtext",
            value: function () {
              throw new Error("You have to implement subtext().");
            },
          },
          {
            key: "validate",
            value: function (e) {
              EGR.Schnellrechner.validateFloatNumber(e.value)
                ? ((this.error = !1), (this.errorMsg.style.display = "none"))
                : ((this.error = !0), (this.errorMsg.style.display = "block"));
            },
          },
          {
            key: "isValid",
            value: function () {
              return !this.error;
            },
          },
          {
            key: "render",
            value: function () {
              var e =
                0 < arguments.length && void 0 !== arguments[0]
                  ? arguments[0]
                  : !0;
              if (e) {
                var t = document.createElement("div");
                t.className = "formItemsBlock";
                var r = document.createElement("div");
                r.className = "formItemsRow";
                var n = document.createElement("p");
                return (
                  (n.textContent = this.text),
                  r.appendChild(n),
                  r.appendChild(this.createTemplate()),
                  t.appendChild(r),
                  t
                );
              }
              var o = document.createElement("li");
              return (
                ((o.innerHTML = this.subtext()), "false" != o.innerHTML) && o
              );
            },
          },
        ]),
        e
      );
    })(),
    d = (function (e) {
      function t() {
        var e;
        _classCallCheck(this, t);
        var r = _possibleConstructorReturn(
          this,
          (t.__proto__ || Object.getPrototypeOf(t)).call(this),
        );
        return (
          (r.text =
            "Wie viele Kinder erwarten Sie? (Bei einer Mehrlingsgeburt wird das Elterngeld nur f\xFCr jeweils ein Kind berechnet."),
          (e = r),
          _possibleConstructorReturn(r, e)
        );
      }
      return (
        _inherits(t, e),
        _createClass(t, [
          {
            key: "subtext",
            value: function () {
              return 2 > this.value
                ? "Sie erwarten <strong>" + this.value + "</strong> Kind."
                : "Sie erwarten <strong>" + this.value + "</strong> Kinder.";
            },
          },
          {
            key: "progressed",
            value: function () {
              this.value = this.element.value;
            },
          },
          {
            key: "createTemplate",
            value: function () {
              var e = document.createElement("select");
              e.id = "childCounterRow";
              for (var t, r = 0; 7 > r; r++)
                (t = document.createElement("option")),
                  (t.value = r + 1),
                  (t.text = r + 1),
                  e.appendChild(t);
              return (this.element = e), e;
            },
          },
        ]),
        t
      );
    })(p),
    u = (function (e) {
      function t() {
        var e;
        _classCallCheck(this, t);
        var r = _possibleConstructorReturn(
          this,
          (t.__proto__ || Object.getPrototypeOf(t)).call(this),
        );
        return (
          (r.text =
            "Haben Sie bereits ein Kind unter 3 Jahren oder zwei Kinder unter 6 Jahren?"),
          (e = r),
          _possibleConstructorReturn(r, e)
        );
      }
      return (
        _inherits(t, e),
        _createClass(t, [
          {
            key: "subtext",
            value: function () {
              return (
                !!this.value &&
                "Sie haben <strong>bereits ein</strong> Kind unter 3 Jahren oder <strong>zwei</strong> Kinder unter 6 Jahren."
              );
            },
          },
          {
            key: "progressed",
            value: function () {
              this.value = this.element.checked;
            },
          },
          {
            key: "createTemplate",
            value: function () {
              var e = document.createElement("div"),
                t = document.createElement("input");
              (t.type = "radio"),
                (t.name = "hadChilds"),
                (t.id = "hadChildsYes"),
                (t.value = "YES");
              var r = document.createElement("label");
              r.setAttribute("for", "hadChildsYes"), (r.textContent = "Ja");
              var n = document.createElement("input");
              (n.type = "radio"),
                (n.name = "hadChilds"),
                (n.id = "hadChildsNo"),
                (n.value = "NO"),
                (n.checked = "checked");
              var o = document.createElement("label");
              return (
                o.setAttribute("for", "hadChildsNo"),
                (o.textContent = "Nein"),
                e.appendChild(t),
                e.appendChild(r),
                e.appendChild(n),
                e.appendChild(o),
                (this.element = t),
                e
              );
            },
          },
        ]),
        t
      );
    })(p),
    h = (function (e) {
      function t() {
        var e;
        _classCallCheck(this, t);
        var r = _possibleConstructorReturn(
          this,
          (t.__proto__ || Object.getPrototypeOf(t)).call(this),
        );
        return (
          (r.value = 0),
          (r.text =
            "Wie hoch war Ihr durchschnittliches Nettoeinkommen pro Monat in den letzten 12 Monaten vor der Geburt?"),
          ((e = r), _possibleConstructorReturn(r, e))
        );
      }
      return (
        _inherits(t, e),
        _createClass(t, [
          {
            key: "amount",
            value: function () {
              return this.value
                ? parseFloat(this.value).toLocaleString("de-DE", {
                    minimumFractionDigits: 2,
                  })
                : "0,00";
            },
          },
          {
            key: "subtext",
            value: function () {
              return (
                "Ihr durchschnittliches Netto Monatseinkommen in den letzten 12 Monaten vor der Geburt betrug <strong>" +
                this.amount() +
                "</strong> \u20AC Netto / Monat."
              );
            },
          },
          {
            key: "progressed",
            value: function () {
              this.value = this.element.value;
            },
          },
          {
            key: "createTemplate",
            value: function () {
              var e = this,
                t = document.createElement("div"),
                r = document.createElement("span");
              (r.className = "errorMessage"),
                (r.textContent =
                  "Bei der Eingabe handelt es sich nicht um eine g\xFCltige Zahl. Beispiel: 198,23"),
                (r.style.display = "none"),
                (this.errorMsg = r),
                t.appendChild(r);
              var n = document.createElement("input");
              (n.type = "text"),
                (n.placeholder = "\u20AC Netto/Monat"),
                (n.id = "nettoVorher"),
                (n.title = "\u20AC Netto / Monat"),
                (n.onblur = function () {
                  return e.validate(n);
                });
              var o = document.createElement("label");
              return (
                (o.textContent = "\u20AC Netto / Monat"),
                t.appendChild(n),
                (this.element = n),
                t
              );
            },
          },
        ]),
        t
      );
    })(p),
    g = (function (e) {
      function t() {
        var e;
        _classCallCheck(this, t);
        var r = _possibleConstructorReturn(
          this,
          (t.__proto__ || Object.getPrototypeOf(t)).call(this),
        );
        return (
          (r.value = 0),
          (r.text =
            "Falls Sie nach der Geburt arbeiten werden - wie hoch wird Ihr durchschnittliches Nettoeinkommen pro Monat in den Monaten sein, in denen Sie Elterngeld beziehen wollen?"),
          ((e = r), _possibleConstructorReturn(r, e))
        );
      }
      return (
        _inherits(t, e),
        _createClass(t, [
          {
            key: "amount",
            value: function () {
              return this.value
                ? parseFloat(this.value).toLocaleString("de-DE", {
                    minimumFractionDigits: 2,
                  })
                : "0,00";
            },
          },
          {
            key: "subtext",
            value: function () {
              return (
                "Ihr durchschnittliches Nettoeinkommen in den Monaten, in denen Sie Elterngeld beziehen wollen, wird <strong>" +
                this.amount() +
                "</strong> \u20AC Netto / Monat betragen."
              );
            },
          },
          {
            key: "progressed",
            value: function () {
              this.value = this.element.value;
            },
          },
          {
            key: "createTemplate",
            value: function () {
              var e = this,
                t = document.createElement("div"),
                r = document.createElement("span");
              (r.className = "errorMessage"),
                (r.textContent =
                  "Bei der Eingabe handelt es sich nicht um eine g\xFCltige Zahl. Beispiel: 198,23"),
                (r.style.display = "none"),
                (this.errorMsg = r),
                t.appendChild(r);
              var n = document.createElement("input");
              (n.type = "text"),
                (n.placeholder = "\u20AC Netto/Monat"),
                (n.id = "nettoNachher"),
                (n.title = "\u20AC Netto / Monat"),
                (n.onblur = function () {
                  return e.validate(n);
                });
              var o = document.createElement("label");
              return (
                (o.textContent = "\u20AC Netto / Monat"),
                t.appendChild(n),
                (this.element = n),
                t
              );
            },
          },
        ]),
        t
      );
    })(p),
    y = (function (e) {
      function t() {
        return (
          _classCallCheck(this, t),
          _possibleConstructorReturn(
            this,
            (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments),
          )
        );
      }
      return (
        _inherits(t, e),
        _createClass(t, [
          {
            key: "createTemplate",
            value: function (e) {
              var t = document.createElement("div"),
                r = document.createElement("h4");
              r.textContent = "Ihr Elterngeld betr\xE4gt ca.";
              var n = document.createElement("ul"),
                o = document.createElement("li"),
                a = document.createElement("strong");
              a.textContent = parseFloat(e).toLocaleString("de-DE", {
                minimumFractionDigits: 2,
              });
              var l = document.createElement("span");
              return (
                (l.textContent = " \u20AC Netto / Monat"),
                t.appendChild(r),
                t.appendChild(n),
                n.appendChild(o),
                o.appendChild(a),
                o.appendChild(l),
                t
              );
            },
          },
        ]),
        t
      );
    })(p);
  EGR.Schnellrechner = {
    Container: {},
    inProgress: !0,
    rows: [],
    submitBtn: {},
    initRows: function () {
      return (this.rows = [new d(), new u(), new h(), new g()]);
    },
    render: function () {
      var e = this;
      if (((this.Container.innerHTML = ""), !this.inProgress)) {
        var t = document.createElement("ul"),
          r = document.createElement("h4");
        (r.textContent = "Ihre Eingaben"),
          this.Container.appendChild(r),
          this.Container.appendChild(t);
      }
      return (
        this.rows.map(function (r) {
          var n = r.render(e.inProgress);
          e.inProgress && n && e.Container.appendChild(n),
            !e.inProgress && n && t.appendChild(n);
        }),
        this.Container
      );
    },
    validateFloatNumber: function (e) {
      var t = new RegExp(/^\d+(\.\d{3})*(,\d\d?)?$/i);
      return !e || t.test(e);
    },
    templates: {
      form: function () {
        var e = document.createElement("form"),
          t = document.createElement("h2");
        t.textContent = "Elterngeld-Schnellrechner";
        t.className = "mb-16";
        var r = document.createElement("div");
        (EGR.Schnellrechner.Container = r), (r.id = "schnellrechnerApp");
        var n = document.createElement("p");
        (n.className = "hinweisHeadline"), (n.innerHTML = "<u>Hinweis:</u>");
        var o = document.createElement("p");
        (o.className = "hinweis"), (o.textContent = this.getTmpAttention());
        var a = document.createElement("div");
        a.className = "buttons";
        var l = document.createElement("button");
        l.className =
          "border border-solid border-primary text-20 transition-all duration-300 bg-transparent text-primary px-24 py-16 [@media(hover:hover)]:hover:bg-primary [@media(hover:hover)]:hover:text-white active:focus:bg-primary active:focus:text-white";
        (l.type = "button"),
          (l.onclick = function () {
            return EGR.Schnellrechner.reset();
          });
        EGR.Schnellrechner.resetBtn = l;
        var i = document.createElement("span");
        (i.className = "ui-button-text"),
          (i.textContent = "Zur\xFCcksetzen"),
          (EGR.Schnellrechner.backBtnLabel = i),
          l.appendChild(i);
        var s = document.createElement("button");
        s.className =
          "border border-solid border-primary text-20 transition-all duration-300 bg-primary text-white px-24 py-16 [@media(hover:hover)]:hover:bg-white [@media(hover:hover)]:hover:text-primary active:focus:bg-white active:focus:text-primary";
        (EGR.Schnellrechner.submitBtn = s),
          (s.style.display = "block"),
          (s.type = "button"),
          (s.onclick = function () {
            return EGR.Schnellrechner.handleSubmit();
          });
        var c = document.createElement("span");
        return (
          (c.className = "ui-button-text"),
          (c.textContent = "Schnellberechnung"),
          s.appendChild(c),
          a.appendChild(s),
          a.appendChild(l),
          e.appendChild(t),
          e.appendChild(r),
          e.appendChild(n),
          e.appendChild(o),
          e.appendChild(a),
          e
        );
      },
      getTmpAttention: function () {
        return "Der Schnellrechner ermittelt nur einen ungef\xE4hren Richtwert des Elterngeldes. M\xF6chten Sie ein genaueres Ergebnis erhalten oder das ElterngeldPlus in Anspruch nehmen, nutzen Sie bitte den ausf\xFChrlichen Elterngeldrechner mit Planer.";
      },
    },
    isFormValid: function () {
      console.log(this.rows);
      var e = !0,
        t = !1,
        r = void 0;
      try {
        for (
          var n, o, a = this.rows[Symbol.iterator]();
          !(e = (n = a.next()).done);
          e = !0
        )
          if (((o = n.value), !o.isValid())) return !1;
      } catch (e) {
        (t = !0), (r = e);
      } finally {
        try {
          !e && a.return && a.return();
        } finally {
          if (t) throw r;
        }
      }
      return !0;
    },
    handleSubmit: function () {
      if (!this.isFormValid()) return !1;
      (this.inProgress = !1),
        this.rows.forEach(function (e) {
          return e.progressed();
        });
      var e = this.calc();
      this.render(this.inProgress);
      var t = new y().createTemplate(e);
      this.Container.appendChild(t),
        (EGR.Schnellrechner.submitBtn.style.display = "none"),
        (EGR.Schnellrechner.backBtnLabel.textContent = "Neue Berechnung");
      document.getElementById("egr-teaser").className = "";

      EGR.Schnellrechner.resetBtn.className =
        "border border-solid border-primary text-20 transition-all duration-300 bg-primary text-white px-24 py-16 [@media(hover:hover)]:hover:bg-white [@media(hover:hover)]:hover:text-primary active:focus:bg-white active:focus:text-primary";
      document.getElementById("back-btn").classList.remove("mt-40");
    },
    elterngeld_et: function (p, d) {
      var u = 0,
        h = e(r(p, 2770) - d, 0),
        g = h * n;
      return (
        p > a && (g = r(h * o, s)),
        p > l && p <= a && ((u = n - 1e-3 * t((p - l) / 2)), (g = h * u)),
        p < i && ((u = n + 1e-3 * t((i - p) / 2)), (u = r(u, 1)), (g = h * u)),
        (g = e(g, c)),
        g
      );
    },
    elterngeld_keine_et: function (p) {
      var d = n,
        u = p * d;
      return (
        p > a && (u = r(p * o, s)),
        p > l && p <= a && ((d = n - 1e-3 * t((p - l) / 2)), (u = p * d)),
        p < i && ((d = n + 1e-3 * t((i - p) / 2)), (d = r(d, 1)), (u = p * d)),
        (u = e(u, c)),
        u
      );
    },
    calc: function () {
      var t =
          parseFloat(
            document.getElementById("nettoVorher").value.replace(",", "."),
          ) || 0,
        r =
          parseFloat(
            document.getElementById("nettoNachher").value.replace(",", "."),
          ) || 0,
        n = !!document.getElementsByName("hadChilds")[0].checked,
        o = 0 < r,
        a = parseFloat(document.getElementById("childCounterRow").value),
        l = 1e3 / 12,
        i = e((t - l).toFixed(2), 0),
        s = e((r - l).toFixed(2), 0),
        c = 0,
        p = 0,
        d = 0;
      (d = o ? this.elterngeld_et(i, s) : this.elterngeld_keine_et(i)),
        n && (c = e(d * 0.1, 75)),
        1 < a && (p = 300 * (a - 1));
      var u = Math.round(100 * (d + c + p)) / 100;
      return o && 0 > s && (u = l), u;
    },
    reset: function () {
      this.initRows(),
        (this.inProgress = !0),
        this.render(),
        (this.submitBtn.style.display = "block"),
        (this.backBtnLabel.textContent = "Zur\xFCcksetzen");
      document.getElementById("egr-teaser").className = "hidden";
      document.getElementById("back-btn").classList.add("mt-40");
      EGR.Schnellrechner.resetBtn.className =
        "border border-solid border-primary text-20 transition-all duration-300 bg-transparent text-primary px-24 py-16 [@media(hover:hover)]:hover:bg-primary [@media(hover:hover)]:hover:text-white active:focus:bg-primary active:focus:text-white";
    },
    init: function (e) {
      this.initRows(), e.appendChild(this.templates.form()), this.render();
    },
  };
})();
