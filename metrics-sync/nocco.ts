import { ElterngeldTableSchema } from "./nocco-schema";

import config from "./env";

export async function createTableRecord(object: ElterngeldTableSchema) {
  const url = `https://${config.noco.domain}:${config.noco.port}/api/v2/tables/${config.noco.projectId}/records`;

  return fetch(url, {
    body: JSON.stringify(object),
    method: "POST",
    headers: {
      "xc-token": config.noco.authenticationToken,
      "Content-Type": "application/json",
    },
  });
}
