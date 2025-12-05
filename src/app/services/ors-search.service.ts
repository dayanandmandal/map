import { Injectable } from '@angular/core';
import { OrsPlace } from '../model/model';

@Injectable({
  providedIn: 'root',
})
export class OrsSearchService {
  private readonly baseUrl = 'https://api.openrouteservice.org/geocode/search';
  private readonly apiKey: string = APP_CONFIG.apiKey;

  async searchPlaces(query: string, limit: number = 10): Promise<OrsPlace[]> {
    if (!query || query.length < 3) {
      return [];
    }

    const url = `${this.baseUrl}?api_key=${
      this.apiKey
    }&text=${encodeURIComponent(query)}&limit=${limit}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      return this.mapOrsResponse(data);
    } catch (error) {
      console.error('Error during ORS Geocoding search:', error);
      return [];
    }
  }

  private mapOrsResponse(data: any): OrsPlace[] {
    if (!data.features || data.features.length === 0) {
      return [];
    }

    return data.features.map((feature: any) => {
      // ORS coordinates are in [lng, lat] format
      const [lng, lat] = feature.geometry.coordinates;
      const properties = feature.properties;

      return {
        name: properties.name || 'Unknown Place',
        label: properties.label || '',
        country: properties.country,
        region: properties.region,
        city: properties.locality || properties.city,
        postcode: properties.postcode,
        latitude: lat,
        longitude: lng,
      } as OrsPlace;
    });
  }
}
