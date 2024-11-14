import {
  EventModuleResponse,
  MetadataModuleResponse,
  Method,
} from "./matomo-api";
import { getFieldInActions, getFieldInSubtable } from "./matomo-api-helper";

export async function fetchEventsInformation(date: string) {
  const response = await fetchMatomoEndpoint("Events.getAction", date);
  const data: EventModuleResponse = await response.json();
  const actions = data[date];

  return {
    partnerschaftlichkeit: getFieldInActions({
      actions: actions,
      actionLabel: "Partnerschaftlichkeit",
      accessor: (a) => a.avg_event_value * 100,
    }),
    hilfreichesFeedback: getFieldInSubtable({
      actions: actions,
      actionLabel: "Feedback",
      subtableLabel: "Hilfreich",
      accessor: (a) => a.nb_uniq_visitors,
    }),
    nichtHilfreichesFeedback: getFieldInSubtable({
      actions: actions,
      actionLabel: "Feedback",
      subtableLabel: "Nicht hilfreich",
      accessor: (a) => a.nb_uniq_visitors,
    }),
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
