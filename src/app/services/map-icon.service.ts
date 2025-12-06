import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root',
})
export class MapIconService {
  private readonly _currentLocationIcon: L.Icon = L.icon({
    iconUrl: 'assets/icons/current-location.svg', // Update this path
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });

  get currentLocationIcon(): L.Icon {
    return this._currentLocationIcon;
  }
}
