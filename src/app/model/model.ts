export interface OrsPlace {
  name: string;
  label: string;
  country?: string;
  region?: string;
  city?: string;
  postcode?: string;
  coordinates: [number, number];
}
