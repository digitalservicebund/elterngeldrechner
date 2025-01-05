import matomo from "./matomo/matomo-api";
import flatten from "./matomo/matomo-api-flat";
import noco from "./noco/noco-api";

const date = process.argv.slice(2)[0];

if (!date) {
  throw new Error(`Please run the script with an iso date as first argument.`);
}

if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
  throw new Error(`Expected date to be in format YYYY-MM-DD but was ${date}`);
}

const metadata = await matomo.fetchPageStatistics(date);
await noco.createElterngeldrechnerMetadataRecord({ Datum: date, ...metadata });

const eventActions = await matomo.fetchEventActions(date);
const flatElements = flatten(eventActions);
const rows = flatElements.map((element) => ({ Datum: date, ...element }));
await noco.createElterngeldrechnerEventRecord(rows);
