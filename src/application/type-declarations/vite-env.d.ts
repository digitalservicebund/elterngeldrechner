/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_USER_TRACKING_TAG_MANAGER_SOURCE: string;

  readonly VITE_FEATURE_FLAG_POSTHOG_TESTING: string;

  readonly VITE_BUILD_VERSION: string;
  readonly VITE_PUBLIC_POSTHOG_PROJECT_TOKEN: string;
  readonly VITE_PUBLIC_POSTHOG_HOST: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
