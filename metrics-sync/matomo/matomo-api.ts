import { Action, Method, Page, Url } from "./matomo-api-schema";

async function fetchEventActions(date: string): Promise<Action[]> {
  return fetchMatomoEndpoint("Events.getAction", date, date)
    .then((it) => it.json())
    .then((it: Record<string, Action[]>) => it[date]);
}

async function fetchPageStatistics(date: string): Promise<Page> {
  return fetchMatomoEndpoint("Actions.getPageTitles", date, date)
    .then((it) => it.json())
    .then((it: Record<string, Page[]>) => it[date])
    .then((it) => it.filter(isPlanerSegment))
    .then((it) => it[0]);
}

function isPlanerSegment(it: Page) {
  const planer = `pageTitle==Elterngeldrechner%2Bmit%2BPlaner%2B%257C%2BFamilienportal%2Bdes%2BBundes`;

  return it.segment == planer;
}

async function fetchReferrerStatistics(date: string): Promise<Url[]> {
  return fetchMatomoEndpoint("Actions.getPageUrls", date, date)
    .then((it) => it.json())
    .then((it: Record<string, Url[]>) => it[date])
    .then((it) => flattenSubtables(it))
    .then((it) => it.filter(hasSourceParameter));
}

function hasSourceParameter(url: Url): boolean {
  return url.label.includes("?source=");
}

function flattenSubtables(urls: Url[]): Url[] {
  return urls.flatMap((url) =>
    url.subtable ? flattenSubtables(url.subtable) : url,
  );
}

async function fetchMatomoEndpoint(
  method: Method,
  startDate: string,
  endDate: string,
) {
  const { config } = await import("../env");

  const response = await fetch(
    `https://${config.matomo.domain}/index.php?module=API&format=JSON&idSite=86&period=day&date=${startDate},${endDate}&method=${method}&filter_limit=100&format_metrics=1&expanded=1&token_auth=${config.matomo.authenticationToken}&force_api_session=1`,
  );

  if (!response.ok) {
    throw Error(
      `Request to Matomo failed. Code: ${response.status} Error ${response.statusText}`,
    );
  }

  return response;
}

export default {
  fetchEventActions,
  fetchPageStatistics,
  fetchReferrerStatistics,
};

if (import.meta.vitest) {
  const { describe, it, expect, vi } = import.meta.vitest;

  const responseMock = {
    "2025-09-18": [
      {
        label: "familienportal",
        subtable: [
          {
            label: "familienleistungen",
            subtable: [
              {
                label: "elterngeld",
                subtable: [
                  {
                    label: "/elterngeldrechner?source=flyer-vaeter",
                  },
                  {
                    label: "faq",
                    subtable: [
                      {
                        label: "/wie-kann-ich-elterngeld-beantragen--124762",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            label: "meta",
            subtable: [
              {
                label: "/egr?source=antrag_2025_v1_seite17",
              },
              {
                label: "/egr?source=antrag_2025_v1_seite18",
              },
            ],
          },
        ],
      },
    ],
  };

  vi.mock("../env", () => ({
    config: {
      matomo: {
        domain: "test.domain",
        authenticationToken: "test-token",
      },
      noco: {
        domain: "test.domain",
        authenticationToken: "test-token",
      },
    },
  }));

  describe("fetchReferrerStatistics-api", () => {
    it("should return only entries including ?source=", async () => {
      vi.spyOn(global, "fetch").mockResolvedValue(
        new Response(JSON.stringify(responseMock)),
      );

      const result = await fetchReferrerStatistics("2025-09-18");

      expect(result).toHaveLength(3);
      expect(result[0].label).toBe("/elterngeldrechner?source=flyer-vaeter");
      expect(result[1].label).toBe("/egr?source=antrag_2025_v1_seite17");
      expect(result[2].label).toBe("/egr?source=antrag_2025_v1_seite18");
    });
  });
}
