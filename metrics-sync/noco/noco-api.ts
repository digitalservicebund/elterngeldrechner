async function createElterngeldrechnerEventRecord(object: unknown) {
  await createTableRecord("mgrckhcpehp9sih", object);
}

async function createElterngeldrechnerMetadataRecord(object: unknown) {
  await createTableRecord("mwp01ckwe69i1fg", object);
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
  createElterngeldrechnerEventRecord,
  createElterngeldrechnerMetadataRecord,
};
