export type Method =
  | "Events.getAction"
  | "Actions.getPageTitles"
  | "Actions.getPageUrls";

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
  idsubdatatable?: number;
  segment: string;
  subtable?: Subtable[];
};

export type Page = {
  label: string;
  nb_visits: number;
  nb_uniq_visitors: number;
  nb_hits: number;
  sum_time_spent: number;
  nb_hits_following_search: string;
  nb_hits_with_time_network: string;
  min_time_network: string;
  max_time_network: string;
  nb_hits_with_time_server: string;
  min_time_server: string;
  max_time_server: string;
  nb_hits_with_time_transfer: string;
  min_time_transfer: string;
  max_time_transfer: string;
  nb_hits_with_time_dom_processing: string;
  min_time_dom_processing: string;
  max_time_dom_processing: string;
  nb_hits_with_time_dom_completion: string;
  min_time_dom_completion: string;
  max_time_dom_completion: string;
  nb_hits_with_time_on_load: string;
  min_time_on_load: string;
  max_time_on_load: string;
  entry_nb_uniq_visitors: number;
  entry_nb_visits: string;
  entry_nb_actions: string;
  entry_sum_visit_length: string;
  entry_bounce_count: string;
  exit_nb_uniq_visitors: number;
  exit_nb_visits: string;
  avg_time_network: string;
  avg_time_server: string;
  avg_time_transfer: string;
  avg_time_dom_processing: string;
  avg_time_dom_completion: string;
  avg_time_on_load: string;
  avg_page_load_time: string;
  avg_time_on_page: string;
  bounce_rate: string;
  exit_rate: string;
  segment: string;
};

export interface Url {
  label: string;
  nb_visits: number;
  nb_hits: number;
  sum_time_spent: number;
  min_time_network?: string;
  max_time_network?: string;
  min_time_server?: string;
  max_time_server?: string;
  min_time_transfer?: string;
  max_time_transfer?: string;
  min_time_dom_processing?: string;
  max_time_dom_processing?: string;
  min_time_dom_completion?: string;
  max_time_dom_completion?: string;
  min_time_on_load?: string;
  max_time_on_load?: string;
  avg_time_network: string;
  avg_time_server: string;
  avg_time_transfer: string;
  avg_time_dom_processing: string;
  avg_time_dom_completion: string;
  avg_time_on_load: string;
  avg_page_load_time: string;
  avg_time_on_page: string;
  bounce_rate: string;
  exit_rate: string;
  idsubdatatable?: number;
  segment?: string;
  nb_uniq_visitors?: number;
  entry_nb_uniq_visitors?: number;
  exit_nb_uniq_visitors?: number;
  url?: string;
  subtable?: Url[];
}
