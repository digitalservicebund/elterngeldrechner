import {
  fetchMetadataInformation,
  fetchEventsInformation,
} from "./matomo/matomo";

import { createTableRecord } from "./noco/noco";
import { ElterngeldTableSchema } from "./noco/noco-db-schema";

const date = process.argv.slice(2)[0];

if (!date) {
  throw new Error(`Please run the script with an iso date as first argument.`);
}

if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
  throw new Error(`Expected date to be in format YYYY-MM-DD but was ${date}`);
}

const metadataInformation = await fetchMetadataInformation(date);
const eventsInformation = await fetchEventsInformation(date);

const record: ElterngeldTableSchema = {
  Datum: date,

  Partnerschaftlichkeit: eventsInformation.partnerschaftlichkeit,
  AnzahlFeedbackHilfreich: eventsInformation.hilfreichesFeedback,
  AnzahlFeedbackNichtHilfreich: eventsInformation.nichtHilfreichesFeedback,

  EindeutigeBesucherinnen: metadataInformation.uniqueVisitors,
};

await createTableRecord(record);
