export interface WatchProviderResponse {
  id: number;
  results: {
    IN: CountryWatchProviders;
  };
}

export interface CountryWatchProviders {
  link?: string;
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
  free?: WatchProvider[];
  ads?: WatchProvider[];
}

export interface WatchProvider {
  provider_id?: number;
  provider_name: string;
  logo_path?: string;
  display_priority?: number;
}
