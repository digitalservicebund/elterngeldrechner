import { TagManagerResponse } from "./matomo-api";

export async function fetchTagManagerData(date: Date) {
  const { config } = await import("./env");

  const formattedDate = date.toISOString().split("T")[0];

  const url = `https://${config.matomo.domain}/index.php?module=API&format=JSON&idSite=86&period=day&date=${formattedDate},${formattedDate}&method=Events.getCategory&filter_limit=100&format_metrics=1&expanded=1&token_auth=${config.matomo.authenticationToken}&force_api_session=1`;

  const response = await fetch(url);

  const data: TagManagerResponse = await response.json();

  return {
    Datum: formattedDate,
    Partnerschaftlichkeit: getPartnerschaftlichkeit(data, formattedDate),
  };
}

function getPartnerschaftlichkeit(data: TagManagerResponse, date: string) {
  return (
    (data[date] || [])
      .flatMap((entry) => entry.subtable)
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
            label: "Elterngeldrechner mit Planer",
            nb_uniq_visitors: 27576,
            nb_visits: 23135,
            nb_events: 28261,
            nb_events_with_value: 250,
            sum_event_value: 13.25,
            min_event_value: 0,
            max_event_value: 1,
            avg_event_value: 0.05,
            idsubdatatable: 1,
            segment: "eventCategory==Elterngeldrechner+mit+Planer",
            subtable: [
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
            label: "Elterngeldrechner mit Planer",
            nb_uniq_visitors: 27576,
            nb_visits: 23135,
            nb_events: 28261,
            nb_events_with_value: 250,
            sum_event_value: 13.25,
            min_event_value: 0,
            max_event_value: 1,
            avg_event_value: 0.05,
            idsubdatatable: 1,
            segment: "eventCategory==Elterngeldrechner+mit+Planer",
            subtable: [
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
              },
            ],
          },
        ],
      };

      expect(getPartnerschaftlichkeit(response, "2024-11-13")).toBe(null);
    });

    it("returns null if segment is missing", () => {
      const response = {
        "2024-11-12": [
          {
            label: "Elterngeldrechner mit Planer",
            nb_uniq_visitors: 27576,
            nb_visits: 23135,
            nb_events: 28261,
            nb_events_with_value: 250,
            sum_event_value: 13.25,
            min_event_value: 0,
            max_event_value: 1,
            avg_event_value: 0.05,
            idsubdatatable: 1,
            segment: "eventCategory==Elterngeldrechner+mit+Planer",
            subtable: [],
          },
        ],
      };

      expect(getPartnerschaftlichkeit(response, "2024-11-12")).toBe(null);
    });
  });
}
