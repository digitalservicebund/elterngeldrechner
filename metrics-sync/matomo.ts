import {
  EventModuleResponse,
  MetadataModuleResponse,
  Method,
} from "./matomo-api";

export async function fetchEventsInformation(date: string) {
  const response = await fetchMatomoEndpoint("Events.getAction", date);

  const data: EventModuleResponse = await response.json();

  return {
    partnerschaftlichkeit: getPartnerschaftlichkeit(data, date),
  };
}

export async function fetchMetadataInformation(date: string) {
  const response = await fetchMatomoEndpoint("API.get", date);

  const data: MetadataModuleResponse = await response.json();

  return {
    uniqueVisitors: data[date].nb_uniq_visitors,
  };
}

async function fetchMatomoEndpoint(method: Method, date: string) {
  const { config } = await import("./env");

  const url = `https://${config.matomo.domain}/index.php?module=API&format=JSON&idSite=86&period=day&date=${date},${date}&method=${method}&filter_limit=100&format_metrics=1&expanded=1&token_auth=${config.matomo.authenticationToken}&force_api_session=1`;

  const response = await fetch(url);

  if (!response.ok) {
    throw Error(
      `Request to Matomo failed. Code: ${response.status} Error ${response.statusText}`,
    );
  }

  return response;
}

function getPartnerschaftlichkeit(data: EventModuleResponse, date: string) {
  return (
    (data[date] || [])
      .filter((entry) => entry.label === "Partnerschaftlichkeit")
      .map((entry) => entry.avg_event_value)[0] * 100 || null
  );
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  vi.mock(import("./env"));

  describe("getPartnerschaftlichkeit", async () => {
    it("returns a number between 0 and 100 instead of 0 and 1", () => {
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

      expect(getPartnerschaftlichkeit(response, "2024-11-12")).toBe(5);
    });

    it("returns null if data for day is absent", () => {
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

      expect(getPartnerschaftlichkeit(response, "2024-11-13")).toBe(null);
    });

    it("returns null if segment is missing", () => {
      const response = {
        "2024-11-12": [],
      };

      expect(getPartnerschaftlichkeit(response, "2024-11-12")).toBe(null);
    });
  });
}
