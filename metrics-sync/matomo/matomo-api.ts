import { Action, Metadata, Method } from "./matomo-api-schema";

async function fetchEventActions(date: string): Promise<Action[]> {
  return fetchMatomoEndpoint("Events.getAction", date)
    .then((it) => it.json())
    .then((it) => it[date]);
}

async function fetchMetadata(date: string): Promise<Metadata> {
  return fetchMatomoEndpoint("API.get", date)
    .then((it) => it.json())
    .then((it) => it[date]);
}

async function fetchMatomoEndpoint(method: Method, date: string) {
  const { config } = await import("../env");

  const url = `https://${config.matomo.domain}/index.php?module=API&format=JSON&idSite=86&period=day&date=${date},${date}&method=${method}&filter_limit=100&format_metrics=1&expanded=1&token_auth=${config.matomo.authenticationToken}&force_api_session=1`;

  const response = await fetch(url);

  if (!response.ok) {
    throw Error(
      `Request to Matomo failed. Code: ${response.status} Error ${response.statusText}`,
    );
  }

  return response;
}

export default { fetchMetadata, fetchEventActions };
