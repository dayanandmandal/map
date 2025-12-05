import { Injectable } from '@angular/core';
import { Observable, from, of, mergeMap } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GeoPoint } from '../model/model';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  _currentLocation: GeoPoint | null = null;
  _ipBasedLocation: GeoPoint | null = null;

  fetchUserLocation(): Observable<GeoPoint> {
    return this.getBrowserLocation().pipe(
      catchError(() => this.getIpBasedLocation())
    );
  }

  private getBrowserLocation(): Observable<GeoPoint> {
    return from(
      new Promise<GeoPoint>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported by this browser.'));
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            this._currentLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
            };
            resolve(this._currentLocation);
          },
          (error) => {
            reject(new Error(`Geolocation error: ${error.message}`));
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      })
    );
  }

  private getIpBasedLocation(): Observable<GeoPoint> {
    return from(
      fetch('https://ipapi.co/json/').then((response) => response.json())
    ).pipe(
      map((data: any) => {
        this._ipBasedLocation = {
          latitude: data.latitude,
          longitude: data.longitude,
          accuracy: null,
        };
        return this._ipBasedLocation;
      }),
      catchError(() => of(this.defaultLocation))
    );
  }

  public get defaultLocation(): GeoPoint {
    return {
      latitude: 20.5937,
      longitude: 78.9629,
      accuracy: null,
    };
  }

  public get currentLocation(): GeoPoint | null {
    return this._currentLocation;
  }

  public get ipLocation(): GeoPoint | null {
    return this._ipBasedLocation;
  }

  isCurrentLocation(location: GeoPoint): boolean {
    return location === this._currentLocation;
  }
}
