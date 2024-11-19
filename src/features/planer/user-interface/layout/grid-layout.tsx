import {
  createContext,
  useContext,
  type CSSProperties,
  type ReactNode,
} from "react";
import { type RenderHookResult } from "@testing-library/react";
import { Elternteil } from "@/features/planer/user-interface/service";

export function GridLayoutProvider(props: {
  readonly anzahlElternteile: AnzahlElternteile;
  readonly children?: ReactNode;
}): ReactNode {
  const { anzahlElternteile, children } = props;

  return (
    <GridLayoutContext.Provider value={anzahlElternteile}>
      {children}
    </GridLayoutContext.Provider>
  );
}

/**
 * Provides some CSS styling for a grid layout including a column template. The
 * actual result depends on the context of how many Elternteile there are.
 *
 * Because of the shadow DOM of some HTML elements, deep CSS subgrids are not
 * everywhere possible. Thereby, the grid layout definition needs to be applied
 * on various siblings in the DOM to achieve the look of an overall grid.
 * The here provided hooks help with the coordination and also the grid
 * placement of elements within the grid deep down the React component tree.
 */
export function useGridLayout(): CSSProperties {
  const anzahlElternteile = useContext(GridLayoutContext);
  return GRID_LAYOUTS[anzahlElternteile];
}

/**
 * Provides some CSS styling to place a HTML element within the grid layout. The
 * actual result depends on the context of how many Elternteile there are.
 *
 * The type-system takes care that only valid column names can be used for the
 * placement. Especially because the different grid layouts use different
 * column(names)s.
 */
export function useGridColumn(
  gridColumnDefinition: GridColumnDefinition,
): CSSProperties {
  const anzahlElternteile = useContext(GridLayoutContext);
  return asCSSProperties(gridColumnDefinition[anzahlElternteile]);
}

/**
 * Extended version of {@link useGridColumn}. Depicts the aspect that many React
 * components in the grid need to place the same child components each for every
 * Elternteil.
 */
export function useGridColumnPerElternteil(
  gridColumnDefinitions: GridColumnDefinitionPerElternteil,
): Record<Elternteil, CSSProperties> {
  const anzahlElternteile = useContext(GridLayoutContext);

  // TODO:
  // Use more algorithmic and functional approach for to apply parsing and fill
  // empty Elternteile (issues with type-system).
  switch (anzahlElternteile) {
    case 1: {
      return {
        [Elternteil.Eins]: asCSSProperties(
          gridColumnDefinitions[anzahlElternteile][Elternteil.Eins],
        ),
        [Elternteil.Zwei]: {}, // There is no such Elternteil in this case.
      };
    }
    case 2: {
      return {
        [Elternteil.Eins]: asCSSProperties(
          gridColumnDefinitions[anzahlElternteile][Elternteil.Eins],
        ),
        [Elternteil.Zwei]: asCSSProperties(
          gridColumnDefinitions[anzahlElternteile][Elternteil.Zwei],
        ),
      };
    }
  }
}

function asCSSProperties(gridColumn: GridColumn<string>): CSSProperties {
  const gridColumnParts =
    typeof gridColumn === "string" ? [gridColumn] : gridColumn;
  const cssGridColumn = gridColumnParts.join(" / ");
  return { gridColumn: cssGridColumn };
}

const GridLayoutContext = createContext<AnzahlElternteile>(1);

const EinElternteilColumnNames = Object.freeze([
  "left-outside",
  "left-middle",
  "left-inside",
  "middle",
  "right-inside",
  "right-middle",
  "right-outside",
] as const);

const ZweiElternteileColumnNames = Object.freeze([
  "et1-outside",
  "et1-middle",
  "et1-inside",
  "middle",
  "et2-inside",
  "et2-middle",
  "et2-outside",
] as const);

type EinElternteilColumnName = (typeof EinElternteilColumnNames)[number];
type ZweiElternteileColumnName = (typeof ZweiElternteileColumnNames)[number];

const GRID_COLUMN_TEMPLATE_EIN_ELTERNTEIL: CSSProperties = {
  display: "grid",
  maxWidth: "45ch",
  margin: "auto",
  gridTemplateColumns:
    "minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 3fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 2fr)",
  gridTemplateAreas: `"${EinElternteilColumnNames.join(" ")}"`,
};

const GRID_COLUMN_TEMPLATE_ZWEI_ELTERNTEILE: CSSProperties = {
  display: "grid",
  maxWidth: "70ch",
  margin: "auto",
  gridTemplateColumns:
    "minmax(0, 2fr) minmax(0, 3fr) minmax(0, 8fr) minmax(0, 3fr) minmax(0, 8fr) minmax(0, 3fr) minmax(0, 2fr)",
  gridTemplateAreas: `"${ZweiElternteileColumnNames.join(" ")}"`,
};

const GRID_LAYOUTS: Record<AnzahlElternteile, CSSProperties> = {
  1: GRID_COLUMN_TEMPLATE_EIN_ELTERNTEIL,
  2: GRID_COLUMN_TEMPLATE_ZWEI_ELTERNTEILE,
};

export type GridColumnDefinition = {
  1: GridColumn<EinElternteilColumnName>;
  2: GridColumn<ZweiElternteileColumnName>;
};

export type GridColumnDefinitionPerElternteil = {
  1: Record<Elternteil.Eins, GridColumn<EinElternteilColumnName>>;
  2: Record<Elternteil, GridColumn<ZweiElternteileColumnName>>;
};

/**
 * Relates to the CSS `grid-column` property. The actual CSS value must be
 * constructed by joining the column names to define the possible span.
 * The generic parameter is for type-safety to only allow correct column names
 * of the responding grid column template.
 *
 * E.g.:
 * ```typescript
 * "left" // -> grid-column: left;
 * ["left", "right"] // -> grid-column: left / right;
 * ```
 */
type GridColumn<ColumnNames extends string> = ColumnNames | ColumnNames[];

type AnzahlElternteile = 1 | 2;

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("grid layout", () => {
    describe("layout hook", () => {
      it("provides a styling that defines a layout with grid template definition", async () => {
        const { result } = await renderHookWithGridLayoutContext(
          () => useGridLayout(),
          1,
        );

        expect(result.current).toStrictEqual({
          display: expect.any(String),
          maxWidth: expect.any(String),
          margin: expect.any(String),
          gridTemplateColumns: expect.any(String),
          gridTemplateAreas: expect.any(String),
        });
      });
    });

    describe("grid column hook", () => {
      it("selects the definition based on context and parses it as CSS", async () => {
        const columnDefinition: GridColumnDefinition = {
          1: "left-outside",
          2: ["middle", "et1-inside"],
        };

        const { result } = await renderHookWithGridLayoutContext(
          () => useGridColumn(columnDefinition),
          2,
        );

        expect(result.current).toStrictEqual({
          gridColumn: "middle / et1-inside",
        });
      });
    });

    describe("grid column per Elternteil hook", () => {
      it("selects the definition based on context and parses it as CSS", async () => {
        const columnDefinition: GridColumnDefinitionPerElternteil = {
          1: {
            [Elternteil.Eins]: "left-outside",
          },
          2: {
            [Elternteil.Eins]: ["et1-outside", "et1-inside"],
            [Elternteil.Zwei]: ["et2-inside", "et2-outside"],
          },
        };

        const { result } = await renderHookWithGridLayoutContext(
          () => useGridColumnPerElternteil(columnDefinition),
          1,
        );

        expect(result.current).toStrictEqual({
          [Elternteil.Eins]: { gridColumn: "left-outside" },
          [Elternteil.Zwei]: {},
        });
      });
    });

    async function renderHookWithGridLayoutContext<Props, Result>(
      render: (props: Props) => Result,
      anzahlElternteile: AnzahlElternteile,
    ): Promise<RenderHookResult<Result, Props>> {
      const { renderHook } = await import("@testing-library/react");

      return renderHook(render, {
        wrapper: ({ children }) => (
          <GridLayoutProvider anzahlElternteile={anzahlElternteile}>
            {children}
          </GridLayoutProvider>
        ),
      });
    }
  });
}
