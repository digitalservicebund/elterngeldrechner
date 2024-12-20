/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_USER_TRACKING_TAG_MANAGER_SOURCE: string;
  readonly VITE_APP_PRELOAD_STATE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
