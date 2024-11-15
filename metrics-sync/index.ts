import matomo from "./matomo/matomo-api";
import noco from "./noco/noco-api";

import {
  getFieldInActions,
  getFieldInSubtable,
} from "./matomo/matomo-field-accessors";

const date = process.argv.slice(2)[0];

if (!date) {
  throw new Error(`Please run the script with an iso date as first argument.`);
}

if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
  throw new Error(`Expected date to be in format YYYY-MM-DD but was ${date}`);
}

const metadata = await matomo.fetchMetadata(date);
const eventActions = await matomo.fetchEventActions(date);

const elterngeldTableRequest = noco.createElterngeldTableRecord({
  Datum: date,

  Partnerschaftlichkeit: getFieldInActions({
    actions: eventActions,
    actionLabel: "Partnerschaftlichkeit",
    accessor: (a) => Math.round(a.avg_event_value * 100),
    default: 0,
  }),
  AnzahlFeedbackHilfreich: getFieldInSubtable({
    actions: eventActions,
    actionLabel: "Feedback",
    subtableLabel: "Hilfreich",
    accessor: (a) => a.nb_uniq_visitors,
    default: 0,
  }),
  AnzahlFeedbackNichtHilfreich: getFieldInSubtable({
    actions: eventActions,
    actionLabel: "Feedback",
    subtableLabel: "Nicht hilfreich",
    accessor: (a) => a.nb_uniq_visitors,
    default: 0,
  }),

  EindeutigeBesucherinnen: metadata.nb_uniq_visitors,
});

const elterngeldFunnelTableRequests = eventActions
  .filter((entry) => entry.label === "Fortschritt - Funnel")
  .flatMap((entry) => entry.subtable)
  .map((entry, index) =>
    noco.createElterngeldFunnelTableRecord({
      Datum: date,
      Step: index + 1,
      Value: entry.nb_uniq_visitors,
    }),
  );

await Promise.all([elterngeldTableRequest, ...elterngeldFunnelTableRequests]);
