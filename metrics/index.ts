import { fetchTagManagerData } from "./matomo";
import { createTableRecord } from "./nocco";

const tagManagerData = await fetchTagManagerData(new Date());

await createTableRecord(tagManagerData);
