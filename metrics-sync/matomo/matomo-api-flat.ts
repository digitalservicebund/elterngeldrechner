import { Action, Subtable } from "./matomo-api-schema";

export type Flattened<T, P extends string> = {
  [K in keyof T as `${P}_${string & K}`]: string;
};

export type FlatStructure<Action, Subtable> = Flattened<Action, "action"> &
  Partial<Flattened<Subtable, "subtable">>;

/**
 * Flattens a hierarchical structure of actions with optional subtables into a flat array of combined fields.
 *
 * @param actions - An array of actions, each potentially containing a `subtable` array of related objects.
 * @returns An array of flattened structures, where each entry combines fields from the main action
 * and one of its subtables (if present). If no subtables exist, only the action's fields are included.
 *
 * ### Example
 * Input:
 * ```json
 * [
 *   {
 *     "label": "Nutzergruppe",
 *     "nb_visitors": 3556,
 *     "subtable": [
 *       { "label": "werdende Eltern", "nb_visitors": 2793 },
 *       { "label": "junge Eltern", "nb_visitors": 397 },
 *       { "label": "nachbeantragende Eltern", "nb_visitors": 366 }
 *     ]
 *   }
 * ]
 * ```
 * Output:
 * ```json
 * [
 *   { "action_label": "Nutzergruppe", "action_nb_visitors": "3556", "subtable_label": "werdende Eltern", "subtable_nb_visitors": "2793" },
 *   { "action_label": "Nutzergruppe", "action_nb_visitors": "3556", "subtable_label": "junge Eltern", "subtable_nb_visitors": "397" },
 *   { "action_label": "Nutzergruppe", "action_nb_visitors": "3556", "subtable_label": "nachbeantragende Eltern", "subtable_nb_visitors": "366" }
 * ]
 * ```
 */
function flatten(actions: Action[]): FlatStructure<Action, Subtable>[] {
  return actions.flatMap((action) => {
    const actionFields: Flattened<Action, "action"> = Object.fromEntries(
      Object.entries(action)
        .filter(([key]) => key !== "subtable")
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        .map(([key, value]) => [`action_${key}`, String(value)]),
    ) as Flattened<Action, "action">;

    if (action.subtable && action.subtable.length > 0) {
      return action.subtable.map((subtable) => {
        const subtableFields: Flattened<Subtable, "subtable"> =
          Object.fromEntries(
            Object.entries(subtable).map(([key, value]) => [
              `subtable_${key}`,
              String(value),
            ]),
          ) as Flattened<Subtable, "subtable">;

        return { ...actionFields, ...subtableFields };
      });
    } else {
      return [actionFields] as FlatStructure<Action, Subtable>[];
    }
  });
}

export default flatten;

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("flatten", () => {
    it("flattens an action and its subtables", () => {
      const action: Action = {
        label: "Fortschritt - Funnel",
        nb_uniq_visitors: 22589,
        nb_visits: 18772,
        nb_events: 22595,
        nb_events_with_value: 0,
        sum_event_value: 0,
        min_event_value: 0,
        max_event_value: 0,
        avg_event_value: 0,
        idsubdatatable: 1,
        segment: "eventAction==Fortschritt+-+Funnel",
        subtable: [
          {
            label: "Allgemeine Angaben",
            nb_uniq_visitors: 5103,
            nb_visits: "3993",
            nb_events: "5104",
            nb_events_with_value: "0",
            sum_event_value: 0,
            min_event_value: 0,
            max_event_value: 0,
            avg_event_value: 0,
          },
          {
            label: "Ihr Nachwuchs",
            nb_uniq_visitors: 3749,
            nb_visits: "3130",
            nb_events: "3749",
            nb_events_with_value: "0",
            sum_event_value: 0,
            min_event_value: 0,
            max_event_value: 0,
            avg_event_value: 0,
          },
          {
            label: "Erwerbstätigkeit",
            nb_uniq_visitors: 3558,
            nb_visits: "2987",
            nb_events: "3559",
            nb_events_with_value: "0",
            sum_event_value: 0,
            min_event_value: 0,
            max_event_value: 0,
            avg_event_value: 0,
          },
          {
            label: "Ihr Einkommen",
            nb_uniq_visitors: 3508,
            nb_visits: "2957",
            nb_events: "3510",
            nb_events_with_value: "0",
            sum_event_value: 0,
            min_event_value: 0,
            max_event_value: 0,
            avg_event_value: 0,
          },
          {
            label: "Elterngeldvarianten",
            nb_uniq_visitors: 3275,
            nb_visits: "2781",
            nb_events: "3276",
            nb_events_with_value: "0",
            sum_event_value: 0,
            min_event_value: 0,
            max_event_value: 0,
            avg_event_value: 0,
          },
          {
            label: "Rechner und Planer",
            nb_uniq_visitors: 3106,
            nb_visits: "2647",
            nb_events: "3107",
            nb_events_with_value: "0",
            sum_event_value: 0,
            min_event_value: 0,
            max_event_value: 0,
            avg_event_value: 0,
          },
          {
            label: "Zusammenfassung",
            nb_uniq_visitors: 290,
            nb_visits: "277",
            nb_events: "290",
            nb_events_with_value: "0",
            sum_event_value: 0,
            min_event_value: 0,
            max_event_value: 0,
            avg_event_value: 0,
          },
        ],
      };

      const flatActions = flatten([action]);

      expect(flatActions.length).toEqual(action.subtable.length);

      expect(flatActions[0].action_label).toEqual("Fortschritt - Funnel");
      expect(flatActions[0].subtable_label).toEqual("Allgemeine Angaben");

      expect(flatActions[6].action_label).toEqual("Fortschritt - Funnel");
      expect(flatActions[6].subtable_label).toEqual("Zusammenfassung");
    });

    it("flattens an action without subtables into an element with undefined subtable fields", () => {
      const action: Action = {
        label: "Click Schnellberechnung",
        nb_uniq_visitors: 288,
        nb_visits: "203",
        nb_events: "337",
        nb_events_with_value: "0",
        sum_event_value: 0,
        min_event_value: 0,
        max_event_value: 0,
        avg_event_value: 0,
        segment: "eventAction==Click+Schnellberechnung",
      };

      const flatActions = flatten([action]);

      expect(flatActions.length).toEqual(1);

      expect(flatActions[0].action_label).toEqual("Click Schnellberechnung");

      expect(flatActions[0].subtable_label).toBeUndefined();
    });
  });
}
