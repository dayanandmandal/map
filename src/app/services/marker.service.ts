import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { GeoPoint } from '../model/model';

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  constructor() {}

  public addMarker(map: L.Map, position: GeoPoint, title: string): L.Marker {
    title = title || 'Selected Location';

    const markerLayer = L.marker([position.latitude, position.longitude]);
    markerLayer.addTo(map).bindPopup(title).openPopup();

    return markerLayer;
  }
}
