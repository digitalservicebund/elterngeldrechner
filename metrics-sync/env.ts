function getEnvironmentVariable(key: string) {
  if (process.env[key]) {
    return process.env[key];
  } else {
    throw new Error(`Missing '${key}' environment variable`);
  }
}

const config = {
  noco: {
    domain: getEnvironmentVariable("EGR_METRICS_SYNC_NOCO_DOMAIN"),
    port: getEnvironmentVariable("EGR_METRICS_SYNC_NOCO_PORT"),
    authenticationToken: getEnvironmentVariable(
      "EGR_METRICS_SYNC_NOCO_AUTHENTICATION_TOKEN",
    ),
  },
  matomo: {
    domain: getEnvironmentVariable("EGR_METRICS_SYNC_MATOMO_DOMAIN"),
    authenticationToken: getEnvironmentVariable(
      "EGR_METRICS_SYNC_MATOMO_AUTHENTICATION_TOKEN",
    ),
  },
};

export { config };
