/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_BMF_STEUER_RECHNER_DOMAIN: string;
  readonly VITE_APP_BMF_STEUER_RECHNER_CODE: string;
  readonly VITE_APP_BMF_STEUER_RECHNER_AVAILABLE_YEARS_REMOTE: string;
  readonly VITE_APP_BMF_STEUER_RECHNER_AVAILABLE_YEARS_LIB: string;
  readonly VITE_APP_USER_TRACKING_TAG_MANAGER_SOURCE: string;
  readonly VITE_APP_PRELOAD_STATE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
