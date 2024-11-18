async function createTableRecord(object: unknown) {
  const { config } = await import("../env");

  const url = `https://${config.noco.domain}:${config.noco.port}/api/v2/tables/mgrckhcpehp9sih/records`;

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

export default { createTableRecord };
