import { Action, Subtable } from "./matomo-api-schema";

export type Flattened<Type, P extends string> = {
  [K in keyof Type as `${P}_${string & K}`]: string;
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
