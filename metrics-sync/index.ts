import {
  fetchAnalyticsInformation,
  fetchTagManagerInformation,
} from "./matomo";
import { createTableRecord } from "./nocco";
import { ElterngeldTableSchema } from "./nocco-schema";

const formattedDate = new Date().toISOString().split("T")[0];

const analyticsInformation = await fetchAnalyticsInformation(formattedDate);
const tagManagerInformation = await fetchTagManagerInformation(formattedDate);

const record: ElterngeldTableSchema = {
  Datum: formattedDate,
  Partnerschaftlichkeit: tagManagerInformation.partnerschaftlichkeit,
  EindeutigeBesucherinnen: analyticsInformation.uniqueVisitors,
};

await createTableRecord(record);
