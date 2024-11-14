export type TagManagerResponse = {
  [date: string]: TagManagerResponseObject[] | null;
};

type TagManagerResponseObject = {
  label: string;
  nb_uniq_visitors: number;
  nb_visits: number;
  nb_events: number;
  nb_events_with_value: number;
  sum_event_value: number;
  min_event_value: number;
  max_event_value: number;
  avg_event_value: number;
  idsubdatatable: number;
  segment: string;
  subtable: {
    label: string;
    nb_uniq_visitors: number;
    nb_visits: number | string;
    nb_events: number | string;
    nb_events_with_value: number | string;
    sum_event_value: number;
    min_event_value: number;
    max_event_value: number;
    avg_event_value: number;
  }[];
};
