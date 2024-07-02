export namespace Logger {
  export function log(message?: unknown) {
    const loggerEnabled = import.meta.env.VITE_APP_CALCULATIONS_LOGGER_ENABLED;
    if (loggerEnabled === "true") {
      console.log(message);
    }
  }
}
