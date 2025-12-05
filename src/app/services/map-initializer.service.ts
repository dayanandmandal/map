import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { GeoPoint, MapModel } from '../model/model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapInitializerService {
  _mapInstance: MapModel = null;

  mapSubject = new BehaviorSubject<MapModel>(null);
  map$ = this.mapSubject.asObservable();

  constructor() {}

  get mapInstance(): MapModel {
    return this._mapInstance;
  }

  set mapInstance(value: MapModel) {
    this._mapInstance = value;
    this.mapSubject.next(value);
  }

  initializeMap(element: HTMLElement, position: GeoPoint): Observable<MapModel> {
    // initialize only once
    if (this.mapInstance) {
      this.mapSubject.next(this.mapInstance);
      return this.map$;
    };

    return this.initMapWithCurrentPosition(element, position);
  }

  initMapWithCurrentPosition(element: HTMLElement, position: GeoPoint): Observable<MapModel> {
    const userLat = position.latitude;
    const userLng = position.longitude;
    const zoomLevel = 16;

    this.mapInstance = L.map(element, { zoomControl: false }).setView(
      [userLat, userLng],
      zoomLevel
    );

    // Add the Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.mapInstance);

    L.control.zoom({ position: 'bottomright' }).addTo(this.mapInstance);

    return this.map$;
  }
}
