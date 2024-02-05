export namespace Logger {
  export function log(message?: any) {
    const loggerEnabled = process.env.REACT_APP_CALCULATIONS_LOGGER_ENABLED;
    if (loggerEnabled === "true") {
      console.log(message);
    }
  }
}
