import { Injectable } from '@angular/core';
import { MapInitializerService } from './map-initializer.service';
import { MarkerService } from './marker.service';
import { GeolocationService } from './geolocation.service';
import { GeoPoint } from '../model/model';

@Injectable({
  providedIn: 'root',
})
export class MapCoreService {
  constructor(
    private initService: MapInitializerService,
    private markerService: MarkerService,
    private geolocationService: GeolocationService
  ) {}

  public initializeMap(element: HTMLElement, position: GeoPoint) {
    return this.initService.initializeMap(element, position);
  }

  public markLocation(
    map: L.Map,
    position: GeoPoint,
    title: string,
    openPopup: boolean = true
  ): L.Marker {
    return this.markerService.addMarker(map, position, title, openPopup);
  }

  public fetchUserLocation() {
    return this.geolocationService.fetchUserLocation();
  }

  isCurrentLocation(location: GeoPoint): boolean {
    return this.geolocationService.isCurrentLocation(location);
  }

  getMapInstance$() {
    return this.initService.map$;
  }
}
