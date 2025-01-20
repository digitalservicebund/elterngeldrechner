import { Action, Method, PageStatistic } from "./matomo-api-schema";

async function fetchEventActions(date: string): Promise<Action[]> {
  return fetchMatomoEndpoint("Events.getAction", date, date)
    .then((it) => it.json())
    .then((it: Record<string, Action[]>) => it[date]);
}

async function fetchPageStatistics(date: string): Promise<PageStatistic> {
  return fetchMatomoEndpoint("Actions.getPageTitles", date, date)
    .then((it) => it.json())
    .then((it: Record<string, PageStatistic[]>) => it[date])
    .then((it) => it.filter(isPlanerSegment))
    .then((it) => it[0]);
}

function isPlanerSegment(it: PageStatistic) {
  const planer = `pageTitle==Elterngeldrechner%2Bmit%2BPlaner%2B%257C%2BFamilienportal%2Bdes%2BBundes`;

  return it.segment == planer;
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
};
