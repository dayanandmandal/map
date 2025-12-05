export interface OrsPlace {
  name: string;
  label: string;
  country?: string;
  region?: string;
  city?: string;
  postcode?: string;
  coordinates: [number, number];
}

export interface GeoPoint {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
}

export interface MapQueryParams {
  latitude: string;
  longitude: string;
  zoom: string;
}

export interface MapState {
  latitude: number;
  longitude: number;
  zoom: string;
}

export type MapModel = L.Map | null;
