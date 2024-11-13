export async function fetchTagManagerData(date: Date) {
  const formattedDate = date.toISOString().split("T")[0];

  const url = `https://${process.env.EGR_METRICS_MATOMO_DOMAIN}/index.php?module=API&format=JSON&idSite=86&period=day&date=${formattedDate},${formattedDate}&method=Events.getCategory&filter_limit=100&format_metrics=1&expanded=1&token_auth=${process.env.EGR_METRICS_MATOMO_AUTHENTICATION_TOKEN}&force_api_session=1`;

  const response = await fetch(url);

  const data: MatomoEventsCategoryResponse = await response.json();

  const partnerschaftlichkeit =
    data[formattedDate]
      .flatMap((entry) => [entry, ...entry.subtable])
      .filter((entry) => entry.label === "Partnerschaftlichkeit")
      .map((entry) => entry.avg_event_value)[0] * 100 || 0;

  return {
    Datum: formattedDate,
    Partnerschaftlichkeit: partnerschaftlichkeit,
  };
}

type MatomoEventsCategoryResponse = {
  [date: string]: {
    label: string;
    nb_uniq_visitors: number;
    nb_visits: number;
    nb_events: number;
    nb_events_with_value: number;
    sum_event_value: number;
    min_event_value: number;
    max_event_value: number;
    avg_event_value: number;
    idsubdatatable: number;
    segment: string;
    subtable: {
      label: string;
      nb_uniq_visitors: number;
      nb_visits: number | string;
      nb_events: number | string;
      nb_events_with_value: number | string;
      sum_event_value: number;
      min_event_value: number;
      max_event_value: number;
      avg_event_value: number;
    }[];
  }[];
};
