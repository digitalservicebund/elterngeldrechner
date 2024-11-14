import { fetchMetadataInformation, fetchEventsInformation } from "./matomo";
import { createTableRecord } from "./nocco";
import { ElterngeldTableSchema } from "./nocco-schema";

const formattedDate = new Date().toISOString().split("T")[0];

const metadataInformation = await fetchMetadataInformation(formattedDate);
const eventsInformation = await fetchEventsInformation(formattedDate);

const record: ElterngeldTableSchema = {
  Datum: formattedDate,

  Partnerschaftlichkeit: eventsInformation.partnerschaftlichkeit,
  AnzahlFeedbackHilfreich: eventsInformation.hilfreichesFeedback,
  AnzahlFeedbackNichtHilfreich: eventsInformation.nichtHilfreichesFeedback,

  EindeutigeBesucherinnen: metadataInformation.uniqueVisitors,
};

await createTableRecord(record);
