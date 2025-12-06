import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { GeoPoint } from '../model/model';

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  constructor() {}

  public addMarker(
    map: L.Map,
    position: GeoPoint,
    title: string,
    openPopup: boolean = true
  ): L.Marker {
    title = title || 'Selected Location';

    const markerLayer = L.marker([position.latitude, position.longitude]);
    const popup = markerLayer.addTo(map).bindPopup(title);
    if (openPopup) popup.openPopup();

    return markerLayer;
  }
}
