/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AWS_REGION: string;
  readonly VITE_COGNITO_USER_POOL_ID: string;
  readonly VITE_COGNITO_CLIENT_ID: string;
  readonly VITE_APPSYNC_GRAPHQL_ENDPOINT: string;
  readonly VITE_APPSYNC_API_KEY: string;
  readonly VITE_LOCATION_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'maplibre-gl/dist/maplibre-gl.css';