/**
 * Diese Funktion ist eine sehr direkte Übersetzung aus relevanten Teilen des § 2
 * Absatz 1 und 2 im Gesetz zum Elterngeld und zur Elternzeit (Bundeselterngeld-
 * und Elternzeitgesetz - BEEG).
 *
 * @return Ersatzrate als Dezimalfaktor zwischen 0 und 1, auf Promille gerundet
 */
/*
 * Implementation Details:
 * Values which would usually be criticized as magic numbers are used
 * purposefully. They help to follow the implementation more easily when
 * compared along with the law. The law itself defines no names for these
 * numbers. So any naming would be made up and hinders the readability.
 */
export function bestimmeErsatzrate(bezugswert: number): number {
  if (bezugswert < 1000) {
    const zuschlag = Math.floor((1000 - bezugswert) / 2) * 0.001;
    const ersatzrate = aufDiePromilleRunden(0.67 + zuschlag);
    return Math.min(ersatzrate, 1);
  } else if (bezugswert < 1200) {
    return 0.67;
  } else if (bezugswert < 1240) {
    const abschlag = Math.floor((bezugswert - 1200) / 2) * 0.001;
    return aufDiePromilleRunden(0.67 - abschlag);
  } else {
    return 0.65;
  }
}

/**
 * This is necessary due to some arithmetic floating point issues. Practically
 * it happens for numerous of Bezugswerte that the Ersatzrate would be off by
 * 1*10^-16. Which theoretically could be ignored in the overall context of the
 * Elterngeld calculation. Especially after rounding monetary values to a cent.
 * Anyhow, it is desirable to to produce exact values that are presentable and
 * which align exactly with the Dumbatzi-Spickliste (also for testing purposes).
 *
 * Practice shows: potential arithmetic inaccuracies caused in this function
 * produce no noticeable issues.
 *
 * Example:
 * ```typescript
 * aufDiePromilleRunden(0.4720000000000001) === 0.472
 * ```
 */
function aufDiePromilleRunden(dezimalfaktor: number): number {
  return Math.round(dezimalfaktor * 1000) / 1000;
}

if (import.meta.vitest) {
  const { describe, it, test, expect } = import.meta.vitest;

  describe("bestimme Ersatzrate", async () => {
    const {
      assert,
      property,
      float: arbitraryFloat,
    } = await import("fast-check");

    it("ergibt immer eine Ersatzrate zwischen 65% und 100%", () =>
      assert(
        property(arbitraryBezugswert(), (bezugswert) => {
          const ersatzrate = bestimmeErsatzrate(bezugswert);

          expect(ersatzrate).toBeGreaterThanOrEqual(0.65);
          expect(ersatzrate).toBeLessThanOrEqual(1.0);
        }),
      ));

    describe("für Bezugswerte unter 1000€", () => {
      test.each([
        { bezugswert: 1, ersatzrate: 1.0 },
        { bezugswert: 170, ersatzrate: 1.0 },
        { bezugswert: 340, ersatzrate: 1.0 },
        { bezugswert: 360, ersatzrate: 0.99 },
        { bezugswert: 500, ersatzrate: 0.92 },
        { bezugswert: 750, ersatzrate: 0.795 },
        { bezugswert: 990, ersatzrate: 0.675 },
        { bezugswert: 998, ersatzrate: 0.671 },
        { bezugswert: 999, ersatzrate: 0.67 },
      ])(
        "erhöht sich Ersatzrate von 67% um 0.1% für je 2€ die der Bezugswert von $bezugswert unter 1000€ liegt auf $ersatzrate",
        ({ bezugswert, ersatzrate }) =>
          expect(bestimmeErsatzrate(bezugswert)).toEqual(ersatzrate),
      );

      it("ergibt immer eine Ersatzrate zwischen 67% und 100%", () =>
        assert(
          property(arbitraryBezugswert({ max: 1000 }), (bezugswert) => {
            const ersatzrate = bestimmeErsatzrate(bezugswert);

            expect(ersatzrate).toBeGreaterThanOrEqual(0.65);
            expect(ersatzrate).toBeLessThanOrEqual(1.0);
          }),
          {
            examples: [[999.99], [1000]], // Grenzwerte
          },
        ));

      it("ergibt immer eine Ersatzrate von 1.0 wenn der Bezugswert unter 340€ liegt", () =>
        assert(
          property(arbitraryBezugswert({ max: 340 }), (bezugswert) => {
            expect(bestimmeErsatzrate(bezugswert)).toEqual(1.0);
          }),
        ));
    });

    describe("für Bezugswerte von 1000€ bis 1200€", () => {
      test("ist die Ersatzrate konstant 67%", () =>
        assert(
          property(
            arbitraryBezugswert({ min: 1000, max: 1200 }),
            (bezugswert) => {
              expect(bestimmeErsatzrate(bezugswert)).toEqual(0.67);
            },
          ),
          {
            examples: [[1000], [1000.01], [1199.99], [1200]], // Grenzwerte
          },
        ));
    });

    describe("für Bezugswerte von 1200€ bis 1240€", () => {
      test.each([
        { bezugswert: 1200, ersatzrate: 0.67 },
        { bezugswert: 1201, ersatzrate: 0.67 },
        { bezugswert: 1202, ersatzrate: 0.669 },
        { bezugswert: 1220, ersatzrate: 0.66 },
        { bezugswert: 1238, ersatzrate: 0.651 },
        { bezugswert: 1239, ersatzrate: 0.651 },
        { bezugswert: 1240, ersatzrate: 0.65 },
      ])(
        "vermindert sich die Ersatzrate von 0.67% um 0.1% für je 2€ die der Bezugswert von $bezugswert über 1200€ liegt auf $ersatzrate",
        ({ bezugswert, ersatzrate }) =>
          expect(bestimmeErsatzrate(bezugswert)).toEqual(ersatzrate),
      );

      it("ergibt immer eine Ersatzrate zwischen 0.65 und 0.67", () =>
        assert(
          property(
            arbitraryBezugswert({ min: 1200, max: 1240 }),
            (bezugswert) => {
              const ersatzrate = bestimmeErsatzrate(bezugswert);

              expect(ersatzrate).toBeGreaterThanOrEqual(0.65);
              expect(ersatzrate).toBeLessThanOrEqual(0.67);
            },
          ),
          {
            examples: [[1200], [1200.01], [1239.99], [1240]], // Grenzwerte
          },
        ));
    });

    describe("für Bezugswerte ab 1240€", () => {
      test("ist die Ersatzrate konstant 65%", () =>
        assert(
          property(arbitraryBezugswert({ min: 1240 }), (bezugswert) => {
            expect(bestimmeErsatzrate(bezugswert)).toEqual(0.65);
          }),
          {
            examples: [[1240, 1240.01]], // Grenzwerte
          },
        ));
    });

    test.each([
      { bezugswert: 1240, ersatzrate: 0.65 },
      { bezugswert: 1238, ersatzrate: 0.651 },
      { bezugswert: 1236, ersatzrate: 0.652 },
      { bezugswert: 1234, ersatzrate: 0.653 },
      { bezugswert: 1232, ersatzrate: 0.654 },
      { bezugswert: 1230, ersatzrate: 0.655 },
      { bezugswert: 1228, ersatzrate: 0.656 },
      { bezugswert: 1226, ersatzrate: 0.657 },
      { bezugswert: 1224, ersatzrate: 0.658 },
      { bezugswert: 1222, ersatzrate: 0.659 },
      { bezugswert: 1220, ersatzrate: 0.66 },
      { bezugswert: 1218, ersatzrate: 0.661 },
      { bezugswert: 1216, ersatzrate: 0.662 },
      { bezugswert: 1214, ersatzrate: 0.663 },
      { bezugswert: 1212, ersatzrate: 0.664 },
      { bezugswert: 1210, ersatzrate: 0.665 },
      { bezugswert: 1208, ersatzrate: 0.666 },
      { bezugswert: 1206, ersatzrate: 0.667 },
      { bezugswert: 1204, ersatzrate: 0.668 },
      { bezugswert: 1202, ersatzrate: 0.669 },
      { bezugswert: 1200, ersatzrate: 0.67 },
      { bezugswert: 1000, ersatzrate: 0.67 },
      { bezugswert: 998, ersatzrate: 0.671 },
      { bezugswert: 996, ersatzrate: 0.672 },
      { bezugswert: 994, ersatzrate: 0.673 },
      { bezugswert: 992, ersatzrate: 0.674 },
      { bezugswert: 990, ersatzrate: 0.675 },
      { bezugswert: 988, ersatzrate: 0.676 },
      { bezugswert: 986, ersatzrate: 0.677 },
      { bezugswert: 984, ersatzrate: 0.678 },
      { bezugswert: 982, ersatzrate: 0.679 },
      { bezugswert: 980, ersatzrate: 0.68 },
      { bezugswert: 978, ersatzrate: 0.681 },
      { bezugswert: 976, ersatzrate: 0.682 },
      { bezugswert: 974, ersatzrate: 0.683 },
      { bezugswert: 972, ersatzrate: 0.684 },
      { bezugswert: 970, ersatzrate: 0.685 },
      { bezugswert: 968, ersatzrate: 0.686 },
      { bezugswert: 966, ersatzrate: 0.687 },
      { bezugswert: 964, ersatzrate: 0.688 },
      { bezugswert: 962, ersatzrate: 0.689 },
      { bezugswert: 960, ersatzrate: 0.69 },
      { bezugswert: 958, ersatzrate: 0.691 },
      { bezugswert: 956, ersatzrate: 0.692 },
      { bezugswert: 954, ersatzrate: 0.693 },
      { bezugswert: 952, ersatzrate: 0.694 },
      { bezugswert: 950, ersatzrate: 0.695 },
      { bezugswert: 948, ersatzrate: 0.696 },
      { bezugswert: 946, ersatzrate: 0.697 },
      { bezugswert: 944, ersatzrate: 0.698 },
      { bezugswert: 942, ersatzrate: 0.699 },
      { bezugswert: 940, ersatzrate: 0.7 },
      { bezugswert: 938, ersatzrate: 0.701 },
      { bezugswert: 936, ersatzrate: 0.702 },
      { bezugswert: 934, ersatzrate: 0.703 },
      { bezugswert: 932, ersatzrate: 0.704 },
      { bezugswert: 930, ersatzrate: 0.705 },
      { bezugswert: 928, ersatzrate: 0.706 },
      { bezugswert: 926, ersatzrate: 0.707 },
      { bezugswert: 924, ersatzrate: 0.708 },
      { bezugswert: 922, ersatzrate: 0.709 },
      { bezugswert: 920, ersatzrate: 0.71 },
      { bezugswert: 918, ersatzrate: 0.711 },
      { bezugswert: 916, ersatzrate: 0.712 },
      { bezugswert: 914, ersatzrate: 0.713 },
      { bezugswert: 912, ersatzrate: 0.714 },
      { bezugswert: 910, ersatzrate: 0.715 },
      { bezugswert: 908, ersatzrate: 0.716 },
      { bezugswert: 906, ersatzrate: 0.717 },
      { bezugswert: 904, ersatzrate: 0.718 },
      { bezugswert: 902, ersatzrate: 0.719 },
      { bezugswert: 900, ersatzrate: 0.72 },
      { bezugswert: 898, ersatzrate: 0.721 },
      { bezugswert: 896, ersatzrate: 0.722 },
      { bezugswert: 894, ersatzrate: 0.723 },
      { bezugswert: 892, ersatzrate: 0.724 },
      { bezugswert: 890, ersatzrate: 0.725 },
      { bezugswert: 888, ersatzrate: 0.726 },
      { bezugswert: 886, ersatzrate: 0.727 },
      { bezugswert: 884, ersatzrate: 0.728 },
      { bezugswert: 882, ersatzrate: 0.729 },
      { bezugswert: 880, ersatzrate: 0.73 },
      { bezugswert: 878, ersatzrate: 0.731 },
      { bezugswert: 876, ersatzrate: 0.732 },
      { bezugswert: 874, ersatzrate: 0.733 },
      { bezugswert: 872, ersatzrate: 0.734 },
      { bezugswert: 870, ersatzrate: 0.735 },
      { bezugswert: 868, ersatzrate: 0.736 },
      { bezugswert: 866, ersatzrate: 0.737 },
      { bezugswert: 864, ersatzrate: 0.738 },
      { bezugswert: 862, ersatzrate: 0.739 },
      { bezugswert: 860, ersatzrate: 0.74 },
      { bezugswert: 858, ersatzrate: 0.741 },
      { bezugswert: 856, ersatzrate: 0.742 },
      { bezugswert: 854, ersatzrate: 0.743 },
      { bezugswert: 852, ersatzrate: 0.744 },
      { bezugswert: 850, ersatzrate: 0.745 },
      { bezugswert: 848, ersatzrate: 0.746 },
      { bezugswert: 846, ersatzrate: 0.747 },
      { bezugswert: 844, ersatzrate: 0.748 },
      { bezugswert: 842, ersatzrate: 0.749 },
      { bezugswert: 840, ersatzrate: 0.75 },
      { bezugswert: 838, ersatzrate: 0.751 },
      { bezugswert: 836, ersatzrate: 0.752 },
      { bezugswert: 834, ersatzrate: 0.753 },
      { bezugswert: 832, ersatzrate: 0.754 },
      { bezugswert: 830, ersatzrate: 0.755 },
      { bezugswert: 828, ersatzrate: 0.756 },
      { bezugswert: 826, ersatzrate: 0.757 },
      { bezugswert: 824, ersatzrate: 0.758 },
      { bezugswert: 822, ersatzrate: 0.759 },
      { bezugswert: 820, ersatzrate: 0.76 },
      { bezugswert: 818, ersatzrate: 0.761 },
      { bezugswert: 816, ersatzrate: 0.762 },
      { bezugswert: 814, ersatzrate: 0.763 },
      { bezugswert: 812, ersatzrate: 0.764 },
      { bezugswert: 810, ersatzrate: 0.765 },
      { bezugswert: 808, ersatzrate: 0.766 },
      { bezugswert: 806, ersatzrate: 0.767 },
      { bezugswert: 804, ersatzrate: 0.768 },
      { bezugswert: 802, ersatzrate: 0.769 },
      { bezugswert: 800, ersatzrate: 0.77 },
      { bezugswert: 798, ersatzrate: 0.771 },
      { bezugswert: 796, ersatzrate: 0.772 },
      { bezugswert: 794, ersatzrate: 0.773 },
      { bezugswert: 792, ersatzrate: 0.774 },
      { bezugswert: 790, ersatzrate: 0.775 },
      { bezugswert: 788, ersatzrate: 0.776 },
      { bezugswert: 786, ersatzrate: 0.777 },
      { bezugswert: 784, ersatzrate: 0.778 },
      { bezugswert: 782, ersatzrate: 0.779 },
      { bezugswert: 780, ersatzrate: 0.78 },
      { bezugswert: 778, ersatzrate: 0.781 },
      { bezugswert: 776, ersatzrate: 0.782 },
      { bezugswert: 774, ersatzrate: 0.783 },
      { bezugswert: 772, ersatzrate: 0.784 },
      { bezugswert: 770, ersatzrate: 0.785 },
      { bezugswert: 768, ersatzrate: 0.786 },
      { bezugswert: 766, ersatzrate: 0.787 },
      { bezugswert: 764, ersatzrate: 0.788 },
      { bezugswert: 762, ersatzrate: 0.789 },
      { bezugswert: 760, ersatzrate: 0.79 },
      { bezugswert: 758, ersatzrate: 0.791 },
      { bezugswert: 756, ersatzrate: 0.792 },
      { bezugswert: 754, ersatzrate: 0.793 },
      { bezugswert: 752, ersatzrate: 0.794 },
      { bezugswert: 750, ersatzrate: 0.795 },
      { bezugswert: 748, ersatzrate: 0.796 },
      { bezugswert: 746, ersatzrate: 0.797 },
      { bezugswert: 744, ersatzrate: 0.798 },
      { bezugswert: 742, ersatzrate: 0.799 },
      { bezugswert: 740, ersatzrate: 0.8 },
      { bezugswert: 738, ersatzrate: 0.801 },
      { bezugswert: 736, ersatzrate: 0.802 },
      { bezugswert: 734, ersatzrate: 0.803 },
      { bezugswert: 732, ersatzrate: 0.804 },
      { bezugswert: 730, ersatzrate: 0.805 },
      { bezugswert: 728, ersatzrate: 0.806 },
      { bezugswert: 726, ersatzrate: 0.807 },
      { bezugswert: 724, ersatzrate: 0.808 },
      { bezugswert: 722, ersatzrate: 0.809 },
      { bezugswert: 720, ersatzrate: 0.81 },
      { bezugswert: 718, ersatzrate: 0.811 },
      { bezugswert: 716, ersatzrate: 0.812 },
      { bezugswert: 714, ersatzrate: 0.813 },
      { bezugswert: 712, ersatzrate: 0.814 },
      { bezugswert: 710, ersatzrate: 0.815 },
      { bezugswert: 708, ersatzrate: 0.816 },
      { bezugswert: 706, ersatzrate: 0.817 },
      { bezugswert: 704, ersatzrate: 0.818 },
      { bezugswert: 702, ersatzrate: 0.819 },
      { bezugswert: 700, ersatzrate: 0.82 },
      { bezugswert: 698, ersatzrate: 0.821 },
      { bezugswert: 696, ersatzrate: 0.822 },
      { bezugswert: 694, ersatzrate: 0.823 },
      { bezugswert: 692, ersatzrate: 0.824 },
      { bezugswert: 690, ersatzrate: 0.825 },
      { bezugswert: 688, ersatzrate: 0.826 },
      { bezugswert: 686, ersatzrate: 0.827 },
      { bezugswert: 684, ersatzrate: 0.828 },
      { bezugswert: 682, ersatzrate: 0.829 },
      { bezugswert: 680, ersatzrate: 0.83 },
      { bezugswert: 678, ersatzrate: 0.831 },
      { bezugswert: 676, ersatzrate: 0.832 },
      { bezugswert: 674, ersatzrate: 0.833 },
      { bezugswert: 672, ersatzrate: 0.834 },
      { bezugswert: 670, ersatzrate: 0.835 },
      { bezugswert: 668, ersatzrate: 0.836 },
      { bezugswert: 666, ersatzrate: 0.837 },
      { bezugswert: 664, ersatzrate: 0.838 },
      { bezugswert: 662, ersatzrate: 0.839 },
      { bezugswert: 660, ersatzrate: 0.84 },
      { bezugswert: 658, ersatzrate: 0.841 },
      { bezugswert: 656, ersatzrate: 0.842 },
      { bezugswert: 654, ersatzrate: 0.843 },
      { bezugswert: 652, ersatzrate: 0.844 },
      { bezugswert: 650, ersatzrate: 0.845 },
      { bezugswert: 648, ersatzrate: 0.846 },
      { bezugswert: 646, ersatzrate: 0.847 },
      { bezugswert: 644, ersatzrate: 0.848 },
      { bezugswert: 642, ersatzrate: 0.849 },
      { bezugswert: 640, ersatzrate: 0.85 },
      { bezugswert: 638, ersatzrate: 0.851 },
      { bezugswert: 636, ersatzrate: 0.852 },
      { bezugswert: 634, ersatzrate: 0.853 },
      { bezugswert: 632, ersatzrate: 0.854 },
      { bezugswert: 630, ersatzrate: 0.855 },
      { bezugswert: 628, ersatzrate: 0.856 },
      { bezugswert: 626, ersatzrate: 0.857 },
      { bezugswert: 624, ersatzrate: 0.858 },
      { bezugswert: 622, ersatzrate: 0.859 },
      { bezugswert: 620, ersatzrate: 0.86 },
      { bezugswert: 618, ersatzrate: 0.861 },
      { bezugswert: 616, ersatzrate: 0.862 },
      { bezugswert: 614, ersatzrate: 0.863 },
      { bezugswert: 612, ersatzrate: 0.864 },
      { bezugswert: 610, ersatzrate: 0.865 },
      { bezugswert: 608, ersatzrate: 0.866 },
      { bezugswert: 606, ersatzrate: 0.867 },
      { bezugswert: 604, ersatzrate: 0.868 },
      { bezugswert: 602, ersatzrate: 0.869 },
      { bezugswert: 600, ersatzrate: 0.87 },
      { bezugswert: 598, ersatzrate: 0.871 },
      { bezugswert: 596, ersatzrate: 0.872 },
      { bezugswert: 594, ersatzrate: 0.873 },
      { bezugswert: 592, ersatzrate: 0.874 },
      { bezugswert: 590, ersatzrate: 0.875 },
      { bezugswert: 588, ersatzrate: 0.876 },
      { bezugswert: 586, ersatzrate: 0.877 },
      { bezugswert: 584, ersatzrate: 0.878 },
      { bezugswert: 582, ersatzrate: 0.879 },
      { bezugswert: 580, ersatzrate: 0.88 },
      { bezugswert: 578, ersatzrate: 0.881 },
      { bezugswert: 576, ersatzrate: 0.882 },
      { bezugswert: 574, ersatzrate: 0.883 },
      { bezugswert: 572, ersatzrate: 0.884 },
      { bezugswert: 570, ersatzrate: 0.885 },
      { bezugswert: 568, ersatzrate: 0.886 },
      { bezugswert: 566, ersatzrate: 0.887 },
      { bezugswert: 564, ersatzrate: 0.888 },
      { bezugswert: 562, ersatzrate: 0.889 },
      { bezugswert: 560, ersatzrate: 0.89 },
      { bezugswert: 558, ersatzrate: 0.891 },
      { bezugswert: 556, ersatzrate: 0.892 },
      { bezugswert: 554, ersatzrate: 0.893 },
      { bezugswert: 552, ersatzrate: 0.894 },
      { bezugswert: 550, ersatzrate: 0.895 },
      { bezugswert: 548, ersatzrate: 0.896 },
      { bezugswert: 546, ersatzrate: 0.897 },
      { bezugswert: 544, ersatzrate: 0.898 },
      { bezugswert: 542, ersatzrate: 0.899 },
      { bezugswert: 540, ersatzrate: 0.9 },
      { bezugswert: 538, ersatzrate: 0.901 },
      { bezugswert: 536, ersatzrate: 0.902 },
      { bezugswert: 534, ersatzrate: 0.903 },
      { bezugswert: 532, ersatzrate: 0.904 },
      { bezugswert: 530, ersatzrate: 0.905 },
      { bezugswert: 528, ersatzrate: 0.906 },
      { bezugswert: 526, ersatzrate: 0.907 },
      { bezugswert: 524, ersatzrate: 0.908 },
      { bezugswert: 522, ersatzrate: 0.909 },
      { bezugswert: 520, ersatzrate: 0.91 },
      { bezugswert: 518, ersatzrate: 0.911 },
      { bezugswert: 516, ersatzrate: 0.912 },
      { bezugswert: 514, ersatzrate: 0.913 },
      { bezugswert: 512, ersatzrate: 0.914 },
      { bezugswert: 510, ersatzrate: 0.915 },
      { bezugswert: 508, ersatzrate: 0.916 },
      { bezugswert: 506, ersatzrate: 0.917 },
      { bezugswert: 504, ersatzrate: 0.918 },
      { bezugswert: 502, ersatzrate: 0.919 },
      { bezugswert: 500, ersatzrate: 0.92 },
      { bezugswert: 498, ersatzrate: 0.921 },
      { bezugswert: 496, ersatzrate: 0.922 },
      { bezugswert: 494, ersatzrate: 0.923 },
      { bezugswert: 492, ersatzrate: 0.924 },
      { bezugswert: 490, ersatzrate: 0.925 },
      { bezugswert: 488, ersatzrate: 0.926 },
      { bezugswert: 486, ersatzrate: 0.927 },
      { bezugswert: 484, ersatzrate: 0.928 },
      { bezugswert: 482, ersatzrate: 0.929 },
      { bezugswert: 480, ersatzrate: 0.93 },
      { bezugswert: 478, ersatzrate: 0.931 },
      { bezugswert: 476, ersatzrate: 0.932 },
      { bezugswert: 474, ersatzrate: 0.933 },
      { bezugswert: 472, ersatzrate: 0.934 },
      { bezugswert: 470, ersatzrate: 0.935 },
      { bezugswert: 468, ersatzrate: 0.936 },
      { bezugswert: 466, ersatzrate: 0.937 },
      { bezugswert: 464, ersatzrate: 0.938 },
      { bezugswert: 462, ersatzrate: 0.939 },
      { bezugswert: 460, ersatzrate: 0.94 },
      { bezugswert: 458, ersatzrate: 0.941 },
      { bezugswert: 456, ersatzrate: 0.942 },
      { bezugswert: 454, ersatzrate: 0.943 },
      { bezugswert: 452, ersatzrate: 0.944 },
      { bezugswert: 450, ersatzrate: 0.945 },
      { bezugswert: 448, ersatzrate: 0.946 },
      { bezugswert: 446, ersatzrate: 0.947 },
      { bezugswert: 444, ersatzrate: 0.948 },
      { bezugswert: 442, ersatzrate: 0.949 },
      { bezugswert: 440, ersatzrate: 0.95 },
      { bezugswert: 438, ersatzrate: 0.951 },
      { bezugswert: 436, ersatzrate: 0.952 },
      { bezugswert: 434, ersatzrate: 0.953 },
      { bezugswert: 432, ersatzrate: 0.954 },
      { bezugswert: 430, ersatzrate: 0.955 },
      { bezugswert: 428, ersatzrate: 0.956 },
      { bezugswert: 426, ersatzrate: 0.957 },
      { bezugswert: 424, ersatzrate: 0.958 },
      { bezugswert: 422, ersatzrate: 0.959 },
      { bezugswert: 420, ersatzrate: 0.96 },
      { bezugswert: 418, ersatzrate: 0.961 },
      { bezugswert: 416, ersatzrate: 0.962 },
      { bezugswert: 414, ersatzrate: 0.963 },
      { bezugswert: 412, ersatzrate: 0.964 },
      { bezugswert: 410, ersatzrate: 0.965 },
      { bezugswert: 408, ersatzrate: 0.966 },
      { bezugswert: 406, ersatzrate: 0.967 },
      { bezugswert: 404, ersatzrate: 0.968 },
      { bezugswert: 402, ersatzrate: 0.969 },
      { bezugswert: 400, ersatzrate: 0.97 },
      { bezugswert: 398, ersatzrate: 0.971 },
      { bezugswert: 396, ersatzrate: 0.972 },
      { bezugswert: 394, ersatzrate: 0.973 },
      { bezugswert: 392, ersatzrate: 0.974 },
      { bezugswert: 390, ersatzrate: 0.975 },
      { bezugswert: 388, ersatzrate: 0.976 },
      { bezugswert: 386, ersatzrate: 0.977 },
      { bezugswert: 384, ersatzrate: 0.978 },
      { bezugswert: 382, ersatzrate: 0.979 },
      { bezugswert: 380, ersatzrate: 0.98 },
      { bezugswert: 378, ersatzrate: 0.981 },
      { bezugswert: 376, ersatzrate: 0.982 },
      { bezugswert: 374, ersatzrate: 0.983 },
      { bezugswert: 372, ersatzrate: 0.984 },
      { bezugswert: 370, ersatzrate: 0.985 },
      { bezugswert: 368, ersatzrate: 0.986 },
      { bezugswert: 366, ersatzrate: 0.987 },
      { bezugswert: 364, ersatzrate: 0.988 },
      { bezugswert: 362, ersatzrate: 0.989 },
      { bezugswert: 360, ersatzrate: 0.99 },
      { bezugswert: 358, ersatzrate: 0.991 },
      { bezugswert: 356, ersatzrate: 0.992 },
      { bezugswert: 354, ersatzrate: 0.993 },
      { bezugswert: 352, ersatzrate: 0.994 },
      { bezugswert: 350, ersatzrate: 0.995 },
      { bezugswert: 348, ersatzrate: 0.996 },
      { bezugswert: 346, ersatzrate: 0.997 },
      { bezugswert: 344, ersatzrate: 0.998 },
      { bezugswert: 342, ersatzrate: 0.999 },
      { bezugswert: 340, ersatzrate: 1.0 },
    ])(
      "Dumbatzi-Spickliste - Eintrag für einen Bezugswert von $bezugswert€",
      ({ bezugswert, ersatzrate }) => {
        expect(bestimmeErsatzrate(bezugswert)).toEqual(ersatzrate);
      },
    );

    /**
     * Arbitrary values for Bezugswerte. Tiny wrapper around the library native
     * arbitrary generator for floating point numbers. It simply sets same sane
     * defaults to produce more "meaningful" values to keep the test cases
     * "focused". Like negatives values are interesting, but actually we don't
     * care about them. So we don't wanna waste too many runs. Though, the
     * boundaries shouldn't be too tight, so future changes would be suddenly no
     * more covered.
     */
    function arbitraryBezugswert(constraints?: { min?: number; max?: number }) {
      return arbitraryFloat({
        noNaN: true,
        min: 0,
        max: 4_000,
        ...constraints,
      });
    }
  });
}
