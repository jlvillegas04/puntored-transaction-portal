/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE: string;
  readonly VITE_USERNAME: string;
  readonly VITE_COMMERCE: string;
  readonly VITE_POINT_OF_SALE: string;
  readonly VITE_CITY_CODE: string;
  readonly VITE_DEFAULT_LATITUDE: string;
  readonly VITE_DEFAULT_LONGITUDE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}