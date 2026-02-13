/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_USER_TRACKING_TAG_MANAGER_SOURCE: string;
  readonly VITE_APP_PRELOAD_STATE: string;
  readonly VITE_FEATURE_FLAG_ABFRAGETEIL_V2: boolean;
  readonly VITE_FEATURE_FLAG_FAMILIENPORTAL_ASSET_STORAGE: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
