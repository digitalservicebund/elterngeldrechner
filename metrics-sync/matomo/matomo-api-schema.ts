export type Subtable = {
  label: string;
  nb_uniq_visitors: number;
  nb_visits: number | string;
  nb_events: number | string;
  nb_events_with_value: number | string;
  sum_event_value: number;
  min_event_value: number;
  max_event_value: number;
  avg_event_value: number;
};

export type Action = {
  label: string;
  nb_uniq_visitors: number;
  nb_visits: string | number;
  nb_events: string | number;
  nb_events_with_value: string | number;
  sum_event_value: number;
  min_event_value: number;
  max_event_value: number;
  avg_event_value: number;
  idsubdatatable: number;
  segment: string;
  subtable: Subtable[] | null;
};

export type EventModuleMethod = "Events.getAction";

export type MetadataModuleMethod = "API.get";

export type Method = MetadataModuleMethod | EventModuleMethod;
