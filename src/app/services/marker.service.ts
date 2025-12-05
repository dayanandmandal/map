import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { GeoPoint } from '../model/model';

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  constructor() {}

  public addMarker(map: L.Map, position: GeoPoint, title: string) {
    title = title || 'Selected Location';
    L.marker([position.latitude, position.longitude])
      .addTo(map)
      .bindPopup(title)
      .openPopup();
  }
}
