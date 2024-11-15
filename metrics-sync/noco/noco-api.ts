async function createElterngeldTableRecord(object: unknown) {
  await createTableRecord("me0csf0c2app6z7", object);
}

async function createElterngeldFunnelTableRecord(object: unknown) {
  await createTableRecord("mxmu0a3adzlifsh", object);
}

async function createTableRecord(tableId: string, object: unknown) {
  const { config } = await import("../env");

  const url = `https://${config.noco.domain}:${config.noco.port}/api/v2/tables/${tableId}/records`;

  const response = await fetch(url, {
    body: JSON.stringify(object),
    method: "POST",
    headers: {
      "xc-token": config.noco.authenticationToken,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw Error(
      `Request to NocoDB failed. Code: ${response.status} Error ${response.statusText}`,
    );
  }
}

export default {
  createElterngeldTableRecord,
  createElterngeldFunnelTableRecord,
};
