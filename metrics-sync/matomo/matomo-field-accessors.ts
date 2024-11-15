import { Action, Subtable } from "./matomo-api-schema";

export type FieldInActionOptions<T> = {
  actions: Action[];
  actionLabel: string;
  accessor: (action: Action) => T;
  default: null | 0;
};

export function getFieldInActions<T>(options: FieldInActionOptions<T>) {
  return (
    options.actions
      .filter((entry) => entry.label === options.actionLabel)
      .map(options.accessor)[0] || options.default
  );
}

export type FieldInSubtableOptions<T> = {
  actions: Action[];
  actionLabel: string;
  subtableLabel: string;
  accessor: (action: Subtable) => T;
  default: null | 0;
};

export function getFieldInSubtable<T>(options: FieldInSubtableOptions<T>) {
  return (
    options.actions
      .filter((entry) => entry.label === options.actionLabel)
      .flatMap((entry) => entry.subtable)
      .filter((entry) => entry.label == options.subtableLabel)
      .map(options.accessor)[0] || options.default
  );
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("getFieldInActions", async () => {
    it("returns the value for a given label and accessor", () => {
      const response = {
        "2024-11-12": [
          {
            label: "Partnerschaftlichkeit",
            nb_uniq_visitors: 236,
            nb_visits: "223",
            nb_events: "377",
            nb_events_with_value: "250",
            sum_event_value: 13.25,
            min_event_value: 0,
            max_event_value: 1,
            avg_event_value: 0.05,
            idsubdatatable: 5,
            segment: "eventAction==Partnerschaftlichkeit",
            subtable: [
              {
                label: "Verteilung",
                nb_uniq_visitors: 236,
                nb_visits: "223",
                nb_events: "377",
                nb_events_with_value: "250",
                sum_event_value: 13.25,
                min_event_value: 0,
                max_event_value: 1,
                avg_event_value: 0.05,
              },
            ],
          },
        ],
      };

      const value = getFieldInActions({
        actions: response["2024-11-12"],
        actionLabel: "Partnerschaftlichkeit",
        accessor: (a) => a.avg_event_value * 100,
        default: 0,
      });

      expect(value).toBe(5);
    });

    it("returns default (null) if segment is missing", () => {
      const response = {
        "2024-11-12": [],
      };

      const value = getFieldInActions({
        actions: response["2024-11-12"],
        actionLabel: "Partnerschaftlichkeit",
        accessor: (a) => a.avg_event_value * 100,
        default: null,
      });

      expect(value).toBe(null);
    });

    it("returns default (zero) if segment is missing", () => {
      const response = {
        "2024-11-12": [],
      };

      const value = getFieldInActions({
        actions: response["2024-11-12"],
        actionLabel: "Partnerschaftlichkeit",
        accessor: (a) => a.avg_event_value * 100,
        default: 0,
      });

      expect(value).toBe(0);
    });
  });

  describe("getFieldInSubtable", async () => {
    it("returns the value for given labels and accessor", () => {
      const response = {
        "2024-11-12": [
          {
            label: "Feedback",
            nb_uniq_visitors: 7,
            nb_visits: 7,
            nb_events: 7,
            nb_events_with_value: 0,
            sum_event_value: 0,
            min_event_value: 0,
            max_event_value: 0,
            avg_event_value: 0,
            idsubdatatable: 7,
            segment: "eventAction==Feedback",
            subtable: [
              {
                label: "Hilfreich",
                nb_uniq_visitors: 4,
                nb_visits: "4",
                nb_events: "4",
                nb_events_with_value: "0",
                sum_event_value: 0,
                min_event_value: 0,
                max_event_value: 0,
                avg_event_value: 0,
              },
              {
                label: "Nicht hilfreich",
                nb_uniq_visitors: 3,
                nb_visits: "3",
                nb_events: "3",
                nb_events_with_value: "0",
                sum_event_value: 0,
                min_event_value: 0,
                max_event_value: 0,
                avg_event_value: 0,
              },
            ],
          },
        ],
      };

      const value = getFieldInSubtable({
        actions: response["2024-11-12"],
        actionLabel: "Feedback",
        subtableLabel: "Hilfreich",
        accessor: (a) => a.nb_uniq_visitors,
        default: 0,
      });

      expect(value).toBe(4);
    });

    it("returns null if segment is missing", () => {
      const response = {
        "2024-11-12": [],
      };

      const value = getFieldInSubtable({
        actions: response["2024-11-12"],
        actionLabel: "Feedback",
        subtableLabel: "Hilfreich",
        accessor: (a) => a.nb_uniq_visitors,
        default: null,
      });

      expect(value).toBe(null);
    });

    it("returns default (zero) if segment is missing", () => {
      const response = {
        "2024-11-12": [],
      };

      const value = getFieldInSubtable({
        actions: response["2024-11-12"],
        actionLabel: "Feedback",
        subtableLabel: "Hilfreich",
        accessor: (a) => a.nb_uniq_visitors,
        default: 0,
      });

      expect(value).toBe(0);
    });
  });
}
