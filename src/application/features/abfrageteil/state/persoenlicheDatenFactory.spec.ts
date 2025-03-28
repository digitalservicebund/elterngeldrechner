import { produce } from "immer";
import { describe, expect, it } from "vitest";
import { YesNo } from "./YesNo";
import { persoenlicheDatenOfUi } from "./persoenlicheDatenFactory";
import {
  MonatlichesBrutto,
  StepErwerbstaetigkeitElternteil,
} from "./stepErwerbstaetigkeitSlice";
import { INITIAL_STATE } from "@/application/test-utils";
import { ErwerbsArt } from "@/elterngeldrechner";

describe("persoenlicheDatenFactory", () => {
  it("should create PersoenlicheDaten for Alleinerziehend", () => {
    const state = produce(INITIAL_STATE, (draft) => {
      draft.stepAllgemeineAngaben.alleinerziehend = YesNo.YES;
    });

    const persoenlicheDaten = persoenlicheDatenOfUi(state, "ET1");

    expect(persoenlicheDaten.anzahlKuenftigerKinder).toBe(1);
  });

  describe.each([
    [
      {
        mehrereTaetigkeiten: YesNo.NO,
        vorGeburt: null,
        isNichtSelbststaendig: false,
        isSelbststaendig: false,
        sozialVersicherungsPflichtig: null,
        monatlichesBrutto: null,
      },
      ErwerbsArt.NEIN,
    ],
    [
      {
        mehrereTaetigkeiten: YesNo.NO,
        vorGeburt: YesNo.NO,
        isNichtSelbststaendig: false,
        isSelbststaendig: false,
        sozialVersicherungsPflichtig: null,
        monatlichesBrutto: null,
      },
      ErwerbsArt.NEIN,
    ],
    [
      {
        mehrereTaetigkeiten: YesNo.NO,
        vorGeburt: YesNo.YES,
        isNichtSelbststaendig: true,
        isSelbststaendig: false,
        sozialVersicherungsPflichtig: null,
        monatlichesBrutto: null,
      },
      ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI,
    ],
    [
      {
        mehrereTaetigkeiten: YesNo.NO,
        vorGeburt: YesNo.YES,
        isNichtSelbststaendig: true,
        isSelbststaendig: false,
        sozialVersicherungsPflichtig: YesNo.NO,
        monatlichesBrutto: null,
      },
      ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI,
    ],
    [
      {
        mehrereTaetigkeiten: YesNo.NO,
        vorGeburt: YesNo.YES,
        isNichtSelbststaendig: true,
        isSelbststaendig: false,
        sozialVersicherungsPflichtig: YesNo.YES,
        monatlichesBrutto: null,
      },
      ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI,
    ],
    [
      {
        mehrereTaetigkeiten: YesNo.NO,
        vorGeburt: YesNo.YES,
        isNichtSelbststaendig: true,
        isSelbststaendig: false,
        sozialVersicherungsPflichtig: YesNo.YES,
        monatlichesBrutto: "MehrAlsMiniJob" as MonatlichesBrutto,
      },
      ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI,
    ],
    [
      {
        mehrereTaetigkeiten: YesNo.NO,
        vorGeburt: YesNo.YES,
        isNichtSelbststaendig: true,
        isSelbststaendig: false,
        sozialVersicherungsPflichtig: YesNo.YES,
        monatlichesBrutto: "MiniJob" as MonatlichesBrutto,
      },
      ErwerbsArt.JA_NICHT_SELBST_MINI,
    ],
    [
      {
        mehrereTaetigkeiten: YesNo.NO,
        vorGeburt: YesNo.YES,
        isNichtSelbststaendig: false,
        isSelbststaendig: true,
        sozialVersicherungsPflichtig: null,
        monatlichesBrutto: null,
      },
      ErwerbsArt.JA_SELBSTSTAENDIG,
    ],
    [
      {
        mehrereTaetigkeiten: YesNo.NO,
        vorGeburt: YesNo.YES,
        isNichtSelbststaendig: true,
        isSelbststaendig: true,
        sozialVersicherungsPflichtig: null,
        monatlichesBrutto: null,
      },
      ErwerbsArt.JA_MISCHEINKOMMEN,
    ],
  ])(
    "when ui stepErwerbstaetigkeit is %s, then PersoenlicheDaten.etVorGeburt are %s",
    (
      erwerbstaetigkeit: StepErwerbstaetigkeitElternteil,
      expected: ErwerbsArt,
    ) => {
      it("should create PersoenlicheDaten with ErwerbsArt", () => {
        const state = produce(INITIAL_STATE, (draft) => {
          draft.stepErwerbstaetigkeit.ET1 = erwerbstaetigkeit;
        });

        const persoenlicheDaten = persoenlicheDatenOfUi(state, "ET1");

        expect(persoenlicheDaten.etVorGeburt).toBe(expected);
      });
    },
  );
});
