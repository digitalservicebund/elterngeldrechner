import { generatePath } from "react-router";

import { Route } from "@/application/features/abfrageteil-next/routing";

// We deliberately implement our own type-safe variant of generatePath rather
// than relying on react-routers typegen or a library like react-router-typesafe-routes.
//
// Since routes are a closed enum, template literal inference is sufficient to derive
// param names — no code generation step and no additional dependency required.
//
// https://github.com/remix-run/react-router/blob/dev/decisions/0012-type-inference.md

export type ExtractParams<T extends string> =
  T extends `${string}:${infer Param}/${infer Rest}`
    ? Param | ExtractParams<`/${Rest}`>
    : T extends `${string}:${infer Param}`
      ? Param
      : never;

export type RouteParams<R extends Route> = Record<ExtractParams<R>, string>;

export function generateParametrizedPath<R extends Route>(
  ...args: ExtractParams<R> extends never
    ? [route: R]
    : [route: R, params: RouteParams<R>]
) {
  const [route, params] = args as [string, Record<string, string>?];

  return generatePath(route, params);
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("generateParametrizedPath", () => {
    it("can be used to render static routes without the params argument", () => {
      const path = generateParametrizedPath(Route.Startseite);

      expect(path).toEqual("/startseite");
    });

    it("can be used to render dyanmic routes with params", () => {
      const path = generateParametrizedPath(Route.GeschwisterkindAngaben, {
        geschwisterIndex: "0",
      });

      expect(path).toEqual("/geschwisterkind/0");
    });

    // Hack to make assertions type only and prevent runtime execution which
    // would fail. Vitest has support for type level testing with .test-d.ts
    // files but that breaks with out in-source testing convention.
    if (false as boolean) {
      // @ts-expect-error rendering dynamic routes without params
      generateParametrizedPath(Route.GeschwisterkindAngaben);

      // @ts-expect-error rendering static route with params
      generateParametrizedPath(Route.Startseite, { index: "1" });
    }
  });
}
