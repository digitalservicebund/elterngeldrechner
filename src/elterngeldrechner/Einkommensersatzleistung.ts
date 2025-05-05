import { bestimmeErsatzrate } from "./Ersatzrate";
import { aufDenCentRunden } from "./common/math-util";

/**
 * Berechnung der Elterngeldhöhe als Einkommensersatzleistung ohne Boni für den
 * Bezug von Basiselterngeld.
 *
 * Umsetzung des § 2 Absatz 1 bis 4 des Gesetz zum Elterngeld und zur Elternzeit
 * (Bundeselterngeld- und Elternzeitgesetz - BEEG). Vergleiche auch mit dem
 * Anhang II zu den Richtlinien zum BEEG Abschnitt E ohne Schritt II 3a und 3b
 * (sprich exklusive der Boni Schritte)
 *
 * @return Betrag in Euro, auf den Cent gerundet
 */
export function berechneBasiselterngeld(
  elterngeldnettoImBemessungszeitraum: number,
  elterngeldnettoImBezugszeitraum: number = 0,
): number {
  const ersatzleistungsbezugswert = bestimmeErsatzleistungsbezugswert(
    elterngeldnettoImBemessungszeitraum,
    elterngeldnettoImBezugszeitraum,
  );

  const einheitlicheErsatzrate = bestimmeErsatzrate(
    elterngeldnettoImBemessungszeitraum,
  );

  return aufDenCentRunden(
    clampValue(300, ersatzleistungsbezugswert * einheitlicheErsatzrate, 1800),
  );
}

/**
 * Berechnung der Elterngeldhöhe als Einkommensersatzleistung ohne Boni für den
 * Bezug von ElterngeldPlus.
 *
 * Umsetzung des  § 4a Absatz 2 des Gesetz zum Elterngeld und zur Elternzeit
 * (Bundeselterngeld- und Elternzeitgesetz - BEEG).
 *
 * @return Betrag in Euro, auf den Cent gerundet
 */
export function berechneElterngeldPlus(
  elterngeldnettoImBemessungszeitraum: number,
  elterngeldnettoImBezugszeitraum: number = 0,
): number {
  const ersatzleistungsbezugswert = bestimmeErsatzleistungsbezugswert(
    elterngeldnettoImBemessungszeitraum,
    elterngeldnettoImBezugszeitraum,
  );

  const einheitlicheErsatzrate = bestimmeErsatzrate(
    elterngeldnettoImBemessungszeitraum,
  );

  const deckelungsbetrag = aufDenCentRunden(
    berechneBasiselterngeld(elterngeldnettoImBemessungszeitraum) / 2,
  );

  return aufDenCentRunden(
    clampValue(
      150,
      ersatzleistungsbezugswert * einheitlicheErsatzrate,
      deckelungsbetrag,
    ),
  );
}

/**
 * Bestimmt den Referenzwert für welchen Elterngeld als Ersatzleistung gezahlt
 * wird. Umsetzung gemäß § 2 Absatz 3 des Gesetz zum Elterngeld und zur
 * Elternzeit (Bundeselterngeld- und Elternzeitgesetz - BEEG).
 *
 * @return Betrag in Euro, nicht negativ
 */
function bestimmeErsatzleistungsbezugswert(
  elterngeldnettoImBemessungszeitraum: number,
  elterngeldnettoImBezugszeitraum: number,
): number {
  const gedeckeltesElterngeldNettoImBemessungszeitraum = Math.min(
    elterngeldnettoImBemessungszeitraum,
    2770,
  );

  const einkommensunterschiedsbetrag =
    gedeckeltesElterngeldNettoImBemessungszeitraum -
    elterngeldnettoImBezugszeitraum;

  return Math.max(einkommensunterschiedsbetrag, 0);
}

function clampValue(minimum: number, value: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum);
}

if (import.meta.vitest) {
  const { describe, it, test, expect } = import.meta.vitest;

  describe("Einkommensersatzleistung", async () => {
    const {
      assert,
      property,
      float: arbitraryFloat,
      array: arbitraryArray,
    } = await import("fast-check");

    describe("berechne Basiselterngeld", () => {
      it("ergibt immer eine Ersatzleistung mit einem Betrag zwischen 300€ und 1.800€", () =>
        assert(
          property(
            arbitraryNettoeinkommen(),
            arbitraryNettoeinkommen(),
            (
              elterngeldnettoImBemessungszeitraum,
              elterngeldnettoImBezugszeitraum,
            ) => {
              const ersatzleistung = berechneBasiselterngeld(
                elterngeldnettoImBemessungszeitraum,
                elterngeldnettoImBezugszeitraum,
              );

              expect(ersatzleistung).toBeGreaterThanOrEqual(300);
              expect(ersatzleistung).toBeLessThanOrEqual(1800);
            },
          ),
        ));

      it("ist niemals höher als die Differenz zwischen dem Elterngeldnetto im Bemessungszeitraum und Bezugszeitraum, wenn es nicht der Mindestbetrag ist", () =>
        assert(
          property(
            arbitraryNettoeinkommen(),
            arbitraryNettoeinkommen(),
            (
              elterngeldnettoImBemessungszeitraum,
              elterngeldnettoImBezugszeitraum,
            ) => {
              const ersatzleistung = berechneBasiselterngeld(
                elterngeldnettoImBemessungszeitraum,
                elterngeldnettoImBezugszeitraum,
              );

              const istMindestbetrag = ersatzleistung === 300;

              const differenz =
                elterngeldnettoImBemessungszeitraum -
                elterngeldnettoImBezugszeitraum;

              expect(istMindestbetrag || ersatzleistung <= differenz).toBe(
                true,
              );
            },
          ),
        ));

      it("verändert sich nicht mehr für Einkommen im Bemessungszeitraum über 2.770€", () =>
        assert(
          property(
            arbitraryArray(arbitraryNettoeinkommen({ min: 2770 }), {
              minLength: 1,
            }),
            arbitraryNettoeinkommen(),
            (
              elterngeldnettoBetraegeImBemessungszeitraum,
              elterngeldnettoImBezugszeitraum,
            ) => {
              const konstanteErsatzleistung = berechneBasiselterngeld(
                elterngeldnettoBetraegeImBemessungszeitraum[0]!,
                elterngeldnettoImBezugszeitraum,
              );

              elterngeldnettoBetraegeImBemessungszeitraum.forEach(
                (elterngeldnettoImBemessungszeitraum) =>
                  expect(
                    berechneBasiselterngeld(
                      elterngeldnettoImBemessungszeitraum,
                      elterngeldnettoImBezugszeitraum,
                    ),
                  ).toEqual(konstanteErsatzleistung),
              );
            },
          ),
        ));

      test.each([
        { elterngeldnetto: 1240, ersatzleistung: 806.0 },
        { elterngeldnetto: 1238, ersatzleistung: 805.94 },
        { elterngeldnetto: 1236, ersatzleistung: 805.87 },
        { elterngeldnetto: 1234, ersatzleistung: 805.8 },
        { elterngeldnetto: 1232, ersatzleistung: 805.73 },
        { elterngeldnetto: 1230, ersatzleistung: 805.65 },
        { elterngeldnetto: 1228, ersatzleistung: 805.57 },
        { elterngeldnetto: 1226, ersatzleistung: 805.48 },
        { elterngeldnetto: 1224, ersatzleistung: 805.39 },
        { elterngeldnetto: 1222, ersatzleistung: 805.3 },
        { elterngeldnetto: 1220, ersatzleistung: 805.2 },
        { elterngeldnetto: 1218, ersatzleistung: 805.1 },
        { elterngeldnetto: 1216, ersatzleistung: 804.99 },
        { elterngeldnetto: 1214, ersatzleistung: 804.88 },
        { elterngeldnetto: 1212, ersatzleistung: 804.77 },
        { elterngeldnetto: 1210, ersatzleistung: 804.65 },
        { elterngeldnetto: 1208, ersatzleistung: 804.53 },
        { elterngeldnetto: 1206, ersatzleistung: 804.4 },
        { elterngeldnetto: 1204, ersatzleistung: 804.27 },
        { elterngeldnetto: 1202, ersatzleistung: 804.14 },
        { elterngeldnetto: 1200, ersatzleistung: 804.0 },
        { elterngeldnetto: 1000, ersatzleistung: 670.0 },
        { elterngeldnetto: 998, ersatzleistung: 669.66 },
        { elterngeldnetto: 996, ersatzleistung: 669.31 },
        { elterngeldnetto: 994, ersatzleistung: 668.96 },
        { elterngeldnetto: 992, ersatzleistung: 668.61 },
        { elterngeldnetto: 990, ersatzleistung: 668.25 },
        { elterngeldnetto: 988, ersatzleistung: 667.89 },
        { elterngeldnetto: 986, ersatzleistung: 667.52 },
        { elterngeldnetto: 984, ersatzleistung: 667.15 },
        { elterngeldnetto: 982, ersatzleistung: 666.78 },
        { elterngeldnetto: 980, ersatzleistung: 666.4 },
        { elterngeldnetto: 978, ersatzleistung: 666.02 },
        { elterngeldnetto: 976, ersatzleistung: 665.63 },
        { elterngeldnetto: 974, ersatzleistung: 665.24 },
        { elterngeldnetto: 972, ersatzleistung: 664.85 },
        { elterngeldnetto: 970, ersatzleistung: 664.45 },
        { elterngeldnetto: 968, ersatzleistung: 664.05 },
        { elterngeldnetto: 966, ersatzleistung: 663.64 },
        { elterngeldnetto: 964, ersatzleistung: 663.23 },
        { elterngeldnetto: 962, ersatzleistung: 662.82 },
        { elterngeldnetto: 960, ersatzleistung: 662.4 },
        { elterngeldnetto: 958, ersatzleistung: 661.98 },
        { elterngeldnetto: 956, ersatzleistung: 661.55 },
        { elterngeldnetto: 954, ersatzleistung: 661.12 },
        { elterngeldnetto: 952, ersatzleistung: 660.69 },
        { elterngeldnetto: 950, ersatzleistung: 660.25 },
        { elterngeldnetto: 948, ersatzleistung: 659.81 },
        { elterngeldnetto: 946, ersatzleistung: 659.36 },
        { elterngeldnetto: 944, ersatzleistung: 658.91 },
        { elterngeldnetto: 942, ersatzleistung: 658.46 },
        { elterngeldnetto: 940, ersatzleistung: 658.0 },
        { elterngeldnetto: 938, ersatzleistung: 657.54 },
        { elterngeldnetto: 936, ersatzleistung: 657.07 },
        { elterngeldnetto: 934, ersatzleistung: 656.6 },
        { elterngeldnetto: 932, ersatzleistung: 656.13 },
        { elterngeldnetto: 930, ersatzleistung: 655.65 },
        { elterngeldnetto: 928, ersatzleistung: 655.17 },
        { elterngeldnetto: 926, ersatzleistung: 654.68 },
        { elterngeldnetto: 924, ersatzleistung: 654.19 },
        { elterngeldnetto: 922, ersatzleistung: 653.7 },
        { elterngeldnetto: 920, ersatzleistung: 653.2 },
        { elterngeldnetto: 918, ersatzleistung: 652.7 },
        { elterngeldnetto: 916, ersatzleistung: 652.19 },
        { elterngeldnetto: 914, ersatzleistung: 651.68 },
        { elterngeldnetto: 912, ersatzleistung: 651.17 },
        { elterngeldnetto: 910, ersatzleistung: 650.65 },
        { elterngeldnetto: 908, ersatzleistung: 650.13 },
        { elterngeldnetto: 906, ersatzleistung: 649.6 },
        { elterngeldnetto: 904, ersatzleistung: 649.07 },
        { elterngeldnetto: 902, ersatzleistung: 648.54 },
        { elterngeldnetto: 900, ersatzleistung: 648.0 },
        { elterngeldnetto: 898, ersatzleistung: 647.46 },
        { elterngeldnetto: 896, ersatzleistung: 646.91 },
        { elterngeldnetto: 894, ersatzleistung: 646.36 },
        { elterngeldnetto: 892, ersatzleistung: 645.81 },
        { elterngeldnetto: 890, ersatzleistung: 645.25 },
        { elterngeldnetto: 888, ersatzleistung: 644.69 },
        { elterngeldnetto: 886, ersatzleistung: 644.12 },
        { elterngeldnetto: 884, ersatzleistung: 643.55 },
        { elterngeldnetto: 882, ersatzleistung: 642.98 },
        { elterngeldnetto: 880, ersatzleistung: 642.4 },
        { elterngeldnetto: 878, ersatzleistung: 641.82 },
        { elterngeldnetto: 876, ersatzleistung: 641.23 },
        { elterngeldnetto: 874, ersatzleistung: 640.64 },
        { elterngeldnetto: 872, ersatzleistung: 640.05 },
        { elterngeldnetto: 870, ersatzleistung: 639.45 },
        { elterngeldnetto: 868, ersatzleistung: 638.85 },
        { elterngeldnetto: 866, ersatzleistung: 638.24 },
        { elterngeldnetto: 864, ersatzleistung: 637.63 },
        { elterngeldnetto: 862, ersatzleistung: 637.02 },
        { elterngeldnetto: 860, ersatzleistung: 636.4 },
        { elterngeldnetto: 858, ersatzleistung: 635.78 },
        { elterngeldnetto: 856, ersatzleistung: 635.15 },
        { elterngeldnetto: 854, ersatzleistung: 634.52 },
        { elterngeldnetto: 852, ersatzleistung: 633.89 },
        { elterngeldnetto: 850, ersatzleistung: 633.25 },
        { elterngeldnetto: 848, ersatzleistung: 632.61 },
        { elterngeldnetto: 846, ersatzleistung: 631.96 },
        { elterngeldnetto: 844, ersatzleistung: 631.31 },
        { elterngeldnetto: 842, ersatzleistung: 630.66 },
        { elterngeldnetto: 840, ersatzleistung: 630.0 },
        { elterngeldnetto: 838, ersatzleistung: 629.34 },
        { elterngeldnetto: 836, ersatzleistung: 628.67 },
        { elterngeldnetto: 834, ersatzleistung: 628.0 },
        { elterngeldnetto: 832, ersatzleistung: 627.33 },
        { elterngeldnetto: 830, ersatzleistung: 626.65 },
        { elterngeldnetto: 828, ersatzleistung: 625.97 },
        { elterngeldnetto: 826, ersatzleistung: 625.28 },
        { elterngeldnetto: 824, ersatzleistung: 624.59 },
        { elterngeldnetto: 822, ersatzleistung: 623.9 },
        { elterngeldnetto: 820, ersatzleistung: 623.2 },
        { elterngeldnetto: 818, ersatzleistung: 622.5 },
        { elterngeldnetto: 816, ersatzleistung: 621.79 },
        { elterngeldnetto: 814, ersatzleistung: 621.08 },
        { elterngeldnetto: 812, ersatzleistung: 620.37 },
        { elterngeldnetto: 810, ersatzleistung: 619.65 },
        { elterngeldnetto: 808, ersatzleistung: 618.93 },
        { elterngeldnetto: 806, ersatzleistung: 618.2 },
        { elterngeldnetto: 804, ersatzleistung: 617.47 },
        { elterngeldnetto: 802, ersatzleistung: 616.74 },
        { elterngeldnetto: 800, ersatzleistung: 616.0 },
        { elterngeldnetto: 798, ersatzleistung: 615.26 },
        { elterngeldnetto: 796, ersatzleistung: 614.51 },
        { elterngeldnetto: 794, ersatzleistung: 613.76 },
        { elterngeldnetto: 792, ersatzleistung: 613.01 },
        { elterngeldnetto: 790, ersatzleistung: 612.25 },
        { elterngeldnetto: 788, ersatzleistung: 611.49 },
        { elterngeldnetto: 786, ersatzleistung: 610.72 },
        { elterngeldnetto: 784, ersatzleistung: 609.95 },
        { elterngeldnetto: 782, ersatzleistung: 609.18 },
        { elterngeldnetto: 780, ersatzleistung: 608.4 },
        { elterngeldnetto: 778, ersatzleistung: 607.62 },
        { elterngeldnetto: 776, ersatzleistung: 606.83 },
        { elterngeldnetto: 774, ersatzleistung: 606.04 },
        { elterngeldnetto: 772, ersatzleistung: 605.25 },
        { elterngeldnetto: 770, ersatzleistung: 604.45 },
        { elterngeldnetto: 768, ersatzleistung: 603.65 },
        { elterngeldnetto: 766, ersatzleistung: 602.84 },
        { elterngeldnetto: 764, ersatzleistung: 602.03 },
        { elterngeldnetto: 762, ersatzleistung: 601.22 },
        { elterngeldnetto: 760, ersatzleistung: 600.4 },
        { elterngeldnetto: 758, ersatzleistung: 599.58 },
        { elterngeldnetto: 756, ersatzleistung: 598.75 },
        { elterngeldnetto: 754, ersatzleistung: 597.92 },
        { elterngeldnetto: 752, ersatzleistung: 597.09 },
        { elterngeldnetto: 750, ersatzleistung: 596.25 },
        { elterngeldnetto: 748, ersatzleistung: 595.41 },
        { elterngeldnetto: 746, ersatzleistung: 594.56 },
        { elterngeldnetto: 744, ersatzleistung: 593.71 },
        { elterngeldnetto: 742, ersatzleistung: 592.86 },
        { elterngeldnetto: 740, ersatzleistung: 592.0 },
        { elterngeldnetto: 738, ersatzleistung: 591.14 },
        { elterngeldnetto: 736, ersatzleistung: 590.27 },
        { elterngeldnetto: 734, ersatzleistung: 589.4 },
        { elterngeldnetto: 732, ersatzleistung: 588.53 },
        { elterngeldnetto: 730, ersatzleistung: 587.65 },
        { elterngeldnetto: 728, ersatzleistung: 586.77 },
        { elterngeldnetto: 726, ersatzleistung: 585.88 },
        { elterngeldnetto: 724, ersatzleistung: 584.99 },
        { elterngeldnetto: 722, ersatzleistung: 584.1 },
        { elterngeldnetto: 720, ersatzleistung: 583.2 },
        { elterngeldnetto: 718, ersatzleistung: 582.3 },
        { elterngeldnetto: 716, ersatzleistung: 581.39 },
        { elterngeldnetto: 714, ersatzleistung: 580.48 },
        { elterngeldnetto: 712, ersatzleistung: 579.57 },
        { elterngeldnetto: 710, ersatzleistung: 578.65 },
        { elterngeldnetto: 708, ersatzleistung: 577.73 },
        { elterngeldnetto: 706, ersatzleistung: 576.8 },
        { elterngeldnetto: 704, ersatzleistung: 575.87 },
        { elterngeldnetto: 702, ersatzleistung: 574.94 },
        { elterngeldnetto: 700, ersatzleistung: 574.0 },
        { elterngeldnetto: 698, ersatzleistung: 573.06 },
        { elterngeldnetto: 696, ersatzleistung: 572.11 },
        { elterngeldnetto: 694, ersatzleistung: 571.16 },
        { elterngeldnetto: 692, ersatzleistung: 570.21 },
        { elterngeldnetto: 690, ersatzleistung: 569.25 },
        { elterngeldnetto: 688, ersatzleistung: 568.29 },
        { elterngeldnetto: 686, ersatzleistung: 567.32 },
        { elterngeldnetto: 684, ersatzleistung: 566.35 },
        { elterngeldnetto: 682, ersatzleistung: 565.38 },
        { elterngeldnetto: 680, ersatzleistung: 564.4 },
        { elterngeldnetto: 678, ersatzleistung: 563.42 },
        { elterngeldnetto: 676, ersatzleistung: 562.43 },
        { elterngeldnetto: 674, ersatzleistung: 561.44 },
        { elterngeldnetto: 672, ersatzleistung: 560.45 },
        { elterngeldnetto: 670, ersatzleistung: 559.45 },
        { elterngeldnetto: 668, ersatzleistung: 558.45 },
        { elterngeldnetto: 666, ersatzleistung: 557.44 },
        { elterngeldnetto: 664, ersatzleistung: 556.43 },
        { elterngeldnetto: 662, ersatzleistung: 555.42 },
        { elterngeldnetto: 660, ersatzleistung: 554.4 },
        { elterngeldnetto: 658, ersatzleistung: 553.38 },
        { elterngeldnetto: 656, ersatzleistung: 552.35 },
        { elterngeldnetto: 654, ersatzleistung: 551.32 },
        { elterngeldnetto: 652, ersatzleistung: 550.29 },
        { elterngeldnetto: 650, ersatzleistung: 549.25 },
        { elterngeldnetto: 648, ersatzleistung: 548.21 },
        { elterngeldnetto: 646, ersatzleistung: 547.16 },
        { elterngeldnetto: 644, ersatzleistung: 546.11 },
        { elterngeldnetto: 642, ersatzleistung: 545.06 },
        { elterngeldnetto: 640, ersatzleistung: 544.0 },
        { elterngeldnetto: 638, ersatzleistung: 542.94 },
        { elterngeldnetto: 636, ersatzleistung: 541.87 },
        { elterngeldnetto: 634, ersatzleistung: 540.8 },
        { elterngeldnetto: 632, ersatzleistung: 539.73 },
        { elterngeldnetto: 630, ersatzleistung: 538.65 },
        { elterngeldnetto: 628, ersatzleistung: 537.57 },
        { elterngeldnetto: 626, ersatzleistung: 536.48 },
        { elterngeldnetto: 624, ersatzleistung: 535.39 },
        { elterngeldnetto: 622, ersatzleistung: 534.3 },
        { elterngeldnetto: 620, ersatzleistung: 533.2 },
        { elterngeldnetto: 618, ersatzleistung: 532.1 },
        { elterngeldnetto: 616, ersatzleistung: 530.99 },
        { elterngeldnetto: 614, ersatzleistung: 529.88 },
        { elterngeldnetto: 612, ersatzleistung: 528.77 },
        { elterngeldnetto: 610, ersatzleistung: 527.65 },
        { elterngeldnetto: 608, ersatzleistung: 526.53 },
        { elterngeldnetto: 606, ersatzleistung: 525.4 },
        { elterngeldnetto: 604, ersatzleistung: 524.27 },
        { elterngeldnetto: 602, ersatzleistung: 523.14 },
        { elterngeldnetto: 600, ersatzleistung: 522.0 },
        { elterngeldnetto: 598, ersatzleistung: 520.86 },
        { elterngeldnetto: 596, ersatzleistung: 519.71 },
        { elterngeldnetto: 594, ersatzleistung: 518.56 },
        { elterngeldnetto: 592, ersatzleistung: 517.41 },
        { elterngeldnetto: 590, ersatzleistung: 516.25 },
        { elterngeldnetto: 588, ersatzleistung: 515.09 },
        { elterngeldnetto: 586, ersatzleistung: 513.92 },
        { elterngeldnetto: 584, ersatzleistung: 512.75 },
        { elterngeldnetto: 582, ersatzleistung: 511.58 },
        { elterngeldnetto: 580, ersatzleistung: 510.4 },
        { elterngeldnetto: 578, ersatzleistung: 509.22 },
        { elterngeldnetto: 576, ersatzleistung: 508.03 },
        { elterngeldnetto: 574, ersatzleistung: 506.84 },
        { elterngeldnetto: 572, ersatzleistung: 505.65 },
        { elterngeldnetto: 570, ersatzleistung: 504.45 },
        { elterngeldnetto: 568, ersatzleistung: 503.25 },
        { elterngeldnetto: 566, ersatzleistung: 502.04 },
        { elterngeldnetto: 564, ersatzleistung: 500.83 },
        { elterngeldnetto: 562, ersatzleistung: 499.62 },
        { elterngeldnetto: 560, ersatzleistung: 498.4 },
        { elterngeldnetto: 558, ersatzleistung: 497.18 },
        { elterngeldnetto: 556, ersatzleistung: 495.95 },
        { elterngeldnetto: 554, ersatzleistung: 494.72 },
        { elterngeldnetto: 552, ersatzleistung: 493.49 },
        { elterngeldnetto: 550, ersatzleistung: 492.25 },
        { elterngeldnetto: 548, ersatzleistung: 491.01 },
        { elterngeldnetto: 546, ersatzleistung: 489.76 },
        { elterngeldnetto: 544, ersatzleistung: 488.51 },
        { elterngeldnetto: 542, ersatzleistung: 487.26 },
        { elterngeldnetto: 540, ersatzleistung: 486.0 },
        { elterngeldnetto: 538, ersatzleistung: 484.74 },
        { elterngeldnetto: 536, ersatzleistung: 483.47 },
        { elterngeldnetto: 534, ersatzleistung: 482.2 },
        { elterngeldnetto: 532, ersatzleistung: 480.93 },
        { elterngeldnetto: 530, ersatzleistung: 479.65 },
        { elterngeldnetto: 528, ersatzleistung: 478.37 },
        { elterngeldnetto: 526, ersatzleistung: 477.08 },
        { elterngeldnetto: 524, ersatzleistung: 475.79 },
        { elterngeldnetto: 522, ersatzleistung: 474.5 },
        { elterngeldnetto: 520, ersatzleistung: 473.2 },
        { elterngeldnetto: 518, ersatzleistung: 471.9 },
        { elterngeldnetto: 516, ersatzleistung: 470.59 },
        { elterngeldnetto: 514, ersatzleistung: 469.28 },
        { elterngeldnetto: 512, ersatzleistung: 467.97 },
        { elterngeldnetto: 510, ersatzleistung: 466.65 },
        { elterngeldnetto: 508, ersatzleistung: 465.33 },
        { elterngeldnetto: 506, ersatzleistung: 464.0 },
        { elterngeldnetto: 504, ersatzleistung: 462.67 },
        { elterngeldnetto: 502, ersatzleistung: 461.34 },
        { elterngeldnetto: 500, ersatzleistung: 460.0 },
        { elterngeldnetto: 498, ersatzleistung: 458.66 },
        { elterngeldnetto: 496, ersatzleistung: 457.31 },
        { elterngeldnetto: 494, ersatzleistung: 455.96 },
        { elterngeldnetto: 492, ersatzleistung: 454.61 },
        { elterngeldnetto: 490, ersatzleistung: 453.25 },
        { elterngeldnetto: 488, ersatzleistung: 451.89 },
        { elterngeldnetto: 486, ersatzleistung: 450.52 },
        { elterngeldnetto: 484, ersatzleistung: 449.15 },
        { elterngeldnetto: 482, ersatzleistung: 447.78 },
        { elterngeldnetto: 480, ersatzleistung: 446.4 },
        { elterngeldnetto: 478, ersatzleistung: 445.02 },
        { elterngeldnetto: 476, ersatzleistung: 443.63 },
        { elterngeldnetto: 474, ersatzleistung: 442.24 },
        { elterngeldnetto: 472, ersatzleistung: 440.85 },
        { elterngeldnetto: 470, ersatzleistung: 439.45 },
        { elterngeldnetto: 468, ersatzleistung: 438.05 },
        { elterngeldnetto: 466, ersatzleistung: 436.64 },
        { elterngeldnetto: 464, ersatzleistung: 435.23 },
        { elterngeldnetto: 462, ersatzleistung: 433.82 },
        { elterngeldnetto: 460, ersatzleistung: 432.4 },
        { elterngeldnetto: 458, ersatzleistung: 430.98 },
        { elterngeldnetto: 456, ersatzleistung: 429.55 },
        { elterngeldnetto: 454, ersatzleistung: 428.12 },
        { elterngeldnetto: 452, ersatzleistung: 426.69 },
        { elterngeldnetto: 450, ersatzleistung: 425.25 },
        { elterngeldnetto: 448, ersatzleistung: 423.81 },
        { elterngeldnetto: 446, ersatzleistung: 422.36 },
        { elterngeldnetto: 444, ersatzleistung: 420.91 },
        { elterngeldnetto: 442, ersatzleistung: 419.46 },
        { elterngeldnetto: 440, ersatzleistung: 418.0 },
        { elterngeldnetto: 438, ersatzleistung: 416.54 },
        { elterngeldnetto: 436, ersatzleistung: 415.07 },
        { elterngeldnetto: 434, ersatzleistung: 413.6 },
        { elterngeldnetto: 432, ersatzleistung: 412.13 },
        { elterngeldnetto: 430, ersatzleistung: 410.65 },
        { elterngeldnetto: 428, ersatzleistung: 409.17 },
        { elterngeldnetto: 426, ersatzleistung: 407.68 },
        { elterngeldnetto: 424, ersatzleistung: 406.19 },
        { elterngeldnetto: 422, ersatzleistung: 404.7 },
        { elterngeldnetto: 420, ersatzleistung: 403.2 },
        { elterngeldnetto: 418, ersatzleistung: 401.7 },
        { elterngeldnetto: 416, ersatzleistung: 400.19 },
        { elterngeldnetto: 414, ersatzleistung: 398.68 },
        { elterngeldnetto: 412, ersatzleistung: 397.17 },
        { elterngeldnetto: 410, ersatzleistung: 395.65 },
        { elterngeldnetto: 408, ersatzleistung: 394.13 },
        { elterngeldnetto: 406, ersatzleistung: 392.6 },
        { elterngeldnetto: 404, ersatzleistung: 391.07 },
        { elterngeldnetto: 402, ersatzleistung: 389.54 },
        { elterngeldnetto: 400, ersatzleistung: 388.0 },
        { elterngeldnetto: 398, ersatzleistung: 386.46 },
        { elterngeldnetto: 396, ersatzleistung: 384.91 },
        { elterngeldnetto: 394, ersatzleistung: 383.36 },
        { elterngeldnetto: 392, ersatzleistung: 381.81 },
        { elterngeldnetto: 390, ersatzleistung: 380.25 },
        { elterngeldnetto: 388, ersatzleistung: 378.69 },
        { elterngeldnetto: 386, ersatzleistung: 377.12 },
        { elterngeldnetto: 384, ersatzleistung: 375.55 },
        { elterngeldnetto: 382, ersatzleistung: 373.98 },
        { elterngeldnetto: 380, ersatzleistung: 372.4 },
        { elterngeldnetto: 378, ersatzleistung: 370.82 },
        { elterngeldnetto: 376, ersatzleistung: 369.23 },
        { elterngeldnetto: 374, ersatzleistung: 367.64 },
        { elterngeldnetto: 372, ersatzleistung: 366.05 },
        { elterngeldnetto: 370, ersatzleistung: 364.45 },
        { elterngeldnetto: 368, ersatzleistung: 362.85 },
        { elterngeldnetto: 366, ersatzleistung: 361.24 },
        { elterngeldnetto: 364, ersatzleistung: 359.63 },
        { elterngeldnetto: 362, ersatzleistung: 358.02 },
        { elterngeldnetto: 360, ersatzleistung: 356.4 },
        { elterngeldnetto: 358, ersatzleistung: 354.78 },
        { elterngeldnetto: 356, ersatzleistung: 353.15 },
        { elterngeldnetto: 354, ersatzleistung: 351.52 },
        { elterngeldnetto: 352, ersatzleistung: 349.89 },
        { elterngeldnetto: 350, ersatzleistung: 348.25 },
        { elterngeldnetto: 348, ersatzleistung: 346.61 },
        { elterngeldnetto: 346, ersatzleistung: 344.96 },
        { elterngeldnetto: 344, ersatzleistung: 343.31 },
        { elterngeldnetto: 342, ersatzleistung: 341.66 },
        { elterngeldnetto: 340, ersatzleistung: 340.0 },
      ])(
        "Dumbatzi-Spickliste - Eintrag für ein Elterngeldnetto von $elterngeldnetto€",
        ({ elterngeldnetto, ersatzleistung }) => {
          expect(berechneBasiselterngeld(elterngeldnetto)).toEqual(
            ersatzleistung,
          );
        },
      );
    });

    describe("berechne ElterngeldPlus", () => {
      it("ergibt immer eine Ersatzleistung mit einem Betrag zwischen 150€ und 1.800€", () =>
        assert(
          property(
            arbitraryNettoeinkommen(),
            arbitraryNettoeinkommen(),
            (
              elterngeldnettoImBemessungszeitraum,
              elterngeldnettoImBezugszeitraum,
            ) => {
              const ersatzleistung = berechneElterngeldPlus(
                elterngeldnettoImBemessungszeitraum,
                elterngeldnettoImBezugszeitraum,
              );

              expect(ersatzleistung).toBeGreaterThanOrEqual(150);
              expect(ersatzleistung).toBeLessThanOrEqual(1800);
            },
          ),
        ));

      it("ist nie höher als die Hälfte des Basiselterngeld ohne Einkommen im Bezugszeitraum", () =>
        assert(
          property(
            arbitraryNettoeinkommen(),
            arbitraryNettoeinkommen(),
            (
              elterngeldnettoImBemessungszeitraum,
              elterngeldnettoImBezugszeitraum,
            ) => {
              const halbesBasiselterngeld = aufDenCentRunden(
                berechneBasiselterngeld(elterngeldnettoImBemessungszeitraum) /
                  2,
              );

              expect(
                berechneElterngeldPlus(
                  elterngeldnettoImBemessungszeitraum,
                  elterngeldnettoImBezugszeitraum,
                ),
              ).toBeLessThanOrEqual(halbesBasiselterngeld);
            },
          ),
        ));

      it("verändert sich nicht mehr für Einkommen im Bemessungszeitraum über 2.770€", () =>
        assert(
          property(
            arbitraryArray(arbitraryNettoeinkommen({ min: 2770 }), {
              minLength: 1,
            }),
            arbitraryNettoeinkommen(),
            (
              elterngeldnettoBetraegeImBemessungszeitraum,
              elterngeldnettoImBezugszeitraum,
            ) => {
              const konstanteErsatzleistung = berechneElterngeldPlus(
                elterngeldnettoBetraegeImBemessungszeitraum[0]!,
                elterngeldnettoImBezugszeitraum,
              );

              elterngeldnettoBetraegeImBemessungszeitraum.forEach(
                (elterngeldnettoImBemessungszeitraum) => {
                  const ersatzleistung = berechneElterngeldPlus(
                    elterngeldnettoImBemessungszeitraum,
                    elterngeldnettoImBezugszeitraum,
                  );

                  expect(ersatzleistung).toEqual(konstanteErsatzleistung);
                },
              );
            },
          ),
        ));

      test("Beispiel 1 aus den Richtlinien zum BEEG", () =>
        expect(berechneElterngeldPlus(2000, 900)).toBe(650));

      test("Beispiel 2 aus den Richtlinien zum BEEG", () =>
        expect(berechneElterngeldPlus(2000, 1500)).toBe(325));

      // Example is wrong and communicated to the ministry.
      test.skip("Beispiel 3 aus den Richtlinien zum BEEG", () =>
        expect(berechneElterngeldPlus(520, 337.5)).toBe(150));
    });

    /**
     * Arbitrary values for Nettoeinkommen. Tiny wrapper around the library native
     * arbitrary generator for floating point numbers. It simply sets same sane
     * defaults to produce more "meaningful" values to keep the test cases
     * "focused". Like negatives values are interesting, but actually we don't
     * care about them. So we don't wanna waste too many runs. Though, the
     * boundaries shouldn't be too tight, so future changes would be suddenly no
     * more covered.
     */
    function arbitraryNettoeinkommen(constraints?: { min: number }) {
      return arbitraryFloat({
        noNaN: true,
        min: 0,
        max: 8_000,
        ...constraints,
      });
    }
  });
}
