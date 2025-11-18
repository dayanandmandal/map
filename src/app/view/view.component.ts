import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';
import { UserLocatorComponent } from '../user-locator/user-locator.component';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'map-view',
  standalone: true,
  imports: [UserLocatorComponent, SearchComponent],
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss',
})
export class ViewComponent implements AfterViewInit {
  map: L.Map | undefined;

  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap(): void {
    navigator.geolocation.getCurrentPosition(
      (position) => this.initMapWithCurrentPosition(position),
      () => this.initializeMapFallback()
    );
  }

  initMapWithCurrentPosition(position: GeolocationPosition) {
    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;
    const zoomLevel = 16;

    this.map = L.map('map-container', { zoomControl: false }).setView(
      [userLat, userLng],
      zoomLevel
    );

    // Add the Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    L.control.zoom({ position: 'bottomright' }).addTo(this.map);

    // Optional: Add a marker for the current location
    L.marker([userLat, userLng])
      .addTo(this.map)
      .bindPopup('You Are Here!')
      .openPopup();
  }

  private initializeMapFallback(): void {
    // Fallback: Initialize map to a default location: center of India
    const defaultLat = 20.5937;
    const defaultLng = 78.9629;
    this.map = L.map('map-container', { zoomControl: false }).setView(
      [defaultLat, defaultLng],
      5
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    L.control.zoom({ position: 'bottomright' }).addTo(this.map);
  }
}
