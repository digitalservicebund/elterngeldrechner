import { ElterngeldTableSchema } from "./nocco-schema";

export async function createTableRecord(object: ElterngeldTableSchema) {
  const url = `https://${process.env.EGR_METRICS_SYNC_NOCO_DOMAIN}:${process.env.EGR_METRICS_SYNC_NOCO_PORT}/api/v2/tables/${process.env.EGR_METRICS_SYNC_NOCO_PROJECT_ID}/records`;

  if (process.env.EGR_METRICS_SYNC_DRY_RUN) {
    // eslint-disable-next-line no-console
    return new Promise(() => console.log("Request skipped in dry run."));
  } else {
    return fetch(url, {
      body: JSON.stringify(object),
      method: "POST",
      headers: {
        "xc-token": process.env.EGR_METRICS_SYNC_NOCO_AUTHENTICATION_TOKEN,
        "Content-Type": "application/json",
      },
    });
  }
}
