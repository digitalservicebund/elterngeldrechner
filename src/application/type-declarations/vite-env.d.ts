/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_USER_TRACKING_TAG_MANAGER_SOURCE: string;

  readonly VITE_APP_PRELOAD_STATE: string;

  readonly VITE_FEATURE_FLAG_POSTHOG: string;
  readonly VITE_FEATURE_FLAG_ABFRAGETEIL_V2: string;
  readonly VITE_FEATURE_FLAG_FAMILIENPORTAL_ASSET_STORAGE: string;

  readonly VITE_PUBLIC_POSTHOG_PROJECT_TOKEN: string;
  readonly VITE_PUBLIC_POSTHOG_HOST: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
